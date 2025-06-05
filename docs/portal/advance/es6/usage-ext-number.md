# `Number` 扩展

在 ES6 中，`Number` 对象有了很多新的方法和属性，使得数字的处理更加方便。

- `Number.EPSILON`  

    它是 js 中表示的最小精度，通常用于浮点数之间的比较和计算。

    ```js
    let a = 0.2, b = 0.1
    // console.log(a+b === 0.3) // false
    function c(x, y) {
    if(Math.abs(x - y) < Number.EPSILON) {
        return true
    }
    return false
    }
    console.log(c(0.1 + 0.2, 0.3))
    ```

- 进制表示  

    ```js
    let a = 0b101
    let b = 0o123
    let c = 0xff
    ```

- `Number.isFinite()`  

    判断一个数是否是有限小数。

    ```js
    console.log(Number.isFinite(100/0))
    ```

- `Number.isNaN()`  

    判断是否是 `NaN`，如果是，则返回 `true`。

    ```js
    console.log(isNaN(NaN))
    console.log(Number.isNaN(NaN))
    ```

- `Number.parseInt()` 和 `Number.parseFloat()`
- `Number.isIntege()r`
- `Math.trunc()`  

    去掉小数部分。

    ```js
    console.log(Math.trunc(3.11))
    ```

- `Math.sign()`  

    判断一个数是正数、负数还是 `0`，分别返回 `1`、`-1`、`0`。

    ```js
    console.log(Math.sign(1))
    console.log(Math.sign(0))
    console.log(Math.sign(-9))
    ```

- 指数运算符 `**`  

    用于计算幂。

    ```js
    console.log(2 ** 3)
    console.log(Math.pow(2, 3))
    ```
