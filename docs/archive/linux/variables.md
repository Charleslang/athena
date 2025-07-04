# 变量

变量是计算机内存的单元，其中存放的值可以改变。当 Shell 脚本需要保存一些信息时，例如一个文件名或一个数字，就把它存放在一个变量中。每个变量都有一个名字，所以很容易引用它。使用变量可以保存有用信息，使系统获取用户相关设置，变量也可以用于保存临时信息。

**变量使用**  

- 变量名称可以由字母、数字和下划线组成，但是不能以数字开头。
- 在 bash 中，变量的默认类型都是字符串，如果要进行数值运算，则必须指定变量类型为数值。
- 变量用等号进行赋值，等号左右两侧不能有空格。
- 如果变量的值有空格，需要使用单引号或双引号包裹。
- 在变量的值中，可以使用 "\\" 转义符。
- 如果需要增加变量的值，那么可以进行变量值的追加（类似字符串拼接），不过变量需要用双引号 "$变量名" 或用 ${变量名} 包裹。
- 如果是把命令的结果作为变量值赋予变量，则需要使用反引号或 $() 包裹命令，例如 `mydate=$(date)`。
- 环境变量名建议大写，便于区分。

**变量分类**

- 用户自定义变量
- 环境变量：这种变量主要保存的是与系统操作环境相关的数据。
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

在 shell 脚本中，我们已经知道了，Linux 的 shell 有很多类别。现在的 Linux 默认是 bash，如果我们想要切换到其它 shell，那么直接使用对应的 shell 命令即可。比如切换到 `sh`，那么直接使用 `sh` 命令即可，然后我们就能进入到 `sh` 这个 shell 中了。这个 `sh` 就是 `bash` 的子 shell，可以通过 `exit` 命令退出这个子 shell。在子 shell 中还可以再使用子 shell。那么，我们如何确认当前所在的 shell 是哪个 shell 呢？可以通过 `pstree` 命令进行查看。

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

## 系统提示符变量

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

|符号|作用|
|---|---|
|\d|显示日期，格式为 "星期 月 日"|
|\h|显示简写主机名。如默认主机名 "localhost"|
|\t|显示 24 小时制时间，格式为 "HH:MM:SS"|
|\T|显示 12 小时制时间，格式为 "HH:MM:SS"|
|\A|显示 24 小时制时间，格式为 "HH:MM"|
|\u|显示当前用户名|
|\w|显示当前所在目录的完整路径|
|\W|显示当前所在目录的最后一个目录|
|\\#|执行的第几个命令|
|\\$|提示符。如果是 root 用户会显示提示符为 "#"，如果是普通用户会显示提示符为 "$"|

:::warning
在修改 `PS1` 这个变量的值时，建议使用单引号，且建议在变量值的后面加一个空格。当然，也不建议修改这个变量的值。
:::

## 位置参数变量

|位置参数变量|作用|
|---|---|
|$n|n 为数字，$0 代表命令本身，$1-$9 代表第一到第九个参数，十以上的参数需要用大括号，如 ${10}|
|$\*|这个变量代表命令行中所有的参数，$* 把所有的参数看成一个整体|
|$@|这个变量也代表命令行中所有的参数，不过 $@ 把每个参数区分对待|
|$#|这个变量代表命令行中所有参数的个数，不包括 $0|

**【示例】**

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

其实，位置参数变量也是预定义变量的一种。

|预定义变量|作用
|---|---
|$?|上一个命令执行后的返回状态。如果这个变量的值为 0，证明上一个命令正确执行；如果为非 0，则证明上一个命令执行不正确。在 Linux 中执行多条命令（如 `cd / && ls`）时，就是使用了该变量来判断上一个命令是否执行成功。|
|$$|当前进程的进程号（PID）|
|$!|最后一个后台运行的进程号（PID）|

**【示例】**  

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

我们在前面已经学过 $1 这些形式的变量可以用来接收脚本执行过程中的参数。但是，有些时候我们的参数是不确定的，只能在程序运行过程中通过交互的方式从键盘接收用户的输入内容。这时候就需要有另一种方式来帮助我们，这就是本节中要讲的 `read` 命令。

**【命令格式】**

`read [选项] 变量名`

**【选项】**

- `-p` 提示信息
- `-t` 等待用户输入的超时时间，单位为秒。超过这个时间，程序会自动往下执行
- `-n` 指定用户能够输入的字符数，一旦达到相应的字符数，程序会立即往下执行，不需要用户按回车
- `-s` 隐藏用户的输入内容（例如输入密码）

**【示例】**

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

**declare 声明变量类型：`declare [+/-] [选项] 变量名`**

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

:::tip
与许多编程语言一样，Linux 中也支持常用的运算符，参考[基本运算符](https://zj-linux-guide.readthedocs.io/zh_CN/latest/shell/%E5%9F%BA%E6%9C%AC%E8%BF%90%E7%AE%97%E7%AC%A6/)。
:::

## 变量测试与替换

|变量置换方式|变量 y 没有设置|变量 y 为空值|变量 y 设置了值|
|--|--|---|---|
|x=${y-新值}|x=新值|x为空|x=$y|
|x=${y:-新值}|x=新值|x=新值|x=$y|
|x=${y+新值}|x为空|x=新值|x=新值|
|x=${y:+新值}|x为空|x为空值|x=新值|
|x=${y=新值}|x=新值<br/>y=新值|x为空<br>y 的值不变|x=$y<br/>y 的值不变|
|x=${y:=新值}|x=新值<br>y=新值|x为新值<br/>y为新值|x=$y<br/>y 的值不变|
|x=${y?新值}|新值输出到标准的错误输出（当成报错输出到屏幕）|x为空|x=$y|
|x=${y:?新值}|新值输出到标准的错误输出|新值输出到标准的错误输出|x=$y|

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

注意，如果在不同的配置文件中定义了相同变量，那到底是追加还是覆盖呢？这就要取决于在配置文件中的写法了。如果后加载的配置文件中写的是 `export PATH=/bin` 的形式，那么后面的同名配置会覆盖前面的同名配置，如果写的 `export PATH=$PATH:/bin` 的形式，那么就是追加。

:::tip 参考
1. https://blog.csdn.net/yifen4234/article/details/80691434
2. https://www.cnblogs.com/youyoui/p/10680329.html
:::

细心的你可能发现了，`/etc/profile` 和 `/etc/bashrc` 这两个文件的内容有很多相同的地方，那么是不是多此一举呢？其实不是，如果你再仔细看 `/etc/bashrc` 这个文件，会发现它是针对不需要用户输入密码进行登录的情况。也就是说，如果你的用户是通过密码进行登录的，那么会加载 `/etc/profile` 这个配置文件，否则加载 `/etc/bashrc` 这个配置文件。那什么情况下，用户可以不使用密码进行登录呢？比如 root 用户切换为普通用户，比如改变 shell 的类型（如从 bash 改为 sh）。

## 其它配置文件和用户登录信息

用户注销时，生效的环境变量配置文件为 `~/.bash_logout`。

登录后的欢迎信息在 `/etc/issue` 文件中。不知道你发现没，从**本地**登录 Linux 前，通常都会出现一段提示信息。其实这个提示信息就是在 `/etc/issue` 这个文件中定义的，如下：

```bash
\S
Kernel \r on an \m
```

该文件的一些可选项如下：

|转义符|作用|
|---|--|
|\d|显示当前系统日期|
|\s|显示操作系统名称|
|\l|显示登录的终端号，这个比较常用。|
|\m|显示硬件体系结构，如 i386、i686 等|
|\n|显示主机名|
|\o|显示域名|
|\r|显示内核版本|
|\t|显示当前系统时间|
|\u|显示当前登录用户的序列号|

上面的配置是用于本地登录的，如果从远程进行登录，读取的是 `/etc/issue.net` 这个文件。在 `/etc/issue.net` 文件中不能使用转义符，该文件只能显示纯文本。但是，是否显示此欢迎信息，需要由 ssh 的配置文件 `/etc/ssh/sshd_config` 决定，加入 "Banner /etc/issue.net" 行才能显示（记得重启 SSH 服务）。

其实，`/etc/motd` 这个文件对本地或远程登录都生效（它是登录后的提示信息）。
