# 聚合

:::tip 参考
[Aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-aggregations.html)
:::

聚合是一种分析数据的方法，它将数据分组并计算每个组的指标。聚合可以看作是 SQL 中的 `GROUP BY`、聚合函数等操作。

**搜索 `address` 中包含 `mill` 的所有人的年龄分布以及平均年龄：** 
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match": {
      "address": "mill"
    }
  },
  "aggs": {
    "age_agg": {
      "terms": {
        "field": "age"
      }
    },
    "age_avg": {
      "avg": {
        "field": "age"
      }
    }
  }
}
```

**统计所有人的年龄分布，并求出每个年段的平均薪资：**
```json
// GET http://localhost:9200/account/_search
{
  "_source": false, // hits.hits 中不返回 _source
  "size": 0, // 不返回文档, 即 hits.hists 为空
  "aggs": {
    "age_agg": {
      "terms": {
        "field": "age"
      },
      "aggs": {
        "balance_avg": {
          "avg": {
            "field": "balance",
            "size": 10 // 只返回前 10 种分布情况
          }
        }
      }
    }
  }
}
```

**统计所有人的年龄分布，并且额外统计各个年龄段 `M` 和 `F` 的平均薪资和整个年龄段的平均薪资：**
```json
// GET http://localhost:9200/account/_search
{
  "size": 0,
  "aggs": {
    "aggAgg": {
      "terms": {
        "field": "age"
      },
      "aggs": {
        "genderAgg": {
          "terms": {
            "field": "gender.keyword" // text 类型的字段做聚合时需要加上 .keyword
          },
          "aggs": {
            "balanceAvg": {
              "avg": {
                "field": "balance"
              }
            }
          }
        },
        "balanceAvg": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}