# PicGo 插件

**为什么要提到 PicGo，PicGo 是什么？**

<a href="https://picgo.github.io/PicGo-Core-Doc/" target="_blank">PicGo</a> 插件可以帮助我们实现在 makdown 中粘贴图片自动上传到云端，并回写云端图片的 URL。 

1. **VS Code 中安装 PicGo 插件**

    ![2023022623141175.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141175.png)

2. **阿里云购买 OSS 套餐并进行如下配置**

    2.1. 创建 Bucket
    
    ![2023022623141196.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141196.png)
    
    2.2. Bucket 读写权限选择公共读, 其它使用默认配置即可
    
    ![2023022623141218.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141218.png)
    
    2.3. 进入新建的 Bucket 中，新建目录（可选，新建目录的作用仅仅是为了帮助我们对文件进行分类管理）
    
    ![2023022623141251.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141251.png)
    
3. **创建 RAM 子用户**

    3.1. 进入 RAM 控制台
    
    ![2023022623141267.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141267.png)
    
    3.2. 选择使用子用户
    
    ![2023022623141284.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141284.png)
    
    3.3. 创建用户
    
    ![2023022623141312.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141312.png)
    
    3.4. 选择 Open API 方式（创建用户后务必记住 AccessKeyId 和 AccessKeySecret）
    
    ![2023022623141334.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141334.png)
    
    3.5. 给用户授权
    
    ![2023022623141399.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141399.png)
    
    ![2023022623141418.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141418.png)
    
    
4. **VS Code 配置 PicGo 插件**

    ![2023022623141437.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141437.png)
    
    4.1. 设置阿里云的基本参数
    
    ![2023022623141480.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141480.png)
    
    4.2. 将 Pic Bed 设置为 aliyun
    
    ![2023022623141498.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141498.png)
    
    4.3. 设置图片上传到 OSS 的目录（参考步骤 2.3 中设置的目录）
    
    ![2023022623141521.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141521.png)
    
5. **在 md 文件中测试（复制一张图，直接粘贴到 markdown 中，使用快捷键 `Ctrl` + `Shift` + `U` 进行粘贴）**

    ![2023022623141543.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141543.png)
    
好了，到上面我们已经配置完成了。接下来就可以愉快地使用 VS Code 来编写 markdown 了。

值得注意的是，PicGo 默认会将图片的映射保存到 `~/.picgo/config.json` 目录下，即 `C:\Users\你的用户名\.picgo\config.json` 下，如果我们 markdown 中的图片很多，那么该文件会越来越大。我们可以修改它的位置，如下：

![2023022623141558.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141558.png)

修改之后再测试下图片粘贴是否自动上传，但是我们会发现报错了，如下：

![2023022623141575.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141575.png)

不用担心，这个报错不影响使用，我们会发现图片其实已经上传到了 OSS 中。但是有个问题是，这个报错会影响 PicGo 回写图片的 URL 到 markdown 中，也就是说会影响我们使用。那怎么办呢？很简单，我们需要把文件名也写上，如下：

![2023022623141686.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141686.png)

注意，我们不能自己创建 json 配置文件，需要由 PicGo 自动创建，如果该配置文件已经存在，则会报如下错误：

![2023022623141705.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141705.png)

`vscode-picgo-data.json` 文件中的内容如下：

```json
{
  "uploaded": [
    {
      "fileName": "p45.jpg",
      "width": 5500,
      "height": 3600,
      "extname": ".jpg",
      "imgUrl": "https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/note/p45.jpg",
      "type": "aliyun",
      "id": "d47130c2-f22a-453a-9992-ccc83890a625"
    }
  ]
}
```

:::details 提示

剪切板中的图片可通过以下快捷键进行粘贴

![2023022623141729.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-02-26/2023022623141729.png)
:::

:::tip 提示
文字按钮在现在有了全新的设计样式。 
2.2.0 如果您想要使用老版样式的按钮，可以考虑使用 Link 组件。

API也已更新，由于 type 属性会同时控制按钮的样式， 因此我们通过一个新的 API text: boolean 来控制文字按钮。
:::


:::warning 提示
文字按钮在现在有了全新的设计样式。 
2.2.0 如果您想要使用老版样式的按钮，可以考虑使用 Link 组件。

API也已更新，由于 type 属性会同时控制按钮的样式， 因此我们通过一个新的 API text: boolean 来控制文字按钮。
:::

:::danger 提示
文字按钮在现在有了全新的设计样式。 
2.2.0 如果您想要使用老版样式的按钮，可以考虑使用 Link 组件。

API也已更新，由于 type 属性会同时控制按钮的样式， 因此我们通过一个新的 API text: boolean 来控制文字按钮。
:::
