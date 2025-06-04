# 数据类型

JavaScript 有六种数据类型，包括五种基本类型和 `Object`（引用）。

- 五种基本类型  
  
  `Number`、`String`、`undefined`、`null`、`Boolean`

- 对象类型  

  `Object`（其实数组和函数也是 `Object`）、数组、函数

## 判断数据类型  

- **typeof**  

  返回值是数据类型的字符串形式。对 `null` 使用时，会返回 "object"；对函数使用时，会返回 "function"；对数组使用时，会返回 "object"。

- **instanceof**  

  判断具体的对象类型，返回 `true` 或 `false`。

- **===**  

  在比较数据时，尽量使用全等，因为它不会进行类型转换，而普通等号会进行类型转换。

## `undefined` 与 `null` 的区别

- **undefined**  
  
  变量有定义，但是未赋值。

- **null**  

  变量有定义，且赋值为 `null`。

**何时使用 `null`?**  

- 赋初值
- 释放资源  


当我们不再使用某个对象、函数等，我们可以给它赋值为 `null`，让它成为垃圾对象，进而被垃圾回收机制回收。

## 包装类

JavaScript 提供了三个包装类，可以将基本数据类型装换为对象。

### Number

将基本数据类型的 number 装换为 Number 对象。

```js
var a = 123;
var b = new Number(3);
console.log(typeof a); // number
console.log(typeof b); // Object
```

:::warning 注意事项 
```js
var a = 123;
var a2 = new Number(123);
var b = new Number(3);
var c = new Number(3);
console.log(typeof a);
console.log(typeof b);
console.log(b == c); // false
console.log(a == a2); // true
console.log(a === a2); // false
```
:::

### String

将基本数据类型的 string 装换为 String 对象。

```js
var str1 = '123';
var str2 = new String('123');
console.log(typeof str1);
console.log(typeof str2);
```

### Boolean

将基本数据类型的 boolean 装换为 Boolean 对象。

```js
var boo1 = true;
var boo2 = new Boolean(true);
console.log(typeof boo1);
console.log(typeof boo2);
```

:::warning 注意事项 

先来看以下代码的执行结果。

```js
var a = new Boolean(true);
var b = new Boolean(false);
if (a) {
  console.log(true);
}
if (b) {
  console.log(true); // 也会执行
}
```

原因：对象类型转换为 boolean 时，都会返回 true。

```js
console.log(Boolean({})); // true
```
:::

两个对象比较时，比较的是其内存地址。所以，一般不用包装类。


## 注意事项

基本数据类型没有可以调用的方法和属性。请看以下代码：

```js
var a = 123;
var b = a.toString();
console.log(typeof b);
console.log(typeof a);
```

从以上代码可以看到，基本数据类型的变量 `a` 调用了一个 `toString()` 方法，这是否很矛盾？其实，当基本数据类型调用方法时，会先将其临时转换为包装类对象，然后再调用对象的属性和方法，方法调用完后，包装类对象立即被销毁。请见[**包装类**](#包装类)。  

请思考以下代码的运行结果：

```js
var a = 123;
a.name = 'ss';
console.log(a.name); // undefined ?
```
