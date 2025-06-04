# this

解析器在调用函数时，会向函数内部传递一个隐藏的参数 `this`，`this` 指向当前调用的对象。  

- **示例1**
  
  ```js
  function fun() {
    console.log(this);
  }
  fun(); // Window
  // 等价代码如下
  window.fun(); // fun函数被 Window 对象调用
  ```

- **示例2**

  ```js
  function fun() {
    console.log(this);
  }
  var person = {
    name:'zs',
    method:fun
  }
  person.method(); // Object，此时不再是 Window
  ```

- **示例3**

  ```js
  var name = 'window的name';
  function fun() {
    console.log(this.name);
    // console.log(name); // 永远都是 window.name
  }
  var person = {
    name:'zs',
    method:fun
  }
  fun(); // window 的 name
  person.method();  // zs
  ```

- **示例4**

  ```js
  function Person(color) {
    console.log(this)
    this.color = color;
    this.setColor = function(color) {
      console.log(this)
      this.color = color
    }
    this,getColor = function() {
      console.log(this)
      return this.color
    }
  }

  Person('color'); // this是 window，且只有一条输出语句
  var per = new Person('color'); // this 是 per，且只有一条输出语句
  per.getColor();; // this 是 per
  var obj = {};
  per.setColor.call(obj,'green'); // this 是 obj
  var test = p.setColor;
  test(); // this 是 window
  ```
  ```js
  function f1() {
    function f2() {
      console.log(this);
    }
    f2();
  }
  f1(); // this 是 window
  ```

:::warning 注意 
任何函数本质上都是通过对象调用的，而 `this` 就指向这个对象。如果函数调用时没有指定对象，那么默认就由 window 来调用，此时的 `this` 就是 window。
:::
