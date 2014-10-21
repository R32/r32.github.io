---
layout: post
title:  Cygwin 环境安装 Jekyll
date:   2014-03-29 19:21:10
categories: other
---

本文档源文件来自: [nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html](http://nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html)


#### 简介

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Jekyll] 是一个静态网站构建工具可以用来创建各类网站比如像这个博客 (这个站就是用Jekyll生成的).但是不太支持 windows 环境的安装.刚好我以前用 flash alchemy 时安装了 Cygwin 环境. 下面的说明假定您已经安装了Cygwin.


**最新版 `jekyll` 安装比之前简单多了**


<!-- more -->

#### 安装 Jekyll

 1. 运行 Cygwin `setup.exe`. 本人 win7x64 装的 32位版本.
	![setup cygwin](/assets/img/cygwin-setup.png) 

 2. 选择这些包 `ruby` ,`crypt` ,`zip`,`python (select the **2.x** package, **not python3**!)`  

	```bash
	Ruby/ruby: Interperted object-oriented script......
	Archive/zip: Info-ZIP compression utility.
	Libs/crypt: Encryption/Decrypion utility and library
	Python/python: Python language interpreter. 
	```

 3. 可选安装.一些我在装`jekyll` 之前就已经装好了包.不太清楚其中一些是否为 `jelyll` 必须安装的

	```bash
	# 下边清单再加上 zip 包 就是 flash alchemy 所需的环境
	Devel/make: The GNU version of the 'make' utility
	Devel/gcc-g++: GNU  Compiler Collection(C++)
	Perl/perl: Larry Wall's Practical Extracting and Report Language.
	```
 
 4. 可选安装. 把`cygwin bash` 到添加右键菜单

	1. 在 `setup` 安装包中,选上 `Shells/chere : Cygwin Prompt Here context menus`
	 
	2. 安装完成之后. `cygwin bash` 下输入 `chere -i`. win7 需要以管理员模式运行
	
	3. 右键就能找到 `bash prompt here` 的菜单.
	
	4. `chere -u` 将移除右键菜单. 参看 `chere --help`

 5. ~~ `gem install jekyll`~~ `gem install github-pages` 就可以完成安装.	

	> 如运行 gem install 时弹出 UTF之类的错误, 可以把 dos 窗口编码改成 英文.
	> 左上角图标 -> 默认值 -> 默认代码页, 然后重新打开 

 6. 测试
 
	```bash
	jekyll --help
	
	jekyll new test
	```

<hr class="gh" />


#### 常见错误

很可能你会遇到下边问题:


```bash
Liquid Exception: No such file or directory
	- C:\Windows\system32\cmd.exe in _posts/2013-12-22-my-post.markdown
```

解决方法: 在 `cygwin` 根目录中 `etc`下 找到 `bash.bashrc`文件或其它 `somename.bashrc`,并添加下行:

```bash
export COMSPEC=/cygdrive/c/Windows/System32/cmd.exe
```

同样还会遇到的:

```bash
Generating... which: no python2 in (/usr/local/bin:/usr/bin:...
```

修正这个问题只需要建立一个 `ln`.在 `cygwin bash` 中输入下边:

```bash
ln -s /usr/bin/python /usr/local/bin/python2
```


jekyll: command not found, 需要添加路径 `export PATH=$HOME/bin:$PATH`



<br />

[Jekyll]:http://jekyllrb.com/