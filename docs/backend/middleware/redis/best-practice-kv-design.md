# Key-Value 设计

Redis 的 key 虽然可以自定义，但最好遵循下面的几个最佳实践约定：

1. 遵循基本格式：[业务名称]:[数据名]:[id]，例如 `login:user:10`。其优点是可读性强、避免 key 冲突、方便管理。
2. 长度不超过 44 字节。key 是 String 类型，底层编码包含 int、embstr（内存占用小于 44 字节时使用，采用连续空间，内存占用少）和 raw 三种。
3. 不包含特殊字符

拒绝 BigKey。什么是 BigKey？BigKey 通常以 key 的大小和 key 中的成员数量以及内存占用情况来综合判断，如下：

1. key 本身占用的空间太大，例如，一个 key 占用了 5 MB 空间。
2. Key 中的成员过多，例如 ZSET 中包含了 10000 个成员。
3. Key 中成员占用内存过多，例如一个 Hash 结构的 key，它的 value 总共占用了 100 MB 内存。

**推荐做法：**

1. 单个 key 的 value 小于 10KB。

```sh
# 查看 mytest 这个 key 及其 value 所占用的空间大小，返回值是字节
# 不要频繁使用 memory 命令，它会占用 CPU
127.0.0.1:6379> memory usage mytest
(integer) 48
```
2. 集合、Hash 类型的 key，其成员不要超过 1000 个。

**BigKey 的危害：**

1. 网络阻塞：对 BigKey 执行读请求时，少量的 QPS 就可能导致带宽使用被占满，从而导致 Redis 实例乃至物理机变慢。
2. 数据倾斜：集群环境下，BigKey 所在的 Redis 实例内存使用率远超其他实例，无法使数据分片的内存资源达到均衡。
3. Redis 阻塞：对元素较多的 hash、list、zset 等做运算会耗时较久，使主线程被阻塞。
4. CPU 压力：对 BigKey 进行序列化和反序列化会导致 CPU 的使用率飙升，影响 Redis 实例和本机其它应用。

**发现潜在的 BigKey：**

1. **redis-cli --bigkeys**：它返回的是 Redis 中每种类型”最多“的 key，其结果只能作为参考，因为排名第一并不意味着它是 BigKey。

```sh
[root@VM-8-2-centos ~]# redis-cli --bigkeys -a 123456
# 扫描所有 key
# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

[00.00%] Biggest list   found so far '"mylist"' with 5 items
[00.00%] Biggest string found so far '"mytest"' with 1 bytes

-------- summary -------

Sampled 2 keys in the keyspace!
Total key length in bytes is 12 (avg len 6.00)

# Redis 中最大的 list 对应的 key 是 mylist，有 5 个元素
Biggest   list found '"mylist"' has 5 items
# Redis 中最大的 string 对应的 key 是 mytest，占用 1 个字节
Biggest string found '"mytest"' has 1 bytes

1 lists with 5 items (50.00% of keys, avg size 5.00)
0 hashs with 0 fields (00.00% of keys, avg size 0.00)
1 strings with 1 bytes (50.00% of keys, avg size 1.00)
0 streams with 0 entries (00.00% of keys, avg size 0.00)
0 sets with 0 members (00.00% of keys, avg size 0.00)
0 zsets with 0 members (00.00% of keys, avg size 0.00)
```

2. **scan**：可以自己写一个程序利用 `scan` 命令扫描并分析 key 的情况（比如 `strlen`、`hlen`）（不要使用 `keys *`，它会扫描所有 key，导致主线程阻塞）。

```sh
# scan 命令会返回一个游标，下次扫描可以传入这个游标进行扫描，游标返回 0 就意味着已经扫描完成
# scan 命令返回的是 key 的名称
127.0.0.1:6379> scan 0
1) "0"
2) 1) "mylist"
   2) "mytest"
```

3. 使用第三方工具 [Redis-Rdb-Tools](https://github.com/sripathikrishnan/redis-rdb-tools) 分析 RDB 文件。

找到 BigKey 之后，我们可以结合业务实际情况，对 key 进行拆分。如何删除 BigKey 呢？不要直接使用 `DEL` 删除 key，可能导致主线程阻塞，应该使用 `unlink xxx` 命令异步删除 key。
