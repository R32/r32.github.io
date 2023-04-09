---
layout: post
title:  使用Github Pages
date:   2014-03-27 11:12:10
categories: other
---

对于个人, 创建一个名为 `USERNAME.github.io` 的特殊项目即可

> github 将自动通过 `jekyll` 编译 项目中的文件为静态网页
>
> 一个账号只能创建一个名为 `USERNAME.github.io` 的项目

对于某个项目, 从项目的 *Setting* 进入, 下拉到 *GitHub Pages*, 然后从下拉菜单中选 `master branch/docs folder`

> 这时将启用 docs 目录将为文档的根目录, 这是最简单的方式

<!-- more -->

### 安装

这里只介绍如何在 Windows 中安装 github-pages, 其源文档主要来自: [nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html](http://nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html)

#### Cygwin 环境配置

**更新**: 由于 cygwin 无法安装 `gem install eventmachine`, 因此只能装 `gem install jekyll -v 3.6` 和 `jekyll-sitemap -v 1.2`

1. 运行 Cygwin `setup.exe`.
	![setup cygwin](/assets/img/cygwin-setup.png)

2. 选择这些包 `ruby` ,`crypt` ,`zip`,`python (select the **2.x** package, **not python3**!)`

  ```bash
  Ruby/ruby: Interperted object-oriented script......
  Ruby/ruby-devel: Interperted object-oriented script......
  Ruby/rubygems: Ruby module management system
  Ruby/ruby-nokogiri: Ruby HTML/XML/SAX library             # 由于cygwin下无法通过编译这个库 1.6.6.2
  Libs/libffi: Portable foreign function interface library  # 用于编译 ffi 接口
  Archive/zip: Info-ZIP compression utility.
  Libs/crypt: Encryption/Decrypion utility and library
  Python/python: Python language interpreter.
  ```

3. 可选安装.一些我在装`jekyll` 之前就已经装好了包.不太清楚其中一些是否为 `jelyll` 必须安装的

  ```bash
  # 下边清单再加上 zip 包 就是 flash alchemy 所需的环境
  Devel/make: The GNU version of the 'make' utility
  Devel/gcc-g++: GNU  Compiler Collection(C++)
  Perl/perl: Perl programming language interpreter
  ```

4. 可选安装. 把`cygwin bash` 到添加右键菜单

  1. 在 `setup` 安装包中,选上 `Shells/chere : Cygwin Prompt Here context menus`

  2. 安装完成之后. `cygwin bash` 下输入 `chere -i`. win7 需要以管理员模式运行

  3. 右键就能找到 `bash prompt here` 的菜单.

  4. `chere -u` 将移除右键菜单. 参看 `chere --help`

5. `gem install github-pages` 就可以完成安装.

  > 如运行 gem install 时弹出 UTF之类的错误, 可以把 dos 窗口编码改成 英文.
  > 左上角图标 -> 默认值 -> 默认代码页, 然后重新打开.

  ```bash
  # 如果被墙, 添加淘宝镜像 gem sources, 请确保只有 ruby.taobao.org
  $ gem sources --remove https://rubygems.org/
  $ gem sources -a https://ruby.taobao.org/
  $ gem sources -l
  *** CURRENT SOURCES ***
  https://ruby.taobao.org
  # 如果在编译时缺少某些库, 如最近重装时提示错误:  cannot find -lgmp
  # 那么运行 cygwin-setup.exe, 将相应的如 gmp-devel 选上,因为编译时需要 devel 后缀的库
  ```

6. 测试

  ```bash
  jekyll --help
  jekyll new test
  ```

<hr class="gh" />


### 常见错误

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


[Jekyll]:http://jekyllrb.com/


### misc

如果直接通过命令行调用 bash 时, 如果没有添加 `-l|--login` 那么进入 bash 时的一些配置文件也不会加载,
并且将丢失 cygwin 自动配置的路径或库，而大多数 IDE  都通过 Process 来调用 bash 的, 因此经常会导致找不到文件的错误提示

1. 设置系统环境变量 `CHERE_INVOKING=1`, 这个需要 cygwin 的 chere 插件支持

2. 或者在进去 Process 前, 如果有相关 API, 也可以设置上述的环境变量

3. 或者如果你从 DOS 中进去的话

  ```bash
  set CHERE_INVOKING=1
  \path\to\bash.exe -l -c command
  ```

  之后直接调用命令即可, 例: `bash -l -c "pwd"`


* 清屏, 虽然按 `ctrl+L` 看上去不错，但这只是把滚动条拉下来而已, 因此一些版本可以输入: `cmd /c cls`

* makefile 中检测 win 系统, 但无法区分是在 DOS 还是 BASH 下,

  - 目前没有办法检测 DOS/BASH 和 bash -login， 因此不要在 makefile 中使用 `$(shell find)` 就可以

  ```makefile
  # ifeq ($(OS),Windows_NT), 全返回 Windows_NT,

  # OSTYPE 不属于环境变量, 只是bash的临时变量, 但无法引用

  # 这个同样不会有正确的结果, DOS 和 bash 以及 bash -login 下全返回 "cygwin"
  SYS   := $(shell echo $${OSTYPE})
  ```

  一个检测平台的 makefile 示例: <https://github.com/WaterJuice/CryptLib>

<br />
