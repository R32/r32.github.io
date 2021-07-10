---

layout: post
title:  Javascript
date:   2014-07-03 17:22:30
categories: haxe

---

### Tips

* 建议使用 git 版本的 haxe, 可在 <http://build.haxe.org> 下载

* 由于 haxe 4 支持模块内的函数/变量, 而且 extern 可以直接用于字段,

  ```js
  // 例如可添加类似于如下代码到任何类, 之后通过 import.hx 引入即可
  @:native("console") extern var console : js.html.ConsoleInstance;
  @:native("document") extern var document : js.html.Document;
  @:native("window") extern var window : js.html.Window;
  ```

<!-- more -->

* `-debug` 模式将会生成 source map 文件用于调试, release 下也可以使用 `-D source-map` 来强制输出这个文件

* 当把一个 **成员方法** 作为参数时传递时, haxe 会将把 **成员方法** 与其相关的对象自动绑定

  如果不想绑定, 则可使用 `(obj: Dynamic).method` 的方式防止它, 例:

  ```hx
    var rqf : Dynamic = (window: Dynamic).requestAnimationFrame ||
        (window: Dynamic).webkitRequestAnimationFrame ||
        (window: Dynamic).mozRequestAnimationFrame;
    // 这里显示地定义 rqf 为 Dynamic, 否则会当成 Bool
  ```

  或者将函数定义成变量的形式如: `var sum: (a: Int, b: Int)->Int;`

* 当写 extern class 时, 静态扩展目前将忽略 `@:overload` [#5596](https://github.com/HaxeFoundation/haxe/issues/5596)


### 黑魔法

首先应该查看 `js.Lib` 或 `js.Syntax` 类下是否已经有需要的方法

* `js.Syntax.code` 用于直接嵌入 js 代码

  ```js
  var s:String = js.Syntax.code('Navigator.plugin["Shockwave Flash"]');

  //
  var a = 1, b = 2;
  js.Syntax.code("var c = {0} + {1}", a, b); // a, b 将分将替换掉 {0}, {1}
  ```

### Defines

通过 `-D` 的编译参数

* `shallow-expose`: 将使 `@:expose` 导出的对象会在顶层环境添加一条 `var xxx = $hx_exports[xxxx]`

* `js-classic`: **经典模式**, 即: 不使用闭包和 "strict mode" 包装代码输出.

* `jquery-ver`: The jQuery version supported by js.jquery.*. The version is encoded as an interger. e.g. 1.11.3 is encoded as 11103

* 默认情况下 haxe 将以 js-es=5 的形式输出代码, 如果你想要兼容旧的浏览器可以指定为 `-D js-es=3`

  > 例如: `Array.prototype.indexOf`, 如果定义了 js-es=3, 那么 haxe 将会实现它（比如IE8并没有这个方法,因此需要自已实现）

* **`js-unflatten`** 在 haxe 中例如类 `Main.a.b.c` 将会被编译为: `Main_a_b_c`, 如果你想保持 `Main.a.c.c` 这种样式，则可以用这个

* ~~embed-js~~ 已经被移除, 你可以使用 [includeFile](#includeFile) 方法来嵌入想要的文件

### Metas

* `@:jsRequire(moduleName,?subModName)` 需要 haxe 3.2+, 在 nodejs 中经常会用到

  ```js
  @:jsRequire("fs")
  extern class Fooo {}
  // 导出JS为: var Fooo = require("fs");


  @:jsRequire("http", "Server")
  extern class Barr{}
  // 导出JS为: var Barr = require("http").Server;
  ```

* **`@:expose(?Name=Class path)`** 将"类"或"静态方法"导出到全局对象下（即成为一个全局范围的变量）

  ```js
  // 将类导出到全局, 如果无参数则导出一个同名的类到全局
  @:expose class App {}

  // 导出静态方法, @:expose 一定要加参数，才可以导出到 JS 为全局函数。
  class App {
    @:expose("haha") static function haha() {}
  }
  ```

  注意和 `@:native`(用来更改输出类名或字段名) 相区别,

* **`@:selfCall`** 调用自身, 由于 javascript 没有构造函数, 在写 extern class 时会遇到一些问题

  ```js
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

需要自已手动为这些外部 JS 文件写 extern class 声明.

* 从 webidl 文件获得一些类型参考 <https://github.com/mozilla/gecko-dev/tree/master/dom/webidl>

  > 实际 HF 有自动解析 webidl 为 extern clsss 的工具, 只是我没成功过 <https://github.com/HaxeFoundation/html-externs>

由于 JS 中方法的参数可以是不同类型, 因此在写 extern class 时,会经常用到: `@:overload`

```js
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

```js
class Main {
    static function main() {
        var dis:Dynamic = js.Syntax.code('new DisplayToggle("some_id")');
        dis.hide();
    }
}
```

#### call/apply

当把一个 extern class 的成员方法作为参数传递时, haxe 将会自动绑定 this 指向, 如果想避免则可:

* 可以把方法声明定义成变量形式， 例: `var func:Void-Void`

* 或者将方法定义为静态方法 **static**

#### includeFile

用于嵌入代码文件到输出文件: 注意如果是在源码中调用那么 includeFile 方法的第二个参数应该为 String 类型
- top(默认) 将插入到代码输出的顶层,在闭包的外部(如果没有指定 `-D js-classic`)
- inline 表示插入到这一行

> 如果你仅想以 inline 的方式插入字符串代码可以使用 `js.Syntax.code` 来完成.

```js
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

* 将成员函数作为参数传递时, haxe 会自动绑定 this 的指向.

* 使用 `@:native("native_name")` 来指定真实方法或变量名

  注: 不可以用在 typedef 所定义的匿名结构上, [#5105](https://github.com/HaxeFoundation/haxe/issues/5105)

* `@:selfCall` 上边已经描述,但是由于 haxe 也会帮 extern clss 绑定上下文会导致一些不方便。

  ```js
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

参考: <https://github.com/elsassph/modular-haxe-example>

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
