## Hexo Blog
[![Build Status](https://travis-ci.org/pzxbc/github-blog.svg?branch=master)](https://travis-ci.org/pzxbc/github-blog)

The source code for Hexo Blog.

### Install

``` bash
git clone https://github.com/pzxbc/github-blog.git
cd github-blog
npm install
sudo npm install -g hexo-cli
```

### Usage

#### 创建一篇新文章

``` bash
hexo new <title>
```

#### 启动server，浏览器预览

``` bash
hexo server -p 7050 --draft
```

#### 生成文章文件并部署

``` bash
hexo d -g
```

#### 清理缓存

``` bash
hexo clean
```
