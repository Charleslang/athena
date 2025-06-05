# 可选链操作符

可选链操作符（Optional Chaining Operator）是 JavaScript 中的一种语法，用于简化对嵌套对象属性的访问。它允许你在访问对象的深层属性时，如果某个中间属性不存在，则不会抛出错误，而是返回 `undefined`。使用 `?.` 来表示，类似 `thymeleaf` 中的。

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
