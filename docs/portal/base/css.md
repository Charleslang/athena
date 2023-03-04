---
sidebar: ['/portal/base/css.md']
---

# CSS

## 居中
使用 `margin: 0 auto;` 时, 该元素必须设置 `width` 属性。

## 浮动
使用 `float` 时, 该元素 (或其父元素) 必须有 `width` 属性。 

## 选择器
### 交集选择器   
```css
/* 是 p 标签, 同时它的 class 属性有 s1 */
/* 对于 id 来讲, 不建议使用此方式, 因为 id 是唯一的 */
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
### 伪类选择器
就拿 `a` 标签来说, 它常用的伪类有 `link`、`active`、`visited` 和 `hover` 等, 当然其它元素也有 `active` 和 `hover` 等。但是 IE6 中可能某些不支持。

- `:visited`  

  设置用户点击后样式, 它关系到用户的隐私问题, 所以, 该伪类中只能设置字体的颜色。

:::warning 注意
`a` 标签的伪类在使用时, 有顺序要求, 依次为: `link` -> `visisted` -> `hover` -> `active`
:::

- `:focus`  

  获取焦点时, 通常用于文本框中

- `::selection`  

  注意, 它有两个冒号。设置文本被选中时的样式, 如背景色、字体颜色等。

  ```css
  p::selection {
    background: #ff6600;
  }
  ```
### 伪元素选择器
- `::first-letter`  

  选择文字的第一个字符, 只能用于块元素 (如 `p` 标签) , 此伪元素的权重很高。
  ```css
  p::first-letter {
    color: #83c44e;
  }
  ```
- `::first-line`  

  选择元素的第一行, 只能用于块元素 (如 `p` 标签) , 不会覆盖 `::first-letter`。
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
### 属性选择器
现在, 我们要实现一个功能, 为所有含有 `title` 属性的 `p` 标签设置颜色。

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
为所有 `title="title"`的 `p` 标签设置颜色。
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
为所有含有 `title` 属性, 且 `title` 的值以 `"title"` 开头的 `p` 标签设置颜色。
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
为所有含有 `title` 属性, 且 `title` 的值以 `"c"` 结尾的 `p` 标签设置颜色。
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
为所有含有 `title` 属性, 且 `title` 的值包含 `"c"` 的 `p` 标签设置颜色。
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
### 子元素选择器
- `:first-child`  

  选择第一个**直接相邻**的子元素。如下, 选择的是第一个 **p** 标签和 `div` 里面的第一个 `p` 标签, 注意, 选择的是 `p` 标签本身, 不是它里面的第一个子元素。
  ```html
  <!-- 如果加上这个 span, 则只有 div 里面的第一个 p 才会生效 -->
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
  如果写成 `*:first-child`, 就表示选择的 `body` 里面的第一个元素。

- `:last-child`  
  
  与 `:first-child` 原理相同。

- `:nth-child( )`  
  
  第几个元素。
  ```css
  p:nth-child(2) {
    color: #ff6600;
  }
  ```
  上面的代码中, 会给**所有**元素内的第二个 `p` 标签设置颜色。当然, 它可以传递两个特殊值 `even` (偶数位) 和 `odd` (奇数位) , 也可以使用 `2n` 代替 `even`, `2n-1` 代替 `odd`。

- `:first-of-type`  
  
  选择第一个元素。
  ```html
  <!-- 如果加上这个 span, 则它下面的第一个 p 也会生效 -->
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
- `:nth-of-type( )`

:::tip 提示
注意区分 `:first-of-type` 和 `:first-child`。前者只在同类型的子元素中找, 而后者会在整个子元素中找。其它几个 -of-type 和 child 的区别也是这样。
:::

### 兄弟元素选择器
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
### 否定伪类选择器
  
下面, 我么要为所有的 `p` 标签设置背景色, 除了 `class = "c1"` 的。使用伪类 `:not()` 来实现, 里面要传入一个选择器。
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
## title 属性

每个标签都有此属性, 当鼠标移动到标签上时, 就会显示 `title` 设置的文本。

## 样式的继承
在 CSS 中, 祖先元素的样式可以被其后代元素继承。
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
所以, 我们可以利用继承, 将一些基本的样式设置给其祖先元素; 但是, 并不是所有的样式都会被继承 (比如与背景、边框、定位相关的样式等) 。

:::tip 提示
有关继承的更多信息, 请见 [w3cschool](https://www.w3school.com.cn/cssref/index.asp)。
:::

## 选择器的优先级
1. `!important` 的优先级最高
2. 内联样式 (即直接使用 `style` 属性) 的优先级最高, 权重为 `1000`
3. id 选择器的权重为 `100`
4. 类 (即 `class` ) 、属性选择器和伪类的权重为 `10`
5. 标签选择器的权重为 `1`
6. `*`、子选择器 (`>`) , 和相邻同胞选择器 (`+`)  的权重为 `0`
7. 继承的样式没有优先级 (即最低) 

同时存在多个选择器时, 需要将其相加, 然后再比较。但是, 选择器的权重相加时不会超过其最大的数量级 (如 `1000` 个伪类相加, 最后还是比一个 `id` 的权重小) 。即无论多少个 `class` 组成的选择器, 都没有一个 `ID` 选择器权重高。类似的, 无论多少个元素组成的选择器, 都没有一个 `class` 选择器权重高、无论多少个 `ID` 组成的选择器, 都没有行内样式权重高。如果优先级相同, 则后面的会覆盖前面的。前面的 1 和 2 需要慎用。

:::tip 提示
**CSS的权重是 256 进制！**
:::

## 长度单位
- `px`  

  1 个 `px` 就相当于屏幕中的一个小点, 我们的屏幕实际就是由这些小点构成的。1 `px` 在不同显示器上的效果可能不同。分辨率越高, 则 1 px 表示的像素越小。

- `%`  
  
  根据其父元素的宽高来设置样式。

- `em`  
  
  它是根据**当前元素** (支持继承来的字体大小) 的**字体大小**来计算的, `1em = 1font-size`, 设置字体相关的样式时, 会经常使用 `em`。大部分浏览器默认字体大小为 16px。

- `rem`  

  `rem` 和 `em` 类似, 也是相对单位。`rem` 的参照物是根元素 HTML 标签的 `font-size`, 因此, 如果改变 `<html>` 标签的`font-size` 值, 那么所有使用的 `rem` 单位大小都会随着改变, 适用于移动端。 (不支持 IE8 以下) 

- `v` 系单位  

  v 系单位常用于移动端, 是基于浏览器用来显示内容的区域大小, 也就是视窗大小来就算的。具体分为4个: 

  - `vw`: 基于视窗的宽度计算, `1vw` 等于视窗宽度的百分之一
  - `vh`: 基于视窗的高度计算, `1vh` 等于视窗高度的百分之一
  - `vmin`: 基于 `vw` 和 `vh` 中最小值来计算, `1vmin` 等于最小值的百分之一
  - `vmax`: 基于 `vw` 和 `vh` 中最大值来计算, `1vmax` 等于最大值的百分之一
  
- 单位运算  

  CSS 中可以使用 `calc()` 来通过计算确定一个属性的值。例如: 
  ```css
  width: calc( 100% - 80px );
  ```

  :::warning 注意
  `calc()` 中运算符前后**必须**要有空格, 否则无效。
  :::

## 颜色
- 十六进制  
  
  当它为 8 位时, 最后两位表示不透明度。当它为 6 位时, 前两位表示红色, 后面依次表示绿色和蓝色。

- `rgba`  

  其中的 `a` 表示不透明度, 取值为 `$[0 , 1]$` , 1 表示不透明, 0 表示完全透明。

- `hsl`  

  依次为色相 (`$[0 , 360]$`) 、饱和度 (`$[0\% , 100\%]$`) 、亮度 (`$[0\% , 100\%]$`) 
  ```css
  body {
    background: hsl(166, 30%, 60%);
  }
  ```

  :::tip 提示
  同理也有 `hsla`, 但是一般不使用这种方式来设置颜色。
  :::

## 字体样式

大部分浏览器的默认字体大小为 16px。给文字设置大小时, 实际上是设置的字体的高度, 其宽度会自适应。

- `font-style`  
- `font-weight`
- `font-variant`  
  
  用于设置小型大写字母的字体显示文本, 这意味着所有的小写字母均会被转换为大写, 但是所有使用小型大写字体的字母与其余文本相比, 其字体尺寸更小。
  ```html
  <p class="p1" style="font-variant: small-caps;">p标签ABDdeg</p>
  ```
  效果如下: 
  <p class="p1" style="font-variant: small-caps;">p标签ABDdeg</p>

- `font`  
  
  在一个声明中设置所有字体属性。可以按顺序设置如下属性: 
  - `font-style`
  - `font-variant`
  - `font-weight`
  - `font-size/line-height`
  - `font-family`  

  注意, 如果没有使用这些关键词, 至少要指定字体大小和字体系列。未设置的属性会使用其默认值。
  ```css
  p.ex2 {
    font: italic bold 12px/20px arial,sans-serif;
  }
  ```

  :::tip 提示
  更多信息, 请见 [w3cschool](https://www.w3school.com.cn/cssref/index.asp#font)。
  :::

- `line-height`  
  使用 `line-height` 来设置行高, 而文字在行高中会垂直居中。在 CSS 中, 并没有直接提供设置文字行距的样式, 我们只能通过设置行高来间接设置。如果将行高设置为 100%, 则它会和该标签的 `font-size` 一致 (支持继承) ; 如果将行高设置为数字 (如 2) , 则它会是该标签 `font-size` 的  (2)  倍 (支持继承) 。在父元素中将 `line-height` 设置为父元素的高度, 则它的文本会垂直居中 (只针对单行的文本) 。

  :::warning 注意
  如果 `line-hright` 属性被设置在 `font` 属性之前, 而在 `font` 中没有设置行高的话, 那么行高始终是字体的大小。因为 `font` 属性中也能设置行高, 不设置的话会使用默认值。同理 `font-weight` 等也是这样。
  :::

- **使用外部字体**  

  如果用户的计算机中没有某种字体样式, 而我们又想用这种字体, 那么, 我们将这种字体先下载下来 (不用安装) , 然后拖入项目中的一个文件夹中 (假设是 `fonts` 文件夹) , 最后, 通过 CSS 引入: 
  ```css
  /* 定义字体 */
  @font-face {
    /* 自定义字体的名字 */
    font-family: "myFont";
    /* 字体的路径 */
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
    url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
  }

  /* 使用字体 */
  body {
    font-family: "myFont";
  }
  ```

  :::warning 注意
  引入外部字体 `@font-face` 时要注意字体版权问题。
  :::

- **图标字体**  
  ```css
  i.iconfont {
    font-size: 30px;
  }
  .my::before {
    content: "\e6e6";
    font-family: "iconfont";
    font-size: 30px;
  }
  ```
  ```html
  <link rel="stylesheet" href="./iconstyle/iconfont.css">

  <i class="iconfont">&#xe6a2;</i>
  <i class="iconfont icon-checkmore"></i>
  <i class="my"></i>
  <i class="iconfont">&#xe6e6;</i>
  ```
- **字体对齐**  
  
  - **`text-align`**  
    
    使文字水平对齐。见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align)。

  - **`vertical-align`**  
    
    用来指定行内元素 (`inline`) 或表格单元格 (`table-cell`) 元素的垂直对齐方式。该值默认是 `baseline`  (基线) , 就像作业本下面那条线, 即默认是底部对齐。
    ```html
    <div class="nav">
      今天天气不错 hello x<span>很不错 hello</span>
      <!-- 注意字母 x 的用意 -->
    </div>
    ```
    ```css
    .nav {
      width: 500px;
      border: 1px solid #ff6600;
      font-size: 30px;
    }
    span {
      font-size: 16px;
      vertical-align: middle;
      /* 也可以直接设置 */
      /* vertical-align: 10px; */
    }
    ```
    注意, 当取值为 `middle` 时, 它是使元素的中部与父元素的基线加上父元素 `x-height` (即字母 x 的高度) 的一半对齐。跟多请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)。
    
    提示！当使用 `<img>` 标签时, 它会出现底部有缝隙的情况, 这时候就可以为它设置 `vertical-align`  (此值只要不是 `baseline` 就可以) 。
    ```css
    img {
      vertical-align: middle;
    }
    ```
    另外, 给块元素设置垂直居中也能使用 `vertical-align` (但是默认不支持) 。
    ```css
    .d1 {
      width: 200px;
      height: 200px;
      background: #ff6600;
      /* 设置为表格的单元格 */
      display: table-cell;
      /* 使子元素垂直居中 */
      vertical-align: middle;
    }
    .d2 {
      width: 100px;
      height: 100px;
      background: #7C61DD;
        
    }
    ```
    ```html
    <div class="d1">
      <div class="d2"></div>
    </div>
    ```

## 字体分类

在网页中, 将字体分为五大类: 

- `serif` (衬线字体) 
- `sans-serif` (非衬线字体) 
- `monospace` (等宽字体) 
- `cursive` (草书字体) 
- `fantasy` (虚幻字体)   

这些大的分类中又有许多小的分类, 我们可以直接将字体的样式设置为这五个大类, 浏览器会自动选择该类中的一种字体。

## 文本样式

|属性|描述|取值|
|---|---|---|
|`text-transform`|控制文本的大小写。|**none**: 默认。定义带有小写字母和大写字母的标准的文本。<br>**capitalize**: 文本中的每个单词以大写字母开头。<br>**uppercase**: 定义仅有大写字母。<br>**lowercase**: 定义无大写字母, 仅有小写字母。<br>**inherit**: 规定应该从父元素继承 text-transform 属性的值。|
|`text-decoration`|规定添加到文本的装饰效果。|**none**: 默认。定义标准的文本。<br>**underline**: 	定义文本下的一条线。<br>**overline**: 	定义文本上的一条线。<br>**line-through**: 	定义穿过文本下的一条线。<br>**blink**: 	定义闪烁的文本。<br>**inherit**: 规定应该从父元素继承 `text-decoration` 属性的值。|
|`letter-spacing`|设置字符间距。|**normal**: 默认。规定字符间没有额外的空间。<br>**length**: 	定义字符间的固定空间 (允许使用负值) 。<br>**inherit**: 	规定应该从父元素继承 `letter-spacing` 属性的值。|
|`text-indent`|规定文本块首行的缩进。建议使用 em 为单位|

- 文字省略效果
  
  ```html
  <p style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">网易有道词典最好用的翻译词典. 专业权威, 海量例句, 收录最新词汇</p>
  ```

:::tip 提示
更多信息, 请见 [MDN](https://www.w3school.com.cn/cssref/index.asp#text)。
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
上面的代码会给 `class="d1"` 的增加 `margin-top: 50px;`, 因为它和它里面的子元素是挨着的。如果不想这样, 那么请将它和它的子元素之间留点间隙 (如给他们添加边框、填充其它内容、给父元素设置 `padding` 等) 。当然, 也可以给父元素设置 `display:table`。也能通过伪元素来实现: 
```css
.d1::before {
  content: "";
  /*只能是table*/
  display: table;
}
```
**推荐使用伪元素的方式, 该方式也能用来清理浮动, 一举两得！**

:::tip 提示
垂直方向的 `margin` 也有高度塌陷问题。如果相邻的两个元素的 `margin` 都是正值, 则取最大的; 如果一正一负, 则取两者的和; 两个都是负数时, 取绝对值较大的。
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
3. 行内元素可以设置垂直的 `padding`, 但是, 它不会对页面的布局产生影响
4. 行内元素可以设置边框, 但是垂直方向的边框不会影响布局
5. 行内元素可以设置水平方向的 `margin`, 但是不能设置垂直方向的 `margin`

但是, 可以将它变成块元素或行内块元素来设置这些属性。

## display

规定元素应该生成的框的类型。参考 [w3cschool](https://www.w3school.com.cn/cssref/pr_class_display.asp)。

- **inline-block**  

  将元素变为行级块元素, 但是这样会使元素具有文本的某些特征, 因此, 会导致元素见出现间隙。解决方式如下: 

  - 方式一  

    给父元素设置 `font-size:0px`。

  - 方式二  

    去掉标签见的空格和回车 (不推荐此方式) 。
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

    设置 `margin` 为负值来进行调整 (不推荐) 。

  - 方式四  

    使用 `float` 来代替。


## visibility

规定元素是否可见。

|值|描述|
|---|---|
|`visible`|默认值。元素是可见的。|
|`hidden`	|元素是不可见的。|
|`collapse`|当在表格元素中使用时, 此值可删除一行或一列, 但是它不会影响表格的布局。被行或列占据的空间会留给其他内容使用。如果此值被用在其他的元素上, 会呈现为 "hidden"。|
|`inherit`|规定应该从父元素继承 `visibility` 属性的值。|

:::warning 注意
即使不可见的元素也会占据页面上的空间。请使用 `display` 属性来创建不占据页面空间的不可见元素。
:::

## 文档流

文档流处在网页的最底层, 它表示的是页面中的一个位置, 我们所创建的元素默认都是处在文档流中。元素在文档流中的特点如下: 

- 块元素  

  独占一行, 自上而下排列。默认宽度是父元素的 100%, 默认高度是由内容撑开。

- 行内元素  

  只占自身的大小, 从左到右排列。宽高由内容撑开。

给块元素设置浮动或定位后, 它会脱离文档流, 且脱离文档流后, 它的宽高由内容撑开 (变成 `inline-block` 或 `block`) 。

## 浮动

被浮动的元素直到遇到父元素的边框、其它浮动的元素、另一个块元素时, 才会停止。当一行容不下时, 浮动的元素会换行。浮动的元素不会超过它上边的兄弟元素。浮动的元素不会遮住文字, 文字会在其四周环绕 (可设置文字环绕图片) 。**所有元素经过浮动变为行内块元素**。

### 高度塌陷问题

使用浮动后, 可能造成高度塌陷的问题, 如下: 
```html
<div class="d1">
  <div class="d2">d2</div>
</div>
```
```css
.d1 {
  border: 2px solid #f1393a;
}
```
上面的代码中, 父元素的高度会由子元素撑开。但是, 我们为子元素设置浮动后, 其父元素的高度就没有了, 那么其父元素的兄弟元素会往上移动, 这就是高度塌陷的第一种情况。解决办法如下:   

- **给父元素设置高度**  

  但是, 如果其子元素的高度太大时会溢出, 然后其父元素不能适应其子元素, 因此不推荐直接给父元素设置高度。

- **开启 BFC**  

  BFC 全称是 Block Formatting Context, 即块格式化上下文。是 W3C 标准中规定的。BFC 默认是关闭的, 开启方式有很多, 如下: 
    
    - 根元素或其它包含它的元素; 
    - 浮动 (元素的 `float` 不为 `none`)
    - 绝对定位元素 (元素的 `position` 为 `absolute` 或 `fixed`)
    - 行内块 `inline-blocks`(元素的 `display: inline-block`)
    - 表格单元格 (元素的 `display: table-cell`, HTML 表格单元格默认属性)
    - `overflow` 的值不为 `visible` 的元素
    - 弹性盒 `flex boxes` (元素的 `display: flex` 或 `inline-flex`)

    **这里推荐使用 overflow, 其它的方式会有副作用。**  
    给父元素设置 overflow 属性: 
    ```css
    .d1 {
      border: 2px solid #f1393a;
      overflow: auto;
      /* 或者 */
      /* overflow: hidden; */
      /* 兼容 IE6 */
      /* zoom:1 */
    }
    ```
- **清理浮动**  

  给 `.d2` 清除浮动 (注意, 使用的是父元素的伪元素) , 推荐使用此方式
  ```css
  .d1::after {
    content: "";
    display: table;
    clear: left;
  }
  ```

## 清理浮动

清除浮动到底是什么意思呢？清除浮动后, 可以使布局看起来像没有使用过浮动一样。简单来讲, 清除浮动后就相当于元素之间没有浮动, 元素的位置还是使用浮动之前的位置。注意！只能通过**兄弟节点**来清除浮动。且只能使用块元素或行级块元素来清理浮动。

## 定位
- **static**  

  默认值, 表示没有开启定位。

- **relative**  

  相对定位。如果开启了相对定位, 但是没有设置偏移量, 则它不会产生任何变化; 如果设置了偏移量, 则该元素会相对它原来的位置移动, 类似 `margin`。相对定位的元素不会脱离文档流 (即它原来的位置还在, 不会随着定位而消失) , 也不会改变元素的性质 (即行元素不会变成块元素) 。相对定位会使元素提升一个层级 (类似 `z-index`) 。

- **absolute**  

  绝对定位。会使元素脱离文档流。它会相对于离它最近的且开启了定位的祖先元素来进行定位。绝对定位会使元素提升一个层级 (类似 `z-index`) 。

- **fixed**  

  固定定位。它也是一种绝对定位, 因此, 它拥有决定定位的大部分特点。但是, 它永远会相对浏览器窗口来定位, 且它不会随着滚动条的滚动而消失。IE6 不支持固定定位。

- **sticky**  
  
  粘性定位。类似于相对定位。可以理解为, 当元素到大某个位置时, 将其固定 (类似用JS的实现效果) 。 **IE 不支持该特性**
  ```html
  <body>
    <div class="d1"></div>
  </body>
  ```
  ```css
  body {
    margin: 0;
    padding: 0;
    height: 1000px;
  }
  .d1 {
    width: 200px;
    height: 200px;
    background: #ff6600;
    position: sticky;
    /* 当 div 距离页面顶部的距离为 10px 时, 将其固定 */
    top: 10px;
    margin: 200px auto 0;
  }
  ```

:::warning 注意
- **元素开启定位之后, 如果没有设置偏移量, 则还是在原来的位置, 只不过某些定位会脱离文档流。**  
- **请结合上面的笔记查看, 元素脱离文档流后的性质？**  
- **元素开启定位之后, 层级会提升, 且兄弟节点之间会从后往前依次覆盖 (如果有定位的话) **
:::

:::tip 提示
更多信息, 请见 [w3cschool](https://www.w3school.com.cn/cssref/pr_class_position.asp)。
:::

## z-index

设置元素的层级 (z轴方向) , 它的值可正可负。值越大, 层级越高。必须配合 **position** 属性使用。父元素的层级再高也不会覆盖其子元素。

## opacity
设置元素的透明度, 取值范围`$[0 , 1]$`。0 表示完全透明, 1 表示不透明。若为元素设置了 `opacity` 属性, 则该标签中的所有内容都有透明效果。IE8 不支持 `opacity`, 请使用 `filter` 代替, 该属性需要一个 `$[0 , 100]$` 的值。
```css
.ele {
  filter: alpha(opacity=50);
}
```
## 背景
- **background-image**  

  设置元素的背景图像。注意！如果图片太大, 则只会显示一部分。如果图片太小, 则会重复显示。
  ```css
  body { 
    background-image: url(bgimage.gif);
  }
  ```

- **background-color**  

  该属性可以和 `ackground-image` 同时使用。

- **background**  

  在一个声明中设置所有的背景属性。可以设置如下属性:   
    - ·background-color`
    - ·background-position`
    - ·background-size`
    - ·background-repeat`
    - ·background-origin`
    - ·background-clip`
    - ·background-attachment`
    - ·background-image`

  这几个属性没有顺序要求。如果不设置其中的某个值, 也不会出问题, 其它的会使用默认值。通常建议使用这个属性, 而不是分别使用单个属性, 因为这个属性在较老的浏览器中能够得到更好的支持, 而且需要键入的字母也更少。
  ```css
  .ele { 
    background: #00FF00 url(bgimage.gif) no-repeat fixed top;
  }
  ```

- **background-attachment**  

  设置背景图像是否固定或者随着页面的其余部分滚动。

  |值|描述|
  |---|---|
  |`scroll`|默认值。背景图像会随着页面其余部分的滚动而移动|
  |`fixed`|当页面的其余部分滚动时, 背景图像不会移动。该值永远相对于浏览器窗口, 博客中经常使用。一般只给 `body` 设置此值|
  |`inherit`|规定应该从父元素继承 `background-attachment` |属性的设置|

- **background-position**  

  设置背景图像的开始位置。

  |值|描述|
  |---|---|
  |top left<br>top center<br>top right<br>center left<br>center center<br>center right<br>bottom left<br>bottom center<br>bottom right|如果您仅规定了一个关键词, 那么第二个值将是"center"。<br>默认值: 0% 0%。|
  |x% y%|第一个值是水平位置, 第二个值是垂直位置。<br>左上角是 0% 0%。右下角是 100% 100%。<br>如果您仅规定了一个值, 另一个值将是 50%。<br>该值可以是负数。|
  |xpos ypos|第一个值是水平位置, 第二个值是垂直位置。<br>左上角是 0 0。单位是像素 (0px 0px) 或任何其他的 CSS 单位。<br>如果您仅规定了一个值, 另一个值将是50%。<br>您可以混合使用 % 和 position 值。<br>该值可以是负数。|

- **background-repeat**  

  设置是否及如何重复背景图像。

  |值|描述|
  |---|---|
  |`repeat`|默认。背景图像将在垂直方向和水平方向重复。|
  |`repeat-x`|背景图像将在水平方向重复。|
  |`repeat-y`|背景图像将在垂直方向重复。|
  |`no-repeat`|背景图像将仅显示一次。|
  |`inherit`|规定应该从父元素继承 `background-repeat` 属性的设置。|

- **background-clip**  

  规定背景的绘制区域。

- **background-origin**  

  规定背景图片的定位区域

- **background-size**  

  规定背景图片的尺寸。

  **语法: **  
  ```css
  background-size: length|percentage|cover|contain;
  ```
  |值|描述|
  |---|---|
  |`length`|设置背景图像的高度和宽度。<br>第一个值设置宽度, 第二个值设置高度。<br>如果只设置一个值, 则第二个值会被设置为 "auto"。<br>单位为 px 。|
  |`percentage`|以父元素的百分比来设置背景图像的宽度和高度。<br>第一个值设置宽度, 第二个值设置高度。<br>如果只设置一个值, 则第二个值会被设置为 "auto"。|
  |`cover`|把背景图像扩展至足够大, 以使背景图像完全覆盖背景区域。<br>背景图像的某些部分也许无法显示在背景定位区域中。|
  |`contain`|把图像图像扩展至最大尺寸, 以使其宽度和高度完全适应内容区域。|


  :::tip 提示
  在使用背景图片时, 最好将多张图片拼接为 1 张, 然后只需改变图片的 `background-position`  (设置为元素宽度的负倍数) 。
  :::

### 渐变
渐变是要通过 `background-image` 来设置, 是的, 你没看错。渐变不是颜色, 而是图片。
```css
.nav1 {
  /* 线性渐变 */
  /* 默认是从上往下渐变, 红色在上 */
  /* background-image: linear-gradient(red,yellow); */
  /* 从左向右渐变 */
  /* background-image: linear-gradient(to right,red,yellow); */
  /* background-image: linear-gradient(to top left,red,yellow); */
  /* 设置渐变角度 */
  /* background-image: linear-gradient(45deg,red,yellow); */
  width: 200px;
  height: 200px;
  /* 渐变可以同时指定多个颜色 */
  /* 这几个颜色默认是平均分配的 */
  background-image: linear-gradient(to top left,red,yellow,green,#f60);
  /* 分配颜色比例, 就是设置颜色的开始位置, 如果它的前面或后面没有颜色, 则会填充它的颜色 */
  /* background-image: linear-gradient(green,#f60 70px); */
  /* background-image: linear-gradient(green,#f60 30%); */
}
.nav2 {
  background-image: repeating-linear-gradient(#7C61DD 30px,#5BC0DE 80px);
  width: 200px;
  height: 200px;
  margin-top: 50px;
}
.nav3 {
  /* 径向渐变 */
  width: 200px;
  height: 200px;
  margin-top: 50px;
  /* 其形状是根据该元素的形状来计算 */
  background-image: radial-gradient(#5BC0DE,#3EAF7C);
  background-image: radial-gradient(#5BC0DE 50px,#3EAF7C);
  background-image: radial-gradient(100px 100px,#5BC0DE 50px,#3EAF7C);
  /* 用 at 设置圆心 */
  background-image: radial-gradient(100px 100px at 0 0,#5BC0DE 50px,#3EAF7C);
  /* background-image: radial-gradient(#5BC0DE,#3EAF7C,#F1393A);
  background-image: repeating-radial-gradient(#5BC0DE 20px,#3EAF7C ,#F1393A );
  background-image: repeating-radial-gradient(circle,#5BC0DE 20px,#3EAF7C ,#F1393A ); */
  /* 椭圆效果 */
  /* background-image: repeating-radial-gradient(ellipse,#5BC0DE 20px,#3EAF7C ,#F1393A ); */
}
```

## 表格
```html
<table>
  <!-- caption 元素定义表格标题。
    caption 标签必须紧随 table 标签之后。
    您只能对每个表格定义一个标题。
    通常这个标题会被居中于表格之上。 
  -->
  <caption>表格标题</caption>
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
      <th>表头3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <!-- 从该位置起, 合并纵向的单元格 -->
      <td rowspan="2">1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <!-- 合并两个水平方向的单元格 -->
      <td colspan="2">2</td>
    </tr>
  </tbody>
  <!-- 该标签中的内容永远显示在表格底部, 不管它的位置在何处 -->
  <tfoot>
    <tr>
      <td>1</td>
      <td>合计</td>
      <td>123</td>
    </tr>
  </tfoot>
</table>
```
```css
table, tr, td, th {
  border: 1px solid #ccc;
  /* 合并边框 */
  border-collapse: collapse;
}
table {
  table-layout: fixed;
}
td, th {
  width: 100px;
  padding: 2px 5px;
  text-align: center;
}
/* 隔行变色 */
/* 使用 table > tr 无效, 因为页面中会自动添加 <thead><tbody> 和< tfoot> */
/* 有的人看似是儿子, 其实是孙子 */
tbody > tr:nth-child(even) {
  background: #eee;
}
```

:::tip 提示
- `td` 中的内容默认是垂直居中的
- 可以使用 `vertical-align` 来设置 `td` 中的垂直样式
:::

## Hack
### 条件Hack
有时候我们只想在某个特定的条件下执行某个特定的代码, 这时候就可以使用 CSS 提供的 Hack。Hack 就是值的一段特殊的代码, 它只在某些特殊的浏览器中使用。条件 Hack 只在 IE 中有效, 其它浏览器都会将它解析为注释。但是, 只有 IE10 及其以下的浏览器才有效。
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

### 属性 Hack
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
不到万不得已的地步, 尽量不要使用属性 Hack。
:::

### 选择符 Hack
在 CSS 选择器中使用。给选择器前面加上 `* html `
```css
* html body {
    /* ... */
}
```
## 轮廓 (outline) 
它与边框类似, 但是又有不同。它不会改变元素的可见大小, 不会影响页面的布局。
## 阴影 (box-shadow) 
`box-shadow` 属性用于在元素的框架上添加阴影效果, 该属性可设置的值包括X轴偏移、Y轴偏移、阴影模糊半径、阴影扩散半径, 和阴影颜色, 并以多个逗号分隔。

`box-shadow` 以由逗号分隔的列表来描述一个或多个阴影效果。该属性可以让几乎所有元素的边框产生阴影。如果元素同时设置了 `border-radius` , 阴影也会有圆角效果。

:::tip 提示
更多请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)。
:::

## 元素垂直和水平居中

- **水平居中**  

  方式一就是直接使用 `margin: 0 auto;`, 方式二是使用绝对定位: 
  ```html
  <div class="d1">
    <div class="d2"></div>
  </div>
  ```
  ```css
  .d1 {
    width: 200px;
    height: 200px;
    background: #ff6600;
    /* position: sticky;
    top: 10px; */
    position: relative;
    margin: 200px auto 0;
  }
  /* 此方式仅使用于设置了元素的宽高 , 另一种居中方式请见 笔记的 translate  */
  .d2 {
    width: 100px;
    height: 100px;
    background: #e3f98d;
    position: absolute;
    /* 必须要设置 left 和 right 为0*/
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  ```
- **垂直居中**  

  方式一也是使用绝对定位: 
  ```html
  <div class="d1">
      <div class="d2"></div>
  </div>
  ```
  ```css
  .d1 {
    width: 200px;
    height: 200px;
    background: #ff6600;
    /* position: sticky;
    top: 10px; */
    position: relative;
    margin: 200px auto 0;
  }
  .d2 {
    /* 此方式仅使用于设置了元素的宽高 , 另一种居中方式请见 笔记的 translate  */
    width: 100px;
    height: 100px;
    background: #e3f98d;
    position: absolute;
    /* 必须要设置 top 和 bottom 为0*/
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
  ```
- **垂直水平都居中**  

  综合了以上两种方式: 
  ```html
  <div class="d1">
    <div class="d2"></div>
  </div>
  ```
  ```css
  .d1 {
    width: 200px;
    height: 200px;
    background: #ff6600;
    /* position: sticky;
    top: 10px; */
    position: relative;
    margin: 200px auto 0;
  }
  /* 此方式仅使用于设置了元素的宽高 , 另一种居中方式请见 笔记的 translate  */
  .d2 {
    width: 100px;
    height: 100px;
    background: #e3f98d;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  ```
## 过渡 (transition) 
`transition` 又可以分为 `transition-delay`、`transition-duration`、`transition-property`、`transition-timing-function`。

- **`transition-property`**  

  指定要执行过渡效果的属性。多个属性用逗号隔开, 过渡所有属性时可以使用 `all`。大部分属性 (如颜色、`margin`、`padding` 等) 都支持过渡效果。但是, 要过渡的属性必须是可计算的值 (如 700px) 。
  ```css
  .box {
    transition-property: width,height;
  }
  ```

- **`transition-duration`**  

  指定过渡效果的持续时间, 单位可以是 s 或 ms。过渡多个属性时, 可用逗号隔开。
  ```css
  .box {
    transition-duration: 1s,2000ms;
  }
  ```

- **`transition-timing-function`**  
  
  过渡的时序函数。
  ```css
  .box {
    transition-duration: 1s,2000ms;
  }
  ```

- **`transition-delay`**   

  过渡动画延迟 xxx 执行。

- **`transition`**  

  将以上几个综合起来, 没有顺序要求。但是, 如果同时设置了过渡时间和延迟时间, 则会把第一个当做过渡时间。

  ```css
  * {
    margin: 0;
    padding: 0;
  }
  .d1 {
    width: 800px;
    height: 600px;
    background-color: blanchedalmond;
    overflow: hidden;
  }
  .d1 div {
    width: 100px;
    height: 100px;
  }
  .d2 {
    background-color: #ff6600;
    margin-bottom: 50px;
    margin-left: 0;

    /* 过渡 */
    /* transition: all 2s; */
    /* transition-property: width,height; */
    transition-property: margin;
    transition-duration: 3s;
    /* 指定过渡的方式, 默认值是ease, 慢->快->慢 */
    /* transition-timing-function: ease; */
    /* 线性, 匀速 */
    /* transition-timing-function: linear; */
    /* 慢->快 */
    /* transition-timing-function: ease-in; */
    /* 慢->快->慢 */
    /* transition-timing-function: ease-in-out; */
    /* 通过贝塞尔曲线指定, 其实上面的几种都是。 */
    /* transition-timing-function: cubic-bezier(.17,.67,.9,.25); */
    /* 分步执行过渡效果, 就是在过渡时间内只走指定的步数而到达终点 */
    /* 第二个值默认值 end, 表示在每time/steps (s) 结束时才执行 */
    /* 如果第二个参数是start, 表示在每time/steps (s) 开始时就运动 */
    /* transition-timing-function: steps(3,start); */
    /* 过渡动画延迟 xx 后才执行 */
    transition-delay: 2s;
    /* 没有顺序要求 */
    /* 第一个时间是持续时间, 第二个是延迟时间 */
    transition: margin-left 2s;
    
  }
  /* 当鼠标移入d1时, 改变d2的宽高 */
  .d1:hover div {
    /* width: 200px;
    height: 200px; */
    margin-left: 700px;
  }
  .d3 {
    background: cornflowerblue;
    transition-property: margin;
    transition-duration: 3s;
    /* 指定过渡的方式, 默认值是ease ,慢->快->慢*/
    /* transition-timing-function: ease; */
  }
  ```
  ```html
  <div class="d1">
    <div class="d2"></div>
    <div class="d3"></div>
  </div>
  ```

  :::warning 注意
  使用过渡时, 必须要指定过渡属性和过渡的时间。
  :::

### 实现走动效果
```html
<div class="nav"></div>
```
```css
.nav {
  width: 132px;
  height: 271px;
  margin: 0 auto;
  background-image: url(./img/1.png);
  background-position: 0 0;
  transition: background-position 0.5s steps(3,start);
}
.nav:hover {
  background-position: -396px 0;
}
```
## 动画 (animation) 
动画可以自动触发, 而过渡只有在条件满足时才会触发。设置动画效果必须要先设置关键帧。关键帧规定了动画执行的每一个步骤, 使用 `@keyframes`。
```css
/* 给动画取名为 myAnimation */
@keyframes myAnimation {
  /* 动画开始位, 也可以用0%表示 */
  from {
    margin-left: 0;
  }
  
  /* 0% {
      margin-left: 0;
  } */
  /* 动画结束位, 也可以使用100% */
  to {
    margin-left: 700px;
  }
}
```
- animation-name  
  动画名称。
  ```css
  .d2 {
    animation-name: myAnimation;
  }
  ```
- animation-duration  

  动画的持续时间。

- animation-delay  
  动画延迟。

- animation-timing-function  
  动画的方式。

- animation-iteration-count  
  设置动画执行的次数。可以直接指定次数, 也可以使用系统自带的 `infinite` 表示无限次。

- animation-direction  
  指定动画执行的方向。默认值是 `normal`, 即每次都是从 `from` 到 `to`。`reverse` 每次都是从 `to` 到 `from`, 即反向执行。`alternate` 开始时从 `from` 到 `to`, 但是如果重复执行, 则会有反弹效果。`alternate-reverse` 与 `alternate` 相似, 但是刚开始是从 `to` 到 `from`。

- animation-play-state  
  设置动画的执行状态。`running`, 默认值, 表示动画执行。`paused`, 动画暂停。

- animation-fill-mode  

  动画的填充模式, 默认值为 `none`, 即动画执行完毕后, 元素回到初始位置。`forwards`, 动画执行完毕后, 元素停止在动画结束位置。`backwards`, 动画延迟等待时, 元素就会处于 `from` 的形式。`both`, 结合了 `backwards` 和 `forwards`。

  ```css
  .d2 {
    background-color: #ff6600;
    margin-bottom: 50px;
    margin-left: 0;
    
    /* 动画可以自动触发, 而过渡只有在条件满足时才会触发 */
    /* 设置动画效果必须要先设置关键帧 */
    /* 关键帧规定了动画执行的每一个步骤, 使用@keyframes */
    /* 动画名称 */
    animation-name: myAnimation;
    /* 动画的时间 */
    animation-duration: 2s;
    /* 动画延迟 */
    /* animation-delay: 1s; */
    animation-timing-function: ease-in;
    /* 设置动画执行的次数 */
    /* 可以直接指定次数, 也可以使用系统自带的 */
    /* infinite表示无限次 */
    animation-iteration-count: infinite;

    /* 指定动画执行的方向 */
    /* 默认值是normal, 即每次都是从 from 到 to */
    /* reverse 每次都是从 to 到 from, 即反向执行 */
    /* alternate 开始时从 from 到 to, 但是如果重复执行, 则会有反弹效果 */
    /* alternate-reverse 与alternate相似, 但是刚开始是从 to 到 from */
    animation-direction: alternate-reverse;

    /* 设置动画的执行状态 */
    /* running, 默认值, 表示动画执行 */
    /* paused, 动画暂停 */
    /* animation-play-state: paused; */

    /* 动画的填充模式, 默认值为none */
    /* 默认值为none, 即动画执行完毕后, 元素回到初始位置 */
    /* forwards, 动画执行完毕后, 元素停止在动画结束位置*/
    /* backwards, 动画延迟等待时, 元素就会处于 from 的形式 */
    /* both, 结合了 backwards 和 forwards*/
    animation-fill-mode: both;
  }
  ```
### 人物走动
```css
.nav {
  width: 132px;
  height: 271px;
  margin: 0 auto;
  background-image: url(./img/1.png);
  background-position: 0 0;
  animation: identifier 1s steps(4) infinite;
    
}
.nav:hover {
  animation-play-state: paused;
}
@keyframes identifier {
  0% {
    background-position: 0 0;
  }
  100% {
    /* 此处可以直接设置为 -528px, 因为图片默认会平铺 */
    background-position: -528px 0;
  }
}
```
```html
<div class="nav"></div>
```
### 小球跳动1
```css
.nav {
  width: 100px;
  height: 100px;
  background: #7C61DD;
  border-radius: 50%;
  animation: myAnimation 5s forwards ease-in;
}
.container{
  height: 500px;
  width: 500px;
  border-bottom: 5px solid #ccc;
  margin: 50px auto 0;
  overflow: hidden;
}
@keyframes myAnimation {
  /* 简化 */
  /* 0%,20%,60% {
    animation-timing-function: ease-in;
  } */
  0% {
    margin-top: 0;
  }
  10% {
    margin-top: 400px;
    animation-timing-function: ease-out;
  }
  20% {
    margin-top: 50px;
    animation-timing-function: ease-in;
  }
  30% {
    margin-top: 400px;
    animation-timing-function: ease-out;
  }
  40% {
    margin-top: 100px;
    animation-timing-function: ease-in;
  }
  50% {
    margin-top: 400px;
    animation-timing-function: ease-out;
  }
  60% {
    margin-top: 200px;
    animation-timing-function: ease-in;
  }
  70% {
    margin-top: 400px;
    animation-timing-function: ease-out;
  }
  85% {
    margin-top: 300px;
    animation-timing-function: ease-out;
  }
  100% {
    margin-top: 400px;
  }
}
```
```html
<div class="container">
  <div class="nav"></div>
</div>
```
### 小球跳动2
```css
.container div {
  float: left;
  width: 50px;
  height: 50px;
  background: #7C61DD;
  border-radius: 50%;
  animation: myAnimation 1s infinite alternate linear;
}
div.nav2 {
  background: #ff6600;
  animation-delay: 0.1s;
}
div.nav3 {
  background: pink;
  animation-delay: 0.2s;
}
div.nav4 {
  background: #83C44E;
  animation-delay: 0.3s;
}
div.nav5 {
  background: #6C6C6C;
  animation-delay: 0.4s;
}
div.nav6 {
  background: #5BC0DE;
  animation-delay: 0.5s;
}
div.nav7 {
  background: rgb(233, 139, 205);
  animation-delay: 0.6s;
}
div.nav8 {
  background: #F44336;
  animation-delay: 0.7s;
}
div.nav9 {
  background: #E7C000;
  animation-delay: 0.8s;
}
div.nav10 {
  background: rgb(175, 240, 229);
  animation-delay: 0.9s;
}
.container {
  height: 350px;
  width: 500px;
  border-bottom: 5px solid #ccc;
  margin: 50px auto 0;
  overflow: hidden;
}
@keyframes myAnimation {
  /* 简化 */
  /* 0%,20%,60% {
      animation-timing-function: ease-in;
  } */
  0% {
    margin-top: 0;
  }
  100% {
    margin-top: 300px;
  }
}
```
```html
<div class="container">
  <div class="nav1"></div>
  <div class="nav2"></div>
  <div class="nav3"></div>
  <div class="nav4"></div>
  <div class="nav5"></div>
  <div class="nav6"></div>
  <div class="nav7"></div>
  <div class="nav8"></div>
  <div class="nav9"></div>
  <div class="nav10"></div>
</div>
```
## 变形 (transform) 
通过 CSS 来改变元素的形状或位置, 就是平移。它不会改变元素的布局 (即不会脱离文档流) , 默认是 2D 效果, `transform` 中又可以使用如下几种方式。
### 平移 (translate) 
它又可以具体分为 `translate3d()`、`translateX()`、`translateY()`、`translateZ()`。X、Y、Z 分别表示往哪个方向平移, 其值可正可负, 可以写具体的像素, 也可写百分比。当一个元素使用此属性时, 它的坐标原点就是这个元素的正中心。单独使用 Z 轴时, 没有任何效果, 需结合 3D 或下面例子中的属性来使用。
```css
/* 设置 Z 轴方向的平移 */
body {
  border: 1px solid #ff6600;
}
html {
  /* 设置人眼到网页屏幕的距离, 一般为600 - 1200 */
  perspective: 800px;
}
.nav6 {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 100px;
  background-color: #ff6600;
  transition: all 1s;
}
body:hover .nav6 {
  transform: translateZ(100px);
}
```

:::tip 说明
这里特别说明一下百分比的情况:   
拿 `translateX()` 来讲, 如果写成 `translateX(50%)` , 那么元素会**向右移动自身宽度**的 50%。其它同理。

**坐标问题:**   
以自身中心为原点, X 方向右正左负, Y 轴方向下正上负, Z 轴方向就是屏幕对着我们的方向为正。
:::


**使用 translate 居中**
```css
.box {
  posstion: absolute;
  left: 50%;
  top: 50%;
  /* 多个值时, 使用空格隔开 */
  transform: translateX(-50%) translateY(-50%);
}
```
**实现商品卡片位移效果**
```css
.nav2,.nav3 {
  width: 200px;
  height: 273px;
  /* margin: 50px auto 0; */
  background-color: #5bc0de;
  display: inline-block;
  /* 给 transform 和 box-shadow 添加过渡效果 */
  transition: all 2s;
}
.nav2:hover {
  transform: translateY(20px);
  box-shadow: 5px 5px 5px #ccc;
}
```
### 旋转 (rotate) 
同样, 它也是 `transform` 中的一个函数, 它也有 X、Y、Z 之分。`rotateX` 表示以 X 为轴来进行旋转, 同理可得 Y、Z。其旋转的原点也是元素自身的中心, 可通过 `transform-origin` 改变。当然也可以将其放在一个父元素中, 时父元素来转动, 如下。
```css
.container {
  height: 300px;
  width: 300px;
  background-color: #fcd03e;
  animation: secRotate 2s infinite linear;
}
.sec {
  height: 150px;
  width: 2px;
  background-color: #ff6600;
  margin: 0 auto;
  /* transition: all 2s; */
  /* animation: secRotate 2s infinite linear; */
  /* 改变默认的旋转点 */
  transform-origin: bottom;
}
@keyframes secRotate {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(1turn);
  }
}
```
```html
<div class="container">
  <div class="sec"></div>
</div>
```
想要旋转的效果更加真实, 请务必给 `<html>` 设置 `perspective: XXXpx;`
```css
body {
  border: 1px solid #ff6600;
}
html {
  /* 设置人眼到网页屏幕的距离 (视距) , 一般为600 - 1200 */
  perspective: 800px;
}
.nav6 {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 50px;
  background-color: #ff6600;
  transition: all 2s;
}
body:hover .nav6 {
  /* transform: rotateZ(45deg); */
  /* 1turn 表示一圈 */
  /* transform: rotateZ(1turn); */
  /* transform: rotateX(1turn); */
  /* 注意下面两个的区别 */
  /* 先向 Y 轴转 (此时 Z 轴改变, Z 轴不再是指向我们, 而是指向电脑)  */
  /* 效果就是离我们越来越远 */
  /* transform: rotateY(.5turn) translateZ(180px); */
  /* 与上面的效果相反 */
  transform: translateZ(180px) rotateY(.5turn);
  /* 设置旋转完成后, 元素是否显示背景图片 */
  backface-visibility: visible;
}
```
**制作时钟动画**
```html
<div class="clock">
  <!-- 秒针 -->
  <div class="sec"></div>
  <!-- 分针 -->
  <div class="min"></div>
  <!-- 时针 -->
  <div class="hour"></div>
</div>
```
```css
.clock {
  width: 260px;
  height: 260px;
  /* background: #CDBFE3; */
  border-radius: 50%;
  position: relative;
  margin: 30px auto 0;
  border: 5px solid #ff6600;
}
.sec, .min, .hour {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  /* 改变默认的旋转点 */
  transform-origin: bottom;
}
.sec {
  width: 1px;
  height: 115px;
  background-color: #42B983;
  /* animation: secRotate 60s infinite linear; */
  animation: secRotate 60s steps(60) infinite;
}
.min {
  width: 2px;
  height: 85px;
  background: #337AB7;
  /* animation: secRotate 3600s 60s infinite linear; */
  /* 600/60=10s, 即每十秒转一次 */
  animation: secRotate 3600s steps(60) infinite; 
}
.hour {
  height: 60px;
  width: 2px;
  background: #CC0000;
  /* animation: secRotate 43200s 3600s infinite linear; */
  animation: secRotate 7200s infinite linear;
}
@keyframes secRotate {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(1turn);
  }
}
```
**相册立方体**
```html
<div class="container">
  <div class="box1">
    <img src="./img/P21.jpg" alt="" class="photo">
  </div>
  <div class="box2">
    <img src="./img/P22.jpg" alt="" class="photo">
  </div>
  <div class="box3">
    <img src="./img/P27.jpg" alt="" class="photo">
  </div>
  <div class="box4">
    <img src="./img/P30.jpg" alt="" class="photo">
  </div>
  <div class="box5">
    <img src="./img/P31.jpg" alt="" class="photo">
  </div>
  <div class="box6">
    <img src="./img/P32.jpg" alt="" class="photo">
  </div>
</div>
```
```css
* {
  margin: 0;
  padding: 0;
}
html {
  width: 100%;
  height: 100%;
  perspective: 800px;
  overflow: hidden;
}
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #03001e;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #fdeff9, #ec38bc, #7303c0, #03001e);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #fdeff9, #ec38bc, #7303c0, #03001e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background-repeat: no-repeat;
}
.container {
  width: 200px;
  height: 200px;
  /* background: #a3b6de; */
  margin: 200px auto 0;
  /* 设置成3D */
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateZ(45deg);
  animation: myPhoto 10s infinite linear;
}
.container div {
  height: 200px;
  width: 200px;
  opacity: .7;
  position: absolute;
  transition: transform 1.5s ease-in;
}
.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.box1 {
  transform: rotateY(90deg) translateZ(100px); 
}
.box2 {
  transform: rotateY(-90deg) translateZ(100px);
}
.box3 {
  transform: rotateX(90deg) translateZ(100px);
}
.box4 {
  transform: rotateX(-90deg) translateZ(100px);
}
.box5 {
  transform: rotateY(180deg) translateZ(100px);
}
.box6 {
  transform: rotateY(0) translateZ(100px);
}
.container:hover .box1 {
  transform: rotateY(90deg) translateZ(160px); 
}
.container:hover .box2 {
  transform: rotateY(-90deg) translateZ(160px);
}
.container:hover .box3 {
  transform: rotateX(90deg) translateZ(160px);
}
.container:hover .box4 {
  transform: rotateX(-90deg) translateZ(160px);
}
.container:hover .box5 {
  transform: rotateY(180deg) translateZ(160px);
}
.container:hover .box6 {
  transform: rotateY(0) translateZ(160px);
}
@keyframes myPhoto {
  0% {
    transform: rotateX(0) rotateZ(0) rotateY(0);
  }
  100% {
    transform: rotateX(1turn) rotateY(1turn) rotateZ(1turn);
  }
}
```
### 缩放 (scale) 
该方法也是 `transform` 中的一个属性, 它可以实现元素的缩放效果。它可以分为 X、Y、Z轴的方向, 如果值大于 1 , 则放大, 否则缩小。当然也可以为 `scale` 设置, 如果 `scale` 只有一个值, 则 X 和 Y方向的效果相同; 如果有两个值, 则第一个表示 X 方向, 第二个表示 Y 方向; 如果想要设置 Z 轴的缩放, 则必须使用 3D 效果。
```html
<div class="banner">
  <img src="./img/P32.jpg" alt="">
</div>
```
```css
.banner {
  width: 200px;
  height: 200px;
  margin: 100px auto 0;
  overflow: hidden;
}
.banner > img {
  width: 100%; 
  height: 100%;
  object-fit: cover;
  transition: 1.5s;
}
img:hover {
  transform: scale(1.2);
}
```
### transform-origin
设置变形的原点, 默认值是 `center`。不知道你有没有发现, 上面的所有例子中使用到的变形都是从元素正中心开始的, 那么我们可以通过这个属性来改变原点, 如下: 
```css
.box {
  transform-origin: 0 0;
  transform-origin: bottom;
}
```

:::warning 注意
在 `transform` 中有多个属性时, 请使用空格隔开。注意了！后面的 `transform` 会完全覆盖前面的 `transform`, 所以平移多个方向时, 请写在同一个 `transform` 中。
:::

## less
### 前言
less 是 CSS 的预处理语言, 它是 CSS 的增强版。通过 less 可以编写很少的代码, 实现更多的效果。同时, 它也解决了浏览器对CSS的兼容性问题。同时, CSS 不能更好地复用。比如我们在网页的很多地方都要使用同一个颜色, 如果使用 CSS 的话, 我们要重复大量的次数。其实原生 CSS 也支持变量 (浏览器对此的兼容性不好 (如 IE 全系列) ), 格式如下: 
```css
html {            /* 定义变量 */
  --color: plum;
}
.box1 {
  width: 200px;
  height: 200px;
  /* 使用颜色变量 */
  background-color: var(--color);
}
.box2 {
  width: 200px;
  height: 200px;
  color: plum;
}
.box3 {
  width: 200px;
  height: 200px;
  border: 1px solid plum;
}
```
浏览器对 CSS 提供的计算函数 `calc()` 兼容性不好 (如 IE 9以下) 。
```css
body {
  hright: calc(100px/2);
}
```

接下来进入正题！

---

::: tip 提示
[Less 官网](http://lesscss.org)
:::

浏览器不能直接运行 Less, 需要被编译成 CSS 之后才能使用。 

---

**如何引入 LESS ？**  
1. 在 VS Code 中安装插件 Easy LESS
2. 编写 style.less 样式文件
3. 只要 style.less 被保存, 它就会自动生成对应的 CSS 文件, 我们只需把生成后的 CSS 文件引入项目即可
4. less 中可以使用原生的 CSS

**less 示例如下:**  

- `style.less`
  ```less
  div {
    width: 200px;
    height: 200px;
    .img {
      width: 100%;
    }
  }
  ```

- `style.css`
  
  ```css
  div {
    width: 200px;
    height: 200px;
  }
  div .img {
    width: 100%;
  }
  ```
### 语法

- 注释 

  在 less 中可以使用 `//` 和 `/**/`

- 变量

  - 声明变量  
    以 `@` 开头, 后面跟上变量名, 以分号结尾。

  - 赋值  
    使用 `:` 来给变量赋值。变量的值可以是任何类型。
    ```less
    @x:100px
    ```
  - 使用变量  

    变量作为属性时, 直接使用 `@变量名`: 
    ```less
    @x:100px;
    .box3 {
      width: @x;
      height: 200px;
      background-color: #ff6600;
    }
    ```
    变量作为类名或一部分值时, 使用 `@{变量名}`: 
    ```less
    @y:box3;
    .@{y} {
      background-color: #d3fab9;
    }
    ```
    有特殊值时, 需要添加引号: 
    ```less
    @z:'../img/P30.jpg';
    .@{y} {
      background-image: url('@{z}');
    }
    ```
    属性之间可以互相引用, 使用 `$attr`:  
    ```less
    @a:100px;
    @a:300px;
    .@{y} {
      width: @a;
      height: $width;
    }
    ```
- 变量重名  
  变量重名时, 使用就近原则。

- 后代选择器
  ```less
  div {
    width: 200px;
    height: 200px;
    .img {
      width: 100%;
    }
  }
  ```
- 子元素选择器
  
  ```less
  .box3 {
    >.sub {
      width: 200px;
      height: 200px;
    }
  }
  ```

- 伪类选择器

  使用 `&`, 它就代表了其最外层的元素: 
  ```less
  .box3 {
    &:hover {
      width: 200px;
    }
  }
  ```
  ```less
  .box1 {
    .box2 {
      .box3 & {
        width: 100px;
      }
    }
  }
  // 等价的 CSS如下: 
  // .box3 .box1 .box2 {
  //   width: 100px;
  // }
  ```

- 样式的继承
  
  当有一些共有的样式时, 我们可以使用继承, 使用 `:extend(selector)`
  ```less
  .p1 {
    width: 200px;
    height: 200px;
  }
  .c1:extend(.p1) {
    font-size: 18px;
  }
  ```
  等价的 CSS 如下: 
  ```css
  .p1,
  .c1 {
    width: 200px;
    height: 200px;
  }
  .c1 {
    font-size: 18px;
  }
  ```
  ```less
  .c2:extend(.box3 > .sub) {
    background-color: #ff6600;
  }
  ```
  另一种继承的方式如下: 
  ```less
  .c3 {
    .c1();
  }
  ```
  另一种更加方便的样式, 使用混合 (mix) , 类似 Java 中接口的方法。
  ```less
  .c5() {
    width: 50px;
    height: 50px;
    background: #dddddd;
  }
  .c6 {
    .c5();
    // 等价写法
    // .c5;
  }
  ```
  等价的 CSS 如下: 
  ```css
  .c6 {
    width: 50px;
    height: 50px;
    background: #dddddd;
  }
  ```
  我么发现, 只生成了 .c6 的样式。

- 混合函数

  在混合函数中可以设置变量, 类似 Java 中的方法, 可以有参, 也可以无参; 但是函数不能是标签选择器。
  ```less
  .img(@w, @h, @bg) {
    width: @w;
    height: @h;
    background-color: @bg;
  }
  #box {
    .img(200px,200px,#ccc);
    // 等价写法
    // .img(@h:200px,@bg:#ccc,@w:200px);
  }
  ```
  等价的 CSS 如下: 
  ```css
  #box {
    width: 200px;
    height: 200px;
    background-color: #ccc;
  }
  ```
  当然, 在参数中也可以使用默认值: 
  ```less
  .img(@w:100px, @h, @bg) {
    width: @w;
    height: @h;
    background-color: @bg;
  }
  #box {
    .img(@h:200px,@bg:#ccc);
  }
  ```

- 数值运算
  在 less 中, 我们可以使用一些基本运算。
  ```less
  .box1 {
    width: 100px + 100px;
    height: 100px * 2;
  }
  ```

- 引入其它文件中的样式
  使用 `@import` 可以导入其它样式文件。
  ```less
  @import "style.less";
  ```
  所以, 可以使用此方式来进行模块化, 如变量、动画、布局等。

### 调试
网页中显示的是 CSS 文件, 而我们编写的是 less 文件, 那么如何快速找到它们之间的对应关系呢？这就需要我们在 Easy LESS 中进行配置了, 在插件的 `settings.json` 中配置: 
```json
{
  "less.compile": {
    "compress":  false,  // 是否压缩 CSS 代码
    "sourceMap": true,  // 在网页中是否显示样式在less文件中的位置
    "out":       true, // 是否生成 CSS 文件
  }
}
```
修改完成后重新保存 less 文件, 这时会多出一个 .map 文件, 然后在网页中进行测试即可。

## 弹性布局 (flex) 
flex 也叫弹性盒、伸缩盒, 主要用来代替网页中使用浮动所引起的问题 (如高度塌陷) 。它可以使元素具有弹性, 能让元素随着页面大小的改变而改变。
### 弹性容器
要使用 flex 布局, 必须先将一个元素设置成弹性容器, 通过 `display` 来设置, 有两种方式 `display:flex`  (块级) 和 `display:inline-flex`  (行内块级) 。一旦元素被设置成为 **flex 容器**, 则其直接子元素会默认排列在一行中。
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
---
可以给 **容器** 设置 `flex-direction` 来改变其子元素的排列方式, 其可选值如下: 

- **row**  
  默认值, 其子元素会水平排列 (从左向右) , 但是因国家而异。该效果类似 `float:left`。主轴自左向右。
- **row-reverse**  
  自右向左排列, 类似 `float:right`。主轴自右向左。
- **column**  
  按列从上至下纵向排列。主轴自上向下。
- **column-reverse**  
  按列从下至上纵向排列。主轴自下向上。  

这里再给出两个概念: 

- **主轴**  
  弹性元素的的排列方向就称为主轴。
- **侧 (辅) 轴**  
  与主轴互相垂直。 

---

可以通过 `flex-wrap` 来设置子元素是否换行, 可取值如下: 
- **nowrap**  
  默认值, 当子元素超出其父元素大小时, 不换行。
- **wrap**  
  元素沿着侧轴方向自动换行。
- **wrap-reverse**  
  元素沿着侧轴换行, 只不过换行之后会倒序。

---

`flex-flow` 属性同时兼顾了 `flex-wrap` 和 `flex-direction`, 语法如下: 
```css
ul {
  flex-flow: flex-wrap flex-direction;
}
```
其中的两个值没有顺序要求。

---

使用 `justify-content` 来分配 **主轴** 上的**剩余空间**, 可选值如下: 
- **flex-start**  
  默认值, 表示元素沿着主轴的起始边排列。
- **flex-end**  
  表示元素沿着主轴的末尾排列。
- **center**  
  元素在主轴中水平居中排列。
- **space-around**  
  空白在每一个弹性元素元素两侧分配。
- **space-evenly**  
  空白在每一个弹性元素元素两侧平均分配。此值的兼容性不好, 使用需慎重。
- **space-between**  
  空白在弹性元素之间平均分配, 且容器两侧没有空白。

---

使用 `align-items` 来调整 **侧轴** 上的布局, 可选值如下 (以上结论的前提是没有给弹性元素设置高度) : 
- **stretch**  
  默认值, 将同一行弹性元素的高度设为一致, 但是行与行之间的高度会有所不同。
- **flex-start**  
  元素不会拉伸, 从侧轴起始边开始布局。
- **flex-end**  
  元素不会拉伸, 从着侧轴终边开始布局。
- **cnter**  
  使弹性元素垂直居中对齐。
- **baseline**  
  沿着文字的基线对齐。

---

使用 `align-content` 来分配 **侧轴** 上的**剩余空间**, 可选值如下: 
- **flex-start**  
  默认值, 表示元素靠着顶部排列。
- **flex-end**  
  表示元素沿着侧轴尾部排列。
- **center**  
  元素在主轴中垂直居中排列, 空白在上下两边。
- **space-around**  
  空白在每一个弹性元素元素上下分配。
- **space-evenly**  
  空白在每一个弹性元素元素上下平均分配。此值的兼容性不好, 使用需慎重。
- **space-between**  
  空白在弹性元素之间平均分配, 且容器上下没有空白。

---

:::warning 注意
使用 flex 布局时, 如果没有给其子元素设置 `flex-shrink`, 而且父元素的宽高小于其子元素, 那么也不会出现溢出的情况, 它的子元素会进行缩放。

**以上所有属性是给 flex 容器设置的, 而不是给 flex 元素。**
:::

### 弹性元素
弹性容器中的直接子元素就是弹性 (flex) 元素。一个元素可以同时是弹性容器和弹性元素 (即 flex 可以嵌套) 。弹性元素具有伸缩性, 可以为弹性元素设置如下属性: 
- **flex-grow**  
  用来指定弹性元素的伸展系数, 默认值为 0。当父元素有多余空间时, 将其设置为 1, 可以使它们平均分配父元素的空间, 并占满父元素。其值越大, 则分配的空间越多 (类似 Android 中的权重) 。注意, 此属性分配的是父元素的剩余空间, 然后再加上元素本来的大小。

- **flex-shrink**  
  指定弹性元素的缩小性, 默认值是 1。伸缩就是指当父元素不足以容纳其子元素时, 其子元素会进行缩小; 如果设置为 0, 则表示不缩小。其值越大, 缩小得越多。

- **align-self**  
  为每个弹性元素单独设置对齐样式, 可以覆盖其父元素的设置, 取值请参考上面的弹性容器。

- **flex-basis**  
  设置元素在主轴上的基础长度。如果设置为 100px, 则其基础长度会变成 100px。如果主轴是水平的, 则设置其基础宽度, 否则设置其基础高度。默认值是 auto, 表示参考元素自身的大小来设置。
- **flex**  
  同时设置 `flex-grow`、`flex-shrink` 和 `flex-basis`。有严格的顺序要求。一些可选值如下:    
  **initial**  
  默认值, 相当于将属性设置为 `flex: 0 1 auto`。    
  **auto**  
  这相当于将属性设置为 `flex: 1 1 auto`。  
  **none**  
  元素会根据自身宽高来设置尺寸。它是完全非弹性的: 既不会缩短, 也不会伸长来适应 flex 容器。相当于将属性设置为 `flex: 0 0 auto`。

- **order**  
  决定弹性元素的排列顺序, 其值越大, 元素排列越靠**后**。

:::warning 注意
**以上所有属性是给 flex 元素设置的, 而不是给 flex 容器。**
:::

:::tip 小贴士
移动端尽量使用 flex 来代替浮动; 而 PC 端使用需慎重, 因为兼容性问题不太好。
:::

### 导航栏 navbar 示例
  
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

## 媒体查询
当我们为页面添加响应式布局时, 就可以使用媒体查询。它是 CSS3 中的一个特性, 使用关键字 `@media`。
### 语法
在 CSS 使用 `@media{}`, 它有几个媒体类型 (即所使用的设备) 可选值: 

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
`only` 主要是用来兼容老版本的浏览器, 默认就有 only。
```css
@media only screen {
  body {
    background-color: #f60;
  }
}
```
### 媒体特性

```css
/* 当视口宽度为500px时 */
@media (width:500px) {
  body {
    background-color: #f60;
  }
}
/* 视口最大宽度为800px (小于等于800px) 时 */
@media (max-width:800px) {
  body {
    background-color: pink;
  }
}

/* 视口最小宽度为800px (大于等于800px) 时 */
@media (min-width:800px) {
  body {
    background-color: greenyellow;
  }
}
```
当网页在某个点发生页面布局上的变化时, 我们称这个点为断点。一般常用网页的断点有 768px、992px、1200px。
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
浏览器中查看 hover 样式: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd>
:::
