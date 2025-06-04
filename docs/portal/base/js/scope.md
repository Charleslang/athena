# 作用域

## 全局作用域

直接编写在 `<script></script>` 中的代码就在全局作用域中。全局作用域在页面打开时创建，页面关闭时销毁。全局作用域中有一个全局对象 window（Window 对象），该对象由浏览器创建。

### 全局对象 window

```js
console.log(window);
```

我们所创建的所有全局变量、函数等都被放在了 window 对象中。

```js
var a = 10;
console.log(a);
console.log(window.a);
console.log(window.c); // undefined
console.log(d); // 报错，没有定义; 此时不等价于 window.d

function fun() {
  console.log(1);
}
window.fun();
window.alert(123);
```

### 变量声明提前

也称为变量提升。在 JS 执行时，所有变量的 **声明**（只是变量的声明，如果在声明时赋了初值，则不会带上初值）都会被提前。此方式只是针对通过 **var** 声明的变量。 

- 通过 `var` 声明

  ```js
  console.log(a); // undefined
  var a = 10;

  // 等价代码如下
  var a;
  console.log(a);
  a = 10;
  ```

- 没有通过 `var` 声明

  ```js
  console.log(a); // 报错
  a = 10;
  console.log(window.a); // 10
  ```

  但是，此方式中的 a 仍是一个全局变量，并且可以通过 window 对象访问。

### 函数声明提前

也称为函数提前。JS 在执行时，会将所有函数的 **声明** 提前。

- 函数声明的方式  

  此方式会将函数的声明提前，并且函数可以被调用。

  ```js
  fun();
  function fun() {
    // ...
  }
  ```

- 函数表达式  

  此方式只是将函数的声明提前（变量声明提前之后），但是不可提前调用。

  ```js
  fun(); // 报错
  console.log(fun); // undefined
  var fun = function() {
    // ...
  }

  // 等价代码如下
  var fun;
  fun(); // 报错，因为 fun 不是一个函数对象
  console.log(fun); // undefined
  fun = function() {
    // ...
  }
  ```

## 函数作用域

:::tip 小贴士
函数作用域也称为局部作用域。 
::: 

函数作用域在调用时创建，函数被执行完成后销毁。每调用一次函数都会创建一个新的函数作用域，各自之间相互独立。在函数中也遵守全局中的某些特点，如变量声明提前，函数声明提前。因此，函数也可以被看做成一个小的全局。

- **示例1**  

  ```js
  var a = 20;
  function fun() {
    console.log(a); // 10，即 window.a
  }
  ```

- **示例2**  

  ```js
  function fun() {
    console.log(a); // undefined
    var a = 10;
  }

  // 等价代码如下
  function fun() {
    var a;
    console.log(a);
    a = 10;
  }
  ```

- **示例3**  

  ```js
  var a = 30;
  function fun() {
    var a = 10;
    function b() {
      console.log(a); // 10
      console.log(window.a); // 30
    }
    b();
  }
  ```

- **示例4**  

  ```js
  var a = 10;
  function fun() {
    console.log(a); // undefined
    var a = 30;
  }
  fun();
  ```

- **示例5**

  ```js
  function fun() {
    d = 10; // window.d = 10
  }
  fun();
  console.log(d); // 10
  ```

- **示例6**

  ```js
  var a = 10;
  function fun(a) {
    console.log(a);
  }
  fun(); // undefined
  fun(11); // 11
  ```

- **示例7**

  ```js
  var a = 10;
  function fun(a) {
    console.log(a);
    a = 99; // 将传入的 a 变为了 99，并没有改变全局
  }
  fun(); // undefined
  console.log(a); // 10
  ```

- **示例8**

  ```js
  var x = 10;
  function fu() {
    console.log(x);
  }
  function f(fu) {
    var x = 20;
    fu()
  }

  f(fu); // 输出 10，fu 被定义时，它的作用域就确定了
  ```

- **示例9**

  ```js
  var fn = function () {
    console.log(fn);
  }
  fn() // 输出该函数的主体
  var obj = {
    f2: function () {
    console.log(f2);
    }
  }
  obj.f2() // 报错，f2 未定义; 此处要注意变量名 f2
  var obj = {
    f2: function () {
    console.log(this.f2);
    }
  }
  obj.f2() // 输出 f2 函数
  ```

## 注意事项

ES5 中只有**全局作用域**和**函数作用域**，没有块（即大括号）作用域。

```js
console.log(a)// undefined
if (true) {
  var a = 10
}
console.log(a) // 10
// 上面的代码中，a 被定义在了 if 这个语句块（即大括号）中
// 但是 a 还是被当成了全局变量，并且把 a 的声明提前了，等价代码如下: 
var a
console.log(a)
if (true) {
  a = 10
}
console.log(a)

/*-------------------------------------*/
function f() {
  console.log(a)
  if (true) {
    var a = 10
  }
  console.log(a)
}
f() // 打印结果和上面的代码相同，原理也相同，等价于: 
function f() {
  var a
  console.log(a)
  if (true) {
    a = 10
  }
  console.log(a)
}

/* for 循环也是这样 */
```

**只要是未在函数中定义的变量，都属于全局变量（前提是使用 `var` 定义）**。
