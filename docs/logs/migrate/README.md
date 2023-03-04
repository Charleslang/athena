---
sidebar: ['/logs/migrate/index.html']
---
# 迁移日志

## 迁移计划

计划把有道云笔记、语雀、CSDN、博客园的笔记全部进行迁移。

## 迁移记录

### 2023-03-04

- :heavy_check_mark: 有道云笔记前端已全部迁移


## 迁移代码

由于有道云笔记中存在图片, 在迁移到本站时, 需要把图片地址从有道云换成阿里云 OSS 地址（有道云笔记的图片需要登录才能进行访问）, 也算变相实现笔记的双重备份吧。

**本次是借助 Java 脚本来实现的，大致思路如下：**

- 遍历有道云的每一个 `.md` 文件
- 读取文件内容, 提取其中的图片
- 将提取到的图片进行下载, 然后上传到阿里云 OSS
- 用 OSS 的图片地址替换 `.md` 中原图片的地址

**相关代码如下：**

- `pom.xml`

  ```xml
  <build>
      <plugins>
          <plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-compiler-plugin</artifactId>
              <configuration>
                  <source>8</source>
                  <target>8</target>
              </configuration>
          </plugin>
      </plugins>
  </build>

  <properties>
      <maven.compiler.target>1.8</maven.compiler.target>
      <maven.compiler.source>1.8</maven.compiler.source>
  </properties>

  <dependencies>
      <dependency>
          <groupId>com.aliyun.oss</groupId>
          <artifactId>aliyun-sdk-oss</artifactId>
          <version>3.16.1</version>
      </dependency>
  </dependencies>
  ```

- `AliyunOSSUtils.java`

  ```java
  public class AliyunOSSUtils {

      private static final DateTimeFormatter fileNameFormatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSS");

      private static final DateTimeFormatter directoryFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

      private static final String DEFAULT_FILE_EXT = "png";

      private static final String ENDPOINT = "https://oss-cn-hangzhou.aliyuncs.com";

      private static final String ACCESS_KEY = "";

      private static final String ACCESS_KEY_SECRET = "";

      private static final String BUCKET_NAME = "djfmdresources";

      private static final String OBJECT_NAME_PREFIX = "athena";

      private static final OSS ossClient;

      static {
          ossClient = initOssClient();
      }

      private AliyunOSSUtils() { }

      private static OSS initOssClient() {
          try {
              return new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY, ACCESS_KEY_SECRET);
          } catch (OSSException e) {
              System.out.println("Caught an OSSException, which means your request made it to OSS, "
                      + "but was rejected with an error response for some reason.");
              System.out.println("Error Message:" + e.getErrorMessage());
              System.out.println("Error Code:" + e.getErrorCode());
              System.out.println("Request ID:" + e.getRequestId());
              System.out.println("Host ID:" + e.getHostId());
          } catch (ClientException e) {
              System.out.println("Caught an ClientException, which means the client encountered "
                      + "a serious internal problem while trying to communicate with OSS, "
                      + "such as not being able to access the network.");
              System.out.println("Error Message:" + e.getMessage());
          } finally {
              if (ossClient != null) {
                  ossClient.shutdown();
              }
          }
          return null;
      }

      public static String upload(String webUrl) throws Exception {
          if (StringUtils.isNullOrEmpty(webUrl)) {
              return null;
          }
          URL url = new URL(webUrl);
          URLConnection urlConnection = url.openConnection();
          urlConnection.setRequestProperty("User-Agent", "Mozilla/4.0");
          // 需要登录有道云笔记才行
          urlConnection.setRequestProperty("Cookie", "");
          String contentType = urlConnection.getContentType();
          String fileExt = DEFAULT_FILE_EXT;
          if (contentType != null && contentType.startsWith("image/")) {
              fileExt = contentType.substring(contentType.lastIndexOf("/") + 1);
          }
          InputStream inputStream = urlConnection.getInputStream();

          // 创建 PutObjectRequest 对象
          PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, getNewFileFullPathName(fileExt), inputStream);
          // 设置该属性可以返回 response。如果不设置，则返回的 response 为空
          putObjectRequest.setProcess(Boolean.TRUE.toString());
          // 创建 PutObject 请求
          PutObjectResult result = ossClient.putObject(putObjectRequest);
          // 如果上传成功，则返回 200
          ResponseMessage response = result.getResponse();
          if (response.isSuccessful()) {
              String ossUrl = response.getUri();
              System.out.println("上传后的 oss 地址：" + ossUrl);
              return ossUrl;
          }
          inputStream.close();
          return null;
      }

      private static String getNewFileFullPathName(String fileExt) {
          LocalDateTime now = LocalDateTime.now();
          String fileDirectory = directoryFormatter.format(now);
          String newFileName = fileNameFormatter.format(now);
          return OBJECT_NAME_PREFIX + "/" + fileDirectory + "/" + newFileName + "." + fileExt;
      }
  }
  ```

- `FileUtils.java`  

  ```java
  public class FileUtils {

      private static final Pattern IMAGE_PATTERN = Pattern.compile("!\\[(?<imageName>.[^!\\]]*)\\]\\((?<imageUrl>.[^\\)]+)\\)");

      public static int replaceMdImage(String originFile, String targetFile) throws Exception {
          int count = 0;
          String content = readFile(originFile);
          if (StringUtils.isNullOrEmpty(content)) {
              System.out.println("文件 " + originFile + " 内容为空, 跳过处理!");
              return count;
          }
          StringBuffer sb = new StringBuffer();
          Matcher matcher = IMAGE_PATTERN.matcher(content);
          while (matcher.find()) {
              String mdFullImage = matcher.group(0);
              String imageName = matcher.group("imageName");
              String imageUrl = matcher.group("imageUrl");
              if (StringUtils.isNullOrEmpty(mdFullImage)
                      || StringUtils.isNullOrEmpty(imageUrl)
                      || isAliyunImage(imageUrl)) {
                  continue;
              }
              System.out.println(String.format("开始替换 image: %s, imageUrl: %s", imageName, imageUrl));
              String ossImageUrl = AliyunOSSUtils.upload(imageUrl);
              if (StringUtils.isNullOrEmpty(ossImageUrl)) {
                  continue;
              }
              mdFullImage = mdFullImage.replace(imageUrl, ossImageUrl);
              matcher.appendReplacement(sb, mdFullImage.replace(imageUrl, ossImageUrl).replace(imageName, ossImageUrl.substring(ossImageUrl.lastIndexOf("/") + 1)));
              count++;
          }
          if (count > 0) {
              matcher.appendTail(sb);
              writeFile(sb.toString(), targetFile);
          }
          return count;
      }

      private static String readFile(String fileFullPathName) throws IOException {
          StringBuilder contentBilder = new StringBuilder();
          try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(fileFullPathName), "UTF-8"))) {
              String line;
              while ((line = bufferedReader.readLine()) != null) {
                  contentBilder.append(line).append("\r\n");
              }
          } catch (IOException e) {
              throw e;
          }
          String content = contentBilder.toString();
          return content;
      }

      private static void writeFile(String content, String targetFile) {
          try (OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(new File(targetFile)), "UTF-8")) {
              osw.write(content);
              osw.flush();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }

      private static boolean isAliyunImage(String url) {
          return url.contains("aliyuncs.com");
      }
  }
  ```

- `Migrate.java`

  ```java
  public class Migrate {

      private static final String MD_FILE_PATH = "E:\\myproject\\web\\vuepress\\athena\\docs";

      private static final AtomicInteger pageCount = new AtomicInteger(0);

      private static final AtomicInteger imageCount = new AtomicInteger(0);

      private static final String MD_FILE_EXT = ".md";

      private static void run() throws Exception {
          List<Path> paths = Files.walk(Paths.get(MD_FILE_PATH)).collect(Collectors.toList());
          for (Path path : paths) {
              String originFile = path.toFile().getAbsolutePath();
              String targetFile = path.toFile().getAbsolutePath().replace(MD_FILE_PATH, MD_FILE_PATH);

              try {
                  if (Files.isDirectory(path)) {
                      if (!new File(targetFile).exists()) {
                          Files.createDirectory(Paths.get(targetFile));
                      }
                  } else {
                      if (isMdFile(originFile)) {
                          System.out.println("-----------------------------------------------------------------------------------");
                          int replaceCount = FileUtils.replaceMdImage(originFile, targetFile);
                          imageCount.addAndGet(replaceCount);
                          pageCount.incrementAndGet();
                          System.out.println(targetFile + " 替换完成, 共替换 " + replaceCount + " 处");
                      } else {
                          Files.copy(path, Paths.get(targetFile));
                      }
                  }
              } catch (Exception e) {
                  if (e instanceof FileAlreadyExistsException) {
                      System.out.println("目标文件: " + targetFile + " 已经存在");
                      e.printStackTrace();
                  } else {
                      throw e;
                  }
              }
              TimeUnit.MILLISECONDS.sleep(500);
          }
          System.out.println("-----------------------------------------------------------------------------------");
      }

      private static boolean isMdFile(String file) {
          if (StringUtils.isNullOrEmpty(file)) {
              return false;
          }
          return file.lastIndexOf(MD_FILE_EXT) > 0;
      }

      public static void main(String[] args) throws Exception {
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
          String start = formatter.format(LocalDateTime.now());
          System.out.println("\n[START-TIMESTAMP] " + start + "\n");

          run();

          System.out.println("\n迁移完成, 本次迁移文件总数: " + pageCount.get() + ", 迁移图片总数: " + imageCount.get());
          String end = formatter.format(LocalDateTime.now());
          System.out.println("\n[END-TIMESTAMP] " + end + "\n");
      }
  }
  ```