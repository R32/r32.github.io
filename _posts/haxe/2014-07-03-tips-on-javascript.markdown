---

layout: post
title:  javascript
date:   2014-07-03 17:22:30
categories: haxe

---

 计划慢慢使用 haxe 来写 javascript 包括 nodejs.
 
<!-- more -->
<br />

#### `HTML DOM`

haxe.js.html 下的对象类型挺吓人的. 所以应该使用 js.JQuery 来操作 DOM 对象.


#### defines and metas

编译行使用 -D 来设置, 代码中通过 Context.defined 或 Context.definedValue 检测设置

 * `@:jsRequire(moduleName,?subModName)` 需要 haxe 3.2+

	> 在 haxe 3.13 时 使用诸如 `@:native("(require('fs'))") extern class Fs{}` 这样很不美观.
	
	> haxe 3.2+ 应此添加了这个新标记,
	
	```haxe
	@:jsRequire("fs")
	extern class Fooo {
		
	}	// 那么这个类导出的 JS 代码则为 var Fooo = require("fs");

	
	@:jsRequire("http", "Server")
	extern class Barr{
		
	}	// 导出的JS代码为:	var Barr = require("http").Server;
	```
 
 * js-flatten 平坦模式.

	> Generate classes to use fewer object property lookups

	> 使用更少的对象属性构建类, 例如: 默认情况下会创建的类有时似于 Main.a.b.c 加这个属性后将为 Main_a_b_c 这样就降低了访问对象的深度

 * `embed-js` 嵌入 haxe 安装包标准库内部的 JS 文件.

	> 目前只有 `jQuery 1.6.4` 和 `swfObject 1.5` 这二个 since 3.0

 * `@:expose(?Name=Class path)` Makes the class available on the window object (js only)

	> 将类导出到 window对象 下, 如果 window 未定义,则导出到 exports对象(nodejs) 下

 * `@:initPackage`

	> 针对 extern class 初使化包名为 Object, 
	
 * `@:runtime` (since 2.10) 未知


<br />

#### `extern class`

当 js 平台时, 由于经常需要调用 js 文件, 由于 Javascript **上下文** 的随意性, 并没有好的工具能自动创建 extern class, 所以需要自已手动为这些外部 JS 文件写 extern class 声明.


```javascript
// DisplayToggle.js
function DisplayToggle(id) {
    this.el = document.getElementById(id);
    this.el.className = "visible";
    this.visible = true;
}
DisplayToggle.prototype.hide = function() {
    this.el.className = "hidden";
    this.visible = false;
}
DisplayToggle.prototype.show = function() {
    this.el.className = "visible";
    this.visible = true;
}
```

为这个 DisplayToggle.js 创建 extern class 声明

```haxe
// DisplayToggle.hx
package ;
extern class DisplayToggle {
    public function new(id:String):Void;
    public function hide():Void;
    public function show():Void;
    public var visible(default,null):Bool;
}
```


由于 JS 中方法的参数可以是不同类型, 因此在写 extern class 时,会经常用到 元标签 @:overload

```haxe
extern class JQueryHelper {
	@:overload(function(j:JQuery):JQuery{})
	@:overload(function(j:DOMWindow):JQuery{})
	@:overload(function(j:Element):JQuery{})
	public static inline function J( html : String ) : JQuery {
		return new JQuery(html);
	}
	
	// ...
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

<br />

隐藏细节: 通过源码可以发现 macro.Compiler 下有**宏**方法 includeFile, 但仅限于 js 平台使用. 使用说明:

 * 在 extern class 上添加元标记 `@:initPackage`

	> `@:initPackage` 这个标记官方并没有文档说明, 这个标记是针对 **js平台** 的, 用来初使化 包及路径, 因为 haxe 并不会为 extern class 创建相应包对象, 例: 在 extern class 中当源码声明为 `package js;` 时, 添加 这个元标记将会创建 `js = {}`

 * 在 extern class 中创建静态初使方法 `static function __init__`, 使用 includeFile 将文件包含进来

 	> 对于 Context.resolvePath 除了检索当前项目的目录之外,如果文件不存在 还将检索  haxe/std 目录.

 	```haxe
 	// js.SWFObject 示例: 
 	private static function __init__() : Void untyped {
		#if embed_js
		haxe.macro.Compiler.includeFile("js/swfobject-1.5.js");
		#end
		js.SWFObject = deconcept.SWFObject;
	}
 	```


<br />


#### 使用 nodejs

虽然是 js 平台, 但是在安装 [haxelib nodejs](https://github.com/dionjwa/nodejs-std) 库之后, 完成可以看成另一个平台.

haxe 3.2 版本时, 将会新增一个 元标记 @:jsRequire, 而且目前 也已经将一个 hxnodejs 的库移到了 官方目录中去.


<br />





