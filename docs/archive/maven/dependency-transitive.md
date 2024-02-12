# 依赖传递

:::tip 参考
[Transitive Dependencies](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
:::

Maven 通过传递依赖，避免了我们手动指定所有依赖的麻烦。当我们引入一个依赖时，Maven 会自动引入该依赖的相关依赖。

例如，假设我们有一个项目 maven-login，它依赖于项目 maven-common，而项目 maven-common 中含有 jackson 的依赖。那么，当我们在项目 maven-login 中引入项目 maven-common 时，Maven 会自动引入 jackson。关系图如下：

![20240211111624](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-11/20240211111624.png)

- **maven-common**

```xml
<groupId>com.daijunfeng</groupId>
<artifactId>maven-common</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>jar</packaging>

<name>maven-common</name>
<url>http://maven.apache.org</url>

<properties>
  <maven.compiler.source>1.8</maven.compiler.source>
  <maven.compiler.target>1.8</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<dependencies>
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
  </dependency>
</dependencies>
```

- **maven-login**

```xml
<groupId>com.daijunfeng</groupId>
<artifactId>maven-login</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>jar</packaging>

<name>maven-login</name>
<url>http://maven.apache.org</url>

<properties>
  <maven.compiler.source>1.8</maven.compiler.source>
  <maven.compiler.target>1.8</maven.compiler.target>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<dependencies>
  <!-- 依赖 common -->
  <dependency>
    <groupId>com.daijunfeng</groupId>
    <artifactId>maven-common</artifactId>
    <version>1.0-SNAPSHOT</version>
  </dependency>
  <dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>3.8.1</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

由于 maven-common 中已经含有 jackson 的依赖，所以在 maven-login 中引入 maven-common 时，Maven 会自动引入 jackson，我们就可以在 maven-login 中直接使用 jackson 了。这就是依赖传递。

但是，并不是所有的依赖都会传递。Maven 会根据依赖的范围和传递性来决定是否传递依赖。关于依赖的范围，可以参考 [依赖范围](./scope.html)。

通过从指定的远程存储库读取依赖项的项目文件可以简化此功能。一般来说，这些项目的所有依赖项都会在您的项目中使用，就像项目从其父项或从其依赖项继承的任何依赖项一样。

可以收集依赖项的级别数量没有限制。仅当发现循环依赖性时才会出现问题。

通过传递依赖，依赖链路可能很快变得非常大。因此，有一些附加功能限制了包含的依赖项：

- **依赖调解 Dependency mediation**

  这决定了当遇到多个版本作为依赖项时将选择哪个版本。Maven 选择 “nearest definition”（最短路径优先）。您始终可以通过在项目的 POM 中显式声明来保证版本。请注意，如果两个依赖项版本在依赖项树中处于相同深度，则使用第一个声明的。

  “nearest definition” 意味着所使用的版本将是依赖关系树中最接近您的项目的版本。请看下面的依赖关系：

  ```plaintext
  A
  ├── B
  │   └── C
  │       └── D 2.0
  └── E
      └── D 1.0
  ```

  在文本中，A、B 和 C 的依赖关系定义为 A -> B -> C -> D 2.0 和 A -> E -> D 1.0，那么在构建 A 时将使用 D 1.0，因为从 A 到 D 到 E 较短。您可以在 A 中显式添加对 D 2.0 的依赖项以强制使用 D 2.0，如下所示：

  ```plaintext
  A
  ├── B
  │   └── C
  │       └── D 2.0
  ├── E
  │   └── D 1.0
  │
  └── D 2.0
  ```

- **依赖管理 Dependency management**

  这允许开发人员在遇到传递依赖或未指定版本的依赖时直接指定要使用的依赖的版本。在上一节的示例中，尽管 A 不直接使用 D，但它还是直接添加到了 A 中。相反，A 可以将 D 作为依赖项包含在其 `dependencyManagement` 中，并直接控制是否引用 D 或是否引用 D 的版本。

- **依赖范围 Dependency scope**

  这允许您仅包含适合当前构建阶段的依赖项。可以参考 [依赖范围](./scope.html)。

- **排除依赖 Excluded dependencies**

  如果项目 X 依赖于项目 Y，并且项目 Y 依赖于项目 Z，则项目 X 的​​所有者可以使用“exclusion”元素显式排除项目 Z 作为依赖项。

  ```xml
  <dependency>
    <groupId>com.daijunfeng</groupId>
    <artifactId>maven-common</artifactId>
    <version>1.0-SNAPSHOT</version>
    <exclusions>
      <exclusion>
        <!-- 不需要带 version -->
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
      </exclusion>
    </exclusions>
  </dependency>
  ```

- **可选依赖 Optional dependencies**

  如果项目 Y 依赖于项目 Z，则项目 Y 的所有者可以使用 `optional` 标签将项目 Z 标记为可选依赖。当项目 X 依赖于项目 Y 时，X 将仅依赖于 Y，而不依赖于 Y 的可选依赖 Z。然后，项目 X 的​​所有者可以根据自己的选择显式添加对 Z 的依赖项。（将可选依赖视为“默认排除”可能会有所帮助。）

  ```xml
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
    <optional>true</optional>
  </dependency>
  ```

尽管传递依赖可以隐式包含所需的依赖，但显式指定直接使用的依赖项是一个好习惯。这种最佳实践证明了它的价值，特别是当项目的依赖项更改其依赖时。例如，假设您的项目 A 指定了对另一个项目 B 的依赖关系，而项目 B 指定了对项目 C 的依赖关系。如果您直接使用项目 C 中的组件，并且没有在项目 A 中指定项目 C，则当项目 B 突然更新或者删除对项目 C 的依赖时，可能会导致构建失败。

直接指定依赖项的另一个原因是它为您的项目提供了更好的文档：只需阅读项目中的 POM 文件或执行 `mvn dependency:tree` 即可了解更多信息。

Maven 还提供 [dependency:analyze](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) 插件目标来分析依赖关系：它有助于使此最佳实践更容易实现。

:::tip 小结
依赖关系为 A -> B -> C 时，C 中的依赖出现以下情况时，不会将依赖传递到 A：

1. 依赖的 `scope` 是非 `compile`、`runtime` 范围

2. 依赖中设置了 `<optional>true</optional>` 标签
```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-core</artifactId>
  <version>5.3.9</version>
  <optional>true</optional>
</dependency>
```

3. A 中设置了 `<exclusions>` 标签排除了 B 中的依赖
:::
