# 定时器

|方法|描述|
|---|---|
|`setInterval()`|按照指定的周期（以毫秒计）来调用函数或计算表达式。返回值是 Number 类型，用来作为该定时器的唯一标识。|
|`setTimeout()`|在指定的毫秒数后调用函数或计算表达式，也可以称为延时。|
|`clearInterval()`|取消由 `setInterval()` 设置的 timeout。该方法可以接收任意值，甚至是 null 和 undefined 等。如果参数无效，则什么都不执行。|
|`clearTimeout()`|取消由 `setTimeout()` 方法设置的 timeout。|

:::warning 注意

以上这些都是 window 对象的方法，**使用时有必要为定时器加锁。**

**setInterval() 和 setTimeout() 的区别：**    

`setInterval()` 执行多次，而 `setTimeout()` 只执行一次。  

**setInterval() 和 setTimeout() 的关系：**  

两者可以相互代替。即 `setInterval()` 可以实现 `setTimeout()` 的功能；反之，`setTimeout()` 也能实现 `setInterval()` 的功能。
:::

## 显示时间  

```js
setInterval(function() {
    h1.innerHTML = new Date().toLocaleString();
}, 1000);

setTimeout(function() {
    clearInterval(timer);
}, 10000);
```

## 显示数字

```js
var timer = setInterval(function() {
    h1.innerHTML = count++;
    if (count == 10) {
        clearInterval(timer);
        console.log('清除');
    }
}, 1000);
```

## 图片切换

```html
<div id="container">
    <button id="btn">开始播放图片</button>
    <button id="btn02">停止播放图片</button>
    <img src="imgs/P22.jpg" alt="" class="picture">
</div>
```
```css
body {
    margin: 0;
    padding: 0;
}

#container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
}

.picture {
    width: 90%; 
}
```
```js
window.onload = function() {
    var img = document.querySelector('.picture');
    var btn = document.getElementById('btn');
    var btn02 = document.getElementById('btn02');
    var map = ['imgs/P22.jpg','imgs/P26.jpg','imgs/P30.jpg','imgs/P31.jpg','imgs/P5.jpg'];
    var index = 0;
    var timer = null;
    // 给 setInterVal 增加锁
    var flag = false;
    btn.onclick = function() {
        // 加锁方式二, 在每次执行之前, 关闭上一次的定时器
        // 该方式只适用于同一个 timer 对象
        // clearInterval(timer);

        if (!flag) {
        timer = setInterval(function() {
            var length = map.length;
            img.src = map[index++ % length];
            flag = true;
        }, 1000);
        console.log('播放');
        }
    };
    btn02.onclick = function() {
        if (timer) {
        clearInterval(timer);
        timer = null;
        flag = false;
        }
    };
};
```
  
## 移动 div  

主要是利用定时器来解决使用 onkeydown 事件带来的第一次和第二次之间的延迟。

```js
window.onload = function () {
  // 移动 div
  var div1 = document.getElementById('div1');
  var speed = 10;
  var keyboard = '';
  // 使用定时器来控制速度
  setInterval(function() {
    // 向上移动
    if (keyboard == 'ArrowUp' || keyboard.toUpperCase() == 'W') {
      if (div1.offsetTop <= 0) {
        speed = 0;
      } else {
        speed = 10;
      }
      div1.style.top = div1.offsetTop - speed + 'px';
    }
    // 向下移动
    if (keyboard == 'ArrowDown' || keyboard.toUpperCase() == 'S') {
      if (div1.offsetTop >= window.innerHeight - div1.clientHeight) {
        speed = 0;
      } else {
        speed = 10;
      }
      div1.style.top = div1.offsetTop + speed + 'px';
    }
    // 向左移动
    if (keyboard == 'ArrowLeft' || keyboard.toUpperCase() == 'A') {
      if (div1.offsetLeft <= 0) {
        speed = 0;
      } else {
        speed = 10;
      }
      div1.style.left = div1.offsetLeft - speed + 'px';
    }
    // 向右移动
    if (keyboard == 'ArrowRight' || keyboard.toUpperCase() == 'D') {
      if (div1.offsetLeft >= window.innerWidth - div1.clientWidth) {
        speed = 0;
      } else {
        speed = 5;
      }
      div1.style.left = div1.offsetLeft + speed + 'px';
    }
  }, 100);
  
  // 只控制方向
  document.onkeydown = function(e) {
    e = e || window.event;
    keyboard = e.key;
  };
  // 当松开鼠标时, 不移动。不加这个事件就类似贪吃蛇
  document.onkeyup = function() {
    keyboard = '';
  };
};
```

## 控制 Div 移动  

点击按钮，然后让 div 移动。

```html
<button id="btn01">向右移动</button>
<button id="btn02">向左移动</button>
<div id="box1"></div>
```
```js
var timer;
function getStyle(obj,styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(obj,null)[styleName];
  } else {
      // 如果该属性没有被指定值, 有可能会返回auto
    return obj.currentStyle[styleName];
  }
}
function move(obj, speed, direction, limit) {
  direction = direction || 'right';
  clearInterval(timer);
  if (direction.toLowerCase() == 'left') {
    speed = -speed;
  }
  timer = setInterval(function() {
    var oldValue = parseInt(getStyle(obj,'left'));
    var newValue = oldValue + speed;
    if ((direction == 'left' && newValue < limit) || (direction == 'right' && newValue > limit)) {
      newValue = limit;
    }
    obj.style.left = newValue + 'px';
    if (newValue === limit) {
      clearInterval(timer);
    }
  }, 100);
}
window.onload = function() {
  // 点击按钮, div 向右移动
  var btn01 = document.getElementById('btn01');
  var btn02 = document.getElementById('btn02');
  var box1 = document.getElementById('box1');
  btn01.onclick = function() {
    move(box1,20,'',800);
  }
  btn02.onclick = function() {
    move(box1,20,'left',0);
  }
  // 控制向右移动
  // btn01.onclick = function() {
  //   clearInterval(timer);
  //   timer = setInterval(function() {
  //     var oldValue = parseInt(getStyle(box1,'left'));
  //      if (oldValue + box1.clientWidth >= window.innerWidth || oldValue < 0) {
  //       speedRight = -speedRight;
  //     }
  //     box1.style.left = oldValue + speedRight + 'px';
       
  //   }, 100);
  // };
};
```

:::tip 提示

当有两个元素同时使用上面的函数移动时，只会运行后点击的，因为两个使用了同一个全局变量 timer 对象。如何解决这个问题呢？其实非常简单，只需要为对象添加一个 timer 属性即可。

```js
function move(obj, speed, direction, limit) {
    direction = direction || 'right';
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        // ...
        clearInterval(obj.timer);
    }, 100);
}
```
:::

## 动画  

封装一个函数，实现多种动画效果。

```html
<button id="btn06">动画</button>
<div id="box1"></div>
<div id="box2"></div>
```
```css
body {
  margin: 0;
  padding: 0;
}
#box1{
  position: absolute;
  left: 0;
  width: 150px;
  height: 150px;
  background-color: burlywood;
}
#box2 {
  position: absolute;
  left: 0;
  top: 200px;
  width: 150px;
  height: 150px;
  background-color: cornflowerblue;
}
```
```js
function getStyle(obj,styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(obj,null)[styleName];
  } else {
    // 如果该属性没有被指定值, 有可能会返回 auto
    return obj.currentStyle[styleName];
  }
}
// obj 要操作的对象
// attr 要修改的样式的属性
// speed 改变的速度（大于0）
// limit 限制（最高或最低）
// callback 样式修改完成后的回调函数
function move(obj, attr, speed, limitValue, callback) {
  clearInterval(obj.timer);
  var currentValue = parseInt(getStyle(obj,attr));
  if (currentValue > limitValue) {
    speed = -speed;
  }
  obj.timer = setInterval(function() {
    var oldValue = parseInt(getStyle(obj,attr));
    var newValue = oldValue + speed;
    if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
      newValue = limitValue;
    }
    obj.style[attr] = newValue + 'px';
    if (newValue === limitValue) {
      clearInterval(obj.timer);
      callback && callback();
    }
  }, 200);
}
window.onload = function() {
  var btn06 = document.getElementById('btn06');
  var box1 = document.getElementById('box1');
  var box2 = document.getElementById('box2');
  btn06.onclick = function() {
    move(box2,'width',50,800,function() {
      move(box2,'height',50,300,function() {
        move(box2,'top',30,100,function() {
          move(box2,'width',30,100);
        });
      });
    });
  };
};
```

## 轮播图  

```html
<div id="container">
  <ul id="imglist">
      <li><img src="imgs/P5.jpg" alt=""></li>
      <li><img src="imgs/P22.jpg" alt=""></li>
      <li><img src="imgs/P26.jpg" alt=""></li>
      <li><img src="imgs/P30.jpg" alt=""></li>
      <li><img src="imgs/P31.jpg" alt=""></li>
      <!-- 最后一张设置成和第一张相同 -->
      <li><img src="imgs/P5.jpg" alt=""></li>
  </ul>
  <!-- 创建导航按钮 -->
  <div id="nav">
      <a href="javascript:;"></a>
      <a href="javascript:;"></a>
      <a href="javascript:;"></a>
      <a href="javascript:;"></a>
      <a href="javascript:;"></a>
  </div>
</div>
```
```css
body, ul, li {
  margin: 0;
  padding: 0;
}

#container {
  width: 620px;
  height: 350px;
  margin: 100px auto 0 auto;
  background: #ccc;
  padding: 10px;
  position: relative;
  overflow: hidden;
  /* 取消因li设置display: inline-block带来的间隙 */
  font-size: 0;
}

/* 父元素必须设置宽度才能使用display: inline-block */
ul {
  /* width: 3000px; */
  position: absolute;
  left: 10px;
  list-style: none;
  /* transition: left 1.5s ease; */
}

ul > li {
  list-style: none;
  display: inline-block;
  margin: 0 10px;
  overflow: hidden;
  /* float: left; */
}

ul > li > img {
  width: 600px;
  height: 350px;
  /* 使每张图片都自己缩放, 并且不影响画质 */
  background-size: cover;
}

#nav {
  position: absolute;
  bottom: 20px;
  /* left: 50%;
  IE8 不支持 transform
  transform: translateX(-50%); */
  z-index: 10;
}

#nav a {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: pink;
  margin: 0 5px;
  /* IE8 不支持直接写 */
  opacity: 0.5;
  /* 使 IE8 兼容opacity */
  filter: alpha(opacity=50);
}

#nav a:hover {
  background-color: #ccc;
}
```
```js
function getStyle(obj,styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(obj,null)[styleName];
  } else {
    // 如果该属性没有被指定值, 有可能会返回 auto
    return obj.currentStyle[styleName];
  }
}

// 设置移动动画
function move(obj, attr, speed, limitValue, callback) {
  clearInterval(obj.timer);
  var currentValue = parseInt(getStyle(obj,attr));
  if (currentValue > limitValue) {
    speed = -speed;
  }
  obj.timer = setInterval(function() {
    var oldValue = parseInt(getStyle(obj,attr));
    var newValue = oldValue + speed;
    if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
      newValue = limitValue;
    }
    obj.style[attr] = newValue + 'px';
    if (newValue === limitValue) {
      clearInterval(obj.timer);
      callback && callback();
    }
  }, 50);
}

window.onload = function() {
  var timer;
  /* 父元素必须设置宽度才能使用 display: inline-block */
  var ul = document.getElementById('imglist');
  var lis = ul.getElementsByTagName('li');
  var as = document.getElementsByTagName('a');
  // 记录当前循环的图片次数, 当前的 a 标签索引
  var index = 0;
  // 设置 ul 的宽度
  ul.style.width = 620 * lis.length + 'px';
  // 将第一个 a 标签设置为选中
  as[index].style.backgroundColor = "#ccc";
  // 设置导航的 div 居中
  var nav = document.getElementById('nav');
  var container = document.getElementById('container');
  nav.style.left = (container.offsetWidth - nav.offsetWidth) / 2 + 'px';
  // 点击第 n 个 a 标签, 显示第 n 个图片
  for (var i = 0; i < as.length; i++) {
    // 为每个超链接添加它的索引
    // 这样就不用第二次循环了, 直接取 this.index 即可。
    as[i].index = i;
    as[i].onclick = function() {
      // 点击时, 关闭定时器
      clearInterval(timer);
      // 把 this.index 赋值给全局的 index
      index = this.index;
      // 切换图片
      // ul.style.left = -620 * index + 10 + 'px';
      // 使用move函数来切换图片
      move(ul,'left',100,-620*index + 10,function() {
        // 动画执行完毕后, 开启定时器
        autoChange();
      });
      setBgdColor();
      // for (var j = 0; j < as.length; j++) {
      //     console.log('xunhuan');
      //     if (as[j] === this) {
      //         as[j].style.backgroundColor = "#ccc";
      //         ul.style.left = -620 * j + 10 + 'px';
      //     } else {
      //         as[j].style.backgroundColor = "pink";
      //     }
      // }
    };
  }

  // 开启自动切换
  autoChange();
  // 设置被选中的 a 的背景
  function setBgdColor() {
    // 判断当前索引是否是最后一张图片
    if (index >= lis.length - 1) {
      // 将 a 标签切换为第一个
      index = 0;
      // 将 ul 的最后一张图片切换成第一张
      ul.style.left = '10px';
    }
    for (var i = 0; i < as.length; i++) {
      // 直接设置成为 pink 的话, 在第一次点击后, hover 会失效
      // as[i].style.backgroundColor = 'pink';
      // 为了时hover不失效, 设置为空, 会使用样式表中的样式
      // 在样式表中, 我们设置成了 pink
      as[i].style.backgroundColor = '';
    }
    as[index].style.backgroundColor = '#ccc';
  }

  // 自动切换图片
  function autoChange() {
    timer = setInterval(function() {
      index++;
      // 防止 index 越界
      index %= lis.length;
      // 更改 a 标签背景, 此行要放在前面
      // 或者放在回调函数中
      // setBgdColor();
      // 切换图片
      move(ul,'left',100,-620 * index + 10,function() {
        // 更改 a 标签背景, 放在回调函数中
        setBgdColor();
      });
        
    }, 3000);
  }
};
```

## 二级菜单  

```html
<div id="container">
  <div class="item">
    <span class="item-theme">员工管理</span>
    <a href="#" class="item-tool">添加员工</a>
    <a href="#" class="item-tool">修改员工</a>
    <a href="#" class="item-tool">查询员工</a>
    <a href="#" class="item-tool">删除员工</a>
    <a href="#" class="item-tool">拉黑员工</a>
  </div>
  <div class="item collapse">
    <span class="item-theme">权限管理</span>
    <a href="#" class="item-tool">添加权限</a>
    <a href="#" class="item-tool">删除权限</a>
    <a href="#" class="item-tool">权限控制</a>
  </div>
  <div class="item collapse">
    <span class="item-theme">关于我们</span>
    <a href="#" class="item-tool">支持我们</a>
    <a href="#" class="item-tool">加入我们</a>
    <a href="#" class="item-tool">赞助我们</a>
  </div>
</div>
```
```css
* {
  margin: 0;
  padding: 0;
}

#container {
  width: 152px;
  border-radius: 5px 5px 0 0;
  text-align: center;
  overflow: hidden;
  margin: 0 auto;
}

.item {
  overflow: hidden;
  min-height: 28px;
}

.item .item-theme {
  display: block;
  background-color: #20222A;
  color: #fff;
  width: 150px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border: 1px solid #20222A;
  /* border-radius: 5px 5px 0 0; */
  border-top: 1px solid rgb(83, 83, 83);
  cursor: pointer;
}

.item .item-tool {
  display: block;
  width: 150px;
  padding: 5px 0;
  text-align: center;
  font-size: 14px;
  text-decoration: none;
  color: #959698;
  background-color: #16181d;
  border-bottom: 1px solid #333;
}

.item .item-tool:last-child {
  border: none;
}

.item .item-tool:hover {
  color: #fff;
  background-color: #009688;
}

.collapse {
  height: 28px;
}
```
```js
// 定义函数, 用来向元素中添加指定的 class 值
// obj 要添加 class 的元素
// values 要添加的 class 值
function addClass(obj, values) {
  if (Array.isArray(values)) {
    for (var i = 0; i < values.length; i++) {
      if (!hasClassName(obj, values[i])) {
        obj.className += ' ' + values[i];
      }
    }
  }
}
// 判断元素是否有某个 class 值
function hasClassName(obj, value) {
  var reg = new RegExp("\\b" + value + "\\b");
  return reg.test(obj.className);
  // 此处不能使用 indexOf()
  // return obj.className.indexOf(value) >= 0? true:false;
}
// 删除某个元素的 class 值
function removeClass(obj, value) {
  if (hasClassName(obj,value)) {
    var reg = new RegExp("\\b" + value + "\\b");
    obj.className = obj.className.replace(reg, "");
  }
}
// 切换一个类, 如果元素中有该 className, 则删除; 否则, 添加
function toggleClassName(obj, value) {
  if (hasClassName(obj,value)) {
      removeClass(obj,value);
  } else {
    var arr = [];
    arr.push(value);
    addClass(obj,arr);
  }
}
function getStyle(obj,styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(obj,null)[styleName];
  } else {
    // 如果该属性没有被指定值, 有可能会返回 auto
    return obj.currentStyle[styleName];
  }
}
// 设置移动动画
function move(obj, attr, speed, limitValue, callback) {
  clearInterval(obj.timer);
  var currentValue = parseInt(getStyle(obj,attr));
  if (currentValue > limitValue) {
    speed = -speed;
  }
  obj.timer = setInterval(function() {
    var oldValue = parseInt(getStyle(obj,attr));
    var newValue = oldValue + speed;
    if ((speed > 0 && newValue > limitValue) || (speed < 0 && newValue < limitValue)) {
        newValue = limitValue;
    }
    obj.style[attr] = newValue + 'px';
    if (newValue === limitValue) {
        clearInterval(obj.timer);
        callback && callback();
    }
  }, 50);
}

window.onload = function() {
  var spans = document.querySelectorAll('.item-theme');
  var items = document.querySelectorAll('.item');
  // 保存当前打开的 div
  var openDiv = spans[0].parentElement;
  for (var i = 0; i < spans.length; i++) {
      spans[i].onclick = function() {
        // 关闭上次打开的 div
        // for (var j = 0; j < items.length; j++) {
        //     if (!hasClassName(items[j], 'collapse') ) {
        //         addClass(items[j], ['collapse']);
        //     }
        // }
        // 获取父元素
        var parentEle = this.parentElement;
        toggleMenu(parentEle);
        // 判断 openDiv 和 this.parentElement 是否是同一个对象
        if (openDiv != parentEle) {
          // 关闭上次打开的 div
          // addClass(openDiv,['collapse']);
          // 为了方便处理动画, 这里使用 toggleClassName() 方法
          // 判断是否存在 collapse
          if (!hasClassName(openDiv,'collapse')) {
            // toggleClassName(openDiv,'collapse');
            toggleMenu(openDiv);
          }
        }
        // 保存上次打开的 div
        openDiv = parentEle;
      };
    }
    // 用来切换菜单折叠和显示
    function toggleMenu(obj) {
      // 切换之前, 获取父元素的高度
      var begin = obj.offsetHeight;
      toggleClassName(obj, 'collapse');
      // 切换之后, 获取父元素的高度
      var end = obj.offsetHeight;
      // console.log(begin+"    "+end);
      // 将元素的高度重置为 begin
      obj.style.height = begin + 'px';
      // 执行动画
      move(obj,'height',30,end,function() {
        // 动画执行完成后, 删除内联样式
        obj.style.height = '';
      });
    }
};
```

## 延迟性

定时器真的能按时准确执行吗？来看以下代码：

```js
var start = Date.now()

console.log('开始')

setTimeout(function() {
  console.log('执行', Date.now() - start)
}, 200)

console.log('结束')

for (var i = 0; i < 1000000; i++) {
    // 模拟一些耗时操作
    alert('模拟耗时操作');
    // 这里的 alert 会阻塞主线程
}
```

可以看见，它并不是在 200ms 立即执行的，有一定延迟。是因为它的回调函数在主线程中执行。alert 函数会中断计时器的计时，它暂停的是主线程。
