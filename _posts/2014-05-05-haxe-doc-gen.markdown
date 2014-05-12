---
layout: post
title:  生成Haxe API文档
date:   2014-05-05 21:03:10
categories: haxe
---

#### 1.使用 `haxe -xml` 导出 xml 文件

 * 一些参考 [all.hxml] , [ImportAll.hx] , [haxepunk doc]

[haxepunk doc]:https://github.com/HaxePunk/HaxePunk/blob/dev/doc/doc.hxml
[all.hxml]:https://github.com/HaxeFoundation/haxe/blob/development/extra/all.hxml
[ImportAll.hx]:https://github.com/HaxeFoundation/haxe/blob/development/extra/ImportAll.hx

 * 这里是我用h3d做的一个样例:
 {% highlight bash %}
 #我在 h3d 的目录中建了一个叫 doc 的目录,并建立一个叫 genxml.hxml 的文件,内容如下:
 #主要是参考主目录的 engine.hxml 改的
 --no-output
 -cp ../
 --macro include('h3d')
 --macro include('h2d')
 --macro include('hxd',true,['hxd.res.FileTree'])

 -swf haxedoc.swf
 -swf-version 11.8
 -lib hxsl
 -D resourcesPath=../samples/res
 -D h3d
 
 -xml pkgs.xml
{% endhighlight %}

<!-- more -->
 * 最后命令行输入 `haxe genxml.html` 就完成了 `pkgs.xml`



<br />



#### 2.然后用 haxe dox,编译 xml 文件为 html

 * haxe dox 的 `Github` 网址为 [github.com/dpeek/dox](https://github.com/dpeek/dox)

 * 其实不用重新编译,只要用到 theme文件夹和 run.n 文件就可以了

 * 命令为: `neko run.n -i export.xml`
{% highlight bash %}

#haxe dox 没有 `--help` 这个参数,下边选项从源码中复制过来的
-r  --document-root

#Set the output path for generated pages
-o  --output-path
	
#Set the xml input path
-i  --input-path

#Add template directory
-t  --template-path

#Add a resource directory whose contents are copied to the output directory
-res  --resource-path

#Add a path include filter
-in  --include

#Add a path exclude filter
-ex  --exclude

#Set the page main title
--title

#Set the theme name or path
-theme

#Defines key = value
-D  --defines
{% endhighlight %}


<br />



#### 其它

 * 一个makefile文件样例. 注:这个 makefile **不是必须**的.

{% highlight makefile %}
# 到 https://github.com/dpeek/dox 下载 run.n.这里我改了名字为:gendoc.n
# 需要下载 theme 目录
 

CC	:= neko gendoc.n

# --> 修改 TARGET_DIR 为你要输出的目录,注意: haxe dox  不支持 cygwin环境下跨磁盘的的目录
TARGET_DIR	:=	./api-h3d

# --> 修改 FILES 为 你用 haxe -xml 生成的 xml 文件. 目录/文件名
FILES	:= pkgs.xml


TARGET	:=	$(TARGET_DIR)/index.html


# 赋值空格
EMPTY:=
SPACE:= $(EMPTY) $(EMPTY)

#排除这些不要的类
EX := microsoft javax haxe flash format hxsl Array ArrayAccess Bool Class Dynamic EReg Enum EnumValue Float
EX += IMap Int Iterable Iterator Lambda List Map Math Null Reflect Std String StringBuf
EX += StringTools Type UInt ValueType Void Xml XmlType Date

EXCLUDE := $(addprefix -ex$(SPACE),$(EX))

all : $(TARGET)
	
$(TARGET):
	$(CC) -i $(FILES) -o $(TARGET_DIR) $(EXCLUDE)

clean:
	@echo clean...
	@rm -rf $(TARGET_DIR)

{% endhighlight %}


<br />

 * 生成的结果

![结果](/assets/img/gen-haxe-doc-demo.png)