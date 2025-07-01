# 可选链操作符

可选链运算符（`?.`） 用于访问对象的属性或调用函数。如果使用此运算符访问的对象或调用的函数是 `undefined` 或 `null`，那么不会抛出错误，而是直接返回 `undefined`。

```js
function foo(options) {
  console.log(options?.db?.port)
}
foo({
  db: {
    port: 3306
  }
})
```

```js
function foo(dbConfig) {
  console.log(dbConfig?.db?.getConnection?.()?.lastUsedTime)
}
foo({
  db: {
    port: 3306,
    getConnection() {
      return {
        lastUsedTime: 1751271086809000
      }
    }
  }
})
```

```js
const nestedProp = obj?.["prop" + "Name"];
```
