# Vue 指令

## v-text

此命令用来替换标签内的文本 (innerText)，该指令写在 html 标签上。为了理解的简便，使用时可以把它当成标签的一个属性。

```html
<div id="app1" v-text="message">
  app1
  <!-- <span v-text="message">div > span</span> -->
  <span>div > span</span>
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    message: 'Hello Vue.js'
  }
})
```
:::warning 注意
在指令中使用的值没有 `{{ }}`。
:::

此指令会将其标签内的所有内容和元素标签给替换掉，所以，一般不推荐这样直接写，可以使用如下方式：
```html
<div id="app">
  <span>您好 {{ message }}</span>
</div>
```
当然，`v-text` 也支持字符串的拼接：
```html
<div id="app1" v-text="message + '这是拼接的字符串！'"></div>
```

## v-html
使用此指令来设置标签的 innerHTML。
```html
<div id="app" v-html="message">
  您好
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    message: '<li>这是 li 标签</li>'
  }
})
```
## v-on
为元素绑定事件，语法 `v-on:事件类型="方法名"`。事件类型就是在原生 JS 的事件上去掉 `on`。事件调用的函数写在 Vue 实例的 methods 属性中，methods 的语法如下：
```js
var app = new Vue({
  el: '#app',
  methods: {
    myFunction: function() {
      // ...
    },
    otherFunction: function() {
      // ...
    }
  }
})
```
示例如下：
```html
<!-- <button id="app1" v-on:click="myClick">点击button</button> -->
<!-- <button id="app1" @click="myClick">点击button</button> -->
<div id="app1">
  <input type="text" value="番茄" @click="changeText">
  <p>{{ myData }}</p>
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    myData: '文字描述...'
  },
  methods: {
    myClick: function() {
      // 此时的 this 是该 Vue 对象，即 app1
      console.log(this)
    },
    changeText: function () {
      this.myData += "炒鸡蛋"
    }
  }
})
```
Vue 还为我们提供一种更加简单的写法，使用 `@事件类型="方法名"`。在上面的例子中我们已经使用到了。  
另外，通过观察上面的代码，你可能已经发现了，我们每次调用 `changeText` 函数时，myData 都会进行字符串的 `+=`  操作，这就实现了对数据的修改，当然，这些知识我们会在后续的操作中讲到。说到事件，你是否已经想到了怎样在 Vue 中操作 DOM，但是，很遗憾的是，Vue 中极力反对我们这样做, 但是 Vue 也为我们提供了操作 DOM 的方式。    

:::tip 小贴士
如果你在 Vue 中还想要操作 DOM，那么奉劝你早点抛弃这种思想。
:::

能否在事件函数中传递参数呢？肯定也是可以的：
```html
<div id="app1">
  <p @click="paramFun(123, '111')">带有参数</p>
  <!-- 事件修饰符 -->
  <input @keydown.enter="keyDownFun" />只有按回车才会触发
</div>
```
```js
var app1 = new Vue({
  el: '#app1',
  data: {
    myData: '文字描述...'
  },
  methods: {
    paramFun: function(p1, p2) {

    },
    keyDownFun:function(e) {
      console.log(e.key)
    }
  }
})
```
如果事件的参数既要浏览器的 Event 对象，又要使用传入的参数，那么，只需要传入 `$event` 即可。
```html
<div id="app">
  <button @click="myClick(123,$event)">按钮1</button>
</div>
```
```js
const app = new Vue({
  el: '#app',
  methods: {
    myClick(x, event) {
      console.log(x, event)
    }
  }
})
```
:::tip 提示
上面的例子中提到了事件的修饰符，详情请查看 [v-on](https://v2.cn.vuejs.orgv2/api/#v-on)。
:::

:::warning 注意
在**事件监听**时，如果方法没有参数，则方法的括号可省（只针对事件监听函数）。如果方法有参数，且调用时，省略了括号，那么此时的参数默认就是浏览器自动生成的 Evnet 对象；如果有参数，且调用方法时加上了括号，但是没有传参，那么此时的参数就是 undefined。
:::

### 事件修饰

- 阻止冒泡  

  使用 `.stop`，本质相当于 `event.stopPropagation()`。
  ```html
  <div @click="divClick">
    <!-- 这里的 this 是 window -->
    <button @click.stop="myClick(this)" ref="b1">按钮1</button>
  </div>
  ```

- 阻止默认行为  

  使用 `.prevent`，本质相当于 `event.preventDefault()`。
  ```html
  <a href="http://www.baidu.com" @click.prevent="divClick()">点击</a>
  ```

- 键盘  

  当键盘按下某个键时，我们才需要执行事件，这时就可以使用修饰，形如 `.keyCode|keyAlias`。

- 只触发一次回调  

  使用 `.once`。

## v-show
根据表达式的真假来显示或隐藏元素。其本质是给元素增加的内联的  `display:none` 或者其它。
```html
<div id="app">
  <p v-show="false">锄禾日当午</p>
  <p>汗滴禾下土</p>
  <p v-show="age>=18">谁知盘中餐</p>
  <p v-show="isShow">粒粒皆辛苦</p>
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    isShow: false,
    age: 18
  }
})
```
:::tip 提示
`v-show` 后面的值都会被解析成 boolean 值。
:::

## v-if
根据表达式的真假来操作 DOM。它也可以来修改元素的显示与隐藏。  
```html
<div id="app">
  <p v-if="true">p1</p>
  <p v-if="isShow">p2</p>
  <p v-if="3>6">p3</p>
  <button @click="toggleIsShow">切换</button>
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    isShow: false
  },
  methods: {
    toggleIsShow: function() {
      this.isShow = !this.isShow
    }
  }
})
```
`v-if`、`v-else-if`、`v-else` 的使用：  
```html
<div id="app">
  <ul>
    <li v-if="num===1">第1个li</li>
    <li v-else-if="num===2">第2个li</li>
    <li v-else>第3个li</li>
  </ul>
</div>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num: 1
  }
})
```
当条件较多时，建议使用 computed 来代替这些指令: 
```html
<h3>{{ result }}</h3>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    num: 1
  },
  computed: {
    result() {
      let mes
      if (this.num === 1) {
        mes = '第1个li'
      } else if (this.num === 2) {
        mes = '第2个li'
      } else {
        mes = '第3个li'
      }
      return mes
    }
  }
})
```
请注意，使用 `v-if` 时，如果为 false，则它会将该元素从页面中删除；当为 true 时，元素又会被重新加入该页面（实质就是操作 DOM）。而使用 `v-show` 时，元素一直都存在于网页的结构中，只是改变了元素的 `display` 属性。如果元素会被频繁地切换，则推荐使用 `v-show`，因为操作 DOM 会费性能。

- 用户类型切换案例  

  ```html
  <span>{{ isPhone? '手机用户':'邮箱用户' }}</span>
  <input type="text" placeholder="手机号" v-if="isPhone">
  <input type="text" placeholder="邮箱" v-else>
  <button @click="isPhone =!isPhone">切换类型</button>
  ```
  上面的代码虽然可以实现用户类型切换，但是，当用户输入之后在点击切换，这时，输入框的内容不会被清空，这是由于 Vue 在渲染 DOM 时，出于性能考虑，会尽可能复用已经存在的元素。如果想要清空（即不复用），那么，可以给标签加上 key，且 key 值不相同。
  ```html
  <span>{{ isPhone? '手机用户':'邮箱用户' }}</span>
  <input type="text" placeholder="手机号" v-if="isPhone" key="phone">
  <input type="text" placeholder="邮箱" v-else key="email">
  <button @click="isPhone =!isPhone">切换类型</button>
  ```
  :::tip 注意
  这里的 key 没有冒号。
  :::

## v-bind

如果想要操作元素的某个属性（比如 src、title、class 等），我们可以使用 `v-bind` 指令，语法为：`v-bind:属性名=表达式`。当然，`v-bind:` 也可以简写为 `:`。
```html
<div id="app">
  <p v-bind:title="title + '大法好'">测试title</p>
  <!-- 以下的两种写法等价 -->
  <p v-bind:class="isActive? 'active':''">测试active</p>
  <p v-bind:class="{active:isActive}">测试active</p>
  <!-- 也可以使用 : 代替 v-bind: -->
  <!-- 解释：active这个类名是否生效，取决于 isActive 的值 -->
  <p :class="{active:isActive}">测试active</p>
  <p :class="{'active':isActive}">测试active</p>
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    title: 'Vue.js',
    isActive: true 
  }
})
```
如果在使用 `v-bind` 前，该标签有了相同的属性，则 'v-bind' 会在原属性之后追加。
```html
<p :class="success" class="c1">{{2>3}}</p>
<!-- 如果 success 的值是 success，那么 class 会变成 "c1 success" -->
```
该指令支持自定义属性。  

`v-bind` 也支持对象绑定，其实在上面已经使用过了，如下：
```html
<p :class="{k1:v1, k2:v2}">ppp</p>
```
其中，value 只能是 boolean 类型，当 value 为 true 时，其 key 才生效。优化如下：
```html
<!-- 注意，此时的方法必须要有大括号 -->
<span :class="classes()" class="bar" id="main">cl</span>
```
```js
const data = {
  flag: false,
  success: 'success',
  message: 'message',
  isActive: true
}
const app = new Vue({
  el: '#main',
  data: data,
  methods: {
    classes: function() {
      return { active: this.isActive, turn: this.isActive }
    }
  }
})
```
当然，该指令也支持数组，只不过该数组是方法或计算属性，如下：
```html
<!-- 建议直接指定class，不建议这样使用 -->
<span :class="['active', 'bar']"></span>
<!-- 等价写法如下，其中 active 和 bar 是变量 -->
<span :class="[active, bar]"></span>
```
绑定 css 样式，也可以使用数组或对象：
```html
<p :style="{'background':'#ccc', 'font-size': '20px'}">qqq</p>
```
其中，可以使用驼峰代替-，如下：
```html
<p :style="{'background':'#ccc', 'fontSize': '20px'}">qqq</p>
```
当然，这些值也可以通过变量传递。
```html
<p :style="{background:bgc, fontSize: '20px'}">qqq</p>
```
数组如下：
```html
<p :style="[style, xxx]">qqq</p>
```
```js
const app = new Vue({
  el: '#main',
  data: {
    style: {
      background: 'red'
    }
  }
})
```
:::warning 注意
key 可以不加引号，它们都会被 Vue 解析为字符串；而 value 如果不加引号，则会被解析为变量。v-bind 的其它用法请见[动态参数](https://v2.cn.vuejs.org/v2/guide/syntax.html)。
:::

## v-for
循环，语法：`v-for="(ele,index) in xxx"`。如果没有 index，则可以省略括号。`v-for` 遍历出来的元素等可以被其它指令使用，如指令 `:` 。数组元素的更新会同步到页面上，是响应式（Reactive）的。   

:::tip 注意
在某些情况下使用 `v-for` 时，最好再给该元素添加 `v-bind:key="index"` 来保证元素的一致性，后面会有更加详细的介绍，这里只是说明一下。
:::

```html
<div id="oul">
  <ul>
    <!-- <li v-for="item in arr" :title="item">{{ item }}</li> -->
    <!-- <li v-for="item in objArr" :title="item.name">{{ item.name }} -> {{ item.age }}</li> -->
    <li v-for="(item,index) in objArr" :title="item.name" v-bind:key="index">{{ item.name }} -> {{ item.age }}</li>
  </ul>
  <button @click="addEle">增加</button>
  <button @click="deleteEle">减少</button>
</div>
```
```js
var oul = new Vue({
  el: '#oul',
  data: {
    arr: [1,2,3],
    objArr: [
      {name: 'zs', age: 20},
      {name: 'ww', age: 22},
      {name: 'll', age: 30}
    ]
  },
  methods: {
    addEle: function() {
      this.objArr.push({name: 'mm', age: 23})
    },
    deleteEle: function() {
      // this.objArr.pop()
      this.objArr.shift()
    }
  }
})
```
上面是使用 `v-for` 来遍历数组，接下来使用它来遍历对象。
```html
<!-- 获取到的是 value -->
<li v-for="prop in obj" v-text="prop"></li>
<!-- 获取 key 和 value -->
<li v-for="(v, k) in obj" v-text="k + ': ' + v"></li>
<!-- 获取 key 、 value、index -->
<li v-for="(v, k, i) in obj" v-text="k + ': ' + v + ': ' + i"></li>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    obj: {
      age: 18,
      name: 'zs',
      height: 173
    }
  }
})
```
`:key` 的使用：  
```html
<li v-for="ele in arr">{{ ele }}</li>
```
```js
const app = new Vue({
  el: '#app',
  data: {
    arr: ['A','B','C','D','E','F']
  }
})
```
在 B 后面插入一个新的元素 G，执行：
```js
app.arr.splice(2,0,'G')
```
由于我们没有设置 key，所以，这时的插入就是把 C 变成 G，然后把 D 变成 C，把 E 变成 D，...  ，最终得到ABGCDEF，这样十分浪费性能，所以，需要在循环时加上 key，这样就只会在 B 后面插入 G，而不会依次修改数组中的元素。  

:::details 注意
但是，需要注意的是，并不是所有的操作都会引起数据响应式。下面以数组为例。  

- **不会出现数据响应式**  

  通过下标操作数组

- **会出现响应式操作的部分操作**  
  - pop() 出栈  
  - push('2','3') 入栈  
  - shift() 删除第一个元素  
  - unshift('S','H') 在最前面插入元素  
  - splice() 添加，删除，修改  
  - sort()  
  - reverse()  

- **vue 自带的方法**  

  ```js
  // 使用 set 方法修改数组元素（reactive）  
  Vue.set(this.arr, 1, 'change')
  ```
:::

结合 `v-bind` 制作菜单点击效果：
```html
<ul id="app">
  <li v-for="(e,i) in roles" v-text="i + 1 + ':' + e" :class="{active:i===isi}" @click="menu(i)"></li>
</ul>
```
```js
const data = {
  roles: ['焰灵姬', '晓梦', '田密'],
  isi: 0
}
const app = new Vue({
  el: '#main',
  data: data,
  methods: {
    menu: function(i) {
      this.isi = i
    }
  }
})
```
除了上面的用法之外，`v-for` 还可以遍历数字（从 1 开始，会包含结束的数字）。
```html
<div v-for="e in 9">{{e}}</div>
```
## v-model
获取和设置**表单**元素的值，它也被称为双向数据绑定。即只要更改了一个地方的值，则其它地方的值也会被改变。  
```html
<div id="app">
  <!-- 此处使用 @keyup 更加合理 -->
  <input type="text" name="" id="" v-model="message" @keyup="getMes">
  <p>{{ message }}</p>
  <button @click="setMes">修改 message</button>
</div>
```
```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js'
  },
  methods: {
    getMes: function() {
      console.log(this.message)
    },
    setMes: function() {
      this.message = 'this is message !'
    }
  }
})
```
其实 `v-model` 就相当于以下的实现效果：
```html
<div id="app">
  <input type="text" :value="mes" @input="change">
  <span>{{ mes }}</span>
</div>
<!-- 简写如下 -->
<input type="text" :value="mes" @input="mes = $event.target.value">
```
```js
methods: {
  // 不传入参数时，默认就是 event
  change(event) {
    console.log(event.target)
    this.mes = event.target.value
  }
}
```

- 结合单选按钮使用  
  
  ```html
  <!-- 因为两个单选按钮都绑定了同一个变量，所以 name 属性可以省略 -->
  <!-- 如果 sex 设置的默认值和单选按钮的 value 相同，那么此按钮默认被选中，所以无需设置 checked -->
  <label for="male">
    <input type="radio" value="0" id="male" v-model="sex">男
  </label>
  <label for="female">
    <input type="radio" value="1" id="female" v-model="sex">女
  </label>
  <!-- 单选时，当选中时，agree 的值就会自动变为 true -->
  <label for="f">
    <input type="checkbox" id="f" v-model="agree">同意协议
  </label>
  <button :disabled="!agree">下一步</button>
  <!-- 多选, hobby必须是数组，否则程序会将其解析为 boolean -->
  <label for="p">
    <input type="checkbox" name="hobby" id="p" value="乒乓球" v-model="hobby">乒乓球
  </label>
  <label for="y">
    <input type="checkbox" name="hobby" id="y" value="羽毛球" v-model="hobby">羽毛球
  </label>
  <label for="l">
    <input type="checkbox" name="hobby" id="l" value="编程" v-model="hobby">编程
  </label>
  <!-- v-model 是放在 select 标签上 -->
  <!-- 由于 fruit 的值是葡萄，所以 value 为葡萄的被默认选中 -->
  <select name="" id="" v-model="fruit">
    <option value="香蕉">香蕉</option>
    <option value="葡萄">葡萄</option>
    <option value="黄桃">黄桃</option>
  </select>
  <p>{{ fruit }}</p>
  <!-- 多选 -->
  <select name="" id="" multiple v-model="fruitArr">
    <option value="香蕉">香蕉</option>
    <option value="葡萄">葡萄</option>
    <option value="黄桃">黄桃</option>
  </select>
  <p>{{ fruitArr }}</p>
  ```
  ```js
  data: {
    mes: '123',
    sex: 0,
    agree: false,
    hobby: [],
    fruit: '葡萄',
    fruitArr: []
  }
  ```
  :::tip 提示
  在 Vue 中使用表单时，可以尝试不用直接提交表单，而是通过数据双向绑定之后，直接将得到的数据通过网络请求发送给服务器。
  :::

- 优化数据绑定  

  在上面的代码中，我们可能做了许多重复的工作，这里使用 Vue 的值绑定来进行简化。
  ```html
  <label :for="i" v-for="(e, i) in originArr">
    <input type="checkbox" :value="e" :id="i" v-model="hobby">{{ e }}
  </label>
  ```
  ```js
  data: {
    hobby: [],
    originArr: ['香蕉','哈密瓜','黄桃']
  }
  ```

### 修饰符

在 `v-model` 中，我们也可以使用修饰符。

- `.lazy`  

  当使用 `v-model` 时，数据可能更新得太频繁了，有时我们只需要按下**回车**或**失去焦点**时才需要得到数据，这时就可以使用 `.lazy`（类似 `.enter`）
  ```html
  <input type="text" v-model.lazy="mes">
  ```

- `.number`  

  由于 input 框中获取的值都是 String 类型，如果我们想要转为 Number，那么就可以使用此修饰符。此方式相当于 `parseFloat()`。
  ```html
  <input type="text" v-model.number="num">
  <p>{{ num }}-{{ typeof num }}</p>
  ```

- `.trim`  

  去掉字符串前后的空格。
  ```html
  <input type="text" v-model.trim="str">
  <p>{{ 'jj' + str + 'll' }}</p>
  ```

:::tip 参考
[修饰符](https://v2.cn.vuejs.org/v2/guide/forms.html#%E4%BF%AE%E9%A5%B0%E7%AC%A6)
:::

## v-once

只渲染元素和组件 **一次**。当数据发生变化时，该组件的内容不会再次渲染。
```html
<p v-once>{{ success }}</p>
```

:::tip 提示
详情请查看 [once](https://v2.cn.vuejs.org/v2/api/#v-once)
:::

## v-pre

跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。
```html
<p v-pre>{{ message }}</p>
<!-- 上面的代码会直接显示 {{ message }} -->
```
## v-cloak

这个指令保持在元素上直到关联实例结束编译。和 CSS 规则 (如 `[v-cloak] { display: none }`) 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。该标签可以使界面在渲染前不出现 `{{ // ... }}`，当 vue 解析完成之后，该指令会被移除。
```css
[v-cloak] {
  display: none;
}
```
```html
<span v-cloak>{{ message }}</span>
```
