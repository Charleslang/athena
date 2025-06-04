# 闭包

学习闭包之前，先来看一段代码。

```js
var btns = document.getElementsByTagName('button')
// var length = btns.length 
// 也可以把 length 写在 for 循环中
for (var i = 0,length = btns.length; i < length; i++) {
  btns[i].index = i;
  btns[i].onclick = function() {
    console.log(this.index + 1)
  }
}
```
上面的代码其实很简单，就是为每一个按钮添加了一个点击事件。相应的按钮被点击时，输出它是第几个按钮。改进如下：

```js
var btns = document.getElementsByTagName('button')
for (var i = 0,length = btns.length; i < length; i++) {
  (function(i) {
    btns[i].onclick = function() {
    console.log(i + 1)
  }
  })(i)
}
```

这就用到了闭包，下面，我们就来解释一下什么是闭包。

## 概述

什么是闭包？

- 理解一：闭包就是嵌套的内部函数
- 理解二：包含被引用变量（或函数）的对象  

但是，无论怎么理解，闭包就是存在于内部函数中（前提是必须调用外部函数）。

```js
function a() {
  var x = 2;
  var y = 3;
  function b() {
    console.log(x)
  }
}
a()
// 其中就产生了闭包, 因为函数 b 使用了函数 a 中的变量 x
// 外部函数 a 被调用, 所以产生了闭包
```

## 原理

那么，什么时候才会产生闭包呢？当一个嵌套的内部（子）函数使用了父函数的变量（或函数），内部函数有定义（或声明），且外部函数被执行时，就产生了闭包。闭包中存放的是内部函数使用的变量（或函数）。

```js
function a() {
  var x = 2;
  var y = 3;
  function b() {
    console.log(x)
  }
}
a()
// 其中就产生了闭包, 因为函数 b 使用了函数 a 中的变量 x
// 如果内部函数 b 没有使用 x 和 y, 那么, 不会产生闭包
```

外部函数每被调用一次，就产生一个闭包。外部函数被调用，且内部函数有定义（声明）时，闭包才产生。上述代码在 `var x = 2` 时就产生了闭包（因为函数声明会被提前）。

## 作用

```js
function f1() {
  var a = 1;
  function f2() {
    a++
    console.log(a)
  }
  return f2
}
var f = f1()
f() // 输出2
f() // 输出3
```

上面的示例中是否有矛盾的地方呢，a 是局部变量，当函数 f1 被执行完成后就应该消失，但是为什么第二次的输出是 3，这就是闭包的作用。闭包能延长局部变量的生命周期，外部函数使用完后，它的局部变量仍存在于内存中。闭包能使函数外部可以操作函数内部的变量（或函数）。

## 生命周期

- 示例一

  ```js
  function f1() {
    var a = 1;
    function f2() {
      a++
      console.log(a)
    }
    return f2
  }
  var f = f1()
  f() // 输出 2
  f() // 输出 3 
  ```

  外部函数 f1 被调用时，产生闭包（在 `var a = 1` 时就产生），当 `f=null` 时，闭包被消除。

- 示例二
  
  ```js
  function f1() {
    var a = 1;
    var f2 = function () {
      a++
      console.log(a)
    }
    return f2
  }
  var f = f1()
  f() // 输出 2
  f() // 输出 3
  ```

  外部函数 f1 被调用时，产生闭包（在 `var f2 = function() {}` 被执行完成后才产生闭包，因为此时才有内部函数的声明），当 `f=null` 时，闭包被消除。

## 自定义 JS 模块

使用闭包来向外暴露我们的接口。

- `myModule.js`

  ```js
  function f () {
    var msg = 'hello'
    function f1() {
      console.log('f1()=>'+msg.toUpperCase())
    }
    function f2() {
      console.log('f2()=>'+msg.toLowerCase())
    }
    return {
      f1:f1
      f2:f2
    }
  }
  ```
  ```js
  // 引入 myModule.js
  // ...
  // 然后使用
  var module = f();
  module.f1()
  module.f2()
  ```

- `myModule2.js`

  ```js
  (function (){
    var msg = 'hello'
    function f1() {
      console.log('f1()=>'+msg.toUpperCase())
    }
    function f2() {
      console.log('f2()=>'+msg.toLowerCase())
    }
    window.myModules = {
      f1:f1
      f2:f2
    }
  })()
  ```
  ```js
  // 引入 myModule2.js
  // ...
  // 然后使用
  myModules.f1()
  myModules.f2()
  ```

## 缺点

使用闭包可能会使变量一直占用内存，从而造成内存泄露。因此，能不使用闭包时，就不使用；或者及时释放内存。

## 示例

- 示例一

  ```js
  var name = 'The Window'
  var obj = {
    name: 'The Obj'
    fun: function() {
      return function() {
        return this.name
      }
    }
  }
  console.log(obj.fun()()) // The Window
  ```

  此示例中没有闭包。

- 示例二

  ```js
  var name = 'The Window'
  var obj = {
    name: 'The Obj'
    fun: function() {
      var that = this
      return function() {
        return that.name
      }
    }
  }
  console.log(obj.fun()()) // The Obj
  ```
  
  此示例中含有闭包。
