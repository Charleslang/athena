# TTL

:::tip 参考
[Time-To-Live and Expiration](https://www.rabbitmq.com/ttl.html)
:::

使用 RabbitMQ，您可以为消息和队列设置 TTL（生存时间）（可以使用 argument 或者 policy 设置 TTL）。顾名思义，TTL 指定消息和队列“存活”的时间段。

消息的 TTL 决定消息可以在队列中保留多长时间。如果队列中消息的保留时间超过了队列的消息的 TTL，则该消息将过期并被丢弃（如果队列设置了死信队列，则会被发送到死信队列）。

“丢弃”意味着该消息不会被传递给任何订阅的消费者，并且无法通过直接应用于队列的 `basic.get` 方法来访问。消息 TTL 可以应用于单个队列、一组队列或为每条消息单独设置。

TTL 还可以在队列上设置。此功能可以与带有 `auto-delete` 属性的队列一起使用。在队列上设置 TTL（过期）通常仅对瞬态（非持久）队列有意义。流不支持过期。

队列只有在不使用的时候才会在一段时间后过期（队列如果有消费者，那么该队列还将被使用）。队列的 TTL 与队列中的消息 TTL 不同。队列的 TTL 指定了在没有消费者使用的情况下，队列可以保留多长时间。

过期的消息和队列将被删除。

TTL 行为由可 [optional queue arguments](https://www.rabbitmq.com/queues.html) 控制，但配置它的最佳方法是使用 [policy](https://www.rabbitmq.com/parameters.html)。

TTL 也可以通过设置 [operator policies](https://www.rabbitmq.com/parameters.html#operator-policies) 强制执行。

被节将介绍如何定义队列中消息的 TTL、发布者中的每条消息 TTL、注意事项以及如何定义队列 TTL。

**Per-Queue Message TTL in Queues**

可以通过使用 [policy](https://www.rabbitmq.com/parameters.html#policies) 设置 `message-ttl` 参数或在队列声明时指定相同的参数来为给定队列设置消息 TTL。

如果消息在队列中的时间超过了配置的 TTL，则该消息被认为已死亡。请注意，路由到多个队列的消息可能在其所在的每个队列中的不同时间消亡，或者根本不消亡。一个队列中消息的死亡不会影响其它队列中同一消息的生命周期。

服务器保证已经 "死掉" 的消息不会使用 `basic.deliver` （给消费者）传递或包含在 `basic.get-ok` 响应中（对于一次性获取操作）。此外，服务器将尝试在消息的 TTL 到期时或不久后删除消息。

TTL 参数或 policy 的值必须是非负整数 (0 <= n)（以毫秒为单位）。因此，值 1000 意味着添加到队列中的消息将在队列中保留 1 秒或直到它被传递给消费者。参数可以是 AMQP 0-9-1 类型 short-short-int、short-int、long-int 或 long-long-int。

**Define Message TTL for Queues Using a Policy**

要使用 policy 指定 TTL，请将 `message-ttl` 添加到 policy 的定义中：

|OS|Command|
|:--|:--|
|Linux|`rabbitmqctl set_policy TTL ".*" '{"message-ttl":60000}' --apply-to queues`|
|Windows|`rabbitmqctl set_policy TTL ".*" "{""message-ttl"":60000}" --apply-to queues`|

这会将 60 秒的 TTL 应用于所有队列。

**Define Message TTL for Queues Using x-arguments During Declaration**

下面的示例创建一个队列，消息最多可以在其中驻留 60 秒：

```java{2}
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-message-ttl", 60000);
channel.queueDeclare("myqueue", false, false, false, args);
```
可以将消息 TTL 策略应用于其中已有消息的队列，但这涉及一些[注意事项](https://www.rabbitmq.com/ttl.html#per-message-ttl-caveats)。

如果消息被重新排队（例如由于使用具有重新排队参数的 AMQP 方法，或者由于通道关闭），则消息的原始到期时间将被保留。

将 TTL 设置为 0 会导致消息在到达队列时过期，除非它们可以立即传递给消费者。因此，这提供了立即发布 `immediate` 标志的替代方案，而 RabbitMQ 服务器不支持该标志。与该标志不同，不会发出 `basic.returns`，并且如果设置了死信交换机，则消息将是死信的。

**Per-Message TTL in Publishers**

可以通过在发布消息时设置 [`expiration`](https://www.rabbitmq.com/publishers.html#message-properties) 属性来为每条消息指定 TTL。

`expiration` 字段以毫秒为单位。适用与 `x-message-ttl` 相同的约束。由于 `expiration` 字段必须是字符串，因此 broker 将（仅）接受数字的字符串表示形式。

当同时指定每个队列和每个消息的 TTL 时，将选择两者之间的较低值。

```java
byte[] messageBodyBytes = "Hello, world!".getBytes();
AMQP.BasicProperties properties = new AMQP.BasicProperties.Builder()
                                   .expiration("60000")
                                   .build();
channel.basicPublish("my-exchange", "routing-key", properties, messageBodyBytes);
```

**注意事项**

为每条消息配置了 TTL 的队列（当它们已经有消息时）将在发生特定事件时丢弃消息。只有当过期的消息到达**队列的头部**时，它们才会真正被丢弃（或死信）。消费者不会收到过期的消息。请记住，消息过期和消费者交付之间可能存在自然竞争条件，例如消息在写入套接字之后但在到达消费者之前可能会过期。

当追溯应用每条消息的 TTL 策略时，建议让消费者在线以确保更快地丢弃消息。

由于可以为队列上每消息设置 TTL，当需要删除消息以释放资源时，应该用队列的 TTL（Queue TTL），而不是为每条消息单独设置 TTL（或直接清除队列或删除队列）。

**Queue TTL**

TTL 还可以在队列上设置。此功能可以与带有 [auto-delete](https://www.rabbitmq.com/queues.html) 属性的队列一起使用。

在队列上设置 TTL（过期）通常仅对瞬态（非持久）队列有意义。流不支持过期。

队列只有在不使用的时候才会在一段时间后过期（队列如果有消费者，那么该队列还将被使用）。队列的 TTL 与队列中的消息 TTL 不同。队列的 TTL 指定了在没有消费者使用的情况下，队列可以保留多长时间。

可以通过将 `x-expires` 参数设置为 `queue.declare` 或设置 `expires` [policy](https://www.rabbitmq.com/parameters.html#policies) 来设置给定队列的过期时间。这控制队列在被自动删除之前可以不使用的时间。未使用意味着队列没有消费者，队列最近没有被重新声明（重新声明会更新队列的设置），并且 `basic.get` 在至少过期期限内没有被调用。例如，这可以用于 RPC 样式的回复队列，其中可以创建许多可能永远不会被耗尽的队列。

服务器保证，如果至少在到期期限内未使用该队列，则该队列将被删除。不保证过期期限过后队列将如何及时删除。

`x-expires` 参数或 expires 策略的值以毫秒为单位。**它必须是正整数（与消息的 TTL 不同，它不能为 0）**。因此，值 1000 意味着 1 秒内未使用的队列将被删除。

**Define Queue TTL for Queues Using a Policy**

以下策略使所有队列自上次使用后 30 分钟后过期：

|OS|Command|
|:--|:--|
|Linux|`rabbitmqctl set_policy expiry ".*" '{"expires":1800000}' --apply-to queues`|
|Windows|`rabbitmqctl.bat set_policy expiry ".*" "{""expires"":1800000}" --apply-to queues`|

**Define Queue TTL for Queues Using x-arguments During Declaration**

这个 Java 示例创建了一个队列，该队列在 30 分钟未使用后过期。

```java{2}
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-expires", 1800000);
channel.queueDeclare("myqueue", false, false, false, args);
```
