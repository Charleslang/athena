# 安装

## 源码安装
:::tip 参考
[Install Redis from Source](https://redis.io/docs/getting-started/installation/install-redis-from-source/)
:::

Redis 是基于 C 语言编写的，因此首先需要安装 Redis 所需要的 gcc 依赖：

```sh
# 查看版本
gcc -v

# 安装 gcc 和 tcl
yum install -y gcc tcl
```

下载 Redis 源码包：
```sh
wget https://packages.redis.io/redis-stack/redis-stack-server-6.2.6-v7.rhel7.x86_64.tar.gz?_gl=1*1usxo17*_ga*Mjk4ODg3NzExLjE2Njc5MTcxNTc.*_ga_8BKGRQKRPV*MTY4NDY1MzQ5Ny4zLjEuMTY4NDY1NjExMi4yMi4wLjA.
```

编译：
```sh
tar -zxf redis-stack-server-6.2.6-v7.rhel7.x86_64.tar.gz
mv redis-stack-server-6.2.6-v7.rhel7.x86_64 redis-6.2.6
cd redis-6.2.6

# 将 redis 安装到 /usr/local/redis 目录下, 默认是在 /usr/local/ 目录下
make PREFIX=/usr/local/redis && make install
```
只要执行命令不报错，就说明 Redis 安装成功了。

执行 `make` 命令可能会出现下面的报错：

![20230521161105](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-05-21/20230521161105.png)

这是因为 Redis6.0 之后需要高版本的 gcc，先执行以下命令卸载 Redis：

```sh
cd redis-6.2.6

make distclean
make clean

# 删除 redis 解压后的文件
cd ..
rm -rf redis-6.2.6

# 重新解压
tar -zxf redis-stack-server-6.2.6-v7.rhel7.x86_64.tar.gz
mv redis-stack-server-6.2.6-v7.rhel7.x86_64 redis-6.2.6
```
安装高版本的 gcc 和 tcl：
```sh
# 查看 gcc 版本是否在 5.3 以上，centos7.6 默认安装 4.8.5
gcc -v
# 升级 gcc 到 5.3 及以上, 此处升级到 gcc 9.3
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash

# 需要注意的是 scl 命令启用只是临时的，退出 shell 或重启就会恢复原系统 gcc 版本。
# 如果要长期使用 gcc 9.3 的话，需要使用下面的命令

echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile

# 这样退出 shell 重新打开就是新版的 gcc 了。其他版本同理，修改 devtoolset 版本号即可。
```

:::tip 安装报错参考
[Centos7.6 安装 redis6.0.1](https://my.oschina.net/u/4326248/blog/4267380/print)  
[Centos7 安装 redis 6 编译错误](https://www.limstash.com/articles/202005/1633)  
[You need tcl 8.5 or newer in order to run the Redis test](https://www.cnblogs.com/Security-Darren/p/4381932.html)
:::

## Docker 安装

:::tip 参考
[docker安装redis指定配置文件](https://www.jianshu.com/p/67fc4b1cbe1b)
:::

```sh
docker pull redis:6.2.12
```

```sh
# -p 6379:6379 将容器的 6379端 口映射到宿主机的 6379 端口
# -v /usr/local/djfapp/redis/conf/redis.conf:/etc/redis/redis.conf 将宿主机中当前目录下的 redis.conf 映射成容器内redis 的启动配置文件
# -v /usr/local/djfapp/redis/data:/data 将宿主机中当前目录下 /usr/local/djfapp/redis/data 挂载到容器的 /data
# redis-server /etc/redis/redis.conf 让容器使用指定的配置文件启动 redis-server 进程（该配置文件是容器内的，但是我们之前已经做了本地配置文件的映射，所以就相当于用本地的配置文件来启动）
# --requirepass "123456" 指定 redis-server 的密码（可选）
# --appendonly yes 开启数据持久化（可选）

docker run -p 6379:6379 --name redis01 \
 -v /usr/local/djfapp/redis/conf/redis.conf:/etc/redis/redis.conf \
 -v /usr/local/djfapp/redis/data:/data \
 -d redis:6.2.12 \
 redis-server /etc/redis/redis.conf --requirepass "123456" --appendonly yes
```

```sh
docker exec -it myredis redis-cli
```

## 启动 Redis

```sh
# Redis 默认是安装在 /use/local 目录下
# 该方式默认是前台启动 Redis
# /usr/local/bin/redis-server 其实是 redis-server 的软链接
/usr/local/bin/redis-server
```
后台启动 Redis: 
```sh
# 备份配置文件
cp /usr/local/redis/redis.conf /usr/local/redis/redis.conf.bak

# 修改配置文件
vim /usr/local/redis/redis.conf
```
```sh
# 哪些 IP 可以访问 Redis。0.0.0.0 表示任意 IP 都可以访问 Redis
bind 0.0.0.0
# 守护进程，修改为 yes 后即可后台运行
daemonize yes 
# 密码，设置后访问 Redis 必须输入密码
requirepass 123456
```
```sh
# 进入 redis 安装目录 
cd /usr/local/redis/
# 通过指定的配置文件来启动 Redis
./src/redis-server redis.conf
```
```sh
# 查看 Redis 是否启动成功
ps aux | grep redis
```
## 停止 Redis
```sh
# 查看 Redis 的进程号
ps aux | grep redis

# 通过 kill 命令来停止 Redis（不推荐）
kill -9 12345

# 利用 redis-cli 来执行 shutdown 命令即可停止 Redis 服务（推荐）
# 因为之前配置了密码，因此需要通过 -u 或者 -a 来指定密码
redis-cli -u 123456 shutdown
```
## 设置开机自启

新建一个系统服务文件 `redis.service`：

```sh
vim  /etc/systemd/system/redis.service
```

内容如下：

```sh
[Unit]
Description=redis-server
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/redis/bin/redis-server /usr/local/redis/redis.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

然后重载系统服务：

```sh
systemctl daemon-reload
```

现在，我们可以用下面这组命令来操作 Redis 了：

```sh
# 启动
systemctl start redis
# 停止
systemctl stop redis
# 重启
systemctl restart redis
# 查看状态
systemctl status redis
# 设置开机自启
systemctl enable redis
# 取消开机自启
systemctl disable redis
```
## Redis 客户端

安装完成 Redis 后，我们就可以操作 Redis 来实现数据的 CRUD 了。这需要用到 Redis 客户端，Redis 客户端包括：

- 命令行客户端
- 图形化桌面客户端
- 编程客户端

### Redis 命令行客户端

Redis 安装完成后就自带了命令行客户端 `redis-cli`，使用方式如下：

```sh
redis-cli [options] [commonds]
```

其中常见的 options 有：

- `-h`：指定要连接的 redis 节点的IP地址，默认是 127.0.0.1
- `-p`：指定要连接的 redis 节点的端口，默认是 6379
- `-a`：指定 redis 的访问密码 

其中的 commonds 就是 Redis 的操作命令。例如 `ping` 命令可以为 redis 服务端做心跳测试，服务端正常会返回 `pong`。
```sh
redis-cli -h localhost -p 6379 -a 123456 ping
```

不指定 commond 时，会进入 `redis-cli` 的交互控制台。在交互控制台中，我们可以输入 Redis 的操作命令，例如 `select 0`。

### 图形化桌面客户端

:::tip 
Redis 官方图形客户端 [RedisInsight](https://redis.io/download/)   
其它客户端：[RedisDesktopManager-Windows](https://github.com/lework/RedisDesktopManager-Windows/releases)、[AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager)
:::
