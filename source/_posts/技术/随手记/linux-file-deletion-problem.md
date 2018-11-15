title: Linux文件删除问题
toc: true
comments: true
permalink: linux-file-deletion-problem
date: 2018-05-31 15:34:07
updated: 2018-05-31 15:34:07
tags:
  - 技术
  - Linux
---

有个数据服务器磁盘空间快要被占满了，使用了rm删除一些无用的大文件后，使用`df -h`查看磁盘状态，发现并没有释放空间。

经常一番查找后确认是因为被删除的文件还在被进程引用。可以通过命令`lsof | grep deleted`确认是不是这个原因，命令执行后，如果被删除的文件在命令结果列表里，那么就是该文件还在被引用。

解决方法： 关闭对应进程，释放占用的`fid`

另外，这次操作的磁盘对应的文件系统是`LVM`的，了解下相关命令。

``` bash
# 显示磁盘信息
fdisk -l
# 查看LVM映射
pvdisplay
lvdisplay -a
```