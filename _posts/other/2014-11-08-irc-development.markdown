---
layout: post
title:  IRC 客户端开发
date:   2014-11-08 08:22:11
categories: other
---


由于国内使用 irc 客户端的很少, 而 webchat.freenode.com 又引用了 google 的文件，国内因被墙而打不开,尝试使用 haxe 写一个客户端, 桌面端用 flash, 基它 html5, 服务器连接选择 freenode

<br />

<!-- more -->

客户端选择及所有 IRC 相关:  http://www.irc-wiki.org/Main_Page

 * 桌面端

  - mIRC 收费

  - HexChat Win7/8,Linux, OS X, Github 开放源码, hexchat.github.io 看上去不错, 但未使用过.

  - nettalk 感觉还行.

 * android 手机端从用户列表中选择一个 nickname 都不太方便,

  - Yaaic github 开放源码, 界面好看, 能自动加入频道,验证密码, 

  - AndroIRC 每次输入时都会将输入自动改成 Abc, 


### 源码参考


**Start 2404** Web IRC client: http://shout-irc.com/  

**Start 156** The best IRC library for node.js https://github.com/gf3/IRC-js 

**Start 1873** 基于 node-webkit 的应用 https://github.com/slate/slate 

flash 客户端源码参考: https://github.com/unic0rn/tiramisu


### 基本命令

一些基础概念, 细节请参看 RFC 1459

 * IRC 服务器: IRC 不属于任何一个公司, 任何人都可以运行 IRC 服务器, 但是你应该选择大家常用服务器比如: freenode

 * IRC 客户端: 用户选择用于 IRC 聊天的 APP(应用或软件).

 * 提到: IRC 聊天室中, 当谈话内容中包含了你的 nickname, 这时 IRC客户端会发出一些提示, 就像 其它常见聊天中的 `@nickname`

 * 密语: 以 `/msg nickname message` 时,称为 "密语", 这时接收信息的人的IRC客户端通常会打开一个新窗口用于私聊

命令以 斜线 `/` 开始, 后接英文字符, 忽略大小写. http://en.wikipedia.org/wiki/List_of_Internet_Relay_Chat_commands, 

注: 不同客户端有不各自不一样的命令,但是基本都遵循 RFC 1495, 以及最流行的 IRC 客户端 mIRC(收费软件).

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
										# 如果 频道模式(channel mode)为 i, 只有 频道管理者(channel operators)才可以
										# 由 RFC 1459 定义
										
ISON <nicknames>						# is on, 查询服务器 nicknames(用空格分隔的呢称列表) 是否在线, 并返回在线的 nicknames(同样是用空格分隔)
										# 例: /ison AAA BBB CCC, 如果 BBB 不在线,那么只返回 AAA CCC, rfc1459
						
JOIN <channels> [<keys>]				# 加入到指定 <channels>(用逗号分隔频道的列表), <keys> 为频道密码(同样用逗号分隔，  如果频道有指定密码)
										# 如果 频道<channel> 不存在, 将会被创建. rfc1459
										
KICK <channel> <client> [<message>]		# 将 nick (<client>) 踢出频道(<channel>), 可选的踢出原因(<message>) 仅频道管理者可用, RFC 1459

KILL <client> <comment>					# 从网络上移除 <client>, 仅 IRC 管理者(IRC服务器管理员)可用. rfc1459.

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
										# 返回的列表中的呢称包含前缀,前缀为由其所在频道身份属性. (@ 为频道管理者, + 为lower voice)
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

### freenode

[freenode](http://www.freenode.com/) 是大多数人使用的服务器,除了这个其它服务器都基本没人.

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

[可选] 


机器人
------

nodejs 源码参考: https://github.com/gf3/IRC-js

需要有几个不同行为的 bot, 但是它们都继承于一个最基本的 socket irc 客户端.

 * 普通的字符处理, 命令以 `!` 开头, 支持 中英双语.

 * 后台连接可能, 允许通过例如 active 切换到自动,

 * 使用 工具配置 !命令,而不是在代码中写

 * 最后是难度最大的是 虚拟币钱包,

  - roll 点比大小游戏.

  - 撒 coin, 对活跃的人群.



<br />

<br />

RFC 1459
------

[RFC 1459 - Internet Relay Chat Protocol](http://tools.ietf.org/html/rfc1459#section-1.2)

#### 状态（Status of This Memo）

这份备忘定义了一个试验性的协议用于互联网社区, 需要讨论和建议来完善, 请参阅 "IAB 官方协议标准" 以标准化本协议的状态及地位, 这份备忘的分发是无限的.

#### 概要(Abstract)

从第一次用于 BBS 上用户相互聊天, IRC 协议开发已经过去 4 年. 现在它支持全世界网络的服务器和客户端, 并且线性增长, 在过去的 2年中, 连接到主 IRC 网络的用户增长了 10 倍.

IRC 协议是一个基于文本的协议，以及能够连接到服务器的最简单的 socket客户端.

#### 内容

 1. [前言(INTRODUCTION)](#前言(introduction))

  1. [服务器(Servers)](#服务器(servers))

  2. [客户端(Clients)](#客户端(clients))

     1. [管理者(Operators)](#管理者(operators))

  3. [频道(Channels)](#频道(channels))

     1. [频道管理者(Channel Operators)](#频道管理者(channel-operators))
	
 2. IRC 规范(THE IRC SPECIFICATION)

  1. 概览(Overview)

  2. 字符代码(Character codes)

  3. 消息(Message)

     1. 消息格式(Message format in ’pseudo’ BNF)

  4. 数字回复(Numeric replies)

 3. IRC 概念(IRC Concepts)

  1. 一对一交流(One to one communication)

  2. 一对多(One-to-many)

     1. 列表(To a list)
	 
	 2. 组(频道)(To a group (channel))
	
	 3. 主机/服务器(To a host/server mask)
	
  3. 一对所有(One to all)

     1. 客户端对客户端(Client to Client)
	
	 2. 客户端对服务器(Clients to Server)
	
	 3. 服务器对服务器(Server to Server)

 4. 消息细节(MESSAGE DETAILS)

  1. 连接注册(Connection Registration)

     1. 密码消息(Password message)

     2. 呢称消息(Nickname message)

     3. 用户消息(User message) 
	
	 4. 服务器消息(Server message)
	
	 5. 管理者消息(Operator message)
	
	 6. 退出消息(Quit message)
	
	 7. 服务器退出消息(Server Quit message)

  2. 频道操作(Channel operations)

     1. 加入消息(Join message)
	
	 2. 离开消息(Part message)
	
	 3. 模式消息(Mode message)
	
	     1. 频道模式
	
	     2. 用户模式
		
	 4. 主题消息(Topic message)
	
	 5. 名字消息(Names message)
	
	 6. 列表消息(List message)
	
	 7. 邀请消息(Invite message)
	
	 8. 踢人消息(Kick message)
	
  3. 服务器查询及命令(Server queries and commands)

     1. 版本消息(Version message)
	
	 2. 状态消息(Stats message)
	
	 3. 链接消息(Links message)
	
	 4. 时间消息(Time message)
	
	 5. 连接消息(Connect message)
	
	 6. 调试消息(Trace message)
	
	 7. 管理员消息(Admin message)
	
	 8. 资讯消息(Info message)

  4. 发送消息(Sending messages)

     1. 私密消息(Private messages)
	
	 2. 通知消息(Notice messages)
	
  5. 使用者查询(User-based queries)

     1. Who query
	
	 2. Whois query
	
	 3. Whowas message

  6. 其它消息(Miscellaneous messages)

     1. 结束消息(Kill message)
	
	 2. Ping message
	
	 3. Pong message
	
	 4. 错误消息(Error message)
	
 5. 可选消息

  1. 暂离消息(Away message)

  2. 重发命令(Rehash command)

  3. 重启命令(Restart command)

  4. 唤起消息(Summon message)

  5. 使用者消息(Users message)

  6. Operwall command

  7. Userhost message

  8. Ison message

 6. 回复(REPLIES)

  1. 错误回复(Error Replies)

  2. 命令响应(Command responses)

  3. 保留数字(Reserved numerics)

 7. 客户端和服务器验证(Client and server authentication)

 8. 当前实现细节(Current Implementations Details)

  1. 网络协议: TCP(Network protocol: TCP)

     1. Unix Sockets 支持(Support of Unix sockets)
	
  2. 命令解析(Command Parsing)

  3. 消息传送(Message delivery)

  4. 接通活跃度(Connection 'Liveness')

  5. Establishing a server-client connection

  6. Establishing a server-server connection

     1. State information exchange when connecting
	
  7. Terminating server-client connections

  8. Terminating server-server connections

  9. 跟踪呢称改变(Tracking nickname changes)

  10. 防洪客户端控制(Flood control of clients)

  11. 非阻塞查找(Non-blocking lookups)

     1. 主机名(DNS)查找(Hostname (DNS) lookups)
	
	 2. 用户名(标识)查找(Username (Ident) lookups)
	
  12. 配置文件(Configuration file)

     1. 允许客户端连接(Allowing clients to connect)
	
	 2. 管理者(Operators)
	
	 3. 允许服务器连接(Allowing servers to connect)
	
	 4. 管理资讯(Administrivia)
	
  13. 频道成员资格(Channel membership)

 9. 当前问题(Current problems)

  1. 可扩展性(Scalability)

  2. 标签(Labels)

     1. 呢称(Nicknames)
	
	 2. 频道(Channels)
	
	 3. 服务器(Servers)
	
  3. 算法(Algorithms)

 10. 支持及有效性(Support and availability)

 11. 安全注意事项(Security Considerations)

 12. 作者地址(Authors’ Addresse)

### 前言(INTRODUCTION)

过去数年中设计的 IRC 协议用于文本交流,本文档描述了当前的 IRC 协议. IRC 协议使用了 `TCP/IP` 网络协议, IRC 自身是一个电话会议系统(通过使用客户端-服务器模型) 适合分布于许多机器上, 典型的设置为 一个单独的进程(服务器) 形成客户端(或其他服务器)的中心点，执行必需的消息传递与复用和其他功能.

#### 服务器(Servers)

服务器构成IRC 的主干, 提供一个连接点用于客户端之间通信。 连接点同样可用于其它 IRC服务器, 这样的网络配置使得 IRC 服务器群看上像树(见 Fig. 1), 每一个服务器都可作为中心节点.

```
                           [ Server 15 ]  [ Server 13 ] [ Server 14]
                                 /                \         /
                                /                  \       /
        [ Server 11 ] ------ [ Server 1 ]       [ Server 12]
                              /        \          /
                             /          \        /
                  [ Server 2 ]          [ Server 3 ]
                    /       \                      \
                   /         \                      \
           [ Server 4 ]    [ Server 5 ]         [ Server 6 ]
            /    |    \                           /
           /     |     \                         /
          /      |      \____                   /
         /       |           \                 /
 [ Server 7 ] [ Server 8 ] [ Server 9 ]   [ Server 10 ]

                                  :
                               [ etc. ]
                                  :

                 [ Fig. 1. Format of IRC server network ]
```

#### 客户端(Clients)

客户端是任何连接到服务器的终端(非服务器), 每一个客户端通过 唯一的呢称(unique nickname) 有别于其它客户端,呢称最大为 9个字符, 请参看协议规则 哪些字符可用哪些字符不可用. 除了呢称, 所有服务器必须获得下列的客户端信息: 

 1. 真实姓名(the **real name** of the host that the client is running on).

 2. 用户名 - 客户端连接到服务器上的用户名(the **username** of the client on that host, and the server to which the client is connected) 注: 因为一个用户名可以有多个呢称.

##### 管理者(Operators)

允许合理数量管理者用于维护 IRC 网络秩序, 一个特别的客户端(管理者)允许执行一般的维护功能, 虽然向管理者授予权力被视为 危险, 管理者能够执行基本的网络任务,如 断开并重新连接服务器以防止网络被不良长期占用。 认识到这一点,这里讨论的协议规定 管理者只能够执行此类功能.  See sections 4.1.7 (SQUIT) and 4.3.5 (CONNECT).

管理者更多容易引起争议的能力是强制移除用户, 即 管理者能够关闭任何客户端到服务器之间的连接. 如果滥用将是破坏性,另人讨厌的. 详细 see section 4.6.1 (KILL)

#### 频道(Channels)
 
频道是一个有名字的群组, 用于多个客户端之间的交流. 就像 QQ 群.

频道由第一个进入的客户端自动建立, 当最后一个客户端离开时, 频道将不存在. 当频道存在时, 任意客户端都可以能过频道名称引用这个频道.

频道名称由字符串组成(以 `&` 或 `#` 字符开始)最多 200个字符, 除了要求第一个字符为 `&` 或 `#`, 唯一的要求是不能包含有空格(`0x20`),控制字符(`ASCII 7`)以及 逗号(`,` 逗号根据协议将被用作于分隔符).

协议允许二种类型频道:

  * 一个为 分布式频道, 将所有服务器连接到网络

  * 

##### 频道管理者(Channel Operators)

频道管理者(同样被称为 "chop" 或 "chanop")
<br />