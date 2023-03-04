# 起步

先来看一个最简单的 Vue 案例。

首先，引入 Vue：
```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.s"></script>
```

然后编写第一个 Vue 程序：
```html
<!-- Vue入门 声明式渲染 -->
<div id="app">{{ message }}</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'hello world'
  }
})
```
最后，在浏览器中打开，看看网页中会显示什么呢？
