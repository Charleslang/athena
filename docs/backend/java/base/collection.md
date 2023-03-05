# 集合

Java 中的集合可以分为 `Collection` 和 `Map` 两个接口。其中 `Collection` 又可以分为 `List` 和 `Set` 两个接口。`List` 为有序、可重复的集合。`Set` 为无序、不可重复的集合。

![20230305214222](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-03-05/20230305214222.png)

**常用方法**  

`size()`、`isEmpty()`、`clear()`、`contains()`、`containsAll(Collection e)`、`remove()`、`removeAll(Collection e)`、`retainAll(Collection e)（求交集）`、`equals()`（判断两个集合是否相同，在 `ArrayList` 中会要求顺序；`Set` 中不会考虑顺序）、`toArray()`、`iterator()`。

- `contains()`  

  遍历集合，找出是否包含该元素（第一次出现的位置）。对于对象类型来讲，实际上是调用对象的 `equals()` 方法。源码如下：
  ```java
  public boolean contains(Object o) {
      return indexOf(o) >= 0;
  }

  public int indexOf(Object o) {
      if (o == null) {
          for (int i = 0; i < size; i++)
              if (elementData[i]==null)
                  return i;
      } else {
          // 判断是否包含对象类型
          for (int i = 0; i < size; i++)
              if (o.equals(elementData[i]))
                  return i;
      }
      return -1;
  }
  ```

- `remove(Object e)`  

  源码如下：
  ```java
  public boolean remove(Object o) {
      if (o == null) {
          for (int index = 0; index < size; index++)
              if (elementData[index] == null) {
                  fastRemove(index);
                  return true;
              }
      } else {
          for (int index = 0; index < size; index++)
              // 调用对象的 equals 方法
              if (o.equals(elementData[index])) {
                  fastRemove(index);
                  return true;
              }
      }
      return false;
  }
  ```

**数组转 List 中的坑**

```java
List list = Arrays.asList(new int[]{1,2})
System.out.println(list.size()); // 1

List list = Arrays.asList(new Integer[]{1,2})
System.out.println(list.size()); // 2
```

**遍历集合**  

**1. 迭代器遍历**    

`Iterator` 是一个接口，它也是一种设计模式，主要就是为了遍历集合（容器）。 `Collection` 接口继承了该接口。
```java
Iterator iterator = list.iterator();
while (iterator.hasNext()) {
    Object next = iterator.next();
    System.out.println(next);
}
```

:::tip 注意
每次调用 `iterator()` 都会返回一个新的 `Iterator` 对象。
:::

**使用迭代器删除元素**

```java
ArrayList<Integer> c = new ArrayList<>();
c.add(1);
c.add(5);
c.add(6);
c.add(7);
c.add(3);

Iterator<Integer> iterator = c.iterator();
while (iterator.hasNext()) {
    int next = iterator.next();
    if (next == 3) {
        // 不能连续多次调用 remove()
        iterator.remove();
    }
}

Iterator<Integer> iterator2 = c.iterator();
while (iterator2.hasNext()) {
    int next = iterator2.next();
    System.out.println(next);
}
```
**2. forEach 遍历集合**  

底层还是使用的增强 `for`，增强 `for` 的底层实际上是 `Iterator`。
```java
Collection collection = new ArrayList();
collection.add(1);
collection.add(2);
collection.add(3);

collection.forEach(System.out::println);
```

## List 常用类的比较

List 储存的是有序、可重复的元素，它是一个**动态数组**。List 是一个单列数组（只有值，没有 key）

### ArrayList、LinkedList、Vector

**相同之处**  

都实现了 `List` 接口，内部是有序、可重复的

**不同之处**  

- `ArrayList`  

  线程不安全，效率高；底层使用 `Object[] elementData` 来存储

- `LinkedList`  

  底层使用双向链表存储；对于频繁的插入、删除操作，效率比 `ArrayList` 高

- `Vector`  

  `Vector` 的出现时机比其它两个早。线程安全，效率低；底层使用 `Object[] elementData` 来存储 


**ArrayList 源码分析**  

- JDK 7  

  ```java
  ArrayList list = new ArrayList();
  // 无参构造器，它会调用本类中的有参构造器，将底层的 Object[] 数组初始化，且长度为 10。

  list.add(e);
  // 在添加元素之前，会先检查数组的长度，如果长度超出原有的长度，则会进行扩容
  // 扩容的核心代码为 int newCapacity = oldCapacity + (oldCapacity >> 1)
  // 即扩容为原来的 1.5 倍（有小数怎么办 ? 百度扩容机制，如果扩容后还是不够 ?）
  // 右移使用的是 / 除（即向下取整），所以不会有小数
  // 然后创建一个新的数组，并将原数组通过 Arrays.copyOf() 进行复制

  /* 建议在开发中使用带参的构造器 */
  ArrayList list = new ArrayList(int capacity);
  ```

- JDK 8

  ```java
  ArrayList list = new ArrayList();
  // 底层创建了一个空数组

  list.add(e);
  // 添加前，会先检查容量。
  // 如果是第一次添加，则会将数组长初始化为 10
  // 后续操作与 JDK 7 相同

  /* 这样设置会节省内存（懒汉式） */
  ```

**Vector 源码分析** 

```java
Vector v = new Vector();
// 创建了长度为 10 的数组
// 扩容时，默认扩容为原来的 2 倍
```

## List 接口中的常用方法

这些方法都是 `List` 中独有的，在 `Collection` 中没有。`add()`、`set()`、`subList()`、`indexOf()`、`lastIndexOf()`、`remove(int index)`
```java
public static void main(String[] args) {
    ArrayList list = new ArrayList();
    list.add(1);
    list.add(2);
    list.add(3);
    up(list);
    System.out.println(list);
}

public static void up(List list) {
    // 是通过索引删除，不是删除这个数字 2
    list.remove(2);
    // 删除数字 2 
    list.remove(new Integer(2));
}
```
## Set
`Set` 接口是 `Collection` 的子接口，它没有提供额外的方法。它使用的都是 `Collection` 中的方法。`Set` 判断两个对象是否相等时，使用的是 `equals()` 方法。`Set` 是无序、不重复的。

**无序性**  

这里以 `HashSet` 为例，当我们遍历 `Set` 时，元素的输出顺序可能不是我们添加元素的顺序。无序不等于随机性。输出顺序等于底层数组的添加顺序，底层数组的添加顺序是根据 Hash 值决定的（并不是数组的索引顺序）。所以，这里的无序性实际上指的是元素添加顺序是无顺序的。

**不可重复性**  

这里以 `HashSet` 为例，`Set` 怎么判断元素是否重复呢？对于基本数据类型来讲，就是判断其值是否相等。对于引用数据类型，`Set` 会调用它的 `equals()` 进行比较（注意，这里重写 `equals()` 时必须重写 `hashCode()` ，只有这样，我们重写的 `equals()` 方法才生效，否则就是调用 Object 中的 `equals()`）。

**添加元素的过程**  

这里以 `HashSet` 为例，添加元素时，首先会计算该元素的 hash 值（通过调用该元素所在类的 `hashCode()`），然后在数组中查找，看是否已经存在该 hash 值，如果不存在，则添加（通过 hash 来确定添加的位置），否则调用该元素的 `equals()` 来与和它 hash 值相同的元素进行比较，如果 `equals()` 返回 false，则代表着两个元素不相同，则进行添加（hash 值相同，元素不一定相同；hash 不同，则两个元素一定不同）。添加时，若 hash 值不相同，但是计算出在数组中的存放位置相同，那么此时采用链表的形式进行添加。  

`HashSet` 底层是 `HashMap`，在调用 HashSet 的 `add()` 方法时，实际上是调用的 map 的 `put()` 方法，将 add() 中的元素作为 map 的 key，而 map 的 value 实际上是一个 Object 对象，这个对象是用 static 修饰的（即所有的 key 都指向同一个 value，节省内存），源码如下：
```java
private transient HashMap<E,Object> map;

// Dummy value to associate with an Object in the backing Map
private static final Object PRESENT = new Object();

public HashSet() {
    map = new HashMap<>();
}

/* ------------ */
public boolean add(E e) {
    // put 方法的返回值就是 map 的 value
    return map.put(e, PRESENT)==null;
}
```

### HashSet、LinkedHashSet、TreeSet
**HashSet**  

它是 `Set` 的主要实现类，线程不安全，可以存储 **null** 值。底层是 hashMap（数组（默认长度为 16） + 链表）。

:::tip hashCode 31 作为乘子
[为什么 String hashCode 方法选择数字31作为乘子](https://segmentfault.com/a/1190000010799123)
:::

:::tip 【强制】
向 `Set` 中添加的数据，其所在类必须要重写 `hashCode()` 和 `equals()` 方法。并且，重写的这两个方法尽量保持一致，即相等的对象必须要有相同的散列值（hash）。
:::

:::tip hashCode 和 equals 的关系
1. `equals` 返回 true（即对象相等），则 hashCode 必等
2. `hashCode` 相等，`equals` 不一定返回 true（即对象不一定相等）
:::

**LinkedHashSet**  

继承自 `HashSet`，使得元素可以按照添加的顺序进行遍历（不等于有序）。在添加进数组时，每个元素还维护了一对双向链表，记录此数据的前后元素的引用。对于频繁遍历的 Set，推荐使用 `LinkedHashSet`。  

**TreeSet**  

底层采用红黑树（有序），查询速度快于 List。可以按照添加对象的指定属性进行**排序**。**向 TreeSet 中添加是数据要求是同一个类的对象。** 添加对象时，要求该对象所在类实现了 `Compareble` 接口或使用 `Comparetor`。自然排序中，判断两个对象是否相等，是根据 `compareTo()` 是否返回 0。定制排序中，判断两个对象是否相等，是根据 `compare()` 是否返回 0。 

```java
TreeSet set = new TreeSet();
set.add(1);
set.add(6);
set.add(5);
System.out.println(set); // [1, 5, 6]

/* ---------------------------------- */
TreeSet set = new TreeSet();
set.add(1);
set.add("1"); // 运行报错

/* ---- 定制排序 ---- */
TreeSet set = new TreeSet(new Comparator() {
    @Override
    public int compare(Object o1, Object o2) {
        if (o1 instanceof Person && o2 instanceof Person) {
            Person p1 = (Person) o1;
            Person p2 = (Person) o2;

            if (p1.getAge() > p2.getAge()) {
                return 1;
            } else if (p1.getAge() < p2.getAge()) {
                return -1;
            } else {
                return p1.getName().compareTo(p2.getName());
            }
        } else {
            throw new RuntimeException("类型错误");
        }
    }
});
set.add(new Person("zs", 23));
set.add(new Person("ls", 56));
set.add(new Person("ww", 56));
set.add(new Person("qq", 89));
set.add(new Person("zl", 60));
System.out.println(set);

/* ---- 自然排序（只写了排序方法） ---- */
@Override
public int compareTo(Person o) {
    if (this.age > o.age) {
        return 1;
    } else if (this.age < o.age) {
        return -1;
    } else {
        return this.name.compareTo(o.name);
    }
}
```

**HashSet 笔试题**  

对于 Set 来讲，大部分操作都会使用到 hash 值。前面我们提到，List 中的 `remove()` 会调用对象的 `equals()`来判断要删除的对象是否存在。在 HashSet 中，调用 `remove()` 会先计算 hash 值（然后再调用 `equals`）。**即在 HashSet 中判断两个对象是否相等是通过 hash 值和 `equals()`**。

```java
/* Person 中重写了 equals 和 hashCode */
public static void main(String[] args) {
    Set set = new HashSet();
    Person p1 = new Person("AA",1001);
    Person p2 = new Person("BB",1002);

    set.add(p1);
    set.add(p2);

    /**
     * p1 指向的对象被修改，所以 p1 被修改了
     * 但是 p1 所在的位置还是按照 new Person("AA",1001) 来计算的
     * 当调用 remove 时，将计算 p1 的 hash 值，由于 p1 的内容被修改了
     * 所以，会使用 new Person("CC",1001) 来计算 hash 值
     * 显然 new Person("AA",1001) 和 new Person("CC",1001) hash 值不同（大概率不同，不是绝对不相同）
     * 而原有的 set 中并未存在 new Person("CC",1001) 这个对象，所以删除失败
     */
    p1.setName("CC");
    set.remove(p1);
    System.out.println(set);
    // [{name='CC', age=1001}, {name='BB', age=1002}]

    /**
     * 先计算 new Person("CC",1001) 的 hash 值
     * 显然，set 中原先不存在 new Person("CC",1001) 的 hash，添加成功
     * 尽管 p1 已被修改为 ("CC", 1001)
     * 但是，p1 在添加进 set 时，使用的是 new Person("AA",1001) 来计算 hash
     */
    set.add(new Person("CC", 1001));
    System.out.println(set);
    // [{name='CC', age=1001}, {name='CC', age=1001}, {name='BB', age=1002}]

    /**
     * 先计算 new Person("AA", 1001) 的 hash
     * 显然 该 hash 已经存在（即 p1 的 hash 值）
     * 然后调用 equals 判断新加入的对象和 p1 是否相等
     * 由于 p1 被修改了，显然这两个对象的内容不等
     * 所以，添加成功
     */
    set.add(new Person("AA", 1001));
    System.out.println(set);
    // [{name='CC', age=1001}, {name='CC', age=1001},{name='AA', age=1001}, {name='BB', age=1002}]
}
```

## Map
Map 是一个双列数组，有 key 和 value。Map 中的 key 被保存在 Set 中。要求 key 所在的类要重写`equals()` 和 `hashCode()`（以 HashMap 为例）。  

Map 中的 value 是无序（因为 key 无序）、可重复的，使用 Collection 存储。建议 key 所在的类重写`equals()` 和 `hashCode()`（以 HashMap 为例）。  

在 Map 中存储的 k-v 对其实就是一个 Entry。所以 Entry 是无序、不重复的。使用 Set 存储所有的 Entry。

**Hashtable**  

`Hashtable` 的出现时机比 Map 要早，线程安全，效率低。**不可以**存储 值为 **null** 的 key 和 value。  

**Properties**
它是 `Hashtable` 的子类，常用来处理配置文件，key 和 value 都是 String 类型。
```java
Properties props = new Properties();
FileInputStream fls = null;
try {
    fls = new FileInputStream("common2\\jdbc.properties");
    props.load(fls);

    String username = props.getProperty("username");
    String password = props.getProperty("password");
    System.out.println(username + ":" + password);

} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fls != null) {
        try {
            fls.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

**HashMap**
`HashMap` 是 Map 的主要实现类，线程不安全，效率高。**可以**存储 值为 **null** 的 key 和 value（如表单提交时的数据就是封装到 `HashMap` 中的）。
```java
HashMap map = new HashMap();
map.put(null, null);
```

**底层**  

JDK 7：数组 + 链表  
JDK 8：数组 + 链表 + 红黑树

**HashMap 底层原理**

注意扩容的机制（并不是等到数组满了才会扩容，有一个扩容的临界值），当超过这个临界值，并且当前要插入的位置已经存在元素时才会扩容。

扩容临界值：数组大小 * 载荷因子（`0.75f`）

在比较时，调用 `equals` 之前，会先使用 `==` 比较。
```java
if (p.hash == hash && ((k = p.key) == key || (key != null & key.equals(k))))
```

以下的 Node 和 Entry 都是内部类。

**JDK 7**  

```java
Map map = new HashMap();
// 使用无参构造时，底层创建了长度为 16 的一维数组
// 即为 Entry[] table = new Entry[16];

map.put(k1, v1);
// 先调用 k1 所在类的 hashCode() 计算 hash 值
// 然后通过某种算法得到它在 Entry 数组中的存放位置
// 如果此位置中没有元素，则添加成功
// 如果此位置已有数据（一个或多个，多个数据以链表形式存储），则比较当前添加元素的 key 和其它元素的 key 的 hash 值
// 如果此 hash 值与它们都不相同，则添加
// 如果存在 hash 值相同的，则再调用 key 的 equals() 进行比较
// 如果 equals 返回 false，则添加成功
// 如果 equals 返回 true，则用新的 value 替换旧的 value（这一点和 HashSet 不同）
// 扩容方式为，默认扩容为原来的 2 倍，并将原有数据复制到新的数组
// 注意扩容的机制（并不是等到数组满了才会扩容，有一个扩容的临界值），当超过这个临界值，并且当前要插入的位置已经存在元素时才会扩容。

Map map = new HashMap(7);
// 上面的代码实际上创建的是长度为 8 的一维数组。
// 源码如下：
int capacity = 1;
// initialCapacity 就是我们传入的长度，在这里为 7
while (capacity < initialCapacity)
    capacity <<= 1;
// 从上面的代码中可以看到，capacity 每次都会扩大 2 倍
// 直到大于等于我们传入的值
```
**JDK 8**  

```java
Map map = new HashMap();
// 使用无参构造时，底层没有创建长度为 16 的一维数组
// 在 JDK8 中，Entry[] 被换为 Node[]，Node 实现了 Entry 接口

map.put(k1, v1);
// 首次调用 put 方法时，底层才创建长度为 16 的一维数组
// 先调用 k1 所在类的 hashCode() 计算 hash 值
// 然后通过某种算法得到它在 Entry 数组中的存放位置
// 如果此位置中没有元素，则添加成功
// 如果此位置已有数据（一个或多个，多个数据以链表形式存储），则比较当前添加元素的 key 和其它元素的 key 的 hash 值
// 如果此 hash 值与它们都不相同，则添加
// 如果存在 hash 值相同的，则再调用 key 的 equals() 进行比较
// 如果 equals 返回 false，则添加成功
// 如果 equals 返回 true，则用新的 value 替换旧的 value（这一点和 HashSet 不同）
// 扩容方式为，默认扩容为原来的 2 倍，并将原有数据复制到新的数组
// 当数组中某一位置上的元素（链表形式）个数大于 8 ，且当前数组的长度大于 64时，此索引位置上的所有数据改为用红黑树存储
```
:::tip HashMap 扩展
- [https://blog.csdn.net/wanghao112956/article/details/100654209](https://blog.csdn.net/wanghao112956/article/details/100654209)
- [https://segmentfault.com/a/1190000023579414](https://segmentfault.com/a/1190000023579414)
:::


**Map 遍历**  

- `keySet()`  

  得到所有 key 构成的 Set，通过 Set 遍历所有的 key
  ```java
  Set<String> ketSet = map.keySet();
  Iterator<String> iterator = ketSet.iterator();
  while (iterator.hasNext()) {
      String key = iterator.next();
      System.out.println(key + ":" + map.get(key));
  }
  ```

- `values()`  

  获取所有的 value
  ```java
  Collection<String> values = map.values();
  values.forEach(System.out::println);
  ```

- `entrySet()`  

  得到每一个 entry
  ```java
  Set<Map.Entry<String, String>> entries = map.entrySet();
  Iterator<Map.Entry<String, String>> iterator = entries.iterator();
  while (iterator.hasNext()) {
      Map.Entry<String, String> entry = iterator.next();
      String key = entry.getKey();
      String value = entry.getValue();
      System.out.println(key + ":" + value);
  }
  ```

**LinkedHashMap**

它是 `HashMap` 的子类，能够按照元素的添加顺序来遍历元素。它在 `HashMap` 的基础上为每个元素添加了一对指针，用于指向前一个元素和后一个元素。  

该类中只有一个无参的构造方法，且调用的是父类（HashMap）中的无参构造
```java
public LinkedHashMap() {
    super();
    accessOrder = false;
}
```
它使用的是 Entry 存储元素，且该 Entry 继承了 HashMap 的 Node
```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after;
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

**TreeMap**  

可以按照添加元素的 key 进行排序。此时考虑 key 的自然排序或定制排序。底层使用的是红黑树。

```java
/* ----------- 自然排序 ---------- */
/* Person 已经实现 Comparable 接口 */
TreeMap<Person, String> map = new TreeMap<>();

map.put(new Person(12, "zs"), "k1");
map.put(new Person(43, "ls"), "k2");
map.put(new Person(36, "ww"), "k90");
map.put(new Person(38, "zl"), "k67");
map.put(new Person(19, "zo"), "k89");

System.out.println(map);

/* ---------- 定制排序 ----------- */
TreeMap<Person, String> map = new TreeMap<>(new Comparator<Person>() {
    @Override
    public int compare(Person o1, Person o2) {
        if (o1.getAge() > o2.getAge()) {
            return -1;
        } else if (o1.getAge() < o2.getAge()) {
            return 1;
        } else {
            return o1.getName().compareTo(o2.getName());
        }
    }
});

map.put(new Person(12, "zs"), "k1");
map.put(new Person(43, "ls"), "k2");
map.put(new Person(36, "ww"), "k90");
map.put(new Person(38, "zl"), "k67");
map.put(new Person(19, "zo"), "k89");

System.out.println(map);
```

## Collections 工具类
`Collections` 工具类提供了大量针对 `Collection`（Set、List）/ Map 的操作，总体可分为四类，都为静态（static）方法。

**`Collection` 和 `Collections` 的区别**  

`Collection` 是接口，而 `Collections` 是用来操作 `Collection` 的工具类。

**排序操作（主要针对List接口相关）**  

- `reverse(List list)`：反转指定 List 集合中元素的顺序
- `shuffle(List list)`：对 List 中的元素进行随机排序（洗牌）
- `sort(List list)`：对 List 里的元素根据自然升序排序
- `sort(List list, Comparator c)`：自定义比较器进行排序
- `swap(List list, int i, int j)`：将指定 List 集合中i处元素和j出元素进行交换
- `rotate(List list, int distance)`：将所有元素向右移位指定长度，如果 distance 等于 size 那么结果不变

**查找和替换（主要针对Collection接口相关）**  

- `binarySearch(List list, Object key)`：使用二分搜索法，以获得指定对象在 List 中的索引，前提是集合已经排序
- `max(Collection coll)`：根据自然排序，返回最大元素
- `max(Collection coll, Comparator comp)`：根据自定义比较器，返回最大元素
- `min(Collection coll)`：根据自然排序，返回最小元素
- `min(Collection coll, Comparator comp)`：根据自定义比较器，返回最小元素
- `fill(List list, Object obj)`：使用指定对象填充
- `frequency(Collection Object o)`：返回指定集合中指定对象出现的次数
- `replaceAll(List list, Object old, Object new)`：替换
- `copy(List dest, List src)`：将 src 的元素通过遍历复制到 dest  

```java
/* copy() 方法的坑 */
ArrayList<Integer> list1 = new ArrayList<>();
ArrayList<Integer> list2 = new ArrayList<>();

list1.add(1);
list1.add(2);
list1.add(3);

// 报错，list2 的 size 小于 list1
Collections.copy(list2, list1);

/* -------- */
ArrayList<Integer> list2 = new ArrayList<>(3);
System.out.println(list2.size()); // 0

/* --------- 正确写法如下 -------- */
ArrayList list1 = new ArrayList();
list1.add(1);list1.add(2);list1.add(3);
List<Object> list2 = Arrays.asList(new Object[list1.size()]);
Collections.copy(list2, list1);
list1.set(1,6);
System.out.println(list1);
System.out.println(list2);
```
