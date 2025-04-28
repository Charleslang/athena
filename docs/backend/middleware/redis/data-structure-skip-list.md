# SkipList

在 ZipList 和 QuickList 中，如果要查找某个元素，则需要遍历整个 List，效率有点低。所以，Redis 引入了 SkipList 来加快查找速度。

SkipList 是跳表，本质上是一个链表，但与传统链表相比，有几点差异：

- 元素升序排序
- 每个节点可以包含多个指针，指针跨度可以不同

![20250428151216](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428151216.png)

![20250428151800](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428151800.png)

SkipList 的特点如下：

- 跳表是一个双向链表，每个节点都包含 score 和 ele 值（ele 是 SDS 类型）
- 节点按照 score 值排序，score 值一样则按照 ele 的字典顺序排序
- 每个节点都可以包含多层指针，层数是 1 到 32 之间（由 Redis 自己判断生成多少层级才合适）
- 不同层指针到下一个节点的跨度不同，层级越高，跨度越大
- 增删改查效率与红黑树基本一致，实现却更简单
- 查找的时候先使用最大层级的指针进行查找，如果满足条件，则继续往后找，如果不满足条件，则把指针进行降级，然后再往后找。
