---

layout: post
title:  hxcpp
date:   2014-05-16 7:16:19
categories: haxe

---

内容已经发生更改, 现在主要是记录对 haxelib **hxcpp** 的认识

原生扩展提供 Haxe 代码的接口, 如果你想要创建您自己的本地扩展，您可以找到一些教程, [haxeflixel 的文章](http://haxeflixel.com/documentation/native-extensions/).

<!-- more -->


#### 简介

[hxcpp](https://github.com/HaxeFoundation/hxcpp) 是 haxe 编译器的后端 C++ 运行时支持, 这包含 头文件, 库 和从 haxe 源码生成可执行文件所需代码. 使用这个库时你需要对不同平台(windows, linux, mac) 重新编译生成静态链接库, 不同平台所依赖的编译器也不同.可以在 toolchain 目录找到这些配置:

```
windows:	MSVC 或 MingW
linux:		GCC
mac:		GCC;需要xcode环境
ios:		GCC;需要xcode环境
android:	NDK
emscripten:		
blackberry:
tizen:
webos:		PalmPDK
```

 * C++ 代码可以先在 neko 平台中快速测试,调整. 最后再以 cpp 的形式 release.

#### 将源码编译为外部库

直接将外部库编译成 静态链接库, 参考 nme-dev 的 readme, 通常只要模仿 xml 文件然后用 hxcpp 编译就完成了. TODO: 应该有更简单的类似于 SWIG 的导出工具, 或者 hxcpp 本身就提供这样的功能只是目前我没有找到.

#### 编译标志

.......

#### 编译元标记

.......

#### CFFI

快速示例: 需要安装 openfl 的 lime 才能做这些.

 * 运行 `lime create extension myext` 快速创建样板文件. lime 属于 openfl 库

	> 这时当前目录将得到一个名为 myext 的示例目录.

	```bash
	cd myext	# 进入到示例目录
	# - - - - - -
	dependencies/	# android java 原生扩展
	ndll/			# 将包含已经编译好了的原生扩展库 
	project/		# C源码
	Myext.hx		# openfl 引用示例, - 文档类
	haxelib.json	# 如果要将这个库上传至 haxelib 
	include.xml		# openfl 引用示例, - 配置
	```

 * 编译 C 源码

	> 查看头文件 `hx/CFFI.h`

	> C 源码的写法请参照 project/common 下的 cpp 文件

	 ```bash
	 cd project
	 haxelib run hxcpp Build.xml	#如windows系统 则在 ndll/windows/ 生成 .ndll 文件	
	 haxelib run hxcpp Build.xml -Dandroid	# 在ndll/android/下 生成 .so 文件
	 haxelib run hxcpp Build.xml -Dandroid -DHXCPP_ARMV7	# armv7 
	
	 # mac 系统
	 haxelib run hxcpp Build.xml -Diphoneos -DHXCPP_ARMV7	#需要 Xcode 环境
	 ```
 
**不使用 openfl** 编译为 cpp 或 neko

 > 例如你想写一个 命令行程序, 

 > 即使是命令行程序也是能引用 ndll lime,虽然没有界面. lime-tools 就是这样一个程序.
 
```haxe
#if neko
import neko.Lib;
#else
import cpp.Lib;
#end
class Test1 {
	public static function main(){
		Sys.println(myext_sample_method(16));
	}
	static var myext_sample_method = Lib.load ("myext", "myext_sample_method", 1);
}
```

```bash
#编译到 hbin 目录中去
haxe -cpp hbin -main Test1
	
#复制 ndll文件到 hbin下 dos
copy ndll\windows\ext.ndll hbin\
```
 
<br />
**使用 openfl** 编译到平台 

 * 需要将 myext 添加到 haxelib 本地库.否则oepnfl在分析 ndll 路径时将出错.
 
	 ```bash
	 #小数点为当前目录
	 haxelib dev myext .
	 ``` 
 
 * 修改 include.xml 将与 android java 的原生扩展相关代码注释掉

	> 因为那些从实现原理上来说属于 NDK JNI.

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	 <!-- inclucde.xml -->
	 <project>
		<ndll name="myext" />
		<!-- dependency name="myext" path="dependencies/android" if="android" / -->
		<!-- android extension="org.haxe.extension.Myext" / -->
	 </project>
	```

 * `project.xml` 和 `Main.hx`
 
	 ```xml
	 <?xml version="1.0" encoding="utf-8"?>
	 <!-- project.xml -->
	 <project>
	  <meta title="TestApp" package="me.lab.test" version="1.0.0" company="R.U.N" />
	  <app main="Main" path="bin" file="TestApp" />
	  <source path="." />
	  <haxelib name="openfl" />
	  <haxelib name="myext" />
	 </project>
	 ```
 
	 ```haxe
	 // Main.hx
	 #if neko
	 import neko.Lib;
	 #else
	 import cpp.Lib;
	 #end
	 class Main {	
		public static function main(){	
			var t = new flash.text.TextField();
			t.text = Std.string(myext_sample_method(16));
			flash.Lib.current.addChild(t);
		}
		static var myext_sample_method = Lib.load ("myext", "myext_sample_method", 1);
	 }
	 ```

 * 编译

	 ```bash
	 lime test project.xml windows
	 lime test project.xml neko
	 lime test project.xml android
	 ```
	
<br />

