---
layout: post
title:  Tips on Haxe
date:   2014-05-13 12:26:10
categories: haxe
---

#### Haxe 3 Migration

http://old.haxe.org/manual/haxe3/migration


http://old.haxe.org/manual/haxe3/features


<!-- more -->
<br />

#### 对于`-dce full` 和  `@:keep`

为了避免编译时 `-dce full` 产生的错误,需要用 `@:keep` 或 `--macro keep` 来防止被编绎器删除.

当使下边的些语法时,相关地方需要添加 `@:keep`, 

 > 使用 `Class<Dynamic>` 或 `Class<SomeName>` 作为参数.例如: `Type.createInstance(_customSoundTray, [])` 这样的语法;

 > 由于 `-dce full` 的关系,最好不要同时使用 `Class<Dynamic>` 和 `Type.createInstance`.




<br />

#### 区分 编译标记 和 编译定义

 如果使用 openfl 的 xml 配置文件能更好的理解 编译标记(haxeflag) 和 编译定义(haxedef)

 haxedef 属于 haxeflag 的 `-D <var>`,因此在 openfl 的 xml 配置文件中

 `<haxedef name="foo" />` 等于 <haxeflag name="-D" value="foo" />


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

<br />


#### 单引号

Haxe 中可以用**单**或**双**引号来包话字符.使用**单**引号时可以定义多行字符串,还可以用 `${}` 嵌入一些变量或表达式

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


#### 正则表达式

Haxe has built-in support for [**regular expressions**](http://haxe.org/manual/std-regex.html).



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


#### 静态扩展 `Static Extension`

 > 通过自定义的静态方法,第一个参数类型,然后上下文中使用 `using`

 > 影响代码可读性：不是f1(f2(f3(f4(x))))这样的的嵌套调用，而使用链式的调用x.f4().f3().f2().f1()的形式。

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


#### `Dynamic`

[Dynamic 参考](http://haxe.org/ref/dynamic). `Dynamic variables` , `Type Casting` , `Untyped` , `Unsafe Cast` 和 `Dynamic Methods`

 * `Parameterized Dynamic Variables`

 	```haxe
 	// 通常解析一个结构不明确的 xml 文件时会用到.
 	// xml 的数据全是 String 类型.
 	var att : Dynamic<String> = xml.attributes;
    att.name = "Nicolas";
    att.age = "26";
    //...
 	```
 * `Implementing Dynamic`

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


#### `Type<T>`

 * [类型参数(Type Parameters)](http://haxe.org/ref/type_params) 应该叫 **泛型** 才合适

 * [高级类型(Type Advanced)](http://haxe.org/ref/type_advanced) 
 
 	> 描述了 `structure`,`typedef`,`Functions`,`Unknown`,以及 快速扩展 `structure`
 	
 	> 重点为当把**类实例**赋值于 `typedef` 定义的类型时, 可以访问 **类实例** 标记为 `private` 的方法.
 
 * 有些时候需要在使用了`<T>` 的类中,要添加前缀 `@:generic`,比如使用了 `new T()` 这样的代码.

 * 也许会看到 `<T:{prev:T,next:T}>`或 `<K:{ function hashCode():Int;}>` 这样的源码
 
 	> 实际上 `{}` 可以看成类型,然后这个类型只要包含 `prev next` 属性 或 `hasCode` 方法就行了



<br />


#### `abstract`

[抽像类型](http://haxe.org/manual/abstracts): `Implicit cast` , `Opaque types` , `Operator overloading` 和 `Array access overloading`

 * `Opaque types` 需要注意很多地方需要用 `inline` 关键字


<br />


#### `General metadata` 

 [Tips and Tricks](http://haxe.org/manual/tips_and_tricks)

[所有元标签 @](http://old.haxe.org/doc/glossary/at)

 ```bash
 Starting from Haxe 3.0 , you can get the list of supported compiler flags by running haxe --help-metas
 ``` 
 * `@:overload`

 	> can be used when interfacing an external class method with arguments of different types. You can have several overload declarations, the return type of the first one that is matched will be used. Overload metadata is only useful for extern classes, it is most likely not usable for user-written Haxe classes. A simple example: 

 	```haxe
	// 参考 Reflect.makeVarArgs 
	@:overload(function(i:String):Bool{})
	function foo( i : Int ) : Void;
 	```


<br />



#### `openfl xml` 配置文件

[openfl xml 配置参考](http://www.openfl.org/documentation/projects/project-files/xml-format/) ,也可以查看 `lime-tools\1,4,0\project\ProjectXMLParser.hx`

 * `swf lib` 跨平台使用 swf 内部的元件
	
	The SWF release on haxelib is compatible with the older openfl-html5-dom backend

	you can use `<set name="html5-backend" value="openfl-html5-dom />` before using `<haxelib name="openfl" />`

<br />



