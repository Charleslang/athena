# Set

ES6 引入了 `Set` 数据结构，它是一种无序且唯一的集合。与数组不同，`Set` 中的元素不能重复，这使得它非常适合用于去重操作。

```js
let set = new Set()
set.add(1).add(2).add(3).add(1)
console.log(set)
```

在创建 `set` 时，可以传递一个数组 (数组会被去重) 。

```js
let set = new Set([1, 2, 3, 1])
console.log(set)
```

当然，我们可以借助 Set 的特性来实现数组去重。如下：

```js
let arr = [...new Set([1, 2, 3, 1])]
console.log(arr)
```

常用方法如下：

- `add()`  

    添加元素，返回 `Set` 本身 (可链式调用) 。

- `delete()`  

    删除某个元素，返回 `boolean`。

- `has()`  

    是否存在某个元素，返回 `boolean`。

- `clear()`  

    清空所有元素，无返回值。

- `size()`  

    返回元素个数。

- `forEach()`  

    遍历集合，无返回值。 

- 求交集  

    ```js
    let arr1 = [1,2,3,5,3,2,6]
    let arr2 = [1,2,8,9,6,8]
    // let result = [...new Set(arr1)].filter(ele => [...new Set(arr2)].includes(ele))
    let result = [...new Set(arr1)].filter(ele => newSet(arr2).has(ele))
    console.log(result)
    ```

- 求并集

    ```js
    let arr1 = [1,2,3,5,3,2,6]
    let arr2 = [1,2,8,9,6,8]
    let result = new Set([...arr1, ...arr2])
    console.log(result)
    ```

- 求差集  

    ```js
    let arr1 = [1,2,3,5,3,2,6]
    let arr2 = [1,2,8,9,6,8]
    // arr1 - arr2
    let result = [...new Set(arr1)].filter(e => !(new Set(arr2).has(e)))
    console.log(result)
    ```
