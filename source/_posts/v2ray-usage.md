title: v2ray使用
toc: true
date: 2016-10-19 19:15:03
updated: 2018-2-24 19:40:06
tags:
  - 技术
  - v2ray
categories:
  - 技术
permalink: v2ray-usage
---

v2ray是新一代理软件，原生支持Socks、HTTP、Shadowsocks、VMess等协议，内置路由功能，可以选择性转发或者阻止连接。使用v2ray，你需要在墙外有一台可以安装v2ray的服务器（支持Windows、Linux、MacOS、FreeBSD系统），然后在需要翻墙的设备上安装v2ray客户端；另外还可以通过在墙内配置一台v2ray中转服务器，用户直接通过浏览器HTTP代理或者Socks代理连接中转服务器，而中转服务器连接墙外的v2ray（文中使用的就是这种方式）。

<!-- more -->

## 安装

在使用`yum`或者`apt-get`包管理的系统，可以使用下面命令一键安装，其他系统请参考[官方文档](https://www.v2ray.com/)

``` bash
sudo su
bash <(curl -L -s https://install.direct/go.sh)
```

此脚本会自动安装以下文件
* /usr/bin/v2ray/v2ray (v2ray程序)
* /etc/v2ray/config.json (v2ray配置文件)

此脚本会配置v2ray为service，系统重启后会自动启动v2ray服务。`service`文件位于下面位置
* /lib/systemd/system/v2ray.service (Systemd)
* /etc/init.d/v2ray (SysV)

脚本安装完毕后，你需要进行下面操作：

1. 编辑/etc/v2ray/config.json文件来配置v2ray
2. 运行v2ray `sudo service v2ray start`
3. 使用`sudo service v2ray start|stop|status|reload`控制和查看v2ray

~~> v2.3版本运行时会出现`[Warning]Router: invalid network mask: 128`，忽略即可，开发者说是在下一个版本修复。~~

## 配置

### 墙内中转服务器配置

1. 支持不同协议接入：Sockets、Http、端口转发
2. 支持TCP和UDP传出链接。根据策略来选择不同的连接
3. 不同IP地址是否转发由路由器的iptables决定
4. 转发Dnsmasq请求

{% asset_link inner_config.json_bak 中转配置 %}

注意：`vmess`协议一定要配置`users`域，不然启动会出现错误。`id`为uuid，需要与服务端配置相同，可以在[这里](https://www.uuidgenerator.net/)生成

### 墙外服务器配置

1. 支持不同传入链接
2. 支持动态端口

{% asset_link outer_config.json_bak 外服配置 %}
