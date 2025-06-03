# 配置

```yml
spring:
  flyway:
    enabled: true
    locations: classpath:sql/
    table: APP_SCHEMA_HISTORY
    clean-disabled: true
    baseline-on-migrate: true
    baseline-version: 1
    validate-on-migrate: false
    placeholder-replacement: false
    url: jdbc:mysql:///mytest?useSSL=false&serverTimezone=Asia/Shanghai
    user: root
    password: 123456
    out-of-order: true
```

|属性|说明|
|---|---|
|enabled|是否启用 Flyway，默认为 true。启用之后，会走 Spring Boot 整合 Flyway 的逻辑，如果我们有自定义的迁移逻辑，可以设置成 false，然后手动调用 Flyway 的 migrate 方法进行迁移。|
|locations|SQL 脚本存放路径，默认为 `classpath:db/migration`。可以指定多个路径，使用英文逗号分隔。|
|table|Flyway 用于记录迁移历史的表名，默认为 `flyway_schema_history`（5.0.0+）、`schema_version`（5.0.0 之前）。|
|baseline-version|基线版本号，默认为 1。用于在迁移时设置数据库的初始版本，只有大于该版本的脚本才可能被执行。|
|group|是否把所有迁移脚本都放在同一个事务中执行。默认为 false，即每个脚本单独一个事务。|
|outOfOrder|是否允许脚本乱序执行，默认为 false。默认情况下，Flyway 只会执行大于迁移历史表中最大版本号的脚本。设置为 true 后，Flyway 会执行所有尚未被执行的脚本，无论其版本号如何。|
|sqlMigrationPrefix|SQL 脚本文件前缀，默认为 `V`。只有以该前缀开头的脚本才会被执行。|
|sqlMigrationSuffixes|SQL 脚本文件后缀，默认为 `.sql`。只有以该后缀结尾的脚本才会被执行。可以指定多个后缀，使用英文逗号分隔。|
|sqlMigrationSeparator|SQL 脚本文件名中的版本号和描述之间的分隔符，默认为 `__`。例如 `V1.2.3.4__Initial_setup.sql`，其中 `1.2.3.4` 是版本号，`Initial_setup` 是描述。|
|url|数据库连接 URL，用于 Flyway 创建并访问迁移历史表。|
|user|数据库用户名。|
|password|数据库密码。|
