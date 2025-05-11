# ZipList

Dict 采用的是数组和链表的方式实现，链表在逻辑上是不连续的，所以查询效率不高，并且指针也会占用额外内存。所以，Redis 引入了 ZipList 来解决内存占用过多的问题。

ZipList 顾名思义是压缩列表，是一种特殊的 Deque，由一系列的连续内存组成，且读操作的时间复杂度是 O(n)。

![20250428143718](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428143718.png)

![20250428143740](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428143740.png)

![20250428144417](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428144417.png)

从上面的结构中，我们可以得知，ZipList 存在连锁更新问题。一旦某个 entry 占用的空间发生了变化，那么其后面的所有 entry 可能都会被跟着修改。如下：

![20250428144858](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428144858.png)


ZipList 的特征如下：

- 压缩列表的可以看做一种连续内存空间的 Deque。
- 列表的节点之间不是通过指针连接，而是记录上一节点和本节点长度来寻址，内存占用较低。
- 如果列表数据过多，会导致链表过长，可能影响查询性能。
- Ziplist 的查询时间复杂度为 O(n)，list 的 LPOP/RPOP 操作时间复杂度是 O(1)，牺牲查询效率以换取内存节省。存储小规模数据时，内存占用远低于链表或哈希表。
- 新增或删除较大数据时有可能发生连锁更新问题。
