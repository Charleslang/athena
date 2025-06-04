# 数组

数组（Array）也是一个对象，使用 `typeof` 检查数组会返回 "object"。

## 创建数组

- 方式一

  ```js
  var arr = new Array();
  arr[0] = 10;
  arr[1] = 'xx';
  console.log(arr);

  var arr2 = new Array(10,20,30);
  ```

- 方式二  

  使用字面量创建数组：

  ```js
  var arr = [];

  var arr2 = [1,2.3];
  ```

- 两者的区别

  ```js
  var arr1 = [10];
  var arr2 = new Array(10);
  console.log(arr1[0]); // 10
  console.log(arr1.length); // 1
  console.log(arr2[0]); // undefined
  console.log(arr2.length); // 10
  ```

## 数组赋值

数组本身是一个对象，所以，对象的复制方式对数组也适用。

```js
arr[1] = 0;

// 此方式也行，但是不推荐
arr.hello = '123';
```

数组的元素可以是任意（函数、数组等等都可）数据类型。

```js
var arr = [function() {}];
// 调用
arr[0]();
```

## 常用属性及方法

### array.length

对于连续的数组来讲，`length` 属性可以设置或返回数组长度。所谓连续的数组就是指，数组中的索引值是连续的。

- 获取 

  ```js
  // arr数组不连续
  var arr = new Array();
  arr[0] = 1;
  arr[2] = 2;
  console.log(arr.length); // 3
  // arr数组连续
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  console.log(arr.length); // 2
  ```

- 修改

  ```js
  // 情况 1
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  arr.length = 20;
  console.log(arr);
  console.log(arr.length); // 20

  // 情况 2
  var arr = new Array();
  arr[0] = 1;
  arr[1] = 2;
  arr[2] = 2;
  arr[3] = 2;
  arr[4] = 2;
  arr[5] = 2;
  arr.length = 3;
  console.log(arr); // 只会输出前 3 个
  console.log(arr.length); // 3
  ```
### push()

向数组末尾添加一个或多个元素，并返回数组的新长度。

```js
var arr1 = [1,2,3];
var length = arr1.push(6,5,'mm');
console.log(arr1);
console.log(length);
```
### pop()

删除最后一个元素，并返回数组被删除的元素。

```js
var item = arr1.pop();
console.log(arr1);
console.log(item);
```

### unshift()

在数组开头插入元素，并返回数组的新的长度。

```js
result = arr1.unshift('u1','u2');
console.log(arr1);
console.log(result);
```

### shift()

删除数组的第一个元素，并返回被删除的元素。

:::warning 索引越界
在 JavaScript 中，如果索引越界，不会报错，会返回 `undefined`。

```js
var arr = new Array();
arr[0] = 10;
arr[1] = 'xx';
console.log(arr[6]); // undefined
```
:::

### forEach()

遍历数组，该方法只适用于 IE9 及以上的浏览器。因此，使用频率没有 for 循环高。该方法需要一个函数作为参数，该函数由我们创建，但是不由我们调用（由浏览器调用），传入的函数就称为回调函数。

```js
[1,2,3,4,5].forEach(function(ele) {
  console.log(ele);
});

// 箭头函数
arr.forEach(ele => {
  console.log(ele);
});
```

:::tip 回调函数的参数
回调函数可以有三个参数，第一个表示当前数组遍历出的元素，第二个表示索引，第三个表示当前正在遍历的对象。

```js
var array = [1, 2, 3, 4, 5];
array.forEach(function(ele, i, obj) {
  console.log(ele);
  console.log("索引: "+i);
  console.log(obj = array);
});
```
:::

### slice()

从某个已有的数组返回选定范围的元素。有两个参数，第一个表示开始截取的下标（包含），第二个表示结束的下标（不包含）。

```js
var array = [1,2,3];
var subArray = array.slice(0,array.length - 1);
console.log(subArray); // [1, 2]
```

:::tip 特殊用法
如果参数是负数，则会给参数自动加上数组的长度，然后再截取，如果截取过程的范围不存在，则返回空数组（`[]`）。第二个参数可以不写，默认就是截取到最后一个。
:::

### splice()

删除元素，并向数组添加新元素，返回被删除的元素（以数组形式）。该方法可以有三个参数，第一个参数表示删除的起始位置，第二个参数表示要删除的数量，第三个及以后参数可选，表示从删除的起始位置插入新的元素。

```js
var array = [1, 2, 3];
var d = array.splice(1, 2, 10, 11);
console.log(array);
console.log(d);
```

:::danger 注意
**该方法会影响原数组！**
:::

:::tip 技巧
该方法可以有多重作用：   

- 替换元素
- 删除元素（只有前两个参数）
- 插入元素（第二个参数为 0）
:::

:::details 数组去重

结合 `slice()` 和 `splice()` 方法。

```js
var myArray = [1, 2, 5, 8, 10, 5, 6, 2, 7, 8];
// 数组去重
function clearArray(arr) {
  var copyArr = [];
  if (arr.length > 1) {
    // 复制数组
    copyArr = arr.slice(0);
    for (var i = 0; i < copyArr.length - 1; i++) {
      for (var j = i + 1; j < copyArr.length; j++) {
        if (copyArr[i] === copyArr[j]) {
          // 去重
          copyArr.splice(j, 1);
          // 解决连续相同的元素，删除后需要再次比较该位置
          j--;
        }
      }
    }
  }
  return copyArr;
}
var arr = clearArray(myArray);
console.log("去重前: "+myArray);
console.log("去重后: "+arr);
```
:::

### concat()

连接两个或多个数组，并返回结果。

```js
var conArray1 = [1, 2, 3];
var conArray2 = [4, 5, 6];
var conArray = conArray1.concat(conArray2,"123456");
console.log(conArray1);
console.log(conArray);
```

### join()

把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔（参数可省，默认是逗号），并返回字符串。

```js
conArray = [1, 2, 3, 5, 6, 7];
var s = conArray.join('-');
console.log(s); // 1-2-3-5-6-7
console.log(conArray);
```

### reverse()

颠倒数组中元素的顺序，**该方法对原数组有影响**。

### sort()

对数组的元素进行排序，**该方法对原数组有影响**。该方法的参数是一个函数。  

`sort()` 方法没有参数时，默认是升序（按照**unicode编码**进行升序，特别是对于数字来讲，可能得到错误的结果，如 11 会排在 2 的前面）排序。所以，一般需要带上回调函数来指定排序规则。  

回调函数的两个参数就是数组正在比较的两个元素。并且，第一个参数在数组中的位置一定是在第二个参数的前面。  

浏览器会根据回调函数的返回值来进行排序。如果返回值大于 0，则两个元素交换位置（**类似**升序）；反之，不交换顺序。如果返回零，则表示两个数相等，也不交换位置。

```js
var sortArray = [1, 2, 3, 26, 3, 6, 11];
sortArray.sort(function(a,b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
  // 或者直接使用 a - b 或 b - a
  // return a - b;
});
console.log(sortArray);
```

- **改进**  
    
    - 升序 

    ```js
    sortArray.sort(function(a,b) {
      return a - b;
    });
    ```

    - 降序  

    ```js
    sortArray.sort(function(a,b) {
      return b - a;
    });
    ```

:::tip 补充
数组的更多用法请见 [w3cSchool](https://www.w3school.com.cn/jsref/jsref_obj_array.asp)
:::
