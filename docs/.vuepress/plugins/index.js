import clipboardPlugin from './clipboard/index.js'

export const plugins = [
  // 音乐播放器 https://www.npmjs.com/package/vuepress-plugin-meting
  // 代码复制 https://vuepress.qbb.sh/clipboard/#install
  clipboardPlugin({
    position: 'top',
    show: 'hover',
    selector: 'div[class*="language-"]',
    delay: 400,
    hoverText: 'Copy to clipboard',
    successText: 'Copied!',
    tippy: {
      placement: 'top',
    }
  }),
  // 自动生成侧边栏
  // 侧边栏左右分离
]