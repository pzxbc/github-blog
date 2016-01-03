title: Cocos2d-x自定义UI控件：时间选择控件
tags:
  - 技术
  - Cocos2d-x
comments: true
categories:
  - 技术
permalink: cocos2dx-custom-pageview-control
date: 2015-12-11 22:10:10
updated: 2015-12-11 22:10:10
---


UI设计的想弄一个像IOS上时间选择样的控件，可无奈Cocos2d-x中没有这个控件，只好手动撸一个了。

在Cocos2d-x所有的UI控件中，PageView控件跟这个时间选择样的控件最为相似，都是上下滑动选择不同的Item，当滑动距离没超过半个Item时，自动回退到原来的位置，超过半个Item时，自动滑动到下一个Item。区别在于PageView控件只能显示一个Item，时间选择控件能够同时显示多个Item，并且中间有一个标示框标示选中的Item。

<!-- more -->

## 实现原理

看了PageView的实现代码后，发现关键在于设置_leftBoundary、_rightBoundary以及Item的大小。Item的大小跟控件显示几个Item有关，_leftBoundary和_rightBoundary是控件中间被选中的那个Item的下边界和上边界。当设置好控件显示几个Item以及控件的大小后，上面的三个量都可以确定。所以我添加了一个接口`setShowedNum`来设置控件显示的个数(**需要在setContentSize之前调用；当值为1时，显示效果跟原来的PageView控件一样**)。

时间选择控件的中间有一个标示框标示当前选中的Item，这个效果比较好实现。通过给控件添加一个透明效果的子控件，将其大小设置和Item的大小一致，并将位置设置在中间即可。添加了一个`setMarkWidget`的接口来做这样一件事情。

具体代码实现:
1. **C++版本** 基于Cocos2d-x v3.9版本的PageView控件，实现的比较全面，支持竖直和水平两个方向。  
{% asset_link UIPageCenteredView.cpp PageCenteredView源文件 %}
{% asset_link UIPageCenteredView.h PageCenteredView头文件 %}
2. **Lua版本** 只现实了竖直方向的，以后有水平的需求再说  
{% asset_link PageCenterView.lua PageCenterView Lua版本 %}

## 使用方法

下面是Lua版本的使用示例

``` Lua
local PageCenterView = require('PageCenterView')
local testPageView = PageCenterView.new()
testPageView:setShowedNum(val)
testPageView:setContentSize(size)
parentCtrl:addChild(testPageView:getWidget())\
-- 中间标示选中区域的控件
testPageView:setMarkWidget(markWidget)

for i = 1, num do
    local layout = ccui.Layout:create()
    -- add child to layout
    -- ...
    
    testPageView:addPage(layout)
end

local onEvent = function (sender, eventType)
    if eventType == PageCenterView.EventType.TURNING then
        print(testPageView:getCurPageIndex())
    end
end
testPageView:addEventListener(onEvent)

testPageView:scrollToPage(val)
testPageView:doLayout()

```

## 外观效果

{% asset_img pagecenterview_show.png 时间选择控件效果 %}

