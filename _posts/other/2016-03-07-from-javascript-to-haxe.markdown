---

layout: post
title: 从 javascript 到 haxe
date: 2016-03-07 06:55:16
categories: other

---

本文档用于向 javascript 程序传销 [haxe], 学习它需要对 js 有一定的了解。

在文档的最后，我会从编译原理的角度分析 haxe 编译器各个模块的功能。

<!-- more -->

[haxe]:https://github.com/HaxeFoundation
[Editors and IDEs]:https://haxe.org/documentation/introduction/editors-and-ides.html

## 安装

* 首先下载 haxe 编译器, **强烈推荐** 使用 git 自动构建版，可以在 <http://build.haxe.org> 找到。

* [Editors and IDEs]. *对于新学任何一门语言来说, 语法提示是最重要的。*

* 参考文档在 <http://haxe.org/manual/introduction.html>, 如果你觉得英文有困难，建议使用 bing 翻译

  > 事实上 <http://old.haxe.org> 也还有蛮多不错的文档可以看

* 对于 API 手册, 其实利用 IDE 的跳转功能直接看源码效果会更好。

### IDE 选择

#### haxedevelop/flashdevlop

这是我个人偏爱的 IDE, 当然它只能在 windows 中运行.

> 中文:  "Tools" -> "Program Settings...". 然后左侧选中 "Haxedevelop" 右边则找到 "Locale" 下的 "Selected Locale" 的弹出菜单. 更改后重启 IDE 即可。

1. "项目(Project)" -> "新建项目(New Project...)", 选择 "JS Project" 并填写好其它项后按下 "确定" 即可

2. 按下 F8 (或点击齿轮图标)即可编译

3. 建议打开 CompletionServer 加速编译, 对于大的项目它的效果非常明显.

  > "工具(Tools)" -> "程序设置(Program Settings)", 左侧: "Haxe Context", 右侧的 "Completion Mode" 选 "CompletionServer" 即可.

4. 编译器选项: "项目" -> "属性" -> "编译器选项" 通过 "Additional Compiler Options" 打开一个弹出的输入框

  可以输入下边参数: (这种一行一个参数可以保存为 .hxml 文件, haxedevelop 可以通过设置自动将它导出)

  ```bash
  -dce full
  -D analyzer-optimize
  ```

  `-dce full` 表示强力删除所有未引用的代码. 默认为 `-dce std`

  `-D analyzer-optimize` 表示打开优化器, 由于目前重写了优化器, 因此这项功能目前默认是关闭的

  更多命令行参数参考 `haxe --help`

#### vscode

1. 选择一个空的文件夹
2. 按下F1, 后选 `haxe:Initialize VS Code Project` 即可新建一个 helloworld 的项目
3. 下边是默认的 build.hxml, 但它并非是编译为 js 的.

  ```bash
  -cp src
  -D analyzer-optimize
  -main Main
  --interp
  ```

  如果想编译到 js 并输出到 out.js 则可修改如下:

  ```bash
  -cp src
  -D analyzer-optimize
  -main Main
  -js out.js
  ```

4. 按下 "Ctrl+Shift+B" 编译, 具体的配置你可能需要参考 vscode 的帮助文档.

## 语法

TODO

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

### IE 兼容性

1. 首先, haxe 中的 DOM 对象是使用基于 W3C 的 IDL 文件自动生成的, 因此如果你不熟悉兼容性, 那么在操作 DOM 时, 可以使用 js.jquery.JQuery, 或者自己添加 polyfill。

2. haxe 默认输出为 es5, 如果你想要兼容 ie8 则可添加编译参数 `-D js-es=3`

## 语言特性

目前只想到这些, 其它的未来再补充

* 编译时添加 `--no-traces` 即可擦除所有 console.log 语句

* 支持条件编译：

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
  ```

* 抽像类 `abstract + inline`， 例如你可以把 Int 类型想象成 Direction 类型, 使得代码更容易理解:

  > haxe 中的抽象类的形为实际上得有些像 inline, 与其它语言如 java 或 C# 中所谓的抽象类完全是不同的概念,

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

* 静态扩展. 比如你想在某个类上添加一些自定义的方法, 但是又不必修改其源码

  ```haxe
  using Main.Foo;  // 第一步, 使用 using 引入 Foo 类, (由于文件名是 Main.hx, 因此默认是 Main 类)
  class Main {
      static public function main() {
        var i = 101;
        trace(i.triple()); // 直接调用, 只要 triple 函数的第一个参数类型为 Int.
      }
  }
  class Foo{
      public static inline function triple(n: Int){
          return n * 3;
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

  > 建议新手先跳过这一块。 **tips**: 如果你正在学习它，有一个很重要的编译标志 `-D dump=pretty` 可以让你看到 macro 展开后的代码是什么样

## 编译器模块

* Compiler-based Completion

* Compilation Cache Server


<br />
