# 全局唯一 ID

在电商项目中，经常会涉及到订单的生成，在生成订单时，每个订单都会对应一个 ID。一般情况下，我们会想到借助数据库的自增 ID 来生成订单 ID，如果你的系统规模较小，这是可行的，但是，当系统规模越来越大时，可能数据库的自增 ID 就无法满足我们的需求了。在分布式系统中，会使用分库分表，如果每张表都使用自增 ID，那么肯定会出现重复的 ID。并且，如果我们使用数据库的自增 ID，可能会暴露系统的规模，比如，我昨天下了一单，订单 ID 是 100，第二天，我又下了一单，订单 ID 是 200，这样的话，用户就能猜测到昨天一天系统大概有 100 个订单。

所以，使用数据库的自增 ID，会有以下两个明显的缺点：

- 受单表数据量的限制（无法满足分布式系统的需求）
- id 的规律性太明显

在这种情况下，我们需要使用全局唯一 ID 来生成订单 ID。全局 ID 生成器是一种在分布式系统下用来生成全局唯一 ID 的工具，一般要满足下列特性：

- 唯一性
- 递增性
- 高可用
- 高性能
- 安全性

由于本笔记记录的是 Redis 相关的信息，所以，我们这里只介绍基于 Redis 的全局唯一 ID 生成器。而 Redis 中提供了一个原子操作，可以满足我们的需求，那就是 `INCR` 命令，它类似于 MySQL 的自增 ID。为了增加 ID 的安全性，我们可以不直接使用 Redis 自增的数值，而是拼接一些其它信息，最终，我们生成的 ID 看起来像这样：

![全局唯一 ID](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-23/全局唯一%20ID.png)

所以，最终生成的 ID 是 64 位，ID 的组成部分如下：
- 符号位：1 bit，永远为 0
- 时间戳：31 bit，以秒为单位，可以使用 69 年（2<sup>31</sup> / 3600 / 24 / 365 = 69）
- 序列号：32 bit，秒内的计数器，支持每秒产生 2<sup>32</sup> 个不同 ID

下面是一个简单的实现：

- `RedisIdWoker.java`

```java
@Component
public class RedisIdWoker {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd");

    /**
     * 开始时间戳, 2020-01-01 00:00:00
     */
    private static final long BEGIN_EPOCH_SECONDS = LocalDateTime.of(2020, 1, 1, 0, 0, 0).toEpochSecond(ZoneOffset.of("+8"));

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    public long generateId(String keyPrefix) {
        // 生成时间戳
        LocalDateTime now = LocalDateTime.now();
        long timestamp = now.toEpochSecond(ZoneOffset.of("+8")) - BEGIN_EPOCH_SECONDS;
        // 生成自增序列
        String dateFormat = now.format(formatter);
        // 自增的 key 为 incr:前缀:日期, 这样可以保证每天的自增序列是独立的, 同时也方便我们统计每天的订单数量
        // 如果我们把所有的自增序列都放在一个 key 下面, 有可能会超过 redis 的单个 key 大小的限制
        // 对于自增的 key, redis 支持最大的自增序列为 2 ^ 64, 见 https://redis.io/commands/incr/
        String incrKey = "incr:" + keyPrefix + ":" + dateFormat;
        // 当然, 如果你不想统计每天的订单数量, 那么也可以为所有的自增序列都使用同一个 key, 或者给 key 设置过期时间为 1 天
        Long id = stringRedisTemplate.opsForValue().increment(incrKey);
        // 最终生成的 ID 是 64 位的, 高 32 位是时间戳, 低 32 位是自增序列
        return timestamp << 32 | id;
    }
}
```

- `IDTest.java`

```java
/**
 * 生成 30000 个 ID
 */
@Test
void test8() throws InterruptedException {
    int threadCount = 300;
    CountDownLatch countDownLatch = new CountDownLatch(threadCount);
    Runnable runnable = () -> {
        for (int i = 0; i < 100; i++) {
            redisIdWoker.generateId("order");
        }
        countDownLatch.countDown();
    };
    long begin = System.currentTimeMillis();
    for (int i = 0; i < threadCount; i++) {
        ID_WOKER_EXECUTOR.execute(runnable);
    }
    countDownLatch.await();
    long end = System.currentTimeMillis();
    System.out.println("耗时: " + (end - begin) + " ms");
}
```

一些其它的全局唯一 ID 生成方案：

- UUID（不推荐）
- snowflake 算法（雪花算法）
- 数据库自增

  这里的数据库自增说的是，单独使用一张表来记录自增 ID，然后，每次生成 ID 时，都去查询这张表，获取自增 ID，然后，再更新这张表的自增 ID。这种方案的缺点是，每次生成 ID 都需要访问数据库，会对数据库造成压力，而且，性能没有 Redis 高。
  