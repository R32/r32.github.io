### nodejs 分页
- - - - -

 * jekyll 不支持 分类 分页,打算以 nodejs 来生成一个 json 文件,然后以ajax的方式加载分页菜单.虽然不能加载 摘要

```js
{
	/**
	* 一个按照时间倒序的所有 Posts 的清单
	* 只有标题,和时间值
	*/
	category_1 : [{
		time : 1398646210000,	// 时间戳
		title: '文章的标题',		// 用于 HTML title 标签
		url: 'filename'			// url 会引用到的名字
	} ,	{
		time : 'yyyy-mm-dd hh:mm',
		title: '另一篇文章的标题'
		url : 'other.html'
	} , {
		//......	
	}
	],
	category_2 : [
	
	]	
}
```

#### 实现

 * 支持命令行参数
 > 这项要求可以放最后

 * 读取 _post 目录中所有 markdown文件的 YAML标头 - **完成**

  * 从 文件名读取 filename 和 Date 值
  
  * 从YAML 读取 Time 值,并覆盖 文件名的Date属性

  * 从YAML 得到 title , category 值, 自定义默认值

  * 以 Time 值排序数组
  
  * 写文件

#### 其它

 * 以字符串隔开的字符串如: "one two three" 代表了 3 个 category,要如何处理?

 > **以第一个为基准**,这样的话需要修改 nodejs 脚本,只取第一个空格前的值就行了

#### 想法

 - 打算用nodejs的 YAML 库来把分页的属性写成一个 paginator.yaml 文件,让 jekyll 调用

 - 用nodejs写文件只要复制各目录下的 index.html 到 page2/index.html

  - 需要保存nodejs 写了哪些文件,方便调用 clean 清除这些

 - index.html 内部调用 Liquid 语法 根据 paginator.yaml 来写 内容

  - 各个 index.html 可以根据所在 url 判断当前分页

  - 根据 yaml 属性找 与其相关属生

  - 需要哪些内容参考 jekyll 的 paginator

 - **等以后写的内容可以分页了再做这些,先做些其它的**


