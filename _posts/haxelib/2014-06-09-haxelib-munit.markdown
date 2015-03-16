---

layout: post
title:  测试套件
date:   2014-06-09 7:22:30
categories: haxelib

---

内容分为haxe标准库的 haxe.unit 和 haxelib munit.可以任意选译其中的一个用于 haxe 代码测试
 
<!-- more -->



haxe.unit test
------

#### 创建测试样例

你需要创建一个 新类 扩展 haxe.unit.TestCase, 然后写一些测试用的方法. **注意:** 测试方法(method)名字必须以 test 开头.

```haxe
// 注: 由于 TestCase 被标记为 @:publicField 所以不用添加 public 访问控制
class TestFoo extends haxe.unit.TestCase{
	function new(){
		super();
		this.print("这里做类的初使化工作");
	}
	
	// 以字符 test 开头的方法.
	public function testBase(){
		this.print(" 一个 test方法 ");
		this.assertEquals("A","A");
	}
	override function setup(){
		this.print(" 在每次调用一个 test方法时之前 ");
	}
	override function tearDown(){
		this.print(" 在每次执行完一个 test方法时之后 ");
	}
}
```

#### 添加测试样例

必须将所有 TestCase 类添加到 TestRunner 中去.

```haxe
class Main{
	static function main(){
		var runner = new haxe.unit.TestRunner();
		runner.add(new TestFoo());
		runner.run();	
	}
}
```

#### 比较复杂的对象

很可能需要自已写一些 equals 之类的方法, 但是对于数组可以:

```haxe
public function testArray(){
	var a = [1,2,3];
	assertEquals("[1, 2, 3]", Std.string(a));
}
```



haxelib munit
------

[munit] 是用于 haxe 跨平台的测试框架. [wiki]

[wiki]:https://github.com/massiveinteractive/MassiveUnit/wiki

[munit]:https://github.com/massiveinteractive/MassiveUnit/


#### 快速入门

 * haxelib run munit config

 	> 将会在当前目录中创建配置文件 `.munit`, 并且创建 一些样例测试于 test 目录下.

 * haxelib run munit test

 	> 根据 `.munit` 文件的配置进行测试.

 * haxelib run munit test -js -as3

 	> 仅仅测试 js 与 as3 这二个平台.

 	> 备注: munit 不知道是如何实现忽略 hxml 文件中的目标平台? haxe 好像并没有相关的命令行参数,  	




#### 自动生成

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
	
 6. 使用这个测试框架时, 有时候关联的 haxelib 太多经常不能通过测试编译





依赖
------

munit 上边的内容已经够用了, 只是这个类依赖的库有些多,

#### mcover

[mcover](https://github.com/massiveinteractive/mcover) 

#### mconsole

[mconsole](https://github.com/massiveinteractive/mconsole) 提供一致的跨平台的 trace 输出.

#### hamcrest

[hamcrest](https://github.com/mikestead/hamcrest-haxe)


