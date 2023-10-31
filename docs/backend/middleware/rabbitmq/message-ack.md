# 消息确认

:::tip 参考
[Message acknowledgment](https://www.rabbitmq.com/tutorials/tutorial-two-java.html)
:::

在之前的示例中，我们在消费消息时，都是使用的自动确认模式，如下：

```java
boolean autoAck = true;

channel.basicConsume(
  "queue.hello",
  autoAck,
  (consumerTag, delivery) -> {
      String message = new String(delivery.getBody(), "UTF-8");
      System.out.println(" [x] Received '" + message + "'");
  },
  consumerTag -> {

  }
);
```

在自动确认模式下，一旦 RabbitMQ 将消息传递给消费者，该消息会被会立即将标记为删除。在这种情况下，如果终止了工作线程（或者处理消息的过程中出错了），那么该工作线程刚刚处理的消息就会丢失。

但我们不想失去任何消息。如果一个 worker 宕掉，我们希望将消息交付给另一个 worker。

为了确保消息永远不会丢失，RabbitMQ 支持[消息确认](https://www.rabbitmq.com/confirms.html)。消费者发送一个消息确认，告诉 RabbitMQ 消息已经被接收、处理，并且 RabbitMQ 可以自由删除它。

如果消费者在没有发送 ack 的情况下死亡（其通道关闭、连接关闭或 TCP 连接丢失），RabbitMQ 将知道消息未完全处理并将该消息重新排队。如果此时有其它消费者在线，该消息将很快被重新分发给另一个消费者。如果没有其它消费者在线，则该消息将等待下一个消费者在线。这样就可以确保不会丢失任何消息，即使 worker 偶尔挂掉。

消费者收到消息后，会有一个消息确认（ack）的超时时间（默认为 30 分钟）。这有助于检测从不 ack 的有问题（卡住）的消费者。当然，也可以修改此超时时间，见 [Delivery Acknowledgement Timeout](https://www.rabbitmq.com/consumers.html#acknowledgement-timeout)。

默认情况下，[Manual message acknowledgments](https://www.rabbitmq.com/confirms.html)（手动消息确认）处于打开状态。在前面的示例中，我们通过 `autoAck=true` 显式关闭手动 ack。接下来，我们把 `autoAck` 修改为 `false`，并且使用手动 ack。

```java{12,16}
channel.basicQos(1); // accept only one unack-ed message at a time (see below)

DeliverCallback deliverCallback = (consumerTag, delivery) -> {
  String message = new String(delivery.getBody(), "UTF-8");

  System.out.println(" [x] Received '" + message + "'");
  try {
    doWork(message);
  } finally {
    System.out.println(" [x] Done");
    // 手动 ack
    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
  }
};
// 关闭自动 ack
boolean autoAck = false;
channel.basicConsume(TASK_QUEUE_NAME, autoAck, deliverCallback, consumerTag -> { });
```

ack 必须在接收消息的同一 channel 上发送。尝试使用不同的 channel 进行 ack 将导致通道级协议异常。更多信息见 [doc guide on confirmations](https://www.rabbitmq.com/confirms.html)。

:::warning 忘记 ack
在关闭自动 ack 的情况下，忘记使用 `basicAck` 进行手动确认是一个常见的错误。这是一个很容易犯的错误，但后果却很严重。当客户端退出时，消息将被重新传送（这可能看起来像随机重新传送），但 RabbitMQ 会占用越来越多的内存，因为它无法释放任何未确认的消息。

为了调试这种错误，可以使用 `rabbitmqctl` 查看 `messages_unacknowledged` 字段：

```sh:no-line-numbers
sudo rabbitmqctl list_queues name messages_ready messages_unacknowledged
```
在 Windows 上，删除 `sudo`：
```sh:no-line-numbers
rabbitmqctl.bat list_queues name messages_ready messages_unacknowledged
```
:::
