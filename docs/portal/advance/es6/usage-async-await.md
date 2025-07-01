# async-await

ES6 引入了 `async` 和 `await` 关键字，用于简化异步编程。它们使得异步代码的编写更像同步代码，提高了可读性和可维护性。

## async 

一种异步编程的解决方案，它可以让异步代码像同步代码一样。`async` 函数的返回值是一个 `Promise` 对象。

```js
async function foo() {
  console.log('123')
  // 相当于调用 resolve( 'success' )
  return 'success'
}
const result = foo()
console.log(result)
```

如果 `async` 的返回值不是一个 `Promise` 对象，那么它返回的 `Promise` 是成功状态的 `Promise`，`async` 函数的返回值会被放入 `resolve(data)` 中。

```js
async function foo() {
  console.log('123')
  // 返回失败的 Promise, 相当于调用 reject( 'fail' )
  throw new Error('fail') 
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

## await  

`await` 关键字只能在 `async` 函数中使，它会等待一个 `Promise` 对象的结果。使用 `await` 可以让异步代码看起来像同步代码一样，避免了回调地狱。

1. `await` 必须写在 `async` 函数中
2. `await` 右侧的表达式一般为 `Promise` 对象
3. `await` 返回的是成功状态的 `Promise` 的值
4. `await` 中的 `Promise` 如果失败，就会抛出异常，需要用 `try-catch` 捕获

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
