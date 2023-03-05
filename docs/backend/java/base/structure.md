# 流程控制

## 选择结构

**switch**  

不是所有类型的数据都能在 `switch` 中使用（只有 `byte`、`short`、`char`、`int`、`枚举`、`String` 这 6 个类型才能在 switch 中使用）。case 后面的值只能是常量，且值不能重复。

```java
int number = 1;
switch(number) {
    case 0:
        System.out.println(0);
    case 1:
        System.out.println(1);
    case 2:
        System.out.println(2);
    default:
        System.out.println("none");
}

// 上面的输出结果为 1 2 none
```

## 循环结构

**数字翻转**  

```java
int num = 123;
int rear = -1;
num = num * 10;
while(num / 10 > 0) {
    num = num / 10;
    rear = num  % 10;
    System.out.println(rear);
}

/* ------------------------------------ */
public static int test3(int num) {
    int result = 0;
    while (num > 0) {
        result = result * 10 + num % 10;
        num /= 10;
    }
    return result;
}
```

:::tip 说明
`break` 和 `continue` 只对当前层次的循环有效，且它们的后面都不能再直接有任何语句。
:::

### 标签  

默认情况下，`break` 和 `continue` 都是对最近的一层循环有效，如果我们想要对最外层的循环有效，那么可以加上 label。 

```java
// label 只是一个标识符，可以任取
label:for (int i = 0; i < 6; i++) {
    for (int j = 1; j < i; j++) {
        if (j % 2 == 0) {
            break label;
            // continue label;
        }
        System.out.println(j);
    }
    System.out.println("外层");
}
```

### for 循环
for 循环的结构大致为：初始化条件 -> 判断 -> 执行循环体 -> 循环体结束后执行其它代码。
```java
/* --------------------- */
// 初始化条件: int i = 0 （只执行一次）
// 判断: i < 3
// 执行循环体: System.out.println("hello");
// 循环体结束后执行另外的: i++

for (int i = 0; i < 3; i++) {
    System.out.println("hello");
}
```
for 循环中如果有多个条件或判断，请用逗号隔开。
```java
int i = 1, j = 0;
for (System.out.println('a'), j--; i <= 3 && true; System.out.println("i++:"), i++) {
    System.out.println("循环体");
}
```
在 for 循环中定义的 `i` 只在 for 循环内有效。
