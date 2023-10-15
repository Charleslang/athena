# Compound queries

:::tip 参考
复合查询 [Compound queries](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/compound-queries.html#compound-queries)
:::

复合查询包装其它复合查询或叶查询，以组合它们的结果和分数，改变它们的行为，或者从查询上下文切换到过滤上下文。

复合查询中可以包括以下查询：

- [`bool`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-bool-query.html) query

  复合查询中的的默认查询，用于组合多个叶或复合查询子句，如 `must`、`should`、`must_not` 或 `filter` 子句。`must` 和 `should` 子句的得分相加 ——“匹配的子句越多越好”，而 `must_not` 和 `filter` 子句在过滤上下文中执行。

- [`boosting`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-boosting-query.html) query

  返回与 `positive` query（正查询）匹配的文档，但降低也与 `negative` query（负查询）匹配的文档的分数。

- [`constant_score`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-constant-score-query.html) query 

  包装另一个查询的查询，但在过滤上下文中执行它。所有匹配的文档都被赋予相同的“常量” `_score`。

- [`dis_max`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-dis-max-query.html) query 

  接受多个查询并返回与任何查询子句匹配的任何文档的查询。`bool` 查询组合了所有匹配查询的分数，而 `dis_max` 查询则使用单个最佳匹配查询子句的分数。

- [`function-score`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html) query

  使用函数修改主查询返回的分数，以考虑流行度、新近度、距离或通过脚本实现的自定义算法等因素。

## Boolean query

:::tip 参考
[Boolean query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-bool-query.html)
:::

与其他查询的布尔组合相匹配的文档的查询。bool 查询映射到 Lucene BooleanQuery。它是使用一个或多个布尔子句构建的，每个子句都有一个类型化的出现。可以在 bool 查询中使用的查询子句有：

类型|描述
---|---
`must`|子句（查询条件）必须出现在匹配的文档中，并计算相关性得分。
`filter`|子句（查询条件）必须出现在匹配的文档中。然而，与 `must` 不同的是，查询的分数将被忽略。filter 子句在过滤上下文中执行，这意味着忽略评分并考虑对子句进行缓存。
`should`|子句（查询条件）应出现在匹配的文档中。
`must_not`|子句（查询条件）不得出现在匹配文档中。子句在过滤上下文中执行，这意味着忽略评分并考虑对子句进行缓存。由于评分被忽略，因此所有文档的分数都返回 0。

`bool` 查询采用“匹配越多越好”的方法，因此每个匹配的 `must` 或 `should` 子句的分数将相加，来作为每个文档的最终 `_score`。

```json
POST _search
{
  "query": {
    "bool" : {
      "must" : {
        "term" : { "user.id" : "kimchy" }
      },
      "filter": {
        "term" : { "tags" : "production" }
      },
      "must_not" : {
        "range" : {
          "age" : { "gte" : 10, "lte" : 20 }
        }
      },
      "should" : [
        { "term" : { "tags" : "env1" } },
        { "term" : { "tags" : "deployed" } }
      ],
      "minimum_should_match" : 1,
      "boost" : 1.0
    }
  }
}
```

**Using `minimum_should_match`**  

可以使用 `minimum_should_match` 参数来指定 `should` 子句返回的文档必须匹配 `should` 条件的数量或百分比。

如果 `bool` 查询至少包含一个 `should` 子句且没有 `must` 或 `filter` 子句，则 `minimum_should_match` 的默认值为 1。否则，默认值为 0。

对于其他有效值，请参阅 [minimum_should_match](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-minimum-should-match.html) 参数。

**Scoring with `bool.filter`**

在 `filter` 参数中指定的查询对评分没有影响 — 分数返回为 0。分数仅受指定查询的影响。例如，以下所有三个查询都会返回 `status` 字段包 "active" 的所有文档。第一个查询为所有文档分配 0 分，因为未指定评分查询：

```json
GET _search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "status": "active"
        }
      }
    }
  }
}
```

此 bool 查询有一个 `match_all` 查询，它为所有文档分配 1.0 的分数。

```json
GET _search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "term": {
          "status": "active"
        }
      }
    }
  }
}
```
此 `constant_score` 查询的行为与上面第二个示例完全相同。`constant_score` 查询为过滤器匹配的所有文档分配 1.0 的分数。

```json
GET _search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "status": "active"
        }
      }
    }
  }
}
```
**Named queries**  

Named queries 即为具名、命名查询。每个查询在其顶级定义中接受一个 `_name` 参数。您可以使用命名查询来跟踪哪些查询与返回的文档匹配。如果使用命名查询，响应将包含每个命中的 `matched_queries` 属性。

```json
GET /_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "name.first": { "query": "shay", "_name": "first" } } },
        { "match": { "name.last": { "query": "banon", "_name": "last" } } }
      ],
      "filter": {
        "terms": {
          "name.last": [ "banon", "kimchy" ],
          "_name": "test"
        }
      }
    }
  }
}
```

## Boosting query

:::tip 参考
增强查询 [Boosting query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-boosting-query.html)
:::

返回与 `positive` query（肯定查询）匹配的文档，同时降低也与 `negative` query（否定查询）匹配的文档的相关性得分。

您可以使用 boosting 查询来降低某些文档的分数，而不将它们从搜索结果中排除。

```json
GET /_search
{
  "query": {
    "boosting": {
      "positive": {
        "term": {
          "text": "apple"
        }
      },
      "negative": {
        "term": {
          "text": "pie tart fruit crumble tree"
        }
      },
      "negative_boost": 0.5
    }
  }
}
```

**Top-level parameters for boosting**  

用于 boosting 的顶级参数有如下几个：

- `positive`

  （必填，查询对象）您希望运行的查询。任何返回的文档都必须与此查询匹配。简单来讲，就是“必须匹配”的条件。

- `negative`

  （必填，查询对象）用于降低文档的相关性得分的查询。

  如果返回的文档与 positive query 和此查询匹配，则 boosting query 将计算文档的最终相关性得分，如下所示：

  1. 从 positive query 中获取原始相关性得分。  
  2. 将分数乘以 `negative_boost` 值。  

- `negative_boost`  

  （必填，浮点数）0 到 1.0 之间的浮点数，用于降低与 negative query 匹配的文档的相关性得分。

## Constant score query

Constant score query 即为恒定分数查询。包装 [filter query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-bool-query.html) 并返回相关性分数等于 `boost` 参数值的每个匹配文档。

```json
GET /_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": { "user.id": "kimchy" }
      },
      "boost": 1.2
    }
  }
}
```

**Top-level parameters for `constant_score`**  

用于 `constant_score` 的顶级参数有如下几个：

- `filter`  

  （必填，查询对象）您希望运行的 filter 查询。任何返回的文档都必须与此查询匹配。fitler 查询不计算相关性分数。为了提高性能，Elasticsearch 自动缓存常用的过滤器查询。

- `boost`

  （可选，浮点数）浮点数，用作与 filter 查询匹配的每个文档的恒定相关性得分。默认为 1.0。

## Disjunction max query

Disjunction max query 即为 `dis_max` query。

返回与一个或多个包装查询匹配的文档，称为查询子句或子句。

如果返回的文档与多个查询子句匹配，则 dis_max 查询会为该文档分配任何匹配子句中的最高相关性分数，并为匹配了多个查询的文档分配得分增量 `tie_breaker`。也就是说，只取分数最高的那个 query 的分数而已，完全不考虑其他 query 的分数，如果文档匹配了不止一个 query，那么就会借助 `tie_breaker` 来计算最终实际的分数。

您可以使用 `dis_max` 在使用不同提升因子映射的字段中搜索。

```json
GET /_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "term": { "title": "Quick pets" } },
        { "term": { "body": "Quick pets" } }
      ],
      "tie_breaker": 0.7
    }
  }
}
```

**Top-level parameters for dis_max**  

- `queries`

  （必需，查询对象数组）包含一个或多个查询子句。返回的文档必须与这些查询中的一个或多个匹配。如果文档与多个查询匹配，Elasticsearch 将使用所有查询中最高的相关性得分。

- `tie_breaker`

  （可选，float）0 到 1.0 之间的浮点数，用于增加匹配了多个查询子句的文档的相关性分数。默认为 0.0。

  您可以使用 `tie_breaker` 为文档分配更高的相关性分数。

  如果文档匹配多个子句，则 dis_max 查询将计算文档的相关性得分，如下所示：

  1. 从得分最高的匹配子句中获取相关性得分。  
  2. 将任何其他匹配子句的分数乘以 `tie_breaker`。  
  3. 将步骤 1、2 的分数相加。

  如果 `tie_breaker` 值大于 0.0，则所有匹配子句都会计数，但分数最高的子句计数最多。

## Function score query

:::tip 参考
[Function score query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#query-dsl-function-score-query)
:::

`function_score` 允许您修改查询检索的文档的分数。例如，如果评分函数的计算成本很高，并且足以计算经过过滤的文档集的评分，则这可能很有用。

要使用 `function_score`，用户必须定义​​一个查询和一个或多个函数，用于为查询返回的每个文档计算新分数。

`function_score` 只能与一个函数一起使用，如下所示：

```json
GET /_search
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "boost": "5",
      "random_score": {}, 
      "boost_mode": "multiply"
    }
  }
}
```
:::tip
有关受支持函数的列表，请参考 [Function score](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#score-functions)。
:::

此外，可以组合多种功能。在这种情况下，我们可以选择仅当文档与给定的过滤查询匹配时才应用该函数

```json
GET /_search
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "boost": "5", // 1
      "functions": [
        {
          "filter": { "match": { "test": "bar" } },
          "random_score": {}, // 2
          "weight": 23
        },
        {
          "filter": { "match": { "test": "cat" } },
          "weight": 42
        }
      ],
      "max_boost": 42,
      "score_mode": "max",
      "boost_mode": "multiply",
      "min_score": 42
    }
  }
}
```
1: 提升整个查询。  
2: 有关受支持函数的列表，请参阅 [Function score](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#score-functions)。

:::tip 
每个函数的过滤查询产生的分数并不重要。
:::

如果函数没有给出过滤器，则相当于指定 `"match_all"：{}`。

首先，根据定义的函数对每个文档进行评分。参数 `score_mode` 指定如何组合计算的分数：

组合方式|描述
---|---
`multiply`|将原始查询的分数乘以函数的分数。这是默认值。
`sum`|将原始查询的分数与函数的分数相加。
`avg`|将原始查询的分数与函数的分数相加，然后除以 2。
`first`|返回原始查询的分数，但仅在函数的分数大于 0 时。
`max`|原始查询的分数和函数的分数之间的最大值。
`min`|原始查询的分数和函数的分数之间的最小值。

因为分数可以采用不同的计算方式（例如，对于衰减函数，分数可以在 0 到 1 之间，但对于 `field_value_factor` 可以是任意的），而且由于有时需要函数对分数产生不同的影响，因此可以使用用户定义的权重来调整每个函数的分数。可以在 `functions` 数组中为每个函数定义权重 `weight`（上面的示例），并乘以相应函数计算的分数。如果给出权重没有任何其他函数声明，则权重充当仅返回权重的函数。

如果 `score_mode` 设置为 `avg`，则各个分数将按加权平均值合并。例如，如果两个函数返回分数 1 和 2，并且它们各自的权重分别为 3 和 4，那么它们的分数将组合为 `(1*3+2*4)/(3+4)`，而不是 `(1*3+2 *4)/2`。

可以通过设置 `max_boost` 参数来限制新分数不超过一定的限制。`max_boost` 的默认值是 FLT_MAX。

新计算的分数与查询的分数相结合。参数 `boost_mode` 定义如下：

组合方式|描述
---|---
`multiply`|将原始查询的分数乘以函数的分数。这是默认值。
`replace`|将原始查询的分数替换为函数的分数。
`sum`|将原始查询的分数与函数的分数相加。
`avg`|将原始查询的分数与函数的分数相加，然后除以 2。
`max`|原始查询的分数和函数的分数之间的最大值。
`min`|原始查询的分数和函数的分数之间的最小值。

默认情况下，修改分数不会更改匹配的文档。要排除不满足特定分数阈值的文档，可以将 `min_score` 参数设置为所需的分数阈值。

:::warning 注意
要使 `min_score` 发挥作用，需要对查询返回的所有文档进行评分，然后一一过滤掉。
:::

`function_score` 查询提供了多种类型的评分函数：

- [script_score](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#function-script-score)
- [weight](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#function-weight)
- [random_score](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#function-random)
- [field_value_factor](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#function-field-value-factor)
- [decay functions: gauss, linear, exp](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-function-score-query.html#function-decay)







