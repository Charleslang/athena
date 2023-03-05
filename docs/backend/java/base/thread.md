# 多线程

## 创建方式

**1. 继承 Thread**  

1. 继承 Thread
2. 重写 `run()` 方法
3. 创建子类对象
4. 调用 `start()` 方法，开启一个新的线程

```java
public class Thread1 {
    public static void main(String[] args) {
        ThreadTest1 t = new ThreadTest1();
        t.start();
    }
}

class ThreadTest1 extends Thread {

    @Override
    public void run() {
        System.out.println("hello");
    }
}
```

:::warning 注意
同一个 Thread 对象不能多次调用 `start()` 。
:::

以上方式的简写如下：
```java
new Thread() {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + "other");
    }
}.start();
```

**Thread 类中的常用方法**  

- `void start()`   

  启动线程，并调用对象的 `run()` 方法  

- `run()`  

  线程中要执行的操作

- `String getName() ` 

  返回当前线程的名字

- `void setName(String name)`  

  设置线程的名称

- `static Thread currentThread()`  
  
  返回当前线程。在 `Thread` 子类中就是 `this`，通常用于主线程和 `Runnable` 实现类
  
- `yield()`  

  释放当前线程的 cpu 的执行权（后面还会继续执行此线程）

- `join()`  

  插入另一个线程（当前线程被阻塞），直到另一个线程执行完成后才会恢复之前的线程

- `stop() ` 
  
  结束线程，已被弃用

- `sleep(long millitime)`  
  
  在指定毫秒内，使线程阻塞

- `isAlive() ` 
  
  判断当前线程是否还存活

:::tip 提示
线程阻塞完成之后并不是立即恢复执行，还需等 CPU 分配资源。
:::

**线程调度**  

通过优先级来调度（Thread.MAX_PRIORITY：10、MIN_PRIORITY：1、NORM_PRIORITY：5（默认））。  

- `getPriority()`   

  返回当前线程的优先级  

- `setPriority()`  

  设置线程的优先级

:::tip 提示
优先级高的线程并不一定先执行。
:::

**2. 实现 Runnable 接口**  

1. 实现 Runnable 接口
2. 重写抽象方法 `run()`  
3. 创建实现类的实例
4. 将此实例放入 Thread 的构造器中，创建 Thread 的对象
5. 通过 Thread 的对象调用 `strat()`

```java
public class RunnableTest1 {
    public static void main(String[] args) {
        T1 t1 = new T1();
        Thread thread = new Thread(t1);
        thread.start();
    }
}

class T1 implements Runnable {

    @Override
    public void run() {
        System.out.println("hello");
    }
}
```

**卖票问题**  

```java
/* 1. 使用 Thread */
public class Thread3 {
    public static void main(String[] args) {
        Window window1 = new Window();
        Window window2 = new Window();
        Window window3 = new Window();
        window1.setName("窗口1：");
        window2.setName("窗口2：");
        window3.setName("窗口3：");
        window1.start();
        window2.start();
        window3.start();
    }
}

class Window extends Thread {

    // 注意此处将 ticket 设为 static
    private static int ticket = 100;

    @Override
    public void run() {
        while (true) {
            if (ticket > 0) {
                System.out.println(getName() + "票号->" + ticket--);
            } else {
                break;
            }
        }
    }
}

/* ------------------------------------------ */

/* 2. 使用 Runnable */
public class RunnableTest1 {
    public static void main(String[] args) {
        // 只创建一个实例
        T1 t1 = new T1();
        Thread thread1 = new Thread(t1);
        Thread thread2 = new Thread(t1);
        Thread thread3 = new Thread(t1);
        thread1.setName("窗口一：");
        thread2.setName("窗口二：");
        thread3.setName("窗口三：");
        thread1.start();
        thread2.start();
        thread3.start();
    }
}

class T1 implements Runnable {

    // 此处未加 static 修饰
    private int ticket = 100;

    @Override
    public void run() {
        while (true) {
            if (ticket > 0) {
                System.out.println(Thread.currentThread().getName() + "票号->" + ticket--);
            } else {
                break;
            }
        }
    }
}
```

:::tip 提示
上面的两种方式都有缺陷，后面会加锁解决。
:::

## Thread VS Runnable

优先选择实现接口的方式。原因如下：

- Java 中单继承的局限性
- 实现接口的方式更加适合有共享数据的情况

:::tip 提示
**`Thread` 实现了 `Runnable` 接口。**
:::

## 线程生命周期
在 `Thread.State`（是一个枚举类）中定义了线程的状态，如下：  
- 新建  

  创建线程实例  

- 就绪  

  调用 `start()` 方法，进入线程队列，等待 CPU 分配资源

- 运行  
  
  就绪状态获得 CPU 分配的资源

- 阻塞  
  
  某种情况下导致线程被挂起，使线程进入就绪（阻塞）状态

- 消亡  
  
  线程执行完成或者异常终止

## 同步代码块  
使用 `synchronized` 关键字。基本语法如下：

```java
synchronized(监视器，即锁) {
    // 同步代码（操作共享数据的代码即为同步代码）
}
// 任何一个类的对象都可以充当锁
// 要求：多个线程必须要共用同一把锁（即同一个对象）
```
**1. `Runnable` 接口的方式**  

```java
public class Test2 {
    public static void main(String[] args) {
        TS1 t1 = new TS1();
        Thread thread1 = new Thread(t1);
        Thread thread2 = new Thread(t1);
        Thread thread3 = new Thread(t1);
        thread1.setName("窗口一：");
        thread2.setName("窗口二：");
        thread3.setName("窗口三：");
        thread1.start();
        thread2.start();
        thread3.start();
    }
}

class TS1 implements Runnable {

    private int ticket = 100;

    @Override
    public void run() {
        while (true) {
            // 这里的锁可以是任意对象
            synchronized (this) {
                if (ticket > 0) {
                    System.out.println(Thread.currentThread().getName() + "票号->" + ticket--);
                } else {
                    break;
                }
            }
        }
    }
}
```

:::tip 提示
上面的方式是针对实现 `Runnable` 接口的线程，解决了线程安全。但是，缺点也很明显，同一时刻只能有一个线程参与，相当于单线程，效率较低。
:::

**2. 继承 `Thread` 的方式**

```java
public class Test3 {
    public static void main(String[] args) {
        Window window1 = new Window();
        Window window2 = new Window();
        Window window3 = new Window();
        window1.setName("窗口1：");
        window2.setName("窗口2：");
        window3.setName("窗口3：");
        window1.start();
        window2.start();
        window3.start();
    }
}

class Window extends Thread {

    private static int ticket = 100;

    private static Object obj = new Object();

    @Override
    public void run() {
        while (true) {
            // synchronized (Window.class)
            synchronized (obj) {
                if (ticket > 0) {
                    System.out.println(getName() + "票号->" + ticket--);
                } else {
                    break;
                }
            }
        }
    }
}
```

## 同步方法

同步方法就是给方法进行加锁。 

**1. 实现接口的方式**

```java
public class Test5 {
    public static void main(String[] args) {
        TM1 t1 = new TM1();
        Thread thread1 = new Thread(t1);
        Thread thread2 = new Thread(t1);
        Thread thread3 = new Thread(t1);
        thread1.setName("窗口一：");
        thread2.setName("窗口二：");
        thread3.setName("窗口三：");
        thread1.start();
        thread2.start();
        thread3.start();
    }
}

class TM1 implements Runnable {

    private int ticket = 100;

    @Override
    public void run() {
        while (true) {
            buy();
        }
    }

    public synchronized void buy() { // 相当于监视的 this
        if (ticket > 0) {
            System.out.println(Thread.currentThread().getName() + "票号->" + ticket--);
        }
    }
}
```

**2. 继承的方式**  

```java
public class Test6 {
    public static void main(String[] args) {
        Window1 window1 = new Window1();
        Window1 window2 = new Window1();
        Window1 window3 = new Window1();
        window1.setName("窗口1：");
        window2.setName("窗口2：");
        window3.setName("窗口3：");
        window1.start();
        window2.start();
        window3.start();
    }
}

class Window1 extends Thread {

    private static int ticket = 100;

    @Override
    public void run() {
        while (true) {
            buy();
        }
    }
    private static synchronized void buy() { // 相当于监视 Window1.class
        if (ticket > 0) {
            System.out.println(Thread.currentThread().getName() + "票号->" + ticket--);
        }
    }
}
```

:::tip 提示
同步方法仍然涉及到同步监视器，只是不需要显示声明。非静态同步方法监视的是 `this`（当前对象），而静态同步方法监视的是该类。
:::

## 单例模式

一个类能返回对象一个引用(永远是同一个)和一个获得该实例的方法（必须是静态方法，通常使用 `getInstance` 这个名称）；当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用；同时我们还将该类的构造函数定义为私有方法，这样其他处的代码就无法通过调用该类的构造函数来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例。  

单例模式在多线程的应用场合下必须小心使用。如果当唯一实例尚未创建时，有两个线程同时调用创建方法，那么它们同时没有检测到唯一实例的存在，从而同时各自创建了一个实例，这样就有两个实例被构造出来，从而违反了单例模式中实例唯一的原则。 解决这个问题的办法是为指示类是否已经实例化的变量提供一个互斥锁(虽然这样会降低效率)。

```java
/* -------- 以下是两种简单的单例实现 -------- */
public class SingletonTest {
    public static void main(String[] args) {
        Bank bank1 = Bank.getInstance();
    }
}
/* --------- 方式一（饿汉式）-------- */
class Bank {
    private static Bank instance = new Bank();

    private Bank() { }
    
    public static Bank getInstance() {
        return instance;
    }
}

/* ---------- 方式二（懒汉式）----------- */
class Order {
    private static Order instance = null;
    
    private Order() {}
    
    private static Order getInstance() {
        if (instance == null) {
            instance = new Order();
        }
        return instance;
    }
}

// 推荐使用懒汉式
// 懒汉式是当需要时才创建对象
// 饿汉式是线程安全的
```

## Lock 锁

通过显示定义同步锁对象来实现同步，同步锁使用 Lock 对象充当。Lock 是一个接口，`ReentrantLock` 实现了该接口。

```java
public class LockTest {
    public static void main(String[] args) {
        Window w = new Window();

        Thread t1 = new Thread(w);
        Thread t2 = new Thread(w);
        Thread t3 = new Thread(w);

        t1.setName("窗口1: ");
        t2.setName("窗口1: ");
        t3.setName("窗口1: ");

        t1.start();
        t2.start();
        t3.start();
    }
}

class Window implements Runnable {

    private int ticket = 100;

    // 1. 创建 ReentrantLock 实例
    private ReentrantLock lock = new ReentrantLock();

    @Override
    public void run() {
        while (true) {
            try {
                // 2. 加锁
                lock.lock();
                
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (ticket > 0) {
                    System.out.println(Thread.currentThread().getName() + "票号" + ticket--);
                } else {
                    break;
                }
            } finally {
                // 3. 解锁
                lock.unlock();
            }
        }
    }
}
```
## synchronized VS Lock

相同：都可以解决线程安全问题。  

不同：`synchronized` 可以自动释放锁，而 `Lock` 需要手动释放。

## 线程通信

两个线程交替工作。使用 `wait( )` 和 `notify( )` 或 `notifyAll( )`。这三个方法之能出现在同步代码块或同步方法中。并且，这个三个方法的调用者必须是同步锁中的监视器。这三个方法是定义在 Object 类中的。

```java
public class ThreadCommunicate {
    public static void main(String[] args) {
        Number number = new Number();

        Thread t1 = new Thread(number);
        Thread t2 = new Thread(number);

        t1.setName("Thread 1 : ");
        t2.setName("Thread 2 : ");

        t1.start();
        t2.start();
    }
}

class Number implements Runnable {

    private int number = 1;

    @Override
    public void run() {
        while (number <= 100) {
            synchronized (this) {
                notify(); // this.notify()
                System.out.println(Thread.currentThread().getName() + "数字：" + number++);
                try {
                    // 使当前线程阻塞，调用此方法会自动释放锁
                    // 而 sleep 不会释放锁
                    wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```
## sleep VS wait

相同：都可以使线程进入阻塞状态。  

不同：

- 两个方法声明的位置不同，`sleep` 是 Thread 中的，而 `wait` 是 Object 类中的
- `sleep` 可以在任何地方调用，而 `wait` 必须由同步监视器调用
- `sleep` 不会释放锁，`wait` 会释放锁

## 生产者与消费者
```java
public class ComsumerTest {
    public static void main(String[] args) {
        Room room = new Room();

        Comsumer comsumer = new Comsumer(room);
        comsumer.setName("消费者1：");

        Comsumer comsumer2 = new Comsumer(room);
        comsumer2.setName("消费者2：");

        Producter producter = new Producter(room);
        producter.setName("生产者1：");

        producter.start();
        comsumer.start();
        comsumer2.start();
    }
}

class Room {

    private int product = 0;

    public synchronized void createProduct() {
        if (product < 10) {
            System.out.println(Thread.currentThread().getName() + "开始生产第" + ++product + "个产品");
            notify();
        } else {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public synchronized void comsumeProduct() {
        if (product > 0) {
            System.out.println(Thread.currentThread().getName() + "开始消费第" + product-- + "个产品");
            notify();
        } else {
//            notify();
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

class Comsumer extends Thread {

    private Room room;

    public Comsumer(Room room) {
        this.room = room;
    }

    @Override
    public void run() {
        System.out.println(getName() + "开始消费...........");
        while (true) {
            try {
                Thread.sleep(300);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            room.comsumeProduct();
        }
    }

}
class Producter extends Thread {

    private Room room;

    public Producter(Room room) {
        this.room = room;
    }

    @Override
    public void run() {
        System.out.println(getName() + "开始生产.............");
        while (true) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            room.createProduct();
        }
    }
}
```
## Callable 接口

在前面的文章中我们讲述了创建线程的 2 种方式，一种是直接继承 `Thread`，另外一种就是实现 `Runnable` 接口。这 2 种方式都有一个缺陷，在执行完任务之后无法获取执行结果。如果需要获取执行结果，就必须通过共享变量或者使用线程通信的方式来达到效果，这样使用起来就比较麻烦。而自从 Java 1.5 开始，就提供了 `Callable` 和 `Future`，通过它们可以在任务执行完毕之后得到任务执行结果。

与 `Runnable` 相比，`Callable` 更加强大。 `Callable` 中的 `call( )` 就相当于 `run( )`。  

`Future` 就是对于具体的 `Runnable` 或者 `Callable` 任务的执行结果进行取消、查询是否完成、获取结果。必要时可以通过 `get` 方法获取执行结果，该方法会阻塞直到任务返回结果。

因为 `Future` 只是一个接口，所以是无法直接用来创建对象使用的，因此就有了下面的 `FutureTask`。

:::tip 参考
[Java并发编程：Callable、Future和FutureTask](https://www.cnblogs.com/dolphin0520/p/3949310.html)
:::

```java
public class CallableTest1 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        NumThread numThread = new NumThread();

        FutureTask futureTask = new FutureTask(numThread);

        // 通过此方式启动线程
        new Thread(futureTask).start();

        Object sum = futureTask.get();

        System.out.println(sum);
    }
}

class NumThread implements Callable {

    @Override
    public Object call() throws Exception {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            if (i % 2 == 0) {
                sum += i;
            }
        }
        return sum;
    }
}

/* --------------------------- */
public class CallableTest1 {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        NumThread numThread = new NumThread();

        FutureTask<Integer> futureTask = new FutureTask<>(numThread);

        // 通过此方式启动线程
        new Thread(futureTask).start();

        Integer sum = futureTask.get();

        System.out.println(sum);
    }
}

class NumThread implements Callable<Integer> {

    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            if (i % 2 == 0) {
                sum += i;
            }
        }
        return sum;
    }
}
```

## 线程池

在前面的文章中，我们使用线程的时候就去创建一个线程。这样实现起来非常简便，但是存在一个问题，如果并发的线程数量很多，并且每个线程都是执行一个时间很短的任务就结束了，这样频繁创建线程就会大大降低系统的效率，因为频繁创建线程和销毁线程需要时间。那么有没有一种办法使得线程可以复用，就是执行完一个任务，并不被销毁，而是可以继续执行其他的任务？在 Java 中，可以通过线程池来达到这样的效果。

使用 `Executors` 工具类来创建线程池：

- `Executors.newCachedThreadPool()`：无限线程池。
- `Executors.newFixedThreadPool(nThreads)`：创建固定大小的线程池。
- `Executors.newSingleThreadExecutor()`：创建单个线程的线程池。

```java
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService service = Executors.newFixedThreadPool(10);

        service.execute(new NumberThread()); // 适用于 Runnable

//        service.submit(); // 适用于 callable

        service.shutdown();
    }
}
class NumberThread implements Runnable {

    @Override
    public void run() {
        System.out.println("hello");
    }
}
```
