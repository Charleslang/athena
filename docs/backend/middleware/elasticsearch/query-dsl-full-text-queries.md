# Full text queries

:::tip 参考
[Full text queries](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/full-text-queries.html)
:::

全文查询使您能够搜索分析的文本字段，例如电子邮件正文。使用在索引期间应用于字段的同一分析器来处理查询字符串（这句话暂时没看懂什么意思？在根据关键词进行查询时，会给关键词进行分词，这时使用的分词器和创建 mapping 时使用的分词器是一样的？）。

查询语句可以是：

- [intervals query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-intervals-query.html)

  全文查询时，允许对匹配的关键词的顺序和接近度进行细粒度控制。

- [match query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query.html)  

  用于执行全文查询的标准查询，包括模糊匹配和短语或邻近查询。

- [match_bool_prefix query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-bool-prefix-query.html)

  创建一个 bool 查询，将每个检索词作为 `term` 查询进行匹配，最后一个检索词除外，它作为 `prefix` 查询进行匹配。

- [match_phrase query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query-phrase.html)  

  与 `match` 查询类似，但用于匹配精确短语或单词邻近匹配。

- [match_phrase_prefix query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query-phrase-prefix.html)

  与 `match_phrase` 查询类似，但对最终单词进行通配符搜索。

- [multi_match query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-multi-match-query.html)  

  `match` 查询的多字段版本。

- [combined_fields query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-combined-fields-query.html)

  匹配多个字段，就像它们已被索引到一个组合字段中一样。

- [query_string query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-query-string-query.html)  

  支持紧凑的 Lucene 查询字符串语法，允许您在单个查询字符串中指定 AND|OR|NOT 条件和多字段搜索。仅供专家用户使用。

- [simple_query_string query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-simple-query-string-query.html)  

  更简单、更健壮的 `query_string` 语法版本，适合直接向用户公开。

## Intervals query

:::tip 参考
间隔查询 [Intervals query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-intervals-query.html)
:::

根据匹配关键词的顺序和接近度返回文档。

间隔查询使用由一小组定义构建的匹配规则。然后，这些规则将应用于指定字段中的关键词。

这些定义产生跨越文本正文中的关键词的最小间隔序列。这些间隔可以通过父源进一步组合和过滤。

**Example request**  

以下 intervals 搜索 `my_text` 字段包含 `my favorite food`（没有任何间隔），然后是 `hot water` 或者 `cold porridge`。

此搜索将匹配 `my_text` 字段“我最喜欢的食物是冷粥”，“但天冷的时候，我最喜欢的食物是热水”。

```json
POST _search
{
  "query": {
    "intervals" : {
      "my_text" : {
        "all_of" : {
          "ordered" : true,
          "intervals" : [
            {
              "match" : {
                "query" : "my favorite food",
                "max_gaps" : 0,
                "ordered" : true
              }
            },
            {
              "any_of" : {
                "intervals" : [
                  { "match" : { "query" : "hot water" } },
                  { "match" : { "query" : "cold porridge" } }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```

## Match query

:::tip 参考
[Match query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query.html)
:::

返回与提供的文本、数字、日期或布尔值匹配的文档。在匹配之前对提供的检索词进行分词处理。

`match` 查询是用于执行全文搜索的标准查询，包括模糊匹配选项。

**Example request**

```json
GET /_search
{
  "query": {
    "match": {
      "message": {
        "query": "this is a test"
      }
    }
  }
}
```

**Top-level parameters for match**

- `<field>`

  （必填，对象）您要搜索的字段。

**Parameters for `<field>`**

- `query`

  （必填，字符串）您要搜索的文本（Text）、数字（number）、日期（date）或布尔值（boolean）。

  `match` 查询在执行搜索之前会对 text 类型的字段进行分词（见 [analyzes](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/analysis.html)）。这意味着 `match` 查询可以在 [text](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/text.html) 字段中搜索已分词后的 token，而不是搜索精确的关键词。

- `analyzer`

  （可选，字符串）用于将查询值中的文本转换为 token 的分词器。默认为映射到 `<field>` 的 [index-time analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/specify-analyzer.html#specify-index-time-analyzer)。如果没有映射分析器，则使用索引的默认分析器。

- `auto_generate_synonyms_phrase_query`

  （可选，布尔值）如果为 `true`，则会自动为多术语同义词创建匹配短语查询（[match phrase](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query-phrase.html)）。默认为 `true`。

  有关示例，请参阅 [Use synonyms with match query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query.html#query-dsl-match-query-synonyms)。

- `lenient`

  （可选，布尔值）如果为 `true`，则忽略基于格式的错误，例如为数字字段提供字符串查询值。默认为 `false`。其实，ES 会尝试把传进去的字符串转换为数字，如果转换失败，才会报错。如果设置为 `true`，那么就会忽略这个错误，不会报错。

- `operator`

  （可选，字符串）用于解释查询值中的文本的布尔逻辑。有效值为：

  - `OR (Default)`

    例如，查询条件 `capital of Hungary` 被解释为 `capital OR of OR Hungary`。

  - `AND`  

    例如，查询条件 `capital of Hungary` 被解释为 `capital AND of AND Hungary`。

  简单讲一下这个参数是啥意思。假设有两条记录的 `message` 字段分别是 `this is a test`、`this is a message`。如果查询条件为 `this is message`，那么默认情况下，`match` 查询会将查询条件进行分词，分词后含有 3 个 token，分别是 `this`、`is`、`message`。如果把 `operator` 设置为 `OR`，那么查询条件会被解释为 `this OR is OR message`（也就是说 `message` 字段中含有 `this`、`is`、`message` 任意一个单词可以了），这样就会匹配到两条记录。如果把 `operator` 设置为 `AND`，那么查询条件会被解释为 `this AND is AND message`（也就是说 `message` 字段中必须包含 `this`、`is`、`message` 这 3 个单词才可以），这样就只会匹配到一条记录。

- `minimum_should_match`

  可选，字符串）要返回的文档必须匹配的最小子句数。参考 [minimum_should_match parameter](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-minimum-should-match.html)。


:::tip 提示
可以通过组合 `<field>` 和查询参数来简化 `match` 查询语法。例如：

```json
GET /_search
{
  "query": {
    "match": {
      "message": "this is a test"
    }
  }
}
```
:::

**match 查询的工作原理**

`match` 查询的类型为布尔值。这意味着对所提供的查询文本进行分词，并且分词过程根据所提供的文本构造 bool 查询。`operator` 参数可以设置为 `or` 或 `and` 来控制布尔子句（默认为 `or`）。可以使用 `minimum_should_match` 参数设置要匹配的可选 `should` 子句的最小数量。

下面是一个带有 `operator` 参数的示例：

```json
GET /_search
{
  "query": {
    "match": {
      "message": {
        "query": "this is a test",
        "operator": "and"
      }
    }
  }
}
```
可以设置分词器来控制哪个分词器将对文本执行分词。它默认创建 mapping 时该字段指定的分词器，或默认的搜索分词器。`lenient` 参数可以设置为 `true` 以忽略数据类型不匹配导致的异常，例如尝试使用文本查询字符串查询数字字段。默认为 `false`。

## Match phrase query

:::tip 参考
短语查询 [Match phrase query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query-phrase.html)
:::

`match_phrase` 查询分析文本并根据分析的文本创建短语查询。例如：

```json
GET /_search
{
  "query": {
    "match_phrase": {
      "message": "this is a test"
    }
  }
}
```

短语查询以任意顺序匹配 slop（默认为 0）的关键词。转置项的斜率为 2。

可以设置分词器来控制哪个分词器将对文本执行分词。它默认创建 mapping 时该字段指定的分词器，或默认的搜索分词器。

```json
GET /_search
{
  "query": {
    "match_phrase": {
      "message": {
        "query": "this is a test",
        "analyzer": "my_analyzer"
      }
    }
  }
}
```
短语查询还接受 `zero_terms_query` 参数，该参数的解释见 [match query](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-match-query.html)。






