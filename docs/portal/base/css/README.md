# 常用

## 浮动

使用 `float` 时，该元素（或其父元素）必须有 `width` 属性。 

## title 属性

每个 HTML 标签都有此属性，当鼠标移动到标签上时，就会显示 `title` 设置的文本。

## 样式的继承

在 CSS 中，祖先元素的样式可以被其后代元素继承。

```html
<p>
  p标签的文字
  <span>p标签里面的span</span>
</p>
<span>p标签外面的span</span>
```

```css
p {
  font-size: 20px;
}
```

所以，我们可以利用继承，将一些基本的样式设置给其祖先元素。但是，并不是所有的样式都会被继承（比如与背景、边框、定位相关的样式等）。

:::tip 提示
有关继承的更多信息，请见 [w3cschool](https://www.w3school.com.cn/cssref/index.asp)。
:::

## 选择器的优先级

1. `!important` 的优先级最高
2. 内联样式（即直接使用 `style` 属性）的优先级最高，权重为 `1000`
3. id 选择器的权重为 `100`
4. 类（即 `class`）、属性选择器和伪类的权重为 `10`
5. 标签选择器的权重为 `1`
6. `*`、子选择器（`>`）和相邻同胞选择器（`+`）的权重为 `0`
7. 继承的样式没有优先级（即最低）

上面提到的前两点需要谨慎使用。

同时存在多个选择器时，需要将其相加，然后再比较。但是，选择器的权重相加时不会超过其最大的数量级（如 `1000` 个伪类相加，最后还是比一个 `id` 的权重小）。即无论多少个 `class` 组成的选择器，都没有一个 `ID` 选择器权重高。类似的，无论多少个元素组成的选择器，都没有一个 `class` 选择器权重高；无论多少个 `ID` 组成的选择器，都没有行内样式权重高。如果优先级相同，则后面的会覆盖前面的。

:::tip 提示  
CSS 的权重是 256 进制！
:::

## 长度单位

- `px`  

  1 个 `px` 就相当于屏幕中的一个小点，我们的屏幕实际就是由这些小点构成的。1 px 在不同显示器上的效果可能不同，分辨率越高，则 1 px 表示的像素越小。

- `%`  
  
  根据其父元素的宽高来设置样式。

- `em`  
  
  它是根据**当前元素**（支持继承来的字体大小）的**字体大小**来计算的，`1em = 1font-size`，设置字体相关的样式时，会经常使用 `em`。大部分浏览器默认字体大小为 16px。

- `rem`  

  `rem` 和 `em` 类似，也是相对单位。`rem` 的参照物是根元素 HTML 标签的 `font-size`，因此，如果改变 `<html>` 标签的`font-size` 值，那么所有使用的 `rem` 单位大小都会随着改变，适用于移动端。（不支持 IE8 以下）

- `v` 系单位  

  v 系单位常用于移动端，是基于浏览器用来显示内容的区域大小，也就是视窗大小来就算的。具体分为 4 个：

  - `vw`: 基于视窗的宽度计算，`1vw` 等于视窗宽度的百分之一
  - `vh`: 基于视窗的高度计算，`1vh` 等于视窗高度的百分之一
  - `vmin`: 基于 `vw` 和 `vh` 中最小值来计算，`1vmin` 等于最小值的百分之一
  - `vmax`: 基于 `vw` 和 `vh` 中最大值来计算，`1vmax` 等于最大值的百分之一
  
- 单位运算  

  CSS 中可以使用 `calc()` 来通过计算确定一个属性的值。例如：

  ```css
  width: calc( 100% - 80px );
  ```

  :::warning 注意
  `calc()` 中运算符前后**必须**要有空格，否则无效。
  :::

## 颜色

- 十六进制  
  
  当它为 8 位时，最后两位表示不透明度。当它为 6 位时，前两位表示红色，后面依次表示绿色和蓝色。

- `rgba`  

  其中的 `a` 表示不透明度，取值为 `[0，1]`，1 表示不透明，0 表示完全透明。

- `hsl`  

  依次为色相（`[0, 360]`）、饱和度（`[0%, 100%]`）、亮度（`[0%, 100%]`）。

  ```css
  body {
    background: hsl(166, 30%, 60%);
  }
  ```

  :::tip 提示
  同理也有 `hsla`，但是一般不使用这种方式来设置颜色。
  :::

## 常用颜色

|色值|描述|
|---|---|
|#FF6600|<span style="color: #ff6600">小米黄</span>|
|#F1393A|<span style="color: #f1393a">小米红</span>|
|#83C44E|<span style="color: #83c44e">小米绿</span>|
|#FF0000|<span style="color: #ff0000">京东红 1</span>|
|#E1251B|<span style="color: #e1251b">京东红 2</span>|
|#EE2222|<span style="color: #ee2222">京东红 3</span>|
|#C81623|<span style="color: #c81623">京东红 4</span>|
|#E2231A|<span style="color: #e2231a">京东红 5</span>|
|#FF4400|<span style="color: #ff4400">淘宝黄 1</span>|
|#FF5000|<span style="color: #ff5000">淘宝黄 2</span>|
|#FF6F06|<span style="color: #ff6f06">淘宝黄 3</span>|
|#FF4001|<span style="color: #ff4001">淘宝黄 4</span>|
|#FF5B20|<span style="color: #ff5b20">淘宝黄 5</span>|
|#FF4700|<span style="color: #ff4700">淘宝黄 6</span>|
|#F22E00|<span style="color: #f22e00">淘宝黄 7</span>|
|#6C6C6C|<span style="color: #6c6c6c">灰色 1</span>|
|#F5F5F5|<span style="color: #f5f5f5">灰色 2</span>|
|#E7E7E7|<span style="color: #e7e7e7">灰色 3</span>|
|#F3F5F7|<span style="color: #F3F5F7">灰色 4</span>|
|#33BB44|<span style="color: #33bb44">绿色 1</span>|
|#76C61D|<span style="color: #76c616">绿色 2</span>|
|#4CAF50|<span style="color: #4caf50">绿色 3</span>|
|#8AC007|<span style="color: #8ac007">绿色 4</span>|
|#5CB85C|<span style="color: #5cb85c">绿色 5</span>|
|#42B983|<span style="color: #42B983">绿色 6</span>|
|#3EAF7C|<span style="color: #3EAF7C">绿色 7</span>|
|#008CBA|<span style="color: #008cba">蓝色 1</span>|
|#5BC0DE|<span style="color: #5bc0de">蓝色 2</span>|
|#337AB7|<span style="color: #337ab7">蓝色 3</span>|
|#7C61DD|<span style="color: #7c61dd">紫色 1</span>|
|#CDBFE3|<span style="color: #cdbfe3">紫色 2</span>|
|#6F5499|<span style="color: #6f5499">紫色 3</span>|
|#F44336|<span style="color: #f44336">红色 1</span>|
|#b20b13|<span style="color: #B20B13">红色 2</span>|
|#E9686B|<span style="color: #e9686b">红色 3</span>|
|#CE4844|<span style="color: #ce4844">红色 4</span>|
|#C7254E|<span style="color: #c7254e">红色 5</span>|
|#F9F2F4|<span style="color: #f9f2f4">红色 6</span>|
|#D9534F|<span style="color: #d9534f">红色 7</span>|
|#CC0000|<span style="color: #CC0000">红色 8</span>|
|#990000|<span style="color: #990000">红色 9</span>|
|#FFE6E6|<span style="color: #ffe6e6">红色 10</span>|
|#555555|<span style="color: #555555">黑色 1</span>|
|#F05D4E|<span style="color: #f05d4e">黄色 1</span>|
|#E7C000|<span style="color: #E7C000">黄色 2</span>|
|#B29400|<span style="color: #B29400">黄色 3</span>|

:::tip 小技巧
浏览器中查看 hover 样式：<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
:::

## 文本样式

|属性|描述|取值|
|---|---|---|
|`text-transform`|控制文本的大小写。|**none**：默认。定义带有小写字母和大写字母的标准的文本。<br>**capitalize**：文本中的每个单词以大写字母开头。<br>**uppercase**：定义仅有大写字母。<br>**lowercase**：定义无大写字母，仅有小写字母。<br>**inherit**：规定应该从父元素继承 text-transform 属性的值。|
|`text-decoration`|规定添加到文本的装饰效果。|**none**：默认。定义标准的文本。<br>**underline**：定义文本下的一条线。<br>**overline**：定义文本上的一条线。<br>**line-through**：	定义穿过文本下的一条线。<br>**blink**：定义闪烁的文本。<br>**inherit**：规定应该从父元素继承 `text-decoration` 属性的值。|
|`letter-spacing`|设置字符间距。|**normal**：默认。规定字符间没有额外的空间。<br>**length**：	定义字符间的固定空间（允许使用负值）。<br>**inherit**：规定应该从父元素继承 `letter-spacing` 属性的值。|
|`text-indent`|规定文本块首行的缩进。建议使用 em 为单位|

- 文字省略效果
  
  ```html
  <p style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">网易有道词典最好用的翻译词典. 专业权威，海量例句，收录最新词汇</p>
  ```

:::tip 提示
更多信息请见 [MDN](https://www.w3school.com.cn/cssref/index.asp#text)。
:::

## 盒子模型

:::tip 参考
[w3cschool](https://www.w3school.com.cn/css/css_boxmodel.asp)
:::

## `margin` 塌陷

```html
<div style="border: 1px solid #000; margin-top: 50px; width: 20px;height: 20px;">

</div>
<div class="d1" style="background-color: #ff6600; margin-bottom: 50px; width: 60px;height: 60px;">
  <div class="d2" style="background-color: #ee2222; margin-top: 50px; width: 20px;height: 20px;"></div>
</div>
```

上面的代码会给 `class="d1"` 的增加 `margin-top: 50px;`，因为它和它里面的子元素是挨着的。如果不想这样，那么请将它和它的子元素之间留点间隙（如给他们添加边框、填充其它内容、给父元素设置 `padding` 等）。当然，也可以给父元素设置 `display:table`。也能通过伪元素来实现：

```css
.d1::before {
  content: "";
  /*只能是table*/
  display: table;
}
```

**推荐使用伪元素的方式，该方式也能用来清理浮动，一举两得！**

:::tip 提示
垂直方向的 `margin` 也有高度塌陷问题。如果相邻的两个元素的 `margin` 都是正值，则取最大的；如果一正一负，则取两者的和；两个都是负数时，取绝对值较大的。
:::

## 浏览器的默认样式

- `body`  

  自带 `padding` 和 `margin`。

- `p`  

  自带 `margin`。

- `ul` 等列表  

  自带 `padding` 和 `margin`。

## 行内元素的样式问题

1. 行内元素默认不能设置宽高
2. 行内元素可以设置水平的 `padding`
3. 行内元素可以设置垂直的 `padding`，但是它不会对页面的布局产生影响
4. 行内元素可以设置边框，但是垂直方向的边框不会影响布局
5. 行内元素可以设置水平方向的 `margin`，但是不能设置垂直方向的 `margin`

但是，可以将行内变成块元素或行内块元素来设置这些属性。

## display

规定元素应该生成的框的类型，参考 [w3cschool](https://www.w3school.com.cn/cssref/pr_class_display.asp)。

- **inline-block**  

  将元素变为行级块元素，但是这样会使元素具有文本的某些特征。因此，会导致元素见出现间隙。解决方式如下：

  - 方式一  

    给父元素设置 `font-size: 0px`。

  - 方式二  

    去掉标签见的空格和回车（不推荐此方式）。

    ```html
    <ul id="imglist">
      <li>1</li
      ><li>1</li
      ><li>1</li
      ><li>1</li
      ><li>1</li>
    </ul>
    ```

  - 方式三  

    设置 `margin` 为负值来进行调整（不推荐）。

  - 方式四  

    使用 `float` 来代替。


## visibility

规定元素是否可见。

|值|描述|
|---|---|
|`visible`|默认，元素是可见的。|
|`hidden`	|元素是不可见的。|
|`collapse`|当在表格元素中使用时，此值可删除一行或一列，但是它不会影响表格的布局。被行或列占据的空间会留给其他内容使用。如果此值被用在其他的元素上，会呈现为 "hidden"。|
|`inherit`|规定应该从父元素继承 `visibility` 属性的值。|

:::warning 注意
即使不可见的元素也会占据页面上的空，请使用 `display` 属性来创建不占据页面空间的不可见元素。
:::

## 文档流

文档流处在网页的最底层，它表示的是页面中的一个位置，我们所创建的元素默认都是处在文档流中。元素在文档流中的特点如下：

- 块元素  

  独占一行，自上而下排列。默认宽度是父元素的 100%，默认高度是由内容撑开。

- 行内元素  

  只占自身的大小，从左到右排列，宽高由内容撑开。

给块元素设置浮动或定位后，它会脱离文档流，且脱离文档流后，它的宽高由内容撑开（变成 `inline-block` 或 `block`）。

## z-index

设置元素的层级（z 轴方向），它的值可正可负。值越大，层级越高。必须配合 **position** 属性使用。父元素的层级再高也不会覆盖其子元素。

## opacity

设置元素的透明度，取值范围 `[0, 1]`。0 表示完全透明，1 表示不透明。若为元素设置了 `opacity` 属性，则该标签中的所有内容都有透明效果。IE8 不支持 `opacity`，请使用 `filter` 代替, 该属性需要一个 `[0, 100]` 的值。

```css
.ele {
  filter: alpha(opacity=50);
}
```

## 轮廓（outline）

它与边框类似，但是又有不同。它不会改变元素的可见大小，不会影响页面的布局。

## 阴影（box-shadow）

`box-shadow` 属性用于在元素的框架上添加阴影效果，该属性可设置的值包括 X 轴偏移、Y 轴偏移、阴影模糊半径、阴影扩散半径和阴影颜色，并以多个逗号分隔。

`box-shadow` 以由逗号分隔的列表来描述一个或多个阴影效果，该属性可以让几乎所有元素的边框产生阴影。如果元素同时设置了 `border-radius`，那么阴影也会有圆角效果。

:::tip 提示
更多请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)。
:::
