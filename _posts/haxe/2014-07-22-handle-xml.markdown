---
layout: post
title:  处理XML
date:	2014-07-22 07:32:21
categories: haxe
---


haxe 提供一些处理 XML 文件的标准库使得它们可以跨平台使用, 当然也可以选择各平台的源生 XML 库, 但源生 XML 库不在这篇文章的描述范围内. 总的来说 `haxe.xml.Fast` 是一个经常会用到的类.

http://old.haxe.org/doc/cross/xml

<!-- more -->

### 基础

haxe 提供的最基本的 XML 类, 提供的功能简单，每个 XmlType 都可以看成是一个 Xml 的实例. 

 * 需要注意成员方法仅适用于其中一些 XmlType.

 * 所有 attribute 以及 tagName 都是区分大小写的

#### XmlType

一个 enum 类型,后边小括中的数字表示为在 [HTML(浏览器)](http://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core.html)中对应的属性值, 和 haxe 给的值并不一致, 不过不需要关心这些.

 * `Document` : 文档类型(9), 通常为 Xml.parse 返回的对象

 * `Element` : 元素类型(1)

 * `DocType`: DTD DOCTYPE 文档类型(10),例: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">`

 * `CData`:  (4)`<![CDATA[ ]]>`

 * `Comment`:  (8)`<!-- -->`

 * `PCData`：(3)即文本(Text)节点

 * `ProcessingInstruction`: (7)例 `<?xml version="1.0" encoding="utf-8" ?>` 

#### Xml

静态方法:

```haxe
parse(str:String):Xml		// 解析一个字符串为 Xml 实例
createDocument():Xml		// 创建一个新空Xml文档节点,相当于 private::new Xml()
createXXXXX(str:String):Xml	// 创建并回返回相应的节点
```

成员字段:

```haxe
var nodeName:String;	// Element节点的名称

var nodeType:XmlType;	// 只读,节点的类型.

var nodeValue:String;	// 节点值, 只有当节点 **不是** Document 或 Element 类型时才有效.

var parent:Xml;		// 只读, 返回节点的父节点. 没有则返回 null. 只有 Document 或 Element 才能作为父节点.
```

成员方法: 详细自行参考 API

```haxe
// 属性, 所有属性名或值都是区分大小写的(case-sensitive)
exists(att:String):Bool		// 检测 Element节点是否存在指定的 attribute.
get(att:String):String		// 获取 Element节点 attribute, 不存在则返回 null.
set(att:String, value:String):Void		// 设置 Element节点 attribute.
remove(att:String):Void		// 删除 Element节点 attribute.

// 获取
firstChild():Xml			// 除了元素,还有 Comment,CData,PCData 这些节点,
firstElement():Xml			// 只返回第一个元素（即Element类型的节点）

// 修改
addChild(x:Xml):Void		// 指定节点追加到 Document 或 Element 子级列表中
insertChild(x:Xml, pos:Int):Void	// 插入节点到 Document 或 Element 子级列表的指定位置, 0 表示最前

// 迭代器
attributes():Iterator<String>		// 返回 Element 节点的所有  attribute names

iterator():Iterator<Xml>			// Document 或 Element 的所有子元素(Element,PCData,CData.....)

elements():Iterator<Xml>			// Document 或 Element 的所有 Element 子元素
elementsNamed(name:String):Iterator<Xml>	// Document 或 Element 的所有指定了名称的 Element 子元素

// 不解释
toString():String
```

### haxe.xml

由于直接用 Xml 过于烦琐, 因此 `haxe.xml` 包下提供的一些快速操作 Xml 的类.

 * `Parser`: 在 `Xml.parse` 使这个类解析 XML 字符串

 * `Printer`: 在 `Xml::toString` 使用这个类输出 Xml实例为字符串

#### Fast

这是一个处理 XML 时会经常用到的类, http://old.haxe.org/doc/advanced/xml_fast

 * `.name` 返回当前元素名字（和 Xml.nodeName 一样）

 * `.x` 返回当前相应的 Xml 实例(注:Fast 和 Xml 是二个不同类)

 * `.att.<name>` 访问给定的属性, 如果不存在将抛出异常

 * `.has.<name>` 检测是否存在属性

 * `.elements` 返回所有　元素(Xml.Element)　清单

 * `.node.<name>` 返回指定名称的第一个子节点,如果不存在将抛出异常

 * `.nodes.<name>` 返回指定名称的所有子节点

 * `.hasNode.<name>` 检测是否存在指定子节点

 * `.innerData` 返回内部 文本节点内容或 CData, 注: 如果没有符合条件的子节点(不包含孙节点)将导致异常

 * `.innerHTML` innerHTML String

```haxe
var xml = Xml.parse('<root>
	<data id="one">1</data>
	<data id="two">2</data>
	<data id="three">3</data>
</root>');

var fast = new Fast(xml.firstElement)
```

#### Proxy

http://old.haxe.org/api/haxe/xml/proxy

似乎是用来做本地化的.示例参考源码注释. 仅能提供智能语法提示访问带有"id"属性(id属性名的第一个字母不能为数字)的 Element. 

至于通过 `.` 符号访问 id 值会返回什么?还得自已加载XML解析然后设置构造函数。

`Proxy<"myxml.xml",T>` 的 "myxml.xml" 需要在 classPath 中,即当前目录或 `-cp` 指定的目录

示例: https://github.com/ncannasse/hxWiki/blob/master/src/Text.hx

```haxe
private class AllTexts extends haxe.xml.Proxy<"myxml.xml",String> {}

class Main{
	static function main(){
		var get = new AllTexts(function(id){return id + id});
		// get.someId 返回什么值完全看上边的构造函数参数
	}
}
```

#### Check

仅提供二个 `static public` 方法, 如果不匹配则抛出错误(似乎找不到这个类适用的地方). 在 haxe.xml 包下的其它奇怪的类也处于这个类的内部.

```haxe
checkNode( x : Xml, r : Rule ):Void			// 

checkDocument( x : Xml, r : Rule ):Void		//
```
关于 Enum Rule 以及更多类型参看 Check.hx 的源码

<br />

### haxelib

[在github中搜索xml的库](https://github.com/search?o=desc&q=xml+language%3Ahaxe&s=stars&type=Repositories&utf8=%E2%9C%93)

 * [tink_xml](https://github.com/haxetink/tink_xml) 通过 metas 将 XML 映射成 typedef 定义的结构.

