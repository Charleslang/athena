import { path } from '@vuepress/utils'

export const clipboardPlugin = (options) => () => ({
  name: 'vuepress-plugin-clipboard',
  multiple: false,
  clientConfigFile: path.resolve(__dirname, './client/index.js'),
  define: {
    __CODE_CLIPBOARD_OPTIONS__: options,
  },
})

export default clipboardPlugin