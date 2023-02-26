# 部署

**为什么需要部署？**

其实不部署也可以，只不过我们看笔记时，每次都需要打开开发工具来启动，这样很麻烦，而且如果我们需要在没带电脑的时候查看笔记，如果不部署，那么就无法查看了。

**部署步骤如下：**

我的项目结构如下：

![2023022623140291.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140291.png)

- `vuepress.config.js`

    ```js
    const baseConfig = require('./config/base-config')
    const theme = require('./config/theme')
    
    module.exports = {
      ...baseConfig,
      theme
    }
    ```
- `config/base-config.js` 

    ```js
    const path = require('path')

    module.exports = {
      port: 8088, // 项目运行的端口
      lang: 'zh-CN',
      title: '虚言假面', // 站点标题
      description: '这是我的第一个 VuePress 站点',
      // 设置 docs 目录的别名 (vuepress 约定 docs 作为资源目录), 我当前的配置文件在 config 的统计目录下, 所以需要写 ../docs
      // alias: { 
      //   '@': path.resolve(__dirname, '../docs'),
      // },
      base: '/note/', // 如果项目打包后不上线，只是在本地运行，那么需要修改 base（不然静态资源找不到），将其改为项目全路径（开过过程中请注释配置，仅在本地打包时配置, 如果打包部署到服务器，那么一般情况下也不用进行配置）
      // 注意下面的路径要直接以 docs 开头
      dest: 'docs/dist', // 打包路径，默认在 `${sourceDir}/.vuepress/dist`
      temp: 'docs/.temp', // 临时文件路径(VuePress 在开发和构建时会加载临时文件，因此临时文件目录应位于项目根目录内部，以便可以正确地解析到依赖), 默认为 `${sourceDir}/.vuepress/.temp`
      cache: 'docs/.cache', // 缓存文件路径, 默认为 `${sourceDir}/.vuepress/.cache`
      debug: false, // 用于调试, 取代 console.log
    }
    ```

- `config/theme.js`

    ```js
    // 主题的配置参考 https://v2.vuepress.vuejs.org/zh/reference/default-theme/config.html
    // 其它配置项需要结合 1.x 版本进行配置, 2.x 中部分配置请见 https://v2.vuepress.vuejs.org/zh/reference/config.html#%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AE
    const { defaultTheme } = require('vuepress')
    
    const theme = defaultTheme({
      colorMode: 'dark', // 只有在 colorModeSwitch 为 false 才生效
      colorModeSwitch: true, // 设置为 false 则右上角不会出现切换主题的按钮
      home: '/',
      navbar: [
        {
          text: '后端',
          link: '/backend/', // 如果当前路由和 link 的值相同, 则该 navbar 会处于选中状态
          activeMatch: '/backend/' // 当路由为 /backend/ 时, 该 nav 处于选中状态
        },
        {
          text: '前端',
          link: '/protal'
        },
        {
          text: '笔记',
          children: [
            {
              text: 'MySQL',
              link: '/mysql/'
            },
            {
              text: 'Java',
              link: '/java/'
            },
            {
              text: '小计',
              children: [
                {
                  text: '系统',
                  link: '/system/'
                }
              ]
            }
          ]
        },
      ],
      logo: 'https://vuejs.org/images/logo.png', // Logo 图片将会显示在导航栏的左端
      logoDark: 'https://vitejs.dev/logo.svg', // 暗黑模式下的 Logo
      repo: 'https://github.com/vuepress/vuepress-next', // 右上角最后的位置显示仓库地址
      repoLabel: 'Dai Junfeng', // 如果不设置, 则会根据 repo 的域名自动推断
      sidebarDepth: 2, // 提取哪些标签作为侧边栏
      editLink: true, // 是否启用 编辑此页 链接, 默认为 true
      editLinkText: '想要编辑此页?', // 编辑此页 链接的文字, 默认为 Edit this page
      editLinkPattern: 'https://www.baidu.com', // 如果想跳转到 github 对应的页面中, 请参考官网的配置
      // lastUpdated 和 contributors 需要配合 git并使用 git 插件， 见 https://v2.vuepress.vuejs.org/zh/reference/plugin/git.html
      lastUpdated: true, // 是否启用 最近更新时间戳, 默认为 true, 只在使用 git 项目时才生效, 默认读取 git commit 的最新时间
      lastUpdatedText: '上次更新',
      contributors: true, // 是否启用 贡献者列表 。默认为 true
      contributorsText: '代同学', // 贡献者列表 标签的文字。
      tip: '提示', // Tip 自定义容器 的默认标题, 默认为 TIP
      warning: '注意', // Warning 自定义容器 的默认标题，默认为 warning
      danger: '警告', // Darning 自定义容器 的默认标题，默认为 danger
      notFound: ['你要找的页面走丢了'], //当用户进入 404 页面时，会从数组中随机选取一条信息进行展示, 默认值 ['Not Found']
      backToHome: '回到首页',// 404 页面中 返回首页 链接的文字, 默认为 Back to home
      toggleColorMode: '切换主题', // 切换颜色模式按钮的标题文字. 默认为 toggle color mode
    })
    
    module.exports = theme
    ```
- `package.json`

    ```json
    {
      "name": "demo1",
      "version": "1.0.0",
      "description": "'vuepress初体验'",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "vuepress dev docs",
        "build": "vuepress build docs"
      },
      "author": "djf",
      "license": "ISC",
      "devDependencies": {
        "node-sass": "^6.0.0",
        "sass-loader": "^10.2.1",
        "vuepress": "^2.0.0-beta.49"
      }
    }
    ```

经过上面的配置，我们就可以打包了：

```sh
npm run build
```
项目打包后，会在 `docs/dist`（这里我修改了打包的路径，默认是在 `docs/.vuepress/dist` 目录）里面生成文件，我们直接访问 `index.html` 即可。

然后将打包文件上传到服务器，步骤如下：

1. 将 dist 文件夹拷贝到服务器（我把它放在 `/usr/local/djfapp/webapp/vuepress` 目录）

    ![2023022623140345.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140345.png)
    
2. 配置 nginx 代理

    ```nginx
    location /note {
        alias /usr/local/djfapp/webapp/vuepress/dist;
        autoindex on;
    }
    ```

3. 重新加载 nginx 配置文件

    ```sh
    nginx -s reload
    ```

4. 在浏览器中访问

    ![2023022623140408.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140408.png)
    
---

**部署过程中碰到的坑：**  

1. **路径问题**

    在最初打包时，我没有修改 `base`（默认是 `/`），打包后在本地访问，就出现了 CSS 样式丢失的问题，报错也很明显，如下：
    
    ![2023022623140524.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140524.png)
    
    我们发现，它是直接到根路径中去找的静态文件，为什么会这样？于是我查看了 html 文件中引用静态资源的路径，如下：
    
    ![2023022623140628.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140628.png)
    
    很明显，这个路径就是当前磁盘的根路径。因此，需要在打包时将 `base` 修改为 dist 文件夹所在磁盘对应的全路径，如下：
    
    ```js
    module.exports = {
      base: '/myproject/web/vuepress/demo1/docs/dist/'
    }
    ```
    
    修改后再重新打包就可以了，如下：
    
    ![2023022623140651.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140651.png)
    
2. **部分功能无法使用**

    在打包后，我在本地尝试浏览打包后的项目，但是，部分功能无法正常使用。如无法切换主题、侧边栏显示不全、部分网络图片丢失、部分 icon 不显示等。
    
    ![2023022623140707.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140707.png)
    
    ![2023022623140748.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140748.png)
    
    查看控制台，发现了如下报错：
    
    ![2023022623140779.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140779.png)
    
    意思就是说跨域了，在本地无法访问部分资源。解决办法就是将打包文件放到服务器上进行访问。

3. **关于 `base` 的说明**

    `base` 需要和 nginx 的代理路径保持一致，如下：

    ```js
    module.exports = {
      base: '/note/'
    }
    ```
    ```nginx
    # 由于我将 base 设置成了 /note/, 所以这里代理的路径也是 /note
    location /note {
        alias /usr/local/djfapp/webapp/vuepress/dist;
        autoindex on;
    }
    ```

4. **样式无法加载**

    > 参考：[打包工具参考>常见问题](https://v2.vuepress.vuejs.org/zh/reference/bundler/webpack.html#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)

    默认主题使用 SASS 作为 CSS 预处理器，因此你在使用 Webpack 时（特别是在使用 pnpm 时）可能需要手动安装 sass-loader 来确保其正常工作。安装步骤如下：
    
    ```bash
    # 查看 node 版本
    node -v
    v16.15.1
    ```
    
    ```bash
    # 安装前，请注意 node 版本（如果你是最新版的 node，那下面的两个可以直接使用最新版）
    # node-sass 和 node 对应的版本 https://github.com/sass/node-sass/releases
    # sass-loader 和 node 对应的版本 https://github.com/webpack-contrib/sass-loader/releases
    
    # sass-loader 需要依赖 node-sass
    npm i -D node-sass@6.0.0
    
    # 安装 sass-loader
    npm i -D sass-loader@10.2.1
    ```
    
5. **nginx 代理后，网页控制台报错**

    部署到服务后，使用 nginx 代理，然后访问博客网站，控制台报错如下（该报错会影响网页的显示）：
    ```
    Failed to load module script: The server responded with a non-JavaScript MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec
    ```
    解决办法：
    ```bash
    vim /usr/local/djfapp/nginx/conf/mime.types
    ```
    做如下修改：
    ```bash
    # 追加 mjs
    application/javascript                           js mjs;
    ```
    修改完成后重启 nginx：
    ```bash
    nginx -s reload
    ```
    清理浏览器缓存后重新访问即可。
    
    > **参考：**
    > [https://github.com/FredKSchott/snowpack/discussions/2348](https://github.com/FredKSchott/snowpack/discussions/2348)
    
