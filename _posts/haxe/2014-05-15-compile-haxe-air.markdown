---

layout: post
title:  将 SWF 打包成 AIR
date:   2014-05-13 9:26:10
categories: haxe

---

之前以为打包成 `.air` 由于需要安装,因此很不方便. 后来发现其实 adobe 有工具打包成bundle的形式(window平台打包成exe文件).可以使用flash.html.HTMLLoader 加载普通的网页, 相比 nw.js 打包网页要小20M左右, 最简单的方法是用 flashdevelop 创建一个 haxe/air 的示例.

<!-- more -->

对于一些 AIR 属性的类, 你需要使用 haxe 的类库 air3,详情见: `haxelib info ari3`

### 创建 air app.xml

AIR 应用程序描述符元素: <http://help.adobe.com/zh_CN/air/build/WSfffb011ac560372f2fea1812938a6e463-8000.html>

[官网参考](http://help.adobe.com/en_US/air/build/WS144092a96ffef7cc4c0afd1212601c9a36f-8000.html) 示例: 


```xml
<?xml version="1.0" encoding="utf-8" ?> 
<application xmlns="http://ns.adobe.com/air/application/3.0"> 
    <id>example.HelloWorld</id> 
    <versionNumber>1.0.1</versionNumber> 
    <filename>Hello World</filename> 
    <name>Example Co. AIR Hello World</name> 
     <description> 
        <text xml:lang="en">This is an example.</text> 
        <text xml:lang="fr">C'est un exemple.</text> 
        <text xml:lang="es">Esto es un ejemplo.</text> 
    </description> 
    <copyright>Copyright (c) 2010 Example Co.</copyright> 
    <initialWindow> 
        <title>Hello World</title> 
        <content> 
            HelloWorld.swf 
        </content> 
    </initialWindow>  
    <icon> 
        <image16x16>icons/smallIcon.png</image16x16> 
        <image32x32>icons/mediumIcon.png</image32x32> 
        <image48x48>icons/bigIcon.png</image48x48> 
        <image128x128>icons/biggerIcon.png</image128x128>  
    </icon> 
</application>
```

另一个更简单的:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<application xmlns="http://ns.adobe.com/air/application/3.6">
    <id>FbxViewer</id>
    <name>FbxViewer</name>
    <filename>FbxViewer</filename>
    <versionNumber>1.0</versionNumber>
	<supportedProfiles>desktop extendedDesktop</supportedProfiles>
    <initialWindow>
        <content>fbxViewer.swf</content>
        <visible>true</visible>
        <renderMode>direct</renderMode>
        <depthAndStencil>true</depthAndStencil>
    </initialWindow>
</application>
```

### 创建 swf

先需要编绎成常见的 swf 格式. 细节参看: [编绎haxe](http://haxe.org/doc/compiler)

```bat
haxe -main Main -swf Main.swf
```

### air应用

做这一步之前需要先创建 swf 文件,

#### 调式运行

仅于快速测试, 不会生成 air 文件

```bat
:: 命令很简单,不需要 certificate 文件
:: swfdir可以为空,则为当前目录
adl %APP_XML% %swfdir%
```

#### 打包成air

需要通过调用 `adt.bat` 创建签名文件, 下边 `.bat` 提取来自 `flashdevelop` 的 `haxe/air` 示例.

```bat
:: 配置路径
set FLEX_SDK=E:\flash_SDK\AIR40
set PATH=%PATH%;%FLEX_SDK%\bin


:: 配置 certificate 文件信息
set CERT_NAME=air
set CERT_PASS=fd
set CERT_FILE=air.p12


:: xml 文件
set APP_XML=app.xml

:: ========== 创建 certificate ==========

if not exist %CERT_FILE% call adt -certificate -cn %CERT_NAME% 1024-RSA %CERT_FILE% %CERT_PASS%

:: ========== 生成 AIR ==========
:: AIR output

::if not exist %AIR_PATH% md %AIR_PATH%

set OUTPUT=app.air

set APP_DIR=.\


set OPTIONS=-tsa none
set SIGNING_OPTIONS=-storetype pkcs12 -keystore %CERT_FILE% -storepass %CERT_PASS%

adt -package %OPTIONS% %SIGNING_OPTIONS% %OUTPUT% %APP_XML% %APP_DIR%
```

#### 打包成bundle

由于秘成 air安装很麻烦, 因此对于桌面平台建议生成 `-target bundle`: 对于windows平台,这将会生成一个不需要安装的 exe 文件

参考: <http://help.adobe.com/zh_CN/air/build/WSfffb011ac560372f709e16db131e43659b9-8000.html>

```bash
# 签名文件参考上小节的 
adt -package 
    -keystore ..\cert.p12 -storetype pkcs12 
    -target bundle 
    myApp 
    myApp-app.xml 
    myApp.swf icons resources	
```

### 命令行

#### ADL(AIR Debug Launcher)

<http://help.adobe.com/zh_CN/air/build/WSfffb011ac560372f-6fa6d7e0128cca93d31-8000.html>

ADL 的完整语法是:

```bash
adl [-runtime runtime-directory]	# 指定运行库目录, 如果未指定,则使用ADL所在的SDK包.
    [-pubid publisher-id]	# 从 AIR 1.5.3 开始,不需要也不应该使用此参数
    [-nodebug]				# 关闭调试支持.(但是trace仍然输出到控制台(mm.cfg))
    [-atlogin]				# 测试应用程序在用户登录时才可执行
    
	[-profile profileName]	# 指定的配置文件对应用程序进行调试, desktop || extendedDesktop || mobileDevice
   
	[-screensize value]		# 当设为 mobileDevice时, 模拟屏幕大小......
    
	[-extdir extension-directory]	# 运行时的本机扩展(ANE)目录......
    
	application.xml			# 应用描述符文件
    
	[root-directory]		# 应用根目录, 如果未指定，则使用 application.xml 的所在目录
    
	[-- arguments]			# 在 “--” 之后显示的任何字符串均作为命令行参数传递到应用
```

#### ADT(AIR Developer Tool)

ADT 是一个 Java程序, 用于开发 AIR 应用程序的多用途命令行工具 http://help.adobe.com/zh_CN/air/build/WS5b3ccc516d4fbf351e63e3d118666ade46-7fd9.html

* 将 AIR 应用程序打包为 `.air` 安装文件

* 将 AIR 应用程序打包为本机安装程序。

  例如：在 Windows 上打包为 .exe 安装程序文件，在 iOS 上打包为 .ipa，或者在 Android 上打包为 .apk
	
* 将本机扩展打包为 AIR 本机扩展 (ANE) 文件

* 1)使用数字证书对 AIR 应用程序签名, 2)更改（迁移）用于应用程序更新的数字签名, 3)创建自签名的数字代码签名证书

* 1)确定连接到计算机的设备, 2)远程安装、启动和卸载移动设备上的应用程序, 3)远程安装和卸载移动设备上的 AIR 运行时

```bash
adt -command options
```

### HTMLLoader

[AIR 中不支持的 WebKit 功能](http://help.adobe.com/zh_CN/air/html/dev/WSb2ba3b1aad8a27b0-67c0013e126afbe6c4d-8000.html)

<http://help.adobe.com/zh_CN/air/html/dev/WS5b3ccc516d4fbf351e63e3d118666ade46-7eb3.html>

```haxe
package;
import flash.display.StageAlign;
import flash.display.StageScaleMode;
import flash.Lib;
import flash.html.HTMLLoader;
import flash.net.URLRequest;

class Main {
	
	static function main() {
		var stage = Lib.current.stage;
		stage.scaleMode = StageScaleMode.NO_SCALE;
		stage.align = StageAlign.TOP_LEFT;
		// entry point
		var html = new HTMLLoader();
        var urlReq = new URLRequest("http://html5test.com/");
		html.width = stage.stageWidth;
		html.height = stage.stageHeight;
		html.load(urlReq); 
		Lib.current.addChild(html);
		
		// 在js如何调用flash中的方法, 在 HTMLLoader 有一个 window 属性, 只要把方法附加上去就行了.
		html.window.console = { log: haxe.Log.trace };
		
		// 反过来, 如果在 flash 中想要调用 js 的方法同样是通过 html.window 属性,但是注意加载的顺序. 参看一些事件.
		haxe.Log.trace("from flash: " + html.window.navigator.userAgent);
	}
}
```

index.html 中的相关代码. 如果需要从 js 中创建 flash 的数据类型,最好是添加 `AIR_SDK\frameworks\libs\air\AIRAliases.js`, 这个文件用起来方便.

```js
if(window.runtime){
	console.log("after flash trace");	// 注意: air并不支持 console, 这个 console 是 上边的函数绑定.
	
	// 在 js 中直接创建 byteArray 对象,需要引入 AIRAliases.js,以方便调用.
	var ba = new air.ByteArray();
	ba.writeByte(60);
		
	ba.position = 0;
	console.log(ba.readByte());
}
```

`frameworks\libs\air\` 目录下的一些脚本

* AIRAliases.js 一些快速访问 flash 的端方法

* AIRIntrospector.js 控制台, 用于协助调试基于 HTML 的应用. 引入后,按下 F12 打开. 这个控制台不怎么好用, 比如没有智能提示

#### CSS 兼容性

CSS3 属性前加上 -webkit 前缀大部分都支持， 比如 `display: -webkit-box`;(不支持 flex 或 -webkit-flex)

总得来说调试器非常不好用, 只能在 HTML 元素上添加修改 CSS , 调试器还得自已刷次一次才会更新右面板的值.

CSS 属性 <http://www.runoob.com/cssref/css3-pr-box-ordinal-group.html> , AIR4.0 ~ 21都没有更新过 WebKit
```css
/* 只这三个属性就可以完美配置 Layout, 记得把顶层包括 body,html 的高度值设为 100% */
/* display: flex */
display: -webkit-box;

/* flex: 1; 给另一个DI以定值,然后这个设 1 就行了, 如果全部相等则设 auto */
-webkit-box-flex: 1;

/* flex-flow: row|column */
-webkit-box-orient: horizontal|vertical|inline-axis|block-axis|inherit;

/* 其它 */
/* 作用于 -webkit-box 上, 像是 ”左中右“ 对齐 http://www.w3school.com.cn/cssref/pr_box-pack.asp */
-webkit-box-pack: start|end|center|justify
/* 作用于 -webkit-box 上, 像是 ”上中下“ 对齐, 注意区别 vertical-align */
-webkit-box-align: start|end|center|baseline|stretch;
/* 投影, 例: 10px 10px 5px #888888; http://www.w3school.com.cn/tiy/c.asp?f=css_box-shadow&p=7 */
-webkit-box-shadow: <h-shadow> <v-shadow> [blur] [spread] [color] [inset];
/* 超出一行是否换行, 相当于 flex-flow: row wrap|nowrap */
-webkit-box-lines: single|multiple
/* 子元素的显示顺序, 相当于 order 用于 flex */
-webkit-box-ordinal-group: 1(integer)

-webkit-box-align: start|end|center|baseline|stretch;

/*timing-function: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n); */
-webkit-transition: property duration [timing-function] [delay];
```

Javascript:

```js
没有 classList 不方便操作 class 属性
没有 Promise
有 Blob, 但没有 ArrayBuffer
一些网页动画想要流畅你需要将 flash 打包成 60 帧
```

#### 保护源码

由于HTMLLoader环境中js代码在loaded事之后eval命令受限, 因此思路是以 loadString 的方法加载动态生成的页面, 并设 placeLoadStringContentInApplicationSandbox 属性为 true. 示例引用: <https://forums.adobe.com/message/3510525#3510525>

下边示例的第二部分是获取 MAC 地址, 但其实 air 有 `NetworkInterface::hardwareAddress` 方法可以做到这个.

```
The method I use will allow you encrpyt most of your source code using a key that is unique to every computer.
 
The initial download of my software is a simple air app that does not contain the actual program. It is more like a shell that first retreaves a list of the clients mac addresses and the user entered activation code that is created at time of purchase. This is sent to server and logged.  The activation code is saved to a file client side.  At the server the mac address and activation key are used to create the encryption key.  The bulk of the program code is then encrypted using that key, then divided into parts and sent back to the client.
The client puts the parts back together and saves the encrypted file.
At runtime the shell finds the mac address list and the activation key, then using same method as server gets the encryption key and decrypts the program file. Run simple check to make sure it loaded. For encyption i found an aes method that works in php and javascript.

Next I use this code to load the program
var loader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
loader.cacheResponse=false;
loader.placeLoadStringContentInApplicationSandbox=true;
loader.loadString(page);
 
This method makes it very difficult to copy to another computer although since I wrote it i know there are some weeknesses in the security but to make it harder i obv. the shell code. It at least keeps most from pirating.
 
However there are issues with this that I have found.
First i was using networkInfo to get the list of mac address but this failed in a test windows XP computer.  When the wireless was off it did not return the MAC.  I was not able to recreate this in VISTA or 7.  Not sure if it could happen.  Was not tested on a mac computer.  To fix this (at least for windows).  I wrote a simple bat file that gets the MAC list, then converted it to an exe which is included.  This does force you to create native installers.  call the exe with this

var nativeProcessStartupInfo = new air.NativeProcessStartupInfo();
var file = air.File.applicationDirectory.resolvePath("findmac.exe");
nativeProcessStartupInfo.executable = file;
process = new air.NativeProcess();
process.start(nativeProcessStartupInfo);
process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onOutputData);
process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, onErrorData);
process.addEventListener(air.NativeProcessExitEvent.EXIT, onExit);
process.addEventListener(air.IOErrorEvent.STANDARD_OUTPUT_IO_ERROR, onIOError);
process.addEventListener(air.IOErrorEvent.STANDARD_ERROR_IO_ERROR, onIOError);
 
put the list  together in the onOutputData event using array.push
and continue on the onExit event
 
using the findmac.exe will return the same info every time (that i know of)
beware thought that using the native install will break the standard application update process so you will have to write your own.  my updates are processed the same way as above.
This is contents of the .bat file to get the mac list
@Echo off
SETLOCAL
SET MAC=
SET Media=Connected
FOR /F "Tokens=1-2 Delims=:" %%a in ('ipconfig /all^| FIND "Physical Address"') do @echo %%b
ENDLOCAL
 
using this method makes it simple to implement at try before you by method.  at runtime if no activation code get try me version from server instead of full version.
```

