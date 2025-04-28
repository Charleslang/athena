# RedisObject

Redis 中有各种各样的数据类型，不管是使用哪种类型，Redis 最后都会把数据封装成 RedisObject 类型。

![20250428152748](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428152748.png)

所以，每一种数据类型的头部都会额外占用一些空间。对于 String 来讲，如果 Redis 中有太多 String 类型的数据，那么每个 Key 都会额外占用内存，因此可以考虑把他们合并成集合类型。

![20250428153226](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428153226.png)

![20250428153349](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428153349.png)

里面提到的 HT 就是 dict。
