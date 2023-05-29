# 访问修饰符

|修饰符|本类|同包|子类|其它|
|---|---|---|---|---|
|`private`|√|x|x|x|
|默认|√|√|x|x|
|`protected`|√|√|√|x|
|`public`|√|√|√|√|

上面的意思是说，通过类的实例直接访问属性或方法（而不是使用 `set` 或 `get` 等方法来访问）。

**默认**  

- `A.java`

  ```java
  package com.dysy.entity;

  public class A {
      int abc;
  }
  ```

- `B.java`

  ```java
  package com.dysy.entity;

  public class B {
      
      public void print() {
          // 直接访问（没有通过 get 方法访问变量 abc）
          System.out.println(new A().abc); // 0
          // 以下就是错误的理解
          // System.out.println(abc);
      }
  }
  ```

**protected**  

- `A.java`

  ```java
  // 注意包名
  package com.dysy.entity1;

  public class A {
      int number;
      protected int number2;
      public int number3;
  }
  ```

- `B.java`

  ```java
  // 注意包名
  package com.dysy.entity2;

  public class B extends A {
      private void test() {
          System.out.println(number);
          System.out.println(super.number);
          System.out.println(this.number);
          System.out.println(number2);
          System.out.println(super.number2);
          System.out.println(this.number2);
          System.out.println(number3);
          System.out.println(super.number3);
          System.out.println(this.number3);
      }
  }
```
