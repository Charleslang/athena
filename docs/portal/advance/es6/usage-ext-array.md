# Array 扩展

- **`Array.from(arrayLike, [function])`**  

    将类数组转换为真正的数组，它接收一个伪数组。

    ```js
    let nodeList = document.querySelectorAll('div')
    console.log(Array.from(nodeList))
    ```

    当然，我们也可以传递一个函数对数组进行处理。

    ```js
    let arrayLike = {
    "0":1,
    "1":2,
    "2":3,
    "length":3
    }
    let result = Array.from(arrayLike, e => e * 2)
    console.log(result)
    ```

- **`find()`**  

    找出第一个符合条件的数组成员，如果没有则返回 undefined。

    ```js
    let arr = [1, 2, 3, 6, 7]
    let result = arr.find((e, i) => e >= 6)
    console.log(result)
    ```

- **`findIndex()`**  

    找出第一个符合条件的元素的下标，否则返回 -1。
    ```js
    let arr1 = ['a', 'b', 'c']
    console.log(arr1.findIndex(e => e === 'b'))
    ```

- **`includes()`**  

    判断数组是否包含某个值，返回值为 boolean。
    ```js
    let arr = [1, 2, 3, 6, 7]
    console.log(arr.includes(6))
    ```

- `flat()`  

    将数组进行降维 (二维降为一维、三维将为二维) 。
    ```js
    let arr1 = [
    [1, 2, 3],
    [5, 6, 7]
    ]
    let arr2 = [
    [
        [1, 2, 3],
        [5, 6, 7]
    ]
    ]
    console.log(arr1.flat())
    console.log(arr2.flat())
    console.log(arr2.flat(1)) // 降为 1 维
    ```

- `flatMap()`  

    相当于 `map()` 和 `flat()` 的结合。

    ```js
    let result = [1, 2, 3].flatMap(e => [e ** 2])
    console.log(result)
    ```
