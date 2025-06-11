# 快速开始

- `pom.xml`

```xml
<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.6.3</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.13.0</version>
            <configuration>
                <source>8</source>
                <target>8</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>1.6.3</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

- `Car.java`

```java
public class Car {

    private String make;
    private int numberOfSeats;

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    @Override
    public String toString() {
        return "Car{" +
                "make='" + make + '\'' +
                ", numberOfSeats=" + numberOfSeats +
                '}';
    }
}
```

- `CarDTO.java`

```java
public class CarDTO {

    private String make;
    private int seatCount;
    private String type;

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(int seatCount) {
        this.seatCount = seatCount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "CarDTO{" +
                "make='" + make + '\'' +
                ", seatCount=" + seatCount +
                ", type='" + type + '\'' +
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

    @Mapping(source = "numberOfSeats", target = "seatCount")
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

        CarDTO carDTO = CarMapper.INSTANCE.carToCarDTO(car);

        System.out.println(carDTO);
    }
}
```

通过上面的方式，我们就能快速地使用 MapStruct 进行 Java bean 的映射。MapStruct 会在编译时生成 `CarMapperImpl` 类，包含了从 `Car` 到 `CarDTO` 的映射逻辑。运行 `Main.java` 后，你将看到输出的 `CarDTO` 对象，验证了映射的正确性。

我们来看看生成的 `CarMapperImpl` 类的部分内容：

```java
public class CarMapperImpl implements CarMapper {
    public CarMapperImpl() {
    }

    public CarDTO carToCarDTO(Car car) {
        if (car == null) {
            return null;
        } else {
            CarDTO carDTO = new CarDTO();
            carDTO.setSeatCount(car.getNumberOfSeats());
            carDTO.setMake(car.getMake());
            return carDTO;
        }
    }
}
```

这样，MapStruct 通过简单的注解和配置，就能自动生成高效的 bean 映射代码，极大地减少了手动编写映射逻辑的工作量，同时保持了代码的清晰和可维护性。
