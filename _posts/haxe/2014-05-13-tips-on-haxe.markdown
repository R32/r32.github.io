---
layout: post
title:  haxe 语法日志
date:   2014-05-13 12:26:10
categories: haxe
---

一些链接:

[编程参考-旧文档](http://old.haxe.org/doc)

[黑魔法-旧文档](http://old.haxe.org/doc/advanced/magic)

在编译时可以不指定 `-main`, 例: `haxe -js lib.js MyClass`, 但只可以指定一个类.

当 `-dce std` 时, 使用 import 可能会使最终输出文件变得很大(使用某一个类一个方法时,可以直接用全名), 因此你可能需要关闭 IDE 的自动导入（Generate Imports）

如果一个 .n 文件是以 haxelib run 来运行的, 那么可以通过检测环境变量 `HAXELIB_RUN` 的值是否为字符串 "1", [更多细节...](http://lib.haxe.org/documentation/using-haxelib/#run)

<!-- more -->

### 编译

直接使用 "git haxe repo" 作为 haxe 的路径，由于 haxelib 目前依赖于 neko, 因此 neko 也要装上.

* 设置二个环境变量 : `HAXEPATH: D:\fork\haxe\`, `NEKO_INSTPATH: G:\HaxeToolkit\neko`,

* `make haxe -f Makefile.win -j4 FD_OUTPUT=1 ADD_REVISION=1`: 获得 windows 平台下的 haxe.exe

  > `make libs`: 第一次执行上边命令前, 你可能需要先运行这个, 以获得外部库
  >
  > windows 中, haxe.exe 所依赖的 dll 文件可以在 `i686-w64-mingw32\sys-root\mingw\bin` 中找到

* `make haxelib` 以获得 haxelib.exe, 这会在 exe 所在目录创建一个名为 "lib" 的目录，

  > 或者通过运行 `haxelib config XXX`  指定一个库目录


### 最新改动

一些内容通过参考 [CHANGES](https://github.com/HaxeFoundation/haxe/blob/development/extra/CHANGES.txt) 文件

在 twitch 上看直播时, 发现在可以在函数加 `@:debug.display` 然后在 output 窗口会有一些信息.

* keyValue 迭代器(KeyValueIterator)

  ```haxe
  for(key => value in map) {
    trace(key, value);
  }
  // 不是所有数据类型都有 KeyValueIterator,
  // 不是所有平台都会优化(如果无优化, 那么这个特性可以说毫无优势)
  ```

* `utf16`: [#7387](https://github.com/HaxeFoundation/haxe/pull/7387) 表示其字符串编码为 ucs2,

  > 注意对于 eval, 其底层虽然为 UTF8(通过 RawNative 的格式写入到 Bytes 内), 但其字符串 API 的形为却与 ucs2 一致
  >
  >`target.unicode`: [#8244](https://github.com/HaxeFoundation/haxe/pull/8244), 感觉和上边有些混淆

* 一些可以通过 `#if (target.XXXX)` 来检测的 Define, [init_platform](https://github.com/HaxeFoundation/haxe/blob/development/src/context/common.ml#L528)

  `(target.name)` : 定义了 当前目标的名字. 例如: js, lua
  `(target.static)` 中 `static` : 表示使用了静态类型, 即变量有自己的类型. 为假(即动态类型)的有: JS, Lua, Neko, Php, Python, Eval
  `(target.sys)` 或 `sys` : 表示可以调用系统 IO, 为假的有 js(不包括hxnodejs), flash
  `(target.utf16)` 或 `utf16` : 见前边
  `(target.unicode)` : 表示当用 `haxe.iterators.StringIteratorUnicode` 是否能正确输出 ucs2 值, 只有 neko, cpp 为假
  `target.threaded` : 目标是否支持多线程

* `@:native("")` 仅适用于 extern 类. 可以使用它来标注全局函数, [#6448](https://github.com/HaxeFoundation/haxe/issues/6448)

* `enum abstract` 自动赋值, 但不可用于 `extern` 类型的枚举. (注: haxe 4 版, 可以直接使用 `enum abstract` 代替 `@:enum abstract` 来创建枚举值.)

  ```haxe
  enum abstract IType(Int) {
    var A;      // 0
    var B;      // 1
    var C = 5;  // 5
    var D;      // 6
  }
  // 字符串的也可以自动
  enum abstract SType(String) {
    var Head;   // "Head"
    var Body;   // "Body"
  }
  ```

* 新的函数类型声明, 允许带参数名字: 例如: `var func: (name: String, ?number: Int) -> Void`

* `haxe.macro.CompilationServer` 可以用来加速编译，通过调用 `--macro server.XXX` 来调用这个类下的字段。

  ```bash
  # 更多细节在这里: https://github.com/HaxeFoundation/haxe/pull/5700
  --macro server.setModuleCheckPolicy(['DefaultAssetLibrary'], [CheckFileContentModification])
  # 通知编译器不再监视指定包内的文件
  --macro server.setModuleCheckPolicy(['flash', 'openfl', 'flixel', 'lime', 'haxe'], [NoCheckShadowing], true)
  ```

* `-D old-error-format`: 如果你使用 flashdevelop 应该加上这个. 使用 vscode 则不要加.

* 类似于 `Foo.js.hx, Foo.hl.hx` 文件都可以定义同一个名为 Foo 的类, 用于跨平台实现某一个类, 而不需要写条件检测。

  > 似乎根本没提起过?

* 优化器目前默认处于关闭状态, 你需添加编译参数 `-D analyzer-optimize` 来开启它。(**推荐开启**)

* `import haxe.extern.AsVar`: 用于方法的参数类型, 传递给方法的实参将会先赋值给临时变量，再传递到方法上.

  或者是抽象类, 可以添加 `@:analyzer(as_var)`

  ```haxe
  @:analyzer(as_var) abstract Ptr(Int) to Int {
    public inline function new(i:Int) {
        this = i;
    }
  }
  ```

* `Any` 类型的引入，<https://github.com/HaxeFoundation/haxe-evolution/blob/master/proposals/0001-any.md>

  ```haxe
  var d:Dynamic = 1;
  d.charCodeAt(0)  // 编译器无法检测这行的正确性, 但运行时一定会出错
  var a:Any = 1;
  d.charCodeAt(0); // 编译器不允许访问 Any 类型的 filed
  if ((a is String))
  	(d:String).charCodeAt(0) // 除非强制转换成 String
  ```

* `is` 操作符，必须和小括号一起使用，其实和 Std.is 是一样的, 所有几乎没有人使用

* `haxe.MainLoop` 的引入 <https://github.com/HaxeFoundation/haxe/pull/5017>

* `@:resolve` 可用于 abstract 类, 这样当你访问不存在的字段时, 将自动转到 resolve 方法上 `#3753`

  ```haxe
  private abstract A(Map<String, String>) from Map<String, String> {
  	@:resolve function resolve(name:String) {
  		return this[name];
  	}
  }
  // resolve 原本只是用于 `implements Dynamic<T>`
  ```

* `extern clsss` 不知从什么时候起也允许有函数体了, 这样的话更方便JS模块化编程

* `extern` 现在可以用在 abstract 类以及 @:enum abstract上了. [#4862](https://github.com/HaxeFoundation/haxe/issues/4862)

  ```haxe
  @:native("http_status")
  @:enum extern abstract HttpStatus(Int) {
      var Ok;
      var NotFound;
  }
  ```

* `-D dump=pretty`: 获得更易读的 dump

* `@:structInit`: <https://github.com/HaxeFoundation/haxe/issues/4526>

  ```haxe
  @:structInit class MyStruct {
      public var a:Int;
      public var b:String;
      public inline function new(a,?b) {
      this.a = a;
      this.b = b;
    }
  }
  // would allow to be initialized with:
  var m1 : MyStruct = { a : 0 };
  var m2 : MyStruct = { a : 0, b : "hello" };
  ```

* `import.hx`: 注意区别于其它类, 只能允许 import 和 using 语句, 作为项目中默认导入的包, 但是目前 IDE 支持的不好.

  > https://github.com/HaxeFoundation/haxe/issues/1138
  >
  > 这样引用默认的包大概是为了可以先将 import.hx 中的包先编译成中间文件??? 不过haxe目前并没有编译成中间文件的东西,所以先不理会这个

* Compiler.keep 的行为发生了改变 https://github.com/HaxeFoundation/haxe/issues/4111

  > `@:keep` only has an effect if the type is actually compiled to begin with. The compiler doesn't eagerly read all your .hx files, so you have to make sure the types in question are referenced somewhere. This can be done in code or via command line: For single classes you can just specify their path (without -main), for entire packages you can use `--macro include("package.path")`.

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

* haxe.Constraints 下的的类基本都是一些 **类型限制**
  - Function 用于限制类型需要为 函数类型
  - FlatEnum 用来限制 Enum 的类型.


  ```haxe
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

  - `Constructible<T>` ???用于参数类型, 表示为一个可实例化的类型

  ```haxe
  private class A {
  	public function new() {}
  }

  @:generic
  private class B<T:haxe.Constraints.Constructible<Void->Void>> extends A {
  }

  class Issue4457 extends Test
  {

  	public function test()
  	{
  		new B<A>();
  	}

  }
  ```

  - `interface IMap<K,V>`


* 转义字符串, haxe 识别的转义字符有限, 如仅能识别 "\n", "\t" 之类的, 但可使用 `"\000"`(八进制) 或 `"\x00"`(十六进制) 或 `"\u4E2D"`

 > 可参考 [ast.ml](https://github.com/HaxeFoundation/haxe/blob/development/src/syntax/ast.ml) 中 `unescape` 的实现


#### typedef 对性能的影响

<https://github.com/HaxeFoundation/haxe/tree/development/tests/benchs/mandelbrot>

```bash
# haxe 3.2 标准, 运行三次取中间值
# 而前边使用的是 class  定义的结构, 后边的 anon 代表使用 typedef 定义的结构,

flash : 11.728 ------ anon: 45.306  # flash player debug, 非 debug 的能提升到 5 秒内
js    : 0.6359 ------ anon: 0.6479	# nodejs
js    : 1.2219 ------ anon:	1.2426	# chrome browser js 平台基本一致
cpp   : 0.6921 ------ anon: 16.614
java  : 低于1秒 ------ anon: 11.		# 低于1秒,有时候为 1 有时候为 0 , 不能显示小数部分
c#    : 0.5050 ------ anon: 6.8803
neko  : 28.201 ------ anon: 19.601  # 运算前期速度还行，越到后边越慢
```

意外的是 neko 中, anon 竟然快于 class 结构, 而且由于 neko 本身就不适合用于 float 计算

### 源码布局

haxe 源码位于 `HaxeToolkit\haxe\std\` 目录之下

* 各包(文件夹或平台)下有 _std 目录， _std 将会嵌盖 std 的类及方法。

* 各平台的 Lib 类都提供一些非常有用的方法

* haxe.ds 包下的类通常为各自平台的源生类现, ds 指的 data struct

### 未分类

下边的一些内容也许并不适合于 haxe 的最新版

* `Context.getPosInfos` 这个方法可以轻松获得相对应的文件路径(这样就可以根据这个路径获得相对应的固定path)
  - 如 [closure 中的...](https://github.com/back2dos/closure/blob/master/src/closure/Compiler.hx)
  - 但是这个仅适用于将这个库作源码, 如果做成了App(.exe或.n)还是得用 haxelib path 来定位

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
  //  do something
  //  return this.id = v;  // 如果这样做, 则需要加上 @:isVar
      return v;             // good
  }
  ```

* 字面量初使化 Map 的格式为:  `var map = [ 1 => 10, 2 => 20, 3 => 30]`

* $type(val)　以警告的形式输出值类型, 在编译期这个标记会移除, 但是具有这个标记的表达式会保留

  `var i = $type(0);`

* haxe.Serializer 将任意值序列化成字符串

  > Serializer.run() 除了普通数据或二进制类型,还可以序列化**类实例**,但只能是纯Haxe的类,如果涉及到原生平台方法,将失败.

* Context.resolvePath 除了检索当前项目的目录之外,包含 Context.getClassPath 返回值的所有路径, 这个路径包括 -lib 库目录(JSON文件 指定的目录)及 　haxe/std 等等.

* 尽量在 `getter/setter` 的方法前添加 `inline` 关键字,如果这些方法不复杂的话.

* `std` , 例如:当你写一个 叫 Math 的类时,可以通过 std.Math 调用标准的 Math

* `typedef SString<Const> = String`. <http://haxe.org/manual/macro-generic-build.html#const-type-parameter>

  ```haxe
  //这行在 sys.db.Type.hx 文件中.于是可以有如下定义
  var name:SString<10>; // SQL VARCHAR(10)
  ```

* **隐藏包名** 当包名(文件夹名称)以 `_` 作前缀时, 代码编辑器不会智能提示出这个包名, 相当于添加了 `@:noCompletion`

* **重命名导入类名** 通过关键字 `in` 例如: `import pack.path.Cls in ReCls`,

* ansi code `"A".code` 将会被编译成 65, 注意:只限于单字符

* field 和 property 的区别, field 是用 var 声明的普通变量, 而 property 是带用 setter/getter 的变量

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

* 泛型构造方法中有 new Some<T>() 这样的创建泛型实例时, 除了 JS 之外, 最好加上 `@:generic` 元数据.

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
* 常量作为类型参数, 由于没什么作用, 这项功能可能会被弃用

  ```
  @:generic              // 这个必须要加上，由编译器处理类似于 templates 的东西.
  class Foo<@:const A> { // 使用 @:const 标记常量
    public function new() {
        var a = new haxe.ds.Vector<Int>((A: Dynamic)); // (haxe bug. 才需要这样处理)
    }
  }
  ```


* `Std.int`: 包括 Math.round, Math.floor, Math.ceil 在处理较大数字时, 将超出Int界限

  > haxe 中 Int(基本上所有平台都是32位) 类型表示的数字范围有限,因此一些库使用 Float(IEEE 64-bit) 来代替
  >
  > 对于大的数字,这时应该使用 `Math.ffloor(v:Float):Float` 或 `Math.fceil(v:Float):Float` 来代替上边方法.
  >
  > 正确: `(untyped Math.ffloor(Date.UTC(1900, 0, 31)) / 1000)` 先转换成 float 再除 1000
  >
  > 错误: `(untyped Math.ffloor(Date.UTC(1900, 0, 31) / 1000))` 先降以 1000 再转成 float

* Sys.command 和 sys.io.Process

  > Sys.command 可以执行 `dos/bash` 自带的命令如 `dir` 和控制台程序, 而 sys.io.Process 只能运行后者.
  >
  > Sys.command 返回 0 表示程序以 exit(0) 的方式正常退出, 非 0 值一般意味着出错,
  >
  > 如果需要获得 CLI 程序的输出值(stdout | stderr) 则应该使用 sys.io.Process.

* stdout

  - "\b"(ascii:08 BS) 为退格, "\b" 在 haxe 中会报错.

  - "\r"(ascii:13 CR) 回车,windows上并不换行, 需要LF(10)才将换行.

* **缓存编译** 绑定目录到指定端口,缓存编译, 这样编译时不必每次都解析所有 .hx 文件,而只会解析修改过的文件

  > 注: 开启这种效果之后有时候会造成 找不到 宏编译成生的字段 的错误, 这时需要重启 flashdevelop,
  >
  > 或者 ` Ctrl+C` 中断命令行绑定, 然后重新绑定.

  - 命令行 http://haxe.org/manual/cr-completion-server.html

    > 用一个窗口 绑定当前目录到指定端口:  `haxe --wait 6000`
    >
    > 另一个窗口 连接前边绑定: `haxe --connect 6000 --times build.hxml`

#### vscode

<https://github.com/vshaxe/vshaxe/wiki/>

#### Flashdevelop

一些快速设置:

* HaxeContext - `Completion Mode`: **CompletionServer** (强烈推荐)缓存编译以加速编译速度(只编译有修改过文件)

* 格式化 - `Trim Trailing Whitespace`: **True**, 当保存代码时将自动清除空行用行尾的空格字符

* 缩进 - `Coding Style Type`: **BracesOnLine**, (个人喜好)将 `{` 放在行尾,而不是另起一行

* 缩进 - `Comment Block Indenting`: **NotIndented**, (个人喜好) 注释换行时的 `*` 不缩进

* HaxeContext - `Generate Imports`: 关闭自动导入(import)

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

各平台对于 extern class 可能会有一些细节的部分需要注意, 如一些 元数据的使用 以及使用 黑魔法 代码调用原生平台的类或方法


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


### Dynamic

<http://haxe.org/manual/types-dynamic.html>

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
>
> 参考 `format` 库的和 `data.hx` 以及 下边的 `switch`

对于 `EnumValue` 类型的数据

> `EnumValue` 包含有 :`getName(),getIndex(),getParameters(),equals()`,来自 `haxe.EnumValueTools`.




### switch

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


### Class

当把一个 Class 赋值给一个变量时.实际上不推荐使用这种把类赋值给一个变量的怪异语法.因为当添加 `-dce full` 时很容易引起错误

但是 如果使用 as3hx 转换 AS3 的源码时,就会经常碰到这样的代码.

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

* `@:generic` 的使用参考 <http://haxe.org/manual/type-system-generic.html>, 注意加不加这个元数据生成的代码有什么不一样.

* 类型限定 `<T:Foo>`, 将 T 限定为 Foo,

  > 对于 `<T:{prev:T,next:T}> 或 <K:{ function hashCode():Int;}>` 这样的源码, 可以把 `{}` 看成 typedef 定义的类型。


* 类型多个限定, 参考下边示例, T 必须 **同时满足** `Iterable<String>, 和 Measurable`

  ```haxe
  static function test<T:(Iterable<String>, Measurable)>(a:T) {
  }
  ```

### metadata

[Tips and Tricks](http://haxe.org/manual/tips_and_tricks)

[全部内建元数据]({% post_url haxe/2014-03-30-commands %})

除了编译器内建的, haxe 允许自定义元数据, 格式为 `@` 字符作前缀(编译器内建的以 `@:` 为前缀, 当然你也能定义以 `@:` 作前缀的元数据, 这只是规范,　并没有强制要求). 例: `@some`. 可以通过 haxe.rtti.Meta 在运行时访问这些元数据内容,

```haxe
#if !macro @:build(Foo.build()) #end
@author("Nicolas") @debug class MyClass {
	@values( -1, 100) var x:Int;

	@hehe
	static var inst:MyClass;

	static function main(){
		// 运行时(rtti)访问这些自定义元数据, 只能访问自定义的, 不能访问 haxe-metas
		var t = haxe.rtti.Meta.getType(MyClass);	// {author: [Nicolas], debug: null}
		var f = haxe.rtti.Meta.getFields(MyClass);	// {x: {values: [-1, 100]}}
		var s = haxe.rtti.Meta.getStatics(MyClass);	// {inst: {hehe: null}}
	}
}

// 然而大多数情况下 大家都是以　宏 的形式访问元数据以控制编译器的一些形为

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

“抽象类”, 比如你可以把一个 Float 类型 **想象成(抽象成)** DateTime 类型，使得代码更可读。
看上去像是使用 `typedef` 定义了一个别名， 但不同的是抽象类可以在这个别名上添加各种方法， 绝大多数情况下
这些方法都为 inline 类型， 因为编译器在底层只是将抽象类做一些名字替换而已。例:

```haxe
@:analyzer(no_const_propagation)   // 这个参数是防止编译器对常量优化
class Main {
	static public function main() {
		var s = new Score(61);
		trace(s.pass());
	}
}

// 这里小括号中的类型 Int, 我们称之为: 底层类型(underlying type)
abstract Score(Int){
	inline public function new(i:Int){
		this = i;
	}
	inline public function pass():Bool {
		return this >= 60;
	}
}
```

输出 JS 为:

```js
(function () { "use strict";
var Main = function() { };
Main.main = function() {
	console.log(61 >= 60);       // 如果没有防止优化, 这里会直接输出 true
};
Main.main();
})();
```

对于抽象类, haxe 提供了多个 “元标签(metadata)”， 不同 “元标签” 有其各自的意义

* `enum abstract`: 使得抽象类像 C 语言中的枚举

  ```haxe
  enum abstract C(Int) {
      var X = 0;
      var Y;
      var Z;
      var W;
  }
  ```

对于抽象类，建议大家参考 haxe 中 UInt.hx 的源码。

* **note:** 注意在 abstract 类的内部, this 的类型为小括号内的底层类型, 而非当前这个抽像类

#### Implicit Casts

[隐式转换...](http://haxe.org/manual/types-abstract-implicit-casts.html), 直接与底层类型转换可以简单地使用 from 和 to.

```haxe
abstract Score(Int) from Int to Int{
	inline public function pass(score:Int):Bool {
		return score >= 60;
	}
}

//...
	var s:Sore = 61;  // from Int, 可直接从 Int 赋值
	trace(s + 20);    // to Int, 可直接转换成 Int
```

如果想要隐式地转换成其它类型， 则可以使用： `@:from, @:to`

```haxe
abstract Score(Int){
	inline public function new(i:Int){
		this = i;
	}
	// @:from 应该放在 static 类型上, 对应这个方法的参数类型
	@:from inline static public function fromString(s:String):Score{
		return new Score(Std.parseInt(s));
	}

	// 对应这个方法的返回值类型
	@:to inline public function toArray():Array<Int>{
		return [this];
	}
}
//...
	var s:Score = "61";    // from String
	var a:Array<Int> = s;  // to Array
	trace(a);              // 输出: [61]
```

#### Operator Overloading

[操作符重载...](http://haxe.org/manual/types-abstract-operator-overloading.html),


只是在这节介绍下 commutative, 用于交换二个操作数的左右位置

* `@:commutative`: 应用用抽象类的运算符重载，你可以参考 UInt.hx 的源码

  ```haxe
  @:commutative @:op(A + B) private static inline function addWithFloat(a:UInt, b:Float):Float {
  	return a.toFloat() + b;
  }

  @:commutative @:op(A * B) private static inline function mulWithFloat(a:UInt, b:Float):Float {
  	return a.toFloat() * b;
  }
  ```

#### Array Access

[索引器...](http://haxe.org/manual/types-abstract-array-access.html)，通过在抽象类上添加 `@:arrayAccess`

```haxe
abstract AString(String) {
  inline public function new(s) this = s;
  @:arrayAccess inline function getInt1(k:Int) {
    return this.charAt(k);
  }
}
//...
	var a = new AString("foo");
	trace(a[0]); // "f"
```

> 由于字符串不可变, 因此这个示例没有添加 setter 的索引器了， 如果存在多个类型相同的索引器，则自动选择第一个而忽略后边


#### Selective Functions

实际上对于抽象类， 编译器在底层将提升成员方法为“静态”，因此你也可以直接定义成静态方法, 语法类似于 “静态扩展”，
只要静态函数的第一个参数类型为抽象类的底层类型(underlying type)即可，有点像是编译器自动帮你使用了 "using" 一样。

```haxe
// 这里仍旧使用上边的示例, 只是把 pass 改成了静态方法,
abstract Score(Int){
	inline public function new(i:Int){
		this = i;
	}
	@:impl
	inline static public function pass(score:Int):Bool {
		return score >= 60;
	}
}
```

> `@:impl` 就像 “静态扩展” 的 "using" 关键字， 因为正常情况下， Selective Functions 是用于 “隐式转换”，“操作符重载”
这些操作上，这样的话就可以不用添加 impl。 而很少会像这样直接写成静态方法的形式(因为一般情况下都是写成成员方法)


分隔线
------

### haxe.MainLoop

haxe 3.3 才加入的类, 使得目前除了flash 和 js平台, 其它平台也包含有 haxe.Timer.delay 方法

当 haxe.MainLoop 存在时, `haxe.EntryPoint.run()` 将会被自动插入在 main 函数之后


### haxe.rtti

[运行时类型(runtime type information)](http://haxe.org/manual/cr-rtti.html)

如果在定义 class 时, 加上元标签 `@:rtti`, 则这个类将会有一个 untyped 的 静态字段 `__riit`，
这个字段为一个 xml 的字符串包含了所有这个类的信息, 可以通过 `haxe.rtti.XmlParser` 来分析。
将获得个 [RTTI Structure]()的数据结构。

```haxe
@:rtti class Main {
  var x:String;
  static function main() {
    var rtti = haxe.rtti.Rtti.getRtti(Main);
    trace(rtti);
  }
}
```

这种 rtti 数据可方便地程序之间传递类型信息

**重要:** 需要在类上添加元标签 `@:rtti` 才能使用这个包中的类, 这个类因此就获得“运行时类型(runtime type)”, 注意和编译时类型相区分。

* `haxe.rtti.Meta`: 前边应该有提到, 任何元标签都能通过这个类获得， 这个类不需要指定 rtti 元数据。

* `haxe.rtti.XmlParser`: 用于解析 __riit 字段, 见 API 文档

  ```haxe
  var rtti:String = untyped SomeClass.__rtti;
  var t = new haxe.rtti.XmlParser().processElement( Xml.parse(rtti).firstElement() );
  switch(t){
      case TClassdecl(cc):
      default:
  }
  ```

haxe.rtti.XmlParser 还可以用来解释 gen-doc 产生的 xml 文档。 因为它们是一样的类型。


<br />
