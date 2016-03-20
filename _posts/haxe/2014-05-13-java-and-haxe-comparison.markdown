---
layout: post
title:  Java 和 Haxe 语法对比
date:   2014-05-13 11:50:10
categories: haxe
notes: markdown中夹着 html 时解析时很怪异.
---

### 前言

由于需要使用 `openfl.utils.JNI` 写 `android extendsion` 了解一些 `Java` 的语法还是有帮助的


下边将使用 `Haxe/Neko` 平台来和 `Java` 对比.因为都是虚拟机

<!-- more -->

### HelloWorld

<div class="row">
  <div class="col-md-6 as3">
  <h4>Java</h4>
  
{% highlight Java %}
public class Helo {
  public static void main(String arg[]) {
    System.out.println("Hello,Java");
  }
}
//文件保存为: Helo.java
//编译: > javac Helo.java
//运行: > java Helo
//输出: > Hello,Java
{% endhighlight %}
  
  </div>

  <div class="col-md-6 hx3">
  <h4>Haxe</h4>

{% highlight as %}
class Helo {
  public static function main() {
    Sys.println("Hello,Haxe/Neko");
  }
}
//文件保存为: Helo.hx
//编译: > haxe -main Helo.hx -neko Helo.n
//运行: > neko Helo.n
//输出: > Hello,Haxe/Neko
{% endhighlight %}
  
  </div>
</div>

<hr />


### 构造函数和方法重载

<div class="row">
 <div class="col-md-6 as3">
 <h4>Java</h4>
{% highlight java %}

public class TheClass {
	// 和 C++ 一样.构造方法绝对不能写 void,
	public TheClass(){      
		return;
	}
	public TheClass(int n){ // 方法重载.
		return;  
	}
    
	//混乱的, 但这只是一个 void 普通方法,而非 构造函数
	public void TheClass(){ 
		return;
	}

	public static void main(String[]a){
		TheClass n = new TheClass();
		n.TheClass(); //调用 定义为 void 的普通方法
	}
}
{% endhighlight %}
 </div>

 <div class="col-md-6 hx3">
  <h4>Haxe</h4>
{% highlight as %}

class TheClass {
    public function new(){  //写不写 Void 返回值都是一样
        return;
    }

    // haxe 没有方法重载.
    
    public static function main(){
        n:TheClass = new TheClass();
    }
}

{% endhighlight %}
 </div>
</div>

<hr />

### 基础类型

<div class="row">
  <div class="col-md-6 as3">
  <h4>Java</h4>

{% highlight java %}
byte    // 8  -128 ~ 127
short   // 16 -32768 ~ 32767
int     // 32 -2^31 ~ 2^31-1
long    // 64
float   // 32  
double  // 64
boolean
char
void
{% endhighlight %}
  </div>

  <div class="col-md-6 hx3">
  <h4>Haxe</h4>

{% highlight as %}
Bool
Int
Float
Void
{% endhighlight %}
  </div>
</div>

<hr />

### 初使化类

<div class="row">
 <div class="col-md-6 as3">
 <h4>Java</h4>
{% highlight java %}
public class Test {
	
	public Test(){
		System.out.println("new instance");
		System.out.println(num + "\n");
	}	

	// 和 haxe 不一样的是 num 会先被赋值为 100, 然后再被 static 块中的代码改为 200, 最后为 200
	public static int num = 100;
	
	// static 代码块, 同样只运行一次
	static{
		num = 200;
		System.out.println("static code block");
	}

	public static void main(String arg[]) {		
		new Test();
		new Test();
	}
	/* 输出:
	 static code block
	 new instance
	 200
	 
	 new instance
	 200
	*/
}
{% endhighlight %}
 </div>

 <div class="col-md-6 hx3">
  <h4>Haxe</h4>
{% highlight haxe %}
class Test{
	
	public function new(){
		trace("new instance");
		trace(num + "\n");
	}
	
	//  num 会被 __init__ 先赋值为 200, 然后被赋值为 100; 即最后的值为 100;
	static var num:Int = 100;
	
	// __init__ 方法　只会运行一次
	static function __init__(){
		trace("static __init__");
		num = 200;
	}
	
	public static function main(){
		new Test();
		new Test();
	}
	
	/* 输出:
	 static __init__
	 new instance
	 100
	 
	 new instance
	 100
	*/
}
{% endhighlight %}
 </div>
</div>

<hr />

### 加载源生方法

<div class="row">
 <div class="col-md-6 as3">
 <h4>Java</h4>
{% highlight java %}

// 使用 native 关键字描述方法体, 经常用于加载 c 语言库
public class HelloJni{
	
	public native String  stringFromJNI();
		
	static{
		System.loadLibrary("hello-jni");		
	}
}

{% endhighlight %}
 </div>

 <div class="col-md-6 hx3">
  <h4>Haxe</h4>
{% highlight haxe %}

// 而 haxe 使用　extern　关键字直接标记整个类为 外部类, 用于通过编译器检察,通常用于 调用源生平台的类
extern class Fs {
	/**
		Asynchronous rename(2).
	**/
	static function rename(oldPath:String, newPath:String, callback:Error->Void):Void;
}

// 整个类为外部类, (或者通过 @:extern 指定某一字段为外部,但这好像很少用到)
extern class Foo{
}

// hxcpp 加载 外部 C 库 - CFFI
// 首先使用 hxcpp 编译 c 源码. hxcpp 将根据不同平台选择不同 c/c++ 编译器
// 同样使用 Lib.l
class HelloCFFI{	
	private static var stringFromCFFI = Lib.load("path/to/lib.ndll","funcName",0);
}

{% endhighlight %}
 </div>
</div>

<hr />


### 空的

<div class="row">
 <div class="col-md-6 as3">
 <h4>Java</h4>
{% highlight java %}

// 替换这里的内容

{% endhighlight %}
 </div>

 <div class="col-md-6 hx3">
  <h4>Haxe</h4>
{% highlight as %}

// 替换这里的内容

{% endhighlight %}
 </div>
</div>

<hr />

### 空的

<div class="row">
 <div class="col-md-6 as3">
 <h4>Java</h4>
{% highlight java %}

// 替换这里的内容

{% endhighlight %}
 </div>

 <div class="col-md-6 hx3">
  <h4>Haxe</h4>
{% highlight as %}

// 替换这里的内容

{% endhighlight %}
 </div>
</div>

<hr />

### NDK

留空以后再添加...



### 简单记些 Java

[15分钟　java 快速入门](https://github.com/jdonaldson/learnxinyminutes-docs/blob/master/java.html.markdown)

* 变量定义

  ```java
  // 感觉和 C 语言很像
  int i = 10;
  char c = 'A';
  char [] cs = {'A','B','C'};
  String str = "Helo";
  Object [] obj = new Object[3]; // 初使化后数组长度必须为已知;
  obj[0] = new Object();
  ```

* `java.lang` 这个包不需要导入就可以直接使用.
 
* `java.lang.Object`

  > 除了Java的基础类型,所有类型都是继承于 Object,包括 String. 很多数据类型必须为 Object.
  >
  > 感觉很像 AS3. 在 AS3 中 Object 是所有 类 的基类.

* `final` 关键字

  ```java
  // final 除了 有 const 的行为
  // 还可以改变 一个变量作用域,叫做 final local variable
  // 下边示例中的 @Override run 方法,并不可以访问 其所在的局部变量
  // 但是局部变量加上 finnal 关键字后.就可以了
  public void foo() {
  	final String x = "hello";
  	String y = "there";
  	Runnable runnable = new Runnable() {
  		@Override public void run() {
  			System.out.println(x); // This is valid
  			System.out.println(y); // This is not
  		}
  	};
    runnable.run();
  }
  // 这个示例同样展示了 Java 可以在 实例化时,写 override 方法 
  ```

<br />





