---

layout: post
title:  一些有意思东西
date:   2014-9-10 7:15:56
categories: other

---

记录 github 上一些有意思的库, 大多数是从 <https://github.com/trending?since=weekly> 上看到的.

* <https://github.com/sindresorhus/awesome> 这个包括了所有语言，平台，前后端等等的链接收集

<!-- more -->

### code

演示如何将脚本所在目录下的 `jar/yuicompressor.jar` 添加到命令行

```bat
@echo off
java -jar %~dp0jar\yuicompressor.jar %*
```

bash, 确保换行符为 `LF`

```bash
#!/bin/sh
basedir=`dirname "$0"`
case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac
java -jar "$basedir/jar/yuicompressor.jar" "$@"
```

### chrome extension

选择 ungoogled chromium

### Tools

* 内存盘 Radeon RAMDisk

  设置浏览器临时文件夹到内存盘, 例如 :

  `mklink /D "%LOCALAPPDATA%\Chromium\User Data\Default\Cache" R:\TEMP\Chromium`

* Trojan

* [nQuantCpp](https://github.com/mcychan/nQuantCpp) 颜色量化(Color quantization) 转换图片，通过颜色数量比如 256 色，称为

  颜色数量小的图片所占用的空间相对小很多，适合像素类的游戏，
  不过游戏里像素类型的图片转化后也通常不好看，并不是因为这工具的问题

* [minime](https://sourceforge.net/projects/minime-tool/) 最小化隐藏任务栏

* **[jpexs-decompiler](https://github.com/jindrapetrik/jpexs-decompiler)** JPEXS Free Flash Decompiler(flash 反编译工工具, 非常适合提取旧项目的资源不用再装 Flash)

* [free BitTorrent client](https://github.com/transmission/transmission) 免费, 无广告的下载工具.

* [domcomp](https://www.domcomp.com/tld/com) 域名服务商价格对比

* [color.adobe.com](https://color.adobe.com) 配色方案工具， 例如: [CS04 配色方案](https://color.adobe.com/zh/CS04-color-theme-1994456/)

* [cssfontstack](https://www.cssfontstack.com/) 一个网站快速能快速查看各种字体的排版情况

* [google page speed](https://developers.google.com/speed/docs/insights/OptimizeImages)
  - [convert 图片压缩](https://www.imagemagick.org/script/convert.php)
  - [html-minifier](https://github.com/kangax/html-minifier) minify html
  - [cssnano](https://github.com/ben-eb/cssnano) minify css
  - [google closure](https://github.com/google/closure-compiler) minify js

* [pngquant](https://github.com/kornelski/pngquant) Lossy PNG compressor. 有 GUI 版, 可选颜色数量，因此压缩率在某些情况下非常高。

* [nconvert](https://www.xnview.com/en/nconvert/) batch image converter, 有 GUI 版,

* [rsvg-convert](https://github.com/miyako/console-rsvg-convert) svg, 原始图像太大的话，好像不能缩小。

* [把图片解析成几何图形, 随机名字生成](http://samcodes.co.uk/code/)

* [rcedit](https://github.com/electron/rcedit) windows exe/dll 资源修改器

* [chromeless](https://github.com/graphcool/chromeless) 无浏览器, 能更好地代替 PhantomJS, NightmareJS or Selenium

  - [puppeteer](https://github.com/GoogleChrome/puppeteer) 无浏览器, google 官方出品 . [example-thal](https://github.com/emadehsan/thal)

* [sqlyog-community](https://github.com/webyog/sqlyog-community) 不到 4M 的 mysql gui客户端（只是社区版功能有限制）

* [neural-enhance](https://github.com/alexjc/neural-enhance) python3 图片工具

* [fogleman/primitive](https://github.com/fogleman/primitive) go 语言, 输入普通图片生成几何图形, 类似于产生一个滤镜效果的图片, 需要安装 go 语言才能运行的命令行工具, 感觉不太好.

* [procrastitracker](https://github.com/aardappel/procrastitracker) windows 上的一款时间跟踪软件, 跟踪你用计算机都做了些什么

* [letsencrypt](https://letsencrypt.org/) 国外一个公共的免费SSL项目, 如果需要免费的SSL证书

* [c/c++内存泄漏检测](http://wetest.qq.com/cloud/index.php/index/TMM) 腾迅内部开放工具, （情况未知）

* [Go-For-It](https://github.com/mank319/Go-For-It) to-do list

* [apache mod_rewrite online tools](http://htaccess.madewithlove.be/) 在线测试 htaccess 规则

* [github Issue management](http://huboard.com/) github issue 管理

* [Tor网络向导](https://bridges.torproject.org/) 需要方Q

* [lantern](https://github.com/getlantern/lantern) 不解释

* [Captura](https://github.com/MathewSachin/Captura) 录屏

* [ScreenToGif](https://github.com/NickeManarin/ScreenToGif) 录屏到 gif (之前我用的好像就是这个)

* [wink](http://www.debugmode.com/wink/) 录屏到 flash, 能在某些点自动暂停

* [daff](https://github.com/paulfitz/daff) align and compare tables 比较二个表格文件（csv）差异

* [fontello](https://github.com/fontello/fontello) This tool lets you combine icon webfonts for your own project.

* [regexr.com](http://regexr.com/) 正则表达式测试

  > 项目源: <https://github.com/gskinner/regexr/>

* chokidar-cli 监视文件是否发生改动, nodejs 项目

* [gifshot](https://github.com/yahoo/gifshot) 将视频转换成 gif 图片

  > JavaScript library that can create animated GIFs from media streams, videos, or images

* **[patorjk.com](http://www.patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something)**

  > 一个在线工具用于将 文本转换为 Acsii art 的在工具,

* <https://www.captionbot.ai/> 一个非常智能有趣的的在线网页图片识别, 类似于微软的那个颜龄检测

* [web-bundle](https://github.com/haxorplatform/web-bundle) Tool to pack binary files into a PNG image.

  > 把多个文件打包成图片格式, 然后可以解析这个图片获得文件,图片不受跨域加载的影响,同时减少 http 请求的数据量.

* [img2xls](https://github.com/Dobiasd/img2xls) Convert images to colored cells in an Excel table. -python

* [webify](https://github.com/ananthakumaran/webify) 转换 ttf 到 woff, eot 和 svg

  ```css
  @font-face {
  font-family: 'my-font-family';
  src: url('my-font-filename.eot');
  src: url('my-font-filename.eot?#iefix') format('embedded-opentype'),
  url('my-font-filename.svg#my-font-family') format('svg'),
  url('my-font-filename.woff') format('woff'),
  url('my-font-filename.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  }
  ```
* [IE8~IE11虚拟机调试下载-需要虚拟机客户端](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/windows/)

* Socket 调试工具
  - tcpdump
  - ngrep
  - Microsoft Network Monitor
  - Microsoft Research TCP Analyzer
  - [sokit](https://github.com/sinpolib/sokit/releases) 模拟客户或服务器端,但是无法自定义连接协议而只能使用原始Socket

* [elasticsearch](https://github.com/proletariatgames/hxnodejs-elasticsearch) 基于Lucene的搜索服务器,这是 nodejs, haxe extern 版的

### web

[Press+Start+2P](https://fonts.google.com/specimen/Press+Start+2P?selection.family=Press+Start+2P) a bitmap font based on the font design from 1980s Namco arcade games. It works best at sizes of 8px, 16px and other multiples of 8

[NES.css](https://github.com/nostalgic-css/NES.css) 浏览器支持: chrome, firefox, Safari

[design-blocks](https://github.com/froala/design-blocks) A set of 170+ Bootstrap based design blocks(170+ 基于 bootstrap 的设计片段)

[ie8 css filter](http://www.ssi-developer.net/css/visual-filters.shtml)

  > [关于IE中CSS-filter滤镜小知识](https://www.qianduan.net/guan-yu-ie-zhong-css-filter-lv-jing-xiao-zhi-shi/)
  >
  > [IE8 CSS 和 HTML支持...](https://msdn.microsoft.com/library/cc817571.aspx)
  >
  > [IE JS 版本信息](https://msdn.microsoft.com/zh-cn/library/s4esdbwz(v=vs.94).aspx)

[awesome-javascript - 中文](https://github.com/rwson/awesome-javascript-cn)**

[Frontend stuff](https://github.com/moklick/frontend-stuff) 前端资源

[design-essentials](https://github.com/showcases/design-essentials)

这个章节的大多数内容都是用于美化的 CSS 或 Javascript , 大多数似乎在 ie8 中都会报错.

* [golden-layout](https://github.com/deepstreamIO/golden-layout) Works in IE8+, Firefox, Chrome, Web app布局

* [gameicons-font](https://github.com/seiyria/gameicons-font) An icon font for game-icons/icons.

* <https://github.com/knsv/mermaid> 使用类似于 markdown 的语法来画流程图

* <https://github.com/jeff-optimizely/Guiders-JS> 弹出层向导, 兼容性未知

* <http://w3layouts.com/> **NOTE** 网页布局模板

* <http://www.iwan0.com/> 一个前端资源的网站导航, 中文

* <https://github.com/jmosbech/StickyTableHeaders> 固定 table 的 表头元素, 使用了Jquery

  > 原理在在原表格上复制建立一个浮动的 th 元素监听window的scroll及resize 事件

* [链接(菜单项)特效](http://tympanus.net/Development/CreativeLinkEffects/)

* [腾迅原型设计 UIDesigner](http://idesign.qq.com/#!index/feed/id/0)

* [clipboard](https://github.com/zenorocha/clipboard.js) 网页,依赖 falsh 和其它任何库.chrome 42,firefox 41, ie9,opera29,

* [animate.css](https://github.com/daneden/animate.css) css 动画库

* [glfx](https://github.com/evanw/glfx.js) An image effects library for JavaScript using WebGL

* [Google Fonts](https://github.com/google/fonts) Font files available from Google Fonts

  - You can download all Google Fonts in a simple ZIP snapshot (over 250Mb)

* [Google icons](https://github.com/google/material-design-icons) Material Design icons by Google

* [angular-schema-form](https://github.com/Textalk/angular-schema-form) JSON 生成表单HTML元素

* [underscore](https://github.com/jashkenas/underscore) 一个工具库,跨浏览器, [中文文档](http://javascript.ruanyifeng.com/library/underscore.html#)

* [spectrum](https://github.com/bgrins/spectrum) The No Hassle JavaScript Colorpicker, 颜色选择器,**兼容IE6+**

* [turorial of what i do not understand](https://github.com/danistefanovic/build-your-own-x)

* [braintree](https://github.com/braintree/braintree-web) 表单加密

* [buzz](https://github.com/jaysalvat/buzz) html5 声音播放

* [waud](https://github.com/adireddy/waud) html5 声音播放, hx 源码支持各种格式

* [impress](https://github.com/bartaz/impress.js/) 展示用 JS.

* [dynamics.js](https://github.com/michaelvillar/dynamics.js) 动画库

* [responsive-html-email-template](https://github.com/charlesmudy/responsive-html-email-template)  邮件模板,如果你想发广告的话.

* [google material-design-lite](https://github.com/google/material-design-lite) CSS 前端设计

* [Primer](https://github.com/primer/primer) Github 官方的 CSS 前端设计, 感觉 Component 很少,

  - 几个颜色值 http://primercss.io/colors/

  - bootstrap 颜色值 http://www.runoob.com/bootstrap/bootstrap-v2-less.html

* **[holder](https://github.com/imsky/holder)** 生成图像占位符

* [KaTeX](https://github.com/Khan/KaTeX) 用于在网页中展示数学公式.

* **[startbootstrap](https://github.com/IronSummitMedia/startbootstrap)**  Bootstrap themes and templates

* [modernizr](https://github.com/Modernizr/Modernizr) 检测浏览器的 html5 和 css3 支持情况

* [html5 boilerplate](https://github.com/h5bp/html5-boilerplate) 一套专业的前端模版,用以开发快速、健壮、适应性强的app或网站

* **[intro.js](https://github.com/usablica/intro.js)**

  > A better way for new feature introduction and step-by-step users guide for your website and project.
  >
  > http://usablica.github.com/intro.js/ 可以用来做向导的, ie8 测试没问题,

* [Metro-UI-CSS](https://github.com/olton/Metro-UI-CSS) win8 扁平化风格 CSS框架

* [bootstrap-material-design](https://github.com/FezVrasta/bootstrap-material-design) Bootstrap theme

* [metro-bootstrap](https://github.com/TalksLab/metro-bootstrap)

  > Simple bootstrap from Twitter with Metro style. http://talkslab.github.io/metro-bootstrap

* [Semantic-UI](https://github.com/Semantic-Org/Semantic-UI) CSS 框架,IE10, 不支持低版本浏览器, 因此适合做 app 类

* [bulma](https://github.com/jgthms/bulma) 基于 flexbox 的轻量级 css 框架,才 120K 大小, 不提供 js 组件

* [sensei-grid](https://github.com/datazenit/sensei-grid) 展现表格内容, 不支持 IE8

* [sweetalert](https://github.com/t4t5/sweetalert)

  > A beautiful replacement for JavaScript's "alert" 演示示例: <http://tristanedwards.me/sweetalert>,

* [midnight](https://github.com/Aerolab/midnight.js)

  > A jQuery plugin that switches between multiple header designs as you scroll, so you always have a header that looks great with the content below it. http://aerolab.github.io/midnight.js/ 用这个脚本做来 主页不错. 标记: IE8 中出错

* [swiper](http://www.swiper.com.cn/) 滑动库,Carousel,主要针对移动端

* <http://ink.sapo.pt/>  HTML5/CSS3 framework 快速布置

* <https://github.com/hgoebl/mobile-detect.js> 设备检测

### article

* [The Linux Kernel](https://www.kernel.org/doc/)

* [SAL Annotations](https://msdn.microsoft.com/zh-cn/library/ms182032(v=vs.140).aspx) c 语言代码标注，使之更易于理解

  通过 VS 的 `ANALYZE -> Run Code Analysis On Sulotion(Alt + F11)` 可检测出不安全的代码。

  > 但是只有 MSVC 才支持这个, GCC 支持另一种叫做 [Attribute](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html) 的东西,

* [detours](https://github.com/microsoft/detours)

  > 1. 通过制做一个 dll 文件用于注射
  >
  > 2. 通过 `DetourCreateProcessWithDllEx` 注射到指定进程, 参考 sample 中的 withdll.exe
  > withdll.exe 以加载一个用于注射的 dll 然后启动指定程序的方式来注入。
  >
  > sample 下很多给力的工具类

* [B站视频 线性代数的本质](http://www.bilibili.com/video/av6731067/index_4.html) 描述了矩阵乘法为什么要那样计算?

* [nginx 源码分析中文](https://github.com/y123456yz/reading-code-of-nginx-1.9.2)

* [thebookofshaders](https://github.com/patriciogonzalezvivo/thebookofshaders/blob/master/README-ch.md) 选择 zh 后缀的 md 文件阅读

* 使用 word 打印类似于请柬之类的东西, 其实只要用 word 写邮件就可以了, 以下以 word 2007 为示例:

  - `邮件 -> 开始邮件合并 -> 邮件合并分步向导` 之后按着提示即可完成
  - 使用 `插入 -> 文本框...` 来输入每个文本块 可以定义为竖排文字

* [stackoverflow online-webgl-glsl-shader-editor](http://stackoverflow.com/questions/13624124/online-webgl-glsl-shader-editor)

* [game lists](https://github.com/leereilly/games) A list of popular/awesome videos games, add-ons, maps, etc. hosted on GitHub. Any genre. Any platform. Any engine

* [game-off-2016](https://github.com/github/game-off-2016) 看上去有点类似于 LD 游戏大赛

* [值得推荐的C/C++框架和库(转)](http://www.cnblogs.com/kernel0815/p/4624101.html)

* [国内一些开源项目](https://www.zhihu.com/question/29692173)

* [ZeroMQ 中文](https://github.com/anjuke/zguide-cn) 一套用于快速构建的套接字组件

* [15分钟快速入门各种语言](https://github.com/adambard/learnxinyminutes-docs)

  - <https://learnxinyminutes.com>

* [cmake 中文PDF](http://sewm.pku.edu.cn/src/paradise/reference/CMake%20Practice.pdf)
  - <https://cmake.org/Wiki/CMake_Useful_Variables> 内容有些多，未来估计得单独写个 cmake 的日志
  - [cmake 预编译头文件 stackoverflow](http://stackoverflow.com/questions/148570/using-pre-compiled-headers-with-cmake)

  ```
  CMAKE_SOURCE_DIR: 指的顶层 CMakeLists.txt 所在目录
  CMAKE_BINARY_DIR: 指的运行 cmake 的当前目录， 如果和 CMAKE_SOURCE_DIR 相等则是所谓的 in source,
  因此你应该在另一个临时目录中调用 cmake [options] path/to/CMAKE_SOURCE_DIR

  # 假设顶层配置文件有 add_subdirectory(sub), 而 sub 中的 CMakeLists.txt 有如下
  CMAKE_CURRENT_SOURCE_DIR: ${CMAKE_SOURCE_DIR}/sub
  CMAKE_CURRENT_BINARY_DIR: ${CMAKE_BINARY_DIR}/sub

  # 其它
  EXECUTABLE_OUTPUT_PATH: 最终执行文件(release/debug)的所在目录,可通过 SET 更改
  LIBRARY_OUTPUT_PATH: 最终库文件(release/debug)的所在目录, 可通过 SET 更改
  ```

* [the-art-of-command-line](https://github.com/jlevy/the-art-of-command-line) 正确使用命令行

* [CSS 描述](http://www.css88.com/book/css/) 主要是包含有详细的浏览器兼容性

* [w3school html5](http://www.w3school.com.cn/html5/index.asp)

* **[CSS 各项属性](http://www.runoob.com/cssref/pr-tab-caption-side.html)**

  <http://www.runoob.com/> 除了 CSS, 这个网站的各种学习资源非常全

* [如何调试Chrome的Proxy](http://www.chromium.org/developers/design-documents/network-stack/debugging-net-proxy)

* 大前端的瑞士军刀: <https://github.com/nieweidong/fetool>

  > [一些帮助开发的 chrome 插件](http://www.cnblogs.com/cench/p/5565389.html)

* [微信小程序开发资源汇总](https://github.com/justjavac/awesome-wechat-weapp)

* [编程各种算法-中文](https://github.com/julycoding/The-Art-Of-Programming-By-July/tree/master/ebook/zh)

* [Tools_for_SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Tools_for_SVG) SVG 相关工具.

* [vscode-tips-and-tricks](https://github.com/Microsoft/vscode-tips-and-tricks)

### resource

* [Google Material icons](https://github.com/google/material-design-icons)

* [typicons.font](https://github.com/stephenhutchings/typicons.font) 336 pixel perfect, 图标, 有 png 格式和字体。

* [awesome-design](https://github.com/gztchan/awesome-design)

* [Segoe MDL2 Assets](http://modernicons.io/segoe-mdl2/cheatsheet/) 一张 iconfont 表格, 微软 Win10 专用图标, 字体有版权, 只能用在 win10 开发上。

  - 所有 [png32x32 图标](https://docs.microsoft.com/zh-cn/windows/uwp/design/style/segoe-ui-symbol-font)

  - [UWP 组件](https://docs.microsoft.com/zh-cn/windows/uwp/design/controls-and-patterns/index) 用来参考一下其设计也不错。

* [图标下载](http://www.easyicon.net/)

* [Video Game Music](https://downloads.khinsider.com/game-soundtracks) 一些动漫或游戏的游戏原生音乐

### misc

* [emoji-list](https://github.com/caiyongji/emoji-list) github 表情清单, 那有那个 "中文" 的图标蛮有意思的.

* [Webqq 机器人](https://github.com/sjdy521/Mojo-Webqq)

* [minimatch](https://github.com/isaacs/minimatch) a glob matcher in javascript 正则表达式如像 dos下的 `*.txt` 通配符

* [phantomjs](https://github.com/ariya/phantomjs) 没有界面的浏览器,适用于做爬虫

* [js1k.com](http://js1k.com/2016-elemental/demo/2515) 好多 js 1k 的示例..

### CLib

[C标准头文件](http://stackoverflow.com/questions/2027991/list-of-standard-header-files-in-c-and-c)

[awesome-c](https://github.com/kozross/awesome-c)

* [picohttpparser](https://github.com/h2o/picohttpparser) HTTP 工具库

* [rizz](https://github.com/septag/rizz) Small C game development framework

* [mimalloc](https://github.com/microsoft/mimalloc) 用于覆盖 malloc, 支持 *first-class heaps*

* [rpmalloc](https://github.com/mjansson/rpmalloc) 同上, 但源码只有 3 个文件

* [vcpkg](https://github.com/Microsoft/vcpkg) C++ Library Manager for Windows, Linux, and MacOS

* [civetweb](https://github.com/civetweb/civetweb) Embedded C/C++ web server

* [incbin](https://github.com/graphitemaster/incbin) 简单地在 c 语言中嵌入资源, 兼容所有编译器

  这个工具库对于 msvc 似乎不可用，对于 cygwin 也一样。

* [cpu_features](https://github.com/google/cpu_features) A cross platform gnu89 library to get cpu features at runtime.

* [libu](https://github.com/koanlogic/libu) LibU is a multiplatform utility library written in C, with APIs for handling memory allocation, networking and URI parsing, string manipulation, debugging, and logging in a very compact way, plus many other miscellaneous tasks

* [raylib](https://github.com/raysan5/raylib) 基于 c99 语法的 opengl ui 库,

* [nuklear](https://github.com/vurtun/nuklear) A small ANSI C gui toolkit

* [libs](https://github.com/mattiasgustavsson/libs) Single-file public domain libraries for C/C++ (dual licensed under MIT)

* [imgui](https://github.com/ocornut/imgui) c++ 的一个 GUI库,挺有意思的

* [stb](https://github.com/nothings/stb) stb single-file public domain libraries for C/C++

* [clibs](https://github.com/clibs) 有各种库

* [s2n](https://github.com/awslabs/s2n) an implementation of the TLS/SSL protocols

* [libuv](https://github.com/libuv/libuv) Cross-platform asychronous I/O  <http://libuv.org/>

* [libcork](http://libcork.readthedocs.io/en/0.14.0/) cross-platform C library

* [foundation_lib](https://github.com/rampantpixels/foundation_lib) Cross-platform public domain foundation library in C

### Notes

* 虚拟键盘模拟:

  ```bash
  winio.dll      # 有说需要插真实 PS 键盘才有会有效.
  ```

* [逆向资源 List of awesome reverse engineering resources](https://github.com/wtsxDev/reverse-engineering):

  ```
  IDA            # 有 7.0 的 free 版本, 偏向于静态
  ollydbg        # free, 偏向于动态
  Cheat Engine   #

  ghidra         # 听说开源类似于 IDA
  r2ghidra-dec   # 同上
  ```

#### ollydbg

`Ctrl+G`: Go to address or value of expression 用于跟随某个公开的API函数, 例如: `CreateFileW`

对于 command line 比较常用的是:

* `2+2` - calculate value of this expression;
* `AT [EAX+10]` - disassemble at address that is the contents of memory doubleword at address EAX+0x10;
* `BP KERNEL32.GetProcAddress` - set breakpoint on API function. Note that you can set breakpoint in system DLL only in NT-based operating systems;
* `BPX GetProcAddress` - set breakpoint on every call to external function GetProcAddress in the currently selected module;
* `BP 412010,EAX==WM_CLOSE` - set conditional breakpoint at address 0x412010. Program pauses when EAX is equal to WM_CLOSE.

插件集合:

<https://github.com/romanzaikin/OllyDbg-v1.10-With-Best-Plugins-And-Immunity-Debugger-theme->

<https://github.com/JackAston/OllyDbg1plugins>


<br />
