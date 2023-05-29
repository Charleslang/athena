# 数据类型转换

请结合[数据类型]("./data-type.html")查看本节。下面提到的范围指的是**数据实际能够表示的范围，并不是值它们占用字节的大小**。

## 自动转换

范围较小的可以自动转为范围较大的类型。

```java
// int 比 float 小，自动转换
float a = 10;  
// 自动转换
double b = 3.16f;
```
范围较小的类型**遇到范围较大的**可以自动转为范围较大的类型。
```java
// 报错。3.1 是小数，小数默认是 double 类型，而 10 默认是 int 类型，则 int + double 最后是 double 类型。
int a = 10 + 3.1;
```
```java
// 任何类型遇到 String，则自动转为 String
System.out.println("" + 10 + 1); // 101
System.out.println(10 + "" + 1); // 101
System.out.println(10 + 1 + ""); // 11
```
:::tip 提示
为了方便后续理解，这里，我们暂时理解为 `String` 是所有类型中范围最大的。
:::

```java
double a = 6 / 5; // 1.0
// 6 和 5 都是整数，所以 6 和 5 之间不存在强制转换，所得的结果还是整数
int b = 6 / 5; // 1

// 5.0 默认是 double，所以 6 会转换为 double，那么结果就是 double
double c = 6 / 5.0; // 1.2
```
```java
// char 小于 int，所以会将 A 转换成 ASCII 码。
System.out.println('A' + 0);  // 65，即 A 的 ASCII 码
System.out.println('代' + 0); // 输出 '代' 的 ASCII 码
```
:::tip 提示  
- `byte`、`short`、`char` 之间进行运算时，结果为 `int` 类型。
- `byte`、`short`、`char` 可以接收两个字面量整数计算后的结果。例如 `byte b = 1 + 2;`、`short s = 1 + 2;`、`char c = 1 + 2;`（但是可能造成溢出）。
:::

## 强制转换

要将范围大的转换为范围较小的，需要我们强制转换。基本语法为：`范围小 = (数据类型)范围大;`

```java
double a = 1.3;
int b = (int)a;
System.out.println(b); // 1
```
```java
System.out.println((byte)128); // -128
```
