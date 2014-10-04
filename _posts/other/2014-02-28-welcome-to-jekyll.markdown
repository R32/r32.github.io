---
layout: post
title:  欢迎使用 Jekyll
date:   2014-02-28 08:50:10
categories: other
---

You'll find this post in your `_posts` directory - edit this post and re-build (or run with the `-w` switch) to see your changes!
To add new posts, simply add a file in the `_posts` directory that follows the convention: YYYY-MM-DD-name-of-post.ext.

Jekyll also offers powerful support for code snippets:
<!-- more -->
```as
package;

import flash.display.Sprite;

class Mian extends Sprite{
	public funciton new(){
		super();
		trace("hello,world!");
	}
}
```

 * jekyll 需要像这样才能转义代码高亮
	
	```{% raw %}
{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}{% endraw %}
	```



 * 可以在 `_config.yaml` 添加下边语句:

	```yaml
	markdown: redcarpet
	extensions: [fenced_code_blocks]
	```



 * 就可以用 `backticks` 的方式来代码高亮

	```
		```ruby
		def foo
			puts 'foo'
		end
		```
	```

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh].

[jekyll-gh]: https://github.com/mojombo/jekyll
[jekyll]:    http://jekyllrb.com
