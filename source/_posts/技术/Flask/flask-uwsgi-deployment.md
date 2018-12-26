title: Flask部署
p: 技术/Flask/flask-uwsgi-deployment.md
date: 2018-12-26 22:23:56
updated: 2018-12-26 22:23:56
tags:
  - flask
  - uwsgi
---

之前的Flask应用都是直接用自带的server跑的，本身业务对性能也没什么要求，就没做`production`的部署。但是最近觉得很麻烦的是，每次`server`端代码改变，都得跑去服务器上`pull`代码，然后重启`flask server`，太麻烦了，还是弄成自动部署方便多了。

<!-- more -->

## 安装`uwsgi`

我这边服务器系统是`ubuntu 16.04`的，仓库里本身有`uwsgi`包，除了安装`uwsgi`之外，我们还需要安装对应的`python`插件

``` bash
sudo apt install uwsgi
# 如果你使用的python是2.x版本的话，就安装uwsgi-plugin-python
sudo apt install uwsgi-plugin-python3
```

安装`uwsig-plugin-python3`的过程中会出现下面错误

```
/var/lib/dpkg/info/uwsgi-plugin-python3.postinst: 61: [: Illegal number:
```

修改下对应文件`uwsig-plugin-python3.postinst`中60行

```
grep -c '/uwsgi_python3$' | true => grep -c '/uwsgi_python3$' || true
```

## 配置

### uwsgi作为服务启动

在`ubuntu 16.04`系统下，使用`systemd`来管理服务启动，其他系统参考对应[文档](https://uwsgi-docs.readthedocs.io/en/latest/Management.html)吧

### 禁止`LSB`启动

`apt`安装后，`uwsgi`会在`init.d`目录下有个`uwsgi`文件，这个对应着`LSB`服务启动方式，`Systemd`兼容`LSB`方式，因为准备使用`Systemd`方式来管理，所以先要将`LSB`中`uwsgi`服务禁用

``` bash
sudo update-rd.d uwsgi remove
```

### 配置service文件

目录`/lib/systemd/system`下创建`emperor.uwsgi.service`文件

``` 
[Unit]
Description=uWSGI Emperor
After=syslog.target

[Service]
ExecStart=/usr/bin/uwsgi --ini /etc/uwsgi/emperor.ini
# Requires systemd version 211 or newer
RuntimeDirectory=uwsgi
Restart=always
KillSignal=SIGQUIT
Type=notify
StandardError=syslog
NotifyAccess=all

[Install]
WantedBy=multi-user.target
```

### 激活服务

新增service文件后，需要进行下面操作才能让`systemd`将服务管理起来

``` bash
# systemd自身reload，这样才能发现新增的service文件
sudo systemctl daemon-reload
# 确认systemd发现了service文件
sudo systemctl list-unit-files | grep emp
# 激活service
sudo systemctl enable emperor.uwsgi.service
# 启动service
sudo systemctl start emperor.uwsgi.service
# 查下下服务启动状态，确认正常启动
sudo systemctl status emperor.uwsig.service
```


## 部署应用

这里举例部署一个测试应用

首先在`/etc/uwsgi/vassals`下新建`test_app.ini`文件，内容如下

``` ini
[uwsgi]
chdir=/home/pzx/projects/meson-webviewer-server
; http-to=/tmp/%n.sock
http-socket=0.0.0.0:8376
plugin=python35
module=test_app:app
processes=4
master=true
;python虚拟环境
venv=/home/pzx/projects/meson-webviewer-server/.venv
```

对应`/home/pzx/projects/meson-webviewer-server/test_app.py`文件内容如下

``` python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World! i am app1"
```

访问`http://ip:8376`就会在页面上看到`Hello world! i am app1`

## 配合`gitlab-ci`

下面是`.gitlab-ci.yml`的示例

``` yml
stages:
  - build
  - test
  - deploy

variables:
  GIT_SUBMODULE_STRATEGY: recursive

deploy tools:
  stage: deploy
  only:
    - master
  tags:
    - linux-runner
  script:
    - cp -rf * /home/gitlab-runner/meson/meson-webviewer-server
    - cd /home/gitlab-runner/meson/meson-webviewer-server
    - source .venv/bin/activate
    - pip install -r pyrequirements.txt
    - sudo touch /etc/uwsgi/vassals/meson-webviewer-server.ini
```

最重要的语句就是最后一句`touch`了，会导致配置文件时间戳的更新，进而`uwsgi`会自动重启对应应用。


这样以后在代码`push`到远端后，对应应用的服务端会自动更新重启，再也不需要跑到服务器上手动更新重启了，真Happy!

## Emperor方式

上面`uwsgi`用的部署方式是`Emperor`方式(一个服务管理多个应用)，`Emperor`是君王的意思，`vassals`是臣子的意思。君王管理所有的臣子，臣子就是具体部署的应用，来处理用户的请求。需要部署多个应用，就在`/etc/uwsgi/vassals`目录下创建新的应用的配置文件，君王会自动方式新的配置文件，然后按照配置文件的配置去启动对应的应用。

君王不关有自动发现臣子(新应用配置)的能力，同时君王会在应用配置有更新的时候，优雅的重启臣子(旧的worker处理完请求后关闭，同时启动新的worker)；另外还包括负载均衡、挂掉重启等功能，简直完美的解决了自动部署的问题

另外`uwsgi`也支持一个应用一个服务的配置方式，这种适合一个机器就只跑一个应用的情况，具体配置可以参考[文档](https://uwsgi-docs.readthedocs.io/en/latest/Systemd.html#one-service-per-app-in-systemd)

## 感受

`flask`的部署方式有很多，但是我不想弄复杂，再搞个`Nginx`在前面。 `uwsgi`不关支持请求的转发，同时还支持静态文件服务，对于一个简单的应用妥妥的够了，不想再耗费精力去部署的复杂（也没有什么用）

但是`uwsgi`的文档真的写的太乱了，好多东西都不知道去哪里查，要试验好久才能配置正确！比如关于http端口的绑定，需要用到`http-socket`选项，但是在文档里找不到对应说明，还有关于`python`插件的配置等等。

清楚的文档还是很重要的，要不然以后有其他选择了，妥妥的不用这个了。