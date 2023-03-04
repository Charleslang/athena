# 混入 Mixin
可以将组件中共有的属性、组件、方法等抽取出来。如果方法是生命周期函数，则会把现有的和 mixin 中的合并起来。如果方法不是生命周期函数，则会用 mixin 中的替换原函数中的。

- `mixin.js`  

  ```js
  import { debounce } from 'common/utils'

  export const goodsImgLoadMixin = {
    data() {
      return {
        goodsItemImgLoad: null
      }
    },
    mounted() {
      const refresh = debounce(this.$refs.scroll.refresh, 300)
      this.goodsItemImgLoad = () => {
        refresh()
      }
      this.$bus.$on('goodsItemImgLoad', this.goodsItemImgLoad)
      // console.log('这是mixin')
    }
  }

  export const backTopMixin = {
    data() {
      return {
        // 回到顶部
        isTopShow: false
      }
    },
    methods: {
      // 回到顶部
      backTop() {
        this.$refs.scroll.backTo(0, 0)
      }
    }
  }
  ```

- `xxx.vue`

  ```js
  import { goodsImgLoadMixin, backTopMixin } from 'common/mixin'

  export default {
    name: "GoodsDetail",
    data() {
      return {
      
      }
    },
    // 使用混入
    mixins: [goodsImgLoadMixin, backTopMixin],
    methods: {
      scrollListener(pos) {
        // 显示回到顶部按钮
        this.isTopShow = pos.y <= -1166
      }
    }
  }
  ```
