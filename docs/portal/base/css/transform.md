# 变形（transform）

通过 CSS 来改变元素的形状或位置，就是平移。它不会改变元素的布局（即不会脱离文档流），默认是 2D 效果，`transform` 中又可以使用如下几种方式。

## 平移（translate）

它又可以具体分为 `translate3d()`、`translateX()`、`translateY()`、`translateZ()`。X、Y、Z 分别表示往哪个方向平移，其值可正可负，可以写具体的像素，也可写百分比。当一个元素使用此属性时，它的坐标原点就是这个元素的正中心。单独使用 Z 轴时，没有任何效果，需结合 3D 或下面例子中的属性来使用。

```css
/* 设置 Z 轴方向的平移 */
body {
  border: 1px solid #ff6600;
}

html {
  /* 设置人眼到网页屏幕的距离，一般为600 - 1200 */
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
这里特别说明一下百分比的情况：  

拿 `translateX()` 来讲，如果写成 `translateX(50%)`，那么元素会**向右移动自身宽度**的 50%。其它同理。

坐标问题：   

以自身中心为原点，X 方向右正左负，Y 轴方向下正上负，Z 轴方向就是屏幕对着我们的方向为正。
:::


**使用 translate 居中：**

```css
.box {
  posstion: absolute;
  left: 50%;
  top: 50%;
  /* 多个值时，使用空格隔开 */
  transform: translateX(-50%) translateY(-50%);
}
```

**实现商品卡片位移效果：**

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

## 旋转（rotate）

同样，它也是 `transform` 中的一个函数，它也有 X、Y、Z 之分。`rotateX` 表示以 X 为轴来进行旋转，同理可得 Y、Z。其旋转的原点也是元素自身的中心，可通过 `transform-origin` 改变。当然也可以将其放在一个父元素中，时父元素来转动，如下。

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

想要旋转的效果更加真实，请务必给 `<html>` 设置 `perspective: XXXpx;`

```css
body {
  border: 1px solid #ff6600;
}
html {
  /* 设置人眼到网页屏幕的距离 (视距) ，一般为600 - 1200 */
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
  /* 先向 Y 轴转 (此时 Z 轴改变，Z 轴不再是指向我们，而是指向电脑)  */
  /* 效果就是离我们越来越远 */
  /* transform: rotateY(.5turn) translateZ(180px); */
  /* 与上面的效果相反 */
  transform: translateZ(180px) rotateY(.5turn);
  /* 设置旋转完成后，元素是否显示背景图片 */
  backface-visibility: visible;
}
```

**制作时钟动画：**

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
  /* 600/60=10s，即每十秒转一次 */
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

**相册立方体：**

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

## 缩放（scale）

该方法也是 `transform` 中的一个属性，它可以实现元素的缩放效果。它可以分为 X、Y、Z轴的方向，如果值大于 1 ，则放大，否则缩小。当然也可以为 `scale` 设置，如果 `scale` 只有一个值，则 X 和 Y方向的效果相同；如果有两个值，则第一个表示 X 方向，第二个表示 Y 方向；如果想要设置 Z 轴的缩放，则必须使用 3D 效果。

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
  width: 100%；
  height: 100%;
  object-fit: cover;
  transition: 1.5s;
}
img:hover {
  transform: scale(1.2);
}
```
## transform-origin

设置变形的原点，默认值是 `center`。不知道你有没有发现，上面的所有例子中使用到的变形都是从元素正中心开始的，那么我们可以通过这个属性来改变原点。如下：

```css
.box {
  transform-origin: 0 0;
  transform-origin: bottom;
}
```

:::warning 注意
在 `transform` 中有多个属性时，请使用空格隔开。注意了！后面的 `transform` 会完全覆盖前面的 `transform`，所以平移多个方向时，请写在同一个 `transform` 中。
:::
