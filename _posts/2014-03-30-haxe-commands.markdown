---
layout: post
title:  Haxe 命令行
date:   2014-03-30 21:10:10
categories: haxe
---
#### haxe

haxe 命令主要用于编译 .hx 文件,如果你使用 flashdevelop 或其它编辑器时,通常不用理会这个命令. 

 * 命令行下 输入 `haxe --help`.官网参考 [Haxe Compiler](http://haxe.org/doc/compiler?lang=en)

 * 缓存编译结果,使用 haxe --wait 和 haxe --connect 编译项目.
 > 缓存编译,只编绎改动过的文件. 详情见:[haxe completion]

	```bash
	# 服务绑定6000端口,用于缓存编译结果
	# -v 将会显示详情,如哪些文件缓存还是编绎了,一般情况不需要添加 -v 参数
	haxe -v --wait 6000

	# 编译的时候 --times 可以显示编译所花的时间
	haxe --times --connect 6000 build.hxml

	#如果使用的是 openfl 的 project.xml,则可以像下边:
	lime build flash --connect 6000 --times
	```

<!-- more -->

[编译-flag]:http://haxe.org/doc/compiler
[编译-define]:http://haxe.org/manual/tips_and_tricks
[haxe completion]:http://haxe.org/manual/completion


<br />


#### haxelib

haxelib 用于管理 haxe库

 * 命令行下 输入 `haxelib --help`

 * 一些常用命令:

	```bash
	haxelib info lime #连网查询列出关于 lime 库的信息
		
	haxelib list  # 列出本地所有安装包,用`[]` 中适号包含着的为当前所使用版本
		
	haxelib list li   #列出本地包含 li 字符的库有哪些,其一些其它信息

	haxelib install haxepunk #连网安装名为 haxepunk 的库
		
	haxelib local some.zip  #安装下载到本地的库,zip名字随意
		
	haxelib update stablexui #连网更新名为 stablexui 的库
		
	haxelib upgrade #连网检测所有本地库是否存在更新,并提示是否更新
		
	#下边命令是指定一个库的开发目录
	#当你修改 某一个库的源码时,可以先复制一份到其它目录
	#然后用 haxelib dev 指定使用这个目录的文件作为开发
	haxelib dev libname directory_name 
		
	haxelib dev haxeui G:\dev-haxeui # 以后调用 haxeui 库时将使用 G:\dev-haxeui 下的文件
	# haxelib list haxeui 可以显示 haxeui 信息,是否使用了 dev 
	haxelib dev haxeui #不带目录名 从dev模式中切换回来
		
	haxelib selfupdate # 更新 haxelib 自已
		
	haxelib remove libname #删除库,这个库将会从磁盘移除
	 
	haxelib run libname #运行 libname库目录下 编译为neko平台的 libname.n 文件
	```

 * 开发并上传库 见:[haxe.org/com/haxelib](http://haxe.org/com/haxelib)


<br />

#### nekotools

nekotools 是一个安装 haxe 时附带的强力工具,nekotools 很简单只有二个命令

 * **`nekotools --help`**

 * **`nekotools server`** 建立一个 web 服务器,可以用于 http 服务

	```bash
	#做网页相关的东西时,很多功能需要以 http 的形式访问才能正常.
	#不带参数快速绑定当前目录到 localhost:2000
	nekotools server
	# 绑定 d:\dev 目录到 0.0.0.0:80
	nekotools server -p 80 -h 0.0.0.0 -d d:\dev
	```

 * **`nekotools boot`**	将 neko平台的 .n 文件转换成独立的 exe 文件


<br />


#### haxe doc

haxedoc这个命令好像已经被放弃了,而改用了另一个叫haxe dox,**但是** 生成 xml 还是用的 haxe -xml 命令

 * [如何生成 Haxe API 文档]({% post_url 2014-05-5-haxe-doc-gen %})

<br />

