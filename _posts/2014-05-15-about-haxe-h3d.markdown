---

layout: post
title:  简单描述 h3d
date:   2014-05-13 8:26:10
categories: haxelib

---

[**`h3d`**](https://github.com/ncannasse/h3d) 是一个 `flash 3D` 引擎,基于 `flash.stage3D`, 目前只适用于 `flash` 平台.

另一个fork版本 [motion-twin/h3d](https://github.com/motion-twin/h3d) 似乎可以通过 openfl 跨平台.

 这个库有很多好的工具类.一些细节以后有时间我会在 `h3d` 的 `API` 中注释.


<!-- more -->


<br />



#### `h2d,h2d`

 这是主要的库文件，将在 API 中注释这些内容

#### `hxd`

 * `Res` 资源管理

 > 可以自动扫描 `-D resourcesPath=dir` 定义的资源文件夹,然后宏构建,使IDE智能提示相应文件名.

 > `initLocal()`只适用于 AIR, `initEmbed()`则会以嵌入的方式处理资源. 二个方法二选一,用来初使化 `Res.loader`

 > 注意:Res类 initEmbed之后默认自动嵌入的字体只包含 Charset.DEFAULT_CHARS

	```haxe
	// hxd/res/FileTree.hx::handleFile() 可以看到资源被解析成的类型.
	switch( ext.toLowerCase() ) {
		case "jpg", "png":
			return { e : macro loader.loadImage($epath), t : macro : hxd.res.Image };
		case "fbx", "xbx", "xtra":
			return { e : macro loader.loadFbxModel($epath), t : macro : hxd.res.FbxModel };
		case "awd":
			return { e : macro loader.loadAwdModel($epath), t : macro : hxd.res.AwdModel };
		case "ttf":
			return { e : macro loader.loadFont($epath), t : macro : hxd.res.Font };
		case "fnt":
			return { e : macro loader.loadBitmapFont($epath), t : macro : hxd.res.BitmapFont };
		case "wav", "mp3":
			return { e : macro loader.loadSound($epath), t : macro : hxd.res.Sound };
		case "tmx":
			return { e : macro loader.loadTiledMap($epath), t : macro : hxd.res.TiledMap };
		default:
			return { e : macro loader.loadData($epath), t : macro : hxd.res.Resource };
	}

	```

 * `App` 主应用

 > 继承这个类,从而快速调用 h3d

 * res/Image 图片资源解析,只支持 jpg 和 png.

 > 将图片转出为 hxd/res 下的各种格式。

 * Embed

 > 例如: 宏方法 `Embed.embedFont("nokiafc22.ttf");` 将资源文件夹或系统字体文件夹下的字体嵌入到 SWF. 

 > 不支持 otf 类型.嵌入后通过调用 FontBuilder.getFont() 运行时方法,将指字的字符一个一个地画到Tile上. 字体嵌入不是必须的.

 > 宏方法 getFileContent(path2name) 一个从文件中加载字符

 > 宏方法 getResource(path2name) 返回一个 hxd.res.Any 对象.这个方法还展现了如何将一个 Bytes 的变量传递给回宏返回.

 * 使用设备字体输出中文字符,只适用于 flash

 > 由于中文字符太大(3750个字符),在嵌入时发生了 IO 错误.

 ```haxe
// CN_STR 为常用中文字符(3750).
// FontBuilder 其实一个字符一个字符的 draw 到 bitmapData 中
var font = FontBuilder.getFont("simfang", 16, { chars: MRes.CN_STR,antiAliasing : false} );
 ```


<br />



#### `tool`

 * `fbx`

	> 可以用来预览 `.fbx`.

 * `parts`

	> `air` 粒子生成器.

 * `perlin`

	> flash perlin.
	
	> h2d ui 示例
	
 * `xbx`

	> `neko` 将 `.fbx` 文件压成 `xbx`格式.
	
	> 这是一个很好的如何使用 `format.zip` 和 如何创建一个简单命令行程序的示例




