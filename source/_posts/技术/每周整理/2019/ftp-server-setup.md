title: Ftp服务器搭建
p: 技术/2019/ftp-server-setup.md
date: 2019-05-15 16:45:31
updated: 2019-05-15 16:45:31
permalink: ftp-server-setup.md
tags:
  - ftp
  - debian
---

> 本文记录的是在`Debian 8`服务器上配置FTP服务器的操作以及问题，其他系统不一定适用

工作上的需求，需要搭建一个FTP服务器，本来以为只需要安装完毕，设置下路径就好了。但是一路配置下来，发现又好多坑，简单的事情也不简单:pensive:...


## 1. 安装

在`Debian`上，选用了`vsftpd`来作FTP服务

```bash
sudo apt-get install vsftpd
```

## 2. 配置

安装完毕后，FTP服务就默认启动了，可以使用`sudo service vsftpd status`查看FTP服务状态。`vsftpd`的配置文件路径为`/etc/vsftpd.conf`

### 2.1 创建用户

`vsftpd`可以使用系统用户来登陆，我们先创建一个专门用于FTP登陆的账号

```bash
# 创建用户
sudo groupadd ftpuser
sudo mkdir /home/ftpshare
sudo useradd -g ftpuser remote1
sudo passwd remote1
# 修改文件夹属性
sudo chown -R remote1:ftpuser /home/ftpshare
```

修改`/etc/passwd`，设置用户没有登陆shell，避免FTP用户可以SSH登陆

```
remote1:x:8001:8001::/home/ftpshare:/usr/sbin/nologin
```

### 2.1 FTP配置允许登陆的用户

默认`vsftpd`的配置是允许所有的系统用户登陆的，可以设置指定哪些用户登陆。`/etc/vsftpd.conf`添加下面配置

```
userlist_file=/etc/vsftpd.userlist
userlist_enable=YES
userlist_deny=NO
pam_service_name=vsftpd
tcp_wrappers=YES
```

创建`/etc/vsftpd.userlist`文件，写入允许登陆的用户名

```bash
sudo touch /etc/vsftpd.userlist
sudo echo remote1 > /etc/vsftpd.userlist
```

重启`vsftpd`服务，应用新的配置

```bash
sudo service vsftpd restart
```

### 2.2 问题

**1. 530 Login incorrect**

上面配置完重启后，使用FTP客户端(FileZilla)去登陆FTP服务器后，发现返回这个`530 Login incorrect`错误。这个是由于`vsftpd`的登陆认证使用了`PAM`认证导致的。修改`/etc/pam.d/vsftpd`文件

```
auth required pam_shells.so  => auth required pam_nologin.so
```

修改完后，重启FTP服务就可以正常登陆了。导致这个问题产生的原因在于：之前我们为了避免用户SSH登陆，将用户的登陆Shell设置成了`nologin`，也就是没有登陆Shell，但是在`vsftpd`的`PAM`设置中，要求用户一定要有登陆Shell才能登陆，因此我们将它改成不需要Shell也能认证登陆就可以了。[^1]


**2. 限制访问上级目录**

FTP登陆后，发现可以通过`..`目录访问上级目录，这样对于会泄露其他目录文件信息。添加下面配置来限制访问

```
chroot_local_user=YES
allow_writeable_chroot=YES
```

> `allow_writeable_chroot`用户控制用户目录是否可以写入的。如果没有添加，在上传文件的时候，会提示错误：500 OOPS: vsftpd: refusing to run with writable root inside chroot()

**3. 550 Permission denied**

上述修改后，再次上传文件，发现返回`550 Permission denied`错误，原来是全局没有开写权限。配置文件开启下面选项

```
write_enable=YES
```

重启服务，终于可以正常使用FTP服务了:joy:~~~


[^1]: [`PAM`问题解决](https://www.jianshu.com/p/91c7d4a115e0)
