# 简介

请见 [Java](https://zh.wikipedia.org/wiki/Java) 简介。Oracle 公司在 2017 年，将 Java EE 共享给了 Eclipse 基金会，该基金会在 2018 年将 Java EE 改名为 Jakarta EE。由于新的语言（如 Python）带来的压力，2018 年开始，Java 每 6 个月更新一次。更多信息请见 [Jakarta EE](https://zh.wikipedia.org/wiki/Jakarta_EE)。  

Java 是一种跨平台语言，是因为 JVM 跨平台。Java 运行需要 JVM（虚拟机 Java Virtual Machine）。JRE（Java Runtime Environment）包括 JVM 和一些核心类库。JDK（Java Development Kit）（SDK）包括 JRE 和一些运行环境。JRE 只能运行 Java 程序，而 JDK 可以开发 Java 程序。





<!-- # 后台响应封装
将后台返回给前台的数据经过封装后统一返回。  
- `Result.java`
```java
package com.dysy.mallbackend.util;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
// 此方法已过时
// import com.fasterxml.jackson.databind.annotation.JsonSerialize;
// @JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)

import static com.dysy.mallbackend.util.Constant.ERROR_CODE;
import static com.dysy.mallbackend.util.Constant.SUCCESS_CODE;

/**
 * @author: Dai Junfeng
 * @create: 2020-07-21
 **/

// 解析 json 时，忽略空字段。
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> {
    private int code;
    private String msg;
    private T data;

    private Result() {}

    private Result(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    private Result(int code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    /**
     * 判断接口调用是否成功
     * 注意, boolean 类型的方法在解析为 json 时，会被当成一个字段（在此的字段就是 success）
     * @return
     */
    @JsonIgnore
    public boolean isSuccess() {
        return this.code == SUCCESS_CODE;
    }

    public static Result error(Integer code, String msg) {
        return new Result(code, msg);
    }

    public static Result error(String msg) {
        return new Result(ERROR_CODE, msg);
    }

    public static Result success() {
        return new Result(SUCCESS_CODE, "success");
    }

    public static <T> Result success(T data) {
        return new Result(SUCCESS_CODE, "success", data);
    }

    // get/set 方法...
}
```
- `Constant.java`
```java
package com.dysy.mallbackend.util;

/**
 * @author: Dai Junfeng
 * @create: 2020-07-21
 **/
public class Constant {

    /**
     * 错误状态码
     */
    public final static Integer ERROR_CODE = 500;

    /**
     * 正确状态码
     */
    public final static Integer SUCCESS_CODE = 200;
}
```
其实，在不同的业务中，我们的接口可能会有不同，比如，可以将错误码封装为枚举类型等。一切根据实际业务为准。

# DTO 验证
- `UserDTO.java`
```java
package com.dysy.mallbackend.dto;

import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.*;
import java.util.Date;

/**
 * @author: Dai Junfeng
 * @create: 2020-07-21
 **/
public class UserDTO {

    @NotNull(message = "id不能为空")
    private Integer id;

    @NotBlank(message = "用户名不能为空")
    private String userName;

    @NotBlank(message = "密码不能为空")
    private String password;

    @NotBlank(message = "邮箱不能为空")
//    @Email(message = "邮箱格式错误")
    @Pattern(regexp = "^\\w+([-\\.]\\w+)*@[A-z\\d]+(\\.[A-z\\d]{2,6}){1,2}$", message = "邮箱格式错误")
    private String email;

    @NotBlank(message = "手机号不能为空")
//    @Min(value = 11, message = "手机号只能为{value}位")
//    @Max(value = 11, message = "手机号只能为{value}位")
    @Length(min = 11, max = 11, message = "手机号长度应在{min}-{max}之间")
    @Pattern(regexp = "^1([358]\\d|4[01456789]|6[2567]|7[012345678]|9[012356789])\\d{8}$", message = "手机号格式错误")
    private String telphone;

    @NotNull(message = "出生年月不能为空")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    // get/set 省略...
}
```
- `UserController.java`
```java
package com.dysy.mallbackend.controller;

import com.dysy.mallbackend.dto.UserDTO;
import com.dysy.mallbackend.entity.User;
import com.dysy.mallbackend.util.Result;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author: Dai Junfeng
 * @create: 2020-07-21
 **/
@RestController
@RequestMapping("/protal")
public class UserCtroller {

    @PostMapping("/test1")
    public Result test1(@Validated UserDTO userDTO) {
        return Result.success(userDTO);
    }
}
```

# SpringBoot 全局异常处理
```java
package com.dysy.mallbackend.common;

import com.dysy.mallbackend.util.Result;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @author: Dai Junfeng
 * @create: 2020-07-21
 **/
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({Exception.class})
    public Result handlerException(Exception e) {
        System.out.println(e.getMessage());
        return Result.error(500, "服务器出错啦");
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
    public Result handlerException(HttpRequestMethodNotSupportedException e) {
        return Result.error(405, "不被支持的请求方式");
    }

    @ExceptionHandler({RuntimeException.class})
    public Result handlerException(RuntimeException e) {
        return Result.error(500, e.getMessage());
    }

    @ExceptionHandler({BindException.class})
    public Result handlerException(BindException e) {
        return Result.error(500, e.getBindingResult().getFieldError().getDefaultMessage());
    }
}
``` -->
