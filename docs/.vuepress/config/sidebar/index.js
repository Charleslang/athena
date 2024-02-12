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
        {
          text: 'Query DSL',
          collapsible: true,
          children: [
            '/backend/framework/elasticsearch/query-dsl-query-filter-context.html',
            '/backend/framework/elasticsearch/query-dsl-compound-queries.html',
            '/backend/framework/elasticsearch/query-dsl-full-text-queries.html',
            '/backend/framework/elasticsearch/query-dsl-match-all-query.html',
          ]
        },
        '/backend/framework/elasticsearch/java-rest-high-rest-client.html'
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
        '/backend/middleware/redis/lua-script.html',
        '/backend/middleware/redis/java-clients.html',
        {
          text: '实战',
          collapsible: true,
          children: [
            '/backend/middleware/redis/prod-sms-login.html',
            '/backend/middleware/redis/prod-query-cache.html',
            '/backend/middleware/redis/prod-cache-penetration.html',
            '/backend/middleware/redis/prod-cache-breakdown.html',
            '/backend/middleware/redis/prod-cache-avalanche.html',
            '/backend/middleware/redis/prod-global-unique-id.html',
            '/backend/middleware/redis/prod-oversold.html',
            '/backend/middleware/redis/prod-purchase-limit.html',
            '/backend/middleware/redis/prod-distributed-lock.html',
            '/backend/middleware/redis/prod-redisson.html',
            '/backend/middleware/redis/prod-async-kill.html',
          ]
        }
      ]
    }
  ],
  '/backend/middleware/rabbitmq': [
    {
      text: 'RabbitMQ',
      children: [
        '/backend/middleware/rabbitmq/index.html',
        '/backend/middleware/rabbitmq/installing.html',
        '/backend/middleware/rabbitmq/get-started.html',
        '/backend/middleware/rabbitmq/work-pattern.html',
        '/backend/middleware/rabbitmq/exchanges.html',
        '/backend/middleware/rabbitmq/queues.html',
        '/backend/middleware/rabbitmq/bindings.html',
        '/backend/middleware/rabbitmq/messages.html',
        '/backend/middleware/rabbitmq/confirms.html',
        '/backend/middleware/rabbitmq/cluster.html',
        {
          text: "拓展",
          collapsible: true,
          children: [
            '/backend/middleware/rabbitmq/ext-dead-letter.html',
            '/backend/middleware/rabbitmq/ext-ttl.html',
            '/backend/middleware/rabbitmq/ext-maxlength.html',
          ]
        },
        {
          text: "插件",
          collapsible: true,
          children: [
            '/backend/middleware/rabbitmq/plugin-delay-message.html',
          ]
        },
        '/backend/middleware/rabbitmq/spring-boot.html',
        '/backend/middleware/rabbitmq/prod.html',
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
        '/archive/maven/overview.html',
        '/archive/maven/maven-project.html',
        '/archive/maven/lifecycle.html',
        '/archive/maven/scope.html',
        '/archive/maven/dependency-transitive.html',
        '/archive/maven/inheritance.html',
        '/archive/maven/aggregation.html',
        '/archive/maven/nexus.html',
        '/archive/maven/package-config.html',
        '/archive/maven/maven-tomcat-plugin.html',
        '/archive/maven/faq.html',
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