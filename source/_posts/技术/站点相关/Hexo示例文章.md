title: Hexo示例文章
comments: true
tags:
  - 技术
  - Hexo
permalink: hexo-post-example
date: 2015-11-16 13:12:18
updated: 2015-12-14 13:12:18
---

## 二级标题
### 三级标题

查看更多

<!-- more -->

段落测试，*斜体强调* **加粗强调**[行内的链接](http://blog.pzxbc.com "可选的标题")

网站内部链接 [UI控件](/2015/12/11/cocos2dx-custom-pageview-control/)

段落的强制换行  
这是第二行。[参考式链接][链接id]

[链接id]: http://blog.pzxbc.com "可选的标题"

> 区块引用
> 区块引用

1. 有序列表1
2. 有序列表2
3. 有序列表3

* 无序列表
* 无序列表

代码高亮
```Python
print 'hello, world'
```

这是一条分隔线
---

## 表格
col1 | col2 | col3
:--- | :--: | ---:
attr1 | attr2 | attr3

## 资源引用
修改`_config.yml`文件配置选项
``` yml
post_asset_folder: true
```

### 图片资源
{% asset_img galaxy.jpg 银河 %}

### 其他资源
{% asset_link test.txt test %}
