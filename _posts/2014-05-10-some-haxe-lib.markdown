---

layout: post
title:  一些类库集合
date:   2014-05-10 9:15:56
categories: haxelib

---

收集的一些 haxe 类库,通常这些库都能在 github 找到相关项目.


<!-- more -->

#### 工具

 * **[format](https://github.com/HaxeFoundation/format)**

	> 用于解析各种文件或数据.
	
 * **[dox](https://github.com/dpeek/dox)**

	> 帮助文档生成器, haxe 官网目前使用这个,而丢弃了以前的文档生成器. [示例: h3d API]({% post_url 2014-05-05-haxe-doc-gen %})

 * **[hxsl](https://github.com/ncannasse/hxsl)**

	> 写 adobe AGAL 变得如此简单. [使用指南](http://haxe.org/manual/hxsl).
	
	

#### 游戏引擎

 * **[haxeflixel](https://github.com/haxeflixel)**

	> 全位图游戏引擎,社区以及周边都远比 haxepunk 强大

 * [haxepunk](https://github.com/HaxePunk) 全位图

	> 全位图游戏引擎, 比 haxeflixel 更简单, 像是个人维护的项目

#### UI

 * [haxeui](https://github.com/ianharrigan/haxeui)

	> 使 xml 配置布局, CSS 配置 skin.

	> 感觉官方默认的 CSS 颜色配置并不好看, 1.3.0 版本时, CSS 出错了还不好找错在哪

	> 希望这个库能使用 h3d/h2d 下的 css 解析器来处理 css 解析.

	> 加载和解析的时间比 stablexui 长.

 * **[stablexui](https://github.com/RealyUniqueName/StablexUI)**

	> 基于 xml 配置布局和 skin, 简单,高效 移动UI首选


#### 未分类

 
 * **[openfl-bitfive](https://github.com/YellowAfterlife/openfl-bitfive)**

	> readme 写着比 openfl 默认的 **html5后端** 更好.
	
 * **[mcli](https://github.com/waneck/mcli)** 

	> 简单创建 CLI 程序,mcli 可以把 文档注释 通过宏处理变成 相应的帮助,这点非常好.

 * [hxargs](https://github.com/Simn/hxargs)

	> 简单创建 CLI 程序, 帮助写在自定义的元标签 `@doc` 上.

 * [Cocktail](https://github.com/silexlabs/Cocktail)

	> 解析 简单的 HTML/CSS,并生成各平台,个人感觉这个更像是一个 UI库.	








