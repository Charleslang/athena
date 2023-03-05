export const navbar = [
  {
    text: '后端',
    children: [
      {
        text: 'Java',
        children: [
          {
            text: 'Java 基础',
            link: '/backend/java/base/index.html'
          },
        ]
      }
    ]
    // link: '/backend.html', // 如果当前路由和 link 的值相同, 则该 navbar 会处于选中状态
    // activeMatch: '/backend.html' // 当路由为 /backend/ 时, 该 nav 处于选中状态
  },
  {
    text: '前端',
    children: [
      {
        text: '三剑客',
        children: [
          {
            text: 'HTML',
            link: '/portal/base/html.html'
          },
          {
            text: 'CSS',
            link: '/portal/base/css.html'
          },
          {
            text: 'JavaScript',
            link: '/portal/base/js.html'
          }
        ]
      },
      {
        text: '进阶',
        children: [
          {
            text: 'jQuery',
            link: '/portal/advance/jq.html'
          },
          {
            text: 'ECMAScript6',
            link: '/portal/advance/es6.html'
          },
          {
            text: 'TypeScript',
            link: '/portal/advance/ts.html'
          }
        ]
      },
      {
        text: 'Vue',
        children: [
          {
            text: 'Vue2',
            link: '/portal/vue/vue2/index.html'
          },
          {
            text: 'Vue3',
            link: '/portal/vue/vue3/index.html'
          },
          {
            text: 'VuePress',
            link: '/portal/vue/vuepress/index.html'
          }
        ]
      }
    ]
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
  // {
  //   text: '日常',
  //   link: '/daily'
  // },
  // {
  //   text: '书单',
  //   link: '/book/list.html'
  // },
  // {
  //   text: '更新日志',
  //   link: '/logs/update/index.html'
  // },
  {
    text: '迁移日志',
    link: '/logs/migrate/index.html',
  },
  {
    text: '订阅号',
    link: '/wx'
  }
]