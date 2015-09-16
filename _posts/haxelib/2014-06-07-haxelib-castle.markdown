---

layout: post
title:  castle(可视数据编辑)
date:   2014-06-07 7:26:01
categories: haxelib

---

[castle] 是一个基于 [Node Webkit] 的应用. 外观看上去像类似于Excel的电子表格. 是 JSON 格式 **行数据** 的编辑器.

**适用环境**

这个工具主要是用于 **集中处理** 一些 数据类, 看上去适用于一些配置文件(Config)或类.
 
 > 如果使用 Haxe,在代码中引用这些数据时 IDE 会有语法智能提示, 以避免打错字符.

 > 如果不使用 Haxe, 把 castle 生成的 .cdb 文件当成普通的 JSON 文件外理就行了. 

而且由于 数据的集中处理, 单独更改这些数据也方便, 这样就不必在代码中修改这些数据.
比如 用于 游戏中怪物的血量, 等级, 类型,移动速度,甚至系关联的图像 等等. [游戏示例(haxe/flash)](https://github.com/ncannasse/ld30)




 [CastleDB]:(https://github.com/ncannasse/castle)
 [Node Webkit]:(https://github.com/rogerwang/node-webkit)
 
<!-- more -->



### 安装

 - 下载 [Node Webkit], 如果已有则可以跳过这一步.

 - 下载 [CastleDB]

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

 * **帮助文档** 在解压包的 www 目录 中. 当处于 Node Webkit　时,可以点开 标题菜单的 dev 打开 控制台, 输入 `_.data` 将是 你用 这个编辑器输入的 JSON 数据.



### 列类型

描述中提到的 JSON 格式是表示用文本编辑器直接打找 .cdb 文件后看到的字符串, 其实 .cdb 就是一个 JSON 文件.

 * **Unique Identifier** 唯一标识符。将允许引用这一行从其他 表(sheets) 或 列(columns)。唯一标识符必须是有效的代码标识符`[A-Za-z_][A-Za-z0_9_]*`

 * **Text** 字符串文本。 任意文本,目前不允许多行文本.

 * **Boolean** true or false.

 * **Integer** 整数, 没有小数

 * **Float** 浮点数

 * **Color** 表示 RGB 的整形数值.

 * **Enumeration** 单项选择, 添加 column 时, 用逗号分隔各项值

 * **Flags** 多项选择。例如: `hasHat, hasShirt, hasShoes`, 添加 column 时, 用逗号分隔各项值

 * **Reference** 引用, 使用　uid　引用另一个行

	> 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
	
	> 内容只能是同一个表,是以是别的表,但是建立后不能修改.

 * **List** 其实更像是 数组(Array<Object>)类型 an Array of structured objects

	> 当设置 列 的类型为 List 将创建一个新的隐藏工作表。
	

 * **File** 目标文件相对或绝对路径。

 * **Image** 要显示的图片, 

 	> JSON格式: 这个列的值为一个图片的 md5 值, 这时和 .cdb 会存在一个 同名的 .img 后缀的 JSON 文件, 文件格式类似于 `{"md5string": "data:image/png;base64,........"}`

 * **Tile** 类似于图片,一张图片上存放多个 Tile,类似于 SpriteSheet

 * **Dynamic** 其实更像是 JSON 数据,手工输入这个字段的数据类型有些麻烦.

	> 注意区别这个和 List 字段, 相对于Javascript, 如果 List 为 Array, 那么 Dynamic 就是 Object

 * **Data Layer**

 * **Tile Layer** 这个字段由 castle 编辑器自行添加数据

 * **Custom Type** 自定义类型

	> 通过点击 IDE 的右下角的 `edit type` 打开一个空白页面, 示例都是 enum 类型的, 和普通的 Enumeration 比起来,
	
	> Custom Type 的 enum 是带有 构造方法的. 示例如下: 

	```haxe
	enum Super2 {
		A;
		B;
		C( x : Int );
	}

	enum Effect2 {
		Poison( time : Float, power : Float );
		Check( a : Super2 );
		Monster( m : monsters );
	}
	```
	
	> custom type　的构造参数使用下列类型
	
	```
	Int: 
	Bool:
	Float:
	String:
	CustomType: 自身
	SheetName: 任意 sheet name
	```
	
	> 构造参数可以添加前缀 `?`, 这意味着参数为可选参数可省略
	
	> custom type 储存原型为混合数组类型,数组第一个元素为 索引:
	
	```
	Value example				Stored value
	Fixed						[0]
	Random(0.5)					[1,0.5]
	Monster(MyMonsterId)		[2,"MyMonsterId"]
	Or(Random(0.5),Fixed)		[3,[1,0.5],[0]]
	```
	
	> 编辑器将严格验证 Custom type 的输入





### 2D 地图编辑器 


#### Level

首先你需要将 sheets 变为 Level,你需要 需要添加 width:Interger , height:Interger , props:Dynamic,然后右键单击 sheet name, 选中 lever 选项. 这时 每添加一行数据将会出现 Edit 的按扭允许你进入到 Level 


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

#### 

### 快捷键

 * F4 跳到引用原行, F3 搜索引用

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

#### 类型映射

参考原文档.

### 更多特性

 * Display Column

	> 如果右键单击 column 并选译 `Display Column`, 这项 column　将替换 unique Identifier 显示行引用.
	
	> 这通常用于显示可读的名字相对于 unique Identifier
	
	> 但储存的的数据输入仍旧使用的是 uid,这项仅仅只影响编辑器如何显示

 * Index 行索引

	> 通常 index 不是导出数据的一部分,但是你可以通过 右键 sheet name,把 add index 勾上.
	
	> 对于 List column　类型, index 具有唯一性.

 * Separators 分隔符, 在检索数据时,可以通过分隔符来区划分数据

	> 当　在行数数上单击右键, 选择 Separator 将创建一个小的可见分隔行在这行之上,
	
	> 同样你可以双击分隔符给它命名.

 * Add Group

	> sheet name 上右键选择 Add Group, 和 Separators 一起使用, 每个分隔符分开的分组的索引都将从 0 开始
	
	> 分组索引同样从 0 开始增


### 其它

 * 修改 columns 时,别按回车键,因为默认为 `delete`

 * **重要**: 表名(sheet name)不要以大写字母开头

 * **index** 表格每行将自动生成这个序列

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **索引** 属性添加到数据行(line).

 * **separator** 用于将同一表格(sheet) 中的行分组(group)

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **分组** 属性添加到数据行(line).
