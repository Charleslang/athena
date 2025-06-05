# 模块化

ES6 引入了模块化的概念，模块化是指将代码分割成独立的文件或模块，每个模块都有自己的作用域和功能。这样可以提高代码的可维护性和可重用性。其实在 ES6 以前，JavaScript 就有模块化的概念，它是通过 CommonJS 和 AMD 等规范实现的。ES6 的模块化是通过 `import` 和 `export` 关键字来实现的，提供了更为标准和简洁的语法。

## export 和 import

- 分别导出

    ```js
    // a.js
    export let phone = 'xiaomi'

    export function foo() {
    console.log('123')
    }
    ```
    ```html
    <script type="module">
    import * as ma from './a.js'

    ma.foo()
    console.log(ma.phone)
    </script>
    ```
    
    注意，VS Code 要在 live serve 下运行。

- 统一导出  

    ```js
    let phone = 'xiaomi'

    function foo() {
    console.log('123')
    }

    export {phone, foo}
    ```

- 默认导出

    一个文件中只能有一个默认导出。

    ```js
    export default {
    name: '123',
    foo() {
        console.log('hello')
    }
    }
    ```

- 解构赋值  

    ```js
    import { foo, bar } from 'xxx'
    import { foo as foo1, bar } from 'xxx'

    // 针对默认导出
    import { default as a} from './a.js'
    ```
    
    注意，并不是所有浏览器都支持 ES6，所以通常要用 Babel 将其转换为 ES5 的语法。

## Babel

Babel 是一个 JavaScript 编译器，可以将 ES6+ 的代码转换为向后兼容的 JavaScript 代码，以便在旧版本的浏览器或环境中运行。Babel 支持将 ES6 模块化语法转换为 CommonJS 或 AMD 等模块化规范。

本地安装 babel-preset-es2015 和 babel-cli：

```sh
npm install --save-dev babel-cli babel-preset-es2015
```

项目根目录新建 `.babelrc` 文件，输入以下内容：

```json
{
  "presets":[
    "es2015"
  ],
  "plugins":[]
}
```

:::tip 提示
转换请参考 [https://www.jianshu.com/p/701a48c81371](https://www.jianshu.com/p/701a48c81371)。但是在转了之后，浏览器还是无法识别，因为有 CommonJS，所以还需要下载 browserify。
:::
