# Object 扩展

ES6 对 `Object` 进行了扩展，提供了很多新的方法，使得对对象的操作更加方便。

- `Object.is()`  

    判断两个值是否完全相等，类似 `===`，但又有差别。

    ```js
    console.log(Object.is(1, 1))
    console.log(Object.is(1, 2))
    console.log(Object.is(NaN, NaN))
    console.log(NaN === NaN)
    ```

- `Object.assign()`   

    合并对象。

    ```js
    let obj1 = {
    name: '1'
    }
    let obj2 = {
    name: '2',
    age: 10
    }
    console.log(Object.assign(obj1, obj2))
    ```

- `Object.keys()`  

    获取对象的所有 `key`，返回一个数组。

    ```js
    let obj = {
    name: 'zs',
    age: 20,
    foo() {

    }
    }
    console.log(Object.keys(obj))
    ```

- `Object.values()`  

    获取对象的所有 `value`，返回一个数组。

    ```js
    let obj = {
    name: 'zs',
    age: 20,
    foo() {

    }
    }
    console.log(Object.keys(obj))
    console.log(Object.values(obj))
    ```

- `Object.entries()`  

    获取对象的 `key-value`，将其每一个封装为数组 (`[key, value]`) ，并返回一个数组 (`[[key1, value1], [key2, value2]]`) 。

    ```js
    let obj = {
    name: 'zs',
    age: 20,
    foo() {

    }
    }
    console.log(Object.entries(obj))
    ```

- 对象转 Map  

    ```js
    let obj = {
    name: 'zs',
    age: 20,
    foo() {

    }
    }
    console.log(new Map(Object.entries(obj)))
    ```

- `Object.fromEntries()`  

    将二维数组转化为对象，或者将 `Map` 转为对象。

    ```js
    // {1: 2, 5: 6}
    console.log(Object.fromEntries([[1,2],[5,6]]))
    // {key: "value"}
    console.log(Object.fromEntries(new Map().set('key', 'value')))
    ```
    