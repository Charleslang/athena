# 模板字符串

在 ES5 中，字符串使用单引号或双引号来表示。ES6 中引入了 \`\` 来定义字符串，它被称为模板字符串 (Template String)。


允许跨行：

```js
let str = `
    hello,
    world
`
```

模板字符串中也可以解析变量，如下：

```js
let name = '张三'
let hello = `my name is ${name}`
// let hello = `my name is ` + name
console.log(hello)
```

模板字符串中也可以调用函数 (使用函数的返回值) ：

```js
function say() {
  return 'hello'
}
console.log(`say ${say()}`)
```
