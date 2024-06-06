---
title: 本科毕设《基于非嵌入式强化学习的卡牌游戏AI研究》技术文档
hide: true
math: true
abbrlink: 12073
date: 2024-06-04 15:30:36
index\_img:
banner\_img:
category:
tags:
---

> 代码：[KataCR](https://github.com/wty-yy/KataCR)，图像数据集（切片图像，分类图像）：[Clash-Royale-Detection-Dataset](https://github.com/wty-yy/Clash-Royale-Detection-Dataset)，离线数据集：[Clash-Royale-Replay-Dataset](https://github.com/wty-yy/Clash-Royale-Replay-Dataset)

本文主要对我的本科毕设流程、算法细节进行简要介绍，首先给出本科毕设论文作为参考（有非常多冗余内容）：

{% pdf /file/基于非嵌入式强化学习的卡牌游戏AI研究（终版）.pdf pdf %}

本文将按照论文讲解的顺序进行介绍：生成式目标识别数据集，图像感知融合，决策模型设计。

YOLOv8目标识别效果：
<div align="center">
  <img src="https://github.com/wty-yy/picture-bed/blob/master/1.gif?raw=true" width="49%">
  <img src="https://github.com/wty-yy/picture-bed/blob/master/2.gif?raw=true" width="49%">
</div>

模型实时对局效果：
<div align="center">
  <img src="https://github.com/wty-yy/picture-bed/blob/master/2_eval.gif?raw=true" width="100%">
</div>

# 整体架构设计

![整体架构](https://github.com/wty-yy/KataCR/blob/master/asserts/figures/framework.jpg?raw=true)

非嵌入即直接识别手机中的图像，手机通过USB连接电脑，通过Scrcpy将视频流传输到Linux内核中的V4L2虚拟设备中（[Scrcpy-V4L2](https://github.com/Genymobile/scrcpy/blob/master/doc/v4l2.md)），再通过Python中的OpenCV读取成`np.ndarray`数组形式，将图像的不同部分传入到不同的模型中进行预识别，再通过感知融合模型处理成决策模型输入的特征，传入到决策模型中进行决策。

# 目标识别数据集构建

![目标识别构建流程图](https://github.com/wty-yy/KataCR/blob/master/asserts/figures/detection_dataset_building.png?raw=true)

构建目标识别数据集是一个纯体力活，但是可以利用 [Segement Anything Model (SAM)](https://github.com/facebookresearch/segment-anything) 简化我们在制作切片时的工作量，从左上角顺时针开始看：

1. 首先我们还是要从原始数据流开始，对其中的待识别目标人工标记（或者可以让已有的识别模型进行辅助标记，然后人工微调），这样就可以得到真实数据流的标记数据，但是数据量非常小，后续将作为模型的验证集。
2. 然后我们将原图与边界框传入到SAM中，进行前景分割，将分割的前景在进行人工筛选（可能还需要大量的PS，处理细节问题），将不同类别的切片进行合并，从而得到切片数据集，

