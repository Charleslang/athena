# 查询缓存

缓存就是数据交换的缓冲区（称作 Cache），是存贮数据的临时地方，一般读写性能较高。缓存的作用主要是降低后端负载，提高读写效率，降低响应时间。但是，引入缓存也会造成一些其它问题，例如数据一致性成本、代码维护成本、运维成本。

添加缓存后，我们应该按照下面的步骤来进行开发：

1. 读取缓存，如果缓存中有数据，直接返回。
2. 如果缓存中没有数据，从数据库中读取数据，然后将数据库的查询结果写入缓存，最后返回数据。

- `ShopController.java`

```java
@RestController
@RequestMapping("/shop")
@Validated
public class ShopController {

    @Resource
    private ShopService shopService;

    @GetMapping("/{id}")
    public Result queryShopById(@PathVariable @Min(value = 1, message = "商铺 ID 不合法") Integer id) throws JsonProcessingException, InterruptedException {
        Shop shop = shopService.findById(id);
        return Result.ok(shop);
    }
}
```
- `ShopServiceImpl.java`

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
        // 先从缓存获取
        String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
        // 如果缓存中有数据，直接返回
        if (StringUtils.hasLength(jsonStr)) {
            shop = objectMapper.readValue(jsonStr, Shop.class);
            return shop;
        }
        // 模拟从数据库中查询
        TimeUnit.MILLISECONDS.sleep(20);
        shop = new Shop(id, "茶百道", "成都市锦江区");
        if (Objects.isNull(shop)) {
            throw new AppBizException("商铺不存在");
        }
        // 将查询结果写入缓存
        stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(shop));
        return shop;
    }

    private String getCacheKey(int shopId) {
        return KeyConstants.REDIS_SHOP_KEY_PREFIX + shopId;
    }
}
```

上面是一个简单的例子，很明显，我们的代码中有一些问题。我们设置的缓存是永久生效的，但是商铺的信息是会变化的，例如商铺的名称、地址等信息，如果商铺的信息发生了变化，我们的缓存数据就脏了，但是我们的代码中并没有处理这种情况，这就会导致缓存中的数据和数据库中的数据不一致。接下来，我们就聊聊一个十分常见的问题，如何保证数据库和缓存的一致性。

常见的缓存更新策略有以下几种：

淘汰策略|一致性|维护成本|说明
---|---|---|---
内存淘汰|差|无|不用自己维护，利用 Redis 的内存淘汰机制，当内存不足时，会自动淘汰一些数据，下次查询时再更新缓存。
超时剔除|一般|低|设置一个超时时间，当超过这个时间后，缓存失效，下次查询时再更新缓存。
主动更新|好|高|当数据发生变化时，主动更新缓存。

适用场景：

- 低一致性：使用内存淘汰机制。
- 一般一致性：使用超时剔除机制。
- 高一致性：使用主动更新机制，外加超时剔除机制兜底。

主动更新机制的实现方式有很多种，如下：

主动更新机制|说明|缺点
---|---|---
Cache Aside Pattern|更新数据库的同时，更新缓存（推荐）
Read/Write Through Pattern|缓存与数据库整合为一个服务，由服务来维护一致性。调用者调用该服务，无需关心缓存一致性问题
Write Behind Caching Pattern|调用者只操作缓存，由其它线程异步更新数据库，保证最终一致性（缓存和数据库的数据不一致时间会比较长，如果缓存宕机，数据会丢失）

我们这里使用 Cache Aside Pattern 来实现主动更新机制，但是，我们还需要考虑以下几个问题：

1. 删除缓存还是更新缓存？

  - 更新缓存：每次更新数据库都更新缓存，无效写操作较多
  - 删除缓存：更新数据库时让缓存失效，查询时再更新缓存（推荐）

2. 如何保证缓存与数据库的操作的同时成功或失败？

  - 单体系统，将缓存与数据库操作放在一个事务
  - 分布式系统，利用 TCC 等分布式事务方案

3. 先操作缓存还是先操作数据库？

  - 先删除缓存，再操作数据库
  - 先操作数据库，再删除缓存

针对上面的第三个问题 “先操作缓存还是先操作数据库？”，我们可以分别来看看这两种方式的优缺点：

- 先删除缓存，再操作数据库

  线程 A 先删除缓存，此时线程 B 进来了，线程 B 查询缓存，发现缓存不存在，然后线程 B 从数据库中查询数据，然后将数据写入缓存，最后返回数据。此时，线程 A 操作才完成数据库的更新。理想情况下，由于线程 A 先删除了缓存，再更新数据库，按理来说缓存中不存在数据才对，但是线程 B 将旧数据写入了缓存，这样，缓存里面就是脏数据了。此种情况发生的概率较高。

- 先操作数据库，再删除缓存

  此时，缓存中的数据已过期，线程 A 进行查询，发现缓存里面没有数据，然后从数据库中查询数据，恰好这时线程 B 进来了，线程 B 开始更新数据库，更新完成后，再删除缓存，而线程 A 此时才把数据成功写入缓存，那么线程 A 写入缓存的数据就是脏的。此种情况发生的概率较低，因为一般情况下，线程 A 写缓存的速度还是很快的，Redis 的写入一般不会超过 1 ms，而线程 B 是更新数据库，数据库操作一般会比较耗时，所以，线程 A 写入缓存的速度一般会快于线程 B 更新数据库的速度。

综上，为了保证数据库和缓存的一致性，我们选择手动更新缓存，更新策略为先操作数据库，再删除缓存。

- `ShopController.java`

```java
@RestController
@RequestMapping("/shop")
@Validated
public class ShopController {

    @Resource
    private ShopService shopService;

    @GetMapping("/{id}")
    public Result queryShopById(@PathVariable @Min(value = 1, message = "商铺 ID 不合法") Integer id) throws JsonProcessingException, InterruptedException {
        Shop shop = shopService.findById(id);
        return Result.ok(shop);
    }

    @PutMapping("/{id}")
    public Result updateShop(@RequestBody Shop shop) {
        shopService.update(shop);
        return Result.ok();
    }
}
```

- `ShopServiceImpl.java`

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
        // 模拟从数据库中查询
        TimeUnit.MILLISECONDS.sleep(20);
        shop = new Shop(id, "茶百道", "成都市锦江区");
        if (Objects.isNull(shop)) {
            throw new AppBizException("商铺不存在");
        }
        // 将查询结果写入缓存, 并添加过期时间
        stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(shop), KeyConstants.REDIS_SHOP_KEY_TTL, TimeUnit.MINUTES);
        return shop;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Shop shop) {
        // 模拟更新数据库
        try {
            TimeUnit.MILLISECONDS.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 删除缓存
        String cacheKey = getCacheKey(shop.getId());
        stringRedisTemplate.delete(cacheKey);
    }

    private String getCacheKey(int shopId) {
        return KeyConstants.REDIS_SHOP_KEY_PREFIX + shopId;
    }
}
```