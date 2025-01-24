---
title: 模型设计及3D打印笔记
hide: false
math: true
category:
  - Robotics
abbrlink: 64305
date: 2025-01-24 12:04:41
index\_img:
banner\_img:
tags:
---

这里记录下SolidWorks绘制模型与3D打印中出现的各种需要注意的问题。

## 配置介绍
1. SolidWorks版本为2021，[破解版下载链接](https://www.jb51.net/softs/795182.html)
2. 3D打印机为Bambu X1 Carbon，材料为Bambu PLA Basic，使用Bambu官方的热床固体胶棒

## 学习笔记
### SolidWorks
SolidWorks入门教程可参考[Bilibili - 阿奇设计分享 SOLIDWORKS 教学 精品教程](https://www.bilibili.com/video/BV1iw411Z7HZ)

SolidWorks多使用，熟能生巧，遇到难以设计的模型或关联性，可以再Bilibili上搜索相关内容，基本都有很好的解决方案。
### Bambu X1打印流程
1. 将SolidWorkds中的模型另存为step格式
2. 打开Bambu Studio，点击上方“准备”，进行如下配置：
    1. 选择你的打印机
    2. 选择你的打印板
    3. 选择你的耗材
    4. 选择0.20mm Stand配置文件
    5. 点击支撑，开启支撑
    6. 保存配置便于以后直接使用（左侧中间）
    7. 将模型拖拽进去
    8. 选中模型，点击上方旋转按钮，将其旋转到所需最少支撑面的姿态
    9. 自动摆放排版，将模型居中，多个模型不相互冲突
    10. 保存3mf文件（左上角保存按钮，模型+配置），
    ![Bambu打印配置](/figures/robotics/3d_print/bambu_studio_workflows.png)
3. 点击上方“预览”，开始计算切片，该界面可以检查切片打印顺序，`ctrl+g`保存切片文件为`gcode.3mf`（该文件仅包含切片数据+配置）到打印机的sd卡中
    ![切片文件查看及保存](/figures/robotics/3d_print/bambu_studio_slices.png)
4. 在3D打印机中插入对应的耗材（我用的是AMS只需向上推灰色进料口，插入耗材即可），注意如果与文件中耗材型号不同，是无法打印的
5. 在打印板上涂上固体胶，**非常重要**，所有第一层打印的位置都要涂上，保证第一层打印完整
6. 选择模型文件，去掉“延迟摄影”勾选，开始打印
7. 打印过程中，大概8min左右，打印机完成校准、挤出耗材等准备工作，开始打印第一层，我们需要观察第一层是否打印完整，没有任何拉丝、错误覆盖
8. 如果第一层没有问题，那么等着打印完毕即可
9. 打印完成后，取下打印件，用水洗净打印版表面和打印件底层的固体胶
10. 将耗材从进料口中点击退料，拔出来即可


## 注意事项
1. 3D打印的零件会有 $0.1$ mm的**外表面膨胀**，因此在设计装配体时，两个零件之间要对应留出空隙，如果存在 $n$ 个接触面，减小其中一个零件的垂直距离 $0.1n$ mm（以榫卯结构为例，我通常将内侧圆柱形榫的直径减小 $0.2$ mm，高度减少 $0.2$ mm）
2. 设计螺丝孔时，同样要注意打印外表面膨胀问题，因此需要根据真实的螺丝半径稍微修改3D打印中螺丝的口径，来设计更平整的沉头螺丝
<img src=/figures/robotics/3d_print/screw_3d_design.png width=50%/>
> 我自己总结的各种螺丝对应的3D模型设计：https://kdocs.cn/l/cmkN6pJfXCJT

