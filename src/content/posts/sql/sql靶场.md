---
title: sql注入
published: 2026-10-13
description: 本篇介绍sqli-labs靶场的通关教程
tags: [sql]
category: 笔记
---
  
less1-4均可使用联合注入`union`

less5-6可使用报错注入，利用报错函数`updataxml()` 

(详情以后再说)

# 布尔盲注

## less-7

发现输入 `?id=1'))--+ `是对的

尝试用报错注入：

![](https://picgocloud.com/m/f9118f0a-d006-423e-b302-2f75ef6558c7.png)

发现页面上不能返回具体的错误信息，因此使用布尔盲注

第一步判断数据库名长度

经过一系列的尝试，我得到了

    图1

接下来是判断库名

又经过了一系列尝试，我得到了

    图2