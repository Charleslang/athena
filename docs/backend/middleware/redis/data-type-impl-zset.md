# ZSet

ZSet 也就是 Sorted Set，Redis 中的有序集合。它是一个包含唯一元素的集合，每个元素都有一个分数（score），用于排序。ZSet 基于跳表（Skip List）和哈希表（Hash Table）实现的。跳表用于快速查找和插入元素，而哈希表用于存储元素和分数的映射关系。

![20250428170838](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428170838.png)

但是，如果直接这样做，ZSet 就会占用更多的内存空间。当元素数量较少时，HT 和 SkipList 中优势不明显，而且会浪费大量内存。因此，Redis 还引入了 ZipList 来存储 ZSet 以节省内存空间，但是需要同时满足以下条件：

- 元素数量小于 `zset-max-ziplist-entries`（默认值为 128。设置为 0，表示禁用 ZipList）
- 每个元素（key 或者 value）都小于 `zset-max-ziplist-value` 字节（默认值为 64 字节）

在添加过程中，只要任意一个条件不满足，则会进行编码转换（转换数据结构）。

ZipList 本身没有排序功能，而且没有 K-V 的概念，因此进行一些转换:
- ZipList 是连续内存，因此 score 和 element 是紧挨在一起的两个 entry，element 在前，score 在后
- score 越小越接近队首，score 越大越接近队尾，按照 score 值升序排列
