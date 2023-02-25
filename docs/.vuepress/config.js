import { defineUserConfig } from 'vuepress'
import { baseConfig }  from './config/base-config'
import { theme } from './config/theme'
import { plugins } from './plugins/index'

export default defineUserConfig({
  ...baseConfig,
  theme,
  plugins
})