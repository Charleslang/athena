# UV 统计

UV （Unique Visitor）统计是指独立访客统计，通常用于分析网站或应用的访问量和用户行为。通过记录每个独立用户的访问行为，可以更好地了解用户需求和优化产品体验。1 天内同一个用户访问多次，只算 1 次 UV。UV 统计通常使用 Redis 的 HyperLogLog 数据结构来实现。HyperLogLog 是一种概率性数据结构，可以用来估算集合中不同元素的数量，具有较高的性能和较低的内存占用。HyperLogLog 的精度可以通过参数 `p` 来控制，`p` 的值越大，精度越高，但内存占用也越大。默认情况下，Redis 中 HyperLogLog 的 `p` 值为 12，内存占用为 12 KB。

PV （Page View）统计是指页面浏览量统计，通常用于分析网站或应用的访问量和用户行为。PV 也叫页面访问量、浏览量或者点击量。同一个用户访问同一页面多次，PV 统计会将每次访问都算作一次 PV。我们可以使用 Redis 的 INCR 命令来实现统计 PV 的操作，String 数据结构的最大值为 2^63-1，因此，PV 的最大值也为 2^63-1。

HyperLogLog 底层基于 String 数据结构实现，单个 HyperLogLog 的内存占用永远小于 16 KB，内存占用极低！但是，HyperLogLog 存在 0.81% 的误差，不过对于 UV 统计来讲，可以忽略不计。除此之外，HyperLogLog 在添加元素时，会自动去重。其常用的命令如下：

|命令|说明
|---|---|
|PFADD|往 HyperLogLog 中添加元素|
|PFCOUNT|统计 HyperLogLog 中的元素数量|
|PFMERGE|把多个 HyperLogLog 合并成一个 HyperLogLog|

```sh
127.0.0.1:6379> PFADD mypf 1 2 3 4
(integer) 1
127.0.0.1:6379> PFADD mypf 1 2 3 4
(integer) 0
127.0.0.1:6379> pfcount mypf
(integer) 4
127.0.0.1:6379> PFADD mypf 1 2 3 4 5
(integer) 1
127.0.0.1:6379> pfcount mypf
(integer) 5
```

```java
public void testHyperLogLog() {
    String key = "uvkey";
    stringRedisTemplate.opsForHyperLogLog().add(key, "1");
    Long size = stringRedisTemplate.opsForHyperLogLog().size(key);
    System.out.println("size = " + size);
}
```
