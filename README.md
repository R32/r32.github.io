[blog](http://r32.github.io)
----

### 参考

* [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)

* [variables](https://jekyllrb.com/docs/variables/)

* [github pages jekyll 版本对比](https://pages.github.com/versions/)

* [github 元数据](https://help.github.com/articles/repository-metadata-on-github-pages/)

* jekyll 自带的模板选择 <https://github.com/pages-themes/>

* [github _config.yml](https://help.github.com/en/articles/configuring-jekyll)

### 更新

* 2014-10-4 12:24 : 将 _post目录中的各文件放置到相关目录中去

  这个改动,引起了一项错误. 就 Liquid 提示 以前对应的 post_url 指向了不正确. 因此修正如下:

  ```
  # post_url
  [haxe 中引用 SWC 文件 ]({% post_url haxe/2014-05-10-tips-haxe-flash %})

  # 文章将根据文件头部的 categories 属性来分类, 而文件所在目录, 会影响到 post_url,
  ```

* 2014-10-4 12:24 : 添加 with_toc_data

  ```yml
  markdown: redcarpet

  redcarpet:
    extensions: ["no_intra_emphasis", "fenced_code_blocks", "autolink", "tables", "with_toc_data"]
  ```

* 2014-12-16 12:22: markdown 文件中 [中文Topic](#中文topic) 没有正确跳到锚点

  > 发现 markdown 解析引擎 redcarpet, 会自动把所有英文字符转为小写
  >
  > 空格字符将会被替换成减号 `-`
  >
  > `#### Desc(Note)` 这样的标题将变成为 `<h4 id="Desc-Note">Desc(Note)</h4>`
  >
  > 但是 github 上的页面则为: `<h4><a id="user-content-DescNote" href="DescNote"></a>Desc(Note)</h4>`

* 2015-2-2 更简洁的结构,设计更改, 不需要所有页面都使用 default.layout 这样后期不好维护更改.特别是 主页需要独立出来

  抛弃变量 post.categories[0] 而转而使用 page.dir 来控制目录


* 2015-3-25

  - 将 css3-mediaqueries.js 替换为 Respond.js, 将 html5shiv 与 respond 整合为 lt-ie9 文件

  - 添加  IE10 viewport hack 于 comm.js

  - 尝试修正 ie8　的 strick-footer 的显示问题, 但最后维持不变,因为新的解决方法不适合文档页面

  - 引用公共bootstrap cdn服务器上的 jQuery 和 bootstrap, 在 _config.yml 中添加 use_cdn 变量

  注: 但是 bootstrap.css 照旧,因为 ie8 在处理 html5shiv 或 respond 时 无法处理 cdn 上的文件

* 2016-2-8 由于 github-pages 在 5月时将只支持 `kramdown`, 因此估计要做大量的迁移改动

  - 为了支持 "fenced code blocks" 需要添加:

  ```yml
  kramdown:
  input: GFM
  ```
  - auto_ids: 1)字母将转换为小写 2)空格将转换成"-" 3)...

* 2019-07-26: 移除了 bootstap, jquery, 保持极简模式.

  - [x] ~~TODO:  页面左边的 scrollspy 后续再实现~~

### 主要设计结构

* _layouts
  - home 用于主页
  - default 用于除主页的目录
  - post 用于单独的一篇 markdown

* _includes
  - head 默认的 `<head>` 标签内容
  - header 默认的标题顶栏
  - list-post 用于列出各目录的文章标题摘要
  - footer 页脚

* 几个特殊字符 `『』「」`

### 错误

* 可在乱掉的目录下尝试 windows 命令: `icacls * /T /Q /C /RESET`

  - 如果这个命令没有权限，则右键属性去修改文件夹

* window 复制的文件,或新建文件由于没有 文件权限,当 `jekyll build` 后,无法打开这些没有权限的文件, 当本地测试时

  ```bash
  # 以管理员模式进入 bash, 通过这个命令更改文件权限, 避免本地测试时无法复制。
  chmod -R 755 ./
  ```

### TODOS:

- [x] 由于 github-pages 将在 5月份不再支持 `redcarpet` 而使用 `kramdown` 来处理 markdown 文件,这个估计要改动很多页面

  <https://help.github.com/articles/updating-your-markdown-processor-to-kramdown/>

- [x] 由于 jekyll 升级到了 3.0 因此之前 `{{post_url dir/filename}}` 的语法需要调整为 `{{post_url filename}}` 即移除目录就行了.

### kramdown

这个markdown的语法的解析有一点不太一样需要参考 <http://kramdown.gettalong.org/syntax.html>

<https://github.com/planetjekyll/quickrefs/blob/master/FAQ.md>

[在线编辑器](http://kramdown.herokuapp.com/)

* list 后边接代码块, `*` 符号前边不能有空格, 只能是 2 个空格或 4 个空格, 不能是 tab

* blockquote, `>` 换行后前不可以有空格, 多个符号将 intent(相当于Tab)
  - blockquote后可以接 段落 和 List列表

* TAB 后的文字将会被包装成 `<pre>`, 如果想分开成二个可以加入 EOB 标记, 这个 EOB 标记还真不好理解

  ```markdown
      Here comes some code
  ^
    This one is separate.
  ```


* List 区别, 需要多按 2 个空格比上一级(但好像有时也不起作用.)

  ```markdown
  *   First item

      A second paragraph

      * nested list

      > blockquote

  *   Second item
  ```

* 转义字符 `\` 将输出一些原始字符

* 将链接自动转换, 需要以 https 开头 e.g: `Information can be found on the <http://example.com> homepage.`

* 为 toc 指定 ID 值(不通用)

  ```markdown
  Hello		{#some-hello}

  # Hello		{#first}
  ## Hello ##	{#second}
  ```

* 脚注(似乎并不通用)

  ```markdown
  This is some text.[^1]. Other text.[^footnote].

  * 定义

  [^1]: Some *crazy* footnote definition.

  [^footnote]:
    > Blockquotes can be in a footnote.
  ```
