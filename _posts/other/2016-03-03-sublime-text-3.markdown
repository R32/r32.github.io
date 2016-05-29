---

layout: post
title:  sublime text 3
date:   2016-03-03 07:31:26
categories: other

---

* 下载 <https://www.sublimetext.com/3>， 购买的价格是 $70美金
* 如果要自定义新的语言语法可以参考[packages 包的代码](https://github.com/sublimehq/Packages) ,其实安装包下也可以直接打开
* 这篇记录只针对新最版的 Build 3103(2016-02-09)， 未来一些 .tmPreferences 也可能会通过使用 YAML 来定义,而非 XML
* 由于非常小巧和快速,但智能提示这块可能远没有专一的IDE更好, 但自定义功能 **非常** 强大
* [sublime 的各种文档, 但一些文档已经是过时的了](https://github.com/guillermooo/sublime-undocs/tree/sublime-text-3/source/reference)

<!-- more -->

### sublime-settings

一些个人常用设置

```json
  "ignored_packages":     // 快速忽略掉不要的插件
    [
      "Vintage"
    ],
  "trim_trailing_white_space_on_save": true  // 清除只有空行的空格,使代码更整洁
```
### sublime-syntax

[新语法定义...](http://www.sublimetext.com/docs/3/syntax.html),旧的语法实在不可读

建议参考 packages 源码

* XXXXX.sublime-syntax 语言在定义时, 可以按下 `ctrl+shift+alt+p` 这时底部的 status 栏会显示当前上下文件环境
  - 注意: 如果没有正确定义, 可能会导致IDE 大中小括号的匹配不正确, 会让人误以为是 IDE 的错误
  - 在写新的高亮定义时,需要考虑 哪里匹配可用于全局,或仅在某些特殊上下文
  - 颜色的定义: 可以查看ST3安装包下的 Color Scheme Default.sublime-package 文件, 或通过检测 scope 快捷键
* Comments.tmPreferences 定义注释的方式比如 html 和 js 都有不同的注释语法, 如果缺少, 那么注释的快捷键将不可用
* Indent.tmPreferences 用于定义正确的缩进
* 各种 XXX Symbols.tmPreferences 文件用于定义标识符, 当你按下 F12 跳转到定义处的功能时
* Regular Expressions(XXX).sublime-syntax 定义了正则表达式, (使用正则定义正则, 感觉非常奇怪)
* Completion Rules.tmPreferences XML文件描述自动补齐, 不过感觉非常不成熟, 至少没有达到我想要的
  - 你可能需要设置 auto_complete_triggers 自动补齐的触发条件, 比如是 "." 还是html文件的 "<" 符号

  > 感觉还非常不成熟, 仅适合定义顶层的关键字或全局的东西, 因为多种 scope 混在了一起,
  > 因为没法定义 INHIBIT_WORD_COMPLETIONS(排除收集文档的词) 和 INHIBIT_EXPLICIT_COMPLETIONS(排除从Completion定义的自动补齐)
  >
  > 因此你可以在 gist 上搜一下 on_query_completions 的 python 文件
  >
  > <https://forum.sublimetext.com/t/python-completions-and-help/4945/11>

* 按 `ctrl+`` 可以打开IDE的控制台观各插件的加载情况, 在调试 py 插件时非常有用

#### 插件打包

空

### sublime-build

使用 JSON 文件来配置构建， example:

```json
{
    "cmd": ["python", "-u", "$file"],
    "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
    "selector": "source.python"
}
```

[详细的在这里...](https://github.com/guillermooo/sublime-undocs/tree/sublime-text-3/source/reference/build_systems)

### project

 * [`.sublime-build`](https://github.com/guillermooo/sublime-undocs/blob/sublime-text-3/source/reference/build_systems/configuration.rst) 构建系统, 但好像只有一个命令可用,不适合那些先编译再链接的, variants 还要自已一个一个选择

 * .sublime-project, 通过 `Project -> Save Project as`, 应该保存于单独的目录下, 因它还会生一些缓存文件和 .sublime-workspace

### 其它

提交插件到 package control <https://packagecontrol.io/docs/submitting_a_package>

* 鼓励改善现有的包而不是重造轮子
* 名称不得包含有或者与 "sublime" 相似  , 以及:
  - 驼峰式,可以使用空格
  - [A-Za-z][A-Za-z0-9 ]+
* 使用 github/BitBucket托管。 (因为另一个可选择的自行托管太麻烦,需要 SSL)
* 通过在 github 上创建 tag 用于表示更新, 标签名称必须是 major.minor.patch, 例: 1.0.0
  - 基于 fork 的更新控制已经被弃用..
* 检查repo:
  - 删除 所有 .pyc 文件.
  - 删除 package-metadata.json
  - 检查文件名, 它应该符合 windows 的文件/目录名称
  - 如果包括可执行文件或共享库, 需要添加 .no-sublime-package 文件于仓库根目录
* 将 repo 提交到 Defalt Channel 检测
  - fork [Package Control Channel](https://github.com/wbond/package_control_channel), 并 clone 至本地
  - 使用 sublime 进入目录, 添加 package info 在 repository 目录下选相对应的文件

  ```json
  {
    "name": "neko nml",
    "details": "https://github.com/wbond/sublime_alignment",
	"labels": ["nekoml", "nml", "nekovm"]
    "releases": [
      {
        "sublime_text": ">=3103",
        "tags": true
      }
    ]
   }
  ```

  - 在 sublime 上安装 ChannelRepositoryTools 插件执行测试
  - Pull Request

Tips: 你可以在 pull Request 列表里看别人修改提交了些什么类容.

#### python

* 对于python插件的编写 st3 的安装目录下有 sublime.py 和 sublime_plug.py 这二个文件要以查看
* 这有个对 python 全局方法的提智能提示的 <https://gist.github.com/agibsonsw/2039907>, 因此不必配置 python 环境了

> sublime text 3 + anaconda插件 + python 34, 这些设置都可以全部放一起, 如 user 设置下避免太多的设置文件

> * [anaconda插件设置](http://www.jingyan8.cc/youxishuma/61939fek.html)


```json
{
  "python_interpreter": "D:\\Program Files\\Python35-32\\python.exe",
  "anaconda_linting": false  // 关掉方框
}
```
<br />
