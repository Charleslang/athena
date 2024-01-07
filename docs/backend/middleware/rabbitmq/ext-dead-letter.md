# 死信

:::tip 参考
[Dead Letter Exchanges](https://www.rabbitmq.com/dlx.html)。
:::

**什么是死信交换机？**

队列中的消息可能是“死信”的，这意味着当出现以下任何情况时，这些消息将重新发布到交换器。

- 消费者使用 `basic.reject` 或 `basic.nack` 否定确认消息，并将 `requeue` 参数设置为 false
- 消息在队列中过期 [per-message TTL](https://www.rabbitmq.com/ttl.html)
- 由于队列超出长度限制 [length limit](https://www.rabbitmq.com/maxlength.html)，消息被丢弃

请注意，如果队列过期，队列中的消息不会“死信”。

死信交换机（DLX）和普通的交换机是一样的，它们可以是任何类型。

对于任何给定的队列，DLX 可以由客户端使用 [queue's arguments](https://www.rabbitmq.com/queues.html#optional-arguments) 来定义，或者在服务器中使用 [policies](https://www.rabbitmq.com/parameters.html#policies) 来定义。在 policies 和 arguments 都指定 DLX 的情况下，arguments 中指定的 DLX 会覆盖 policies 中指定的 DLX。

建议使用 policies 进行配置，因为在修改 DLX 相关的配置后，它允许不重启应用程序就能使得配置生效。

**使用 policies 配置死信交换机**

要使用 policies 指定 DLX，请将 “dead-letter-exchange”添加到 policies 定义中。例如：

| OS | 配置 |
| --- | --- |
|Linux|`rabbitmqctl set_policy DLX ".*" '{"dead-letter-exchange":"my-dlx"}' --apply-to queues`|
|Windows|`rabbitmqctl set_policy DLX ".*" "{""dead-letter-exchange"":""my-dlx""}" --apply-to queues`|

上面配置的 policies 将 DLX “my-dlx” 应用于所有队列。这仅是一个示例，在实践中，不同的队列组通常使用不同的死信设置（或根本不使用）。

类似地，可以通过将 “dead-letter-routing-key” 添加到 policy 来指定显式路由键 routing key。

还可以使用管理插件定义策略，见 [policy documentation](https://www.rabbitmq.com/parameters.html#policies)。

**Configuring a Dead Letter Exchange using Optional Queue Arguments**

要为队列设置 DLX，请在声明队列时指定可选的 `x-dead-letter-exchange` 参数。该值必须是同一 vhost 中的交换机名称：

```java{4}
channel.exchangeDeclare("some.exchange.name", "direct");

Map<String, Object> args = new HashMap<String, Object>();
args.put("x-dead-letter-exchange", "some.exchange.name");
channel.queueDeclare("myqueue", false, false, false, args);
```

上面的代码声明了一个名为 `some.exchange.name` 的新交换机，并将这个新交换机设置为新创建的队列的死信交换机。请注意，交换机不必在声明队列时一起声明，但在消息需要死信时应该存在此交换机，否则消息将被丢弃。

您还可以指定当消息成为死信时要使用的路由键 routing key。如果未设置路由键，则使用消息自己的路由键。

```java
args.put("x-dead-letter-routing-key", "some-routing-key");
```

当指定死信交换机时，除了对声明的队列的通用配置权限之外，用户还必须具有对该队列的读取权限和对死信交换机的写入权限。权限在声明队列时进行验证。

**Routing Dead-Lettered Messages**

死信消息将路由到其死信交换机： 为它们所在的队列指定路由键；或者，如果没有设置，则使用消息最初的路由键。

例如，如果您使用 foo 路由键将消息发布到交换机，并且该消息是死信的，则该消息将发布到具有 foo 路由键的死信交换机。如果消息最初的队列声明的 `x-dead-letter-routing-key` 设置为 bar，则消息将使用 bar 路由键发布到其死信交换机。

请注意，如果没有为队列设置特定的路由键，则队列上的消息及其所有原始路由键都是死信的。这包括由 `CC` 和 `BCC` header 添加的 routing key（有关这两个 header 的详细信息，见 [Sender-selected distribution](https://www.rabbitmq.com/sender-selected.html)）。

可以形成消息死信的循环。例如，当队列向默认交换机发送“死信”消息而未指定死信路由键时，可能会发生这种情况。如果整个周期中没有拒绝，则此类周期中的消息（即两次到达同一队列的消息）将被丢弃。

**Safety**

默认情况下，死信消息会在内部未启用发布确认的情况下重新发布。因此，在集群 RabbitMQ 环境中使用 DLX 并不能保证安全。消息发布到 DLX 目标队列后立即从原始队列中删除。这确保了不会出现过多的消息堆积，从而耗尽服务器资源。但是，如果目标队列无法接受消息，则消息可能会丢失。

从 RabbitMQ 3.10 起，仲裁队列支持[至少一次死信](https://www.rabbitmq.com/quorum-queues.html#dead-lettering)，其中消息在内部打开发布者确认的情况下重新发布。

**Dead-Lettered Effects on Messages**

消息的死信会修改其 header：

- 交换机名称替换为最新的死信交换机的名称
- 路由键可以替换为执行死信的队列中指定的路由键
- 如果发生上述情况，`CC` header 也将被删除，并且 `BCC` header 将根据 [Sender-selected distribution](https://www.rabbitmq.com/sender-selected.html) 被删除

死信过程将一个数组添加到每个名为 `x-death` 的死信消息的 header 中。该数组包含每个死信事件的一个 entry，该 entry 由一对 `{queue, Reason}` 标识。每个这样的 entry 都是一个由多个字段组成的 table：

- `queue`：消息成为死信之前所在队列的名称
- `time`：消息成为死信的时间戳，以毫秒为单位（64 位 AMQP 0-9-1 时间戳形式）
- `exchange`：消息发布到的交换机（注意，如果消息多次出现死信，则这是死信交换机）
- `routing-keys`：发布消息所用的 routing key（包括 `CC` routing key，但不包括 `BCC` routing key）
- `count`：由于这个原因（即 `reason` 字段）该消息在该队列中被死信了多少次
- `original-expiration`（如果消息由于每条消息的 [TTL](https://www.rabbitmq.com/ttl.html#per-message-ttl) 而成为死信）：消息的原始 `expiration` 属性。死信消息中的 `expiration` 属性会被删除，以防止其在路由到的任何队列中再次过期。
- `reason`：成为死信的原因，可能是以下之一：
  - `rejected`：消息被消费者拒绝，并且 `requeue` 参数设置为 false
  - `expired`：消息过期，见 [message TTL](https://www.rabbitmq.com/ttl.html)
  - `maxlen`：队列达到最大长度，见 [maximum allowed queue length](https://www.rabbitmq.com/maxlength.html)
  - `delivery_limit`：消息返回次数超过限制（由仲裁队列的 policy 参数设置 [delivery-limit](https://www.rabbitmq.com/quorum-queues.html#poison-message-handling)）。

新 entry 被添加到 `x-death` 数组的开头。如果 `x-death` 已包含具有相同队列和死信原因的 entry，则其 `count` 字段会递增，并移动到数组的开头。

为第一个死信事件添加了三个顶级标头。他们是：

- `x-first-death-reason`：第一个死信事件的原因
- `x-first-death-queue`：第一个死信事件的队列
- `x-first-death-exchange`：第一个死信事件的交换机

它们与原始死信事件的 `reason`、`queue`、`exchange` 字段具有相同的值。一旦添加，这些标头就不会被修改。

请注意，该数组按最近在前排序，因此最新的死信记录在第一个 entry 中。

下面，通过代码来演示一下上面提到的三种死信情况。


:::details 消息被拒绝

- `DLProducer.java`

```java
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    channel.exchangeDeclare("normal.exchange.test", BuiltinExchangeType.TOPIC);

    Scanner scanner = new Scanner(System.in);

    String message;
    System.out.print("> ");
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        channel.basicPublish("normal.exchange.test", "prefix.normal.routing.key", null, message.getBytes(StandardCharsets.UTF_8));
        System.out.print("> ");
    }

    channel.close();
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (connection != null) {
        connection.close();
    }
}
```

- `NormalConsumer.java`

```java
try {
    // 声明死信交换机
    channel.exchangeDeclare("dl.exchange.test", BuiltinExchangeType.TOPIC);
    Map<String, Object> params = new HashMap<>();
    params.put("x-dead-letter-exchange", "dl.exchange.test");
    params.put("x-dead-letter-routing-key", "dl.routing.key");
    // 声明死信队列
    channel.queueDeclare("dl.queue.test", false, false, false, null);
    // 将死信队列绑定到死信交换机
    channel.queueBind("dl.queue.test", "dl.exchange.test", "#.dl.routing.key");

    // 声明普通队列，并绑定死信交换机
    channel.queueDeclare("normal.queue.test", false, false, false, params);
    // 将普通队列绑定到普通交换机
    channel.queueBind("normal.queue.test", "normal.exchange.test", "*.normal.routing.key");

    boolean autoAck = false;
    channel.basicConsume("normal.queue.test", autoAck, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] channel reject '" + message + "'");
        // 触发死信
        channel.basicReject(delivery.getEnvelope().getDeliveryTag(), false);
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```

- `DLConsumer.java`

```java
try {
    channel.basicConsume("dl.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] channel Received DL message '" + message + "'");
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```
:::

:::details 消息过期
- `MessageTTLProducer.java`

```java
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    // 声明死信交换机
    channel.exchangeDeclare("msg.ttl.dl.exchange.test", BuiltinExchangeType.TOPIC);
    Map<String, Object> params = new HashMap<>();
    params.put("x-dead-letter-exchange", "msg.ttl.dl.exchange.test");
    params.put("x-dead-letter-routing-key", "msg.ttl.dl.routing.key");
    // 在 5 s 内没有被消费的消息会被 "丢弃"，如果有死信队列，那么会被路由到死信队列
    params.put("x-message-ttl", 5000);
    // 声明死信队列
    channel.queueDeclare("msg.ttl.dl.queue.test", false, false, false, null);
    // 死信队列绑定到死信交换机
    channel.queueBind("msg.ttl.dl.queue.test", "msg.ttl.dl.exchange.test", "#.msg.ttl.dl.routing.key");

    // 声明普通队列，并绑定死信交换机
    channel.queueDeclare("msg.ttl.queue.test", false, false, false, params);
    // 将普通队列绑定到普通交换机
    channel.exchangeDeclare("msg.ttl.exchange.test", BuiltinExchangeType.TOPIC);
    channel.queueBind("msg.ttl.queue.test", "msg.ttl.exchange.test", "#.msg.ttl.routing.key");

    Scanner scanner = new Scanner(System.in);

    String message;
    System.out.print("> ");
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        channel.basicPublish("msg.ttl.exchange.test", "msg.ttl.routing.key", null, message.getBytes(StandardCharsets.UTF_8));
        System.out.print("> ");
    }

    channel.close();
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (connection != null) {
        connection.close();
    }
}
```

- `MessageTTLConsumer.java`

```java
Connection connection = factory.newConnection();
Channel channel = connection.createChannel();
Channel dlChannel = connection.createChannel();

try {
    // boolean autoAck = false;
    // channel.basicConsume("msg.ttl.queue.test", autoAck, (consumerTag, delivery) -> {
    //     String message = new String(delivery.getBody());
    //     System.out.println(" [x] channel reject '" + message + "'");
    // }, consumerTag -> {
    //     System.out.println("channel cancel, consumerTag: " + consumerTag);
    // });

    dlChannel.basicConsume("msg.ttl.dl.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] dlChannel Received '" + message + "'");
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```
:::

:::details 队列达到最大长度
- `QueueLengthLimitProducer.java`

```java
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    // 声明死信交换机
    channel.exchangeDeclare("length.limit.dl.exchange.test", BuiltinExchangeType.TOPIC);
    Map<String, Object> params = new HashMap<>();
    params.put("x-dead-letter-exchange", "length.limit.dl.exchange.test");
    params.put("x-dead-letter-routing-key", "length.limit.dl.routing.key");
    // 队列最大长度为 5，队列存储的消息超过 5 个消息后，新的消息会被 "丢弃"，如果有死信队列，那么会被路由到死信队列
    // 默认丢弃最早的消息，可以通过设置 x-overflow 参数为 drop-head 或 reject-publish 来改变这种行为
    params.put("x-max-length", 5);
    // 声明死信队列
    channel.queueDeclare("length.limit.dl.queue.test", false, false, false, null);
    // 死信队列绑定到死信交换机
    channel.queueBind("length.limit.dl.queue.test", "length.limit.dl.exchange.test", "#.length.limit.dl.routing.key");

    // 声明普通队列，并绑定死信交换机
    channel.queueDeclare("length.limit.queue.test", false, false, false, params);
    // 将普通队列绑定到普通交换机
    channel.exchangeDeclare("length.limit.exchange.test", BuiltinExchangeType.TOPIC);
    channel.queueBind("length.limit.queue.test", "length.limit.exchange.test", "#.length.limit.routing.key");

    Scanner scanner = new Scanner(System.in);

    String message;
    System.out.print("> ");
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        channel.basicPublish("length.limit.exchange.test", "length.limit.routing.key", null, message.getBytes(StandardCharsets.UTF_8));
        System.out.print("> ");
    }

    channel.close();
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (connection != null) {
        connection.close();
    }
}
```

- `QueueLengthLimitConsumer.java`

```java
Connection connection = factory.newConnection();
Channel channel = connection.createChannel();
Channel dlChannel = connection.createChannel();

try {
    // boolean autoAck = false;
    // channel.basicConsume("length.limit.queue.test", autoAck, (consumerTag, delivery) -> {
    //   String message = new String(delivery.getBody());
    //   System.out.println(" [x] channel reject '" + message + "'");
    // }, consumerTag -> {
    //   System.out.println("channel cancel, consumerTag: " + consumerTag);
    // });

    dlChannel.basicConsume("length.limit.dl.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(" [x] dlChannel Received '" + message + "'");
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```
:::

当一个队列设置了死信交换机后，我们在 RabbitMQ 管理界面可以看到这个队列的死信交换机：

![20240107182910](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-07/20240107182910.png)

当一个队列设置了死信 routing key 后，我们在 RabbitMQ 管理界面可以看到这个队列的死信 routing key：

![20240107183016](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-07/20240107183016.png)
