---
layout: post
title:  一些语法记录 2
date:   2014-09-13 17:21:10
categories: haxe
---

一些杂乱无章的笔记...[之前一部分]({% post_url haxe/2014-05-13-tips-on-haxe %})
 
<!-- more -->

<br />

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

在网上看了一些贴子也没弄明白是怎么回事, 感觉和线程的的局部变量没区别, 也许只是 堆栈(局部)变量 和 tls 变量的区别. haxe 中 主线程中创建 new Tls<T>(), 虽然各线程都能访问, 但各 tls.value  取到的值都为 null, 子线程无法获得 主线程中对 tls.value 的设置, 同样主线程中也无法获得 子线程对 tls.value 的赋值.

好像没什么用处, 在 haxe 中.

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






