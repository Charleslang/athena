# 组件化

**什么是组件化？**

可以简单理解为模块。 

**为什么需要组件化？**

如果我们将所有逻辑都放在一个页面中，那么处理起来就会显得非常复杂，而且不利于管理和维护。因此，需要使用组件化将页面拆分成一个个独立的模块。另外，使用组件可以提高代码的复用。

:::warning 注意
所有组件都继承自 Vue 的原型（prototype），这个知识点在后面的学习过程中将会被使用到。
:::

## 组件注册步骤

1. 创建组件  
2. 注册组件
3. 使用组件

```html
<div id="app">
  <!-- 3.使用组件，必须在 Vue 实例的范围之内 -->
  <!-- 会直接显示组件中的内容 -->
  <my-cpn></my-cpn>
</div>
```
```js
// 1.创建组件构造器对象
const myCpn = Vue.extend({
  template: 
    `<div>
        <h3>你好</h3>
        <p>我是内容</p>
    </div>`
})
// 2.注册组件
// 第一个参数是以什么方式来使用组件（组件的标签名）
// 第二个参数是刚才创建的组件构造器
Vue.component('my-cpn'，myCpn)
const app = new Vue({
  el: '#app',
})
```
:::tip 提示
一般来讲，在使用自定义的组件时，标签建议使用 PascalCase 的形式，如果组件中间没有内容，那么组件可以写成单标签。
:::

:::warning 警告
组件必须要在 Vue 实例中使用。且组件中只能有一个根节点 (仅对 Vue2 来讲，Vue3 中可以有多个根节点)。
:::

## 全局组件与局部组件

**全局组件**

通过 `Vue.component()`  注册的组件都是全局组件，这意味着我们可以在多个 Vue 实例下使用这个组件。
```html
<div id="app2">
  <my-cpn></my-cpn>
  <div>
    <my-cpn></my-cpn>
  </div>
</div>
<div id="app">
  <!-- 使用组件，必须在 Vue 实例的范围之内 -->
  <my-cpn></my-cpn>
</div>
```
```js
const myCpn = Vue.extend({
  template: 
    `<div>
        <h3>你好</h3>
        <p>我是内容</p>
    </div>`
})
Vue.component('my-cpn'，myCpn)
const app = new Vue({
  el: '#app'
})
const app2 = new Vue({
  el: '#app2'
})
```
**局部组件**

在某个 Vue 实例中注册的组件就是局部组件，该组件只能在对应的 Vue 实例中使用。
```html
<div id="app">
  <cpn></cpn>
</div>
```
```js
// 创建组件构造器对象
const myCpn = Vue.extend({
  template: 
    `<div>
        <h3>你好</h3>
        <p>我是内容</p>
    </div>`
})
const app = new Vue({
  el: '#app',
  data: {

  },
  components: {
    // 注册组件
    // 组件的标签名就是 cpn
    cpn: myCpn
  }
})
```
:::tip 小贴士
在开发过程中，一般都只创建一个 Vue 实例，且大多数都是局部组件。
:::

## 父子组件

创建父子组件的原理就是在一个组件中注册另一个组件。

```html
<div id="app">
  <cpn2></cpn2>
  <!-- 在这里就不能使用 cpn1 组件了，否则报错 Unkown custom template -->
  <!-- 如果想继续使用 cpn1 组件，那么就必须在该实例或全局中注册该组件 -->
</div>
```
```js
// 创建第一个组件
const cpn1 = Vue.extend({
  template: 
    `<div>
        <p>hello</p>
        <span>world</span>
        <h3>Vue</h3>
    </div>`
})
// 创建第二个组件
// cpn2 是父组件，cpn1 是子组件
const cpn2 = Vue.extend({
  template: 
    `<div>
        <p>hello2</p>
        <span>world2</span>
        <h3>Vue</h3>
        <!-- 使用组件 -->
        <cpn1></cpn1>
    </div>`,
  // 注册组件
  components: {
    cpn1: cpn1
  }
})
const app = new Vue({
  el: '#app',
  components: {
    cpn2: cpn2
  }
})
```

## 组件语法糖
主要是省略了 `Vue.extend()`，但是底层还是会调用这个方法。

- 全局组件  

  ```html
  <div id="app">
  <cpn></cpn>
  </div>
  ```
  ```js
  // 语法糖，全局组件
  Vue.component('cpn',{
    template: 
      `<div>
        <h3>你好</h3>
        <p>我是内容</p>
      </div>`
  })
  const app = new Vue({
    el: '#app'
  })
  ```

- 局部组件  

  ```html
  <div id="app">
    <cpn2></cpn2>
  </div>
  ```
  ```js
  const app = new Vue({
    el: '#app',
    // 局部组件
    components: {
      cpn2: {
        template: 
          `<div>
            <h3>你好</h3>
            <p>我是xxxxxx内容</p>
          </div>`
      }
    }
  })
  ```
## 组件模板

为了让我们的代码更清晰，我们可以将这些组件抽离出来，成为单独的模板，然后在注册组件时将模板进行注册即可。

- 方式一  

  ```html
  <div id="app">
    <cp></cp>
  </div>
  <!-- 创建模板，类型必须是 type="text/x-template" -->
  <script type="text/x-template" id="cpn">
    <div>
      <h2>标题</h2>
      <p>内容</p>
    </div>
  </script>
  ```
  ```js
  Vue.component('cp'，{
    template: '#cpn'
  })
  ```

- 方式二  

  ```html
  <div id="app">
    <cp></cp>
  </div>
  <!-- 创建模板，方式二 -->
  <template id="cpn">
    <!-- 此方式中，只能有一个根标签 -->
    <div>
      <p>xxxx</p>
      <p>llllll</p>
    </div>
  </template>
  ```
  ```js
  Vue.component('cp'，{
    template: '#cpn'
  })
  ```
## 在组件中访问数据

组件不能直接访问 Vue 实例中数据，即使能访问，但是也不要这么写，因为这样会造成 Vue 实例十分臃肿。其实，组件中也有 data 属性，但是这个 data 必须是一个**函数**。

```html
<div id="app">
  <cp></cp>
</div>
<template id="cpn">
  <!-- 此方式中，只能有一个根标签 -->
  <div>
    <p>{{ mes }}</p>
    <p>llllll</p>
  </div>
</template>
```
```js
Vue.component('cp'，{
  template: '#cpn',
  // data: function() {
  //     return {
  //         mes: 'nnnnn'
  //     }
  // }
  data() {
    return {
      mes: 'nnnnn'
    }
  }
})
```
那么，为什么要把组件中的 data 设置成函数呢？其实是为了防止多个组件之间的数据冲突。设置成为函数，每次返回的都是一个新的对象，它们的内存地址不同，互不相扰。
```html
<div id="app">
  <cp></cp>
  <cp></cp>
  <cp></cp>
</div>
<template id="cpn">
  <div>
    <h2>当前计数：{{ count }}</h2>
    <button @click="reduce">-</button>
    <button @click="add">+</button>
  </div>
</template>
```
```js
Vue.component('cp',{
  template: '#cpn',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    add() {
      this.count++
    },
    reduce() {
      this.count--
    }
  }
})
const app = new Vue({
  el: '#app'
})
```
那么，可不可以让组件之间共享数据呢？肯定是可以的，但是不建议这么使用。
```js
var obj = {count:0}
Vue.component('cp',{
  template: '#cpn',
  data() {
    return obj
  }
})
```
:::danger 警告
组件的设计是为了复用，所以，千万不要在组件之间共享同一个数据对象。
:::

## 组件通信
在开发过程中，我们经常会在组件之间进行数据传递。通常，我们会在根组件中发送网络请求，然后再将得到的数据传递给子组件。那么，如何进行通信呢？下面介绍两种方式。

**1. 通过 props 向子组件传递数据**

该方法适用于父组件向子组件传递数据。

```html
<div id="app">
  <!-- 使用 props 传递父组件的 roles -->
  <!-- 如果不使用 v-bind，则会把 roles 和 mes 当成字符串传递到子组件的变量中 -->
  <cpn :croles="roles" :cmes="mes"></cpn>
</div>
<template id="cpn">
  <div>
    {{ cmes }}
    <ul>
      <li v-for="e in croles">{{ e }}</li>
    </ul>
  </div>
</template>
```
```js
const cpn = {
  template: '#cpn',
  // 接收父组件的 roles，并保存到变量 croles 中
  // 接收父组件的 mes，并保存到变量 cmes 中
  props: ['croles'，'cmes']
}
const app = new Vue({
  el: '#app',
  data: {
    mes: 'hello',
    roles: ['焰灵姬','田密','晓梦','紫女','弄玉']
  },
  components: {
    // ES6 字面量增强语法
    cpn
  }
})
```
上面的代码中，子组件的 props 使用的是数组形式，其实也可以使用对象，一般在开发过程中对象形式较为常用，而且对象的方式更加强大（可以指定数据类型）。

```js
const cpn = {
  template: '#cpn',
  // 接收父组件的 roles，并保存到变量 croles 中
  // 接收父组件的 mes，并保存到变量 cmes 中
  // props: ['croles'，'cmes']
  props: {
    // 指定 croles 为数组
    croles: Array,
    // 指定 cmes 为 String 类型
    cmes: String
  }
}
```
props 支持的类型有（只列举了一部分）`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`。当然，还可以为 props 中的数据设置默认值：
```js
props: {
  // 指定 croles 为数组
  croles: {
    type: Array,
    // 使用此方式的默认值在 Vue 2.5.x 之后会报错
    // default: []
  },
  // 指定 cmes 为 String 类型
  cmes: {
    type: String,
    default: '默认值'，
    // 该字段在父传子时是必须要传的
    required: true
  }
}
```
数组和对象的默认值必须是工厂函数，否则报错，如下：
```txt
Invalid default value for prop "croles": 
Props with type Object/Array must use a factory function to return the default value.
```
修改如下：
```js
croles: {
  type: Array,
  /*default: function() {
      return []
  }*/
  default() {
    return []
  }
},
```
**父传子中的驼峰标识**  

在子组件中，如果变量名使用的是驼峰命名，那么在获取值时会获取不到，并且程序运行之后会发出警告：使用 - 来代替驼峰（因为 HTML 标签中不区分大小写）。
```html
<div id="app">
  <!-- 使用 - 来代替驼峰 -->
  <cpn :user-info="info"></cpn>
</div>
<template id="cpn">
  <div>
    <p>{{ userInfo }}</p>
  </div>
</template>
```
```js
const cpn = {
  template: '#cpn',
  props: {
    /*'user-info': {
        type: Object,
        default() {
            return {}
        }
    }*/
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
const app = new Vue({
  el: '#app',
  data: {
    info: {
      name: 'zs',
      age: 10,
      height: 1.88
    }
  },
  components: {
    cpn
  }
})
```
**2. 通过事件向父组件发送消息**  

相当于子传父，通过 `$emit()` 向父组件发送自定义事件。

```html
<div id="app">
  <!-- 将驼峰改为 - ，或者不使用驼峰-->
  <!-- 如果这里没有参数，则会默认传递子组件中传递的参数（即 this.$emit()的第二个参数） -->
  <!-- 在父组件中接收子组件的自定义事件 itemclick，即 this.$emit()的第一个参数 -->
  <!-- 然后在父组件中定义该事件的方法（即这里的 cpnClick） -->
  <cpn @itemclick="cpnClick"></cpn>
</div>
<template id="cpn">
  <div>
    <button v-for="(e，i) in categories" :key="i" @click="btnClick(e)">{{ e.name }}</button>
  </div>
</template>
```
```js
const cpn = {
  template: '#cpn',
  data() {
    return {
      categories: [
        { id: 'ca'，name: '推荐产品' },
        { id: 'cb'，name: '手机数码' },
        { id: 'cc'，name: '生活用品' },
        { id: 'cd'，name: '家用家电' },
        { id: 'ce'，name: '电脑办公' },
      ]
    }
  },
  methods: {
    btnClick(item) {
      // 将子组件中事件发送给父组件
      // 第一个参数是自定义的函数名，第二个是向函数中传递的参数
      // 使用驼峰会监听不到事件？
      this.$emit('itemclick'，item)
    }
  }
}
const app = new Vue({
    el: '#app',
    data: {

    },
    components: {
      cpn
    },
    methods: {
      cpnClick(item) {
        console.log(item)
      }
    }
})
```
父子组件计数器： 

```html
<div id="app">
    <cpn @reduce="freduce" @add="fadd" :counter="fcounter"></cpn>
</div>
<template id="cpn">
  <div>
    <p>当前计数{{ counter }}</p>
    <button @click="reduce">-</button>
    <button @click="add">+</button>
  </div>
</template>
```
```js
const cpn = {
  template: '#cpn',
  props: {
    counter: {
      type: Number,
      default: 0
    }
  },
  methods: {
    reduce() {
      this.$emit('reduce')
    },
    add() {
      this.$emit('add')
    }
  }
}
const app = new Vue({
  el: '#app',
  data: {
    fcounter: 6
  },
  components: {
    cpn
  },
  methods: {
    freduce () {
      this.fcounter--
    },
    fadd() {
      this.fcounter++
    }
  }
})
```
优化如下：
```html
<div id="app">
  {{ counter }}
  <cpn @reduce="change" @add="change"></cpn>
</div>
<template id="cpn">
  <div>
    <button @click="reduce">-</button>
    <button @click="add">+</button>
  </div>
</template>
```
```js
const cpn = {
  template: '#cpn',
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    reduce() {
      this.$emit('reduce'，--this.counter)
    },
    add() {
      this.$emit('add'，++this.counter)
    }
  }
}
const app = new Vue({
  el: '#app',
  data: {
    counter: 0
  },
  components: {
    cpn
  },
  methods: {
    change(counter) {
      this.counter = counter
    }
  }
})
```
## 在组件中使用 `v-model`
当子组件中使用 `v-model` 改变从父组件传过来的值时，会报错，代码如下：
```html
<div id="app">
  <cpn :number1="num1" :number2="num2"></cpn>
</div>
<template id="cpn">
  <div>
    <p>{{ number1 }}</p>
    <input type="text" v-model="number1">
    <p>{{ number2 }}</p>
    <input type="text" v-model="number2">
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num1: 1,
    num2: 2
  },
  components: {
    cpn: {
      template: '#cpn',
      props: {
        number1: Number,
        number2: Number
      }
    }
  }
})
```
错误信息如下：
```txt
Instead，use a data or computed property based on the prop's value
```
从错误信息可以知道，我们应该使用 `data()` 或 `computed` 来代替，修改如下：
```html
<div id="app">
  <cpn :number1="num1" :number2="num2"></cpn>
</div>
<template id="cpn">
  <div>
    <p>props:{{ number1 }}-data:{{ n1 }}</p>
    <input type="text" v-model="n1">
    <p>props:{{ number2 }}-data:{{ n2 }}</p>
    <input type="text" v-model="n2">
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num1: 1,
    num2: 2
  },
  components: {
    cpn: {
      template: '#cpn',
      props: {
        number1: Number,
        number2: Number
      },
      data() {
        return {
          n1: this.number1,
          n2: this.number2
        }
      }
    }
  }
})
```
但是，如果我们要同时反向修改父组件的值呢？这时只需要将 `v-model` 进行拆分（拆成 `v-value` 和 `v-on:input`）即可，如下：
```html
<div id="app">
  num1:{{num1}} -> num2:{{ num2 }}
  <cpn :number1="Number(num1)" :number2="Number(num2)" @c1="fc1" @c2="fc2"></cpn>
</div>
<template id="cpn">
  <div>
    <p>props:{{ number1 }}-data:{{ n1 }}</p>
    <input type="text" :value="n1" @input="change1">
    <p>props:{{ number2 }}-data:{{ n2 }}</p>
    <input type="text" :value="n2" @input="change2">
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
      num1: 1,
      num2: 2
  },
  components: {
    cpn: {
      template: '#cpn',
      props: {
        number1: Number,
        number2: Number
      },
      data() {
        return {
          n1: this.number1,
          n2: this.number2
        }
      },
      methods: {
        change1() {
          this.n1 = event.target.value
          this.$emit('c1'，this.n1)
          // 使 n2 永远是 n1 的 100 倍
          this.n2 = this.n1 * 100
          this.$emit('c2'，this.n2)
        },
        change2() {
          this.n2 = event.target.value
          this.$emit('c2'，this.n2)
          // 使 n1 永远是 n2 的 1/100
          this.n1 = this.n2 / 100
          this.$emit('c1'，this.n1)
        }
      }
    }
  },
  methods: {
    fc1(num1) {
      this.num1 = num1
    },
    fc2(num2) {
      this.num2 = num2
    }
  }
})
```
下面介绍一个简化的写法，使用 `watch` 来监听变化:
```html
<div id="app">
  {{ num1 }}------{{ num2 }}
  <cpn :number1="num1" :number2="num2" @ch1="c1" @ch2="c2"></cpn>
</div>
<template id="cpn">
  <div>
    <p>props:{{ number1 }}-data:{{ n1 }}</p>
    <input type="text" v-model="n1">
    <p>props:{{ number2 }}-data:{{ n2 }}</p>
    <input type="text" v-model="n2">
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num1: 1,
    num2: 2
  },
  components: {
    cpn: {
      template: '#cpn',
      props: {
        number1: Number,
        number2: Number
      },
      data() {
        return {
          n1: this.number1,
          n2: this.number2
        }
      },
      watch: {
        // 新的值就被自动封装在了方法的第一个参数中
        // 方法名就是要监听的属性的名字
        n1(newValue，oldValue) {
          this.n2 = newValue * 100
          this.$emit('ch1'，newValue)
        },
        n2(newValue) {
          this.n1 = newValue / 100
          this.$emit('ch2'，newValue)
        }
      }
    }
  },
  methods: {
    c1(v) {
      this.num1 = Number(v)
    },
    c2(v) {
      this.num2 = Number(v)
    }
  }
})
```
:::tip 提示
JavaScript 中表单的 onInput() 和 onChange() 的区别是，前者会实时监听输入的变化，而后者只会在失去焦点或者按下会车时才会监听。
:::
## 父子组件互相操作

**父组件访问子组件**  

使用 `$children` 或 `$refs`

- `$children`  

  获取所有**子组件**（是子组件，而不是子元素DOM），返回的是一个数组。
  ```html
  <div id="app">
    <cpn></cpn>
    <button @click="btnClick">获取子组件</button>
  </div>
  <template id="cpn">
    <div>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </template>
  ```
  ```js
  const app = new Vue({
    el: '#app',
    data: {

    },
    components: {
      cpn: {
        template: '#cpn',
        methods: {
          childMethod() {
            console.log('the child method')
          }
        },
        data() {
          return {
            name: 'yyx'
          }
        }
      }
    },
    methods: {
      btnClick() {
        console.log(this.$children)
        // 调用子组件的方法
        this.$children[0].childMethod()
        // 调用子组件的 name
        console.log(this.$children[0].name)
      } 
    }
  })
  ```

- `$refs`  

  该方法获取的是某一个组件，类似 Vue 获取 DOM 元素，需要在组件的标签上指定 `ref`。如果没有设置 `ref`，则 `$refs` 为空。
  ```html
  <div id="app">
    <cpn ref="cpn1"></cpn>
    <cpn ref="cpn2"></cpn>
    <cpn ref="cpn3"></cpn>
    <button @click="btnClick2">获取子组件</button>
  </div>
  <template id="cpn">
    <div>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </template>
  ```
  ```js
  const app = new Vue({
    el: '#app',
    data: {

    },
    components: {
      cpn: {
        template: '#cpn',
        methods: {
          childMethod() {
            console.log('the child method')
          }
        },
        data() {
          return {
            name: 'yyx'
          }
        }
      }
    },
    methods: {
      btnClick() {
        console.log(this.$children)
        // 调用子组件的方法
        this.$children[0].childMethod()
        // 调用子组件的 name
        console.log(this.$children[0].name)
      },
      btnClick2() {
        console.log(this.$refs)
      }
    }
  })
  ```

**子组件访问父组件**  

使用 `$parent` 访问直接父组件（即 VueComponent），使用 `$root` 访问根组件（即 Vue）。

```html
<div id="app">
  <cpn></cpn>
</div>
<template id="cpn">
  <div>
    <cpn2></cpn2>
    <p>hello</p>
    <button @click="btnClick()">获取父组件</button>
  </div>
</template>
<template id="cpn2">
  <div>
    <button @click="btn2">cpn2</button>
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  components: {
    cpn: {
      template: '#cpn',
      methods: {
        btnClick() {
          console.log(this.$parent)
        }
      },
      components: {
        cpn2: {
          template: '#cpn2',
          methods: {
            btn2() {
              console.log(this.$parent)
              // 访问根组件
              console.log(this.$root)
            }
          }
        }
      }
    }
  }
})
```
:::tip 提示
使用组件时，组件的属性应该在组件标签之内，即与 `template` 属性同级。这一点很容易被混淆。
:::

## slot
slot 即为插槽，使用插槽是为了让我们封装的组件更有扩展性。什么是扩展性？就是我们可以在原组件的基础之上进行修改或添加某些元素。如何使用插槽呢？只需要在组件中使用 `<slot></slot>` 即可。

**1. 示例1**  

```html
<div id="app">
  <cpn>
    <!-- 替换插槽的内容 -->
    <div>
      <button>按钮1</button>
      <button>按钮2</button>
    </div>
    <div>
      <span>222</span>
    </div>
  </cpn>
  <cpn></cpn>
  <cpn></cpn>
</div>
<template id="cpn">
  <div>
    <h2>hello</h2>
    <!-- 预留插槽 -->
    <slot>
      <!-- 设置插槽的默认元素 -->
      <button>默认按钮</button>
    </slot>
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  components: {
    cpn: {
      template: '#cpn'
    }
  }
})
```
上面的示例中，我们只定义了一个插槽，其实也可以定义多个插槽，如下：
```html
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <slot></slot>
    <slot></slot>
    <slot></slot>
  </div>
</template>
```
同样的，我们也可以在为每个插槽设置默认显示的DOM：
```html
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <slot><span>左</span></slot>
    <slot><span>中</span></slot>
    <slot><span>右</span></slot>
  </div>
</template>
```
现在来修改插槽的值：
```html
<div id="app">
  <cpn>
    <button>button</button>
  </cpn>
</div>
```
但是，我们发现所有的插槽都被修改了，那么如何只修改某个插槽中的内容呢，这就是接下来要讲的具名插槽，在有多个插槽的情况下，我们可以为每个插槽设置名字，如下：
```html
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <slot name="left"><span>左</span></slot>
    <slot name="center"><span>中</span></slot>
    <slot name="right"><span>右</span></slot>
    <slot><span>无名</span></slot>
  </div>
</template>
```
现在来进行替换：
```html
<div id="app">
  <cpn>
    <button>button</button>
  </cpn>
</div>
```
我们发现，所有没有设置 `name` 的插槽（name默认为default）都被替换了，现在来替换指定的插槽，只需要给元素设置 `slot` 属性即可，它的值就是插槽的 `name`：
```html
<div id="app">
  <cpn>
    <button slot="center">button</button>
  </cpn>
</div>
```
但是，Vue 官方文档中提到，在 2.6.0 中，我们为具名插槽和作用域插槽引入了一个新的统一的语法 (即 `v-slot` 指令)。它取代了 `slot` 和 `slot-scope` 这两个目前已被废弃但未被移除且仍在文档中的 attribute。新语法的由来可查阅这份 RFC。

:::tip 提示
插槽的使用请见 [插槽](https://cn.vuejs.org/v2/guide/components-slots.html#ad)。
:::

### 编译作用域  
先来看以下的代码：
```html
<div id="app">
  {{ isShow }}
  <cpn v-show="isShow"></cpn>
</div>
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <h2>hello world</h2>
    <span>{{ isShow }}</span>
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    message: 'hello world',
    isShow: true
  },
  components: {
    cpn: {
      template: '#cpn',
      data() {
        return {
          isShow: false
        }
      }
    }
  }
})
```
上面的组件仍然会显示，也就是说 `isShow` 是使用的 Vue 实例里面的，这就是接下来要说的编译作用域。对上面的代码做一个解释：
```html
<div id="app">
  {{ isShow }}
  <!-- isShow 为 Vue 实例中的属性 -->
  <!-- 只要是在 Vue 实例中使用变量，都是使用的 Vue 实例中的变量 -->
  <cpn v-show="isShow"></cpn>
</div>
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <h2>hello world</h2>
    <!-- 在组件中使用的变量为组件中的变量 -->
    <span>{{ isShow }}</span>
  </div>
</template>
```
### 作用域插槽
当父组件想要改变插槽的显示形式时，我们可以通过父组件得到子组件中的数据，然后改变其显示形式。注意，**实际的数据还是来自子组件，父组件只是改变了数据的显示样式而已**。
```html
<div id="app">
  <cpn></cpn>
  <cpn>
    <!-- slot-scope 的值任取，且必须使用 template 标签 -->
    <template slot-scope="fdata">
      <!-- fdata 是 slot-scope 的值 -->
      <!-- data 就是 slot 标签中自定义的属性 -->
      <!-- <span v-for="(e,i) in fdata.data">{{i===fdata.data.length-1? e:e+'->'}}</span> -->
      <span>{{fdata.data.join(' - ')}}</span>
    </template>
  </cpn>
</div>
<template id="cpn">
  <div>
    <!-- 其中的 data 是任取的，其中绑定的就是子组件中的数据 -->
    <slot :data="arr">
    <!-- 默认显示样式为列表 -->
      <ul>
        <li v-for="e in arr">{{ e }}</li>
      </ul>
    </slot>
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    message: 'hello world',
    isShow: true
  },
  components: {
    cpn: {
      template: '#cpn',
      data() {
        return {
          arr: ['Java','C++','JavaScript']
        }
      }
    }
  }
})
```
当然 `<slot></slot>` 标签也可以被放在其它标签之内：
```html
<div id="app">
  <cpn>
    <!-- 将 button 的内容设置为 "提交" -->
    提交
  </cpn>
</div>
<template id="cpn">
  <div>
    <!-- 预留插槽 -->
    <button type="button">
      <!-- 默认显示 submit -->
      <slot>submit</slot>
    </button>
  </div>
</template>
```
### 2.6.0 新的用法
上面我们提到了，Vue 2.6.0 中，建议我们使用 `v-slot`，下面就来简单介绍一下它的使用。  

**具名插槽**  

```html
<div id="app">
  <cpn>
    <!-- 使用 v-slot 时，必须放在 template 中 -->
    <template v-slot:header>
      <p>替换 header</p>
    </template>
    <!-- 替换 main 方式一 -->
    <p>替换main</p>
    <h3>替换main</h3>
    <!-- 替换 main 方式二 -->
    <template v-slot:default>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>
    </template>
    <template v-slot:footer>
      <h5>替换footer</h5>
    </template>
  </cpn>
</div>
<template id="cpn">
  <div>
    <header>
      <slot name="header">header</slot>
    </header>
    <main>
      <slot>main</slot>
    </main>
    <footer>
      <slot name="footer">footer</slot>
    </footer>
  </div>
</template>
```

**作用域插槽**  

```html
<!-- 以下结合了具名插槽使用 -->
<div id="app">
  <cpn></cpn>
  <cpn>
    <template v-slot:cc="recieve">
      <p>{{ recieve.myuser.lastName }}</p>
    </template>
  </cpn>
</div>
<template id="cpn">
  <div>
    <slot :myuser="user" name="cc">
      {{ user.firstName }}
    </slot>
  </div>
</template>
```
```js
const app = new Vue({
  el: '#app',
  components: {
    cpn: {
      template: '#cpn',
      data() {
        return {
          user: {
            firstName: 'zhang',
            lastName: 'san'
          }
        }
      }
    }
  }
})
```
## 组件的事件绑定  
若要给组件绑定事件，我们需要使用 `.native` 来修饰，如 `click.native`。

```html
<back-top @click.native="backTop"/>
```
:::tip 提示
在组件对象中，使用 `$el` 属性可以获取组件中的原生 DOM。
:::

## 递归组件
我们在动态生成菜单时，通常都会通过递归的方式来动态生成，而 Vue 中也支持我们在组件内部调用自身。实例如下：
```html
<template>
  <div>
    <div v-for="(item，index) in menuList" :key="index">
      <el-submenu :index="resolvePath(item.path)" v-if="item.children && item.children.length > 0">
        <template v-slot:title>
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </template>
        <side-menu :menu-list="item.children" :base-path="resolvePath(item.path)"/>
      </el-submenu>
      <el-menu-item :index="resolvePath(item.path)" v-else @click="onMenuItemClick(item)">
        <template v-slot:title>
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </template>
      </el-menu-item>
    </div>
  </div>
</template>
```
:::tip 提示
更多详细信息请见 [递归组件](https://v2.cn.vuejs.org/v2/guide/components-edge-cases.html#%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8)。
:::