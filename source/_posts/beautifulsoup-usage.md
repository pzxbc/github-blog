title: BeautifulSoup使用
date: 2016-06-17 19:19:57
updated: 2016-06-17 16:19:57
tags:
  - 技术
  - Beautifulsoup
categories:
  - 技术
permalink: beautifulsoup-usage
---

BeautifulSoup是一个HTML与XML数据分析工具。它可以让你从HTML或者XML中获取你需要的数据以及修改对应数据。

<!-- more -->

## 安装

在Debian机器上，可以使用下面命令安装

``` bash
sudo apt-get install libxml2-dev
sudo apt-get install libxslt1-dev
pip install lxml -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
pip install beautifulsoup4
```

## 使用

下面是一个HTML文档，后面的示例中都使用这个文档

``` python
html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""
```

### 基本使用

从BeautifulSoup解析出的字符串是unicode格式，传递给BeautifulSoup的文档最好使用unicode格式。

``` python
from bs4 import BeautifulSoup
soup = BeautifulSoup(html_doc, 'lxml')

soup.title
# <title>The Dormouse's story</title>

soup.title.string
# u'The Dormouse's story'

soup.p
# <p class="title"><b>The Dormouse's story</b></p>

soup.p['class']
# u'title'

soup.find_all('a')
# [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
#  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
#  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]

soup.find(id="link3")
# <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>
```

### 数据定位

BeautifulSoup提供了很多数据定位的接口供我们操作，我们可以通过这些接口访问节点的子节点、父节点、兄弟节点以及定位到特定节点。

下面是一个使用`find`接口定位到特定节点的例子。

``` python
def tag_func(tag):
    if tag.name == u'a' and tag.has_attr('id') and tag['id'] == u'link2':
        return True
    return False
tag = soup.find(tag_func)
# <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>
```

### 其他

获取文档的文字版(去掉HTML标签)

``` python
txt = soup.get_text()
```

字符串迭代器: `.strings`与`.stripped_strings`

``` python
for string in soup.strings:
    print(repr(string))
```

