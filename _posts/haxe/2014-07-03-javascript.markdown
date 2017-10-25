---

layout: post
title:  Javascript
date:   2014-07-03 17:22:30
categories: haxe

---


### Tips

* 使用 git 版本的 haxe, 可以在 <http://build.haxe.org> 处下载

* js.Lib 下的有些很有用处的方法。 例如访问 JS 中的全局变量:

  `js.Lib.global.MyVal = 100`

* `-debug` 模式将会生成 source map 文件用于调试

* 当把一个成员方法作为函数参数时传递时, 比如 `addEventListener(onSome)`, 确保 this 的指向是否如预期（haxe 会将把 **成员方法** 自动绑到所属对象上, 但有时候你并不需要这样做）

  因此 haxe 的 function bind 尽量不要用在成员方法上, 或者使用 `(obj: Dynamic).method` 的方式防止 `$bind`:

  ```hx
    var rqf : Dynamic = (window: Dynamic).requestAnimationFrame ||
        (window: Dynamic).webkitRequestAnimationFrame ||
        (window: Dynamic).mozRequestAnimationFrame;
    // 这里显示地定义 rqf 为 Dynamic, 否则会当成 Bool
  ```

* 当写 extern class 时, 静态扩展目前将忽略 `@:overload` [#5596](https://github.com/HaxeFoundation/haxe/issues/5596)

<!-- more -->

### 黑魔法

首先应该查看 js.Lib 是否已经有需要的方法, 再使用下边这些

* `__js__` 用于直接嵌入 js 代码

  ```haxe
  var s:String = untyped __js__('Navigator.plugin["Shockwave Flash"]');

  // 实例上 __js__ 的签名是: __js__("js code", arg1, arg2, argn...)
  // 它使用了类似于 C# 的字符串格式语法
  var a = 1, b = 2;
  untyped __js__("var c = {0} + {1}", a, b); // a, b 将分将替换掉 {0}, {1}

  // 或者在一个函数的内部如:
  untyped Array.prototype.slice.call(__js__("arguments"));
  ```

haxe 4.0 后新增了 js.Syntax 类, 包含了 `instanceof`, `typeof`, `delete`, `===` 以及 `!===`

### Defines

通过 `-D` 的编译参数

* `shallow-expose`: 将使 `@:expose` 导出的对象会在顶层环境添加一条 `var xxx = $hx_exports[xxxx]`

* `js-classic`: **经典模式**, 即: 不使用闭包和 "strict mode" 包装代码输出.

* `jquery-ver`: The jQuery version supported by js.jquery.*. The version is encoded as an interger. e.g. 1.11.3 is encoded as 11103

* ~~js-es5~~ 默认情况下 haxe 将以 js-es=5 的形式输出代码, 如果你想要兼容旧的浏览器可以指定为 `-D js-es=3`

  在未来的 haxe 中(ver: 3.4)， 可以 `-D js-es=6` 以使用最新的JS特性

  例如: `Array.prototype.indexOf`, 如果定义了 js-es=3, 那么 haxe 将会实现它（比如IE8并没有这个方法,因此需要自已实现）

* ~~`js-flatten`~~ 平坦模式. haxe 3.2+ 中这将是默认行为

  **`js-unflatten`** 如果想恢复以前旧的模式的化. 例旧模式： `Main.a.b.c`, 而默认的平模模式为: `Main_a_b_c`

* ~~embed-js~~ 已经被移除, 你可以使用 [includeFile](#includeFile) 方法来嵌入想要的文件

### Metas

* `@:jsRequire(moduleName,?subModName)` 需要 haxe 3.2+, 在 nodejs 中经常会用到

  ```haxe
  @:jsRequire("fs")
  extern class Fooo {}
  // 导出JS为: var Fooo = require("fs");


  @:jsRequire("http", "Server")
  extern class Barr{}
  // 导出JS为: var Barr = require("http").Server;
  ```

* **`@:expose(?Name=Class path)`** 将类或静态方法接到全局对象下（即成为一个全局范围的变量）

  注意和 `@:native`(用来更改输出类名或字段名) 相区别,

* `@:runtime` (since 2.10) 未知, 但是现在的版本移除了 js only 的限制

* **`@:selfCall`** 调用自身, 由于 javascript 没有构造函数, 在写 extern class 时会遇到一些问题

  ```haxe
  @:jsRequire("myapp")
  extern class MyApp {
      @:selfCall function new();
      @:selfCall function run():Void;
  }

  class Main {
      static function main() {
  		var app = new MyApp();
  		app.run();
  	}
  }
  ```

  将构建成为:

  ```js
  (function () { "use strict";
  	var MyApp = require("myapp");
  	var Main = function() { };
  	Main.main = function() {
  	    var app = MyApp();
  	    app();
  	};
  	Main.main();
  })();
  ```

### extern class

由于 Javascript **上下文** 的随意性, 并没有好的工具能自动创建 extern class, 所以需要自已手动为这些外部 JS 文件写 extern class 声明.

* 从 webidl 文件获得一些类型参考 <https://github.com/mozilla/gecko-dev/tree/master/dom/webidl>

  > 实际 HF 有自动解析 webidl 为 extern clsss 的工具, 只是我没成功过 <https://github.com/HaxeFoundation/html-externs>

由于 JS 中方法的参数可以是不同类型, 因此在写 extern class 时,会经常用到 元标签 @:overload

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

如果觉得创建 extern 类太麻烦, 可以像下边这样, 但是没有智能语法提示:

```haxe
class Main {
    static function main() {
        var dis:Dynamic = untyped __js__('new DisplayToggle("some_id")');
        dis.hide();
    }
}
```

#### call/apply

当把一个 extern class 方法作为函数参数传递时, haxe 自动绑定 this 的作用域,
在编译后代码类似于 `func.call($bind(func,context))`， 这样将导致 call/apply 失效. 因此解决方法为

* 可以把方法声明定义成变量形式， 例: `var func:Void-Void`

* 或者将方法定义为静态方法 **static**

#### includeFile

用于嵌入代码文件到输出文件: 注意如果是在源码中调用那么 includeFile 方法的第二个参数应该为 String 类型
- top(默认) 将插入到代码输出的顶层,在闭包的外部(如果没有指定 `-D js-classic`)
- inline 表示插入到这一行

> 如果你仅想以 inline 的方式插入字符串代码可以使用 `__js__` 来完成.

```haxe
import haxe.macro.Compiler.includeFile;
class Main {
	static function main() {
		trace("begin");
		includeFile("projDir/path/to/file.js", "top|inline");
		trace("end");
	}
}
```

也可以通过编译时的参数嵌入JS, 通过 `--macro` 插到输出代码的顶层, 例:

```bash
haxe -main Main -js bin/main.js --macro includeFile("projDir/path/to/file.js")
```

#### tips for extern

参考别人的外部库是如何写的, 如 [hxnodejs](https://github.com/HaxeFoundation/hxnodejs).

* 枚举值可以使用 `@:enuu abstract` 来指定.

* 不要把成员函数作为参数传递, 除非你将它指定成变量形式.(因为 haxe 会自动绑定上下文, 但很多时候并不需要这样)

* 使用 `@:native("native_name")` 来指定真实方法或变量名

  如果在需要通过一个类的字段访问 JS 的全局变量如 undefined, 可以指定为 inline 方法或 getter, 可参考: `js.Lib.undefined`

  注: 如果用在 typedef 中的匿名结构上目前暂时不会有任何效果, [#5105](https://github.com/HaxeFoundation/haxe/issues/5105)

* `@:selfCall` 上边已经描述,但是由于 haxe 也会帮 extern clss 绑定上下文会导致一些不方便。

  ```haxe
  class Main {
      static function main() {
          var zoom = new Zoom();
  		D3.call(zoom);
      }
  }

  @:remove interface Callable{}

  extern class D3{
  	public static function call(func:Callable):Void;
  }
  extern class Zoom implements Callable{
      @:selfCall function new();
  }
  ```

* `@:callable` 可以加在 abstruct 类上, 使得这个类实例可以为调用 [参考...](https://github.com/HaxeFoundation/haxe/issues/3218)

* 使继承类的返回链式， TODO:

### 模块化编程

（注: 不推荐使用）因为这种方式会使得代码变得复杂, 而且对于 extern 类来说, 必须显示地声明函数的返回和参数类型。

  編譯 a.js 的時候加 "-D a_js". 相對的，編譯b.js 的時候加 "-D b_js"

  ```haxe
  #if b_js extern #end class A {
  	public function new():Void {
  		trace("new A");
  	}
  }

  #if a_js extern #end class B {
  	public function new():Void {
  		trace("new B");
  	}
  }
  ```


( **注: 推荐** ) 参考: <https://github.com/elsassph/modular-haxe-example>

  其关键是使用 `--macro exclude('SomeClass')` 来排除某一个类或模块（注意必须使用单引号）

  唯一的问题是可以在被排除的类上使用 `@:expose` , 但是不可以改名（例如: `@:expose("OtherName")`）

  但是使用 `@:expose` 好像不太美观, 还不如使用: `-D js-classic`，但这却导致不会添加 "use strict".

&nbsp;

### nodejs

首先使用这个库 <https://github.com/HaxeFoundation/hxnodejs>

### 浏览器

* js.Browser 类下有几个 static field你 可能会经常用到, 比如 window, document, console ....这些

* js.Lib 类下的方法适用于 nodejs/Browser, 比如 nativeThis(), eval(), require()(仅限nodejs)

* js.Selection 用于 textrea 元素, 兼容 IE/Mozilla. 但是这个类并没有获得当前光标位置的方法.

* js.Cookie

* js.RegExp

......

#### HTML DOM

haxe 的 HTML 相基于 Mozilla 的 WebIDL 自动生成 <https://github.com/HaxeFoundation/html-externs> , 因此在兼容性方面还是推荐使用 JQuery.

<br />
