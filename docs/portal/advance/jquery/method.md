# 常用方法

注意，可以直接使用 jQuery 对象的 `length` 属性来获取长度。

## 操作 DOM

### text()

基本语法 `$('...').text(...)`，用法如下。

```js
// 获取所有 div 的 innerText
$('div').text()
// 设置 innerText
$('#nav1').text('123')
// 添加内容, 根据函数来判断
$('#nav1').text(function () {
    if (true) {
    return 'true';
    } else {
    return 'false';
    }
})
// 添加内容, 根据函数来判断
$('#nav1').text(function (index, ele) {
// 获取当前正在操作的元素的下标
console.log(index)
// 当前正在操作的元素, 此处是 id 为 nav1 的元素
console.log(ele)
})
```

### html()  

```js
// 只会获取第一个 div 中的 html
console.log($('div').html())
// 会给所有的 div 都设置文本 123
$('div').html('123')
$('#nav1').html('<b>strong</b>')
// 函数, 与 text() 方法类似
$('#nav1').html(function (index, ele) {

})
```

### val() 

该方法通常用来获取文本框组件的值。

```js
// 只会获取第一个 input, 与 html() 相同
console.log($('input').val())
// 可以修改一组的值
$('input').val('修改之后的value')
// 与 attr('value') 等价
```

```html
<select multiple id="list">
  <option value="焰灵姬" selected>焰灵姬</option>
  <option value="田密">田密</option>
  <option value="晓梦">晓梦</option>
</select>
```
```js
// 只会获取 option 中被选中的那个值
console.log($('#list').val())
// 指定被选中的选项, 前提是 option 中设置了 value = "晓梦"
$('#list').val(['晓梦'])
// 在设置了多选的情况下, 数组中可以放多个选项
$('#list').val(['晓梦','焰灵姬'])
console.log($('#list').val())
// 如果设置了多选, 则必须指明一个 selected, 不然 ($('#list').val() 的返回值会为空。
```

### attr() 

用来获取、修改、自定义、设置元素的属性。此方法中如果只传入一个参数，则是获取属性值，最多只能返回一个值。如果传入两个参数，则表示修改属性的值。`attr()` 能够获取到用户自定义的属性。当获取没有设置的属性时，会返回 undefined。`attr()` 相当于 JS 中的 `setAttribute()`、`getAttribute()`。

```html
<!-- 其中的 myattr 是自定义的属性 -->
<div id="nav1" class="d1" myattr='djf'>div-nav1</div>
<div id="nav2">div-nav2</div>
```
```js
console.log($('#nav1').attr('id'));
console.log($('.d1').attr('class'))
console.log($('#nav1').attr('myattr'))
// 只能获取到第一个 div 的 id
console.log($('div').attr('id'))
// 取出没有设置的属性 title
console.log($('div').attr('title')) // undefined
// attr相当于JS中的 set/getAttribute()
console.log($('#nav1')[0].myattr)
// 修改属性值, 第一个参数是属性名, 第二个参数是要修改的值
$('#nav1').attr('myattr',123)
// 对象方式赋值(即批量修改)
// 会对所有的 div 生效
$('div').attr({
  class:'div',
  myattr: 'attr-test'
})
// 添加某个属性, 此属性会在标签中显示
$('#nav1').attr('ccc','ccc')
```

### prop()  

与 `attr()` 相似，但是有点细微的区别，它不能获取到用户自定义的属性（这里的自定义是指在标签上写出的自定义属性）。当获取没有设置的固有属性时，会返回空（''）。当获取没有设置的自定义属性时，会返回 undefined。`prop()` 相当于 JS 中的 `.` 操作，即 `dom.className`。

```html
<!-- 其中的 myattr 是自定义的属性 -->
<div id="nav1" class="d1" myattr='djf'>div-nav1</div>
<div id="nav2">div-nav2</div>
```
```js
console.log($('#nav1').prop('id'));
console.log($('.d1').prop('class'))
// 无法获取自定义的 myattr
console.log($('#nav1').prop('myattr')) // undefined
// 只能获取到第一个 div 的 id
console.log($('div').prop('id'))
// 取出没有设置的属性 class
console.log($('#nav2').prop('class')) // 空
// prop 相当于 JS 中的 . 操作, 即 dom.className
console.log($('#nav1')[0].getAttribute('myattr'))
// 修改属性值, 第一个参数是属性名, 第二个参数是要修改的值
$('#nav1').attr('myattr',123)
// 对象方式赋值(即批量修改)
// 会对所有的 div 生效
$('div').prop({
  class:'div',
  myattr: 'attr-test'
})
// 添加自定义属性（可以添加）
// 但是此属性不会在标签上显示
$('#nav2').prop('ddd','ddd')
console.log($('#nav2').prop('ddd')) // ddd
```

### removeAttr()

删除某个属性。

```js
// 移除属性 class
// 更多 remove 函数请自己查阅
$('#nav1').removeAttr('class')
```

### removeProp()  
  
也是删除某个属性，但是只能删除用户自定义的属性（注意与 `attr()` 的不同），无法删除固有的属性。

```js
// removeProp 只能删除用户自定义的属性(注意与 attr() 的不同)。
$('#nav2').prop('ddd','ddd')
$('#nav2').removeProp('ddd')
console.log($('#nav2').prop('ddd')) // undefined
// 无法删除固有的属性
$('#nav2').prop('ddd','d1')
$('#nav2').removeProp('id')
console.log($('#nav2').prop('id')) // d1
```
  
### addClass() 

添加 className。

```js
// 添加 class
$('#nav1').addClass('t1')
// 添加多个
$('#nav2').addClass('t2 t10')
// 下面也是添加class的值, 只不过传递的是函数, 返回值就是要添加的值。
$('#nav2').addClass(function() {
  return 't6'
})
// index: 当前正在遍历的div的索引
// className: 当前 div 的类名（该值可省）
$('div').addClass(function(index, className) {
  console.log(index+"->"+className)
  // 可以添加多个 class, 用空格分开
  return 't6 t7'
})
```

### removeClass() 

删除某个 class 名，语法与 `addClass` 相同。如果没有给它设置参数，则会移除全部的 class。移除多个时，请用空格隔开（写在同一个字符串内）。

### toggleClass() 

切换 class。如果有，则删除；如果没有，则添加。该方法可以有第二个参数，它是一个 boolean 值。如果为 false，表示不添加，功能相当于 `removeClass()`；如果为 true，则表示不删除，相当于 `addClass()`。多个 class 请用空格隔开。

### 查找和筛选 DOM

通过 jQuery 提供的常见方法来选择指定的 DOM，一些常用的方法如下。

```js
// 选择第一个 li
$('li:first').css('color','#ff6600')
// 选择最后一个 li
$('li:last').css('color','#ff6600')
// odd 选择的是索引值为奇数的
$('li:odd').css('color','#ff6600')
// even 选择的是索引值为偶数（包括0）的
$('li:even').css('color','#ff6600')
// 选择索引为 2 的, 即第三个
$('li:eq(2)').css('color','#ff6600')
// index 大于第 0 个
console.log($('div:gt(0)').text())
// index 小于第 2 个
console.log($('div:lt(2)').text())
// 获得焦点的那一个
console.log($('div:focus').text())
// 选中标题（h1 - h6）
$(':header').css('color','green')
// 选取所有可见的元素
$(':visible')
// 选取所有不可见的元素
$(':hidden')

/* --------------------------------------- */

// 以下的方法原理和上面的类似
$('li').first().css('color','#ff6600')
$('li').last().css('color','#ff6600')
$('li').eq(1).css('color','#ff6600')
// eq() 方法中也可以传递字符串
$('li').eq('1').css('color','#ff6600')
// 为负数时, 它会加上长度。
$('li').eq(-1).css('color','#ff6600')

/* --------------------------------------- */

// 筛选
// 查找第三个 li 的上一个元素
$('li:eq(2)').prev()
// 判断第三个 li 锋上一个是否是p标签, 返回值为 jQuery 对象。
$('li:eq(2)').prev('p')
// 查找第三个 li 上面所有的兄弟元素
$('li:eq(2)').prevAll()
// 选中除最后一个 li 外所有的元素
$('li').prevAll()

/* --------------------------------------- */

// 选中第3个 li 的下一个元素
$('li:eq(2)').next()
// 选中第3个 li 后面所有的元素
$('li:eq(2)').nextAll()
// 选中除第一个 li 以外所有的元素
$('li').nextAll()

/* --------------------------------------- */

// 获取第一个 li 所有的兄弟元素
$('li:eq(0)').siblings()
// 获取所有 li 的兄弟元素
$('li').siblings()
// 选中li的兄弟元素, 且其兄弟元素的下标为奇数
console.log($('li').eq(0).siblings(':odd').text())
```

### filter() 

  该方法可以用来筛选 DOM。

 ```js
 // 选择下标为奇数的
 $('li').filter(function (index, ele) {
   // return index % 2 ? true:false;
   return index % 2;
 }).css('background','#ff6600')
 // 查找 class 含有 test 的 li
 $('li').filter('.test').css('background','#ff660')
 // 选中 class 含有 li 的 li 标签
 console.log($('li').filter('.li'))
 ```

### not() 

筛选不含有某些条件的 DOM。

 ```js
 // 查找 class 不含 test 的 li
 $('li').not('.test').css('background','#ff6600')
 ```

### is()

```js
// 查看所有的 li 中是否有 class 值含有 test 的, 返回值是 boolean
// 只要有一个 li 满足条件, 就会返回 true
console.log($('li').is('.test'))
```

### slice()

 ```js
 // 选择索引为 1 和 2 的
 $('li').slice(1,3).css('background','#ff6600')
 // 选择索引为 1 及其以后的
 $('li').slice(1).css('background','#ff6600')
 ```

### has()

```js
// 查找其子元素有 p 标签的 li
$('li').has('p').css('color','red')
```

### each()

```js
// each的返回值就是 $('li')
// 其中的两个参数可以省略。
// index 表示当前正在遍历的元素的索引
// ele 表示当前正在遍历的元素
$('li').each(function (index, ele) {
  // 查找 li 的子元素, 且其子元素的 class 含有 name
  arr.push($(ele).find('.name').text())
})
```

### map()

```js
// map 的返回值就是就回调函数的返回值, 并且会把回调函数的返回值封装到 jQuery 对象中（ 即 $(dom)）
$('li').map(function (index, ele) {
  if($(ele).find('.age').text() >= 18){
    return ele;
  } 
}).css('background','#ff6600')
```

### 创建节点 

直接在 `$()` 中写标签即可。

```js
// 创建节点
var $ele = $('<li>1</li>')
console.log($ele[0])
```

### 添加节点

```js
// 在 ul 最后添加一个子元素
$('ul').append($('<li>1</li>'))
// 在 ul 最后添加一个子元素
$('<li>12</li>').appendTo('ul')
// 在 ul 最前面添加一个子元素
$('ul').prepend($('<li>123</li>'))
// 在 ul 最前面添加一个子元素
$('<li>123</li>').prependTo($('ul'))

// 在 div 的后面插入一个兄弟元素
$('div').after('<p>p</p>')
// 在 div 的后面插入一个兄弟元素
$('<p>p1</p>').insertAfter('div')

// 在 div 的前面插入一个兄弟元素
$('div').before('<p>p</p>')
// 在 div 的前面插入一个兄弟元素
$('<p>p1</p>').insertBefore('div')
```

### 替换节点

```js
// 用 h3 替换所有的 div
$('div').replaceWith($('<h3>h3</h3>'))
$('<h3>h3</h3>').replaceAll($('div'))
// 用 h3 替换所有的 ul
$('<h3>h3</h3>').replaceAll('ul')
```

### 删除节点

```js
// 删除节点
// 将整个节点彻底删除
$('div').remove()
// 后面的节点用来帅选, 此处是 div 并且其 class 含有 nav1.
$('div').remove('.nav1')
// 只删除节点中的内容
$('div').empty()
// 将节点删除, 但与其关联的事件和数据等不会被删除（不推荐使用）
$('div').detach()
```

### 克隆节点

```js
// 复制（克隆）节点, 使用 clone()
// 使用 clone 方法, 此方法中可传递一个 boolean 值
// 如果为参数 true, 则表示克隆其绑定的事件等; 如果是false（默认）, 则只克隆标签
// 它会返回克隆的元素
console.log($('.nav1').clone(false)[0])
var $my = $('.nav1').clone(true)
$('.nav2').after($my)
 ```

### 查找节点

```js
// 直接子节点
// 查找其中的 li 标签
var $lis = $('ul').children('li')
console.log($lis.length)
// 查找其中的子元素, 且其子元素含有 class 为 li 的
var $lis2 = $('ul').children('.li')
console.log($lis2.length)
// 获取所有子节点
var $lis3 = $('ul').children()
console.log($lis3.length)
// 后代节点, 用法与 children 类似, 但是不推荐此用法, 因为费性能
console.log($('ul').find().length) // 0
console.log($('ul').find('.li').length)
console.log($('ul').find('a').length)
// 返回其直接父元素
console.log($('li').parent())
// 返回其祖先元素
console.log($('li').parents())

// 当然, 以上的这些方法中也可以传入参数, 然后再次进行筛选。
// 特殊: find() 方法必须传入一个参数。
```

## 操作 CSS

### css()

获取、修改、设置元素的 css 样式。如果获取的是单个属性，则返回具体的值；如果获取的是复合属性，则返回一个对象。  

```js
// 获取的就是自己设置的 width, 没有 padding 和边框等。
// 返回值会带单位
console.log($(this).css('width'))
// 返回的是 rgb 或 rgba 值
console.log($(this).css('background-color'))
// 会获取所有的复合属性
console.log($(this).css('background'))
// 同时获取多个样式, 返回一个对象, 对象中封装了宽高
console.log($(this).css(['width','height']))
// 设置样式
$(this).css('background-color','green')
// 以下三种形式都可, 默认的单位就是px
// $(this).css('width','100px')
// $(this).css('width','100')
// $(this).css('width',100)
// 宽度自增 100px
$(this).css('width','+=100')
// 同时设置多个属性, 需要传入一个对象
$(this).css({
  width:100,
  // 自增
  // width: '+=50'
  height:100
})
// $(this).css({
//     'width':'300',
//     'height':100
// })
```

### width()

获取元素的宽度。

```js
// 直接获取宽度（content 区域）, 但是此宽度不带单位, 此返回值的类型为 number
console.log($('.nav2').width())
// 此宽度带单位, 此返回值的类型为 string
console.log($('.nav2').css('width'))
// 设置宽度
$('.nav2').width('50')
// $('.nav2').width(50)
// $('.nav2').width('50px')
```

### height()

获取高度，与 `width()` 类似。

```js
// 获取高度
console.log($('ul').height())
// 设置高度
$('ul').height(300)
```

### innerWidth()

获取内部的宽度（加上 padding），返回值为 number 类型。

```js
// 获取内部的宽度, 加上 padding, 返回值为 number 类型
console.log($('.nav2').innerWidth())

// padding 不变, 宽度（width）变成 xxx 减去左右的 padding
// 如果 xxx 小于了元素左右的 padding, 则元素的 width 为0, padding 不变。
$('.nav2').innerWidth(xxx)
```

### outerWidth() 

获取内部的宽度（content），加上 padding 和 border，返回值为 number 类型。

```js
// 获取内部的宽度(content), 加上 padding 和 border, 返回值为 number 类型
console.log($('.nav2').outerWidth())
// 获取内部的宽度(content), 加上 padding、border和 margin, 返回值为 number 类型
console.log($('.nav2').outerWidth(true))
// 也是只会改变内容区的宽度, 和 innerWidth() 类似
console.log($('.nav2').outerWidth(100))
```

### offset()

获取元素相对于文档（页面）的 top 和 left，返回值为对象。

```js
// 获取元素距离网页的位置, 返回值是一个对象, 里面封装了 top 和 left 的值
console.log($('.nav3').offset())
// 设置, 是设置的其相对于文档的位置, 不是与它最近的有定位的父节点的位置。
// $('.nav3').offset({
//     top: 10,
//     left: 10
// })

// 另一种设置的方法
$('#l1').offset(function (index, oldOffset) {
  var newOffset = new Object()
  newOffset.left = oldOffset.left + 50
  newOffset.top = oldOffset.top + 50
  return newOffset
})
```

### position()

此方法只能获取元素距离其最近的有定位的父节点的 top 和 left，无法获取隐藏或不可见元素的 top 和 left。position 无法传参，若要改变 top 和 left，请通过 `css()` 来设置。

```js
// 获取元素设置的 top 的 left（距离其有定位的父节点的位置）
console.log($('.nav3').position())
$('.nav3').position({
  top: '20px',
  left: '30px'
})
// position 无法传参, 请通过 css() 来设置。
```

### offsetParent()

获取该元素其相对定位的祖先（父）元素。如果该元素没有开启定位，但是其最近的祖先元素有定位，则获取的就是该祖先节点。如果该元素和其父元素都没有定位，则获取的是 **html** 标签，注意不是 body 标签，想知道原因的话请百度 html 和 body 的区别。

```js
console.log($('#l1').offsetParent()[0])
```

### scrollTop() 和 scrollLeft() 

获取滚动条滚动的距离。  

```js
var newTop;
var timer = setInterval(function () {
  if ($(document).scrollTop() + $(window).height() >= $('.txt').height()) {
    clearInterval(timer)
  }
  newTop = $(document).scrollTop() + 2;
  $(document).scrollTop(newTop);
}, 100)
```

:::tip 小贴士
- 通过 jQuery 设置的 CSS 样式都是内联样式。
- jQuery 对象和 原生 JS 对象的方法是相互独立的，不能用 jQuery 对象调用原生 JS 的方法或属性。
- 建议 jQuery 对象的变量名以 $ 开头。
:::
