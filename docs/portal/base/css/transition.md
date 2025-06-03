# 过渡（transition）

`transition` 又可以分为 `transition-delay`、`transition-duration`、`transition-property`、`transition-timing-function`。

- **`transition-property`**  

  指定要执行过渡效果的属性。多个属性用逗号隔开，过渡所有属性时可以使用 `all`。大部分属性（如颜色、`margin`、`padding`等）都支持过渡效果。但是，要过渡的属性必须是可计算的值（如 700px）。

  ```css
  .box {
    transition-property: width, height;
  }
  ```

- **`transition-duration`**  

  指定过渡效果的持续时间，单位可以是 s 或 ms。过渡多个属性时，可用逗号隔开。

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

  将以上几个综合起来，没有顺序要求。但是，如果同时设置了过渡时间和延迟时间，则会把第一个当做过渡时间。

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
    /* 指定过渡的方式，默认值是ease，慢->快->慢 */
    /* transition-timing-function: ease; */
    /* 线性，匀速 */
    /* transition-timing-function: linear; */
    /* 慢->快 */
    /* transition-timing-function: ease-in; */
    /* 慢->快->慢 */
    /* transition-timing-function: ease-in-out; */
    /* 通过贝塞尔曲线指定，其实上面的几种都是。 */
    /* transition-timing-function: cubic-bezier(.17,.67,.9,.25); */
    /* 分步执行过渡效果，就是在过渡时间内只走指定的步数而到达终点 */
    /* 第二个值默认值 end，表示在每time/steps (s) 结束时才执行 */
    /* 如果第二个参数是start，表示在每time/steps (s) 开始时就运动 */
    /* transition-timing-function: steps(3,start); */
    /* 过渡动画延迟 xx 后才执行 */
    transition-delay: 2s;
    /* 没有顺序要求 */
    /* 第一个时间是持续时间，第二个是延迟时间 */
    transition: margin-left 2s;
    
  }

  /* 当鼠标移入d1时，改变d2的宽高 */
  .d1:hover div {
    /* width: 200px;
    height: 200px; */
    margin-left: 700px;
  }

  .d3 {
    background: cornflowerblue;
    transition-property: margin;
    transition-duration: 3s;
    /* 指定过渡的方式，默认值是 ease, 慢->快->慢*/
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
  使用过渡时，必须要指定过渡属性和过渡的时间。
  :::

- **实现走动效果**

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
