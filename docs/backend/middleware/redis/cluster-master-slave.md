# 主从集群

Redis 单节点的并发能力是有上限的，如果要进一步提高并发，就需要搭建主从集群，实现读写分离。

![20250426192456](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-26/20250426192456.png)

在 Redis 5.0 以前，从节点叫 slave，5.0 开始，从节点被称为 replica。

## 集群搭建

下面使用 3 个 Redis 实例来实现一主两从的架构：

|IP|Port|角色|
|---|---|---|
|192.168.120.10|6380|master|
|192.168.120.10|6381|slave|
|192.168.120.10|6382|slave|

关闭所有实例的 AOF，启用 RDB：

```sh
# 关闭 AOF
appendonly no

# 启用 RDB，把下面的注释掉就行，save 可以不用显示配置，Redis 默认就会使用 save 3600 1、save 300 100、save 60 10000
# save ""
```

复制三个配置文件出来，每个实例使用一个单独的配置文件（可选，因为我这里是同一台机器，所以需要修改）：

```sh
cp redis.conf redis_6380.conf
cp redis.conf redis_6381.conf
cp redis.conf redis_6382.conf
```

修改 Redis 端口（可选，因为我这里是同一台机器，所以需要修改）：

```sh
port 6380
port 6381
port 6382
```

修改 RDB 文件的存放目录（可选，因为我这里是同一台机器，所以需要修改）：

```sh
dir /usr/local/myapp/redis/data/6380
dir /usr/local/myapp/redis/data/6381
dir /usr/local/myapp/redis/data/6382
```

修改 Redis 绑定的 IP（可选，因为我这里是同一台机器，所以需要修改）：

```sh
# 所有的实例改成一样的就行
replica-announce-ip 192.168.120.10
```

修改 pid 文件路径（可选，因为我这里是同一台机器，所以需要修改）：

```sh
pidfile /var/run/redis_6380.pid
pidfile /var/run/redis_6381.pid
pidfile /var/run/redis_6382.pid
```

修改日志文件名称（可选，因为我这里是同一台机器，所以需要修改）：

```sh
logfile "redis_6380.log"
logfile "redis_6381.log"
logfile "redis_6382.log"
```

修改配置文件，开启主从关系（只需要修改从节点的配置文件）：

```sh
# 配置 master 节点的 ip 和端口
# Redis 5.0 以前
slaveof 192.168.120.10 6380

# Redis 5.0 开始，也可以使用下面的方式
replicaof 192.168.120.10 6380

# 从 Redis 2.6 开始，从节点默认是只读的！！！
slave-read-only yes

# 假设 master 节点有登录密码，是 123456
# 需要保证主节点和从节点的密码一致
masterauth 123456
```

也可以在启动 Redis 实例的时候使用启动参数来添加到集群中（临时生效）：

```sh
redis-server --slaveof 192.168.120.10 6380
```

或者执行 Redis 命令添加到集群中（临时生效）：

```sh
slaveof 192.168.120.10 6380
```


启动每个 Redis 实例：

```sh
redis-server redis_6380.conf
redis-server redis_6381.conf
redis-server redis_6382.conf
```

可以在任意一个节点中使用 `info replication` 命令来查看主从信息，如下：

```sh
192.168.120.10:6380> info replication
# 当前节点的角色
role:master
# 从节点的数量
connected_slaves:2
# 从节点的详细信息：IP、PORT、状态、命令(单位:字节长度)偏移量、延迟秒数
# 主节点每次处理完写操作，会把命令的字节长度累加到 master_repl_offset 中。
# 从节点在接收到主节点发送的命令后，会累加记录子什么偏移量信息 slave_repl_offset。同时，也会每秒钟上报自身的复制偏移量到主节点，以供主节点记录存储。
# 在实际应用中，可以通过对比主从复制偏移量信息来监控主从复制健康状况。
slave0:ip=192.168.120.10,port=6381,state=online,offset=23866,lag=0
slave1:ip=192.168.120.10,port=6382,state=online,offset=23866,lag=0
# master 启动时生成的 40 位 16 进制的随机字符串，用来标识 master 节点
master_replid:acc2aaa1f0bb0fd79d7d3302f16bddcbe4add423
master_replid2:0000000000000000000000000000000000000000
# master 命令(单位:字节长度)已写入的偏移量
master_repl_offset:23866
second_repl_offset:-1
# 0/1：关闭/开启复制积压缓冲区标志（Redis 2.8+），主要用于增量复制及丢失命令补救
repl_backlog_active:1
# 缓冲区最大长度，默认 1M
repl_backlog_size:1048576
# 缓冲区起始偏移量
repl_backlog_first_byte_offset:1
# 缓冲区已存储的数据长度
repl_backlog_histlen:23866
```

:::warning 注意
Redis 的主从至少需要 3 个实例，且实例数量最好的单数，这样做可以防止“脑裂”问题。
:::

## 数据同步原理

master 会为每个 slave 都分配一个缓冲区，然后把数据写入缓冲区 `client-output-buffer-limit slave`，从节点会读取缓冲区的数据。

### 全量同步

主从第一次同步是全量同步。当某个节点加入集群中时，从节点会向 master 发送一个 `PSYNC` 命令表示要同步数据，master 会判断该节点是不是第一次加入到集群，如果是，则全量同步。master 执行 `bgsave` 命令生成 RDB 文件，然后把 RDB 文件发送给从节点，从节点会清空本地数据，然后利用 RDB 文件进行同步。生成 RDB 文件期间执行的所有**修改命令**会被保存到 master 的 `repl_baklog`（replication backlog）缓冲区，会随 RDB 文件一起发送给从节点，从节点拿到数据后也会执行这些修改命令。

**master 如何判断某个节点是否是第一次来呢？** 
- master 启动时会生成一个 `master_replid`，从节点会继承这个 ID，所以可以通过从节点的 `master_replid` 来判断是不是第一次来。如果 `master_replid` 不一致，则说明需要进行全量同步。
- 集群中的每个节点都有一个 offset，用于标识当前节点数据同步的进度，从节点的 offset 肯定小于等于 master 节点的 offset。从节点每次完成数据同步后，会修改当前的 offset，如果小于 master 的 offset，则说明需要进行数据同步。如果 offset 为 0，则说明需要进行全量同步。

还有一种场景是，如果 offset 在 master 的 `repl_baklog` 中找不到，则会进行全量同步。

### 增量同步

从节点加入到集群之后，会发送自己的 offset 给 master，master 会根据 offset 到 repl_baklog 中寻找需要同步的数据（会把从 offset 开始到主节点当前最新偏移量之间的所有写命令发送给从节点。），然后把这些数据发送给 slave，从节点每次完成数据同步后，会修改当前的 offset。在 slave 正常连接到 master 的情况下，master 的后台线程会主动将每个写命令实时推送给所有已连接的 slave，slave 持续接收并执行这些命令以保持数据一致。

repl_baklog 是一个固定容量的环形缓冲区，所以，新的数据会覆盖掉老的数据。如果 slave 宕机时间太久，同步数据时就可能丢失部分数据，此时必须再次进行全量同步。

master 进程中只会存在一个 repl_baklog，所有 slave 公用。backlog 的大小通过 `repl-backlog-size` 参数设置，默认大小是 1M。其大小可以根据每秒产生的命令乘以（master 执行 bgsave 生成 RDB 的时间 + master 发送 RDB 到 slave 的时间 + slave load RDB 文件的时间），来估算积压缓冲区的大小，`repl-backlog-size` 的值不应小于这两者的乘积。


## 提高主从性能

- 在 master 节点配置 `repl-diskless-sync yes`，表示全量同步时不使用 RDB 文件进行同步，而是直接将内存中的数据发送给从节点。这样做的好处是可以减少磁盘 IO 的开销，提高性能。缺点是，需要占用大量带宽。

```sh
# 默认是 no
repl-diskless-sync yes
```

- 在 master 节点配置 `maxmemory <bytes>`，表示限制内存的使用量。这样做的好处是减少 RDB 文件的大小，提升全量同步的性能。

```sh
maxmemory 4gb
```

- 适当增加 master `client-output-buffer-limit slave` 的大小。master 在进行全量、增量同步时，会先把数据写入到这个缓冲区，如果 slave 的处理速度小于 master 的写入速度，则会导致 master 的缓冲区被写满，master 会主动断开与 slave 的连接。增加这个参数的大小，可以减少断开连接的概率。

```sh
# 硬限制 512MB，当积压缓冲区达到 512MB 时，Redis 会主动断开与 slave 的连接
# 软限制 256MB，如果 Redis 的积压缓冲区达到 256MB 的时间持续了 60 秒，则 master 会主动断开与 slave 的连接
client-output-buffer-limit slave 512mb 256mb 60
```

- 适当增加 master `repl-backlog-size` 的大小，减少数据丢失的风险。

```sh
repl-backlog-size 5mb
```

- 减少 master 节点上的 slave 的数量，避免过多的 slave 同步数据导致 master 性能下降。此时可以采用 ”主-从-从“ 的模式从 slave 节点同步数据。要实现”从-从“的模式，只需要在 slave 节点配置 `slaveof` 时，将它的 master 设置成 slave 节点的 IP 和端口即可。

![20250426210459](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-26/20250426210459.png)
