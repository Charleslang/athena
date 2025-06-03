# 选择器

## 交集选择器   

```css
/* 是 p 标签，同时它的 class 属性有 s1 */
/* 对于 id 来讲，不建议使用此方式，因为 id 是唯一的 */
p.s1 {
  /* ... */
}
```
```css
/* class 同时拥有 a1 和 s1 */
.a1.s1 {
  /* ... */
}
```

## 伪类选择器

就拿 `a` 标签来说，它常用的伪类有 `link`、`active`、`visited` 和 `hover` 等，当然其它元素也有 `active` 和 `hover` 等。但是 IE6 中可能某些不支持。

- `:visited`  

  设置用户点击后样式，它关系到用户的隐私问题，所以，该伪类中只能设置字体的颜色。

:::warning 注意
`a` 标签的伪类在使用时，有顺序要求，依次为: `link` -> `visisted` -> `hover` -> `active`
:::

- `:focus`  

  获取焦点时，通常用于文本框中

- `::selection`  

  注意，它有两个冒号。设置文本被选中时的样式，如背景色、字体颜色等。

  ```css
  p::selection {
    background: #ff6600;
  }
  ```

## 伪元素选择器

- `::first-letter`  

  选择文字的第一个字符，只能用于块元素（如 `p` 标签），此伪元素的权重很高。  

  ```css
  p::first-letter {
    color: #83c44e;
  }
  ```

- `::first-line`  

  选择元素的第一行，只能用于块元素（如 `p` 标签），不会覆盖 `::first-letter`。  

  ```css
  p::first-line {
    color: #ee2222;
  }
  ```

- `::before`

  ```css
  p::before {
    content: "前面";
    color: #008cba;
  }
  ```

- `::after`
  
  ```css
  p::after {
    content: "后面";
    color: #7c61dd;
  }
  ```

## 属性选择器

为所有含有 `title` 属性的 `p` 标签设置颜色：

```html
<p>这是一段文字</p>
<p title="title">这是一段文字</p>
<p>这是一段文字</p>
```
```css
p[title] {
  color: #cccccc;
}
```

为所有 `title="title"`的 `p` 标签设置颜色：

```html
<p title="title">这是一段文字</p>
<p title="title1">这是一段文字</p>
<p>这是一段文字</p>
```
```css
p[title="title"] {
  color: #cccccc;
}
```

为所有含有 `title` 属性，且 `title` 的值以 `"title"` 开头的 `p` 标签设置颜色：

```html
<p title="title">这是一段文字</p>
<p title="title1">这是一段文字</p>
<p>这是一段文字</p>
```
```css
p[title^="title"] {
  color: #cccccc;
}
```

为所有含有 `title` 属性，且 `title` 的值以 `"c"` 结尾的 `p` 标签设置颜色：

```html
<p title="titlec">这是一段文字</p>
<p title="title1">这是一段文字</p>
<p>这是一段文字</p>
```
```css
p[title$="title"] {
  color: #cccccc;
}
```

为所有含有 `title` 属性，且 `title` 的值包含 `"c"` 的 `p` 标签设置颜色：

```html
<p title="titlec">这是一段文字</p>
<p title="title1">这是一段文字</p>
<p>这是一段文字</p>
```
```css
p[title*="title"] {
  color: #cccccc;
}
```

## 子元素选择器

- `:first-child`  

  选择第一个**直接相邻**的子元素。如下，选择的是第一个 **p** 标签和 `div` 里面的第一个 `p` 标签。注意，选择的是 `p` 标签本身，不是它里面的第一个子元素。

  ```html
  <!-- 如果加上这个 span，则只有 div 里面的第一个 p 才会生效 -->
  <!-- <span>123<span> -->
  <p>
    <span>span1</span>
    <span>span2</span>
    <span>span3</span>
    <span>span4</span>
    <span>span5</span>
    <span>span6</span>
  </p>
  <p>这是一段文字</p>
  <div>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
  </div>
  ```

  ```css
  p:first-child {
    color: #ff6600;
  }
  /*与下面的等价
  body p:first-child {
    color: #ff6600;
  }*/
  ```

  如果写成 `*:first-child`，就表示选择的 `body` 里面的第一个元素。

- `:last-child`  
  
  与 `:first-child` 原理相同。

- `:nth-child()`  
  
  第几个元素。

  ```css
  p:nth-child(2）{
    color: #ff6600;
  }
  ```

  上面的代码中，会给**所有**元素内的第二个 `p` 标签设置颜色。当然，它可以传递两个特殊值 `even`（偶数位）和 `odd`（奇数位），也可以使用 `2n` 代替 `even`、`2n-1` 代替 `odd`。

- `:first-of-type`  
  
  选择第一个元素。

  ```html
  <!-- 如果加上这个 span，则它下面的第一个 p 也会生效 -->
  <span>123<span>
  <p>
    <span>span1</span>
    <span>span2</span>
    <span>span3</span>
    <span>span4</span>
    <span>span5</span>
    <span>span6</span>
  </p>
  <p>这是一段文字</p>
  <div>
    <p>p1</p>
    <p>p2</p>
    <p>p3</p>
  </div>
  ```
  ```css
  p:first-of-type {
    color: #ff6600;
  }
  ```

- `:last-of-type`

- `:nth-of-type()`

:::tip 提示  
注意区分 `:first-of-type` 和 `:first-child`。前者只在同类型的子元素中找，而后者会在整个子元素中找。其它几个 -of-type 和 child 的区别也是这样。
:::

## 兄弟元素选择器

- `+`  

  下面的例子会选中 `id = "d1"` 的 `p` 标签。

  ```html
  <p></p>
  <span></span>
  <p id="d1"></p>
  <p></p>
  <p></p>
  ```
  ```css
  span + p {
      
  }
  ```

- `~`  

  下面的例子会选中所有 `class = "c1"` 的 `p` 标签。

  ```html
  <p class="c2"></p>
  <span></span>
  <p class="c1">
      <p class="c2"></p>
  </p>
  <p class="c1"></p>
  <p class="c1"></p>
  ```
  ```css
  span ~ p {
      
  }
  ```

## 否定伪类选择器
  
下面，我们要为所有的 `p` 标签设置背景色，但是需要排除 `class = "c1"` 的。使用伪类 `:not()` 来实现，里面要传入一个选择器。

```html
<p></p>
<p></p>
<p class="c1"></p>
```
```css
p:not(.c1) {
  color: #ff6600;
}
```
