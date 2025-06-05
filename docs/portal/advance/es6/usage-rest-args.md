# 剩余参数

当实参个数大于形参的个数时，我们可以将剩余参数放在一个数组里面。它可以用来代替 `arguments`。需要注意的是，剩余参数只能放在最后。

```js
function foo (param, ...args) {
  console.log(param) // 1
  console.log(args) // [2,3]
}
foo(1, 2, 3)
```

剩余参数也可以配合解构赋值一起使用，如下：

```js
let [a, ...b] = [1, 2, 3]
console.log(b) // [2,3]
```
