---

layout: post
title:  使用Github Pages
date:   2014-03-27 11:12:10
categories: other

---

### 未整理 

https://help.github.com/categories/github-pages-basics/

https://github.com/Shopify/liquid/wiki/Liquid-for-Designers

http://jekyllcn.com/

 * 创建一个名为 `user.github.io` 的特殊项目

	> github 将自动通过 `jekyll` 编译 项目中的文件为静态网页
	
	> 从浏览器中访问 user.github.io
	
	> 一个账号只能创建一个名为 `user.github.io`
	
 * 可以创建其它项目名字的网站,如 `Blog`

	> 对于非 `user.github.io` 名字,Github Pages 只解析分支 `gh-pages`中的文件.
	
	> 可以通过添加 `CNAME.txt` 文件来绑定域名.[免费]
		
<!-- more -->

### 安装 

 参考 [Cygwin 环境安装 Jekyll]({% post_url 2014-03-29-jekyll-on-windows-with-cygwin %})


### 插件使用

 Github pages在线[支持的插件](https://pages.github.com/versions/), 可使用 gem 命令检测本机插件版本和 github pages 进行对比

 * [`jekyll-sitemap`](https://github.com/jekyll/jekyll-sitemap) 用于生成 `sitemap.xml` 以优化 SEO

	> 只在要 `_config.yml` 中添加下行就可以了
	```yml
	gems:
	  - jekyll-sitemap
	```


 * ['jekyll-redirect-from'](https://github.com/jekyll/jekyll-redirect-from) 一个类似于 `URL rewrite`, 简单的重定向 

 * [jemoji](https://github.com/jekyll/jemoji) 支持表情字符串, [表情字符清单](http://www.emoji-cheat-sheet.com/)

 * [jekyll-mentions](https://github.com/jekyll/jekyll-mentions) **`@mention`** support for your Jekyll site

### 其它

 * Toc https://github.com/ghiculescu/jekyll-table-of-contents 一个 js 的脚本用于自动生成 table of contents

