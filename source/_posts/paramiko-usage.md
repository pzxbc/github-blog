title: Python的SSH库Paramiko使用
comments: true
date: 2016-02-24 19:04:48
updated: 2016-02-24 19:04:48
tags:
  - 技术
  - Python
  - Paramiko
categories:
  - 技术
permalink: paramiko-usage
---

[Paramiko](https://github.com/paramiko/paramiko/)是Python中实现SSHv2协议的一个库。Paramiko中实现了SSH Client、Server、SFTP、Agent等对象，基于Paramiko我们能够使用Python实现几乎所有的SSH操作。

## 安装

1\. 安装[pycrypto](https://www.dlitz.net/software/pycrypto/)，Windows上有编译好的二进制包在[这里](http://www.voidspace.org.uk/python/modules.shtml#pycrypto)下载。

<!-- more -->

2\. 安装[ecdsa](https://pypi.python.org/pypi/ecdsa)
``` bash
pip install ecdsa
```

3\. 安装Paramiko
``` bash
pip install paramiko
```

> 官方安装指导http://www.paramiko.org/installing.html

## 使用

### 1. SSH公钥登录，执行Shell命令
``` Python
import crypto
import sys
sys.modules['Crypto'] = crypto

import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
hostname = 'xxx'
port = xxx
username = 'xxx'
# 私钥的密码，没有则不需要传递password参数
password = 'xxx'
key_filename = '/path/to/private_file'
ssh.connect(hostname, port = port, password = password, key_filename = key_filename)
# 执行shell命令
stdin, stdout, stderr = ssh.exec_command('ls -lh')
# 读取命令运行结果
print stdout.read()

ssh.close()
```

### 2. SFTP使用
``` Python
# ssh connect by SSHClient
# ...

sftp = ssh.open_sftp()
# 更改工作目录
sftp.chdir('/home/xxx/test')
# 上传本地文件
sftp.put(r'H:\test\test_file.txt', 'test.txt')
# 下载远程文件
sftp.get('test.txt', r'.\test2.txt')
# 删除远程文件
sftp.remove('file_path')
# 删除远程目录
sftp.rmdir('dir_path')
# 更改回默认工作目录
sftp.chdir()

sftp.close()
```

> API 文档说明http://docs.paramiko.org/en/1.16/

## 技巧总结

1\. `import paramiko`时出现关于`Crypto`错误。

实际上`Crypto`库的名字应该小写，因此在`import paramiko`语句前添加下面代码
``` Python
import crypto
import sys
sys.modules['Crypto'] = crypto
```

2\. SFTPClient可以通过`chdir`函数更改工作目录，但是SSHClient无法更改工作目录，连接后执行命令的目录都是用户Home目录

3\. SFTPClient对象的`rmdir`函数不能删除非空目录
