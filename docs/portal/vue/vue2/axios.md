# Axios
Axios 是一个基于 promise 的 HTTP 库，简单的讲就是可以发送 get、post 等请求。  

为什么使用 Axios？为了方便使用网络请求。 

为什么不使用 jQquery 的 Ajax？Vue 开发中不需要使用 jQuery，不必为了一个小小的网络请求而增加 jQuery。

## Axios 特性
1. 可以在浏览器中发送 XMLHttpRequests
2. 可以在 node.js 发送 http 请求
3. 支持 Promise API
4. 拦截请求和响应
5. 转换请求数据和响应数据
6. 能够取消请求
7. 自动转换 JSON 数据
8. 客户端支持保护安全免受 XSRF 攻击

## 使用场景
在特性里面已经有提到，浏览器发送请求，或者 Node.js 发送请求都可以用到 Axios。像 Vue、React、Node 等项目就可以使用 Axios，如果你的项目里面用了 jQuery，此时就不需要多此一举了，jQuery 里面本身就可以发送请求。

## 安装

- 引入 CDN

  ```html
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  ```
  引入完成后，会自动在页面注册一个全局 axios 变量。

- npm 安装

  ```sh
  npm install axios --save
  ```

## 使用  
如果没有后台代码，那么我们可以使用 httpbin.org 这个网站进行测试。 

- **GET 请求**  
  
  ```js
  axios.get(url).then(function(response){}, function(err){})
  ```
  `then` 方法的第一个参数是在请求成功之后触发的函数，第二是在请求失败之后触发的函数；这两个函数都会有一个参数。如果在请求的 url 中传入参数，则应该按照以下的形式：
  ```js
  axios.get(xxx?key1=value1&key2=value2)
  ```
- **POST 请求**  

  和 GET 请求语法类似，但是 url 传参时应该传递一个对象，如下：
  ```js
  axios.post(xxx, {key1:value1,key2:value2})
  ```

- **示例**

  ```html
  <form action="">
      <input type="button" value="get请求" class="get">
      <input type="button" value="post请求" class="post">
  </form>
  <!-- 引入axios -->
  <!-- 导入之后，会在页面注册一个全局的 axios 变量 -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  ```
  ```js
  // 以下参考 https://www.jianshu.com/p/9bcf0002ffa3
  document.querySelector('.get').onclick = function() {
      // 生成三条笑话
      axios.get("https://autumnfish.cn/api/joke/list?num=3")
          .then(function(response) {
              console.log(response)
              console.log(response.data.jokes)
          },function(error) {
              console.log(error)
          })
  }

  // -----用户注册-----
  // 请求地址：https://autumnfish.cn/api/user/reg
  // 请求方法：post
  // 请求参数：username（用户名，字符串）
  // 响应内容：注册成功或失败
  document.querySelector('.post').onclick = function() {
    axios.post("https://autumnfish.cn/api/user/reg", {
        username: "daijunfeng"
      })
      .then(function(response) {
        console.log(response)
      }, function(error) {
        console.log(error)
      })
  }
  ```

- **`axios()`**  

  该方法其实是其它方法的一个基本使用，可支持任意方式的请求。该方法默认是 **GET** 请求。
  ```js
  // 导入 axios
  import axios from 'axios'

  /* --------------------- GET 请求 --------------------- */
  // 无参
  axios({
    url: 'http://123.207.32.32:8000/home/multidata',
    method: 'get'
  }).then(data => {
    console.log(data)
  })

  // 携带请求参数（也可直接拼接在 url 后面）
  axios({
    url: 'http://123.207.32.32:8000/home/multidata',
    method: 'get',
    // 只针对 get 请求时，传递参数
    params: {
      id: 1
    }
  }).then(data => {
    console.log(data)
  })

  /* --------------------- POST 请求 --------------------- */
  // 无参
  axios({
    url: 'http://123.207.32.32:8000/home/multidata',
    method: 'post'
  }).then(data => {
    console.log(data)
  })

  // 携带请求参数
  axios({
    url: 'http://123.207.32.32:8000/home/multidata',
    method: 'post',
    // post请求时，传递参数
    data: {
      id: 1
    }
  }).then(data => {
    console.log(data)
  })

  /* --------------------- 并发请求 --------------------- */
  axios.all([
    axios({
      url: 'http://123.207.32.32:8000/home/multidata'
    }),
    axios({
      url: 'http://123.207.32.32:8000/home/multidata'
    })
  ]).then(results => {
    console.log(results)
  })

  // 将多个请求的结果分开 axios.spread
  axios.all([
    axios({
      url: 'http://123.207.32.32:8000/home/multidata'
    }),
    axios({
      url: 'http://123.207.32.32:8000/home/multidata'
    })
  ]).then(axios.spread((r1, r2) => {
    console.log(r1, r2)
  }))
  ```
  眼熟的方法 `then()`。在 Promise 中，我们提到过，异步请求的回调结果会在这个方法中执行。其实 Axios 请求之后就是返回的一个 Promise 对象，所以，我们可以在 axios 中使用 Promise API。  

在某些情况下，我们的 URL 中可能存在重复的部分，我们可以使用 baseURL 将这些重复的部分提取出来：
```js
axios.all([
  axios({
    baseURL: 'http://123.207.32.32:8000',
    url: '/home/multidata'
  }),
  axios({
    baseURL: 'http://123.207.32.32:8000',
    // 超时时间为 5s
    timeout: 5000,
    url: '/home/multidata'
  })
]).then(axios.spread((r1, r2) => {
  console.log(r1, r2)
}))
```
但是，上面的示例并没有太大的用处，所以我们需要进一步配置。

**axios 全局配置**  

全局配置主要用来配置所有请求的公共部分，如 baseURL、timeout 等。
```js
// 全局配置
axios.defaults.baseURL = 'http://123.207.32.32:8000'
axios.defaults.timeout = 5000

axios.all([
  axios({
    url: '/home/multidata'
  }),
  axios({
    url: '/home/multidata'
  })
]).then(axios.spread((r1, r2) => {
  console.log(r1, r2)
}))
```
**axios 实例**  

在上面的代码中，我们是直接使用的是全局的 Axios，并没有创建它的实例。如果我们想要在请求中进行不同配置，那么，我们可以创建它的实例。
```js
// 进行公共配置
const instance =  axios.create({
  baseURL: 'http://123.207.32.32:8000',
  timeout: 5000
})

instance({
  url: '/home/multidata',
  headers: {
      
  }
}).then(val => {
  console.log(val)
})
```
好了，在经过上面的学习，我们已经知道了如何发送网络请求。现在，我们需要实现一个功能：当页面加载完成后渲染数据库里面的 数据。我们的思路可能是：在组件的 `created()` 函数中发送网络请求即可，如下：
```vue
<template>
  <div id="app">
    <div>{{ data }}</div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'App',
    components: {
    
    },
    data() {
      return {
        data: null
      }
    },
    created() {
      axios({
        url: 'http://123.207.32.32:8000/home/multidata'
      }).then(val => {
        this.data = val
      })
    }
  }
</script>
```
## Axios 封装
上面的代码虽然可以实现功能，但是，我们却不推荐这样使用，因为组件对框架的依赖性太强了，而且如果所有组件都这样使用的话，代码维护起来会很麻烦，所以，我们就可以对网络请求进行封装。  

- `src/network/request.js`

  ```js
  import Axios from 'axios'

  export function request(config) {
  const axios = Axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  // axios 返回的就是 promise
  return axios(config)
  }

  /*----------------------自己封装 Promise ----------------------*/
  // export function request(config) {
  //   return new Promise((resolve, reject) => {
  //     const axios = Axios.create({
  //       baseURL: 'http://123.207.32.32:8000',
  //       timeout: 5000
  //     })

  //     axios(config)
  //       .then(data => {
  //       resolve(data)
  //     }).catch(err => {
  //       reject(err)
  //     })
  //   })
  // }

  /*----------------------封装方式三 ----------------------*/
  // export function request(config, success, error) {
  //   const axios = Axios.create({
  //     baseURL: 'http://123.207.32.32:8000',
  //     timeout: 5000
  //   })

  //   axios(config).then(data => {
  //     success(data)
  //   }).catch(err => {
  //     error(err)
  //   })
  // }
  // export function request(config) {
  //   const axios = Axios.create({
  //     baseURL: 'http://123.207.32.32:8000',
  //     timeout: 5000
  //   })

  /*----------------------封装方式四 ----------------------*/
  //   axios(config.baseConfig).then(data => {
  //     config.success(data)
  //   }).catch(err => {
  //     config.error(err)
  //   })
  // }
  ```

使用封装后的函数：
```js
import {request} from './network/request'

/* ------------- 方式一、二  ---------- */
request({
  url: '/home/multidata'
}).then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})

/* ------------- 方式三  ---------- */
// request(
//   {
//     url: '/home/multidata',
//   },
//   data => {
//     console.log(data)
//   },
//   err => {
//     console.log(err)
//   }
// )

/* ------------- 方式四  ---------- */
// request({
//   baseConfig: {
//     url: '/home/multidata'
//   },
//   success: data => {
//     console.log(data)
//   },
//   error: err => {
//     console.log(err)
//   }
// })
```

## 拦截器
Axios 提供了拦截器，用于我们在发送请求前或得到结果后，进行相应的处理。

Axios 提供了四种拦截：  
- 请求成功  
- 请求失败
- 响应成功
- 响应失败

```js
export function request(config) {
  const axios = Axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  // 拦截请求
  axios.interceptors.request.use(success => {
    // 其实该参数就是我们传递的 config
    // console.log(success)
    // 可以在这里修改我们之前传入的信息

    // 也可以在发送请求时添加动画

    // 验证用户的 token，是否已登录

    // 放行
    return success
  }, err => {
    console.log(err)
  })

  // 拦截响应
  axios.interceptors.response.use(result => {
    // console.log(result)

    // 返回结果，只返回我们需要的数据
    return result.data
  }, error => {
    console.log(error)
  })
  
  // axios 返回的就是 promise
  return axios(config)
}
```

## 示例

- **axios 和 Vue**

  ```html
  <div id="app">
    <button id="btn" @click="myClick">获取笑话</button>
    <button id="btn" @click="myRegister">注册</button><br><br>
    <div v-html="message">123</div>
  </div>
  <!-- 引入 axios -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <!-- 引入 Vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vuejs"></script>
  ```
  ```js
  var app = new Vue({
    el: '#app',
    data: {
      message: ''
    },
    methods: {
      myClick: function() {
        // 注意 axios 里面的回调函数中的 this 已经不再是 Vue
        var that = this
        axios.get("https://autumnfish.cn/api/joke/list?num=3")
          .then(function(response) {
            var jokes = response.data.jokes
            for (var i = 0; i < jokes.length; i++) {
              that.message += jokes[i] + "<br>"
              console.log(that.message)
            }
          }, function(error) {
            this.message = '请求出错'
          })
      },
      myRegister: function() {
        var that = this
        axios.post("https://autumnfish.cn/api/user/reg", {
          username: "daijunfeng"
        }).then(function(response) {
          // console.log(response)
          alert(response.data)
        }, function(error) {
          alert("注册出错")
        })
      }
    }
  })
  ```

:::tip 提示
在 axios 回调函数中的 `this` 指向已经发生改变，所以要把外部的 `this` 保存起来再使用。
:::

- **天气查询**  

  ```html
  <div id="app">
      <!-- 使用 v-model 双向绑定数据 -->
      <input type="text" v-model="city" @keyup.enter="myClick">
      <button @click="myClick">查询天气</button><br>
      热门城市：
      <a href="javascript:;" @click="changeCity('北京')">北京</a> |
      <a href="javascript:;" @click="changeCity('上海')">上海</a> |
      <a href="javascript:;" @click="changeCity('深圳')">深圳</a><br>
      {{ message?'当前温度: '+message:''}}
      <ul>
          <li v-for="(ele,i) in arr">
              {{ ele.date }} -> {{ ele.fengxiang }} -> {{ ele.high }} -> {{ ele.low }} -> {{ ele.type }}
          </li>
      </ul>
  </div>
  <!-- 引入 axios -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <!-- 引入 Vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vuejs"></script>
  ```
  ```js
  var app = new Vue({
    el: '#app',
    data: {
      message: '',
      city: '',
      arr: []
    },
    methods: {
      myClick: function() {
        var that = this
        // 此处使用 http，使用 https 时会出现跨域
        // 注意，在 get 方法里面还是能使用 this
        axios.get('http://wthrcdn.etouch.cn/weather_mini?city=' + this.city)
          .then(function(response) {
            console.log(response)
            that.arr = response.data.data.forecast
            that.message = response.data.data.wendu
          }, function(error) {
            console.log('请求错误')
            console.log(error)
          })
      },
      // 点击查询
      changeCity: function(city) {
        this.city = city
        this.myClick()
      }
    }
  })
  ```

- **音乐播放器**  

  ```html
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>悦听player</title>
    <!-- 样式 -->
    <link rel="stylesheet" href="./css/index.css">
  </head>

  <body>
    <div class="wrap">
      <!-- 播放器主体区域 -->
      <div class="play_wrap" id="player">
        <div class="search_bar">
          <img src="images/player_title.png" alt="" />
          <!-- 搜索歌曲 -->
          <input type="text" autocomplete="off" v-model="music" @keyup.enter="searchMusic" />
        </div>
        <div class="center_con">
          <!-- 搜索歌曲列表 -->
          <div class='song_wrapper'>
            <ul class="song_list">
            <li v-for="(ele,i) in musicArr" :key="i">
              <!-- 播放按钮 -->
              <a href="javascript:;" @click="playMusic(ele.id)"></a> 
              <!-- 歌名 -->
              <b>{{ ele.name }}</b> 
              <!-- 是否有 MV -->
              <span v-if="ele.mvid!=0" @click="getMV(ele.mvid)"><i></i></span>
              </li>
            </ul>
            <img src="images/line.png" class="switch_btn" alt="">
          </div>
          <!-- 歌曲信息容器 -->
          <!-- :class="{playing:isPlay}" 等价于 :class="isPlay?:'playing':''"  -->
          <!-- 类名 playing 增加封面旋转效果 -->
          <div class="player_con" :class="{playing:isPlay}">
            <img src="images/player_bar.png" class="play_bar" />
            <!-- 黑胶碟片 -->
            <img src="images/disc.png" class="disc autoRotate" />
            <!-- 歌曲封面 -->
            <img :src="picUrl==''?'images/wyyyy.png':picUrl" class="cover autoRotate" />
          </div>
          <!-- 评论容器 -->
          <div class="comment_wrapper">
            <h5 class='title'>热门留言</h5>
            <div class='comment_list'>
              <dl v-for="(ele,i) in hotComments" :key="i">
                <!-- :src 为评论用户的头像 -->
                <dt><img :src="ele.user.avatarUrl" alt=""></dt>
                <dd class="name">{{ ele.user.nickName }}</dd>
                <dd class="detail">
                  {{ ele.content }}
                </dd>
              </dl>
            </div>
            <img src="images/line.png" class="right_line">
          </div>
        </div>
        <!-- 底部播放音频按钮 -->
        <div class="audio_con">
          <audio ref='audio' :src="musicUrl" controls autoplay loop class="myaudio" @play="play" @pause="pause"></audio>
        </div>
        <!-- 播放视频按钮 -->
        <div class="video_con" v-show="isShowMv">
          <video  controls="controls" :src="mvUrl"></video>
          <div class="mask" @click="closeMv"></div>
        </div>
      </div>
    </div>
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <!-- 官网提供的 axios 在线地址 -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="./js/music.js"></script>

  </body>

  </html>
  ```
  ```js
  /*
    1:歌曲搜索接口
      请求地址:https://autumnfish.cn/search
      请求方法:get
      请求参数:keywords(查询关键字)
      响应内容:歌曲搜索结果

    2:歌曲url获取接口
      请求地址:https://autumnfish.cn/song/url
      请求方法:get
      请求参数:id(歌曲id)
      响应内容:歌曲url地址
      
    3.歌曲详情获取
      请求地址:https://autumnfish.cn/song/detail
      请求方法:get
      请求参数:ids(歌曲id)
      响应内容:歌曲详情(包括封面信息)
      
    4.热门评论获取
      请求地址:https://autumnfish.cn/comment/hot?type=0
      请求方法:get
      请求参数:id(歌曲id,地址中的type固定为0)
      响应内容:歌曲的热门评论
      
    5.mv地址获取
      请求地址:https://autumnfish.cn/mv/url
      请求方法:get
      请求参数:id(mvid,为0表示没有mv)
      响应内容:mv的地址
  */
  var app = new Vue({
    el: '#player',
    data: {
      music: '',
      musicArr: '',
      musicUrl: '',
      picUrl: '',
      hotComments: [],
      isPlay: false,
      isShowMv: false,
      mvUrl: ''
    },
    methods: {
      // 搜索歌曲
      searchMusic: function() {
        var that = this
        axios.get('https://autumnfish.cn/search?keywords=' + this.music)
          .then(function(res) {
            console.log(res)
            that.musicArr = res.data.result.songs
          }, function(err) {
            alert('访问出错')
          })
      },
      // 播放歌曲
      playMusic: function(musicId) {
        var that = this
        // 获取音乐
        axios.get('https://autumnfish.cn/song/url?id=' + musicId)
        .then(function(res) {
          // console.log(res)
          that.musicUrl = res.data.data[0].url
        }, function(err) {
          alert("获取歌曲信息失败")
        })
        // 获取封面
        axios.get('https://autumnfish.cn/song/detail?ids=' + musicId)
          .then(function(res) {
            // console.log(res)
            that.picUrl = res.data.songs[0].al.picUrl
          }, function(err) {
            alert("封面获取失败")
          })
        // 获取热门评论
        axios.get('https://autumnfish.cn/comment/hot?type=0&id=' + musicId)
          .then(function(res) {
            // console.log(res)
            that.hotComments = res.data.hotComments
            console.log(that.hotComments.length)
          }, function(err) {
            alert('获取评论失败')
          })
      },
      // 音乐播放
      play: function() {
        this.isPlay = true
      },
      // 音乐暂停
      pause: function() {
        this,this.isPlay = false
      },
      // 获取 MV
      getMV: function(mvId) {
        var that = this
        // 此处不判断 mvId 是否为 0，直接在前台判断来显示或隐藏 mv 的图标
        axios.get('https://autumnfish.cn/mv/url?id=' + mvId)
          .then(function(res) {
            // console.log(res)
            that.mvUrl = res.data.data.url
            that.isShowMv = true
          }, function(err) {
            alert('MV 获取失败')
          })
      },
      // 点击遮罩层，mv关闭
      closeMv: function() {
        this.isShowMv = false
        this.mvUrl = ''
      }
    }
  })
  ```
:::tip 强调
只要在一个地方修改了某个值，如果其它地方也使用了该值，则该值会跟着改变，这就是 Vue 的响应式（Reactive）。
:::

:::tip 提示
使用任何的 Vue 操作（指令）时，该元素必须是在 Vue 的一个实例中。
:::
