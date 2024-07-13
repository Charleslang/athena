# 单例模式

单例模式（Singleton）的目的是为了保证在一个进程中，某个类有且仅有一个实例，并提供一个访问它的全局访问点。

由于这个类在全局只有一个实例，因此，不能让调用方使用 `new` 的方式来创建实例。所以，单例的构造方法必须是 `private`，这样就防止了调用方自己创建实例。但是在类的内部，是可以用一个静态字段来引用唯一创建的实例的。因此，所有单例的实现都包含以下两个相同的步骤：

- 将构造方法私有化，不允许外部直接创建实例
- 通过一个静态方法或者字段返回唯一实例

## 饿汉式

饿汉式是最简单的一种单例实现方式，它在类加载的时候就创建了唯一的实例。因此，饿汉式是线程安全的，但是在某些情况下，可能会造成资源浪费。

### 静态成员变量

```java
public class Singleton {

    private static final Singleton INSTANCE = new Singleton();

    private Singleton() { }

    public static Singleton getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

### 静态代码块

```java
public class Singleton {

    private static final Singleton INSTANCE;

    static {
        INSTANCE = new Singleton();
    }

    private Singleton() { }

    public static Singleton getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

### 枚举

:::tip
枚举的变量底层是通过 `public static final` 来修饰的，类加载就创建了，所以是饿汉式。
:::

```java
public enum Singleton {

    INSTANCE;

    public static void main(String[] args) {
        Singleton instance1 = Singleton.INSTANCE;
        Singleton instance2 = Singleton.INSTANCE;
        System.out.println(instance1 == instance2);
    }
}
```

## 懒汉式

懒汉式是一种更加灵活的单例实现方式，它在第一次使用的时候才创建唯一的实例。因此，懒汉式是线程不安全的，需要在多线程环境下使用时，加上同步锁。

### 成员变量

:::warning
这种实现方式在存在一些问题，解决办法见本小结的后文。
:::

```java
public class Singleton {

    private static Singleton instance;

    private Singleton() { }

    public static synchronized Singleton getInstance2() {
        instance = new Singleton();
        return instance;
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

### 静态内部类

```java
public class Singleton {

    private Singleton() { }

    private static final class InstanceHolder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return InstanceHolder.INSTANCE;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

## 问题

在上面，我们提到了懒汉式的一种实现方式存在问题。那究竟是什么问题呢？

### 反射

我们知道，通过反射可以访问类的私有构造方法，从而创建实例。因此，如果我们使用懒汉式的第一种实现方式，那么就可以通过反射创建多个实例。因此，我们需要在构造方法中判断实例是否已经存在，如果存在，则抛出异常。改进后的代码如下：

```java
public class Singleton {

    private static Singleton instance;

    private Singleton() {
        if (instance != null) {
            throw new RuntimeException("实例已经存在，请通过 getInstance 方法获取");
        }
    }

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

### 反序列化

在反序列化的时候，如果类实现了 `Serializable` 接口，那么就可以通过反序列化创建多个实例。因此，我们需要在类中添加 `readResolve` 方法，返回唯一实例。改进后的代码如下：

```java
public class Singleton implements Serializable {

    private static Singleton instance;

    private Singleton() { }

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    private Object readResolve() {
        return instance;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

为什么需要添加一个 `readResolve` 方法呢？因为在反序列化的时候，会调用 `ObjectInputStream` 的 `readObject` 方法，这个方法会判断类是否有 `readResolve` 方法，如果有，就会调用这个方法，返回一个对象。因此，我们可以在 `readResolve` 方法中返回唯一实例。

![20240713174631](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-07-13/20240713174631.png)

### 线程安全

在懒汉式的第一种实现方式中，我们虽然使用了双重检查锁，但是这种方式在多线程环境下，还是可能会出现问题。因为在多线程环境下，可能会出现指令重排的情况，导致 `instance` 不为 `null`，但是实例还没有初始化完成。因此，我们需要在 `instance` 前面加上 `volatile` 关键字来禁止指令重排。

```java

public class Singleton {

    private static volatile Singleton instance;

    private Singleton() { }

    /**
     * 通过 new 创建对象并不是一个原子操作，实际上是分为以下几步：
     * 1. 分配内存给对象
     * 2. 初始化对象
     * 3. 设置 instance 指向刚分配的内存地址
     * 4. 用户初次访问对象
     * 由于指令重排，可能会出现 1-3-2 的执行顺序
     * 也就是说，instance != null 成立，但是对象还没有初始化完成
     * 这样在多线程环境下，可能会出现问题。所以需要使用 volatile 关键字来禁止指令重排
     */
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```

所以，要使用静态成员变量的懒汉式来实现单例，应该使用下面的代码：

```java
public class Singleton {

    private static volatile Singleton instance;

    private Singleton() { 
        if (instance != null) {
            throw new RuntimeException("实例已经存在，请通过 getInstance 方法获取");
        }
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public Object readResolve() {
        return instance;
    }

    public static void main(String[] args) {
        Singleton instance1 = Singleton.getInstance();
        Singleton instance2 = Singleton.getInstance();
        System.out.println(instance1 == instance2);
    }
}
```
