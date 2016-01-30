---

layout: post
title:  Javascript
date:   2014-07-03 17:22:30
categories: haxe

---


### Tips

 * 当将一个方法作为参时,比如 `addEventListener(onSome)` 如果可以的话尽量将这个方法定义为静态方法避免 haxe 做多余的上下文(this)绑定. 这样输出的代码更整洁

###　黑魔法

 * `__js__` 用于直接嵌入 js 代码

	```haxe
	var s:String = untyped __js__("Navigator.plugin[\"Shockwave Flash\"]");
	
	// 由于 js 的 {} 并没有其独立作用域，因此 __js__ 内部可以随意写局部变量
	var a = 1, b = 2;
	untyped __js__("var c = a+b");
	```

<!-- more -->

 * `__instanceof__(o,cl)`: 相当于JS的 o instanceof c1,

 * `__typeof__(o)`: 相当于JS的 typeof o

 * `__strict_eq__(a,b)` 和 `__strict_neq__(a,b)`: 相当于JS的 a===b, a!==b


### Defines

通过 `-D` 或相关宏定义的值

 * `js-classic`: 不使用闭包和 "strict mode" 包装代码输出.

 * `jquery-ver`: The jQuery version supported by js.jquery.*. The version is encoded as an interger. e.g. 1.11.3 is encoded as 11103

 * `js-es5` 如果你确定代码只在符合这个标准的环境中运行(如node.js或 chrome 扩展),强烈推荐添加这个标记。 

	对于一些方法（如 `Array::indexOf`）,haxe使用了兼容各种浏览的实现, 如果定义这个标记,将不会构建这些多余的兼容性代码

 * `js-flatten` [deprecated]平坦模式.  由于 haxe 3.2 中这将是默认行为,应此被移除

	> 使用更少的对象属性构建类, 例如: 默认情况下会创建的类有时似于 Main.a.b.c 加这个属性后将为 Main_a_b_c 这样就降低了访问对象的深度
	
 * **js-unflatten** 由于 haxe 3.2 已经默认为 js-flatten, 因此想反过来的话... 
	
 * **`embed-js`** 当调用到相关类时,自动嵌入 haxe 安装包标准库内部的 JS 文件.

	> 目前只有 `jQuery 1.6.4` 和 `swfObject 1.5` 这二个 since 3.0

### Metas

 * `@:jsRequire(moduleName,?subModName)` 需要 haxe 3.2+
	
	> 在 haxe 3.13 时 使用诸如 `@:native("(require('fs'))") extern class Fs{}` 这样很不美观.
	> 因此 haxe 3.2+ 添加了这个新的元标记,
	
	```haxe
	@:jsRequire("fs")
	extern class Fooo {
		
	}	// 那么这个类导出的 JS 代码则为 var Fooo = require("fs");

	
	@:jsRequire("http", "Server")
	extern class Barr{
		
	}	// 导出的JS代码为:	var Barr = require("http").Server;
	```
	
 * **`@:expose(?Name=Class path)`** 将类或静态方法接到 window 对象下(js only)，注意和 `@:native` 相区别

	> 如果没有定义默认不会导出, 这个元标记将类导出到 window对象 下, 如果 window 未定义,则导出到 exports对象(nodejs) 下
	

 * `@:initPackage` 用来初使化 包及路径 (仅限于 javascript) 注:在 haxe 3.2 中好像已经没作用了.似乎被移除.

	> 因为 haxe 并不会为 extern class 创建相应包对象, 例: 在 extern class 中当源码声明为 `package js;` 时, 添加 这个元标记将会创建 `js = {}`
	
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
		
	> 将构建成为:
	
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

如果觉得创建 extern 类太麻烦, 可以使用 [黑魔法](http://old.haxe.org/doc/advanced/magic) js 的部分. 针对上边的 js 文件, 在 hx 中调用:

```haxe
class Main {
    static function main() {
    	// 使用 `untyped __js__` 的方式 无法从 IDE 中获得 代码提示
        var dis:Dynamic = untyped __js__('new DisplayToggle("some_id")');
        dis.hide();
    }
}
```



通过源码可以发现 macro.Compiler 下有**宏**方法 includeFile, 但仅限于 js 平台使用. 示例:

```haxe
// js.SWFObject
private static function __init__() : Void untyped {
	#if embed_js
	haxe.macro.Compiler.includeFile("js/swfobject-1.5.js");
	#end
	js.SWFObject = deconcept.SWFObject;
}
```

**处理`func.call/apply`:** 当把一个函数作为变量传递为参数时, haxe 为了绑定 function 内部的 this 作用域,编译为 js 后 绑定将变成 `js.call($bind(func,context))`, 因此只要把 函数声明为 `var func:Void-Void` 这种变量形式就能避免这个问题. 

 * 当一个 extern class 的 method 将要作为参数传递时,需要这样做.

 * static 静态方法不受此影响,

### nodejs

[haxelib nodejs](https://github.com/dionjwa/nodejs-std) 添加了一些 sys 包以及其它方法, 使得在 js 目标中仍然可以访问 sys 包, 但是目前提供的方法不是很全.  这个类库同时提供一些 node-webkit 的方法.


### 浏览器

haxe 的 HTML 相基于 Mozilla 的 WebIDL 自动生成 https://github.com/HaxeFoundation/html-externs , 因此在兼容性方面还是推荐使用 JQuery.

#### HTML DOM

......

<br />
