# 面向对象

## Object 类 
Object 是所有类的父类。Object 类中只有一个无参构造。接下来，探讨一下该类中存在的方法。

**1. equals()**  

判断两个对象是否相等。源码如下：
```java
public boolean equals(Object obj) {
    return (this == obj);
}
```
通过源码可以发现，实际上它就是使用的 `==`。String、Date、File、包装类都重写了 `equals( )` 方法，它们比较的不是地址，而是对象的内容是否相同。

接下来说一下 `==`，`==` 具有运算符的性质（如自动类型转换）：
```java
int a = 1, b = 1;
double c = 1.0;
char d = 1, e = 'A', f = 65;
System.out.println(a == b); // true
System.out.println(a == c); // true（自动类型转换）
System.out.println(a == d); // true 本身就是将数字 1 赋值给了 d（所以 d 转为 int 时得到的结果就是 1）
System.out.println(e == f); // true（char 使用的是 ASCII 码）

// -----------------------------
int a = 1;
char b = 1; // 本身就是将数字 1 赋值给了 b（所以 b 转为 int 时得到的结果就是 1）
char c = '1'; // 字符 '1' 的 ASCII 码
System.out.println(b+1);
System.out.println(c - '0'); // char to int
System.out.println(a + '0'); // int to char
System.out.println(Character.getNumericValue(a));// char to int
```

:::warning == 和 equals( ) 的区别
1. `==` 是比较运算符，而 `equals()` 是方法
2. `==` 可以使用在基本类型和引用类型中。对于基本类型，比较的是值是否相等（会自动进行类型转换）；而引用类型比较的是地址。所以，使用 `==` 时，必须保证符号左右两边能够进行类型转换。
3. `equals()` 是 `Object` 类中的方法，如果该方法没有被重写，则默认使用的是 `==`。**我们看到 String 可以调用 `equals()` 是因为它重写了该方法，久而久之，人们就形成了 equals 是比较值的错误观点。**
:::


自定义类中重写 `equals()`：
```java
public class Person {
    private int age;
    private String name;
    
    // 重写原则：比较对象的内容是否相同
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof Person) {
            Person p = (Person)obj;
            // 比较每个属性
            if (this.age = p.age && this.name.equals(p.name)) {
                return true;
            }
        }
        return false;
    }
}

// 推荐使用自动生成的 equals()
```
**2. toString()**  

该方法也是在 `Object` 类中定义的，所以，所有对象都会有该方法。该方法默认打印类的全类名和地址。当我们打印对象时，实际上是去调用该对象的 `toString()` 方法（如果由系统自动调用，则会判断该对象是否为 null（避免 NPE）；如果我们显示地调用，则系统不会自动判断该对象是否为 null（可能引起 NPE）），`println` 的内部源码如下。
```java
return (obj == null) ? "null" : obj.toString();
```
String、Date、File、包装类等都重写了 `toString()` 方法。

## 包装类
包装类（Wrapper）也叫封装类，它是针对 8 中基本类型的引用类型，有了类的特点。
|基本数据类型|包装类|说明|
|---|---|---|
|`byte`|`Byte`|父类为 `Number`|
|`short`|`Short`|父类为 `Number`|
|`int`|`Integer`|父类为 `Number`|
|`long`|`Long`|父类为 `Number`|
|`float`|`Float`|父类为 `Number`|
|`double`|`Double`|父类为 `Number`|
|`boolean`|`Boolean`||
|`char`|`Character`||

**基本数据类型、包装类与 String 之间的相互转换：** 

其中，需要额外注意 Boolean 的包装类：

```java
Integer a = new Integer(123);
Integer b = new Integer("123");
Integer c = new Integer("123aa"); // 报错
Float f1 = new Float(12.3);
Float f2 = new Float(12.3f);
Float f2 = new Float("12.3f");
Boolean b1 = new Boolean(true);
Boolean b2 = new Boolean("true");
Boolean b3 = new Boolean("tRue"); // true，会忽略大小写
Boolean b5 = new Boolean("tRue12"); // false

/* ----------- Boolean 源码 ------------ */
public Boolean(String s) {
    this(parseBoolean(s));
}
public static boolean parseBoolean(String s) {
    return ((s != null) && s.equalsIgnoreCase("true"));
}
```

:::warning 注意
包装类的默认值为 `null`。
:::

**包装类面试题**

```java
Object o1 = true ? new Integer(1) : new Double(2.0);
System.out.println(o1); // 1.0 （请见三目运算符）

/* ------------------------------------------ */

Object o1;
if (true) {
    o1 = new Integer(1);
} else {
    o1 = new Double(2.0);
}
System.out.println(o1); // 1

/* --------------------------------------- */
Integer a = 128;
Integer b = 128;
System.out.println(a == b); // false
// 因为在 Integer 中，会有一个缓存（-128 - 127）。
// 当数字超出这个范围时，每次都会创建新的对象。
```

## 内部类
内部类可以存在一个类中、方法中、代码块中。内部类可以用 `static` 修饰。在方法或代码块中内部类被称为局部内部类。  

局部内部类使用外部的变量时，此变量必须用 `final` 修饰（JDK8 以后可以不显示指定 `final`），并且局部内部类只能使用默认的修饰符。
```java
public class Test1 {
    
}
class Test2 {
    class Test3 {
        
    }
    
    public void method() {
        class Test5 {
            
        }
    }
    
    {
        class Test6 {
            
        }
    }
}
```
```java
public class LocalInnerClass {
    public void test1() {
        // 编译报错
//        static class Inner1 { }
        // 编译报错
//        private class Inner1 {}
        // 编译报错
//        protected class Inner1 {}
        // 编译报错
//        public class Inner1 {}
        // 正常编译
        class Inner1 {}
    }
}
```


## 封装

## 继承

当有多个类有共同的属性或方法时，可以考虑使用继承，把这些共同的部分放在父类中。但是，父类的私有属性不能被子类直接访问，应该在子类中通过 `get/setProperty()` 的方式获取。  

父类的公共方法可以被子类直接调用。因为子类直接调用某个方法时，会先在子类本身中查找，如果有，则使用；否则使用父类的。

```java
a();
this.a(); // 和 a() 等价
```
```java
public class Test2 {
    int a = 1;
    private int b = 2;

    public int getB() {
        return b;
    }
}

class SubTest1 extends Test2 {

    int a = 3;

    public static void main(String[] args) {
        SubTest1 subTest1 = new SubTest1();
        System.out.println(subTest1.a); // 3
        System.out.println(subTest1.getB()); // 2
    }
}
```

如果子类和父类中有相同的方法，那么就称子类重写了父类的方法，如果想要调用父类的方法，则必须加上 `super` 关键字。父类的构造方法也不能被子类继承。需要通过 `super()` 来调用，且只能放在第一行。

**调用父类的构造方法**  

- `Person.java`

  ```java
  public class Person {
      private String name;
      private String sex;
      private int age;
      
      public Person() {
          
      }
      
      public Person(String name, String sex, int age) {
          this.name = name;
          this.sex = sex;
          this.age = sge;
      }
  }
  ```

- `Student.java`

  ```java
  public class Student extends Person {
      private int tel;

      public Student() {
          
      }
      
      public Student(String name, String sex, int age, int tel) {
        // 调用父类的有参构造方法，且只能放在第一行
        super(name, sex, age);
        this.tel = tel;
      }
  }
  ```
  :::warning 注意
  构造方法不能直接通过方法名调用，需要使用 `new` 关键字。但是，如果在构造方法中调用其它的构造方法，可以不用使用 `new`，直接使用 `this()` 即可，且 `this()` 只能放在当前方法的第一行。需要注意的是，多个构造方法之间不能循环调用。
  :::

  ```java
  public class Student extends Person {
      // ...
      public Student() {
          // 错误，不能直接调用
          // Student(……);
          // 正确，且只能放在第一行
          this("123", "男", 18);
      }
      
      public Student(String name, String sex, int age) {
        
      }
  }
  ```

## 多态

什么是多态？简单来讲，必须根据上下文才能知道真实含义的就是多态。如 “打” 字，我们只说 “打” 时，并不知道它的意思，但是，如果我们像这样来说（如 打水，打篮球，打架），那么“打”字就有了具体的含义。

```java
public class S extends Person {
    private String name;
    private String sex;
    private int age;
    
    public Person() {
        
    }
    
    public Person(String name, String sex, int age) {
        this.name = name;
        this.sex = sex;
        this.age = sge;
    }
}

// 下面这句话就是多态
// 其实也可以理解为小类型向大类型自动转换
Person per = new S();
// 强制转换
S s = (s) (new Person());
```
**多态的注意事项**  

- 当使用多态调用方法时，会优先调用子类的方法，如果子类没有，则再调用父类的方法（如果有的话）
- 使用多态，不能调用子类中特有的方法
- 多态性只适用于方法，不适用于属性
- 有了多态，可以减少方法的重载
- 多态是运行时行为（晚绑定、动态绑定）

**多态总结：**  

1. **调用方法时：编译看左边；运行看右边**   
2. **调用属性时：编译和运行都看左边**

## 抽象类
在继承时，我们说到，如果几个类有完全相同的属性和方法，那么，这些都可以放到父类中，然后继承即可。但是，如果我们的方法相同（返回值，方法名，方法的参数都相同），但是方法体不同，这样就不能使用继承了，那么这时就可以使用抽象方法。  

什么是抽象方法？没有方法体，用 `abstract` 修饰，且抽象方法只能放在在抽象类或接口中。
```java
public abstract void print();
```
什么是抽象类？其实就和普通的父类差不多，只不过类上面要加 `abstract` 来修饰，且抽象类中可以（不是必须）含有抽象方法，就是这样。下面，让我们感受一下抽象类和普通的父类的区别。

- 普通父类  

    ```java
    public class Person {

        private String name;
        private String sex;
        private int age;
        
        public Person() {
            
        }
        
        public Person(String name, String sex, int age) {
            this.name = name;
            this.sex = sex;
            this.age = sge;
        }
    }
    ```

- 抽象类

    ```java
    public abstract class Person {

        private String name;
        private String sex;
        private int age;
        
        public Person() {
            
        }
        
        public Person(String name, String sex, int age) {
            this.name = name;
            this.sex = sex;
            this.age = sge;
        }
        
        // 抽象方法
        public abstract void print();
    }
    ```

:::tip 提示
抽象类也可以被继承。抽象类不能被实例化（即 `new`）。
:::

抽象类为什么不能被实例化？简单来讲，如果被实例化了，然后调用了它存在的抽象方法，就会报错，因为抽象方法没有方法体。  

既然抽象类不能被实例化，那为什么抽象类中还有构造方法呢？因为这样可以便于子类实例化时调用。  

包含抽象方法的类一定是抽象类，抽象类中不一定含有抽象方法。  

如果子类实现了抽象类的所有抽象方法，那么此子类可以被实例化；否则，该子类也是一个抽象类，必须使用 `abstract` 修饰该类。  

`abstract` 不能用来修饰属性、构造器等结构，不能用来修饰私有方法、静态方法、final 修饰的方法（类等）。  

抽象类中可以有 `main` 方法。

匿名抽象子类：
```java
public class Test {
    public static void main(String[] args) {
        // 用到了多态
        Person p = new Person {
            @Override
            public void print() {
                
            }
        };
    }
}

abstract class Person {
    public abstract void print();
}
```
**抽象类中可以有 main 方法：**

```java
public abstract class AbstractTest {

    static int a = 1;

    public static void main(String[] args) {
        System.out.println(AbstractTest.a);
    }
}
```

## 接口  
接口是 Java 中最顶层的，抽象类是中层，类是底层。使用 `interface` 来修饰，接口中的方法全部是 `public abstract` 类型（默认就是，写的时候可以不写）。接口也有多态。
```java
public interface MyInterface {

    public abstract void myFunction(int a);
    // 以下两种方式都可以（因为程序默认会添加 public abstract）
    // public void myFunction(int a);
    // void myFunction(int a);
}
```

:::warning 注意
和抽象类一样，接口也不能被实例化，且接口中的属性都要用 `final` 来修饰（程序默认会加上）。
:::

```java
public interface MyInterface {

    int NUM = 10;
    // 等价如下
    // static final int NUM = 10;
    
    public abstract void myFunction(int a);
}
```

:::tip 特别说明
- 接口之间可以相互继承，且支持多继承（但是一般说 Java 是单继承），且也支持多态。
- 接口中不允许存在构造方法，这点与抽象类不同。
- 如果某个类实现了接口中的所有方法，那么该类就可以实例化；否则，该类是一个抽象类。
:::

接口的匿名实现类：
```java
public class Demo1 {

    public static void main(String[] args) {
        Test test = new Test();
        // 接口的匿名实现类
        test.test1(new USB() {
            @Override
            public void print() {

            }
        });

        // 接口的匿名实现类
        USB usb = new USB() {
            @Override
            public void print() {
                
            }
        };
    }
}

class Test {

    public void test1(USB usb) {
        usb.print();
    }
}

interface USB {
    void print();
}
```
**接口面试题**

```java
public class Demo2 {
    public static void main(String[] args) {
        new C().print();
    }
}

class A {
    int x = 1;
}
interface B {
    int x = 2;
}
class C extends A implements B {
    public void print() {
        System.out.println(x); // 编译报错
    }
}
```
```java
interface T1 {
    void play();
}
interface T2 {
    void play();
}
interface T3 extends T1, T2 {
    Test1 test1 = new Test1("23");
}
class Test1 implements T3{
    private String name;

    public String getName() {
        return name;
    }

    public Test1(String name) {
        this.name = name;
    }

    @Override
    public void play() {
        test1 = new Test1("123"); // 编译报错，常量不能被修改
        System.out.println(test1.getName());
    }
}
```

**Java8 接口新特性**  

- Java8 中，还可以为接口定义静态方法和默认方法
- 接口中的静态方法必须要有方法体，且**只能**通过接口名调用
- 接口中的默认方法必须要有方法体，如果其实现类没有重写该默认方法，则也可以调用该方法
- 如果子类或实现类继承的父类或实现的接口中有同时拥有相同的方法，且子类没有对该方法进行重写，则在调用时会调用继承中的方法
- 如果实现类实现了多个接口，且这些接口中有相同的默认方法，且实现类没有进行重写，则会报错
- 在子类或实现类中调用接口中被重写的默认方法时，可以使用 `接口名.super.方法`

```java
// java8 接口中只能定义如下的方法和变量
// 除此之外出现的其它任何权限修饰符都是不被允许的
// 以下所有方法都可以抛异常（包括 throws）

public interface InterfaceTest {

    int a = 1;

    void test1();

    default void test2() {
        System.out.println("hello");
    }

    static void testStatic() {
        System.out.println("static");
    }

    // 也会被识别为 main 方法，等价于下面的 main 方法
    static void main(String[] args) {
        System.out.println(a);
    }

    // main 方法
    public static void main(String[] args) {
        System.out.println(a);
    }
}
```
## 关键字
### this
它代表了当前对象，类似于 JS 中的 `this`（但不全是）。通过 `this` 调用构造方法（但是不能调用自己，并且该条语句必须放在首行，并且只能使用一次）：
```java
public class ThisTest {
    private int age;
    private String name;

    public ThisTest() {
        // this(); // 不能调用自己
    }
    
    public ThisTest(int age) {
        this();
        this.age = age;
    }
    
    public ThisTest(int age, String name) {
        this(age); // 必须在首行，不能再调用其它构造器
        // this(); // 不能再调用其它构造器
        this.name = name;
    }
}
```
### static  
有时我们希望，无论产生多少个对象，而**某些数据在内存空间中只有一份**。这时，我们可以使用 `static` 关键字。`static` 可以用来修饰属性、方法、代码块、内部类。  

**静态属性（变量）**

```java
public class StaticTest {
    public static void main(String[] args) {
        Person p1 = new Person();
        Person p2 = new Person();
        p1.country = "123";
        System.out.println(p2.country); // 123
    }
}
class Person {
    static String country;
}
```
- 静态变量（属性）随着类的加载而加载，可以直接通过类名调用。  
- 静态变量的加载要早于对象的创建。  
- 由于类只会加载一次，所以静态变量在内存中只有一份。  
- 静态属性存在于方法区的静态域中。    

**静态方法**  

- 随着类的加载而加载，可以通过类名直接调用。  
- 静态方法中只能调用静态方法或属性。  
- 非静态方法可以调用静态方法。
- 静态方法中不能使用 `this`、`super` 关键字。


### final
- `final` 修饰的类不能被继承。  
- `final` 修饰的方法不能被重写。  
- `final` 修饰的变量（或属性）不能被修改。  
- 可以在代码块、构造器中对 `final` 修饰的成员变量进行初始化。

### instanceof  
在使用多态时，我们经常会向下转型。而在转型的过程中，经常出现类型转换异常，这时，我们可以通过 `instanceof` 来解决。`instanceof` 的作用就是判断某个对象是否是某个类的实例。  
```java
Animal animal = new Dog();
if (animal instanceof Dog) {
    animal = (Dog)animal;
}
```
假如 B 是 A 的父类，如果 `a instanceof A`  为 true，则 `a instanceof B` 也为 true。  

要想强制转换，则必须满足 `new` 的对象和要强转的类保持一致：
```java
Person person = new Student();
Student s = (Student)person;

// 错误如下
Person person = new Person();
Student s = (Student)person;
```

## 代码块  
在代码块中，可以进行某些初始化操作。代码块只有静态代码块和普通代码块，如下：
```java
// 普通代码块
{ 
    
}

// 静态代码块
static {
    
}
```
**静态代码块**  

- 随着类的加载而执行。
- 只会执行一次。
- 如果定义了多个静态代码块，则会按照其顺序执行。
- 优先于非静态代码块的执行。
- 静态代码块中只能调用静态方法或属性。

**非静态代码块**  

- 随着对象的创建而执行。
- 每次创建对象时，都会被执行。
- 如果定义了多个非静态代码块，则会按照其顺序执行。
- 非静态代码块中可以调用静态和非静态方法或属性。

使用代码块赋值时的先后顺序：  
默认初始化 -> 显示初始化 / 代码块中初始化 -> 构造方法中初始化 -> 通过对象初始化

## 异常
**try-catch-finally**  

- 在 `try-catch` 中发生异常时，`try-catch` 以外的代码仍会执行。  
- `finally` 中的代码一定是会被执行的，即使在它之前出现了 `return` 语句。  
- 调用顺序为 `try-catch-finally`，如果在 `try-catch `中有 `return`，则会先执行 `finally` 中的代码，然后再执行 `return`（如果 `finally` 中有 `return`，则程序就会结束）。


**throws**  

将异常抛给方法的调用者。

**重写异常方法**  

子类重写父类的方法时，抛出的异常不能大于父类方法的异常。如果父类的方法没有用 `throws` 抛出异常，则子类重写该方法时，也不能使用 `throws`。

**throw 手动抛出异常**  

抛出 `RuntimeException` 时，可以不用处理；但是，抛出 `Exception` 时，就必须进行处理。  

**自定义异常**  

继承现有的异常类，如 `RuntimeException`、`Exception` 等。

```java
public class CustomerException extends RuntimeException {

    public CustomerException() {}
    
    public CustomerException(String msg) {
        super(msg);
    }
}
```
```java
public class Test1 {
    static void method1 () {
        try {
            System.out.println("1");
            throw new RuntimeException("ex");
        }catch(Exception e) {
            
        }finally {
            System.out.println("2");
        }
    }
    
    public static void main(String[] args) {
        try {
            method1();
        }catch(Exception e) {
            System.out.println(e.getMessage());
        }
        // 输出的顺序为 1 2 ex。
    }
}
```

## 基础补充
1. boolean 类型的变量的 get 方法可以是 isXxx(){}，它等价于 getXxx(){}
2. 子类必须实现抽象类中的所有抽象方法，可以空实现
3. 实现类必须实现接口中的所有抽象方法，可以空实现
4. 如果有继承又有实现接口，则必须先继承再实现
5. Java 中是单继承多实现
