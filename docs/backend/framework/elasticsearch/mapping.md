# 映射

:::tip 参考
[Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping.html)
:::

映射是定义文档及其包含的字段如何存储和索引的过程。映射定义了字段的名称、类型、是否存储、是否索引等信息。映射是可选的，但是如果不定义映射，Elasticsearch 将使用默认的映射。

每个文档都是字段的集合，每个字段都有自己的数据类型。在映射数据时，您将创建一个映射定义，其中包含与文档相关的字段列表。Mapping 还可以包括元数据字段，如 `_source` 字段，它自定义如何处理文档的关联元数据。

可以使用动态 mapping 和显式 mapping 来定义数据。这两种方式有不同的好处。如果我们没有为某个索引显示创建 mapping，那么当我们第一次向该索引中添加文档时，Elasticsearch 将自动创建一个 mapping。这种方式称为动态 mapping。动态 mapping 有一些缺点，因为它不允许我们控制字段的类型，也不允许我们控制字段的索引方式。因此，我们通常会使用显式 mapping 来定义数据。

:::warning 注意
在 Elasticserch 7.0.0 之前，创建 mapping 时，需要包含一个 type。在 7.0.0 之后，type 已经被废弃，在 8.0 中，type 将被删除，因此在创建 mapping 时，不需要包含 type。见 [Removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/removal-of-types.html)。

ES 7 中，每个索引下都有一个默认的 type，名叫 `_doc`。
:::

在索引中定义太多字段可能导致 mapping 爆炸，这可能导致内存不足错误和难以恢复的情况。考虑这样一种情况，每个插入的新文档都会引入新字段，例如使用动态映射。每个新字段都被添加到索引映射中，随着映射的增长，这可能成为一个问题。使用 [`mapping limit settings`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-settings-limit.html) 来限制字段映射（手动或动态创建）的数量，并防止文档导致映射激增。

## 查看映射

可以使用 `GET /<index>/_mapping` API 来查看索引下的所有映射。如果只想查看一个或多个特定字段的映射，可以使用 [get field mapping](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/indices-get-field-mapping.html) API。
```json
// 查看 account 索引下，balance 字段的映射
// GET /account/_mapping/field/balance
```

## 创建映射

:::tip 参考
字段类型可参考 [Field data types](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-types.html)
:::

```json
// PUT /my-index-000001
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      },
      "username": {
        "type": "keyword"
      },
      "message": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "createTime": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "email": {
        "type": "keyword",
        "index": false // 不参与检索，默认为 true，一般用于一些冗余的数据或敏感数据
      }
    }
  }
}
```

## 新增字段映射

您可以使用 []`update mapping`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/indices-put-mapping.html) API向现有索引添加一个或多个新字段。

```json
// PUT /my-index-000001/_mapping
{
  "properties": {
    "modifyTime": {
      "type": "date",
      "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
    }
  }
}
```

## 更新字段映射

除了受支持的[映射参数](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/mapping-params.html)外，您不能更改现有字段的映射或字段类型。更改现有字段可能会使已经建立索引的数据无效。

如果需要更改数据流支持索引中字段的映射，请参见 [Change mappings and settings for a data stream](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/data-streams-change-mappings-and-settings.html)。

如果需要更改其他索引中某个字段的映射，需要使用正确的 mapping 创建一个新索引，并将数据[reindex](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/docs-reindex.html)到新索引中。

重命名字段将使已在旧字段名下建立索引的数据失效。相反，添加别名字段 [alias](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/field-alias.html)以创建备用字段名。

## reindex

:::tip 参考
[Reindex API](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/docs-reindex.html)
:::

**旧的 mapping：**
```json
// PUT /my-old-index
{
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      },
      "username": {
        "type": "keyword"
      },
      "message": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```
**新的 mapping：**
```json
// PUT /my-new-index
{
  "mappings": {
    "properties": {
      "age": {
        "type": "long"
      },
      "username": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "message": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```
**重索引：**
```json
// POST _reindex
{
  "source": {
    "index": "my-old-index"
  },
  "dest": {
    "index": "my-new-index"
  }
}
```
如果你之前的索引有类型，那么，在重索引时，需要使用下面的语法：
```json
// POST _reindex
{
  "source": {
    "index": "my-old-index",
    "type": "my-old-type"
  },
  "dest": {
    "index": "my-new-index",
    "type": "_doc" // "_doc" 是新索引的默认类型，此处可以省略 "type": "_doc"
  }
}
```

