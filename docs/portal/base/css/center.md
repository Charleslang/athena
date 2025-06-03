# 居中

- 水平居中

  方式一就是直接使用 `margin: 0 auto;`, 方式二是使用绝对定位：

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

  /* 此方式仅使用于设置了元素的宽高 ，另一种居中方式请见 笔记的 translate  */
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

- 垂直居中  

  方式一也是使用绝对定位：
  
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
    /* 此方式仅使用于设置了元素的宽高 ，另一种居中方式请见 笔记的 translate  */
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

- 垂直水平都居中  

  综合了以上两种方式：

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

  /* 此方式仅使用于设置了元素的宽高 ，另一种居中方式请见 笔记的 translate  */
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

使用 `margin: 0 auto;` 时，该元素必须设置 `width` 属性。
