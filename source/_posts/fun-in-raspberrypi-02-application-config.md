title: 树莓派折腾记：软件包管理器及应用设置
comment: true
date: 2016-01-05 16:21:45
updated: 2016-01-05 16:21:45
tags:
  - 树莓派
  - 技术
categories:
  - 技术
permalink: fun-in-raspberrypi-02-application-config
---

在[基础使用](/2016/01/03/fun-in-raspberrypi-01-basic-usage)一文中介绍了树莓派及其系统安装使用。本文介绍树莓派中软件包管理器的设置以及基础应用软件包的安装设置。

## 1 软件包管理器及软件源设置

树莓派是基于**Debian**的系统，包管理器也是`apt-get`。关于`apt-get`的介绍、在软件安装中的作用以及与`dkpg`的关系请看[Wiki](https://wiki.debian.org/Apt)。`apt-get`工具主要是处理软件包的各种依赖关系并获取软件安装过程需要的各种安装包，`dkpg`负责实际的软件安装工作。

### 1.1 使用包管理器安装应用软件

``` bash
# 安装软件
sudo apt-get install xxx
# 卸载软件
sudo apt-get remove xxx
# 清除无用软件包
sudo apt-get autoremove
# 更新软件源的软件包信息，在配置新的软件源后运行
sudo apt-get update
```

### 1.2 配置软件源

`sources.list`里设置了各种不同软件源的地址，`apt-get`在软件源列表中搜索我们想要安装的软件。

配置软件源地址的方法有两种：一是直接在`/etc/apt/sources.list`文件中添加软件源地址；二是将软件源地址单独写入一个后缀为list的文件，并将文件放置于`/etc/apt/sources.list.d`。具体配置方法参考`man sources.list`所示的文档。

### 1.3 使用镜像地址

树莓派的官方软件源位于国外，通过使用国内的镜像软件源，我们可以加快下载软件包的速度。国内的镜像源推荐[阿里](http://mirrors.aliyun.com/help/raspbian)和[中科大](https://lug.ustc.edu.cn/wiki/mirrors/help/raspbian)，公网建议阿里镜像源地址放在`/etc/apt/sources.list`文件最前面，教育网则优先使用中科大。

> 官方软件源[列表](http://www.raspbian.org/RaspbianMirrors)

### 1.4 加速软件包下载

`apt-get`工具`wget`来下载软件包，类似于`IE浏览器`自带的下载功能，没有使用加速手段。我们可以通过使用[**apt-metalink**](https://github.com/tatsuhiro-t/apt-metalink)工具来加速软件包的下载，它基于`aria2`，能够从多个软件源处下载软件包，最大化地利用网络带宽来下载软件包。

安装`apt-metalink`工具

``` bash
sudo apt-get install aria2
sudo apt-get install python-apt
cd /usr/local/bin
sudo wget https://raw.githubusercontent.com/tatsuhiro-t/apt-metalink/master/apt-metalink
sudo chmod a+x apt-metalink
```

使用`apt-metlink`

> Usage: sudo apt-metalink [options] {upgrade | dist-upgrade | install pkg ...}
>
> Options:
>   -h, --help            show this help message and exit
>   -d, --download-only   Download only. [default: False]
>   --print-metalink      Instead of fetching the files, Metalink XML document is printed. Metalink XML document contains package's URIs and checksums.
>   --hash-check          Check hash of already downloaded files. If hash check fails, download file again.
>   -x ARIA2C, --aria2c=ARIA2C path to aria2c executable [default: /usr/bin/aria2c]

## 2 应用设置

### 2.1 IP设置

给树莓派设置一个静态IP地址，会方便以后通过IP地址访问树莓派。具体设置方法如下：

修改`/etc/network/interfaces`中`eth0`部分为：

``` bash
auto eth0
allow-hotplug eth0
iface eth0 inet static
address 192.168.10.123
netmask 255.255.255.0
gateway 192.168.10.1
```

重启网络服务
``` bash
sudo service networking restart
```

> 1. 上面方法是针对有线连接的情况，如果树莓派是通过无线连接到路由器的话，请修改`wlan0`部分。
> 2. 路由器的DHCP服务设置里面可以根据MAC地址来绑定IP地址，但是这种方法要等到DHCP服务给树莓派分配IP后，树莓派才会有一个有效的IP地址。使用上面的方法，树莓派在启动后就会有一个有效的IP地址。

### 2.2 远程访问

如果你的运营商给你分配了一个公网IP地址，那么你可以通过[DDNS技术](https://en.wikipedia.org/wiki/Dynamic_DNS)来访问你的树莓派。现在的路由器一般都带花生壳DDNS配置功能，你需要申请一个花生壳账号和配置好树莓派的端口映射，这样你就可以在任意其他地方访问到你的树莓派。

如果你使用的是一个大局域网的运营商服务(我用的电信就是。。。)，那么你可以通过花生壳内网版来访问树莓派。

**花生壳内网版安装**

1. 下载{% asset_link phddns_raspberry.tgz %}
2. 解压`tar zxvf phddns_raspberry.tgz`
3. 进入`phddns2`目录，执行`sudo ./oraynewph start`，提示`Oraynewph start success`表示成功安装执行

**使用帮助**
``` bash
# 查看状态
sudo oraynewph status
# 停止花生壳服务
sudo oraynewph stop
# 启动花生壳服务
sudo oraynewph start
```

在设置好花生壳内网版服务后，登录`b.oray.com`网站，添加一个映射对应树莓派的SSH服务后，我们会得到一个域名和端口用于远程SSH登录树莓派。

**{% asset_link raspberrypi_oray_service.pdf 图文版教程请看这里 %}**

我使用的是花生壳内网没费版(交了8元的什么测试费吧)，确实如它官方所说很不稳定，经常出现`ssh connection closed by foreign host`，有时删除旧的映射重新添加下又好了。不过也无所谓，也就是偶尔`SSH`登陆下。

> 技术上说，花生壳内网版就是在你的树莓派上运行着一个进程，它会与花生壳的外网机器（固定IP）进行连接。花生壳的外网机器作为你与树莓派通信的中间人，会将你发给它的数据中转给树莓派。所以你如果有一台外网机器就可以自己进行中转。

**更新：受不了花生壳内网免费版的不稳定，打电话要电信要求换公网IP地址，公网IP树莓派访问参考[这里](/2016/01/14/fun-in-raspberrypi-03-remote-access)**

### 2.3 PIP使用设置

**PIP**是Python的包管理工具，为我们安装Python第三方扩展包提供了方便。

**使用**

``` bash
# latest version
sudo pip install SomePackage   
# specific version
sudo pip install SomePackage==1.0.4    
 # minimum version
sudo pip install 'SomePackage>=1.0.4'
# specified base of python package index
sudo pip install SomePackage -i <url>
# uninstall package
pip uninstall SomePackage
# search package
pip search "query"
```

**配置**

**PIP**的用户配置文件位于`$HOME/.config/pip/pip.conf`，全局配置文件位于`/etc/pip.conf`。

``` bash
[global]
timeout = 60
index-url = http://mirrors.aliyun.com/pypi/simple/
```

`index-url`配置Python包索引地址，推荐配置为国内的镜像源，加快包下载速度。国内速度快的有[阿里](http://mirrors.aliyun.com/pypi/simple/)和[中科大](https://pypi.mirrors.ustc.edu.cn/simple/)

> [PIP官方文档](https://pip.pypa.io/en/stable/)

### 2.4 FTP服务器

给树莓派安装FTP服务器，方便平时上传/下载文件。

**安装使用**

``` bash
# 安装
sudo apt-get install vsftpd
# 运行
sudo service vsftpd start
# 重启
sudo service vsftpd restart
```

**配置**

修改`/etc/vsftpd.conf`配置文件如下。配置完成后需要重启vsftpd服务。

``` bash
# 不允许匿名
anonymous_enable=NO
# 本地用户访问
local_enable=YES
# 可以进行写操作
write_enable=YES
```

> 如果没有设置`write_enable=YES`，那么上传文件时会遇到550错误(550 Permission denied)。

### 2.5 Nginx安装

``` bash
# 安装
sudo apt-get install nginx
# 启动
sudo /etc/init.d/nginx start
```

* 默认站点位置`/usr/share/nginx/html`
* 配置站点配置文件`/etc/nginx/sites-available/default`

### 2.6 Glances安装

[Glances](https://github.com/nicolargo/glances)是一个跨平台的系统性能监视工具，能够方便地在一个页面上查看CPU、内存、磁盘等使用数据和当前运行进程状态。

**安装**

``` bash
sudo apt-get install lm-sensors
sudo pip install glances
```

### 2.7 存储设备使用

当我们将U盘、移动硬盘或者外接硬盘通过USB连接到树莓派后，我们需要进行挂在操作后才能正常使用这些存储设备。

#### 挂载使用

1\. 查看连接到USB接口上的存储设备，确认设备已经被识别。`Device`信息中的`/dev/sda`表示U盘、硬盘等设备，`/dev/mmc`表示TF、SD卡类。
``` bash
sudo fdisk -l
```
2\. 当设备被正确识别后，就可以进行挂载。
``` bash
# 新建挂载目录
sudo mkdir /mnt/usb_flash
# 挂载设备
sudo mount -o uid=pi,gid=pi /dev/sda1 /mnt/usb_flash/
# 查看挂载是否成功
df -h
```
3\. 当设备读写完毕后，取消挂载后就可以拔出设备
``` bash
sudo umount /mnt/usb_flash
```
4\. 提示设备忙，查找占用进程，kill之后重新取消挂载。
``` bash
# umount: /mnt/usb: device is busy
# 查找关联进程
sudo lsof /mnt/usb
# 杀掉相关进程
sudo kill xxx
```
5\. 自动挂载。每次手动挂载存储设备比较麻烦。我们可以在`/etc/fstab`文件中添加需要自动挂载的设备。

首先我们查看我们需要挂载设备的标识符。
``` bash
sudo blkid
```

有了标识符后，我们在`/etc/fstab`中添加新的条目。详细条目设置参考`man fstab`。
``` bash
# 设备标识符 挂载点 文件系统格式 挂载选项 dump命令使用 fsck命令使用
UUID="xxx" /mnt/sync ext4 defaults 0 0
```

添加了新的条目后，在设备插入系统后就会自动挂载。如果已经插入系统上，可以使用`sudo mount 设备标识符`进行挂载。

#### 分区格式化

1\. 硬盘分区。大于2TB的硬盘需要使用GPT分区表。GPT分区表是现在标准的分区格式，兼容MBR分区表格式，因此建议都使用GPT分区表。
``` sudo
fdisk /dev/sda
```
2\. 格式化分区。参数`-m`设置文件系统保留空间。
``` bash
# 格式化ext4格式
mkfs.ext4 -m 1 /dev/sda1
# 调整保留空间大小
tune2fs -m 1 /dev/sda1
```

