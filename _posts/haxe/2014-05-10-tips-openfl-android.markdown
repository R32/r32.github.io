---
layout: post
title:  openfl
date:   2014-05-10 16:03:10
categories: haxe
---

openfl 是建立在 Haxe 上的一个跨平台类库, 提供一套　统一的 API(类似于 AS3 API)以实现同一套代码可以编译成多个平台.

由于 API 基本和 flash API 一致, 如果你是 AS3 开发人员, 打算学习Haxe 强烈建议从 openfl 入手慢慢熟悉.


<!-- more -->

 * 在使用　flashdevelop 开发 openfl 项目时, 应该修改 xml 配置文件, 而不是在 flashdevelop 的项目配置里设置


#### `openfl xml` 配置文件

[openfl xml 配置参考](http://www.openfl.org/documentation/projects/project-files/xml-format/) ,也可以查看 `lime-tools\1,4,0\project\ProjectXMLParser.hx`

 * `swf lib` 跨平台使用 swf 内部的元件
	
	The SWF release on haxelib is compatible with the older openfl-html5-dom backend

	you can use `<set name="html5-backend" value="openfl-html5-dom />` before using `<haxelib name="openfl" />`

<br />


### android

  * android apk 很多情况下也能先以 neko 测试.如果不涉及 java 源生扩展

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
<!-- rename 时需要对应其相应的目录如.才能正确覆盖 -->
<template path="path/AndroidManifest.xml" rename="AndroidManifest.xml" if="android" />
<template path="path/to/GameActivity.java" rename="src/org/haxe/lime/GameActivity.java" if="android" />


<!-- openfl 编译的android 当不是横屏时,在加载时会先显示 ActionBar 然后接着显示 应用 -->
<!-- 似乎在 openfl xml 里没有相应设置,而需要改模板 修改 AndroidManifest.xml  -->
<!-- 在 lime\0,9,7\templates\android\template\ 下复制相应文件到工程文件夹 -->
<!-- 然后在自定义的AndroidManifest.xml 的 activity 标签中添加属性 -->
<activity android:theme="@android:style/Theme.Holo.NoActionBar" >
```


<br />

#### `openfl JNI`

下边示例需要在 openfl项目的 xml 配置文件中用 `<template />` 指定 java 类.

```xml
<!-- 注意 src/com/SampleClassName.java 和 JNI.createStaticMethod 第一个参数对应  -->
<template path="path/to/SampleClassName.java" rename="src/com/SampleClassName.java" if="android" />
```


`(Ljava/lang/String;)V` [签名格式参看](http://blog.csdn.net/freedom2028/article/details/7772141)

 
 * 使用 `openfl.utils.JNI` 能很容易创建 从 Haxe 调用 `android`以及回调.
 
	```as
	// 详细实例参看下边  `textFiled`中文输入.
	class SampleClassName{
		 static var _sampleFunction1 = openfl.utils.JNI.createStaticMethod("com/SampleClassName", "sampleFunction1", "(Ljava/lang/String;Lorg/haxe/lime/HaxeObject;)V", true);
		 
		 static public function sampleFunction1(text:String,obj:Dynamic):Void{
		 	var a = new Array<Dynamic>();
			a.push(text);
			a.push(obj);
			_sampleFunction1(a);
		 }
	 }
	```
 * [更简单的方法](https://github.com/player-03/haxeutils#jniclassbuilderhx)

	```haxe
	// 这个 haxe类 所在的包　要和 java类所在的包一致
	#if !macro @:build(com.player03.haxeutils.JNIClassBuilder.build()) #end
	class SampleClassName {
	    @jni public static function sampleFunction1(var1:String, var2:Dynamic):Void;
	}
	```

 * `NDK` 原生扩展

	> `lime create extension demo`

	>



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

 * `textFiled` 无法中文输入. 只有调用 JNI 的原生输入框解决.[简单示例](https://github.com/R32/my-test/tree/master/test/android-zh-input)

	> [lime 0.9.7] Bug ??? 如果不将 `textField`的 `selectable` 设为 `false`,字符很容易会变成方块


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
	```

 * 调试 `android Log` 

	```bash
	# 这样只输出 trace 的信息
	adb logcat -s "trace"

	# 指定多个 -s
	adb logcat -s "trace" -s "MyActivity"

	# android-sdk/tools/ 创建 虚拟SD卡文件
	mksdcard 512M D:/abc.img
	```  	
 * 当设置 `<window fullscreen="false" />` 时.

	> `android` 平台的 `stage.stageHeight` 仍然和全屏时相等. 没有减去顶栏的高度

	> `ios` 未测

 * 写文件

 	```haxe
 	File.write(SystemPath.applicationStorageDirectory + '/yourpath/filename',true);
 	```

 * 其它的以后再添加....


 <br />