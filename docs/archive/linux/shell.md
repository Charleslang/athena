# Shell 脚本

## 简介

**什么是 Shell？**

Shell 是一个命令行解释器，它为用户提供了一个向 Linux 内核发送请求以便运行程序的程序，用户可以用 Shell 来启动、挂起、停止甚至是编写一些程序。因为计算机只能识别机器语言，所以，我们的程序需要通过 shell 翻译成机器语言。

Shell 可以分为图形界面 shell（微软的 Windows 系列操作系统）和命令行 shell（Linux）两种。传统意义上的 shell 指的是命令行式的 shell，以后如果不特别注明，shell 是指命令行式的 shell。

Shell 还是一个功能相当强大的编程语言，易编写，易调试，灵活性较强。Shell 是解释执行的脚本语言，在 Shell 中可以直接调用系统命令。

**交互式和非交互式 Shell**

交互式模式就是 shell 等待用户的输入，并且执行用户提交的命令。这种模式被称作交互式是因为 shell 与用户进行交互。这种模式也是大多数用户非常熟悉的，例如登录、执行一些命令、签退。当用户签退后，shell 也终止了。  

shell 也可以运行在另外一种模式，即非交互式模式。在这种模式下，shell 不与用户进行交互，而是读取存放在文件中的命令，并且执行它们。当它读到文件的结尾，shell 也就终止了。

## 分类

Shell 有 Bourne 和 C 两种主要的语法类型，这两种语法彼此不兼容。Bourne 家族主要包括 sh、ksh、Bash、psh、zsh，C 家族主要包括 csh、tcsh。

在 UNIX 中主要有：

- Bourne shell（sh）
- Korn shell（ksh）
- Bourne Again shell（bash）
- POSIX shell（sh）
- C shell（csh，语法结构和 C 语言类似）
- TENEX/TOPS C shell（tcsh）

现在的 Linux 系统，默认是 Bourne Again shell，即 bash。它作为 Linux 中默认的 shell，与 sh（Bourne shell）完全兼容。Bourne shell（sh）在 Linux 中就是 `.sh` 文件。我们知道，Linux 其实不区分文件扩展名，即 `mysh` 和 `mysh.sh` 都可以作为 shell 脚本。但是呢，一般还是建议带上扩展名，方便我们区分。

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

当然，我们可以切换 shell 模式（默认是 `bash`）：

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

可以通过 `cat -A my.sh` 来查看脚本的换行符，Linux 中的换行符是 $，而 Windows 中的是 ^M$。所以，在 Linux 中执行 Windows 上编写的脚本通常会出错。可以通过 `dos2unix my.sh` 来将 Windows 的格式转换为 Linux 的格式。如果没有 `dos2unix` 这个命令的话，通过 `yum` 进行安装即可 `yum -y install dos2unix`。同理，`unix2dos` 可以将 Linux 格式转为 Windows 格式。

## 注释

我们都知道，在 Linux 的文件中，可以使用 `#` 来表示注释。但是，对于某些文件来讲，注释也是有严格要求的，有的注释不能写在与有效代码相同行的前后，并且有的注释必须顶格写。错误写法如下：

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

添加以下内容：

```bash
# 下面的 " 表示注释
" 设置文本的 tab 缩进为 2 个空格
set tabstop=2
```

## 条件判断

### 文件判断

选项|作用
|---|---|
|`-a file`|如果 file 存在，则为 true。|
|`-b file`|如果 file 存在并且是一个块（设备）文件，则为 true。|
|`-c file`|如果 file 存在并且是一个字符（设备）文件，则为 true。|
|`-d file`|如果 file 存在并且是一个目录，则为 true。|
|`-e file`|如果 file 存在，则为 true。|
|`-f file`|如果 file 存在并且是一个普通文件，则为 true。|
|`-g file`|如果 file 存在并且设置了组 ID，则为 true。|
|`-G file`|如果 file 存在并且属于有效的组 ID，则为 true。|
|`-h file`|如果 file 存在并且是符号链接，则为 true。|
|`-k file`|如果 file 存在并且设置了它的“sticky bit”，则为 true。|
|`-L file`|如果 file 存在并且是一个符号链接，则为 true。|
|`-N file`|如果 file 存在并且自上次读取后已被修改，则为 true。|
|`-O file`|如果 file 存在并且属于有效的用户 ID，则为 true。|
|`-p file`|如果 file 存在并且是一个命名管道，则为 true。|
|`-r file`|如果 file 存在并且可读（当前用户有可读权限），则为 true。|
|`-s file`|如果 file 存在且其长度大于零，则为 true。|
|`-S file`|如果 file 存在且是一个网络 socket，则为 true。|
|`-t fd`|如果 fd 是一个文件描述符，并且重定向到终端，则为 true。这可以用来判断是否重定向了标准输入、输出、错误。|
|`-u file`|如果 file 存在并且设置了 setuid 位，则为 true。|
|`-w file`|如果 file 存在并且可写（当前用户拥有可写权限），则为 true。|
|`-x file`|如果 file 存在并且可执行（有效用户有执行／搜索权限），则为 true。|
|`file1 -nt file2`|如果 file1 比 file2 的更新时间最近，或者 file1 存在而 file2 不存在，则为 true。|
|`file1 -ot file2`|如果 file1 比 file2 的更新时间更旧，或者 file2 存在而 file1 不存在，则为 true。|
|`file1 -ef file2`|如果 file1 和 file2 引用相同的设备和 inode 编号，则为 true。|

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

|选项|作用|
|---|---|
|`-r 文件`|判断该文件是否存在，并且是否该文件拥有读权限。如果有，则返回 true|
|`-w 文件`|判断该文件是否存在，并且是否该文件拥有写权限。如果有，则返回 true|
|`-x 文件`|判断该文件是否存在，并且是否该文件拥有执行权限。如果有，则返回 true|
|`-u 文件`|判断该文件是否存在，并且是否该文件拥有 SUID 权限。如果有，则返回 true|
|`-g 文件`|判断该文件是否存在，并且是否该文件拥有 SGID 权限。如果有，则返回 true|
|`-k 文件`|判断该文件是否存在，并且是否该文件拥有 SBit 权限。如果有，则返回 true|

需要注意的是，上面的选项中，只要 UGO 中任意一个身份有对应的权限，就会返回 true。

### 整数判断

|选项|作用|
|---|---|
|`integer1 -eq integer2`|如果 integer1 等于 integer2，则为 true。|
|`integer1 -ne integer2`|如果 integer1 不等于 integer2，则为 true。|
|`integer1 -le integer2`|如果 integer1 小于或等于 integer2，则为 true。|
|`integer1 -lt integer2`|如果 integer1 小于 integer2，则为 true。|
|`integer1 -ge integer2`|如果 integer1 大于或等于 integer2，则为 true。|
|`integer1 -gt integer2`|如果 integer1 大于 integer2，则为 true。|

### 字符串判断

|选项|作用|
|---|---|
|`string`|如果 string 不为空（长度大于 0），则判断为真。|
|`-n string`|如果字符串 string 的长度大于零，则判断为真。|
|`-z string`|如果字符串 string 的长度为零，则判断为真。|
|`string1 = string2`|如果 string1 和 string2 相同，则判断为真。|
|`string1 == string2`|等同于 `string1 = string2`。|
|`string1 != string2`|如果 string1 和 string2 不相同，则判断为真。|
|`string1 '>' string2`|如果按照字典顺序 string1 排列在 string2 之后，则判断为真。|
|`string1 '<' string2`|如果按照字典顺序 string1 排列在 string2 之前，则判断为真。|

:::warning
`test` 命令内部的 `>` 和 `<`，必须用引号引起来（或者是用反斜杠转义）。否则，它们会被 shell 解释为重定向操作符。
:::

**【示例】**

```bash
[root@daijf djftest]# test '123' '<' '234' && echo yes || echo no

[root@daijf djftest]# [ '123' '<' '234' ] && echo yes || echo no

# 在 shell 脚本中，比较符可以不写引号
if [ "yes" == "yes" ]; then
  echo "The answer is YES."
fi
```

### 多重判断

|选项|作用|
|---|---|
|条件 1 `-a` 条件 2|条件 1 和条件 2 同时成立时，才返回 true。等价于 `条件 1 && 条件2`|
|条件 1 `-o` 条件 2|条件 1 和条件 2 只要有一个为 true，则返回 true。等价于 `条件 1 \|\| 条件2`|
|`!`条件|取反|

:::tip
更多判断逻辑请参考[条件判断](https://wangdoc.com/bash/condition.html)。
:::

## 流程控制

### `if` 语句

**【语法】**

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

**【语法】**

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

**【示例】**

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

:::tip
case 的其它用法可参考[case语句](https://blog.csdn.net/weixin_43357497/article/details/107774070)。
:::

### `for` 循环

**【语法 1】**

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

**【语法 2】**

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

**【语法】**

```bash
while [ 条件表达式 ]
do
# do something
done
```

**【示例】**

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

**【语法】**

```bash
until [ 条件表达式 ]
do
# do something
done
```

**【示例】**

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
