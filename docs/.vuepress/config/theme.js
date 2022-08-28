// import { defaultTheme } from '@vuepress/theme-default'
import { localTheme } from '../theme'
import { navbar } from './navbar'

export const theme = localTheme({
  colorMode: 'auto', // 只有在 colorModeSwitch 为 false 才生效
  colorModeSwitch: true, // 设置为 false 则右上角不会出现切换主题的按钮
  home: '/',
  navbar,
  logo: '/images/avatar.jpg', // Logo 图片将会显示在导航栏的左端
  logoDark: '/images/avatar.jpg', // 暗黑模式下的 Logo
  sidebarDepth: 2, // 提取哪些标签作为侧边栏
  tip: '提示', // Tip 自定义容器 的默认标题, 默认为 TIP
  warning: '注意', // Warning 自定义容器 的默认标题，默认为 warning
  danger: '警告', // Darning 自定义容器 的默认标题，默认为 danger
  notFound: ['你要找的页面走丢了'], //当用户进入 404 页面时，会从数组中随机选取一条信息进行展示, 默认值 ['Not Found']
  backToHome: '回到首页',// 404 页面中 返回首页 链接的文字, 默认为 Back to home
  toggleColorMode: '切换主题', // 切换颜色模式按钮的标题文字. 默认为 toggle color mode
  docsBranch: 'main', // 文档源文件的仓库分支。它将会用于生成 编辑此页 的链接。
  docsDir: 'docs', //文档源文件存放在仓库中的目录名。它将会用于生成 编辑此页 的链接。
  repo: 'https://github.com/Charleslang/note', // 右上角最后的位置显示仓库地址
  repoLabel: 'GitHub', // 如果不设置, 则会根据 repo 的域名自动推断
  editLink: true, // 是否启用 编辑此页 链接, 默认为 true
  editLinkText: '想要编辑此页?', // 编辑此页 链接的文字, 默认为 Edit this page
  editLinkPattern: ':repo/blob/:branch/:path', // 如果想跳转到 github 对应的页面中, 请参考官网的配置
  // lastUpdated 和 contributors 需要配合 git并使用 git 插件， 见 https://v2.vuepress.vuejs.org/zh/reference/plugin/git.html
  lastUpdated: true, // 是否启用 最近更新时间戳, 默认为 true, 只在使用 git 项目时才生效, 默认读取 git commit 的最新时间
  lastUpdatedText: '上次更新',
  contributors: true, // 是否启用 贡献者列表 。默认为 true
  contributorsText: '贡献者', // 贡献者列表 标签的文字。
})