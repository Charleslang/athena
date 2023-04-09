# 分词

:::tip 参考
[Text analysis](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analysis.html)
:::

Text analysis（分词）是将非结构化文本（如电子邮件正文或产品描述）转换为优化的结构化格式的过程。Text analysis 使 Elasticsearch 能够执行全文搜索，搜索返回所有相关结果，而不仅仅是精确匹配。

**什么时候会进行分词？** 

Elasticsearch 在索引（插入）或搜索时，会对 `text` 类型的字段执行 text analysis。

例如，我们有一个 `text` 类型的字段 `message`，它的值为 `This is a test`，那么存储在 `message` 字段时，Elasticsearch 会将其分词为 `This`、`is`、`a`、`test`。当我们搜索 `message` 字段时，例如，搜索的值是 `a test`，Elasticsearch 会将搜索词 `a test` 分词为 `a`、`test`，然后搜索 `message` 字段中包含 `a`、`test` 的文档。

**Tokenization**  

Tokenization（分词）是将文本分解为更小的块，这些“小块”称为 tokens（标记）。在大多数情况下，这些 tokens 是单独的单词或短语。例如，`This is a test` 会被分词为 `This`、`is`、`a`、`test`。


**Normalization**  

Normalization（标准化）是将 tokens 转换为统一的格式，以便在搜索时更容易匹配。例如，`This`、`this`、`THIS` 会被标准化为 `this`。

Tokenization 允许在单个词语（token）上进行匹配，但每个 token 仍然按字面匹配。这意味着：

- `This` 不会匹配 `this`，因为它们是不同的 token。
- 尽管 `fox` 和 `foxes` 有相同的词根，但是搜索 `foxes` 却不能匹配到 `fox`，反之亦然。
- `jump` 不会匹配 `leap`。虽然它们没有相同的词根，但它们是同义词，意思相似。

为了解决这些问题，text analysis 可以将这些 tokens 规范化为标准格式。这允许匹配与搜索词不完全相同，但足够相似且仍然相关的 token。例如:

- `This` 可以小写：`this`。
- `foxes` 可以被词干化，或减少到它的词根：`fox`。
- `jump` 和 `leap` 是同义词，可以被索引为一个词：`jump`。

**Customize text analysis**

Text analysis 由 [analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analyzer-anatomy.html)（分词器）执行，分词器是一组管理整个过程的规则。

Elasticsearch 包含一个默认分词器，称为[standard analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analysis-standard-analyzer.html)（标准分词器），它开箱即用，适用于大多数用例。

但是，如果默认分析器不适合您的用例，你可以选择一个不同的[built-in analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analysis-analyzers.html)（内置分词器），甚至配置一个[自定义分词器](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analysis-custom-analyzer.html)。自定义分析器让您控制分析过程的每一步，包括：

- 在 tokenization 之前对文本进行更改
- 如何将文本转换为 tokens
- 在索引或搜索之前对 tokens 进行的标准化（Normalization）更改


## 基本用法

:::details POST _analyze
**body：**
```json
{
  "analyzer": "standard",
  "text": "have a nice day!"
}
```
**Response：**
```json
{
  "tokens" : [
    {
      "token" : "have",
      "start_offset" : 0,
      "end_offset" : 4,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "a",
      "start_offset" : 5,
      "end_offset" : 6,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "nice",
      "start_offset" : 7,
      "end_offset" : 11,
      "type" : "<ALPHANUM>",
      "position" : 2
    },
    {
      "token" : "day",
      "start_offset" : 12,
      "end_offset" : 15,
      "type" : "<ALPHANUM>",
      "position" : 3
    }
  ]
}
```
:::

:::details POST _analyze
**body：**
```json
{
  "analyzer": "standard",
  "text": "我是中国人"
}
```
**Response：**
```json
{
  "tokens" : [
    {
      "token" : "我",
      "start_offset" : 0,
      "end_offset" : 1,
      "type" : "<IDEOGRAPHIC>",
      "position" : 0
    },
    {
      "token" : "是",
      "start_offset" : 1,
      "end_offset" : 2,
      "type" : "<IDEOGRAPHIC>",
      "position" : 1
    },
    {
      "token" : "中",
      "start_offset" : 2,
      "end_offset" : 3,
      "type" : "<IDEOGRAPHIC>",
      "position" : 2
    },
    {
      "token" : "国",
      "start_offset" : 3,
      "end_offset" : 4,
      "type" : "<IDEOGRAPHIC>",
      "position" : 3
    },
    {
      "token" : "人",
      "start_offset" : 4,
      "end_offset" : 5,
      "type" : "<IDEOGRAPHIC>",
      "position" : 4
    }
  ]
}
```
:::

通过上面的例子，我们可以看到，标准分词器会将中文分词为单个字，这并不符合我们的预期，而且 ES 自带的分词器都只能处理英文。所以，如果想要对中文进行分词，我们需要自定义分词器。

## 自定义分词器

### IK 分词器

:::tip 参考
IK 分词器是一个开源的中文分词器，它支持最新的 Lucene 语法，可以很好的支持中文分词。[elasticsearch-analysis-ik](https://github.com/medcl/elasticsearch-analysis-ik) 是 IK 分词器的 ES 插件，它可以很方便的安装到 ES 中。并且它的版本和 ES 版本是一致的，所以不用担心版本不兼容的问题。
:::

**1. 下载与 ES 对应的 IK 分词器**

:::warning 注意
尽量下载和 ES 版本一致的 IK 分词器，否则可能会出现版本不兼容的问题。
:::

![20230409160348](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-04-09/20230409160348.png)

**2. 将下载的 IK 分词器解压到 ES 的 plugins 目录下**

```sh
cd /usr/local/myapp/data/elasticsearch/plugins
mkdir ik
unzip elasticsearch-analysis-ik-7.13.4.zip -d ik
```

**3. 检查容器内是否存在 IK 分词器**

```sh
docker exec -it es01 /bin/bash
cd /usr/share/elasticsearch/plugins/ik

# 或者在容器内执行下面的命令，如果出现 ik 目录，则说明安装成功
cd /usr/share/elasticsearch/bin
./elasticsearch-plugin list
```

**4. 重启 ES 容器**

```sh
docker restart es01
```

:::details ES 版本和 IK 分词器版本一致的问题
在上面，我安装的 IK 分词器是 7.17.6，而我的 ES 是 7.17.9。当重启 ES 时，发现 ES 启动失败了，通过 `docker logs es01` 查看日志，发现是因为版本不兼容导致的。解决办法如下：
```sh
cd /usr/local/myapp/data/elasticsearch/plugins/ik
vim plugin-descriptor.properties
```
将 `elsaticsearch.version` 的值改为 7.17.9，然后重启 ES 容器即可。

见 issue：[不支持7.17.8版本](https://github.com/medcl/elasticsearch-analysis-ik/issues/996)
:::

:::warning 注意
如果你的 ES 是集群模式，那么需要重启所有的 ES 节点。
:::

**5. 验证 IK 分词器是否安装成功**

:::details POST _analyze
**body：**
```json
{
  "analyzer": "ik_max_word",
  "text": "我是中国人"
}
```
**Response：**
```json
{
  "tokens": [
    {
      "token": "我",
      "start_offset": 0,
      "end_offset": 1,
      "type": "CN_CHAR",
      "position": 0
    },
    {
      "token": "是",
      "start_offset": 1,
      "end_offset": 2,
      "type": "CN_CHAR",
      "position": 1
    },
    {
      "token": "中国人",
      "start_offset": 2,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 2
    },
    {
      "token": "中国",
      "start_offset": 2,
      "end_offset": 4,
      "type": "CN_WORD",
      "position": 3
    },
    {
      "token": "国人",
      "start_offset": 3,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 4
    }
  ]
}
```
:::

:::details POST _analyze
**body：**
```json
{
  "analyzer": "ik_smart",
  "text": "我是中国人"
}
```
**Response：**
```json
{
  "tokens": [
    {
      "token": "我",
      "start_offset": 0,
      "end_offset": 1,
      "type": "CN_CHAR",
      "position": 0
    },
    {
      "token": "是",
      "start_offset": 1,
      "end_offset": 2,
      "type": "CN_CHAR",
      "position": 1
    },
    {
      "token": "中国人",
      "start_offset": 2,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 2
    }
  ]
}
```
:::

#### 自定义词库

为什么需要自定义词库呢？看看下面的例子就知道了。

:::details POST _analyze
**body：**
```json
{
  "analyzer": "ik_smart",
  "text": "代俊峰真帅"
}
```
**Response：**
```json
{
  "tokens": [
    {
      "token": "代",
      "start_offset": 0,
      "end_offset": 1,
      "type": "CN_CHAR",
      "position": 0
    },
    {
      "token": "俊",
      "start_offset": 1,
      "end_offset": 2,
      "type": "CN_CHAR",
      "position": 1
    },
    {
      "token": "峰",
      "start_offset": 2,
      "end_offset": 3,
      "type": "CN_CHAR",
      "position": 2
    },
    {
      "token": "真",
      "start_offset": 3,
      "end_offset": 4,
      "type": "CN_CHAR",
      "position": 3
    },
    {
      "token": "帅",
      "start_offset": 4,
      "end_offset": 5,
      "type": "CN_CHAR",
      "position": 4
    }
  ]
}
```
:::
通过上面这个例子，我们发现，IK 分词器将“代俊峰”分成了三个词。这是因为 IK 分词器默认的词库中没有“代俊峰”这个词，所以将其分成了三个词。可以通过下面的步骤来自定义词库。

**1. 创建自定义词库**

```sh
docker exec -it nginx /bin/bash
cd /usr/share/nginx/html && mkdir -p es/analyzer && cd es/analyzer
vim dict.txt
```
**2. 在 dict.txt 中添加词语**

```txt
代俊峰
真帅
```

**3. Nginx 配置**

```nginx
location /es/analyzer {
  root html;
}
```

**4. 重启 Nginx**

```sh
docker restart nginx
```

**5. 修改 IK 分词器配置**

```sh
cd /usr/local/myapp/data/elasticsearch/plugins/ik/config
# 查看 Nginx 容器的 IP
docker inspect nginx | grep IPAddress
vim ./IKAnalyzer.cfg.xml
```
```xml
<!-- IKAnalyzer.cfg.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <comment>IK Analyzer 扩展配置</comment>
    <!--用户可以在这里配置自己的扩展字典 -->
    <entry key="ext_dict"></entry>
     <!--用户可以在这里配置自己的扩展停止词字典-->
    <entry key="ext_stopwords"></entry>
    <!--用户可以在这里配置远程扩展字典 -->
    <entry key="remote_ext_dict">http://172.17.0.3/es/analyzer/dict.txt</entry>
    <!--用户可以在这里配置远程扩展停止词字典-->
    <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

**6. 重启 ES**

```sh
docker restart es01
```

**7. 验证自定义词库是否生效**

:::details POST _analyze
**body：**
```json
{
  "analyzer": "ik_smart",
  "text": "代俊峰真帅"
}
```
**Response：**
```json
{
  "tokens": [
    {
      "token": "代俊峰",
      "start_offset": 0,
      "end_offset": 3,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "真帅",
      "start_offset": 3,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 1
    }
  ]
}
```
:::
:::details POST _analyze
**body：**
```json
{
  "analyzer": "ik_max_word",
  "text": "代俊峰真帅"
}
```
**Response：**
```json
{
  "tokens": [
    {
      "token": "代俊峰",
      "start_offset": 0,
      "end_offset": 3,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "真帅",
      "start_offset": 3,
      "end_offset": 5,
      "type": "CN_WORD",
      "position": 1
    }
  ]
}
```
:::
