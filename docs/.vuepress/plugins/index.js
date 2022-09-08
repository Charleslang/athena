import clipboardPlugin from './clipboard/index.js'

export const plugins = [
  // 音乐播放器 https://www.npmjs.com/package/vuepress-plugin-meting
  // 代码复制 https://vuepress.qbb.sh/clipboard/#install
  clipboardPlugin({
    a: 'zs'
  })
  // 自动生成侧边栏
  // 侧边栏左右分离
]