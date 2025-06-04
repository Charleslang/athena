# DOM API

DOM（Document Object Model）是文档对象模型，JavaScript 通过 DOM 来操作网页文档。

DOM API 是一组用于操作 HTML 和 XML 文档的接口，它允许开发者通过 JavaScript 访问和修改文档的结构、样式和内容。

## 基本概念

|概念|说明|
|---|---|
|节点|即 Node，它是构成 HTML 文档最基本的单元。|
|文档节点|即 Document，它是整个 HTML 文档（网页），也是 HTML 文档的根节点。|
|元素节点|HTML 文档中的 HTML 标签。|
|属性节点|元素的属性。|
|文本节点|HTML 标签中的文本内容。|

## 节点属性

|节点（node）|nodeName|nodeType|nodeValue|
|---|---|---|---|
|文档节点|#document|9|null|
|元素节点|标签名|1|null|
|属性节点|属性名|2|属性值|
|文本节点|#text|3|文本内容|

:::tip 说明
每个节点都有 nodeName、nodeType、nodeValue 这 3 个属性。浏览器已经提供了文档节点（document），它是 window 的属性，可以在页面中直接使用。
:::

```js
console.log(p.nodeName);
```

## 浏览器加载顺序

浏览器时按照从上自下加载 HTML 文档，每读取到一行就会加载。如果 JS 代码写在元素加载之前，则要等到页面加载完成后再加载 JS，即延迟加载。我们可以为网页添加 onload 事件：

```js
window.onload = function() {
  // ...
};
```

:::tip 提示
我们推荐将 JS 代码写在 `<body></body>` 标签里面。
:::

## 元素节点

### 获取节点

通过 document 对象调用以下方法：

- getElementById()
- getElementsByClassName()
- getElementsByTagName()

### 获取子节点

- **getElementsByTagName()**  

  ```html
  <button id="btn">查看container的子节点</button>
  <div id="container">
    <h3>h3</h3>
    <div>
      <p>div > p</p>
      <nav>div>nav</nav>
    </div>
  </div>
  ```
  ```js
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子p标签
      var h3s = con.getElementsByTagName('p');
      console.log(h3s.length);
      for (var i = 0; i < h3s.length; i++) {
        console.log(h3s[i]);
      }
    };
  };
  ```

- **通过属性获取子节点**  

  可以使用 childNodes、children（获取的是子元素，不是子节点）、firstChild、lastChild 等方法。

  ```html
  <button id="btn">查看 container 的子节点</button>
  <div id="container">
    <h3>h3</h3>
    <div>
      <p>div > p</p>
      <nav>div>nav</nav>
    </div>
  </div>
  ```
  ```js
  // childNodes
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子节点
      var children = con.childNodes;
      console.log(children.length);// 5
      for (var i = 0; i < children.length; i++) {
        console.log(children[i]);
      }
    };
  };
  ```
  ```js
  // children
  window.onload = function() {
    var con = document.getElementById('container');
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      // console.log(this);
      // 获取所有子元素
      var children = con.children;
      console.log(children.length); // 2
      for (var i = 0; i < children.length; i++) {
        console.log(children[i]);
      }
    };
  };
  ```
  ```js
  console.log(con.firstChild); // #text
  console.log(con.lastChild); // #text
  console.log(con.firstElementChild); // 第一个子元素
  console.log(con.lastElementChild); // 最后一个子元素
  ```

  :::tip 关于 childNodes 的说明
  该属性会获取标签所有的子标签，包括文本标签。在代码中的回车（此时的回车不使用 &lt;br&gt;，而直接使用键盘的 Enter 键）和空格等也会被获取成文本节点。但是，在 IE8 中不会。推荐使用 children 属性获取。
  :::

  :::tip 获取第一个和最后一个
  firstChild 和 lastChild 获取的是节点，firstElementChild 和 lastElementChild 获取的是元素。但是后者在 IE8 及以下中不被支持，因此不推荐使用后者。
  :::

- **parentNode 获取父节点**  

  ```js
  console.log("父节点: "+p.parentNode.innerHTML);
  console.log("父节点: "+p.parentElement.inerText);
  ```

- **获取兄弟节点**  
  
  可以使用 previousSibling（前一个）、nextSibling（后一个）等相关方法。

  ```js
  console.log("前一个兄弟节点: "+p.previousSibling);
  console.log(p.previousElementSibling); // 获取元素, IE8 不支持
  console.log("后一个兄弟节点: "+p.nextSibling);
  console.log(p.nextElementSibling); // 获取元素, IE8 不支持
  ```

    :::tip 关于节点和元素的说明
    节点不一定是 HTML 标签，节点包括我们自己敲的空格和回车（不使用标签）等。而我们写的每一个标签才是一个元素，我们写的文本内容都是一个文本节点。
    :::

- **文本节点**  

  获取标签中的文本值。我们可以使用 innerText、innerHTML，也可以通过节点来获取。

  ```html
  <h3>我是h3标签</h3>
  ```
  ```js
  var h3 = document.getElementById('h3');
  console.log(h3.innerText);
  console.log(h3.innerHTML);
  console.log(h3.firstChild.nodeValue);
  console.log(h3.lastChild.nodeValue);
  ```

- **获取body标签**  

  ```js
  var body = document.getElementsByTagName('body')[0];
  var body = document.body;
  ```

- **获取根标签 `<html></html>`**

  ```js
  console.log(document.documentElement);
  ```

- **获取所有标签元素**  

  该方法返回一个类数组，但是使用 typeof 却返回 undefined，可能是一个设计的 bug。

  ```js
  var all = document.all;
  console.log(all);
  // 等价写法如下
  console.log(document.getElementsByTagName('*'));
  ```

- **getElementsByClassName()**  

  该方法在 IE9 以下不被支持，但可以使用 `querySelector()` 或 `querySelectorAll()` 代替。

- **getElementsByName()**  

  该方法与 `getElementById()` 方法相似，但是它查询元素的 `name` 属性，而不是 `id` 属性。另外，因为一个文档中的 `name` 属性可能不唯一（如 HTML 表单中的单选按钮通常具有相同的 `name` 属性），所以 `getElementsByName()` 方法返回的是元素的数组，而不是一个元素。

- **getElementById()**  

  只有该方法才能级联获取 DOM，如下：

  ```js
  var div = document.getElementById('div').getElementsByTagName('div')[0];
  console.log(div);
  ```

- **querySelector()**  

  该方法可用于获取级联标签, 类似 CSS 中的选择器。返回值是唯一的，如果满足条件的有多个，那么只会返回第一个。

  ```js
  var a = document.querySelector('.div');
  var a = document.querySelector('#div+div');
  var a = document.querySelector('#div div');
  var a = document.querySelector('#div>div');
  console.log(a);
  ```

- **querySelectorAll()**  

  与 `querySelector()` 不同，返回值是类数组。

  ```js
  var b = document.querySelectorAll('#div div');
  console.log(b);
  ```

### 添加和创建节点

|方法|描述|
|---|---|
|`appendChild()`|向指定节点内的末尾添加一个节点，并返回添加的节点。|
|`createAttribute()`|创建属性节点。|
|`createElement()`|创建元素节点，并返回该元素节点。|
|`createTextNode()`|创建文本节点，并返回文本节点。|
|`insertBefore()`|在指定的子节点前面插入新的子节点，该方法需要被父节点调用。|
|`replaceChild()`|替换子节点，该方法由父节点调用|

HTML 页面如下：

```html
<button id="btn01">添加节点appendChild</button>
<button id="btn02">添加节点insertBefore</button>
<button id="btn03">替换节点replaceChild</button>
<button id="btn04">删除节点removeChild</button>
<div id="div1">
  <p id="p1">p
    <span>span</span>
  </p>
  <h1></h1>
  <ul>
    <li>li1</li>
    <li>li2</li>
    <li>li3</li>
  </ul>
</div>
```

- **appendChild 示例**

  ```js
  function myClick(id,fun) {
    var ele = document.getElementById(id);
    ele.onclick = fun;
  }
  window.onload = function() {
    // 在 div 下面添加一个 div 标签
    // 该方法对其它标签不会有影响
    myClick('btn01',function() {
      var div1 = document.getElementById('div1');
      var div2 = document.createElement('div');
      var text = document.createTextNode('div2啊');
      // div2.innerText = '我是div2';
      div2.appendChild(text);
      var div2 = div1.appendChild(div2);
      console.log(div2);
    });
    
    // 等价代码如下
    // 但是, 这种方法会将原来标签中的所有标签先删除, 然后再添加, 如果某些标签绑定了事件, 那么事件会消失, 所以需慎用。
    myClick('btn01',function() {
      var div1 = document.getElementById('div1');
      div1.innerHTML += '<p>ppp</p>';
    });
  };
  ```

- **insertBefore 示例**

  ```js
  // 在 id 为 p1 的元素节点之前插入新的元素节点
  myClick('btn02',function() {
    var p =document.getElementById('p1');
    var p2 = document.createElement('p');
    var div1 = document.getElementById('div1');
    p2.innerText = '我是p2啊';
    // p.parentElement.insertBefore(p2,p);
    p.parentNode.insertBefore(p2,p);
  });
  ```

- **replaceChild 示例**

  ```js
  // 使用 p 替换 span
  myClick('btn03',function() {
    var p2 = document.createElement('p');
    var span = document.querySelectorAll('.span')[0];
    p2.innerText = 'p2替换';
    span.parentNode.replaceChild(p2,span);
  });
  ```

### 修改节点

|方法|描述|
|---|---|
|`appendChild()`|把新的子节点添加到指定节点。|


### 删除节点

|方法|描述|
|---|---|
|`removeChild()`|删除子节点，该方法由父节点调用|
|`remove()`|删除子节点，该方法由子节点自身调用|

HTML 页面如下：

```html
<button id="btn01">添加节点appendChild</button>
<button id="btn02">添加节点insertBefore</button>
<button id="btn03">替换节点replaceChild</button>
<button id="btn04">删除节点removeChild</button>
<div id="div1">
  <p id="p1">p
    <span>span</span>
  </p>
  <h1></h1>
  <ul>
    <li>li1</li>
    <li>li2</li>
    <li>li3</li>
  </ul>
</div>
```

- **removeChild()**

  ```js
  // 删除某个节点
  // myClick 是我自定义的事件函数
  myClick('btn04',function() {
    var p = document.getElementById('p1');
    p.parentNode.removeChild(p);
  });
  ```

- **remove()**

  ```js
  // myClick 是我自定义的事件函数
  // 当点击时, 删除当前被点击的元素节点。
  myClick('btn04',function() {
    this.remove();
  });
  ```

:::tip 说明
凡是 DOM 的方法中涉及到子节点操作的，该方法大部分都是由该子节点的父节点调用。
:::

## 操作 CSS

### 修改和设置样式

基本语法为 `元素.style.属性 = XXX`。但是请注意，如果样式名中含有 “-”，则对应的 JS 中属性为驼骆峰形式。

```js
// 修改 div 的宽度
container.style.width = '100px';
// 修改颜色
container.style.backgroundColor ='#888888';
```
:::tip 提示
通过 JS 来修改的样式，都是将其设置为内联样式（即直接添加在标签上），其优先级最高。如果在选择器（即写在 css 文件中或 style 标签中）中设置了 `!important`，那么通过 JS 修改的样式不会生效。
:::

### 获取 CSS 样式

获取样式也可以使用 `元素.style.属性`，这种方式获取的值会带上单位（如 px）。但是，此方式只能读取 **内联样式**。  

也可以通过某些特定的属性来获取，如 `container.clientWidth`，这种方式获取的属性没有单位。此方式可以读取通过选择器设置的样式。  

IE 浏览器可以通过 `元素.currentStyle.xxx` 来获取样式，类似通过 style 来获取，但只有 IE 才支持，且该方式 **只读**。

另外，还可以通过 window 对象的 `getComputedStyle()` 来获取。该方法的第一个参数是要获取样式的元素，第二个参数是一个伪元素（一般写为 null 就行），然后返回一个对象。该方法获取的样式会带单位。如果没有给元素设置宽度等，则会获取当前窗口的宽度等。该方式 **只读**，且 **IE8 不支持**。

```js
// 获取宽度
var container = document.getElementById('container');
var obj = getComputedStyle(container,null);
console.log(obj.width);
```

以上方式有时不兼容 IE8，那么，我们可以自定义一个函数来兼容。如下：

```js
// 兼容 IE8
// element 要获取样式的元素
// styleName 要获取的样式名(注意某些要使用驼峰)
function getStyle(element, styleName) {
  if (window.getComputedStyle) {
    return getComputedStyle(element,null)[styleName];
  }
  return element.currentStyle[styleName];
}
```

### 常见属性和方法

以下的返回值大都不带单位，而且是只读的。

|属性/方法|描述|
|---|---|
|`element.clientHeight`|返回元素的可见高度。（包括 padding 等）|
|`element.clientWidth`|返回元素的可见宽度。|
|`element.offsetHeight`|返回元素的高度。（包括边框、padding 等）|
|`element.offsetWidth`|返回元素的宽度。|
|`element.offsetParent`|返回元素的偏移容器。即最近的定位（position）父元素（默认是 body）。|
|`element.offsetLeft`|返回元素的水平偏移位置。即相对于父元素的 left（包括 padding）|
|`element.offsetTop`|返回元素的垂直偏移位置。即相对于父元素的 top|
|`element.scrollHeight`|返回元素的整体高度。大致等于子元素的高度。|
|`element.scrollLeft`|返回元素左边缘与视图之间的距离。|
|`element.scrollTop`|返回元素上边缘与视图之间的距离。|
|`element.scrollWidth`|返回元素的整体宽度。大致等于子元素的宽度。|

:::details 小贴士
可以通过下面的方法判断垂直滚动条是否到最底：

```js  
element.scrollHeight - element.scrollTop = element.clientHeight
```

可以通过下面的方法判断水平滚动条是否到最右边：

```js
element.scrollWidth - element.scrollLeft = element.clientWidth
```

上面两个方法可用于判断用户是否已读注册协议等。
:::

**模拟注册协议 (用户把协议阅读完成后, 才能点击按钮)：**  

```html
<div id="container">
  <div id="xieyi">
    <h3>注册协议</h3>
    <div id="xieyi-text">
      注册协议 * 100
    </div>
  </div>
  <input type="checkbox" id="zhuce" disabled="true">我已仔细阅读
  <input type="submit" id="submit" value="注册" disabled="true">
</div>
```
```css
#container {
  margin: 150px auto 0 atuo;
}
#xieyi {
  width: 200px;
  height: 300px;
  background-color: plum;
  overflow: auto;
}
#xieyi-text {
  width: 200px;
  height: 300px;
  background-color: bisque;
}
```
```js
window.onload = function() {
  var xieyi = document.getElementById('xieyi');
  var zhuce = document.getElementById('zhuce');
  var submit = document.getElementById('submit');
  // 滚动条滚动时触发
  xieyi.onscroll = function() {
    if (Math.ceil(xieyi.scrollHeight - xieyi.scrollTop) == xieyi.clientHeight) {
      zhuce.disabled = false;
      submit.disabled = false;
    }
  };
};
```

### 操作类名

先来看下面的代码：

```html
<button id="btn1">点击按钮后修改div的样式</button>
<br><br>
<div id="div1" class="div1"></div>
```
```css
.div1 {
  width: 200px;
  height: 200px;
  background: tan;
}
.div2 {
  width: 100px;
  /* height: 100px; */
  background: pink;
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

window.onload = function() {
  var btn1 = document.getElementById('btn1');
  var div1 = document.getElementById('div1');
  btn1.onclick = function() {
    // 修改大小
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.backgroundColor = 'pink';
    // 但是, 这样会导致 div 的 class 没有了 div1, 需要改进
    // div1.className = 'div2';
    // 注意字符串前面有空格
    // div1.className += " div2";
    addClass(div1,['div1','div2','div3']);
    toggleClassName(div1,'div6');
  };
};
```

:::tip 分析
使用 js 来修改 style 时，每修改一个样式，浏览器都需要重新渲染一次页面，性能较差，而且这种方式也不太方便。我们希望一行代码同时修改多个样式，可以修改 div 的 className 来间接修改样式，这样只需修改一次即可，浏览器也只需渲染一次。
:::

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
}

// 删除某个元素的 class 值
function removeClass(obj, value) {
  if (hasClassName(obj,value)) {
    var reg = new RegExp("\\b" + value + "\\b");
    obj.className = obj.className.replace(reg, "");
  }
}

// 切换一个类, 如果元素中有该 className, 则删除; 否则添加
function toggleClassName(obj, value) {
  if (hasClassName(obj,value)) {
    removeClass(obj,value);
  } else {
    var arr = [];
    arr.push(value);
    addClass(obj,arr);
  }
}

window.onload = function() {
  var btn1 = document.getElementById('btn1');
  var div1 = document.getElementById('div1');
  btn1.onclick = function() {
    // 修改大小
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.backgroundColor = 'pink';
    // 但是, 这样会导致 div 的 class 没有了 div1, 需要改进
    // div1.className = 'div2';
    // 注意字符串前面有空格
    // div1.className += " div2";
    addClass(div1,['div1','div2','div3']);
    toggleClassName(div1,'div6');
  };
}
```

:::tip 提示
也可以使用 `setAttribute()` 和 `getAttribute()` 方法，还可以使用 HTML5 提供的 `classList` 属性。classList 属性的用法请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)。
:::

## 事件

### 事件函数封装

如果我们想要为很多元素都绑定相同的事件，那么我们可以自己封装一个函数。

```js
/* 
 * 该函数专门用来为元素添加单击事件
 * eleId 元素ID, 注意要是字符串
 * clickFun 单击触发的函数
 */
function eleClick(eleId, clickFun) {
  var ele = document.getElementById(eleId);
  ele.onclick = clickFun;
}

window.onload = function() {
  eleClick('container',function() {
    console.log("我是container");
  });
};
```

### a 标签的默认行为

`<a></a>` 被点击后，会跳转页面，这是它的默认行为。如果不希望出现默认行为，则可以通过下面的方式取消。

- 方式一

  ```html
  <a href="javascript:;" class="delete">删除</a>
  ```

  :::warning 警告
  如果使用了上面的方式，则直接使用 `delete.onclick=fun();` 会无效，需要在标签中使用 `onclick=fun();`。
  :::

- 方式二  

  在 a 标签的点击事件中返回 false。

  ```html
  <a href="javascript:;" class="delete" onclick="fun()">删除</a>
  ```
  ```js
  function fun() {
    return false;
  }
  ```

### 隐藏参数对象 Event

当事件的响应函数被触发时，浏览器会传递一个事件对象作为实参，该对象中封装了当前事件的一切信息（如鼠标点击、鼠标滚动、键盘按键等）。**但是IE8不支持。**

```js
div.onclick = function(e) {
  // 鼠标的X坐标
  console.log(e.clientX);
}
```

在 IE8 及以下中，是将事件对象作为 window 对象的 `event` 属性保存的。

```js
div.onclick = function() {
  // 鼠标的 X 坐标
  console.log(window.event.clientX);
}
```

但是火狐不兼容，可通过下面的方式解决兼容性：

```js
div.onclick = function(e) {
  // 鼠标的 X 坐标
  var x = window.event ? window.event.clientX : e.clientX;
  
  // 或者
  e = e || window.event;
}
```

### 事件绑定

先来看以下代码：

```html
<td><a href="javascript:;" onclick="deleteRow()">删除</a></td>
```
```js
window.onload = function() {
  function deleteRow() {
    if (window.confirm('确定要删除此行？')) {
      // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }
  }
};
```

:::tip 提示
点击超链接时会报错，错误提示 `deleteRow()` 没有定义。解决办法就是将 `deleteRow()` 在 `script` 标签中声明，而不要在 `window.onload()` 里面声明。
:::

- **this 的指向**  

  ```html
  <td><a href="javascript:;" onclick="deleteRow()">删除</a></td>
  ```
  ```js
  function deleteRow() {
    if (window.confirm('确定要删除此行？')) {
      console.log(this); // window
    }
  }
  ```

- **给按钮绑定多个相同事件**  

  容易想到的做法就是编写多个 `onclick` 事件，但是这样只会使最后一个生效。这时，我们可以使用如下方式，先来看一下：

  ```js
  btn01.addEventListener('click', function() {
    console.log(11);
  }, false);

  btn01.addEventListener('click', function() {
    console.log(22);
  }, false);
  ```

  以上两个函数都会被执行。

:::details 补充

**addEventListener() 参数说明：**  

- 第一个参数是绑定的事件类型，但是请注意，没有 `on`
- 第二个参数就是事件的回调函数
- 第三个参数表示是否在捕获阶段触发事件，需要一个 boolean 值，一般为 false
- 如果绑定了多个相同类型的事件，则依次执行  
- 该方法中 this 是 函数调用者  
- IE8 不支持该方法

IE8中可以使用 `attachEvent()` 方法。只有两个参数，且第一个参数需要 `on`。该方法只支持 IE 浏览器。如果绑定了多个相同类型的事件，则倒序执行。**该方法中 this 是 Window**。

```js
// IE8
btn01.attachEvent('onclick',function() {
  console.log(333);
});
```

**兼容 IE8：**  

```js
// 解决兼容性
// 第一个参数是要调用的对象
// 第二个参数是事件类型（不带 on）
// 第三个参数是回调函数
function bind(obj, eventType, fun) {
  // 非IE8
  if (obj.addEventListener) {
    obj.addEventListener(eventType, fun, false);
  } else {
    // obj.attachEvent('on'+eventType, fun);
    // 解决 this 的指向
    obj.attachEvent('on' + eventType, function() {
      fun.call(obj);
    });
  }
}

window.onload = function() {
  var btn01 = document.getElementById('btn01');

  bind(btn01, 'click', function() {
    console.log(11);
    console.log(this.innerHTML);
  });
};
```
:::

### 复选框事件

实现全选、全不选、反选、提交的功能。

```html
<input type="checkbox" id="select">全选/全不选
<div>
  爱好: 
  <input type="checkbox" value="篮球" class="checkbox">篮球 
  <input type="checkbox" value="足球" class="checkbox">足球 
  <input type="checkbox" value="乒乓球" class="checkbox">乒乓球 
  <input type="checkbox" value="羽毛球" class="checkbox">羽毛球
</div>
<div>
  <button type="button" id="selectAll">全选</button>
  <button type="button" id="selectAllNot">全不选</button>
  <button type="button" id="selectInverse">反选</button>
  <button type="button" id="submitBtn">提交</button>
</div>
```
```js
/* 
 * 该函数专门用来为元素添加单击事件
 * eleId 元素ID
 * clickFun 单击触发的函数
 */
function eleClick(eleId, clickFun) {
  var ele = document.getElementById(eleId);
  ele.onclick = clickFun;
}

window.onload = function() {
  // 所有的可选复选框
  var checkboxs = document.getElementsByClassName('checkbox');
  // 全选复选框
  var select = document.getElementById('select');
  // 全选
  eleClick('selectAll', function() {
    for (var i = 0; i < checkboxs.length; i++) {
      // if (!checkboxs[i].hasAttribute('checked')) {
          // checkboxs[i].setAttribute('checked','true');
          checkboxs[i].checked = true;
      // }
    }
    // 让全选按钮来调节全选复选框
    select.checked = true;
  });

  // 全不选
  eleClick('selectAllNot', function() {
    for (var i = 0; i < checkboxs.length; i++) {
      // if (checkboxs[i].hasAttribute('checked')) {
      //     //checkboxs[i].setAttribute('checked','false');
      //     //checkboxs[i].removeAttribute('checked');
      //     checkboxs[i].checked = false;
      // }
      if (checkboxs[i].checked == true) {
        checkboxs[i].checked = false;
      }
      // 让全不选按钮来调节全选复选框
      select.checked = false;
    }
  });

  // 反选
  eleClick('selectInverse', function() {
    select.checked = true;
    for (var i = 0; i < checkboxs.length; i++) {
      checkboxs[i].checked = !checkboxs[i].checked;
      // 让反选按钮来调节全选复选框
      if (!checkboxs[i].checked) {
        select.checked = false;
      }
    }
  });

  // 提交
  eleClick('submitBtn',function() {
    for (var i = 0; i < checkboxs.length; i++) {
      if (checkboxs[i].checked) {
        console.log(checkboxs[i].value);
      }
    }
  });

  // 复选框实现全选
  // 当复选框选中, 则全选; 反之, 全不选
  eleClick('select',function() {
    for (var i = 0; i < checkboxs.length; i++) {
      checkboxs[i].checked = this.checked;
    }
  });

  // 如果这几个复选框全都选中, 则让复选框实现全选
  for (var i = 0; i < checkboxs.length; i++) {
    checkboxs[i].onclick = selectAll;
  }

  function selectAll() {
    select.checked = true;
    for (var i = 0; i < checkboxs.length; i++) {
      if (!checkboxs[i].checked) {
        select.checked = false;
        break;
      }
    }
  }
};
```

### 鼠标事件

|属性|描述|
|---|---|
|`onmousemove`|鼠标被移动。|
|`onmouseover`|鼠标移到某元素之上。在子元素上移动时，如果父元素绑定了该事件，则会被触发（即会冒泡）。|
|`onmouseenter`|鼠标移到某元素之上。不会冒泡|
|`onmouseup`|鼠标按键被松开。|
|`onmousedown`|鼠标按钮被按下。|
|`onmouseout`|鼠标从某元素移开。会冒泡|
|`onmouseleave`|鼠标从某元素移开。不会冒泡|

- **获取鼠标位置**  

  当鼠标在某个元素中移动时，获取鼠标当前位置。

  ```html
  <div class="div1" style="height: 100px; width: 300px; border: 1px solid #000; margin-bottom: 20px;"></div>
  <div class="div2" style="padding: 5px; width: 200px; border: 1px solid #000;">
    x: <input type="text" id="input1" size="5"> 
    y: <input type="text" id="input2" size="5">
  </div>
  ```
  ```js
  window.onload = function() {
    var div1 = document.querySelector('.div1');
    var input1 = document.querySelector('#input1');
    var input2 = document.querySelector('#input2');

    // 获取鼠标位置
    div1.onmousemove = function(e) {
      input1.value = e.clientX;
      input2.value = e.clientY;
    };
    
    // 解决兼容性
    div1.onmousemove = function(e) {
      input1.value = window.event? window.event.clientX:e.clientX;
      input2.value = window.event? window.event.clientX:e.clientX;
      
      // 或者
      e = e || window.event;
    };
  };
  ```

  
  注意，此处使用的是 `onmousemove`，它和 `onmouseover` 的区别如下：

  |方法|说明|
  |---|---|
  |onmousemove|鼠标每次在元素内移动都会触发|
  |onmouseover|只有当鼠标从外界移动到元素内才会触发|

- **div 随鼠标移动**  

  ```html
  <div id="div3" style="width: 50px; height: 50px; background: coral;"></div>
  ```
  ```css
  #div3 {
    /* 必须给元素设置定位, 但不一定是绝对定位 */
    position: absolute;
  }
  ```
  ```js
  var div3 = document.getElementById('div3');
  document.onmousemove = function(e) {
    e = e || window.event;
    div3.style.top = e.clientY - div3.clientHeight / 2 + 'px' ;
    div3.style.left = e.clientX - div3.clientWidth / 2 + 'px';
  };
  ```

  :::details 补充
  网页有滚动条时，鼠标不会停留在元素上，元素和鼠标之间的差距就是滚动条已经滚动的高度。因为鼠标的零点一直是相对浏览器的左上角，而元素的零点是相对 document 的左上角。可以通过以下方式来解决：

  ```js
  var div3 = document.getElementById('div3');
  document.onmousemove = function(e) {
    e = e || window.event;
    div3.style.top = e.clientY - div3.clientHeight / 2 + window.scrollY + 'px' ;
    div3.style.left = e.clientX - div3.clientWidth / 2 + window.scrollX + 'px';
    
    // 或者直接使用 pageX 和 pageY
    // 但是 IE8 不支持这两个属性
    div3.style.top = e.pageY - div3.clientHeight / 2 + 'px' ;
    div3.style.left = e.pageX -div3.clientWidth / 2 + 'px';
  };
  ```

  当然，除了以上方式以外，还有其它解决办法。如下：  

  1. 获取 body 标签的 `scrollTop`，但是只有 Chrome 才有效。 
  2. 获取 html 标签的 `scrollTop`，但是只有火狐才有效。可通过 `document.documentElement;` 获取 html 标签。

  其实，上面的事件中就用到了冒泡。
  :::

- **元素拖拽**

  ```html
  <div id="box1"></div>
  <div id="box2"></div>
  ```
  ```css
  #box1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background: coral;
  }

  #box2 {
    position: absolute;
    left: 200px;
    top: 200px;
    width: 200px;
    height: 200px;
    background: cornflowerblue;
  }
  ```
  ```js
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    box.onmousedown = function(e) {
      document.onmousemove = function(e) {
        // 考虑兼容性
        e = e || window.event;
        box.style.top = e.clientY - box.clientHeight / 2 + 'px';
        box.style.left = e.clientX - box.clientWidth / 2 + 'px';
      };
    };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      document.onmouseup = null;
    };
  };
  ```

  此方式缺点是，会有跳动，无论从哪里开始移动，鼠标始终在元素中心。改进如下： 

  ```js
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    box.onmousedown = function(e) {
      // 考虑兼容性
      e = e || window.event;
      // 使元素不跳动
      var restX = e.clientX -  box.offsetLeft;
      var restY = e.clientY - box.offsetTop;
      document.onmousemove = function(e) {
        // 考虑兼容性
        e = e || window.event;
        box.style.top = e.clientY - restY + 'px';
        box.style.left = e.clientX - restX + 'px';
      };
    };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      document.onmouseup = null;
    };
  };
  ```

  但是这种方式依然有缺点。当我们按下键盘的 `Ctrl` + `A` 时，会全选页面，当我们再次拖拽时，所有的元素都会被拖拽。当拖拽网页中的内容时，浏览器会自动取所搜引擎中所搜内容，这时会造成拖拽异常。这是浏览器的默认行为，如果不希望发生，可以取消默认行为。虽然种情况出现的频率不高，但是我们还是要去量解决。解决办法有两种，如下：  

  1. 在 onmousedown 之后返回 false，但是 IE8 不起作用。  
  2. IE 中有一个独有的方法 setCapture()，该方法会将所有元素的鼠标按下事件都捕获到自己身上，即点击任意元素都会触发设置了该方法的元素的鼠标按下事件（点击电脑桌面也会），但是该方法只会被执行一次。在火狐中不报错，在 Chrome 中会报错。

  **解决上述问题：**  

  ```js
  // 拖拽功能
  window.onload = function() {
      var box = document.getElementById('box1');
      box.onmousedown = function(e) {
        // if (box.setCapture) {
        //     box.setCapture();
        // }
        // 等价写法如下
        box.setCapture && box.setCapture();
        // 考虑兼容性
        e = e || window.event;
        // 使元素不跳动
        var restX = e.clientX -  box.offsetLeft;
        var restY = e.clientY - box.offsetTop;
        document.onmousemove = function(e) {
          // 考虑兼容性
          e = e || window.event;
          box.style.top = e.clientY - restY + 'px';
          box.style.left = e.clientX - restX + 'px';
        };
        // 当拖拽网页中的内容时, 浏览器会自动取所搜引擎中所搜内容, 这时会造成拖拽异常。
        // 这是浏览器的默认行为, 如果不希望发生, 则可以取消默认行为。但是 IE8 不起作用。
        return false;
      };
    
    // 注意此处是给 document 绑定
    // 如果在元素上绑定, 那么在其兄弟元素上松开了鼠标, 则还是会移动。
    document.onmouseup = function() {
      // 取消 onmousemove 事件
      document.onmousemove = null;

      // 取消 onmouseup 事件
      // document.onmouseup = null;
      box.releaseCapture && box.releaseCapture();
    };  
  };
  ```

  这种方式的缺点是没有将拖拽封装成函数，导致代码冗余。优化如下：

  ```js
  function drag(ele,fun1,fun2,fun3) {
    ele.onmousedown = function(e) {
      ele.setCapture && ele.setCapture();
      e = e || window.event;
      var restX = e.clientX -  ele.offsetLeft;
      var restY = e.clientY - ele.offsetTop;
      document.onmousemove = function(e) {
        e = e || window.event;
        ele.style.top = e.clientY - restY + 'px';
        ele.style.left = e.clientX - restX + 'px';
      };
      return false;
    };
    
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
      ele.releaseCapture && ele.releaseCapture();
    };  
  }
  // 拖拽功能
  window.onload = function() {
    var box = document.getElementById('box1');
    var box2 = document.getElementById('box2');
    drag(box2);
  };
  ```

### 鼠标滚轮事件

现在，我们要实现一个效果，当鼠标向上滚动时，div 变小；当鼠标向下滚动时，div 变长。

```js
function bind(obj, eventType, fun) {
  // 非 IE8
  if (obj.addEventListener) {
    obj.addEventListener(eventType,fun,false);
  } else {
    // obj.attachEvent('on'+eventType,fun);
    // 解决 this 的指向
    obj.attachEvent('on'+eventType,function() {
      fun.call(obj);
    });
  }
}

window.onload = function() {
  // 当鼠标滚轮向下滚动时, div 变长
  // 当鼠标滚轮向上滚动时, div 变短
  var box = document.getElementById('box1');
  var length = 10;
  // 滚轮事件, 但是火狐不支持 onmousewheel
  // 在火狐中要使用 DOMMouseScroll, 而且需要使用 addEventListene r来绑定
  box.onmousewheel = function(e) {
    e = e || window.event;
    // 获取滚轮滚动的方向 wheelDelta
    // 向上为正, 向下为负
    // 但是火狐不支持 wheelDelta 属性, 火狐中要使用 detail
    // 但是火狐中向上为负, 向下为正
    if (e.wheelDelta > 0 || e.detail < 0) {
      box.style.height = box.clientHeight - length + 'px';
    } else {
      box.style.height = box.clientHeight + length + 'px';
    }

    // 取消火狐的默认行为
    // 但是 IE8 不支持
    e.preventDefault && e.preventDefault();
    // 如果浏览器存在滚动条, 鼠标滚动时会使之滚动, 这是浏览器的默认行为
    // 可以取消, renturn false
    // 但是火狐不支持
    return false;
  };

  // 为火狐绑定
  bind(box,'DOMMouseScroll',box.onmousewheel);
};
```

### 键盘事件

|属性|描述|
|---|---|
|`onkeydown`|某个键盘按键被按下（长按也会触发），但第一次和第二次之间的时间间隔稍长（目的是防止误操作）。|
|`onkeypress`|某个键盘按键被按下并松开（长按）。|
|`onkeyup`|某个键盘按键被松开。|

|Event 的键盘属性|描述|
|---|---|
|`altKey`|返回当事件被触发时，<kbd>ALT</kbd> 是否被按下。|
|`ctrlKey`|返回当事件被触发时，<kbd>CTRL</kbd> 键是否被按下。|
|`metaKey`|返回当事件被触发时，<kbd>meta</kbd> 键是否被按下。|。
|`shiftKey`|返回当事件被触发时，<kbd>SHIFT</kbd> 键是否被按下。|
|`key`|得到所按的键，区分大小写。|
|`code`|得到所按的键，不区分大小写。形如 keyA|
|`keyCode`|得到按键的 ASCII 码。|

:::tip 提示
键盘事件一般绑定给可以获取到焦点的对象或者 document。
:::

- 判断是否同时按下多个键  

  ```js
  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.altKey && e.key.toLowerCase() == 'a') {
      console.log('Alt + ' + e.key.toUpperCase());
    }
  };
  ```

- 阻止 input 框输入  

  其思想就是取消 input 的默认行为，直接 `return false`。

  ```js
  input.onkeydown = function(e) {
    e = e || window.event;
    return false;
  };
  ```

- 限制文本框只能输入数字  

  ```js
  // 用到了取消默认行为的方法
  input1.onkeydown = function(e) {
    e = e || window.event;
    var mkeyCode = e.keyCode;
    if (!(48 <= mkeyCode && mkeyCode <= 57)) {
        return false;
    } else {
      console.log(mkeyCode);
    }
  };
  ```

- 移动 div  

  ```js
  window.onload = function() {
    // 移动 div
    var div1 = document.getElementById('div1');
    var speed = 5;
    document.onkeydown = function(e) {
      // var top = div1.offsetTop;
      // var left = div1.offsetLeft;
      // var right = 
      e = e || window.event;
      var keyboard = e.key;
      // 向上移动
      if (keyboard == 'ArrowUp' || keyboard.toUpperCase() == 'W') {
        if (div1.offsetTop <= 0) {
          div1.style.top = 0;
        } else {
          div1.style.top = div1.offsetTop - speed + 'px';
        }
      }
      // 向下移动
      if (keyboard == 'ArrowDown' || keyboard.toUpperCase() == 'S') {
        if (div1.offsetTop >= window.innerHeight - div1.clientHeight) {
          speed = 0;
        } else {
          speed = 5;
        }
        div1.style.top = div1.offsetTop + speed + 'px';
      }
      // 向左移动
      if (keyboard == 'ArrowLeft' || keyboard.toUpperCase() == 'A') {
        if (div1.offsetLeft <= 0) {
          div1.style.left = 0;
        } else {
          div1.style.left = div1.offsetLeft - speed + 'px';
        }
      }
      // 向右移动
      if (keyboard == 'ArrowRight' || keyboard.toUpperCase()== 'D') {
        if (div1.offsetLeft >= window.innerWidth - div1.clientWidth) {
          speed = 0;
        } else {
          speed = 5;
        }
        div1.style.left = div1.offsetLeft + speed + 'px';
      }
    };
  };
  ```

### 事件冒泡

当后代元素中的某个事件被触发时，其父节点及其祖先节点的**相同**事件都会被触发（如果有的话），这就是冒泡。在日常开发中，大部分冒泡是有用的。如果想要取消冒泡，可以使用下面的方式：

```html
<div id="div1">
  div1
  <p id="p1">p1</p>
</div>
```
```css
#div1 {
  width: 200px;
  height: 200px;
  background: darkorange;
}

#p1 {
  background-color: darkorchid;
}
```
```js
window.onload = function() {
  var div1 = document.getElementById('div1');
  var p1 = document.getElementById('p1');
  var body = document.body;

  p1.onclick = function(e) {
    console.log('我是p标签');
    e = e || window.event;

    // 取消冒泡
    e.cancelBubble = true;
  };

  div1.onclick = function(e) {
    console.log('我是div1');
    e = e || window.event;
    // 取消冒泡
    e.cancelBubble = true;
  };

  body.onclick = function() {
    console.log('我是body');
  };
};
```

### 事件委派

请先看以下代码，我们给每一个超链接都绑定一个事件：

```html
<button id="btn01">添加超链接</button>
<ul>
  <li><a href="javascript:;" id="a1" class="link">超链接1</a></li>
  <li><a href="javascript:;" id="a2" class="link">超链接2</a></li>
  <li><a href="javascript:;" id="a3" class="link">超链接3</a></li>
</ul>
```
```js
window.onload = function() {
  var as = document.getElementsByTagName('a');
  for (var i = 0; i < as.length; i++) {
    as[i].onclick = function() {
      console.log('a');
    };
  }

  var btn01 = document.getElementById('btn01');
  btn01.onclick = function() {
    var li = document.createElement('li');
    li.innerHTML = '<a href="javascript:;" id="a6" class="link">超链接6</a>';
    var ul = document.getElementsByTagName('ul')[0];
    ul.appendChild(li);
  };
};
```

:::warning 引发的问题
1. 为已有的每一个超链接都绑定一个事件，操作比较麻烦。
2. 新增的超链接必须重新再添加一次事件，麻烦而且性能不好。

我们希望只绑定一次事件，所有的元素就可以有了该操作，即使是后添加的。这时，我们就可以使用事件委派。
:::

事件委派的基本思想是，将多个元素需要绑定的事件绑定到其共同的祖先元素中。它利用了冒泡的原理，可以减少事件绑定的次数，提高性能。使用方式如下：

```js
var ul = document.getElementsByTagName('ul')[0];
ul.onclick = function(e) {
// 判断事件由谁触发
// 如果是由a标签触发的, 才进行操作
// if (e.target.className.indexOf('link') > 0)
if (e.target.nodeName == 'A') {
    console.log('a触发');
}
};
```
:::tip 提示
此处用到了 Event 对象的 target 属性，更多请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_event.asp)。
:::

### 事件传播

:::tip 说明

**微软：** 事件是由内向外传播的，先触发当前元素，再向其祖先元素传播，事件应该在冒泡阶段执行。 

**网警公司：** 事件是由外向内传播的，事件应该在捕获阶段执行。  

**w3cschool：** 综合上面两种，将事件的传播分为 3 个阶段。如下：

1. 事件捕获阶段：从最外层（window或document）的祖先元素向目标元素进行事件的捕获，但是默认不会触发事件。
2. 目标阶段：事件捕获到目标元素，捕获结束就开始在目标元素上触发事件。
3. 冒泡阶段：事件从目标元素向其祖先元素传递，依次触发祖先元素的相同事件。  

如果希望在捕获阶段就触发事件，可以将 `addEventListener `的第三个参数设置为 `true`，但一般情况下不用。IE8 及以下的浏览器没有事件的捕获，所以就没第三个参数。
:::

## 表格的 CRUD

```html
<table id="table">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>性别</th>
      <th>操作</th>
    </tr>
  </thead>
  <tr>
    <td>焰灵姬</td>
    <td>20</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
  <tr>
    <td>晓梦</td>
    <td>23</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
  <tr>
    <td>田密</td>
    <td>23</td>
    <td>女</td>
    <td><a href="#" class="delete">删除</a></td>
  </tr>
</table>

<table style="text-align: center;border: 2px solid black;">
  <tr>
    <td>姓名</td>
    <td><input type="text" id="name"></td>
  </tr>
  <tr>
    <td>年龄</td>
    <td><input type="text" id="age"></td>
  </tr>
  <tr>
    <td>性别</td>
    <td><input type="text" id="sex"></td>
  </tr>
  <tr>
    <td colspan="2"><input type="button" value="添加" id="addBtn"></td>
  </tr>
</table>
```
```js
function myClick(id, fun) {
  var ele = document.getElementById(id);
  ele.onclick = fun;
}

window.onload = function() {

  // 给所有 a 标签绑定删除事件
  function deleteA() {
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      deletes[i].onclick = function() {
        var tr = this.parentNode.parentNode;
        // var name = tr.children[0].innerText;
        var name = tr.getElementsByTagName('td')[0].innerText;
        if (window.confirm('确定要删除 \"'+name+'\" 吗？')) {
          tr.remove();
          // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        }
        // 取消 a 标签的默认行为
        return false;
      };
    }
  }

  deleteA();
  
  // 给添加按钮添加事件
  myClick('addBtn', function() {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var sex = document.getElementById('sex').value;
    var table = document.getElementById('table');
    if (name != '' && age != '' && sex != '') {
      var tr = document.createElement('tr');
      var tbody = document.getElementsByTagName('tbody')[0];
      // 注意此处要创建多个对象。
      // 类似 Java

      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var a = document.createElement('a');
      a.className = 'delete';
      a.href = '#';
      a.innerText = '删除';
      td1.innerText = name;
      tr.appendChild(td1);
      td2.innerText = age;
      tr.appendChild(td2);
      td3.innerText = sex;
      tr.appendChild(td3);
      td4.appendChild(a);
      tr.appendChild(td4);
      // 此处不建议放在body里面, 建议放在 table 的 tbody 里面。
      // table.appendChild(tr);
      tbody.appendChild(tr);
        
      // 方式二
      // var htmlValue = '<tr>'
      //                 +'<td>'+name+'</td>'
      //                 +'<td>'+age+'</td>'
      //                 +'<td>'+sex+'</td>'
      //                 +'<td>'+'<a href=\"#\" class=\"delete\">删除</a>'+'</td>'
      //                 +'</tr>';
      // tbody.innerHTML += htmlValue;
      deleteA();
      document.getElementById('name').value = '';
      document.getElementById('age').value = '';
      document.getElementById('sex').value = '';
    } else {
      alert('请填写所有信息');
    }
  });
};
```

- 优化

  ```js
  function myClick(id, fun) {
    var ele = document.getElementById(id);
    ele.onclick = fun;
  }

  function deleteUser() {
    var tr = this.parentNode.parentNode;
    // var name = tr.children[0].innerText;
    var name = tr.getElementsByTagName('td')[0].innerText;
    if (window.confirm('确定要删除 \"'+name+'\" 吗？')) {
      tr.remove();
      // this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }
    // 取消 a 标签的默认行为
    return false;
  }

  window.onload = function() {
      
    // 给所有 a 标签绑定删除事件
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      deletes[i].onclick = deleteUser;
    } 

    // 给添加按钮添加事件
    myClick('addBtn', function() {
      var name = document.getElementById('name').value;
      var age = document.getElementById('age').value;
      var sex = document.getElementById('sex').value;
      var table = document.getElementById('table');
      if (name != '' && age != '' && sex != '') {
        var tr = document.createElement('tr');
        var tbody = document.getElementsByTagName('tbody')[0];

        // 方式三
        tr.innerHTML = '<td>'+name+'</td>'
                        +'<td>'+age+'</td>'
                        +'<td>'+sex+'</td>'
                        +'<td>'
                        +'<a href="#" class="delete">删除</a>'
                        //+'<td>'+'<a href=\"#\" class=\"delete\">删除</a>'+'</td>'
                        +'</td>';
        tr.getElementsByTagName('a')[0].onclick = deleteUser;
        tbody.appendChild(tr);

        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('sex').value = '';
      } else {
        alert('请填写所有信息');
      }
    });
  };
  ```

- 引发的问题
  
  ```js
  window.onload = function() {

    // 给所有 a 标签绑定删除事件
    var deletes = document.querySelectorAll('.delete');
      for (var i = 0; i < deletes.length; i++) {
        deletes[i].onclick = function() {
        console.log(deletes[i] === this); / /false
        // 取消 a 标签的默认行为
        return false;
      };
    }
  };
  ```

  原因是，for 循环在页面加载完成后会立即执行，而点击事件要等到点击时才被执行，当点击函数被执行时，for 循环早已被执行完成。所以，在 onclick 事件中，i 的值已经是数组的长度了。解决办法如下： 
    
  - 使用闭包
    
    ```js
    var deletes = document.querySelectorAll('.delete');
    for (var i = 0; i < deletes.length; i++) {
      (function(i) {
        deletes[i].onclick = function() {
          console.log(deletes[i] === this);
          // 取消 a 标签的默认行为
          return false;
        }
      })(i)
    }
    ```

  - 使用 let
    
    ```js
    for (let i = 0; i < deletes.length; i++) {
        deletes[i].onclick = function() {
        console.log(deletes[i] === this);
        // 取消 a 标签的默认行为
        return false;
      }
    }
    ```

## 翻页切换

```html
<div class="container">
  <h5 id="geci">无何化有 感物知春秋</h5>
  <button id="prev">上翻</button>
  <button id="next">下翻</button>
  <p id="page">
    <span id="currPage"></span> / 
    <span id="totalPage"></span>
  </p>
</div>
```
```js
var prev = document.getElementById('prev');
var next = document.getElementById('next');
var geci = document.getElementById('geci');
var curSpan = document.getElementById('currPage');
var totalPage = document.getElementById('totalPage');
var index = 0;
var texts = [
  "无何化有 感物知春秋",
  "秋毫濡沫欲绸缪 搦管相留",
  "留骨攒峰 留容映水秀",
  "留观四时曾邂逅 佳人西洲",
  "西洲何有 远树平高丘",
  "云闲方外雨不收 稚子牵牛",
  "闹市无声 百态阴晴栩栩侔",
  "藤衣半卷苔衣皱 岁月自无忧",
  "驾马驱车",
  "尚几程扶摇入画中 咫尺",
  "径曲桥横 精诚难通",
  "盼你渡口 待你桥头"
];
curSpan.innerText = 1;
totalPage.innerText = texts.length;
prev.onclick = function() {
  if (index <= 0) {
    index = texts.length - 1;
  } else {
    index--;
  }
  geci.innerText = texts[index];
  curSpan.innerText = index + 1;
};

next.onclick = function() {
  if (index >= texts.length - 1) {
    index = 0;
  } else {
    index++;
  }
  geci.innerText = texts[index];
  curSpan.innerText = index + 1;
};
```

## 获取浏览器窗口大小

|属性|描述|
|---|---|
|`window.innerHeight`|返回窗口的文档显示区的高度。（会动态变化）|
|`window.innerWidth`|返回窗口的文档显示区的宽度。（会动态变化）|

```js
// 浏览器窗口改变时触发
window.onresize = function() {
  console.log("window.innerHeight: "+  window.innerHeight);
  console.log("window.innerWidth: " + window.innerWidth);
  console.log("window.outerHeight: " + window.outerHeight);
  console.log("window.pageXOffset: " + window.pageXOffset);
  console.log("window.pageYOffset: " + window.pageYOffset);
};
```
