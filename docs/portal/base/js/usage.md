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

### 布尔转换

Boolean 对象是一个布尔值的对象包装器。

`Boolean()` 构造函数可以创建 Boolean 对象或返回布尔类型的原始值。其语法如下：

```js
// 创建 Boolean 对象
new Boolean(value)
// 返回布尔类型的原始值。等价于 const x = true 或者 const x = false
Boolean(value)
```

当 `Boolean()` 作为构造函数调用时（使用 `new`），将创建 Boolean 对象，它不是一个原始值。

```js
new Boolean(value)
```

当 `Boolean()` 作为普通函数调用时（不使用 `new`），它将参数强制转换为布尔原始值。如果需要，作为第一个参数传递的值将转换为布尔值。如果省略该参数或参数值为[假值](#真值与假值)，则该对象具有的初始值为 false。所有其他值，包括任何对象，空数组（`[]`）或字符串 "false"，都会创建一个初始值为 true 的对象。

```js
Boolean(value)
```

注意，不要将基本类型中的布尔值 true 和 false 与值为 true 和 false 的 Boolean 对象弄混了。

```js
const x = new Boolean(false);
if (x) {
  // 这里的代码会被执行
}

const y = false;
if (y) {
  // 这里的代码不会被执行
}
```

对于任何对象，即使是值为 false 的 Boolean 对象，当将其传给 Boolean 函数时，生成的 Boolean 对象的值都是 true。

```js
// 注意，myFalse 在 if 条件中的返回值是 true
const myFalse = new Boolean(false); // initial value of false
const g = Boolean(myFalse); // initial value of true
const myString = new String("Hello"); // string object
const s = Boolean(myString); // initial value of true
```

以初始值 false 创建 Boolean 对象：

```js
const bNoParam = new Boolean();
const bZero = new Boolean(0);
const bNull = new Boolean(null);
const bEmptyString = new Boolean("");
const bfalse = new Boolean(false);
```

以初始值 true 创建 Boolean 对象：

```js
const btrue = new Boolean(true);
const btrueString = new Boolean("true");
const bfalseString = new Boolean("false");
const bSuLin = new Boolean("Su Lin");
const bArrayProto = new Boolean([]);
const bObjProto = new Boolean({});
```

可以使用 Boolean 对象的 `valueOf()` 方法返回 Boolean 对象的原始值。

```js
const bNoParam = new Boolean();
// 输出 false
console.log(bNoParam.valueOf());

const bZero = new Boolean(0);
// 输出 false
console.log(bZero.valueOf());
```

:::tip
参考 [Boolean](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)。
:::

:::warning
上面提到的 Boolean 对象的原始值就是 Boolean 的字面量表示形式 true 或者 false。
:::

:::danger
你会发现你很少会使用到 Boolean 构造函数，除非你需要将一个值转为布尔类型。但是，推荐使用[双非运算符（!!）](#双非运算符)转为布尔类型。也不要用创建 Boolean 对象的方式将一个非布尔值转化成布尔值，直接将 Boolean 当做转换函数来使用即可，或者使用[双非运算符（!!）](#双非运算符)：

```js
// 使用 Boolean 转换函数
const x = Boolean(expression); // use this...
// 使用双非运算符
const x = !!expression; // ...or this
// 创建 Boolean 对象
const x = new Boolean(expression); // don't use this!
```
:::

## 逻辑与或运算

从左往右评估每个表达式，将各个表达式进行运算，然后把运算结果转化为 `boolean` 类型的值，根据转换后的值判断是否需要执行后续的表达式。规则如下：

- 对于 `||` 运算符来讲，碰到第一个为 “真值” 的就立即返回 “真值” 的运算结果。
- 对于 `&&` 运算符来讲，碰到第一个为 “假值” 的就立即返回 “假值” 的运算结果。

```js
var a = 1 && 2; // 2，即 true && true
var b = 0 && 1; // 0，即 false && true
var c = 1 && 0; // 0
var d = NaN && 0; // NaN，即 false && false
var e = 1 || 2; // 1
var f= '' || 123; // 123，即 false && true
```

JavaScript 中的逻辑与或和 Java 中的有些不同，Java 中的 `&&`、`||` 返回的是 boolean，而 JavaScript 中返回的是表达式的运算结果。

```java
int a = 1, b = 0, c = 3;
// result 的值是 true
boolean result = a > b && c > b;
```
```js
const a = 1, b = 0, c = 3;

// result 的值是 true
const result = a > b && c > b;

// num 的值是 0
const num = a && b && c
```

如果需要实现和 Java 类似的效果，请使用 [双非运算符（!!）](#双非运算符)或者[布尔转换](#布尔转换)。

## 真值与假值

真值和假值是 JavaScript 中非常重要的概念，它们经常出现在条件判断中。能够转化为 true 的值叫做真值，能够转化为 false 的值叫做假值。

- 假值是在布尔上下文中认定为 false 的值。
- 真值是在布尔值上下文中，转换后的值为 true 的值。被定义为假值以外的任何值都为真值。

下面的表格列出了 JavaScript 中所有的假值。

|值|类型|描述|
|---|---|---|
|null|Null|关键词 null。|
|undefined|Undefined|原始类型的缺省值。|
|false|Boolean|关键字 false。|
|NaN|Number|Not a Number，表示不是一个数字。|
|0|Number|Number 零，也包括 0.0、0x0 等。|
|-0|Number|Number 负的零，也包括 -0.0、-0x0 等。|
|0n|BigInt|BigInt 零，也包括 0x0n 等。需要注意没有 BigInt 负的零，0n 的相反数还是 0n。|
|""|String|空字符串值，也包括 '' 和 ``。|
|document.all|Object|唯一具有假值的 JavaScript 对象是内置的 document.all。|

## 空值

在 JavaScript 中，只有 null 和 undefined 才是空值（nullish value）。空值总是假值。

## 双非运算符（!!）

可以使用 2 个非运算符（`!`）串联起来，明确地强制将任何值转换为相应的布尔基本类型。这种转换是基于真值和假值的。

```js
!!true; // true
!!{}; // true
!!new Boolean(false); // true
!!false; // false
!!""; // false
!!Boolean(false); // false

!!(1 || 2 || 3); // true
!!(0 && 1); // false
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
