---
layout: post
title:  比特币
date:   2014-11-08 10:7:26
categories: other
---

比特币结合P2P对等网络技术和密码学原理，来维持发行系统的安全可靠性。与有中心服务器的中央网络系统不同，在P2P网络中无中心服务器，每个用户端既是一个节点，也有服务器的功能，任何一个节点都无法直接找到其他节点,必须依靠其户群进行信息交流。

<!-- more -->


### HxBitcoin

<https://github.com/cbatson/hxBitcoin> 的 readme 文件内容.

* [BIP0038(encrypted private keys)](https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki) 私钥格式的一种. 为了实现纸钱包

  > 用于加密私钥(private key), 被加密的私钥不需要密码就可以算出 地址(address)
  >
  > 因此没有密码也可以查询余额, 加密后长度不变, 加密和解密非常慢

* WIF 私钥格式的一种,5开头51位Base58, 可以直接导入各种客户端

  > WIFC 可导入钱包的私钥-压缩，K或L开头52位Base58，导入客户端后，通常会生成该私钥对应的压缩地址
  >
  > 其它私钥格式 HEX, B64, B6, MINI ......

* Convert private keys to public keys & addresses

  > 比特币使用 椭圆曲线算法(scrypt) 生成公钥和私钥,

* [Base58](http://zh.wikipedia.org/wiki/Base58) Bitcoin 中使用的一种独特的编码方式

  > 相对于Base64，Base58不使用数字"0"，字母大写"O"，字母大写"I"，和字母小写"l"，以及"+"和"/"符号
  >
  > 没有标点符号,通常不会从中间分行, 大部分软件支持双击选择整个字符串
  >
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

[原文链接](https://bitcoin.org/en/developer-guide#block-chain-overview), (注:下边图片是SVG格式,你需要一个支持的浏览器)

开发指南目的在于提供一些需要理解的信息 Bitcoin 以及构建 Bitcoin-based 的应用程序. 但这并是一个规范. 为了更好的使用这个文档, 你可能想要安装当前版本的 Bitcoin-Core, 从源码或预编译的可执行文件.

对于 Bitcoin 的开发 **疑问** 最好的询问对象是 Bitcoin 开发社区. Bitcoin.org 文档的错误或建议可以提交到 bitcoin-documentation 邮件列表.


### Block Chain

“区块链”(block chain)提供了比特币的公共账单：一个顺序的并带有时间戳的交易记录。 这个系统用于避免双花支付(double spending)和交易历史修改。

比特币网络中的各个“全节点”(full node)各自包含其独立的"区块链"（仅包含该节点验证过了的区块）。 当多个节点具有相同的"区块"时 它们被认为是“一致的”(consensus)。这些节点用来维持一致性的验证规则被称作一致性规则（consensus rules）。

#### Block Chain Overview

![blockchain-overview](/assets/img/bitcoin/en-blockchain-overview.svg)


上图显示了一个简化版的块链, 每个块(block)由 块头(block header)和交易数据(transaction data)组成. 一个或多个交易(transactions)组成为块的交易数据部分. 每个交易副本将被哈希(hash) 然后配对,然后再次哈希和配对. 重复哈希,配对直到只剩下一个哈希值, 就是merkle tree的merkle root. [白话 merkle tree 中文](http://www.jianshu.com/p/458e5890662f)

merkle root 储存在块头(block header), 同样每个块头还存储着上一个块头的哈希值,以链接起这些块. 这确保了交易不能进行修改,而无需修改记录交易数据的块和后续块。

交易(Transactions)同样被链接在一起, 比特币钱包给人的印象是"聪"的发送和收入是从钱包到钱包, 但真实情况是从"交易"支出(output)和收入(input). 每个"交易"花费的"聪"来自上一个或更早的"交易", 所以一个"交易"的接收将是上一个"交易"的支出. (注:这里的"交易"是个名词)

![blockchain-overview](/assets/img/bitcoin/en-transaction-propagation.svg)

当发送给多个地址([addresses])时.单一"交易"能创建多个发送(或称为:支出). 但是每个交易支出在块链中只能被接收一次, 其它任何后续的引用都被禁止,称为双花(double spend)- 尝试花费掉二次相同的"聪"

支出(outputs)将绑定交易标识符(TXIDs),它是一个单独交易的哈希值.

每个交易支出(output)只能被花费一次, 所有交易支出包含在块链中将被归类为"未花费的交易支出(UTXOs)"或"已花费交易支出"二者之一. 为使支付有效,必须使用UTXOs用于接收(input).

先忽略掉[coinbase transactions(稍后说明)], 如果交易支出值超过接收, 交易将被拒绝,但如果接收大于支出,任意差价将被称为[transaction fee],由矿工将交易添加入block. 例如: 在上边图示中每个交易花费10K satoshi要低于其本身收入总合, 因此有效地支付了10K satoshi.

* satoshi: 聪; 比特币的最小面值, 1 bitcoin 等于 100,000,000 satoshis.

* coinbase/generation transactions 块中的第一个交易,总是由矿工创建, 它包一个单独 [coinbase]

* coinbase: 一个特殊字段作为 coinbase transactions 的唯一接收(input), coinbase 可以声明 block 奖励并提供 100bytes的任意数据

  > 注意这里的 coinbase 不是指的交易网站

* transaction fee 或称为 miner fee,所有剩余的钱,当全部收入交易扣除全部支出交易, 该费用交付给将交易添加到block的矿工, 由矿工将余额返回给花费人.

  > 注意区别 Minimum relay fee(最低中转费): 最低费用交易必须被接入到 内存池通过 Bitcoin Core 节点中转

#### Proof Of Work

块链由网络匿名节点共同协作维护, 所以比特币要求创建的每一个块证明其工作量投入,以确保不受信任的支点想要修改历史的工作难度要大于添加新块到块链的诚实点.

将块连接在一起使得交易不能被修改,并且无需修改后续block. 其结果是想要修改某一特定块的工作量代价随着每个新块添加到块链而随之放大.

比特币的工作量证明利用了明显随机性质加密哈希, 一个好的哈希加密算法将任意数据转换为看上去随机的数字. 如果以任意方式修改数据和重新运行散列函数, 将产生新随机数, 所以没有办法修改数据而使哈希值具有可预测性.

为了证明你做了一些额外的工作来创建一个块, 你需要创建一个不超过某一值的块头(block header)的哈希值. 例如: 如果最大可能的哈希值为pow(2,256)-1, 你需要证明你尝试到二次组合所产生的哈希值将小于pow(2,255).

在上面给出的示例中, 在平均的每次尝试中你将成功计算出哈希值,你甚至可以预测一个给定目标阈值的哈希的尝试次数,比特币假定一个线性概率,目标阈值越低,则需要更多次哈希计算尝试.

添加到块链的块的哈希值的预期难度需要和设计协议保持一致,每一2016个块,比特币网络使用储存在每个块头(block header)的时间戳, 来计算第一个到最后一个所花费的秒数, 理想的值是 1,209,600 秒(二周)

* 如果2016个块的花费时间少于 2周, 预期的难度值将按比例上调(可高达300%), 以使下一次的2016个块正好在二周完成.


* 同样如果花时间超出二周, 预期的难度值将按比例下调(高达75%).

(注: 在比特币核心实现的一次错误(off-by-one error)导致每次2016个块难度调整所使用的时间戳来自第2015个块,创建一个轻微的倾斜)

因为每个block header的哈希值必须低于目标阈值，每个块(block)链接(link)到它之前的块,繁殖一个已修改的块和整个比特币网络从已经创建的原块(对应前边已修改的块)到目前的消耗 需要(平均)同等的哈希算力.只有当你掌握了全网大多数哈希算力，你才能有效地实现对交易历史进行51%的攻击。(尽管应该注意的是: 即使不到 50%的哈希算力仍然具有进行这种攻击的很好机会)

block header提供了几个易于修改的字段, 如专用的一次性字段(dedicated nonce field), 因此获得新哈希不需要等待新交易.(TODO: 好像因果关系联不上???) 此外,仅80字节的block header的哈希值用于POW(proof-of-work)，因此添加更多的交易数据并不会减慢伴有额外I／O的哈希计算速度. 而且添加新的交易数据仅需要重新计算在merkle tree中上边的merkle node的哈希值.


#### Block Height And Forking

任何成功计算出block header哈希值的矿工可以将整个 block 添加到块链中(假设这个block是有效的),这些block的正常处理是通过block height(块高度)--(看上像是从1开始的数组索引), 例如: block2016是第一个难度调整块.

![btc-gen-key](/assets/img/bitcoin/en-blockchain-fork.svg)

multiple blocks(参照上图注意区别单个block)可以有相同高度, 通常是二个或多个矿工创建一个block的时间大致相同,这将导致明显的叉支, 如上图所示

当矿工同时在块链的末端创建block时, 每个节点各自选择哪个block将被接入, 在不考虑其它因素时,节点通常将选择第一个的它所看到的block.

最终将会有一个矿工的成功创建block要先于其它竞争者, 这使得这个叉支(fork)强于其它叉支,假设这叉支包含的是有效block, 正常的点(peers)总是选择难度最高的块链(即高度最大)建立随后的block,而丢弃短的旧叉支(stale blocks,有时候也称之为孤立叉支(orphan blocks),这个术语也用于一些没有parent的真正孤立叉支)

矿工之间的竞争冲突可能导致过长的叉支, 如在诚实的矿工创建block的同时其它竞争矿工利用51%攻击以试图修改交易历史.

由于 multiple blocks 可以有相同的高度在叉支期间,block height不应该作为全局唯一标识符,因此通常block的引用是通过其header的哈希值(通常与反转的字节顺序,并以16进制).

* genesis block 创世块 block0, Bitcoin 的第一个块 block height值为0

#### Transaction Data

每个block必须包含一个或多个交易, 交易数据的第一个交易必须是 coinbase transaction 也称为 generation transaction, 它收集和花费块奖励(block reward, 由 block subsidy + transactions fees 组成.)

coinbase transaction 的 UTXOs 有一个特别的条件要求至少100个block之后才可以花费, 因为叉支相互竞争, 在未确定加入到主链之前block上的UTXOs不可用.(TODO: 那么如果100个block之后还未分出胜负什么出现什么情况?)

block 可以不需要包含 non-coinbase transaction, 但是矿工总是收集会额外的交易中的 transaction fee.

所有"交易",包括coinbase transaction,都将以二进制rawtransaction格式编码加入到block.

将 rawtransaction 进行哈希计算以创建交易标识(transaction identifier(txid)), 根据这些txids,构造merkle tree.(多个txid将连接然后求哈希,而单txid则只是复制自身).

  > merkle tree 的创建参考 [Block Chain Overview](#Block_Chain_Overview) 段落的 白话 merkle

例如: 如果交易刚被加入(未求哈希), 那么5层交易 merkle tree 将看起来如下:

```
       ABCDEEEE .......Merkle root
      /        \
   ABCD        EEEE
  /    \      /
 AB    CD    EE .......E is paired with itself
/  \  /  \  /
A  B  C  D  E 	.........各交易(Transactions)
```

如简单支付验证(SPV)小节所述, merkle tree允许客户端为自已验证一个已经加入到了block的交易通过从block header获得merkle root.

例如: 如果需要验证交易D, SPV客户端仅需要C,AB,和EEEE的哈希值. 而不需要知道其它交易.  如果交易数据中的5个交易块都是最大尺寸, 那么下载这5个交易块需要 500,000字节,而下载 3 个哈希值仅需要 140字节.

Note: 如果在同一个数据块找到了相同的 txid, 这有可能出现在当 merkle tree 可能会与一些块不一致或由于平衡merkle tree中删除所有重复项的实现(重复的孤独哈希值). 因为它很难有相同txid的单独交易. 这不会造成诚实软件的负担, 但是必须检察如果这块的无效状态被缓存, 否则有效块与重复项消除可以具有相同的merkle root 和块哈希, 但是将被拒绝通过缓存了的无效结果, 导致安全漏洞如 CVE-2012-2459.(TODO:这段原文我也没看明白,似乎是程序Bug?)

* block reward 块奖励. 矿工成功创建block的奖励.等于 block subsidy + transactions fees

* block subsidy 块补帖.就是所谓的挖矿奖励,目前是 25btc, 下次减半后将为 12.5btc

#### Consensus Rule Changes

为了维持一致性,block的所有节点验证都使用一致的规则, 然而有些时候引入新特性时使一致性规则已发生改变或为了防止网络滥用. 当新规则实施时,可能将会有一段时间中未升级的节点按照旧规则而已升级的节点则按照新规则, 创建二种一致性会破坏方式:

1. 一个 **新特性block** 被 **未升级的节点** 拒绝因为违反了旧的规则.但已升级的节点将理解和接受它,


2. 一个 **旧特性block** 被 **已升级的节点** 拒绝,但被未升级的节点接受.

(TODO: 感觉上述二种方式根本就是一样的.)

对于第一种情况, 被 **未升级** 节点拒绝, 矿工软件从未升级节点获取数据与此同时另一个矿工软件从已升级节点获得数据,他们拒绝在构建在同一块链上, 这将创建永久的分叉也称为硬分叉(hark soft) - 一条已经升级块链和未升级的块链

![btc-gen-key](/assets/img/bitcoin/en-hard-fork.svg)

对于第二种情况, 被 **已升级** 的节点拒绝. 假如已经升级的节点控制了主要的哈希频率那么则有可能维持永久分叉的块链, 那是因为在这示例中, 未升级节点同样将接受有效的blocks来自已升级的节点, 所以已升级节点可以创建强壮的链,而这未升级节点将接受这有效的块链, 这称为软分叉(soft fork)

![btc-gen-key](/assets/img/bitcoin/en-soft-fork.svg)


尽管在块链中这是真实的分叉, 修改一致性的规则经常被描述为创建硬或者软分叉. 如:增加block size到1Mb以上需要硬分叉, 在此实例中,实际的块链分叉不是必须的-但是它仍有可能发生.

**资料** BIP60,BIP30和BIP34的实现修改将可能导致软分叉. 而 BIP50描述了偶然的硬分叉将通过临时降级已升级节点解决和当移除降级的故意硬分叉. 一份 Gavin Andresen 的文档 [how future rule changes may be implemented.](https://gist.github.com/gavinandresen/2355445)

术语:

* Consensus: 当一些节点(通常大多数网络上节点)全部在其本地已验证的最佳块链中拥有相同的blocks.

* Social consensus: 通常用于在开发人员之间讨论表明大多数人同意的一个计划

* Consensus rules: 允许节点保持一致性的规则.

##### Detecting Forks

(TODO: 这个小节的内容未明确,未来需要修改)

未升级节点可以使用以及发布不正确的信息通过二种类型分叉, 创建几种情况可能导致财务损失. 尤其是未升级节点可以中继和接受交易,它被已经升级的节点视为无效所以永远不会成为普遍公认的最好块链一部分. 未升级节点同样可以拒绝中断或已经添加到最好块链的交易,或将很快,并因此提供不完整的信息。

比特币核心包含了通过查看块链工作量证明(POW)来检测硬分叉的代码. 如果一个未升级的节点接收至少6个比best block chain更多POW的块链头那么它是有效的. 节点报告错误在getinfo RPC的返回值和运行 -alertnotify 命令设置,这警告操作者未升级节点不可以切换到best block chain.

全部节点还可以检测block和"交易"的版本号, 如果在几个最近的区块(blocks)看见的block或"交易"的版本号使用要高于自身, 那么节点可以假设它不使用当前一致性规则. Bitcoin Core 0.10.0 报告这种情况通过 getinfo RPC 和 -alertnotify 命令设置.

在任何情况下, block和交易数据不应该依靠如果它来自一个显然不使用当前一致性规则的节点

SPV客户端连接到全部节点可以通过连接几个全部节点来检测像硬分叉和确保它们都在相同block height的同一个链,加上或减去几个区块(blocks)占传输延迟和过时的区块. 如果有分歧,客户端可以断开来自弱链节点.

SPV客户端还可以监测block和"交易"版本号的增加以确保它们处理收到的交易和创建交易使用当前一致性规则.

* best block chain: 最好的块链, 被每个区块(multiple blocks)所引用的块链, 难度最大最长将是最好的块链

### Transactions

交易可以让用户花费 satoshi. 交易可以是简单的直接支付或复杂支付.本节将描述每个部分,并演示如何一起使用它们

为简单起见, 本节假装 coinbase transactions 不存在, coinbase transactions 仅可以被矿工创建而且是下边多数的规则的例外, 建议你阅读本指南 Block chain 的部分小节.

  ![btc-gen-key](/assets/img/bitcoin/en-tx-overview.svg)

上图显示了比特币交易的主要部分, 每个交易至少有一个收入和支出, 每个收入satoshi花费来自上个支出(output), 每个作为UTXOs的支出将等待下个收入(input)将其花费. 当钱包告诉你还有 10,000 satoshi 时, 这意味着你有 10,000 satoshi 在一个或多个UTXOs中.

每个交易的前缀为4字节的版本号,让其它人(peers)和矿工了解使用了哪些规则. 这能让开发人员为未来交易创建新的规则不会破坏先前的交易.

一个支出(output)含有隐含的索引根据其在交易数据中的位置--第一个支出为 output_0. 支出同样含有所有satoshis可用于支付到符合条件的pubkey. satoshi 可以支付给它任何一个满足条件的pubkey.

一个收入(input)使用交易标识(txid)和支出索引(output index(通常称为vout)来标识一个指定的支出. 它还具有一个scriptSigs,使得它能够提供能符合条件的参数在scriptPubKey中(序列号(sequence number)和locktime是相关联的和它们将被覆盖在一起在稍后的部分).

下图有助于说明这些工作流程, Alice 发送一个交易给Bob,稍后Bob花掉这笔钱, Alice和Bo将使用常见的标准交易类型 Pay-To-Public-Key-Hash(P2PKH). P2PKH 让 Alice 发送 satoshis 到典型的bitcoin地址, 后续使用简单密钥配对(simple cryptographic key pair)让Bob花费掉这些 satoshis .

  ![btc-gen-key](/assets/img/bitcoin/en-creating-p2pkh-output.svg)

在交易之前Bob首先必须生成密钥和公钥, 比特币使用椭圆曲线数字签名算法(ECDSA)的secp256k1曲线. private key(privkey)是256位的随机数值, 该数值的副本可确定性转换成public key(pubkey). 由于后续能可靠的再次建立,因此不需要存储 pubkey.

然后求pubic key(pubkey)哈希值, pubkey_hash同样可以再次建立,所以也不需要储存. pubkey_hash 可以缩短和混淆,使得手工抄写更容易.

Bob 把 pubkey_hash 提供给 Alice, pubkey_hash总是以已经编码的形式发送称为比特币地址(Bitcoin address), 编码使用 Base58算法,包含了地址版本号,pubkey_hash, 和错误校验. 地址的发送可以通过任何途径,包括单方向交易(防止发送者与接收人的联系). 比特币地址能进一步编码为其它格式,比如QR码(二唯扫描码).

一旦Alice拿到地址, 并将之解码为标准 pubkey_hash, 她可以创建第一个交易, 创建标准的P2PKH支出, 交易包含了"指令"允许其它任何人花费这个支出只要能证明和控制private key(privkey)对应的 pubkey_hash. 这个指令称为 pubkey script或scriptPubKey.

Alice 广播交易并将它添加到块链, 网络将它分类为 Unspend Transaction Output(UTXO), Bob的钱包将显示这些可用余额.

后续如果Bob想要花费掉UTXO, 他必须创建一个接收(input)引用Alice刚才的支出(output)交易的哈希值,这个哈希值称为 Transaction identifier(txid)以及这个支出的索引(output index). 他必须创建一个签名脚本(signature script)-- 一些满足Alice刚才的scriptPubKey的数据集合, 签名脚本也称为 scriptSigs.

scriptPubKey和scriptSigs 使secp256k1 pubkeys和signatures结合的条件逻辑,创建一种可编程的授权机制.

  ![btc-gen-key](/assets/img/bitcoin/en-unlocking-p2pkh-output.svg)

对于 P2PKH-style 支出, Bob 的 scriptSigs 将包含以下数据片段:

* 他的完全(未哈希)pubkey, 因此 scriptPubKey 可以通过求哈希检测和Alice提供的pubkey_hash一致.

* 一个 secp256k1签名,通过使用 ECDSA 加密公式将 确定的交易数据(后边描述)和Bob的privkey相结合. 这让 scriptPubKey 验证Bob拥有的 privkey所创建的 pubkey.

Bob的secp256k1签名不仅证明Bob控制着privkey, 同样防止篡改交易的non-signature-script部分, 所以Bob可以安全地广播它们到P2P网络.

  ![btc-gen-key](/assets/img/bitcoin/en-signing-output-to-spend.svg)

如上图所示, Bob数据的signs包含 txid 和引用上个交易的支出索引(output index), 上个支出的scriptPubKey. 而Bob创建的scriptPubKey将让下个接收者花费这个当易的支出和satoshis余额. 从本质上说整个交易是已签名的除了 scriptSigs,它包含有 pubkey 和 secp256k1签名.

在他的signature和pubkey放置到scriptSigs之后, Bob广播交易到比特币矿工通过P2P网络. 在进一步广播或试图添加到新块之前每个矿工将独立验证这个交易.

* signature: 签名, 一个关联到pubkey的值, 只能由拥有创建了这个pubkey的privkey合理的创建, 用于比特币授权花费satoshi之前发送给pubkey.

#### P2PKH Script Validation

验证过程需要scriptSigs和scriptPubKey的计算(evaluation), 在P2PKH支出(output)中, scriptPubKey为:

```
OP_DUP OP_HASH160 <PubkeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

计算花费者的scriptSigs并将其作该script的前缀, 在P2PKH交易中,scriptSigs包括secp256k1(sig)和pubkey, 创建下列连接:

```
<Sig> <PubKey> OP_DUP OP_HASH160 <PubkeyHash> OP_EQUALVERIFY OP_CHECKSIG
```

script语言是故意设计成 Forth-like 基于堆栈无状态和图灵不完整. 无状态确保一旦交易添加到块链, there is no condition which renders it permanently unspendable(不可撤消交易?). 图灵完备(具体而言, 缺少循环或跳转)使script语言更灵活和可预测,极大的简化了安全模型.

若要测试该交易是否有效, scriptSigs和scriptPubKey操作每次执行一项(???), 与Bos的scriptSigs开始,一直到Alice的scriptPubKey结束, 下图显示了一个标准的P2PKH scriptPubKey, 下面的图描述了过程:

  ![btc-gen-key](/assets/img/bitcoin/en-p2pkh-stack.svg)

下边所描述的栈顶请参照上图箭头所指示:

* signature(来自Bob的scriptSigs)已添加到空栈(0), 因为它仅仅是数据,什么也不做除了添加到栈. pubkey(同样来自这scriptSigs)被压入到栈(1)signature的上边.

* 来自 Alice的scriptPubKey,执行OP_DUP操作, OP_DUP 创建当前栈顶数据的副本并压入到栈顶(2) - 这个示例中将创建Bob的pubkey的副本

* 执行下一步, OP_HASH160,将栈顶(2)的数据哈希 - 这个示例中创建Bob的pubkey的哈希值pubkey_hash.

* Alice 的 scriptPubKey 将推送Bob给他的pubkey_hash用于第一次交易. 这时,应该有二个Bob的pubkey_hash在栈的顶层.

* 现在它变得有趣, Alice的 scriptPubKey 执行OP_EQUALVERIFY. OP_EQUALVERIFY与 OP_EQUAL接OP_VERIFY 的执行相等(图未显示这点).

  > OP_EQUAL(未显示) 检测二个位于栈顶的值, 这个示例中,它检测来自Bob的pubkey_hash是否等于Alice创建的#1交易中的pubkey_hash,
  >
  > OP_EQUAL 将弹出(从栈顶移除)已经比较过的二个值, 并且将返回值替换掉它们: 0(false),1(true).
  >
  > OP_VERIFY(未显示)检测栈顶的值, 如果值为false, 它将立即终止计算交易将失败 返回true则将true从栈顶移除

* 最后, Alice的 scriptPubKey 执行OP_CHECKSIG, 对当前验证检测Bob的signature和pubkey. 如果签名匹配使用所有所需数据生成的pubkey, OP_CHECKSIG将压入true到栈顶.

在执行了scriptPubKey之后如果false不在栈顶, 这个交易是有效的.(只要没有其它问题)

#### P2SH Scripts

scriptPubKey由对脚本做了什么不感兴趣的花费人创建, 而接收人关心脚本的条件, 如果它们愿意, 他们可以要求花费人使用特定的scriptPubKey, 不幸的是定制scriptPubKey比起比特币地址不太方便,并且它们没有标准的方法进行沟通在BIP70支付协议的程序实现之前, 稍后再讨论

为了解决这些问题, P2SH 交易创建于 2012年用于让花费人创建 scriptPubKey包含second script的哈希.称为redeem script.

如相所示这基本的 P2SH 工作流程看上去几乎等同于P2PKH工作流, Bob随意地创建了redeem script, 并求得哈希值, 并把哈希值给Alice, Alice创建一个P2SH-style包含了这个哈希值的支出.

  ![btc-gen-key](/assets/img/bitcoin/en-creating-p2sh-output.svg)

当Bob想要花掉Alice发给他的支出(output)时, 他需要同时提供signature和序列化的redeem script用于scriptSigs. P2P网络确保 redeem script hash 和Alice支出(output)中script hash有相同的值.然后处理redeem script哪果它是主要的scriptPubKey, 如果 redeem script 没有返回 false, 那么Bob可以花费掉余额.

  ![btc-gen-key](/assets/img/bitcoin/en-unlocking-p2sh-output.svg)

redeem script hash和pubkey_hash有相同的属性,因此它可以转换为标准的比特币地址格式,仅有一点小小的改变以区别其它标准地址. 这使得收集P2SH-style地址和收集P2PKH-style地址一样简单. hash同样可以在 redeem script 之中混淆任意pubkey. 因此 P2SH script 和 P2PKH pubkey_hash 一样安全

#### Standard Transactions

在发现早期Bitcoin版本几个危险的Bug之后, 仅从网络接受交易的test已经添加,如果scriptPubKey和scriptSigs 相匹配一套小的 believed-to-be-safe 模板, 如果交易的其余部分没有违反另一个小的规则执行良好的网络行为. 这是一个 IsStandard() 测试,以及交易通过它称为标准交易

非标准交易--那些失败的测试--可能会由节点接纳不使用默认的比特币核心设置. 如果他们包含在块中,他们一样能避免 isStandard test 和处理.

(TODO:未明确)

除了使它更难以通过广有害交易播攻击比特币, 标准交易测试同样有助于防止用户从现在创建交易添加新的交易功能在未来更难. 例如: 如上所述每个交易包含版本号--如果用户启动了任意更改的版本号,它将变得无用作为作为引入兼容特性的工具.

自 Bitcoin Core 0.9, 标准的 scriptPubKey类型为:

##### Pay To Public Key Hash

P2PKH 是 scriptPubKey 用于将交易发送到一个或多个比特币地址的常见形式.

```
Pubkey script: OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
Signature script: <sig> <pubkey>
```

##### Pay To Script Hash

P2SH 用于向 script hash 发送一个交易, 每个标准scriptPubKey可以用于P2SH redeem script, 但是在实践中仅对 multisig scriptPubKey有意义, 直到更多的交易类型成为标准.

```
Pubkey script: OP_HASH160 <Hash160(redeemScript)> OP_EQUAL
Signature script: <sig> [sig] [sig...] <redeemScript>
```

* multisig 多重签名, 一个scriptPubKey提供了n个pubkey, 并且需要相应的scriptSigs最低提供m个signature与pubkey相对应

  > 同义词: M-of-N Multisig, Multisig Output,Bare multisig
  >
  > 注意区别: P2SH multisig(一个多重签名script包含于P2SH)


##### multisig

尽管 P2SH multisig 现在一般用于多重交易, 这个base script可以用于多重签名需求在UTXO可以被花费前

在 multisig scriptPubKey中, 称为 m-of-n, m 是小数目signature必须匹配pubkey, n 是 pubkey 的数量.  m 和 n 应该为操作码 OP_1 到 OP_16 所对应的数量.

必须保持兼容由于最初Bitcoin的一个off-by-one的错误, OP_CHECKMULTISIG consumes one more value from the stack than indicated by m, so the list of secp256k1 signatures in the signature script must be prefaced with an extra value (OP_0) which will be consumed but not used.

scriptSigs必须提供signatures有相同的顺序, 因为相应的 pubkey 出现在 scriptPubKey或 redeemScript. 请参阅 OP_CHECKMULTISIG 的描述

```
Pubkey script: <m> <A pubkey> [B pubkey] [C pubkey...] <n> OP_CHECKMULTISIG
Signature script: OP_0 <A sig> [B sig] [C sig...]
```

虽然它不是一个单独的交易类型, 这是一个2-of-3的P2SH multisig

```
Pubkey script: OP_HASH160 <Hash160(redeemScript)> OP_EQUAL
Redeem script: <OP_2> <A pubkey> <B pubkey> <C pubkey> <OP_3> OP_CHECKMULTISIG
Signature script: OP_0 <A sig> <C sig> <redeemScript>
```


##### Pubkey

pubkey支出是一个简化形式的 P2PKH scriptPubKey, 但相较于P2PKH它们不那么安全, 所以它们通常不会再用于新的交易.

```
Pubkey script: <pubkey> OP_CHECKSIG
Signature script: <sig>
```

##### Null Data

Null data scriptPubKey 在交易时让你添加少量的任意数据到块链用于支付transaction fee, 但是这样做很气馁(Null data 是一个标准scriptPubKey 类型只是因为有些人将数据添加到块链有更多有害的方式)

```
Pubkey Script: OP_RETURN <0 to 40 bytes of data>
(Null data scripts cannot be spent, so there's no signature script.)
```

##### Non-Standard Transactions

如果你将任何标准之外的scriptPubKey用于一个支出(output), 而使用默认的Bitcoin Core设置的支点(peers)和矿工将不会接受广播,和交易. 当你尝试广播到支点的默认设置时, 你将收到一个错误.

如果你创建一个 redeemScript 并计算其哈希. 并将这个哈希值用于P2SH支出(output), 网络只能看到哈希值,因此它将接受支出(output)作为有效不管是什么redeemScript. 这样几乎一样容易作为标准 scriptPubKey 的付款支付给 **非标准** scriptPubKey, 但是当你这样花费这个支出, 而支点和矿工使用默认设置将检查 redeemScript, 看看它否为标准的 scriptPubKey, 如果它不是, 它们不会作进一步处理 -- 因此它将变得不可能花费,除非你更改支点和矿工的默认设置.

注: 标准的交易旨在保护网络, 而不是阻止你犯错误. It’s easy to create standard transactions which make the satoshis sent to them unspendable.

自Bitcoin Core 0.9.3, 标准交易必须同样满足下列条件:

* 交易必须为最终形式(finalized): 要么它的locktime必须是在过去(或小于或等于当前block header)要么所有其序列号必须是0xffffffff

* 交易必须小于 100,000字节, 这通常是普遍的单收入(single-input),单支出(single-output)P2PKH 交易大小的200倍.

* 每个交易的 scriptSigs 必须小于1650字节, 这是大到中以允许 15-of-15的多重签名交易在P2SH中 使用了压缩的pubkey.

* Bare(non-P2SH) multisig(多重签名)交易将需要超过 3 个pubkey, 当前的非标准 (which require more than 3 public keys are currently non-standard.) (TODO:未明确)

* 交易中不能包含任何 支出(output)的接收少于1/3的 satoshis,它将在通常的接收(input)中被消耗. 这就是目前 546 satoshis 为 P2PKH或P2SH支出在Bitcoin Core节点作为默认的中继费(relay fee). 例外: 标准 null data 支出必须接收 0 satoshi

#### Signature Hash Types

OP_CHECKSIG提取non-stack参数来自每个signature从它的计算结果, 允许签字人决定交易的哪部分要签名, 因为签名保护那些修改的交易部分, 这样就可以让签字人选择性的让其它人修改他们的交易.

要签什么的各种选项称为signature hash type, 有三种基本的SIGHASH类型当前可用:

* `SIGHASH_ALL`, 默认, 签名所有收入(input)和支出(output), 保护一切除了防止被修改的scriptSigs

* `SIGHASH_NONE`,  签名所有收入(input)但是忽略支出(output), 允许任何一个人改变 satoshi将发送到哪, 只有在其它signature使用其它signature hash flag 保护这个支出(output)(TODO: 未明确)

* `SIGHASH_SINGLE` 仅签名这个收入(input)和其相匹配的支出(output, 支出具有同样的支出索引作为收入),确保没有人可以改变你的交易部分,但是允许其它签名者改变它们交易的部分. 相应的支出必须存在或签名值为 1, 破坏安全方案.

基础类型可以修改与SIGHASH_ANYONECANPAY(任何人都可以支付)标志, 创建三个新合并类型:

* `SIGHASH_ALL|SIGHASH_ANYONECANPAY` 签名所有支出但只一个收入, 同样允许任何人添加或移除其它收入(input), 因此任何人可以贡献额外的 satoshis, 但他们不能改变有多少 satoshis 将发送也不知道将发送到哪里?

* `SIGHASH_NONE|SIGHASH_ANYONECANPAY` 仅签名这一个收入以及允许任何人添加和移除其它收入和支出(inputs or outputs), 因此任何可都将得到收入,可以花费它只要它们喜欢.

* `SIGHASH_SINGLE|SIGHASH_ANYONECANPAY` 仅签名这一个收入(input)以及相匹配的支出(output), 但是同样允许任何人添加或移除其它收入(inputs)

因为每个收入(input)进行了签名, 与多个收入(inputs)的交易可以有多个签名哈希类型各自签名交易的不同部分, 例如: single-input交易签名类型为NONE, 可以有它改变了的支出(output)由矿工将它添加到块链. 另一方面, 如果 two-input 交易, 一个input签名类型为NONE 和另一个input签名类型为ALL, 这 ALL 类型的签字人可以选译 satoshi 将被发送到哪而不需要咨询NONE类型签字人 -- 但是没有其它任何人可以修改这个交易.


#### Locktime And Sequence Number

交易的locktime(在Bitcoin Core源码称之为nLockTime)是所有signature hash type 的标志, locktime 表明最早的交易时间可以被添加到块链.

locktime 允许签字人用于创建 time-locked 交易,将只在未来变得有效,给签字人一个机会去改变他们的想法.

如果任意签字人改变他们的想法, 他们可以创建新的non-locktime交易. 这个新交易将使用, 一个它的接收(input), 一个已经用于locktime交易接收(input)相同的支出(output) , 这使得locktime 交易无效如果新的交易添加到块链在锁定的时间到期之前.(TODO: 未明确,这里很混乱)

必须小心接近锁定的到期时间, P2P网络允许阻塞时间最多两个小时. 因此 locktime交易可以添加到块链在锁定时间正式到达之前增加两个小时. 此外在保证的时间间隔不会创建block, 所以任何企图取消一个宝贵的交易都应该在锁定时间到期前几个小时.

以前的Bitcoin Core 版本提供了一个功能, 阻止交易签字人使用上述方法取消 time-locked交易, 但是此功能的一个必要部分已经被禁止用于防止拒绝服务攻击. 遗留下来的这个系统是 4字节序列号在每个收入(input)中, 序列号是为了允许多个签字人同意更新交易; 当它们完成更新交易, 他们可以同意设置每个4字节无符号(最大值为0xffffffff)的收入(input)的序列号, 允许交易添加到块即使其时间锁定未到期.

即使在今天, 将所有序列号设为0xffffffff(Bitcoin Core默认)仍然可以禁用时间锁, 因此如果你想要使用 locktime, 至少一个接收(input)必须有低于最大值的序列号, 自从在网络中序列号没有再使用用于任何目的, 将任意序列号设为 0 足以开启 locktime.

locktime 自身为无符号的4字节整数, 可以被解析为二种方式:

* 如果低于 500,000,000, locktime 将被解析为一个block height, 交易可以添加到这一高度或更高的任意block.

* 如查大于或等于 500,000,000, localtime 使用 Unix时间戳格式(自1970-01-01距离现在的秒数),交易可以添加到大于这个时间的任意block.

  > Sequence Number: 所有交易的部分一些旨在允许未经证实的 time-locked 交易的最终化(finalized)之前更新; 目前未使用除了在交易中禁用 locktime

#### Transaction Fees And Change

交易通常支付交易费基于签名交易的总字节大小.交易费将给矿工，如块链章节所述，所以它是最终由每个矿工来选择最低的交易费.

默认情况下, 矿工保留50KB 每个block花费satoshis但是很长时间没有被花费交易的优先权. 每个block中的剩余空间通常分配给其费用根据每个字节的交易与更高支付交易开始添加以队列,直到所有的可用空间已填充

Bitcoin Core 0.9, 交易将不计算高优先交易需要支付的最小费用(当前为 1,000 satoshi)的跨网络广播, 任何交意仅支付最低费用应该准备等待很长时间在block有足够预留空间将它添加进来之前. 请参阅为什么这将是重要验证付款部分.

由于每个交易花费UTXOs, 因为UTXO仅只能被花费一次, UTXOs的全部价值必须花掉或作为交易费给矿工. 很少有人的UTXOs中的余额完全等于想要花费的,因此大多数交易包含一个零钱支出(change output).

零钱支出是常规的支出将花费的satoshi余额从UTXOs返回到花费者. 他们可以重用相同的已经使用过的 P2PKH pubkey_hash 或 P2SH script hash于 UTXO. 但由于这个原因所述在下一个小节中, 强烈建议零钱支出(change output)被发送到新的 P2PKH或P2SH 地址

#### Avoiding Key Reuse

在交易中，发送者和接收者每个透露给对方在交易中使用的公共密钥或地址, 这使得任何人使用公共块链追踪过去和将来的交易,涉及其它人相同的公钥或址.

如果相同的公钥经常使用, 发生在人们使用比特币地址(pubkey_hash)作为来变的支付地址, 其它人可以轻松地跟踪其的消费习惯, 包括有多少satoshis在已知的地址中.

并不一定要那样,　如果每个pubkey只用了二次--一次用来接收另一次用于支出, 其它人可以获得大量的隐私.

更妙的是, 使用新pubkey或唯一的地址在接收支付或创建零钱支出可以结合其它技术稍后再讨论，　如 CoinJoin或合并回避(merge avoidance), 将可以使从块链中追踪交易记录变得非常困难.

避免密钥重复使用还可以提供安全性, 以防止可能会从pubkey或签名比较(signature comparisons)中重建privkey(假设)(现在可能在稍后讨论的某些情况下, 假设用一般的普通攻击)

* 唯一(非重复使用)的P2PKH和P2SH地址保护免受第一种类型攻击通过保持 ECDSA pubkey_hash 隐藏,直到首次发送 satoshis 到地址, 因此攻击实际上是无用的,除非他们可以重建 privkey 在不到二个小时内, 块链将对交易保护得很好.

* 唯一(非重复使用)的privkey保护免受第二种类型攻击通过每个privkey仅生成一个签名,因此攻击者永远不会得到随后的签名在基于比较(comparison-based)的攻击中使用. Existing comparison-based attacks are only practical today when insufficient entropy is used in signing or when the entropy used is exposed by some means, such as a side-channel attack.(TODO: ???entropy)

因此对于隐私和安全, 我们建议(encourage)你建立的你的app应避免pubkey的重复使用,并在可能的情况下,劝阻用户重复地址, 如果你的app需要一个固定的URI向其发送支付, 请参阅之后[bitcoin:URL](#bitcoin_URI)的部分

#### Transaction Malleability

(TODO: 这一节内容都感觉不对)

没有任何比特币的签名哈希类型估护scriptSigs,保持门的打开为有限的拒绝式服务攻击称为交易韧性(transaction malleability). scriptSigs包含 secp256k1签名, 它不能给自已签名, 使得攻击者能够进行非功能性(non-functional)修正的交易. 例如: 攻击者可以将某些数据添加到scriptSigs在上一个scriptPubKey已处理之前它将被丢弃.(an attacker can add some data to the scriptSigs which will be dropped before the previous scriptPubKey is processed.)

虽然修改非功能性(non-functional)--所以它们既不会修改交易的收入(inputs)也不会修改支出(outputs)--它们会更改交易计算出来的哈希. 由于每个交易链接到上一个交易使用哈希值作为 交易标识(txid), 一个修改后的交易将不会有创建者预期的txid.

这不是一个问题因为比特币大多数交易被设计为立即添加到块链, 但是它确实会成为一个问题当支出所在的交易在花费前而这个交易却已经被添到块链.

比特币开发人员一直在努力在标准交易类型中减少交易韧性, 但是一个完整的修正目前仍处于规划阶段, 在目前新的交易不应该依赖之前的交易,它们还没有添加到块链. 龙其是当大量的 satoshis 处于危险之中.

交易韧性同样会影响支付跟踪, 比特币核心 RPC 接口允许你跟踪交易通过其 txid--但如果txid发生更改(因为交易已经被修改). 可能会出现交易已经从网络中消失.

当前最好做法是 交易跟踪要求这个交易应该由交易支出(UTXOs)作为收入(inputs),因为他们不难修改不会导致无效的交易.

最佳做法进一步规定如果一项交易似乎要从网络中消失和需要重新发布, 重新发布将使丢失的交易无效. 一种方法,将会不停的工作以确保重新发布的交易全都具有相同的支出.

### Contracts


#### Escrow And Arbitration

#### Micropayment Channel

#### CoinJoin

### Wallets

#### Wallet Programs

#### Full-Service Wallets

#### Signing-Only Wallets

##### Offline Wallets

##### Hardware Wallets

#### Distributing-Only Wallets

#### Wallet Files

#### Private Key Formats

##### Wallet Import Format

##### Mini Private Key Format

#### Public Key Formats

#### Hierarchical Deterministic Key Creation

##### Hardened Keys

##### Storing Root Seeds

#### Loose-Key Wallets

### Payment Processing

#### Pricing Orders

#### Requesting Payments

##### Plain Text

##### bitcoin URI

##### QR Codes

##### Payment Protocol

#### Verifying Payment

#### Issuing Refunds

#### Disbursing Income

Disbursing Income (Limiting Forex Risk)


##### Merge Avoidance

##### Last In-First Out

Last In, First Out (LIFO)

##### First In-First Out

First In, First Out (FIFO)

#### Rebilling Recurring Payments

### Operating Modes

#### Full Node


