# 注册中心

随着单体应用拆分，面临的第一份挑战就是服务实例的数量较多，并且服务自身对外暴露的访问地址也具有动态性。可能因为服务扩容、服务的失败和更新等因素，导致服务实例的运行时状态经常变化。此时就需要一个集中的管理对象，就是注册中心。

注册中心能实现自动注册各个服务的实例，一旦实例上线，就会被自动注册到注册中心，一旦实例下线，就会被自动从注册中心剔除。当某个实例注册到注册中心后，该实例需要定期向注册中心发送心跳，如果在一定时间内没有发送心跳，那么该实例就会从注册中心中移除。当注册中心检测到某个服务的实例发生了变化，那么，注册中心会自动把最新的变更推送给该服务的消费者。

对于一个服务来讲，该服务的提供者和消费者都需要注册到注册中心。消费者需要从注册中心拉取服务的实例，然后使用负载均衡算法选择一个实例进行调用。

常见的注册中心有 Eureka、Consul、Nacos、Zookeeper，前三者属于 Spring Cloud 体系，最后一个属于 Dubbo 类体系。两种体系代表两种注册中心实现方案，虽然是不同的方案，但是最终实现的效果相同。不管使用哪种注册中心，他们都遵循了 Spring Cloud 的标准，所以，在使用层面上，他们的差别并不大。这里，我们使用 Nacos 作为注册中心。

## Nacos

[Nacos](https://nacos.io/) 是 Dynamic Naming and Configuration Service 的首字母简称，一个易于构建 AI Agent 应用的动态服务发现、配置管理和AI智能体管理平台。

### 部署

:::tip 参考
[Nacos部署手册](https://nacos.io/docs/v2.5/manual/admin/deployment/deployment-overview/?spm=5238cd80.2ef5001f.0.0.3f613b7cxyRqKk)。
:::

本质上来讲，Nacos 本身也是一个服务。所以，我们需要先部署 Nacos。本次使用 2.5.x 的单机部署。参考下面的步骤。

**1. [下载安装包](https://nacos.io/docs/v2.5/quickstart/quick-start/?spm=5238cd80.2ef5001f.0.0.3f613b7cxyRqKk)**

![20250710223014](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710223014.png)

**2. [初始化 SQL 脚本](https://nacos.io/docs/v2.5/manual/admin/deployment/deployment-standalone/?spm=5238cd80.2ef5001f.0.0.3f613b7cxyRqKk)**

![20250710223126](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710223126.png)

![20250710223404](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710223404.png)

在解压后的 ZIP 文件中也能找到初始化的 SQL，如下：

![20250710223531](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710223531.png)

**3. 修改 Nacos 配置**

解压步骤 1 下载的压缩包，然后修改 `conf/application.properties` 中的配置，如下：

```yml
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
### Deprecated configuration property, it is recommended to use `spring.sql.init.platform` replaced.
spring.datasource.platform=mysql
spring.sql.init.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql:///nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=Asia/Shanghai
db.user.0=root
db.password.0=123456
```

**4. 启动 Nacos**

进入解压后的 bin 目录，执行下面的命令（需要提前配置 JAVA_HOME）：

```sh
startup.cmd -m standalone
```

**5. 访问 Nacos 控制台**

在浏览器中访问 `localhost:8848/nacos`，如下：

![20250710225416](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710225416.png)

:::warning 
自 2.4.0 版本开始，Nacos 构建时不再提供管理员用户 nacos 的默认密码，需要在首次开启鉴权后，通过 API 或 Nacos 控制台进行管理员用户 nacos 的密码初始化。
:::

### 服务注册

:::tip 参考
[Nacos 融合 Spring Cloud，成为注册配置中心](https://nacos.io/docs/v2.5/ecology/use-nacos-with-spring-cloud/?spm=5238cd80.2ef5001f.0.0.3f613b7cxyRqKk)。
:::

添加依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <!-- 可以去掉版本号，因为项目中引入了 spring-cloud-alibaba-dependencies 来自动管理版本 -->
    <!-- <version>2023.0.3.2</version> -->
</dependency>
```

- application.yml

```yml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        # 没有密码的话，可以不用配置
        username:
        password:
```

启动服务后，查看 Nacos 的服务列表：

![20250710231713](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-10/20250710231713.png)
