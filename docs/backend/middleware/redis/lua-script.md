# Lua 脚本

:::tip 参考
[Scripting with Lua](https://redis.io/docs/interact/programmability/eval-intro/)
:::

:::tip Lua 语法
参考 [Lua 教程](https://www.runoob.com/lua/lua-tutorial.html)
:::

Redis 允许用户在服务器上上传和执行 Lua 脚本。脚本可以采用编程控制结构，并在执行时使用大多数命令来访问 Redis。由于脚本在服务器中执行，因此从脚本中读取和写入数据非常高效。

Redis 保证脚本的原子执行。在执行脚本时，所有服务器活动在整个运行时期间都被阻塞（执行 Lua 脚本中的命令时，不会执行其它任何命令，直到脚本中的所有命令都执行完成）。这些语义意味着脚本里的所有命令要么尚未执行，要么已经执行。

脚本提供了多种在许多情况下都很有价值的属性。这些包括：

- 通过执行数据所在的逻辑来提供局部性。数据局部性可减少总体延迟并节省网络资源。
- 确保脚本原子执行的阻塞语义。
- 实现 Redis 中缺少或过于小众的简单功能的组合。

Lua 允许您在 Redis 内运行部分应用程序逻辑。此类脚本可以跨多个键执行条件更新，可能以原子方式组合几种不同的数据类型。

脚本由嵌入式执行引擎在 Redis 中执行。目前，Redis 支持单一脚本引擎，即 Lua 5.1 解释器。请参阅 [Redis Lua API](https://redis.io/topics/lua-api) 参考页面以获取完整文档。

尽管服务器执行它们，但 Eval 脚本被视为客户端应用程序的一部分，这就是为什么它们没有命名、版本控制或持久化的原因。因此，如果缺少（服务器重新启动、故障转移到副本等之后），所有脚本可能需要由应用程序随时重新加载。从版本 7.0 开始，[Redis Functions](https://redis.io/topics/functions-intro) 提供了另一种可编程性方法，允许使用额外的编程逻辑来扩展服务器本身。

**Lua 脚本与 Redis 交互**

可以通过 `redis.call()` 或 `redis.pcall()` 从 Lua 脚本调用 Redis 命令。

两者几乎完全相同。两者都执行 Redis 命令及其提供的参数（如果这些参数代表格式良好的命令）。然而，这两个函数之间的区别在于处理运行时错误（例如语法错误）的方式。调用 `redis.call()` 函数引发的错误将直接返回到执行该函数的客户端。相反，调用 `redis.pcall()` 函数时遇到的错误将返回到脚本的执行上下文，而不是进行可能的处理。例如，一段 Lua 脚本如下：

```lua
return redis.call('set', 'name', 'zs')
```

**Lua 脚本的执行**

Reids 使用 `EVAL` 命令执行 Lua 脚本。基本如下：

```bash
127.0.0.1:6379> help eval

  EVAL script numkeys key [key ...] arg [arg ...]
  summary: Execute a Lua script server side
  since: 2.6.0
  group: scripting
```

```bash
127.0.0.1:6379> eval "return redis.call('set', 'name', 'zs', 'EX', 5)" 0
OK
```

**Lua 脚本的参数**

Lua 脚本可以接受两种类型的参数：key 的个数和参数。key 的个数是用于指定脚本可以访问的 Redis 的 key。参数是脚本可以访问的任意数据。这些参数可以是字符串、数字、表或 Redis 的 key。使用 `EVAL` 命令时，必须要指定 key 的个数，即使脚本不需要访问任何 key（如果脚本中不需要使用外部传入的 key，那么 key 的个数为 0）。在脚本中可以通过 `KEYS` 和 `ARGV` 获取传入的参数，`KEYS` 为 key 的数组，`ARGV` 为参数的数组。（Lua 脚本中，数组的下标从 1 开始）

```bash
redis> EVAL "return { KEYS[1], KEYS[2], ARGV[1], ARGV[2], ARGV[3] }" 2 key1 key2 arg1 arg2 arg3
1) "key1"
2) "key2"
3) "arg1"
4) "arg2"
5) "arg3"
```

**脚本缓存**

每当我们调用 `EVAL` 时，我们还会在请求中包含脚本的源代码。重复调用 `EVAL` 来执行同一套参数化脚本，既浪费网络带宽，又会在Redis 中产生一些开销。当然，节省网络和计算资源是关键，因此，Redis 为脚本提供了缓存机制。您使用 `EVAL` 执行的每个脚本都存储在服务器保留的专用缓存中。缓存的内容是脚本的 SHA1 摘要，因此脚本的 SHA1 摘要在缓存中唯一标识一个脚本。您可以通过运行 `EVAL` 并随后调用 `INFO` 命令来验证此行为。您会注意到，`used_memory_scripts_eva`l 和 `number_of_cached_scripts` 指标随着执行的每个新脚本而增长（每执行一个新脚本，`used_memory_scripts_eva`l 和 `number_of_cached_scripts` 都会增长。如果执行某个脚本后，`used_memory_scripts_eva`l 和 `number_of_cached_scripts` 没有增长，那么说明该脚本已经在缓存中了）。

如上所述，动态生成的脚本是一种反模式。在应用程序运行时生成脚本可能会耗尽主机用于缓存脚本的内存资源。相反，脚本应该尽可能通用，并通过其参数提供自定义执行。

通过调用 `SCRIPT LOAD` 命令并提供其源代码，将脚本加载到服务器的缓存中。服务器不执行脚本，而只是编译并将其加载到服务器的缓存中。加载后，您可以使用服务器返回的 SHA1 摘要执行缓存的脚本。如下：

```bash
redis> SCRIPT LOAD "return 'Immabe a cached script'"
"c664a3bf70bd1d45c4284ffebb65a6f2299bfc9f"
redis> EVALSHA c664a3bf70bd1d45c4284ffebb65a6f2299bfc9f 0
"Immabe a cached script"
```

**缓存不稳定性**

Redis 脚本缓存始终是不稳定的。它不被视为数据库的一部分，并且不会被持久化。当服务器重新启动时、在副本承担主角色时的故障转移期间或通过 `SCRIPT FLUSH` 显式地清除缓存时，可能会清除缓存。这意味着缓存的脚本是短暂的，并且缓存的内容可能随时丢失。

使用脚本的应用程序应始终调用 EVALSHA 来执行它们。如果脚本的 SHA1 摘要不在缓存中，服务器将返回错误。例如：

```bash
redis> EVALSHA ffffffffffffffffffffffffffffffffffffffff 0
(error) NOSCRIPT No matching script
```
在这种情况下，应用程序应首先使用 `SCRIPT LOAD` 加载它，然后再次调用 `EVALSHA` 以通过其 SHA1 运行缓存的脚本。大多数 [Redis 客户端](https://redis.io/clients)已经提供实用的 API 来自动执行此操作。有关具体细节，请查阅您使用的客户端文档。

:::warning 注意
请想想，通过 Jedis 执行脚本时，我们是不是每次都要传输脚本代码？如果脚本代码非常大，那么每次都要传输这么大的脚本代码，这样会非常浪费网络带宽。所以，Jedis 提供了 `scriptLoad` 方法，可以将脚本加载到服务器的缓存中，然后通过 `evalsha` 方法执行缓存的脚本。这样就可以节省网络带宽了。
:::

**Lua 脚本实现分布式锁**

- 加锁

```lua
-- KEYS[1] 为锁的 key，ARGV[1] 为锁的 value，ARGV[2] 为锁的过期时间
if redis.call('setnx', KEYS[1], ARGV[1]) == 1 then
    return redis.call('expire', KEYS[1], ARGV[2])
else
    return 0
end

-- 或者直接使用 set 命令
return redis.call('set', KEYS[1], ARGV[1], 'EX', ARGV[2], 'NX')
```

- 解锁

```lua
-- KEYS[1] 为锁的 key, ARGV[1] 为锁的 value
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

Jedis、Lua 脚本实现分布式锁的代码如下：

```java
public class LuaJedisLock {

    private String key;

    /**
     * 使用 SETNX 互斥命令 设置 key 值，如果设置成功了，返回 1
     * 并且设置超时时间，为锁的最大处理时间, 设置成功也返回 1
     */
    private static final StringBuilder lockScriptBuilder = new StringBuilder()
            .append("if (redis.call('SETNX', KEYS[1], ARGV[1]) == 1) then")
            .append("   return redis.call('expire', KEYS[1], ARGV[2])")
            .append("else")
            .append("   return 0")
            .append("end");

    private static final StringBuilder unlockScriptBuilder = new StringBuilder()
            .append("if (redis.call('get', KEYS[1]) == ARGV[1]) then")
            .append("   return redis.call('del', KEYS[1])")
            .append("else")
            .append("   return 0")
            .append("end");      

    /**
     * 每一个锁的 key，不同的业务使用不同的 key
     */
    public LuaJedisLock(String key) {
        this.key = "redis:lock:" + key;
    }

    /**
     * 获取锁
     * @param timeout     获取锁等待的超时间
     * @param processTime 处理过程中的超时时间
     */
    public boolean acquireLock(long timeout, long processTime) {

        Jedis jedis = null;
        try {
            jedis = JedisPoolUtil.getInstance().getResource();

            // 转换为 EVALSHA 命令执行
            String sha1 = jedis.scriptLoad(lockScriptBuilder.toString());

            // 获取锁的最后时间, 否则则超时获取不到
            long endTime = System.currentTimeMillis() + timeout;

            // 当前时间 小于获取的超时时间，可以持续获取
            while (System.currentTimeMillis() < endTime) {

                Long result = (Long) jedis.evalsha(sha1, 1, key, "lockValue", String.valueOf(processTime));

                if (result == 1) return true;
                // 这里说明没有获取到锁，休眠一会，继续循环
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
        return false;
    }

    /**
     * 释放锁
     */
    public void releaseLock() {
        Jedis jedis = null;
        try {
            jedis = JedisPoolUtil.getInstance().getResource();
            // 转换为 EVALSHA 命令执行
            String sha1 = jedis.scriptLoad(unlockScriptBuilder.toString());
            jedis.evalsha(sha1, 1, key, "lockValue");
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
    }
}
```

:::tip 提示
Lua 脚本的其它用法见 [Redis + Lua实现分布式限流](https://juejin.cn/post/6844904153647415303)
:::
