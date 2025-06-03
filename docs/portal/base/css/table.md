# 表格

```html
<table>
  <!-- caption 元素定义表格标题。
    caption 标签必须紧随 table 标签之后。
    您只能对每个表格定义一个标题。
    通常这个标题会被居中于表格之上。 
  -->
  <caption>表格标题</caption>
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
      <th>表头3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <!-- 从该位置起，合并纵向的单元格 -->
      <td rowspan="2">1</td>
      <td>2</td>
      <td>3</td>
    </tr>
    <tr>
      <!-- 合并两个水平方向的单元格 -->
      <td colspan="2">2</td>
    </tr>
  </tbody>
  <!-- 该标签中的内容永远显示在表格底部，不管它的位置在何处 -->
  <tfoot>
    <tr>
      <td>1</td>
      <td>合计</td>
      <td>123</td>
    </tr>
  </tfoot>
</table>
```

```css
table, tr, td, th {
  border: 1px solid #ccc;
  /* 合并边框 */
  border-collapse: collapse;
}

table {
  table-layout: fixed;
}

td, th {
  width: 100px;
  padding: 2px 5px;
  text-align: center;
}

/* 隔行变色 */
/* 使用 table > tr 无效，因为页面中会自动添加 <thead><tbody> 和< tfoot> */
/* 有的人看似是儿子，其实是孙子 */
tbody > tr:nth-child(even) {
  background: #eee;
}
```

:::tip 提示
- `td` 中的内容默认是垂直居中的
- 可以使用 `vertical-align` 来设置 `td` 中的垂直样式
:::
