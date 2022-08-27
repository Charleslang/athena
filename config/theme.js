// 主题的配置参考 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html
// 其它配置项需要结合 1.x 版本进行配置, 2.x 中部分配置请见 https://v2.vuepress.vuejs.org/zh/reference/config.html#%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AE
// 使用 require 可能报错 Dynamic require of is not supported
import { defaultTheme } from '@vuepress/theme-default'

const theme = defaultTheme({
  colorMode: 'auto', // 只有在 colorModeSwitch 为 false 才生效
  colorModeSwitch: true, // 设置为 false 则右上角不会出现切换主题的按钮
  home: '/',
  navbar: [
    {
      text: '后端',
      link: '/backend/', // 如果当前路由和 link 的值相同, 则该 navbar 会处于选中状态
      activeMatch: '/backend/' // 当路由为 /backend/ 时, 该 nav 处于选中状态
    },
    {
      text: '前端',
      link: '/protal'
    },
    {
      text: '文章归档',
      children: [
        {
          text: 'MySQL',
          link: '/mysql/'
        },
        {
          text: 'Linux',
          link: '/linux/'
        },
        {
          text: '其它',
          children: [
            {
              text: '数据结构与算法',
              link: '/datastruct/'
            },
            {
              text: '计算机网络',
              link: '/network/'
            },
            {
              text: '操作系统',
              link: '/os/'
            }
          ]
        }
      ]
    },
    {
      text: '更新日志',
      link: '/logs'
    }
  ],
  logo: '/images/avatar.jpg', // Logo 图片将会显示在导航栏的左端
  logoDark: '/images/avatar.jpg', // 暗黑模式下的 Logo
  repo: 'https://github.com/Charleslang/note', // 右上角最后的位置显示仓库地址
  repoLabel: 'Junfeng Dai', // 如果不设置, 则会根据 repo 的域名自动推断
  sidebarDepth: 2, // 提取哪些标签作为侧边栏
  editLink: true, // 是否启用 编辑此页 链接, 默认为 true
  editLinkText: '想要编辑此页?', // 编辑此页 链接的文字, 默认为 Edit this page
  editLinkPattern: 'https://www.baidu.com', // 如果想跳转到 github 对应的页面中, 请参考官网的配置
  // lastUpdated 和 contributors 需要配合 git并使用 git 插件， 见 https://v2.vuepress.vuejs.org/zh/reference/plugin/git.html
  lastUpdated: true, // 是否启用 最近更新时间戳, 默认为 true, 只在使用 git 项目时才生效, 默认读取 git commit 的最新时间
  lastUpdatedText: '上次更新',
  contributors: true, // 是否启用 贡献者列表 。默认为 true
  contributorsText: '代同学', // 贡献者列表 标签的文字。
  tip: '提示', // Tip 自定义容器 的默认标题, 默认为 TIP
  warning: '注意', // Warning 自定义容器 的默认标题，默认为 warning
  danger: '警告', // Darning 自定义容器 的默认标题，默认为 danger
  notFound: ['你要找的页面走丢了'], //当用户进入 404 页面时，会从数组中随机选取一条信息进行展示, 默认值 ['Not Found']
  backToHome: '回到首页',// 404 页面中 返回首页 链接的文字, 默认为 Back to home
  toggleColorMode: '切换主题', // 切换颜色模式按钮的标题文字. 默认为 toggle color mode
})

module.exports = theme