title: rsync使用
date: 2017-04-06 18:50:30
updated: 2017-04-06 18:50:30
tags:
  - 技术
  - rsync
permalink: rsync-usage
---

最近有个需求想把服务器上的照片同步到电脑后，然后再使用Google Photo备份到google。想到了使用rsync来做同步。

rsync是一个类UNIX系统下的数据镜像备份工具，它的特性如下：

1. 可以镜像保存整个目录树和文件系统
2. 可以很容易做到保持原来文件的权限、时间、软硬链接等等
3. 无须特殊权限即可安装
4. 优化的流程，文件传输效率高
5. 可以使用rsh、ssh等方式来传输文件，当然也可以通过直接的socket连接
6. 支持匿名传输

在使用rsync进行远程同步时，可以使用两种方式：**远程Shell方式**（用户验证由ssh负责）和 **C/S 方式**（即客户连接远程rsync服务器，用户验证由rsync服务器负责）。

无论本地同步目录还是远程同步数据，首次运行时将会把全部文件拷贝一次，以后再运行时将只拷贝有变化的文件（对于新文件）或文件的变化部分（对于原有文件）。

<!-- more -->

## rsync使用

```Shell
rsync -avzP [SRC] [DEST]
```

常用选项

> -v : Verbose (try -vv for more detailed information) # 详细模式显示
-e "ssh options" : specify the ssh as remote shell # 指定ssh作为远程shell
-a : archive mode # 归档模式，表示以递归方式传输文件，并保持所有文件属性，等于-rlptgoD
-r(--recursive) : 目录递归
-l(--links) ：保留软链接
-p(--perms) ：保留文件权限
-t(--times) ：保留文件时间信息
-g(--group) ：保留属组信息
-o(--owner) ：保留文件属主信息
-D(--devices) ：保留设备文件信息
-z : 压缩文件
-h : 以可读方式输出
-H : 复制硬链接
-X : 保留扩展属性
-A : 保留ACL属性
-n : 只测试输出而不正真执行命令，推荐使用，特别防止--delete误删除！
--stats : 输出文件传输的状态
--progress : 输出文件传输的进度
––exclude=PATTERN : 指定排除一个不需要传输的文件匹配模式
––exclude-from=FILE : 从 FILE 中读取排除规则
––include=PATTERN : 指定需要传输的文件匹配模式
––include-from=FILE : 从 FILE 中读取包含规则
--numeric-ids : 不映射 uid/gid 到 user/group 的名字
-S, --sparse : 对稀疏文件进行特殊处理以节省DST的空间
--delete : 删除DST中SRC没有的文件，也就是所谓的镜像[mirror]备份


对于Windows，有个[cwRsync](https://itefix.net/content/cwrsync-free-edition)版本
