# 消息

## 消息确认

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

下面是一段测试代码，用于测试手动 ack：

```java
Connection connection = factory.newConnection();
Channel channel1 = connection.createChannel();
Channel channel2 = connection.createChannel();
Channel channel3 = connection.createChannel();

try {

    try {
        // 手动 ack
        channel1.basicConsume("ack.queue.test", false, (consumerTag, delivery) -> {
            String message = new String(delivery.getBody());
            System.out.println(" [x] Channel1 Received '" + message + "'");
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(" [x] Channel1 deal error");

            // throw new RuntimeException("deal error");

        }, consumerTag -> {
            System.out.println("channel1 cancel, consumerTag: " + consumerTag);
        });
    } catch (Exception e) {
        e.printStackTrace();
    }

    channel2.basicConsume("ack.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] Channel2 Received '" + message + "'");
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }, consumerTag -> {
        System.out.println("channel2 cancel, consumerTag: " + consumerTag);
    });

    channel3.basicConsume("ack.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] Channel3 Received '" + message + "'");
        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }, consumerTag -> {
        System.out.println("channel3 cancel, consumerTag: " + consumerTag);
    });

} finally {
    
}
```

当某个消费者开启了手动 ack 后，我们可以在 RabbitMQ 管理界面中看到 `Ack required` 字段有一个黑色的实心圆点：

![20231223170700](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-23/20231223170700.png)

如果消费者使用了手动 ack，但是消费者收到消息后没有进行 ack，那么我们可以在 RabbitMQ 管理界面的队列中看到 `Unacked messages` 的数量：

![20231223170948](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-23/20231223170948.png)

:::tip 注意
如果某个消费者开启了手动 ack，但是消费者收到消息后没有进行 ack，那么当该消费者断开连接后，该消费者未进行 ack 的所有消息会重新进行排队（无需等到 ack 的超时时间，马上就会重新把这些消息进行排队）（MQ 后台管理界面中可以看到队列中消息的状态由 `Unacked` 变为 `Ready` 状态）。当有新的消费者连接上来后，这些重新排队的消息会被重新分发给新的消费者（从我的测试来看，重新入队的消息会全部交给第一个连接到队列的新消费者来处理，并不会进行轮询分发）。

如果某个消费者开启了手动 ack，并且处理消息的过程中出错了（在 `DeliverCallback` 中抛出了异常），那么这条消息有如下 2 种处理方式：

- 如果此时有其它消费者在线，则交给其它消费者进行处理，并且当前这个消费者会被 RabbitMQ 从消费者中移除（即不会再接收到新消息，可以在 MQ 控制台查看队列的消费者数量，会发现少了一个）
- 如果此时没有其它消费者在线，则该消息重新进入队列（MQ 后台管理界面中可以看到队列中消息的状态由 `Unacked` 变为 `Ready` 状态），并且当前这个消费者会被 RabbitMQ 从消费者中移除（即不会再接收到新消息，可以在 MQ 控制台查看队列的消费者数量，会发现少了一个）

如果某个消费者开启了手动 ack，处理消息的过程中没有出错，但是消费之迟迟没有进行 ack，那么在 ack 的超时时间之后（默认 30 分钟），该消息会重新进行排队。

值得注意的是，如果我们在进行手动 ack 后，还执行了其它逻辑，在执行其它逻辑时抛出了异常，那么此条消息并不会被重新放入队列，而是不丢弃，因为我们已经发送了 ack。所以，在日常开发过程中，建议将 ack 操作放在代码的最后一行或者 `finally` 中。

**上面提到了重新入队，策略是怎样的呢？放入队列尾部还是放在原来的位置？**
:::

:::tip 提示
关于自动应答和手动应答，具体该使用哪种方式呢？其实并没有一个确切的结论，我们需要在高吞吐量和数据传输安全性方面做权衡。毫无疑问，自动应答能提高 MQ 的吞吐量，但这可能使得消费者由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死，所以这种模式仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用。
:::

## 持久化

:::tip 参考
[Message durability](https://www.rabbitmq.com/tutorials/tutorial-two-java.html)
:::

在上面，我们已经学会了如何确保即使消费者死亡，任务也不会丢失。但是如果 RabbitMQ 服务器停止，我们的任务仍然会丢失。

当 RabbitMQ 退出或崩溃时，它会忘记队列和消息，除非您告诉它不要这样做。要确保消息不丢失，需要做两件事：**将队列和消息标记为 `durable`**。

首先，我们需要确保队列能够在 RabbitMQ 节点重新启动后继续存在。为此，我们需要将其声明为 `durable`：

```java
boolean durable = true;
channel.queueDeclare("hello", durable, false, false, null);
```

尽管这个命令本身是正确的，但它在我们当前的设置中不起作用。这是因为我们之前已经定义了一个名为 `hello` 的队列，它是非持久化的。RabbitMQ 不允许您使用不同的参数重新定义现有的同名队列，并且会向您报告错误。但是有一个快速的解决方法，让我们声明一个具有不同名称的队列，例如 `task_queue`：

```java
boolean durable = true;
channel.queueDeclare("task_queue", durable, false, false, null);
```

此时我们就可以确定，即使 RabbitMQ 重启，`task_queue` 队列也不会丢失。现在我们需要将消息标记为 `durable`，通过将 `MessageProperties` 设置为 `PERSISTENT_TEXT_PLAIN`。

```java
import com.rabbitmq.client.MessageProperties;

channel.basicPublish("", "task_queue", MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes());
```            
:::warning 注意
将消息标记为 `durable` 并不能完全保证消息不会丢失。尽管它告诉 RabbitMQ 将消息保存到磁盘，而 RabbitMQ 已接受消息但尚未保存的时间窗口仍然很短。此外，RabbitMQ 不会对每条消息执行 `fsync(2)`，它可能只是保存到缓存中，而不是真正写入磁盘。持久性保证并不强，但对于我们简单的任务队列来说已经足够了。如果您需要更强的保证，那么您可以使用 [publisher confirms](https://www.rabbitmq.com/confirms.html)。
:::

与 `Channel` 有关的方法和 `MessageProperties` 的更多信息，您可以浏览 [JavaDocs online](https://rabbitmq.github.io/rabbitmq-java-client/api/current/)。

## 轮询分发

:::tip 参考
[Round-robin dispatching](https://www.rabbitmq.com/tutorials/tutorial-two-java.html)。
:::

在 [Work Queues](./work-pattern.html#work-queues) 中我们已经提到过了，这里就不再赘述了。

## 公平分发

:::tip 参考
[Fair dispatch](https://www.rabbitmq.com/tutorials/tutorial-two-java.html)
:::

你可能已经注意到分发仍然不能完全按照我们想要的方式工作，例如在有两个消费者的情况下，当所有奇数消息都 "heavy"，偶数消息 "light" 时，一个消费者将一直忙碌，而另一个几乎没有工作。但是，RabbitMQ 对此一无所知，仍然会均匀地分发消息（默认是轮询，参考 [Work Queues](./work-pattern.html#work-queues)）。

发生这种情况是因为 RabbitMQ 只是在消息进入队列时才调度该消息。它不会查看消费者未确认（unacked）消息的数量。它只是盲目地将第 n 条消息分派给第 n 个消费者。

![prefetch-count](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-23/prefetch-count.png)

为了解决这个问题，我们可以使用 `basicQos` 方法并设置 `prefetchCount = 1`（`prefetchCount` 默认为 0）。这告诉 RabbitMQ 不要一次给一个消费者多于一条消息。换句话说，在消费者处理并确认前一条消息之前，不要向该消费者发送新消息。相反，RabbitMQ 会将新消息分派给下一个不忙的消费者。

```java
int prefetchCount = 1;
channel.basicQos(prefetchCount);

channel.basicConsume("quque.hello", true, (consumerTag, delivery) -> {
    String message = new String(delivery.getBody());
    System.out.println(" [x] Received '" + message + "'");
}, consumerTag -> {

});
```

:::tip 提示
简单来讲，`prefetchCount` 的作用就是告诉 RabbitMQ 一次给多少条消息给消费者，如果消费者没有 ack，那么 RabbitMQ 就不会再给该消费者发送新的消息，直到该消费者 ack 了之前的所有消息。

如果队列中已经有积压的消息，那么在应用程序（消费者）启动后， RabbitMQ 会将队列中积压的消息按照消费者配置的 `prefetchCount` 将消息发送给消费者（如果第一个消费者的 `prefetchCount` 为 0，那么 RabbitMQ 会将积压的所有消息一次性全部发送给该队列的第一个消费者，如果此时，队列中有新的消息进入了，那么新进入队列的消息才会按照消费者配置的 `prefetchCount` 发送给消费者；如果第一个消费者的 `prefetchCount` 不为 0，但是该消费者使用了自动 ack，那么 RabbitMQ 也会将积压的所有消息一次性全部发送给该队列的第一个消费者）。
:::

:::warning 注意
如果所有消费者都很忙，您的队列可能会被填满。您需要密切关注这一点，也许添加更多的消费者，或者制定其他策略。此外，ack 的方式也会影响到 `prefetchCount` 的作用，如果消费者使用了自动 ack，那么 `prefetchCount` 的意义就不大了。

如果所有的消费者都很忙，那么消息仍然会在它们之间轮询。虽然这种分配方式不是很公平，但是它仍然有效。如果您希望严格按照每个消费者的能力分配，请参阅 [Consumer priorities](https://www.rabbitmq.com/consumer-priority.html)。
:::

给消费者设置 `prefetchCount` 之后，我们可以在 RabbitMQ 管理界面中看到 `Prefetch count` 字段的值：

![20231224173511](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-24/20231224173511.png)
