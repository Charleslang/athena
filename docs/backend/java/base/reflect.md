# 反射

- `Person.java`  

  ```java
  public class Person {
      private int id;
      private String name;
      private String email;
      public String address;

      public Person() { }

      private Person(int id) {
          this.id = id;
      }

      public Person(int id, String name, String email) {
          this.id = id;
          this.name = name;
          this.email = email;
      }

      public void show() {
          System.out.println("show");
      }

      private String say(String str) {
          System.out.println("say 被调用");
          return str;
      }

      public int add(int x) {
          return x + 1;
      }

      // 省略 get / set，toString
  }
  ```

- `Test.java`

  ```java
  // 获取字节码对象
  Class<Person> clazz = Person.class;
  // 找到一个构造器
  // getConstructor：返回指定参数类型、具有 public 访问权限的构造函数
  Constructor<Person> constructor = clazz.getConstructor(int.class, String.class, String.class);
  // 通过构造器创建对象
  Person person = constructor.newInstance(1, "zs", "123@qq.com");


  // 获取类的属性字段
  Field address = clazz.getDeclaredField("address");
  // 给字段赋值 (person.setAddress("成都"))
  address.set(person, "成都");

  // 获取类中的方法
  Method show = clazz.getDeclaredMethod("show");
  // 调用 person 对象的 show 方法
  show.invoke(person);
  System.out.println(person);

  // 通过反射调用类的私有结构（属性、方法、构造器）
  // 调用私有构造器
  // getDeclaredConstructor：返回指定参数类型、所有声明的（包括 private）构造函数
  Constructor<Person> constructor1 = clazz.getDeclaredConstructor(int.class);
  // 调用私有结构时，必须将此字段设为 true
  constructor1.setAccessible(true);
  Person person1 = constructor1.newInstance(1001);
  System.out.println(person1);
  // 调用私有属性（不通过 set / get）
  Field name = clazz.getDeclaredField("name");
  name.setAccessible(true);
  name.set(person1, "ww");
  System.out.println(person1);
  // 调用私有方法（say 方法有一个 String 类型的参数）
  Method say = clazz.getDeclaredMethod("say", String.class);
  say.setAccessible(true);
  // 传入参数（person1.say("say hello")）, 并接收 say 方法的返回值
  Object hello = say.invoke(person1, "say hello");
  System.out.println(hello);
  ```

:::tip 思考
有了反射之后，还需要自己 new 对象吗？建议自己 new 对象。

什么时候使用反射？在编译时，不知道类的具体结构，只有在运行时才知道，那么这时就可以使用反射。

反射与封装性是否矛盾？不矛盾。

反射的特征？动态性。
:::


**java.lang.Class**  

类的加载过程（面试题）：

把我们写好的 java 文件，通过 javac 命令编译成字节码，也就是我们常说的 .class 文件。而我们所说的类加载过程即是指 JVM 虚拟机把 .class 文件中类信息加载进内存（当执行 java.exe 时会执行步骤），并进行解析生成对应的 class 对象的过程。加载到内存中的类就称为运行时类，这个类就作为 `java.lang.Class` 的一个实例。`java.lang.Class` 的一个实例就对应一个运行时类。加载到内存中的运行时类会缓存一段时间，在此时间内，通过反射获取到的该运行时类都是同一个对象。

**获取 Class 实例的方式**

- 方式一  

  直接通过类名获取。
  ```java
  Class<Person> clazz = Person.class;
  ```

- 方式二  

  通过运行时的对象。
  ```java
  Person person = new Person();
  Class<? extends Person> clazz = person.getClass();
  ```

- 方式三  

  调用 Class 类的 `forName(全类名)`。
  ```java
  Class<?> clazz = Class.forName("reflect1.entity.Person");
  ```

- 方式四  

  使用 ClassLoader。
  ```java
  ClassLoader classLoader = Test1.class.getClassLoader();
  Class<?> clazz = classLoader.loadClass("reflect1.entity.Person");
  ```

  ```java
  /* 加载配置文件 */
  Properties props = new Properties();
  //        FileInputStream inputStream = new FileInputStream("common2\\jdbc.properties");
  //        props.load(inputStream);
  //
  //        String username = props.getProperty("username");
  //        String password = props.getProperty("password");
  //        System.out.println(username + "," + password);

  /* ---------------------- */
  ClassLoader classLoader = Test2.class.getClassLoader();
  // 以 src 为相对路径
  InputStream resourceAsStream = classLoader.getResourceAsStream("jdbc1.properties");
  props.load(resourceAsStream);
  String username = props.getProperty("username");
  String password = props.getProperty("password");
  System.out.println(username + "," + password);
  ```

**创建运行时对象**

使用 `newInstance()` 方法。
```java
Class<Person> personClass = Person.class;
// 实际上是调用无参构造
Person person = personClass.newInstance();
System.out.println(person);
```

**获取方法的信息**

```java
Class<Person> personClass = Person.class;
// 该方法只能获取当前类及其父类的 public 属性
Field[] fields = personClass.getFields();
// 获取本类中所有的字段（不含父类）
Field[] declaredFields = personClass.getDeclaredFields();
for (Field declaredField : declaredFields) {
    // 获取该字段的权限修饰符
    // 返回 int 类型，因为在 Modifier 这个类中定义了权限修饰符的常量
    // 如果是默认的数据类型（即没有权限修饰符），则返回 0
    int modifiers = declaredField.getModifiers();
    // 打印权限修饰符的名称（如 private）
    System.out.println(Modifier.toString(modifiers));
    // 得到数据类型
    Class<?> type = declaredField.getType();
    System.out.println(type.getName());
    // 得到变量名
    declaredField.getName();
}

// 获取当前类及其父类中所有的公共方法
Method[] methods = personClass.getMethods();
// 获取当前类的所有方法（不含父类）
Method[] declaredMethods = personClass.getDeclaredMethods();
for (Method method : declaredMethods) {
    // 获取方法的所有注解
    Annotation[] annotations = method.getAnnotations();
    // 获取方法的权限修饰符
    System.out.println(Modifier.toString(method.getModifiers()));
    // 获取方法返回值类型
    System.out.println(method.getReturnType().getName());
    // 获取方法名
    String name = method.getName();
    // 获取所有形参（无法得到形参的名字）
    Class<?>[] parameterTypes = method.getParameterTypes();
    for (Class<?> parameterType : parameterTypes) {
        System.out.println(parameterType.getName());
    }
    // 获取方法的所有异常
    Class<?>[] exceptionTypes = method.getExceptionTypes();
    // 获取该类中的公共构造器（不含父类）
    Constructor<?>[] constructors = personClass.getConstructors();
    // 获取当前类所有的构造器（不含父类）
    Constructor<?>[] declaredConstructors =personClass.getDeclaredConstructors();
}
```

## 静态代理
```java
interface IUserDAO {
    void save();
}

// 被代理类
class UserDAO implements IUserDAO {

    @Override
    public void save() {
        System.out.println("保存用户");
    }
}

// 代理类
class UserDAOProxy implements IUserDAO {

    private IUserDAO target;

    public UserDAOProxy(IUserDAO target) {
        this.target = target;
    }

    @Override
    public void save() {
        System.out.println("开启事务");
        target.save();
        System.out.println("关闭事务");
    }
}

public class Test {
    public static void main(String[] args) {
        UserDAO target = new UserDAO();
        UserDAOProxy userDAOProxy = new UserDAOProxy(target);
        userDAOProxy.save();
    }
}
```
这种代理方式需要代理对象和目标对象实现一样的接口。优点是可以在不修改目标对象的前提下扩展目标对象的功能，但是缺点也很明显，如下：

- 冗余。由于代理对象要实现与目标对象一致的接口，会产生过多的代理类。
- 不易维护。一旦接口增加方法，目标对象与代理对象都要进行修改。

## JDK 动态代理

动态代理利用了 JDK 提供的 API，动态地在内存中构建代理对象，从而实现对目标对象的代理功能。动态代理又被称为 JDK 代理或接口代理。

静态代理与动态代理的主要区别：

- 静态代理在编译时就已经实现，编译完成后的代理类是一个 .class 文件
- 动态代理是在运行时动态生成的，即编译完成后的代理类没有 .class 文件，而是在运行时动态生成类字节码，并加载到 JVM 中
- 由于 JDK 的动态代理是基于接口的，所以要求目标对象必须实现接口，否则不能使用动态代理

```java
interface IUserDAO {
    void save();
}

// 被代理类
class UserDAO implements IUserDAO {

    @Override
    public void save() {
        System.out.println("保存用户");
    }
}

class UserInvocationHandler implements InvocationHandler {

    // 需要使用被代理类的对象进行赋值
    private Object target;

    public UserInvocationHandler(Object target) {
        this.target = target;
    }

    // 当通过代理类的对象调用方法时，会自动调用下列方法
    // 因此，需要将被代理类要执行的方法放在下面的方法中进行调用
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("开启事务");
        
        // method 即为代理类对象的方法，也是被代理类要执行的方法
        Object returnValue = method.invoke(target, args);
        
        System.out.println("关闭事务");
        
        return returnValue;
    }
}

class UserDAOProxyFactory {
    // 动态创建代理类对象
    public static Object getProxyInstance(Object target) {
        // 第一个参数: 目标对象的类加载器
        // 第二个参数: 目标对象实现的接口
        // 第三个参数: 代理类的处理器
        return Proxy.newProxyInstance(target.getClass().getClassLoader(),
                target.getClass().getInterfaces(), new UserInvocationHandler(target));
    }
}

public class Test {
    public static void main(String[] args) {
        UserDAO target = new UserDAO();
        System.out.println(target); // 目标对象
        IUserDAO proxy = (IUserDAO)UserDAOProxyFactory.getProxyInstance();
        System.out.println(proxy); // 代理对象
        proxy.save();
    }
}
```
:::tip 参考
[Java三种代理模式：静态代理、动态代理和cglib代理](https://segmentfault.com/a/1190000011291179)
:::

## CGLib 动态代理

:::tip 参考
[cglib](https://github.com/cglib/cglib)
:::

cglib（Code Generation Library）是一个第三方代码生成类库，运行时在内存中动态生成一个子类对象从而实现对目标对象功能的扩展。它是用于生成和转换 Java 字节码的高级 API。AOP、测试、数据访问框架使用它来生成动态代理对象和拦截字段访问。

**cglib 特点:**

- JDK 的动态代理有一个限制，就是使用动态代理的对象必须实现一个或多个接口。如果想代理没有实现接口的类，就可以使用 cglib。
- cglib 是一个强大的高性能的代码生成包，它可以在运行期扩展 Java 类与实现 Java 接口。它广泛的被许多 AOP 的框架使用，例如Spring AOP 和 dynaop，为他们提供方法的 interception（拦截）。
- cglib 包的底层是通过使用一个小而快的字节码处理框架 ASM，来转换字节码并生成新的类。不鼓励直接使用 ASM，因为它需要你对 JVM内部结构包括 class 文件的格式和指令集都很熟悉。
- cglib 与 JDK 动态代理最大的区别就是，JDK 动态代理的对象必须实现一个或多个接口；cglib 代理的对象则无需实现接口，能达到代理类无侵入。

使用 cglib 需要引入 cglib 的 jar 包，如果你已经有 spring-core 的 jar 包，则无需额外引入 cglib，因为 spring 中包含了 cglib。

- 引入依赖

```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```

- 代码测试

```java
// 被代理类
class UserDAO {
    public void save() {
        System.out.println("保存用户");
    }
}

class ProxyFactory implements MethodInterceptor {

    // 维护一个目标对象
    private Object target;
    
    public ProxyFactory(Object target) {
        this.target = target;
    }
    
    // 为目标对象生成代理对象
    public Object getProxyInstance() {
        // 增强类
        Enhancer en = new Enhancer();
        // 设置父类
        en.setSuperclass(target.getClass());
        // 设置回调函数
        en.setCallback(this);
        // 创建子类对象代理
        return en.create();
    }

    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("开启事务");
        
        // 执行目标对象的方法
        Object returnValue = method.invoke(target, args);
        
        System.out.println("关闭事务");
        
        return returnValue;
    }
}

public class TestProxy {

    public static void main(String[] args) {
        // 目标对象
        UserDAO target = new UserDAO();
        System.out.println(target.getClass());
        // 代理对象
        UserDAO proxy = (UserDAO) new ProxyFactory(target).getProxyInstance();
        System.out.println(proxy.getClass());
        // 执行代理对象方法
        proxy.save();
    }
}
```

**小结：**

- 静态代理实现较简单，只要代理对象对目标对象进行包装，即可实现增强功能。但静态代理只能为一个目标对象服务，如果目标对象过多，则需要创建很多代理类。
- JDK 动态代理需要目标对象实现业务接口，代理类需实现 `InvocationHandler` 接口。
- 静态代理在编译时产生 class 字节码文件，可以直接使用，效率高。
- JDK 动态代理必须实现 `InvocationHandler` 接口，通过反射代理方法，比较消耗系统性能，但可以减少代理类的数量，使用更灵活。
- cglib 代理无需实现接口，通过生成类字节码实现代理，比反射稍快，不存在性能问题，但 cglib 会继承目标对象，需要重写方法，所以目标对象不能被 `final` 类，且目标方法需要符合重写的原则。
