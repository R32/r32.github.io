---

layout: post
title:  从 javascript 到 haxe
date:   2016-03-07 06:55:16
categories: other

---

这篇文档用于向 javascript 程序传销 haxe，那么为什么不直接使用纯 js 代码了?

* 当项目变得稍为有些大, js 代码非常不好维护, 因为 js 过于自由, 即便同一个人在不同时期写出来的风格是不一样的

* API 文档的生成有些麻烦（我只使用过 YUIDoc, 感觉给每个方法/字段添加注释时非常繁琐）

为什么我使用 haxe

* 因为我不熟悉 typescript 和 coffeescript 还有个叫 dart 的

  > 即使使用国外引擎搜 "typescript vs haxe", typescript 背后虽然是微软, 但也并没有占什么优势
  > 但是有一点得承认，haxe 的中文文档以及中文社区不如 typescript

* 强类型所具有的优势， 编译器能自已推导变量类型,类似于 c++11 中的 auto 变量或 c# 中的 var

<!-- more -->

* 除了 JS 能编译成 Cpp, 和 flash

  > 对于 Cpp, 虽然没有直接写 c++ 代码快, 但能跨平台(haxe的几个游戏引擎如 Kha, luxe, openfl)，而且再慢也比 Java, C# 快。
  >
  > haxe 写 flash 甚至优于使用 adobe AS3 来写 flash，因为这个平台由 Nicolas 亲自操刀


### 快速指南

这里只是一些 Tips 以避免走太多的弯路, 因为语法其实和 JS 没多少差别,

* [Haxe Foundation 的 github 地址](https://github.com/HaxeFoundation), 通常简称为 HF, 而不是 haxe 基金会

* 首先你需要下载 haxe, **强烈推荐** 使用 git 的自动构建版本，可以在 <http://build.haxe.org> 处下载。

  - 安装包已经自带了“包管理器(haxelib)”以及一个“简易HTTP服务器”(`nekotools server -h 0.0.0.0 -p 80`)

  - 如果你不想下载, 可以用浏览器打开 <http://try.haxe.org> 在线尝试

* 如果 windows 系统, 推荐下载使用 haxedevelop/flashdevelop 作为 IDE。  （这二个是一样的只是名字不同而已）

  > **Note**: 记得在设置里将 `Completion Mode` 设为 `CompletionServer` 以“缓存编译”(即: 编译器不会重复编译没有改动过的文件)

* 对于 API 手册, 其实 haxedevelop 按 F4/shift+F4 就能直接看源码文档的, 当然你也可以下载 haxe 的 dox 来编译文档

* 文档在 <http://haxe.org/manual/introduction.html>, 如果你觉得英文有困难，建议使用 bing 翻译

  > 事实上 <http://old.haxe.org> 也还有蛮多不错的文档可以看

* 建议先慢慢尝试使用 haxe 写一些代码, 而不是马上就让它代替你的源生 js 代码

### 语法差异


**for 循环**, 首先, haxe 中没有 `for(var i=0; i < len; i++){}` 这种语法, 取而代之的是:

```haxe
for(i in 0...10){ // js: for(var i=0; i < 10;  i++)
}

for(i in 0...array.length) {}
```

对于像 Array, Map, 这些带有迭代器的, 可直接:

```haxe
var map = new Map<String,String>();
for(v in map){};
for(k in map.keys()){};

var a = [];
for(v in a){}
for(i in 0...a.length){};
```

需要注意的是 haxe 不可以直接迭代“匿名对象”(对应JS中的 Object对象), 而是通过 Reflect 如:

```haxe
var obj = {name: "tom", phone: 1366};
for(k in Reflect.fields(obj)){
	trace(k + ": " + Reflect.field(obj, k));
}
// 上边的示例看上去却实非常麻烦， 如果你使用 untyped 或许能简单一点点
// untyped 表示让编译器跳过类型检测，

for(k in Reflect.fields(obj)){
	trace(k + ": " + untyped obj[k]);
}
// 看上去比之前好了那么一点点， 但如果你却实打算需要像 js 那样遍历,
// 那么只能通过嵌入 `__js__("js code")` 来嵌入 js 代码了
untyped __js__('for(k in {0}) {
	console.log(k + ":" + {0}[k]);
}', obj);  // obj 将会替换掉 {0}
```

**switch**, haxe 中不需要写 break 语句， 当遇到下一条 case 或 default 语句时会自动 break。

```haxe
switch(val){
case 1:
  //do some thins
case 2,3:
  // 可使用逗号"," 或分隔符"|" 分隔多个一致的条件
default:
  //
}
```

**关于IE 兼容性**，

* 首先, haxe 中的 DOM 对象是基于 W3C 的 IDL 文件自动生成的, 因此操作 DOM 时, 你应该尽量使用 js.jquery.JQuery 来操作 DOM
* haxe 默认输出为 es5, 如果你想要兼容 ie8 或更低的浏览器则建议添加编译参数 `-D js-es=3`

### 特性

这下边只写了一些目前我所能想到的, 其它的未来再补充。

* `--no-traces` 这个编译参数将使得 trace 产生的语句(console.log) 不会出现在 js 文件中.

* `#if, #elseif, #else, #end` 条件编译。 例:

  ```haxe
  #if debug
  // do somethins here..
  #elseif nodejs
  // for nodejs
  #end

  // 或者你使用了一个名字为 heaps 的 haxe 库， 或者通过 -D 定义的自定义参数
  // 这些条件检测支持 !, &&, ||
  #if (heaps || MyDef)
  #end
  ```

* 抽像类，关键字: `abstract + inline`  比如你可以把 Int 类型想象成 Direction 类型, 使得代码更容易理解:

  ```haxe
  // 小括号中的 Int 我们称之为 底层原型(underlying type)
  abstract Direction(Int){
  	inline public function new(i:Int){
  		this = i;
  	}
  	inline public function inLeft(){
  		return this < 0;
  	}
  	inline public function inRight(){
  		return this > 0;
  	}
  }

  class Main {
  	static function main() {
  		var d = new Direction(js.Browser.window.screenX);
  		trace(d.inLeft());
  		trace(d.inRight());
  	}
  }
  ```

  把上边的 haxe 代码编译成JS: `haxe -dce full -main Main -js test.js`

  ```js
  (function () { "use strict";
  var Main = function() { };
  Main.main = function() {
    var d = window.screenX;
    console.log(d < 0);
    console.log(d > 0);
  };
  Main.main();
  })();
  ```

* `@:enum abstract`, “常量枚举”, (特殊的抽象类)

  ```haxe
  @:enum abstract Week(Int) to Int{
  	var Sun = 0;
  	var Mon = 1;
  }

  class Main {
  	static function main() {
  		trace(Mon - Sun);
  	}
  }
  ```

  编译成 JS， 由于 haxe 会自动计算常量表达式的值, 因此...

  ```js
  (function () { "use strict";
  var Main = function() { };
  Main.main = function() {
  	console.log(1);
  };
  Main.main();
  })();
  ```

* 静态扩展. 比如你想在某个类上添加一些自定义的方法, 但是又不必修改其源码

  Foo.hx

  ```haxe
  class Foo{
    public static inline function triple(n: Int){
        return n * 3;
    }
  }
  ```

  Main.hx, (由于不能和被 using 的类位于同一个文件, 因此需要分离成二个文件)

  ```haxe
  using Foo;  // 第一步, 使用 using 引入 Foo 类

  class Main {
    static public function main() {
      var i = 101;
      trace(i.triple()); // 直接调用, 只要 triple 函数的第一个参数类型为 Int.
    }
  }
  ```

  输出 JS 为:

  ```js
  (function () { "use strict";
  var Main = function() { };
  Main.main = function() {
    console.log(303);
  };
  Main.main();
  })();
  ```


* `inline new` 当某个类的构造函数为 inline 时

  ```haxe
  import js.Browser.window;
  class Main {
  	static function main() {
  		var p = new Point(window.screenX, window.screenY);
  		trace(p.lengthSq());
  	}
  }
  class Point{
  	public var x:Int;
  	public var y:Int;
  	public inline function new(x, y){
  		this.x = x;
  		this.y = y;
  	}
  	public inline function lengthSq(){
  		return x * x + y * y;
  	}
  }
  ```

  生成的 JS:

  ```js
  (function () { "use strict";
  var Main = function() { };
  Main.main = function() {
  	var x = window.screenX;
  	var y = window.screenY;
  	console.log(x * x + y * y);
  };
  Main.main();
  })();
  ```

* `@:structInit`, 允许直接使用 `{}` 这种结构数据来初使化类

  ```haxe
  // 使用上边的示例, 仅给 Point 加上
  @:structInit class Point{....}

  // 这时可直接用结构来初使化类
  var p:Point = {x: window.screenX, y: 20};
  ```

* **宏**， 作为 haxe 最强大的特性之一。 它允许有限地控制编译器, 但是建议新手先跳过这一块, 但是如果你《编译原理》学得不错的话，那么这些东西你会非常熟悉

  > 比如使用宏通过 http 下载某个远程文件（或解析本地的某个文件）, 并根据这个文件的内容来构建类
  >
  > 一些自动扫描项目的资源文件夹然后智能提示给 IDE 就是使用宏完成的


### 其它

[一篇 haxe/js 的日志]({% post_url haxe/2014-07-03-javascript %})

haxe 国内 QQ 群: **30373020**, 有任何问题可以在群里问 (注: 我并不是群主)

<br />
