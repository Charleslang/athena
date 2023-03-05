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
  Field id = clazz.getDeclaredField("address");
  // 给字段赋值 (person.setAddress("成都"))
  id.set(person, "成都");

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

把我们写好的 java 文件，通过 javac 命令编译成字节码，也就是我们常说的 .class 文件。而我们所说的类加载过程即是指 JVM 虚拟机把 .class 文件中类信息加载进内存（当执行 java.exe 时会执行步骤），并进行解析生成对应的 class 对象的过程。加载到内存中类就称为运行时类，这个类就作为 `java.lang.Class` 的一个实例。`java.lang.Class` 的一个实例就对应一个运行时类。加载大内存中的运行时类会缓存一段时间，在此时间内，通过反射获取到的该运行时类都是同一个对象。

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
  Class<?> aClass = Class.forName("reflect1.entity.Person");
  ```

- 方式四  

  使用 ClassLoader。
  ```java
  ClassLoader classLoader = Test1.class.getClassLoader();
  Class<?> aClass1 = classLoader.loadClass("reflect1.entity.Person");
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

## 动态代理
先来看一下静态代理：
```java
interface A {
    void doSome();
}
// 代理类
class ProxyA implements A {

    private A a;

    public ProxyA(A a) {
        this.a = a;
    }

    @Override
    public void doSome() {
        System.out.println("做一些前置工作");
        a.doSome();
        System.out.println("做一些后续工作");
    }
}

// 被代理类
class B implements A {

    @Override
    public void doSome() {
        System.out.println("B dosomething");
    }
}
public class Test1 {
    public static void main(String[] args) {
        B b = new B();
        ProxyA proxyA = new ProxyA(b);
        proxyA.doSome();
    }
}
```
静态代理的缺点就是，代理类和被代理类在编译期间就确定了。

---

实现动态代理要先解决的问题：  

1. 如何根据被代理类来动态创建一个代理类的对象
2. 调用代理类的方法时，如何调用被代理类的同名方法

```java
interface Factory {
    String say();
}
// 被代理类
class Person implements Factory {

    @Override
    public String say() {
        return "say hello";
    }
}

class ProxyFactory {
    // 动态创建代理类对象
    public static Object getInstance(Object obj) {
        MyInvocationHandler myInvocationHandler = new MyInvocationHandler();
        myInvocationHandler.bind(obj);
        return Proxy.newProxyInstance(obj.getClass().getClassLoader(),
                obj.getClass().getInterfaces(), myInvocationHandler);
    }
}
class MyInvocationHandler implements InvocationHandler {

    // 需要使用被代理类的对象进行赋值
    private Object obj;

    public void bind(Object obj) {
        this.obj = obj;
    }

    // 当通过代理类的对象调用方法时，会自动调用下列方法
    // 因此，将被代理类要执行的方法方在下面的方法中
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // method 即为代理类对象的方法，也是被代理类要执行的方法
        Object returnValue = method.invoke(obj, args);
        return returnValue;
    }
}
public class Test2 {
    public static void main(String[] args) {
        Person person = new Person();
        Factory instance = (Factory)ProxyFactory.getInstance(person);
        String say = instance.say();
        System.out.println(say);
    }
}
```
