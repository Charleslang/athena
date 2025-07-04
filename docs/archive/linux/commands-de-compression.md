# 压缩解压命令

在这里说明一下，Linux 中其实不区分文件后缀，有没有后缀都一样。给文件加上后缀只是方便我们识别。

## gzip

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`gzip`|将文件压缩为 `.gz` 格式|`gzip [文件]`|--|`/bin/gzip`|所有用户|

:::warning 注意
`gzip` 只能压缩文件，不能压缩目录。如果需要压缩目录，可以先使用 `tar` 命令打包成一个文件，然后再使用 `gzip` 压缩。
:::

**【示例】**

```bash
# 注意，压缩后 hello.txt 文件将不存在了，直接变成了 hello.txt.gz
gzip hello.txt
```

## gunzip

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`gunzip、gzip -d`|解压缩 `.gz` 的压缩文件|`gunzip[压缩文件]`|GNU unzip|`/bin/gunzip`|所有用户|

```bash
# 会直接将 hello.txt.gz 中的文件解压到当前目录
[root@daijf test1]# gunzip hello.txt.gz

# 会直接将 hello.txt.gz 中的文件解压到当前目录
[root@daijf test1]# gzip -d hello.txt.gz
```

## bzip2

`bzip2` 只能压缩文件。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`bzip2`|压缩文件为 `.bz2`|`bzip2 [-option] [文件]`|--|`/usr/bin/bzip2`|所有用户|

**【选项】**

- `-k` 产生压缩文件后保留原文件（默认不保留）


**【示例】**

```bash
[root@daijf test1]# bzip2 -k b.txt
[root@daijf test1]# ls
a.txt.bz2  b.txt  b.txt.bz2  test2
```

## bunzip2

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`bunzip2`|将 `.bz2` 文件进行解压|`bunzip2 [-option] [压缩文件]`|--|`/usr/bin/bunzip2`|所有用户|

**【选项】**

- `-k` 解压后保留原文件（默认不保留）

**【示例】**

```bash
[root@daijf test1]# bunzip2 -k test2.tar.bz2 

[root@daijf test1]# ls
a.txt.bz2  b.txt  b.txt.bz2  test2.tar  test2.tar.bz2
```

```bash
[root@daijf test1]# bunzip2 test2.tar.bz2 
[root@daijf test1]# ls
a.txt.bz2  b.txt  b.txt.bz2  test2.tar
```

## tar

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`tar`|打包或压缩目录为|`tar [-option] [打包后文件名][待打包目录]`|--|`/bin/tar`|所有用户|

**【选项】**

- `-c`、`--create` 打包
- `-v` 显示详细信息（即 `--verbose`）
- `-f` 指定文件名
- `-C <目的目录>`、`--directory=<目的目录>` 切换到指定的目录
- `-z`、`--gzip`、`--ungzip` 通过 `gzip` 指令处理备份文件（压缩或解压）
- `-x` 解压
- `j` 通过 `bzip2` 处理文件（压缩或解压）

**【示例】**

打包文件：

```bash
# 打包后，原目录 test1 还在
[root@daijf test]# tar -cvf test1.tar test1
test1/
test1/renamemv123.properties
test1/123.txt.soft
test1/hello.txt
test1/123.txt
test1/123.txt.hard

[root@daijf test]# ls
test1  test1.tar  test2  test3

# 将打包后的文件进行压缩
[root@daijf test]# gzip test1.tar 

[root@daijf test]# ls
test1  test1.tar.gz  test2  test3

# 将多个文件进行打包
tar -cvf back.tar test1 abc.txt a.txt
```

打包的同时，使用 `gzip` 进行压缩（注意 `-z` 需要在前面，`-f` 需要在最后）：

```bash
[root@daijf test]# tar -zcf test1.tar.gz test1

[root@daijf test]# ls
test1  test1.tar.gz  test2  test3
```

解压 `.gz` 文件（默认解压到当前路径，且是解压到 test1 目录）：

```bash
[root@daijf test]# tar -zxf test1.tar.gz 

test1  test1.tar.gz  test2  test3
```

解压时指定解压路径：

```bash
# 解压到 /usr/local/djfapp/test/test1/
[root@daijf test]# tar -zxf test1.tar.gz -C /usr/local/djfapp/test/test1/
```

打包的同时，使用 `bzip2` 进行压缩（注意 `-j` 需要在前面，`-f` 需要在最后）：

```bash
[root@daijf test1]# tar -jcf test2.tar.bz2 test2

[root@daijf test1]# ls
test2  test2.tar.bz2
```

解压 `.bz2` 文件：

```bash
[root@daijf test1]# tar -xjf test2.tar.bz2 

[root@daijf test1]# ls
a.txt.bz2  b.txt  b.txt.bz2  test2  test2.tar.bz2
```

## zip

Linux 和 Windows 都支持 zip 格式的压缩包。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`zip`|压缩文件或目录为 `.zip`|`zip [-option] [压缩后文件名][待压缩文件或目录]`|--|`/usr/bin/zip`|所有用户|

**【选项】**

- `-d <目标目录>` 指定文件压缩后所要存储的目录
- `-q <压缩包名称>` 静默模式，不输出压缩信息
- `-r <压缩后的文件名> 原目录` 压缩目录

**【示例】**

压缩文件（压缩后，原文件还在）：

```bash
[root@daijf test1]# zip hello.zip hello.txt
  adding: hello.txt (stored 0%)
  
[root@daijf test1]# ls
123.txt  123.txt.hard  123.txt.soft  hello.txt  hello.zip  renamemv123.properties  test1
```

压缩目录：

```bash
[root@daijf test1]# zip -r test1.zip test1
  adding: test1/ (stored 0%)
  adding: test1/renamemv123.properties (stored 0%)
  adding: test1/123.txt.soft (deflated 8%)
  adding: test1/hello.txt (stored 0%)
  adding: test1/123.txt (deflated 8%)
  adding: test1/123.txt.hard (deflated 8%)
  
[root@daijf test1]# ls
123.txt  123.txt.hard  123.txt.soft  hello.txt  hello.zip  renamemv123.properties  test1  test1.zip
```

## unzip

unzip 命令不一定是默认安装的，可能需要手动安装。

**Debian/Ubuntu 系统**：

```bash
sudo apt install unzip
```

**CentOS/RHEL 系统**：

```bash
sudo yum install unzip
```

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`unzip`|解压 `.zip` 文件|`unzip [-option] [压缩包]`|--|`/usr/bin/unzip`|所有用户|

**【选项】**

- `-d <目标目录>` 指定文件解压后所要存储的目录
- `-l <压缩包名称>` 列出压缩包中的文件，而不解压
- `-q <压缩包名称>` 静默模式，不输出解压信息

**【示例】**

`unzip` 会直接将压缩包中的内容解压到当前目录：

```bash
[root@daijf test1]# unzip test1.zip 
Archive:  test1.zip
   creating: test1/
 extracting: test1/renamemv123.properties  
  inflating: test1/123.txt.soft      
 extracting: test1/hello.txt         
  inflating: test1/123.txt           
  inflating: test1/123.txt.hard     
  
[root@daijf test1]# ls
123.txt  123.txt.hard  123.txt.soft  hello.txt  hello.zip  renamemv123.properties  test1  test1.zip
```

解压到指定目录：

```bash
# 解压到 ./test1/ 目录下
[root@daijf test]# unzip test2.zip -d test1/
```

查看压缩包内容（不解压）：

```bash
[root@daijf test1]# unzip -l test1.zip
```

静默解压（不显示输出信息）：

```bash
[root@daijf test1]# unzip -q test1.zip -d test1/
```

**压缩比率：`bzip2` > `gzip` > `zip`**。
