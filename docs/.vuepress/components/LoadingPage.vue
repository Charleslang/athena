<template>
  <div 
    :class="['loading-wrapper']" 
    v-if="frontmatter && frontmatter.home">
    <!-- <img class="loading-img" 
      :src="lightTheme ? '/images/loading/loading-pen.gif' : '/images/loading/loading-pen_dark.gif'" 
      alt="loading"/> -->
    <div class="loading-img"></div>
    <div class="loading-text">{{loadingText}}</div>
  </div>
</template>

<script>
  import { toRefs, ref } from 'vue'

  // 如果想要使用主题的某些属性, 可以引入 themeData
  // https://v2.vuepress.vuejs.org/zh/reference/plugin/theme-data.html#themedata
  // import { useThemeData } from '@vuepress/plugin-theme-data/client'

  export default {
    props: {
      frontmatter: {
        required: false
      },
      loadingText: {
        type: String,
        required: false
      }
    },

    setup(props) {

      const { frontmatter, loadingText } = toRefs(props)
      // const lightTheme = ref(false)

      // 使用 css 来判断 html 标签的 class 来改变背景会更好（将 img 标签换成 div，设置 backgroundImage），先暂时这样
      // Node 环境打包会报错 ReferenceError: window is not defined
      // const themeMedia = window.matchMedia("(prefers-color-scheme: light)")
      // if (themeMedia.matches) {
      //   lightTheme.value = true
      // }

      return {
        frontmatter,
        loadingText,
        // lightTheme
      }
    }
  }
</script>

<style scoped>
  .loading-wrapper {
    position: absolute;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--c-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .loading-wrapper .loading-img {
    width: 7rem;
    height: 7rem;
    background: url('/images/loading/loading-pen.gif') center center / cover no-repeat;
  }

  .loading-wrapper .loading-text {
    color: #afb5bd;
    margin-top: 6px;
  }
</style>