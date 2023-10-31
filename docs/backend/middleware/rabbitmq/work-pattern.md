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

上面这张表格非常直观地说明了这个问题。 worker1 总共获得 6 条消息，worker2 总共获得 5 条消息。由于 RabbitMQ 默认采用轮询的方式分发消息，所以我们可以看到，worker1 一直在忙，而 worker2 则比较空闲状态。从上面，我们还可以知道，即使 worker1 非常忙，但它也不会拒绝接收消息，并且 RabbitMQ 也不会考虑 worker1 是否忙，而是会一直将消息轮询分发给 worker1、worker2。

:::tip 提示
默认情况下，哪个 worker 先启动，谁就会先获得消息。
:::
