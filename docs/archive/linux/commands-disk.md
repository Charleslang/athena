# 磁盘相关命令

## df

|命令名称|功能描述|语法|命令英文原意|
|---|---|---|---|
|`df`|查看磁盘信息|`df [选项] [目录]`|Disk Free|

**【选项】**

- `-a` 显示所有系统文件
- `-B <块大小>`	指定显示时的块大小
- `-h` 以容易阅读的方式显示
- `-H` 以 1000 字节为换算单位来显示
- `-i` 显示索引字节信息
- `-k` 指定块大小为 1 KB
- `-l` 只显示本地文件系统
- `-t <文件系统类型>` 只显示指定类型的文件系统
- `-T` 输出时显示文件系统类型

**【示例】**

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

## du

`du` 命令来自于英文词组“Disk Usage”的缩写，其功能是用于查看文件或目录的大小。人们经常会把 `df` 和 `du` 命令混淆，`df` 是用于查看磁盘或分区使用情况的命令，而 `du` 命令则是用于按照指定容量单位来查看文件或目录在磁盘中的占用情况。

|命令名称|功能描述|语法|命令英文原意|
|---|---|---|---|
|`du`|查看文件或目录的大小|`du [选项] [目录]`|Disk Usage|

**【选项】**

- `-a` 显示目录中所有文件大小
- `-k` 以 KB 为单位显示文件大小
- `-m` 以 MB 为单位显示文件大小
- `-g` 以 GB 为单位显示文件大小
- `-h` 以易读方式显示文件大小
- `-s` 仅显示总计

**【示例】**

```bash
# 查看档期目录的磁盘使用情况
du -sh

# 查看指定目录的磁盘使用情况
du -sh /usr
```
