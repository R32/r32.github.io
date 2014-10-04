---
layout: post
title:  Java 和 Haxe 语法对比
date:   2014-05-13 11:50:10
categories: haxe
notes: markdown中夹着 html 时解析时很怪异.
---

#### 前言

由于需要使用 `openfl.utils.JNI` 写 `android extendsion` 了解一些 `Java` 的语法还是有帮助的


下边将使用 `Haxe/Neko` 平台来和 `Java` 对比.因为都是虚拟机

<!-- more -->

#### HelloWorld

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

#### 基础类型

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

#### 构造函数和方法重载

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
    
    // 虽然有 @:overload 元标签.
    // 但是 ·:overload 是为使用 extern 类的方法准备的
    // @:overload 参看 haxe Tips and Tricks
    // 最好忘记 @:overload 这个元标签
    
    public static function main(){
        n:TheClass = new TheClass();
    }
}

{% endhighlight %}
 </div>
</div>


<hr />

#### 空的

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

#### 简单记些 Java

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

 * `java.lang.Object`
 
	> 除了Java的基础类型,所有类型都是继承于 Object,包括 String. 很多数据类型必须为 Object.
 
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



