# 构建后操作

如果我们在项目构建完成后，需要将项目进行部署，或者推送消息等等。这时，就需要用到 Jenkins 中的 Post-build Actions 了。

## 企业微信消息推送

**实现效果**：Jenkins 构建完成后，把构建结果推送到企业微信群中。

下面给出几种实现方案。

### Qy Wechat Notification Plugin

1. 安装插件 `Qy Wechat Notification Plugin`

  ![20230319194319](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319194319.png)

2. 企业微信群添加群机器人

  #1|#2
  ---|---
  ![20230319195217](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195217.png)|![20230319195257](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195257.png)

3. 添加 Post-build Actions

  ![20230319195506](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195506.png)

4. 获取群机器人的 Webhook URL

  ![20230319195641](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195641.png)

5. 配置 Post-build Actions

  ![20230319195950](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195950.png)

按照上面的步骤进行配置后，构建项目，然后就能在企业微信群中收到消息了。如下：

![20230319200547](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319200547.png)

通过 `Qy Wechat Notification Plugin` 插件发送消息还是比较简单的，但是缺点也有，就是消息内容比较单一。

### WXWork Notification

这个插件我还没用过，是偶然间发现的 :joy:。

![20230319200909](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319200909.png)

### Post build task

该插件用于在 Post-build Actions 中执行 Shell 脚本。步骤如下：

1. 安装插件

  ![20230319204116](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319204116.png)

2. 企业微信群添加群机器人

  #1|#2
  ---|---
  ![20230319195217](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195217.png)|![20230319195257](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195257.png)

3. 获取群机器人的 Webhook URL

  ![20230319195641](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195641.png)  

4. 在 Post-build Actions 中填写 Shell

  ![20230319204257](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319204257.png)

  ![20230319204527](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319204527.png)

  Shell 脚本如下：

  ```sh
  #!/bin/bash
  # 微信机器人的 Webhook
  WEBHOOK_URL="微信机器人的 Webhook，请换成自己的 URL"
  CONTENT_TYPE='Content-Type: application/json'

  echo "### send message to wx，build result: ${BUILD_RESULT}"

  curl "$WEBHOOK_URL" \
  -H "$CONTENT_TYPE" \
  -d '
    {
      "msgtype": "markdown",
      "markdown": {
        "content": "<font color=\"warning\">**【Jenkins 构建结果】**</font> \n
        > 任务序号：<font color=\"comment\">'"${BUILD_DISPLAY_NAME}"'</font>
        > 任务名称：<font color=\"comment\">'"${JOB_BASE_NAME}"'</font>
        > 构建分支：<font color=\"comment\">'"${GIT_BRANCH}"'</font>
        > 构建地址：<font color=\"comment\">[点击查看]('"${JOB_URL}"')</font>
        > 构建日志：<font color=\"comment\">[点击查看]('"${BUILD_URL}console"')</font> \n
        > 已完成构建请确认：<@DaiJunFeng>"
      }
    }
  '

  echo "### send message to wx finished！"
  ```

  在这段 Shell 脚本中，我用到了一些环境变量，例如 `BUILD_DISPLAY_NAME`、`JOB_BASE_NAME` 等，这些变量是 Jenkins 内置的环境变量。可用的环境变量列表请见 [env-vars](http://daijunfeng.com/jenkins/env-vars.html/)，可以在 Build Steps 中发现这个链接的入口，如下：

  ![20230319205255](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319205255.png)

完成上面的步骤后，就可以构建项目了。如果一切顺利，那么会在对应的群中收到机器人的推送消息。

:::details 拓展
使用 Post build task 执行 Shell 脚本的方式是非常灵活的，它可以在构建完成后实现任何你想做的事。这里的 script 不局限于 Linux 中的命令，它可以是另一个工程或者工具包的启动命令，如下：
```sh
#!/bin/bash
# 在 msg.jar 中，你可以实现任何功能
java -jar msg.jar "${BUILD_DISPLAY_NAME}" "${JOB_BASE_NAME}"
```
:::

### Pipeline

上面介绍的几种方式，都是针对 Freestyle 类型的工程。如果是 Pipeline 项目，那么，我们只需在 `Jenkinsfile` 中编写脚本即可，原理都是一样的。

文件目录结构如下：
```
..
.
athena
|-script
|  |-build.sh
|  |-post-build.sh
|-Jenkinsfile
```

Pipeline 配置如下：

![20230319211107](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319211107.png)

脚本文件如下：

- `Jenkinsfile`

  ```groovy
  pipeline {
    agent any

    stages {
      stage('Pull') {
        steps {
          checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: 'dbe58879-a6f9-48c8-8c7a-77d750e358a5', url: 'https://gitee.com/djf1718/athena.git']])
        }
      }
      stage('Build') {
        steps {
          script {
            sh 'sh ./script/build.sh'
          }
        }
      }
    }

    post {
      success {
        script {
          def duration = "${currentBuild.durationString.replace(' and counting', '')}"
          env.BUILD_DURATION = duration
          sh 'export BUILD_RESULT=Success;export BUILD_NUM="${BUILD_DISPLAY_NAME}";export JOB_NAME="${JOB_BASE_NAME}";export BUILD_BRANCH="${GIT_BRANCH}";export BUILD_TIME="${BUILD_TIMESTAMP}";export BUILD_DURATION="${BUILD_DURATION}";export JOB_URL="${BUILD_URL}";export JOB_CONSOLE="${BUILD_URL}console";sh ./script/post-build.sh'
        }
      }
      failure {
        script {
          def duration = "${currentBuild.durationString.replace(' and counting', '')}"
          env.BUILD_DURATION = duration
          sh 'export BUILD_RESULT=Failed;export BUILD_NUM="${BUILD_DISPLAY_NAME}";export JOB_NAME="${JOB_BASE_NAME}";export BUILD_BRANCH="${GIT_BRANCH}";export BUILD_TIME="${BUILD_TIMESTAMP}";export BUILD_DURATION="${BUILD_DURATION}";export JOB_URL="${BUILD_URL}";export JOB_CONSOLE="${BUILD_URL}console";sh ./script/post-build.sh'
        }
      }
    }
  }
  ```

- `build.sh`

  ```sh
  #!/bin/bash
  echo "开始构建！"
  pwd
  npm install \
    && npm run build \
    && cd /usr/local/myapp/project/portal/athena \
    && mv dist "dist.$(date +%Y%m%d%H%M%S).bak" \
    && mv ${WORKSPACE}/docs/dist ./ \
    && curl -I -m 5 -s -w "%{http_code}\n" -o /dev/null athena.djf.xyz

  echo "构建完成！"
  ```
- `post-build.sh`

  ```sh
  #!/bin/bash
  WEBHOOK_URL=$WX_ROBOT_WEBHOOK_URL
  CONTENT_TYPE='Content-Type: application/json'
  STAUS_COLOR=$([ "${BUILD_RESULT}" == "Success" ] && echo 'info' || echo 'comment')

  echo "### send message to wx，build result: ${BUILD_RESULT}"

  curl "$WEBHOOK_URL" \
  -H "$CONTENT_TYPE" \
  -d '
    {
      "msgtype": "markdown",
      "markdown": {
        "content": "<font color=\"warning\">**【Jenkins 构建结果】**</font> \n
        > 任务序号：<font color=\"comment\">'"${BUILD_NUM}"'</font>
        > 任务名称：<font color=\"comment\">'"${JOB_NAME}"'</font>
        > 构建分支：<font color=\"comment\">'"${BUILD_BRANCH}"'</font>
        > 构建时间：<font color=\"comment\">'"${BUILD_TIME}"'</font>
        > 构建耗时：<font color=\"comment\">'"${BUILD_DURATION}"'</font>
        > 构建地址：<font color=\"comment\">[点击查看]('"${JOB_URL}"')</font>
        > 构建日志：<font color=\"comment\">[点击查看]('"${JOB_CONSOLE}"')</font>
        > 构建状态：<font color=\"'"$STAUS_COLOR"'\">**'"${BUILD_RESULT}"'**</font> \n
        > 已完成构建请确认：<@DaiJunFeng>"
      }
    }
  '

  echo "### send message to wx finished！"
  ```
注意，`post-build.sh` 中的 `$WX_ROBOT_WEBHOOK_URL` 需要替换为微信群机器人的 Webhook。群机器人的 Webhook 查看方式如下：

1. 企业微信群添加群机器人

  #1|#2
  ---|---
  ![20230319195217](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195217.png)|![20230319195257](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195257.png)

2. 获取群机器人的 Webhook URL

  ![20230319195641](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319195641.png) 

但是呢，如果直接把 Webhook 地址放到源码中，会不安全，如果泄露了（例如，把源码上传到了 GitHub、Gitee，并且远程仓库是公开的），可能会收到垃圾消息。因此，建议将 Webhook URL 配置成 Jenkins 的全局环境变量，配置如下：

![20230319212146](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319212146.png)

配置完成后，就可以在 Shell 脚本中通过 `$key` 或者 `${key}` 的形式来使用了，正如上面看到的 `$WX_ROBOT_WEBHOOK_URL` 一样。

按照上面的步骤进行配置后，就可以构建项目了，构建完成后，企业微信的群机器人就会推送消息。效果如下：

![20230319212534](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319212534.png)

### 可能碰到的问题

在介绍了前面的几种方式后，相信你在这个过程中并不顺利，下面是一些你可能存在的疑问。

**1. 推送消息的数据格式可以从哪里获取？**  

  #1|#2|#3|#4
  ---|---|---|---
  ![20230319213133](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319213133.png)|![20230319213223](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319213223.png)|![20230319213258](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319213258.png)|![20230319213324](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319213324.png)

  你想知道的，其实都在上面的几张图里面了。

**2. Shell 脚本中的 `<@DaiJunFeng>` 是什么意思？**

  平时我们在群聊时，都会使用 @ 功能，微信的消息推送接口同样也支持。如果推送的消息是 markdown 格式，并且想要在消息中 @ 某人，那么就必须使用 `<@userId>` 这样的语法。官方的说明如下：

  ![20230319213708](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319213708.png)

  怎么获取 `userId` 呢？首先，进入[企业微信后台管理](https://work.weixin.qq.com/wework_admin/frame)界面，在“联系人”中就能看到了，如下：

  ![20230319214049](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319214049.png)

**3. 为什么构建时间为空？**

  上面介绍的几种方式都是使用环境变量 `BUILD_TIMESTAMP` 来获取构建的开始时间的，Jenkins 默认是没有这个环境变量的（Jenkins 默认支持的环境变量请见 [env-vars](http://daijunfeng.com/jenkins/env-vars.html/)），需要安装 `Build Timestamp` 插件。

  ![20230319220034](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-19/20230319220034.png)
