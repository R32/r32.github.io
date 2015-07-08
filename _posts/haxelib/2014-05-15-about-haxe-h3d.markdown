---

layout: post
title:  heaps
date:   2014-05-13 8:26:10
categories: haxelib

---

这里主要写 heaps 下一些类的一些细节. 


<!-- more -->


### h3d

 * **System** 所有方法或属性都是静态类型.

  - 包含 enum Cursor, 用于定义 鼠标的不同形状, 允许自定义

 * **Engine** 不同平台驱动(driver)方式, 内存(mem)管理

  - 构造函数的 antiAlias 参数,似乎不会起任何作用,像是没实现. 一些基础设置,如修改背影颜色,或设置全屏...



### h2d

游戏示例: [ld-30 Connected Worlds](https://github.com/ncannasse/ld30)

 * **Scene** 2D 场影.
  
	> 通过 setFixedSize(w, h) 来设置一个宽高的基准值, 每次 resize 事件,将会自动以这个值进行缩放.

	> 所以当出现缩放时 h2d.Scene 的 width,height 和 h3d.Engine,并不一致.对于 像素类的 2D 游戏,通常 会设一个很小的基准高宽值,然后缩放到指定大小. 这类游戏 Engine 的高宽值一般为 Scene 的二或三倍.
	
 * **Interactive** 用于交互.

	```haxe
	// 如何给 h2d.Bitmap 添加事件.
	var bmp = new h2d.Bitmap(Res.some_png.toTile(), s2d );

	var it = new Interactive(s2d.width, s2d.height, bmp);
	it.onClick = function(e : hxd.Event){
		trace(e); // ERelease[e.relX,e.relY]
	}
	```	

#### comp

这个目录提供一些 2D UI组件, 可以使用 HTML,CSS 来配置这些, 参看 sample/comps 示例.

 * **Context**

	```haxe
	// 在初使化 h3d 之前可以修改组件默认的 css fileString
	public static var DEFAULT_CSS = hxd.res.Embed.getFileContent("h2d/css/default.css");
	// 优先返回缓存 字体
	public static function getFont( name : String, size : Int ):hxd.Font{}
	// 优先返回缓存 Tile
	public static function makeTileIcon( pixels : hxd.Pixels ) : h2d.Tile {} 
	```


### hxd

这里只记录部分类, 其它都写在 fork 版本的注释上了.

 * bitmap font 工具 https://github.com/andryblack/fontbuilder

  1. fontBuilder 生成的 xml 文件, 一些字体可能 height 的值过高, 可以改为 size + 4 
  
  2. 去掉 fontBuilder 的 Smoothing 选项,这样字体会更清淅,生成的 png 文件更小

  3. 把导出的 `.xml` 扩展名改为 `.fnt`,导出选项里把大写PNG换成小写的

  4. 在 Res.initEmbed({fontsChars: "只支持直接常量字符"}) 或在 initEmbed 之前修改 Charset.DEFAULT_CHARS 

  5. 使用 Res 管理资源, 例: var font:h2d.Font = Res.adobe_fan_heiti_std_b_12.toFont();




#### BitsBuilder

通过宏构建自动生成一些进制位的 掩码及其它, 当你喜欢用二进制的不同位来当标记使用时, 

使用方法:
	
 - 通过在类上添加 @:build(hxd.impl.BitsBuilder.build())

 - 必需要定义名为 bits:Int 的字段,然后初使化为 0. 因为所有对 被标记 `@:bits` 的字段的操作都会改变这个的值.

 - 把 @:bits(len) 附加到各字段上. 接受 Int, Bool, Enum 类型的字段. 如果你需要用 EnumFlags 来配合 enum, 那么请选译 Int 类型. 

   - Int 必须指定 len

   - Enum 类型 len 为可选, 如果不指定将会自计算. 如果 Enum 有 12 个子项, 那么将自动为 4 位, 因为4位就可以表示 15 以下的

   - Bool 则可省略, 自动为 1

```
pubic var bits(default,null):Int = 0;	必须声明 bits 变量,赋值为 0.

@:bits(4) public var lang:Int;			随意自定义一个变量.

这里将会生成静态方法 getLang(v:Int):Int ,	用于将 v 过滤成属性 lang 能接受的值, 这个方法会自动 移位,自动掩码.
										所以 getLang(this.bits) == this.lang,

静态常量:		lang_bits:Int	= 4		;表示 lang 所占用的宽度
			lang_offset:Int	= 0		;由于这是第一个 @:bits, 所以为0, 0 表示为32位数字中最右位
			lang_mask:Int 	= 0xF	;掩码.

成员方法:		lang_set()				;	这个 setter 通过调用 getLang 来过滤  

通常来说不必理会静态方法及静态常量, 正常赋值就行了(会自动调用setter过滤) 

参看 h3d.mat.Pass 如何使用它
```

如果想直接把一个很大的值直接赋值给 bits, 需要依次调用各属性的 getName 的静态方法, 示例:

```haxe
@:build(hxd.impl.BitsBuilder.build())
class Test{	
	// Define a variable called bits
	var bits:Int = 0;
	@:bits(8) var b:Int;		// LOW
	@:bits(8) var g:Int;
	@:bits(8) var r:Int;
	@:bits(8) var alpha:Int;	// High
	
	public function new() {
		// init bits from value
		var color = 0xF0D0B0A0; 		// argb;
		this.alpha = getAlpha(color);	// static func
		this.r = getR(color);
		this.g = getG(color);
		this.b = getB(color);
		trace("0x" + StringTools.hex(bits));
		// -------------------------
		this.r = 0x60;
		this.g = 0x50;
		this.b = 0x30;
		trace("0x" + StringTools.hex(bits));	
	}
}	
```


#### res目录

这个目录包含用于处理资源的类.

 * **Embed** 

	> 例如: 宏方法 `Embed.embedFont("nokiafc22.ttf");` 将资源文件夹或系统字体文件夹下的字体嵌入到 SWF. 

	> 不支持 otf 类型.嵌入后通过调用 FontBuilder.getFont() 运行时方法,将指字的字符一个一个地画到Tile上. 字体嵌入不是必须的.

	> 宏方法 getFileContent(path2name) 一个从文件中加载字符

	> 宏方法 getResource(path2name) 返回一个 hxd.res.Any 对象.这个方法还展现了如何将一个 Bytes 的变量传递给回宏返回.

 * **FileTree**  扫描资源文件夹,res 主要的宏构建类.

	> 如果打算将 wav 转换成 mp3(if options.compressSounds), 则需要下载 `lame` 转换器,并且添加到路径,  
	
	> 另外`LocalFileSystem.hx` 文件(仅限于本地文件系统),LocalEntry 类的方法 convertToMP3,这里需要修改 lame 的正确路径. 最好在外部先调用命令行转换成 mp3 再放入资源目录.
 
 * 使用设备字体输出中文字符,只适用于 flash

	> 当中文字符太长(3750个字符),在嵌入时将会发生 IO 错误. 所以还是使用外部 bitmap font 工具来生成吧.

	```haxe
	// CN_STR 为常用中文字符(3750).
	// 实际上 FontBuilder 是将字符一个一个地 draw 到 bitmapData 中
	var font = FontBuilder.getFont("simfang", 16, { chars: MRes.CN_STR,antiAliasing : false} );
	```
### hxsl

[参看 hxsl 的单独记录]({% post_url  haxelib/2014-11-16-hxsl %}).


legacy 
------

### 源码简析

 * comp


  - **Parser** HTML 解析器. 

		> 这个类使用了 **`hscript`** 来动态解析 html 标签上的 脚本.
		
		> 示例: `sample/comps/components.html`, `tools/perlin/PerlinView.hx`, `h3d/parts/Editor.hx`
		
  - **JQuery** 可以在 HTML 标签上写脚本

 * css

  - **Parser** css 解析器.
		
		> 和普通的 css 不一样的是 `:hover` 其实也是解析成 className. 例如:当光标悬浮于组件上时, 会自动执行  addClass(":hover")
		
		> 示例参见 default.css
  
  - **Style** 包含解析后的 CSS 属性对象

  - **Defs** 一些 CSS 值数据定义,用于需要给 style 的一些属性赋值时.

  - **Engine** 将 样式(Style) 应用到 组件(Component) 上去.

  - **default.css** 组件默认的样式配置. 在初使化之前可以通过 comp.Context.DEFAULT_CSS 修改默认组件样式



### `tool`

 * `fbx`

	> 可以用来预览 `.fbx`.

 * `parts`

	> `air` 粒子生成器. 因为要保存文件,需要在 AIR 中运行.
	
	```haxe
	// %flex_sdk%\bin\adl parts.app
	import h3d.parts.Data;
	// extends hxd.App
	// default.p 为粒子生成器保存的文件.
	var state:State = Unserializer.run(Embed.getFileContent("res/default.p"));
	// 可以更换 texture
	state.frames = [State.defPart.toTile()];
	
	var emit = new Emitter(state, s3d);	
	```

 * `perlin`

	> flash perlin.
	
	> h2d ui 示例
	
 * `xbx`

	> `neko` 将 `.fbx` 文件压成 `xbx`格式.
	
	> 这是一个很好的如何使用 `format.zip` 和 如何创建一个简单命令行程序的示例


