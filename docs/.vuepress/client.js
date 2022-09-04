import { defineClientConfig } from '@vuepress/client'
import Layout from './layouts/Layout.vue'
import NotFound from './components/NotFound.vue'

export default defineClientConfig({
  // @since 2.0.0-beta.51 主题 API 中已移除 layouts 属性，应该在 client.js 中配置 layouts
  // @since 2.0.0-beta.51 404 布局应重命名为 NotFound 布局
  layouts: {
    Layout,
    NotFound,
  },
})