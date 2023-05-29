# 数据类型

## 基本类型

基本类型也叫原生数据类型，共有 8 种。

|类型|长度(byte)|长度(bit)|取值范围|说明|
|---|---|---|---|---|
|`byte`|1|8|`$[-2^7,2^7-1]$` |总共可表示 `$2^8$` 个数，但是有正负，所以要除以 2，即正负数各有 `$2^8 \div 2 = 2^7$` 个，但是有特殊值0，所以正数要少一个，即正数最大为 127|
|`short`|2|16|`$[-2^{15},2^{15}-1]$` ||
|`int`|4|32|`$[-2^{31},2^{31}-1]$` ||
|`long`|8|64|`$[-2^{63},2^{63}-1]$` |对 long 赋初值，需要使用 `l` 或 `L`|
|`float`|4|32|`$[-2^{31},2^{31}-1]$` |float 的范围其实不止于此，它要比 long 的范围还大些; 只能精确到 7 位有效数字|
|`double`|8|64|`$[-2^{63},2^{63}-1]$` |精度是 float 的 2 倍；通常使用 double 来表示小数|
|`char`|2|16|`$[0,2^{16}-1]$` |使用单引号，不能是空字符；一个汉字相当于 2 个字符（即 4 个字节）；可以表示转译字符；在进行运算时，会转为它的 ASCII 码|
|`boolean`||||请百度，对于 boolean 的长度，网上众说纷纭。<br>[The Java Virtual Machine Specification, Java SE 8 Edition](https://books.google.com/books?id=0o-AAwAAQBAJ&pg=PA10&lpg=PA10&dq=Although+the+Java+virtual+machine+defines+a+boolean+type,+it+only+provides+very+limited+support+for+it.+There+are+no+Java+virtual+machine+instructions+solely+dedicated+to+operations+on+boolean+values.+Instead,+expressions+in+the+Java+programming+language+that+operate+on+boolean+values+are+compiled+to+use+values+of+the+Java+virtual+machine+int+data+type.&source=bl&ots=uuzUQFNN-b&sig=ACfU3U2O41jtv8uP7iOuONmWR9uB3yGKqw&hl=zh-CN&sa=X&ved=2ahUKEwj4jYqywdDoAhUVHaYKHTODDjYQ6AEwAXoECAsQLQ#v=onepage&q=Although%20the%20Java%20virtual%20machine%20defines%20a%20boolean%20type%2C%20it%20only%20provides%20very%20limited%20support%20for%20it.%20There%20are%20no%20Java%20virtual%20machine%20instructions%20solely%20dedicated%20to%20operations%20on%20boolean%20values.%20Instead%2C%20expressions%20in%20the%20Java%20programming%20language%20that%20operate%20on%20boolean%20values%20are%20compiled%20to%20use%20values%20of%20the%20Java%20virtual%20machine%20int%20data%20type.&f=false) 中讲到，单个的 boolean 类型变量在编译的时候是使用的int 类型。而对于 boolean 类型的数组时，在编译的时候是作为 byte array 来编译的，所以 boolean 数组里面的每一个元件占一个字节，这是确定的！|

:::tip 说明
- 数值类型（`byte`、`short`、`int`、`long`）默认是 `int`，小数类型默认是 `double`。但是，在数字类型中，赋值时会将 `int` 类型自动转换给相应的数据类型；而小数需要手动转换。  
- `double` 比 `float` 更精确，但是，内存占用较大。  
- 可以使用 `double c = .9;` 的形式来表示小数，相当于 '0.9'。
- `char` 的范围小于 `int` 的范围
- `Java` 默认使用 `Unicode` 编码，它兼容 ASCII 码。
:::


**示例如下：**  

```java
// 报错，原因就是小数默认是 double 类型
float f = 123.6; 
// 改进如下
float f2 = 123.6f; // float f2 = 123.6F;
float f3 = (float)123.6;

// 不报错，因为底层会自动将 int 转换为 byte
byte a = 123；
```
```java
long a = 123L;
float b = 123.6F;
// 不报错，因为 float 实际能表示的范围比 long 大
float c = a + b; 
System.out.println(c);
```
```java
// 报错，不能为空
char a = '';

char b = 97;
System.out.println(b); // 'a'
System.out.println((int)b); // 97
```
## 引用类型

引用类型也叫对象数据类型。

### 数组
数组会在内存中开辟一组连续的空间。数组的长度一旦确定，就不能进行修改。数组一旦创建，其长度就确定了。

**初始化**  

```java
int[] students = new int[10];
int students[] = new int[10]; 

/* -------- 错误写法如下 -------- */
int[] a1 = new int[3]{1,2,3};
int[3] a2 = new int[3];
```

**赋值**

```java
int[] students = new int[]{10,11};
// 等价写法如下
int[] students;
students = new int[]{10,11};

// 另一种方法如下，但是这钟方式不能拆开写
int[] students = {10,11};
// 不能像下面这样写
// int[] students;
// students = {10,11};
```

**默认初始化**  

当我们没有为数组元素赋值时，会根据数据类型自动初始化。

```java
int[] a2 = new int[3];     // 元素默认全为 0 
short[] a3 = new short[3]; // 元素默认全为 0
byte[] a5 = new byte[3];   // 元素默认全为 0
float[] a6 = new float[3]; // 元素默认全为 0.0
doble[] a7 = new doble[3]; // 元素默认全为 0.0
char[] a8 = new char[3];   // 元素默认全为 '\u0000'(对应的 int 数值为 0), 而不是 '0'
boolean[] b1 = new boolean[3]; // 元素默认全为 false
// 引用类型的默认值为 null
```

**二维数组**  

```java
int[][] a = new int[][]{{1,2,3},{1,2,3}};
int[][] a = {{1,2,3},{1,2,3}};
String[][] str1 = new String[3][6];
String[] str1[] = new String[3][6];

/* --------------------- */
// 二维数组初始化时，至少要指定行的数量，如下：
String[][] str1 = new String[3][];

/* --------------------- */
// 二维数组的长度就是其行数。
String[][] str1 = new String[3][6];
System.out.println(str1.length); // 3

/* ------------- 遍历二维数组 ----------- */
for (int i = 0; i < str1.length; i++) {
    for (int j = 0; j < str1[i].length; j++) {
        System.out.println(str1[i][j]);
    }
}

/* ------------ 二维数组的初始化 ------------ */
int[][] a = new int[6][6];
System.out.println(a[0]);                  // 打印第 0 个元素的地址
System.out.println(Arrays.toString(a[0])); // [0,0,0,0,0,0]
System.out.println(a[0][0]); // 0

/* ------------ 二维数组的初始化 ------------ */
int[][] a = new int[6][];
System.out.println(a[0]); // null
System.out.println(a[0][0]); // 空指针异常
```

**练习**  

```java
int[] x, y[];
/* -------- 以下能够通过编译的是? -------- */

// 首先，x 是一维数组，y 是二维数组
x[0] = y;       // 不能 （x[0] 是一个整数，y是地址）
y[0] = x;       // 能（y[0] 和 x 都是地址）
y[0][0] = x;    // 不能（y[0][0] 是一个整数，x是地址）
x[0][0] = y;    // 不能（x 是一维数组）
y[0][0] = x[0]; // 能（y[0][0] 和 x[0] 都是整数）
x = y;          // 不能（x 和 y 的维数不同）
```
**排序**  

使用 `Arrays.sort()`，把要排序的数组放进去即可（然后原数组就会被排序了，直接打印原数组即可），默认是升序。
```java
int[] num = {10,2,3,8,1,3,6};
Arrays.sort(num);
System.out.println(num);
```

**数组的错误写法如下：**  
```java
// 编译报错，数组长度不能写在前面
String[10] arr1 = new String[10]; 

// 编译报错，初始化时不能指定长度
String[] arr1 = new String[10]{"1", "2"}; 
```

**Arrays 工具类**  

|方法|描述|
|---|---|
|`public static boolean equals(long[] a, long[] a2)`|如果两个指定的 long 型数组彼此相等，则返回 true。如果两个数组包含相同数量的元素，并且两个数组中的所有相应元素对都是相等的，则认为这两个数组是相等的。换句话说，如果两个数组以相同顺序包含相同的元素，则两个数组是相等的。同样的方法适用于所有的其他基本数据类型（byte、short、int 等）。|
|`public static int binarySearch(Object[] a, Object key)`|用二分查找算法在给定数组中搜索给定值的对象(byte、int、double 等)。数组在调用前必须排序好的。如果查找值包含在数组中，则返回搜索键的索引；否则返回 (-(插入点) - 1)。|
|`public static void fill(int[] a, int val)`|将指定的 int 值分配给指定 int 型数组指定范围中的每个元素。同样的方法适用于所有的其他基本数据类型（byte、short、int 等）。|
|`public static void sort(Object[] a)`|对指定对象数组根据其元素的自然顺序进行升序排列。同样的方法适用于所有的其他基本数据类型（byte、short、int 等）。|
|`toString()`|打印数组|
|`asList()`|将数组转为 List|

### 字符串

String 类型的首字母是大写的，因此，可以将它看作对象。

**初始化的方式**

```java
String a = "123";
String s = new String("asd");
String ss = new String(); 
```
**常用方法**  

|方法|描述|
|---|---|
|`equals()`|判断两个字符串的值是否完全相等，返回 boolean 值|
|`equalsIgnoreCase()`|判断两个字符串的值是否相等（忽略大小写），返回 boolean 值|
|`length()`|返回字符串的长度|
|`toupperCase()`|转换成大写，返回大写的字符串，对原字符串无影响|
|`toLowerCase()`|转换成小写，返回小写的字符串，对原字符串无影响|
|`indexOf()`|判断是否有某个子串，返回所在位置；其参数可以是字符串，字符，和整数（即ASCII码）|
|`lastIndexOf()`|从后往前找|
|`trim()`|去掉字符串首尾的空格，返回去掉空格之后的字符串|
|`subString()`|截取字符串，并返回截取后的字符串。有两个参数，第一个能取到，第二个不能取到；如果没有第二个参数，则默认截取到字符串末尾|
|`split()`|拆分字符串，返回一个数组|
|`toCharArray()`|将字符串变为字符数组|
|`charAt()`|根据位置找字符，返回所在索引的字符|
|`replace()`|替换字符或字符串|

**类型说明**  

在 String 这个类的源码中说到：字符串是一个常量，它的值一旦创建之后就不能被改变。 

字符串被赋值时，它的值被存放在堆空间中，而字符串变量则在栈中存放它的地址并指向它，当字符串被赋予新的值时，在堆内存中会重新开辟一个新的空间，而栈中变量改变的只是存放它的地址，并且原来的堆空间中的字符串不会被回收。  

字符串的 +=、+ 等操作也是如此，它会频繁改变堆的空间，因此，不建议使用 + 等操作直接拼接字符串，应当使用 `StringBuffer`。


针对网上的错误理解：由于 String 类被 final 修饰，所以 String 的值不能被改变。但是，如果类前面有 final，则表示此类不能被继承，和值不能被改变没有关系。  

还有一种错误理解就是：在 String 类中有一个 `final char value[]` 的数组，由于它被 final 修饰，所以它的值不能被改变。但是它的值可以改变，只是它是一个引用类型，它与堆内存中数组的引用关系是固定的，其引用关系不能被改变，而数组的值可以改变。

**字符串常量池**  

在 Java 的内存分配中，有一个内存叫方法区，在方法区中存在一个常量池，字符串常量池就在里面。当给字符串变量赋值时，会先在常量池里面查找，如果有，则该变量就指向这个字符串；如果没有，就先把该字符串放入常量池中，然后变量再指向它。在栈中存放的是 8 个基本类型的值，而堆中存放的是引用（对象）类型的实例。注意方法区和它们是独立的。通过 `new String("hello")` 的方式也是这样。

![2023030522482121.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-05/2023030522482121.png)


**字符串的比较**  

建议使用 `equals()` 方法（比较的是值），`==` 比较的是地址。

**示例一**  

```java
String s1 = "hello";
String s2 = "hello";
System.out.println(s1 == s2); // true，比较的是地址，地址相同
```
**示例二**

```java
String s1 = "hello";
String s2 = "hello";
String s3 = new String("hello");
String s5 = new String("hello");
String s6 = new String("hello");
System.out.println(s1 == s2); // true
System.out.println(s3 == s6); // false
System.out.println(s1 == s3); // false
// 每次 new ，都会开辟新的空间
```

**示例三**  

下列语句会创建多少个对象?   

```java
String s = new String("hello");
```
:::tip 答案
1 个或 2 个。  

如果 "hello" 在常量池不存在，则会在常量池里面创建一个，然后再创建 String 对象并指向常量池中的对象，此处产生了 2 个对象；如果常量池中存在 "hello"，则只会在堆中创建 String 对象并指向常量池中的对象。
:::

**示例四**  

下列语句会创建多少个对象（假设常量池为空）？

```java
String s = new String("hello" + "world");
```
:::tip 答案
4 个（`a`, `b`, `ab` 和 String 对象）
:::

**示例五**  

下列语句会创建多少个对象（假设常量池为空）？  

```java
String s = new String("hello") + "hello";
```

:::tip 答案
3 个（"hello"，String 对象，"hellohello"）。此处有点问题，应该是 4 个。为什么？见 JVM。
:::

:::tip 补充
通过上面的方法，我们可以发现，使用 `new String()` 方法给字符串赋值时，由栈中的变量指向堆中的对象实例，然后再由堆中的实例指向常量池中字符串；那么，我们是否可以直接使栈中的变量指向常量池中的对象呢？当然也是可以的，使用 `intern()` 方法即可（只针对通过 `new String()` 的方式来讲）。

```java
String s1 = "hello";
String s2 = new String("hello");
s2 = s2.inter();
System.out.println(s1 == s2); // true
```
:::


**字符串拆分**  

- 示例一  
  
  ```java
  String s = "hello+world";
  String[] arr = s.split("\\+"); // 使用转译
  ```

- 实例二  

  ```java
  String s = "hello+world";
  StringTokenizer token = new StringTokenizer(s, "+")
  while(token.hasMoreElements()) {
      System.out.println(token.nextElement());
  }
  // token 默认指向的是第一个元素的前一个位置
  // token.hasMoreElements()，判断是否有下一个元素，如果有，返回 true，并使指针往后移；否则返回 false。
  // token.nextElement() 取出当前元素
  // 使用此方法可以不用转译正则保留字
  ```

#### StringBuffer

在前面我们有讲到，String 类型的值是不可变的，每次修改都会在常量池中开辟新空间，并使字符串变量指向新的字符串，如果我们频繁改变字符串的值，那么就会在常量池中开辟很多新空间，这样显得就有点浪费了。是否能像基本数据类型那样，在原来的值上面做修改，而不重新开辟空间呢？ `StringBuffer` 就做到了这一点。
```java
// StringBuffer str = new StringBuffer(); 
StringBuffer str = new StringBuffer("abc"); // String str = "abc"；
str.append("aaa"); // 拼接字符串"aaa"
System.out.println(str);
// 在下标为 0 的前面插入 000
str.insert(0,"000");
// 字符串翻转
str.reverse();
```

**与 String 相互转换**  

- String 转 StringBuffer  

  ```java
  String a = "123";
  StringBuffer b = new StringBuffer(a);
  ```

- StringBuffer 转 String  

  ```java
  StringBuffer b = new StringBuffer("123");
  String c = b.toString();
  // 或者如下方式
  // 因为任何类型遇到字符串都会被转成字符串
  String c = b + "";
  ```

**示例**   

将字符串每三位用逗号分开，从后往前（类似于人民币的计数法）

```java
public String test(String str) {
    StringBuffer s = new StringBuffer(str);
    for(int i = str.length() - 3; i > 0; i = i - 3) {
        s.insert(i, ",");
    }
    return s.toString();
}
```
