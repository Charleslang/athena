# 服务管理

## 服务简介与分类

Linux 服务主要分为以下两类：

![2025070315332747.jpg](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332747.jpg)

xinetd 即 extended internet daemon，是新一代网络守护进程服务程序，又叫超级 Internet 服务器，经常用来管理多种轻量级 Internet 服务。xinetd 提供类似于 inetd + tcp_wrapper 的功能，但是更加强大和安全。

当我们访问 xinetd 服务时，其实我们访问的是经过 xinetd 转发后的服务，所以 xinetd 有点像 nginx。而我们访问独立服务时，不需要经过转发。所以，一般来讲，访问独立服务的响应速度较快。xinetd 现在用得很少了，了解即可。

**启动与自启动**  

- 服务启动

    就是在当前系统中让服务运行，并提供功能。  
    
- 服务自启动

    自启动是指让服务在系统开机或重启之后，随着系统的启动而自动启动服务。

**查看系统已安装的服务**

- 查看通过 RPM 包安装的服务是否开机自启动

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

对于使用 `rpm` 或 `yum` 命令安装的 RPM 服务，它们常见的安装目录有以下位置：

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

:::tip 参考
1. https://www.cnblogs.com/ToBeExpert/p/9808134.html  
2. https://abanger.github.io/CentOS/CentOS7_telnet （这种方式也可以，推荐使用）
:::

## 源码包的服务管理

**启动方式**

一般来讲，通过源码包安装的服务，需要使用绝对路径或者相对路径来启动。建议将安装路径放在 `/usr/local/` 目录下。在通过源码包安装时，解压目录下通常会有一个 `INSTALL` 文件，这个文件中说明了启动脚本所在的位置。

**让 `service` 命令管理源码包的启动脚本**

默认情况下，通过源码包安装的程序，是不能通过 `service` 命令来启动的。但是，如果我们想通过 `service` 命令来启动通过源码包安装的程序，那么我们可以使用软链接。如下：

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

|命令名称|功能描述|语法|
|---|---|---|
|`ps`|查看进程|`ps [选项]`|

**【选项】**  

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

**【示例】**

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

|命令名称|功能描述|语法|
|---|---|---|
|`top`|查看健康状态|`top [选项]`|

**【选项】**

- `-d <秒>`	改变显示的更新速度
- `-c` 切换显示模式
- `-s` 安全模式，不允许交互式指令
- `-i` 不显示任何闲置或僵死的行程
- `-n` 设定显示的总次数，完成后将会自动退出
- `-b` 批处理模式，不进行交互式显示

**【示例】**

```bash
# 
top
```

`top` 命令输出结果解释：

```bash
top - 16:58:15 up 30 days,  3:06,  1 user,  load average: 0.00, 0.01, 0.05
Tasks:  85 total,   3 running,  82 sleeping,   0 stopped,   0 zombie
%Cpu(s):  1.0 us,  1.0 sy,  0.0 ni, 98.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1881996 total,   110628 free,   373728 used,  1397640 buff/cache
KiB Swap:        0 total,        0 free,        0 used.  1320192 avail Mem 
```

第一行 `top`：

|输出|说明|
|---|---|
|`16:58:15`|系统当前时间，默认每 3 秒刷新一次|
|`up 30 days, 3:06`|计算机从上一次开机到现在，一共运行了 30 天 3 小时 6 分|
|`1 user`|当前系统登录了 1 个用户|
|`load average: 0.00, 0.01, 0.05`|系统在之前 1 分钟，5 分钟，15 分钟的平均负载分别为 0.00, 0.01, 0.05。对于单核 CPU 来讲，如果该值超过 1，那么认为系统在对应的时间处于高负载（如果是 8 核的 CPU，可以理解为超过 8 就是高负载）。|

第二行 `Tasks`：

|输出|说明|
|---|---|
|`85 total`|系统当前共有 85 个进程|
|`3 running, 82 sleeping, 0 stopped, 0 zombie`|系统当前有 3 个进程处于运行状态，82 个进程处于睡眠状态，0 个进程停止，0 个进程僵死（服务处于停止过程中，但是还未完全停止。如果长时间存在僵死进程，那么说明进程停止过程中因为某些原因卡死了，需要人工进行处理）。|

第三行 `%Cpu(s)`：

|输出|说明|
|---|---|
|`1.0 us`|用户占用 CPU 的百分比|
|`1.0 sy`|系统占用 CPU 的百分比|
|`0.0 ni`|改变过优先级的用户进程占用 CPU 的百分比|
|`98.0 id`|CPU 的空闲率（一般认为，该值低于 20% 时，服务器处于高负载）（平时需要多关注）|
|`0.0 wa`|等待输入/输出的进程的占用 CPU 的百分比|
|`0.0 hi`|硬中断请求服务占用的 CPU 百分比|
|`0.0 si`|软中断请求服务占用的 CPU 百分比|
|`0.0 st`|st (Steal time) 虚拟时间百分比。就是当有虚拟机时，虚拟 CPU 等待实际 CPU 的时间百分比。|

第四行 `KiB Mem`：

|输出|说明|
|---|---|
|`1881996 total`|物理内存的总量，单位 KB |
|`110628 free`|空闲的物理内存数|
|`373720 used`|已经使用的物理内存数量|
|`1397648 buff/cache`|作为缓冲的内存数量|

第五行 `KiB Swap`：

|输出|说明|
|---|---|
|`0 total`|交换分区（虚拟内存）的总大小|
|`0 free`|空闲交换分区的大小|
|`0 used`|已经使用的交互分区的大小|
|`1320200 avail Mem`|作为缓存的交互分区的大小|

一般来说，我们需要关注的是平均负载、CPU 空闲率、内存剩余数量。

使用 `top` 命令后，会进入交互模式，按 `q` 退出。在交互模式下，可以使用以下快捷键进行操作：

- `P`（`shift` + `p`）

    以 CPU 使用率排序，默认就是此项
    
- `M`（`shift` + `m`）

    以内存的使用率排序

- `N`（`shift` + `n`）

    以 PID 排序

- `q`

    退出 `top`

- `?` 或 `h`

    显示交互模式的帮助信息

:::warning
`top` 命令本身比较耗费资源。
:::

### 查看进程树 `pstree`

|命令名称|功能描述|语法|
|---|---|---|
|`pstree`|查看进程树|`pstree [选项]`|

**【选项】**

- `-p`

    显示进程的 PID
    
- `-u`

    显示进程的所属用户

**【示例】**

```bash
pstree
```

## 终止进程

### kill

|命令名称|功能描述|语法|
|---|---|---|
|`kill`|终止进程|`kill [选项] [PID]`|

**【选项】**

- `-l` 列出系统支持的信号
- `-s` 指定向进程发送的信号
- `-a` 不限制命令名和进程号的对应关系
- `-p` 不发送任何信号

**【示例】**

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

|信号代号|信号名称|说明|
|---|---|---|
|1|SIGHUP|该信号让进程立即关闭，然后重新读取配置文件之后重启。|
|2|SIGINT|程序终止信号，用于终止前台进程。相当于输出 ctrl+c 快捷键。|
|8|SIGFPE|在发生致命的算术运算错误时发出．不仅包括浮点运算错误,还包括溢出及除数为 0 等其它所有的算术的错误。|
|9|SIGKILL|用来立即结束程序的运行．本信号不能被阻塞、处理和忽略。一般用于强制终止进程。|
|14|SIGALRM|时钟定时信号，计算的是实际的时间或时钟时间 alarm 函数使用该信号。|
|15|SIGTERM|正常结束进程的信号，**kill 命令的默认信号**。有时如果进程已经发生问题，这个信号是无法正常终止进程的，此时，我们可以尝试 SIGKILL 信号，也就是信号 9。|
|18|SIGCONT|该信号可以让暂停的进程恢复执行，本信号不能被阻断。|
|19|SIGSTOP|该信号可以暂停前台进程，相当于输入 ctrl+z 快捷键。本信号不能被阻断。|

```bash
# 等价于 kill -15 123456
kill 123456

# 强制终止
kill -9 123456

# 重启进程（下面的选项是数字 1，而不是 L）
kill -1 123456
```

### killall

|命令名称|功能描述|语法|
|---|---|---|
|`killall`|使用进程名称来杀死一组进程|`killall [选项][信号] 进程名称`|

**【选项】**

- `-e` 对长名称进行精确匹配
- `-l` 打印所有已知信号列表
- `-p` 杀死进程所属的进程组
- `-i` 交互式杀死进程，杀死进程前需要进行确认
- `-I` 忽略进程名称的大小写
- `-r` 使用正规表达式匹配要杀死的进程名称
- `-s` 用指定的进程号代替默认信号“SIGTERM”
- `-u` 杀死指定用户的进程

**【示例】**

```bash
killall -9 mysql
```

### pkill

|命令名称|功能描述|语法|
|---|---|---|
|`pkill`|按照进程名杀死进程|`pkill [选项][信号] 进程名称`|

**【选项】**

- `-o` 仅向找到的最小（起始）进程号发送信号
- `-n` 仅向找到的最大（结束）进程号发送信号
- `-P` 指定父进程号发送信号
- `-g` 指定进程组
- `-t` 指定开启进程的终端（按照此终端号踢出用户）

**【示例】**

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

在 Windows 中，我们通过最小化的方式可以使程序进入后台运行。在 Linux 中，也有对应的方法来实现将程序放入后台执行。

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

**两种方式的区别**

第一种方式将程序放入后台后，程序能够正常运行，而第二种方式会将程序挂起。

**查看后台运行的程序**

也可以使用 `ps` 命令。

|命令名称|功能描述|语法|
|---|---|---|
|`jobs`|查看后台运行的程序|`jobs [选项]`|

**【选项】**

- `l` 显示 PID

**【示例】**

```bash
[root@daijf ~]# jobs
[1]+  Stopped                 top

[root@daijf ~]# jobs -l
[1]- 26491 Stopped (signal)        top
[2]+ 26733 Stopped (signal)        top

# [1] 中的 1 表示工作号，值越小，表示该工作越早放入后台。最晚放入后台的程序，该值是最大的。
```

:::warning
`jobs` 命令的输出结果中，“+”号代表最后一个放入后台的工作，它是工作恢复时，默认恢复的工作。“-”号代表倒数第二个放入后台的工作。
:::

**恢复后台暂停的程序到前台执行**

|命令名称|功能描述|语法|
|---|---|---|
|`fg`|恢复后台暂停的程序到前台执行|`fg [%][工作号]`|

**% 可以省略，但是需要注意工作号和 PID 的区别。**  

**【示例】**

```bash
# fg 命令默认恢复 jobs 中带 “+” 号的，也就是最后一个放入后台的工作
fg %1
```

**恢复后台暂停的程序到后台执行**

|命令名称|功能描述|语法|
|---|---|---|
|`bg`|恢复后台暂停的程序到后台执行|`bg [%][工作号]`|

**【示例】**

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

|命令名称|功能描述|语法|
|---|---|---|
|`vmstat`|监控系统资源|`vmstat [刷新间隔 总共刷新次数]`|

**【示例】**

```bash
# 总共监听 3 次系统资源，每次间隔 1 秒钟
[root@daijf ~]# vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 3  0      0 112452 242228 1154872    0    0    30   317   13   13  2  1 96  0  0
 0  0      0 112072 242228 1154904    0    0     0     0  481 1045  0  1 99  0  0
 0  0      0 112108 242232 1154912    0    0     0   216  589 1205  2  1 97  0  0
```

---

|命令名称|功能描述|语法|
|---|---|---|
|`dmesg`|查看在开机时内核的检测信息|`dmesg`|

**【示例】**

```bash
dmesg | grep CPU
```

---

|命令名称|功能描述|语法|
|---|---|---|
|`free`|查看内存使用情况|`free [选项]`|

**【选项】**

- `-b` 以 Byte 显示内存使用情况
- `-k` 以 KB 为单位显示内存使用情况（默认）
- `-m` 以 MB 为单位显示内存使用情况
- `-g` 以 GB 为单位显示内存使用情况
- `-s` 每间隔多少秒刷新一次
- `-t` 显示内存使用总合
- `-h` 以易读的单位显示内存使用情况

**【示例】**

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

---

|文件名称|功能描述|
|---|---|
|`/proc/cpuinfo`|保存 CPU 的详细信息|

```bash
cat /proc/cpuinfo
```

---

|命令名称|功能描述|语法|
|---|---|---|
|`uname`|查看系统与内核相关的信息|`uname [选项]`|

**【选项】**

- `-a` 显示系统所有相关信息
- `-m` 显示计算机硬件架构
- `-n` 显示主机名称
- `-r` 显示内核发行版本号
- `-s` 显示内核名称
- `-v` 显示内核版本
- `-p` 显示主机处理器类型
- `-o` 显示操作系统名称
- `-i` 显示硬件平台

**【示例】**

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

---

|命令名称|功能描述|语法|
|---|---|---|
|`lsb_release`|查看系统发行号|`lsb_release [选项]`|

**【选项】**

- `-i` 显示系统名称简写
- `-d` 显示系统全称和版本号
- `-r` 显示版本号
- `-a` 显示LSB所有信息

注意，有的 Linux 发行版没有自带 `lsb_release` 这个命令，但我们可以通过 `/etc/redhat-release` 命令查看，如下：

```bash
[root@daijf ~]# cat /etc/redhat-release 
CentOS Linux release 7.9.2009 (Core)
```

---

|命令名称|功能描述|语法|
|---|---|---|
|`lsof`|查看进程占用或打开的文件|`lsof [选项]`|

**【选项】**

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

**【示例】**

```bash
lsof -p 518

# 查看 80 端口被哪个进程占用
lsof -i:80

# 查看 8080-8090 端口哪些进程占用
lsof -i TCP:8080-8090
```

:::tip
可能你已经注意到了，`lsof` 命令不仅可以查看文件，也可以查看目录或命令。这是因为，Linux 中万物皆文件。
:::

## 定时任务

想要在 Linux 中使用定时任务，我们必须开启 `crond` 服务。

```bash
# 查看 crond 服务是否开启
systemctl status crond

# 查看 crond 是否开机自启
systemctl list-unit-files | grep crond
```

|命令名称|功能描述|语法|
|---|---|---|
|`crontab`|管理定时计划任务|`crontab [选项]`|

**【选项】**

- `-e` 编辑某个用户的定时任务（默认为当前用户）
- `-l` 列出某个用户的所有任务（默认为当前用户）
- `-r` 删除某个用户的所有任务（默认为当前用户）
- `-u` 指定用户名字
- `--help` 显示帮助信息

:::tip
命令的说明可以参考[Linux 给指定用户添加定时任务](https://blog.csdn.net/ren593669257/article/details/95455245)。
:::

**【示例】**

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

:::warning
Linux 中的 cron 表达式和一般的 cron 表达式有点区别（Linux 的 cron 表达式没有秒）。在线生成 crontab 表达式可参考[crontab](https://tool.lu/crontab/)。
:::
