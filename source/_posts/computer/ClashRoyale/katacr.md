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
2. 然后我们将原图与边界框传入到SAM中，进行前景分割，将分割的前景在进行人工筛选（其中还需要大量的PS，处理细节问题），将不同类别的切片进行合并，从而得到切片数据集（包含 154 个类别）
3. 再通过一个目标识别数据集生成算法，生成用于目标识别模型训练所需的数据集，使用新的数据集训练完新的模型后，用于下一次的辅助标记工作。

## 生成式数据集算法
这算法是一种基于图层等级进行生成的方法，对不同的切片类别设置不同的图层等级，按照图层等级从低到高顺次绘制到背景板上，绘制代码在 [`generation.py`](https://github.com/wty-yy/KataCR/blob/master/katacr/build_dataset/generator.py) 中，其全部配置文件在 [`generation_config.py`](https://github.com/wty-yy/KataCR/blob/master/katacr/build_dataset/generation_config.py) 中。

| 图层等级 | 切片等级 |
| - | - |
| 0 | 地面法术，地面背景部件 |
| 1 | 地面部队，防御塔 |
| 2 | 空中部队，空中法术 |
| 3 | 其余待识别部件，空中背景部件 |

细节如下：
1. 背景选取：从数据集中随机选取一个去除防御塔、部队及文本信息的空竞技场作为背景图片。
2. 背景增强：加入背景板中的非目标识别部件，用于数据增强，例如：部队阵亡时的圣水，场景中随机出现的蝴蝶、花朵等。
3. 防御塔加入：在双方的三个防御塔固定点位上随机生成完好或被摧毁的防御塔，并随机选取生成与之相关联的生命值信息。
4. 部队加入：按照类别出现次数的反比例 $\left\{\frac{1}{n_{c_i}-n_{\min}+1}\right\}_{i=1}^{|C|}$所对应的分布进行类别随机选取，其中 $n_{c_i},(c_i\in C)$ 表示类别 $c_i$ 的切片之前生成的总次数，$n_{\min} = \min\{n_{c_i}\}_{i=1}^{|C|}$；在竞技场中按照动态概率分布随机选择生成点位，并随机选取生成与之相关的等级、生命值、圣水、时钟等信息。

完成绘制单位加入后，可以按照插入顺序得到待绘制单位序列 $U$，但生成的切片可能存在覆盖关系，因此需要引入最大覆盖率阈值 $\alpha$，当被覆盖单位面积超过该单位切片面积的 $\alpha$ 倍时，对被覆盖单位进行去除，对单位完成筛选之后，再按照图层等级的从高到低进行绘制，并将识别类别 $C$ 中的边界框信息进行记录，用于后续识别模型训练。

![生成算法伪代码](/figures/Paper/undergraduate/生成算法伪代码.png)

下图是一些生成图像，生成的单位数量均为 $20$，从左侧为小型切片 $\alpha=0.5$，中间为大型切片 $\alpha=0.5$，右侧为大型切片 $\alpha=0.8$；
<div align="center">
  <img src="/figures/Paper/undergraduate/nu20,small,0.5.jpg" width="32%">
  <img src="/figures/Paper/undergraduate/nu20,big,0.5.jpg" width="32%">
  <img src="/figures/Paper/undergraduate/nu20,big,0.8.jpg" width="32%">
</div>

生成的单位数量均为 $40$，从左侧为小型切片 $\alpha=0.5$，中间为大型切片 $\alpha=0.5$，右侧为大型切片 $\alpha=0.8$。
<div align="center">
  <img src="/figures/Paper/undergraduate/nu40,small,0.5.jpg" width="32%">
  <img src="/figures/Paper/undergraduate/nu40,big,0.5.jpg" width="32%">
  <img src="/figures/Paper/undergraduate/nu40,big,0.8.jpg" width="32%">
</div>

# 图像感知特征提取

在感知特征提取中，将同时用到三种模型（[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), [YOLOv8](https://github.com/ultralytics/ultralytics), ResNet）作为一阶段图像特征提取，分别可以得到当前时刻下三个预处理信息：剩余时间（OCR） 、竞技场中的预测框（YOLO） 、当前手牌及总圣水（图像分类器） 。下面将介绍特征提取器的设计方法，可以将预处理信息进一步转化为决策模型的输入信息，它们分别为环境状态信息提取（State）、执行动作信息提取（Action）和环境奖励信息提取（Reward）。

<div align="center">
<img src="/figures/Paper/undergraduate/introduction.png" width="32%">
</div>

## 状态特征
状态特征包含以下四个信息：
1. 通过的总时长 $time$，直接通过右上角进行OCR识别得到；
2. 竞技场部队信息 $s_t^{img}$，通过YOLOv8模型识别中间部队，并结合下文中的关联性推理方法得到部队的状态信息（包括：类别，位置，从属派别，血条图像）；
3. 手牌信息 $s_t^{card}$，一个四维向量，每一维度表示当前手牌中的卡牌类别（需要注意当一张卡牌被拖出但没有被释放时，对应的卡槽仍然保持非空）；
4. 圣水信息 $elixir$，直接通过识别下面的数字可以得到。

状态特征提取中使用到了下述两个细节，实现方法都是对特征融合模型中加一个记忆buffer即可。

### 关联性推理
<div align="center">
  <img src="/figures/Paper/undergraduate/关联性推理.png" width="40%">
</div>

由于等级信息和血条信息相对部队边界框更容易识别，并且每个部队都**存在一个与之唯一对应的等级和生命值信息**，且部队与等级或生命值信息的相对位置基本不变，所以即使部队识别框出现：消失、类别识别错误、派别识别错误时，利用之前与之关联的等级和生命值信息中进行修正，效果如上图。

当模型在第 1 帧关联了部队 1 与等级、生命值信息的对应关系，通过目标追踪及上下帧信息记忆，即使在第 2, 3 帧未能目标识别模型未能检测到部队 1，通过等级或生命值的关联性推理，模型同样可以推理得到当前单位的真实位置。

### 错误动作先验信息
<div align="center">
  <img src="/figures/Paper/undergraduate/错误动作先验信息.png" width="80%">
</div>

在执行动作之前，状态特征中应不包含任何**直接与该动作相关的先验信息**，否则模仿学习依赖该先验信息直接给出动作预测，而真实交互环境中由于不再出现这类动作的先验信息（例如一个放置该牌的虚影，或者提前的圣水数字变换），所以导致模型无法做出决策，错误状态信息上图所示。

第一个虚影的处理方法比较简单，由于放置牌时才会产生虚影，此时虚影的上方一定有该单位的名称，所以我们可以通过识别名称与部队的类别是否相同来删去该虚影；第二个错误原因在于动作帧的识别必须依赖于YOLO模型对圣水动画的识别，由于识别模型相对有一定的滞后，因此我们需要按照OCR给出的圣水变换时刻，将动作前移到该时刻下。

## 动作特征
动作特征包含以下两个信息：
1. 当前执行动作的二维坐标 $\boldsymbol{x}$；
2. 当前执行动作所使用的卡牌编号 $card$。

这里需要注意上文中 [错误动作先验信息](./#错误动作先验信息) 的YOLO模型动作识别滞后的问题，需要将第 3 帧识别到的动作前移到第 2 帧（圣水数字发生突变）上。

## 奖励特征
奖励函数设计如下：

奖励特征仅包含奖励 $r\in\mathbb{R}$ 一种信息，通过OCR识别可以得到敌我防御塔具体生命值，设 $h_{i}^{\text{bel}}, (i\in\{0,1,2\},\text{bel}\in\{0,1\})$ 为防御塔生命值，当 $i=1,2$ 时表示左右两个副塔生命值，$i=0$ 表示主塔生命值，$\text{bel}=0,1$ 分别表示我方和敌方建筑，$\Delta h_{i}^{\text{bel}}$ 表示前一帧与当前帧生命值的差值，$H_{i}^{\text{bel}}$ 表示对应防御塔的总生命值，分别定义如下四种奖励函数：

1. 防御塔生命值奖励
$$
r_{tower} = \sum_{\text{bel}=0}^1\sum_{i=0}^2(-1)^{\text{bel}+1}\frac{\Delta h_{i}^{\text{bel}}}{H_{i}^{\text{bel}}}
$$

2. 防御塔摧毁奖励 $r_{distory}$：当敌我副塔被摧毁时给予 $(-1)^{\text{bel}+1}$ 奖励，敌我主塔被摧毁时给予前者的 $3$ 倍奖励。

3. 主塔激活奖励 $r_{activate}$：当副塔均存活的条件下，主塔第一次失去生命值时，给予 $(-1)^{\text{bel}}~0.1$ 奖励。

4. 圣水溢出惩罚 $r_{elixir}$：当总圣水持续保持溢出状态时，每间隔 $1$ 秒产生一次 $0.05$ 的惩罚。

综合上述奖励，得到总奖励：
$$
r = r_{tower} + r_{destory} + r_{activate} + r_{elixir}
$$

# 决策模型
## 状态空间
模型的状态输入由 2 部分构成，分别为
1. $S^{img}\in\mathbb{R}^{18\times 32\times 15}$ 为单位的网格状特征输入，对于第 $i$ 行 $j$ 列的特征 $\boldsymbol{z}_{ij}:=(S^{img})_{ij}\in\mathbb{R}^{15}$ 表示处于该位置的单位具有如下 $4$ 种特征：$(\boldsymbol{z}_{ij})_{1:8}$ 为类别编码，$(\boldsymbol{z}_{ij})_9$ 为从属派别编码，$(\boldsymbol{z}_{ij})_{10:12}$ 为生命值图像编码，$(\boldsymbol{z}_{ij})_{13:15}$ 为其余条状图像编码；
2. $\boldsymbol{s}^{card}\in\mathbb{R}^6$ 表示当前状态下的两个全局特征：$(\boldsymbol{s}^{card})_{1:5}$ 为当前手牌信息，$(\boldsymbol{s}^{card})_6$ 为当前总圣水量。

模型的动作输入由2个部分构成，分别为
1. $\boldsymbol{a}^{pos}\in\mathbb{R}^2$ 表示动作执行的部署坐标；
2. $a^{select}\in\mathbb{R}$ 表示动作执行的手牌编号。

## 预测目标设计与重采样
由于离线数据集中的动作执行极为离散，总帧数中仅有 $4\%$ 为执行动作帧，其余帧均不执行动作，如果直接逐帧预测动作会产生非常严重的长尾问题，导致模型最终基本不执行动作，因此需要将预测目标从离散转化为连续，解决方法是引入延迟动作预测：对于第 $i$ 帧，需找到其后（包含自身）最近的动作帧 $j$，令最大间隔帧数阈值为 $T_{delay}$，则每个非动作帧的预测的延迟动作为 $a^{delay}_{i} = \min\{j-i, T_{delay}\}$。

对离线数据集进行采样时，为避免长尾问题导致模型偏移，本文还设置了重采样频次，设数据集总帧数为 $N$，动作帧数为 $N_{action}$，则动作帧占比为 $r_a:=N_{action} / N$，对于第 $i$ 个动作帧位于数据集中的第 $t_i$ 帧，则 $j\in\{t_{i},\cdots,t_{i+1}-1\}$ 帧作对应的重采样频次为
$$
s_j = \max\left\{\frac{1}{1-r_a}, \frac{1}{r_a(j-t_i+1)}\right\},\quad (t_i\leqslant j\leqslant t_{i+1})
$$
则训练轨迹中结束帧的采样分布为 $\left\{\frac{s_j}{\sum_{j=1}^{N}s_j}\right\}_{j=1}^N$，下图中展示了离线数据集一段轨迹所对应的重采样频次与动作预测值。

![重采样](/figures/Paper/undergraduate/重采样.png)

