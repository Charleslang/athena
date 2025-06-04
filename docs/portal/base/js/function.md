# 函数

:::tip 说明
函数也是一个对象，只不过函数中可以封装某些功能。 
:::

## 创建函数

```js
// 方式一
// 此方式基本不用
var fun = new Function("console.log('hello')");
console.log(typeof fun); // function

// 方式二
// 使用函数声明的方式
function myFunction() {
  console.log('hello');
}

// 方式三
// 使用函数表达式（匿名函数）
var funExp = function() {
  console.log('hello');
};
```

## 执行函数

```js
// 方式一
fun();

// 方式二
myFunction();

// 方式三
funExp();
```

## 函数参数

函数中的参数默认值是 `undefined`。

```js
function a(e) {
  console.log(e); // undefined
}
```

## 函数作为参数

```js
function myAdd() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  console.log(sum);
  return sum;
}
function fun1(a) {
  a(1,2,3);
}
fun1(myAdd); // 传递函数对象，调用 myAdd 函数

// 做如下修改
function fun1(a) {
  console.log(a); // myAdd(1,2);
}
fun1(myAdd(1,2));// 相当于使用 myAdd 的返回值。
```

## 函数作为返回值

```js
function myAdd() {
  function a() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
  }
  // 注意返回值带括号和不带括号的区别
  // 不带括号表示返回该函数（对象）
  // 带括号表示调用该函数，返回被调用函数的返回值（函数的返回值默认是 undefined）
  return a;
}

var c = a;
c();
```

## 立即执行函数

立即执行函数也被称为 IIFE，函数被定义后立即执行，但是只会执行一次。而且函数会隐藏其实现过程，也不会污染全局的命名空间。

```js
// 无参
(function() {
  console.log("立即执行");
})();

// 有参
(function(x, y) {
  console.log(x+y);
})(1, 2);
```
```js
(function() {
  var a = 1;
  function test() {
    consloe.log(++a);
  }
  window.$ = function() { // 向外暴露函数
    return {
      test: test
    };
  }
})()

$().test()
```

:::tip 说明
JavaScript 中的函数，不会检查函数参数的类型和参数的个数。函数的默认返回值是 `undefined`。
:::

## 回调函数

回调函数不由用户调用，它是由系统调用，如 DOM 事件的回调函数、定时器的回调函数。

## 函数的方法

函数也是对象，所以，函数也有方法。

### call

当函数调用该方法时，函数会被调用并执行。该方法可以将对象指定为函数的**第一个**参数，此时 `this` 就是传入的对象（即参数是谁，`this` 就是谁）。

```js
function fun() {
  console.log(this);
}
fun(); // window
fun.call(); // window
var obj = [];
fun.call(obj); // []
``` 

此外，可以将对象在实参之后依次排列。

```js
var obj1 = {
  name:'obj1',
  method:function() {
    console.log(this.name);
  }
}

function f(a,b) {
  console.log("a=" + a);
  console.log("b=" + b);
}

f.call(obj1); // a 和 b 都是 undefined
f.call(obj1,1,2); // a = 1,b = 2
```

### apply

当函数调用该方法时，函数会被调用并执行。该方法可以将对象指定为函数的第一个参数，此时 `this` 就是传入的对象（同 `call`）。

```js
var obj1 = {
  name:'obj1',
  method:function() {
    console.log(this.name);
  }
}

var obj2 = {
  name:'obj2',
  method:function() {
    console.log(this.name);
  }
}

obj1.method.call(obj2); // obj2
```

apply 的特性和 call 的特性稍有不同，在传递参数时，apply 需要把多余的参数封装到一个数组中。

```js
var obj1 = {
  name:'obj1',
  method:function() {
    console.log(this.name);
  }
}

function f(a,b) {
  console.log("a="+a);
  console.log("b="+b);
}

f.apply(obj1);
f.apply(obj1,[1,2]);
```

:::tip 说明
这两个方法实际上可以理解为，如果某个对象没有该方法，那么，可以通过 call 或 apply 让该对象临时拥有该方法，并且调用该方法。
:::

## arguments

浏览器传入函数的隐藏参数，它是一个**类数组**对象。函数的所有形参都会被封装到该对象中。

```js
function f() {
  console.log(arguments instanceof Array); // false
  console.log(Array.isArray(arguments)); // false
}
```

### callee 属性

`arguments` 通过调用该属性可以打印当前函数对象。

```js
function f() {
  console.log(arguments.callee == f); // true
}
```
