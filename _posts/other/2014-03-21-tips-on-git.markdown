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

 * rebase

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


#### 其它

windows 同一台电脑多账号提交到 github, 最好的方法是 为不同账号创建 用户, 这样 ssh 便不会冲突,　**只在提交的时候** 切换`win+L`一下用户就行了

记得保存 msysgits 或 ssh 工具生成的 `C:\Documents and Settings\%user%\.ssh` 目录下的文件,以方便移到其它计算机上

msysgits 右键菜单移除, 添加的话 去掉 参数 /u 就行了

```bat
:: 64-Bit Windows
cd "C:\Program Files (x86)\Git\git-cheetah"
regsvr32 /u git_shell_ext64.dll

:: 32-Bit Windows
cd "C:\Program Files\Git\git-cheetah"
regsvr32 /u git_shell_ext.dll
```

注: windows 多用户登录时指定默认的用户, `win+r` 之后键入:`control userpasswords2` 在打开的面板中将 "要使用本机用户必须键入密码" 的勾去掉,然后确定.挑选一个默认用户就行了


<br />

GIT Server
------

建立 Git 服务器, 在提交之后自动调用 sh 文件编译项目, 发邮件给成员.

http://ju.outofmemory.cn/entry/16893

