# 聚合

:::tip 参考
[Project Aggregation](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#project-aggregation)
:::

Maven 聚合是指将多个项目组织到同一个父工程中，以便一起构建和管理。聚合可以帮助我们更好地管理一组子项目，同时简化它们的构建和部署。

**聚合的作用：**

1. 管理多个子项目。通过聚合，可以将多个子项目组织在一起， 方便管理和维护。  
2. 构建和发布一组相关的项目。通过聚合，可以在一个命令中构建和发布多个相关的项目，简化了部署和维护工作。  
3. 优化构建顺序。通过聚合，可以对多个项目进行顺序控制，避免出现构建依赖混乱导致构建失败的情况。  
4. 统一管理依赖项。通过聚合，可以在父项目中管理公共依赖和插件，避免重复定义。

**如何使用聚合？**  

其实，聚合就是要创建一个父项目和多个子项目。创建父项目和子项目的步骤和 Maven 的继承完全一样，参考 [继承](./inheritance.html)。  

有一点区别就是，我们需要在父项目中额外添加 `module`，来声明子项目相对于父项目的路径。如下：

项目结构：

```plaintext
|── maven-cms-common
maven-cms-parent
├── maven-cms-login
├── pom.xml
```

- maven-cms-parent

```xml
<groupId>com.daijunfeng</groupId>
<artifactId>maven-cms-parent</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>pom</packaging>

<!-- 声明子模块 pom.xml 相对于父工程的目录（注意，只需要写目录即可） -->
<modules>
  <module>../maven-cms-common</module>
  <module>maven-cms-login</module>
</modules>
```

在打包时，我们只需要对父工程执行 `mvn clean package` 即可，子工程会按照父工程在 `<module` 中定义的顺序依次自动执行 `mvn clean package`。

下面来看一个使用聚合的典型例子。

如果 maven-cms-login 中需要使用 maven-cms-common，那该怎么办呢？我们能想到的是，在 maven-cms-login 的依赖中添加 maven-cms-common。如下：

- maven-cms-login

```xml
<dependency>
  <groupId>com.daijunfeng</groupId>
  <artifactId>maven-cms-common</artifactId>
  <version>1.0-SNAPSHOT</version>
</dependency>
```
这样做确实没有问题。但是，如果不使用聚合，那么在编译 maven-cms-login 时可能报错，报错的原因是找不到 maven-cms-common，为什么呢？因为 maven 中的依赖都是先找本地仓库，本地没有的话再找远程仓库。显然，本地和远程仓库都没有 maven-cms-common，所以报错。解决办法就是手动将 maven-cms-common 安装到本地仓库，即在 maven-cms-common 中执行 `mvn install`，这样做非常麻烦。有了聚合后，我们就不再需要这样手动 install 了。
