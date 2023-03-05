# 程序执行流程

在产生对象实例前，经历了哪些流程？

```java
Person per = new Person()
```
以上代码执行前，会先加载父类的构造方法，然后再执行自身的构造方法。

```java
public class B {

    public B() {
        
    }
    
    static {
        System.out.println("静态代码");
    }
    
    public static void main(String[] args) {
        new B();
        new B();
        new B();
    }
}
```
上面的代码中，会先执行静态代码块，且只会执行一次。
```java
public class B  {

    public B() {
        
    }
    
    // 普通代码块
    {
        System.out.println("普通代码");
    }
    
    public static void main(String[] args) {
        new B();
        new B();
        new B();
    }
}
```
上面的代码中，会先执行普通代码块，且每创建一个实例就会执行一次。
```java
public class B extends A {

    public B() {
        
    }
    
    // 普通代码块
    {
        System.out.println("普通代码");
    }

    // 静态代码块
    static {
        System.out.println("静态代码");
    }

    public static void main(String[] args) {
        new B();
    }
}
```
上面代码的执行顺序：  

父类静态代码块 -> 子类静态代码块 -> 父类普通代码块 -> 父类构造方法 -> 子类普通代码块  -> 子类构造方法