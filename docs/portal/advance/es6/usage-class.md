# class

ES6 引入了 `class` 关键字来定义类，使得面向对象编程更加直观和易于理解。下面是一些关于 ES6 类的基本用法。

```js
// ES5 语法
function Phone(name, price) {
  this.name = name
  this.price = price
}
Phone.prototype.call = function () {
  console.log('打电话')
}
let xiaomi = new Phone('小米', 1999)
xiaomi.call()
console.log(xiaomi)

// ES6 
class Phone {
  // constructor 的方法名是固定的, 当构造实例时, 会自动调用此方法
  constructor(name, price) {
    this.name = name
    this.price = price
  }
  // 只能通过这种方式来定义方法, 不能使用 function
  call() {
    console.log('打电话啦')
  }
}
let xiaomi = new Phone('小米', 1999)
xiaomi.call()
console.log(xiaomi)
```

## 静态成员  

在 js 中，静态成员 (包括方法) 只允许类访问，不能通过实例对象来访问。这与原型上的属性或方法不同。

```js
// ES5
function Phone() {
}
Phone.name = 'pname'
Phone.size = 'psize'

let xiaomi = new Phone()
console.log(xiaomi.name) // undefined

// ES6
class Phone {
  static name = '手机'
  static change() {
    console.log('change')
  }
}
let xiaomi = new Phone()
console.log(xiaomi.name) //undefined
```

## 继承

- ES5 语法  

    ```js
    function Phone(name, price) {
    this.name = name
    this.price = price
    }
    Phone.prototype.call = function() {
    console.log('打电话')
    }
    function SmartPhone(name, price, color) {
    Phone.call(this, name, price)
    this.color = color
    }
    SmartPhone.prototype = new Phone
    SmartPhone.prototype.constructor = SmartPhone

    let xiaomi = new SmartPhone('xiaomi', 1999, 'black')
    console.log(xiaomi)
    ```

- ES6 语法  

    ```js
    class Phone {
    constructor(name, price) {
        this.name = name
        this.price = price
    }
    call() {
        console.log('superCall')
    }
    }
    class SmartPhone extends Phone {
    constructor(name, price, color) {
        super(name, price)
        this.color = color
    }
    // 重写
    call() {
        super.call()
        console.log('subCall')
    }
    }
    let xiaomi = new SmartPhone('xiaomi', 1999, 'black')
    xiaomi.call()
    console.log(xiaomi)
    ```

## getter 和 setter

只要访问成员属性，就会自动调用该属性的 get 方法。get 方法的返回值就是属性值。

```js
class Phone {
  get price() {
    console.log('get price')
    return 'price1'
  }
  set price(newVaule) {
    console.log('set price')
  }
}
let xiaomi = new Phone()
xiaomi.price = 'aaaaaaa'
console.log(xiaomi.price)
```

## 私有属性  

对象中的私有属性使用 `#` 表示，它不能被外部直接访问。

```js
class Person {
  #age;
  name;
  constructor(age ,name) {
    this.#age = age
    this.name = name
  }
}
let person = new Person(10, 'zs')
console.log(person)
console.log(person.#age) // 报错
```
