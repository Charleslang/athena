# 项目中遇到的问题

- 时间格式化。在 js 中，默认没有提供时间格式化的 API，我们可以使用第三方提供的时间库。如 dayjs、moment.js。

- 混入（mixin）。什么是混入，相当于继承，可以将对象中的公共属性，方法等提取出来。在项目中的 Home 和 GoodsDetail 中用到了混入。更多请见 Vue 官网。

- `$nextTick()$`。当 DOM 被渲染完成之后，会调用这个函数，即会执行这个函数中的回调函数。
  ```js
  this.$nextTick(() => {
    // ...
  })
  ```
- DOM 渲染完成不等于网络请求完成，网络请求完成不等于图片加载完成。

- better-scroll 的滚动 bug（不是突然不能滚动，而是在鼠标滑动的一瞬间出现抖动），可以通过设置 `probeType` 为 `2` 或 `3` 来解决。

- 封装自己的插件 `toast`

  ```js
  // main.js

  import Vue from 'vue'
  import App from './App.vue'
  import router from './router/index'
  import store from './store/store'

  import toast from 'components/common/toast'

  Vue.config.productionTip = false

  Vue.prototype.$bus = new Vue()

  // 在使用 use 方法时，Vue 会自动调用插件的 install 方法
  Vue.use(toast)

  new Vue({
    render: h => h(App),
    router,
    store
  }).$mount('#app')
  ```
  ```js
  // toast/index.js

  import Toast from './Toast'

  const obj = {}

  obj.install = function (Vue) {
    const toastConstructer = Vue.extend(Toast)
    const toast = new toastConstructer()
    toast.$mount(document.createElement('div'))
    document.body.appendChild(toast.$el)
    Vue.prototype.$toast = toast
  }

  export default obj
  ```

- 解决移动端 `300 ms` 延迟，使用 `fastclick`

  ```sh
  npm install fastclick --save
  ```
  然后只需在 `main.js`  中使用即可。
  ```js
  // main.js

  import FastClick from 'fastclick'

  FastClick.attach(document.body)
  ```

- 图片懒加载 `vue-lazyload`

  ```sh
  npm inatall vue-lazyload --save
  ```
  ```js
  // main.js

  import VueLazyLoad from 'vue-lazyload'

  // 后面的配置项是可选的
  Vue.use(VueLazyLoad, {
    loading: require('./assets/img/common/placeholder.png')
  })
  ```
  ```html
  <img v-lazy="item.image">
  ```
  :::tip 提示
  见 [vue-lazyload](https://github.com/hilongjw/vue-lazyload)。
  :::

- 移动端适配，`px2vw` 插件

  ```sh
  npm install postcss-px-to-viewport --save-dev
  ```
  然后在项目根路径下创建文件 `postcss.config.js`，内容如下：
  ```js
  module.exports = {
    plugins: {
      autoprefixer: {},
      "postcss-px-to-viewport": {
        viewportWidth: 375, // 视口的宽度，对应的是设计稿的宽度 / 2，一般为 750
        viewportHeight: 667, // 视口的高度，对应的是设计稿的高度（也可以不配置）
        unitPrecision: 5, // 指定 ‘px’ 转换为视口单位值的小数位数（很多时候无法整除）
        viewportUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
        selectorBlankList: ['ignore', 'tab-bar', 'tab-bar-item'], //指定不需要转换的类，其实是通配（如 tab-bar-xx 也可）
        minPixelValue: 1, // 小于或等于 ‘1px’ 不转换为视口单位
        mediaQuery: false, // 是否允许在媒体查询中转换为 ‘px’
        exclude:[/Tabbar/, /TabBarItem/] // 不需要转化的组件文件名正则，必须是正则表达式
      }
    }
  }
  ```
  
  :::tip 参考
  [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)。
  :::

- axios 使用 POST 传参，后端获取到的参数始终为空  
  
  ```sh
  # 安装 qs
  npm install qs
  ```
  ```js
  import {doPost} from 'utils/request'
  import qs from 'qs'

  export function loginWithPwd({account, password}) {
    return doPost({
      url: '/login/ap',
      // 解决 POST 传参后台无法接收
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: qs.stringify({
        account,
        password
      })
    })
  }
  ```

- 不发送请求  

  **描述**：前端在带有参数的情况下，不会向后台发送请求（使用了 qs），但是不带参数就能发送。  
  **解决**：查看是否引入了 qs 模块（不引入的话也不会报错，坑）。
