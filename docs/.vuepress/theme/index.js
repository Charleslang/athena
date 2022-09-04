import { defaultTheme } from '@vuepress/theme-default'

export const localTheme = (options) => {
  return {
    name: 'vuepress-theme-local',
    // 继承默认主题
    extends: defaultTheme(options),
  }
}