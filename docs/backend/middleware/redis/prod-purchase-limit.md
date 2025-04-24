# 一人一单

在电商系统中，秒杀活动是常见的营销方式。部分场景下，为了保证活动的公平性，需要限制每个用户只能购买一件商品，这就是一人一单的场景。

在这里，我们先准备两张表。一张是优惠券表，一张是订单表。两张表的表结构分别如下：

- `tb_coupon`

```sql
CREATE TABLE `tb_coupon` (
  `id` bigint(20) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `stock` int(255) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

- `tb_coupon_order`

```sql
CREATE TABLE `tb_coupon_order` (
  `id` bigint(20) NOT NULL,
  `coupon_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

`tb_coupon` 表中的数据如下：

```sql
INSERT INTO 
`mytest1`.`tb_coupon`(`id`, `desc`, `stock`, `begin_time`, `end_time`) 
VALUES 
(1, '周一到周五，满100减20', 100, '2023-06-22 22:31:33', '2023-07-25 22:31:37');
```

一般情况下，如果我们要实现一个用户只能下一单的功能，我们可以在下单的时候，先查询订单表，如果订单表中已经存在了该用户的订单，那么就不允许下单，否则就允许下单。相关代码如下：

- `CouponOrderServiceImpl.java`

```java{42-45}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
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

        // 判断用户是否已经抢购过该优惠券
        int count = couponOrderMapper.count(userId, couponId);
        if (count > 0) {
            throw new Exception("您已经抢购过该优惠券");
        }

        // 扣减优惠券库存
        int update = couponService.updateStock(couponId, stock);
        if (update < 1) {
            throw new Exception("活动太火爆了，请稍后再试");
        }

        // 生成订单
        CouponOrder couponOrder = createOrder(userId, couponId);
        couponOrderMapper.addCouponOrder(couponOrder);
        return couponOrder.getId();
    }

    private CouponOrder createOrder(int userId, long couponId) {
        long orderId = redisIdWoker.generateId("order");
        CouponOrder couponOrder = new CouponOrder();
        couponOrder.setId(orderId);
        couponOrder.setUserId(userId);
        couponOrder.setCouponId(couponId);
        return couponOrder;
    }
}
```

好了，这样就能实现一人一单？让我们使用 JMeter 进行并发测试。如下：

![20230708135052](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708135052.png)

![20230708135139](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708135139.png)

上面，我们只使用了一个用户进行并发测试，并发数为 200，让我们看看测试结果：

- 优惠券表中的数据

![20230708135329](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708135329.png)

- 订单表中的数据

![20230708135421](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708135421.png)

很明显，我们的系统出现了问题，同一个用户下了多个订单。明明我们在代码中做了限制，先查询用户是否已经下过单了，如果下过单了，就不允许再下单了，但是，为什么还是出现了这种情况呢？我们来仔细分析一下代码：

```sql
// 判断用户是否已经抢购过该优惠券
int count = couponOrderMapper.count(userId, couponId);
if (count > 0) {
    throw new Exception("您已经抢购过该优惠券");
}
```
上面是查询用户是否已经下过单的代码，这段代码有一个问题，对同一个用户 ID 来讲，当一个请求在查询自己是否已经下过单的时候，另一个请求也在查询自己是否已经下过单，这样就会出现两个请求的查询结果都没有下过单的情况，然后两个用户都会下单，这样就会出现一个用户下了多个订单的情况。

那我们如何解决这个问题呢？其实，最简单的办法就是给 `tb_coupon_order` 表中的 `user_id`、`coupon_id` 字段添加唯一索引，这样就能保证同一个用户只能下一单了，但是呢，在其它场景中，一个用户可能会被允许下多单，所以，这种方式并不是一个通用的解决方案。

另一种办法是给用户下单的逻辑加锁（此处使用悲观锁，想想为什么不用乐观锁？），保证一个用户只能下一单。但是呢，如何加锁也是一个问题。通过上面的代码，我们可以发现，需要加锁的代码是这段：

```java
// 判断用户是否已经抢购过该优惠券
int count = couponOrderMapper.count(userId, couponId);
if (count > 0) {
    throw new Exception("您已经抢购过该优惠券");
}

// 扣减优惠券库存
int update = couponService.updateStock(couponId, stock);
if (update < 1) {
    throw new Exception("活动太火爆了，请稍后再试");
}

// 生成订单
CouponOrder couponOrder = createOrder(userId, couponId);
couponOrderMapper.addCouponOrder(couponOrder);
return couponOrder.getId();
```

那我们的锁对象又是啥呢？能不能是 `this` 呢？显然是不能的，因为 `this` 是当前对象，也就是 `CouponOrderServiceImpl`，由于 `CouponOrderServiceImpl` 被 Spring 管理了，而 Spring 容器中的对象默认是单例的，如果我们加锁对象是 `this`，那么如果有两个用户同时下单，它们就只能串行执行了，这样就会导致系统的吞吐量降低，所以，我们不能使用 `this` 作为锁对象。而在这个场景中，我们需要的是保证同一个用户只能下一单，所以，我们可以使用用户 ID 作为锁对象，这样就能保证同一个用户只能下一单了。那么，我们能够使用 `synchronized (userId.toString()) {}` 或者 ``synchronized (Integer.toString(userId)) {}`` 来加锁吗，答案是否定的，因为 `toString()` 和 `Integer.toString()` 的源码如下：

```java
public String toString() {
    return toString(value);
}

public static String toString(int i) {
    if (i == Integer.MIN_VALUE)
        return "-2147483648";
    int size = (i < 0) ? stringSize(-i) + 1 : stringSize(i);
    char[] buf = new char[size];
    getChars(i, size, buf);
    return new String(buf, true);
}
```

显然，`toString()` 和 `Integer.toString()` 方法每次返回的都是一个新的对象，所以，如果我们使用 `synchronized (userId.toString()) {}` 或者 ``synchronized (Integer.toString(userId)) {}`` 来加锁，那么即使是同一个用户 ID，最终其实都是不同的锁对象，这样就不能保证同一个用户只能下一单了。如何解决这个问题呢？我们可以使用字符串的 `intern` 方法，于是加锁的锁对象就变成了 `("userId:" + Integer.toString(userId)).intern()`，修改后的代码如下：

```java{37,38,55}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
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

        String monitorKey = "userId:" + userId;
        synchronized (monitorKey.intern()) {
            // 判断用户是否已经抢购过该优惠券
            int count = couponOrderMapper.count(userId, couponId);
            if (count > 0) {
                throw new Exception("您已经抢购过该优惠券");
            }

            // 扣减优惠券库存
            int update = couponService.updateStock(couponId, stock);
            if (update < 1) {
                throw new Exception("活动太火爆了，请稍后再试");
            }

            // 生成订单
            CouponOrder couponOrder = createOrder(userId, couponId);
            couponOrderMapper.addCouponOrder(couponOrder);
            return couponOrder.getId();
        }
    }

    private CouponOrder createOrder(int userId, long couponId) {
        long orderId = redisIdWoker.generateId("order");
        CouponOrder couponOrder = new CouponOrder();
        couponOrder.setId(orderId);
        couponOrder.setUserId(userId);
        couponOrder.setCouponId(couponId);
        return couponOrder;
    }
}
```

当然，我们也可以把创建订单的逻辑单独抽离出来，封装成一个方法，如下：

```java{36,42-63}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

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

        return createOrder(userId, couponId);
    }
    
    // synchronized 不能加在方法上, 如果加在方法上, 那么锁对象是 this, 也就是当前对象, 也就是说, 不同的用户抢购的时候, 也会互相阻塞。
    // 为什么锁对象不能是 this 呢？我在上面已经分析过了
    @Transactional(rollbackFor = Exception.class)
    public long createOrder(int userId, long couponId) throws Exception {
        String monitorKey = "userId:" + userId;
        synchronized (monitorKey.intern()) {
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
你以为这样就可以了吗？当然是不行的，还存在两个问题。

第一个问题就是事务。我们都知道，Spring 的声明式事务（也就是 `@Transactional` 注解）是基于 AOP 的。也就是说，只有当方法被外部调用的时候，事务才会生效，如果是内部调用（也就是通过 `this` 来调用），事务是不会生效的。也就是说，如果我们在 `createOrder` 方法上加上 `@Transactional` 注解，那么 `createOrder` 方法中的事务是不会生效的，因为 `createOrder` 方法是被 `addCouponOrder` 方法内部调用的，相当于在 `addCouponOrder` 方法中直接使用 `this` 调用 `createOrder()` 方法，这样的话，`createOrder` 方法中的事务是不会生效的。解决办法如下：

- `pom.xml`

```xml
<!-- 添加额外依赖 -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
</dependency>
```

- `RedisSpringbootApplication.java`

```java{3}
@SpringBootApplication
@MapperScan("com.dysy.redisspringboot.mapper")
@EnableAspectJAutoProxy(exposeProxy = true)
public class RedisSpringbootApplication {

  public static void main(String[] args) {
      SpringApplication.run(RedisSpringbootApplication.class, args);
  }

}
```

- `CouponOrderService.java`

```java{5}
public interface CouponOrderService {

    long addCouponOrder(int userId, long couponId) throws Exception;

    long createOrder(int userId, long couponId) throws Exception;
}
```

- `CouponOrderServiceImpl.java`

```java{36,37}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

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

        CouponOrderService couponOrderService = (CouponOrderService) AopContext.currentProxy();
        return couponOrderService.createOrder(userId, couponId);
    }
    
    // ...
}
```

另一个问题是，锁的范围太小了。`createOrder` 这个方法中加了事务，而事务是在整个方法执行完成后才提交的。试想一下，如果有两个请求同时进入 `createOrder` 方法，那么这两个请求会同时进入 `synchronized` 代码块，然后第一个请求拿到锁了，执行同步代码块中的逻辑，第二个请求则进行等待。当第一个请求释放锁之后，进行事务的提交，在第一个请求释放锁之后，第二个请求得到了锁，然后执行同步代码快中的逻辑。第二个请求先查询该用户是否已经下过单了，但是，由于此时第一个请求的事务尚未提交，那么第二个请求执行 `couponOrderMapper.count(userId, couponId);` 得到的结果为 0，就会导致第二个请求也会下单成功，最终结果就是一个用户抢购了两张优惠券。解决办法就是将锁的范围扩大，确保事务提交后才释放锁。修改代码如下：

- `CouponOrderServiceImpl.java`

```java{36,37,40,43-62}
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    @Resource
    private CouponService couponService;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponOrderMapper couponOrderMapper;

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

        String monitorKey = "userId:" + userId;
        synchronized (monitorKey.intern()) {
            CouponOrderService couponOrderService = (CouponOrderService) AopContext.currentProxy();
            return couponOrderService.createOrder(userId, couponId);
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

然后，我们再次使用 JMeter 进行压测，结果如下：

- 优惠券的剩余库存

![20230708151234](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708151234.png)

- 优惠券订单表

![20230708151256](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708151256.png)

可以看到，使用 `synchronized` 作为悲观锁确实解决了一人一单的问题。但是，这种方式仅仅适用于单机，如果是集群环境，那就无法解决了。因为，`synchronized` 是基于 JVM 的，而集群环境下，每个 JVM 都有自己的一套锁。所以，这种方式无法解决集群环境下的并发问题。我们来验证一下在集群环境下的并发问题。

首先，在 IDEA 中，我们启动两个服务，端口分别为 8080 和 8081，如下：

![20230708155555](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708155555.png)

![20230708155626](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708155626.png)

![20230708155816](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708155816.png)

Nginx 负载均衡配置如下：

```nginx
http {
  upstream testbackend {
    server localhost:8080;
    server localhost:8081;
  }

  server {
    listen       80;
    server_name  localhost;
  
    location /api {
      proxy_pass http://testbackend;
    }
  }
}
```

然后，我们再次使用 JMeter 进行压测。如下：

![20230708160155](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708160155.png)

![20230708160247](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708160247.png)

我们会发现，两个请求同时进入了 8080 和 8081 两个节点（但是，这并不意味着会一定会产生两条订单），如下：

![20230708155356](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708155356.png)

![20230708155428](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-07-08/20230708155428.png)

所以，`synchronized` 无法解决集群环境下的并发问题。这个时候，就需要使用分布式锁了。见[分布式锁](./prod-distributed-lock.html)。
