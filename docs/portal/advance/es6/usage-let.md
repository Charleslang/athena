# let

用来声明变量，主要用来替代 `var` 关键字。特点如下：

- `let` 声明的变量具有块级 (即 `{ }`) 作用域。在 ES5 中，只有全局和函数作用域。
- `let` 声明的变量不存在变量提升。
- `let` 可以防止循环变量变为全局变量。
- `let` 声明的变量具有暂时性死区。
- `let` 不能重复声明变量 (`var` 可以) 。

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
