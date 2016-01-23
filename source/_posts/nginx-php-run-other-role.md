title: Nginx+PHP以其他用户运行
comments: true
date: 2016-01-20 20:34:08
updated: 2016-01-20 20:34:08
tags:
  - 技术
  - Web
categories:
  - 技术
permalink: nginx-php-run-other-role
---

最近折腾一个应用需要使用到Nginx+PHP，默认情况下这两个服务都是以`www-data`用户运行的。但是在应用中需要访问和修改其他用户文件，由于Linux文件权限的设置，Nginx和PHP在访问那些文件时会出现`Permission denied`错误。

## Nginx配置
修改`/etc/nginx/nginx.conf`文件
``` bash
user other_account;
```

<!-- more -->

## PHP配置
这里针对的是php-fpm进程。需要修改`/etc/php5/fpm/pool.d/www.conf`文件
``` bash
user = other_account
group = other_group
listen.owner = other_account
listen.group = other_group
```

注意修改`listen.owner`和`listen.group`，不然会出现如下错误
``` bash
connect() to unix:/var/run/php5-fpm.sock failed (13: Permission denied) while connecting to upstream
```

当然这种修改运行用户的方式在产品中时不能使用的，存在账号权限风险，只是方便开发环境。
