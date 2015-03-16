---

layout: post
title:  Javascript
date:   2014-07-03 17:22:30
categories: haxe

---

 计划慢慢使用 haxe 来写 js, 内容包括二个部分 nodejs 和 浏览器的js, 大多数情况下它们都是通用的,
 
<!-- more -->


#### 编译标记

编译标记即为使用 `-D` 定义的值, 通过 `haxe --help-defines` 查询所有内建定义

 * **`js-flatten`** 平坦模式. Generate classes to use fewer object property lookups

	> 使用更少的对象属性构建类, 例如: 默认情况下会创建的类有时似于 Main.a.b.c 加这个属性后将为 Main_a_b_c 这样就降低了访问对象的深度
	
 * **`embed-js`** 当调用到相关类时,自动嵌入 haxe 安装包标准库内部的 JS 文件.

	> 目前只有 `jQuery 1.6.4` 和 `swfObject 1.5` 这二个 since 3.0

#### 元标记

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
	
 * `@:expose(?Name=Class path)` Makes the class available on the window object (js only)

	> 将类导出到 window对象 下, 如果 window 未定义,则导出到 exports对象(nodejs) 下

 * `@:initPackage` 用来初使化 包及路径 (仅限于 javascript)

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
                       



#### `extern class`

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



### nodejs

[haxelib nodejs](https://github.com/dionjwa/nodejs-std) 添加了一些 sys 包以及其它方法, 使得在 js 目标中仍然可以访问 sys 包, 但是目前提供的方法不是很全.  这个类库同时提供一些 node-webkit 的方法.


### 浏览器

这个段落的内容仅适用于 浏览器中的 javascript

#### `HTML DOM`

haxe.js.html 下的对象类型挺吓人的. 所以应该使用 js.JQuery 来操作 DOM 对象.







