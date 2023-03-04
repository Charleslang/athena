# 模块化

为什么需要模块化？最典型的就是为了阻止多个 js 文件中存在相同的变量，污染了命名空间。

## ES5 中的模块化
```js
// a.js
var moduleA = (function() {
  var obj = {}
  var name = 'zs'
  var age = 23
  
  function sum(a, b) {
    return a + b
  }
  
  sum(10, 20)
  
  obj.name = name
  obj.sum = sum
  return obj
})()
```
```js
// b.js

;(function() {
  moduleA.sum(1, 2)
})()
```

:::warning 注意
上面的前提是 a.js 和 b.js 要同时被引用到同一个 html 文件中，且 a.js 的位置必须在 b.js 之前。
:::

其实，模块化有很多规范，我们可以直接使用，例如 CommonJS、ES6 的 Moudles 等。

## ES6 中的模块化
- `a.js`

  ```js
  // a.js

  var name = 'xiaoming'
  var age = 12
  var flag = true

  function sum (x, y) {
    return x + y
  }

  // 导出方式一 (使用了 ES6 字面量增强)
  export {
    flag, sum
  }
  // 导出方式二
  export var num = 1000
  export function compare(x, y) {
    if (x > y) {
      return x
    }
    return y
  }
  // ES6 中的 class（类）
  export class Person {
    run() {
      console.log('run..')
    }
  }
  // ES5 中的类
  // export function Person() {

  // }
  ```

- `b.js`  

  ```js
  var name = 'xiaohong'
  var age = 30
  var flag = false
  ```

- `c.js`

  ```js
  // 其实下面两种方式的导入是一样的，但是第一种要在 node（webpack） 环境中
  // import {flag,sum} from "./a"
  import { flag, sum } from "./a.js"

  if (flag) {
    console.log('xiaoming是天才')
  }
  console.log(sum(1, 2))

  import {num,compare,Person} from "./a.js"
  console.log(num)
  console.log(compare(1,2))
  const a = new Person();
  a.run()
  ```

- `module.html`

  ```html
  <script src="./js/a.js" type="module"></script>
  <script src="./js/b.js" type="module"></script>
  <script src="./js/c.js" type="module"></script>
  <!-- <script>
    console.log(flag)
  </script> -->
  ```

:::tip 提示
使用上面的语法进行导入时，导入的名字必须和导出的名字保持一致。且 `<script></script>` 的 `type` 必须是 `module`。
:::

使用下面的导入方式时，导入的名字可以不用不用和导出的名字保持一致，即使用 `export default`：
```js
// 一个 js 文件有且仅有一个 export default
const addr = 'beijing'
// export default addr
// 使用 export default 导出函数时，可以省略函数名
export default function (params) {
  console.log(params)
}
```
```js
// 导入 export default 时，可以省略大括号，且名字可以自定义
import add from "./a.js"
add(2)
```
但是，如果我们需要导入文件中的全部内容时，我们可能回写很长一串，那么这时候就需要使用简写了：
```js
// 导入全部 
// as 后面是取的别名，相当于一个对象
import * as myimport from "./a.js"
console.log(myimport.flag, 'flag...')
```
:::tip 小结
1. 只有 `export default` 导出时，才能使用 `import yy from xx`（yy 可以任取，大括号可省）导入，一个文件中只能有一个 `export default`。  
2. 使用 `export` 导出时，使用 `import { yy } from xx` （yy 必须和导出的名字一致，大括号不可省略）导入。
:::
