---
sidebar: ['/portal/advance/ts.html']
---

# TypeScript

## 简介

[TypeScript](https://www.typescriptlang.org/zh/) 是基于 JS 的一种语言, 它在 JS 的基础上做了进一步封装, 使得 JS 从一种弱类型变成了强类型语言。 TS 完全兼容 JS 以及 ES6 语法。

## 环境准备

由于浏览器无法直接运行 TS, 从而需要将 TS 编译成 JS, 然后使用浏览器或者 Node 来运行 JS。

- 安装 Node (此处跳过) 
- NPM 设置
    
  默认情况下, NPM 全局安装的路径在 `C:\Users\DJF\AppData\Roaming\npm\node_modules` 目录下, 我这里把它修改一下。

  ```sh
  ## 查看 NPM 全局根路径
  npm root -g
  
  ## 查看 NPM 全局配置
  npm config ls
  ```
  修改 NPM 全局配置：
  ```sh
  npm config set prefix "D:\soft\node\global_node_modules\global_modules"
  
  npm config set cache "D:\soft\node\global_node_modules\global_cache"
  ```
  修改环境变量 PATH, 如下：
  
  ![2023022823141033.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-28/2023022823141033.png)
    
- 全局安装 typescript

  ```sh
  npm install -g typescript
  ```

- VS Code 安装插件

  1. 在 VS Code 中安装 Code Runner 插件
  
  ![2023022823141125.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-28/2023022823141125.png)
  
  2. 在 `settings.json` 中配置 Code Runner
  
  ```json
  {
    "code-runner.executorMap": {
      // 参考 https://blog.csdn.net/junqing_wu/article/details/103546663
      "typescript": "cd $dir && tsc $fileName && node $dirWithoutTrailingSlash\\$fileNameWithoutExt.js",
    }
  }
  ```
- 代码测试

  ![2023022823141166.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-28/2023022823141166.png)

## 基本语法

### 数据类型

:::tip 参考
1. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)  
2. [掘金小册](https://juejin.cn/post/6994728142845788190)
:::


|类型|关键字|描述|
---|---|---
|字符串|`string`|任意字符串|
|数字|`number`|任意数字, 包括小数|
|布尔|`boolean`|只能是 `true`、`false`|
|字面量||限制该变量就是该字面量 (即常量) |
|任意类型|`any`|任意类型|
|安全的任意类型|`unknown`|安全的 `any`|
|空或 `undefined`|`void`|空或 `undefined`|
|没有值|`never`|不能是任何值|
|对象|`object`|任意对象|
|数据|`array`|任意数组|
|元组|`tuple`|元组, TS 新增类型 (其实就是定长数组) |
|枚举|`enum`|枚举, TS 新增类型|
|`null`|`null`|表示对象值缺失|
|联合类型|`\|`|多个基本类型|

:::tip 注意
1. TS 中的数字不区分 `int`、`float`, 都用 `number` 表示。
2. 类型名称 `String`、`Number` 和 `Boolean` (以大写字母开头) 是合法的, 但指的是一些很少出现在代码中的特殊内置类型。建议始终对类型 `string`、`number`、`boolean` 使用小写形式。
3. `any` 和 `unknown` 的区别请见：[https://www.jianshu.com/p/516fe7cbc9e8](https://www.jianshu.com/p/516fe7cbc9e8)
:::

```ts
/* 基本类型 */
let num: number;
let num = 2; // 与 let num: number; 等价
let num: number = 2.3;
let str: string;

/* --------------------------------------------- */

/* 字面量 */
let a: 10; , 与 const a = 10；等价
let str: 'str1' | 'str2' | 'str3'; // 限制 str 的值只能是 'str1'、'str2'、'str3' 其中的一个, 有点像枚举

/* --------------------------------------------- */

/* 联合类型 */
let variable: number | string | boolean; // variable 只能是 number、string、boolean 其中一种类型
let cc: string & number; // cc 既是 string 类型, 又是 number 类型 (无意义) 
let co: {name: string} & {age: number} // 等价于 let co: {name: string, age: number}
co = {name: 'zs', age: 123} 

/* --------------------------------------------- */

/* any 类型 */
let a: any; // 相当于对变量 a 关闭了类型检测, 相当于 JS 中的变量 (即没有类型) 
let a; // 隐式的 any 类型, 与 let a: any; 相同

/* --------------------------------------------- */

/* unknown 类型 */
// unknown 类型的变量只能赋值给 any 或者 unknown 类型的变量
// 如果想要把 unknown 赋值给其它类型的变量, 那么就必须进行类型检测以缩小范围, 如下：
let d: unknown;
let n: number;

if (typeof d === 'number') {
  n = d;
}

if (d instanceof Number) {
  n = Number(d);
}

// 以下两种方式属于断言
n = d as number;
n = <number> d;

/* --------------------------------------------- */

/* void 主要用于函数返回值 */
function f1() { // 默认为 void

}

function f2(): void {
  
}

/* --------------------------------------------- */

/* object 类型 (JS 中万物皆对象) , 但是不能赋值给基本类型 string、number、boolean */
let obj: object
obj = {}
obj = function() {}

let obj1: {name: string}
obj1 = {name: 'zs'} // obj1 必须有且只能有一个属性, 该属性就是 name

let obj2: {name: string, age?: number} // ? 表示该属性是可选的
obj2 = {name: 'zs'}

// 除了 name 属性是必须的之外, 其它任意属性都是可选的
// [prop: string]: any 中的 prop 只是一个占位符, 可任取
// [prop: string]: any 中的 [prop: string] 表示对象中的属性名是 string 类型
// [prop: string]: any 中的 any 表示剩下的其它属性的值是任意类型的
let obj3: {name: string, [prop: string]: any} 
obj3 = {name: 'zs', age: 12, hobby: [1, 2]}

let fun1: Function // fun1 必须是函数

let fun2: (a: number, b: string) => boolean // fun2 必须是函数, 且有两个参数, 且返回值是 boolean 类型

/* --------------------------------------------- */

/* 数组类型 (这里的数组类型不能直接用 array)  */
let arr1: number[] // 数组里面的值只能是 number 类型
let arr1: Array<number> // 与 let arr1: number[] 等价

/* --------------------------------------------- */

/* 元组 */
let t1: [1, 2, 'hello']

let t2: [string, number]
t2 = ['123', 123] // t2 必须要有且只能有 2 个元素

/* --------------------------------------------- */

/* 枚举 */
enum Sex {
  Male,
  Female
}
/** 等价写法
  enum Sex{
    Male = 0,
    Female = 1
  }
 */ 
let person: {age: Sex}
person = {
  age: Sex.Male
}

/* --------------------------------------------- */

/* 自定义类型 */
type MyType = string
let mm: MyType // 其实就是 string 类型

type CustomType = 1 | 2 | 3;
let cc: CustomType
```
### 函数

这里主要来说函数的入参以及返回值。

```ts
function f1() { // 返回值默认为 void

}

function f2(): void {
  
}

function f21(): void {
  return;
}

function f22(): void {
  return undefined;
}

function f3() { // 返回值默认为 number 类型
  return 123;
}

function f4(): number {
  return 123;
}

function f5(arg: number) { // 返回值默认为 number | string 类型
  if (arg === 1) {
    return 123;
  } else {
    return '456';
  }
}

function f6(arg: number): number | string {
  if (arg === 1) {
    return 123;
  } else {
    return '456';
  }
}

function f6(): never { // never 类型的返回值需要抛出异常
  throw new Error('error');
}
```

## 编译
我们之前也说到过, 浏览器不能直接运行 TS, 我们必须把 TS 编译成 JS, 才能在浏览器上运行。将 TS 编译成 JS 的命令如下：
```sh
tsc test.ts
```

但是, 这样会很麻烦, 我们每次修改 TS 后都需要重新进行编译。我们可以使用下面的命令来实时编译 TS 文件：
```sh
## tsc test.ts --watch
tsc test.ts -w
```
虽然这样可以起到实时编译的作用, 但是这只能适用于单个文件, 如果我同时修改了多个 TS 文件, 那这种方式是不起作用的。那有没有一种办法, 可以监听某个文件夹下面所有的 TS 文件, 然后实时编译它们呢？肯定是有的, 如下。

首先, 我们需要在项目的根目录下新建一个 `tsconfig.json` 配置文件 (可以使用 `tsc --init` 快速创建) , 项目的目录结构看起来像下面这样：
```
app
|-- folder
|   |-- abc.ts
|-- test.ts
|-- tsconfig.json
```
如果我们使用 `tsc --init` 来初始化 `tsconfig.json` 文件, 那么生成的文件中的内容如下：
```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs",                                /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": true,                                      /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```
其实, 我们完全可以把 `tsconfig.json` 文件中的内容全部删掉, 看起来这个文件就像下面这个样子：
```json
{
    
}
```
然后, 我们在 `tsconfig.json` 的同级目录执行 `tsc` 命令, 即可一键编译所有 ts 文件。

`tsconfig.json` 的部分配置参考如下：
```json
{
  // 指定哪些 ts 文件被编译成 js 文件, 默认值为 **/*
  "include": [
    // src 下的任意文件(** 表示任意目录, * 表示任意文件)
    "./src/**/*" 
  ],
  // 排除某些 ts 文件, 默认值为 ["node_modules", "bower_components", "jspm_packages"]
  "exclude": [
    "./src/foo/**/*"
  ],
  // 继承某个配置文件中的内容
  "extends": "./config/config.json",
  // 指定要编译的具体文件, 一般都使用 include
  // "files": [
  //   "abc.ts",
  //   "test.ts"
  // ],
  // 编译器选项
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Language and Environment */
    // ts 被编译成哪个版本的 js
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */

    /* Modules */
    // 编译成 js 后使用的模块化规范, 可选值如下
    // 'none', 'commonjs', 'amd', 'system', 'umd', 'es6', 'es2015', 'es2020', 'es2022', 'esnext', 'node16', 'nodenext'
    "module": "es6",                                /* Specify what module code is generated. */

    /* JavaScript Support */
    // 是否对 js 文件进行编译 (常用于项目中既有 js, 又有 ts) 
    "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // 是否对 js 文件中的语法进行检查 (仅针对自己写的 js, 不包含打包后生成的 js) 
    "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    

    /* Emit */
    // 将编译后的所有 js 合并到一个文件中, 但是仅支持 module 配置为 'amd' or 'system'
    "outFile": "./app.js",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // 编译后的 js 放在哪个文件夹下
    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
    // 编译时是否删除代码中的注释
    "removeComments": true,                           /* Disable emitting comments. */
    // 执行编译, 但是不生成文件
    "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // 编译出错时, 不生成文件
    "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */

    /* Interop Constraints */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    // 将所有检查都开启, 如果启用了这个选项, 那么其它的检查配置都可以不用设置了
    "strict": true,                                      /* Enable all strict type-checking options. */
    // 不允许出现隐式的 any 类型, 即变量必须要显示指定类型
    "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // 严格地检查变量是否为 null
    "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */

    
    // 不允许不明确的 this
    "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    
    // 编译后的 js 文件是否使用严格模式。
    // 如果在 ts 中使用了 import 语句, 那么编译后的 js 文件就是使用严格模式
    "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */

    /* Completeness */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```
## Webpack 打包 TS

首先, 在项目的根路径中执行 `npm init -y` 初始化 webpack 以生成 `package.json` 配置文件。


## 面向对象
### 类

- 变量

```ts
class Person {

  // 示例属性
  name: string = 'zs'
  // 静态属性
  static age: number = 23
  // 只读属性
  readonly hobby: string[] = ['篮球', '足球']
  readonly height: string = '172'
  // static 需要放在 readonly 前面
  static readonly height: string = '172'
}

let person = new Person()
console.log(person.name)
// 静态属性只能通过类来调用, 不用通过对象来调用
console.log(Person.age) 
// 编译报错, 普通数据类型如果使用 readonly, 在不能修改
person.height = '123'
// 对象类型使用 readonly 时, 不修改地址就可以了
person.hobby[2] = '乒乓球'
```
- 函数

```ts
class Person {

  // 实例属性
  name: string = 'zs'
  // 静态属性
  static age: number = 23
  // 只读属性
  readonly hobby: string[] = ['篮球', '足球']
  readonly height: string = '172'
  // static 需要放在 readonly 前面
  static readonly height: string = '172'

  // 实例方法
  sayHello() {
    console.log('hello')
  }
  // 静态方法
  static sayBye() {
    console.log('bye')
  }
}

let person = new Person()
console.log(person.name)
console.log(Person.age) // 静态属性只能通过类型来调用, 不用通过对象来调用
// 编译报错, 普通数据类型如果使用 readonly, 在不能修改
person.height = '123'
// 对象类型使用 readonly 时, 不修改地址就可以了
person.hobby[2] = '乒乓球'

person.sayHello()
// 静态方法只能通过类调用
Person.sayBye()
```
- 构造方法

```ts
class Dog {

  // 如果没有使用 eslint 或者严格模式, 那么其实可以不用在类中定义这两个变量
  // 因为在 js 中, 如果对象中没有这个属性, 那么在赋值时会自动添加这个属性
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  say() {
    console.log('哈哈');
  }
}

const dog = new Dog('旺财', 1)
```
### 继承

- 示例 1

```ts
class Person {

  name: string
  age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  say(): void {
    console.log('Person say')
  }
}

class XiaoMing extends Person {

  height: string
  
  // 子类的构造器中必须使用 super 来调用父类的构造器
  constructor(name, age, height) {
    super(name, age)
    this.height = height
  }
  
  // 重写父类的 say
  say(): void {
    console.log('小明 say')
  }
}

const xm = new XiaoMing('小明', 12, '172')
xm.say()
```

- `super` 关键字

```ts
class Person {

  name: string
  age: number
  public money: number
  protected address: string
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  public say(): void {
    console.log('Person say')
  }
}

class XiaoMing extends Person {

  height: string
  
  constructor(name, age, height) {
    super(name, age)
    this.height = height
  }
  
  // 重写父类的 say
  public say(): void {
    super.say()
    console.log('小明 say')
    this.money = 123
    this.address = '成都'
  }
}

const xm = new XiaoMing('小明', 12, '172')
xm.say()
```
### 抽象类
- 示例 1
```ts
abstract class Person {
  name: string
  
  constructor(name: string) {
    this.name = name
  }
}

class XM extends Person {
  constructor(name) {
    super(name)
  }
}

const xm = new XM('小梦')
// 编译报错, 抽象类无法实例化
new Person('person')
```
- 抽象方法
```ts
abstract class Person {
  name: string
  
  constructor(name: string) {
    this.name = name
  }
  
  say() {
    console.log('person say')
  }
  
  abstract dealData(): void
}

class XM extends Person {

  constructor(name) {
    super(name)
  }
  
  // 必须重写抽象方法
  dealData(): void {
    console.log('xm')
  }
}

const xm = new XM('小梦')
```
### 接口
- 示例 1
```ts
interface myInterface {
  name: string
  age: number
}

const variable: myInterface = {
  name: 'zs',
  age: 13
}

// 此时 myInterface 相当于 type, 等价写法如下
type myType =  {
  name: string
  age: number
}

const variable1: myType = {
  name: 'zs',
  age: 13
}
```
- 示例 2
```ts
// 接口可以重复定义, 最终结果相当于把所有东西放在一起
interface myInterface {
  name: string
  age: number
}

interface myInterface {
  gender: number
}

const variable: myInterface = {
  name: 'zs',
  age: 13,
  gender: 1
}

// type 不能重复定义
```
- 示例 3
```ts
// 接口中的属性不能赋初值
// 接口中的方法只能是抽象方法
interface myInterface {
  name: string
  age: number
  
  // 方法不能用 abstract 修饰
  sayHello(): void
}

class Person implements myInterface {
  name: string
  age: number
  
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  
  sayHello(): void {
    cconsole.log('hello')
  }
}
```
### 封装

|修饰符|作用域|
|---|---|
|`public` (默认) |任何地方都可以直接使用|
|`protected`|只能在当前类和子类中使用|
|`private`|只能在该类中使用|

- 示例 1

```ts
class Person {
  private name: string
  private age: number

  // 也可以使用 ## 来表示私有属性
  #height: string

  constructor(name: string, age: number, height) {
    this.name = name
    this.age = age
    this.#height = height
  }

  // 添加 set/get 方法供外部使用
  getName(): string {
    return this.name
  }

  setName(name: string): void {
    this.name = name
  }

  // 也可以通过下面这种方法来提供 set/get 方法
  get height() {
    return this.#height
  }

  set height(value) {
    this.#height = value
  }
}

const person = new Person('zs', 12, 'ww')
person.setName('zs1')
// 获取 height 的值
console.log(person.height)
// 给 height 赋值
person.height = '172'
```
- 示例 2
```ts
class Student {

  // 此种写法相当于已经给 name 和 age 赋值了
  // 但是, 这要求在属性名前面必须加上修饰符
  constructor(public name: string, public age: number) {

  }
}

// 等价写法如下
class Student {
  name: string
  age: number

  constructor(name: string, age: number, height) {
    this.name = name
    this.age = age
  }
}

const ww = new Student('ww', 123)
```

### 泛型

泛型一般用于类型不明确的场景。

- 示例 1

```ts
// 泛型方法
function fun <T> (param: T): T {
  return param
}

// a 的类型必须是 string, 因为 fun 的入参为 string 类型
const a: string = fun('hello')

// 有时候, 我们的泛型写得比较复杂, ts 无法自动推断, 这时我们可以显示指定类型
const b: string = fun<string>('hello')

const c: number = fun(123)
```

- 示例 2

```ts
function fun2<K, V> (a: K, b: V): K {
  return a
}
```
- 示例 3
```ts
// 入参类型必须是 Circle 的实现类
function fun3<T extends Circle>(s: T): number {
  return 12
}
```
- 示例 4
```ts
interface MyType {
  length: number
}

function fun5<T extends MyType>(s: T): number {
  return 12
}

// 入参是字符串 '123', 字符串中有 length 属性, 所以可以
fun5('123')

// 入参是数值 123, 数值中没有 length 属性, 所以编译报错
fun5(123)
```
- 示例 5
```ts
class Person<T> {
  name: T
  constructor(name: T) {
    this.name = name
  }
}

// <string> 可省略
new Person<string>('123')
```
