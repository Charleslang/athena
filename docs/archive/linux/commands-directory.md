# 目录处理命令

## ls

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`ls`|显示目录、文件信息|`ls [选项] [文件或目录]`|list|`/bin/ls`|所有用户|

**【选项】**

- `-a` 显示所有文件及目录，包括所有隐藏文件（在 Linux 中，以 `.` 开头的是隐藏文件。等价于 `--all`）
- `-d` 显示目录本身的信息，而不是目录下的所有其它文件或目录（一般需要配合 `-l` 来使用，即 `ls -ld`）
- `-h` 以更加易于理解的方式显示输出（`h` 即 `human`，通常用于查看文件的大小）
- `-i` 查看文件的唯一索引表示（Linux 是通过文件的索引来查找文件的，具体用处后面会讲）
- `-l` 除文件名称外，还将文件型态、权限、拥有者、文件大小等资讯详细列出（`l` 即 `long`，长格式。`ls -l` 等价于 `ll`）
- `-r` 将文件以按照英文字母倒序显示（即从 z 开始）（默认是按照英文字母升序显示）
- `-t` 将文件依建立时间的先后次序列出
- `-A` 同 `-a`，但不列出 "." （目前目录）及 ".." （父目录）
- `-F` 在列出的文件名称后加一符号；例如可执行则加 "*"，目录则加 "/"
- `-R` 若目录下有文件，则还会列出目录下的文件以及目录（只有一级，而不是多级）


**【示例】**

列出根目录下的所有目录：

```bash
ls /
bin               dev   lib         media  net   root     srv  upload  www
boot              etc   lib64       misc   opt   sbin     sys  usr
home  lost+found  mnt    proc  selinux  tmp  var
```

列出当前目录下所有以 s 开头的文件，越新的排越后面：

```bash
ls -ltr s*
```

列出 `/bin` 目录下所有目录及文件详细资料：

```bash
ls -lR /bin
```

列出目前目录下所有文件及目录（如果是目录，则后面会以 "/" 结尾；如果是可执行文件，则后面会以 "*" 结尾）：

```bash
ls -AF
00-RELEASENOTES  CONDUCT       COPYING  dump.rdb  .gitignore  Makefile   README.md       redis.conf  runtest*          runtest-moduleapi*  sentinel.conf  tests/  utils/
BUGS             CONTRIBUTING  deps/    .github/  INSTALL     MANIFESTO  redis.bak.conf  redis.log   runtest-cluster*  runtest-sentinel*   src/           TLS.md
```

```bash
ls -RF
.:
client_body_temp/  conf/  fastcgi_temp/  html/  logs/  proxy_temp/  sbin/  scgi_temp/  uwsgi_temp/

./client_body_temp:

./conf:
fastcgi.conf          fastcgi_params          koi-utf  mime.types          nginx.conf          scgi_params          uwsgi_params          win-utf
fastcgi.conf.default  fastcgi_params.default  koi-win  mime.types.default  nginx.conf.default  scgi_params.default  uwsgi_params.default

./fastcgi_temp:

./html:
50x.html  demo/  index.html

./html/demo:
index1.css  index1.html  index2.css  index2.html  index.css  index.html  index.js

./logs:
access.log  error.log  nginx.pid

./proxy_temp:

./sbin:
nginx*  nginx.old*

./scgi_temp:

./uwsgi_temp:
```

如果只单独执行 `ls` 命令，不加任何参数，则会列出当前目录下的文件以及子目录。需要注意的是，如果没有进入任何目录，而是直接执行 `ls`，那么会列出当前用户“家目录”下的文件及子目录。什么是“家目录”呢？对于 root 用户来讲，就是 `/root/` 目录，对于普通用户来讲，就是 `/home/${username}/` 目录，这个后面会讲到。

通过 `ls -l` 或者 `ll` 命令可以查看文件或目录的权限信息，如下：

```bash
ls -lh

total 36K
drwx------ 2 nobody root 4.0K Aug  9  2021 client_body_temp
drwxr-xr-x 2 root   root 4.0K Jul 24 23:42 conf
drwx------ 2 nobody root 4.0K Aug  9  2021 fastcgi_temp
drwxr-xr-x 3 root   root 4.0K Sep 18  2021 html
drwxr-xr-x 2 root   root 4.0K Jul 24 21:47 logs
drwx------ 2 nobody root 4.0K Aug  9  2021 proxy_temp
drwxr-xr-x 2 root   root 4.0K Sep 18  2021 sbin
drwx------ 2 nobody root 4.0K Aug  9  2021 scgi_temp
drwx------ 2 nobody root 4.0K Aug  9  2021 uwsgi_temp
```

以 `drwxr-xr-x 2 root root 4096 Jul 24 23:42 conf` 为例，解释如下：

- `drwxr-xr-x` 表示文件的权限信息（在权限部分细说）。
- `2` 表示该目录被引用 2 次。
- `root` 表示该目录的所有者是 root 用户（一个文件只能有一个所有者，一般情况下，文件的所有者就是文件的创建人）。
- `root` 表示该目录的所属组是 root 组（一个文件只能有一个所属组，只要用户在这个所属组下面，那么用户就继承了组的权限）。
- `4096` 表示文件大小，单位是字节。
- `Jul 24 23:42` 文件最近一次修改时间，默认是创建时间。
- `conf` 文件或者目录名称。

## mkdir

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`mkdir`|创建新目录|`mkdir [-p] [目录名]`|make directories|`/bin/mkdir`|所有用户|

**【选项】**   

- `-p` 递归创建。当父目录不存在时，自动创建父目录。

**【示例】**

一次创建一个目录：

```bash
cd /tmp

mkdir -p /tmp/Japan/boduo

ls -R
```

一次创建多个目录：

```bash
mkdir -p /tmp/Japan/longze /tmp/Japan/cangjing
```

## rmdir

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`rmdir`|删除空目录|`rmdir [目录名]`|remove empty directories|`/bin/rmdir`|所有用户|

`rmdir` 默认只能删除空目录，如果要删除的目录非空，则需要先删除该目录下的所有目录或文件。所以该命令用得不多，一般使用 `rm` 命令来进行删除。

## rm

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`rm`|删除文件或目录|`rm -rf[文件或目录]`|remove|`/bin/rm`|所有用户|

**【选项】**

- `r` 递归删除（用于删除目录）
- `f` 强制删除

**【示例】**

删除文件：

```bash
rm abc.properties 
rm: remove regular empty file ‘abc.properties’? y
```

强制删除（即不需要系统每次确认）：

```bash
rm -f abc.properties 
```

删除目录（必须加上 `-r` 选项）：

```bash
rm -rf abc
```

## cd

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`cd`|切换目录|`cd [目录名]`|change directory|shell 内置命令|所有用户|


目录可以是绝对路径或相对路径。

## pwd

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`pwd`|显示当前目录绝对路径|`pwd`|print working directory|`/bin/pwd`|所有用户|

## cp

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`cp`|复制文件或目录|`cp [-rp] [原文件或目录] [目标目录]`|copy|`/bin/cp`|所有用户|


**【选项】**

- `-r` 复制目录
- `-p` 保留文件属性

**【示例】**

复制文件：

```bash
# 将 ./test2/test2/abc.properties 复制到 test1 目录下
cp ./test2/test2/abc.properties test1

# 查看复制后的结果
ls -R
.:
test1  test2

./test1:
abc.properties

./test2:
test2

./test2/test2:
abc.properties
```

复制目录（必须加上 `-r` 选项）：

```bash
# 将 test2 下面的 test2 目录复制到 test1 目录下
cp ./test2/test2/ -r test1
ls -R
.:
test1  test2

./test1:
abc.properties  test2

./test1/test2:
abc.properties

./test2:
test2

./test2/test2:
abc.properties
```

同时复制多个文件到同一个目录：

```bash
# 将 123.properties 和 456.properties 复制到 test1 目录中
cp ./test2/test2/123.properties ./test2/test2/456.properties test1
```

复制时保留文件属性（如文件的最后修改时间）：

```bash
cp -p ./test2/test2/123.properties ./test2/test2/456.properties test1
```

复制的同时修改复制后的文件或目录名：

```bash
# 将 test2 下面的 test2 目录复制到 test1 中，并且重命名为 cptest2
cp -r test2/test2 test1/cptest2

# 将 123.properties 复制到 test1 中，并且重命名为 cp123.properties
cp test2/test2/123.properties test1/cp123.properties
```

## mv

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`mv`|移动文件或目录（剪切）、重命名文件或目录|`mv [原文件或目录] [目标文件或目录]`|move|`/bin/mv`|所有用户|


**【示例】**

移动单个目录或文件：

```bash
# 将 test2 下面的 test2 目录移动到 test1 目录下
mv test2/test2 test1
ls -R
.:
test1  test2  test3

./test1:
test2

./test1/test2:
123.properties  456.properties  abc.properties

./test2:
```

```bash
# 将 123.properties 移动到 test1 目录下
mv test2/test2/123.properties test1
ls test1
123.properties
```

移动多个目录或文件：

```bash
# 将 abc.properties 和 456.properties 移动到 test1 目录下
mv test2/test2/abc.properties test2/test2/456.properties test1
```

移动并重命名：

```bash
# 将 123.properties 移动到 test1 目录下，并重命名为 mv123.properties
mv test2/test2/123.properties test1/mv123.properties
```

修改文件名（其实相当于在同一个目录中进行文件的移动）：

```bash
mv test1/mv123.properties test1/renamemv123.properties
```

## touch

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`touch`|创建空文件（只能创建文件、不能创建目录）|`touch [文件名]`|--|`/bin/touch`|所有用户|

**【示例】**

创建单个文件：

```bash
# 创建 abc.txt
touch abc.txt
```

创建多个文件：

```bash
touch abc.txt 123.yaml
```

在 Linux 中，如果想要创建含有特殊字符的文件，需要使用 `""`，如下（但是不建议这样做）：

```bash
touch "program fiels.abc"
```

如果使用 `touch` 命令操作一个已经存在的文件，那么不会再次新建文件，而会修改这个文件的最后一次修改时间。


## cat

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`cat`|显示文件全部内容|`cat [-n] [文件名]`|--|`/bin/cat`|所有用户|

**【选项】**  

- `-n` 显示行号
- `-A` 显示隐藏字符，如回车符

**【示例】**

```bash
cat renamemv123.properties 
name=zs
age=123

cat -n renamemv123.properties 
1	name=zs
2	age=123
```

:::warning
`cat` 命令是将文件的所有内容全部显示出来，对于大文件来讲，我们只能通过 `cat` 命令看到最后一页。如果文件内容较多，可能造成 CPU 飙高，系统卡死，所以不推荐直接使用该命令来查看大文件。
:::

## tac

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`tac`|显示文件全部内容（反向显示，和 `cat` 命令的显示相反）|`tac [文件名]`|--|`/usr/bin/tac`|所有用户|

## more

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`more`|分页显示文件内容|`more [文件名]`|--|`/usr/bin/more`|所有用户|

:::tip
使用 <kbd>空格</kbd> 或 <kbd>F</kbd> 进行翻页，使用 <kbd>Enter</kbd> 查看下一行，使用 <kbd>q</kbd> 或 <kbd>Q</kbd> 退出。
:::

**【示例】**

```bash
more 123.txt
```

:::warning 注意
more` 命令只能往后翻，不能往前翻。
:::

## less

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`less`|分页显示文件内容（可向前翻页）|`less [文件名]`|--|`/usr/bin/less`|所有用户|

:::tip 
1. 使用 <kbd>空格</kbd> 或 <kbd>F</kbd> 进行翻页，使用 <kbd>Enter</kbd> 查看下一行，使用 <kbd>q</kbd> 或 <kbd>Q</kbd> 退出，使用 <kbd>PgUp</kbd> 向前翻页，使用 <kbd>↑</kbd> 向前翻一条。  

2. `less` 命令在查看过程中可以使用 `/` 进行搜索，按下 `/` 后输入要查找的关键词，然后回车即可搜索，按 `n` 表示继续搜索下一条，按 `N` 表示向前搜索。
:::

**【示例】**

```bash
less 123.txt
```

:::tip
日常开发过程中，`less` 命令使用较多。
:::

## head

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`head`|显示文件前面几行|`head [-n] [文件名]`|--|`/usr/bin/head`|所有用户|

**【选项】**

- `-n` 指定行数，不指定 `-n` 则默认显示前 10 行

**【示例】**

```bash
head -n 20 letc/services
```

## tail

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`tail`|显示文件末尾几行|`tail [-nf] [文件名]`|--|`/usr/bin/tail`|所有用户|

**【选项】**

- `-n` 指定行数，不指定 `-n` 则默认显示最后 10 行
- `-f` 动态显示文件末尾的行（一直监听文件变化，如果文件发生修改，则显示最后的几行）

**【示例】**

```bash
tail -n 20 letc/services

tail -f letc/services
```

## ln

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`ln`|生成链接文件|`ln -s [原文件] [目标文件]`|link|`/bin/ln`|所有用户|

**【选项】**

- `-s` 创建软链接（不指定 `-s` 就是硬链接）

**【示例】**

创建软链接和硬链接：

```bash
# 创建硬链接
ln 123.txt 123.txt.hard

# 创建软链接
ln -s 123.txt 123.txt.soft

ls -l
total 12
-rw-r--r-- 2 root root 210 Aug 13 17:36 123.txt
-rw-r--r-- 2 root root 210 Aug 13 17:36 123.txt.hard
lrwxrwxrwx 1 root root   7 Aug 13 18:11 123.txt.soft -> 123.txt
```

**软链接特性：**

1. 创建的软链接的权限为所有用户都可以执行（所有软链接都是如此）。软链接类似于 Windows 的快捷方式，相当于一个指针。虽然该软链接所有人都可以执行，但是在执行时，还需要找到链接的原文件进行执行。即最终执行的还是原文件，而并不是所有人都有原文件的执行权限。

2. 软链接占用的空间很小，因为它只是一个指向原文件的链接而已。  

3. 软链接指向原文件。

4. 如果原文件被删除，那么软链接也会被自动删除。

5. 访问软链接时，实际访问的是软链接对应的原文件。

6. 软链接可以跨分区。

7. 软链接可以针对目录使用。

8. 什么时候可以使用软链接？和 Windows 一样，什么时候使用快捷方式就可以什么时候使用软链接。

**硬链接特性：**  

1. 硬链接相当于使用 `cp -p` 命令将原文件复制一份，但是通过硬链接生成的文件，它的内容会和原文件进行双向同步。如果原文件做了修改，那么通过硬链接生成的文件的内容也会被同步修改；如果硬链接中的文件内容被修改，那么原文件内容也会同步修改。

2. 如果原文件被删除，那么硬链接文件是不会被删除的。

3. 通过硬链接生成的文件，它的 i 节点和原文件是相同的。正是因为如此，所以修改硬链接和原文件其中任何一个文件，它们的内容都会进行同步（因为 Linux 修改文件时，是针对 i 节点进行修改的）。

    ```bash
    # 查看文件的 i 节点
    ls -i
    1325877 123.txt  1325877 123.txt.hard  1325870 123.txt.soft
    ```

4. 不能跨分区

5. 不能针对目录使用
