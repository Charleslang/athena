# 快速入门

本次使用的 VuePress 是当前最新版 <span style="background:#3eaf7c; color:#fff; padding: 2px 5px; border-radius: 3px;letter-spacing: 1px;font-size:12px">v2.0.0-beta.51</span> 。

一切步骤按照官网的入门案例来即可，如下：

```sh
mkdir vuepress-starter

cd vuepress-starter

# 执行后一直下一步, 或者使用 npm init -y
npm init

npm install -D vuepress@next
```
然后编辑 `package.json`，做如下修改：

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```
然后创建一个文件夹，并添加 md 文件：
```sh
mkdir docs

# 注意这一步，如果使用 echo，则在启动项目后可能出现乱码，因此推荐使用记事本来编写内容
echo '# Hello VuePress' > docs/README.md
```
最后运行项目即可：
```sh
npm run dev
```
![2023022623140880.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140880.png)

如果运行后出现乱码，则可以通过 VS Code 来改变文件编码，如下：

![2023022623140964.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623140964.png)

运行后的效果如下：

![2023022623141040.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141040.png)

好了，到现在为止，我们已经知道了 VuePress 怎么渲染 markdown 文件了，其实只需要我们在 docs 文件夹放入我们的 markdown 文件即可。项目的目录结构看起来像下面这样：

```text
├─ docs
│  ├─ .vuepress
│  └─ README.md
├─ .gitignore
└─ package.json
```
接下来，我主要记录如何通过配置来美化网页。
