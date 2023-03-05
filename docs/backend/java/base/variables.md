# 变量
变量存在于内存中，程序结束或电脑重启后变量失效；而硬盘中的数据具有持久性。

## 变量命名规范

第一个字符必须是各国语言（中文也可）、下划线、钱（￥、$），其它位置上的字符可以含有数字。

## 成员变量和局部变量

- 局部变量不是能使用任何权限修饰符（如 `private`、`public`、`protected`、`static` 等），但是可以用 `final` 修饰。 
- 成员变量（非 `static` 修饰）是放在堆中的，而局部变量是放在栈中的  
- 全局变量（成员变量）有默认值，局部变量使用前必须赋初值（系统不会给默认值），main 函数中的也是局部变量

```java
// 以下两个代码都会在编译期间报错
// 不能在方法中声明 static 修饰的属性
public void test2() {
    static int a = 1;
}
public static void test3() {
    static int a = 1;
}

public static void main (String[] args) {
    int a;
    // 编译报错，未赋初值
    System.out.println(a);
}
```
## 作用范围

变量的作用范围是离它最近的一对大括号中的整个区域。
