# 快速开始

:::tip 参考
[Get Started](https://www.rabbitmq.com/getstarted.html)
:::

1. **添加依赖**

```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.16.0</version>
</dependency>
```

2. **生产者**

```java
public class HelloWordProducer {

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
             * 参数 3：队列是否是独占队列
             *      3.1：该队列是否只能有 1 个消费者进行消费
             *      3.2：当 connection 关闭时，是否删除队列
             * 参数 4：队列是否自动删除（最后一个消费者断开连接以后，该队列是否自动删除）
             * 参数 5：队列的其他参数
             */
            channel.queueDeclare("queue.hello", false, false, false, null);

            /**
             * 发送消息
             */
            String message = "Hello World!";

            /**
             * 参数 1：交换机名称
             * 参数 2：routing key（暂时写为队列名称）
             * 参数 3：消息的其他属性
             * 参数 4：消息体
             */
            channel.basicPublish("", "queue.hello", null, message.getBytes());

            System.out.println(" [x] Sent '" + message + "'");
        }
    }
}
```

生产者程序启动后，可以在 RabbitMQ 的管理界面看到如下信息：

![20231030222112](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/20231030222112.png)

![20231030222455](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/20231030222455.png)


- **消费者**

```java
public class HelloWordConsumer {

    public static void main(String[] args) throws IOException, TimeoutException {
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

        /**
         * 声明队列（如果队列不存在，则自动创建）
         * 参数 1；队列名称
         * 参数 2：队列是否持久化
         * 参数 3：队列是否是独占队列
         *      3.1：该队列是否只能有 1 个消费者进行消费
         *      3.2：当 connection 关闭时，是否删除队列
         * 参数 4：队列是否自动删除（最后一个消费者断开连接以后，该队列是否自动删除）
         * 参数 5：队列的其他参数
         * 为什么消费者也要声明队列？见 https://www.rabbitmq.com/tutorials/tutorial-one-java.html
         * 因为如果消费者先启动，那么队列可能还不存在，此时消费者就会报错
         * Note that we declare the queue here, as well.
         * Because we might start the consumer before the publisher, we want to make sure the queue exists before we try to consume messages from it.
         */
        channel.queueDeclare("queue.hello", false, false, false, null);

        /**
         * 消费消息
         * 参数 1：队列名称
         * 参数 2：是否自动 ack
         * 参数 3：消费者收到消息的回调
         * 参数 4：消费者取消消费的回调
         */
        channel.basicConsume(
                "queue.hello",
                true,
                (consumerTag, delivery) -> {
                    String message = new String(delivery.getBody(), "UTF-8");
                    System.out.println(" [x] Received '" + message + "'");
                },
                consumerTag -> {

                }
        );

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        /**
         * 关闭资源（此处只是作为演示才关闭了连接）
         * 注意：消费者不需要关闭 channel 和 connection，不然消费者线程就结束了，无法一直消费队列中的消息
         * Why don't we use a try-with-resource statement to automatically close the channel and the connection? 
         * By doing so we would simply make the program move on, close everything, and exit! 
         * This would be awkward because we want the process to stay alive while the consumer is listening asynchronously for messages to arrive.
         */
        channel.close();
        connection.close();
    }
}
```
启动消费者，然后观察 RabbitMQ 的控制台，如下：

![20231030222828](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/20231030222828.png)


**此处可能遇到如下问题：**

1. 启动生产者或者消费者程序报错，连不上 MQ。这需要开放防火墙端口。
2. 连接 MQ 报错，错误信息如下：

```
connection error; protocol method: #method<connection.close>(reply-code=530, reply-text=NOT_ALLOWED - access to vhost '/' refused for user 'daijf', class-id=10, method-id=40)
```

意思是说用户 daijf 没有权限访问 / 这个 vhost，解决办法如下：

![20231030223432](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/20231030223432.png)

![20231030223511](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-30/20231030223511.png)
