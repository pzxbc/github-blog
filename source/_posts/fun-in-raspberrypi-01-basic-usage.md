title: 树莓派折腾记：基础使用
comment: true
date: 2016-01-03 16:13:20
updated: 2016-01-03 16:13:20
tags:
  - 技术
  - 树莓派
categories:
  - 技术
permalink: fun-in-raspberrypi-01-basic-usage
---

## 1. 介绍

[树莓派](https://www.raspberrypi.org/)(Raspberry Pi)是一款卡片大小的单板机电脑。它由英国树莓派基金会所开发，目的是以低价硬件及自由软件刺激学校的基本计算机科学教育。有关它的历史、硬件规格及可使用的操作系统请参考[树莓派维基百科](https://zh.wikipedia.org/wiki/%E6%A0%91%E8%8E%93%E6%B4%BE)

这篇文章以及后续相关文章中树莓派的型号及配置环境如下：

* 树莓派B型(第2代)
* 16G MicroSD卡
* Raspbian Jessie ([百度云高速下载](http://pan.baidu.com/s/1ntTT0rn))

<!-- more -->

## 2. 必备配件

如果是单独购买树莓派的话，只会有一块单板机。要想让树莓派运转起来，还需要下面配件。

* **电源适配器**，普通手机的USB充电器(额定输出电压为5V)即可，树莓派的电源接口是MicroUSB接口，所以你还需准备一条MicroUSB的接口线。另外电源的额定输出电流最好为1A~2A，低于1A的输出电流可能会导致树莓派运行不稳定
* **MicroSD存储卡**，官方推荐8G以上
* **网线**，连接树莓派与路由器

## 3. 系统安装

**Raspbian**系统是树莓派官方支持的系统，是在**Debian**的基础上针对树莓派的硬件进行优化修改的。最简易的系统安装方法是使用**NOOBS**，这是一个图形化的系统安装工具，但是需要显示器。

下面介绍的安装方法类似以前Windows的ghost系统安装方法，无需显示器。

1. 下载[Win32 Disk Imager](http://pan.baidu.com/s/1dEwAcnv)并安装。
2. 下载[Raspbian Jessie](http://pan.baidu.com/s/1ntTT0rn)系统，解压得到IMG文件。
3. 将要写入**Raspbian Jessie**系统的Micro SD卡插入电脑。
4. 打开**Win32 Disk Imager**，在界面里选择下载的树莓派系统IMG文件以及MicroSD卡盘符，点击**Write**按钮(**确保MicroSD卡盘符正确**)。
5. 当完成镜像写入MicroSD操作后，系统就已成功安装到MicroSD卡中。

> **Tips:** **Win32 Disk Imager**界面中**Read**按钮可以用来备份树莓派系统

## 4. 登陆系统

将之前安装好系统的MicroSD卡插入树莓派中，并给树莓派插上电源。树莓派就会启动并进入**Raspbian**系统。由于没有显示器，我们可以使用**SSH**的方式登陆系统来使用树莓派。

1. 用网线将树莓派接入路由器中，在路由器管理页面中查看树莓派IP地址。
2. 打开[SSH登陆工具](http://pan.baidu.com/s/1gdNuew7)，配置SSH连接，SSH端口为22，登陆账号为`pi`，账号密码为`raspberry`。
3. 配置完成后点击连接，我们就登陆进**Raspbian**系统中。

## 5. Raspbian基本使用

**Raspbian**是基于**Debian**，如果你熟悉Linux的基本操作，那么使用Raspbian系统时就不会遇到什么问题。

### 5.1 配置Raspbian系统

**Raspbian**提供了一个配置工具来配置系统，运行下面命令打开配置工具

``` bash
sudo raspbi-config
```

我们可以通过配置工具修改很多配置，一般需要修改的配置有下面一些。

1. 使用全部MicroSD卡存储空间(Expand Filesystem)
2. 更改账号密码
3. 更改语言环境(Internationalisation Options)(**需要重启**)

### 5.2 常用命令

``` bash
# root权限执行命令
sudo xxx
# 关机
sudo shutdown -h now
# 定时关机
sudo shutdown -r 04:00:00
# 重启
sudo reboot
# 安装软件
sudo apt-get install xxx
# 后台执行命令
nohup command &
```

## 6. 参考

### 6.1 [Linux进程后台执行](http://www.ibm.com/developerworks/cn/linux/l-cn-nohup/)

### 6.2 Debian中locale和语言环境

1. http://serverfault.com/questions/54591/how-to-install-change-locale-on-debian
2. https://wiki.debian.org/Locale
3. https://wiki.debian.org/ChangeLanguage
