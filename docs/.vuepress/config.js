import { defineUserConfig } from 'vuepress'
import { baseConfig }  from './config/base-config'
import { theme } from './config/theme'

export default defineUserConfig({
  ...baseConfig,
  theme,
})