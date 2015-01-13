[blog](http://r32.github.io)
----

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
#### 需要做的

 * 需要一个 haxe 生成的 html5 简单动画放在 主页 上.

 * 找到合适的 **个人** 模板, 

#### 错误

~~目前在 Cygwin 下安装 jemoji 时出错.~~




