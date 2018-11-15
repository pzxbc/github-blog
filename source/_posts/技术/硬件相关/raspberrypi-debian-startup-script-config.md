title: Debian(树莓派)开机启动脚本设置
date: 2016-03-08 20:17:37
updated: 2016-03-08 20:17:37
tags:
  - 技术
  - Linux
  - Debian
  - 树莓派
permalink: raspberrypi-debian-startup-script-config
---

树莓派是基于Debian系统的，因此本文所述的方法应该适用于类Debian的系统，包括Ubuntu。

## Debian运行级别

为了更好的理解启动脚本的设置，我们需要先了解下Debian系统中的运行级别。

* 0 - 停机（千万不要把initdefault设置为0 ）
* 1 - 单用户模式(单用户模式，只允许root用户对系统进行维护。)
* 2 - 多用户，但是没有NFS
* 3 - 完全多用户模式(字符界面)
* 4 - 基本不用
* 5 - X11(图形界面)
* 6 - 重新启动（千万不要把initdefault设置为6 ）

<!-- more -->

查看当前系统的运行级别

``` bash
runlevel
```

## `/etc/rcN.d`目录

通常系统启动后先执行`/etc/rcS.d/`目录下的脚本，然后根据运行级别，执行对应`/etc/rcN.d/`目录下的脚本(`N`为系统运行级别)。

下面是`/etc/rc5.d`目录下的内容
``` bash
lrwxrwxrwx 1 root root  24 Dec 30 15:56 K02gmediarenderer -> ../init.d/gmediarenderer
lrwxrwxrwx 1 root root  16 Jan 24 23:52 K02mopidy -> ../init.d/mopidy
lrwxrwxrwx 1 root root  18 Jan 24 23:55 K02upmpdcli -> ../init.d/upmpdcli
-rw-r--r-- 1 root root 677 Apr  7  2015 README
lrwxrwxrwx 1 root root  18 Sep 24 21:21 S01bootlogs -> ../init.d/bootlogs
lrwxrwxrwx 1 root root  16 Sep 24 22:33 S01dhcpcd -> ../init.d/dhcpcd
lrwxrwxrwx 1 root root  17 Oct 21 13:27 S01hd-idle -> ../init.d/hd-idle
lrwxrwxrwx 1 root root  17 Sep 24 21:33 S01ifplugd -> ../init.d/ifplugd
lrwxrwxrwx 1 root root  14 Jan 14 14:37 S02dbus -> ../init.d/dbus
lrwxrwxrwx 1 root root  21 Mar  3 16:04 S02ddns-dnspod -> ../init.d/ddns-dnspod
lrwxrwxrwx 1 root root  17 Jan 15 13:02 S02dnsmasq -> ../init.d/dnsmasq
lrwxrwxrwx 1 root root  24 Jan 14 14:37 S02dphys-swapfile -> ../init.d/dphys-swapfile
lrwxrwxrwx 1 root root  22 Jan 14 20:58 S04avahi-daemon -> ../init.d/avahi-daemon
lrwxrwxrwx 1 root root  14 Jan 14 20:58 S04cron -> ../init.d/cron
lrwxrwxrwx 1 root root  17 Jan 14 20:58 S04lightdm -> ../init.d/lightdm
lrwxrwxrwx 1 root root  15 Jan 15 13:02 S04nginx -> ../init.d/nginx
lrwxrwxrwx 1 root root  15 Jan 14 20:58 S04rsync -> ../init.d/rsync
lrwxrwxrwx 1 root root  18 Jan 24 23:52 S05plymouth -> ../init.d/plymouth
lrwxrwxrwx 1 root root  18 Jan 24 23:52 S05rc.local -> ../init.d/rc.local
lrwxrwxrwx 1 root root  19 Jan 24 23:52 S05rmnologin -> ../init.d/rmnologin
```

我们可以看到有`K`和`S`开头的文件，`K`代表关闭，`S`代表启动，后面紧跟的数字代表启动顺序，数字越大启动或关闭就越靠后。目录下的每一个文件都指向了`/etc/init.d`目录中的文件，开机启动脚本就是放在这个目录下的。

> 文件中代表启动顺序的数字是根据依赖关系自动设置的，在新版的`update-rc.d`命令中无法手动设置这个数字。查看是否可以手动设置参看`man update-rc.d`说明。

## 添加新的启动脚本

在`/etc/init.d`目录下新建一个文件，并添加执行权限`sudo chmod a+x xxx_script`。

``` bash
#!/bin/sh
### BEGIN INIT INFO
# Provides:          ddns-dnspod
# Required-Start:    $local_fs $remote_fs $network $syslog
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the ddns-dnspod service
# Description:       starts the ddns-dnspod service
### END INIT INFO

case "$1" in
    start)
    echo "start ddns-dnspod"
    sudo /home/pi/work/projects/dnspod_ddns/dnspod_ddns.py -d start
    ;;
    stop)
    sudo /home/pi/work/projects/dnspod_ddns/dnspod_ddns.py -d stop
    ;;
    restart)
    sudo /home/pi/work/projects/dnspod_ddns/dnspod_ddns.py -d restart
    ;;
    *)
    echo "Usage: $0 (start|stop)"
    ;;
esac
exit 0
```

上面是一个ddns的开机启动脚本。我们需要在启动脚本的注释中写明启动依赖和在那些运行级别启动。具体的依赖名写法可以参考[这里](https://wiki.debian.org/LSBInitScripts)。

当在`/etc/init.d`目录下添加新的启动脚本后，我们最好先进行下测试，执行下各种选项确保正常运行。
``` bash
sudo /etc/init.d/xxx_script start
sudo /etc/init.d/xxx_script stop
```

## update-rc.d命令

在`/etc/init.d`目录下添加启动脚本后，我们需要使用`update-rc.d`命令设置脚本开机启动。

``` bash
sudo update-rc.d xxx_script defaults
```

执行完上面命令后，查看`/etc/rcN.d`目录中是否有指向`xxx_script`文件的启动和关闭文件。另外还会向`/run/systemd/generator.late/`目录添加一个service，这样我们就可以使用`sudo service xxx_script start|stop`命令来控制脚本运行。

`update-rc.d`其他参数用法

``` bash
# 移除开机启动连接(/etc/rcN.d 目录下的文件)
sudo update-rc.d xxx_script remove
# 启用或者禁用开机启动
sudo update-rc.d xxx_script enable|disable
```

