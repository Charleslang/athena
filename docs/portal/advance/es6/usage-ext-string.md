# String 扩展

ES6 对字符串进行了扩展，新增了一些方法来处理字符串。以下是一些常用的字符串扩展方法：

- `boolean startWith()`
- `boolean endWith()`
- `repeat()`  

    将原字符串重复 `n` 次，返回一个新的字符串。

    ```js
    let str = '哈哈'
    console.log(str.repeat(3))
    ```

- `trimStart()` 和 `trimEnd()`

    ```js
    let str = '   str   '
    console.log(str.trimStart())
    console.log(str.trimEnd())
    ```
- `padStart()` 和 `padEnd()`  

    用于填充字符串，使其达到目标长度 (如果不指定填充字符串，则默认填充空格) 。

    ```js
    // 通常用于处理时间, 在前面补零
    // 在字符串 1 的前面用 0 填充, 使其长度达到 2 位
    "1".padStart(2, 0); // "01"
    // 在字符串 1 的后面用 0 填充, 使其长度达到 2 位
    "1".padEnd(2, 0); // "10"

    "".padStart(3, "ab") // aba
    "1".padStart(2) // " 1"
    ```
