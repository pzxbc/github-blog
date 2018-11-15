title: 网件(Netgear)路由器R6300v2使用
comments: true
date: 2016-01-26 19:17:53
updated: 2016-01-26 19:17:53
tags:
  - 技术
  - 路由器
permalink: netgear-r6300v2-usage
---

一直想换个路由器，因为在用的那个TP-link无线实在是不稳定，即使离路由很近的时候都会出现波动，时而延迟很大；另外在卧室里就连不上了，冬天不能呆被窝玩手机啊。最近终于入手了网件(Netgear)R6300v2路由器，跟老婆说的理由是要组建高速的家庭无线共享存储网络！

## 刷梅林(merlin)系统

刚入手时，体验了下Netgear自带的固件，觉得ReadyShare功能挺好的，但是当我将3T的外接硬盘插上路由器时，居然没有任何反应。查阅路由器资料发现这货居然不支持EXT4文件系统格式，只支持到EXT3。。。瞬间觉得心凉了，不能挂外接硬盘，ReadyShare就相当于摆设啊。于是为了我的外接硬盘，果断刷了梅林。

<!-- more -->

刷机步骤参考了[这里](http://post.smzdm.com/p/366762)  {% asset_link r6300_merlin_step.pdf PDF查看 %}

刷机前先下载需要的[全部文件](http://pan.baidu.com/s/1eRqCaEQ)

1\. 进入路由器高级->管理->备份设置，恢复出厂设置。如果你之前已经刷过其他固件了，那要先刷回原厂固件。
2\. 进入路由器升级界面，刷入DD的过渡固件factory-to-dd-wrt.chk。升级过程需要1~2分钟。
3\. 路由器重启后进入dd-wrt，需要设置用户名和密码
4\. 找到Services->Secure Shell->SSHd，设置为enable，然后拉到最后点Save再点Apply Settings。
5\. 使用SSH登陆工具putty，登陆路由器。账号密码是之前设置的，端口为22。
6\. 执行下面指令
``` bash
nvram get boardnum
nvram get boardtype
nvram get boardrev
```
对比结果数值是否一致：boardnum=679，boardtype=0x0646，boardrev=0x1110。如果不一致得先刷回原厂固件，然后再从第一步做起。

7\. 进入路由器dd-wrt界面，找到administrator->固件管理，刷入R6300V2_merlin_1.2.trx固件。
8\. 重启后进入梅林1.2界面，跳过设置向导，设置下无线密码。**注意这里可能需要你提供账号密码登陆，这时你使用路由器ip地址重新访问路由器，就不需要账号密码了**。
9\. 进入固件升级界面，刷入最新版梅林固件R6300V2_378.56_0-X5.9.trx。
10\. 路由器自动重启后，继续跳过向导，设置无线密码，然后恢复出厂设置。
11\. 恢复出厂设置重启后刷机完毕，可以开始设置路由器了。

注意刷机过程中路由器不能断电，网线不能松动！

Netgear6300v2梅林固件[发布链接](http://koolshare.cn/thread-7453-1-1.html)，可以关注论坛版主`chazikai24`的最新发布。

从梅林固件刷回原厂固件很简单，在固件升级界面刷入原厂固件R6300V2_back-to-ofw.trx，然后恢复出厂设置。

## 挂载路由器外接硬盘

刷完梅林固件后，终于可以将我的外接硬盘挂载到路由器上了。下载了华硕的AiCloud应用，挺好的，方便远程上传照片。设置时端口号要选一个不常用的，常用的端口都被电信封杀了。

大硬盘挂载到了路由器上是方便文件的存取，但是树莓派上就没法存大文件。折腾了一下，发现原来可以将连接在路由器上的硬盘挂载到树莓派上，瞬间感觉完美了。

进行挂载前，需要先进入路由器USB相关应用->媒体服务器->网络共享(Samba)，启用网上邻居共享，并设置访问账号以及可以访问的目录。

具体挂载步骤：

1\. 树莓派上安装smbclient
``` bash
sudo apt-get install smbclient
```
2\. 查看路由器Samba共享文件
``` bash
sudo smbclient -L //router_ip -U samba_访问账号
```
{% asset_img smb_list_share.png 查看Samba共享 %}
注意Sharename不是你硬盘上的文件夹名字了，如图中所示，我在sda1分区有一个`pictures`文件夹，它的Sharename为`pictures (at sda1)`，所以它的samba访问路径为`//router_ip/pictures (at sda1)`。一开始我一直以为是`//router_ip/pictures`路径，结果出现了下面的错误，害我折腾了好久。。。
``` bash
mount error(6): No such device or address

tree connect failed: NT_STATUS_BAD_NETWORK_NAME
```
3\. 挂载。要确保挂载目录存在以及你拥有写权限
``` bash
sudo mount -t cifs "//router_ip/sharename" /mnt/mount_point -o user=username,password=password,workgroup=workgroup
```
4\. 加入`/etc/fsta`，开机自动挂载
``` bash
//router_ip/sharename /mnt/mountpoint cifs defaults,username=username,password=password,uid=username,gid=usergroup,nofail 0 0
```

路径中有空格的话，使用`\040`来替代。如果不希望密码明文下载`/etc/fstab`文件里，可以参考[Samba使用][samba]里的方法。

参考：
1. [Samba使用][samba]
2. [fstab使用][fstab]

[samba]: https://wiki.archlinux.org/index.php/Samba_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#Manual_mounting 
[fstab]: https://wiki.archlinux.org/index.php/Fstab_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)


## 使用感受

贵的路由器就是稳定的多，游戏过程中没发现有波动，一直维持60~70ms的延迟。穿墙能力并不是特别强吧，在卧室里能上网了，但是网络不稳定。

~~梅林固件暂时没发现什么问题，也挺稳定的。迅雷下载可以正常使用，其他功能还没有去捣鼓。唯一可能的问题是之前小米2A能够连上5G无线网络，但是现在发现不了5G网络，但是iphone5s能够正常连接，有时间再看看是怎么回事。~~经过测试发现是因为小米2A手机不支持某些频段，固定在149频段后，小米2A能够搜索到5G网络。

另外发现论坛上不少人说Kong的DD-wrt固件不错，等以后发现梅林不行了再看看，先记着。
