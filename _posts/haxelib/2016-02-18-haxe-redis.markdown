---

layout: post
title:  redis
date:   2016-02-18 07:27:19
categories: haxelib

---

* [haxe-redis](https://github.com/motion-twin/haxe-redis) 其实这篇应该放在 **其它** 里的,

* [tora(motion-twin fork)](https://github.com/motion-twin/tora) 集成 SSL, WebSocket, redis

* [hxssl](https://github.com/tong/hxssl)
  - [OpenSSL 方法的中文说明](http://www.360doc.com/content/14/0807/16/16044571_400128259.shtml)

  > 注: 请注意参考 `src/hxssl_ssl.cpp` 中的方法, 如果感觉参数冲突

<!-- more -->

### Intro

* 编译, 从 github 下载 win32版的自已编译(官方只提供64位版本,使用 vs2013社区版)

* [resis 官方文档](http://redis.io/topics/data-types-intro) 由于中文的不全

redis 并不只是简单的 key-value 存储,实际应该为"数据结构服务器", 支持各种不同的值。

* binary-safe string, 即不会因为某个字符(如:'\0')而打断字符串

* Lists: 按插入的顺序先后排序的字符串集合.

  ```bash
  # 基本操作
  RPUSH/LPUSH   <KEY> <value>
  RPOP/LPOP     <KEY>
  RPUSHX/LPUSHX <KEY> <value>  # 插入 value 到 list， 如果 list 为空列表, 则什么也不做.
  LINSERT <KEY> <BEFORE|AFTER> <pivot> <value> # 将 value 插入到 pivot 前/后, 返回 list 长度.
  RPOPLPUSH <src> <dst>    # 原子性. 将 src 中最后一个元素移至 dst 中的第一个, src 可等于 dst
  LRANGE <KEY> <start> <end>   # 显示指定范围, 第一个为0, 最后一个为 -1
  LTRIM  <KEY> <start> <end>   # 同上, 但是任何这个 **范围外** 的将会被移除, 
  LREM   <KEY> <count> <value> # 删除指定数量的值, 如果 count 为负数则从最后往前删除(从右往左)
                               # 如果 count 为 0 则删除**所有**匹配的值
  							
  # http://redis.io/commands/blpop							
  # 可阻塞,类似于 haxe 中的 deque , 对于多个 KEY 值只要第一个(前边的)KEY中有值将会立即返回,而忽略后边的KEY
  # 如果运行在 MULTI/EXEC 之中则将不会有阻塞效果.
  BRPOP/BLPOP <KEY> [KEY...] <delay_sec>  # 从右/左弹出元素, 如果 List 为空则阻塞至 delay 后
  
  # 上述二个命令当客户端从List获得一个值时, 值将不存在于 server 上, 因此下边命令可以防止值丢失的问题
  BRPOPLPUSH  <src> <dst> <delay_sec>     # 阻塞形的 RPOPLPUSH, 如果用于 MULTI/EXEC 将不会有阻塞效果。
  ```

* Sets: 唯一性字符串集合, 未排序(即不能通过下标量随机访问)

  感觉这个像是 StringMap<Bool> 类型的值, 只是不用指定其值

* Sorted sets, 和 Sets 相似,但是每个字符串元素按其关联的 floating 数值排序

  由于其排序性, 因此得到 top 10, 或者 bottom 10, 

* Hashes, 用于在一个 KEY 中存储多个 KEY/VALUE 值

  > `hset NAME:INT KEY VALUE [KEY VALUE] ......`

* Bit arrays

* HyperLoglogs: 

### Config

客端可以通过 `config get NAME` 来查询配置, `config get *` 则将打印出所有。

```bash
# server start
c:\Program Files\redis>redis-server --maxmemory 32m

# cli query
127.0.0.1:6379> config get maxmemory
```

### command

KEY 通常意未着一个变量名称.

* `set <KEY> <VALUE>` 设置单个K/V值, NOTE: set 将会覆盖替换已经存在了的的KEY,

* `incr <KEY>` 解析对应的字符串值为整形并且使这个值自增+1, 这个值会更改存储而不仅是简单返回

  - `incrby <KEY> <Int>`, decr(减) decrby

  > 并且这种操作是atomic, 即不会出现二个客户端同时获得一个相同的值或者 incr 相同一个变量
  >
  > [set 的 全部可选(Optional)参数](http://redis.io/commands/set)

  ```bash
  # 当 KEY 存在时 set 将失效
  127.0.0.1:6379> set mykey newval nx
  (nil)
  
  # 当 KEY 不存在时 set 将失效
  127.0.0.1:6379> set mykey newval xx
  (newval)
  
  # 一些其它命令, exists, del,
  127.0.0.1:6379> exists mykey
  (interger) 1
  
  127.0.0.1:6379> type mykey    #检测KEY类型, 即使可以 incr 它也是 string 类型的
  string
  
  127.0.0.1:6379> del mykey
  (interger) 1

  127.0.0.1:6379> exists mykey  # 如果不存在或空值都将返回 0
  (interger) 0
  
  127.0.0.1:6379> type mykey
  none
  ```

* `expire <KEY> <SEC_INT>` 设置 KEY 的到期时间,将会被自动 DEL， `pexpire` 则是以微秒为单位

  > 实际上 redis 服务器在配置那里设置最大内存尺寸更优于这个
	
  ```bash
  127.0.0.1:6379> set key ex 10	# 直接通过 ex 附加 expire
  OK
  127.0.0.1:6379> ttl key       # ttl 检测到期时间, 或者 pttl 将以微秒
  (integer) 9                   # ttl 返回 -1 则表示这个KEY没有到期时间, 
                                # 返回 -2 则表示已经到期了(不存在也返回-2)
  ```

* `getset <KEY> <VALUE>` 和一样设置值, 但是返回旧的那个值

* `mset <KEY> <VALUE> <KEY> <VALUE> ...` 同时设置多个K/V值


### Misc


<br />

