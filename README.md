## Hexo Blog
[![Build Status](https://travis-ci.org/pzxbc/github-blog.svg?branch=master)](https://travis-ci.org/pzxbc/github-blog)

The source code for Hexo Blog.

### 安装

``` bash
git clone https://github.com/pzxbc/github-blog.git
cd github-blog
npm install
sudo npm install -g hexo-cli
```

> npm建议使用淘宝镜像源

### 使用

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

> 上述为旧的方式，现在已使用`travis-cli`自动部署，`git push`修改就会自动部署

#### 清理缓存

``` bash
hexo clean
```