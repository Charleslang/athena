<!-- # 简介
## 第一部分
### 子标题
#### 子标题

```java
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}
```
```js
consloe.log('123')
```
```css
body {
  color: #fff;
}
```


![hhh](/images/avatar.jpg)

使用 `npm install` 快速安装。

## 第二部分 -->

# Linux 命令

Linux 中，命令的格式为：`command [-option] [params]`。 

> **说明**  
> 1. 个别命令使用不遵循此格式。
> 2. 当有多个选项时，可以写在一起，一般情况下，选项的顺序没有要求。如 `ls -al` 与 `ls -la` 等价。
> 3. 简化选项与完整选项。如 `-a` 等于 `--all`。完整选项一般使用两个 `-` 来指定。

推荐几个 Linux 命令大全网站（其实网上有很多）：

1. [linux-command](https://github.com/jaywcjlove/linux-command)
2. [Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)
3. [Linux 命令大全(手册)](https://www.linuxcool.com/)

## 目录处理命令

### `ls`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`ls`|显示目录、文件信息|`ls [选项] [文件或目录]`|list|`/bin/ls`|所有用户

**选项：**  

- `-a` 显示所有文件及目录（包括所有隐藏文件，在 Linux 中，以 `.` 开头的是隐藏文件）(等价于 `--all`)
- `-d` 显示目录本身的信息，而不是目录下的所有其它文件或文件夹（一般需要配合 `-l` 来使用，即 `ls -ld`）
- `-h` 以更加易于理解的方式显示输出（`h` 即 `human`，通常用于查看文件的大小）
- `-i` 查看文件的唯一索引表示（Linux 是通过文件的索引来查找文件的，具体用处后面会讲）
- `-l` 除文件名称外，还将文件型态、权限、拥有者、文件大小等资讯详细列出（`l` 即 `long`，长格式。`ls -l` 等价于 `ll`）
- `-r` 将文件以按照英文字母倒序显示（即从 z 开始）（默认是按照英文字母升序显示）
- `-t` 将文件依建立时间的先后次序列出
- `-A` 同 -a ，但不列出 "." （目前目录）及 ".." （父目录）
- `-F` 在列出的文件名称后加一符号；例如可执行则加 "*", 目录则加 "/"
- `-R` 若目录下有文件，则还会列出目录下的文件以及文件夹（只有一级，而不是多级）

**示例：**

列出根目录（/）下的所有目录：
```bash
# ls /
bin               dev   lib         media  net   root     srv  upload  www
boot              etc   lib64       misc   opt   sbin     sys  usr
home  lost+found  mnt    proc  selinux  tmp  var
```

列出目前工作目录下所有名称是 s 开头的文件，越新的排越后面：
```bash
ls -ltr s*
```

将 `/bin` 目录以下所有目录及文件详细资料列出：
```bash
ls -lR /bin
```

列出目前工作目录下所有文件及目录；目录于名称后加 "/", 可执行档于名称后加 "*"：
```bash
ls -AF
```
```bash
[root@daijf nginx]# ls -RF
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

如果只是单独执行 `ls` 命令，不加任何参数，则会列出当前目录下的文件以及文件夹。需要注意的是，如果没有进入任何文件夹下，而是直接执行 `ls`，那么会列出当前用户“家目录”下的文件及文件夹。什么是“家目录”呢？对于 root 用户来讲，就是 `/root/` 目录，对于普通用户来讲，就是 `/home/${username}/` 下面的目录，这个后面会讲到。


通过 `ls -l` 或者 `ll` 命令可以查看文件或文件夹的权限信息，如下：

```bash
# ls -lh
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

- `drwxr-xr-x` 表示文件的权限信息（在权限部分细说）
- `2` 表示该文件夹被引用 2 次
- `root` 表示该文件夹的所有者是 root 用户（一个文件只能有一个所有者，一般情况下，文件的所有者就是文件的创建人）
- `root` 表示该文件夹的所属组是 root 组（一个文件只能有一个所属组，只要用户在这个所属组下面，那么用户就继承了组的权限）。
- `4096` 表示文件大小，单位为字节。
- `Jul 24 23:42` 文件最近一次修改时间，默认是创建时间。
- `conf` 文件名

### `mkdir`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`mkdir`|创建新目录|`mkdir [-p] [目录名]`|make directories|`/bin/mkdir`|所有用户

**选项：**   

- `-p` 递归创建。用于当父目录不存在时，自动创建父目录。

**示例：**

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

### `rmdir`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`rmdir`|删除空目录|`rmdir [目录名]`|remove empty directories|`/bin/rmdir`|所有用户

`rmdir` 默认只能删除空目录，如果当前要删除的目录非空，则需要先删除该目录下的所有目录或文件。所以该命令用得不多，一般使用 `rm` 命令来进行删除。

### `rm`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`rm`|删除文件或目录|`rm -rf[文件或目录]`|remove|`/bin/rm`|所有用户

**选项：**

- `r` 递归删除（用于删除目录）
- `f` 强制删除

**示例：**

删除文件：
```bash
[root@daijf test1]# rm abc.properties 
rm: remove regular empty file ‘abc.properties’? y
```
强制删除（即不需要系统每次确认）：
```bash
[root@daijf test1]# rm -f abc.properties 
```
删除目录（必须加上 `-r` 选项）：
```bash
[root@daijf test1]# rm -rf abc
```

### `cd`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`cd`|切换目录|`cd [目录名]`|change directory|shell 内置命令|所有用户


目录可以是绝对地址或相对路径。

### `pwd`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`pwd`|显示当前目录绝对路径|`pwd`|print working directory|`/bin/pwd`|所有用户


### `cp`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`cp`|复制文件或目录|`cp [-rp] [原文件或目录] [目标目录]`|copy|`/bin/cp`|所有用户


**选项：**

- `-r` 复制目录
- `-p` 保留文件属性

**示例：**

复制文件：
```bash
# 将 ./test2/test2/abc.properties 复制到 test1 目录下
[root@daijf test]# cp ./test2/test2/abc.properties test1

# 查看复制后的结果
[root@daijf test]# ls -R
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
[root@daijf test]# cp ./test2/test2/ -r test1
[root@daijf test]# ls -R
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

### `mv`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`mv`|移动文件或目录（剪切）、重命名文件或目录|`mv [原文件或目录] [目标文件或目录]`|move|`/bin/mv`|所有用户


**示例：**

移动单个目录或文件：

```bash
# 将 test2 下面的 test2 目录移动到 test1 目录下
[root@daijf test]# mv test2/test2 test1
[root@daijf test]# ls -R
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
[root@daijf test]# mv test2/test2/123.properties test1
[root@daijf test]# ls test1
123.properties
```

移动多个目录或文件：
```bash
# 将 abc.properties 和 456.properties 移动到 test1 目录下
[root@daijf test]# mv test2/test2/abc.properties test2/test2/456.properties test1
```
移动并重命名：
```bash
# 将 123.properties 移动到 test1 目录下，并重命名为 mv123.properties
[root@daijf test]# mv test2/test2/123.properties test1/mv123.properties
```
修改文件名（其实相当于在同一个文件夹中进行文件的移动）：
```bash
[root@daijf test]# mv test1/mv123.properties test1/renamemv123.properties
```

### `touch`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`touch`|创建空文件（只能创建文件、不能创建文件夹）|`touch [文件名]`|--|`/bin/touch`|所有用户

**示例：**

创建单个文件：
```bash
# 创建 abc.txt
touch abc.txt
```
创建多个文件：
```bash
touch abc.txt 123.yaml
```
注意，在 Linux 中，如果想要创建含有特殊字符的文件，需要使用 `""`，如下（但是不建议这样做）：
```bash
touch "program fiels.abc"
```

> **注意**  
> 如果使用 `touch` 命令操作一个已经存在的文件，那么不会再次新建文件，而会修改这个文件的最后一次修改时间。

### `cat`
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`cat`|显示文件全部内容|`cat [-n] [文件名]`|--|`/bin/cat`|所有用户

**选项：**  
- `-n` 显示行号
- `-A` 显示隐藏字符，如回车符

**示例：**
```bash
[root@daijf test1]# cat renamemv123.properties 
name=zs
age=123

[root@daijf test1]# cat -n renamemv123.properties 
1	name=zs
2	age=123
```

> **注意：**
> `cat` 命令是将文件的所有内容全部显示出来，对于大文件来讲，我们只能通过 `cat` 命令看到最后一页。如果文件内容较多，可能造成 CPU 飙高，系统卡死，所以不推荐直接使用该命令来查看大文件。


### `tac`
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`tac`|显示文件全部内容（反向显示，和 `cat` 命令的显示相反）|`tac [文件名]`|--|`/usr/bin/tac`|所有用户


### `more`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`more`|分页显示文件内容|`more [文件名]`|--|`/usr/bin/more`|所有用户


> **提示**  
> 使用空格或 f 进行翻页，使用回车查看下一行，使用 q 或 Q 退出。

**示例：**

```bash
more 123.txt
```

> **注意**  
> `more` 命令之后往后翻，不能往前翻。


### `less`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`less`|分页显示文件内容（可向前翻页）|`less [文件名]`|--|`/usr/bin/less`|所有用户


> **提示**  
> 使用空格或 f 进行翻页，使用回车查看下一行，使用 q 或 Q 退出，使用 PgUp 向前翻页，使用 ↑ 向前翻一条。  
> `less` 命令在查看过程中可以使用 `/` 进行搜索，按下 `/` 后输入要查找的关键词，然后回车即可搜索，按 `n` 表示继续搜索下一条，按 `N` 表示向前搜索。

**示例：**

```bash
less 123.txt
```

> **提示**  
> 开发中，`less` 命令使用较多。

### `head`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`head`|显示文件前面几行|`head [-n] [文件名]`|--|`/usr/bin/head`|所有用户

**选项：**
- `-n` 指定行数（不指定 `-n` 则默认显示前 10 行）

**示例：**
```bash
head -n 20 letc/services
```

### `tail`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`tail`|显示文件末尾几行|`tail [-nf] [文件名]`|--|`/usr/bin/tail`|所有用户

**选项：**
- `-n` 指定行数（不指定 `-n` 则默认显示最后 10 行）
- `-f` 动态显示文件末尾的行（一直监听文件变化，如果文件发生修改，则显示最后的几行）

**示例：**
```bash
tail -n 20 letc/services

tail -f letc/services
```

### `ln`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`ln`|生成链接文件|`ln -s [原文件] [目标文件]`|link|`/bin/ln`|所有用户

**选项：**

- `-s` 创建软链接（不指定 `-s` 就是硬链接）

**示例：**

创建软连接和硬链接：
```bash
# 创建硬链接
[root@daijf test1]# ln 123.txt 123.txt.hard

# 创建软连接
[root@daijf test1]# ln -s 123.txt 123.txt.soft

[root@daijf test1]# ls -l
total 12
-rw-r--r-- 2 root root 210 Aug 13 17:36 123.txt
-rw-r--r-- 2 root root 210 Aug 13 17:36 123.txt.hard
lrwxrwxrwx 1 root root   7 Aug 13 18:11 123.txt.soft -> 123.txt
```
软链接特性：

1. 可以看到，我们创建的软链接的权限为所有用户都可以执行（所有软链接都是如此）。软链接类似于 Windows 的快捷方式，相当于一个指针，虽然该软链接所有人都可以执行，但是在执行时，还需要找到链接的原文件进行执行。即最终执行的还是原文件，而并不是所有人都有原文件的执行权限。

2. 软链接占用的空间很小，因为它只是一个指向原文件的链接而已。  

3. 软链接指向原文件。
4. 如果原文件被删除，那么软链接也会被删除。
5. 访问软链接时，实际访问的是软链接对应的原文件。
6. 软链接可以跨分区。
7. 软链接可以针对目录使用。
8. 什么时候可以使用软链接？和 Windows 一样，什么时候使用快捷方式就可以什么时候使用软链接。

硬链接特性：  

1. 硬链接相当于使用 `cp -p` 命令将原文件复制一份，但是通过硬链接生成的文件，它的内容会和原文件进行双向同步。如果原文件做了修改，那么通过硬链接生成的文件的内容也会被同步修改；如果硬链接中的文件内容被修改，那么原文件内容也会同步修改。
2. 如果原文件被删除，那么硬链接文件是不会被删除的。
3. 通过硬链接生成的文件，它的 i 节点和原文件是相同的，正是因为如此，所以修改硬链接和原文件其中任何一个文件，它们的内容都会进行同步（因为 Linux 修改文件时，是针对 i 节点进行修改的）。

    ```bash
    # 查看文件的 i 节点
    [root@daijf test1]# ls -i
    1325877 123.txt  1325877 123.txt.hard  1325870 123.txt.soft
    ```
4. 不能跨分区
5. 不能针对目录使用


## 权限管理命令

**只有两种用户可以更改文件的权限，即该文件的所有者或 root 用户。**

### `chmod`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`chmod`|改变文件或目录权限|`chmod [{ugoa}{+-=}{rwx}] [文件或目录]`<br>`chmod [mode=421] [文件或目录]`|change the permissions mode of a file|`/bin/chmod`|文件所有者或 root 用户

**选项：**  
- `-R` 递归修改

**解释：**
- `u`，所有者 user
- `g`，所属组 group
- `o`，其它人 others
- `a`，全部 all（即 ugo）
- `+`，追加权限
- `-`，减少权限
- `=`，不管之前是什么权限，都需要变成当前赋予的权限
- `r`，读权限（read）
- `w`，写权限（write）
- `x`，可执行权限（execute）

**示例：**

查看 `123.txt` 这个文件当前的权限：
```bash
[root@daijf test1]# ls -l 123.txt
-rw-r--r-- 2 root root 20 Aug 13 18:24 123.txt
```
可以看到，`123.txt` 这个文件当前的所有者是 root，所属组是 root，且所有者拥有读写权限，所属组有读的权限，其他人有读的权限。

现在，给 `123.txt` 这个文件的所有者追加可执行权限：
```bash
# 给 123.txt 这个文件的所有者追加可执行权限
[root@daijf test1]# chmod u+x 123.txt

[root@daijf test1]# ls -l 123.txt
-rwxr--r-- 2 root root 20 Aug 13 18:24 123.txt
```
给 `123.txt` 这个文件的所属组增加写权限，同时，去掉其他人的读权限：
```bash
# 给 123.txt 这个文件的所属组增加写权限，同时，去掉其他人的读权限
[root@daijf test1]# chmod g+w,o-r 123.txt

[root@daijf test1]# ls -l 123.txt
-rwxrw---- 2 root root 20 Aug 13 18:24 123.txt
```
把 `123.txt` 这个文件所属组的权限变成 `rwx`（可读可写可执行）：
```bash
# 把 123.txt 这个文件所属组的权限变成 rwx
[root@daijf test1]# chmod g=rwx 123.txt

[root@daijf test1]# ls -l 123.txt
-rwxrwx--- 2 root root 20 Aug 13 18:24 123.txt
```
让所有人都有 `123.txt` 这个文件的读权限：
```bash
# 让所有人都有 123.txt 这个文件的读权限
[root@daijf test1]# chmod a+r 123.txt

[root@daijf test1]# ls -l 123.txt
-rwxrwxr-- 2 root root 20 Aug 13 18:24 123.txt
```

但是上面这种方式却不是最常用，一般，我们都是用数字的方式给文件或文件夹授权，看下面的例子。

在演示以数字方式授权之前，我们需要了解各个数字的含义：

- `r` 代表数字 4
- `w` 代表数字 2
- `x` 代表数字 l
- `-` 代表数字 0

这里需要注意的是，在 Linux 中，权限始终是以 `rwx` 的形式来展现的，即对应的数字为 `421`。`421` 对应的十进制为 7，也就是说，Linux 中权限用数字表示的最大值为 7，7 即表示最高权限（可读可写可执行）。例如， `rwxrwxr--` 这个权限用数字表示就是 774。

给 `123.txt` 这个文件的所有者读写权限，所属组读的权限，其他人没有任何权限，以数字形式授权如下：
```bash
[root@daijf test1]# chmod 640 123.txt

[root@daijf test1]# ls -l 123.txt
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt
```

修改文件夹 `a` 的权限为 777，并且该文件夹下所有的子文件、子文件夹都要有 777 权限：
```bash
# -R 表示递归修改。如果不使用 -R，那么只有 a 文件夹有 777 权限，其下面的子文件、子文件夹的权限并不会受影响
chmod -R 777 a
```
---

说到这里，你是否觉得已经了解了 Linux 中的权限，那么，看接下来的这个例子。

1. 使用 root 给 test1 这个文件夹赋予 777 权限（任何人都有可读可写可执行权限）
```bash
[root@daijf test]# whoami
root
[root@daijf test]# chmod 777 test1
[root@daijf test]# ls -ld test1
drwxrwxrwx 2 root root 4096 Aug 13 18:11 test1
```
2. 在 test1 文件夹下面创建一个文件 test.txt
```bash
[root@daijf test]# touch test1/test.txt

# 我们看到，普通用户对 test.txt 只有读权限
[root@daijf test]# ls -l test1/test.txt
-rw-r--r-- 1 root root 0 Aug 13 23:04 test1/test.txt
```
3. 新建一个用户 djf1
```bash
[root@daijf test1]# useradd djf1
[root@daijf test1]# passwd djf1
```
4. 使用 djf1 这个用户登录，并尝试删除 test.txt，能删除成功吗？
```bash
[root@daijf ~]# su djf1
[djf1@daijf root]$ cd /usr/local/djfapp/test
[djf1@daijf test]$ rm -f test1/test.txt 
[djf1@daijf test]$ ls -l test1
total 12
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt.hard
lrwxrwxrwx 1 root root  7 Aug 13 18:11 123.txt.soft -> 123.txt
-rw-r--r-- 1 root root 16 Aug 13 17:22 renamemv123.properties
```

可以看到，竟然删除成功了，这是为什么，普通用户不是只有该文件的读权限吗，为什么可以删除？这因为在 Linux 中，rwx 的含义对于文件和文件夹是不同的。

**对于文件来讲**
- `r` 表示可以读取这个文件的内容，比如使用 `cat`、`more`、`less` 等命令
- `w` 表示可以修改该文件的内容，比如使用 `vim`、`vi` 等命令
- `x` 表示可以执行该文件（如果该文件是脚本的话）

**对于文件夹（目录）来讲**
- `r` 仅表示可以列出文件夹中的内容，比如使用 `ls` 等命令
- `w` 表示可以进入到文件夹中，并且可以对文件夹下面的所有文件进行修改，比如使用 `rm`、`touch`、`mkdir` 等命令
- `x` 表示可以进入该文件夹，比如 `cd` 命令

所以，一般来讲，用户对某个文件夹要么没有权限，要么有 `r` 和 `x` 的权限，不太可能只有 `r` 和 `x` 中的一种权限。

所以，对于上面那个问题，我们有答案了，因为 test1 这个文件夹是所有人都有写权限，那就意味着所有人都可以修改这个文件夹下面的文件。**即文件的权限不一定看文件本身，如果用户有文件所在文件夹的某个权限，那么对该文件夹下面的文件也有相应的权限。如果没有外层文件夹的写权限，那么对文件夹下面的文件也没有写权限（即使对这个文件有写权限也不行）**

### `chown`

**只有 root 用户才能改变文件的所有者。要改变文件的所有者，必须确保该用户是存在的。**

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`chown`|改变文件或目录的所有者|`chown [用户] [文件或目录]`|change file ownership|`/bin/chown`|root 用户

**示例：**

```bash
[root@daijf test]# ls -ld test1
drwxrwxr-x 2 root root 4096 Aug 13 23:07 test1
[root@daijf test]# chown djf1 test1
[root@daijf test]# ls -ld test1
drwxrwxr-x 2 djf1 root 4096 Aug 13 23:07 test1
```

### `chgrp`

**只有 root 用户才能改变文件的所属组。要改变文件的所属组，必须确保该所属组是存在的。**

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`chgrp`|改变文件或目录的所属组|`chgrp [组名] [文件或目录]`|change file group ownership|`/bin/chgrp`|root 用户


**示例：**

```bash
# 添加一个组
[root@daijf test]# groupadd group1

# 改变目录的所属组
[root@daijf test]# chgrp group1 test1
[root@daijf test]# ls -ld test1
drwxrwxr-x 2 djf1 group1 4096 Aug 13 23:07 test1
```

### `umask`
在讲这个命令之前，我们需要先知道一些前置知识。

对于新建的文件，文件的所有者就是文件的创建者，那么新建的文件的所属组又是怎么定义的呢？其实新建文件或文件夹的所属组是通过创建者的缺省组（默认组）来定义的？什么是缺省组？这就是接下来要讲的 `umask` 命令。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`umask`|显示、设置文件的缺省权限|`umask [-S]`|the user file-creation mask|shell 内置命令|所有用户

**选项：**
- `-S` 以 `rwx` 形式显示新建文件或目录缺省权限

**示例：**

```bash
# 可以看到，对于新建的文件或目录，默认是权限是 u=rwx,g=rx,o=rx
# 但是，对于新建的文件来讲，默认情况下，所有人都没有 x 可执行权限（这是 Linux 特意设计的）
[root@daijf test]# umask -S
u=rwx,g=rx,o=rx

# 直接使用 umask
[root@daijf test]# umask

# 第一个 0 是特殊权限（见笔记中的 文件特殊权限）
# 后面的 022 代表 ----w--w-
0022

# 但是直接使用 umask 看到的权限会和 777 做异或运算，运算后得到的值才是真实的值
777 rwx rwx rwx
022 --- -w- -w-
---------------
755 rwx r-x r-x # 和  umask -S 看到的一致
```
当然，我们可以更改新建目录的默认权限。假如，我们想要夹新建文件夹的默认权限修改为 700，即 rwx------，那么我们应该将 umask 的值设置为 077（但是不建议修改 umask 的默认值）。计算方式如下：
```bash
777 rwx rwx rwx
077 --- rwx rwx
---------------
700 rwx --- ---

# 设置 umask 的值为 077
umask 077
```

## 文件搜索命令

注意，不是特别推荐使用文件搜索命令，因为它会占用服务器的资源。如果你的服务器访问量很大，那么需要谨慎使用搜索命令。


### `find`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`find`|文件搜索|`find [搜索范围] [匹配条件]`|--|`/bin/find`|所有用户

**选项：**

- `-name` 根据文件名搜索。区分大小写，且要文件名完全匹配。支持通配符
- `-iname` 根据文件名搜索，不区分大小写
- `-size` 根据文件大小查找
- `-type c` 根据文件类型查找，文件类型 c 的取值如下
    - `d`：目录
    - `c`：字型装置文件
    - `b`：区块装置文件
    - `p`：具名贮列
    - `f`：一般文件
    - `l`：符号连结
    - `s`：socket
- `- cmin [+-]n`：查找在过去 n 分钟内文件属性被修改过的文件
- `- amin [+-]n`：在过去 n 分钟内被读取过
- `- mmin [+-]m`：在过去 n 分钟内文件内容被修改
- `- cnewer file`：查找比文件 file 更新的文件
- `- ctime [+-]n`：查找在过去 n 天内创建的文件
- `- mtime [+-]n`：查找在过去 n 天内修改过的文件
- `-a`：同时满足多个条件
- `-o`：满足任意条件
- `[-exec/-ok command] {} \;`：对查找出来的文件进行操作（注意最后有分号，因为 Linux 中的 \ 表示换行）
- `-inum` 根据 i 节点进行查找（需要配合 `ls -i` 使用）（可以通过此方法来查找文件的硬链接，因为它们的 i 节点是相同的）


**示例：**

根据文件名搜索：
```bash
# 查找 /test1 目录下的 123.txt 文件
find /test1 -name 123.txt

# 如果文件名中包含特殊字符，需要使用引号
find /test1 -name "renamemv123.properties"

# 全盘搜索（不建议使用）
find / -name "renamemv123.properties"
```
模糊搜索（`*` 匹配任意字符，`?` 匹配一个字符）：
```bash
find / -name *.properties

find / -name *conf*

find / -name conf???
```
根据文件大小查找：
```bash
# 查找大于 1M 的文件
# 注意 +、- 后面的单位是数据块，1 个数据块等于 512 字节，即 0.5 KB。
# 1M = 1024 KB = 2048 个数据块
find . -size +2048

# 查找小于 1M 的文件
find . -size -2048

# 查找等于 1M 的文件
find . -size 2048
```
根据文件所有者查找：
```bash
find /home -user djf1
```
根据文件所属组查找：
```bash
find /home -group group1
```
将当前目录及其子目录中的所有文件列出
```bash
find . -type f
```
查找 5 分钟内文件内容被修改过的文件：
```bash
find . -mmin -5
```
查找 5 分钟前文件内容被修改过的文件：
```bash
find . -mmin +5
```
查找大于 1M，小于 5M 的文件：
```bash
find . -size +2048 -a -size -10240
```
在 /etc 下查找 inittab 文件并显示其详细信息：
```bash
find /etc -name inittab -exec ls -1 {} \;

# -ok 会询问要不要执行后面的操作（这里是 ls -1），如果后面执行的是删除操作，那么建议使用 -ok，而不是使用 -exec
find /etc -name inittab -ok ls -1 {} \;
```
通过 i 节点删除文件（通常用于文件名比较特殊的情况，如含有特殊字符时，有时候无法直接使用 `rm -f 文件名` 的形式删除）：
```bash
# 查找 i 节点
ls -l

# 通过 i 节点删除
find . -inum ${i 节点号} -ok rm {} \;
```

### `locate`

`locate` 的效率比 `find` 高。但是，对于新建后的文件，如果马上使用 `locate` 进行查找，其实是找不到，因为 `locate` 在查找时，是通过 `locate` 维护的资料库进行查找的，这个资料库需要同步磁盘上的文件（我们其实不知道什么时候同步）（我们也可以通过执行 `updatedb` 命令来手动更新，但是不推荐，因为手动更新特别浪费资源，尤其是服务器的文件较多时）。而 `find` 是实时查找。

`locate` 命令不会查找 `/tmp` 下的文件。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`locate`|在文件资料库中查找文件|`locate 文件名`|--|`/usr/bin/locate`|所有用户


**选项：**

- `-i` 忽略大小写


**示例：**

```bash
# 本身就是模糊搜索
locate 123
```

### `which`

`which` 通常用于查找命令所在的路径。

存放在 `/bin/`、`/usr/bin/` 目录下的命令是所有用户都可以使用的。

而存放在 `/sbin`、`/usr/sbin/` 目录下的命令只有 root 用户才可以使用。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`which`|搜索命令所在目录及别名信息|`which 命令`|--|`/usr/bin/which`|所有用户


**示例：**
```bash
[root@daijf test1]# which ls
alias ls='ls --color=auto'
	/usr/bin/ls
	
[root@daijf test1]# which chmod
/usr/bin/chmod

[root@daijf test1]# which useradd
/usr/sbin/useradd
```
### `whereis`

`whereis` 和 `which` 的用法和作用是相同的，只不过 `whereis` 可以列出命令所在的帮助文档所在路径。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`whereis`|搜索命令所在目录及别名信息|`whereis 命令`|--|`/usr/bin/whereis`|所有用户

**示例：**

```bash
[root@daijf test1]# whereis cp
# 第二个路径是帮助手册
cp: /usr/bin/cp /usr/share/man/man1/cp.1.gz
```
### `grep`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`grep`|在文件中搜寻字串匹配的**行**并输出|`grep -iv [过滤字符串] [文件]`|--|`/bin/grep`|所有用户

**选项：**

- `-i` 不区分大小写
- `-v` 排除指定字串（这个是排除指定字符串所在的**行**）
- `-n` 显示在文件内的行号
- `-E` 使用正则表达式进行匹配（`egrep` 命令等价于 `grep -E`）
- `--color=auto` 输出内容显示颜色


**示例：**

```bash
# 在 ./123.txt 查找包含 123 的内容
[root@daijf test1]# grep 123 ./123.txt
123hard
123

[root@daijf test1]# grep 123 ./123.txt -n
2:123hard
3:123

# 不看注释
grep -v "//"" ./test.java

# 但是上面的过滤会有问题，因为可能存在注释跟在代码后面的情况，需要使用如下方式来过滤注释
# ^ 表示以 ... 开头的
grep -v ^/ ./test.java
```

## 磁盘相关命令

### `df`
命令名称|功能描述|语法|命令英文原意
---|---|---|---
`df`|查看磁盘信息|`df [选项] [目录]`|Disk Free

**选项：**

- `-a` 显示所有系统文件
- `-B <块大小>`	指定显示时的块大小
- `-h` 以容易阅读的方式显示
- `-H` 以 1000 字节为换算单位来显示
- `-i` 显示索引字节信息
- `-k` 指定块大小为 1 KB
- `-l` 只显示本地文件系统
- `-t <文件系统类型>` 只显示指定类型的文件系统
- `-T` 输出时显示文件系统类型

**示例：**

```bash
# 查看当前目录的磁盘使用情况
[root@djfcentos1 ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        1.9G     0  1.9G   0% /dev
tmpfs           1.9G   24K  1.9G   1% /dev/shm
tmpfs           1.9G  604K  1.9G   1% /run
tmpfs           1.9G     0  1.9G   0% /sys/fs/cgroup
/dev/vda1        79G  8.8G   67G  12% /
tmpfs           379M     0  379M   0% /run/user/0
```

```bash
# 查看磁盘总大小
[root@djfcentos1 ~]# df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G  8.8G   67G  12% /

# 查看指定目录的磁盘使用情况
[root@djfcentos1 ~]# df -h /usr
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        79G  8.8G   67G  12% /
```

### `du`

`du` 命令来自于英文词组“Disk Usage”的缩写，其功能是用于查看文件或目录的大小。人们经常会把 `df` 和 `du` 命令混淆，`df` 是用于查看磁盘或分区使用情况的命令，而 `du` 命令则是用于按照指定容量单位来查看文件或目录在磁盘中的占用情况。

命令名称|功能描述|语法|命令英文原意
---|---|---|---
`du`|查看文件或目录的大小|`du [选项] [目录]`|Disk Usage

**选项：**

- `-a` 显示目录中所有文件大小
- `-k` 以 KB 为单位显示文件大小
- `-m` 以 MB 为单位显示文件大小
- `-g` 以 GB 为单位显示文件大小
- `-h` 以易读方式显示文件大小
- `-s` 仅显示总计

**示例：**

```bash
# 查看档期目录的磁盘使用情况
du -sh

# 查看指定目录的磁盘使用情况
du -sh /usr
```


## 帮助命令
### `man`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`man`|获取帮助信息|`man [命令或配置文件]`|manual|`/usr/bin/man`|所有用户


**示例：**

```sh
# 查看 ls 命令的帮助信息（会调用 less 命令进行显示），和 ls --help 命令差不多
# man 命令的输出可以使用 / 进行搜索，同 less 命令
man ls
```
```bash
# 查看 /etc/services 配置文件的帮助信息，只需写文件名，无需写路径。如果写了路径，则会输出文件的内容
man services
```
在上面，我们已经知道了，如果想要查看配置文件的帮助文档，是不需要写路径的，直接写文件名称就可以了。但是，如果文件名称和系统的命令重叠了，该怎么办呢，看下下面的命令：
```bash
man passwd
```
上面的命令会默认寻找系统的 `passwd` 命令，而不是 `passwd` 配置文件，我们可以使用 `whereis passwd` 进行查看，发现系统中有一个命令叫 `passwd`，而在 `/etc/` 下面有一个配置文件也叫 `passwd`。
```bash
whereis passwd
passwd: /usr/bin/passwd /etc/passwd /usr/share/man/man1/passwd.1.gz
```
我们发现，使用 `whereis` 会出现两个帮助文档，一个是 `passwd.1.gz`，另一个是 `passwd.5.gz`。在 Linux 中，1 表示命令的帮助文档，5 表示配置文件的帮助文档。如果我们想要查看配置文件的帮助文档，应该使用如下命令：
```bash
man 5 passwd
```

当然，有时候我们只想知道命令是干啥用的，这时候，使用 `man` 命令会输出大量无关的内容。我们可以使用 `whatis` 命令来快速知道某个命令的用处。
```bash
[root@daijf ~]# whatis ls
ls (1)               - list directory contents
```
当然，对于配置文件，我们也可以使用 `apropos` 命令来查看该配置文件的作用。
```bash
[root@daijf ~]# apropos services
```

当然，`info` 命令和 `man` 命令也差不多。
```bash
info ls
```

### `help`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`help`|获得Shell内置命令的帮助信息|`help 命令`|--|Shell内置命令|所有用户

**怎么判断一个命令是不是内置命令？**

通过 `type` 命令进行查看。
```bash
[root@daijf ~]# type cd
cd is a shell builtin
```

**示例：**

```bash
help cd
```

## 用户管理命令

### `useradd`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`useradd`|添加新用户|`useradd 用户名`|--|`/usr/sbin/useradd`|root

**示例：**

```bash
useradd djf1
```

### `passwd`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`passwd`|设置用户密码|`passwd 用户名`|--|`/usr/bin/passwd`|所有用户

**示例：**

root 用户修改普通用户的密码（root 用户修改密码时，密码强度可以任意）：
```bash
passwd 用户名
```
普通用户修改自己的密码（密码必须符合一定强度要求）：
```bash
passwd
```
### `who`
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`who`|查看系统当前登录的所有用户|`who`|--|`/usr/bin/who`|所有用户

**示例：**

```bash
[root@daijf ~]# who
root     pts/1        2022-08-16 21:01 (61.157.90.101)

# root 表示登录的用户名
# pts 表示远程登录（使用第三方软件登录），后面的数字代表该用户当前登录的数量
# tty 表示本地登录（不使用第三方软件进行登录）
# 最后一个表示登录时间以及登录的主机 IP（没有 IP 就表示本机登录，即 tty）
```

### `w`
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`w`|查看所有登录用户的详细信息|`w`|--|`/usr/bin/w`|所有用户

**示例：**

```bash
[root@daijf ~]# w
 21:48:12 up 37 days,  1:06,  1 user,  load average: 0.02, 0.05, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/1    61.157.90.101    21:01    4.00s  0.03s  0.00s w
```
其中，第一行的输出如下（等同于执行 `uptime` 命令）：
```bash
# 21:48:12 表示当前用户的登录时间
# up 37 days, 1:06 表示服务器以及连续运行 37 天 1:06（37 天未关机、重启）
# 1 user 表示系统当前有 1 个用户登录
# load average: 0.02, 0.05, 0.05 表示系统过去 1 分钟、5 分钟、15 分钟的负载情况
21:48:12 up 37 days,  1:06,  1 user,  load average: 0.02, 0.05, 0.05

[root@daijf ~]# uptime
21:49:43 up 37 days,  1:08,  1 user,  load average: 0.00, 0.04, 0.05
```
第二行的输出：
```bash
# LOGIN@ 表示登录时间
# IDLE 表示登录后，空闲了多长时间（如果一直在敲命令的话，该时间会很短）
# JCPU 用户执行的操作占用 CPU 的时间
# PCPU WHAT 用户当前执行了什么操作
```
## 压缩解压命令

在这里需要说明一下，Linux 中其实不区分文件的后缀，有没有后缀都一样。给文件加上后缀只是方便我们识别。

### `gzip、gunzip`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`gzip`|将文件压缩为 `.gz` 格式|`gzip [文件]`|--|`/bin/gzip`|所有用户

> **注意**
> `gzip` 只能压缩文件，不能压缩目录。

**示例：**

```bash
# 注意，压缩后 hello.txt 文件将不存在了，直接变成了 hello.txt.gz
gzip hello.txt
```
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`gunzip、gzip -d`|解压缩 `.gz` 的压缩文件|`gunzip[压缩文件]`|GNU unzip|`/bin/gunzip`|所有用户

```bash
# 会直接将 hello.txt.gz 中的文件解压到当前目录
[root@daijf test1]# gunzip hello.txt.gz

# 会直接将 hello.txt.gz 中的文件解压到当前目录
[root@daijf test1]# gzip -d hello.txt.gz
```

### `bzip2、bunzip2`

`bzip2` 只能压缩文件。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`bzip2`|压缩文件为 `.bz2`|`bzip2 [-option] [文件]`|--|`/usr/bin/bzip2`|所有用户

**选项：**

- `-k` 产生压缩文件后保留原文件（默认不保留）


**示例：**

```bash
[root@daijf test1]# bzip2 -k b.txt
[root@daijf test1]# ls
a.txt.bz2  b.txt  b.txt.bz2  test2
```

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`bunzip2`|将 `.bz2` 文件进行解压|`bunzip2 [-option] [压缩文件]`|--|`/usr/bin/bunzip2`|所有用户

**选项：**

- `-k` 解压后保留原文件（默认不保留）

**示例：**

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

### `tar`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`tar`|打包或压缩目录为|`tar [-option] [打包后文件名][待打包目录]`|--|`/bin/tar`|所有用户

**选项：**  
- `-c`、`--create` 打包
- `-v` 显示详细信息（即 `--verbose`）
- `-f` 指定文件名
- `-C <目的目录>`、`--directory=<目的目录>` 切换到指定的目录
- `-z`、`--gzip`、`--ungzip` 通过 `gzip` 指令处理备份文件（压缩或解压）
- `-x` 解压
- `j` 通过 `bzip2` 处理文件（压缩或解压）

**示例：**
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
解压 `.gz` 文件（默认解压到当前路径，且是解压到 test1 文件夹）：
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

### `zip、unzip`

Linux 和 Windows 都支持 zip 格式的压缩包。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`zip`|压缩文件或目录为 `.zip`|`zip [-option] [压缩后文件名][待压缩文件或目录]`|--|`/usr/bin/zip`|所有用户

**选项：**
- `-r` 压缩目录

**示例：**
压缩文件（压缩后，原文件还在）：
```bash
[root@daijf test1]# zip hello.zip hello.txt
  adding: hello.txt (stored 0%)
  
[root@daijf test1]# ls
123.txt  123.txt.hard  123.txt.soft  hello.txt  hello.zip  renamemv123.properties  test1
```
压缩文件夹：
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

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`unzip`|解压 `.zip` 文件|`unzip [-option] [压缩包]`|--|`/usr/bin/unzip`|所有用户

**选项：**

- `-d <目录>` 指定文件解压缩后所要存储的目录。

**示例：**
`unzip` 会直接将压缩包中的内容解压到当前文件夹：
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

---

**压缩比率：`bzip2` > `gzip` > `zip`**。

## 网络命令

### `write`

需要目标用户在线才能进行发送。可以使用 `w` 命令查看当前登录系统的所有用户。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`write`|给用户发信息，以 `Ctrl` + `D` 保存并结束|`write [用户名]`|--|`/usr/bin/write`|所有用户

**示例：**

```bash
write djf1
```

### `wall`

给当前在线的所有用户发送消息。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`wall`|发广播信息，按回车结束|`wall [message]`|write all|`/usr/bin/wall`|所有用户

**示例：**

```bash
wall message
```

### `ping`

Windows 下的 `ping` 命令默认只有 4 次，而 Linux 中默认没有限制（Linux 可以通过 `-c` 选项来指定次数）。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`ping`|测试网络连通性，`Ctrl` + `c` 结束|`ping [-option] [IP/域名]`|write all|`/bin/ping`|所有用户


**选项：**

- `-c` 指定发送次数

**示例：**

```bash
ping www.baidu.com

# time 越小，证明网络越好
PING www.a.shifen.com (112.80.248.76) 56(84) bytes of data.
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=1 ttl=53 time=9.50 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=2 ttl=53 time=9.45 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=3 ttl=53 time=9.50 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=4 ttl=53 time=9.44 ms

# ping 结束后，会出现丢包率。网络正常的情况下，packet loss 为 0%，如果 packet loss 很高，就说明网络有问题。
--- www.a.shifen.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 9.447/9.479/9.508/0.029 ms
```
```bash
ping -c 3 www.baidu.com
```
### `ifconfig`

Windows 中可以使用 `ipconfig` 命令。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`ifconfig`|查看和设置网卡信息|`ifconfig [网卡名称] [IP地址]`|interface configure|`/sbin/ifconfig`|root

**示例：**

查看当前系统的网卡：
```bash
# 一般来讲，系统自带的网卡是 eth0，如果有多个网卡，那么后面的数字会递增，如 eth1、eth2
[root@daijf ~]# ifconfig
br-6bc3cffef6d5: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.0.1  netmask 255.255.0.0  broadcast 0.0.0.0
        ether 02:42:16:76:c1:6e  txqueuelen 0  (Ethernet)
        RX packets 1096279  bytes 62960771 (60.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1096279  bytes 62960771 (60.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 0.0.0.0
        ether 02:42:3d:83:58:87  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# inet 172.17.0.3：当前计算机的 IP  
# netmask 255.255.240.0：子网掩码
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.3  netmask 255.255.240.0  broadcast 172.17.15.255
        inet6 fe80::5054:ff:feea:4f67  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:ea:4f:67  txqueuelen 1000  (Ethernet)
        RX packets 17918210  bytes 2964087439 (2.7 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 17080282  bytes 3079129709 (2.8 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 1096279  bytes 62960771 (60.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1096279  bytes 62960771 (60.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
设置网卡信息（谨慎操作）：
```bash
ifconfig eth0 192.168.2.180
```
### `mail`

不管目标用户在不在线，都可以发送。如果目标用户不在线，那么对方登录后会收到邮件。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`mail`|查看、发送电子邮件|`mail [用户名]`|--|`/bin/mail`|所有用户

**示例：**

给 root 用户发邮件（`Ctrl` + `D` 结束）
```bash
mail root
```
接收邮件：
```bash
mail
```

### `last`
命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`last`|列出目前与过去登入系统的用户信息、重启命令 `reboot` 也会列出|`last`|--|`/usr/bin/last`|所有用户

**示例：**

```bash
last

# (12:27) 表示在系统内停留的时间，12 小时 27 分
root     pts/1        117.176.219.56   Thu Jul 21 09:35 - 22:02  (12:27)
```

### `lastlog`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`lastlog`|查看用户最后一次登录时间|`lastlog [-option]`|--|`/usr/bin/lastlog`|所有用户

**选项：**
- `-u 用户名` 查看特定用户


**示例：**

查看所有用户最后一次登录时间：
```bash
lastlog
```
查看 root 用户最后一次登录时间：
```bash
lastlog -u root
```
### `traceroute`

该命令可用于网络诊断。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`traceroute`|显示数据包到目标IP的访问链路|`traceroute [目标IP]`|--|`/bin/traceroute`|所有用户
 
**示例：**

```bash
traceroute www.baidu.com
```

### `netstat`

该命令可用于网络诊断。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`netstat`|显示网络相关信息|`netstat [-option]`|--|`/bin/netstat`|所有用户

**选项：**

- `-t` TCP 协议
- `-u` UDP 协议
- `-l` 监听
- `-r` 路由
- `-n` 显示 IP 地址和端口号


**示例：**
查看本机监听的端口（即哪些端口正在使用）：
```bash
netstat -tlun
```
查看本机所有的网络连接（该命令非常有用）：
```bash
netstat -an

Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:15672           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:25672           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:4369            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:8087            0.0.0.0:*               LISTEN     
tcp        0      0 172.17.0.3:33454        169.254.0.55:8080       TIME_WAIT  
tcp        0      0 127.0.0.1:33593         127.0.0.1:4369          ESTABLISHED
tcp        0      0 127.0.0.1:60076         127.0.0.1:4369          TIME_WAIT  
tcp        0      0 172.17.0.3:22           61.157.90.101:31163     ESTABLISHED
tcp        0      0 172.17.0.3:52374        169.254.0.55:5574       ESTABLISHED
tcp        0      0 172.17.0.3:4369         172.17.0.3:56890        TIME_WAIT  
tcp6       0      0 172.17.0.3:8096         175.152.141.21:60056    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         67.198.130.201:40346    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         175.152.141.21:63899    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         175.152.141.21:60042    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         67.198.188.123:9880     ESTABLISHED

# 解释如下：
# ESTABLISHED 表示当前服务器的端口正在被哪些 IP 连接
# 下面这个表示 61.157.90.101 这台机器通过 31163 端口（这个端口不是服务器的端口，而是 61.157.90.101 这台机器的端口）连接到了 172.17.0.3（可以通过 ifconfig 命令查看当前机器的 IP） 的 22 端口（即通过 SSH 远程连接）
tcp        0      0 172.17.0.3:22           61.157.90.101:31163     ESTABLISHED
```
查看本机路由表（可以看到网关）：
```bash
netstat -rn
```
### `setup`

并不是所有的 Linux 都有这个命令，只有 redhat 系列的 Linux 才有。Centos 属于 redhat，Ubuntu 不属于 redhat。

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`setup`|配置网络|`setup`|--|`/usr/sbin/setup`|root

**示例：**

```bash
# 谨慎操作
setup
```
### `mount`

命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限
---|---|---|---|---|---
`mount`|文件挂载|`mount [-t] [文件系统] [设备文件名] [挂载点]`|--|`/bin/mount`|root

**示例：**

```bash
mount -t iso9660 /dev/sr0 /mnt/cdrom
```
## 输出命令

### `echo`

命令名称|功能描述|语法|执行权限
---|---|---|---
`echo`|输出内容|`echo [-options] [输出内容]`|所有用户

**选项**

- `-e` 支持 `\` 控制转义字符

**示例**

普通输出（如果输出的内容包含空格，则需要加双引号或单引号）：
```bash
echo "hello world"
```
普通输出（如果输出的内容包含感叹号，则只能加单引号）：
```bash
[root@daijf ~]# echo "hello!"
-bash: !": event not found

[root@daijf ~]# echo 'hello!'
hello!
```
换行输出：
```bash
[root@daijf ~]# echo "hello\nworld"
hello\nworld

[root@daijf ~]# echo -e "hello\nworld"
hello
world

# 16 进制的 61 对应的 ASCII 码是 a
[root@daijf ~]# echo -e '\x61'
a
```
输出内容带颜色，格式 `echo -e "\033[字背景颜色；文字颜色m字符串\033[0m"`
1. 字背景颜色和文字颜色之间是英文的 ";" 
2. 文字颜色后面有个 `m` 
3. 字符串前后可以没有空格，如果有的话，输出也是同样有空格 

字体颜色：
```bash
echo -e “\033[30m 黑色字 \033[0m” 
echo -e “\033[31m 红色字 \033[0m” 
echo -e “\033[32m 绿色字 \033[0m” 
echo -e “\033[33m 黄色字 \033[0m” 
echo -e “\033[34m 蓝色字 \033[0m” 
echo -e “\033[35m 紫色字 \033[0m” 
echo -e “\033[36m 天蓝字 \033[0m” 
echo -e “\033[37m 白色字 \033[0m” 
```
背景色：
```bash
echo -e “\033[40;37m 黑底白字 \033[0m” 
echo -e “\033[41;37m 红底白字 \033[0m” 
echo -e “\033[42;37m 绿底白字 \033[0m” 
echo -e “\033[43;37m 黄底白字 \033[0m” 
echo -e “\033[44;37m 蓝底白字 \033[0m” 
echo -e “\033[45;37m 紫底白字 \033[0m” 
echo -e “\033[46;37m 天蓝底白字 \033[0m” 
echo -e “\033[47;30m 白底黑字 \033[0m” 
```
更多颜色选项如下：

- `\033[0m` 关闭所有属性 
- `\033[1m` 设置高亮度 
- `\033[4m` 下划线 
- `\033[5m` 闪烁 
- `\033[7m` 反显 
- `\033[8m` 消隐 
- `\033[30m — \033[37m` 设置前景色 
- `\033[40m — \033[47m` 设置背景色 
- `\033[nA` 光标上移n行 
- `\033[nB` 光标下移n行 
- `\033[nC` 光标右移n行 
- `\033[nD` 光标左移n行 
- `\033[y;xH` 设置光标位置 
- `\033[2J` 清屏 
- `\033[K` 清除从光标到行尾的内容 
- `\033[s` 保存光标位置 
- `\033[u` 恢复光标位置 
- `\033[?25l` 隐藏光标 
- `\033[?25h` 显示光标

> **提示**  
> `\033` 是八进制的 33，等价于十六进制的 16，即 `\x1B`。`echo -e "\x1B[41;36m something here \x1B[0m"`。  
> 当然，`\e` 也可以达到同样的效果。`echo -e "\e[41;36m something here \e[0m"`。

### `printf`

命令名称|功能描述|语法|执行权限
---|---|---|---
`printf`|输出内容|`printf ['输出类型输出格式'] [输出内容]`|所有用户

**输出类型**

- `%ns` 输出字符串。n 是数字，指代输出几个字符
- `%ni` 输出整数。n 是数字，指代输出几个数字
- `%m.nf` 输出浮点数。m 和 n 是数字，指代输出的总位数和小数位数。如 `%8.2f` 代表共输出 8 位数，其中 2 位是小数，6 位是整数。

**输出格式**

- `\a` 输出警告声音
- `\b` 输出退格键，也就是 Backspace 键
- `\f` 清除屏幕
- `\n` 换行
- `\r` 回车，也就是 Enter 键
- `\t` 水平输出退格键，也就是 Tab 键
- `\v` 垂直输出退格键，也就是 Tab 键


**示例**

```bash
[root@daijf djftest]# printf '%s %s %s\n' 1 2 3 4 5 6
1 2 3
4 5 6
```
```bash
[root@daijf djftest]# printf '%s %s\n' 1 2 3 4 5 6
1 2
3 4
5 6
```
```bash
[root@daijf djftest]# printf "%s %s\n" 1 2 3 4 5 6
1 2
3 4
5 6
```
```bash
[root@daijf djftest]# printf %s %s %s 1 2 3 4 5 6
%s%s123456
```

需要注意的是，`printf` 不能与管道符连用，如下：
```bash
cat student.txt | printf '%s'
```
需要使用 `$()` 才可以，如下：
```bash
printf '%s' $(cat student.txt)
```
```bash
# 每一列通过制表符分隔
[root@daijf djftest]# cat student.txt 
ID	Name  Age  Sex
01	zs    13   男
02	ls    23   男
03	ww    18   女

[root@daijf djftest]# printf '%s\t%s\t%s\t%s\t\n' $(cat student.txt)
ID	Name  Age  Sex	
01	zs	  13   男	
02	ls	  23   男	
03	ww	  18   女
```

`printf` 常与 `awk` 命令一起使用。在 Linux 中，默认是没有 `print` 命令的，但是，在与 `awk` 命令一起使用时，可以使用 `print` 命令。`printf` 不会自动换行，而 `print` 命令会自动换行。


## 关机重启命令

**`shutdown`**

该命令可用于关机或重启（直接使用 `shutdown` 命令即可立即关机）。如果是在生产环境中，无论如何不要随便使用 `shutdown` 命令。服务器只能重启，不能关机。在关机之前，建议先停止正在运行的服务。高并发流量下，严禁直接关机或重启，可能导致硬盘损坏。

**选项：**

- `-h` 关机，即 halt
- `-r` 重启，即 reboot
- `-c` 取消前一个关机命令

**示例：**

```bash
# 立即关机
shutdown -h now

# 晚上 20:30 关机
shutdown -h 20:30


# 立即重启
shutdown -r now

# 晚上 20:30 重启
shutdown -r 20:30
```

除此之外，`halt`、`poweroff`（不推荐使用，相当于拔电源）、`init 0` 命令都可以用于关机。但是我们推荐使用 `shutdown` 进行关机操作，因为 `shutdown` 命令在关机之前会确保系统正在运行的服务被正确停止。`reboot`、`init 6` 命令也可用于重启。

前面提到了 init 这个命令，那么它是干嘛的呢？`init` 代表了系统的运行级别，所有的级别如下：

- 0：关机
- 1：单用户（相当于 Windows 的安全模式，仅启动系统运行所需要的核心服务，通常用于系统修复、数据修复，只有 root 用户可以登录）
- 2：不完全多用户，不含NFS服务
- 3：完全多用户
- 4：未分配
- 5：图形界面
- 6：重启

如何查看系统的 init 级别？可在 `/etc/inittab` 文件中查看，如下：
```bash
[root@daijf ~]# cat /etc/inittab

# 默认的系统级别为 3，永远不要将系统的运行级别设置为 0 和 6。
# 如果设置为 0，则相当于系统开机后立即关机；设置为 6，则相当于系统开机后自动重启。
id:3:initdefault:
```
查询系统的运行级别：
```bash
runlevel
```
设置系统的运行级别：
```bash
init 5

runlevel
# 之前是 3，现在是 5
3 5
```
但是，较新的 Linux 已经不使用 `/etc/inittab` 这个文件了，查看这个文件，会显示如下内容：
```bash
[root@daijf ~]# cat /etc/inittab 
# inittab is no longer used when using systemd.
#
# ADDING CONFIGURATION HERE WILL HAVE NO EFFECT ON YOUR SYSTEM.
#
# Ctrl-Alt-Delete is handled by /usr/lib/systemd/system/ctrl-alt-del.target
#
# systemd uses 'targets' instead of runlevels. By default, there are two main targets:
#
# multi-user.target: analogous to runlevel 3
# graphical.target: analogous to runlevel 5
#
# To view current default target, run:
# systemctl get-default
#
# To set a default target, run:
# systemctl set-default TARGET.target
```
可以使用 `logout`、`exit` 命令退出登录，相当于锁屏。

## 其它命令
### 历史命令 `history`
命令名称|功能描述|语法|执行权限
---|---|---|---
`history`|显示历史命令|`history [-options] [历史命令保存文件]`|所有用户

**选项**

- `-c` 清空历史命令。该选项会清除 `~/.bash_history` 文件和缓存中的历史命令，一般不建议使用该选项。
- `-w` 把缓存中的历史命令写入历史命令的保存文件。默认在 `~/.bash_history`。默认情况下，当用户退出后，才会将缓存写入文件。


**示例**

查看使用过的命令：
```bash
history
```
清空历史记录：
```bash
history -c
```
将历史命令写入文件：
```bash
history -w
```

默认会保存 1000 条历史命令，可以在环境变量中通过 `HISTSIZE` 进行设置。
```bash
vim /etc/profile

# 在文件中加入 HISTSIZE=99999

source /etc/profile
```

**调用历史命令的快捷键：**  
1. 通过上下方向键可以调用最近执行过的命令
2. 使用 `!n` (`n` 表示行号，可以通过 `history` 命令查看) 可以执行特定的历史命令。如 `!222`
3. 使用 `!!` 执行上一条命令
4. 使用 `!子串` 执行最后一条以该子串开头的命令

### 命令别名 `alias`

命令名称|功能描述|语法|执行权限
---|---|---|---
`alias`|设置/查看别名|`alias [-options] [历史命令保存文件]`|所有用户


**示例**

查看所有命令的别名：
```bash
alias
```
设置命令别名：
```bash
# 将 vim 的别名设置为 vi，使用 vi 命令时，就是使用 vim
alias vi='vim'
```
上面的方式只是临时生效，系统重启后就会消失，如果想要别名永久生效，那么需要写入环境变量 `~/.bashrc` 文件中：
```bash
vim ~/.bashrc
```
编辑如下内容：
```
# .bashrc

# User specific aliases and functions
# 设置命令别名

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
```
保存后，刷新环境变量，使其生效：
```bash
source ~/.bashrc
```
删除别名：
```bash
unalias 别名
```

Linux 中的命令执行顺序如下（优先级依次降低）：

1. 用绝对路径或相对路径执行的命令。
2. 执行命令的别名。
3. 执行 bash 的内部命令。
4. 按照 `$PATH` 环境变量定义的目录顺序找到的第一个命令。

> **警告**  
> 建议不要将别名的名称设置为系统中已有的命令，否则，系统中的命令会被覆盖。见上面的命令执行顺序。

### 刷新配置文件 `source`

该命令用于重新加载配置文件的内容。

语法：`source 文件名`

**示例**

重新加载环境变量：
```bash
source /etc/profile
```
当然，也可以使用该命令的语法糖格式：
```bash
. /etc/profile
```

### 快捷键


快捷键|作用
---|---
`Ctrl` + `A`|把光标移动到命令行开头。如果我们输入的命令过长，想要把光标移动到命令行开头时使用。
`Ctrl` + `E`|把光标移动到命令行结尾。
`Ctrl` + `C`|强制终止当前的命令。
`Ctrl` + `L`|清屏，相当于 `clear` 命令。
`Ctrl` + `U`|删除或剪切光标之前的命令。我输入了一行很长的命令，不用使用退格键一个一个字符的删除，使用这个快捷键会更加方便。
`Ctrl` + `K`|删除或剪切光标之后的内容。
`Ctrl` + `Y`|粘贴 `Ctrl` + `U` 或 `Ctrl` + `K` 剪切的内容。
`Ctrl` + `R`|在执行 `history` 命令后，按下 `Ctrl` + `R` 之后，就会出现搜索界面，只要输入搜索内容，就会从历史命令中进行搜索。
`Ctrl` + `D`|退出当前终端。
`Ctrl` + `Z`|暂停，并放入后台。这个快捷键牵扯工作管理的内容，我们在系统管理章节详细介绍。
`Ctrl` + `S`|暂停屏幕输出。
`Ctrl` + `Q`|恢复屏幕输出。

### 输入输出重定向

**标准输入输出：**

设备|设备文件名|文件描述符|类型
---|---|---|---
键盘|/dev/stdin|0|标准输入
显示器|/dev/stdout|1|标准输出
显示器|/dev/stderr|2|标准错误输出

> **提示**  
> 这里提一点，在 Linux 中 `/dev/null` 表示将输出丢弃。如 `ls > /dev/null`。


**输出重定向：**

类型|符号|作用
---|---|---
标准输出重定向|`>`|以覆盖的方式，把命令的正确输出输出到指定的文件或设备当中。
标准输出重定向|`>>`|以追加的方式，把命令的正确输出输出到指定的文件或设备当中。|
标准错误输出重定向|`2>`|以覆盖的方式，把命令的错误输出输出到指定的文件或设备当中。|
标准错误输出重定向|`2>>`|以追加的方式，把命令的错误输出输出到指定的文件或设备当中。|
同时保存正确输出和错误输出|命令 `>` 文件 `2>&1`|以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中。
同时保存正确输出和错误输出|命令 `>>` 文件 `2>&1`|以追加的方式，把正确输出和错误输出都保存到同一个文件当中。
同时保存正确输出和错误输出|命令 `&>` 文件|以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中。
同时保存正确输出和错误输出|命令 `&>>` 文件|以追加的方式，把正确输出和错误输出都保存到同一个文件当中。
同时保存正确输出和错误输出|命令 `>>` 文件1 `2>>` 文件2|把正确的输出追加到文件 1 中，把错误的输出追加到文件 2 中。

> 任何有输出的命令都可以使用重定向，将输出结果输出到指定文件或设备中。当指定的文件不存在时，会自动创建文件。如 `ls > abc`。

需要注意的是，`>`、`>>` 只能用于重定向正确的输出。当一个命令的执行结果报错时，如果要将输出结果重定向到文件中，那么需要使用 `2>`、`2>>`。如下：
```bash
[root@daijf ~]# llll 
-bash: llll: command not found

# 不能使用 >，因为该命令的输出是标准错误输出流
[root@daijf ~]# llll > abc
-bash: llll: command not found

[root@daijf ~]# llll 2> abc

[root@daijf ~]# cat abc
-bash: llll: command not found
```

在部署应用时，经常使用重定向来记录日志，如后台运行 Spring Boot 项目：
```bash
nohup java -jar abc.jar > nohup.log 2>&1 & 

# 使用 npm 后台运行前端项目
nohup npm run start > app.log 2>apperror.log & exit
```
**输入重定向：**

命令：`wc [选项] [文件名]`

**选项**
- `-c` 统计字节数
- `-w` 统计单词数（以空格隔开的算一个单词）
- `-l` 统计行数

符号|说明
---|---
<|输入重定向
<<|追加输入重定向



**示例**

使用标准输入（即键盘）：
```bash
# 使用 wc 命令后会进行输入模式，此时从键盘进行输入，按  Ctrl + D 停止输入
# 停止输入后，会自动显示统计结果
wc
```
使用文件作为输入：
```bash
# 8 6 14 依次为行数、单词数、字节数（算上回车）
[root@daijf ~]# wc < abc
 8  6 14
 
[root@daijf ~]# cat abc
1
2
3
4
5
6

```
统计文件的行数：
```bash
# wc -l abc.txt 和下面的等价
# cat abc.txt | wc -l 也可以
wc -l < abc.txt
```

自定义文件结束符：
```bash
# 将 EOF 最为文件结束符, 当输入的内容为 EOF 时，认为输入完成。
wc << EOF
1
2
3
EOF
```
### 读取标准输入的数据 `tee`

命令|作用|格式
---|---|---
`tee`|读取标准输入的数据|`tee [选项] 文件`

**选项**

- `-a` 追加写入操作
- `-i` 忽略中断信号
- `— help` 查看帮助信息
- `— version` 显示版本信息

**示例**

将用户输入的数据同时写入到两个文件中：
```bash
[root@linuxcool ~]# tee file1 file2
linuxcool.com
linuxcool.com
^C # Ctrl + C
```
执行某个指定的命令，并将其执行结果即输出到屏幕，又写入到文件中：
```bash
[root@linuxcool ~]# date | tee system.txt
16:13:43 up  1:38,  1 user,  load average: 0.00, 0.00, 0.00
```
将键盘输入的内容追加到文件中：
```bash
# 以 EOF 作为输入结束的标记（如果没有指定结束的标记，那么可以使用 Ctrl + D 来结束输入）
[root@djfcentos1 ~]# tee hello.txt << EOF
> hello
> world
> EOF
hello
world

# 没有指定结束的标记，那么可以使用 Ctrl + D 来结束输入
[root@djfcentos1 ~]# tee -a hello.txt
```

### 多命令顺序执行

多命令执行|格式|作用
---|---|---
`;`|命令1`;`命令2|多个命令顺序执行，命令之间没有任何逻辑联系
`&&`|命令1`&&`命令2|逻辑与。当命令 1 正确执行，命令 2 才会执行；当命令 1 执行不正确，则命令 2 不会执行
`\|\|`|命令1`\|\|`命令2|逻辑或。当命令 1 执行不正确，命令 2 才会执行；当命令 1 正确执行，则命令 2 不会执行

**示例**

记录复制文件的耗时：
```bash
[root@localhost~]# dd if=输入文件 of=输出文件 bs=字节数 count=个数
选项:
if=输入文件 指定源文件或源设备
of=输出文件 指定目标文件或目标设备
bs=字节数 指定一次输入/输出多少字节，即把这些字节看做一个数据块
count=个数 指定输入/输出多少个数据块

# -----------------------------------

# 把 /dev/zero 这个文件的内容复制 1k x 100000 即 100MB 到 /tmp/testfile 文件中，看需要多长时间
[root@daijf ~]# date ; dd if=/dev/zero of=/tmp/testfile bs=1k count=100000; date
Thu Sep 15 22:45:48 CST 2022
100000+0 records in
100000+0 records out
102400000 bytes (102 MB) copied, 0.224596 s, 456 MB/s
Thu Sep 15 22:45:48 CST 2022

[root@daijf ~]# ll -h /tmp/testfile 
-rw-r--r-- 1 root root 98M Sep 15 22:45 /tmp/testfile
```
编译安装 RPM 包：
```bash
./configure && make && make install
```
判断命令是否是正确的：
```bash
lsa && echo '命令正确' || echo '命令错误'
```

### 管道符

格式： `命令1 | 命令2`。它的作用是把命令 1 的正确输出作为命令 2 的操作对象。

> **注意**  
> 使用管道符的前提是，命令 1 必须有正确输出。如果命令 1 没有输出，则命令 2 不执行；如果命令 1 是错误输出，则命令 2 也不执行。

**示例**

```bash
ll /etc/ | more
```
```bash
ls /etc/ | grep "test"
```

### 通配符与其它特殊符号

**通配符**

Linux 中内置通配符，常用的通配符如下（通配符和正则还是有点区别的）：
通配符|说明
---|---
$|以 ... 结尾
`^`|以 ... 开头
`*`|匹配 0 或多个字符
`?`|任意一个字符（必须要有一个字符）
`[]`|需要匹配其中任意一个字符（必须要匹配上）
`[-]`|匹配范围内的任意一个字符（必须要匹配上）
`[^]`|逻辑非，不能出现指定的任意一个字符
`{}`|产生一个序列

**示例**

找出以 abc 开头的文件：
```bash
ls abc*
```

**其它特殊字符**

符号|作用
---|---
`''`|单引号。在单引号中所有的特殊符号都没有特殊含义。
`""`|双引号。在双引号中特殊符号都没有特殊含义，但是 "$"、"`"、"!"、"\\" 是例外。
``|反引号。反引号括起来的内容是系统命令，在 bash 中会先执行它。和 $() 作用一样，不过推荐使用 $()，因为反引号非常容易看错。
`$()`|和反引号作用一样，用来引用系统命令。
`#`|在 shell 脚本中，# 开头的行代表注释。（`#!/bin/bash` 除外）。
$|用于调用变量的值，如需要调用变量 name 的值时，需要用 $name 的方式得到变量的值。
`\`|转义符。跟在 \ 之后的特殊符号将失去特殊含义，变为普通字符。如 \$ 将输出 $ 符号。

**示例**

```bash
# 输出环境变量 JAVA_HOME 的值
echo $JAVA_HOME
echo "$JAVA_HOME"

# 直接输出 $JAVA_HOME
echo '$JAVA_HOME'

# 执行 date 命令
echo "$(date)"
```

### 正则表达式

正则表达式用来在文件中匹配符合条件的字符串，正则是包含匹配。`grep`、`awk`、`sed` 等命令可以支持正则表达式。  

通配符用来匹配符合条件的文件名、目录名，通配符是完全匹配。`ls`、`find`、`cp` 等这些命令不支持正则表达式，所以只能使用 shell 自己的通配符来进行匹配。

元字符|作用
---|---
`*`|前一个字符匹配 0 次或任意多次。
`.`|匹配除了换行符外的任意一个字符。
`\+`|前一个字符至少出现一次。
`^`|匹配行首。例如 `^hello` 会匹配以 hello 开头的行。
$|匹配行尾。例如 `hello$` 会匹配以 hello 结尾的行。
`[]`|匹配中括号中指定的任意一个字符，只匹配一个字符。
`[^]`|匹配除中括号的字符以外的任意一个字符。
`\`|转义符。
`\{n\}`|表示其前面的字符恰好出现 n 次。例如 `[0-9]\{4\}` 匹配 4 位数。
`\{n,\}`|表示其前面的字符出现不小于 n 次。例如 `[0-9]\{2,\}` 表示两位及以上的数字。
`\{n,m\}`|表示其前面的字符至少出现 n 次，最多出现 m 次。


**示例**  

正则表达式与通配符的区别：
```bash
# 匹配以 a 开头的文件或目录
ls a*

# 匹配整个文件的所有行
grep "a*" test.txt

# 匹配至少包含一个 a 的行，等价于 grep "a\+" test.txt
grep "aa*" test.txt
```
匹配空白行：
```bash
# -n 用于显示行号
grep -n "^$" regex1.txt
```
在上面，我们使用了 `\` 来转义部分字符，这样比较麻烦。`grep` 命令有一个 `-E` 选项用于正则匹配，这样就不用加 `\`了，如下：
```bash
grep -E "a+" test.txt
grep -E "a{1,3}" test.txt

# egrep 命令等价于 `grep -E`
```

### 字段提取命令 `cut`

我们知道 `grep` 命令可以提取符合条件的行，而本节中的 `cut` 命令可以提取符合条件的列。

命令名称|功能描述|语法|执行权限
---|---|---|---
`cut`|提取符合条件的列|`cut [-options] [文件名]`|所有用户

**选项**
- `f` 提取第几列
- `d` 按照指定分隔符分割列（默认的分隔符是制表符）

> **注意**  
> `cut` 命令在使用时，必须指定选项。


**示例**

现在，我们有一个 `student.txt` 文件，它里面的内容如下（每个字段之间通过制表符分开）：
```bash
[root@daijf djftest]# cat student.txt 
ID	Name	Age	Sex
01	zs  	13	男
02	ls  	23	男
03	ww  	18	女
```
现在，我想提取第 2 和第 3 列，命令如下：
```bash
[root@daijf djftest]# cut -f 2,3 student.txt 
Name	Age
zs  	13
ls  	23
ww  	18
```
提取所有普通用户的用户名：
```bash
[root@daijf djftest]# cat /etc/passwd | grep /bin/bash | grep -v root | cut -d ":" -f 1
djf
djf1
djf2
djf3
djf5
```

但是呢，`cut` 命令不能很好地处理以空格分割的列，比如下面这个例子：
```bash
# 查看磁盘占用率（该命令的执行结果并不符合预期）
df -h | grep -E "/$" | cut -d " " -f 5
```
如果我们想要更加强大的命令来处理以空格分隔的列，那么需要使用 `awk` 命令。


### 字符截取命令 `awk`

`awk` 命令常与 `printf` 一起使用。在 Linux 中，默认是没有 `print` 命令的，但是，在与 `awk` 命令一起使用时，可以使用 `print` 命令。`printf` 不会自动换行，而 `print` 命令会自动换行。

命令名称|功能描述|语法|执行权限
---|---|---|---
`awk`|提取符合条件的列|`awk ['条件1 {动作1} 条件2 {动作2} ...'] [文件名]`|所有用户

**选项**
- 条件中可以使用任何条件表达式，如 `>`、`<` 等等。可以没有条件。
- 动作可以是输出语句，也可以是流程控制语句（如 `if`、`for` 等）
- `-F` 指定分隔符

**示例**
```bash
# 输出该文件的第 2 列和第 4 列。$0 表示这一行所有列
[root@daijf djftest]# awk '{printf $2 "\t" $4 "\n"}' student.txt 
Name    Sex
zs	    男
ls	    男
ww	    女
```
```bash
# 查看磁盘使用情况
df -h | awk '{print $1 "\t" $5 "\t"}'
```
```bash
# 查看磁盘使用率
[root@daijf djftest]# df -h | grep -E "/$" | awk '{printf $5 "\n"}'
63%
[root@daijf djftest]# df -h | grep -E "/$" | awk '{printf $5 "\n"}' | cut -d "%" -f 1
63
```

但是，`awk` 命令默认只会识别以空格或制表符分隔的列，如果想要截取其它字符分隔的列，那么需要使用条件。

`BEGIN` 用于 `awk` 命令读取文件数据之前，做一些操作；`END` 用于 `awk` 命令执行完成后，做一些操作。

```bash
[root@daijf djftest]# awk 'BEGIN {printf "begin...\n"} {print $1 "\t" $2} END {printf "end...\n"}' student.txt 
begin...
ID	Name
01	zs
02	ls
03	ww
end...
```
```bash
# 在读取数据之前，将分隔符指定为 :
[root@daijf djftest]# awk 'BEGIN {FS=":"} {printf $1 "\t" $2 "\n"}' /etc/passwd

# 与上面的效果等价
[root@daijf djftest]# awk -F ":" '{printf $1 "\t" $2 "\n"}' /etc/passwd
```

### `sed`

sed 是一种几乎包括在所有 UNIX 平台（包括 Linux）的轻量级流编辑器。`sed` 主要是用来将数据进行选取、替换、删除、新增的命令。

我们在前面已经知道了，`vim` 可以用来编辑文件，但它也仅仅是用来编辑文件的，它不能对命令的结果进行编辑，如果想要编辑命令的输出结果，那么需要先将结果写入到文件中，然后再通过 `vim` 命令进行编辑。而 `sed` 命令可以直接编辑命令的输出结果。

**命令格式**：`sed [选项] ['动作'] 文件`

**选项**
- `-n` 一般 `sed` 命令会把所有数据都输出到屏幕，如果加入此选项，则只会把经过 `sed` 命令处理的行输出到屏幕
- `-e` 允许对输入数据应用多条 `sed` 命令编辑
- `-i` 用 `sed` 的修改结果直接修改读取数据的文件，而不是由屏幕输出

**动作**

- `a \` 追加，在当前行后添加一行或多行。添加多行时，除最后一行外，每行末尾需要用 "\\" 代表数据未完结。
- `c \` 行替换，用 c 后面的字符串替换原数据行，替换多行时，除最后一行外，每行末尾需用 "\\" 代表数据未完结。
- `i \` 插入，在当期行前插入一行或多行。插入多行时，除最后一行外，每行末尾需要用 "\\" 代表数据未完结。
- `d` 删除，删除指定的行。
- `p` 打印，输出指定的行。
- `s` 字串替换，用一个字符串替换另外一个字符串。格式为 "行范围s/旧字串/新字串/g" （和 vim 中的替换格式类似）。

**示例**

```bash
[root@daijf djftest]# cat student.txt 
ID	Name	Age	Sex
01	zs  	13	男
02	ls  	23	男
03	ww  	18	女
```

```bash
# 输出第二行的数据
[root@daijf djftest]# sed -n '2p' student.txt 
01	zs  	13	男
```
```bash
[root@daijf djftest]# df -h | sed -n '2p'
devtmpfs        909M     0  909M   0% /dev
```
```bash
# 删除输出结果的第 2 到第 4 行（不影响原文件）
[root@daijf djftest]# sed '2,4d' student.txt 
ID	Name	Age	Sex
```
```bash
# 在第二行后追加一行数据（不影响原文件）
[root@daijf djftest]# sed '2a hello' student.txt 
ID	Name	Age	Sex
01	zs  	13	男
hello
02	ls  	23	男
03	ww  	18	女
```
```bash
# 在第二行前追加一行数据（不影响原文件）
[root@daijf djftest]# sed '2i hello' student.txt 
ID	Name	Age	Sex
hello
01	zs  	13	男
02	ls  	23	男
03	ww  	18	女
```
```bash
# 在第二行前追加两行数据（不影响原文件）
[root@daijf djftest]# sed '2i hello \
> world' student.txt
ID	Name	Age	Sex
hello 
world
01	zs  	13	男
02	ls  	23	男
03	ww  	18	女
```
```bash
# 将第二行替换为 11111（不影响原文件）
[root@daijf djftest]# sed '2c 11111' student.txt 
ID	Name	Age	Sex
11111
02	ls  	23	男
03	ww  	18	女
```
```bash
# 将第三行的 23 替换为 12（不影响原文件）
[root@daijf djftest]# sed '3s/23/12/g' student.txt 
ID	Name	Age	Sex
01	zs  	13	男
02	ls  	12	男
03	ww  	18	女
```
### 字符处理命令 `sort`

`sort` 命令会将输出结果进行排序。

**命令格式**：`sort [选项] 文件名`

**选项**
- `-f` 忽略大小写
- `-n` 以数值型进行排序，默认使用字符串型排序
- `-r` 反向排序
- `-t` 指定分隔符，默认的分隔符是制表符
- `-k n[,m]` 按照指定的字段范围排序。从第 n 字段开始，m 字段结束（默认到行尾）（通常与 `-t` 选项配合使用）

**示例**
```bash
sort /etc/passwd
```

### 下载网络文件 `wget`

命令名称|功能描述|语法|执行权限
---|---|---|---
`wget`|下载网络文件|`wget [选项] 网址`|所有用户

`wget` 命令来自于英文词组“web get”的缩写，其功能是用于从指定网址下载网络文件。`wget` 命令非常稳定，一般即便网络波动也不会导致下载失败，而是不断的尝试重连，直至整个文件下载完毕。

`wget` 命令支持如 HTTP、HTTPS、FTP 等常见协议，可以在命令行中直接下载网络文件。

**选项**

- `-V` 显示版本信息
- `-h` 显示帮助信息
- `-b` 启动后转入后台执行
- `-c` 支持断点续传
- `-O` 定义本地文件名
- `-e <命令>` 执行指定的命令
- `--limit-rate=<速率>` 限制下载速度

**示例**

```bash
# 下载 Nginx
wget https://nginx.org/download/nginx-1.22.0.tar.gz

# 将下载的文件命名为 test.tar.gz
wget -O test.tar.gz https://nginx.org/download/nginx-1.22.0.tar.gz

# 限制每秒最高下载速度为 300k
get --limit-rate=300k https://nginx.org/download/nginx-1.22.0.tar.gz
```






# 文本编辑器 Vim

Vim 的早期版本是 Vi，Vim 完全兼容 Vi，但它比 Vi 更强大。

基本语法如下：
```bash
vim a.txt
```
使用 `vim` 打开文件后，默认是处于命令状态，我们所有的输入都会被当作命令来处理。如果我们想要编辑文件内容，就需要进入编辑模式。

## 编辑模式

可以通过以下命令进入编辑模式。

命令|作用
---|---
`a`|在光标所在字符后插入
`A`|在光标所在行尾插入
`i`|在光标所在字符前插入
`I`|在光标所在行行首插入
`o`|在光标下方插入新行
`O`|在光标上方插入新行
`:w`|保存修改
`:w new filename`|另存为指定文件
`:wq`|保存修改并退出，或者快捷键 `Shift` + `z` + `z`
`:q!`|不保存修改并退出，`!` 表示强制
`:wq!`|强制保存修改并退出（文件所有者及 root 可使用），通常用于该文件只有读操作的权限时

按 `Esc` 键退出编辑模式。  


## 命令模式

命令|作用
---|---
`:set nu`、`:set number`|显示行号
`:set nonu`|取消行号
`gg`|到第一行
`G`|到最后一行
`nG`、`:n`|到第 n 行
\$|移动到行尾
`0`|移动到行首
`x`|删除光标所在处字符
`nx`|删除光标所在处后 n 个字符
`dd`|删除光标所在行
`ndd`|从光标所在行开始，删除 n 行
`dG`|删除光标所在行到文件末尾的内容
`D`|删除光标所在处到行尾的内容
`:nl,n2d`|删除指定范围的行
`u`|撤销
`yy`|复制当前行
`nyy`|复制当前行以下 n 行
`dd`|剪切当前行
`ndd`|剪切当前行以下 n 行
`p`、`P`|粘贴在当前光标所在行下或行上
`r`|替换光标所在处字符
`R`|从光标所在处开始替换字符，按 `Esc` 结束
`/`|搜索指定字符串，可以使用正则，使用 `\` 进行转义
`:set ic`|搜索时忽略大小写
`:set noic`|搜索时区分大小写（默认）
`n`|搜索指定字符串的下一个出现位置
`N`|搜索指定字符串的上一个出现位置
`:%s/old/new/g`|全文替换指定字符串，使用 `\` 进行转义。`g` 表示不询问确认，`c` 表示询问确认
`:nl,n2s/old/new/g`|在一定范围内替换指定字符串。n1、n2 代表行号，使用 `\` 进行转义
`:r file`| 在当前光标所在行下面一行导入 file 文件中的内容
`:!`|执行 shell 命令，如 `:!which ls`
`:r !`|在当前光标所在行下面导入命令的执行结果，如导入插入当前时间 `:r !date`
`:map`|在当前文件内，定义快捷键（退出后失效），如 `:map ^K I#<ESC>`（表示按 K 时，在当前行的行首插入字符 #，并退出编辑模式），`^K` 需要使用 `Ctrl` + `v` + `k` 来完成。
`:ab`|替换字符串（需要在编辑模式下使用），如 `:ab mail daijunfeng.me@qq.com`，在编辑模式下输入 mail，然后空格或回车，就会被替换为 `daijunfeng.me@qq.com`。

以上这些命令，我们退出文件后，就会失效，如果想要永久生效，就需要在每个用户的根目录下（root 用户的根目录在/root，普通用户的根目录在 /home/${username} 下）的 `.vimrc` 文件中进行设置，如下：
```bash
[djf1@daijf ~]$ whoami
djf1
[djf1@daijf ~]$ pwd
/home/djf1
[djf1@daijf ~]$ vim .vimrc 

# 在 .vimrc 中添加如下内容，这些内容在使用 vim 时，会被立即执行
ab mail daijunfeng.me@qq.com
set nu
```

上面这种方式是用户级别的，那怎么设置全局的呢？其实很简单，如果你使用 `vi ` 命令，那么需要修改 `/etc/virc` 这个文件，如果你使用 `vim` 命令，那么需要修改 `/etc/vimrc` 这个文件。


`vim` 可以实现新建并编辑的功能，`touch` 命令只能新建。


# 软件包管理

一般来讲，软件包可以分为两类：源码包和二进制包。  

通过源码包进行安装时，需要先将源码包编译成二进制文件，然后再进行安装。而二进制包是源码包编译完成后的产物，可以直接进行安装。但是，通过源码包安装的方式，对开发人员的要求较高，中间如果出现编译问题，解决起来较为麻烦，因此，推荐使用二进制包进行安装。常见的二进制包有 rpm、系统默认包等。

源码包优点：
- 开源，如果有足够的能力，可以修改源代码
- 可以自由选择所需的功能
- 软件是由操作系统编译安装，所以更加适合自己的系统，更加稳定也效率更高
- 卸载方便

源码包缺点：
- 安装过程步骤较多
- 编译过程时间较长，比二进制安装时间长
- 因为是编译安装，安装过程中一旦报错新手很难解决

二进制包优点：
- 包管理系统简单，只通过几个命令就可以实现包的安装、升级、查询和卸载
- 安装速度比源码包安装快的多

二进制包缺点：
- 经过编译，不再可以看到源代码
- 功能选择不如源码包灵活
- 有依赖性

## RPM 包管理

RPM 包其实就是二进制包，它的包管理可以分为 rpm 命令管理和 yum 在线管理两种。

rpm 包命名原则，以 `mysql-community-server-8.0.30-1.el7.x86_64.rpm` 为例来说明，如下：

- `mysql-community-server` 软件包名
- `8.0.30` 软件版本
- `1` 软件发布次数
- `el7` 适合的 Linux 平台，如果没有此项，则表示支持所有平台
- `x86_64` 适合的硬件平台，如果没有此项，则表示支持所有平台
- `rpm` rpm 包扩展名

我们知道，在 Linux 中，其实是不区分文件后缀的，但是，对于 rpm 包来讲，应该将其后缀指定为 `.rpm`，这样做是为了方便我们识别。

`mysql-community-server-8.0.30-1.el7.x86_64.rpm` 是一个包的全名，而 `mysql-community-server` 是包名，这点需要注意，在后续 rpm 的操作中会提到它们的使用场景。操作的包是没有安装的软件包时，使用包全名，而且要注意软件包路径。操作已经安装的软件包时，使用包名（比如查询、卸载），会在 `/var/lib/rpm/` 中搜索已经安装过的包。


**rpm 包的依赖性**

在使用 rpm 命令安装时，我们可能会碰到依赖的问题。简单来讲，就是需要先安装另一个软件后，才能进行此软件的安装。

可以这样理解：rpm 命令相当于传统 Java 项目，需要自己手动添加 jar，而 yum 则相当于 Maven。

- 树形依赖
- 循环依赖

    循环依赖的解决办法就是，将软件同时进行安装。比如现在有如下所示的依赖关系，解决办法就是将 a、b、c 同时进行安装，`rpm -ih a && rpm -ih b && rpm -ih c`。
    
    ```
    stateDiagram-v2
        a --> b
        b --> c
        c --> a
    ```
- 库依赖

    库依赖查询网站：[Rpmfind mirror](https://rpmfind.net/)
    
    比如我现在安装一个 MySQL，可能会报如下错误：
    
    ![image.png](https://note.youdao.com/yws/res/47361/WEBRESOURCEb9e6251b086f5bbad70cfc2c1f6b2bc5)
    
    提示需要安装 `libodbcinst.so.2`（一般以 so、数字结尾的都是库依赖） 这个库，我们只需要在库依赖网站查询 `libodbcinst.so.2`，然后安装即可，如下：
    
    ![image.png](https://note.youdao.com/yws/res/47368/WEBRESOURCE75afc2808553a207a3312602b7b26a5a)
    
## RPM 命令

格式：`rpm [-option] [包全名]`。

**选项：**

- `-i（install）` 安装
- `-v（verbose）` 显示详细信息
- `-h（hash）` 显示安装进度
- `--nodeps` 不检测依赖性
- `-U（upgrade）` 升级
- `-e（erase）` 卸载
- `-q` 查询
- `-a` 所有
- `-i` 与 `-q` 一起使用，表示查询软件包的详细信息
- `-p（package）` 查询未安装的包的信息
- `-l` 查看包的安装路径
- `-f` 查询系统文件属于哪个软件包
- `-R` 查看包的依赖性
- `-V` 校验已安装的包，是否发生过修改（如果包安装后没有修改任何相关文件，那么就没有提示）


**示例：**

```bash
# 安装
rpm -ivh /root/mysql-community-server-8.0.30-1.el7.x86_64.rpm
# 升级
rpm -Uvh /root/mysql-community-server-8.0.30-1.el7.x86_64.rpm
# 卸载（会自动删除相关的文件）
rpm -e mysql-community-server
# 查询所有已安装的包
rpm -qa
# 查询某个具体的包
rpm -q mysql-community-server
rpm -qa | grep nginx

# 查询软件包的详细信息
rpm -qi nginx

# 查询未安装的包的信息
rpm -qip /root/mysql-community-server-8.0.30-1.el7.x86_64.rpm

# 查看已安装的包的路径
rpm -ql nginx

# 查看未安装的包的待安装路径
rpm -qlp /root/mysql-community-server-8.0.30-1.el7.x86_64.rpm

# 查看文件 /usr/lib/python2.7/site-packages/six.pyo 属于哪个包
rpm -qf /usr/lib/python2.7/site-packages/six.pyo

# 查看已安装包的依赖性
rpm -qR python

# 查看未安装包的依赖性
rpm -qRp python-six-1.9.0-2.el7.noarch

# ---------------------------------------------
# 查看包是否被修改
[root@localhost~]#rpm -V httpd
S.5...T.  c  /etc/httpd/conf/httpd.conf

验证内容中的 8 个信息的具体内容如下：
S：文件大小是否改变
M：文件的类型或文件的权限（rwx）是否被改变
5：文件 MD5 校验和是否改变（可以看成文件内容是否改变)
D：设备中的主从代码是否改变
L：文件路径是否改变
U：文件的属主(所有者）是否改变
G：文件的所属组是否改变
T：文件的修改时间是否改变

文件类型
c：配置文件（config file）
d：普通文档（documentation)
g：“鬼”文件（ghost file），很少见，就是该文件不应该被这个 RPM 包包含
l：授权文件（license file）
r：描述文件（read me）

# ---------------------------------------------
```
**从 rpm 包中提取指定的文件**

当我们不小心删除了系统的配置文件，我们又不想重装系统，只要我们知道被删除的配置文件属于哪个 rpm 包，那么我们就可以把该文件进行还原。

命令格式：`rpm2cpio 包全名 | cpio -idv .文件绝对路径`

`cpio` 的选项：
- `-i`：copy-in 模式，还原
- `-d`：还原时自动新建目录
- `-V`：显示还原过程

示例如下：
```bash
# 查询 ls 命令属于哪个软件包
[root@localhost ~]# rpm -qf /bin/ls 
# 造成 ls 命令误删除假象
[root@localhost ~]# mv /bin/ls /tmp/ 
# 提取 RPM 包中 ls 命令到当前目录的 /bin/ls 下
[root@localhost ~]# rpm2cpio /mnt/cdrom/Packages/coreutils-8.4-19.el6.i686.rpm | cpio -idv ./bin/ls
# 把 ls 命令复制会 /bin/ 目录，修复文件丢失
[root@localhost ~]# cp /root/bin/ls /bin/
```
## yum 命令

在使用 `rpm` 安装某些包时，最常见的问题就是包的依赖性，如果出现了依赖性问题，我们需要提前将所有依赖装好，才能安装我们真正需要的包，使用起来非常麻烦。`yum` 在线命令的出现就为我们解决了这个问题，它能帮助我们自动解决依赖性问题。但是，Redhat 公司认为，`yum` 命令属于售后服务，如果需要购买才能使用。然而，在作为 Redhat 分支之一的 CentOS 中，可以免费使用 `yum` 命令。

前面我们提到，`yum` 命令是在线的，那也就需要服务器联网才能使用。实际上，`yum` 也能从本地光盘、本地文件中获取需要安装的资源。

在使用 `yum` 前，我们必须知道，`yum` 命令管理的也是 RPM 包，只不过该命令是在线的，它比 `rpm` 命令使用起来更加方便而已，并没有 `yum` 包这一说法。

### yum 源

**什么是 yum 源？**

简单来讲，就是通过 `yum` 命令安装某些包时，到哪个地方去下载这些包。系统默认会自带 yum 源，一般在 `/etc/yum.repos.d` 目录下，该目录下以 `.repo` 结尾的都是 yum 源（Linux 只能识别以 `.repo` 结尾的镜像源）。在联网情况下，默认使用的是 `CentOS-Base.repo` 这个 yum 源。

查看 `CentOS-Base.repo` 文件的内容：

```bash
vim /etc/yum.repos.d/CentOS-Base.repo
```

文件内容如下：
```ini
[extras]
gpgcheck=1
gpgkey=http://mirrors.tencentyun.com/centos/RPM-GPG-KEY-CentOS-7
enabled=1
baseurl=http://mirrors.tencentyun.com/centos/$releasever/extras/$basearch/
name=Qcloud centos extras - $basearch
[os]
gpgcheck=1
gpgkey=http://mirrors.tencentyun.com/centos/RPM-GPG-KEY-CentOS-7
enabled=1
baseurl=http://mirrors.tencentyun.com/centos/$releasever/os/$basearch/
name=Qcloud centos os - $basearch
[updates]
gpgcheck=1
gpgkey=http://mirrors.tencentyun.com/centos/RPM-GPG-KEY-CentOS-7
enabled=1
baseurl=http://mirrors.tencentyun.com/centos/$releasever/updates/$basearch/
name=Qcloud centos updates - $basearch
[mycustom]
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/G一KEY-CentoS-6
enabled=1
baseurl=http://mirrors.tencentyun.com/centos/$releasever/updates/$basearch/
name=mycustom - $basearch
```
文件内容说明如下：

名称|说明
---|---
extras、os、updates|容器名称（可以自定义），一定要放在 [ ] 中。
name|容器说明，可以随便写。
mirrorlist|镜像站点，与 baseurl 的功能相同，建议只使用 mirrorlist 和 baseurl 之一
baseurl|yum 源服务器的地址。默认是 CentOS 官方的 yum 源服务器。如果你觉得慢，可以改成你喜欢的 yum 源地址。
enabled|此容器是否生效，如果不写或写成 `enable=1` 都是生效，写成 `enable=0` 就是不生效。
gpgcheck|如果是 1，则指 RPM 的数字证书生效，如果是 0 则不生效。
gpgkey|数字证书的公钥文件保存位置。不用修改。

### 常用命令

---

查询 yum 源中所有可用的软件包列表（慎用，因为输出结果可能有很多）：
```bash
yum list
```
输出内容如下所示：
```
# zlib-static.x86_64 表示软件包名称
# 1.2.7-20.el7_9 表示软件包版本以及支持的平台
# updates 代表所属的容器名称（即 /etc/yum.repos.d/CentOS-Base.repo 文件中，[] 内的名称）
zlib-static.x86_64 1.2.7-20.el7_9 updates
```
---

查询某个软件包以及这个软件包所需要的依赖（注意，在 yum 中，只需要写包名即可）：
```bash
yum search nginx
```
---

通过 `yum` 命令安装软件包，格式 `yum [-option] install 包名`。

**选项：**

- `-y` 自动回答 yes

**示例：**
```bash
yum -y install gcc

# 查看是否安装成功，rpm -qa | grep gcc 也可以
[root@daijf yum.repos.d]# rpm -q gcc
gcc-4.8.5-44.el7.x86_64
```
---

升级软件包，格式 `yum [-option] update 包名`。

**选项：**

- `-y` 自动回答 yes

**示例：**
```bash
yum -y update gcc
```
> **注意：**
> 如果直接使用命令 `yum -y update`，表示升级所有包，包括 Linux 内核。可能出现服务器宕机的情况。

---

通过 `yum` 命令卸载软件包，格式 `yum [-option] remove 包名`。

**选项：**

- `-y` 自动回答 yes

**示例：**

```bash
yum -y remove nginx
```
> **注意：**
> 在使用 `rpm` 命令时，我们知道了软件包的依赖性。假如 a 依赖 b，b 依赖 c，我们安装 a 时，应该依次安装 c、b、a，在卸载 a 时，需要依次卸载 a、b、c。由于 `yum` 命令是自动化的，所以，在卸载时，会自动帮我们移除相关的依赖，但是，很有可能这些依赖是被系统内核所依赖的，如果被移除了，可能导致系统无法使用。所以，`yum` 的安装和卸载命令需要慎用，特别是生产环境。但是，现在的 `yum` 更加智能了，会检测有没有其它包依赖此包。

---

查询 yum 源中所有可用的软件组列表：
```bash
yum grouplist
```
---

通过 `yum` 安装软件包组（安装软件包组时，会安装这个组下面的所有软件包）：
```bash
# 软件包组名可通过命令 yum grouplist 来查看
# 如果软件包组名有特殊字符，则需要使用双引号，如 yum groupinstall "E-mail server"
yum groupinstall 软件包组名
```
---

通过 `yum` 卸载软件包组（卸载软件包组时，会卸载这个组下面的所有软件包）：
```bash
# 软件包组名可通过命令 yum grouplist 来查看
# 如果软件包组名有特殊字符，则需要使用双引号，如 yum groupremove "E-mail server"
yum groupremove 软件包组名
```

## 源码包

之前我们已经提到了源码包和 RPM 包的区别，但那些都是概念上的区别。它们还有一个区别就是安装后的位置不同。

对于 RPM 包来讲，它默认安装在 `/var/lib/rpm/` 目录下，它的命令可能在以下地方存在（大部分都是这样的，但是也有例外）：

路径|说明
---|---
/etc/|配置文件安装目录
/usr/bin/|可执行的命令安装目录
/usr/lib/|程序所使用的函数库保存位置
/usr/share/doc/|基本的软件使用手册保存位置
/usr/share/man/|帮助文件保存位置

而通过源码包进行安装时，需要我们手动指定安装目录（一般指定在 `/usr/local/软件名` 目录下）。

由于源码包和 RPM 包安装位置不同，所以，针对它们的服务管理（如启动、停止、重启等）也是不同的。

RPM 包安装的服务可以使用系统服务管理命令（`service`）来管理，例如 RPM 包安装的 apache 的启动方法是 `/etc/rc.d/init.d/httpd start` 或 `service httpd start`（在 Redhat 中，`service` 就是 `/etc/rc.d/init.d` 的进一步简化，使用 `service 服务名 start` 即可启动服务，在 CentOS 7 中使用 `systemctl` 代替 `service`，即 `systemctl start 服务名`）。

而源码包安装的服务则不能被服务管理命令管理，因为没有安装到默认路径中。所以只能用绝对路径进行服务的管理，如 `/usr/local/djfapp/tomcat/bin/startup.sh`。

### 准备工作

通过源码包安装任何软件之前，都需要确保服务器安装了 `gcc`，因为 Linux 是用 C/C++ 编写的，在 Linux 上通过源码包进行安装，需要将源码编译成 C/C++ 能够识别的机器语言。

查看是否安装了 `gcc`：
```bash
[root@daijf init.d]# rpm -q gcc
gcc-4.8.5-44.el7.x86_64
```
如果没有安装，请执行以下命令进行安装：
```bash
yum -y install gcc
```

### 编译安装

安装注意事项如下：

**如何确定安装过程是否报错？**

1. 安装过程被停止
2. 安装过程停止后，立即出现 error、warning、no 等词汇

> **注意：**
> 有时候，我们安装过程中确实会出现  error、warning、no 等词汇，但是，安装过程并没有停止。一般来讲，这不影响软件的基本使用。

---

安装过程如下：
1. 下载源码包，如 `tomcat9.tar.gz`
2. 解压源码包，如 `tar -zxvf tomcat9.tar.gz`
3. 查看解压后的大小（可省）`du -sh tomcat9`
4. 进入源码包的解压目录 `cd tomcat9`
5. 查看解压后的文件 `ls`。任何源码包解压后都会有 `INSTALL`、`README` 这两个文件，`INSTALL` 文件中描述了安装步骤和安装完成后的启动命令，`README` 中描述了使用手册。
6. 执行 `./configure` 进行软件配置与检查（必须进入解压目录执行，否则需要写全路径，如 `/usr/local/tomcat9/configure`），作用如下（可使用 `./configure --help` 查看可选项）：
    1. 定义需要的功能选项（如定义安装目录 `./configure --prefix=/usr/local/tomcat9/setup`（`--prefix` 用于指定安装的绝对路径））。
    2. 检测系统环境是否符合安装要求。
    3. 把定义好的功能选项和检测系统环境的信息都写入 Makefile 文件，用于后续的编辑（安装完成后会自动生成 Makefile 文件）。
    4. 小结一下第 6 点，简单来讲，就是指定安装目录（如 `./configure --prefix=/usr/local/tomcat9/setup`）
7. 编译 `make` （如果第 6 步和第 7 步报错了，那么只需要执行 `make clean` 来清理编译产生的临时文件；只有执行了 `make install` 命令，才会向步骤 6 中指定的安装目录写入内容）
8. 编译安装 `make install`（只有执行了该命令，才会向步骤 6 中指定的安装目录写入内容）
9. 安装完成后，到 `INSTALL` 文件下查看启动命令。
10. 通过源码包进行安装后，如果需要卸载，仅需删除安装目录即可，不会残留其它垃圾。

**同一台机器上是可以通过 RPM 和源码包来安装同一个软件的，只要它们的安装位置不同即可，但是不推荐同时安装多个相同的软件。**


## 脚本安装包
脚本安装包并不是独立的软件包类型，常见安装的是源码包。脚本安装包是人为把安装过程写成了自动安装的脚本，只要执行脚本，定义简单的参数，就可以完成安装。非常类似于 Windows 下软件的安装方式。



# 用户和用户组管理

## 用户配置文件
### 用户信息文件 

越是对服务器安全性要求高的服务器，越需要建立合理的用户权限等级制度和服务器操作规范。在 Linux 中，主要是通过用户配置文件来查看和修改用户信息。

用户信息文件保存在 `/etc/passwd` 文件中。

```bash
vim /etc/passwd
```
可以借助 `man` 命令来查看配置文件的格式，以及相关说明，如下：
```bash
man 5 pwasswd
```
使用 `man` 命令后，会看到输出的内容包括如下部分：

![image.png](https://note.youdao.com/yws/res/47770/WEBRESOURCE807d477109135c99f8214f7f48b2271f)

也就是说，每一行代表了一个用户，每行的格式如下：
```bash
账号:密码标识:用户ID:用户初始组ID:用户说明信息:家目录:登录之后的 Shell
```
以 root 用户为例，他在文件中存储的内容如下：
```txt
root:x:0:0:root:/root:/bin/bash
```
- **第一位**

    用户名
    
- **第二位**

    密码标识。其中 x 表示用户的密码，可在 `/etc/shadow` 文件中查看密码的密文（使用 SHA 加密生成的 512 位密文）。
    
- **第三位**

    用户 ID。0 表示超级用户，1-499 表示系统用户（伪用户)，500-65535 表示普通用户（较新的 Linux 是从 1000 开始的）。注意，系统识别的其实就是 UID，和用户名没有关系，就跟 IP 与域名的关系一样。所以，用户名为 root 的，不一定是超级用户；但是 UID 为 0 的，一定是超级用户。UID 一般情况下是不会重复的，如果重复了，则系统会把他们当成同一个用户来对待。

- **第四位**

    用户初始组 ID。初始组就是指用户一登录就立刻拥有这个用户组的相关权限，每个用户的初始组只能有一个，一般就是和这个用户的用户名相同的组名作为这个用户的初始组（在新建用户的时候，系统会自动创建一个与用户同名的组，并把用户分配到这个组中）。附加组是指用户可以加入多个其他的用户组，并拥有这些组的权限，附加组可以有多个。一个用户必须有且只能有一个初始组。不建议修改用户的初始组。（可以使用该字段在 `/etc/group` 中对比 GID 来查看用户属于哪个组）

- **第六位**

    用户的家目录。root 的家目录在 `/root`，普通用户的家目录在 `/home/${username}`。用户一登录系统，就会自动进入家目录中。

- **第七位**

    登录之后的 Shell。Shell 就是 Linux 的命令解释器。在 `/etc/passwd` 当中，除了标准 Shell 是 `/bin/bash` 之外，还可以写为 `/sbin/nologin`（表示不允许登录）。

### 影子文件

所谓影子文件，就是指 `/etc/shadow` 这个文件。`/etc/shadow` 是 `/etc/passwd` 这个文件的影子。为什么叫做影子文件呢，我们来看一下这两个文件的权限。

```bash
[root@daijf ~]# ll /etc/passwd
-rw-r--r-- 1 root root 1456 Aug 13 23:01 /etc/passwd
[root@daijf ~]# ll /etc/shadow
---------- 1 root root 884 Aug 13 23:01 /etc/shadow
```

可以看到，`/etc/shadow` 这个文件的权限是 000，也就是说，除了超管外，其它任何人都没有这个文件的权限。

在 `/etc/passwd` 中，使用 x 来表示用户密码的标识，用户真正的密码是保存在 `/etc/shadow` 这个文件中的。在 `/etc/shadow` 这个文件中，保存的是经过 SHA 加密后的密码（512 位）。

看下 `/etc/shadow` 这个文件的内容，部分内容如下：
```txt
root:$1$qoUMlXgA$3blV.7gPgcaSl94t2FKVr.:18712:0:99999:7:::
```
这个文件的格式以及描述，可以使用 `man` 命令查看：
```bash
man 5 shadow
```

`/etc/shadow` 文件的格式如下：
```txt
用户名:加密后的密码:最后一次修改密码的时间:两次修改密码的最小时间间隔:密码有效期:密码警告期:账户有效期:保留字段
```
- **加密后的密码（encrypted password）**

    使用的 `SHA512` 散列算法进行加密。请参考 `crypt(3)` 了解如何解释这个字符串。
    
    例如，如果密码字段包含一些不是 `crypt(3)` 的有效结果的字符串 `!` 或者 `*`（也表示没有密码），用户将不能使用 Unix 密码登录（但用户可以通过其他方式登录系统）。
    
    该字段可以为空，在这种情况下，不需要密码作为指定的登录名进行身份验证。然而，如果密码字段为空，一些读取 `/etc/shadow` 文件的应用程序可能决定不允许任何访问。
    
    以感叹号开头的密码字段表示密码被锁定。该行上的其余字符表示锁定密码之前的密码字段。如下：
    ```txt
    # !$1$zriUZc.9$.HSKNDlXk133lmICFEUST0 表示用户的密码被锁定，即用户不能登录系统
    # $1$zriUZc.9$.HSKNDlXk133lmICFEUST0 表示用户被锁定之前的密码
    djf2:!$1$zriUZc.9$.HSKNDlXk133lmICFEUST0:19238:0:99999:7:::
    ```

- **最后一次修改密码的时间（date of last password change）**

    表示为自 UTC 时间 1970年1月1日00:00 以来的天数。0 有特殊含义，表示用户下次登录时需要修改密码。空字段表示禁用密码老化功能。

- **两次修改密码的最小时间间隔（minimum password age）**

    和第三个字段（最后一次修改密码的时间）比较，表示在上一次就该密码后，必须经过多久才能进行下一次密码的修改（单位：天）。为 0 则表示没有限制。

- **密码有效期（maximum password age）**

    该字段表示，用户的密码在多少天后必须进行修改。超过这个天数后，密码可能仍然有效。用户下次登录时应该被要求更改密码。空字段表示不存在有效期（`maximum password age`）、密码警告期（`password warning period`）和密码不活跃期（`password inactivity period`）。如果该字段小于两次修改密码的最小时间间隔，则用户无法修改密码。该字段默认值是 99999 天，相当于 273 年，也就是永久有效。
    
- **密码警告期（password warning period）**

    该字段的值表示密码到期前的天数。在此期间用户应该得到警告。空字段和值 0 表示没有密码警告期。

- **密码不活跃时期（password inactivity period）**

    该值表示密码过期后的天数，在此期间密码仍可使用（用户应在下一次登录时应该更新密码）。密码过期后，该用户将无法登录。用户应联系管理员。空字段和 0 味着不执行不活跃期（也就意味着密码到期后，用户将不能登录），-1 表示永久有效。

- **账户有效期（account expiration date）**

    帐户到期的日期，表示为自 UTC 时间 1970年1月1日00:00 以来的天数。注意，帐号过期时间和密码过期时间是不同的。如果帐号过期，则不允许用户登录。如果字段为空，则表示该帐户永远不会过期。不应该使用值 0，因为它被解释为没有到期的帐户，或者是在 1970年1月1日到期的帐户。

- **保留字段（reserved field）**

    此字段为将来使用保留。

在上面的内容，我们知道了 `/etc/shadow` 这个文件中的时间都是以 1970年1月1日为基础，在此之后相差的天数，那有没有办法将其转为日期呢？当然是可以的，如下：
```bash
# 18712 表示与 1970-01-01 相差的天数
[root@daijf ~]# date -d "1970-01-01 18712 days"
Fri Mar 26 00:00:00 CST 2021
```
将当前时间转换为与 1970-01-01 相差的天数：
```bash
echo $(($(date --date="2022/09/03" +%s)/86400+1))
```

### 组信息文件和组密码文件

1. **组信息文件 /etc/group**

使用 `vim` 查看 `/etc/group` 这个文件的内容，如下：
```bash
root:x:0:
```
- 第一字段
    
    组名

- 第二字段

    组密码标识
    
- 第三字段

    GID
    
- 第四字段

    组中附加用户


2. **组密码文件 /etc/gshadow**

和用户的密码一样，`/etc/gshadow` 用于存放 `/etc/group` 的密码。使用命令 `vim /etc/gshadow` 的文件内容：
```bash
root:::
```
- 第一字段

    组名
    
- 第二字段

    组密码

- 第三字段

    组管理员用户名

- 第四字段

    组中附加用户

> **说明：**  
> 不建议给组设置密码。

## 用户管理相关文件

**1. 家目录**

**什么是用户的家目录（宿主目录）？**

- 普通用户

    `/home/${username}`。该目录的所有者和所属组都是此用户，权限是 700。新建的用户会自动在 `/home/` 下生成家目录。
- 超级用户

    `/root/`。该目录的所有者和所属组都是 root 用户，权限是 550（root 用户其实有任何目录的任何权限，这个权限只是对于普通用户来讲的）。

如果将普通用户修改为超级用户，那么可以把 `/etc/passwd` 文件中，用户的 UID 修改为 0。普通用户如果被修改成了超级用户，那么它的家目录其实是不会变的，还是在 `/home/${username}` 目录下。Linux 通过命令提示符来判断是 root 用户还是普通用户，超级用户的命令提示符为 `#`，而普通用户是 $，如下：

- 超级用户

    ![image.png](https://note.youdao.com/yws/res/47954/WEBRESOURCE149b0d562de63da875d692688d5e79c4)
    
- 普通用户

    ![image.png](https://note.youdao.com/yws/res/47957/WEBRESOURCE9dddebea30b14800f5625d05a5f13280)

**2. 用户邮箱**

用户邮箱在 `/var/spool/mail/${username}/` 目录下。添加用户时，会自动创建该目录。

**3. 用户模板目录**

用户模板目录在 `/etc/skel/` 下。那么这个模板有什么用呢？我们先来看一下新建的用户，在用户目录下有哪些文件：
```bash
[djf2@daijf ~]$ ls -a
.  ..  .bash_history  .bash_logout  .bash_profile  .bashrc  .cache  .config
```
那么这些文件是从哪里来的呢？其实就是从模板中拷贝而来的。如果我们想要新建用户的家目录下自动创建某个文件，那么我们就可以把这个文件放在模板目录 `/etc/skel/` 下。


## 用户和用户组管理

**1. `useradd`**

命令名称|功能描述|语法
---|---|---
`useradd`|添加用户|`useradd [选项] 用户名`

**选项：**  

- `-u` 手工指定用户的 UID 号
- `-d` 手工指定用户的家目录。默认是 `/home/${username}`
- `-c` 手工指定用户的说明
- `-g` 手工指定用户的初始组。会默认创建与用户名同名的组
- `-G` 指定用户的附加组。一次性添加多个的话，使用逗号分割。
- `-s` 手工指定用户的登录 shell。默认是 `/bin/bash`

在执行 `useradd` 命令添加用户后，会默认往以下几个地方写数据，如下：
```bash
useradd djf1

grep djf1 /etc/passwd
grep djf1 /etc/shadow
grep djf1 /etc/group
grep djf1 /etc/gshadow
ll -d /home/djf1
ll /var/spool/mail/djf1
```
所以，如果我们手动往以上几个目录添加对应的目录或文件内容，那么也可以创建对应的用户，不过这样比较麻烦。一般直接使用 `useradd 用户名` 即可，其它选项可以省略，除非有特别的需要。

如果直接使用 `useradd 用户名`，不添加任何选项。那么会为其自动添加对应的默认值，这些默认值都来自 `/etc/default/useradd`、`/etc/login.defs` 这个文件，如下：

```bash
vim /etc/default/useradd

# useradd defaults file
GROUP=100 # 用户默认组（只在公有模式下失效，Linux 现在都是私有模式）
HOME=/home # 默认的家目录
INACTIVE=-1 # 密码过期宽限天数（shadow 文件的第 7 个字段）
EXPIRE= # 密码失效时间（shadow 文件的第 8 个字段）
SHELL=/bin/bash # 默认的 shell
SKEL=/etc/skel # 模板目录
CREATE_MAIL_SPOOL=yes # 是否建立邮箱
```
```bash
vim /etc/login.defs

# Please note that the parameters in this configuration file control the
# behavior of the tools from the shadow-utils component. None of these
# tools uses the PAM mechanism, and the utilities that use PAM (such as the
# passwd command) should therefore be configured elsewhere. Refer to
# /etc/pam.d/system-auth for more information.
#

# *REQUIRED*
#   Directory where mailboxes reside, _or_ name of file, relative to the
#   home directory.  If you _do_ define both, MAIL_DIR takes precedence.
#   QMAIL_DIR is for Qmail
#
#QMAIL_DIR      Maildir
MAIL_DIR        /var/spool/mail
#MAIL_FILE      .mail

# Password aging controls（见 /etc/shadow 文件）:
#
#       PASS_MAX_DAYS   Maximum number of days a password may be used.
#       PASS_MIN_DAYS   Minimum number of days allowed between password changes.
#       PASS_MIN_LEN    Minimum acceptable password length.
#       PASS_WARN_AGE   Number of days warning given before a password expires.
#
PASS_MAX_DAYS   99999
PASS_MIN_DAYS   0
PASS_MIN_LEN    8
PASS_WARN_AGE   7

#
# Min/max values for automatic uid selection in useradd
#
# 手动添加用户的最小 UID
UID_MIN                  1000
# 手动添加用户的最大 UID
UID_MAX                 60000
# System accounts
# 系统用户的最小 UID
SYS_UID_MIN               201
# 系统用户的最大 UID
SYS_UID_MAX               999

#
# Min/max values for automatic gid selection in groupadd
#
GID_MIN                  1000
GID_MAX                 60000
# System accounts
SYS_GID_MIN               201
SYS_GID_MAX               999

#
# If defined, this command is run when removing a user.
# It should remove any at/cron/print jobs etc. owned by
# the user to be removed (passed as the first argument).
#
#USERDEL_CMD    /usr/sbin/userdel_local

#
# If useradd should create home directories for users by default
# On RH systems, we do. This option is overridden with the -m flag on
# useradd command line.
#
CREATE_HOME     yes

# The permission mask is initialized to this value. If not specified, 
# the permission mask will be initialized to 022.
UMASK           077

# This enables userdel to remove user groups if no members exist.
#
USERGROUPS_ENAB yes

# Use SHA512 to encrypt password.
ENCRYPT_METHOD MD5

MD5_CRYPT_ENAB yes
```

**2. `passwd`**

命令名称|功能描述|语法
---|---|---
`passwd`|给用户设置、更改密码|`passwd [选项] 用户名`

**选项：**  

- `-S` 查询用户密码的密码状态。仅 root 用户可用
- `-1` 暂时锁定用户。仅 root 用户可用。其实就是在 `/etc/shadow` 文件中，给用户的密码最前面加了 `!`
- `-u` 解锁用户。仅 root 用户可用
- `--stdin` 将管道符输出的数据作为用户的密码（在脚本中比较常用）。如 `echo "123" | passwd --stdin djf3`

root 在设置用户的密码时，可以设置任何强度的密码，但是非超级用户只能设置符合相应密码强度的密码。如果直接使用 `passwd`，而不加任何选项和用户名，则表示更改当前用户的密码。


**3. `usermod`**

命令名称|功能描述|语法
---|---|---
`usermod`|修改用户信息|`usermod [选项] 用户名`

**选项（可以使用 `useradd` 的大部分选项）：**  

- `-u` 修改用户的 UID 号
- `-c` 修改用户的说明信息
- `-G` 修改用户的附加组
- `-L` 临时锁定用户 (Lock)
- `-U` 解锁用户锁定（Unlock）

**4. `chage`**

命令名称|功能描述|语法
---|---|---
`chage`|修改用户密码状态|`chage [选项] 用户名`

**选项：**  

- `-l` 列出用户的详细密码状态
- `-d` 修改密码最后一次更改日期
- `-m` 两次密码修改间隔
- `-M` 密码有效期
- `-W` 密码过期前警告天数
- `-I` 密码过后宽限天数
- `-E` 账号失效时间

`chage` 命令通常用于要求用户登录后必须修改密码，使用如下：
```bash
chage -d 0 djf3
```

> **注意：**
> 是 `chage` 命令，而不是 `change`。

**5. `userdel`**

命令名称|功能描述|语法
---|---|---
`userdel`|删除用户|`userdel [选项] 用户名`

**选项：**  

- `-r` 删除用户的同时删除用户家目录

当然，也可以手动删除以下几个文件中对应的内容（不推荐）：
```bash
vi /etc/passwd
vi /etc/shadow
vi /etc/group
vi /etc/gshadow
rm -rf /var/spool/mail/djf1
rm -rf /home/djf1
```
怎么证明用户被删干净了呢？很简单，再使用 `useradd` 添加这个用户，如果报错说用户已存在，那么证明没有删除干净。

**6. `id`**

命令名称|功能描述|语法
---|---|---
`id`|查看用户|`id 用户名`

**7. `su`**

命令名称|功能描述|语法
---|---|---
`su`|切换用户|`su [选项] 用户名`

**选项：**

- `-` 只使用 "-" 代表连带用户的环境变量一起切换（一般来讲，在切换用户时，都建议带上这个选项）
- `-c` 仅执行一次命令，而不切换用户身份

**示例：**

```bash
[root@daijf ~]# su djf1

# 查看环境变量
# root 用户切换到普通用户会自动切换环境变量，而普通用户切换到 root 用户不会自动切换环境变量（需要使用 su - root）
[djf1@daijf root]$ env
XDG_SESSION_ID=18787
HOSTNAME=daijf
SHELL=/bin/bash
TERM=xterm
HISTSIZE=3000
SSH_CLIENT=171.214.221.138 20340 22
SSH_TTY=/dev/pts/0
# 当前的环境变量属于哪个用户
USER=djf1
```
退回到上一个用户：
```bash
exit
```
以 root 身份暂时执行某个命令：
```bash
[djf1@daijf root]$ su - root -c "useradd djf5"
Password: 

[djf1@daijf root]$ su - root -c "passwd djf5"
Password: 
Changing password for user djf5.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.

[djf1@daijf root]$ su djf5
Password: 

[djf5@daijf root]$ 
```

**8. `groupadd`**

命令名称|功能描述|语法
---|---|---
`groupadd`|添加用户组|`groupadd [选项] 组名`

**选项：**

- `-g`  指定组 ID

**9. `groupmod`**

命令名称|功能描述|语法
---|---|---
`groupmod`|添加用户组|`groupmod [选项] 组名`

**选项：**

- `-g` 修改组 ID
- `-n` 修改组名

**示例：**

把组名 group1 修改为 testgrp：
```bash
groupmod -n testgrp group1
```

> **提示：**
> 不建议使用该命令。

**10. `groupdel`**

命令名称|功能描述|语法
---|---|---
`groupdel`|删除用户组|`groupdel 组名`

如果某个用户的初始组是该组，那么该组不能被删除。

**11. `gpasswd`**

命令名称|功能描述|语法
---|---|---
`gpasswd`|把用户添加入组或从组中删除|`gpasswd [选项] 组名`

**选项：**
- `-a 用户名` 把用户加入组
- `-d 用户名` 把用户从组中删除


# 权限管理

通过 `ls -l` 或者 `ll` 命令可以查看文件或文件夹的权限信息，如下：

```bash
# ls -l
drwx------ 2 nobody root 4096 Aug  9  2021 client_body_temp
drwxr-xr-x 2 root   root 4096 Jul 24 23:42 conf
drwx------ 2 nobody root 4096 Aug  9  2021 fastcgi_temp
drwxr-xr-x 3 root   root 4096 Sep 18  2021 html
drwxr-xr-x 2 root   root 4096 Jul 24 21:47 logs
drwx------ 2 nobody root 4096 Aug  9  2021 proxy_temp
drwxr-xr-x 2 root   root 4096 Sep 18  2021 sbin
drwx------ 2 nobody root 4096 Aug  9  2021 scgi_temp
drwx------ 2 nobody root 4096 Aug  9  2021 uwsgi_temp
```
以 `drwxr-xr-x 2 root root 4096 Jul 24 23:42 conf` 为例，请看下面的解释。

`drwxr-xr-x` 表示文件夹的权限，其实这里面包含了四部分，如下图所示：

![image.png](https://note.youdao.com/yws/res/46257/WEBRESOURCE4c82f2b5f38e7e07c0e063a2d6de453f)

对于权限来讲，`r` 表示读（read）权限，`w` 表示写（write）权限，`x` 表示可执行（execute）权限，`-` 表示没有权限（这三者的顺序是固定的，都是以 rwx 这样的顺序出现）。如果只是普通文件的话，没有必要给可执行权限，除非这个文件可以使用 `sh` 或其它命令来执行。


- 资源类型

    `-` 表示文件，`d` 表示文件夹, `l` 表示软链接。
- 所有者权限（u，user）
- 所属组权限（g，group）
- 其他人的权限（o，others）


## ACL 权限

ACL 的全称是 Access Control List (访问控制列表) ，是一个针对文件、目录的访问控制列表。它在 UGO（user、group、others） 权限管理的基础上为文件系统提供一个额外的、更灵活的权限管理机制。它被设计为 UNIX 文件权限管理的一个补充。ACL 允许你给任何的用户或用户组设置任何文件、目录的访问权限。

**为什么需要使用 ACL 权限？**

我们都知道，一个文件或目录的权限是由所有者、所属组、其它人构成的（即上面提到的 UGO）。在某些情况下，我们可能想为某个用户指定具体的权限，但又不想把这个用户加到所属组里面，并且不希望修改其它人的权限。那么这时候，我们就可以利用 ACL 来为用户单独分配权限。


然而，某些 Linux 系统可能不支持 ACL。要想使用 ACL 给某个用户分配某个目录或文件的权限，需要该目录或文件所在的分区支持 ACL 才行。

查看目录所属分区：
```bash
[root@daijf ~]# df -h

# Filesystem 表示所属分区
# Mounted on 表示系统目录
# 可以看到，根目录所在分区为 /dev/vda1
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        909M     0  909M   0% /dev
tmpfs           919M   24K  919M   1% /dev/shm
tmpfs           919M  580K  919M   1% /run
tmpfs           919M     0  919M   0% /sys/fs/cgroup
/dev/vda1        50G   29G   19G  61% /
tmpfs           184M     0  184M   0% /run/user/0
```
查看分区是否支持 ACL：
```bash
[root@daijf ~]# dumpe2fs -h /dev/vda1
dumpe2fs 1.42.9 (28-Dec-2013)
Filesystem volume name:   <none>
Last mounted on:          /
Filesystem UUID:          21dbe030-aa71-4b3a-8610-3b942dd447fa
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype needs_recovery extent 64bit flex_bg sparse_super large_file huge_file uninit_bg dir_nlink extra_isize
Filesystem flags:         signed_directory_hash 
# Default mount options 中的 acl 表示该分区支持 acl
Default mount options:    user_xattr acl
```
如果分区不支持 ACL，那么可以通过下面两种方式来使其支持 ACL。

- 临时生效

    系统重启后失效。
    ```bash
    # 重新挂载根分区 /，并加入 acl 权限
    [root@localhost ~]# mount -o remount,acl /
    ```
- 永久生效

    该方式需要慎用，一旦配置文件修改出错，将导致系统无法正常启动。
    ```bash
    [root@daijf ~]# vim /etc/fstab
    ```
    做如下修改：
    ```bash
    # 有的系统可能显示的 defaults（一般来讲，defaults 已经支持 acl 了）, 我们只需要在后面追加 acl 即可（使用英文逗号隔开）。
    # 可以看到，根分区的 noatime,acl,user_xattr 中已经支持 acl 了。
    UUID=21dbe030-aa71-4b3a-8610-3b942dd447fa            /                    ext4       noatime,acl,user_xattr 1 1
    proc                 /proc                proc       defaults              0 0
    sysfs                /sys                 sysfs      noauto                0 0
    debugfs              /sys/kernel/debug    debugfs    noauto                0 0
    devpts               /dev/pts             devpts     mode=0620,gid=5       0 0
    ```
    重新挂载文件系统，使修改生效：
    ```bash
    # 也可以直接重启动系统来使其生效
    [root@localhost ~]# mount -o remount /
    ```
相关命令如下：

- `getfacl`

命令名称|功能描述|语法
---|---|---
`getfacl`|查看文件、目录的 ACL 权限|`getfacl 文件或目录`

- `setfacl`

命令名称|功能描述|语法
---|---|---
`setfacl`|设置文件、目录的 ACL 权限|`setfacl [选项] 文件或目录`

**选项：**

- `-m` 设置 ACL 权限
- `-x` 删除指定的 ACL 权限
- `-b` 删除所有的 ACL 权限
- `-d` 设置默认的 ACL 权限
- `-k` 删除默认的 ACL 权限
- `-R` 递归设置 ACL 权限

**示例：**

```bash
[root@daijf ~]# cd /tmp/
[root@daijf tmp]# mkdir mytest

[root@daijf tmp]# ll -d mytest/
drwxr-xr-x 2 root root 4096 Sep  4 20:20 mytest/

# 给用户设置 ACL 权限，具体的权限为 rw
# 给组设置 ACL 权限的命令为 setfacl -m g:group1:rw mytest/
[root@daijf tmp]# setfacl -m u:djf2:rw mytest/

# 可以看到，在为 mytest 添加了 ACL 权限后，使用 ll 查看时，权限多了 +
[root@daijf tmp]# ll -d mytest/
drwxrwxr-x+ 2 root root 4096 Sep  4 20:20 mytest/

# 查看 mytest 目录的 ACL 权限
[root@daijf tmp]# getfacl mytest/
# file: mytest/
# owner: root
# group: root
user::rwx
user:djf2:rw- # ACL 权限
group::r-x
mask::rwx # 最大有效权限
other::r-x
```
这里来补充一个知识。在上面，我们使用 `getfacl` 时，输出结果包含了 mask，这个 mask 就是最大有效权限。mask 是用来指定最大有效权限的。如果我给用户赋予了 ACL 权限，是需要和 mask 的权限“相与”才能得到用户的真正权限。可以使用如下命令来修改某个目录或文件的 mask 权限：
```bash
[root@daijf tmp]# setfacl -m m:rw mytest/

[root@daijf tmp]# getfacl mytest/
# file: mytest/
# owner: root
# group: root
user::rwx
user:djf2:rw-
group::r-x			#effective:r--
mask::rw-
other::r-x
```
删除指定的 ACL 权限：
```bash
[root@localhost /]# setfacl -x u:用户名 文件或目录 # 删除指定用户的 ACL 权限
[root@localhost /]# setfacl -x g:组名 文件或目录 # 删除指定用户组的 ACL 权限
```
删除所有的 ACL 权限：
```bash
[root@localhost /]# setfacl -b 文件或目录
```
递归设置 ACL 权限（只对现有的文件或目录有效）（只能对目录使用 `-R` 选项）：
```bash
# 如果执行完这个目录后，再在这个目录下创建新的文件，那么新文件是不会有对应的权限的，这时候需要通过设置默认的 ACL 权限来解决这个问题
[root@daijf tmp]# setfacl -m u:djf3:rwx -R mytest/
```
设置默认的 ACL 权限（只对新建的文件或目录有效）：
```bash
[root@daijf tmp]# setfacl -m d:u:djf3:rwx -R mytest/
```

## 文件特殊权限

### SetUID

1. 只有可以执行的二进制程序才能设置 SUID 权限，给非可执行文件设置 SUID 权限是没有意义的（但是不会报错）。

2. 命令执行者要对该程序拥有 x (执行）权限，命令执行者在执行该程序时获得该文件所有者的身份（在执行程序的过程中灵魂附体为文件的所有者）。

3. SetUID 权限只在该程序执行过程中有效，也就是说身份改变只在程序执行过程中有效。

系统自带的 `passwd` 命令就拥有 SetUID 权限，所以普通可以修改自己的密码。在配置文件一节，我们已经知道了，用户的密码是保存在 `/etc/shadow` 这个文件中的，而这个文件的权限如下：

```bash
[root@daijf mytest]# ll /etc/shadow
---------- 1 root root 1061 Sep  3 17:21 /etc/shadow
```
可以看到，这个文件除了超级用户外，其它任何用户都没有任何权限。用户想要修改自己的密码，那么必然需要有 `/etc/shadow` 这个文件的读写权限，既然普通用户没有任何权限，那普通用户又怎么能修改自己的密码呢？我们来看下 `passwd` 这个命令的权限：
```bash
[root@daijf mytest]# whereis passwd
passwd: /usr/bin/passwd /etc/passwd /usr/share/man/man1/passwd.1.gz

[root@daijf mytest]# ll /usr/bin/passwd 
-rwsr-xr-x 1 root root 27856 Apr  1  2020 /usr/bin/passwd
```
可以看到，`passwd` 这个命令的所有者的权限是 `rws`，这个 `s` 就表示 `SUID`。也就是说，普通用户在执行这个命令时，会自动以该文件所有者的身份执行，而 `/usr/bin/passwd` 这个文件的所有者是 root，即会以 root 身份执行（类似 Windows 的以管理员身份运行）。

设置 SUID 权限：
```bash
# 方式一（CentOS7 不好使）
# 这个 4 就表示 SUID
chmod 4755 a.sh

# 方式二
chmod u+s a.sh
```
取消 SUID 权限：
```bash
# 方式一
chmod 755 a.sh

# 方式二
chmod u-s a.sh
```
这里有一个需要注意的点，如果文件的所有者没有该文件的可执行权限，那么 SUID 的 s 是大写的（这个大写的 S 其实是报错，因为在前面我们已经提到了，SUID 权限的前提是必须有 x 权限），如下：
```bash
[root@daijf mytest]# touch mysh

[root@daijf mytest]# ls -l mysh
-rw-rw-r--+ 1 root root 0 Sep 11 10:37 mysh

[root@daijf mytest]# chmod u+s mysh 

[root@daijf mytest]# ls -l mysh 
-rwSrw-r--+ 1 root root 0 Sep 11 10:37 mysh
```

> **警告**  
> 1. 关键目录应严格控制写权限。比如 `/`、`/usr/bin` 等。
> 2. 用户的密码设置要严格遵守密码三原则
> 3. 对系统中默认应该具有 SetUID 权限的文件作一列表，定时检查有没有这之外的文件被设置了 SetUID 权限
> 4. 除非你明确知道 SUID 权限的用处，否则你一般不要使用 SUID 权限
> 5. 永远不要给 `vi`、`vim` 设置 SUID 权限

### SetGID

SetUID 是针对文件的所有者来讲的，而 SetGID 是针对文件或目录的所属组来讲的。

**对文件来讲：**

1. 只有可执行的二进制程序才能设置 SGID 权限
2. 命令执行者要对该程序拥有 x (执行）权限
3. 在执行过程中，组身份升级为该程序文件的所属组
4. SetGID 权限同样只在该程序执行过程中有效，也就是说组身份改变只在程序执行过程中有效

设置 SGID 权限：
```bash
# 方式一
# 这个 2 就表示 SGID 权限
chmod 2755 文件或目录

# 方式二
chmod g+s 文件或目录
```
取消 SGID 权限：
```bash
# 方式一（CentOS7 不好使）
chmod 755 文件或目录

# 方式二
chmod g-s 文件或目录
```

我们知道，使用 `locate` 命令能够查找系统中的文件，该命令实际上是到 `/var/lib/mlocate/mlocate.db` 本地库中进行搜索，来看一下 `/var/lib/mlocate/mlocate.db` 这个文件的权限：
```bash
[root@daijf mytest]# ll /var/lib/mlocate/mlocate.db
-rw-r----- 1 root slocate 12814402 Sep 11 03:08 /var/lib/mlocate/mlocate.db
```
可以看到，其他人的权限是 000，也就意味着普通用户没有办法读取 `mlocate.db` 这个文件的内容，但是，其实普通用户是可以的，为什么呢？来看一下 `locate` 命令的权限：
```bash
[root@daijf mytest]# whereis locate
locate: /usr/bin/locate /usr/share/man/man1/locate.1.gz

[root@daijf mytest]# ll /usr/bin/locate
-rwx--s--x. 1 root slocate 40520 Apr 11  2018 /usr/bin/locate
```
可以看到，普通用户有 `locate` 命令的执行权限，并且该命令的所属组是 slocate，组的权限是 `--s`，也就意味着有 SGID 的权限。当普通用户执行 `locate` 命令时，用户的所属组会转为 slocate，而 `/var/lib/mlocate/mlocate.db` 这个文件的所属组也是 slocate，并且 slocate 这个组对该文件的权限是 `r--`，也就是有读权限。

> **提示**
> 如果所属组没有 x 权限，那么赋予 SGID 权限后，会变成 S，即无效。同 SUID。


**对目录来讲：**

1. 普通用户必须对此目录拥有 r 和 x 权限（`cd` 命令需要有 x 权限）
2. 普通用户在此目录中的有效组会变成此目录的属组
3. 普通用户对此目录拥有 w 权限时，在该目录中新建的文件的默认所属组是这个目录的所属组

```bash
[root@daijf tmp]# mkdir mytest2

[root@daijf tmp]# ll -d mytest2
drwxr-xr-x 2 root root 4096 Sep 11 11:13 mytest2

[root@daijf tmp]# chmod 2777 mytest2/

[root@daijf tmp]# ll -d mytest2
drwxrwsrwx 2 root root 4096 Sep 11 11:13 mytest2

[root@daijf mytest2]# su - djf1

[djf1@daijf ~]$ cd /tmp/mytest2/

[djf1@daijf mytest2]$ touch abc

[djf1@daijf mytest2]$ ll abc 
-rw-rw-r-- 1 djf1 root 0 Sep 11 11:15 abc
```

> **警告**  
> 一般情况下，不要随便使用 `SGID` 权限。除非你已经知道了它的作用。

### Sticky BIT

Sticky BIT 也成 SBIT，即粘着位。

1. 粘着位目前只对目录有效
2. 需要普通用户对该目录拥有 w 和 x 权限，即普通用户可以在此目录拥有写入权限
3. 如果没有粘着位，假如普通用户拥有 w 权限，那么所以可以删除此目录下所有文件，包括其他用户建立的文件。一但赋予了粘着位，除了 root 可以删除所有文件外，普通用户就算拥有 w 权限，也只能删除自己建立的文件，但是不能删除其他用户建立的文件。

SBIT 的主要作用就是防止用户删除其它用户创建的文件。

```bash
[root@daijf tmp]# ll -d /tmp/
drwxrwxrwt. 10 root root 4096 Sep 11 13:31 /tmp/

[root@daijf tmp]# cd /tmp/

[root@daijf tmp]# touch 123b

[root@daijf tmp]# su - djf3
[djf3@daijf ~]$ cd /tmp/

# 之前我们已经提到过，用户能不能删除文件，是需要看文件所在的目录有没有 wx 权限
[djf3@daijf tmp]$ ll 123b 
-rw-r--r-- 1 root root 0 Sep 11 13:32 123b

[djf3@daijf tmp]$ rm -f 123b 
rm: cannot remove ‘123b’: Operation not permitted
```
通过上面你的例子我们会发现，`/tmp/` 目录就是加了 SBIT 权限，即其他人是 `rwt` 权限。如果其他人的权限没有 w 或 x，那么 T 是大写的，表示无效，如下：
```bash
[root@daijf ~]# cd /tmp/

[root@daijf tmp]# mkdir mytest3

[root@daijf tmp]# ll -d mytest3
drwxr-xr-x 2 root root 4096 Sep 11 13:36 mytest3

[root@daijf tmp]# chmod 1774 mytest3

[root@daijf tmp]# ll -d mytest3
drwxrwxr-T 2 root root 4096 Sep 11 13:36 mytest3
```
设置 SBIT 权限：
```bash
# 方式一
# 1 就表示 SBIT
chmod 1777 目录

# 方式二
chmod o+t 目录
```

取消 SBIT 权限：
```bash
# 方式一（CentOS7 不好使）
chmod 777 目录

# 方式二
chmod o-t 目录
```
其实，我们也可以为文件或目录同时设置 SUID、SGID、SBIT 权限，如下：
```bash
chmod 7777 文件或目录
```
但是，并不推荐这样做，这样做没有意义，因为 SUID 只能用于文件，SGID 可以用于文件或目录，SBIT 只能用于目录。


## chattr 命令

使用 `man chattr` 命令查看 `chattr` 的作用，`change file attributes on a Linux file system`，即 `chattr` 是用于改变 Linux 文件系统中的文件属性的。

命令格式：`chattr [+-=] [options] 文件或目录`

- `+` 增加某个权限
- `-` 删除某个权限
- `=` 最终的权限

**选项**
- `i` 

    如果对文件设置 `i` 属性，那么不允许对文件进行删除、改名，也不能添加和修改数据；如果对目录设置 `i` 属性，那么只能修改目录下文件的数据，但不允许建立和删除文件。**此选项对 root 用户也生效。**
    
- `a`

    如果对文件设置 `a` 属性，那么只能在文件中增加数据，但是不能删除、修改数据，也不能删除文件本身、改名；如果对目录设置 `a` 属性，那么只允许在目录中建立和修改文件，但是不允许删除。**此选项对 root 用户也生效。**

**示例**

给文件添加 `i` 属性：
```bash
[root@daijf tmp]# touch a1

[root@daijf tmp]# echo 123 >> a1

[root@daijf tmp]# cat a1
123

[root@daijf tmp]# ll a1
-rw-r--r-- 1 root root 4 Sep 11 13:57 a1

[root@daijf tmp]# chattr +i a1

[root@daijf tmp]# lsattr -a a1
----i--------e-- a1

[root@daijf tmp]# echo 123 >> a1
-bash: a1: Permission denied
```
给文件添加 `a` 属性：
```bash
[root@daijf tmp]# touch a2

[root@daijf tmp]# echo 123 >> a2

[root@daijf tmp]# chattr +a a2

# 只能使用 echo 方式追加，不能使用 vim
[root@daijf tmp]# echo 1 >> a2

[root@daijf tmp]# cat a2
123
1

[root@daijf tmp]# echo 12 > a2
-bash: a2: Operation not permitted

[root@daijf tmp]# rm -f a2
rm: cannot remove ‘a2’: Operation not permitted
```



## lsattr 命令

该命令需要配合 `chattr` 命令使用，用于查看文件的属性。

命令格式：`lasattr [选项] 文件或目录`

**选项：**

- `-a` 显示所有文件和目录
- `-d` 若目标是目录，仅列出目录本身的属性

**示例：**

```bash
[root@daijf tmp]# touch a1

[root@daijf tmp]# chattr +i a1

[root@daijf tmp]# touch a2

[root@daijf tmp]# chattr +a a2

# 其中的 e 是自带的，不同的文件系统可能不同
[root@daijf tmp]# lsattr .
----i--------e-- ./a1
-----a-------e-- ./a2
```
## sudo 命令

sudo 的操作对象是系统命令（即文件）。它能把本来只能超级用户执行的命令赋予普通用户。

把命令赋予普通用户：
```bash
# 其实修改的就是 /etc/sudoers 这个文件，与 vim /etc/sudoers 效果相同
visudo
```
执行 `visudo` 或者 `vim /etc/sudoers` 修改文件，一般仅需修改如下内容即可：
```
## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL
djf    ALL=(ALL)       ALL

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
```

可以使用 `man 5 sudoers` 查看配置文件的内容格式以及说明。

文件格式为：

- `用户名  被管理的 IP 地址或者网段=(可使用的身份)（括号可省，省略或者写 ALL，就代表以 root 身份执行）  授权命令所在的绝对路径`
- `%组名  被管理的 IP 地址或者网段=(可使用的身份)（括号可省，省略或者写 ALL，就代表以 root 身份执行）  授权命令所在的绝对路径`

**如何理解被管理的 IP 地址或者网段？**

其实就是说，用户可以在哪台机器上使用授权的命令（不是来源的 IP，是目标机器的 IP）。

**示例：**

```bash
# 把 /sbin/shutdown - r now 这个命令授权给 djf1
djf1 ALL= /sbin/shutdown - r now

# 与上面的写法等价
djf1 ALL=(ALL) /sbin/shutdown - r now

djf2 ALL= /sbin/shutdown
```


**普通用户怎么执行授权的命令？**
```bash
# 查看可用的授权命令
sudo -l

# 执行命令（需要加上 sudo 才能使用 /etc/sudoers 中授予的命令）
sudo 命令
```

> **警告**  
> 禁止在 `/etc/sudoers` 中给普通用户赋予 `vim` 权限。因为 `/etc/sudoers` 中的命令是以 root 身份执行的。


# 变量

变量是计算机内存的单元，其中存放的值可以改变。当 Shell 脚本需要保存一些信息时，如一个文件名或是一个数字，就把它存放在一个变量中。每个变量有一个名字，所以很容易引用它。使用变量可以保存有用信息，使系统获知用户相关设置，变量也可以用于保存暂时信息。

**变量使用**  

- 变量名称可以由字母、数字和下划线组成，但是不能以数字开头。
- 在 bash 中，变量的默认类型都是字符串型，如果要进行数值运算，则必修指定变量类型为数值型。
- 变量用等号进行赋值，**等号左右两侧不能有空格**。
- 如果变量的值有空格，需要使用单引号或双引号包括。
- 在变量的值中，可以使用 "\\" 转义符。
- 如果需要增加变量的值，那么可以进行变量值的追加（类似字符串拼接），不过变量需要用双引号 "$变量名" 包含或用 ${变量名} 包含。
- 如果是把命令的结果作为变量值赋予变量，则需要使用反引号或 $() 包含命令。`如 mydate=$(date)`
- 环境变量名建议大写，便于区分。

**变量分类**

- 用户自定义变量
- 环境变量：这种变量中主要保存的是与系统操作环境相关的数据。
- 位置参数变量：这种变量主要用来向脚本当中传递参数或数据，变量名不能自定义，变量作用是固定的。
- 预定义变量：是 Bash 中已经定义好的变量，变量名不能自定义，变量作用也是固定的。


## 用户自定义变量（本地变量）

定义变量：

```bash
# 直接在命令行中输入即可
name=djf
```

使用变量：
```bash
echo $name
```

变量追加：
```bash
[root@daijf ~]# mynumber=1

[root@daijf ~]# mynumber="$mynumber"23

[root@daijf ~]# echo $mynumber
123

[root@daijf ~]# mynumber=${mynumber}456

[root@daijf ~]# echo $mynumber
123456
```
查看变量：
```bash
# 会显示系统内所有的变量，包括环境变量
set

set | grep mynumber
```
删除变量：
```bash
unset mynumber
```

## 环境变量

用户自定义变量只在当前的 Shell 中生效，而环境变量会在当前 Shell 和这个 Shell 的所有子 Shell 中生效。如果把环境变量写入相应的配置文件，那么这个环境变量就会在所有的 Shell 中生效。

**什么是当前 shell 和子 shell 呢？**

在 shell 脚本中，我们已经知道了，Linux 的 shell 有很多类别，现在的 Linux 默认是 bash，如果我们想要切换到其它 shell，那么直接使用对应的 shell 命令即可。比如切换到 `sh`，那么直接使用 `sh` 命令即可，然后，我们就能进入到 `sh` 这个 shell 中了，这个 `sh` 就是 `bash` 的子 shell，可以通过 `exit` 命令退出这个子 shell。在子 shell 中还可以再使用子 shell。那么，我们如何确认当前所在的 shell 是哪个 shell 呢？可以通过 `pstree` 命令进行查看。
```bash
# 切换到 sh 这个子 shell
[root@daijf ~]# sh

# 查看进程树
sh-4.2# pstree
systemd─┬─YDLive─┬─YDService─┬─sh───6*[{sh}]
        │        │           └─22*[{YDService}]
        │        └─7*[{YDLive}]
        ├─acpid
        ├─2*[agetty]
        ├─atd
        ├─auditd───{auditd}
        ├─barad_agent─┬─barad_agent
        │             └─barad_agent───2*[{barad_agent}]
        ├─beam.smp─┬─erl_child_setup───inet_gethost───inet_gethost
        │          └─80*[{beam.smp}]
        ├─clckhouse-watch───clickhouse-serv───175*[{clickhouse-serv}]
        ├─crond
        ├─dbus-daemon
        ├─dhclient
        ├─dockerd-current─┬─docker-containe───7*[{docker-containe}]
        │                 └─19*[{dockerd-current}]
        ├─epmd
        ├─lsmd
        ├─lvmetad
        ├─nginx───nginx
        ├─ntpd
        ├─polkitd───6*[{polkitd}]
        ├─rhsmcertd
        ├─rsyslogd───2*[{rsyslogd}]
        ├─sgagent───{sgagent}
        ├─sshd───sshd───bash───sh───pstree # 可以看到，我们现在使用的 shell 是 sh，它的父 shell 是 bash。sshd 表示我们是远程连接的。
        ├─systemd-journal
        ├─systemd-logind
        ├─systemd-udevd
        └─tuned───4*[{tuned}]
```

**使用**

定义环境变量：
```bash
# 直接使用 export 命令即可
# 环境变量的名称建议大写
export myname=zs
```
将普通变量转为环境变量：
```bash
myname=zs
export myname
```
查看环境变量：
```bash
env

# set 命令能看到所有的变量，包括环境变量
# env 命令只能查看环境变量
```
使用环境变量：
```bash
echo $JAVA_HOME
```
删除环境变量：
```bash
unset JAVA_HOME
```
追加环境变量：
```bash
# 只能临时生效，重启后会还原
PATH="$PATH":/root
```


**系统提示符变量**

不知道你注意没有，我们在 Linux 中，前面都有一段标识，如下：
```bash
[root@daijf ~]#
```
这段标识依次表示用户名、主机名、当前所在路径。那这个东西能不能修改呢？当然是可以的，这就是我们接下来要讲的系统预定义变量 `PS1`。
```bash
# 查看变量 PS1 的值
[root@daijf ~]# set | grep PS1
PS1='[\u@\h \W]\$ '
```
可选格式如下：

符号|作用
---|---
\d|显示日期，格式为 "星期 月 日"
\h|显示简写主机名。如默认主机名 "localhost"
\t|显示 24 小时制时间，格式为 "HH:MM:SS"
\T|显示 12 小时制时间，格式为 "HH:MM:SS"
\A|显示 24 小时制时间，格式为 "HH:MM"
\u|显示当前用户名
\w|显示当前所在目录的完整路径
\W|显示当前所在目录的最后一个目录
\\#|执行的第几个命令
\\$|提示符。如果是 root 用户会显示提示符为 "#"，如果是普通用户会显示提示符为 "$"


> **注意** 
> 在修改 `PS1` 这个变量的值时，建议使用单引号，且建议在变量值的后面加一个空格。当然，也不建议修改这个变量的值。

## 位置参数变量

位置参数变量|作用
---|---
$n|n 为数字，$0 代表命令本身，$1-$9 代表第一到第九个参数，十以上的参数需要用大括号，如 ${10}
$\*|这个变量代表命令行中所有的参数，$* 把所有的参数看成一个整体
$@|这个变量也代表命令行中所有的参数，不过 $@ 把每个参数区分对待
$#|这个变量代表命令行中所有参数的个数，不包括 $0

**示例**

两数之和：
```bash
#!/bin/bash
# add.sh
num1=$1
num2=$2
sum=$(($num1+$num2))
echo $sum
```
```bash
chmod +x add.sh
./add.sh 1 2
```
$@ 和 $* 的区别：
```bash
#!/bin/bash#!/bin/bash

for i in "$*"
	do
		echo "$i"
	done

echo "-------------------------------"

p=1

for j in "$@"
	do
		echo "param$p is : $j"
		p=$(($p+1))
	done
```
```bash
[root@daijf djftest]# bash test2.sh zs 21 173
zs 21 173
-------------------------------
param1 is : zs
param2 is : 21
param3 is : 173
```

## 预定义变量

其实，位置参数变量也是预定义变量中的一种。

预定义变量|作用
---|---
$?|上一个命令执行后的返回状态。如果这个变量的值为 0，证明上一个命令正确执行；如果为非 0，则证明上一个命令执行不正确。在 Linux 中执行多条命令（如 `cd / && ls`）时，就是使用了该变量来判断上一个命令是否执行成功。
$$|当前进程的进程号（PID)
$!|最后一个后台运行的进程号（PID）

**示例**  

查看上一个命令的执行状态：
```bash
[root@daijf djftest]# ls
add.sh  test2.sh

[root@daijf djftest]# echo "$?"
0
```
查看当前进程的 PID：
```bash
vim test3.sh
```
```bash
#!/bin/bash

echo "current PID: $$"

# & 表示后台运行
find /tmp -name "test1*" &

echo "damon PID: $!"
```
```bash
[root@daijf djftest]# bash test3.sh 
current PID: 3598
damon PID: 3599
```
## 键盘输入

我们在前面已经学过 $1 这些形式的变量可以用来接收脚本执行过程中的参数，但是，有些时候，我们的参数是不确定的，只能在程序运行过程中通过交互的方式从键盘接收用户的输入内容。这时候就需要有另一种方式来帮助我们，这就是本节中要讲的 `read` 命令。

命令格式：`read [选项] 变量名`

**选项：**

- `-p` 提示信息
- `-t` 等待用户输入的超时时间，单位为秒。超过这个时间，程序会自动往下执行
- `-n` 指定用户能够输入的字符数，一旦达到相应的字符数，程序会立即往下执行，不需要用户按回车
- `-s` 隐藏用户的输入内容（例如输入密码）


**示例：**

```bash
vim test5.sh
```
```bash
#!/bin/bash
read -p "请输入姓名: " name
read -n 2 -p "请输入年龄: " age

echo ""

read -t 5 -s -p "请在5秒内输入密码: " password

echo -e "\n-----------你的信息如下------------\n"

echo "name: $name"
echo "age: $age"
echo "password: $password"
```
```bash
[root@daijf djftest]# bash test5.sh 
请输入姓名: djf
请输入年龄: 12
请在5秒内输入密码: 
-----------你的信息如下------------

name: djf
age: 12
password: 12
```

## 数值运算与运算符

在 Linux 中进行数值运算，你很有可能就想到下面的写法：
```bash
[root@daijf djftest]# num1=1
[root@daijf djftest]# num2=2
[root@daijf djftest]# sum=$num1+$num2

[root@daijf djftest]# echo $sum
1+2
```
这是为什么呢？因为在 Linux 中，默认情况下，所有的输入都是字符串，当我们直接使用运算符时，相当于进行字符串的拼接。

**declare 声明变量类型：**

语法：`declare [+/-] [选项] 变量名`。

- `-` 给变量设定类型属性（不是笔误）
- `+` 取消变量的类型属性（不是笔误）
- `-i` 将变量声明为整数型
- `-x` 将变量声明为环境变量（与 `export` 命令效果相同）
- `-p` 查看变量的类型

```bash
# 查看变量类型
[root@daijf djftest]# declare -p num1
declare -- num1="1"

# 将 num1 设置为环境变量
[root@daijf djftest]# export num1
[root@daijf djftest]# declare -p num1
declare -x num1="1"

# 将 sum 声明为整型
[root@daijf djftest]# declare -i sum=$num1+$num2
[root@daijf djftest]# echo $sum
3
```
除了 `declare` 命令外，我们还可以使用其它命令：
```bash
# 使用 expr 或 let 命令进行运算，下面的 + 前后必须要有空格
dd=$(expr $num1 + $num2)
dd=$(let $num1 + $num2)
dd=`expr $num1 + $num2`
```
当然，我们推荐使用 $(( )) 或者 $[ ] 来进行运算：
```bash
echo $(($num1+$num2))
echo $[$num1+$num2]
```

与许多编程语言一样，Linux 中也支持常用的运算符。参考如下：
1. https://zj-linux-guide.readthedocs.io/zh_CN/latest/shell/%E5%9F%BA%E6%9C%AC%E8%BF%90%E7%AE%97%E7%AC%A6/

## 变量测试与替换

变量置换方式|变量 y 没有设置|变量 y 为空值|变量 y 设置了值
--|--|---|---
x=${y-新值}|x=新值|x为空|x=$y
x=${y:-新值}|x=新值|x=新值|x=$y
x=${y+新值}|x为空|x=新值|x=新值
x=${y:+新值}|x为空|x为空值|x=新值
x=${y=新值}|x=新值<br/>y=新值|x为空<br>y 的值不变|x=$y<br/>y 的值不变
x=${y:=新值}|x=新值<br>y=新值|x为新值<br/>y为新值|x=$y<br/>y 的值不变
x=${y?新值}|新值输出到标准的错误输出（当成报错输出到屏幕）|x为空|x=$y
x=${y:?新值}|新值输出到标准的错误输出|新值输出到标准的错误输出|x=$y

当然，这种方式在 shell 脚本中使用较多。在 shell 脚本中，也可以使用 if...else 分支来判断。

## 环境变量配置文件

在 Lniux 中，可以识别以下几个位置中的环境变量：

- `/etc/environment`（不要轻易修改此文件）
- `/etc/profile`
- `/etc/profile.d/*.sh`
- `~/.bash_profile`（`~/.profile`）
- `~/.bashrc`
- `/etc/bashrc`（`/etc/bash.bashrc`）

其中 `/etc/environment`、`/etc/profile`、`/etc/profile.d/*.sh`、`/etc/bashrc` 对所有用户都生效，`~/.bash_profile`、`~/.bashrc` 只对当前用户有效。

环境变量配置文件加载顺序（优先级依次降低）：

1. `/etc/profile`
2. `/etc/profile.d/*.sh` 
3. `/etc/profile.d/sh.local`
4. `~/.bash_profile`
5. `~/.bashrc`
6. `/etc/bashrc`


注意，如果在不同的配置文件中定义了相同变量，那到底是追加还是覆盖呢？这就要取决于在配置文件中的写法了，如果后加载的配置文件中写的是 `export PATH=/bin` 的形式，那么后面的同名配置会覆盖前面的同名配置，如果写的 `export PATH=$PATH:/bin` 的形式，那么就是追加。

> **参考**  
> 1. https://blog.csdn.net/yifen4234/article/details/80691434
> 2. https://www.cnblogs.com/youyoui/p/10680329.html


可能你细心地发现了，`/etc/profile` 和 `/etc/bashrc` 这两个文件的内容有很多相同的地方，那么是不是多此一举呢？其实不是，如果你再仔细看 `/etc/bashrc` 这个文件会发现，它是针对不需要用户输入密码进行登录的情况。也就是说，如果你的用户是通过密码进行登录的，那么会加载 `/etc/profile` 这个配置文件，否则加载 `/etc/bashrc` 这个配置文件。那什么情况下，用户可以不使用密码进行登录呢？比如 root 用户切换为普通用户，比如改变 shell 的类型（如从 bash 改为 sh）。

## 其它配置文件和用户登录信息

用户注销时，生效的环境变量配置文件为 `~/.bash_logout`。

登录后的欢迎信息 `/etc/issue`。不知道你发现没，从**本地**登录 Linux 前，通常都会出现一段提示信息。其实这个提示信息就是在 `/etc/issue` 这个文件中定义的，如下：
```bash
\S
Kernel \r on an \m
```
该文件的一些可选项如下：

转义符|作用
---|--
\d|显示当前系统日期
\s|显示操作系统名称
\l|显示登录的终端号，这个比较常用。
\m|显示硬件体系结构，如 i386、i686 等
\n|显示主机名
\o|显示域名
\r|显示内核版本
\t|显示当前系统时间
\u|显示当前登录用户的序列号

上面的配置是用于本地登录的，如果从远程进行登录，读取的是 `/etc/issue.net` 这个文件。转义符在 `/etc/issue.net` 文件中不能使用，该文件中只能显示纯文本。但是，是否显示此欢迎信息，由 ssh 的配置文件 `/etc/ssh/sshd_config` 决定，加入 "Banner /etc/issue.net" 行才能显示（记得重启 SSH 服务)。

其实，`/etc/motd` 这个文件对本地或远程登录都生效（它是登录后的提示信息）。


# Shell 脚本

## 简介

**什么是 Shell？**

Shell 是一个命令行解释器，它为用户提供了一个向 Linux 内核发送请求以便运行程序的程序，用户可以用 Shell 来启动、挂起、停止甚至是编写一些程序。因为计算机只能识别机器语言，所以，我们的程序需要通过 shell 翻译成机器语言。

Shell 可以分为图形界面 shell（微软的 Windows 系列操作系统）和命令行 shell（Linux）两种。传统意义上的 shell 指的是命令行式的 shell，以后如果不特别注明，shell 是指命令行式的 shell。

Shell 还是一个功能相当强大的编程语言，易编写，易调试，灵活性较强。Shell 是解释执行的脚本语言，在 Shell 中可以直接调用系统命令。

**交互式和非交互式 Shell**

交互式模式就是 shell 等待用户的输入，并且执行用户提交的命令。这种模式被称作交互式是因为shell 与用户进行交互。这种模式也是大多数用户非常熟悉的：登录、执行一些命令、签退。当用户签退后，shell 也终止了。  

shell 也可以运行在另外一种模式：非交互式模式。在这种模式下，shell 不与用户进行交互，而是读取存放在文件中的命令，并且执行它们。当它读到文件的结尾，shell 也就终止了。

## 分类

Shell的 两种主要语法类型有 Bourne 和 C，这两种语法彼此不兼容。Bourne 家族主要包括 sh、ksh、Bash、psh、zsh；C 家族主要包括 csh、tcsh。

在 UNIX 中主要有：
- Bourne shell（sh）
- Korn shell（ksh）
- Bourne Again shell（bash）
- POSIX shell（sh）
- C shell（csh，语法结构和 C 语言类似）
- TENEX/TOPS C shell（tcsh）

现在的 Linux 系统，默认是 Bourne Again shell，即 bash，它作为 Linux 中，用户的默认 shell，与 sh（Bourne shell）完全兼容。Bourne shell（sh）在 Lniux 中就是 `.sh` 文件。我们知道，Linux 其实不区分文件扩展名，即 `mysh` 和 `mysh.sh` 都可以作为 shell 脚本，但是呢，一般还是建议带上扩展名，方便我们区分。

查看 Linux 中支持的 shell：
```bash
[root@daijf ~]# cat /etc/shells

/bin/sh
/bin/bash
/sbin/nologin
/usr/bin/sh
/usr/bin/bash
/usr/sbin/nologin
/bin/tcsh
/bin/csh
```
当然，我们可以切换 shell 模式（默认是 `bash`），如下：
```bash
# 切换 shell
[root@daijf ~]# sh

# 退出当前的 shell 模式
sh-4.2# exit
exit
[root@daijf ~]# 
```

## Hello World

```bash
vim hello.sh
```
内容如下：
```bash
#!/bin/bash
# 感叹号必须使用单引号
echo 'hello world!'
```
执行脚本：
```bash
sh hello.sh

# 或者以下命令

bash hello.sh
```

**这里需要注意的是，脚本中的第一句话是 `#!/bin/bash`，这并不是注释，而是告诉 Linux，从这里往下都是脚本。当然，某些情况下，我们的脚本可以不以 `#!/bin/bash` 开头，但它可能会发生某些意想不到的错误。所以，建议所有脚本都以 `#!/bin/bash` 开头**

## 执行脚本的方式

在 Hello World 中，我们使用的是 `sh` 或者 `bash` 命令来执行脚本，例如 `sh hello.sh`。但是，我们还可以直接执行脚本本身，而这需要确保该脚本有可执行权限。

```bash
[root@daijf tmp]# ll hello.sh 
-rw-r--r-- 1 root root 32 Sep 13 20:44 hello.sh

# 添加可执行权限，+x 与 a+x 相同
[root@daijf tmp]# chmod +x hello.sh 

[root@daijf tmp]# ll hello.sh 
-rwxr-xr-x 1 root root 32 Sep 13 20:44 hello.sh

[root@daijf tmp]# hello.sh
-bash: hello.sh: command not found

# 需要通过绝对路径或者相对路径来调用（除非设置了环境变量）
[root@daijf tmp]# ./hello.sh 
hello world!
```
### 脚本换行符

可以通过 `cat -A my.sh` 来查看脚本的换行符，Linux 中的换行符是 $，而 Windows 中的是 ^M$，所以，在 Linux 中执行 Windows 上编写的脚本通常会出错。可以通过 `dos2unix my.sh` 来将 Windows 的格式转换为 Linux 的格式。如果没有 `dos2unix` 这个命令的话，通过 `yum` 进行安装即可 `yum -y install dos2unix`。当然，`unix2dos` 可以将 Linux 格式转为 Windows 格式。



## 注释
我们都知道，在 Linux 的文件中，可以使用 `#` 来表示注释，但是，对于某些文件来件，注释也是有严格要求的，有的注释不能写在与有效代码相同行的前后，并且有的注释必须顶格写。错误写法如下：

1. 与有效代码在同一行
```bash
echo "java" # 注释
```
2. 没有顶格（有缩进）
```bash
echo "java"
  # 注释
```

## 缩进

不知道你发现没有，在 Linux 中，默认的 tab 缩进是 8 个空格，那如何修改呢？（参考本笔记的 vim 部分）。

```bash
vim /etc/vimrc
vim /etc/virc
```

添加如下内容：
```bash
# 下面的 " 表示注释
" 设置文本的 tab 缩进为 2 个空格
set tabstop=2
```
## 条件判断

### 文件判断
选项|作用
---|---
`-a file`|如果 file 存在，则为 true。
`-b file`|如果 file 存在并且是一个块（设备）文件，则为 true。
`-c file`|如果 file 存在并且是一个字符（设备）文件，则为 true。
`-d file`|如果 file 存在并且是一个目录，则为 true。
`-e file`|如果 file 存在，则为 true。
`-f file`|如果 file 存在并且是一个普通文件，则为 true。
`-g file`|如果 file 存在并且设置了组 ID，则为 true。
`-G file`|如果 file 存在并且属于有效的组 ID，则为 true。
`-h file`|如果 file 存在并且是符号链接，则为 true。
`-k file`|如果 file 存在并且设置了它的“sticky bit”，则为 true。
`-L file`|如果 file 存在并且是一个符号链接，则为 true。
`-N file`|如果 file 存在并且自上次读取后已被修改，则为 true。
`-O file`|如果 file 存在并且属于有效的用户 ID，则为 true。
`-p file`|如果 file 存在并且是一个命名管道，则为 true。
`-r file`|如果 file 存在并且可读（当前用户有可读权限），则为 true。
`-s file`|如果 file 存在且其长度大于零，则为 true。
`-S file`|如果 file 存在且是一个网络 socket，则为 true。
`-t fd`|如果 fd 是一个文件描述符，并且重定向到终端，则为 true。这可以用来判断是否重定向了标准输入、输出、错误。
`-u file`|如果 file 存在并且设置了 setuid 位，则为 true。
`-w file`|如果 file 存在并且可写（当前用户拥有可写权限），则为 true。
`-x file`|如果 file 存在并且可执行（有效用户有执行／搜索权限），则为 true。
`file1 -nt file2`|如果 file1 比 file2 的更新时间最近，或者 file1 存在而 file2 不存在，则为 true。
`file1 -ot file2`|如果 file1 比 file2 的更新时间更旧，或者 file2 存在而 file1 不存在，则为 true。
`file1 -ef file2`|如果 file1 和 file2 引用相同的设备和 inode 编号，则为 true。

如何使用呢？见下面两种方式：

- `test` 命令
```bash
[root@daijf djftest]# test -f /etc/passwd

[root@daijf djftest]# echo $?
0

# 等价写法如下
 test -f /etc/passwd && echo "yes" || echo "no"
```
- 使用中括号（两边有空格）
```bash
[root@daijf djftest]# [ -e "/etc/passwd" ]

[root@daijf djftest]# echo $?
0

# 等价写法如下
[ -e "/etc/passwd" ] && echo "yes" || echo "no"
```

### 文件权限判断
选项|作用
---|---
`-r 文件`|判断该文件是否存在，并且是否该文件拥有读权限。如果有，则返回 true
`-w 文件`|判断该文件是否存在，并且是否该文件拥有写权限。如果有，则返回 true
`-x 文件`|判断该文件是否存在，并且是否该文件拥有执行权限。如果有，则返回 true
`-u 文件`|判断该文件是否存在，并且是否该文件拥有 SUID 权限。如果有，则返回 true
`-g 文件`|判断该文件是否存在，并且是否该文件拥有 SGID 权限。如果有，则返回 true
`-k 文件`|判断该文件是否存在，并且是否该文件拥有 SBit 权限。如果有，则返回 true

需要注意的是，上面的选项中，只要 UGO 中任意一个身份有对应的权限，就会返回 true。

### 整数判断
选项|作用
---|---
`integer1 -eq integer2`|如果 integer1 等于 integer2，则为 true。
`integer1 -ne integer2`|如果 integer1 不等于 integer2，则为 true。
`integer1 -le integer2`|如果 integer1 小于或等于 integer2，则为 true。
`integer1 -lt integer2`|如果 integer1 小于 integer2，则为 true。
`integer1 -ge integer2`|如果 integer1 大于或等于 integer2，则为 true。
`integer1 -gt integer2`|如果 integer1 大于 integer2，则为 true。

### 字符串判断
选项|作用
---|---
`string`|如果 string 不为空（长度大于 0），则判断为真。
`-n string`|如果字符串 string 的长度大于零，则判断为真。
`-z string`|如果字符串 string 的长度为零，则判断为真。
`string1 = string2`|如果 string1 和 string2 相同，则判断为真。
`string1 == string2`|等同于 `string1 = string2`。
`string1 != string2`|如果 string1 和 string2 不相同，则判断为真。
`string1 '>' string2`|如果按照字典顺序 string1 排列在 string2 之后，则判断为真。
`string1 '<' string2`|如果按照字典顺序 string1 排列在 string2 之前，则判断为真。

> **注意**  
> `test` 命令内部的 `>` 和 `<`，必须用引号引起来（或者是用反斜杠转义）。否则，它们会被 shell 解释为重定向操作符。

**示例**

```bash
[root@daijf djftest]# test '123' '<' '234' && echo yes || echo no

[root@daijf djftest]# [ '123' '<' '234' ] && echo yes || echo no

# 在 shell 脚本中，比较符可以不写引号
if [ "yes" == "yes" ]; then
  echo "The answer is YES."
```

### 多重判断

选项|作用
---|---
条件 1 `-a` 条件 2|条件 1 和条件 2 同时成立时，才返回 true。等价于 `条件 1 && 条件2`
条件 1 `-o` 条件 2|条件 1 和条件 2 只要有一个为 true，则返回 true。等价于 `条件 1 \|\| 条件2`
`!`条件|取反

---

> **更多判断逻辑请参考**  
> https://wangdoc.com/bash/condition.html


## 流程控制

### `if` 语句

**1. 单个 if 分支**

- 语法 1（常用）

```bash
if [ 判断语句 ];then
# do something (要缩进)
fi
```
- 语法 2
```bash
if [ 判断语句 ]
    then
    # do something
fi    
```

示例：
```bash
#!/bin/bash
# 查看磁盘使用率, 如果大于 80%, 则告警
# 等号两边不能有空格
rate=$(df -h | grep -E "/$" | awk '{print $5}' | cut -d '%' -f 1)

echo "$rate"

if [ $rate -ge 80 ];then
  echo "当前使用率为 $rate%, 服务磁盘使用率超过 80%"
fi
```
**2. if 多分支**
```bash
#!/bin/bash
# 判断学生的成绩
read -p "请输入一个您的成绩(0-100)：" num
if [ $num -gt 100 ]
then
  echo "您输入的数字超过范围，请重新输入"
elif [ $num -ge 80 ]
then
  echo "您的分数为$num，优秀"
elif [ $num -ge 60 ]
then
  echo "您的分数为$num，及格"
else
  echo "您的分数为$num，不及格"
fi
```
```bash
#!/bin/bash
# 判断 MySQL 是否启动，其实可以直接使用 ps 命令。
# 但是，在有些情况下，我们的服务是正常的（通过 ps 命令可以看到该服务的进程），然而，服务本身不能对请求做出响应，这时候，ps 命令就无能为力了。我们可以借助 nmap 命令来实现。
# 需要先安装 nmap （yum install -y nmap）

open=$(nmap -sT 1.15.181.57 | grep tcp | grep mysql | awk '{print $2}')

if [ "$open" == "open" ]
    then
    # 表示服务是正常的
    else
    # 服务不正常
    # 退出程序，且状态码为 1，可以使用 echo $? 查看上一个命令执行后的状态码
        exit 1
fi    
```
### `case` 语句

**语法**
```bash
case $变量名 in
模式1)
    命令序列1
    ;;
模式2)
    命令序列2
    ;;
模式3)
    命令序列3
    ;;
 *)
    无匹配后命令序列
esac
```
**示例**
```bash
#!/bin/bash
# 判断学生的成绩
read -p "请输入一个数字：" num

case $num in
1|2)
  echo "输入的是 1 或者 2"
  ;;
3)
  echo "输入的是 3"
  ;;
*)
  echo "是其它数字 $num"
esac
```
> **case 的其它用法可参考**  
> https://blog.csdn.net/weixin_43357497/article/details/107774070

### `for` 循环

- 语法 1
```bash
for 变量 in 值1 值2 值3 ...
do
# do something
done
```
```bash
#!/bin/bash
# 示例如下

for i in 1 2 3
do
  echo "num is $i"
done
```
```bash
#!/bin/bash
# 批量解压

cd /tmp/djftest/files

ls *.tar.gz > ls.log

# 如果文件是以回车进行分割的行，那么每行也会被当做一个 item
for file in $(cat ls.log)
do
  echo "filename: $file"
  tar -zxf $file &> /dev/null
done

rm -f ls.log
```
- 语法 2
```bash
for ((初始值;循环条件;变量变化))
do
# do something
done
```
```bash
#!/bin/bash
# 计数
sum=0

for ((i=1;i<=100;i=i+1))
do
  sum=$(( $sum + $i ))
done

echo "sum: $sum"
```
### `while` 循环

**语法**：
```bash
while [ 条件表达式 ]
do
# do something
done
```
**示例**：
```bash
#!/bin/bash
# 计数

num=1
sum=0
while [ $num -le 100 ]
do
  sum=$(($sum + $num))
  num=$(($num + 1))
done

echo "result: $sum"
```
### `until` 循环

`until` 与 `while` 相反，`until` 是直到条件成立时才退出循环。

**语法**：
```bash
until [ 条件表达式 ]
do
# do something
done
```
**示例**：
```bash
#!/bin/bash
# 计数

i=100
sum=0

until [ $i -le 0 ]
do
  sum=$(($sum + $i))
  i=$(($i - 1))
done

echo "result: $sum"
```

# 服务管理

## 服务简介与分类

Linux 服务主要分为以下两类：

![Linux服务分类.jpg](https://note.youdao.com/yws/res/49422/WEBRESOURCE447ecc436ac6e1946931c3cc26b6b11f)

xinetd 即 extended internet daemon，xinetd 是新一代的网络守护进程服务程序，又叫超级 Internet 服务器。经常用来管理多种轻量级 Internet 服务。xinetd 提供类似于 inetd + tcp_wrapper 的功能，但是更加强大和安全。

当我们访问 xinetd 服务时，其实我们访问的是经过 xinetd 转发后的服务，所以 xinetd 有点像 nginx。而我们访问独立服务时，不需要经过转发，所以，一般来讲，访问独立服务的响应速度较快。xinetd 现在用得很少了，了解即可。

**启动与自启动**  

- 服务启动

    就是在当前系统中让服务运行，并提供功能。  
    
- 服务自启动

    自启动是指让服务在系统开机或重启之后，随着系统的启动而自动启动服务。

**查看系统已安装的服务**

- 通过 RPM 包安装的服务是否开机自启动

```bash
#  CentOS 7 会提示使用 systemctl list-unit-files 命令
chkconfig --list

# --------------- CentOS7 执行 chkconfig 命令 ------------------
[root@daijf usr]# chkconfig

Note: This output shows SysV services only and does not include native
      systemd services. SysV configuration data might be overridden by native
      systemd configuration.

      If you want to list systemd services use 'systemctl list-unit-files'.
      To see services enabled on particular target use
      'systemctl list-dependencies [target]'.

netconsole     	0:off	1:off	2:off	3:off	4:off	5:off	6:off
network        	0:off	1:off	2:on	3:on	4:on	5:on	6:off

# chkconfig 命令的结果解释如下
# 前面，我们已经知道了如下结论
# 0：关机
# 1：单用户（相当于 Windows 的安全模式，仅启动系统运行所需要的核心服务，通常用于系统修复、数据修复，只有 root 用户可以登录）
# 2：不完全多用户，不含NFS服务
# 3：完全多用户
# 4：未分配
# 5：图形界面
# 6：重启

# 这里的 0:off	1:off	2:off	3:off	4:off	5:off	6:off 分别表示如下内容
# 0:off，表示在关机模式下不进行自启动
# 1:off，表示在单用户模式下不进行自启动
# 2:on，表示在不完全多用户，不含NFS服务模式下进行自启动
# 3:on，表示在完全多用户模式下进行自启动
# 4:on，表示在未分配模式下进行自启动
# 5:on，表示在图形界面模式下进行自启动
# 6:off，表示在重启模式下进行自启动

# 如果我们想为不同级别设置不同的开机自启，那么可以使用如下命令
chkconfig --level 2345 network on # 默认就是 2345

# 关闭开机自启
chkconfig --level 2345 network off # 默认就是 2345


# ---------------------------------------------------

# 查看所有 RPM 包是否正在运行（centos7 中可以用）
service --status-all

# CentOS7 查看所有 RPM 包安装的服务的运行状态（可以结合 grep 命令）
systemctl list-units --type=service
systemctl list-units --type=service | grep tomcat # 相当于 systemctl status tomcat

# CentOS 7 中使用如下命令
# 该命令会调用 less 命令进行显示
systemctl list-unit-files

# 查看指定的服务是否是开机自启
systemctl list-unit-files poweroff.target

# 使用管道符
systemctl list-unit-files | grep docker
```
**查看源码包安装的服务**

通过源码包安装的服务只能在服务的安装目录下进行查看（如果你不知道安装目录，那么就没办法了），一般建议将源码包安装的服务的安装路径放在 `/usr/local` 下。

## RPM 包服务管理

对于使用 `rpm` 或 `yum` 命令安装的 RPM 服务，它们常见的安装目录有如下位置：

- `/etc/init.d`

    在 CentOS6 中，通过 RPM 包安装的软件，它的启动脚本一般都是放在 `/etc/init.d/` 目录下。当然，`/etc/rc.d/init.d/` 目录下的文件和 `/etc/init.d/` 下的文件是相同的。这两个目录下的文件是通过硬链接的方式进行关联的。
    ```bash
    [root@daijf init.d]# ls -i /etc/rc.d/init.d/
    289477 clickhouse-server  275497 functions  275498 netconsole  275499 network  274778 README
    
    [root@daijf init.d]# ls -i /etc/init.d/
    289477 clickhouse-server  275497 functions  275498 netconsole  275499 network  274778 README
    ```
    在 CentOS 7 中，`/etc/rc.d/init.d/` 和 `/etc/init.d/` 目录也是存在的。但是，CentOS 7 中多了一个 `/usr/lib/systemd/system` 目录，这个目录下的文件也是启动脚本。不同之处是，`/etc/rc.d/init.d/` 和 `/etc/init.d/` 下的脚本需要通过 `service xxx start` 来启动，而 `/usr/lib/systemd/system` 目录下的脚本是通过 `systemctl start xxx` 来启动。

- `/etc/sysconfig/`

    初始化环境配置文件位置
    
- `/etc/`

    配置文件位置
    
- `/etc/xinetd.conf`

    `xinetd` 配置文件
    
- `/etc/xinetd.d/`

    基于 `xinetd` 服务的启动脚本

- `/var/lib/`

    服务产生的数据放在这里（`var` 表示可变数据）

- `/var/log/`

    日志（`var` 表示可变数据）

**独立服务的启动方法：**

1. 方式一

    ```bash
    /etc/init.d/服务名 start|stop|status|restart
    ```
2. 方式二

    ```bash
    # 如果服务放在 /etc/init.d/ 或者 /etc/rc.d/init.d/ 目录下，才能使用如下命令
    service 服务名 start|stop|status|restart
    ```

3. 方式三

    ```bash
    # CentOS7 中新增的一种方式（CentOS 7 中也支持上面两种方式）
    # 只有启动脚本放在 /usr/lib/systemd/system/ 目录下，才能使用如下命令
    systemctl start|stop|status|restart 服务名
    ```
**将独立服务设置/关闭开机自启：**
1. 方式一（CentOS6、CentOS7）
    ```bash
    # 开机自启
    # 等价于 chkconfig network on，即默认的级别就是 2345
    chkconfig --level 2345 network on
    
    # 关闭开机自启
    chkconfig network off
    ```
2. 方式二（CentOS7）

    ```bash
    # 设置开机自启
    systemctl enable docker
    
    # 关闭开机自启
    systemctl disable docker
    ```
3. 方式三（不建议使用）

    在所有服务都启动完成之后，用户输入开机密码之前，会读取 `/etc/rc.d/rc.local` 这个文件的内容，并且执行里面的命令（需要该用户有 `/etc/rc.d/rc.local` 这个文件的可执行权限）。所以，我们可以向这个文件中添加一些启动脚本的命令来达到服务开机自启的目的。
    ```bash
    # 系统内有这样两个文件 
    [root@daijf usr]# ls -l /etc/rc.d/rc.local 
    -rwxr-xr-x 1 root root 822 Mar  9  2022 /etc/rc.d/rc.local
    
    [root@daijf usr]# ls -l /etc/rc.local # 它是 /etc/rc.d/rc.local 的软链接
    lrwxrwxrwx 1 root root 13 Nov  8  2021 /etc/rc.local -> rc.d/rc.local
    ```
    ```bash
    vim /etc/rc.d/rc.local
    
    # 该文件的默认内容如下
    
    # THIS FILE IS ADDED FOR COMPATIBILITY PURPOSES
    #
    # It is highly advisable to create own systemd services or udev rules
    # to run scripts during boot instead of using this file.
    #
    # In contrast to previous versions due to parallel execution during boot
    # this script will NOT be run after all other services.
    #
    # Please note that you must run 'chmod +x /etc/rc.d/rc.local' to ensure
    # that this script will be executed during boot.

    touch /var/lock/subsys/local
    /usr/local/qcloud/irq/net_smp_affinity.sh >/tmp/net_affinity.log 2>&1
    /usr/local/qcloud/cpuidle/cpuidle_support.sh &> /tmp/cpuidle_support.log
    /usr/local/qcloud/rps/set_rps.sh >/tmp/setRps.log 2>&1
    /usr/local/qcloud/irq/virtio_blk_smp_affinity.sh > /tmp/virtio_blk_affinity.log 2>&1
    /usr/local/qcloud/gpu/nv_gpu_conf.sh >/tmp/nv_gpu_conf.log 2>&1

    ```
    
**xinetd 服务的启动方式：**
> **参考（使用 telnet 命令）**  
> https://www.cnblogs.com/ToBeExpert/p/9808134.html  
> https://abanger.github.io/CentOS/CentOS7_telnet （这种方式也可以，推荐使用）

## 源码包的服务管理

**启动方式**

一般来讲，通过源码包安装的服务，需要使用绝对路径或者相对路径来启动。一般，建议将安装路径放在 `/usr/local/` 目录下。在通过源码包安装时，解压目录下通常会有一个 `INSTALL` 文件，这个文件中说明了启动脚本所在的位置。

**让 `service` 命令管理源码包的启动脚本**

默认情况下，通过源码包安装的程序，是不能通过 `service` 命令来启动的，但是呢，如果我们想通过 `service` 命令来启动通过源码包安装的程序，那么我们可以使用软链接。如下：
```bash
# 将 /usr/local/redis/redis.service 软链接到 /etc/init.d/ 目录，并命名为 redis
ln -s /usr/local/redis/redis.service /etc/init.d/redis

# 启动软链接
service redis start
```

```bash
# 如果你是 CentOS7，那么推荐使用下面的命令，连接到 /usr/lib/systemd/system 目录下
ln -s /usr/local/redis/redis.service /usr/lib/systemd/system/redis

# 启动
systemctl start redis
```

## 进程管理

进程是正在执行的一个程序或命令，每一个进程都是一个运行的实体，都有自己的地址空间，并占用一定的系统资源。

### 查看进程

命令名称|功能描述|语法
---|---|---
`ps`|查看进程|`ps [选项]`

**选项：**  

- `a`	显示现行终端机下的所有程序，包括其他用户的程序
- `-A`	显示所有程序
- `c`	显示每个程序真正的指令名称，而不包含路径
- `-C <指令名称>`	指定执行指令的名称，并列出该指令的程序的状况
- `-d`	显示所有程序，但不包括阶段作业管理员的程序
- `e`	列出程序时，显示每个程序所使用的环境变量
- `-f`	显示 UID, PPIP, C 与 STIME 栏位
- `f`	用 ASCII 字符显示树状结构，表达程序间的相互关系
- `g`	显示现行终端机下的所有程序，包括所属组的程序
- `-G <群组识别码>`	列出属于该群组的程序的状况
- `h`	不显示标题列
- `-H`	显示树状结构，表示程序间的相互关系
- `-j`	采用工作控制的格式显示程序状况
- `-l`	采用详细的格式来显示程序状况
- `L`	列出栏位的相关信息
- `-m`	显示所有的执行绪
- `n`	以数字来表示 USER 和 WCHAN 栏位
- `-N`	显示所有的程序，除了执行 ps 指令终端机下的程序之外
- `-p <程序识别码>`	指定程序识别码，并列出该程序的状况
- `r`	只列出现行终端机正在执行中的程序
- `-s <阶段作业>`	列出隶属该阶段作业的程序的状况
- `s`	采用程序信号的格式显示程序状况
- `S`	列出程序时，包括已中断的子程序资料
- `-t <终端机编号>`	列出属于该终端机的程序的状况
- `-T`	显示现行终端机下的所有程序
- `u`	以用户为主的格式来显示程序状况（该进程是哪个用户产生的）
- `-U <用户识别码>`	列出属于该用户的程序的状况
- `U <用户名称>`	列出属于该用户的程序的状况
- `v	采用虚拟内存的格式显示程序状况
- `-V 或 V`	显示版本信息
- `-w 或 w`	采用宽阔的格式来显示程序状况
- `x`	显示所有程序，不以终端机来区分
- `X`	采用旧式的 Linux i386 登陆格式显示程序状况
- `-y`	配合选项 `-l` 使用时，不显示F(flag) 栏位，并以 RSS 栏位取代 ADDR 栏位
- `--cols <每列字符数>`	设置每列的最大字符数
- `--headers` 重复显示标题列
- `--help`	在线帮助
- `--info`	显示排错信息
- `--lines <显示列数>`	设置显示画面的列数


**示例**

```bash
ps -aux
ps aux
ps -ef
ps -ef | grep java
```

输出格式的解释：
```bash
# ps -ef 的输出如下
# UID：该进程由哪个用户产生
# PID：进程 ID
# 
UID        PID  PPID  C STIME TTY          TIME CMD

# ps aux 的输出如下
# USER：该进程由哪个用户产生
# PID：进程 ID
# %CPU：该进程的 CPU 占用率
# %MEM：该进程的内存占用率
# VSZ：该进程占用虚拟内存的大小，单位 KB
# RSS：该进程占用真实物理内存的大小，单位 KB
# TTY：该进程是在哪个终端中运行的。其中 tty1 - tty7 代表本地控制台终端，tty1 - tty6 是本地的字符界面终端，tty7 是图形终端。pts/0-255 代表虚拟终端（通常指 ssh 远程登录的终端）。
# STAT：进程状态。常见的状态有 R（运行）、S（睡眠）、T（停止状态）、s（包含子进程）、+（位于后台）
# START：该进程的启动时间
# TIME：该进程占用 CPU 的运算时间。注意，不是系统时间
# COMMAND：产生此进程的命令名

USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
```
### 查看健康状态

`top` 命令会以一定频率实时刷新，默认间隔 3 秒。输出结果默认按照 CPU 的占用率从高到低排序。

命令名称|功能描述|语法
---|---|---
`top`|查看健康状态|`top [选项]`

**选项**

- `-d <秒>`	改变显示的更新速度
- `-c` 切换显示模式
- `-s` 安全模式，不允许交互式指令
- `-i` 不显示任何闲置或僵死的行程
- `-n` 设定显示的总次数，完成后将会自动退出
- `-b` 批处理模式，不进行交互式显示

**示例**

```bash
# 
top
```

**`top` 命令输出结果解释**

```bash
top - 16:58:15 up 30 days,  3:06,  1 user,  load average: 0.00, 0.01, 0.05
Tasks:  85 total,   3 running,  82 sleeping,   0 stopped,   0 zombie
%Cpu(s):  1.0 us,  1.0 sy,  0.0 ni, 98.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1881996 total,   110628 free,   373728 used,  1397640 buff/cache
KiB Swap:        0 total,        0 free,        0 used.  1320192 avail Mem 
```
第一行 `top`：

输出|说明
--|--
`16:58:15`|系统当前时间，默认每 3 秒刷新一次
`up 30 days, 3:06`|计算机从上一次开机到现在，一共运行了 30 天 3 小时 6 分
`1 user`|当前系统登录了 1 个用户
`load average: 0.00, 0.01, 0.05`|系统在之前 1 分钟，5 分钟，15 分钟的平均负载分别为 0.00, 0.01, 0.05。对于单核 CPU 来讲，如果该值超过 1，那么认为系统在对应的时间处于高负载（如果是 8 核的 CPU，可以理解为超过 8 就是高负载）。

第二行 `Tasks`：

输出|说明
--|--
`85 total`|系统当前共有 85 个进程
`3 running, 82 sleeping, 0 stopped, 0 zombie`|系统当前有 3 个进程处于运行状态，82 个进程处于睡眠状态，0 个进程停止，0 个进程僵死（服务处于停止过程中，但是还未完全停止。如果长时间存在僵死进程，那么说明进程停止过程中因为某些原因卡死了，需要人工进行处理）。

第三行 `%Cpu(s)`：

输出|说明
--|--
`1.0 us`|用户占用 CPU 的百分比
`1.0 sy`|系统占用 CPU 的百分比
`0.0 ni`|改变过优先级的用户进程占用 CPU 的百分比
`98.0 id`|CPU 的空闲率（一般认为，该值低于 20% 时，服务器处于高负载）（平时需要多关注）
`0.0 wa`|等待输入/输出的进程的占用 CPU 的百分比
`0.0 hi`|硬中断请求服务占用的 CPU 百分比
`0.0 si`|软中断请求服务占用的 CPU 百分比
`0.0 st`|st (Steal time) 虚拟时间百分比。就是当有虚拟机时，虚拟 CPU 等待实际 CPU 的时间百分比。

第四行 `KiB Mem`：

输出|说明
--|--
`1881996 total`|物理内存的总量，单位 KB 
`110628 free`|空闲的物理内存数
`373720 used`|已经使用的物理内存数量
`1397648 buff/cache`|作为缓冲的内存数量

第五行 `KiB Swap`：

输出|说明
--|--
`0 total`|交换分区（虚拟内存）的总大小
`0 free`|空闲交换分区的大小
`0 used`|已经使用的交互分区的大小
`1320200 avail Mem`|作为缓存的交互分区的大小

一般来说，我们需要关注的是平均负载、CPU 空闲率、内存剩余数量。

使用 `top` 命令后，会进入交互模式，按 `q` 退出。在交互模式下，可以使用如下快捷键进行操作：

- `P`（`shfit` + `p`）

    以 CPU 使用率排序，默认就是此项
    
- `M`（`shfit` + `m`）

    以内存的使用率排序
- `N`（`shift` + `n`）

    以 PID 排序
- `q`

    退出 `top`

- `?` 或 `h`

    显示交互模式的帮助信息

**需要注意的是，`top` 命令本身就是比较浪费资源的**。

### 查看进程树 `pstree`

命令名称|功能描述|语法
---|---|---
`pstree`|查看进程树|`pstree [选项]`


**选项**

- `-p`

    显示进程的 PID
    
- `-u`

    显示进程的所属用户

**示例**

```bash
pstree
```

## 终止进程

命令名称|功能描述|语法
---|---|---
`kill`|终止进程|`kill [选项] [PID]`

**选项**

- `-l` 列出系统支持的信号
- `-s` 指定向进程发送的信号
- `-a` 不限制命令名和进程号的对应关系
- `-p` 不发送任何信号

**示例**

```bash
[root@daijf ~]# kill -l
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
63) SIGRTMAX-1	64) SIGRTMAX	
```

信号代号|信号名称|说明
---|---|---
1|SIGHUP|该信号让进程立即关闭，然后重新读取配置文件之后重启。
2|SIGINT|程序终止信号，用于终止前台进程。相当于输出 ctrl+c 快捷键。
8|SIGFPE|在发生致命的算术运算错误时发出．不仅包括浮点运算错误,还包括溢出及除数为 0 等其它所有的算术的错误。
9|SIGKILL|用来立即结束程序的运行．本信号不能被阻塞、处理和忽略。一般用于强制终止进程。
14|SIGALRM|时钟定时信号，计算的是实际的时间或时钟时间 alarm 函数使用该信号。
15|SIGTERM|正常结束进程的信号，**kill 命令的默认信号**。有时如果进程已经发生问题，这个信号是无法正常终止进程的，此时，我们可以尝试 SIGKILL 信号，也就是信号 9。
18|SIGCONT|该信号可以让暂停的进程恢复执行，本信号不能被阻断。
19|SIGSTOP|该信号可以暂停前台进程，相当于输入 ctrl+z 快捷键。本信号不能被阻断。

**终止进程**

```bash
# 等价于 kill -15 123456
kill 123456

# 强制终止
kill -9 123456

# 重启进程（下面的选项是数字 1，而不是 L）
kill -1 123456
```

命令名称|功能描述|语法
---|---|---
`killall`|使用进程名称来杀死一组进程|`killall [选项][信号] 进程名称`

**选项**

- `-e` 对长名称进行精确匹配
- `-l` 打印所有已知信号列表
- `-p` 杀死进程所属的进程组
- `-i` 交互式杀死进程，杀死进程前需要进行确认
- `-I` 忽略进程名称的大小写
- `-r` 使用正规表达式匹配要杀死的进程名称
- `-s` 用指定的进程号代替默认信号“SIGTERM”
- `-u` 杀死指定用户的进程


**示例**

```bash
killadd -9 mysql
```

命令名称|功能描述|语法
---|---|---
`pkill`|按照进程名杀死进程|`pkill [选项][信号] 进程名称`

**选项**

- `-o` 仅向找到的最小（起始）进程号发送信号
- `-n` 仅向找到的最大（结束）进程号发送信号
- `-P` 指定父进程号发送信号
- `-g` 指定进程组
- `-t` 指定开启进程的终端（按照此终端号踢出用户）

**示例**

```bash
pkill -9 mysql
```

```bash
# 查看系统已经登录的用户
[root@daijf ~]# w
 18:06:55 up 30 days,  4:14,  1 user,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    118.113.111.178  13:03    7.00s  0.03s  0.03s -bash

# 踢出用户
pkill -9 -t pts/0
```

## 工作管理

### 后台执行

在 Windows 中，我们通过最小化的方式可以使程序进入后台运行，而在 Linux 中，也有对应的方法来实现将程序放入后台执行。

**方法一**  

在命令后面跟上 `&` 符号，可以实现将程序放入后台执行。

```bash
java -jar test.jar &
```
**方法二**

命令执行后，使用 `Ctrl` + `Z` 组合键，将其放入后台执行。
```bash
java -jar sb.jar

# 执行完上面的命令后，使用 Ctrl + Z 快捷键，使其后台运行
```

**两种方式的区别**：  

第一种方式将程序放入后台后，程序能够正常运行，而第二种方式会将程序挂起。

**查看后台运行的程序**

也可以使用 `ps` 命令。

命令名称|功能描述|语法
---|---|---
`jobs`|查看后台运行的程序|`jobs [选项]`

选项：

- `l` 显示 PID

示例：

```bash
[root@daijf ~]# jobs
[1]+  Stopped                 top

[root@daijf ~]# jobs -l
[1]- 26491 Stopped (signal)        top
[2]+ 26733 Stopped (signal)        top

# [1] 中的 1 表示工作号，值越小，表示该工作越早放入后台。最晚放入后台的程序，该值是最大的。
```

> **注意**  
> `jobs` 命令的输出结果中，“+”号代表最后一个放入后台的工作，它是工作恢复时，默认恢复的工作。“-”号代表倒数第二个放入后台的工作。

**恢复后台暂停的程序到前台执行**

命令名称|功能描述|语法
---|---|---
`fg`|恢复后台暂停的程序到前台执行|`fg [%][工作号]`

**% 可以省略，但是需要注意工作号和 PID 的区别。**  

示例：

```bash
# fg 命令默认恢复 jobs 中带 “+” 号的，也就是最后一个放入后台的工作
fg %1
```

**恢复后台暂停的程序到后台执行**

命令名称|功能描述|语法
---|---|---
`bg`|恢复后台暂停的程序到后台执行|`bg [%][工作号]`

示例：
```bash
bg %1
```

### 主机名 hostname

查看主机名：
```bash
# 方式一，使用 hostname 命令
hostname

# 方式二，查看配置文件
cat /etc/hostname
```
修改主机名：
```bash
# 方式一（重启后生效）
vim /etc/hostname

# 方式二（会立即生效）
hostnamectl set-hostname 新的主机名

# 注意，修改主机名之后，需要查看 /etc/hosts 文件中的主机名是否也被修改了。如果没有被修改，需要手动去修改。

vim /etc/hosts

# 127.0.0.1 djfcentos1 djfcentos1
# 127.0.0.1 localhost.localdomain localhost
# 127.0.0.1 localhost4.localdomain4 localhost4

# ::1 djfcentos1 djfcentos1
# ::1 localhost.localdomain localhost
# ::1 localhost6.localdomain6 localhost6
```



## 查看系统信息

命令名称|功能描述|语法
---|---|---
`vmstat`|监控系统资源|`vmstat [刷新间隔 总共刷新次数]`

示例：
```bash
# 总共监听 3 次系统资源，每次间隔 1 秒钟
[root@daijf ~]# vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  0      0 112452 242228 1154872    0    0    30   317   13   13  2  1 96  0  0
 0  0      0 112072 242228 1154904    0    0     0     0  481 1045  0  1 99  0  0
 0  0      0 112108 242232 1154912    0    0     0   216  589 1205  2  1 97  0  0
```

命令名称|功能描述|语法
---|---|---
`dmesg`|查看在开机时内核的检测信息|`dmesg`

示例：
```bash
dmesg | grep CPU
```

命令名称|功能描述|语法
---|---|---
`free`|查看内存使用情况|`free [选项]`

选项：

- `-b` 以 Byte 显示内存使用情况
- `-k` 以 KB 为单位显示内存使用情况（默认）
- `-m` 以 MB 为单位显示内存使用情况
- `-g` 以 GB 为单位显示内存使用情况
- `-s` 每间隔多少秒刷新一次
- `-t` 显示内存使用总合
- `-h` 以易读的单位显示内存使用情况

示例：
```bash
# total 显示系统总的可用物理内存和交换空间大小。
# used 显示已经被使用的物理内存和交换空间。
# free 显示还有多少物理内存和交换空间可用使用。
# shared 显示被共享使用的物理内存大小。
# buff/cache 显示被 buffer 和 cache 使用的物理内存大小。
# available 显示还可以被应用程序使用的物理内存大小。
[root@daijf ~]# free -h
              total        used        free      shared  buff/cache   available
Mem:           1.8G        364M        108M        600K        1.3G        1.3G
Swap:            0B          0B          0B
```

文件名称|功能描述
---|---
`/proc/cpuinfo`|保存 CPU 的详细信息

```bash
cat /proc/cpuinfo
```

命令名称|功能描述|语法
---|---|---
`uname`|查看系统与内核相关的信息|`uname [选项]`

选项：

- `-a` 显示系统所有相关信息
- `-m` 显示计算机硬件架构
- `-n` 显示主机名称
- `-r` 显示内核发行版本号
- `-s` 显示内核名称
- `-v` 显示内核版本
- `-p` 显示主机处理器类型
- `-o` 显示操作系统名称
- `-i` 显示硬件平台

示例：
```bash
[root@daijf ~]# uname
Linux

[root@daijf ~]# uname -a
Linux daijf 3.10.0-1160.49.1.el7.x86_64 #1 SMP Tue Nov 30 15:51:32 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux

[root@daijf ~]# uname -r
3.10.0-1160.49.1.el7.x86_64

[root@daijf ~]# uname -s
Linux

[root@daijf ~]# uname -m
x86_64

# 查看系统位数
[root@daijf ~]# file /bin/ls
/bin/ls: ELF 64-bit
```

命令名称|功能描述|语法
---|---|---
`lsb_release`|查看系统发行号|`lsb_release [选项]`

选项：

- `-i` 显示系统名称简写
- `-d` 显示系统全称和版本号
- `-r` 显示版本号
- `-a` 显示LSB所有信息

注意，有的 Linux 发行版没有自带 `lsb_release` 这个命令，但我们可以通过 `/etc/redhat-release` 命令查看，如下：
```bash
[root@daijf ~]# cat /etc/redhat-release 
CentOS Linux release 7.9.2009 (Core)
```

命令名称|功能描述|语法
---|---|---
`lsof`|查看进程占用或打开的文件|`lsof [选项]`

选项：

- `-a` 列出打开文件存在的进程
- `-c <进程名>`	列出指定进程所打开的文件
- `-g`	列出 GID 号进程详情
- `-d <文件号>`	列出占用该文件号的进程
- `+d <目录>` 列出目录下被打开的文件
- `+D <目录>` 递归列出目录下被打开的文件
- `-n <目录>` 列出使用NFS的文件
- `-i <条件>` 列出符合条件的进程
- `-p <进程号>`	列出指定进程号所打开的文件
- `-u` 列出 UID 号进程详情
- `-h` 显示帮助信息
- `-v` 显示版本信息

示例：
```bash
lsof -p 518

# 查看 80 端口被哪个进程占用
lsof -i:80

# 查看 8080-8090 端口哪些进程占用
lsof -i TCP:8080-8090
```
> 可能你已经注意到了，`lsof` 命令查看的不仅仅是文件，也可以查看目录或命令。这是因为，Linux 中万物皆文件。


## 定时任务

想要使用 Linux 中的定时任务，我们必须开启 `crond` 服务。

```bash
# 查看 crond 服务是否开启
systemctl status crond

# 查看 crond 是否开机自启
systemctl list-unit-files | grep crond
```

命令名称|功能描述|语法
---|---|---
`crontab`|管理定时计划任务|`crontab [选项]`

**选项**

- `-e` 编辑某个用户的定时任务（默认为当前用户）
- `-l` 列出某个用户的所有任务（默认为当前用户）
- `-r` 删除某个用户的所有任务（默认为当前用户）
- `-u` 指定用户名字
- `--help` 显示帮助信息

> 命令的说明可以参考 [Linux 给指定用户添加定时任务](https://blog.csdn.net/ren593669257/article/details/95455245)

**示例**

编辑任务：
```bash
# 编辑当前用户的定时任务
crontab -e

# 编辑指定用户的定时任务
crontab -u djf1 -e
```
文件中的内容格式为：
```bash
cron表达式 命令
```

> **注意**  
> Linux 中的 cron 表达式和一般的 cron 表达式有点区别（Linux 的 cron 表达式没有秒）。crontab 表达式在线生成可参考 [crontab](https://tool.lu/crontab/)。

