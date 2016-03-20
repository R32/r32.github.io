---

layout: post
title:  IRC 客户端开发
date:   2014-11-08 08:22:11
categories: other

---


客户端选择及所有 IRC 相关:  <http://www.irc-wiki.org/Main_Page>

* 桌面端 

  - nettalk 感觉不错.但不支持 SSL 连接.

<!-- more -->

* android 手机端从用户列表中选择一个 nickname 都不太方便,

  - Yaaic github 开放源码, 界面好看, 能自动加入频道,验证密码, 

  - AndroIRC 每次输入时都会将输入自动改成 Abc, 


### 源码参考


**Start 2404** Web IRC client: <http://shout-irc.com/>

**Start 156** The best IRC library for node.js https://github.com/gf3/IRC-js 

**Start 1873** 基于 node-webkit 的应用 <https://github.com/slate/slate>

flash 客户端源码参考: <https://github.com/unic0rn/tiramisu>


### 基本命令

一些基础概念, 细节请参看 RFC 1459

* IRC 服务器: IRC 不属于任何一个公司, 任何人都可以运行 IRC 服务器, 但是你应该选择大家常用服务器比如: freenode

* IRC 客户端: 用户选择用于 IRC 聊天的 APP(应用或软件).

* 提到: IRC 聊天室中, 当谈话内容中包含了你的 nickname, 这时 IRC客户端会发出一些提示, 就像 其它常见聊天中的 `@nickname`

* 密语: 以 `/msg nickname message` 时,称为 "密语", 这时接收信息的人的IRC客户端通常会打开一个新窗口用于私聊

命令以 斜线 `/` 开始, 后接英文字符, 忽略大小写. http://en.wikipedia.org/wiki/List_of_Internet_Relay_Chat_commands, 

注: 不同客户端有不各自不一样的命令,但是基本都遵循 RFC 1495

```bash
ADMIN [<servers>]		# 返回指定服务器<servers> 或 当前服务器(如果省略参数)的管理信息

AWAY [<message>] 		# 进入暂离状态, 这时 IRC 服务器将会对 "密语" 作自动应答, 如果省略 <message> 则 **移除暂离状态** 。 RFC 1495

CNOTICE <nickname> <channel> :<message>			# 发送一个频道(channel)通知(notice)消息(message)给 nickname, 用于绕过服务器限制
												# 通常一个 IRC 服务器会限制客户端在某个特定时间范围内大量发送消息, 用于防止垃圾邮件发送者或机器人
												# 注: 这个命令不在 RFC 中正式定义, 但在一些 IRC 网络中使用.


CPRIVMSG <nickname> <channel> :<message>		# 基本同 CNOTICE, PRIV 指的 "密语"
												#
												#

CONNECT <target server> [<port> [<remote server>]] 			# (RFC 1459)
CONNECT <target server> <port> [<remote server>] 			# (RFC 2812)
															# 指示服务器<远程服务器>(或当前服务器,如果省略 <remote server>), 连接到 <target server>:<port>
															# 这个命令仅用于 IRC Operators(操作员??服务器管理人员?)

DIE						# Instructs the server to shut down.
						# 仅用于 IRC Operators
						
:<source> ENCAP <destination> <subcommand> <parameters>		# 由服务器用于封装命令以便....
															# 服务器端

ERROR <error message>	# 由IRC 服务器端用于报告错误给其它服务器.同样也用于客户端连接之前 .RFC 1459


HELP					# 返回 服务器帮助

INFO [<target>]			# 返回 <target> 服务器的信息, 如果省略 <target> 则为当前服务器,	也可能是其它相关信息, 例如: nettalk  会返回其软件的版本信息
						# 由 RFC 1459 定义

INVITE <nickname> <channel>				# 邀请 <nickname> 到 <channel>. <channel> 并不存在, 
										# 如果 <channel> 存在,那么只有 频道内的成员邀请其它客户端, 
										# 如果 频道模式(channel mode)为 i, 只有 频道管理员(channel operators)才可以
										# 由 RFC 1459 定义
										
ISON <nicknames>						# is on, 查询服务器 nicknames(用空格分隔的呢称列表) 是否在线, 并返回在线的 nicknames(同样是用空格分隔)
										# 例: /ison AAA BBB CCC, 如果 BBB 不在线,那么只返回 AAA CCC, rfc1459
						
JOIN <channels> [<keys>]				# 加入到指定 <channels>(用逗号分隔频道的列表), <keys> 为频道密码(同样用逗号分隔，  如果频道有指定密码)
										# 如果 频道<channel> 不存在, 将会被创建. rfc1459
										
KICK <channel> <client> [<message>]		# 将 nick (<client>) 踢出频道(<channel>), 可选的踢出原因(<message>) 仅频道管理员可用, RFC 1459

KILL <client> <comment>					# 从网络上移除 <client>, 仅 IRC 管理员(IRC服务器管理员)可用. rfc1459.

KNOCK <channel> [<message>]				# 发送一个 "通知" 和可选的 <message>  到 <channel>(不能自由加入只能被邀请的频道), 请求加入. 
										# 注: 这有点像 QQ中请求加入到一个 QQ 群, 因为 QQ 群就不能随意加入.
										# 这个命令没有在 RFC 中定义, 但大多数主要的 IRC 服务器都支持
										# Support is indicated in a RPL_ISUPPORT reply (numeric 005) with the KNOCK keyword
										

LINKS [<remote server> [<server mask>]]	# Lists all server links matching <server mask>, if given, on <remote server>, or the current server if omitted. rfc1459

LIST [<channels> [<server>]]			# 省略参数将列出当前服务器上所有频道, 如果 指定了 <channels>(用逗号分隔), 将列出这些频道的 topic, 如果指定了 <server>,则只针对指定的服务器. rfc1459

LUSERS [<mask> [<server>]]				# 如果省略参数将返回整个网络规模统计信息. 
										# rfc2812


MODE <nickname> <flags> (user)			# 设置用户模式, <flags> 通过 + 或 -  来设置或取消  rfc1459
										# i - 是否隐身, 当设为隐身时, 命令 /NAMES 和 /WHO 无法检索到你, 也就无法知道你的存在(marks a users as invisible)
										# s - 是否接收服务器通告, (marks a user for receipt of server notices)
										# w - 是否接收管理员用 /WALLOPS 发来的信息 (user receives wallops)
										# o - 管理员标记, 管理员 呢称 前缀字符为 @ (operator flag)
										## 如果用户尝试给自已 +o 设置管理员,设置将被忽略, 然而尝试 -o 取消管理员 将会得到:
										## MODE 命令只能取消该管理员标记。要设置该状态必须用 OPER 命令
										
										## ERR_NEEDMOREPARAMS              RPL_CHANNELMODEIS
										## ERR_CHANOPRIVSNEEDED            ERR_NOSUCHNICK
										## ERR_NOTONCHANNEL                ERR_KEYSET
										## RPL_BANLIST                     RPL_ENDOFBANLIST
										## ERR_UNKNOWNMODE                 ERR_NOSUCHCHANNEL
										## ERR_USERSDONTMATCH              RPL_UMODEIS
										## ERR_UMODEUNKNOWNFLAG
										
MODE <channel> <flags> [<args>]			# 设置 频道模式, 
										# o - 设置/解除 频道管理员, 可以一次设置多个人用空格分隔(give/take channel operator privileges)
										## example: /mode #test +o tom` 或 `/mode #test +ooo tom ben jak
										## + 或 - 可以混合 `/mode #test +oo-o tom ben jak`
										# p - 私有频道(private channel flag)
										# s - 设置/解除 隐藏频道(secret channel flag)
										# i - 设置/解除 只有被邀请的人才能进入(invite-only channel flag)
										# t - 锁定 topic 只有频道管理员才能更改, (topic settable by channel operator only flag)
										# n - 设置/解除 不接受频道外部消息 TODO: 不太理解(no messages to channel from clients on the outside)
										# m - 旁听模式, 只有管理员和被许可的人才能发言(moderated channel)
										# l - 限定频道人数(set the user limit to channel)
										# b - 禁止/取消禁止 某个 mask (set a ban mask to keep users out)
										## 凡是与被禁止 mask 匹配的用户都不能进入频道, 已经在频道内的将无法说话.
										## 例: /mode #test +b *!*@*.edu ; prevent any user from a hostname
                                matching *.edu from joining
										## TODO: 使用的正则表达式未知
										# v - 当 +m 模式时, 设置/解除 某人发言权(give/take the ability to speak on a moderated channel)
										# k - 设置/解除 频道密码(set a channel key (password))

MOTD [<server>]							# 如果省略 <server> 则返回当前服务器 一天的消息(message of the day)


NAMES [<channels>] 						# rfc1459
NAMES [<channels> [<server>]] 			# rfc2812
										# 返回指定频道(用逗号分隔各个频道, 省略则为当前) 的 呢称列表(空格分隔), 
										# 返回的列表中的呢称包含前缀,前缀为由其所在频道身份属性. (@ 为频道管理员, + 为lower voice)
										# IRCv3 版本,支持呢称 多个前缀, 目前绝大多数 IRC 客户端或服务器支持 IRCv3
										
PROTOCTL NAMESX							# Instructs the server to send names in an RPL_NAMES reply prefixed with all their respective channel statuses instead of just the highest one (similar to IRCv3's multi-prefix).


NICK <nickname> [<hopcount>] 			# rfc1459 允许客户端更改 呢称, Hopcount is for use between servers to specify how far away a nickname is from its home server
NICK <nickname> 						# rfc2812

NOTICE <msgtarget> <message>			# 这个命令很像 PRIVMSG, 但是不会收到 自动应答的消息, rfc1459
										# 注: 对于大多数客户端, PRIVMSG 会打开一个新窗口, 但 NOTICE 则不会. 像是当前频道的悄悄话(whisper)
										
OPER <username> <password>				# 验证用户是否为 IRC 管理员 rfc1459

PART <channels> [<message>]				# 离开指定频道(如果多个频道则用逗号分隔)

PASS <password>							# TODO: 细节不清楚. 估计是用于连接需要密码的服务器
										# 设置 "连接密码(connection password)", 这个命令必须在 验证 nick/user 之前发送
										
PING <server1> [<server2>]				# ping server1, 如果指定了 <server2>, 则该消息传递给它. rfc1459
										# TODO: 实际上 freenode 服务器 测试为 PING [<channel|nickname]
										
PONG <server1> [<server2>]				# 用于应答 PING, 其它和 PING 一样

PRIVMSG <msgtarget> <message>			# 发送 <message> 到 msgtarget(频道或呢称). rfc1459
										# TODO:  感觉和 /MSG 一样, 而 /QUERY 会主动打开一个新窗口, 而 PRIVMSG 只有接受者才会打开新窗口

QUIT [<message>]						# 断开到服务器的连接

REHASH						# 使服务器重新读取配置文件. 仅限于 IRC 管理员

RESTART						# 重启服务器, 仅限于 IRC 管理员

RULES						# Requests the server rules.
							# This command is not formally defined in an RFC, but is used by most major IRC daemons.

SERVER <servername> <hopcount> <info>	# 用于通知服务器连接的另一端为服务器, 同样用于传送全网服务器数据
										# <hopcount> details how many hops (server connections) away <servername> is
										# <info> 包含附加可阅读的服务器信息.

SERVICE <nickname> <reserved> <distribution> <type> <reserved> <info>	# 在网络上注册新的服务器. rfc2812
									

SERVLIST [<mask> [<type>]]				# 列出当前网络服务器清单(好像只适用用于服务器端) rfc2812

SQUERY <servicename> <text>				# 和 PRIVMSG 完成一样, 除了接受方必须为 服务器

SQUIT <server> <comment>				# 使 <server> 退出网络

SETNAME <new real name>					# 允许客户端更改 真实姓名(real name), 当已经验证连接.
										# 非 RFC 标准, 但一些 IRC Daemons 支持. 通过 RPL_ISUPPORT 检测是否支持
```

<br />

freenode
------

[freenode](http://www.freenode.com/) 是大多数人使用的服务器.

IRC 聊天不需要注册, 填写 呢称(nickname) 之后,就可以连接服务器, 但是如果想常期使用同一个呢称, 就需要注册了.呢称是唯一的.

注册呢称: 

```
/msg NickServ REGISTER youpassword youremail@example.com
```

请不要选择一个过于简单的密码，但也请不要选择一个重要的密码，因为您很容易不小心将密码发送到某个频道中。您现在应该检查您的电子邮箱，并完成确认信中提到的步骤:

```
/msg NickServ VERIFY REGISTER younickname randomletter
```

[可选] 隐藏邮件地址(注册新呢称时默认为隐藏):

```
/msg NickServ set HIDEMAIL ON
```

<br />

RFC 2812
------

<http://tools.ietf.org/html/rfc2812>

### Label

本节定义标识符用于各种IRC协议的组成部分

#### Servers(服务器)

Servers的名字作为其唯一标识, 名字最长为63个字符. 查看语法规则(section 2.3.1)-哪些字符可用或不可用于名字

#### Clients(客户端)

对于每一个客户端,所有服务器必须具有以下信息：

* 网路(netwide)唯一标识符(其格式取决于客户端的类型)和介绍了客户端的服务器。

##### Users(用户)

用户, 每个用户具有唯一的昵称(最长为9个字符)以相互区别 查看语法规则(section 2.3.1)-哪些字符可用或不可用.

虽然限制为最长9个字符,但客户端 **应该** 接受更长的字符串,因为更长的字符串可能在未来的协议中定义

* Operators(管理员) 一类特殊User,在网络允许执行一般的维护, 如根据需要断开并重新连接服务器

  > 虽然给管理员授予权力被视为危险, 但这经常是有必要的.
  >
  > 最具有争议的是管理员的能力，例如: 管理员可以强制关闭客户端到服务器的连接.

##### Services(服务员)

和 User 一样, 服务员具有唯一昵称(最长为9个字符)以相互区别,

#### Channels(频道)

频道名为字符串(以 `#`,`&`,`+`,`!` 字符开头)长度可为 50 个字符.每个不同的字符前缀为不一样的频道类型.参考: http://tools.ietf.org/html/rfc2811

频道名称 **不** 区分大小写,频道名的唯一限制是: 不可以包含空格,控制字符(ASCII7),及逗号(`,`). 因为空格用于分隔参数,而逗号用来分隔list item.冒号(`:`)同样作为分隔符用于频道掩码(channel mask).


### The IRC Client Specification

仅适用于客户端到服务器的连接当客户端(client)注册为用户(user)

#### Character codes

每条消息由长度不同的8位字节组成, 一些字符将作为控制符用于消息的分隔.

由于IRC的北欧语源, 字符 `{}|^` 被认为是 `[]\~` 的小写字符,这是一个严重的问题当计算二个昵称或频道名是否相等时.

#### Messages(消息)

服务器和客户端发送所有其它消息, 可能需要或不需要答复, 如果消息包含有效的命令, 如后所述, 客户端应该期待明确的答复但不是永久等待答复,客户端到服务器和服务器到客户端的通信本质上是异步的性质.

每个 IRC 消息可能主要由三部分组成: 它们之间使用空格分隔(`0x20`)

* 前缀(prefix)可选. 如果有,则由冒号(`:`)作为消息的第一个字符出现,然后紧接前缀, 前缀与冒号之间不可以有空白字符.前缀用于服务器指示消息的真实来源.

  > 如果消息没有前缀，则假定它源于从它接收到的连接.客户端在发送消息时 **不应该** 使用前缀,如果使用了,唯一有效的前缀是与客户端相关联的注册昵称.

* 命令(command) 命令必须为有效的IRC命令或3个ASCII文本数字

* 命令参数(command parameters) 最多15个.

IRC消息的一行总是以CRLF作为结束. 以及消息 **不应该** 超过 512个字符,长度包括了CRLF字符,因此只有510个字符长度用于命令和参数. [这些没有定义如何连接上一行消息(这样的话一条过长的消息将被分割.)]


##### Message format in Augmented BNF

消息必须从8位字节流中提取,当前的方案是CRLF作为消息分隔符. 空的消息将被忽略,

```
message = [ ":" prefix SPACE ] command [ params ] CRLF
prefix	= servername / ( nickname [ [ "!" user ] "@" host ] )
command = 1*letter / 3digit
params	= *14( SPACE middle ) [ SPACE ":" trailing ]
		=/ 14( SPACE middle ) [ SPACE [ ":" ] trailing ]


nospcrlfcl =  %x01-09 / %x0B-0C / %x0E-1F / %x21-39 / %x3B-FF 
			; 任意8位字符除了 NUL, CR, LF, ' '和':'

middle	= nospcrlfcl *( ":" / nospcrlfcl )
triling = *( ":" / " " / nospcrlfcl )

SPACE	=  %x20
```

NOTES:

* 所有的参数(params)都需要符合 <middle>或<trailing>. <trailing>是允许在参数中附加空格(0x20)的小技巧.

* NULL(0x00)字符并没有作为消息的结束, 但它会导至 C 字符串处理的复杂性,因此 NULL 不允许出现在消息之中

.......

#### Numeric replies

大多数消息发送到服务器生成某种形式的应答,最常见的应答为数字,用于错误和正常应答. 包括数字(3-digit-numeric)应答的消息 **必须** 包含发送人(sender)前缀,和应答目标. 数字应答不允许来自客户端,在其它方面, 数字应答就像正常的消息,只是关键字由3个数字组成.

#### Wildcard expressions

当字符串中允许使用通配符, 将被称为 "mask"

* `?` 匹配单个任意字符

* `*` 匹配0个或任意个的任意字符

### Message Details

下边的内容描述了IRC服务器及客户端认可的消息(message).

当收到应答为 `ERR_NOSUCHSERVER`,这意味着找不到消息目标,在之后服务器不必回复其它应答.

客户端连接到服务器需要解析完整的消息,并返回适当的错误.

如果提供了多个参数, 然后必须检测每个的有效性和适当的应答到客户端. 参数列表使用逗号作为分隔符, 必须为每一项作出应答.

#### Connection Registration

这里描述的命令是用于注册连接到IRC服务器以及作为用户以及正确断开的连接。

`PASS` 命令不是必须的,但它必须在 `NICK/USER` 命令之前执行. 一个建议的客户端登记顺序如下:

* Pass message

* Service message

* Nick message

* User message

##### Password message

这个命令用于设置"连接密码". 如果使用密码,那么必须在在 `NICK/USER` 命令之前使用.

* 命令: `PASS`

* 参数: `<password>`

* 应答: 

  - `ERR_NEEDMOREPARAMS`

  - `ERR_ALREADYREGISTRED`

* 示例: `PASS scretpasswordhere`

(个人注:这个密码不太同于我们常用的密码,需要用户名, 它有些类似于充值卡的冲值码,只要正确, 那么才允许连接.)

##### Nick message

设置或更改当前昵称.

* 命令: `NICK`

* 参数: `<nickname>`

* 应答:

  - `ERR_NONICKNAMEGIVEN`

  - `ERR_ERRONEUSNICKNAME`

  - `ERR_NICKNAMEINUSE`

  - `ERR_NICKCOLLISION`

  - `ERR_UNAVAILRESOURCE`

  - `ERR_RESTRICTED`

* 示例: `NICK Wiz`	; 尝试使用 Wiz 作为其昵称

* 应答示列: `:Wiz!jto@tolsun.oulu.fi NICK Kilroy`	; 服务器通知 Wiz 更改其名字已经更改为 Kilroy


##### User message

在开始连接时,指定 username(用户名,注册了连接服务器的用户名,用户名可以有多个昵称),hostname(主机名),realname(真实姓名).

* 命令: `USER`

* 参数: `<user> <mode> <unused> <realname>`

  - `<mode>` 参数应该为数字, 可用于自动设置用户模式当向服务器登记时.这个参数为bitmask(位掩码),并仅有2位有其含义: 如果 bit2为1,将为 "w"模式, 如果bit3为1, 则为 "i"模式. 参见 [User mode message](#User_mode_message)

  - `<unused>` 未知, 无文档

  - `<realname>` 可以包含空格字符

* 应答: 

  - `ERR_NEEDMOREPARAMS`

  - `ERR_ALREADYREGISTRED`

* 示例: 注意最后一个参数 `:Ronnie Reagan` 包含了空格

  - `USER guest 0 * :Ronnie Reagan` ; 用户登入

  - `USER guest 8 * :Ronnie Reagan` ;


##### Oper message

普通用户使用此命令获得管理员权限.

* 命令: `OPER`

* 参数: `<name> <password>`

* 应答:

  - `ERR_NEEDMOREPARAMS`

  - `RPL_YOUREOPER`

  - `ERR_NOOPERHOST`

  - `ERR_PASSWDMISMATCH`

* 示例: `OPER foo bar`


##### User mode message

用户模式消息, 用户模式通常用于更改用户的状态, 如果仅有 nickname 参数,则只显示nickname的当前模式.

* 命令: `MODE`

* 参数: `<nickname> *( ( "+" / "-" ) *( "i" / "w" / "o" / "O" / "r" ) )`

  - `a` 用户是否为暂离, 这个标记不应该由用户通过 User MODE 设置,而应该使用 AWAY 命令

  - `i` 是否隐身, 当设为隐身时, 命令 /NAMES 和 /WHO 无法检索到你, 也就无法知道你的存在

  - `w` 是否接收管理员使用 `WALLOPS` 发的信息

  - `r` 限制用户,通常限制为不允许更改昵称, 用户尝试对自已使用 `-r` 将被忽略，这个标记通常由服务器设置. 大多服务器并不支持这个命令

  - `o` 管理员标记, 这个命令只用于 -o 取消管理员, 获得管理员权限通过 OPER 命令

  - `O` 局部管理员标记,限制同上

  - `s` 是否接受服务器通知. 这个标记已经过时,但可能仍然可以使用

* 应答: 

  - `ERR_NEEDMOREPARAMS`	`ERR_USERSDONTMATCH`

  - `ERR_UMODEUNKNOWNFLAG`	`RPL_UMODEIS`

* 示例:

```bash
MODE WiZ -w		;

MODE Angle +i	; 

Mode WiZ -o		; 移除 WiZ 的管理员
```


##### Service message

登入为新服务器.

* 命令: `SERVICE`

* 参数: `<nickname> <reserved> <distribution> <type> <reserved> <info>`

  - `<distribution>` 指定可见性.

  - `<tyle>` 作为保留以供将来使用

* 应答:

* 示例: `SERVICE dict * *.fr 0 0 :French Dictionary`

##### Quit

客户端终止会话.

* 命令: `Quit`

* 参数: `[Quit Message]`

* 示例: `QUIT :Gone to have lunch`

  - 服务器将广播: `:syrk!kalt@millennium.stealth.net QUIT :Gone to have lunch`

##### 未完成

其实知道消息的格式就可以了,不需要了解太多

<br />

BOT
------

nodejs 源码参考: https://github.com/gf3/IRC-js

<br />