# 服务端配置

## 持久化配置

1. 用来做缓存的 Redis 实例尽量不要开启持久化，开启持久化会影响性能。
2. 如果需要持久化，推荐使用 AOF 持久化。
3. 利用脚本定期在 slave 做 RDB 备份。
4. 设置合理的 `rewrite` 策略，避免 AOF 文件过大，同时避免频繁的 `rewrite` 操作。

## 慢查询

在 Redis 中，执行某条命令的耗时超过了某个阈值，我们就把这条命令称为慢查询。慢查询会导致 Redis 主线程阻塞。相关配置如下：

```sh
# 一条命令执行超过多久就算是慢查询，单位是微秒。默认是 10 毫秒
slowlog-log-slower-than 10000
# 慢查询会被记录到慢查询日志中，慢查询日志的文件大小有限，默认是记录 128 条慢查询。（慢查询日志存放在内存中）
# 如果慢查询日志已经达到最大长度，那么 Redis 会从日志队列中移除最老的命令日志，这样便能为新的命令日志腾出空间。
slowlog-max-len 128
```

![20250427174332](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-27/20250427174332.png)

## 内存配置

当 Redis 内存不足时，可能导致 key 被频繁删除，使得响应时间变长。

```sh
# 查看 Redis 内存使用情况
127.0.0.1:6379> info memory
# Memory
used_memory:877120
# 实际占用的内存是 856.56K
used_memory_human:856.56K
used_memory_rss:9560064
used_memory_rss_human:9.12M
used_memory_peak:1644760
# Redis 占用的峰值内存（历史占用的最大内存）
used_memory_peak_human:1.57M
used_memory_peak_perc:53.33%
used_memory_overhead:832792
used_memory_startup:812176
used_memory_dataset:44328
used_memory_dataset_perc:68.26%
allocator_allocated:890288
allocator_active:1183744
allocator_resident:5656576
total_system_memory:3873472512
total_system_memory_human:3.61G
used_memory_lua:30720
used_memory_lua_human:30.00K
used_memory_scripts:0
used_memory_scripts_human:0B
number_of_cached_scripts:0
# Redis 内存使用上限，为 0 表示不限制
maxmemory:0
maxmemory_human:0B
maxmemory_policy:noeviction
allocator_frag_ratio:1.33
allocator_frag_bytes:293456
allocator_rss_ratio:4.78
allocator_rss_bytes:4472832
rss_overhead_ratio:1.69
rss_overhead_bytes:3903488
mem_fragmentation_ratio:11.43
mem_fragmentation_bytes:8723960
mem_not_counted_for_evict:0
mem_replication_backlog:0
mem_clients_slaves:0
mem_clients_normal:20504
mem_aof_buffer:0
mem_allocator:jemalloc-5.1.0
active_defrag_running:0
lazyfree_pending_objects:0
lazyfreed_objects:0
```

可以在配置文件中设置 Redis 的内存上限：

```sh
maxmemory 1gb
```

## 客户端

查看客户端信息：

```sh
127.0.0.1:6379> info clients
# 当前正在连接的客户端的数量
connected_clients:1
cluster_connections:0
maxclients:10000
client_recent_max_input_buffer:24
client_recent_max_output_buffer:0
blocked_clients:0
tracking_clients:0
clients_in_timeout_table:0
```
```sh
# 查看所有正在连接的客户端的详细信息
127.0.0.1:6379> client list
# age 表示连接时长
id=192 addr=127.0.0.1:52234 laddr=127.0.0.1:6379 fd=7 name= age=452 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=26 qbuf-free=40928 argv-mem=10 obl=0 oll=0 omem=0 tot-mem=61466 events=r cmd=client user=default redir=-1
```
