# 正则表达式

## 创建正则表达式

有两种方法来创建匹配模式，如下：

- 通过 RegExp 对象创建  

  ```js
  var reg = new RegExp("a","i");
  ```

- 使用字面量创建  

  ```js
  // 不用加引号
  var reg = /a/i;
  ```

两者的区别如下：

```js
var reg = new RegExp("\\.");
// 等价形式如下
var reg = /\./;
```

## test() 

检索字符串中指定的值，返回 true 或 false。

```js
var reg = new RegExp("a");
var str = "abc";
console.log(reg);
console.log(reg.test(str)); // true
```

## 匹配模式

- 或  

  ```js
  var reg = /a|b|c/; // /[a|b|c]/或者/[abc]/ 或者 /(a|b|c)/
  ```

- 是否含有字母  

  ```js
  reg = /[A-Z|a-z]/;
  reg = /[a-z]/i;
  reg = /[A-z]/;
  ```

- 除掉某个字符  

  ```js
  reg = /[^ab]/; // 匹配除了 ab 以外字符。
  reg.test("cab"); // true
  ```

- 任意数字  

  ```js
  reg = /[0-9]/;
  ```

- 是否含有某个子串  

  ```js
  reg = /abc/;
  ```

- { }  

  - n{ X }	&nbsp;&nbsp;匹配包含 X 个 n 的序列的字符串。  
  - n{ X, Y }	&nbsp;&nbsp;匹配包含 X 至 Y 个 n 的序列的字符串。  
  - n{ X, }	&nbsp;&nbsp;匹配包含至少 X 个 n 的序列的字符串。

  ```js
  reg = /a{3}/;
  console.log(reg.test("aaaaaa12346"));
  ```

  ```js
  reg = /(ab){3}/;
  console.log(reg.test("abababa12346"));
  ```

- \w  

  任意字母、数字、下划线。

- \W  

  和 \w 相反。

- \b  

  通常用来检查是否含有某个单词。

  ```js
  reg = /\bchina\b/;
  ```

- 是否全是数字  

  ```js
  reg = /^\d{3}$/;
  console.log(reg.test("123m"));
  ```

- 只含有某个数字  

  ```js
  reg = /^\d$/;
  console.log(reg.test("1"));
  ```

- 去掉前后的空格  

  ```js
  // 使用 tirm()
  console.log("  1  3  ".trim());
  // 使用正则表达式
  console.log("  1  3  ".replace(/^\s*|\s*$/g,""));
  // console.log("  1  3  ".replace(/^\s+|\s+$/g,""));
  ```

- 判断是否全是空格  

  ```js
  console.log("     ".replace(/^\s*$/,"") == "");
  // console.log("     ".replace(/^\s+$/,"") == "");
  ```

- 检查手机号  

  ```js
  reg = /^1([358]\d|4[01456789]|6[2567]|7[012345678]|9[012356789])\d{8}$/;
  console.log(reg.test("15023456789"));
  ```

- 检查邮箱  

  ```js
  reg = /^\w+([-\.]\w+)*@[A-z\d]+(\.[A-z\d]{2,6}){1,2}$/;
  console.log("邮箱: "+reg.test("ddd-2@qq.com.cn");
  ```
