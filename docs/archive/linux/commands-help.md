# 帮助命令

## man

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`man`|获取帮助信息|`man [命令或配置文件]`|manual|`/usr/bin/man`|所有用户|

**【示例】**

```sh
# 查看 ls 命令的帮助信息（会调用 less 命令进行显示），和 ls --help 命令差不多
# man 命令的输出可以使用 / 进行搜索，同 less 命令
man ls
```

```bash
# 查看 /etc/services 配置文件的帮助信息，只需写文件名，无需写路径。如果写了路径，则会输出文件的内容
man services
```

在上面，我们已经知道了，如果想要查看配置文件的帮助文档，是不需要写路径的，直接写文件名称就可以了。但是，如果文件名称和系统的命令重叠了，该怎么办呢，看下面的命令：

```bash
man passwd
```

上面的命令会默认寻找系统的 `passwd` 命令，而不是 `passwd` 配置文件，我们可以使用 `whereis passwd` 进行查看，发现系统中有一个命令叫 `passwd`，而在 `/etc/` 下面有一个配置文件也叫 `passwd`。

```bash
whereis passwd
passwd: /usr/bin/passwd /etc/passwd /usr/share/man/man1/passwd.1.gz
```

我们发现，使用 `whereis` 会出现两个帮助文档，一个是 `passwd.1.gz`，另一个是 `passwd.5.gz`。在 Linux 中，1 表示命令的帮助文档，5 表示配置文件的帮助文档。如果我们想要查看配置文件的帮助文档，应该使用以下命令：

```bash
man 5 passwd
```

有时候我们只想知道命令是干啥用的，这时，使用 `man` 命令会输出大量无关的内容。我们可以使用 `whatis` 命令来快速知道某个命令的用处。

```bash
[root@daijf ~]# whatis ls
ls (1)               - list directory contents
```

对于配置文件，我们也可以使用 `apropos` 命令来查看该配置文件的作用。

```bash
[root@daijf ~]# apropos services
```

当然，`info` 命令和 `man` 命令也差不多。

```bash
info ls
```

## help

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`help`|获得 Shell 内置命令的帮助信息|`help 命令`|--|Shell内置命令|所有用户|

**怎么判断一个命令是不是内置命令？**

通过 `type` 命令进行查看。

```bash
[root@daijf ~]# type cd
cd is a shell builtin
```

**【示例】**

```bash
help cd
```
