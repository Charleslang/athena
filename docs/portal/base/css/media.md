# 媒体查询

当我们为页面添加响应式布局时，就可以使用媒体查询。它是 CSS3 中的一个特性，使用关键字 `@media`。


## 语法

在 CSS 使用 `@media{}`，它有几个媒体类型（即所使用的设备）可选值：

- **all**  

  应用于所有设备。

- **print**  

  适用于打印设备。

- **screen**  

  适用于带屏幕的设备。

- **speech**  

  适用于屏幕阅读器。


```css
@media all,print,screen {
  body {
    background-color: #f60;
  }
}
```

`only` 主要是用来兼容老版本的浏览器，默认就有 only。

```css
@media only screen {
  body {
    background-color: #f60;
  }
}
```

## 媒体特性

```css
/* 当视口宽度为 500px 时 */
@media (width:500px) {
  body {
    background-color: #f60;
  }
}
/* 视口最大宽度为 800px (小于等于800px) 时 */
@media (max-width:800px) {
  body {
    background-color: pink;
  }
}

/* 视口最小宽度为 800px (大于等于800px) 时 */
@media (min-width:800px) {
  body {
    background-color: greenyellow;
  }
}
```

当网页在某个点发生页面布局上的变化时，我们称这个点为断点。一般常用网页的断点有 768px、992px、1200px。

```css
/* 屏幕视口在 768px 和 992px 之间 */
@media only screen and (min-width:768px) and (max-width:992px) {
  body {
    background-color: greenyellow;
  }
}
```

也可以加上 `not` 来表示非。

```css
/* 屏幕视口不在 768px 和 992px 之间 */
@media not screen and (min-width:768px) and (max-width:992px) {
  body {
    background-color: greenyellow;
  }
}
```
