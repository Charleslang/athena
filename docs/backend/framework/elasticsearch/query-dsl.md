# Query DSL

:::tip 参考
[Search your data](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/search-your-data.html)  
[Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl.html#query-dsl)
:::

Elasticsearch 提供了一个完整的基于 JSON 的 Query DSL（Domain Specific Language）来定义查询，Query DSL 被视为查询的 AST（抽象语法树）。

## 基本查询

:::details 查询全部
**SQL：**
```sql
select * from account;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_all": {}
  }
}
```
:::

:::details 查询指定字段
**SQL：**
```sql
select account_number, balance from account;
```
**Query DSL：**
```json
{
  "query": {
    "match_all": {}
  },
  "_source": [
    "account_number",
    "balance"
  ]
}
```
:::

:::details count 查询
**SQL：**
```sql
select count(*) from account;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_count
// 如果是查询表中的全部数据，那么可以省略请求体
{
  "query": {
    "match_all": {}
  }
}
```
:::

:::details where 等值查询
**SQL：**
```sql
select * from account where age = 26;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "term": {
      "age": 26
    }
    // 使用 match 也可以，在小结部分会提到 term 和 match 的区别
    // "match": {
    //   "age": 26
    //}
    // "match": {
    //   "age": "26"
    //}
  }
}
```
:::

:::details where 字符串等值查询
**SQL：**
```sql
select * from account where address = '990 Mill Road';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match": {
      "address.keyword": "990 Mill Road" // 区分大小写
    }
  }
}
```
:::

:::details where like 模糊查询
**SQL：**
```sql
select * from account where address like '%mill road%';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_phrase": {
      "address": "mill road" // 不区分大小写
    }
    // 或者使用 wildcard
    // {
    //   "query": {
    //     "wildcard": {
    //       "address.keyword": "*mill road*" 
    //     }
    //   }
    // }
  }
}
```
:::

:::details where 多字段模糊查询
**SQL：**
```sql
select * from account where city like '%mill road%' or address like '%mill road%';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase": {
            "city": "mill road"
          }
        },
        {
          "match_phrase": {
            "address": "mill road"
          }
        }
      ]
    }
  }
}
```
:::

:::details where 多字段等值查询
**SQL：**
```sql
select * from account where city = '990 Mill Road' or address = '990 Mill Road';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "city.keyword": "990 Mill Road"
          }
        },
        {
          "match": {
            "address.keyword": "990 Mill Road"
          }
        }
      ]
    }
  }
}
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "multi_match": {
      "query": "990 Mill Road",
      "fields": ["city.keyword", "address.keyword"] // 不加 keyword 也可以，但是 query 会被分词
    }
  }
}
```
:::

:::details where in 查询
**SQL：**
```sql
select * from account where age in (26, 27);
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "terms": {
      "age": [26, 27]
    }
  }
}
```
:::

:::details where 多条件查询
使用 `bool` 可以构造多个查询条件。

**SQL：**
```sql
select * from account where age = 26 and gender = 'M';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "age": 26
          }
        },
        {
          "match": {
            "gender": "M"
          }
        }
      ]
    }
  }
}

**SQL：**
```sql
select * from account where age = 26 and gender = 'M' and state <> 'VT';
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "age": 26
          }
        },
        {
          "match": {
            "gender": "M"
          }
        }
      ],
      "must_not": [
        {
          "match": {
            "state": "VT"
          }
        }
      ]
    }
  }
}
```
:::

:::details where 范围查询
**SQL：**
```sql
select * from account where age > 26 and age < 30;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "range": {
      "age": {
        "gt": 26,
        "lt": 30
      }
    }
  }
}
```
:::

:::details where between 查询
**SQL：**
```sql
select * from account where age between 26 and 30;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "range": {
      "age": {
        "gte": 26,
        "lte": 30
      }
    }
  }
}
```
:::

:::details 排序
**SQL：**
```sql
select * from account order by age desc;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "age": "desc"
    }
  ]
  // 等价于下面的写法
  // "sort": [
  //   {
  //     "age": {
  //       "order": "desc"
  //     }
  //   }
  // ]
}
```

---

**SQL：**
```sql
select * from account order by age desc, account_number asc;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "age": "desc"
    },
    {
      "account_number": "asc"
    }
  ]
}
```
:::

:::details 分页
**SQL：**
```sql
select * from account limit 20;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_all": {}
  },
  "from": 0, // from 可以省略，默认值为 0
  "size": 20
}
```

---

**SQL：**
```sql
select * from account limit 10, 20;
```
**Query DSL：**
```json
// GET http://localhost:9200/account/_search
{
  "query": {
    "match_all": {}
  },
  "from": 10,
  "size": 20
}
```
:::

## 复合查询
### Boolean 查询

:::tip 参考
[Boolean query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-bool-query.html)
:::

`bool` 查询使用一个或多个 `bool` 子句（子句也就是查询条件）构建，每个子句都有一类条件。条件类型如下：

|类型|描述|
|---|---|
|`must`| 文档必须匹配的条件，否则文档将被排除在结果之外。`must` 会记录相关性得分。|
|`filter`| 文档必须匹配的条件。然而，与 `must` 不同的是，查询的分数将被忽略。`filter` 子句在 `filter context` 中执行，这意味着将忽略评分，并考虑将查询条件用于缓存。|
|`should`| 文档应该匹配子句，不匹配也可以。如果 `should` 里面的条件被匹配上了，那么会增加文档的相关性得分。需要注意的是，`should` 并不参与查询条件的过滤，它只影响文档的相关性得分。|
|`must_not`| 文档必须不匹配子句，否则文档将被排除在结果之外。`must_not` 最终会被转化为 `filter`，并在在 `filter context` 中执行，这意味着忽略评分，并考虑子句进行缓存。因为忽略了分数，所以返回所有文档的分数为0。|

`bool` 查询采用“匹配越多越好”的方法，因此每个匹配 `must` 或 `should` 子句的分数将被加在一起，以提供每个文档的最终 `_score`。

**minimum_should_match**  

您可以使用 `minimum_should_match` 参数指定返回的文档必须匹配的 `should` 子句的数量或百分比。

如果 `bool` 查询包含至少一个 `should` 子句和 `must_not` 或 `filter` 子句，则 `minimum_should_match` 默认值为 `1`。否则，默认值为 `0`。

其他有效值请参见参数 [`minimum_should_match`](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-minimum-should-match.html)。

小结：
- 在上面的查询示例中，我使用的是 GET 方式。其实，Elasticsearch 还支持 POST 方式，只需要将查询条件放在请求体中即可。在使用 Elasticsearch 的 API 时，我们可以根据自己的习惯来选择使用 GET 还是 POST 方式。
- 默认情况下，ES 只会在 `hits.hits` 中返回查询到的前 10 条数据，如果想要返回全部数据，可以使用 `size` 参数来指定返回的数据条数。
- `term` 用于精确匹配，对于不需要分词的字段（例如金额、年龄等），如果我们想精确匹配，一般使用 `term` 查询。`match` 用于模糊匹配，对于需要分词的字段，可以使用 `match` 查询。