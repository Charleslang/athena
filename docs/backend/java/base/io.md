# IO

IO 是 Input/Output 是缩写，用于设备间的数据传输。IO 操作的文件都是文件名的最后一个名字，其它的都是它的父级目录，如 `D:\\123\\456\\a.txt`，此时，文件名为 `a.txt`，其它的都是它的父级目录

## File

File 类的一个对象就代表一个文件或者文件夹。  

**常用构造器如下**  

- `public File(String pathName)`  

  ```java
  /**
  * 如果只使用了构造器，则不会加载该文件，而是将文件名储存在内存中
  * 即文件不存在的话不会报错
  * 如下面的代码所示
  */

  // 在 idea 中是相对于 module 的路径（main 以及普通方法中）
  // 在 idea 中是相对于工程的路径（单元测试的方法中）
  File file1 = new File("hello.txt");
  // 绝对路径
  File file2 = new File("D:\\hello.txt");
  File file3 = new File("D:/hello.txt");
  File file4 = new File("D:" + File.separator + "hello.txt");

  System.out.println(file1); // 打印文件路径
  ```

  pathName 可以是绝对路径或相对路径。如果是相对路径，则默认的当前路径在系统属性 `user.dir` 中存储。 

  ```java
  // 项目的上一级目录的绝对路径
  // 比如我的项目名为 test1，则打印的路径为 test1 的父目录的绝对路径
  System.out.println(System.getProperty("user.dir"));
  ```

  :::warning 注意
  在使用绝对路径时，不同操作系统的分隔符是不一样的。在 Windows 中支持 `\`（在代码中需转译） 和 `/`，unix 为 `/`。所以，推荐使用 `File.separator` 来动态使用分隔符。
  :::

- `public File(String parentPath, String childPath)`

  ```java
  /**
  * 如果只使用了构造器，则不会加载该文件，而是将文件名储存在内存中
  * 即文件不存在的话不会报错
  * 如下面的代码所示
  */

  // E:\ideacode\hello
  File file5 = new File("E:\\ideacode", "hello");
  ```

- `public File(File parentPath, String childPath)`

  ```java
  /**
  * 如果只使用了构造器，则不会加载该文件，而是将文件名储存在内存中
  * 即文件不存在的话不会报错
  * 如下面的代码所示
  */

  File file5 = new File("E:\\ideacode", "hello");

  // E:\ideacode\hello\hello.txt
  File file6 = new File(file5, "hello.txt");
  ```

**File 对象的常用方法**

```java
/**
 * 以下操作并不会读取文件，只是内存中的操作
 * 即文件不存在的话不会报错
 */
File file1 = new File("common2");
//  File file1 = new \\ideacode\\javasedemo\\common2\\hello.txt");

System.out.println(file1.getAbsolutePath()); // E:\ideacode\javasedemo\common2\hello.txt
System.out.println(file1.getPath()); // 获取构造方法中填写的路径
System.out.println(file1.getName());// hello.txt
System.out.println(file1.getParent());// common2（返回父目录，即在构造方法中的路径的父目录，没有的话会返回 null）
System.out.println(file1.getParentFile());// common2（返回父目录，即在构造方法中的路径的父目录，没有的话会返回 null）
System.out.println(file1.length()); // 文件长度（大小）, 单位是字符
System.out.println(file1.lastModified()); // 最后一次的修改时间（返回时间戳）
// 以下两个方法要求文件必须存在
System.out.println(Arrays.toString(file1.list())); // 获取该文件中的所有子文件，以字符串数组形式返回，适用于文件夹
System.out.println(file1.listFiles()); //获取该文件中的所有子文件，以 File数组形式返回，适用于文件夹

// 文件重命名
// 必须保证原文件存在，且新名字的文件不存在。否则该方法返回 false
// file2 可以是绝对或相对路径
File file2 = new File("common2\\1.txt");
boolean b = file1.renameTo(file2);
System.out.println(b);


/* 其它判断方法 */
File file1 = new File("E:\\ideacode\\javasedemo\\common2\\1.txt");

System.out.println(file1.isAbsolute()); // 是否是绝对路径
System.out.println(file1.isDirectory()); // 是否是文件目录（即文件夹）
System.out.println(file1.isFile()); // 是否是文件
System.out.println(file1.isHidden()); // 是否被隐藏
System.out.println(file1.exists()); // 是否存在
System.out.println(file1.canRead()); // 是否可读
System.out.println(file1.canWrite()); // 是否可写

/* 创建文件 */
// 此处的父级目录为 common2
File file1 = new File("common2\\2.txt");

// 创建新文件，如果已存在，则不创建（返回 false）
// 创建成功返回 true
// 注意，只有其父级目录存在时才创建成功，否则抛异常
boolean newFile = file1.createNewFile();

// 创建目录（如果不存在），如果父级目录不存在则创建失败
// 创建的都是文件夹
boolean mkdir = file1.mkdir();

// 创建目录，如果父目录不存在，则一并创建
// 注意，创建的都是文件夹
boolean mkdirs = file1.mkdirs();

System.out.println(newFile);
System.out.println(mkdir);
System.out.println(mkdirs);
```

以上的操作都是没有涉及文件内容的修改，如果想要修改文件内容，那么就必须使用 **IO流**。  

## IO 流

Java 中，数据的输入和输出都是以流（相当于管道）的方式进行。输入（Input）：从磁盘到内存，输出（Output）：从内存到磁盘。

**流的分类**

- 按操作的数据单位：字节流（8 bit）、字符流（16 bit）  
- 按数据的流向：输入流、输出流  
- 按照流的角色：节点流、处理流  

:::tip 提示
- 节点流也称为文件流  
- 处理流是在原有流（节点流 / 文件流）的基础上进行了一层包装  
- 缓冲流是一种常见的处理流 
:::

|抽象基类|字节流|字符流|
|---|---|---|
|输入流|`InputStream`|`Reader`|
|输出流|`OutputStream`|`Writer`|

上面的 4 个都是抽象类，它们的实现类都是以它们的名字作为后缀，如 `FileInputStream`。

:::tip 强制
在 IO 流的处理过程中，必须手动处理异常（关闭资源）。
:::

**1. 读取文件**

- **`FileReader`**  

  ```java
  // 创建 File 对象，指明要操作的文件
  File file = new File("common2\\1.txt");
  FileReader fileReader = null;
  try {
      // 也可以直接写文件路径
      fileReader = new FileReader(file);
      // 返回读入的一个字符（本来返回的是 char 类型，但是 char 可用 int 型的 ASCII 码表示）
      // 返回 -1，则代表文件已读取到文件末尾
      // 该方式每次只读取一个字符
      int data;
      while ((data = fileReader.read()) != -1) {
          // 将 int 转为 char
          System.out.print((char) data);
      }

  } catch (FileNotFoundException e) {
      e.printStackTrace();
  } catch (IOException e) {
      e.printStackTrace();
  } finally {
      if (fileReader != null) {
          try {
              fileReader.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }


  /* FileReader 带缓冲区 */
  // 上面的方式每次只读取一个字符，当文件较大时，读取会比较频繁
  // 为了减少读取次数，引入了缓冲区
  File file = new File("common2\\1.txt");

  FileReader reader = null;

  try {
      reader = new FileReader(file);
      // 因为 Reader 是字符流，所以使用 char[] 作为缓冲区
      // 每次读取 1024 个字符
      // 即真实的数据被存在了这个字符数组中
      char[] buf = new char[3];
      // 此时 length 为读取的字符的个数
      int length;
      while ((length = reader.read(buf)) != -1) {

          for (int i = 0; i < length; i++) {
              System.out.print(buf[i]);
          }

            System.out.print(new String(buf, 0, ;
          // 以下两种均是错误的写法
            System.out.print(new String(buf));
            for (int i = 0; i < buf.length; i++) {
                System.out.print(buf[i]);
            }
      }
  } catch (IOException e) {
      e.printStackTrace();
  } finally {
      if (reader != null) {
          try {
              reader.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }
  ```

- **`FileInputStream`**  

  ```java
  FileInputStream input = null;
  input = new FileInputStream("common2\\P35.jpg");
  byte[] buf = new byte[100];
  int length;
  while ((length = input.read(buf)) != -1) {
      System.out.print(new String(buf, 0, length));
  }
  input.close();
  ```
- **`BufferedInputStream`**  

  它是对 `FileInputStream` 的再次包装。它的效率较高，在开发中也使用得较多。
  ```java
  /* 文件复制 */
  FileInputStream fileInputStream = new FileInputStream("common2\\P35.jpg");
  FileOutputStream outputStream = new FileOutputStream("common2\\copy35.jpg");
  BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
  BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(outputStream);
  byte[] buf = new byte[100];
  int len = -1;
  while ((len = bufferedInputStream.read(buf)) != -1) {
      bufferedOutputStream.write(buf, 0, len);
  }

  // 关闭外层流时，内层的流会自动关闭
  // 所以可以不用手动关闭 outputStream 和 fileInputStream
  bufferedOutputStream.close();
  bufferedInputStream.close();
  //  outputStream.close();
  //  fileInputStream.close();
  ```
  在 `BufferedInputStream` 中自带了一个缓冲区，大小为 8192。

- **`BufferedReader`**  

  它是对 `FileReader` 的再次包装。通常用于处理字符。
  ```java
  /* 文件复制 */
  FileReader reader = new FileReader("common2\\1.txt");
  FileWriter writer = new FileWriter("common2\\1-copy2.txt");
  BufferedReader bufferedReader = new BufferedReader(reader);
  BufferedWriter bufferedWriter = new BufferedWriter(writer);

  char[] buf = new char[10];
  int len = -1;
  while ((len = bufferedReader.read(buf)) != -1) {
      bufferedWriter.write(buf, 0 ,len);
  }

  bufferedWriter.close();
  bufferedReader.close();

  /* 文件复制方式二，读取一行（这是 bufferedReader 特有的） */
  while ((line = bufferedReader.readLine()) != null) {
      // 默认不换行，即全部写在一行中
      //  bufferedWriter.write(line);
      //  bufferedWriter.write(line + "\n");
      bufferedWriter.write(line);
      bufferedWriter.newLine(); // 换行
  }
  ```

**2. 写入文件**  

-  **`FileWriter`**  

  ```java
  // 指定写入的文件路径
  // 可以通过 File，也可以直接写路径的字符串
  // 如果该文件不存在，则会自动创建
  File file = new File("common2\\2.txt");

  FileWriter fileWriter = null;

  try {
      fileWriter = new FileWriter(file);
      // 下面这个构造方法表示追加内容
      //  fileWriter = new FileWriter(file, true);
      
      // write 方法是覆盖，若想追加内容，则应该使用 append()
      fileWriter.write("hello");
      fileWriter.write("hello");
  } catch (IOException e) {
      e.printStackTrace();
  } finally {
      if (fileWriter != null) {
          try {
              fileWriter.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
  }

  /* 文件复制 */
  FileReader reader = null;
  FileWriter writer = null;

  try {
      reader = new FileReader("common2\\1.txt");
      writer = new FileWriter("common2\\copy.txt");
      char[] buf = new char[6];
      int length = -1;
      StringBuilder sb = new StringBuilder();
      while ((length = reader.read(buf)) != -1) {
          sb.append(new String(buf, 0 ,length));
  //        writer.write(buf, 0, length);
      }
      writer.write(sb.toString());
      // 省略 catch、finally
      // 先关闭 output，再关闭 input
  }
  ```

- **`FileOutputStream`**  

  ```java
  /* 文件复制 */
  /* 也可以复制其它类型的文件，如文本文件（不会出现中文乱码） */
  FileInputStream input = null;
  FileOutputStream output = null;
  File file = new File("common2\\P35.jpg");
  String fileName = file.getName();
  String suffix = fileName.substring(fileName.lastIndexOf("."));
  input = new FileInputStream(file);
  output = new FileOutputStream("common2\\copy" + suffix);
  byte[] buf = new byte[100];
  int length;
  while ((length = input.read(buf)) != -1) {
      output.write(buf, 0 ,length);
  }
  output.close();
  input.close();
  ```
  :::tip 提示
  - 字符流不能用来处理图片、视频、音乐等字节数据
  - 字符流通常用来处理文本文件（.txt、.java）
  - 字节流能够用来处理任何类型的文件（万物皆字节），但是可能出现中文乱码，建议使用字符流来处理文本文件
  - 因此，字节流通常用来处理 .doc、.jpg、.mp3、.mp4、.ppt 等
  - 可以调用 `flush()` 强制将管道（流）中的数据写入文件
  :::
  

**3. 图片加密与解密**  

```java
// 图片加密
public static void test1() throws Exception{
    FileInputStream fileInputStream = new FileInputStream("common2\\P35.jpg");
    FileOutputStream fileOutputStream = new FileOutputStream("common2\\copy-enco.jpg");

    byte[] buf = new byte[100];
    int len = -1;

    while ((len = fileInputStream.read(buf)) != -1) {
        // 加密
        for (int i = 0; i < len; i++) {
            buf[i] = (byte)(buf[i] ^ 5);
        }
        fileOutputStream.write(buf, 0, len);
    }

    fileOutputStream.close();
    fileInputStream.close();
}

// 图片解密
public static void test2() throws Exception{
    FileInputStream fileInputStream = new FileInputStream("common2\\copy-enco.jpg");
    FileOutputStream fileOutputStream = new FileOutputStream("common2\\copy-deco.jpg");

    byte[] buf = new byte[100];
    int len = -1;

    while ((len = fileInputStream.read(buf)) != -1) {
        // 解密
        for (int i = 0; i < len; i++) {
            buf[i] = (byte)(buf[i] ^ 5);
        }
        fileOutputStream.write(buf, 0, len);
    }

    fileOutputStream.close();
    fileInputStream.close();
}
```

**4. 转换流**

转换流也是一种处理流，可以使字节流和字符流之间相互转换。Java 中提供了两种转换流： `InputStreamReader`、 `OutputStreamWriter`，这两个转换流都属于**字符流**。

- **`InputStreamReader`**  

  将字节输入流转换为字符输入流，即将 `InputStream` 转为 `Reader`。解码：字节、字节数组 -> 字符（数组）、字符串

  ```java
  FileInputStream fileInputStream = new FileInputStream("common2\\1.txt");
  // 使用 IDE 默认的字符集
  //  InputStreamReader inputStreamReader = new eamReader(fileInputStream);
  // 使用 UTF-8，该字符集取决于文件保存时所用的字符集
  InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
  //  InputStreamReader inputStreamReader = new eamReader(fileInputStream， forName("UTF-8"));

  char[] buf = new char[10];
  int len = -1;
  while ((len = inputStreamReader.read(buf)) != -1) {
      System.out.print(new String(buf, 0, len));
  }

  inputStreamReader.close();
  ```

- **`OutputStreamWriter`**  

  将字符输出流转为字节输出流，即将 `Writer` 转为 `OutputStream`。编码：字符（数组）、字符串 -> 字节、字节数组
  ```java
  /* 将文件编码格式从 UTF-8 转为 GBK */
  FileInputStream fileInputStream = new FileInputStream("common2\\1.txt");
  InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "utf-8");

  FileOutputStream fileOutputStream = new FileOutputStream("common2\\1-gbk.txt");
  OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "gbk");

  char[] buf = new char[10];
  int len = -1;
  while ((len = inputStreamReader.read(buf)) != -1) {
      outputStreamWriter.write(buf, 0, len);
  }
  outputStreamWriter.close();
  inputStreamReader.close();
  ```

**5. 标准输入、输出流**

标准输入流：`System.in`，默认从键盘输入，对应 `InputStream`  
标准输出流：`System.out`，默认在控制台打印，对应 `PrintStream`  

可以使用 `System.setIn()`、`System.setOut()` 重新指定输入流或输出流。

**实现从键盘输入一行字符串，将其转为大写输出**

```java
/* 传统方式 */
public static void test1() {
    Scanner scanner = new Scanner(System.in);

    System.out.print("-> ");
    String str = scanner.nextLine();

    while (!"e".equalsIgnoreCase(str) && !"exit".equalsIgnoreCase(str)) {
        System.out.println(str.toUpperCase());
        System.out.print("-> ");
        str = scanner.nextLine();
    }
    System.out.println("exit! bye");
}

/* 使用转换流 */
public static void test2() throws Exception{
    InputStreamReader inputStreamReader = new InputStreamReader(System.in);
    BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

    String str;
    System.out.print("-> ");
    str = bufferedReader.readLine();
    while (!"e".equalsIgnoreCase(str) && !"exit".equalsIgnoreCase(str)) {
        System.out.println(str.toUpperCase());
        System.out.print("-> ");
        str = bufferedReader.readLine();
    }
    System.out.println("\nexit! bye");
    bufferedReader.close();
}
```
**自定义输入类，实现各种类型的数据输入**   

:::tip 提示
使用转换流，写一个读取字符串的方法，其它类型的输入只需调用读取字符串的方法进行类型转换即可。
:::

**6. 打印流**

实现将**基本数据类型**格式化输出为**字符串**。它们提供了一系列重载的 `print()` 和 `println()` 方法，且自带 flush。

- `PrintStream`  

- `PrintWriter`  

**7. 数据流**

数据流可以很方便的用来处理基本数据类型和字符串。数据流有 `DataInputStream` 和 `DataOutputStream`，这两个分别用来处理 `InputStream` 和 `OutputStream`。注意，读写的顺序应该一致。

```java
public static void test1() throws Exception{

    // 将数据保存到 data.txt
    FileOutputStream outputStream = new FileOutputStream("common2\\data.txt");
    DataOutputStream dataOutputStream = new DataOutputStream(outputStream);

    // 写入字符串
    dataOutputStream.writeUTF("字符串");
    dataOutputStream.flush();
    dataOutputStream.writeDouble(123);
    dataOutputStream.flush();
    dataOutputStream.writeInt(23);
    dataOutputStream.flush();

    dataOutputStream.close();
    
    // 直接打开文件会出现乱码
}

public static void test2() throws Exception{
    // 从 data.txt 中读取数据
    FileInputStream inputStream = new FileInputStream("common2\\data.txt");
    DataInputStream dataInputStream = new DataInputStream(inputStream);

    // 按照写入的顺序读取
    String s = dataInputStream.readUTF();
    double v = dataInputStream.readDouble();
    int i = dataInputStream.readInt();

    System.out.println(s);
    System.out.println(i);
    System.out.println(v);

    dataInputStream.close();
}
```

**8. 对象流**

对象流是用于存储和读取**基本数据类型**和**对象**的处理流，它的强大之处就是把对象写入文件，并能将对象从文件中还原出来。主要有 `ObjectInputStream` 和 `ObjectOutputStream`。

- 序列化：用于保存基本数据类型和对象时进行的操作  
- 反序列化：用于读取基本数据类型和对象时进行的操作

`ObjectInputStream` 和 `ObjectOutputStream` 不能序列化 **static** 和 **transient** 修饰的成员变量。

```java
/* Person 已经实现序列化接口 */
public static void test1() throws Exception{
    ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("common2\\3.txt"));
    objectOutputStream.writeObject(new Person(1, "zs","123@qq.com"));
    objectOutputStream.flush();
    objectOutputStream.close();
}
public static void test2() throws Exception{
    ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream("common2\\3.txt"));
    Object o = objectInputStream.readObject();
    if (o instanceof Person) {
        System.out.println((Person) o);
    }
    objectInputStream.close();
}
```
:::tip 提示
- 序列化时要提供一个全局常量 `serialVersionUID`，该常量的值可以是任意的 Long 类型数据 
- 除了该类需要被序列化之外，其所有属性也应该实现序列化接口  
- String 已实现序列化接口，基本数据类型默认是可序列化的
:::

**9. 随机存取文件流**

- `RandomAccessFile`  

  `RandomAccessFile` 类有两个构造函数，其实这两个构造函数基本相同，只不过是指定文件的形式不同——一个需要使用 String 参数来指定文件名，一个使用 File 参数来指定文件本身。除此之外，创建 `RandomAccessFile` 对象时还需要指定一个 mode 参数，该参数指定 `RandomAccessFile` 的访问模式，一共有 4 种模式。

  - **"r"**:  以只读方式打开。调用结果对象的任何 write 方法都将导致抛出 IOException。
  - **"rw"**: 打开以便读取和写入。
  - **"rws"**: 打开以便读取和写入。相对于 "rw"，"rws" 还要求对“文件的内容”或“元数据”的每个更新都同步写入到基础存储设备。
  - **"rwd"**: 打开以便读取和写入，相对于 "rw"，"rwd" 还要求对“文件的内容”的每个更新都同步写入到基础存储设备。

  ```java
  public static void test1() throws Exception{
      RandomAccessFile accessFile1 = new RandomAccessFile(new File("common2\\P35.jpg"), "r");
      RandomAccessFile accessFile2 = new RandomAccessFile(new File("common2\\p35_copy.jpg"), "rw");

      byte[] buf = new byte[100];
      int len = -1;
      while ((len = accessFile1.read(buf)) != -1) {
          accessFile2.write(buf, 0, len);
      }
      accessFile1.close();
  }
  ```
  :::tip 提示
  `RandomAccessFile` 在写文件时，是把文件的内容从头开始覆盖（不一定会完全覆盖），文件不存在则创建。
  :::

  **实现覆盖指定位置的内容**  

  使用 `seek()` 指定开始插入的位置（从 0 开始）, 本质上修改的是文件的指针。

  ```java
  RandomAccessFile rw = new RandomAccessFile("common2\\123.txt", "rw");
  rw.seek(8);
  rw.write("12".getBytes());
  rw.close();
  ```

  **追加文件内容**

  ```java
  public static void test3() throws Exception{
      File file = new File("common2\\123.txt");
      RandomAccessFile rw = new RandomAccessFile(file, "rw");
      rw.seek(file.length());
      rw.write("  hello".getBytes());
      rw.close();
  }
  ```

  **插入内容**

  ```java
  File file = new File("common2\\123.txt");
  RandomAccessFile rw = new RandomAccessFile(file, "rw");
  rw.seek(6);
  byte[] buf = new byte[10];
  int len = -1;
  // 防止文件过大而导致频繁扩容
  // 但是，针对大文件，不建议指定长度
  // 比如 6G 的文件，我就需要一次开辟 6G 的内存空间
  // 而我总共的内存才 8G，很容易导致内存耗尽
  StringBuilder sb = new StringBuilder((int)file.length());
  // 先保存后面的内容
  while ((len = rw.read(buf)) != -1) {
      sb.append(new String(buf, 0, len));
  }
  System.out.println(sb.toString());
  // 使指针重新回到 6
  rw.seek(6);
  rw.write(("  添加内容" + sb.toString()).getBytes());
  rw.close();
  ```

**10. NIO**  

NIO（Non-blocking I/O，在 Java 领域，也称为 New I/O），是一种同步非阻塞的 I/O 模型，也是 I/O 多路复用的基础，已经被越来越多地应用到大型应用服务器，成为解决高并发与大量连接、I/O 处理问题的有效方式。NIO 是基于缓冲区的。

我们通常所说的 BIO 是相对于 NIO 来说的，BIO 也就是 Java 开始之初推出的 IO 操作模块，BIO 是 BlockingIO 的缩写，顾名思义就是阻塞 IO 的意思。IO 是面向流的。

JDK 7 中引入了 NIO2，提供了 Path、Paths、Files 等 API。Path 可以看成 File 的替代类。
