---

layout: post
title:  一些类库集合
date:   2014-05-10 9:15:56
categories: haxelib

---

收集的一些 haxe 类库,通常这些库都能在 github 找到.

#### 个人

这一章节,主要收集一些个人Blog或网站, 本来想写在另一篇档案中的. 还是算了.

 * http://haxe.io 主要是一些 haxe 的新闻, 经常能看到一些惊异的东西.

<br />

#### 工具

 * **[hxBitcoin](https://github.com/cbatson/hxBitcoin)** the Bitcoin, cryptocurrency and cryptography library for Haxe 

<!-- more -->

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

	> 响应式编程,用于流程控制. 一个 promise|stream 需要一个或多个 deferred.resolve
	
	> Promise 和 Stream 的最主要的区别是 Promise 只能调用一次 resolve, 而　Stream　能多次,所以 Promise 适用于 初使化和加载资源，而 Stream 可用于类似于事件管理
	
  - Error management

		> 提供许多运行时方法用于错误管理, 如 catchError, errorThen, errorPipe, 参见源码注释
		
		> 通过定义 -D PromhxExposeErrors 可以避免回调方法内部的 throw 被内部捕获, 这个定义能用于调试一些特殊行为
	
  - Event Loop Management

		> consider using more promises and streams to break the update operation up across multiple event loops.
	
  - Promhx Http Class　提供非常类似于 haxe.Http

		```haxe
		var h = new promhx.haxe.Http("somefile.txt");
		h.then(function(x){
			trace(x); // this will be the text content from somefile.txt
		});
		h.request(); // initialize request.
		```
		
  - EventTools 用于适应已经存在的事件系统如 JS 或 Flash, 推荐用 `using using promhx.haxe.EventTools` 引入

		> 注: 由于使用的是 Promise 而非 Stream ,因此只能用于一次性的事件, 感觉是　源码最后一行返回错误

		```haxe
		using promhx.haxe.EventTools;
		//...
		var cur = flash.Lib.current.stage;
        var p = cur.eventStream(cur, 'click');
		p.then(function(e:MouseEvent){trace(e.localX);});
		```
	
  - JQueryTools 同样通过 `using`, 但是这个没有 EventTools 那样的一次性事件错误

		```haxe
		var ts = new JQuery("#target").eventStream('click');
		ts.then(function(e:JqEvent){});
		```
	
  - Macro do-notation  形为上像是操作符重载的东西,无视它
	
  - Detaching Streams 仅限于 Stream

		> 通过 保存 then 方法的返回,之后能解除 

		```haxe
		var ds = new Deferred<Int>();
		var s = ds.stream();
		var s2 = s.then(function(x){
			trace("这个方法不会被调用,因为已经被解除");
		});

		s.detachStream(s2);
		ds.resolve(1);
		```
	
  - Bound Deferreds: As of v 1.08 promhx includes a "DeferredPromise" and "DeferredStream" option. 
	
	```haxe
		static function main() {
		// 声明 Deferred,  which is the writable interface
		var dp1 = new Deferred<Int>();

		// 声明 Promise,  使用 Deferred 实例 作为参数
		var p1 = new Promise<Int>(dp1);
		// var p1 = dp1.promise();			// 可替换上行
		
		// 简单: 当 value 有效时传递 promise ,  Stream 同样
		p1.then(function(x) { trace("delivered " + x); } );
		
		
		// 传递多个 promises 当它们全部有效时.
		// "then" 方法必须匹配　参数类型 及 参数数量 根据 "when" 的参数		
		var dp2 = new Deferred<Int>();
		var p2 = dp2.promise();
		Promise.when(p1, p2).then(function(x, y) { trace(x + y); } );
		
		
		// Stream 有其自已的 "when" 方法, 叫做 "whenever"
		// 注意 返回的 Stream 将随时处理(resolve) *任意一项* 当 stream 参数发生改变
		// 注上: 就是第一次需要 多个 resolve才能触发, 之后 任意一个 resolve 都将触发
		var ds1 = new Deferred<Int>();
		var ds2 = new Deferred<Int>();
		var s1 = ds1.stream();
		var s2 = new Stream(ds2);
		Stream.whenever(s1, s2).then(function(x, y) { trace(x + y); } );
		
		// Stream.whenever 可以混合使用 Stream 和 Promise
		// 注: 虽然文档说可以支持,但下行通过 haxe 编译, 因此是不支持混合的,
		//Stream.whenever(s1, p1).then(function(x, y) trace(x + y));
		
		// "then" 的返回值是另一个 Promise实例, 因此可以　链式调用
		// TODO: 不知道这种 可无返回值的函数是如何定义的 Unknown<0>
		Promise.when(p1, p2).then(function(x, y) { return x + y; } ).then(function(x) { trace(x); } );
		
		
		var dp3 = new Deferred<String>();
		var p3 = dp3.promise();
		
		// pipe 方法让你能手动指示新的 Promise 实例用于链式调用
		// 它能预先存在或在回调方法中创建,  Stream 也同样类似
		// 个人注: pipe 需要返回 Promise|Stream 实例, 而 then 只要返回　值就能自动返回一个新的 Promise|Stream
		// 因此 pipe 似乎没有什么存在的作用???
		Promise.when(p1, p2).then(function(x, y) { return x + y; } )
			.pipe(function(x) return p3)	// 在 pipe 参数方法中返回 promise 实例
			.then(function(x) trace(x));	// 函数接受 dp3.resolve 的值
		
		// 可以很容易捕获错误在指定的回调函数中
		Promise.when(p1, p2).then(function(x, y) { throw "an error"; } )
			.catchError(function(x) { trace(x); } );
		
		// Errors 通过 promise 链传播.
		// 可以重新抛出通过 haxe's try/catch 语法
		// Stream 同样类似
		Promise.when(p1, p2).then(function(x, y) { throw "an error"; return "hello"; } )
			.then(function(x) { trace(x + " world!"); } )
			.catchError(function(x) { 
				try{
					throw(x);	
				}catch(e:String){
					trace('caught a string: ' + e);
				}catch(e:Dynamic){
					trace('caught something unknown:' + e);
				}
			} );
			
		// 回调函数内部的 throw 将会被忽略, 除非定义 -D PromhxExposeErrors
		
		// errorThen 可以在抛出错误之后继续后边的调用链
		// 如果 errorThen 前边的 then 有　返回值, 那么这个 errorThen 也必须有返回值才能匹配
		p1.then(function(x) { throw "-- IfElse --" + x; return "-- If --"; } ).errorThen(function(x) { trace(x); return "-- Else --"; } ).then(function(s) { trace(s); } );		
		
		// Promises 能通过各种状态检测
		
		// 检测 是否已经处理(resolve),(因为 Promise 只能 resolve 一次)
		trace(p1.isResolved());
		
		// 检测　是否 挂起(pending) 操作于下一次循环
		// 有时候　promise 并没有完成 resolve, 
		// 这个发生在 promise 延迟执行(on flash, js) 或处于更新其它 promise 中. TODO: 未理解
		trace(p1.isPending());
		
		
		// Check to see if the promise has completed fulfilling its updates.
		trace(p1.isFulfilled());
		
		// Check to see if a promise has been rejected.  This can happen if
		// the promise throws an error, or if the current promise is waiting
		// on a promise that has thrown an error.
		trace(p1.isRejected());
		
		// finally, resolve the promise values, which will start the
		// evaluation of all promises.
		dp1.resolve(1);
		dp2.resolve(2);
		dp3.resolve('hi');

		// You can "resolve" a stream as well
		ds1.resolve(1);
		ds1.resolve(1);
		ds2.resolve(2);
	}
	```
	
 * **[openfl-bitfive](https://github.com/YellowAfterlife/openfl-bitfive)**

	> readme 写着比 openfl 默认的 **html5后端** 更好.
	
 * **[mcli](https://github.com/waneck/mcli)** 简单创建 CLI 程序,mcli 可以把 文档注释 通过宏处理变成 相应的帮助,这点非常好.

	```bash
	## 用于字段上元标记
	@:skip						# 避免 public 字段被 宏 解析成 命令参数
	@:msg(string)				# 添加附属的说明, 常用于添加　分隔线
	
	## 用于 注释中的元数据
	@alias <name>				# 别名, 常用于做一个 单字母的别名, 对于单字母可以用一个 -　调用
	@command <name>				# 更改命令的实际名称, 常用于 将 map 字段更名为 D
	@region <string>			# 同 @:msg(string), 注: 换行符 需要有空格字符作参数的 @region
	@key <name>					# 将默认说明用的 key 改为其它字符, 参见下列示例的 var D:Map<String,String>;
	@value <name>				# 同@key, 将默认说明用的 value 改为其它字符, 
	
	## 高级 
	# 重要说明 方法 的参数类型可以为 Array<String> 但是参数名必须为 varArgs 或 rest, 这个特性常用于 runDefault 方法的参数
	# Dispatch.addDecoder 可用于添加自定义的 解释器, 必须在 new Dispatch 之前调用, 参看 sample/git/
	# 可以添加 sub command, 记得继承类加 @:keep, 参看 sample/git/
	
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
	
 * [hxargs](https://github.com/Simn/hxargs)

	> 简单创建 CLI 程序, 帮助写在自定义的元标签 `@doc` 上.

 * [Cocktail](https://github.com/silexlabs/Cocktail)

	> 解析 简单的 HTML/CSS,并生成各平台,个人感觉这个更像是一个 UI库.	

 * [msignal](https://github.com/massiveinteractive/msignal)

	> A Haxe port of the ActionScript 3 Signals library that leverages Haxe type parameters. Supports AVM1, AVM2, JavaScript, Neko and C++
	> Haxe 是不带事件处理的, 这个库也许是一个好的选译.

 * [mloader](https://github.com/massiveinteractive/mloader)

	> A cross platform Haxe library for loading resources with utilities for queueing and caching requests. Supports AVM2, JavaScript, Neko and C++

 * [thx.core](https://github.com/fponticelli/thx.core) 

	```
	Set		:  A Set is a list of unique values.
	
	Tuple	:  A Tuple is a value containing multiple values of potentially different types.
	```

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

 * [cleversort](https://github.com/jasononeil/cleversort) Haxe macro for helping to sort arrays based on multiple properties with a very simple syntax 

 * [cereal](https://github.com/submain/cereal) Haxe serialization library for XML,将 haxe 的类序列化为 xml 字符串

 * [casahx](https://github.com/andyli/casahx) 有一些 utils 的工具类,如 StringUtils, 但并不是所有类都是跨平台的

<br />



