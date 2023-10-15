# Query and filter context

:::tip 参考
[Query and filter context](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-filter-context.html)。
:::

## 相关性得分

Relevance scores 即为相关性得分。

默认情况下，Elasticsearch 按相关性得分对匹配的搜索结果进行排序，相关性得分用于衡量每个文档与查询的匹配程度。

相关性分数是一个正浮点数，在 [search](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-request-body.html) API 的 `_score` 元数据字段中返回。`_score` 越高，文档越相关。虽然每种查询类型可以以不同的方式计算相关性分数，但分数计算还取决于查询子句是在 Query context（查询上下文）中运行还是在 Filter context（过滤器上下文）中运行。

## 查询上下文

Query context 即为查询上下文。

在查询上下文中，查询子句回答“此文档与此查询子句的匹配程度如何？”的问题。除了确定文档是否匹配之外，查询子句还会计算 `_score` 元数据字段中的相关性分数。

每当查询子句传递给查询参数（例如 [search](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-search.html#request-body-search-query) API 中的 `query` 参数）时，查询上下文就会生效。

## 过滤上下文

Filter context 即为过滤上下文。

在过滤器上下文中，查询子句回答“此文档与此查询子句匹配吗？”的问题。答案是简单的“是”或“否”——“不计算分数”。过滤器上下文主要用于过滤结构化数据，例如“该时间戳是否在 2015 年至 2016 年范围内？”、“`status` 字段是否设置为 `published`？”。

Elasticsearch 将自动缓存常用的过滤器，以提高性能。

每当查询子句传递给过滤器参数（例如 [`bool`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-bool-query.html) 查询中的 `filter` 或 `must_not` 参数、[`constant_score`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-constant-score-query.html) 查询中的 `filter` 参数、或 [`filter`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-aggregations-bucket-filter-aggregation.html) 聚合）时，过滤器上下文就会生效。

## Example of query and filter contexts

以下是在 `search` API 的查询和过滤上下文中使用查询子句的示例。此查询将匹配满足以下所有条件的文档：

- `title` 字段包含单词 `search`
- `content` 字段包含单词 `elasticsearch`
- `status` 字段包含确切的单词 `published`
- `publish_date` 字段包含从 2015 年 1 月 1 日起的日期

```json
GET /_search
{
  "query": { // 1
    "bool": { // 2
      "must": [
        { "match": { "title":   "Search"        }},
        { "match": { "content": "Elasticsearch" }}
      ],
      "filter": [ // 3
        { "term":  { "status": "published" }},
        { "range": { "publish_date": { "gte": "2015-01-01" }}}
      ]
    }
  }
}
```
1：`query` 参数表示查询上下文。  
2：`bool` 和两个 `match` 子句在查询上下文中使用，这意味着它们用于对每个文档的匹配程度进行评分。  
3：`filter` 参数表示过滤上下文。它的 `term` 和 `range` 子句用于过滤上下文中。它们会过滤掉不匹配的文档，但不会影响匹配文档的分数。

:::warning
查询上下文中的查询中，计算的分数表示为单精度浮点数，它们只有 24 位的有效位数精度。超过有效数精度的分数将转换为浮点数，但会损失精度。
:::

:::tip
如果你的查询条件需要影响匹配文档的分数，请把查询子句放在查询上下文中。否则，把查询子句放在滤上下文中。参考 [ElasticSearch查询 第五篇：布尔查询](https://www.cnblogs.com/ljhdo/p/5040252.html)
:::

