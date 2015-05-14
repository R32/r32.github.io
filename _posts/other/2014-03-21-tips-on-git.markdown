---

layout: post
title:  git 常用操作
date:   2014-03-21 9:50:10
categories: other

---

[Git](https://github.com/git/git) - the stupid content tracker

[window 版本下载](http://git-scm.com/)

<!-- more -->
### 基本

一些命令行参数说明, 1~14 都属于 commitish

```bash
----------------------------------------------------------------------
|    Commit-ish/Tree-ish    |                Examples
----------------------------------------------------------------------
|  1. <sha1>                | dae86e1950b1277e545cee180551750029cfe735
|  2. <describeOutput>      | v1.7.4.2-679-g3bee7fb
|  3. <refname>             | master, heads/master, refs/heads/master
|  4. <refname>@{<date>}    | master@{yesterday}, HEAD@{5 minutes ago}
|  5. <refname>@{<n>}       | master@{1}
|  6. @{<n>}                | @{1}
|  7. @{-<n>}               | @{-1}
|  8. <refname>@{upstream}  | master@{upstream}, @{u}
|  9. <rev>^                | HEAD^, v1.5.1^0
| 10. <rev>~<n>             | master~3
| 11. <rev>^{<type>}        | v0.99.8^{commit}
| 12. <rev>^{}              | v0.99.8^{}
| 13. <rev>^{/<text>}       | HEAD^{/fix nasty bug}
| 14. :/<text>              | :/fix nasty bug
----------------------------------------------------------------------
|       Tree-ish only       |                Examples
----------------------------------------------------------------------
| 15. <rev>:<path>          | HEAD:README.txt, master:sub-directory/
----------------------------------------------------------------------
|         Tree-ish?         |                Examples
----------------------------------------------------------------------
| 16. :<n>:<path>           | :0:README, :README
----------------------------------------------------------------------
```

#### 克隆

 * 首先在 github 上 fork 别人的分支

 * 打开 Git Gui,有克隆的选项,输入 fork 的 SSH 链接

  - `git clone git@github.com:yss/restjs.git localdir`

  - 如果不需要历史可以加参数 `--depth 1`


#### 更新

 * `远端(remote) -> Add` 输入 fork 的原始分支, bob名字任意
 
  - `git remote add bob https://github.com/DoubleSpout/restjs.git`

 * `远端(remote) -> 从获取(fetch)` , 选择相应的名字如bob

  - `git fetch bob`

 * `合并(merge) -> 本地合并` 

  - git merge bob/master`

 * 可能需要手动调整合并冲突, 然后再缓存提交
 
	> GUI 这里需要自已单击已经修改了的冲突文件,而不是点击 缓存 按钮

 * **rebase**

  - `git rebase bob/master` 这个命令比 merge 要好,如果 fork 别的人项目

  - **重要:** 冲突解决后,添冲突的文件添加到缓存之后先不要提交,而是输入 `git rebase --continue`


#### 上传

 * 本地提交后点 `上传` 就行了

  - `git push origin master`



### 其它


* 恢复 **单个文件** 到某个历史版本

	```bash
	# git checkout COMMIT_HASH -- path_to_file.ext
	git checkout 45a0c601f32b1c245c988d00e364e27b9b90eff0 -- readme.md
	```

 * upstream, 自动更新 fork 版本 repo

  - 先将仓库指定为 upstream `git remote add upstream https://github.com/fork.git`

  - `git fetch upstream`

  - `git merge upstream/master`


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

#### 删除历史文件

如果是刚提交的文件,使用"修正上次提交"就行,不必使用下边操作

删除已经提交的历史文件, 注意命令行中的小数点

```bash
> git filter-branch --tree-filter 'rm -f passwords.txt' HEAD 
Rewrite bb383961a2d13e12d92be5f5e5d37491a90dee66 (2/2)  
Ref 'refs/heads/master'  
 was rewritten  
> git ls-remote .  
230b8d53e2a6d5669165eed55579b64dccd78d11        HEAD  
230b8d53e2a6d5669165eed55579b64dccd78d11        refs/heads/master  
bb383961a2d13e12d92be5f5e5d37491a90dee66        refs/original/refs/heads/master  
> git update-ref -d refs/original/refs/heads/master [bb383961a2d13e12d92be5f5e5d37491a90dee66]  
> git ls-remote .  
230b8d53e2a6d5669165eed55579b64dccd78d11        HEAD  
230b8d53e2a6d5669165eed55579b64dccd78d11        refs/heads/master  
> rm -rf .git/logs			# linux: 删除日志
> git reflog --all  		# 分支等引用变更记录管理
> git prune  				# 从对象库删除过期对象
> git gc  			
> du -hs  					# linux 以M为单位统计此目录所有文件大小总合
```

#### 合并单个Commit

实际 GUI 操作可以完成这项操作

```bash

```

#### 多账号提交

同电脑多账号提交到 github, 最好的方法是 为不同账号创建 用户, 这样 ssh 便不会冲突,　**只在提交的时候** 切换`win+L`一下用户就行了

记得保存 msysgits 或 ssh 工具生成的 `C:\Documents and Settings\%user%\.ssh` 目录下的文件,以方便移到其它计算机上

msysgits 右键菜单移除, 如果 **添加** 则去掉参数 `/u`

```bat
:: 64-Bit Windows
cd "C:\Program Files (x86)\Git\git-cheetah"
regsvr32 /u git_shell_ext64.dll

:: 32-Bit Windows
cd "C:\Program Files\Git\git-cheetah"
regsvr32 /u git_shell_ext.dll
```

注: windows 多用户登录时指定默认的用户, `win+r` 之后键入:`control userpasswords2` 在打开的面板中将 "要使用本机用户必须键入密码" 的勾去掉,然后确定.挑选一个默认用户就行了

#### 常用命令

https://github.com/bpassos/git-commands

http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000

https://github.com/search?utf8=%E2%9C%93&q=git+%E5%91%BD%E4%BB%A4&type=Repositories&ref=searchresults
<br />



GIT Server
------

建立 Git 服务器, 在提交之后自动调用 sh 文件编译项目, 发邮件给成员.

http://ju.outofmemory.cn/entry/16893

