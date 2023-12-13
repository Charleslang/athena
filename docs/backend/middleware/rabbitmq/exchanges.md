# 交换机

:::tip 参考
[Exchanges](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)
:::

在介绍工作模式中的 Publish/Subscribe 之前，回顾之前的一些示例，我们向队列发送消息和从队列接收消息。现在是时候介绍 Rabbit 中完整的消息传递模型了。

让我们快速回顾一下之前教程中介绍的内容：

- 生产者是发送消息的用户应用程序。
- 队列是存储消息的缓冲区。RabbitMQ 的内部引擎只会在消息进入队列时进行存储，直到它们被消费者接收为止。队列只受内存和磁盘的限制，实际上它是一个非常大的消息缓冲区。许多生产者可以向一个队列发送消息，许多消费者可以尝试从一个队列接收数据。
- 消费者是接收消息的用户应用程序。

RabbitMQ 消息传递模型的核心思想是生产者从不直接向队列发送任何消息。实际上，生产者通常根本不知道消息是否会被传递到任何队列。

相反，生产者只能将消息发送到交换器。交换机的概念十分简单。一方面，它接收来自生产者的消息，另一方面，它将消息推送到队列。交换机必须确切地知道如何处理它收到的消息。是否应该将其附加到特定队列？是否应该将其附加到许多队列中？或者应该将其丢弃。其规则由交换类型定义。

![exchanges](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-11/exchanges.png)

有几种可用的交换类型：`direct`、`topic`、`headers`、`fanout`。

## fanout

让我们创建一个这种类型的交换机，并将其称为 `logs`：

```java
channel.exchangeDeclare("logs", "fanout");
```

`fanout` 交换机非常简单。正如您可能从名称中猜到的那样，它将收到的所有消息广播到它知道的所有队列。

:::tip 提示
**查看交换机**

想要查看 RabbitMQ 中的交换机，可以使用如下命令：
```bash
sudo rabbitmqctl list_exchanges
```
在此列表中将有一些 `amq.*` 交换机和默认（未命名）交换机。这些是默认创建的，您不太可能需要使用它们。

**匿名交换机**

在 Work Queues 中，我们对交换机一无所知，但仍然能够将消息发送到队列。这是可能的，因为我们使用的是默认交换机，我们通过空字符串（`""`）来标识默认交换机。

```java
channel.basicPublish("", "hello", null, message.getBytes());
```
第一个参数是交换机的名称。空字符串表示默认或匿名交换机，消息将路由到参数 `routingKey` 指定的队列（如果存在）。这里的 `routingKey` 是队列的名称。
:::

使用 `fanout` 交换机，我们可以不用指定 `routingKey`（如果指定了，则 `routingKey` 的值将被忽略），因为它会将消息广播到该交换机绑定的所有队列中。如下：

```java
channel.exchangeDeclare("logs", "fanout");

/**
 * 交换机名称是 logs
 * routingKey 是空字符串
 */
channel.basicPublish( "logs", "", null, message.getBytes());
```

## direct

:::tip 提示
本小节中提到的 `binding key` 和 `routing key` 是同一个概念，只是在不同的上下文中使用不同的名称。
:::

在 [Publish/Subscribe](./work-pattern.html#publish-subscribe) 中的日志系统将所有消息广播给所有消费者。我们希望扩展它以允许根据消息的严重性过滤消息。例如，我们可能希望一个将日志消息写入磁盘的程序仅接收关键错误，而不是在 warn 或 info 日志消息上浪费磁盘空间。

我们之前使用的是 `fanout` 交换机，这并没有给我们带来太大的灵活性，它只能进行无意识的广播。

我们将改用 `direct` 交换机。`direct` 交换机背后的路由算法很简单，消息进入其 `binding key` 与消息的 `routing key` 完全匹配的队列。见下图：

![direct-exchange](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-12/direct-exchange.png)

在此图中，我们可以看到 `direct` 交换机 `X` 绑定了两个队列。第一个队列使用的 `binding key` 是 `orange`，第二个队列有两个 bindings，一个使用 binding key 是 `black`，另一个使用 binding key 是 `green`。

在这种情况下，使用名为 `orange` 的 routing key 发布到交换机的消息将被路由到队列 Q1，使用名为 `black` 或 `green` 的 routing key 的消息将路由到队列 Q2。除此之外的所有其它消息将被丢弃。

**Multiple bindings**

![direct-exchange-multiple](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-12/direct-exchange-multiple.png)

使用相同的 binding key 绑定多个队列是完全合法的。在上图中，我们可以使用 binding key `black` 在 X 和 Q1 之间添加另一个绑定。在这种情况下，`direct` 交换机的行为将类似于 `fanout` 交换机，并将消息广播到所有匹配的队列。带有 `black` 的 routing key 的消息将被发送到队列 Q1 和 Q2。

## topic

:::tip 参考
[Topic](https://www.rabbitmq.com/tutorials/tutorial-five-java.html)
:::

发送到 `topic` 交换机的消息的 `routing_key` 必须是一个由点分隔的单词列表。这些单词可以是任何内容，但通常它们与消息的功能相关。一些有效的 routing key 示例：`stock.usd.nyse`、`nyse.vmw`、`quick.orange.rabbit`、`kern`。routing key 中可以有任意多个单词，但总长度不能超过 255 个字节。

binding key 也必须采用相同的形式。`topic` 交换机背后的逻辑与 `direct` 交换机类似，使用特定 routing key 发送的消息将被传递到与匹配的 binding key 绑定的所有队列。但是，binding key 有两种重要的特殊情况：

- \* 可以替代一个单词
- \# 可以替代零个或多个单词

如下图所示：

![python-five](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-13/python-five.png)

在此示例中，我们将发送所有描述动物的消息。消息将通过由三个单词（两个点）组成的 routing key 发送。routing key 中的第一个单词将描述速度，第二个单词描述颜色，第三个单词描述物种。格式为：`<speed>.<colour>.<species>`。

我们创建了三个绑定：Q1 与 binding key `*.orange.*` 绑定，Q2 与 `*.*.rabbit` 和 `lazy.#` 绑定。

这些绑定可以概括为：

- Q1 对所有橙色动物都感兴趣。
- Q2 想听听关于兔子的一切，以及关于懒惰动物的一切。

routing key 设置为 `quick.orange.rabbit` 的消息将被传递到两个队列。消息 `lazy.orange.elephant` 也将发送到队列 Q1、Q2。而，`quick.orange.fox` 只会进入队列 Q1，`lazy.brown.fox` 只会进入队列 Q2。

如果我们违反之前的规则，发送包含一到四个单词（例如 `orange` 或 `quick.orange.new.rabbit`）的消息，会发生什么情况？那么，这些消息不会与任何 bindings 匹配，并且消息将会丢失。

而对 `lazy.orange.new.rabbit` 来讲，即使它有四个单词，但是也会匹配 `lazy.#`，因此消息将被传递队列 Q2。

:::tip 提示
topic 交换机功能强大，可以实现其它交换机相同的功能。

当队列与 binding key `#` 绑定时，该队列将接收所有消息，无论路由键如何，就像在 `fanout` 交换机中一样。

当 binding 中未使用特殊字符 `*` 和 `#`时，topic 交换机的行为就像 `direct` 交换机一样。
:::