# 简介

说到微服务，就不得不提 Spring Cloud 系列。[Spring Cloud](https://spring.io/projects/spring-cloud) 是一个服务治理平台，是若干个框架的集合，它提供了全套的分布式系统解决方案。包含了服务注册与发现、配置中心、服务网关、智能路由、负载均衡、断路器、监控跟踪、分布式消息队列等等。

Spring Cloud 通过 Spring Boot 风格的封装，屏蔽了复杂的配置和底层实现，为开发人员提供了一些快速构建分布式系统的常见工具。微服务是可以独立部署、水平扩展、独立访问的服务单元，Spring Cloud 就是这些微服务的大管家。采用了微服务这种架构之后，项目的数量会非常多。Spring Cloud 做为大管家需要管理好这些微服务，自然需要很多小弟来帮忙。

所以，我们经常说的 Spring Cloud 并不是一个简单而纯粹的框架，它是一个复杂的框架集合。它包括了 Spring Cloud Alibaba、Spring Cloud Config、Spring Cloud Gateway、Spring Cloud OpenFeign 等其他常用的微服务组件。其实这些组件很多都不是由 Spring 官网开发的，例如 Spring Cloud Alibaba，那为什么别人开发的组件需要整合到 Spring 旗下呢？因为 Spring 是 Java 开发中最重要的框架，并且 Spring 官网提供了 Spring Boot 用于快速搭建微服务应用。同时，Spring 也定义了一套规范，不同厂商开发的组件必须要遵循这个规范（面向接口编程），这样可以更加方便的切换相同功能的组件。例如，开发“注册中心”（例如 Eureka、Nacos）这个组件就必须遵循相关的规范，即使我们更换了注册中心的实现，也无需修改代码。

下面，我们来对比一下单体架构和微服务架构。

**单体架构：** 所有业务功能都集中在一个项目中开发，最终打成一个包进行部署。业务耦合度高，不利于扩展。架构简单，部署成本低。

**微服务架构：** 对系统功能进行拆分，每个功能模块作为独立的项目，每个项目称为一个服务。业务耦合度低，有利于服务升级拓展。架构复杂，部署成本高。

微服务其实是分布式架构的一种实践方案，这种方案需要技术框架来落地，全球的互联网公司都在积极尝试自己的微服务落地技术。在国内最知名的就是 Spring Cloud 和阿里巴巴的 Dubbo。

由于 Spring Cloud 是基于 Spring Boot 的，所以，Spring Cloud 和 Spring Boot 的版本需要一一对应，如下：

![20250625230821](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-06-25/20250625230821.png)

:::tip
Spring Cloud 和 Spring Boot 的版本对应关系请见 [Getting Started](https://spring.io/projects/spring-cloud)。
:::

除此之外，Spring Cloud 相关的组件和 Spring Cloud 的版本也需要互相对应。不过，我们一般不用显示指定组件的版本，因为 Spring Cloud 帮我们指定了这些组件的版本。如下：

```xml
<properties>
    <spring-cloud.version>2025.0.0</spring-cloud.version>
</properties>
<dependencyManagement>
    <dependencies>
        <!-- spring-cloud-dependencies 中指定了常用组件的版本 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
