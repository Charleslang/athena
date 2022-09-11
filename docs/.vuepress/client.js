import { defineClientConfig } from '@vuepress/client'
import { onMounted } from "vue";
import Layout from './layouts/Layout.vue'
import NotFound from './components/NotFound.vue'
import LoadingPage from './components/LoadingPage.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('LoadingPage', LoadingPage)
  },
  setup() {
    onMounted(() => {
      setTimeout(() => {
        const img = document.createElement('img')
        img.src = '/images/P61.jpg'
        img.onload = () => {
          const background = document.querySelector('#app .no-sidebar main.home')
          const hero = document.querySelector('#app .no-sidebar main.home header.hero')
          hero.style.display = 'table-cell'
        }
      })
    })
  },
  // @since 2.0.0-beta.51 主题 API 中已移除 layouts 属性，应该在 client.js 中配置 layouts
  // @since 2.0.0-beta.51 404 布局应重命名为 NotFound 布局
  layouts: {
    Layout,
    NotFound,
  },
})