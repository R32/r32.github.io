---
layout: post
title:  使用openfl编译android 小记
date:   2014-05-10 16:03:10
categories: haxe
---

#### 创建 certificate

 * 命令运创建,原链接为:[create certificate]

{% highlight bash %}
#Requires keytool part of the Java JDK (For me found in C:\Development\Java JDK\bin):
keytool -genkey -v -keystore "my_name.keystore" -alias my_name -keyalg RSA -keysize 2048 -validity 10000
{% endhighlight %}	

 * 然后`openfl` `xml` 配置文件

{% highlight xml %}
<!-- 除了if = android,每个属性属性都必须 -->
<certificate path="my_name.keystore" password="1234" alias="my_name" alias-password="1234" if="android" />
{% endhighlight %}

[create certificate]:http://www.openfl.org/archive/community/general-discussion/openfl-android-singing-guide/
<!-- more -->


<br />


#### 版本兼容

`lime 0.9.7` 默认使用 `API9`，`GLES 2.0` 和`ARMv7`,我测试的 oppo r803 属于 `ARMv6`架构,直接编绎将出现不兼容警告:

{% highlight xml %}
<!-- 在 xml 文件中添加下行 -->
<architecture name="armv6" />

<!-- 排除armv7以获得更小的文件尺寸,文件大小将减小一半 -->
<architecture name="armv6" exclude="armv7" />
{% endhighlight %}


<br />


#### 自定义模板

 * 在`xml`文件中配置

{% highlight xml %}
<!-- 替换整个目录. 这时将匹配目录 - templates/android/template -->
<template path="templates" if="android" />

<!-- 如果只想更改单一的一个文件,可以像下边 -->
<template path="path/build.xml" rename="build.xml" if="android" />	
{% endhighlight %}


<br />


#### 其它

 * 一些 `xml` 文件配置

{% highlight xml %}
<!-- 指定版本 -->
<android minimum-sdk-version="9" target-sdk-version="16" />

<!-- 指定为竖屏,其它平台也适用 orientation="landscape" 为横屏 -->
<window orientation="portrait" />

{% endhighlight %}

 * 当丢失焦点时:

{% highlight as %}
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
{% endhighlight %}

 * 其它的以后再添加....