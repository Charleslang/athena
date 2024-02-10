# 集群

## 普通集群

编辑每台机器的 `/etc/hosts` 文件，添加如下内容：

```bash
192.168.77.128 node1
192.168.77.129 node2
192.168.77.130 node3
```

在每台机器上安装 RabbitMQ，安装完成后，先启动 master 节点生成 cookie 文件。cookie 文件是集群中各个节点通信的凭证，必须保证各个节点的 cookie 文件一致。cookie 文件的位置在 `/var/lib/rabbitmq/.erlang.cookie` 或者 `$HOME/.erlang.cookie`，如果没有该文件，可以自己创建一个，内容为任意字符串，然后修改权限为 600。见 [Cookie File Locations](https://www.rabbitmq.com/clustering.html)。

```bash
# 复制 cookie 文件到其他节点
scp /var/lib/rabbitmq/.erlang.cookie root@node2:/var/lib/rabbitmq/.erlang.cookie
scp /var/lib/rabbitmq/.erlang.cookie root@node3:/var/lib/rabbitmq/.erlang.cookie
```

启动 master 节点：

```bash
rabbitmq-server -detached
```

依次启动其它节点 node2、node3：

- **node2**

```bash
# 停止 rabbitmq。如果使用 rabbitmqctl stop，则会将 erlang也停止
rabbitmqctl stop_app
# 重置节点
rabbitmqctl reset
# 加入 master
rabbitmqctl join_cluster rabbit@node1
# 启动 rabbitmq
rabbitmqctl start_app
```

- **node3**

```bash
# 停止 rabbitmq。如果使用 rabbitmqctl stop，则会将 erlang也停止
rabbitmqctl stop_app
# 重置节点
rabbitmqctl reset
# 加入 master，此处可以写 node1 或者 node2
rabbitmqctl join_cluster rabbit@node1
# 启动 rabbitmq
rabbitmqctl start_app
```

启动完成后，访问任意一个节点的 web 管理界面，可以在 Overview 中看到集群的主机信息。

![20240210184909](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210184909.png)

这是 RabbitMQ 中最简单的集群模式，每个节点都是独立的，没有任何数据同步。

先来看一个例子，我们在 node1 上创建一个队列，然后在 node2 上查看队列，会发现 node2 上并没有这个队列。

![20240210185410](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210185410.png)

这样就有问题了，如果 node1 挂了，那么该队列中的消息就无法消费了。接下来思考这样一个问题，如果 node1 没有挂，我通过 Java API 访问队列 2 消费 `hello` 这个队列，能成功消费吗？答案是可以消费，因为 RabbitMQ 集群节点间会同步队列的元数据信息，node2 实际上会请求 node1 来获取队列中的消息。

在 Java API 中，连接 RabbitMQ 集群的时候，我们通常需要传递一个地址列表，例如：

```java
ConnectionFactory factory = new ConnectionFactory();
// vhost 默认是 /
factory.setVirtualHost("/");
factory.setUsername("admin");
factory.setPassword("123456");

Connection connection = factory.newConnection();
Address[] addresses = new Address[]{
    new Address("192.168.77.128", 5672),
    new Address("192.168.77.129", 5672),
    new Address("192.168.77.130", 5672)
};
// 其实 factory.newConnection() 方法内部就是调用了下面这个方法
factory.newConnection(addresses);
```

那么这样的话，还会有一个问题，Java API 是连接的集群中的哪个节点呢？这个问题我们可以通过查看源码来解决，在获取连接时，调用的方法如下：

```java
public RecoveryAwareAMQConnection newConnection() throws IOException, TimeoutException {
    Exception lastException = null;
    List<Address> resolved = addressResolver.getAddresses();
    // 重点是这个方法，将地址列表打乱。内部就是调用了 Collections.shuffle(resolved); 方法
    /**
     * default List<Address> maybeShuffle(List<Address> input) {
     *   List<Address> list = new ArrayList<Address>(input);
     *   Collections.shuffle(list);
     *   return list;
     * }
     */
    List<Address> shuffled = addressResolver.maybeShuffle(resolved);

    // 其实相当于随机连接集群中的某个节点
    for (Address addr : shuffled) {
        try {
            FrameHandler frameHandler = factory.create(addr, connectionName());
            RecoveryAwareAMQConnection conn = createConnection(params, frameHandler, metricsCollector);
            conn.start();
            metricsCollector.newConnection(conn);
            return conn;
        } catch (IOException e) {
            lastException = e;
        } catch (TimeoutException te) {
            lastException = te;
        }
    }
    // ...
}
```

在上面，我们知道了，RabbitMQ 的普通集群其实无法保证高可用，每个节点都是独立的，没有数据同步。如果需要数据同步，需要使用镜像集群。

## 镜像集群

与普通集群模式不同的是，在镜像集群模式下，创建的 queue，无论元数据还是 queue 里的消息都会存在于多个实例上。也就是说，每个 RabbitMQ 节点都有这个 queue 的一个完整镜像，包含 queue 的全部数据。每次往队列中存储消息时，都会自动把消息同步到多个实例的 queue 上。

集群队列的搭建很简单，其实就是先搭建一个普通集群，然后在普通集群的基础上做一些配置即可。进入集群任意一个节点的 web 管理界面，执行如下操作：

![20240210203303](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210203303.png)

部分字段解释如下：

- **Name**

  策略名称，可以随便取。

- **Pattern**  

  哪些队列需要镜像。例如 `^mirror` 表示所有以 `mirror` 开头的队列都会被镜像，`^` 表示所有队列都会被镜像。

- **Apply to**  

  选择 `Exchanges and queues` 就行。表示镜像策略应用到交换机和队列。

- **Definition**  

  - **ha-mode**
  
      高可用模式，有 `all`、`exactly`、`nodes` 三种。`all` 表示镜像到集群中的所有节点，`exactly` 表示镜像到一组节点，`nodes` 表示镜像到一个明确的节点列表。如果选择后两者之一，还必须设置 `ha-params` 参数。

  - **ha-params**

      如果 `ha-mode` 选择了 `exactly` 或者 `nodes`，那么这个参数就必须设置。如果 `ha-mode` 为 `exactly`，则此参数为数字（即主备加起来一共多少份）；如果 `ha-mode` 为 `nodes`，则此参数为字符串列表。

  - **ha-sync-mode**

      同步模式，有 `automatic` 和 `manual` 两种。`automatic` 表示自动同步，`manual` 表示手动同步。这里设置为 `automatic`。更多信息请参考 [Unsynchronised Mirrors](https://www.rabbitmq.com/ha.html#unsynchronised-mirrors)。

这时候，我们在任意一台节点上创建一个队列，查看队列的信息，如下：

![20240210203755](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210203755.png)

可以发现，队列的镜像策略已经生效了。

如果其中一台机器宕机，则 RabbitMQ 会自动将数据备份到其它机器上，以保证主备的数量一直为 `ha-params` 中设置的数量。
