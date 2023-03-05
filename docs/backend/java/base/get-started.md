# 第一个 Java 代码

新建一个 Java 文件（`HelloWorld.java`），然后编码（**类名必须和文件名一致**），最后编译该文件。使用 cmd 命令，切换到 Java 文件所在盘符，比如我的在 D 盘：
```sh
d:
```
然后再进入文件所在的目录：
```sh
cd myfile/javaproject
```
然后编译文件（编译后会出现 `.class`文件）：
```sh
javac Helloword.java
```

运行代码（执行的是 `.class` 文件，且 cmd 中不带文件后缀 `.class`）：
```sh
java HelloWorld
```

**命令行编译报错？**  

代码中如果存在中文，编译时可能报错，需要把文件编码改成 ASCII 编码（使用 notepad++）。但是 Java 默认的是 Unicode 编码。

## 类的命名规范
一个 Java 文件中允许有多个类，但是只能有一个共有的（public）类。

## 转义字符 \t 

补满一定位数，在 cmd 和 Eclipse 中是 8 位，IDEA 中为 4 位。补满的意思是和前面的字符加在一起，然后凑足 8 位（不是直接在字符后加 8 个空格）。
