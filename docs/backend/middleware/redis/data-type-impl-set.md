# Set

Redis 中的 Set 是有序不可重复的。除此之外，Set 还需要支持高效地判断元素是否存在、交集、并集、差集等操作。Redis 中的 Set 有两种实现方式：IntSet 和 Dict。

- 当存储的所有数据都是整数且元素数量不超过 `set-max-intset-entries` 时，Redis 会使用 IntSet 进行编码，以节省内存。
- 当存储的元素数量超过 `set-max-intset-entries` 时，Redis 会使用 Dict 进行编码。Dict 的 key 是元素的值，value 是 NULL。

所以，Set 在进行插入操作时，会先判断元素的类型和元素数量，只要任意一个不满足要求，就会将 IntSet 转为 HT（Hash Table，也就是 Dict）。`set-max-intset-entries` 的默认值是 512。

Redis 中的 IntSet 转为 HT 之后，不会再转回 IntSet，因为 Redis 的源码中只有升级的流程，没有降级的流程。这样做是为了避免频繁进行转换导致性能下降。
