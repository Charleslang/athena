# 短信登录

## 基于 Session

先来看下基于 Session 的短信登录流程：

1. 用户输入手机号，点击获取验证码
2. 后端生成验证码，放入 Session 中
3. 用户输入验证码，点击登录（浏览器会在 Cookie 中自动带上 session id）
4. 后端从 Session 中取出验证码，与用户输入的验证码进行比对
5. 如果验证码正确，则登录成功。然后将 Session 中的验证码删除，并将用户信息放入 Session 中

来看看代码：

- `pom.xml`

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.12</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
<properties>
    <java.version>1.8</java.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

- `LoginController.java`

```java
@RequestMapping("/login")
@RestController
@Validated
public class LoginController {

    @Resource
    private LoginService loginService;

    /**
     * 发送验证码
     */
    @GetMapping("/code")
    public Result sendVerificationCode(@NotBlank(message = "手机号不能为空")
                                       @Pattern(regexp = "^1[3|4|5|6|7|8][0-9]\\d{8}$", message = "手机号格式不正确") String phone,
                                       HttpSession session) {
        loginService.sendVerificationCode(phone, session);
        return Result.ok();
    }

    /**
     * 登录
     */
    @PostMapping("/login")
    public Result login(@NotBlank(message = "手机号不能为空")
                        @Pattern(regexp = "^1[3|4|5|6|7|8][0-9]\\d{8}$", message = "手机号格式不正确") String phone,
                        @NotBlank(message = "验证码不能为空")
                        @Length(min = 6, max = 6, message = "验证码必须是 {max} 位") String verificationCode,
                        HttpSession session) {
        loginService.login(phone, verificationCode, session);
        return Result.ok();
    }
}
```

- `LoginServiceImpl.java`

```java
@Service
public class LoginServiceImpl implements LoginService {

    private static final String VERIFICATION_CODE = "123456";

    /**
     * 发送验证码
     */
    @Override
    public void sendVerificationCode(String phone, HttpSession session) {
        // 把验证码放入 session 中
        session.setAttribute(getVerificationCodeKey(phone), VERIFICATION_CODE);
        System.out.println(getVerificationCodeKey(phone) + ":" + VERIFICATION_CODE);
    }

    /**
     * 登录
     */
    @Override
    public void login(String phone, String verificationCode, HttpSession session) {
        // 1. 检查验证码是否正确
        String verificationCodeInSession = (String) session.getAttribute(getVerificationCodeKey(phone));
        if (Strings.isBlank(verificationCodeInSession)) {
            throw new AppBizException("验证码已过期，请重新获取");
        }
        if (!verificationCodeInSession.equals(verificationCode)) {
            throw new AppBizException("验证码不正确");
        }
        // 2. 检查用户是否存在
        User user = new User(1, "张三");

        // 3. 如果用户不存在，创建用户

        // 4. 检查用户是否被禁用、锁定等

        // 5. 删除 session 中的验证码
        session.removeAttribute(getVerificationCodeKey(phone));

        // 6. 保存用户信息到 session 中
        session.setAttribute(getUserKey(session.getId()), user);
    }

    private String getVerificationCodeKey(String phone) {
        return KeyConstants.VERIFICATION_CODE_KEY_PREFIX + phone;
    }

    private String getTokenKey(String token) {
        return KeyConstants.TOKEN_KEY_PREFIX + token;
    }

    private String getUserKey(String sessionId) {
        return KeyConstants.USER_KEY_PREFIX + sessionId;
    }
}
```

- `UserController.java`

```java
@RequestMapping("/user")
@RestController
public class UserController {

    /**
     * 获取当前登录用户
     */
    @GetMapping("/me")
    public Result getCurrUser() {
        User user = AppContext.getUser();
        return Result.ok(user);
    }

}
```

- `AuthenticationInterceptor.java`

```java
public class AuthenticationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object user = session.getAttribute(KeyConstants.USER_KEY_PREFIX + session.getId());
        if (Objects.isNull(user)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            responseJSON(response, HttpStatus.UNAUTHORIZED.value(), "用户未登录");
            return false;
        }
        AppContext.setUser((User) user);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        AppContext.removeUser();
    }

    private void responseJSON(HttpServletResponse response, int code, String msg) throws JsonProcessingException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=utf-8");

        Result result = Result.error(code, msg);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(result);

        try (PrintWriter writer = response.getWriter()) {
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- `AppWebConfig.java`
  
```java
@Configuration
public class AppWebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor())
                .excludePathPatterns(
                        "/login/code",
                        "/login/login"
                );
    }

    @Bean
    public AuthenticationInterceptor authenticationInterceptor() {
        return new AuthenticationInterceptor();
    }
}
```

接下来使用 Postman 测试一下：

**1. 发送验证码**

![20230604145444](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604145444.png)

在发送验证码接口的 Response 中，Tomcat 会返回一个 JSESSIONID，这个 JSESSIONID 会被浏览器保存到 Cookie 中，下次请求时会自动带上。由于我们使用的是 Postman，所以在下次请求时需要手动把 JSESSIONID 添加到 Cookie 中。

**2. 登录**

![20230604144812](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604144812.png)

**3. 获取当前登录用户**

![20230604145412](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604145412.png)


上面就是使用 Session 实现登录认证的代码，这种方式的优点是简单，缺点是不支持集群部署。由于 Session 是基于 JVM 内存的，在集群部署时，如果用户在 A 服务器登录，那么在 B 服务器上就无法获取到用户信息，这就导致了用户在 A 服务器登录后，切换到 B 服务器时，需要重新登录，显然这是不合理的。

为了解决这个问题，Tomcat 提供了一种叫做 Session 共享的功能，其实就是把 Session 复制到集群中的其他服务器上，但是这种方式有一些缺点，如下：

- 性能低。因为每次请求都需要把 Session 复制到其他服务器上，而且 Session 也可能会很大，这样就会导致网络传输的性能低下
- Session 拷贝存在一定的延迟。这样就会导致用户在 A 服务器登录后，切换到 B 服务器时，需要等待一段时间才能获取到用户信息
- Session 共享需要依赖于 Tomcat，如果以后要迁移到其他容器，那么就需要重新实现 Session 共享的功能
- 浪费存储空间。因为每个服务器都会保存一份 Session，如果集群中有 10 台服务器，那么就会浪费 10 倍的存储空间

那有没有一种方式既能解决集群部署的问题，又能解决上面的缺点呢？同时，Session 的替代方案还应该具备以下特点：

- 性能高。因为 Session 是基于内存的，所以性能很高，那么替代方案也应该具备很高的性能
- 数据共享
- K-V 存储。因为 Session 是 K-V 结构，所以替代方案最好也应该是 K-V 存储

答案是有的，那就是**Redis**。

## 基于 Redis

Redis 实现 Session 共享的原理很简单，就是把 Session 保存到 Redis 中，然后在集群中的其他服务器上，通过 Session ID 从 Redis 中获取 Session。此处，我们不介绍 Redis 实现 Session 共享，仅仅介绍一下短信验证码的实现以及登录认证的实现。步骤如下：

1. 用户输入手机号，点击发送验证码。
2. 后端生成验证码，保存到 Redis 中，key 为 `login:code:13111111111`，value 为验证码，设置过期时间为 1 分钟。
3. 用户登录时，输入手机号和验证码，后端从 Redis 中获取验证码，并校验验证码是否正确。
4. 如果验证码正确，则后端生成一个 Token，保存到 Redis 中，key 为 `token:xxxx`，value 为用户信息，设置过期时间为 7 天。
5. 后端把 Token 设置到 Response Header 的 `Authorization`（字段名可以任取，只要前后端约定好就可以）中，返回给前端。
6. 前端把 Response Header 的 `Authorization` 保存到 `SessionStorage` 或者 `LocalStorage ` 中，在每次请求时，都把 Token 设置到 Request Header 的 `Authorization` 中。
7. 如果前端的请求头中含有 Authorization，则后端从 Redis 中获取用户信息，如果获取到了，则说明用户已经登录，然后自动刷新 Token 的过期时间，这样用户就可以一直保持登录状态；否则说明用户未登录。

以下是验证码登录的实现代码：

- `LoginController.java`

```java
@RequestMapping("/login")
@RestController
@Validated
public class LoginController {

    @Resource
    private LoginService loginService;

    @GetMapping("/code")
    public Result sendVerificationCode(@NotBlank(message = "手机号不能为空")
                                       @Pattern(regexp = "^1[3|4|5|6|7|8][0-9]\\d{8}$", message = "手机号格式不正确") String phone,
                                       HttpSession session) {
        loginService.sendVerificationCode(phone, session);
        return Result.ok();
    }

    @PostMapping("/login")
    public Result login(@NotBlank(message = "手机号不能为空")
                        @Pattern(regexp = "^1[3|4|5|6|7|8][0-9]\\d{8}$", message = "手机号格式不正确") String phone,
                        @NotBlank(message = "验证码不能为空")
                        @Length(min = 6, max = 6, message = "验证码必须是 {max} 位") String verificationCode,
                        HttpServletResponse response,
                        HttpSession session) {
        String token = loginService.login(phone, verificationCode, session);
        response.addHeader("Authorization", token);
        return Result.ok();
    }
}
```

- `LoginServiceImpl.java`

```java
@Service
public class LoginServiceImpl implements LoginService {

    private static final String VERIFICATION_CODE = "123456";

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void sendVerificationCode(String phone, HttpSession session) {
        stringRedisTemplate.opsForValue().set(getVerificationCodeKey(phone), VERIFICATION_CODE, KeyConstants.REDIS_VERIFICATION_CODE_TTL, TimeUnit.SECONDS);
        // session.setAttribute(getVerificationCodeKey(phone), VERIFICATION_CODE);
        System.out.println(getVerificationCodeKey(phone) + ":" + VERIFICATION_CODE);
    }

    @Override
    public String login(String phone, String verificationCode, HttpSession session) {
        // 1. 检查验证码是否正确
        // String verificationCodeInSession = (String) session.getAttribute(getVerificationCodeKey(phone));
        String verificationCodeInRedis = stringRedisTemplate.opsForValue().get(getVerificationCodeKey(phone));
        if (Strings.isBlank(verificationCodeInRedis)) {
            throw new AppBizException("验证码已过期，请重新获取");
        }
        if (!verificationCodeInRedis.equals(verificationCode)) {
            throw new AppBizException("验证码不正确");
        }
        // 2. 检查用户是否存在
        User user = new User(1, "张三");

        // 3. 如果用户不存在，创建用户

        // 4. 检查用户是否被禁用、锁定等

        // 5. 生成 token
        String token = UUID.randomUUID().toString().replaceAll("-", "");

        // 6. 删除 session 中的验证码
        // session.removeAttribute(getVerificationCodeKey(phone));
        stringRedisTemplate.delete(getVerificationCodeKey(phone));

        // 7. 保存 token
        // session.setAttribute(getUserKey(session.getId()), user);
        // 将 user 对象转换为 map
        // Map<String, Object> map = user.toMap();
        Map<String, String> map = new HashMap<>();
        // 由于使用的是 StringRedisTemplate，所以这里的 key 和 value 都必须是 String 类型
        map.put("id", user.getId().toString());
        map.put("name", user.getName());
        String tokenKey = getTokenKey(token);
        stringRedisTemplate.opsForHash().putAll(tokenKey, map);
        stringRedisTemplate.expire(tokenKey, KeyConstants.REDIS_TOKEN_TTL, TimeUnit.DAYS);

        return token;
    }

    private String getVerificationCodeKey(String phone) {
        return KeyConstants.VERIFICATION_CODE_KEY_PREFIX + phone;
    }

    private String getTokenKey(String token) {
        return KeyConstants.TOKEN_KEY_PREFIX + token;
    }

    private String getUserKey(String sessionId) {
        return KeyConstants.USER_KEY_PREFIX + sessionId;
    }
}
```

- `AuthenticationInterceptor.java`

```java
public class AuthenticationInterceptor implements HandlerInterceptor {

    private static final String REQUEST_HEADER_AUTHORIZATION = "Authorization";

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // HttpSession session = request.getSession();
        // Object user = session.getAttribute(KeyConstants.USER_KEY_PREFIX + session.getId());
        String authorization = request.getHeader(REQUEST_HEADER_AUTHORIZATION);
        if (!StringUtils.hasLength(authorization)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            responseJSON(response, HttpStatus.UNAUTHORIZED.value(), "用户未登录");
            return false;
        }
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(getTokenKey(authorization));
        if (Objects.isNull(entries) || entries.isEmpty()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            responseJSON(response, HttpStatus.UNAUTHORIZED.value(), "用户未登录");
            return false;
        }
        User user = new User();
        user.setId(Integer.parseInt(entries.get("id").toString()));
        user.setName((String) entries.get("name"));
        AppContext.setUser(user);

        // 刷新 token (其实可以让前端手动刷新 token)
        stringRedisTemplate.expire(getTokenKey(authorization), KeyConstants.REDIS_TOKEN_TTL, TimeUnit.DAYS);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        AppContext.removeUser();
    }

    private void responseJSON(HttpServletResponse response, int code, String msg) throws JsonProcessingException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=utf-8");

        Result result = Result.error(code, msg);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(result);

        try (PrintWriter writer = response.getWriter()) {
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getTokenKey(String token) {
        return KeyConstants.TOKEN_KEY_PREFIX + token;
    }
}
```

上面就是一个简单的登录功能，下面来测试一下：

**1. 获取验证码**

![20230604163318](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604163318.png)

**2. 登录**

![20230604163351](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604163351.png)

Redis 中的 key: 

![20230604163509](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604163509.png)

**3. 获取当前登录用户**

![20230604163437](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-04/20230604163437.png)


在上面的示例中，后端手动刷新了 Token，但是这样会存在一个问题。我们是在 `AuthenticationInterceptor` 中刷新的 Token，而 `AuthenticationInterceptor` 只会拦截需要登录的请求，如果一个用户登录了，但是他一直访问的是不需要登录的接口，那么这个用户的 Token 就不会被刷新。其实我们可以单独再写一个拦截器，专门用来刷新 Token，这样就可以解决上面的问题了，当然，这个拦截器也可以不写，让前端来手动刷新 Token，这样也是可以的。

下面，我们单独写一个拦截器来自动刷新 Token：

- `RefreshTokenInterceptor.java`

```java
public class RefreshTokenInterceptor implements HandlerInterceptor {

    private static final String REQUEST_HEADER_AUTHORIZATION = "Authorization";

    private StringRedisTemplate stringRedisTemplate;

    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorization = request.getHeader(REQUEST_HEADER_AUTHORIZATION);
        if (!StringUtils.hasLength(authorization)) {
            return true;
        }
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(getTokenKey(authorization));
        if (Objects.isNull(entries) || entries.isEmpty()) {
            return true;
        }
        User user = new User();
        user.setId(Integer.parseInt(entries.get("id").toString()));
        user.setName((String) entries.get("name"));
        AppContext.setUser(user);

        // 刷新 token (其实可以让前端手动刷新 token)
        stringRedisTemplate.expire(getTokenKey(authorization), KeyConstants.REDIS_TOKEN_TTL, TimeUnit.DAYS);

        return true;
    }

    private String getTokenKey(String token) {
        return KeyConstants.TOKEN_KEY_PREFIX + token;
    }
}
```

- `AuthenticationInterceptor.java`

```java
public class AuthenticationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        User user = AppContext.getUser();
        if (Objects.isNull(user)) {
            responseJSON(response, HttpStatus.UNAUTHORIZED.value(), "用户未登录");
            return false;
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        AppContext.removeUser();
    }

    private void responseJSON(HttpServletResponse response, int code, String msg) throws JsonProcessingException {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=utf-8");

        Result result = Result.error(code, msg);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(result);

        try (PrintWriter writer = response.getWriter()) {
            writer.print(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- `AppWebConfig.java`

```java
@Configuration
public class AppWebConfig implements WebMvcConfigurer {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        // 注意添加拦截器的顺序, 先添加的先执行
        registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate));
        registry.addInterceptor(authenticationInterceptor())
                .excludePathPatterns(
                        "/login/code",
                        "/login/login"
                );

        // 如果不按照顺序添加的话，我们也可以使用 order 属性来指定拦截器的执行顺序，order 值越小，越先执行
        // registry.addInterceptor(authenticationInterceptor())
        //         .excludePathPatterns(
        //                 "/login/code",
        //                 "/login/login"
        //         ).order(1);
        // registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate)).order(0);
    }

    @Bean
    public AuthenticationInterceptor authenticationInterceptor() {
        return new AuthenticationInterceptor();
    }
}
```

为什么拦截器的 order 越小越先执行呢？看看 `InterceptorRegistry` 这个类的源码就知道了：

- `InterceptorRegistry.java`

```java
public class InterceptorRegistry {

	private final List<InterceptorRegistration> registrations = new ArrayList<>();


	/**
	 * 添加拦截器
	 */
	public InterceptorRegistration addInterceptor(HandlerInterceptor interceptor) {
		InterceptorRegistration registration = new InterceptorRegistration(interceptor);
		this.registrations.add(registration);
		return registration;
	}

	/**
	 * 获取拦截器时，按照 order 值进行排序，排序规则使用的是 INTERCEPTOR_ORDER_COMPARATOR
	 */
	protected List<Object> getInterceptors() {
		return this.registrations.stream()
				.sorted(INTERCEPTOR_ORDER_COMPARATOR)
				.map(InterceptorRegistration::getInterceptor)
				.collect(Collectors.toList());
	}


    /**
     * 自定义比较器, 最终会走 OrderComparator#doCompare（看 withSourceProvider 就知道了）
     */
	private static final Comparator<Object> INTERCEPTOR_ORDER_COMPARATOR =
			OrderComparator.INSTANCE.withSourceProvider(object -> {
				if (object instanceof InterceptorRegistration) {
					return (Ordered) ((InterceptorRegistration) object)::getOrder;
				}
				return null;
			});

}
```

- `OrderComparator.java`

```java
/**
 * 其实就是升序排序
 */
private int doCompare(@Nullable Object o1, @Nullable Object o2, @Nullable OrderSourceProvider sourceProvider) {
    boolean p1 = (o1 instanceof PriorityOrdered);
    boolean p2 = (o2 instanceof PriorityOrdered);
    if (p1 && !p2) {
        return -1;
    }
    else if (p2 && !p1) {
        return 1;
    }

    int i1 = getOrder(o1, sourceProvider);
    int i2 = getOrder(o2, sourceProvider);
    // 升序排序
    return Integer.compare(i1, i2);
}
```
