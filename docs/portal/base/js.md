---
sidebar: ['/portal/base/js.html']
---

# JavaScript

## 简介
ECMAScript 是 JavaScript 的标准, JavaScript 是 ECMAScript 的实现, 可以认为 JavaScript 包含 ECMAScript、DOM、BOM。而不同的浏览器厂商需要实现各自的 ECMAScript, 即 JS 引擎。常见的有 Chrome 的 V8 引擎, 这也是最快的引擎, 所谓最快就是打开相同的网页时, Chrome 花费的时间最少。

## 特点
- 解释型语言  
  
  所谓解释型语言就是, 编码之后无需经过编译就能直接运行。

- 动态语言
- 基于原型的面向对象

## 编写位置
除了在 `<script></script>` 标签中编写外, 还可以在其它事件中编写。如下:   

- 在 `onclick` 等里面
  
  ```html
  <button onclick="alert('点击成功');">点击</button>
  ```

- 在 `href` 中  

  ```html
  <a href="javascript:alert('点击成功');">点击</a>
  ```

## 数据类型
JavaScript 有六种数据类型。包括五种基本类型和 `Object`（引用）。

- 五种基本类型  
  
  `Number`、`String`、`undefined`、`null`、`Boolean`

- 对象类型  

  `Object`（其实数组和函数也是 `Object`）、数组、函数

### 判断数据类型  

- **typeof**  

  返回值是数据类型的字符串形式。对 `null` 使用时, 会返回 "object";  对函数使用时, 会返回 "function"; 对数组使用时, 会返回 "object"。

- **instanceof**  

  判断具体的对象类型, 返回 `true` 或 `false`。

- **===**  

  在比较数据时, 尽量使用全等, 因为它不会进行类型转换, 而普通等号会进行类型转换。

### `undefined` 与 `null` 的区别

- **undefined**  
  
  变量有定义, 但是未赋值。

- **null**  

  变量有定义, 且赋值为 `null`。

**何时使用 `null`?**  
- 赋初值
- 释放资源  

  当我们不再使用某个对象、函数等, 我们可以给它赋值为 `null`, 让它成为垃圾对象, 进而被垃圾回收机制回收。


### 注意事项
基本数据类型没有可以调用的方法和属性。请看以下代码: 
```js
var a = 123;
var b = a.toString();
console.log(typeof b);
console.log(typeof a);
```
从以上代码可以看到, 基本数据类型的变量 `a` 调用了一个 `toString()` 方法, 这是否很矛盾？其实, 当基本数据类型调用方法时, 会先将其临时转换为包装类对象, 然后再调用对象的属性和方法, 方法调用完后, 包装类对象立即被销毁。请见[**包装类**](#包装类)。  

请思考以下代码的运行结果: 
```js
var a = 123;
a.name = 'ss';
console.log(a.name);// undefined ?
```
## 基本语法
### 忽略空格和回车
```js
// 下面的代码也能正常执行
alert
("
123
");
```
### 强制类型转换
#### `Number` 转化为其他类型
- 转化为 `String`   
  
  将数字加上引号。

- 转化为 `Boolean`  

  只有数字 `0` 会转化为 `false`, 其它都是 `true`。

- 转化为 `null`  

  报错。

- 转化为 `undefined`  

  报错。

- 转化为 `Object`  

  就是将其转化为 `Number` 类型。

#### `String` 转化为其他类型
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

#### `Boolean` 转换为其它类型
- `Boolean` 转换为 `Number`  

  `true` 为 `1`, `false` 为 `0`

- `Boolean` 转换为 `String`  

  "true", "fasle"

- `Boolean` 转换为 `null`   

  报错

- `Boolean` 转换为 `undefined`  
  
  报错

- `Boolean` 转换为 `Object`   

  转换成 `Boolean` 类型

#### `null` 转换为其它类型
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

#### `undefined` 转换为其它类型
- 转换为 `Number`  

  `NaN`

- 转换为 `String`  

  结果为 "undefined"

- 转换为 `Boolean`  

  结果为 `false`

- 转换为 `Object`  

  结果为 `{}`

#### `Object` 转换为其它类型
- 转换为 `Number`  
  
  `NaN`

- 转换为 `String`  
  
  在对象两边加上引号

- 转换为 `Boolean`  
  
  永远为 `true`

#### 数组转换为Number
空数组（即 `[ ]` 或 `new Array()`）在转换成 `Number` 时, 会返回 0; 如果不是空数组, 则会返回 `NaN`。

### 与或运算
先将各个数转化为 `boolean` 类型, 然后再判断。

```js
var a = 1 && 2; // 2 即true && true
var b = 0 && 1; // 0 即false && true
var c = 1 && 0; // 0
var d = NaN && 0; // NaN 即false && false
var e = 1 || 2; // 1
var f= '' || 123; // 123 即false && true
```

### 特殊符号
请参见 `Unicode` 编码
```js
console.log("\u1236");
```
```html
<!-- html 中使用 -->
<!-- 这里的 2365 是 10 进制, 原生的 unicode 是 16 进制, 所以需要转化 -->
&#2365;
```
### 代码块
使用大括号表示, 里面的代码要么全都执行, 要么全都不执行。代码块内部的内容依然可以被外部获取。
```js
{
  console.log(123);
  document.write('hello world');
}
```
## 对象
JavaScript 中除了 String、Number、Boolean、null、Undefined 这五种基本类型之外, 还有一种引用类型, 即 Object。所以, 只要一个数据不是以上五种基本数据类型, 那么, 它就是 Object。
### 内置对象
任何 ES 的实现都可以使用 ES 提供的内置对象。
### 宿主对象
由浏览器提供的对象, 如 DOM、BOM 等。
### 自定义对象

- 创建对象  
  
  ```js
  // 方式一
  var person = {

  };

  // 方式二
  var obj = new Object();
  ```
- 设置属性值 

  ```js
  // 方式一
  // 此方式是通过对象字面量来来创建对象
  // 此方式的属性名可以加引号, 也可以不加, 但是特殊的变量名必须加
  var person = {
    name:'张三',
    'age':12,
    birth:new Date().toLocaleString()
  };

  var obj = new Object();
  console.log(obj);
  obj.name = 'zs';
  obj.age = 11;
  obj['birth'] = 'birth';
  ```
  - 属性为函数  
  相当于为在对象中创建一个方法
  ```js
  var user = {
    fun:function() {
      soncole.log(123);
    }
  }

  // 调用
  user.fun();
  ```
- 取出属性值

  ```js
  // 方式一
  console.log(person);
  console.log(person["name"]);
  console.log(person.age);
  console.log(person.birth);

  // 方式二
  console.log(obj);
  console.log(obj.name);
  console.log(obj['age']);
  console.log(obj.birth);
  console.log(obj.address); // undefined, 不报错
  ```
- 删除属性

  ```js
  delete obj.name;
  ```

:::warning 警告
对象的属性名可以不遵循变量命名规范, 也可以使用关键字。但是, 不建议这样使用。
:::

:::tip 提示
`[]` 方式取值比 `.` 的方式更加强大, 甚至可以传递变量, 变量的值就是属性名。
:::

- 检查对象是否含有某个属性

  ```js
  obj.birth in obj; // true
  // 或者
  'birth' in obj;
  ```
- 引用数据类型的典型特征

  ```js
  var obj = new Object();
  obj.name = 'zs';
  var obj2 = obj;
  obj.name = 'cc';
  console.log(obj2.name); // cc
  ```
- 引用类型和基本类型的区别  

  基本类型中, 变量和它的值被存放到栈内存, 而变量的值就是其本身的值; 对于引用数据类型来讲, 变量被存放到栈内存中, 而其对象被存放到堆内存中, 堆内存中的对象没有名字, 只有地址, 所以, 栈中的变量所保存的值就是其内存地址。注意, 只要 new 了, 就会在内存中创建对象（且地址不同）。

- 对象比较  

  比较对象时, 不仅会比较对象类型, 还会比较对象的地址。
  ```js
  var obj1 = new Object();
  var obj2 = new Object();
  console.log(obj1 == obj2); // false
  ```
- 对象赋值示例  
  
  ```js
  var a = {name:"zs"};
  function f(obj) {
    obj.name = "m";
  }
  f(a);
  // 上面实际是将 a 的地址赋值给了形参 obj

  var a = 3;
  function f(a) {
    a = a + 1;
  }
  f(a);
  console.log(a); // 3
  // 函数中 a 是一个局部变量, 实参为全部变量的a, 实际是将全局的 a 的值给了局部变量的 a。


  // 综上: 函数传值时, 传递的是变量的值。
  // 变量的值可以是一个地址, 也可以是一个普通的值。
  ```

### 枚举对象中属性
当我们想知道一个对象中的全部属性时, 可以使用枚举。
```js
for (var property in person) {
  console.log(property);
  // 取出每一个属性的值（此处只能使用 []）
  console.log(person[property]);
}
```
### 检查对象是否有某个属性或方法
- in  
  
  如果对象中没有, 而原型中有, 也会返回 true。
  ```js
  console.log(属性名 in 对象);
  ```
- hasOwnProperty  

  该方法不会检查原型中的属性。该方法存在于原型的原型对象中。
  ```js
  console.log(per1.hasOwnProperty('name'));
  ```
### 使用函数批量创建对象
如果我们要创建多个同类型的对象, 可以使用函数（工厂）来批量创建。
```js
function createObject(name, age, sex) {
  var obj = new Object();
  obj.name = name || '';
  obj.age = age || 0;
  obj.sex = sex || '男';
  obj.method = function() {
    // ...  
  };
  return obj
}
var obj1 = createObject('代俊峰', 20, '男');
var obj2 = createObject('代俊峰', 22, '男');
```
```js
function createObject(name, age, sex) {
  var obj = {
    name: name,
    age: age,
    sex: sex
  }
  return obj
}
var obj1 = createObject('代俊峰', 20, '男');
var obj2 = createObject('代俊峰', 22, '男');
```
### 构造函数创建对象 
通过以上方式创建的对象都是 Object, 如果我们想要区分不同类型的对象（如 Person 和 Dog）, 可以使用如下方式。
```js
// 构造函数
function Person(name, age, sex) {
  // name = ''; // window.name = ''（如果没有形参 name 的话）
  this.name = name;
  this.age = age;
  this.sex = sex;
  this.method = function() {
    console.log(this.name);
  };
}
var per = new Person('代俊峰', 20, '男');
console.log(per); // Person
```

- **执行流程**  

  1. 立刻创建一个新的对象
  2. 将 this 指向这个对象
  3. 立即执行函数中的所有代码
  4. 将该对象作为返回值返回

- **与普通函数调用的区别**

  ```js
  var per = new Person('代俊峰', 20, '男');
  var per1 = Person;
  var per2 = Person();
  console.log(per);// Person
  console.log(per1);// function
  // per2 = Person();是调用函数, 函数默认返回值是 undefined
  console.log(per1);// undefined
  ```
- **instanceof**  

  判断某个对象是否是类的实例。如果是, 则返回 true; 否则返回 false。所有对象都是 Object 的一个实例。
  ```js
  console.log(per instanceof Person); // true
  console.log(per instanceof Object); // true
  ```

  :::tip 说明
  `instanceof` 在判断时, 使用了原型。如 `A instanceof B`, 如果函数 B 的显示原型（prototype）在 A 的原型链上, 则返回`true`, 否则返回 `false`。
  :::

- **改进**  

  构造函数每执行一次, 都会创建一个 method 方法。即所有对象的 method 都是唯一的。现在, 把它提取出来, 让对象共享它。
  ```js
  function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.method = method;
  }
  function method() {
    console.log(this.name);
  }
  var per1 = new Person('代俊峰', 20, '男');
  var per2 = new Person('代俊峰', 20, '男');
  console.log(per1.method == per2.method); // true
  ```
- **再次改进**  

  虽然上面解决了共享问题, 但是, 函数被定义在了全局, 污染了命名空间, 而且也不安全。如果有一个函数也叫 method, 那么可能会覆盖它。可以将共享的东西放入 **原型对象** 中。
  ```js
  function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
  }
  Person.prototype.method = function() {
    console.log(this.name);
  }
  var per1 = new Person('代俊峰', 20, '男');
  per1.method();
  ```

### 原型对象
原型即 prototype, 解析器会给 **每一个函数** 都添加一个 prototype 属性。该属性是一个 Object 类型, 而且值是唯一的。如果函数是一个普通函数, 那么 prototype 没有任何作用。如果函数被作为构造函数（即类）, 那么该类的所有对象都有一个隐藏的 prototype 属性（该类中也有, 且指向同一个 prototype）, 且该类的所有对象的 prototype 指向都相同。通过对象的 `__proto__` 属性可以访问该属性（前后都是两个下划线）。也可以通过类的 `prototype` 属性访问。
```js
// 构造函数
function Person(name, age, sex) {
  // name = ''; // window.name = ''
  this.name = name;
  this.age = age;
  this.sex = sex;
  this.method = method;
}

function method() {
  console.log(this.name);
}
var per1 = new Person('代俊峰', 20, '男');
console.log(per1.__proto__ == Person.prototype);
```
- **作用**  
  
  可以用来存放一个类中需要共享的东西。
- **扩展**  

  原型对象中也有 `__proto__` 属性。Object 没有原型（此处说法不严谨）。最多只有两层原型, 即原型的原型的原型为 **null**。

- **对象属性或方法的访问**  

  当对象调用其属性或方法等时, 会先从该对象的查找, 如果有, 则直接使用; 如果没有, 再从其原型对象中查找; 如果原型对象中没有, 则会在原型的原型中查找。如果我们并没有为某个对象添加某个方法, 但是却可以直接调用某方法, 那么, 该方法很有可能存在其原型对象中。这就是原型链。

- **说明**  

  prototype 默认指向的是一个空对象, 此处的空不能理解为 null, 应该理解为空对象中没有我们定义的方法或属性, 而有系统自带的。该对象中的 `constructor` 属性指向了该函数对象。所有函数都是 Function 的实例, 包括 Function 本身。
  ```js
  function fun() {
      
  }
  console.log(fun.prototype.constructor === fun); // true
  ```

  ::: details 提示
  `prototype` 也叫显式原型, `__proto__` 也叫隐式原型。在函数被创建时, 就将 prototype 属性赋值给了的函数对象; 而`__proto__` 是在对象被实例化时, 将 prototype 赋值给了 `__proto__`。  
  当我们访问某个属性时, 如果没有, 则会访问其原型; 但是, 如果我们修改实例的属性时, 不会访问其原型的属性, 如果该对象没有被修改的属性, 则会在其属性中添加而不影响其原型的属性。
  ```js
  function Fn() {
      
  }
  Fn.prototype.a = 'xxx'
  var f1 = new Fn()
  console.log(f1.a) // xxx
  var f2 = new Fn()
  f2.a = 'yyy' // 会在 f2 中添加 a 属性, 不影响原型中的 a
  console.log(f1.a,f2.a) // xxx yyy
  ```
  :::

  ```js
  Object.prototype.a = '123';
  function Fu(){}
  var f1 = new Fu();
  console.log(f1.__proto__.__proto__===Object.prototype) // true
  console.log(f1.__proto__.__proto__.__proto__) // null
  ```
### 继承
- 方式一  

  通过原型链来实现继承
  ```js
  function Supper() {
    this.name =' supper name'
  }
  Supper.prototype.showSupper = function() {
    console.log('supper')
  }
  function Sub() {
    this.name = 'sub name'
  }
  // 实现继承
  Sub.prototype = new Supper()
  Sub.prototype.showSub = function() {
    console.log('sub')
  }
  var sub = new Sub()
  sub.showSupper()
  sub.showSub()
  console.log(sub.constructor) // Supper
  // 解决 constructor 的指向
  Sub.prototype.constructor = Sub
  ```
- 方式二  

  通过构造函数来实现继承（但是, 本质上没有实现继承）
  ```js
  function Person(name,age) {
    this.name = name
    this.age = age
  }
  function Student(name,age,sex) {
    Person.call(this,name,age)
    this.sex = sex
  }
  var s = new Student('Tom',10,'男')
  ```
- 方式三  

  组合前面两种方式
  ```js
  function Person(name,age) {
    this.name = name
    this.age = age
  }
  Person.prototype.setName = function(name) {
    this.name = name
  }
  function Student(name,age,sex) {
    Person.call(this,name,age)
    this.sex = sex
  }
  Student.prototype = new Person()
  Student.prototype.constructor = Student
  ```

### toString()
该方法存在于对象的原型中. 可重写。
```js
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}
Person.toString = function() {
  return this.name+"->"+this.age+"->"+this.sex;
};
// 或者如下
Person.prototype.toString = function() {
  return this.name+"->"+this.age+"->"+this.sex;
};
console.log(per1.toString());
```

:::tip 关于 toString 的说明
使用 console.log 时, console.log 将文本值输出到控制台, 它不会将对象强制为字符串, 因此不会执行 toString 实现。  

您可以强制它输出如下字符串: 
```js
console.log(""+obj);
```
或者调用 toString() 方法:  
```js
console.log(obj.toString());
```
:::

## 函数
:::tip 说明
函数也是一个对象, 只不过函数中可以封装某些功能。 
:::
### 创建函数
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
### 执行函数
```js
// 方式一
fun();

// 方式二
myFunction();

// 方式三
funExp();
```
### 函数参数
函数中的参数默认值是 `undefined`。
```js
function a(e) {
  console.log(e); // undefined
}
```
### 函数作为参数
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
fun1(myAdd); // 传递函数对象, 调用 myAdd 函数

// 做如下修改
function fun1(a) {
  console.log(a); // myAdd(1,2);
}
fun1(myAdd(1,2));// 相当于使用 myAdd 的返回值。
```
### 函数作为返回值
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
  // 带括号表示调用该函数, 返回被调用函数的返回值（函数的返回值默认是 undefined）
  return a;
}

var c = a;
c();
```
### 立即执行函数
立即执行函数也被称为 IIFE, 函数被定义后立即执行, 但是只会执行一次。而且函数会隐藏其实现过程, 也不会污染全局的命名空间。
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
JavaScript 中的函数, 不会检查函数参数的类型和参数的个数。函数的默认返回值是 `undefined`。
:::

### 回调函数
回调函数不由用户调用, 它是由系统调用, 如 DOM 事件的回调函数、定时器的回调函数。

## 作用域
### 全局作用域
直接编写在 `<script></script>` 中的代码就在全局作用域中。全局作用域在页面打开时创建, 在页面关闭时销毁。在全局作用域中有一个全局对象 window（Window 对象）, 该对象由浏览器创建。
#### 全局对象 window
```js
console.log(window);
```
我们所创建的所有全局变量、函数等都被放在了 window 对象中。
```js
var a = 10;
console.log(a);
console.log(window.a);
console.log(window.c); // undefined
console.log(d); // 报错, 没有定义; 此时不等价于 window.d

function fun() {
  console.log(1);
}
window.fun();
window.alert(123);
```
#### 变量声明提前
也称为变量提升。在 JS 执行时, 所有变量的 **声明** （只是变量的声明, 如果在声明时赋了初值, 则不会带上初值）都会被提前。此方式只是针对通过 **var** 声明的变量。  
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
  但是, 此方式中的 a 仍是一个全局变量, 并且可以通过 window 对象访问。

#### 函数声明提前
也称为函数提前。JS 在执行时, 会将所有函数的 **声明** 提前。

- 函数声明的方式  

  此方式会将函数的声明提前, 并且函数可以被调用。
  ```js
  fun();
  function fun() {
    // ...
  }
  ```
- 函数表达式  

  此方式只是将函数的声明提前（变量声明提前之后）, 但是不可提前调用。
  ```js
  fun(); // 报错
  console.log(fun); // undefined
  var fun = function() {
    // ...
  }

  // 等价代码如下
  var fun;
  fun(); // 报错, 因为 fun 不是一个函数对象
  console.log(fun); // undefined
  fun = function() {
    // ...
  }
  ```
### 函数作用域

:::tip 小贴士
函数作用域也称为局部作用域。 
::: 

函数作用域在调用时创建, 函数被执行完成后销毁。每调用一次函数都会创建一个新的函数作用域, 各自之间相互独立。在函数中也遵守全局中的某些特点, 如变量声明提前, 函数声明提前。因此, 函数也可以被看做成一个小的全局。

- **示例1**  

  ```js
  var a = 20;
  function fun() {
    console.log(a); // 10, 即 window.a
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
    a = 99; // 将传入的 a 变为了 99, 并没有改变全局
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

  f(fu); // 输出 10, fu 被定义时, 它的作用域就确定了
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
  obj.f2() // 报错, f2 未定义; 此处要注意变量名 f2
  var obj = {
    f2: function () {
    console.log(this.f2);
    }
  }
  obj.f2() // 输出 f2 函数
  ```
### 注意事项
ES5 中只有**全局作用域**和**函数作用域**, 没有块（即大括号）作用域。
```js
console.log(a)// undefined
if (true) {
  var a = 10
}
console.log(a) // 10
// 上面的代码中, a 被定义在了 if 这个语句块（即大括号）中
// 但是 a 还是被当成了全局变量, 并且把 a 的声明提前了, 等价代码如下: 
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
f() // 打印结果和上面的代码相同, 原理也相同, 等价于: 
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
**只要是未在函数中定义的变量, 都属于全局变量（前提是使用 `var` 定义）**。
## this
解析器在调用函数时, 会向函数内部传递一个隐藏的参数, 即 `this`, `this` 指向当前调用的对象。  

- **示例1**
  
  ```js
  function fun() {
    console.log(this);
  }
  fun(); // Window
  // 等价代码如下
  window.fun(); // fun函数被 Window 对象调用
  ```
- **示例2**

  ```js
  function fun() {
    console.log(this);
  }
  var person = {
    name:'zs',
    method:fun
  }
  person.method(); // Object,此时不再是 Window
  ```
- **示例3**

  ```js
  var name = 'window的name';
  function fun() {
    console.log(this.name);
    // console.log(name); // 永远都是 window.name
  }
  var person = {
    name:'zs',
    method:fun
  }
  fun(); // window 的 name
  person.method();  // zs
  ```
- **示例4**

  ```js
  function Person(color) {
    console.log(this)
    this.color = color;
    this.setColor = function(color) {
      console.log(this)
      this.color = color
    }
    this,getColor = function() {
      console.log(this)
      return this.color
    }
  }

  Person('color'); // this是 window, 且只有一条输出语句
  var per = new Person('color'); // this 是 per, 且只有一条输出语句
  per.getColor();; // this 是 per
  var obj = {};
  per.setColor.call(obj,'green'); // this 是 obj
  var test = p.setColor;
  test(); // this 是 window
  ```
  ```js
  function f1() {
    function f2() {
      console.log(this);
    }
    f2();
  }
  f1(); // this 是 window
  ```

:::warning 注意 
任何函数本质上都是通过对象调用的, 而 `this` 就指向这个对象。如果函数调用时没有指定对象, 那么, 默认就由 window 来调用, 此时的 `this` 就是 window。
:::

## 垃圾回收
垃圾回收（GC）。JS 有自动的垃圾回收机制。
## 数组
数组 (Array) 也是一个对象。使用 `typeof` 检查数组会返回 "object"。
### 创建数组
- 方式一

  ```js
  var arr = new Array();
  arr[0] = 10;
  arr[1] = 'xx';
  console.log(arr);

  var arr2 = new Array(10,20,30);
  ```
- 方式二  

  使用字面量创建数组
  ```js
  var arr = [];

  var arr2 = [1,2.3];
  ```
- 两者的区别

  ```js
  var arr1 = [10];
  var arr2 = new Array(10);
  console.log(arr1[0]); // 10
  console.log(arr1.length); // 1
  console.log(arr2[0]); // undefined
  console.log(arr2.length); // 10
  ```
### 数组赋值
数组本身是一个对象, 所以, 对象的复制方式对数组也适用。
```js
arr[1] = 0;

// 此方式也行, 但是不推荐
arr.hello = '123';
```
数组的元素可以是任意（函数、数组等等都可）数据类型。
```js
var arr = [function() {}];
// 调用
arr[0]();
```
### 常用属性及方法
#### array.length
对于连续的数组来讲, `length` 属性可以设置或返回数组长度。所谓连续的数组就是指, 数组中的索引值是连续的: 

- 获取 

  ```js
  // arr数组不连续
  var arr = new Array();
  arr[0] = 1;
  arr[2] = 2;
  console.log(arr.length); // 3
  // arr数组连续
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  console.log(arr.length); // 2
  ```
- 修改

  ```js
  // 情况 1
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  arr.length = 20;
  console.log(arr);
  console.log(arr.length); // 20

  // 情况 2
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  arr[2] = 2;
  arr[3] = 2;
  arr[4] = 2;
  arr[5] = 2;
  arr.length = 3;
  console.log(arr); // 只会输出前 3 个
  console.log(arr.length); // 3
  ```
#### push()
向数组末尾添加一个或多个元素, 并返回数组的新长度。
```js
var arr1 = [1,2,3];
var length = arr1.push(6,5,'mm');
console.log(arr1);
console.log(length);
```
#### pop()
删除最后一个元素, 并返回数组被删除的元素
```js
var item = arr1.pop();
console.log(arr1);
console.log(item);
```
#### unshift()
在数组开头插入元素, 并返回数组的新的长度。
```js
result = arr1.unshift('u1','u2');
console.log(arr1);
console.log(result);
```
#### shift()
删除数组的第一个元素, 并返回被删除的元素。

:::warning 索引越界
在 JavaScript 中, 如果索引越界, 不会报错, 会返回 `undefined`。
```js
var arr = new Array();
arr[0] = 10;
arr[1] = 'xx';
console.log(arr[6]); // undefined
```
:::
#### forEach()
遍历数组, 该方法只适用于 IE9 及以上的浏览器, 因此, 使用频率没有 for 循环高。该方法需要一个函数作为参数, 该函数由我们创建, 但是不由我们调用（由浏览器调用）, 传入的函数就称为回调函数。
```js
[1,2,3,4,5].forEach(function(ele) {
  console.log(ele);
});

// 箭头函数
arr.forEach(ele => {
  console.log(ele);
});
```
:::tip 回调函数的参数
回调函数可以有三个参数, 第一个表示当前数组遍历出的元素, 第二个表示索引, 第三个表示当前正在遍历的对象。
```js
var array = [1, 2, 3, 4, 5];
array.forEach(function(ele, i, obj) {
  console.log(ele);
  console.log("索引: "+i);
  console.log(obj = array);
});
```
:::
#### slice()
从某个已有的数组返回选定范围的元素。有两个参数, 第一个表示开始截取的下标（包含）, 第二个表示结束的下标（不包含）。
```js
var array = [1,2,3];
var subArray = array.slice(0,array.length - 1);
console.log(subArray); // [1, 2]
```
:::tip 特殊用法
如果参数是负数, 则会给参数自动加上数组的长度, 然后再截取, 如果截取过程的范围不存在, 则返回空数组（`[]`）。第二个参数可以不写, 默认就是截取到最后一个。
:::
#### splice()
删除元素, 并向数组添加新元素, 返回被删除的元素（以数组形式）。该方法可以有三个参数, 第一个参数表示删除的起始位置, 第二个参数表示要删除的数量, 第三个及以后参数可选, 表示从删除的起始位置插入新的元素。
```js
var array = [1, 2, 3];
var d = array.splice(1, 2, 10, 11);
console.log(array);
console.log(d);
```
:::danger 注意
**该方法会影响原数组**
:::
:::tip 技巧
该方法可以有多重作用:   
- 替换元素
- 删除元素（只有前两个参数）
- 插入元素（第二个参数为 0）
:::
:::details 数组去重
结合 `slice()` 和 `splice()` 方法。
```js
var myArray = [1, 2, 5, 8, 10, 5, 6, 2, 7, 8];
// 数组去重
function clearArray(arr) {
  var copyArr = [];
  if (arr.length > 1) {
    // 复制数组
    copyArr = arr.slice(0);
    for (var i = 0; i < copyArr.length - 1; i++) {
      for (var j = i + 1; j < copyArr.length; j++) {
        if (copyArr[i] === copyArr[j]) {
          // 去重
          copyArr.splice(j, 1);
          // 解决连续相同的元素, 删除后需要再次比较该位置
          j--;
        }
      }
    }
  }
  return copyArr;
}
var arr = clearArray(myArray);
console.log("去重前: "+myArray);
console.log("去重后: "+arr);
```
:::
#### concat()
连接两个或多个数组, 并返回结果。
```js
var conArray1 = [1, 2, 3];
var conArray2 = [4, 5, 6];
var conArray = conArray1.concat(conArray2,"123456");
console.log(conArray1);
console.log(conArray);
```
#### join()
把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔（参数可省, 默认是逗号）, 并返回字符串。
```js
conArray = [1, 2, 3, 5, 6, 7];
var s = conArray.join('-');
console.log(s); // 1-2-3-5-6-7
console.log(conArray);
```
#### reverse()
颠倒数组中元素的顺序, **该方法对原数组有影响**。
#### sort()
对数组的元素进行排序。**该方法对原数组有影响**。该方法的参数是一个函数。  
`sort()` 方法没有参数时, 默认是升序（按照**unicode编码**进行升序, 特别是对于数字来讲, 可能得到错误的结果, 如11会排在2的前面）排序。所以, 一般需要带上回调函数来指定排序规则。  
回调函数的两个参数就是数组正在比较的两个元素。并且, 第一个参数在数组中的位置一定是在第二个参数的前面。  
浏览器会根据回调函数的返回值来进行排序。如果返回值大于 0, 则两个元素交换位置（**类似**升序）; 反之, 不交换顺序。如果返回零, 则表示两个数相等, 也不交换位置。
```js
var sortArray = [1, 2, 3, 26, 3, 6, 11];
sortArray.sort(function(a,b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
  // 或者直接使用 a - b 或 b - a
  // return a - b;
});
console.log(sortArray);
```
- **改进**  
    
    - 升序 
    ```js
    sortArray.sort(function(a,b) {
      return a - b;
    });
    ```
    - 降序  
    ```js
    sortArray.sort(function(a,b) {
      return b - a;
    });
    ```

:::tip 补充
数组的更多用法请见 [w3cSchool](https://www.w3school.com.cn/jsref/jsref_obj_array.asp)
:::

## 函数的方法
函数也是对象, 所以, 函数也有方法。
### call
当函数调用该方法时, 函数会被调用并执行。该方法可以将对象指定为函数的**第一个**参数, 此时 `this` 就是传入的对象（即参数是谁, `this` 就是谁）。
```js
function fun() {
  console.log(this);
}
fun(); // window
fun.call(); // window
var obj = [];
fun.call(obj); // []
``` 
此外. 可以将对象在实参之后依次排列。
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
当函数调用该方法时, 函数会被调用并执行。该方法可以将对象指定为函数的第一个参数, 此时 `this` 就是传入的对象（同 `call`）。
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
apply 的特性和 call 的特性稍有不同, 在传递参数时, apply 需要把多余的参数封装到一个数组中。
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
这两个方法实际上可以理解为, 如果某个对象没有该方法, 那么, 可以通过 call 或 apply 让该对象临时拥有该方法, 并且调用该方法。
:::

## arguments
浏览器传入函数的隐藏参数, 它是一个**类数组**对象。函数的所有形参都会被封装到该对象中。
```js
function f() {
  console.log(arguments instanceof Array); // false
  console.log(Array.isArray(arguments)); // false
}
```
### callee属性
`arguments` 通过调用该属性可以打印当前函数对象。
```js
function f() {
  console.log(arguments.callee == f);// true
}
```
## Date对象
```js
// 获取当前时间
var d = new Date();
console.log(d);
// 获取指定的时间
var d2 = new Date('03/22/2020 13:00:03');
console.log(d2);
console.log(d2.getDay());
```
- **getTime()**  

  该方法表示时间戳, 返回 1970 年 1 月 1 日至今的毫秒数。由于时间类型比较复杂, 所以, 我们在保存时间时, 可以保存毫秒数; 取出时间时, 可以让该毫秒数加上 1970 年 1 月 1 日的毫秒数。计算机底层的时间就是这样实现的。
- **Date.now()**  

  获取当前的时间戳, 当代码执行到此行时才会获取。该方法可以用来测试代码的性能。
  ```js
  var time = Date.now();
  console.log(time);
  ```

:::tip 提示
Date 的更多用法请见 [w3cschool](https://www.w3school.com.cn/jsref/jsref_obj_date.asp)
:::

## Math工具类
它不是一个函数, 而是一个工具类（即不同通过 new 来产生实例）, 它里面封装了数学运算相关的属性和方法。

- ceil()

  ```js
  // 向上取整
  console.log(Math.ceil(1.2)); // 2
  ```
- floor()

  ```js
  // 向下取整
  console.log(Math.floor(1.8)); // 1
  ```
- round()

  ```js
  // 四舍五入
  console.log(Math.round(1.6));
  ```
- random()  

  返回 0 ~ 1 之间的随机数（不包含 0 和 1）。
  ```js
  // 生成 1-10 的随机数
  var ran = Math.round(Math.random() * 9) + 1;
  console.log(ran);
  ```
  产生 [x, y] 的随机数:   
  ```js
  Math.round(Math.random() * (y - x)) + x
  ```
- max()  

  返回 x 和 y 中的最高值。
  ```js
  console.log(Math.max(1, 2, 3, 5, 8, 6, 6));
  ```
:::tip 说明
Math 的更多用法请见 [w3cschool](https://www.w3school.com.cn/jsref/jsref_obj_math.asp)
:::

## 包装类
JavaScript 提供了三个包装类, 可以将基本数据类型装换为对象。
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
原因: 对象类型转换为 boolean 时, 都会返回 true。
```js
console.log(Boolean({})); // true
```
:::
### 注意事项
两个对象比较时, 比较的是其内存地址。所以, 一般不用包装类。

## 字符串常用方法
字符串在底层是以字符数组的形式保存的。
```js
var str = 'hello world!';
console.log(str[0]); // h
```
- charAt()  

  返回在指定位置的字符。
  ```js
  var str = 'hello world!';
  console.log(str[0]);
  console.log(str.charAt(1)); // e
  ```
- charCodeAt()  

  返回在指定的位置的字符的 Unicode 编码。

- fromCharCode()  

  从字符编码创建一个字符串。
  ```js
  // 参数使用十进制
  var s = String.fromCharCode(72);
  // 参数使用十六进制
  var s = String.fromCharCode(0x1236);
  ```
- concat()  

  连接字符串, 相当于使用 + 号。
  ```js
  var str = 'hello world!';
  var s;
  s = str.concat("您好","世界");
  console.log(s);
  ```
- indexOf()  

  检索字符串, 返回某个指定的字符串值在字符串中首次出现的位置。
  ```js
  var str = 'hello world!';
  console.log(str.indexOf("or"));
  ```
  **语法**
  ```js
  stringObject.indexOf(searchvalue, fromindex)
  ```
  |参数|描述|
  |---|---|
  |`searchvalue`|必需。规定需检索的字符串值。|
  |`fromindex`|可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数, 则将从字符串的首字符开始检索。|

:::warning 注意  
`indexOf()` 方法对大小写敏感！如果要检索的字符串值没有出现, 则该方法返回 -1。
:::

- lastIndexOf()  

  从后向前搜索字符串。

- slice()  

  提取字符串的片断, 并在新的字符串中返回被提取的部分。
  ```js
  var str = 'hello world!';
  s = str.slice(0,2);
  console.log(s);
  ```
  作用效果和 `substring()` 相似, 都可以传递负数, 且不包含结束的下标。

- substring()  

  提取字符串中两个指定的索引号之间的字符。不包含结束的下标, 可以传递负数（会自动加上字符串长度, 如果没有该范围, 会返回 ''）。

- substr()  

  从起始索引号提取字符串中指定数目的字符, 索引可以是负数。

### 与正则表达式相关的方法
- split()  

  默认就是全局匹配。
  ```js
  var str = 'hello world!';
  s = str.split(/\s/);
  console.log(s.toString());
  ```
- search()  

  搜索字符串中是否含有指定内容, 并返回第一次出现索引。默认就是全局匹配。
  ```js
  var str = 'hello world!';
  console.log(str.search("abc"));
  console.log(str.search(/a[abcl]c/));
  ```
- match()  

  找到一个或多个正则表达式的匹配。
  ```js
  s = "oell0jhdlldd".match("ll");
  s = "owlell0ncjhdlldd".match(/[A-z]/gi);
  console.log(s);
  ```
- replace()  

  替换与正则表达式匹配的子串。
  ```js
  var ss = "mvkjjdkl";
  var m = ss.replace(/k/g,'0');
  console.log(m);
  ```
  由于没有 `replaceAll()`, 所以, 想要替换所有的, 需要用正则表达式。

## 正则表达式
### 创建正则表达式
有两种方法来创建匹配模式
- 通过 RegExp 对象创建  

  ```js
  var reg = new RegExp("a","i");
  ```
- 使用字面量创建  

  ```js
  // 不用加引号
  var reg = /a/i;
  ```

两者的区别如下: 

```js
var reg = new RegExp("\\.");
// 等价形式如下
var reg = /\./;
```
### test() 
检索字符串中指定的值。返回 true 或 false。
```js
var reg = new RegExp("a");
var str = "abc";
console.log(reg);
console.log(reg.test(str)); // true
```
### 匹配模式及示例
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

  ```jaascript
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

## DOM
DOM（Document Object Model） 即文档对象模型 , JavaScript 通过 DOM 来操作网页。
### 基本概念
- 节点  

  即 Node, 它是构成 HTML 文档最基本的单元。
- 文档节点  

  即整个 HTML 文档（网页）。
- 元素节点  

  即 HTML 文档中的 HTML 标签。
- 属性节点  

  元素的属性。
- 文本节点  

  HTML 标签中的文本内容。

### 节点的属性

|节点（node）|nodeName|nodeType|nodeValue|
|---|---|---|---|
|文档节点|#document|9|null|
|元素节点|标签名|1|null|
|属性节点|属性名|2|属性值|
|文本节点|#text|3|文本内容|

:::tip 特别说明
每个节点都有 nodeName、nodeType、nodeValue 这 3 个属性。浏览器已经提供了文档节点 (document), 它是 window 的属性, 可以在页面中直接使用。
:::

```js
console.log(p.nodeName);
```

### 浏览器加载顺序
浏览器时按照从上自下加载 HTML 文档, 每读取到一行就会加载。如果 JS 代码写在元素加载之前, 则要等到页面加载完成后再加载 JS, 即延迟加载, 我们可以为网页添加 onload 事件: 
```js
window.onload = function() {
  // ...
};
```
:::tip 提示
我们推荐将 JS 代码写在 `<body></body>` 标签里面。
:::
### 获取元素节点
#### 获取节点
通过 document 对象调用。
- getElementById()
- getElementsByClassName()
- getElementsByTagName()
#### 获取子节点

- **通过 getElementsByTagName() 方法获取子节点**  

  ```html
  <button id="btn">查看container的子节点</button>
  <div id="container">
    <h3>h3</h3>
    <div>
      <p>div > p</p>
      <nav>div>nav</nav>
    </div>
  </div>
  ```
  ```js
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子p标签
      var h3s = con.getElementsByTagName('p');
      console.log(h3s.length);
      for (var i = 0; i < h3s.length; i++) {
        console.log(h3s[i]);
      }
    };
  };
  ```
- **通过属性获取子节点**  

  childNodes、children（获取的是子元素, 不是子节点）、firstChild、lastChild
  ```html
  <button id="btn">查看 container 的子节点</button>
  <div id="container">
    <h3>h3</h3>
    <div>
      <p>div > p</p>
      <nav>div>nav</nav>
    </div>
  </div>
  ```
  ```js
  // childNodes
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子节点
      var children = con.childNodes;
      console.log(children.length);// 5
      for (var i = 0; i < children.length; i++) {
        console.log(children[i]);
      }
    };
  };
  ```
  ```js
  // children
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子元素
      var children = con.children;
      console.log(children.length); // 2
      for (var i = 0; i < children.length; i++) {
        console.log(children[i]);
      }
    };
  };
  ```
  ```js
  console.log(con.firstChild); // #text
  console.log(con.lastChild); // #text
  console.log(con.firstElementChild); // 第一个子元素
  console.log(con.lastElementChild); // 最后一个子元素
  ```

  :::tip 关于 childNodes 的说明
  该属性会获取标签所有的子标签, 包括文本标签。在代码中的回车（此时的回车不使用 &lt;br&gt;, 而直接使用键盘的 Enter 键）和空格等也会被获取成文本节点。但是, 在 IE8 中不会。推荐使用 children 属性获取。
  :::

  :::tip 获取第一个和最后一个
  firstChild 和 lastChild 获取的是节点, firstElementChild 和 lastElementChild 获取的是元素。但是后者在 IE8 及以下中不被支持, 因此, 不推荐使用后者。
  :::

- **parentNode 获取父节点**  

  ```js
  console.log("父节点: "+p.parentNode.innerHTML);
  console.log("父节点: "+p.parentElement.inerText);
  ```
- **获取兄弟节点**  
  
  previousSibling（前一个）、nextSibling（后一个）
  ```js
  console.log("前一个兄弟节点: "+p.previousSibling);
  console.log(p.previousElementSibling); // 获取元素, IE8 不支持
  console.log("后一个兄弟节点: "+p.nextSibling);
  console.log(p.nextElementSibling); // 获取元素, IE8 不支持
  ```

:::tip 关于节点和元素的说明
节点不一定是 HTML 标签, 节点包括我们自己敲的空格和回车（不使用标签）等, 而我们写的每一个标签才是一个元素。我们写的文本内容都是一个文本节点。
:::

- **文本节点**  

  获取标签中的文本值。我们可以使用 innerText, innerHTML, 也可以通过节点来获取。
  ```html
  <h3>我是h3标签</h3>
  ```
  ```js
  var h3 = document.getElementById('h3');
  console.log(h3.innerText);
  console.log(h3.innerHTML);
  console.log(h3.firstChild.nodeValue);
  console.log(h3.lastChild.nodeValue);
  ```
- **获取body标签**  

  ```js
  var body = document.getElementsByTagName('body')[0];
  var body = document.body;
  ```
- **获取根标签 `<html></html>`**

  ```js
  console.log(document.documentElement);
  ```
- **获取所有标签元素**  

  该方法返回一个类数组, 但是, 使用 typeof 却返回 undefined, 可能是一个设计的 bug。
  ```js
  var all = document.all;
  console.log(all);
  ```
  另一种方式如下: 
  ```js
  console.log(document.getElementsByTagName('*'));
  ```
- **getElementsByClassName()**  

  该方法在 IE9 以下不被支持, 但可以使用 `querySelector()` 或 `querySelectorAll()` 代替。

- **getElementsByName()**  

  该方法与 `getElementById()` 方法相似, 但是它查询元素的 `name` 属性, 而不是 `id` 属性。另外, 因为一个文档中的 `name` 属性可能不唯一（如 HTML 表单中的单选按钮通常具有相同的 `name` 属性）, 所有 `getElementsByName()` 方法返回的是元素的数组, 而不是一个元素。

- **getElementById()**  

  只有该方法才能级联获取 DOM。如下: 
  ```js
  var div = document.getElementById('div').getElementsByTagName('div')[0];
  console.log(div);
  ```
- **querySelector()**  

  该方法可用于获取级联标签, 类似 CSS 中的选择器。返回值是唯一的, 如果满足条件的有多个, 那么只会返回第一个。
  ```js
  var a = document.querySelector('.div');
  var a = document.querySelector('#div+div');
  var a = document.querySelector('#div div');
  var a = document.querySelector('#div>div');
  console.log(a);
  ```
- **querySelectorAll()**  

  与 `querySelector()` 不同, 返回值是类数组。
  ```js
  var b = document.querySelectorAll('#div div');
  console.log(b);
  ```
### 添加和创建节点
|方法|描述|
|---|---|
|`appendChild()`|向指定节点内的末尾添加一个节点, 并返回添加的节点。|
|`createAttribute()`|创建属性节点。|
|`createElement()`|创建元素节点, 并返回该元素节点。|
|`createTextNode()`|创建文本节点, 并返回文本节点。|
|`insertBefore()`|在指定的子节点前面插入新的子节点。该方法需要被父节点调用。|
|`replaceChild()`|替换子节点。该方法由父节点调用|

---

HTML页面如下: 
```html
<button id="btn01">添加节点appendChild</button>
<button id="btn02">添加节点insertBefore</button>
<button id="btn03">替换节点replaceChild</button>
<button id="btn04">删除节点removeChild</button>
<div id="div1">
  <p id="p1">p
    <span>span</span>
  </p>
  <h1></h1>
  <ul>
    <li>li1</li>
    <li>li2</li>
    <li>li3</li>
  </ul>
</div>
```

- **appendChild 示例1**

  ```js
  function myClick(id,fun) {
    var ele = document.getElementById(id);
    ele.onclick = fun;
  }
  window.onload = function() {
    // 在 div 下面添加一个 div 标签
    // 该方法对其它标签不会有影响
    myClick('btn01',function() {
      var div1 = document.getElementById('div1');
      var div2 = document.createElement('div');
      var text = document.createTextNode('div2啊');
      // div2.innerText = '我是div2';
      div2.appendChild(text);
      var div2 = div1.appendChild(div2);
      console.log(div2);
    });
    
    // 等价代码如下
    // 但是, 这种方法会将原来标签中的所有标签先删除, 然后再添加, 如果某些标签绑定了事件, 那么事件会消失, 所以需慎用。
    myClick('btn01',function() {
      var div1 = document.getElementById('div1');
      div1.innerHTML += '<p>ppp</p>';
    });
  };
  ```
- **insertBefore 示例1**

  ```js
  // 在 id 为 p1 的元素节点之前插入新的元素节点
  myClick('btn02',function() {
    var p =document.getElementById('p1');
    var p2 = document.createElement('p');
    var div1 = document.getElementById('div1');
    p2.innerText = '我是p2啊';
    // p.parentElement.insertBefore(p2,p);
    p.parentNode.insertBefore(p2,p);
  });
  ```
- **replaceChild 示例1**

  ```js
  // 使用 p 替换 span
  myClick('btn03',function() {
    var p2 = document.createElement('p');
    var span = document.querySelectorAll('.span')[0];
    p2.innerText = 'p2替换';
    span.parentNode.replaceChild(p2,span);
  });
  ```

### 修改节点
|方法|描述|
|---|---|
|`appendChild()`|把新的子节点添加到指定节点。|


### 删除节点
|方法|描述|
|---|---|
|`removeChild()`|删除子节点。该方法由父节点调用|
|`remove()`|删除子节点。该方法由子节点自身调用|

HTML页面如下: 
```html
<button id="btn01">添加节点appendChild</button>
<button id="btn02">添加节点insertBefore</button>
<button id="btn03">替换节点replaceChild</button>
<button id="btn04">删除节点removeChild</button>
<div id="div1">
  <p id="p1">p
    <span>span</span>
  </p>
  <h1></h1>
  <ul>
    <li>li1</li>
    <li>li2</li>
    <li>li3</li>
  </ul>
</div>
```
- **removeChild()**

  ```js
  // 删除某个节点
  // myClick 是我自定义的事件函数
  myClick('btn04',function() {
    var p = document.getElementById('p1');
    p.parentNode.removeChild(p);
  });
  ```
- **remove()**

  ```js
  // myClick 是我自定义的事件函数
  // 当点击时, 删除当前被点击的元素节点。
  myClick('btn04',function() {
    this.remove();
  });
  ```

:::tip 说明
凡是 DOM 的方法中涉及到子节点操作的, 该方法大部分都是由该子节点的父节点调用。
:::

## 操作CSS
### 修改和设置样式
基本语法为: 元素.style.属性 = XXX。但是, 请注意, 如果样式名中含有 “-”, 则对应的 JS 中属性为驼骆峰形式。
```js
// 修改 div 的宽度
container.style.width = '100px';
// 修改颜色
container.style.backgroundColor ='#888888';
```
:::tip 提示
通过 JS 来修改的样式, 都是将其设置为内联样式（即直接添加在标签上）, 其优先级最高。如果在选择器（即写在 css 文件中或 style 标签中）中设置了 `!important` , 那么通过JS修改的样式不会生效。
:::

### 获取 CSS 样式
获取样式也可以通过 `元素.style.属性` 来获取, 这种方式获取的值会带上单位（如 px）。但是, 此方式只能读取 **内联样式**。  

也可以通过某些特定的属性来获取, 如 `container.clientWidth`, 这种方式获取的属性没有单位。此方式可以读取通过选择器设置的样式。  

IE 浏览器可以通过 `元素.currentStyle.xxx` 来获取样式,  类似通过 style 来获取, 但只有 IE 才支持。且该方式 **只读**。

另外, 还可以通过 window 对象的 `getComputedStyle()` 来获取, 该方法的第一个参数是要获取样式的元素, 第二个参数是一个伪元素（一般写为 null 就行）, 然后返回一个对象。该方法获取的样式会带单位。如果没有给元素设置宽度等, 则会获取当前窗口的宽度等。且该方式 **只读**。**IE8 不支持**。

```js
// 获取宽度
var container = document.getElementById('container');
var obj = getComputedStyle(container,null);
console.log(obj.width);
```
---
以上方式有时不兼容 IE8, 那么, 我们可以自定义一个函数来兼容。  
**兼容 IE8:**
```js
// 兼容 IE8
// element 要获取样式的元素
// styleName 要获取的样式名(注意某些要使用驼峰)
function getStyle(element, styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(element,null)[styleName];
  }
  return element.currentStyle[styleName];
}
```
***
**一些常见属性/方法如下**

以下的返回值大都不带单位, 而且是只读的。

|属性/方法|描述|
|---|---|
|`element.clientHeight`|返回元素的可见高度。（包括 padding 等）|
|`element.clientWidth`|返回元素的可见宽度。|
|`element.offsetHeight`|返回元素的高度。（包括边框、padding 等）|
|`element.offsetWidth`|返回元素的宽度。|
|`element.offsetParent`|返回元素的偏移容器。即最近的定位（position）父元素（默认是 body）。|
|`element.offsetLeft`|返回元素的水平偏移位置。即相对于父元素的 left（包括 padding）|
|`element.offsetTop`|返回元素的垂直偏移位置。即相对于父元素的 top|
|`element.scrollHeight`|返回元素的整体高度。大致等于子元素的高度。|
|`element.scrollLeft`|返回元素左边缘与视图之间的距离。|
|`element.scrollTop`|返回元素上边缘与视图之间的距离。|
|`element.scrollWidth`|返回元素的整体宽度。大致等于子元素的宽度。|

:::details 小贴士
**判断垂直滚动条是否到最底？** 
```js  
element.scrollHeight - element.scrollTop = element.clientHeight
```

**判断水平滚动条是否到最右边？**  
```js
element.scrollWidth - element.scrollLeft = element.clientWidth
```

**作用**  
用于判断是否已读注册协议等。
:::

**模拟注册协议 (用户已经把协议阅读完成后, 才能点击按钮):**  
```html
<div id="container">
  <div id="xieyi">
    <h3>注册协议</h3>
    <div id="xieyi-text">
      注册协议 * 100
    </div>
  </div>
  <input type="checkbox" id="zhuce" disabled="true">我已仔细阅读
  <input type="submit" id="submit" value="注册" disabled="true">
</div>
```
```css
#container {
  margin: 150px auto 0 atuo;
}
#xieyi {
  width: 200px;
  height: 300px;
  background-color: plum;
  overflow: auto;
}
#xieyi-text {
  width: 200px;
  height: 300px;
  background-color: bisque;
}
```
```js
window.onload = function() {
  var xieyi = document.getElementById('xieyi');
  var zhuce = document.getElementById('zhuce');
  var submit = document.getElementById('submit');
  // 滚动条滚动时触发
  xieyi.onscroll = function() {
    if (Math.ceil(xieyi.scrollHeight - xieyi.scrollTop) == xieyi.clientHeight) {
      zhuce.disabled = false;
      submit.disabled = false;
    }
  };
};
```

## 事件
### 事件函数封装
如果我们想要为很多元素都绑定相同的事件, 那么我们可以自己封装一个函数。
```js
/* 
 * 该函数专门用来为元素添加单击事件
 * eleId 元素ID, 注意要是字符串
 * clickFun 单击触发的函数
 */
function eleClick(eleId, clickFun) {
  var ele = document.getElementById(eleId);
  ele.onclick = clickFun;
}

window.onload = function() {
  eleClick('container',function() {
    console.log("我是container");
  });
};
```
### a 标签的默认行为
`<a></a>` 被点击后, 会跳转页面, 这是它的默认行为。如果不希望出现默认行为, 则可以通过如下方式取消。
- 方式一

  ```html
  <a href="javascript:;" class="delete">删除</a>
  ```
  :::warning 警告
  如果使用了上面的方式, 则直接使用 `delete.onclick=fun();` 会无效, 需要在标签中使用 `onclick=fun();`。
  :::

- 方式二  

  在 a 标签的点击事件中返回 false。
  ```html
  <a href="javascript:;" class="delete" onclick="fun()">删除</a>
  ```
  ```js
  function fun() {
    return false;
  }
  ```
### 隐藏参数对象 Event
当事件的响应函数被触发时, 浏览器会传递一个事件对象作为实参, 该对象中封装了当前事件的一切信息（如鼠标点击, 鼠标滚动, 键盘按键等）。**但是IE8不支持。**
```js
div.onclick = function(e) {
  // 鼠标的X坐标
  console.log(e.clientX);
}
```

在 IE8 及以下中, 是将事件对象作为 window 对象的 `event` 属性保存的。
```js
div.onclick = function() {
  // 鼠标的 X 坐标
  console.log(window.event.clientX);
}
```
**但是火狐不兼容**

**解决兼容性:**
```js
div.onclick = function(e) {
  // 鼠标的 X 坐标
  var x = window.event ? window.event.clientX : e.clientX;
  
  // 或者
  e = e || window.event;
}
```

### 事件绑定
先来看以下代码: 
```html
<td><a href="javascript:;" onclick="deleteRow()">删除</a></td>
```
```js
window.onload = function() {
  function deleteRow() {
    if (window.confirm('确定要删除此行？')) {
      // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }
  }
};
```
:::tip 提示
当点击超链接时, 会报错, 错误提示 `deleteRow()` 没有定义。解决办法就是, 将 `deleteRow()` 在 `script` 标签中声明, 而不要在 `window.onload()` 里面声明。
:::

- **this 的指向**  

  ```html
  <td><a href="javascript:;" onclick="deleteRow()">删除</a></td>
  ```
  ```js
  function deleteRow() {
    if (window.confirm('确定要删除此行？')) {
      console.log(this); // window
    }
  }
  ```
- **给按钮绑定多个相同事件**  

  容易想到的做法就是编写多个 `onclick` 事件, 但是, 这样只会使最后一个生效。这时, 我们可以使用如下方式, 先来看一下: 
  ```js
  btn01.addEventListener('click',function() {
    console.log(11);
  },false);
  btn01.addEventListener('click',function() {
    console.log(22);
  },false);
  ```
  以上两个函数都会被执行。

:::details 补充
**addEventListener() 参数说明:**  
- 第一个参数是绑定的事件类型, 但是请注意, 没有 `on`
- 第二个参数就是事件的回调函数
- 第三个参数表示是否在捕获阶段触发事件, 需要一个 boolean 值, 一般为 false
- 如果绑定了多个相同类型的事件, 则依次执行  
- 该方法中 this 是 函数调用者  
- **IE8 不支持该方法**

**IE8:**  
使用 `attachEvent()` 方法。只有两个参数, 且第一个参数需要 `on`。该方法只支持 IE 浏览器。如果绑定了多个相同类型的事件, 则倒序执行。**该方法中 this 是 Window**。
```js
// IE8
btn01.attachEvent('onclick',function() {
  console.log(333);
});
```

**兼容 IE8:**  
```js
// 解决兼容性
// 第一个参数是要调用的对象
// 第二个参数是事件类型（不带 on）
// 第三个参数是回调函数
function bind(obj, eventType, fun) {
  // 非IE8
  if ( obj.addEventListener) {
    obj.addEventListener(eventType,fun,false);
  } else {
    // obj.attachEvent('on'+eventType, fun);
    // 解决 this 的指向
    obj.attachEvent('on' + eventType, function() {
      fun.call(obj);
    });
  }
}
window.onload = function() {
  var btn01 = document.getElementById('btn01');
  bind(btn01, 'click', function() {
    console.log(11);
    console.log(this.innerHTML);
  });
};
```
:::

### 表格的 CRUD
```html
<table id="table">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>性别</th>
      <th>操作</th>
    </tr>
  </thead>
  <tr>
    <td>焰灵姬</td>
    <td>20</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
  <tr>
    <td>晓梦</td>
    <td>23</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
  <tr>
    <td>田密</td>
    <td>23</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
</table>

<table style="text-align: center;border: 2px solid black;">
  <tr>
    <td>姓名</td>
    <td><input type="text" id="name"></td>
  </tr>
  <tr>
    <td>年龄</td>
    <td><input type="text" id="age"></td>
  </tr>
  <tr>
    <td>性别</td>
    <td><input type="text" id="sex"></td>
  </tr>
  <tr>
    <td colspan="2"><input type="button" value="添加" id="addBtn"></td>
  </tr>
</table>
```
```js
function myClick(id, fun) {
  var ele = document.getElementById(id);
  ele.onclick = fun;
}
window.onload = function() {

  // 给所有 a 标签绑定删除事件
  function deletea() {
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      deletes[i].onclick = function() {
        var tr = this.parentNode.parentNode;
        // var name = tr.children[0].innerText;
        var name = tr.getElementsByTagName('td')[0].innerText;
        if (window.confirm('确定要删除 \"'+name+'\" 吗？')) {
          tr.remove();
          // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        }
        // 取消 a 标签的默认行为
        return false;
      };
    }
  }

  deletea();
  
  // 给添加按钮添加事件
  myClick('addBtn', function() {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var sex = document.getElementById('sex').value;
    var table = document.getElementById('table');
    if (name != '' && age != '' && sex != '') {
      var tr = document.createElement('tr');
      var tbody = document.getElementsByTagName('tbody')[0];
      // 注意此处要创建多个对象。
      // 类似 Java

      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var a = document.createElement('a');
      a.className = 'delete';
      a.href = '#';
      a.innerText = '删除';
      td1.innerText = name;
      tr.appendChild(td1);
      td2.innerText = age;
      tr.appendChild(td2);
      td3.innerText = sex;
      tr.appendChild(td3);
      td4.appendChild(a);
      tr.appendChild(td4);
      // 此处不建议放在body里面, 建议放在 table 的 tbody 里面。
      // table.appendChild(tr);
      tbody.appendChild(tr);
        
      // 方式二
      // var htmlValue = '<tr>'
      //                 +'<td>'+name+'</td>'
      //                 +'<td>'+age+'</td>'
      //                 +'<td>'+sex+'</td>'
      //                 +'<td>'+'<a href=\"#\" class=\"delete\">删除</a>'+'</td>'
      //                 +'</tr>';
      // tbody.innerHTML += htmlValue;
      deletea();
      document.getElementById('name').value = '';
      document.getElementById('age').value = '';
      document.getElementById('sex').value = '';
    } else {
      alert('请填写所有信息');
    }
  });
};
```
- 优化
  ```js
  function myClick(id, fun) {
    var ele = document.getElementById(id);
    ele.onclick = fun;
  }

  function deleteUser() {
    var tr = this.parentNode.parentNode;
    // var name = tr.children[0].innerText;
    var name = tr.getElementsByTagName('td')[0].innerText;
    if (window.confirm('确定要删除 \"'+name+'\" 吗？')) {
      tr.remove();
      // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }
    // 取消 a 标签的默认行为
    return false;
  }
  window.onload = function() {
      
    // 给所有 a 标签绑定删除事件
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      deletes[i].onclick = deleteUser;
    } 

    // 给添加按钮添加事件
    myClick('addBtn', function() {
      var name = document.getElementById('name').value;
      var age = document.getElementById('age').value;
      var sex = document.getElementById('sex').value;
      var table = document.getElementById('table');
      if (name != '' && age != '' && sex != '') {
        var tr = document.createElement('tr');
        var tbody = document.getElementsByTagName('tbody')[0];

        // 方式三
        tr.innerHTML = '<td>'+name+'</td>'
                        +'<td>'+age+'</td>'
                        +'<td>'+sex+'</td>'
                        +'<td>'
                        +'<a href="#" class="delete">删除</a>'
                        //+'<td>'+'<a href=\"#\" class=\"delete\">删除</a>'+'</td>'
                        +'</td>';
        tr.getElementsByTagName('a')[0].onclick = deleteUser;
        tbody.appendChild(tr);

        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('sex').value = '';
      } else {
        alert('请填写所有信息');
      }
    });
  };
  ```
- 引发的问题
  
  ```js
  window.onload = function() {

    // 给所有 a 标签绑定删除事件
    var deletes = document.querySelectorAll('.delete');
      for (var i = 0; i < deletes.length; i++) {
        deletes[i].onclick = function() {
        console.log(deletes[i] === this); / /false
        // 取消 a 标签的默认行为
        return false;
      };
    }
  };
  ```
  在 onclick 事件中的 i 的值已经是数组的长度了。  

  **原因:**  
  for 循环在页面加载完成后会立即执行, 而点击事件则要等到点击时才被执行。当点击函数被执行时, for 循环早已被执行完成。

  **解决如下:**  
  - 使用闭包
    
    ```js
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      (function(i) {
        deletes[i].onclick = function() {
          console.log(deletes[i] === this);
          // 取消 a 标签的默认行为
          return false;
        }
      })(i)
    }
    ```
  - 使用 let
    
    ```js
    for (let i = 0; i < deletes.length; i++) {
        deletes[i].onclick = function() {
        console.log(deletes[i] === this);
        // 取消 a 标签的默认行为
        return false;
      }
    }
  ```

### 复选框事件
实现全选、全不选、反选、提交的功能。
```html
<input type="checkbox" id="select">全选/全不选
<div>
  爱好: 
  <input type="checkbox" value="篮球" class="checkbox">篮球 
  <input type="checkbox" value="足球" class="checkbox">足球 
  <input type="checkbox" value="乒乓球" class="checkbox">乒乓球 
  <input type="checkbox" value="羽毛球" class="checkbox">羽毛球
</div>
<div>
  <button type="button" id="selectAll">全选</button>
  <button type="button" id="selectAllNot">全不选</button>
  <button type="button" id="selectInverse">反选</button>
  <button type="button" id="submitBtn">提交</button>
</div>
```
```js
/* 
 * 该函数专门用来为元素添加单击事件
 * eleId 元素ID
 * clickFun 单击触发的函数
 */
function eleClick(eleId, clickFun) {
  var ele = document.getElementById(eleId);
  ele.onclick = clickFun;
}

window.onload = function() {
  // 所有的可选复选框
  var checkboxs = document.getElementsByClassName('checkbox');
  // 全选复选框
  var select = document.getElementById('select');
  // 全选
  eleClick('selectAll', function() {
    for (var i = 0; i < checkboxs.length; i++) {
      // if (!checkboxs[i].hasAttribute('checked')) {
          // checkboxs[i].setAttribute('checked','true');
          checkboxs[i].checked = true;
      // }
    }
    // 让全选按钮来调节全选复选框
    select.checked = true;
  });

  // 全不选
  eleClick('selectAllNot', function() {
    for (var i = 0; i < checkboxs.length; i++) {
      // if (checkboxs[i].hasAttribute('checked')) {
      //     //checkboxs[i].setAttribute('checked','false');
      //     //checkboxs[i].removeAttribute('checked');
      //     checkboxs[i].checked = false;
      // }
      if (checkboxs[i].checked == true) {
        checkboxs[i].checked = false;
      }
      // 让全不选按钮来调节全选复选框
      select.checked = false;
    }
  });

  // 反选
  eleClick('selectInverse', function() {
    select.checked = true;
    for (var i = 0; i < checkboxs.length; i++) {
      checkboxs[i].checked = !checkboxs[i].checked;
      // 让反选按钮来调节全选复选框
      if (!checkboxs[i].checked) {
        select.checked = false;
      }
    }
  });

  // 提交
  eleClick('submitBtn',function() {
    for (var i = 0; i < checkboxs.length; i++) {
      if (checkboxs[i].checked) {
        console.log(checkboxs[i].value);
      }
    }
  });

  // 复选框实现全选
  // 当复选框选中, 则全选; 反之, 全不选
  eleClick('select',function() {
    for (var i = 0; i < checkboxs.length; i++) {
      checkboxs[i].checked = this.checked;
    }
  });

  // 如果这几个复选框全都选中, 则让复选框实现全选
  for (var i = 0; i < checkboxs.length; i++) {
    checkboxs[i].onclick = selectAll;
  }

  function selectAll() {
    select.checked = true;
    for (var i = 0; i < checkboxs.length; i++) {
      if (!checkboxs[i].checked) {
        select.checked = false;
        break;
      }
    }
  }
};
```
### 翻页切换
```html
<div class="container">
  <h5 id="geci">无何化有 感物知春秋</h5>
  <button id="prev">上翻</button>
  <button id="next">下翻</button>
  <p id="page">
    <span id="currPage"></span> / 
    <span id="totalPage"></span>
  </p>
</div>
```
```js
var prev = document.getElementById('prev');
var next = document.getElementById('next');
var geci = document.getElementById('geci');
var curSpan = document.getElementById('currPage');
var totalPage = document.getElementById('totalPage');
var index = 0;
var texts = [
  "无何化有 感物知春秋",
  "秋毫濡沫欲绸缪 搦管相留",
  "留骨攒峰 留容映水秀",
  "留观四时曾邂逅 佳人西洲",
  "西洲何有 远树平高丘",
  "云闲方外雨不收 稚子牵牛",
  "闹市无声 百态阴晴栩栩侔",
  "藤衣半卷苔衣皱 岁月自无忧",
  "驾马驱车",
  "尚几程扶摇入画中 咫尺",
  "径曲桥横 精诚难通",
  "盼你渡口 待你桥头"
];
curSpan.innerText = 1;
totalPage.innerText = texts.length;
prev.onclick = function() {
  if (index <= 0) {
    index = texts.length - 1;
  } else {
    index--;
  }
  geci.innerText = texts[index];
  curSpan.innerText = index + 1;
};

next.onclick = function() {
  if (index >= texts.length - 1) {
    index = 0;
  } else {
    index++;
  }
  geci.innerText = texts[index];
  curSpan.innerText = index + 1;
};
```
### 鼠标事件

|属性|描述|
|---|---|
|`onmousemove`|鼠标被移动。|
|`onmouseover`|鼠标移到某元素之上。在子元素上移动时, 如果父元素绑定了该事件, 则会被触发（即会冒泡）。|
|`onmouseenter`|鼠标移到某元素之上。不会冒泡|
|`onmouseup`|鼠标按键被松开。|
|`onmousedown`|鼠标按钮被按下。|
|`onmouseout`|鼠标从某元素移开。会冒泡|
|`onmouseleave`|鼠标从某元素移开。不会冒泡|

- **获取鼠标位置**  

  当鼠标在某个元素中移动时, 获取鼠标当前位置。
  ```html
  <div class="div1" style="height: 100px; width: 300px; border: 1px solid #000; margin-bottom: 20px;"></div>
  <div class="div2" style="padding: 5px; width: 200px; border: 1px solid #000;">
    x: <input type="text" id="input1" size="5"> 
    y: <input type="text" id="input2" size="5">
  </div>
  ```
  ```js
  window.onload = function() {
    var div1 = document.querySelector('.div1');
    var input1 = document.querySelector('#input1');
    var input2 = document.querySelector('#input2');

    // 获取鼠标位置
    div1.onmousemove = function(e) {
      input1.value = e.clientX;
      input2.value = e.clientY;
    };
    
    // 解决兼容性
    div1.onmousemove = function(e) {
      input1.value = window.event? window.event.clientX:e.clientX;
      input2.value = window.event? window.event.clientX:e.clientX;
      
      // 或者
      e = e || window.event;
    };
  };
  ```
  :::tip 思考
  注意此处使用的是 `onmousemove`, 思考 `onmouseover`？

  |方法|说明|
  |---|---|
  |onmousemove|鼠标每次在元素内移动都会触发|
  |onmouseover|只有当鼠标从外界移动到元素内才会触发|
  :::

- **div 随鼠标移动:**  

  ```html
  <div id="div3" style="width: 50px; height: 50px; background: coral;"></div>
  ```
  ```css
  #div3 {
    /* 必须给元素设置定位, 但不一定是绝对定位 */
    position: absolute;
  }
  ```
  ```js
  var div3 = document.getElementById('div3');
  document.onmousemove = function(e) {
    e = e || window.event;
    div3.style.top = e.clientY - div3.clientHeight / 2 + 'px' ;
    div3.style.left = e.clientX - div3.clientWidth / 2 + 'px';
  };
  ```
  :::details 补充
  网页有滚动条时, 鼠标不会停留在元素上, 元素和鼠标之间的差距就是滚动条已经滚动的高度。因为鼠标的零点一直是相对浏览器的左上角, 而元素的零点是相对 document 的左上角。通过以下方式来解决。

  ```js
  var div3 = document.getElementById('div3');
  document.onmousemove = function(e) {
    e = e || window.event;
    div3.style.top = e.clientY - div3.clientHeight / 2 + window.scrollY + 'px' ;
    div3.style.left = e.clientX - div3.clientWidth / 2 + window.scrollX + 'px';
    
    // 或者直接使用 pageX 和 pageY
    // 但是 IE8 不支持这两个属性
    div3.style.top = e.pageY - div3.clientHeight / 2 + 'px' ;
    div3.style.left = e.pageX -div3.clientWidth / 2 + 'px';
  };
  ```
  当然, 除了以上方式以外, 还有其它解决办法。  

  **法1**   
  获取 body 标签的 `scrollTop`, 但是只有 Chrome 才有效。 

  **法2**  
  获取 html 标签的 `scrollTop`, 但是只有火狐才有效。获取 html 标签的方式如下: 
  ```js
  document.documentElement;
  ```

  其实, 上面的事件中就用到了冒泡。
  :::

- **元素拖拽**

  ```html
  <div id="box1"></div>
  <div id="box2"></div>
  ```
  ```css
  #box1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background: coral;
  }
  #box2 {
    position: absolute;
    left: 200px;
    top: 200px;
    width: 200px;
    height: 200px;
    background: cornflowerblue;
  }
  ```
  ```js
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    box.onmousedown = function(e) {
      document.onmousemove = function(e) {
        // 考虑兼容性
        e = e || window.event;
        box.style.top = e.clientY - box.clientHeight / 2 + 'px';
        box.style.left = e.clientX - box.clientWidth / 2 + 'px';
      };
    };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      document.onmouseup = null;
    };
  };
  ```
  ---

  > **缺点:**  
  > 会有跳动, 无论从哪里开始移动, 鼠标始终在元素中心。

  **改进:**  
  ```js
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    box.onmousedown = function(e) {
      // 考虑兼容性
      e = e || window.event;
      // 使元素不跳动
      var restX = e.clientX -  box.offsetLeft;
      var restY = e.clientY - box.offsetTop;
      document.onmousemove = function(e) {
        // 考虑兼容性
        e = e || window.event;
        box.style.top = e.clientY - restY + 'px';
        box.style.left = e.clientX - restX + 'px';
      };
    };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      document.onmouseup = null;
    };
  };
  ```
  ---
  > **缺点:**  
  > 当我们按下键盘的 `Ctrl` + `A` 时, 会全选页面, 当我们再次拖拽时, 所有的元素都会被拖拽。
  > 
  > 当拖拽网页中的内容时, 浏览器会自动取所搜引擎中所搜内容, 这时会造成拖拽异常。  
  > 这是浏览器的默认行为, 如果不希望发生, 可以取消默认行为。
  > 
  > 虽然种情况出现的频率不高, 但是, 我们还是要去量解决。    
  > **解决办法:**  
  > 法1: 在 onmousedown 之后返回 false, 但是 IE8 不起作用。  
  > 法2: IE 中有一个独有的方法 setCapture(), 该方法会将所有元素的鼠标按下事件都捕获到自己身上, 即点击任意元素都会触发设了的该方法的元素的鼠标按下事件（点击电脑桌面也会）, 但是该方法只会被执行一次。在火狐中不报错, 在 Chrome 中会报错。

  **解决上述问题:**  
  ```js
  // 拖拽功能
  window.onload = function() {
      var box = document.getElementById('box1');
      box.onmousedown = function(e) {
        // if (box.setCapture) {
        //     box.setCapture();
        // }
        // 等价写法如下
        box.setCapture && box.setCapture();
        // 考虑兼容性
        e = e || window.event;
        // 使元素不跳动
        var restX = e.clientX -  box.offsetLeft;
        var restY = e.clientY - box.offsetTop;
        document.onmousemove = function(e) {
          // 考虑兼容性
          e = e || window.event;
          box.style.top = e.clientY - restY + 'px';
          box.style.left = e.clientX - restX + 'px';
        };
        // 当拖拽网页中的内容时, 浏览器会自动取所搜引擎中所搜内容, 这时会造成拖拽异常。
        // 这是浏览器的默认行为, 如果不希望发生, 则可以取消默认行为。但是 IE8 不起作用。
        return false;
      };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      // document.onmouseup = null;
      box.releaseCapture && box.releaseCapture();
    };  
  };
  ```
  ---
  > **缺点:**  
  > 没有将拖拽封装成函数, 导致代码冗余。 

  **封装成函数:**  
  ```js
  function drag(ele,fun1,fun2,fun3) {
    ele.onmousedown = function(e) {
      ele.setCapture && ele.setCapture();
      e = e || window.event;
      var restX = e.clientX -  ele.offsetLeft;
      var restY = e.clientY - ele.offsetTop;
      document.onmousemove = function(e) {
        e = e || window.event;
        ele.style.top = e.clientY - restY + 'px';
        ele.style.left = e.clientX - restX + 'px';
      };
      return false;
    };
    
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
      ele.releaseCapture && ele.releaseCapture();
    };  
  }
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    var box2 = document.getElementById('box2');
    drag(box2);
  };
  ```
  ---

### 鼠标滚轮事件
现在, 我们要实现一个效果, 当鼠标向上滚动时, div 变小; 当鼠标向下滚动时, div 变长。
```js
function bind(obj, eventType, fun) {
  // 非 IE8
  if (obj.addEventListener) {
    obj.addEventListener(eventType,fun,false);
  } else {
    // obj.attachEvent('on'+eventType,fun);
    // 解决 this 的指向
    obj.attachEvent('on'+eventType,function() {
      fun.call(obj);
    });
  }
}
window.onload = function() {
  // 当鼠标滚轮向下滚动时, div 变长
  // 当鼠标滚轮向上滚动时, div 变短
  var box = document.getElementById('box1');
  var length = 10;
  // 滚轮事件, 但是火狐不支持 onmousewheel
  // 在火狐中要使用 DOMMouseScroll, 而且需要使用 addEventListene r来绑定
  box.onmousewheel = function(e) {
    e = e || window.event;
    // 获取滚轮滚动的方向 wheelDelta
    // 向上为正, 向下为负
    // 但是火狐不支持 wheelDelta 属性, 火狐中要使用 detail
    // 但是火狐中向上为负, 向下为正
    if (e.wheelDelta > 0 || e.detail < 0) {
      box.style.height = box.clientHeight - length + 'px';
    } else {
      box.style.height = box.clientHeight + length + 'px';
    }

    // 取消火狐的默认行为
    // 但是 IE8 不支持
    e.preventDefault && e.preventDefault();
    // 如果浏览器存在滚动条, 鼠标滚动时会使之滚动, 这是浏览器的默认行为
    // 可以取消, renturn false
    // 但是火狐不支持
    return false;
  };

  // 为火狐绑定
  bind(box,'DOMMouseScroll',box.onmousewheel);
};
```

### 事件冒泡
当后代元素中的某个事件被触发时, 其父节点及其以上节点的**相同**事件都会被触发（如果有的话）, 这就是冒泡。在开发中, 大部分的冒泡是有用的。

**使用事件对象来取消冒泡:**   


```html
<div id="div1">
  div1
  <p id="p1">p1</p>
</div>
```
```css
#div1 {
  width: 200px;
  height: 200px;
  background: darkorange;
}

#p1 {
  background-color: darkorchid;
}
```
```js
window.onload = function() {
  var div1 = document.getElementById('div1');
  var p1 = document.getElementById('p1');
  var body = document.body;

  p1.onclick = function(e) {
    console.log('我是p标签');
    e = e || window.event;

    // 取消冒泡
    e.cancelBubble = true;
  };

  div1.onclick = function(e) {
    console.log('我是div1');
    e = e || window.event;
    // 取消冒泡
    e.cancelBubble = true;
  };

  body.onclick = function() {
    console.log('我是body');
  };
};
```

### 事件委派
请先看以下代码, 我们给每一个超链接都绑定一个事件: 
```html
<button id="btn01">添加超链接</button>
<ul>
  <li><a href="javascript:;" id="a1" class="link">超链接1</a></li>
  <li><a href="javascript:;" id="a2" class="link">超链接2</a></li>
  <li><a href="javascript:;" id="a3" class="link">超链接3</a></li>
</ul>
```
```js
window.onload = function() {
  var as = document.getElementsByTagName('a');
  for (var i = 0; i < as.length; i++) {
    as[i].onclick = function() {
      console.log('a');
    };
  }

  var btn01 = document.getElementById('btn01');
  btn01.onclick = function() {
    var li = document.createElement('li');
    li.innerHTML = '<a href="javascript:;" id="a6" class="link">超链接6</a>';
    var ul = document.getElementsByTagName('ul')[0];
    ul.appendChild(li);
  };
};
```
:::warning 引发的问题
1. 这里, 我们为已有的每一个超链接都绑定了一个事件, 操作比较麻烦。
2. 新增的超链接必须重新再添加一次事件, 麻烦而且性能不好。
3. 我们希望只绑定一次事件, 所有的元素就可以有了该操作, 即使是后添加的。这时, 我们就可以使用事件委派。
:::

**事件委派基本思想:**  
将多个元素需要绑定的事件绑定到其共同的祖先元素中。利用了冒泡的原理, 可以减少事件绑定的次数, 提高性能。

- 使用事件委托  

  ```js
  var ul = document.getElementsByTagName('ul')[0];
  ul.onclick = function(e) {
    // 判断事件由谁触发
    // 如果是由a标签触发的, 才进行操作
    // if (e.target.className.indexOf('link') > 0)
    if (e.target.nodeName == 'A') {
      console.log('a触发');
    }
  };
  ```
:::tip 提示
此处用到了 Event 对象的 target 属性, 更多请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_event.asp)。
:::

### 事件传播
:::tip 说明
**微软:**  
事件是由内向外传播的。即先触发当前元素, 再向其祖先元素传播。事件应该在冒泡阶段执行。 

**网警公司:**  
事件是由外向内传播的。即事件应该在捕获阶段执行。  

**w3cschool:**  
综合上面两种, 将事件的传播分为 3 个阶段。
1. **事件捕获阶段**  
从最外层（window或document）的祖先元素向目标元素进行事件的捕获, 但是默认不会触发事件。
2. **目标阶段**  
事件捕获到目标元素, 捕获结束就开始在目标元素上触发事件
3. **冒泡阶段**  
事件从目标元素向其祖先元素传递, 依次触发祖先元素的相同事件。  

如果希望在捕获阶段就触发事件, 可以将 `addEventListener `的第三个参数设置为 `true`, 但一般情况下不用。IE8 及以下的浏览器没有事件的捕获, 所以就没第三个参数。
:::

### 键盘事件

|属性|描述|
|---|---|
|`onkeydown`|某个键盘按键被按下（长按也会触发）, 但第一次和第二次之间的时间间隔稍长（目的是防止误操作）。|
|`onkeypress`|某个键盘按键被按下并松开（长按）。|
|`onkeyup`|某个键盘按键被松开。|


|Event的键盘属|描述|
|---|---|
|`altKey`|返回当事件被触发时, "ALT" 是否被按下。|
|`ctrlKey`|返回当事件被触发时, "CTRL" 键是否被按下。|
|`metaKey`|返回当事件被触发时, "meta" 键是否被按下。|。
|`shiftKey`|返回当事件被触发时, "SHIFT" 键是否被按下。|
|`key`|得到所按的键, 区分大小写。|
|`code`|得到所按的键, 不区分大小写。形如 keyA|
|`keyCode`|得到按键的 ASCII 码。|

:::tip 提示
键盘事件一般绑定给可以获取到焦点的对象或者 document。
:::

---

- 判断是否同时按下多个键  

  ```js
  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.altKey && e.key.toLowerCase() == 'a') {
      console.log('Alt + ' + e.key.toUpperCase());
    }
  };
  ```
- 阻止 input 框输入  

  其思想就是取消 input 的默认行为, 直接 `return false`。
  ```js
  input.onkeydown = function(e) {
    e = e || window.event;
    return false;
  };
  ```

- 限制文本框只能输入数字  

  ```js
  // 用到了取消默认行为的方法
  input1.onkeydown = function(e) {
    e = e || window.event;
    var mkeyCode = e.keyCode;
    if (!(48 <= mkeyCode && mkeyCode <= 57)) {
        return false;
    } else {
      console.log(mkeyCode);
    }
  };
  ```

- 移动 div  

  ```js
  window.onload = function() {
    // 移动 div
    var div1 = document.getElementById('div1');
    var speed = 5;
    document.onkeydown = function(e) {
      // var top = div1.offsetTop;
      // var left = div1.offsetLeft;
      // var right = 
      e = e || window.event;
      var keyboard = e.key;
      // 向上移动
      if (keyboard == 'ArrowUp' || keyboard.toUpperCase() == 'W') {
        if (div1.offsetTop <= 0) {
          div1.style.top = 0;
        } else {
          div1.style.top = div1.offsetTop - speed + 'px';
        }
      }
      // 向下移动
      if (keyboard == 'ArrowDown' || keyboard.toUpperCase() == 'S') {
        if (div1.offsetTop >= window.innerHeight - div1.clientHeight) {
          speed = 0;
        } else {
          speed = 5;
        }
        div1.style.top = div1.offsetTop + speed + 'px';
      }
      // 向左移动
      if (keyboard == 'ArrowLeft' || keyboard.toUpperCase() == 'A') {
        if (div1.offsetLeft <= 0) {
          div1.style.left = 0;
        } else {
          div1.style.left = div1.offsetLeft - speed + 'px';
        }
      }
      // 向右移动
      if (keyboard == 'ArrowRight' || keyboard.toUpperCase()== 'D') {
        if (div1.offsetLeft >= window.innerWidth - div1.clientWidth) {
          speed = 0;
        } else {
          speed = 5;
        }
        div1.style.left = div1.offsetLeft + speed + 'px';
      }
    };
  };
  ```

## 获取浏览器窗口的大小

|方法/属性|描述|
|---|---|
|`window.innerHeight`|返回窗口的文档显示区的高度。（会动态变化）|
|`window.innerWidth`|返回窗口的文档显示区的宽度。（会动态变化）|

```js
// 浏览器窗口改变时触发
window.onresize = function() {
  console.log("window.innerHeight: "+  window.innerHeight);
  console.log("window.innerWidth: " + window.innerWidth);
  console.log("window.outerHeight: " + window.outerHeight);
  console.log("window.pageXOffset: " + window.pageXOffset);
  console.log("window.pageYOffset: " + window.pageYOffset);
};
```

## BOM
BOM（Browser Object Model） 即浏览器对象模型, 可以通过 JS 来操作浏览器。  

:::tip 提示
在 BOM 提供了一组对象来完成对浏览器的操作:   
1. Window  

  代表了整个浏览器的窗口, 同时也是网页中的全局对象。

2. Navigator  

  代表了当前浏览器的信息, 通过该对象可以识别不同浏览器。

3. Location  

  代表当前浏览器的地址栏信息, 通过该对象可以获取地址栏信息或者跳转页面。

4. Screen  

  通过该对象可以获取到用户屏幕的当前信息或者显示器的相关信息。

5. History  

  代表浏览器的历史记录, 可以通过该对象操作浏览器的历史记录。由于隐私的原因, 该对象不能获取到具体的历史信息; 只能操作浏览器向前或向后翻页, 该操作只在当次访问时有效。  

**这些对象全都是作为 Window 对象的属性保存的, 可以通过 Window 对象来使用, 也可以直接使用。**
:::

```js
window.onload = function() {
  console.log(window);
  console.log(navigator);
  console.log(location);
};
```
:::tip 提示
Window 的属性请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_window.asp)。
:::

### Navigator
#### Navigator 对象属性
- `appName`  

  返回浏览器的名称。但是, 除了 IE11 以外, 其它浏览器都会返回 Netscape。

- `userAgent`  

  返回由客户机发送服务器的 user-agent 头部的值。通常使用这种方式来判断浏览器信息。userAgent 等价于浏览器。该属性中包含了浏览器的相关信息, 不同浏览器的该属性不同。
  ```js
  // IE11 中已经无法通过此方式来检查是否是 IE 了
  if (/chrome/i.test(navigator.userAgent)) {
    console.log('我是chrome');
  } else if (/firefox/i.test(navigator.userAgent)) {
    console.log('我是firefox');
  } else if (/msie/i.test(navigator.userAgent)) {
    console.log('我是ie10及以下');
  }
  ```

  :::tip 说明
  如果通过此方式不能判断浏览器类别, 那么还有其它方法, 其基本方法就是找到浏览器中特有的对象。比如 IE 的 ActiveXObject 对象。
  ```js
  if (window.ActiveXObject) {
    console.log('IE');
  } else {
      console.log('不是 IE');
  }
  ```
  但是在 IE11 中 window.ActiveXObject 会被转换成 false。但是, 魔高一尺道高一丈, 我们可以使用 `in` 来判断 window 对象中是否有 ActiveXObject 这个属性, 如下: 
  ```js
  if (`ActiveXObject` in window) {
    console.log('IE');
  } else {
    console.log('不是 IE');
  }
  ```

  Navigator 对象属性请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_navigator.asp)。
  :::

### History
|属性|描述|
|---|---|
|`length`|返回浏览器历史列表中的 URL 数量。|

|方法|描述|
|---|---|
|`back()`|加载 history 列表中的前一个 URL。|
|`forward()`|加载 history 列表中的下一个 URL。|
|`go()`|加载 history 列表中的某个具体页面。|


### Location
|属性|描述|
|---|---|
|`hash`|设置或返回从井号 (#) 开始的 URL（锚）。|
|`host`|设置或返回主机名和当前 URL 的端口号。|
|`hostname`|设置或返回当前 URL 的主机名。|
|`href`|设置或返回完整的 URL。|
|`pathname`|设置或返回当前 URL 的路径部分。|
|`port`|设置或返回当前 URL 的端口号。|
|`protocol`|设置或返回当前 URL 的协议。|
|`search`|设置或返回从问号 (?) 开始的 URL（查询部分）。|

|方法|描述|
|---|---|
|`assign()`|加载新的文档。|
|`reload()`|重新加载当前文档（即刷新）。|
|`replace()`|用新的文档替换当前文档。|

---

```js
var btn = document.getElementById('btn');
  btn.onclick = function() {
    // 绝对路径
    // location = 'http://www.baidu.com';
    // 相对路径
    location = 'historydemo02.html';
  };
};
```
:::tip 提示
修改 location 会生成历史记录（history）。
:::

```js
btn.onclick = function() {
  location.assign('http://www.baidu.com');
};
```
:::tip 提示
`assign()` 方法和以上方式类似, 也会生成历史记录（history）。
:::

- reload()  

  刷新操作, 但是由于浏览器的缓存原因, 可能会保留用户已经输入的数据（如 input 框）, 这时可以使用 `Ctrl`+`F5` 强制清空缓存刷新。也可以通过编码的方式, 即在该函数中传入一个参数 true。
  ```js
  location.reload(true);
  ```

- replace()  

  与 `assign()` 类似, 但是此方式不能生成历史记录（history）。
  
---

## 定时器

|方法|描述|
|---|---|
|`setInterval()`|	按照指定的周期（以毫秒计）来调用函数或计算表达式。返回值是 Number 类型, 用来作为该定时器的唯一标识。|
|`setTimeout()`|在指定的毫秒数后调用函数或计算表达式。也可以称为延时。|
|`clearInterval()`|取消由 `setInterval()` 设置的 timeout。该方法可以接收任意值, 甚至是 null 和 undefined 等, 如果参数无效, 则什么都不执行。|
|`clearTimeout()`|取消由 `setTimeout()` 方法设置的 timeout。|

:::warning 注意
它们都是 window 对象的方法, **使用时有必要为定时器加锁。**

**setInterval() 和 setTimeout() 的区别:**  
`setInterval()` 执行多次, 而 `setTimeout()` 只执行一次。  

**setInterval() 和 setTimeout() 的关系:**  
两者可以相互代替, 即 `setInterval()` 可以实现 `setTimeout()` 的功能, 反之, `setTimeout()` 也能实现 `setInterval()` 的功能。
:::

- 显示时间  

  ```js
  setInterval(function() {
    h1.innerHTML = new Date().toLocaleString();
  }, 1000);
  setTimeout(function() {
    clearInterval(timer);
  }, 10000);
  ```
  
- 显示数字

  ```js
  var timer = setInterval(function() {
    h1.innerHTML = count++;
    if (count == 10) {
      clearInterval(timer);
      console.log('清除');
    }
  }, 1000);
  ```

### 示例
- 图片切换

  ```html
  <div id="container">
    <button id="btn">开始播放图片</button>
    <button id="btn02">停止播放图片</button>
    <img src="imgs/P22.jpg" alt="" class="picture">
  </div>
  ```
  ```css
  body {
    margin: 0;
    padding: 0;
  }
  #container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .picture {
    width: 90%;
  }
  ```
  ```js
  window.onload = function() {
    var img = document.querySelector('.picture');
    var btn = document.getElementById('btn');
    var btn02 = document.getElementById('btn02');
    var map = ['imgs/P22.jpg','imgs/P26.jpg','imgs/P30.jpg','imgs/P31.jpg','imgs/P5.jpg'];
    var index = 0;
    var timer = null;
    // 给 setInterVal 增加锁
    var flag = false;
    btn.onclick = function() {
      // 加锁方式二, 在每次执行之前, 关闭上一次的定时器
      // 该方式只适用于同一个 timer 对象
      // clearInterval(timer);

      if (!flag) {
        timer = setInterval(function() {
          var length = map.length;
          img.src = map[index++ % length];
          flag = true;
        }, 1000);
        console.log('播放');
      }
    };
    btn02.onclick = function() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        flag = false;
      }
    };
  };
  ```
  
- 移动 div  

  主要是利用定时器来解决使用 onkeydown 事件带来的第一次和第二次之间的延迟。
  ```js
  window.onload = function () {

    // 移动 div
    var div1 = document.getElementById('div1');
    var speed = 10;
    var keyboard = '';

    // 使用定时器来控制速度
    setInterval(function() {
      // 向上移动
      if (keyboard == 'ArrowUp' || keyboard.toUpperCase() == 'W') {
        if (div1.offsetTop <= 0) {
          speed = 0;
        } else {
          speed = 10;
        }
        div1.style.top = div1.offsetTop - speed + 'px';
      }
      // 向下移动
      if (keyboard == 'ArrowDown' || keyboard.toUpperCase() == 'S') {
        if (div1.offsetTop >= window.innerHeight - div1.clientHeight) {
          speed = 0;
        } else {
          speed = 10;
        }
        div1.style.top = div1.offsetTop + speed + 'px';
      }
      // 向左移动
      if (keyboard == 'ArrowLeft' || keyboard.toUpperCase() == 'A') {
        if (div1.offsetLeft <= 0) {
          speed = 0;
        } else {
          speed = 10;
        }
        div1.style.left = div1.offsetLeft - speed + 'px';
      }
      // 向右移动
      if (keyboard == 'ArrowRight' || keyboard.toUpperCase() == 'D') {
        if (div1.offsetLeft >= window.innerWidth - div1.clientWidth) {
          speed = 0;
        } else {
          speed = 5;
        }
        div1.style.left = div1.offsetLeft + speed + 'px';
      }
    }, 100);
    
    // 只控制方向
    document.onkeydown = function(e) {
      e = e || window.event;
      keyboard = e.key;
    };

    // 当松开鼠标时, 不移动
    // 不加这个事件就类似贪吃蛇
    document.onkeyup = function() {
      keyboard = '';
    };
  };


  ```
- 控制 Div 移动  

  点击按钮, 然后让 div 移动。

  ```html
  <button id="btn01">向右移动</button>
  <button id="btn02">向左移动</button>
  <div id="box1"></div>
  ```
  ```js
  var timer;
  function getStyle(obj,styleName) {
    if (window.getComputedStyle) {
      return getComputedStyle(obj,null)[styleName];
    } else {
        // 如果该属性没有被指定值, 有可能会返回auto
      return obj.currentStyle[styleName];
    }
  }

  function move(obj, speed, direction, limit) {
    direction = direction || 'right';
    clearInterval(timer);
    if (direction.toLowerCase() == 'left') {
      speed = -speed;
    }
    timer = setInterval(function() {
      var oldValue = parseInt(getStyle(obj,'left'));
      var newValue = oldValue + speed;
      if ((direction == 'left' && newValue < limit) || (direction == 'right' && newValue > limit)) {
        newValue = limit;
      }
      obj.style.left = newValue + 'px';
      if (newValue === limit) {
        clearInterval(timer);
      }
    }, 100);
  }
  window.onload = function() {
    // 点击按钮, div 向右移动
    var btn01 = document.getElementById('btn01');
    var btn02 = document.getElementById('btn02');
    var box1 = document.getElementById('box1');

    btn01.onclick = function() {
      move(box1,20,'',800);
    }
    btn02.onclick = function() {
      move(box1,20,'left',0);
    }
    // 控制向右移动
    // btn01.onclick = function() {
    //   clearInterval(timer);
    //   timer = setInterval(function() {
    //     var oldValue = parseInt(getStyle(box1,'left'));
    //      if (oldValue + box1.clientWidth >= window.innerWidth || oldValue < 0) {
    //       speedRight = -speedRight;
    //     }
    //     box1.style.left = oldValue + speedRight + 'px';
         
    //   }, 100);
    // };
  };
  ```

  :::tip 提示`
  当有两个元素同时使用上面的函数移动时, 只会运行后点击的, 因为两个使用了同一个全局变量 timer 对象。那么, 我们如何解决呢？其实非常简单, 只需要为对象添加一个 timer 属性即可。
  ```js
  function move(obj, speed, direction, limit) {
    direction = direction || 'right';
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
      // ...
      clearInterval(obj.timer);
    }, 100);
  }
  ```
  :::

- 封装一个函数, 实现多种动画  

  ```html
  <button id="btn06">动画</button>
  <div id="box1"></div>
  <div id="box2"></div>
  ```
  ```css
  body {
    margin: 0;
    padding: 0;
  }
  #box1{
    position: absolute;
    left: 0;
    width: 150px;
    height: 150px;
    background-color: burlywood;
  }
  #box2 {
    position: absolute;
    left: 0;
    top: 200px;
    width: 150px;
    height: 150px;
    background-color: cornflowerblue;
  }
  ```
  ```js
  function getStyle(obj,styleName) {
    if (window.getComputedStyle) {
      return getComputedStyle(obj,null)[styleName];
    } else {
      // 如果该属性没有被指定值, 有可能会返回 auto
      return obj.currentStyle[styleName];
    }
  }

  // obj 要操作的对象
  // attr 要修改的样式的属性
  // speed 改变的速度（大于0）
  // limit 限制（最高或最低）
  // callback 样式修改完成后的回调函数
  function move(obj, attr, speed, limitValue, callback) {
    clearInterval(obj.timer);
    var currentValue = parseInt(getStyle(obj,attr));
    if (currentValue > limitValue) {
      speed = -speed;
    }
    obj.timer = setInterval(function() {
      var oldValue = parseInt(getStyle(obj,attr));
      var newValue = oldValue + speed;
      if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
        newValue = limitValue;
      }
      obj.style[attr] = newValue + 'px';
      if (newValue === limitValue) {
        clearInterval(obj.timer);
        callback && callback();
      }
    }, 200);
  }
  window.onload = function() {
    var btn06 = document.getElementById('btn06');
    var box1 = document.getElementById('box1');
    var box2 = document.getElementById('box2');

    btn06.onclick = function() {
      move(box2,'width',50,800,function() {
        move(box2,'height',50,300,function() {
          move(box2,'top',30,100,function() {
            move(box2,'width',30,100);
          });
        });
      });
    };
  };
  ```

- 轮播图  

  ```html
  <div id="container">
    <ul id="imglist">
        <li><img src="imgs/P5.jpg" alt=""></li>
        <li><img src="imgs/P22.jpg" alt=""></li>
        <li><img src="imgs/P26.jpg" alt=""></li>
        <li><img src="imgs/P30.jpg" alt=""></li>
        <li><img src="imgs/P31.jpg" alt=""></li>
        <!-- 最后一张设置成和第一张相同 -->
        <li><img src="imgs/P5.jpg" alt=""></li>
    </ul>
    <!-- 创建导航按钮 -->
    <div id="nav">
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
        <a href="javascript:;"></a>
    </div>
  </div>
  ```
  ```css
  body,ul,li{
    margin: 0;
    padding: 0;
  }
  #container{
    width: 620px;
    height: 350px;
    margin: 100px auto 0 auto;
    background: #ccc;
    padding: 10px;
    position: relative;
    overflow: hidden;
    /* 取消因li设置display: inline-block带来的间隙 */
    font-size: 0;
  }
  /* 父元素必须设置宽度才能使用display: inline-block */
  ul {
    /* width: 3000px; */
    position: absolute;
    left: 10px;
    list-style: none;
    /* transition: left 1.5s ease; */
  }
  ul > li{
    list-style: none;
    display: inline-block;
    margin: 0 10px;
    overflow: hidden;
    /* float: left; */
  }
  ul > li > img{
    width: 600px;
    height: 350px;
    /* 使每张图片都自己缩放, 并且不影响画质 */
    background-size: cover;
  }

  #nav{
    position: absolute;
    bottom: 20px;
    /* left: 50%;
    IE8 不支持 transform
    transform: translateX(-50%); */
    z-index: 10;
  }
  #nav a{
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: pink;
    margin: 0 5px;
    /* IE8 不支持直接写 */
    opacity: 0.5;
    /* 使 IE8 兼容opacity */
    filter: alpha(opacity=50);
  }
  #nav a:hover{
    background-color: #ccc;
  }
  ```
  ```js
  function getStyle(obj,styleName) {
    if (window.getComputedStyle) {
      return getComputedStyle(obj,null)[styleName];
    } else {
      // 如果该属性没有被指定值, 有可能会返回 auto
      return obj.currentStyle[styleName];
    }
  }

  // 设置移动动画
  function move(obj, attr, speed, limitValue, callback) {
    clearInterval(obj.timer);
    var currentValue = parseInt(getStyle(obj,attr));
    if (currentValue > limitValue) {
      speed = -speed;
    }
    obj.timer = setInterval(function() {
      var oldValue = parseInt(getStyle(obj,attr));
      var newValue = oldValue + speed;
      if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
        newValue = limitValue;
      }
      obj.style[attr] = newValue + 'px';
      if (newValue === limitValue) {
        clearInterval(obj.timer);
        callback && callback();
      }
    }, 50);
  }

  window.onload = function() {
    var timer;
    /* 父元素必须设置宽度才能使用 display: inline-block */
    var ul = document.getElementById('imglist');
    var lis = ul.getElementsByTagName('li');
    var as = document.getElementsByTagName('a');

    // 记录当前循环的图片次数, 当前的 a 标签索引
    var index = 0;

    // 设置 ul 的宽度
    ul.style.width = 620 * lis.length + 'px';

    // 将第一个 a 标签设置为选中
    as[index].style.backgroundColor = "#ccc";

    // 设置导航的 div 居中
    var nav = document.getElementById('nav');
    var container = document.getElementById('container');
    nav.style.left = (container.offsetWidth - nav.offsetWidth) / 2 + 'px';

    // 点击第 n 个 a 标签, 显示第 n 个图片
    for (var i = 0; i < as.length; i++) {
      // 为每个超链接添加它的索引
      // 这样就不用第二次循环了, 直接取 this.index 即可。
      as[i].index = i;
      as[i].onclick = function() {
        // 点击时, 关闭定时器
        clearInterval(timer);
        // 把 this.index 赋值给全局的 index
        index = this.index;
        // 切换图片
        // ul.style.left = -620 * index + 10 + 'px';
        // 使用move函数来切换图片
        move(ul,'left',100,-620*index + 10,function() {
          // 动画执行完毕后, 开启定时器
          autoChange();
        });
        setBgdColor();
        // for (var j = 0; j < as.length; j++) {
        //     console.log('xunhuan');
        //     if (as[j] === this) {
        //         as[j].style.backgroundColor = "#ccc";
        //         ul.style.left = -620 * j + 10 + 'px';
        //     } else {
        //         as[j].style.backgroundColor = "pink";
        //     }
        // }
      };
    }
  
    // 开启自动切换
    autoChange();

    // 设置被选中的 a 的背景
    function setBgdColor() {
      // 判断当前索引是否是最后一张图片
      if (index >= lis.length - 1) {
        // 将 a 标签切换为第一个
        index = 0;
        // 将 ul 的最后一张图片切换成第一张
        ul.style.left = '10px';
      }
      for (var i = 0; i < as.length; i++) {
        // 直接设置成为 pink 的话, 在第一次点击后, hover 会失效
        // as[i].style.backgroundColor = 'pink';
        // 为了时hover不失效, 设置为空, 会使用样式表中的样式
        // 在样式表中, 我们设置成了 pink
        as[i].style.backgroundColor = '';
      }
      as[index].style.backgroundColor = '#ccc';
    }

    // 自动切换图片
    function autoChange() {
      timer = setInterval(function() {
        index++;
        // 防止 index 越界
        index %= lis.length;
        // 更改 a 标签背景, 此行要放在前面
        // 或者放在回调函数中
        // setBgdColor();
        // 切换图片
        move(ul,'left',100,-620 * index + 10,function() {
          // 更改 a 标签背景, 放在回调函数中
          setBgdColor();
        });
          
      }, 3000);
    }
  };
  ```

- 二级菜单  

  ```html
  <div id="container">
    <div class="item">
      <span class="item-theme">员工管理</span>
      <a href="#" class="item-tool">添加员工</a>
      <a href="#" class="item-tool">修改员工</a>
      <a href="#" class="item-tool">查询员工</a>
      <a href="#" class="item-tool">删除员工</a>
      <a href="#" class="item-tool">拉黑员工</a>
    </div>
    <div class="item collapse">
      <span class="item-theme">权限管理</span>
      <a href="#" class="item-tool">添加权限</a>
      <a href="#" class="item-tool">删除权限</a>
      <a href="#" class="item-tool">权限控制</a>
    </div>
    <div class="item collapse">
      <span class="item-theme">关于我们</span>
      <a href="#" class="item-tool">支持我们</a>
      <a href="#" class="item-tool">加入我们</a>
      <a href="#" class="item-tool">赞助我们</a>
    </div>
  </div>
  ```
  ```css
  * {
    margin: 0;
    padding: 0;
  }
  #container {
    width: 152px;
    border-radius: 5px 5px 0 0;
    text-align: center;
    overflow: hidden;
    margin: 0 auto;
  }
  .item {
    overflow: hidden;
    min-height: 28px;
  }
  
  .item .item-theme {
    display: block;
    background-color: #20222A;
    color: #fff;
    width: 150px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border: 1px solid #20222A;
    /* border-radius: 5px 5px 0 0; */
    border-top: 1px solid rgb(83, 83, 83);
    cursor: pointer;
  }
  .item .item-tool {
    display: block;
    width: 150px;
    padding: 5px 0;
    text-align: center;
    font-size: 14px;
    text-decoration: none;
    color: #959698;
    background-color: #16181d;
    border-bottom: 1px solid #333;
  }
  .item .item-tool:last-child {
    border: none;
  }
  .item .item-tool:hover {
    color: #fff;
    background-color: #009688;
  }
  .collapse {
    height: 28px;
  }
  ```
  ```js
  // 定义函数, 用来向元素中添加指定的 class 值
  // obj 要添加 class 的元素
  // values 要添加的 class 值
  function addClass(obj, values) {
    if (Array.isArray(values)) {
      for (var i = 0; i < values.length; i++) {
        if (!hasClassName(obj, values[i])) {
          obj.className += ' ' + values[i];
        }
      }
    }
  }

  // 判断元素是否有某个 class 值
  function hasClassName(obj, value) {
    var reg = new RegExp("\\b" + value + "\\b");
    return reg.test(obj.className);
    // 此处不能使用 indexOf()
    // return obj.className.indexOf(value) >= 0? true:false;
  }

  // 删除某个元素的 class 值
  function removeClass(obj, value) {
    if (hasClassName(obj,value)) {
      var reg = new RegExp("\\b" + value + "\\b");
      obj.className = obj.className.replace(reg, "");
    }
  }

  // 切换一个类, 如果元素中有该 className, 则删除; 否则, 添加
  function toggleClassName(obj, value) {
    if (hasClassName(obj,value)) {
        removeClass(obj,value);
    } else {
      var arr = [];
      arr.push(value);
      addClass(obj,arr);
    }
  }

  function getStyle(obj,styleName) {
    if (window.getComputedStyle) {
      return getComputedStyle(obj,null)[styleName];
    } else {
      // 如果该属性没有被指定值, 有可能会返回 auto
      return obj.currentStyle[styleName];
    }
  }
  // 设置移动动画
  function move(obj, attr, speed, limitValue, callback) {
    clearInterval(obj.timer);
    var currentValue = parseInt(getStyle(obj,attr));
    if (currentValue > limitValue) {
      speed = -speed;
    }
    obj.timer = setInterval(function() {
      var oldValue = parseInt(getStyle(obj,attr));
      var newValue = oldValue + speed;
      if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
          newValue = limitValue;
      }
      obj.style[attr] = newValue + 'px';
      if (newValue === limitValue) {
          clearInterval(obj.timer);
          callback && callback();
      }
    }, 50);
  }
  window.onload = function() {
    var spans = document.querySelectorAll('.item-theme');
    var items = document.querySelectorAll('.item');
    // 保存当前打开的 div
    var openDiv = spans[0].parentElement;
    for (var i = 0; i < spans.length; i++) {
        spans[i].onclick = function() {
          // 关闭上次打开的 div
          // for (var j = 0; j < items.length; j++) {
          //     if (!hasClassName(items[j], 'collapse') ) {
          //         addClass(items[j], ['collapse']);
          //     }
          // }

          // 获取父元素
          var parentEle = this.parentElement;
          toggleMenu(parentEle);
          // 判断 openDiv 和 this.parentElement 是否是同一个对象
          if (openDiv != parentEle) {
            // 关闭上次打开的 div
            // addClass(openDiv,['collapse']);
            // 为了方便处理动画, 这里使用 toggleClassName() 方法
            // 判断是否存在 collapse
            if (!hasClassName(openDiv,'collapse')) {
              // toggleClassName(openDiv,'collapse');
              toggleMenu(openDiv);
            }
          }
          // 保存上次打开的 div
          openDiv = parentEle;
        };
      }

      // 用来切换菜单折叠和显示
      function toggleMenu(obj) {
        // 切换之前, 获取父元素的高度
        var begin = obj.offsetHeight;
        toggleClassName(obj, 'collapse');
        // 切换之后, 获取父元素的高度
        var end = obj.offsetHeight;
        // console.log(begin+"    "+end);
        // 将元素的高度重置为 begin
        obj.style.height = begin + 'px';
        // 执行动画
        move(obj,'height',30,end,function() {
          // 动画执行完成后, 删除内联样式
          obj.style.height = '';
        });
      }
  };
  ```
### 引发的思考
定时器真的能按时准确的执行吗？先来看以下的代码: 
```js
var start = Date.now()
console.log('开始')
setTimeout(function() {
  console.log('执行',Date.now()-start)
}, 200)
console.log('结束')
for (var i = 0; i < 1000000; i++) {
    
}
```
可以看见, 它并不是在 200ms 后才执行的, 有了延迟。是因为它的回调函数在主线程中执行。alert 函数会中断计时器的计时, 它暂停的是主线程。
## 类
先来看一段代码: 
```html
<button id="btn1">点击按钮后修改div的样式</button><br><br>
<div id="div1" class="div1"></div>
```
```css
.div1 {
  width: 200px;
  height: 200px;
  background: tan;
}
.div2 {
  width: 100px;
  /* height: 100px; */
  background: pink;
}
```
```js
// 定义函数, 用来向元素中添加指定的 class 值
// obj 要添加 class 的元素
// values 要添加的 class 值
function addClass(obj, values) {
  if (Array.isArray(values)) {
    for (var i = 0; i < values.length; i++) {
      if (!hasClassName(obj, values[i])) {
        obj.className += ' ' + values[i];
      }
    }
  }
}

// 判断元素是否有某个 class 值
function hasClassName(obj, value) {
  var reg = new RegExp("\\b" + value + "\\b");
  return reg.test(obj.className);
  // return obj.className.indexOf(value) >= 0? true:false;
}

// 删除某个元素的 class 值
function removeClass(obj, value) {
  if (hasClassName(obj,value)) {
    var reg = new RegExp("\\b" + value + "\\b");
    obj.className = obj.className.replace(reg, "");
  }
}

// 切换一个类, 如果元素中有该 className, 则删除; 否则, 添加
function toggleClassName(obj, value) {
  if (hasClassName(obj,value)) {
    removeClass(obj,value);
  } else {
    var arr = [];
    arr.push(value);
    addClass(obj,arr);
  }
}
window.onload = function() {
  var btn1 = document.getElementById('btn1');
  var div1 = document.getElementById('div1');
  btn1.onclick = function() {
    // 修改大小
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.backgroundColor = 'pink';
    // 但是, 这样会导致 div 的 class 没有了 div1, 需要改进
    // div1.className = 'div2';
    // 注意字符串前面有空格
    // div1.className += " div2";
    addClass(div1,['div1','div2','div3']);
    toggleClassName(div1,'div6');
  };
};
```

:::tip 分析
使用 js 通过 style 来修改样式时, 每修改一个样式, 浏览器都需要重新渲染一次页面, 性能较差, 而且这种方式也不太方便。  
我们希望一行代码同时修改多个样式。修改 div 的 className 来间接修改样式, 这样只需修改一次即可, 浏览器也只需渲染一次。
:::

```js
// 定义函数, 用来向元素中添加指定的 class 值
// obj 要添加 class 的元素
// values 要添加的 class 值
function addClass(obj, values) {
  if (Array.isArray(values)) {
    for (var i = 0; i < values.length; i++) {
      if (!hasClassName(obj, values[i])) {
        obj.className += ' ' + values[i];
      }
    }
  }
}

// 判断元素是否有某个 class 值
function hasClassName(obj, value) {
  var reg = new RegExp("\\b" + value + "\\b");
  return reg.test(obj.className);
}

// 删除某个元素的 class 值
function removeClass(obj, value) {
  if (hasClassName(obj,value)) {
    var reg = new RegExp("\\b" + value + "\\b");
    obj.className = obj.className.replace(reg, "");
  }
}

// 切换一个类, 如果元素中有该 className, 则删除; 否则添加
function toggleClassName(obj, value) {
  if (hasClassName(obj,value)) {
    removeClass(obj,value);
  } else {
    var arr = [];
    arr.push(value);
    addClass(obj,arr);
  }
}
window.onload = function() {
  var btn1 = document.getElementById('btn1');
  var div1 = document.getElementById('div1');
  btn1.onclick = function() {
    // 修改大小
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.backgroundColor = 'pink';
    // 但是, 这样会导致 div 的 class 没有了 div1, 需要改进
    // div1.className = 'div2';
    // 注意字符串前面有空格
    // div1.className += " div2";
    addClass(div1,['div1','div2','div3']);
    toggleClassName(div1,'div6');
  };
}
```
:::tip 提示
也可以使用 `setAttribute()` 和 `getAttribute()` 方法, 还可以使用 HTML5 提供的 `classList` 属性。classList 属性的用法请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)。
:::

## JSON
JSON（JavaScript Object Notation）即 JS对象表示法, 它的格式和 JS 对象的格式类似, 只不过JSON的属性名必须加**双引号**, 其它用法和 JS 一致。  

JS 中的对象只有 JS 才能识别, 其它语言不能识别; 同样, JS 也不能识别其它语言的对象。为了让前后台有交互, 需要使用任何语言都认识的对象, 因此, 有了 JSON。JSON 就是一个特殊格式的字符串, 它能被所有语言识别并且可以转换为任何语言的对象。

- JSON 对象  
  
  使用 `{ }` 表示。
  ```js
  var obj = '{"name":"zs","age":16}';
  ```

- JSON 数组  

  使用 `[ ]` 表示。
  ```js
  var obj = '[1,2,3,"zs",true]';
  ```

- JSON 中允许的值  

  只允许有 字符串、数字、布尔、null、对象（不包括函数）、数组。
  ```js
  var obj1 = '["arr":[1,2,3]]';
  var obj2 = '[{"name":"zs","age":16},{"name":"zs","age":16}]';
  ```

- JSON 工具类  

  将 JSON 字符串转换为 JS 中的对象, JS 为我们提供了 SON 工具类, 该工具类可以使 JSON 和 JS 对象互相转换。
  ```js
  console.log(JSON);
  ```

- JSON 转化为 JS 对象  

  使用 `parse()` 方法, 它会将 
  JSON 字符串转为 JS 对象, 并返回 JS 对象。
  ```js
  var obj = '{"name":"zs","age":16}';
  var o = JSON.parse(obj);
  console.log(o.name);
  ```
  ```js
  var obj = '[1,2,3,true,"lm"]';
  var o = JSON.parse(obj);
  console.log(o[0]);
  ```

- JS 对象转换为 JSON  

  可以直接在 JS 对象的两边加上引号, 但是要确保属性名加上了双引号, 这种方式比较麻烦。我们可以直接使用 JSON 工具类提供的 `stringify()` 方法, 该方法会返回一个 JSON 字符串。
  ```js
  var obj = {name:"zs", age:20};
  var jsonString = JSON.stringify(obj);
  console.log(jsonString);
  ```

  :::details 注意
  IE7 及以下的浏览器不支持 JSON 对象。如果要兼容 IE7, 可以使用 `eval()` 函数, 该函数可以执行一段字符串形式的JS代码, 并将执行结果返回。  
  ```js
  eval("alert('hello world')"); // 会执行
  ```
  `eval()` 函数中的字符串如果有大括号, 它会将其当成一个代码块, 如果不希望这样解析, 那么我们可以在字符串的前后加上 `()`  

  ```js
  var obj3 = '{"name":"zs","age":16}';
  var o = eval("(" + obj3 + ")");
  ```
  `eval()` 这个函数的功能非常强大, 但是, 在开发中尽量不要使用。首先, 它的执行性能较差, 其次, 它具有安全隐患。

  如果我们非要兼容 IE7, 那么可以引入外部的 JS 文件来处理。引入 json2.js 即可, 其它的用法都一样。该文件的作用大概就是创建一个 JSON 对象。

  JSON 的更多用法请见 [w3cschool](https://www.w3school.com.cn/json/index.asp)。
  :::

## 分号问题
对于代码后面加不加分号的讨论, 网上有很多, 在正常情况下, 可加可不加, 比如, Vue 的源码中就没有分号; 但是以下几种情况必须加分号。 

- **小括号开头**  

  如果某条语句是 ( ) 开头, 则前面必须加分号
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

  中括号开头的前一条语句必须加分号
  ```js
  var b = 1;
  [1,3].foreach(function() {

  })
  ```

## 执行上下文

当 JS 代码被解析时, 会创建上下文, 首先就是创建 window 上下文, 如果有函数, 则当函数被调用时才产生上下文（没被调用的话就不会产生）。JS 通过栈来管理上下文, window 被存放在栈低。当函数被执行完成后, 其上下文就会出栈, 而 window 会一直在栈低。
```js
var a = 1;
function a() {
  b()
}
function b() {
    
}
a()
// 产生 3 个上下文, window, a, b（b 在 a 中被调用了）
```
```js
if (!(b in window)) {
  var b = 1;
}
console.log(b) // undefined, 因为 b 被提前, 所以 if 判断为 fasle
```
```js
var c = 1
function c(c) {
  console.log(c)
}
c(2) // 报错

// 实际的代码如下
var c
function c(c) {
  console.log(c)
}
c = 1
c(2) // c不 是函数, 当然会报错啦
```
## 闭包
学习闭包之前, 先来看一段代码。
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
上面的代码其实很简单, 就是为每一个按钮添加了一个单机事件。相应的按钮被点击时, 输出它的第几个按钮。改进如下: 
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
这就用到了闭包, 下面, 我们就来解释一下什么是闭包。
### 概述
什么是闭包？
- 理解一  

  闭包就是嵌套的内部函数

- 理解二  

  包含被引用变量（或函数）的对象  

但是, 无论怎么理解, 闭包就是存在于内部函数中（前提是必须调用外部函数）
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

### 原理
那么, 什么时候才会产生闭包呢？当一个嵌套的内部（子）函数使用了父函数的变量（或函数）, 内部函数有定义（或声明）, 且外部函数被执行时, 就产生了闭包。闭包中存放的是内部函数使用的变量（或函数）。
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
外部函数每被调用一次, 就产生一个闭包。外部函数被调用, 且内部函数有定义（声明）时, 闭包才产生。上述代码在 `var x = 2` 时就产生了闭包（因为函数声明会被提前）。
### 作用

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
上面的示例中是否有矛盾的地方呢, a 是局部变量, 当函数 f1 被执行完成后就应该消失, 但是为什么第二次的输出是 3, 这就是闭包的作用。闭包能延长局部变量的生命周期, 外部函数使用完后, 它的局部变量仍存在于内存中。闭包能使函数外部可以操作函数内部的变量（或函数）。
### 生命周期
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
  外部函数 f1 被调用时, 产生闭包（在 `var a = 1` 时就产生）, 当 `f=null` 时, 闭包被消除。

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
  外部函数 f1 被调用时, 产生闭包（在 `var f2 = function() {}` 被执行完成后才产生闭包, 因为此时才有内部函数的声明）, 当 `f=null` 时, 闭包被消除。

### 自定义 JS 模块
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
### 缺点
使用闭包可能会使变量一直占用内存, 从而造成内存泄露。因此, 能不使用闭包时, 就不使用; 或者及时释放内存。

### 示例
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

## JS 执行流程

JS 是单线程的, 先执行初始化代码, 然后再执行其它代码。
