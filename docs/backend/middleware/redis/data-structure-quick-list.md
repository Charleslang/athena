# QuickList

由于 ZipList 使用的是连续空间，在存放大量数据时，可能没有连续空间可用，导致申请内存的效率变低。为了解决这个问题，我们必须限制单个 ZipList 的长度，可以使用多个 ZipList 来存储大量数据。拆分成多个 ZipList 后，如何让这些 ZipList 之间产生联系呢？Redis 就引入了 QuickList。

QuickList 本质是一个双向链表，里面的每个元素就是一个 ZipList。

![20250428145954](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428145954.png)

![20250428150105](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428150105.png)

![20250428150243](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428150243.png)
