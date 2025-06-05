
# 扩展运算符 (展开语法) 

可以使用 `...` 来展开数组或对象。扩展运算符可以将数组或对象拆分成以逗号分隔的的参数序列。

```js
let arr = [1, 2, 3]
console.log(...arr)

// ...arr 就表示 1, 2, 3
// 所以 console.log () 中的代码就相当于下面的
// console.log ( 1, 2, 3 ) 
// 而这个逗号由恰好可以当成 console.log 的参数分隔符
```

## 合并数组 

```js
let arr1 = [1, 2, 3]
let arr2 = [5, 6, 7]
let mergeArr = [...arr1, ...arr2]
// push  可以接收多个参数
// arr1.push(...arr2)
console.log(mergeArr)
// console.log(arr1)
```

## 类数组转数组  

类数组不能直接使用数组的相关方法，需要将其转换为数组。

```js
let nodeList = document.querySelectorAll('div')
console.log(nodeList, Array.isArray(nodeList))
console.log([...nodeList],Array.isArray([...nodeList]))
```
