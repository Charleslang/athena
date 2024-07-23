# Java 客户端

:::tip 参考
[Get started using Redis clients](https://redis.io/docs/clients/)  
[Clients](https://redis.io/resources/clients/#java)
:::

在实际开发过程中，我们肯定是使用 Java 代码操作 Redis。Redis 官方提供了两个 Java 客户端，一个是 Jedis，另一个是 Lettuce。下面我们来看看这两个客户端的使用。

![20230524211335](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524211335.png)

![20230524211416](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524211416.png)

## Jedis

:::tip 提示
[GitHub 地址](https://github.com/redis/jedis)
:::

Jedis 是 Redis 官方推荐的 Java 客户端之一，Jedis 是一个很小的、易于使用的 Java 库，它提供了比较全面的 Redis 命令的支持。Jedis 将所有 Redis 命令都封装成了 Java 方法，并且 Java 方法的命名与 Redis 命令的名称一一对应，比如 Redis 的 `set` 命令对应 Jedis 中的 `set` 方法，Redis 的 `get` 命令对应 Jedis 中的 `get` 方法。但是呢，Jedis 在实现上是直连 Redis Server，多线程环境下非线程安全，如果想在多线程环境下使用 Jedis，需要为每个线程都分配独立的 Jedis 实例，这时我们可以使用 JedisPool 来满足多线程环境下的需求。

下面列举一些简单的示例来说明 Jedis 的使用。

**添加依赖**

```xml
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>4.3.0</version>
</dependency>
```

Jedis 版本和 Redis 版本的对应关系如下（可在 Jedis 的 GitHub 中找到对应关系）：
Library version|Supported redis versions
---|---
3.9+|5.0 and 6.2 Family of releases
\>= 4.0|Version 5.0 to current（7.x）

- **示例 1**

```java
public class JedisTest {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 6379;
    private static final String PASSWORD = "123456";

    private static void test1() {
        Jedis jedis = new Jedis(HOST, PORT);
        jedis.auth(PASSWORD);
        jedis.set("user:1", "zs");
        System.out.println(jedis.get("user:1"));
        jedis.close();
    }
    public static void main(String[] args) {
        test1();
    }
}
```

- **示例 2**

```java
public class JedisTest {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 6379;
    private static final String PASSWORD = "123456";

    private static void test2() {
        JedisPool pool = new JedisPool(HOST, PORT);
        try (Jedis jedis = pool.getResource()) {
            // 设置密码
            jedis.auth(PASSWORD);
            // 默认就是 0 号库
            jedis.select(0);
            jedis.set("user:2", "ls");
            System.out.println(jedis.get("user:2"));
        }
    }

    public static void main(String[] args) {
        test2();
    }
}
```

- **示例 3**

```java
public class JedisTest {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 6379;
    private static final String PASSWORD = "123456";

    private static void test3() {
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxIdle(8);
        config.setMinIdle(8);
        config.setMaxTotal(100);
        config.setMaxWait(Duration.ofMillis(200L));

        // 有密码的连接
        JedisPool pool = new JedisPool(config, HOST, PORT, 10000, PASSWORD);

        try (Jedis jedis = pool.getResource()) {
            jedis.set("user:3", "ww");
            System.out.println(jedis.get("user:3"));
        }
    }

    public static void main(String[] args) {
        test3();
    }
}
```

- **示例 4**

```java
public class JedisConnectionFactory {

    private static final JedisPool jedisPool;

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 6379;
    private static final String PASSWORD = "123456";

    static {
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxIdle(8);
        config.setMinIdle(8);
        config.setMaxTotal(100);
        config.setMaxWait(Duration.ofMillis(200L));

        // 有密码的连接
        jedisPool = new JedisPool(config, HOST, PORT, 10000, PASSWORD);
    }

    public static Jedis getJedisInstance() {
        return jedisPool.getResource();
    }

    public static void close(Jedis jedis) {
        // 此处使用 jedis.close() 也可以。因为 Jedis 的 close 方法会做判断, 如果是从连接池中获取的连接, 则会调用 jedisPool.returnResource 方法
        jedisPool.returnResource(jedis);
    }
}
```
```java
public class JedisTest {

    private static void test4() {
        Jedis jedis = JedisConnectionFactory.getJedisInstance();

        try {
            jedis.hset("user:5", "name", "王五");
            System.out.println(jedis.hget("user:5", "name"));
        } finally {
            JedisConnectionFactory.close(jedis);
        }
    }

    public static void main(String[] args) {
        test4();
    }
}
```

## Spring Data Redis

:::tip 参考
[Spring Data Redis](https://spring.io/projects/spring-data-redis)
:::

Spring Data Redis 是 Spring Data 家族的一部分，它提供了简单的配置从 Spring 应用程序访问 Redis，提供了与存储交互的低级和高级抽象。

Spring Data Redis 同时支持 Jedis 和 Lettuce，在 Spring Boot 2.0 之后，Spring Data Redis 默认使用 Lettuce 作为客户端。但是呢，如果我们想要在 Spring Boot 2.0 之后使用 Jedis 也是可以的，只需要在 pom.xml 中排除 Lettuce 依赖，然后添加 Jedis 依赖即可。

Lettuce 和 Jedis 各有千秋，Lettuce 是基于 Netty 的，而 Jedis 是基于阻塞 I/O 的。Lettuce 的连接是基于 Netty 的，连接实例可以在多个线程间共享，所以，**一个连接实例在多个线程间是安全的**，当多线程使用同一连接实例时，是线程安全的。而 Jedis 的连接则不能共享，**每个线程都要有一个独立的 Jedis 连接实例**，这个时候，JedisPool 就出现了，可以解决线程不安全的问题。

**添加依赖**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!-- 如果使用 Lettuce, 则需要额外引入 commons-pool2 -->
<!-- 否则报错 nested exception is java.lang.NoClassDefFoundError: org/apache/commons/pool2/impl/GenericObjectPoolConfig -->
<dependency>
  <groupId>org.apache.commons</groupId>
  <artifactId>commons-pool2</artifactId>
  <version>2.11.1</version>
</dependency>

<!-- 下面展示了如何在 Spring Boot2.x 中使用 Jedis -->
<!-- 1. 排除 Lettuce -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
  <exclusions>
    <exclusion>
      <groupId>io.lettuce</groupId>
      <artifactId>lettuce-core</artifactId>
    </exclusion>
  </exclusions>
</dependency>
<!-- 2. 添加 Jedis 依赖 -->
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>4.3.0</version>
</dependency>
```
**配置文件 `application.properties`**

```properties
spring.redis.host=127.0.0.1
spring.redis.port=6379
spring.redis.password=123456
spring.redis.database=0

spring.redis.lettuce.pool.enabled=true
spring.redis.lettuce.pool.max-active=8
spring.redis.lettuce.pool.max-idle=8
spring.redis.lettuce.pool.max-wait=100
spring.redis.lettuce.pool.min-idle=8

#spring.redis.jedis.pool.enabled=true
#spring.redis.jedis.pool.max-active=8
#spring.redis.jedis.pool.max-idle=8
#spring.redis.jedis.pool.max-wait=100
#spring.redis.jedis.pool.min-idle=8
```
- **示例 1**

```java
@SpringBootTest
class RedisSpringbootApplicationTests {

    @Resource
    private RedisTemplate redisTemplate;

    @Test
    void test1() {
        ValueOperations ops = redisTemplate.opsForValue();
        ops.set("name:1", "zs");
        ops.set("name:2", "代俊峰");
        System.out.println(ops.get("name:1"));
        System.out.println(ops.get("name:2"));
    }
}
```

在这个例子中，我们使用 `set` 方法往 Redis 中设置了两个值，不出意外，程序执行成功，并且我们的控制台也会输出正确的值 `zs`、`代俊峰`。好了，让我们使用 redis-cli 进入 Redis 查看一下，看看 Redis 中是否真的有这两个值。

```sh
127.0.0.1:6379> get name:1
(nil)

127.0.0.1:6379> get name:2
(nil)
```
我们会发现，使用 redis-cli 无法从 Redis 中获取到这两个值，这是为什么呢？别急，我们再使用 `keys *` 看看。

```sh
127.0.0.1:6379> keys *
1) "\xac\xed\x00\x05t\x00\x06name:1"
2) "\xac\xed\x00\x05t\x00\x06name:2"
```
哈哈，是不是看着有点熟悉了，有点像我们刚才设置的值。那我们再通过 redis-cli 获取一下这两个值。

```sh
127.0.0.1:6379> mget "\xac\xed\x00\x05t\x00\x06name:1" "\xac\xed\x00\x05t\x00\x06name:2"
1) "\xac\xed\x00\x05t\x00\x02zs"
2) "\xac\xed\x00\x05t\x00\t\xe4\xbb\xa3\xe4\xbf\x8a\xe5\xb3\xb0"
```
好吧，我完全看不懂这是什么东西。如果 value 是英文的，我还能猜出来，但是中文就完全不知道了。让我们再用 Redis 的图形化客户端 RedisInsight 来看看。

![20230524223515](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524223515.png)

![20230524223537](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524223537.png)

好吧，那确实是我们刚才设置的两个值，但是为什么在 Redis 中会这样存储呢？这是因为，我们使用的是 Redis 自带的 `RedisTemplate`，而我们没有配置 Redis 的序列化方式，所以，Redis 默认使用的是 `JdkSerializationRedisSerializer`，它会将数据序列化成二进制数据。因此，我们使用 redis-cli 是无法通过 `get name:1` 获取到数据的。那么，该如何解决这个问题呢？我们可以使用 `StringRedisTemplate` 来解决这个问题，也可以自定义 Redis 的序列化方式来解决这个问题。

**自定义 Redis 的序列化方式**

- `RedisConfig.java`

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        RedisSerializer<String> stringRedisSerializer = RedisSerializer.string();
        // 需要引入 jackson 的依赖
        // <dependency>
        //     <groupId>com.fasterxml.jackson.core</groupId>
        //     <artifactId>jackson-databind</artifactId>
        // </dependency>
        // 如果你引入了 spring mvc 的依赖, 则不需要引入 jackson 的依赖, 因为 spring mvc 依赖中已经包含了 jackson 的依赖
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();

        // string 和 hash 的 key 都采用 string 的序列化方式
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        // string 和 hash 的 value 都采用 jackson 的序列化方式
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);

        return redisTemplate;
    }
}
```
- `RedisSpringbootApplicationTests.java`

```java
@SpringBootTest
class RedisSpringbootApplicationTests {

    // 使用我们自定义的 RedisTemplate
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Test
    void test2() {
        ValueOperations ops = redisTemplate.opsForValue();
        ops.set("name:3", "ls");
        ops.set("name:4", "李四");
        System.out.println(ops.get("name:3"));
        System.out.println(ops.get("name:4"));
    }
}
```

好了，在这个例子中，我们使用了自定义的 `RedisTemplate`，并且设置了序列化方式，我们再来看看 Redis 中的数据。

```sh
127.0.0.1:6379> mget name:3 name:4
1) "\"ls\""
2) "\"\xe6\x9d\x8e\xe5\x9b\x9b\""
```
可以看到，我们设置的 key 已经是正常的了，能够通过 redis-cli 获取到数据。但是呢，还存在两个问题：value 带了双引号、中文还是乱码。这是为什么呢？这是由于 Redis 的显示问题导致的，Redis 命令行客户端会对结果进行格式化显示。我们可以在进入 Redis 时，使用 `redis-cli --raw`，这样，我们再获取数据时，就不会对结果进行格式化显示了。

```sh
[root@djfcentos1 redis]# redis-cli --raw
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> mget name:3 name:4
"ls"
"李四"
```
在 RedisInsight 中，我们也可以看到 key 和 value 都是正常的。

![20230524225005](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524225005.png)

:::tip 提示
在使用 RedisTemplate 时，我们尽量不要使用 JDK 的序列化方式，一是不方便查看数据，二是 JDK 的序列化方式效率低下，占用内存高。为什么说占用内存高呢？下面两张图告诉你答案。

![20230524225256](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524225256.png)

![20230524225411](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524225411.png)
:::

- **示例 2**

- `User.java`

```java
/**
 * 必须实现 Serializable 接口才能序列化
 */
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;
    private String name;

    // 反序列化时需要无参构造函数
    public User() {
    }

    public User(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```

- `RedisSpringbootApplicationTests.java`

```java
@SpringBootTest
class RedisSpringbootApplicationTests {

    // 使用自定义的 RedisTemplate
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Test
    void test3() {
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        User user = new User(1, "赵六");
        ops.set("user:1", user);
        // 可以直接强转，因为底层会自动帮我们进行反序列化操作
        User resultUser = (User) ops.get("user:1");
        System.out.println(resultUser);
    }
}
```

在这个示例中，我们往 Redis 中保存了一个对象，让我们再来看看 Redis 中保存是数据是什么样的。

```sh
127.0.0.1:6379> get user:1
{"@class":"com.dysy.redisspringboot.entity.User","id":1,"name":"赵六"}
```

可以看到，我们保存的对象，已经被序列化成了 JSON 字符串，这是因为我们使用的是 `Jackson2JsonRedisSerializer` 序列化方式。而 `Jackson2JsonRedisSerializer` 序列化方式，会在序列化时，自动在 JSON 字符串中添加一个 `@class` 属性，这个属性是为了在反序列化时，能够找到对应的类来帮助我们自动反序列化。我们可以在 RedisInsight 中看到，数据也是 JSON 字符串。

![20230524230832](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-24/20230524230832.png)

但是呢，上面的方式有一个弊端，每个对象都会额外在 Redis 中存储 `@class`，如果我们存储的数据很多，这对内存来讲，是一种极大的浪费。那么，我们有没有办法不存储 `@class` 呢？答案是肯定的，我们可以直接使用 Spring Data Redis 提供的 `StringRedisTemplate`，先将对象手动转为 JSON 字符串，然后使用 `StringRedisTemplate` 保存 JSON 字符串，在获取数据时，手动将字符串转为对象即可。我们来看看示例。

- `RedisSpringbootApplicationTests.java`

```java
@SpringBootTest
class RedisSpringbootApplicationTests {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Test
    void test5() throws JsonProcessingException {
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        User user = new User(7, "钱七");
        ObjectMapper objectMapper = new ObjectMapper();
        // 将对象转为 JSON 字符串
        String json = objectMapper.writeValueAsString(user);
        ops.set("user:6", json);
        String result = ops.get("user:6");
        // 将 JSON 字符串转为对象
        User resultUser = objectMapper.readValue(result, User.class);
        System.out.println(resultUser);
    }
}
```

:::tip 说明
如果我们想使用 `RedisTemplate` 来保存对象，并且在存储时，又不想保留额外的 `@class` 字段，并且想在获取数据时自动进行反序列化。那么我现在告诉你，这是不可能的。因为反序列化需要知道对象的类型，而没有 `@class` 字段后，就不知道你存储的是什么类型的对象，因此它是无法自动反序列化的。所以，如果你想使用 `RedisTemplate` 来保存对象，那么你就必须保留额外的 `@class` 字段，这是无法避免的。
:::

- **示例 3**

```java
@SpringBootTest
class RedisSpringbootApplicationTests {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Test
    void test6() {
        // value 只能是字符串,。即使这里的 value 是 Object 类型, 也会被强转成字符串
        HashOperations<String, Object, Object> ops = stringRedisTemplate.opsForHash();
        ops.put("user:7", "name", "孙七");
        ops.put("user:7", "age", "17");
        Object name = ops.get("user:7", "name");
        System.out.println(name);
        ops.entries("user:7").forEach((k, v) -> System.out.println(k + ":" + v));
    }

}
```

在看了上面的一些操作后，你可能有点懵，不明白为什么要这样做。下面，我们就来看看 `RedisAutoConfiguration` 这个自动配置类，看看它是怎么做的。

- `RedisAutoConfiguration.java`

```java
/**
 * 这个类非常简单，只有两个方法
 */

@AutoConfiguration
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
/**
 * 导入 LettuceConnectionConfiguration 和 JedisConnectionConfiguration 相关的配置
 * 进入 JedisConnectionConfiguration 后会发现，Jedis 会爆红，因为我们没有手动引入 Jedis 依赖，所以 JedisConnectionConfiguration 是不生效的
 */
@Import({ LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class })
public class RedisAutoConfiguration {

	  @Bean
	  @ConditionalOnMissingBean(name = "redisTemplate")
	  @ConditionalOnSingleCandidate(RedisConnectionFactory.class)
	  public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
	  	  RedisTemplate<Object, Object> template = new RedisTemplate<>();
	  	  template.setConnectionFactory(redisConnectionFactory);
	  	  return template;
	  }

    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnSingleCandidate(RedisConnectionFactory.class)
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }

}
```

- `JedisConnectionConfiguration.java`

```java
@Configuration(proxyBeanMethods = false)
/**
 * 当存在 Jedis 依赖时，JedisConnectionConfiguration 才会生效, 由于我们没有手动引入 Jedis 依赖，所以 JedisConnectionConfiguration 是不生效的
 */
@ConditionalOnClass({ GenericObjectPool.class, JedisConnection.class, Jedis.class })
@ConditionalOnMissingBean(RedisConnectionFactory.class)
/**
 * 从这里我们能知道, 如果我们引入了 Jedis，那么该配置就会生效，因为 matchIfMissing 设置为了 true；当 spring.redis.client-type = jedis 时，JedisConnectionConfiguration 也会生效。
 * 总的来讲，只要我们引入了 Jedis，那么 JedisConnectionConfiguration 就会生效，不管你有没有配置 spring.redis.client-type = jedis。
 */
@ConditionalOnProperty(name = "spring.redis.client-type", havingValue = "jedis", matchIfMissing = true)
class JedisConnectionConfiguration extends RedisConnectionConfiguration {

    JedisConnectionConfiguration(RedisProperties properties,
        ObjectProvider<RedisStandaloneConfiguration> standaloneConfigurationProvider,
        ObjectProvider<RedisSentinelConfiguration> sentinelConfiguration,
        ObjectProvider<RedisClusterConfiguration> clusterConfiguration) {
        super(properties, standaloneConfigurationProvider, sentinelConfiguration, clusterConfiguration);
    }
    // ...
}
```

最后，再来简单总结一下 Lettuce 和 Jedis 的区别。

Lettuce 和 Jedis 都是流行的 Java 客户端库，用于与 Redis 进行交互。它们在性能方面的表现会受到多个因素的影响，包括使用的版本、配置方式、网络环境等。一般而言，Lettuce 在某些方面可能比 Jedis 具有更好的性能，但也可能在其他方面略逊一筹。

以下是 Lettuce 相对于 Jedis 的一些特点，这些特点可能会对性能产生影响：

- 异步支持
  
  Lettuce 支持异步操作，可以通过 Reactive API 或 CompletableFuture 进行异步编程。这使得在高并发场景下能够更好地利用系统资源，提供更好的性能。

- 线程安全
  
  Lettuce 的连接是线程安全的，因此可以在多线程环境下共享连接实例。这使得在并发访问时能够更高效地利用连接池，提高性能。

- 连接池模式
  
  Lettuce 使用基于 Netty 的连接池模式，它具有更好的异步 I/O 支持和更低的内存消耗。这可以在高负载情况下提供更好的性能表现。

- 响应模式
  
  Lettuce 使用基于响应式的 Redis 协议解析方式，相比于 Jedis 的阻塞 I/O，可以更高效地处理响应，并在单个连接上执行多个命令。

需要注意的是，性能的具体差异取决于实际使用情况。在某些情况下，Lettuce 可能表现得更好，而在其他情况下，Jedis 可能表现得更好。对于具体的应用场景，建议进行性能测试和基准测试，以确定最适合你的需求的客户端库。

此外，Lettuce 还提供了更多的功能和灵活性，如支持 Redis Sentinel 和 Redis Cluster、SSL/TLS 支持等，这些特性在某些情况下也可能影响你的选择。

综上所述，Lettuce 在某些方面可能比 Jedis 具有更好的性能，但具体的差异取决于多个因素。根据你的需求和实际情况，进行性能测试和评估，选择适合的客户端库。

