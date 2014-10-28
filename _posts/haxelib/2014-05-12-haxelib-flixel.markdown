---

layout: post
title:  flixel
date:   2014-05-12 7:17:21
categories: haxelib

---

[flixel](http://haxeflixel.com/)

> 还没有任何内容!

<!-- more -->

 * FlxBasic

 > active 控制是否 update(),visible 控制是否 draw()

 > alive 只是一个状态属性, exists 表明 是否已经 destroy()

 > 已经 destory()或 kill() 的对象可以调用 revive() 而复原

### 安装

由于有几个包有点大,或者当一些网络不好时,可以直接到 github 上的 release 页面下载,然后以本地安装的形式(`haxelib local xxx.zip`)安装.

```bash
# flixel 附加组件
flixel-addons

# 一些 游戏示例, 
flixel-demos

# flixel 模板文件, 当 flixel-tools 设置之后, flixel create -n Helo 将创建工程模板
# 或者 将 pregenerated 目录下的 FlxProject.fdz 拖动到 flashdevelop IDE 中去.以安装模板.
flixel-templates

# flixel 命令行工具, 第一次可以运行 haxelib run flixel-tools 来创建 flixel.bat
flixel-tools

# 一些简单的 ui 类, 也是在 addons 包目录下
flixel-ui

flixel
```


<br />


### Hello World

需要 `flixel-tools` 和 `flixel-templates`

```bash
flixel create -n HelloWorld
```



<br />