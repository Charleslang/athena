# 构建类型

Jenkins 其实支持很多类型的构建方式，常用的有 Freestyle、Maven、Pipeline 三种方式。其实，不管我们选择哪种方式去构建项目，它们最终实现的效果都是相同的，只不过每种方式的操作步骤不同而已。

## 写在前面

由于在构建时会从 Git 拉取代码，所以需要确保 Jenkins 所在的机器安装了 Git。以下是 CentOS 安装 Git 的方法。
```sh
# 这种方式只能安装 Git 1.8.3.1 版本，如果需要安装更高版本的 Git，需要通过源码包进行安装
yum install -y git

git --version
```

## Freestyle

Freestyle（即自由风格），它是 Jenkins 默认支持的构建方式。任何项目都能使用 Freestyle 的方式来进行构建。以下是创建一个 Freestyle 项目的步骤。

![20230314221840](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314221840.png)

![20230314222028](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222028.png)

![20230314222131](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222131.png)

![20230314222531](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222531.png)

![20230314222738](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222738.png)

![20230314222822](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222822.png)

![20230314222856](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314222856.png)


## Maven

Jenkins 默认不支持创建 Maven 项目，因此需要安装 Maven Integration 插件。

![20230314223907](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314223907.png)

**1. 创建 Maven 项目**

  ![20230318152338](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318152338.png)

**2. 配置项目所在的 Git 仓库**

  ![20230318155749](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318155749.png)

**3. 配置构建操作**

  ![20230318160054](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318160054.png)

**4. 配置构建成功后执行的操作**

  ![20230318160554](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318160554.png)

**5. 构建项目**

  ![20230318161146](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318161146.png)  

:::tip 说明
总的来讲，Maven 项目在实际开发中使用较少。因为它只能构建 Maven 项目，而且在构建 Maven 项目时还不太灵活。完全可以使用 Freestyle 和 Pipeline 来替代它。
:::

## Pipeline

:::tip 参考
[Pipeline](https://www.jenkins.io/doc/book/pipeline/)
:::

### What is Jenkins Pipeline?

pipeline，中文意为管线，意义等同于流水线。

Jenkins Pipeline（或简称为 "Pipeline"）是一套插件，支持持续交付的实现和实施集成到 Jenkins 中。主要是将一个大的工作流分拆成多个独立的功能模块，实现单个任务难以完成的复杂流程编排和可视化。

### Why Pipeline?

在 Freestyle 和 Maven 这两种构建方式中，每一步都是固定的，而且各个模块是分开的，如下：

Freestyle|Maven
---|---
![20230318162326](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318162326.png)|![20230318162242](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318162242.png)


从根本上说，Jenkins 是一个支持许多自动化模式的自动化引擎。Pipeline 在 Jenkins 上添加了一组强大的自动化工具，支持从简单的持续集成到全面 CD pipelines 的用例。通过对一系列相关任务建模，用户可以利用 Pipeline 的许多特性:

- 代码：Pipeline 在代码中实现，通常放入项目源代码中进行控制，使团队能够编辑、审查和迭代他们的交付管道。

- 持久：Pipeline 可以在 Jenkins 控制器的计划性和非计划性重启中存活。

- 可暂停：Pipeline 可以选择停止并等待人工输入或批准，然后继续 pipeline 运行。

- 多功能：Pipeline 支持复杂的实际 CD 需求，包括 fork/join、循环和并行执行工作的能力。

- 可扩展：Pipeline 插件支持对 DSL 的自定义扩展，以及与其他插件集成的多种选项。

### Pipeline 语法

Pipeline 主要通过代码来实现，该代码使用了特殊的 Pipeline 语法，即 [Pipeline domain-specific language (DSL) syntax](https://www.jenkins.io/doc/book/pipeline/syntax)。Jenkins Pipeline 的定义被写入一个文本文件（称为 `Jenkinsfile`），该文件又可以提交到项目的源代码控制存储库。这是“Pipeline-as-code”的基础；将 CD 管道视为应用程序的一部分，以便像任何其他代码一样进行版本控制和审查。

创建 `Jenkinsfile` 并将其提交到源代码管理提供了许多直接的好处：

- 自动为所有分支和拉取请求创建 Pipeline 构建过程。
- Pipeline 上的代码审查/迭代（以及剩余的源代码）。
- Pipeline 的审计跟踪。
- Pipeline 的单一真实来源可以由项目的多个成员查看和编辑。

虽然在 Jenkins 的 Web UI 中或使用 `Jenkinsfile` 定义 Pipeline 的语法是相同的，但通常认为最好的做法是在 `Jenkinsfile` 中定义 Pipeline 并将其放入源代码中进行管理。

可以使用两种类型的语法编写 `Jenkinsfile`：声明式（Declarative）和脚本式（Scripted）。

声明式和脚本式管道的构造根本不同。声明式流水线是 Jenkins 流水线的最新特性：

- 提供比脚本式语法更丰富的语法特性
- 使编写和阅读 Pipeline 代码更加容易

然而，写入 `Jenkinsfile` 的许多单独的语法组件（或“步骤”）对于声明式和脚本式 Pipeline 都是通用的。

:::tip 参考
语法请参考 [Pipeline](https://www.jenkins.io/doc/book/pipeline/syntax/)。

pipeline 是用 Groovy 编写的，因此，如果有 Groovy 相关的使用，那么可能会更加容易编写 pipeline。
:::

### 创建 Pipeline 项目

Jenkins 默认不支持创建 Pipeline。需要安装对应的插件才能实现。参考如何安装 [Pipeline](./plugins.md#Pipeline)。

1. 新建 Pipeline 项目

  ![20230318165550](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318165550.png)

2. 配置 Pipeline

  ![20230318170041](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318170041.png)

3. 编写 Pipeline 脚本

  ```groovy
  // 声明式脚本（推荐）
  pipeline {
    agent any

    stages {
      // stage 的名称任取
      stage('pull code') {
        steps {
          // 执行具体的逻辑
          echo '拉取代码'
        }
      }
      stage('build') {
        steps {
          echo '开始构建'
        }
      }
      stage('post build') {
        steps {
          echo '构建结束'
        }
      }
      stage('deploy') {
        steps {
          echo '部署项目'
        }
      }
    }
  }
  ```
  ```groovy
  // 脚本式脚本
  node {
    def mvnHome
    stage('pull code') {
      echo "拉取代码"
    }
    stage('build') {
      echo "构建"
    }
    stage('deploy') {
      echo "部署"
    }
  }
  ```

### Jenkins 自动生成 Pipeline
一般情况下，我们不需要自己从 0 开始编写脚本，可以借助 Jenkins 的插件为我们自动生成对应的 Pipeline 脚本。如下：

![20230318172035](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172035.png)

一些常用的选项如下：

1. 拉取代码

  ![20230318172332](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172332.png)

  ![20230318172552](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172552.png)

  ![20230318172612](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172612.png)

  ![20230318172733](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172733.png)

  ![20230318172906](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318172906.png)

2. 构建

  ![20230318173808](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318173808.png)

  ![20230318173929](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318173929.png)

### Jenkinsfile

之前，我们是在 Jenkins 的 Web UI 中直接编写 Pipeline，这样有一个问题，如果脚本文件的内容太多，那么维护起来就不太方便了。因此，可以考虑将这些脚本文件通过版本控制进行管理。如下：

![20230318181120](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318181120.png)

![20230318181036](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318181036.png)


:::tip 说明
对于大项目来讲，一般都是使用 Pipeline。当然，你完全可以使用 Shell 脚本来代替 Pipeline。
:::
