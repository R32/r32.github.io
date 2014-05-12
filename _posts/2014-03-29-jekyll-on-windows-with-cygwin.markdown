---
layout: post
title:  Cygwin 环境安装 Jekyll
date:   2014-03-29 19:21:10
categories: other
---

本文档源文件来自: [nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html](http://nathanielstory.com/2013/12/28/jekyll-on-windows-with-cygwin.html)


#### 简介

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Jekyll] 是一个静态网站构建工具可以用来创建各类网站比如像这个博客 (这个站就是用Jekyll生成的).但是不太支持 windows 环境的安装.刚好我以前用 flash alchemy 时安装了 Cygwin 环境. 下面的说明假定您已经安装了Cygwin.


#### Installing Jekyll

Jekyll is installed as a Ruby gem. Installation is as simple as:

 1. Run Cygwin's `setup.exe`
 2. Install the package ruby
 3. Once Ruby is installed, run the following command to install Jekyll:

{% highlight bash %}
	gem install jekyll
{% endhighlight %}

<!-- more -->

![setup cygwin](/assets/img/cygwin-setup.png)

<hr class="gh" />

#### Installing Pygments

If you're a programmer, you're probably going to want to include code in your posts. If you include code in your posts, you're probably going to want it to be syntax highlighted. You're going to need [Pygments].


##### Installing Python

Pygments is a Python library. So, you're going to need to install Python:

 1. Run Cygwin's `setup.exe`
 2. Install the package python: Python language interpreter (select the **2.x** package, **not python3**!)

##### Install easy_install and Pygments

easy_install is part of the [setuptools] package. Once setuptools and the easy_install utility are installed, installing Pygments will be trivial.

 1.Run the following command to install _setuptools_ and associated utilities:

{% highlight bash %}
curl 'https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py' | python
{% endhighlight %}

 2.This will create a temporary file in your current directory. You'll probably want to delete it: 

{% highlight bash %}
rm setuptools-x.x.x.zip
{% endhighlight %}

 3.Run the following command to install Pygments:

{% highlight bash %}
easy_install Pygments
{% endhighlight %}

#### Additional steps

You may encounter the following two problems.

You may see an error like the following when Jekyll encounters a post containing a highlight tag:

{% highlight bash %}
Liquid Exception: No such file or directory
	- C:\Windows\system32\cmd.exe in _posts/2013-12-22-my-post.markdown
{% endhighlight %}

Set the `COMSPEC` environment variable like below to fix this. I suggest adding it to your `.bashrc` file:
{% highlight bash %}
export COMSPEC=/cygdrive/c/Windows/System32/cmd.exe
{% endhighlight %}

You may see also see this error:
{% highlight bash %}
Generating... which: no python2 in (/usr/local/bin:/usr/bin:...
{% endhighlight %}

To fix this, create a symbolic link like the following:
{% highlight bash %}
ln -s /usr/bin/python /usr/local/bin/python2
{% endhighlight %}

#### Finally

You should now be all set up to create your blog/static-site with Jekyll. You'll probably want to refer to the extensive documentation on the [official website]



[official website]:http://jekyllrb.com/
[Jekyll]:http://jekyllrb.com/
[Pygments]:http://pygments.org/
[setuptools]:https://pypi.python.org/pypi/setuptools