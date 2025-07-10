# 拆分原则

服务拆分要尽可能做到高内聚、低耦合，拆分的方式可分为：

- 垂直（纵向）拆分：按照业务模块进行拆分
- 水平（横向）拆分：抽取共服务，提高复用性，例如风控、短信等服务

目前流行的微服务工程结构有两种：

- 每个微服务都是一个独立的 Maven 工程，他们可以被放在同一个目录中，也可以放在不同的目录中。每个微服务都有自己独立的 Git 仓库，并且独立打包和部署。每个独立的 Maven 工程也都可以有自己的父工程，也可以采用 Maven 聚合的方式进行管理。适用于大型项目，服务数量较多的情况。
- 所有微服务都放在一个父工程中，通过 Maven 的多模块聚合进行管理，每个微服务都是父工程的一个子模块。每个微服务都可以有自己独立的 Git 仓库，也可以和工程放在同一个 Git 仓库中。适用于中小型项目，服务数量较少的情况。

为了加深对微服务的理解，我们先从单体项目开始，把这个项目拆分成微服务。在拆分的过程中，我们会遇到各种问题，为了解决这些问题，我们会引入微服务相关的组件。单体项目的结构如下：

![20250625225419](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-06-25/20250625225419.png)


Maven 项目结构如下：

- hmall

```xml
<groupId>com.heima</groupId>
<artifactId>hmall</artifactId>
<packaging>pom</packaging>
<version>1.0.0</version>
<modules>
    <module>hm-common</module>
    <module>hm-service</module>
</modules>

<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.12</version>
    <relativePath/>
</parent>
```

- hm-common

```xml
<!-- hm-common 中主要是一些工具类以及公共组件，例如数据库、MyBatis 的配置等等 -->
<parent>
    <artifactId>hmall</artifactId>
    <groupId>com.heima</groupId>
    <version>1.0.0</version>
</parent>
<modelVersion>4.0.0</modelVersion>

<artifactId>hm-common</artifactId>
```

- hm-service

```xml
<parent>
    <artifactId>hmall</artifactId>
    <groupId>com.heima</groupId>
    <version>1.0.0</version>
</parent>
<modelVersion>4.0.0</modelVersion>

<artifactId>hm-service</artifactId>

<dependencies>
    <!--hm-common-->
    <dependency>
        <groupId>com.heima</groupId>
        <artifactId>hm-common</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>    
```

hm-service 主要包含了用户、商品、购物车、订单等模块，我们要做的就是把 hm-service 进行拆分。此处使用垂直拆分，并使用 Maven 聚合的方式管理微服务，拆分后的项目结构如下：

```text
hmall
├── hm-common
├── hm-goods-service
├── hm-cart-service
```
