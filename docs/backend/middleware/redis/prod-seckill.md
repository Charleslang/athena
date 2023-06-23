# 抢券（秒杀）

在电商项目中，下单是一个非常常见的场景，而且在双十一、六一等大促期间，下单的并发量会非常大，下单场景有一个很常见的问题，就是如何解决超卖问题。我们先来看一下正常的下单流程，以下用 Java 代码作为示例：

```java
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
    public long addCouponOrder(long couponId) throws Exception {
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
        // 扣减优惠券库存
        int update = couponService.updateStock(couponId);
        if (update < 1) {
            throw new Exception("活动太火爆了，请稍后再试");
        }
        // 生成订单
        CouponOrder couponOrder = createOrder(couponId);
        couponOrderMapper.addCouponOrder(couponOrder);
        return couponOrder.getId();
    }

    private CouponOrder createOrder(long couponId) {
        long orderId = redisIdWoker.generateId("order");
        CouponOrder couponOrder = new CouponOrder();
        couponOrder.setId(orderId);
        couponOrder.setCouponId(couponId);
        return couponOrder;
    }
}
```
其中，`couponService.updateStock(couponId)` 方法用于扣减优惠券库存，其 SQL 如下：

```xml
<update id="updateStock">
    update tb_coupon set stock = stock - 1 where id = #{id}
</update>
```

数据库中优惠券初始库存为 100，如下所示：

![20230624001535](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-24/20230624001535.png)

使用 JMeter 进行压测，如下：

![20230623230727](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623230727.png)

在压测结果中，可以发现，异常率是 45.5%，显然这不符合预期，理论上来讲，异常率应该是 50% 才对。

![20230623230924](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623230924.png)

查看数据库中的优惠券库存，如下：

![20230623231022](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623231022.png)

查看数据库中的订单数量，如下：

![20230623231115](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623231115.png)

可以发现，竟然超卖了，这是咋回事呢？这是因为在并发场景下，多个线程同时执行 `couponService.findById(couponId);` 得到了相同的结果，导致优惠券库存出现负数，这就是超卖问题。常见的解决办法就是进行加锁，加锁又分为乐观锁和悲观锁。

先来看看乐观锁的解决方案。最常见的乐观锁解决方案就是使用版本号，每次查询优惠券信息时，将版本号一并查询出来，然后在更新库存时，将版本号作为条件，如果 where 条件中的版本号和数据库中的版本号相同，则允许扣减库存，否则扣减库存失败，同时，每次更新优惠券信息后，版本号进行加 1。这样就可以保证在并发场景下，只有一个线程能够更新成功，其他线程更新失败，从而避免超卖问题。修改扣减库存的 SQL，增加一个版本号字段，如下：

```xml{4,6}
<update id="updateStock">
  update tb_coupon 
  set stock = stock - 1,
  version = version + 1
  where id = #{id}
  and version = #{version}
</update>
```
当然呢，从上面的 SQL 中可以发现，`version` 字段的作用和 `stock` 其实是差不多的，都是用来控制库存的，在扣减库存时会同时修改版本号，所以我们可以将 `version` 字段去掉，直接使用 `stock` 字段来进行乐观锁控制，这种方式类似于 CAS，如下：

```xml{5}
<update id="updateStock">
  update tb_coupon 
  set stock = stock - 1
  where id = #{id}
  and stock = #{oldStock}
</update>
```
为什么上面这段代码就不会出现超卖的情况？这是因为数据库具有**行锁**，同一时间当多个线程同时执行上面的 SQL 时，只有一个线程能够执行成功，其它线程执行失败，从而避免了超卖问题。修改代码如下：

```java{23}
public long addCouponOrder(long couponId) throws Exception {
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
    // 扣减优惠券库存
    int update = couponService.updateStock(couponId, stock);
    if (update < 1) {
        throw new Exception("活动太火爆了，请稍后再试");
    }
    // 生成订单
    CouponOrder couponOrder = createOrder(couponId);
    couponOrderMapper.addCouponOrder(couponOrder);
    return couponOrder.getId();
}
```

在使用乐观锁后，让我们再使用 JMeter 进行压测，如下：

![20230623233212](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623233212.png)

数据库中的优惠券库存，如下：

![20230623233239](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623233239.png)

数据库中的订单数量，如下：

![20230623233305](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/20230623233305.png)

可以发现，超卖问题解决了。但是呢，结果却并不是我们想要的，因为失败率太高了，虽然解决了超卖，但是呢，优惠券的库存还剩很多。为什么？看看下面这张图：

![扣减库存-乐观锁](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-24/扣减库存-乐观锁.png)

从上图中可以发现，线程 1 和线程 2 查询到的库存都是 100，但是，在更新时，由于数据库行锁（互斥锁）的存在，同一时间仅允许一个线程对数据做修改，线程 1 将库存减 1 后，库存已经减为 99，由于线程 2 之前查询到的库存是 100，当线程 2 扣减库存时使用 `where stock = 100` 显然是不满足条件的，因为线程 1 已将库存修改为了 99。

那有没有什么办法可以解决库存还剩很多的情况呢？当然有，我们可以在扣减库存失败后，进行有限的重试，重新查询库存，然后再进行扣减。但是这种方式不是特别好，因为重试的次数是有限的，如果重试次数过多，会导致用户体验不好，而且在高并发场景下，重试次数过多，会导致数据库压力过大。其实，我们只需要修改扣减库存的 SQL，将 `where stock = #{oldStock}` 修改为 `where stock > 0` 即可，如下：

```xml{5}
<update id="updateStock">
    update tb_coupon 
    set stock = stock - 1 
    where id = #{id} 
    and stock &gt; 0
</update>
```

再次使用 JMeter 进行压测，如下：

![20230624001313](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-24/20230624001313.png)

查看数据库中的优惠券库存，如下：

![20230624001343](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-24/20230624001343.png)

查看数据库中的订单数量，如下：

![20230624001407](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-24/20230624001407.png)

可以发现，结果是符合预期的。这样就能解决超卖问题，而且不会出现库存还剩很多的情况。
