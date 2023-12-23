// import { defaultTheme } from '@vuepress/theme-default'
import { localTheme } from '../theme'
import { navbar } from './navbar'
import { sidebar } from './sidebar'
import userConfig from "./userConfig.js"

export const theme = localTheme({
  colorMode: 'auto', // 只有在 colorModeSwitch 为 false 才生效
  colorModeSwitch: true, // 设置为 false 则右上角不会出现切换主题的按钮
  home: '/',
  navbar,
  sidebar,
  logo: '/images/leaf.png', // Logo 图片将会显示在导航栏的左端
  logoDark: '/images/leaf.png', // 暗黑模式下的 Logo
  sidebarDepth: 3, // 提取哪些标签作为侧边栏
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
  userConfig: userConfig({
    backgroundImg: [
      'https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-17/P65.jpg', 
      'https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-17/P66.jpg', 
      'https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-17/P69.jpg', 
      'https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-17/P70.jpg', 
      'https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-17/P71.jpg'
    ],
    heroText: [
      '实力与野心不符，是一件可悲的事', 
      '有些人没有见过汪洋，以为江河最为壮美', 
      '举杯的目的，从来不是为了醉酒', 
      '儒以文乱法，侠以武犯禁', 
      '十年可见春去秋来，百年可证生老病死，千年可叹王朝更替，万年可见斗转星移',
      '你最可爱，我说时来不及思索，但思索之后，还是这样说',
      '最难消受美人恩',
      '权，然后知轻重；度，然后知长短。物皆然，心为甚',
      '君子成人之美，不成人之恶。小人反是',
      '刑过不避大臣，赏善不遗匹夫',
      '我们给予恐惧，他们则跪着乞求',
      '旅行是一场艳遇，最后我们遇见了自己',
      '术以知奸，以刑止刑',
      '心，如果在深井，眼中的天空就会变小',
      '行万里路，才能见天地之广阔',
      '纸上得来终觉浅，绝知此事要躬行',
      '一心想要得到，得到了又不珍惜；一心想要放弃，放弃了又觉得可惜',
      '你什么也不肯放弃，又得到了什么',
      '翩若惊鸿，婉若游龙',
      '髣髴兮若轻云之蔽月，飘摇兮若流风之回雪',
      '一肌一容，尽态极妍',
      '手如柔荑，肤如凝脂',
      '起舞弄清影，何似在人间',
      '你嘴凑上来，我对你嘴说，这话就一直钻到你心里，省得走远路，拐了弯从耳朵里进去',
      '好东西不用你去记，它自然会留下很深的印象',
      '话是空的，人是活的。不是人照着话做，而是话跟着人变',
      '你的眼睛很美，但是涟漪深处往往隐藏着危险的漩涡',
      '世上有两样东西不可直视，一是太阳，二是人心',
      '人生总有某些特殊的时刻，在此时，我们可以不用遵守规矩，摒弃一切思想束缚，来做一些当下真正想做的事，即使是简单的陪伴',
      '不要走在我的后面，因为我可能不会引路；不要走在我的前面，因为我可能不会跟随。请走在我的身边，做我的朋友',
      '我从未见过你，但是当你出现在我身边的时候，我就知道是你',
      '天下熙熙，皆为利来；天下攘攘，皆为利往',
    ],
    footerText: {
      left: '吾尝终日而思矣',
      right: '不如须臾之所学也'
    }
  }),
})