---

layout: post
title:  manjaro(xfce) 配置
date:   2023-03-23 08:22:10
categories: other

---


一个技巧是想要什么直接在 "开始" 菜单的搜索框里输入就行, 比如 task, software, menu ....

  可以输入: theme(Appearance), menu(Window Mannageer) 调整一下主题

<!-- more -->

### 主题

通过 `Appearance` 和 `Window Mannageer` 更改后, 记得也要改 `Kvantum Manager`

因为所有 QT gui 都依赖于 `Kvantum Manager` 的配色

### 时区

进入 `setting -> Manjaro Setting manager > Time and Date`

将 "Hardware clock in local time zone" 勾上, 表示 BIOS 里看到的是本地时间

勾上之后 manjaro 很可能会更改 bios 里的时间为一个错误的值, 要自己改回来.

### gpg 密钥


### 没有对应的显示分辨率

1. 查询 modeline, 例如: `cvt 1440 900` 或者 `gfx 1440 900 60`

  ```bash
  # 1440x900 59.89 Hz (CVT 1.30MA) hsync: 55.93 kHz; pclk: 106.50 MHz
  Modeline "1440x900_60.00"  106.50  1440 1528 1672 1904  900 903 909 934 -hsync +vsync
  ```

2. 然后添加 `/etc/X11/xorg.conf.d/10-monitor.conf` 文件, 原文参考 [未检测到的分辨率](https://wiki.archlinux.org/title/Xrandr#Permanently_adding_undetected_resolutions)

  不清楚 xrandr 是否是必须要安装的

  ```
  Section "Monitor"
      Identifier "VGA-0"
      Modeline "1440x900_60.00"  106.50  1440 1528 1672 1904  900 903 909 934 -hsync +vsync
      Option "PreferredMode" "1440x900_60.00"
  EndSection
  ```

3. 完成后重启,到显示设置里改成 1440x900 的就可以了

------

网上搜到的都是下边几步, 但是每次重启后要重新弄(或者可以)

1. 需要安装 `xrandr` (包管理器里是 xorg-xrandr),
2. 查询 modeline, 前面已经提过
3. `sudo xrandr --newmode "1440x900_60.00"  106.50  1440 1528 1672 1904  900 903 909 934 -hsync +vsync`
4. `xrandr --addmode VGA-0 “1440x900_60.00”`
5. `xrandr --output VGA=0 --mode "1440x900_60.00"`
6. 添加到各种"启动"配置里去(晚上)

### 杂项

- 字体安装 : 安装字体直接复制到 `/usr/share/fonts` 即可

- deb 包 : "包管理器"打开 AUR 后安装 debtab, (或者先安装 yay 再通过 yay 安装 debtab).

- 环境变量 "PS1" 用于一些显示

- 输入法 : 包管理器搜 (Fcitx) 或 `mamaro hello -> Applications -> Extended language support` 选  Fcitx

  注意不要选择(Fcitx5), 估计是因为太新没有输入法

- 如果终端的字符隔开的太宽, 修改字体

- 启动 chromium 时询问密码可**临时**更改桌面图标的 `Edit launcher` 在 %U 之前 加 `--password-store=basic`

  终极方案是设定一个 gpg 密钥

- 修改 host 名 要不然终端的前缀太长 [Correctly change the hostname](https://forum.manjaro.org/t/howto-correctly-change-the-hostname/97081)

  ```
  1 通过 hostnamectl, 如 hostnamectl set-hostname NEWNAME
  2 再更改 /etc/hosts 文件
  ```

### 改回英文系统

管理员模式修改 `/etc/locale.gen` 文件，根据添加或取消“注释”选择你想要的

执行　`sudo locale-gen` 刷行系统

### 自动加载 ntfs 盘符

1. 首先用 `lsblk --fs` 查看磁盘情况:

  ```
  NAME       FSTYPE FSVER  LABEL   UUID
  sda
      sda1    ntfs                ABCDEFG...
      sda2    ntfs                ABCDEFG...
      sda3    ext4   1.0          ABCDEFG...
  ```

2. (可选不必要) 可以使用 `sudo ntfslabel /dev/sdX "LABEL_NAME"` 添加  label(卷标)


3. 为挂载点创建目录，例如 `sudu mkdir /data`

  > 创建在 `/run/media` 下的目录会被自动删除, 因此直接根目录即可


4. 修改 `/etc/fstab` 文件加入类似于,具体细节要自己搜了

  ```
  #hide_dot_files, hide_hid_files
  UUID=0008A10E000E931B  /data ntfs-3g  defaults,noauto,x-systemd.automount,x-systemd.device-timeout=10,rw,inherit,permissions,streams_interface=windows,windows_names,compression,norecover,big_writes 0 2
  ```

5. 刷新 `systemctl daemon-reload`, 执行这一步时确保要挂载的盘处于 unmount 状态

  可能需要再执行 `mount /data` 一下

成功完成之后 xfce 的文件浏览器(Thunar) 里将不会重复出现 fstab 设定的 ntfs 盘


### 问题

- 对于一些主板 xfce 检测不到机箱的前置耳机是否已经插入


