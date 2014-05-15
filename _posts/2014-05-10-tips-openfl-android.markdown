---
layout: post
title:  openfl编译android 小记
date:   2014-05-10 16:03:10
categories: haxe
---

#### 创建 certificate

 * 命令行创建,原链接为:[create certificate]

	```bash
	#Requires keytool part of the Java JDK (For me found in C:\Development\Java JDK\bin):
	keytool -genkey -v -keystore "my_name.keystore" -alias my_name -keyalg RSA -keysize 2048 -validity 10000
	```	

 * 然后`openfl` `xml` 配置文件

	```xml
	<!-- 除了if = android,每个属性属性都必须 -->
	<certificate path="my_name.keystore" password="1234" alias="my_name" alias-password="1234" if="android" />
	```

[create certificate]:http://www.openfl.org/archive/community/general-discussion/openfl-android-singing-guide/
<!-- more -->


<br />


#### 版本兼容

`lime 0.9.7` 默认使用 API9，GLES 2.0 和ARMv7,而很多android 2.3 属于 `ARMv6`架构,直接编绎将出现不兼容警告:

```xml
<!-- 在 xml 文件中添加下行 -->
<architecture name="armv6" />

<!-- 排除armv7以获得更小的文件尺寸,文件大小将减小一半 -->
<architecture name="armv6" exclude="armv7" />
```


<br />


#### 自定义模板

在`openfl xml`文件中配置

```xml		
<!-- 替换整个目录. 这时将匹配目录 - templates/android/template -->
<template path="templates" if="android" />

<!-- 如果只想更改单一的一个文件,可以像下边 -->
<template path="path/build.xml" rename="build.xml" if="android" />
```


<br />


#### 中文显示

 * 显示中文标题名

	```js
	// 在浏览器控制台上粘贴下边代码,并替换'测试' 字符,
	// 将返回的字符串用于xml的 meta 标签.例如: <meta title="\u6d4b\u8bd5" />
	 (function(text){
		var i = 0,len = text.length,ret = [];
		
		len && ret.push('');

		for(; i<len; i+= 1){
			ret.push(String.prototype.charCodeAt.call(text,i).toString(16))	
		}
		return ret.join('\\u');
	})('测试')
	```

 * 显示中文字符,需要设置相关字体为`system/fonts/DroidSansFallback.ttf`

 * `textFiled` 中文输入.

	> 不光是 输入,如果不将 `textField`的 `selectable` 设为 `false`, `[lime 0.9.7]` 很容易把字符变成方块

	> 使用 `android` 原生 `EditText` 来替代 `textField` 输入也是一个很好的方法. [简单示例](https://github.com/R32/my-test/tree/master/test/android-zh-input)


<br />


#### 其它

 * 一些 `xml` 文件配置

	```xml
	<!-- 指定版本 -->
	<android minimum-sdk-version="9" target-sdk-version="16" />

	<!-- 指定为竖屏,其它平台也适用 orientation="landscape" 为横屏 -->
	<window orientation="portrait" />
	```

 * 当丢失焦点时:

	```as
	Lib.current.stage.addEventListener(Event.DEACTIVATE, doSomething);

	private function doSomething (e:Event) {
		trace('Bye');
		//you could turn off the music
		//pause game
		//or reduce fps to 1: Lib.current.stage.frameRate = 1;
		//or save anything
		Lib.current.stage.removeEventListener(Event.DEACTIVATE, doSomething);
		Lib.current.stage.addEventListener(Event.ACTIVATE, doAnotherThing);
	}

	private function doAnotherThing (e:Event) {
		trace('Hello');
		//you could turn on the music
		//unpause game
		//or reput fps to regular;
		Lib.current.stage.removeEventListener(Event.ACTIVATE, doAnotherThing);
		Lib.current.stage.addEventListener(Event.DEACTIVATE, doSomething);
	}

 * 调试 `android Log` 

	```bash
	# 这样只输出 trace 的信息
	adb logcat -s "trace"

	# 指定多个 -s
	adb logcat -s "trace" -s "MyActivity"
	```  	

 * 其它的以后再添加....