# better-scroll
better-scroll 是一款重点解决移动端（已支持 PC）各种滚动场景需求的插件。它的核心是借鉴的 iscroll 的实现，它的 API 设计基本兼容 iscroll，在 iscroll 的基础上又扩展了一些 feature 以及做了一些性能优化。  

better-scroll 是基于原生 JS 实现的，不依赖任何框架。它编译后的代码大小是 63kb，压缩后是 35kb，gzip 后仅有 9kb，是一款非常轻量的 JS lib。

## 安装
由于之前使用 2.x-beta 时，出现了一些 bug，所以，这里安装 1.x 版本。  
```sh
npm install better-scroll --save
```
接下来就可以在代码中引入了，webpack 等构建工具都支持从 node_modules 里引入代码：
```js
import BScroll from 'better-scroll'
```
是 ES5 的语法如下：
```js
var BScroll = require('better-scroll')
```
## 使用
```vue
<template>
  <div class="wrapper" ref="wrapper">
    <ul class="content">
      <!-- li*100 -->
    </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      console.log(document.querySelector('.wrapper'))
      console.log(this.$refs.wrapper)
      this.scroll = new BScroll('.wrapper', {

      })
    }
  }
</script>

<style>
  .wrapper {
    height: 150px;
    background-color: #ff6600;
    overflow: hidden;
    /* overflow-y: scroll; */
  }
</style>
```
:::warning 注意
在 `new BScroll()` 的选择器中，它内部只能有一个子标签。
:::

其它的一些用法如下：  
```vue
<div class="wrapper">
  <ul class="content">
    <!-- li*100 -->
  </ul>
</div>
<script src="./bscroll.js"></script>
<script>
  const bs = new BScroll('.wrapper',{
    // probeType 用来指定是否实时监听滚动, 可选值如下
    // 0, 1 不开启监听（默认为 0）
    // 2 监听 (仅当手指触发的滚动才进行监听，由于惯性而造成的不会被监听)
    // 3 会监听由于惯性而造成的滚动
    probeType: 0,
    // 允许内部元素的点击事件
    click: true,
    // 上拉加载更多
    pullUpLoad: true
  })
  // 监听滚动事件
  // 第一个参数是 事件类型，如 click
  // 第二个参数是回调函数
  // bs.on('scroll', (pos) => {
  //   console.log(pos)
  // })

  // BScroll.prototype.finishPullUp = function () {
  //   console.log('上拉加载完成')
  // }
  bs.on('pullingUp', () => {
    console.log('上拉加载完成')
    // 进行网络请求

    // 必须调用此方法才能进行多次上拉加载
    bs.finishPullUp()
  })

  document.querySelector('.btn').onclick = function () {
    console.log('btn')
  }
</script>
```
:::warning 注意
在使用上拉加载之后，必须调用 `finishUpLoad()` 方法，这样才不会使上拉加载失效。
:::

:::tip 拓展
还有更多用法，如下拉刷新等，请见 better-scroll 官网。
:::


# 防抖 
在进行窗口的 resize、scroll，输入框内容校验等操作时，如果事件处理函数调用的频率无限制，会加重浏览器或服务器的负担，导致用户体验非常糟糕。此时我们可以采用 debounce（防抖）和 throttle（节流）的方式来减少调用频率，同时又不影响实际效果。

**函数防抖（debounce）**  

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。如下图，持续触发 scroll 事件时，并不执行 handle 函数，当 1000 毫秒内没有触发 scroll 事件时，才会延时触发 scroll 事件。最常见的就是搜索框的实时搜索。

```js
debounce(fun, delay) {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}
// let 的 timer 不会被销毁，因为在返回的函数中有它的引用（闭包的知识）
```
:::tip 提示
定时器中的事件永远是最后执行的，即使不设置延迟时间（事件循环）。
:::

## 计数器
```html
<div id="app1">
  <button @click="number--">减少</button>
  <!-- 上面这种写法也可以 -->
  <button @click="reduce">减少</button>
  <span>{{ number }}</span>
  <button @click="add">增加</button>
  <div>最少为0，最大为10</div>
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    number: 1
  },
  methods: {
    reduce: function () {
      if (this.number <= 0) {
        this.number = 0
      } else {
        this.number--
      }
    },
    add: function () {
      if (this.number >= 10) {
        this.number = 10
      } else {
        this.number++
      }
    }
  }
})
```
## 图片切换
```css
* {
  margin: 0;
  padding: 0;
}
#app {
  border: 2px solid #ff6600;
  overflow: hidden;
  width: 300px;
  margin: 100px auto 0;
  text-align: center;
}
#app img {
  display: inline-block;
  width: 300px;
  height: 300px;
  background-color: pink;
  vertical-align: top;
  object-fit: cover;
}
#app button {
  border: 2px solid #df88e3;
  outline: none;
  text-align: center;
  background: #fff;
  color: #e85;
  padding: 5px;
}
```
```vue
<template>
  <div id="app">
    <img :src="imgSrc[currIndex]" alt=""><br>
    <button v-show="currIndex > 0" @click="prevImg">上一张</button>
    <button v-show="currIndex < imgSrc.length - 1" @click="nextImg">下一张</button>
  </div>
</template>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    imgSrc: [
      './imgs/B1.jpg',
      './imgs/P22.jpg',
      './imgs/P30.jpg'
    ],
    currIndex: 0
  },
  methods: {
    prevImg: function() {
      if (this.currIndex <= 0) {
        this.currIndex = 0
      } else {
        this.currIndex--
      }
    },
    nextImg: function() {
      if (this.currIndex >= this.imgSrc.lenth - 1) {
        this.currIndex = this.imgSrc.lenth - 1
      } else {
        this.currIndex++
      }
    }
  }
})
```

## 记事本
```vue
<template>
  <div id="app">
    <h3>记事本</h3>
    <input type="text" class="edit" v-model="newThings" @keyup.enter="addThings" placeholder="请输入内容" />
    <ul>
      <li v-for="(item, index) in list">
        {{ index + 1 }}、{{ item }}
        <span @click="deleteThis(index)">&times;</span>
      </li>
    </ul>
    <div v-show="isShowBottom">
      <span>总共 {{ list.length }} 条</span>
      <a href="javascript:;" @click="clearList">清空</a>
    </div>
  </div>
</template>
```
```css
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
#app {
  width: 360px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  margin: 100px auto;
  box-shadow: 5px 5px 5px #ccc;
  color: rgb(153, 152, 152);
}
#app h3 {
  text-align: center;
  margin: 0 auto 20px;
}
#app input {
  outline: none;
  border: none;
  border-bottom: 2px solid #ccc;
  width: 100%;
  background: none;
  /* height: 40px; */
  font-size: 16px;
  padding: 5px 3px;
  color: rgb(153, 152, 152);
}
#app ul li {
  border-bottom: 1px solid #ccc;
  height: 36px;
  /* width: 100%; */
  padding: 0 5px;
  line-height: 36px;
  font-size: 16px;
  position: relative;
}
#app ul li:last-child {
  margin-bottom: 10px;
}
#app ul li span {
  display: none;
  position: absolute;
  right: 0;
  cursor: pointer;
}
#app ul li:hover span { 
  display: inline;
}
#app div {
  padding: 5px 0 0 3px;
  position: relative;
}
#app a {
  text-decoration: none;
  position: absolute;
  right: 0px;
  color: rgb(153, 152, 152);
}
```
```js
var app = new Vue({
  el: '#app',
  data: {
    list: [
      '吃饭',
      '学习',
      '跑步'
    ],
    isShowBottom: true,
    newThings: ''
  },
  methods: {
    clearList: function() {
      this.list.splice(0)
      this.isShowBottom = false
    },
    addThings: function() {
      if (this.newThings != '') {
        this.isShowBottom = true
        this.list.push(this.newThings)
        this.newThings = ''
      } else {
        console.log('输入无效')
      }
    },
    deleteThis: function(index){
      this.list.splice(index, 1)
      if (this.list.length === 0) {
        this.isShowBottom = false
      }
    }
  }
})
```
:::tip 提示
不知道你有没有发现，以上的所有操作过程都没有涉及 DOM，全都是在操作数据，这就是 Vue 的设计思想。
:::


# 购物车

```vue
<template>
  <div id="app">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>书籍名称</th>
          <th>出版日期</th>
          <th>价格</th>
          <th>购买数量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tr v-for="(ele, i) in books" :key="i" v-if="totalPrice > 0 && ele.num > 0" >
        <td>{{ i + 1 }}</td>
        <td>{{ ele.name }}</td>
        <td>{{ ele.date }}</td>
        <!-- 保留 2 为小数 -->
        <!-- <td>{{ ele.price.toFixed(2) }}</td> -->
        <!-- 使用 methods -->
        <!-- <td>{{ showPrice(ele.price) }}</td> -->
        <!-- 使用计算属性 -->
        <!-- <td>{{ cp(ele.price) }}</td> -->
        <!-- 使用过滤器 -->
        <td>{{ ele.price * ele.num | showPrice }}</td>
        <td>
          <button @click="decrease(i)" :disabled="ele.num <= 1">-</button>
          <span>{{ ele.num }}</span>
          <button @click="increase(i)">+</button>
        </td>
        <td><button @click="remove(i)">移除</button></td>
      </tr>
      <tr v-if="books.length === 0">
        <td colspan="6" align="center">购物车为空</td>
      </tr>
      <!-- 可以不写  > 0，当为 0 的时候就是 false -->
      <tfoot v-if="books.length">
        <tr>
          <td colspan="6" align="center">{{ totalPrice | showPrice }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
```

```css
body {
  margin: 0;
  padding: 0;
}
#app {
  width: 600px;
  margin: 50px auto 0;
}
#app table {
  width: inherit;
  font-family: verdana,arial,sans-serif;
  border-collapse: collapse;
  font-size: 14px;
}
#app table th {
  background: #000;
  font-size: 15px;
  color: #fff;
  font-weight: 100;
  text-align: left;
}
#app table td, #app table th {
  border: 1px solid #ccc;
  padding: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}
#app table tbody tr:nth-child(even) {
  background-color: #eee;
}
```
```js
const app = new Vue({
  el: '#app',
  data: {
    books: [
      { name:"Node.js权威指南", date:"2020-6", price:108.00, num:1 },
      { name:"深入浅出Node.js", date:"2020-6", price:98.00, num:1 },
      { name:"JavaScript高级程序设计（第3版）", date:"2015-9", price:66.30, num:1 },
      { name:"ES6标准入门（第3版）", date:"2013-2", price:78.00, num:1 },
      { name:"Java编程思想（第4版）", date:"2018-11", price:89.10, num:1 },
      { name:"Linux命令行与shell脚本编程大全", date:"2017-3", price:81.10, num:1 }
    ],
  },
  // 过滤器
  filters: {
    showPrice(price) {
      return '￥' + price.toFixed(2)
    }
  },
  computed: {
    cp() {
      return function(price) {
        return '￥' + price.toFixed(2)
      }
    },
    totalPrice() {
      // let price = 0
      // for(let i in this.books) {
      //     // i 是索引
      //     price += this.books[i].price * this.books[i].num
      // }
      // for (let book of this.books) {
      //     price += book.price * book.num
      // }
      
      // this.books.forEach(ele => {
      //     price += ele.price * ele.num
      // });
      // return price
      // 使用 reduce
      return this.books.reduce((total, ele) => total + ele.price * ele.num, 0)
    }
  },
  methods: {
    showPrice(price) {
      return '￥' + price.toFixed(2)
    },
    increase(index) {
      this.books[index].num++
    },
    decrease(index) {
      // 减到 0 直接删除该商品
      // let num = this.books[index].num--
      // if (num === 0) {
      //     this.books.splice(index, 1)
      // }
      this.books[index].num--
    },
    remove(index) {
      this.books.splice(index, 1)
    }
  }
})
```
:::tip 提示
`filters` 的使用请见 [过滤器](https://v2.cn.vuejs.org/v2/guide/filters.html)。
:::

# tabbar 封装
请见源代码。在封装过程中，用到了别名，在这里来记录一下。我使用的 cli3，所以以下配置是基于 cli3。由于 cli3 隐藏了 webpack 的配置文件，所以，我们需要在项目的根目录中新建一个配置文件，名为 `vue.config.js` （名字是固定的），在该文件中添加如下内容：
```js
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // 配置别名
        // 在 cli3 中，vue 已经配置了 src 的别名为 @
        // 所以，使用 @ 就相当于使用 src
        'assets': '@/assets',
        'components': '@/components',
        'views': '@/views'
      }
    }
  }
}
```
接下来就是使用别名：
```vue
<template>
  <tab-bar>
    <tab-bar-item path="/home" activeColor="#E1251B">
      <template v-slot:item-icon>
        <img src="~assets/img/tabbar/home.png" alt="">
      </template>
      <template v-slot:item-icon-active>
        <img src="~assets/img/tabbar/home-active.png" alt="">
      </template>
      <template v-slot:item-text>
        <div>首页</div>
      </template>
    </tab-bar-item>
    <tab-bar-item path="/category" activeColor="#E1251B">
      <template v-slot:item-icon>
        <img src="~assets/img/tabbar/category.png" alt="">
      </template>
      <template v-slot:item-icon-active>
        <img src="~assets/img/tabbar/category-active.png" alt="">
      </template>
      <template v-slot:item-text>
        <div>分类</div>
      </template>
    </tab-bar-item>
    <tab-bar-item path="/cart" activeColor="#E1251B">
      <template v-slot:item-icon>
        <img src="~assets/img/tabbar/cart.png" alt="">
      </template>
      <template v-slot:item-icon-active>
        <img src="~assets/img/tabbar/cart-active.png" alt="">
      </template>
      <template v-slot:item-text>
        <div>购物车</div>
      </template>
    </tab-bar-item>
    <tab-bar-item path="/profile" activeColor="#E1251B">
      <template v-slot:item-icon>
        <img src="~assets/img/tabbar/profile.png" alt="">
      </template>
      <template v-slot:item-icon-active>
        <img src="~assets/img/tabbar/profile-active.png" alt="">
      </template>
      <template v-slot:item-text>
        <div>我的</div>
      </template>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
  import TabBar from 'components/tabbar/TabBar'
  import TabBarItem from 'components/tabbar/TabBarItem'

  export default {
    components: {
      TabBar,
      TabBarItem
    }
  }
</script>
```
:::tip 注意
1. cli3 中已经自动给 `src` 取名为 `@`。
2. cli3 中可以在别名的配置中使用别名，cli2 中不可以。
3. 在 html 标签中若要使用别名，必须加上 `~`（cli3 中）。
:::

:::tip 提示
别名的配置还可以有以下几种方式： 
1. [https://juejin.im/post/5aca3ce7518825619d4d0db1](https://juejin.im/post/5aca3ce7518825619d4d0db1)
2. [https://segmentfault.com/a/1190000016135314](https://segmentfault.com/a/1190000016135314)
:::


