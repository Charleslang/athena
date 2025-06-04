# 简介

ECMAScript 是 JavaScript 的标准，JavaScript 是 ECMAScript 的实现，可以认为 JavaScript 包含 ECMAScript、DOM、BOM。而不同的浏览器厂商需要实现各自的 ECMAScript，即 JS 引擎。常见的有 Chrome 的 V8 引擎，这也是最快的引擎，所谓最快就是打开相同的网页时，Chrome 花费的时间最少。

## 特点

- 解释型语言。所谓解释型语言就是，编码之后无需经过编译就能直接运行。
- 动态语言。
- 基于原型的面向对象。
- JS 是单线程的，先执行初始化代码，然后再执行其它代码。

## 编写位置

除了在 `<script></script>` 标签中编写外，还可以在其它事件中编写。如下： 

- 在 `onclick` 等里面
  
  ```html
  <button onclick="alert('点击成功');">点击</button>
  ```

- 在 `href` 中  

  ```html
  <a href="javascript:alert('点击成功');">点击</a>
  ```
  