title: Cocos2d-x游戏设计：创建新的游戏
comments: true
date: 2015-12-15 12:55:08
updated: 2015-12-15 12:55:08
tags:
  - 技术
  - Cocos2d-x
categories:
  - 技术
permalink: cocos2dx-game-design-01-new-game
---

## 开发环境
这个系列里的开发环境如下：

* Windows7 64位
* Microsoft Visual Studio 2013
* Cocos2d-x v3.9

## 安装Cocos2d-x

### 1. 下载[Cocos2d-x](http://www.cocos2d-x.org/download)

下载完后解压，假定解压后的存放的目录为`E:\develop\cocos2d-x-3.9\`。

### 2. 安装Cocos2d-x

运行下面命令安装Cocos2d-x。执行完后请重启系统或者新开控制台窗口，使环境变量生效。

<!-- more -->

``` bat
cd E:\develop\cocos2d-x-3.9
python setup.py
```

运行上面命令后，会设置下面几个环境变量：

* **COCOS_CONSOLE_ROOT：** Cocos控制台工具目录
* **COCOS_TEMPLATES_ROOT：** Cocos工程模板目录
* **NDK_ROOT：** Android NDK目录
* **ANDROID_SDK_ROOT：** Android SDK目录
* **ANT_ROOT：** Apache-ant的bin目录

要想在Windows上编译运行Cocos2d-x游戏，只需要正确设置了`COCOS_CONSOLE_ROOT`目录即可。

## 创建新的游戏项目

打开控制台窗口，执行下面命令

``` bat
cocos new -p com.pzxbc.mygame -d H:\work\projects\cocos2dx\ -l lua mygame
```

关于cocos命令的使用，请使用命令`cocos -h`查阅

进入`H:\work\projects\cocos2dx\`目录，我们会看到下面的文件结构

{% asset_img cocos2d-x-project-dirs.png 新项目文件结构%}

## 编译运行游戏

进入游戏项目目录下的`frameworks\runtime-src\proj.win32`目录，使用Visual Studio 2013打开mygame.sln解决方案文件，然后编译运行就会看到下面的游戏窗口了。

{% asset_img cocos2d-x-new-game-window.png 游戏窗口%}

## 修改生成操作

编译运行游戏后，我们再仔细看下游戏项目目录，会发现多了一个`simulator`目录，里面包含一个`win32`目录。`win32`目录里存放的就是编译生成的Windows游戏运行文件，包含了Cocos2d-x引擎dll文件、游戏可执行文件以及脚本和资源文件。

后面我们主要使用脚本进行游戏逻辑开发，绝大部分操作时关于脚本和资源的，不需要再重新编译生成引擎库文件和游戏执行文件。当我们修改了脚本和资源文件后，只需要重新运行游戏EXE文件就可以看到效果，这也是脚本开发的便利之一。

`win32`目录下的资源和脚本文件是Visual Studio在生成游戏时从游戏项目目录下同步拷贝过来的。这样导致了一个弊端：存在两份资源和脚本文件。当我们修改了游戏项目目录下的`res`和`src`里的脚本和资源文件后，要重新同步拷贝至`win32`目录下。因此最好`win32`目录下的资源和脚本文件是直接链接到游戏项目下的资源脚本文件，这样当我们对资源脚本改动后，直接运行`win32`目录下的游戏EXE文件就能看到改动效果。

解决方案是使用Windows的软链接，具体步骤如下：

1. 在Visual Studio里打开mygame的项目属性页
2. 找到`Custom Build Step`->`General`->`Command Line`
3. 修改里面的命令为下面内容

``` bat
if not exist "$(LocalDebuggerWorkingDirectory)" mkdir "$(LocalDebuggerWorkingDirectory)"
xcopy /Y /Q "$(OutDir)*.dll" "$(LocalDebuggerWorkingDirectory)"
xcopy /Y /Q "$(ProjectDir)..\Classes\ide-support\lang" "$(LocalDebuggerWorkingDirectory)"
if exist "$(LocalDebuggerWorkingDirectory)\res" rmdir /S /Q "$(LocalDebuggerWorkingDirectory)\res"
mklink /D "$(LocalDebuggerWorkingDirectory)\res" "$(ProjectDir)..\..\..\res"
if exist "$(LocalDebuggerWorkingDirectory)\src" rmdir /S /Q "$(LocalDebuggerWorkingDirectory)\src"
mklink /D "$(LocalDebuggerWorkingDirectory)\src" "$(ProjectDir)..\..\..\src"
```

使用Visual Studio生成运行游戏，你会发现`win32`目录下的`res`和`src`文件夹带有一个快捷方式的小图标。这两个文件夹现在是链接到了游戏项目目录下的`src`和`res`目录，因此当你当你对游戏项目目录下的资源和脚本文件进行改动后，直接运行`win32`目录下的游戏EXE就能看到效果，不需要再进行同步。

## 参考

1. [Cocos2d-x官方网站](http://www.cocos2d-x.org/)
2. [MS DOS命令列表](https://zh.wikipedia.org/wiki/MS-DOS%E5%91%BD%E4%BB%A4%E5%88%97%E8%A1%A8)
3. [Windows中的符号、软、硬链接](https://blog.alphatr.com/windows-mklink.html)
