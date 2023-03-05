# 泛型

在有泛型时，如果不指定，则默认为 Object 类型（泛型擦除）。如果泛型有多个参数，则应使用逗号隔开，如 `<K,V>`。泛型不同的引用不能互相赋值，如下：

```java
ArrayList<Object> list1 = null;
ArrayList<String> list2 = null;

// 编译报错
list1 = list2;

// 如果 A 继承于 B，则 G<A> 与 G<B> 之间没有任何继承关系，二者的共同父类是 G<?>
// 如果 A 继承于 B，则 A<G> 与 B<G> 之间也是继承关系
```
异常类中不能使用泛型。不能使用 `new E[]`，但是可以使用 `E[] e`、`(E[]) new Object()`

**泛型方法**  

泛型方法的泛型类型与泛型类的泛型类型**没有**关系。所谓泛型方法是指在方法中出现了泛型的结构（即方法前出现了 `<T>`），如下：
```java
public <E> List<E> copy(E[] arr) {
    ArrayList<E> list = new ArrayList<>();
    for(E e : arr) {
        list.add(e);
    }
    return list;
}
```
**通配符** 

- `?`  

  该通配符可以接收任意泛型，但是该通配符只有可读（读取出来的数据默认类型是 Object）的权限（不能对其进行添加、修改等操作，但是可以添加 `null`）。

- `<? extends Number>`  

  只允许泛型为 Number 及 Number 的子类调用。被该泛型修饰时，不能进行添加操作。
  ```java
  /* 假如 Student 继承自 Person */
  List<? extends Person> list1 = null;
  List<Student> list2 = null;

  list1 = list2;
  ```

- `<? super Number>`  

  只允许泛型为 Number 及 Number 的父类调用。被该泛型修饰时，只能添加 Number 类型及其子类。
  ```java
  /* 假如 Student 继承自 Person */
  List<? super Student> list1 = null;
  List<Person> list2 = null;

  list1 = list2;
  ```

- `<? extends Comparable>`  

  只允许实现了 Comparable 接口的类引用调用。
  