# 逻辑空赋值

逻辑空赋值运算符（`x ??= y`）仅在 x 是[空值](../../base/js/usage.html#空值)（`null` 或 `undefined`）时对其赋值。

```js
const a = { duration: 50 };

a.speed ??= 25;
// 输出 25
console.log(a.speed);

a.duration ??= 10;
// 输出 50
console.log(a.duration);
```

`x ??= y` 的等价语法是 `x ?? (x = y)`。
