## Hexo Blog
[![Build Status](https://travis-ci.org/pzxbc/github-blog.svg?branch=master)](https://travis-ci.org/pzxbc/github-blog)

The source code for Hexo Blog.

### 准备环境

1. node.js&&npm
2. git

> node.js安装好后一般已经附带了包管理工具npm

### 安装

``` bash
git clone https://github.com/pzxbc/github-blog.git
cd github-blog
npm install
npm install -g hexo-cli
```

### 使用

#### 创建一篇新文章

``` bash
hexo new <title> -p 技术/filename.md
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

### 插件

1. [hexo-directory-category](https://github.com/zthxxx/hexo-directory-category): 根据目录结构自动添加category


### 维护

### 主题更新

git-bash中运行下面指令

``` shell
$ mkdir themes/next
$ curl -L https://api.github.com/repos/theme-next/hexo-theme-next/tarball/v6.0.0 | tar -zxv -C themes/next --strip-components=1
```

然后提交到git仓库