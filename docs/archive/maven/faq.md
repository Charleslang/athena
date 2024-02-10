# FAQ

## Web 项目执行 `mvn package` 报错

:::tip 参考
[Apache Maven WAR Plugin](https://maven.apache.org/plugins/maven-war-plugin/)
:::

原因可能是 JDK 版本和 Maven 打包插件版本不匹配。解决方法是修改 `pom.xml` 文件，指定 JDK 版本和 Maven 打包插件版本。

```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
    <maven.compiler.testSource>17</maven.compiler.testSource>
    <maven.compiler.testTarget>17</maven.compiler.testTarget>
    <maven.compiler.testCompilerVersion>17</maven.compiler.testCompilerVersion>
</properties>

<build>
  <plugins>
      <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-war-plugin</artifactId>
          <version>3.3.2</version>
      </plugin>
  </plugins>
</build>
```
