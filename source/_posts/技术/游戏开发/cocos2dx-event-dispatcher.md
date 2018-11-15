title: Cocos2d-x消息处理机制
tags:
  - 技术
  - Cocos2d-x
comments: true
permalink: cocos2dx-event-dispatcher
date: 2015-12-11 21:10:10
updated: 2015-12-11 21:10:10
---


## 原理

在Cocos2d-x V3.0以上，使用事件监听机制来处理触摸消息。引擎启动后会有一个全局的EventDispatcher来负责接收设备的输入消息并将这些消息分发给向其注册的Node对象。Node对象向EventDispatcher注册自己感兴趣的消息类型后，EventDispatcher就会将相应的消息分发给这个Node。

## 使用

下面是C++中Node对象监听触摸事件的方法。

``` C++
auto listener = EventListenerTouchOneByOne::create();
listener->setSwallowTouches(true);
listener->onTouchBegan = CC_CALLBACK_2(YourNode::onTouchBegan, this);
listener->onTouchMoved = CC_CALLBACK_2(YourNode::onTouchMoved, this);
listener->onTouchEnded = CC_CALLBACK_2(YourNode::onTouchEnded, this);
_eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
```

<!-- more -->

EventListenerTouchOneByOne是创建一个单点触控的监听对象，你也可以通过`EventListenerTouchAllAtOnce::create()`创建多点触控的监听。

当`setSwallowTouches`设置为true，`YourNode::onTouchBegan`返回true时，EventDispatcher对象就不再将该触摸事件分发给其他Node对象。

通过`addEventListenerWithSceneGraphPriority`将Node与创建的监听对象listener注册到EventDispatcher中去。EventDispatcher在分发触摸事件时是按照一定顺序来的。对于使用`addEventListenerWithSceneGraphPriority`注册Node对象，EventDispatcher会按照它们的Zorder顺序来分发触摸事件，即显示在最前面的Node对象最先收到触摸事件。

下面是Lua中的写法

``` Lua
function TestNode:_initAction()
    local onTouchBegan = function (touch, event)
        return self:onTouchBegan(touch, event)
    end
    local onTouchMoved = function (touch, event)
        return self:onTouchMoved(touch, event)
    end
    local onTouchEnded = function (touch, event)
        return self:onTouchEnded(touch, event)
    end
    local onTouchCancelled = function (touch, event)
        return self:onTouchCancelled(touch, event)
    end
    local listener = cc.EventListenerTouchOneByOne:create()
    listener:setSwallowTouches(true)

    listener:registerScriptHandler(onTouchBegan, cc.Handler.EVENT_TOUCH_BEGAN)
    listener:registerScriptHandler(onTouchMoved, cc.Handler.EVENT_TOUCH_MOVED)
    listener:registerScriptHandler(onTouchEnded, cc.Handler.EVENT_TOUCH_ENDED)
    listener:registerScriptHandler(onTouchCancelled, cc.Handler.EVENT_TOUCH_CANCELLED)

    local eventDispatcher = self.layout:getEventDispatcher()
    -- self.layout为接收触摸事件的Node对象
    eventDispatcher:addEventListenerWithSceneGraphPriority(listener, self.layout)
end
```

## Cocos2d-x UI中消息处理

Cocos2d-x中的UI都是基于Widget这个基类。当我们调用widget:setTouchEnabled(true)时，就会像上面那样，将widget对象注册到EventDispatcher中去，接收触摸事件。而且在widget基类中已经实现一套onTouchBegan，onTouchMoved，onTouchEnded，onTouchCancelled函数。

在widget的onTouchBegan函数中，会判断触摸事件发生的位置是否处于这个widget当中以及这个widget是否可见是否enabled。如果条件满足，就认为该触摸事件是属于这个widget对象的，onTouchBegan返回true，通知EventDispatcher不再将该触摸事件分发给其他对象，这也符合UI的设计期望：我们只希望最前面的UI界面响应触摸事件。另外当设置了_propagateTouchEvents后，onTouchBegan还会将触摸事件传递给其父对象，这也是为什么ListViewUI控件在拖动的同时子对象也能够处理触摸事件。

在UI控件中我们一般不关心触摸事件发生位置，我们只关心TouchDown，TouchMoved，TouchEnded等这些定性的消息，所以基类Widget的onTouchXXX处理函数做的另外一件事就是将触摸事件封装成了定性的消息。我们可以通过addTouchEventListener向UI对象添加处理这些定性消息的处理函数。

UI中消息处理代码

``` Lua
-- Lua
uixx:setTouchEnabled(true)
local onClickUp = function(sender, eventType)
    if eventType == ccui.TouchEventType.ended then
        -- process your logic
    end
end
uixx:addTouchEventListener(onClickUp)
```

如果想在UI控件中处理定量的触摸消息（需要Touch的位置信息），C++中我们派生这个UI对象，然后重写onTouchXXX函数，然后调用setTouchEnabled(true)即可。但在Lua中我们需要像一般Node对象那样向EventDispatcher注册自己来处理消息，并且不能调用setTouchEnabled(true)。因为调用这个函数后，我们就又向EventDispatcher注册了这个UI对象的基类消息处理函数。我在Lua中定制一个[UI控件](/2015/12/11/cocos2dx-custom-pageview-control/)时就犯了这个错误，查了好久才发现。。。


## 参考
1. [Coco2d-x事件分发机制](http://www.cocos2d-x.org/docs/manual/framework/native/v3/event-dispatcher/zh)
2. [Cocos2d-x中拖拽精灵](http://www.cocos2d-x.org/docs/tutorial/framework/native/how-to-drag-and-drop-sprites/zh)
