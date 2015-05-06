---
layout: post
title:  AS3 和 Haxe 语法对比
date:   2014-03-29 17:50:10
categories: haxe
---


本文档的目的是帮助 熟悉 Actionscript 3 的开发人员快速入门 Haxe。更多 Haxe 特定文档请参阅主要的 [Haxe.org](http://Haxe.org).

- [Haxe 语法](http://haxe.org/ref/syntax)
- [Haxe 语言参考手册](http://haxe.org/ref)
- [Haxe API](http://api.haxe.org) 如果你安装了 Haxe 可以打开安装目录下 **HaxeToolkit\haxe\doc\index.html**
- 如果你熟悉 AS3 建议从 [Haxe/openfl](http://www.openfl.org/documentation/) 开始. openfl 提供了跨平台的 Flash API


这个文档源文来自: [Haxeflixel's guide](http://haxeflixel.com/documentation/as3-and-haxe-comparison/).

<!-- more -->
<h3 id="基础类型">Basic Types(基础类型)</h3>
<div class="row">
  <div class="col-md-6 as3">
  <h4>AS3</h4>

{% highlight as %}
Boolean
int
Number
Object
void
Array
Vector.<String>
{% endhighlight %}
  </div>

  <div class="col-md-6 hx3">
  <h4>Haxe</h4>

{% highlight haxe %}
Bool
Int
Float
Dynamic
Void
Array<Dynamic>
Array<String>
{% endhighlight %}
  </div>
</div>
<hr />

<h3 id="常量">Const (常量)</h3>
<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>
{% highlight as %}

const MAX:int = 100;

{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>
{% highlight haxe %}

static inline var MAX:Int = 100;
// 但是 haxe 的常量只允许 Int, Bool, Float, String 这些常量类型.
{% endhighlight %}
</div>
</div>
<hr />

<h3 id="包声明">Package Declarations(包声明)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
package com.example.myapplication {

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight as %}
package com.example.myapplication;
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="类定义">Defining a Class(定义类)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
public class MyClass {

   public function MyClass () {
	
   }

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight as %}
class MyClass {

   public function new () {

   }

}
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="循环">Loops(循环)</h3>
<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
for (var i:uint = 0; i < 100; i++) {

}

for(var value:String in items) {

}

for (var propertyName:String in object) {

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight as %}
// haxe 中没有 for(var i=0; i<10; i++) 这样的循环
for (i in 0...100) {

}

for (value in items) {

}
var fields = Reflect.fields (object);
for (propertyName in fields) {

}
{% endhighlight %}
</div>
</div>

<hr />
<h3 id="switch">Switch Statements</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
switch (value) {

   case 1:
      trace ("Equal to 1");
      break;

   default:
      trace ("Not equal to 1");
      break;
}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
// haxe 中的 switch 不需要 break;
switch (value) {

   case 1:
      trace ("Equal to 1");

   default:
      trace ("Not equal to 1");

}
        {% endhighlight %}
</div>


</div>

<hr />
<h3 id="类型推断">Type Inference(类型推断)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var hi = "Hello World";

// type is Object (类型为 Object)
// fails to compile in strict mode (不能通过严格模式的编译)
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
var hi = "Hello World";

// type is String (类型为 String)
// even works for code completion (能正常通过编译)
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="类型转换">Type Casting(类型转换)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var car:Car = vehicle as Car;

var toString:String = String (10);
var toNumber:Number = Number ("10");
var toInteger:int = int (10.1);
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
var car:Car = cast vehicle;
// or for a safe cast:
var car = cast (vehicle, Car);

var toString = Std.string (10);
var toNumber = Std.parseFloat ("10");
var toInteger = Std.int (10.1);
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="类型细节">Type Details</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
if (vehicle is Car) {

}

import flash.utils.getDefinitionByName;
import flash.utils.getQualifiedClassName;

name = getQualifiedClassName (vehicle);
type = Class (getDefinitionByName (name);
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
// haxe 中没有 is as 以及 instanceof 这些关键字.
if (Std.is (vehicle, Car)) {

}

type = Type.getClass (vehicle);
name = Type.getClassName (type);
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="是否为Null">Checking for Null</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
if (object == null) {

}

if (!object) {
}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
if (object == null) {
	
}

{% endhighlight %}
</div>


</div>

<hr />
<h3 id="哈希字典">Hash Tables</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var table:Object = new Object ();
table["key"] = 100;

trace (table.hasOwnProperty ("key"));

for (var key:Object in table) {

   trace (key + " = " + table[key]);

}

delete table["key"];
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
var table = new Map<String, Int> ();
table.set ("key", 100);

trace (table.exists ("key"));

for (key in table.keys ()) {

trace (key + " = " + table.get (key));

}

table.remove ("key");
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="可变参数">Rest Parameters(可变参数)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
function test (...params):void {

}

test (1, 2, 3);
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
function test (params:Array<Dynamic>) {

}

Reflect.makeVarArgs (test) (1, 2, 3);
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="反射">Reflection(反射)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var foo = object["foo"];

bar.apply (this, [ "hi" ]);
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
var foo = Reflect.field (object, "foo");

Reflect.callMethod (this, bar, [ "hi" ]);
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="函数的类型">Function Types(函数类型)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
function hello (msg:String):void {

}

var type:Function = hello;
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
function hello (msg:String):Void {

}

var type:String->Void = hello; 

// can also use Dynamic
var type2:Dynamic = hello;
{% endhighlight %}
</div>


</div>

<hr />
<h3 id="Getter-Setters">Getters and Setters</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
function get x ():Number {

   return _x;

}

function set x (value:Number):void {

   _x = value;

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
public var x (get, set):Float;

function get_x():Float {

   return _x;

}

function set_x(value:Float):Float {

   return _x = value;

}
// 重要: 这种形式在 haxe 很少见, 参见下边 Read-Only Properties 才是正确的做法
{% endhighlight %}
</div>
</div>


<hr />
<h3 id="只读属性">Read-Only Properties(只读属性)</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
function get x ():Float {

   return _x;

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight haxe %}
public var x (default, null):Float;

// null allows private access
// never would restrict all access
public var y(default, set):Float;
function set_y(v:Float):Float{
	return y = v; // 注意这个 y 没有下划线, 和声明的 y 变量一相同
}
{% endhighlight %}
</div>
</div>


<hr />
<h3 id="延时">延时</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var cancelID:uint = setTimeout(calllback,delay_time_ms);

clearTimeout(cancelID);// 取消

{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>
{% highlight haxe %}
// 重要: haxe.Timer 原生 Haxe 只支持 flash 以及 Javascript 平台
// 使用 openfl 时, haxe.Timer 才是跨平台的.参看 HaxeToolkit\haxe\lib\openfl-native\1,n,n\haxe\Timer.hx
// 使用 openfl 时, haxe.Timer 和 flash.utils.Timer 不是同一个类.
var timer = haxe.Timer.delay(calllback,delay_time_ms); // return Type haxe.Timer

timer.stop(); // 取消

{% endhighlight %}
</div>

</div>

<hr />
<h3 id="等于">类实例对比</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>
{% highlight as %}
// AS 中对比二个实例是否为一个很简单,和普通类型变量一样

trace(this == root);

//或, AS 或 JS 都可以用 === 三个等号来表示全等于

trace(this === root);
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>
{% highlight haxe %}
// Haxe 则需要类型一致,  或者A的类型是 B 的 父类或子类

// 假如 this => Main,  root => MovieClip
trace(this == cast(root,Sprite)); //

//或,强制转换成另一个父类

trace(this == cast(root,DisplayObject));
{% endhighlight %}
</div>

</div>

<hr />

<h3 id="条件编译">条件编译</h3>
<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>
{% highlight as %}

// divillysausages.com/blog/as3_conditional_compilation
CONFIG::DEBUG{
  trace("debug");
}

{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>
{% highlight haxe %}

// 细节参看页尾的 条件编译
#if debug
  trace("debug");
#end

{% endhighlight %}
</div>
</div>
<hr />




### Additional Features

Haxe 增加了一些 Actionscript 3 没有的语法特性:

* [宏](http://haxe.org/manual/macro.html)
* [enums](http://haxe.org/ref/enums)
* [type parameters](http://haxe.org/ref/type_params)
* [structures](http://haxe.org/ref/type_advanced)
* [custom iterators](http://haxe.org/ref/iterators)
* [conditional compilation](http://haxe.org/ref/conditionals)
* [inlining](http://haxe.org/ref/inline)
* and more!

