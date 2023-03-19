# 构建触发器

在前面的示例中，如果我们想要构建项目，那么必须在界面上手动点一下 Build，如下：

![20230318182253](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318182253.png)

实际上，Jenkins 默认也为我们提供了自动构建。一些常见的自动构建类型如下：

![20230318182641](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318182641.png)

- 远程触发构建（Trigger builds remotely）
- 其他项目构建完成后进行构建（Build after other projects are built）
- 定时构建（Build periodically）
- 轮询构建（Poll SCM）

## Trigger builds remotely

通过调用 API 的形式，来触发此项目的构建。  

1. 配置远程构建

  ![20230318183149](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318183149.png)

2. 进行远程构建
   
   直接访问 `http://localhost:8083/job/mdmigrate/build?token=123` 即可（需要登录 Jenkins 才行, 也就是要带上 Cookie）。


## Build after other projects are built

![20230318184031](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318184031.png)

## Build periodically

:::tip 提示
Linux cron 表达式可参考 [crontab](https://tool.lu/crontab/)。
:::

有时可能有这样的需求，每周五的凌晨 1 点构建一次。那么这时候就要使用到定时构建了，如下：

![20230318190804](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318190804.png)

## Poll SCM

:::tip 提示
Linux cron 表达式可参考 [crontab](https://tool.lu/crontab/)。
:::

轮询 SCM（Source Code Management）是指定期扫描本地代码和远程仓库的代码，如果发现本地代码和远程代码存在差异，则执行构建，如果没有差异，则不进行构建。

![20230318191137](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318191137.png)

:::warning 注意
如果你的项目非常大，那么在对比本地代码和远程代码的差异时，可能造成 Jenkins 所需的资源增大。因此，不建议使用 Poll SCM。
:::

## Git Hook 触发构建

:::tip 提示
此方式需要通过安装插件来支持。

对于早期的 Jenbkins 版本来讲，如果你安装了 GitHub 插件，那么会自动安装 GitHub Hook（最新版也有这个特性）。如果你安装了 Gitee，那么会自动安装 Gitee webhook 插件。但是，较新的 Jenkins（本文使用的是 2.395 版本）已经没有 Gitee webhook 这个插件了，需要安装 `Generic Webhook Trigger`。
:::

前面我们已经了解了 Jenkins 自带的几种自动构建方式，这里再介绍一种 Git Hook。Git Hook 的原理就是，当我们 Push 代码到远程仓库后，自动触发 Jenkins 进行构建。

Generic Webhook Trigger 是借助 WebHooks 来实现的。在远程仓库给项目添加一个 WebHook，当我们推送代码时，仓库会调用填写的 Hook 地址发送请求，而 Jenkins 的插件就能收到这个请求，然后执行对应的操作。

### 触发 Freestyle 项目

1. 配置 Generic Webhook Trigger
  
  ![20230318215804](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318215804.png)

  ![20230318215926](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318215926.png)

  从这里可以看到，在安装了 `Generic Webhook Trigger` 后，该插件会添加一个 API `http://JENKINS_URL/generic-webhook-trigger/invoke`，这个 API 就用于触发自动构建。并且它只能识别以下几个位置的 token：

  - Query 参数中的 `token`
  - 请求头中的 `token`
  - 请求头中的 `Authorization`

  所以，在 Gitee 的 WebHook 中填写的 URL 中，需要使用这三种中的其中一种方式来携带 token。

2. Gitee 添加 WebHook

  ![20230318220655](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318220655.png)

  在添加 URL 后，Gitee 会立即发送一个测试请求，请求刚才填写的 URL。如果你的 token 不正确，那么请求会报错，如下：

  ![20230318220827](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318220827.png)

  可以点击刚才发送失败的请求，查看对应的请求参数和响应。如下：

  ![20230318221023](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318221023.png)

  ![20230318221109](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318221109.png)

  我们可以根据 Jenkins 返回的错误信息进行相关修改，然后再次测试 URL。如果测试成功，那么就会触发 Jenkins 进行构建。

:::details 注意
如果你的 Jenkins 使用了[反向代理](./config.md#反向代理)，那么 WebHook 的 URL 应该长这样 `http://localhost/generic-webhook-trigger/invoke?token=xxx`。其中，Nginx 配置如下：

```nginx
server {
  listen 80;
  server_name localhost;

  location /generic-webhook-trigger {
    proxy_pass http://localhost:9999/jenkins/generic-webhook-trigger;
  }
}
```
:::

:::danger 警告
刚才我们提到了，在使用 Generic Webhook Trigger 插件进行自动构建时，我们需要设置一个 token。如果仅仅配置了 token，而没有配置任何 Generic Webhook Trigger 的其它参数，那么，请务必保证每个项目的 token 都是唯一的，因为 Generic Webhook Trigger 会根据请求的 token 判断应该构建哪些项目。
:::
