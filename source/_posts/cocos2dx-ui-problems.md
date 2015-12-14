title: Cocos2d-x UI使用问题总结
comments: true
date: 2015-12-10 16:02:36
updated: 2015-12-10 16:02:36
tags:
  - 技术
  - Cocos2d-x
categories:
  - 技术
permalink: cocos2dx-ui-problems
---

## 基础

### 1. 更新位置和大小信息

当使用`widgetFromBinaryFile`或者`widgetFromJsonFile`创建UI后，某些百分比控件的位置和尺寸并不是正确的，可以使用`updateSizeAndPosition`来更新。

### 2. 控件尺寸百分比和位置百分比

当在一个控件的尺寸或者位置指定为百分比类型时，那么再对它使用`setPosition`和`setContentSize`是没有用。当发现一个控件进行位置和大小设置后没有变化，就应该先去查一查是不是设置为百分比类型了。

<!-- more -->

## 控件

### 1. [容器层的使用][layout_use]

[layout_use]: http://www.cocos2d-x.org/docs/manual/framework/native/wiki/containers/zh

容器层的基类是`Layout`，以此为基础派生的类有： `ScrollView`, `ListView`, `PageView`

`ScrollView`继承自`Layout`， `ListView`继承自`ScrollView`，`PageView`继承自`Layout`。它们的内部又包含了一个`Layout`对象来封装子对象。

`ScrollView`内部的`Layout`对象_innerContainer的Size要比`ScrollView`本身大才能够进行拖动操作。

当我们拖动`ScrollView`内部的子对象移动时，其实移动的是_innerContainer对象。

在`ScrollView`某个item上移动一小段距离后，引擎会调用`setHighlighted(false)`，取消控件的聚焦效果。

对于`ListView`，使用`doLayout`来更新_innerContainer对象的大小。

### 2. 按钮

* **设置为按下状态图片**
``` Lua
button:setHighlighted(true)
```

* **设置为禁用状态图片**
``` Lua
button:setBright(false)
```

