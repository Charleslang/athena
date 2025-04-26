# 异步秒杀

在前面，我们实现了一个秒杀业务，它的流程如下：

1. 根据优惠券 ID 查询数据库，判断优惠券是否存在。
2. 判断优惠券的状态，例如开始抢购时间、结束抢购时间、优惠券库存。
3. 根据用户 ID 和优惠券 ID 查询数据库，判断用户是否已经抢购过该优惠券。
4. 更新数据库，修改优惠券库存。
5. 插入数据库，生成用户订单。

上面的逻辑还有优化空间，流程是串行的，而且需要多次访问数据库，并且还在 3、4、5 这几个步骤加了分布式锁，所以接口的性能其实不高。

通过上面的步骤我们可以发现，抢券其实就分为两个步骤，判断用户资格以及生成订单。我们可以采用异步的方式进行处理，如果用户有资格，则生成一个订单号返回给用户，后台开启异步线程根据订单号创建订单。

判断用户是否有资格：

1. 先把优惠券的库存同步到 Redis，采用 String 进行存储。例如 coupon:stock:id -> stock。
2. 判断用户是否已经抢购过，可以借助 Redis 的 Set 实现。例如 coupon:order:id -> 用户1 的 ID, 用户2 的 ID。
3. 如果用户有资格，则扣减库存，并把用户 ID 添加到 Set 中，表示用户已经抢过券。
4. 步骤 1、2、3 需要使用 Lua 脚本保证原子性。

创建订单：

- 把订单号、优惠券 ID、用户 ID 放入阻塞队列


**couponOrder.lua：**

```lua
local couponId = ARGV[1]
local userId = ARGV[2]

-- lua 脚本使用 .. 拼接字符串
local couponKey = 'coupon:stock:' .. couponId
local orderKey = 'coupon:order:' .. couponId

-- 1. 判断优惠券库存是否充足
if (tonumber(redis.call('get', couponKey) <= 0) then
    return 1
end

-- 2. 判断用户是否已经领取过该优惠券
if (redis.call('sismember', orderKey, userId) == 1) then
    return 2
end

-- 3. 扣减优惠券库存
redis.call('incrby', couponKey, -1)
-- 4. 将用户 id 添加到已领取优惠券的集合中
redis.call('sadd', orderKey, userId)

return 0
```

**CouponOrderServiceImpl.java：** 

```java
@Service
public class CouponOrderServiceImpl implements CouponOrderService {

    private static final DefaultRedisScript<Long> COUPON_ORDER_SCRIPT;

    private final BlockingQueue<CouponOrderTask> couponOrderTaskQueue = new LinkedBlockingDeque<>();

    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    static {
        COUPON_ORDER_SCRIPT = new DefaultRedisScript<>();
        COUPON_ORDER_SCRIPT.setLocation(new ClassPathResource("couponOrder.lua"));
        COUPON_ORDER_SCRIPT.setResultType(Long.class);
    }

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private RedisIdWoker redisIdWoker;

    @Resource
    private CouponService couponService;

    @Resource
    private CouponOrderMapper couponOrderMapper;

    @PostConstruct
    public void init() {
        executorService.execute(() -> {
            while (true) {
                try {
                    // 从阻塞队列中获取任务
                    CouponOrderTask task = couponOrderTaskQueue.take();
                    // 处理任务
                    task.getCouponOrderService().createOrder(task);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
    }

    @Override
    public Long addCouponOrder(int userId, int couponId) throws Exception {
        Long result = stringRedisTemplate.execute(COUPON_ORDER_SCRIPT, Collections.emptyList(), String.valueOf(couponId), String.valueOf(userId));

        if (result == 1) {
            throw new Exception("优惠券已经抢购完");
        }
        if (result == 2) {
            throw new Exception("用户已经领取过该优惠券");
        }

        // 生成订单 ID
        long orderId = redisIdWoker.generateId("order");

        // 放入阻塞队列
        couponOrderTaskQueue.add(new CouponOrderTask(couponId, userId, orderId, AopContext.currentProxy()));

        return orderId;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public long createOrder(CouponOrderTask task) throws Exception {

        // 扣减优惠券库存
        int update = couponService.updateStock(task.getCouponId());
        if (update < 1) {
            throw new Exception("活动太火爆了，请稍后再试");
        }

        // 生成订单
        CouponOrder couponOrder = createOrder0(task.getUserId(), task.getCouponId(), task.getOrderId());
        couponOrderMapper.addCouponOrder(couponOrder);
        return couponOrder.getId();
    }

    private CouponOrder createOrder0(int userId, long couponId, long orderId) {
        CouponOrder couponOrder = new CouponOrder();
        couponOrder.setId(orderId);
        couponOrder.setUserId(userId);
        couponOrder.setCouponId(couponId);
        return couponOrder;
    }
}
```

