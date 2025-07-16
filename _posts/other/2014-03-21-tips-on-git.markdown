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

同用户下配置多个密钥: https://superuser.com/questions/232373/how-to-tell-git-which-private-key-to-use/912281#912281

```
# git 2.10.0 +
# 克隆的时候使用, 由于 -i 可能会覆盖 /.ssh/config 文件因此这里使用了 -F /dev/null 参数
git clone -c "core.sshCommand=ssh -i ~/.ssh/id_rsa_example -F /dev/null" git@github.com:example/example.git

# 如果已经存在了，则下边命令用于单个项目，
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_example -F /dev/null"

# 使用 -F /dev/null 是为了防止将配置保存到 .git/config 中去
```

### 简单

中文 git文档: <https://git-scm.com/book/zh/v2>

另一个人的经验笔记: <http://blog.csdn.net/kangear/article/details/13169395>

#### 下载单个目录

例如下边的下载单个 extensions 目录, (感觉似乎还是下载了整个仓库, 只是提取出了特定目录)

```
git clone --filter=blob:none --no-checkout https://github.com/microsoft/vscode.git vscode --depth 1
cd vscode
git sparse-checkout init --cone
git sparse-checkout set extensions
git checkout main  # or the branch you want
```

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

####  额外

修改作者和邮箱

```
# 首先通过 git config 配置单个 repo 的 作者和邮箱

# --root 将从第一条 commit 开始
git rebase -i --root

# 之后修改所有的 pick 为 edit, 保存后关闭

# 为每条 commit 执行如下
git commit --amend --author="John Doe <john@doe.org>" --no-edit
git rebase --continue
```

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

# 如果是第一条 commit 那么使用 --root
git rebase -i --root

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

  # 恢复
  git restore readme.md
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


  # 可以使用 --directory=<root> 修改目录
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


------


gpg
============

感觉对于 github 来说没什么必要，因为已经有 ssh 了，但是对于 linux 系统来说
由于很多地方都要用到它来作为密钥

[参考](https://www.howtogeek.com/816878/how-to-back-up-and-restore-gpg-keys-on-linux/)

照着 github 的步骤创建密钥, 一些信息可能不同, 我使用的是 2.2.9 版本的 gpg
由于 gpg 不同版本的原因，因此在多个机器上共享密钥最正确的方式是:

- 使用 `--export-secret-key` 导出，再通过 `--import` 导入即可

问题: 如何只导入子密钥用于通信加密了？

```
.gnupg/
	openpgp-revocs.d/   # 存放着"撤销证书"
		AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.rev

	private-keys-v1.d/  # 存放着"私钥"
		BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.key
		CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.key

	pubring.kbx         # 加密了的公钥库

	pubring.kbx~        # pubring.kbx 的自动备份文件

	trustdb.gpg         # 一些信任数据
```

简单的文件结构

```
# gpg --version
gpg (GnuPG) 2.2.29

# gpg --list-secret-keys --keyid-format=long
/c/Users/NAME/.gnupg/pubring.kbx
---------------------------------
#     rsa长度/KEY_ID         创建时间   [能力]      # 注意 KEY_ID 只是名字
sec   rsa3072/4EC5303865FDEB06 2023-07-03 [SC]      # (src)表示主密钥
      0BB53B3692D6890765E503F94EC5303865FDEB06      # 指纹, 撤销证书使用它作为文件名
uid         [ultimate] YOUR_NAME <YOUR_EMAIL@WHAT.EVER>  # 用户信息
sub   rsa3072/DB2DB20C38DF35B9 2023-07-03 [E]       # 子密钥

# 使用 --list-keys 看到的和 --list-secret-keys 的几乎一样就是 sec 变成了 pub
pub   rsa3072/4EC5303865FDEB06 2023-07-03 [SC]      # 同一对公钥和密钥的 KEY_ID 值是一样的
```

### 导出/导入

导出 "私钥" 主要用于备份，而导出 "公钥" 一般用于将它发送出去,
当然由于公钥包含了别人发给你的，因此也需要备份。
因此如果是备份的话只要导出密钥即可，(至于"撤销证书"则要自己已文件的形式拷贝(未验证))

公钥

```
# 备份机器所有公钥
gpg --export --export-options backup --output public.gpg

# 备份指定了目标
gpg --export --export-options backup --output public.gpg YOUR_EMAIL@WHAT.EVER

# 导入公钥
gpg --import public.gpg

# 对于旧版本 gpg 生成的 pubring.gpg 文件 参考 GPG-Configuration 的导入方式

##
# 导出提交到 github，使用 邮箱名和 KEY_ID 导出的结果是一样的，即使的是 ssb 的 KEY_ID
gpg  --armor --export YOUR_MAIL@WAHT.EVER

# 关联 git 提交的一些设置
git config --global user.signingkey [YOUR_EMAIL@WHAT.EVER | KEY_ID]

# 每次 commit 时自动签名, 但是感觉签名很麻烦每个项目都要输密码还好可以在项目上单独关闭
git config --global commit.gpgsign true
```

密钥

```
# 导出机器所有密钥，需要密码才可以
gpg --export-secret-keys --export-options backup --output private.gpg

# 导入密钥和导入公钥一样，只是需要输入密码
gpg --import private.gpg
```

信任数据

```
# 备份信任数据
gpg --export-ownertrust > trust.gpg

# 导入信任数据
gpg --import-ownertrust trust.gpg
```

至于 "撤销证书" 直接复制文件么？根据 [gnupg 文档](https://www.gnupg.org/documentation/manuals/gnupg/GPG-Configuration.html)
的描述需要你自己备份 `openpgp-revocs.d/` 目录下的所有文件

  网上关于导出证书的那些操作实际上是在执行撤销动作 ID

  ```bash
  # 制作
  gpg --output revoke.asc --gen-revoke key-ID
  # 导入
  gpg --import revoke.asc
  ```

## 命令行操作

由于长时间在 windows 使用 git gui, 因此当切换到 linux 时需要使用命令行来操作 git.
> 试用了 linux 平台的几款 git UI 方面的软件, 感觉兼容性都不好, 就感觉 gigger 还行,
> 但其提供的功能过于简单

```bash
# 首先是初始化目录用的, 在 windows 平台我也是用这个命令
git init

# 重命名 branch 名字, 例如下边将默认名 master 改成 main
git branch -m main

# 显示本地 branch, 参数 "-a" 显示所有分支, "-r" 显示远程分支, "-d" 表示删除分支
git branch

# **重要**, 查看各个文件状态, 并且会有相关的操作提示
git status

# **重要**, 显示文件差异
git diff
git diff --name-status        # 只显示有差异的文件名
git diff -- <file>            # 指定文件的差异
git diff --staged             # --cached 的别名
git diff HEAD^                # 显示连同最后一条 commit 的差异, 等同于 git diff HEAD~1


# 基本文件添加
git add <file>                # 添加文件到暂存区域, 可以使用 tab 键自动补齐
git add .                     # 会把所有文件都添加到暂存区, 因此不建议使用
git commit -a -m "message"    # 直接提交所有修改过了的文件, 不会添加新文件

# 撤消恢复
git restore --staged <file>   # 将刚才添加的文件从暂存区域"撤回", --staged 或 -S 很重要千万别漏了
git restore <file>            # 有点类似于 git checkout <file>, 可以使用文件通配符
git restore .                 # 恢复当前repo的所有更改, 和 git reset 不一样的是这个不会影响暂存区(staged)中的文件

# 分支切换, 只要不加 "-f" 就不会重置工作区(working directory)和暂存区(staged)中已修改的文件
git checkout <branch_name>    # 切换分支
git switch <branch_name>      # git 2.23+

git checkout -b <branch_name> # 创建并切换至分支
git switch -c <branch_name>

# 还原文件可以指定 commit, 为避免和分支名字冲突, 文件一般放在 -- 后边
git checkout -- <file>
git checkout -- '*.c'

# git commit --amend, 大致等同于
## git reset --soft HEAD^
## ... do something else to come up with the right tree ...
## git commit -c ORIG_HEAD
# 大致操作
git add <file>                   # 添加修改文件
git diff HEAD^ [-- <file>]       # 查看与最后一条 commit 合并后的差异
git commit --amend -m "message"  # 合并提交到最后一条 commit, 如果不想修改 "message" 可加 --no-edit
```
