---

layout: post
title:  git 常用操作
date:   2014-03-21 9:50:10
categories: other

---

[Git](https://github.com/git/git) - the stupid content tracker

[window 版本下载](http://git-scm.com/)

[github 上传大型文件](https://git-lfs.github.com/)

在 github url 结尾添加 `.patch` 或 `.diff` 可下载单个 patch, 例:  `https://github.com/foo/bar/commit/${SHA}.patch`

<!-- more -->

### 简单

中文 git文档: <https://git-scm.com/book/zh/v2>

另一个人的经验笔记: <http://blog.csdn.net/kangear/article/details/13169395>

#### 克隆

 * 首先在 github 上 fork 别人的分支

 * 打开 Git Gui,有克隆的选项,输入 fork 的 SSH 链接

  - `git clone git@github.com:yss/restjs.git localdir`

  - **Tips:** 如果不需要历史可以加参数 `--depth 1`


使用 svn 工具从 github 上下载单个文件夹已经不可用.


```bash
# 如果用相对目录则可以不使用指定全局文件路径
git clone file:///C:/path/to/repo new_dir
```

#### 更新

* `远端(remote) -> Add` 输入 fork 的原始分支, bob名字任意

  - `git remote add bob https://github.com/DoubleSpout/restjs.git`

* `远端(remote) -> 从获取(fetch)` , 选择相应的名字如bob

  - `git fetch bob`

* `合并(merge) -> 本地合并`

  - git merge bob/master`

* 可能需要手动调整合并冲突, 然后再缓存提交

  ```bash
  # 如有冲突,查看当前有哪些文件产生了冲突:
  git diff

  # 解决掉冲突之后
  git add file.txt

  # 如果你觉得你合并后的状态是一团乱麻，想把当前的修改都放弃
  git reset --hard HEAD
  ```

  > GUI 这里需要自已单击已经修改了的冲突文件,而不是点击 缓存 按钮

* **rebase** 如果是 fork 别的人项目,这个命令比 merge 要好

  ```bash
  # rebase合并
  git rebase bob/master

  # 如果有冲突(conflict), 则修改冲突后添加到缓存
  # 查看冲突使用 git diff 命令
  git add	path/to/conflict.file

  # 不需要执行 git commit,而是:
  git rebase --continue

  ## 如果感觉有什么不对,可用于中断并恢复
  git rebase --abort
  ```

* `git pull` 这个命令执行了 git fetch 和 git merge 二个操作, 方便快速更新.

#### 上传

* 本地提交后点 `上传` 就行了

  - `git push origin master`

### github

[本地测试 github 上别人提交的 PR](https://help.github.com/articles/checking-out-pull-requests-locally/#modifying-an-inactive-pull-request-locally)


### 合并多个 commit

你可以随意的提交， 当合并到其它 banrch 时 再选择性地合并, 注: 如果采用分支的形式提交到 github, github 会自动帮你合成一个.

```bash
# 如果遇到问题，下边指令可以终止 rebase
git rebase --abort

# 进入交互模式，(尝式将 AFTER_COMMIT_HASH(即不包括这个) 之后的 commit 合并成一个)
git rebase -i [AFTER_COMMIT_HASH]

# 这时会进入到 VIM 的交互模式，可使用其它 IDE 编辑，但是你仍然需要了解几个 VIM 命令
pick 16b5fcc Code in, tests not passing
pick c964dea Getting closer
pick 06cf8ee Something changed
pick 396b4a3 Tests pass

# 除了第一条不动，将 pick 全改成 squash
pick 16b5fcc Code in, tests not passing
squash c964dea Getting closer
squash 06cf8ee Something changed
squash 396b4a3 Tests pass

# 可以多个 pick 跟随多个 squash, 如果失败了那么那么肯定是有冲突, 按照提示手动修改即可
# 警告: 不要删除其中的某一行，否则 commit 会丢失 除非你明确要那样做

# VIM 交互模式下 "保存并退出" (ESC + :wq)
# 这时 VIM 将会重新加载一个 commit message 列表，所有非注释内容会被当成提交
# VIM 交互模式下 "保存并退出" (ESC + :wq)
# done!

# 如果你使用其它 IDE 编译，当保存后, VIM 这边会提示你是否 [L]oad 进来,

# VIM 按下 ESC 则进入 "命令模式"，这时:
## :w 保存但不退出 write
## :q 不保存退出 quit
## :wq 保存并退出，如果最后加上 ! 则有强制的意思
## :e! 放弃所有修改，恢复到上次保存文件时
# 按 Insert 可 toggle 到 Insert 模式方便编辑
```

### 其它

* 恢复 **单个文件** 到某个历史版本

  ```bash
  # git checkout COMMIT_HASH -- path_to_file.ext
  git checkout 45a0c601f32b1c245c988d00e364e27b9b90eff0 -- readme.md

  # 从 HEAD 中恢复
  git checkout -- readme.md
  ```

* 撤消一个 commit，并保留它使得你可以恢复

  ```bash
  git revert --continue
  git revert --abort
  ```

* upstream, 自动更新 fork 版本 repo

  - 先将仓库指定为 upstream `git remote add upstream https://github.com/fork.git`

  - `git fetch upstream`

  - `git merge upstream/master`

* github 语言统计, `.gitattributes`

  ```bash
  # 将所有 JS 文件当成 统计为 Haxe
  *.js linguist-language=Haxe


  # Use the linguist-vendored attribute to vendor or un-vendor paths
  # 被标记为 linguist-vendored 是表示不统计, 而 = false 是添加到统计
  special-vendored-path/* linguist-vendored
  jquery.js linguist-vendored=false

  # Use the linguist-documentation attribute to mark or unmark paths as documentation.
  project-docs/* linguist-documentation
  docs/formatter.rb linguist-documentation=false
  ```

* stash 用于保存当前工作

  ```bash
  git stash
  # 之后整个目录会回到最后一次提交时的状态
  # 以便于临时修改一些Bug.
  # 可以加参数 -u 例 git stash -u，这样可以把新文件也暂存进去
  # 可以使用 save  来添加备注
  git stash save "一些方便识别的 msg"

  # 做一些提交后,想回到工作目录
  git stash apply

  # 处理冲突如果有
  git add <filename>
  git reset HEAD <filename>
  # 或 git reset HEAD 	# 注意执行这个命令时需要确认文件已经被添加,因为未添加到缓存的所有文件将被重置

  git stash clear


  -k | --[no-]eep-index: 保存进度后, 是否重置暂存区(默认会会重置, 如果没有这些参数)
  # 如果需要提交到 github 还是用新分支吧.做完再合并到主线上来.
  ```

  你可能只想要 stash 单个文件, 可以使用:

  ```bash
  # 下边是 --patch 的简写, 这时将进入交互模式, 然后选 y 或 n 就可以了
  git stash -p
  git stash save -p "some notes"
  ```

  从 stash 中恢复单个文件可以参考: [single file from stash](http://stackoverflow.com/questions/1105253/how-would-i-extract-a-single-file-or-changes-to-a-file-from-a-git-stash)

  ```bash
  git checkout stash@{0} -- path/to/file.ext
  ```

* [没有共同祖先的分支](http://gitbook.liuhui998.com/5_1.html)

  ```bash
  git symbolic-ref HEAD refs/heads/newbranch
  rm .git/index
  git clean -fdx  # 注意这行会删除当前所有没有被跟踪的文件
  #<do work>
  git add your files
  git commit -m 'Initial commit'
  ```

* 查找文件是每个部分是谁修改的

  ```bash
  git blame path/to/file.ext
  # http://gitbook.liuhui998.com/5_5.html
  ```

* 使用二分法查找问题出在哪? 最后把问题以 patch 的形式提交而不是修改历史

  ```bash
  git bisect start
  git bisect good v2.6.18
  git bisect bad master

  # 通过不停的 git bisect bad, good 查找问题

  # 找到问题后,恢复到git bisect start,
  git bisect reset

  # 更多参考 http://gitbook.liuhui998.com/5_4.html
  ```

* 将改动做成补丁, [这个链接有些其它内容](http://blog.csdn.net/xzongyuan/article/details/9425739)

  ```bash
  # 首先创建一个新分支如 patch-1,然后 checkout,
  # 输入以下命令后将在在目录下生成一个 .patch 的文件:
  git format-patch master

  # hash 之间的改动做成补丁,不包括 old_sha 但会包括 new_sha，中间的三个点号要加上
  git format-patch <old_sha>...<new_sha> -o <patch_dir>

  # 自 after_sha 后的修改，不包括 after_sha
  git format-patch <after_sha>

  # 应用 patch(不完整),
  git apply xxxxx.patch         # 直接应用 patch, 需要自行缓存并提交
  git apply --start xxx.patch		# 检查 patch
  git apply --check xxx.patch		# 是否能应用成功

  git am -s < xxx.patch			    # 应用 patch
  ```

#### submodule

就是当项目需要引入公共的库文件时,不需要每个人都复制一份到源码,而是使用 submodule,

> 注: 一定要将 submodule 所在子目录添加到 .gitignore 文件里去以避免出现混乱

```bash
git submodule add 仓库地址 本地存放路径
```

参考 <http://blog.csdn.net/wangjia55/article/details/24400501>

通常 克隆仓库不会下载 submodule, 因此需要:

```bash
git submodule init
## git submodule update, 如果不需要历史加上深度会更好.
git submodule update --depth=1
```

有时候不需想拉取所有的 submodule 则可以:

```bash
git submodule status       # 显示 submodule 信息
git submodule deinit .     # 反向init, . 表示全部,
git submodule deinit path  # 或者指定 status 显示的路径
git submodule init         # 初使化全部
git submodule init path    # 初使化单独一个路径(status)
git submodule update       # 拉取 init 指定的模块
```

分拆子目录为子模块: `git submodule split`

```bash
$ git submodule split [--url submodule_repo_url] submodule_dir \
    [alternate_dir...]
```


#### subtree

subtree 是 1.8 之后的新命令

TODO

#### cherry-pick

将指定的 commit 应用到当前分支:

```bash
$ git cherry-pick HASH
```

实际上 GUI 客户端里查看本地所有分支时, 右键指定的 commit 会有 cherry-pick 的选项..

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


#### 杂项

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

<https://github.com/bpassos/git-commands>

<http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000>

<https://github.com/search?utf8=%E2%9C%93&q=git+%E5%91%BD%E4%BB%A4&type=Repositories&ref=searchresults>
<br />

#### travis-ci

* 跳过构建: 在提交消息中的任意位置添加 `[ci skip]`, 比如当你只是更新 README 文件时.


GIT Server
------

建立 Git 服务器, 在提交之后自动调用 sh 文件编译项目, 发邮件给成员.

<http://ju.outofmemory.cn/entry/16893>

