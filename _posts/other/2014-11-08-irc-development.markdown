---
layout: post
title:  IRC 客户端聊天室
date:   2014-11-08 08:22:11
categories: other
---


由于国内使用 irc 客户端的很少, 而 webchat.freenode.com 又引用了 google 的文件，国内因被墙而打不开,尝试使用 haxe 写一个客户端, 桌面端用 flash, 基它 html5, 服务器连接选择 IRC://irc.freenode.net, 

客户端选择:  http://zh.wikipedia.org/wiki/Wikipedia:IRC%E8%81%8A%E5%A4%A9%E9%A2%91%E9%81%93 

<br />

<!-- more -->

### 相关参考

flash 客户端源码参考: https://github.com/unic0rn/tiramisu

freenode 参考: http://freenode.net/faq.shtml#whatwhy 



### 用户注册

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

### 基本命令






<br />

机器人
------

需要有几个不同行为的 bot, 但是它们都继承于一个最基本的 socket irc 客户端.

 * 普通的字符处理, 命令以 !开头, 支持 中英双语.

 * 最后是难度最大的是 虚拟币钱包,

  - roll 点比大小游戏.

  - 撒 coin, 对活跃的人群.