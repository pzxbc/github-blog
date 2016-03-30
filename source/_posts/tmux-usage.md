title: tmux使用
comments: true
date: 2016-03-30 18:58:05
updated: 2016-03-30 18:58:05
tags:
  - 技术
  - Linux
  - Tmux
categories:
  - 技术
permalink: tmux-usage
---

tmux是一个终端复用软件，它设计的更为简单和现代，欲取代GNU的screen。tmux可以让你在一个终端里新开多个窗口(类似XShell中的多标签)，并且每个窗口还可以继续切分为更小的pane。在远程登录中，tmux会保存你的工作环境，不会因为连接断开而命令停止执行，类似于nohup功能。当你重新进入原来的tmux的session后，不光之前执行的命令还在继续，原来打开的各种窗口、工作目录等都能恢复。

那么到底使用tmux能够带来哪些好处了，就个人而言，我以前的工作方式是：

<!-- more -->

1. 打开XShell软件，SSH远程登录
2. 打开vim或者进入某个工作目录执行命令
3. 复制一个新的SSH窗口
4. 重复第二步，直到我所有需要的工作环境都恢复
5. 开始工作
6. 为了执行代码或者查看运行日志，切出vim或者切换到新的SSH窗口查看

现在的工作方式是：

1. 打开XShell，SSH远程登录
2. 执行tmux命令恢复session，所有上次工作环境就恢复了
3. 开始工作
4. 窗口多pane，命令和日志可以直接在当前窗口执行和查看

## 安装
在tmux[主页](https://tmux.github.io/)下载最新版的源代码包({% asset_link tmux-2.1.tar.gz tmux2.1 %}  {% asset_link libevent-2.0.22-stable.tar.gz libevent2.0 %})，`tar zxvf tmux_package`解压后，参考目录里的`README`安装。

在`make verify`验证`libevent`的安装时，可能会出现下面错误。感觉应该某个域名被`gfw`封了导致的，没有`vpn`测试。在忽略这个错误继续安装后，目前都能正常使用。 

> FAIL regress_dns.c:156: assert(dns_ok == DNS_IPv4_A): 0 vs 1dns/gethostbyname

在`make`编译tmux的过程中可能会出现缺少`curses-dev`库的错误，类debian系统中使用如下命令安装，其他系统请参考[这里](http://www.cyberciti.biz/faq/linux-install-ncurses-library-headers-on-debian-ubuntu-centos-fedora/)

``` bash
sudo apt-get install libncurses5-dev
```

如果你是直接使用系统自带的包管理器安装的tmux，请确认下tmux的版本`tmux -V`。tmux 1.x的版本在`less`、`man`等命令中搜索时，查找到的字符串不会高亮，导致看起来很不方便。因此建议手动安装最新版本。

## 配置

tmux的配置可以存在于`/etc/tmux.conf`和`~/.tmux.conf`文件中，前者是全局的配置，后者是关于特定用户的。

下面是我的配置
``` bash
# 支持256 color
set -g default-terminal "screen-256color"

set -g history-limit 10000

# 设置复制模式下键位绑定方式
set-window-option -g mode-keys vi

bind k selectp -U # 选择上窗格  
bind j selectp -D # 选择下窗格  
bind h selectp -L # 选择左窗格  
bind l selectp -R # 选择右窗格
```

修改完配置后，想让当前tmux的session生效，进入Command模式(如何进入参考后面的使用)，执行下面命令
``` bash
source-file ~/.tmux.conf
```

如果在配置了256色后，发现在tmux中运行的程序(如vim)依然没有256色，那么使用`tmux -2`命令启动，强制使用256色。

如果系统是`gbk`编码，但是SSH终端却使用`utf-8`编码连接，那么在启动时需要添加`-u`选项，强制使用`utf-8`，不然会出现乱码、花屏。

默认安装tmux后，在使用tmux命令的过程中不能tab补全，需要安装补全脚本。下载[补全脚本](https://github.com/srsudar/tmux-completion/blob/master/tmux)，放在`/etc/bash_completion.d/`目录下，然后执行`source /etc/bash_completion.d/tmux`。

如果按`Tab`键后，出现如下错误，请先创建一个tmux server就好了(就是直接运行命令`tmux`)。

> no server running on /tmp/tmux-1000/default

## 使用

tmux分为几个模式：普通模式、Command模式、复制模式、粘贴模式。

普通模式就是直接使用终端。

Command模式下可以通过各种绑定的按键来操作tmux，如创建新窗口、新建pane、输入命令等，类似vim的command模式。默认进入Command模式的按键为`Ctrl+b`。进入Command模式后，输入`:`后，可以在状态栏输入命令。

复制模式下可以进行复制，进入方式为`Ctrl+b`->`[`，粘贴模式进入方式为`Ctrl+b`->`]`。

### session操作
创建一个默认的session，并进入tmux
``` bash
tmux
```

新建session，并进入
``` bash
tmux new-session -s session_name
```

暂时离开session： `Ctrl+b`->`d`

恢复原来的session
``` bash
tmux attach-session -t session_name
```

列出已有的session
``` bash
tmux list-session
```

关闭session： `Ctrl+b` -> `:` -> `kill-session`。 或者
``` bash
tmux kill-session -t session_name
```

### 窗口操作
新建一个窗口： `Ctrl+b` -> `c`
关闭一个窗口： `Ctrl+b` -> `&`
窗口命名： `Ctrl+b` -> `,`
调整窗口index： `Ctrl+b` -> `.`
选择0-9窗口： `Ctrl+b` -> `0-9`
选择前/后窗口： `Ctrl+b` -> `p/n`

### pane操作
垂直分割一个pane： `Ctrl+b` -> `%`
水平分割一个pane： `Ctrl+b` -> `"`
关闭pane： `Ctrl+b` -> `x`
选择下一个pane： `Ctrl+b` -> `o`
调整pane大小： `Ctrl+b` -> `Ctrl+Up,Ctrl+Down,Ctrl+Left,Ctrl+Right`
最大化/还原pane： `Ctrl+b` -> `z`

最后，详细的使用还是参考`man tmux`。

> `Ctrl+b` -> `z` 表示先按`Ctrl+b`键，然后再按`z`键
