# 打包配置

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
