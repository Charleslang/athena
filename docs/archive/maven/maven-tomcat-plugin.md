# Tomcat 插件

:::warning 注意
该章节只是作为拓展知识，不是必须掌握的内容。而且该内容已经过时，不建议使用。
:::

:::tip 参考
[Apache Tomcat Maven Plugin](https://tomcat.apache.org/maven-plugin.html)
:::

Apache Tomcat Maven Plugin 提供了在 Apache Tomcat®servlet 容器中操作 WAR 项目的目标。可以通过 Apache Maven 运行 War 包，而无需将 War 文件部署到 Apache Tomcat 实例（IDEA 中添加 Tomcat 其实不麻烦，Eclipse 其实也不是很麻烦）。

pom.xml 配置如下：

```xml
<build>
  <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.2</version>
        <configuration>
          <!-- context -->
          <path>/maven-web</path>
          <port>8080</port>
          <uriEncoding>UTF-8</uriEncoding>
          <server>tomcat7</server>
        </configuration>
      </plugin>
    </plugins>
</build>
```

配置完成后，执行 `mvn tomcat7:run` 命令，即可启动 Tomcat 服务器。

在 IDEA 中，可以通过以下方式运行：

![20240210175149](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210175149.png)

选择 `run` 或者 `debug`，然后就可以在浏览器中输入 `http://localhost:8080/maven-web` 访问项目了。

![20240210175241](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210175241.png)

:::warning 注意
现在不推荐使用该插件了，该插件最后一次更新是在 2013 年，已经过时了。因为现代 IDE 都支持配置 Tomcat，配置方式也很简单。
:::
