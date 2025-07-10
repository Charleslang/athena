# 远程调用

在前面，我们拆分出了商品服务（hm-goods-service）和购物车服务（hm-cart-service）。但是，现在我们遇到了一个问题，那就是购物车服务需要查询商品的信息。在单体架构中，我们可以在购物车中直接使用 `GoodsService`，但是随着服务被拆分，我们没办法这样做了，因为商品和购物车是两个独立的工程。那有没有什么办法可以实现我们的需求呢？其实，最简单的办法就是发送 Http 请求。在购物车中，我们可以调用商品相关的接口查询商品信息。

## 单体架构

- CartServiceImpl

```java
@Service
@RequiredArgsConstructor
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements CartService {

    /**
     * 商品服务的 service
     */
    private final GoodsService goodsService;

    /**
     * 查询购物车
     */
    @Override
    public List<CartVO> queryMyCarts() {
        // 1.查询我的购物车列表
        List<Cart> carts = lambdaQuery().eq(Cart::getUserId, UserContext.getUserId()).list();
        if (CollUtils.isEmpty(carts)) {
            return CollUtils.emptyList();
        }

        // 2.转换 VO
        List<CartVO> vos = BeanUtils.copyList(carts, CartVO.class);

        // 3.处理 VO 中的商品信息
        handleCartGoods(vos);

        // 4.返回
        return vos;
    }

    private void handleCartGoods(List<CartVO> vos) {
        // 1.获取商品 id
        Set<Long> goodsIds = vos.stream().map(CartVO::getGoodsId).collect(Collectors.toSet());
        // 2.查询商品
        List<GoodsDTO> goodsList = goodsService.queryGoodsByIds(goodsIds);
        if (CollUtils.isEmpty(goodsList)) {
            return;
        }
        // 3.转为 id 到 goods 的 map
        Map<Long, GoodsDTO> goodsMap = goodsList.stream().collect(Collectors.toMap(GoodsDTO::getId, Function.identity()));
        // 4.写入 vo
        for (CartVO v : vos) {
            GoodsDTO goodsDTO = goodsMap.get(v.getGoodsId());
            if (goodsDTO == null) {
                continue;
            }
            v.setNewPrice(goodsDTO.getPrice());
            v.setStatus(goodsDTO.getStatus());
            v.setStock(goodsDTO.getStock());
        }
    }
}
```

## Http 请求

- RestTemplateConfig

```java
@Configuration(proxyBeanMethods = false)
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

- CartServiceImpl

```java{8,36-50}
@Service
@RequiredArgsConstructor
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements CartService {

    /**
     * 注入 RestTemplate
     */
    private final RestTemplate restTemplate;

    /**
     * 查询购物车
     */
    @Override
    public List<CartVO> queryMyCarts() {
        // 1. 查询我的购物车列表
        List<Cart> carts = lambdaQuery().eq(Cart::getUserId, UserContext.getUserId()).list();
        if (CollUtils.isEmpty(carts)) {
            return CollUtils.emptyList();
        }

        // 2. 转换 VO
        List<CartVO> vos = BeanUtils.copyList(carts, CartVO.class);

        // 3. 处理 VO 中的商品信息
        handleCartGoods(vos);

        // 4. 返回
        return vos;
    }

    private void handleCartGoods(List<CartVO> vos) {
        // 1. 获取商品 id
        Set<Long> goodsIds = vos.stream().map(CartVO::getGoodsId).collect(Collectors.toSet());

        // 发送 Http 请求
        ResponseEntity<List<GoodsDTO>> response = restTemplate.exchange(
                "http://localhost:8081/goods?ids={ids}",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                },
                Map.of("ids", CollUtils.join(goodsIds, ","))
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            return;
        }

        // 2. 查询商品
        List<GoodsDTO> goodsList = response.getBody();

        if (CollUtils.isEmpty(goodsList)) {
            return;
        }
        // 3. 转为 id 到 goods 的 map
        Map<Long, GoodsDTO> goodsMap = goodsList.stream().collect(Collectors.toMap(GoodsDTO::getId, Function.identity()));
        // 4. 写入 vo
        for (CartVO v : vos) {
            GoodsDTO goodsDTO = goodsMap.get(v.getGoodsId());
            if (goodsDTO == null) {
                continue;
            }
            v.setNewPrice(goodsDTO.getPrice());
            v.setStatus(goodsDTO.getStatus());
            v.setStock(goodsDTO.getStock());
        }
    }
}
```

上面这种方式虽然可以实现功能，但是，还存在一个非常明显的问题。那就是，购物车服务调用商品服务时，需要知道商品服务的 IP 和 端口。但是，在微服务中，一般情况下，某个服务的 IP 和端口不是固定的，随时都可能发生变动。针对这种情况，我们可以使用负载均衡技术，把商品服务使用 Nginx 进行代理，这样，我们只需要知道 Nginx 的地址就行了，这也是一种解决办法。当然，这种方式也存在弊端，就是无法感知到商品服务的变化，例如商品服务某个实例挂掉了或者新增了实例。这就是微服务架构中的服务治理问题，需要使用[注册中心](./registration-center.html)。
