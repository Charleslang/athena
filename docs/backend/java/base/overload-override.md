# 重载与重写

**重载（Overload）**

在同一类中，如果几个方法的方法名相同，但参数的顺序、类型、个数任意一个不同，则就是重载。但是 以下两个不是重载：
```java
// JDK 认为，以下两个方法是相同的
public void print(String... args) {
    
}
public void print(String[] args) {
    
}
```
:::tip 注意
重载与方法返回值和方法的参数名无关。即无需看返回值和参数名，只看方法名和参数类型即可。
:::

**重写（Override）**  

子类有父类相同方法，即子类的方法名和参数列表（参数个数，参数顺序，参数类型三者都相同）都和父类的某个方法完全相同，就叫重写。可在重写的方法上加上注解 `@Override`。

:::tip 注意
- 重写与方法返回值有关（即返回值必须相同（或子类）才算重写）。  
- 子类的修饰符不能比父类的方法更严格（比如父类的 method1() 方法为 public，而子类的 method1() 方法却是 private（只能大于等于 public），这是不行的）。  
- 构造方法不能被重写（因为构造方法不能被继承，只有可以被继承的方法才能重写）。  
- 子类不能重写父类的 private、final、static 修饰的方法。  
- 子类重写的方法抛出的异常，不能大于父类的异常。
- 如果子类没有重写父类的方法，那么可以通过 `this.方法名` 或 `super.方法名` 来调用父类的方法。  
- 默认情况下，子类的所有构造方法都会先调用父类的无参构造，即 `super()`。如果子类有一个无参构造函数，并且子类的无参构造函数没有调用父类的有参构造函数，那么，使用子类的无参构造创建对象时，就会先调用父类的无参构造；如果子类存在有参构造，且子类的有参构造没有调用父类的有参构造，那么，在使用子类的有参构造创建对象时，会先调用父类的无参构造。
:::

```java
public class Test {
    
}

class Son extends Father {

    public void x1(int a) {
        
    }
    
    // 重载父类的 x2
    public void x2(int a) {
        
    }
    
    // 重写父类的 x3
    public Father x3(int a) {
        return new Father();
    }
    
    // 重写父类的 x3，此处的返回值可以是 Father 的子类 Son
    // public Son x3(int a) {
    //    return new Son();
    // }
}

class Father {
    public void x1() {
        
    }
    
    public void x2(int a) {
        
    }
    
    public Father x3() {
        return new Father();
    }
}
```
