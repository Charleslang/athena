# String 

String 是 Redis 中最常用的的数据类型，其基本编码方式是 RAW，基于 SDS 实现，存储上限是 512 MB。如下：

![20250428153957](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428153957.png)

如果存储的 SDS 长度小于 44 字节，则会采用 EMBSTR 编码。此时 object head 与 SDS 是一段连续空间。申请内存时只需要调用一次内存分配函数，效率更高。如下：

![20250428154134](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428154134.png)

**为什么是 44 个字节呢？**

先来看看 SDS 的结构：

```c
struct __attribute__ ((__packed__)) sdshdr8 {
    // 字符串的实际长度（uint8 表示 8 bit 的无符号类型）
    uint8_t len; /* used */
    // 实际分配的内存空间
    uint8_t alloc; /* excluding the header and null terminator */
    // 字符串类型，见 #define SDS_TYPE_8 （一个 latin 字符占用 1 个字节）
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    // 存放字符的字符数组
    char buf[];
};

#define SDS_TYPE_5  0
#define SDS_TYPE_8  1
#define SDS_TYPE_16 2
#define SDS_TYPE_32 3
#define SDS_TYPE_64 4
```

如果是 44 个字节，那么 len 只需要使用 1 个字节，alloc 也只需要 1 个字节，flags 也只需要一个字节，buf[] 的末尾需要额外的一个 `\0` 来表示字符串的结束位置，占用 1 个字节。此时 SDS 总共占用字节数量就是 1 + 1 + 1 + 44 + 1 = 48 字节。

再来看看 RedisObject 的结构：

![20250428152748](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428152748.png)

type 占用 4 个 bit 位，encoding 占用 4 个 bit 位，lru 占用 24 个 bit 位，refcount 是 int，占用 4 个字节，void * 指针占用 8 个字节。所以总共占用 (4 + 4 + 24) / 8 + 4 + 8 = 16 字节。

那么，此时一个对象占用 48 + 16 = 64 字节。由于 Redis 的内存分配策略，在 64 个字节时不会产生内存碎片，所以就限制成了 44 个字节。

如果存储的字符串是整数值，并且大小在 LONG_MAX 范围内，则会采用 INT 编码直接将数据保存在 RedisObject 的 ptr 指针位置，不再需要 SDS 了。因为 ptr 指针占用 8 个字节，完全能够容纳数值了，此时的 ptr 就不是指针了，转为保存实际的值。

**String 类型的三种编码方式小结如下：**

![20250428155512](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428155512.png)

在 Redis 中，可以使用命令 `object encoding keyname` 来查看某个 key 的编码方式，如下：

```sh
127.0.0.1:6379> set mytest 123
OK
127.0.0.1:6379> object encoding mytest
"int"
127.0.0.1:6379> set mytest "hello world"
OK
127.0.0.1:6379> object encoding mytest
"embstr"
127.0.0.1:6379> set mytest "hello world123123123123123123123123123123123123123123123"
OK
127.0.0.1:6379> object encoding mytest
"raw"
```

**为什么 Redis 对 String 的限制是 512 MB？**

我们可以查看 Redis 的源码来确认一下：

- Redis 6.0 以前

```c
static int checkStringLength(client *c, long long size) {
    if (size > 512*1024*1024) {
        addReplyError(c,"string exceeds maximum allowed size (512MB)");
        return C_ERR;
    }
    return C_OK;
}
```

- Redis 6.0+

```c
static int checkStringLength(client *c, long long size) {
    if (!(c->flags & CLIENT_MASTER) && size > server.proto_max_bulk_len) {
        addReplyError(c,"string exceeds maximum allowed size (proto-max-bulk-len)");
        return C_ERR;
    }
    return C_OK;
}
```

可以看到，Redis 6.0 以前是在源码中直接写死了 512 MB 的上限，而从 Redis 6 开始，是通过 `server.proto_max_bulk_len` 来限制的。我们可以在配置文件中设置 `proto-max-bulk-len` 来修改这个值，默认是 512 MB。

```sh
proto-max-bulk-len 512mb
```

而通过 SDS 的实现，我们可以发现，Redis 其实最大能够容纳的字符串的长度是 8 个字节的整型，也就是 2^64 - 1 = 18446744073709551615 字节，约等于 16 EB（Exabyte）。可能的原因如下：

1. **内存限制**：Redis 是内存数据库，虽然理论上可以存储非常大的字符串，但是，内存的容量是有限的，所以 Redis 需要限制每个键值对的大小，以保证系统的稳定性和性能。
2. **性能问题**：更大的字符串可能会导致更长的读写操作，因为 Redis 需要更长的时间来处理和传输这些数据。这会增加延迟，并降低 Redis 的性能。

综上所述，Redis 将字符串的最大容量限制为 512MB 是为了在空间和性能上取得平衡。虽然理论上可以存储更大的字符串，但是在实际应用中，512MB 的限制已经足够满足大多数场景的需求。
