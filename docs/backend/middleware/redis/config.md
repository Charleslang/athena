# Redis 配置

## 配置文件

Redis 的配置文件位于 `$REDIS_HOME/redis.conf`。一些常用的配置如下：

```sh
# Redis 宿主机 IP，0.0.0.0 表示可以通过任意 IP 来访问 Redis
bind 0.0.0.0
# 守护进程，修改为 yes 后即可后台运行
daemonize yes 
# 密码，设置后访问 Redis 必须输入密码
requirepass 123456
# 监听的端口
port 6379
# 工作目录，默认是当前目录，也就是运行 redis-server 命令时所在的目录。Redis 日志、持久化等文件会保存在这个目录
dir .
# 数据库数量。设置为 1，代表只使用 1 个库，默认有 16 个库，编号 0~15。该值默认是 16
databases 1
# 设置 Redis 能够使用的最大内存
maxmemory 512mb
# 日志文件名称。默认为空（即 logogile ""），表示不记录日志。
logfile "redis.log"
```