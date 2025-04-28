# Dict

Redis 是一个 K-V 数据库，我们可以根据 key 快速找到对应的 value，而 key 和 value 的映射关系正是使用 Dict 来实现的。

Dict 由三部分组成：hash 表（底层是数组，存放每个元素）、entry（hash 表中的元素类型，k-v 结构），dict 字典

```c
// entry
typedef struct dictEntry {
    // key
    void *key;
    // value
    void *val;
    // 下一个元素的指针（解决 hash 冲突）
    struct dictEntry *next;
} dictEntry;

typedef struct dictType {
    unsigned int (*hashFunction)(const void *key);
    void *(*keyDup)(void *privdata, const void *key);
    void *(*valDup)(void *privdata, const void *obj);
    int (*keyCompare)(void *privdata, const void *key1, const void *key2);
    void (*keyDestructor)(void *privdata, void *key);
    void (*valDestructor)(void *privdata, void *obj);
} dictType;

typedef struct dict {
    // hash 表
    dictEntry **table;
    dictType *type;
    // hash 表的容量，始终是 2 的幂
    unsigned long size;
    // hash 掩码，始终是 size - 1（使用 hash(key) & sizemask 计算存放的位置）
    unsigned long sizemask;
    // hash 表中真实的元素个数
    unsigned long used;
    void *privdata;
} dict;

// 真正使用的其实是这个 dict
struct dict {
    // dict 的类型
    dictType *type;

    // hash 表，其实最终只使用其中的一个，用于 rehash
    dictEntry **ht_table[2];
    unsigned long ht_used[2];

    // rehash 的下标
    long rehashidx; /* rehashing not in progress if rehashidx == -1 */

    /* Keep small vars at end for optimal (minimal) struct padding */
    unsigned pauserehash : 15; /* If >0 rehashing is paused */

    unsigned useStoredKeyApi : 1; /* See comment of storedHashFunction above */
    signed char ht_size_exp[2]; /* exponent of size. (size = 1<<exp) */
    int16_t pauseAutoResize;  /* If >0 automatic resizing is disallowed (<0 indicates coding error) */
    void *metadata[];
};
```

由此可知，Redis 中的 Dict 是基于数组和链表的方式来实现的。但是，如果冲突比较多，那么链表中的元素个数就会变多，查询效率就会下降。Redis 也考虑到了这种情况，在插入元素之前会尝试进行扩容操作，如下：

![20250428140258](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428140258.png)

每次删除元素后，也会尝试收缩 hash 表。

在进行扩容和收缩的时候会进行 rehash（和 hashMap 的元素迁移很相似）操作，如下：

![20250428140946](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428140946.png)

由于 rehash 是在主线程中进行的，所以，如果元素数量较多，就可能阻塞主线程，Redis 采用了一种渐进式 rehash 策略来实现 rehash。当需要进行 rehash 操作时，Redis 会把 hash 表的一个标志位 rehashidx 设置为 0，然后在后续进行增、删、改、查的时候会都检查这个标志位是否大于 0。如果大于 0，则将 dict.ht[0].table[rehashidx] 的 entry 链表 rehash 到 dict.ht[1]，并且将 rehashidx++，直到 dict.ht[0] 的所有数据都 rehash 到 dict.ht[1] 中（如果 rehashidx 的大小等于 dict[0] 的 used，则说明迁移完成）。也就是每次 rehash 时只迁移一个下标的元素。

在数据迁移的过程中，每次迁移完成后都会将原来下标对应的元素清空，也就是说 dict.ht[0] 和 dict.ht[1] 中组合起来的数据才是真实的数据。所以在进行查询、修改、删除操作时，这两个 dict.ht 都要执行同样的操作，而插入操作只在 dict.ht[1] 中执行。所以，优化后的 rehash 流程如下：

![20250428142557](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428142557.png)

总的来讲，Redis 中的 Dict 和 Java 的 HashMap 很相似。
