# 生成器
生成器（Generator）是 ES6 中引入的一种新的函数类型，它可以暂停和恢复执行。生成器函数使用 `function*` 关键字定义，调用时返回一个迭代器对象。它是一种异步编程的解决方案，是一种特殊的函数。基本用法如下：

```js
function * gen() {
  console.log('hello')
}
let iterator = gen()
// 执行函数
iterator.next()
```

它可以使用 `yield`，`yield` 就作为函数代码的分隔块。

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

当然，生成器函数也可以有参数：

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

生成器函数的一个重要应用是处理异步操作。通过 `yield` 可以暂停函数的执行，等待异步操作完成后再继续执行。如下：

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
