# 代理模式

Java 中的代理按照代理类生成的时机不同，可以分为静态代理和动态代理。静态代理是在编译时生成代理类，而动态代理是在运行时生成代理类。动态代理又分为 JDK 动态代理和 CGLIB 动态代理。

代理模式有以下几种角色：

- 抽象主题角色（Subject）：通过接口或者抽象类定义真实主题和代理主题的共同接口，这样在任何使用真实主题的地方都可以使用代理主题。
- 真实主题角色（RealSubject）：实现了抽象主题中的具体业务，定义了代理角色所代表的真实对象。
- 代理主题角色（Proxy）：提供了与真实主题相同的接口，通过持有真实主题的引用，可以在其实现的方法中调用真实主题的方法，同时可以在调用真实主题的方法前后执行一些额外的操作。

## 静态代理

- `TicketService`

```java
/**
 * 抽象主题角色，定义了售票服务的接口
 */
public interface TicketService {
  void sellTicket();
}
```

- `TicketServiceImpl`

```java
/**
 * 真实主题角色，实现了售票服务的具体业务
 */
public class TicketServiceImpl implements TicketService {

  @Override
  public void sellTicket() {
    System.out.println("售票");
  }
}
```

- `TicketServiceProxy`

```java
/**
 * 代理主题角色，提供了与真实主题相同的接口，通过持有真实主题的引用，可以在其实现的方法中调用真实主题的方法，同时可以在调用真实主题的方法前后执行一些额外的操作
 */
public class TicketServiceProxy implements TicketService {

  private final TicketService ticketService;

  public TicketServiceProxy(TicketService ticketService) {
    this.ticketService = ticketService;
  }

  @Override
  public void sellTicket() {
    System.out.println("代理售票");
    ticketService.sellTicket();
    System.out.println("售票结束");
  }
}
```

- `Main`

```java
public class Main {

  public static void main(String[] args) {
    TicketService ticketService = new TicketServiceImpl();
    TicketService ticketServiceProxy = new TicketServiceProxy(ticketService);
    // 客户端使用的是代理对象调用真实主题的方法
    ticketServiceProxy.sellTicket();
  }
}
```

## JDK 动态代理

在 JDK 动态代理中，代理类是在运行时动态生成的。JDK 提供了 `java.lang.reflect.Proxy` 类用于创建代理类，通过 `Proxy.newProxyInstance` 方法创建代理对象。

创建代理对象的步骤如下：

1. 创建一个原始对象的引用，用于指向真实主题对象。
2. 获取原始对象的类加载器，用于加载运行时动态生成的代理类。
3. 获取原始对象的接口列表，生成的代理类需要实现这些接口。
4. 创建一个 `InvocationHandler` 对象，重写 `invoke` 方法，在 `invoke` 方法中调用原始对象的原始方法（当调用代理对象的方法时，会调用 `invoke` 方法，而 `invoke` 方法中又调用了原始对象的原始方法，所以实现了代理的功能）。
5. 通过 `java.lang.reflect.Proxy.newProxyInstance` 方法生成代理对象。

- `TicketService`

```java
/**
 * 抽象主题角色，定义了售票服务的接口
 */
public interface TicketService {
  void sellTicket();
}
```

- `TicketServiceImpl`

```java
/**
 * 真实主题角色，实现了售票服务的具体业务
 */
public class TicketServiceImpl implements TicketService {

  @Override
  public void sellTicket() {
    System.out.println("售票");
  }
}
```

- `ProxyFactory`

```java
public static class ProxyFactory {
  public static TicketService getProxyInstance(TicketService ticketService) {
    return (TicketService) Proxy.newProxyInstance(
          ticketService.getClass().getClassLoader(),
          ticketService.getClass().getInterfaces(),
          new InvocationHandler() {
              @Override
              public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                // proxy 是动态生成的代理类
                // 输出结果为 com.sun.proxy.$Proxy0
                // 注意，不能直接输出 proxy 这个对象，会导致栈溢出
                System.out.println(proxy.getClass().getName());
                // method 是原始对象（被代理对象）中的方法
                // 输出结果为 public abstract void com.daijunfeng.design.pattern.structural.proxy.JDKDynamicProxyTest$TicketService.sellTicket()
                System.out.println(method);
                // args 是原始对象（被代理对象）的方法参数
                System.out.println(Arrays.toString(args));

                System.out.println("Before sell ticket");
                // 调用原始对象（被代理对象）的方法
                Object result = method.invoke(ticketService, args);
                System.out.println("After sell ticket");
                return result;
              }
          }
          /*(proxy, method, args) -> {
              System.out.println(proxy.getClass().getName());
              System.out.println(method);
              System.out.println(Arrays.toString(args));

              System.out.println("Before sell ticket");
              Object result = method.invoke(ticketService, args);
              System.out.println("After sell ticket");
              return result;
          }*/
    );
  }
}
```

- `Main`

```java
public class Main {

  public static void main(String[] args) {
    // 创建原始对象
    TicketService ticketService = new TicketServiceImpl();
    // 使用原始对象创建代理对象
    TicketService ticketServiceProxy = ProxyFactory.getProxyInstance(ticketService);
    // 输出的结果是 com.sun.proxy.$Proxy0，表明 ticketServiceProxy 是动态生成的代理对象
    System.out.println(ticketServiceProxy.getClass().getName());
    // 客户端使用的是代理对象调用真实主题的方法
    ticketServiceProxy.sellTicket();
  }
}
```

可能在看完上面的代码后，你感觉似懂非懂，不知道为什么会这样写。接下来，我们站在源码的角度去看问题，去看看最终生成的代理类长啥样。

在开始之前，我们对上面的代码做一些调整，在 `main` 方法的最后添加一行死循环代码，避免程序退出（因为代理对象是在运行时期生成的，是存放在内存中的，如果程序退出了，代理对象也就没了）。

```java
public class Main {

  public static void main(String[] args) throws Exception {
    TicketService ticketService = new TicketServiceImpl();
    TicketService ticketServiceProxy = ProxyFactory.getProxyInstance(ticketService);
    // 输出的结果是 com.sun.proxy.$Proxy0，表明程序生成了一个代理类 com.sun.proxy.$Proxy0 用于创建代理对象
    System.out.println(ticketServiceProxy.getClass().getName());
    ticketServiceProxy.sellTicket();

    // 避免程序退出
    while (true) {
      TimeUnit.SECONDS.sleep(1);
    }
  }
}
```

添加完成后，我们运行程序，然后使用 `Arthas` 工具查看代理类的信息。

```bash
# 需要注意的是，这里的 com.sun.proxy.$Proxy0 是代理类的全限定名，不同的情况下生成的代理类的类名可能不一样
# 可以在 while 死循环之前打印代理类的全限定名，然后就可以使用 Arthas 查看代理类的信息了
jad com.sun.proxy.$Proxy0 --source-only
```

Arthas 的输出结果如下：

```java
package com.sun.proxy;

import com.daijunfeng.design.pattern.structural.proxy.JDKDynamicProxyTest;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.UndeclaredThrowableException;

/**
 * 删除了一些无关的代码，只保留了和代理相关的代码
 */
// 1. 创建一个代理类，并实现原始对象相同的接口
public final class $Proxy0 extends Proxy implements JDKDynamicProxyTest.TicketService {
    private static Method m3;

    public $Proxy0(InvocationHandler invocationHandler) {
        super(invocationHandler);
    }

    static {
        try {
            // 2. 获取原始对象的方法（由于此处演示的方法没有参数，所以方法入参是 new Class[0]）
            m3 = Class.forName("com.daijunfeng.design.pattern.structural.proxy.JDKDynamicProxyTest$TicketService").getMethod("sellTicket", new Class[0]);
            return;
        }
        catch (NoSuchMethodException noSuchMethodException) {
            throw new NoSuchMethodError(noSuchMethodException.getMessage());
        }
        catch (ClassNotFoundException classNotFoundException) {
            throw new NoClassDefFoundError(classNotFoundException.getMessage());
        }
    }

    // 3. 重写 TicketService 接口的方法
    public final void sellTicket() {
        try {
            // 4. 调用 h 的 invoke 方法，h 是父类 Proxy 类的属性，是一个 InvocationHandler 对象
            // this 就是代理对象
            // m3 是原始对象的方法
            // null 是原始对象的方法参数
            this.h.invoke(this, m3, null);
            return;
        }
        catch (Error | RuntimeException throwable) {
            throw throwable;
        }
        catch (Throwable throwable) {
            throw new UndeclaredThrowableException(throwable);
        }
    }
}
```

在上面，我们提到了一个参数 `h`，那么 `h` 是什么呢？我们其实可以发现，生成的代理类 `$Proxy0` 继承了 `Proxy` 类，而 `Proxy` 类中有一个属性 `h`，`h` 是一个 `InvocationHandler` 对象。如下：

```java
package java.lang.reflect;

public class Proxy implements java.io.Serializable {

  /**
   * the invocation handler for this proxy instance.
   * @serial
   */
  protected InvocationHandler h;

  /**
   * Prohibits instantiation.
   */
  private Proxy() {
  }

  protected Proxy(InvocationHandler h) {
    Objects.requireNonNull(h);
    this.h = h;
  }
}
```

到这里，就豁然开朗了。我们再来稍微总结一下 JDK 动态代理的原理：

1. 创建一个原始对象，用于指向真实主题对象。
2. 使用原始对象来创建一个代理对象，并执行代理对象中的目标方法。步骤如下：
   1. 创建一个代理类，用于生成代理对象，该代理类实现了原始对象中相同的接口。
   2. 代理类重写原始接口中的所有抽象方法，在方法的实现中只调用 `InvocationHandler` 对象的 `invoke` 方法。
   3. 在 `InvocationHandler` 对象的 `invoke` 方法中调用原始对象的目标方法。

## CGLIB 动态代理

同样基于上面的代码，加入我们没有定义 `TicketService` 接口，而仅仅定义了 `TicketServiceImpl` 类，这时候我们就不能使用 JDK 动态代理了，因为 JDK 动态代理只能代理接口，不能代理类。这时候我们可以使用 CGLIB 动态代理。

CGLIB 是一个强大的，高性能的代码生成包，它可以为没有实现接口的类进行代理，被广泛运用于 AOP 框架中，为 JDK 的动态代理提供了提供了很好的补充。与 JDK 动态代理一样，CGLIB 也是将代理类生成在内存中，所以需要注意代理类的生命周期。

:::warning
CGLIB 是通过继承的方式实现代理，因此不能代理被 `final` 修饰的类和方法。
:::

- `pom.xml`

```xml
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

- `CGLIBDynamicProxyTest`

```java
public class CGLIBDynamicProxyTest {

    public static void main(String[] args) {
        TicketServiceImpl source = new TicketServiceImpl();
        TicketServiceImpl proxyInstance = ProxyFactory.getProxyInstance(source);
        proxyInstance.sellTicket();
    }

    public static class ProxyFactory {
        /**
         * CGLIB 动态代理生成的代理类是目标类的子类
         */
        public static <T> T getProxyInstance(T source) {

            Enhancer enhancer = new Enhancer();
            // 设置被代理类的父类
            enhancer.setSuperclass(source.getClass());
            // 设置回调函数，用于执行代理类的方法
            // MethodInterceptor 是 CGLIB 提供的接口，用于执行代理类的方法
            enhancer.setCallback(new MethodInterceptor() {
                @Override
                public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                    System.out.println("Before sell ticket");
                    System.out.println("proxy object: " + o.getClass().getName());
                    System.out.println("source method: " + method);
                    System.out.println("args: " + Arrays.toString(objects));
                    // 调用原始类（被代理类）的方法
                    Object result = method.invoke(source, objects);
                    System.out.println("After sell ticket");
                    return result;
                }
            });

            T proxyObject = (T) enhancer.create();
            return proxyObject;

        }
    }

    public static class TicketServiceImpl {

        public void sellTicket() {
            System.out.println("Sell ticket");
        }
    }
}
```

还是一样，我们运行程序，然后使用 `Arthas` 工具查看代理类的信息。

```java
package com.daijunfeng.design.pattern.structural.proxy;

import com.daijunfeng.design.pattern.structural.proxy.CGLIBDynamicProxyTest;
import java.lang.reflect.Method;
import net.sf.cglib.core.ReflectUtils;
import net.sf.cglib.core.Signature;
import net.sf.cglib.proxy.Callback;
import net.sf.cglib.proxy.Factory;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

/**
 * 可以看到，CGLIB 动态代理生成的代理类继承了原始类，同时也实现了 `Factory` 接口
 */
public class CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a extends CGLIBDynamicProxyTest.TicketServiceImpl implements Factory {
    private boolean CGLIB$BOUND;
    public static Object CGLIB$FACTORY_DATA;
    private static final ThreadLocal CGLIB$THREAD_CALLBACKS;
    private static final Callback[] CGLIB$STATIC_CALLBACKS;
    private MethodInterceptor CGLIB$CALLBACK_0;
    private static Object CGLIB$CALLBACK_FILTER;
    private static final Method CGLIB$sellTicket$0$Method;
    /**
     * 生成的代理类的方法
     */
    private static final MethodProxy CGLIB$sellTicket$0$Proxy;

    public CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a() {
        CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a cGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a = this;
        // 设置代理类的回调函数
        CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a.CGLIB$BIND_CALLBACKS(cGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a);
    }

    static {
        CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a.CGLIB$STATICHOOK1();
    }

    /**
     * 重写父类的方法
     */
    public final void sellTicket() {
        // 获取代理类的 methodInterceptor 对象
        MethodInterceptor methodInterceptor = this.CGLIB$CALLBACK_0;
        if (methodInterceptor == null) {
            CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a.CGLIB$BIND_CALLBACKS(this);
            methodInterceptor = this.CGLIB$CALLBACK_0;
        }
        if (methodInterceptor != null) {
            // 执行 methodInterceptor 的 intercept 方法
            Object object = methodInterceptor.intercept(this, CGLIB$sellTicket$0$Method, CGLIB$emptyArgs, CGLIB$sellTicket$0$Proxy);
            return;
        }
        super.sellTicket();
    }

    /**
     * 设置回调函数
     */
    @Override
    public void setCallback(int n, Callback callback) {
        switch (n) {
            case 0: {
                this.CGLIB$CALLBACK_0 = (MethodInterceptor)callback;
                break;
            }
        }
    }

    /**
     * 设置回调函数
     */
    @Override
    public void setCallbacks(Callback[] callbackArray) {
        Callback[] callbackArray2 = callbackArray;
        CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a cGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a = this;
        this.CGLIB$CALLBACK_0 = (MethodInterceptor)callbackArray[0];
    }

    static void CGLIB$STATICHOOK1() {
        CGLIB$THREAD_CALLBACKS = new ThreadLocal();
        CGLIB$emptyArgs = new Object[0];
        // 加载生成的代理类
        Class<?> clazz = Class.forName("com.daijunfeng.design.pattern.structural.proxy.CGLIBDynamicProxyTest$TicketServiceImpl$$EnhancerByCGLIB$$799f396a");
        Class<?> clazz2 = Class.forName("java.lang.Object");
        // 被代理类的原始方法
        CGLIB$sellTicket$0$Method = ReflectUtils.findMethods(new String[]{"sellTicket", "()V"}, clazz2.getDeclaredMethods())[0];
        // 生成代理类的方法
        CGLIB$sellTicket$0$Proxy = MethodProxy.create(clazz2, clazz, "()V", "sellTicket", "CGLIB$sellTicket$0");
    }
}
```

## 小结

**JDK 动态代理 和 CGLIB 动态代理的区别：**

CGLIB 动态代理采用 ASM 字节码生成框架直接对字节码进行操作，因此代理的创建过程不需要反射操作，理论上，效率比 JDK 动态代理高。但是由于采用继承的方式，所以不能代理被 `final` 修饰的类和方法。

但是，JDK 在后续的版本中也对动态代理进行了优化，提高了性能，所以在实际开发中，两者的性能差距并不是很大，可以根据实际情况选择使用。

总的来说，JDK 动态代理和 CGLIB 动态代理各有优劣，具体使用哪种方式，需要根据实际情况来选择。

**静态代理和动态代理的区别：**

- 静态代理是在编译时生成代理类，而动态代理是在运行时生成代理类。
- 由于静态代理需要实现和代理类相同的接口，所以代理类和真实主题类的耦合度较高，而动态代理不需要实现接口，所以耦合度较低。
- 由于静态代理需要为每一个接口创建一个代理类，所以会产生大量的代理类，而动态代理只需要一个代理类即可。
- 如果改动了接口，那么静态代理类也需要跟着改动，而动态代理不需要。

**代理模式的优点：**

代理模式可以实现对真实主题的访问控制，可以在调用真实主题的方法前后执行一些额外的操作，方便扩展。

**代理模式的缺点：**

代理模式会增加系统的复杂度，增加了系统的开销。

## 使用场景

- 远程代理：为一个对象在不同的地址空间提供局部代表，这样可以隐藏一个对象存在于不同地址空间的事实。例如 RPC。
- 保护代理：控制对一个对象的访问，可以在调用真实主题的方法前后执行一些额外的操作。例如权限控制。
