---
layout: post
title:  Tips on Haxe
date:   2014-05-13 12:26:10
categories: haxe
---

 * [Haxe3 迁移指南](http://old.haxe.org/manual/haxe3/migration) 以及 [新特性](http://old.haxe.org/manual/haxe3/features)

 * [黑魔法](http://old.haxe.org/doc/advanced/magic)

  - 使用这些特殊语法前缀要添加 untyped 否则会报 `Unknown identifier` 错误

  - `untyped` 可以放在整个语句块`{}`前,如函数块之前 参看 `Date.hx`
		
<!-- more -->
#### Tips

 * 对于命令行程序, 文件代码应该为 anti ,dos 中才会正确显示中文.

 * $type

 	> `$type(express)` 是一个类似于`console.warn(typeof(express))`的方法,会在编译时输出警告信息:显示表达式的类型

 * haxe.Serializer

	> Serializer.run() 除了普通数据或二进制类型,还可以序列化**类实例**,但只能是纯Haxe的类,如果涉及到 native 平台方法,将失败.
 
 * 其它

 	> 在 `getter/setter` 的方法前添加 `inline` 关键字,如果这些方法不复杂的话.

 	> `std` , 例如:当你写一个 叫 `Math` 的类时,可以通过 `std.Math` 调用标准的 `Math`

 	> `typedef SString<Const> = String`. 这个表达式相当于 `typedef SString<T> = String`

	
	```haxe
	//这行在 sys.db.Type.hx 文件中.于是可以有如下定义
	var name:SString<10>; // SQL VARCHAR(10)
	```
	
 * flashdevelop -> 项目属性 -> 编译器选项 -> Additional Compiler Options

 	> 例如: `--macro openfl.Lib.includeBackend('native')` 如果 native 使双引号将会出错.

 	> 而在 hxml 文件中,单双引号无所谓
	
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


 * -dce full 

 	> 这个编译选项会在打包时清除未引用代码. 
	
	> 默认为 -dce std. 有些时候如:编译成 SWC 时将会是 -dce no
	
	> 有时候需要用 `@:keep` 或 `--macro keep` 来防止被 -dce 删除.

	> 当使下边的些语法时,相关地方需要添加 `@:keep` ,这个标记只能用于 类 或 静态字段.

 	> 使用 `Class<Dynamic>` 或 `Class<SomeName>` 作为参数.例如: `Type.createInstance(_customSoundTray, [])` 这样的语法; 最好不要使用这样语法.

<br />

#### 遇见的一些错误

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

 * hscript 使用类似于 for(i in 0...10) 循环时

	```bash
	--macro keep('IntIterator')
	```
<br />

#### 函数绑定

Haxe 3 的每个函数都有 `bind` 字段

 > 下划线 _ 这里看起来像是填充值.
	
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

<br />

#### 区分 编译标记 和 编译定义

 如果使用 openfl 的 xml 配置文件能更好的理解 编译标记(haxeflag) 和 编译定义(haxedef)

 haxedef 属于 haxeflag 的 `-D <var>`,因此在 openfl 的 xml 配置文件中

 `<haxedef name="foo" />` 等于 `<haxeflag name="-D" value="foo" />`


<br />

#### 单引号

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

<br />

#### `Null`

```haxe
// 当 想把 null 值赋值给 int 变量时,
var i:Null<Int> = null; 

// 其它**基础类型**需要检测是否为 `null`,声明和上边类似
```

<br />


#### `Dynamic`

[Dynamic 参考](http://haxe.org/ref/dynamic). `Dynamic variables` , `Type Casting` , `Untyped` , `Unsafe Cast` 和 `Dynamic Methods`

把一个 [匿名结构](http://haxe.org/manual/types-anonymous-structure.html) 赋值给声明为 Dynamic 的变量,就像 AS3或JS 的 `{}`,如果 变量没有声明为 Dynamic,则变量类型为 匿名结构,

 * Parameterized Dynamic Variables

 	```haxe
 	// 通常解析一个结构不明确的 xml 文件时会用到.
 	// xml 的数据全是 String 类型.
 	var att : Dynamic<String> = xml.attributes;
    att.name = "Nicolas";
    att.age = "26";
    //...
 	```
 * Implementing Dynamic

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

<br />


#### 正则表达式

Haxe has built-in support for [**regular expressions**](http://haxe.org/manual/std-regex.html).


<br />


#### `openfl xml` 配置文件

[openfl xml 配置参考](http://www.openfl.org/documentation/projects/project-files/xml-format/) ,也可以查看 `lime-tools\1,4,0\project\ProjectXMLParser.hx`

 * `swf lib` 跨平台使用 swf 内部的元件
	
	The SWF release on haxelib is compatible with the older openfl-html5-dom backend

	you can use `<set name="html5-backend" value="openfl-html5-dom />` before using `<haxelib name="openfl" />`

<br />

#### 静态扩展 `Static Extension`

  通过自定义的静态方法,第一个参数类型,然后上下文中使用 `using`

  影响代码可读性：`x.f4().f3().f2().f1()` 比 `f1(f2(f3(f4(x))))` 更直观

  不用担心性能问题, haxe 编译器会很好地处理这个.

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

<br />

#### 对于 [`enum`](http://haxe.org/manual/types-enum-instance.html) 的理解

 像是一种抽像的数据类型,只是用来描述数据结构.

 > 比如写一个特殊的文件格式解析器时, 可以用 `enum` 标记各字节的抽象意义,使代码更好理解.

 > 参考 `format` 库的和 `data.hx` 以及 下边的 `switch`

 对于 `EnumValue` 类型的数据
 
 > 所有 `EnumValue` 都会以 二个大写字母开头.这并不是强制性的
 
 > `EnumValue` 包含有 :`getName(),getIndex(),getParameters(),equals()`,来自 `haxe.EnumValueTools`.

<br />

#### `switch`

Haxe 的 `switch` 表达式还是挺复杂的.参考: [Pattern Matching](http://haxe.org/manual/lf-pattern-matching.html)

 > 匹配总是从顶部到底部。

 > _ 匹配任何字符，所以case _： 相当于 default:

	
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
// ......
```


<br />


#### `Class` 

当把一个 `Class` 赋值给一个变量时.实际上不推荐使用这种把类赋值给一个变量的怪异语法.因为当添加 `-dce full` 时很容易引起错误

但是 如果使用 `as3hx` 转换 `AS3` 的源码时,就会经常碰到这样的代码.

```haxe
class Helo{	
	// Class<Dynamic> 为最通常的作法
	var t:Class<Dynamic>; //需要指定 Class 类型,比如 Class<Helo>
	public function new(){
		t = Helo;
	}
}
```

<br />


#### `Type<T>`

 * [泛型 (Type Parameters)](http://haxe.org/ref/type_params)  

 * [高级类型(Type Advanced)](http://haxe.org/ref/type_advanced) 
 
 	> 描述了 `structure`,`typedef`,`Functions`,`Unknown`,以及 快速扩展 `structure`
 	
 	> 重点为当把**类实例**赋值于 `typedef` 定义的类型时, 可以访问 **类实例** 标记为 `private` 的方法.
 
 * 有些时候需要在使用了`<T>` 的类中,要添加前缀 `@:generic`,比如使用了 `new T()` 这样的代码.

 * 也许会看到 `<T:{prev:T,next:T}>`或 `<K:{ function hashCode():Int;}>` 这样的源码
 
 	> 实际上 `{}` 可以看成类型,然后这个类型只要包含 `prev next` 属性 或 `hasCode` 方法就行了

 	> 分析 `haxe.macro.Type.hx` 的 `Ref`
	
 	```haxe
 	typedef Ref<T> = {
		public function get() : T;
		public function toString() : String;
	}

	// 只要一个类型它包含了 get 及 toString ,就可以看成是 Ref
 	``` 

<br />


#### `General metadata` 

 [Tips and Tricks](http://haxe.org/manual/tips_and_tricks)

[所有元标签 @](http://old.haxe.org/doc/glossary/at)

 ```bash
 Starting from Haxe 3.0 , you can get the list of supported compiler flags by running haxe --help-metas
 ``` 
 * **`@:overload`** 方法重载,只适用于 extern 类

 	> can be used when interfacing an external class method with arguments of different types. You can have several overload declarations, the return type of the first one that is matched will be used. Overload metadata is only useful for extern classes, it is most likely not usable for user-written Haxe classes. A simple example: 

 	```haxe
	extern class JQueryHelper {
		@:overload(function(j:JQuery):JQuery{})
		@:overload(function(j:DOMWindow):JQuery{})
		@:overload(function(j:Element):JQuery{})
		public static inline function J( html : String ) : JQuery {
			return new JQuery(html);
		}
	}
 	```


<br />

#### `typedef` 和 [`abstract`](http://haxe.org/manual/abstracts) 理解

 > `typedef` 用来定义一种数据结构,包含变量,及方法(**没有方法体**),也没有 `public` `private` 以及 `static` 这些访问控制,

 > 所以 `typedef` 定义的类型不可以 `new`(实例化).

 > `typedef` 象是一种别名的工具.像定义了一个 接口,但是不需要写 `implements`,可直接赋值包含有 `typedef` 对象.

 如上, `typedef` 像是 C语言 中用 `typedef struct` 定义的一个数据块. C 中可以强制转换结构指针,同样 Haxe 也用 cast 来强制转换.

 > `typedef struct` 在*静态平台*在[性能](http://haxe.org/manual/types-structure-performance.html)上不如其它静态定义(感觉hxcpp应该改进这个问题)，但动态平台却没有影响.

 > 如果你想把一个 直接结构量`{x:0,y:0,width:100}` 赋值给一个变量, typedef struct 是最好的选择了.

```haxe
typedef Abc = {
	var name:String;
	function f():Void;
}
// 可选字段
typedef Window = { 
	@:optional var width:Int;
	@:optional var height:Int;
	@:optional var x:Float;
	@:optional var y:Float;
}
```


`abstract` 用来抽象化数据结构, 可以用 new 实例化, 可以有方法体,一般情况下不可以有成员变量

 > 改正: 通过添加 `@:enum` 可以使 abstract 类有成员变量.成员变量会被当成常量处理,或者`getter`

 > 从示例中可以看到,和 `typedef` 的区别是抽象类型是要有原形(小括号Int)的,并且 `abstract` 可以有方法体,和一些类型写类型转换规则

 > 从 new 方法体中发现,即然修改 `this`的值,所以`abstract` 更象是编译器帮你自动化了的一些代码,从 'haxe -js' 可以查看得到.

[个人 abstract demo](https://github.com/R32/my-test/blob/master/test/hx-syntax-test/abstract/Source/Main.hx)
```haxe
abstract Bcd(Int){
	inline public function new(i:Int):Void {
		this = i;
	}
}
```

  > `abstract` 是编译器智能帮你完成一些重复和烦琐的定义,配合 `inline` 相当于做了宏替换.

  > 'typedef struct' 只是给匿名结构加个标记而已,估计是因为由于要兼容动态平台,所以静态平台上 'typedef struct' == 'dynamic'


```haxe
typedef Window = { 
	@:optional var width:Int;
	@:optional var height:Int;
	@:optional var x:Float;
	@:optional var y:Float;
}
//...
var w:Window = {x:0,y:0};	
```
<br />