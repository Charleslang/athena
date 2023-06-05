export const sidebar = {
  // 在 markdown 中的 formmatter 中定义路由
  // '/portal/advance': [
    // '/portal/advance/es6.html',
    // '/portal/advance/ts.html'
    // {
    //   text: 'ECMAScript 6',
    //   children: [
    //     '/portal/advance/es6.html'
    //   ]
    // },
    // {
    //   text: 'TypeScript',
    //   link: '/portal/advance/ts.html'
    // }
  // ],
  '/backend/java/base': [
    {
      text: 'Java 基础',
      children: [
        '/backend/java/base/index.html',
        '/backend/java/base/get-started.html',
        '/backend/java/base/data-type.html',
        '/backend/java/base/variables.html',
        '/backend/java/base/number-base.html',
        '/backend/java/base/import-package.html',
        '/backend/java/base/input.html',
        '/backend/java/base/data-type-convert.html',
        '/backend/java/base/operator.html',
        '/backend/java/base/random.html',
        '/backend/java/base/structure.html',
        '/backend/java/base/modifier.html',
        '/backend/java/base/oo.html',
        '/backend/java/base/overload-override.html',
        '/backend/java/base/exe-process.html',
        '/backend/java/base/params.html',
        '/backend/java/base/thread.html',
        '/backend/java/base/useful.html',
        '/backend/java/base/enum.html',
        '/backend/java/base/annotation.html',
        '/backend/java/base/collection.html',
        '/backend/java/base/genericity.html',
        '/backend/java/base/io.html',
        '/backend/java/base/socket.html',
        '/backend/java/base/reflect.html',
        '/backend/java/base/lambda.html',
        '/backend/java/base/class-load.html',
        '/backend/java/base/regex.html',
        '/backend/java/base/charset.html',
      ]
    }
  ],
  '/backend/framework/elasticsearch': [
    {
      text: 'Elasticsearch',
      children: [
        '/backend/framework/elasticsearch/index.html',
        '/backend/framework/elasticsearch/concept.html',
        '/backend/framework/elasticsearch/install.html',
        '/backend/framework/elasticsearch/usage.html',
        '/backend/framework/elasticsearch/query-dsl.html',
        '/backend/framework/elasticsearch/aggregations.html',
        '/backend/framework/elasticsearch/mapping.html',
        '/backend/framework/elasticsearch/analysis.html',
        '/backend/framework/elasticsearch/config.html',
      ]
    }
  ],
  '/backend/middleware/redis': [
    {
      text: 'Redis',
      children: [
        '/backend/middleware/redis/index.html',
        '/backend/middleware/redis/installing.html',
        '/backend/middleware/redis/config.html',
        '/backend/middleware/redis/datatype.html',
        '/backend/middleware/redis/java-clients.html',
        {
          text: '实战',
          collapsible: true,
          children: [
            '/backend/middleware/redis/prod-sms-login.html',
          ]
        }
      ]
    }
  ],
  '/portal/vue/vue2': [
    {
      text: 'Vue2',
      children: [
        '/portal/vue/vue2/index.html',
        '/portal/vue/vue2/get-started.html',
        '/portal/vue/vue2/instance.html',
        '/portal/vue/vue2/directives.html',
        '/portal/vue/vue2/data-change.html',
        '/portal/vue/vue2/vue-dom.html',
        '/portal/vue/vue2/component.html',
        '/portal/vue/vue2/module.html',
        '/portal/vue/vue2/webpack.html',
        '/portal/vue/vue2/vue-cli.html',
        '/portal/vue/vue2/vue-router.html',
        '/portal/vue/vue2/vuex.html',
        '/portal/vue/vue2/event-bus.html',
        '/portal/vue/vue2/mixins.html',
        '/portal/vue/vue2/vue-demo.html',
        '/portal/vue/vue2/axios.html',
        '/portal/vue/vue2/vue-ext.html',
        '/portal/vue/vue2/project-issue.html',
      ]
    },
  ],
  '/portal/vue/vue3': [
    {
      text: 'Vue3',
      children: [
        '/portal/vue/vue3/index.html',
        '/portal/vue/vue3/usage.html',
        '/portal/vue/vue3/usage-of-ts.html',
        '/portal/vue/vue3/lifecycle.html',
        '/portal/vue/vue3/features-of-vue3.html'
      ]
    },
  ],
  '/portal/vue/vuepress': [
    {
      text: 'VuePress',
      children: [
        '/portal/vue/vuepress/index.html',
        '/portal/vue/vuepress/get-started.html',
        '/portal/vue/vuepress/deploy.html',
        '/portal/vue/vuepress/customize.html',
        '/portal/vue/vuepress/picgo.html'
      ]
    },
  ],
  '/archive/jenkins': [
    {
      text: 'Jenkins',
      children: [
        '/archive/jenkins/index.html',
        '/archive/jenkins/installing.html',
        '/archive/jenkins/config.html',
        '/archive/jenkins/plugins.html',
        '/archive/jenkins/build-type.html',
        '/archive/jenkins/build-triggers.html',
        '/archive/jenkins/post-build.html',
        '/archive/jenkins/build-params.html',
      ]
    }
  ],
  '/archive/maven': [
    {
      text: 'Maven',
      children: [
        '/archive/maven/index.html',
        '/archive/maven/package-config.html',
      ]
    }
  ],
  '/archive/plugin': [
    {
      text: '插件工具',
      children: [
        '/archive/plugin/index.html',
        '/archive/plugin/github-student.html',
      ]
    }
  ],

}