# 快速开始

以下基于 Spring Boot 整合 Flyway 进行说明。

1. **添加依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
    <version>5.2.4</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. **配置**

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql:///mytest?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
  flyway:
    enabled: true
    # sql 文件存放路径
    locations: classpath:sql/
    table: APP_SCHEMA_HISTORY
    out-of-order: true
    clean-disabled: true
    baseline-on-migrate: true
    baseline-version: 1
    validate-on-migrate: false
    placeholder-replacement: false
    url: jdbc:mysql:///mytest?useSSL=false&serverTimezone=Asia/Shanghai
    user: root
    password: 123456
```

3. **SQL 文件**

- `classpath:sql/V1_2024/V1_202412/V1.20241203.01__MY_APP.sql`

```sql
-- 需要把 SQL 文件放在 `src/main/resources/sql/**` 目录下
create table tb_user (
    id int not null,
    user_name varchar(50),
    age int,
    primary key (id)
);

insert into tb_user(id, user_name, age) values (1, 'zs', 13);
```

- `classpath:sql/V1_2024/V1_202412/V1.20241203.02__MY_APP.sql`

```sql
insert into tb_user(id, user_name, age) values (2, 'ww', 15);
```

- `classpath:sql/V1_2025/V1_202501/V1.20250101.01__MY_APP.sql`

```sql
alter table tb_user add column email varchar(50);

insert into tb_user(id, user_name, age, email) values (3, 'zl', 16, 'daijunfeng.me@qq.com');
```

做完上面的操作之后，启动应用。Flyway 会自动执行 SQL 文件中的脚本，并在数据库中创建 `MY_SCHEMA_HISTORY` 表来记录迁移历史。
