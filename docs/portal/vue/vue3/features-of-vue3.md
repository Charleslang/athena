# Vue3 新变化
## 插槽语法糖
在 Vue2 中，我们使用 `v-slot:name` 来替换插槽，如下：
- `Demo1.vue`
```vue
<template>
  <slot name="slot1"></slot>
  <slot name="slot2"></slot>
</template>

<script>
  export default {
  
  }
</script>

<style>

</style>
```
- `App.vue`
```vue
<template>
  <Demo1>
    <template v-slot:slot1>
      <span>插槽1替换</span>
    </template>
    <template v-slot:slot2>
      <span>插槽2替换</span>
    </template>
  </Demo1>

</template>

<script>
  import Demo1 from './components/Demo1.vue'
  export default {
    components: {
      Demo1
    }
  }
</script>

<style>
</style>
```
在 Vue3 中，可以使用 `#` 来替换 `v-slot`，如下：
```vue
<template>
  <Demo1>
    <template #slot1>
      <div>插槽1替换</div>
    </template>
    <template #slot2>
      <span>插槽2替换</span>
    </template>
  </Demo1>
</template>
```

## Fragment 片段

在 Vue2 中，组件必须有一个根标签。而在 Vue3 中，组件可以没有根标签，内部会将多个标签包含在一个 Fragment 虚拟元素中，这样的好处是减少标签层级，减小内存占用。

## Teleport 组件
Teleport 也称为传送门，它的作用是把嵌套陈词较深的元素移动到其它 html 元素内。比如 `App.vue` 中使用了 `Child.vue`，`Child.vue` 中使用了 `Son.vue`，`Son.vue` 中有一个弹窗，如果没有特殊处理，那么这个弹窗的展示会影响 `Son` 元素的所有父组件（如宽高拉伸）。为了更加方便解决这个问题，我们可以使用 Vue3 中提供的 `<teleport>` 标签，如下：

- `Son.vue`
```vue
<template>
  <div class="son">
    <span>孙子组件</span>
    {{ data }}
  </div>
  <!-- 把 teleport 中的内容放入 body 元素中, 当然也能写 css 选择器 -->
  <teleport to="body">
    <h1>Son 的元素</h1>
  </teleport>
  
  <teleport to="#container">
    <h1>Son 的元素</h1>
  </teleport>
</template>
```
## Suspense 组件
该方法用于异步（动态）引入组件。Suspense 是一个试验性的新特性，其 API 可能随时会发生变动。

```vue
<template>
  <div class="app">
    <h2>App.Vue</h2>
    {{ data }}
    
    <!-- 使用 Suspense 组件 -->
    <Suspense>
    
      <!-- 异步组件加载成功时显示的内容 -->
      <template #default>
        <Child></Child>
      </template>
      
      <!-- 异步组件加载失败时显示的内容 -->
      <template #fallback>
        <h2>Child 组件加载中...</h2>
      </template>
    </Suspense>
  </div>
</template>

<script>
  import { reactive } from '@vue/reactivity'
  // import Child from './components/Child' // 同步引入
  import { defineAsyncComponent, provide } from '@vue/runtime-core'

  let Child = defineAsyncComponent(() => import('./components/Child')) // 异步引入

  export default {
    components: {
      Child
    },

    setup() {
      let data = reactive({
        name: 'zs',
        age: 23,
      })

      return {
        data
      }
    }
  }
</script>

<style>
  .app {
    background: blue;
    height: 500px;
    color: #fff;
  }
</style>

```

如果使用了异步方式来引入组件，那么 `setup` 函数可以返回一个 Promise，如下：

- `Child.vue`
```vue
<template>
  <div class="child">
    <span>子组件</span><br>
    {{ num }}
  </div>
</template>

<script>
  import { ref } from '@vue/reactivity'

  export default {
    setup() {
      let num = ref(123)

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 注意这里的 resolve 要返回对象
          resolve({num})
        }, 3000)
      })
    }
  }
</script>

<style scoped>
  .child {
    height: 300px;
    background: green;
    color: #fff;
  }
</style>
```

同时，如果使用异步组件，那么引入的组件的 `setup` 函数也可以是 `async` 函数，如下：
- `Child.vue`
```vue
<template>
  <div class="child">
    <span>子组件</span><br>
    {{ num }}
  </div>
</template>

<script>
  import { ref } from '@vue/reactivity'

  export default {

    async setup() {
      let num = ref(123)

      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // 注意这里的 resolve 要返回对象
          resolve({num})
        }, 3000)
      })

      return await promise
    }
  }
</script>

<style scoped>
  .child {
    height: 300px;
    background: green;
    color: #fff;
  }
</style>
```
## 全局 API 的变动

Vue2 全局 API (Vue)|Vue3 实例 API (app)
---|---
Vue.config.xxXX|app.config.xxXX
Vue.config.productionTip|移除
Vue.component|app.component
Vue.directive|app.directive
Vue.mixin|app.mixin
Vue.use|app.use
Vue.prototype|app.config.globalProperties

- `main.js`
```js
import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)

app.use(xxx)

app.mount('#app')
```
