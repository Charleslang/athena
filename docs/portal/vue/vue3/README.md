# 快速上手
## 使用 vue-cli 创建工程

Vue 官方在[命令行工具 (CLI)](https://v3.cn.vuejs.org/guide/installation.html#%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7-cli)中有提到，使用 cli 来创建 Vue3 项目，必须确保 `@vue/cli` 的版本不小于 v4.5。

安装最新版 cli：
```sh
npm install -g @vue/cli --registry https://registry.npm.taobao.org
```
查看 vue-cli 版本：
```sh
vue -V
```
创建 Vue3 工程：
```sh
vue create vue3_test1
```
在执行完 `vue create` 命令后，会弹出以下界面：

![2023022621143146.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143146.png)

对于前两个选项，其实都是创建 Vue 工程，只不过一个是 Vue3，另一个是 Vue2，并且它们都会默认安装 babel 和 eslint，如果我们想要自定安装某些东西，我们可以选择最后一项 Manually select features（我个人比较喜欢自定义）。

自定义的选项如下（我去掉了 eslint）（使用空格来选择或取消某些依赖，然后回车即可创建项目）：

![2023022621143169.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143169.png)

在自定义完成后，会让我们选择创建 3.x 还是 2.x 的项目，这里我选择 3.x。

![2023022621143194.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143194.png)

后面的步骤就和 Vue2 相同了。

项目创建完成后，我们按照提示即可运行项目：

![2023022621143239.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143239.png)

```sh
cd vue3_test1
npm run serve
```
运行完成后，我们访问 8080 端口就可以了，如下：

![2023022621143279.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143279.png)

### 目录结构分析

Vue3 的目录结构如下，和 Vue2 是相同的。

![2023022621143279.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143279.png)

但是，Vue3 中，文件内的某些语法发生了变化。

- `src/main.js`

    ```js
    // Vue3 中使用 createApp 函数来创建一个 Vue 应用
    // 而 Vue2 中使用的是 Vue 构造函数来创建
    import { createApp } from 'vue'
    import App from './App.vue'
    
    createApp(App).mount('#app')
    
    // Vue2 中的写法如下（Vue3 不兼容）
    import Vue from 'vue'
    import App from './App.vue'
    
    new Vue({
        render: h => h(App)
    }).$mount('#app')
    ```
- `src/App.vue`

    其实这个文件和 Vue2 没有什么太大的区别，但是，在 `<template>` 中，可以有多个子元素，而 Vue2 中只能有一个子元素。
    
    ```vue
    <!-- Vue3 -->
    <template>
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </template>
    
    <!-- Vue2 -->
    <template>
      <div>
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
      </div>
    </template>
    ```

## 使用 Vite 创建工程

> 参考官网：[快速上手](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)

> **注意**  
> 需要安装 16.0 或更高版本的 Node.js

**1. 初始化项目**
```
npm init vue@latest
```
**2. 按照提示，设置项目名称，并选择自己需要的模块**  

![2023022621143298.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143298.png)

**3. 创建成功后的项目结构如下**

![2023022621143320.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022621143320.png)

**4. 在 `package.json` 的同级目录执行命令安装依赖**
```sh
npm install
```
**5. 运行项目**
```sh
npm run dev
```

## VS Code 安装 Vue3 相关插件
在 VS Code 中，我们可以安装插件 `Vue Language Features (Volar)`、`TypeScript Vue Plugin (Volar)` 来帮助我们更加流畅地开发 Vue3 应用。

`Vue Language Features (Volar)` 可能会在 html 页面中报如下提示：
```
TypeScript intellisense is disabled on template. To enable, configure `"jsx": "preserve"` in the `"compilerOptions"` property of tsconfig or jsconfig. To disable this prompt instead, configure `"experimentalDisableTemplateSupport": true` in `"vueCompilerOptions"` property.
```
想要去掉这个提示，我们需要在项目根目录的 `jsconfig.json` 文件中进行如下配置：
```json
{
  "compilerOptions": {
    "jsx": "preserve"
  }
}
```
> **注意**  
> 如果你之前安装过 vetur 这个插件，那么需要将其禁用，否则可能与 `Vue Language Features (Volar)` 发生冲突。
