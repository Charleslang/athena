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
      },
      {
        text: '框架',
        children: [
          {
            text: 'Flyway',
            link: '/backend/framework/flyway/index.html'
          },
          {
            text: 'MapStruct',
            link: '/backend/framework/mapstruct/index.html'
          }
        ]
      },
      {
        text: '中间件',
        children: [
          {
            text: 'Elasticsearch',
            link: '/backend/middleware/elasticsearch/index.html'
          },
          {
            text: 'Redis',
            link: '/backend/middleware/redis/index.html'
          },
          {
            text: 'RabbitMQ',
            link: '/backend/middleware/rabbitmq/index.html'
          },
          {
            text: 'Kafka',
            link: '/backend/middleware/kafka/index.html'
          }
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
            link: '/portal/base/css/index.html'
          },
          {
            text: 'JavaScript',
            link: '/portal/base/js/index.html'
          }
        ]
      },
      {
        text: '进阶',
        children: [
          {
            text: 'jQuery',
            link: '/portal/advance/jquery/index.html'
          },
          {
            text: 'ECMAScript6',
            link: '/portal/advance/es6/index.html'
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
        text: 'Jenkins',
        link: '/archive/jenkins/index.html',
      },
      {
        text: 'Maven',
        link: '/archive/maven/index.html',
      },
      {
        text: 'MySQL',
        link: '/mysql/'
      },
      {
        text: 'Linux',
        link: '/linux/'
      },
      {
        text: '插件工具',
        link: '/archive/plugin/index.html'
      },
      {
        text: '代码集成',
        link: '/code/'
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
          },
          {
            text: '设计模式',
            link: '/archive/design-patterns/index.html'
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