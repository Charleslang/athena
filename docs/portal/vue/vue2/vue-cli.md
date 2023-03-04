# Vue CLI

CLI 即 Command-Line Interface，即命令行界面，俗称 CLI。   

为什么需要 CLI？它能够帮助我们进行项目的配置以及 webpack 的相关配置。  

## 安装

**在使用 Vue CLI 之前，需要确保你已经安装了 Node。**  

使用 `npm install -g @vue/cli`，推荐使用全局安装，这样是安装的 cli3。当然，我们可以在 cli3 中使用 cli2 的模板（现在默认安装的是 cli4 了）。

```sh
# 此处我安装 3.11.0
npm install -g @vue/cli@3.11.0
# 查看版本
vue -V
vue --version
```
使用 npm 下载过慢，解决方式如下：
```sh
# 使用淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 然后使用 cnpm 代替 npm 即可

# 但是有时使用淘宝镜像会下载出错，所以可以使用代理。然后照样使用 npm intall 即可
npm config set registry https://registry.npm.taobao.org

# 临时使用淘宝镜像
npm --registry https://registry.npm.taobao.org install
```

**安装报错解决**

如果在安装 CLI 时报错或者安装不上，可以通过以下几种方式解决： 

1. 卸载重装  
  
  ```sh
  # 清理缓存
  npm cache clean --force
  # 卸载
  npm uninstall -g @vue/cli
  ```

2. 以管理员身份运行 cmd 重新安装  

  在清理 cli 缓存时，实际上是删除的某个文件夹，位置在 `C:/user/Administrator/AppData/Roaming/npm-cache`。把该文件夹删除后，重新安装 CLI 即可（先卸载再删除）。

:::tip 提示
当我们在项目中下载了某个插件，但是，我们突然又不想使用它了，这时，我们可以在 config/index.js 中禁用此插件或依赖。
:::

## runtime+compiler 和 runtime-only

使用 `runtime+compiler` 时，dom 的渲染过程为 template -> ast（abstract syntax tree）-> render -> virtual dom（vdom）-> dom（UI）；而使用 `runtime-only` 时，渲染过程为 render -> virtual dom（vdom）-> dom（UI），所以此方式的性能更高，且所需的 vue 源码量更少（少 6 KB）。因此，在以后的项目中尽量使用 `runtime-only`。

**渲染时的代码区别**

- runtime + compiler  

  ```js
  import Vue from 'vue'
  import App from './App'

  // 当然，它也可以使用 render 函数来代替组件和模板的注册
  new Vue({
    el: '#app',
    components: { App },
    template: '<App/>'
  })
  ```

- runtime-only  

  ```js
  import Vue from 'vue'
  import App from './App'

  new Vue({
    el: '#app',
    // 使用 render 函数
    render: h => h(App)
  })
  ```

**上面用到了 render 函数，那么什么是 render 函数？**   

该函数的全称写法如下：
```js
render: function(createElement) {
  // createElement 函数的用法如下
  // createElement('标签', {标签的属性}, [标签内容])
  // 这些参数都是可选的
  // 创建 h2 标签（会自动替换掉 Vue 实例所绑定的元素）
  // 设置 h2 标签的 class、id
  // 设置 h2 标签中的内容
  return createElement('h2', {
    class: 'box',
    id: 'box'
  },
  ['hello world', createElement('button', ['按钮'])])
}
```
上面的示例中只放了普通的 html 标签，它也可以放入组件：
```js
const cpn = {
  template: `<button>按钮</button>`,
  data() {
    return {
      mes: 'hello'
    }
  }
}
new Vue({
  el: '#app',
  render: function(createElement) {
    return createElement(cpn)
  }
})
```
上面说到，使用 runtime-only 时只经历了 render -> vdom -> dom，但是，在导入的 App.vue 中存在 `<template></template>` 标签，那么它是否会被解析而执行步骤 template -> ast 呢？当然不会，因为插件 vue-template-compiler 会帮我们解析此标签，从而只保留标签中的内容。

## 创建 Vue 项目
cli3 移除了 cli2 中的 build、config 文件夹，static 被修改为 public（存放静态资源，打包时，会将该文件中的内容原封不动的进行打包）。  

以下是 cli3 创建 Vue 项目的步骤：
```sh
# cli2
vue init webpack projectname
# cli3
vue create projectname

# 然后选择所需要的依赖
default (babel, eslint)  # 默认配置提供 babel 和 eslint 支持
Manually select features # 自己手动去选择需要的配置（我选择的是手动）

# 在选择手动的基础之上才会有下面这一步
# 这一步通过空格选择或取消（初学时我只选 Babel），然后回车
Babel              # 主要是对 es6 语法转换成兼容的 js（选上）
TypeScript         # 支持使用 TypeScript语 法来编写代码
PWA                # PWA 支持
Router             # 支持 vue 路由配置插件（一般都会选择）
Vuex               # 支持 vue 程序状态管理模式 (一般都会选择)
CSS Pre-processors # 支持 css 预处理器 （一般都会选择）
Linter / Formatter # 支持代码风格检查和格式化 （选上）
Unit Testing       # 单元测试
E2E Testing        # E2E测试

# 接着这问将 Babel,PostCSS,ESLint 这些配置文件放哪，通常我们会选择放到独立位置，让 package.json 文件干净点，所以选择第一个 点击回车（即选择 In dedicated config file）
# 然后会问是否保存本次配置方便下次直接使用，我选择 y
# 在选择 y 的基础上输入配置保存的名字
# 然后会自动下载所需依赖，到此，项目创建完成
```
**在刚刚创建项目时，我们保存了配置信息，那么如何删除呢？**  

在 `C:\user\Administrtor\.vuerc` 中有如下信息：
```json
{
  "useTaobaoRegistry": false,
  "latestVersion": "4.4.6",
  "lastChecked": 1594458976134,
  "packageManager": "npm",
  "presets": {
    // 删除 djf1 即可
    "djf1": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {}
      }
    }
  }
}
```
:::warning 注意
使用脚手架时，项目名最好不要有符号和中文等，可以在项目创建完成后进行重命名。
:::

## 项目结构分析
项目结构如下：
```txt
- testcli1
-- node_modules
-- public
-- src
-- .gitignore
-- babel.config.js
-- package.json
-- package-lock.json
```
package.json 中存放项目的依赖（大致的版本），可使用 `npm install` 进行安装，而 package-lock.json 中存放的是项目实际下载的依赖的版本。

然后执行 `npm run serve` 启动即可访问。  

为什么执行 `npm run serve` 之后就可以访问呢？因为该命令实际执行的命令是 `node src/main.js`，即执行了 main.js 文件，因为 node 环境中可以不依赖浏览器而直接运行 js（在 cli2 中可以在配置文件中看见，而 cli3 则将这些配置文件隐藏起来了）。  

`src/main.js` 的源码如下：
```js
import Vue from 'vue'
import App from './App.vue'

// 在构建项目（执行命令）时是否需要显示提示信息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```
我们发现，它自动使用的是 render 函数，而且使用的是 `$mount` 来代替 el 挂载元素（el 执行的本质就是执行 `$mount` 函数）。  


我们如何修改项目中的依赖或配置呢，接下来介绍几种方式。  

- 使用 UI 界面  

  vue ui 是 cli3 中新增的服务，它用来可视化管理我们的项目。在任意目录下执行 `vue ui`，之后会打开一个网页。我们可以在网页中创建、修改项目。

- 使用 webpack  

  我们在前面讲到，cli3 创建项目时隐藏了 cli2 中的 build、config 文件夹，其实它们都在 node_modules/@vue/cli-service 文件夹下面，相当于内置了 webpack。

- 使用自定义配置  

  在当前项目的根目录下创建文件夹 `vue.config.js`（名字是固定的），然后在该文件中导出我们需要的配置即可，该配置会和原配置合并一起使用：
  ```js
  module.exports = {
    // ...
  }
  ```

:::tip 提示
通过项目结构可以发现, 我们只在 `main.js` 中导入了 `App.vue`, 所以 `App.vue` 文件中应该直接或间接包含项目中所有的 Vue 文件。
:::
