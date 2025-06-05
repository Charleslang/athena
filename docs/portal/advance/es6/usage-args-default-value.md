# 参数默认值

在方法定义时，可以为参数设置默认值。如果调用时没有传入参数，则使用默认值。有默认值的参数最好放在最后。

```js
function add(a, b, c=3) {
  //
}
```

参数默认值也可以配合解构赋值一起使用，如下：

```js
let obj = {
  // host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root'
}
function connect({host='localhost', port}) {
  console.log(host, port)
}
connect(obj)
```
