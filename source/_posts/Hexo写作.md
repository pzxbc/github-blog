title: Hexo写作
comments: true
tags:
  - 技术
  - Hexo
categories:
  - 技术
permalink: hexo-writing
date: 2015-11-15 20:27:03
updated: 2015-11-15 20:27:03
---


## 文章写作
### 1. 创建草稿
``` bash
hexo new draft <title>
```
使用`hexo server --draft`渲染草稿
### 2. 将草稿移至文章目录
草稿存在于`source/_drafts`目录下，当文章草稿完成后，用下面的命令将草稿移至文章目录`source/_posts`
``` bash
hexo publish <title>
```
如一开始不需要草稿，可以直接创建文章`hexo new <title>`

<!-- more -->

### 3. 生成文章页面文件
``` bash
hexo generate
```
### 4. 发布文章
``` bash
hexo deploy
```
### 5. 提交新文章至git
``` bash
git status
git diff "new_post_file"
git add "new_post_file"
git commit -m "add new post"
git push -u origin master
```

## 参考
* [Hexo写作](https://hexo.io/docs/writing.html)
