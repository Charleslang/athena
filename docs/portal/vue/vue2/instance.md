# Vue 实例
每个 Vue 应用都是通过用 Vue 函数创建一个新的 **Vue 实例**开始的。  

虽然没有完全遵循 MVVM 模型，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 vm (ViewModel 的缩写) 这个变量名表示 Vue 实例。  

当创建一个 Vue 实例时，你可以传入一个**选项对象**。这篇教程主要描述的就是如何使用这些选项来创建你想要的行为。作为参考，你也可以在 [API 文档](https://v2.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E6%95%B0%E6%8D%AE) 中浏览完整的选项列表。

## el 挂载点

设置 Vue 实例的挂载点，该值是一个 CSS 选择器。只有在该挂载点内部的后代元素才能使用该 Vue 实例。el 中的选择器可以是任何 CSS 选择器，但是一般**推荐使用** id 选择器。el 不支持挂载自结束标签。el **不支持**选择 `<html>` 和 `<body>` 标签，如果选择了，则会报以下错误：

```txt
[Vue warn]: Do not mount Vue to <html> or <body> - mount to normal elements instead.
```
 
来看一下一些示例：
```html
{{ message }}
<div id="app" class="app">
  {{ message }}
  <span>{{ message }}</span>
</div>
```
```js
// el 只能支持双标签，不支持自结束标签
// el 不支持挂载在 html 和 body 标签上
var app1 = new Vue({
  el: '#app',
  // 等价写法如下
  // el: document.getElementById('app'),
  // el: '.app',
  // el: 'div',
  // el: 'div > span',
  // el: 'body',
  data: {
    message: 'Hello Vue!'
  }
})
```

## 插值
数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值, 它用来取出 Vue 实例中 data 里面的某个值，称为插值表达式，又叫 Mustache 语法。使用如下：
```html
<div id="app1">
  {{ message }}
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue.js'
  }
})
```
它支持使用运算符等操作：
```html
<div id="app1">
  {{ message + "这是拼接的字符串"}}
  <!-- 下面的会显示 false -->
  <p>{{ 2 > 3 }}</p>
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue.js'
  }
})
```
此表达式还可以调用方法：
```html
<!-- 注意，有括号 -->
<p>{{ name() }}</p>
```
```js
const app = new Vue({
  el: '#main',
  methods: {
    name: function(){
      return 'myname'
    }
  }
})
```

## data 数据对象
data 是一个数据对象，它里面封装了 Vue 实例需要使用的数据。  
```html
<div id="app1">
  <p>{{ message }}</p>
  <p>{{ obj.name }} -> {{ obj.age }} -> {{ obj.sex }}</p>
  <p>{{ arr[0] }} -> {{ arr[1] }} -> {{ arr[2].name }}</p>
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue.js!',
    obj: {name: '小王', age: 23, sex: '男'},
    arr: [1,2,{name: 'bla', sex: '女'}]
  }
})
```
可以通过 Vue 对象（实例），或者 `this` 关键字来访问或修改 date 对象中的某个属性：
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue.js!',
    obj: {name: '小王', age: 23, sex: '男'},
    arr: [1,2,{name: 'bla', sex: '女'}]
  }
})
// ----------------------------------
// this 就是该 Vue 对象，即 app1
app1.message = "123" 
this.message = "123456"
```
当然，data 的来源也可以是外部数据，如下：
```js
const data = {
  flag: false
}
const app = new Vue({
  el: '#main',
  data: data,
  methods: {
    show: function() {
      this.flag = true
    }
  }
})
```
