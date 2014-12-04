---

layout: post
title:  一些类库集合
date:   2014-05-10 9:15:56
categories: haxelib

---

收集的一些 haxe 类库,通常这些库都能在 github 找到.


<!-- more -->
#### 个人

这一章节,主要收集一些个人Blog或网站, 本来想写在另一篇档案中的. 还是算了.

 * http://haxe.io 主要是一些 haxe 的新闻, 经常能看到一些惊异的东西.

 * http://thx-lib.org [fponticelli](https://github.com/fponticelli)的个人库, 一些有意思的东西

 * http://player03.com [player-03](https://github.com/player-03) 在 openfl 的论坛上还蛮活跃的. 

<br />

#### 工具

 * **[format](https://github.com/HaxeFoundation/format)** 用于解析各种文件或数据.

 * **[dox](https://github.com/dpeek/dox)**

	> 帮助文档生成器, haxe 官网目前使用这个,而丢弃了以前的文档生成器. [示例: h3d API]({% post_url haxe/2014-05-05-haxe-doc-gen %})

 * **[hxsl](https://github.com/ncannasse/hxsl)**

	> 写 adobe AGAL 变得如此简单. [使用指南](http://haxe.org/manual/hxsl).

 * [hscript](https://github.com/HaxeFoundation/hscript) Parser and interpreter for Haxe expressions

 	> 用于 **运行时** 解析并运行 haxe 代码. hscript 在设计时为了保持更轻量,和容易, 所以对 haxe 代码有限制

 * [hx-lua](https://github.com/MattTuttle/hx-lua) Simple lua wrapper in a haxe extension

	> 用于 **运行时** 解析并运行 lua 代码, 因为是通过 hxcpp 调用 c 语言的,因此只适用于 cpp及neko 这二个或相关平台.
					

#### 游戏引擎

 * **[heaps(h3d)](https://github.com/ncannasse/heaps)**

	> 大神的游戏引擎,使用 stage3D,webGl,openGl, 没有文档, 未发布过,但是已经有他自已的几个大游戏使用

 * **[haxeflixel](https://github.com/haxeflixel)**

	> 全位图游戏引擎,社区以及周边都远比 haxepunk 强大

 * [haxepunk](https://github.com/HaxePunk) 全位图

	> 全位图游戏引擎, 比 haxeflixel 更简单, 像是个人维护的项目
	
 * [luxe](https://github.com/underscorediscovery/luxe) **关注**

	> for deploying games on Mac, Windows, Linux, Android, iOS and WebGL
	
	> 目前还处于 alpha 版. 没有 flash 平台,没有了多余的类,专注于游戏引擎. 感觉由于编译速度的原因,上边的 平台除了 WebGL 似乎都不太好调试,

#### UI

 * [haxeui](https://github.com/ianharrigan/haxeui)

	> 使 xml 配置布局, CSS 配置 skin.

	> 感觉官方默认的 CSS 颜色配置并不好看, 1.3.0 版本时, CSS 出错了还不好找错在哪

	> 希望这个库能使用 h3d/h2d 下的 css 解析器来处理 css 解析.

	> 加载和解析的时间比 stablexui 长.

 * **[stablexui](https://github.com/RealyUniqueName/StablexUI)**

	> 基于 xml 配置布局和 skin, 简单,高效 移动UI首选

#### 语言

 * [LuaXe](https://github.com/PeyTy/LuaXe) Lua target for Haxe language

 	> hx-lua 是用于动态解析 lua 代码的, 只适用于 cpp/neko, 而这个库是将 haxe 转换为 lua 代码


 * [nodejs-std](https://github.com/dionjwa/nodejs-std) Some of the Haxe std library for Node.js

 	> haxe 相对于 nodejs 的 库好像不只这一个.


#### 未分类

 * **[tora](https://github.com/HaxeFoundation/tora)** NekoVM Application Server

	> 类似于 php, 用于处理网页动态内容, 我倒是有一个 [nginx + tora:FastCGI](https://github.com/R32/my-test/blob/master/test/neko-nginx-tora/Nx.hx) 的 demo. 

 * **[openfl-bitfive](https://github.com/YellowAfterlife/openfl-bitfive)**

	> readme 写着比 openfl 默认的 **html5后端** 更好.
	
 * **[mcli](https://github.com/waneck/mcli)** 

	> 简单创建 CLI 程序,mcli 可以把 文档注释 通过宏处理变成 相应的帮助,这点非常好.

 * [hxargs](https://github.com/Simn/hxargs)

	> 简单创建 CLI 程序, 帮助写在自定义的元标签 `@doc` 上.

 * [Cocktail](https://github.com/silexlabs/Cocktail)

	> 解析 简单的 HTML/CSS,并生成各平台,个人感觉这个更像是一个 UI库.	

 * [msignal](https://github.com/massiveinteractive/msignal)

	> A Haxe port of the ActionScript 3 Signals library that leverages Haxe type parameters. Supports AVM1, AVM2, JavaScript, Neko and C++
	> Haxe 是不带事件处理的, 这个库也许是一个好的选译.

 * [mloader](https://github.com/massiveinteractive/mloader)

	> A cross platform Haxe library for loading resources with utilities for queueing and caching requests. Supports AVM2, JavaScript, Neko and C++

 * [tink_core](https://github.com/haxetink/tink_core) 

	```
	# 包含几个轻量级工具库. 源码都简单.
	
	
	Pair	:	双, 例如用来给 Map 类型排序,就需要建一个 Array<Pait> 的数组..
	
	Either	:	二者之一,Left(T1)或Right(T2), 用于参数可以接受二种类型,
	
	Lazy	:	abstract Lazy<T>(Void->T), lazy evaluation,
				把一个值包装成 返回这个值的函数, 没必要这么做吧???
	
	Error	:	集合了一些网络错误, 例如: ErrorCode.NotFound == 404
	
	Outcome	:	常用于函数返回值, 用来检测返回值是否出错.OutcomeTools 有一些可用于 using 的方法
				类似于 haxe.ds.Option
				C 语言中常常返回 0, 表示正确, 非 0 值为错误代码
	
	Future	:	这个的文档太长, hehe.
	
	Ref		:	感觉没必要. 这个类使用 Vector 的第一个元素存储值.来达到引用效果.
	
	Noise	:	表示空,用于表示一个类型, 示例: 当你操作成功却不需要做任何事情时
				function writeToFile(content:String):Outcome<Noise, IoError>;
				
	Callback	:	abstract Callback<T>(Null<T->Void>) from (T->Void) {}	
	
	CallbackLink:	abstract CallbackLink(Null<Void->Void>){}
	
	CallbackList:	abstract CallbackList<T>(Array<Cell<T>>){}
	```




