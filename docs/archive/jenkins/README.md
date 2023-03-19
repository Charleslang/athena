# 概览

## 简介

[Jenkins](https://www.jenkins.io) 是一款由 Java 编写的开源的持续集成工具，前身是 Hudson（软件）项目。在与 Oracle 发生争执后，从 Hudson 项目复刻。

Jenkins 提供了软件开发的持续集成服务。它运行在 Servlet 容器中（例如 Apache Tomcat）。它支持软件配置管理（SCM）工具（包括 AccuRev SCM、CVS、Subversion、Git、Perforce、Clearcase 和 RTC），可以执行基于 Apache Ant 和 Apache Maven 的项目，以及任意的 Shell 脚本和 Windows 批处理命令。

针对 CI/CD 的最著名的开源工具之一就是自动化服务器 Jenkins。从简单的 CI 服务器到完整的 CD 集线器，Jenkins 都可以处理。

## CI/CD

CI (Continuous Integration，中文意思是持续集成) 是一种通过在应用开发阶段引入自动化来频繁向客户交付应用的方法。持续集成强调开发人员提交了新代码之后，立刻进行构建、（单元）测试。根据测试结果，我们可以确定新代码和原有代码能否正确地集成在一起。

![20230312141430](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312141430.png)

CD（Continuous Delivery， 中文意思持续交付）是在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境（类生产环境）中。如果代码没有问题，就可以继续手动部署到生产环境。下图描述了 CI/CD 的大概工作模式。

![20230312141526](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-12/20230312141526.png)

CI/CD 的核心概念是持续集成、持续交付和持续部署。作为一种面向开发和运维团队的解决方案，CI/CD 主要针对在集成新代码时所引发的问题（亦称“集成地狱”）。

具体而言，CI/CD 可让持续自动化和持续监控贯穿于应用的整个生命周期（从集成和测试阶段，到交付和部署）。这些关联的事务通常被统称为“CI/CD 管道”，由开发和运维团队以敏捷方式协同支持，采用的方法不是 DevOps 就是站点可靠性工程（SRE）。
