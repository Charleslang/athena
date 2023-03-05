# Java 常用类

## String 

String 是一个 `final` 类，不能被继承。String 对象中的内容被放在了一个由 `final` 修饰的 `char[]` 中。

```java
String s1 = "a";
String s2 = "b";
String s3 = "ab";
String s5 = "a" + "b";
String s6 = s1 + "b";
String s7 = "a" + s2;
String s8 = s1 + s2;

System.out.println(s3 == s5); // true
System.out.println(s3 == s6); // false
System.out.println(s3 == s7); // false
System.out.println(s6 == s7); // false
System.out.println(s7 == s8); // false
```
通过以上代码，得出的结论为：  

- 如果是两个字面量（包括 `final` 修饰的常量）进行拼接，则得到的字符串是在常量池中。  
- 如果有任何变量（该变量非 `final` 修饰）参与拼接，则得到的值是在堆空间中（即通过 new）。

```java
class StringTest {
    String str = new String("good");
    char[] ch = {'a','b','c'};
    
    // 传的是地址
    public void change(String str, char[] ch) {
        str = "test";
        ch[0] = 'o';
    }

    public static void main(String[] args) {
        StringTest stringTest = new StringTest();
        stringTest.change(stringTest.str, stringTest.ch);
        System.out.println(stringTest.str); // good，字符串有道被定义后，就不可变
        System.out.println(stringTest.ch); // obc
    }
}
```
**常用方法**   

`isEmpty()`、`concat()`、`startWith()`、`endWith()`、`contains()`

**String的执行过程**

```java
new String(); // 相当于 new char[0]
new String("abc"); // 相当于 new char[]{'a','b','c'}
```

## StringBuilder
它是可变的字符串，进行字符串拼接时效率高，但是线程不安全，底层使用的是` char[]`。

## StringBuffer
它是可变的字符串，进行字符串拼接时效率低，但是线程安全，底层使用的是 `char[]`。
```java
StringBuffer s = new StringBuffer(); // char[] value = new char[16]
s.length(); // 0
s.append('a'); // value[0] = 'a';
s.append('b'); // value[1] = 'b';

StringBuffer s2 = new StringBuffer("123"); // char[] value = new char["123".length + 16]
```

**扩容**    

如果要添加的字符串的长度超出了原有的 16 个，那么会进行扩容。扩容时，开辟了一个新的数组，该数组的长度是原数组长度的 2 倍 + 2，如果扩容后还是不够，则直接将字符串的长度赋值给要扩容的长度，最后将原字符串通过 `Arrays.copy()` 复制给新的字符数组。   
因此，为了避免频繁扩容，建议使用 `new StringBuffer(int length)` 来指定长度。  

**常用方法**  

`append()`、`delete()`、`replace()`、`insert()`、`reverse()`、`charAt()`、`setCharAt()`。可支持链式操作。

## 日期 API

### JDK8 之前的 API

- **`System.currentTimeMillis()`**  

  返回当前时间与 1970 年 1 月 1 日 0 时 0 分 0 秒的时差，称为时间戳。

- **`java.util.Date`**  

  该类重写了 `toString()` 方法。

  ```java
  Date date = new Date(); // 当前时间
  date.getTime(); // 得到毫秒数
  new Date(毫秒数);
  // 注意，这个年份是距离 1900 年的偏移量
  // 月份从 0 开始
  new Date(年, 月, 日); //该方法已被废弃
  ```

- **`java.sql.Date`**   

  它是 `java.util.Date` 的子类，只能输出年、月、日。
  ```java
  new Date(毫秒数);
  java.util.Date d1 = new java.util.Date();
  java.sql.Date d2 = new java.sql.Date(d1.getTime());
  ```

- **`java.text.SimpleDateFormate`**

  用于对日期（`Date` 类）进行格式化。
  ```java
  SimpleDateFormate sdf = new SimpleDateFormate();
  String result = sdf.format(new Date());

  SimpleDateFormate sdf2 = new SimpleDateFormate("yyyyMMdd HH:mm:ss");
  String result2 = sdf2.format(new Date());

  // parse 方法参数的格式必须和 SimpleDateFormate 构造方法的格式一致。
  SimpleDateFormate sdf = new SimpleDateFormate("yyyy-MM-dd");
  Date d1 = sdf.parse("2020-06-06");
  ```

- **`Calendar` 日历类**

  它是一个接口，通常使用它的子类 `GregorianCalendar`，或者调用 `Calendar.getInstance()`（返回的其实也是 `GregorianCalendar` 类型） 方法。
  ```java
  get();
  set(); // 是对原对象的操作
  add(); // 是对原对象的操作
  getTime();
  setTime();
  ```
### JDK8 中的 API

JDK8 的新的 API 基于 joda-time 这个工具类中方法。主要有 `LocalDate`、`LocalTime`、`LocalDateTime` 这三个。其中，`LocalDateTime` 较为常用。这几个类都是**不可变**的。
```java
LocalDate now = LocalDate.now();
LocalTime now1 = LocalTime.now();
LocalDateTime now2 = LocalDateTime.now();
System.out.println(now); // 2020-09-07
System.out.println(now1); // 16:06:43.854
System.out.println(now2); // 2020-09-07T16:06:43.854

// 指定时间
LocalDateTime of = LocalDateTime.of(2020, 2, 6, 6, 6, 6);
System.out.println(of);

/* 获取特定信息 */
LocalDateTime now2 = LocalDateTime.now();
// 该月的第几天，从 1 开始
System.out.println(now2.getDayOfMonth());
// 该周的第几天，如 MONDAY
System.out.println(now2.getDayOfWeek());
// 该年的第几天
System.out.println(now2.getDayOfYear());
// 时
System.out.println(now2.getHour());
// 分
System.out.println(now2.getMinute());
// 秒
System.out.println(now2.getSecond());
// 年
System.out.println(now2.getYear());
// 月，如 9
System.out.println(now2.getMonthValue());
// 月，如 SEPTEMBER
System.out.println(now2.getMonth());
// 毫秒
System.out.println(now2.getNano());

/* 如果想要设置某些值，只需将 get 改为相应的 with 方法即可 */
/* withXXX 方法会返回一个新的日期，并不会改变原有的值 */

/* plusXXX 可以在原有的基础上进行加操作 */
/* minusXXX 可以在原有的基础上进行减操作 */
```

**Instant 类**

```java
// 默认为 UTC 时区
Instant now = Instant.now();
// 东八区
OffsetDateTime offsetDateTime = now.atOffset(ZoneOffset.ofHours(8));
System.out.println(offsetDateTime); // 2020-09-07T16:31:13.773+08:00
System.out.println(now); // 2020-09-07T08:31:13.773Z

/* 以下都是 UTC 的本初子午线时间，不是东八区的 */

// 获取距 1970 年的毫秒数
long milli = now.toEpochMilli();
System.out.println(milli);

// 通过毫秒获取时间
Instant instant = Instant.ofEpochMilli(1599467607774L);
System.out.println(instant);
```

**DateTimeFormatter**  

该类用来格式化时间。
```java
// 使用预定义的标准格式
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
LocalDateTime localDateTime = LocalDateTime.now();
// 日期 -> 字符串
String format = dateTimeFormatter.format(localDateTime);
System.out.println(format);
// 字符串 -> 日期
TemporalAccessor parse = dateTimeFormatter.parse("2020-09-07T16:41:13.855");
System.out.println(parse);

// 方式二
DateTimeFormatter dateTimeFormatter1 = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.LONG);
String format1 = dateTimeFormatter1.format(localDateTime);
System.out.println(format1); // 2020年9月7日 下午04时47分23秒

// 自定义格式
DateTimeFormatter dateTimeFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String format2 = dateTimeFormatter2.format(localDateTime);
System.out.println(format2);
/* 当然，也可以将字符串转为日期 */
```

## 比较器

比较器在开发中使用较多，比如商品排序（将集合中的对象进行排序）。在 Java 中，如果想比较对象，那么可以使用比较器。

### Comparable 自然排序
对象可以实现该接口（重写 `compareTo()`）进行排序。String 、包装类等实现了该接口，进行升序排序（`Arrays.sort()`）。  

**重写规则**

1. 如果当前对象 `this` 大于形参 `obj`，则返回正数（交换）（升序）。
2. 如果当前对象 `this` 小于形参 `obj`，则返回负数（不交换）（降序）。
3. 如果当前对象 `this` 等于形参 `obj`，则返回 0。

```java
public class Goods implements Comparable<Goods> {

    private String name;
    private double price;

    public Goods(String name, double price) {
        this.name = name;
        this.price = price;
    }

    // set / get

    @Override
    public int compareTo(Goods o) {
        if (this.price > o.price) {
            return 1;
        } else if (this.price < o.price) {
            return -1;
        } else {
            return this.name.compareTo(o.name);
        }
//        return Double.compare(this.price, o.price);
    }

    @Override
    public String toString() {
        return "{" +
                "name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}


public static void main(String[] args) {
    Goods[] goods = {
            new Goods("小米", 2999),
            new Goods("华为", 4999),
            new Goods("onePlus", 3999),
            new Goods("Redmi", 1999),
            new Goods("三星", 2999),

    };

    Arrays.sort(goods);
    System.out.println(Arrays.toString(goods));
}
```
### Comparetor 定制排序

实现该接口，并重写 `compare()` `方法。Comparator` 是在外部制定排序规则，然后作为排序策略参数传递给某些类，比如 `Collections.sort()`, `Arrays.sort()`, 或者一些内部有序的集合（比如 `SortedSet`，`SortedMap` 等）。当我们需要重新对一个数组等进行另外的排序规则时，可以使用 `Comparetor`。

```java
public static void main(String[] args) {
    Goods[] goods = {
            new Goods("小米", 2999),
            new Goods("华为", 4999),
            new Goods("onePlus", 3999),
            new Goods("Redmi", 1999),
            new Goods("三星", 2999),

    };

    // 升序
    Arrays.sort(goods);

    // 降序
    Arrays.sort(goods, new Comparator<Goods>() {
        @Override
        public int compare(Goods o1, Goods o2) {

              return etName().compareTo(o1.getName());
            return o2.compareTo(o1);
        }
    });
    System.out.println(Arrays.toString(goods));
}
```
## System
System 类是一些与系统相关的属性和方法的集合，而且在 System 类中所有的属性和方法都是静态（static）的，要想引用这些属性和方法，直接使用 System 类调用即可。

- `public static void exit(int status)`  系统退出 ，如果 status 为 0 就表示正常退出，非 0 为异常退出。
- `public static void gc()`   运行垃圾收集机制，调用的是 Runtime 类中的 gc 方法。
- `public static long currentTimeMillis()`  返回以毫秒为单位的当前时间。
- `public static void arraycopy(Object src,int srcPos, Object dest,int desPos,int length)` 数组拷贝操作
- `public static Properties getProperties()` 取得当前系统的全部属性。
- `public static String  getProperty(String key)` 根据键值取得属性的具体内容。

## BigInteger
正常情况下一个整数最多只能放在long类型之中，但是如果现在有如下的一个数字: `1111111111111111111111111111111111111111111111111`

根本就是无法保存的，所以为了解决这样的问题，在 java 中引入了两个大数的操作类：

- 操作整型：`BigInteger`
- 操作小数：`BigDecimal`

当然了，这些大数都会以字符串的形式传入。

如果在操作的时候一个整型数据已经超过了整数的最大类型长度 long 的话，则此数据就无法装入，所以，此时要使用 `BigInteger` 类进行操作。

## BigDecimal
使用此类可以完成大的小数操作，而且也可以使用此类进行精确的四舍五入，这一点在开发中经常使用。对于不需要任何准确计算精度的程序可以直接使用 `float` 或 `double` 完成，但是如果需要精确计算结果，则必须使 `BigDecimal` 类。

:::tip 参考
[大数操作（BigInteger、BigDecimal）](https://blog.csdn.net/zhongkelee/article/details/52289163)
:::
