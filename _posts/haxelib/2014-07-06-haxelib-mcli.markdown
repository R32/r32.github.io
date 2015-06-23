---

layout: post
title:  mcli
date:   2014-07-06 09:17:30
categories: haxelib

---

通过 **[mcli](https://github.com/waneck/mcli)** 能很容易地创建 命令行应用, 能自动将 代码注释 通过 宏处理 变为 相应的帮助信息

<!-- more -->

### 快速开始

```haxe
/**
*	Say hello. copyright	
*/
@:keep
class Test extends mcli.CommandLine{
	/**
	*	Say it in uppercase?
	*/
	public var loud:Bool;

	/**
	*	Show this message.
	*/
	public function help(){
		Sys.println(this.showUsage());
	}

	public function runDefault(?name:String){
		if(name == null) name = "World";
		var msg = 'Hello, $name!';
		if (loud) msg = msg.toUpperCase();
		Sys.println(msg);
	}

	public static function main(){
		new mcli.Dispatch(Sys.args()).dispatch(new Test());
	}

}
```

### 进阶

示例中的 metas 将会在后边说明.

```haxe
/**
* 类注释将被解析成帮助信息, 比如 copyright 之类的信息
*/
@:keep
class Test extends mcli.CommandLine{
	
	/**
	* 这个参数的帮助信息, 如果命令行中有 --cache 将会使这个变量变为 true
	* 当名字只有一个字母时, 可以使用一个减号(-),这里可以用 -c 来代替 --cache
	* @alias c
	*/
	public var cache:Bool = false;
	
	/**
	×　记住这个标记是加上 类字段上的, 非 public 的字段不需要加这个也会被忽略
	*/
	@:skip
	public var skip:Bool;
		
	/**
	* 支持 map 类型, 
	* 原本为 -D key=value 通过 @key和@value 将显示为 -D property=val
	* @command D
	* @key property
	* @value val
	*/
	public var map:Map<String,String> = new Map();
	
	/**
	* 当调用 --help 或 -h 时将调用这个方法
	* @alias h
	* @region ---------------------------
	**/
	public function help(){
		Sys.println(this.showUsage());
	}
	
	/**
	* 方法接受参数, 参数数量随意
	*/
	@:msg("\n\n=========================")
	public function sum(a:Int, b:Int){
		Sys.println(a + b);
	}
	
					// runDefault 是一个很重要的方法, 常用来接收不带 `-` 的参数
					// 这个方法的参数数量任意, 可以通过 preventDefault() 来禁用这个方法
					// 当 `neko test.n hehe` 时,将输出: typed: hehe
					// 但是 `neko test.n hehe haha` 有二个参数和下边方法定义参数个数不一致，这时只会输出帮助信息
					// 例: neko test.n -D hello=world hehe 或 neko test.n hehe -D hello=world
	public function runDefault(?name:String) {
		if(name != null){
			var stak = new Array<String>();
			for(k in map.keys()){
				stak.push(k + ":" + map.get(k));
			}
			Sys.println("typed: " + name);
			Sys.println("Define: " + stak.join(", "));
		}else{
			this.help();
		}
		
	}
	
	static function main() {
		new mcli.Dispatch(Sys.args()).dispatch(new Test());
	}
}
```

#### metas

在源代码中找到的这些标记

 * **用于类字段**

	```
	@:skip						# 避免 public 字段被 宏 解析成 命令参数
	@:msg(string)				# 添加附属的说明, 常用于添加　分隔线
	```

 * **用于注释中**

	```
	@alias <name>				# 别名, 常用于做一个 单字母的别名, 对于单字母可以用一个 -　调用
	@command <name>				# 更改命令的实际名称, 常用于 将 map 字段更名为 D
	@region <string>			# 同 @:msg(string), 注: 换行符 需要有空格字符作参数的 @region
	@key <name>					# 将默认说明用的 key 改为其它字符, 见上边示例的
	@value <name>				# 同@key, 将默认说明用的 value 改为其它字符, 
	```

#### 其它

 * 由于一些函数在运行时才会调用到,所以推荐在继承类上添加 @:keep 防止被 -dce full 清除

 * 方法 的参数类型可以为 Array<String> 但是参数名必须为 varArgs 或 rest, 这个特性常用于 runDefault, 用于处理多个参数
 
 * `Dispatch.addDecoder` 可用于添加自定义的 解释器, 必须在 `new Dispatch` 之前调用, 示例参看 `sample/git/`

 * 在添加 sub command 时记得给继承类加 @:keep 防止被 -dce 清除, 示例参看 `sample/git/`

 * 如果你使用了 haxelib nodejs 库, 那么目前 Sys.args() 返回的参数将带有 node file.js 这二个参数.

 * 个人调整,支持 -Dkey=value , -D　与　key=value之间没有空格的模式

	```haxe
	@:keep																// 在继承类上添加 @:keep 防止被 -dce full 清除
	class Main{
		public static function main() {		
			var args:Array<String> = [];		
			for(str in Sys.args().slice(ARGSLICE)){								
				if(str != "-D" && StringTools.startsWith(str,"-D")){	// 将类似 -Dkey=value 变成 -D key=value 的形式
					args.push("-D");
					args.push(str.substr(3));
				}else{
					args.push(str);
				}
			}		
			new mcli.Dispatch(args).dispatch(new Main());
		}
		static inline var ARGSLICE:Int = #if nodejs 2 #else 0 #end;		// nodejs 的 args 会把 node file.js 这二个也加入到 参数
	}	
	```

 * 在 DOS 中正确显示中文

	> 由于 dos 是 gbk 编码的, 而通常大家的代码都是 utf-8 编码, 因此只要把继承 mcli.CommandLine 的文件编码改为 ansi 就能正确显示中文帮助信息了