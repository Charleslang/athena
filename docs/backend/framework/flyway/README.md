# 简介

[Flyway](https://github.com/flyway/flyway) 是一个数据库脚本管理工具，能够对数据库更改进行版本控制，并安全轻松地实现数据库部署的自动化。它可以扫描应用程序的文件系统或类路径以查找待迁移的数据库脚本，这些数据库脚本可以用 SQL、Java 或其他脚本语言编写。

它的工作原理是通过维护一个版本表来跟踪数据库的当前状态，每次执行新的迁移脚本后，Flyway 都会在表中记录该脚本的版本号和执行时间，从而确保数据库始终处于最新状态。对于扫描到的脚本，Flyway 会根据版本号进行升序排序，并按顺序执行这些脚本。默认情况下，Flyway 只会执行大于版本表中最大版本号的脚本。

本文基于 Flyway <span style="background:#3eaf7c; color:#fff; padding: 2px 5px; border-radius: 3px;letter-spacing: 1px;font-size:12px">5.2.4</span> 版本编写，介绍了 Flyway 的基本用法和配置方法。
