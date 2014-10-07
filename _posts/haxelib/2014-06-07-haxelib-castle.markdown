---

layout: post
title:  CastleDB
date:   2014-06-07 7:26:01
categories: haxelib

---

[CastleDB] 是一个基于 [Node Webkit] 的应用. 看起来像一个电子表格. 一个可视的 JSON 格式 **行数据** 的生成器.
 
 
可以使用 haxelib dev 的方式本地安装 castle 库,这样就能在 Haxe 中读取 上边所应用保存的数据. 


 * **适用环境**

	> 这个工具主要是用于 **集中处理** 一些 数据类, 如果使用 Haxe, 那么在代码中引用这些数据时 IDE 会有语法智能提示, 避免打错字符.
	> 而且由于 数据的集中处理, 单独更改这些数据也方便, 这样就不必在游戏代码中修改这些数据. 而已这些数据在代码中也不直观.

	> 比如 用于 游戏中怪物的血量, 等级, 类型,移动速度,甚至系关联的图像 等等. [游戏示例](https://github.com/ncannasse/ld30)


 [CastleDB]:(https://github.com/ncannasse/castle)
 [Node Webkit]:(https://github.com/rogerwang/node-webkit)
 
<!-- more -->

<br />

### 安装

1. 这是一个基于 [Node Webkit] 的应用, 所以你需要下载它, 如果没有的话.

2. 下载 [CastleDB],  将 `bin` 目录下的文件打包成一个 zip 文件(注意 **不要包含** bin 目录名). 这里我们打包成 castle.zip

3. 在 命令行下输入: `nw.exe castle.zip` 就行了. 最好是写一个 bat 文件. 示例如下:

```bat
@echo off

:: 设置 nw.exe 所在路径及文件名
set NODE_WEBKIT="E:\Program Files\nw\nw.exe"

:: 设置 castle.zip 所在路径及文件名
set APP_CASTLE="E:\Program Files\CastleDB\bin\castle.zip"

:: start 命令以二个 双引号开始,以正确处理带有空格的目录
start "" %NODE_WEBKIT% %APP_CASTLE%

exit
```

4. **帮助文档** 在 www 目录 中. 可以点开 标题菜单的 dev 打开 控制台, 输入 `_.data` 将是 你用 这个编辑器输入的 JSON 数据.

<br />

### 列类型

描述中提到的 JSON 格式是表示用文本编辑器直接打找 .cdb 文件后看到的字符串, 其实 .cdb 就是一个 JSON 文件.

 * **Unique Identifier** 唯一标识符。将允许引用这一行从其他 表(sheets) 或 列(columns)。唯一标识符必须是有效的代码标识符`[A-Za-z_][A-Za-z0_9_]*`

 * **Text** 字符串文本。 任意文本,目前不允许多行文本。注意: 字段名称为 name 将会有特殊意义,用于引用(Reference)

 * **Boolean** true or false.

 * **Integer** 整数

 * **Float** 浮点数

 * **Enumeration** 枚举。类似于 单项选择, 添加 column 时, 用逗号分隔各项值

 * **Flags** 标志。 类似于 多项选择框。例如: `hasHat, hasShirt, hasShoes`, 添加 column 时, 用逗号分隔各项值

 * **Reference** 引用。 

	> 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
	
	> 内容只能是同一个表,是以是别的表,但是建立后不能修改.

 * **List** 其实更像是 数组(Array)类型 an Array of structured objects

	> 当设置 列 的类型为 List 将创建一个新的隐藏工作表。
	
	> List 类似于 一对多个数据库关联。

 * **Color** 表示 RGB 的整形数值.

 * **File** 目标文件相对或绝对路径。

 * **Image** 要显示的图片, 

 	> JSON格式: 这个列的值为一个图片的 md5 值, 这时和 .cdb 会存在一个 同名的 .img 后缀的 JSON 文件, 文件格式类似于 `{"md5string": "data:image/png;base64,........"}`

 * **Tile** 类似于图片,一张图片上存放多个 Tile,类似于 SpriteSheet

 * **Dynamic** 其实更像是 JSON 数据,手工输入这个字段的数据类型有些麻烦.

	> 注意区别这个和 List 字段, 相对于Javascript, 如果 List 为 Array, 那么 Dynamic 就是 Object

 * **Data Layer**

 * **Tile Layer** 这个字段由 castle 编辑器自行添加数据

 * **Custom Type** 自定义类型, 

	> 通过点击 IDE 的右下角的 `edit type` 打开一个空白页面, 我看到的示例都是 enum 类型的, 和普通的 Enumeration 比起来,
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





### 2D 地图编辑器 


为了将 sheet 变成 2D 地图编辑器,需要添加 width:Interger , height:Interger , props:Dynamic, layers:List(name:Text, data:Tile Layer) 字段,然后右键单击 sheet name, 选中 lever 选项. 这时 每添加一行数据将会出现 Edit 的按扭.

 * New Layer 将自动填充 layers:List
 
 * Mode 这个选项将应用到当前 layer, Mode 保持为 Tiles 就好

   - Tiles 默认

   - Ground 地面

   - Objects 对象




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

> 在纯 JS 或其它语言中调用, 由于 .cdb 其实就是 JSON 格式的文件, 把它当成 JSON 数据处理就行了. 不过对比 haxe, 这个没有 IDE 的智能提示很容易输错一些什么.


<br />

### 更多特性

 * Display Column

 * Index

 * Separators 分隔符

 * Add Group 


<br />


### 其它

 * 修改 columns 时,别按回车键,因为默认为 `delete`

 * **index** 表格每行将自动生成这个序列

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **索引** 属性添加到数据行(line).

 * **separator** 用于将同一表格(sheet) 中的行分组(group)

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **分组** 属性添加到数据行(line).



<br />


### 个人感觉不完美的地方

 * 输入 Dynamic 类型字段时,完全是 手工输入, 没有好的输入界面.

 * 没有所谓 Db 的查询方法