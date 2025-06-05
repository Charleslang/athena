# 迭代器

迭代器主要用于 `for ... of` 循环，`Array`、`arguments`、`Set`、`Map`、`String`、`TypedArray` 等都部署了该接口。任何数据结构，只要部署 `iterator` 接口，就可以完成遍历操作。

迭代器的工作原理如下：

1. 创建一个指针对象，指向当前数据结构的起始位置
2. 第一次调用对象的 `next()` 方法，指针自动指向数据结构的第一个成员
3. 接下来不断调用 `next()` 方法，指针一直往后移动，直到最后一个成员
4. 每次调用 `next()` 方法，都会返回一个含有 `value` 和 `done` 属性的对象

```js
let arr = [1, 2, 3, 5, 6]
let iterator = arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

/* -------------------结果如下---------------- */
{value: 1, done: false}
{value: 2, done: false}
{value: 3, done: false}
{value: 5, done: false}
{value: 6, done: false}
{value: undefined, done: true}
{value: undefined, done: true}
```

我们可以通过下面的代码来实现一个自定义的迭代器：

```js
let obj = {
  name: 'name',
  role: [
    '焰灵姬',
    '晓梦',
    '田密'
  ],
  [Symbol.iterator]() {
    let index = 0
    let that = this
    return {
      next: function () {
        if (index < that.role.length) {
          const result = {value: that.role[index], done: false}
          index++
          return result
        } else {
          return {value: undefined, done: true}
        }
      }
    }
  }
}
for (let e of obj) {
  console.log(e)
}
```
