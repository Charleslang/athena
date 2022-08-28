import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export const localTheme = (options) => {
  return {
    name: 'vuepress-theme-local',
    // 继承默认主题
    extends: defaultTheme(options),
    // 覆盖 404 界面
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
      404: path.resolve(__dirname, 'components/404.vue'),
    },
  }
}