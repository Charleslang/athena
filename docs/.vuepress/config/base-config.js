import { plugins } from '../plugins/index'

export const baseConfig = {
  port: 8088, // 项目运行的端口
  lang: 'zh-CN',
  title: '清淨', // 站点标题
  description: '记录，成为更好的自己',
  base: '/', // 如果项目打包后不上线，只是在本地运行，那么需要修改 base（不然静态资源找不到），将其改为项目全路径（开过过程中请注释配置，仅在本地打包时配置, 如果打包部署到服务器，那么一般情况下也不用进行配置）
  // 注意下面的路径要直接以 docs 开头
  dest: 'docs/dist', // 打包路径，默认在 `${sourceDir}/.vuepress/dist`
  temp: 'docs/.temp', // 临时文件路径(VuePress 在开发和构建时会加载临时文件，因此临时文件目录应位于项目根目录内部，以便可以正确地解析到依赖), 默认为 `${sourceDir}/.vuepress/.temp`
  cache: 'docs/.cache', // 缓存文件路径, 默认为 `${sourceDir}/.vuepress/.cache`
  debug: false, // 用于调试, 取代 console.log
  head: [
    ['link', { rel: 'icon', href: '/images/icon.ico' }],
    ['link', { rel: 'stylesheet', href: '/iconfont/iconfont.css' }]
  ],
  plugins
}