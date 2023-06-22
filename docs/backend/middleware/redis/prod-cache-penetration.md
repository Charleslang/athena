# 缓存穿透

一般来讲，如果我们的业务中使用了缓存，那么在进行查询时，会先从缓存中获取数据，如果缓存中没有数据，那么再去查询数据库。  
缓存穿透是指客户端请求的数据在缓存中和数据库中都不存在，这样永远不会命中缓存，这些请求都会打到数据库。如果这样的请求量过大，数据库的压力就会很大，甚至可能把数据库打崩。

常见的解决方案有以下几种：

**1. 缓存空对象**

所谓缓存空对象，就是如果数据库中也没查到结果，那么把 "NULL" 也放入缓存（带过期时间）。

- 优点：实现简单，维护方便
- 缺点：额外的内存消耗，可能造成短期的不一致

:::tip 说明
对上面的缺点进行一下说明。

1. 额外的内存消耗
   
  既然使用缓存，那么就不可避免的会消耗一些内存，如果存在恶意攻击，那么我们就会缓存很多无效数据，这些无效数据会占用大量的内存，如果内存不够用，那么就会导致缓存中的有效数据被清除。

2. 短期的不一致

  试想一下，我们发起一个请求，请求 id 为 10 的商铺的信息，但是呢，数据库中并没有这条记录，于是我们把 "NULL" 放入缓存，然而在某个时候，我们添加了 id 为 10 的商铺信息，这时候再去查询，按理来说应该可以查询到刚才新增的数据才对，可是呢，由于缓存中 id 为 10 的商铺信息为 "NULL"，所以我们得到的结果就是 "NULL"，这就造成了缓存和数据库的不一致。所以，在缓存空对象时，一定要注意缓存的过期时间。
:::

**2. 布隆过滤器**

布隆过滤器是一种数据结构，它实际上是一个很长的二进制向量和一系列随机映射函数，它可以用于判断一个元素是否在集合中，它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。  

如果想判断一个元素是不是在一个集合里，一般想到的是将集合中所有元素保存起来，然后通过比较确定。链表、树、散列表（又叫哈希表，Hash table）等等数据结构都是这种思路。但是随着集合中元素的增加，我们需要的存储空间越来越大。同时检索速度也越来越慢，上述三种结构的检索时间复杂度分别为 `O(n)`、`O(logn)`、`O(1)`。

布隆过滤器的原理是，当一个元素被加入集合时，通过 K 个散列函数将这个元素映射成一个位数组中的 K 个点，把它们置为 1。检索时，我们只要看看这些点是不是都是 1 就（大约）知道集合中有没有它了：如果这些点有任何一个 0，则被检元素一定不在；如果都是 1，则被检元素很可能在。这就是布隆过滤器的基本思想。

通过上面这个简短的介绍，我们可以知道，如果布隆过滤器判断某个元素不在集合中，那么这个元素一定不在集合中；如果布隆过滤器判断某个元素在集合中，那么这个元素可能在集合中。

有了布隆过滤器，我们在查询时，先去布隆过滤器中查询，如果布隆过滤器中不存在，那么就不用去缓存、数据库中查询了，如果布隆过滤器中存在，那么就去缓存中查询，如果缓存中没有，则再查询数据库，如果数据库中也不存在，那么就把这个元素加入到布隆过滤器中，告诉布隆过滤器这个元素不存在。

**优点：**

- 空间效率和查询时间都远远超过一般的算法
- 可以用来解决缓存穿透、垃圾邮件识别等问题

**缺点：**

- 有一定的误识别率和删除困难，一般情况下不能从布隆过滤器中删除元素。我们很容易想到把位数组变成整数数组，每插入一个元素相应的计数器加1, 这样删除元素时将计数器减掉就可以了。然而要保证安全地删除元素并非如此简单。首先我们必须保证删除的元素的确在布隆过滤器里面。这一点单凭这个过滤器是无法保证的。另外计数器回绕也会造成问题。如果一个元素已经被插入到布隆过滤器中多次，那么在删除的时候就会存在问题。比如一个元素被插入了两次，相应的计数器值为2。如果我们将计数器减为1，那么在检索的时候这个元素仍然会存在。因此我们必须使用一个额外的机制来跟踪一个元素被插入的次数。另外由于删除操作会造成计数器的回绕，因此需要定期重新创建布隆过滤器。在降低误算率方面，有不少工作，使得出现了很多布隆过滤器的变种。
- 误识别率取决于哈希函数的个数和位数组的长度，随着存入的元素数量增加，误算率随之增加。但是如果元素数量太少，则使用散列表足矣。

**3. 增强 id 的复杂度，避免被猜测 id 规律**  
**4. 做好数据的基础格式校验**  
**5. 加强用户权限校验**  
**6. 做好热点参数的限流**  


此处，我们以 "缓存空值" 为例，示例代码如下：

```java
public class ShopServiceImpl implements ShopService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Shop findById(int id) throws JsonProcessingException, InterruptedException {
        String cacheKey = getCacheKey(id);
        ObjectMapper objectMapper = new ObjectMapper();
        Shop shop;
        String jsonStr = stringRedisTemplate.opsForValue().get(cacheKey);
        if (StringUtils.hasLength(jsonStr)) {
            shop = objectMapper.readValue(jsonStr, Shop.class);
            // 如果缓存命中了缓存空值，则抛出异常
            if (shop.getId() <= 0) {
                throw new AppBizException("商铺不存在");
            }
            return shop;
        }
        // 模拟从数据库中查询
        TimeUnit.MILLISECONDS.sleep(20);
        if (id == 2) {
            shop = null;
        } else {
            shop = new Shop(id, "茶百道", "成都市锦江区");
        }
        if (Objects.isNull(shop)) {
            // 如果从数据库中查询到的是 NULL，则缓存空值，防止缓存穿透
            stringRedisTemplate.opsForValue().set(cacheKey, "{}", KeyConstants.REDIS_NIL_KEY_TTL, TimeUnit.MINUTES);
            throw new AppBizException("商铺不存在");
        }
        // 将查询结果写入缓存
        stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(shop), KeyConstants.REDIS_SHOP_KEY_TTL, TimeUnit.MINUTES);
        return shop;
    }

    private String getCacheKey(int shopId) {
        return KeyConstants.REDIS_SHOP_KEY_PREFIX + shopId;
    }
}
```