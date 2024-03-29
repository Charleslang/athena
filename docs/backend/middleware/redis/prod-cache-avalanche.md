# 缓存雪崩

缓存雪崩是指在同一时段大量的缓存 key 同时失效或者 Redis 服务宕机，导致大量请求到达数据库，带来巨大压力。

**解决方案如下：**

1. 不同的 key 设置不同的 TTL  
2. 用 Redis 集群提高服务的可用性  
3. 缓存业务添加降级限流策略  
4. 业务添加多级缓存  


:::tip 提示
此处不给出具体代码和解决思路，原因如下：

1. 给不同的 Key 设置不同的 TTL，这个很简单，只需要在设置缓存的时候，设置不同的过期时间即可
2. Redis 集群在后面的笔记中会提到
3. 限流不属于 Redis 的范畴，后面会有专门的笔记
4. 多级缓存在后面的笔记中会提到
:::
