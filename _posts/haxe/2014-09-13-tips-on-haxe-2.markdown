---
layout: post
title:  混乱的记录
date:   2014-09-13 17:21:10
categories: haxe
---

一些杂乱无章的笔记...[之前一部分]({% post_url haxe/2014-05-10-tips-on-haxe- %})
 
<!-- more -->

<br />

#### List

链表形式, Haxe 中的List 是由包含二个元素的各个数组链接而成,文档称 适用于经常删除和添加元素,而避免复制.

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

似乎什么也锁不上.也许是我的方法错了.


#### Poll

从名字看上去像是轮循, 这个类没有任何文档.


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






