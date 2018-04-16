---

layout: post
title:  Log(可定制的日志输出)
date:   2014-03-28 7:12:21
categories: haxe

---

haxe 提供一个强力的 trace, 可以在程序的任意处简单地调用 trace

```haxe
trace("Hello world!");
```

默认情况下, flash 使用一个 TextField 显示 trace 信息. JS 则通过 console.log 输出. 其它平台则输出到 stdout.每一条 trace 都包含有"文件名"和"行号",如:

```bash
Test.hx:11: Hello world!
```

在 Flash 中, 你可调用 `Log.clear()` 来清除 trace 信息.

<!-- more -->

### 定制

可以直接覆盖掉 haxe.Log.trace 定制自已的 trace.

```haxe
class MyTrace {

    public static function setRedirection() {
        haxe.Log.trace = myTrace;
    }

    private static function myTrace( v : Dynamic, ?inf : haxe.PosInfos ) {
        // .....
    }
}
```

第一个参数 v 为要输出的值,

第二个参数 inf 的类型如下, **PosInfos** 是一个特殊魔法类, 当用这个类型作参数时,编译器会自动帮你填充.

```haxe
typedef PosInfos = {
    var fileName : String;
    var lineNumber : Int;
    var className : String;
    var methodName : String;
    var customParams : Array<Dynamic>;
}
```

inf 这个参数由编译器提供. 并且会把多出来的参数传递给 customParams:

```haxe
//当你输出多个值时:
class Test{
	function foo(){
		trace("hello", "warning", 123);
	}
}

//这时编译器将自动填充 inf 参数像下边:
haxe.Log.trace("hello",{
	className: "Test",
	methodName: "foo",
	fileName: "Test.hx",
	lineNumber: 3,
	customParams: ["warning", 123]		// 注意这行, 多出来的参数会自动传递到此
});
```

### 自动移除

只需要在编译时添加 `--no-traces` 参数, 则所有 trace 语句将被忽略. 这样你不必像 JS 一样 一条一条地注释掉这些语句.

<br />
<br />