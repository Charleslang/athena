# 分片（Cluster）集群

在前面，我们搭建了 [主从集群](./cluster-master-slave.html) 和 [哨兵集群](./cluster-sentinel.html)。虽然他们可以解决高可用问题，但是依然存在其他问题：

- 本质上还是使用的单机 Redis 的数据存储方式，由于单个 Redis 实例的内存有限，数据量大了就会出现内存不足的问题。
- 他们适用于读多写少的场景，如果是写多读少的场景，主从集群和哨兵集群就不适用了。

所以，我们需要使用分片集群来解决这个问题。Redis 的分片集群是通过将数据分散到多个 Redis 节点上来实现的，每个 Redis 节点只存储一部分数据，这样就可以突破单个节点的内存限制。

分片集群的特征如下：

- 集群中有多个 master 节点，每个 master 节点保存不同的数据
- 每个 master 都可以有多个 slave 节点
- 每个 master 之间通过 `ping` 检测彼此的状态
- 客户端可以访问集群中的任意节点，请求最终都会被路由到正确的节点

![20250427145519](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-27/20250427145519.png)

分片集群的搭建方式有两种：**手动分片**和**自动分片**。手动分片是指我们自己将数据分散到多个 Redis 节点上，自动分片是指 Redis 自动将数据分散到多个 Redis 节点上。Redis 的自动分片是通过 Redis Cluster 来实现的。Redis Cluster 是 Redis 官方提供的分布式解决方案，它可以将数据自动分散到多个 Redis 节点上，并且支持高可用和故障转移。

## 集群搭建

此处使用 3 个 master 实例，每个 master 分配一个 slave 节点，如下：

|IP|Port|角色|
|---|---|---|
|192.168.120.10|8001|master|
|192.168.120.10|8002|master|
|192.168.120.10|8003|master|
|192.168.120.10|9001|slave|
|192.168.120.10|9002|slave|
|192.168.120.10|9003|slave|

创建目录：

```sh
mkdir -p /usr/local/myapp/redis/cluster/8001
mkdir -p /usr/local/myapp/redis/cluster/8002
mkdir -p /usr/local/myapp/redis/cluster/8003
mkdir -p /usr/local/myapp/redis/cluster/9001
mkdir -p /usr/local/myapp/redis/cluster/9002
mkdir -p /usr/local/myapp/redis/cluster/9003
```

创建配置文件：

```sh
cd /usr/local/myapp/redis/cluster/8001
touch redis_8001.conf

# 开启集群模式 
echo "cluster-enabled yes" >> redis_8001.conf
# 集群配置文件名称，不需要我们自己创建，由 Redis 自己维护
echo "cluster-config-file /usr/local/myapp/redis/cluster/8001/nodes.conf" >> redis_8001.conf
# 节点心跳的超时时间，单位是毫秒
echo "cluster-node-timeout 30000" >> redis_8001.conf

# Redis 的端口
echo "port 8001" >> redis_8001.conf
# 本地数据存储目录
echo "dir /usr/local/myapp/redis/cluster/8001" >> redis_8001.conf
# pid
echo "pidfile /var/run/redis_8001.pid" >> redis_8001.conf
# 日志文件
echo 'logfile "/usr/local/myapp/redis/cluster/8001/redis_8001.log"' >> redis_8001.conf
# 可以使用什么 IP 访问 Redis
echo "bind 0.0.0.0" >> redis_8001.conf
# Redis 后台运行
echo "daemonize yes" >> redis_8001.conf
# 绑定的机器的 IP
echo "replica-announce-ip 192.168.120.10" >> redis_8001.conf
# 数据库数量，Cluster 集群下，只能有一个数据库
echo "databases 1" >> redis_8001.conf
# 关闭保护模式
echo "protected-mode no" >> redis_8001.conf
# 设置密码，所有节点的密码应该保持一致
echo "masterauth 123456" >> redis_8001.conf
echo "requirepass 123456" >> redis_8001.conf
```

复制一份，修改端口和目录：

```sh
cd /usr/local/myapp/redis/cluster/8002
touch redis_8002.conf
cp ../cluster/redis_8001.conf redis_8002.conf
sed -i -e 's/8001/8002/g' redis_8002.conf

cd /usr/local/myapp/redis/cluster/8003
touch redis_8003.conf
cp ../cluster/redis_8001.conf redis_8003.conf
sed -i -e 's/8001/8003/g' redis_8003.conf

cd /usr/local/myapp/redis/cluster/9001
touch redis_9001.conf
cp ../cluster/redis_8001.conf redis_9001.conf
sed -i -e 's/8001/9001/g' redis_9001.conf

cd /usr/local/myapp/redis/cluster/9002
touch redis_9002.conf
cp ../cluster/redis_8001.conf redis_9002.conf
sed -i -e 's/8001/9002/g' redis_9002.conf

cd /usr/local/myapp/redis/cluster/9003
touch redis_9003.conf
cp ../cluster/redis_8001.conf redis_9003.conf
sed -i -e 's/8001/9003/g' redis_9003.conf
```

启动所有实例：

```sh
redis-server /usr/local/myapp/redis/cluster/8001/redis_8001.conf
redis-server /usr/local/myapp/redis/cluster/8002/redis_8002.conf
redis-server /usr/local/myapp/redis/cluster/8003/redis_8003.conf
redis-server /usr/local/myapp/redis/cluster/9001/redis_9001.conf
redis-server /usr/local/myapp/redis/cluster/9002/redis_9002.conf
redis-server /usr/local/myapp/redis/cluster/9003/redis_9003.conf
```

形成集群：

```sh
# Redis 会自动选择一些节点作为 master 和 slave
# --cluster-replicas 可以直接替换成 --replicas，表示每个 master 的 slave 的数量
# 此时，节点总数 / (replicas + 1) 得到的结果就是 master 节点的数量
# 执行命令之后，Redis 会输出 master 和 slave 的分配结果，我们需要手动输入 yes
# 在这里，前三个是 master，后面的三个节点是 slave
redis-cli --cluter create --cluster-replicas 1 \
192.168.120.10:8001 \
192.168.120.10:8002 \
192.168.120.10:8003 \
192.168.120.10:9001 \
192.168.120.10:9002 \
192.168.120.10:9003 \
```

查看集群状态：

```sh
redis-cli -p 8001 cluster nodes
```

连接某个节点：

```sh
# 集群模式下必须添加 -c 参数，随便写一个节点的端口就行
redis-cli -c -p 8001
```

## 散列插槽

Redis 的 Cluster 集群是把数据存放到插槽中的，整个集群共 16384 个 slots（编号从 0 ~ 16383），Redis 会把这些 slots 平分给 master。查看集群状态时，就能看到 slots 是如何分配的。  

Cluster 模式下，数据不是和节点绑定的，而是与插槽绑定的。在集群中查询、修改数据时，Redis 会根据 key 的有效部分计算这条数据所在槽的位置，规则如下：

- 如果 key 中包含 "{}"，且 "{}" 中至少包含 1 个字符，则只会根据 "{}" 内的字符计算槽的位置
- 如果 key 中不包含 "{}"，则使用整个 key 计算槽的位置

计算槽的位置时，会利用 CRC16 算法计算有效部分的 hash 值，然后对 16384 取余，得到的结果就是槽的位置。

**为什么需要使用插槽呢？**

这是为了避免 Redis 实例宕机导致数据丢失，当某个实例宕机时，该实例中的插槽会被转移到其他节点，这样可以保证数据不丢失。

**Redis 如何判断某个 key 在哪个节点？**

Redis 集群启动时，会把 16384 个槽分配给集群中的 master 节点，当操作某个 key 时，会根据 key 的有效部分计算出槽的位置，最终根据槽的位置访问对应的节点。

**如何将同一类型的 key 保存在同一个实例中？**

需要在 key 中使用 "{}"，保证计算出来的 hash 值是相同。例如 "order{orderkey}:1"、"user{userkey}:1"。

## 集群伸缩

现在，往集群中新加一个 master 节点。步骤如下：

```sh
mkdir -p /usr/local/myapp/redis/cluster/8005
cd /usr/local/myapp/redis/cluster/8005

touch redis_8005.conf

cp ../cluster/redis_8001.conf redis_8005.conf
sed -i -e 's/8001/8005/g' redis_8005.conf

redis-server /usr/local/myapp/redis/cluster/8005/redis_8005.conf
```

添加到集群中：

```sh
# 192.168.120.10:8001 是集群中的一个已经存在的节点，随便写就行
# 此时，新加入的节点并没有分配任何插槽
redis-cli --cluster add-node 192.168.120.10:8005 192.168.120.10:8001
```

分配插槽：

```sh
# 192.168.120.10:8001 是集群中的一个已经存在的节点，随便写就行
redis-cli --cluster reshard 192.168.120.10:8001

# 命令执行后，会要求输入需要移动的插槽数量，例如输入 3000
# 输入完成后，需要再次输入哪个节点接收这个插槽，例如输入 "192.168.120.10:8005 的 ID"，可以通过 redis-cli -p 8001 cluster nodes 查看每个节点的 ID
# 输入完成后，还需要输入从哪个节点移动插槽，例如输入 "192.168.120.10:8001 的 ID"，可以通过 redis-cli -p 8001 cluster nodes 查看每个节点的 ID
# 最后输入 done 即可。
```

:::warning 注意
~~某个节点从集群中移除之前，需要手动先把这个节点上面的槽移动到其他节点中。~~
:::

当某个 master 节点宕机时，其 slave 节点会自动成为 master 节点，当 master 节点恢复后，master 节点会变为 slave 节点。

当然，我们也能手动实现主从切换。比如集群中的 8001 是 master，其 slave 是 9001，我想让 9001 变成 master，8001 变成 slave。那么，我们只需要执行以下命令：

```sh
# 必须连接到 9001
redis-cli -p 9001

# 执行主从切换命令
cluster failover
```

`cluster failover` 的执行流程如下：

1. master 拒绝一切请求
2. master 把 offset 发送给 slave
3. slave 根据 offset 进行数据同步
4. slave 数据同步完成后通知集群节点主从切换已经完成

## RedisTemplate 配置

```properties
# 集群密码
spring.redis.password=123456
spring.redis.lettuce.pool.enabled=true
spring.redis.lettuce.pool.max-active=8
spring.redis.lettuce.pool.max-idle=8
spring.redis.lettuce.pool.max-wait=100
spring.redis.lettuce.pool.min-idle=8

# 配置集群中的所有节点
spring.redis.cluster.nodes=192.168.120.10:8001,192.168.120.10:8002,192.168.120.10:8003,192.168.120.10:9001,192.168.120.10:9002,192.168.120.10:9003
```

配置读写分离：

```java
@Bean
public LettuceClientConfigurationBuilderCustomizer clientConfigurationBuilderCustomizer() {
    return clientConfigurationBuilder -> {
        // 可选值有 4 个：
        // MASTER 表示只从主节点读取数据
        // MASTER_PREFERRED 表示优先从主节点读取数据，如果主节点不可用，则从从节点读取数据
        // SLAVE 表示只从从节点读取数据
        // SLAVE_PREFERRED 表示优先从从节点读取数据，如果所有从节点不可用，则从主节点读取数据 
        clientConfigurationBuilder.readFrom(ReadFrom.REPLICA_PREFERRED);
        // 和 REPLICA_PREFERRED 是一样的
        // clientConfigurationBuilder.readFrom(ReadFrom.SLAVE_PREFERRED);
    };
}
```
