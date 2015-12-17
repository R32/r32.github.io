---

layout: post
title:  魔兽世界插件开发
date:   2014-04-16 16:21:10
categories: other

---

http://www.wowwiki.com/Portal:Interface_customization

http://wowprogramming.com/docs

http://www.wowinterface.com/downloads/index.php  开发工具

http://www.wowwiki.com/Making_a_macro 基础宏

http://wenku.baidu.com/link?url=FAy226htPhXpU_7r_WUMvNCOtUjhf90KJpYRmTY449cEkxxSL0JLHjZ-LJK4zL8-oGZK9mbD2XQBypdKjKcEHkFqmoWrp-7B152q1EfZcFi
<!-- more -->

https://github.com/cmangos/issues 这里有一些仿的源码.


### 工具

网上能找到的基本都过期了, http://www.wowwiki.com/AddOn_Studio_2010, 未测

 * 开发环境 - ?? 只能使用 `/dump` 来调试各种 API 

	一些常用SLASH调试命令:
	```bash
	/dump EXPRESSION	# 相当于JS的在浏览器上输入 console.log(...)
	/run ReLoadUI()		# 重载插件
	```

 * 可视化布局IDE - 

 * LUA 编辑器 - 似乎 Notepad++ 是个不错的选择, 装上 XML 查错工具

 * BLP图片处理 - http://www.xnview.com/en/nconvert/

 * [mpq 解压工具 C#](https://github.com/WoW-Tools/MpqTool), 用于导出 FrameXML, 针对旧的 WOW版本没有 `exportInterfaceFiles` 命令

 * .....

### Extracting interface files

由于暴雪提供的 Interface Addon Kit 已经很久没有维护了,所以需要自已从游戏中导出界面文件,原文 http://us.battle.net/wow/en/forum/topic/2046735687#2

 1. 首先在命令行下带 `-console` 参数加载游戏

	```bash
	wow.exe -console
	```

 2. 接下来的会进入到游戏登录界面, 这时 按下 `~` 键(数字1左边的键), 将进入到 控制台窗口


 3. 获得FrameXML, 在控制台窗口输入下边命令: 

	```bash
	exportInterfaceFiles code	
	exportInterfaceFiles art		# 这个命令将导致使卡住一些分钟,因为导出的数据量有 1.3G 左右
	```
	一些比较旧的客户端(如: 1.121)可能并不支持这个命令, 因此需要自已解压 interface.MPQ
	
 4. 最后在目录中可以找到对应的 BlizzardInterfaceArt 及 BlizzardInterfaceCode 目录

<hr />

## AddOn

 * 插件名(即文件夹名) 存放于 `Interface/AddOns/`,

 * 插件描述(TOC): 文件名必须和插件名(文件夹名)一致

 * 布局(XML): 用于UI布局, 如果插件无界面,那么这个文件也不是必须的. 

 * 功能实现(LUA): 

### TOC

Table Of Content. 文件包含插件的特定信息(诸如 名称,描述, 等等.)以及如何从游戏端加载(哪个lua　xml 和加载顺序). 插件必须提供 toc 文件并具有和插件名(就是toc文件所在目录名)相同的名称. 示例:

```
## Interface: 60100
## Title: Waiting for Bob
## Notes: Nothing to be done.
## Version: 1.0
Bob.xml
Bob.lua
# comment
```

上边示例中主要有 3 种类型:

 1. `##` 用于指定一个 `.toc` 标记提供插件的元数据

	例如: `## Title: 鲍勃在等待`, 那么在游戏端时 插件列表将列出 "鲍勃在等待"

 2. 仅写有文件名的行, 指示在加载时需要加载的文件名, 并且按照出现的先后顺序加载. 通常放在 标记`##` 结束行后

 3. `#` 用于注释


下边是官方标记名称的说明(GetAddOnMetadata)

#### Interface

**资料片版本号**, 如查此标记的值和客户端不匹配, 那么只有在启用了 "加载过期插件" 时, 游戏才会加载插件.

有很多种方法可以得知当前客户端版本号, 通常 6.1 即为 60100

```
## Interface: 60100
```

#### Title

**标题**, 此标记的值将被显示在插件列表中.本地化的版本可以通过附加一个 区域字符后缀,客户端将自动选译本地化的版本,如果有的话. 标题名称还可能包含 UI 转义序列, 例如 颜色等等

```
## Title: Waiting for Godot
## Title-zhCN: 等待戈多
```

#### Notes

**备注**, 当用户鼠标悬停在 插件标题时将会出现的插件描述. 和标题一样,也可以通过添加 区域字符后缀 来实现本地化. 同样也能包含 UI 转义序列.

```
## Notes: "Nothing to be done"
```

#### Dependencies

**依赖**, 这个插件在加载之前 **必须** 加载的插件, 多个名称用逗号分隔, 除了 RequiredDeps 之外 Dependencies 或　任何以 Dep 开头的单词都可以

```
## Dependencies: someAddOn, someOtherAddOn
```

#### OptionalDeps

**可选依赖**, 这个插件加载之前 **应该** 被加载的插件, 多个名称用逗号分隔. 即使这些依赖不存在这个插件也能正常工作

```
## OptionalDeps: someAddOn, someOtherAddOn
```

#### LoadOnDemand

**仅在需要时加载** , 如果这个标记值为 1, 那么这个插件在开始时不会加载, 但是之后能通过另一个插件加载进来. 它被用于避免加载过多的只在特殊场合才会用的插件

```
## LoadOnDemand: 1
```

#### LoadWith

**一起加载**, 以逗号分隔各插件名清单, 当清单的插件加载时, 当前插件也随着加载. 该功能在有在 LoadOnDemand 为 1 时才起作用. (似乎没人使用这个标记.因此作用不明确)

#### LoadManagers

**加载管理器**, 以逗号分隔各插件名清单; 如果加载的插件属于清单中的一项,那么这个插件将被处理为 LoadOnDemand, 一个示例: http://wow.gamepedia.com/AddonLoader

#### SavedVariables

**离线变量** ,以逗号分隔的各全局变量名,当客户端退出时这些全局变量将保存到磁盘, 当插件加载时这些变量将加载到全局环境. 文件保存于 `WTF\Account\nnnnnnn#n\SavedVariables`

由于是全局变量,因此通常插件有一个变量名就已经够了, 因为这些变量通常为 table 类型.　客户端会自动处理这些变量赋值, 不需要做任何事件检测.

```
## SavedVariables: foo, bar
```

#### SavedVariablesPerCharacter

**离线变量单独角色** 功能和 SavedVariables 一样, 但这个变量保存于单个角色,而 SavedVariables 用于同一账号下所有角色. 文件保存于 `WTF\Account\nnnnnnn#n\服务器名\角色名\SavedVariables`

```
## SavedVariablesPerCharacter: somePercharVariable
```

#### DefaultState

**默认状态**, 确定是否在首次安装时启用插件. 如果此标记的值为 "disabled". 那么用户在游戏中必须勾上才会被启用

```
## DefaultState: enabled
```

#### Secure

**插件安全**, 如果此标记值为 1, 并且插件由暴雪进行数字签名, 那它的代码是安全的, 那么这些代码允许调用一些 Protect API

#### Author

作者

#### Version

**版本**, 一些自动更新工具可能喜欢字符数字开头的版本号

#### 其它元数据标记

任何带有前缀 `X-` 的标记,用于插件自定义一些查询,可能用途包括:

 * X-Date

 * X-Website

 * X-Feedback 


<hr />

### XML

https://github.com/tekkub/wow-ui-source

http://wowwiki.wikia.com/wiki/XML_elements

其实感觉这个文件是通过XML文件来生成Lua文件, 因为一些布局方式的代码如果直接用Lua实现会有些复杂,

#### LayoutFrames

http://www.cnblogs.com/apexaddon/articles/1507772.html

 * Frames 可以将各种 LayoutFrame 放置其中

	attributes:
  - name(string) - 此元素的标识符, 将作为Lua全局变量, 元素必须得有这个属性(虽然一些文档表示如果仅作为显示可以没有,但我没成功过)

		`$parent`作前缀的名字表示这里引用父元素的名字: 如 "$parentWorld" 如果 父元素名为 "Hello", 则这个元素名为 "HelloWorld"
		，这个特性能得能方便的复制现有的子元素到其它Frame中去
		
  - parentKey(string) - 可以通过父元素访问这个元素的名字(旧版本不支持), 比如父元素为"Hello",这个设为"world", 则 "Hello.wrold" 将表示这个元素.

  - parentArray(string) - ??? 和 parentKey类似,但挂接在父元素的一个特定数组上???

  - inherits(string) - 值为某个模板名, 将使得当前元素继承模板的 properties和attributes.

  - virtual (boolean) - 将此frame定义成模板（虚拟类型）, 这使得运行时不会创建这个元素(即直接引用这个元素的name将为空, 只有当某个继承的frame加载之后才有效), 默认为 `false`

  - setAllPoints(boolean) - 设置这个元素的所有锚点基于于父元素的内框,它将和它的父框架具有相同的大小和位置

  - hidden(boolean) - 默认为ture, 元素加载后将隐藏

  - alpha(float) 0值为全完透明, 1 为透时.

  - parent(elementName) 定义这个元素的父元素，例如各种插件都会选择挂在相应的父元素上.比如 Minimap, 通常都设为 "UIParent"

  - toplevel(boolean) 顶层(？？？在多个Frame之间)

  - movable(boolean) 是否可自由拖动

  - enableMouse(boolean) 是否允许鼠标交互

  - id(int) id 值并没有任何效果, 常用于区分相似的同层元素,便于跟踪调度,如动作条栏上 1~12 个技能栏

  - frameStrata(string) 标识此元素所在的层

		```bash
		BACKGROUND 	# 通常用于放置不与鼠标事件发生反应的对象。所有位于此框架层中的对象均不会对鼠标事件发生反应，除非其框架级别大于1
		LOW		# 被默认用户界面用于增益效果框架、物品耐久度框架、团队界面及宠物框架
		MEDIUM	# UIParent框架所在的框架层，也是其所有子框架默认所在的框架层
		HIGH	# higher-priority UI 元素的默认层, 如 Calendar(日历) 和 Loot frames(拾取窗口)
		DIALOG	# 用于任何弹出并试图与用户交互的对话框类框架
		FULLSCREEN	# 全屏层,例如世界地图, 打开时将遮盖住所有界面
		FULLSCREEN_DIALOG	# 全屏层上的对话框层
		TOOLTIP		# 提示窗口层.
		```
		
  - enableKeyboard(boolean) 元素是否接收键盘输入

  - clampedToScreen(boolean) 禁止元素移出屏幕,(方式未知, 可能是指拖动)

  - protected(boolean) 只有暴雪自身的UI才能使用这项, 因此忽略这项

	元素: (一些内容过长的自已去 WIKI看) http://wowwiki.wikia.com/wiki/XML_properties
  - Size: 定义元素的尺寸, 通常由其子标签 `<AbsDimension x="64" y="64" />` 来定义.
  - Anchors: 定义元素的位置
  - TitleRegion: 定义一个用作拖动的点击区域
  - Backdrop: 定义此元素的背景
  - HitRectInsets: 更改用户可点击此元素的区域
  - Layers: 这个层定义的子元素仅作为显示, 一些文字标题, 材质（仅接受 FontSring 和 Texture 元素）, 
  - Frames：子元素由各种Frame元素组成, 如 按钮,输入框 .....等等  
  - Scripts: 定义事件,如 OnLoad, OnEnvent, OnClick ......等等
  - Attributes: TODOS: 

 * FontString: 不可编辑的文本字符串,

	attributes:
  - name:	
  - inherits: 
  - virtual
  - hidden
  - bytes
  - text
  - spacing
  - outline
  - monochrome
  - nonspacewrap
  - wordwrap
  - justifyH
  - justifyV
  - maxLines
  - maxLines

	elements:
  - Size
  - Anchors
  - FontHeight
  - Color
  - Shadow

 * Texture



#### Layers

layer level:

 * BACKGROUND: 第一(最底)层

 * BORDER: 第二层

 * ARTWORK: 第三层, 如果没有指定则作为 layer 的默认值

 * OVERLAY: 第四层

 * HIGHLIGHT: 顶层, 在鼠标移动到其区域时,将自动显示(如果enableMouse属性true), 看上去
 

#### Bindings.xml

example: header 属性表示按键绑定一个分类, 需要注意的是示例中的 "ATLAS_TITLE" 是个插件自已设置的变量.

```xml
<Bindings>
	<Binding name="ATLAS_TOGGLE" header="ATLAS_TITLE">
		Atlas_Toggle();
	</Binding>
	<Binding name="ATLAS_OPTIONS">
		AtlasOptions_Toggle();
	</Binding>
</Bindings>
```


用于给插件添加按键绑定.

<hr />

### LUA

wow api, 内容有些多 http://wowprogramming.com/docs

**lua 语法15分钟快速入门** - https://github.com/adambard/learnxinyminutes-docs/blob/master/zh-cn/lua-cn.html.markdown 

http://www.cnblogs.com/hewei2012/p/3552797.html

http://www.lua.org/manual/5.1/


## 其它

### UI 转义序列

http://www.wowwiki.com/UI_escape_sequences

http://wowprogramming.com/docs/api_types#hyperlink

#### 颜色:

 * `|cAARRGGBB` 设置字体颜色（AA 值目前被忽略并且值总是为 FF）, 例: `|cFFFF0000` 表红色字体


 * `|r` 结束当前颜色改变. 颜色将返回到上一个颜色设置


#### Links

格式为 `|H(linktype):(linkdata)|h(text)|h`, 用于 linktype, 当 linktext 被点击时,将由UI处理解析它们，
而且也没有解析这些字符串的方法, 大都是通过类似于 `strsub(link, 1, 4) == "item"`

 * linktype 通常表示是什么类型的链

 * linkdata 表示为 linktype 类型的数据

 * text 文本描述符

 * **Note**: 当要把这个 linkString 发送到聊天窗口时使用 `\124` 替换掉 "|"

分隔符

 * [itemLink](http://wowwiki.wikia.com/wiki/ItemLink),物品链接,注意区别 itemString,(因为一些方法喜欢用变量名 link 来表示 itemString) itemLink的内部包含了itemString
	
	格式示例: 
	
	```bash
	|cff9d9d9d|Hitem:7073:0:0:0:0:0:0:0:80:0:0:0:0|h[Broken Fang]|h|r
	
	# 各部分析	
	|cff9d9d9d		# 自定义的颜色值,开始
	|H	# hyperlink 开始
	item:7073:0:0:0:0:0:0:0:80:0:0:0:0	# linkdata, 这里表现为 itemString
	|h	# linkdata 结束
	[Broken Fang]	# 文本描述字符
	|h	# hyperlink 结束
	|r	# 恢复到通常状态的颜色 
	```

	[itemString](http://wowwiki.wikia.com/wiki/ItemString): 经常作为 UI 的文本内容,由"item" 与 13 个 ":" 分隔符组成.
	
	示例, 注意种版本格式可能会有差异, 可以检索wiki网页的历史版本,如比较旧的[itemString](http://wowwiki.wikia.com/wiki/ItemString?oldid=76418)	
	
	```bash
	item:7073:0:0:0:0:0:0:0:80:0:0:0:0
	
	# 各部分以 : 作为分隔符
	item	# (0)itemString 的识别符总是为"item"
	7073	# (1)itemID, 物品ID值, 经常作为 GetItemInfo() 的参数。
	0		# (2)enchantId, 附魔
	0,0,0,0	# (3~6)jewelId1~4个, 作为物品的宝石插孔,因此其值为 EnchantID, 在 Patch 2.0 时期添加
	0		# (7)suffixId, 物品随机属性(比如一些制造类装备会随机的给属性), 参见 SuffixIds.
	0		# (8)uniqueId, ???一些特定的信息或者属于特定的场景(如风暴要塞的橙器), 或一些任务中的道具常常具有这个属性
	80		# (9)linkLevel, 提供的角色等级, 用于计算传家宝物品的弹性属性, 添加于 Patch 3.0 
	0		# (10)specializationID, ???专精(TODOS: 同一件装备在专精下属性将不一样), 添加于 Patch 6.2.0
	0		# (11)reforgeld 添加于 Patch 4.0.2
	0		# (12)unknown1 未知估计是作为保留值
	0		# (13)unknown2
	
	# 你可以使用如下LUA代码来获得各部分值, 注意旧版本不支持 strsplit
	local _, itemId, enchantId, jewelId1, jewelId2, jewelId3, jewelId4, suffixId, uniqueId,
	linkLevel, specializationID, reforgeId, unknown1, unknown2 = strsplit(":", itemString)
	```

	几个相关的方法全都返回 hyperlink
	```
	GetAuctionItemLink(TYPE, index) -- 拍卖行,TYPE: "list","bidder","owner"
	GetContainerItemLink(bagID, slotID) -- 背包
	GetInventoryItemLink("unit",slot) -- 装备面板栏
	```

 * [questLink](http://wowwiki.wikia.com/wiki/QuestLink) 任务链接,点击后将显示一些任务描述
	
	格式示例: 
	```bash
	|cff808080|Hquest:99:15|h[Arugal's Folly]|h|r
	|cffffff00|Hquest:982:17|h[Deep Ocean, Vast Sea]|h|r
	
	# 一些部分参考 itemLink 中的描述, 这里主要描述 questString
	# http://wowprogramming.com/docs/api_types#hyperlink
	quest	#(0) 识别符,总是为 "quest"
	99		#(1) questId, 任务唯一标识符, 但是并没有任何可用的API使用它(防止被人为的解析任务链?), 只存于任务数据库中.
	15		#(2) questLevel, 角色尝试这个任务所需要的等级,(如果值为 -1, 则表示没有等级限制,比如一些节日任务)
	
	# \124 为字符 "|"
	/script SendChatMessage("\124cffffff00\124Hquest:99:15\124h[Arugal's Folly]\124h\124r", "SAY", "Common");
	/script DEFAULT_CHAT_FRAME:AddMessage("Shift-click this link to put into chat: \124cffffff00\124Hquest:99:15\124h[Arugal's Folly]\124h\124r");
	```
	
	更多示例: 
	```lua
	local function findLast(haystack, needle)
		local i=string.gfind(haystack, ".*"..needle.."()")()
		if i==nil then return nil else return i-1 end
	end
	
	local indx = findLast(desc, ":");
	local questId = string.sub(desc, 1, indx-1);
	local questLevel = string.sub(desc, indx+2);
	```

 * spell:
	
	```
	|cffffd000|Henchant:59387|h[Certificate of Ownership]|h|r
	```

 * channel: `|Hchannel:Guild|h[公会]|h` 没有文档.


 * player: 点击 playerLink 默认情况下左键点击将产生"密语"的文本输入框, 右键则将弹出一个上下文菜单(有如邀请入队或加入黑名单之类的选项),Shift+左键 将查询(/who NAME)这个玩家的一些信息. 

	```bash
	|Hplayer:Aerdrig:1:WHISPER:AERDRIG|h[Aerdrig]|h
	
	# 
	player	#(0) 标识符
	Aerdrig	#(1) name,玩家名, 当跨服时(比如在战场)名字表现为(name-server,跨服邮寄小号也是这种形式)
	1		#(2) ChatID, 聊天窗口
	WHISPER	#(3) ???
	AERDRIG	#(4) ???
	```
	注意 playerLink 仅能由客户端实现, 将playerLink像物品一样发送到聊天窗口将不会起作用.

 * playerGM: 和 "player" 类似, 但用于和 GM 聊天.

	```bash
	|HplayerGM:Eyonix|h[Eyonix]|h
	```
	
 * glyph: 雕文

	```bash
	|cff66bbff|Hglyph:23:460|h[Glyph of Fortitude]|h|r
	```