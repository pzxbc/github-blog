title: SSH使用指南
comments: true
date: 2016-01-29 19:03:57
updated: 2016-01-29 19:03:57
tags:
  - 技术
  - SSH
permalink: ssh-usage
---

SSH是一种网络协议，用于计算机之间的加密登录。

## 基本使用

使用账号`test_user`登录远程主机`host`
``` bash
ssh test_user@host
# 或者
ssh -l test_user host
```

SSH默认使用端口号22，如果更改过远程主机的SSH服务端口号，那么在登录时应该指定端口号
``` bash
ssh -p 2222 test_user@host
```

<!-- more -->

使用公钥方式登录
``` bash
ssh -i private_key_file test_user@host
```

## SSH隧道

SSH隧道是将另外一种网络协议通过SSH转发，又称为SSH端口转发。SSH隧道有三种类型：动态端口转发(Socks代理)、本地端口转发、远程端口转发。SSH隧道需要在登录的同时建立，登录成功后不能再建立SSH隧道。

### 动态端口转发

{% asset_img ssh-dynamic-port-forward.png SSH动态端口转发 %}

SSH动态端口转发应用如上。将本地应用请求转发到远程主机执行，远程主机再将请求的结果返回给本地应用。

``` bash
ssh -D [bind_address:]7070 test_user@host
```

`bind_address`默认为`localhost`，如果要支持其他计算机通过本机的`7070`端口进行转发，那么要将`bind_address`设为`0.0.0.0`，或者使用`-g`选项。

如果登陆成功后就被强制退出，那是因为SSH服务器禁止账号登录请求Shell终端，不能执行远程命令。使用选项`-N`来解决问题。

``` bash
# -N：不执行远程命令
ssh -N -D 7070 test_user@host
```

如果只想使用SSH隧道，不需要登陆远程主机进行操作，可以使用后台运行选项`-f`。

SSH隔一段时间没操作，服务端会自动关闭这个连接。会出现如下错误

``` bash
Write failed: Broken pipe
```

可以通过每隔一段时间发送保持活动状态消息来保持连接。

``` bash
ssh -Nf -o ServerAliveInterval=60 -D 7070 test_user@host
```

### 本地端口转发

将远程主机能够访问到的地址和端口映射为本地的端口。

{% asset_img ssh-local-port-forwarding-example.png SSH本地端口转发 %}

使用命令

``` bash
ssh -L [bind_address:]port:other-host:other-host-port test_user@host
```

`bind_address`通动态端口转发，other-host也可以就是SSH登录的远程主机host。这种方法相对于动态端口转发在于无需设置代理，但是每个应用需要使用的端口都需要单独配置转发。

### 远程端口转发

远程端口转发应用与某些单向阻隔的网络环境，比如我们不能SSH登录远程主机，但是从远程主机可以SSH登录我们本机(这时本机是SSH服务端)，当SSH登录本机时，可以建立一个远程端口转发，将本机的某个端口绑定到远程主机内网中某台机器的端口，实现从本机访问远程主机内网的应用。

{% asset_img ssh-remote-port-forwarding-example.png SSH远程端口转发 %}

使用命令

``` bash
ssh -R [bind_address:]port:other-host:other-host-port test_user@host
```

## 远程操作

SSH不仅可以进行远程主机登录，还可以直接在远程主机上执行操作。

将`$HOME/src/`目录下所有文件复制到远程主机的`$HOME/src`目录
``` bash
cd && tar czv src | ssh test_user@host 'tar xz'
```

将远程主机`$HOME/src`目录下所有文件复制到本机用户当前目录
``` bash
ssh test_user@host 'tar cz src' | tar xzv
```

## 使用配置文件

使用`~/.ssh/config`配置文件能够极大地方便我们使用SSH。编辑`~/.ssh/config`；如果不存在，就创建该文件。

``` bash
# 密码方式
Host dev
    HostName dev.example.com
    Port 22000
    User fooey
```
配置后，我们可以直接在Shell中使用`ssh dev`进行登录操作。

其他操作配置
``` bash
# 公钥方式
Host github-project1
    User git
    HostName github.com
    IdentityFile ~/.ssh/github.project1.key
    # 本地端口转发
    LocalForward 9906 127.0.0.1:3306
Host github-test1
    User git
    HostName github.com
    # 远程端口转发
    RemoteForward 9906 192.168.1.10:3306
Host github.com
    User git
    IdentityFile ~/.ssh/github.key
    # 动态端口转发
    DynamicForward 7070
    # 每隔60秒发送消息保持活动状态
    ServerAliveInterval 60
```

## 远程主机SSH服务配置

### 1. 生成公钥登录需要的秘钥

``` bash
ssh-keygen
```

### 2. 配置公钥登录方式

将公钥添加到远程主机`~/.ssh/authorized_keys`文件中，并将`authorized_keys`权限设为`600`。推荐使用`ssh-copy-id`命令来上传公钥。
``` bash
ssh-copy-id -i pub_key_file [-p port] test_user@host
```

部署成功后，使用下面命令测试登录
``` bash
ssh -i private_key [-p port] test_user@host
```

### 3. 禁止密码登录

配置好公钥登录方式后，可以禁止密码登录，防止暴力破解攻击。编辑`/etc/ssh/sshd_config`配置文件
``` bash
PasswordAuthentication no
ChallengeResponseAuthentication no
```

## 参考
1. [SSH原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)
2. [使用配置文件简化SSH操作](http://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/)
3. [SSH动态端口转发](http://www.chenyudong.com/archives/linux-ssh-port-dynamic-forward.html)
4. SSH隧道使用： [1](http://codelife.me/blog/2012/12/09/three-types-of-ssh-turneling/)，[2](https://rufflewind.com/2014-03-02/ssh-port-forwarding/)
5. [SSH配置文件说明](http://linux.die.net/man/5/ssh_config)
