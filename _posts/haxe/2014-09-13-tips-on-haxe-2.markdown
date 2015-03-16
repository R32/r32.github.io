---
layout: post
title:  语法记录-2
date:   2014-09-13 17:21:10
categories: haxe
---

一些杂乱无章的笔记...[之前一部分]({% post_url haxe/2014-05-13-tips-on-haxe %})
 
<!-- more -->



#### 杂项

 * haxe 的代码, 对于 `Java` 和 `C#` 平台, 把函数(例如:sortBy)直接写在参数上比写在类成员上要快

 * 泛型方法中有 new Some<T>() 这样的创建泛型实例时, 最好加上 `@:generic` 元标记.

	```haxe
	// 如果这个方法是 new Array<T>(),倒是没什么错误, 但是
	// Vector 在实例化时需要 默认类型来填充各单元, 所以不加 @:generic 时将报错,或得到的值不正确
	@:generic function vec<T>(n:T){
		var v = new haxe.ds.Vector<T>(5);
		for(i in 0...5){
			v.set(i, n)
		}
		return v
	}
	```

 * [MacroType usage](https://github.com/HaxeFoundation/haxe/issues/3947)

	```haxe
	private typedef Init = haxe.macro.MacroType < [cdb.Module.build("data.cdb")] > ;
	typedef Time = LevelData_time;
	//...
	// 更细的示例: https://gist.github.com/Simn/8581ee291b95c6c22813
	```
 * Either 二个类型, 这样可以让一个函数返回二种类型

	```haxe
	typedef MyResult = Either<Error, String>;
	
	var result:MyResult = Left(new Error("something smells"));
	
	var result:MyResult = Right("the answer is 42");
	
	// 注意区别 haxe.ds.Option
	// An Option is a wrapper type which can either have a value (Some) or not a value (None).
	```



#### 时区处理

对于 Date 的 **通用时区(UTC)时间** 和 **本地时区时间** 可以参考 AS3 手册的API, Haxe 标准库中没有 UTC 时区的方法, 因此我在Github 找到一个不错的 haxelib [DateTime](https://github.com/RealyUniqueName/DateTime) 用于处理时区问题

**Date** ,下边说明同样适用于 JS 以及 AS3. 

 * 在 Date 的内部都是以时间戳(Float)的形式来存储的. 时间戳值绝对以 **通用时区(UTC)** 形式表现,例如 Date::getTime 返回的数字

 * 但是 Date 下的普通方法(Haxe 标准库中没有像 JS 或 AS3 那样的 getUTCXxxx 方法),全都是以 **本地时区** 表现的, 这说明 Date 会将时间戳值自动从 UTC时区转换到本地然后再表现

 * 反过来说, local = new Date(2012,10,10, 2,2,2) 的参数会被认为是 本地时区时间, 在存为 时间戳 时,会自动从 本地时间转换到 UTC时间.

 * 综上所叙, 只有 utc = Date.UTC(2012,10,10, 2,2,2)(注: Haxe 标准库没有这个方法) 的参数才会当成是 UTC时区,也不会发生转换, Date::getUTCxxxx 这些方法依旧返回的是 UTC时区 时间,不会发生任何自动转换

 * 假设本地时区为 北京时间, 北京时间则比UTC时区大了 8 个小时, 那么上边示例中由于 local 会被自转换换成 UTC时区形式保存(local减去8小时), 而 utc 则不会转换, 因此 utc 将比 local 大 8 个小时.


**DateTime**

这个类是基于 Float 的抽像类, 需要注意的是 这个库的月份是 1~12, 而标准库为 0~11, 以及 DateTime::.getTime() 返回的值不包含微秒.也就是说 `Date.now().getTime() == DateTime.now().getTime() * 1000`;

 * DateTime 的所有值将全部以 UTC 时区表现. 除非主动调用 utc() 或 local() 否则不会发生任何转换.

 * 这也是为什么 DateTime.now() 输出时, 和本地时区不一至, 因为这个类始终以 UTC时区表现

 * utc = DateTime.make(2012,10,10, 2,2,2) 参数也将被认为是 UTC时区, 同样不会发生转换

 * 上边示例, utc 如果要转换到本地时区只要简单的调用 utc.local() 就行了.



#### 模板

haxe.Template http://old.haxe.org/doc/cross/template

```haxe
class App {
    static function main() {
        // 双冒号 :: 作为替换分隔符
		var text = "My name is <strong>::name::</strong> and I'm <em>::age::</em> years old.";	
        var t = new haxe.Template(text);
        var output = t.execute({ name : "John", age : 33 });
        trace(output);
    }
}
```

haxe 自带的模板 支持 if/else/elseif, foreach, sub-templates, Macros(这个名字有些??)

```html
::if flag:: OK ! ::end::
::if flag:: OK ! ::else:: FAILED ! ::end::
::if flag1:: OK ! ::elseif flag2:: MAYBE ::else:: NO ::end::

<table>
<tr><td>Name :</td><td>Age :</td></tr>
::foreach users::<tr><td>::name::</td><td>::age::</td></tr>::end::
</table>
<!-- foreach 循环中可以使用特殊变量 __current__ -->
```

```haxe
class App {
    // macro 示例: 注意第一个参数。　
	// a macro returns a string
    static function myfun( resolve : String -> Dynamic, title : String, p : Int ) {        
        return "["+title+"="+(p * resolve("mult"))+"]";
    }

    static function main() {
        var t1 = new haxe.Template("Call macro : $$myfun(Hello,::param::)");
        var str = t1.execute({ param : 55, mult : 2 },{ myfun : myfun });
        trace(str); //output: "Call macro : [Hello=110]"
    }
}
```

#### for and while

首先看下 javascript 中的闭包..

```js
// 第一个, 闭包环境的问题, 将会输出 3,3,3
for(var i = 0; i<3; i += 1){
	setTimeout(function(){
		console.log(i);	
	},500)
}

// 第二个, 值传递到闭包.避免上面问题,输出 0, 1, 2
for(var i = 0; i<3; i += 1){
	setTimeout((function(n){
		return function(){
			console.log(n);
		}	
	})(i),500)
}
```

上边的示例在 flash 中显示的结果也一致, 再来对比一下 haxe 中 for 和 while 循环的区别:

```haxe
// while 循环,	-	输出为: 3, 3, 3 
var i = 0;
while(i < 3){
	haxe.Timer.delay(function(){
		trace(i);
	}, 500);
	i += 1;
}

// for 循环		-	输出为: 0, 1, 2, 
for(i in 0...3){
	haxe.Timer.delay(function(){
		trace(i);
	}, 500);
}
```

使用 Neko 平台测试: 由于 haxe 标准库中没有 setTimeout 之类的函数,因此这里用 Thread 来测试异步

```haxe
// while 循环会先输出 for loop: 0 ~ 3, 然后接出 3, 3, 3
static function main() {
	var i = 0;
	while(i < 3){
		Thread.create(function() {
			Sys.sleep(.5);
			Sys.println(i);
		});
		Sys.println("for loop: " + i);
		i += 1;
	}
	Sys.sleep(3); // 等待线程结束
}

// for 循环, 同样是 for loop: 0 ~ 3, 但是接着输出 [0, 1, 2], 这个 [0, 1, 2] 有时候会是其它顺序.
static function main() {
	for(i in 0...3){
		Thread.create(function() {
			Sys.sleep(.5);
			Sys.println(i);
		});
		Sys.println("for loop: " + i);
	}
	Sys.sleep(3);
}
```


#### List

链表形式, Haxe 中的List 是由包含二个元素的各个数组链接而成,文档称 适用于经常删除和添加元素,而避免复制.从源码上感觉这个List 的实现不太好, 感觉 List 没什么用.不如直接用 Vector 或 Array.

```haxe
var list = new List<Int>();
for(i in 0...5){
	list.add(i);
}
// 往 list 里添加了 0~4, 5个元素后,这里候 list 其实这像这样
h = [0, [1, [2, [3, [4, null]]]]]
q = [4,null]
```

#### Thread

类没有几个方法可用, 示例使用 `readMessage(block = true)` 阻塞进程的方式

```haxe
var me = Thread.current();

var t1 = Thread.create(function() {
	var str:String;
	while (true) {
		str = Thread.readMessage(true);
		if (str == 'exit') {
			break;
		}else {
			trace("t1 get: " + str);
		}
	}
	trace("t1 break white!");
	me.sendMessage("the end");
});
		
for (i in ["hello", "world", "some", "message"]) {
	t1.sendMessage(i);
}

Sys.sleep(2);
t1.sendMessage("exit");
trace(Thread.readMessage(true));// 阻塞直至子线程发送消息
```



#### Deque 

**重要:** `pop(block)` 当 block 为 true, 将为阻塞模式, 也就是说调用 pop(true) 时, 当没有元素可用于pop( *类似于调用空数组的pop方法* ), 将阻塞当前进程直至至有元素可以弹出. 用于多线程编程.

```haxe
var dq = new Deque<Int>();
		
Thread.create(function() {
	Sys.sleep(2);
	dq.add(100);
});
trace("if block is true, and has no value can be pop()");
trace(dq.pop(true));
trace("end");
```

#### Lock

`wait(?sec)`用于阻塞进程.直到已经到了指定时间或者其它进程调用了 `release()`. 示例显示了 wait 的时间已过而退出 阻塞, 

```haxe
var lk = new Lock();
Thread.create(function() {
	Sys.sleep(2);
	trace("sub thread call release!");
	lk.release();
});
lk.wait(1);
trace(lk);
Sys.sleep(3);
```


#### Tls

~~在 haxe 中 感觉和线程的的局部变量没区别, 也许只是 堆栈(局部)变量 和 tls 变量的区别. 在 主线程中创建 new Tls<T>(), 虽然各线程都能访问, 但各 tls.value  取到的值都为 null, 子线程无法获得 主线程中对 tls.value 的设置, 同样主线程中也无法获得 子线程对 tls.value 的赋值. 好像没什么用处, 注意和 ssl/tls 区别.~~

作为 thread 的局部变量, 为解决多线程程序的并发问题提供了一种新的思路,  示例见 `std/haxe/io/FPHelper.hx`

声明静态绑定线程的本地对象和变量时必须遵守下列原则：但是不知道 haxe 是否需要遵守这些 原文见 https://msdn.microsoft.com/zh-cn/library/6yh4a9k1.aspx

 * 只能应用于 数据声明和定义, 不能用于函数声明或定义

 * 只能用在具有　static 作用域的数据项上(haxe 的 static 只能作用于类字段)

#### Mutex

TODO:

#### Poll

TODO: 从名字看上去像是轮循, 这个类没有任何文档.


#### Socket

input或output 默认都是阻塞类型的,

 * `setTimeout(timeout:Float):Void` 设置超时, 

适用于服务器端:

 * `bind(host:Host, port:Int):Void`

 * `listen(connections:Int):Void`

 * `accept():Socket`  accept 默认会阻塞进程, 但是 setBlocking(false) 可以修改阻塞

 * `host():{port:Int, host:Host}` 服务端socket 信息

 * `peer():{port:Int, host:Host}` 连接端socket 信息

适用于客户端:

 * `connect(host:Host, port:Int):Void`


其实使用 vm.net.ThreadServer 就好了...


#### XML

XML http://old.haxe.org/doc/cross/xml

xml nodeType, 参见 Xml下静态属性

 * Document 9: 文档类型, 通常为 Xml.parse 返回的对象

 * Element 1: 元素类型

 * DocType 10: DTD DOCTYPE 文档类型,例: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`

 * CData 4:  `<![CDATA[ ]]>`

 * Comment 8:  `<!-- -->`

 * PCData　3：　即文本(Text)节点

 * ProcessingInstruction 7: 例 `<?xml version="1.0" encoding="utf-8" ?>` 

firstChild() 和 firstElement() 的区别是 child 不仅仅只有 Element,

FAST http://old.haxe.org/doc/advanced/xml_fast

 * `.name` 返回当前元素名字（和 Xml.nodeName 一样）

 * `.x` 返回当前相应的 Xml 实例(注:Fast 和 Xml 是二个不同类)

 * `.att.<name>` 访问给定的属性, 如果不存在将抛出异常

 * `.has.<name>` 检测是否存在属性

 * `.elements` 返回所有　元素(Xml.Element)　清单

 * `.node.<name>` 返回指定名称的第一个子节点,如果不存在将抛出异常

 * `.nodes.<name>` 返回指定名称的所有子节点

 * `.hasNode.<name>` 检测是否存在指定子节点

 * `.innerData` 返回内部 文本节点内容或 CData, 注: 如果没有符合条件的子节点(不包含孙节点)将导致异常

 * `.innerHTML` innerHTML String

```haxe
var xml = Xml.parse('<root>
	<data id="one">1</data>
	<data id="two">2</data>
	<data id="three">3</data>
</root>');

var fast = new Fast(xml.firstElement)
```

#### FPHelper

最新特性






