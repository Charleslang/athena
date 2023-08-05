# Redisson

:::tip
[Redisson 官网](https://redisson.org/)  
[GitHub](https://github.com/redisson/redisson)
:::

Redisson 是一个在 Redis 基础上实现的 Java 驻内存数据网格（In-Memory Data Grid）。它不仅提供了一系列的分布式的 Java 常用对象，还提供了许多分布式服务。例如 Set、Multimap、SortedSet、Map、List、Queue、Deque、Semaphore、Lock、AtomicLong、Map Reduce、Publish / Subscribe、Bloom filter、Spring Cache、Tomcat、Scheduler、JCache API、Hibernate、MyBatis、RPC，本地缓存等。其中就包含了各种分布式锁的实现。

**快速开始**

- `pom.xml`

```xml
<!-- 虽然 redissson 提供了 springboot 的 starter, 但是还是建议使用原生的 redisson 依赖 -->
<!-- 引入 redisson-spring-boot-starter 后，可能会和 spring-boot-starter-data-redis 在配置上造成冲突 -->
<dependency>
   <groupId>org.redisson</groupId>
   <artifactId>redisson</artifactId>
   <version>3.23.0</version>
</dependency>  
```

- `RedissonConfig.java`

```java
@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonSingle() {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://localhost:6379").setPassword("123456");
        return Redisson.create(config);
    }
}
```

还是以[一人一单](./prod-purchase-limit.md)的例子来说，我们使用 Redisson 来实现分布式锁。改进后的代码如下：

- `CouponOrderServiceImpl.java`

```java{17,42,43,44,53}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private RedissonClient redissonClient;

    @Override
    public long addCouponOrder(int userId, long couponId) throws Exception {
        // 查询优惠券
        Coupon coupon = couponService.findById(couponId);
        // 判断优惠券是否存在
        if (Objects.isNull(coupon)) {
            throw new Exception("优惠券不存在");
        }
        LocalDateTime now = LocalDateTime.now();
        // 判断是否到达优惠券的开始抢购时间
        if (now.isBefore(coupon.getBeginTime())) {
            throw new Exception("优惠券还未开始抢购");
        }
        // 判断是否优惠券是否已经抢购结束
        if (now.isAfter(coupon.getEndTime())) {
            throw new Exception("优惠券已经抢购结束");
        }
        // 判断优惠券是否已经抢购完
        Integer stock = coupon.getStock();
        if (stock < 1) {
            throw new Exception("优惠券已经抢购完");
        }

        // 获取锁, Redis 的 key 就是 getLock 方法的参数
        RLock redissonClientLock = redissonClient.getLock("userId:" + userId);
        boolean tryLock = redissonClientLock.tryLock();
        if (!tryLock) {
            throw new AppBizException("不允许重复抢购");
        }
        try {
            CouponOrderService couponOrderService = (CouponOrderService) AopContext.currentProxy();
            return couponOrderService.createOrder(userId, couponId);
        } finally {
            // 释放锁
            redissonClientLock.unlock();
        }
    }
}
```

可以看到，我们只需要修改获取锁和释放锁的代码即可，使用起来非常方便。

可能你会好奇，我们在获取锁的时候，只传入了 key，那么 Redis 中最终存储的 value 是啥呢？我们可以通过 Redis 的客户端来查看一下，如下图所示：

![Redisson-value](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-15/Redisson-value.png)

有几个值得注意的点，分别是 key 的类型，value 的值。我们可以看到，Redisson 获取的锁对象，在 Redis 中对应的类型是 HASH，为什么会这样呢，其实这是为了实现锁的可重入性。

在[分布式锁](./prod-distributed-lock.md)中，我们提到了如何实现一个简单的分布式锁，当时，我们的设计是这样的，如下图所示：

![分布式锁流程](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-15/分布式锁流程.png)

但是呢，这样会有一个问题，结合下面这段代码来说一下：

```java
@Test 
void method1() {
    boolean isLock = lock.tryLock("user:1");
    if (!isLock) {
        log.error("获取锁失败，1");
        return;
    }
    try {
        log.info("获取锁成功，1");
        method2();
    } finally {
        log.info("释放锁，1");
        lock.unlock();
    }
}

void method2() {
    boolean isLock = lock.tryLock("user:1");
    if (!isLock) {
        log.error("获取锁失败, 2");
        return;
    }
    try {
        log.info("获取锁成功，2");
    } finally {
        log.info("释放锁，2");
        lock.unlock();
    }
}
```

在上面这段代码中，`method1` 方法中先尝试获取锁，不出意外，可以获取成功。`method1` 方法中又调用了 `method2`，因此，代码会进入 `method2` 中，而 `method2` 方法中又尝试获取锁，但是呢，由于我们是使用 `SETNX` 命令获取锁，所以，`method2` 方法中获取锁肯定失败，所以，`method2` 方法中的代码会直接返回，而不会执行 `method2` 方法中的代码。显然，这样不合理，因为从业务层面来讲，`method1` 方法中调用 `method2` 方法就是为了希望能够执行 `method2` 方法中的代码，但是，由于 `method2` 方法中获取锁失败，所以，`method2` 方法中的代码就不会执行了，这样就不合理了。在这种情况下，我们就说，该锁是不可重入的。

什么是可重入呢？在同一个线程中，如果一个方法获取了锁，那么该线程中的其他方法也可以获取该锁，这样的锁就是可重入的。而 Redisson 的锁就是可重入的。接下来，我们来聊一聊如何实现一个可重入的分布式锁。

实现可重入锁的关键在于，同一个线程中的其他方法也可以获取该锁。基本思路为，使用 HASH 结构来存储锁（而不是 String），HASH 的 key 为锁的名称，HASH 的 field 为锁的持有者（线程 ID），HASH 的 field 对应的 value 为持有者获取锁的次数。在获取锁时，先判断 key 是否存在，如果 key 不存在，则获取锁成功；如果 key 存在，则还需要再次判断当前锁的持有者是不是当前线程，如果是，则把 Redis 中的值自增，如果不是，则获取锁失败。释放锁时，先判断 key 是否存在，如果 key 不存在，则释放锁成功（如果 key 不存在，则认为 key 过期了）；如果 key 存在，则还需要再次判断当前锁的持有者是不是当前线程，如果是，则把 Redis 中的值自减，如果不是，则释放锁失败，当 Redis 中的值为 0 时，表示锁已经被释放了，此时，需要删除该 key。如下图所示：

![分布式锁-可重入](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-15/分布式锁-可重入.png)

:::warning 注意
由于在获取锁和释放锁时，需要保证原子性，因此，我们需要使用 Lua 脚本来实现。
:::

好了，大概原理我们已经知道了，那么我们来看看 Redisson 中是如何利用 Lua 脚本来实现可重入锁的。

通过调试 `org.redisson.RedissonLock#tryLock()` 这个方法，我们会发现，Redisson 在获取锁时，使用的 Lua 脚本如下：

```lua
-- 如果不存在该 key，则设置该 key 的值为 1，并设置过期时间，返回 nil
-- 如果存在该 key，则判断该 key 的值是否为当前线程，如果是，则将该 key 的值自增 1，并设置过期时间，返回 nil
if ((redis.call('exists', KEYS[1]) == 0) or (redis.call('hexists', KEYS[1], ARGV[2]) == 1)) then 
  redis.call('hincrby', KEYS[1], ARGV[2], 1);
  redis.call('pexpire', KEYS[1], ARGV[1]);
  return nil;
end;
-- 如果该 key 的值不是当前线程，则返回该 key 的剩余过期时间
-- 与 TTL 类似， PTTL 返回设 key 的剩余过期时间，唯一的区别是 TTL 以秒为单位返回剩余时间，而 PTTL 以毫秒为单位返回
return redis.call('pttl', KEYS[1]);
```

解锁时，使用的 Lua 脚本如下：

```lua
-- 如果不存在该 key，则返回 nil
if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then 
  return nil;
end;
-- 如果存在该 key，则将该 key 的值自减 1
local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1);
-- 如果该 key 的值大于 0，则重置该 key 的过期时间，返回 0
if (counter > 0) then 
  redis.call('pexpire', KEYS[1], ARGV[2]);
  return 0;
else -- 如果该 key 的值小于等于 0，则删除该 key，返回 1
  redis.call('del', KEYS[1]);
  -- 释放锁成功后，发布一条消息，通知其他线程(此处可以先忽略这段代码, 后面我们再讲解)
  redis.call(ARGV[4], KEYS[2], ARGV[1]);
  return 1;
return nil;
···

好了，上面就是 Redisson 如何实现可重入锁的原理了以及相关核心代码。不知道你还有没有一个问题，那就是，HASH 的 field 字段是什么？其实就是 `UUID:线程ID`。


