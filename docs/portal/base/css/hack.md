# Hack

## 条件Hack

有时候我们只想在某个特定的条件下执行某个特定的代码，这时候就可以使用 CSS 提供的 Hack。Hack 就是指的一段特殊代码，它只在某些特殊的浏览器中使用。条件 Hack 只在 IE 中有效，其它浏览器都会将它解析为注释。但是，只有 IE10 及其以下的浏览器才有效。

```html
<!-- 在 IE10 及以下的浏览器中执行 -->
<!--[if IE]>
  <p>IE 浏览器</p>
<![endif]-->

<!-- 只在 IE6 中执行 -->
<!--[if IE 6]>
  <p>IE 浏览器</p>
<![endif]-->

<!-- 只在 IE9 以下的浏览器中执行 -->
<!--[if lt IE 9]>
  <p>IE 浏览器</p>
<![endif]-->

<!-- 只在 IE9 及以下的浏览器中执行 -->
<!--[if lte IE 9]>
  <p>IE 浏览器</p>
<![endif]-->

<!-- 只在非 IE9 的浏览器中执行 -->
<!--[if ! IE 9]>
  <p>不是 IE9 浏览器</p>
<![endif]-->
```

## 属性 Hack

在 CSS 中使用 Hack。

```css
body {
  /* _ 表示只在 IE6 及以下的有效 */
  _background:"green";
  /* * 表示只在 IE7 及以下的有效 */
  *background:"green";
  /* \9 表示只在 IE6 及以上的有效 */
  background:"green\9";
  /* \0 表示只在 IE8 及以上的有效 */
  background:"green\0";
}
```

::: warning 警告
不到万不得已的地步，尽量不要使用属性 Hack。
:::

## 选择符 Hack

在 CSS 选择器中使用，给选择器前面加上 `* html` 即可。

```css
* html body {
    /* ... */
}
```
