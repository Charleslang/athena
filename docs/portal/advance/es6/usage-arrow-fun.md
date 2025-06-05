# 箭头函数

ES6 中可以使用箭头函数来简化函数的定义。需要注意的是，箭头函数中没有 `this`。

```js
let foo = () => {
  console.log('foo')
}
foo()
```

箭头函数中的 `this` 是函数在定义时，向外查找到的最近的 `this`。

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

```js
setTimeout(function () {
  console.log(this) // Window
}, 1000)
setTimeout(() => {
  console.log(this) // Window
}, 1000)

const obj = {
  data() {
    setTimeout(function () {
      console.log(this) // window
    }, 1000)
    setTimeout(() => {
      console.log(this) // data，即 obj 这个对象
    }, 1000)
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

```js
// 定义函数
const fun = (参数) => { }

// 只有一个参数时，小括号可省
const fun = x => { }

// 只有一条语句参数时，大括号可省，它会自动将语句执行并返回结果
const fun = x => console.log(x) // 返回值是 undefined
const fun = (x, y) => x + y // 返回 x + y

// 在将函数作为参数时，会大量使用箭头函数来进行简化
```

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

注意：

- 箭头函数中没有 `arguments`
- 箭头函数不能作为构造函数使用
