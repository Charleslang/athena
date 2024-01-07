# Ack 与 Confirms

:::tip 参考
[Consumer Acknowledgements and Publisher Confirms](https://www.rabbitmq.com/confirms.html)
:::

消费者和发布者端的确认对于使用消息传递的应用程序中的数据安全非常重要。更多信息参考 [Publisher](https://www.rabbitmq.com/publishers.html) and [Consumer](https://www.rabbitmq.com/consumers.html)。

使用消息代理（例如 RabbitMQ）的系统是分布式的。由于发送的消息不能保证到达消息服务器或被消息服务器成功处理，因此发布者和消费者都需要一种传递和处理确认的机制。RabbitMQ 支持的多种消息传递协议提供了此类功能。本指南涵盖了 AMQP 0-9-1 中的功能，但其思想在其他支持的协议中基本相同。

从 [consumers](https://www.rabbitmq.com/consumers.html) 到 RabbitMQ 的传递处理确认在消息协议中称为确认；broker 对[发布者](https://www.rabbitmq.com/publishers.html)的确认是一种称为 [publisher confirms](https://www.rabbitmq.com/confirms.html#publisher-confirms) 的协议扩展。这两个功能都基于相同的想法，并受到 TCP 的启发。

它们对于从发布者到 RabbitMQ 节点以及从 RabbitMQ 节点到消费者的可靠交付至关重要。换句话说，它们对于数据安全至关重要，应用程序与 RabbitMQ 节点一样负责数据安全。

## (Consumer) Delivery Acknowledgements

:::tip 提示
本节其实就是讲的消费者端的 ack。
:::

当 RabbitMQ 向消费者传递消息时，它需要知道何时认为消息已成功发送到消费者。什么样的逻辑是最佳的取决于系统。在 AMQP 0-9-1 中，当使用 `basic.consume` 方法注册消费者或使用 `basic.get` 方法按需获取消息时，就会生成此消息。

**Delivery Identifiers: Delivery Tags**

在我们继续讨论其他主题之前，重要的是要解释如何识别消息已发送到消费者（即 Delivery）。当消费者（订阅）注册时，RabbitMQ 将使用 `basic.deliver` 方法传递（推送）消息。该方法带有传递标签 delivery tag，该 delivery tag 唯一地标识 channel 上的传递。因此，delivery tag 的范围是按 channel 划分的。

delivery tag 是单调增长的正整数，并由客户端库如此呈现。确认交付的客户端库方法将 delivery tag 作为参数。

由于 delivery tag 的范围仅限于每个 channel ，因此必须在接收交付的同一 channel 上确认交付（消费确认 ack）。在不同的 channel 上 ack 将产生“unknown delivery tag”协议异常并关闭 channel。

**Consumer Acknowledgement Modes and Data Safety Considerations**

当节点向消费者传递消息时，它必须决定该消息是否应被视为由消费者处理（或至少接收）。由于多种事物（客户端连接、消费者应用程序等）都可能失败，因此此决定是一个数据安全问题。消息传递协议通常提供一种确认机制，允许消费者确认对其所连接的节点的交付。是否使用该机制是在消费者订阅时决定的。

根据所使用的确认模式，RabbitMQ 可以在发送消息（写入 TCP 套接字）后立即或在收到显式（“手动”）客户端确认时认为消息已成功发送到消费者。

手动发送的确认可以是肯定的或否定的，并使用以下协议方法之一：

- `basic.ack` 用于肯定确认（positive acknowledgements）
- `basic.nack` 用于否定确认（negative acknowledgements）（注意：这是 [AMQP 0-9-1 的 RabbitMQ 扩展](https://www.rabbitmq.com/nack.html)）
- `basic.reject` 用于否定确认（negative acknowledgements），但与 `basic.nack` 相比有一个限制

下面将讨论如何在客户端库 API 中使用这些方法。

`basic.ack` 只是告诉 RabbitMQ 记录已发送的消息并可以将其丢弃。`basic.reject` 的否定确认具有相同的效果。区别主要在于语义上：`basic.ack` 假设消息已成功处理，而 negative acknowledgements 则表明传递未得到处理，但仍应删除。

自动确认模式下，消息发送后立即认为已成功送达。这种模式以更高的吞吐量（只要消费者能够跟上）为代价，以降低交付和消费者处理的安全性。这种模式通常被称为“即发即忘”，与手动确认模型不同，如果消费者的 TCP 连接或通道在成功传递之前关闭，则服务器发送的消息将丢失。因此，自动消息确认应该被认为是不安全的并且不适合所有工作负载。

使用自动确认模式时需要考虑的另一件事是消费者过载。手动确认模式通常与有界通道预取一起使用，该预取限制通道上未完成（“正在进行”）传送的数量。然而，对于自动确认，根据定义就没有这样的限制。因此，消费者可能会因交付速度而不知所措，可能会在内存中积累积压并耗尽堆或让操作系统终止其进程。一些客户端库将应用 TCP 反压（停止从套接字读取，直到未处理的交付的积压下降超过一定限制）。因此，仅建议能够高效、稳定地处理交货的消费者使用自动确认模式。

**Positively Acknowledging Deliveries**

用于传递确认的 API 方法通常在客户端库中的 channel 上进行操作。Java 客户端用户将使用 `Channel#basicAck` 和 `Channel#basicNack` 分别执行 `basic.ack` 和 `basic.nack`。下面是一个 Java 客户端示例：

```java
boolean autoAck = false;
channel.basicConsume(queueName, autoAck, "a-consumer-tag",
    new DefaultConsumer(channel) {
        @Override
        public void handleDelivery(String consumerTag,
                                  Envelope envelope,
                                  AMQP.BasicProperties properties,
                                  byte[] body)
            throws IOException
        {
            long deliveryTag = envelope.getDeliveryTag();
            // positively acknowledge a single delivery, the message will be discarded
            channel.basicAck(deliveryTag, false);
        }
    });
```

**Acknowledging Multiple Deliveries at Once**

可以批量进行手动确认以减少网络流量。这是通过将确认方法的 `multiple` 字段（见上文）设置为 true 来完成的。请注意，`basic.reject` 历史上没有该字段，这就是 RabbitMQ 引入 `basic.nack` 作为协议扩展的原因。

当 `multiple` 字段设置为 true 时，RabbitMQ 将确认所有未完成的 delivery_tag，直至并包括确认中指定的 tag。与与确认相关的所有其他内容一样，这是按 channel 确定的。例如，假设 channel `Ch` 上有未确认的 delivery_tag 5、6、7 和 8，当确认帧到达该 channel 且 delivery_tag 设置为 8 且 `multiple` 设置为 true 时，从 5 到 8 的所有 tag 都将被确认。如果 `multiple` 设置为 false，则交付 5、6 和 7 仍将未被确认。

要使用 RabbitMQ Java 客户端确认多次传送，请将 `multiple` 参数传递 true 给 `Channel#basicAck`：

```java{13}
boolean autoAck = false;
channel.basicConsume(queueName, autoAck, "a-consumer-tag",
     new DefaultConsumer(channel) {
         @Override
         public void handleDelivery(String consumerTag,
                                    Envelope envelope,
                                    AMQP.BasicProperties properties,
                                    byte[] body)
             throws IOException
         {
             long deliveryTag = envelope.getDeliveryTag();
             // positively acknowledge all deliveries up to this delivery tag
             channel.basicAck(deliveryTag, true);
         }
     });
```

**Negative Acknowledgement and Requeuing of Deliveries**

有时，消费者无法立即处理交付，但其它消费者可能可以。在这种情况下，可能需要将其重新排队并让另一个消费者接收并处理它。`basic.reject` 和 `basic.nack` 是用于此目的的两个方法。

这些方法通常用于否定确认交付。类交付可以被 MQ 服务器 discarded、 dead-lettered、requeued。此行为由 `requeue` 字段控制。当该字段设置为 true 时，broker 将使用指定的 delivery tag 重新排队交付（或多个交付，稍后将解释）。或者，当此字段设置为 false 时，如果配置了死信交换，消息将被路由到死信交换机 [Dead Letter Exchange](https://www.rabbitmq.com/dlx.html)，否则将被丢弃。

Java 客户端使用 `Channel#basicReject` 和 `Channel#basicNack` 分别执行 `basic.reject` 和 `basic.nack`：

```java
boolean autoAck = false;
channel.basicConsume(queueName, autoAck, "a-consumer-tag",
     new DefaultConsumer(channel) {
         @Override
         public void handleDelivery(String consumerTag,
                                    Envelope envelope,
                                    AMQP.BasicProperties properties,
                                    byte[] body)
             throws IOException
         {
             long deliveryTag = envelope.getDeliveryTag();
             // negatively acknowledge, the message will be discarded
             channel.basicReject(deliveryTag, false);
         }
     });
```

```java
boolean autoAck = false;
channel.basicConsume(queueName, autoAck, "a-consumer-tag",
     new DefaultConsumer(channel) {
         @Override
         public void handleDelivery(String consumerTag,
                                    Envelope envelope,
                                    AMQP.BasicProperties properties,
                                    byte[] body)
             throws IOException
         {
             long deliveryTag = envelope.getDeliveryTag();
             // requeue the delivery
             channel.basicReject(deliveryTag, true);
         }
     });
```
当消息重新排队时（如果可能的话），它将被放置到其队列中的原始位置。如果不是（由于多个消费者共享队列时来自其他消费者的并发传递和确认），消息将被重新排队到更靠近队列头的位置。重新排队的消息可能会立即准备好重新传递，具体取决于它们在队列中的位置以及 channel 上其它消费者使用的预取值 prefetch count。这意味着，如果所有消费者由于暂时情况而无法处理交付而重新排队，他们将创建一个重新排队/重新交付循环。就网络带宽和 CPU 资源而言，此类循环的成本可能很高。消费者可以跟踪重新传递的数量并永久拒绝消息（丢弃它们）或安排延迟后重新排队。

使用 `basic.nack` 方法可以一次拒绝或重新排队多个消息。这就是它与 ·basic.reject· 的区别。它接受一个附加参数 `multiple`。这是一个 Java 客户端示例：

```java
boolean autoAck = false;
channel.basicConsume(queueName, autoAck, "a-consumer-tag",
     new DefaultConsumer(channel) {
         @Override
         public void handleDelivery(String consumerTag,
                                    Envelope envelope,
                                    AMQP.BasicProperties properties,
                                    byte[] body)
             throws IOException
         {
             long deliveryTag = envelope.getDeliveryTag();
             // requeue all unacknowledged deliveries up to this delivery tag
             channel.basicNack(deliveryTag, true, true);
         }
     });
```

**Channel Prefetch Setting (QoS)** 

消息异步传递（发送）到客户端，并且在任何给定时刻，channel 可能有多个“正在传输”的消息。来自客户端的手动确认本质上也是异步的，但流向相反的方向。

这就是未确认的交付的滑动窗口。

对于大多数消费者来说，限制该窗口的大小以避免消费者端的无界缓冲区（堆）增长问题是有意义的。这是通过使用 `basic.qos` 方法设置“prefetch count”值来完成的。该值定义 channel 上允许的未确认传送的最大数量。当数量达到配置的计数时，RabbitMQ 将停止在 channel 上传递更多消息，直到至少一条未完成的消息得到确认。

值 0 表示“无限制”，允许任意数量的未确认消息。这是默认值。

例如，假设 channel `Ch` 上有四个 delivery tag 为 5、6、7 和 8 的传递未确认，并且 channel `Ch` 的预取计数 prefetch count 设置为 4，RabbitMQ 不会在 `Ch` 上推送任何更多交付，除非至少有一项未完成的交付得到确认。

当确认帧 ack 到达该 channel 且 Delivery_tag 设置为 5（或 6、7 或 8）时，RabbitMQ 将注意到并再传递一条新消息给消费者。一次确认多条消息（[multiple messages at once](https://www.rabbitmq.com/confirms.html#consumer-acks-multiple-parameter)）将使多条新消息传递给该消费者。

值得重申的是，交付流程和手动 ack 是完全异步的。因此，如果预取值 prefetch count 在已经有正在传输的交付的情况下发生更改，则会出现自然竞争条件，并且 channel 上可能会暂时存在超过预取计数的未确认消息。

**Per-channel, Per-consumer and Global Prefetch**

可以为特定通道或特定消费者配置 QoS 设置。[Consumer Prefetch](https://www.rabbitmq.com/consumer-prefetch.html) 中解释了此范围的影响。

**Prefetch and Polling Consumers**

QoS 预取设置对使用 `basic.get`（“pull API”）获取的消息没有影响，即使在手动确认模式下也是如此。

**Consumer Acknowledgement Modes, Prefetch and Throughput**

确认模式和 QoS 预取值对消费者吞吐量有显着影响。一般来说，增加 prefetch count 将提高向消费者传递消息的速率。自动确认模式可实现最佳的交付率。然而，在这两种情况下，已发送但尚未处理的消息数量也会增加，从而增加消费者 RAM 消耗。

应谨慎使用自动确认模式或具有无限 prefetch count 的手动确认模式。消费者在没有确认的情况下消耗大量消息将导致他们所连接的节点上的内存消耗增长。找到合适的预取值需要反复试验，并且会因工作负载的不同而有所不同。100 到 300 范围内的值通常提供最佳吞吐量，并且不会带来让消费者不知所措的重大风险。较高的值通常会遇到收益递减规律 [run into the law of diminishing returns](https://blog.rabbitmq.com/posts/2014/04/finding-bottlenecks-with-rabbitmq-3-3/)。

预取值 1 是最保守的。它将显着降低吞吐量，特别是在消费者连接延迟较高的环境中。对于许多应用来说，较高的值是合适且最佳的。

**When Consumers Fail or Lose Connection: Automatic Requeueing**

使用手动确认时，当发生传递的 channel（或 connection）关闭时，任何未确认的传递（消息）都会自动重新排队。这包括客户端的 TCP 连接丢失、消费者应用程序（进程）故障和通道级协议异常（如下所述）。

请注意，检测不可用的客户端需要一段时间。见 [detect an unavailable client](https://www.rabbitmq.com/heartbeats.html)。

由于这种行为，消费者必须准备好处理重新交付，否则在实施时要考虑到幂等性 [idempotence](https://en.wikipedia.org/wiki/Idempotence)。重新交付将有一个特殊的布尔属性 `redeliver`，由 RabbitMQ 设置为 `true`。对于第一次交付，它将被设置为 `false`。请注意，消费者可以接收先前传递给另一个消费者的消息。

**Client Errors: Double Acking and Unknown Tags**

如果客户端多次确认同一交付标签 delivery tag，RabbitMQ 将导致通道错误，例如 `PRECONDITION_FAILED - unknown delivery tag 100`。如果使用未知的 delivery tag，也会抛出相同的通道异常。

出现“unknown delivery tag”的另一种情况是，在与接收消息 channel 不同的 channel 上尝试进行 ack（无论是 positive 还是 negative）时。ack 必须和消息投递（消息接收） Deliveries 使用相同的 channel。

## Publisher Confirms

网络可能会以不太明显的方式发生故障，并且检测某些故障需要时间。因此，将协议帧或一组帧（例如发布的消息）写入其套接字的客户端不能假设该消息已到达服务器并已被服务器成功处理。它可能会在途中丢失，或者其交付可能会大大延迟。

使用标准 AMQP 0-9-1，保证消息不丢失的唯一方法是使用事务，即使通道具有事务性，然后针对每条消息或消息集进行发布、提交。在这种情况下，事务会变得不必要的重量级，并使吞吐量降低 250 倍。为了解决这个问题，引入了发布确认机制，它与消费者确认机制相似。

要启用发布确认，客户端需要调用 `confirm.select` 方法。根据是否设置了 `no-wait`，MQ 服务器可能会用 `inform.select-ok` 进行响应。一旦在 channel 上使用 `confirm.select` 方法，就称该 channel 处于发布确认模式。transactional channel 无法进入发布确认模式，并且一旦 channel 处于发布确认模式，就无法使其成为 transactional channel。

一旦 channel 处于发布确认模式，MQ 服务器和客户端都会对消息进行计数（第一次确认时，`confirm.select` 从 1 开始计数）。然后，MQ 服务器在处理消息时通过在同一 channel 上发送 `basic.ack` 来确认消息。delivery-tag 字段包含已确认消息的序列号。MQ 服务器还可以在 `basic.ack` 中设置 `multiple` 字段，以表明直到并包括具有序列号的消息的所有消息都已被处理。

**Negative Acknowledgments for Publishes**

在异常情况下，当 broker 无法成功处理消息时，代理将发送 `basic.nack`，而不是 `basic.ack`。在这种情况下，`basic.nack` 的字段与 `basic.ack` 中的相应字段具有相同的含义，并且应忽略 `requeue` 字段。通过取消一条或多条消息，broker 表明它无法处理这些消息并拒绝对它们负责，此时，客户端可以选择重新发布消息。

channel 进入确认模式后，所有后续发布的消息都将被确认或 nack 一次。不保证消息多快得到确认，但任何消息都将会被确认或者拒绝。

仅当负责队列的 Erlang 进程中发生内部错误时，服务器才会发送 `basic.nack`。

**When Will Published Messages Be Confirmed by the Broker?**

对于不可路由的消息，一旦交换机验证消息不会路由到任何队列（返回空队列列表），broker 将发出确认消息。如果该消息也是强制发布的，则 `basic.return` 会在 `basic.ack` 之前发送到客户端。`basic.nack` 也是如此。

对于可路由消息，当所有队列都接受消息时，将发送 `basic.ack`。对于路由到持久队列的持久消息，这意味着持久化到磁盘后才会发送 `basic.ack`。对于仲裁队列 [quorum queues](https://www.rabbitmq.com/quorum-queues.html)，这意味着仲裁副本已接受并确认了发送给当选领导者的消息。

**Ack Latency for Persistent Messages**

Ack Latency for Persistent Messages 即持久化消息的确认延迟。

将消息持久化到磁盘后，将发送路由到持久队列的持久消息的 `basic.ack`。RabbitMQ 消息存储会在一定时间间隔（几百毫秒）后或在队列空闲时将消息批量保存到磁盘，以最大程度地减少 `fsync(2)` 调用的次数。这意味着在恒定负载下，`basic.ack` 的延迟可能达到几百毫秒。为了提高吞吐量，强烈建议应用程序异步处理确认（作为流）或发布批量消息并等待未完成的确认。不同客户端库的具体 API 有所不同。

**Publisher Confirms 注意事项**

在大多数情况下，RabbitMQ 会按照发布的顺序向发布者确认消息（这适用于在单个 channel 上发布的消息）。但是，发布确认是异步发出的，可以确认单个消息或一组消息。发出确认的确切时刻取决于消息的传递模式（持久与瞬态）以及消息路由到的队列的属性（见上文）。也就是说，不同的消息可以被认为在不同的时间准备好确认。这意味着确认可以按照与其各自的消息不同的顺序到达。如果可能的话，应用程序不应依赖于确认的顺序。

**Publisher Confirms and Guaranteed Delivery**

如果 RabbitMQ 节点在将消息写入磁盘之前发生故障，则可能会丢失持久消息。例如，考虑以下场景：

1. 客户端发布持久化消息到持久化队列
2. 客户端使用队列中的消息（注意消息是持久的并且队列是持久的），但服务器没有发出收到消息的确认
3. 服务器节点失败并重新启动，并且客户端重新连接并开始消费消息

此时，客户端可以合理地假设消息将再次传递。但是情况并非如此，重启导致服务器丢失消息。为了保证持久性，客户端应该使用发布确认。如果发布者的 channel 处于确认模式，则发布者将不会收到丢失消息的确认（因为消息尚未写入磁盘）。

:::tip 提示
在[消息的持久化](./messages.html#持久化)中，我们已经知道了为什么需要使用消息发布确认机制。消息的持久化是指消息在 RabbitMQ 服务器重启后仍然存在。但是，如果在消息发送到 RabbitMQ 服务器后，但在消息写入磁盘之前，RabbitMQ 服务器发生故障，那么消息将丢失。因此，我们需要使用消息发布确认机制来保证消息的可靠性。
:::

:::tip 参考
发布确认的更多信息，请参考 [Publisher Confirms](https://www.rabbitmq.com/tutorials/tutorial-seven-java.html)。
:::

发布者确认是 RabbitMQ 的扩展，用于实现可靠的发布。当在 channel 上启用发布者确认时，客户端发布的消息将由 broker 异步确认，这意味着消息已在服务器端得到处理。

接下来，我们将使用发布者确认来确保发布的消息已安全到达 broker。我们将介绍使用发布者确认的几种策略并解释它们的优缺点。

**Enabling Publisher Confirms on a Channel**

发布者确认是 AMQP 0.9.1 协议的 RabbitMQ 扩展，因此默认情况下不启用它们。发布者确认是在 channel 上使用 `confirmSelect` 方法来启用：

```java
Channel channel = connection.createChannel();
channel.confirmSelect();
```
必须在您希望使用发布者确认的每个 channel 上调用此方法，并且，发布确认应该只启用一次，而不是每次发布的消息都启用。


### Publishing Messages Individually

这种策略称为“单个发布确认”。让我们从最简单的确认发布方法开始，即发布消息并同步等待 broker 确认：

```java
while (thereAreMessagesToPublish()) {
    byte[] body = ...;
    BasicProperties properties = ...;
    channel.basicPublish(exchange, queue, properties, body);
    // uses a 5 second timeout
    channel.waitForConfirmsOrDie(5_000);
}
```
在上面的示例中，我们照常发布消息并使用 `Channel#waitForConfirmsOrDie(long)` 方法等待 broker 确认。一旦消息被确认，该方法就会返回，否则该方法将阻塞。如果消息在超时时间内没有得到确认或者被 nack-ed（意味着代理由于某种原因无法处理它），该方法将抛出异常。异常的处理通常包括记录错误消息或重试发送消息。

不同的客户端库有不同的方式来同步处理发布者确认，因此请务必仔细阅读您所使用的客户端的文档。

这种技术非常简单，但也有一个主要缺点：它会显着减慢发布速度，因为消息的确认会阻止所有后续消息的发布。这种方法不会提供每秒超过数百条已发布消息的吞吐量。尽管如此，这对于某些应用程序来说已经足够了。

:::tip 发布者确认是异步的吗？
我们在开始时提到 broker 异步确认已发布的消息，但在第一个示例中，代码同步等待直到消息被确认。客户端实际上异步接收确认并相应地解除对 `waitForConfirmsOrDie` 的调用。将 `waitForConfirmsOrDie` 视为一个同步助手，它在后台依赖于异步通知。

也就是说，服务端的确认是异步的，但客户端封装的 `waitForConfirmsOrDie` 方法看起来是同步的，但是其内部实现是异步的。
:::

示例代码如下：

```java
boolean durable = true;
channel.queueDeclare("confirm.queue.test", durable, false, false, null);
// 启用发布确认
channel.confirmSelect();

long start = System.currentTimeMillis();
for (int i = 0; i < 1000; i++) {
    String message = "message" + i;
    channel.basicPublish("", "confirm.queue.test", MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes(StandardCharsets.UTF_8));
    channel.waitForConfirmsOrDie(5000);
}
long end = System.currentTimeMillis();
System.out.println("cost: " + (end - start) + " ms");
```

### Publishing Messages in Batches

这种策略称为“批量发布确认”。为了改进之前的示例，我们可以发布一批消息并等待整批消息得到确认。以下示例使用每个批次发布 100 条消息：

```java
int batchSize = 100;
int outstandingMessageCount = 0;
while (thereAreMessagesToPublish()) {
    byte[] body = ...;
    BasicProperties properties = ...;
    channel.basicPublish(exchange, queue, properties, body);
    outstandingMessageCount++;
    if (outstandingMessageCount == batchSize) {
        channel.waitForConfirmsOrDie(5_000);
        outstandingMessageCount = 0;
    }
}
if (outstandingMessageCount > 0) {
    channel.waitForConfirmsOrDie(5_000);
}
```

与等待单个消息的确认相比，等待一批消息得到确认可以极大地提高吞吐量（对于远程 RabbitMQ 节点最多可提高 20-30 倍）。缺点是，如果发生故障没有收到服务器的 ack，则必须重新发布整个批次，因此我们可能必须在内存中保留一整批数据以记录有意义的内容或重新发布消息。但是这个方案还是同步的，所以会阻塞消息的发布。

示例代码如下：

```java
boolean durable = true;
channel.queueDeclare("confirm.queue.test", durable, false, false, null);
// 启用发布确认
channel.confirmSelect();

long start = System.currentTimeMillis();
int batchSize = 100;
int outstandingMessageCount = 0;
for (int i = 0; i < 1000; i++) {
    String message = "message" + i;
    channel.basicPublish("", "confirm.queue.test", MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes(StandardCharsets.UTF_8));
    outstandingMessageCount++;
    if (outstandingMessageCount == batchSize) {
        channel.waitForConfirmsOrDie(5000);
        outstandingMessageCount = 0;
    }
}
if (outstandingMessageCount > 0) {
    channel.waitForConfirmsOrDie(5000);
}
long end = System.currentTimeMillis();
System.out.println("cost: " + (end - start) + " ms");
```

### Handling Publisher Confirms Asynchronously

这种策略称为“异步发布确认”。broker 异步确认已发布的消息，只需在客户端上注册回调即可收到这些确认的通知：

```java
Channel channel = connection.createChannel();
channel.confirmSelect();
channel.addConfirmListener((sequenceNumber, multiple) -> {
    // code when message is confirmed
}, (sequenceNumber, multiple) -> {
    // code when message is nack-ed
});
```
有 2 种回调：一种用于已确认的消息，另一种用于 nack-ed 消息（可以被代理视为丢失的消息）。每个回调有 2 个参数：

- sequenceNumber：标识已确认或 nack-ed 消息的编号。我们很快就会看到如何将其与已发布的消息关联起来。
- multiple：这是一个布尔值。如果为 false，则仅确认或 nack-ed 一条消息，如果为 true，则所有小于等于该 sequenceNumber 的消息都会被确认或 nack-ed。

发布前可以使用 `Channel#getNextPublishSeqNo()` 获取 sequenceNumber：

```java
int sequenceNumber = channel.getNextPublishSeqNo();
ch.basicPublish(exchange, queue, properties, body);
```

将消息与 sequenceNumber 关联起来的一种简单方法是使用 map。假设我们想要发布字符串，因为它们很容易转换为字节数组以便发布。以下是使用 map 将发布 sequenceNumber 与消息的字符串正文关联起来的代码示例：

```java
ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
// ... code for confirm callbacks will come later
String body = "...";
outstandingConfirms.put(channel.getNextPublishSeqNo(), body);
channel.basicPublish(exchange, queue, properties, body.getBytes());
```

当收到服务器发送的 ack 时，我们需要清理 map，并执行一些操作，例如在消息被拒绝时记录警告： 

```java
ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
ConfirmCallback cleanOutstandingConfirms = (sequenceNumber, multiple) -> {
    if (multiple) {
        ConcurrentNavigableMap<Long, String> confirmed = outstandingConfirms.headMap(
          sequenceNumber, true
        );
        confirmed.clear();
    } else {
        outstandingConfirms.remove(sequenceNumber);
    }
};

channel.addConfirmListener(cleanOutstandingConfirms, (sequenceNumber, multiple) -> {
    String body = outstandingConfirms.get(sequenceNumber);
    System.err.format(
      "Message with body %s has been nack-ed. Sequence number: %d, multiple: %b%n",
      body, sequenceNumber, multiple
    );
    cleanOutstandingConfirms.handle(sequenceNumber, multiple);
});
// ... publishing code
```

前面的示例包含一个回调，该回调会在 broker 的 ack 到达时清理 map。请注意，此回调可以处理单个确认和多个确认。当 ack 到达时使用此回调（作为 `Channel#addConfirmListener` 的第一个参数）。nack-ed 消息的回调会检索消息正文并发出警告。然后，它重新使用之前的回调来清除未完成确认的 map（无论消息被确认还是未被确认，都必须删除 map 中相应的条目。）

:::tip How to Track Outstanding Confirms?
我们的示例使用 `ConcurrentNavigableMap` 来跟踪未完成的确认。这种数据结构很方便有几个原因。它允许轻松地将 sequenceNumber 与消息关联起来（无论消息数据是什么），并轻松地将条目清理到给定的 sequenceNumber（以处理多个确认或者 nack）。最后，它支持并发访问，因为 ack 回调是在客户端的线程中调用的，该线程应与发布线程不同。

除了使用复杂的 Map 实现之外，还有其他方法可以跟踪未完成的确认，例如使用简单的 `ConcurrentHashMap` 来跟踪 sequenceNumber 的下限。
:::

综上所述，异步处理发布者确认通常需要以下步骤：

- 提供一种将 sequenceNumber 与消息关联起来的方法。
- 在 channel 上注册一个确认侦听器，以便在 ack、nack 到达时收到通知，以执行适当的操作，例如记录或重新发布 nack 消息。在此步骤中，sequenceNumber 与消息的关联机制可能还需要进行一些清理。
- 在发布消息之前跟踪 sequenceNumber。

:::tip Re-publishing nack-ed Messages?
从相应的回调中重新发布 nack-ed 消息可能很诱人，但应该避免这种情况，因为 ack 回调是在 channel 不应该执行操作的 I/O 线程中调度的。更好的解决方案是将消息放入内存队列中，由发布线程轮询。像 `ConcurrentLinkedQueue` 这样的类是在 ack 回调和发布线程之间传输消息的良好候选者。
:::

示例代码如下：

```java
boolean durable = true;
channel.queueDeclare("confirm.queue.test", durable, false, false, null);
// 启用发布确认
channel.confirmSelect();

ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
// 异步回调（sequenceNumber 其实就是 deliveryTag）
ConfirmCallback cleanOutstandingConfirms = (sequenceNumber, multiple) -> {
    if (multiple) {
        System.out.println("batch: " + sequenceNumber);
        // 返回 key 小于等于 sequenceNumber 的所有 key-value
        ConcurrentNavigableMap<Long, String> confirmed = outstandingConfirms.headMap(
                sequenceNumber, true
        );
        System.out.println("confirmed: " + confirmed);
        // 清空 confirmed
        confirmed.clear();
    } else {
        System.out.println("single: " + sequenceNumber);
        System.out.println(outstandingConfirms.get(sequenceNumber));
        outstandingConfirms.remove(sequenceNumber);
    }
};

channel.addConfirmListener(cleanOutstandingConfirms, (sequenceNumber, multiple) -> {
    String body = outstandingConfirms.get(sequenceNumber);
    System.err.format(
            "Message with body %s has been nack-ed. Sequence number: %d, multiple: %b%n",
            body, sequenceNumber, multiple
    );
    cleanOutstandingConfirms.handle(sequenceNumber, multiple);
});

long start = System.currentTimeMillis();
for (int i = 0; i < 1000; i++) {
    String message = "message" + i;
    // 每发布一条消息，就将其记录到 ConcurrentNavigableMap 中
    long nextPublishSeqNo = channel.getNextPublishSeqNo();
    System.out.println("nextPublishSeqNo: " + nextPublishSeqNo);
    outstandingConfirms.put(nextPublishSeqNo, message);
    channel.basicPublish("", "confirm.queue.test", MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes(StandardCharsets.UTF_8));
}
long end = System.currentTimeMillis();
System.out.println("cost: " + (end - start) + " ms");
```

**总结**

在某些应用程序中，确保已发布的消息到达代理可能至关重要。RabbitMQ 的发布者确认功能有助于满足此要求。发布者确认本质上是异步的，但也可以同步处理它们。没有明确的方法来实现发布者确认，这通常取决于应用程序和整个系统的限制。典型的技术有：

- 单独发布消息，同步等待确认：简单，但吞吐量非常有限。
- 批量发布消息，批量同步等待确认：简单、合理的吞吐量，但很难推断何时出现问题。
- 异步处理：最好的性能和资源利用，在出错的情况下很好的控制，但可以参与正确的实现。

在运行上面的例子后，我们可能得到以下输出：

```log
Published 50,000 messages individually in 5,549 ms
Published 50,000 messages in batch in 2,331 ms
Published 50,000 messages and handled confirms asynchronously in 4,054 ms
```
如果客户端和服务器位于同一台计算机上，则计算机上的输出应该看起来相似。单独发布消息的性能如预期的那样较差，但与批量发布相比，异步处理的结果有点令人失望。

发布者确认非常依赖于网络，因此我们最好尝试使用远程节点，这更现实，因为客户端和服务器在生产中通常不在同一台机器上。在这种情况下，我们应该看到更大的差异：

```log
Published 50,000 messages individually in 231,541 ms
Published 50,000 messages in batch in 7,232 ms
Published 50,000 messages and handled confirms asynchronously in 6,332 ms
```

我们发现单独发布现在表现很糟糕。但是，通过客户端和服务器之间的网络，批量发布和异步处理现在的执行方式类似，但发布者确认的异步处理有一点优势。

请记住，批量发布很容易实现，但在发布者否定确认（nack）的情况下，很难知道哪些消息无法到达代理。异步处理发布者确认的主要优点是，我们可以在出现问题时轻松地重新发布消息。但是，这种方法需要更多的代码，因此更容易出错。异步处理发布者确认需要更多的实现，但可以提供更好的粒度，并更好地控制在发布的消息被确认时要执行的操作。

## Limitations

**Maximum Delivery Tag**

交付标签 delivery tag 是一个 64 位 long 类型的值，因此其最大值为 9223372036854775807。由于 delivery tag 的范围是针对每个 channel 的，因此发布者或消费者在实践中不太可能超出该值。
