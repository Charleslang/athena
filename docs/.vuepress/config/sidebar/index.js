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
  '/backend/framework/flyway': [
    {
      text: 'Flyway',
      children: [
        '/backend/framework/flyway/index.html',
        '/backend/framework/flyway/get-started.html',
        '/backend/framework/flyway/spring-boot-principle.html',
        '/backend/framework/flyway/flyway-principle.html',
        '/backend/framework/flyway/config.html'
      ]
    }
  ],
  '/backend/middleware/elasticsearch': [
    {
      text: 'Elasticsearch',
      children: [
        '/backend/middleware/elasticsearch/index.html',
        '/backend/middleware/elasticsearch/concept.html',
        '/backend/middleware/elasticsearch/install.html',
        '/backend/middleware/elasticsearch/usage.html',
        '/backend/middleware/elasticsearch/query-dsl.html',
        '/backend/middleware/elasticsearch/aggregations.html',
        '/backend/middleware/elasticsearch/mapping.html',
        '/backend/middleware/elasticsearch/analysis.html',
        '/backend/middleware/elasticsearch/config.html',
        {
          text: 'Query DSL',
          collapsible: true,
          children: [
            '/backend/middleware/elasticsearch/query-dsl-query-filter-context.html',
            '/backend/middleware/elasticsearch/query-dsl-compound-queries.html',
            '/backend/middleware/elasticsearch/query-dsl-full-text-queries.html',
            '/backend/middleware/elasticsearch/query-dsl-match-all-query.html',
          ]
        },
        '/backend/middleware/elasticsearch/java-rest-high-rest-client.html'
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
            '/backend/middleware/redis/prod-message-queue.html',
            '/backend/middleware/redis/prod-clock-in.html',
            '/backend/middleware/redis/prod-uv.html',
          ]
        },
        '/backend/middleware/redis/persistence.html',
        {
          text: '集群',
          collapsible: true,
          children: [
            '/backend/middleware/redis/cluster-master-slave.html',
            '/backend/middleware/redis/cluster-sentinel.html',
            '/backend/middleware/redis/cluster-shard.html',
          ]
        },
        {
          text: '最佳实践',
          collapsible: true,
          children: [
            '/backend/middleware/redis/best-practice-kv-design.html',
            '/backend/middleware/redis/best-practice-service-config.html',
          ]
        },
        {
          text: '底层数据结构',
          collapsible: true,
          children: [
            '/backend/middleware/redis/data-structure-sds.html',
            '/backend/middleware/redis/data-structure-intset.html',
            '/backend/middleware/redis/data-structure-dict.html',
            '/backend/middleware/redis/data-structure-zip-list.html',
            '/backend/middleware/redis/data-structure-quick-list.html',
            '/backend/middleware/redis/data-structure-skip-list.html',
            '/backend/middleware/redis/data-structure-redis-object.html',
          ]
        },
        {
          text: '数据类型底层实现',
          collapsible: true,
          children: [
            '/backend/middleware/redis/data-type-impl-string.html',
            '/backend/middleware/redis/data-type-impl-list.html',
            '/backend/middleware/redis/data-type-impl-set.html',
            '/backend/middleware/redis/data-type-impl-zset.html',
            '/backend/middleware/redis/data-type-impl-hash.html',
          ]
        },
        '/backend/middleware/redis/memory-management-strategy.html',
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
  '/backend/middleware/kafka': [
    {
      text: 'Kafka',
      children: [
        '/backend/middleware/kafka/index.html',
        '/backend/middleware/kafka/introduce.html',
      ]
    }
  ],
  '/portal/base/css': [
    {
      text: 'CSS',
      children: [
        '/portal/base/css/index.html',
        '/portal/base/css/selector.html',
        '/portal/base/css/font.html',
        '/portal/base/css/float.html',
        '/portal/base/css/position.html',
        '/portal/base/css/background.html',
        '/portal/base/css/gradient.html',
        '/portal/base/css/table.html',
        '/portal/base/css/hack.html',
        '/portal/base/css/center.html',
        '/portal/base/css/transition.html',
        '/portal/base/css/animation.html',
        '/portal/base/css/transform.html',
        '/portal/base/css/flex.html',
        '/portal/base/css/less.html',
        '/portal/base/css/media.html',
      ]
    }
  ],
  '/portal/base/js/': [
    {
      text: 'JavaScript',
      children: [
        '/portal/base/js/index.html',
        '/portal/base/js/data-type.html',
        '/portal/base/js/usage.html',
        '/portal/base/js/object.html',
        '/portal/base/js/function.html',
        '/portal/base/js/scope.html',
        '/portal/base/js/this.html',
        '/portal/base/js/gc.html',
        '/portal/base/js/array.html',
        '/portal/base/js/string.html',
        '/portal/base/js/regex.html',
        '/portal/base/js/dom-api.html',
        '/portal/base/js/bom.html',
        '/portal/base/js/interval.html',
        '/portal/base/js/context.html',
        '/portal/base/js/closure.html',
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
  '/archive/design-patterns':[
    {
      text: '设计模式',
      children: [
        '/archive/design-patterns/index.html',
        '/archive/design-patterns/design-principle.html',
        {
          text: "创建型模式",
          collapsible: true,
          children: [
            '/archive/design-patterns/creational-patterns/index.html',
            '/archive/design-patterns/creational-patterns/singleton.html',
            '/archive/design-patterns/creational-patterns/factory.html',
            '/archive/design-patterns/creational-patterns/prototype.html',
            '/archive/design-patterns/creational-patterns/builder.html'
          ]
        },
        {
          text: "结构型模式",
          collapsible: true,
          children: [
            '/archive/design-patterns/structural-patterns/index.html',
            '/archive/design-patterns/structural-patterns/proxy.html',
          ]
        },
        // '/archive/design-pattern/singleton.html',
        // '/archive/design-pattern/factory.html',
        // '/archive/design-pattern/abstract-factory.html',
        // '/archive/design-pattern/builder.html',
        // '/archive/design-pattern/prototype.html',
        // '/archive/design-pattern/adapter.html',
        // '/archive/design-pattern/bridge.html',
        // '/archive/design-pattern/composite.html',
        // '/archive/design-pattern/decorator.html',
        // '/archive/design-pattern/facade.html',
        // '/archive/design-pattern/flyweight.html',
        // '/archive/design-pattern/proxy.html',
        // '/archive/design-pattern/chain-of-responsibility.html',
        // '/archive/design-pattern/command.html',
        // '/archive/design-pattern/interpreter.html',
        // '/archive/design-pattern/iterator.html',
        // '/archive/design-pattern/mediator.html',
        // '/archive/design-pattern/memento.html',
        // '/archive/design-pattern/observer.html',
        // '/archive/design-pattern/state.html',
        // '/archive/design-pattern/strategy.html',
        // '/archive/design-pattern/template-method.html',
        // '/archive/design-pattern/visitor.html',
      ]
    }
  ]

}