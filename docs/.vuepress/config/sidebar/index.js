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
  // '/portal/vue/': [
  //   {
  //     text: 'Vue',
  //     children: [
  //       {
  //         text: 'Vue3',
  //         link: '/portal/vue/vue3/index.html'
  //       },
  //       {
  //         text: 'Vue2',
  //         link: '/portal/vue/vue3/index.html'
  //       }
  //     ]
  //   }
  // ]

}