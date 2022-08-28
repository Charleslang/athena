export const navbar = [
  {
    text: '后端',
    link: '/preview/', // 如果当前路由和 link 的值相同, 则该 navbar 会处于选中状态
    activeMatch: '/preview/' // 当路由为 /backend/ 时, 该 nav 处于选中状态
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
]