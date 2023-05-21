# 简介

:::tip
[Redis 官网](https://redis.io/)
:::

Redis 诞生于 2009 年，全称是 Remote Dictionary Server（远程词典服务器），是一个基于内存的键值型 NoSQL（Not Only SQL） 数据库。

Redis 是一个开源（BSD许可）的内存数据结构存储，可用作数据库、缓存、消息代理和流引擎。Redis 支持 strings、hashes、lists、sets、sorted sets with range queries、bitmaps、hyperloglogs、geospatial indexes、streams 等数据结构。Redis 内置支持复制（replication）、Lua脚本、LRU驱逐、事务和不同级别的磁盘持久化，并通过 Redis Sentinel 和 Redis Cluster 提供高可用性和自动分区。

你可以在这些类型上进行原子操作，比如追加字符串；递增哈希值；将元素压入 list；计算集合的交、并、差；或者得到排序集合中排名最高的元素。

为了达到最佳性能，Redis 使用内存中的数据集。根据您的使用情况，Redis 可以通过定期将数据集转储到磁盘或通过将每个命令附加到基于磁盘的日志来持久化您的数据。如果您只需要一个功能丰富、联网的内存缓存，也可以禁用持久化特性。

Redis 支持异步复制，具有快速的非阻塞同步和自动重连接。

Redis 还支持:
- [Transactions](https://redis.io/topics/transactions)
- [Pub/Sub](https://redis.io/topics/pubsub)
- [Lua scripting](https://redis.io/commands/eval)
- [Keys with a limited time-to-live](https://redis.io/commands/expire)
- [LRU eviction of keys](https://redis.io/docs/reference/eviction)
- [Automatic failover](https://redis.io/topics/sentinel)

你可以在[大多数编程语言](https://redis.io/clients)中使用 Redis。

Redis 是用 C 编写的，可以在大多数 POSIX 系统上工作，如 Linux、*BSD 和 Mac OS X，没有外部依赖。Linux 和 OS X 是 Redis 开发和测试最多的两个操作系统，我们建议使用 Linux 进行部署。Windows 版本没有官方支持。

Redis 特征：
- 键值（key-value）型，value 支持多种不同数据结构，功能丰富
- 单线程，每个命令具备原子性
- 低延迟，速度快（基于内存、IO 多路复用、良好的编码）
- 支持数据持久化
- 支持主从集群、分片集群
- 支持多语言客户端

:::warning 注意
Redis 是 single threaded（单线程）的，尽管从 Redis6 开始支持多线程，但是 Redis 的核心仍然是单线程的，多线程只是用来处理网络 IO，而不是用来处理命令的。
:::
