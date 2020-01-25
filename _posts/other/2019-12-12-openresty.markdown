---

layout: post
title:  openresty
date:   2019-12-12 07:27:10
categories: other

---

相关下载,安装可直接 <http://openresty.org/>

个人选择它是因为 luajit 能很容易地调用 c 语言模块, 相于就是一个 c 语言写的服务器

## hello world

这里应该是模板链接

IDE 选择(估计只有 vscode)

<!-- more -->

## 模块

凡是以 lua-作为前缀的模块, 表示能在 lua 中调用

* [lua-nginx-module](https://github.com/openresty/lua-nginx-module)


<br />

## misc

`ngx.say` 相对于 `ngx.print` 会多输出一个 "\n", 相当于 `ngx.println`

