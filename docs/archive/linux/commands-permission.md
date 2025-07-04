# 权限管理命令

**Linux 中，只有两种用户可以更改文件的权限，即该文件的所有者或 root 用户。**

## chmod

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`chmod`|改变文件或目录权限|`chmod [{ugoa}{+-=}{rwx}] [文件或目录]`<br>`chmod [mode=421] [文件或目录]`|change the permissions mode of a file|`/bin/chmod`|文件所有者或 root 用户|

**【选项】**  

- `-R` 递归修改

**【解释】**

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

**【示例】**

查看 `123.txt` 这个文件的权限：

```bash
ls -l 123.txt
-rw-r--r-- 2 root root 20 Aug 13 18:24 123.txt
```

可以看到，`123.txt` 这个文件当前的所有者是 root，所属组是 root，且所有者拥有读写权限，所属组有读的权限，其他人有读的权限。

现在，给 `123.txt` 这个文件的所有者追加可执行权限：

```bash
# 给 123.txt 这个文件的所有者追加可执行权限
chmod u+x 123.txt

ls -l 123.txt
-rwxr--r-- 2 root root 20 Aug 13 18:24 123.txt
```

给 `123.txt` 这个文件的所属组增加写权限，同时，去掉其他人的读权限：

```bash
# 给 123.txt 这个文件的所属组增加写权限，同时，去掉其他人的读权限
chmod g+w,o-r 123.txt

ls -l 123.txt
-rwxrw---- 2 root root 20 Aug 13 18:24 123.txt
```

把 `123.txt` 这个文件所属组的权限变成 `rwx`（可读可写可执行）：

```bash
# 把 123.txt 这个文件所属组的权限变成 rwx
chmod g=rwx 123.txt

ls -l 123.txt
-rwxrwx--- 2 root root 20 Aug 13 18:24 123.txt
```

让所有人都有 `123.txt` 这个文件的读权限：

```bash
# 让所有人都有 123.txt 这个文件的读权限
chmod a+r 123.txt

ls -l 123.txt
-rwxrwxr-- 2 root root 20 Aug 13 18:24 123.txt
```

但是上面这种方式却不是最常用，一般，我们都是用数字的方式给文件或目录授权，看下面的例子。

在演示以数字方式授权之前，我们需要了解各个数字的含义：

- `r` 代表数字 4
- `w` 代表数字 2
- `x` 代表数字 1
- `-` 代表数字 0

这里需要注意的是，在 Linux 中，权限始终是以 `rwx` 的形式来展现的，即对应的数字为 `421`。`421` 对应的十进制为 7，也就是说，Linux 中权限用数字表示的最大值为 7，7 即表示最高权限（可读可写可执行）。例如，`rwxrwxr--` 这个权限用数字表示就是 774。

给 `123.txt` 这个文件的所有者读写权限，所属组读的权限，其他人没有任何权限，以数字形式授权如下：

```bash
chmod 640 123.txt

ls -l 123.txt
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt
```

修改目录 `a` 的权限为 777，并且该目录下所有的子文件、子目录都要有 777 权限：

```bash
# -R 表示递归修改。如果不使用 -R，那么只有 a 目录有 777 权限，其下面的子文件、子目录的权限并不会受影响
chmod -R 777 a
```

说到这里，你是否觉得已经了解了 Linux 中的权限？那么，来看的这个例子。

1. 使用 root 用户给 test1 这个目录赋予 777 权限（任何人都有可读可写可执行权限）

```bash
whoami
root

chmod 777 test1

ls -ld test1
drwxrwxrwx 2 root root 4096 Aug 13 18:11 test1
```

2. 在 test1 目录下创建一个文件 test.txt

```bash
touch test1/test.txt

# 我们看到，普通用户对 test.txt 只有读权限
ls -l test1/test.txt
-rw-r--r-- 1 root root 0 Aug 13 23:04 test1/test.txt
```

3. 新建一个用户 djf1

```bash
useradd djf1
passwd djf1
```

4. 使用 djf1 这个用户登录，并尝试删除 test.txt，能删除成功吗？

```bash
su djf1
cd /usr/local/djfapp/test
rm -f test1/test.txt 

ls -l test1
total 12
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt
-rw-r----- 2 root root 20 Aug 13 18:24 123.txt.hard
lrwxrwxrwx 1 root root  7 Aug 13 18:11 123.txt.soft -> 123.txt
-rw-r--r-- 1 root root 16 Aug 13 17:22 renamemv123.properties
```

可以看到，竟然删除成功了，这是为什么？普通用户不是只有该文件的读权限吗，为什么可以删除？这因为在 Linux 中，rwx 的含义对于文件和目录是不同的。

**对于文件来讲：**

- `r` 表示可以读取这个文件的内容，比如使用 `cat`、`more`、`less` 等命令
- `w` 表示可以修改该文件的内容，比如使用 `vim`、`vi` 等命令
- `x` 表示可以执行该文件（如果该文件是脚本的话）

**对于目录来讲：**

- `r` 仅表示可以列出目录中的内容，比如使用 `ls` 等命令
- `w` 表示可以进入到目录中，并且可以对目录下面的所有文件进行修改，比如使用 `rm`、`touch`、`mkdir` 等命令
- `x` 表示可以进入该目录，比如 `cd` 命令

所以，一般来讲，用户对某个目录要么没有权限，要么有 `r` 和 `x` 的权限，不太可能只有 `r` 和 `x` 中的一种权限。

现在，对于上面那个问题，我们有答案了。因为 test1 这个目录是所有人都有写权限，那就意味着所有人都可以修改这个目录下面的文件。**即文件的权限不一定看文件本身，如果用户有文件所在目录的某个权限，那么对该目录下面的文件也有相应的权限。如果没有外层目录的写权限，那么对目录下面的文件也没有写权限（即使对这个文件有写权限也不行）**

## chown

**只有 root 用户才能改变文件的所有者。要改变文件的所有者，必须确保该用户是存在的。**

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`chown`|改变文件或目录的所有者|`chown [用户] [文件或目录]`|change file ownership|`/bin/chown`|root 用户|

**【示例】**

```bash
ls -ld test1
drwxrwxr-x 2 root root 4096 Aug 13 23:07 test1

chown djf1 test1

ls -ld test1
drwxrwxr-x 2 djf1 root 4096 Aug 13 23:07 test1
```

## chgrp

**只有 root 用户才能改变文件的所属组。要改变文件的所属组，必须确保该所属组是存在的。**

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`chgrp`|改变文件或目录的所属组|`chgrp [组名] [文件或目录]`|change file group ownership|`/bin/chgrp`|root 用户|

**【示例】**

```bash
# 添加一个组
groupadd group1

# 改变目录的所属组
chgrp group1 test1

ls -ld test1
drwxrwxr-x 2 djf1 group1 4096 Aug 13 23:07 test1
```

## umask

在讲这个命令之前，我们需要先知道一些前置知识。对于新建的文件，文件的所有者就是文件的创建者，那么新建的文件的所属组又是怎么定义的呢？其实新建文件或目录的所属组是通过创建者的缺省组（默认组）来定义的。什么是缺省组？这就是接下来要讲的 `umask` 命令。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`umask`|显示、设置文件的缺省权限|`umask [-S]`|the user file-creation mask|shell 内置命令|所有用户|

**【选项】**

- `-S` 以 `rwx` 形式显示新建文件或目录缺省权限

**【示例】**

```bash
# 可以看到，对于新建的文件或目录，默认是权限是 u=rwx,g=rx,o=rx
# 但是，对于新建的文件来讲，默认情况下，所有人都没有 x 可执行权限（这是 Linux 特意设计的）
umask -S
u=rwx,g=rx,o=rx

# 直接使用 umask
umask

# 第一个 0 是特殊权限（见笔记中的 文件特殊权限）
# 后面的 022 代表 ----w--w-
0022

# 但是直接使用 umask 看到的权限会和 777 做异或运算，运算后得到的值才是真实的值
777 rwx rwx rwx
022 --- -w- -w-
---------------
755 rwx r-x r-x # 和  umask -S 看到的一致
```

当然，我们可以更改新建目录的默认权限。假如，我们想要将新建目录的默认权限修改为 700，即 rwx------，那么我们应该将 umask 的值设置为 077（但是不建议修改 umask 的默认值）。计算方式如下：

```bash
777 rwx rwx rwx
077 --- rwx rwx
---------------
700 rwx --- ---

# 设置 umask 的值为 077
umask 077
```
