# 监听数据变化

## watch 

- **类型**

  `{ [key: string]: string | Function | Object | Array }`

- **详细** 

  一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 `$watch()`，遍历 `watch` 对象的每一个 property。

**示例如下：**

```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 该回调会在任何被侦听的对象的 property 改变时被调用，不论其被嵌套多深
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: 'someMethod',
      immediate: true
    },
    // 你可以传入回调数组，它们会被逐一调用
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```
:::warning 注意
**不应该使用箭头函数来定义 watcher 函数**（例如 `searchQuery: newValue => this.updateAutocomplete(newValue))`）。理由是箭头函数绑定了父级作用域的上下文，所以 `this` 将不会按照期望指向 Vue 实例，`this.updateAutocomplete` 将是  `undefined`。
:::

## 计算属性 computed
当我们想要对数据进行某种操作时，可以使用此属性。该属性中可以存放方法，并且方法返回的是一个计算结果，所以，方法名尽量按照属性名的方式命名。该方法本质是一个属性，所以可以当成属性来使用。
```html
<div id="app">
  <!-- 注意与方法(methods)的区别 -->
  <p>{{ doubleLevel }}</p>
</div>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    level: 3
  },
  computed: {
    doubleLevel: function(){
      return this.level * 2
    }
  }
})
/*--------------------------------------*/
const app = new Vue({
  el: '#app',
  data: {
      level: 3,
      books: [
        { id: 1, name: 'Java编程基础', price: 36 },
        { id: 2, name: '数据库原理', price: 32 },
        { id: 3, name: 'JavaEE 轻量级架构', price: 50 },
      ]
  },
  computed: {
    doubleLevel: function(){
      let totalPrice = 0
      for(let i = 0; i < this.books.length; i++){
        totalPrice += this.books[i].price
      }
      return totalPrice
      /*--- 等价写法如下（scala） ---*/
      return this.books.reduce((total, ele) => total + ele.price, 0)
    }
  }
})
```
`computed` 和 `methods` 最大的区别就是，`computed` 有缓存（即当数据未被改变时只会被调用一次），而` methods` 执行多少次就会被调用多少次。

### set 和 get

通过 `set` 方法可以为计算属性设置值，通过 `get` 方法来取值。这种写法才是计算属性的完整写法，但是，一般都简化为上面的写法，即只保留 `get` 方法。
```html
<!-- 不需要自己调用 get -->
<p>{{ knum }}</p>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num: 6
  },
  computed: {
    // knum 只是一个属性
    knum: {
      // 一般不设置计算属性的 set 方法
      set: function(v) {
        this.num += v
      },
      get: function() {
        return this.num
      }
    }
  }
})
```
### computed 传参
计算属性不能直接传参，需要通过闭包来实现函数传参。这种方式依然可以使用缓存，但是不建议这样使用，可以使用方法来代替。参考 [vue计算属性可以传参吗](https://segmentfault.com/q/1010000007473708)

```html
<td>{{ cp(9) }}</td>vue计算属性可以传参吗
```
```js
computed: {
  cp() {
    // 测试缓存
    console.log('d1')
    return function(p){
      return this.gnum + '元'
    }
  }
},
```
