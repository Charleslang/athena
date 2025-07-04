# 输出命令

## echo

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`echo`|输出内容|`echo [-options] [输出内容]`|所有用户|

**【选项】**

- `-e` 支持 `\` 控制转义字符

**【示例】**

普通输出（如果输出的内容包含空格，则需要加双引号或单引号）：

```bash
echo "hello world"
```

普通输出（如果输出的内容包含感叹号，则只能加单引号）：

```bash
[root@daijf ~]# echo "hello!"
-bash: !": event not found

[root@daijf ~]# echo 'hello!'
hello!
```

换行输出：

```bash
[root@daijf ~]# echo "hello\nworld"
hello\nworld

[root@daijf ~]# echo -e "hello\nworld"
hello
world

# 16 进制的 61 对应的 ASCII 码是 a
[root@daijf ~]# echo -e '\x61'
a
```

输出内容带颜色，格式 `echo -e "\033[字背景颜色；文字颜色m字符串\033[0m"`：

1. 字背景颜色和文字颜色之间是英文的 ";" 
2. 文字颜色后面有个 `m` 
3. 字符串前后可以没有空格，如果有的话，输出也是同样有空格 

字体颜色：

```bash
echo -e “\033[30m 黑色字 \033[0m” 
echo -e “\033[31m 红色字 \033[0m” 
echo -e “\033[32m 绿色字 \033[0m” 
echo -e “\033[33m 黄色字 \033[0m” 
echo -e “\033[34m 蓝色字 \033[0m” 
echo -e “\033[35m 紫色字 \033[0m” 
echo -e “\033[36m 天蓝字 \033[0m” 
echo -e “\033[37m 白色字 \033[0m” 
```

背景色：

```bash
echo -e “\033[40;37m 黑底白字 \033[0m” 
echo -e “\033[41;37m 红底白字 \033[0m” 
echo -e “\033[42;37m 绿底白字 \033[0m” 
echo -e “\033[43;37m 黄底白字 \033[0m” 
echo -e “\033[44;37m 蓝底白字 \033[0m” 
echo -e “\033[45;37m 紫底白字 \033[0m” 
echo -e “\033[46;37m 天蓝底白字 \033[0m” 
echo -e “\033[47;30m 白底黑字 \033[0m” 
```

更多颜色选项如下：

- `\033[0m` 关闭所有属性 
- `\033[1m` 设置高亮度 
- `\033[4m` 下划线 
- `\033[5m` 闪烁 
- `\033[7m` 反显 
- `\033[8m` 消隐 
- `\033[30m — \033[37m` 设置前景色 
- `\033[40m — \033[47m` 设置背景色 
- `\033[nA` 光标上移n行 
- `\033[nB` 光标下移n行 
- `\033[nC` 光标右移n行 
- `\033[nD` 光标左移n行 
- `\033[y;xH` 设置光标位置 
- `\033[2J` 清屏 
- `\033[K` 清除从光标到行尾的内容 
- `\033[s` 保存光标位置 
- `\033[u` 恢复光标位置 
- `\033[?25l` 隐藏光标 
- `\033[?25h` 显示光标

:::tip
`\033` 是八进制的 33，等价于十六进制的 16，即 `\x1B`。`echo -e "\x1B[41;36m something here \x1B[0m"`。当然，`\e` 也可以达到同样的效果。`echo -e "\e[41;36m something here \e[0m"`。
:::

## printf

|命令名称|功能描述|语法|执行权限|
|---|---|---|---|
|`printf`|输出内容|`printf ['输出类型输出格式'] [输出内容]`|所有用户|

**【输出类型】**

- `%ns` 输出字符串。n 是数字，指代输出几个字符
- `%ni` 输出整数。n 是数字，指代输出几个数字
- `%m.nf` 输出浮点数。m 和 n 是数字，指代输出的总位数和小数位数。如 `%8.2f` 代表共输出 8 位数，其中 2 位是小数，6 位是整数。

**【输出格式】**

- `\a` 输出警告声音
- `\b` 输出退格键，也就是 Backspace 键
- `\f` 清除屏幕
- `\n` 换行
- `\r` 回车，也就是 Enter 键
- `\t` 水平输出退格键，也就是 Tab 键
- `\v` 垂直输出退格键，也就是 Tab 键

**【示例】**

```bash
[root@daijf djftest]# printf '%s %s %s\n' 1 2 3 4 5 6
1 2 3
4 5 6
```

```bash
[root@daijf djftest]# printf '%s %s\n' 1 2 3 4 5 6
1 2
3 4
5 6
```

```bash
[root@daijf djftest]# printf "%s %s\n" 1 2 3 4 5 6
1 2
3 4
5 6
```

```bash
[root@daijf djftest]# printf %s %s %s 1 2 3 4 5 6
%s%s123456
```

需要注意的是，`printf` 不能与管道符连用，如下：

```bash
cat student.txt | printf '%s'
```

需要使用 `$()` 才可以，如下：

```bash
printf '%s' $(cat student.txt)
```

```bash
# 每一列通过制表符分隔
[root@daijf djftest]# cat student.txt 
ID	Name  Age  Sex
01	zs    13   男
02	ls    23   男
03	ww    18   女

[root@daijf djftest]# printf '%s\t%s\t%s\t%s\t\n' $(cat student.txt)
ID	Name  Age  Sex	
01	zs	  13   男	
02	ls	  23   男	
03	ww	  18   女
```

`printf` 常与 `awk` 命令一起使用。在 Linux 中，默认是没有 `print` 命令的，但是，在与 `awk` 命令一起使用时，可以使用 `print` 命令。`printf` 不会自动换行，而 `print` 命令会自动换行。
