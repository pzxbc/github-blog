title: VisualStudio并行编译设置
date: 2019-03-28 16:26:06
updated: 2019-03-28 16:26:06
permalink: visual-studio-parallel-compile-setup
tags:
  - VisualStudio
  - 并行编译
---


在多核机器上使用VisualStudio编译C++程序，VisualStudio不会默认开启并行编译，需要进行如下设置

1. 选取项目属性

{% asset_img visual-studio-parallel-compile-setup-01.png %}

<!-- more -->

2. 在打开的对话框中，左侧选择 “C/C++”->“General（常规）”中将“ Multi-processor Compilation(多处理器编译)”打开

{% asset_img visual-studio-parallel-compile-setup-02.png %}

3. 接着，“C/C++”->“Code Generation（代码生成）”中将“Enable Minimal Rebuild(启用最小重新生成)”关闭

{% asset_img visual-studio-parallel-compile-setup-03.png %}

4. 在“Debug(调试)”中选取项目的“Options and Settings (选项和设置）”->“Projects and Solutions (项目和解决方案)”->“ Build and Run (编译与运行)”中设置“ maximum number of parallel project builds

{% asset_img visual-studio-parallel-compile-setup-04.png %}

{% asset_img visual-studio-parallel-compile-setup-05.png %}

5. VC++ Project Settings中设置C++并发编译数

{% asset_img visual-studio-parallel-compile-setup-06.png %}