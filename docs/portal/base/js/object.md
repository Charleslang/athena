# 对象

JavaScript 中除了 String、Number、Boolean、null、Undefined 这五种基本类型之外，还有一种引用类型，即 Object。所以，只要一个数据不是以上五种基本数据类型，那么它就是 Object。

## 内置对象

任何 ES 的实现都可以使用 ES 提供的内置对象。

## 宿主对象

由浏览器提供的对象，如 DOM、BOM 等。

## 自定义对象

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
  // 此方式的属性名可以加引号，也可以不加，但是特殊的变量名必须加
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

  属性可以是函数，相当于在对象中创建了一个方法。

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
  console.log(obj.address); // undefined，不报错
  ```

- 删除属性

  ```js
  delete obj.name;
  ```

:::warning 警告
对象的属性名可以不遵循变量命名规范，也可以使用关键字。但是，不建议这样使用。
:::

:::tip 提示
`[]` 方式取值比 `.` 的方式更加强大，甚至可以传递变量，变量的值就是属性名。
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

  基本类型中，变量和它的值被存放到栈内存，而变量的值就是其本身的值；对于引用数据类型来讲，变量被存放到栈内存中，而其对象被存放到堆内存中，堆内存中的对象没有名字，只有地址，所以，栈中的变量所保存的值就是其内存地址。注意，只要 new 了，就会在内存中创建对象（且地址不同）。

- 对象比较  

  比较对象时，不仅会比较对象类型，还会比较对象的地址。

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
  // 函数中 a 是一个局部变量，实参为全部变量的a，实际是将全局的 a 的值给了局部变量的 a。


  // 综上: 函数传值时，传递的是变量的值。
  // 变量的值可以是一个地址，也可以是一个普通的值。
  ```

## 枚举对象中属性

当我们想知道一个对象中的全部属性时，可以使用枚举。

```js
for (var property in person) {
  console.log(property);
  // 取出每一个属性的值（此处只能使用 []）
  console.log(person[property]);
}
```

## 检查对象是否有某个属性或方法

- in  
  
  如果对象中没有，而原型中有，也会返回 true。

  ```js
  console.log(属性名 in 对象);
  ```

- hasOwnProperty  

  该方法不会检查原型中的属性，该方法存在于原型的原型对象中。

  ```js
  console.log(per1.hasOwnProperty('name'));
  ```

## 使用函数批量创建对象

如果我们要创建多个同类型的对象，可以使用函数（工厂）来批量创建。

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

## 构造函数创建对象 

通过以上方式创建的对象都是 Object，如果我们想要区分不同类型的对象（如 Person 和 Dog），可以使用如下方式。

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
  // per2 = Person();是调用函数，函数默认返回值是 undefined
  console.log(per1);// undefined
  ```

- **instanceof**  

  判断某个对象是否是类的实例。如果是，则返回 true；否则返回 false。所有对象都是 Object 的一个实例。

  ```js
  console.log(per instanceof Person); // true
  console.log(per instanceof Object); // true
  ```

  :::tip 说明
  `instanceof` 在判断时，使用了原型。如 `A instanceof B`，如果函数 B 的显示原型（prototype）在 A 的原型链上，则返回`true`，否则返回 `false`。
  :::

- **改进**  

  构造函数每执行一次，都会创建一个 method 方法。即所有对象的 method 都是唯一的。现在，把它提取出来，让对象共享它。

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

  虽然上面解决了共享问题，但是，函数被定义在了全局，污染了命名空间，而且也不安全。如果有一个函数也叫 method，那么可能会覆盖它。可以将共享的东西放入 **原型对象** 中。

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

## 原型对象

原型即 prototype，解析器会给 **每一个函数** 都添加一个 prototype 属性。该属性是一个 Object 类型，而且值是唯一的。如果函数是一个普通函数，那么 prototype 没有任何作用。如果函数被作为构造函数（即类），那么该类的所有对象都有一个隐藏的 prototype 属性（该类中也有，且指向同一个 prototype），且该类的所有对象的 prototype 指向都相同。通过对象的 `__proto__` 属性可以访问该属性（前后都是两个下划线）。也可以通过类的 `prototype` 属性访问。

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

  原型对象中也有 `__proto__` 属性。Object 没有原型（此处说法不严谨）。最多只有两层原型，即原型的原型的原型为 **null**。

- **对象属性或方法的访问**  

  当对象调用其属性或方法等时，会先从该对象的查找，如果有，则直接使用；如果没有，再从其原型对象中查找；如果原型对象中没有，则会在原型的原型中查找。如果我们并没有为某个对象添加某个方法，但是却可以直接调用某方法，那么，该方法很有可能存在其原型对象中。这就是原型链。

- **说明**  

  prototype 默认指向的是一个空对象，此处的空不能理解为 null，应该理解为空对象中没有我们定义的方法或属性，而有系统自带的。该对象中的 `constructor` 属性指向了该函数对象。所有函数都是 Function 的实例，包括 Function 本身。

  ```js
  function fun() {
      
  }
  console.log(fun.prototype.constructor === fun); // true
  ```

  ::: details 提示
  `prototype` 也叫显式原型，`__proto__` 也叫隐式原型。在函数被创建时，就将 prototype 属性赋值给了的函数对象；而`__proto__` 是在对象被实例化时，将 prototype 赋值给了 `__proto__`。  
  当我们访问某个属性时，如果没有，则会访问其原型；但是，如果我们修改实例的属性时，不会访问其原型的属性，如果该对象没有被修改的属性，则会在其属性中添加而不影响其原型的属性。
  ```js
  function Fn() {
      
  }
  Fn.prototype.a = 'xxx'
  var f1 = new Fn()
  console.log(f1.a) // xxx
  var f2 = new Fn()
  f2.a = 'yyy' // 会在 f2 中添加 a 属性，不影响原型中的 a
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

## 继承

- 方式一  

  通过原型链来实现继承：

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

  通过构造函数来实现继承（但是，本质上没有实现继承）：

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

  组合前面两种方式：

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

## toString()

该方法存在于对象的原型中，可重写。

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
使用 console.log 时，console.log 将文本值输出到控制台，它不会将对象强制为字符串，因此不会执行 toString 实现。  

您可以强制它输出如下字符串：

```js
console.log("" + obj);
```

或者调用 toString() 方法：

```js
console.log(obj.toString());
```
:::

## Date

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

  该方法表示时间戳，返回 1970 年 1 月 1 日至今的毫秒数。由于时间类型比较复杂，所以，我们在保存时间时，可以保存毫秒数；取出时间时，可以让该毫秒数加上 1970 年 1 月 1 日的毫秒数。计算机底层的时间就是这样实现的。

- **Date.now()**  

  获取当前的时间戳，当代码执行到此行时才会获取。该方法可以用来测试代码的性能。

  ```js
  var time = Date.now();
  console.log(time);
  ```

:::tip 提示
Date 的更多用法请见 [w3cschool](https://www.w3school.com.cn/jsref/jsref_obj_date.asp)
:::

## Math 工具类

它不是一个函数，而是一个工具类（即不同通过 new 来产生实例），它里面封装了数学运算相关的属性和方法。

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

  产生 [x, y] 的随机数：   

  ```js
  Math.round(Math.random() * (y - x)) + x
  ```

- max()  

  返回 x 和 y 中的最大值。

  ```js
  console.log(Math.max(1, 2, 3, 5, 8, 6, 6));
  ```

:::tip 说明
Math 的更多用法请见 [w3cschool](https://www.w3school.com.cn/jsref/jsref_obj_math.asp)
:::

## JSON

JSON（JavaScript Object Notation）即 JS对象表示法，它的格式和 JS 对象的格式类似，只不过 JSON 的属性名必须加**双引号**，其它用法和 JS 一致。  

JS 中的对象只有 JS 才能识别，其它语言不能识别；同样，JS 也不能识别其它语言的对象。为了让前后台有交互，需要使用任何语言都认识的对象。因此，有了 JSON。JSON 就是一个特殊格式的字符串，它能被所有语言识别并且可以转换为任何语言的对象。

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

  只允许有字符串、数字、布尔、null、对象（不包括函数）、数组。

  ```js
  var obj1 = '["arr":[1,2,3]]';
  var obj2 = '[{"name":"zs","age":16},{"name":"zs","age":16}]';
  ```

- JSON 工具类  

  将 JSON 字符串转换为 JS 中的对象，JS 为我们提供了 SON 工具类，该工具类可以使 JSON 和 JS 对象互相转换。

  ```js
  console.log(JSON);
  ```

- JSON 转化为 JS 对象  

  使用 `parse()` 方法，它会将 JSON 字符串转为 JS 对象，并返回 JS 对象。

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

  可以直接在 JS 对象的两边加上引号，但是要确保属性名加上了双引号，这种方式比较麻烦。我们可以直接使用 JSON 工具类提供的 `stringify()` 方法，该方法会返回一个 JSON 字符串。

  ```js
  var obj = {name:"zs", age:20};
  var jsonString = JSON.stringify(obj);
  console.log(jsonString);
  ```

  :::details 注意
  IE7 及以下的浏览器不支持 JSON 对象。如果要兼容 IE7，可以使用 `eval()` 函数，该函数可以执行一段字符串形式的 JS 代码，并将执行结果返回。  

  ```js
  eval("alert('hello world')"); // 会执行
  ```

  `eval()` 函数中的字符串如果有大括号，它会将其当成一个代码块。如果不希望这样解析，那么我们可以在字符串的前后加上 `()`。 

  ```js
  var obj3 = '{"name":"zs","age":16}';
  var o = eval("(" + obj3 + ")");
  ```

  `eval()` 这个函数的功能非常强大，但是，在开发中尽量不要使用。首先，它的执行性能较差；其次，它具有安全隐患。

  如果我们非要兼容 IE7，那么可以引入外部的 JS 文件来处理。引入 json2.js 即可，其它的用法都一样。该文件的作用大概就是创建一个 JSON 对象。

  JSON 的更多用法请见 [w3cschool](https://www.w3school.com.cn/json/index.asp)。
  :::
