# 原型模式

用一个已经创建的实例作为原型，通过复制这个原型对象来创建一个和原型一样的新对象。

原型模式包含如下角色：

- `Prototype`: 抽象原型类，声明克隆方法。
- `ConcretePrototype`: 具体原型类，实现克隆方法。
- `Client`: 客户类，使用具体原型类中的克隆方法创建一个新的对象。

Java 中的 `Object` 类提供了一个 `clone()` 方法，可以将一个对象复制一份，但是需要实现 `Cloneable` 接口。Cloneable 接口就是一个抽象原型类，而实现了这个接口的类就是具体原型类。

```java
public class User implements Cloneable {

    private String userName;
    private String password;


    @Override
    public User clone() {
        try {
            return (User) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    public static void main(String[] args) {
        User user = new User();
        user.userName = "daijunfeng";
        System.out.println(user.clone() == user);
    }
}
```

原型模式适用于创建重复的对象，同时又能保证性能，它提供了一种创建对象的最佳方式。优点是简化对象的创建过程，通过克隆的方式创建对象，而不是通过 `new` 关键字。缺点是需要为每一个类配备一个克隆方法，这对全新的类来说不是很难，但对已有的类进行改造时，需要修改其源代码，违背了开闭原则。

原型模式多用于创建复杂的或者构造耗时的实例，因为这种情况下，复制一个已经存在的实例可以使程序运行更高效。

需要注意的是，克隆是浅拷贝，如果需要深拷贝需要额外处理。
