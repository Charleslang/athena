# 配置

## 配置 JDK

疑惑：这样配置有什么用？是为了在构建脚本中能够直接使用 java 命令，而不用写命令的全路径？

:::tip 提示
需要确保 Jenkins 所在机器上已经安装了 JDK。
:::

1. 配置 JDK

![20230314215212](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314215212.png)

2. 配置全局环境变量

![20230314220249](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314220249.png)

## 配置 Maven

:::tip 提示
需要确保 Jenkins 所在机器上已经安装了 Maven。
:::

1. 配置 MAVEN_HOME

  ![20230314215015](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314215015.png)

2. 配置 Maven 的配置文件（部分 Jenkins 可能没有这个选项）
  
  ![20230318155149](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318155149.png)

3. 配置全局环境变量

  ![20230314220410](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314220410.png)

  ![20230314220609](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-14/20230314220609.png)

## Git 仓库配置
:::warning 注意
需要将仓库设置为 Public，不然 Jenkins 无法访问远程仓库。
:::

## 用户

- Manage Jenkins -> Security -> Configuration Global Sercurity -> Allow users to sign up（允许用户注册，如果我们忘记了密码，就可以重新注册一个用户）
- Manage Jenkins -> Security -> Configuration Global Sercurity -> Anyone can do anything（这一步仅供学习，生产环境严禁使用）

## 配置文件

如果使用 rpm 方式进行安装，那么在安装完成后，会生成一个文件 `/usr/lib/systemd/system/jenkins.service`，可以借助这个配置文件来设置 Jenkins 的一些参数信息。如下：
```sh
# Unix account that runs the Jenkins daemon
# Be careful when you change this, as you need to update the permissions of
# $JENKINS_HOME, $JENKINS_LOG, and (if you have already run Jenkins)
# $JENKINS_WEBROOT.
User=root
Group=root

# 务必要配置 JAVA_HOME
# The Java home directory. When left empty, JENKINS_JAVA_CMD and PATH are consulted.
Environment="JAVA_HOME=/usr/local/myapp/jdk/jdk8" # /usr/local/myapp/jdk/jdk11

# Arguments for the Jenkins JVM
Environment="JAVA_OPTS=-Djava.awt.headless=true -Xms512m -Xmx512m"

# Port to listen on for HTTP requests. Set to -1 to disable.
# To be able to listen on privileged ports (port numbers less than 1024),
# add the CAP_NET_BIND_SERVICE capability to the AmbientCapabilities
# directive below.
Environment="JENKINS_PORT=8083"

# Jenkins 的工作目录
# Directory where Jenkins stores its configuration and workspaces
Environment="JENKINS_HOME=/var/lib/jenkins"
WorkingDirectory=/var/lib/jenkins

# @see https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/
# Servlet context (important if you want to use reverse proxying)
Environment="JENKINS_PREFIX=/jenkins"

# Arbitrary additional arguments to pass to Jenkins.
# Full option list: java -jar jenkins.war --help
Environment="JENKINS_OPTS=--logfile=/var/log/jenkins/jenkins.log"
```
:::warning 注意
修改配置文件后，需要依次执行以下命令才能使最新的配置生效。

```sh
# 读取最新的配置文件并重新加载 systemd 守护进程
sudo systemctl daemon-reload

# 重启 Jenkins
sudo systemctl restart jenkins
```
:::

## 反向代理
默认情况下，启动 Jenkins 后，它的 Servlet context 是 `/`。这意味着，我们访问 Jenkins 时，只能通过 `http://localhost:8080` 进行访问，如果要和其它应用进行区分，就只能修改 Jenkins 的端口，例如修改为 `http://localhost:9999`。但是呢，这样会把端口暴露出来，有时候，我们想使用 Nginx 进行反向代理来隐藏端口。配置如下：

- `/usr/lib/systemd/system/jenkins.service`

  ```sh
  # Port to listen on for HTTP requests. Set to -1 to disable.
  # To be able to listen on privileged ports (port numbers less than 1024),
  # add the CAP_NET_BIND_SERVICE capability to the AmbientCapabilities
  # directive below.
  Environment="JENKINS_PORT=9999"

  # @see https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/
  # Servlet context (important if you want to use reverse proxying)
  Environment="JENKINS_PREFIX=/jenkins"
  ```

- `nginx.conf`

  ```nginx
  server {
    listen 80;
    server_name localhost;
    
    location /jenkins {
      proxy_pass http://localhost:9999/jenkins;
    }
  }
  ```

在进行了上面的配置之后，需要重启 Jenkins、Nginx：

```sh
# 读取最新的配置文件并重新加载 systemd 守护进程
sudo systemctl daemon-reload

# 重启 Jenkins
sudo systemctl restart jenkins

# 重启 Nginx
nginx -s reload
```

重启完成后，访问 `localhost/jenkins` 即可。但是，可能在 Jenkins 的部分 Web 界面出现如下提示信息：

![20230318231107](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318231107.png)

解决办法为，使用 `localhost:9999/jenkins` 访问 Jenkins，做如下修改：

![20230318231320](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-18/20230318231320.png)

