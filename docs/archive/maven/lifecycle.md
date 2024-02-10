# 生命周期

:::tip 参考
[Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
:::

Maven 生命周期是一系列阶段的集合，用于构建和部署项目。每个阶段都有一个特定的目标，它们按顺序执行。Maven 生命周期是由插件目标组成的，这些目标是由 Maven 核心或插件提供的。

Maven 内置了 3 个什么周期：`default`、`clean` 和 `site`。`default` 是最重要的周期，它包含了大部分的构建工作。`clean` 周期用于清理项目，`site` 周期用于生成项目站点。每个生命周期都包含一系列的阶段，这些阶段是按顺序执行的。

**`default` 生命周期的阶段如下：**

|阶段|说明|
|---|---|
|`validate`|验证项目是否正确并且所有必要的信息是否均可用|
|`compile`|编译项目的源代码，生成 `target` 目录。仅编译项目的源代码，不会编译测试代码。|
|`test`|使用单元测试框架（例如 junit）执行测试用例。执行 `test` 命令时，会自动先执行 `test-compile` 命令编译测试代码，生成 `target/test-classes` 目录。|
|`package`|将编译好的代码打包成 jar、war 等文件。|
|`verify`|对集成测试的结果进行检查以确保满足质量标准|
|`install`|将项目的 jar、war 等文件安装到本地仓库。|
|`deploy`|将项目的 jar、war 等文件发布到远程仓库。|

**`clean` 生命周期的阶段如下：**

|阶段|说明|
|---|---|
|`pre-clean`|执行一些清理前的工作|
|`clean`|清理项目，彻底删除 `target` 目录。（不走回收站）|
|`post-clean`|执行一些清理后的工作|

:::danger 警告
在 Maven 中执行测试用例时，需要同时满足以下两个条件：

1. 测试用例类的命名规范：`*Test.java`、`Test*.java`。否则 Maven 找不到测试类，也就不会执行测试用例。  
2. 测试用例方法的命名规范：`test*`。否则 Maven 找不到测试方法，也就不会执行测试用例（部分单元测试框架会直接报错）。
:::

:::warning 注意
以上列出的命令是按照优先级排序的。后面的命令会依赖前面的命令。执行任何一个阶段时，都会自动按顺序执行前面的阶段。以上所有命令都必须在 `pom.xml` 所在的目录下执行。
:::

:::tip 提示
Maven 的单元测试是发生在 `package` 阶段之前的。如果单元测试失败，`package` 阶段不会执行。如果单元测试成功，`package` 阶段会执行。`package` 生成的 jar、war 等文件是编译后的文件，不包含测试用例。
:::

**示例：**

```bash
mvn clean package

# 跳过单元测试。不执行测试用例，但编译测试用例类生成相应的 class 文件至 target/test-classes 下
mvn clean package -DskipTests

# 跳过单元测试。不执行测试用例，也不编译测试用例类
mvn clean package -Dmaven.test.skip=true
```

:::tip 跳过单元测试
[Maven打包跳过测试](https://www.cnblogs.com/three-fighter/p/13996864.html)
:::

其实，上面的每一个构建过程都有一个与之对应的插件。例如，`compile` 阶段对应的插件是 `maven-compiler-plugin`，`test` 阶段对应的插件是 `maven-surefire-plugin`，`package` 阶段对应的插件是 `maven-jar-plugin`、`maven-war-plugin` 等。每个插件都有一个或多个目标，Maven 中的命令就是执行这些目标。简单来说，Maven 的命令就是执行插件的目标，每个命令都是由对应的插件来执行的。
