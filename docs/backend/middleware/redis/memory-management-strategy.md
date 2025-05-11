# 内存管理策略

Redis 之所以如此快，就是因为其使用了内存作为存储介质。然而单节点的 Redis 内存不宜过大，过大会影响持久化和主从同步性能。

我们可以通过以下配置来限制 Redis 的内存使用：

```sh
# Redis 的内存使用限制，默认为 0，表示不限制内存使用
maxmemory 2gb
```

## 过期策略

Redis 中的 key 可以设置过期时间，过期时间到达后，Redis 会自动删除该 key，以释放内存。

Redis 本身是一个 K-V 结构的数据库，因此，数据库中的所有数据都被存放在 Dict 中。Database 的数据结构如下：

```c
/* Redis数据库结构体 */
typedef struct redisDb {
    // 数据库的 key 空间，存放所有的键值对（键为 key，value 是内存地址）
    dict *dict;                 
    // 保存设置了过期时间的 key（只保存设置了 ttl 的 key。其 key 是设置了 ttl 的 key 的名称，value 是过期时间）
    // value 是过期的时间戳，单位是毫秒。例如 10 秒后过期，则 value 就是 now() + 10 * 1000
    dict *expires;              
    // 处于阻塞状态的 key 和相应的 client（主要用于 List 类型的阻塞操作）
    dict *blocking_keys;       
    // 准备好数据可以解除阻塞状态的 key 和相应的 client
    dict *ready_keys;           
    // 被 watch 命令监控的 key 和相应 client
    dict *watched_keys;         
    // 数据库 ID 标识
    int id;
    // 数据库内所有 key 的平均 TTL（生存时间）
    long long avg_ttl;         
} redisDb;
```

Redis 是怎么知道一个 key 是否过期了呢？其实就是通过 `expires` 这个 Dict 判断的，如果 key 在其中，则说明这个 key 设置了过期时间，就可以通过 key 获取到 value 判断是否过期。

Redis 中的过期策略有两种：惰性删除和定期删除。

惰性删除是指，key 过期时，不马上删除，当访问（增、删、改、查）这个 key 的时候，再判断 key 有没有过期，如果过期了，则删除。

定期删除是指，通过一个定时任务，周期性的抽样部分过期的 key 执行删除，执行周期又分为两种：

- Redis 在启动时会创建一个定时任务 serverCron()，按照 server.hz 的频率来，模式为 SLOW
- Redis 的每个事件循环前会调用 beforeSleep() 函数，清理过期 key，模式为 FAST

**SLOW 模式的规则：**  
- 执行频率受 server.hz 影响，默认为 10，即每秒执行 10 次，每隔 100ms 执行一次。
- 清理 key 的耗时不会超过一次执行周期的 25%（也就是 100ms * 25%）。
- 遍历每一个 db 的 expires 哈希表，每次只取其中一个下标的元素，最多抽取 20 个 key（因此可能从多个下标抽取元素）判断是否过期。
- 如果本次清理时间没有超过 100ms * 25% 并且过期 key 的比例大于 25%（清理掉的 key / 本次扫描出来的 key），则再进行一次清理，否则结束。

可以修改 hz 参数，如下：

```sh
# 默认是 10，最大值不能超过 500，超过了就直接使用 500
hz 10
```

Redis 会每隔 `1000/hz` 毫秒清理一次过期的 key。

**FAST 模式的规则：**  
- 执行频率受 beforeSleep() 调用频率影响，但两次 FAST 模式间隔不低于 2ms
- 执行清理耗时不超过 1ms
- 遍历每一个 db 的 expires 哈希表，每次只取其中一个下标的元素，最多抽取 20 个 key（因此可能从多个下标抽取元素）判断是否过期。
- 如果没达到时间上限（1ms）并且并且过期 key 的比例大于 25%（清理掉的 key / 本次扫描出来的 key），则再进行一次清理，否则结束

不管是 SLOW 还是 FAST 模式，都是在主线程中执行的，但通过限制执行时间和频率，可以避免阻塞主线程过久。

```c
void aeMain(EventLoop *eventLoop) {
    // 这个死循环不能直接理解为死循环
    while (true) {
        // 1. 获取最近的时间事件到期时间（决定阻塞时长）
        long timeout = calculateNearestTimer();

        // 2. 通过 I/O 多路复用等待事件（可能阻塞在这里！）。若有文件事件（客户端请求）或时间事件到期，唤醒主线程
        aeApiPoll(eventLoop, timeout);

        // 3. 处理文件事件（如客户端请求）
        processFileEvents();

        // 4. 处理到期的时间事件（如清理过期 key）
        processTimeEvents();
    }
}
```

aeMain 中，其实是先执行了 FAST 模式，再执行 SLOW 模式，只不过每次执行的时候都会判断有没有到执行时间。

**为何不交给后台线程？**  
1. 原子性要求：Redis 的过期清理需要与主线程的数据操作保持原子性，若分离到后台线程，可能引发并发问题。
2. 性能权衡：单线程设计避免了锁开销，通过限制每次清理的时间，平衡内存回收与性能。
3. 简单性：单线程模型更易于维护和调试。

:::warning 注意
Redis 的事件循环（while (true)）并不是一个“忙等待”的死循环，而是基于 I/O 多路复用（如 epoll/kqueue）的高效事件驱动模型。其核心机制是：在没有事件时，主线程会休眠（阻塞），直到有文件事件（客户端请求）或时间事件（定时任务）触发，主线程才会被唤醒并处理事件。因此，Redis 主线程的“死循环”完全能够同时处理客户端请求和定时任务，且不会因循环导致 CPU 空转。
:::

## 内存淘汰策略

由于 Redis 内存有限，当内存使用达到上限时，Redis 会根据配置的内存淘汰策略来删除一些 key（不管 key 有没有过期），以释放内存。每次执行 Redis 命令之前，都会检查内存使用情况（只有 maxmemory > 0 才会检查内存是否可用），如果超过了 maxmemory 的限制，就会执行内存淘汰策略。如果经过淘汰后，Redis 仍然无法满足内存使用限制，则会返回错误。

Redis 支持以下几种内存淘汰策略：

- noeviction：不淘汰任何 key, 达到内存限制时不允许写入新数据，默认就是这种策略。
- volatile-ttl: 对设置了 TTL 的 key，比较 key 的剩余时间，剩余时间越小越先被淘汰。
- allkeys-random: 对全体 key，随机进行淘汰。也就是直接从 db->dict 中随机挑选。
- volatile-random: 对设置了 TTL 的 key，随机进行淘汰。也就是从 db->expires 中随机挑选。
- allkeys-lru：对全体 key，基于 LRU 算法进行淘汰。
- volatile-lru：对设置了 TTL 的 key，基于 LRU 算法进行淘汰。
- allkeys-lfu：对全体 key，基于 LFU 算法进行淘汰。
- volatile-lfu：对设置了 TTL 的 key，基于 LFU 算法进行淘汰。

配置方式如下：

```sh
maxmemory-policy noeviction
```

- LRU（Least Recently Used），最少最近使用。用当前时间减去最后一次访问时间，这个值越大则淘汰优先级越高。
- LFU（Least Frequently Used），最少频率使用。会统计每个 key 的访问频率，值越小淘汰优先级越高。

怎么知道 key 的访问频率呢？Redis 中的每个 key 都被封装成了 RedisObject 对象，RedisObject 中有一个 lru 字段，表示 key 的访问频率。lru 字段是一个 24 位的整数，表示 key 的访问时间戳或者访问次数。Redis 会在每次访问（增、删、改、查） key 的时候，更新 lru 字段。

```c
typedef struct redisObject {
    // 对象类型
    unsigned type:4; /* REDIS_* */
    // 编码方式
    unsigned encoding:4; /* REDIS_ENCODING_* */
    // LRU 时间戳（24 位）
    // 如果淘汰策略是 LRU，那么这个字段就会被设置为 key 最近的访问时间戳（以秒为单位）。
    // 如果淘汰策略是 LFU，那么高 16 位会被设置为 key 最近的访问时间戳（以分钟为单位），低 8 位会被设置为 key 的逻辑访问次数，因为 8 个 bit 只能表示 0-255 的整数。
    unsigned lru:24; /* LRU time (relative to global lru_clock) */
    // 引用计数
    int refcount; /* ref count */
    // 对象的值（指针）
    void *ptr; /* pointer to the actual object */
} robj;
```

Redis 会在每次访问 key 的时候，更新 key 的访问频率。如果是 LRU 策略，则直接更新 lru 字段；如果是 LFU 策略，则会先更新 lru 字段，然后再更新逻辑访问次数。

逻辑访问次数 logc 的更新策略如下：
1. 每次访问时生成一个随机数 r（0~1 之间的随机数）。
2. 计算 `p = 1.0 / (logc_current * lfu_log_factor + 1)`，其中 lfu_log_factor 是配置参数（默认 10）。
3. 若 r < p，则 logc += 1。当 logc 达到 255 时，不再递增，保持最大值。

这样做的好处如下：
- 低频访问的键（logc 小）更易递增，高频键（logc 大）递增概率降低。
- 避免计数器快速饱和（最大值 255），同时保留区分度。

示例：
- 若 logc = 10，则递增概率为 1/(10*10+1) ≈ 0.99%。
- 若 logc = 100，概率为 1/(100*10+1) ≈ 0.099%。

为避免旧键因历史高频访问长期占据内存，Redis 还会定期对 logc 进行衰减。当 key 被访问时，Redis 会检查距离上次衰减的时间（根据高 16 位时间戳计算）。衰减公式是 `logc = logc_current - (minutes_since_last_access * lfu_decay_time)`，其中 lfu_decay_time 是配置参数（默认 1，表示每分钟衰减 1 点）。logc 最小值为 0，衰减后不会为负数。

示例：  
- 若 key 在过去 5 分钟内未被访问，且 lfu_decay_time = 1，则 logc -= 5。

可以通过配置文件调整 LFU 行为：

```sh
# 控制计数器递增概率的斜率。默认为 10
# 值越大：高频键的递增概率下降越快，适合访问模式差异大的场景。
# 值越小：计数器增长更激进，适合需要快速响应变化的场景。
lfu-log-factor 10

# 默认为 1，表示每分钟衰减 1 点。
# 值越大：衰减速度越慢，历史访问权重更高。
# 值越小：衰减速度越快，更侧重近期访问。
lfu-decay-time 1：
```

![20250428194951](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428194951.png)

上图中的 `maxTTL` 其实就是 long 的最大值。

在进行内存淘汰时，如果策略是 random，则随机挑选一个 key 进行删除，某个 key 被删除后，如果剩余可用空间能够满足需求，则淘汰完成，否则继续挑选 key 进行淘汰。如果策略是 lru、lfu、ttl，则会先准备一个 eviction_pool，然后随机挑选 `maxmemory_samples` 个（默认值是 5）key，并根据不同策略计算 idleTime。计算出 idleTime 之后，会尝试把这些 key 按照 idleTime 从小到大进行排序放入 eviction_pool，然后从后往前删除，直到剩余的内存能够满足需求为止。由于 eviction_pool 的容量是有限的，所以并不是每次都会把帅选出来的所有 key 都放入 eviction_pool 中。如果 eviction_pool 的空间充足，则直接放入，否则会把 eviction_pool 中 idleTime 最小的 key 和当前筛选出来的 key 依次进行比较，如果当前 key 的 idleTime 更小，则替换掉 eviction_pool 中的 key。

Redis 的内存淘汰是全局随机行为，不涉及按顺序切换 DB。每次删除的键可能来自任意 DB，因此继续淘汰时可能切换也可能不切换 DB，完全随机。

所以，Redis 中的 LRU 和 LFU 策略是基于采样的，并不是真正意义上的 LRU 和 LFU 策略。这样做是为了避免 Redis 在内存淘汰时，遍历所有的 key，导致性能下降。但是，随着淘汰的增多，那么 Redis 中的 LRU 就越接近真实的 LRU。

`maxmemory_samples` 的默认值是 5，表示每次内存淘汰时，随机采样 5 个 key 来进行 LRU 或 LFU 的计算。可以通过配置文件来修改这个值：

```sh
maxmemory-samples 5
```


**Redis 中 key 过期了一定会被立即删除吗？**  

不一定。如果没有访问该 key，惰性删除不会触发；定期删除也不保证每次都扫到。但它最终会被清除。

**有大量过期 key，怎么快速清除？**

- 使用 `SCAN` 命令遍历所有 key，手动删除过期的 key。
- 使用 `UNLINK` 命令异步删除过期的 key，避免阻塞主线程。
- 使用 `FLUSHDB` 或 `FLUSHALL` 命令清空整个数据库或所有数据库，快速释放内存。
- 调整 `hz` 参数，增加定期删除频率。

**为什么默认的内存淘汰策略是 noeviction？**

防止误删重要数据。
