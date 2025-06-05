# 事件  

## 鼠标事件  

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

## 键盘事件

```js
$(document).keydown(function(e) {
  console.log(e.key)
}).keyup(function(){
  console.log('松开')
})
```

## 焦点事件

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

## 事件绑定 bind() 

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

## 移除事件 unbind() 

每个用 `.bind()` 方法绑定的事件处理程序可以使用 `.unbind()` 移除。在最简单的情况下，`不带参数的.unbind()` 将移除元素上所有绑定的处理程。从 jQuery 1.7 开始，`.on()` 和 `.off()` 方法是最好的元素上附加和移除事件处理程序的方法。

```js
// 移除 focus 事件
$('#t1').unbind('focus')
```
  
如果在 jQuery 中要使用原生 JS 为元素绑定事件，且事件是通过函数来引用的，则此函数的定义必须写在 `$(document).ready()` 之外。如果要在元素的标签上绑定 onclick 等事件，则也必须这样。

```js
function click() {
  // ...
}
$(document).ready(function () {
  $('#t1')[0].onClick = click;
})
```

## 复合事件 hover 

就是 CSS 中的 hover，相当于 mouseover 和 mouseout。它可以传两个函数，第一个是鼠标悬浮，第二个是鼠标移出。如果只传一个函数，则表示鼠标悬浮。

```js
$('.nav3').hover(function () {
  console.log('悬浮')
}, function () {
  console.log('移出')
})
```

## 复合事件 toggle 

可以添加多个事件，参数类型可以是多个函数，但是只有 jQuery1.9 之前的版本才支持。该函数的另外一个作用就是用来隐藏和显示元素，传一个 boolean 值。若为 true（默认值），则显示；否则隐藏，且隐藏后不会占据页面的空间（与 `display:none` 类似）。

## 显示 show()

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

## 隐藏 hide() 

用法与 `show()` 类似，隐藏后不会占据原来的位置，类似 `display:none`。

## 淡入 fadeIn()

它也是显示元素，但是它是淡入（有透明效果），参数和 `show()` 相同。

## 淡出 fadeOut()
  
元素消失后也不会占据原来的位置。

## 控制高度 slideDown()

增大元素的高度至原先的高度，也是显示的效果。

## 控制高度 slideUp()

减少元素的高度至 0，也是消失的效果。
