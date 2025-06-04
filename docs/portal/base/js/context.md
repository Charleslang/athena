# 执行上下文

当 JS 代码被解析时，会创建上下文。首先是创建 window 上下文，如果有函数，则当函数被调用时才产生上下文（没被调用的话就不会产生）。JS 通过栈来管理上下文，window 对象被存放在栈底。当函数被执行完成后，其上下文就会出栈，而 window 会一直在栈底。

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
