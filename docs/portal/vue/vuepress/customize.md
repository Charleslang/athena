# 个性化
## 404

首先，你需要有一个如下所示的目录结构（不是强制的，只要你能找到对应目录即可）：

```
docs
|-- .vuepress
    |-- public
        |-- images
            |-- 404
                |-- 404_cloud.png
                |-- 404.png
    |-- theme
        |-- components
            |-- 404.vue
        |-- index.js
vuepress.config.js        
```

- `vuepress.config.js`

```js
import { localTheme } from './docs/.vuepress/theme'

export default {
  lang: 'zh-CN',
  title: 'VuePress', 
  // 使用自定义主题
  theme: localTheme({
    colorMode: 'auto', 
    colorModeSwitch: true, 
    home: '/',
    navbar: [
      {
        text: '指南',
        link: '/guide/', 
        activeMatch: '/guide/'
      }
    ],
  }),
}
```
- `docs/.vuepress/theme/index.js`

```js
import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export const localTheme = (options) => {
  return {
    name: 'vuepress-theme-local',
    // 继承默认主题
    extends: defaultTheme(options),
    // 覆盖 404 界面
    layouts: {
      404: path.resolve(__dirname, 'components/404.vue'),
    },
  }
}
```
- `docs/.vuepress/theme/components/404.vue`
```vue
<!-- VuePress2.x 中自定义组件需要使用 Vue3 的语法 -->
<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="../../public/images/404/404.png" alt="404">
        <img class="pic-404__child left" src="../../public/images/404/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="../../public/images/404/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="../../public/images/404/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">抱歉!</div><br>
        <!-- <div class="bullshit__info">All rights reserved
          <a style="color:#20a0ff" href="https://wallstreetcn.com" target="_blank">wallstreetcn</a>
        </div> -->
        <div class="bullshit__headline">{{ message }}</div>
        <h4 class="code">错误代码: 404</h4>
        <div class="bullshit__info">请检查您输入的网址是否正确，或者点击下面的按钮返回主页.</div>
        <div class="bullshit__return-home">
          <a href="/">返回主页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const message = '你访问的页面走丢了...'
</script>

<style lang="scss" scoped>
  .code {
    margin: 15px 0;
  }
  .wscn-http404-container{
    transform: translate(-50%,-50%);
    position: absolute;
    top: 40%;
    left: 50%;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .wscn-http404 {
    position: relative;
    padding: 0 50px;
    overflow: hidden;
    .pic-404 {
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;
      &__parent {
        width: 100%;
      }
      &__child {
        position: absolute;
        &.left {
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }
        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        @keyframes cloudLeft {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }
          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }
          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }
          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }
        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }
          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }
          70% {
            top: 130px;
            left: 180px;
            opacity: 1;
          }
          100% {
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }
        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }
          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }
          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }
          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }
    .bullshit {
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;
      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #1482f0;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
        a {
          color: #fff;
        }
      }
      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>
```
> **语法参考：**  
> [extends](https://v2.vuepress.vuejs.org/zh/reference/theme-api.html#extends)

> **配置参考：**  
> [布局插槽](https://v2.vuepress.vuejs.org/zh/reference/default-theme/extending.html#%E5%B8%83%E5%B1%80%E6%8F%92%E6%A7%BD)

## 组件替换

我们可以借助 [布局插槽](https://v2.vuepress.vuejs.org/zh/reference/default-theme/extending.html#%E5%B8%83%E5%B1%80%E6%8F%92%E6%A7%BD) 来实现组件替换。

比如，我现在想让所有的页面都加上一个 footer，那么，我们就可以使用插槽来进行替换。

- `.vuepress/theme/layouts/Layout.vue`
```vue
<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="footer" id="app-page-bottom">
        <div class="footer-container">
          <div class="footer-text">
            [ 吾尝终日而思矣
            <span class="footer-text-icon">
              <span class="iconfont icon-shandian1"></span>
            </span>
            不如须臾之所学也 ]
          </div>
          Copyright © 2021-present Junfeng Dai <br> 
          <a href="https://beian.miit.gov.cn" class="record-num" target="_blank">蜀 ICP 备 2021009537 号 - 1</a>
        </div>
      </div>
    </template>
  </ParentLayout>
</template>

<script setup>
  import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
</script>

<style lang="css" scoped>
  #app-page-bottom {
    position: relative;
    padding: 1rem 0 0;
    max-width: var(--content-width);
    margin: 0 auto;
    text-align: center;
    overflow: auto;
    background: var(--c-bg);
  }
  #app-page-bottom .footer-container {
    margin-bottom: 0;
  }
</style>
```
- `.vuepress/theme/index.js`
```js
import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export const localTheme = (options) => {
  return {
    name: 'vuepress-theme-local',
    // 继承默认主题
    extends: defaultTheme(options),
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
    },
  }
}
```
- `.vuepress/config.js`
```js
import { localTheme } from '../theme'

export default defineUserConfig({
  theme: localTheme({
    // 默认主题配置项
  }),
})
```