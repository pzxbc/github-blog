title: 稳定的Socks代理：AutoSSH+SSH动态端口转发
comments: true
date: 2016-03-16 21:38:53
updated: 2016-03-16 21:38:53
tags:
  - 技术
  - Linux
  - AutoSSH
  - SSH
categories:
  - 技术
permalink: autossh-ssh-proxy
---

## SSH动态端口转发

SSH动态端口转发将各种数据转发到远程端口，实际上相当于在本地电脑的指定端口开了一个SOCKS代理。如果你的远程主机位于墙外，这个SOCKS代理就能为你提供"翻墙"功能。

SSH动态端口转发命令

``` bash
ssh -g -C -o ServerAliveInterval=60 -o StrictHostKeyChecking=no -i /xxx/path/your_private_key -p 8443 -D 7071 username@yourhost
```

<!-- more -->

## AutoSSH
AutoSSH是一个用来启动ssh并进行监控的程序，可在需要时重启 ssh，例如程序挂掉或者是网络出现问题。

### AutoSSH安装

``` bash
sudo apt-get install autossh
```

### AutoSSH使用

``` bash
autossh [-V] [-M port[:echo_port]] [-f] [SSH_OPTIONS]
```

具体参数解释参考`man autossh`

## 开机启动AutoSSH

如果你经常需要通过SSH代理，那么设置AutoSSH开机启动会方便很多。

### Crontab脚本

在`/etc/cron.d/`目录下，添加启动文件`autossh`，内容如下：

``` bash
# /etc/cron.d/autossh: start autossh for ssh forward on system start

@reboot root (sleep 150 && sudo autossh -M 40000 -g -2 -N -C -o ServerAliveInterval=60 -o StrictHostKeyChecking=no -i /xxx/path/your_private_key -p 8443 -D 7071 username@yourhost) &
```

### UpStart脚本

在`/etc/init`目录下添加`autossh.conf`文件，内容如下：

``` bash
# autossh startup Script

description "autossh daemon startup"

start on net-device-up IFACE=eth0
stop on runlevel [01S6]

respawn
respawn limit 5 60 # respawn max 5 times in 60 seconds

script
export AUTOSSH_PIDFILE=/var/run/autossh.pid
export AUTOSSH_POLL=60
export AUTOSSH_FIRST_POLL=30
export AUTOSSH_GATETIME=0
export AUTOSSH_DEBUG=1
autossh -M 0 -4 -N USER@HOSTNAME -D 7070 -o "ServerAliveInterval 60″ -o "ServerAliveCountMax 3″ -o BatchMode=yes -o StrictHostKeyChecking=no -i SSH_KEY_FILE_PATH
end script
```

**注意：**两种方式中SSH选项中一定要添加`-N`选项，`-N`代表不执行远程指令，也就不会创建交互式Shell，启动脚本在执行时是没法创建交互式Shell的；因为`-N`选项只在SSH协议v2中有效，如果SSH协议默认版本为SSHProtocolv1，可以通过`-2`选项强制使用SSHProtocolv2。如果不指定`-N`选项，会在`syslog`中看到如下错误：
``` bash
ssh exited prematurely with status 0; autossh exiting
```
## SSH命令参数

> -g: 允许其他机器连接本机SSH转发端口
> -C: 请求压缩所有数据
> -o: 指定配置选项，格式同`ssh_config`
> -i: 指定私钥文件
> -p: 指定远程服务器的端口
> -D: 指定本机动态转发端口
> -2: 强制使用ssh协议版本2
> -N: 不执行远程指令

## 参考

1. http://www.oschina.net/translate/automatically-restart-ssh-sessions-and-tunnels-using-autossh
2. http://serverfault.com/questions/507348/autossh-error-with-upstart-script-ssh-exited-prematurely-with-status-0
