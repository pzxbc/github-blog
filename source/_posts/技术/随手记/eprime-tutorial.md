title: E-prime实验编写教程
tags:
  - Eprime
  - 技术
comments: true
permalink: eprime-tutorial
date: 2015-11-18 21:47:52
updated: 2015-11-18 21:47:52
---


{% asset_img eprime.jpg Eprime %}

E-prime是一套用于快速开发心理与行为的计算机实验的软件工具。通过E-prime中的E-studio软件我们可以可视化的编写一个实验。

<!-- more -->

## Hello World
下面我们通过编写一个E-prime的`Hello World`实验来展示E-studio的使用。

`Hello World`是一个非常简单的E-prime实验。它在运行后会首先在屏幕上显示`Hello World`，等待3秒后，显示实验结束语，3秒后退出实验。

1. **创建HelloWorld实验**

打开E-studio，点击界面中的菜单里的File->New。在弹出的窗口中选择新建一个空白实验。

{% asset_img new_eprime_experiment.png new_eprime_experiment %}

创建完成后，我们点击保存按钮，保存为HelloWorld。

2. **添加HelloWorld实验展示对象**

在新建HelloWorld实验后，在界面靠左有一个`structure`的窗口，里面有一个`SessionProc`的对象。双击这个对象会看到一个打开的窗口，里面有一个绿红圆点限定的直线。我们在设计E-prime的实验过程中个，绝大部分就是在这条直线上添加各种展示的实验对象。

2.1 从左边的`Toolbox`中拖拽`TextDisplay`对象到`SessionProc`的指向上。双击输入`Hello World！`；并点击左上带手的图标，打开属性窗口，在`Duration/Input`中的`Duration`输入3000。

2.2 继续再拖拽一个`TextDisplay`对象到`SessionProc`的直线上，位置处于上一个`TextDisplay`对象之后。双击输入`Thank you!`；并在`Duration`处输入3000。

{% asset_img eprime_session_objects.png eprime_session_objects %}

3. **运行实验**

点击工具栏中`Run`按钮(一个奔跑的人)运行我们编写的实验。

> **另外一个E-prime实验教程**，包含E-studio界面功能介绍与一个更复杂的实验例子。

> {% asset_link e-prime_tutorials.pdf E-prime实验指导 %}

## 对象使用

从上面的实验例子中以及PD文件中介绍的另外一个实验，我们发现E-prime实验的编写要点就是在于灵活使用`Toolbox`中的各种实验对象，来展示我们实验中需要展示的东西。

### ImageDisplay

用于显示实验中的图片，图片请直接放在实验文件保存的目录。注意E-prime实验运行后的窗口尺寸大小为680x480，所以显示的图片最好也是该尺寸。

### SoundOut

用于播放声音。可以使用MP3和WAV格式的音频，如果遇到不能正确播放，试着降低码率和采样率；还有种可能就是电脑的声卡或硬件配置太老，也导致不能正常播放(之前写过一个语音实验，要播放很多音频文件，在我破旧笔记本上经常播了几段后，接下来的音频就不能正常播放了，但是在另外一台比较新的电脑上却没有任何问题)。

### Slide

Slide对象可以用于同时展示多种元素，使得你可以在展示图片同时显示文字和播放声音。

### Procedure

Procedure就像一个播放器，它会依次播放和显示位于其上面的对象，对应着编程里面的函数概念。它主要用于和List一起使用，List提供Procedure里对象需要的数据，Procedure依次使用不同的数据来展示。比如你需要先显示一副图片，然后再播放一段声音，并且需要重复这样展示10组不同的图片和声音。这是你可以在List里面添加两个属性：图片名和音频名，并创建10条记录，分别填入对应的图片名和音频名。

### List

List用于给Procedure提供数据，另外它还可以嵌套List对象。在其他对象中使用List中的数据方法为，在需要填入数据地方输入`[List中对应数据的属性名]`

### Inline

Inline对象是用编程的方法来实现所需要的功能，语言类似Basic。下面的代码会先在屏幕绘制一个黑色的实心圆，3秒后进行清屏。

```
Set cnvs = Display.Canvas

cnvs.FillColor = CColor("white")
cnvs.Clear

cnvs.Pencolor = CColor("black")
cnvs.Fillcolor = CColor("black")

x = 320
y = 240
rad = 4

cnvs.Circle x, y, rad

sleep 30000

cnvs.FillColor = CColor("white")
cnvs.Clear
```

Inline代码中定义的变量只在一个Procedure里面有效。想要定义全局变量，点击菜单中的View->Script，在打开的窗口里的User标签页面里输入你需要定义的全局变量。

## 属性页面

属性页面可以配置实验对象的各种属性：展示样式、尺寸、时间以及记录的字段。

### 输入设备

通过添加输入设备，我们可以设置对象在展示时可以接受什么输入(键盘或鼠标)，以及可以接受的输入内容(特定的按键或者特定的鼠标按键)。

键盘按键的值就是对应键位上的值，比如允许输入d和k键，那么在`Allowable`输入`dk`就好。

**鼠标的左键对应的值为1，右键对应的值为2。**
