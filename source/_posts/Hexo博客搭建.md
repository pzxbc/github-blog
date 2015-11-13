title: Hexo博客搭建
date: 2015-01-05 21:32:56
tags: [Hexo, 博客]
permalink: hexo-blog-setup
---

## 搭建流程参考

1. [hexo系列教程](http://zipperary.com/2013/05/28/hexo-guide-1/)
2. [hexo 官方doc](http://hexo.io/docs/index.html)
3. [使用ssh部署hexo到git](http://www.studio2013.com/2013/07/21/hexo-github-deploy/)

<!-- more -->

## 主题使用

暂时采用了[Yilia](https://github.com/litten/hexo-theme-yilia)主题，被她的小清新风格吸引了!

### Hexo主题库

可以在[Hexo themes list](https://github.com/hexojs/hexo/wiki/Themes)中查找你喜欢的主题

### Yillia配置

```YAML
# 头像设置
avatar: "avatar头像，可以使用github头像的链接"
# 多说设置，如果需要开启，填的是你在多说上申请的项目名称. 
# (PS: 登陆www.duoshuo.com, 然后点我要安装就会看到项目申请, 记得用引号引起项目名称)
duoshuo: "项目名称"
```

## 使用自己的二级域名

1. 进入你的DNS服务提供商(我使用的是DNSpod)
2. 添加下面记录
  + A记录: hexo-github-blog github博客的IP(可以通过ping xx.github.io域名来得到)
  + CNAME记录: xx-github.io hexo-github-blog.pzxbc.com
  + CNAME记录: blog xx-github.io
3. 在Hexo下的source目录中添加一个名为CNAME的文件，填入你的二级域名

> \# 使用dig命令查看域名DNS解析情况
dig 域名 +nostats +nocomments +nocmd

## 使用Google Analytics

Yillia主题支持谷歌统计，在_config.yml中输入你的跟踪ID即可

```YAML
google_analytics: '跟踪ID'
```

## Markdown使用

1. [Github Mastering Markdown](https://guides.github.com/features/mastering-markdown/)
2. [Markdown官方中文文档](http://wowubuntu.com/markdown/)
