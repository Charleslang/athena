# 安装

:::tip 参考
[Downloading and Installing RabbitMQ](https://www.rabbitmq.com/download.html)
:::

## 压缩包
如果使用压缩包安装 RabbitMQ，可以参考本节开头给出的链接 Downloading and Installing RabbitMQ。此处来简单介绍一下压缩包的安装方式。

1. **点击 Downloading and Installing RabbitMQ**

  ![20231009225304](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009225304.png)

2. **选择 RHEL, CentOS Stream, Fedora**

  ![20231009225538](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009225538.png)

3. **选择 RabbitMQ 版本**

  ![20231009225826](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009225826.png)

在步骤 2 中，我们选择了基于 CentOS 进行安装，但是呢，在 GitHub 上找到的 RPM 安装包只支持 CentOS 8，而我使用的是 CentOS 7，显然找错了？我们再看看步骤 2，发现有一个 Generic binary build 选项，如下：

![20231009231632](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009231632.png)

但是呢，点进去后，我们发现，这个链接中只有最新版本，如果我想下载其它版本，就需要进入 GitHub，如下：

![20231010222655](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010222655.png)

其实，上面的 GitHub 地址和步骤 3 的 GitHub 链接是一样的，如下：

![20231010230534](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010230534.png)

在这里，我准备安装的是 RabbitMQ v3.10.20 版本，在 GitHub 的 tag 中，找到该版本，然后点进去，会有一些提示信息，比如该版本所依赖的 Erlang 版本，如下：

![20231010225904](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010225904.png)

其实，RabbitMQ 官网也有关于 Erlang 版本的说明，如下：

![20231009230322](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009230322.png)

![20231009230403](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-09/20231009230403.png)

好了，前面提到了这么多，其实就是想说明，RabbitMQ 的安装包是有依赖的，如果你的系统没有安装 Erlang，那么你就需要先安装 Erlang，然后再安装 RabbitMQ，并且需要 RabbitMQ 和 Erlang 的版本匹配。如果你的系统已经安装了 Erlang，那么你就需要检查一下 Erlang 的版本是否和 RabbitMQ 的版本匹配。

Eelang 的安装可参考[安装-Erlang](./installing.md#安装-erlang)。

```sh
# 下载压缩包
wget https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.10.20/rabbitmq-server-generic-unix-3.10.20.tar.xz

# 展开打包文件即可（没有 -z 选项）
tar -xvf rabbitmq-server-generic-unix-3.10.20.tar.xz

# 进入展开后的打包文件
cd rabbitmq_server-3.10.20

# 前台启动 RabbitMQ
./sbin/rabbitmq-server

# 后台启动 RabbitMQ
./sbin/rabbitmq-server -detached

# 停止 RabbitMQ
./sbin/rabbitmqctl shutdown
```

## RPM 包
如果使用 RPM 包安装 RabbitMQ，可以参考本节开头给出的链接 Downloading and Installing RabbitMQ。所有用到的链接都在“使用压缩包安装”的章节中，这里就不再赘述了。

由于我使用的是 CentOS 7，而较新的 RabbitMQ 提供的 RPM 包只支持 CentOS 8，所以我选择了一个较低的 RabbitMQ 版本 v3.8.8。

## Docker 安装

## 安装 Erlang

我们完全可以在网上找到完整的 Erlang 安装包，但是有时候，我们并不想安装完整的 Erlang，而是想安装一个最小化的 Erlang。恰好，RabbitMQ 官网提供了一个 Erlang 的精简包，该包仅提供运行 RabbitMQ 所需的组件。这也是 RabbitMQ 官网推荐的安装方式。

需要注意的是，RabbitMQ 官网提供的 Erlang 包从 2022 年 5 月起停止支持 CentOS 7。Erlang 26.1 和 25.3.2.3 包含与 OpenSSL 1.1.x 静态链接的一次性 CentOS 7 软件包。常规 CentOS 7 和 Amazon Linux 2 版本一直生产到 Erlang 23.3.4.18，它们与 OpenSSL 1.0 动态链接。

![20231010225430](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010225430.png)

好了，下面来介绍一下 Erlang 的安装。

1. **点击 RHEL, CentOS Stream, Fedora**

  ![20231010223832](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010223832.png)

2. **选择 package dependencies**

  ![20231010223922](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010223922.png)

3. **在页面中搜索 `Install Erlang`**

  ![20231010224027](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010224027.png)

由于我是 CentOS 7，所以我选择 Erlang v25.3.2.3，如下：

![20231010230124](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-10-10/20231010230124.png)

```sh
# 下载 rpm 包
wget https://github.com/rabbitmq/erlang-rpm/releases/download/v25.3.2.3/erlang-25.3.2.3-1.el7.x86_64.rpm

# 安装 erlang
rpm -ivh erlang-25.3.2.3-1.el7.x86_64.rpm

# 验证 Erlang 是否安装成功（在任意目录执行以下命令）
[root@djfcentos1 erlang]# erl
Erlang/OTP 25 [erts-13.2.2.2] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:1]

Eshell V13.2.2.2  (abort with ^G)
1> ^C # （按下 Ctrl + C 退出，然后再按 a 退出）
```

## 基础配置

:::tip 参考
[Generic Binary Build ("Generic UNIX Build")](https://www.rabbitmq.com/install-generic-unix.html)  
[Installing on RPM-based Linux (RHEL, CentOS Stream, Fedora, Amazon Linux 2023, openSUSE)](https://www.rabbitmq.com/install-rpm.html#downloads)
:::

作为一个初次接触 RabbitMQ 的小白，强烈建议在安装完 RabbitMQ 后，不要着急启动 RabbitMQ，而是先来了解一下 RabbitMQ 的基础配置。在上面的两个链接中，分别讲解了通过压缩包、RPM 包安装 RabbitMQ 的基础配置，以及它们各自的启动、关闭方式等。作为小白，十分推荐看完上面两个链接的内容。

