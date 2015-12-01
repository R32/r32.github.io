---

layout: post
title:  castle(可视数据编辑)
date:   2014-06-07 7:26:01
categories: haxelib

---

[castleDB] 是游戏 [evoland 2](http://www.evoland2.com/) 的静态数据编辑器

 * 为什么

  - castleDB 用于 **可视化** 的输入结构化静态的的数据

  - 通常存储于 XML 或 JSON 文件中的数据都可以使用这个工具代替,并且做添加和修改

  - 比如当你在做一个游戏时, 你可以将所有物品和怪物它们的 名字,描述,逻辑...等等这些属性通过 castleDB 存储

<!-- more -->

 * 如何

  - castleDB 看上去像上一个电子表格编辑器, 但 castleDB 的每一个表格都有对应的"数据模型"

  - 编辑器通过这个"模型" 验证数据,简化用户输入

 * 存储格式

  - castleDB 存储其"数据模型"和"数据行"为一个简单易读的 JSON 文件

  - JSON 文件很容易被其它程序加载使用

  - 它能更简单地处理游戏物品以及怪物的各种数据

 * 协作

  - 由于其储存格式为 JSON + 换行, 因此 git 或 svn 等版本管理软件更能显示其数据修改差异。

### 安装

 - 下载 [Node Webkit](https://github.com/nwjs/nw.js) 如果已有则可以跳过这一步.

 - 下载 [CastleDB](https://github.com/ncannasse/castle)

	> 如需在 haxe 中调用,　可以 haxelib dev 的方式添加到本地库.
	
	```bash
	# castle-master 为　解压后所在文件夹
	haxelib dev castle castle-master
	```
	
 - 当位于 castle 的目录中内时, 在命令行下输入: `nw.exe bin` 就行了. bin 为目录名

	```bat
	@echo off
	
	:: 设置 nw.exe 所在路径及文件名
	set NODE_WEBKIT="E:\Program Files\nw\nw.exe"
	
	:: (旧的)设置 castle.zip 所在路径及文件名
	::set APP_CASTLE="E:\Program Files\CastleDB\bin\castle.zip"

	:: 设置 bin 路径, 注意不要有反斜号
	set APP_CASTLE="E:\Program Files\CastleDB\bin"


	:: start 命令以二个 双引号开始,以正确处理带有空格的目录
	start "" %NODE_WEBKIT% %APP_CASTLE%
	
	exit
	```

 - **帮助文档** 在解压包的 www 目录中

### 数据模型

castleDB 保存为一个扩展名为 `.cdb` 的文件, 其实它是一个 JSON 文件。

```json
"sheets": [
	{
		"name": "items",
		"columns": [{
			"typeStr": "0",
			"opt": false
			"name": "id"
		},{
			"typeStr": "14",
			"opt": true
			"name": "name"
		}],
	//......	
]		
```

 * 一个数据库由几个工作表(sheet)组成. 每个工作表为结构化的对象(类似于传统数据库中的表)的集合

 * 每个表包含多个列(columns), 列表示存储数据对象字段(fields)

 * 每个列都有一个给定的"类型"表示此列中存储数据的种类

 * castleDB 处理列(columns)的重命名,删除及列类型之间的转换

### 列类型

以下为可用的"列"类型:

 * **Unique Identifier**(唯一标识符): 作为行数据的唯一标识符, 它允许其它表(sheet)或列(column)引用这一行数据. 唯一标识符必须是有效的代码标识符 `[A-Za-z_][A-Za-z0_9_]*`

 * **Text**(文本): 字符串文本。 任意文本,目前不允许多行文本.

 * **Boolean**: 可以通过复选框(checkBox)来选择 true 或 false。

 * **Integer** 整数, 没有小数

 * **Float** 任意数

 * **Color** 表示 RGB 的整形数值.

 * **Enumeration**(单项选择): 在给定的多个选项中必须并且只能选择一个。 (添加列(column)时, 用逗号分隔各项值)

 * **Flags**(多项选择): 在给定的多个选项中随意选择多个或者一个都不选.例如: `hasHat, hasShirt, hasShoes`, (添加列(column)时, 用逗号分隔各项值)

 * **Reference**(引用):, 通过 Unique Identifier 引用其行数据

	> 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
	
	> 内容只能是同一个表,可以是别的表,但是建立后不能修改.

 * **File**(文件): 目标文件或图片的相对或绝对路径

 * **Image** 要显示的图片, 

 	> JSON格式: 这个列的值为一个图片的 md5 值, 这时和 `.cdb` 会存在一个同名的 .img 后缀的 JSON 文件, 文件格式类似于 `{"md5string": "data:image/png;base64,........"}`
	
 * **Tile** 类似于图片,一张图片上存放多个 Tile,类似于 SpriteSheet
	
 * **List** 当类型为 List 将创建一个新的隐藏子表。 [见后边章节描述...](#list-column)
	
 * **Custom**(自定义): 自定义类型. [见后边章节描述...](#custom-column)

	通过点击 IDE 的右下角的 `edit type` 打开一个空白页面, 示例都是 enum 类型的, 和普通的 Enumeration 比起来,
	
	Custom Type 的 enum 是带有 构造方法的. 示例如下: 

	```haxe
	enum Super2 {
		A;
		B;
		C( x : Int );
	}

	enum Effect2 {
		// 构造参数可以添加前缀 `?`, 这意味着参数为可选参数可省略
		Poison( time : Float, ?power : Float );
		Check( a : Super2 );
		Monster( m : monsters );
	}
	
	// custom 类型的构造参数使用下列类型:
	// Int: 
	// Bool:
	// Float:
	// String:
	// CustomType: 自身
	// SheetName: 任意 sheet name
	```
	custom 类型的储存原型为混合数组类型(`Array<Dynamic>`), 数组的第一个元素为索引:
	
	```
	Value example				Stored value
	Fixed						[0]
	Random(0.5)					[1,0.5]
	Monster(MyMonsterId)		[2,"MyMonsterId"]
	Or(Random(0.5),Fixed)		[3,[1,0.5],[0]]
	```
	编辑器将严格验证 Custom 类型 的输入
	
 * **Dynamic** 可以输入任意 JSON 数据, 不过手工输入这个字段的数据类型有些麻烦.

	> 注意区别这个和 List 字段, 相对于Javascript, 如果 List 为 Array, 那么 Dynamic 就是 Object

 * **Data/Tile Layer** 包装图层(layer)的数据用于地图编辑器, TODOS


### 列存储及默认值

下边表格说明每个类型到 JSON 文件的存储方式:

列(column)类型     |     存储     | 默认值
----------------- | ----------- | --------
Unique Identifier | 标识字符串 | `""`
Text    | 文本字符串      | `""`
Boolean | ture 或 false  | `false`
Integer | 整数值  | `0`
Float   | Number | `0`
Color   | 整型数值 | `0`(黑色)
Enumeration | 所选值的索引(整形) | `0`(第一个值)
Flags  | 为所选的值的索引设置二进制位(bit) | `0`(没有任何值被选中)
Reference | 引用的 uid(唯一标识符) | `""`(缺少标识符)
File  | 文件的相对(如果可能)或者绝对路径 | `""`(丢失的文件)
Image | 图像的 Md5 值,(图像的 base64 值分离存储于另一个同名的 .img 文件) | `""`(图像缺失)
Tile  | 类似于 `{file:"some.png", size: 16, x:5, y:5}` 并带有可选的 width,height 的结构 | `null`(tile缺失) 
List  | 多个结构组成的数组, 了解更多... TODOS | `[]`(空数组)
Custom | 多个混合类型, 了解更多... TODOS | `null`(缺少类型)
Dynamic | 自定义的JSON结构数据 | `null`
Data Layer | width x height 的字节编码为base64格式 | `""`(空图层)
Tile Layer | 类似于DataLayer或者是结构数组(`Array<Struct>`) | `""`(空图层)

#### 可选字段(Optional Column)

如果取消复选框Required, 那么在创建/修改字段时,默认的数据将为 `null`, 此外如果这个字段没有任何数据,存储时将被删除.

### 使用 CastleDB

#### 加载和保存

在文件菜单中, 通过 New, Load, Save As 菜单项。 每次发生更改时都会自动保存。

#### 快捷键

一些常用快捷键:

 * 使用"箭头"在单元格之间导航, 直接在单元格上键入或都使用`F2`或`Enter`来编辑。
 
 * 使用 `ESC` 键退出单元格编辑或关闭打开的 List

 * 使用 `Insert` 在光标位置插入一个新行

 * 使用 `Ctrl+Z` 和 `Ctrl+Y` 撤消/重做。

 * 使用 `Tab` 和 `Shift+Tab` 导航到 下一个/上一个 同行单元格。(箭头左和右)

 * **!(似乎只有这条值得关值)** 使用 `F4` 跳转至 **被引用** 的单元格, `F3` 则搜索谁引用了这一行数据。

#### 管理表

通过右键点击或编辑器底部的标签选项:

 * 添加新的表格(New Sheet)

 * 移动表调整它们的顺序

 * 重命名和删除表

 * 访问表选项, 如 索引(Index)和组(Group)

#### 管理列(字段)

通过 **右键** 单击表的标题栏,有如下选项:

 * 编辑列(字段)允许重命名,更改类型(如果可以)和值是否能为空(复选框Required)

 * 移动列顺序, 添加新列

 * 删除列或将其设置被引用时显示此字段文本描述(这个文本字段字体将变为斜体）以及在引用时显示此图标,

 * 一些转换,比如字符串的大小写转换, 数字的调整

CastleDB 提供列类型之间的自动转换， 这个经常用于“复制/粘贴”在"表/字段"之间， 如果转换无效将会得到错误提示.

#### 管理行

通过 **右键** 单击表的其中一行,有如下选项:

 * 互换上下行的位置, 也可以通过 `Ctrl+上` 和 `Ctrl+下`(在选择整行的情况下) 

 * 在光标位置将插入新行(插入到当前行的下一行),或者按 `Insert` 键

 * 删除所选行, 或选择整行的情况下按 `Delete`

 * 插入和删除分隔线(插入到当前行的上一行)

 * 查找谁引用了这一行(需要唯一标识符), 或按下 `F3`

#### 选择

 * 通过点击左侧索引选择一行, 然后单击时按住 `shift` 键进行行数据多选.

 * 在选择一个单元格,然后按住 `shift` 进行单元格多选

 * 可以使用复制/粘贴(`Ctrl+C`,`Ctrl+V`和`Ctrl+X`)

### 更多的功能

 - **显示字段**,如果你右键单击某一列(Text字段)并选 `Display Column`（字段字体将变为斜体）, 那么这个字段将替代"唯一标识符"显示在被引用的地方

	> 这可以用于显示更易读的名字而不是唯一标识符, 数据的存储依然是使用唯一标识符。这个选项只影响 CastleDB编辑器的显示方式
	
 - **显示图标**, 参考上行描述，右键点击字段名选 `Display icon`, 图标将作为引用显示

 - **索引**, 当你打开 CastleDB 时, 索引基于 0 开始

	> 通常索引不会作为数据导出，但可以通过在表名上右键菜单中选上 `Add Index`, 这时导出的数据将带有索引。
	
	> 对于 List 类型字段,索引将作为字段唯一

 - **分隔符**, 如果右键单击行数据, 可以在当前行上前边添加分隔符, 双击这个分隔符可以为其命名.

 - **添加组**, (依赖分隔符)通过右键点击表格名,选上 `Add Group`, 则将创建一个通过 **分隔符** 简单分离的组,

  - 这允许简单分类而无需创建特定的字段来区分

### 高级类型

这里补充前边没有详细说明的字段类型

#### List Column

当列（字段）的类型设置为 `List` 时,一个新的隐藏的表将被创建。然后可你像修改其它表一样处理这个子表。

与普通表的区别是这个子表将直接在原表的行上操作, 你可以点击 List 字段的单元格切换到子表。

List 类似于 one-to-many 的数据库关系

#### Image Column

插入到 CastleDB 的图像将另外保存为 `.img` 文件, `.cdb` 中只有这个图像的 Md5 值。

因此，相同的图像可以被多次重复使用而不会增加总文件的大小。

如果你做了许多图像改变，可以通过菜单命令 `File -> Clean Image` 删除从 `.img` 中引用图像

#### Custom Column

自定义类型建义参考 haxe 语言的中的 enum(或函数式语言中所说的 Variants),

对于自定义类型可以通过点击 IDE 右下角的 `Edit Types`

这是一个示例:

```haxe
enum MyCustomType {
	Fixed;
	Random( v : Float );
	Monster( ?m : monsters );
	Or( a : MyCustomType, b : MyCustomType );
}
```

在这情形下, 这个自定义类型字段的值可以是:

```haxe
Fixed
Random(0.5)
Monster(MyMonsterId)
Or(Random(0.1), Fixed)
```

自定义类型的构造器参数可以使用以下类型:

 * `Int, Bool, Float, String`

 * `Custom` 任意自定义类型,包括自身

 * `SheetName` 创建的任何表名(sheet name)

如果构造器参数带有前缀 `?` 则表示这个参数为可选参数。

自定义类型的保存到 JSON 文件中的格式为数组形式.该数组的第一个元素是此构造器名字的索引值,构造器参数紧随其后.

值示例   | 保存到 JSON 中的格式
:-------| --------:
Fixed       | [0]
Random(0.5) | [1,0.5]
Monster(MyMonsterId)   | [2, "MyMonsterId"]
Or(Random(0.1), Fixed) | [3, [1, 0.1], [0]]

<br />

地图编辑器
------

可以在下载包中的 www 目录找到一个名为 `sample.zip` 的示例文件。后边将使用其作为参考。

 * 使用 CastleDB 创建 Level(关卡)和其它IDE的差异是: 你可以关联每个 images/tiles 到其它的数据，使得你有一个统一的框架来创建游戏的全部内容。

### 创建关卡(Create Level)

当创建一个新表, 将复选框 `Create Level` 选中即可创建一个关卡表(level sheet), IDE 将自动创建 level表所需要字段(以前旧的版本需要自已添加这些字段)。

之后你可以通过点击"行"最左侧的 `edit` 按钮编辑它们

### 图层(Layers)

一个 layer 是包了一组信息的字段存储于 level表中，有如下几种 layer:

 * **Tile Layer** 在创建level表后就可以创建这些层,

 * **List Layer**

 * **Index Layers**

 * **Zone Layer**


#### Layers

layer 是一个储存了 Level 的信息字段, 主要分为:

 * **List Layer:** 列表层,如果你添加一个 List 到你的 Level sheet, 这个 List 包含有 Number 类型的 x 和 y 属性, 这将是 list layer,  可以以可视化的方式自动填充 x,y. 当每次当点击 map preview(纯色背景板) 时, 可以添加额外的属性/列到 List 能够直接输入到编辑器

 * **Index Layers:** 索引层 如果你想要画一些东西储存在一个紧凑数组中, 添加 Layer 类型 column到 level sheet, 作为一些限制你可能不能定义每个单元格的类型, 如果你不是在 first layer, first layer(索引为0) 将不会显示而且被当成 "没有信息" 

  - 感觉这里应该是 List<Layer> 类型,而不是 单纯的 Layer

 * **Zone Layer** 区域层, 非常像 列表层除了还包含有 Number 属性 width,height, 它将被显示成为 map 区域在 地图编辑器中

(个人注: 上边三种类型可以创建纯颜色块的2D 地图)

Tips: 添加 layers:List(name:Text, data:Tile Layer)] 列, 可选将会出现 new Layer 按钮

##### Layer Display

layer 取得一些信息从引用它的目标

 * 如果 reference 有字段类型 Image, 将使用这 图片 用于显示

 * 如果 reference 有字段类型 Color, 将使用这 颜色 用于显示

 * 如果无有效信息, 你可以在编辑器上自定义层颜色

##### Grid and Precise coords

栅栏与精确坐标, index layers 将总是为 grid-aligned. 其它 layers 可以有更精确的位置, 如果你使用 Float 类型作为位置(x,y)类型,即使这种情况下你仍然可以激活 Lock Grid 选项.

默认的 grid size 为 16 像素, 可以在 level 选项中修改.


### 代码中调用

在 Haxe 中调用. flashdevelop 能很好地提供智能提示,以避免打错字符. 参看 www/index.html 以及 src/test. Test.hx:

```haxe
import dat.Data;

class Test {	
	static function main() {
		#if js
		dat.Data.load(null);
		#else
		dat.Data.load(haxe.Resource.getString("test.cdb"));
		#end
		
		// items 为 表名(sheet name)
		// sword 所属字段类型为 Unique Identifier 
		trace(dat.Data.items.get(sword).alt.fx);
		trace(dat.Data.items.get(sword).alt.test);
		trace(switch( dat.Data.items.get(herb).fx ) { case Monster(m): m.id; default: null; } );
		
		for( s in dat.Data.monsters.resolve("wolf").skills[0].sub )
			trace(s);
		
		// If the sheet does not have an unique identifier, only the all field is available.
		// If the sheet has an unique identifier, you can access the all field, but also use get (by id) and resolve (by string). 	
	}	
}
```

Data.hx: 这个类仅仅只使用宏来解析 数据类型,不会解析数据, 仅提供 sheet name 的智能语法提示.


```haxe
package dat;

// Init 名字随意
// 这里的宏只解析 test.cdb 里的类型并不会解析数据, 数据需要在 运行时 load()
private typedef Init = haxe.macro.MacroType < [cdb.Module.build("test.cdb")] > ;
```


### 其它

 * 修改 columns 时,别按回车键,因为默认为 `delete`

 * **重要**: 表名(sheet name)不要以大写字母开头
