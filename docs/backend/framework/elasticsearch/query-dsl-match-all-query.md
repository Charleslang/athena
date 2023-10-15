# Match all query

:::tip 参考
[Match all query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-all-query.html#query-dsl-match-all-query)
:::

最简单的查询，匹配所有文档，并且所有文档的 `_score`  都是 1.0。

```json
GET /_search
{
    "query": {
        "match_all": {}
    }
}
```
`_score` 可以使用 `boost` 参数更改：

```json
GET /_search
{
  "query": {
    "match_all": { "boost" : 1.2 }
  }
}
```

## Match None Query

这是 `match_all` 查询的逆操作，它不匹配任何文档。

```json
GET /_search
{
  "query": {
    "match_none": {}
  }
}
```
