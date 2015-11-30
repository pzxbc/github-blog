title: Hexo博客Wiki
date: 2015-01-05
updated: 2015-11-29
comments: true
tags:
  - Hexo
  - 技术
categories:
  - 技术
permalink: hexo-blog-wiki
---

## 1. Hexo安装使用
### 安装
参考[官方文档](https://hexo.io/docs/index.html)说明

### 配置
在`_config.yml`文件中，我们可以配置Hexo博客。

* **skip_render选项**

Hexo默认会渲染`source`文件下的所有的`*.md`和`*.html`文件。配置该选项，我们可以让Hexo在生成网站文件的时候跳过某些文件，比如用于域名所有权验证的HTML文件或者github仓库的Readme文件。

``` yml
skip_render:
  - xxx.html
  - readme.md
```

### 使用
```bash
# 创建新的站点
hexo init [folder]
# 创建新的文章
hexo new [layout] <title>
# 生成静态文件
hexo generate
# 发布草稿
hexo publish [layout] <filename>
# 启动一个本地Server，并显示草稿文章
# 默认的地址为: http://localhost:4000/
hexo server --draft
# 部署
hexo deploy
# 清除
# 清除缓存文件(db.json)和生成的文件(public/)
hexo clean
```
<!-- more -->

## 2. Hexo主题使用
### 主题安装使用
在Hexo站点目录下执行下面命令，然后修改`_config.yml`中的`theme`字段为`theme-name`。你可以在[Hexo主题库](https://github.com/hexojs/hexo/wiki/Themes)寻找你喜欢的主题。
```bash
git clone <repository> themes/<theme-name>
```
> git clone完成后，我们就可以将`themes/<theme-name>`目录下的.git目录删除了

### yilia主题的配置
``` yml
# 头像设置 将图片放在主题目录下的source/img文件夹下
avatar: "/img/avatar.jpg"
# 多说设置，如果需要开启，填的是你在多说上申请的项目名称. 
# (PS: 登陆www.duoshuo.com, 然后点我要安装就会看到项目申请, 记得用引号引起项目名称)
duoshuo: "项目名称"
# 谷歌统计
google_analytics: '跟踪ID'
```

## 3. Hexo博客使用Github与Gitcafe托管
### 博客托管
Github与Gitcafe通过Pages服务提供了静态网站的托管服务。Pages分为两种：个人/组织的Pages和项目Pages；一般我们使用个人/组织Pages来托管Hexo博客。

个人/组织的Pages都是一个特殊名字的项目。在Github中个人/组织Pages的项目名必须为`username.github.io`，在Gitcafe中项目名必须为`username`。

* [Github Pages帮助](https://help.github.com/categories/github-pages-basics/)
* [Gitcafe Pages帮助](https://gitcafe.com/GitCafe/Help/wiki/Pages-%E7%9B%B8%E5%85%B3%E5%B8%AE%E5%8A%A9)

在创建好Pages项目后，我们需要配置`_config.yml`文件中的`deploy`字段
``` yml
deploy:
- type: git
  repository: https://github.com/pzxbc/pzxbc.github.io.git
  branch: master
- type: git
  repository: https://gitcafe.com/pzxbc/pzxbc.git
  branch: gitcafe-pages
```

配置完成后，运行下面指令部署博客
```bash
cd <hexo-websit-dir>
hexo clean
hexo generate
hexo deploy
```

### 使用自定义域名
在将博客托管至Github和GitCafe后，我们可以使用域名`username.[github|gitcafe].io`来访问我们的博客。如果你自己拥有一个域名的话，可以设置使用该域名(`blog.xxx.com`)来访问博客。

1. 将`username.[github|gitcafe].com`域名重定向到我们要使用的域名`blog.xxx.com`。
    * 对于Github，需要在Pages项目的根目录添加一个*CNAME*文件，文件内容为你要使用的域名`blog.xxx.com`；即在Hexo站点目录下的`source`目录添加*CNAME*文件；
    * 对于Gitcafe，在Pages项目的设置中添加你的域名即可；
2. 设置CNAME记录。在步骤1后，我们访问`username.[github|gitcafe].io`后，网页会重定向到域名`blog.xxx.com`。为了能通过域名`blog.xxx.com`访问到我们的博客，我们应该将域名指向我们博客所在的服务器。添加下面的CNAME记录，使得`blog.xxx.com`解析为博客所在的服务器IP地址。

主机记录 | 记录类型 | 线路类型 | 记录值
---------|----------|----------|--------
blog | CNAME | 默认 | username.github.io
blog | CNAME | 国内 | username.gitcafe.io

经过上面设置后，我们在国内线路访问`blog.xxx.com`会访问到`username.githcafe.io`指向的服务器上的博客，通过国外线路会访问到`username.github.io`指向的服务器。这样也加速了我们博客打开的速度，因为gitcafe对于国内访问来说会快很多；同时也使得百度能够索引我们的站点，因为github屏蔽了百度的爬虫。

配置完成后，我们可以通过下面命令确认是否成功(CNAME记录需要一段时间才能生效)
```bash
ping pzxbc.github.io
# PING github.map.fastly.net (103.245.222.133) 56(84) bytes of data.
# 64 bytes from 103.245.222.133: icmp_seq=1 ttl=51 time=326 ms
# 64 bytes from 103.245.222.133: icmp_seq=2 ttl=51 time=297 ms
ping pzxbc.gitcafe.io
# PING pzxbc.gitcafe.io (103.56.54.5) 56(84) bytes of data.
# 64 bytes from 103.56.54.5: icmp_seq=1 ttl=54 time=12.6 ms
# 64 bytes from 103.56.54.5: icmp_seq=2 ttl=54 time=12.3 ms
dig blog.pzxbc.com +nostats +nocomments +nocmd
# ;blog.pzxbc.com.            IN  A
# blog.pzxbc.com.     600 IN  CNAME   pzxbc.gitcafe.io.
# pzxbc.gitcafe.io.   600 IN  A   103.56.54.5
ping blog.pzxbc.com
# PING pzxbc.gitcafe.io (103.56.54.5) 56(84) bytes of data.
# 64 bytes from 103.56.54.5: icmp_seq=1 ttl=54 time=11.8 ms
# 64 bytes from 103.56.54.5: icmp_seq=2 ttl=54 time=12.6 ms
```

> [Github Pages自定义域名访问官方文档](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)
> [Gitcafe Pages自定义域名访问官方文档](https://gitcafe.com/GitCafe/Help/wiki/Pages-%E7%9B%B8%E5%85%B3%E5%B8%AE%E5%8A%A9)

## 4. Hexo站点git管理
### 使用git管理
1. 在**github**上创建一个新的仓库`github-blog`用于管理Hexo站点文件
2. 将Hexo站点本地文件推送到`github-blog`仓库中
```bash
cd hexo-website-dir
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/pzxbc/github-blog.git
git push -u origin master
```
### 同步站点文件至其他机器使用
在使用了git管理我们的站点文件后，我们就拥有了博文回退、同步、协同创作的功能。我们可以轻松地将我们的站点文件同步至其他机器进行博文的编写和发布。
```bash
git clone https://github.com/pzxbc/github-blog.git <website-dir>
cd <website-dir>
npm install
```
> 其他机器上要确保安装了Node.js和Hexo环境

## 5. 插件
### 插件使用
```bash
# 安装
npm install <plugin-name> --save
# 更新
npm update
# 卸载
npm uninstall <plugin-name> --save
```

### 插件集合
* [旧的Wiki](https://github.com/hexojs/hexo/wiki/Plugins)
* [新的插件展示](https://hexo.io/plugins/)

### 使用的插件
* [Feeds](https://github.com/hexojs/hexo-generator-feed)
* [Sitemap](https://github.com/hexojs/hexo-generator-sitemap)
* [BaiduSitemap](https://github.com/coneycode/hexo-generator-baidu-sitemap)
* [文章后台管理](https://github.com/jaredly/hexo-admin)
* [修改浏览器同步刷新](https://github.com/hexojs/hexo-browsersync)

## 6. Hexo版本升级
根据[官方文档](https://github.com/hexojs/hexo/wiki/Migrating-from-2.x-to-3.0)进行操作即可

从2.X版本升至3.0的还需要更改`_config.yml`的`deploy`选项作，才能正常运行`hexo deploy`命令
``` yml
deploy:
  type: git
```
