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

#### 编译标记 及 元标记

仅针对 flash 平台, 这个清单可能并不完整治,

```bash
##### 可以直接跟在 haxe 命令后的. haxe --help

# 更严格的类型检测, 反正加上就是
--flash-strict : more type strict flash API

# 指定 flash 版本, 例: -swf-version 10.3, 或 -swf-version 11.6
-swf-version <version> : change the SWF version (6 to 10)

# 指定 flash 文件头, 例: -swf-header 800:600:FFFFFF
-swf-header <header> : define SWF header (width:height:fps:color)

# 添加 swf 库, 文件通常为 swc 格式
-swf-lib <file> : add the SWF library to the compiled SWF


##### 通过 -D 定义的. haxe --help-defines

# 使用 `haxe` 名, 作为 flash 的引导类名, 替换掉默认的 boot_xxx 名, 这项定义将会 自动用于编译成 swc 时
haxe-boot              : Given the name 'haxe' to the flash boot class instead of a generated name

# 更改 flash 网络沙箱模式,  定义后将为 只访问网络, 默认为只访问本地
network-sandbox        : Use local network sandbox instead of local file access one

# 禁用 swf 压缩
no-swf-compress        : Disable SWF output compression

# flash 硬件加速 第 1 级 - 直接
swf-direct-blit        : Use hardware acceleration to blit graphics

# flash 硬件加速 第 2 级 - GPU
swf-gpu                : Use GPU compositing features when drawing graphics

## 注: swf-gpu 和 swf-direct-blit 只适用于 Flash Player 独立播放器时
## 当 位于浏览器中播放时, swf-direct-blit 对应 wmode="direct", 而 swf-gpu 则是 wmode="gpu"

# 嵌入元数据 xml文件到 swf,以便搜索引擎检索信息, 示例: -D swf-metadata=data.xml 
# 元数据 xml文件 格式参见 http://www.adobe.com/products/xmp.html
swf-metadata           : =<file> Include contents of <file> as metadata in the swf.

# 示例: http://old.haxe.org/doc/flash/preloader
swf-preloader-frame    : Insert empty first frame in swf, To be used together with -D flash-use-stage and -swf-lib

# 配合 swf-preloader-frame 的.
flash-use-stage        : Keep the SWF library initial stage. To be used together with -swf-lib. Place objects found on the stage of the SWF lib. (Not to be used together with -swf-header)


# 编译时将 private 属性将变成 protected 而不是 public
# 实际上 hx 中的 private 仅仅只用于限制 hx 代码, 生成 swf 后, 都为 public
swf-protected          : Compile Haxe private as protected in the SWF instead of public

# 设置 swf 超时时间
swf-script-timeout     : Maximum ActionScript processing time before script stuck dialog box displays (in seconds)

# ???
swf-use-doabc          : Use DoAbc swf-tag instead of DoAbcDefine

# 添加 Scout (aka Monocle) 支持. Since SVN r5429
advanced-telemetry     : Allow the SWF to be measured with Monocle tool

# 编译时将 private 属性将变成 protected 而不是 public
# 实际上 hx 中的 private 仅仅只用于限制 hx 代码, 生成 swf 后, 都为 public
swf-protected          : Compile Haxe private as protected in the SWF instead of public

##### 元标记. haxe --help-metas

@:bind				  : 覆盖 flash 的同名定义, 当在 Haxe 中声明了一个类(不是extern类)已经存在于 SWF 库, 将会报错.

@:setter(property)    : 示例: 见本篇的 "override flash 方法" 

@:getter(property)    : 同 @:setter

@:meta                : 生成相应的 Flash 元数据, 例: @:meta(Event(name="test",type="Foo")).

@:ns("namespace")     ：指定的字段或方法的命名空间

@:sound				  : 同 @:file，@:font,@:bitmap 见 "嵌入资源" 
```


<br />
#### 嵌入资源

haxe 中有几个 元标记,仅用于 flash 平台的资源嵌入. 当然 openfl 项目 或一些其它的库, 提供简单的资源嵌入方式.

这些元标记必须要继承相关的 类. 

 * `@:sound("path/file.wav|mp3")` 用于嵌入声音

	> 示例: `@:sound("blit.mp3") class MySound extends flash.media.Sound{ }`

 * `@:file("path/file")` 以 ByteArray 的方式嵌入文件.

	> 示例: `@:file("a.dat") class MyByteArray extends flash.utils.ByteArray{ }`

 * `@:font("path/file.ttf",range="")` 嵌入字体, 可以选译需要字符.

	> 示例: `@:font("font/ceri0553.ttf", "a-zA-Z0-9~!@#$%^&*()_+=-][}{.,;\":><") class MyFont extends Font { }`

	> haxe 仅支持 ttf字体, 不支持 otf 字体的嵌入. 

 * @:bitmap("path/file.png|jpg|gif") 以 bitmapData 形式嵌入图片

	> 示例： `@:bitmap("logo.png") class MyBitmapData extends flash.display.BitmapData{ }`

其它: haxe.Resource 是一个跨平台的资源嵌入类, 用于 文本 或 二进制 文件的嵌入. 从 Resource 源码上看, 似乎 文件是以序列化之后的字符串进行嵌入的.

#### swc 

 * 导出 haxe 代码为 swc 库. [参看-A] - [参看-B]

	```bash
	# 导出整个文件夹
	haxe -cp src --macro "include('com.hxlib')" -swf bin/hxlib.swc

	# 或者单个文件
	haxe -swf bin/hxlib.swc Pipe.hx
	```

 
 * 在 AS3 中使用 haxe 导出的 swc 库.需要初使化

	```haxe
	haxe.initSwc(mc); // mc 将被存入为 flash.Lib.current
	```
	
 * 当平台为 flash 时,将 swc 库 添加到 haxe 中去.

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

#### 自定义 Preloader

 * [Preloader](http://old.haxe.org/doc/flash/preloader)

 * openfl 项目, `haxepunk` 库源码有一个很好的示例.

	```xml
	<app preloader="MyPreloader" />
	<!-- 源码中必须能查找得到MyPreloader这个类,也可以指定包名如: -->
	<app preloader="com.myname.Preloader" />
	```

<br />

#### override flash 方法

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

#### patch files(补丁文件)

当在 haxe 中调用 flash 的 swc 库时, haxe 编译器能自动提取里边的定义,虽然大多数情况下不会造成问题,

但在某些情况下你可能必须创建 patch file, patch file 将修改 flash库中已经存在类的字段类型, 

```haxe
// Removes a class field from Haxe definition
-flash.accessibility.Accessibility.new

// Adds metadata to a given class
@:require(flash10) flash.desktop.Clipboard

// Adds metadata to a given class field
@:require(flash10) flash.display.BitmapData.setVector

// Modifies a given field type
flash.display.DisplayObject.blendMode : BlendMode;

// Modifies a static field type
static flash.system.IME.conversionMode : IMEConversionMode;

// Modifies all function parameters with this specific name
flash.display.BitmapData.$blendMode : BlendMode;

// Modifies a single function parameter
ClassName.$functionName__parameterName : Type;

// Convert a class made of statics vars into an Haxe enum
enum flash.text.TextFieldAutoSize;
```

大量这样的例子可以从 [this patch file](https://github.com/HaxeFoundation/haxe/blob/development/extra/extract.patch) 获取，这对是对flash的定义的一个补充。

You can use a patch file with --macro patchTypes('patchFile')

<br />


#### --gen-hx-classes

下边这条 命令 将解析 swc 库,并自动生成库中所有类的 extern class, 也就是不需要再手工添加 flash 平台的 extern class. 

但是目前 haxe3 已经可以直接使用 flash 的 swc 库, 不需要做这多余的步骤了. 而 haxe2 时代似乎是要做这一步才能正确调用 flash 的 swc 库.

```bash
haxe -swf nothing.swf --no-output -swf-lib lib.swc --gen-hx-classes
```

<br />

#### 其它

当调用 flash alchemy 打包的 swc 库时,将会出错,但使用 `-debug` 编绎选项却能通过. [问题#1976](https://github.com/HaxeFoundation/haxe/issues/1976), 所以目前只能以 loader 的形式加载 swf [示例](https://github.com/R32/my-test/blob/master/test/as3/stringecho/hx-proj/EchoTestLoader.hx) 



一些编绎相关选项参看 [编译-flag](http://haxe.org/doc/compiler) 和 [编译-define](http://haxe.org/manual/tips_and_tricks), Haxe 语法的 private 只限制 Haxe 语法编译器自身,编译成 flash 后,在swf中所有private成员都是 public 可见的.

	> 编译定义(-D) `swf-protected` : by default the compiler turns all private fields public in SWF output. This flag will keep them protected instead.(Haxe private == AS3 protected) 
<br />


