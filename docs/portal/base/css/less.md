# Less

## 前言

Less 是 CSS 的预处理语言，它是 CSS 的增强版。通过 Less 可以编写很少的代码，实现更多的效果。同时，它也解决了浏览器对 CSS 的兼容性问题。

除此之外，CSS 不能更好地复用。比如我们在网页的很多地方都要使用同一个颜色，如果使用 CSS 的话，我们要重复大量的次数。其实原生 CSS 也支持变量（浏览器对此的兼容性不好，如 IE 全系列），格式如下：

```css
html {
  /* 定义变量 */
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

浏览器对 CSS 提供的计算函数 `calc()` 兼容性不好（如 IE 9以下）：

```css
body {
  hright: calc(100px/2);
}
```

接下来进入正题！

---

::: tip 提示
浏览器不能直接运行 Less，需要被编译成 CSS 之后才能使用。[Less 官网](http://lesscss.org)。
:::

---

**如何引入 Less ？**  

1. 在 VS Code 中安装插件 Easy LESS
2. 编写 style.less 样式文件
3. 只要 style.less 被保存，它就会自动生成对应的 CSS 文件，我们只需把生成后的 CSS 文件引入项目即可
4. less 中可以使用原生的 CSS

**Less 示例如下：**  

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

## 语法

- 注释 

  在 less 中可以使用 `//` 和 `/**/`。

- 变量

  - 声明变量  

    以 `@` 开头，后面跟上变量名，以分号结尾。

  - 赋值  

    使用 `:` 来给变量赋值。变量的值可以是任何类型。

    ```less
    @x:100px
    ```

  - 使用变量  

    变量作为属性时，直接使用 `@变量名`：

    ```less
    @x:100px;
    .box3 {
      width: @x;
      height: 200px;
      background-color: #ff6600;
    }
    ```

    变量作为类名或一部分值时，使用 `@{变量名}`：

    ```less
    @y:box3;
    .@{y} {
      background-color: #d3fab9;
    }
    ```

    有特殊值时，需要添加引号：

    ```less
    @z:'../img/P30.jpg';
    .@{y} {
      background-image: url('@{z}');
    }
    ```

    属性之间可以互相引用，使用 `$attr`：

    ```less
    @a:100px;
    @a:300px;
    .@{y} {
      width: @a;
      height: $width;
    }
    ```

- 变量重名  

  变量重名时，使用就近原则。

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

  使用 `&`，它就代表了其最外层的元素：

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
  
  当有一些共有的样式时，我们可以使用继承，使用 `:extend(selector)`。

  ```less
  .p1 {
    width: 200px;
    height: 200px;
  }
  .c1:extend(.p1) {
    font-size: 18px;
  }
  ```

  等价的 CSS 如下：

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

  另一种继承的方式如下：

  ```less
  .c3 {
    .c1();
  }
  ```

  另一种更加方便的样式，使用混合 mix，类似 Java 中接口的方法：

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

  等价的 CSS 如下：

  ```css
  .c6 {
    width: 50px;
    height: 50px;
    background: #dddddd;
  }
  ```

  我么发现，只生成了 .c6 的样式。

- 混合函数

  在混合函数中可以设置变量，类似 Java 中的方法，可以有参，也可以无参；但是函数不能是标签选择器。

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

  等价的 CSS 如下：

  ```css
  #box {
    width: 200px;
    height: 200px;
    background-color: #ccc;
  }
  ```

  当然，在参数中也可以使用默认值：

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

  在 less 中，我们可以使用一些基本运算。

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

  所以，可以使用此方式来进行模块化，如变量、动画、布局等。

## 调试

网页中显示的是 CSS 文件，而我们编写的是 less 文件，那么如何快速找到它们之间的对应关系呢？这就需要我们在 Easy LESS 中进行配置了，在插件的 `settings.json` 中配置：

```json
{
  "less.compile": {
    "compress":  false,  // 是否压缩 CSS 代码
    "sourceMap": true,  // 在网页中是否显示样式在less文件中的位置
    "out":       true, // 是否生成 CSS 文件
  }
}
```

修改完成后重新保存 less 文件，这时会多出一个 .map 文件，然后在网页中进行测试即可。
