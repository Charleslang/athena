# 签到（BitMap）

在很多场景下，我们可能需要开发一个签到的功能，如果我们基于数据库来做，我们可能需要设计一张下面的表结构：

|字段名称|类型|描述|
|---|---|---|
|id|int|主键，自增|
|user_id|int|用户id|
|year|smallint|签到年份|
|month|tinyint|签到月份|
|day|tinyint|签到日期|
|week|tinyint|签到星期|
|is_back|tinyint(1)|是否补签，0：否，1：是|
|sign_time|datetime|签到时间|

由于每个人的签到记录非常多，如果我们使用数据库来做签到，那么数据库中的数据量会非常大，查询和统计的性能会非常差。其实我们注意到，用户的签到状态只有两种，签到和未签到，也就是 0 和 1。因此，对于一个月的签到记录来讲，我们只需要最多 31 个 bit 位来表示某个用户一个月的签到状态即可。

我们可以使用 Redis 的 BitMap 来实现签到功能。Redis 的 BitMap 是一种非常高效的存储方式，使用 BitMap 来存储签到状态，可以大大减少存储空间的占用。我们可以使用 Redis 的 SETBIT 命令来设置某个位置的值为 1 或者 0，使用 GETBIT 命令来获取某个位置的值。Redis 中使用的是 String 类型来实现 BitMap，每个 String 类型最多可以存储 512MB 的数据，因此，一个 BitMap 最多可以存放的位数为 2<sup>32</sup>（很多很多位）。

Redis 中 BitMap 的常用操作如下：

|命令|描述|
|---|---|
|SETBIT|设置某个位置的值为 1 或者 0|
|GETBIT|获取某个位置的值|
|BITCOUNT|统计 BitMap 中值为 1 的个数|
|BITOP|对多个 BitMap 进行位操作|
|BITPOS|获取 BitMap 中第一个值为 0 或 1 的位置|
|BITFIELD|操作（修改、自增、查询）BitMap 中指定范围内的 bit 位的值，以 10 进制的形式返回|
|BITFIELD_RO|获取 BitMap 中指定范围内的 bit 位的值，以 10 进制的形式返回|


测试 Redis 的 BitMap 功能，我们可以使用下面的命令：
```sh
127.0.0.1:6379> setbit mybit 0 1
(integer) 0
127.0.0.1:6379> setbit mybit 1 1
(integer) 0
127.0.0.1:6379> setbit mybit 3 1
(integer) 0
127.0.0.1:6379> getbit mybit 4
(integer) 0
127.0.0.1:6379> getbit mybit 3
(integer) 1
# 没有设置的 bit 位，默认值为 0
127.0.0.1:6379> getbit mybit 2
(integer) 0
127.0.0.1:6379> bitcount mybit
(integer) 3
# 从第 0 位开始，获取连续 3 个 bit 位的值，最后结果以无符号的 10 进制的形式返回。u 表示无符号，s 表示有符号，b 表示 bit 位的长度
127.0.0.1:6379> bitfield mybit GET u3 0 
1) (integer) 6
# 第一个 1 出现的位置
127.0.0.1:6379> bitpos mybit 1
(integer) 0
```

执行上面的命令后，我们可以看到，Redis 中 BitMap 的值为 1101。获取前 3 位的值，返回的结果为 6。因为前三位是 110，转换成 10 进制的值为 6。

使用 Java 来实现签到功能，我们可以使用下面的代码：

```java
public void clockIn(int id) {
    LocalDateTime now = LocalDateTime.now();

    String key = "teacher:clock:" + id + ":" + now.format(DateTimeFormatter.ofPattern("yyyyMM"));

    // 获取当前年份
    int year = now.getYear();
    // 获取当前月份
    int month = now.getMonthValue();
    // 获取当前日期
    int day = now.getDayOfMonth();

    // BitMap 本质就是 String
    stringRedisTemplate.opsForValue().setBit(key, day - 1, true);
}
```

上面的代码执行完成后，Redis 中的数据如下：

![20250426161042](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-26/20250426161042.png)

你可能会发现，为什么 1 后面会有很多个 0 呢？这是因为 BitMap 是以字节位单位存储的，至少需要 8 个 bit 位来存储一个 byte，不够的部分会用 0 来填充。

好的，上面我们基于 Redis 实现了一个简单的签到功能，接下来，我们来统计一下本月的连续签到天数。什么是连续签到的天数呢？就是**从今天开始**，往前一直找，直到遇到第一次未签到的日期为止。比如说，今天是 2025 年 4 月 26 日，今天签到了，那么连续签到的天数就是 1；如果昨天也签到，那么连续签到的天数就是 2；如果前天也签到，那么连续签到的天数就是 3；如果前天没有签到，那么连续签到的天数就是 2。

那怎么实现这个功能呢？如下：

1. 使用 BITFIELD 从第 0 位开始，获取 dayOfMonth 个 bit 位的值，得到一个 10 进制的值。
2. 将 10 进制的值与 1 做与运算，判断其最后一位是否为 1，如果是，则表示今天签到，连续签到天数加 1；如果不是，则表示今天没有签到，连续签到天数为 0。
3. 将 10 进制的值右移一位，判断其最后一位是否为 1，如果是，则表示昨天签到，连续签到天数加 1；如果不是，则表示昨天没有签到，则停止统计。

```java
public int countClockIn(int id) {
    LocalDateTime now = LocalDateTime.now();

    String key = "teacher:clock:" + id + ":" + now.format(DateTimeFormatter.ofPattern("yyyyMM"));

    int dayOfMonth = now.getDayOfMonth();

    // BitMap 本质就是 String
    BitFieldSubCommands bitFieldSubCommands = BitFieldSubCommands.create()
            .get(BitFieldSubCommands.BitFieldType.unsigned(dayOfMonth))
            .valueAt(0);
    List<Long> longs = stringRedisTemplate.opsForValue().bitField(key, bitFieldSubCommands);

    if (CollectionUtils.isEmpty(longs)) {
        return 0;
    }

    Long value = longs.get(0);
    if (Objects.isNull(value)) {
        return 0;
    }

    int sum = 0;
    while ((value & 1) == 1) {
        sum++;
        value = value >>> 1;
    }

    return sum;
}
```
