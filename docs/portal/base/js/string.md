# 字符串

## 常用方法

字符串在底层是以字符数组的形式保存的。

```js
var str = 'hello world!';
console.log(str[0]); // h
```

- **charAt()**  

  返回在指定位置的字符。

  ```js
  var str = 'hello world!';
  console.log(str[0]);
  console.log(str.charAt(1)); // e
  ```

- **charCodeAt()**  

  返回指定位置字符的 Unicode 编码。

- **fromCharCode()**  

  从字符编码创建一个字符串。

  ```js
  // 参数使用十进制
  var s = String.fromCharCode(72);
  // 参数使用十六进制
  var s = String.fromCharCode(0x1236);
  ```

- **concat()**  

  连接字符串，相当于使用 + 号。

  ```js
  var str = 'hello world!';
  var s;
  s = str.concat("您好","世界");
  console.log(s);
  ```

- **indexOf()**  

  检索字符串，返回某个指定的字符串值在字符串中首次出现的位置。

  ```js
  var str = 'hello world!';
  console.log(str.indexOf("or"));
  ```

  完整语法是 `stringObject.indexOf(searchvalue, fromindex)：

  |参数|描述|
  |---|---|
  |`searchvalue`|必需。规定需检索的字符串值。|
  |`fromindex`|可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的首字符开始检索。|

    :::warning 注意  
    `indexOf()` 方法对大小写敏感，如果要检索的字符串值没有出现，则该方法返回 -1。
    :::

- **lastIndexOf()**  

  从后向前搜索字符串。

- **slice()**  

  提取字符串的片断，并在新的字符串中返回被提取的部分。

  ```js
  var str = 'hello world!';
  s = str.slice(0,2);
  console.log(s);
  ```
  
  作用效果和 `substring()` 相似，都可以传递负数，且不包含结束的下标。

- **substring()**   

  提取字符串中两个指定的索引号之间的字符。不包含结束的下标，可以传递负数（会自动加上字符串长度，如果没有该范围，会返回 ''）。

- **substr()**  

  从起始索引号提取字符串中指定数目的字符，索引可以是负数。

## 正则表达式相关方法

- **split()**   

  默认就是全局匹配。

  ```js
  var str = 'hello world!';
  s = str.split(/\s/);
  console.log(s.toString());
  ```

- **search()**  

  搜索字符串中是否含有指定内容，并返回第一次出现的索引，默认是全局匹配。

  ```js
  var str = 'hello world!';
  console.log(str.search("abc"));
  console.log(str.search(/a[abcl]c/));
  ```

- **match()**   

  找到一个或多个正则表达式的匹配。

  ```js
  s = "oell0jhdlldd".match("ll");
  s = "owlell0ncjhdlldd".match(/[A-z]/gi);
  console.log(s);
  ```

- **replace()**  

  替换与正则表达式匹配的子串。

  ```js
  var ss = "mvkjjdkl";
  var m = ss.replace(/k/g,'0');
  console.log(m);
  ```

  由于没有 `replaceAll()`，所以，如果想要替换所有的, 就需要用正则表达式。
