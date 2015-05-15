---
layout: post
title:  加密货币开发
date:   2014-11-08 10:7:26
categories: other
---

比特币结合P2P对等网络技术和密码学原理，来维持发行系统的安全可靠性。与有中心服务器的中央网络系统不同，在P2P网络中无中心服务器，每个用户端既是一个节点，也有服务器的功能，任何一个节点都无法直接找到其他节点,必须依靠其户群进行信息交流。

每个帐户其实就是一对公私匙，有私匙的人就是帐户的主人。如果 A 要给 B 转一笔钱，A 就把钱的数量加上 B 的公匙，用自己的钥匙(TODO: 公还是私,还是二个都?)签名。而 B 看到这个签名，就可以了解，的确是 A 转给了他如数的 BTC http://8btc.com/article-12-1.html

<!-- more -->

专有名词 http://www.8btc.com/development-guide

#### 比特币地址和私钥是怎样生成的

原文引用: http://8btc.com/article-135-1.html

比特币使用 椭圆曲线算法 生成 **公钥** 和 **私钥** ，选择的是 secp256k1 曲线。生成的公钥是 33字节 的大数，私钥是 32字节 的大数，钱包文件 wallet.dat 中直接保存了公钥和私钥。在接收或发送比特币时用到的 地址(address) 是 公钥 经过算法处理后得到的，具体过程是 公钥 先经过 SHA-256 处理得到32字节的哈希值，再经 RIPEMED 处理后得到20字节值，再经过字符转换过程得到我们看到的地址。这个字符转换过程与私钥的字符转换过程完成相同，步骤是先把输入的内容（对于公钥就是20字节的摘要结果，对于私钥就是32字节的大数）增加版本号，经过连续两次SHA-256算法，取后一次哈希结果的前4字节作为校验码附在输入内容的后面，然后再经过Base58编码，得到字符串

![btc-gen-key](/assets/img/btc-gen-key.png)


### HxBitcoin

https://github.com/cbatson/hxBitcoin 的 readme 文件内容.

 * [BIP0038(encrypted private keys)](https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki) 私钥格式的一种. 为了实现纸钱包
	
	> 用于加密私钥(private key), 被加密的私钥不需要密码就可以算出 地址(address)
	> 因此没有密码也可以查询余额, 加密后长度不变, 加密和解密非常慢

 * WIF 私钥格式的一种,5开头51位Base58, 可以直接导入各种客户端

	> WIFC 可导入钱包的私钥-压缩，K或L开头52位Base58，导入客户端后，通常会生成该私钥对应的压缩地址
	
	> 其它私钥格式 HEX, B64, B6, MINI ......

 * Convert private keys to public keys & addresses

	> 比特币使用 椭圆曲线算法(scrypt) 生成公钥和私钥, 

 * [Base58](http://zh.wikipedia.org/wiki/Base58) Bitcoin 中使用的一种独特的编码方式

	> 相对于Base64，Base58不使用数字"0"，字母大写"O"，字母大写"I"，和字母小写"l"，以及"+"和"/"符号
	
	> 没有标点符号,通常不会从中间分行, 大部分软件支持双击选择整个字符串
	
	> 由于256不能被58整除，Base58 无法象 Base64 那样转换为 8bits 的二进制后依次取出6bits就可以快速完成转换。因此，Base58编码算法需要除法运算实现，如果被编码的数据较长，则要用特殊的类来处理大数

#### Crypto

 * scrypt

 * AES

 * SHA-1, SHA-256, RIPEMD160

 * secp256k1 & NIST curves

#### Other

 * Modular arithmetic (Fp)

 * Arbitrary-size (big) integer

 * Unicode 7.0

 * Extensive test suite of over 22,000 individual tests and vectors

 * Pure Haxe implementation
  
 * No additional/external dependencies


Bitcoin Developer Guide
--------

原文链接 - https://bitcoin.org/en/developer-guide#block-chain-overview

开发指南目的在于提供一些需要理解的信息 Bitcoin 以及构建 Bitcoin-based 的应用程序. 但这并汪是一个规范. 为了更好的使用这个文档, 你可能想要安装当前版本的 Bitcoin-Core, 从源码或预编译的可执行文件.

对于 Bitcoin 的开发 **疑问** 最好的询问对象是 Bitcoin 开发社区. Bitcoin.org 文档的错误或建议可以提交到 bitcoin-documentation 邮件列表.


### Block Chain

块链提供了比特币的公共账单, 一个有序和时间戳的交易记录. 这个系统用于避免双重支付和修改历史交易记录.

Bitcoin 网络的所有节点由各节点独立存储块链,块链只包含"有效块", 当一些节点拥有一样的块在它们的块链中, 则它们被认为保持一致。 验证规则这些节点遵守维护保持一致被称为 一致性规则(consensus rules). 这一节描述了许多”一致性规则“的使用在 Bitcoin Core 中.

#### Block Chain Overview

![blockchain-overview](/assets/img/bitcoin/en-blockchain-overview.svg)

上图显示了一个简化版的块链, 一个或多个新交易组成为 块(block) 的交易数据(transaction data)段. 每个交易副本将被 哈希(hash), 然后配对, 然后再次hash和配对. 重复hash,配对直到剩下一个哈希值, the merkle root of a merkle tree [白话 merkle tree 中文](http://www.jianshu.com/p/458e5890662f)

merkle root 储存在block头, 同样每个block header 还存储前一个block header 的哈希值,以链接起这些block. 这确保了交易不能进行修改,而无需修改记录它的block和后续block。

交易(Transactions) 同样被链接在一起, 比特币钱包给人的印象是"聪"的发送和接收是从钱包到钱包, 但真实情况是从"交易"支出及接收到"交易". 每个"交易"花费的"聪"来自上一个或更早的"交易", 所以一个"交易"的接收将是上一个"交易"的支出. (注:这里的"交易"是个名词)

![blockchain-overview](/assets/img/bitcoin/en-transaction-propagation.svg)

当发送给多个地址([addresses])时.单一"交易"能创建多个发送(或称为:支出). 但是"交易"(particular transaction)的每个支出在块链中只能被接收一次, 任何后续的引用都被禁止的双花(double spend)- 尝试花费掉二次相同的"聪"

发送将绑定交易标识符(TXIDs),将是交易签名hash.

因为"交易"的每个支出只能被花费一次, 所有交易的发送包含在块链可以被归类为"未花费的交易支出(UTXOs)"和"已花费交易支出"二者之一. 为使支付有效,必须使用 UTXOs 用于接收(就是只能接收 UTXOs). 

先忽略掉 [coinbase transactions(稍后说明)], 如果交易支出(outputs)的值超过其接收(inputs), 交易将被拒绝, 但是如果接收大于支出, 任意差价将被称为[transaction fee],由矿工将交易添加入block. 例如: 在上边图示中每个交易花费 10K聪 要少于其本身接收到总合, 有效地支付了10K聪交易费(Transaction Fee).



 * satoshi: 聪; 比特币的最小面值, 1 bitcoin 等于 100,000,000 satoshis.

 * coinbase/generation transactions 块中的第一个交易,总是由矿工创建, 它包一个单独 [coinbase]
	
 * coinbase: 一个特殊字段作为 coinbase transactions 的唯一接收(input), coinbase 可以声明 block 奖励并提供 100bytes的任意数据

	> 注意这里的 coinbase 不是指的交易网站
	
 * Transaction Fee 或称为 Miner Fee

	> 所有剩余的钱,当全部收入交易扣除全部支出交易, 该费用交付给将交易添加到 block 的矿工
	
	> 注意区别 Minimum relay fee(最低中转费): 最低费用交易必须被接入到 内存池通过 Bitcoin Core 节点中转

#### Proof Of Work

块链由网络匿名节点共同协作维护, 所以比特币要求每一个block证明创建其的显著的工作量投入,以确保其它想要修改历史block的不受信任的点的工作难度要大于想要添加新block到块链的诚实点.

将块连接在一起使得它不可能修改交易包含在任意block 而无需修改后续block. 其结果是想要修改某一特定block的工作量代价随着每个新block添加到块，而随之放大.

比特币的工作量证明利用了明显随机性质加密哈希, 一个好的哈希加密算法将任意数据转换为看上去随机的数字. 如果以任意方式修改数据和重新运行散列函数, 将产生新随机数, 所以没有办法修改数据而使哈希值具有可预测性.

为了证明你做了一些额外的工作来创建一个block, 你必须创建block header的不超过某一值的哈希. 例如: 如果最大可能的哈希值为 pow(2,256) - 1, 则可以证明你试图最多两个组合产生的哈希值小于 pow(2,255)

在上面给出的示例中, 你可能在第一次尝试中就产生出成功的哈希值,你甚至可以预计一个给定目标阈值的哈希的尝试次数, 比特币假定一个线性概率, 它使目标阈值越低, 则需要更多次哈希尝试.

添加到块链的new block的哈希值的预期难度需要和设计协议保持一致, 每2016个block, 网络使用储存在每个block header的时间戳, 来计算第一个到最后一个所花费的秒数, 理想的值是 1,209,600 秒(二周)

 * 如果2016个块的花费时间少于 2周, 预期的难度值将按比例上调(可高达300%), 以使下一次的2016个块正好在二周完成.


 * 同样如果花时间超出二周, 预期的难度值将按比例下调(高达75%).

(注: 在比特币核心实现的一次错误(off-by-one error)导致每次2016个块难度调整所使用的时间戳来自第2015个块,创建一个轻微的倾斜)

由于每个block header的哈希值必须小于某个阈值，每个block也必须链接到它前面的一个block。要在原始区块生成到当前这段时间里传送一个已修改的block，（一般来说）需要消耗和整个比特币网络消耗的算力一样多的哈希算力。只有你掌握了全网大多数哈希算力，你才能有效地实现对交易历史进行51%的攻击。(尽管应该注意的是: 即使不到 50%的哈希算力仍然具有进行这种攻击的很好机会)

block header 提供了一些容易改的字段，例如专用的nonce字段，因此获取新哈希不需要等待新的"交易". 此外,只有80字节的block header将被hashed用于POW(proof-of-work)，因此添加更多的交易数据并不会减慢伴有额外I／O的哈希计算速度. 而且添加附属交易数据仅需要重新计算旧的哈希在 merkle tree 中


#### Block Height And Forking

#### Transaction Data

#### Consensus Rule Changes

##### Detecting Forks

### Transactions

#### P2PKH Script Validation 