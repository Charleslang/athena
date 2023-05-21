# 数据类型

:::tip 参考
[Redis data types](https://redis.io/docs/data-types/)  
[Commands](https://redis.io/commands/)
:::

Redis 是一个 key-value 的数据库，key 一般是 String 类型，value 的类型多种多样，如下：

数据类型|备注
---|---
Strings|基本类型
Lists|基本类型
Sets|基本类型
Sorted sets|基本类型
Hashes|基本类型
Streams|特殊类型
HyperLogLogs|特殊类型
Geospatial indexes|特殊类型
Bitmaps|特殊类型
Bitfields|特殊类型

## `help` 命令
`help` 命令用于查看 Redis 的帮助信息，可以查看所有命令的帮助信息，也可以查看某个命令的帮助信息。该命令还可以看到 Redis 的版本信息。

```sh
# 输出 Redis 的版本信息
help
```

查所有数据类型都可以使用的命令：

```sh
help @generic
```
查看 String 类型可以使用的命令：

```sh
help @string
```
查看 `keys` 命令的用法：
```sh
help keys
```

## 通用命令

![20230521180700](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-21/20230521180700.png)

命令|说明
---|---
`KEYS`|查看符合模板的所有 key
`DEL`|删除一个指定的 key
`EXISTS`|判断 key 是否存在
`EXPIRE`|给一个 key 设置有效期，有效期到期时该 key 会被自动删除
`TTL`|查看一个 KEY 的剩余有效期
`TYPE`|返回存储在键中的值类型的字符串表示形式。可以返回的不同类型有：string、list、set、zset、hash 和 stream。

可以通过 `help` 命令查看某些命令的用法，如下：
```sh
# 查看 keys 命令的用法
help keys
```

**示例：**

```sh
# 查看当前数据库的所有 key
keys *

# 查看当前数据库的以 a 开头的 key
keys a*

# 查看当前数据库的以 a 结尾的 key
keys *a

# 匹配两个字符, 第一个字符为 a, 第二个字符为任意字符
keys a?

# 匹配三个字符, 第一个字符为 a, 第二个字符为任意字符, 第三个字符为任意字符
keys a??

# 判断是否有 key 为 name 的数据（keys name 也可以）
exists name

# 删除 key
del k1 k2

# 给 key 设置有效期为 10 秒
expire k1 10

# 查看 key 的剩余有效期（-1 表示永久有效，-2 表示已过期）
ttl k1

# 查看 k1 的 value 是什么类型
type k1
```

:::warning 注意
生产环境中慎用 `keys` 命令，因为 `keys` 命令会遍历所有的 key，如果数据量很大，会导致 Redis 卡顿。因为 Redis 是单线程的，如果执行 `keys` 命令，那么其他命令就会被阻塞。
:::

## String

String 类型是 Redis 中最基本的数据类型，单个 String 类型的值最大可以存储 512MB 的数据。根据字符串的格式不同，又可以分为 3 类：

- string：普通字符串
- int：整数类型，可以做自增、自减操作
- float：浮点类型，可以做自增、自减操作

不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。

命令|说明
---|---
`SET`|添加或者修改已经存在的一个 String 类型的键值对
`GET`|根据 key 获取 String 类型的 value
`MSET`|批量添加多个 String 类型的键值对
`MGET`|根据多个 key 获取多个 String 类型的 value
`INCR`|让一个整型的 key 自增 1, 不能对浮点类型的 key 使用
`INCRBY`|让一个整型的 key 自增并指定步长，例如：incrby num 2 让 num 值自增 2
`INCRBYFLOAT`|让一个浮点类型的数字自增并指定步长, 可以对整型的 key 使用
`DECR`|让一个整型的 key 自减 1, 不能对浮点类型的 key 使用
`DECRBY`|让一个整型的 key 自减并指定步长，例如：decrby num 2 让 num 值自减 2
`SETNX`|添加一个 String 类型的键值对，前提是这个 key 不存在，否则不执行
`SETEX`|添加一个 String 类型的键值对，并且指定有效期

**示例：**

```sh
# 设置单个 key
set k1 v1

# 设置多个 key
mset k1 v1 k2 v2

# 获取单个 key
get k1

# 获取多个 key
mget k1 k2

# 自增
set num "1"
incr num
incrby num 2
incrbyfloat num 2.5

# 自减
set num 10
decr num
decrby num 2
incrby num -2

# 添加一个 key，如果 key 不存在则添加，如果 key 存在则不添加
# 等价于 set k3 v3 NX
setnx k3 v3

# 添加一个 key，并且指定有效期为 10 秒
# 等价于 set k4 v4 EX 10
setex k4 10 v4

# 添加一个 key，并且指定有效期为 10 秒，如果 key 存在则不添加（分布式锁）
set k5 v5 EX 10 NX
```

## List

Redis 中的 List 类型与 Java 中的 LinkedList 类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索，特征也与 LinkedList 类似：
- 有序
- 元素可以重复
- 插入和删除快
- 查询速度一般

常用来存储一个有序数据，例如：朋友圈点赞列表，评论列表等。

命令|说明
---|---
`LPUSH key element ...`|向列表左侧插入一个或多个元素
`LPOP key`|移除并返回列表左侧的第一个元素，没有则返回nil
`RPUSH key element ...`|向列表右侧插入一个或多个元素
`RPOP key`|移除并返回列表右侧的第一个元素
`LRANGE key star end`|返回一段角标范围内的所有元素，不会移除元素
`BLPOP`、`BRPOP`|与 `LPOP` 和 `RPOP` 类似，只不过在没有元素时会等待指定时间，而不是直接返回 nil
`LINDEX key index`|返回指定下标的元素

**示例：**

```sh
# 从左侧插入，看到的顺序是 3 2 1
lpush mylist 1 2 3

# 从右侧插入，看到的顺序是 4 5 6
rpush mylist2 4 5 6

# 从左侧弹出
lpop mylist

# 从右侧弹出
rpop mylist2

# 获取指定范围的元素（-1 表示最后一个元素，-2 表示倒数第二个元素）
lrange mylist 0 -1

# 从左侧弹出，如果没有元素则等待 10 秒，如果这 10 秒内有元素则立即返回，如果等了 10 秒还没有元素则返回 nil
blpop mylist 10
```

## Set

Redis 的 Set 结构与 Java 中的 HashSet 类似，可以看做是一个 value 为 null 的 HashMap。因为也是一个 hash 表，因此具备与 HashSet 类似的特征：
- 无序
- 元素不可重复
- 查找快
- 支持交集、并集、差集等功能

命令|说明
---|---
`SADD key member ...`|向 set 中添加一个或多个元素
`SREM key member ...`|移除 set 中的指定元素
`SCARD key`|返回 set 中元素的个数
`SISMEMBER key member`|判断一个元素是否存在于 set 中
`SMEMBERS`|获取 set 中的所有元素
`SINTER key1 key2 ...`|求 key1 与 key2 的交集
`SUNION key1 key2 ...`|求 key1 与 key2 的并集
`SDIFF key1 key2 ...`|求 key1 与 key2 的差集
`SPOP key`|随机移除并返回 set 中的一个元素

**示例：**

```sh
# 添加元素
sadd myset 1 2 3 4 5

# 移除元素
srem myset 1 2

# 获取元素个数
scard myset

# 判断元素是否存在
sismember myset 1

# 获取所有元素
smembers myset

# 求交集
sinter myset2 myset

# 求并集
sunion myset2 myset

# 求差集
sdiff myset2 myset

# 随机移除并返回一个元素
spop myset
```

## Sorted Set

Redis 的 SortedSet 是一个可排序的 set 集合，与 Java 中的 TreeSet 有些类似，但底层数据结构却差别很大。SortedSet 中的每一个元素都带有一个 score 属性，可以基于 score 属性对元素排序，底层的实现是一个跳表（SkipList）加 hash 表。SortedSet 具备下列特性：

- 可排序
- 元素不重复
- 查询速度快

因为 SortedSet 的可排序特性，经常被用来实现排行榜这样的功能。

命令|说明
---|---
`ZADD key score member`|添加一个或多个元素到 sorted set，如果已经存在则更新其 score 值
`ZREM key member`|删除 sorted set 中的一个指定元素
`ZSCORE key member`|获取 sorted set 中的指定元素的 score 值
`ZRANK key member`|获取 sorted set 中的指定元素的排名
`ZCARD key`|获取 sorted set 中的元素个数
`ZCOUNT key min max`|统计 score 值在给定范围内的所有元素的个数
`ZINCRBY key increment member`|让 sorted set 中的指定元素自增，步长为指定的 increment 值
`ZRANGE key min max`|按照 score 排序后，获取指定排名范围内的元素
`ZRANGEBYSCORE key min max`|按照 score 排序后，获取指定 score 范围内的元素
`ZINTER、ZUNION、ZDIFF`|求交集、并集、差集（Redis 6.2.0 才支持）
`ZINCRBY key increment member`|让 sorted set 中的指定元素自增，步长为指定的 increment 值

注意：所有的排名默认都是升序，如果要降序则在命令的前面添加 REV 即可。

**示例：**

```sh
# 添加元素
zadd z1 1 a 2 b 3 c

# 删除元素
zrem z1 a b

# 获取元素的 score 值
zscore z1 c

# 获取元素的排名
zrank z1 c

# 获取元素个数
zcard z1

# 获取 score 值在指定范围内的元素个数
zcount z1 1 2

# 让元素自增
zincrby z1 2 c

# 获取指定排名范围内的元素
zrange z1 0 -1

# 获取指定 score 范围内的元素
zrangebyscore z1 1 3

# 获取指定排名范围内的元素，降序
zrevrange z1 0 -1

# 自增
zincrby z1 2 c
```

## Hash
Hash 类型也叫散列，其 value 是一个无序字典，类似于 Java 中的 HashMap。 

命令|说明
---|---
`HSET key field value`|添加或者修改 hash 类型 key 的 field 的值
`HGET key field`|获取一个 hash 类型 key 的 field 的值
`HMSET`|批量添加多个 hash 类型 key 的 field 的值
`HMGET`|批量获取多个 hash 类型 key 的 field 的值
`HGETALL`|获取一个 hash 类型的 key 中的所有的 field 和 value
`HKEYS`|获取一个 hash 类型的 key 中的所有的 field
`HVALS`|获取一个 hash 类型的 key 中的所有的 value
`HINCRBY`|让一个 hash 类型 key 的字段值自增并指定步长
`HSETNX`|添加一个 hash 类型的 key 的 field 值，前提是这个 field 不存在，否则不执行
`HLEN`|获取一个 hash 类型的 key 中的 field 的数量
`HEXISTS`|判断一个 hash 类型的 key 中的 field 是否存在
`HDEL`|删除一个 hash 类型的 key 中的 field

**示例：**

```sh
# 往一个 key 中添加 field
hset user:1 name zs
hset user:1 age 13

# 添加一个 hash 类型的 key（从 Redis6 开始，hset 命令支持批量添加，效果和 hmset 一样）
hset user:1 name zs age 13

# 获取一个 hash 类型的 key 的 field 的值
hget user:1 name

# 批量添加多个 hash 类型的 key 的 field 的值
hmset user:2 name ls age 14

# 批量获取多个 hash 类型的 key 的 field 的值
hmget user:2 name age

# 获取一个 hash 类型的 key 中的所有的 field 和 value
hgetall user:1

# 获取一个 hash 类型的 key 中的所有的 field
hkeys user:1

# 获取一个 hash 类型的 key 中的所有的 value
hvals user:1

# 让一个 hash 类型 key 的字段值自增并指定步长
hincrby user:1 count 2

# 添加一个 hash 类型的 key 的 field 值，前提是这个 field 不存在，否则不执行
hsetnx user:1 name zs
```

## key 的层级关系
Redis 没有类似 MySQL 中的表，我们该如何区分不同类型的 key 呢？例如，需要存储用户、商品信息到 Redis，有一个用户 id 是 1，有一个商品 id 恰好也是 1。这两个 key 该如何区分呢？

Redis 中的 key 是有层级关系的，例如：`user:1`、`product:1`，这样就可以区分开来了。这种层级关系的 key，我们称之为复合 key。

```sh
mset user:1 1 user:2 2
```

通过这种方式，我们就能给 key 划分层级，从而区分不同类型的 key。一般来讲，我们会把层级关系的 key 放在一起，例如：`user:1`、`user:2`、`user:3`，这样方便管理。一些客户端也能自动识别这种层级关系的 key，例如：Redis Desktop Manager。默认情况下，Redis Desktop Manager 会把层级关系的 key 放在一起，如下图所示（下图使用的是 RedisInsight）：

![20230521185150](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-21/20230521185150.png)
