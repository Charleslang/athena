

# 正则表达式

:::tip 提示
:point_right: [戳这里](https://www.runoob.com/regexp/regexp-metachar.html)参考正则表达式元字符。

---

更多用法请参考 :point_down:
- [https://www.runoob.com/regexp/regexp-syntax.html](https://www.runoob.com/regexp/regexp-syntax.html)
- [https://www.runoob.com/w3cnote/reg-lookahead-lookbehind.html](https://www.runoob.com/w3cnote/reg-lookahead-lookbehind.html)
:::

**`?:`、`?=`、`?<=`、`?!`、`?<!` 的使用和区别**  

- **(?=pattern) 正向先行断言**

  ```js
  // 给定字符串 "a regular expression", 要想匹配 regular 中的 re，但不能匹配 expression 中的 re，即 re 后面只能是 gular
  var result = /re(?=gular)/.test('a regular expression')
  
  // 将表达式改为 re(?=gular).，将会匹配 reg，因为元字符 . 匹配了 g，括号这一砣匹配了 e 和 g 之间的位置。
  ```

- **(?!pattern) 负向先行断言**

  ```js
  // 给定字符串 "regex represents regular expression"，要想匹配除 regex 和 regular 之外的 re，即 re 后面不能是 g
  var result = /re(?!g)/.test('regex represents regular expression')
  ```

- **(?<=pattern) 正向后行断言**

  ```js
  // 给定字符串 "present recent", 想要匹配 recent 中的 ent, 即 ent 之前只能是 rec
  var result = /(?<=rec)ent/.test('present recent')
  ```
- **(?<!pattern) 负向后行断言**

  ```js
  // 给定字符串 "present recent", 想要匹配 present 中的 ent, 即 ent 之前不能是 rec
  var result = /(?<!rec)ent/.test('present recent')
  ```