# 安装

:::tip 说明
Elasticsearch 是用 Java 编写的，但是呢，我们可以不用安装 JDK，因为 ES 里面自带了 JDK，当然我们也能把 ES 自带的 JDK 替换成我们自己的 JDK。参考 [Set up Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html)。
:::

## Docker 安装 ES

拉取镜像：
```sh
docker pull elasticsearch:7.17.9
```
创建挂载目录：
```sh
cd /mnt
mkdir -p elasticsearch/data && mkdir -p elasticsearch/config && mkdir -p elasticsearch/plugins && mkdir -p elasticsearch/logs
chmod -R 777 elasticsearch/
```
修改配置：
```sh
# 允许任何机器访问 ES
echo "http.host: 0.0.0.0" >> elasticsearch/config/elasticsearch.yml
```
启动 ES：
```sh
docker run --name es01 -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e ES_JAVA_OPTS="-Xms128m -Xmx256m" \
  -v /mnt/elasticsearch/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
  -v /mnt/elasticsearch/data:/usr/share/elasticsearch/data \
  -v /mnt/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
  -v /mnt/elasticsearch/logs:/usr/share/elasticsearch/logs \
  -d elasticsearch:7.17.9
```
开放 9200、9300 端口：
```sh
firewall-cmd --zone=public --add-port=9200/tcp --add-port=9300/tcp --permanent
firewall-cmd --reload
```

然后访问 `http://localhost:9200` 即可。

:::details 权限问题
启动 ES 可能会报如下错误：
```
Caused by: java.nio.file.AccessDeniedException: /usr/share/elasticsearch/data/nodes
```
解决办法如下：
```sh
# 把宿主机的挂载目录授权为 rwx
chmod -R 777 /mnt/elasticsearch

# 重启 ES 容器
docker restart es01
```
:::
:::details 无法访问 9200 端口
按理来说，经过上面的配置之后，应该是可以访问 9200 端口了。按照我以往的做法，在腾讯云的安全组添加了规则，并且服务器放开了 9200 端口，然后重新加载防火墙就行了，但是呢，这一次，我失败了。最终，参考了以下两篇博客来解决我的问题：  
[centos7 增加防火墙规则后，端口仍无法访问问](https://juejin.cn/post/6994345844635861023)  
[CentOS7, CentOS8 firewalld docker 端口映射问题，firewall开放端口后，还是不能访问，解决方案](https://blog.csdn.net/SB_YYGY_FHVK/article/details/103652125)

上面的第二种方式解决了我的问题，但是，我还是重启了防火墙才解决的：
```sh
systemctl restart firewalld
```
为什么我判断是端口不通呢？因为 docker 启动 ES 后，我查看了 ES 的日志，没有报错，并且直接在服务器上使用 `curl http://localhost:9200` 是能够访问的，使用 telnet 后，发现 9200 端口确实不通。
:::

## Docker 安装 Kibana

经过上面的步骤，完成了 ES 的安装，其实就已经能够操作 ES 了。ES 支持使用 http 的方式进行操作，所以用 Postman 也是一样的，只不过 Kibana 会有一些命令提示而已。Kibana 安装如下：
```sh
docker pull kibana:7.17.9
docker run --name kibana1 -e ELASTICSEARCH_HOSTS=http://xxx:9200 -p 5601:5601 -d kibana:7.17.9
```
开放 5601 端口：
```sh
firewall-cmd --zone=public --add-port=5601/tcp --permanent
firewall-cmd --reload
```
启动后，访问 `http://localhost:5601` 即可。

:::details Kibana 无法访问 ES
在上面的示例中，我添加了环境变量 `ELASTICSEARCH_HOSTS` 去运行 Kibana，当 Kibana 启动后，我尝试访问 `localhost:5601`，发现一直都提示 `Kibana server is not ready yet`。于是，我使用 `docker ps` 查看容器是否启动了，发现 Kibana 是启动的，然后使用 `docker logs kibana1` 查看日志，发现了如下信息：
```json
{"type":"log","@timestamp":"2023-04-05T08:43:15+00:00","tags":["error","elasticsearch-service"],"pid":7,"message":"Unable to retrieve version information from Elasticsearch nodes. Request timed out"}
```
从报错来看，好像是连不上 ES。咋回事儿呢，我是按照[官方文档](https://www.elastic.co/guide/en/kibana/current/docker.html)中的例子来启动的呀。并且，文档中已经说的很明白了 `These settings are defined in the default kibana.yml. They can be overridden with a custom kibana.yml or via environment variables.`。

进入 kibana1 这个容器看下：
```sh
docker exec -it kibana1 /bin/bash
pwd
cd config
cat kibana.yml
```
在 `kibana.yml` 中发现了如下内容：
```yaml
#
# ** THIS IS AN AUTO-GENERATED FILE **
#

# Default Kibana configuration for docker target
server.host: "0.0.0.0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://elasticsearch:9200" ]
```
好家伙，看来 `ELASTICSEARCH_HOSTS` 这个环境变量没生效。那就只能自己挂载 kibana 的配置文件了，操作如下。
```sh
mkdir -p /mnt/kibana
docker cp kibana1:/usr/share/kibana/config/ /mnt/kibana
docker stop kibana1
docker rm kibana1
```
修改配置文件：
```sh
vim /mnt/kibana/config/kibana.yml
```
```yml
server.host: "0.0.0.0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://我的公网IP:9200" ]
monitoring.ui.container.elasticsearch.enabled: true
```
启动 Kibana：
```sh
docker run -d --name kibana1 -p 5601:5601 -v /usr/local/myapp/data/kibana/config:/usr/share/kibana/config kibana:7.17.9
```
但是呢，启动之后还是无法访问。最终，我把 `elasticsearch.hosts` 修改成了 Docker 分配的 IP 地址，然后就可以了。如下：
```sh
# 查看 es 的 IP 地址
docker inspect es01 | grep -i ipaddr
```
```sh
vim /mnt/kibana/config/kibana.yml
```
```yml
# 修改 kibana.yml
elasticsearch.hosts: http://172.17.0.2:9200
```
```sh
# 重启 Kibana
docker restart kibana1
```
:::

当然，还有一种方式，可以使 ES 和 Kibana 处于同一个网卡，这样也能解决 Kibana 无法访问 ES 的问题。按照下面的方式来操作：

- 创建网络 `mynet1`

  ```sh
  docker network create \
    --driver=bridge \
    --subnet=172.28.0.0/16 \
    --gateway=172.28.5.254 \
    mynet1
  ```

- 创建 `kibana.yml`

  ```sh
  vim /usr/local/djfapp/data/kibana/kibana.yml

  # 添加以下内容（请换成自己服务器的 IP）
  server.name: kibana
  server.host: "0"
  elasticsearch.hosts: [ "http://1.15.181.57:9200" ]
  xpack.monitoring.ui.container.elasticsearch.enabled: true
  ```

- 使用自定义网络启动 ES

  ```sh
  docker run --name es01 -p 9200:9200 -p 9300:9300 \
    --net mynet1 \
    -e "discovery.type=single-node" \
    -e ES_JAVA_OPTS="-Xms64m -Xmx128m" \
    -v /usr/local/djfapp/data/elasticsearch/conf/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
    -v /usr/local/djfapp/data/elasticsearch/data:/usr/share/elasticsearch/data \
    -v /usr/local/djfapp/data/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
    -d elasticsearch:7.17.9
  ```
  
- 使用自定义网络启动 Kibana

  ```sh
  docker run --name kib01 --net mynet1 \
    -p 5601:5601 \
    -v /usr/local/djfapp/data/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml \
    -e "ELASTICSEARCH_HOSTS=http://1.15.181.57:9200" \
    -d kibana:7.17.9
  ```

:::tip 参考
[Run Kibana on Docker for development](https://www.elastic.co/guide/en/kibana/current/docker.html)
:::
