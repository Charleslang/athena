# 基本概念

## gavp

在 Maven 项目的 pom.xml 文件中，我们会看到 gavp 的配置，即 groupId、artifactId、version、packaging。这些配置是 Maven 项目的基本概念。其中。前三个是必须的，packaging 是可选的。这四个属性主要用于标识项目在 Maven 仓库中的唯一性，有时候，我们也把这四个属性称为 Maven 项目的坐标。

gavp 遵循以下规则：

**groupId**  

项目组织或者公司的唯一标识符，通常是公司的域名倒序，例如：com.example。

**artifactId**  

产品名称或者模块名，例如：search。

**version**

:::tip 参考
[Version Order Specification](https://maven.apache.org/pom.html#Version%20Order%20Specification)
:::

产品的版本号，格式为 `主版本.次版本.修订号`，例如：1.0.0。

- 主版本：当你做了不兼容的 API 修改时，增加主版本号。
- 次版本：当你做了向下兼容的功能性新增时，增加次版本号（新增类、接口等）。
- 修订号：当你做了向下兼容的问题修正时，增加修订号（修复 bug）。

**packaging**  

打包类型。

- jar：Java 项目的默认打包类型。
- war：Web 项目的打包类型。
- pom：不会进行打包，只是作为父项目的配置文件。

## 项目结构

:::tip 参考
[Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html)
:::

Maven 项目约定了一种标准的目录结构，我们创建的项目应该尽可能地符合这个结构。但是，如果不能，可以在 `pom.xml` 中覆盖这些设置。

|目录/文件|说明|
|---|---|
|`src/main/java`|源代码目录|
|`src/main/resources`|资源文件|
|`src/main/filters`|资源过滤文件|
|`src/main/webapp`|Web 项目的 Web 应用目录|
|`src/test/java`|测试代码目录|
|`src/test/resources`|测试资源文件|
|`src/test/filters`|测试资源过滤文件|
|`src/it`|集成测试（主要用于插件）|
|`src/assembly`|描述如何将项目组装成一个发布包|
|`src/site`|项目站点的源文件|
|`LICENSE.txt`|项目的许可证|
|`NOTICE.txt`|项目所依赖的库所要求的注意事项和属性|
|`README.txt`|项目的简介|
|`pom.xml`|项目的配置文件|

该结构只有两个子目录：`src` 和 `target`。这里唯一需要的其他目录是 `CVS`、`.git` 或 `.svn` 等元数据，以及多项目构建中的任何子项目（每个子项目都遵循上面提到的目录结构）。`src` 目录包含了所有的源代码和资源文件，它包含每种类型的子目录：`main` 用于主要构建的代码和资源，`test` 用于单元测试代码和资源、站点等。`target` 目录包含了所有的输出文件。

在 `main` 和 `test` 目录中，有一个用于 `java` 语言的目录（在该目录下存在正常的包层次结构，例如 com.example），还有一个用于 `resources` 的目录（在给定默认资源定义的情况下复制到目标 classpath 的结构）。

看起来的目录结构如下：

```plaintext
${basedir}
|-- src
|	|-- main
|	|	`-- java
|	|	`-- resources
|	|	`-- filters
|	|	`-- webapp
|	|-- test
|	|	`-- java
|	|	`-- resources
|	|	`-- filters
|	|-- it
|	|-- assembly
|	|-- site
|-- pom.xml
`-- LICENSE.txt
`-- NOTICE.txt
`-- README.txt
```
