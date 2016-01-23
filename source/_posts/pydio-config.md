title: 私有云存储Pydio配置
comments: true
date: 2016-01-20 19:50:24
updated: 2016-01-20 19:50:24
tags:
  - 技术
  - 私有云存储
  - Pydio
categories:
  - 技术
permalink: pydio-config
---

安装完Pydio后，需要进行一些配置，主要需要配置的有以下几个方面：

1. 服务端URL重写。从Pydio 6起，REST API、客户端同步等特性依赖于服务端URL重写规则的配置。
2. 上传文件大小设置。如果需要上传大文件的话，这个设置是必须的。
3. 安全设置。

<!-- more -->

## URL重写规则配置

下面是关于Nginx 虚拟主机URL的重写规则。如果是Apache2服务器，请参考[官方文档](https://pydio.com/en/docs/v6-enterprise/checking-apis)。
``` 
rewrite ^/dashboard|^/settings|^/welcome|^/ws- /index.php last;
if ( !-e $request_filename ) {
        # WebDAV Rewrites
        rewrite ^/shares /dav.php last;
        # Sync client
        rewrite ^/api /rest.php last;
        # External users 
        rewrite ^/user ./index.php?get_action=user_access_point last;
        # Public shares
        rewrite ^/data/public/([a-zA-Z0-9_-]+)\.php$ /data/public/share.php?hash=$1?;
}
rewrite ^/data/public/([a-zA-Z0-9_-]+)--([a-z]+)$ /data/public/share.php?hash=$1&lang=$2?;
rewrite ^/data/public/([a-zA-Z0-9_-]+)$ /data/public/share.php?hash=$1?;

location ~ \.php$ {
        # for ^/(index|plugins) request_uri should be changed
        set $request_url $request_uri;
        if ( $uri ~ ^/(index|plugins) ) {
                set $request_url /;
        }
        fastcgi_param  REQUEST_URI $request_url;
}
```

配置完成，重启Nginx服务后，我们可以通过访问 http://your_pydio_server/runTests.php?api=true 来测试服务端是否已经正确配置。`Workspace Alias`可以登陆Pydio后中的设置->workspaces中查看。
{% asset_img pydio_test_api_and_sync.png Pydio REST API and Sync Test %}

## 上传文件大小配置

要想能够上传大文件，需要更改Nginx虚拟主机和PHP配置文件。

修改`/etc/php5/fpm/php.ini`文件选项。

``` bash
upload_max_filesize = 20G
post_max_size = 20G
```

Nginx虚拟主机配置

``` bash
client_max_body_size 20G;
client_body_buffer_size 128k;
```

如果忘记配置Nginx，上传大文件完成时会出现`413 Request Entity Too Large`错误。

> Nginx+PHP上传大文件配置参考[1](http://blog.csdn.net/webnoties/article/details/17266651)、[2](http://www.cyberciti.biz/faq/linux-unix-bsd-nginx-413-request-entity-too-large/)

## 安全设置

配置Nginx的Pydio虚拟主机文件，禁止访问`conf`和`data`目录(除`public`目录外)等其他设置。
``` bash
# Prevent Clickjacking
add_header X-Frame-Options "SAMEORIGIN";

# Only allow these request methods and do not accept DELETE, SEARCH and other methods
if ( $request_method !~ ^(GET|HEAD|POST|PROPFIND|OPTIONS)$ ) {
        return 444;
}

location ~* ^/(?:\.|conf|data/(?:files|personal|logs|plugins|tmp|cache)|plugins/editor.zoho/agent/files) {
        deny all;
}
```

完整的Pydio虚拟主机配置如下：
``` bash
server {
    listen 8010 default_server;
    listen [::]:8010 default_server;

    root /var/www/pydio;

    # Add index.php to the list if you are using PHP
    index index.php;

    server_name pydio.xxx.com;

    keepalive_requests    10;
    keepalive_timeout     60 60;
    access_log /var/log/nginx/access_pydio6_log;
    error_log /var/log/nginx/error_pydio6_log;

    client_max_body_size 20G;
    client_body_buffer_size 128k;

    rewrite ^/dashboard|^/settings|^/welcome|^/ws- /index.php last;
    if ( !-e $request_filename ) {
        # WebDAV Rewrites
        rewrite ^/shares /dav.php last;
        # Sync client
        rewrite ^/api /rest.php last;
        # External users 
        rewrite ^/user ./index.php?get_action=user_access_point last;
        # Public shares
        rewrite ^/data/public/([a-zA-Z0-9_-]+)\.php$ /data/public/share.php?hash=$1?;
    }
    rewrite ^/data/public/([a-zA-Z0-9_-]+)--([a-z]+)$ /data/public/share.php?hash=$1&lang=$2?;
    rewrite ^/data/public/([a-zA-Z0-9_-]+)$ /data/public/share.php?hash=$1?;

    # Prevent Clickjacking
    add_header X-Frame-Options "SAMEORIGIN";

    # Only allow these request methods and do not accept DELETE, SEARCH and other methods
    if ( $request_method !~ ^(GET|HEAD|POST|PROPFIND|OPTIONS)$ ) {
        return 444;
    }

    location / {
        #First attempt to serve request as file, then
        #as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
    }

    location ~* ^/(?:\.|conf|data/(?:files|personal|logs|plugins|tmp|cache)|plugins/editor.zoho/agent/files) {
        deny all;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        # for ^/(index|plugins) request_uri should be changed
        set $request_url $request_uri;
        if ( $uri ~ ^/(index|plugins) ) {
            set $request_url /;
        }

        include snippets/fastcgi-php.conf;

        fastcgi_param  REQUEST_URI $request_url;

        # With php5-cgi alone:
        # fastcgi_pass 127.0.0.1:9000;
        # With php5-fpm:
        fastcgi_pass unix:/var/run/php5-fpm.sock;
    }

    # Enables Caching
    location ~* \.(ico|css|js)$ {
        expires 7d;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }
}
```
