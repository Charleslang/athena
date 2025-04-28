# Hash

Hash 和 ZSet 其实很像，元素都不允许重复。只不过 ZSet 需要额外排序，而 Hash 不需要排序。所以，Hash 底层的编码方式也有两种，分别是 ZipList 和 HT。

Hash 默认采用 ZipList 编码，以节省内存。ZipList 中相邻的两个 entry 分别保存 key 和 value。

当数据量较大时，会转为 HT 编码，触发条件如下（满足任意条件即可）：

- ZipList 中的元素数量超过了 `hash-max-ziplist-entries`（默认 512）
- ZipList 中的任意 entry（key 或者 value）大小超过了 `hash-max-ziplist-value` 字节（默认 64 字节）
