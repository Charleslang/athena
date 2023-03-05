# 枚举
枚举是 JDK5.0 中新增的，使用 `enum` 来定义一个枚举类。枚举通常用在可以穷举的、确定的类型中，当定义常量时，推荐使用枚举类。 如果枚举只有一个对象，则可以作为单例的实现方式。  

使用 `enum` 定义的枚举类默认继承于 `java.lang.Enum`。枚举类中的常量其实就是一个个对象（使用构造方法创建的）。

```java
public enum OneEnum {
    // 使用构造方法
    SUCCESS(200, "成功"),
    TIMEOUT(408, "超时")
    ;

    private int status;
    private String message;

    // 这个相当于构造方法
    OneEnum(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```
**常用方法**  

- `toString()`   

  其父类（`java.lang.Enum`）已对该方法重写，返回当前枚举类常量的名称。

- `values()`  

  返回该类中所有的常量。

- `valueOf()`  

  查找是否存在某个对象，若找到，则返回该对象；否则，报错。

枚举类和普通类一样，也可以实现接口。但是，可以有特别的用法：

```java
interface Show {
    void show();
}

public enum OneEnum implements Show{
    // 每一个单独重写 show()
    SUCCESS(200, "成功"){
        @Override
        public void show() {
            
        }
    },
    TIMEOUT(408, "超时"){
        @Override
        public void show() {
            
        }
    }
    ;
    
    // ...
}
```
