---
layout: post
title:  haxe编译flash 小记
date:   2014-05-10 15:16:10
categories: haxe
---

#### 使用 `swc`

 * 导出 `haxe` 代码为 `swc` 库. [参看-A] - [参看-B]

{% highlight bash %}
# 导出 com/hxlib 下所有文件
haxe -cp src --macro "include('com.hxlib')" -swf bin/hxlib.swc

# 或者单个文件
haxe -swf bin/hxlib.swc Pipe.hx
{% endhighlight %}

 
 * 在 flash 中使用 `haxe` 导出的 `swc` 库.可能需要初使化见 [参看-A]
	
 * 当平台为 `flash` 时,将 `swc` 库 添加到 `haxe` 中去.
 
 下边示例使用了 `openfl/flash`的 xml 配置.其它可以自行设置相关编绎选项:
{% highlight xml %}
<haxeflag name="-swf-lib" value="pathto/libname.swc" if="flash" />
{% endhighlight %}

[参看-A]:https://github.com/jcward/HaxeSWCExample
[参看-B]:http://haxe.org/manual/swc?lang=cn

<!-- more -->
<br />

#### 自定义 `openfl/flash` `Preloader`
`haxepunk` 库源码有一个很好的示例.

{% highlight xml %}
<app preloader="MyPreloader" />
<!-- 源码中必须能查找得到MyPreloader这个类,也可以指定包名如: -->
<app preloader="com.myname.Preloader" />
{% endhighlight %}

<br />

#### 其它

 当 `haxe` 调用 `flash alchemy` 打包的 `swc` 库时,将会出错,但使用 `-debug` 编绎选项却能通过. [问题#1976](https://github.com/HaxeFoundation/haxe/issues/1976)

 * 一些编绎相关选项参看 [编译-flag](http://haxe.org/doc/compiler) 和 [编译-define](http://haxe.org/manual/tips_and_tricks)



