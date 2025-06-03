# 字体

## 样式

大部分浏览器的默认字体大小为 16px。给文字设置大小时，实际上是设置的字体的高度，其宽度会自适应。

- `font-style`  
- `font-weight`
- `font-variant`  
  
  用于设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写字体的字母与其余文本相比，其字体尺寸更小。

  ```html
  <p class="p1" style="font-variant: small-caps;">p标签ABDdeg</p>
  ```

  效果如下：

  <p class="p1" style="font-variant: small-caps;">p标签ABDdeg</p>

- `font`  
  
  在一个声明中设置所有字体属性，可以按顺序设置如下属性：

  - `font-style`
  - `font-variant`
  - `font-weight`
  - `font-size/line-height`
  - `font-family`  

  注意，如果没有使用这些关键词，至少要指定字体大小和字体系列，未设置的属性会使用其默认值。  

  ```css
  p.ex2 {
    font: italic bold 12px/20px arial,sans-serif;
  }
  ```

  :::tip 提示
  更多信息，请见 [w3cschool](https://www.w3school.com.cn/cssref/index.asp#font)。
  :::

- `line-height`  

  使用 `line-height` 来设置行高，而文字在行高中会垂直居中。在 CSS 中，并没有直接提供设置文字行距的样式，我们只能通过设置行高来间接设置。如果将行高设置为 100%，则它会和该标签的 `font-size` 一致（支持继承）; 如果将行高设置为数字（例如 2），则它会是该标签 `font-size` 的 2 倍（支持继承）。在父元素中将 `line-height` 设置为父元素的高度，则它的文本会垂直居中（只针对单行文本）。

  :::warning 注意
  如果 `line-hright` 属性被设置在 `font` 属性之前，而在 `font` 中没有设置行高的话，那么行高始终是字体的大小。因为 `font` 属性中也能设置行高，不设置的话会使用默认值。同理 `font-weight` 等也是这样。
  :::

- 使用外部字体  

  如果用户的计算机中没有某种字体样式，而我们又想用这种字体。那么，我们可以将这种字体下载下来（不用安装），然后拖入项目中的一个文件夹中（假设是 `fonts` 文件夹），最后通过 CSS 引入：

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

- 图标字体  
  
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

- 字体对齐  
  
  - **`text-align`**  
    
    使文字水平对，见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align)。

  - **`vertical-align`**  
    
    用来指定行内元素（`inline`）或表格单元格（`table-cell`）元素的垂直对齐方式。该值默认是 `baseline`（基线），就像作业本下面那条线，即默认是底部对齐。

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

    注意，当取值为 `middle` 时，它是使元素的中部与父元素的基线加上父元素 `x-height`（即字母 x 的高度）的一半对齐。更多请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)。
    
    提示！当使用 `<img>` 标签时，它会出现底部有缝隙的情况，这时候就可以为它设置 `vertical-align`（此值只要不是 `baseline` 就可以）。

    ```css
    img {
      vertical-align: middle;
    }
    ```

    另外，给块元素设置垂直居中也能使用 `vertical-align`（但是默认不支持）。

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

## 分类

在网页中，将字体分为五大类：

- `serif`（衬线字体） 
- `sans-serif`（非衬线字体） 
- `monospace`（等宽字体） 
- `cursive`（草书字体）
- `fantasy`（虚幻字体）   

这些大的分类中又有许多小的分类，我们可以直接将字体的样式设置为这五个大类，浏览器会自动选择该类中的一种字体。
