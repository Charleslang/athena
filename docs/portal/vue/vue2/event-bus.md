# 事件总线 `$bus`

在某些情况下，我们可能需要从一个组件发送事件到另一个组件，如果它们直接没有直接的联系，我们可能需要依次向它们的父组件传递事件，这样显得稍微麻烦，我们可以使用 Vuex 来解决这个问题。但是，Vuex 中保存的是状态（变量），有时候可能无法直接处理事件，这时，我们呢可以使用 Vue 中的事件总线 `$bus`。  

`$bus` 类似 Vuex，只要有一个组件发射了事件，那么，其它任何组件都可以接收到这个事件。但是，Vue 中并没有直接提供 `$bus`，所以，需要我们自己进行某些处理，如下：

- `main.js`
  
  ```js
  // 定义事件总线
  Vue.prototype.$bus = new Vue()
  ```

- `GoodsListItem.vue`  
  
  ```vue
  <template>
    <div class="goods-item">
      <!-- Vue 内置函数 @load 用来监听图片是否加载完成，类似 js 中的 img.onload = function -->
      <img :src="item.image" alt="" @load="imageLoad">
      <!-- ... -->
    </div>
  </template>

  <script>
    export default {
      methods: {
        imageLoad() {
          // 使用事件总线发送事件
          this.$bus.$emit('goodsItemImgLoad')
        }
      }
    }
  </script>
  ```

- `Home.vue`

  ```js
  export default {
    created() {
      // 接收事件
      this.$bus.$on('goodsItemImgLoad', () => {
        this.$refs.scroll.refresh()
      })
    },
  }
  ```
