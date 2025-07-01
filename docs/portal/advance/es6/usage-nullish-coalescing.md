# 空值合并运算符

[空值](../../base/js/usage.html#空值)合并运算符（`??`）是一个逻辑运算符，仅当左侧的操作数为 `null` 或者 `undefined` 时，返回其右侧操作数，否则返回左侧操作数。

```js
const foo = null ?? "default string";
// 输出 "default string"
console.log(foo);

const baz = 0 ?? 42;
// 输出 0
console.log(baz);
```