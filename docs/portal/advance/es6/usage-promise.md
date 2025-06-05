# Promise

`Promise` 是 ES6 中新增的一个对象，它用来表示一个异步操作的最终完成（或失败）及其结果值。它可以让我们更好地处理异步操作，避免回调地狱的问题。

**1. Promise 能做什么？**  

它是用来解决异步编程的一种方案。 

**2. 什么时候可以使用异步事件？**  

最常见的就是网络请求。  

**3. 为什么有了 Ajax 还需要使用 Promise？**  

因为在 Ajax 的回调函数中可能有存在其它的网络请求（即回调地狱），这时就可以使用 `Promise` 来优雅地解决这个问题。

## 基本用法

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

以上代码的等价形式如下：

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

在使用 Promise 时，需要创建一个实例（即 `new Promise()`）。在创建实例时，需要通过构造方法传递一个函数（函数的两个参数都是函数（参数可选）），且传入的函数会被立即执行，在异步操作需要使用回调的地方调用 `resolve()` 方法，然后在 `then()` 方法中执行回调方法的处理即可。**定时器本身就是异步事件**。

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
由于 `then` 和 `Promise.prototype.catch()` 方法都会返回 promise，所以它们可以被链式调用——这同时也是一种被称为复合（composition） 的操作。
:::

## 状态

- pending  

  等待状态，比如正在进行网络请求或定时器没到时间。

- fulfill  

  满足状态，当我们主动调用了 `resolve()` 时，就处于该状态，并且会回调 `then()`。

- reject  

  拒绝状态，当我们主动调用了 `reject()` 时，就处于该状态，并且会回调 `catch()`。

## 链式调用

其实在上面的例子中就已经使用了链式调用。

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

在上面的代码中，我们在某些 Promise 中没有进行异步操作，而只是单纯的处理数据而已，因此，我们可以直接使用 `Promise.resolve()`。修改如下：

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

## all()  

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

## any()

`Promise.any()` 方法接收一个可迭代对象（如数组），它会返回一个新的 Promise，该 Promise 在可迭代对象中的任意一个 Promise 成功时就会被解析，并返回第一个成功的结果。如果所有的 Promise 都失败，则返回一个 AggregateError 错误。

```js
Promise.any([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('第一个成功')
    }, 1000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('第二个失败')
    }, 2000)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('第三个成功')
    }, 3000)
  })
]).then(result => {
  console.log(result) // 第一个成功
}).catch(err => {
  console.error(err)
})
```
