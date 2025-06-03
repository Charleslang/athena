# Java High Level REST Client

:::tip 参考
[Java High Level REST Client](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.15/java-rest-high.html)
:::

- `pom.xml`

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
    <version>7.17.9</version>
</dependency>
```

- `ElasticsearchConfig.java`

```java
package com.dysy.esboot.config;

import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    public static final RequestOptions COMMON_OPTIONS;

    static {
        RequestOptions.Builder builder = RequestOptions.DEFAULT.toBuilder();
        COMMON_OPTIONS = builder.build();
    }

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "http")
        );

        BasicCredentialsProvider basicCredentialsProvider = new BasicCredentialsProvider();
        UsernamePasswordCredentials usernamePasswordCredentials = new UsernamePasswordCredentials("username", "password");
        basicCredentialsProvider.setCredentials(AuthScope.ANY, usernamePasswordCredentials);
        builder.setHttpClientConfigCallback(
                httpAsyncClientBuilder -> httpAsyncClientBuilder.setDefaultCredentialsProvider(basicCredentialsProvider)
        );

        return  new RestHighLevelClient(builder);
    }
}
```

- `ESTest.java`

```java
package com.dysy.elasticsearch;

import org.apache.lucene.search.TotalHits;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.core.TimeValue;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.Avg;
import org.elasticsearch.search.aggregations.metrics.AvgAggregationBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.xcontent.XContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.dysy.elasticsearch.config.ElasticsearchConfig.COMMON_OPTIONS;

@SpringBootTest
class ElasticsearchApplicationTests {

    @Autowired
    private RestHighLevelClient elasticsearchClient;

    @Test
    void contextLoads() {
        System.out.println(elasticsearchClient);
    }

    @Test
    public void testIndexWithJson() throws IOException {
        // 多次执行, 会进行更新操作
        IndexRequest indexRequest = new IndexRequest("myindex");
        indexRequest.id("id2");
        indexRequest.source("{\"name\":\"张三\",\"age\":231}", XContentType.JSON);
        IndexResponse indexResponse = elasticsearchClient.index(indexRequest, COMMON_OPTIONS);
        System.out.println(indexResponse);
    }

    @Test
    public void testIndexWithMap() throws IOException {
        IndexRequest indexRequest = new IndexRequest("myindex");
        indexRequest.id("id1");
        Map<String, Object> map = new HashMap<>();
        map.put("name", "张三");
        map.put("age", 231);
        indexRequest.source(map);
        IndexResponse indexResponse = elasticsearchClient.index(indexRequest, COMMON_OPTIONS);
        System.out.println(indexResponse);
    }

    @Test
    public void testDelete() throws IOException {
        DeleteRequest deleteRequest = new DeleteRequest("myindex", "id1");
        DeleteResponse deleteResponse = elasticsearchClient.delete(deleteRequest, COMMON_OPTIONS);
        System.out.println(deleteResponse);
    }

    @Test
    public void testSearch() throws IOException {
        // 构造查询请求, 指定索引
        SearchRequest searchRequest = new SearchRequest("account");

        // 构造查询条件
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

        // 查询条件, 使用 QueryBuilders 工具来实现
        MatchQueryBuilder matchQueryBuilder = QueryBuilders.matchQuery("address", "Fillmore Place");
        searchSourceBuilder.query(matchQueryBuilder);

        // 聚合条件, 使用 AggregationBuilders 工具来实现
        // 年龄分组, 并计算每个年龄段的平均余额
        TermsAggregationBuilder termsAggregationBuilder = AggregationBuilders.terms("ageAgg").field("age");
        termsAggregationBuilder.subAggregation(AggregationBuilders.avg("balanceAvg").field("balance"));
        searchSourceBuilder.aggregation(termsAggregationBuilder);

        // 求平均余额
        AvgAggregationBuilder avgAggregationBuilder = AggregationBuilders.avg("balanceAvg").field("balance");
        searchSourceBuilder.aggregation(avgAggregationBuilder);

        // 分页
        searchSourceBuilder.from(10);
        searchSourceBuilder.size(20);

        // 将查询条件放入查询请求中
        searchRequest.source(searchSourceBuilder);

        System.out.println(searchSourceBuilder);

        // 执行查询
        SearchResponse searchResponse = elasticsearchClient.search(searchRequest, COMMON_OPTIONS);

        // 打印结果
        System.out.println(searchResponse);

        // 获取查询耗时
        TimeValue took = searchResponse.getTook();
        long millis = took.getMillis();
        System.out.println("耗时: " + millis + "ms");

        // 是否超时
        boolean timedOut = searchResponse.isTimedOut();
        System.out.println("是否超时: " + timedOut);

        SearchHits hits = searchResponse.getHits();

        // 总命中数
        TotalHits totalHits = hits.getTotalHits();
        long total = totalHits.value;
        System.out.println("总命中数: " + total);

        // 最高分
        float maxScore = hits.getMaxScore();
        System.out.println("最高分: " + maxScore);

        SearchHit[] searchHits = hits.getHits();
        for (SearchHit searchHit : searchHits) {
            // 本次查询的索引
            String index = searchHit.getIndex();
            // 本次查询的类型
            String type = searchHit.getType();
            // 本次查询的文档 id
            String id = searchHit.getId();
            // 本次查询的文档得分
            float score = searchHit.getScore();
            // 本次查询的文档内容
            String sourceAsString = searchHit.getSourceAsString();
            // 高亮结果
            Map<String, HighlightField> highlightFields = searchHit.getHighlightFields();
            // 本次查询的文档内容, Map 形式
            Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
            System.out.println(sourceAsMap);
        }

        // 聚合结果
        Aggregations aggregations = searchResponse.getAggregations();
        // 将聚合结果转换为 Map
        Map<String, Aggregation> aggregationMap = aggregations.getAsMap();
        System.out.println(aggregationMap);

        // 将聚合结果转换为 List
        List<Aggregation> aggregationList = aggregations.asList();

        // 获取指定的聚合结果
        Terms ageAgg = aggregations.get("ageAgg");
        Terms.Bucket bucketByKey = ageAgg.getBucketByKey("39");
        // 如果 bucketByKey 为 null, 说明没有该年龄段的数据
        String keyAsString = bucketByKey.getKeyAsString();
        long docCount = bucketByKey.getDocCount();
        System.out.println(keyAsString + ":" + docCount);
        // 获取子聚合结果
        Aggregations bucketByKeyAggregations = bucketByKey.getAggregations();
        Avg balanceAvg = bucketByKeyAggregations.get("balanceAvg");
        String valueAsString = balanceAvg.getValueAsString();
        System.out.println(valueAsString);

        // 获取所有年龄段的聚合结果
        List<? extends Terms.Bucket> buckets = ageAgg.getBuckets();
        System.out.println("年龄分组: ");
        buckets.forEach(bucket -> {
            String key = bucket.getKeyAsString();
            long docCount1 = bucket.getDocCount();
            System.out.println(key + ":" + docCount1);
        });
    }
}
```
