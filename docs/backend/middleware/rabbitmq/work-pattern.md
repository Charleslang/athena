# 工作模式

:::tip 参考
[RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
:::

## 简单模式

![simple](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/simple.png)

在 [快速开始](./get-started.html) 中使用的就是这种模式。

## Work Queues

![work-queues](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-31/work-queues.png)

Work Queues 即工作队列（又名：任务队列），主要思想是避免立即执行资源密集型任务并必须等待其完成。相反，我们期望任务稍后再执行。我们将任务封装为消息并将其发送到队列。在后台运行的工作进程将获取任务并执行它。当您运行许多工作进程时，任务将在它们之间共享。

这个概念在 Web 应用程序中特别有用。因为在 Web 应用程序中，不可能在较短的 HTTP 请求窗口内处理复杂的任务。

- 生产者

```java
public class WorkQueuesProducer {
    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            /**
             * 声明队列（如果队列不存在，则自动创建）
             * 参数 1；队列名称
             * 参数 2：队列是否持久化
             * 参数 3：队列是否是独占队列（该消息是否能被多个消费者进行消费（消息共享））
             * 参数 4：队列是否自动删除（最后一个消费者断开连接以后，该队列是否自动删除）
             * 参数 5：队列的其他参数
             */
            channel.queueDeclare("queue.hello", false, false, false, null);

            Scanner scanner = new Scanner(System.in);

            String message;
            System.out.print("> ");
            while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
                channel.basicPublish("", "queue.hello", null, message.getBytes());
                System.out.println(" [x] Sent '" + message + "'");
                System.out.print("> ");
            }

            System.out.println(" [x] Sent exit");
        }
    }
}
```

通过用户的输入，将消息发送到队列中。

- 消费者

```java
public class WorkQueuesConsumer {

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setPort(5672);
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.queueDeclare("queue.hello", false, false, false, null);

        channel.basicConsume(
                "queue.hello",
                true,
                (consumerTag, delivery) -> {
                    String message = new String(delivery.getBody(), "UTF-8");

                    System.out.println(" [x] Received '" + message + "'");

                    // 模拟耗时操作
                    for (char ch: message.toCharArray()) {
                        if (ch == '.') {
                            try {
                                Thread.sleep(1000);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    }

                    System.out.println(" [x] Done");
                },
                consumerTag -> {

                }
        );
    }
}
```

消费者从队列中获取消息，然后进行处理。这里通过 `.` 来模拟耗时操作，每个 `.` 代表 1 秒钟的耗时操作。

由于 Woker Queues 是多个消费者共享一个队列，所以我们需要启动多个消费者来模拟多个消费者共享一个队列的情况。在 IDEA 中，可以通过 `Edit Configurations` 来配置多个消费者，如下：

![20231031221204](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-31/20231031221204.png)

在启动多个消费者后，我们再来启动生产者，然后输入消息，可以看到消息被多个消费者共享消费。

怎么理解 "任务将在它们之间共享"？是多个消费者都要消费同一条消息吗？显然不是，这里的 "任务将在它们之间共享" 是指多个消费者共享一个队列。当有消息进入队列后，多个消费者都有机会队从列中获取到消息，但是这多个消费者彼此之间是竞争关系，对于同一条消息，只有一个消费者能消费到消息，其他消费者获取不到消息。我们把这里的消费者叫做 worker，每一个消费者就是一个 worker。

默认情况下，RabbitMQ 会将每条消息**按顺序**发送给下一个消费者。平均而言，每个消费者都会收到相同数量的消息。这种分发消息的方式称为轮询法。

在上面，我们使用消息中的 `.` 来代表任务的耗时操作，那么现在，我们来思考这样一个问题。如果一个 worker 比另一个 worker 执行任务的时间长，那么这个 worker 就会一直忙，而另一个 worker 一直处于空闲状态。这种情况下，RabbitMQ 会怎么分配消息呢？其实，在上面，我们已经提到了，RabbitMQ 会将每条消息**按顺序**发送给下一个消费者。下面，通过一个表格来说明这个问题（我们假设 RabbitMQ 先把消费分给 worker1，然后再分给 worker2）。

| 消息 | worker1 | worker2 |
| --- | :---: | :---: |
| message1 | :white_check_mark: |  |
| message2 |  | :white_check_mark: |
| message3. | :white_check_mark: |  |
| message4. |  | :white_check_mark: |
| message5.... | :white_check_mark: |  |
| message6 |  | :white_check_mark: |
| message7.... | :white_check_mark: |  |
| message8 |  | :white_check_mark: |
| message9.... | :white_check_mark: |  |
| message10 |  | :white_check_mark: |
| message11 | :white_check_mark: |  |

上面这张表格非常直观地说明了这个问题。 worker1 总共获得 6 条消息，worker2 总共获得 5 条消息。由于 RabbitMQ 默认采用轮询的方式分发消息，所以我们可以看到，worker1 一直在忙，而 worker2 则比较空闲状态。从上面，我们还可以知道，即使 worker1 非常忙，但它也不会拒绝接收消息，并且 RabbitMQ 也不会考虑 worker1 是否忙，而是会一直将消息轮询分发给 worker1、worker2。更多请见 [Fair dispatch](./messages.html#公平分发)。

:::tip 提示
默认情况下，哪个 worker 先启动，谁就会先获得消息。

在上面，我们提到了 RabbitMQ 会将每条消息**按顺序**发送给下一个消费者。如何理解这里的 "按顺序"？例如，worker1 每次处理消息的耗时都是 10 秒，而 worker2 只需要 1 秒，如果此时消息的到达顺序是 m1、m2、m3、m4，那么在 worker1 处理 m1 时，worker2 显然已经把 m2、m4 处理完了，而 m4 处理完成后的第 8 秒，worker1 才开始处理 m3。
:::

## Publish/Subscribe

在之前，我们使用了工作队列模式，工作队列背后的假设是每个任务都恰好交付给一个工作人员。在这一部分中，我们将做一些完全不同的事情——我们将向多个消费者传递消息。这种模式称为“发布/订阅”。

为了说明该模式，我们将构建一个简单的日志系统。它将由两个程序组成，第一个程序将发出日志消息，第二个程序将接收并打印它们。

在我们的日志系统中，接收程序中每个正在运行的消费者都会收到消息。这样我们就能够运行一个接收器并将日志定向到磁盘；同时我们将能够运行另一个接收器并在屏幕上查看日志。也就是说，如果我们有 2 个消费者正在运行，并且每条消息都会被传递给所有消费者。

本质上，发布的日志消息将广播给所有接收者。

请先看 [Exchanges](./exchanges.html) 、[Temporary queues](./queues.html#临时队列)、[Bindings](./bindings.html) 了解一些前置概念。详细信息请见 [Putting it all together](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)。

![python-three-overall](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-11/python-three-overall.png)

发出日志消息的生产者程序看起来与之前的教程没有太大不同。最重要的变化是我们现在想要将消息发布到我们的 `logs` 交换机而不是匿名交换机。发送时我们需要提供 `routingKey`，但对于 `fanout` 交换机来讲，`routingKey` 的值将被忽略。

```java
public class PublishSubscribeProducer {

    private static final String EXCHANGE_NAME = "logs";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");
        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
            /**
             * 声明交换机，交换机类型是 fanout
             */
            channel.exchangeDeclare(EXCHANGE_NAME, "fanout");

            Scanner scanner = new Scanner(System.in);

            String message;
            System.out.print("> ");
            while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
                channel.basicPublish(EXCHANGE_NAME, "", null, message.getBytes(StandardCharsets.UTF_8));
                System.out.println(" [x] Sent '" + message + "'");
                System.out.print("> ");
            }
        }
    }
}
```

如您所见，建立连接后我们声明了交换机。此步骤是必要的，因为禁止发布到不存在的交换机。

![20231211232256](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-11/20231211232256.png)

如果还没有队列绑定到交换器，消息将会丢失，但这对我们来说没关系；如果还没有消费者在监听，我们可以安全地丢弃该消息。

消费者代码如下：

```java
public class PublishSubscribeConsumer {

    private static final String EXCHANGE_NAME = "logs";

    public static void main(String[] argv) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.exchangeDeclare(EXCHANGE_NAME, "fanout");

        /**
         * 声明一个临时队列
         */
        String queueName = channel.queueDeclare().getQueue();
        channel.queueBind(queueName, EXCHANGE_NAME, "");

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        channel.basicConsume(queueName, true, (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] Received '" + message + "'");
        }, consumerTag -> {

        });
    }
}
```
启动多个消费者实例，如下：

![20231211231042](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-11/20231211231042.png)

当然，我们也可以使用 `rabbitmqctl` 命令来查看队列和交换机的绑定关系，如下：

```bash
rabbitmqctl list_bindings
```
输出结果：

```log
Listing bindings for vhost /...
source_name	source_kind	destination_name	destination_kind	routing_key	arguments
logs	exchange	amq.gen-J7rtzm0M_FxxAh_-kjDjsg	queue		[]
logs	exchange	amq.gen-obl1c409_6XwSsDRoLoQvA	queue		[]
```

要了解如何接收消息子集，请参考 [Routing](https://www.rabbitmq.com/tutorials/tutorial-four-java.html)。

## Routing

:::tip 参考
[Routing](https://www.rabbitmq.com/tutorials/tutorial-four-java.html)
:::

在 [Publish/Subscribe](#publish-subscribe)，我们构建了一个简单的日志系统。我们能够向许多接收者广播日志消息。

在本小节中，我们将向其添加一个功能，将使其能够仅订阅消息的子集。例如，我们将能够仅将关键错误消息定向到日志文件（以节省磁盘空间），同时仍然能够在控制台上打印所有日志消息。

**发出日志**

我们将把消息发送到 `direct` 交换机，而不是 `fanout` 交换机。我们将日志级别作为 `routing key`。这样接收程序将能够根据日志的级别选择它想要接收的日志。让我们首先关注发出日志。

与之前一样，我们需要首先创建一个交换：

```java
channel.exchangeDeclare(EXCHANGE_NAME, "direct");
```

我们准备发送一条消息：

```java
channel.basicPublish(EXCHANGE_NAME, level, null, message.getBytes());
```
为了简化，我们假设日志级别可以是 info、warn、error 之一。


**订阅消息**

接收消息的工作方式与之前类似，但有一个例外，我们将为我们感兴趣的每个日志级别创建一个与之对应的新的绑定。

```java
String queueName = channel.queueDeclare().getQueue();

for (String level : argv) {
    channel.queueBind(queueName, EXCHANGE_NAME, level);
}
```

**把它们放在一起**

![python-four](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-12/python-four.png)

- `DirectProducer.java`

```java
public class DirectProducer {

    private static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");
        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
            /**
             * 声明交换机，交换机类型是 direct
             */
            channel.exchangeDeclare(EXCHANGE_NAME, "direct");

            Scanner scanner = new Scanner(System.in);

            String message;
            System.out.print("> ");
            while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
                String[] logArray = message.split(":");
                String level = logArray[0], msg = logArray[1];
                channel.basicPublish(EXCHANGE_NAME, level, null, msg.getBytes(StandardCharsets.UTF_8));
                System.out.println(" [x] Sent '" + level + "':'" + msg + "'");
                System.out.print("> ");
            }
        }
    }
}
```

运行后，会发现创建了一个 `direct_logs` 交换机：

![20231212230605](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-12/20231212230605.png)

- `DirectConsumer.java`

```java
public class DirectConsumer {

    private static final String EXCHANGE_NAME = "direct_logs";

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("admin");
        factory.setPassword("123456");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.exchangeDeclare(EXCHANGE_NAME, "direct");

        /**
         * 声明一个临时队列, 该队列接收 3 种日志
         */
        String queueName = channel.queueDeclare().getQueue();
        String[] levels = {"info", "warn", "error"};
        for (String level : levels) {
            channel.queueBind(queueName, EXCHANGE_NAME, level);
        }

        channel.basicConsume(queueName, true, (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] " + queueName + " Received '" + delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        }, consumerTag -> {

        });

        /**
         * 为每种日志创建一个单独的临时队列
         */
        for (String level : levels) {
            String otherQueueName = channel.queueDeclare().getQueue();
            channel.queueBind(otherQueueName, EXCHANGE_NAME, level);
            channel.basicConsume(otherQueueName, true, (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                System.out.println(" [x] " + otherQueueName + " Received '" + delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
            }, consumerTag -> {

            });
        }
    }
}
```

运行后，会发现创建了 4 个临时队列：

![20231212230647](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-12/20231212230647.png)

然后，我们分别在控制台输入不同的日志，就可以看到不同的日志被不同的消费者消费：

- input

```bash
> info:response success!
 [x] Sent 'info':'response success!'
> warn:cast 200ms
 [x] Sent 'warn':'cast 200ms'
> error:request timeout
 [x] Sent 'error':'request timeout'
```

- output

```log
[x] amq.gen-yS3Y4zOBXxyOY7VJN8Y-WA Received 'info':'response success!'
[x] amq.gen-qEMYa-I7q37cUcIHIjGMpw Received 'info':'response success!'
[x] amq.gen-yS3Y4zOBXxyOY7VJN8Y-WA Received 'warn':'cast 200ms'
[x] amq.gen-5tbcEtf2hPn0G4wqTFbe9w Received 'warn':'cast 200ms'
[x] amq.gen-yS3Y4zOBXxyOY7VJN8Y-WA Received 'error':'request timeout'
[x] amq.gen-q9jppDnqjhxAVfUl9TCk_g Received 'error':'request timeout'
```

继续学习 [Topics](https://www.rabbitmq.com/tutorials/tutorial-five-java.html)，了解如何根据特定的模式接收消息。


## Topics

:::tip 参考
[Topics](https://www.rabbitmq.com/tutorials/tutorial-five-java.html)
:::

在 [Routing](#routing) 中，我们改进了日志系统，没有使用仅能够进行虚拟广播的 `fanout` 交换机，而是使用了 `direct` 交换机，并获得了选择性接收日志的可能性。

尽管使用 `direct` 交换机改进了我们的系统，但它仍然有局限性，它不能基于多个标准进行路由。

在我们的日志系统中，我们可能不仅希望根据日志级别订阅日志，还希望根据发出日志的源订阅日志。我们可能想监听来自 "cron" 的关键错误，同时也想监听来自 "kern" 的所有日志。

为了在我们的日志系统中实现这一点，我们需要了解更复杂的 `topic` 交换机。

我们将在日志系统中使用 `topic` 交换机。我们首先假设日志的 routing key 有两个单词：`<facility>.<severity>`。

- `TopicProducer.java`

```java
public class TopicProducer {

    private static final String EXCHANGE_NAME = "topic_logs";

    public static void main(String[] args) throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("162.14.97.45");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("daijf");
        factory.setPassword("dyftm71017");
        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
            /**
             * 声明交换机，交换机类型是 topic
             */
            channel.exchangeDeclare(EXCHANGE_NAME, "topic");

            Scanner scanner = new Scanner(System.in);

            String message;
            System.out.print("> ");
            while (!(message = scanner.nextLine()).equalsIgnoreCase("q")) {
                String[] logArray = message.split(":");
                String routingKey = logArray[0], msg = logArray[1];
                channel.basicPublish(EXCHANGE_NAME, routingKey, null, msg.getBytes(StandardCharsets.UTF_8));
                System.out.println(" [x] Sent '" + routingKey + "':'" + msg + "'");
                System.out.print("> ");
            }
        }
    }
}
```

启动生产者程序后，会发现创建了一个 `topic_logs` 交换机：

![20231213220416](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-13/20231213220416.png)

- `TopicConsumer.java`

```java
public class TopicConsumer {

    private static final String EXCHANGE_NAME = "topic_logs";

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("162.14.97.45");
        // 端口默认是 5672
        factory.setPort(5672);
        // vhost 默认是 /
        factory.setVirtualHost("/");
        factory.setUsername("daijf");
        factory.setPassword("dyftm71017");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        channel.exchangeDeclare(EXCHANGE_NAME, "topic");

        /**
         * 声明一个临时队列, 该队列接收 3 种日志
         */
        String queueName = channel.queueDeclare().getQueue();
        String[] routingKeyArray = {"#", "kern.*", "kcr", "*.critical", "kern.critical"};
        for (String routingKey : routingKeyArray) {
            channel.queueBind(queueName, EXCHANGE_NAME, routingKey);
        }

        channel.basicConsume(queueName, true, (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] " + queueName + " Received '" + delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
        }, consumerTag -> {

        });

        /**
         * 为每种日志创建一个单独的临时队列
         */
        for (String routingKey : routingKeyArray) {
            String otherQueueName = channel.queueDeclare().getQueue();
            channel.queueBind(otherQueueName, EXCHANGE_NAME, routingKey);

            channel.basicConsume(otherQueueName, true, (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
                System.out.println(" [x] " + otherQueueName + " Received '" + delivery.getEnvelope().getRoutingKey() + "':'" + message + "'");
            }, consumerTag -> {

            });
        }
    }
}
```

启动消费者程序后，会发现创建了 6 个临时队列：

![20231213220506](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-13/20231213220506.png)

并且，我们可以看到每个临时队列都绑定了不同的 routingKey：

![20231213220621](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-13/20231213220621.png)

然后，我们分别在控制台输入不同的日志，就可以看到不同的日志被不同的消费者消费：

- input

```bash
> #:message with routing key '#'
 [x] Sent '#':'message with routing key '#''
> *:message with routing key '*'
 [x] Sent '*':'message with routing key '*''
> kcr:message with routing key 'kcr'
 [x] Sent 'kcr':'message with routing key 'kcr''
> kern.critical:message with routing key 'kern.critical'
 [x] Sent 'kern.critical':'message with routing key 'kern.critical''
```

- output

```log
[x] amq.gen-jDz7u2PrUxbe6jsuLSPU4g Received '#':'message with routing key '#''
[x] amq.gen-5sb1Z7eXTODrERV7K9kjAg Received '#':'message with routing key '#''
[x] amq.gen-jDz7u2PrUxbe6jsuLSPU4g Received '*':'message with routing key '*''
[x] amq.gen-5sb1Z7eXTODrERV7K9kjAg Received '*':'message with routing key '*''
[x] amq.gen-piaP4Z4XDvOh4Z6D2X1t1w Received 'kcr':'message with routing key 'kcr''
[x] amq.gen-jDz7u2PrUxbe6jsuLSPU4g Received 'kcr':'message with routing key 'kcr''
[x] amq.gen-5sb1Z7eXTODrERV7K9kjAg Received 'kcr':'message with routing key 'kcr''
[x] amq.gen-jDz7u2PrUxbe6jsuLSPU4g Received 'kern.critical':'message with routing key 'kern.critical''
[x] amq.gen-gYaWZAjf5TwZcsqgIAtIqg Received 'kern.critical':'message with routing key 'kern.critical''
[x] amq.gen-RohW3HO5afs7pI6f29dtHQ Received 'kern.critical':'message with routing key 'kern.critical''
[x] amq.gen-5sb1Z7eXTODrERV7K9kjAg Received 'kern.critical':'message with routing key 'kern.critical''
[x] amq.gen-1AjAQMSBpLQ5Vwv0W_9qng Received 'kern.critical':'message with routing key 'kern.critical''
```

如果感兴趣，也可以在 [Remote procedure call (RPC)](https://www.rabbitmq.com/tutorials/tutorial-six-java.html) 中了解如何将往返消息作为远程过程调用进行处理。
