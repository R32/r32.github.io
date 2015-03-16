---
layout: post
title:  加密货币开发
date:   2014-11-08 10:7:26
categories: other
---

尝试使用 haxe 开发 dogecoin 轻钱包, 用于 nodejs 服务器, 所有山寨币都是基于 bitcoin 源码, 需要了解一些 bitcoin 的基础.

<!-- more -->

### 基础

首先是些基础概念, 这些可以在网络搜索得到.  比特币结合P2P对等网络技术和密码学原理，来维持发行系统的安全可靠性。与有中心服务器的中央网络系统不同，在P2P网络中无中心服务器，每个用户端既是一个节点，也有服务器的功能，任何一个节点都无法直接找到其他节点,必须依靠其户群进行信息交流。

每个帐户其实就是一对公私匙，有私匙的人就是帐户的主人。如果 A 要给 B 转一笔钱，A 就把钱的数量加上 B 的公匙，用自己的钥匙(TODO: 公还是私,还是二个都?)签名。而 B 看到这个签名，就可以了解，的确是 A 转给了他如数的 BTC [详细进入...](http://8btc.com/article-12-1.html)

#### 区块链(BlockChain)

比特币 点对点(p2p) 网络将所有的交易历史都储存在 区块链 中,新区块一旦加入到区块链中，就不会再被移走。 区块链实际上是一群分散的用户端节点，并由所有参与者组成的分布式数据库，是对所有比特币交易历史的记录。 比特币的交易数据被打包到一个“数据块”或“区块”（block）中后，交易就算初步确认了。当区块链接到前一个区块之后，交易会得到进一步的确认。在连续得到6个区块确认之后，这笔交易基本上就不可逆转地得到确认了。

#### 比特币地址和私钥是怎样生成的

原文引用: http://8btc.com/article-135-1.html

比特币使用 椭圆曲线算法 生成 **公钥** 和 **私钥** ，选择的是 secp256k1 曲线。生成的公钥是 33字节 的大数，私钥是 32字节 的大数，钱包文件 wallet.dat 中直接保存了公钥和私钥。在接收或发送比特币时用到的 地址(address) 是 公钥 经过算法处理后得到的，具体过程是 公钥 先经过 SHA-256 处理得到32字节的哈希值，再经 RIPEMED 处理后得到20字节值，再经过字符转换过程得到我们看到的地址。这个字符转换过程与私钥的字符转换过程完成相同，步骤是先把输入的内容（对于公钥就是20字节的摘要结果，对于私钥就是32字节的大数）增加版本号，经过连续两次SHA-256算法，取后一次哈希结果的前4字节作为校验码附在输入内容的后面，然后再经过Base58编码，得到字符串

![btc-gen-key](/assets/img/btc-gen-key.png)




然后下边是主要是 haxe 源码 https://github.com/cbatson/hxBitcoin 的 readme 文件内容.

### Bitcoin

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


### 源码参考

bitcoin 项目组 https://github.com/bitcoin 

litecoin 项目组 https://github.com/litecoin-project

dogecoin 项目组 https://github.com/dogecoin

