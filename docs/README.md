---
# title: 个人日志随笔
home: true
heroText: 清淨
tagline: 有些人没有见过汪洋，以为江河最为壮美
footer: <div class="footer-container"><div class="footer-text"><span class="left">[ 吾尝终日而思矣</span><span class="footer-text-icon"><span class="iconfont icon-shandian1"></span></span><span class="right">不如须臾之所学也 ]</span></div>Copyright © 2021-present Junfeng Dai <br> <a href="https://beian.miit.gov.cn" class="record-num" target="_blank">蜀ICP备2021009537号</a>
# &nbsp;&nbsp;<a href="https://beian.miit.gov.cn" class="record-num" target="_blank">蜀ICP备2021009537号-2</a></div>
# 将 footer 作为 html 代码处理
footerHtml: true 
---

<LoadingPage v-if="show" :frontmatter="frontmatter" :loadingText="'记录，成为更好的自己'" />

<script>

  import { onMounted, ref } from 'vue'
  import { usePageFrontmatter } from '@vuepress/client'
  import { useRoute } from 'vue-router'

  export default {
    setup() {
      const route = useRoute()
      const show = ref(route.path === '/')

      const frontmatter = usePageFrontmatter()

      onMounted(() => {
        // DOM 加载完成后去掉 loading
        setTimeout(() => {
          show.value = false
        })
      })

      return {
        frontmatter,
        show
      }
    }
  }
</script>

<style>
  html.dark .loading-wrapper .loading-img {
    background-image: url('/images/loading/loading-pen_dark.gif');
  }

  /* html.dark .loading-wrapper {
    background-color: #fff;
  }

  html.dark .loading-wrapper {
    background-color: #232323;
  } */
</style>