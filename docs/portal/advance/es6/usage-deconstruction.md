# 解构赋值

ES6 允许我们从数组或对象中按照元素位置，对变量进行赋值。

## 数组解构

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

/* ------------------------------- */
const arr = [1,2,3,4,5]
// 取的就是前两个元素
const [e1, e2] = arr
console.log(e1, e2) // 1 2
```

## 对象解构  

```js
let obj = {name: 'hello', age: 20}
// 和顺序无关，它是按照名字来匹配的 
let {name, age} = obj
// 这里的 name 和 age 要与 obj 中的属性名保持一致 (位置无影响) 
console.log(name, age) 

/* ------------------------------- */
let obj = {name: 'hello', age: 30}
// 取别名
let {name: an, age} = obj
console.log(an, age)
```

## 函数参数解构

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
