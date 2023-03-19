# 安装

## 限制
:::warning 参考
[Prerequisites](https://www.jenkins.io/doc/book/installing/linux/#prerequisites)
:::
### JDK 版本
由于 Jenkins 是用 Java 编写的，所以需要安装 JDK，此处省略 JDK 的安装步骤。

从 Jenkins 2.357 和 LTS 2.361.1 开始，Jenkins 需要 Java 11 或 17，见 [Jenkins requires Java 11 or newer](https://www.jenkins.io/blog/2022/06/28/require-java-11/)。如果你用的是 JDK8，那么请务必参考 [Java requirements](https://www.jenkins.io/doc/administration/requirements/java/)、[Long Term Support (LTS) Release Line](https://pkg.jenkins.io/redhat-stable/) 来安装与之对应的 Jenkins 版本（此处的版本是 2.346.1）。

```sh
# 查看 jenkins 版本
rpm -q jenkins
```

:::tip 提示
Jenkins 可以通过 WAR 文件、源码包、安装程序和 Docker 镜像的形式进行安装。见 [Downloading Jenkins](https://www.jenkins.io/download/)、[Installing Jenkins](https://www.jenkins.io/doc/book/installing/)。
:::

## rpm 包

:::tip 参考
[red-hat-centos](https://www.jenkins.io/doc/book/installing/linux/#red-hat-centos)

[jenkins和jdk安装教程(安装支持jdk8的最新版本)](https://blog.csdn.net/u013078871/article/details/127200623)
:::

```sh
# 安装最新版的 Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo --no-check-certificate
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum upgrade
sudo yum install jenkins
```
:::details 注意
执行 `wget` 时, 我额外添加了参数 `--no-check-certificate`，如果不加这个参数的话，可能会报如下错误：

```txt
Resolving pkg.jenkins.io (pkg.jenkins.io)... 146.75.114.133, 2a04:4e42:1a::645
Connecting to pkg.jenkins.io (pkg.jenkins.io)|146.75.114.133|:443... connected.
ERROR: cannot verify pkg.jenkins.io's certificate, issued by ‘/C=US/O=Let's Encrypt/CN=R3’:
Issued certificate has expired.
To connect to pkg.jenkins.io insecurely, use `--no-check-certificate'.
```
:::

通过上面的方式，会安装最新版的 Jenkins，但是呢，从 Jenkins 2.357 和 LTS 2.361.1 开始，需要 JDK11 或者 JDK17，如果使用的是 JDK8，那么需要安装指定的 Jenkins 版本，见 [Long Term Support (LTS) Release Line](https://pkg.jenkins.io/redhat-stable/) 。

可以在 [GitHub](https://github.com/jenkinsci/jenkins/releases/tag) 上找到所有的 Jenkins 版本。以下安装的是 2.346.1 版本。

```sh
wget https://github.com/jenkinsci/jenkins/releases/download/jenkins-2.346.1/jenkins-2.346.1-1.1.noarch.rpm

rpm -ivh jenkins-2.346.1-1.1.noarch.rpm

chmod -R 777 /var/lib/jenkins \
  && chmod -R 777 /var/cache/jenkins \
  && chmod -R 777 /var/log/jenkins
# 或
chown -R root:root /var/lib/jenkins \
  && chown -R root:root /var/cache/jenkins \
  && chown -R root:root /var/log/jenkins
```
如果是通过 rpm 安装的指定版本，那么还需要通过下面的方式修改 Jenkins 的默认配置：

```sh
vim /usr/lib/systemd/system/jenkins.service
```

- `/usr/lib/systemd/system/jenkins.service`

  首次接触 Jenkins 时，修改以下配置就够了。更多其它的配置可参考 [配置文件](./config.md#配置文件)。

  ```sh
  # 按照个人需求进行修改就行

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

  # Arbitrary additional arguments to pass to Jenkins.
  # Full option list: java -jar jenkins.war --help
  Environment="JENKINS_OPTS=--logfile=/var/log/jenkins/jenkins.log"
  ```

修改了 Jenkins 配置文件后，再执行以下命令：

```sh
# 读取最新的配置文件并重新加载 systemd 守护进程
sudo systemctl daemon-reload

# 将 Jenkins 设置成开机自启（可选）
sudo systemctl enable jenkins

# 启动 Jenkins
sudo systemctl start jenkins

# 重启 Jenkins
sudo systemctl restart jenkins

# 查看 Jenkins 状态
sudo systemctl status jenkins

# 停止 Jenkins
sudo systemctl stop jenkins
```

在启动 Jenkins 时，可能会失败, 如下：

```sh
[root@djfcentos1 jenkins]# systemctl start jenkins
Job for jenkins.service failed because a timeout was exceeded. See "systemctl status jenkins.service" and "journalctl -xe" for details.
```
根据提示信息，使用 `systemctl status jenkins.service` 或者 `journalctl -xe` 来查看错误日志，下面是使用 `journalctl -xe` 看到的日志：
```txt
Mar 12 16:40:41 djfcentos1 jenkins[24639]: 2023-03-12 08:40:41.014+0000 [id=44]        INFO        hudson.util.Retrier#start: Attempt #1 to do the action check updates server
Mar 12 16:40:41 djfcentos1 sshd[24715]: Failed password for root from 112.64.32.118 port 54648 ssh2
Mar 12 16:40:41 djfcentos1 sshd[24715]: Received disconnect from 112.64.32.118 port 54648:11: Bye Bye [preauth]
Mar 12 16:40:41 djfcentos1 sshd[24715]: Disconnected from 112.64.32.118 port 54648 [preauth]
```
可以看到，在启动 Jenkins 时，它访问了一个地址去更新 Jenkins 的插件，但是这个地址访问超时了，解决办法如下：
```sh
vim /var/lib/jenkins/hudson.model.UpdateCenter.xml
```
修改插件的镜像源，如下：
```xml
<?xml version='1.1' encoding='UTF-8'?>
<sites>
  <site>
    <id>default</id>
    <url>https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json</url>
  </site>
</sites>
```
然后重启 Jenkins 即可:
```sh
systemctl restart jenkins
```
如果使用 `systemctl status jenkins.service` 看到类似以下的信息，则也可以使用上面的方式来解决。
```txt
● jenkins.service - Jenkins Continuous Integration Server
   Loaded: loaded (/usr/lib/systemd/system/jenkins.service; disabled; vendor preset: disabled)
   Active: activating (start) since Tue 2023-03-14 23:09:11 CST; 51s ago
 Main PID: 28811 (java)
    Tasks: 50
   Memory: 217.6M
   CGroup: /system.slice/jenkins.service
           └─28811 /usr/local/myapp/jdk/jdk11/bin/java -Djava.awt.headless=true -Xms512m -Xmx512m -jar /usr/share/java/jenkins.war --webroot=%C/jenkins/war --httpPort=8083 --logfile=/v...

Mar 14 23:09:11 djfcentos1 systemd[1]: Starting Jenkins Continuous Integration Server...
Mar 14 23:09:11 djfcentos1 jenkins[28811]: Running from: /usr/share/java/jenkins.war
Mar 14 23:09:16 djfcentos1 jenkins[28811]: WARNING: An illegal reflective access operation has occurred
Mar 14 23:09:16 djfcentos1 jenkins[28811]: WARNING: Illegal reflective access by org.codehaus.groovy.vmplugin.v7.Java7$1 (file:/var/lib/jenkins/%25C/jenkins/war/WEB-INF/lib...g.Class,int)
Mar 14 23:09:16 djfcentos1 jenkins[28811]: WARNING: Please consider reporting this to the maintainers of org.codehaus.groovy.vmplugin.v7.Java7$1
Mar 14 23:09:16 djfcentos1 jenkins[28811]: WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
Mar 14 23:09:16 djfcentos1 jenkins[28811]: WARNING: All illegal access operations will be denied in a future release
```

启动成功后，访问 `192.168.103.129:8083` 即可（admin 的密码在 `/var/lib/jenkins/secrets/initialAdminPassword`）。

输入密码后，需要进行一些配置，如下：

**1. 安装一些插件**

  ![20230312165108](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312165108.png)

**2. 取消全部插件（后续按需安装）**

  ![20230312165035](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312165035.png)

**3. 创建一个管理员用户（可选，默认的超管是 admin）**

  ![20230312165208](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312165208.png)

**4. 确认 Jenkins 的访问地址是否正确**

  ![20230312170555](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312170555.png)

  ![20230312165327](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312165327.png)


如果上面的步骤顺利，那么在最后，你会看到如下的界面：

![20230312170732](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312170732.png)


## WAR 包

:::tip 参考
[WAR file](https://www.jenkins.io/doc/book/installing/war-file/)

[Other Servlet Containers](https://www.jenkins.io/doc/book/installing/servlet-containers/)（不推荐）

可以在官网下载 WAR 包，如果官网无法下载，可以在 :point_right: [这里](https://updates.jenkins-ci.org/download/war/) 下载。
:::


1. 下载完成之后，将 `jenkins.war` 包放入 tomcat 的 webapps 目录下，启动 tomcat 服务器，然后访问 `xxx/jenkins`。

2. 在访问之后，会提示输入管理员（admin）的密码，而密码就在 `/root/.jenkins/secrets/initialAdminPassword` 这个文件中。

  ```sh
  cat /root/.jenkins/secrets/initialAdminPassword
  # 9db91aa61b5848f4afc7b27dc8d1abbb
  ```

后面的步骤就和 [rpm 包](#rpm-包) 的安装步骤一样了，此处就不再记录了。

## 卸载

如果使用的是 `yum` 命令进行安装的，那么需要执行以下命令进行卸载：
```sh
yum remove jenkins
```
如果使用的是 `rpm` 包进行安装的，那么需要执行以下命令进行卸载：
```sh
rpm -e jenkins
```
彻底删除 Jenkins 相关的文件：
```sh
find / -iname jenkins | xargs -n 1000 rm -rf
```
查看 Jenkins 是否卸载完成：
```sh
rpm -q jenkins
```
## 写在最后

我最开始安装的 Jenkins 是 2.346.1 版本，因为我用的 JDK8。但是呢，当我安装插件的时候，我发现我所需要的大部分插件都要求 Jenkins 版本在 2.361.1 版本及以上，但是从 2.361.1 开始，Jenkins 只支持 JDK11 和 JDK17 了。于是就上网搜了一下，发现可以手动上传插件，哈哈哈，终于能够解决了。但是呢，当我下载完插件后手动上传到 Jenkins 时，我发现很多插件都依赖了许多其它插件，如果想要安装某个插件，就必须先把它所依赖的所有插件都全部进行安装。可我是手动安装，这样太麻烦了。折腾了半天，一个插件都没安装完。因此，我妥协了，安装了 Jenkins 2.375.1 版本（记得下载 JDK11，并修改 `/usr/lib/systemd/system/jenkins.service` 中的 `JAVA_HOME`）。为什么是 Jenkins 2.375.1？因为安装插件时又因为版本问题而不断尝试 Jenkins 版本，最终就安装了这个版本。

:::tip 说明
通过 WAR 包安装的 Jenkins，工作目录默认是 `/root/.jenkins/workspace`。
:::

:::tip 插件镜像
对于插件来讲，直接使用 Jenkins 官方的镜像会比较慢，所以推荐换成国内的镜像源 :point_down: 。

[戳这里](https://blog.csdn.net/weixin_30588381/article/details/113067233?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.no_search_link&spm=1001.2101.3001.4242)  

[戳这里](https://segmentfault.com/a/1190000022504097)


[戳这里](https://www.jianshu.com/p/2389ed2d2cb0)
:::
