# Vuex
[Vuex](https://vuex.vuejs.org/zh/) 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。  

**什么是状态管理？**  

状态可以简单理解为把多个组件需要共享的变量都存到一个对象中，然后将这个对象放到顶层的 Vue 实例中，以便其它组件能够使用。

现在来简单实现一个状态共享：

```js
const shareObj = {
  name: 'xxx'
}

Vue.prototype.shareObj = shareObj

// 所有组件都继承自 Vue 的原型
// 伪代码
Vue.component = ('a', {
  this.shareObj.name
})
```
但是，这不是响应式的，所以 Vue 开发了 Vuex。

**什么状态需要共享呢？**   
- 用户登录状态
- 用户信息（头像、昵称等）
- 购物车中的商品、商品收藏
- 在计数器中，我们实现的其实就是一个单页面的状态管理；父子组件之间传值其实也可以认为是状态管理

好了，接下来介绍 Vuex。  

## 安装
```sh
npm install vuex --save
```
## 使用 

在 src 下创建文件夹 store（建议取名），然后在 store 下创建 `index.js`：
- `src/store/index.js`

  ```js
  import Vuex from 'vuex'
  import Vue from 'vue'

  Vue.use(Vuex)

  const store = new Vuex.Store({
    state: {
      counter: 1000
    },
    mutations: {

    }
  })

  export default store
  ```

- `main.js`

  ```js
  import Vue from 'vue'
  import App from './App.vue'
  import store from './store/index'

  Vue.config.productionTip = false

  new Vue({
    render: h => h(App),
    store
  }).$mount('#app')
  ```
  
创建测试组件 `HelloVuex.vue`：

- `HelloVuex.vue`  

  ```vue
  <template>
    <div>
      <h3>{{ 'vuex:' + $store.state.counter }}</h3>
    </div>
  </template>

  <script>
    export default {

    }
  </script>

  <style>

  </style>
  ```

- `App.vue`

  ```vue
  <template>
    <div id="app">
      <h3>{{ message }}</h3>
      <h3>{{ 'App:' + $store.state.counter }}</h3>
      <hello-vuex/>
      <button @click="$store.state.counter++">+</button>
      <button @click="$store.state.counter--">-</button>
    </div>
  </template>

  <script>
  import HelloVuex from './components/HelloVuex'

  export default {
    name: 'App',
    components: {
      HelloVuex
    },
    data() {
      return {
        message: 'hello vuex'
      }
    }
  }
  </script>

  <style>

  </style>
  ```
运行程序，然后就实现了一个简单的 Vuex 示例。  

接下来，对程序中的某些代码进行说明。  

1. 在 `main.js` 中导入 store（Vuex 实例）时，实际上会执行 `Vue.prototype.$store = store`，即把 Vuex 实例绑定到 Vue 的原型上以便所有组件都能访问 store（因为所有组件都继承自 Vue 的原型），这点和 Vue-Router 相同。  
2. Vuex 的构造方法中的 `state` 属性就是存放需要共享的变量。
3. 其它组件想要访问 Vuex 中的共享变量时，只需使用 `$store.state.xxx` 或 `this.$store.state.xxx`。

在上面的入门示例中，我们直接使用的类似 `$store.state.xxx++` 来修改变量，但是 Vuex 中却不推荐我们这样使用，我门应该通过 `mutations`（Vuex 实例的属性，后面会介绍） 来修改 state，因为这样修改会使 Vue 的浏览器插件 Devtools 来监测 state 的修改记录。  

在官网的图中，我们可以看见 state 的修改流程，如下： 

![vuex](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-04/vuex.png)

其实，如果我们想要直接修改 state（不用异步请求）的话，我们可以直接使用 Mutations 来修改，而不用经过 Dispatch；但是，我们想要通过异步修改的话，最好使用 Actions 来修改，然后将修改结果发送给 Mutations。  

:::tip 提示
可以安装 Devtools（Vue.js devtools），在浏览器的应用商店安装即可。不建议在 Mutations 中进行异步操作。Devtools 不能监测异步修改 state。
:::

修改入门示例中修改 state 的代码如下：

- `src/store/index.js`  

  ```js
  const store = new Vuex.Store({
    state: {
      counter: 1000
    },
    mutations: {
      increament(state) {
        state.counter++
      },
      decreament(state) {
        state.counter--
      }
    }
  })
  ```

在 mutations 中定义了两个函数，`increament( )` 用来使 `counter` 自增，`decreament( )` 用来使 `counter` 自减。其中，这两个函数的参数是 state，这个 state 就是 Vuex 示例中的 state，不需要我们从外部传入。  

- `App.vue`  

  ```vue
  <template>
    <div id="app">
      <h3>{{ message }}</h3>
      <h3>{{ 'App:' + $store.state.counter }}</h3>
      <hello-vuex/>
      <button @click="add">+</button>
      <button @click="reduce">-</button>
    </div>
  </template>

  <script>
  import HelloVuex from './components/HelloVuex'

  export default {
    name: 'App',
    components: {
      HelloVuex
    },
    data() {
      return {
        message: 'hello vuex'
      }
    },
    methods: {
      add() {
        this.$store.commit('increament')
      },
      reduce() {
        this.$store.commit('decreament')
      }
    }
  }
  </script>
  ```
在事件中调用 `commit()`，然后传入在 `src/store/index.js` 中定义的函数的名字即可。  

上面就是 Vuex 的最基本使用，接下来对它进行详细的介绍。

## State
state 的使用在入门示例中已经讲过，它就是用来存放要共享的某些变量，这里只是进行一些补充。state 单一状态树，Vuex 中建议只创建一个 Vuex 实例。

## Getters
类似计算属性，当某个数据需要经过某些变化时，就可以使用 Getters。

```js
const store = new Vuex.Store({
  state: {
    counter: 1000,
    students: [
      {id: '001', name: '晓梦', age: 19},
      {id: '002', name: '弄玉', age: 18},
      {id: '003', name: '紫女', age: 25},
      {id: '004', name: '焱妃', age: 26},
      {id: '005', name: '焰灵姬', age: 23}
    ]
  },
  getters: {
    // 会自动传入 state
    powerCounter(state) {
      return Math.pow(state.counter, 2)
    },
    overAge(state) {
      return state.students.filter(ele => ele.age > 20)
    }
  }
})
```
```vue
<!-- 使用时，当成属性即可 -->
<h3>{{ 'pow:' + $store.getters.powerCounter }}</h3>
<li v-for="(e,i) in $store.getters.overAge" :key="i">{{ e.id + '->' + e.name + '->' + e.age}}</li>
```
其实，还可以在函数中传入 getters 这个参数：
```js
const store = new Vuex.Store({
  state: {
    counter: 1000,
    students: [
      {id: '001', name: '晓梦', age: 19},
      {id: '002', name: '弄玉', age: 18},
      {id: '003', name: '紫女', age: 25},
      {id: '004', name: '焱妃', age: 26},
      {id: '005', name: '焰灵姬', age: 23}
    ]
  },
  getters: {
    powerCounter(state) {
      return Math.pow(state.counter, 2)
    },
    overAge(state) {
      return state.students.filter(ele => ele.age > 20)
    },
    // 传入 getters
    overAgeNum(state, getters) {
      return getters.overAge.length
    }
  }
})
```
:::tip 说明
上面的示例中使用到的参数是由 Vuex 自动传入的，我们不需要自己传入，并且和函数的参数名没有关系，例如：`overAge(a, b)` 也可以（`a` 就是 state，`b` 就是 getters）。
:::

上面的示例中，我们都没有从外部传入参数，那么我们如果想要传入自己的参数时，是否可以传入第三个参数呢？是不可以的。那该怎么办呢？请看下面的代码：
```js
const store = new Vuex.Store({
  state: {
    students: [
      {id: '001', name: '晓梦', age: 19},
      {id: '002', name: '弄玉', age: 18},
      {id: '003', name: '紫女', age: 25},
      {id: '004', name: '焱妃', age: 26},
      {id: '005', name: '焰灵姬', age: 23}
    ]
  },
  getters: {
    overAgeParam(state) {
      return function(minAge) {
        return state.students.filter(e => e.age > minAge)
      }
    }
  }
})
```
```vue
<h3>{{ $store.getters.overAgeParam(23) }}</h3>
```
返回一个函数即可。`$store.getters.overAgeParam` 是一个值，这个值是 `overAgeParam(state)` 返回的一个函数，加上括号就表示调用这个函数，而这个函数中有一个形参（minAge），所以我们传了一个参数。简写如下：
```js
overAgeParam(state) {
  return minAge => state.students.filter(e => e.age > minAge)
}
```

## Mutation
用于更新 state 的状态，它主要包括两部分：事件类型（type）和回调函数。使用 `commit( )` 进行更新。**Mutation 中不建议使用异步操作。**
```js
mutations: {
  // 事件类型为 add
  // 回调函数就是 (state) { }
  add(state) {
      
  }
}
```
回调函数中的第一个参数就是 state，第二个参数可以是用户自己的参数，如下：
```js
mutations: {
  addByNumber(state, num) {
    state.counter += num
  }
}
```
- `App.vue`  

  ```vue
  <template>
    <div id="app">
      <button @click="addByNum(5)">+5</button>
    </div>
  </template>

  <script>
  import HelloVuex from './components/HelloVuex'

  export default {
    name: 'App',
    components: {
      HelloVuex
    },
    methods: {
      addByNum(num) {
        // 传入参数 num，num 即是载荷
        this.$store.commit('addByNumber', num)
      }
    }
  }
  </script>
  ```
上面，我们只传递了一个参数，那么是否可以传递多个参数呢？肯定是可以的（传一个对象即可）。这些额外的参数都被称为 `paylaod`（载荷）。接下来介绍 mutations 的提交风格。上面只是 mutations 的普通使用方式，其实还可以使用 Vue 提供的 `type`，而 mutations 中收到的参数就是整个对象，如下：
```js
export default {
  name: 'App',
  components: {
    HelloVuex
  },
  methods: {
    addByNum(num) {
      // 对象形式
      this.$store.commit({
        type: 'addByNumber',
        num,
        age: 19
      })
    }
  }
}
```
```js
const store = new Vuex.Store({
  mutations: {
    addByNumber(state, payload) {
      // 此时的 payload 是传入的整个对象
      // payload 即 {type: 'addByNumber',num: 5,age: 19}
      console.log(payload)
    }
  }
})
```
**Mutation 需遵守 Vue 的响应规则**  

mutations 参数的提交大概就是上面介绍的那样，接下来说一下 mutations 的响应式规则。和 Vue 中的 data 类似，是否 mutations 中所有的数据再任何情况下都是响应式的呢？答案是否定的，这就是接下来要讲的响应式风格。要想是数据具有响应式，它们必须具备以下条件：  
1. 在 state 中已经被初始化某些**属性**（注意，如果向某个对象中添加某个属性，那么在页面中不会显示新增的，但是对象能够添加该属性，可通过 Devtools 查看；但是 cli4 的高版本可以），除非使用 `Vue.set()`。
    
  ```js
  const store = new Vuex.Store({
    state: {
      info: {
        name: 'mp',
        age: 66
      }
    },
    mutations: {
      changeInfo(state) {
        // state.info.name = 'change'
        // state.info.address = 'kl'
        Vue.set(state.info, 'address', 'ko')
        // delete 也无法做到响应式
        // delete state.info.age
        Vue.delete(state.info, 'age')
      }
    }
  })
  ```
2. 以新对象替换老对象。请见 Vuex 官网的示例。

**使用常量替代 Mutation 事件类型**  

在上面的示例中，我们在使用 `commit()` 时，都是自己传入的方法名（即 `type`），这样可能不叫麻烦，而且可能出现拼写错误，这时，我们可以使用常量来代替它。  
  
在 src/store 中新建文件 `mutation-types.js`（名字任取），内容如下：
- `mutation-types.js`  

  ```js
  export const INCREAMENT = 'increament'
  ```

- `index.js`  

  ```js
  import {INCREAMENT} from './mutation-types'

  const store = new Vuex.Store({
    state: {
      counter: 1000,
    },
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    mutations: {
      [INCREAMENT](state) {
        state.counter++
      },
      /* ['increament'](state) {
        state.counter++
      } */
    }
  })
  ```

- `App.vue`  

  ```js
  import { INCREAMENT } from './store/mutation-types'

  export default {
    name: 'App',
    components: {
      HelloVuex
    },
    methods: {
      add() {
        // this.$store.commit('increament')
        this.$store.commit(INCREAMENT)
    }
  }
  ```

## Action

Vuex 推荐在 Action 进行异步修改 state 的操作，先来看以下示例：
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state) {
      // 异步修改
      setTimeout(() => {
        state.info.name = 'change'
      }, 1000)
    }
  }
})
```
运行上面的代码，我们发现，页面中的确发生了修改，但是 devtools 中的 state 却没有被修改，这是因为我们在上面讲到的， devtools 只能监听到同步修改状态的操作。 因此，所有异步操作都建议在 Action 中进行，然后将结果返回给 mutation。
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state) {
      state.info.name = 'change1'
    }
  },
  actions: {
    // 这个 context 就相当于 store 对象
    asyncUpdateInfo(context) {
      setTimeout(() => {
        context.commit('changeInfo')
      }, 1000)
    }
  }
})
```
```vue
<template>
  <div>
    <button @click="changeInfo">修改信息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeInfo() {
        // 调用 action
        this.$store.dispatch('asyncUpdateInfo')
      }
    }
  }
</script>
```
上面的代码就实现了异步修改 state，其实还可以在修改时传入参数，如下：
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state, payload) {
      state.info.name = 'change1'
      console.log('mutationsUpdate', payload)
    },
  },
  actions: {
    asyncUpdateInfo(context, payload) {
      setTimeout(() => {
        context.commit('changeInfo', payload)
        console.log(payload)
      }, 1000)
    }
  }
})
```
```vue
<template>
  <div>
    <h3>{{ 'vuex:' + $store.state.counter }}</h3>
    <p>{{ $store.state.info }}</p>
    <button @click="changeInfo">修改信息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeInfo() {
        this.$store.dispatch({
          type: 'asyncUpdateInfo',
          age: 123,
          users: [
            {name: 'k1', age: 26},
            {name: 'k2', age: 20}
          ]
        })
      }
    }
  }
</script>
```
但是，我们还想要在异步修改成功之后做一些其它事情，有没有什么办法可以得到这个异步修改的结果呢？肯定也是可以的，我们可以使用回调函数。  
```vue
<template>
  <div>
    <h3>{{ 'vuex:' + $store.state.counter }}</h3>
    <p>{{ $store.state.info }}</p>
    <button @click="changeInfo">修改信息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeInfo() {
        this.$store.dispatch('asyncUpdateInfo', () => {
          console.log('change successfully')
        })
      }
    }
  }
</script>
```
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state, payload) {
      state.info.name = 'change1'
    },
  },
  actions: {
    asyncUpdateInfo(context, payload) {
      setTimeout(() => {
        context.commit('changeInfo', payload)
        payload()
      }, 1000)
    }
  }
})
```
当然，我们也可以传递参数：
```vue
<template>
  <div>
    <h3>{{ 'vuex:' + $store.state.counter }}</h3>
    <p>{{ $store.state.info }}</p>
    <button @click="changeInfo">修改信息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeInfo() {
        this.$store.dispatch('asyncUpdateInfo', {
          data: 'the data',
          success: () => {console.log('successfully')}
        })
      }
    }
  }
</script>
```
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state, payload) {
      state.info.name = 'change1'
    },
  },
  actions: {
    asyncUpdateInfo(context, payload) {
      setTimeout(() => {
        context.commit('changeInfo', payload)
        payload.success()
      }, 1000)
    }
  }
})
```
上面的做法虽然可以实现功能，但是不够优雅，我们可以使用 `Promise` 来代替，看下面的代码：
```vue
<template>
  <div>
    <h3>{{ 'vuex:' + $store.state.counter }}</h3>
    <p>{{ $store.state.info }}</p>
    <button @click="changeInfo">修改信息</button>
  </div>
</template>

<script>
  export default {
    methods: {
      changeInfo() {
        // dispatch 执行完成后的返回值就是 actions 中 asyncUpdateInfo 方法的返回值。
        this.$store
          .dispatch('asyncUpdateInfo', 'message')
          .then(val => {
            console.log(val)
          })
      }
    }
  }
</script>
```
```js
const store = new Vuex.Store({
  state: {
    info: {
      name: 'mp',
      age: 66
    }
  },
  mutations: {
    changeInfo(state, payload) {
      state.info.name = 'change1'
    },
  },
  actions: {
    asyncUpdateInfo(context, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          context.commit('changeInfo', payload)
          console.log(payload)
          resolve('asyncUpdateInfo is successful by promise')
        }, 1000)
      })
    }
  }
})
```
:::tip 思考
请思考 `commit()` 和 `dispatch()` 的返回值是什么？上面的代码中提到 `dispatch()` 的返回值。
:::

Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 `store.dispatch` 可以处理被触发的 action 的处理函数返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise：
```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```
```js
store.dispatch('actionA').then(() => {
  // ...
})
```

## Module
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。 

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
```js
const store = new Vuex.Store({
  modules: {
    a: {
      state: {},
      mutations: {},
      getters: {},
      actions: {}
    },
    b: {
      state: {},
      mutations: {},
      getters: {},
      actions: {}
    }
  }
})

/*-------------------------------*/

const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```
使用模块中的 state：
```vue
<!-- 使用模块 a 中的 name -->
<!-- 模块会被直接放到 store 的 state 中，见 devtools 的 state -->
<p>{{ $store.state.a.name }}</p>
```
```js
const moduleA = {
  state: {
    name: 'moduleA'
  }
}
const store = new Vuex.Store({
  modules: {
    a: moduleA,
  }
})
```
使用模块中的 mutation：
```vue
<template>
  <div>
    <p>{{ $store.state.a.name }}</p>
    <button @click="changeNameOfA">changeName</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    HelloVuex
  },
  methods: {
    changeNameOfA() {
      this.$store.commit('updateNameOfA', {
        name: 'changedA'
      })
    }
  }
}
</script>
```
```js
const moduleA = {
  state: {
    name: 'moduleA'
  }
}
const store = new Vuex.Store({
  modules: {
    a: moduleA,
  },
  mutations: {
    updateNameOfA(state, payload) {
      state.name = payload.name
    }
  }
})
```
注意：在使用模块中的 mutation 时，我们依旧使用 `this.$store.commit` 进行提交，它会优先在 store 中查找，如有则使用，否则在模块中查找。所以，模块中的方法名尽量不要和 store 中的重复。  

使用模块中的 getters：
```vue
<p>{{ $store.getters.fillNameOfA }}</p>
<p>{{ $store.getters.fillNameOfA2 }}</p>
<p>{{ $store.getters.fillNameOfA3 }}</p>
```
```js
const moduleA = {
  state: {
    name: 'moduleA'
  }
}
const store = new Vuex.Store({
  modules: {
    a: moduleA,
  },
  getters: {
    fillNameOfA(state) {
      return state.name.toLowerCase()
    }
  },
  fillNameOfA2(state, getters) {
    return getters.fillNameOfA + '89'
  },
  fillNameOfA3(state, getters, rootState) {
    // rootState.counter 即为 store.counter，即 1000
    return getters.fillNameOfA + rootState.counter
  }
})

const store = new Vuex.Store({
  state: {
    counter: 1000
  }
}
```
使用模块中的 getters 时，直接使用 `$store.getters.xxx`。如果想要在模块的 getters 中获取 store 中的数据，那么可以在模块的 getters 方法中增加第三个参数，使用第三个参数来获取 store 的状态（变量），如上面的代码。  

在模块中使用 action：  
```vue
<template>
  <div id="app">
    <p>{{ $store.state.a.name }}</p>
    <button @click="changeNameOfA">changeName</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    HelloVuex
  },
  methods: {
    changeNameOfA() {
      this.$store.dispatch('asyncNameOfA', {
        name: 'changedABC'
      })
    }
  }
}
</script>
```
```js
const moduleA = {
  state: {
    name: 'moduleA'
  },
  mutations: {
    updateNameOfA(state, payload) {
      state.name = payload.name
    }
  },
  actions: {
    asyncNameOfA(context, payload) {
      setTimeout(() => {
        context.commit('updateNameOfA', payload)
      }, 1000)
    }
  }
}
```
模块中使用 actions 时，context 就是该模块，它的 commit 只会调用该模块的 mutations。

:::tip 提示
可以尝试打印 context，看看它到底包含哪些内容。Vuex 的更多细节用法（特别是 Action）请见 [actions](https://vuex.vuejs.org/zh/guide/actions.html)。
:::

## 文件拆分
在上面的所有例子中，所有 Vuex 相关的代码都是写在 index.js 中，如果项目过于庞大，那么该文件会过于臃肿，所以，我们可以将该文件进行拆分。一般来讲，我们应该拆分 mutations，actions，getters 和 modules，state 可以不拆分。如下：
- `store/mutations.js`  

  ```js
  import {INCREAMENT} from './mutation-types'

  export default {
    changeInfo(state, payload) {
      state.info.name = 'change1'
    },
    [INCREAMENT](state) {
      state.counter++
    },
    decreament(state) {
      state.counter--
    },
    addByNumber(state, num) {
      // state.counter += num
      console.log(num)
    },
    addStudent(state, student) {
      state.students.push(student)
    }
  }
  ```
  其它文件都是类似的，然后只需在 `index.js` 中导入即可。  

- `store/index.js`  

  ```js
  import Vue from 'vue'
  import Vuex from 'vuex'

  import mutations from './mutations'
  import actions from './actions'
  import getters from './getters'

  import moduleA from './modules/moduleA'

  Vue.use(Vuex)

  // 没有将 state 进行另外的拆分
  const state = {
    counter: 1000
  }

  const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules: {
      a: moduleA
    }
  })

  export default store
  ```

## mapGetters
`mapGetters` 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```
如果你想将一个 getter 属性另取一个名字，使用对象形式：
```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
}
```
使用时，只需要像普通的计算属性一样：
```vue
<!-- <div>购物车({{cartLength}})</div> -->
<div>购物车({{doneCount}})</div>
```

## mapActions

你在组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用（需要先在根节点注入 store）：
```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    }),
    test() {
        this.increment(params)
        // 等价于下面的代码
        // this.$store.dispatch('increment', params)
    }
  }
}
```
