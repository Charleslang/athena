# 基本用法
## 组合式 API（Composition API）
### setup

1. setup 是 Vue3 中一个新的配置项，值为一个函数。
2. setup 是所有 Composition API “表演的舞台”.
3. 组件中所用到的数据、方法等等，均要配置在 setup 中（这是和 Vue2 一个很大的不同之处，但是 Vue3 也兼容 Vue2 的写法）。

    - 虽然 Vue3 兼容 Vue2 的写法，但是不建议在 Vue3 中使用 Vue2 中的语法
    - Vue2 中的写法可以获取 Vue3 中 setup 里面定义的数据或方法等，但是 Vue3 的 setup 中不能读取 Vue2 语法中在 data 和 methods 等中定义的相关内容
    - setup 中没有 this

4. setup 函数的两种返回值

    - 若返回一个对象，则对象中的属性、方法在模板中均可以直接使用。（最常用）
    - 若返回一个渲染函数，则可以自定义渲染内容。(了解)
    
5. 注意点

    - Vue3 的配置尽量不要与 Vue2 的配置混用
    - Vue2 的配置 (data、methos、computed...）中可以访问到 setup 中的属性、方法。但在 setup 中不能访问到 Vue2 的配置。
    - 如果 Vue2 和 Vue3 有重名配置, 则 setup 中定义的优先。
    - setup 不能是一个 async 函数，因为 sync 返回值不再是 return 对象，而是 promise，模板看不到 return 对象中的属性（使用 Suspense 和异步组件可以返回 Promise 和 async，见 Suspense）（最新版的 Vue3 已经支持 setup 使用 async）。
    - setup 执行的时机在 beforeCreate 之前执行一次，setup 中的 this 是 undefined。
    - setup 函数的两个参数
        - props：值为对象，包含组件外部传递过来，且组件内部声明接收了的属性
        - context：上下文对象
            - attrs：值为对象，包含组件外部传递过来，但没有在 `props` 配置中声明的属性, 相当于 `this.$attrs`
            - slots：收到的插槽内容, 相当于 `this.$slots`
            - emit：分发自定义事件的函数，相当于 `this.$emit`



- 示例 1
```vue
<template>
  <h1>HelloWorld</h1>
  <!-- 直接在模板中使用 setup 的返回信息 -->
  <div>
    <span>姓名: {{ name }}</span>
    <span>年龄: {{ age }}</span>
    <button @click="sayHello">按钮</button>
  </div>
</template>

<script>
  // 此处只是暂时这么写, 暂时不考虑响应式的问题
  export default {
    setup() {
      // 数据, 在 Vue2 中是定义在 data 函数中的
      let name = 'zs'
      let age = 23

      // 方法, 在 Vue2 中是定义在 methods 属性中的
      function sayHello() {
        console.log(`name: ${name}, age: ${age}`)
      }

      // 向外部暴露属性和方法，以便在 html 的 <template> 中使用
      return {
        name,
        age,
        sayHello
      }
    }
  }
</script>
```
- 示例 2

```vue
<!-- setup 返回渲染函数 -->

<template>
  <h1>HelloWorld</h1>
</template>

<script>

  // 导入渲染函数
  import { h } from 'vue'

  // 此处只是暂时这么写, 暂时不考虑响应式的问题
  export default {
    setup() {
      // 数据, 在 Vue2 中是定义在 data 函数中的
      let name = 'zs'
      let age = 23

      // 方法, 在 Vue2 中是定义在 methods 属性中的
      function sayHello() {
        console.log(`name: ${name}, age: ${age}`)
      }

      // 返回渲染函数, 即 <template> 中的所有 html 标签被被渲染函数返回的 html 覆盖
      // 这里相当于返回了 <h3>hello</h3>
      return () => h('h3', 'hello')

    }
  }
</script>
```

接下来讲一下, `setup` 函数接收的两个参数 `props` 和 `context`。

- `Demo1.vue`
```vue
<template>
  <h1>hello demo1</h1>
  <span>父组件传递的name: {{ name }}</span>
  <span>父组件传递的age: {{ age }}</span>
</template>

<script>

  export default {
    // 接收父组件传递的参数
    // 如果父组件传了参数, 但是子组件没有使用 props 接收, 则控制台会有警告 ，如下
    // Extraneous non-props attributes (name, age) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. 
    props: ['name', 'age'],
    
    // 这个 props 参数就是父组传过来的所有属性, 该 props 被封装成了一个 Proxy 响应式对象
    // setup 中 props 的值就是我们上面声明的 props, 如果我们外层没有声明 props, 则 setup 参数中的 props 就是空的
    setup(props, context) {
      console.log(props)
      console.log(context)
      // 注意 attrs 属性
      // 如果我们在子组件中声明了 props 属性来接收父组件传过来的值, 则 context.attrs 中没有我们在 props 中显示声明的属性
      console.log(context.attrs)
      console.log(context.emit)
      console.log(context.slots)
      console.log(context)
    }
  }
</script>

<style>

</style>
```
- `App.vue`
```vue
<template>
  <!-- 给子组件传值 -->
  <Demo1 name="zs" age="123"></Demo1>
</template>

<script>
  // 引入子组件
  import Demo1 from './components/Demo1.vue'
  
  export default {
    // 注册子组件
    components: {
      Demo1
    },
    setup() {

    }
  }
</script>

<style>

</style>
```
在 Vue3 中使用父子组件通信，如下。
- `Demo1.vue`
```vue
<template>
  <h1>hello demo1</h1>
  <span>name: {{ name }}</span><br>
  <span>age: {{ age }}</span><br>
  <button @click="emitEvent">子组件的点击事件</button>
</template>

<script>
  export default {
    // Vue3 中需要我们显示使用 emits 属性来声明子组件需要发出的事件名（如果不声明，那么也能正常使用，只不过控制台有警告信息）
    emits: ['hello'],
    props:['name', 'age'],
    setup(props, context) {

      function emitEvent() {
        context.emit('hello', {
          name: 'zs'
        })
      }

      return {
        emitEvent
      }
    }
  }
</script>

<style>

</style>
```
- `App.vue`
```vue
<template>
  <Demo1 name="zs" age="123" @hello="doHello"></Demo1>
</template>

<script>
  import Demo1 from './components/Demo1.vue'

  export default {
    components: {
      Demo1
    },
    setup() {
      function doHello(params) {
        console.log(`父组件收到了子组件的事件，参数是${params}`)
      }
      return {
        doHello
      }
    }
  }
</script>

<style>

</style>
```

### ref 函数
在 Vue2 中，我们可以通过 `ref` 给元素一个标识，如下：
```vue
<span ref="element">hello</span>
```
```js
console.log(this.$refs.element)
```
这个特性在 Vue3 中依然可以使用，但是 Vue3 中新增的 ref 函数和这个不是同一个东西。

在介绍 `ref` 函数之前，我们先看一个小例子，这个例子很简单，就是修改在 `setup` 中的值，然后看页面是否同步修改了数据。

```vue
<template>
  <!-- 直接在模板中使用 setup 的返回信息 -->
  <div>
    <span>姓名: {{ name }}</span><br/>
    <span>年龄: {{ age }}</span><br/>
    <button @click="change">按钮</button><br/>
  </div>
</template>

<script>
  export default {
    setup() {
      let name = 'zs'
      let age = 23

      function change() {
        console.log(name, age)
        name ='ww'
        age = 123
        console.log(name, age)
      }
      return {
        name,
        age,
        change
      }
    }
  }
</script>
```

但是呢，好像不管用，我们发现，`change` 函数确实修改了值，但是页面并没有同步修改。这是因为该数据不是响应式的，想要在 Vue3 中使用响应式，就需要使用 `ref` 函数，如下：

```vue
<template>
  <div>
    <!-- 页面取值时不用手动调用 value, Vue 会帮我们自动完成 -->
    <span>姓名: {{ name }}</span><br/>
    <span>年龄: {{ age }}</span><br/>
    <button @click="change">按钮</button><br/>
  </div>
</template>

<script>
  // 导入 ref 函数
  import { ref } from 'vue'

  export default {
    setup() {
      // 使用 ref 函数让数据变成响应式
      let name = ref('zs')
      let age = ref(23)

      function change() {
        console.log(name, age)
        // 修改值
        name.value ='ww'
        age.value = 123
        console.log(name, age)
      }
      
      return {
        name,
        age,
        change
      }
    }
  }
</script>
```
使用 `ref` 函数绑定对象类型的数据：
```vue
<template>
  <div>
    <span>person: {{ person }}</span><br/>
    <span>array: {{ array }}</span><br/>
    <span>obj: {{ obj }}</span><br/>
    <span>arr: {{ arr }}</span><br/>
    <button @click="changePerson">changePerson</button><br/>
    <button @click="changeArray">changeArray</button><br/>
    <button @click="changeObj">changeObj</button><br/>
    <button @click="changeArr">changeArr</button><br/>
  </div>

</template>

<script>
  import { ref } from 'vue'

  export default {
  
    setup() {
      let person = ref({
        height: 172,
        address: '成都'
      })
      
      let array = ref([1, 2, 3])

      let obj = ref({
        height: 172,
        hobbies: ['羽毛球', '乒乓球', '篮球']
      })

      let arr = ref([
        {
          height: 172,
          hobbies: ['羽毛球', '乒乓球', '篮球']
        }
      ])
      
      function changePerson() {
        person.value.address = '广安'
      }

      function changeArray() {
        array.value[0] = 11
        array.value[2] = 12
      }

      function changeObj() {
        obj.value.hobbies[0] = '羽毛球1'
      }

      function changeArr() {
        arr.value[0].hobbies[0] = '羽毛球1'
      }
      
      return {
        person,
        array,
        obj,
        arr,
        changePerson,
        changeArray,
        changeObj,
        changeArr
      }
    }
  }
</script>
```

`ref` 函数对于基本数据类型来讲，是将其封装为 RefImpl（reference implement）对象；对于对象类型来讲，是将其封装为 Proxy 对象。

### reactive 函数

前面我们介绍了 `ref` 函数，他可以帮助我们建立响应式数据，`ref` 函数既能用于基本数据类型，也能用于对象数据类型。但是，作用于对象类型时，如果对象的嵌套比较深，我们修改起来不方便，必须要加 `value` 来获取真实的值。

Vue3 提供了 `reactive` 函数，它仅能作用于对象类型（数组也是对象），它的作用和 `ref` 函数一样，也是让数据变成响应式的。但是，`reactive` 函数在修改值时，可以直接使用对象本身来修改。其实 `ref` 函数在封装对象类型的数据时，也是把它封装成了 `reactive` 对象。

```vue
<template>
  <div>
    <span>array: {{ reactiveArray }}</span><br>
    <span>obj: {{ reactiveObj }}</span><br>
    <button @click="changeReactiveArray">changeReactiveArray</button>
    <button @click="changeReactiveObj">changeReactiveObj</button>
  </div>
</template>

<script>
  import { reactive } from 'vue'

  export default {
  
    setup() {

      let reactiveArray = reactive(['学习', '听歌'])
      let reactiveObj = reactive({
        height: 172
      })

      function changeReactiveArray() {
        reactiveArray[0] = '学习1'
      }
      
      function changeReactiveObj() {
        reactiveObj.height = 173
      }

      return {
        reactiveArray,
        reactiveObj,
        changeReactiveArray,
        changeReactiveObj
      }
    }
  }
</script>
```

但是，如果我想用 `reactive` 来处理基本数据类型，可不可以呢？当然可以，我们可以将所有属性都放在一个对象中，将这个对象交给 `reactive` 即可（推荐这样使用），如下：

```vue
<template>
  <div>
    <span>{{ allObj.name }}</span><br>
    <span>{{ allObj.age }}</span><br>
    <span>{{ allObj.hobby }}</span><br>
    <button @click="changeAllObj">changeAllObj</button>
  </div>
</template>

<script>
  import { reactive } from 'vue'

  export default {

      const allObj = reactive({
        name: 'zs',
        age: 'ww',
        hobby: ['羽毛球']
      })

      function changeAllObj() {
        allObj.name = 'ww'
        allObj.age = 123
        allObj.hobby[0] = '羽毛球1'
      }

      return {
        allObj,
        changeAllObj
      }
    }
  }
</script>
```

但是，这样还是有点麻烦，要写很多重复的外层对象，有没有好一点的办法呢？答案是有的，在 return 时，把对象解构即可（但是这样失去的响应式，解决办法请见 `toRefs`），如下：

```vue
<script>
  import { reactive } from 'vue'

  export default {
    setup() {
    
      const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai'
      })

      return {
        ...person
      }
    }
  }
</script>
```

### Vue3 和 Vue2 响应式的区别

在 Vue2 中，如果我们修改了对象的某个属性，或者删除了对象的某属性，或者通过下标修改数组的元素，或者给数组添加元素，或者删除数组的某个元素，页面是不会发生变化的，我们需要通过使用 `this.$set`、`Vue.set`、`this.$delete`、`Vue.delete`、`array.splice` 等方法来达到响应式的目的。而 Vue3 中使用的是 `ref`、`reactive` 来实现响应式，这种方式解决了 Vue2 中的问题。

### computed 计算属性

- 示例 1（Vue2 语法）
```vue
<template>
  <h1>hello demo1</h1>
  <span>firstname: </span><input v-model="person.firstName"><br>
  <span>lastname: </span><input v-model="person.lastName"><br>
  <span>fullname: {{ fullName }}</span><br>
</template>

<script>
  import { reactive } from 'vue'

  export default {

    // 这里使用的是 Vue2 的写法
    computed: {
      fullName() {
        return this.person.firstName + " " + this.person.lastName
      }
    },

    setup() {
      const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai'
      })

      return {
        person
      }

    }
  }
</script>

<style>

</style>
```
- 示例 2（Vue3 语法）
```vue
<template>
  <h1>hello demo1</h1>
  <span>firstname: </span><input v-model="person.firstName"><br>
  <span>lastname: </span><input v-model="person.lastName"><br>
  <span>fullname: {{ fullName }}</span><br>
</template>

<script>
  // 引用计算属性函数
  import {reactive, computed} from 'vue'

  export default {

    setup() {
      const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai'
      })

      const fullName = computed(() => person.firstName + " " + person.lastName)

      return {
        person,
        fullName
      }

    }
  }
</script>

<style>

</style>
```
- 示例 3（示例 2 的改进）
```vue
<template>
  <h1>hello demo1</h1>
  <span>firstname: </span><input v-model="person.firstName"><br>
  <span>lastname: </span><input v-model="person.lastName"><br>
  <span>fullname: {{ person.fullName }}</span><br>
</template>

<script>
  import {reactive, computed} from 'vue'

  export default {

    setup() {
      const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai'
      })
      
      // 这样写也可以
      /*const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai',
        fullName: computed(() => person.firstName + " " + person.lastName)
      })*/

      person.fullName = computed(() => person.firstName + " " + person.lastName)

      return {
        person
      }

    }
  }
</script>

<style>

</style>
```

通过上面的方式生成的计算属性是只读的，不能被修改，如果要想计算属性可以被修改，需要使用下面的写法：
```vue
<template>
  <h1>hello demo1</h1>
  <span>firstname: </span><input v-model="person.firstName"><br>
  <span>lastname: </span><input v-model="person.lastName"><br>
  <span>fullname: </span><input v-model="person.fullName"><br>
</template>

<script>
  import {reactive, computed} from 'vue'

  export default {
    setup() {
      const person = reactive({
        firstName: 'Junfeng',
        lastName: 'Dai',
      })

      person.fullName = computed({
        get() {
          return person.firstName + " " + person.lastName
        },
        set(newValue) {
          const fullName = newValue.split(' ')
          person.firstName = fullName[0]
          person.lastName = fullName[1]
        }
      })

      return {
        person
      }

    }
  }
</script>

<style>

</style>
```

### watch 函数
Vue2 中的写法：
```vue
<template>
  <h1>hello demo1</h1>
  <span>num: {{ num }}</span><br>
  <button @click="num++">加</button>
</template>

<script>
  import { ref } from 'vue'

  export default {

    watch: {
      // num(newValue, oldValue) {
      //   console.log(newValue, oldValue)
      // }
      num: {
        immediate: true,
        deep: true,
        handler(newValue, oldValue) {
          console.log(newValue, oldValue)
        }
      }
    },

    setup() {
      let num = ref(0)

      return {
        num
      }
    }
  }
</script>

<style>

</style>
```
使用 Vue3 监听 `ref` 定义的响应式数据：
```vue
<template>
  <h1>hello demo1</h1>
  <span>num: {{ num }}</span><br>
  <button @click="num++">加</button>
</template>

<script>
  // 引入 watch
  import { ref, watch } from 'vue'

  export default {

    setup() {
      let num = ref(0)
      // 监视 num 的变化, 不能使用 num.value（如果 ref 定义的是一个对象，才能使用 num.value）
      watch(num, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })

      return {
        num
      }
    }
  }
</script>

<style>

</style>
```
监听多个：
```vue
<template>
  <h1>hello demo1</h1>
  <span>num: {{ num }}</span><br>
  <button @click="num++">加</button>

  <hr>
  <span>msg: {{ msg }}</span><br>
  <button @click="msg+='!'">加</button>
</template>

<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let num = ref(0)
      let msg = ref('msg')
      // 监视 num 的变化
      // 当然，也可以写多个单独的 watch 来监听
      watch([num, msg], (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })

      return {
        num,
        msg
      }
    }
  }
</script>

<style>

</style>
```
wacth 函数的配置：
```vue
<template>
  <h1>hello demo1</h1>
  <span>num: {{ num }}</span><br>
  <button @click="num++">加</button>

  <hr>
  <span>msg: {{ msg }}</span><br>
  <button @click="msg+='!'">加</button>
</template>

<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let num = ref(0)
      let msg = ref('msg')
      // watch 的第三个参数用于添加额外的配置
      watch([num, msg], (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {immediate: true, deep: true})

      return {
        num,
        msg
      }
    }
  }
</script>

<style>

</style>
```
使用 watch 监听 `reactive`、`ref` 定义的响应式对象数据：
```vue
<template>
  <span>name: {{ person.name }}</span><br>
  <span>age: {{ person.age }}</span><br>
  <button @click="person.name+='1'">修改 name</button><br>
  <button @click="person.age++">修改 age</button>
</template>

<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let person = reactive({
        name: 'zs',
        age: 123
      })

      // 这里有一个问题就是, newValue 和 oldValue 是相同的，因为是同一个引用
      watch(person, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })
      
      // 如果 person 使用 ref 定义的，则应该这样写。这里有一个问题就是, newValue 和 oldValue 是相同的，因为是同一个引用
      watch(person.value, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })

      return {
        person
      }
    }
  }
</script>

<style>

</style>
```
**使用 watch 监听 `reactive` 时，会强制开启 `depp: true`，无法被关闭（这是目前存在的问题，不知道后面会不会被修复）。但是，如果我们监听的是对象里面的对象，则可能需要开启 `deep: true`。**

仅监听对象中的某个属性：
```vue
<template>
  <span>name: {{ person.name }}</span><br>
  <span>age: {{ person.age }}</span><br>
  <span>other: {{ person.other.h.h1 }}</span><br>
  <button @click="person.name+='1'">修改 name</button><br>
  <button @click="person.age++">修改 age</button><br>
  <button @click="person.other.h.h1++">修改 erson.other.h.h1</button>
</template>

<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let person = reactive({
        name: 'zs',
        age: 123,
        other: {
          h: {
            h1: 13
          }
        }
      })
      
      // 第一个参数需要写为函数的形式
      watch(() => person.other.h.h1, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {deep: false})

      return {
        person
      }
    }
  }
</script>

<style>

</style>
```

仅监听对象中的某些属性：
```vue
<template>
  <span>name: {{ person.name }}</span><br>
  <span>age: {{ person.age }}</span><br>
  <span>other: {{ person.other.h.h1 }}</span><br>
  <button @click="person.name+='1'">修改 name</button><br>
  <button @click="person.age++">修改 age</button><br>
  <button @click="person.other.h.h1++">修改 erson.other.h.h1</button>
</template>

<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let person = reactive({
        name: 'zs',
        age: 123,
        other: {
          h: {
            h1: 13
          }
        }
      })

      watch(() => [person.name, person.other.h.h1], (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {deep: false})

      return {
        person
      }
    }
  }
</script>

<style>

</style>
```
如果需要监听 ref 定义的对象，则需要使用如下写法：
```vue
<script>
  import { reactive, computed, ref, watch } from 'vue'

  export default {

    setup() {
      let person = reactive({
        name: 'zs',
        age: 123,
        other: {
          h: {
            h1: 13
          }
        }
      })

      watch(person.value, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })
      
      // 或者使用 deep: true
      watch(person, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {deep: true})

      return {
        person
      }
    }
  }
</script>
```

### watchEffect 函数
和 watch 函数一样，也用于监视数据发生改变。但是，`watchEffect` 不监听某一特定的属性，只要在 `watchEffect` 中使用到的属性被修改时，就会调用 `watchEffect` 中的方法（有点类似 `computed` 函数）。
```vue
<template>
  <span>name: {{ person.name }}</span><br>
  <span>age: {{ person.age }}</span><br>
  <span>other: {{ person.other.h.h1 }}</span><br>
  <button @click="person.name+='1'">修改 name</button><br>
  <button @click="person.age++">修改 age</button><br>
  <button @click="person.other.h.h1++">修改 erson.other.h.h1</button>
</template>

<script>
  import { watchEffect } from 'vue'

  export default {

    setup() {
      let person = reactive({
        name: 'zs',
        age: 123,
        other: {
          h: {
            h1: 13
          }
        }
      })

      watchEffect(() => {
        // 只有 person.name 或 person.other.h.h1 发生改变时才会进入这个方法
        person.name
        person.other.h.h1
        console.log('watchEffect...')
      })

      return {
        person
      }
    }
  }
</script>

<style>

</style>
```

### 自定义 hook 函数

**什么是 hook?**  

本质是一个函数，把 `setup` 函数中使用的 Composition API 进行了封装, 类似于 vue2 中的 mixin。它的作用是复用代码, 让 `setup` 中的逻辑更清楚易懂。

- `App.vue`
```vue
<template>
  <h3>当前鼠标的位置, X: {{ point.x }}, Y: {{ point.y }}</h3>
</template>

<script>
  import usePoint from './hooks/usePoint'

  export default {
    setup() {

      const point = usePoint()

      return {
        point
      }
    }
  }
</script>

<style>

</style>
```

- `src/hooks/usePoint`
```js
import { onBeforeUnmount, onMounted, reactive } from "vue"

export default function() {
  const point = reactive({
    x: 0,
    y: 0
  })

  const getPoint = (event) => {
    point.x = event.pageX
    point.y = event.pageY
  }

  onMounted(() => {
    window.addEventListener('click', getPoint)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', getPoint)
  })
  
  return point
}
```

### toRef、toRefs

`toRef` 和 `toRefs` 的作用是创建一个 RelImpl 响应式对象，其 value 值指向另一个对象中的某个属性。通常用于将响应式对象中的某个属性单独提供给外部使用。

在介绍 `toRef`、`toRefs` 之前，我们先来看一个问题。我们在 `setup` 中定义了一些变量，如果我们把这些变量暴露出去，那么我们应该这样写：

```vue
<script>
  import { ref } from 'vue'

  export default {
    setup() {

      let name = ref('zs')
      let age = ref(10)
      
      return {
        name,
        age
      }
    }
  }
</script>
```
这样的干事有一个弊端，就是如果我们的属性很多，那么 return 就写得比较长了，于是，我们可以进行如下改进，将这些属性都封装在一个对象中，直接向外暴露这个对象即可：
```vue
<template>
  <span>name: {{ data.name }}</span><br>
  <span>age: {{ data.age }}</span><br>
</template>

<script>
  import { reactive } from 'vue'

  export default {
    setup() {

      const data = reactive({
        name: 'zs',
        age: 10
      })

      return {
        data
      }
    }
  }
</script>
```

但是这样写也有一个问题，就是在模板中想要使用 data 中的某些属性时，都要加上 data 前缀，于是，我们可以写成下面这样：
```vue
<template>
  <span>name: {{ name }}</span><br>
  <span>age: {{ age }}</span><br>
</template>

<script>
  import { reactive } from 'vue'

  export default {
    setup() {

      const data = reactive({
        name: 'zs',
        age: 10
      })

      return {
        ...data
      }

      // 和上面的写法等价
      /*return {
        name: data.name,
        age: data.age
      }*/
    }
  }
</script>
```
这样写好像就解决了问题，但是，这样带来了一个很严重的问题，那就是暴露出去的数据失去了响应式。于是 `toRef`、`toRefs` 就诞生了。

- `toRef`

```vue
<script>
  import { reactive, toRef } from 'vue'

  export default {
  
    setup() {
      const data = reactive({
        name: 'zs',
        age: 10,
        job: {
          salary: 20
        }
      })

      return {
        // 不能直接使用 ref(data.name), 因为这相当于直接生成了一个新对象，和之前的数据完全没有关系了
        name: toRef(data, 'name'),
        age: toRef(data, 'name'),
        salary: toRef(data.job, 'salary'),
      }
    }
  }
</script>
```
- `toRefs`

```vue
<script>
  import { reactive, toRefs } from 'vue'

  export default {
    setup() {

      const data = reactive({
        name: 'zs',
        age: 10,
        job: {
          salary: 20
        }
      })
      
      return {
        // 只能暴露一级，不能暴露多级
        ...toRefs(data)
      }
    }
  }
</script>      
```
### shallowReactive
它的作用和  `reactive` 一样，但是它只考虑对象的第一层，对于对象嵌套较深的层次，它无法提供响应式。

**使用场景：**

如果有一个对象数据，结构比较深, 但变化时只是外层属性变化。


### shallowRef

我们知道 `ref` 可以处理基本数据类型和对象类型的响应式，但是 `shallowRef` 只能处理基本数据类型的响应式。

**使用场景：**

如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换。

### readonly 和 shallowReadonly

被 `readonly` 函数处理过的对象不能修改其里面的任何值，被 `shallowReadonly` 函数处理过的对象不能修改其里面第一层级的值（深层次的可以被修改）。

这两个函数可以处理 `ref`、`reactive` 修饰的响应式数据。
```vue
<script>
  import { reactive, readonly, shallowReadonly } from 'vue'

  export default {
    setup() {

      const data = shallowReactive({
        name: 'zs',
        age: 10,
        job: {
          salary: 20
        }
      })

      data = readonly(data)
      data = shallowReadonly(data)

      return {
        ...toRefs(data)
      }
    }
  }
</script>
```
### toRaw、markRaw

toRaw 可以让一个响应式对象变成最原始的样子（即让响应式对象变成一个普通对象）。最新版本的 Vue3 支持 `toRaw` 函数作用于 `ref` 定义的响应式数据。

```vue
<script>
  import { reactive, ref, toRaw } from 'vue'

  export default {
    setup() {
      let c = ref(1)
      let data = ref({
        name: 'zs',
        age: 10,
        job: {
          salary: 20
        }
      })

      c = toRaw(c)

      data = toRaw(data)

      return {
        data,
        c
      }
    }
  }
</script>
```

markRaw 函数用于生成一个普通对象。我们在使用 `reactive` 函数定义响应式对象时，如果我们往这个响应式对象上再追加某些属性，那么追加的属性也是响应式的，如果我们想让追加的数据不是响应式的，那么需要使用 `markRaw` 函数。

```vue
<script>
  import { markRaw, reactive } from 'vue'

  export default {
    setup() {
      let data = reactive({
        name: 'zs',
        age: 10,
        job: {
          salary: 20
        }
      })

      data.other = markRaw({pro1: 'cc'})

      return {
        data,
        c
      }
    }
  }
</script>
```
`toRaw` 使用场景：
1. 用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
2. 提交表单时，将响应式对象转为普通对象。

`markRaw` 使用场景：
1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

### customRef

我们可以使用 `customRef` 来实现防抖的效果，如下：
```vue
<template>
  <input type="text" v-model="str"> <br>
  {{ str }}
</template>

<script>
  import { ref, customRef } from '@vue/reactivity'

  export default {
    setup() {
      function myRef(initValue, time) {
        // 实现防抖
        let timer = null
        return customRef((track, trigger) => {
          return {
            get() {
              console.log('get')
              track() // 跟踪值的变化
              return initValue
            },
            set(newValue) {
              console.log('修改了，新值：' + newValue)
              clearTimeout(timer)
              timer = setTimeout(() => {
                initValue = newValue
                trigger() // 通知模板重新获取最新的值
              }, time);
            }
          }
        })
      }

      let str = myRef('hhh', 500)

      return {
        str
      }
    }
  }
</script>

<style>

</style>
```

### provide 与 inject
它们的作用主要用于祖孙（父子）组件的通信（Vue2 中可以使用事件总线来实现）。父组件有一个 provide 选项来提供数据，子组件有一个 inject 选项来开始使用这些数据。

- `App.vue`
```vue
<template>
  <div class="app">
    <h2>App.Vue</h2>
    {{ data }}
    <Child></Child>
  </div>
</template>

<script>
  import { reactive } from '@vue/reactivity'
  import Child from './components/Child'
  import { provide } from '@vue/runtime-core'

  export default {
    components: {
      Child
    },

    setup() {
      let data = reactive({
        name: 'zs',
        age: 23,
      })

      // 给自己的后代组件传递数据（第一个名字任取, 后代取值时使用这个名字）
      provide('appData', data)

      return {
        data
      }
    }
  }
</script>

<style>
  .app {
    background: blue;
    height: 500px;
    color: #fff;
  }
</style>
```
- `Child.vue`
```vue
<template>
  <div class="child">
    <span>子组件</span><br>
    <Son></Son>
  </div>
</template>

<script>
  import Son from './Son'

  export default {
    components: {
      Son
    }

  }
</script>

<style scoped>
  .child {
    height: 300px;
    background: green;
    color: #fff;
  }
</style>
```
- `Son.vue`
```vue
<template>
  <div class="son">
    <span>孙子组件</span>
    {{ data }}
  </div>
</template>

<script>
  import { inject } from "@vue/runtime-core";

  export default {
    setup() {
      // 使用父组件传过来的值，该值也是响应式的
      let data = inject('appData')
      console.log(data)

      return {
        data
      }
    }
  }
</script>

<style scoped>
  .son {
    background: gray;
  }
</style>
```

### 响应式数据的判断
可以使用以下函数进行判断。

- `isRef` 

    检查一个值是否为一个 `ref` 对象
    
- `isReactive`

    检查一个对象是否是由 `reactive` 创建的响应式代理
    
- `isReadonly` 

    检查一个对象是否是由 `readonly` 创建的只读代理
    
- `isProxy`

    检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

## setup 语法糖
<!-- :::success:
见 [单文件组件 <script setup>](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95)。
::: -->

要启用该语法，需要在 `<script>` 代码块上添加 `setup` 属性：
```vue
<script setup>
  console.log('hello script setup')
</script>
```
里面的代码会被编译成组件 `setup()` 函数的内容。这意味着与普通的 `<script>` 只在组件被首次引入的时候执行一次不同，`<script setup>` 中的代码会在**每次组件实例被创建的时候执行**。

### 顶层的绑定会被暴露给模板

当使用 `<script setup>` 的时候，在 `<script setup>` 中声明的任何顶层的绑定 (包括变量，函数声明，以及 `import` 导入的内容) 都能在模板中直接使用，而不需要使用 `return`：

- `setup` 传统写法

```vue
<template>
  <h1>HelloWorld</h1>
  <!-- 直接在模板中使用 setup 的返回信息 -->
  <div>
    <span>姓名: {{ name }}</span>
    <span>年龄: {{ age }}</span>
    <button @click="sayHello">按钮</button>
  </div>
</template>

<script>
  export default {
    setup() {
      let name = 'zs'
      let age = 23

      function sayHello() {
        console.log(`name: ${name}, age: ${age}`)
      }

      // 向外部暴露属性和方法，以便在 html 的 <template> 中使用
      return {
        name,
        age,
        sayHello
      }
    }
  }
</script>
```

- `setup` 语法糖

```vue
<script setup>
  // 变量
  const msg = 'Hello!'
    
  // 函数
  function log() {
    console.log(msg)
  }
</script>

<template>
  <button @click="log">{{ msg }}</button>
</template>
```

`import` 导入的内容也会以同样的方式暴露。这意味着我们可以在模板表达式中直接使用导入的 `helper` 函数，而不需要通过 `methods` 选项来暴露它：
```vue
<script setup>
  import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

### 响应式
响应式状态需要明确使用响应式 API 来创建。和 `setup()` 函数的返回值一样，`ref` 在模板中使用的时候会自动解包：
```vue
<script setup>
  import { ref } from 'vue'

  const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

### 使用组件

`<script setup>` 范围里的值也能被直接作为自定义组件的标签名使用：
```vue
<script setup>
  import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```
这里 `MyComponent` 应当被理解为像是在引用一个变量。如果你使用过 JSX，此处的心智模型是类似的。其 `kebab-case` 格式的 `<my-component>` 同样能在模板中使用——不过，我们强烈建议使用 `PascalCase` 格式以保持一致性。同时这也有助于区分原生的自定义元素。

### 动态组件

由于组件是通过变量引用而不是基于字符串组件名注册的，在 `<script setup>` 中要使用动态组件的时候，应该使用动态的 `:is` 来绑定：

```vue
<script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```
### 递归组件

一个单文件组件可以通过它的文件名被其自己所引用。例如：名为 `FooBar.vue` 的组件可以在其模板中用 `<FooBar/>` 引用它自己。

请注意这种方式相比于导入的组件优先级更低。如果有具名的导入和组件自身推导的名字冲突了，可以为导入的组件添加别名：

```js
import { FooBar as FooBarChild } from './components'
```

### 命名空间组件

可以使用带 . 的组件标签，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在需要从单个文件中导入多个组件的时候非常有用：

```vue
<script setup>
  import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```
### 使用自定义指令
全局注册的自定义指令将正常工作。本地的自定义指令在 `<script setup>` 中不需要显式注册，但他们必须遵循 `vNameOfDirective` 这样的命名规范：
```vue
<script setup>
  const vMyDirective = {
    beforeMount: (el) => {
    // 在元素上做些操作
    }
  }
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```
### 与普通的 `<script>` 一起使用
`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 在有这些需要的情况下或许会被使用到：

- 声明无法在 `<script setup>` 中声明的选项，例如 `inheritAttrs` 或插件的自定义选项。
- 声明模块的具名导出 (`named exports`)。
- 运行只需要在模块作用域执行一次的副作用，或是创建单例对象。

```vue
<script>
  // 普通 <script>, 在模块作用域下执行 (仅一次)
  runSideEffectOnce()

  // 声明额外的选项
  export default {
    inheritAttrs: false,
    customOptions: {}
  }
</script>

<script setup>
  // 在 setup() 作用域中执行 (对每个实例皆如此)
</script>
```

### 针对 TypeScript 的功能
#### 针对类型的 props/emit 声明
`prop` 和 `emit` 都可以通过给 `defineProps` 和 `defineEmits` 传递纯类型参数的方式来声明：
```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

### 限制
由于模块执行语义的差异，`<script setup>` 中的代码依赖单文件组件的上下文。当将其移动到外部的 `.js` 或者 `.ts` 文件中的时候，对于开发者和工具来说都会感到混乱。因此，`<script setup>` 不能和 `src` 属性一起使用。
