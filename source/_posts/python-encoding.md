title: Python中的字符编码
date: 2017-01-18 19:22:20
updated: 2017-01-18 19:22:20
tags:
  - 技术
  - Python
categories:
  - 技术
permalink: python-encoding
---

Python中用`str`类型来表示带编码的字符串，不同的字符编码可以通过`unicode`这个中间格式来转换。

```Python
# -*- coding: utf-8 -*-
# utf-8编码的字符串
a = '测试字符串'
# 转换为unicode
ua = a.decode('utf-8')
# 编码为gbk的字符串
ga = ua.encode('gbk')
```

<!-- more -->

## 解释器中交互输入输出的编码

Python解释器运行后，`stdin`和`stdout`默认的编码是系统的编码，在Windows平台一般是`gbk`编码，Linux平台一般是`utf-8`编码。而后你在解释器交互过程中输入输出的字符串都是经过这个默认编码编码过的。

假设解释器默认的编码是`utf-8`，但是你在处理过程中产生了`gbk`编码的字符串，这样的字符串直接输出到控制台是不能正确显示的，因为控制台会按照`utf-8`的编码格式去解码这个`gbk`字符串。你可以将这个`gbk`编码的字符串转为`unicode`或者`utf-8`就可以正常`print`显示。`unicode`格式的字符串在输出后会按照`stdout`的编码`encode`转换。

```Python
# utf-8 编码
>> a = '测试编码'
>> print a # 正常显示
>> print a.decode('utf-8') # 正常显示 在输出的时候又编码回utf-8
>> print a.decode('utf-8').encode('gbk') # 显示异常
```

## 源文件中的编码

Python的源文件是纯文本文件，它其中包含的字符也是按照某种字符编码来保存的。比如你用`Windows`的TXT编辑器，那么保存的默认格式就个`gbk`编码的文本。你还可以用Notepad++编辑器编辑然后以`utf-8`格式保存。

既然源码文件的字符是有编码的字符，那么源码中的字符串肯定也是按照源码文件的编码去编码的。我们怎么将这个编码告诉解释器，使它能够正确地处理这些字符串？

通过在源文件头部使用下面标签就可以告诉解释器该文件中的字符是什么编码的。一般常用的编码也就是`gbk'和`utf-8`

```Python
# -*- coding: utf-8 -*-
```

## 与字符编码有关的其他细节

### StringIO与cStringIO

StringIO提供了一个缓存区，在这个缓存区上面，我们可以进行类文件操作的调用，比如读和写。cStringIO是其的C语言实现版本，效率上有提高。

但是请注意，**StringIO可以接收`str`和`unicode`，但cStringIO只能接收`str`格式的。**
