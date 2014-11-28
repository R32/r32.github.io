---

layout: post
title:  测试套件
date:   2014-06-09 7:22:30
categories: haxelib

---

 [munit] 是用于 haxe 跨平台的测试框架. [wiki]

 [wiki]:https://github.com/massiveinteractive/MassiveUnit/wiki

 [munit]:https://github.com/massiveinteractive/MassiveUnit/
 
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


#### 实例

 1. CMD 进入到项目主目录.

 2. 运行 `haxelib run munit config` 根据提示设置

 3. 这里我需要把 Trand.hx 加入到 测试单元,因此创建测试类 TrandTest.hx:  `haxelib run munit create TrandTest -for Trand`

 4. 将 上边的 TrandTest 加入到测试单元: `haxelib run munit gen -filter ExampleTest` , `-filter ExampleTest`: 表示忽略自动生的示例测试.

 5. 修改 TrandTest.hx 之后, 全平台测试: `haxelib run munit test`, 或指定平台测试: `haxelib run munit test -js -as3` , 一般情况下测 `-neko` 平台就行了

	> BUG? `haxelib run munit test` 将会覆盖 第 4 步, 
	
	> 还有就是虽然测试属于另一个项目, 但是为了能获得代码智能提示需要把 -lib munit 加入到项目.


<br />


依赖
------

munit 上边的内容已经够用了, 只是这个类依赖的库有些多,

#### mcover

[mcover](https://github.com/massiveinteractive/mcover) 

#### mconsole

[mconsole](https://github.com/massiveinteractive/mconsole) 提供一致的跨平台的 trace 输出.

#### hamcrest

[hamcrest](https://github.com/mikestead/hamcrest-haxe)

<br />
