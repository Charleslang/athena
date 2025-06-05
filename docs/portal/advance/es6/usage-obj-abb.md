# 对象简写

如果某个对象的属性和变量同名，可以直接写变量名而不需要重复写属性名。

```js
let name = 'zxc'
function foo() {
  console.log('foo')
}

let obj = {name, foo}
obj.foo()
```
```js
let obj = {
  foo() {

  }
  // foo: function() {
  //  
  // }
}
```
