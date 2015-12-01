[blog](http://r32.github.io)
----

Liquid 模板语法参见  https://github.com/Shopify/liquid/wiki/Liquid-for-Designers

 * [github pages jekyll 版本对比](https://pages.github.com/versions/)
 
 
 * 2014-10-4 12:24 : 将 _post目录中的各文件放置到相关目录中去

	> 这个改动,引起了一项错误. 就 Liquid 提示 以前对应的 post_url 指向了不正确. 因此修正如下:

	```
	# 报错的 post_url
	[haxe 中引用 SWC 文件 ]({% post_url 2014-05-10-tips-haxe-flash %})
	
	# 添加其所在目录名 前缀,修正
	[haxe 中引用 SWC 文件 ]({% post_url haxe/2014-05-10-tips-haxe-flash %})

	```

	> 实际上 文章是根据 文件头部的 categories 属性来分类, 对于文件所在目录,目前我只知道只会影响到 post_url,

	> 所以 为了让 _post 看起来更整洁, 可以随意将 文件 放置到不同目录, 

 * 2014-10-4 12:24 : 添加 with_toc_data

	```yml
	markdown: redcarpet

	redcarpet:
	  extensions: ["no_intra_emphasis", "fenced_code_blocks", "autolink", "tables", "with_toc_data"]
	```

 * 2014-12-16 12:22: markdown 文件中 [中文Topic](#中文topic) 没有正确跳到锚点

	> 发现 markdown 解析引擎 redcarpet, 会自动把所有英文字符转为小写

	> 空格字符将会被替换成减号 `-`
	
	> `#### Desc(Note)` 这样的标题将变成为 `<h4 id="Desc-Note">Desc(Note)</h4>`
	
	> 但是 github 上的页面则为: `<h4><a id="user-content-DescNote" href="DescNote"></a>Desc(Note)</h4>`
	
 * 2015-2-2 更简洁的结构,设计更改, 不需要所有页面都使用 default.layout 这样后期不好维护更改.特别是 主页需要独立出来

	> 抛弃变量 post.categories[0] 而转而使用 page.dir 来控制目录


 * 2015-3-25

  - 将 css3-mediaqueries.js 替换为 Respond.js, 将 html5shiv 与 respond 整合为 lt-ie9 文件

  - 添加  IE10 viewport hack 于 comm.js

  - 尝试修正 ie8　的 strick-footer 的显示问题, 但最后维持不变,因为新的解决方法不适合文档页面

  - 引用公共bootstrap cdn服务器上的 jQuery 和 bootstrap, 在 _config.yml 中添加 use_cdn 变量

		> 注: 但是 bootstrap.css 照旧,因为 ie8 在处理 html5shiv 或 respond 时 无法处理 cdn 上的文件



#### 需要做的

 * 需要一个 haxe 生成的 html5 简单动画放在 主页 上.

 * 找到合适的 **个人** 模板, 

 * 一些颜色值

	```bash
	blue:	#4183c4
	green:	#6cc644
	red:	#bd2c00
	orange:	#f93
	purple:	#6e5494

	gray-light:	#999
	gray:		#666
	gray-dark:	#333
	```

颜色值来自 http://primercss.io/colors/

#### 主要设计结构

 * _layouts

  - home 用于主页

  - default 用于除主页的目录

  - post 用于单独的一篇 markdown

 * _includes

  - head 默认的 `<head>` 标签内容

  - header 默认的标题顶栏

  - insert-swf 用于插入 swf

  - list-post 用于列出各目录的文章标题摘要

  - footer 页脚

 * 已经被移除的一些代码,但是用来当作参考

	```
	{% assign p_categories = page.url | replace: "\", "/" | split:"/" %}
	{% if p_categories[1] == 'index.html' %}
		{% assign p_category = 'home' %}
	{% else %}
		{% assign p_category = p_categories[1] %}
	{% endif %}
	```


#### 错误

 * window 复制的文件,或新建文件由于没有 文件权限,当 `jekyll build` 后,无法打开这些没有权限的文件, 当本地测试时

	```bash
	# 通过这个命令将所有文件权限,避免本地测试时
	chmod -R 755 ./
	```
