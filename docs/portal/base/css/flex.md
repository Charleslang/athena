# 弹性布局（flex）

flex 也叫弹性盒、伸缩盒，主要用来代替网页中使用浮动所引起的问题（如高度塌陷）。它可以使元素具有弹性，能让元素随着页面大小的改变而改变。

## 弹性容器

要使用 flex 布局，必须先将一个元素设置成弹性容器。可通过 `display` 来设置，有两种方式 `display:flex`（块级）和 `display:inline-flex`（行内块级）。一旦元素被设置成为 **flex 容器**，则其直接子元素会默认排列在一行中。

```css
ul {
  width: 800px;
  border: 2px solid #000;
  margin: 50px auto 0;
  /* 变成块级 (block弹性容器 */
  /* 可以解决因 li 浮动带来的高度塌陷 */
  display: flex;
  flex-direction: column;
}
```

可以给 **容器** 设置 `flex-direction` 来改变其子元素的排列方式，其可选值如下：

- **row**  

  默认值，其子元素会水平排列（从左向右），但是因国家而异。该效果类似 `float:left`。主轴自左向右。

- **row-reverse**  

  自右向左排列，类似 `float:right`。主轴自右向左。

- **column**  

  按列从上至下纵向排列。主轴自上向下。

- **column-reverse**  

  按列从下至上纵向排列。主轴自下向上。  

这里再给出两个概念：

- **主轴**  

  弹性元素的的排列方向就称为主轴。

- **侧（辅）轴**  

  与主轴互相垂直。 



可以通过 `flex-wrap` 来设置子元素是否换行，可取值如下：

- **nowrap**  

  默认值，当子元素超出其父元素大小时，不换行。

- **wrap**  

  元素沿着侧轴方向自动换行。

- **wrap-reverse**  

  元素沿着侧轴换行，只不过换行之后会倒序。


`flex-flow` 属性同时兼顾了 `flex-wrap` 和 `flex-direction`，语法如下：

```css
ul {
  /** 其中的两个值没有顺序要求 */
  flex-flow: flex-wrap flex-direction;
}
```

使用 `justify-content` 来分配 **主轴** 上的**剩余空间**，可选值如下：

- **flex-start**  

  默认值，表示元素沿着主轴的起始边排列。

- **flex-end**  

  表示元素沿着主轴的末尾排列。

- **center**  

  元素在主轴中水平居中排列。

- **space-around**  

  空白在每一个弹性元素元素两侧分配。

- **space-evenly**  

  空白在每一个弹性元素元素两侧平均分配。此值的兼容性不好，使用需慎重。

- **space-between**  

  空白在弹性元素之间平均分配，且容器两侧没有空白。



使用 `align-items` 来调整 **侧轴** 上的布局，可选值如下（以上结论的前提是没有给弹性元素设置高度）：

- **stretch**  

  默认值，将同一行弹性元素的高度设为一致，但是行与行之间的高度会有所不同。

- **flex-start**  

  元素不会拉伸，从侧轴起始边开始布局。

- **flex-end**  

  元素不会拉伸，从着侧轴终边开始布局。

- **cnter**  

  使弹性元素垂直居中对齐。

- **baseline**  

  沿着文字的基线对齐。


使用 `align-content` 来分配 **侧轴** 上的**剩余空间**，可选值如下：

- **flex-start**  

  默认值，表示元素靠着顶部排列。

- **flex-end**  

  表示元素沿着侧轴尾部排列。

- **center**  

  元素在主轴中垂直居中排列，空白在上下两边。

- **space-around**  

  空白在每一个弹性元素元素上下分配。

- **space-evenly**  

  空白在每一个弹性元素元素上下平均分配。此值的兼容性不好，使用需慎重。

- **space-between**  

  空白在弹性元素之间平均分配，且容器上下没有空白。


:::warning 注意
使用 flex 布局时，如果没有给其子元素设置 `flex-shrink`，而且父元素的宽高小于其子元素，那么也不会出现溢出的情况，它的子元素会进行缩放。

**以上所有属性是给 flex 容器设置的，而不是给 flex 元素。**
:::

## 弹性元素

弹性容器中的直接子元素就是弹性（flex）元素。一个元素可以同时是弹性容器和弹性元素（即 flex 可以嵌套）。弹性元素具有伸缩性，可以为弹性元素设置如下属性：

- **flex-grow**  

  用来指定弹性元素的伸展系数，默认值为 0。当父元素有多余空间时，将其设置为 1，可以使它们平均分配父元素的空间，并占满父元素。其值越大，则分配的空间越多 (类似 Android 中的权重) 。注意，此属性分配的是父元素的剩余空间，然后再加上元素本来的大小。

- **flex-shrink**  

  指定弹性元素的缩小性，默认值是 1。伸缩就是指当父元素不足以容纳其子元素时，其子元素会进行缩小; 如果设置为 0，则表示不缩小。其值越大，缩小得越多。

- **align-self**  

  为每个弹性元素单独设置对齐样式，可以覆盖其父元素的设置，取值请参考上面的弹性容器。

- **flex-basis**  

  设置元素在主轴上的基础长度。如果设置为 100px，则其基础长度会变成 100px。如果主轴是水平的，则设置其基础宽度，否则设置其基础高度。默认值是 auto，表示参考元素自身的大小来设置。

- **flex**  

  同时设置 `flex-grow`、`flex-shrink` 和 `flex-basis`。有严格的顺序要求。一些可选值如下：

  **initial**  

  默认值，相当于将属性设置为 `flex: 0 1 auto`。   

  **auto**  

  这相当于将属性设置为 `flex: 1 1 auto`。  

  **none**  

  元素会根据自身宽高来设置尺寸。它是完全非弹性的: 既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为 `flex: 0 0 auto`。

- **order**  

  决定弹性元素的排列顺序，其值越大，元素排列越靠**后**。

:::warning 注意
以上所有属性是给 flex 元素设置的，而不是给 flex 容器。
:::

:::tip 小贴士
移动端尽量使用 flex 来代替浮动；而 PC 端使用需慎重，因为兼容性问题不太好。
:::

## 导航栏 navbar 示例
  
```html
<ul class="nav">
  <li class="item"><a href="">HTML/CSS</a></li>
  <li class="item"><a href="">Browser Side</a></li>
  <li class="item"><a href="">Server Side</a></li>
  <li class="item"><a href="">Programming</a></li>
  <li class="item"><a href="">XML</a></li>
  <li class="item"><a href="">Web Building</a></li>
  <li class="item"><a href="">Reference</a></li>
</ul>
```
```css
* {
  margin: 0;
  padding: 0;
}
ul {
  width: 1210px;
  height: 48px;
  line-height: 48px;
  margin: 50px auto 0;
  list-style: none;
  background-color: #eee;
  display: flex;
}
li {
  flex-grow: 1;
}
a {
  text-decoration: none;
  color: #aaa;
  display: block;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}
a:hover {
  background-color: #636363;
  color: #fff;
}
```
