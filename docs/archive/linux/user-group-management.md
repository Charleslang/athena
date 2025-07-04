# 用户和用户组管理

## 用户配置文件

### 用户信息文件

越是对服务器安全性要求高的服务器，越需要建立合理的用户权限等级制度和服务器操作规范。在 Linux 中，主要是通过用户配置文件来查看和修改用户信息。

用户信息保存在 `/etc/passwd` 文件中。

```bash
vim /etc/passwd
```

可以借助 `man` 命令来查看配置文件的格式以及相关说明，如下：

```bash
man 5 pwasswd
```

使用 `man` 命令后，会看到输出的内容包括以下部分：

![2025070315332648.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332648.png)

也就是说，每一行代表了一个用户，每行的格式如下：

```bash
账号:密码标识:用户ID:用户初始组ID:用户说明信息:家目录:登录之后的 Shell
```

以 root 用户为例，他在文件中存储的内容如下：

```txt
root:x:0:0:root:/root:/bin/bash
```

每个字段的含义如下：

- **第一位**

    用户名
    
- **第二位**

    密码标识。其中 x 表示用户的密码，可在 `/etc/shadow` 文件中查看密码的密文（使用 SHA 加密生成的 512 位密文）。
    
- **第三位**

    用户 ID。0 表示超级用户，1-499 表示系统用户（伪用户），500-65535 表示普通用户（较新的 Linux 是从 1000 开始的）。注意，系统识别的其实就是 UID，和用户名没有关系，就跟 IP 与域名的关系一样。所以，用户名为 root 的，不一定是超级用户；但是 UID 为 0 的，一定是超级用户。UID 一般情况下是不会重复的，如果重复了，则系统会把他们当成同一个用户。

- **第四位**

    用户初始组 ID。初始组就是指用户一登录就立刻拥有这个用户组的相关权限，每个用户的初始组只能有一个，一般就是和这个用户的用户名相同的组名作为这个用户的初始组（在新建用户的时候，系统会自动创建一个与用户同名的组，并把用户分配到这个组中）。附加组是指用户可以加入多个其他的用户组，并拥有这些组的权限，附加组可以有多个。一个用户必须有且只能有一个初始组。不建议修改用户的初始组。（可以使用该字段在 `/etc/group` 中对比 GID 来查看用户属于哪个组）

- **第六位**

    用户的家目录。root 的家目录在 `/root`，普通用户的家目录在 `/home/${username}`。用户一登录系统，就会自动进入家目录中。

- **第七位**

    登录之后的 Shell。Shell 就是 Linux 的命令解释器。在 `/etc/passwd` 当中，除了标准 Shell 是 `/bin/bash` 之外，还可以写为 `/sbin/nologin`（表示不允许登录）。

### 影子文件

所谓影子文件，就是指 `/etc/shadow` 这个文件。`/etc/shadow` 是 `/etc/passwd` 这个文件的影子。为什么叫做影子文件呢？我们来看一下这两个文件的权限。

```bash
[root@daijf ~]# ll /etc/passwd
-rw-r--r-- 1 root root 1456 Aug 13 23:01 /etc/passwd

[root@daijf ~]# ll /etc/shadow
---------- 1 root root 884 Aug 13 23:01 /etc/shadow
```

可以看到，`/etc/shadow` 这个文件的权限是 000。也就是说，除了超管外，其它任何人都没有这个文件的权限。

在 `/etc/passwd` 中，使用 x 来表示用户密码的标识，用户真正的密码是保存在 `/etc/shadow` 这个文件中的。在 `/etc/shadow` 这个文件中，保存的是经过 SHA 加密后的密码（512 位）。

看下 `/etc/shadow` 这个文件的内容，部分内容如下：

```txt
root:$1$qoUMlXgA$3blV.7gPgcaSl94t2FKVr.:18712:0:99999:7:::
```

这个文件的格式以及描述，可以使用 `man` 命令查看：

```bash
man 5 shadow
```

`/etc/shadow` 文件的格式如下：

```txt
用户名:加密后的密码:最后一次修改密码的时间:两次修改密码的最小时间间隔:密码有效期:密码警告期:账户有效期:保留字段
```

- **加密后的密码（encrypted password）**

    使用的 `SHA512` 散列算法进行加密。请参考 `crypt(3)` 了解如何解释这个字符串。
    
    例如，如果密码字段包含一些不是 `crypt(3)` 的有效结果的字符串 `!` 或者 `*`（也表示没有密码），用户将不能使用 Unix 密码登录（但用户可以通过其他方式登录系统）。
    
    该字段可以为空，在这种情况下，不需要密码作为指定的登录名进行身份验证。然而，如果密码字段为空，一些读取 `/etc/shadow` 文件的应用程序可能决定不允许任何访问。
    
    以感叹号开头的密码字段表示密码被锁定。该行上的其余字符表示锁定密码之前的密码字段。如下：

    ```txt
    # !$1$zriUZc.9$.HSKNDlXk133lmICFEUST0 表示用户的密码被锁定，即用户不能登录系统
    # $1$zriUZc.9$.HSKNDlXk133lmICFEUST0 表示用户被锁定之前的密码
    djf2:!$1$zriUZc.9$.HSKNDlXk133lmICFEUST0:19238:0:99999:7:::
    ```

- **最后一次修改密码的时间（date of last password change）**

    表示为自 UTC 时间 1970年1月1日00:00 以来的天数。0 有特殊含义，表示用户下次登录时需要修改密码。空字段表示禁用密码老化功能。

- **两次修改密码的最小时间间隔（minimum password age）**

    和第三个字段（最后一次修改密码的时间）比较，表示在上一次就该密码后，必须经过多久才能进行下一次密码的修改（单位：天）。为 0 则表示没有限制。

- **密码有效期（maximum password age）**

    该字段表示，用户的密码在多少天后必须进行修改。超过这个天数后，密码可能仍然有效。用户下次登录时应该被要求更改密码。空字段表示不存在有效期（`maximum password age`）、密码警告期（`password warning period`）和密码不活跃期（`password inactivity period`）。如果该字段小于两次修改密码的最小时间间隔，则用户无法修改密码。该字段默认值是 99999 天，相当于 273 年，也就是永久有效。
    
- **密码警告期（password warning period）**

    该字段的值表示密码到期前的天数。在此期间用户应该得到警告。空字段和值 0 表示没有密码警告期。

- **密码不活跃时期（password inactivity period）**

    该值表示密码过期后的天数，在此期间密码仍可使用（用户应在下一次登录时应该更新密码）。密码过期后，该用户将无法登录。用户应联系管理员。空字段和 0 味着不执行不活跃期（也就意味着密码到期后，用户将不能登录），-1 表示永久有效。

- **账户有效期（account expiration date）**

    帐户到期的日期，表示为自 UTC 时间 1970年1月1日00:00 以来的天数。注意，帐号过期时间和密码过期时间是不同的。如果帐号过期，则不允许用户登录。如果字段为空，则表示该帐户永远不会过期。不应该使用值 0，因为它被解释为没有到期的帐户，或者是在 1970年1月1日到期的帐户。

- **保留字段（reserved field）**

    此字段为将来使用保留。

通过上面的内容，我们知道了 `/etc/shadow` 这个文件中的时间都是以 1970年1月1日为基础，在此之后相差的天数，那有没有办法将其转为日期呢？当然是可以的，如下：

```bash
# 18712 表示与 1970-01-01 相差的天数
[root@daijf ~]# date -d "1970-01-01 18712 days"
Fri Mar 26 00:00:00 CST 2021
```

将当前时间转换为与 1970-01-01 相差的天数：

```bash
echo $(($(date --date="2022/09/03" +%s)/86400+1))
```

### 组信息文件和组密码文件

1. **组信息文件 /etc/group**

使用 `vim` 查看 `/etc/group` 这个文件的内容，如下：

```bash
root:x:0:
```

- 第一字段
    
    组名

- 第二字段

    组密码标识
    
- 第三字段

    GID
    
- 第四字段

    组中附加用户


2. **组密码文件 /etc/gshadow**

和用户的密码一样，`/etc/gshadow` 用于存放 `/etc/group` 的密码。使用 `vim /etc/gshadow` 查看文件的内容：

```bash
root:::
```

- 第一字段

    组名
    
- 第二字段

    组密码

- 第三字段

    组管理员用户名

- 第四字段

    组中附加用户

:::tip 
不建议给组设置密码。
:::

## 用户管理相关文件

**1. 家目录**

**什么是用户的家目录（宿主目录）？**

- 普通用户

    `/home/${username}`。该目录的所有者和所属组都是此用户，权限是 700。新建的用户会自动在 `/home/` 下生成家目录。

- 超级用户

    `/root/`。该目录的所有者和所属组都是 root 用户，权限是 550（root 用户其实有任何目录的任何权限，这个权限只是对于普通用户来讲的）。

如果将普通用户修改为超级用户，那么可以把 `/etc/passwd` 文件中，用户的 UID 修改为 0。普通用户如果被修改成了超级用户，那么它的家目录其实是不会变的，还是在 `/home/${username}` 目录下。Linux 通过命令提示符来判断是 root 用户还是普通用户，超级用户的命令提示符为 `#`，而普通用户是 $，如下：

- 超级用户

    ![2025070315332669.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332669.png)
    
- 普通用户

    ![2025070315332701.png](https://djfmdresources.oss-cn-hangzhou.aliyuncs.com/athena/2025-07-03/2025070315332701.png)

**2. 用户邮箱**

用户邮箱在 `/var/spool/mail/${username}/` 目录下。添加用户时，会自动创建该目录。

**3. 用户模板目录**

用户模板目录在 `/etc/skel/` 下。这个模板有什么用呢？我们先来看一下新建的用户，在用户目录下有哪些文件：

```bash
[djf2@daijf ~]$ ls -a
.  ..  .bash_history  .bash_logout  .bash_profile  .bashrc  .cache  .config
```

这些文件是从哪里来的呢？其实就是从模板中拷贝而来的。如果我们想在新建用户时，在用户的家目录下自动创建某个文件，那么我们就可以把这个文件放在模板目录 `/etc/skel/` 下。

## 用户和用户组管理

**1. `useradd`**

|命令名称|功能描述|语法|
|---|---|---|
|`useradd`|添加用户|`useradd [选项] 用户名`|

**【选项】**  

- `-u` 手工指定用户的 UID 号
- `-d` 手工指定用户的家目录。默认是 `/home/${username}`
- `-c` 手工指定用户的说明
- `-g` 手工指定用户的初始组。会默认创建与用户名同名的组
- `-G` 指定用户的附加组。一次性添加多个的话，使用逗号分割。
- `-s` 手工指定用户的登录 shell。默认是 `/bin/bash`

在执行 `useradd` 命令添加用户后，会默认往以下几个地方写数据：

```bash
useradd djf1

grep djf1 /etc/passwd
grep djf1 /etc/shadow
grep djf1 /etc/group
grep djf1 /etc/gshadow
ll -d /home/djf1
ll /var/spool/mail/djf1
```

所以，如果我们手动往以上几个目录添加对应的目录或文件内容，那么也可以创建对应的用户，不过这样比较麻烦。一般直接使用 `useradd 用户名` 即可，其它选项可以省略，除非有特别的需求。

如果直接使用 `useradd 用户名`，不添加任何选项。那么会为其自动添加对应的默认值，这些默认值都来自 `/etc/default/useradd`、`/etc/login.defs` 这个文件，如下：

```bash
vim /etc/default/useradd

# useradd defaults file
GROUP=100 # 用户默认组（只在公有模式下失效，Linux 现在都是私有模式）
HOME=/home # 默认的家目录
INACTIVE=-1 # 密码过期宽限天数（shadow 文件的第 7 个字段）
EXPIRE= # 密码失效时间（shadow 文件的第 8 个字段）
SHELL=/bin/bash # 默认的 shell
SKEL=/etc/skel # 模板目录
CREATE_MAIL_SPOOL=yes # 是否建立邮箱
```

```bash
vim /etc/login.defs

# Please note that the parameters in this configuration file control the
# behavior of the tools from the shadow-utils component. None of these
# tools uses the PAM mechanism, and the utilities that use PAM (such as the
# passwd command) should therefore be configured elsewhere. Refer to
# /etc/pam.d/system-auth for more information.
#

# *REQUIRED*
#   Directory where mailboxes reside, _or_ name of file, relative to the
#   home directory.  If you _do_ define both, MAIL_DIR takes precedence.
#   QMAIL_DIR is for Qmail
#
#QMAIL_DIR      Maildir
MAIL_DIR        /var/spool/mail
#MAIL_FILE      .mail

# Password aging controls（见 /etc/shadow 文件）:
#
#       PASS_MAX_DAYS   Maximum number of days a password may be used.
#       PASS_MIN_DAYS   Minimum number of days allowed between password changes.
#       PASS_MIN_LEN    Minimum acceptable password length.
#       PASS_WARN_AGE   Number of days warning given before a password expires.
#
PASS_MAX_DAYS   99999
PASS_MIN_DAYS   0
PASS_MIN_LEN    8
PASS_WARN_AGE   7

#
# Min/max values for automatic uid selection in useradd
#
# 手动添加用户的最小 UID
UID_MIN                  1000
# 手动添加用户的最大 UID
UID_MAX                 60000
# System accounts
# 系统用户的最小 UID
SYS_UID_MIN               201
# 系统用户的最大 UID
SYS_UID_MAX               999

#
# Min/max values for automatic gid selection in groupadd
#
GID_MIN                  1000
GID_MAX                 60000
# System accounts
SYS_GID_MIN               201
SYS_GID_MAX               999

#
# If defined, this command is run when removing a user.
# It should remove any at/cron/print jobs etc. owned by
# the user to be removed (passed as the first argument).
#
#USERDEL_CMD    /usr/sbin/userdel_local

#
# If useradd should create home directories for users by default
# On RH systems, we do. This option is overridden with the -m flag on
# useradd command line.
#
CREATE_HOME     yes

# The permission mask is initialized to this value. If not specified, 
# the permission mask will be initialized to 022.
UMASK           077

# This enables userdel to remove user groups if no members exist.
#
USERGROUPS_ENAB yes

# Use SHA512 to encrypt password.
ENCRYPT_METHOD MD5

MD5_CRYPT_ENAB yes
```

**2. `passwd`**

|命令名称|功能描述|语法|
|---|---|---|
|`passwd`|给用户设置、更改密码|`passwd [选项] 用户名`|

**【选项】**  

- `-S` 查询用户密码的密码状态。仅 root 用户可用
- `-1` 暂时锁定用户。仅 root 用户可用。其实就是在 `/etc/shadow` 文件中，给用户的密码最前面加了 `!`
- `-u` 解锁用户。仅 root 用户可用
- `--stdin` 将管道符输出的数据作为用户的密码（在脚本中比较常用）。如 `echo "123" | passwd --stdin djf3`

root 在设置用户的密码时，可以设置任何强度的密码，但是非超级用户只能设置符合相应密码强度的密码。如果直接使用 `passwd`，而不加任何选项和用户名，则表示更改当前用户的密码。

**3. `usermod`**

|命令名称|功能描述|语法|
|---|---|---|
|`usermod`|修改用户信息|`usermod [选项] 用户名`|

**【选项（可以使用 `useradd` 的大部分选项）】**  

- `-u` 修改用户的 UID 号
- `-c` 修改用户的说明信息
- `-G` 修改用户的附加组
- `-L` 临时锁定用户 (Lock)
- `-U` 解锁用户锁定（Unlock）

**4. `chage`**

|命令名称|功能描述|语法|
|---|---|---|
|`chage`|修改用户密码状态|`chage [选项] 用户名`|

**【选项】**  

- `-l` 列出用户的详细密码状态
- `-d` 修改密码最后一次更改日期
- `-m` 两次密码修改间隔
- `-M` 密码有效期
- `-W` 密码过期前警告天数
- `-I` 密码过后宽限天数
- `-E` 账号失效时间

`chage` 命令通常用于要求用户登录后必须修改密码，使用如下：

```bash
chage -d 0 djf3
```

:::warning 注意
是 `chage` 命令，而不是 `change`。
:::

**5. `userdel`**

|命令名称|功能描述|语法|
|---|---|---|
|`userdel`|删除用户|`userdel [选项] 用户名`|

**【选项】**  

- `-r` 删除用户的同时删除用户家目录

当然，也可以手动删除以下几个文件中对应的内容（不推荐）：

```bash
vi /etc/passwd
vi /etc/shadow
vi /etc/group
vi /etc/gshadow
rm -rf /var/spool/mail/djf1
rm -rf /home/djf1
```

怎么证明用户被删干净了呢？很简单，再使用 `useradd` 添加这个用户，如果报错说用户已存在，那么证明没有删除干净。

**6. `id`**

|命令名称|功能描述|语法|
|---|---|---|
|`id`|查看用户|`id 用户名`|

**7. `su`**

|命令名称|功能描述|语法|
|---|---|---|
|`su`|切换用户|`su [选项] 用户名`|

**【选项】**

- `-` 只使用 "-" 代表连带用户的环境变量一起切换（一般来讲，在切换用户时，都建议带上这个选项）
- `-c` 仅执行一次命令，而不切换用户身份

**【示例】**

```bash
[root@daijf ~]# su djf1

# 查看环境变量
# root 用户切换到普通用户会自动切换环境变量，而普通用户切换到 root 用户不会自动切换环境变量（需要使用 su - root）
[djf1@daijf root]$ env
XDG_SESSION_ID=18787
HOSTNAME=daijf
SHELL=/bin/bash
TERM=xterm
HISTSIZE=3000
SSH_CLIENT=171.214.221.138 20340 22
SSH_TTY=/dev/pts/0
# 当前的环境变量属于哪个用户
USER=djf1
```

退回到上一个用户：

```bash
exit
```

以 root 身份暂时执行某个命令：

```bash
[djf1@daijf root]$ su - root -c "useradd djf5"
Password: 

[djf1@daijf root]$ su - root -c "passwd djf5"
Password: 
Changing password for user djf5.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.

[djf1@daijf root]$ su djf5
Password: 

[djf5@daijf root]$ 
```

**8. `groupadd`**

|命令名称|功能描述|语法|
|---|---|---|
|`groupadd`|添加用户组|`groupadd [选项] 组名`|

**【选项】**

- `-g`  指定组 ID

**9. `groupmod`**

|命令名称|功能描述|语法|
|---|---|---|
|`groupmod`|添加用户组|`groupmod [选项] 组名`|

**【选项】**

- `-g` 修改组 ID
- `-n` 修改组名

**【示例】**

把组名 group1 修改为 testgrp：

```bash
groupmod -n testgrp group1
```

:::warning
不建议使用该命令。
:::

**10. `groupdel`**

|命令名称|功能描述|语法|
|---|---|---|
|`groupdel`|删除用户组|`groupdel 组名`|

如果某个用户的初始组是该组，那么该组不能被删除。

**11. `gpasswd`**

|命令名称|功能描述|语法|
|---|---|---|
|`gpasswd`|把用户添加入组或从组中删除|`gpasswd [选项] 组名`|

**【选项】**

- `-a 用户名` 把用户加入组
- `-d 用户名` 把用户从组中删除
