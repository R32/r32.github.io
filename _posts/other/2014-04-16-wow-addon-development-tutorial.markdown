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
<!-- more -->

### 资源


#### 工具

网上能找到的基本都过期了, http://www.wowwiki.com/AddOn_Studio_2010, 未测

 * 开发环境 - ??

 * 可视化布局IDE - 

 * LUA 编辑器 - ??

 * BLP图片处理 - 

 * .....

#### Extracting interface files

由于暴雪提供的 Interface Addon Kit 已经很久没有维护了,所以需要自已从游戏中导出界面文件,原文 http://us.battle.net/wow/en/forum/topic/2046735687#2

 1. 首先在命令行下带 `-console` 参数加载游戏

	```bash
	wow.exe -console
	```

 2. 接下来的会进入到游戏登录界面, 这时 按下 `~` 键(数字1左边的键), 将进入到 控制台窗口


 3. 在控制台窗口输入下边命令: 

	```bash
	exportInterfaceFiles code	
	exportInterfaceFiles art		# 这个命令将导致使卡住一些分钟,因为导出的数据量有 1.3G 左右
	```
	
 4. 最后在目录中可以找到对应的 BlizzardInterfaceArt 及 BlizzardInterfaceCode 目录

<hr />

### AddOn

 * 插件名(即文件夹名) 存放于 `Interface/AddOns/`,

 * 插件描述(TOC): 文件名必须和插件名(文件夹名)一致

 * 布局(XML): 用于UI布局, 如果插件无界面,那么这个文件也不是必须的. 

 * 功能实现(LUA): 

#### TOC

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

	> 例如: `## Title: 鲍勃在等待`, 那么在游戏端时 插件列表将列出 "鲍勃在等待"

 2. 仅写有文件名的行, 指示在加载时需要加载的文件名, 并且按照出现的先后顺序加载. 通常放在 标记`##` 结束行后

 3. `#` 用于注释


下边是官方标记名称的说明(GetAddOnMetadata)

##### Interface

**资料片版本号**, 如查此标记的值和客户端不匹配, 那么只有在启用了 "加载过期插件" 时, 游戏才会加载插件.

有很多种方法可以得知当前客户端版本号, 通常 6.1 即为 60100

```
## Interface: 60100
```

##### Title

**标题**, 此标记的值将被显示在插件列表中.本地化的版本可以通过附加一个 区域字符后缀,客户端将自动选译本地化的版本,如果有的话. 标题名称还可能包含 UI 转义序列, 例如 颜色等等

```
## Title: Waiting for Godot
## Title-zhCN: 等待戈多
```

##### Notes

**备注**, 当用户鼠标悬停在 插件标题时将会出现的插件描述. 和标题一样,也可以通过添加 区域字符后缀 来实现本地化. 同样也能包含 UI 转义序列.

```
## Notes: "Nothing to be done"
```

##### Dependencies

**依赖**, 这个插件在加载之前 **必须** 加载的插件, 多个名称用逗号分隔, 除了 RequiredDeps 之外 Dependencies 或　任何以 Dep 开头的单词都可以

```
## Dependencies: someAddOn, someOtherAddOn
```

##### OptionalDeps

**可选依赖**, 这个插件加载之前 **应该** 被加载的插件, 多个名称用逗号分隔. 即使这些依赖不存在这个插件也能正常工作

```
## OptionalDeps: someAddOn, someOtherAddOn
```

##### LoadOnDemand

**仅在需要时加载** , 如果这个标记值为 1, 那么这个插件在开始时不会加载, 但是之后能通过另一个插件加载进来. 它被用于避免加载过多的只在特殊场合才会用的插件

```
## LoadOnDemand: 1
```

##### LoadWith

**一起加载**, 以逗号分隔各插件名清单, 当清单的插件加载时, 当前插件也随着加载. 该功能在有在 LoadOnDemand 为 1 时才起作用. (似乎没人使用这个标记.因此作用不明确)

##### LoadManagers

**加载管理器**, 以逗号分隔各插件名清单; 如果加载的插件属于清单中的一项,那么这个插件将被处理为 LoadOnDemand, 一个示例: http://wow.gamepedia.com/AddonLoader

##### SavedVariables

**离线变量** ,以逗号分隔的各全局变量名,当客户端退出时这些全局变量将保存到磁盘, 当插件加载时这些变量将加载到全局环境. 文件保存于 `WTF\Account\nnnnnnn#n\SavedVariables`

由于是全局变量,因此通常插件有一个变量名就已经够了, 因为这些变量通常为 table 类型.　客户端会自动处理这些变量赋值, 不需要做任何事件检测.

```
## SavedVariables: foo, bar
```

##### SavedVariablesPerCharacter

**离线变量单独角色** 功能和 SavedVariables 一样, 但这个变量保存于单个角色,而 SavedVariables 用于同一账号下所有角色. 文件保存于 `WTF\Account\nnnnnnn#n\服务器名\角色名\SavedVariables`

```
## SavedVariablesPerCharacter: somePercharVariable
```

##### DefaultState

**默认状态**, 确定是否在首次安装时启用插件. 如果此标记的值为 "disabled". 那么用户在游戏中必须勾上才会被启用

```
## DefaultState: enabled
```

##### Secure

**插件安全**, 如果此标记值为 1, 并且插件由暴雪进行数字签名, 那它的代码是安全的, 那么这些代码允许调用一些 Protect API

##### Author

作者

##### Version

**版本**, 一些自动更新工具可能喜欢字符数字开头的版本号

##### 其它元数据标记

任何带有前缀 `X-` 的标记,用于插件自定义一些查询,可能用途包括:

 * X-Date

 * X-Website

 * X-Feedback 


<hr />

#### XML


<hr />

#### LUA

wow api, 内容有些多 http://wowprogramming.com/docs

**lua 语法15分钟快速入门** - https://github.com/adambard/learnxinyminutes-docs/blob/master/zh-cn/lua-cn.html.markdown 


<hr />

### 其它

#### UI 转义序列

详细在 http://www.wowwiki.com/UI_escape_sequences

颜色:　　

 * `|cAARRGGBB` 设置字体颜色（AA 值目前被忽略并且值总是为 FF）, 例: `|cFFFF0000` 表红色字体


 * `|r` 结束当前颜色改变. 颜色将返回到上一个颜色设置

链接: 通常用于在聊天文本中显示一些特殊文本

 * `|Hlinktype:linkstring|hLinktext|h` - for hyperlinks, 当 linktext 被点击时, widget 处理程序将被调用

 * `|Hitem：ItemString|hLinktext|h` - 物品链接

 * `|Henchant：EnchantID|hLinktext|h` - 附魔链接

 * ......


