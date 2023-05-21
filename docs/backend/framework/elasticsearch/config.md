# 配置

## 密码

:::tip 参考
[Set up X-Packedit](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup-xpack.html)  

[Set up minimal security for Elasticsearchedit](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-minimal-setup.html)
:::

默认情况下，Elasticsearch 不需要密码就能进行访问。如果你的 ES 是部署在内网环境的，那么你可以不用设置密码。但是如果你的 ES 是部署在公网环境的，那么最好设置密码，否则你的 ES 将可能被攻击，数据可能被泄露甚至被破坏。

ES 提供了几种方式来设置密码，这里我们只介绍最简单的一种方式，即通过 ES 自带的 X-Pack 来设置密码。步骤如下：

1. 停止 ES 集群中的所有节点，同时，也需要停止 Kibana。
2. 在 ES 集群中的每个节点的 `elasticsearch.yml` 文件中，添加如下配置。

  ```yaml
  xpack.security.enabled: true
  # 如果 ES 是单节点, 那么需要加上下面这行配置
  discovery.type: single-node
  ```
3. 启动 ES 集群中的所有节点。然后，随便找一个节点，在 ES 安装目录下运行下面的命令。

  使用 `auto` 参数将随机生成的密码输出到控制台，您可以在以后根据需要更改这些密码：

  ```sh
  ./bin/elasticsearch-setup-passwords auto
  ```
  如果要使用自己的密码，请使用 `interactive` 参数而不是 `auto` 参数运行命令。使用此模式可引导您完成所有内置用户的密码配置。
  ```sh
  ./bin/elasticsearch-setup-passwords interactive
  ```

  如果一切顺利，那么你将看到下面的输出（以下用户都是 ES 内置的用户）：

  ![20230412230702](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-12/20230412230702.png)

  :::warning 警告
  您可以在集群中的任何节点运行 `elasticsearch-setup-passwords` 命令。但是，整个集群仅能执行一次该命令。   
  `elastic` 用户设置密码后，不能再次执行 `elasticsearch-setup-passwords` 命令。
  :::

4. 配置 `Kibana` 连接到 `Elasticsearch` 的密码

  - 在 `kibana.yml` 中添加如下配置：
  
    ```yml
    elasticsearch.username: "kibana_system"
    ```

  - 在 Kibana 安装目录下执行下面的命令：

    a. 生成 `kibana.keystore` 文件
    
    ```sh
    ./bin/kibana-keystore create
    ```
    b. 将 `kibana_system` 用户的密码添加到 Kibana 密钥库：

    ```sh
    ./bin/kibana-keystore add elasticsearch.password
    ```

  - 重启 Kibana。

经过上面的几个步骤，就可以使用用户 `elastic` 登录 ES 了。

在浏览器输入 `http://localhost:9200`，如果你看到下面的输出，那么恭喜你，你已经成功设置了 ES 的密码。

![20230412231532](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-12/20230412231532.png)

同时，我们访问 `http://localhost:5601`，如果你看到下面的输出，那么恭喜你，你已经成功设置了 `Kibana` 连接到 `Elasticsearch` 的密码。

![20230412232619](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-12/20230412232619.png)
