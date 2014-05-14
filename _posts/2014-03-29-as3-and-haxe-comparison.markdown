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

### Basic Types

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

{% highlight as %}
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
<h3>Package Declarations</h3>

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
<h3>Defining a Class</h3>

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
<h3>Loops</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
for (var i:uint = 0; i < 100; i++) {

}

for each (var value:String in items) {

}

for (var propertyName:String in object) {

}
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight as %}
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
<h3>Switch Statements</h3>

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

{% highlight as %}
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
<h3>Type Inference</h3>

<div class="row">
<div class="col-md-6 as3">
<h4>AS3</h4>

{% highlight as %}
var hi = "Hello World";

// type is Object
// fails to compile in strict mode
{% endhighlight %}
</div>

<div class="col-md-6 hx3">
<h4>Haxe</h4>

{% highlight as %}
var hi = "Hello World";

// type is String
// even works for code completion
{% endhighlight %}
</div>


</div>

<hr />
<h3>Type Casting</h3>

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

{% highlight as %}
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
<h3>Type Details</h3>

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

{% highlight as %}
if (Std.is (vehicle, Car)) {

}

type = Type.getClass (vehicle);
name = Type.getClassName (type);
{% endhighlight %}
</div>


</div>

<hr />
<h3>Checking for Null</h3>

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

{% highlight as %}
if (object == null) {

}
{% endhighlight %}
</div>


</div>

<hr />
<h3>Hash Tables</h3>

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

{% highlight as %}
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
<h3>Rest Parameters</h3>

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

{% highlight as %}
function test (params:Array<Dynamic>) {

}

Reflect.makeVarArgs (test) (1, 2, 3);
{% endhighlight %}
</div>


</div>

<hr />
<h3>Reflection</h3>

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

{% highlight as %}
var foo = Reflect.field (object, "foo");

Reflect.callMethod (this, bar, [ "hi" ]);
{% endhighlight %}
</div>


</div>

<hr />
<h3>Function Types</h3>

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

{% highlight as %}
function hello (msg:String):Void {

}

var type:String->Void = hello;

// can also use Dynamic
{% endhighlight %}
</div>


</div>

<hr />
<h3>Getters and Setters</h3>

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

{% highlight as %}
public var x (get, set):Float;

function get_x():Float {

   return _x;

}

function set_x(value:Float):Float {

   return _x = value;

}
{% endhighlight %}
</div>


</div>

<hr />
<h3>Read-Only Properties</h3>

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

{% highlight as %}
public var x (default, null):Float;

// null allows private access
// never would restrict all access
{% endhighlight %}
</div>

</div>

#### Additional Features

Haxe 增加了一些 Actionscript 3 没有的语法特性:

* [宏条件编译](http://haxe.org/manual/macros?lang=cn)
* [enums](http://haxe.org/ref/enums)
* [type parameters](http://haxe.org/ref/type_params)
* [structures](http://haxe.org/ref/type_advanced)
* [custom iterators](http://haxe.org/ref/iterators)
* [conditional compilation](http://haxe.org/ref/conditionals)
* [inlining](http://haxe.org/ref/inline)
* and more!
