# 注解 Annotation

注解是 JDK5.0 中新增的，可以作用在类、属性、方法、参数上。

## 内置注解

JDK 内置的三个注解

- `@Override`
- `@Deprecated`
- `SuppressWarning`  
  
  用于消除编译器的警告

以上三个都是在编译时生效。

## 自定义注解

- 使用 `@interface` 来定义注解
- 注解中的变量要写成方法的形式
- 变量可以使用 `default` 来指定默认值
- 当注解中只有一个变量时，推荐命名为 `value`
- 如果注解中没有变量，表明它只是一个标识

```java
public @interface MyAnnotation {
    String[] name();
    String type() default "";
}
```
**JDK 中的 4 个元注解（修饰注解的注解称为元注解）**

- `@Retention`  
  
  - `RetentionPolicy.SOURCE`: 注解将被编译器丢弃（该类型的注解信息只会保留在源码里，源码经过编译后，注解信息会被丢弃，不会保留在编译好的 .class 文件里）
  - `RetentionPolicy.CLASS`: 注解在 .class 文件中可用，但会被 VM 丢弃（该类型的注解信息会保留在源码里和 .class 文件里，在执行的时候，不会加载到虚拟机（JVM）中）（默认）
  - `RetentionPolicy.RUNTIME`: VM 将在运行期也保留注解信息，因此可以通过反射机制读取注解的信息（即源码、.class 文件和执行的时候都有注解的信息）。如果没有特殊情况，建议将 `@Retention` 设置为 `RetentionPolicy.RUNTIME`。

- `@Target`  

  指定注解的修饰范围。
  
  - `ElementType.TYPE`: 作用于类、接口、注解和枚举
  - `ElementType.FIELD`: 作用于类的成员变量、枚举中的常量
  - `ElementType.METHOD`: 作用于方法
  - `ElementType.PARAMETER`: 作用于方法的参数
  - `ElementType.CONSTRUCTOR`: 作用于构造器
  - `ElementType.LOCAL_VARIABLE`: 作用于局部变量（不常用）
  - `ElementType.ANNOTATION_TYPE`: 作用于注解
  - `ElementType.PACKAGE`: 作用于包（不常用）
  - `ElementType.TYPE_PARAMETER`: 作用于类上的范型（JDK 1.8 新增）（不常用）
  - `ElementType.TYPE_USE`: 作用于除了 package 外的任何类型（JDK 1.8 新增）（不常用）

  如果一个注解没有使用 `@Target` 进行修饰，那么该注解可以使用在除了 `RetentionPolicy.TYPE_PARAMETER` 类型外的所有类型上。

- `@Documented`  

  是否在 JavaDoc 文档中出现。若指定该注解，则 `@Retention` 必须为 `RetentionPolicy.RUNTIME`。
  
- `@Inherited`  

  是否可以被继承

**JDK8 注解的新特性**

- 可重复注解 `@Repeatable`

  使得一个注解可以在同一个地方出现多次。


**示例 1**

- `AppValidated`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE_PARAMETER)
public @interface AppValidated {
    String value() default "";
    String message() default "";
}
```

- `AnnotationTest.java`

```java
/**
 * 由于 AppValidated 注解使用了 TYPE_PARAMETER 作为目标，所以可以在类的范型上使用 @AppValidated
 * @AppValidated 只能作用于类的范型上，不能作用于方法的范型上
 */
public class AnnotationTest<@AppValidated T> {
  
}
```

**示例 2**

- `AppValidated`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE_USE)
public @interface AppValidated {
    String value() default "";
    String message() default "";
}
```

- `AnnotationTest.java`

```java
public class AnnotationTest<@AppValidated T> {

    private @AppValidated int count;

    public <T> @AppValidated T test1(@AppValidated Map<@AppValidated T, Integer> params) {
        @AppValidated int temp = 0;
        java.lang.@AppValidated Integer count = 0;
        // 编译报错
        // @AppValidated java.lang.Integer count = 0;
        return null;
    }
}
```

## 可重复注解

- `AppValidated.java`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
    ElementType.PARAMETER,
    ElementType.METHOD,
    ElementType.TYPE
})
// 必须要额外定义一个注解, AppValidateds 的名字任取
@Repeatable(AppValidateds.class)
public @interface AppValidated {
    String value() default "";
    String message() default "";
}
```

- `AppValidateds.java`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
    ElementType.PARAMETER,
    ElementType.METHOD,
    ElementType.TYPE
})
public @interface AppValidateds {
    AppValidated[] value();
}
```

- `AnnotationTest.java`

```java
@AppValidated
@AppValidated
public class AnnotationTest {

}

// 使用下面这种方式也可以
@AppValidateds({
    @AppValidated,
    @AppValidated
})
public class AnnotationTest {

}
```

## 注解相关方法

- `AppApi.java`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
        ElementType.TYPE,
        ElementType.FIELD,
        ElementType.METHOD,
        ElementType.PARAMETER
})
@Inherited
public @interface AppApi {
    String module() default "";
    String operation() default "";
    String[] params() default {};
    String field() default "";
}
```

- `AppValidated.java`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
        ElementType.PARAMETER,
        ElementType.METHOD,
        ElementType.TYPE
})
@Repeatable(AppValidateds.class)
public @interface AppValidated {
    String value() default "";
    String message() default "";
}
```

- `AppValidateds.java`

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({
        ElementType.PARAMETER,
        ElementType.METHOD,
        ElementType.TYPE
})
public @interface AppValidateds {
    AppValidated[] value();
}
```

- `AnnotationTest.java`

```java
@AppValidateds({
        @AppValidated,
        @AppValidated
})
@AppApi(module = "用户管理")
public class AnnotationTest {

    @AppApi(field = "用户ID")
    private int userId;

    @AppApi(field = "用户名称")
    private String userName;

    @AppApi(operation = "修改用户", params = {"用户ID", "用户名称"})
    private void update(@AppApi(field = "用户ID") int userId, @AppApi(field = "用户名称") String userName) {
        System.out.println("update");
    }

    public static void main(String[] args) {
      
    }
}
```

- `SonTest.java`

```java
@AppValidateds({
        @AppValidated,
        @AppValidated
})
public class SonTest extends AnnotationTest {

    @AppApi(field = "用户ID")
    private int userId;

    @AppApi(field = "用户名称")
    private String userName;

    @AppApi(operation = "修改用户", params = {"用户ID", "用户名称"})
    private void update(@AppApi(field = "用户ID") int userId, @AppApi(field = "用户名称") String userName) {
        System.out.println("update");
    }

    private void test() { }

    private static void getAnnotationInfo() {
      
        Class<SonTest> clazz = SonTest.class;

        // 由于其父类 AnnotationTest 上的 @AppApi 注解被 @Inherited 修饰，所以子类 SonTest 也会继承该注解
        boolean annotationPresent = clazz.isAnnotationPresent(AppApi.class);
        System.out.println("该类是否被 @AppApi 修饰: " + annotationPresent);

        // 获取当前类以及其父类上定义的 @AppApi 注解（如果父类的 @AppApi 被 @Inherited 修饰了的话）
        AppApi annotation = clazz.getAnnotation(AppApi.class);
        System.out.println(annotation);

        // 获取注解的属性
        String module = annotation.module();
        System.out.println("module: " + module);

        // 仅获取当前类上定义的 @AppApi 注解
        AppApi declaredAnnotation = clazz.getDeclaredAnnotation(AppApi.class);
        System.out.println(declaredAnnotation);

        // 获取当前类和父类（如果父类的注解被 @Inherited 修饰了的话）上的所有注解
        Annotation[] annotations = clazz.getAnnotations();
        System.out.println(Arrays.toString(annotations));

        // 仅获取当前类上的所有注解
        Annotation[] declaredAnnotations = clazz.getDeclaredAnnotations();
        System.out.println(Arrays.toString(declaredAnnotations));

        // 获取当前类和父类（如果父类的注解被 @Inherited 修饰了的话）上的所有 @AppApi 注解
        AppApi[] annotationsByType = clazz.getAnnotationsByType(AppApi.class);
        System.out.println(Arrays.toString(annotationsByType));

        // 仅获取当前类上的所有 @AppApi 注解
        AppApi[] declaredAnnotationsByType = clazz.getDeclaredAnnotationsByType(AppApi.class);
        System.out.println(Arrays.toString(declaredAnnotationsByType));

        // 仅获取当前类字段上的注解
        Field[] declaredFields = clazz.getDeclaredFields();
        for (int i = 0; i < declaredFields.length; i++) {
            Field declaredField = declaredFields[i];
            AppApi appApi = declaredField.getDeclaredAnnotation(AppApi.class);
            if (appApi == null) {
                continue;
            }
            System.out.println("field: " + appApi.field());
        }

        // 仅获取当前类中方法以及方法参数上的注解
        Method[] declaredMethods = clazz.getDeclaredMethods();
        for (Method declaredMethod : declaredMethods) {
            AppApi appApi = declaredMethod.getAnnotation(AppApi.class);
            if (appApi != null) {
                System.out.println("params: " + Arrays.toString(appApi.params()));
            }
            // 获取方法所有参数的注解
            Annotation[][] parameterAnnotations = declaredMethod.getParameterAnnotations();
            for (Annotation[] parameterAnnotation : parameterAnnotations) {
                for (Annotation annotation1 : parameterAnnotation) {
                    if (annotation1 instanceof AppApi) {
                        AppApi appApi1 = (AppApi) annotation1;
                        System.out.println("field: " + appApi1.field());
                    }
                }
            }

            // 获取方法所有参数的注解
            Parameter[] parameters = declaredMethod.getParameters();
            for (Parameter parameter : parameters) {
                AppApi appApi1 = parameter.getAnnotation(AppApi.class);
                if (appApi1 != null) {
                    System.out.println("field: " + appApi1.field());
                }
            }
        }

        // 获取可重复注解
        // 如果我在类上面写的是两个 @AppValidated 注解，那么这里就只能使用 clazz.getAnnotationsByType(AppValidateds.class), 如果使用 clazz.getAnnotation(AppValidated.class); 就会返回 null
        // 如果我在类上面仅写了一个 @AppValidated 注解，那么这里就只能使用 clazz.getAnnotation(AppValidated.class);
        // 如果类上面使用的是 @AppValidateds 注解，那么这里就只能使用 clazz.getAnnotationsByType(AppValidateds.class);
        AppValidateds appValidateds = clazz.getAnnotation(AppValidateds.class);
        System.out.println(appValidateds);
    }

    public static void main(String[] args) {
        getAnnotationInfo();
    }
}
```
