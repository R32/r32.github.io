---
layout: post
title:  haxe 语法记录
date:   2014-05-13 12:26:10
categories: haxe
---

一些链接:

 * [Haxe3 迁移指南](http://old.haxe.org/manual/haxe3/migration) 以及 [新特性](http://old.haxe.org/manual/haxe3/features)

 * [编程参考](http://old.haxe.org/doc)

 * [黑魔法](http://old.haxe.org/doc/advanced/magic)

 * [windows-installer 最新的开发版下载](http://hxbuilds.s3-website-us-east-1.amazonaws.com/builds/haxe/windows-installer/haxe_latest.tar.gz)

<!-- more -->

### 最新改动

 * `import.hx`: 注意区别于其它类, 只能允许 import 和 using 语句, 作为项目中默认导入的包, 但是目前 IDE 支持的不好.

	> https://github.com/HaxeFoundation/haxe/issues/1138
	
	> 这样引用默认的包大概是为了可以先将 import.hx 中的包先编译成中间文件??? 不过haxe目前并没有编译成中间文件的东西,所以先不理会这个
	
 * Compiler.keep 的行为发生了改变 https://github.com/HaxeFoundation/haxe/issues/4111

 * haxe.ds.Either 二个类型, 这样可以让一个函数返回二种类型

	```haxe
	typedef MyResult = Either<Error, String>;
	
	var result:MyResult = Left(new Error("something smells"));
	
	var result:MyResult = Right("the answer is 42");
	
	// haxe.ds.Option 注意和 Either 区别
	function foo(i:Int):Option<Int>{
		return i < 0 ? None : Some(i);
	}
	```

 * 处理 extern 类 haxe.extern.EitherType; 和  haxe.extern.Rest;	

	```haxe
	import haxe.extern.Rest;
	import haxe.extern.EitherType;
	
	extern class MyExtern {
		static function f1(s:String, r:Rest<Int>):Void;
		static function f2(e:EitherType<Int, String>):Void;
	}
	
	class Main {
		static function main() {
		MyExtern.f1("foo", 1, 2, 3); // use 1, 2, 3 as rest argument
		MyExtern.f1("foo"); // no rest argument
		//MyExtern.f1("foo", "bar"); // String should be Int
	
		MyExtern.f2("foo");
		MyExtern.f2(12);
		//MyExtern.f2(true); // Bool should be EitherType<Int, String>
		}
	}
	```
 * haxe.Constraints 下的 Function 和 FlatEnum, 用来限制一些动态内型???

  - Function 用于限制类型需要为 函数类型

  - FlatEnum 用来限制 Enum 的类型.

	```haxe
	//....
	var onclick : haxe.Constraints.Function;
	
	// 但是这个就不好理解了, 
	abstract Event<T:Function>(String) from String to String {}
	
	enum Flat {
		A;
		B;
	}

	enum NotFlat {
		F(s:String);
	}

	class Test {
		static function main() {
			test(A); // ok
			test(F("foo")); // Constraint check failure for test.T
		}

		static function test<T:haxe.Constraints.FlatEnum>(t:T) { }
	}
	
	```
	
#### typedef 对性能的影响 

https://github.com/HaxeFoundation/haxe/tree/development/tests/benchs/mandelbrot

```bash
# haxe 3.2 标准, 运行三次取中间值
# 而前边使用的是 class  定义的结构, 后边的 anon 代表使用 typedef 定义的结构,

flash : 11.728 ------ anon: 45.306
js    : 0.6359 ------ anon: 0.6479	# nodejs
js    : 0.8719 ------ anon:	1.2426	# chrome browser
cpp   : 0.7321 ------ anon: 16.614
java  : 低于1秒 ------ anon: 11.		# 低于1秒,有时候为 1 有时候为 0 , 不能显示小数部分
c#    : 0.5050 ------ anon: 6.8803
neko  : 28.201 ------ anon: 19.601  # 运算前期速度还行，越到后边越慢
```

意外的是 neko 中, anon 竟然快于 class 结构, 而且由于 neko 本身就不适合用于 float 计算

### 源码布局

haxe 源码位于 `HaxeToolkit\haxe\std\` 目录之下

 * 各包(文件夹或平台)下有 _std 目录， _std 将会嵌盖 std 的类及方法。

 * 各平台的 Lib 类都提供一些非常有用的方法

 * haxe.ds 包下的类通常为各自平台的源生类现

### 未分类

下边的一些内容也许并不适合于 haxe 的最新版

 * 当在 `build.hxml` 文件中使用 `--each` 时, 需要注意 `haxe {前} build.hxml {后}` 前后的位置是否有受到 `--each` 的影响

 * 泛形, 返回类型或者Void, 参考 haxe.Time 的 measure 方法源码如下: 

	```haxe
	public static function measure<T>( f : Void -> T, ?pos : PosInfos ) : T {
		var t0 = stamp();
		var r = f();
		Log.trace((stamp() - t0) + "s", pos);
		return r;
	}
	
	
	$type(Timer.measure(function(){
		// output: Warning: Void
	}));
	
	$type(Timer.measure(function(){
		return true;
		// output: Warning: Bool
	}));
	```

 * 如果一属性(Property)为(get,set), 那么在 set 中可以不需要给这个属性赋值, 否则需要加上 `@:isVar`

	```haxe
	public var id(get,set):Int;
	function get_id():Int{
		return 100;
	}
	function set_id(v:Int):Int{
		// do something
		// return this.id = v;		// 如果这样做, 则需要加上 @:isVar
		return v;					// good
	}
	```

 * 对于命令行(CLI)程序, 包含有中文字符的文件代码应该为 ansi ,在 dos 中才会正确显示中文.

 * 字面量初使化 Map 的格式为:  `var map = [ 1 => 10, 2 => 20, 3 => 30]`

 * $type(val)　以警告的形式输出值类型, 在编译期这个标记会移除, 但是具有这个标记的表达式会保留

 	> `var i = $type(0);`

 * haxe.Serializer 将任意值序列化成字符串

	> Serializer.run() 除了普通数据或二进制类型,还可以序列化**类实例**,但只能是纯Haxe的类,如果涉及到原生平台方法,将失败.
 
 * Context.resolvePath 除了检索当前项目的目录之外,包含 Context.getClassPath 返回值的所有路径, 这个路径包括 -lib 库目录(JSON文件 指定的目录)及 　haxe/std 等等.

 * 尽量在 `getter/setter` 的方法前添加 `inline` 关键字,如果这些方法不复杂的话.

 * `std` , 例如:当你写一个 叫 `Math` 的类时,可以通过 `std.Math` 调用标准的 `Math`

 * `typedef SString<Const> = String`. http://haxe.org/manual/macro-generic-build.html#const-type-parameter
	
	```haxe
	//这行在 sys.db.Type.hx 文件中.于是可以有如下定义
	var name:SString<10>; // SQL VARCHAR(10)
	```
	
 * flashdevelop -> 项目属性 -> 编译器选项 -> Additional Compiler Options

 	> 例如: `--macro openfl.Lib.includeBackend('native')` 如果 native 使双引号将会出错, 而在 hxml 文件中,单双引号无所谓
	
	> 如果使用了 openfl 在 flashdevelop 上修改项目属性将不会有任何改变.

 * openfl 的 neko 或 cpp 其实可以不带显示窗口的.

 	> 参考 `lime-tools`. `helpers.IconHelper` 中调用 `SVG`
	
 * 函数可选参数, 自动的参数顺序

	```haxe
	function foo(i:Int, ?a:Array<Int>, ?f:Float){
		trace(i,f);
	}
	
	// 	haxe 编译器 将自动为第二个参数填入 null,
	foo(10,0.123); //output => 10, 0.123
	```	

 * **隐藏包名** 当包名(文件夹名称)以 `_` 作前缀时, 代码编辑器不会智能提示出这个包名, 相当于添加了 `@:noCompletion`

 * **重命名导入类名** 通过关键字 `in` 例如: `import pack.path.Cls in ReCls`,

 * ansi code `"A".code` 将会被编译成 65, 注意:只限于单字符

 * field 和 property 的区别, field 是用 var 声明的普通变量, 而 property 是带用 setter/getter 的变量

 * `__this__`  仅适用于 js 或 as , **慎用**

	> 在 haxe 中即使是局部方法, this 的指向永远为其所在的类,而一些如 JS 或 AS 平台却不是这样. `__this__` 必须接在 `untyped` 之后, 以表式目标平台类的 `this`, 可以将下列代码编译成 JS,以区别不同之处.
	
	```haxe
	class Foo {
		var value:String;
		public function new():Void {
			value = "ffffffffffff";
			var obj1 = { callb: function() { trace(this); } };
			var obj2 = { callb: function() { trace(untyped __this__); } };
			
			obj1.callb(); // [object Foo]
			obj2.callb(); // [object global]
		}
		static function main() {		
			new Foo();
		}
	}
	```

 * **初使化静态变量**  `static function __init__(){}`; 
	
	```haxe
	//注意 和 区分直接赋值的先后顺序.
	class Foo{
		
		public static var value:String = "var";
		
		static function __init__(){
			value = "init func";
		}
		
		public function new() {
			trace(value);	
		}
		
		public static function main(){
			new Foo(); // output: var , 说明 __init__ 的赋值比直接赋值要早.
		}								
	
	}
	```
	
 * 泛型构造方法中有 new Some<T>() 这样的创建泛型实例时, 最好加上 `@:generic` 元标记.

	```haxe
	// 如果这个方法是 new Array<T>(),倒是没什么错误, 但是
	// Vector 在实例化时需要 默认类型来填充各单元, 所以不加 @:generic 时将报错,或得到的值不正确
	@:generic function vec<T>(n:T){
		var v = new haxe.ds.Vector<T>(5);
		for(i in 0...5){
			v.set(i, n)
		}
		return v
	}
	```
		
 * `Std.int`: 包括 Math.round,Math.floor,Math.ceil 在处理较大数字时, 将超出Int界限

	> haxe 中 Int(基本上所有平台都是32位) 类型表示的数字范围有限,因此一些库使用 Float(IEEE 64-bit) 来代替
	
	> 对于大的数字,这时应该使用 `Math.ffloor(v:Float):Float` 或 `Math.fceil(v:Float):Float` 来代替上边方法.
	
	> 正确: `(untyped Math.ffloor(Date.UTC(1900, 0, 31)) / 1000)` 先转换成 float 再除 1000
	
	> 错误: `(untyped Math.ffloor(Date.UTC(1900, 0, 31) / 1000))` 先降以 1000 再转成 float

 * **`-dce full`**

 	> 这个编译选项会在打包时清除未引用代码. 默认为 -dce std. 有些时候如:编译成 SWC 时将会是 -dce no
	
	> 所以有时候需要用 `@:keep` 或 `--macro keep` 来防止被 -dce 删除.

	> 当使下边的些语法时,相关地方需要添加 `@:keep` ,这个标记只能用于 类 或 静态字段.

 	> 使用 `Class<Dynamic>` 或 `Class<SomeName>` 作为参数.例如: `Type.createInstance(_customSoundTray, [])` 这样的语法; 最好不要使用这样语法.
	
 * Sys.command 和 sys.io.Process

	> Sys.command 可以执行 dos 命令如 `dir`　和 一些 (WIN + R)可以运行的CLI命令, 而 sys.io.Process 只能运行后者.
	>(注意: 不要运行 cmd 这个命令避免陷入死循环)
	
	> Sys.command 返回 0 表示程序以 exit(0) 的方式正常退出, 非 0 值一般意味着出错, 
	
	> 如果需要获得 CLI 程序的输出值(stdout|stderr) 则应该使用 sys.io.Process. 这二个都会等待 CLI程序**完全运行结束**（我只用 nodejs 的 setTimeout 测试过）.

 * stdout 

  - "\b"(ascii:08 BS) 为退格, "\b" 在 haxe 中会报错.

  - "\r"(ascii:13 CR) 回车,windows上并不换行, 需要LF(10)才将换行.

 * **缓存编译** 绑定目录到指定端口,缓存编译, 这样编译时不必每次都解析所有 .hx 文件,而只会解析修改过的文件

	> 注: 开启这种效果之后有时候会造成 找不到 宏编译成生的字段 的错误, 这时需要重启 flashdevelop,
	> 或者 ` Ctrl+C` 中断命令行绑定, 然后重新绑定.
	
  - 命令行 http://haxe.org/manual/cr-completion-server.html

		> 用一个窗口 绑定当前目录到指定端口:  `haxe --wait 6000`
	
		> 另一个窗口 连接前边绑定: `haxe --connect 6000 --times build.hxml`

  - flashdevelop

		> ![flashdevelop setting](/assets/img/fd_setter_completionServer.png)
		

 * 何时省略参数类型, 未来也许会修正这个 https://github.com/HaxeFoundation/haxe/issues/2548

	```haxe
	class Test {
	    public static function bar (m){		// 这里最好明确 m 的类型如 bar(m:Foo2)
	        m.doIt();
	    }
	    public static function main () {
		// 编译到 cpp 为: m->__Field(HX_CSTRING("doIt"),true)()->__Field(HX_CSTRING("doIt"),true)();
		// 如果 bar(m:Foo2) 则为：	m->doIt();
	        bar(new Foo2());
	    }
	}
	class Foo2{
	    public function new () {}
	    public function doIt():Foo2 {
	        return this;
	    }
	}
	```

 * `haxe.PosInfos` 这个类是一个魔法类, 因为编译器将自动填充它. 你只需要定义就行了, 参看 [Log and Trace Features]({% post_url haxe/2014-03-28-log-and-trace-features %})


#### Flashdevelop

关于 fd 的一些类似于 `$(CompilerPath)` 的变量, 可以在 `项目属性 -> 编译（选项卡） -> 鼠标点开 (编译...)` 就能看到很多值

 * `项目属性 -> 输出(选项卡) -> 平台[下拉菜单]` 选择 hxml, 可用 hxml 来编译

  - 但是这样将不会使用编译缓存, 可以找到 命令行预编译 在 `${output}` 的前边加上 `--connect 6000`

 * 这是一个 fd 的模板源码 https://github.com/Chman/Snowkit-FD


### 遇见的一些错误

 * `Reflect.hasField`

	> 对于类字段这个方法在和 `C++` 相关的平台上会返回 `false`, 需要检测 `Reflect.field` 的返回值是否为 `null` 就行了.


 * 编译 `Nape` 目标为 `neko` 时,报错 `Uncaught exception - std@module_read`.

 	> 通常 `neko` 编绎不能通过,意味着所有基于 `c++` 平台的编绎都将出现异常.

 	```xml
 	<!-- 加入下边这一行将能正常运行 -->
 	<haxeflag name="-dce full" />
 	
 	<!-- optional 可选 -->
 	<haxedef name="NAPE_RELEASE_BUILD" />

 	<!-- 对于 `haxeflixel` 的 demo 如果添加了 `-dce full`,则需要添加下行 -->
 	<!-- 注意下行的 PlayState 为 flixel-demo 示例中的一个类 -->
 	<haxeflag name="--macro keep(null,['PlayState','flixel.system.FlxAssets','flixel.system.ui','flixel.ui'])" />
 	```

 * hscript 使用类似于 for(i in 0...10) 循环时,(最新版的 haxe 可能已经修复了这个问题)

	```bash
	--macro keep('IntIterator')
	```


### 函数绑定

haxe 3.每个方法或函数都有一个 bind 的方法, 用于包装一个函数：

```haxe
function foo(a:Int, b:Int):Int{
	return a+b;
}

// 这个函数将返回一个函数,类型为 Void->Int;
foo.bind(10,20);	

// 上边 bind 相当于
inline function warp():Int{
	return foo(10, 20);
}
```

有时候我们只想固定其中一个值, 则可以使用下划线 `_` 来作为填充值
	
```haxe	
class Bind {
	static public function main() {
		var map = new Map<Int,String>();
		var f = map.set.bind(_, "12");
		$type(map.set); // Int -> String -> Void
		$type(f); // Int -> Void    
		f(1);
		f(2);
		f(3);
		trace(map); // {1 => 12, 2 => 12, 3 => 12}
	}
}
```



#### extern class

用于声明 这个类是外部的,也就是源生平台类, 因此只要提供外部类的各字段以及方法的类型说明就可以了, 不需要写方法体. 下边是一个 JS 端的示例: 你应该注意到了 get_JTHIS 有方法体,

 * 类声明为 extern class

 * 方法没有方法体(特殊除外),以及方法的参数及返回类型必须是显示声明的

```haxe
extern class Math{
    static var PI(default,null) : Float;
    static function floor(v:Float):Int;
}
```

特殊的带有 方法体的 extern class, 但必须为 inline, 这样转接到别的不是同名的方法上. TODO: `@:runtime` 表示什么了?

```haxe
// python/_std/Array.hx
@:native("list")
@:coreApi
extern class Array<T> implements ArrayAccess<T> extends ArrayImpl {
	public var length(default,null) : Int;
	
	private inline function get_length ():Int return ArrayImpl.get_length(this);
	
	//.....
	
	public inline function copy() : Array<T> {
		return ArrayImpl.copy(this);
	}

	@:runtime public inline function iterator() : Iterator<T> {
		return ArrayImpl.iterator(this);
	}

	public inline function insert( pos : Int, x : T ) : Void {
		ArrayImpl.insert(this, pos, x);
	}


	@:runtime public inline function join( sep : String ) : String {
		return ArrayImpl.join(this, sep);
	}

	public inline function toString() : String {
		return ArrayImpl.toString(this);
	}	
}
```

各平台对于 extern class 可能会有一些细节的部分需要注意, 如一些 元标记的使用 以及使用 黑魔法 代码调用原生平台的类或方法



### 单引号

Haxe 中可以用 **单** 或 **双** 引号来包话字符.使用 **单** 引号时可以定义多行字符串,还可以用 `${}` 嵌入一些变量或表达式

```haxe
// 想要输出 $ 需要用 2 个 $$ 符号
var a = 2;
var b = 9;
var muline = '
  line 1 > using $$ and single quotes strings
  line 2 > ${a} x ${b} = ${ a * b }
  line 3 > ......
';
```


### `Dynamic`

http://haxe.org/manual/types-dynamic.html 

Dynamic类型变量可以赋值给其它任何变量, 也可以将任意值赋值给 Dynamic类型变量.

```haxe
// Dynamic类型变量可以赋值给其它任何变量, 因此 被赋值的 json 类型也不明确将为 Unknown<0>
var json = haxe.Json.parse([1,2,3]);
$type(json);	// Unknown<0>(即:Monomorphs)
```

把一个 [匿名结构](http://haxe.org/manual/types-anonymous-structure.html) 赋值给声明为 Dynamic类型变量

 * Parameterized Dynamic Variables

 	```haxe
 	// 通常解析一个结构不明确的 xml 文件时会用到.
 	// xml 的数据全是 String 类型.
 	var att : Dynamic<String> = xml.attributes;
    att.name = "Nicolas";
    att.age = "26";
    //...
 	```
 * [Implementing Dynamic](http://haxe.org/manual/types-dynamic-implemented.html)

 	```haxe
 	class C implements Dynamic<Int> {
    	public var name : String;
    	public var address : String;
	}
	var c = new C();
	var n : String = c.name; // ok
	var a : String = c.address; // ok
	var i : Int = c.phone; // ok : use Dynamic
	var c : String = c.country; // ERROR
	// c.country is an Int because of Dynamic<Int>

	// 参考 haxe.xml.Fast.hx 文件
	// 可以实现接口的 resolve 方法,当访问属性时会自动转接到 resolve 上.
 	```

### 正则表达式

Haxe has built-in support for [**regular expressions**](http://haxe.org/manual/std-regex.html).


### 静态扩展(Static Extension)

使用 `using` 代替 `import` 导入类, haxe 会自动识别被 using 导入类的所有静态方法的第一个参数类型.

通过静态扩展使得 代码：`x.f4().f3().f2().f1()` 比 `f1(f2(f3(f4(x))))` 更直观, 

```haxe
using Main.IntExtender;
class IntExtender {
	static public function triple(i:Int) {
		return i * 3;
	}
}
class Main {
	static public function main() {
		trace(12.triple());
	}
}
```

通常使用 静态扩展的形式在类上增加方法(这样不必修改原来的类), haxe 编译器会自动删除没有调用的方法, 因此不用担心加载过多类.


### enum

haxe 中的 enum 其实和 ocaml 或其它函数式编程语言的 Variants 一样. 并非 C 语言的 enum, 配合 EnumFlags,将 enum 用作于多项选译, 如下描述一个人能说几种语言, .

```haxe
enum Lang{
	EN;
	FR:
	CN;
}
// EnumFlags 的定义
abstract EnumFlags<T:EnumValue>(Int) {}

// 为什么这里的类型 Lang 为 EnumValue
var f = new EnumFlags<Lang>();

// 这个示例显示 如果 Lang 作为类型参数时, 将等于 EnumValue, 只是用来限定包含哪些有字段
var en:Lang = EN;
var fr:EnumValue = FR;

// 而 尖括号(EnumFlags<Lang>) 中的 Lang ,这里是用于表示 类型, 而不是把 Lang 作为值传递
// 任何时候 尖括号中的值都是用来表类型.

var t:Enum<Dynamic> = Lang;	// 或 t:Enum<Lang> = Lang; 这里才是把 Lang 作值传递, 这里和 Class<Dynamic> 那里一致
function foo<T>(eu:Enum<T>):Void {} // foo(Lang);
```

配合 switch , 用于描述抽像的数据类型,感觉像是单项选译, 详情见官方文档.

 > 比如写一个特殊的文件格式解析器时, 可以用 `enum` 标记各字节的抽象意义,使代码更好理解.

 > 参考 `format` 库的和 `data.hx` 以及 下边的 `switch`


对于 `EnumValue` 类型的数据
 
 > `EnumValue` 包含有 :`getName(),getIndex(),getParameters(),equals()`,来自 `haxe.EnumValueTools`.




### `switch`

挺复杂的.参考: [Pattern Matching](http://haxe.org/manual/lf-pattern-matching.html), 如果你了解 Ocaml 或其它函数式编程的话, 那么对 Pattern Matching 应该很熟悉.

 > 匹配总是从顶部到底部. _ 匹配任何字符，所以case _： 相当于 default:

	
```haxe
enum Tree<T> {
	Leaf(v:T);
	Node(l:Tree<T>, r:Tree<T>);
}

// Enum matching
var myTree = Node(Leaf("foo"), Node(Leaf("bar"), Leaf("foobar")));
var match = switch(myTree) {
	// matches any Leaf
	case Leaf(_): "0";
	// matches any Node that has r = Leaf
	case Node(_, Leaf(_)): "1";
	// matches any Node that has has r = another Node, which has l = Leaf("bar")
	case Node(_, Node(Leaf("bar"), _)): "2";
	// matches anything
	case _: "3";
}
trace(match); // 2	

	
// Variable capture
var myTree = Node(Leaf("foo"), Node(Leaf("bar"), Leaf("foobar")));
var name = switch(myTree) {
    case Leaf(s): s;
    case Node(Leaf(s), _): s;
    case _: "none";
}
trace(name); // foo


// Structure matching
var myStructure = { name: "haxe", rating: "awesome" };
var value = switch(myStructure) {
    case { name: "haxe", rating: "poor" } : throw false;
    case { rating: "awesome", name: n } : n;
    case _: "no awesome language found";
}
trace(value); // haxe


// Array matching
var myArray = [1, 6];
var match = switch(myArray) {
    case [2, _]: "0";
    case [_, 6]: "1";
    case []: "2";
    case [_, _, _]: "3";
    case _: "4";
}
trace(match); // 1


// Or patterns  
// 注: 不知道 | 与 , 的区别会有什么不一样,至少 生成的 js 代码是一样的.其它未测
var match = switch(7) {
    case 4 | 1: "0";
    case 6 | 7: "1";
    case _: "2";
}

trace(match); // 1


// Guards
var myArray = [7, 6];
var s = switch(myArray) {
    case [a, b] if (b > a):
        b + ">" +a;
    case [a, b]:
        b + "<=" +a;
    case _: "found something else";
}
trace(s); // 6<=7


// Match on multiple values
var s = switch [1, false, "foo"] {
    case [1, false, "bar"]: "0";
    case [_, true, _]: "1";
    case [_, false, _]: "2";
}
trace(s); // 2


// Extractors . since Haxe 3.1.0
// http://haxe.org/manual/lf-pattern-matching-extractors.html
enum Test {
  TString(s:String);
  TInt(i:Int);
}

class Main {
  static public function main() {
    var e = TString("fOo");
    switch(e) {
      case TString(temp):
        switch(temp.toLowerCase()) {
          case "foo": true;
          case _: false;
        }
      case _: false;
    }
  }
}

// 使用 Extractors(=>) 语法之后为:
enum Test {
  TString(s:String);
  TInt(i:Int);
}

class Main {
  static public function main() {
    var e = TString("fOo");
    var success = switch(e) {
      case TString(_.toLowerCase() => "foo"):
        true;
      case _:
        false;
    }
  }
}
```





### `Class` 

当把一个 `Class` 赋值给一个变量时.实际上不推荐使用这种把类赋值给一个变量的怪异语法.因为当添加 `-dce full` 时很容易引起错误

但是 如果使用 `as3hx` 转换 `AS3` 的源码时,就会经常碰到这样的代码.

```haxe
class Helo{	
	// Class<Dynamic> 
	var t:Class<Dynamic>; //需要指定 Class 类型,比如 Class<Helo>
	public function new(){
		t = Helo;
	}
}

// https://github.com/HaxeFoundation/haxe/issues/3098
// 如果需要赋值 Class, 不要指定变量类型, 否则无法访问静态变量.
```




### 泛型

 * [泛型 (Type Parameters)](http://haxe.org/ref/type_params)  

 * [高级类型(Type Advanced)](http://haxe.org/ref/type_advanced) 
 
 * **有些时候** 需要在使用了`<T>` 的类中,要添加前缀 `@:generic`,比如使用了 `new T()` 这样的代码.

 * 泛型限定 `<T:Foo>`, 将 T 限定为 Foo,

	> 对于 `<T:{prev:T,next:T}>`或 `<K:{ function hashCode():Int;}>` 这样的源码
 
 	> 实际上 `{}` 可以看成匿名类型,然后这个类型只要包含 `prev next` 属性 或 `hasCode` 方法就行了, 分析 `haxe.macro.Type.hx` 的 `Ref`
	
		```haxe
	 	typedef Ref<T> = {
			public function get() : T;
			public function toString() : String;
		}

		// 只要一个类型它包含了 get 及 toString ,就可以看成是 Ref
		``` 




### 元标记(metadata) 

[Tips and Tricks](http://haxe.org/manual/tips_and_tricks)

[全部内建元标记]({% post_url haxe/2014-03-30-commands %})

除了编译器内建的, haxe 允许自定义元标记, 格式为 `@` 字符作前缀(编译器内建的以 `@:` 为前缀, 当然你也能定义以 `@:` 作前缀的元标记, 这只是规范,　并没有强制要求). 例: `@some`. 可以通过 haxe.rtti.Meta 在运行时访问这些元标记内容, 

```haxe
#if !macro @:build(Foo.build()) #end
@author("Nicolas") @debug class MyClass {
	@values( -1, 100) var x:Int;
	
	@hehe
	static var inst:MyClass;
	
	static function main(){
		// 运行时(rtti)访问这些自定义元标记数据, 只能访问自定义的, 不能访问 haxe-metas
		var t = haxe.rtti.Meta.getType(MyClass);	// {author: [Nicolas], debug: null}
		var f = haxe.rtti.Meta.getFields(MyClass);	// {x: {values: [-1, 100]}}
		var s = haxe.rtti.Meta.getStatics(MyClass);	// {inst: {hehe: null}}
	}
}

// 然而大多数情况下 大家都是以　宏 的形式访问元标记以控制编译器的一些形为

class Foo {
	macro public static function build():Array<haxe.macro.Expr.Field>{
		var fields = haxe.macro.Context.getBuildFields();
		
		var t = haxe.macro.Context.getLocalClass().get();
		// 取得 标记于 class 上的元标签, 除了自定义的元标签, 还能取得 haxe-metas, 如 @:require(flash)
		trace(t.meta.get()); 
		
		// 取得一个数组包含所有 静态字段, 通过遍历数组, 然后调用 meta.get() 获得 元标签定义
		var s = t.statics.get();
		
		// 取得一个数组包含所有 实例字段, 通过遍历数组, 然后调用 meta.get() 获得 元标签定义
		var f = t.fields.get();	
		
		//return fields;	如果需要修改则返回这个
		return null; // 返回 null 不作任何修改.
	}	
}
```



### typedef

typedef 象是一种别名的工具.像定义了一个接口,但是不需要写 `implements`,可直接赋值包含有 `typedef` 对象，实现 typedef 定义的方法或属性不能是 inline 类型的

 * typedef 用来定义一种数据结构,包含变量,及方法(没有方法体),也没有 `public` `private` 以及 `static` 这些访问控制

 * 当把 **类实例** 赋值于 `typedef` 定义的类型时, 可以访问 类的 `private` 的方法.

	如上, typedef 像是 C语言 中用 typedef struct 定义的一个数据块. C 中可以强制转换结构指针,同样 Haxe 也用 cast 来强制转换.

 * `typedef struct` 会稍微影响 *静态平台* 的[性能](http://haxe.org/manual/types-structure-performance.html)，但动态平台却没有影响.

 * 如果你想把一个 直接结构量`{x:0,y:0,width:`100}` 赋值给一个变量, typedef struct 是最好的选择了.

	```haxe
	typedef Abc = {
		var name:String;
		function f():Void;
	}

	// 类似于写 接口, 或 extern 类.
	typedef Window = {
		var x:Float;
		var y:Float;
		@:optional var width:Int;
		@:optional var height:Int;
		function exit():Void;
		
	}
	
	// 类似于 JSON 形参一样,
	typedef Window = {
		x:Float,
		y:Float,
		?width:Int,	// 用 ? 替换掉 @:optional var, 而且结尾用 , 号
		?height:Int,
		exit:Void->Void
	}
	var w:Window = {x:0,y:0};	
	``` 

### abstract

abstract 用于抽象化数据结构,用于包装底层类型, 其行为更像是 inline,编译器将作自动替换.

 > 通过添加 `@:enum` 可以使 abstract 类有成员变量. 这时成员变量会 **被当成常量** 处理,或者`getter`

 > 从示例中可以看到,和 `typedef` 的区别是抽象类型是要有原形(小括号Int)的,并且 `abstract` 可以有方法体,和一些类型写类型转换规则

 > 在 abstract 语法内 的 static 成员方法,不需要 using, 见 [abstract-selective-functions](http://haxe.org/manual/types-abstract-selective-functions.html) 这一点对运算符重载很重要, 因为运算符重载有时需要添加 `@:commutative` 来交换二个操作数的位置,就 **必须** 使用 static 类型的方法重载.

	```haxe
	@:commutative @:op(A + B) private static inline function addWithFloat(a:UInt, b:Float):Float {
		return a.toFloat() + b;
	}

	@:commutative @:op(A * B) private static inline function mulWithFloat(a:UInt, b:Float):Float {
		return a.toFloat() * b;
	}
	```


分隔线
------

### haxe.remoting

http://old.haxe.org/doc/remoting

 * Proxy 魔法类,自动包装 Api类的public属性方法, http://old.haxe.org/doc/remoting/proxy

 ```js
 class MyApi extends Proxy<Api>{}
 // 而 Api 类则为另一个端的类, MyApi 将被包装成和 Api 具有一样公共方法的类.
 new MyApi(connection);
 ```

 * Connection

#### Context

"被调用者"将方法绑定在这个类上

 * `addObject( name: String, obj: {}, ?recursive: Bool): Void`

  - name 指定 obj_name

  - obj 任意对象,

  - recursive 是否归递, 默认为 false

 * `call( path: Array<String>, params: Array<Dynamic>): Dynamic`

  - path [obj_name, method], 当数组长度大长 2 时，所对应的 obj recursive 必须为 true, 则 [obj_name, sub_obj, method]

  - params 传递给调用方法的参数.

其实, 应该使用 **ContextAll** 替换这个类.


### List

链表形式, Haxe 中的List 是由包含二个元素的各个数组链接而成,文档称 适用于经常删除和添加元素,而避免复制.从源码上感觉这个List 的实现不太好, 感觉 List 没什么用.不如直接用 Vector 或 Array.

```haxe
var list = new List<Int>();
for(i in 0...5){
	list.add(i);
}
// 往 list 里添加了 0~4, 5个元素后,这里候 list 其实这像这样
h = [0, [1, [2, [3, [4, null]]]]]
q = [4,null]
```

### sys.io.Socket

input或output 默认都是阻塞类型的,

 * `setTimeout(timeout:Float):Void` 设置超时, 

适用于服务器端:

 * `bind(host:Host, port:Int):Void`

 * `listen(connections:Int):Void`

 * `accept():Socket`  accept 默认会阻塞进程, 但是 setBlocking(false) 可以修改阻塞

 * `host():{port:Int, host:Host}` 服务端socket 信息

 * `peer():{port:Int, host:Host}` 连接端socket 信息

适用于客户端:

 * `connect(host:Host, port:Int):Void`


其实使用 vm.net.ThreadServer 就好了...




### FPHelper

最新特性

