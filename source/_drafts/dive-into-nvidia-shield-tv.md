title: dive into nvidia shield tv
comments: true
tags:
  - Nvidia Shield TV
  - Android
  - Entware
permalink: nvidia-shield-tv-dig-1
date: 2018-12-18 11:23:16
updated: 2018-12-18 11:23:16
---


去年入手了`Nvidia Shield TV 2017`这个电视盒子，但是也就是用来看看电视，实在是对不起这么贵的价钱。

系统是原生的`Android TV`，因此`Youtube
盒子的性能
比树莓派3都还强一点

闲置着也是浪费

性能对比：（链接之前的性能对比文章）

安装开发者版本，自带root

[开发者版本系统](https://developer.nvidia.com/shield-developer-os-images)


系统是原生的`Android TV`，大部分应用可以安装，但是没法在桌面显示，需要安装[Sideload Launcher](https://play.google.com/store/apps/details?id=eu.chainfire.tv.sideloadlauncher)


权限管理

[magdisk](权限管理)

[Rom Toolbox Lite](启动脚本管理)


busybox 安装
[busybox]https://play.google.com/store/apps/details?id=com.jrummy.busybox.installer


外接硬盘格式化

外接硬盘插入后，会默认识别。但是其只能格式化为FAT格式的，不支持权限控制，后续在安装相关软件时会碰到权限问题，因此需要手动格式化为`EXT4`。注意格式化为`EXT4`后，`Android TV OS`不能识别自动挂载硬盘，需要手动挂载。

外接硬盘插入后对应的设备文件一般位于`/dev/block/sda`

``` bash
# 进入adb bash
adb connect ip:port
adb shell
su
# ext4格式化
# 首先删除现有的分区信息
sgdisk --clear /dev/block/sda
# 清空后需要重启
reboot
```

``` bash
# 创建一个最大的分区  只要一个分区就够了
sgdisk --largest-new=1 /dev/block/sda
```

> 使用参数0 会包错误，并没有如文档中所说的自动使用可选的分区号  
> darcy:/dev/block # sgdisk --largest-new=0 /dev/block/sda  
> Could not create partition 0 from 2048 to 15628053133
> Error encountered; not saving changes.

> `sgdisk`位于`/system/bin/`目录下面，使用文档参考[这里](https://www.rodsbooks.com/gdisk/sgdisk.html)


``` bash
# 查看分区信息
sgdisk --print /dev/block/sda
# 创建文件系统
mke2fs -t ext4 -L shield8t /dev/block/sda1
```

``` bash
# 查看文件系统 确认是否已经格式化EXT4
blkid 
```

> [如何查看分区系统](https://www.tecmint.com/find-linux-filesystem-type/)


挂载外接硬盘

``` bash
mkdir /mnt/media_rw/5C58-53F6
mount -t ext4 /dev/block/sda1 /mnt/media_rw/5C58-53F6
# 查看磁盘使用情况
df
```

[ext4]格式化

默认的文件系统是FAT格式的，不支持权限控制，后续安装OpenSSH的时候会有问题。

盒子

root 直接安装 开发者版本 具体刷机教程 很简单

MacOS Sierra fastboot还是有问题，所以刷不了机，Windows笔记本又不能用了，最终居然用树莓派刷的


安装armv8版本 entware

mount -o rw,remount /
mount -o rw,remount /system

[entware安装指引]https://github.com/Entware/Entware/wiki/Alternative-install-vs-standard

根据说明，`Android`设备应该采用`Alternative`的方式安装

cat /proc/cpuinfo
``` 
# 查看cpu架构
darcy:/etc # cat /proc/cpuinfo
processor       : 0
BogoMIPS        : 38.40
Features        : half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x1
CPU part        : 0xd07
CPU revision    : 1

processor       : 1
BogoMIPS        : 38.40
Features        : half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt
CPU implementer : 0x41
CPU architecture: 8
CPU variant     : 0x1
CPU part        : 0xd07
CPU revision    : 1

Hardware        : darcy
Revision        : 0000
Serial          : 0b4e0000a0000000
```

``` 
# 查看内核版本
darcy:/etc # cat /proc/version
Linux version 3.10.96-tegra (buildbrain@mobile-u64-3071) (gcc version 4.9.x 20150123 (prerelease) (GCC) ) #1 SMP PREEMPT Thu Aug 30 11:44:15 PDT 2018
```

从结果我们可以知道`Nvidia Shield TV`是`AArch64`架构的，`Linux Kernel`版本为`3.10`

``` bash
cd /mnt/media_rw/5C58-53F6
mkdir entware
ln -s /mnt/media_rw/5C58-53F6/entware /opt
```
```
adb shell
su
/system/bin/mount -o rw,remount /
mkdir /opt
mkdir /bin
ln -s /system/bin/sh /bin/sh
/system/bin/mount -o ro,remount /

mount -o bind /mnt/media_rw/5C58-53F6/entware /opt
wget -O - http://bin.entware.net/aarch64-k3.10/installer/alternative.sh | sh
```

```
wget http://bin.entware.net/aarch64-k3.10/installer/alternative.sh
/system/bin/sh alternative.sh
```

创建resolv.conf文件
因为安装脚本安装过程中会安装busybox然后使用wget，但是这个wget需要使用resolv.conf文件



Info: If there are no errors above then Entware was successfully initialized.
Info: Add /opt/bin & /opt/sbin to your PATH variable
Info: Add '/opt/etc/init.d/rc.unslung start' to firmware startup script for Entware services to start

This is an alternative Entware installation. We recomend to install and setup Entware version of ssh server
and use it instead of a firmware supplied one. You can install dropbear or openssh as an ssh server

entware安装完毕后，开始安装应用包

所有packages列表
http://bin.entware.net/aarch64-k3.10/Packages.html

openssh 安装

opkg update
opkg install openssh-server openssh-client openssh-keygen openssh-sftp-server openssh-sftp-client openssh-client-utils

/opt/etc/init.d/S40sshd start

127|darcy:/opt # starting sshd...
sh: starting: not found
127|darcy:/opt # Privilege separation user sshd does not exist
sh: Privilege: not found

/opt/etc/passwd中添加
sshd:*:27:27:sshd privsep:/opt/var/emtpy:/opt/bin/sh

再次运行
darcy:/opt/etc # /opt/etc/init.d/S40sshd start
starting sshd...
Could not load host key: /opt/etc/ssh/ssh_host_rsa_key
Could not load host key: /opt/etc/ssh/ssh_host_ecdsa_key
Could not load host key: /opt/etc/ssh/ssh_host_ed25519_key


生成对应key文件
ssh-keygen -t rsa -f /opt/etc/ssh/ssh_host_rsa_key
ssh-keygen -t ecdsa -f /opt/etc/ssh/ssh_host_ecdsa_key
ssh-keygen -t ed25519 -f /opt/etc/ssh/ssh_host_ed25519_key

再次运行成功

ssh root@192.168.10.69

一直Permission denied

修改ssh配置文件 允许root登陆
/opt/etc/ssh/sshd_config

PermitRootLogin yes

默认密码12345
修改密码`passwd root`
pi@pi3:~ $ ssh root@192.168.10.69
root@192.168.10.69's password:


BusyBox v1.29.2 () built-in shell (ash)

~ # ls

登陆成功，`Shell`是`passwd`配置的`ash`

安装bash
`opkg install bash`