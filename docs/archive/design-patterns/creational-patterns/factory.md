# 工厂模式

工厂模式是一种创建型设计模式，它提供了一种创建对象的最佳方式。在工厂模式中，我们创建对象而不向客户端公开创建逻辑。

工厂有如下几种类型：

- [简单工厂](#简单工厂)
- [静态工厂](#静态工厂)
- [工厂方法](#工厂方法)
- [抽象工厂](#抽象工厂)

严格来讲，简单工厂和静态工厂并不是工厂模式的一部分，它们只是一种编程习惯，我们可以把它们看成是工厂方法的变种。因此，在很多场景下，我们只需要关注工厂方法和抽象工厂。

本小结用到的产品类是一个简单的日志类 `Logger`，它有两个实现类：`FileLogger` 和 `DatabaseLogger`。

- `Logger.java`

```java
public abstract class Logger {

    public abstract String getName();
}
```

- `FileLogger.java`

```java
public class FileLogger extends Logger {

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }
}
```

- `DatabaseLogger.java`

```java
public class DatabaseLogger extends Logger {

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }
}
```

## 简单工厂

简单工厂是由一个工厂（注意是一个！）对象决定创建出哪一种产品类的实例。在实现方面，由一个工厂类根据传入的参数，动态决定应该创建哪一个产品类的实例。以下是简单工厂的一个示例。

- `SimpleLoggerFactory.java`

```java
public class SimpleLoggerFactory {

    private static final LoggerFactory INSTANCE = new LoggerFactory();

    public static LoggerFactory getInstance() {
        return INSTANCE;
    }

    public Logger getLogger(String name) {
        if ("database".equals(name)) {
            return new DatabaseLogger();
        } else if ("file".equals(name)) {
            return new FileLogger();
        }
        throw new IllegalArgumentException("Unsupported logger type: " + name);
    }
}
```

- `SimpleLoggerFactoryTest.java`

```java
public class LSimpleLoggerFactoryTest {

    private static Logger createLogger(String name) {
        return SimpleLoggerFactory.getInstance().getLogger(name);
    }

    public static void main(String[] args) {
        System.out.println(createLogger("database").getName());
        System.out.println(createLogger("file").getName());
    }
}
```

简单工厂的优点是实现简单，客户端不需要关心对象的创建过程，只需要传入一个参数即可。但是，简单工厂的缺点也很明显，它违背了开闭原则，因为每次添加新的产品类都需要修改工厂类的代码。当系统中的具体产品类不断增多时候，可能会出现要求工厂类根据不同条件创建不同实例的需求．这种对条件的判断和对具体产品类型的判断交错在一起，很难避免模块功能的蔓延，对系统的维护和扩展非常不利。因此，简单工厂只适用于产品种类相对较少且不会经常增加的情况。

## 静态工厂

静态工厂是简单工厂的一种变种，它将工厂方法声明为静态方法，从而不需要创建工厂类的实例。以下是静态工厂方法的一个示例。

- `StaticLoggerFactory.java`

```java
public class StaticLoggerFactory {

    public static Logger getLogger(String name) {
        if ("database".equals(name)) {
            return new DatabaseLogger();
        } else if ("file".equals(name)) {
            return new FileLogger();
        }
        throw new IllegalArgumentException("Unsupported logger type: " + name);
    }
}
```

- `StaticLoggerFactoryTest.java`

```java
public class StaticLoggerFactoryTest {

    public static void main(String[] args) {
        System.out.println(StaticLoggerFactory.getLogger("database").getName());
        System.out.println(StaticLoggerFactory.getLogger("file").getName());
    }
}
```

## 工厂方法

工厂方法（Factory Method）是一种创建型设计模式，它在父类中提供一个创建对象的方法，允许子类决定实例化对象的类型。工厂方法的目的是使得创建对象和使用对象是分离的，并且客户端总是引用抽象工厂和抽象产品。

工厂方法涉及到 4 个角色：

- 抽象产品（Product）：定义产品的接口
- 具体产品（Concrete Product）：实现产品接口
- 抽象工厂（Creator）：定义创建产品的接口
- 具体工厂（Concrete Creator）：实现创建产品的接口

以下是工厂方法的一个示例。

- `LoggerFactory.java`

```java
public interface LoggerFactory {

    Logger getLogger();
}
```

- `FileLoggerFactory.java`

```java
public class FileLoggerFactory implements LoggerFactory {

    @Override
    public Logger getLogger() {
        return new FileLogger();
    }
}
```

- `DatabaseLoggerFactory.java`

```java
public class DatabaseLoggerFactory implements LoggerFactory {

    @Override
    public Logger getLogger() {
        return new DatabaseLogger();
    }
}
```

- `FactoryMethodTest.java`

```java
public class FactoryMethodTest {

    public static void main(String[] args) {
        LoggerCreator loggerCreator = new LoggerCreator(new DatabaseLoggerFactory());
        Logger logger = loggerCreator.createLogger();
        System.out.println(logger.getName());

        loggerCreator = new LoggerCreator(new FileLoggerFactory());
        logger = loggerCreator.createLogger();
        System.out.println(logger.getName());
    }

    public static class LoggerCreator {
        private LoggerFactory loggerFactory;

        public LoggerCreator(LoggerFactory loggerFactory) {
            this.loggerFactory = loggerFactory;
        }

        public Logger createLogger() {
            return loggerFactory.getLogger();
        }
    }
}
```

不知道你是否发现，工厂方法模式和简单工厂模式的区别在于，简单工厂模式只有一个工厂类，而工厂方法模式有多个工厂类，每个工厂类负责创建一种产品，这样做的好处是允许创建产品的代码独立地变换，而不会影响到调用方。工厂方法模式是对简单工厂模式的进一步抽象和拓展。但是呢，工厂方法模式也有缺点，就是每次添加新的产品都需要添加一个新的具体工厂类（实现抽象工厂）和一个新的具体产品类（实现抽象产品），这样会导致类的个数成倍增加，增加了系统的复杂度，有必要这样做吗？因此，对于很多简单场景，我们完全可以简单工厂或者静态工厂来实现。

## 抽象工厂

抽象工厂（Abstract Factory）是一种创建型设计模式，它提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。抽象工厂通常用于创建产品族，产品族是一组位于不同等级结构中的相关产品，通常具有共同的主题。

例如，我现在开了一家男装店，店里面可以同时销售衬衫、裤子。这两种产品都有不同的款式，比如衬衫有长袖和短袖，裤子有常规款和加绒款。这两种产品就构成了一个产品族，而每一种衣服的款式就构成了一个产品等级结构。

**衬衫抽象产品：**

- `Shirt.java`

```java
public abstract class Shirt {

    public abstract String getName();
}
```

**衬衫具体产品：**

- `LongSleeveShirt.java`

```java
public class LongSleeveShirt extends Shirt {

    @Override
    public String getName() {
        return "长袖衬衫";
    }
}
```

- `ShortSleeveShirt.java`

```java
public class ShortSleeveShirt extends Shirt {

    @Override
    public String getName() {
        return "短袖衬衫";
    }
}
```

**裤子抽象产品：**

- `Pants.java`

```java
public abstract class Pants {

    public abstract String getName();
}
```

**裤子具体产品：**

- `NormalPants.java`

```java
public class NormalPants extends Pants {

    @Override
    public String getName() {
        return "常规款";
    }
}
```

- `VillusPants.java`

```java
public class VillusPants extends Pants {

    @Override
    public String getName() {
        return "加绒款";
    }
}
```

**抽象工厂：**

- `ClothesFactory.java`

```java
public interface ClothesFactory {

    Shirt createShirt();

    Pants createPants();
}
```

**具体工厂：**

- `SummerClothesFactory.java`

```java
public class SummerClothesFactory implements ClothesFactory {

    @Override
    public Shirt createShirt() {
        return new ShortSleeveShirt();
    }

    @Override
    public Pants createPants() {
        return new NormalPants();
    }
}
```

- `WinterClothesFactory.java`

```java
public class WinterClothesFactory implements ClothesFactory {

    @Override
    public Shirt createShirt() {
        return new LongSleeveShirt();
    }

    @Override
    public Pants createPants() {
        return new VillusPants();
    }
}
```

**测试代码：**

- `AbstractFactoryTest.java`

```java
public class AbstractFactoryTest {

    public static void main(String[] args) {
        ClothesFactory clothesFactory = new SummerClothesFactory();
        Shirt shirt = clothesFactory.createShirt();
        Pants pants = clothesFactory.createPants();
        System.out.println(shirt.getName() + " " + pants.getName());

        // 切换工厂。只需要把 new SummerClothesFactory() 改成 new WinterClothesFactory() 即可
        clothesFactory = new WinterClothesFactory();
        shirt = clothesFactory.createShirt();
        pants = clothesFactory.createPants();
        System.out.println(shirt.getName() + " " + pants.getName());
    }
}
```

可以发现，其实抽象工厂模式就是工厂方法模式的升级版，它允许在工厂方法的基础上创建多个产品。但是，它的缺点和工厂方法模式是一样的，每次添加新的产品都需要添加一个新的具体工厂类和多个新的具体产品类。同时，另一个缺点是，抽象工厂模式的扩展性并不好，如果要增加一个新的产品族（在工厂中创建其它产品，例如夹克），那么所有的工厂实现类都需要进行修改，这显然违背了开闭原则。
