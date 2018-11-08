title: Python解析邮件附件乱码
date: 2018-11-07 23:17:34
updated: 2018-11-07 23:17:34
tags:
  - Python
  - 邮件
  - 编码
---

最近有个需求需要批量下载邮箱中某一类型邮件的附件，使用了`Python`标准库中的`IMAP`以及`EMAIL`模块。但是下载下来后总有一些附件的标题是乱码。。。了解了下邮件协议后，终于发现问题所在了。


<!-- more -->

具体关于邮件协议的分析，可以参考[这篇文章](https://blog.csdn.net/bripengandre/article/details/2192982)。附件在邮件中时一个`multipart`段，然后这个段中会有下面两个邮件头

{% asset_img attach1.png %}

对应着`Python`中解析的代码如下

```python
import email
# mail_data是通过IMAP协议获取的邮件数据
msg = email.message_from_bytes(mail_data)
for part in msg.walk():
    filename = part.get_filename()
    if filename:
        # 存在附件名
        header_data = email.header.decode_header(filename)
        filename = header_data[0][0]
        encoding = header_data[0][1]
        if encoding:
            filename = filename.decode(encoding)
```

正常来说按照上面解析邮件附件名应该没有错，但是上面这个邮件头中`filename`有些特殊，`filename`直接使用了`gbk`编码传输。`email`标准库中默认处理的编码是大概是下面这种形式，编码后所有的字符都是可打印的并且包含有原始字符的编码信息

```
=?GB2312?B?MjAxODEwMjW547eixMnLuczYwNbuozG6xUXWpMivzbbXyrv5vfC5wNa1se0=?=
```

所以我们不能直接依赖`email`库中的处理方式，需要额外进行处理

```python
missing = object()
if part.get_param('filename', missing, 'content-disposition') is missing:
    header = part.get('content-type')
else:
    header = part.get('content-disposition')
# 'attachment;\r\n        filename="\udcc4\udcc9\udccb\udcb9\udccc\udcd8\udcd6\udcd0\udcea\udcbf\udcea\udcbb\udcd1\udcf41\udcba\udcc520181030.rar"'
if isinstance(header, str):
    file_name = header
else:
    file_name = header._chunks[0][0]
file_name = file_name.split()[1]
# filename="\udcc4\udcc9\udccb\udcb9\udccc\udcd8\udcd6\udcd0\udcea\udcbf\udcea\udcbb\udcd1\udcf41\udcba\udcc520181030.rar"
file_name = file_name.split('=')[1].replace('"', '')
# \udcc4\udcc9\udccb\udcb9\udccc\udcd8\udcd6\udcd0\udcea\udcbf\udcea\udcbb\udcd1\udcf41\udcba\udcc520181030.rar
file_name = file_name.encode('ASCII', errors='surrogateescape')
# 居然chardet将gbk检测为俄语编码了。。。
# 还是直接硬编码gbk吧
# res = chardet.detect(file_name)
file_name = file_name.decode('gb2312')
```

那为什么`email`标准库不能正确处理呢？ 应该是对于8bit编码的传输方式还不支持。邮件中传输的编码默认是7bit的可打印的字符，但是近年来国内的大多数邮件服务器都已经支持8bit了，也就是可以直接支持`gbk`编码的传输。
