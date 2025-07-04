# 权限管理

可以使用 `ls -l` 或者 `ll` 命令查看文件或目录的权限信息。

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

`drwxr-xr-x` 表示目录的权限，这里面包含了四部分，如下图所示：

![2025070315332720.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332720.png)

对于权限来讲，`r` 表示读（read）权限，`w` 表示写（write）权限，`x` 表示可执行（execute）权限，`-` 表示没有权限。这三者的顺序是固定的，都是以 rwx 这样的顺序出现。如果只是普通文件，那么没有必要给可执行权限，除非这个文件可以使用 `sh` 或其它命令来执行。

- 资源类型：`-` 表示文件，`d` 表示目录, `l` 表示软链接。
- 所有者权限（u，user）
- 所属组权限（g，group）
- 其他人的权限（o，others）

## ACL 权限

ACL 的全称是 Access Control List (访问控制列表) ，是一个针对文件、目录的访问控制列表。它在 UGO（user、group、others）权限管理的基础上为文件系统提供了一个额外的、更灵活的权限管理机制。它被设计为 UNIX 文件权限管理的一个补充。ACL 允许你给任何的用户或用户组设置任何文件、目录的访问权限。

**为什么需要使用 ACL 权限？**

我们都知道，一个文件或目录的权限是由所有者、所属组、其它人构成的（即上面提到的 UGO）。在某些情况下，我们可能想为某个用户指定具体的权限，但又不想把这个用户加到所属组里面，并且不希望修改其它人的权限。那么这时候，我们就可以利用 ACL 来为用户单独分配权限。

然而，某些 Linux 系统可能不支持 ACL。要想使用 ACL 给某个用户分配某个文件或目录的权限，需要该文件或目录所在的分区支持 ACL 才行。

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

|命令名称|功能描述|语法|
|---|---|---|
|`getfacl`|查看文件、目录的 ACL 权限|`getfacl 文件或目录`|

- `setfacl`

|命令名称|功能描述|语法|
|---|---|---|
|`setfacl`|设置文件、目录的 ACL 权限|`setfacl [选项] 文件或目录`|

**【选项】**

- `-m` 设置 ACL 权限
- `-x` 删除指定的 ACL 权限
- `-b` 删除所有的 ACL 权限
- `-d` 设置默认的 ACL 权限
- `-k` 删除默认的 ACL 权限
- `-R` 递归设置 ACL 权限

**【示例】**

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

这里来补充一个知识。在上面，我们使用 `getfacl` 时，输出结果包含了 mask，这个 mask 是用来指定最大有效权限。如果我给用户赋予了 ACL 权限，是需要和 mask 的权限“相与”才能得到用户的真正权限。可以使用下面的命令来修改某个文件或目录的 mask 权限。

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

2. 命令执行者要对该程序拥有 x（执行）权限，命令执行者在执行该程序时获得该文件所有者的身份（在执行程序的过程中灵魂附体为文件的所有者）。

3. SetUID 权限只在该程序执行过程中有效，也就是说身份改变只在程序执行过程中有效。

系统自带的 `passwd` 命令就拥有 SetUID 权限，所以普通可以修改自己的密码。在配置文件一节，我们已经知道了，用户的密码是保存在 `/etc/shadow` 这个文件中的，而这个文件的权限如下：

```bash
[root@daijf mytest]# ll /etc/shadow
---------- 1 root root 1061 Sep  3 17:21 /etc/shadow
```

可以看到，这个文件除了超级用户外，其它任何用户都没有任何权限。用户想要修改自己的密码，那么必然需要有 `/etc/shadow` 这个文件的读写权限。既然普通用户没有任何权限，那普通用户又怎么能修改自己的密码呢？我们来看下 `passwd` 这个命令的权限：

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

:::warning 
1. 关键目录应严格控制写权限，比如 `/`、`/usr/bin` 等。
2. 给用户设置密码时要严格遵守密码三原则。
3. 对系统中默认应该具有 SetUID 权限的文件作一列表，定时检查有没有这之外的文件被设置了 SetUID 权限。
4. 除非你明确知道 SUID 权限的用处，否则一般不要使用 SUID 权限。
5. 永远不要给 `vi`、`vim` 设置 SUID 权限。
:::

### SetGID

SetUID 是针对文件的所有者来讲的，而 SetGID 是针对文件或目录的所属组来讲的。

**对文件来讲：**

1. 只有可执行的二进制程序才能设置 SGID 权限
2. 命令执行者要对该程序拥有 x（执行）权限
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

我们知道，使用 `locate` 命令能够查找系统中的文件，该命令实际上是到 `/var/lib/mlocate/mlocate.db` 本地库中进行搜索，来看一下 `/var/lib/mlocate/mlocate.db` 这个文件的权限。

```bash
[root@daijf mytest]# ll /var/lib/mlocate/mlocate.db
-rw-r----- 1 root slocate 12814402 Sep 11 03:08 /var/lib/mlocate/mlocate.db
```

可以看到，其他人的权限是 000，也就意味着普通用户没有办法读取 `mlocate.db` 这个文件的内容。但是，其实普通用户是可以的，为什么呢？来看一下 `locate` 命令的权限。

```bash
[root@daijf mytest]# whereis locate
locate: /usr/bin/locate /usr/share/man/man1/locate.1.gz

[root@daijf mytest]# ll /usr/bin/locate
-rwx--s--x. 1 root slocate 40520 Apr 11  2018 /usr/bin/locate
```

可以看到，普通用户有 `locate` 命令的执行权限，并且该命令的所属组是 slocate，组的权限是 `--s`，也就意味着有 SGID 的权限。当普通用户执行 `locate` 命令时，用户的所属组会转为 slocate，而 `/var/lib/mlocate/mlocate.db` 这个文件的所属组也是 slocate，并且 slocate 这个组对该文件的权限是 `r--`，也就是有读权限。

:::tip
如果所属组没有 x 权限，那么赋予 SGID 权限后，会变成 S，即无效。同 SUID。
:::

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

:::warning
一般情况下，不要随便使用 `SGID` 权限。除非你已经知道了它的作用。
:::

### Sticky BIT

Sticky BIT 也称为 SBIT，即粘着位。

1. 粘着位目前只对目录有效。
2. 需要普通用户对该目录拥有 w 和 x 权限，即普通用户可以在此目录拥有写入权限。
3. 如果没有粘着位，假如普通用户拥有 w 权限，那么所以可以删除此目录下所有文件，包括其他用户创建的文件。一但赋予了粘着位，除了 root 可以删除所有文件外，普通用户就算拥有 w 权限，也只能删除自己建立的文件，但是不能删除其他用户创建的文件。

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

**【命令格式】**

`chattr [+-=] [options] 文件或目录`

- `+` 增加某个权限
- `-` 删除某个权限
- `=` 最终的权限

**【选项】**

- `i` 

    如果对文件设置 `i` 属性，那么不允许对文件进行删除、改名，也不能添加和修改数据；如果对目录设置 `i` 属性，那么只能修改目录下文件的数据，但不允许建立和删除文件。**此选项对 root 用户也生效。**
    
- `a`

    如果对文件设置 `a` 属性，那么只能在文件中增加数据，但是不能删除、修改数据，也不能删除文件本身、改名；如果对目录设置 `a` 属性，那么只允许在目录中建立和修改文件，但是不允许删除。**此选项对 root 用户也生效。**

**【示例】**

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

**【命令格式】**

`lsattr [选项] 文件或目录`

**【选项】**

- `-a` 显示所有文件和目录
- `-d` 若目标是目录，仅列出目录本身的属性

**【示例】**

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

执行 `visudo` 或者 `vim /etc/sudoers` 修改文件，一般仅需修改以下内容即可：

```
## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL
djf    ALL=(ALL)       ALL

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
```

可以使用 `man 5 sudoers` 查看配置文件的内容格式以及说明。文件格式如下：

- `用户名  被管理的 IP 地址或者网段=(可使用的身份)（括号可省，省略或者写 ALL，就代表以 root 身份执行）授权命令所在的绝对路径`
- `%组名  被管理的 IP 地址或者网段=(可使用的身份)（括号可省，省略或者写 ALL，就代表以 root 身份执行）授权命令所在的绝对路径`

**如何理解被管理的 IP 地址或者网段？**

其实就是说，用户可以在哪台机器上使用授权的命令（不是来源的 IP，是目标机器的 IP）。

**【示例】**

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

:::warning 警告
禁止在 `/etc/sudoers` 中给普通用户赋予 `vim` 权限。因为 `/etc/sudoers` 中的命令是以 root 身份执行的。
:::
