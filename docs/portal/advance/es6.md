---
sidebar: ['/portal/advance/es6.html']
---

# ECMAScript6

## 简介
`ES6` 泛指 `ES 2015` (即 `ES6`) 及后续的版本。

## let

用来声明变量, 主要用来替代 `var` 关键字
- 使用 `let` 声明的变量具有块级 (即 `{ }`) 作用域  
在 `ES5` 中, 只有全局和函数作用域
- 使用 `let` 声明的变量不存在变量提升
- `let` 可以防止循环变量变为全局变量
- `let` 声明的变量具有暂时性死区
- `let` 不能重复声明变量 (`var` 可以) 

```js
if (true) {
  let a = 1
}
console.log(a) // a is not defined
if (true) {
  var a = 1
}
console.log(a) // 1

/* ---------------------------------- */
for (var i = 0; i < 3; i++) {
  
}
console.log(i) // 3
for (let i = 0; i < 3; i++) {
  
}
console.log(i) // 报错

/* ---------------------------------- */
console.log(n) // undefined
var n = 1

console.log(c) // 报错
let c = 1

/* ---------------------------------- */
let count = 1
if (true) {
    console.log(count) // 1
}
/* ---------------------------------- */
let count = 1
if (true) {
    console.log(count) // 报错
    let count = 6 
}
/* ---------------------------------- */
let count = 1
if (true) {
    console.log(count) // 1
    let a = 6 
}
```
```js
var arr = document.querySelectorAll('div')
for (var i = 0; i < arr.length; i++) {
  arr[i].onclick = function() {
    console.log(i) // 都是 arr.length
  }
}
for (let i = 0; i < arr.length; i++) {
  arr[i].onclick = function() {
    console.log(i) // 下标
  }
}
```
## const  

使用 `const` 来声明常量。  
- 对于普通类型的变量来讲, 声明时必须赋初值。  
```js
const a = 1;
const c; // 报错
```
- 对于对象类型 (对象、数组等) 来讲, 它们的地址是不可改变的。
```js
const c = { }
c.name = 'hello'; // 可以进行此操作
c = { } //非法操作 (c 的地址被修改) 
```
- `const` 声明的常量也具有块级作用域。
- `const` 声明的常量不存在变量提升。

## 解构赋值
`ES6` 允许我们从数组或对象中按照元素位置, 对变量进行赋值。
- 数组解构
```js
let arr = [1, 2, 3]
// let 后面的中括号不是数组, 它代表解构
let [a, b, c] = arr
console.log(a, b, c) // 1 2 3

/* ------------------------------- */
let arr = [1, 2]
// let 后面的中括号不是数组, 它代表解构
let [a, b, c] = arr
console.log(a, b, c) // 1 2 undefined
```
- 对象解构  
```js
let obj = {name: 'hello', age: 20}
let {name, age} = obj
// 这里的 name 和 age 要与 obj 中的属性名保持一致 (位置无影响) 
console.log(name, age) 
/* ------------------------------- */
let obj = {name: 'hello', age: 30}
// 取别名
let {name: an, age} = obj
console.log(an, age)
```
- 函数参数解构  
```js
let obj = {
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root'
}
function connect({host, port}) {
  console.log(host, port)
}
connect(obj)
```
## 对象简写
只针对同名的情况。
```js
let name = 'zxc'
function foo() {
  console.log('foo')
}
let obj = {name, foo}
obj.foo()
```
方法简写：
```js
let obj ={
  foo() {

  }
  // foo: function() {
  //  
  // }
}
```
## 箭头函数
`ES6` 中使用了箭头函数来简化函数的定义 (箭头函数中没有 `this`) 。
```js
let foo = () => {
  console.log('foo')
}
foo()
```
**箭头函数中的 `this` 是函数在定义时, 向外查找到了最近的 `this`**
```js
let a = {name: 'lo'}
function foo() {
  console.log(this.name)
}
foo.call(a) // lo
/* ------------------------------- */
let a = {name: 'lo', age: 1}
let bar = () => {
  console.log(this.age)
}
bar.call(a) // undefined
/* ------------------------------- */
let age = 1
let obj = {
  age: 100,
  say: () => {
    console.log(this.age)
  }
}
obj.say() // 1
```
- 箭头函数中没有 `arguments`
- 箭头函数不能作为构造函数使用

## 参数默认值
在函数的形参中, 允许我们使用默认值。
```js
function add(a, b, c=3) {
  //
}
```
有默认值的参数最好放在最后。  

它可以和解构赋值一起使用：
```js
let obj = {
  // host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root'
}
function connect({host='localhost', port}) {
  console.log(host, port)
}
connect(obj)
```

## 剩余参数
当实参个数大于形参的个数时, 我们可以将剩余参数放在一个数组里面。它可以用来代替 `arguments`。
- 剩余参数只能放在最后
```js
function foo (param, ...args) {
  console.log(param) // 1
  console.log(args) // [2,3]
}
foo(1, 2, 3)
```
- 剩余参数与解构配合使用
```js
let [a, ...b] = [1, 2, 3]
console.log(b) // [2,3]
```
## 扩展运算符 (展开语法) 
使用 `...` 来表示, 扩展运算符可以将数组或对象拆分成以逗号分隔的的参数序列。
```js
let arr = [1, 2, 3]
console.log(...arr)

// ...arr 就表示 1, 2, 3
// 所以console.log ( ) 中的代码就相当于下面的
// console.log ( 1, 2, 3 ) 
// 而这个逗号由恰好可以当成 console.log 的参数分隔符
```
- 合并数组 
```js
let arr1 = [1, 2, 3]
let arr2 = [5, 6, 7]
let mergeArr = [...arr1, ...arr2]
// push  可以接收多个参数
// arr1.push(...arr2)
console.log(mergeArr)
// console.log(arr1)
```
- 将类数组转换为真正的数组  
类数组不能使用数组的相关方法
```js
let nodeList = document.querySelectorAll('div')
console.log(nodeList, Array.isArray(nodeList))
console.log([...nodeList],Array.isArray([...nodeList]))
```
## Array 扩展
- **`Array.from(arrayLike, [function])`**  

将类数组转换为真正的数组, 它接收一个伪数组
```js
let nodeList = document.querySelectorAll('div')
console.log(Array.from(nodeList))
```
当然, 我们也可以传递一个函数, 对数组进行处理：
```js
let arrayLike = {
  "0":1,
  "1":2,
  "2":3,
  "length":3
}
let result = Array.from(arrayLike, e => e * 2)
console.log(result)
```
- **`find( )`**  

找出第一个符合条件的数组成员, 如果没有则返回 undefined 
```js
let arr = [1, 2, 3, 6, 7]
let result = arr.find((e, i) => e >= 6)
console.log(result)
```
- **`findIndex( )`**  

找出第一个符合条件的元素的下标, 否则返回 -1。
```js
let arr1 = ['a', 'b', 'c']
console.log(arr1.findIndex(e => e === 'b'))
```
- **`includes( )`**  

判断数组是否包含某个值, 返回值为 boolean。
```js
let arr = [1, 2, 3, 6, 7]
console.log(arr.includes(6))
```
### 数组实例扩展
- `flat( )`  
将数组进行降维 (二维降为一维、三维将为二维) 
```js
let arr1 = [
  [1, 2, 3],
  [5, 6, 7]
]
let arr2 = [
  [
    [1, 2, 3],
    [5, 6, 7]
  ]
]
console.log(arr1.flat())
console.log(arr2.flat())
console.log(arr2.flat(1)) // 降为 1 维
```
- `flatMap( )`  

相当于 `map( )` 和 `flat( )` 的结合。

```js
let result = [1, 2, 3].flatMap(e => [e ** 2])
console.log(result)
```
## 模板字符串
使用 `` 来定义字符串, 且字符串可以换行。
```js
let str = `
    hello,
    world
`
```
模板字符串中可以解析变量：
```js
let name = '张三'
let hello = `my name is ${name}`
// let hello = `my name is ` + name
console.log(hello)
```
模板字符串中可以调用函数 (使用函数的返回值) ：
```js
function say() {
  return 'hello'
}
console.log(`say ${say()}`)
```
## String 扩展
- `boolean startWith( )`
- `boolean endWith( )`
- `repeat( )`  

将原字符串重复 `n` 次, 返回一个新的字符串。
```js
let str = '哈哈'
console.log(str.repeat(3))
```
- `trimStart( )` 和 `trimEnd( )`

```js
let str = '   str   '
console.log(str.trimStart())
console.log(str.trimEnd())
```
- `padStart( )` 和 `padEnd( )`  

用于填充字符串, 使其达到目标长度 (如果不指定填充字符串, 则默认填充空格) 。

```js
// 通常用于处理时间, 在前面补零
// 在字符串 1 的前面用 0 填充, 使其长度达到 2 位
"1".padStart(2, 0); // "01"
// 在字符串 1 的后面用 0 填充, 使其长度达到 2 位
"1".padEnd(2, 0); // "10"

"".padStart(3, "ab") // aba
"1".padStart(2) // " 1"
```

## `Number` 扩展
- `Number.EPSILON`  

它是 js 中表示的最小精度, 通常用于浮点数之间的比较和计算。

```js
let a = 0.2, b = 0.1
// console.log(a+b === 0.3) // false
function c(x, y) {
  if(Math.abs(x - y) < Number.EPSILON) {
    return true
  }
  return false
}
console.log(c(0.1 + 0.2, 0.3))
```
- 进制表示  
```js
let a = 0b101
let b = 0o123
let c = 0xff
```
- `Number.isFinite`  

判断一个数是否是有限小数。

```js
console.log(Number.isFinite(100/0))
```
- `Number.isNaN`  

判断是否是 `NaN`, 如果是, 则返回 `true`

```js
console.log(isNaN(NaN))
console.log(Number.isNaN(NaN))
```
- `Number.parseInt` 和 `Number.parseFloat`
- `Number.isInteger`
- `Math.trunc`  

去掉小数部分

```js
console.log(Math.trunc(3.11))
```
- `Math.sign`  

判断一个数是正数、负数还是 `0`, 分别返回 `1`、`-1`、`0`。

```js
console.log(Math.sign(1))
console.log(Math.sign(0))
console.log(Math.sign(-9))
```
## Object 扩展

- `Object.is`  

判断两个值是否完全相等, 类似 `===`, 但又有差别。

```js
console.log(Object.is(1, 1))
console.log(Object.is(1, 2))
console.log(Object.is(NaN, NaN))
console.log(NaN === NaN)
```
- `Object.assign`   

合并对象

```js
let obj1 = {
  name: '1'
}
let obj2 = {
  name: '2',
  age: 10
}
console.log(Object.assign(obj1, obj2))
```
- `Object.keys`  

获取对象的所有 `key`, 返回一个数组

```js
let obj = {
  name: 'zs',
  age: 20,
  foo() {

  }
}
console.log(Object.keys(obj))
```

- `Object.values`  

获取对象的所有 `value`, 返回一个数组

```js
let obj = {
  name: 'zs',
  age: 20,
  foo() {

  }
}
console.log(Object.keys(obj))
console.log(Object.values(obj))
```

- `Object.entries`  

获取对象的 `key-value`, 将其每一个封装为数组 (`[key, value]`) , 并返回一个数组 (`[[key1, value1],[key2, value2]]`) 

```js
let obj = {
  name: 'zs',
  age: 20,
  foo() {

  }
}
console.log(Object.entries(obj))
```
- 对象转化为 Map  

```js
let obj = {
  name: 'zs',
  age: 20,
  foo() {

  }
}
console.log(new Map(Object.entries(obj)))
```
- `Object.fromEntries`  

将二维数组转化为对象, 或将 `Map` 转为对象

```js
// {1: 2, 5: 6}
console.log(Object.fromEntries([[1,2],[5,6]]))
// {key: "value"}
console.log(Object.fromEntries(new Map().set('key', 'value')))
```
## 迭代器
任何数据结构, 只要部署 `iterator` 接口, 就可以完成遍历操作。
迭代器主要用于 `for ... of` 循环。`Array`、`arguments`、`Set`、`Map`、`String`、`TypedArray`、`NodeList` 都部署了该接口。

工作原理：
1. 创建一个指针对象, 指向当前数据结构的起始位置
2. 第一次调用对象的 `next( )` 方法, 指针自动指向数据结构的第一个成员
3. 接下来不断调用 `next( )` 方法, 指针一直往后移动, 直到最后一个成员
4. 每次调用 `next( )` 方法, 都会返回一个含有 `value` 和 `done` 属性的对象

```js
let arr = [1, 2, 3, 5, 6]
let iterator = arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

/* -------------------结果如下---------------- */
{value: 1, done: false}
{value: 2, done: false}
{value: 3, done: false}
{value: 5, done: false}
{value: 6, done: false}
{value: undefined, done: true}
{value: undefined, done: true}
```

自定义迭代器：
```js
let obj = {
  name: 'name',
  role: [
    '焰灵姬',
    '晓梦',
    '田密'
  ],
  [Symbol.iterator]() {
    let index = 0
    let that = this
    return {
      next: function () {
        if (index < that.role.length) {
          const result = {value: that.role[index], done: false}
          index++
          return result
        } else {
          return {value: undefined, done: true}
        }
      }
    }
  }
}
for (let e of obj) {
  console.log(e)
}
```
## 生成器
它是一种异步编程的解决方案, 是一种特殊的函数。  
基本使用如下：
```js
function * gen() {
  console.log('hello')
}
let iterator = gen()
// 执行函数
iterator.next()
```
它可以使用 `yield` , `yield` 就作为函数代码的分隔块。
```js
function * gen() {
  console.log('123') // 代码块 1
  yield 'yield1'
  console.log('哈哈') // 代码块 2
  yield 'yield2'
  console.log('最后了') // 代码块 3
}
let iterator = gen()
// 上面有三个代码块, 所以需要调用三次
iterator.next()
iterator.next()
iterator.next()
// next 的返回值就是 yield 的文字说明
```
生成器传参：
```js
// next ( ) 中的参数会作为上一次 yield 的返回结果
function * gen(arg) {
  console.log(arg)
  let one = yield 1
  console.log(one)
  let two = yield 2
  console.log(two)
  let three = yield 3
  console.log(three)
}
let iterator = gen('a')
iterator.next()
iterator.next('two')
iterator.next('three')
```

```js
function one() {
  setTimeout(()=>{
    console.log(1)
    iterator.next()
  }, 1000)
}
function two() {
  setTimeout(()=>{
    console.log(1)
    iterator.next()
  }, 1000)
}
function three() {
  setTimeout(()=>{
    console.log(1)
    iterator.next()
  }, 1000)
}
function * gen() {
  yield one()
  yield two()
  yield three()
}
let iterator = gen()
iterator.next()
```
异步请求实例：
```js
function getUser() {
  setTimeout(() => {
    let data = '用户数据'
    iterator.next(data)
  }, 1000)
}
function getGoods() {
  setTimeout(() => {
    let data = '商品数据'
    iterator.next(data)
  }, 1000)
}
function getOrder() {
  setTimeout(() => {
    let data = '订单数据'
    iterator.next(data)
  }, 1000)
}
function * gen() {
  let user = yield getUser()
  console.log(user)
  let goods = yield getGoods()
  console.log(goods)
  let order = yield getOrder()
  console.log(order)
}
let iterator = gen()
iterator.next()
```
## Set
`ES6` 提供了 `Set`, 它类似于数组, 但是它的元素是不重复的。
```js
let set = new Set()
set.add(1).add(2).add(3).add(1)
console.log(set)
```
在创建 `set` 时, 可以传递一个数组 (数组会被去重) 。
```js
let set = new Set([1, 2, 3, 1])
console.log(set)
```
给数组去重：
```js
let arr = [...new Set([1, 2, 3, 1])]
console.log(arr)
```
常用方法：  

- `add( )`  

添加元素, 返回 `Set` 本身 (可链式调用) 。

- `delete( )`  

删除某个元素, 返回 `boolean`。

- `has( )`  

是否存在某个元素, 返回 `boolean`。

- `clear( )`  

清空所有元素, 无返回值。

- `size( )`  

返回元素个数。

- `forEach( )`  

遍历集合, 无返回值。

实践：  

- 求交集  

```js
let arr1 = [1,2,3,5,3,2,6]
let arr2 = [1,2,8,9,6,8]
// let result = [...new Set(arr1)].filter(ele => [...new Set(arr2)].includes(ele))
let result = [...new Set(arr1)].filter(ele => newSet(arr2).has(ele))
console.log(result)
```

- 求并集

```js
let arr1 = [1,2,3,5,3,2,6]
let arr2 = [1,2,8,9,6,8]
let result = new Set([...arr1, ...arr2])
console.log(result)
```
- 求差集  

```js
let arr1 = [1,2,3,5,3,2,6]
let arr2 = [1,2,8,9,6,8]
// arr1 - arr2
let result = [...new Set(arr1)].filter(e => !(new Set(arr2).has(e)))
console.log(result)
```
## Map  
`Map` 类似于对象, 它也是键值对集合, 但是它的键可以是任意类型。`Map` 常用方法如下:  

- `size( )` 

返回元素个数  

- `set( )`  

添加新的元素, 并返回当前 Map, 因此可链式调用  

- `get( )`  

通过 `key` 获取 `value`

- `has( )`  

是否含有某个元素, 返回 `boolean`  

- `clear( )`  

清空元素, 返回 `undefined`

```js
let map = new Map()
map.set('name', 'zs').set('age', 13).set({name:'obj'}, [1,2])
console.log(map)

let name = map.get('name')
console.log(name)
```
## class 类  
通过 `class` 关键字来定义类。
```js
// ES5 语法
function Phone(name, price) {
  this.name = name
  this.price = price
}
Phone.prototype.call = function () {
  console.log('打电话')
}
let xiaomi = new Phone('小米', 1999)
xiaomi.call()
console.log(xiaomi)

// ES6 
class Phone {
  // constructor 的方法名是固定的, 当构造实例时, 会自动调用此方法
  constructor(name, price) {
    this.name = name
    this.price = price
  }
  // 只能通过这种方式来定义方法, 不能使用 function
  call() {
    console.log('打电话啦')
  }
}
let xiaomi = new Phone('小米', 1999)
xiaomi.call()
console.log(xiaomi)
```
### 静态成员  
在 js 中, 静态成员 (包括方法) 只允许类访问, 不能通过实例对象来访问。这与原型上的属性或方法不同。
```js
// ES5
function Phone() {
}
Phone.name = 'pname'
Phone.size = 'psize'

let xiaomi = new Phone()
console.log(xiaomi.name) // undefined

// ES6
class Phone {
  static name = '手机'
  static change() {
    console.log('change')
  }
}
let xiaomi = new Phone()
console.log(xiaomi.name) //undefined
```
### 继承
- ES5 语法  
```js
function Phone(name, price) {
  this.name = name
  this.price = price
}
Phone.prototype.call = function() {
  console.log('打电话')
}
function SmartPhone(name, price, color) {
  Phone.call(this, name, price)
  this.color = color
}
SmartPhone.prototype = new Phone
SmartPhone.prototype.constructor = SmartPhone

let xiaomi = new SmartPhone('xiaomi', 1999, 'black')
console.log(xiaomi)
```
- ES6 语法  
```js
class Phone {
  constructor(name, price) {
    this.name = name
    this.price = price
  }
  call() {
    console.log('superCall')
  }
}
class SmartPhone extends Phone {
  constructor(name, price, color) {
    super(name, price)
    this.color = color
  }
  // 重写
  call() {
    super.call()
    console.log('subCall')
  }
}
let xiaomi = new SmartPhone('xiaomi', 1999, 'black')
xiaomi.call()
console.log(xiaomi)
```
### getter / setter
只要访问成员属性, 就会自动调用该属性的 get 方法。get 方法的返回值就是属性值。
```js
class Phone {
  get price() {
    console.log('get price')
    return 'price1'
  }
  set price(newVaule) {
    console.log('set price')
  }
}
let xiaomi = new Phone()
xiaomi.price = 'aaaaaaa'
console.log(xiaomi.price)
```
## ES6 模块化
模块化的好处： 
1. 防止命名冲突
2. 代码复用
3. 高维护性

- 分别暴露
```js
// a.js
export let phone = 'xiaomi'

export function foo() {
  console.log('123')
}
```
```html
<script type="module">
  import * as ma from './a.js'

  ma.foo()
  console.log(ma.phone)
</script>
```
> 注意：VS Code 要在 live serve 下运行。

- 统一暴露  
```js
let phone = 'xiaomi'

function foo() {
  console.log('123')
}

export {phone, foo}
```
- 默认暴露  
一个文件中只能有一个 默认暴露  
```js
export default {
  name: '123',
  foo() {
    console.log('hello')
  }
}
```
- 解构赋值  
```js
import { foo, bar } from 'xxx'
import { foo as foo1, bar } from 'xxx'

// 针对默认导出
import { default as a} from './a.js'
```
> **注意**  
> 并不是所有浏览器都支持 ES6, 所以通常要用 babel 将其转换为 ES5

### babel
本地安装babel-preset-es2015 和 babel-cli
```
npm install --save-dev babel-cli babel-preset-es2015
```
根目录新建 .babelrc 文件, 输入以下：
```
{
  "presets":[
    "es2015"
  ],
  "plugins":[]
}
```
:::tip 提示
转换请见：[https://www.jianshu.com/p/701a48c81371](https://www.jianshu.com/p/701a48c81371)

但是在转了之后, 浏览器还是无法识别, 因为有 CommonJS, 所以还需要下载 browserify。
:::

## 指数表示  
用来表示指数。  
```js
console.log(2 ** 3)
console.log(Math.pow(2, 3))
```
## async-await
### async 函数
一种异步编程的解决方案, 它可以让异步代码像同步代码一样。  
`async` 函数的返回值是一个 `Promise` 对象。
```js
async function foo() {
  console.log('123')
  return 'success' // 相当于调用 resolve( 'success' )
}
const result = foo()
console.log(result)
```
如果 `async` 的返回值不是一个 `Promise` 对象, 那么它返回的 `Promise` 是成功状态的 `Promise`, `async` 函数的返回值会被放入 `resolve(data)` 中。
```js
async function foo() {
  console.log('123')
  throw new Error('fail') // 返回失败的 Promise, 详单与调用 reject( 'fail' )
}
const result = foo()
console.log(result)
```
返回值为 `Promise`：
```js
async function foo() {
  console.log('123')
  return new Promise((resolve, reject) => {
    resolve('成功')
  })
}
const result = foo()
console.log(result)
```
### await  
1. `await` 必须写在 `async` 函数中
2. `await` 右侧的表达式一般为 `Promise` 对象
3. `await` 返回的是成功状态的 `Promise` 的值
4. `await` 中的 `Promise` 如果失败, 就会抛出异常, 需要用 `try-catch` 捕获

```js
const p = new Promise((resolve, reject) => {
  resolve('success')
})
async function foo() {
  let result = await p
  console.log(result) // success
}
foo()
```
```js
const p = new Promise((resolve, reject) => {
  reject('失败')
})
async function foo() {
  try {
    let result = await p
  } catch (e) {
    console.log(e) // 失败
  }
}
foo()
```
## 私有属性  
对象中的私有属性使用 `#` 表示, 它不能被外部直接访问。
```js
class Person {
  #age;
  name;
  constructor(age ,name) {
    this.#age = age
    this.name = name
  }
}
let person = new Person(10, 'zs')
console.log(person)
console.log(person.#age) // 报错
```
## 可选链操作符
使用 `?.` 来表示, 类似 `thymeleaf` 中的。
```js
function foo(options) {
  console.log(options?.db?.port)
}
foo({
  db: {
    port: 3306
  }
})
```
## BigInt 类型
用来表示更大数值的**整型**。
```js
let a = 1n
console.log(typeof a)
console.log(BigInt(123))
```
## globalThis
它始终指向全局的 `this`, 即 `window`。
```js
console.log(globalThis)
```

## 函数和字符串

- 函数的简化 
  
  ```js
  const app = new Vue({
    el: '#app',
    methods: {
      // 以下几种函数的定义是等价的
      add() {
          
      },
      reduce: function() {
          
      },
      query: () => {}
    }
  })
  ```
- 模板字符串

  在 ES5 中，字符串使用单引号或双引号；ES6 中可以使用 ` `` `（即 Esc 下面的键），这样的好处是可以换行。
  ```js
  // ES5, 引号
  var str = '123' + 
    '456'
  // ES6
  let str = `你
    好`
  ```
  - 字面量增强写法  
  ```js
  var name = 'zs', age = 30
  // ES5
  var obj = {
    name: name,
    age: age
  }
  // ES6
  // 自动将变量名作为 key, 将变量的值作为 value
  var obj = {
    name,
    age
  }
  ```

- 箭头函数  

  ```js
  // 定义函数
  const fun = (参数) => { }

  // 只有UI个参数时，小括号可省
  const fun = x => { }

  // 只有一条语句参数时，大括号可省，它会自动将语句执行并返回结果
  const fun = x => console.log(x) // 返回值是 undefined
  const fun = (x, y) => x + y // 返回 x + y

  // 在将函数作为参数时，会大量使用箭头函数来进行简化
  ```

- 箭头函数中的 this  

  ```js
  setTimeout(function () {
    console.log(this) // Window
  },1000)
  setTimeout(() => {
    console.log(this) // Window
  },1000)

  const obj = {
    data() {
      setTimeout(function () {
        console.log(this) // window
      },1000)
      setTimeout(() => {
        console.log(this) // data，即 obj 这个对象
      },1000)
    }
  }
  obj.data()

  // 结论如下
  // 箭头函数中的 this 会往外查找，直到找到最近的有 hits 的定义为止，这时箭头函数的 this 就指向这个最近的 this。

  const obj = {
    data() {
      setTimeout(function () {
        setTimeout(function() {
          console.log(this) // Window
        }, 1000)
        setTimeout(() => {
          console.log(this) // Window
        }, 1000)
      },1000)
      setTimeout(() => {
        setTimeout(function() {
          console.log(this) // Window
        }, 1000)
        setTimeout(() => {
          console.log(this) // obj
        }, 1000)
      },1000)
    }
  }
  obj.data()
  ```

## Promise
**1. Promise 能做什么？**  

它是用来解决异步编程的一种方案。 

**2. 什么时候可以使用异步事件？**  

最常见的就是网络请求。  

**3. 为什么有了 Ajax 还需要使用 Promise？**  

因为在 Ajax 的回调函数中可能有存在其它的网络请求（即回调地狱），这时就可以使用 `Promise` 来优雅地解决这个问题。

### 基本用法
先来看一个简单的示例：
```js
// resolve 和 reject 是函数
new Promise((resolve, reject) => {
  // 第一次网络请求
  setTimeout(() =>{
    resolve()
  },1000)
}).then(() => {
  // 第一次网络请求之后的处理
  console.log('hello')

  // 第二次网络请求
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}).then(() => {
  // 第二次网络请求之后的处理
  console.log('hello1')

  // 第三次网络请求
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}).then(() => {
  // 第三次网络请求之后的处理
  console.log('world')
})
```
以上代码的等价形式为：
```js
setTimeout(() => {
  console.log('hello1')
  setTimeout(() => {
    console.log('hello2')
    setTimeout(() => {
      console.log('hello3')
    }, 1000)
  }, 1000)
}, 1000)
```
在使用 Promise 时，需要创建一个实例（即 `new Promise()`），在创建实例时，需要通过构造方法传递一个函数（函数的两个参数都是函数（参数可选）），且传入的函数会被立即执行，在一步操作需要使用回调的地方调用 `resolve()` 方法，然后在 `then()` 方法中执行回调方法的处理即可。**定时器本身就是异步事件**。

接下来模拟一个异步回调传参的情况：
```js
// 以下是伪代码
new Promise((resolve, reject) => {
  $.ajax({
    url: ,
    // 执行成功回调，并得到后台的响应数据 data
    success: (data) => {
      resolve(data)
    },
    error: (err) => {}
  })
}).then(/* 此 data 就是 ajax 成功时回调函数传入的数据 */ (data) => {})

/* -------------------------------------- */

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('hello promise')
  }, 1000)
}).then((data) => {
  console.log(data) // hello promise
})
```
上面我们只使用了 `resolve()` 函数，接下来介绍一下 `reject` 的使用。其实，我们可以简单理解为 `resolve()` 用来处理请求成功，`reject()` 用来处理请求失败的情况，而且请求失败时是通过 `catch` 来进行回调的处理（也可使用 `then` 的第二个参数）。
```js
new Promise((resolve, reject) => {
  $.ajax({
    url: '',
    success: (data) => { resolve(data) },
    error: (err) => { reject(err) }
  })
}).then((data) => {
  // 请求成功
}).catch(err => {
  // 请求失败
})

/* -------------------------------- */

new Promise((resolve, reject) => {
  $.ajax({
    url: '',
    success: (data) => { resolve(data) },
    error: (err) => { reject(err) }
  })
}).then((data) => {
  // 请求成功
}, err => {
  // 请求失败
  console.error(err)
})

/* -------------------------------- */
new Promise((resolve, reject) => {
  reject('error')
}).then(success => {

}, err => {
  console.error(err)
})
```
:::tip 提示
由于 `then` 和 `Promise.prototype.catch()` 方法都会返回 promise，它们可以被链式调用——这同时也是一种被称为复合（ composition） 的操作。
:::

### Promise 三种状态
- pending  

  等待状态，比如正在进行网络请求或定时器没到时间。

- fulfill  

  满足状态，当我们主动调用了 `resolve()` 时，就处于该状态，并且会回调 `then()`。

- reject  

  拒绝状态，当我们主动调用了 `reject()` 时，就处于该状态，并且会回调 `catch()`。

### Promise 链式调用
其实在上面的初始实例中就已经使用了链式调用。
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  new Promise(resolve => {
    resolve(data + '123')
  })
}).then(data => {
  console.log(data, '第二次处理')
})
```
在上面的代码中，我们在某些 Promise 中没有进行一步操作，而只是单纯的处理数据而已，因此，我们可以直接使用 `Promise.resolve()`。修改如下：
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  return Promise.resolve(data + '123')
}).then(data => {
  console.log(data, '第二次处理')
})
```
但是，我们还可以把上面的代码再次进行优化，省略 `Promise.resolve(data + '123')`，直接 return：
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  return data + '1233'
}).then(data => {
  console.log(data, '第二次处理')
})
```
但是如果上面的代码执行过程中发生错误呢，这时，我们可以使用 `catch()`：
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  return new Promise((resolve, reject) => {
      reject('错误')
  })
}).then(data => {
  console.log(data, '第二次处理')
}).catch(err => {
    console.error(err)
})
```
简写如下：
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  return Promise.reject('error!!')
}).then(data => {
  console.log(data, '第二次处理')
}).catch(err => {
  console.error(err)
})

/* ---------------- 使用 throw 抛出异常 --------------- */
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('aaa')
  }, 1000)
}).then(data => {
  console.log(data, '第一次处理aaa')

  throw 'the exception is found'
}).then(data => {
  console.log(data, '第二次处理')
}).catch(err => {
  console.error(err)
})
```
### Promise 补充  
在某种情况下，我们可能同时发出多个请求，而且需要等到这些请求全部成功后才能进行某种处理。普通的写法如下：
```js
let isResult1 = false
let isResult2 = false

$.ajax({
  url: '',
  success: function(data) {
    isResult1 = true
    handlerResult()
  }
})
$.ajax({
  url: '',
  success: function(data) {
    isResult2 = true
    handlerResult()
  }
})

function handlerResult() {
  if (isResult1 && isResult2) {
    // ...
  }
}
```
我们可以使用 Promise 提供的 `all()` 方法，该方法传入一个可迭代对象（即数组等可以循环的对象），它会自动监听请求状态：
```js
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({name: 'kk', age: 12})
    }, 1000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('xxx')
    }, 3000)
  })
]).then(results => {
  // 数组
  console.log(results)
})
```
## 解构
在函数或变量赋值中，如果我们想要传递一个对象作为参数，我们同常是这样写的：
```js
function foo(obj) {
  console.log(obj.xxx)
}
```
我们需要自己去调用对象的属性和方法等，而且有时候我们只想使用对象中的部分属性和方法，这时，我们就没有必要传入整个对象，这就是 ES6 中提出的对象解构。  
```js
/* ------------------- 对象解构 ------------------ */
const obj = {
  name: 'abc',
  age: 18,
  height: 1.88,
  hobbies: ['lanqiu', 'zuqiu']
}

// 和顺序没有影响，它是按照名字来匹配的 
const { height, name, age } = obj

console.log(name, age, height)

/* ------------------- 数组解构（不推荐） ------------------ */
const arr = [1,2,3,4,5]
// 取的就是前两个元素
const [e1, e2] = arr
console.log(e1, e2) // 1 2
```

## 易错
- 对象中没有 `this`。
- `setTimeout` 是异步操作, 回调函数由 `window` 调用。
