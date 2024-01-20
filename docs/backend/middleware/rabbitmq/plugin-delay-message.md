# 延迟消息

:::tip 参考
[Scheduling Messages with RabbitMQ](https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq)
:::

## Overview

为什么需要使用延迟消息呢？试想一下下面的场景：

- 订单在十分钟之内未支付则自动取消。
- 新创建的店铺，如果在十天内都没有上传过商品，则自动发送消息提醒。
- 用户注册成功后，如果三天内没有登陆则进行短信提醒。
- 用户发起退款，如果三天内没有得到处理则通知相关运营人员。
- 预定会议后，需要在预定的时间点前十分钟通知各个与会人员参加会议。

这些场景都有一个特点，需要在某个事件发生之后或者之前的指定时间点完成某一项任务。看起来似乎使用定时任务一直轮询数据，每秒查一次，取出需要被处理的数据，然后处理不就完事了吗？如果数据量比较少，确实可以这样做。但对于数据量比较大，并且时效性较强的场景，如：“订单十分钟内未支付则关闭“，短期内未支付的订单数据可能会有很多，活动期间甚至会达到百万甚至千万级别，对这么庞大的数据量仍旧使用轮询的方式显然是不可取的，很可能在一秒内无法完成所有订单的检查，同时会给数据库带来很大压力，无法满足业务要求而且性能低下。

## 基于死信队列

针对上面这些场景，我们就可以使用 MQ 的延迟消息来实现。我们先来看看如何使用死信队列来实现上面的功能。

- `DelayProducer.java`

```java
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    // 声明死信交换机
    channel.exchangeDeclare("delay.exchange.test", BuiltinExchangeType.FANOUT);
    Map<String, Object> params = new HashMap<>();
    params.put("x-dead-letter-exchange", "delay.exchange.test");
    params.put("x-dead-letter-routing-key", "delay.routing.key");
    // 在 5 s 内没有被消费的消息会被 "丢弃"，如果有死信队列，那么会被路由到死信队列。即 5 s 后执行某个业务
    params.put("x-message-ttl", 5000);
    // 声明死信队列
    channel.queueDeclare("delay.queue.test", false, false, false, null);
    // 死信队列绑定到死信交换机
    channel.queueBind("delay.queue.test", "delay.exchange.test", "");

    // 声明普通队列，并绑定死信交换机。订单业务队列
    channel.queueDeclare("order.queue.test", false, false, false, params);
    // 将普通队列绑定到普通交换机
    channel.exchangeDeclare("order.exchange.test", BuiltinExchangeType.TOPIC);
    channel.queueBind("order.queue.test", "order.exchange.test", "order.routing.key");

    Scanner scanner = new Scanner(System.in);

    String message;
    System.out.print("> ");
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        System.out.println("[" + dateTimeFormatter.format(java.time.LocalDateTime.now()) + "] " + message);
        channel.basicPublish("order.exchange.test", "order.routing.key", null, message.getBytes(StandardCharsets.UTF_8));
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

- `DelayConsumer.java`

```java
try {
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    channel.basicConsume("delay.queue.test", true, (consumerTag, delivery) -> {
        // 1. 查询订单状态是否是未支付
        // 2. 如果是未支付，那么修改订单状态为超时取消
        String message = new String(delivery.getBody());
        System.out.println(dateTimeFormatter.format(LocalDateTime.now()) + " [x] channel Received '" + message + "'");
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```

运行结果如下：

- `DelayProducer.java`

```log
> order123456
[2024-01-10 21:54:06] order123456
> order000
[2024-01-10 21:54:27] order000
```

- `DelayConsumer.java`

```log
2024-01-10 21:54:11 [x] channel Received 'order123456'
2024-01-10 21:54:32 [x] channel Received 'order000'
```

我们会看到，生产者发送消息 5 s 后，消费者才会收到消息，这就是延迟消息的效果。

但是呢，这样会有一个问题。试想一下，如果另一个业务要求订单 10 s 后过期，那是不是我们还需要再创建一个队列和一个交换机，然后把新队列的 `x-message-ttl` 设置为 10 s，最后把这个新队列也绑定到之前的死信交换机上。但是，如果我们有 100 个这样的业务，那么我们就需要创建 100 个队列和 100 个交换机，这样就会导致交换机和队列的数量爆炸，不利于管理。

为了解决这个问题，我们可以在发送消息的时候，给消息单独设置一个 ttl，而不是给队列设置 ttl。这样，我们就可以在发送消息的时候，指定不同的 ttl，而不需要创建多个队列和交换机。见 [TTL](./ext-ttl.html)。我们只需要修改生产者的代码，如下：

```java{11,32-33}
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    // 声明死信交换机
    channel.exchangeDeclare("delay.exchange.test", BuiltinExchangeType.FANOUT);
    Map<String, Object> params = new HashMap<>();
    params.put("x-dead-letter-exchange", "delay.exchange.test");
    params.put("x-dead-letter-routing-key", "delay.routing.key");
    // 在 5 s 内没有被消费的消息会被 "丢弃"，如果有死信队列，那么会被路由到死信队列。即 5 s 后执行某个业务
    // params.put("x-message-ttl", 5000);
    // 声明死信队列
    channel.queueDeclare("delay.queue.test", false, false, false, null);
    // 死信队列绑定到死信交换机
    channel.queueBind("delay.queue.test", "delay.exchange.test", "");

    // 声明普通队列，并绑定死信交换机。订单业务队列
    channel.queueDeclare("order.queue.test", false, false, false, params);
    // 将普通队列绑定到普通交换机
    channel.exchangeDeclare("order.exchange.test", BuiltinExchangeType.TOPIC);
    channel.queueBind("order.queue.test", "order.exchange.test", "order.routing.key");

    Scanner scanner = new Scanner(System.in);

    String message;
    System.out.print("> ");
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        System.out.println("[" + dateTimeFormatter.format(java.time.LocalDateTime.now()) + "] " + message);
        String[] msgArray = message.split(":");
        // 为每条消息单独设置 ttl
        AMQP.BasicProperties properties = new AMQP.BasicProperties.Builder().expiration(msgArray[1]).build();
        channel.basicPublish("order.exchange.test", "order.routing.key", properties, msgArray[0].getBytes(StandardCharsets.UTF_8));
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
然后，在发送消息时，带上 ttl，如下：

```log
> order1:10000
[2024-01-10 22:09:58] order1:10000
> order2:3000
[2024-01-10 22:10:16] order2:3000
```

消费者收到消息的时间如下：

```log
2024-01-10 22:10:08 [x] channel Received 'order1'
2024-01-10 22:10:19 [x] channel Received 'order2'
```

但是，结果总是不尽人意。我们来进行这样一个测试，连续发送两条消息，第一条消息的 ttl 是 20 s，第二条消息的 ttl 是 3 s。按理来说，第二条消息先过期，应该先被消费者消费，但是实际上，第一条消息先被消费者消费了。这是为什么呢？因为当第二条消息进入队列时，它是排在第二位的，而第一条消息排在第一位，在 [TTL](./ext-ttl.html) 中我们提到过，**只有当过期的消息到达队列的头部时，它们才会被检测是否过期，才会真正被丢弃（或死信）**。所以，虽然第二条消息已经过期了，但是它还没有到达队列的头部，所以它还没有被丢弃，需要等到第一条消息过期后，第二条消息才会被 RabbitMQ 检测到已经过期了，然后才会被丢弃。为什么要这样设计呢？猜想是为了保证消息的顺序性？为了保证性能，不然需要以一定时间间隔遍历队列，看看有没有过期的消息，这样性能会很低？测试结果如下：

- `DelayProducer.java`

```log
> order3:20000
[2024-01-10 22:16:59] order3:20000
> order4:3000
[2024-01-10 22:17:05] order4:3000
```

- `DelayConsumer.java`

```log
2024-01-10 22:17:20 [x] channel Received 'order3'
2024-01-10 22:17:20 [x] channel Received 'order4'
```

## 基于插件

为了解决这个问题，我们可以使用 RabbitMQ 的插件 [rabbitmq_delayed_message_exchange](https://www.rabbitmq.com/community-plugins.html)。参考 [Community Plugins](https://www.rabbitmq.com/plugins.html)。

在插件界面找到下载地址：

![20240110223727](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-10/20240110223727.png)

选择与 RabbitMQ 版本相同的插件进行下载：

![20240110223929](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-10/20240110223929.png)

安装插件可参考 [Installing Additional Plugins](https://www.rabbitmq.com/installing-plugins.html)。步骤如下：

1. 将下载好的插件放到 RabbitMQ 的 `plugins` 目录下。
2. 执行 `rabbitmq-plugins enable rabbitmq_delayed_message_exchange` 命令启用插件。
3. 重启 RabbitMQ。

一些常用命令如下：

```bash
# 启用插件
rabbitmq-plugins enable rabbitmq_delayed_message_exchange

# 禁用插件
rabbitmq-plugins disable rabbitmq_delayed_message_exchange

# 查看插件列表
rabbitmq-plugins list
```

安装完成后，在 RabbitMQ 管理界面创建交换机，可以发现，多了一个 `x-delayed-message` 类型：

![20240110224948](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-10/20240110224948.png)

延迟消息的使用方法可参考 [github.com/rabbitmq/rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange)。

- `DelayPluginProducer.java`

```java{7-10,27-29}
try {
    connection = factory.newConnection(addresses);
    Channel channel = connection.createChannel();

    // 声明延迟交换机
    Map<String, Object> params = new HashMap<>();
    // x-delayed-type 的值可以是 RabbitMQ 自带的交换机类型，也可以是自定义或者其它插件的交换机类型
    params.put("x-delayed-type", BuiltinExchangeType.FANOUT.getType());
    // 声明延迟交换机，注意这里的类型是固定的 x-delayed-message
    channel.exchangeDeclare("delay.exchange.test", "x-delayed-message", false, false, params);

    // 声明队列
    channel.queueDeclare("delay.queue.test", false, false, false, null);

    // 绑定队列到延迟交换机
    channel.queueBind("delay.queue.test", "delay.exchange.test", "");

    Scanner scanner = new Scanner(System.in);
    String message;
    System.out.print("> ");

    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Map<String, Object> headers = new HashMap<>();
    while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
        String[] msgArray = message.split(":");
        // 设置消息的延迟时间，单位是毫秒
        headers.put("x-delay", msgArray[1]);
        AMQP.BasicProperties.Builder props = new AMQP.BasicProperties.Builder().headers(headers);
        channel.basicPublish("delay.exchange.test", "delay.queue.test", props.build(), msgArray[0].getBytes(StandardCharsets.UTF_8));
        System.out.println(simpleDateFormat.format(new Date()) + " [x] Sent '" + msgArray[0] + "'");
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

- `DelayPluginConsumer.java`

```java
try {
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    channel.basicConsume("delay.queue.test", true, (consumerTag, delivery) -> {
        String message = new String(delivery.getBody());
        System.out.println(simpleDateFormat.format(new Date()) + " [x] Received '" + message + "'");
    }, consumerTag -> {
        System.out.println("channel cancel, consumerTag: " + consumerTag);
    });

} finally {
    //channel1.close();
    //connection.close();
}
```

运行生产者代码后，会发现创建了如下的交换机：

![20240120151951](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/20240120151951.png)

接着，我们就可以发送消息来验证延迟消息的效果了：

- 生产者

```log
> message1:10000
2024-01-20 15:15:43 [x] Sent 'message1'
> message2:2000
2024-01-20 15:15:46 [x] Sent 'message2'
```

- 消费者

```log
2024-01-20 15:15:48 [x] Received 'message2'
2024-01-20 15:15:53 [x] Received 'message1'
```
我们发现，消息 2 先被消费者消费了，然后消息 1 被消费者消费了，这就是延迟消息的效果。

试想一下，如果生产者把消息 1 和消息 2 同时发送到了一个队列，但是此时，队列没有消费者，那么消息 1 和消息 2 都会被存储在队列中。如果后面有消费者消费这个队列，那么消息 1 和消息 2 谁先被消费呢？答案是，谁先到达队列头部，由于为消息 2 的延迟时间比消息 1 的延迟时间短，所以消息 2 先到达队列头部，也就会被先消费，然后消息 1 到达队列头部，然后再被消费者消费。

再来看另一个问题，我们将延迟消息发送到交换机中，交换机会立即把消息放入队列吗？答案是不会的，只有消息的延迟时间到了，才会把消息放入队列。我们可以通过 RabbitMQ 的 Web 管理界面来查看队列中的消息数量，如下：

消费者发送一条延迟消息，延迟时间为 20 s：

```log
> message:20000
2024-01-20 15:29:47 [x] Sent 'message'
```

队列中收到消息的时间：

![20240120153057](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/20240120153057.png)

显然，消息并没有立即进入队列，而是在 20 s 后才进入队列。这就与之前使用死信队列的区别。

## 小结

延迟消息可以使用死信队列（基于队列的 TTL 或者消息的 TTL）来实现，也可以使用插件来实现。那么，这两种方式有什么区别呢？看看下面这两张图：

- **基于死信队列**

![delay-queue-1](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/delay-queue-1.png)

- **基于插件**

![delay-queue-2](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/delay-queue-2.png)

最大的区别就是，死信是基于队列的，而插件是基于交换机的。基于队列的死信，消息会先进入队列，然后消息到达队列头时再被检测是否过期，如果过期了，那么就会被丢弃或者路由到死信队列。而基于插件的延迟消息，消息会先被发送到交换机，然后在交换机中等待一段时间后再发往队列。

延迟消息在需要延时处理的场景下非常有用，使用 RabbitMQ 来实现延迟消息可以很好的利用 RabbitMQ 的特性，如：消息可靠发送、消息可靠投递、死信队列来保障消息至少被消费一次以及未被正确处理的消息不会被丢弃。另外，通过 RabbitMQ 集群的特性，可以很好的解决单点故障问题，不会因为单个节点挂掉导致延迟消息不可用或者消息丢失。

当然，延迟消息还有很多其它选择，比如利用 Java 的 DelayQueue，利用 Redis 的 zset，利用 Quartz 或者利用 Kafka 的时间轮，这些方式各有特点，看需要适用的场景。
