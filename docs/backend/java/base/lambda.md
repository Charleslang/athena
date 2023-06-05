# lambda

Java8 中的新特性，先来感受一下什么是 lambda。

现在，我们要启动一个线程：

- 原始方式

  ```java
  public static void testOne(){
      new Thread(new Runnable() {
          @Override
          public void run() {
              System.out.println("test...");
          }
      }).start();
  }
  ```

- 使用 lambda

  ```java
  public static void testTwo(){
      new Thread(() -> System.out.println("testTwo...")).start();
  }
  ```

可以看出，lambda 表达式一行就能搞定。接下来，就让我们进入 lambda 的世界。

## 语法

lambda 表达式只有方法参数和方法体。

- 参数  

  使用 () 来表示，当只有一个参数时，小括号可省；没有参数时，小括号不能省。参数的类型可以省（推荐省略）。

- 方法体  

  方法体使用 { } 来包裹，当只有一条语句时，{ } 可省，且该语句不用加分号。

:::tip 提示
lambda 规定，如果要使用 lambda 来代替接口实例的方法，那么该接口中只能有一个抽象方法，因为有多个的话，使用 lambda 表达式会无法识别具体重写的是哪一个方法。
:::

## 函数式接口

函数式接口从哪来？

- JDK 自带  
  
  - 有参，有返回值
  - 无参，无返回值
  - 有参，无返回值
  - 断言式接口
  
- 自定义


:::tip 提示
lambda 可以重写的方法中，该接口或抽象类需要标有一个 `@FunctionalInterface` 注解（前提是该类或接口中只有一个抽象方法），即函数式接口。在 IDEA 中，使用匿名内部类时，如果可以用 lambda 代替，它会给出提示信息。
:::

**函数式接口注意事项**

- 在接口或抽象类中，如果没有 `@FunctionalInterface` 注解，但是有且仅有一个抽象方法，那么也可以使用 lambda。  

- 特殊情况，如果接口中有多个抽象方法，但是只有一个抽象方法是本接口新定义的，且其它抽象方法和 Object 中已有的抽象方法重复，那么该接口仍是函数式接口。
    
  ```java
  @FunctionalInterface
  public interface MyInterface {
      public void myFun(); // 自己新加的
      public String toString(); // 和 Object 中的重名
      public boolean equals(Object obj); // 和 Object 中的重名
  } 
  ```

:::tip 提示
与其它语言不同的是，Java 中的 lambda 可以作为函数式接口的实例。  
:::

## lambda 使用

### 形式一

- 示例一  

  使用 JDK 中自带的。
  ```java
  public static void testThree(){
          Predicate<Integer> p = num -> num < 10;
  //        Predicate<Integer> p = (num) -> {return num < 10;};
          System.out.println(p.test(100)); // return 100 < 10
      }
  ```
  ```java
  public static void test1() {
      /**
       * 将传入的参数进行某些处理
       */
      Consumer<String> consumer = s -> System.out.println(s);
      consumer.accept("123");
  }

  public static void test2() {
      /**
       * 无参，有返回值
       */
      Supplier<Integer> supplier = () -> 1;
      Integer integer = supplier.get();
      System.out.println(integer);
  }

  public static void test3() {
      /**
       * 传入一个参数，并返回一个参数
       */
      Function<String, Integer> function = s -> s.length();
      Integer hello = function.apply("hello");
      System.out.println(hello);
  }

  public static void test5() {
      /**
       * 断言式接口，传入一个参数，返回 boolean
       */
      Predicate<String> predicate = s -> s.contains("ho");
      boolean test = predicate.test("123979hejho");
      System.out.println(test);
  }
  ```
  ```java
  public static void test6(Integer money, Consumer<Integer> consumer) {
      consumer.accept(money);
  }
  // main
  test6(123, m -> System.out.println("水的价格：" + m));

  /* ------------------------------------ */

  // 根据指定规则去过滤字符串
  public static List filter(List<String> list, Predicate<String> predicate) {
      ArrayList<String> result = new ArrayList<>();
      list.forEach(e -> {
          // predicate.test(e) 就是 "123".equals(e)
          if (predicate.test(e)) {
              result.add(e);
          }
      });
      return result;
  }
  // main
  List<String> list = new ArrayList<>();
  list.add("123");
  list.add("1235656");
  list.add("456");
  // 此处的规则是保留元素 123
  List filter = filter(list, e -> "123".equals(e));
  filter.forEach(System.out::println);

  /* ------------------------------------ */
  ```

- 示例二  
    
  - 自定义接口 `MyInterface.java`
  
  ```java
  @FunctionalInterface
  public interface MyInterface {
      public int add(int x, int y); // 自己新加的
      public String toString(); // Object 中的
      public boolean equals(Object obj); // Object 中的
  }
  ```
  
  - 测试
  
  ```java
  public static void testFour(){
      MyInterface mi = (x,y) -> x + y;
      // 两个数相加
      System.out.println(mi.add(1,2));
      
      // 其实以上的方法相当于
      MyInterface mi = new MyInterface() {
        @Override
        public int add(int x, int y) {
            return x + y;
        }
      };
  }
  ```

:::tip 提示
不知道你是否也发现了，它有点 JavaScript 中的函数的影子。
:::

### 形式二

将函数式接口作为方法的参数，即匿名内部类。就像 JavaScript 中那样，将函数作为一个方法的参数，即函数式编程。

- 自定义方法  

  ```java
  // 该方法的第一个参数是一个函数对象
  // 第二个参数是一个实参
  public static String toUpper(Function<String,String> fun, String str){
      // 调用 fun 对象的 apply() 方法。
      return fun.apply(str);
  }
  public static void testFive(){
      // 第一个参数就是函数对象，只不过把函数的类省略了，只留了方法体（匿名内部类）
      // 类似传入的是 JS 中 function fun(){……};
      System.out.println(toUpper((x) -> x.toUpperCase(), "hello world"));
  }
  // 把上面的代码理解为 JS 中的函数会更加容易。
  ```

:::tip 提示
通过上面的例子可以知道，lambda 的一种用法就是来代替匿名内部类，只不过该匿名类省略了类名的方法名，只有方法的实现。
:::

## 方法引用 (Method References)

- 当要传递给 Lambda 体的操作，**已经有实现的方法了**，可以使用方法引用！
- 方法引用可以看做是 Lambda 表达式深层次的表达。换句话说，方法引用就是 Lambda 表达式，也就是函数式接口的一个实例，通过方法的名字来指向一个方法，可以认为是 Lambda 表达式的一个语法糖。  

:::tip 要求
实现接口的抽象方法的参数列表和返回值类型必须与方法引用的方法的参数列表和返回值类型保持一致! 
:::

格式：使用操作符 `::` 将类(或对象)与方法名分隔开来。  

以下是三种主要使用情况: 

- 对象 `::` 非静态方法名  
- 类 `::` 静态方法名  
- 类 `::` 非静态方法名  

  这种方式较为特殊，可以不用完全满足上面的要求

:::warning 注意
不能使用 `对象::静态方法` 的形式。
:::

```java
// Consumer 接口中的 void accept(T t);
// 该方法传递一个参数，而且无返回值
// 这与 System.out 的 println(x) 方法一样
// 所以，可以使用方法引用
public static void test1() {
    Consumer<String> consumer = System.out::println;
    // Consumer<String> consumer = s -> System.out.println(s);
    consumer.accept("123");
}

// Supplier 的 T get();
// 无参，有返回值
public static void test2() {
    // get() 返回值为 List<Person>
    // listPserons() 返回值也为 List<Person>
    // 且都是无参的
    Supplier<List<Person>> supplier = PersonData::listPserons;
    PersonData personData = new PersonData();
    Supplier<List<Person>> supplier1 = personData::listPserons1;
    List<Person> people = supplier.get();
    people.forEach(System.out::println);
}
public class PersonData {
    public static List<Person> listPserons() {
        ArrayList<Person> list = new ArrayList<>();
        // ...
        return list;
    }
    public List<Person> listPserons1() {
        ArrayList<Person> list = new ArrayList<>();
        // ...
        return list;
    }
}

/* ------------------------------------- */
public static int test7() {
    Comparator<Integer> comparator = Integer::compareTo;
    return comparator.compare(11, 2);
}

/* ------------------------------------- */
public static void test3() {
    // 四舍五入
    Function<Double, Long> function = Math::round;
    Long apply = function.apply(1.51);
    System.out.println(apply);
}

/* -------------------特殊情况，类::非静态方法------------------ */
public static void test5() {
    Comparator<Integer> comparator = (o1, o2) -> o1.compareTo(o2);
    // 特殊情况
    //（Integer.compareTo(Interger o1, Integer o2)）会被当成
    // o1.compareTo(o2)，即将第一个参数（o1）作为方法的调用者
    Comparator<Integer> comparator1 = Integer::compareTo;
}
// 将第一个参数作为方法的调用者
public static void test6() {
    BiPredicate<String, String> predicate = (s1, s2) -> s1.equals(s2);
    BiPredicate<String, String> predicate1 = String::equals;
    boolean test = predicate.test("123", "123");
    boolean test1 = predicate1.test("1", "2");
}
public static void test7() {
    Person person = new Person(1, "2", "3");
    Function<Person, String> function = p -> p.getName();
    Function<Person, String> function1 = Person::getName;
    function.apply(person);
    function1.apply(person);
}
```

:::tip 说明
在方法引用中的 `类::非静态方法` 中，实际上是将第一个参数作为方法的调用者（请记住）。
:::

**引用构造器**

通过方法引用来创建对象：

```java
/* 调用无参构造 */
public static void test1() {
    Supplier<Person> supplier = () -> new Person();
    Person person = supplier.get();
    Supplier<Person> supplier1 = Person::new;
    Person person1 = supplier1.get();
}

public static void test2() {
    // 调用 public Person(int id)
    Function<Integer, Person> function = id -> new Person(id);
    Person person = function.apply(1);
    // 调用 public Person(int id)
    Function<Integer, Person> function1 = Person::new;
    Person person1 = function1.apply(1);
}

public static void test3() {
    // 调用 public Person(int id, String name)
    BiFunction<Integer, String, Person> function = (i, n) -> new Person(i, n);
    Person person = function.apply(1, "123");
    // 调用 public Person(int id, String name)
    BiFunction<Integer, String, Person> function1 = Person::new;
    Person person1 = function1.apply(1, "123");
}
```
**数组引用**  

```java
public static void test5() {
    Function<Integer, String[]> function = len -> new String[len];
    String[] strings = function.apply(3);
    Function<Integer, String[]> function1 = String[]::new;
    String[] strings1 = function1.apply(3);
}
```

## Stream API

Stream API 真正的把函数式编程引入到 Java 中。它主要用于计算（常用于集合中）。  

**注意**  

- Stream 不会自己存储数据
- Stream 不会改变原对象，它会返回一个持有结果的新 Stream
- Stream 操作是延迟执行的，只有触发计算（终止）操作时才会被执行
- 一旦执行终止操作，则当前 Stream 对象就不能再被使用（不能再使用它来调用方法），需要重新创建 Stream 对象

**Stream 执行流程**  

- 创建流式对象（Stream 实例化）
- 执行中间操作（过滤、映射等）
- 终止（计算）操作

**创建 Stream 对象的方式**  

```java
// 通过集合
public static void test1() {
    List<Person> people = PersonData.listPserons();
    // 顺序流（类似单线程）
    Stream<Person> stream = people.stream();
    // 并行流（类似多个线程同时处理，因此不能保证元素顺序）
    Stream<Person> personStream = people.parallelStream();
}

// 通过数组
public static void test2() {
    String[] arr = {"1", "2", "3"};
    Stream<String> stream = Arrays.stream(arr);

    Person[] persons = {
            new Person(1, "12"),
            new Person(2, "12"),
            new Person(3, "12"),
    };

    Stream<Person> stream1 = Arrays.stream(persons);
}

// 通过 Stream 的 of()
public static void test3() {
    Stream<Integer> integerStream = Stream.of(1, 2, 3);
}

// 创建无限流（主要用于创造数据）
public static void test5() {
    // 遍历前 10 个偶数（0 + 2 + 2 + 2 + ...）
    // seed 为起始值
    // forEach 即为终止操作
    Stream.iterate(0, t -> t + 2).limit(10).forEach(System.out::println);

    // 产生 10 个随机数
    Stream.generate(Math::random).limit(10).forEach(System.out::println);
}
```
**Stream 的中间操作**  

```java
// filter 过滤
public static void test1() {
    List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9);
    // 统计大于 5 的元素个数
    // count 为终止操作
    long count = integers.stream().filter(s -> s > 5).count();
    System.out.println(count);

    List<Person> people = PersonData.listPserons();
    // forEach 为终止操作
    people.stream().filter(p -> p.getId() > 2).forEach(System.out::println);

}

// limit 截断流
public static void test2() {
    List<Person> people = PersonData.listPserons();
    // 取出前三个
    people.stream().limit(3).forEach(System.out::println);
}

// skip 截断流（跳过前几个）
public static void test3() {
    List<Person> people = PersonData.listPserons();
    // 跳过前三个
    people.stream().skip(3).forEach(System.out::println);
}

// distinct（根据 hashCode 和 equals 去重）
public static void test5() {
    List<Person> people = PersonData.listPserons();
    // 跳过前三个
    people.stream().distinct().forEach(System.out::println);
}

/* -------------- 映射 ---------------- */
public static void test6() {
    List<String> list = Arrays.asList("a", "b", "c");
    list.stream().map(e -> e.toUpperCase()).forEach(System.out::println);
}

// 排序
public static void test8() {
    List<String> list = Arrays.asList("a", "b", "f", "e", "c");
    list.stream().sorted().forEach(System.out::println);
    list.stream().sorted(String::compareTo).forEach(System.out::println);

    List<Person> people = PersonData.listPserons();
    people.stream().sorted((e1, e2) -> Integer.compare(e1.getId(), e2.getId()))
            .forEach(System.out::println);
}


/* ---------------------------- */

public static void test1() {
    List<Integer> integers = Arrays.asList(5, 6, 7, 8, 9);
    // 是否所有元素都大于 3
    boolean b = integers.stream().allMatch(s -> s > 3);
    // 是否有元素大于 3
    boolean c = integers.stream().anyMatch(s -> s > 3);
    // 是否没有任何元素大于 9
    boolean b1 = integers.stream().noneMatch(s -> s > 9);

    // 返回第一个元素
    Optional<Integer> first = integers.stream().findFirst();
    // 随机返回一个元素（使用 stream 会始终返回第一个）
    Optional<Integer> any = integers.parallelStream().findAny();
    System.out.println(any);

    // 统计个数
    long count = integers.stream().count();
    // 求最大值
    Optional<Integer> max = integers.stream().max((e1, e2) -> Integer.compare(e1, e2));
    // 求最小值
    Optional<Integer> min = integers.stream().min((e1, e2) -> Integer.compare(e1, e2));
    Optional<Integer> min1 = integers.stream().min(Integer::compareTo);
}
```

**Stream 的终止操作**  

```java
public static void test2() {
    List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
    // 求和（初始值为 0）
    Integer reduce = integers.stream().reduce(0, (x, y) -> x + y);
    Integer reduce2 = integers.stream().reduce(0, Integer::sum);
    // 未给定初始值，默认为集合第一个元素
    Optional<Integer> reduce1 = integers.stream().reduce((x, y) -> x + y);

    // 计算员工工资
    List<Person> people = PersonData.listPserons();
    Integer reduce3 = people.stream().map(Person::getId).reduce(0, Integer::sum);

    // collect
    List<Integer> collect = integers.stream().filter(s -> s > 5).collect(Collectors.toList());
    Set<Integer> collect1 = integers.stream().filter(s -> s > 5).collect(Collectors.toSet());
}
```
# Optional 类

Optional 是一个容器对象，可以包含也可以不包含 null 值。Optional 在 Java 8 中引入，目的是解决 NullPointerException 的问题。本质上，Optional 是一个包装器类，其中包含对其他对象的引用。在这种情况下，对象只是指向内存位置的指针，并且也可以指向任何内容。从其它角度看，Optional 提供一种类型级解决方案来表示可选值而不是空引用。

在 Java 8 之前，程序员将返回 `null` 而不是 Optional。这种方式没有明确的方法来表示 `null` 可能是一个特殊值。相比之下，在API 中返回 `Optional` 是明确的声明，表示其中可能没有值。如果我们要确保不会出现空指针异常，则需要对每个引用进行显式的空检查，如下所示。

```java
private void getIsoCode( User user){
    if (user != null) {
        Address address = user.getAddress();
        if (address != null) {
            Country country = address.getCountry();
            if (country != null) {
                String isocode = country.getIsocode();
                if (isocode != null) {
                    isocode = isocode.toUpperCase();
                }
            }
        }
    }
}
```

Optional 提供一些方法供我们使用：

1. `Optional.of(T)`

    该方式的入参不能为 `null`，否则会有 NPE，在确定入参不为空时使用该方式。

2. `Optional.ofNullable(T)`

    该方式的入参可以为 `null`，当入参不确定为非 `null` 时使用。

3. `Optional.empty()`

    这种方式是返回一个空 Optional，等效 `Optional.ofNullable(null)`。
