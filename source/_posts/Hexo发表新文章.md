title: Hexo发表新文章
date: 2015-01-26 13:01:02
tags: [Hexo, 博客]
permalink: hexo-new-post
categories:
- Technology
---

## 发布新文章流程
1. 在Hexo目录下执行下面命令
	```Shell
	hexo new [layout] <title>
	```

	> Hexo自带两个layout: post 和 page 

	> Layout | 生成文件位置
	> -------|-------------
	> post(default) | source/_posts
	> page | source
2. 配置文章属性
	```
	permalink: test
	categories:
	- Diary
	tags:
	- PS3
	- Games
	```
3. 支持继续阅读功能，在分割的地方添加&lt!-- more -->

## 参考
1. [Hexo doc](http://hexo.io/docs/writing.html)
