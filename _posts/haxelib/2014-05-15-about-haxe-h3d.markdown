---

layout: post
title:  heaps
date:   2014-05-13 8:26:10
categories: haxelib

---

[**`heaps`**](https://github.com/ncannasse/heaps) 当目标平台为 flash 时将基于 flash.stage3D, 而 平台为 js 时, 将使用 webgl. 以前名字为 h3d, 如果需要使用以前旧的 h3d 版本, 在 github 页面上找到 h3d 这个分支即可

注: 很多说明都已经直接在 fork 版本的源代码中已经给出注释. 这里只是提到一下而已

<!-- more -->



### h3d

 * **System** 提供一些静态方法

  - 包含 enum Cursor, 用于定义 鼠标的不同形状, 允许自定义

  - 所有方法或属性都是静态类型. 参考 API 或源码.

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

**如果想直接把一个很大的值直接赋值给 bits, 需要小心**,需要调用 getName 的静态方法,如上示例: this.lang = getLang(bits_num),
把每个分配了 `@:bits` 的字段,依次通过 静态方法 getName 过滤就行了.

本来给这个类添加一些代码,让支持 EnumFlags 的, 但是发现 setter 的参数返回值 和 字段类型冲突. 因此无法实现:

```haxe
case "haxe.EnumFlags":
	switch(vt.toType()) {
		case TAbstract(_, ae):
			//et = ae[0].toComplexType(); 
			bits = ae[0].getEnum().names.length;
		case _: throw "Class instance expected";		
	}
	macro Type.enumIndex(v);
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

一些概念可以先参考 haxelib 中的 hxsl 文档 http://old.haxe.org/manual/hxsl

一些 AGAL 的内容.http://www.adobe.com/cn/devnet/flashplayer/articles/what-is-agal.html


#### 着色器表达式(Shader expression)

```haxe
class ColorKey extends hxsl.Shader {

	static var SRC = {
		@param var colorKey : Vec4;
		var textureColor : Vec4;

		function fragment() {
			var cdiff = textureColor - colorKey;
			if( cdiff.dot(cdiff) < 0.00001 ) discard;
		}
	}

	public function new( v = 0 ) {
		super();
		colorKey.setColor(v);
	}

}
```


**hxsl 自定义元标记**, 参看上边使用示例


```haxe
@local		... 局部变量?

@global		... 对应 类hxsl.Globals, 像是类的 全局静态变量?

@var		... 可变寄存器 ???(a varying variable, that is set in vertex shader and read in the fragment shader)

@param		使这个标记的变量能在 类 中访问.

@input	 	...输入的变量来自顶点缓冲区(the input variables are the ones that come from the vertex buffer)

@function	...

@output		...

@const		... 常量寄存器?

// 二个带 : 的元标记
@:import

@:extends


//对应的 enum
enum VarKind {
	Global;
	Input;
	Param;
	Var;
	Local;
	Output;
	Function;
}

enum VarQualifier {
	Const( ?max : Int );
	Private;
	Nullable;
	PerObject;
	Name( n : String );
	Shared;
	Precision( p : Prec );
}


	function applyMeta( m : MetadataEntry, v : Ast.VarDecl ) {
		switch( m.params ) {
		case []:
		case [ { expr : EConst(CString(n)), pos : pos } ] if( m.name == "var" || m.name == "global" || m.name == "input" ):
			v.qualifiers.push(Name(n));
		case [ { expr : EConst(CInt(n)), pos : pos } ] if( m.name == "const" ):
			v.qualifiers.push(Const(Std.parseInt(n)));
			return;
		default:
			error("Invalid meta parameter", m.pos);
		}
		switch( m.name ) {
		case "var":
			if( v.kind == null ) v.kind = Var else error("Duplicate type qualifier", m.pos);
		case "global":
			if( v.kind == null ) v.kind = Global else error("Duplicate type qualifier", m.pos);
		case "param":
			if( v.kind == null ) v.kind = Param else error("Duplicate type qualifier", m.pos);
		case "input":
			if( v.kind == null ) v.kind = Input else error("Duplicate type qualifier", m.pos);
		case "const":
			v.qualifiers.push(Const());
		case "private":
			v.qualifiers.push(Private);
		case "nullable":
			v.qualifiers.push(Nullable);
		case "perObject":
			v.qualifiers.push(PerObject);
		case "shared":
			v.qualifiers.push(Shared);
		case "lowp":
			v.qualifiers.push(Precision(Low));
		case "mediump":
			v.qualifiers.push(Precision(Medium));
		case "highp":
			v.qualifiers.push(Precision(High));
		default:
			error("Unsupported qualifier " + m.name, m.pos);
		}
	}
```






旧的内容
------

**注意:** 下边是以前旧的内容,也就是 heaps的 h3d 分支内容. 这个分支使用的是 haxelib hxsl.


### h3d/h2d

 h2d 似乎在设计上就是作为 UI, 因此一些动画,碰撞检测的方法都比较底层, 可以使用 XML(组件布局) 和 CSS(样式) 配置 UI.

 h2d 游戏源码示例:

 * [ld-25 You are the Villain](https://github.com/ncannasse/ld25)

 * [ld-27 10 seconds](https://github.com/ncannasse/ld27)

 * [ld-28 You only got one](https://github.com/ncannasse/ld28)

### h3d/hxd
 
 * **Res** 资源管理

	> 定义`-D resourcesPath=dir` 之后,Res.hx 相关宏构建将描描资源文件夹,让 IDE 有智能提示

	> 上行操作并不会嵌入文件,需要主动调用 Res.initEmbed() 将文件嵌入到 flash.

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

 * **App** 主应用

	> 继承这个类,从而快速调用 h3d

 * **Tile** 

 	> 为了避免 dispose, 应该尽量使用 sub 方法从主 Tile 上新建一个出来.

	> scaleToSize(w, h) 是个不错的方法.例如: 当需要 32x32 的图,直接 scaleToSize(32,32) 就行了.

 * **Texture** 



 * Stage 对 flash.display.Stage 进行了包装.


 * **Event**  h2d.Interactive 事件参数类型.

 * res 文件夹

  - 这个目录大多数都属于 Resource 的了类.

  - **Image** 图片资源解析,只支持 jpg 和 png.

		> 将图片转出为 hxd/res 下的各种格式。

  - **Sound**

		> 不知道,为什么不用 @:sound("file.wav|mp3") 的方式嵌入???
		
		> 这个类播放声音是以 Bytes 的方式加载音乐的.


		
  - **Loader**  建立在 各文件类 上的一个方法汇总

  - **Any**  建立在 Loader 上的一个方法汇总


 * impl 文件夹

  - **Memory**  管理 domainMemory

		> 使用 flash.Memory 前先 select(bytes) ,完了后 调用 end().
		
  - **Tmp**  Bytes 缓存池

		> getBytes(size) 		// 将优先从缓存池里返回Bytes
		
		> saveBytes(bytes)	// 将bytes 释放回缓存池内
  
  - **`FastIO<T>`**  像是一个抽像化的数组.优先会使用 Vector 替代 Array。

  - **FastIntIO**  继承 `FastIO<Int>`, 多了一些针对 **位** 的操作方法.
				
  - **ArrayIterator**  继承这个类,方便 for 便历.

		```haxe
		// from h2d/Sprite.hx
		public inline function iterator() : hxd.impl.ArrayIterator<Object>{
			return new hxd.impl.ArrayIterator(childs);
		}
		```
 * poly2tri 文件夹  多边形 to 三角形???
					 


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


