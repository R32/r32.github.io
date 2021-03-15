---

layout: post
title:  castle(可视化数据编辑)
date:   2014-06-07 7:26:01
categories: haxelib

---

castle 看上去像是一个电子表格编辑器，其每一个表格(sheet)都有相应的 "数据模型"。

castle 通过 “数据模型” 来验证用户的数据输入，以避免不必要的输入失误。

> 通常存储于 XML 或 JSON 中的数据都可以使用此工具来代替
>
> 比如当你在做一个游戏时，你可以将所有物品和怪物的名字，
> 描述，逻辑...等等这些属性通过 castle 来保存

<!-- more -->

编辑器的输出文件为简单易读的 JSON 格式，很容易被其它程序加载使用。

> 储存格式为 JSON + 换行, 因此 git 或 svn 等版本管理软件更能显示其数据修改差异。

可简单地处理文本的本地化(Localization)。细节见后边的 Text 字段描述

### Tips

* 表名(sheet name)的首字母使用不要大写，这很重要，否则你可能无法在 haxe 代码中调用它。

* list_layers 和 zone_layer 可在 layer 上当 mouseover 时通过按 **`E`** 直接配置其属性, 而不必通过表格来输入

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

### 列类型

- **`Unique Identifier`**：将作为 “行数据” 的唯一标识符。*后边文字将使用 UID 表示这种类型*

  如果同一表格(sheet)出现同名的 UID “行数据”，将会产生一个错误: `#DUP(...)`

  同一个表格只可以有一个 UID 类型的字段(column)

- **`Text`**: 文本字符串，不允许有换行。

  1. 有个 Localizable 的选项用于本地化, 勾选后可通过 `File->Export Localized Text`
  可导出一个 xml 文件, 然后修改这个导出的文件

  2. 在 haxe 程序中调用 applyLang(file_content) 即可.

- **`Boolean`**: 可以通过复选框(checkBox)来选择 true 或 false。

- **`Integer`**: 整数, 没有小数

- **`Float`**: 任意数字

- **`Color`** 表示 RGB 的整形数值. (`TColor`)

- **`Enumeration`**: 类似于"单项选择", (`TEnum( [A,B,C ...] )`) *(添加列(column)时, 用逗号分隔各项值)*

- **`Flags`**: 类似于"多项选择" (`TFlags( [A, B, C ...] )`)

- **`Reference`**: 引用, 可通过 UID 引用另一个表的某一“行数据”. (`TRef( sheetname )`)

  可在字段名上 `右键-> display column`，更改默认显示

  可通过 `F4` 键将跳转到引用, 而 `F3` 键则显示 **谁** 引用了当前“行数据”

- **`File`**: 文件或图片的相对或绝对路径. (`TFile`)

- **`Image`**: 图片. (`TImage`)

  其值将保存为图片的 md5 值,
  并且会在 .img 后缀的 JSON 文件中以 base64 字符串的形式保存所选择的图片

- **`Tile`**: 类似于图片,一张图片上存放多个 Tile. (`TTilePos`)

  其值的保存将类似于:

  ```json
  {
    file: "path_to_file", // 这个文件必须相对于 .cdb 存在于目录之中
	size: 32,
	x: 0,
	y: 0
  }
  ```

- **`List`**: 将会创建一个"隐藏的子表"用于验证输入. (`TList`)(注: 行数据并不会保存在这个"隐藏的子表"中)

- **`Properties`**: 类似于一个可视化的(key/value)的 Object 类型. (`TProperties`)

  底层其实与 `List` 一样, 将创建一个隐藏的子表用以验证输入, 不同的是 `Properties` 只有一行数据

- **`Custom`**: 自定义 enum 类型. (`TDynamic( name )`) *(通过点击 IDE 的右下角的 `edit type` 打开一个编辑输入框)*

  ```js
  enum Super2 {
      A;
      B;
      C( x : Int );
  }

  enum Effect2 {
      Poison( time : Float, ?power : Float );
      Check( a : Super2 );
      Monster( m : monsters );
	  Or( a : Effect2, b : Effect2 );
  }

  // "custom" 的构造参数类型如下:
  // Int:
  // Bool:
  // Float:
  // String:
  // CustomType: 自身, 例如上边 Or() 的参数类型.
  // SheetName: 任意 sheet name
  ```

  custom 类型的储存底层为数组(`Array<Dynamic>`), 数组的第一个元素为索引:

  ```
  Value example				Stored value
  Fixed						[0]
  Random(0.5)					[1,0.5]
  Monster(MyMonsterId)		[2,"MyMonsterId"]
  Or(Random(0.5),Fixed)		[3,[1,0.5],[0]]
  ```

  编辑器将严格验证 Custom 类型 的输入

- **`Dynamic`**: 任意 JSON 数据, 不过只能手工输入有些麻烦.

- **`Data/Tile Layer`**: 图层

  Tile Layer(`TTileLayer`): 是普通的图层，这些数据在编辑器作画时自动填充。

  Data Layer(`TLayer`): 需要选择一个被引用的表, 参见后边的 `Index Layers`

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
Properties  | JSON结构 | 'null'
Custom | 多个混合类型, 了解更多... TODOS | `null`(缺少类型)
Dynamic | 自定义的JSON结构数据 | `null`
Data Layer | width x height 的字节编码为base64格式 | `""`(空图层)
Tile Layer | 类似于DataLayer, 但底层数据为数组(`Array<Struct>`) | `""`(空图层)

#### 可选字段(Optional Column)

如果取消复选框Required, 那么在创建/修改字段时, 默认的数据将为 `null`,
此外如果这个字段没有任何数据, 存储时将被删除.

### 使用 CastleDB

#### 加载和保存

在文件菜单中, 通过 New, Load, Save As 菜单项。 每次发生更改时都会自动保存。

#### 快捷键

一些常用快捷键:

* 使用"箭头"在单元格之间导航, 直接在单元格上键入或都使用`F2`或`Enter`来编辑。

* 使用 `ESC` 键退出单元格编辑或关闭打开的 List

* 使用 `Insert` 在光标位置插入一个新行

* 使用 `Ctrl+Z` 和 `Ctrl+Y` 撤消/重做。

* **!(似乎只有这条值得关值)** 使用 `F4` 跳转至 **被引用** 的单元格, `F3` 则搜索谁引用了这一行数据。

#### 管理表

通过右键点击或编辑器底部的标签选项:

* 添加新的表格(New Sheet)

* 移动表调整它们的顺序

* 重命名和删除表

* 访问表选项, 如 ~~索引(Index)~~和分组(Group)

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

  > 这个选项只影响 CastleDB 编辑器的显示方式

- **显示图标**, 同上，右键点击字段名选 `Display icon`, 图标将作为引用显示

- **添加索引(Add Index)**, 给"行数据"添加索引值, (注: 索引值不会保存到 .cdb)

  在宏自动创建成 haxe 类时, 如果选中了 `Add Index` 将会创建成员字段: `index`
  同样如果选中了 `Add Group` 则将创建成员字段: `group`

  索引值的作用是避免通过遍历的方式来获取其于数组中的位置

- **分隔符**, 如果右键单击"行数据", 可以在当前行上前边添加分隔符, 双击这个分隔符可以为其命名.

- **添加分组(Add Group)**, 给"行数据"添加分组值, (需要有分隔符存在), 值将从 0 开始.

### 高级类型

这里补充前边没有详细说明的字段类型

#### List Column

当列（字段）的类型设置为 `List` 时,一个新的隐藏的表将被创建。然后可你像修改其它表一样处理这个子表。

与普通表的区别是这个子表将直接在原表的行上操作, 你可以点击 List 字段的单元格切换到子表。


#### Image Column

插入到 CastleDB 的图像将另外保存为 `.img` 文件, `.cdb` 中只有这个图像的 Md5 值。

因此，相同的图像可以被多次重复使用而不会增加总文件的大小。

如果你做了许多图像改变，可以通过菜单命令 `File -> Clean Image` 删除从 `.img` 中引用图像

#### Custom Column

见字段类型小节

<br />

地图编辑器
------

可以在下载包中的 www 目录找到一个名为 `sample.zip` 的示例文件。后边将使用其作为参考。

使用 CastleDB 创建 Level(关卡)和其它 IDE 的差异是:
你可以关联每个 images/tiles 到其它的数据，使得你有一个统一的框架来创建游戏的全部内容。

### 创建关卡(Create Level)

在创建一个新表时, 勾选上 `Create Level` 选中即可, IDE 将自动创建 level表所需要字段, 之后通过点击"行"最左侧的 `edit` 编辑

### 图层(Layers)

图层(layer)是 level 表中包含了一组图片布局数据的字段(field)，分别为:

* **Tile Layer** 在创建 level 表后即可通过点击 "Edit" 按钮创建, tile layer 相当于游戏里的某一图层,

  示例中的 "layers" 字段即是是一个 List<Layer>, 比如游戏里可以有背景层, 美化层, 物件层等等。 通过 "New Layer" 创建的层都会自动添加到 "layers" 下.

  这个字段一般由 IDE 自动创建, tile layer 有三种不同的模式: Tiles, Group, Object

后边的三种类型都是与 Tile Layer 相对的数据层,

* **List Layer**: 允许你在可视地图编辑器上引用另一个表(sheet)中的数据。

  你需要在 level 表中手动添加一个 `List<{x:Float, y:Float}>` 类型的字段, 参考示例中的 `npcs` 字段

  如果引用了另一个表(sheet), 如果被引用的表包含有 Tile 或 Image,
  那么这个 tile 将作为标记用于可视编辑(如果存在多个 tile 或 image, 则选择最左边的字段)，

  如果 List Layer 没有可引用的 tile 或 image 那么在可视编辑中将使用"颜色块"来标记.

  List Layer 的数据存储其实只是坐标而已（如果没添加其它字段的话）

* **Zone Layer** 类似于 List_Layer,只是它有额外的 width 和 height 数值属性.在地图编辑器中它将显示为一个区域

  示例中的 triggers 字段

* **Index Layers** 参考示例 `levelData` 表的 `collide` 字段, 它使用紧凑数组(base64, `width x height`)保存一些数据,

  在 level 表添加一个类型为 `Data Layer` 字段 , 并选择与之关联的一个表即可。

  被关联的表必须有 tile 类型的字段才可以在地图上编辑, 而且不可以添加自定义的数据

#### Layer Display

layer 将从"被引用"的目标取得一些信息

* 如果 "被引用" 的字段有类型 Image, 将使用这 图片 用于显示

* 如果 "被引用" 的字段有类型 Color, 将使用这 颜色 用于显示

* 如果没有有效信息, 则可在编辑器上自定义这个层的颜色

#### Grid and Precise coords

index_layers 将总是为 grid-aligned. 其它类型 layers 则可以有更精确的位置,
如果使用 Float 类型代替 Int 作为位置 (x,y) 类型, 即使这种情况下你仍然可以激活 Lock Grid 选项.

默认的 grid size 为 16 像素, 可以在 level 选项中修改.


#### Layer Compression

默认时, layer数据并未压缩, 如果你创建过多的 tile/index levels 这将导致最终输出的文件非常大,
你可以开启/关闭(enable/disalbe)压缩这些layers通过 选择/反选 File/Enable Compression.
这将使用 LZ4 压缩算法处理, 因为它的解压非常简单和快速.

#### Common layers options

可以修改如下属性:

* visible: 切换显示隐藏当前图层. 这个选项仅作用于编辑器非保存的 .cdb 文件
* lock: 锁定防止修改直到解锁
* alpha: 更改当前图层透明度, 这个数据将会保存到 .cdb 文件中去.

可以在各图层的名字(tab)上通过 "右键" 获得如下选项:

* show Only: 将隐藏除当前图层的其它所有图层
* show all: 恢复所有图层为显示
* rename: 更改图层名(仅限于tile_layer, 其它图层则通过其相应的字段修改)
* clear: 清除当图层的所有数据
* delete: 删除当前图层(限于tile_layer, 其它图层则通过其相应的字段修改)

Options 菜单:

* Tile Size: 属于level层次的, 修改它将自动修改 props 字希中的 tileSize 属性.
* X/Y Scroll: 滚动 (*容易混乱*)
* Value Scale: 缩放 (*容易混乱*)

#### Tile Layers

由 tile_layer 所组成的数据通过单个 tileset, tile_layer 有如下属性:

Mode: tile_layer 可工作在三种模式, 默认为 tile, 其它模式后边将详细介绍
File: 允许更改 tileset 作用于当前 tile layers,
Size: CDB 默认使用 16x16大小的tile. 可以更改这个数值在各自的 layer(但是同一张底图不可以有不一样的size), 注意需要同时修改 Options 菜单中的 Tile Size 大小

#### Tile Mode

单纯的 tile 模式, 可以使用画板(tileset) 下方的填充或随机模式。

#### Object Mode

Object Mode 通过更复杂的方式存储 tiles 布局。**对象将依照Y轴排序**(即最下方的 tile 将永远显示在前边挡住上边的)

为了使用 Object Mode, 你需要先创建Object: 在右下拉菜单(tile 调色板)中选中Object, 然后鼠标选中一个或多个 tile 然后点 `+` 或 `-` (或按O键切换)来选中与取消,

Object Mode 的坐标将以象素为准非 grid 对齐, 当然你仍然可以要求 grid 对齐通过 **`G`** 键,在往图层上添加 Object 时,

通过 **`F`** 键可以flip(左右调换)对象, 而 **`D`** 键则可以旋转90度每次

Object_Layer 的数据存储编码为 base64, `0xFFFF` 标记这个图层为 Object_Layer, 接下来由有数据:

* `X` 选区的位置X, 单位为像素
* `Y` 选区的位置Y, 单位为像素
* `ID` Object的标识符, 它表示这个对象位于 tileset 的位置

所有这三个值可以有其自身的高位(bit set)的设置: 对象的旋转存放于高位的 X 和 Y, 而 flip 则存放在 ID 上

#### Ground Mode

主要用于构建 background 层, 可以通过 *Per-tile Properties* 所配置的 Ground 和 Border 漂亮地绘制 Ground(地板)

### Per-tile Properties

可以在画板(tileset)为每一个磁贴(tile)定义一些属性, 例如碰撞检测, 事件触发, 或者如何绘制"地板"等,

这些定义的属性可以在所有 levels(关卡) 中共享(仅限于同一个 sheet 内),


下拉菜单:

* tile: 当处于这个选项时，表示你正在作画中, 而非预定义。
* Object: 当激活时, 可以将多个 tile 组合成 Object, 接下来作画时一次即可选中组合的几个 tile. 快捷键为: `O` 键。
* Ground: 用于标记一个或一些 tile 为 ground(名字在左上第一个块上), 以配合 `Border` 一起使用.

  priority: 更低的值表示其处于更低的层, 用于配合 `Border` 一起使用.

  对于 priority 值的设定要有概念, 例如: `草 > 石头 > 泥土 > 水`, 后边操作 `Border` 时才不会混乱.

* Border: 将一组 tile 标记为 border

  在程序的内部, 是通过 Ground.piro 来确认 border 的位置的,
  而 Ground.name 只是相当于一个 piro 的别名

  ```
  #Corners
  ┌  ─  ┐   0 1 2
  │  ■  │   3 8 4
  └  ─  ┘   5 6 7

  #Lower Corners
  ┌ ┐   9  10
  └ ┘   11 12

  #U Corners
     ┌ ┐      XX  13  XX
  ┌       ┐   14  XX  15
  └       ┘
     └ ┘      XX  16  XX

  #Bottom , 好像不起作用, 或许是 BUG
  └ - ┘     17 18 19
  ```

* Group: 仅用于给一些 tile 取一个名字，例如: 一些动画帧。

* 自定义: 可在关卡表中添加一个名为 tileProps 类型是 `List`  的字段，List 内的每一个子字段都会被引用到画板下拉菜单中去， 而 List 内不必有内容(行数据)。

  > 参考示例中: 画板下拉菜单中的 collide(引用) 和 hideHero(枚举)


### 地图编辑器中的快捷键

* `S`: 用于移动某一个画布上的块, 按住 `S` 可选择区域, 接下来按住左键可移动。按 ESC 取消这个功能.
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

## 代码中调用

参看 www/index.html 以及 src/test. Test.hx:

```js
// Init 名字随意,  test.cdb 的目录可以是: 当前目录, 或 "res" 或 `-D resourcesPath` 定义的目录
private typedef Init = haxe.macro.MacroType <[cdb.Module.build("test.cdb")]> ;
```

如果这行代码放在 Data.hx 文件下, 那么之后的数据访问都将通过 `Data.xxxxx` 来访问

> 注: 宏只解析类型, 并不会加载数据, 因此需要自已加载 .cbd 到 `Data.load`

对于一个名为 price 的表(sheet，注意表名不要大写字母开头)，将自动生成如下类型

* Price: 一个 abstract 类, 你可以通过 `-D dump=pretty` 找到这个类的细节。

  > 当你遍历一个表时（例如当表没有 UID 字段）,这个类能让你知道有哪些属性可访问。

* PriceDef：类似于 Price, 只是写成了 `typedef PriceDef = {}` 这种形式

* PriceKind：包含了 price 表中的 UID 字段的所有行。

（实际使用中你不需要关注这三个类型, 按着 IDE 的语法提示选择即可）

如果表格没有 UID 字段，则会有一个 `all` 的字段可以用来遍历所有行数据。

如果存在有 UID 字段, 在数据加载之后, 则可以通过类似于 `Data.price.get(data.PriceKind.xxx)` 的方式来访问所有 Price 的实例（即行数据, 看上去有点麻烦）

上边这些内容描述了普通数据的使用。

### 类型映射

castleDB 中的数据类型对应 haxe 中相应的类型

* Unique Identifier - (abstract enum)
* Text - String
* Boolean - Bool
* Integer - Int
* Float - Float
* Color - Int
* Enumeration - (abstract enum)
* Flags - (abstract enum)
* Reference - 当访问时将获得所引用的对象
* File - String, 只是路径文件名而已.
* Image - String(只有MD5值， 真实的图像被保存为同文件名下的 .img 下, 以 `md5=>base64` 的格式)
* Tile - cdb.Types.TilePos(包含 tileset 文件及 size,x/y位置以及可选的 width/height)
* List - cdb.Types.ArrayRead<SheetName_ColumName>(一个可读的结构数组对象允许 index访问, length,及迭代)
* Custom - SheetName_ColumName
* Dynamic -
* Data Layer - cdb.Types.Layer<SheetName>

  > 可通过将 Data.sheetName.all 数组传递给 decode 方法来解压

* Tile Layer - cdb.Types.TileLayer

  > 可通过 t.data.decode() 来解码，解压的数据为16位值的数组. 如果这个图层为 tile/ground模式将有 width/height值.如果为object模式将可以看到图层选区数据)

### in heaps

* 用宏解析 .cdb 文件(只包括类型, 不包含数据)

  > 这个 .cdb 文件应该存放于 `-D resourcesPath=SOME_PATH` 所定义的目录下, 默认将为项目文件(hxml或hxproj文件所在文件夹)的 res 目录

* 在代码中加载, 如: `Data.load(Res.data.entry.getText());`, 其中 data 为 data.cdb 文件.

* 参考 h2d.CdbLevel.hx 文件, 例: `new CdbLevel(Data.levelData, 0, s2d);`

<br />
<br />

## 迁移

实际上 castle 的所有功能将会被集成到新的编辑器即 hide 之中, 目前仅 2d 地图的编辑暂时不可用