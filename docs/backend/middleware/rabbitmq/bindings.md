# Bindings

:::tip 参考
[Bindings](https://www.rabbitmq.com/tutorials/tutorial-three-java.html)
:::

![bindings](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-12-11/bindings.png)

在 [Publish/Subscribe](./work-pattern.html#publish-subscribe) 中，我们已经创建了 `fanout` 交换机和队列。现在我们需要告诉交换机将消息发送到我们的队列。交换机和队列之间的关系称为绑定（Bindings）。

```java
channel.queueBind(queueName, "logs", "");
```

从现在开始，`logs` 交换机会将消息加到我们的队列中。

:::tip 提示

想要查看 RabbitMQ 中的绑定，可以使用如下命令：

```bash
sudo rabbitmqctl list_bindings
```
:::

在 [Publish/Subscribe](./work-pattern.html#publish-subscribe) 中，我们已经创建了绑定。您可能还记得这样的代码：

```java
channel.queueBind(queueName, EXCHANGE_NAME, "");
```

绑定是交换机和队列之间的关系。这可以简单地理解为：队列对来自此交换机的消息感兴趣。

绑定可以采用额外的 `routingKey` 参数。为了避免与 `basic_publish` 参数混淆，我们将其称为 `binding key`。下面是我们如何创建带有键的绑定：

```java
channel.queueBind(queueName, EXCHANGE_NAME, "black");
```

`binding key` 的含义取决于交换机类型。我们之前使用的 `fanout` 交换机完全忽略了 `binding key`。

:::warning 注意
请先查看 [Topics](./exchanges.html#topic)。

你可能已经注意到了，在本节中，我们提到了 binding key 和 routing key，其实早在 [交换机](./exchanges.html#direct) 一节中，我们提就到了 routing key 和 routing key，当时我们的解释是 "它们是同一个概念，只是在不同的上下文中使用不同的名称。"，现在我们可以给出更加准确的解释了。

从本质上来讲，binding key 和 routing key 确实是同一个概念，并且 RabbitMQ 的 API 中也只有 routingKey 这个参数，并没有出现 bindingKey。

binding key 是针对消费者来讲的，我们都知道，消费者最终其实是监听的队列，而队列是和交换机进行绑定的，binding key 就是用来标识队列和交换机之间的绑定关系的。我们在 RabbitMQ 后台管理界面看到的其实就是这个 binding key。

routing key 是针对生产者来讲的，生产者在发送消息的时候，需要指定 routing key，以便 RabbitMQ 根据这个 routing key 将消息路由到指定的队列中。例如，发送消息时，如果指定的 routingKey 是 `*.kern`，那么这里的 `*` 不再具有通配符的含义，而是一个具体的 "单词"，就类似于 `auth.kern`，`cron.kern` 等。如果这时，消费者定义了一个 bindingKey 为 `*.kern`，那么这个消费者将会接收到 routingKey 为 `*.kern` 的消息，因为此处的 `*` 是通配符，可以匹配任意的单词（此时通配符 `*` 匹配了单词 "*"）。

简而言之，topic 交换机中的通配符只在消费者的 bindingKey 中使用，而不是在生产者的 routingKey 中使用，生产者的 routingKey 不具有通配符的含义。
:::