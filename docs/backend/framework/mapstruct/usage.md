# 用法

:::warning 注意
由于 MapStruct 是在编译期间生成代码的，因此，如果我们给某个实体类新加了字段，或者修改了字段的类型或名称，需要执行 `mvn clean compile` 命令来重新生成映射代码。
:::

## 默认映射规则

如果源对象和目标对象的字段名且字段类型都相同，MapStruct 会自动进行映射。我们只需要定义一个映射接口，并使用 `@Mapper` 注解标记它。

- `Car.java`

```java
public class Car {

    private String make;

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    @Override
    public String toString() {
        return "Car{" +
                "make='" + make + '\'' +
                '}';
    }
}
```

- `CarDTO.java`

```java
public class CarDTO {

    private String make;

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    @Override
    public String toString() {
        return "CarDTO{" +
                "make='" + make + '\'' +
                '}';
    }
}
```

- `CarMapper.java`

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);
    
    // 此时可以不用添加 @Mapping 注解，因为字段名相同，MapStruct 会自动进行映射
    CarDTO carToCarDTO(Car car);
}
```

- `Main.java`

```java
public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        car.setMake("Toyota");

        CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(car);
        
        System.out.println(carDTO);
    }
}
```

如果字段名称相同，但是字段类型不同，那么 MapStruct 会尝试自动进行[隐式类型转换](https://mapstruct.org/documentation/stable/reference/html/#implicit-type-conversions)。但是有时候可能会失败，转换结果也可能不符合预期。在这种情况下，我们需要使用 `@Mapping` 注解来明确指定源字段和目标字段的映射关系。

## @Mapping 注解

如果源对象和目标对象的字段名不同，或者字段类型不同，或者需要进行一些特殊的转换，我们可以使用 `@Mapping` 注解来指定映射关系。

- `Car.java`

```java
public class Car {

    private String make;
    private int numberOfSeats;
    private LocalDateTime publishTime;
    private Date publishDate;
    private double price;

    // Getters and Setters

    @Override
    public String toString() {
        return "Car{" +
                "make='" + make + '\'' +
                ", numberOfSeats=" + numberOfSeats +
                ", publishTime=" + publishTime +
                ", publishDate=" + publishDate +
                ", price=" + price +
                '}';
    }
}
```

- `CarDTO.java`

```java
public class CarDTO {

    private String make;
    private int seatCount;
    private String publishTime;
    private String publishDate;
    private String price;

    // Getters and Setters

    @Override
    public String toString() {
        return "CarDTO{" +
                "make='" + make + '\'' +
                ", seatCount=" + seatCount +
                ", publishTime='" + publishTime + '\'' +
                ", publishDate='" + publishDate + '\'' +
                ", price='" + price + '\'' +
                '}';
    }
}
```

- `CarMapper.java`

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mapping(source = "numberOfSeats", target = "seatCount")
    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    // 保留两位小数并添加美元符号
    @Mapping(source = "price", target = "price", numberFormat = "$#.00")
    CarDTO carToCarDTO(Car car);
}
```

- `Main.java`

```java
public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        car.setMake("Toyota");
        car.setNumberOfSeats(5);
        car.setPublishTime(LocalDateTime.now());
        car.setPublishDate(new Date());
        car.setPrice(29999.988);

        CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(car);
        
        System.out.println(carDTO);
    }
}
```

除此之外，`@Mapping` 注解的 `expression` 属性可用于执行自定义的 Java 表达式或方法调用，以实现更复杂的属性映射逻辑。当简单的字段名匹配或类型转换无法满足需求时，可以通过 `expression` 直接编写代码片段动态计算目标属性的值。

```java
@Mapper
public interface PeopleMapper {

    PeopleMapper INSTANCE = Mappers.getMapper(PeopleMapper.class);

    // @Mapping(target = "name", expression = "java(people.getFirstName() + \" \" + people.getLastName())")
    @Mapping(target = "name", expression = "java(com.daijunfeng.StringUtils.concat(people.getFirstName(), \" \", people.getLastName()))")
    PeopleDTO peopleToDto(People people);
}
```

## @Mappings 注解

当然，我们也可以使用 `@Mappings` 注解来批量定义多个映射关系，效果与逐个使用 `@Mapping` 注解相同。

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mappings(
            {
                @Mapping(source = "numberOfSeats", target = "seatCount"),
                @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                // 保留两位小数并添加美元符号
                @Mapping(source = "price", target = "price", numberFormat = "$#.00")
            }
    )
    CarDTO carToCarDTO(Car car);
}
```

## 忽略字段

如果我们不想映射某个字段，可以使用 `@Mapping` 注解的 `ignore` 属性来忽略该字段。

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mapping(source = "make", target = "make", ignore = true)
    // 等价写法如下
    // @Mapping(target = "make", ignore = true)
    CarDTO carToCarDTO(Car car);
}
```

## 级联映射

如果源对象和目标对象的某个字段是另一个对象的引用，在默认情况下，MapStruct 并不会帮我们进行自动转换。我们需要采用约定的方式告诉 MapStruct，如下：

- `Car.java`

```java
public class Car {

    private String make;
    private int numberOfSeats;
    private LocalDateTime publishTime;
    private Date publishDate;
    private double price;
    private Driver driver;

    // Getters and Setters

    @Override
    public String toString() {
        return "Car{" +
                "make='" + make + '\'' +
                ", numberOfSeats=" + numberOfSeats +
                ", publishTime=" + publishTime +
                ", publishDate=" + publishDate +
                ", price=" + price +
                ", driver=" + driver +
                '}';
    }
}
```

- `CarDTO.java`

```java
public class CarDTO {

    private String make;
    private int seatCount;
    private String publishTime;
    private String publishDate;
    private String price;
    private DriverDTO driver;

    // Getters and Setters

    @Override
    public String toString() {
        return "CarDTO{" +
                "make='" + make + '\'' +
                ", seatCount=" + seatCount +
                ", publishTime='" + publishTime + '\'' +
                ", publishDate='" + publishDate + '\'' +
                ", price='" + price + '\'' +
                ", driver=" + driver +
                '}';
    }
}
```

- `CarMapper.java`

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mappings(
            {
                    @Mapping(source = "make", target = "make", ignore = true),
                    @Mapping(source = "numberOfSeats", target = "seatCount"),
                    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "price", target = "price", numberFormat = "￥#.00")
            }
    )
    CarDTO carToCarDTO(Car car);

    DriverDTO driverToDriverDTO(Driver driver);
}
```

- `Main.java`

```java
public class Main {

    public static void main(String[] args) {
        Car car = new Car();
        car.setMake("Toyota");
        car.setNumberOfSeats(5);
        car.setPublishTime(LocalDateTime.now());
        car.setPublishDate(new Date());
        car.setPrice(29999.988);

        Driver driver = new Driver();
        driver.setDriverName("daijunfeng");
        driver.setAge(18);
        car.setDriver(driver);

        CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(car);
        System.out.println(carDTO);
    }
}
```

它的原理是，当 MapStruct 发现需要把 Driver 转为 DriverDTO 时，那么 MapStruct 会自动在 `CarMapper` 这个接口中寻找一个入参类型是 `Driver`，返回值类型是 `DriverDTO` 的方法。当然，如果字段名称不一致，我们也可以使用 `@Mapping` 指定映射规则，如下：

- `CarMapper.java`

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    // 比如，Car 里面的变量叫做 driver，而 CarDTO 里面的叫做 driverDTO
    @Mapping(source = "driver", target = "driverDTO")
    CarDTO carToCarDTO(Car car);

    DriverDTO driverToDriverDTO(Driver driver);
}
```

当然，如果 Driver 和 DriverDTO 中的字段不一致，我们也可以使用 `@Mapping` 指定映射规则，如下：

- `CarMapper.java`

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    // 比如，Car 里面的变量叫做 driver，而 CarDTO 里面的叫做 driverDTO
    @Mapping(source = "driver", target = "driverDTO")
    CarDTO carToCarDTO(Car car);

    // 比如，Driver 里面的变量叫做 driverName，而 DriverDTO 里面的叫做 name
    @Mapping(source = "driverName", target = "name")
    DriverDTO driverToDriverDTO(Driver driver);
}
```

## @AfterMapping 注解

有时候，我们在进行字段注入的时候，可能需要有一些额外的逻辑。比如，当某个值满足条件的时候，才进行字段映射。这时候，我们可以使用 `@AfterMapping` 和 `@MappingTarget` 注解来实现这个功能。

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mappings(
            {
                    @Mapping(source = "make", target = "make", ignore = true),
                    @Mapping(source = "numberOfSeats", target = "seatCount"),
                    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "price", target = "price", numberFormat = "￥#.00"),
                    @Mapping(source = "driver", target = "driverDTO")
            }
    )
    CarDTO carToCarDTO(Car car);

    @Mapping(source = "driverName", target = "name")
    DriverDTO driverToDriverDTO(Driver driver);

    @AfterMapping
    default void myAfterMapping(Car car, @MappingTarget CarDTO carDTO) {
        // @MappingTarget 注解用于指定目标对象，该对象是 MapStruct 自动生成的映射结果
        // 简单来讲，@MappingTarget 注解用于指示 MapStruct 在映射完成后对目标对象进行进一步的修改或处理
        carDTO.setMake(car.getMake().toUpperCase());
    }
}
```

## 批量转换

有时候，我们需要把一个 List 中的对象都进行转换，转换后得到另一个 List。例如，把 `List<Car>` 转为 `List<CarDTO>`。一种常见的做法如下：

```java
List<CarDTO> carDTOS = new ArrayList<>();
for (Car c : cars) {
    CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(c);
    carDTOS.add(carDTO);
}
```

其实，MapStruct 提供了这样的功能，如下：

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mappings(
            {
                    @Mapping(source = "make", target = "make", ignore = true),
                    @Mapping(source = "numberOfSeats", target = "seatCount"),
                    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "price", target = "price", numberFormat = "￥#.00"),
                    @Mapping(source = "driver", target = "driverDTO")
            }
    )
    CarDTO carToCarDTO(Car car);

    @Mapping(source = "driverName", target = "name")
    DriverDTO driverToDriverDTO(Driver driver);

    @AfterMapping
    default void myAfterMapping(Car car, @MappingTarget CarDTO carDTO) {
        // @MappingTarget 注解用于指定目标对象，该对象是 MapStruct 自动生成的映射结果
        // 简单来讲，@MappingTarget 注解用于指示 MapStruct 在映射完成后对目标对象进行进一步的修改或处理
        carDTO.setMake(car.getMake().toUpperCase());
    }

    /**
     * 批量转换
     */
    List<CarDTO> cars2CarDTOs(List<Car> cars);
}
```

```java
List<CarDTO> carDTOS1 = CarMapper.INSTANCE.cars2CarDTOs(cars);
System.out.println(carDTOS1);
```

## @BeanMapping 注解

有时候，我们可能仅有少量的字段需要映射，但是这时候，类中的字段又比较多。在 [忽略字段](#忽略字段) 中，我们介绍了一种方式用于忽略映射，但是，要忽略的字段较多时，实现起来就需要写大量的 `@Mapping` 注解了，比较麻烦。这时候，我们可以使用 `@BeanMapping` 注解，该注解可以忽略 MapStruct 的默认映射行为。

```java
@Mapper
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @BeanMapping(ignoreByDefault = true)
    // 此时，只有配置了 @Mapping 注解的属性才会被映射
    @Mapping(source = "numberOfSeats", target = "seatCount")
    CarDTO carToCarDTO(Car car);
}
```

## 接口和抽象类

在上面的示例中，我们都是定义了一个 Mapper 接口来进行转换。其实，我们也能够定义抽象类来进行转换，如下：

```java
@Mapper
public abstract class CarMapper {

    public static final CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mappings(
            {
                    @Mapping(source = "make", target = "make", ignore = true),
                    @Mapping(source = "numberOfSeats", target = "seatCount"),
                    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
                    @Mapping(source = "price", target = "price", numberFormat = "￥#.00"),
                    @Mapping(source = "driver", target = "driverDTO")
            }
    )
    public abstract CarDTO carToCarDTO(Car car);

    @Mapping(source = "driverName", target = "name")
    public abstract DriverDTO driverToDriverDTO(Driver driver);

    @AfterMapping
    public void myAfterMapping(Car car, @MappingTarget CarDTO carDTO) {
        // @MappingTarget 注解用于指定目标对象，该对象是 MapStruct 自动生成的映射结果
        // 简单来讲，@MappingTarget 注解用于指示 MapStruct 在映射完成后对目标对象进行进一步的修改或处理
        carDTO.setMake(car.getMake().toUpperCase());
    }
}
```

## 整合 Spring

在 Spring 环境中，我们通常使用自动注入的方式注入某个 bean。MapStruct 也提供了相应的功能，把 Mapper 对象注入到 IOC 容器中。如下：

```java
@Mapper(componentModel = "spring") // 使用 Spring 组件模型
public interface CarMapper {

    CarMapper INSTANCE = Mappers.getMapper(CarMapper.class);

    @Mapping(source = "numberOfSeats", target = "seatCount"),
    @Mapping(source = "publishTime", target = "publishTime", dateFormat = "yyyy-MM-dd HH:mm:ss"),
    @Mapping(source = "publishDate", target = "publishDate", dateFormat = "yyyy-MM-dd HH:mm:ss"),
    @Mapping(source = "price", target = "price", numberFormat = "￥#.00")
    CarDTO carToCarDTO(Car car);
}
```

其实，本质上就是 MapStruct 在自动生成的实现类上面加了 `@Component` 注解。
