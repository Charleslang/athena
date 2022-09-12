import { defineClientConfig } from '@vuepress/client'
import { onMounted, watch } from "vue"
import { useRoute } from 'vue-router'
import { loadImgSuccess } from '@hooks/useBackgroundImgLoaded.js'
import { useUserConfig } from './hooks/useUserConfig'
import Layout from './layouts/Layout.vue'
import NotFound from './components/NotFound.vue'
import LoadingPage from './components/LoadingPage.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('LoadingPage', LoadingPage)
  },
  setup() {
    const route = useRoute()
    onMounted(() => {
      useUserConfig()
      loadImgSuccess()
    }),
    watch(
      () => route.path,
      () => {
        useUserConfig()
        loadImgSuccess()
      }
    )
  },
  // @since 2.0.0-beta.51 主题 API 中已移除 layouts 属性，应该在 client.js 中配置 layouts
  // @since 2.0.0-beta.51 404 布局应重命名为 NotFound 布局
  layouts: {
    Layout,
    NotFound,
  },
})