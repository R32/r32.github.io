---

layout: post
title:  git 常用操作
date:   2014-03-21 9:50:10
categories: other

---

[Git](https://github.com/git/git) - the stupid content tracker

[window 版本下载](http://git-scm.com/)

<!-- more -->


#### 克隆

 * 首先在 github 上 fork 别人的分支

 * 打开 Git Gui,有克隆的选项,输入自已 fork 的 SSH 链接

 > `git clone git@github.com:yss/rrestjs.git rrest`

 > `rrest` 为本地目录名称


#### 更新

 * `远端(remote) -> Add` 输入 fork 的原始分支, bob名字任意
 
	> `git remote add bob https://github.com/DoubleSpout/rrestjs.git`

 * `远端(remote) -> 从获取(fetch)` , 选择相应的名字如bob

	> `git fetch bob`

 * `合并(merge) -> 本地合并` 

	> `git merge bob/master`

 * 可能需要手动调整合并冲突, 然后再缓存提交
 
	> GUI 这里需要自已单击已经修改了的冲突文件,而不是点击 缓存 按钮

 * **rebase**

  - `git rebase bob/master` 这个命令比 merge 要好,如果 fork 别的人项目

  - **重要:** 冲突解决后,添冲突的文件添加到缓存之后先不要提交,而是输入 `git rebase --continue`



#### 上传

 * 本地提交后点 `上传` 就行了

 > `git push origin master`

#### submodule

就是当项目需要引入公共的 库文件时,不需要　每个人都复制一份到源码,而是使用 submodule, 

```bash
git submodule add 仓库地址 本地存放路径
```

参考 http://blog.csdn.net/wangjia55/article/details/24400501

通常 克隆仓库不会下载 submodule, 因此需要:

```bash
git submodule init
git submodule update
```