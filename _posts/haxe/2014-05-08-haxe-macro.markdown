---

layout: post
title:	macro 宏编译 
date:   2014-05-08 10:26:10
categories: haxe

---

宏 是 Haxe 最主要的特性

> 宏可以在编译时通过计算初使化一些值,比如 UI 的配置等等.
> 宏可以扫描资源文件夹,用于自动嵌入文件或者 IDE 智能提示
> 最新的[官网参考](http://haxe.org/manual/macro.html)

<!-- more -->
<br />

### 条件编译

[条件编译 (Conditional Compilation)](http://haxe.org/manual/lf-condition-compilation.html). Haxe 通过使用 `#if #else #elseif #end` 来 **检测编译器标志**, 用于实现 **条件编译**. 严格来说我不应该把 这一节内容放在 宏 这一章

 > defines: 编译标志(Compiler Flag)

 > 编译标志是一个可配置的值, 这些标志通过使用 -D key=value 或只是 -D key 来设置, 未设置 value 默认值将为 1. 

```haxe
#if flash
trace("flash");
#else
trace("other");
#end

// 还可以检测 flash player 版本
#if flash11_4
trace("flash player version >= 11.4"); // 如果目标为flash,且指定的编译版本大于等于 FP11.4 
#end

// 使用运算符检测
#if(haxe_ver > 3.1)
trace("haxe version > 3.1");
#end


// 支持逻辑运算符：&& 和 || ,需要有小括号
#if (neko && debug)
// 只有在当平台为neko并且为debug模式
#end

#if (flash || php)
// flash 或 php 平台
#end

#if js
#error 目前不支持 js 平台
#end

```

在 `#if` 和 `#elseif` 之后的条件允许以下表达式:

 * **重要:** 任意编译标志(haxe-defines)将替换成名字相同的 条件标识符, 如果带 减(-)号,将会 **同时** 生成另一个 带 下划线(_)的标识符

	> **请注意:** `-D some-flag` 将会产生 `some-flag` 和 `some_flag` 二个条件标识符. 但是 `#if` 或 `#elseif` 却**只能识别**带下划线的那一个. 
	> 减号那个需要用引号括起来, 而用引号括起来的标识符却又不能使用一些运算符.
	> 宏方法中 Compiler.getDefine 或 Context.definedValue 能正确识别这二个.

	> 是否Bug? haxe --help-defines 下的 haxe-ver 只能通过 haxe_ver 才能检测得到. 一些其它标志未测试.

	> **结论:** 即使定义标志时为 减(-)号, 但检测编译标志时, 请使用 下划线(_) 替换掉 减(-)号.

 * **重要:** 使用 **haxelib** 时 会生成同库名一样的 条件标识符, 减(-)号问题和上边一样

 * String, Int, Float 常量值可以直接使用, 0值 以及 空字符串 用于表示 false

 * 逻辑运算符 `&&(与), ||(或), !(非)`

 * 条件运算符 `==, !=, >, >=, <=`

 * 圆括号`()`, 用于组合多个表达式

 * 一些个人收集清单

	```
	flash|neko|cpp|js|php|java  : 这种平台相关无需多解释,但是从上边示例可以发现, 还可以指定版本
	```

**同样可以把条件标识符放置在 `@:require` 之后**

`@:require(Compiler Flag [,"custom error message" ])`

如果没有满足 `@:require` 之后的条件标识符, 类名可以访问, 但是 类的所有字段(包括static类型)都不可访问. 

```haxe
@:require(haxe_ver>3.1)
@:require(nodejs, "require haxelib nodejs")
class Foo{
	public var value:String;
	public function new(val:String){
		value = val;
	}
}
```

 
<br />

其它:

 * 编译标记除了用于条件编译,还可以用于传值:

	> 例如 宏函数 只支持常量不支持使用变量传值,这时使用 条件编译标记 来赋值,

	> 然后在代码使用 `haxe.macro.Compiler.getDefine(flag)` 来获得
	
	> 对于 Compiler.define 的定义,只能通过 Context 类下的方法获得

 * 这里假设需定义一个叫 hello 的标记, 并且将 hello 赋值为 world.

	> 命令行编译或者 **.hxml文件** 使用 `-D hello` ,如果需要赋值为world则是 `-D hello=world`

	> flashdevelop 可以在 **项目属性** -> **编译器选项** -> **常规** -> **Directives** 的 **`String[] Array`** 中添加一行 `hello` ,如果需要赋值为world则是 `hello=world`

	> openfl 项目可以在 .xml [配置文件](http://www.openfl.org/documentation/projects/project-files/xml-format/)中添加 `<haxedef name="hello" />`,如果需要赋值为world则为 `<haxedef name="hello" value="world" />`,
	
	> 注意: openfl 项目中设置 flashdevelop 的项目属性会被忽略,只能通过 .xml 文件来配置

	```haxe
	// 测试条件编译标记
	#if hello
	trace("hello");
	#end
	```

<br />


### 宏方法

内容只适用于 haxe 3. 宏相当于一个在编译时运行的 neko 平台.例如: 在编译时输出 `--macro Sys.println('Hello macro!')`

**注意:** 通常应该把宏函数和其它函数分开放在不同文件,否则代码中的很多地方要加上**`#if macro`** 这样的条件编译才能通过编译.

**注意:** 给宏函数传参数时,**参数应该是常量**, 如果传变量只能获得 变量名 不能获得 变量值(因为宏编译时赋值还没发生).

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

 * Expr类型变量, `macro $Expr变量`, 加前缀 $ 就行了,只能出现在 macro 的语句后边

 	> 你应该注意到了,即使宏函数参数声明为 Expr 类型,在调用这个函数时传的值却是 字符串类型.

 	> 如果参数为 Expr 时,编译器会自动转换这些直接常量为 Expr,然后在宏函数内部 这个变量将会是 Expr 类型.

	```haxe
	// trace( tut_param('456') );	=> trace('123456');
	macro public static function tut_param(param:Expr) {

		var str:String = "123"; 
	        
		return macro $v{str} + $param;
	}

	// 这有个复杂的示例:
	// trace( repeat(10,5) )	=>		[10,10,10,10,10]
	macro public static function repeat(e : Expr, eN : Expr) {
		return macro [for( x in 0...$eN ) $e];
	}

	// Tips: 在宏函数体中获得 Expr 的值
	// getValue("hello");	then val = 'hello';
	macro public static function getValue(ep:Expr){
		var val = haxe.macro.ExprTools.getValue(ep)); //或者 using haxe.macro.ExprTools;
		return macro null;
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

### 小抄

```haxe
class Main{
	static public function main(){
		trace( Um.tut_const() );
	}
}

class Um{
	macro public static function tut_const() {
	    return macro "simple";
	}
}
```

如上示例: 当调用 宏方法 Um.tut_const 时, Um.tut_const 的返回值将替换掉 Um.tut_const(), 也就是说 `trace( Um.tut_const() )` 将替换成 `trace("simple")`;


```haxe
class Main {
	
	static function main() {
		var i = 1;
		var j = 2;
		var a = [1, 2];
		
		Um.callMethed(a);
		Um.assign(i);
		Um.noChange(j);
		
		trace(a); // 输出: [1, 2, 77]
		trace(i); // 输出: 88
		trace(j); // 输出: 2 
	}
	
}

class Um{

	macro static public function callMethed(a) {
		return macro $i { haxe.macro.ExprTools.toString(a) }.push(77);
	}
	
	macro static public function assign(i) {
		return macro $i { haxe.macro.ExprTools.toString(i) } = 88;
	}
	
	macro static public function noChange(i) {
		macro $i { haxe.macro.ExprTools.toString(i) } = 99;
		return macro null;
	}
}
```

上边是一个将变量传递给 宏方法的示例(haxe 3.2 推荐使用 Context.getLocalTVars 来获得本地变量,一，而不是通过宏传递)

**注意**: 宏方法 assign 和 noChange 只有返回值不一样, 充分说明了 宏返回值 将替换所 宏调用. 这一概念很重要.

------

 * haxe.macro.ExprTools 类中的 toString 和 getValue 都是常用方法

 * 如何从宏方法返回一个 bytes

	```haxe
	// 源文件 h3d/hxd/res/Embed.hx
	// 先字符串序列化 bytes ,然后 反序列化就行了
 	public static macro function getResource( file : String ) {
		var path = Context.resolvePath(file);
		var m = Context.getLocalClass().get().module;
		Context.registerModuleDependency(m, path);	// 参考 Haxe 命令行, haxe -wait
		var str = haxe.Serializer.run(sys.io.File.getBytes(path));
		return macro hxd.res.Any.fromBytes($v{file},haxe.Unserializer.run($v{str}));
	}
	```
 * macro.MacroType<Const>

	```haxe
	// 在 CastleDB 的 一个示例中, Data.hx 如下:
	package dat;
	
	private typedef Init = haxe.macro.MacroType < [cdb.Module.build("test.cdb")] > ;
	```

 * macro 关键字后可以接任意 haxe 代码. [AST](http://haxe.org/manual/macro.html)	

	```haxe
	// 轻松获得一个类型. 对于宏构建(@:build) 非常有帮助.
	var loaderType = macro : hxd.res.Loader;
	
	
	var method = macro {
		return flash.Lib.current.stage;
	}
	```

### Reification Escaping

The Haxe Compiler allows reification of expressions, types and classes to simplify working with macros. 

The syntax for reification is `macro expr`, where `expr` is any valid Haxe expression.

宏方法小节使用的就是这类语法, 不详写了,[参考](http://haxe.org/manual/macro-reification-expression.html) 相关小节

 * 所有下列 **$引用** 需要必须在 macro 语句后边

 	> `${}` 或 `$e{}`: `Expr -> Expr`

 	> `$a{}` : `Expr -> Array<Expr>`

 	> `$b{}` : `Array<Expr> -> Expr`

 	> `$i{}` : `String -> Expr` 注: 这里的 String 变量名字符串.

 	```haxe
	function main(){
		var abc = 100;
		trace( getIdent() ); // 宏替后将为 trace(abc);
	}
 	macro static function getIdent(i:Expr){
 		return macro $i{"abc"};
 	}
 	```

 	> `$p{}` : `Array<String> -> Expr` 同上. String 指的是变量名.

 	> `$v{}` : `Dynamic -> Expr` 这个应该是使用频率最多的标记.
 
 * haxe 3.1

 	> 字段名 {$name : 1} 

 	> 函数名 function $name(){}

 	> `try/catch` try{e()}catch($name:Dynamic){}

 	```haxe
	class Main {
		macro static function generateClass(funcName:String) {
			var c = macro class MyClass {
				public function new() { }
				public function $funcName() { //函数名
					trace({ $funcName : "was called" }); //字段名
				}
			}
			haxe.macro.Context.defineType(c); // 动态定义的类需要通过定义,外边才可以引用.
    		return macro new MyClass();
    	}

    	public static function main() {
    		var c = generateClass("myFunc");
    		c.myFunc();
    	}
    }
 	```
<br />

#### 宏构建`@:build`

通过宏的方式动态构建 `class` 或 `enum`.

需要理解 AST,以前了解 haxe.macro 包中的所有类. [新参考](http://haxe.org/manual/macro-type-building.html) [参考](http://old.haxe.org/manual/macros/build) 

build宏函数 与 普通的宏函数不一样的地方:

 * 返回的类型不是 `Expr` ,而是 `Array<Field>`. (`haxe/macro/Expr.hx` 文件中定义了 `Field`)

 * build 宏函数内部的 macro.Context 没有 getLocalMethid 和 getLocalVars. 

 * build 宏函数内部的 macro.Context 有方法 getBuildFields()

 * 不是直接调用,而是将元标记 `@:build` 或 `@:autoBuild` 放在一个 `class` 或 `enum` 定义中.




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

	> 例:添加编译标记: --macro include('my.package')

	> openfl 示例: `<haxeflag name="--macro keep('PlayState')" />`

 * 基准测试 / 优化 (Benchmarking / Optimization)

### 其它

	* `Context.unify(t1,t2)` 检测二个类型是否能(统一?),难道是类似于 二个数字的公约数的东西?? **未知**

 	* `Context.follow(t,notRecursion=false)` ,在调用 unify() 之后调用这个方法,提升到 unify ??? **同上**

	```haxe
	using haxe.macro.TypeTools;
	//....
	var t = Context.typeof(macro null); // TMono(<mono>)    
	var ts = Context.typeof(macro "foo"); //TInst(String,[])
	Context.unify(t, ts);
	trace(t); // TMono(<mono>)
	trace(t.follow()); //TInst(String,[])
	```








