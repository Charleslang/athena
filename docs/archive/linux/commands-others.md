# 其它命令

## 关机重启命令 `shutdown`

该命令可用于关机或重启（直接使用 `shutdown` 命令即可立即关机）。但在生产环境中，无论如何不要随便使用 `shutdown` 命令。服务器只能重启，不能关机。在关机之前，建议先停止正在运行的服务。高并发流量下，严禁直接关机或重启，否则可能导致磁盘损坏。

**【选项】**

- `-h` 关机，即 halt
- `-r` 重启，即 reboot
- `-c` 取消前一个关机命令

**【示例】**

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

前面提到了 init 这个命令，它是干嘛的呢？`init` 代表了系统的运行级别，所有的级别如下：

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

## 历史命令 `history`

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`history`|显示历史命令|`history [-options] [历史命令保存文件]`|所有用户|

**【选项】**

- `-c` 清空历史命令。该选项会清除 `~/.bash_history` 文件和缓存中的历史命令，一般不建议使用该选项。
- `-w` 把缓存中的历史命令写入历史命令的保存文件。默认在 `~/.bash_history`。默认情况下，当用户退出后，才会将缓存写入文件。

**【示例】**

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

Linux 默认会保存 1000 条历史命令，可以在环境变量中通过 `HISTSIZE` 进行设置。

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

有时候，我们可能需要临时禁用、启用历史命令。例如，使用命令行连接数据库输入密码时，可能不希望密码被记录到历史命令中。可以使用以下命令：

```bash
# 临时禁用历史命令（仅对当前会话生效，不影响其他会话）
set +o history

# 连接数据库
mysql -u root -p 123456

# 临时启用历史命令（仅对当前会话生效，不影响其他会话）
set -o history

# 查看历史命令
history
```

## 刷新配置文件 `source`

该命令用于重新加载配置文件的内容。语法：`source 文件名`

**【示例】**

重新加载环境变量：

```bash
source /etc/profile
```

当然，也可以使用该命令的语法糖格式：

```bash
. /etc/profile
```

## 命令别名 `alias`

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`alias`|设置/查看别名|`alias [-options] [历史命令保存文件]`|所有用户|

**【示例】**

查看所有命令的别名：

```bash
alias
```

设置命令别名：

```bash
# 将 vim 的别名设置为 vi，使用 vi 命令时，就是使用 vim
alias vi='vim'
```

上面的方式只是临时生效，系统重启后就会消失。如果想要别名永久生效，那么需要写入环境变量 `~/.bashrc` 文件中：

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

:::warning
建议不要将别名的名称设置为系统中已有的命令，否则，系统中的命令会被覆盖。见上面的命令执行顺序。
:::

## 快捷键

|快捷键|作用|
|---|---|
|`Ctrl` + `A`|把光标移动到命令行开头。如果我们输入的命令过长，想要把光标移动到命令行开头时使用。|
|`Ctrl` + `E`|把光标移动到命令行结尾。|
|`Ctrl` + `C`|强制终止当前的命令。|
|`Ctrl` + `L`|清屏，相当于 `clear` 命令。|
|`Ctrl` + `U`|删除或剪切光标之前的命令。我输入了一行很长的命令，不用使用退格键一个一个字符的删除，使用这个快捷键会更加方便。|
|`Ctrl` + `K`|删除或剪切光标之后的内容。|
|`Ctrl` + `Y`|粘贴 `Ctrl` + `U` 或 `Ctrl` + `K` 剪切的内容。|
|`Ctrl` + `R`|在执行 `history` 命令后，按下 `Ctrl` + `R` 之后，就会出现搜索界面，只要输入搜索内容，就会从历史命令中进行搜索。|
|`Ctrl` + `D`|退出当前终端。|
|`Ctrl` + `Z`|暂停，并放入后台。这个快捷键牵扯工作管理的内容，我们在系统管理章节详细介绍。|
|`Ctrl` + `S`|暂停屏幕输出。|
|`Ctrl` + `Q`|恢复屏幕输出。|

## 输入输出重定向

### 标准输入输出

|设备|设备文件名|文件描述符|类型|
|---|---|---|---|
|键盘|/dev/stdin|0|标准输入|
|显示器|/dev/stdout|1|标准输出|
|显示器|/dev/stderr|2|标准错误输出|

:::tip
在 Linux 中 `/dev/null` 表示将输出丢弃，如 `ls > /dev/null`。
:::

### 输出重定向

|类型|符号|作用|
|---|---|---|
|标准输出重定向|`>`|以覆盖的方式，把命令的正确输出输出到指定的文件或设备当中。|
|标准输出重定向|`>>`|以追加的方式，把命令的正确输出输出到指定的文件或设备当中。|
|标准错误输出重定向|`2>`|以覆盖的方式，把命令的错误输出输出到指定的文件或设备当中。|
|标准错误输出重定向|`2>>`|以追加的方式，把命令的错误输出输出到指定的文件或设备当中。|
|同时保存正确输出和错误输出|命令 `>` 文件 `2>&1`|以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中。|
|同时保存正确输出和错误输出|命令 `>>` 文件 `2>&1`|以追加的方式，把正确输出和错误输出都保存到同一个文件当中。|
|同时保存正确输出和错误输出|命令 `&>` 文件|以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中。|
|同时保存正确输出和错误输出|命令 `&>>` 文件|以追加的方式，把正确输出和错误输出都保存到同一个文件当中。|
|同时保存正确输出和错误输出|命令 `>>` 文件1 `2>>` 文件2|把正确的输出追加到文件 1 中，把错误的输出追加到文件 2 中。|

:::tip
任何有输出的命令都可以使用重定向，将输出结果输出到指定文件或设备中。当指定的文件不存在时，会自动创建文件。如 `ls > abc`。
:::

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

### 输入重定向

命令：`wc [选项] [文件名]`

**【选项】**

- `-c` 统计字节数
- `-w` 统计单词数（以空格隔开的算一个单词）
- `-l` 统计行数

|符号|说明|
|---|---|
|<|输入重定向|
|<<|追加输入重定向|

**【示例】**

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

## 读取标准输入的数据 `tee`

|命令|作用|格式|
|---|---|---|
|`tee`|读取标准输入的数据|`tee [选项] 文件`|

**【选项】**

- `-a` 追加写入操作
- `-i` 忽略中断信号
- `— help` 查看帮助信息
- `— version` 显示版本信息

**【示例】**

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

## 多命令顺序执行

|多命令执行|格式|作用|
|---|---|---|
|`;`|命令1`;`命令2|多个命令顺序执行，命令之间没有任何逻辑联系|
|`&&`|命令1`&&`命令2|逻辑与。当命令 1 正确执行，命令 2 才会执行；当命令 1 执行不正确，则命令 2 不会执行|
|`\|\|`|命令1`\|\|`命令2|逻辑或。当命令 1 执行不正确，命令 2 才会执行；当命令 1 正确执行，则命令 2 不会执行|

**【示例】**

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

## 管道符

格式：`命令1 | 命令2`。它的作用是把命令 1 的正确输出作为命令 2 的操作对象。

:::warning 注意
使用管道符的前提是，命令 1 必须有正确输出。如果命令 1 没有输出，则命令 2 不执行；如果命令 1 是错误输出，则命令 2 也不执行。
:::

**【示例】**

```bash
ll /etc/ | more
```
```bash
ls /etc/ | grep "test"
```

## 通配符与其它特殊符号

### 通配符

Linux 中内置通配符，常用的通配符如下（通配符和正则有点区别的）：

|通配符|说明|
|---|---|
|$|以 ... 结尾|
|`^`|以 ... 开头|
|`*`|匹配 0 或多个字符|
|`?`|任意一个字符（必须要有一个字符）|
|`[]`|需要匹配其中任意一个字符（必须要匹配上）|
|`[-]`|匹配范围内的任意一个字符（必须要匹配上）|
|`[^]`|逻辑非，不能出现指定的任意一个字符|
|`{}`|产生一个序列|

**【示例】**

找出以 abc 开头的文件：

```bash
ls abc*
```

### 其它特殊字符

|符号|作用|
|---|---|
|`''`|单引号。在单引号中所有的特殊符号都没有特殊含义。|
|`""`|双引号。在双引号中特殊符号都没有特殊含义，但是 "$"、"`"、"!"、"\\" 是例外。|
|``|反引号。反引号括起来的内容是系统命令，在 bash 中会先执行它。和 $() 作用一样，不过推荐使用 $()，因为反引号非常容易看错。|
|`$()`|和反引号作用一样，用来引用系统命令。|
|`#`|在 shell 脚本中，# 开头的行代表注释。（`#!/bin/bash` 除外）。|
|$|用于调用变量的值，如需要调用变量 name 的值时，需要用 $name 的方式得到变量的值。|
|`\`|转义符。跟在 \ 之后的特殊符号将失去特殊含义，变为普通字符。如 \$ 将输出 $ 符号。|

**【示例】**

```bash
# 输出环境变量 JAVA_HOME 的值
echo $JAVA_HOME
echo "$JAVA_HOME"

# 直接输出 $JAVA_HOME
echo '$JAVA_HOME'

# 执行 date 命令
echo "$(date)"
```

## 正则表达式

正则表达式用来在文件中匹配符合条件的字符串，正则是包含匹配。`grep`、`awk`、`sed` 等命令可以支持正则表达式。  

通配符用来匹配符合条件的文件名、目录名，通配符是完全匹配。`ls`、`find`、`cp` 等这些命令不支持正则表达式，所以只能使用 shell 自己的通配符来进行匹配。

|元字符|作用|
|---|---|
|`*`|前一个字符匹配 0 次或任意多次。|
|`.`|匹配除了换行符外的任意一个字符。|
|`\+`|前一个字符至少出现一次。|
|`^`|匹配行首。例如 `^hello` 会匹配以 hello 开头的行。|
|$|匹配行尾。例如 `hello$` 会匹配以 hello 结尾的行。|
|`[]`|匹配中括号中指定的任意一个字符，只匹配一个字符。|
|`[^]`|匹配除中括号的字符以外的任意一个字符。|
|`\`|转义符。|
|`\{n\}`|表示其前面的字符恰好出现 n 次。例如 `[0-9]\{4\}` 匹配 4 位数。|
|`\{n,\}`|表示其前面的字符出现不小于 n 次。例如 `[0-9]\{2,\}` 表示两位及以上的数字。|
|`\{n,m\}`|表示其前面的字符至少出现 n 次，最多出现 m 次。|


**【示例】**  

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

## 字段提取命令 `cut`

我们知道 `grep` 命令可以提取符合条件的行，而本节中的 `cut` 命令可以提取符合条件的列。

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`cut`|提取符合条件的列|`cut [-options] [文件名]`|所有用户|

**【选项】**

- `f` 提取第几列
- `d` 按照指定分隔符分割列（默认的分隔符是制表符）

注意，`cut` 命令在使用时，必须指定选项。

**【示例】**

现在，我们有一个 `student.txt` 文件，它里面的内容如下（每个字段之间通过制表符分开）：

```bash
[root@daijf djftest]# cat student.txt 
ID	Name	Age	Sex
01	zs  	13	男
02	ls  	23	男
03	ww  	18	女
```

我想提取第 2 和第 3 列，命令如下：

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

## 字符截取命令 `awk`

`awk` 命令常与 `printf` 一起使用。在 Linux 中，默认是没有 `print` 命令的，但是，在与 `awk` 命令一起使用时，可以使用 `print` 命令。`printf` 不会自动换行，而 `print` 命令会自动换行。

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`awk`|提取符合条件的列|`awk ['条件1 {动作1} 条件2 {动作2} ...'] [文件名]`|所有用户|

**【选项】**

- 条件中可以使用任何条件表达式，如 `>`、`<` 等等。可以没有条件。
- 动作可以是输出语句，也可以是流程控制语句（如 `if`、`for` 等）
- `-F` 指定分隔符

**【示例】**

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

## `sed`

sed 是一种几乎包括在所有 UNIX 平台（包括 Linux）的轻量级流编辑器。`sed` 主要是用来将数据进行选取、替换、删除、新增的命令。

我们在前面已经知道了，`vim` 可以用来编辑文件，但它也仅仅是用来编辑文件的，它不能对命令的结果进行编辑，如果想要编辑命令的输出结果，那么需要先将结果写入到文件中，然后再通过 `vim` 命令进行编辑。而 `sed` 命令可以直接编辑命令的输出结果。

**【命令格式】**

`sed [选项] ['动作'] 文件`

**【选项】**

- `-n` 一般 `sed` 命令会把所有数据都输出到屏幕，如果加入此选项，则只会把经过 `sed` 命令处理的行输出到屏幕
- `-e` 允许对输入数据应用多条 `sed` 命令编辑
- `-i` 用 `sed` 的修改结果直接修改读取数据的文件，而不是由屏幕输出

**【动作】**

- `a \` 追加，在当前行后添加一行或多行。添加多行时，除最后一行外，每行末尾需要用 "\\" 代表数据未完结。
- `c \` 行替换，用 c 后面的字符串替换原数据行，替换多行时，除最后一行外，每行末尾需用 "\\" 代表数据未完结。
- `i \` 插入，在当期行前插入一行或多行。插入多行时，除最后一行外，每行末尾需要用 "\\" 代表数据未完结。
- `d` 删除，删除指定的行。
- `p` 打印，输出指定的行。
- `s` 字串替换，用一个字符串替换另外一个字符串。格式为 "行范围s/旧字串/新字串/g" （和 vim 中的替换格式类似）。

**【示例】**

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

## 字符处理命令 `sort`

`sort` 命令会将输出结果进行排序。

**【命令格式】**

`sort [选项] 文件名`

**【选项】**

- `-f` 忽略大小写
- `-n` 以数值型进行排序，默认使用字符串型排序
- `-r` 反向排序
- `-t` 指定分隔符，默认的分隔符是制表符
- `-k n[,m]` 按照指定的字段范围排序。从第 n 字段开始，m 字段结束（默认到行尾）（通常与 `-t` 选项配合使用）

**【示例】**

```bash
sort /etc/passwd
```

## 下载网络文件 `wget`

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`wget`|下载网络文件|`wget [选项] 网址`|所有用户|

`wget` 命令来自于英文词组“web get”的缩写，其功能是用于从指定网址下载网络文件。`wget` 命令非常稳定，一般即便网络波动也不会导致下载失败，而是不断的尝试重连，直至整个文件下载完毕。`wget` 命令支持如 HTTP、HTTPS、FTP 等常见协议，可以在命令行中直接下载网络文件。

**【选项】**

- `-V` 显示版本信息
- `-h` 显示帮助信息
- `-b` 启动后转入后台执行
- `-c` 支持断点续传
- `-O` 定义本地文件名
- `-e <命令>` 执行指定的命令
- `--limit-rate=<速率>` 限制下载速度

**【示例】**

```bash
# 下载 Nginx
wget https://nginx.org/download/nginx-1.22.0.tar.gz

# 将下载的文件命名为 test.tar.gz
wget -O test.tar.gz https://nginx.org/download/nginx-1.22.0.tar.gz

# 限制每秒最高下载速度为 300k
get --limit-rate=300k https://nginx.org/download/nginx-1.22.0.tar.gz
```
