title: Gitlab安装配置及使用
date: 2016-03-22 20:57:17
updated: 2016-03-22 20:57:17
tags:
  - 技术
  - 树莓派
  - Gitlab
categories:
  - 技术
permalink: gitlab-install-configure
---

gitlab是山寨版的github，它是开源的，你可以在自己的服务器上架设gitlab，用于团队私有项目的托管。gitlab支持树莓派2嵌入式设备，下面记录了在树莓派2上安装与配置gitlab的过程。

## 增加swap空间

gitlab推荐2G内存，树莓派2只有1G内存空间，可以通过增加1G的swap空间来提升性能。

修改`/etc/dphys-swapfile`文件，然后重启树莓派`sudo reboot`。

``` bash
CONF_SWAPSIZE=1024
```

<!-- more -->

查看swap空间大小

``` bash
free -h
```

gitlab硬件配置与性能[参考](http://doc.gitlab.com/ce/install/requirements.html#hardware-requirements)

## 安装

参考[官方文档](https://about.gitlab.com/downloads/#raspberrypi2)

## 配置

### 1\. 更改Web监听端口

在`/etc/gitlab/gitlab.rb`中添加下面选项，然后执行`sudo gitlab-ctl reconfigure`使配置生效。

``` bash
nginx['listen_port'] = 8080
```

### 2\. 使用已安装的Nginx Web Server

参考[官方文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/nginx.md)

需要注意两点：

1\. 记得将`Nginx Web Server`运行账号添加到`gitlab-www`组中

``` bash
sudo usermod -a -G gitlab-www www-data
```

2\. 配置完后，执行`sudo gitlab-ctl reconfigure`后，还要重启系统。不然查看进程，会发现如下错误

> root     11485  0.0  0.0   1836   608 ?        Ss   Mar18   0:02 runsvdir -P /opt/gitlab/service log: .....runsv nginx: warning: unable to open supervise/stat.new: file does not exist runsv nginx: warning: unable to open supervise/stat.new: file does not exist runsv nginx: warning: unable to open supervise/pid.new: file does not exist runsv nginx: warning: unable to open log/supervise/pid.new: file does not exist runsv nginx: warning: unable to open log/supervise/pid.new: file does not exist

### 3\. 配置外部链接

参考[官方文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/configuration.md#configuring-the-external-url-for-gitlab)。如果没有配置该选项的话，默认项目和资源文件的URL路径是相对于机器的主机名。

### 4\. 配置SMTP

默认安装完毕后，可以使用`SendMail`服务来发送邮件，但是发送的邮件没有发件人信息。配置SMTP后，我们可以让gitlab使用QQ、163等邮箱来发送邮件，还可以指定发件人信息以及回复邮箱账号等。

参考[官方文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/smtp.md)

下面是QQ企业邮箱的SMTP配置
``` bash
# smtp
gitlab_rails['gitlab_email_from'] = 'gitlab@pzxbc.com'
gitlab_rails['gitlab_email_reply_to'] = 'xxx@pzxbc.com'

gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.exmail.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "gitlab@pzxbc.com"
gitlab_rails['smtp_password'] = "password"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
```

### 5\. 更改`git data`目录

参考[官方文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/configuration.md#storing-git-data-in-an-alternative-directory)

### 6\. 设置`git data`目录挂载后再启动gitlab服务

参考[官方文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/configuration.md#only-start-omnibus-gitlab-services-after-a-given-filesystem-is-mounted)

### 7\. 调整unicorn进程数，减少内存占用

参考官方文档[1](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/unicorn.md)，[2](https://about.gitlab.com/2015/06/05/how-gitlab-uses-unicorn-and-unicorn-worker-killer/)。在树莓派2上我将进程数调整为2个，暂时没有发现问题。

## 使用

使用root账号登陆后，点击右上角`Admin Area`可以查看gitlab状态以及对其进行各种设置，包括默认项目属性、用户可以创建的项目数等等。

[修改默认可以创建的项目个数对已有的用户不生效](https://gitlab.com/gitlab-org/gitlab-ce/issues/1129)，可以在`Admin Area`中的`Users`单独修改已经存在的用户信息。

## 参考

1. [gitlab文档](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/README.md)
