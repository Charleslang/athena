# 动态字符串 SDS

我们都知道，Redis 中的 key 通常都是字符串， value 往往是字符串或者字符串的集合。由此可见，字符串是 Redis 中最重要的数据类型之一。

C 语言中的字符串有如下特征：

1. 字符串是以 '\0' 结尾的字符数组。
2. 非二进制安全。比如，字符串中包含 '\0' 字符时，字符串的长度会被截断。例如 `"hello\0world"` 的长度是 5，而不是 11。
3. 获取字符串的长度需要在运行时遍历整个字符数组，效率较低。
4. 字符串本身是不可变的，修改字符串的内容需要重新分配内存。

Redis 中的字符串是以 SDS（Simple Dynamic String）来实现的，SDS 是 Redis 自定义的一种字符串数据结构。其特点如下：

1. 动态字符串，可以根据需要自动扩展和收缩。扩容时会分配比实际需要更多的内存，以减少频繁的内存分配和释放操作。
3. 二进制安全。存储了字符串的长度，可以避免 '\0' 字符的截断问题，获取字符串长度的时间复杂度为 O(1)，而不是 O(n)。

Redis 中定义了多种 SDS 结构体，分别用于存储不同长度的字符串。如下：

```c
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    // 字符串的实际长度（uint8 表示 8 字节的无符号类型）
    uint8_t len; /* used */
    // 实际分配的内存空间
    uint8_t alloc; /* excluding the header and null terminator */
    // 字符串类型，见 #define SDS_TYPE_8 
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    // 存放字符的字符数组
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};

#define SDS_TYPE_5  0
#define SDS_TYPE_8  1
#define SDS_TYPE_16 2
#define SDS_TYPE_32 3
#define SDS_TYPE_64 4
```

:::tip 参考
[sds.h](https://github.com/redis/redis/blob/unstable/src/sds.h)
:::

一个完整的字符串存储结构示例图如下：

![20250428130558](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-28/20250428130558.png)
