---

layout: post
title:  munit
date:   2014-06-09 7:22:30
categories: haxelib

---

 [munit] 是用于 haxe 跨平台的测试框架. [wiki]

 [wiki]:(https://github.com/massiveinteractive/MassiveUnit/wiki)

 [munit]:(https://github.com/massiveinteractive/MassiveUnit/)
 
<!-- more -->

#### 快速入门

 * haxelib run munit config

 	> 将会在当前目录中创建配置文件 `.munit`, 并且创建 一些样例测试于 test 目录下.

 * haxelib run munit test

 	> 根据 `.munit` 文件的配置进行测试.

 * haxelib run munit test -js -as3

 	> 仅仅测试 js 与 as3 这二个平台.

 	> 备注: munit 不知道是如何实现忽略 hxml 文件中的目标平台? haxe 好像并没有相关的命令行参数,  	




#### 自动生成 Test 类

For example

```bash
haxelib run munit create com.FooTest
haxelib run munit create -for com.Foo
haxelib run munit create com.FooBarTest -for com.Foo
```

Note: This is only available from version 0.9.2.0

```bash
自动将 测试类加入到 TestSuite
haxelib run munit gen

# 添加一些过滤, 例如 忽略掉默认的 ExampleTest
haxelib run munit gen -filter ExampleTest
```


- - -

这些内容就已经够用的了..
