# 打包配置

在 Maven 中，打包是一个非常重要的环节，Maven 中的打包是通过插件来完成的。其实在 [生命周期](lifecycle.html) 中，我们提到过，Maven 的生命周期是由插件目标组成的，生命周期的每个阶段都是由对应的插件来完成的。

在 IDEA 中，我们可以看到这些插件以及插件对应的版本。如下：

![20240210162732](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210162732.png)

## 静态资源编码

:::tip 参考
[Specifying a character encoding scheme](https://maven.apache.org/plugins/maven-resources-plugin/examples/encoding.html)
:::

```xml
<properties>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```
通过使用 `project.build.sourceEncoding` 属性，maven-resources-plugin 插件将自动使用此编码。但是有时，您需要出于不同目的显式更改编码，这可以通过如下配置定义编码来完成：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-resources-plugin</artifactId>
      <version>2.6</version>
      <configuration>
        <encoding>UTF-8</encoding>
      </configuration>
    </plugin>
  </plugins>
</build>
```

## 设置 Java 编译器的 `-source` 和 `-target`

:::tip 参考
[Setting the -source and -target of the Java Compiler](https://maven.apache.org/plugins/maven-compiler-plugin/examples/set-compiler-source-and-target.html)
:::

有时，您可能需要将某个项目编译为与当前使用的版本不同的版本。`javac` 可以使用 `-source` 和 `-target` 接受此类命令。Maven Compiler Plugin 还可以在编译期间提供这些配置选项。

例如，如果您想使用 Java 8 语言功能（`-source 1.8`），并且还希望编译的类与 JVM 1.8（`-target 1.8`）兼容，您可以添加以下两个属性，它们是 Maven Compiler Plugin 中内置参数的默认属性名称：

```xml
<project>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>
</project>
```

或者直接配置插件：

```xml
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.12.1</version>
        <configuration>
          <source>1.8</source>
          <target>1.8</target>
          <encoding>UTF-8</encoding>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

:::warning 注意
仅设置 `target` 选项并不能保证您的代码实际上在指定版本的 JRE 上运行。陷阱是无意中使用了仅存在于后续 JRE 中的 API，这将使您的代码在运行时失败并出现链接错误。为了避免此问题，您可以配置编译器的引导类路径 boot classpath 以匹配目标 JRE，或者使用 [Animal Sniffer Maven](http://www.mojohaus.org/animal-sniffer/animal-sniffer-maven-plugin/) 插件来验证您的代码没有使用意外的 API，或者更好的是使用自 JDK 9 以来支持的 [`release`](https://maven.apache.org/plugins/maven-compiler-plugin/examples/set-compiler-release.html) 选项。同样，设置 `source` 选项并不能保证您的代码实际上可以在指定版本的 JDK 上编译。要使用与启动 Maven 不同的特定 JDK 版本来编译代码，请参阅 [Compile Using A Different JDK](https://maven.apache.org/plugins/maven-compiler-plugin/examples/compile-using-different-jdk.html)。
:::


## 打包名称

:::tip 参考
[The BaseBuild Element Set](https://maven.apache.org/pom.html)
:::

```xml
<build>
  <!-- 默认是 ${artifactId}${version} -->
  <!-- 注意，不需要带后缀，只需要写文件名即可。后缀会根据 ${packaging} 自动判断 -->
  <finalName>myapp${version}</finalName>
</build>
```

## 包含文件

默认情况下，Maven 将在 src/main/resources 下查找项目的配置文件、静态资源等，将其下的所有文件都打包到 jar 或者 war 包内。但是，您的某些资源可能并不位于 src/main/resources 中。因此，您必须通过以下配置将这些额外文件放入打包的 jar、war 中：

```xml
<build>
  <resources>
    <resource>
      <!-- src/main/java 也可以 -->
      <directory>${basedir}/src/main/java</directory>
      <!-- 如果没有 includes，则会把 directory 中所有文件都进行打包 -->
      <includes>
        <!-- 打包任意目录下的 xml 文件 -->
        <include>**/*.xml</include>
        <!-- 打包任意目录下的 properties 文件 -->
        <include>**/*.properties</include>
      </includes>
    </resource>
    <resource>
       <!-- 打包 ${basedir}/configs 下的所有文件 -->
       <directory>configs</directory>
     </resource>
  </resources>
</build>
```

需要注意的是，如果配置了 `<resources>`，则 `src/main/resources` 下的文件不会被打包了，此时，需要手动配置 `src/main/resources` 下的文件。例如：

```xml
<build>
  <resources>
    <resource>
      <directory>${basedir}/src/main/resources</directory>
      <includes>
        <include>**/*</include>
      </includes>
      <filtering>true</filtering>
    </resource>
  </resources>
</build>
```

## 排除文件

有时候，我们不希望把某些文件进行打包，那么可以使用下面的配置来排除某些文件。

```xml
<build>
  <resources>
    <resource>
      <directory>${basedir}/src/main/java</directory>
      <excludes>
        <exclude>**/*.java</exclude>
      </excludes>
    </resource>
    <resource>
      <directory>${basedir}/src/main/resources</directory>
      <includes>
        <include>**/*</include>
      </includes>
      <!-- 不把 resources/ffmpeg/ffmpeg.tar.gz 打入 war 或者 jar 包内 -->
      <excludes>
        <exclude>ffmpeg/ffmpeg.tar.gz</exclude>
      </excludes>
      <filtering>true</filtering>
    </resource>
  </resources>

  <testResources>
    <testResource>
      <directory>${basedir}/src/test/resources</directory>
      <includes>
        <include>**/*.*</include>
      </includes>
    </testResource>
    <testResource>
      <directory>${basedir}/src/main/resources</directory>
      <includes>
        <include>**/*</include>
      </includes>
      <excludes>
        <exclude>ffmpeg/ffmpeg.tar.gz</exclude>
      </excludes>
      <filtering>true</filtering>
    </testResource>
  </testResources>
</build>
```

## 排除编译

有时候，我们希望在打包时，不对某些文件进行编译，特别是一些二进制文件，例如 `.zip`、`.gz`、`.excel` 等。如果 Maven 在打包时，对这些文件进行了编译，那么可能会导致这些文件被损坏。

```xml
<build>
  <plugins>
    <plugin>
      <!-- 需要注意 maven-resources-plugin 的版本，如果版本和你的 Maven 版本不兼容，可能导致打包失败 -->
      <!-- 如何找到与 Maven 兼容的 maven-resources-plugin 呢？我目前反正是没找到好的办法，只有自己不断尝试各种版本 -->
      <artifactId>maven-resources-plugin</artifactId>
      <version>3.0.2</version>
      <configuration>
        <!-- 不对特定后缀的文件进行编译 -->
        <!-- 如果编译了某些二进制文件, 则可能会导致该二进制文件被损坏 -->
        <nonFilteredFileExtensions>
          <nonFilteredFileExtension>gz</nonFilteredFileExtension>
        </nonFilteredFileExtensions>
      </configuration>
      <executions>
        <!-- 打包时, 将 resources/ffmpeg/ffmpeg.tar.gz 复制到 target 目录下 -->
        <execution>
          <id>copy-resources</id>
          <phase>package</phase>
          <goals>
            <goal>copy-resources</goal>
          </goals>
          <configuration>
            <outputDirectory>${basedir}/target</outputDirectory>
            <resources>
              <resource>
                <directory>${basedir}/src/main/resources/ffmpeg</directory>
                <includes>
                  <include>ffmpeg.tar.gz</include>
                </includes>
                <filtering>true</filtering>
              </resource>
            </resources>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

## Filtering

:::tip 参考
[Filtering](https://maven.apache.org/plugins/maven-resources-plugin/examples/filter.html)
:::

变量可以包含在您的资源中。这些变量由 `${...}` 或 `@...@` 分隔符表示，可以来自系统属性、项目属性、过滤器资源和命令行。比如，`pom.xml` 文件中的属性、`settings.xml` 文件中的属性、`profiles` 中的属性等。我们在打包的资源文件中（不仅仅局限于 `src/main/resources`）可以使用这些变量。

例如，如果我们有一个资源 `src/main/resources/hello.txt` 包含：

```txt
Hello ${name}
```

pom.xml 文件如下：

```xml
<project>
  <name>My Resources Plugin Practice Project</name>
  <build>
    <resources>
      <resource>
        <directory>src/main/resources</directory>
      </resource>
    </resources>
  </build>
</project>
```

然后执行命令 `mvn resources:resources`，Maven 会将 `src/main/resources` 下的资源文件进行过滤，然后将过滤后的文件放到 `target/classes` 目录下。打开此文件，会发现 `Hello ${name}` 并没有被替换成了 `Hello My Resources Plugin Practice Project`。

但是，如果我们向 pom.xml 添加 `<filtering>` 标记并将其设置为 `true`，如下所示：

```xml{4}
<project>
  <resource>
    <directory>src/main/resources</directory>
    <filtering>true</filtering>
  </resource>
</project>
```

接着，我们再执行 `mvn resources:resources`，之后，我们发现 `target/classes` 目录下的文件中，`Hello ${name}` 被替换成了 `Hello My Resources Plugin Practice Project`。这是因为 `name` 变量被 `project` 中 `name` 的值（在 pom.xml 中指定）替换了。

此外，我们还可以使用 `-D` 选项通过命令行赋值。例如，要将变量名称的值更改为“world”，我们可以简单地调用以下命令：

```bash
mvn resources:resources -Dname="world"
```

此外，我们不限于使用预定义的项目变量。我们可以在 `<properties>` 元素中指定我们自己的变量及其值。例如，如果我们想要将变量从“name”更改为“your.name”，我们可以通过在 `<properties>` 元素中添加 `<your.name>` 元素来实现。

```xml
<properties>
  <your.name>world</your.name>
</properties>
```

但是为了组织您的项目，您可能希望将所有变量及其值放在一个单独的文件中，这样您就不必重写 POM，或者在每次构建时都设置它们的值。这可以通过添加过滤器来完成。

```xml
<project>
  <name>My Resources Plugin Practice Project</name>
  <build>
    <filters>
      <filter>[a filter property]</filter>
    </filters>
  </build>
</project>
```

例如，新建一个 `my-filter-values.properties` 文件，将“your.name”与 POM 分开。文件内容如下：

```properties
your.name=world
```

然后，我们在 pom.xml 中添加 `<filters>` 元素，如下所示：

```xml
<project>
  <name>My Resources Plugin Practice Project</name>
  <build>
    <filters>
      <filter>filters/my-filter-values.properties</filter>
    </filters>
  </build>
</project>
```

项目结构如下：

```plaintext
${baseDir}
|-- filters
|    `-- my-filter-values.properties
|-- src
|   `-- main
|      `-- resources
|-- pom.xml          
```

:::warning 注意
不要过滤包含图像等二进制内容的文件！这很可能会导致打包后文件被损坏。
:::

如果您同时拥有文本文件和二进制文件作为资源，建议使用两个单独的文件夹。一个文件夹 `src/main/resources`（默认）用于未过滤的资源，另一个文件夹 `src/main/resources-filtered` 用于已过滤的资源。

```xml
<project>
  <build>
    <resources>
      <resource>
        <directory>src/main/resources-filtered</directory>
        <filtering>true</filtering>
      </resource>
    </resources>
  </build>
</project>
```

现在，您可以将这些不应过滤的文件放入 `src/main/resources` 中，将其他文件放入 `src/main/resources-filtered` 中。正如已经提到的，过滤图像、pdf 等二进制文件可能会导致输出损坏。为了防止此类问题，您可以配置不被过滤的文件扩展名（configure file extensions，见 [Binary filtering](#binary-filtering)）。

## 过滤 properties 文件

:::tip 参考
[Filtering Properties Files](https://maven.apache.org/plugins/maven-resources-plugin/examples/filtering-properties-files.html)
:::

过滤 resources 时，如果要过滤 properties 文件，则必须特别小心。如果您过滤的 properties 文件包含非 ascii 字符，并且您的 `project.build.sourceEncoding` 设置为 `ISO-8859-1` 以外的任何字符集，您可能会受到影响，应该继续阅读。

**project.build.sourceEncoding 与 resources 有什么关系？**

Maven Resources Plugin 在 3.2.0 版本之前，默认使用 `project.build.sourceEncoding` 作为过滤 resources 时的编码，除非您显式配置插件的 `encoding` 参数。因此，除非您在 Maven Resources Plugin 中明确配置了 `encoding` 参数，否则这就是您所得到的。

**由 Properties 类处理的 properties 文件**

当 Properties 类用于读取和写入 properties 文件时，它们要求 properties 文件使用 `ISO-8859-1` 编码。Java 11 仍然如此，可以在 [API documentation for the Properties class](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Properties.html) 中看到。因此，以这种方式使用的 properties 文件需要使用 `ISO-8859-1` 编码。

**用作 ResourceBundle 的 properties 文件**

当 properties 文件用作 `ResourceBundles` 时，所需的编码因 Java 版本而异。在 Java 8 之前（包括 Java 8），这些文件需要使用 ISO-8859-1 编码。

从 Java 9 开始，resource bundle 的首选编码是 UTF-8。它可能适用于 ISO-8859-1，但正如您在 [Internationalization Enhancements in JDK 9](https://docs.oracle.com/javase/9/intl/internationalization-enhancements-jdk-9.htm#JSINT-GUID-5ED91AA9-B2E3-4E05-8E99-6A009D2B36AF) 中看到的那样，您应该考虑将 resource bundles 转换为 UTF-8 编码。

**What do I need to do?**

你需要做两件事：

1. 根据您在项目中使用 properties 文件的方式，决定对 properties 文件使用哪种编码。
2. 使用 3.2.0 版本中引入的 `propertiesEncoding` 配置参数相应地显式配置 Maven Resource Plugin。在大多数情况下，它看起来像这样：

```xml
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-resources-plugin</artifactId>
        <version>3.3.1</version>
        <configuration>
          <propertiesEncoding>UTF-8</propertiesEncoding>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

## Binary filtering

:::tip 参考
[Binary filtering](https://maven.apache.org/plugins/maven-resources-plugin/examples/binaries-filtering.html)
:::

该插件将阻止二进制文件过滤，而无需为扩展名 jpg、jpeg、gif、bmp 和 png 添加一些 `excludes` 配置。

如果您想添加文件扩展名，可以使用如下配置来简单地实现：

```xml
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-resources-plugin</artifactId>
        <version>3.3.1</version>
        <configuration>
          <nonFilteredFileExtensions>
            <nonFilteredFileExtension>jpg</nonFilteredFileExtension>
            <nonFilteredFileExtension>pdf</nonFilteredFileExtension>
            <nonFilteredFileExtension>swf</nonFilteredFileExtension>
            <nonFilteredFileExtension>gz</nonFilteredFileExtension>
          </nonFilteredFileExtensions>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```
