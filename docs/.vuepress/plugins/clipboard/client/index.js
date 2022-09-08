import { defineClientConfig } from '@vuepress/client'
import clipboard from '../components/clipboard.vue'
import { setupClipboard } from '../hooks/useClipboard.js'

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component('clipboard', clipboard)
  },
  setup: () => {
    setupClipboard()
  },
})