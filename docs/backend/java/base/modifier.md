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
      int abc;
  }
  ```

- `B.java`

  ```java
  // 注意包名
  package com.dysy.entity2;

  public class B extends A{
      
      public void print(){
          // 直接访问（没有通过 get 方法访问变量 abc）
          System.out.println(abc); // 0
          // 以下就是错误的理解
          // A a = new A();
          // System.out.println(a.abc);
          // 如果想要使用父类的实例来调用，则必须给该变量加上 static，但是不推荐此方式
      }
  }
```
