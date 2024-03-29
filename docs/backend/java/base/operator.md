# 运算符

## 关系运算符

:::warning 注意
Java 中的 `boolean` 不能参与运算。
:::

**求一个整数的各位数字**  

通项：`num / 所在位的最小值 % 10`

```java
int a = 12345;
System.out.println("个位："+ (a / 1 % 10)):
System.out.println("十位："+ (a / 10 % 10)):
System.out.println("百位："+ (a / 100 % 10)):
System.out.println("千位："+ (a / 1000 % 10)):
System.out.println("万位："+ (a / 10000 % 10)):

/* --------------------------- */

Scanner scanner = new Scanner(System.in);
System.out.print("> ");
int num = scanner.nextInt();
int length = String.valueOf(num).length();
for (int i = 0; i < length; i++) {
    System.out.println(num / (int)Math.pow(10, i) % 10);
}

/*
 * 求一个数的各位数
 */
public static ArrayList<Integer> test1(int num) {
    List<Integer> list = new ArrayList<>();
    while (num > 0) {
        list.add(num % 10);
        num /= 10;
    }
    Collections.reverse(list);
    return list;
}
```

**两数交换**  

```java
int a = 10;
int b = 20;
a = a + b;
b = a - b;
a = a - b;
```
```java
// 位运算，效率最高（使用的是二进制）
a = a ^ b;
b = a ^ b;
a = a ^ b;
```
**两个数相加减可能出现溢出**  

```java
int max = Integer.MAX_VALUE;
int min = Integer.MIN_VALUE;
System.out.println(max + 1); // 变成最小值
System.out.println(min - 1); // 变成最大值
```
**取余的符号问题**  

余数的符号永远和被除数（左边的）保持一致。

```java
int a = -10 % 3; // -1
int b = -10 % -3; // -1
int c = 10 % -3; // 1
int d = 10 % 3; // 1
```
**加法特例**  

对于范围比 `int` 小的类型（即 `byte` 和 `short`）来讲，两个数相加后的结果是 `int`，因此，必须强转。
```java
byte a = 100;
byte b = 100;
// 报错，= 左边是 byte，= 右边是 int，需要强转。
// 原因（近似的理解，不是真正原因）: 左边的 byte 是 -128-127，而右边相加变成 -256-255
a = a + b;

// 不报错（自动转换），请见逻辑运行算符 +=
a += b; // -56
```
**小数的运算问题**  

```java
System.out.println(3 * 0.3); // 0.8999999999
System.out.println(3 * 0.3f); // 0.9000
```
**String 类型参与运算**  

String 只能进行 `+` 运算（实际上是字符串的拼接）。  

```java
System.out.println('a' + 1 + "hello"); // 98hello
System.out.println('*' + '\t' + '*');   // 93
System.out.println('*' + "\t" + '*');   // "* *"
System.out.println('*' + '\t' + "*");   // "51*"
System.out.println('*' + ('\t' + "*")); // "*   *"
```
**++ 或 --**  

此操作不会改变变量的数据类型。 

```java
short a = 1;
// 不报错
a++;
// 报错, 结果为 int 类型，而 a 被定义为了 short 类型
a = a + 1; 

/* ------------------------------------ */

byte a = 127;
a++;
System.out.println(a); // -128

// 不能连续使用 ++ 或 --
int a = 1;
// 以下的操作都会导致编译报错
a++++;
(a++)++;
```
**+=、-=、*=、/=、%=**  

对于整数而言，它自带类型转换器，即操作之后还是原来的数据类型。

```java
int a = 20;
a += 10; // a == 30
a =+ 10;  //a == 10，只不过是符号为正的 10
```
```java
byte a = 100;
byte b = 100;

// 报错，= 左边是 byte，= 右边是 int，需要强转。
// 原因（近似的理解，不是真正原因）
// 左边的 byte 是 -128-127，而右边相加变成 -256-255
a = a + b;

// 不报错，因为 += 自带类型转换器
a += b;
```
```java
byte a = 1; 
a += 1; // 不报错
short c = 1;
c += 1; // 不报错
```
```java
int i = 3;
i *= 0.9;
System.out.println(i); // 2（自动转换 2.7 -> 2）
```
```java
int m = 2;
int n = 3;
n *= m++;
System.out.println(m + " " + n); // 3 6
```
```java
int n = 1;
n += (n++)+(++n);
// 相当于 n = n + (n++) + (++n)
// 即 n = 1 + 1(此时 n++ 之后，n = 2) + 3 = 5
System.out.println(n); // 5

/* ----------------------- */
int n = 1;
System.out.println(n+++1); // 2 ((n++) + 1)
```

## 逻辑运算符  

它们只适用于 `boolean` 类型。

- 且  

  它的符号有 `&&`（短路与） 和 `&`（逻辑与），`&&` 具有短路特性，即如果前者为 `false`，则不会继续判断，而 `&` 会全部判断。
  ```java
  System.out.println(2 < 1 && 1 / 0 == 0); // false
  System.out.println(2 < 1 & 1 / 0 == 0);  // 抛出除数为 0 的异常
  ```

- 或  

  它的符号有 `||` （短路或）和 `|`（逻辑或），`||` 具有短路特性，即如果前者为 `true`，则不会继续判断，而 `|` 会全部判断。

- !  

  逻辑非，只适用于 `boolean` 类型。  

- ^   

  逻辑异或。相同为 `false`，不同为 `true`。

## 位运算符
- `<<`   

  左移。

- `>>`  

  有符号右移。如果最高位为 `0`（即正数），则空位补 `0`；否则补 `1`。  

- `>>>`  

  无符号右移。空位都补 `0`。

- `&`  

  与运算。

- `|`  
  
  或运算。

- `^`  
  
  异或运算。  

- `~`  

  取反运算。


```java
System.out.println(3 << 2);  // 3 * 2 * 2
System.out.println(3 << 1);  // 3 * 2
System.out.println(3 >> 1);  // 3 / 2 = 1
System.out.println(3 >>> 1); // 3 / 2 = 1
System.out.println(6 & 3);   // 2
System.out.println(6 | 3);   // 7
System.out.println(6 ^ 3);   // 5
System.out.println(~6);      // -7
``` 

**两数交换**  

```java
int num1 = 1, num2 = 2;
num1 = num1 ^ num2;
num2 = num1 ^ num2;      
num1 = num1 ^ num2;
System.out.println(num1 + " " + num2);
```

`<<`、`>>`、`>>>` 这三种操作符都只能作用于 `long`、`int`、`short`、`byte`、`char` 这五种基本的整型类型上。

```java
System.out.println(((byte) 123) >> 2);
System.out.println(((char) 123) >> 2);
System.out.println(((short) 123) >> 2);
System.out.println(123 >> 2);
System.out.println(123L >> 2);
// 编译报错
System.out.println(123f >> 2);
// 编译报错
System.out.println(123d >> 2);
```
要想弄清楚 `<<`、`>>`、`>>>` 的区别，我们需要先了解三个概念：原码、反码、补码。我们都知道，计算机中的数字都是以**补码**的形式进行存储的，Java 也不例外。对于正数来讲，原码、反码、补码都是相同的。对于负数来讲，补码等于反码加 `1`。

此外，我们还要知道的是，**一个二进制串的最高位表示符号位，且在进行原码、反码、补丁之间的转换时，符号位是不会变化的**。Java 中，一个 `int` 占用 32 个比特位，一个 `long` 占用 64 个比特位。所以，在 Java 中，有符号的 `int` 的最大值是 `0x7fffffff`，最小值是 `0x80000000`，对应的二进制补码分别是 `01111111111111111111111111111111`、`10000000000000000000000000000000`。

```java
// Integer.toBinaryString 输出的是补码
System.out.println(Integer.toBinaryString(Integer.MAX_VALUE)); // 1111111111111111111111111111111
System.out.println(Integer.toBinaryString(Integer.MIN_VALUE)); // 10000000000000000000000000000000
```

下面，让我们详细说一下 `<<`、`>>`、`>>>` 这几个运算符。

**1. `<<` 左移运算符**

先定义一个 `int` 类型的正数 10，它在计算机中的二进制补码是 `00000000 00000000 00000000 00001010`。10 左移 1 位（`10 << 1`）后的二进制补码变成了 `00000000 00000000 00000000 00010100`，由于最高位是 0，所以左移 1 位后还是正数，变成了 21。即 `10 << 1 = 20`。同理，`10 << 2 = 40`。所以，左移操作其实相当于把原来的数值扩大 2 的次方倍，即 `10 << 1 = 10 * 2 * 1`、`10 << 2 = 10 * 2 * 2`。

定义一个 `int` 类型的负数 -10，它在计算机中的二进制补码是 `11111111 11111111 11111111 11110110`。由于它是负数，所以最高位是 1。-10 左移一位后的二进制补码变成了 `11111111 11111111 11111111 11101100`，可以看到，在左移一位后，它的最高位还是 1，所以 -10 左移一位后的结果还是负数。然后，再对 `11111111 11111111 11111111 11101100` 求补码，得到其原码 `10000000 00000000 00000000 00010100`，对应的 10 进制是 `-20`。同理 `-10 << 2 = -40`。

在上面的例子中，我们把 10 左移 28 位，得到的二进制补码是 `10100000 00000000 00000000 00000000`，所以，我们会看到，补码的最高位变成了 1，即 10 左移 28 位后变成了负数，补码 `10100000 00000000 00000000 00000000` 对应的原码是 `11100000 00000000 00000000 00000000`，由于最高位是 1，所以最终结果是负数 -1610612736。所以，在使用过程中，需要考虑左移后变成负数的情况。

那根据上面的规则，对于任意 int 类型的整数来讲，把它左移 32 位后，就会变成 0 ？答案是 NO，当 int 类型进行左移操作时，左移位数大于等于 32 位操作时，会先求余（%）后再进行左移操作。也就是说左移 32 位相当于不进行移位操作，左移 40 位相当于左移 8 位（40 % 32 = 8 ）。同理，当 long 类型进行左移操作时，long 类型在二进制中是 64 位的，因此求余操作的基数也变成了 64，也就是说左移 64 位相当于没有移位，左移 72 位相当于左移 8 位（72 % 64 = 8），写一段代码来测试一下。

```java
int intValue = 10;
System.out.println("intValue：" + intValue);
System.out.println("intValue 左移 1 位：" + (intValue << 1)); // 左移 1 位
System.out.println("intValue 左移 8 位：" + (intValue << 8)); // 左移 8 位
// 当 int 类型左移位数大于等于 32 位操作时，会先求余后再进行移位操作
System.out.println("intValue 左移 32 位：" + (intValue << 32)); // 求余为 32 % 32 = 0，相当于左移 0 位（不移位）
System.out.println("intValue 左移 40 位：" + (intValue << 40)); // 求余为 40 % 32 = 8，相当于左移 8 位
System.out.println("intValue 左移 64 位：" + (intValue << 64)); // 求余为 64 % 32 = 0，相当于左移 0 位（不移位）

long longValue = 10L;
System.out.println("longValue：" + longValue);
System.out.println("longValue 左移 1 位：" + (longValue << 1)); // 左移 1 位
System.out.println("longValue 左移 8 位：" + (longValue << 8)); // 左移 8 位
// 当 long 类型左移位数大于等于 64 位操作时，会先求余后再进行移位操作
System.out.println("longValue 左移 64 位：" + (longValue << 64)); // 求余为 64 % 64 = 0，相当于左移 0 位（不移位）
System.out.println("longValue 左移 72 位：" + (longValue << 72)); // 求余为 72 % 64 = 8，相当于左移 8 位
System.out.println("longValue 左移 128 位：" + (longValue << 128)); // 求余为 128 % 64 = 0，相当于左移 0 位（不移位）
```
在上面的例子中，是使用的 int 进行测试。对于 long 类型，其实也是一样的，只不过 long 在 Java 中需要使用 64 个比特位来表示。那么，我们再来看一个例子。对于 byte 类型来讲，左移 8 位是不是就会变成 0，或者说是不变？

```java
// 结果是 25600
System.out.println(((byte) 100) << 8);
```
从上面的测试中，可以看到，`((byte) 100) << 8` 的结果是 25600。这是怎么回事呢？其实，对于 byte、short、char 类型来讲，在进行位移操作时，会把它转为 int。byte 类型的 100，先转为 int，对应的二进制补码是 `00000000 00000000 00000000 01100100`，将其左移 8 位后，得到的补码是 `00000000 00000000 01100100 00000000`，由于最高位是 0，所以最终结果还是正数，正数的补码就是其原码，而 `00000000 00000000 01100100 00000000` 对应的 10 进制就是 25600。short 和 char 也是如此。

**2. `>>` 有符号右移运算符**

还是以 int 类型的整数 10 为例，其补码是 `00000000 00000000 00000000 00001010`，符号位是 0，带符号右移两位，高位需要使用符号位 0 来进行填充。所以，右移 2 位后，其补码变成了 `00000000 00000000 00000000 00000010`，由于最高位是 0，所以其原码就是补码，`00000000 00000000 00000000 00000010` 对应的 10 进制是 2。所以，对于正数来讲，右移其实就是相当于除以 2 的 n 次方，即 `10 >> 3 = 10 / 8 = 1`、`10 >> 4 = 10 / 16 = 0`。

和左移一样，int 类型移位大于等于 32 位时，long 类型大于等于 64 位时，会先做求余处理再位移处理。byte、short、char 移位前会先转换为 int 类型（32 位）再进行移位。

接下来，让我们再看下负数的有符号左移。对于 int 类型的 -10 来讲，其二进制补码是 `11111111 11111111 11111111 11110110`，将其右移 2 位，高位使用符号位 1 进行补齐，得到的补码是 `11111111 11111111 11111111 11111101`。由于 `11111111 11111111 11111111 11111101` 的最高位是 1，所以结果还是负数，对 `11111111 11111111 11111111 11111101` 再求补码得到其原码 `10000000 00000000 00000000 00000011`，对应的 10 进制是 `-3`。

**3. `>>>` 无符号右移运算符**

无符号右移运算符 `>>>` 和右移运算符 `>>` 是一样的，只不过右移时左边是补上符号位，而无符号右移运算符都是补 0。对于正数移位来说，`>>>` 和 `>>` 是一样的，而负数通过 `>>>` 移位运算符能变成正数。

以 int 类型的 -10 为例。其二进制补码是 `11111111 11111111 11111111 11110110`，将其无符号右移 2 位，高位为都补 0，得到的补码是 `00111111 11111111 11111111 11111101`，由于最高位是 0，所以无符号右移后变成了正数，而正数的补码就是其原码，`00111111 11111111 11111111 11111101` 对应的 10 进制是 1073741821。所以 `-10 >>> 2 = 1073741821`。


:::tip 参考
[Java 中的移位运算符](https://zhuanlan.zhihu.com/p/30108890)  
[彻底弄懂Java的移位操作符](https://juejin.cn/post/6844904025880526861#comment)
:::

## 三目运算符

对于三目运算符来讲，它的条件为真和假时，必须是返回相同类型。它会将后面的结果自动转换为同一类型（规则同自动类型转换）。

```java
/* 
 * int 类型被自动转为 double
 */
Object o1 = true ? new Integer(1) : new Double(2.0);
System.out.println(o1); // 1.0 

double v = true ? 1 : 2.0;
System.out.println(v); // 1.0

// 编译报错
int result = true ? 1 : 2.0;
```
