# 方法参数的值传递

在 Java 中，方法参数只有**值传递**，这个值可以是普通类型，也可以是引用类型（地址）。对于普通类型来将，是将形参的值复制给实参，形参不受影响。对于引用类型，是将形参的地址复制给实参，形参可能会收影响。

```java
public class ParamTest1 {

    public static void swap(int x, int y) {
        int temp = x;
        x = y;
        y = temp;
    }

    public static void swap(Param param) {
        int temp = param.x;
        param.x = param.y;
        param.y = temp;
    }

    public static void change(Test test) {
        test.a = 123;
    }
    
    public static void main(String[] args) {
        int a = 1, b = 2;
        swap(a, b);
        System.out.println(a + " " + b); // 1 2
        Param param = new Param();
        swap(param); // 交换成功
        Test test = new Test();
        test.a = 1;
        change(test);
        System.out.println(test.a); // 123
        
        /* ----------------- */
        char[] a = new char[]{'a', 'b', 'c'};
        System.out.println(a); // abc
    }
}

class Test {
    int a = 10;
}
```
