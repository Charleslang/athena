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

由于 Redis 内存有限，当内存使用达到上限时，Redis 会根据配置的内存淘汰策略来删除一些 key（不管 key 有没有过期），以释放内存。每次执行 Redis 命令之前，都会检查内存使用情况（只有 maxmemory > 0 才会检查内存是否可用），如果超过了 maxmemory 的限制，就会执行内存淘汰策略。如果经过淘汰后，Redis 仍然无法满足内存使用限制，则会拒绝本次的写入操作。

Redis 支持以下几种内存淘汰策略：

- noeviction：不淘汰任何 key, 达到内存限制时不允许写入新数据，默认就是这种策略。
- volatile-ttl：对设置了 TTL 的 key，比较 key 的剩余时间，剩余时间越小越先被淘汰。
- allkeys-random：对全体 key，随机进行淘汰。也就是直接从 db->dict 中随机挑选。
- volatile-random：对设置了 TTL 的 key，随机进行淘汰。也就是从 db->expires 中随机挑选。
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

### 内存淘汰原理

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
1. 每次访问时生成一个 `[0, 1)` 的随机数 r。
2. 计算 `p = 1.0 / (logc_current * lfu_log_factor + 1)`，其中 lfu_log_factor 是配置参数（默认 10）。
3. 若 r < p，则 logc += 1。当 logc 达到 255 时，不再递增，保持最大值。

这样做的好处如下：
- 低频访问的键（logc 小）更易递增，高频键（logc 大）递增概率降低。
- 避免计数器快速饱和（最大值 255），同时保留区分度。

示例：
- 若 logc = 10，则递增概率为 1/(10*10+1) ≈ 0.99%。
- 若 logc = 100，概率为 1/(100*10+1) ≈ 0.099%。

当 key 被访问时，Redis 会检查距离上次衰减的时间（根据高 16 位时间戳计算）。衰减公式是 `logc = logc_current - ((nowMinutes - minutes_since_last_access) * lfu_decay_time)`，其中 lfu_decay_time 是配置参数（默认 1，表示每分钟衰减 1 点）。logc 最小值为 0，衰减后不会为负数。例如，若 key 在过去 5 分钟内未被访问，且 lfu_decay_time = 1，则 logc -= 5。

我们会发现，当淘汰策略设置为 lfu 时，某个 key 被访问时，需要同时为访问次数进行时间衰减和访问次数的递增。他们的执行顺序是先衰减（惩罚历史未访问），再基于衰减后的值递增（奖励本次访问），最后更新时间戳。

那这样是不是有问题了，如果某个 key 由于历史原因，它的访问次数非常多，所以这时它的 logc 会很大。但是在今后很长的一段时间内，这个 key 都没有被再次访问了，岂不是它的 logc 会一直保持在一个很大的值吗？这样就会导致这个 key 很难被淘汰。其实并不会，因为 Redis 在进行内存淘汰的时候，会再次计算一下这个 key 的访问次数。

可以通过配置文件调整 LFU 行为：

```sh
# 控制计数器递增概率的斜率。默认为 10
# 值越大，高频键的递增概率越小
lfu-log-factor 10

# 默认为 1，表示每分钟衰减 1 点。
# 值越大：衰减速度越快
lfu-decay-time 1：
```

![20250428194951](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428194951.png)

上图中的 `maxTTL` 其实就是 long 的最大值。

只有 maxmemory > 0（默认是 0），Redis 才会检查内存是否足够。Redis 每次执行任何命令之前，会计算本次操作需要多少存储空间，如果剩余空间不足，则进行内存淘汰。

内存淘汰的逻辑如下：

**random：**  

1. 记录淘汰开始时间。
2. 从 db 为 0 的数据库开始，随机选择一个 key 进行删除，如果删除之后释放的内存空间大于等于本次所需的内存空间，则淘汰完成；否则继续遍历下一个 db（对数据库数量取模），随机选择一个 key 进行删除。

**TTL、LRU、LFU：**

1. 记录淘汰开始时间。
2. 准备一个容量等于 16 的 eviction_pool，本质是个数组，eviction_pool 中的每个元素包含了 key、dbid、idle 等信息。
3. 从 db 为 0 的数据库开始依次遍历所有数据库，从每个库随机挑选 `maxmemory_samples` 个（默认值是 5）key，并根据不同策略计算 idle，然后把这些 key 放入 eviction_pool 中。放入 eviction_pool 之后，会按照 idle 从小到大进行排序。如果 eviction_pool 中的数量达到了 16，则会尝试使用本次筛选出来的所有 key 替换 eviction_pool 中已经存在的 key，如果当前 key 的 idle 更大，则进行替换，否则丢弃当前 key，整个过程依然会保持 eviction_pool 的 key 按照 idle 从小到大进行排序。
4. 淘汰 eviction_pool 中最后一个 key（idle 最大的 key），如果删除之后释放的内存空间大于等于本次所需的内存空间，则淘汰完成；否则继续执行步骤 3。

从上面我们知道了，Redis 每次进行内存淘汰时，只会删除一个 key，每次删除完成后，都会检查一下释放的内存是否已经满足本次所需的内存空间。如果满足，则淘汰完成，否则继续执行下一次淘汰。由于淘汰是在主线程中执行，是否意味着主线程可能造成长时间的阻塞呢？其实 Redis 每经过 16 次淘汰后，会检查一下淘汰经历的时间是否超时了，如果超时，则会开启一个后台任务执行淘汰，然后结束本次淘汰，以便让主线程执行后续操作。此时，主线程如果执行的是写操作，并且操作系统的剩余内存足够，那么本次写操作依然能够正常执行，这就可能导致 Redis 内存使用量暂时超过 maxmemory 的限制；如果操作系统的剩余内存不足，那么本次写操作会失败。

所以，Redis 中的 LRU 和 LFU 策略是基于采样的，并不是真正意义上的 LRU 和 LFU。这样做是为了避免 Redis 在内存淘汰时，遍历所有的 key，导致性能下降。但是，随着淘汰的增多，Redis 中的 LRU 就越接近真实的 LRU。

`maxmemory_samples` 的默认值是 5，表示每次内存淘汰时，随机采样 5 个 key 来进行 LRU 或 LFU 的计算。可以通过配置文件来修改这个值：

```sh
maxmemory-samples 5
```

**Redis 中 key 过期了一定会被立即删除吗？**  

不一定。如果没有访问该 key，那么惰性删除不会触发；定期删除也不保证每次都扫到。但它最终会被清除。

**有大量过期 key，怎么快速清除？**

- 使用 `SCAN` 命令遍历所有 key，手动删除过期的 key。
- 使用 `UNLINK` 命令异步删除过期的 key，避免阻塞主线程。
- 使用 `FLUSHDB` 或 `FLUSHALL` 命令清空整个数据库或所有数据库，快速释放内存。
- 调整 `hz` 参数，增加定期删除频率。

**为什么默认的内存淘汰策略是 noeviction？**

防止误删重要数据。


### 内存淘汰源码

- [server.c](https://github.com/redis/redis/blob/unstable/src/server.c#L4167)

```c
if (server.maxmemory && !isInsideYieldingLongCommand()) {
    // 仅当 performEvictions 返回 EVICT_FAIL 时，才认为 OOM
    int out_of_memory = (performEvictions() == EVICT_FAIL);

    /* performEvictions may evict keys, so we need flush pending tracking
        * invalidation keys. If we don't do this, we may get an invalidation
        * message after we perform operation on the key, where in fact this
        * message belongs to the old value of the key before it gets evicted.*/
    trackingHandlePendingKeyInvalidations();

    /* performEvictions may flush slave output buffers. This may result
        * in a slave, that may be the active client, to be freed. */
    if (server.current_client == NULL) return C_ERR;

    // 仅当 performEvictions 返回 EVICT_FAIL 时，才会拒绝本次写操作
    if (out_of_memory && is_denyoom_command) {
        rejectCommand(c, shared.oomerr);
        return C_OK;
    }

    /* Save out_of_memory result at command start, otherwise if we check OOM
        * in the first write within script, memory used by lua stack and
        * arguments might interfere. We need to save it for EXEC and module
        * calls too, since these can call EVAL, but avoid saving it during an
        * interrupted / yielding busy script / module. */
    server.pre_command_oom_state = out_of_memory;
}
```

- [evict.c](https://github.com/redis/redis/blob/unstable/src/evict.c#L380)

```c
int performEvictions(void) {
    /* Note, we don't goto update_metrics here because this check skips eviction
     * as if it wasn't triggered. it's a fake EVICT_OK. */
    if (!isSafeToPerformEvictions()) return EVICT_OK;

    int keys_freed = 0;
    size_t mem_reported, mem_tofree;
    long long mem_freed; /* May be negative */
    mstime_t latency;
    int slaves = listLength(server.slaves);
    int result = EVICT_FAIL;

    // 检查内存是否足够，并计算本次操作所需要的内存
    if (getMaxmemoryState(&mem_reported,NULL,&mem_tofree,NULL) == C_OK) {
        result = EVICT_OK;
        goto update_metrics;
    }

    // 如果淘汰策略是 noeviction，则直接返回 EVICT_FAIL
    if (server.maxmemory_policy == MAXMEMORY_NO_EVICTION) {
        result = EVICT_FAIL;  /* We need to free memory, but policy forbids. */
        goto update_metrics;
    }

    // 计算淘汰的时间限制
    unsigned long eviction_time_limit_us = evictionTimeLimitUs();

    mem_freed = 0;

    latencyStartMonitor(latency);

    monotime evictionTimer;
    elapsedStart(&evictionTimer);

    /* Try to smoke-out bugs (server.also_propagate should be empty here) */
    serverAssert(server.also_propagate.numops == 0);
    /* Evictions are performed on random keys that have nothing to do with the current command slot. */

    // 如果释放的内存小于本次所需的内存，则继续执行淘汰
    while (mem_freed < (long long)mem_tofree) {
        int j, k, i;
        static unsigned int next_db = 0;
        sds bestkey = NULL;
        int bestdbid;
        redisDb *db;
        dictEntry *de;

        // 如果内存淘汰策略是 VOLATILE_TTL、LRU 或 LFU，则需要准备一个容量为 16 的 eviction_pool
        if (server.maxmemory_policy & (MAXMEMORY_FLAG_LRU|MAXMEMORY_FLAG_LFU) ||
            server.maxmemory_policy == MAXMEMORY_VOLATILE_TTL)
        {
            struct evictionPoolEntry *pool = EvictionPoolLRU;
            // 如果没找到需要淘汰的 key，则需要重新填充 eviction_pool
            while (bestkey == NULL) {
                unsigned long total_keys = 0;

                // 遍历所有 db，每个 db 中随机选择 maxmemory_samples 个 key 放入 eviction_pool
                for (i = 0; i < server.dbnum; i++) {
                    db = server.db+i;
                    kvstore *kvs;
                    // 判断淘汰策略是 allkeys 还是 volatile
                    if (server.maxmemory_policy & MAXMEMORY_FLAG_ALLKEYS) {
                        kvs = db->keys;
                    } else {
                        kvs = db->expires;
                    }
                    unsigned long sampled_keys = 0;
                    unsigned long current_db_keys = kvstoreSize(kvs);
                    // 如果 key 的数量为 0，则跳过
                    if (current_db_keys == 0) continue;

                    total_keys += current_db_keys;
                    // 获取当前 dict 中 key 的数量
                    int l = kvstoreNumNonEmptyDicts(kvs);
                    /* Do not exceed the number of non-empty slots when looping. */
                    while (l--) {
                        // 取出 5 个 key 放入 eviction_pool
                        sampled_keys += evictionPoolPopulate(db, kvs, pool);
                        /* We have sampled enough keys in the current db, exit the loop. */
                        if (sampled_keys >= (unsigned long) server.maxmemory_samples)
                            break;
                        /* If there are not a lot of keys in the current db, dict/s may be very
                         * sparsely populated, exit the loop without meeting the sampling
                         * requirement. */
                        if (current_db_keys < (unsigned long) server.maxmemory_samples*10)
                            break;
                    }
                }
                if (!total_keys) break; /* No keys to evict. */

                /* Go backward from best to worst element to evict. */
                for (k = EVPOOL_SIZE-1; k >= 0; k--) {
                    if (pool[k].key == NULL) continue;
                    bestdbid = pool[k].dbid;

                    kvstore *kvs;
                    if (server.maxmemory_policy & MAXMEMORY_FLAG_ALLKEYS) {
                        kvs = server.db[bestdbid].keys;
                    } else {
                        kvs = server.db[bestdbid].expires;
                    }
                    de = kvstoreDictFind(kvs, pool[k].slot, pool[k].key);

                    /* Remove the entry from the pool. */
                    if (pool[k].key != pool[k].cached)
                        sdsfree(pool[k].key);
                    pool[k].key = NULL;
                    pool[k].idle = 0;

                    /* If the key exists, is our pick. Otherwise it is
                     * a ghost and we need to try the next element. */
                    // 仅删除 eviction_pool 中最后一个 key 
                    if (de) {
                        bestkey = dictGetKey(de);
                        break;
                    } else {
                        /* Ghost... Iterate again. */
                    }
                }
            }
        }

        // 如果淘汰策略是 volatile-random 和 allkeys-random policy
        else if (server.maxmemory_policy == MAXMEMORY_ALLKEYS_RANDOM ||
                 server.maxmemory_policy == MAXMEMORY_VOLATILE_RANDOM)
        {
            // 遍历所有 db，每个 db 中随机选择一个 key 进行删除
            for (i = 0; i < server.dbnum; i++) {
                // 注意，这里的 next_db 自增了 1
                j = (++next_db) % server.dbnum;
                // 获取下一个 db，这里的 db 是 server.db[j]
                db = server.db+j;
                kvstore *kvs;
                // 判断淘汰策略是 allkeys 还是 volatile
                if (server.maxmemory_policy == MAXMEMORY_ALLKEYS_RANDOM) {
                    kvs = db->keys;
                } else {
                    kvs = db->expires;
                }

                // 随机选择一个 key 进行删除
                int slot = kvstoreGetFairRandomDictIndex(kvs);
                de = kvstoreDictGetRandomKey(kvs, slot);
                if (de) {
                    bestkey = dictGetKey(de);
                    bestdbid = j;
                    break;
                }
            }
        }

        // 如果找到了可以被删除的 key，则进行删除，以便释放内存
        if (bestkey) {
            long long key_mem_freed;
            // 计算应该从哪个 db 中删除 key
            db = server.db+bestdbid;

            // 删除 key，并释放内存
            enterExecutionUnit(1, 0);
            robj *keyobj = createStringObject(bestkey,sdslen(bestkey));
            deleteEvictedKeyAndPropagate(db, keyobj, &key_mem_freed);
            decrRefCount(keyobj);
            exitExecutionUnit();
            /* Propagate the DEL command */
            postExecutionUnitOperations();

            // 计算累计释放掉的所有内存
            mem_freed += key_mem_freed;
            // 计算释放内存的次数（也就是删除 key 的次数）
            keys_freed++;

            // 每当删除了 16 个 key，就检查一下是否超过了时间限制
            if (keys_freed % 16 == 0) {
                /* When the memory to free starts to be big enough, we may
                 * start spending so much time here that is impossible to
                 * deliver data to the replicas fast enough, so we force the
                 * transmission here inside the loop. */
                if (slaves) flushSlavesOutputBuffers();

                /* Normally our stop condition is the ability to release
                 * a fixed, pre-computed amount of memory. However when we
                 * are deleting objects in another thread, it's better to
                 * check, from time to time, if we already reached our target
                 * memory, since the "mem_freed" amount is computed only
                 * across the dbAsyncDelete() call, while the thread can
                 * release the memory all the time. */
                if (server.lazyfree_lazy_eviction) {
                    if (getMaxmemoryState(NULL,NULL,NULL,NULL) == C_OK) {
                        break;
                    }
                }

                /* After some time, exit the loop early - even if memory limit
                 * hasn't been reached.  If we suddenly need to free a lot of
                 * memory, don't want to spend too much time here.  */
                // 如果淘汰的时间超过了某个阈值，则结束本次淘汰 
                if (elapsedUs(evictionTimer) > eviction_time_limit_us) {
                    // 开启后台线程执行淘汰
                    startEvictionTimeProc();
                    break;
                }
            }
        } else {
            goto cant_free; /* nothing to free... */
        }
    }
    /* at this point, the memory is OK, or we have reached the time limit */
    // 如果淘汰的时间超过了阈值，则设置状态为 EVICT_RUNNING
    result = (isEvictionProcRunning) ? EVICT_RUNNING : EVICT_OK;

cant_free:
    if (result == EVICT_FAIL) {
        /* At this point, we have run out of evictable items.  It's possible
         * that some items are being freed in the lazyfree thread.  Perform a
         * short wait here if such jobs exist, but don't wait long.  */
        mstime_t lazyfree_latency;
        latencyStartMonitor(lazyfree_latency);
        while (bioPendingJobsOfType(BIO_LAZY_FREE) &&
              elapsedUs(evictionTimer) < eviction_time_limit_us) {
            if (getMaxmemoryState(NULL,NULL,NULL,NULL) == C_OK) {
                result = EVICT_OK;
                break;
            }
            usleep(eviction_time_limit_us < 1000 ? eviction_time_limit_us : 1000);
        }
        latencyEndMonitor(lazyfree_latency);
        latencyAddSampleIfNeeded("eviction-lazyfree",lazyfree_latency);
    }

    latencyEndMonitor(latency);
    latencyAddSampleIfNeeded("eviction-cycle",latency);

update_metrics:
    if (result == EVICT_RUNNING || result == EVICT_FAIL) {
        if (server.stat_last_eviction_exceeded_time == 0)
            elapsedStart(&server.stat_last_eviction_exceeded_time);
    } else if (result == EVICT_OK) {
        if (server.stat_last_eviction_exceeded_time != 0) {
            server.stat_total_eviction_exceeded_time += elapsedUs(server.stat_last_eviction_exceeded_time);
            server.stat_last_eviction_exceeded_time = 0;
        }
    }
    return result;
}

/* Algorithm for converting tenacity (0-100) to a time limit.  */
// 方法返回值是微秒 us，1 ms = 1000 us
static unsigned long evictionTimeLimitUs(void) {
    serverAssert(server.maxmemory_eviction_tenacity >= 0);
    serverAssert(server.maxmemory_eviction_tenacity <= 100);

    if (server.maxmemory_eviction_tenacity <= 10) {
        /* A linear progression from 0..500us */
        return 50uL * server.maxmemory_eviction_tenacity;
    }

    if (server.maxmemory_eviction_tenacity < 100) {
        /* A 15% geometric progression, resulting in a limit of ~2 min at tenacity==99  */
        return (unsigned long)(500.0 * pow(1.15, server.maxmemory_eviction_tenacity - 10.0));
    }

    // 返回 long 的最大值
    return ULONG_MAX;   /* No limit to eviction time */
}
```

可以通过 Redis 配置文件设置 maxmemory-eviction-tenacity 参数来控制内存淘汰的时间限制。默认值是 10，表示 500us 的时间限制。可以设置为 0-100 之间的整数，值越大，时间限制越长。

```sh
# Eviction processing is designed to function well with the default setting.
# If there is an unusually large amount of write traffic, this value may need to
# be increased.  Decreasing this value may reduce latency at the risk of 
# eviction processing effectiveness
#   0 = minimum latency, 10 = default, 100 = process without regard to latency
#
# maxmemory-eviction-tenacity 10
```
