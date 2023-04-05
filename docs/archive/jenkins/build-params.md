# 参数化构建

首先，创建一个 Pipeline 项目：

![20230404215114](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215114.png)

在配置中勾选 `This project is parameterized`：

![20230404215245](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215245.png)

然后添加一个参数，这里以添加一个字符串参数为例：

![20230404215651](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215651.png)

:::tip 提示
在这里，我添加了一个名叫 `branch` 的参数，那么在 `Jenkinsfile` 中，就可以通过 `${branch}` 的方式来获取 `branch` 的值。
:::

填写参数名、默认值、参数描述等相关信息：

![20230404215823](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215823.png)

配置 Pipeline：

![20230405135210](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-05/20230405135210.png)

好了，上面就是一个简单的参数化项目的示例。保存配置之后，进入该项目，会发现，项目左侧的 `Build Now` 变成了 `Build with Parameters`。如下：

![20230404215902](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215902.png)

点击 `Build with Parameters`，会发现，刚才配置的参数已经出现在界面上了，并且符合预期。如下：

![20230404215937](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-04/20230404215937.png)

接下来，我们修改工程中的 `Jenkinsfile`，使其能够根据 `branch` 参数构建对应的分支。如下：

```groovy
pipeline {
  agent any

  stages {
    stage('Pull') {
      steps {
        checkout scmGit(branches: [[name: '${branch}']], extensions: [], userRemoteConfigs: [[credentialsId: 'dbe58879-a6f9-48c8-8c7a-77d750e358a5', url: 'https://gitee.com/djf1718/ci-test.git']])
      }
    }
    stage('Build') {
      steps {
        echo "开始构建了, 当前分支: ${branch}"
      }
    }
  }
}
```

然后，我们将工程推送到 Git 仓库。推送完成后，在 Jenkins 中进行构建，通过构建日志可以发现，Jenkins 能够根据 `branch` 的值构建对应的分支。

![20230405140207](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-05/20230405140207.png)
