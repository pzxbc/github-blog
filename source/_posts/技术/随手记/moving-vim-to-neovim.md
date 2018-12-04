title: 从Vim迁移到NeoVim
p: 技术/随手记/moving-vim-to-neovim.md
date: 2018-12-03 21:20:01
updated: 2018-12-03 21:20:01
tags:
  - Vim
  - NeoVim
---


`Vim`使用了也有四年时间了，作为一款编辑器，确实是很方便，已经习惯于只使用键盘操作。主要的应用场景在与服务端编程，`SSH`连接服务器后，直接就可以`Vim`编辑源码了。


`Vim`主要写`Python`代码，使用`jedi-vim`插件，但是不支持虚拟环境。

nvim的配置文件

[nvim参考文件nvim-from-vim](https://neovim.io/doc/user/nvim.html#nvim-from-vim)


1. To start the transition, create your |init.vim| (user config) file:

    :call mkdir(stdpath('config'), 'p')
    :exe 'edit '.stdpath('config').'/init.vim'

2. Add these contents to the file:

    set runtimepath^=~/.vim runtimepath+=~/.vim/after
    let &packpath = &runtimepath
    source ~/.vimrc

3. Restart Nvim, your existing Vim config will be loaded.


使用Python

nvim中的python不想vim中那样直接编译到了vim种，nvim通过远程调用的方式来使用，可以使用系统中安装好的python

配置
https://neovim.io/doc/user/provider.html#provider-python

先创建一个虚拟环境专门用于暗转pynvim

``` bash
python3.5 -m venv py35nvim
source py35nvim/bin/activate
pip install pynvim
```

配置python开发

``` bash
source py35nvim/bin/activate
pip install jedi
```

``` vim
if has('nvim')
    Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
else
    Plug 'Shougo/deoplete.nvim'
    Plug 'roxma/nvim-yarp'
    Plug 'roxma/vim-hug-neovim-rpc'
endif
let g:deoplete#enable_at_startup = 1
" Python 编程
Plug 'zchee/deoplete-jedi'
```



nvim-from-vim
```
:help nvim-from-vim
```

`~/.config/nvim/init.vim`

bash_alias中添加别名
``` bash
alias nvim=vim
```

主题

使用真彩色
https://lotabout.me/2018/true-color-for-tmux-and-vim/

1. 配置tmux
2. 验证终端是否支持24真彩色

iterm2 需要可以设置`terminal type`


字体安装
brew tap caskroom/fonts
brew cask install font-fantasquesansmono-nerd-font-mono


主题使用
Plug 'drewtempelmeyer/palenight.vim'
Plug 'itchyny/lightline.vim'

状态栏使用 lighline

vim使用图标
https://github.com/ryanoasis/vim-devicons

需要patch的字体，
参考https://github.com/ryanoasis/nerd-fonts#option-8-patch-your-own-font
patch字体


参考
1. https://blog.pabuisson.com/2018/06/favorite-color-schemes-modern-vim-neovim/