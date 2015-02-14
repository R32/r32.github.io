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

<br />

#### 工具

 * **[hxBitcoin](https://github.com/cbatson/hxBitcoin)** the Bitcoin, cryptocurrency and cryptography library for Haxe 

 * **[hxparse](https://github.com/Simn/hxparse/)** haxe Lexer/Parser library

	> haxe 词法分析器

 * **[format](https://github.com/HaxeFoundation/format)** 用于解析各种文件或数据.

 
 * **[datetime](https://github.com/RealyUniqueName/DateTime)** [Haxe UTC时区处理]({%post_url haxe/2014-09-13-tips-on-haxe-2%}#时区处理)


 * **[unifill](https://github.com/mandel59/unifill)** Shim your code to support Unicode across all platforms.

	> neko 以及 cpp 是无法检测中文字符串长度的. 

 * **[hxsl](https://github.com/ncannasse/hxsl)** 但是目前感觉 heaps 库下的 hxsl 才是最新的

	> adobe AGAL . [使用指南](http://haxe.org/manual/hxsl).

 * [hscript](https://github.com/HaxeFoundation/hscript) Parser and interpreter for Haxe expressions

 	> 用于 **运行时** 解析并运行 haxe 代码. hscript 在设计时为了保持更轻量,和容易, 所以对 haxe 代码有限制

 * **[dox](https://github.com/dpeek/dox)**

	> 帮助文档生成器, haxe 官网目前使用这个,而丢弃了以前的文档生成器. [示例: h3d API]({% post_url haxe/2014-05-05-haxe-doc-gen %})

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

	> 类似于 php, 用于处理网页动态内容, 我的一个 [nginx + tora:FastCGI](https://github.com/R32/my-test/blob/master/test/neko-nginx-tora/Nx.hx) 的 demo. 

 * **[promhx](https://github.com/jdonaldson/promhx)** A promise and functional reactive programming

	> 用于流程控制. 普罗米修斯(先知)和响应式编程, 感觉和 msignal 有些像

 * **[openfl-bitfive](https://github.com/YellowAfterlife/openfl-bitfive)**

	> readme 写着比 openfl 默认的 **html5后端** 更好.
	
 * **[mcli](https://github.com/waneck/mcli)** 简单创建 CLI 程序,mcli 可以把 文档注释 通过宏处理变成 相应的帮助,这点非常好.

	```bash
	# 用于字段上元标记
	@:skip						# 避免 public 字段被 宏 解析成 命令参数
	@:msg(string)				# 添加附属的说明, 常用于添加　分隔线
	
	# 用于 注释中的元数据
	@alias <name>				# 别名, 常用于做一个 单字母的别名, 对于单字母可以用一个 -　调用
	@command <name>				# 更改命令的实际名称, 常用于 将 map 字段更名为 D
	@region <string>			# 同 @:msg(string), 注: 换行符 需要有空格字符作参数的 @region
	@key <name>					# 将默认说明用的 key 改为其它字符, 参见下列示例的 var D:Map<String,String>;
	@value <name>				# 同@key, 将默认说明用的 value 改为其它字符, 
	
	# 重要说明 方法 的参数类型可以为 Array<String> 但是参数名必须为 varArgs 或 rest
	# 这个特性常用于 runDefault 方法的参数
	```
	
	```haxe
	/**
	* 类注释将被解析成帮助信息, 比如 copyright 之类的信息
	*/
						// 在编译时,记得加上 -D use_rtti_doc, 如果你使用了 -lib mcli 则不需要做这一步
	@:keep				// 推荐添加, 继承了 CommandLine 可以加上 @:keep 防止被 -dce full 清除 
	class Test extends mcli.CommandLine{
		
		/**
		* 这个参数的帮助信息, 如果命令行中有 --cache 将会使这个变量变为 true
		* 当名字只有一个字母时, 可以使用一个减号(-),这里可以用 -c 来代替 --cache
		* @alias c
		*/
		public var cache:Bool = false;
		
		/**
		×　记住这个标记是加上 类字段上的, 非 public 的字段不需要加这个也会被忽略
		*/
		@:skip
		public var skip:Bool;
			
		/**
		* 支持 map 类型, 
		* 原本为 -D key=value 通过 @key和@value 将显示为 -D property=val
		* @command D
		* @key property
		* @value val
		*/
		public var map:Map<String,String> = new Map();
		
		/**
		* 当调用 --help 或 -h 时将调用这个方法
		* @alias h
		* @region ---------------------------
		**/
		public function help(){
			Sys.println(this.showUsage());
		}
		
		/**
		* 方法接受参数, 参数数量随意
		*/
		@:msg("\n\n=========================")
		public function sum(a:Int, b:Int){
			Sys.println(a + b);
		}
		
						// runDefault 是一个很重要的方法, 常用来接收不带 `-` 的参数
						// 这个方法的参数数量任意, 可以通过 preventDefault() 来禁用这个方法
						// 当 `neko test.n hehe` 时,将输出: typed: hehe
						// 但是 `neko test.n hehe haha` 有二个参数和下边方法定义参数个数不一致，这时只会输出帮助信息
						// 例: neko test.n -D hello=world hehe 或 neko test.n hehe -D hello=world
		public function runDefault(?name:String) {
			if(name != null){
				var stak = new Array<String>();
				for(k in map.keys()){
					stak.push(k + ":" + map.get(k));
				}
				Sys.println("typed: " + name);
				Sys.println("Define: " + stak.join(", "));
			}else{
				this.help();
			}
			
		}
		
		static function main() {
						// 如果是 nodejs, Sys.args() 记得要手动删除命令自身的参数
			new mcli.Dispatch(Sys.args()).dispatch(new Test());
		}
	}
	```
	
	> 注 需要给继承类加上 `@:keep` 否则对应的方法会被清理掉, 注释中的 @alias 会被定义为　简写

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
	
	Future	:	文档太长, 但大概类似于 Promise 之类的东西
	
	Ref		:	感觉没必要. 这个类使用 Vector 的第一个元素存储值.来达到引用效果.
	
	Noise	:	表示空,用于表示一个类型, 示例: 当你操作成功却不需要做任何事情时
				function writeToFile(content:String):Outcome<Noise, IoError>;
				
	Callback	:	abstract Callback<T>(Null<T->Void>) from (T->Void) {}	
	
	CallbackLink:	abstract CallbackLink(Null<Void->Void>){}
	
	CallbackList:	abstract CallbackList<T>(Array<Cell<T>>){}
	```




