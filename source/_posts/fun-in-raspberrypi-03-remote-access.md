title: 树莓派折腾记：远程访问
comment: true
date: 2016-01-14 18:34:15
updated: 2016-01-14 18:34:15
tags:
  - 树莓派
  - 技术
categories:
  - 技术
permalink: fun-in-raspberrypi-03-remote-access
---

之前由于电信一直给我分配的是100.XX开头的内网IP地址，我使用了花生壳树莓派内网版服务来从进行远程访问树莓派。最近从公网访问树莓派比较频繁，越发觉得花生壳服务的不稳地，经常掉线(这当然是因为我是免费版用户......)。

网上查了下，发现有不少人抱怨电信将公网IP改内网IP的行文，有人说可以打10000要求改回公网IP。于是我就试着打电话给电信，跟客服说我要远程访问家里的监控摄像头，需要公网IP地址。客服MM估计误会我的意思了(可能认为我是需要固定IP地址？)，跟我说会安排师傅上门服务。我当时就懵了，改个IP地址还需要上门？不过人家这么说，我也就答应了，毕竟我也没改过，不知道电信那边究竟是怎么处理的。过一会电信负责维修的部门打电话来问我之前是不是报修故障了，他说不明白客服MM给他们提的单。于是我跟他说你们现在给我分配的是内网IP，我需要公网IP地址，这个改IP地址你们还需要上门来嘛？毕竟是搞技术的，一听我完就明白了，说我这边后台给你改一下就行，还跟我说这两天由于交换机的问题，小区的网络会有些不稳定，这两天会更换设备。

<!-- more -->

过了几分钟，我重新拨号上网，发现路由器IP地址果然变成`59.41.XX`开头的公网IP地址了，`ping`了一下，发现延迟在10ms以内，顿时大为欢喜，再也不用忍受不稳定的花生壳了。赞一下，电信的服务还是不错的~~~

有了公网IP地址后，从远程访问树莓派就变得简单了。我们可以直接通过IP地址来访问；也可将设置一个域名解析到这个IP地址，然后通过域名访问，这样更方便记忆。由于电信拨号上网每回得到的IP地址都是不一样的，因此在通过域名访问时需要`DDNS`技术来更新域名指向的IP地址。

## 域名设置

要使用域名访问，你首先得有一个自己的域名！我的域名解析使用[DNSPOD](https://www.dnspod.cn/)的服务，他们家提供的免费服务还是相当不错的。下面的设置是基于`DNSPOD`，如果你是其他服务商，请参考他们的文档。

### 1. 添加A记录
在你托管的域名下面，添加一个二级域名的A记录。IP地址填你路由器现在分配到的IP地址，TIL填最小值120。
{% asset_img domain_a_record.png 添加A记录 %}

几分钟后，运行`ping 你的二级域名`，看是否正确的解析到你设置的IP地址。

{% asset_img ping_domain.png 测试域名对应ip %}

### 2. 安装运行dnspod_ddns

`dnspod_ddns`是一个动态更新`DNSPOD`的DNS记录的工具。它能在路由器IP地址发生变化时更新`DNSPOD`上A记录对应的IP地址。

**安装配置**
``` bash
git clone https://github.com/leeyiw/dnspod_ddns.git
cd dnspod_ddns
sudo pip install -r requirements.txt
sudo pip install docopt
chmod a+x dnspod_ddns.py
```

安装完成后，修改`config.py`文件，将`LOGIN_EMAIL`，`LOGIN_PASSWORD`，`SUB_DOMAIN`，`DOMAIN`替换为你的信息。

**运行**

1\. 以守护进程方式运行
``` bash
sudo ./dnspod_ddns.py -d start
```

2\. 开机自动运行
在`/etc/rc.local`文件`exit 0`之前添加下面内容
``` bash
sudo /path_to_dnspod_ddns/dnspod_ddns.py -d start
```

经过上面设置后，即使路由器的IP地址发生了变化，你也可以通过域名来访问变化后的IP地址。

## 路由器端口映射

树莓派是处于我们家庭路由器组建的局域网中，要想经过路由器的IP地址访问树莓派，我们还需要进行端口映射。

进入路由器页面，找到高级用户->虚拟服务器设置添加端口映射。建议只添加两个端口映射，一个用于SSH，一个用于HTTP，降低被黑客入侵的风险。其他需要访问内部的服务可以通过[HTTP反向代理](https://www.nginx.com/resources/admin-guide/reverse-proxy/)或者[SSH动态转发](https://www.ibm.com/developerworks/cn/linux/l-cn-sshforward/)搞定。

{% asset_img port_map_on_router.png 路由端口映射 %}

在树莓派上通过Nginx创建一个监听`80`端口的站点(添加Nginx 基本使用链接)，用我们设置的域名以及映射的端口作为访问地址，你就能看到树莓派上创建的站点页面。同时你也能够使用域名和端口地址SSH远程登录树莓派。

> 电信封掉了80端口的访问，因此HTTP服务端口映射时需要选择其他服务端口。在设置好端口映射后，可以通过[端口扫描工具](http://tool.chinaz.com/port/)来查看是否可以访问
