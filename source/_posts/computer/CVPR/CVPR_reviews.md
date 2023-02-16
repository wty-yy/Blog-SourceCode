---
title: CVPR期末复习
hide: false
math: true
category:
  - 计算机视觉
abbrlink: 23744
date: 2023-02-16 12:13:33
index\_img:
banner\_img:
tags:
---


高斯核，中值滤波，双边滤波，fourier变换，频域和空间域的关系，图像变换和逆变换，插值，Gauss金字塔和Laplace金字塔（4题）

tiny边缘检测，计算图像梯度，NMS，角点检测（平移不变性，旋转不变性），shift描述子（如何描述平移不变性和旋转不变性），UISIKe（3题）

相机标记，数目视觉，对极几何（4题）

运动场和光流场的区别，光流场反应的运动，光流约束，Gauss大运动转化为小运动（1题）



下面为6题.

## 传统分类器

### KNN

中间**空的区域原理**，$K\neq 1$的情况.

<img src="/figures/CVPR_reviews.figure/image-20230216082130478.png" alt="image-20230216082130478" style="zoom:50%;" />

决策边界是两个不同分类区域之间的边界，决策边界可能是有噪声的；它会受到离群点的影响，如何平滑决策边界？使用更多的近邻！

当K＞1时，不同类之间可能会出现间隙，这需要用某种方式消除！

### 贝叶斯分类器

贝叶斯规则（贝叶斯公式）

<img src="/figures/CVPR_reviews.figure/image-20230215162533241.png" alt="image-20230215162533241" style="zoom: 50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215162600296.png" alt="image-20230215162600296" style="zoom:50%;" />

多元高斯分布，确定 $\boldsymbol{x}$ 的概率分布

<img src="/figures/CVPR_reviews.figure/image-20230215162856082.png" alt="image-20230215162856082" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215162921390.png" alt="image-20230215162921390" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215163106362.png" alt="image-20230215163106362" style="zoom:50%;" />

### 线性分类器

打分机制，从三种不同视角查看分类器结果（代数视角，视觉视角，几何视角）

<img src="/figures/CVPR_reviews.figure/image-20230215163632931.png" alt="image-20230215163632931" style="zoom: 33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215163655099.png" alt="image-20230215163655099" style="zoom: 33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215163813887.png" alt="image-20230215163813887" style="zoom: 33%;" />

### 支持向量机

<img src="/figures/CVPR_reviews.figure/image-20230215164017473.png" alt="image-20230215164017473" style="zoom: 33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215164047599.png" alt="image-20230215164047599" style="zoom: 33%;" />

打分函数：Hinge损失

<img src="/figures/CVPR_reviews.figure/image-20230215164109866.png" alt="image-20230215164109866" style="zoom: 33%;" />

多分类的计算结果；交叉熵损失

<img src="/figures/CVPR_reviews.figure/image-20230215164248396.png" alt="image-20230215164248396" style="zoom:33%;" />

交叉熵损失 vs SVM损失

<img src="/figures/CVPR_reviews.figure/image-20230215164404184.png" alt="image-20230215164404184" style="zoom:33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215164426561.png" alt="image-20230215164426561" style="zoom:33%;" />

## 深度神经网络

如何描述非线性可分问题的解决思路（通过非线性变换）

<img src="/figures/CVPR_reviews.figure/image-20230215164735971.png" alt="image-20230215164735971" style="zoom:50%;" />

神经网络作为可学习的特征转换

<img src="/figures/CVPR_reviews.figure/image-20230215165326217.png" alt="image-20230215165326217" style="zoom:33%;" />

实现非线性变化的原理：激活函数（Sigmoid, tanh, ReLU）掌握梯度计算结果（用于梯度下降法）.

<img src="/figures/CVPR_reviews.figure/image-20230215165404247.png" alt="image-20230215165404247" style="zoom:33%;" />

### 梯度下降法（重点）

通过上游梯度计算下游梯度，掌握梯度反向传播原理. 可能考察标量和矢量计算，不会考察矩阵计算. 

<img src="/figures/CVPR_reviews.figure/image-20230215170336025.png" alt="image-20230215170336025" style="zoom:33%;" />

流式传播可以便于求解梯度，计算速度更快.

<img src="/figures/CVPR_reviews.figure/image-20230215171233691.png" alt="image-20230215171233691" style="zoom:33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215171253019.png" alt="image-20230215171253019" style="zoom:33%;" />

其他激活函数的梯度

<img src="/figures/CVPR_reviews.figure/image-20230215171315062.png" alt="image-20230215171315062" style="zoom: 70%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215171942275.png" alt="image-20230215171942275" style="zoom:33%;" />

<img src="/figures/CVPR_reviews.figure/image-20230215172301822.png" alt="image-20230215172301822" style="zoom:33%;" />

### 优化算法

数值梯度，解析梯度. 

<img src="/figures/CVPR_reviews.figure/image-20230216092258290.png" alt="image-20230216092258290" style="zoom:50%;" />

随机梯度下降法(SGD)

<img src="/figures/CVPR_reviews.figure/image-20230216092213394.png" alt="image-20230216092213394" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216092425016.png" alt="image-20230216092425016" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216092724864.png" alt="image-20230216092724864" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216092809655.png" alt="image-20230216092809655" style="zoom:50%;" />

**动量(Momentum)的定义**，掌握Adam算法原理，解释优化的道理.

![image-20230216093028143](/figures/CVPR_reviews.figure/image-20230216093028143.png)

上述定义中 $\alpha$ 称为**学习率（步长）**，两种动量定义：

![image-20230216093419050](/figures/CVPR_reviews.figure/image-20230216093419050.png)

**牛顿动量**：使用<u>速度更新到达新的一点</u>，计算这一点的梯度并与速度混合作为当前的更新方向，$\tilde{x}$ 为Newton动量中的参数位置，主要因为只想去更新 $\tilde{x},f(\tilde{x})$

<img src="/figures/CVPR_reviews.figure/image-20230216094939693.png" alt="image-20230216094939693" style="zoom:50%;" />

**AdaGrad归一化原理**：缩放每个参数反比于其所有梯度历史平方值总和的平方根，也称为“参数学习率”或“自适应学习率”。**特点**：沿着“陡峭”方向的前进受到阻碍； 沿“平坦”方向前进加快 .
$$
w_s^{(i)} \leftarrow w_s^{(i-1)} + ||\nabla w^{(i)}||_2^2,\quad  \boldsymbol{v_i} =  -\alpha\frac{\nabla w^{(i)}}{\sqrt{w_s^{(i)}}}
$$
其中 $w^{(i)}$ 表示第 $i$ 次更新前的梯度值，$w^{(i)}_s$ 表示第 $i$ 次更新前全部梯度的二范数平方.

<img src="/figures/CVPR_reviews.figure/image-20230216095158817.png" alt="image-20230216095158817" style="zoom:50%;" />

**RMSProp**: “Leaky Adagrad”，带有衰减系数的Adagrad，令衰减系数为 $\delta\in (0,1)$.
$$
w_s^{(i)} \leftarrow \delta w_s^{(i-1)} + (1-\delta)||\nabla w^{(i)}||_2^2,\quad  \boldsymbol{v_i} =  -\alpha\frac{\nabla w^{(i)}}{\sqrt{w_s^{(i)}}}
$$
<img src="/figures/CVPR_reviews.figure/image-20230216100342662.png" alt="image-20230216100342662" style="zoom:50%;" />

**自适应矩估计(Adam)**：RMSProp + Momentum，Adam同时兼顾了动量 $\boldsymbol{v}_1$ 和RMSProp（动量修正 $v_2$）的优点.

将 $\boldsymbol{v}_1$ 称为一阶矩（向量），$v_2$ 称为二阶矩（常量）
$$
\left\{\begin{aligned}
&\boldsymbol{v}_1\leftarrow \beta_1\boldsymbol{v}_1 + (1-\beta_1)\nabla w\\
&v_2\leftarrow \beta_2v_2+(1-\beta_2)||\nabla w||_2^2
\end{aligned}\right.
\quad \Rightarrow \quad \boldsymbol{v} = -\alpha\frac{\boldsymbol{v}}{\sqrt{v_2}}
$$
当 $t=0$ 时，算法无法启动 $v_2$ 几乎为 $0$，所以还需进行偏置修正（修正从原点初始化的一阶矩和二阶矩的估计）：
$$
\left\{\begin{aligned}
&\boldsymbol{v}_1'= \frac{\boldsymbol{v}_1}{1-\beta_1^t}\\
&v_2'= \frac{v_2}{1-\beta_2^t}
\end{aligned}\right.
\quad \Rightarrow \quad \boldsymbol{v} = -\alpha\frac{\boldsymbol{v'}}{\sqrt{v_2'}}
$$
<img src="/figures/CVPR_reviews.figure/image-20230216101728613.png" alt="image-20230216101728613" style="zoom:50%;" />

> Adam算法中取beta1 = 0.9, beta2 = 0.999,  learning_rate = 1e-3, 5e-4, 1e-4对于很多模型来说是一个好的起始点!

<img src="/figures/CVPR_reviews.figure/image-20230216102352560.png" alt="image-20230216102352560" style="zoom:50%;" />

- Adam 在很多情况下都是不错的默认选择 
- SGD+Momentum 可以优于Adam，但是需要更多的调整
- 如果你可以进行完整的批量更新，可以尝试使用  L-BFGS (不要忘记禁用所有噪声源)

二阶牛顿法难于计算不考.

## 卷积神经网络 CNN

### 卷积的计算

卷积核加入填充（padding），步伐（stride）后计算输出结果的大小. 

<img src="/figures/CVPR_reviews.figure/image-20230216110159320.png" alt="image-20230216110159320" style="zoom:50%;" />

掌握例子：

<img src="/figures/CVPR_reviews.figure/image-20230216105653924.png" alt="image-20230216105653924" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216105843862.png" alt="image-20230216105843862" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216105949854.png" alt="image-20230216105949854" style="zoom:50%;" />

1x1卷积：堆叠1x1卷积层等价于对每个位置进行 全连接层。

<img src="/figures/CVPR_reviews.figure/image-20230216110110263.png" alt="image-20230216110110263" style="zoom:50%;" />

### 池化的原理

池化层: 另外一种下采样（downsmaple）方式，输出结果的大小：

<img src="/figures/CVPR_reviews.figure/image-20230216110702869.png" alt="image-20230216110702869" style="zoom:50%;" />

### RNN的经典架构

经典架构：[Conv, ReLU, Pool] x N, flatten, [FC, ReLU] x N, FC

[Conv, ReLU, Pool]：称为一个卷积块，由卷积层，非线性函数(ReLU)和池化层组成.

flatten：将卷积的输出图像 $3\times H\times W$ 展平为一维向量.

[FC, ReLU]：全连接层(Full connect)与非线性函数(ReLU)构成的全连接块.

FC：最后用一个全连接层作为输出层.

<img src="/figures/CVPR_reviews.figure/image-20230216111312108.png" alt="image-20230216111312108" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216111444429.png" alt="image-20230216111444429" style="zoom:50%;" />

### 归一化原理

#### 批归一化（Batch Normalization）

<img src="/figures/CVPR_reviews.figure/image-20230216112234516.png" alt="image-20230216112234516" style="zoom:50%;" />

前面一层的输出维度为 $D$，如果是图像 $3\times H\times W$，则可以将 $H\times W$ 展平后视为 $D$ ，$N$ 表示 mini-batch的大小.

<img src="/figures/CVPR_reviews.figure/image-20230216112302840.png" alt="image-20230216112302840" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216112527751.png" alt="image-20230216112527751" style="zoom:50%;" />

估计参数时依赖整个mini-batch的数据，但在测试时不能这样做! 所以在**测试时需利用训练数据的平均值进行代替**.

<img src="/figures/CVPR_reviews.figure/image-20230216112633117.png" alt="image-20230216112633117" style="zoom:50%;" />

<img src="/figures/CVPR_reviews.figure/image-20230216114155617.png" alt="image-20230216114155617" style="zoom:50%;" />

**批归一化优点**：

- 使得网络更加容易训练!
- 允许使用更大的学习率，使网络收敛速度加快；
- 网络对于不同初始化值更加鲁棒；
- 归一化在训练的过程中起到正则化的作用；
- 测试时零开销: 可以与卷积层融合!

**批归一化缺点**：

- 至今为止没有很好的理论上的解释；（仅能解释为减少“内部方差偏移”）
- 训练和测试上的操作行为不一致: 这是日常代码中一种常见的bug来源!

**层归一化（Layer Normalization）**：

<img src="/figures/CVPR_reviews.figure/image-20230216113344574.png" alt="image-20230216113344574" style="zoom:50%;" />

**实例归一化（Instance Normalization）**：

<img src="/figures/CVPR_reviews.figure/image-20230216113416765.png" alt="image-20230216113416765" style="zoom:50%;" />

## CNN 网络结构

神经网络架构：AlexNet，VGG，GoogleNet，ResNet. 

掌握**道理**，每个神经网络解决了什么问题？通过神经网络结构判别神经网络架构. 

### AlexNet

227 x 227 的输入，5 个卷积层，最大池化层，3 个全联接层，ReLU 非线性激活函数.

**特点**：

- 多数存储开销是在位置靠前的卷积层；
- 接近所有参数都在全联接层；
- 大多数浮点运算计算量出现在卷积层上.

### VGG

VGG-16比AlexNet大得多！VGG 设计规则：

- 所有**卷积层为 3x3 大小，stride为1，pad为1**；
- 所有最大池化层为 2x2 大小，stride为2；
- 池化层后，通道数加倍.

<img src="/figures/CVPR_reviews.figure/image-20230216114751376.png" alt="image-20230216114751376" style="zoom: 67%;" />

### GoogLeNet

GoogLeNet为了实现高效性的创新: 减少参数量，存储空间和计算量.

**Stem network**：在开始阶段积极地对输入进行下采样(回想在 VGG-16: 大多数计算集中在初始阶段)

**Inception 模块**：**局部单元由多个分支组成**，局部结构在网络中重复出现多次，使用 1x1 “Bottleneck” 来在卷积操作前减少通道数.

<img src="/figures/CVPR_reviews.figure/image-20230216115216699.png" alt="image-20230216115216699" style="zoom:50%;" />

**Global Average Pooling（全局均值池化层）**：不再在最后使用大型FC层! 改为使用 global average pooling 来进行维度压缩,并使用一个liner层计算分数.

**Auxiliary Classifiers（辅助分类器）**：使用loss没有将网络的靠后位置训练好:<u>网络太大了，梯度无法精准传播</u>，使用“auxiliary classifiers” 在网络的几个中间节点来对图片分类和接收loss. **但是，使用 BatchNorm 就不需要这个技巧了**.

### ResNet 残差网络

**Residual Networks(ResNet)** 是从一个问题上发现的：更深的网络比前层网络表现差！事实上，深层网络表现的是**欠拟合**，因为其在训练集上的效果仍然比浅层网络差. 但是理论上深层神经网络可以通过恒等变换来模拟浅层网络，至少比浅层网络效果要好. 所以考虑加入快捷通道，直接让神经网络自动选择是否直接使用恒等变换（复制上一层的结果）.

**问题**：更深的模型更难优化，而且实际中无法得到恒等变换（identity functions）来模拟浅层网络.

**解决**：改变网络结构使多余的层能够容易的利用 identity functions!

**残差层(Residual Block)**：**加入shortcut通道直接跨过卷积层.** Residual network 是多个residual blocks的堆叠

<img src="/figures/CVPR_reviews.figure/image-20230216115818769.png" alt="image-20230216115818769" style="zoom:50%;" />

**瓶颈模块(Bottleneck Block)**：通过 1x1 的卷积层，减少卷积计算量：

<img src="/figures/CVPR_reviews.figure/image-20230216120216016.png" alt="image-20230216120216016" style="zoom:50%;" />

**其他特点**：

- 类似 GoogleNet 使用同样的 aggressive stem来在residual block；
- 类似 GoogLeNet, 没有大型全联接层: 而是在模型末端使用 global average pooling 和一个linear 层；

**优点**：

- 可以训练非常深的网络；
- 更深的网络表现比浅层网络好 (同预期中一样)；
- 在所有 ILSVRC 和 COCO 2015 比赛获得第一名；
- 现在还是广泛应用!

<img src="/figures/CVPR_reviews.figure/image-20230216120324917.png" alt="image-20230216120324917" style="zoom:50%;" />

**比赛总结**：

- VGG: 最多的存储和计算量
- Inception-v4: Resnet + Inception：效果最好，利用Resnet加上Inceptio模块达到的.
- GoogLeNet: 非常高效!
- AlexNet: 低计算量, 高参数量.
- ResNet: 简单设计, 比较高效，高准确率.

<img src="/figures/CVPR_reviews.figure/image-20230216120809776.png" alt="image-20230216120809776" style="zoom:50%;" />

> 年度 ImageNet在2017后不再举办，改为Kaggle.

**CNN Architectures 总结**：

- 早期工作 (AlexNet -> ZFNet -> VGG) 表明更大的网络效果更好
- GoogLeNet 最开始关注于 efficiency (aggressive stem, 1x1 bottleneck convolutions, global avg pool 代替 FC layers)
- ResNet 告诉我们如何训练超大型网络– 被 GPU 的内存所限制!
- ResNet之后: Efficient networks 更加受重视: 我们应该如何在不增加复杂度的基础上提升准确率?
- 很多tiny networks 聚焦于移动设备: MobileNet, ShuffleNet, etc
- Neural Architecture Search 自动实现网络设计

**网络使用建议**：

- 如果非常在意精度，可以使用 **ResNet-50** 或者 **ResNet-101**；
- 如果想要一个高效网络(比如要求实时，或移动端运行) 可以尝试 **MobileNets** 或者 **ShuffleNets**.

开放性问题：根据题目条件选择网络结构.

## 人脸识别

Adaboost，特征，积分图像，级联处理原理（问答题）

## 语义分割

没啥想考的，理解对网络的要求

## 目标检测

非深度学习：

深度学习：R-CNN，每个版本解决了什么问题（要非常清楚）. 细节：计算IoU，NMS，AP，mAP原理.

## Transformer

比较新，前沿知识，知道原理，问答题借鉴它的思路.
