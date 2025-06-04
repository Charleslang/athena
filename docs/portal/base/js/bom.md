# BOM

BOM（Browser Object Model）即浏览器对象模型，可以通过 JS 来操作浏览器。  

BOM 提供了一组对象来完成对浏览器的操作，如下：

1. Window  

  代表了整个浏览器的窗口，同时也是网页中的全局对象。

2. Navigator  

  代表了当前浏览器的信息，通过该对象可以识别不同浏览器。

3. Location  

  代表当前浏览器的地址栏信息，通过该对象可以获取地址栏信息或者跳转页面。

4. Screen  

  通过该对象可以获取到用户屏幕的当前信息或者显示器的相关信息。

5. History  

  代表浏览器的历史记录，可以通过该对象操作浏览器的历史记录。由于隐私的原因，该对象不能获取到具体的历史信息；只能操作浏览器向前或向后翻页，该操作只在当次访问时有效。  

这些对象全都是作为 Window 对象的属性保存的，可以通过 Window 对象来使用，也可以直接使用。

```js
window.onload = function() {
  console.log(window);
  console.log(navigator);
  console.log(location);
};
```

:::tip 提示
Window 的属性请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_window.asp)。
:::

## Navigator

### 对象属性

- `appName`  

  返回浏览器的名称。但是，除了 IE11 以外，其它浏览器都会返回 Netscape。

- `userAgent`  

  返回由客户机发送服务器的 user-agent 头部的值，通常使用这种方式来判断浏览器信息。userAgent 等价于浏览器，该属性中包含了浏览器的相关信息，不同浏览器的该属性不同。

  ```js
  // IE11 中已经无法通过此方式来检查是否是 IE 了
  if (/chrome/i.test(navigator.userAgent)) {
    console.log('我是chrome');
  } else if (/firefox/i.test(navigator.userAgent)) {
    console.log('我是firefox');
  } else if (/msie/i.test(navigator.userAgent)) {
    console.log('我是ie10及以下');
  }
  ```

  :::tip 说明

  如果通过此方式不能判断浏览器类别，那么还有其它方法，其基本方法就是找到浏览器中特有的对象。比如 IE 的 ActiveXObject 对象。

  ```js
  if (window.ActiveXObject) {
    console.log('IE');
  } else {
      console.log('不是 IE');
  }
  ```

  但是在 IE11 中，window.ActiveXObject 会被转换成 false。但魔高一尺道高一丈，我们可以使用 `in` 来判断 window 对象中是否有 ActiveXObject 这个属性。如下：

  ```js
  if (`ActiveXObject` in window) {
    console.log('IE');
  } else {
    console.log('不是 IE');
  }
  ```

  Navigator 对象属性请见 [w3cschool](https://www.w3school.com.cn/jsref/dom_obj_navigator.asp)。
  :::

### History

|属性|描述|
|---|---|
|`length`|返回浏览器历史列表中的 URL 数量。|

|方法|描述|
|---|---|
|`back()`|加载 history 列表中的前一个 URL。|
|`forward()`|加载 history 列表中的下一个 URL。|
|`go()`|加载 history 列表中的某个具体页面。|

## Location

|属性|描述|
|---|---|
|`hash`|设置或返回从井号 (#) 开始的 URL（锚）。|
|`host`|设置或返回主机名和当前 URL 的端口号。|
|`hostname`|设置或返回当前 URL 的主机名。|
|`href`|设置或返回完整的 URL。|
|`pathname`|设置或返回当前 URL 的路径部分。|
|`port`|设置或返回当前 URL 的端口号。|
|`protocol`|设置或返回当前 URL 的协议。|
|`search`|设置或返回从问号 (?) 开始的 URL（查询部分）。|

|方法|描述|
|---|---|
|`assign()`|加载新的文档。|
|`reload()`|重新加载当前文档（即刷新）。|
|`replace()`|用新的文档替换当前文档。|

```js
var btn = document.getElementById('btn');
btn.onclick = function() {
// 绝对路径
// location = 'http://www.baidu.com';
// 相对路径
location = 'historydemo02.html';
};
```

:::tip 提示
修改 location 会生成历史记录（history）。
:::

```js
btn.onclick = function() {
  location.assign('http://www.baidu.com');
};
```

:::tip 提示
`assign()` 方法和以上方式类似，也会生成历史记录（history）。
:::

- reload()  

  刷新操作，但由于浏览器的缓存原因，可能会保留用户已经输入的数据（如 input 框），这时可以使用 `Ctrl`+`F5` 强制清空缓存刷新。也可以通过编码的方式，在该函数中传入一个参数 true。

  ```js
  location.reload(true);
  ```

- replace()  

  与 `assign()` 类似，但是此方式不能生成历史记录（history）。
  