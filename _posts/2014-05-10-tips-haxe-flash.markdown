---
layout: post
title:  haxe编译flash 小记
date:   2014-05-10 15:16:10
categories: haxe
---

#### 跨域安全沙箱错误

`crossdomain.xml` 用于跨域加载数据.很可能需要添加 `-D network-sandbox`

注意: 使用 `Workder` 时,子线程总是为 **只访问网络**.

```xml
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy> 
	<site-control permitted-cross-domain-policies="all" />
    <allow-access-from domain="*" />
    <allow-http-request-headers-from domain="*" headers="*"/>
</cross-domain-policy>
```
<!-- more -->
 <br />


#### 使用 `swc`

 * 导出 `haxe` 代码为 `swc` 库. [参看-A] - [参看-B]

	```bash
	# 导出 com/hxlib 下所有文件
	haxe -cp src --macro "include('com.hxlib')" -swf bin/hxlib.swc

	# 或者单个文件
	haxe -swf bin/hxlib.swc Pipe.hx
	```

 
 * 在 flash 中使用 `haxe` 导出的 `swc` 库.可能需要初使化见 [参看-A]
	
 * 当平台为 `flash` 时,将 `swc` 库 添加到 `haxe` 中去.

	```xml
	<!-- 下边示例使用了 `openfl/flash`的 xml 配置.其它可以自行设置相关编绎选项. -->
	<haxeflag name="-swf-lib" value="pathto/libname.swc" if="flash" />
	```
	
	> 常见错误 1. `You cannot have both a static and a non static member or function with the same name...`

	> [问题解决原文](http://labe.me/en/blog/posts/2012-12-17-flash-haxe-gaming-sdk.html#.U4dTP3Y3mcM)

	
	```haxe
	// haxe 调用 starling.swc 示例
	// 将这个文件 保存为 Starling.patch 或其它任意文件名.
	// 项目中添加 haxeflag 编译选项 --macro "patchTypes('Starling.patch')"

	-starling.core.RenderSupport.clear
	-starling.core.Starling.context
	-starling.core.Starling.juggler
	-starling.core.Starling.contentScaleFactor
	```

	> 当使用 调用 `swc` 时,使用编绎标记 `-dce full` 很可能将会报错




[参看-A]:https://github.com/jcward/HaxeSWCExample
[参看-B]:http://old.haxe.org/manual/swc?lang=cn


<br />

#### 自定义 `openfl/flash` `Preloader`
`haxepunk` 库源码有一个很好的示例.

```xml
<app preloader="MyPreloader" />
<!-- 源码中必须能查找得到MyPreloader这个类,也可以指定包名如: -->
<app preloader="com.myname.Preloader" />
```

<br />

#### `override` flash 原生方法

覆盖 `flash` 的 `setter` 时要注意 返回值类型应该为 Void, 而 `Haxe` 的 `setter` 却应返回对应类型.

```haxe
class LEByteArray extends ByteArray{
	
	public function new(len:UInt) {
		super();
		super.length = len;
		super.endian = Endian.LITTLE_ENDIAN;
	}
	
	override public function clear():Void {}
	
	@:setter(length) function set_length(len:UInt):Void {
		if(len > super.length){
		  super.length = len;
		}else if(len < super.length ){
			throw 'You are not allowed to change the length.';	
		}
	}
	
	@:setter(endian) function set_endian(endian:String):Void {
		//throw new Error( 'You are not allowed to change the endian.' );
		throw 'You are not allowed to change the endian.';
	}
}
```


<br />

#### 其它

 当 `haxe` 调用 `flash alchemy` 打包的 `swc` 库时,将会出错,但使用 `-debug` 编绎选项却能通过. [问题#1976](https://github.com/HaxeFoundation/haxe/issues/1976)

 * 一些编绎相关选项参看 [编译-flag](http://haxe.org/doc/compiler) 和 [编译-define](http://haxe.org/manual/tips_and_tricks)

 * Haxe 语法的 private 只限制 Haxe 语法编译器自身,编译成 flash 后,在swf中所有private成员都是 public 可见的.

	> 编译定义(-D) `swf-protected` : by default the compiler turns all private fields public in SWF output. This flag will keep them protected instead.(Haxe private == AS3 protected) 

 	> 但添加了这个编译定义,haxe3.1.3 无法通过编译.
	```
  	TypeError: Error #1006: start 不是函数。
  	at boot_19ea()
 	```

<br />


