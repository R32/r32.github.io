---
layout: post
title:  虚拟币开发相关
date:   2014-11-08 10:7:26
categories: other
---

尝试使用 haxe 开发 dogecoin 轻钱包, 用于 nodejs 服务器, 所有山寨币都是基于 bitcoin 源码, 需要了解一些 bitcoin 的基础.


<!-- more -->

### 基础

主要是 haxe 源码 https://github.com/cbatson/hxBitcoin 的 readme 文件内容.

#### Bitcoin

 * [BIP0038(encrypted private keys)](https://github.com/bitcoin/bips/blob/master/bip-0038.mediawiki)

	> 文档似乎不短啊! 一些 搜索到的中文资料,
	
	> 用于加密私钥(private key), 被加密的私钥不需要密码就可以算出 地址(address)
	> 没有密码可以查询余额, 加密后长度不变

 * WIF

 * Convert private keys to public keys & addresses

 * Base58

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


#### 源码参考

bitcoin 项目组 https://github.com/bitcoin 

litecoin 项目组 https://github.com/litecoin-project

dogecoin 项目组 https://github.com/dogecoin

