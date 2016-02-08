---

layout: post
title:  heaps 简介
date:   2015-3-26 19:27:19
categories: haxelib

---

尽量保持和 [原文档](https://github.com/ncannasse/heaps/blob/master/doc/ref.html) 的致性, 这个文档也是刚刚被提交上去. 位于 heaps 库的 doc 目录之中.


### 简介

Heaps 被设计成为一个跨平台的高性能游戏引擎. 利用现代 GPU 通常可用于桌面和移动设备上.

Heaps 目前使用 OpenGL 支持 HTML5 WebGL, Flash Stage3D, 原生移动平台(IOS和Android)　以及 桌面平台

<!-- more -->

Heaps 主要包含下边几个包:

 * h2d 用于 2D

 * h3d 用于展显 3D 模型

 * hxd 包含跨平台的各种类, 诸如 Bitmaps, 资源加载和管理

 * hxsl 着色器语言实现

### 开始

你需要准备下边:

 * 安装 haxe 3.1, 可在 http://haxe.org 下载[个人注: 最好装 haxe 3.2 版]

 * 将 heaps 添加到 haxelib[解压zip文件后: `haxelib dev heaps heapsDIR`]

 * IDE, [windows 平台个人推荐使用 FlashDevelop]

接下来, 正确运行第一个例:

```haxe
class Main extends hxd.App {
	var bmp : h2d.Bitmap;
	override function init() {
		var tile = h2d.Tile.fromColor(0xFF0000, 100, 100);
		bmp = new h2d.Bitmap(tile, s2d);
		bmp.x = s2d.width * 0.5;
		bmp.y = s2d.height * 0.5;
	}
	override function update(dt:Float) {
		bmp.rotation += 0.1;
	}
	static function main() {
		new Main();
	}
}
```

在编译时确保有添加了 `-lib heaps`.

 * 如果编译为 javascript, 需要自已创建 index.html 并且引入生成的 js 文件

 * 如果编译为 flash, 确保 flash 版本至少为 11.8(-swf-version 11.8)

现在你应该能编译和显示示例: 一个旋转的红色正方形. 

一些其它 2d/3D 的示例在 example 文件夹里可以找到.


第一部分 H2D
------

### H2D概念

在进入到 h2d 时, 这里介绍几个文档中使用的概念:

In-Memory Bitmap 内存中的位图

 * Bitmap(hxd.Bitmap) 一张图片存储于内存,你可以修改或访问其中的某个像素, 在 heaps 中显示这张图片之前需要先转换成纹理(Texture) 

 * Texture(h3d.mat.Texture) 一张分配到显存(GPU memrory)的图片, 你不能访问或修改其中的的某个像素,但是可以用于显示 2D图片或 3D 模型

 * Tile(h2d.Tile) Texture 的子部分,例如一个 256x256的图形可能包含多个图形(graphics),例如 sprite sheet, Tile 是 Texture 其中的一部分,它包含以像素为单位的 位置(x,y),大小(width,height)属性.以及 支点位置(pivot position(dx, dy))

 * Tile Pivot 默认情况下 Tile Pivot 位于 Texture 的 左上角(0,0), 可以通过修改Tile的 (dx,dy)的值使支点(Pivot)移动,例如将 Pivot设置为(-tile.width,-tile.height), 那么将表示为 右下角的 Tile, 更改 Pivot 的值将会影响到 Bitmap Sprite 的显示 以及 执行局部变形(如 旋转)

 * Sprite(h2d.Sprite) 所有 h2d 可显示对象的基类. Sprite 包含有 位置(x,y), 缩放(scaleX,scaleY)和 旋转, Sprite 能被添到加另一个Sprite之中,它将继承父类的转换(transformations),创建场景树(scene tree)

 * Scene(h2d.Scene) 一个特殊的 Sprite 表示场景树的根, 可以很容易通过 hxd.App 中的变量 s2d 访问它. 你需要添加 Sprites　到 Scene 之中用于显示. Scene 还可以处理事件(如 click, touch, keyboard key)

 * Bitmap Sprite(h2d.Bitmap) 一个特别的Sprite 允许显示单一的 Tile 位于 Sprite 中,例如 前边的示例

现在介绍了基本的概念, 让我们回到前边的示例中:

```haxe
class Main extends hxd.App {
	var bmp : h2d.Bitmap;
	override function init() {
		// 使用颜色值分配一个 Texture 并返回一个 100x100 大小的 Tile
		var tile = h2d.Tile.fromColor(0xFF0000, 100, 100);
		
		// 创建 Bitmap sprite, 用于展现 Tile
		// 第二个参数表示创建后将添加到 2D Scene(s2d)
		bmp = new h2d.Bitmap(tile, s2d);
		
		// 修改 Bitmap sprite 的显示位置
		bmp.x = s2d.width * 0.5;
		bmp.y = s2d.height * 0.5;
	}
	
	// 这个方法在每一帧将会被调用
	override function update(dt:Float) {
		// 增加 Bitmap sprite 的旋转值, 每次　0.1　弧度
		bmp.rotation += 0.1;
	}
	static function main() {
		new Main();
	}
}
```

可以通过改变支点(pivot)值很容易地创建 支点旋转, 下边几行将使 Bitmap sprite 围绕中心点旋转:

```haxe
bmp.tile.dx = -50;
bmp.tile.dy = -50;
```

#### Sprite Properties

对于任何 Sprite, 可以访问以下的属性和方法:

 * x,y: 以像素为单位表示位于父对象的位置

 * rotation: 以弧度为单位的旋转值

 * scaleX,scaleY: 默认为(1,1) 表示 sprite 的水平及垂直缩放值, 你可以同时设置这二个值, 通过增量设定sprite.scale(value) 或 设定到指定值 sprite.SetScale(value).

 * visible: 当设为 false 时, sprite 依然在更新(计算位置和动画仍然继续),但只是不会显示包括其子对象

 * parent: 当前父对象(sprite),或者为 null, 如果还未添加

 * remove(): 从父对象中移除自身, 这将防止被 更新及显示

 * addChild(s): 添加子 sprite　到子显示列表的最顶层(和 flash 显示列表一样数字最大即位于显示的最顶层)

Sprite 还包含有其它方法和属性, 详细可以访问 h2d.Sprite API

#### H2D Drawable

通常可以显示在屏幕的都是 h2d.Drawable 类的扩展.

每个 Drawable(包括 h2d.Bitmap) 具有一些可以操作的属性:

 * alpha: 透明度. 取值范转为 0~1.0.

 * color: 

 * blendMode: 混合模式

  - alpha(默认值): 绘制 自身像素的 alpha 值 应用于背景, 不透明的像素将擦除背影,完全透明将被忽略. 

  - None: 禁用背景混合. alpha 通道将被忽略(注: 就是自身不再存在透明,即使设置了透明度). 这提供了最佳的显示性能用于大的背景.

  - Add: 可绘制的颜色将被添加到背景, 可用于创建爆炸或精粒子效果

  - SoftAdd: 类似于 Add, 但会阻止过度的饱和(but will prevent over saturation)

  - Multiply: 乘, sprite的颜色乘以背景色

  - Erase: sprite 的颜色减去背景色

 * filter: 当一个 sprite 已缩放. 默认情况下 heaps 将使用最近的像素平铺显示它.这将为一些游戏创建一些漂亮的像素效果,你可以将 filter 设置为 true, 这将对 sprite 应用 双线性 filter, 使它看上去不那么尖锐显得平滑/模糊.

 * shader: 着色器, 每个 Drawable 可以添加 shader 修改其显示. 着色器将在本手册的后面介绍.

Drawable 的更多属性可以查看 h2d.Drawable API.


#### H2D Animation

在 h2d 上创建动画sprite 是很容易的.

Bitmap 用于显示单个 Tile. Anim 用以显示 Tile 列表并自动播放

```haxe
// 创建 3 个不同颜色的 Tile
var t1 = h2d.Tile.fromColor(0xFF0000, 30, 30);
var t2 = h2d.Tile.fromColor(0x00FF00, 30, 40);
var t3 = h2d.Tile.fromColor(0x0000FF, 30, 50);
// 创建 Anim
var anim = new h2d.Anim([t1,t2,t3],s2d);
```

H2D中, 可以访问 Anim 的下边属性和方法:

 * speed: 改变每一帧　Anim　播放速度, 秒

 * loop: 是否循环,当 Anim 到达最后一帧

 * onAnimEnd: 可设置的 dynamic 方法,当 Anim 结速时将调用

```js
anim.onAnimEnd = function(){
	trace("END!");
}
```

详细可参考 h2d.Anim API.

#### 显示文本

##### H2D Font

在文本处理之前, 我们必须了解 h2d.Font 类:

 1. `h2d.Font` 把它想像成是一个 BitmapFont 管理器, 即给出 指定字符便返回相对应的 Tile.

 2. Ressource 管理器可以轻松实例化 h2d.Font;

 3. 实例化 h2d.Font 我们必须:

  - BitmapFont(对应 hxd.res.BitmapFont) 或

  - True Type 字体(C++ 除外)(个人注:不推荐,因为这实际上只上只是 **运行时动态创建 h2d.Font** -> 参看 `hxd.res.FontBuilder` )

		> windows 系统, 如果资源文件夹找不到指定名称的字体,将会查找 `%system%\WINDOWS\Fonts\` 下的字体,
		> 因此只要知道 字体名就行了


别忘了将 资源文件夹的指向添加到编译参数 `-D resourcesPath=yourPath`, 默认为当前目录的 res 文件夹

将 Bitmapfont 的二个文件复制到 资源文件夹 中: customFont.png 和 customFont.fnt,然后像这样:

```haxe
// 通过 Res　类加载资源
var font = hxd.Res.customFont.toFont();
```

个人补充:

heaps 由于都是 bitmapFont,显示中文没问题,但是 无法调用 IME 输入中文. 如果需要输入需要创建一个 原生的输入框,

 * `h2d.Font` 如前所述, 下边的几个类最终将返回这个类的实例

 * `hxd.res.Font`: (仅flash和html5)当把 ttf 放到 资源文件夹(`-D resourcesPath=yourPath`), 那么这个 ttf 将被 资源管理器(hxd.Res) 自动解析为这个类. 这个类仅仅是获得 ttf 的字体名称,然后调用 FontBuilder.getFont

 * `hxd.res.BitmapFont` 解析 png 和 fnt 文件,返回 h2d.Font

 * `hxd.res.FontBuilder`: (仅flash和html5)根据字体名称动态创建 h2d.Font

这里推荐一个 BitmapFont 的生成工具 https://github.com/andryblack/fontbuilder.

#### H2D Text

h2d.Text 是一个文本字段,可以轻松的更改其属性和文本内容

 * text: 文本内容

 * textColor: 16进制格式颜色值.此属性还修改 color 属性(参见 h2d.Drawable).

 * maxWidth: 文本字段的宽度限制. 文本字段是多行,文本内容长度超过 maxWidth 时将换行。自动换行不会切段单词,即使一个单词的长度超过maxWidth

 * font: 显示文本字体,参阅 h2d.Font

 * letterSpacing: 以像素为单位表示所有字符之间的间隔的整数.默认值为 0;

 * lineSpacing: 以像素为单位表示行之间的间隔的整数.默认值为 0; 对应于基本线之间的间距 ?

 * dropShadow：用于创建文字的阴影效果. 若要禁用将 null 传递给它. 可设置的属性:

  - dx,dy: 偏移位置

  - color: 颜色值

  - alpha: 透明度

 * textWidth,textHeight: 获取像素中文本字段的大小. 只读属性.如需更改宽度,使用 maxWidth

然后, 一个显示文本的示例:

```haxe
// 加载 bitmapFont
var font = hxd.Res.customFont.toFont();

// 创建 文本字段
var tf = new h2d.Text(font, s2d);

// 添加文字阴影效果
tf.dropShadow = { dx : 3, dy : 3, color : 0xFF0000, alpha : 0.8 };

tf.text = "Hello h2d!";
```

### Optimizing many Bitmaps

#### with TileGroup

#### with SpriteBatch

### H2D 事件及交互

### H2D Layers

### Filters

### Scene size and zoom

### 资源管理

H3D
------

### 场景与镜头


### 加载FBX模型

### 使用HMD模型

### 动画系统

### Mesh Material

### Lights

### Shadows

### Multipass explained

### 自定义呈现品


hxsl 着色器
------

### hxsl介绍

### 比较GLSL

### 写你自已的着色器

### 运行时着色器链接


声音
------


工具
------

### 模型查看器

### 粒子编辑器

### Castle DB

杂项
------

### 游戏手柄支持

### 2D和3D碰撞库

### 额外的3D效果

#### 雾

#### FXAA

#### Scalable Ambient Occlusion

<br />

