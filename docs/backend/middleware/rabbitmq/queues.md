# 队列

## 临时队列

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

## 创建队列

其实，上面提到的临时队列是队列中的一种。通过 RabitMQ 的源码，我们可以看到 `queueDeclare()` 方法有 2 个重载方法，其中一个就是不传递任何参数的方法，但是呢，该方法最终还是会调用另一个有参的方法，该方法的签名如下：

```java
/**
 * 创建临时队列
 */
@Override
public AMQP.Queue.DeclareOk queueDeclare() throws IOException {
    return queueDeclare("", false, true, true, null);
}

/**
 * 创建自定义的队列
 */
@Override
public AMQP.Queue.DeclareOk queueDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete, Map<String, Object> arguments) throws IOException {
    final AMQP.Queue.DeclareOk ok = delegate.queueDeclare(queue, durable, exclusive, autoDelete, arguments);
    recordQueue(ok, queue, durable, exclusive, autoDelete, arguments);
    return ok;
}
```
所以，我们只需要了解 `queueDeclare()` 的有参方法即可。

```java
/**
 * Declare a queue
 * @see com.rabbitmq.client.AMQP.Queue.Declare
 * @see com.rabbitmq.client.AMQP.Queue.DeclareOk
 * @param queue 队列名称。如果为空字符串，则由服务器生成一个随机队列名称
 * @param durable 是否持久化。true-持久化，false-不持久化。持久化后，重启 RabbitMQ 服务，队列仍然存在
 * @param exclusive 是否是独占队列（只允许一个 connection 消费该队列）
 * @param autoDelete 是否自动删除。设置为 true 后，当最后一个消费者断开连接后，该队列将自动删除（忽略 durable 属性）
 * @param arguments other properties (construction arguments) for the queue
 * @return a declaration-confirm method to indicate the queue was successfully declared
 * @throws java.io.IOException if an error is encountered
 */
Queue.DeclareOk queueDeclare(String queue, 
                             boolean durable, 
                             boolean exclusive, 
                             boolean autoDelete,
                             Map<String, Object> arguments) throws IOException;
```

下面是一个创建队列的示例：

- 生产者

```java
// 创建一个临时队列。其实调用的方法是
// queueDeclare("", false, true, true, null);
String temporaryQueue = channel.queueDeclare().getQueue();
System.out.println("Temporary queue: " + temporaryQueue);

Scanner scanner = new Scanner(System.in);
String message;

System.out.print("> ");
while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
    // 这里的 my.queue 由消费者创建
    channel.basicPublish("", "my.queue", null, message.getBytes(StandardCharsets.UTF_8));
    System.out.println(" [x] Sent '" + message + "'");
    System.out.print("> ");
}

channel.close();
connection.close();
```

- 消费者

```java
Connection connection = factory.newConnection();
Channel channel = connection.createChannel();
Channel channel1 = connection.createChannel();
Channel channel2 = connection.createChannel();

try {
    // 创建一个队列
    // 如果该队列已经由其它连接创建了, 且 exclusive 是 true, 则会报错 It could be originally declared on another connection or the exclusive property value does not match that of the original declaration
    // 如果 exclusive 是 true，则创建队列和消费该队列必须使用同一个 connection（channel 可以不同）
    String myQueue = channel.queueDeclare("my.queue", true, true, true, null).getQueue();
    System.out.println("My queue: " + myQueue);

    // channel1 和 channel2 都可以消费 my.queue（此处以轮询的方式进行消费）
    channel1.basicConsume("my.queue", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] Channel1 Received '" + message + "'");
    }, consumerTag -> {

    });

    channel2.basicConsume("my.queue", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] Channel2 Received '" + message + "'");
    }, consumerTag -> {

    });

} finally {
    channel1.close();
    connection.close();
}
```

先启动消费者，再启动生产者，然后输入消息，可以看到消息被轮询的消费了。除此之外，我们也可以到 RabbitMQ 管理界面查看队列的创建情况。

![20231223160001](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-23/20231223160001.png)

:::warning 注意
1. 如果需要创建具有 `exclusive` 属性的队列，那么队列的创建和消费必须使用同一个 connection（支持同一个 connention 中的多个 channel）。如果队列的创建和消费使用不同的 connection，那么会出现如下报错：

```log
It could be originally declared on another connection or the exclusive property value does not match that of the original declaration
```
2. 如果队列被声明为 `exclusive`，那么当**创建该队列**的应用程序（如 Java 程序）退出后，该队列将被自动删除。因为此时该队列的 connection 已经关闭，如果不删除该队列的话，那么其它消费者也无法消费该队列了（connection 发生了改变），所以 RabbitMQ 会自动删除该队列。

3. 如果队列同时被声明为 `durable` 和 `exclusive`，那么 `durable` 属性会被忽略，即队列不会被持久化。

4. 如何理解 `autoDelete` 属性？如果队列设置了 `autoDelete` 为 `true`，那么当该队列的最后一个消费者断开连接后，则该队列将被自动删除（会忽略 `durable` 属性）。那么你可能会想到，队列在最开始创建的时候，不就是没有任何消费者吗？那么，队列是不是创建后就被自动删除了，相当于没创建？其实不是这样的，因为队列创建后，它会一直存在，直到有消费者与它连接过，并且该队列的消费者都断开连接后，那么该队列才会被自动删除。
:::
