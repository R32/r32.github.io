---

layout: post
title:  windows + ubuntu双系统
date:   2014-06-09 7:21:13
categories: other

---

...........
 
<!-- more -->

#### 硬盘安装

 * 最新版的 ubuntu.iso

 * 最新版的 grub4dos

  - 解压后复制文件 menu.lst 和 grldr 到 `C:\` 根目录下

  - 修改 boot.ini 文件，在最后一行添加 `C:\GRLDR="GRUB4dos"`

  - 从 ubuntu.iso 文件的 casper 目录提取 initrd.lz 和 vmlinuz.efi 到 `C:\` 根目录下:

	```ini
	# 注意 ubuntu-14.10-desktop-amd64.iso 需要替换成相应文件名
	title ubuntu-14.10 live CD
	find --set-root /ubuntu-14.10-desktop-amd64.iso 
	kernel /vmlinuz.efi boot=casper iso-scan/filename=/ubuntu-14.10-desktop-amd64.iso locale=zh_CN.UTF-8
	initrd /initrd.lz
	```
 * 重启，选择 GRUB4dos 进入 live cd，**安装时会有一个 卸载磁盘的警告， 选择 “是”**

 * 空闲的逻辑分区: 下边是从空闲分区中创建,仅供参考

	```ini
	/	20G
	/boot	256M	
	/home	20G
	/swap	2G	#这个在选择文件类型那里改. EXT4 那个选项	
	/tmp	5G	
	```

 * 安装完成之后，删除 `C:\` 下的文件复制，并且将 boot.ini 改回来.

 * 修改 `/etc/default/grub`, 使 windows 为默认启动

<br />

apt
------

ubuntu 基本都是使用 apt 命令来维护软件。

 * 添加右键命令行: 完成之后需要注销下系统

	```bash
	apt-get install nautilus-open-terminal
	```





