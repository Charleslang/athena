# 生命周期

Vue2 的生命周期|Vue3 的生命周期
---|---
![vue2生命周期.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621142874.png)|![vue3生命周期.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621142935.png)

其实两者的差别并不大，只不过在 Vue3 中，使用了 `beforeUnmount`、`unmounted` 代替 `beforeDestory`、`destoryed`。

声明周期函数的使用如下：

- `Demo1.vue`
```html
<template>
  <h1>hello demo1</h1>
  <span>num: {{num}}</span><br>
  <button @click="num++">计数</button>
</template>

<script>
  import { ref } from '@vue/reactivity'

  export default {

    setup() {
      let num = ref(1)

      return {
        num
      }
    },
    beforeCreate() {
      console.log('===> beforeCreate')
    },
    created() {
      console.log('===> created')
    },
    beforeMount() {
      console.log('===> beforeMount')
    },
    mounted() {
      console.log('===> mounted')
    },
    beforeUpdate() {
      console.log('===> beforeUpdate')
    },
    updated() {
      console.log('===> updated')
    },
    beforeUnmount() {
      console.log('===> beforeUnmount')
    },
    unmounted() {
      console.log('===> unmounted')
    }
  }
</script>

<style>

</style>
```

- `App.vue`
```html
<template>
  <button @click="isShow = !isShow">切换显示</button>
  <Demo1 v-if="isShow">
    <template #slot1>
      <div>插槽1替换</div>
    </template>
    <template #slot2>
      <span>插槽2替换</span>
    </template>
  </Demo1>
</template>

<script>
  import { ref } from 'vue'
  import Demo1 from './components/Demo1.vue'
  export default {
    components: {
      Demo1
    },
    setup() {

      let isShow = ref(true)

      function doHello(params) {
        console.log(`父组件收到了子组件的事件，参数是${params}`)
      }

      return {
        doHello,
        isShow
      }
    }
  }
</script>

<style>
  
</style>
```

上面的声明周期函数是结合 Vue3 官网是生命周期图来写的，其实，我们也可以把他们放入组合式 API `setup` 函数中，但是需要注意的是 `beforeCreate` 和 `created` 这两个生命周期并没有提供组合式 API，因为 `setup` 函数就相当于他们两个了。
```html
<script>
  import { ref } from '@vue/reactivity'
  // 也可以直接从 vue 里面导入
  import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from '@vue/runtime-core'

  export default {

    setup() {
      let num = ref(1)

      // 相当于 beforeCreate 和 created
      console.log('===> setup')

      onBeforeMount(() => {
        console.log('===> onBeforeMount')
      })

      onMounted(() => {
        console.log('===> onMounted')
      }) 

      onBeforeUpdate(() => {
        console.log('===> onBeforeUpdate')
      }) 

      onUpdated(() => {
        console.log('===> onUpdated')
      }) 

      onBeforeUnmount(() => {
        console.log('===> onBeforeUnmount')
      }) 

      onUnmounted(() => {
        console.log('===> onUnmounted')
      }) 

      return {
        num
      }
    }
  }
</script>
```
如果同时在 `setup`和生命周期属性里面使用生命周期函数，那么他们的执行顺序如下：

1. `setup`
2. `beforeCreate`
3. `created`
4. `onBeforeMount`
5. `beforeMount`
6. `onMounted`
7. `mounted`
8. `onBeforeUpdate`
9. `beforeUpdate`
10. `onUpdated`
11. `updated`
12. `onBeforeUnmount`
13. `beforeUnmount`
14. `onUnmounted`
15. `unmounted`
