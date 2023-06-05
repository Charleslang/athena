# 字符集
## 前言  

计算机中储存的信息都是用二进制数表示的，我们在屏幕上看到的英文、汉字等字符是二进制数转换之后的结果。通俗的说，按照何种规则将字符存储在计算机中，如 `'a'` 用什么表示，称为"编码"；反之，将存储在计算机中的二进制数解析显示出来，称为"解码"，如同密码学中的加密和解密。在解码过程中，如果使用了错误的解码规则，则导致 `'a'` 解析成 `'b'` 或者乱码。

在编程中，经常能够见到各种字符集和编码。事实上，字符集和编码是两个不同概念，仅仅是有些地方有重合罢了。

## 什么是字符集  

顾名思义，就是字符的集合。是一个系统支持的所有抽象字符的集合。字符是各种文字和符号的总称，包括各国家文字、标点符号、图形符号、数字等。准确来说，在计算机中，字符集指的是已编号的字符的有序集合（不一定连续）。  

字符集种类较多，每个字符集包含的字符个数也不同。

## 什么是编码

是一套法则，使用该法则能够对自然语言的字符的集合（如字母表或音节表）与其它东西的一个集合（如号码或电脉冲）进行配对。即在符号集合与数字系统之间建立对应关系，它是信息处理的一项基本技术。人们通常用符号集合（一般情况下就是文字）来表达信息，而以计算机为基础的信息处理系统则是利用元件（硬件）不同状态的组合来存储和处理信息的，元件不同状态的组合能代表数字系统中的数字。因为计算机只能处理数字（0 和 1），如果要处理文本，就必须先把文本转换为数字才能处理。因此字符编码就是将符号转换为计算机可以接受的数字代码。

## 字符码（代码点 Code Point）

Code Point 指的就是字符集中每一个字符的数字编号，每一个数字，就是一个 Code Point。  

比如 ASCII 字符集用 0-127 这连续的 128 个数字分别表示 128 个字符。GBK 字符集使用区位码的方式为每一个字符编号，首先定义一个 94 x 94 的矩阵，行称为“区”，列称为“位”。然后将全部国标汉字放入矩阵其中，这样每一个汉字就能够用唯一的“区位”码来标识了。比如“中”字被放到 54 区第 48 位。因此 Code Point 就是 5448。而 Unicode 中将字符集依照一定的类别划分到 0~16 这 17 个层面（Planes）中。每一个层面中拥有 *256 * 256 = 65536* 个字符码，因此 Unicode 总共拥有的字符码就是 Unicode 的字符空间，即 *17 * 65536 = 1114112*。

顺便说下字体文件。通俗的讲，字体文件中存放的就是 Code Point 对应的图形，以便计算机将代码点渲染成该对应的图形，然后人就可以阅读了。有的字体，里边没有存储中文，这些字体就渲染不了中文。

![字体图片示例](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2023-06-05/font.png)

此图表明 U+007A 字符在 Arial 字体中会被渲染成上面选中的图形。

## 常见的字符集

### ASCII 字符集

:::tip 参考  
[ASCII 字符集](https://tool.oschina.net/commons?type=4)
:::

`ASCII`（American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统。最初的计算机字符编码是通过 ASCII 来编码的，它是现今最通用的单字节编码系统。由于只用一个字节就能表示 ASCII 字符，所以，理论上，ASCII 字符集最多只能表示 *2<sup>8</sup>=256* 个字符。但是，直到现在，ASCII 字符集中也才只有 128 个字符。  

由于只有 128 个字符，所以，只使用了 1 个比特位中的后 7 位（对应的范围为 `0x00` - `0x7F`），最高位为 0。

### ISO 8859-1 字符集

:::tip 参考
[ISO 8859-1 字符集](https://zh.wikipedia.org/wiki/ISO/IEC_8859-1)
:::

英语用 128 个符号编码就够了，但是用来表示其他语言，128 个符号是不够的。比如，在法语中，字母上方有注音符号，它就无法用 ASCII 码表示。于是，一些欧洲国家就决定，利用字节中闲置的最高位编入新的符号。比如，法语中的 `é` 的编码为 130（二进制 `10000010`）。这样一来，这些欧洲国家使用的编码体系，可以表示最多 256 个符号。

ISO 8859-1 正式编号为 ISO/IEC 8859-1:1998，又称 Latin-1 或“西欧语言”。它是国际标准化组织内 ISO/IEC 8859 的第一个 8 位字符集。它以 ASCII 为基础，在空置的 `0xA0` -`0xFF` 的范围内，加入 96 个字母及符号，藉以供使用附加符号的拉丁字母语言使用。所以，ISO 8859-1 字符集中的字符也是只占用了一个字节，能表示 256 个字符。  

ISO-8859-1 编码是单字节编码，向下兼容 ASCII，是许多欧洲国家使用的编码标准。其编码范围是 `0x00` - `0xFF`，`0x00` - `0x7F` 之间完全和 ASCII 一致，`0x80` - `0x9F` 之间是控制字符，`0xA0` - `0xFF` 之间是文字符号。

### GB2312 字符集

由于亚洲国家的文字，使用的符号较多，汉字就多达 10 万左右。一个字节只能表示 256 种符号，肯定是不够的，就必须使用多个字节表达一个符号。为了满足国内在计算机中使用汉字的需要，中国国家标准总局发布了一系列的汉字字符集国家标准编码，统称为 GB 码，或国标码。其中最有影响的是于 1980 年发布的《信息交换用汉字编码字符集 基本集》，标准号为 GB 2312-1980，因其使用非常普遍，也常被通称为国标码。GB2312 编码通行于我国内地，新加坡等地也采用此编码。几乎所有的中文系统和国际化的软件都支持 GB 2312。

GB 2312是一个简体中文字符集，由 6763 个常用汉字和 682 个全角的非汉字字符组成。

GB2312 编码用两个字节表示一个汉字，所以理论上最多可以表示 256×256=65536 个汉字。但这种编码方式也仅仅在中国行得通，如果您的网页使用 GB2312 编码，那么很多外国人在浏览你的网页时就可能无法正常显示，因为其浏览器不支持 GB2312 编码。当然，中国人在浏览外国网页时，也会出现乱码或无法打开的情况，因为我们的浏览器没有安装对应的编码表。  

对于人名、古汉语等方面出现的罕用字，GB2312 不能处理，这导致了后来 GBK 及GB 18030 汉字字符集的出现。

### GBK 字符集

由于 GB 2312-80 只收录 6763 个汉字，有不少汉字，如部分在 GB 2312-80 推出以后才简化的汉字（如"啰"），部分人名用字（如中国前总理朱镕基的"镕"字），台湾及香港使用的繁体字，日语及朝鲜语汉字等，并未有收录在内。于是厂商微软利用 GB 2312-80 未使用的编码空间，收录 GB 13000.1-93 全部字符制定了 GBK（K 就是扩展） 编码。根据微软资料，GBK 是对 GB2312-80 的扩展，也就是 CP936 字码表 (Code Page 936)的扩展（之前 CP936 和 GB 2312-80 一模一样），最早实现于 Windows 95 简体中文版。虽然 GBK 收录GB 13000.1-93的全部字符，但编码方式并不相同。GBK 自身并非国家标准，只是曾由国家技术监督局标准化司、电子工业部科技与质量监督司公布为"技术规范指导性文件"。原始GB13000一直未被业界采用，后续国家标准 GB18030 技术上兼容 GBK 而非 GB13000。  

GBK 为“国家标准扩展”的汉语拼音（guójiābiāozhǔnkuòzhǎn）中的“国”“标”“扩”第一个声母。英文全称 Chinese Internal Code Extension Specification。

GBK 共收录 21886 个汉字和图形符号，其中汉字（包括部首和构件）21003 个，图形符号 883 个。GBK 只为“技术规范指导性文件”，不属于国家标准。国家质量技术监督局于 2000 年 3 月 17 日推出了 GB 18030-2000 标准，以取代 GBK。GB 18030-2000 除保留全部 GBK 编码汉字，在第二字节把能使用范围再度进行扩展，增加了大约一百个汉字及四字节编码空间，但是将 GBK 作为子集全部保留。

GBK 字符有一字节和双字节编码，`0x00` – `0x7F` 范围内是第一个字节，和 ASCII 保持一致，此范围内严格上说有 96个文字和 32 个控制符号。即在 GBK 字符集中，中文占用 2 个字节，英文占用 1 个字节。

### Unicode 字符集

如上，世界上存在着多种字符集，同一个二进制数字可以被解释成不同的符号。因此，要想打开一个文本文件，就必须知道它的编码方式，否则用错误的编码方式解读，就会出现乱码。

如果有一种字符集，将世界上所有的符号都纳入其中，无论是英文、日文、还是中文等，大家都使用这个字符集对应的编码表，就不会出现编码不匹配现象。每个符号对应一个唯一的编码，乱码问题就不存在了。这就是 Unicode 字符集。  

Unicode 当然是一个很大的集合，现在的规模可以容纳 100 多万个符号，每个符号的编码都不一样。比如，`U+0639` 表示阿拉伯字母 `Ain`，`U+0041` 表示英语的大写字母 `A`，`U+4E25` 表示汉字 `严`。具体的符号对应表，可以查询 [unicode.org](https://home.unicode.org/)，或者专门的[汉字对应表](http://www.chi2ko.com/tool/CJK.htm)。  

Unicode 的编码范围为 `U+0000` 至 `U+FFFF`。它的 `U+0000 - U+007F`	为 ASCII 码，`U+0080 - U+00FF` 为 ISO 8859-1（Latin-1）。  

Unicode 使用的数字是从 `0` 到 `0x10FFFF`，这些数字都对有相对应的字符（当然，有的还没有编好，有的用作私人自定义）。每一个数字，就是一个代码点（`Code Point`）。

需要注意的是，Unicode/UCS（Unicode Character Set）标准仅仅是一个字符集标准，可是它并没有规定字符的存储和传输方式。

通过 Code Point 的描述，可以知道，在文本中，存储的只是字符的代码点。而 Unicode 标准只规定了代码点对应的字符（也就是二进制数对应的字符，至于如何存储这个二进制数，不同方案的编码方式可能不同，比如 UTF-8 将这个二进制保存为 123，而 UTF-16 将这个二进制保存为 456），而没有规定代码点怎么存储。

:::tip
Unicode 的知识点还是有点多的，作为拓展，可以参考 [Unicode 编码及 UTF-32, UTF-16 和 UTF-8](https://zhuanlan.zhihu.com/p/51202412)。
:::

## 常见的编码方式

### ASCII 编码

用于将 ASCII 字符集转为二进制，所以，ASCII 字符集的编码方式也称为 ASCII 编码。

### ISO 8859-1 编码

用于将 ISO 8859-1 字符集转为二进制，所以，ISO 8859-1 字符集的编码方式也称为 ISO 8859-1 编码。

### GB2312 编码

用于将 GB2312 字符集转为二进制，所以，GB2312 字符集的编码方式也称为 GB2312 编码。

### GBK 编码

用于将 GBK 字符集转为二进制，所以，GBK 字符集的编码方式也称为 GBK 编码。

### Unicode 编码

:::tip
Unicode 的知识点还是有点多的，作为拓展，可以参考 [Unicode 编码及 UTF-32, UTF-16 和 UTF-8](https://zhuanlan.zhihu.com/p/51202412)。
:::

不像上面的几种字符集只有一种对应的编码方式，Unicode 存在多种编码方式。

实际上，Unicode 只是一种字符集，并不是一种编码方式，至于如何对 Unicode 字符集进行编码，有 UTF-8、UTF-16 和 UTF-32 这几种对 Unicode 进行编码方式。

#### Unicode 的问题

在讲 Unicode 字符集不同的编码方式之前，我们先来看看 Unicode 存在的问题。  

比如，汉字 `严` 的 Unicode 是十六进制数 4E25，转换成二进制数足足有 15 位（100111000100101），也就是说，这个符号的表示至少需要 2 个字节。如果需要表示其它更大的符号，可能需要 3 个字节或者 4 个字节，甚至更多。

这里就有两个严重的问题，第一个问题是，如何才能区别 Unicode 和 ASCII ？计算机怎么知道三个字节表示一个符号，而不是分别表示三个符号呢？第二个问题是，我们已经知道，英文字母只用一个字节表示就够了，如果 Unicode 统一规定，每个符号用三个或四个字节表示，那么每个英文字母前都必然有二到三个字节是 0，这对于存储来说是极大的浪费，文本文件的大小会因此大出二三倍，这是无法接受的。

它们造成的结果是：
1. 出现了 Unicode 的多种存储方式，也就是说有许多种不同的二进制格式，可以用来表示 Unicode。
2. Unicode 在很长一段时间内无法推广，直到互联网的出现。


#### UTF-32

UTF-32 使用四个字节来表示存储 Code Point，把 Code Point 转换为 32 位二进制，位数不够的左边充 0。

UTF-32 中，Unicode 和二进制的关系如下：

Code Point|byte
---|---
`0x000000` - `0x10FFFFFF`|`xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx`

示例代码如下：

```java
private static void fillBits(StringBuilder sb, byte b) {
    for (int i = 0; i < 8; i++) {
        sb.append((b & 128) == 0 ? 0 : 1);
        b <<= 1;
    }
    sb.append(' ');
}

/**
 * 得到指定编码下的字符串的二进制表示形式
 */
public static String getBinary(String source, String charsetName) throws UnsupportedEncodingException {
    byte[] bytes = source.getBytes(charsetName);
    StringBuilder sb = new StringBuilder();
    for (byte b : bytes) {
        fillBits(sb, b);
    }
    return sb.toString().trim();
}

public static void main(String[] args) throws UnsupportedEncodingException {
    System.out.println(getBinary("A", "UTF-32")); // Plane 0
    System.out.println(getBinary(new String(Character.toChars(0x10000)), "UTF-32")); // Plane 1
    System.out.println(getBinary(new String(Character.toChars(0x10ffff)), "UTF-32"));; // Plane 16
}
```
输出结果如下：
```txt
00000000 00000000 00000000 01000001
00000000 00000001 00000000 00000000
00000000 00010000 11111111 11111111
```

可以发现，空间的浪费极大，在 Plane 0，利用率那是少得可怜，就算是 Plane 16，利用率也不到 3/4。而我们使用的大多数字符，都在 Plane 0。连存储都非常不划算，更不用说网络传输了。所以 UTF-32 这种实现用得极少。

#### UTF-16

UTF-16 中，Unicode 和二进制的关系如下：

Code Point|byte
---|---
`0x000000` - `0x00FFFFFF`|`xxxxxxxx xxxxxxxx`
`0x010000` - `0x10FFFFFF`|`110110yy yyyyyyyy 110111xx xxxxxxxx`

通过上表，可以发现，UTF-16 用二个字节来表示基本平面，用四个字节来表示扩展平面。

但是，上面的编码可能出现一个问题，比如一个字符编码 `xxxxxxxx xxxxxxxx xxxxxxxx xxxxxxxx`，计算机不会知道它是二个基本平面的字符，还是一个扩展平面的字符。（怎么解决呢，这不是本文讨论的重点）

Java 代码如下：
```java
private static void fillBits(StringBuilder sb, byte b) {
    for (int i = 0; i < 8; i++) {
        sb.append((b & 128) == 0 ? 0 : 1);
        b <<= 1;
    }
    sb.append(' ');
}

/**
 * 得到指定编码下的字符串的二进制表示形式
 */
public static String getBinary(String source, String charsetName) throws UnsupportedEncodingException {
    byte[] bytes = source.getBytes(charsetName);
    StringBuilder sb = new StringBuilder();
    for (byte b : bytes) {
        fillBits(sb, b);
    }
    return sb.toString().trim();
}

public static void main(String[] args) throws UnsupportedEncodingException {
    System.out.println(getBinary("A", "UTF-16")); // Plane 0
    System.out.println(getBinary(new String(Character.toChars(0x10000)), "UTF-16")); // Plane 1
    System.out.println(getBinary(new String(Character.toChars(0x10ffff)), "UTF-16"));; // Plane 16
}
```
输出结果如下：
```txt
00000000 01000001
11011000 00000000 11011100 00000000
11011011 11111111 11011111 11111111
```
可以看出，对于 `0x00` - `0xff` 字符，空间的浪费也很大。

#### UTF-8

互联网的普及，强烈要求出现一种统一的编码方式。UTF-8 就是在互联网上使用最广的一种 Unicode 编码实现方式。其他实现方式还包括 UTF-16（字符用两个字节或四个字节表示）和 UTF-32（字符用四个字节表示），不过在**互联网上**基本不用（但是有一些其它场景是很适合使用 UTF-16 和 UTF-32 编码）。**重复一遍，这里的关系是，UTF-8 是 Unicode 编码的实现方式之一。**

UTF-8 中，Unicode 和二进制的关系如下：

Code Point|byte
---|---
`0x000000` - `0x00007F`|`0xxxxxxx`
`0x000080` - `0x0007FF`|`110xxxxx 10xxxxxx`
`0x000800` - `0x00FFFF`|`1110xxxx 10xxxxxx 10xxxxxx`
`0x010000` - `0x10FFFF`|`11110xxx 10xxxxxx 10xxxxxx 10xxxxxx`

Java 代码如下：
```java
private static void fillBits(StringBuilder sb, byte b) {
    for (int i = 0; i < 8; i++) {
        sb.append((b & 128) == 0 ? 0 : 1);
        b <<= 1;
    }
    sb.append(' ');
}

/**
 * 得到指定编码下的字符串的二进制表示形式
 */
public static String getBinary(String source, String charsetName) throws UnsupportedEncodingException {
    byte[] bytes = source.getBytes(charsetName);
    StringBuilder sb = new StringBuilder();
    for (byte b : bytes) {
        fillBits(sb, b);
    }
    return sb.toString().trim();
}

public static void main(String[] args) throws UnsupportedEncodingException {
    System.out.println(getBinary(new String(Character.toChars(0x7f)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0x80)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0x7ff)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0x800)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0xffff)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0x10000)), "UTF-8"));
    System.out.println(getBinary(new String(Character.toChars(0x10ffff)), "UTF-8"));
}
```
输出结果如下：
```txt
01111111
11000010 10000000
11011111 10111111
11100000 10100000 10000000
11101111 10111111 10111111
11110000 10010000 10000000 10000000
11110100 10001111 10111111 10111111
```

可以看出，不同段的代码点会以不同的长度存储，计算机解析时，只用读取前面若干位，就知道该字符占几个字节，位于哪一段。

对于西文，该编码方式非常节约空间，因为西文的编码通常都小于 `0x0007ff`，尤其是 ASCII 字符，更是一个字符只占一个字节的程度。对于中文，常用的汉字通常位于 `0x000800` - `0x00ffff` 这一段，需要三个字节的存储，比起 UTF-16 的存储消耗要大一些。  

从上面我们也知道了，UTF-8 最大的一个特点，就是它是一种变长的编码方式。它可以使用 1~4 个字节表示一个符号，根据不同的符号而变化字节长度。

UTF-8 的编码规则很简单，只有二条：
1. 对于单字节的符号，字节的第一位设为0，后面 7 位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。
2. 对于 n 字节的符号（n > 1），第一个字节的前 n 位都设为 1，第 n + 1 位设为 0，后面每个字节的前两位一律设为 10。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码。


根据`UTF-8 中，Unicode 和二进制的关系`表可知，解读 UTF-8 编码非常简单。如果一个字节的第一位是 0，则这个字节单独就是一个字符；如果第一位是 1，则连续有多少个 1，就表示当前字符占用多少个字节。下面，还是以汉字`严`为例，演示如何实现 UTF-8 编码。

严的 Unicode 是 4E25（`0100 1110 0010 0101`），根据上表，可以发现 4E25 处在第三行的范围内（`0000 0800` - `0000 FFFF`），因此严的 UTF-8 编码需要三个字节，即格式是 `1110xxxx 10xxxxxx 10xxxxxx`。然后，从严的最后一个二进制位开始，依次从后向前填入格式中的 x，多出的位补 0。这样就得到了，严的 UTF-8 编码是 `11100100 10111000 10100101`，转换成十六进制就是 `0xE4B8A5`。可以看到严的 Unicode 码是 `4E25`，UTF-8 编码是 `E4B8A5`，两者是不一样的。它们之间的转换可以通过程序实现。

这里我们再强调一点，对于 UTF-8 这中编码方式来讲（UTF-8 兼容 ISO-8859-1，ISO-8859-1 兼容 ASCII），ASCII 字符占用一个字节，ISO-8859-1 中的 `0x80` - `0xFF` 部分是占用两个字节。

## Java 中的编码方式

:::tip 参考
The native character encoding of the Java programming language is UTF-16. A charset in the Java platform therefore defines a mapping between sequences of sixteen-bit UTF-16 code units (that is, sequences of chars) and sequences of bytes.  

来源：[Class Charset](https://docs.oracle.com/javase/7/docs/api/java/nio/charset/Charset.html#:~:text=The%20native%20character%20encoding%20of,chars)
:::

思考：Java 中的 `char` 为什么可以表示一个中文字符？
