# 文件搜索命令

注意，不推荐使用文件搜索命令，因为它会占用服务器的资源。如果你的服务器访问量很大，那么需要谨慎使用搜索命令。

## find

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`find`|文件搜索|`find [搜索范围] [匹配条件]`|--|`/bin/find`|所有用户|

**【选项】**

- `-name` 根据文件名搜索。区分大小写，且要文件名完全匹配，支持通配符
- `-iname` 根据文件名搜索，不区分大小写
- `-size` 根据文件大小查找
- `-type c` 根据文件类型查找，文件类型 c 的取值如下
    - `d` 目录
    - `c` 字型装置文件
    - `b` 区块装置文件
    - `p` 具名贮列
    - `f` 一般文件
    - `l` 符号连结
    - `s` socket
- `- cmin [+-]n` 查找在过去 n 分钟内文件属性被修改过的文件
- `- amin [+-]n` 在过去 n 分钟内被读取过
- `- mmin [+-]m` 在过去 n 分钟内文件内容被修改
- `- cnewer file` 查找比文件 file 更新的文件
- `- ctime [+-]n` 查找在过去 n 天内创建的文件
- `- mtime [+-]n` 查找在过去 n 天内修改过的文件
- `-a` 同时满足多个条件
- `-o` 满足任意条件
- `[-exec/-ok command] {} \;` 对查找出来的文件进行操作（注意最后有分号，因为 Linux 中的 \ 表示换行）
- `-inum` 根据 i 节点进行查找（需要配合 `ls -i` 使用）（可以通过此方法来查找文件的硬链接，因为它们的 i 节点是相同的）


**【示例】**

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

列出当前目录及其子目录中的所有文件：

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

通过 i 节点删除文件（通常用于文件名比较特殊的情况，如含有特殊字符时，有时候无法直接使用 `rm -f 文件名` 删除）：

```bash
# 查找 i 节点
ls -l

# 通过 i 节点删除
find . -inum ${i 节点号} -ok rm {} \;
```

## locate

`locate` 的效率比 `find` 高。但是，对于新建后的文件，如果马上使用 `locate` 进行查找，其实找不到。因为 `locate` 在查找时，是通过 `locate` 维护的资料库进行查找的，这个资料库需要同步磁盘上的文件（我们其实不知道什么时候同步）（我们也可以通过执行 `updatedb` 命令来手动更新，但是不推荐，因为手动更新特别浪费资源，尤其是服务器的文件较多时）。而 `find` 是实时查找。

`locate` 命令不会查找 `/tmp` 下的文件。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`locate`|在文件资料库中查找文件|`locate 文件名`|--|`/usr/bin/locate`|所有用户|


**【选项】**

- `-i` 忽略大小写


**【示例】**

```bash
# 本身就是模糊搜索
locate 123
```

## which

`which` 通常用于查找命令所在的路径。存放在 `/bin/`、`/usr/bin/` 目录下的命令是所有用户都可以使用的。而存放在 `/sbin`、`/usr/sbin/` 目录下的命令只有 root 用户才可以使用。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`which`|搜索命令所在目录及别名信息|`which 命令`|--|`/usr/bin/which`|所有用户|


**【示例】**

```bash
[root@daijf test1]# which ls
alias ls='ls --color=auto'
	/usr/bin/ls
	
[root@daijf test1]# which chmod
/usr/bin/chmod

[root@daijf test1]# which useradd
/usr/sbin/useradd
```

## whereis

`whereis` 和 `which` 的用法和作用是相同的，只不过 `whereis` 可以列出命令所在的帮助文档所在路径。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`whereis`|搜索命令所在目录及别名信息|`whereis 命令`|--|`/usr/bin/whereis`|所有用户|

**【示例】**

```bash
[root@daijf test1]# whereis cp
# 第二个路径是帮助手册
cp: /usr/bin/cp /usr/share/man/man1/cp.1.gz
```

## grep

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`grep`|在文件中搜寻字串匹配的**行**并输出|`grep -iv [过滤字符串] [文件]`|--|`/bin/grep`|所有用户|

**【选项】**

- `-i` 不区分大小写
- `-v` 排除指定字串（这个是排除指定字符串所在的**行**）
- `-n` 显示在文件内的行号
- `-E` 使用正则表达式进行匹配（`egrep` 命令等价于 `grep -E`）
- `--color=auto` 输出内容显示颜色

**【示例】**

```bash
# 在 ./123.txt 查找包含 123 的内容
[root@daijf test1]# grep 123 ./123.txt
123hard
123

[root@daijf test1]# grep 123 ./123.txt -n
2:123hard
3:123

# 不看注释
grep -v "//" ./test.java

# 但是上面的过滤会有问题，因为可能存在注释跟在代码后面的情况，需要使用如下方式来过滤注释
# ^ 表示以 ... 开头的
grep -v ^/ ./test.java
```
