# Map  

`Map` 类似于对象，它也是键值对集合，但是它的键可以是任意类型。常用方法如下：

- `size()` 

    返回元素个数。

- `set()`  

    添加新的元素，并返回当前 Map，因此可链式调用。

- `get()`  

    通过 `key` 获取 `value`。

- `has()`  

    是否含有某个元素，返回 `boolean`。

- `clear()`  

    清空元素，返回 `undefined`。

```js
let map = new Map()
map.set('name', 'zs').set('age', 13).set({name:'obj'}, [1,2])
console.log(map)

let name = map.get('name')
console.log(name)
```
