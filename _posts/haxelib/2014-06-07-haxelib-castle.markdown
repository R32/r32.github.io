---

layout: post
title:  castle(可视数据编辑)
date:   2014-06-07 7:26:01
categories: haxelib

---

[castleDB] 是游戏 [evoland 2](http://www.evoland2.com/) 的静态数据编辑器

* Why

  - castleDB 用于 **可视化** 的输入结构化静态的的数据
  - 通常存储于 XML 或 JSON 文件中的数据都可以使用这个工具代替,并且做添加和修改
  - 比如当你在做一个游戏时, 你可以将所有物品和怪物它们的 名字,描述,逻辑...等等这些属性通过 castleDB 存储

<!-- more -->

* How

  - castleDB 看上去像上一个电子表格编辑器, 但castle的每一个表格都有其相对应的"数据模型"
  - 编辑器通过这个"模型"验证数据,简化用户输入

* 存储格式

  - castle 存储其"数据模型"和"数据行"为一个简单易读的 JSON 文件
  - JSON 文件很容易被其它程序加载使用
  - 它能更简单地处理游戏物品以及怪物的各种数据

* 协作

  - 由于其储存格式为 JSON + 换行, 因此 git 或 svn 等版本管理软件更能显示其数据修改差异。

### 安装

- 下载 [Node Webkit](https://github.com/nwjs/nw.js) 如果已有则可以跳过这一步.

- 下载 [CastleDB](https://github.com/ncannasse/castle)

  如需在 haxe 中调用,　可以 haxelib dev 的方式添加到本地库.

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

* 一个 `.cdb` 文件由一个或多个工作表(sheet)所组成， 每个工作表为"结构化对象"的集合。
* 每个表包含多个列(columns), 列表示存储数据对象字段(fields)
* 每个列都有一个给定的"类型"表示此列中存储数据的种类
* castle 处理列(columns)的重命名,删除及列类型之间的转换

### 列类型

下边为可用的"列(字段)"类型:

* **Unique Identifier**(唯一标识符): 作为行数据的唯一标识符, 它允许其它表(sheet)或列(column)引用这一行数据. 唯一标识符必须是有效的代码标识符 `[A-Za-z_][A-Za-z0_9_]*`

* **Text**(文本): 字符串文本。 任意文本,目前不允许多行文本.

  > 有个 Localizable 的选项用于本地化(TODO: ??？仅简单标记这个字段, 程序中通过判断 kind == "localizable" 加后加载本地化文件)

* **Boolean**: 可以通过复选框(checkBox)来选择 true 或 false。

* **Integer** 整数, 没有小数

* **Float** 任意数

* **Color** 表示 RGB 的整形数值.

* **Enumeration**(单项选择): 在给定的多个选项中必须并且只能选择一个。 (添加列(column)时, 用逗号分隔各项值)

* **Flags**(多项选择): 在给定的多个选项中随意选择多个或者一个都不选.例如: `hasHat, hasShirt, hasShoes`, (添加列(column)时, 用逗号分隔各项值)

* **Reference**(引用):, 通过 Unique Identifier 引用其行数据

  > 引用`Unique Identifier` 或字段名为 `name` 的文本字段.(编辑器将自动提示这些)
  >
  > F4 键将跳转到 引用字段, 而 F3 键则显示 **谁** 引用了这个字段的引用

* **File**(文件): 目标文件或图片的相对或绝对路径

* **Image** 要显示的图片,

  > JSON格式: 这个列的值为一个图片的 md5 值, 这时和 `.cdb` 会存在一个同名的 .img 后缀的 JSON 文件, 文件格式类似于 `{"md5string": "data:image/png;base64,........"}`

* **Tile** 类似于图片,一张图片上存放多个 Tile

* **List** 当类型为 List 将创建一个新的隐藏子表。 [见后边章节描述...](#list-column)

* **Properties** 新增的属性,像是一个可视化的(key/value)的Object类型, 可以方便的通过 UI 输入这些动态值了

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
  >
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

在创建一个新表时, 勾选上 `Create Level` 选中即可, IDE 将自动创建 level表所需要字段(以前旧的版本需要自已添加这些字段)。

之后你可以通过点击"行"最左侧的 `edit` 按钮编辑它们

### 图层(Layers)

一个 layer 是包了一组信息的字段存储于 level表中，有如下几种 layer: 注意参考示例文件

* **Tile Layer** 在创建level表后即可创建, 它有一个 name(Text) 与 data(TileLayer)或其它更多自定义字段如 blending

  - tile layer 相当于游戏里的某一图层, 示例中的 layers 字段即是是一个 Array<Layer>,
  - 每个 layer 有一个名字以及可以分配到一个tileset
  - tile layer 有三种不同的模式: Tiles, Group, Object

* **List Layer** 如果你添加一个 List 到level表, 当这个 List 包含有 Number 类型的 x 和 y 属性时, 这将是 list layer, 将可以以可视化的方式自动填充 x,y. 当每次当点击 map preview(纯色背景板) 时。

  - 示例文件中的 npcs 字段即为 list layer, 比如你需要往游戏里添加 npc 及主角时可以使用这种层
  - list内可添加额外的属性, 注意: 如果你添加 Reference 引用了另一个表如果其包含有 Tile 或 Image, 这里可以直接放入到地图编辑器中去(将选择最左边的字段, 如果存在多个 tile 或 image)

* **Index Layers** 如果你想用地图编辑器画一些东西并且储存在一个紧凑数组之中, 可以添加Laye类型字段到level表。 作为一些限制你可能不能定义每个单元格的类型, If you are not on the first layer, the first element of your layer (which has 0 index) will not be displayed and will act as a transparent element.

  - 示例中的 collide 字段, 感觉有点像 list_layer, 只可以在地图编辑器中画数据, 而不可以在表格中修改数据或添加字段

* **Zone Layer** 类似于 list_layer,只是它有额外的 width 和 height 数值属性.在地图编辑器中它将显示为一个区域

  > 示例中的 triggers 字段

index_layers 和 zone_layer 都是可读的数据可以在 layer 后通过按 **`E`** 直接在 layer 上配置其属性

#### Layer Display

layer 将从引向（reference）的目标取得一些信息

* 如果 reference 的字段有类型 Image, 将使用这 图片 用于显示

* 如果 reference 的字段有有类型 Color, 将使用这 颜色 用于显示

* 如果无有效信息, 你可以在编辑器上自定义这个层的颜色

#### Grid and Precise coords

index_layers 将总是为 grid-aligned. 其它类型 layers 则可以有更精确的位置, 如果使用Float类型代替Int作为位置(x,y)类型, 即使这种情况下你仍然可以激活 Lock Grid 选项.

默认的 grid size 为 16 像素, 可以在 level 选项中修改.


#### Layer Compression

在默认时, layer数据并未压缩, 如果你创建过多的 tile/index levels 这将导致最终输出的文件非常大, 你可以开启/关闭(enable/disalbe)压缩这些layers通过 选择/反选 File/Enable Compression. 这将使用 LZ4 压缩算法处理, 因为它的解压非常简单和快速.

#### Common layers options

可以修改如下属性:

* visible: 切换显示隐藏当前图层. 这个选项仅作用于编辑器非保存的 .cdb 文件
* lock: 锁定防止修改直到解锁
* alpha: 更改当前图层透明度, 这个数据将会保存到 .cdb 文件中去.

可以在图层tab上"右键"获得如下选项:

* show Only: 将隐藏除当前图层的其它所有图层
* show all: 恢复所有图层为显示
* rename: 更改图层名(仅限于tile_layer, 其它图层则通过其相应的字段修改)
* clear: 清除当图层的所有数据
* delete: 删除当前图层(限于tile_layer, 其它图层则通过其相应的字段修改)

Options 菜单:

* Tile Size: 属于level层次的, 修改它将自动修改 props 字希中的 tileSize 属性.
* X/Y Scroll: 滚动
* Value Scale: 缩放

#### Tile Layers

由 tile_layer 所组成的数据通过单个tileset, tile_layer 有如下属性:

Mode: tile_layer 可工作在三种模式, 模认为 tile, 其它模式后边将详细介绍
File: 允许更改 tileset 作用于当前 tile layers,
Size: CDB 默认使用 16x16大小的tile. 可以更改这个数值在各自的 layer(但是同一张底图不可以有不一样的size), 注意需要同时修改 Options 菜单中的 Tile Size 大小

#### Tile Mode

在这个模式下, 你可以选上 tileset 下方的填充或随机模式

#### Object Mode

Object Mode 通过更复杂的方式存储tiles布局, 当处于Tile Mode时, 图层数据(layer data)由高x宽个tile组成,

为了使用 Object Mode, 你需要先创建Object,在右下拉菜单中选中Object, 然后鼠标选中一个或多个tile然后点+或-(或按O键切换)来选中与取消,

这样就可以将Object放置于tile_layer, Object的存储将依照Y轴排序(即最下方的tile将永远显示在前边挡住上边的), 因此这不像 Tile Mode 一些块能覆盖别的块.

Object 的坐标将以象素为准非 grid 对齐, 当然你仍然可以要求 grid 对齐通过 **`G`** 键,在往图层上添加Object时,

通过 **`F`** 键可以flip(左右调换)对象, 而 **`D`** 键则可以旋转90度每次

Object_Layer 将为一个base64编码的16位值:

`0xFFFF` 标识选区为Object_Layer, 每个被标识的选区将有下边信息:

* `X` 选区的位置X, 单位为像素
* `Y` 选区的位置Y, 单位为像素
* `ID` Object的标识符, 它表示这个对象位于 tileset 的位置

所有这三个值可以有其自身的高位(bit set)的设置: 对象的旋转存放于高位的 X 和 Y, 而 flip 则存放在 ID 上(注: 用得着这样省字节??)

#### Ground Mode

这个模式与 tile mode 很相似, 除了你可以配置 Grounds 和 Borders 获得一些自动构建

> 你可以尝试在示例中切换到 ground layer, 观察它与 Tile 的差异.
>
> border 能自动将定义为 Ground 类型的 tile 使 border 包起来, 只是没有文档介绍如何做

Borders 有 4个模式: (copy from cdb.TileBuilder.hx)

```
	Corners
	┌  ─  ┐		0 1 2
	│  ■  │		3 8 4
	└  ─  ┘		5 6 7

	Lower Corners

	┌ ┐		9  10
	└ ┘		11 12

	U Corners

	   ┌ ┐			XX  13  XX
	┌       ┐		14  XX  15
	└       ┘
	   └ ┘			XX  16  XX

	Bottom

	└ - ┘			17 18 19
```


#### Group Mode

为几个连续的tile定义成一个名字, 示例中定义了一些tile动画.

#### Per-tile Properties

预定义 tile 的属性, 所有tileset中的tile 将有共享的属性用于各关卡(level)，而不必每次都在图层中去画,

可以简单的指定这些值通过 tileProps 字段

例如示例中level表中的 collide 字段它引用了collide表,这将允许我们指定自定义的碰撞(通过点击collide_tile 然后在tileset上操作)

示例中定义了一个 Enumeration类型的 hideHero 字段,也将显示在画板下拉菜单中

#### 地图编辑器中的快捷键

* `右键`, 选择光标下的 tile, (像是从tileset 中选择一样)
* `Tab` 切换到下一图层
* `shift+Tab` 切换到前一图层
* `V` 显示/隐藏当前图层
* `L` 锁定/解锁当前图层
* `G` 限定为grid 对齐, 针对一些以像素对齐的对象
* `I` 显示/隐藏画板(palette)
* `P` 直接将tile填充到图层
* `R` 随机tile模式切换(画板下当tile模式时会出现在选项)
* `+,-` (小键盘), 缩放level
* `/` (小键盘), 返回默认的缩放大小
* `E` 直接在图层上修改 list/zone类型层数据
* `Esc` 清除鼠标选区
* `space` 按住滚动(像是PS中的小手图标功能)
* `F` flip(翻转对象, 仅用于tile_object)
* `D` 旋转对象,(仅用于tile_object)
* `O` 在画板上快速创建tile_object

### 代码中调用

在 Haxe 中调用. flashdevelop 能很好地提供智能提示,以避免打错字符. 参看 www/index.html 以及 src/test. Test.hx:

Data.hx: 这个类仅只使用宏来解析数据类型,不会加载数据值, 仅提供 sheet name 的智能语法提示.

```haxe
// Init 名字随意,
private typedef Init = haxe.macro.MacroType <[cdb.Module.build("test.cdb")]> ;
```

如果这行代码放在 Data.hx 下, 那么之后的数据访问都将通过 `Data.xxxxx` 来访问, 如果放在 Other.hx 文件中则通过 `Other.xxxxx` 访问

```haxe
class Test {
	static function main() {
		var content: String = .....; // 需要自已将 .cdb 加载进来
		Data.load(content);
		// items 为 表名(sheet name), 注意为小写字母开头(工作表不要用大小字母开头命名)
		// 通过 SheetNameKind 的方式访问可以获得的uid(IDE智能提示)
		trace(Data.items.get(Data.ItemsKind.Sword).alt.fx);

		trace(Data.items.get(sword).alt.test);     // 不推荐的方式

		for( s in Data.monsters.resolve("wolf").skills[0].sub )
			trace(s);
		// If the sheet does not have an unique identifier, only the all field is available.
		// If the sheet has an unique identifier, you can access the all field, but also use get (by id) and resolve (by string).
	}
}
```

对于一个名为 mySheet 的表(sheet，注意表名不要大写字母开头),将自动生成如下类型(IDE智能提示可能需要花些时间解析第一次时):

* MySheetDef：通过JSON解析的原始Ojbect类型
* MySheet：(因此表名不要大写字母开头) 抽象(抽象即不可访问)类型将允许读取字段以及执行一些转换TODO:（后边再详细描述）
* MySheetKind：包含 mySheet 中的所有 unique identifier(可以用在 mySheet.get 方法参数, 这三个似乎只有这一个有点用)

#### 类型映射

castleDB 中的数据类型对应 haxe 中相应的类型

* Unique Identifier - SheetNameKind(abstract enum)
* Text - String
* Boolean - Bool
* Integer - Int
* Float - Float
* Color - Int
* Enumeration - SheetName_ColumName(abstract enum)
* Flags - cdb.Types.Flags<SheetName_ColumName> (abstract enum)
* Reference - TargetSheetName 当访问时将获取引用的对象, 仅能访问其标识符通过 columnNameId field
* File - String
* Image - String(只有MD5值， 这时 image 还未加载)
* Tile - cdb.Types.TilePos(包含 tileset 文件及 size,x/y位置以及可选的 width/height)
* List - cdb.Types.ArrayRead<SheetName_ColumName>(一个可读的结构数组对象允许 index访问, length,及迭代)
* Custom - SheetName_ColumName
* Dynamic -
* Data Layer - cdb.Types.Layer<SheetName>

  > 可通过将 Data.sheetName.all 数组传递给 decode 方法来解压

* Tile Layer - cdb.Types.TileLayer

  > 可通过 t.data.decode() 来解码，解压的数据为16位值的数组. 如果这个图层为 tile/ground模式将有 width/height值.如果为object模式将可以看到图层选区数据)

### 其它

* 修改 columns 时,别按回车键,因为默认为 `delete`

#### in heaps

* 首选用宏解析 .cdb 文件.``

  > 这个 .cdb 文件应该存放于 `-D resourcesPath=SOME_PATH` 所定义的目录下, 默认将为项目文件(hxml或hxproj文件所在文件夹)的 res 目录

* 在代码中加载, 如: `Data.load(Res.data.entry.getText());`, 其中 data 为 data.cdb 文件.

* 参考 h2d.CdbLevel.hx 文件, 例: `new CdbLevel(Data.levelData, 0, s2d);`

<br />
<br />
