# 哨兵集群

在 [主从集群](./cluster-master-slave.html) 中，我们已经介绍了如何搭建 Redis 主从集群。但是，主从集群的缺点是，如果 master 挂掉了，此时集群只能进行读操作了，需要手动切换到从节点。为了解决这个问题，我们可以使用 Redis 哨兵集群来实现自动故障转移。

哨兵集群的原理是使用一个或多个哨兵节点来监控集群中所有节点的状态，当主节点挂掉时，哨兵节点会自动将一个从节点选举为主节点，并通知其他从节点进行切换。这样就可以实现自动故障转移，保证 Redis 集群的高可用性。

![20250426211522](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-04-26/20250426211522.png)

哨兵的作用如下：

- 监控主从节点的状态：每隔 1 秒钟向主从节点发送 ping 命令，检查节点的状态。如果某个节点在规定的时间内没有响应，则认为该节点主观下线了。若满足指定数量（`quorum`）的哨兵节点都认为该节点主观下线，则认为该节点客观下线了。
- 自动故障转移：当主节点挂掉时，自动将一个从节点选举为新的主节点，并通知其他从节点进行切换（自动更新从节点的配置文件，保证从节点能够正确连接到新的主节点）。当 master 节点恢复时，自动将其重新加入集群，并将其设置为从节点。
- 服务发现：当主节点发生故障转移时，自动通知客户端（例如 RedisTemplate）新的主节点的地址。

:::tip 提示
哨兵之间是通过 TCP 连接的，哨兵节点之间也会互相发送 ping 命令来检查对方的状态。
:::


## 集群搭建

:::tip 提示
在搭建 Sentinel 集群之前，必须先搭建好 Redis 主从集群，请参考 [主从集群](./cluster-master-slave.html)。
:::

下面使用 3 个 Redis 实例来搭建一个 Sentinel 集群：

|IP|Port|角色|
|---|---|---|
|192.168.120.10|10001|sentinel|
|192.168.120.10|10002|sentinel|
|192.168.120.10|10003|sentinel|

创建三个 Sentinel 的配置文件，命名为 `sentinel_10001.conf`、`sentinel_10002.conf` 和 `sentinel_10003.conf`，内容如下：

```sh
mkdir -p /usr/local/myapp/redis/sentinel/s10001
mkdir -p /usr/local/myapp/redis/sentinel/s10002
mkdir -p /usr/local/myapp/redis/sentinel/s10003
```

创建配置文件：

```sh
cd /usr/local/myapp/redis/sentinel/s10001
touch sentinel_10001.conf

# sentinel 的端口
echo "port 10001" >> sentinel_10001.conf

# sentinel 的 IP
echo "sentinel announce-ip 192.168.120.10" >> sentinel_10001.conf

# 主节点的密码。如果主节点没有设置密码，则不需要配置
# 需要保证主节点和从节点的密码一致
echo "sentinel auth-pass mymaster 123456" >> sentinel_10001.conf

# sentinel 要监控的集群名称
# mymaster 是主节点的名称，任取就行
# 192.168.120.10 是主节点的 IP，6380 是主节点的端口
# 2 是 quorum 的值，表示至少需要 2 个 sentinel 节点认为主节点下线，才会进行故障转移
echo "sentinel monitor mymaster 192.168.120.10 6380 2" >> sentinel_10001.conf

# 认为主节点下线的超时时间，单位是毫秒。默认值是 30000 毫秒，如果 30 秒钟内没有 ping 通主节点，则认为主节点下线
# 该值不能设置太小，否则会误判主节点下线
echo "sentinel down-after-milliseconds mymaster 30000" >> sentinel_10001.conf

# 故障转移的超时时间，单位是毫秒。默认值是 180000，如果 3 分钟内没有完成故障转移，则认为故障转移失败
# 该值不能设置太小，否则会误判故障转移失败
echo "sentinel failover-timeout mymaster 180000" >> sentinel_10001.conf

# sentinel 的工作目录，存放 pid 文件和日志文件
echo "dir /usr/local/myapp/redis/sentinel/s10001" >> sentinel_10001.conf
```

复制一份，修改端口和目录：

```sh
cd /usr/local/myapp/redis/sentinel/s10002
touch sentinel_10002.conf
cp ../s10001/sentinel_10001.conf sentinel_10002.conf
sed -i -e 's/10001/10002/g' sentinel_10002.conf

cd /usr/local/myapp/redis/sentinel/s10003
touch sentinel_10003.conf
cp ../s10001/sentinel_10001.conf sentinel_10003.conf
sed -i -e 's/10001/10003/g' sentinel_10003.conf
```

启动 Sentinel 集群：

```sh
cd /usr/local/myapp/redis/sentinel/s10001
./src/redis-sentinel /usr/local/myapp/redis/sentinel/s10001/sentinel_10001.conf

cd /usr/local/myapp/redis/sentinel/s10002
./src/redis-sentinel /usr/local/myapp/redis/sentinel/s10002/sentinel_10002.conf

cd /usr/local/myapp/redis/sentinel/s10003
./src/redis-sentinel /usr/local/myapp/redis/sentinel/s10003/sentinel_10003.conf
```

## 故障转移

当发现某个节点客观下线时，哨兵的处理机制如下：

**从节点：**

- 从节点下线后，数据同步会中断，但哨兵不会触发故障转移（故障转移仅针对主节点）。
- 如果从节点重新上线，哨兵会自动重新发现它，并命令其从新的主节点（或原主节点）同步数据。
- 从节点不会被踢出集群，只是暂时被标记为不可用。

**主节点：**

- 哨兵确认主节点客观下线后，会发起选举（基于 Raft 算法）选出新的主节点（通常选择数据最新的从节点）。
- 哨兵将新主节点的信息通知给其他从节点和客户端。
- 其他从节点切换到新主节点，开始同步数据。
- 原主节点不会被踢出集群，而是以从节点身份重新加入。原主节点重新上线后，哨兵会将其降级为从节点，并指向新主节点。

**主节点选举：**

- 如果需要从 Redis 集群选举一个节点为主节点，首先需要从 Sentinel 集群中选举一个 Sentinel 节点作为 Leader。
- 每一个 Sentinel 节点都可以成为 Leader，当一个 Sentinel 节点确认 Redis 集群的主节点主观下线后，会请求其他 Sentinel 节点要求将自己选举为 Leader。被请求的 Sentinel 节点如果没有同意过其他 Sentinel 节点的选举请求，则同意该请求（选举票数+1），否则不同意。谁先发现主节点下线，谁就会成为 Leader。
- 如果一个 Sentinel 节点获得的选举票数达到 Leader 最低票数（`quorum` 和 `Sentinel 节点数 / 2 + 1` 的最大值），则该 Sentinel 节点选举为 Leader；否则重新进行选举。
- 当 Sentinel 集群选举出 Sentinel Leader 后，由 Sentinel Leader 从 Redis 从节点中选择一个节点作为主节点：
    - 过滤故障的节点
    - 选择优先级 slave-priority 最小的从节点作为主节点，如不存在则继续，该参数为 0 表示永不选举为主节点
    - 选择 offset 最大的从节点作为主节点，如不存在则继续
    - 选择 runid（Redis 每次启动时会生成随机一个 runid 作为 Redis 实例的标识）最小的从节点作为主节点
    - 某个节点选举为主节点后，该从节点会执行 `SLAVEOF NO ONE` 命令，成为新的主节点。
    - 其他从节点会执行 `SLAVEOF <new-master-ip> <new-master-port>` 命令，连接到新的主节点，重新进行数据同步。
    - Sentinel Leader 会修改发生故障的主节点的配置文件，设置为从节点（在配置文件中添加 `SLAVEOF <new-master-ip> <new-master-port>`），故障恢复之后会进行全量同步。
    - 其他 Sentinel 节点会执行 `SENTINEL MONITOR <master-name> <new-master-ip> <new-master-port>` 命令，更新主节点信息。

**为什么 Sentinel 集群至少 3 节点？**

一个 Sentinel 节选举成为 Leader 的最低票数为 `quorum` 和 `Sentinel 节点数 / 2 + 1` 的最大值，如果 Sentinel 集群只有 2 个 Sentine l节点，则 `Sentinel节点数 / 2 + 1 = 2 / 2 + 1 = 2`，即 Leader 最低票数至少为 2，当该 Sentinel 集群中有一个 Sentinel 节点故障后，仅剩的一个 Sentinel 节点是永远无法成为 Leader。因此，Sentinel 集群允许 1 个 Sentinel 节点故障则需要 3 个节点的集群；允许 2 个节点故障则需要 5 个节点集群。
