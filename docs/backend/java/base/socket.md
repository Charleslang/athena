# 网络编程

在 Java 中 `InetAddress` 代表 IP。
```java
InetAddress localhost = InetAddress.getByName("localhost");
System.out.println(localhost);
InetAddress localHost = InetAddress.getLocalHost();// 直接获取本机
String hostName = localHost.getHostName();// 域名
String hostAddress = localHost.getHostAddress();// IP
```

端口号用于标识计算机上运行的程序，不同进程有不同的端口。端口号的范围从 0 到 65535。

- **（1）公认端口（WellKnownPorts）**

  从 0 到 1023，它们紧密绑定（binding）于一些服务。通常这些端口的通讯明确表明了某种服务的协议。例如：80端口实际上总是HTTP通讯。

- **（2）注册端口（RegisteredPorts）**

  从 1024 到 49151。它们松散地绑定于一些服务。也就是说有许多服务绑定于这些端口，这些端口同样用于许多其它目的。例如：许多系统处理动态端口从1024左右开始。

- **（3）动态和/或私有端口（Dynamicand/orPrivatePorts）**

  从 49152 到 65535。理论上，不应为服务分配这些端口。实际上，机器通常从1024起分配动态端口。但也有例外：SUN的RPC端口从32768开始。

**主机地址和端口号合在一起称为一个套接字（socket）**。


## TCP 编程

```java
System.out.println("服务端启动");
ServerSocket serverSocket = new ServerSocket(8886);
// 监听端口
Socket accept = serverSocket.accept();
InputStream inputStream = accept.getInputStream();
// 不建议使用字节流（可能出现中文乱码）
//        byte[] buf = new byte[100];
//        int len = -1;
//        while ((len = inputStream.read()) != -1) {
//            System.out.print(new String(buf, 0, len));
//        }

// 这个 stream 就相当于一个放在内存中的缓冲区（可以理解为变量）
// 它会自动进行扩充
ByteArrayOutputStream stream = new ByteArrayOutputStream();
byte[] buf = new byte[10];
int len = -1;
while ((len = inputStream.read(buf)) != -1) {
    stream.write(buf, 0, len);
}
System.out.println("收到了来自：" + accept.getInetAddress().getHostAddress() + " 的信息");
System.out.println("信息内容为：\n" + stream.toString());

stream.close();
inputStream.close();
accept.close();
serverSocket.close();

/* ------------客户端----------- */
System.out.println("客户端发送");
// 目标主机
Socket socket = new Socket("localhost", 8886);
OutputStream outputStream = socket.getOutputStream();
outputStream.write("hello world".getBytes());
outputStream.close();
socket.close();
```
```java
/* 客户端发送文件 */
System.out.println("客户端发送");
InetAddress localhost = InetAddress.getByName("localhost");
Socket socket = new Socket(localhost, 8888);
OutputStream outputStream = socket.getOutputStream();

FileInputStream fileInputStream = new FileInputStream("common2\\P35.jpg");
byte[] buf = new byte[1024];
int len = -1;
while ((len = fileInputStream.read(buf)) != -1) {
    outputStream.write(buf, 0, len);
}

fileInputStream.close();
outputStream.close();
socket.close();

/* 服务端接收文件 */
System.out.println("服务器启动");
ServerSocket serverSocket = new ServerSocket(8888);
Socket socket = serverSocket.accept();
InputStream inputStream = socket.getInputStream();
FileOutputStream out = new FileOutputStream("common2\\server.jpg");
byte[] buf = new byte[1024];
int len = -1;
while ((len = inputStream.read(buf)) != -1) {
    out.write(buf, 0, len);
}

System.out.println("收到了来自：" + socket.getInetAddress().getHostAddress() + " 的信息");

out.close();
inputStream.close();
socket.close();
serverSocket.close();
```
```java
/* 接收服务器的反馈 */
System.out.println("客户端发送");
InetAddress localhost = InetAddress.getByName("localhost");
Socket socket = new Socket(localhost, 8888);
OutputStream outputStream = socket.getOutputStream();

FileInputStream fileInputStream = new FileInputStream("common2\\P35.jpg");
byte[] buf = new byte[1024];
int len = -1;
while ((len = fileInputStream.read(buf)) != -1) {
    outputStream.write(buf, 0, len);
}

// 若要接收服务端的信息，则必须先关闭输出
socket.shutdownOutput();

// 接收服务端的反馈信息
// 直接使用字节流可能出现中文乱码
InputStream inputStream = socket.getInputStream();
ByteArrayOutputStream baos = new ByteArrayOutputStream();
byte[] buffer = new byte[1024];
while ((len = inputStream.read(buffer)) != -1) {
    baos.write(buffer, 0, len);
}
System.out.println(baos.toString());

baos.close();
inputStream.close();
fileInputStream.close();
outputStream.close();
socket.close();

/* 服务器 */
System.out.println("服务器启动");
ServerSocket serverSocket = new ServerSocket(8888);
Socket socket = serverSocket.accept();
InputStream inputStream = socket.getInputStream();
FileOutputStream out = new FileOutputStream("common2\\server2.jpg");
byte[] buf = new byte[1024];
int len = -1;
while ((len = inputStream.read(buf)) != -1) {
    out.write(buf, 0, len);
}

System.out.println("收到了来自：" + socket.getInetAddress().getHostAddress() + " 的信息");

// 服务端反馈
OutputStream outputStream = socket.getOutputStream();
outputStream.write("发送成功".getBytes());

out.close();
inputStream.close();
socket.close();
serverSocket.close();
```

## UDP 编程

```java
/* 客户端 */
InetAddress name = InetAddress.getByName("127.0.0.1");
DatagramSocket datagramSocket = new DatagramSocket();

String message = "hello";
DatagramPacket datagramPacket = new DatagramPacket(message.getBytes(), 0, message.length(),name, 8888);

datagramSocket.send(datagramPacket);
datagramSocket.close();

/* 服务端 */
DatagramSocket socket = new DatagramSocket(8888);

byte[] buffer = new byte[1024];
DatagramPacket packet = new DatagramPacket(buffer, 0, buffer.length);
socket.receive(packet);

System.out.println(new String(packet.getData(), 0, packet.getLength()));

socket.close();
```
## URL 编程

URL 是统一资源定位符（Uniform Resource Locator）的简称，它表示 Internet 上某一资源的地址，通过 URL 可以访问各种网络资源。

```java
URL url = new URL("http://localhost:8080/example/index.html");
System.out.println(url.getProtocol()); // 协议
System.out.println(url.getHost());// 主机
System.out.println(url.getPort());// 端口
System.out.println(url.getPath());// 文件路径
System.out.println(url.getFile());// 文件名
System.out.println(url.getQuery());// 查询参数
```

```java
/* 下载图片 */
URL url = new URL("http://localhost:8080/examples/P35.jpg");
// 获取连接
// URLConnection urlConnection = url.openConnection();
HttpURLConnection urlConnection = (HttpURLConnection)url.openConnection();
urlConnection.connect();
InputStream inputStream = urlConnection.getInputStream();
FileOutputStream outputStream = new FileOutputStream("common2\\3.jpg");
byte[] buf = new byte[1024];
int len = -1;
while ((len = inputStream.read(buf)) != -1) {
    outputStream.write(buf, 0, len);
}
System.out.println("下载成功");
outputStream.close();
inputStream.close();
urlConnection.disconnect();
```
