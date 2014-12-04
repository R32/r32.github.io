---

layout: post
title:  导出代码注释为 API 文档
date:   2014-05-05 21:03:10
categories: haxe

---

目前 haxe 官方抛弃了以前旧的文档生成器, 而转而使用了 [haxe dox](https://github.com/dpeek/dox) 来构建 API 文档.


<!-- more -->

<br />

#### 注释内容规范

```
/**
* 这种每一行 都有 星号(*) 的注释, dox 不能很好的隔开一行, 会将所有内容连接在一行上
*
* 这时 只能 使用 一些简单的 HTML 标签, 来做一些格式化,如: <p>,<br>,<ul>,<li> ...
*
* 并且这种注释, dox 也不能正确的认别 markdown
*/


/**
	只有注释首尾才有 星号(*), dox 能正确解析, 包括 markdwon, 隔开一行,只要空一行就行了. 

	但是问题是 flashdevelop 自动生成的 注释是上边那种形式的, 

	对于较长内容的说明, 最好是采用这种形式, 以避免内容全连在一行.
*/
```


#### 文档生成


 * 参考[openfl doc] ,其它 [all.hxml] , [ImportAll.hx] , [haxepunk doc]
[openfl doc]:https://github.com/openfl/openfl/blob/master/documentation/build.hxml
[haxepunk doc]:https://github.com/HaxePunk/HaxePunk/blob/dev/doc/doc.hxml
[all.hxml]:https://github.com/HaxeFoundation/haxe/blob/development/extra/all.hxml
[ImportAll.hx]:https://github.com/HaxeFoundation/haxe/blob/development/extra/ImportAll.hx

 * 这里是我用h3d做的一个样例: genxml.html

	```bash
	# 第一步, 使用导出 haxe -xml 导出 XML
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

	# 第二步, 使用 dox 生成 API 文档, 
	--next
	-cmd haxelib run dox -i . -in h3d -in h2d -in hxd
	```
 * 注意:  `-in` 参数, 选择所需要的类,否则 haxe 的标准库也会被添加进去.



<br />



#### dox 命令行

你可以不必安装这个库, [下载](https://github.com/dpeek/dox) theme 文件夹 和 run.n 文件就可以了, 并用 `neko run.n` 来替换 `haxelib run dox`

 * 命令为: `neko run.n -i export.xml`

	```bash
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

	#重要: Add a path include filter 
	-in  --include

	#Add a path exclude filter
	-ex  --exclude

	#Set the page main title
	--title

	#Set the theme name or path
	-theme

	#Defines key = value
	-D  --defines
	```

<br />



#### 其它

由于 使用 -in 代替了 -ex , **不再需要**参考这个文件, 

```makefile
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

```
<br />

 * 生成的结果

	![结果](/assets/img/gen-haxe-doc-demo.png)