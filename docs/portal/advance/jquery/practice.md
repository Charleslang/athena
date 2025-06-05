# 实践

## 操作 className

实现点击标签切换背景，使用了 `toggleClass()` 和 `this`。

```html
<ul>
  <li class="item">
    <p>
      啤酒
      <span>￥ 6</span>
    </p>
  </li>
  <li class="item">
    <p>
      可乐
      <span>￥ 6</span>
    </p>
  </li>
  <li class="item">
    <p>
      枸杞
      <span>￥ 20</span>
    </p>
  </li>
  <li class="item">
    <p>
      红枣
      <span>￥ 18</span>
    </p>
  </li>
  <li class="item">
    <p>
      雪碧
      <span>￥ 3</span>
    </p>
  </li>
  <li class="item">
    <p>
      奶茶
      <span>￥ 12</span>
    </p>
  </li>
</ul>
<button id="buy">Buy</button>
```

```css
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
li {
  width: 300px;
  background: #ededed;
  color: black;
  border-radius: 10px;
  margin-bottom: 15px;
}
p {
  font-size: 18px;
  padding: 10px 10px;
}
p > span {
  float: right;
}
#buy {
  margin: 10px;
  padding: 10px;
  border: 2px solid rgb(30, 186, 248);
  border-radius: 5px;
  background-color: #fff;
  color: rgb(77, 214, 248);
  cursor: pointer;
  outline: none;
}
.active {
  color: #fff;
  background: rgb(30, 186, 248);
}
```

```js
$('.item').click(function() {
  // this 就是原生的 DOM, 而 $()中可以放入原生 DOM
  // 但是不能直接使用 this.toggle, 因为原生的 DOM 没有此方法。
  $(this).toggleClass('active')
  // if ($(this).hasClass('active')) {
  //   $(this).removeClass('active')
  // } else {
  //   $(this).addClass('active')
  // }
})
```

## 表单校验

使用了常用方法 `blur()` 和 `submit()`，即 JS 中的 `onblur()` 和 `onsubmit()`。需要注意的是，submit 方法只能给表单或 submit 类型的按钮使用。onsubmit 是标签的属性，所以它只能写在标签上来调用函数，而且建议写在 form 标签上（如 `onsubmit="return check()"`）。submit 按钮可以直接绑定单击事件，可以不用绑定 submit 或 onsubmit。表单的强大之处在于，当函数的返回值为 true 时，它才会提交。

- **示例1**

  ```html
  <form action="jquerydemo09.html" name="form" id="form">
    <span>用户名</span>: <input id="uname" name="uname" type="text" autocomplete="off"><br>
    <span>密码</span>: <input id="upwd" name="upwd" type="password" autocomplete="off"><br>
    <span>确认密码</span>: <input id="urpwd" name="urpwd" type="password" autocomplete="off"><br>
    <span>年龄</span>: <input id="uage" name="uage" type="text" autocomplete="off"><br>
    <span>电话</span>: <input id="utel" name="utel" type="text" autocomplete="off"><br>
    <span>姓名</span>: <input id="utname" name="utname" type="text" autocomplete="off"><br>
    <span>邮箱</span>: <input id="uemail" name="uemail" type="text" autocomplete="off"><br>

    <button id="btn" type="button">提交</button>
    <!-- <button id="btn" type="submit">提交</button> -->
  </form>
  ```
  ```css
  /* 以下样式是为了使文字两端对齐 */
  span{
    display: inline-block;
    width: 70px;
    /* height: 50px; */
    text-align: justify;
    /* 必须要加上下面这句, 不然会以低端对齐 */
    vertical-align: top;
    overflow: hidden;
  }
  span::after{
    content: " ";
    display: inline-block;
    width: 100%;
    height: 0;
  }
  ```
  ```js
  // 验证年龄
  function checkAge() {
    // 如果此函数写在外面被调用, 则不能使用 $(this).val()
    var $age = $('#uage').val()
    console.log($age)
    if (/^\d{1,2}$/.test($age) && $age >= 18 && $age <= 130) {
      // isNaN(number) 如果是纯数字（不一定是十进制的, 纯数字的字符串也可）, 则返回 false
      console.log('年龄正确')
    } else {
      console.log('年龄错误')
      return false
    }
    return true
  }
  // 验证邮箱
  function checkEmail(){
    var $uemail = $('#uemail').val()
    // /^\w+([-\.]\w+)*@[A-z\d]+(\.[A-z\d]{2,6}){1,2}$/
    if(/^\w+([-\.]\w+)*@[A-z\d]{2,70}(\.[A-z\d]{2,6}){1,2}$/.test($uemail)) {
      console.log('邮箱正确')
    } else {
      console.log('邮箱错误')
      return false
    }
    return true
  }

  $(function () {
    $('#uage').blur(checkAge)
    $('#uemail').blur(checkEmail)
    $('#btn').click(function () {
      var state = checkAge() && checkEmail()
      if (state) {
        $('#form').submit()
      }
    })
  })
  ```

- **示例2**  

  ```html
  密码: <input type="text" name="" id="" onclick="test(this)" value="23">
  ```
  ```js
  function test(params) {
    console.log($(params).val())
  }
  ```
