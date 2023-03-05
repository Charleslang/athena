# 注解 Annotation

注解是 JDK5.0 中新增的，可以作用在类、属性、方法、参数上。

JDK 内置的三个注解

- `@Override`
- `@Deprecated`
- `SuppressWarning`  
  
  用于消除编译器的警告

以上三个都是在编译时生效。

**自定义注解**  

- 使用 `@interface` 来定义注解
- 注解中的元素要写成方法的形式
- 元素可以使用 `default` 来指定默认值
- 当注解中只有一个元素时，推荐命令为 value
- 如果注解中没有变量，表明它是一个标识

```java
public @interface MyAnnotation {
    String[] name();
    String type() default "";
}
```
**JDK 中的 4 个元注解（修饰注解的注解称为元注解）**


- `@Retention`  

  指定注解的生命周期。可选值为 `SOURCE`（在编译时有效）、`CLASS`（会被放入 .class 文件中，默认行为）、`RUNTIME`（只在运行时有效）

- `@Target`  

  指定注解的修饰范围。  

- `@Document`  

  是否在 javadoc 文档中出现。若指定该注解，则 `@Retention` 必须为 `RUNTIME`。
  
- `@Inherited`  

  是否可以被继承

**JDK8 注解的新特性**

- 可重复注解  

  使一个的注解可以出现多次。

- 类型注解
