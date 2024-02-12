# Maven 私服

## 安装 Nexus

:::tip 参考
[点击这里](https://help.sonatype.com/en/download.html) 下载 Nexus。
:::

![20240212184421](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212184421.png)

下载完成后，解压：

```bash
mkdir nexus && unzip nexus-3.65.0-02-win64.zip -d nexus
```

修改一些配置信息，例如 nexus 的端口号：

```bash
vim nexus-3.65.0-02/etc/nexus-default.properties
```

```properties
## DO NOT EDIT - CUSTOMIZATIONS BELONG IN $data-dir/etc/nexus.properties
##
# Jetty section
application-port=8081
application-host=0.0.0.0
nexus-args=${jetty.etc}/jetty.xml,${jetty.etc}/jetty-http.xml,${jetty.etc}/jetty-requestlog.xml
nexus-context-path=/

# Nexus section
nexus-edition=nexus-pro-edition
nexus-features=\
nexus-pro-feature

nexus.hazelcast.discovery.isEnabled=true
```

启动 nexus：

```bash
# Windows 下可能需要使用管理员身份运行
nexus-3.65.0-02/bin/nexus.exe /run

# Linux
nexus run
```

第一次启动耗时较长，出现以下信息时，表示启动成功：

```log
-------------------------------------------------

Started Sonatype Nexus OSS 3.65.0-02

-------------------------------------------------
```

启动完成后，访问 `localhost:8081`（默认是 8081 端口）。如下：

![20240212185947](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212185947.png)

:::tip 提示
如果访问时，网页刷新不出来，一直转圈圈。这时候，可以使用 <kbd>Ctrl</kbd> + <kbd>C</kbd> 唤醒 Nexus。
:::

登录 Nexus：

![20240212190241](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212190241.png)

首次使用 admin 登陆后，会提示修改 admin 的密码。

## 内置仓库

:::tip 参考
[搭建Maven私服看这一篇就够了](https://zhuanlan.zhihu.com/p/520107316)
:::

进入 Nexus 后，我们会发现几个内置的仓库，如下：

![20240212190752](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212190752.png)

从上图中，我们可以看到四个仓库的类型，Nexus 默认的仓库类型有以下四种：

- group（仓库组类型）：又叫组仓库，用于方便开发人员自己设定的仓库
- hosted（宿主类型）：内部项目的发布仓库（内部开发人员，发布上去存放的仓库）
- proxy（代理类型）：从远程中央仓库中寻找数据的仓库，可以去选择被代理的远程仓库
- virtual（虚拟类型）：虚拟仓库（这个基本用不到，主要使用上面三种类型的仓库）

我们可以到设置中修改这些仓库的某些信息：

![20240212190846](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212190846.png)

以 maven-central 为例，它表示代理的 Maven 中央远程仓库，默认地址是 `https://repo1.maven.org/maven2/`。如果访问较慢，可以将其修改为阿里云镜像仓库地址：

![20240212191027](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212191027.png)

从 maven-central 中下载的 jar 包会被放在 maven-public 中。如果是公司自己开发的 jar，那么一般会被放在 maven-releases、maven-snapshots 中（maven-releases、maven-snapshots 中的 jar 也会被放在 maven-public 中）。

![20240212200842](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212200842.png)

## 配置私服

- **配置镜像**

  :::tip 参考
  [Using Mirrors for Repositories](https://maven.apache.org/guides/mini/guide-mirror-settings.html)
  :::

  ```xml
  <mirror>
    <!-- id 任取, 此 id 需要和 server 中的 id 一致 -->
    <id>public</id>
    <!-- name 任取 -->
    <name>my mirror</name>
    <!-- mirrorOf 可以是 * 或者 central 等 -->
    <mirrorOf>central</mirrorOf>
    <url>http://localhost:8091/repository/maven-public/</url>
  </mirror>
  ```

  如何获取私服的 url？

  ![20240212202343](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212202343.png)

- **配置 servers**
  
  如果你的私服允许匿名访问，那么可以不用配置 servers。如果私服需要用户名和密码，那么需要配置 servers。

  ```xml
  <servers>
    <server>
      <!-- id 任取，需要和 mirror 中的 id 一致 -->
      <id>public</id>
      <username>admin</username>
      <password>123456</password>
    </server>
    <server>
      <id>releases</id>
      <username>admin</username>
      <password>123456</password>
    </server>
    <server>
      <id>snapshots</id>
      <username>admin</username>
      <password>123456</password>
    </server>
  </servers>
  ```

## 上传 jar 到 Nexus

我们可以在 Nexus 后台界面中上传 jar 包，如下：

![20240212223048](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212223048.png)

当然，我们也能通过 Maven 插件打包并上传到 Nexus。如下：

- pom.xml

```xml
<groupId>com.daijunfeng</groupId>
<artifactId>lifecycle-test</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>jar</packaging>

<distributionManagement>
  <!-- 项目正式库（版本号以非 SNAPSHOT 结尾的 jar 将被部署到 releases 仓库中 -->
  <repository>
    <!-- 此 id 必须和 settings.xml 中的 <server> id 一致 -->
    <id>releases</id>
    <name>nexus-releases</name>
    <url>http://localhost:8091/repository/maven-releases/</url>
  </repository>
  <!-- 代码快照版本库（版本号以 SNAPSHOT 结尾的 jar 将被部署到 snapshots 仓库中） -->
  <snapshotRepository>
    <!-- 此 id 必须和 settings.xml 中的 <server> id 一致 -->
    <id>snapshots</id>
    <name>nexus-snapshots</name>
    <url>http://localhost:8091/repository/maven-snapshots/</url>
  </snapshotRepository>
</distributionManagement>
```

然后执行 `mvn clean deploy` 命令即可。

## 上传源码到 Nexus

:::tip 参考
[Apache Maven Source Plugin](https://maven.apache.org/plugins/maven-source-plugin/)  
[Usage](https://maven.apache.org/plugins/maven-source-plugin/usage.html)  
[Configuring Source Plugin](https://maven.apache.org/plugins/maven-source-plugin/examples/configureplugin.html)  
:::

在上面，我们实现了将 jar 包上传到 Maven 私服。但是有一个问题，如果某个项目引用了这个 jar 包，并且想要查看该 jar 的源码，那么就会出现下面的现象：

![20240212212109](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-12/20240212212109.png)

无法下载源码，因为我们上传到私服的只有打包后的 jar，而没有将源码也进行上传。针对这种情况，我们可以使用 `maven-source-plugin` 插件来解决：  

```xml
<plugins>
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-source-plugin</artifactId>
    <version>2.4</version>
    <configuration>
      <attach>true</attach>
    </configuration>
    <executions>
      <execution>
        <id>attach-sources</id>
        <!-- phase 只能是 deploy 之前的值 -->
        <phase>verify</phase>
        <goals>
          <!-- goal 的可选值请参考 https://maven.apache.org/plugins/maven-source-plugin -->
          <goal>jar</goal>
        </goals>
      </execution>
    </executions>
  </plugin>
</plugins>
```

对于单模块来讲，上面的配置是没有问题的。但是，对于多模块项目，需要把插件的声明放到父项目的 `<pluginManagement>`。如下：

```xml
<build>
  <pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-source-plugin</artifactId>
        <version>2.4</version>
        <configuration>
          <attach>true</attach>
        </configuration>
        <executions>
          <execution>
            <id>attach-sources</id>
            <!-- phase 只能是 deploy 之前的值 -->
            <phase>verify</phase>
            <goals>
              <!-- goal 的可选值请参考 https://maven.apache.org/plugins/maven-source-plugin -->
              <goal>jar</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </pluginManagement>
</build>
```

然后，在子项目中使用该插件即可。如下：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-source-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

## 从 Nexus 下载 jar

```xml
<!-- 如果私服不允许匿名访问，则需要配置私服仓库 -->
<repositories>
  <repository>
    <!-- 此 id 需要和 settings.xml 中的 <server> id 一致 -->
    <id>public</id>
    <name>public repository</name>
    <url>http://localhost:8091/repository/maven-public/</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.daijunfeng</groupId>
    <artifactId>lifecycle-test</artifactId>
    <version>1.0-SNAPSHOT</version>
  </dependency>
</dependencies>
```
