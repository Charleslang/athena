# 分布式锁

:::tip 提示
Redis 官方也提供了一些分布式锁的实现，见 [Distributed Locks with Redis](https://redis.io/docs/manual/patterns/distributed-locks/)。
:::

简单来讲，分布式锁就是满足分布式系统或集群模式下多进程可见并且互斥的锁。

一般情况下，分布式锁需要满足以下几个条件：

- 互斥性：任意一个时刻，锁只能被一个线程（或者进程）持有。
- 高可用：锁服务是高可用的，当一个锁服务出现问题，能够自动切换到另外一个锁服务。并且，即使客户端的释放锁的代码逻辑出现问题，锁最终一定还是会被释放，不会影响其他线程对共享资源的访问。这一般是通过超时机制实现的。
- 高性能：获取和释放锁的操作应该快速完成，并且不应该对整个系统的性能造成过大影响。

除了上面这三个基本条件之外，一个好的分布式锁还需要满足下面这些条件：

- 非阻塞：如果获取不到锁，不能无限期等待，避免对系统正常运行造成影响。
- 可重入：一个节点获取了锁之后，还可以再次获取锁。

分布式锁的核心是实现多进程之间互斥，而满足这一点的方式有很多，常见的有三种：

#|互斥|高可用|高性能|安全性
---|---|---|---|---
数据库|利用数据库本身的互斥锁机制（例如 MySQL 的行锁）|好|一般|断开连接，自动释放锁
Redis|利用 `setnx` 这样的互斥命令|好|好|利用锁超时时间，到期释放
Zookeeper|利用节点的唯一性和有序性实现互斥|好|一般|临时节点，断开连接自动释放

本文主要介绍 Redis 分布式锁的实现。

使用 Redis 实现分布式锁，我们主要是用到了 Redis 中的 `SETNX`、`EXPIRE`、`DEL` 等命令。伪代码如下：

```java
// 获取锁
if (setnx('lock', 1)) {
  try {
    // 设置锁超时时间
    expire('lock', 30)
    // 执行业务逻辑
    ...
  } finally {
    // 释放锁
    del('lock')
  }
} else {
  // 获取锁失败，直接返回
  return
}
```
但是呢，这段代码还是有问题的，`setnx` 和 `expire` 两个命令并不是原子的，如果在执行 `setnx` 之后，`expire` 之前，进程崩溃了，那么这个锁就会永远存在，其他进程再也获取不到锁了。为了解决这个办法，我们可以使用 `set` 命令，它可以同时设置多个键值对，而且是原子的。伪代码如下：

```java
// 相当于在 Redis 中执行 set lock 1 EX 10 NX
// 获取锁
if (set('lock', 1, 'NX', 'EX', 30)) {
  try {
    // 执行业务逻辑
    ...
  } finally {
    // 释放锁
    del('lock')
  }
} else {
  // 获取锁失败，直接返回
  return
}
```
当然，我们也可以使用 Lua 脚本来实现分布式锁，这样可以保证原子性。伪代码如下：

- Lua 脚本加锁

```lua
if (redis.call('setnx', KEYS[1], ARGV[1]) == 1) then
    --设置成功返回1，当key不存在或者不能为key设置生存时间时，返回0
    return redis.call('expire', KEYS[1], ARGV[2]);
else
    --没有获取到锁
    return 0;
end
```
- Lua 脚本解锁

```lua
if (redis.call('get', KEYS[1]) == ARGV[1]) then
    --检查锁是否存在，存在则删除
    return redis.call('del', KEYS[1]);
else
    return 0;
end
```

:::tip 提示
`SETNX` 命令是从 Redis 1.0.0 版本开始提供的，`SET` 命令的 EX, PX, NX, XX 参数是从 Redis 2.6.12 版本开始提供的。并且，从 2.6.12 版本开始 `SETNX` 被废弃了，推荐使用 `SET` 命令的 NX 参数。见 [SETNX](https://redis.io/commands/setnx/)。

在 Java 中，由于 Redis 客户端版本的问题，部分客户端 API 可能没有提供 `SET` 命令的 EX, PX, NX, XX 参数，这时候我们可以使用 `EVAL` 命令来执行 Lua 脚本，或者使用 `JedisCluster` 来实现分布式锁。
:::


以下是 Java 中使用 Redis 作为分布式锁的简单实现：

- `ILock.java`

```java
public interface ILock {

    boolean tryLock(long expireTime);

    void unlock();
}
```

- `SimpleRedisLock.java`

```java
public class SimpleRedisLock implements ILock {

    private static final String LOCK_PREFIX = "redis_lock:";

    private String key;
    private StringRedisTemplate stringRedisTemplate;

    public SimpleRedisLock(String key, StringRedisTemplate stringRedisTemplate) {
        this.key = key;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean tryLock(long expireTime) {
        String value = Long.toString(Thread.currentThread().getId());
        Boolean result = stringRedisTemplate.opsForValue().setIfAbsent(getLockKey(), value, expireTime, TimeUnit.SECONDS);
        return Objects.nonNull(result) && result;
    }

    @Override
    public void unlock() {
        stringRedisTemplate.delete(getLockKey());
    }

    private String getLockKey() {
        return LOCK_PREFIX + key;
    }
}
```

- `CouponOrderServiceImpl.java`

```java
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

        SimpleRedisLock simpleRedisLock = new SimpleRedisLock("userId:" + userId, stringRedisTemplate);
        boolean tryLock = simpleRedisLock.tryLock(60);
        if (!tryLock) {
            throw new AppBizException("不允许重复抢购");
        }
        try {
            CouponOrderService couponOrderService = (CouponOrderService) AopContext.currentProxy();
            return couponOrderService.createOrder(userId, couponId);
        } finally {
            simpleRedisLock.unlock();
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public long createOrder(int userId, long couponId) throws Exception {
        // 判断用户是否已经抢购过该优惠券
        int count = couponOrderMapper.count(userId, couponId);
        if (count > 0) {
            throw new Exception("您已经抢购过该优惠券");
        }

        // 扣减优惠券库存
        int update = couponService.updateStock(couponId);
        if (update < 1) {
            throw new Exception("活动太火爆了，请稍后再试");
        }

        // 生成订单
        CouponOrder couponOrder = createOrder0(userId, couponId);
        couponOrderMapper.addCouponOrder(couponOrder);
        return couponOrder.getId();
    }

    private CouponOrder createOrder0(int userId, long couponId) {
        long orderId = redisIdWoker.generateId("order");
        CouponOrder couponOrder = new CouponOrder();
        couponOrder.setId(orderId);
        couponOrder.setUserId(userId);
        couponOrder.setCouponId(couponId);
        return couponOrder;
    }
}
```

好了，到这里，我们就实现了一个简单的分布式锁，但是这个锁还是有一些问题的，如下。

**误删问题**  

我们在释放锁时，直接使用 `stringRedisTemplate.delete(getLockKey())` 来删除锁，这样就会出现一个问题。如果我们的业务逻辑执行时间超过了锁的过期时间，那么，当我们释放锁时，就可能把其他线程的锁给删除掉，为什么会这样呢，举个例子来看看。假如线程 A 获取到了锁，并设置锁的超时时间为 60 秒，然后线程 A 开始执行业务逻辑，但是业务逻辑执行时间需要 90 秒，也就意味着，在这 60 - 90 秒内，其它线程是可以成功获取到锁的，假如这时线程 B 进来成功获取到了锁，那么就会出现线程 A、B 同时执行了相同的业务逻辑，这就不是我们想要的结果了。此外，在线程 A 结束业务逻辑后释放锁时，直接把 Redis 的 key 删除了，但是呢，由于线程 A 的 key 早就过期了，所以线程 A 删除的是线程 B 的锁，这时，如果又有一个线程 C 进来了，那么线程 C 就可以获取到锁了，这时，线程 B 和线程 C 就会同时执行相同的业务逻辑。如下图所示：

![20230709134542](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-09/20230709134542.png)

所以，在释放锁时，需要判断要释放的锁是否是自己的锁，如果是自己的锁，才能释放，否则，就不能释放。修改后的代码如下：

- `SimpleRedisLock.java`

```java{6,7,12,18,25-29}
public class SimpleRedisLock implements ILock {

    private static final String LOCK_PREFIX = "redis_lock:";

    private String key;
    private String value;
    private String valuePrefix;
    private StringRedisTemplate stringRedisTemplate;

    public SimpleRedisLock(String key, StringRedisTemplate stringRedisTemplate) {
        this.key = key;
        this.valuePrefix = UUID.randomUUID().toString().replaceAll("-", "");
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean tryLock(long expireTime) {
        this.value = valuePrefix + "-" + Thread.currentThread().getId();
        Boolean result = stringRedisTemplate.opsForValue().setIfAbsent(getLockKey(), this.value, expireTime, TimeUnit.SECONDS);
        return Objects.nonNull(result) && result;
    }

    @Override
    public void unlock() {
        String lockKey = getLockKey();
        String value = stringRedisTemplate.opsForValue().get(lockKey);
        if (Objects.equals(this.value, value)) {
            stringRedisTemplate.delete(lockKey);
        }
    }

    private String getLockKey() {
        return LOCK_PREFIX + key;
    }
}
```

在上面，我们还为 `value` 添加了一个前缀，为什么需要加前缀呢，直接使用线程 ID 不行吗？在集群环境下，我们会有多个 JVM，每个 JVM 中都有自己的线程 ID，如果我们直接使用线程 ID，那么就可能出现多个线程的 ID 是相同的，这样就会导致多个线程都可以获取到锁，从而在解锁就可以解开别人的锁了，所以，我们需要为 `value` 添加一个前缀，这样就可以保证集群中每个线程在 Redis 中的 `value` 不同（此处使用了 UUID，因为 UUID 是和机器相关的，不同的机器产生的 UUID 一般不会相同）。

那么，通过这种方式，是不是就能解决误删问题了呢？当然不是，这种方式还是有一些问题的。在释放锁时，我们是先从 Redis 中获取 `value`，然后判断 `value` 是否是自己的 `value`，如果是，才能释放锁，否则，不能释放锁，一般来讲，这是没有问题的，但是呢，这样会造成判断锁和释放锁是两个独立的操作，我们要的效果是，判断锁和释放锁是一个原子操作。试想一下，线程 A 在判断是否是自己加的锁时，如果判断通过了，那么会释放锁，但是呢，就在释放锁的时候，Redis 突然变得卡顿（Redis 也有内存回收策略，在内存回收策略期间，Redis 不会处理外部请求），导致释放锁的请求一直处于阻塞状态，如果在这期间，线程 A 的锁过期了，那么如果一段时间后，Redis 恢复正常，准备释放锁了，但是，这时候，另一个线程 B 开始尝试加锁（由于在 Redis 卡顿期间，线程 A 的锁过期了，所以线程 B 获取锁成功），线程 B 获取锁后，Redis 开始执行线程 A 的释放锁操作，这样就会导致线程 B 的锁被线程 A 释放了，又一次发生了误删问题。**所以，在释放锁时，必须确保判断锁和释放锁是一个原子操作，这样才能避免误删问题。**那么，如何确保判断锁和释放锁是一个原子操作呢？我们可以使用 Lua 脚本来实现，Lua 脚本是 Redis 内置的脚本语言，它可以保证脚本中的所有操作是原子性的，所以，我们可以使用 Lua 脚本来实现判断锁和释放锁是一个原子操作。修改后的代码如下：

- `classpath:script/lock.lua`

```lua
-- KEYS[1] 为锁的 key，ARGV[1] 为锁的 value，ARGV[2] 为锁的过期时间
if redis.call('setnx', KEYS[1], ARGV[1]) == 1 then
    return redis.call('expire', KEYS[1], ARGV[2])
else
    return 0
end
```

- `classpath:script/unlock.lua`

```lua
-- KEYS[1] 为锁的 key, ARGV[1] 为锁的 value
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

- `SimpleRedisLock.java`

```java{4,5,7-15,33,34,40}
public class SimpleRedisLock implements ILock {

    private static final String LOCK_PREFIX = "redis_lock:";
    private static final DefaultRedisScript<Long> LOCK_SCRIPT;
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT;

    static {
        UNLOCK_SCRIPT = new DefaultRedisScript<>();
        UNLOCK_SCRIPT.setResultType(Long.class);
        UNLOCK_SCRIPT.setScriptSource(new ResourceScriptSource(new ClassPathResource("script/unlock.lua")));

        LOCK_SCRIPT = new DefaultRedisScript<>();
        LOCK_SCRIPT.setResultType(Long.class);
        LOCK_SCRIPT.setScriptSource(new ResourceScriptSource(new ClassPathResource("script/lock.lua")));
    }

    private String key;
    private String value;
    private String valuePrefix;
    private StringRedisTemplate stringRedisTemplate;

    public SimpleRedisLock(String key, StringRedisTemplate stringRedisTemplate) {
        this.key = key;
        this.valuePrefix = UUID.randomUUID().toString().replaceAll("-", "");
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean tryLock(long expireTime) {
        this.value = valuePrefix + "-" + Thread.currentThread().getId();
        // Boolean result = stringRedisTemplate.opsForValue().setIfAbsent(getLockKey(), this.value, expireTime, TimeUnit.SECONDS);
        // return Objects.nonNull(result) && result;
        Long result = stringRedisTemplate.execute(LOCK_SCRIPT, Collections.singletonList(getLockKey()), this.value, String.valueOf(expireTime));
        return Objects.equals(result, 1L);
    }

    @Override
    public void unlock() {
        String lockKey = getLockKey();
        stringRedisTemplate.execute(UNLOCK_SCRIPT, Collections.singletonList(lockKey), this.value);
    }

    private String getLockKey() {
        return LOCK_PREFIX + key;
    }
}
```

好了，我们使用 Lua 脚本实现了原子性，那这下我们的分布式锁应该就很完美了吧？一般情况下，通过上面的方式实现分布式锁已经可以满足多数场景了。但是，想要实现一个真正意义上的分布式锁，还需要考虑一些其他的问题。如下：

- 可重入

  同一个线程可以多次获取同一把锁

- 可重试

  获取锁失败后，可以重试获取锁

- 自动续期

  获取锁成功后，如果业务逻辑执行时间超过锁的过期时间，那么锁会自动续期

- 主从一致性

  Redis 主从同步存在延迟，当主宕机时，如果从从节点尚未同步 Master 中的锁数据，则会出现锁失效

如果我们想要自己实现上面的功能的话，其实还是有点麻烦的。那有没有什么现成的工具类呢？肯定是有的，Redisson 已经帮我们实现了这些功能，我们只需要使用 Redisson 提供的分布式锁即可。
