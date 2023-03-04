---
sidebar: ['/portal/advance/jq.html']
---

# jQuery

## 简介
jQuery 是一个快速、简洁的 JavaScript 框架, 是继 Prototype 之后又一个优秀的 JavaScript 代码库（或 JavaScript 框架）。

jQuery 设计的宗旨是“write Less, Do More”, 即倡导写更少的代码, 做更多的事情。它封装了 JavaScript 常用的功能, 提供了一种简便的 JavaScript 设计模式, 优化 DOM 操作、事件处理、动画设计和 Ajax 交互。  

jQuery 的核心特性可以总结为: 
- 具有独特的链式语法和短小清晰的多功能接口
- 具有高效灵活的 CSS 选择器, 并且可对 CSS 选择器进行扩展
- 拥有便捷的插件扩展机制和丰富的插件
- 兼容各种主流浏览器, 如 IE 6.0+、FF 1.5+、Safari 2.0+、Opera 9.0+ 等

:::tip 提示
要获取更多信息, 请查看 [jQuery 官网](https://jquery.com)。
:::

## 引入 jQuery
首先, 在官网下载 jQuery.js, 然后把文件引入页面: 
```html
<script src="./js/jquery-3.4.1.js"></script>
```
## 选择器
jQuery 选择器可以传入任意值, 它会返回一个 jQuery 对象, 这个对象是一个类数组, 类数组的名字就是 jQuery。  

我们可以使用选择器来操作 DOM。选择器语法为: `$()` 或 `jQuery()`, 选择器中可以传入任意值, 具体如下: 
- **CSS 选择器**  

  在 `$()` 中传入 CSS 选择器, 它会返回一个 jQuery 对象（类数组）。
  ```js
  console.log(jQuery('.d1 > .d2').text())
  console.log(jQuery('.d1 > .d2, .nav').text())
  console.log(jQuery('.nav'))
  ```
  :::warning 注意
  `$()` 获取的不是原生的 DOM 对象, 因为原生的 DOM 没有 `text()` 方法。可以通过以下方法得到原生的 DOM: 
  ```js
  // 得到原生的 DOM
  console.log(jQuery('.nav')[0])
  ```
  再次强调, 通过 `$()`  获取的 DOM 会被放入 jQuery 类数组中, 数组的每一个元素就是原生的 DOM。
  :::

- **传入原生 DOM**  

  返回一个 jQuery 类数组。
  ```js
  // 传入原生的 DOM
  var nav = document.querySelectorAll('.nav');
  console.log($(nav))
  ```

- **带索引的值**  

  只要传入选择器中的值带有索引, 那么 jQuery 就会把它插入到 jQuery 这个类数组中: 
  ```js
  // 传入类数组
  console.log($({0:'a',1:'b',length:'2'}))
  // 传入数组
  console.log($(['a','b']))
  ```
- **函数**  

  在选择器中传入一个函数, 则这个函数会在 DOM 被加载完成后立即执行, 有点像 JS 中的 `window.onload`, 但是 JS 中函数必须要调用才能执行。  
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

- **空值**  

  这里的空值包括 null、undefined、false 等。 传入空值, 会返回一个空的 jQuery 对象。
  ```js
  console.log($(null))
  console.log($(false))
  console.log($(undefined))
  console.log($())
  ```

- **属性选择器[ ]**  

  用来选择具有某个属性的元素。属性选择器的更多用法请见 [CSS 选择器]('/../../base/css.html#选择器) 。
  ```js
  // 返回含有 class 属性的元素
  console.log($('[class]').text())
  // 返回含有 class="txt" 的元素
  console.log($('[class=txt]').text())
  ```

- **其它**  

  传入其它任意有效值, 它会把这些值放入类数组并返回: 
  ```js
  console.log($(true));
  console.log($(123))
  console.log($({}))
  ```  
  
- **表单的一些常见选择器**  

  这些选择器也称为过滤选择器。其实在前面我们已经讲过了, 只是在表中使用得更多一些, 所以我们再来强调一下。
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
在 jQuery 选择器中, 可以使用 CSS 中的所有用法, 如 `$('*')`、`$('p.txt')`、`$('.txt1, .txt2')` 等。
:::

## 方法
强调！可以直接使用 jQuery 对象的 `length` 属性来获取长度。

### 操作 DOM

- **text()**  

  基本语法 `$('...').text(...)`, 用法如下: 
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

- **html()**  

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

- **val()**  

  该方法通常用来获取文本框组件的值。
  ```js
  // 只会获取第一个 input, 与 html() 相同
  console.log($('input').val())
  // 可以修改一组的值
  $('input').val('修改之后的value')
  // 与 attr('value') 等价
  ```

  ---
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

- **attr()**  

  用来获取、修改、自定义、设置元素的属性。此方法中如果只传入一个参数, 则是获取属性值, 最多只能返回一个值。如果传入两个参数, 则表示修改属性的值。`attr()` 能够获取到用户自定义的属性。当获取没有设置的属性时, 会返回 undefined。`attr()` 相当于 JS 中的 `setAttribute()`、`getAttribute()`
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

- **prop**  

  与 `attr()` 相似, 但是有点细微的区别, 它不能获取到用户自定义的属性（这里的自定义是指在标签上写出的自定义属性）。当获取没有设置的固有属性时, 会返回空（''）。当获取没有设置的自定义属性时, 会返回 undefined。`prop()` 相当于 JS 中的 `.` 操作, 即 `dom.className`。
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

- **removeAttr()**  

  删除某个属性。
  ```js
  // 移除属性 class
  // 更多 remove 函数请自己查阅
  $('#nav1').removeAttr('class')
  ```

- **removeProp()**  
  
  也是删除某个属性, 但是只能删除用户自定义的属性(注意与 `attr()` 的不同), 无法删除固有的属性。
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
  
- **addClass()**  

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

- **removeClass()**  

  删除某个 class 名。语法与 `addClass` 相同。如果没有给它设置参数, 则会移除全部的。移除多个时, 请用空格隔开（写在同一个字符串内）。

- **toggleClass()**  

  切换 class。如果有, 则删除, 如果没有, 则添加。该方法可以有第二个参数, 它是一个 boolean 值。如果为 false, 表示不添加, 功能相当于 `removeClass()`; 如果为 true, 则表示不删除, 相当于 `addClass()`。多个 class 请用空格隔开。

- **DOM 查找和筛选**   

  通过 jQuery 提供的常见方法来选择指定的 DOM, 一些常用的方法如下: 
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

- **filter()**  

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

- **not()**  

  筛选不含有某些条件的 DOM。
  ```js
  // 查找 class 不含 test 的 li
  $('li').not('.test').css('background','#ff6600')
  ```

- **is()**  

```js
  // 查看所有的li中是否有 class 值含有 test 的, 返回值是 boolean
  // 只要有一个 li 满足条件, 就会返回 true
  console.log($('li').is('.test'))
  ```
- **slice()**  

  ```js
  // 选择索引为 1 和 2 的
  $('li').slice(1,3).css('background','#ff6600')
  // 选择索引为 1 及其以后的
  $('li').slice(1).css('background','#ff6600')
  ```

- **has()**  

  ```js
  // 查找其子元素有 p 标签的 li
  $('li').has('p').css('color','red')
  ```

- **each()**  

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

- **map()**  

  ```js
  // map 的返回值就是就回调函数的返回值, 并且会把回调函数的返回值封装到 jQuery 对象中（ 即 $(dom)）
  $('li').map(function (index, ele) {
    if($(ele).find('.age').text() >= 18){
      return ele;
    } 
  }).css('background','#ff6600')
  ```

- **创建新节点**  

  直接在 `$()` 中写标签即可。
  ```js
  // 创建节点
  var $ele = $('<li>1</li>')
  console.log($ele[0])
  ```

- **添加节点**  

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

- **替换节点**  

  ```js
  // 用 h3 替换所有的 div
  $('div').replaceWith($('<h3>h3</h3>'))
  $('<h3>h3</h3>').replaceAll($('div'))
  // 用 h3 替换所有的 ul
  $('<h3>h3</h3>').replaceAll('ul')
  ```

- **删除节点**  

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

- **克隆节点**  

  ```js
  // 复制（克隆）节点, 使用 clone()
  // 使用 clone 方法, 此方法中可传递一个 boolean 值
  // 如果为参数 true, 则表示克隆其绑定的事件等; 如果是false（默认）, 则只克隆标签
  // 它会返回克隆的元素
  console.log($('.nav1').clone(false)[0])
  var $my = $('.nav1').clone(true)
  $('.nav2').after($my)
  ```

- **查找节点**

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

### 操作 CSS
- **css()**  

  获取、修改、设置元素的 css 样式。如果获取的是单个属性, 则返回具体的值; 如果获取的是复合属性, 则返回一个对象。  
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

- **width()**  

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
- **height()**  

  获取高度。与 `width()` 类似。
  ```js
  // 获取高度
  console.log($('ul').height())
  // 设置高度
  $('ul').height(300)
  ```

- **innerWidth()**  

  获取内部的宽度, 加上 padding, 返回值为 number 类型
  ```js
  // 获取内部的宽度, 加上 padding, 返回值为 number 类型
  console.log($('.nav2').innerWidth())
  // padding 不变, 宽度（width）变成 xxx 减去左右的 padding
  // 如果 xxx 小于了元素左右的 padding, 则元素的 width 为0, padding 不变。
  $('.nav2').innerWidth(xxx)
  ```

- **outerWidth()**  

  获取内部的宽度(content), 加上 padding 和 border, 返回值为 number 类型
  ```js
  // 获取内部的宽度(content), 加上 padding 和 border, 返回值为 number 类型
  console.log($('.nav2').outerWidth())
  // 获取内部的宽度(content), 加上 padding、border和 margin, 返回值为 number 类型
  console.log($('.nav2').outerWidth(true))
  // 也是只会改变内容区的宽度, 和 innerWidth() 类似
  console.log($('.nav2').outerWidth(100))
  ```

- **offset()**  

  获取元素相对于文档（页面）的 top 和 left, 返回值为对象。
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

- **position()**  

  此方法只能获取元素距离其最近的有定位的父节点的 top 和 left。无法获取隐藏或不可见的元素的 top 和 left。position 无法传参, 若要改变 top 和 left, 请通过 `css()` 来设置。
  ```js
  // 获取元素设置的 top 的 left（距离其有定位的父节点的位置）
  console.log($('.nav3').position())
  $('.nav3').position({
    top: '20px',
    left: '30px'
  })
  // position 无法传参, 请通过 css() 来设置。
  ```

- **offsetParent()**  

  获取该元素其相对定位的祖先（父）元素。如果该元素没有开启定位, 但是其最近的祖先元素有定位, 则获取的就是该祖先节点。如果该元素和其父元素都没有定位, 则获取的是 **html** 标签, 注意不是 body 标签, 想知道原因的话请百度 html 和 body 的区别。
  ```js
  console.log($('#l1').offsetParent()[0])
  ```

- **scrollTop() 和 scrollLeft()**  

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

- jQuery 对象和 原生 JS 对象的方法时相互独立的, 不能用 jQuery 对象调用原生 JS 的方法或属性。建议 jQuery 对象的变量名以 $ 开头。
:::

## jQuery 与 JS 对象的相互转换

其实在选择器中我们已经提到了, 这里再来强调一下。 

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

## this 使用
在 jQuery 中, 也可以使用 this, 它和 JS 中的 this 相同。但是, 使用时请注意区分: 
```js
$('#selectAll').change(function(){
  // 这时的 this 就是原生的 DOM 对象, 所以可以使用 checked 属性
  $('.item').attr('checked',this.checked)
  // 注意, 此处只能使用 prop 来获取它的选中状态（也可以像上面使用 this.checked）
  console.log($('#selectAll').prop('checked'))
})
```
```js
$('.item').click(function(){
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
在 jQuery 中, 大部分的添加、修改、删除操作都会返回该 jQuery 对象, 所以可以使用链式调用的方式。
```js
$('#nav2').addClass('t2').removeClass('dc1').addClass('tt').text()
// 下面会报错, 因为 text() 方法在此处是取值, 返回的就是一个文本的值, 而不是一个对象
// $('#nav2').text().addClass('t2')
// 下面的不会报错, 因为 text('123') 在此处是修改操作
$('#nav2').text('123').addClass('t2')
```
## 事件  
- **鼠标事件**  

  ```js
  $('.nav1').mouseover(function () {
    console.log('over')
  }).mouseout(function () {
    console.log('out')
  }).mouseenter(function () {
    console.log('enter')
  }).mouseleave(function () {
    console.log('leave')
  })
  ```

- **键盘事件**  

  ```js
  $(document).keydown(function(e) {
    console.log(e.key)
  }).keyup(function(){
    console.log('松开')
  })
  ```

- **焦点事件**  

  ```js
  // 获取焦点
  $('input').focus(function () {
    console.log(this.value)
    console.log($(this).val())
  })

  // 失去焦点
  $('input').blur(function () {
    console.log('失去焦点')
  })

  $('input').focusin(function () {
    console.log('进入')
    console.log($(this).val())
  })

  $('input').focusout(function () {
    console.log('退出')
    console.log($(this).val())
  })
  ```

- **事件绑定 bind()**  

  更多用法请见官网。
  ```js
  $('input').bind('click',function () {
    console.log('123')
  })

  /* --------------------------------*/

  // 同时绑定多个事件, 使用对象的形式
  $('input').bind({'focus':function() {
      console.log('foucus...')
    },
    'blur':function(){
      console.log('blur...')
    }
  })
  ```

- **移除事件 unbind()**  

  每个用 `.bind()` 方法绑定的事件处理程序可以使用 `.unbind()` 移除。在最简单的情况下, `不带参数的.unbind()` 将移除元素上所有绑定的处理程序（从 jQuery 1.7开始, `.on()` 和 `.off()` 方法是最好的元素上附加和移除事件处理程序的方法）。

  ```js
  // 移除 focus 事件
  $('#t1').unbind('focus')
  ```
  ---
  如果在 jQuery 中要使用原生 JS 为元素绑定事件, 且事件是通过函数来引用的, 则此函数的定义必须写在 `$(document).ready()` 之外。如果要在元素的标签上绑定 onclick 等事件, 则也必须这样。
  ```js
  function click() {
    // ...
  }
  $(document).ready(function () {
    $('#t1')[0].onClick = click;
  })
  ```

- **复合事件 hover**  

  就是 CSS 中的 hover, 相当于 mouseover 和 mouseout。它可以传递两个函数, 第一个是鼠标悬浮, 第二个是鼠标移出。如果值传递一个函数, 则表示鼠标悬浮。
  ```js
  $('.nav3').hover(function () {
    console.log('悬浮')
  },function () {
    console.log('移出')
  })
  ```

- **复合事件 toggle**  

  可以添加多个事件, 参数类型可以是多个函数, 但是只有 jQuery1.9 之前的版本才支持。该函数的另外一个作用就是用来隐藏和显示元素, 传递一个 boolean 值。若为 true（默认值）, 则显示; 否则隐藏, 且隐藏后不会占据页面的空间（与 `display:none` 类似）。

- **显示 show()**

  ```js
  function myShow() {
    $('.nav3').show()
    $('.nav3').show(3000)
    $('.nav3').show(3000,function () {
      // 在 show 方法执行完成后, 会自动调用该回调函数
      console.log('显示完毕')
    })
    $('.nav3').show('fast')
    $('.nav3').show('slow')
    $('.nav3').show('normal')
    $('.nav3').show('linear')
  }
  ```
- **隐藏 hide()**  

  用法与 `show()` 类似。隐藏后不会占据原来的位置, 类似 `display:none`

- **淡入 fadeIn()**  

  它也是显示元素, 但是它是淡入（有透明效果）。参数和 `show()` 相同。

- **淡出 fadeOut()**  
  
  元素消失后也不会占据原来的位置。

- **控制高度 slideDown()**  

  **增大**元素的高度至原先的高度, 也是显示的效果。

- **控制高度 slideUp()**  

  **减少**元素的高度至 0, 也是消失的效果。



## jQuery 练习
### 操作 className
实现功能: 点击标签切换背景, 使用了 `toggleClass()` 和 `this`。
```html
<ul>
  <li class="item">
    <p>
      啤酒
      <span>￥ 6</span>
    </p>
  </li>
  <li class="item">
    <p>
      可乐
      <span>￥ 6</span>
    </p>
  </li>
  <li class="item">
    <p>
      枸杞
      <span>￥ 20</span>
    </p>
  </li>
  <li class="item">
    <p>
      红枣
      <span>￥ 18</span>
    </p>
  </li>
  <li class="item">
    <p>
      雪碧
      <span>￥ 3</span>
    </p>
  </li>
  <li class="item">
    <p>
      奶茶
      <span>￥ 12</span>
    </p>
  </li>
</ul>
<button id="buy">Buy</button>
```
```css
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  width: 300px;
  background: #ededed;
  color: black;
  border-radius: 10px;
  margin-bottom: 15px;
}
p {
  font-size: 18px;
  padding: 10px 10px;
}
p > span {
  float: right;
}
#buy {
  margin: 10px;
  padding: 10px;
  border: 2px solid rgb(30, 186, 248);
  border-radius: 5px;
  background-color: #fff;
  color: rgb(77, 214, 248);
  cursor: pointer;
  outline: none;
}
.active {
  color: #fff;
  background: rgb(30, 186, 248);
}
```
```js
$('.item').click(function() {
  // this 就是原生的 DOM, 而 $()中可以放入原生 DOM
  // 但是不能直接使用 this.toggle, 因为原生的 DOM 没有此方法。
  $(this).toggleClass('active')
  // if ($(this).hasClass('active')) {
  //   $(this).removeClass('active')
  // } else {
  //   $(this).addClass('active')
  // }
})
```
### 表单校验
使用的常用方法: `blur()` 和 `submit()`, 即 JS 中的 `onblur()` 和 `onsubmit()`。需要注意的是, submit 方法只能给表单或 submit 类型的按钮使用。onsubmit 是标签的属性, 所以它只能写在标签上来调用函数; 而且建议写在 form 标签上（如 onsubmit="return check()"）。submit 按钮可以直接绑定单击事件, 可以不用绑定 submit 或 onsubmit。表单的强大之处在于, 当函数的返回值为 true 是, 它才会提交。

- **示例1**

  ```html
  <form action="jquerydemo09.html" name="form" id="form">
    <span>用户名</span>: <input id="uname" name="uname" type="text" autocomplete="off"><br>
    <span>密码</span>: <input id="upwd" name="upwd" type="password" autocomplete="off"><br>
    <span>确认密码</span>: <input id="urpwd" name="urpwd" type="password" autocomplete="off"><br>
    <span>年龄</span>: <input id="uage" name="uage" type="text" autocomplete="off"><br>
    <span>电话</span>: <input id="utel" name="utel" type="text" autocomplete="off"><br>
    <span>姓名</span>: <input id="utname" name="utname" type="text" autocomplete="off"><br>
    <span>邮箱</span>: <input id="uemail" name="uemail" type="text" autocomplete="off"><br>

    <button id="btn" type="button">提交</button>
    <!-- <button id="btn" type="submit">提交</button> -->
  </form>
  ```
  ```css
  /* 以下样式是为了使文字两端对齐 */
  span{
    display: inline-block;
    width: 70px;
    /* height: 50px; */
    text-align: justify;
    /* 必须要加上下面这句, 不然会以低端对齐 */
    vertical-align: top;
    overflow: hidden;
  }
  span::after{
    content: " ";
    display: inline-block;
    width: 100%;
    height: 0;
  }
  ```
  ```js
  // 验证年龄
  function checkAge() {
    // 如果此函数写在外面被调用, 则不能使用 $(this).val()
    var $age = $('#uage').val()
    console.log($age)
    if (/^\d{1,2}$/.test($age) && $age >= 18 && $age <= 130) {
      // isNaN(number) 如果是纯数字（不一定是十进制的, 纯数字的字符串也可）, 则返回 false
      console.log('年龄正确')
    } else {
      console.log('年龄错误')
      return false
    }
    return true
  }
  // 验证邮箱
  function checkEmail(){
    var $uemail = $('#uemail').val()
    // /^\w+([-\.]\w+)*@[A-z\d]+(\.[A-z\d]{2,6}){1,2}$/
    if(/^\w+([-\.]\w+)*@[A-z\d]{2,70}(\.[A-z\d]{2,6}){1,2}$/.test($uemail)) {
      console.log('邮箱正确')
    } else {
      console.log('邮箱错误')
      return false
    }
    return true
  }


  $(function () {
    $('#uage').blur(checkAge)
    $('#uemail').blur(checkEmail)
    $('#btn').click(function () {
      var state = checkAge() && checkEmail()
      if (state) {
        $('#form').submit()
      }
    })
  })
  ```

- **示例2**  

  ```html
  密码: <input type="text" name="" id="" onclick="test(this)" value="23">
  ```
  ```js
  function test(params) {
    console.log($(params).val())
  }
  ```
