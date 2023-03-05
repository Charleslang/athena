# 随机数

- `Math.random()`  

  范围 `[0,1)`。Math 在 `java.lang` 包中，所以可以直接使用，而无需导包，其返回值是 **double** 类型。

- 坑  

  ```java
  int a = (int)Math.random() * 900 + 100; // 0 * 900 + 100 = 100
  int b = (int)(Math.random() * 900) + 100;
  ```

- `new Random().nextInt(n)`  

  返回 `[0, n)` 的随机整数。

:::tip 提示
产生 [m, n] 的随机整数公式：`(int)(Math.random() * (m - n + 1) + min(m, n))`。
:::
