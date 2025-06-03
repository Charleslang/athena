# 基本用法

## 查看 ES 相关信息

|请求方式|URI|描述|
|---|---|---|
|**GET**|`/_cat/nodes`|查看节点状况, 有 * 号的表示主节点|
|**GET**|`/_cat/health`|查看节点健康状态|
|**GET**|`/_cat/master`|查看主节点|
|**GET**|`/_cat/indices`|查看所有索引|

## 查询

:::details GET http://localhost:9200/myindex/mytype/3
**Response：**
```json
{
  // 当前数据在哪个索引下
  "_index": "myindex",
  // 当前数据在哪个类型下
  "_type": "mytype",
  // 当前数据的 ID
  "_id": "3",
  // 当前数据的版本（如果 version 不等于 1，则说明说明被更新过）
  "_version": 3,
  // 当前数据的 _seq_no
  "_seq_no": 7,
  // 分片信息
  "_primary_term": 1,
  // 是否有查询结果 (相当于 count > 0)
  "found": true,
  // 本次查询出来的数据
  "_source": {
    "username": "ww",
    "age": 26,
    "address": "四川省成都市"
  }
}
```
此方式相当于根据 ID 进行查询。
:::

ES 支持两种查询方式，一种是直接把所有参数放在 URI 中，另一种是把参数放在 body 中。下面举两个例子：

:::details GET /account/_search?q=*&sort=age:desc
这种方式是把所有查询条件都放在了 URI 中。一般来讲，我们不推荐这样做，因为 URI 的长度是有限制的，如果查询条件过多，就会导致 URI 过长，从而导致查询失败。
:::

:::details GET /account/_search
**body：**
```json
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "age": "desc"
    }
  ]
}
```
:::

我们推荐使用上面的第二种方式来进行查询，因为这种方式可以把查询条件放在 body 中，而 body 中的数据是没有长度限制的。这种方式在 ES 中称为 `Query DSL`，即查询描述语言。所以，我们需要着重掌握这种查询方式。见 [Query DSL](./query-dsl.md)。

## 添加

添加数据时，需要指定把该数据新增到哪个索引的哪个类型下。如果索引不存在，则会自动创建索引。

:::details PUT http://localhost:9200/myindex/mytype/1
**body：**
```json
{
  "username": "zs",
  "age": 13,
  "address": "四川省成都市"
}
```
**Response：**
```json
// 给 ES 发送请求后，ES 会有返回值，返回值中以 `_` 开头是 ES 的元数据
{
  // 当前数据是在哪个索引下
  "_index": "myindex",
  // 当前数据是在哪个类型下
  "_type": "mytype",
  // 当前数据的 ID
  "_id": "1",
  // 当前数据的版本
  "_version": 1,
  // 当前的操作类型
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```
:::

:::details POST http://localhost:9200/myindex/mytype
**body：**
```json
{
  "username": "ls",
  "age": 20,
  "address": "四川省成都市"
}
```
**Response：**
```json
// 给 ES 发送请求后，ES 会有返回值，返回值中以 `_` 开头是 ES 的元数据
{
  // 当前数据是在哪个索引下
  "_index": "myindex",
  // 当前数据是在哪个类型下
  "_type": "mytype",
  // 当前数据的 ID（由 ES 自动生成）
  "_id": "iG9LUYcBdiG3RfhG5Q1f",
  // 当前数据的版本
  "_version": 1,
  // 当前的操作类型
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```
:::

:::details POST http://localhost:9200/myindex/mytype/3
**body：**
```json
{
  "username": "ww",
  "age": 25,
  "address": "四川省成都市"
}
```
**Response：**
```json
// 给 ES 发送请求后，ES 会有返回值，返回值中以 `_` 开头是 ES 的元数据
{
  "_index": "myindex",
  "_type": "mytype",
  // 该 ID 是新增数据时指定的 ID
  "_id": "3",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 3,
  "_primary_term": 1
}
```
:::

小结：

- 使用 PUT 方式新增数据时, 必须要在 URI 中指定 ID。
- 对同一个 ID 的进行多次 PUT 操作，如果数据不存在，则新增，否则进行修改。
- 使用 POST 方式添加数据时，如果不在 URI 中指定 ID，那么每次都会新增数据。如果在 URI 中指定了 ID，但是数据不存在，则新增，否则进行修改。

## 修改

:::details PUT http://localhost:9200/myindex/mytype/1
**body：**
```json
{
  "username": "zs1",
  "age": 13,
  "address": "四川省成都市"
}
```
**Response：**
```json
{
  "_index": "myindex",
  "_type": "mytype",
  "_id": "1",
  // 数据更新后, 版本号会增加
  "_version": 2,
  // 本次操作类型
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  // 数据更新后, _sqp_no 会增加
  "_seq_no": 4,
  "_primary_term": 1
}
```
:::
:::details POST http://localhost:9200/myindex/mytype/3
**body：**
```json
{
  "username": "ww",
  "age": 26,
  "address": "四川省成都市"
}
```
**Response：**
```json
{
  "_index": "myindex",
  "_type": "mytype",
  "_id": "3",
  "_version": 3,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 7,
  "_primary_term": 1
}
```
:::

:::details POST http://localhost:9200/myindex/mytype/6/_update
**body：**
```json
{
  "doc":{
    "username": "ww",
    "age": 29,
    "address": "四川省成都市"
  }
}
```
**Response：**
```json
{
  "_index": "myindex",
  "_type": "mytype",
  "_id": "3",
  "_version": 6,
  // 本次操作结果。noop 表示数据没有发生变更
  // 如果数据发生了变化，那么 result 会是 updated
  "result": "noop",
  "_shards": {
    "total": 0,
    "successful": 0,
    "failed": 0
  },
  "_seq_no": 10,
  "_primary_term": 1
}
```
:::

小结：

- 使用 POST 带 `/{id}/_update` 的方式修改数据时，要求指定的 ID 对应的数据必须存在，否则报错。
- 使用 POST 带 `/{id}/_update` 的方式修改数据时，需要把更新的数据放在 `doc` 字段中。
- 使用 POST 带 `/{id}/_update` 的方式修改数据时，会对比更新前后数据是否发生变化。如果数据没有发生变化，则 `version`、`_seq_no` 不会发生变化，result 为 `noop`，否则 result 为 `updated`。
- POST、 PUT 使用 `/{id}` 的方式修改数据时，会直接更新数据，不会检测数据更新前后是否发生变化。

## 删除

:::details DELETE http://localhost:9200/myindex/mytype/1
**Response：**
```json
{
  "_index": "myindex",
  "_type": "mytype",
  "_id": "1",
  "_version": 4,
  // 当前操作结果
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 11,
  "_primary_term": 1
}
```
此方式相当于根据 ID 删除数据。
:::
:::details DELETE http://localhost:9200/myindex
**Response：**
```json
{
  "acknowledged": true
}
```
ES 中没有提供删除类型和删除索引下面所有数据的方法，只能通过删除索引来实现。
:::

## 乐观锁

从 ES 中查询数据时，ES 会返回一些元数据，其中 `version`、`_seq_no`、`_primary_term` 这三个字段比较有意思。只要数据发生过更新操作，那么 `version`、`_seq_no` 的值就会被更新；如果分片信息发生过更改，那么 `_primary_term` 的值就会被改变。在并发场景下，我们可以利用这几个字段的值来做乐观锁。

假如，有两个线程同时查询 ID 为 3 的那条记录，查询到的结果如下：
```json
{
  "_index": "myindex",
  "_type": "mytype",
  "_id": "3",
  "_version": 3,
  "_seq_no": 7,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "username": "ww",
    "age": 26,
    "address": "四川省成都市"
  }
}
```
我们会看到，两个线程查到的结果中，`version`、`_seq_no`、`_primary_term` 都是相同的。此时，这两个线程准备对查询到的数据做修改，于是，它们分别发起了下面的更新请求。

- 线程 1
  
  PUT `http://localhost:9200/myindex/mytype/3?if_seq_no=7&if_primary_term=1`  
  
  ```json
  // Request Body
  {
    "username": "ww",
    "age": 27,
    "address": "四川省成都市"
  }
  ```

- 线程 2  

  PUT `http://localhost:9200/myindex/mytype/3?if_seq_no=7&if_primary_term=1`  
  
  ```json
  // Request Body
  {
    "username": "ww",
    "age": 28,
    "address": "四川省成都市"
  }
  ```
当然，结果如我们所料，只会有一个线程更新成功，而另一线程会得到错误的响应，如下：
```json
{
  "error": {
    "root_cause": [
      {
        "type": "version_conflict_engine_exception",
        "reason": "[3]: version conflict, required seqNo [7], primary term [1]. current document has seqNo [8] and primary term [1]",
        "index_uuid": "qKVWiBVxShKNvlH__Wx37Q",
        "shard": "0",
        "index": "myindex"
      }
    ],
    "type": "version_conflict_engine_exception",
    // 失败原因
    "reason": "[3]: version conflict, required seqNo [7], primary term [1]. current document has seqNo [8] and primary term [1]",
    "index_uuid": "qKVWiBVxShKNvlH__Wx37Q",
    "shard": "0",
    "index": "myindex"
  },
  "status": 409
}
```

## 批量操作 bulk

:::tip 参考
[Bulk API](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/docs-bulk.html)

批量操作的测试数据可以从[这里](https://raw.githubusercontent.com/elastic/elasticsearch/5.6/docs/src/test/resources/accounts.json)获取。
:::

Bulk API 提供了一种在单个请求中执行多个索引、创建、删除和更新操作的方法。简单来讲，我们可以使用 `Bulk API` 发送一个请求，这一个请求里面可以执行多种操作，例如同时执行新增和删除的操作等。使用换行符分隔的 JSON (NDJSON) 结构在请求正文中指定操作：
```
action_and_meta_data\n
optional_source\n
action_and_meta_data\n
optional_source\n
....
action_and_meta_data\n
optional_source\n
```
下面是一个简单的示例：
```
POST /_bulk
{"index":{"_index":"myindex","_type":"mytype","_id":"1"}}
{"name":"zs","age":12}
{"create":{"_index":"myindex","_type":"mytype","_id":"2"}}
{"name":"ww","age":25}
{"delete":{"_index":"myindex","_type":"mytype","_id":"1"}}
{"update":{"_index":"myindex","_type":"mytype","_id":"2"}}
{"doc":{"name":"zs","age":12}}
```
解释一下上面的请求，依次做了下面的事情：
1. 往索引 myindex 的类型 mytype 中插入了一条记录，记录的 ID 为 1，内容是 `{"name":"zs","age":12}`
2. 往索引 myindex 的类型 mytype 中插入了一条记录，记录的 ID 为 2，内容是 `{"name":"ww","age":25}`
3. 删除索引 myindex 下的类型 mytype 中 ID 为 1 的记录
4. 更新索引 myindex 下的类型 mytype 中 ID 为 2 的记录，更新后的值是 `{"doc":{"name":"zs","age":12}}`
   
:::tip 提示
批量操作并不存在事务，上一条命令的结果不会影响下一条命令的执行。
:::

好了，为了方便后面熟悉 ES 的 API，我们把上面提到的批量测试数据使用 Kibana 导入到 ES 里面吧。
```
POST /account/_doc/_bulk
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN"}
...
```
