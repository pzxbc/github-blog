title: tmp
comments: true
tags:
  - tag1
  - test
categories:
  - test
permalink: test
date: 2019-03-12 14:41:32
updated: 2019-03-12 14:41:32
---


从http协议、web server一直到web application framework的文章

也帮助自己梳理下知识

计算机网络以及HTTP协议

记得当年学计算机网络这么课时，一直都处于云里雾里。一是自己没怎么专心，二是不理解计算机网络究极是个什么东西。

以前

网络传输
osi七层模型

这个只是理论上的模型，就是我们应该按照这个设计来实现

计算机网络是由一组相互连接的计算机组成，计算机网络

多台计算机相互连接在一起，并且相互通信就构成了计算机网络。计算机网络要解决的问题就是网络中的这些计算机如何通信。

最早的计算机


但是对于到实际实现中，我们实现的是tcp/ip模型 4层架构

我们的http协议位于应用层协议
http 协议
https://blog.csdn.net/jnu_simba/article/details/11674477


python版简单的http 服务器 hello world 例子

python socket web server

https://cloud.tencent.com/developer/article/1008509


wsgi协议
协议规定了哪些
python自己实现

flask是服务wsgi协议的框架
flask整个call流程怎么样的

flask 上下文

路由原理  uri对应一个请求也就对应一个后端的处理，flask如何处理这个请求呢
路由技术，这个uri在flask启动后就注册一个处理函数，当匹配到对应的uri时，就调用当时注册的匹配函数

flask部署

flask开发过程中一些实际技术的应用

sqlachemy
flask-cache
flask-restful
flask-graphql