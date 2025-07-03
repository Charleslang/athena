# 继承

:::tip 参考
[Project Inheritance](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#project-inheritance)
:::

Maven 中的继承是指，让一个项目从另一个项目中**继承配置信息**。继承可以让我们在多个项目中共享相同的配置信息，减少重复配置的工作。

**为什么需要使用继承？**

1. 在每一个 module 中各自维护各自的依赖信息很容易发生冲突，不利于统一管理。  
2. 使用同一个框架的不同 jar 包，它们应该是同一个版本，因此整个项目中使用的框架版本需要统一。  
3. 使用框架时所需要的 jar 包组合（或者说依赖信息组合）需要经过长期摸索和反复调试，最终确定一个可用组合。这个耗费很大精力总结出来的方案不应该在新的项目中重新摸索。通过在父工程中为整个项目维护依赖信息的组合既保证了整个项目使用规范、准确的 jar 包，又能够将以往的经验沉淀下来，节约时间和精力。

**什么时候可以使用继承？**

1. 大型项目进行模块拆分。  
2. project 中含有多个 moudle，这些 moudle 有相同的配置信息。

**如何使用继承？**

1. 新建一个父工程，将 `packaging` 设置为 `pom`

```xml
<groupId>com.daijunfeng</groupId>
<artifactId>maven-cms-parent</artifactId>
<version>1.0-SNAPSHOT</version>
<!-- 父工程不需要参与打包，因此打包方式为 pom -->
<!-- 父工程一般只用于管理依赖，因此，不需要在父工程中编写代码，可以直接把 src 目录删掉 -->
<packaging>pom</packaging>
```

2. 在父工程下新建子工程

```plaintext
maven-cms-parent
├── maven-cms-login
│   ├── src
│   │   └── main
│   │       └── java
│   └── pom.xml
├── pom.xml
```

3. 在子工程中引入父工程

```xml
<!-- 引入父工程 -->
<parent>
  <groupId>com.daijunfeng</groupId>
  <artifactId>maven-cms-parent</artifactId>
  <version>1.0-SNAPSHOT</version>
  <!-- 设置当前子项目的 pom.xml 到父工程 pom.xml 的相对路径，默认是 ../pom.xml -->
  <relativePath>../pom.xml</relativePath>
</parent>

<!-- maven-cms-login 不需要设置 groupId、version，默认和父工程的 groupId、version 保持一致 -->
<!-- 如果 maven-cms-login 的 groupId、version 和父工程不一致，则需要单独声明 groupId、version -->
<artifactId>maven-cms-login</artifactId>
<!-- 子工程的打包方式 -->
<packaging>jar</packaging>
```

:::warning 注意
在 [依赖传递](./dependency-transitive.html) 中，我们提到，只有 scope 为 `compile`、`runtime` 时，才能发生依赖传递。但是，如果使用聚合，则父工程中的所有依赖都会传递给子工程（忽略 scope）。请看下面的例子：  

- maven-cms-parent

```xml
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>3.8.1</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

那么，子工程 maven-cms-login 可以直接使用 junit，而无需额外引入 junit 依赖。当然，如果子工程想要使用其它版本的 junit，则只需要在子工程中声明依赖以覆盖父工程中的相同依赖，如下：

- maven-cms-login

```xml
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.1</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```
:::

在上面，我们知道了，如果在父工程的 `<dependencies>` 中声明了依赖，那么这些依赖会无条件的导入到子工程中。有时候，我们并不想这样做，我们仅仅想按需导入，这时候，我们需要在父工程中使用 `<dependencyManagement>` 标签来声明依赖。

- maven-cms-parent

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.15.2</version>
    </dependency>
  </dependencies>
</dependencyManagement>
```

对于子工程来讲，我们需要父工程的哪些依赖，就在子工程中显示导入即可。如下：

- maven-cms-login

```xml
<dependencies>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <!-- 可以省略 version 和 scope 标签，默认使用父工程中的 version 和 scope。如果指定了，则以指定的为准。 -->
    <!-- <version>4.13.1</version> -->
    <!-- <scope>runtime</scope> -->
  </dependency>
</dependencies>
```
