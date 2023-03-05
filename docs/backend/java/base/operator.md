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
    int rest = 0;
    ArrayList<Integer> list = new ArrayList<>();
    while (num > 0) {
        rest = num % 10;
        num /= 10;
        list.add(rest);
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
// 原因（近似的理解，不是真正原因）
// 左边的 byte 是 -128-127，而右边相加变成 -256-255
a = a + b;

// 不报错（自动转换），请见逻辑运行算符 +=
a += b;
```
**小数的运算问题**  

```java
System.out.println(3 * 0.3); // 0.8999999999
System.out.println(3 * 0.3f); // 0.9000
```
**String 类型参与运算**  

String 只能进行 `+` 运算（实际上是字符串的拼接）。  

```java
System.out.println( 'a' + 1 + "hello"); // 98hello
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
// 报错,结果为 int 类型，而 a 被定义为了 short 类型
a = a + 1; 

/* ------------------------------------ */

byte a = 127;
a++;
System.out.println(a); // -128

// 不能连续使用 ++ 或 --
int a = 1;
// 以下的操作都会报错
a++++;
(a++)++;
```
**+=、-=、*=、/=、%=**  

对于整数而言，它自带类型转换器，即操作之后还是原来的数据类型。

```java
int a = 20;
a += 10; // a == 30
a =+10;  //a == 10，只不过是符号为正的 10
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

:::tip 说明
上面我们提到，对于整数来讲，使用 = 时，会自带类型转换器（见数据类型），但是，这仅仅局限于等号的左右两边都没有表达式（如 + 号等）的情况；而 += 也是这样。上面的例子 a += b，+= 的两边都没有表达式，所以不报错。
:::

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

  右移。如果最高位为 `0`，则空位补 `0`；否则补 `1`。  

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
## 三目运算符

对于三目运算符来讲，它的条件为真和假时，必须是返回相同类型。它会将后面的结果自动转换为同一类型（规则同自动类型转换）。

```java
/* 
 * int 类型被自动转为 double
 */
Object o1 = true ? new Integer(1) : new Double(2.0);
System.out.println(o1); // 1.0 
```
