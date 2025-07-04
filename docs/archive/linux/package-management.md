# 软件包管理

一般来讲，软件包可以分为两类，分别是源码包和二进制包。  

通过源码包进行安装时，需要先将源码包编译成二进制文件，然后再进行安装。而二进制包是源码包编译完成后的产物，可以直接进行安装。但是，通过源码包安装的方式，对开发人员的要求较高，中间如果出现编译问题，解决起来较为麻烦。因此，推荐使用二进制包进行安装。常见的二进制包有 rpm、系统默认包等。

||优点|缺点|
|---|---|---|
|源码包|<ul><li>开源，如果有足够的能力，可以修改源代码</li><li>可以自由选择所需的功能</li><li>软件是由操作系统编译安装，所以更加适合自己的系统，运行更加稳定高效</li><li>卸载方便</li></ul>|<ul><li>安装过程步骤较多</li><li>编译过程时间较长，比二进制安装时间长</li><li>因为是编译安装，安装过程中一旦报错新手很难解决</li></ul>|
|二进制包|<ul><li>包管理系统简单，只通过几个命令就可以实现包的安装、升级、查询和卸载</li><li>安装速度比源码包安装快的多</li></ul>|<ul><li>经过编译，不再可以看到源代码</li><li>功能选择不如源码包灵活</li><li>有依赖性</li></ul>|

## RPM 包管理

RPM 包其实就是二进制包，它的包管理可以分为 rpm 命令管理和 yum 在线管理两种。

rpm 包命名原则，以 `mysql-community-server-8.0.30-1.el7.x86_64.rpm` 为例来说明，如下：

- `mysql-community-server` 软件包名
- `8.0.30` 软件版本
- `1` 软件发布次数
- `el7` 适合的 Linux 平台，如果没有此项，则表示支持所有平台
- `x86_64` 适合的硬件平台，如果没有此项，则表示支持所有平台
- `rpm` rpm 包扩展名

我们知道，在 Linux 中，其实是不区分文件后缀的。但是，对于 rpm 包来讲，应该将其后缀指定为 `.rpm`，这样做是为了方便我们识别。

`mysql-community-server-8.0.30-1.el7.x86_64.rpm` 是一个包的全名，而 `mysql-community-server` 是包名，这点需要注意，在后续 rpm 的操作中会提到它们的使用场景。当操作的包是没有安装的软件包时，需要使用包全名，而且要注意软件包路径。当操作已经安装的软件包时，需要使用包名（比如查询、卸载），Linux 会在 `/var/lib/rpm/` 中搜索已经安装过的包。

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
    
    ![2025070315332537.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332537.png)
    
    提示需要安装 `libodbcinst.so.2`（一般以 so、数字结尾的都是库依赖） 这个库，我们只需要在库依赖网站查询 `libodbcinst.so.2`，然后安装即可，如下：
    
    ![2025070315332617.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332617.png)
    
## RPM 命令

**【命令格式】** 

`rpm [-option] [包全名]`。

**【选项】**

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

**【示例】**

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

在使用 `rpm` 安装某些包时，最常见的问题就是包的依赖性。如果出现了依赖性问题，我们需要提前将所有依赖装好，才能安装我们真正需要的包，使用起来非常麻烦。`yum` 在线命令的出现就为我们解决了这个问题，它能帮助我们自动解决依赖性问题。但是，Redhat 公司认为，`yum` 命令属于售后服务，需要购买才能使用。然而，在作为 Redhat 分支之一的 CentOS 中，可以免费使用 `yum` 命令。

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

|名称|说明|
|---|---|
|extras、os、updates|容器名称（可以自定义），一定要放在 [ ] 中。|
|name|容器说明，可以随便写。|
|mirrorlist|镜像站点，与 baseurl 的功能相同，建议只使用 mirrorlist 和 baseurl 之一|
|baseurl|yum 源服务器的地址。默认是 CentOS 官方的 yum 源服务器。如果你觉得慢，可以改成你喜欢的 yum 源地址。|
|enabled|此容器是否生效，如果不写或写成 `enable=1` 都是生效，写成 `enable=0` 就是不生效。|
|gpgcheck|如果是 1，则指 RPM 的数字证书生效，如果是 0 则不生效。|
|gpgkey|数字证书的公钥文件保存位置。不用修改。|

### 常用命令

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

查询某个软件包以及这个软件包所需要的依赖（注意，在 yum 中，只需要写包名即可）：

```bash
yum search nginx
```

**【安装命令语法】**

`yum [-option] install 包名`

**【选项】**

- `-y` 自动回答 yes

**【示例】**

```bash
yum -y install gcc

# 查看是否安装成功，rpm -qa | grep gcc 也可以
[root@daijf yum.repos.d]# rpm -q gcc
gcc-4.8.5-44.el7.x86_64
```

**【升级命令语法】**

`yum [-option] update 包名`

**【选项】**

- `-y` 自动回答 yes

**【示例】**

```bash
yum -y update gcc
```

注意，如果直接使用命令 `yum -y update`，表示升级所有包，包括 Linux 内核，可能出现服务器宕机的情况。 

**【卸载命令语法】**

`yum [-option] remove 包名`

**【选项】**

- `-y` 自动回答 yes

**【示例】**

```bash
yum -y remove nginx
```

注意，在使用 `rpm` 命令时，我们知道了软件包的依赖性。假如 a 依赖 b，b 依赖 c，我们安装 a 时，应该依次安装 c、b、a。在卸载 a 时，需要依次卸载 a、b、c。由于 `yum` 命令是自动化的，所以，在卸载时，yum 会自动帮我们移除相关的依赖。但是，很有可能这些依赖是被系统内核所依赖的，如果被移除了，可能导致系统无法使用。所以，`yum` 的安装和卸载命令需要慎用，特别是生产环境。但是，现在的 `yum` 更加智能了，会检测有没有其它包依赖此包。

## 软件包组

软件包组是指一组相关的软件包的集合。通过软件包组，我们可以一次性安装一组相关的软件包，而不需要一个个地安装。

查询 yum 源中所有可用的软件组列表：

```bash
yum grouplist
```

通过 `yum` 安装软件包组（安装软件包组时，会安装这个组下面的所有软件包）：

```bash
# 软件包组名可通过命令 yum grouplist 来查看
# 如果软件包组名有特殊字符，则需要使用双引号，如 yum groupinstall "E-mail server"
yum groupinstall 软件包组名
```

通过 `yum` 卸载软件包组（卸载软件包组时，会卸载这个组下面的所有软件包）：

```bash
# 软件包组名可通过命令 yum grouplist 来查看
# 如果软件包组名有特殊字符，则需要使用双引号，如 yum groupremove "E-mail server"
yum groupremove 软件包组名
```

## 源码包

之前我们已经提到了源码包和 RPM 包的区别，但那些都是概念上的区别。它们还有一个区别就是安装后的位置不同。

对于 RPM 包来讲，它默认安装在 `/var/lib/rpm/` 目录下，它的命令可能在以下地方存在（大部分都是这样的，但是也有例外）：

|路径|说明|
|---|---|
|/etc/|配置文件安装目录|
|/usr/bin/|可执行的命令安装目录|
|/usr/lib/|程序所使用的函数库保存位置|
|/usr/share/doc/|基本的软件使用手册保存位置|
|/usr/share/man/|帮助文件保存位置|

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

:::warning 如何确定安装过程是否出错？

1. 安装过程被停止
2. 安装过程停止后，立即出现 error、warning、no 等词汇

有时候，我们在安装过程中确实会出现 error、warning、no 等词汇。但是，安装过程并没有停止。一般来讲，这不影响软件的基本使用。
:::

**安装步骤如下：**

1. 下载源码包，如 `tomcat9.tar.gz`。
2. 解压源码包，如 `tar -zxvf tomcat9.tar.gz`。
3. 查看解压后的大小（可省）`du -sh tomcat9`。
4. 进入源码包的解压目录 `cd tomcat9`。
5. 查看解压后的文件 `ls`。任何源码包解压后都会有 `INSTALL`、`README` 这两个文件，`INSTALL` 文件中描述了安装步骤和安装完成后的启动命令，`README` 中描述了使用手册。
6. 执行 `./configure` 进行软件配置与检查（必须进入解压目录执行，否则需要写全路径，如 `/usr/local/tomcat9/configure`），作用如下（可使用 `./configure --help` 查看可选项）：
    1. 定义需要的功能选项（如定义安装目录 `./configure --prefix=/usr/local/tomcat9/setup`，`--prefix` 用于指定安装的绝对路径）。
    2. 检测系统环境是否符合安装要求。
    3. 把定义好的功能选项和检测系统环境的信息都写入 Makefile 文件，用于后续的编辑（安装完成后会自动生成 Makefile 文件）。
    4. 小结一下第 6 点，简单来讲，就是指定安装目录（如 `./configure --prefix=/usr/local/tomcat9/setup`）。
7. 编译 `make` （如果第 6 步和第 7 步报错了，那么只需要执行 `make clean` 来清理编译产生的临时文件；只有执行了 `make install` 命令，才会向步骤 6 中指定的安装目录写入内容）。
8. 编译安装 `make install`（只有执行了该命令，才会向步骤 6 中指定的安装目录写入内容）。
9. 安装完成后，到 `INSTALL` 文件下查看启动命令。
10. 通过源码包进行安装后，如果需要卸载，仅需删除安装目录即可，不会残留其它垃圾。

**同一台机器上是可以通过 RPM 和源码包来安装同一个软件的，只要它们的安装位置不同即可，但是不推荐同时安装多个相同的软件。**

## 脚本安装包

脚本安装包并不是独立的软件包类型，它是人为把安装过程写成了自动化的脚本。只要执行脚本，定义简单的参数，就可以完成安装。非常类似于 Windows 下安装软件的方式。
