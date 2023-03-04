# Vue-Router
Vue-Router 即 Vue 路由，其目的就是通过网络将信息从原地址传递到目的地址的活动。  

**后端路由：**  

由后台（contoller）处理 URL 与页面的跳转关系，并且在后端中进行页面渲染，页面中逻辑和 HTML 都存在。其实 jsp 就是后端路由。  

**前端路由：**   
随着 Ajax 兴起的前后端分离之后，前端出现了 SPA（single page application，即单页面富应用），整个网页就只有一个 HTML 页面。使用路由来把相应的 URL 和要显示的页面（组件）进行关联，即改变 URL 时，页面不会进行整体刷新。  


如何改变 URL 而不使页面刷新呢？下面介绍几种方法。

- 使用 url 的 hash  

  ```js
  location.hash = 'xxx'
  ```

- H5 中的 history  

  ```js
  // 此方式会有历史记录，可以使用 history.bakc() 进行返回
  history.pushState({}, '', 'xxx')

  // 使用另一种方式，但是此方式不会有历史记录
  history.replaceState({}, '', 'xxx')
  ```

在 `vue-router` 中默认使用的是 hash。好了，在经过了上面的介绍之后，我们可以开始使用 Vue-Router 了。  

首先，如果没有安装 `vue-router` 插件的话，我们需要额外进行安装：
```sh
npm install vue-router --save
```
或者使用如下方式安装（参考 [Installation](https://router.vuejs.org/installation.html#npm)）：  

> *If you have a project using Vue CLI you can add Vue Router as a plugin. You can let the CLI generate the code above for you as well as two sample routes. It will also overwrite your App.vue so make sure to backup the file before running the following command inside your project:*  
```sh
vue add router
```

如果在创建项目时选择了 `vue-router`，那么可以不用再次进行安装，且项目会多出 router 相关的文件夹，如果没有在项目创建时添加 router 插件，那么需要我们自己来搭建 router。  

在项目的 src 目录下创建 router 文件夹，然后在该文件夹中创建 `index.js`。配置如下：  

1. 在 `src/router/index.js` 添加：

  ```js
  import VueRouter from 'vue-router'
  import Vue from 'vue'

  // 1.通过 Vue.use() 来注册插件
  // 在 Vue 中使用任何插件，都应该先进行注册
  Vue.use(VueRouter)

  // 2.创建路由对象
  // 配置映射关系
  const routes = [

  ]
  const router = new VueRouter({
    routes
  })

  // 3.导出路由对象，以便在 Vue 实例中使用
  export default router
  ```
2. `main.js` 中使用路由  

  ```js
  import Vue from 'vue'
  import App from './App.vue'
  // index.js 可省，它会自动在该文件夹中（此处是 router）找 index.js
  import router from './router'

  Vue.config.productionTip = false

  new Vue({
    render: h => h(App),
    // 配置路由, ES6 语法
    router
  }).$mount('#app')

  ```

通过以上步骤，就成功的搭建好了路由，但是还不能使用。因为我们没有配置路由映射关系。接下来，配置路由映射：

**1. 创建路由组件**  

- `components/Home.vue`

  ```html
  <template>
    <div>
      <h3>Home Title</h3>
      <p>The Description About Home.vue</p>
    </div>
  </template>

  <script>
  export default {

  }
  </script>

  <style>

  </style>
  ```

- `components/About.vue`

  ```html
  <template>
    <div>
      <h3>About Title</h3>
      <p>The Description About About.vue</p>
    </div>
  </template>

  <script>
  export default {

  }
  </script>

  <style>

  </style>
  ```

**2. 配置映射关系**  

- `src/router/index.js`

  ```js
  // 导入组件
  import Home from '../components/Home'
  import About from '../components/About'

  // 配置路由映射
  const routes = [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    }
  ]
  ```

**3. 使用路由** 

- `App.vue`

  ```html
  <template>
    <div id="app">
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-view></router-view>
      <p>hello router</p>
    </div>
  </template>
  ```
然后就可以在浏览器中访问了。  

对上面的配置做一点说明：  
1. `<router-link>` 和 `<router-view>` 是 vue-router 这个插件中自动注册的全局组件，所以可以在任意 vue 文件中使用。
2. `<router-link>` 默认被解析为 `<a>` 标签，它的 `to` 属性默认被解析为 `a` 标签中的 `href` 属性。
3. `<router-link>` 中 `to` 属性的值必须和路由中映射的 `path` 一致。
4. 当点击上面的 `<router-link>` 时，`<router-view>` 标签中的内容会被替换为路由映射中的文件的内容。
5. `<router-view>` 标签可以放在任何位置。  

上面提到了路由的基本使用，接下来对某些细节进行说明和改进。  

当用户第一次进行网页时，需要自己点击才能显示相应的内容，显然不太友好。这时，我们可以配置一个默认显示页面：
```js
const routes = [
  // 配置默认显示页面，方式一
  /*{
    path: '',
    component: Home
  }*/
  
  // 配置默认显示页面，方式二（推荐）
  {
    path: '',
    // 重定向
    redirect: '/home'
  }
]
```
路由默认使用的 hash 的方式，路径类似 `http://localhost:8080/#/home`，我们会发现在路径中多了 #，这样看着非常别扭，我们可以修改路由的方式为 history：
```js
const router = new VueRouter({
  routes,
  mode: 'history'
})
```
:::tip 提示
如果访问了某个不存在映射的路径，网页也不会出现 404。
:::

---

**router-link 补充：**  

我们在前面提到，该标签默认被解析为 `a` 标签，那么，我们是否可以指定它被解析为的标签呢？当然是可以的，我们可以通过它的 `tag` 属性来指定。
```html
<!-- 被渲染为 button 标签 -->
<router-link to="/home" tag="button">Home</router-link>
<router-link to="/about" tag="button">About</router-link>
```
当我们点击 `<router-link>` 之后，浏览器会有历史，如果我们不想使用历史记录，则可以在该标签中加上 `replace` 属性（前提是路由的 `mode` 属性为 `history`），其实使用的是 `history.replaceState()`。
```html
<router-link to="/home" tag="button" replace>Home</router-link>
<router-link to="/about" tag="button" replace>About</router-link>
```
我们可以发现，当某个 `<router-link>` 被点击时，它的 `class` 为 `class=router-link-exact-active router-link-active`，那么我们可以添加 css 样式：
```css
.router-link-active {
  color: #f60;
}
```
但是，这个 class 名字太长了，我们是否可以更改呢？肯定是可以的，只需要加上 `active-class` 即可：

```html
<router-link to="/home" tag="button" replace active-class="active">Home</router-link>
<router-link to="/about" tag="button" replace active-class="active">About</router-link>
```
```css
.active {
  color: #f60;
}
```
当有多个标签时，我们可能需要为每个都加上 `active-class`, 这样会显得很麻烦，我们可进行批量修改：
```js
const router = new VueRouter({
  routes,
  mode: 'history',
  // 批量修改选中时的 class
  linkActiveClass: 'active1'
})
```
---
其实，我们也可以使用代码来实现 `<router-link>` 标签的功能，如下：
```vue
<template>
  <div id="app">
    <!-- <router-link to="/home" tag="button" replace active-class="active">Home</router-link>
    <router-link to="/about" tag="button" replace active-class="active">About</router-link> -->
    <!-- <router-link to="/home" tag="button" replace>Home</router-link>
    <router-link to="/about" tag="button" replace>About</router-link> -->
    <button @click="toHome">Home</button>
    <button @click="toAbout">About</button>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    toHome() {
      // history.pushState('/home')
      // $router 是 vue-router 在所有组件中自动添加的，即 new VueRouter() 的实例
      this.$router.push('/home')
      // this.$router.replace('/home')
    },
    toAbout() {
      // history.pushState('/about')
      this.$router.push('/about')
      // this.$router.replace('/about')
    }
  }
}
</script>

<style>
  .active1 {
    color: #f60
  }
</style>
```

## 动态路由

某些情况下，URL 可能是不确定的，如 `/user/zs`，`/user/ls`，我们可能需要在 `/user` 后面加上用户的用户名，这时候就可以使用动态路由。

- `User.vue`

  ```vue
  <template>
    <div>
      <h3>User Title</h3>
      <p>The User Page</p>
      <!-- 获取 URL 中的用户名 -->
      {{ 'name: ' + userId }}
      <!-- {{ $route.params.uid }} -->
    </div>
  </template>

  <script>
  export default {
    computed: {
      userId() {
        // $route 就是当前被点击的那个 router-link 标签
        // uid 就是路由中配置的那个值，即 '/user/:uid' 的 uid
        return this.$route.params.uid
      }
    }
  }
  </script>

  <style>

  </style>
  ```

- `src/router/index.js`

  ```js
  import VueRouter from 'vue-router'
  import Vue from 'vue'

  import Home from '../components/Home'
  import About from '../components/About'
  import User from '../components/User'

  // 1.通过 Vue.use() 来配置插件
  Vue.use(VueRouter)

  // 2.创建路由对象
  const routes = [
    {
      // path: '',
      // component: Home
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/user/:uid',
      component: User
    }
  ]
  const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active'
  })

  // 3.导出路由对象，以便在 Vue 实例中使用
  export default router
  ```

- `App.vue`

  ```vue
  <template>
    <div id="app">
      <router-link to="/home" tag="button" replace>Home</router-link>
      <router-link to="/about" tag="button" replace>About</router-link>
      <router-link :to="'/user/' + userId" tag="button" replace>User</router-link>
      <router-view></router-view>
    </div>
  </template>

  <script>

  export default {
    name: 'App',
    data() {
      return {
        userId: 'zs'
      }
    }
  }
  </script>

  <style>
    .active {
      color: #f60
    }
  </style>
  ```
## 路由懒加载

**官方的解释为：**    

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。  

**打包文件解析：**  

先执行 `npm run build` 进行打包，然后会发现多出了 dist 文件夹，该文件夹内的 js 文件夹中的 app....js 是我们自己写的代码，而 vendors....js 中是第三方的 js 代码。为了防止 app....js 文件过大，所以，我们需要对文件进行拆分。


**路由懒加载能为我们做什么？** 

1. 将路由对应的组件打包成一个 js 代码块
2. 只有在这个路由被访问时，才加载对应的组件

懒加载的代码修改如下：

- `src/router/index.js`

  ```js
  import VueRouter from 'vue-router'
  import Vue from 'vue'

  // import Home from '../components/Home'
  // import About from '../components/About'
  // import User from '../components/User'

  // 路由懒加载
  const Home = () => import('../components/Home')
  const About = () => import('../components/About')
  const User = () => import('../components/User')

  // 1.通过 Vue.use() 来配置插件
  Vue.use(VueRouter)

  // 2.创建路由对象
  const routes = [
    {
      // path: '',
      // component: Home
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/user/:uid',
      component: User
    }
  ]
  const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active'
  })

  // 3.导出路由对象，以便在 Vue 实例中使用
  export default router
  ```
  
  通过上面的方式就实现了路由懒加载。此时打包之后就会多出 3 个 js 文件。


:::details 注意
上面使用的是 ES6 的 import 来进行异步加载的，这个 import 方法里面不推荐使用变量，如果使用了变量，则会在编译时发出警告，而且不会异步加载组件，如下：
```js
// import 中使用变量
const component = '@/A'
component: () => import(component)

// 警告如下：
// Critical dependency: the request of a dependency is an expression
```
如果我们真的想使用变量，可以像下面这样做：
```js
// import 中使用变量（编译会出现警告，运行正常）：
const component = 'A'
component: () => import(`@/${component}`)

// import 中使用变量（编译不会出现警告，运行正常）：
const component = 'A'
component: () => import(`@/${component}.vue`)
```
~~但是，我们更加推荐使用 webpack 的方式来代替，如下：~~
```js
// require 不能解析别名 @
const component = `views/App`
component(resolve) {require([`../${component}.vue`], resolve)}

// 此处的 `..` 需要根据实际需要来写，比如我的请求 api.js 和 views 文件夹在同一目录，则此时就该是 ./${component}.vue
```
:::


## 嵌套路由

嵌套路由是一个很常见的功能。比如，我们需要显示 `/home/news` 和 `/home/message` 这两个不同的内容。即相当于在大的容器中显示一个小容器。

在 `Home.vue` 中显示两个子页面 `HomeNews.vue` 和 `HomeMessage.vue`：

- `HomeNews.vue`
  ```vue
  <template>
    <div>
      <ul>
        <li>新闻1</li>
        <li>新闻2</li>
        <li>新闻3</li>
      </ul>
    </div>
  </template>
  ```

- `HomeMessage.vue`

  ```vue
  <template>
    <div>
      <ul>
        <li>Message1</li>
        <li>Message2</li>
        <li>Message3</li>
      </ul>
    </div>
  </template>
  ```

- `src/router/index.js`

  ```js
  import VueRouter from 'vue-router'
  import Vue from 'vue'

  // 路由懒加载
  const Home = () => import('../components/Home')
  const HomeNews = () => import('../components/HomeNews')
  const HomeMessage = () => import('../components/HomeMessage')

  // 1.通过 Vue.use() 来配置插件
  Vue.use(VueRouter)

  // 2.创建路由对象
  const routes = [
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          redirect: 'news'
        },
        // 子组件的 path 不需要加 /
        {
          path: 'news',
          component: HomeNews
        },
        {
          path: 'message',
          component: HomeMessage
        }
      ]
    }
  ]
  const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active'
  })

  // 3.导出路由对象，以便在 Vue 实例中使用
  export default router
  ```

- `Home.vue`

  ```vue
  <template>
    <div>
      <h3>Home Title</h3>
      <p>The Description About Home.vue</p>
      
      <!-- 显示子组件, 注意 to 前面需要有 / -->
      <router-link to="/home/news">新闻</router-link>
      <router-link to="/home/message">消息</router-link>
      <router-view></router-view>
    </div>
  </template>
  ```

## 路由传参

当组件切换时，我们同时需要将数据传递到另一个组件，这时就可以使用路由组件传参。参数传递主要有两种类型：params 和 query。 

**1. params**  

在动态路由中，我们已经使用过 params，URL 类似 RESTFul。

```js
// 配置路由
{
  path: '/user/:uid',
  // path: '/user/:uid?', // 表示路由参数 id 可选
  component: User,
  meta: {
    title: 'user'
  }
}
```
```html
<!-- 传参 -->
<router-link :to="'/user/' + userId" tag="button" replace>User</router-link>
```
**2. query**  

URL 形如 `/user?id=123`，其参数是一个对象。

- `Profile.vue`
    
  ```vue
  <template>
    <div>
      <h3>Profile Title</h3>
      <p>The Profile Content</p>
      {{ $route.query }}
    </div>
  </template>
  ```

- `src/router/index.js`
  
  ```js
  import VueRouter from 'vue-router'
  import Vue from 'vue'

  // 路由懒加载
  const Profile = () => import('../components/Profile')

  // 1.通过 Vue.use() 来配置插件
  Vue.use(VueRouter)

  // 2.创建路由对象
  const routes = [
    {
      path: '/profile',
      component: Profile
    }
  ]
  const router = new VueRouter({
    routes,
    mode: 'history',
    linkActiveClass: 'active'
  })
  
  // 3.导出路由对象，以便在 Vue 实例中使用
  export default router
  ```

- `App.vue`
    
  ```vue
  <template>
    <div id="app">
      <router-link to="/home" tag="button" replace>Home</router-link>
      <router-link to="/about" tag="button" replace>About</router-link>
      <router-link :to="'/user/' + userId" tag="button" replace>User</router-link>
      <!-- <router-link to="/profile">Profile</router-link> -->
      <router-link :to="{path: '/profile', query: {name: 'zs', age: 23}}">Profile</router-link>
      <router-view></router-view>
    </div>
  </template>
  ```

然后点击 Profile 这个菜单，会发现实际上的 URL 为 `http://localhost:8080/profile?name=zs&age=23`。

接下来使用代码跳转，只需修改 `App.vue` 即可：
```vue
<template>
  <div id="app">
    <router-link to="/home" tag="button" replace>Home</router-link>
    <router-link to="/about" tag="button" replace>About</router-link>
    <button @click="toUserPage">User</button>
    <button @click="toProfile">Profile</button>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      userId: 'zs'
    }
  },
  methods: {
    toUserPage() {
      this.$router.push('/user/' + this.userId)
    },
    toProfile() {
      this.$router.push({
        path: '/profile',
        query: {
          name: 'zxc',
          age: 123,
          height: 1.88
        }
      })
    }
  }
}
</script>

<style>
  .active {
    color: #f60
  }
</style>
```
## 导航守卫

“导航”表示路由正在发生改变。即点击切换的过程就是“导航”。在使用导航之前，我们先来介绍几个 Vue 生命周期函数。  

**`created()`**  

当页面被渲染完成之后（此时，元素并没有挂载到 DOM 上，即不能获取 DOM，注意与 `mounted()` 的区别），会自动调用这个函数。

```vue
<template>
  <div>
    <h3>Home Title</h3>
    <p>The Description About Home.vue</p>
    <!-- 显示子组件 -->
    <router-link to="/home/news">新闻</router-link>
    <router-link to="/home/message">消息</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    created() {
      console.log('created home')
      // 修改网页的 title
      document.title = 'home'
    }
  }
</script>
```
**`destroyed()`**  

页面被销毁时调用该函数。

**`mounted()`**   

当 `<template></template>` 中的内容被挂载到 DOM 上面之后（即页面显示），会自动调用这个函数。

**`updated( )`**  

当页面内容发生刷新之后，会自动调用这个函数。  

**`activated( )`**  

组件活跃时 (内置函数，必须配合 `keep-alive` 使用才生效)。

**`deactivated( )`**  

组件不活跃时调用 (内置函数，必须配合 `keep-alive` 使用才生效)。

### 全局导航守卫
当我们切换不同的页面时，需要网页显示不同的 title，这时就可以使用导航守卫。
```js
import VueRouter from 'vue-router'
import Vue from 'vue'

// import Home from '../components/Home'
// import About from '../components/About'
// import User from '../components/User'

// 路由懒加载
const Home = () => import('../components/Home')
const HomeNews = () => import('../components/HomeNews')
const HomeMessage = () => import('../components/HomeMessage')
const About = () => import('../components/About')
const User = () => import('../components/User')
const Profile = () => import('../components/Profile')

// 连续多次点击报错解决
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 1.通过 Vue.use() 来配置插件
Vue.use(VueRouter)

// 2.创建路由对象
const routes = [
  {
    // path: '',
    // component: Home
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: 'home'
    },
    children: [
      {
        path: '',
        redirect: 'news'
      },
      // 子组件的 path 不需要加 /
      {
        path: 'news',
        component: HomeNews
      },
      {
        path: 'message',
        component: HomeMessage
      }
    ]
  },
  {
    path: '/about',
    component: About,
    meta: {
      title: 'about'
    }
  },
  {
    path: '/user/:uid',
    component: User,
    meta: {
      title: 'user'
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: 'profile'
    }
  }
]
const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})

// 全局导航守卫（路由中已经默认调用此方法，但只会调用 next()）
router.beforeEach((to, from, next) => {
  // 修改 title
  // to 就是下一个要跳转的路由，它是 routes 中的每个元素
  // 为了防止 children 无法显示 title，所以要加上 matched[0]
  document.title = to.matched[0].meta.title
  console.log('guard')
  // 必须调用 next() 才能跳转，
  next()
})

// 3.导出路由对象，以便在 Vue 实例中使用
export default router
```
上面使用的是 `beforeEach( )` ，即前置钩子（回调），在页面跳转之前修改网页的 title。当然，也有后置钩子，后置钩子使用 `afterEach()`，且后置钩子不需要调用 `next()`。
```js
// 后置钩子
router.afterEach((to, from) => {
  console.log('hook')
})
```
:::tip 小贴士
可以使用全局导航守卫判断用户是否登陆。
:::

### 路由独享守卫
只在某一个路由中使用守卫。
```js
const routes = [
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: 'profile'
    },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      console.log('profile router guard')
      // 必须调用 next 才能跳转
      next()
      // 禁止跳转
      // next(false)
      // 跳转到其它页面
      // next('/login')
    }
  }
]
const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})
```
这些守卫与全局前置守卫的方法参数是一样的。

### 组件内的守卫

最后，你可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`
- `beforeRouteUpdate` (2.2 新增)
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```
`beforeRouteEnter` 守卫不能访问 `this`，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```
注意 `beforeRouteEnter` 是支持给 next 传递回调的唯一守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，`this` 已经可用了，所以不支持传递回调，因为没有必要了。
```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```
这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 `next(false)` 来取消。
```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```
:::tip 提示
导航守卫的更多内容请见 [导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB)。
:::

## keep-alive
如果我们想要缓存页面的状态，在页面切换之后，原来的内容依旧被保存，当再次回到该页面时，页面的状态就是离开时的状态，而不是重新加载。这时，我们就可以使用 `keep-alive`。  

`keep-alive` 是 Vue **内置**的一个组件，可以使被包含的组件保留状态，避免重新渲染。如果 `<router-view>` 被直接包含到 `keep-alive` 中，那么所有路径匹配到的组件都会被缓存。默认情况下，组件跳转之后会被销毁，再次来到该页面时又会被重新创建；而 `keep-alive` 可以保证组件不会被多次销毁和创建。

为了保持页面状态，请看下面的示例：

- `App.vue`  

  ```vue
  <template>
    <div id="app">
      <router-link to="/home" tag="button" replace>Home</router-link>
      <router-link to="/about" tag="button" replace>About</router-link>
      <router-link :to="'/user/' + userId" tag="button" replace>User</router-link>
      <router-link :to="{path: '/profile', query: {name: 'zs', age: 23}}">Profile</router-link>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </template>
  ```

- `Home.vue`  

  ```vue
  <template>
    <div>
      <h3>Home Title</h3>
      <p>The Description About Home.vue</p>
      <!-- 显示子组件 -->
      <router-link to="/home/news">新闻</router-link>
      <router-link to="/home/message">消息</router-link>
      <router-view></router-view>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        path: '/home/news'
      }
    },
    created() {
      console.log('created home')
      // 修改网页的 title
      // document.title = 'home'
    },
    // 组件活跃时 (内置函数，必须配合 keep-alive 使用才生效)
    activated() {
      this.$router.push(this.path)  
    },
    // 组件不活跃时调用 (内置函数，必须配合 keep-alive 使用才生效)
    deactivated() {

    },
    // 记录离开时的路径
    beforeRouteLeave (to, from, next) {
      // this.path = this.$route.path
      this.path = from.path
      console.log(this.path)
      next()
    }
  }
  </script>
  ```
但是，只要是包含在 `keep-alive` 里面的组件都不会被重新创建，如果我们想要某些组件被重新创建呢？这时，我们可以使用 `keep-alive` 的 `include` 和 `exclude` 属性。

- `Profile.vue`  

  ```vue
  <template>
    <div>
      <h3>Profile Title</h3>
      <p>The Profile Content</p>
      {{ $route.query }}
    </div>
  </template>

  <script>
  export default {
    // 命名为 Profile
    name: 'Profile',
    created() {
      console.log('profile created')
    }
  }
  </script>
  ```

- `App.vue`  

  ```vue
  <template>
    <div id="app">
      <router-link to="/home" tag="button" replace>Home</router-link>
      <router-link to="/about" tag="button" replace>About</router-link>
      <router-link :to="'/user/' + userId" tag="button" replace>User</router-link>
      
      <!-- include 和 exclude 的值是组件的 name，多个之间使用逗号隔开 -->
      <keep-alive exclude="Profile">
        <router-view></router-view>
      </keep-alive>
    </div>
  </template>
  ```
:::warning 注意
`keep-alive` 的 `include` 和 `exclude` 如果存在多个值，使用逗号隔开，且逗号前后**不！能！** 加空格。
:::

## Router 扩展
1. 所有组件都继承自 Vue 的原型
2. `$router` 和 `$route` 都是放在了 Vue 的原型上
3. `Vue.use(plugin)` 实际是调用的 `plugin.install()`

## Router 常见错误

**连续多次点击报错**

参考 [vue router连续点击多次路由报错解决方法](https://blog.csdn.net/qq_40282732/article/details/99693491)。
