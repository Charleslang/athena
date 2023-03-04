# webpack

什么是 webpack？本质就是一个模块打包工具。它依赖于 Node 环境，安装 Node 时，会自动安装 npm （node package manager）工具。

## 安装

**1. 安装 Node**

Node 的版本必须大于 8.9。[下载地址](https://nodejs.org/en/download/releases)。  

下载完成后安装即可（推荐安装 LTS 版本），安装时一直下一步即可。

```sh
# 查看 node 版本
node -v
# 查看 npm 版本
npm -v
```

:::tip 提示
npm 安装的包的默认位置请见：  
[npm默认安装路径设置](https://www.jianshu.com/p/645c758d4428)  
[查看npm包版本信息](https://www.jianshu.com/p/fca8274bd8cc)
:::

**2. 安装 webpack**

这里我安装的是 3.6.0 版本，即 cli2.x。
```sh
# -g 是全局安装，后面会使用局部安装
npm install webpack@3.6.0 -g
# 查看版本
webpack --version
```
## 使用 webpack
先来演示一下 webpack 的简单使用，文件目录如下所示：  

```
- webpackdemo
-- demo01
--- dist
--- src
---- index.js
---- main.js
--- index.html
```

- `index.js`  

  ```js
  function sum (x, y) {
    return x + y
  }

  function sul (x, y) {
    return x * y
  }

  // 导出模块
  module.exports = {
    sum, sul
  }
  ```

- `main.js`  

  ```js
  // 导入模块
  const {sum, sul} = require("./index.js")

  console.log(sum(1, 2))
  console.log(sul(1, 2))
  ```

上面使用的是 CommonsJS 中模块化，接着用 webpack 将 `main.js`  进行打包。注意，这里我们只将 `main.js` 进行了打包，并没有将 `index.js`  进行打包，因为在 `main.js` 依赖了 `index.js` ，所以， webpack 会自动将 `index.js` 也进行打包，打包命令如下：
```sh
webpack .\src\main.js .\dist\index.js
```
打包之后会发现，在 dist 目录中多了 index.js（我们打包时自定义的名字），这时，就可以将这个 index.js 文件在 html 文件中使用了（main.js不能直接在html中使用，因为浏览器无法解析 CommonsJS 中的模块，需要使用webpack打包成浏览器能够解析的 js 代码）。接下来使用 ES6 的模块化：
```js
// 在 webpack 中可以省略 .js 后缀
import {name,age} from "./info"
console.log('name', name)
console.log('age', age)
```
使用上面的打包方式会发现有点繁琐，那么有没有上面简化的方法呢？肯定是有的，我们可以在项目路径下配置打包的入口和出口，然后直接使用 webpack 命令即可，这时候，我们需要在项目的根路径下创建一个文件，文件名为 webpack.config.js（先这样写，后面再说怎么自定义文件名），然后在文件中进行如下配置：
```js
// 使用 node 自带的模块
const path = require('path')

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 必须是绝对路径，下面是错误的写法
    path: './dist',
    filename: 'index.js'
  }
}
```
当进行上面的配置之后，使用 webpack 命令会报错，提示 path 只能是绝对路径，但是，我们进行不要手动写，而是通过代码动态获取，这时就需要使用 node 的语法了，在使用之间，还需对项目配置 node 相关的一些东西，如下：  

在项目的根路径执行 `npm init` 然后一路回车即可（需要注意其中的package name不要出现中文或符号），然后会在项目中生成一个 package.json 文件，这个文件中包含了项目的依赖（第三方包），可以执行命令 `npm install` 来安装这些依赖。  

进入正题，修改 webpack.config.js：
```js
// 使用 node 自带的模块
const path = require('path')

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 必须是绝对路径
    // __dirname 是 node 中的自带属性，它是项目的根路径
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  }
}
```
然后载执行命令 `webpack` 进行打包即可。  

使用了上面的方式之后，我们希望通过 npm 进行打包，那么又该怎么做呢？其实很简单，只需将 webpack 和 npm 之间进行映射即可，在 package.json 中添加以下配置：
```json
{
  "name": "demo01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 添加以下内容，执行 npm run build 就相当于执行 webpack
    "build": "webpack"
  },
  "author": "",
  "license": "ISC"
}
```
但是，这样会优先执行局部（本地的）webpack 命令，我们刚才安装的是全局的 webpack。那么，本地和全局有什么不同吗？   

例如，我在全局安装的是 4.x 的 webpack，而在本地（当前项目中）安装的是 3.x 的 webpack，那么进行打包时 4.x 和 3.x 的打包方式是不完全相同的。下面，来进行本地安装，即在项目的根目录安装 webpack，执行以下命令
```sh
# --save-dev 表示 webpack 只在开发环境有效，运行环境无效
npm install webpack@3.6.0 --save-dev
```
安装完成后，会在原来的 package.json 中多出以下代码：
```json
"devDependencies": {
  "webpack": "^3.6.0"
}
```
而且会多出一个 node_modules 文件夹，现在执行 webpack 时，就是本地的了（前提是在 script 中进行了如下配置）
```json
"scripts": {
  // ......
  "build": "webpack"
}
```
## loader

当然，原生的 webpack 只能打包 js 文件，而我们的 css、图片、less、scss 等都可能是一个模块，因此，这些文件也需要被打包，这时就需要使用相应的 loader。[loader 中文官网](https://www.webpackjs.com/concepts/loaders)，进入官网后找到自己需要的，安装、配置即可。

**css-loader**  

打包 css 时，需要使用此 loader。
```sh
# 安装
npm install --save-dev css-loader
```
```js
// 配置 css-loader
// 使用 node 自带的模块
const path = require('path')

module.exports = {
  // 入口
  entry: './src/main.js',
  // 出口
  output: {
    // 必须是绝对路径
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 配置 css-loader
        use: ['css-loader']
      }
    ]
  }
}
```
在 main.js 中添加 css：
```js
require("./css/normal.css")
```
然后执行 `npm run build` 进行打包，打包完成之后我们发现，界面并没有发生改变，这是因为 css-loader 只负责加载 css，而不负责解析 css，如果想要让样式生效，我们还需要下载 style-loader。
```sh
npm install style-loader --save-dev
```
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        // 配置 css-loader
        // style-loader 负责将样式加到 DOM 中
        // 当有多个 loader 时，是从右向左依次读取的
        use: ['style-loader','css-loader']
      }
    ]
  }
}
```
**less-loader**  

```sh
# 还需安装 less-loader 和 less，因为 webpack 不能解析 less
npm install --save-dev less-loader less
# 如果安装报错，可以降低版本
npm install --save-dev less-loader@xxx less
```
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        // 配置 css-loader
        // style-loader 负责将样式加到 DOM 中
        // 当有多个 loader 时，是从右向左依次读取的
        use: ['style-loader','css-loader', 'less-loader']
      }
    ]
  }
}
```
```js
require("./css/special.less")
```
**url-loader 和 file-loader**  

使用此 loader 来打包图片：
```sh
npm install --save-dev url-loader
```
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        // 配置 css-loader
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 当加载的图片小于此值时，会将图片编译成 base64 的字符串形式
              // 单位是字节
              // 当加载的图片大于 limit 时，需要使用 file-loader
              limit: 3000
            }
          }
        ]
      }
    ]
  }
}
```
```css
body {
  background: url(../img/wyyyy.png);
}
```
如果图片的尺寸大于 limit 所规定的值，那么就需要额外使用 file-loader：
```sh
npm install --save-dev file-loader
```
```js
// 不需要配置 file-loader
module.exports = {
  output: {
    // 配置图片生成的位置
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // 配置 css-loader
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 当加载的图片小于此值时，会将图片编译成 base64 的字符串形式
              // 单位是字节
              // 当加载的图片大于 limit 时，需要使用 file-loader
              limit: 3000
            }
          }
        ]
      }
    ]
  }
}
```
在使用 file-loader 时，图片的名字为 32 位哈希值，接下来，我们希望保留原名，并且将图片统一放在一个文件夹下面，只需要进行下面的配置即可：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 指定打包后存放在 img 文件夹中
              // 图片名字为 原名.8位哈希.原扩展名
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}
```
**babel-loader**  

如果在文件中使用了 ES6 语法，那么打包之后还是存在，而部分浏览器不能解析 ES6 的语法，这时，就需要将 ES6 转为 ES5。
```sh
npm install --save-dev babel-loader@7 babel-core babel-preset-es2015
```
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
}
```
## 配置 Vue
接下来，我们不再通过 `<script></script>` 来引入 Vue，而是使用 webpack 来安装 Vue（这里我直接在上面的项目中进行安装）。
```sh
npm install vue --save
```
然后进行编码，在 `main.js` 中添加如下配置：
```js
import Vue from "vue"

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello webpack'
  }
})
```
编写 html 代码：
```html
<div id="app">
  {{ message }}
</div>
```
然后运行，发现会报错，错误如下：
```
You are using the runtime-only build of Vue where the template compiler is not available. 
Either pre-compile the templates into render functions, or use the compiler-included build
```
解决方案见官网 [运行时 + 编译器 vs. 只包含运行时](https://cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6), 其实就是在 `webpack.config.js` 中进行如下配置，然后重新打包。
```js
module.exports = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
```
以前我们写 Vue 代码的时候，都是直接在标签中添加要显示的内容，但是，我们可以不用频繁改变 html 文件，如下：
```html
<div id="app"></div>
```
我们就只在文件中写一个根标签即可，如果想在标签中添加某些内容，则可以在 Vue 实例中使用 template，该属性中的内容会替换掉 Vue 实例绑定的元素：
```js
import Vue from "vue"

new Vue({
  el: '#app',
  template: `
  <div>
    <h2>{{ message }}</h2>
    <button @click="btnClick">按钮</button>
    </div>
  `,
  data: {
    message: 'hello webpack'
  },
  methods: {
    btnClick () {
      console.log('btn...')
    }
  }
})
```
如果代码全部写在 `template` 中的话，可能不好维护，因此，改进如下：
```js
import Vue from "vue"

// 抽离模板
const app = {
  template: `
  <div>
    <h2>{{ message }}</h2>
    <button @click="btnClick">按钮</button>
  </div>
  `,
  data() {
    return {
      message: 'hello webpack'
    }
  },
  methods: {
    btnClick () {
      console.log('btn...')
    }
  }
}

new Vue({
  el: '#app',
  // 使用 components 中注册的 app
  template: '<app></app>',
  components: {
    // 注册组件，ES6 字面量增强
    app
  }
})
```
现在，再进行改进，使用模块化。在 src 中新建 vue/app.js，内容如下：
```js
export default {
  template: `
  <div>
    <h2>{{ message + '!!!'}}</h2>
    <button @click="btnClick">按钮</button>
  </div>
  `,
  data() {
    return {
      message: 'hello webpack'
    }
  },
  methods: {
    btnClick () {
      console.log('btn...')
    }
  }
}
```
然后在 main.js 中导入 app.js：
```js
import Vue from "vue"
import app from "./vue/app"

new Vue({
  el: '#app',
  // 使用 components 中注册的 app
  template: '<app></app>',
  components: {
    // ES6 字面量增强
    app
  }
})
```
接着，再进行修改，在 src 下创建 vue/App.vue，内容如下（VS Code 需要安装插件才有代码提示）：
```html
<template>
  <div>
    <h2 class="title">{{ message + '->vue'}}</h2>
    <button @click="btnClick">按钮</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello webpack'
    }
  },
  methods: {
    btnClick () {
      console.log('btn...')
    }
  }
}
</script>

<style>
  .title {
    color: #f60;
  }
</style>
```
然后在 main.js 中使用：
```js
import Vue from "vue"
// import app from "./vue/app"
import app from "./vue/App.vue"

new Vue({
  el: '#app',
  // 使用 components 中注册的 app
  template: '<app></app>',
  components: {
    // ES6 字面量增强
    app
  }
})
```
接着会发现使用 `npm run build` 报错，解决办法就是安装 vue-loader 和 vue-template-compiler：
```sh
npm install --save-dev vue-loader vue-template-compiler
```
```js
module.exports = {
  module: {
    rules: [
      // ......
      // 添加对 vue 文件的打包支持
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  }
}
```
进行了上面的配置之后，我们再使用 `npm run build` 进行打包，但是又报错了，如下：
```txt
vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.
```
解决办法：  

- 法一    
  
  在 webpack.config.js 中进行配置：
  ```js
  const VueLoaderPlugin = require('vue-loader/lib/plugin');

  module.exports = {
    // ......
    plugins: [new VueLoaderPlugin()]
  }
  ```

- 法二  

  Vue-loader 在 15.* 之后的版本都是 vue-loader 的使用都是需要伴生 VueLoaderPlugin 的, 所以，更换低版本的 vue-loader 即可解决。在 package.json （这个文件就相当于 maven，我们下载的所有 loader 等依赖都会在这个文件中，当我们修改了此文件之后，可以使用 `npm install` 进行更新）中修改默认下载的 vue-loader 的版本：
  ```json
  {
    "name": "demo01",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "webpack"
    },
    "author": "",
    "license": "ISC",
    // 仅在开发时才使用这些依赖
    "devDependencies": {
      "babel-core": "^6.26.3",
      "babel-loader": "^7.1.5",
      "babel-preset-es2015": "^6.24.1",
      "css-loader": "^3.6.0",
      "file-loader": "^6.0.0",
      "style-loader": "^1.2.1",
      "url-loader": "^4.1.0",
      // 降低 vue-loader 的版本为 14.x 及以下
      "vue-loader": "^15.9.3",
      "vue-template-compiler": "^2.6.11",
      "webpack": "^3.6.0"
    },
    // 运行时也需要的依赖
    "dependencies": {
      "vue": "^2.6.11"
    }
  }
  ```

  :::tip 提示
  添加包时的符号（^、~）问题请见 [https://juejin.im/post/5ab3f77df265da2392364341](https://juejin.im/post/5ab3f77df265da2392364341)。
  :::

---

接下来，在组件中使用组件，创建一个新的 vue 文件 `Cpn.vue`:

- `Cpn.vue`  

  ```html
  <template>
    <div>
      <h2>我是标题</h2>
      <p>我是内容，哈哈哈</p>
      {{ message }}
    </div>
  </template>

  <script>
  export default {
    name: 'cpn',
    data() {
      return {
        message: 'hello'
      }
    }
  }
  </script>

  <style>

  </style>
  ```

在 `App.vue` 中使用 `Cpn.vue`:
```html
<template>
  <div>
    <h2 class="title">{{ message + '->vue'}}</h2>
    <button @click="btnClick">按钮</button>
    <cpn></cpn>
  </div>
</template>

<script>
import Cpn from "./Cpn.vue"
export default {
  components: {
    Cpn
  },
  data() {
    return {
      message: 'hello webpack'
    }
  },
  methods: {
    btnClick () {
      console.log('btn...')
    }
  }
}
</script>

<style>
  .title {
    color: #f60;
  }
</style>
```
接着，运行即可。

:::tip 小贴士
- vue 文件命名时，首字母建议大写（和类相同）
- 导入 vue 文件时，不加后缀会报错
- `<template></template>` 中只能有一个根标签
- 建议将 App.vue 作为程序的入口
:::

如果想要忽略 vue 的后缀，那么，需要在 `webpack.config.js` 中进行配置：
```js
module.exports = {
  resolve: {
    extensions: ['.js', '.css', '.vue'],
  }
}
```
## plugin  
使用插件可以对 webpack 的功能进行扩展。

- 版权  

  当打包文件之后，我们希望在文件头中添加一个注释，这时就可以使用 BannerPlugin 插件，这是 webpack 中自带的插件。
  ```js
  const webpack = require('webpack')

  module.exports = {
    plugins: [
      new webpack.BannerPlugin('Dai Junfeng')
    ]
  }
  ```

- htmlplugin  

  我们知道，项目发布时，我们提交的是 dist 文件夹里面的文件，但是，我们打包之后并没有将 index.html 文件放入 dist 文件夹中，这时，我们可以使用插件在 dist 文件夹中生成一个html文件。除此之外，该插件还可以自动将 js 文件引入到 html 的 body标签中，并且也能够在html中添加模板。先来安装插件：
  ```sh
  npm install html-webpack-plugin@3.2.0 --save-dev
  ```
  下载完成后，进行配置：
  ```js
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    plugins: [
      new HtmlWebpackPlugin()
    ]
  }
  ```
  然后使用 `npm run build` 进行打包，打包之后会发现在 dist 文件夹中多出了 index.html，文件内容如下：
  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Webpack App</title>
    </head>
    <body>
    <script type="text/javascript" src="dist/index.js"></script></body>
  </html>
  ```
  我们发现，在引入的 js 中多了 dist 路径（打包后的 html 文件和 js 文件是处于同一级目录之下），因为我们在之前配置了 dist，所以需要删除，如下：
  ```js
  module.exports = {
    // 入口
    entry: './src/main.js',
    // 出口
    output: {
      // 必须是绝对路径
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      // 删除掉 dist 前缀
      // publicPath: 'dist/'
    },
  }
  ```
  但是，生成的 html 中没有模板，也就是缺少了下面这句：
  ```html
  <div id="app"></div>
  ```
  想要加上模板，就需要在插件中进行配置：
  ```js
  module.exports = {
    plugins: [
      new HtmlWebpackPlugin({
        // 会在 webpack.config.js 的同级目录下查找 index.html
        // 然后把 index.html 中 body 标签中的内容复制到新生成的 html 中
        // 因此，需要先删除原 index.html 中的 script 标签
        template: 'index.html'
      })
    ]
  }
  ```

- 压缩 js 文件  

  为了减少 js 文件的大小，我们在打包时可以对 js 文件进行压缩，需要安装插件，因为我使用的是 webpack3.6.0，即 vue-cli 2，所以此插件需要使用 1.1.1 版本。
  ```sh
  npm install uglifyjs-webpack-plugin@1.1.1 --save-dev
  ```
  ```js
  const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

  module.exports = {
    plugins: [
      new UglifyjsWebpackPlugin()
    ]
  }
  ```
  然后进行打包即可使用。


:::tip 关于 require 的说明
只有 node_module 中存在此依赖时，才能够使用 require 进行导入。
:::

## 搭建 webpack 本地服务器

当我们修改了代码之后，每次都要重新运行进行打包，这样稍显麻烦，我们可以将打包文件放在服务器上，这样就不用每次都打包了。这个服务器的好处就是，不会每次都把文件写入硬盘，只有我们执行打包命令时才会将其写入硬盘。搭建服务器之前需要安装 `webpack-dev-server`：
```sh
# 版本与我的 cli2 相对应
npm install webpack-dev-server@2.9.3 --save-dev
```
```js
// 无需导入，直接配置即可
module.exports = {
  // 配置服务器
  devServer: {
    // 配置需要服务的文件夹
    contentBase: './dist',
    // 是否需要实时监听
    inline: true,
    // 指定服务器的端口, 默认是 8080
    port: 8888
  }
}
```
配置完成之后启动服务：
```sh
# 注意，我这里写的是绝对路径
# 因为所有的直接在命令行使用 webpack 的指令都是在全局的 webpack中执行（而我全局没有这个插件）。
.\node_modules\.bin\webpack-dev-server
```
然后访问 localhost:8888 即可。当然，上面这种方式太繁琐了，我们可以向打包一样来进行映射，在 package.json 中配置：
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    // 配置服务映射
    "dev": "webpack-dev-server"
  }
}
```
之后就可以使用 `npm run dev`（npm命令会首先在局部查找）来运行服务器。  

使用这种方式，每次修改代码之后不用做任何操作，页面会自动刷新。如果我们要打包，则使用打包命令即可（只有执行了打包命令才会将打包文件写入硬盘，否则就是在内存中）。当然，我们也可以在启动服务之后让页面自动打开，只需修改配置为如下内容：
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    // 配置服务映射, --open 是自动打开网页
    "dev": "webpack-dev-server --open"
  }
}
```
## 配置文件分离

在上面的学习过程中，我们都是把所有的配置信息放在了同一个文件（webpack.config.js）中，但是，有时候我们在开发时可能不需要某些配置，而在上线时才需要这些配置，这时就可以吧配置文件进行分离。  

首先，在项目根路径中创建文件夹 config，在 config 下分别创建 `base.config.js`、`prod.config.js`、`dev.config.js`，文件内容分别如下：

- `base.config.js`  

  该文件存放公共的配置信息：
  ```js
  // 存放公共配置

  // 使用 node 自带的模块
  const path = require('path')
  // 增加对 vue-loader 的支持
  const VueLoaderPlugin = require('vue-loader/lib/plugin')

  const webpack = require('webpack')

  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    // 入口
    entry: './src/main.js',
    // 出口
    output: {
      // 必须是绝对路径
      path: path.resolve(__dirname, '../dist'),
      filename: 'index.js',
      // publicPath: 'dist/'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          // 配置 css-loader
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // 当加载的图片小于此值时，会将图片编译成 base64 的字符串形式
                // 单位是字节
                // 当加载的图片大于 limit 时，需要使用 file-loader
                limit: 3000,
                // 指定打包后存放在 img 文件夹中
                // 图片名字为 原名.8位哈希.原扩展名
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        },
        // 添加对 vue 文件的打包支持
        {
          test: /\.vue$/,
          use: ['vue-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.css', '.vue'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.BannerPlugin('Dai Junfeng'),
      new HtmlWebpackPlugin({
        template: 'index.html'
      })
    ]
  }
  ```

- `prod.config.js`  

  该文件存放线上环境特有的配置：
  ```js
  // 存放上线环境的配置文件

  const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

  const WebpackMerge = require('webpack-merge')

  const baseConfig = require('./base.config')

  // 将导入的 base.config.js 与该文件合并
  module.exports = WebpackMerge(baseConfig, {
    plugins: [
      new UglifyjsWebpackPlugin()
    ]
  })
  ```

- `dev.config.js`  

  该文件存放开发时特有的配置：
  ```js
  // 存放开发环境的配置文件

  const WebpackMerge = require('webpack-merge')

  const baseConfig = require('./base.config')

  module.exports = WebpackMerge(baseConfig, {
    // 配置服务器
    devServer: {
      // 配置需要服务的文件夹
      contentBase: './dist',
      // 是否需要实时监听
      inline: true,
      // 指定服务器的端口, 默认是 8080
      port: 8888
    }
  })
  ```
  当然，上面我使用到了 webpack-merge，该依赖需要下载：
  ```sh
  npm install webpack-merge@ --save-dev
  ```
  
然后，我们就可以删除项目根目录下的 `webpack.config.js` 了。  

进行打包测试，执行：`npm run build`，但是报错了，因为我们把 `webpack.config.js` 删了，它找不到配置文件。因此，需要自己指定配置文件。修改 package.json 中的内容来指定配置文件，如下：
```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 使用 --config 来指定配置文件
    "build": "webpack --config ./config/prod.config.js",
    "dev": "webpack-dev-server --open --config ./config/dev.config.js"
  }
}
```
然后再次打包即可。但是，打包之后，我们的打包文件被放在了 config 目录下，我们人希望它被放在 dist 文件夹下，所以，修改 base.config.js：
```js
module.exports = {
  output: {
    // 加上 .. 即可
    path: path.resolve(__dirname, '../dist'),
  }
}
```
这样，配置文件的分离就算基本完成了。
