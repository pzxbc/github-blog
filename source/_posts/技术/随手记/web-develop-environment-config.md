title: 树莓派折腾记：Web开发环境配置
comments: true
date: 2016-01-20 20:25:17
updated: 2016-01-20 20:25:17
tags:
  - 技术
  - 树莓派
  - Web
permalink: web-develop-environment-config
---

这里记录的是Nginx+PHP+MYSQL开发环境安装配置。虽然树莓派2相比较一代性能上已经有很大的提升了，但是毕竟只是块ARM板而已，所以HTTP服务器上选择了轻量级的Nginx。

## Nginx

安装
``` bash
sudo apt-get install nginx
```

<!-- more -->

使用
``` bash
# 启动 重启 停止 重新加载
sudo service nginx start | restart | stop | reload
```
创建一个新的站点：在`/etc/nginx/sites-available`添加新的站点文件，然后在`/etc/nginx/sites-enabled`创建一个对应的符号链接文件。站点配置参考自带的default站点。
``` bash
sudo ln -s /etc/nginx/sites-available/xx-site /etc/nginx/sites-enabled
```

配置文件路径`/etc/nginx/nginx.conf`

参考
1. [Nginx如何处理一个请求](http://tengine.taobao.org/nginx_docs/cn/docs/http/request_processing.html)
2. [Nginx虚拟配置理解](https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms)
3. location匹配规则[1](https://gist.github.com/luxixing/7262911)，[2](https://www.nginx.com/blog/creating-nginx-rewrite-rules/)
4. [location与rewrite规则总结](http://seanlook.com/2015/05/17/nginx-location-rewrite/)

## PHP
安装
``` bash
sudo apt-get install php5 php5-fpm php5-mysql
```
FastCGI服务启动、停止
``` bash
sudo service php5-fpm start|stop
```
配置文件位置`/etc/php5`

## MySql
安装
``` bash
sudo apt-get install mysql-server
```
安装过程中会提示输入root账号密码，请切记。

进入MySql
``` bash
mysql -u root -p
```

使用
``` bash
# 添加新账号
GRANT ALL PRIVILEGES ON *.* TO 'your_account' @'%' IDENTIFIED BY 'your_passwd' WITH GRANT OPTION;
flush privileges;
# 创建新的数据库
create database xxx-database;
# 查看数据库
show databases;
```

Web数据库管理前端phpMyAdmin安装
``` bash
sudo apt-get install phpmyadmin
```
安装过程中会提示你选择Apache或者lighttpd服务器，我们使用的是Nginx服务器，按Esc键退出选择，后面会提示你输入数据库root密码。

安装完成后phpMyAdmin代码文件位于`/usr/share/phpmyadmin/`目录下，做一个符号链接到`/var/www`目录下。
``` bash
sudo ln -s /usr/shar/phpmyadmin/ /var/www/
```
最后需要建立一个Nginx的虚拟服务器。具体可以参考[这里](http://wangye.org/blog/archives/574/)
