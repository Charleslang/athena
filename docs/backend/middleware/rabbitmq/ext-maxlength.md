# Queue Length Limit

:::tip 参考
[Queue Length Limit](https://www.rabbitmq.com/maxlength.html)。
:::

您可以设置[队列](https://www.rabbitmq.com/queues.html)的最大长度。最大长度限制可以设置为消息数，或设置为字节数（所有消息正文长度的总和，忽略消息属性和任何开销），或两者兼而有之。

要设置最大长度（任一类型），您可以使用 [policy](https://www.rabbitmq.com/parameters.html#policies)（强烈建议使用此选项）或由客户端使用 [queue's optional arguments](https://www.rabbitmq.com/queues.html#optional-arguments) 来定义它。在使用者两种方式定义最大长度的场景中，使用指定的两个值中的最小值。

可以使用 [operator policies](https://www.rabbitmq.com/parameters.html#operator-policies) 配置队列长度。在所有情况下，都会使用处于就绪（ready）状态的消息数。[消费者未确认的消息](https://www.rabbitmq.com/confirms.html)不计入限制。

可以使用 `rabbitmqctl list_queues` 输出中的 `messages_ready` 和 `message_bytes_ready` 以及 MQ 管理界面和 HTTP API 响应中类似的字段来观察就绪消息的数量及其占用空间（以字节为单位）。

**Default Max Queue Length Limit Behaviour**

当设置了最大队列长度或大小并且达到最大值时，RabbitMQ 的默认行为是**从队列前端删除消息或将队列头部的消息视为死信消息**（即队列中最旧的消息）。要修改此行为，请使用下面提到的 `overflow` 参数。

**Queue Overflow Behaviour**

使用 `overflow` 来配置队列溢出行为。如果 `overflow` 设置为 `reject-publish` 或 `reject-publish-dlx`，则最近发布的消息将被丢弃。此外，如果启用了发布者确认，则将通过 `basic.nack` 向发布者返回拒绝信息。如果一条消息被路由到多个队列并被至少其中一个队列拒绝，则 channel 将通过 `basic.nack` 通知发布者。该消息仍将发布到可以将其排队的所有其它队列。`reject-publish` 和`reject-publish-dlx` 之间的区别在于 `reject-publish-dlx` 还会拒绝将消息消息发送到死信队列。

**Define Max Queue Length Using a Policy**

要使用 policy 指定最大长度，请将 `max-length`、`max-length-bytes` 添加到 policy 的定义中。例如：

|OS|Command|
|:--|:--|
|Linux|`rabbitmqctl set_policy my-pol "^one-meg$" '{"max-length-bytes":1048576}' --apply-to queues`|
|Windows|`rabbitmqctl.bat set_policy my-pol "^one-meg$" "{""max-length-bytes"":1048576}" --apply-to queues`|

my-pol 策略确保 one-meg 队列包含的消息数据不超过 1MiB。当达到 1MiB 限制时，最旧的消息将从队列头部被丢弃。

要定义溢出行为（是从头部删除消息还是拒绝新发布），请将设置 `overflow` 参数。例如：

|OS|Command|
|:--|:--|
|Linux|`rabbitmqctl set_policy my-pol "^two-messages$" '{"max-length":2,"overflow":"reject-publish"}' --apply-to queues`|
|Windows|`rabbitmqctl.bat set_policy my-pol "^two-messages$" "{""max-length"":2,""overflow"":""reject-publish""}" --apply-to queues`|

my-pol 策略确保 two-messages 队列包含不超过 2 条消息，并且只要队列包含 2 条消息并且启用了发布者确认，所有其他发布者都会收到 `basic.nack` 响应。

还可以使用管理插件定义策略，见 [policy documentation](https://www.rabbitmq.com/parameters.html#policies)。

**Define Max Queue Length Using x-arguments During Declaration**

可以通过 `x-max-length`（非负整数值）参数来设置队列的最大消息数。可以通过 `x-max-length-bytes`（非负整数值）来设置队列的最大长度（以字节为单位）。

如果两个参数都设置了，那么两者都适用；无论哪个限制先达到，都将被强制执行。

可以通过 `x-overflow` 来设置队列的溢出行为。可能的值为 `drop-head`（默认）、`reject-publish` 或 `reject-publish-dlx`。

这个 Java 示例声明了一个最大长度为 10 条消息的队列：

```java{2}
Map<String, Object> args = new HashMap<String, Object>();
args.put("x-max-length", 10);
channel.queueDeclare("myqueue", false, false, false, args);
```

**检查 Queue Length Limits**

要检查队列的有效限制，请检查 [optional arguments](https://www.rabbitmq.com/queues.html#optional-arguments) 和 [effective policy](https://www.rabbitmq.com/parameters.html#policies)。

这也可以使用 CLI 工具或 MQ 管理界面 来完成。

**Using CLI Tools**

`rabbitmqctl list_queues` 可用于显示 optional queue arguments 和应用于队列的 policy（如果有）：

```bash
rabbitmqctl list_queues name durable arguments policy --formatter=pretty_table --silent
# => ┌──────────────┬─────────┬──────────────────────────────────────────────────────────────────────┬─────────┐
# => │ name         │ durable │ arguments                                                            │ policy  │
# => ├──────────────┼─────────┼──────────────────────────────────────────────────────────────────────┼─────────┤
# => │ qq.1         │ true    │ {<<"x-queue-type">>,longstr,<<"quorum">>}{<<"x-max-length">>,long,7} │         │
# => ├──────────────┼─────────┼──────────────────────────────────────────────────────────────────────┼─────────┤
# => │ limited.qq.3 │ true    │ {<<"x-queue-type">>,longstr,<<"quorum">>}                            │ limited │
# => ├──────────────┼─────────┼──────────────────────────────────────────────────────────────────────┼─────────┤
# => │ limited.cq.1 │ true    │ {<<"x-queue-type">>,longstr,<<"classic">>}                           │ limited │
# => ├──────────────┼─────────┼──────────────────────────────────────────────────────────────────────┼─────────┤
# => │ qq.2         │ true    │ {<<"x-queue-type">>,longstr,<<"quorum">>}                            │         │
# => └──────────────┴─────────┴──────────────────────────────────────────────────────────────────────┴─────────┘
```

要找出 policy 定义了哪些参数，请使用 `rabbitmqctl list_policies`：

```bash
rabbitmqctl list_policies --formatter=pretty_table --silent
# => ┌───────┬─────────┬────────────┬──────────┬───────────────────┬──────────┐
# => │ vhost │ name    │ pattern    │ apply-to │ definition        │ priority │
# => ├───────┼─────────┼────────────┼──────────┼───────────────────┼──────────┤
# => │ /     │ limited │ ^limited\. │ queues   │ {"max-length":11} │ 0        │
# => └───────┴─────────┴────────────┴──────────┴───────────────────┴──────────┘
```

**Using the Management UI**

队列的可选队列参数和有效策略都可以在“Queues”选项卡或单个队列页面上看到：

![20240107213027](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-07/20240107213027.png)

policy 的名称是一个可单击的链接，可通往 policy 定义页面，您可以在其中查看限制：

![max_length_policy_definition](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-07/max_length_policy_definition.png)
