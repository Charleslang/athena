# 缓存击穿

缓存击穿问题也叫热点 Key 问题，就是一个被高并发访问并且缓存重建业务较复杂的 key 突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击。简单来讲，就是一个热点 key 在失效的瞬间，大量的请求访问数据库，导致数据库瞬间压力过大，甚至宕机。

**常见的解决办法有如下几种：**

1. 缓存过期时间设置大一点，或者缓存永不过期
2. 互斥锁
3. 逻辑过期

对于第一种解决办法，缓存过期时间设置大一点，或者缓存永不过期，这种方法虽然简单，但是可能会导致缓存数据不是最新的，如果你的业务可以接受这种情况，那么这种方法是最简单的。

互斥锁。当缓存过期时，如果有大量请求来访问这个 key，这时，我们只让其中一个线程去构建缓存，其它线程都需要等待这个线程构建完缓存后，再去访问缓存。这种方法可以有效的避免缓存击穿问题，但是会导致请求的响应时间变长。下面互斥锁的代码实现：

```java
@Service
public class ShopServiceImpl implements ShopService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Shop findById(int id) throws JsonProcessingException, InterruptedException {
        String cacheKey = getCacheKey(id);
        ObjectMapper objectMapper = new ObjectMapper();
        Shop shop;
        String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
        if (StringUtils.hasLength(jsonStr)) {
            shop = objectMapper.readValue(jsonStr, Shop.class);
            return shop;
        }
        String lockKey = getLockKey(id);
        try {
            // 如果没有命中缓存，则让一个线程去重建缓存
            boolean lock = tryLock(lockKey);
            // 如果没有获取到锁, 则递归，再次尝试从缓存中获取数据
            if (!lock) {
                TimeUnit.MILLISECONDS.sleep(10);
                return findById(id);
            }
            // 模拟从数据库中查询
            System.out.println("开始重建缓存");
            TimeUnit.MILLISECONDS.sleep(500);
            shop = new Shop(id, "茶百道", "成都市锦江区");
            if (Objects.isNull(shop)) {
                throw new AppBizException("商铺不存在");
            }
            // 将查询结果写入缓存
            stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(shop), KeyConstants.REDIS_SHOP_KEY_TTL, TimeUnit.MINUTES);
            System.out.println("重建缓存成功");
        } catch (InterruptedException e) {
            throw e;
        } finally {
            unlock(lockKey);
        }
        return shop;
    }

    private boolean tryLock(String key) {
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 120, TimeUnit.SECONDS);
        return Objects.nonNull(success) && success;
    }

    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }

    private String getLockKey(int shopId) {
        return "mutex:" + getCacheKey(shopId);
    }

    private String getCacheKey(int shopId) {
        return KeyConstants.REDIS_SHOP_KEY_PREFIX + shopId;
    }
}
```
然后，清空缓存，使用 JMeter 进行压测，如下：

![20230622171752](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622171752.png)

![20230622171828](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622171828.png)

从压测报告可以发现，吞吐量可以达到 200。那么，总共访问了几次数据库呢？如下：

![20230622171930](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622171930.png)

显然，只访问了一次数据库。

但是呢，上面这段代码有点问题。在获取锁失败时，使用了递归调用 findById 方法来重试从缓存获取数据。递归的使用可能会导致栈溢出的问题，特别是在并发环境下。我们可以考虑使用循环而不是递归来进行重试。以下是使用循环来代替递归的代码：

```java
public Shop findById(int id) throws JsonProcessingException, InterruptedException {
    // 先从缓存中获取数据
    Shop shop = getFromCache(id);
    if (Objects.nonNull(shop)) {
        return shop;
    }
    String lockKey = getLockKey(id);
    try {
        // 如果没有命中缓存，则让一个线程去重建缓存, 其余线程继续尝试获取缓存中的数据
        while (!tryLock(lockKey)) {
            TimeUnit.MILLISECONDS.sleep(10);
            shop = getFromCache(id);
            if (Objects.nonNull(shop)) {
                return shop;
            }
        }
        // 拿到锁之后，再次尝试从缓存中获取数据
        shop = getFromCache(id);
        if (Objects.nonNull(shop)) {
            return shop;
        }
        // 模拟从数据库中查询
        System.out.println("开始重建缓存");
        TimeUnit.MILLISECONDS.sleep(500);
        shop = new Shop(id, "茶百道", "成都市锦江区");
        if (Objects.isNull(shop)) {
            throw new AppBizException("商铺不存在");
        }
        // 将查询结果写入缓存
        stringRedisTemplate.opsForValue().set(getCacheKey(id), new ObjectMapper().writeValueAsString(shop), KeyConstants.REDIS_SHOP_KEY_TTL, TimeUnit.MINUTES);
        System.out.println("重建缓存成功");
    } catch (InterruptedException e) {
        throw e;
    } finally {
        unlock(lockKey);
    }
    return shop;
}

private Shop getFromCache(int shopId) throws JsonProcessingException {
    String cacheKey = getCacheKey(shopId);
    ObjectMapper objectMapper = new ObjectMapper();
    String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
    if (StringUtils.hasLength(jsonStr)) {
        Shop shop = objectMapper.readValue(jsonStr, Shop.class);
        return shop;
    }
    return null;
}
```

逻辑过期。所谓逻辑过期，就是把数据放入缓存时，不设置缓存的过期时间，并且，在存入缓存的字段中额外加上一个标识用于判断缓存是否过期，例如 `{"id": 1, "expire": 1687421979907}`，当从缓存中获取到该值时，拿当前时间和 `expire` 字段进行比较，判断缓存是否过期，如果缓存过期，我们也不去访问数据库，而是异步（或者同步）构建缓存，然后直接返回缓存中的旧数据（如果是同步构建缓存的话，就返回最新的数据），当然，在我们重新构建缓存时，我们需要加互斥锁，确保只能有一个线程去更新缓存。这种方法可以有效的避免缓存击穿问题，而且不会导致请求的响应时间变长，但是可能会导致缓存数据不是最新的。下面是逻辑过期的代码实现：

- `Test.java`

```java
@Test
void test7() throws JsonProcessingException {
    // 先预热缓存
    Shop latestShop = new Shop(1, "茶百道", "成都市锦江区");
    RedisData latestRedisData = new RedisData();
    latestRedisData.setData(latestShop);
    // 设置逻辑过期时间为 10 秒
    latestRedisData.setExpire(System.currentTimeMillis() + TimeUnit.SECONDS.toMillis(10));
    ObjectMapper objectMapper = new ObjectMapper();
    stringRedisTemplate.opsForValue().set("shop:1", objectMapper.writeValueAsString(latestRedisData));
}
```

- `ShopServiceImpl.java`

```java
public class ShopServiceImpl implements ShopService {
    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    @Override
    public Shop findById(int id) throws JsonProcessingException, InterruptedException {
        String cacheKey = getCacheKey(id);
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
        if (!StringUtils.hasLength(jsonStr)) {
            return null;
        }
        RedisData redisData = objectMapper.readValue(jsonStr, RedisData.class);
        Shop shop = objectMapper.readValue(objectMapper.writeValueAsString(redisData.getData()), Shop.class);
        long expire = redisData.getExpire();
        // 如果 expire 在当前时间之后，则说明缓存有效
        if (expire > System.currentTimeMillis()) {
            return shop;
        }
        // 如果过期, 则重建缓存
        String lockKey = getLockKey(id);
        if (tryLock(lockKey)) {
            // 如果获取锁成功, 则开启一个独立线程去重建缓存
            CACHE_REBUILD_EXECUTOR.submit(() -> {
                System.out.println("开始重建缓存");
                try {
                    // 模拟从数据库中查询
                    TimeUnit.MILLISECONDS.sleep(200);
                    Shop latestShop = new Shop(id, "蜜雪冰城", "成都市锦江区");
                    if (Objects.isNull(latestShop)) {
                        throw new AppBizException("商铺不存在");
                    }
                    // 将查询结果写入缓存, 永久有效
                    RedisData latestRedisData = new RedisData();
                    latestRedisData.setData(latestShop);
                    latestRedisData.setExpire(System.currentTimeMillis() + TimeUnit.SECONDS.toMillis(KeyConstants.REDIS_SHOP_KEY_TTL));
                    stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(latestRedisData));
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("重建缓存失败");
                } finally {
                    unlock(lockKey);
                }
                System.out.println("重建缓存成功");
            });
        }
        return shop;
    }

    private boolean tryLock(String key) {
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 120, TimeUnit.SECONDS);
        return Objects.nonNull(success) && success;
    }

    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }

    private String getLockKey(int shopId) {
        return "mutex:" + getCacheKey(shopId);
    }

    private String getCacheKey(int shopId) {
        return KeyConstants.REDIS_SHOP_KEY_PREFIX + shopId;
    }
}    
```

然后使用 JMeter 进行压测，看看高并发下是否只会重建一次缓存，如下：

![20230622224042](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622224042.png)

对比下面两张图可以发现，结果是符合预期的：

- 旧值

  ![20230622224157](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622224157.png)

- 新值

  ![20230622224219](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622224219.png)

再来看看是否只重建了一次缓存：

![20230622224301](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-22/20230622224301.png)


互斥锁和逻辑过期的对比如下：

互斥锁|逻辑过期
---|---
优点：没有额外的内存消耗；保证一致性；实现简单<br/>缺点：线程需要等待，性能受影响；可能有死锁风险|优点：线程无需等待，性能较好<br/>缺点：不保证一致性；有额外内存消耗；实现复杂


这里，我们可以将上面的方法封装成一个通用的方法，如下：

- `CacheUtils.java`

```java
@Component
public class CacheUtils {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    public void set(String key, Object value, long timeout, TimeUnit timeUnit) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(value), timeout, timeUnit);
    }

    public void setWithLogicTTL(String key, Object value, long timeout, TimeUnit timeUnit) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpire(System.currentTimeMillis() + timeUnit.toMillis(timeout));
        stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(redisData));
    }

    /**
     * 缓存穿透
     */
    public <T extends BaseEntity, ID> T queryWithCachePenetration(String prefix, ID id, Class<T> clazz,
                                                              long nilKeyTTL, TimeUnit nilTimeUnit,
                                                              long keyTTL, TimeUnit timeUnit,
                                                              Function<ID, T> callback) throws JsonProcessingException {
        String cacheKey = prefix + id;
        ObjectMapper objectMapper = new ObjectMapper();
        T result;
        String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
        if (StringUtils.hasLength(jsonStr)) {
            result = objectMapper.readValue(jsonStr, clazz);
            if (result.getId() <= 0) {
                return null;
            }
            return result;
        }
        result = callback.apply(id);
        if (Objects.isNull(result)) {
            stringRedisTemplate.opsForValue().set(cacheKey, "{}", nilKeyTTL, nilTimeUnit);
            return null;
        }
        // 将查询结果写入缓存
        this.set(cacheKey, result, keyTTL, timeUnit);
        return result;
    }
}
```
- `ShopServiceImpl.java`

```java
@Service
public class ShopServiceImpl implements ShopService {

    @Resource
    private CacheUtils cacheUtils;

    @Override
    public Shop findById(int id) throws JsonProcessingException {
        return cacheUtils.queryWithCachePenetration(KeyConstants.REDIS_SHOP_KEY_PREFIX, id, Shop.class,
                KeyConstants.REDIS_NIL_KEY_TTL, TimeUnit.MINUTES,
                KeyConstants.REDIS_SHOP_KEY_TTL, TimeUnit.MINUTES,
                this::findByIdFromDB);
    }

    private Shop findByIdFromDB(int id) {
        // 模拟从数据库中查询
        try {
            TimeUnit.MILLISECONDS.sleep(20);
        } catch (InterruptedException e) {
            e.printStackTrace();
            System.out.println("查询数据库失败");
            return null;
        }
        Shop shop;
        if (id == 2) {
            shop = null;
        } else {
            shop = new Shop(id, "蜜雪冰城", "成都市锦江区");
        }
        return shop;
    }
}
```
