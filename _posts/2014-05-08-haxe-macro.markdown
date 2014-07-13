---

layout: post
title:	宏
date:   2014-05-08 10:26:10
categories: haxe

---

#### 前言

宏主要用于在编译时通过计算初使化一些值,比如 UI 的配置等等.

最新的[官网参考](http://haxe.org/manual/macro.html)


<!-- more -->

### 宏条件编译

这是最常见的和最简单的宏,比 AS3 提供的宏条件编译简单多了.

```haxe
#if flash
trace("flash");
#else
trace("other");
#end

// 指定 flash player 版本
#if flash11_4
trace("flash player version >= 11.4"); // 如果目标为flash,且指定的编译版本大于等于 FP11.4 
#end


// 指定 haxe 编译器版本
#if haxe_310
	trace(" haxe version >= 3.10");
#else
	trace(" haxe version < 3.10");
#end

// 支持逻辑运算符：&& 和 || 
#if (neko && debug)
// 只有在当平台为neko并且为debug模式
#end

#if (flash || php)
// flash 或 php 平台
#end

```

<br />

### 定义条件编译标记

 `-D <var>: define a conditional compilation flag`

 * 条件编译标记 除了用于 宏条件编译,还可以用于传值:

	> 例如 宏函数 只支持常量不支持使用变量传值,这时使用 条件编译标记 来赋值,

	> 然后在代码使用 `haxe.macro.Compiler.getDefine(flag)` 来获得
	
	> 对于 Compiler.define 的定义,只能通过 Context 类下的方法获得

 * 这里假设需定义一个叫 hello 的标记, 并且将 hello 赋值为 world.

	> 命令行编译或者 .hxml 文件使用 `-D hello` ,如果需要赋值为world则是 `-D hello=world`

	> flashdevelop 可以在 **项目属性** -> **编译器选项** -> **常规** -> **Directives** 的 **`String[] Array`** 中添加一行 `hello` ,如果需要赋值为world则是 `hello=world`

	> openfl 项目可以在 .xml [配置文件](http://www.openfl.org/documentation/projects/project-files/xml-format/)中添加 `<haxedef name="hello" />`,如果需要赋值为world则为 `<haxedef name="hello" value="world" />`,
	
	> 注意: openfl 项目中设置 flashdevelop 的项目属性会被忽略,只能通过 .xml 文件来配置

	```haxe
	// 测试条件编译标记
	#if hello
	trace("hello");
	#end

	// 获取值
	var hello:Null<String> = haxe.macro.Compiler.getDefine("hello");
	if(hello == null){
		hello = 'default value';
	}
	trace(hello);
	```

### 宏方法

这个章节的内容,只适用于 haxe 3. 由于之前版本想写个简单的宏方法还是很复杂的,因此 haxe 3 中对宏进行了改进.

**注意:** 通常应该把宏函数和其它函数分开放在不同文件,否则代码中的很多地方要加上**`#if macro`** 这样的条件编译才能通过编译.

**注意:** 给宏函数传参数时,参数只可以是常量,不能是变量.或者 `haxe.macro.Compiler.getDefine(flag)`

 * 最简单, `macro 常量`

	```haxe
	// 示例:    trace( tut_const() );    =>     相当于 trace("simple");
	macro public static function tut_const() {
	    return macro "simple";
	}
	```

 * 使用变量, `macro $v{变量}`, 注意: 变量类型不能为 `Expr` ,只能是简单的数据类型,数组,及 结构对象.

	```haxe
	// 示例:    trace( tut_variable() );    =>     trace("so easy!");
	macro public static function tut_variable() {
		var easy:String = "easy!";
		return macro "so " + $v{ easy };
	}
	// 示例:    trace( tut_array([1,2,3,4,5]) );    =>     trace([1,2,3,4,5,10]);
	macro public static function tut_array(arr:Array<Int>) {
		arr.push(10);
		return macro $v{arr};
	}


	 //注意 ${ 变量 } ,不能是复杂数据类型,下边语句 因为 编译器不知道如何将 Map 类型转换成 Expr
	 macro public static function tut_map() {
		var map:Map<String,String> = new Map<String,String>();
		map.set('desc', 'some msg');
		try{
			return macro $v{map}; // 错误: Unsupported value {desc => "some msg"}
		}catch (err:Dynamic) {
			return macro $v{err};
		}
	}

	```

 * Expr类型变量, `macro $Expr变量`, 加前缀 $ 就行了,但只能出现在 macro 的语句后边

	```haxe
	macro public static function tut_param(param:Expr) {

		var str:String = "123"; 
	        
		return macro $v{str} + $param; // $param 只能出现在 macro 语句后边,否则报错
	}

	// 这有个复杂的示例:
	// trace( repeat(10,5) )	=>		[10,10,10,10,10]
	macro public static function repeat(e : Expr, eN : Expr) {
		return macro [for( x in 0...$eN ) $e];
	}
	```

 * 处理文件.

	> 这只是一个从文件中解析数据的示例.

	> 或者你可以通过 `template` 以及 `haxe.io.File` 来动态将文件数据写成一个 `class`

	```xml
	<?xml version="1.0" encoding="utf-8" ?>
	<root>
	<data lang="zh">
		<user name="小明" phone="123" addr="详细地址描述" />
		<user name="小红" phone="456" addr="不存在" />
	</data>
	<data lang="en">
		<user name="ming" phone="123" addr="expanded address details." />
		<user name="hong" phone="456" addr="..." />
	</data>
	</root>
	```

	```haxe
	// example trace(tut_file("test.xml")) => [{ name : 小明, addr : 详细地址描述, phone : 123 },{ name : 小红, addr : 不存在, phone : 456 }]
	macro public static function tut_file(name:String) {
		var content = sys.io.File.getContent( Context.resolvePath(name) );
		var xml = Xml.parse(content);
		var fast = new haxe.xml.Fast(xml.firstElement());
        
		var ret = new Array<Dynamic>();
    
		for (data in fast.nodes.data) {
			if (data.att.lang == 'zh') {
				for (user in data.nodes.user) {
					var obj:Dynamic<String> = { };    
					for (k in user.x.attributes()) {                        
						Reflect.setField(obj, k, user.att.resolve(k));
					}
				ret.push(obj);
				}
			}    
		}
		return macro $v{ret};
	}	
	```

 * 使用 `Context.parseInlineString` 用于解析字符串代码, 多数ui库,都使用这个方法来预处理 xml 配置文件

	> 这个方法有一定的局限性,通常使用类似的匿名函数，不可以包含 class 这些.

	
	```haxe

	//example: trace(tut_parse());  => {width => 800, lang => zh-CH, note => 测试, sprite => [object Sprite]}
	macro public static function tut_parse() {
		var str = "测试";    // Tip:在单引号字符串中,可以使用 ${变量} 来引用一些变量, 
		var code:String = '
			function() {
				var map = new haxe.ds.StringMap<Dynamic>();
				map.set("note","${str}"); 
				map.set("width", Lib.current.stage.stageWidth);
				map.set("lang", flash.system.Capabilities.language);
				map.set("sprite", new flash.display.Sprite());
				return map;
			}()';
		return  haxe.macro.Context.parseInlineString(code,haxe.macro.Context.currentPos());
	}

	```



### Reification Escaping

The Haxe Compiler allows reification of expressions, types and classes to simplify working with macros. 

The syntax for reification is `macro expr`, where `expr` is any valid Haxe expression.

宏方法小节使用的就是这类语法, 不详写了,[参考](http://haxe.org/manual/macro-reification-expression.html) 相关小节

 * `macro expr`

 	```haxe
	var ex = macro 'hello';
	var ret:String;
	switch(ex.expr){
		case EConst(CString(s)):
			ret = s;
		case EConst(CInt(v)):
			ret = v;
		case EConst(CFloat(f)):
			ret = f;
		case EConst(CIdent(s)): // 标识符,即变量什么的
			ret = s;				
		default:
			throw "Type error";
	}
	trace(ret);
	```

### 宏构建`@:build`

通过宏的方式动态构建 `class` 或 `enum`.

需要理解 AST,以前了解 haxe.macro 包中的所有类. 

[参考](http://old.haxe.org/manual/macros/build)


### 宏高级特性

我并未理解这章全部内容,感觉有些肉容已经过时了.

[参考](http://old.haxe.org/manual/macros/advanced)

 * 可变参数

	> 如果你希望使用可变参数,可以使用 `Array<Expr>` 作为最后一个参数

	```haxe
	macro static function foo(e : Array<Expr>):Expr{
	// ...
	}
	``` 

 * 更可读

	> 大部分宏方法使用 Expr 类型参数并且返回的也是 Expr类型,为了让代码更为可读

	> 你可以使用 `ExprOf<Type>` 来替代 `Expr`

	> 请注意,这只是个提示,如果你查看源码的话会发现其实 `typedef ExprOf<T> = Expr`


 * 成员宏方法

 * 宏 + using

 * Macro-in-macro

 * End-of-compilation generation

 * 使用宏进行编译器配置

	> 编译时使用类似于 `--macro : call the given macro before typing anything else`

	> **注意:** 实际上 `haxe.macro.Compiler` 类中的方法**在代码中**只有 `getDefine` 可用,其它方法只能通过这种型式来调用

	> 例:添加编译标记: --macro haxe.macro.Compiler.include('my.package')

	> openfl 示例: `<haxeflag name="--macro keep('PlayState')" />`

 * 基准测试 / 优化 (Benchmarking / Optimization)








