title: 家庭网络自动代理解决方案
comments: true
tags:
  - VPS
  - Vultr
  - EdgeOS
  - V2ray
  - Proxy
  - iptables
  - ipset
  - dnsmasq
permalink: home-router-auto-proxy
date: 2019-01-06 22:25:15
updated: 2019-01-06 22:25:15
---


`Google Cloud`赠送的$300到期了，之前发现连不上`AppleStore`还以为是网络问题，隔天才发现是`Google Cloud`到期导致的。没有了免费的服务器资源，就得去找一个了。通过对比，发现`Vultr`提供的`VPS`服务性价比比较高。每个月$3.5，提供1个CPU、512M内存、500GB/月流量。对于个人日常翻墙访问国外服务绰绰有余了。也有一个月$2.5的，但是只有IPv6地址，如果你是在学校这种有IPv6环境的地方，使用这个套餐相对会省一点。这个是我的邀请链接[https://www.vultr.com/?ref=7748749](https://www.vultr.com/?ref=7748749)，如果这篇文章对你有用，希望您能使用我的邀请链接~

<!-- more -->

服务器建议选择东京或者新加坡的，这样延迟会小一点。测试了下东京延迟150ms左右，新加坡延迟250ms左右。新建好的服务器也不一定能够访问，可能给你分配的IP地址已经被`GFW`封了。可以通过端口检测工具来判断IP地址是否已经被封。在[国内端口测试网站](http://tool.chinaz.com/port/)和[国外端口测试网站](https://www.yougetsignal.com/tools/open-ports/)分别测试服务器IP对应的22端口是否可以访问，如果国外可以访问国内不行，那么这个分配的IP地址已经被封了。可以更换服务器的物理地址或者隔天再重新创建服务器来获取新的IP地址。(立刻销毁，在同一物理地址上重新创建还是会分配原来的IP地址)


上面说这么多，差不多都是在为`Vultr`服务商打广告了。之所以会有这篇文章是因为我在重新搭建自动代理的时候发现需配置的地方还挺多的，还是记录下来，不然以后自己都可能需要重新去查怎么布置。

## 自动代理解决方案框架图


## 服务器配置

服务器上所需要的配置相对来说比较少，只需要安装配置`V2ray`软件即可。

[`V2RAY`](https://www.v2ray.com/)是一个支持多协议的网络请求转发软件，它可以将一个机器上的网络请求转发到远程服务器上，然后将远程服务器返回的结果转发回请求的机器。

### 安装V2ray

我的服务器系统是`Debian`的(Ubuntu应该也适用)，其他系统参考官方文档吧。

``` bash
sudo su
bash <(curl -L -s https://install.direct/go.sh)
```

### 配置V2ray

`V2ray`的配置文件是位于`/etc/v2ray`目录下的`config.json`

下面的配置支持`vmess`的`tcp`和`kcp`的传入链接。如果你的VPS服务器延迟比较严重，建议使用`kcp`协议，有加速的效果。这个网站[https://www.uuidgenerator.net/](https://www.uuidgenerator.net/)可以在线生成`id`。

``` json
{
  "log" : {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warn"
  },
  "inbound": {
    "port": 43608,
    "protocol": "vmess",
    "settings": {
      "clients": [
        {
          "id": "a715b4f3-4b4a-4cbf-8a3e-8ab1a537da2f",
          "level": 1,
          "alterId": 64,
          "email": "yourmail@qq.com"
        }
      ]
    },
    "detour": {
    "to": "detour-kcp"
    },
    "streamSettings": {
        "network": "kcp",
        "kcpSettings": {
          "mtu": 1350,
          "tti": 20,
          "uplinkCapacity": 100,
          "downlinkCapacity": 100,
          "congestion": false,
          "readBufferSize": 2,
          "writeBufferSize": 2,
          "header": {
            "type": "wechat-video"
          }
        }
    }
  },
  "inboundDetour": [
    {
      "protocol": "vmess",
      "port": 43609,
      "tag": "inbound-tcp",
      "settings": {
        "clients": [
          {
            "id": "a715b4f3-4b4a-4cbf-8a3e-8ab1a537da2f",
            "level": 1,
            "alterId": 64,
            "email": "yourmail@qq.com"
          }
        ]
      },
      "streamSettings": {
        "network": "tcp"
      }
    },
    {
      "protocol": "vmess",
      "port": "51001-54000",
      "tag": "detour-kcp",
      "settings": {
        "default": {
          "level": 1,
          "alterId": 64
        }
      },
      "allocate": {
        "strategy": "random",
        "concurrency": 2,
        "refresh": 5
      },
      "streamSettings": {
        "network": "kcp",
        "kcpSettings": {
          "mtu": 1350,
          "tti": 20,
          "uplinkCapacity": 100,
          "downlinkCapacity": 100,
          "congestion": false,
          "readBufferSize": 2,
          "writeBufferSize": 2,
          "header": {
            "type": "wechat-video"
          }
        }
      }
    }
  ],
  "outbound": {
    "protocol": "freedom",
    "settings": {}
  },
  "outboundDetour": [
    {
      "protocol": "blackhole",
      "settings": {},
      "tag": "blocked"
    }
  ],
  "routing": {
    "strategy": "rules",
    "settings": {
      "rules": [
        {
          "type": "field",
          "ip": [
            "0.0.0.0/8",
            "10.0.0.0/8",
            "100.64.0.0/10",
            "127.0.0.0/8",
            "169.254.0.0/16",
            "172.16.0.0/12",
            "192.0.0.0/24",
            "192.0.2.0/24",
            "192.168.0.0/16",
            "198.18.0.0/15",
            "198.51.100.0/24",
            "203.0.113.0/24",
            "::1/128",
            "fc00::/7",
            "fe80::/10"
          ],
          "outboundTag": "blocked"
        }
      ]
    }
  },
  "transport": {
    "kcpSettings": {
      "uplinkCapacity": 100,
      "downlinkCapacity": 100
    }
  }
}
```

### V2ray服务启动

``` bash
sudo systemctl restart v2ray.service
# 查看v2ray服务状态
sudo systemctl status v2ray.service
```

## 路由器配置

家里路由器是`EdgeRouter PoE 5`，系统是基于`debian`的`edgeos`。推荐下这个路由器，公司专注于做企业级的产品，产品非常稳定。当然这种路由器只适合爱折腾的人士，需要有相应的知识才能配置使用。

### V2ray安装 

`ssh`登录路由器

``` bash
# 切换root用户，默认ssh登录账号为ubnt
sudo su
bash <(curl -L -s https://install.direct/go.sh)
```

这个路由器架构是`mips64`，也可以手动下载`v2ray`安装包[v2ray-linux-mips64](https://github.com/v2ray/v2ray-core/releases)

然后使用`go.sh`脚本安装

``` bash
./go.sh -l v2ray-linux-mips64.zip
```

> `uname -a` 查看系统架构

### V2ray配置

路由器上的`V2ray`配置为中转服务器。

下面配置支持一下功能

1. `socks`、`http`代理以及基于端口映射的透明代理
2. `DNS`代理转发

``` json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warn"
  },
  "routing": {
    "strategy": "rules",
    "settings": {
      "rules": [
        {
          "type": "field",
          "inboundTag": [
            "tag-inbound-tcp"
          ],
          "outboundTag": "tag-outbound-tcp"
        },
        {
          "type": "field",
          "inboundTag": [
            "dns-inbound"
          ],
          "outboundTag": "tag-outbound-tcp"
        }
      ]
    }
  },
  "inbound": {
    "port": 43608,
    "listen": "192.168.10.1",
    "protocol": "socks",
    "settings": {
      "auth": "noauth",
      "udp": true,
      "ip": "127.0.0.1"
    }
  },
  "inboundDetour": [
      {
          "port": 43830,
          "protocol": "dokodemo-door",
          "settings": {
              "address": "vps_ip_address",
              "port": 443,
              "network": "tcp,udp",
              "timeout": 0
          }
      },
      {
          "protocol": "http",
          "port": 43607,
          "tag": "http-proxy",
          "listen": "0.0.0.0",
          "settings": {}
      },
      {
          "port": 43606,
          "protocol": "dokodemo-door",
          "tag": "dns-inbound",
          "settings": {
              "address": "8.8.8.8",
              "port": 53,
              "network": "tcp,udp",
              "timeout": 0
          }
      },
      {
          "port": 43605,
          "protocol": "dokodemo-door",
          "settings": {
              "network": "tcp,udp",
              "timeout": 0,
              "followRedirect": true
          }
      },
      {
          "port": 43604,
          "protocol": "dokodemo-door",
          "tag": "tag-inbound-tcp",
          "settings": {
              "network": "tcp,udp",
              "timeout": 0,
              "followRedirect": true
          }
      }
  ],
  "outbound": {
    "sendThrough": "192.168.10.1",
    "protocol": "vmess",
    "settings": {
      "vnext": [
        {
          "address": "服务器IP地址",
          "port": 43608,
          "users": [
            {
              "id": "a715b4f3-4b4a-4cbf-8a3e-8ab1a537da2f",
              "alterId": 64,
              "security": "auto"
            }
          ]
        }
      ]
    },
    "streamSettings": {
        "network": "kcp",
        "kcpSettings": {
          "mtu": 1350,
          "tti": 20,
          "uplinkCapacity": 5,
          "downlinkCapacity": 100,
          "congestion": false,
          "readBufferSize": 2,
          "writeBufferSize": 2,
          "header": {
            "type": "wechat-video"
          }
        }
    }
  },
  "outboundDetour": [
    {
      "protocol": "vmess",
      "sendThrough": "192.168.10.1",
      "tag": "tag-outbound-tcp",
      "settings": {
        "vnext": [
          {
            "address": "服务器IP地址",
            "port": 43609,
            "users": [
              {
                "id": "a715b4f3-4b4a-4cbf-8a3e-8ab1a537da2f",
                "alterId": 64,
                "security": "auto"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "tcpSettings": {
        }
      }
    }
  ],
  "transport": {
    "kcpSettings": {
      "uplinkCapactiy": 100,
      "downlinkCapacity": 100
    }
  },
  "dns": {
    "servers": [
      "8.8.8.8",
      "8.8.4.4",
      "localhost"
    ]
  }
}
```


## 自动代理配置

上面的配置只是配置好了网络请求转发，以及`socks`和`http`代理配置。浏览器已经可以通过设置`socks`或`http`代理地址(路由器ip地址)来访问网页了。但是要自动为接入家庭网络的所有设备以及应用代理网络请求，还需要一些额外配置


### DNS请求代理

`国家防火墙`不光会直接封IP地址，同时也会将域名解析为错误的IP地址，所以首先要确保`DNS`解析正确。(`Chrome`浏览器设置`socks`代理后，`DNS`也会走代理)

#### 使用Dnsmasq

`edgeos`从1.9版本开始支持`dnsmasq`作为`dns`服务器。`ubnt`提供了设置文档[EdgeRouter-Using-dnsmasq-for-DHCP-Server](https://help.ubnt.com/hc/en-us/articles/115002673188-EdgeRouter-Using-dnsmasq-for-DHCP-Server)

``` bash
# ssh需在ubnt账号下运行或者直接网页端的cli界面
configure
set service dhcp-server use-dnsmasq enable 
commit
save
exit
configure
set system name-server 127.0.0.1
set service dns forwarding cache-size 400
set service dns forwarding listen-on eth1
set service dns forwarding listen-on switch0
set system domain-name ubnt.home
# 内网地址解析
set service dns forwarding options address=/gitlab.ubnt.home/192.168.10.xxx
set service dns forwarding options no-resolv
set service dns forwarding options listen-address=192.168.10.1
# dns解析请求转发到V2ray
set service dns forwarding options server=127.0.0.1#43606
# 特定域名指定dns服务器，不转发到V2ray
set service dns forwarding options server=/.bombsquadgame.com/114.114.114.114
# 解析的域名地址放在noproxy ipset中
set service dns forwarding options ipset=/.bombsquadgame.com/noproxy
commit
save
exit
```

#### 国内域名解析加速

上面`dns`配置会将除特定域名以外的`dns`请求都通过`V2ray`转发。但是国内域名的解析不会被防火墙干扰，因此也走代理的话，会导致国内网络请求变慢。网络上有有专门整理好的国内域名列表，下面脚本会自动配置`dnsmasq`，将国内域名解析都指定为`114.114.114.114`服务器

``` bash
#!/bin/bash
set -e

WORKDIR="$(mktemp -d)"
SERVERS=(114.114.114.114 114.114.115.115 180.76.76.76)
# Not using best possible CDN pop: 1.2.4.8 210.2.4.8 223.5.5.5 223.6.6.6
# Dirty cache: 119.29.29.29 182.254.116.116

# CONF_WITH_SERVERS=(accelerated-domains.china google.china apple.china)
CONF_WITH_SERVERS=(accelerated-domains.china apple.china)
CONF_SIMPLE=(bogus-nxdomain.china)

echo "Downloading latest configurations..."
git clone --depth=1 https://git.coding.net/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://github.com/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://bitbucket.org/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://git.oschina.net/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://gitlab.com/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://code.aliyun.com/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 https://code.csdn.net/felixonmars/dnsmasq-china-list.git "$WORKDIR"
#git clone --depth=1 http://repo.or.cz/dnsmasq-china-list.git "$WORKDIR"

echo "Removing old configurations..."
for _conf in "${CONF_WITH_SERVERS[@]}" "${CONF_SIMPLE[@]}"; do
  rm -f /etc/dnsmasq.d/"$_conf"*.conf
done

echo "Installing new configurations..."
for _conf in "${CONF_SIMPLE[@]}"; do
  cp "$WORKDIR/$_conf.conf" "/etc/dnsmasq.d/$_conf.conf"
done

for _server in "${SERVERS[@]}"; do
  for _conf in "${CONF_WITH_SERVERS[@]}"; do
    cp "$WORKDIR/$_conf.conf" "/etc/dnsmasq.d/$_conf.$_server.conf"
  done

  sed -i "s|^\(server.*\)/[^/]*$|\1/$_server|" /etc/dnsmasq.d/*."$_server".conf
done

echo "Restarting dnsmasq service..."
if hash systemctl 2>/dev/null; then
  systemctl restart dnsmasq
elif hash service 2>/dev/null; then
  service dnsmasq restart
else
  echo "Now please restart dnsmasq since I don't know how to do it."
fi

echo "Cleaning up..."
rm -r "$WORKDIR"
```

> 将脚本放在目录中`/config/scripts/post-config.d`下，这样在路由重启后会自动运行


### IP数据包自动转发

`dns`走代理解析正确后，剩下就是让`IP`数据包自动走代理。同样的也希望国内IP的数据包不走代理，国外IP地址的数据包自动走代理。

下面脚本基于`ipset`以及`iptables`实现了如下功能:

1. 创建中国IP地址集以及noproxy(特定IP地址不走代理)代理集
2. 内网数据包直接访问，不走代理
3. `noproxy`集中的IP地址都不走代理
4. 非中国IP地址都走代理
5. 只有目标端口1-1024的数据包才会被代理(避免代理bt数据包，差不多其他基本网络服务的端口在这个范围内)


``` bash
#!/bin/bash
set -e

# config set for chinaip
WORKDIR="$(mktemp -d)"
ipset create chinaip hash:net -exist
wget -q -O "$WORKDIR/cn.zone" http://www.ipdeny.com/ipblocks/data/countries/cn.zone
for i in $(cat "$WORKDIR/cn.zone"); do ipset add chinaip $i -exist; done

ipset create noproxy hash:ip -exist
#pt.gztown.net pt
#ipset add noproxy 104.37.214.75 -exist

# config for iptables
iptables -t nat -N V2RAY
iptables -t nat -A V2RAY -d vps_ip_address -j RETURN
iptables -t nat -A V2RAY -d 0.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 10.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 127.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 169.254.0.0/16 -j RETURN
iptables -t nat -A V2RAY -d 172.16.0.0/12 -j RETURN
iptables -t nat -A V2RAY -d 192.168.0.0/16 -j RETURN
iptables -t nat -A V2RAY -d 224.0.0.0/4 -j RETURN
iptables -t nat -A V2RAY -d 240.0.0.0/4 -j RETURN
iptables -t nat -A V2RAY -m set --match-set noproxy dst -p tcp -j RETURN
iptables -t nat -A V2RAY -m set ! --match-set chinaip dst -p tcp -j REDIRECT --to-ports 43605
iptables -t nat -A OUTPUT -p tcp --dport 1:1024 -j V2RAY
iptables -t nat -A PREROUTING -s 192.168.0.0/16 -p tcp --dport 1:1024 -j V2RAY
```

> 同样为了在路由重启后自动运行改脚本，需要将脚本放在`/config/scripts/post-config.d`目录下


## VPN配置

家庭路由自动代理配置完成后，只有当设备连入家里的路由才能自动代理。家里之外的设备怎么办呢？最方便的就是通过`VPN`，因为不管手机或者PC都支持VPN。

`edgeos`配置`VPN`参考官方文档[https://help.ubnt.com/hc/en-us/articles/204950294-EdgeRouter-L2TP-IPsec-VPN-Server](https://help.ubnt.com/hc/en-us/articles/204950294-EdgeRouter-L2TP-IPsec-VPN-Server)。建议`VPN`就使用`L2tp/IPsec`协议，`Android`和`IOS`系统默认都支持该协议

`VPN`配置好后，在外的设备连接`VPN`，就能自动代理了。
