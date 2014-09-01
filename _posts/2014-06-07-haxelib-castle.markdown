---

layout: post
title:  CastleDB
date:   2014-06-07 7:26:01
categories: haxelib

---

 [CastleDB] 是一个基于 [Node Webkit] 的应用. 一个的 JSON 格式数据的生成器.

 
 首先将下载的 Node Webkit 解压到 `CastleDB/bin` 目录下,然后打开 `nw.exe` 就行了。或者将 `CastleDB/bin` 目录下的文件打包成 zip 文件,以 `nw.exe app.zip` 的方式来运行

 
 可以使用 haxelib dev 的方式本地安装 castle 库,这样就能在 Haxe 中读取 上边所应用保存的数据.

 [CastleDB]:(https://github.com/ncannasse/castle)
 [Node Webkit]:(https://github.com/rogerwang/node-webkit)
 
<!-- more -->

### 文档

CastleDB 解压后 www 目录为参考文档.


#### 为什么

CastleDB 用来输入静态结构化的数据。

#### 存储

CastleDB 将 数据模型 和 行数据 存储到一个简单易读的 JSON 文件。可以很容易被任意程序加载使用。

例如: 在游戏中你想要存储所有的物品和怪物，包括其名称、 描述、 逻辑影响 等等。

#### 如何

CastleDB 看起来像一个电子表格，除了每个工作表有一个数据模型。

该模型允许编辑器 验证和减轻用户的输入。

#### 协作

CastleDB 允许数据编辑的高效协作。

使用 JSON 格式 + 换行符 来存储数据，因此 GIT 或 SVN RCS 可以很好地显示文件差异。

### 列类型

 * **Unique Identifier** 唯一标识符。将允许引用这一行从其他 表(sheets) 或 列(columns)。唯一标识符必须是有效的代码标识符`[A-Za-z_][A-Za-z0_9_]*`

 * **Text** 文本。 任意文本,目前不允许多行文本。

 * **Boolean** true or false.

 * **Integer** 整数

 * **Float** 浮点数

 * **Enumeration** 枚举。类似于 单项选择框???

 * **Flags** 标志。 类似于 多项选择框。例如: `hasHat, hasShirt, hasShoes`

 * **Reference** 引用。 

	> 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
	
	> 内容只能是同一个表,是以是别的表,但是建立后不能修改.

 * **List**

	> 当设置 列 的类型为 List 将创建一个新的隐藏工作表。
	
	> List 类似于 一对多个数据库关联。

 * **Color** 表示 RGB 的整形数值.

 * **File** 目标文件相对或绝对路径。

 * **Image** 要显示的图片。

 * **Tile** 类似于图片,一张图片上存放多个 Tile,类似于 SpriteSheet

 * **Dynamic** 和 Haxe Dynamic 类型相同, 可以将任意数据类型保存在这个字段中.例如: 数字,字符串,数组 等等

 * **Data Layer**

 * **Tile Layer**

 * **Custom** 自定义


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