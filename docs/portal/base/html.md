---
sidebar: ['/portal/base/html.html']
---

# HTML

##  标签
### head
该标签中的内容不会显示在网页中, 它只是帮助浏览器解析网页。

### title
浏览器在解析网页时, 会首先检索 `title` 标签中的内容, 对于搜索引擎来讲, 它是最重要的部分, 它会影响到网页在搜索引擎中的排名。

### body
网页中所有可见的内容都必须写在 `body` 标签中。

### 文档声明
现在市面上流行的 HTML 版本不止 HTML5, 还有其它的, 那么, 对于不同的 HTML 标准, 浏览器是怎样来识别的呢？这时候, 就要用到文档声明了, HTML5 标准的文档声明为 `<!DOCTYPE HTML>`（忽略大小写）。

### 乱码问题
中文系统中的浏览器默认采用的是 GB2312 解码模式, 而大部分的编辑器采用的是 UTF-8 的编码, 所以可能导致网页出现乱码。只需要告诉浏览器我们使用的编码格式即可, 如下：
```html
<meta charset="utf-8"/>
```
使用系统的记事本时, 文件保存时, 它的编码默认为 ANSI , 就是自动的意思。即在中文系统中采用 GB2312, 而在英文的系统中可能就采用其它相应的。所以, 使用记事本编码时, 不会乱码。

### meta

- 设置网页的关键字  

  ```html
  <meta name="keywords" content="html,H5,JavaScript"/>
  ```
- 设置网页的描述信息  

  ```html
  <meta name="description" content="发布前端信息"/>
  ```
- 网页重定向  

  在上网时, 我们经常会发现网站有一个功能, 如 "5秒后即将跳转", 这个就可以使用 `meta` 标签来实现。
  ```html
  <meta http-equiv="refresh" content="5;url=:http://www.baidu.com"/>
  ```

:::tip 提示
meta 标签的更多信息请见 [w3cschool](https://www.w3school.com.cn/tags/tag_meta.asp)
:::


### 标题

HTML 中共有 6 个标题标签, 从 `h1` 到 `h6`。其中 `h1` 最重要, 它仅次于 `title` 标签, 即当浏览器的搜索引擎检索完 `title` 标签后, 会立即检索 `h1` 标签。但是请注意, 一个页面最多只能有一个 `h1` 标签, 如果存在很多 `h1` 标签, 则该网站可能被当成垃圾网站（即浏览器检索时会自动忽略该网站）。网页中一般只使用 `h1` 到 `h3` 的标签。

### 空格问题
在 HTML 中, 再多的空格也会被解析成一个空格, 回车键也会被解析成一个空格。

### hr

该标签会生成一条水平线。
```html
<hr />
```

### 标签转译问题

html 中所有的标签都是字母开头的, 如果想要在页面显示 < 或 > 符号, 那么, 只有数字可以直接写, 如下：
```html
<1>
```
以上代码中, 页面会显示 <1>, 而不会把它当成一个标签, 但是, 里面如果是字母, 则要使用 `&lt;`  或 `&gt;` 的形式
```html
&lt;b&gt;
```
### b

`<b>` 标签规定粗体文本。所有浏览器都支持 `<b>` 标签。

:::tip 提示
根据 HTML5 规范, 在没有其他合适标签更合适时, 才应该把 `<b>` 标签作为最后的选项。HTML5 规范声明：应该使用 `<h1>` - `<h6>` 来表示标题, 使用 `<em>` 标签来表示强调的文本, 应该使用 `<strong>` 标签来表示重要文本, 应该使用 `<mark>` 标签来表示标注的/突出显示的文本。  

您也能够使用 CSS 的 `font-weight` 属性来设置粗体文本。
:::

### 实体

1. `&nbsp;` 表示不换行的空格
2. `&copy;` 表示版权符号

:::tip 提示
HTML实体的更多信息请见 [w3cschool](https://www.w3school.com.cn/html/html_entities.asp)
:::

### img
该标签的 `alt` 属性可以被搜索引擎搜索。也可以设置它的 `width` 和 `height` 属性, 当只设置其中的一个时, 另一个属性也会按照原始比例缩放。

### xhtml 语法规范

1. HTML 中不区分大小写, 但是, 建议使用小写
2. 注释不能嵌套
3. HTML 标签的结构必须完成, 要么成对出现, 要么自结束
4. HTML 标签可以嵌套, 但是不能交叉嵌套
5. HTML 标签中的属性必须有值, 且值必须加引号（单和双都可）；个别属性除外

以上的规矩不一定都要遵守, 比如标签的自结束可以有以下两种写法：
```html
<br /><!--xhtml中的规范-->
<br><!--H5 中的规范-->
```
### 内联框架
在一个页面中要引入另一个页面, 我们可以使用内联框架, 但是不推荐使用, 因为内联框架中的内容不会被搜索引擎检索。
```html
<iframe src="demo02.html"></iframe>
```
### a
`target` 属性用来指定打开超链接的位置, 该属性的取值如下：
- `_self`  

  在当前窗口中打开, 默认就是_self

  当然, `target` 属性也可以设置为内联框架中打开, 其值就是内联框架的 `name` 属性值。也可以使用 `a` 标签来发送邮件, 它会默认打开计算机的邮件客户端。
  ```html
  <a href="mailto:1249954968@qq.com">发送邮件</a>
  ```
:::tip 提示
`a` 标签的更多信息请见 [w3cschool](https://www.w3school.com.cn/tags/tag_a.asp)
:::

### center
对其所包括的文本进行水平居中。不推荐使用, 请使用 CSS 样式来居中文本！

### span
通常用此标签来为文字设置样式。

### em
该标签一般用来强调着重点, 该标签默认显示为斜体。

### i
该标签默认显示为斜体, 没有任何语义；通常用来设置 icon。

### strong
通常用来表示内容的重要性, 该标签默认显示为粗体。

### small
该标签中的文字比它父元素的文字要小, 通常用来表示细则（如合同中的小字、网站的版权声明等）。
```html
<p>
    pTag
    <small>smallTag</small>
</p>
```
### cite

用来设置引用, 网页中的所有加书名号的文字都可以用它来包裹, 它表示参考的内容；有斜体的样式。
```html
<p>
  <cite>《JavaScript权威指南》</cite>
  是一本前端红宝书
</p>
```
效果如下: 
<p>
  <cite>《JavaScript权威指南》</cite>
  是一本前端红宝书
</p>

### q
用来设置引用, 引用别人的文章或话等。它会给文字加上双引号, 实际上是用伪元素来给前后添加的引号；它是一个行内元素。
```html
<q>With more power, With more responsibility</q>
```
效果如下:   
<q>With more power, With more responsibility</q>

### blockquote

它也是一个引用, 只不过它是一个块元素, 而且不会给文字加引号。
```html
<blockquote>学而时习之, 不亦说乎</blockquote>
```

### sub、sup

sub 表示下标, sup 表示上标。
```html
<p>H<sub>2</sub>O</p>
<p>X<sup>2</sup></p>
```
### del

```html
<p>17.00 <small><del>30.00</del></small></p>
```

### ins

它表示插入的内容, 有下划线。
```html
<p><ins>插入的内容</ins></p>
```

### code

该标签中的内容表示一个代码片段, 如博客中的代码。可以和 `pre` 标签一起使用。
```html
<code>
  window.onload = function(){
    alter("hello world!")
  };
</code>
```

### pre

它会将标签中的内容以原格式输出。
```html
<pre>
  window.onload = function(){
    alter("hello world!")
  };
</pre>
```

### ul

通过它的 `type` 属性可以设置列表前面的样式, 但是不建议使用, 请使用 CSS 代替。它和 `li` 都是块元素。

:::tip 提示
`ul` 标签的更多信息请见 [w3cschool](https://www.w3school.com.cn/tags/tag_ul.asp)
:::

### ol

通过它的 `type` 属性可以设置列表前面的样式, 它和 `li` 都是块元素。`type` 可取的一些值如下（它规定在列表中使用的标记类型）: 
- `1`
- `A`
- `a`
- `I`
- `i`

:::tip 提示
列表可以嵌套, 且 `li` 里面可以嵌套 `ul` 和 `ol`。
:::

### dl

它表示自定义列表, 它的子元素有 `dt` 和 `dd`。`d1`、`dt`、`dd` 都是块元素。
```html
<dl>
  <dt>手机</dt>
  <dd>小米</dd>
  <dd>华为</dd>
  <dt>衣服</dt>
  <dd>长袖</dd>
  <dd>短袖</dd>
</dl>
```
:::tip 提示
`dl` 也可以嵌套 `ul` 和 `ol`, `dt` 和 `dd` 也能嵌套其它列表。
:::

### table

使用 `<table></table>` 标签, 每一行使用 `<tr></tr>`, 单元格使用 `<td></td>`。表格被创建后默认是没有边框的。

### form

使用表单时, 必须给里面的输入框设置 `name` 属性, 因为后台要通过它来取值。下拉列表 `selection` 的 `name` 要给 `selection` 设置, 而 `value` 要给 `option` 设置。可以使用 `<optgroup>` 给下拉列表进行分组：
```html
<selection>
  <optgroup lable="蔬菜">
    <option>黄瓜</option>
  </optgroup>
</selection>
```
使用 `<textarea>` 设置文本域。使用 `<label></label>` 用来设置提示文字: 
```html
<form action="">
  <label for="username">用户名：</label>
  <input type="text" id="username"><br>
  <label for="password">密码：</label>
  <input type="password" id="password"><br>
  <input type="radio" id="r1"><label for="r1" name="rr">男</label>
  <input type="radio" id="r2"><label for="r2" name="rr">女</label>
</form>
```
使用 `<fieldset>` 来对表单项进行分组：
```html
<form>
  <fieldset>
    <legend>基本信息</legend>
    <label for="username">用户名：</label>
    <input type="text" id="username"><br>
    <label for="password">密码：</label>
    <input type="password" id="password"><br>
  </fieldset>
  <fieldset>
    <legend>爱好</legend>
    <input type="radio" id="r1"><label for="r1" name="rr">男</label>
    <input type="radio" id="r2"><label for="r2" name="rr">女</label>
  </fieldset>
</form>
```
### audio

```html
<!-- 引入音频文件 -->
<!-- 该文件可以是一个网站中的文件 -->
<!-- 默认不会自动播放, 需要加上 controls -->
<!-- 使用 autoplay 来自动播放, 但是大部分浏览器不会自动播放-->
<!-- IE8 不支持 -->
<audio src="audio/羽肿 - Windy Hill.mp3" controls autoplay></audio>
<!-- 另一种引入方法 -->
<audio controls>
  <!-- 在 IE8 中给出提示 -->
  对不起, 您的浏览器不支持该音频播放器, 请升级浏览器。
  <!-- 以下中只会使用第一个能够使用的, 用来解决兼容性 -->
  <source src="audio/羽肿 - Windy Hill.mp3" type="">
  <source src="audio/羽肿 - Windy Hill.mp3" type="">
</audio>
<!-- 兼容IE8, 默认会自动播放 -->
<!-- 此标签必须制定width和height -->
<embed src="audio/羽肿 - Windy Hill.mp3" type="audio/mp3" width="300px" height="200px" />

<audio controls>
  <!-- 以下中只会使用第一个能够使用的, 用来解决兼容性 -->
  <source src="audio/羽肿 - Windy Hill.mp3" type=""/>
  <source src="audio/羽肿 - Windy Hill.mp3" type=""/>
  <embed src="audio/羽肿 - Windy Hill.mp3" type="audio/mp3" width="300px" height="200px" />
</audio>
```
### video

```html
<!-- 引入视频 -->
<video controls>
  <source src="" type=""/>
  <embed src="" type="">
</video>
<!-- 引入腾讯视频（复制通用代码） -->
<iframe frameborder="0"src="https://v.qq.com/txp/iframe/player.html?vid=y00247fi2c" allowFullScreen="true" width="600px"height="300px"></iframe>
```

###  其它更多标签

:::tip 提示
请见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
:::

:::warning 思考
您真的知道 `<html>` 和 `<body>` 的区别吗？

[对html与body的一些研究与理解](https://www.zhangxinxu.com/wordpress/2009/09/%E5%AF%B9html%E4%B8%8Ebody%E7%9A%84%E4%B8%80%E4%BA%9B%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%90%86%E8%A7%A3/)
:::

## 框架集
`<frameset></frameset>` 与内联框架不同, 它可以引用多个框架。有了 `<frameset></frameset>` 就不能有 `<body></body>` 标签。**值得注意的是, 框架集已被弃用。**


## DOM 的嵌套规则
1. 内联元素（行内元素）不能包含块元素, 它只能包含其它的内联元素
2. 块级元素（包括 `p` 标签）不能放在 `<p>` 里面
3. 有几个特殊的块级元素只能包含内联元素, 不能再包含块级元素, 这几个特殊的标签是：`h1`、`h2`、`h3`、`h4`、`h5`、`h6`、`p`、`dt`
4. `li` 内可以包含 `div`、`ul`、`ol` 等块元素 
5. 特殊的是, a 标签可以包含任何元素, 但是不能包含 `a` 标签

:::tip 说明
H5 中已经没有块元素和行元素的说法了。
:::

