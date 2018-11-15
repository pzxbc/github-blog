title: Hexo博客迁移至Coding.net
comments: true
date: 2016-03-24 21:42:09
updated: 2016-03-24 21:42:09
tags:
  - 技术
  - Hexo
categories:
  - 技术
permalink: hexo-migrate-coding-net
---

之前国内的Hexo博客一直用`gitcafe`托管(因为百度不能索引`github`)。现在`gitcafe`要合并到`coding.net`平台了，因此我的博客也需要相应进行迁移。

迁移步骤比较简单，网上的教程大多比较老了，因此记录一下。现在的`coding.net`支持`Pages`服务，同时还支持自定义绑定域名。

<!-- more -->

## 1\. 迁移项目至`coding.net`

`gitcafe`提供了一键迁移按钮，具体操作请访问[这里](https://gitcafe.com/migration)，按照指导一步步来就行了。

## 2\. 迁移后设置

迁移完成后，在`coding.net`平台就可以看到你原来Hexo博客项目。点击项目的`pages`选项，你可以看到`开启服务`的按钮。在开启服务之前，我们要设置分支为`gitcafe-pages`(这是`gitcafe`默认的`pages`分支)。

开启完成后，在`pages`选项页面能够看到`绑定域名`的新选项。填入自己的域名，并在DNS服务商那里修改`CNAME`记录。可以通过`nslookup your_custom_domain`查看`CNAME`记录是否已经生效。

另外还需要修改Hexo的`_config.yml`文件，更改部署的地址为`coding.net`提供的地址。

``` bash
deploy:
- type: git
  repository: git@git.coding.net:pzxbc/pzxbc.git
  branch: gitcafe-pages
```

如果是SSH公钥方式部署的话，还需要进入`coding.net`->`账户`->`SSH公钥`设置公钥，或者在项目里单独设置部署公钥。

`coding.net`的`Pages`服务文档参考[这里](https://coding.net/help/doc/pages/index.html)，里面提到不是`jekyll`的静态页面演示，可以在分支中添加`.nojekyll`文件。实际测试中发现，不添加该文件也没有关系。
