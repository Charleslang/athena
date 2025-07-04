# 网络命令

## write

需要目标用户在线才能进行发送。可以使用 `w` 命令查看当前登录系统的所有用户。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`write`|给用户发信息，以 `Ctrl` + `D` 保存并结束|`write [用户名]`|--|`/usr/bin/write`|所有用户|

**【示例】**

```bash
write djf1
```

## wall

给当前在线的所有用户发送消息。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`wall`|发广播信息，按回车结束|`wall [message]`|write all|`/usr/bin/wall`|所有用户|

**【示例】**

```bash
wall message
```

## ping

Windows 下的 `ping` 命令默认只有 4 次，而 Linux 中默认没有限制（Linux 可以通过 `-c` 选项来指定次数）。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`ping`|测试网络连通性，`Ctrl` + `c` 结束|`ping [-option] [IP/域名]`|write all|`/bin/ping`|所有用户|


**【选项】**

- `-c` 指定发送次数
- `-i` 指定发送间隔时间（单位为秒）

**【示例】**

```bash
ping www.baidu.com

# time 越小，证明网络越好
PING www.a.shifen.com (112.80.248.76) 56(84) bytes of data.
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=1 ttl=53 time=9.50 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=2 ttl=53 time=9.45 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=3 ttl=53 time=9.50 ms
64 bytes from 112.80.248.76 (112.80.248.76): icmp_seq=4 ttl=53 time=9.44 ms

# ping 结束后，会出现丢包率。网络正常的情况下，packet loss 为 0%，如果 packet loss 很高，就说明网络有问题。
--- www.a.shifen.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 9.447/9.479/9.508/0.029 ms
```

```bash
ping www.baidu.com -c 3
```

```bash
# 每隔 0.1 秒发送一次 ping，共发送 100 次
ping www.baidu.com -c 100 -i 0.1
```

## ifconfig

Windows 中可以使用 `ipconfig` 命令。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`ifconfig`|查看和设置网卡信息|`ifconfig [网卡名称] [IP地址]`|interface configure|`/sbin/ifconfig`|root|

**【示例】**

查看当前系统的网卡：

```bash
# 一般来讲，系统自带的网卡是 eth0，如果有多个网卡，那么后面的数字会递增，如 eth1、eth2
[root@daijf ~]# ifconfig
br-6bc3cffef6d5: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.0.1  netmask 255.255.0.0  broadcast 0.0.0.0
        ether 02:42:16:76:c1:6e  txqueuelen 0  (Ethernet)
        RX packets 1096279  bytes 62960771 (60.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1096279  bytes 62960771 (60.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 0.0.0.0
        ether 02:42:3d:83:58:87  txqueuelen 0  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# inet 172.17.0.3：当前计算机的 IP  
# netmask 255.255.240.0：子网掩码
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.3  netmask 255.255.240.0  broadcast 172.17.15.255
        inet6 fe80::5054:ff:feea:4f67  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:ea:4f:67  txqueuelen 1000  (Ethernet)
        RX packets 17918210  bytes 2964087439 (2.7 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 17080282  bytes 3079129709 (2.8 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 1096279  bytes 62960771 (60.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1096279  bytes 62960771 (60.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

设置网卡信息（谨慎操作）：

```bash
ifconfig eth0 192.168.2.180
```

## mail

不管目标用户在不在线，都可以发送。如果目标用户不在线，那么对方登录后会收到邮件。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`mail`|查看、发送电子邮件|`mail [用户名]`|--|`/bin/mail`|所有用户|

**【示例】**

给 root 用户发邮件（`Ctrl` + `D` 结束）：

```bash
mail root
```

接收邮件：

```bash
mail
```

## last

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`last`|列出目前与过去登入系统的用户信息、重启命令 `reboot` 也会列出|`last`|--|`/usr/bin/last`|所有用户|

**【示例】**

```bash
last

# (12:27) 表示在系统内停留的时间，12 小时 27 分
root     pts/1        117.176.219.56   Thu Jul 21 09:35 - 22:02  (12:27)
```

## lastlog

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`lastlog`|查看用户最后一次登录时间|`lastlog [-option]`|--|`/usr/bin/lastlog`|所有用户|

**【选项】**

- `-u 用户名` 查看特定用户

**【示例】**

查看所有用户最后一次登录时间：

```bash
lastlog
```

查看 root 用户最后一次登录时间：

```bash
lastlog -u root
```

## traceroute

该命令可用于网络诊断。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`traceroute`|显示数据包到目标IP的访问链路|`traceroute [目标IP]`|--|`/bin/traceroute`|所有用户|
 
**【示例】**

```bash
traceroute www.baidu.com
```

## netstat

该命令可用于网络诊断。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`netstat`|显示网络相关信息|`netstat [-option]`|--|`/bin/netstat`|所有用户|

**【选项】**

- `-t` TCP 协议
- `-u` UDP 协议
- `-l` 监听
- `-r` 路由
- `-n` 显示 IP 地址和端口号


**【示例】**

查看本机监听的端口（即哪些端口正在使用）：

```bash
netstat -tlun
```

查看本机所有的网络连接（该命令非常有用）：

```bash
netstat -an

Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:15672           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:25672           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:4369            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:8087            0.0.0.0:*               LISTEN     
tcp        0      0 172.17.0.3:33454        169.254.0.55:8080       TIME_WAIT  
tcp        0      0 127.0.0.1:33593         127.0.0.1:4369          ESTABLISHED
tcp        0      0 127.0.0.1:60076         127.0.0.1:4369          TIME_WAIT  
tcp        0      0 172.17.0.3:22           61.157.90.101:31163     ESTABLISHED
tcp        0      0 172.17.0.3:52374        169.254.0.55:5574       ESTABLISHED
tcp        0      0 172.17.0.3:4369         172.17.0.3:56890        TIME_WAIT  
tcp6       0      0 172.17.0.3:8096         175.152.141.21:60056    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         67.198.130.201:40346    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         175.152.141.21:63899    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         175.152.141.21:60042    ESTABLISHED
tcp6       0      0 172.17.0.3:8096         67.198.188.123:9880     ESTABLISHED

# 解释如下：
# ESTABLISHED 表示当前服务器的端口正在被哪些 IP 连接
# 下面这个表示 61.157.90.101 这台机器通过 31163 端口（这个端口不是服务器的端口，而是 61.157.90.101 这台机器的端口）连接到了 172.17.0.3（可以通过 ifconfig 命令查看当前机器的 IP） 的 22 端口（即通过 SSH 远程连接）
tcp        0      0 172.17.0.3:22           61.157.90.101:31163     ESTABLISHED
```

查看本机路由表（可以看到网关）：

```bash
netstat -rn
```

## setup

并不是所有的 Linux 都有这个命令，只有 redhat 系列的 Linux 才有。Centos 属于 redhat，Ubuntu 不属于 redhat。

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`setup`|配置网络|`setup`|--|`/usr/sbin/setup`|root|

**【示例】**

```bash
# 谨慎操作
setup
```

## mount

|命令名称|功能描述|语法|命令英文原意|命令所在路径|执行权限|
|---|---|---|---|---|---|
|`mount`|文件挂载|`mount [-t] [文件系统] [设备文件名] [挂载点]`|--|`/bin/mount`|root|

**【示例】**

```bash
mount -t iso9660 /dev/sr0 /mnt/cdrom
```
