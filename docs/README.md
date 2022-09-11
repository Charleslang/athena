---
# title: 个人日志随笔
home: true
heroText: 清淨
tagline: 有些人没有见过汪洋，以为江河最为壮美
footer: <div class="footer-container"><div class="footer-text">[ 吾尝终日而思矣<span class="footer-text-icon"><span class="iconfont icon-shandian1"></span></span>不如须臾之所学也 ]</div>Copyright © 2021-present Junfeng Dai <br> <a href="https://beian.miit.gov.cn" class="record-num" target="_blank">蜀 ICP 备 2021009537 号 - 1</a></div>
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