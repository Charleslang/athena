# 插件

如果 Jenkins 下载插件时出错，或者想安装某个指定版本的插件，那我们可以先把插件下载到本地，然后手动上传到 Jenkins。Jenkins 插件下载地址见 [http://updates.jenkins-ci.org/download/plugins/](http://updates.jenkins-ci.org/download/plugins/)。

插件下载完成后，可在 Plugin Manager 中上传插件，如下：

![20230313231430](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-13/20230313231430.png)

部分插件安装后，需要重启 Jenkins 才能生效。

## 集成 GitHub
:::tip 提示
Linux 访问 GitHub 慢可参考 [https://cloud.tencent.com/developer/ask/248782](https://cloud.tencent.com/developer/ask/248782)
:::

![20230318194010](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318194010.png)

## 集成 Gitee
  
:::tip 参考  
[Jenkins 集成 Gitee](https://cloud.tencent.com/developer/article/1801592)

[Jenkins 插件](https://gitee.com/help/articles/4193#article-header13)
:::

1. 在 Jenkins 中安装 Gitee 插件，安装后完成后重启 Jenkins
  
  ![20230318153608](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318153608.png)

2. 配置 Gitee API token（可选）

## Pipeline

![20230318165058](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318165058.png)

## Pipeline Stage View

![20230318173412](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318173412.png)

效果如下：

![20230318173538](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318173538.png)

## Generic Webhook Trigger

Push 代码后，自动触发构建。

![20230318193355](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318193355.png)
