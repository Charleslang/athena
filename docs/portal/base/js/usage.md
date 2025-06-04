# 基本语法

## 忽略空格和回车

```js
// 下面的代码也能正常执行
alert
("
123
");
```

## 强制类型转换

### `Number` 转化为其他类型

- 转化为 `String`   
  
  将数字加上引号。

- 转化为 `Boolean`  

  只有数字 `0` 会转化为 `false`，其它都是 `true`。

- 转化为 `null`  

  报错。

- 转化为 `undefined`  

  报错。

- 转化为 `Object`  

  就是将其转化为 `Number` 类型。

### `String` 转化为其他类型

- `String` 转为 `Number`

    - `Number()` 函数 

    ```js
    var a = 123x;
    var b = Number(a); // NaN
    ```

    - `parseInt()` 函数

    ```js
    var a = 123x56;
    var b = Number(a); // 123
    ```

    - `parseFloat()` 函数
    
    ```js
    var a = 123.2pxx56;
    var b = Number(a); // 123.2
    ```

- `String` 转 `Boolean`  

  只有空串会转化为 `false`。

### `Boolean` 转换为其它类型

- `Boolean` 转换为 `Number`  

  `true` 为 `1`，`false` 为 `0`

- `Boolean` 转换为 `String`  

  "true"，"fasle"

- `Boolean` 转换为 `null`   

  报错

- `Boolean` 转换为 `undefined`  
  
  报错

- `Boolean` 转换为 `Object`   

  转换成 `Boolean` 类型

### `null` 转换为其它类型

- 转换为 `Number`  

  结果为 `0`

- 转换为 `String`  
  
  结果为 "null"

- 转换为 `Boolean`  
  
  结果为 `false`

- 转换为 `undefined`  

  报错
  
- 转换为 `Object`  

  结果为 `{}`

### `undefined` 转换为其它类型

- 转换为 `Number`  

  `NaN`

- 转换为 `String`  

  结果为 "undefined"

- 转换为 `Boolean`  

  结果为 `false`

- 转换为 `Object`  

  结果为 `{}`

### `Object` 转换为其它类型

- 转换为 `Number`  
  
  `NaN`

- 转换为 `String`  
  
  在对象两边加上引号

- 转换为 `Boolean`  
  
  永远为 `true`

### 数组转换为 Number

空数组（即 `[]` 或 `new Array()`）在转换成 `Number` 时，会返回 0；如果不是空数组，则会返回 `NaN`。

## 与或运算

先将各个数转化为 `boolean` 类型，然后再判断。

```js
var a = 1 && 2; // 2 即true && true
var b = 0 && 1; // 0 即false && true
var c = 1 && 0; // 0
var d = NaN && 0; // NaN 即false && false
var e = 1 || 2; // 1
var f= '' || 123; // 123 即false && true
```

## 特殊符号

请参见 `Unicode` 编码。

```js
console.log("\u1236");
```
```html
<!-- html 中使用 -->
<!-- 这里的 2365 是 10 进制，原生的 unicode 是 16 进制，所以需要转化 -->
&#2365;
```

## 代码块

使用大括号表示，里面的代码要么全都执行，要么全都不执行。代码块内部的内容依然可以被外部获取。

```js
{
  console.log(123);
  document.write('hello world');
}
```

## 分号问题

对于代码后面加不加分号的讨论，网上有很多。在正常情况下，可加可不加。比如 Vue 的源码中就没有分号，但是以下几种情况必须加分号。 

- **小括号开头**  

  如果某条语句是 `()` 开头，则前面必须加分号。

  ```js
  var a = 3;
  (function() {
    // ...
  )()
  ```
  ```js
  ;(function() {
    // ...
  )()
  ```

- **中括号开头**  

  中括号开头的前一条语句必须加分号。

  ```js
  var b = 1;
  [1,3].foreach(function() {

  })
  ```
