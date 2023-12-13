# 临时队列

:::tip 参考
[Temporary queues](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)
:::

您可能还记得之前我们使用具有特定名称的队列。能够命名队列对我们来说至关重要，因为通常我们需要将工作人员（消费者）指向同一个队列。当您想要在生产者和消费者之间共享队列时，为队列命名非常重要。

但我们之前创建的日志记录器并非如此。我们希望了解所有日志消息，而不仅仅是其中的一部分。我们也只对当前产生的消息感兴趣，而不关心旧的消息。为了解决这个问题，我们需要两件事。

首先，每当我们连接到 Rabbit 时，我们都需要一个新的空队列。为此，我们可以创建一个具有随机名称的队列，或者更好的办法是让服务器为我们选择一个随机队列名称。

其次，一旦消费者断开连接，队列应该被自动删除。

在 Java 客户端中，当我们不向 `queueDeclare()` 提供任何参数时，我们会创建一个具有随机名称的非持久（non-durable）、独占（exclusive）、自动删除（auto-delete）的队列：

```java
String queueName = channel.queueDeclare().getQueue();
```

此时，`queueName` 是一个随机队列名称。例如，它可能看起来像 `amq.gen-JzTY20BRgKO-HjmUJj0wLg`。

有关独占标志 `exclusive` 和其它队列属性的更多信息，请参考 [guide on queues](https://www.rabbitmq.com/queues.html)。
