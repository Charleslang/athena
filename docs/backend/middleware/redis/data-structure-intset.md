# IntSet

IntSet 是 Redis 中 set 集合的一种实现方式，基于整数数组实现，具备长度可变、有序、不重复等特征。

其结构如下：

```c
typedef struct intset {
    // 编码方式，支持存放 16 位、32 位、64 位整数。
    // 数组中的每个元素都使用相同的编码方式，这样做是为了方便寻址。寻址的计算公式就是 strat_addr + (encoding * array_index)
    uint32_t encoding;
    // 元素个数
    uint32_t length;
    // 整数数组，保存集合中第一个元素的起始地址
    int8_t contents[];
} intset;
```

在保存元素时，Redis 会按照升序的方式对元素进行排序。如下：

![20250428131922](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428131922.png)

可能你已经注意到了，如果我之前采用的编码方式是 INT_16，也就是每个数字占用 2 个 字节，但是现在我要插入一个 50000 的数字，显然它超过了 2<sup>15</sup> - 1 = 32767。所以，这时候，数组需要扩容以改变每个数字的编码方式。扩容后，显然需要使用 INT_32 来存储，也就是每个数字占用 4 个字节。扩容流程如下：

![20250428133230](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428133230.png)

IntSet 在插入数据的时候会先判断数据是否存在，如果已经存在了，就不会插入了（使用的是二分查找）。
