# 基本用法

## 引入 jQuery

在官网下载 jQuery.js，然后把文件引入页面：

```html
<script src="./js/jquery-3.4.1.js"></script>
```

或者使用 CDN 引入：

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
```

## 选择器

jQuery 选择器可以传入任意值，它会返回一个 jQuery 对象，这个对象是一个类数组，类数组的名字就是 jQuery。  

我们可以使用选择器来操作 DOM。选择器语法为：`$()` 或 `jQuery()`，选择器中可以传入任意值，具体如下。

### CSS 选择器

在 `$()` 中传入 CSS 选择器，它会返回一个 jQuery 对象（类数组）。

```js
console.log(jQuery('.d1 > .d2').text())
console.log(jQuery('.d1 > .d2, .nav').text())
console.log(jQuery('.nav'))
```

:::warning 注意
`$()` 获取的不是原生的 DOM 对象，因为原生的 DOM 没有 `text()` 方法。可以通过以下方法得到原生的 DOM：

```js
// 得到原生的 DOM
console.log(jQuery('.nav')[0])
```

再次强调，通过 `$()` 获取的 DOM 会被放入 jQuery 类数组中，数组的每一个元素就是原生的 DOM。
:::

- **JS 转为 jQuery 对象**  
  
  只需将原生 JS 的 DOM 或其它 JS 对象放入 jQuery 选择器中。

  ```js
  $(domEle)
  ```

- **jQuery 转为 JS 对象**  

  取 jQuery 对象（数组）的第一个元素即可。
  
  ```js
  $('#ele')[0]
  ```

### 传入原生 DOM

返回一个 jQuery 类数组。

```js
// 传入原生的 DOM
var nav = document.querySelectorAll('.nav');
console.log($(nav))
```

### 带索引的值

只要传入选择器中的值带有索引，那么 jQuery 就会把它插入到 jQuery 这个类数组中。

```js
// 传入类数组
console.log($({0:'a',1:'b',length:'2'}))
// 传入数组
console.log($(['a','b']))
```

### 函数

在选择器中传入一个函数，则这个函数会在 DOM 被加载完成后立即执行。有点像 JS 中的 `window.onload`，但是 JS 中函数必须要调用才能执行。  

```js
// 传入函数, 该函数会在 DOM 被解析完成后立即被执行
// 在页面中可以有多个这样写法, 但是 window.onload 只能有一个。
$(function(){
  console.log($('.nav').text())
})

$(document).ready(function(){
  console.log($('.nav').text())
})
```

### 空值

这里的空值包括 null、undefined、false 等，传入空值会返回一个空的 jQuery 对象。

```js
console.log($(null))
console.log($(false))
console.log($(undefined))
console.log($())
```

### 属性选择器

用来选择具有某个属性的元素，属性选择器的更多用法请见 [CSS 选择器](../../base/css/selector.html) 。

```js
// 返回含有 class 属性的元素
console.log($('[class]').text())
// 返回含有 class="txt" 的元素
console.log($('[class=txt]').text())
```

### 其它

传入其它任意有效值，它会把这些值放入类数组并返回。

```js
console.log($(true));
console.log($(123))
console.log($({}))
```  
  
### 表单选择器

这些选择器也称为过滤选择器。其实在前面我们已经讲过了，只是在表中使用得更多一些，所以我们再来强调一下。

```js
// 选中所有 type="text" 的 input
$(':text').val('123')
// 也可以加上 form 的 id 等。
$('#myform:text').val('12333')
// 选中所有 type="password" 的input
$(':password').val('23')
// 选中所有的 input 框, 包括 textarea、select、button、input。
$(':input').val('23')
```

但是这种方法在有多个 type 相同的情况下不适用。

:::tip 提示
在 jQuery 选择器中，可以使用 CSS 中的所有用法，如 `$('*')`、`$('p.txt')`、`$('.txt1, .txt2')` 等。
:::

## this

在 jQuery 中也可以使用 this，它和 JS 中的 this 相同。但是，使用时有些区别。

```js
$('#selectAll').change(function() {
  // 这时的 this 就是原生的 DOM 对象, 所以可以使用 checked 属性
  $('.item').attr('checked',this.checked)
  // 注意, 此处只能使用 prop 来获取它的选中状态（也可以像上面使用 this.checked）
  console.log($('#selectAll').prop('checked'))
})
```

```js
$('.item').click(function() {
  // this 就是原生的 DOM, 而 $()中可以放入原生 DOM
  // 但是不能直接使用 this.toggleClass(), 因为原生的 DOM 没有此方法。
  $(this).toggleClass('active')
  toggleClass(xx,false)//一直不添加, ture 表示只添加
  // if ($(this).hasClass('active')) {
  //   $(this).removeClass('active')
  // } else {
  //   $(this).addClass('active')
  // }
})
```

## 链式调用

在 jQuery 中，大部分的添加、修改、删除操作都会返回该 jQuery 对象，所以可以使用链式调用。

```js
$('#nav2').addClass('t2').removeClass('dc1').addClass('tt').text()

// 下面会报错, 因为 text() 方法在此处是取值, 返回的就是一个文本的值, 而不是一个对象
// $('#nav2').text().addClass('t2')
// 下面的不会报错, 因为 text('123') 在此处是修改操作
$('#nav2').text('123').addClass('t2')
```
