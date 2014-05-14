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

### 空的模板

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

 * [安装JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 和 [教程](http://www.w3cschool.cc/java/java-tutorial.html)
 > 实际上 如果安装了 `openfl android`,不用再重新下载 JDK 了.

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
 > <br />感觉很像 AS3. 在 AS3 中 Object 是所有 类 的基类.

 
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



