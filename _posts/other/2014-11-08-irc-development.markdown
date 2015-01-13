---
layout: post
title:  IRC 客户端开发
date:   2014-11-08 08:22:11
categories: other
---


由于国内使用 irc 客户端的很少, 而 webchat.freenode.com 又引用了 google 的文件，国内因被墙而打不开,尝试使用 haxe 写一个客户端, 桌面端用 flash, 基它 html5, 服务器连接选择 IRC://irc.freenode.net, 

客户端选择及所有 IRC 相关:  http://www.irc-wiki.org/Main_Page

<br />

<!-- more -->

### 相关参考

https://github.com/gf3/IRC-js

flash 客户端源码参考: https://github.com/unic0rn/tiramisu

freenode 参考: http://freenode.net/faq.shtml#whatwhy

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
				
```

<br />

### 用户注册

不同的 IRC 服务器的注册是不一样的, 这里及后边所有内容如果没有说明则都是针对 **freenode**.

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

     1. [频道管理者(Channel Operators)](频道管理者(channel-operators))
	
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
 

##### 频道管理者(Channel Operators)

频道管理者(同样被称为 "chop" 或 "chanop")
<br />