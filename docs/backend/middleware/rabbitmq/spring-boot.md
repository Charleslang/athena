# Spring Boot

:::tip 参考
[Spring AMQP](https://spring.io/projects/spring-amqp/)  

[Spring Boot auto-configuration for Spring AMQP (RabbitMQ)](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.amqp)
:::

## 快速上手

- `pom.xml`

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

- `application.properties`

```properties
# addresses 等价于 host:port, 如果有多个地址，用逗号隔开
# spring.rabbitmq.host=localhost
# spring.rabbitmq.port=5672
# 指定了 addresses 时，host 和 port 会被忽略
spring.rabbitmq.addresses=localhost:5672
spring.rabbitmq.username=daijf
spring.rabbitmq.password=123456
spring.rabbitmq.virtual-host=/
```

- `RabbitMQProducer.java`

```java
@Service
public class RabbitMQProducer {

    @Resource
    private RabbitTemplate rabbitTemplate;

    public void send(String message) {
        rabbitTemplate.convertAndSend("boot.queue", message);
    }
}
```

- `RabbitMQConsumer.java`

```java
@Component
public class RabbitMQConsumer {

    @RabbitListener(queues = "boot.queue")
    public void receive(String message) {
        System.out.println("receive message: " + message);
    }
}
```

- `BasicController.java`

```java
@RestController
@RequestMapping("/basic")
public class BasicController {

    @Resource
    private RabbitMQProducer rabbitMQProducer;

    @GetMapping("/send/{message}")
    public String send(@PathVariable String message) {
        rabbitMQProducer.send(message);
        return "ok";
    }
}
```

:::warning
在启动应用之前，需要先在 RabbitMQ 中创建一个名为 `boot.queue` 的队列。
:::

## 创建交换机和队列

```java
@Configuration
public class RabbitConfig {

    private static final String TOPIC_EXCHANGE_NAME = "boot.topic.exchange";
    private static final String QUEUE_NAME = "boot.config.queue";

    @Bean
    public TopicExchange topicExchange() {
        // return new TopicExchange("boot.topic.exchange");
        // Map<String, Object> args = new HashMap<>();
        // args.put("x-delayed-type", ExchangeTypes.TOPIC);
        return ExchangeBuilder.topicExchange(TOPIC_EXCHANGE_NAME)
                .durable(true)
                // .withArguments(args)
                .build();
    }

    @Bean
    public Queue bootQueue() {
        // Queue 默认是持久化的，非独占的，非自动删除的
        // return new Queue("boot.queue");
        // 其实 expires、maxLength、ttl 等都可以通过 withArguments 方法设置
        // 队列名称在 durable 或者 nonDurable 中设置，如果不指定名称，则随机生成一个
        return QueueBuilder.nonDurable(QUEUE_NAME)
                .expires(10000)
                .maxLength(10)
                .ttl(10000)
                .build();
    }

    /**
     * 和下面的 bootBinding 方法等价
     */
//    @Bean
//    public Binding bootBinding() {
//        // new Binding("boot.queue", Binding.DestinationType.QUEUE, "boot.topic.exchange", "boot.#", null);
//        return BindingBuilder.bind(bootQueue()).to(topicExchange()).with("boot.#");
//    }

    @Bean
    public Binding bootBinding(Queue bootQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(bootQueue).to(topicExchange).with("boot.*");
    }
}
```

上面这种方式比较麻烦，如果一个交换机有多个队列绑定，就需要写多个 `@Bean` 方法，而且每个 `@Bean` 方法都需要传入 `Queue` 和 `Exchange` 对象，这样就会导致代码冗余。其实，我们可以使用注解的方式进行绑定。只需要稍微修改一下之前的 `RabbitMQConsumer` 类即可。

```java
@Component
public class RabbitMQConsumer {

    // 注解会创建队列、交换机、绑定关系
    // @RabbitListener 只能指定 queues、queuesToDeclare、bindings 中的一个，否则报错如下
    // @RabbitListener can have only one of 'queues', 'queuesToDeclare', or 'bindings'
    // 使用 bindings 时，消费的就是 bindings 中指定的队列
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "annotation.queue", durable = "false", autoDelete = "false", exclusive = "false", arguments = {
                    @Argument(name = "x-message-ttl", value = "10000", type = "java.lang.Integer")
            }),
            exchange = @Exchange(name = "annotation.exchange", type = ExchangeTypes.DIRECT, durable = "false", autoDelete = "false", internal = "false"),
            key = {"green", "blue", "orange"}
    ))
    public void receiveMessage(String message) {
        System.out.println("receive message: " + message);
    }
}
```

## 消息转换器

在之前，我们发送消息时，都是直接发送字符串，而接收消息时，也是直接接收字符串。但是，实际上，我们可以发送任意类型的消息。现在，我们修改一下代码，发送消息时，传递一个 Map。如下：

```java
@GetMapping("/send/object")
public String sendObject() {
    Map<String, Object> obj = new HashMap<>();
    obj.put("name", "daijunfeng");
    rabbitMQProducer.sendObject(obj);
    return "ok";
}
```

这时候，我们会发现，接收消息会报错。因为我们发送的是一个 Map，而接收的是一个字符串。所以，需要修改一下 `RabbitMQConsumer` 类，将接收的参数类型改为 `Map`。

```java
@RabbitListener(queues = "boot.queue")
public void receive(Map object) {
    System.out.println("receive message: " + object);
}
```

这样做确实是可以，但是，我们看看，队列中的消息是什么样的。如下：

![20240120215552](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/20240120215552.png)

我们发现，RabbitMQ 默认采用的是 JDK 的序列化，这样做会有一些问题。一是队列中的消息我们无法阅读，二是如果我们修改了对象的属性，那么之前的消息就无法反序列化了，三是 JDK 的序列化会导致消息体变大，占用更多的磁盘空间。

这里不再展开说了，去看看 `RabbitTemplate#convertAndSend` 方法就知道了。

简单说下吧，`RabbitTemplate`（该类中有一个 `messageConverter` 变量，该变量的 set 方法会在 `org.springframework.boot.autoconfigure.amqp.RabbitTemplateConfigurer#configure` 中被调用。`RabbitTemplateConfigurer` 请见 `org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration.RabbitTemplateConfiguration#rabbitTemplateConfigurer`）默认使用 `SimpleMessageConverter` 进行消息转换，而 `SimpleMessageConverter` 默认使用 JDK 的序列化。

如果我们想要修改消息转换器，只需要往 Spring 容器中注入一个 `org.springframework.amqp.support.converter.MessageConverter` 对象即可。如下：

```java
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitConfig {

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
```
:::warning

如果我们想要使用 `Jackson2JsonMessageConverter`，那么我们需要在 `pom.xml` 中引入 `jackson-databind` 依赖，否则会报错。

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

如果你使用了 `spring-boot-starter-web` 依赖，那么就不需要额外引入 `jackson-databind` 依赖了，因为 `spring-boot-starter-web` 中已经包含了 `jackson-databind`。
:::

现在，我们再次发送消息，看看队列中的消息是什么样的。如下：

![20240120221952](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-01-20/20240120221952.png)

但是，在接收消息时，还是不能直接用字符串，需要和发送消息时使用一样的类型接收。如下：

```java
@RabbitListener(queues = "boot.queue")
public void receive(Map object) {
    System.out.println("receive message: " + object);
}
```

:::tip 提示
一般情况下，我们可以在发送消息之前，手动将对象转换为 JSON 字符串。
:::

## 消费重试

:::tip 参考
[2.4. Receiving a Message](https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.amqp.receiving)
:::

为什么需要消费重试？我们在消费消息时，可能会出现异常。比如，需要调用一个接口，但是，该接口可能会出现异常，而我们又不想这条消息被丢弃，那么，我们就需要对该消息进行重试。

其实，Spring AMQP 中，已经为我们提供了消费重试的功能。我们只需要进行一些配置即可，将 `spring.rabbitmq.listener.simple.retry.enabled` 设置为 `true` 即可开启重试。

这里需要说明一下，`spring.rabbitmq.listener.simple.retry.enabled` 默认为 `false`，此时，如果我们在消费消息的过程中抛出了异常，那么 Spring 会将消息重新放回队列，然后该消息会被重新消费，但是重新消费又报错，然后消息又被重新放入队列，如此循环。这样会导致消息一直被重复消费（因此需要保证消息消费的幂等性），而且，如果该条消息一直被重复消费，那么可能就会导致队列中的消息越来越多，并且占用网络带宽。在这种情况下，我们可以将 `spring.rabbitmq.listener.simple.default-requeue-rejected` 设置为 false 来紧张消费失败时重新将消息放入队列。

针对上面提到的情况，当消费消息出现异常时，我们也可以开始消息消费重试。配置如下：

```properties
# 见 https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.amqp.receiving
# 消息消费重试，需要配合 spring.rabbitmq.listener.simple.acknowledge-mode=auto 使用（默认就是 auto）
# 启用消费重试
spring.rabbitmq.listener.simple.retry.enabled=true
# true-无状态重试，false-有状态重试（默认为 false）
spring.rabbitmq.listener.simple.retry.stateless=true
# 重试消息。和连接重试的参数意思一样，见 spring.rabbitmq.template.retry
spring.rabbitmq.listener.simple.retry.initial-interval=1000
spring.rabbitmq.listener.simple.retry.multiplier=1
spring.rabbitmq.listener.simple.retry.max-attempts=3
```
使用了如上配置后，如果消息在消费过程中抛出了异常，那么 Spring 的 AOP 会替我们重试消费消息。但是，如果尝试了 `max-attempts` 次后，还是消费失败，那么该消息就会被丢弃或者放入死信队列中。

上面提到了，开启重试机制后，如果达到了重试次数，那么消息还是可能会丢失（如果没有为其设置死信队列的话）。其实，这是 Spring AMQP 的默认行为。默认情况下，Spring AMQP 使用 `RejectAndDontRequeueRecoverer` 这种策略来处理重试达到限制后的消息。如果我们想要修改这种策略，那么可以自定义一个 `MessageRecoverer ` 对象，并将其注入到 Spring 容器中。如下：

```java
@Configuration
public class ConsumerErrorConfig {

    @Bean
    public DirectExchange errorExchange() {
        return ExchangeBuilder.directExchange("error.exchange").build();
    }

    @Bean
    public Queue errorQueue() {
        return QueueBuilder.nonDurable("error.queue").build();
    }

    @Bean
    public Binding errorBinding() {
        return BindingBuilder.bind(errorQueue()).to(errorExchange()).with("error");
    }

    @Bean
    public MessageRecoverer messageRecoverer(RabbitTemplate rabbitTemplate) {
        // 默认是 RejectAndDontRequeueRecoverer，即将消息丢弃或者放入死信队列
        // 消息达到重试次数后，会将消息重新入队
        return new ImmediateRequeueMessageRecoverer();
        // 消息达到重试次数后，会将消息发送到 error.exchange 交换机，routingKey 为 error
        // return new RepublishMessageRecoverer(rabbitTemplate, "error.exchange", "error");
    }
}
```

在上面，我们使用 `ImmediateRequeueMessageRecoverer` 来处理重试达到限制后的消息。这种策略会将消息重新入队，这与 `spring.rabbitmq.listener.simple.retry.enabled=false` 的情况大同小异。

## ack

```properties
# 自动 ack（消息一旦投递给消费者，就会从队列中删除，不管消费者是否成功消费）
# spring.rabbitmq.listener.simple.acknowledge-mode=none
# 手动 ack（需要自己手动调用 ack 方法，对代码有入侵。见 https://cloud.tencent.com/developer/article/2098202）
spring.rabbitmq.listener.simple.acknowledge-mode=manual
# 由 spring 来控制 ack 行为（默认就是 auto，推荐使用这种方式）
# SpringAMQP 利用 AOP 对我们的消息处理逻辑做了环绕增强，当业务正常执行时则自动返回 ack。当业务出现异常时，根据异常判断返回不同结果：
# - 如果是业务异常,会自动返回 nack
# - 如果是消息处理或校验异常，自动返回 reject
# spring.rabbitmq.listener.simple.acknowledge-mode=auto
```

```java
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQConsumer {

    @RabbitListener(queues = "boot.ack.queue")
    public void receiveAck(String object, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
        try {
            System.out.println("receive message: " + object);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                channel.basicAck(deliveryTag, false);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 配置

```properties
# 连接重试。阻塞式重试，也就是说，max-attempts 次重试内，会阻塞后面的代码，直到连接成功或者重试次数达到上限
# 每次连接的超时时间，超过这个时间还没有连上，则触发重连操作
spring.rabbitmq.connection-timeout=1s
# 开启重连
spring.rabbitmq.template.retry.enabled=true
# 上次连接失败后，隔多久触发重连操作
spring.rabbitmq.template.retry.initial-interval=1000
# 每次连接失败后，重连时间间隔的倍数
# 如果设置为 1，则表示每次重连的时间间隔都是 initial-interval
# 如果设置为 2，则表示第一次重连需要等待 initial-interval，第二次重连需要等待 2 * initial-interval，第三次重连需要等待 4 * initial-interval
spring.rabbitmq.template.retry.multiplier=1
# 最大连接次数（第一次连接和重试的总次数）
spring.rabbitmq.template.retry.max-attempts=3

# 自动 ack（消息一旦投递给消费者，就会从队列中删除，不管消费者是否成功消费）
# spring.rabbitmq.listener.simple.acknowledge-mode=none
# 手动 ack（需要自己手动调用 ack 方法，对代码有入侵。见 https://cloud.tencent.com/developer/article/2098202）
# spring.rabbitmq.listener.simple.acknowledge-mode=manual
# 由 spring 来控制 ack 行为（默认就是 auto，推荐使用这种方式）
# SpringAMQP 利用 AOP 对我们的消息处理逻辑做了环绕增强，当业务正常执行时则自动返回 ack。当业务出现异常时，根据异常判断返回不同结果：
# - 如果是业务异常,会自动返回 nack
# - 如果是消息处理或校验异常，自动返回 reject
# spring.rabbitmq.listener.simple.acknowledge-mode=auto

# prefetch-count
spring.rabbitmq.listener.simple.prefetch=1
# 消息消费失败后，是否重新放回队列（默认为 true），和 spring.rabbitmq.listener.simple.retry.enabled=false 配合使用
spring.rabbitmq.listener.simple.default-requeue-rejected=false

# 见 https://docs.spring.io/spring-boot/docs/current/reference/html/messaging.html#messaging.amqp.receiving
# 消息消费重试，需要配合 spring.rabbitmq.listener.simple.acknowledge-mode=auto 使用
# 默认情况下，如果消息处理失败，spring 会把消息重新放回队列，然后等待下次处理，这样可能会产生一个问题
# 如果消息一直处理失败，那么消息会一直被放回队列，然后再被重新被投递给消费者，然后又失败，然后又被放回队列，如此循环
spring.rabbitmq.listener.simple.retry.enabled=true
# true-无状态重试，false-有状态重试（默认为 false）
spring.rabbitmq.listener.simple.retry.stateless=true
# 重试消息。和连接重试的参数意思一样，见 spring.rabbitmq.template.retry
spring.rabbitmq.listener.simple.retry.initial-interval=1000
spring.rabbitmq.listener.simple.retry.multiplier=1
spring.rabbitmq.listener.simple.retry.max-attempts=3
```
