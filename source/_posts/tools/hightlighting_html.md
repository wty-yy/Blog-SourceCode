---
title: 使用Moodle中实现代码高亮
hide: false
math: true
abbrlink: 11000
date: 2022-03-18 21:52:01
index_img:
banner_img:
category:
 - tools
tags:
---

## 问题

在Moodle平台中直接贴代码感觉太丑了😅，但贴代码照片又太麻烦了，所以期望找一种方法实现代码高亮功能。

本文介绍下使用Moodle文本编辑器中的**html代码**功能实现代码高亮。

## 解决方法

### 找到html功能位置

我们先随便打开一个Moodle的文本编编辑器（"回复"时候没有，请点击右下角**高级**选项），点击“展开按钮”

![展开按钮](https://s1.ax1x.com/2022/03/18/qkaUXR.png)

找到第二行最后一个“html”按钮，进入html编辑模式，将里面的内容全部删掉

![html按钮](https://s1.ax1x.com/2022/03/18/qkat1J.png)

### 在线代码高亮网站

这里推荐两个可以将代码转化为html高亮代码的网站：

1. [代码在线高亮 | 菜鸟工具](https://c.runoob.com/front-end/5536/)

2. [Code Hightlighter Online](https://codebeautify.org/code-highlighter)

使用上述两个网站将代码转化为html代码，然后复制，粘贴回Moodle的文编编辑器中。

第一个网址，具体方法如下（可以选择代码样式为C++）：

![网站1 html代码生成](https://s1.ax1x.com/2022/03/18/qkwZss.png)

第二个网址，具体方法如下：

![网站2 html代码生成](https://s1.ax1x.com/2022/03/18/qkwsQH.png)

### 拷贝代码

拷贝网页上生成的html代码以后，回到Moodle文编编辑器界面，**先全部清空**，粘贴html代码，然后再次点击html按钮，即可看到效果了😆

![粘贴html代码](https://s1.ax1x.com/2022/03/18/qkadn1.png)

效果如下，自己试试看吧!

![效果图1](https://s1.ax1x.com/2022/03/18/qkaNc9.png)

![效果图2](https://s1.ax1x.com/2022/03/18/qkdZE6.png)
