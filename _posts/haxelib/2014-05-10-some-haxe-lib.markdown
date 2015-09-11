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

#### 工具

一些常见的工具如 format, hscript 将不在这里列出..

 * **[hxBitcoin](https://github.com/cbatson/hxBitcoin)** the Bitcoin, cryptocurrency and cryptography library for Haxe 

<!-- more -->

 * [haxe-watchify](https://github.com/lucamezzalira/haxe-watchify) 命令行工具, 监测文件是否发生改动,而做相应处理

  - 依赖 python2.7, 从 npm 安装,看上去像是用 haxe 写的 nodejs

 * **[hxparse](https://github.com/Simn/hxparse/)** haxe Lexer/Parser library 词法分析器

 * **[datetime](https://github.com/RealyUniqueName/DateTime)** [Haxe UTC时区处理]({% post_url haxelib/2015-03-17-haxelib-datetime %}#时区处理)

 * [unifill](https://github.com/mandel59/unifill) Shim your code to support Unicode across all platforms.

 * **[dox](https://github.com/dpeek/dox)** API 文档生成	
					
 * [TileCraft](https://github.com/yupswing/TileCraft) Haxe/OpenFL 2.5D Modeling Tool (WIP)

 * [differ](https://github.com/underscorediscovery/differ) A Separating Axis Theorom collision library for haxe

	> 2D ONLY, COLLISION ONLY. No physics here. By design :)
	
 * [HxScout](https://github.com/jcward/hxScout) A free cross-platform Scout alternative, written in Haxe/OpenFL

 * **[tora](https://github.com/HaxeFoundation/tora)** NekoVM Application Server

	> 类似于 php, 用于处理网页动态内容, 我的一个 [nginx + tora:FastCGI](https://github.com/R32/HelloWorld/blob/Older/test/neko-nginx-tora/Nx.hx) 的 demo. 
	
 * [libnoise](https://github.com/memilian/libnoise) This is a haxe port of libnoise, the coherent noise library. The port is almost complete, only the gradient and noise2D utilities are missing.

 * ~~[swhx](https://github.com/filt3rek/swhx)~~ 将 swf 嵌入到 exe,但是这个库已经太旧了, 不如使用 AIR

#### 游戏引擎

haxe LD32游戏示例 : https://github.com/skial/haxe.io/issues/118

haxe LD33游戏示例: http://haxe.io/ld/33/

 * [flambe](https://github.com/aduros/flambe) flash stage3D + html5 2D 游戏引擎

 * [kha](https://github.com/KTXSoftware/Kha) Super portable software dev kit. 超级便携式软件开发包.

  - 我很怀疑, kha 是否真的有这么好的性能 http://themozokteam.com/playground/frameworkstest/

 * **[heaps](https://github.com/ncannasse/heaps)** 使用 stage3D,webGl,openGl, 没有文档

 * [haxeflixel](https://github.com/haxeflixel) 基于 openfl, 全位图游戏引擎, 文档非常完善

 * [haxepunk](https://github.com/HaxePunk)  基于 openfl, 全位图游戏引擎 更简单, 像是个人维护的项目
	
 * [luxe](https://github.com/underscorediscovery/luxe) 

	> for deploying games on Mac, Windows, Linux, Android, iOS and WebGL
	
	> 没有 flash 平台,没有了多余的类,专注于2D游戏引擎. windows 需要 vs 2013

#### extern

这些外部库通常是 js

 * [chrome.extension](https://github.com/tong/chrome.extension)

 * [pixijs-haxe](https://github.com/pixijs/pixi-haxe)

#### UI

 * [haxeui](https://github.com/ianharrigan/haxeui)

	> 使 xml 配置布局, CSS 配置 skin. 但是 css 不小心出错不好查错.

 * **[stablexui](https://github.com/RealyUniqueName/StablexUI)**

	> 基于 xml 配置布局和 skin, 简单,高效 移动UI首选
	
 * [jive](https://github.com/ngrebenshikov/jive) A crossplatform UI framework for Haxe

  - [jive-chart](https://github.com/ngrebenshikov/jive-chart) A chart library for Jive UI

	> 从 demo上看感觉加载慢,而且示例 xml 和相对应的 hx代码挺复杂的,

#### 语言

 * [LuaXe](https://github.com/PeyTy/LuaXe) Lua target for Haxe language

 	> hx-lua 是用于动态解析 lua 代码的, 只适用于 cpp/neko, 而这个库是将 haxe 转换为 lua 代码, 但未

#### 文章

 * (C Style for loops)[http://yal.cc/haxe-some-cleaner-c-style-for-loops/] 使用宏实现 C 样式的循环.

#### 未分类

 * [promhx](https://github.com/jdonaldson/promhx) A promise and functional reactive programming

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
	
 * **[openfl-bitfive](https://github.com/YellowAfterlife/openfl-bitfive)** readme 上写着比 openfl 默认的 **html5后端** 更好.

 * [mcli](https://github.com/waneck/mcli)  to easily create CLI applications [中文说明]({% post_url haxelib/2014-07-06-haxelib-mcli %})
			
 * [hxargs](https://github.com/Simn/hxargs) 简单创建 CLI 程序, 帮助写在自定义的元标签 `@doc` 上.

 * [Cocktail](https://github.com/silexlabs/Cocktail)

	> 解析 简单的 HTML/CSS,并生成各平台,个人感觉这个更像是一个 UI库.	

 * [msignal](https://github.com/massiveinteractive/msignal)

	> A Haxe port of the ActionScript 3 Signals library that leverages Haxe type parameters. Supports AVM1, AVM2, JavaScript, Neko and C++
	> Haxe 是不带事件处理的, 这个库也许是一个好的选译.

 * [mloader](https://github.com/massiveinteractive/mloader)

	> A cross platform Haxe library for loading resources with utilities for queueing and caching requests. Supports AVM2, JavaScript, Neko and C++
	
 * [structural](https://github.com/underscorediscovery/structural) An unencumbered, generic haxe data structures library. 

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





