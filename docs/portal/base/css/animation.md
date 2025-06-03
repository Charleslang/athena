# 动画（animation）

动画可以自动触发，而过渡只有在条件满足时才会触发。设置动画效果必须要先设置关键帧，关键帧规定了动画执行的每一个步骤，使用 `@keyframes` 定义关键帧。

```css
/* 给动画取名为 myAnimation */
@keyframes myAnimation {
  /* 动画开始位，也可以用0%表示 */
  from {
    margin-left: 0;
  }
  
  /* 0% {
      margin-left: 0;
  } */
  /* 动画结束位，也可以使用100% */
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

  设置动画执行的次数。可以直接指定次数，也可以使用系统自带的 `infinite` 表示无限次。

- animation-direction  

  指定动画执行的方向。默认值是 `normal`，即每次都是从 `from` 到 `to`。`reverse` 每次都是从 `to` 到 `from`，即反向执行。`alternate` 开始时从 `from` 到 `to`，但是如果重复执行，则会有反弹效果。`alternate-reverse` 与 `alternate` 相似，但是刚开始是从 `to` 到 `from`。

- animation-play-state  

  设置动画的执行状态。`running`，默认值，表示动画执行。`paused` 表示动画暂停。

- animation-fill-mode  

  动画的填充模式，默认值为 `none`，即动画执行完毕后，元素回到初始位置。`forwards`，动画执行完毕后，元素停止在动画结束位置。`backwards`，动画延迟等待时，元素就会处于 `from` 的形式。`both`，结合了 `backwards` 和 `forwards`。

  ```css
  .d2 {
    background-color: #ff6600;
    margin-bottom: 50px;
    margin-left: 0;
    
    /* 动画可以自动触发，而过渡只有在条件满足时才会触发 */
    /* 设置动画效果必须要先设置关键帧 */
    /* 关键帧规定了动画执行的每一个步骤，使用@keyframes */
    /* 动画名称 */
    animation-name: myAnimation;
    /* 动画的时间 */
    animation-duration: 2s;
    /* 动画延迟 */
    /* animation-delay: 1s; */
    animation-timing-function: ease-in;
    /* 设置动画执行的次数 */
    /* 可以直接指定次数，也可以使用系统自带的 */
    /* infinite表示无限次 */
    animation-iteration-count: infinite;

    /* 指定动画执行的方向 */
    /* 默认值是normal，即每次都是从 from 到 to */
    /* reverse 每次都是从 to 到 from，即反向执行 */
    /* alternate 开始时从 from 到 to，但是如果重复执行，则会有反弹效果 */
    /* alternate-reverse 与alternate相似，但是刚开始是从 to 到 from */
    animation-direction: alternate-reverse;

    /* 设置动画的执行状态 */
    /* running，默认值，表示动画执行 */
    /* paused，动画暂停 */
    /* animation-play-state: paused; */

    /* 动画的填充模式，默认值为none */
    /* 默认值为none，即动画执行完毕后，元素回到初始位置 */
    /* forwards，动画执行完毕后，元素停止在动画结束位置*/
    /* backwards，动画延迟等待时，元素就会处于 from 的形式 */
    /* both，结合了 backwards 和 forwards*/
    animation-fill-mode: both;
  }
  ```

## 人物走动

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
    /* 此处可以直接设置为 -528px，因为图片默认会平铺 */
    background-position: -528px 0;
  }
}
```
```html
<div class="nav"></div>
```

## 小球跳动1

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

## 小球跳动2

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
