# 输入

Java 中，没有直接输入 `char` 类型的变量，但是可以输入字符串，然后将字符串转化为 `char`。

**`next()` 和 `nextLine()` 的区别**  
  
这两个都可以输入字符串，但是前者不接收空格和回车（遇到回车和空格时会终止接收），后者会接收空格和回车等（前一次输入对这一次输入会有影响）。

```java
public static void main (String[] args) {
    Scanner s = new Scanner(System.in);
    System.out.println("请输入年龄");
    int a = s.nextInt();
    System.out.println("请输入姓名");
    int b = s.nextLine();
    // System.out.println("请输入姓名");
    // int c = s.next();
    
    /* ------------------ */
    // 遇到空格或者回车会停止录入
    String str1 = scanner.next();
    System.out.println(str1);
    // 会自动接收上一次的空格或回车
    // 还未等用户输入，str2 就已经有值了
    String str2 = scanner.nextLine();
    System.out.println(str2);
}
```
```java
public static void main (String[] args) {
    Scanner s = new Scanner(System.in);
    System.out.println("请输入姓名（请带空格和字母）"); // 输入 mm  nn
    int c = s.next();
    System.out.println("请输入年龄");
    int a = s.nextInt();// 报错 InputMismactchException
}
```

**判断输入的是否是数字（也可以判断其它类型）**  

```java
Scanner s = new Scanner(System.in);
if (s.hasnextInt()) {
    // 如果是整数, 则接收该数
    int a = s.nextInt();
} else {
    // ...
}
```
