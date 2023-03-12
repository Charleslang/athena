# 简介

[Jenkins](https://www.jenkins.io) 是一款由 Java 编写的开源的持续集成工具。在与 Oracle 发生争执后，项目从 Hudson复刻。

Jenkins 提供了软件开发的持续集成服务。它运行在 Servlet 容器中（例如Apache Tomcat）。它支持软件配置管理（SCM）工具（包括 AccuRev SCM、CVS、Subversion、Git、Perforce、Clearcase 和 RTC），可以执行基于Apache Ant 和 Apache Maven 的项目，以及任意的 Shell 脚本和 Windows 批处理命令。

针对 CI/CD 的最著名的开源工具之一就是自动化服务器 Jenkins。从简单的 CI 服务器到完整的 CD 集线器，Jenkins 都可以处理。

# CI/CD

CI (Continuous integration，中文意思是持续集成) 是一种通过在应用开发阶段引入自动化来频繁向客户交付应用的方法。持续集成强调开发人员提交了新代码之后，立刻进行构建、（单元）测试。根据测试结果，我们可以确定新代码和原有代码能否正确地集成在一起。

![20230312141430](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312141430.png)

CD(Continuous Delivery， 中文意思持续交付)是在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境(类生产环境)中。比如，我们完成单元测试后，可以把代码部署到连接数据库的Staging环境中更多的测试。如果代码没有问题，可以继续手动部署到生产环境。下图是 CI/CD 的大概工作模式。

![20230312141526](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312141526.png)

CI/CD 的核心概念是持续集成、持续交付和持续部署。作为一种面向开发和运维团队的解决方案，CI/CD 主要针对在集成新代码时所引发的问题（亦称：“集成地狱”）。

具体而言，CI/CD 可让持续自动化和持续监控贯穿于应用的整个生命周期（从集成和测试阶段，到交付和部署）。这些关联的事务通常被统称为“CI/CD 管道”，由开发和运维团队以敏捷方式协同支持，采用的方法不是 DevOps 就是站点可靠性工程（SRE）。

# 安装

## 限制
:::tip 参考
[Prerequisites](https://www.jenkins.io/doc/book/installing/linux/#prerequisites)
:::
### JDK 版本
由于 Jenkins 是用 Java 编写的，所以需要安装 JDK，此处省略 JDK 的安装步骤。从 Jenkins 2.357 和 LTS 2.361.1 开始，Jenkins 需要 Java 11 或 17，见 [Jenkins requires Java 11 or newer](https://www.jenkins.io/blog/2022/06/28/require-java-11/)。如果你用的是 JDK8，那么请务必参考 [Long Term Support (LTS) Release Line](https://pkg.jenkins.io/redhat-stable/) 来安装与之对应的 Jenkins 版本（此处的版本是 2.346.1）。

```sh
# 查看 jenkins 版本
rpm -q jenkins
```

:::warning 注意
[Java requirements](https://www.jenkins.io/doc/administration/requirements/java/)
:::


:::tip 参考
Jenkins 可以通过 WAR 文件、源码包、安装程序和 Docker 镜像的形式进行安装。  

[Downloading Jenkins](https://www.jenkins.io/download/)。  

[Installing Jenkins](https://www.jenkins.io/doc/book/installing/)
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
执行 `wget` 时, 我额外添加了参数 `--no-check-certificate`，如果不加这个参数的话，可能会报如下的错误：

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
chown -R root:root /var/lib/jenkins
chown -R root:root /var/cache/jenkins
chown -R root:root /var/log/jenkins
```
如果是通过 rpm 安装的指定版本，那么还需要通过下面的方式修改一下 Jenkins 的默认配置：

```sh
vim /usr/lib/systemd/system/jenkins.service
```

- `/usr/lib/systemd/system/jenkins.service`

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

  # IP address to listen on for HTTP requests.
  # The default is to listen on all interfaces (0.0.0.0).
  #Environment="JENKINS_LISTEN_ADDRESS="


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

```sh
# 读取最新的配置文件并重新加载 systemd 守护进程
sudo systemctl daemon-reload

# 将 Jenkins 设置成开机自启（可选）
sudo systemctl enable jenkins

# 启动 Jenkins
sudo systemctl start jenkins

# 重启Jenkins
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
根据提示信息，使用 `systemctl status jenkins.service` 或者 `journalctl -xe` 来查看错误日志，一下是使用 `journalctl -xe` 看到的日志：
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
修改插件的镜像源如下：
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
[WAR file](https://www.jenkins.io/doc/book/installing/war-file/)。  

[Other Servlet Containers](https://www.jenkins.io/doc/book/installing/servlet-containers/)（不推荐）
:::

> 此处通过 war 包的方式进行安装，可以在官网下载 war 包，如果官网无法下载，可以在 :point_right: [这里](https://updates.jenkins-ci.org/download/war/) 下载。

1. 下载完成之后，将 `jenkins.war` 包放入 tomcat 的 webapps 目录下，访问 tomcat 服务器即可，然后访问 `xxx/jenkins`。

2. 在访问之后，会提示输入管理员（admin）的密码，而密码就在 `/root/.jenkins/secrets/initialAdminPassword` 这个文件中。

  ```sh
  cat /root/.jenkins/secrets/initialAdminPassword
  # 9db91aa61b5848f4afc7b27dc8d1abbb
  ```

3. 接下来就可以看到 Customize Jenkins，选择插件，作为初学，我们可以直接使用 `Install Suggested Plugins`，然后等待安装好插件（由于我的 Jenkins 是装在 Linux 中的，所以确保 Linux 能够联网）

4. 然后会提示创建用户（可以直接跳过）

5. 然后保存设置，点击开始使用即可


然后，我们可以进行一些简单的配置：  

1. Manage Jenkins -> Security -> Configuration Global Sercurity -> Allow users to sign up（允许用户注册，如果我们忘记了密码，就可以重新注册一个用户）
2. Manage Jenkins -> Security -> Configuration Global Sercurity -> Anyone can do anything（这一步仅供学习，生产环境严禁使用）
3. Manage Jenkins -> System Configuration -> Global Tools Configuration -> Maven Configuration（配置 Maven 和 JDK）

```sh
# 查看 MAVEN 和 JDK
echo $MAVEN_HOME
echo $JAVA_HOME
```

![image.png](https://note.youdao.com/yws/res/30745/WEBRESOURCE93381456dd78f4ff2ba78c3aad7a04e5)

![image.png](https://note.youdao.com/yws/res/30749/WEBRESOURCE344e1b8ddd3145a283be92a8012b9b15)

![image.png](https://note.youdao.com/yws/res/30751/WEBRESOURCE4b44a25161ffd95928dc8d72bd0c1655)

:::tip 说明
通过 WAR 包安装的 Jenkins，工作目录默认是 `/root/.jenkins/workspace`。
:::

:::tip 插件镜像
对于插件来讲，直接使用 Jenkins 官方的镜像会比较慢，所以推荐换成国内的镜像源 :point_down: 。

[戳这里](https://blog.csdn.net/weixin_30588381/article/details/113067233?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.no_search_link&spm=1001.2101.3001.4242)  

[戳这里](https://segmentfault.com/a/1190000022504097)


[戳这里](https://www.jianshu.com/p/2389ed2d2cb0)
:::

# 整合 gitee
  
可参考：  
https://cloud.tencent.com/developer/article/1801592  
https://gitee.com/help/articles/4193#article-header13

步骤如下：
1. 在 Jenkins 中安装 Gitee 插件，并配置 Gitee API token
2. 新建一个自由风格的项目，进行如下配置

![image.png](https://note.youdao.com/yws/res/31367/WEBRESOURCE28e89e1c5deaac65d519bc71cdf2a220)

![image.png](https://note.youdao.com/yws/res/31369/WEBRESOURCE97c45b02a33652d9080a46f9526c6114)

这一步可能出现的问题：
```
无法连接仓库：Error performing git command: /usr/local/src/git-2.9.5 ls-remote -h https://gitee.com/skynetInfo/auto-webui HEAD
```
解决如下：
```
# 在服务器上安装 git
yum install git -y
git --version
```

![image.png](https://note.youdao.com/yws/res/31371/WEBRESOURCEf991c461283320bc8e38e661ff37a89c)

![image.png](https://note.youdao.com/yws/res/31374/WEBRESOURCEf0bc5fdd91cf3f053535980c739367c3)

构建时可能出现的问题：
1. 提示命令未找到
```
# 可以通过以下方法解决
# 方法一：添加如下命令（注意, 下面这个命令前面的 # 不是注释），但是经过我的测试，不好使
#!/bin/sh -l
# 方法二：
source /etc/profile
```
![image.png](https://note.youdao.com/yws/res/31388/WEBRESOURCE49139f86b25dfecc5305cd03a7eab5b0)

经过以上步骤，就可以初步整合 Gitee 了。

 测试自动构建
先将代码 push 到远程仓库中，会发现 Jenkins 自动拉取了最新的代码，并执行了构建：
![image.png](https://note.youdao.com/yws/res/31397/WEBRESOURCE1ec88d3e4df05352b57ad66c8f4ea313)

在上面的测试中，其实只是拉取了代码，拉取代码后会进行构建，但是由于我们没有设置构建的 shell，所以其实不会进行构建，现在，就编写构建 shell，如下：
```
# 这里是 jar 包项目
source /etc/profile
echo "开始编译和打包"
mvn clean package
echo "编译和打包结束"
echo "开始运行项目"
cd target/
java -jar *.jar --server.port=8089
echo "项目成功运行"
```
然后自己手动点击【立即构建】，会发现执行了上面的 shell，并且项目也运行起来了。从此以后，只要我们 push 了代码，Jenkins 就会自动拉取最新代码，并自动执行编译打包和部署了，很方便。  

在上面的那段 shell 中，我们的项目并没有后台运行，所以在以后部署时，要先关闭之前的项目，如下：
```
ps -ef | grep java
kill pid
```
部署 war 包：  
1. 方式一，使用插件 `Deploy to container` 自动部署，请百度
2. 使用 shell 手动部署，可参考：https://www.cnblogs.com/huangrenhui/p/13272225.html
```bash
source /etc/profile
echo "开始编译和打包"
mvn clean package
echo "编译和打包结束"
cd target/
cp xxx.jar /usr/local/djfapp/java/tomcat9/webapps
cd /usr/local/djfapp/java/tomcat9/bin
./startup.sh
tail -f ../logs/catalina.out
```

# 整合 GitHub

# 安装指定版本的插件
https://blog.csdn.net/neu_xiaolu/article/details/91046185

linux 访问 github 慢 https://cloud.tencent.com/developer/ask/248782

# 构建类型

## 自由风格


