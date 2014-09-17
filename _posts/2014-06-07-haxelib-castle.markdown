---

layout: post
title:  CastleDB
date:   2014-06-07 7:26:01
categories: haxelib

---

 [CastleDB] 是一个基于 [Node Webkit] 的应用. 看起来像一个电子表格. 一个可视的 JSON 格式 **行数据** 的生成器. 

 
 首先将下载的 Node Webkit 解压到 `CastleDB/bin` 目录下,然后打开 `nw.exe` 就行了。或者将 `CastleDB/bin` 目录下的文件打包成 zip 文件,以 `nw.exe app.zip` 的方式来运行,  帮助文档在 www 目录 中.



 
 可以使用 haxelib dev 的方式本地安装 castle 库,这样就能在 Haxe 中读取 上边所应用保存的数据.

 [CastleDB]:(https://github.com/ncannasse/castle)
 [Node Webkit]:(https://github.com/rogerwang/node-webkit)
 
<!-- more -->


### 列类型

 * **Unique Identifier** 唯一标识符。将允许引用这一行从其他 表(sheets) 或 列(columns)。唯一标识符必须是有效的代码标识符`[A-Za-z_][A-Za-z0_9_]*`

 * **Text** 字符串文本。 任意文本,目前不允许多行文本。注意: 字段名称为 name 将会有特殊意义,用于引用(Reference)

 * **Boolean** true or false.

 * **Integer** 整数

 * **Float** 浮点数

 * **Enumeration** 枚举。类似于 单项选择框???

 * **Flags** 标志。 类似于 多项选择框。例如: `hasHat, hasShirt, hasShoes`

 * **Reference** 引用。 

	> 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
	
	> 内容只能是同一个表,是以是别的表,但是建立后不能修改.

 * **List** 其实更像是 数组(Array)类型 an Array of structured objects

	> 当设置 列 的类型为 List 将创建一个新的隐藏工作表。
	
	> List 类似于 一对多个数据库关联。

 * **Color** 表示 RGB 的整形数值.

 * **File** 目标文件相对或绝对路径。

 * **Image** 要显示的图片。

 * **Tile** 类似于图片,一张图片上存放多个 Tile,类似于 SpriteSheet

 * **Dynamic** 其实更像是 JSON 数据,手工输入这个字段的数据类型有些麻烦.

	> 注意区别这个和 List 字段, 相对于Javascript, 如果 List 为 Array, 那么 Dynamic 就是 Object

 * **Data Layer**

 * **Tile Layer**

 * **Custom Type** 自定义类型

	> 通过点击 IDE 的右下角的 `edit type` 打开一个空白页面, 





### 2D 地图编辑器 


为了将 sheet 变成 2D 地图编辑器,需要添加 width:Interger , height:Interger , props:Dynamic, layers:List(name:Text, data:Tile Layer) 字段,然后右键单击 sheet name, 选中 lever 选项. 这时 每添加一行数据将会出现 Edit 的按扭.

 * New Layer 将自动填充 layers:List

 * Lock Grid 画图时锁定为 Grid 模式
 
 * Mode

   - Tiles

   - Ground

   - Objects




### 代码中调用

参看 www/index.html 以及 src/test. Test.hx:

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
			
	}	
}
```

Data.hx:

```haxe
package dat;

// Init 名字随意
// 这里的宏只解析 test.cdb 里的类型并不会解析数据, 数据需要在 运行时 load()
private typedef Init = haxe.macro.MacroType < [cdb.Module.build("test.cdb")] > ;
```

#### 其它

 * 修改 columns 时,别按回车键,因为默认为 `delete`

 * **index** 表格每行将自动生成这个序列

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **索引** 属性添加到数据行(line).

 * **separator** 用于将同一表格(sheet) 中的行分组(group)

	> 表格名(sheet name)上右键菜单, 可以选择是否将 **分组** 属性添加到数据行(line).

#### 个人感觉不完美的地方

 * 输入 Dynamic 类型字段时,完全是 手工输入, 没有好的输入界面.

	> 例如: `props : { tileSize : 16, name: "aaa",  data:{ file: "tiles.png", data: "AAAGAA.."} }`