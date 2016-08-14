---

layout: post
title:  从 javascript 到 haxe
date:   2016-03-07 06:55:16
categories: other

---

这篇文档用于向 javascript 程序传销 haxe，那么为什么不直接使用纯 js 代码了?

* 纯 js 非常不好维护，由于代码过于自由，即便同一个人在不同时期写出来的风格是不一样的。

* API 文档的创建有些麻烦，不方便团队交流。

使用 haxe 的优点:

* 因为我不熟悉 typescript 和 coffeescript 还有个叫 dart 的

  > 搜 "typescript vs haxe", 即使 ts 背后虽然是微软, 但也并没有占什么优势
  >
  > 但是有一点得承认，haxe 的中文文档以及中文社区不如 typescript

* 强类型，但编译器能自已推导变量的类型。

<!-- more -->

* `-debug` 模式下将会自动创建 source map 文件并相之相关联，以方便定位源文件错误

* 除了 JS 能编译成 cpp、flash、neko 等其它几个平台

* [在线尝试 haxe](http://try.haxe.org)

### 快速指南

这里只是一些 Tips 以避免走太多的弯路, 因为语法其实和 JS 没多少差别,

* [Haxe Foundation 的 github 地址](https://github.com/HaxeFoundation)，通常简称为 **HF**

* 首先下载 haxe, **强烈推荐** Git 自动构建版，可在 <http://build.haxe.org> 找到。

  > 安装包自带了“包管理器(haxelib)”以及一个“简易HTTP服务器”(`nekotools server -h 0.0.0.0 -p 80`)

* 如果 windows 系统, 推荐下载使用 haxedevelop/flashdevelop 作为 IDE。  （这二个是一样的只是名字不同而已）

  > **注**: 推荐在设置里将 `Completion Mode` 设为 `CompletionServer` 用于 “缓存编译”

* 对于 API 手册, 其实 haxedevelop 按 `F4/shift+F4` 就能直接跳转到定义处。当然你也可以下载 dox 来编译

* 参考文档在 <http://haxe.org/manual/introduction.html>, 如果你觉得英文有困难，建议使用 bing 翻译

  > 事实上 <http://old.haxe.org> 也还有蛮多不错的文档可以看

* 建议先慢慢尝试使用 haxe 写一些代码, 而不是马上就让它代替你的源生 js 代码

### 语法差异

**常量**

 javascript | haxe
----------- | -----------
`const MAX = 100;` | `static inline var MAX = 100;`

#### for 循环

haxe 中没有 `for(var i=0; i < len; i++){}` 这种语法, 取而代之的是:

```haxe
for(i in 0...10){ // js: for(var i=0; i < 10;  i++)
}

for(i in 0...array.length) {}
```

haxe 中的容器都带有迭代器， 例如: Array, Map

```js
var a = [];
for(v in a){}
for(i in 0...a.length){};


var map = new Map<String,String>();
for(v in map){};
for(k in map.keys()){};
```

#### switch

haxe 中不需要写 break 语句

```js
switch(val){
case 1:
  //do some thins
case 2, 3:
  // 多条件, 可使用逗号"," 或分隔符"|"
default:
}
```

#### IE 兼容性

1. 首先, haxe 中的 DOM 对象是基于 W3C 的 IDL 文件自动生成的, 因此操作 DOM 时, 你应该尽量使用 js.jquery.JQuery

2. haxe 默认输出为 es5, 如果你想要兼容 ie8 或更低的浏览器则可添加编译参数 `-D js-es=3`

### 特性

目前只想到这些, 其它的未来再补充

* 一个编译参数 `--no-traces` 即可擦除所有 console.log 语句

* 条件编译：

  ```haxe
  #if debug
  // do somethins here..
  #elseif nodejs
  // for nodejs
  #end

  // 或者你使用了一个名字为 heaps 的 haxe 库， 或者通过 -D 定义的自定义参数
  // 条件检测支持逻辑操作符(!, &&, ||)，以及条件运算符(>, <, >= ...)
  #if (heaps || MyDef)
  #end

  #if (haxe_ver >= 3.2)
  // 注意使用条件运算符或逻辑操作符一定要用“小括号”将表达式括起来
  #end

  // 如果你不知道有哪些 defines 可以使用, 可以像下边这个 “宏方法”， 例:
  class Main {
  	static function main() {
  		trace(getDefines()); // console.log({'js-es5' : "1", .....})
  	}

  	macro static function getDefines(){
  		var obj = {};
  		var m = haxe.macro.Context.getDefines();
  		for (k in m.keys()) {
  			Reflect.setField(obj, k, "" + m.get(k));
  		}
  		return macro $v{obj};
  	}
  }
  ```

* 抽像类 `abstract + inline`， 例如你可以把 Int 类型想象成 Direction 类型, 使得代码更容易理解:

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

* 常量枚举：`@:enum abstract`

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


* **haxe 最强大的特性：宏（macro）**。 通常它用来自动创建，比如你可以分析某个本地或网络文件然后动态创建一个类

  > 建议新手先跳过这一块, 但如果你对《编译原理》有自信的话，那么这些东西你会非常熟悉

  例: 这个 macro 用来获得当前项目最后提交的 GIT HASH 值

  ```js
  // MyMacros.hx
  class MyMacros {
    public static macro function getGitCommitHash():haxe.macro.ExprOf<String> {
    #if !display
      var process = new sys.io.Process('git', ['rev-parse', 'HEAD']);
      if (process.exitCode() != 0) {
        var message = process.stderr.readAll().toString();
        var pos = haxe.macro.Context.currentPos();
        Context.error("Cannot execute `git rev-parse HEAD`. " + message, pos);
      }
      var commitHash:String = process.stdout.readLine();
      return macro $v{commitHash};
    #else
      return macro $v{""};
    #end
    }
  }

  // Main.hx
  class Main{
  	static function main(){
  		trace(MyMacros.MyMacros());
  	}
  }
  ```

  编译成 JS 后:

  ```js
  console.log("3d807e9ccea66be262b492be49e8415291921cf9")
  ```

  **tips**: 如果你正在学习使用 macro，有一个编译标志 `-D dump=pretty` 可以让你看到 macro 做了什么

### 其它

[一篇个人 haxe/js 的日志]({% post_url 2014-07-03-javascript %})

国内交流 QQ 群: **30373020**, 有任何问题可以在群里问，就算不学 haxe 也没关系 (注: 我并不是群主，也没任何广告)

<br />
