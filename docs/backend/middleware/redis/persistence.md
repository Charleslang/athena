# 持久化

由于 Redis 追求高性能，所以会把数据都放在内存中，一旦 Redis 挂掉，那么数据就会丢失。因此，Redis 提供了持久化技术把内存中的数据写入磁盘。

## RDB

:::tip 提示
Redis 默认开启了 RDB 持久化。
:::

RDB 全称是 Redis Database Backup file（Redis 数据备份文件），也称 Redis 数据快照。简单来讲，就是把内存中所有数据都记录到磁盘，当 Redis 重启时，会从磁盘读取快照文件进行恢复（如果启用了 RDB 的话）。快照文件称为 RDB 文件，默认保存在使用 `redis-server` 命令启动 Redis 时所在的目录。

RDB 相关的配置如下：

```sh
# rbd 文件的名称
dbfilename dump.rdb

# 是否压缩 rdb 文件，默认是 yes。压缩过程会耗费 CPU，可设置成 no 关闭压缩（不建议关闭）
rdbcompression yes

# 是否校验 RBD 文件的完整性，默认开启
# 自RDB版本5以来，CRC64校验和被放置在文件的末尾。这使得格式更能抵抗损坏，但在保存和加载 RDB 文件时，会有性能损失（大约 10%），所以你可以禁用它以获得最大的性能。在禁用校验和的情况下创建的RDB文件的校验和为零，这将告诉加载代码跳过检查。
# 如果 CPU 资源紧张，则可以关闭此功能，因为磁盘不值钱。
rdbchecksum yes

# RDB 和 AOF 文件的保存目录，默认是保存在执行 redis-server 命令时所在的目录
dir ./

# 触发 RDB 的时机，可以设置成 save "" 来禁用 RDB
# 默认情况下，会在以下三种情况触发 RDB（此方式是 bgsave）：
# - 在 3600秒（一小时）后，如果至少有一个 key 被修改
# - 在 300秒（5分钟）后，如果至少 100个 key 被修改
# - 在 60 秒后，如果至少 10000 个 key 被修改
save 3600 1
save 300 100
save 60 10000
```

当然，我们也能通过 redis 命令来触发 RDB：

```sh
# 使用主线程执行 RDB，此操作会阻塞主进程
127.0.0.1:6379> save
# fork 一个子进程执行 RDB，fork 期间会阻塞主进程
127.0.0.1:6379> bgsave
```

可以通过 Redis 的日志观察 RDB 的持久化，如下：

```sh
# 满足了哪条规则触发的持久化（此处是 5 秒后修改了 1 个 key，即 save 5 1）
16845:M 26 Apr 2025 17:37:55.970 * 1 changes in 5 seconds. Saving...
# 使用 bgsave 进行持久化
16845:M 26 Apr 2025 17:37:55.971 * Background saving started by pid 16867
16867:C 26 Apr 2025 17:37:55.974 * DB saved on disk
# RDB 持久化时的内存占用情况，采用的是写时复制的方式，因此持久化时，Redis 占用的内存会加倍
16867:C 26 Apr 2025 17:37:55.974 * RDB: 4 MB of memory used by copy-on-write
# RDB 持久化完成
16845:M 26 Apr 2025 17:37:56.071 * Background saving terminated with success
```

:::warning 注意
除此之外，Redis 在停机之前会自动执行 RDB 操作（如果开启了 RDB）。
:::

**小结：**  
RDB 是 Redis 数据库备份文件，本质上是一个快照，采用 fork 子进程和 Copy-On-Write 的方式进行持久化。持久化时，主进程会先 fork 一个子进程，fork 子进程期间，主进程将被阻塞（阻塞时间很短）。fork 完成后，主进程恢复，继续处理请求，由子进程将内存中的数据全量写入新的 RDB 文件。文件写完之后，会使用新的 RDB 文件替换旧的 RDB 文件。这个过程中，子进程与 Redis 主进程共享同一份内存空间，所以子进程可以读取 RDB 文件进行持久化。执行 RDB 期间，主进程中的所有内存页都被设置为只读状态，如果要对某页中的内容进行修改，那么会先把这个页进行拷贝，在拷贝之后的内存页中进行修改，等 RDB 执行完成后，会把这期间产生的修改操作同步到原来的内存区域。RDB 期间被修改的数据以及新的数据不会被写入 RDB 文件，只有等到下一次持久化时才会写入到文件。

**RDB 的缺点：**

- 由于是定时进行持久化操作，所以在两次 RDB 期间写入的数据可能会丢失。
- 如果把 RDB 的执行间隔缩短，那么会导致 Redis 频繁持久化，会降低 Redis 性能。

**每次进行 RDB 都会 fork 一个子进程吗？**  

不会，主进程每次 fork 子进程之前都会判断当前是否有子进程在执行 RDB 操作，如果有，则会忽略掉这次 RDB 请求。为什么这样做？主要是为了提高 Redis 性能，减少资源浪费。比如在执行 RDB 之前，已经有一个子进程在执行 RDB 了，这时候又新开一个子进程去执行 RDB ，如果本次先生成 RDB 文件，那么之前的进程生成的 RDB 文件就会覆盖掉最新生成的，所以本次的 RDB 就没意义了。还有就是，如果之前的 RDB 任务没有执行完，后面后开新的进程执行，会导致任务越积越多，服务器性能会被拉低。

**为什么不在 fork 子进程期间把内存中的数据也全量复制一份？**  

- 内存占用太多，不现实：如果内存中现在有 8G 的数据，那么还需要额外 8G 内存进行 RDB 操作。
- 复制时间长，顶不住：假设是全量复制，数据量 10G，复制这 10G 的时间也够长的。
- Redis 一般情况下是读多写少，没必要全量复制。

**为什么需要采用 Copy-On-Write？**

为了保证数据的一致性。比如 Redis 里两个 key 分别是 k1 和 k2。执行 bgsave 期间，先写了 k1 的值，在写 k2 的值之前，k1 和 k2 被修改了，那么持久化进去的 k2 是修改后的值，而 k1 还是修改之前的值，会造成数据不一致问题。

:::tip 参考
[https://blog.csdn.net/ctwctw/article/details/105147277](https://blog.csdn.net/ctwctw/article/details/105147277)
:::

## AOF

:::tip 提示
Redis 的 AOF 默认是关闭的。
:::

AOF 的全称是 Append Only File，即只追加文件。Redis 处理的每条**修改命令**都会被记录到 AOF 文件，因此，AOF 可以看作是命令的日志文件。当 Redis 重启时，会从磁盘读取 AOF 文件进行恢复（如果启用了 AOF 的话）。

AOF 的相关配置如下：

```sh
# 是否启用 AOF，默认是 no。可设置为 yes 开启 AOF
appendonly no

# AOF 文件的名称
appendfilename "appendonly.aof"

# RDB 和 AOF 文件的保存目录，默认是保存在执行 redis-server 命令时所在的目录
dir ./

# AOF 的持久化时机，默认是 everysec，可选值如下：
# - no：每次只把数据写入 AOF 缓冲区和 Page Cahe，由操作系统决定什么时候进行刷盘
# - always：每次写入 AOF 缓存区后立即调用 fsync 函数刷盘（主线程会被阻塞）。影响写入性能，但是可以保证持久化成功
# - everysec：每隔一秒由后台线程调用 fsync 函数将 Page Cahe 的数据进行刷盘
appendfsync everysec

# 自动重写只追加的文件。
# 当 AOF 日志大小增长到指定的百分比时，Redis 能够自动隐式地调用 BGREWRITEAOF 命令重写日志文件。
# 重写逻辑是，Redis 在最近一次重写后记住 AOF 文件的大小（如果重启后没有发生重写，则使用启动时的 AOF 大小）。将此基本尺寸与当前尺寸进行比较。如果当前大小大于指定的百分比，则触发重写。您还需要指定要重写的 AOF 文件的最小大小，这对于避免重写 AOF 文件很有用，即使达到了百分比增加，但它仍然很小。
# 将 auto-aof-rewrite-percentage 设置为 0 可以禁用自动 AOF 重写功能。
# 比如第一次写入 AOF 文件后，AOF 文件的大小是 10 MB，那么下一次写入 AOF 文件后，如果 AOF 文件的大小增加了 10 MB * 100 % = 10MB，并且文件大小大于等于了 64MB，则触发重写。
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# AOF 文件重写时采用 RDB 和 AOF 的混合格式（默认是 yes）
aof-use-rdb-preamble yes
```

:::warning 注意
- 主进程每次执行修改命令之后，会把这些命令同步写入 AOF 缓冲区和 Page Cache，缓冲区的数据最终会被追加写入到 AOF 文件。
- AOF 文件会被重写，以减少 AOF 文件的大小。重写也是由主进程 fork 出子进程，由子进程执行 AOF 的重写操作。重写的过程是先写一个新的 AOF 文件，写完后替换旧的 AOF 文件。
- 可以执行 Reids 命令 `BGREWRITEAOF` 来重写 AOF 文件，以减少 AOF 文件的内存占用。此命令会将 AOF 文件进行压缩，同时去掉无用的 Redis 命令（例如执行了多次 set namkey 命令，则只保留最后一次的 set 命令）。
- Redis 4.0 开始，rewrite 支持混合模式（也是就是 RDB 和 AOF 一起用）执行重写，直接以 RDB 的方式将二进制内容覆盖到 AOF 文件中，后续再有写入的话还是继续以追加命令的方式写入 AOF 文件，等下次 rewrite 的时候再按照这种方式执行。也就是说这种模式下的 AOF 文件前半部分是 RDB 格式，后半部分是正常的 AOF 追加的命令。
- 如果同时开启了 RDB 和 AOF，则 Redis 会优先使用 AOF 文件进行恢复。因为 AOF 的数据更全面，同时，AOF 文件也可以 rewrite 成 RDB 的二进制格式，文件小，易于恢复。此时的 RDB 可以用于数据备份。
:::

RDB 和 AOF 的对比如下：

||RDB|AOF|
|---|---|---|
|持久化方式|定时对整个内存做快照|记录每一次的修改命令|
|数据完整性|不完整，两次持久化间隔间的数据可能会丢失|相对完整，取决于刷盘策略|
|文件大小|默认压缩，文件体积较小|文件体积较大，可通过 `BGREWRITEAOF` 命令重写|
|数据恢复速度|较快|较慢|
|使用场景|可以容忍分钟级的数据丢失，要求较快的启动速度|对数据安全性要求较高|
