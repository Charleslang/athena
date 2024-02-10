# 依赖范围

:::tip 参考
[Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
:::

在 Maven 中，依赖范围是指编译、测试、运行时的依赖关系。依赖关系范围用于限制依赖关系的传递性并确定依赖关系何时包含在类路径中。Maven 有 6 种依赖范围，如下：

|scope|说明|传递性|是否打包|
|---|---|---|---|
|**compile**|这是默认范围，如果未指定 scope，则使用 compile。compile 依赖项在项目的所有类路径中都可用。此外，这些依赖关系会传播到依赖项目。|:heavy_check_mark:|:heavy_check_mark:|
|**provided**|这个范围类似于 compile，但是仅在编译和测试的 classpath 中可用，在运行时的 classpath 中不可用。这表明你希望由外部容器或者 JDK 在程序运行时提供该依赖。例如 Servlet API 对于编译和测试是需要的，但是在运行时由于 Tomcat 会提供此依赖，故不需要 Maven 重复引入此依赖。某些情况下，我们只需要在编译的时候使用某些 jar，而程序运行时不需要用到该 jar，那么就可以将依赖的 scope 设置为 provided，例如 lombok。|:x:|:x:|
|**runtime**|此范围表示编译期间不需要依赖项，但程序运行需要依赖。Maven 在运行时和测试 classpath 中包含对此范围的依赖项，但在编译 classpath 中不包含此范围的依赖项。例如，JDBC 驱动程序，由于 JDBC 的接口是由 JDK 提供的，在开发过程中，我们是面向接口编程的，所以 JDBC 驱动程序在编译时不需要，但是在测试、运行时需要调用接口的具体实现，这时候就需要 JDBC 驱动程序了。|:heavy_check_mark:|:heavy_check_mark:|
|**test**|此范围表示该依赖项对于应用程序的正常使用来说不是必需的，仅适用于测试编译和测试执行阶段。通常，此范围用于 JUnit 和 Mockito 等测试库。它也可用于非测试库，例如 Apache Commons IO，如果这些库用于单元测试 (src/test/java) 但不需要在业务代码 (src/main/java) 中使用。|:x:|:x:|
|**system**|此范围与 provided 一样，但是你必须提供此依赖项的路径。这意味着该依赖项不会从仓库中下载，而是从本地文件系统中获取。你需要提供 `systemPath` 元素来指定依赖项的路径。例如：`<dependency><groupId>com.oracle</groupId><artifactId>ojdbc6</artifactId><version>1.0</version><scope>system</scope><systemPath>${project.basedir}/lib/ojdbc6.jar</systemPath></dependency>`|:heavy_check_mark:|:x:|
|**import**|此范围仅适用于 `<dependencyManagement>` 部分中的依赖项。它表示该依赖项应该被导入到项目中（也就是说，把父工程中 `<dependencyManagement>` 的依赖合并到当前工程的 `<dependencyManagement>` 中），而不是直接引用。例如，Spring Boot 的 BOM (Bill of Materials) 依赖项就是使用 import 范围的。该范围不具有依赖传递性。|:x:|:heavy_check_mark:|

每个范围（`import 除外`）都会以不同的方式影响传递依赖项，如下表所示。如果将依赖项设置为左列中的范围，则该依赖项与第一行范围内的传递依赖项会导致主项目中的依赖项与交叉点处列出的范围相关（也就是说，工程中有一个 compile 的 a.jar，但是导入的 b.jar 中也有 runtime 的 a.jar，那么 a.jar 最终的范围就是交叉点处列出的范围）。如果没有列出范围，则意味着省略了依赖关系。

| |compile|provided|runtime|test|
|---|---|---|---|---|
|compile|compile(*)|-|runtime|-|
|provided|provided|-|provided|-|
|runtime|runtime|-|runtime|-|
|test|test|-|test|-|
