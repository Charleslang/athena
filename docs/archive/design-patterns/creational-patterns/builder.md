# 建造者模式

建造者模式又称为生成器模式，是一种对象构建模式，它可以将复杂对象的构建过程抽象出来。该模式允许你使用相同的创建代码生成不同类型和形式的对象。

当我们使用建造者模式的时候，一般来说，是因为创建这个对象的步骤比较多，每个步骤都需要一个零部件，最终组合成一个完整的对象。假设有这样一个复杂对象，在对其进行构造时需要对诸多成员变量和嵌套对象进行繁复的初始化工作。这些初始化代码通常深藏于一个包含众多参数且让人基本看不懂的构造函数中；甚至还有更糟糕的情况，那就是这些代码散落在客户端代码的多个位置。

建造者模式的主要角色如下：

- 产品（Product）：要构造的复杂对象。
- 抽象生成器（Builder）：生成器接口，定义了创建一个产品对象所需的各个部件的操作。
- 具体生成器（Concrete Builder）：具体的生成器实现，实现了抽象生成器接口，构造和装配各个部件。
- 指挥者（Director）：指挥者负责构造一个使用生成器接口的对象。

建造者模式建议将对象构造代码从产品类中抽取出来，并将其放在一个名为生成器的独立对象中。

虽然建造者模式看起来很复杂，但是它的实现并不难，我们一般情况下都会简化建造者模式。下面我们通过一个简单的例子来演示建造者模式的使用。

```java
public class Message {

    private String from;
    private String to;
    private String subject;
    private String content;
    private LocalDateTime sendTime;

    private Message(Builder builder) {
        this.from = builder.from;
        this.to = builder.to;
        this.subject = builder.subject;
        this.content = builder.content;
        this.sendTime = LocalDateTime.now();
    }

    public static final class Builder {
        private String from;
        private String to;
        private String subject;
        private String content;

        public Builder from(String from) {
            this.from = from;
            return this;
        }

        public Builder to(String to) {
            this.to = to;
            return this;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Message build() {
            return new Message(this);
        }
    }

    public static void main(String[] args) {
        Message message = new Message.Builder()
                .from("daijunfeng")
                .to("zhangsan")
                .subject("您好")
                .content("今天天气真好！")
                .build();
    }
}
```

使用建造者模式可避免 “重叠构造函数 （telescoping constructor）” 的出现。重叠构造函数是指一个类拥有多个构造函数，参数个数和类型不同。这种客户端代码难以维护。应用建造者模式后，你再也不需要将几十个参数塞进构造函数里了；相反，你只需要调用几个简单的方法即可。
