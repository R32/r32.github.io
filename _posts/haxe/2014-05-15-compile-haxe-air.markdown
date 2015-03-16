---

layout: post
title:  将 SWF 打包成 AIR
date:   2014-05-13 9:26:10
categories: haxe

---

最简单的方法是用 `flashdevelop` 创建一个 `haxe/air` 的示例.

<!-- more -->

对于一些 AIR 属性的类, 你需要使用 haxe 的类库 air3,详情见: `haxelib info ari3`

#### 创建 `air app.xml`

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






#### 创建 swf

先需要编绎成常见的 swf 格式. 细节参看: [编绎haxe](http://haxe.org/doc/compiler)

```bat
haxe -main Main -swf Main.swf
```





#### `AIR`

 * `Debug` 调式运行

    ```bat
    :: 命令很简单,不需要 certificate 文件
    :: swfdir可以为空,则为当前目录
    adl %APP_XML% %swfdir%
    ```
 * 打包

    下边 `.bat` 提取来自 `flashdevelop` 的 `haxe/air` 示例.

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





