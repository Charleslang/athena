# 输入

Java 中，没有直接输入 `char` 类型的变量，但是可以输入字符串，然后将字符串转化为 `char`。

**`next()` 和 `nextLine()` 的区别**  
  
这两个都可以输入字符串，但是前者不接收空格和回车（遇到回车和空格时会终止接收），后者会接收空格和回车等（前一次输入对这一次输入会有影响）。

```java
public static void main (String[] args) {
    Scanner scanner = new Scanner(System.in);
    System.out.print("请输入年龄 > ");
    int age = scanner.nextInt();
    System.out.print("请输入姓名 > ");
    String name = scanner.nextLine(); // b 其实是上一次输入的回车。所以，代码执行到这里时，会直接结束了，而不会等用户输入。
    // System.out.print("请输入姓名 > ");
    // String name = scanner.next(); // 不会接收回车，所以可以输入姓名
    
    /* ------------------ */
    // next() 遇到空格或者回车会停止录入
    String str1 = scanner.next(); // 输入 12 3 4 5 6
    System.out.println(str1); // 12
    // 会自动接收上一次的空格或回车，还未等用户输入，str2 就已经有值了
    String str2 = scanner.nextLine();
    System.out.println(str2); // " 3 4 5 6"
}
```
```java
public static void main (String[] args) {
    Scanner s = new Scanner(System.in);
    System.out.println("请输入姓名（请带空格和字母）"); // 输入 mm  nn
    String c = s.next();
    System.out.println("请输入年龄");
    int a = s.nextInt(); // 报错 InputMismactchException
    
    // 但是，如果姓名后面跟着的是数字，则程序不会报错。例如姓名输入的是 "mm 1", 则 a 就是 1
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
