---

layout: post
title: 从 javascript 到 haxe
date: 2016-03-07 06:55:16
categories: other

---

本文档用于向 javascript 程序传销 [haxe], 学习它需要对 js 有一定的了解。

## 安装

首先下载 haxe 编译器, **推荐** 使用 git 版本，可以在 <http://build.haxe.org> 找到, 更新时可以覆盖安装

<!-- more -->

### 编辑器

选择 vscode, 安装 haxe(haxe language support) 插件即可, [插件文档-英文](https://github.com/vshaxe/vshaxe/wiki/Debugging)

* 通过 `File->Open Folder`, 打开一个空的文件夹
* 按下F1, 后选 `haxe:Initialize VS Code Project` 即可新建一个 haxe 项目
* 下边是默认的 build.hxml,

  ```bash
  -cp src                # 添加 src 目录,
  -D analyzer-optimize   # 开启优化器
  -main Main             # 定义入口类
  --interp               # 通过 "haxe 解释器" 来运行代码
  ```

  想要输出为 js, 只要将最后一行按如下修改即可

  ```bash
  -cp src
  -D analyzer-optimize
  -main Main
  -js app.js             # 你也可以将 app.js 改成别的文件名, 和指定目录, 如: "bin/app.js"
  ```

* 按下 "Ctrl+Shift+B" 编译

* 调试: 这里仅以 nodejs 为例, 其它环境其实也类似.
  - 先关掉 "haxe 优化器", 即通过 `#` 符号, 注释掉 `-D analyzer-optimize` 即可
  - 接下来, 开启 "source.js.map", 通过在 `build.hxml` 中添加一行 `-debug` 或者 `-D js-source-map`
  - 最后修改 "launch.json",
    > 在打开 "launch.json" 后, 可以点击窗口右下角的 "Add Configuration..." 按钮,
    >
    > 然后在打开的下拉菜单中选 "nodejs: Launch Program"
    >
    > 注意某个输出文件如: `app.js` 要和 `build.hxml` 中的输出文件相对应


## 语法

建议参考 <http://haxe.org/manual/introduction.html>

对于 API 手册, 其实利用 IDE 的跳转(`F12`)直接看源码效果会更好

#### for 循环

haxe 中没有 `for(var i=0; i < len; i++){}` 这种语法, 取而代之的是:

```js
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

* 通过添加 `--no-traces` 即可擦除所有 console.log 语句

* 条件编译：

  ```js
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

  ```js
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

  ```js
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


* **宏(macro)**: haxe 最强大的特性, 这也是为什么我选择它而不用 typescript 的原因

  > 建议新手先跳过这一块, 但如果你正在学习它，有一个编译参数 `-D dump=pretty` 可以看到宏展开后的代码是什么样


<br />
