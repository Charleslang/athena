# 创建 Maven 工程

## 普通 Java 工程

![20240210110156](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210110156.png)

## Web 工程

![20240210110433](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210110433.png)

## Java 转 Web 工程

1. 修改 `pom.xml` 文件，添加 `war` 打包类型。

    ```xml
    <packaging>war</packaging>
    ```

    改成 war 后，我们查看 Project Structure，发现多了一个 `web` 目录。

    ![20240210110813](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210110813.png)

    仔细观察一下，会发现有个地方在报错：

    ![20240210110916](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210110916.png)

    显然，这个报错是正常的，因为我们在 `src/main` 下面压根儿没有 `webapp` 目录。这个先不用管，我们直接执行步骤 2，步骤 2 执行完成后，IDEA 会自动帮我们创建 `webapp` 目录。

2. 添加 `web.xml` 文件。

    ![20240210111131](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210111131.png)

    添加 `web.xml` 文件时，需要注意文件路径，`web.xml` 文件的路径是 `src/main/webapp/WEB-INF/web.xml`，这里的路径要和步骤 1 的报错路径一致。

    ![20240210111319](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210111319.png)

经过上面两个步骤，我们的 Java 工程就转成了 Web 工程。如下：

![20240210111633](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2024-02-10/20240210111633.png)
