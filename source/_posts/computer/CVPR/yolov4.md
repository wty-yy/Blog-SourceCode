---
title: YOLOv4 笔记
hide: false
math: true
category:
  - CVPR
tags:
  - YOLO
abbrlink: 40875
date: 2023-11-19 09:37:33
index\_img:
banner\_img:
---

> 参考文献：
> - [YOLOv4: Optimal Speed and Accuracy of Object Detection](https://arxiv.org/pdf/2004.10934.pdf)
> 其中结论得到的最优模型用到的所有优化:
>   - [CIOU, DIOU](https://arxiv.org/pdf/1911.08287.pdf)：基于IOU给出了两个损失，其中CIOU作为边界框位置的损失，DIOU为NMS新的度量标准。
>   - [CSPNet](https://arxiv.org/pdf/1911.11929.pdf)：一种简单的对Backbone中ResBlock层进行优化的trick，可以大幅减少模型参数，同时具有稳定的泛化能力。
>   - [SPP: Spatial Pyramid Pooling](https://arxiv.org/abs/1406.4729)：一种用maxpool进行特征提取的trick，在Neck块开始时使用。
>   - [PANet](https://arxiv.org/pdf/1803.01534.pdf)：一种特征聚合的方法，使用了两次特征金字塔。

## YOLOv4概述

YOLOv4在YOLOv3的基础上，对各种细节进行了优化调整，从而在保持推断速度的前提下（96fps）将COCO-AP提升到41.2%（YOLOv3为28.2%），而且模型大小还减少了20MB。
YOLOv4首先将整个目标识别模型划分为了三个部分：
![模型划分](/figures/CVPR/YOLOv4/model_depart.png)

我们只考虑一阶段识别器（YOLO类型的），二阶段识别器是R-CNN之类的速度很慢。三个部分分别为：
- Backbone（主干）：指对图像的特征进行提取的部分，例如：VGG16, ResNet, DarkNet等，对于一般任务是在Imagenet53上先进行预训练，用于初始化模型权重。
- Neck（特征聚合）：指对提取出的图像特征进行进一步聚合，一般操作是利用不同尺度上的特征信息进行合并（特征金字塔），例如FPN, PANet等，使用多种不同maxpool的SPP方法也是一种特征聚合的trick。
- Head（预测）：在上图中指的是Dense Prediction，但实际并没有用到全连接层，因为我们的模型仍然是FCN（Fully Convolutional Network），这部分是指模型预测所用到的指标：例如YOLO, SSD等。

论文对每个模块进行非常多不同的尝试，做消融实验，最后组合出来才得到最后YOLOv4模型，下面我们只对最终的最优组合细节进行介绍。

## Backbone
### CSPNet
论文[CSPNet: A New Backbone that can Enhance Learning Capability of CNN](https://arxiv.org/pdf/1911.11929.pdf)，就是一种增强CNN泛化能力的同时，见效模型参数的trick。实现非常简单，如下图所示：

![CSPNet to Res(X)Block](/figures/CVPR/YOLOv4/CSPNet_to_ResBlock.png)

假设ResBlock输入的通道数为 $2C$，那么首先我们用一个`1x1Conv`构建一个**旁路(route)**，通道数为 $C$，然后再用一个`1x1Conv`构建一个**主路**通道数为 $C$，主路直接走过ResBlock，再将输出的结果直接和旁路保存的特征进行堆叠，就得到了一个通道数为 $2C$ 的特征。这样的优势在于可以接近减少一般的模型大小，同时增强学习能力。详细架构如下图所示：

![CSPNet to ResBlock detail](/figures/CVPR/YOLOv4/CSPNet_ResBlock_detail.jpg)

{% spoiler "CSPNet ResBlock JAX实现" %}
```python
x = input
route = conv(filters=x.shape[-1]//2, kernel=(1,1))(x)
x = conv(filters=x.shape[-1]//2, kernel=(1,1))(x)
for _ in range(resblock_size):
  x = resblock()(x)
x = conv(filters=x.shape[-1], kernel=(1,1))(x)
x = jnp.concatenate([x, route], axis=-1)
x = conv(filters=x.shape[-1], kernel=(1,1))(x)  # Fusion the feature
```
{% endspoiler %}

### DarkNet53 & Mish
沿用YOLOv3中的DarkNet53，图像的按照2的倍数缩小5个尺度，每个尺度的ResBlock数目分别为 $[1,2,8,8,4]$，可参考[/posts/50137/#darknet-53](YOLOv3-DarkNet53)。

这里使用了一个称为SOTA的激活函数Mish，定义如下
$$
\text{Mish}(x) = x\cdot \tanh(\log(1+e^x)) = x\cdot \tanh(\text{softplus}(x))
$$
和RELU很像，但他能保持梯度不消失时，缺点是由于加入了 $\tanh$ 训练速度会下降，其和激活函数对比的图像如下：
<img src="https://raw.githubusercontent.com/digantamisra98/Mish/master/Observations/Mish3.png" height=500 alt="GitHub - Mish, Compare with other activations">

### 总结

将DarkNet53中的所有ResBlock中加入CSP，再将激活函数改成Mish，称之为CSP-DarkNet53，模型总参数26Millons，实际大小为110.6MB，而DarkNet53的大小为160MB。并且CSP-DarkNet53在Imagenet2012上最终训练结果为top-1=76.55%，top-5=93.16%，均优于DarkNet53的75%和92.6%。[wandb-产看训练图像对比](https://api.wandb.ai/links/wty-yy/jgf9evy6)

## Neck

### PANet

YOLOv4将YOLOv3所使用的特征金字塔（FPN）改进为PANet，结构如下所示：
![PANet](/figures/CVPR/YOLOv4/PANet.png)

上图中(a)就是一次特征金字塔，将提取到的特征进行重新上采样，并对之前相同尺度处的特征进行合并得到，(b)就是对第一次得到的特征金字塔再做一次特征金字塔，这样的好处在于，第二次特征金字塔的同尺度图像对原图像特征保留更完整，以P5和N5为例，P5所提取的图像特征经过了整个Backbone对原始图像的低维特征信息较少，但是N5可以通过绿色的快捷通道可以更快的得到原始图像的低维尺度信息，从而相对较好一些。

当然这些都不靠谱，还是要靠实验结果说话，更复杂的链接方式还有Bi-FPN，可能链接过于复杂，导致速度太慢，所以不建议使用。

### SPP

SPP本质上就是一个对图像的特征按照3个不同的maxpool窗口大小进行特征提取，再将提取出的特征进行堆叠得到的，原论文是为了要将**不同尺度的特征输入保持相同的输出输出**，所以还进行了不同的步长设定。但是在YOLOv4中，其中的SPP就是指：直接对特征做步长为1的不同窗口大小的maxpool操作，在进行堆叠即可。

{% spoiler "CSPNet ResBlock JAX实现" %}
```python
class SPP(nn.Module):  # Spatial Pyramid Pooling
  @nn.compact
  def __call__(self, x):
    x5 = nn.max_pool(x, (5,5), padding="SAME")
    x9 = nn.max_pool(x, (9,9), padding="SAME")
    x13 = nn.max_pool(x, (13,13), padding="SAME")
    x = jnp.concatenate([x, x5, x9, x13], axis=-1)
    return x
```
{% endspoiler %}

### 总结
参考了[pytorch-YOLOv4 model.py](https://github.com/Tianxiaomo/pytorch-YOLOv4/blob/master/models.py)的代码，我将模型架构绘制如下：
![YOLOv4手绘](/figures/CVPR/YOLOv4/YOLOv4_hand.jpg)

## 损失函数

### DIOU, CIOU

DIOU(Distance-IOU)和CIOU(Complete-IOU)分别是加入距离属性的IOU和带有正则项的IOU损失。

#### DIOU

设 $b^{gt}$ 为目标边界框（$gt$ 表示ground truth），$b$ 为我们预测出的边界框，如果我们直接将 $1-\text{IOU}(b^{gt}, b)$ 作为IOU损失对b进行更新，那么当 $b$ 和 $b^{gt}$ 无交的时候，则不会对 $b$ 进行更新，所以非常不好。

DIOU就是为了解决两者无交问题，所以直接引入了一项和边界框中心点相对位置相关的项，假设 $b_c,b_c^{gt}$ 分别表示 $b, b^{gt}$ 的中心点坐标，则：

$$
\text{DIOU}(b,b^{gt}) = 1 - \text{IOU}(b,b^{gt}) + \frac{||b_c-b_c^{gt}||_2}{c^2}
$$

其中 $c$ 表示两个矩阵的最大对角线长度（用一个矩形恰好将两个框同时覆盖时，其对角线长度），可以用下图进行理解：

![DIOU示意图（来自DIOU论文）](/figures/CVPR/YOLOv4/DIOU.png)

DIOU还可以作为NMS的衡量标准，原来的NMS是当两个边界框的IOU值大于某个阈值时，消去低置信度的框；而如果使用DIOU，则直接用 $1-\text{DIOU}$ 替换掉原有的 $\text{IOU}$ 即可。

#### CIOU

CIOU就是在DIOU的基础上，加入了关于边界框长宽比的正则项，以便能加快收敛，令长宽比二范数损失及正则项系数分别为：

$$
v = \frac{4}{\pi^2}\left(\arctan\frac{w^{gt}}{h^{gt}} - \arctan\frac{w}{h}\right)^2,\quad \alpha = \frac{v}{1-\text{IOU}+v} $$

$\dfrac{4}{\pi^2}$ 为归一化系数，保持 $v\in(-1,1)$。正则项系数含义在于，如果两个框IOU接近时，我们更考虑将二者的长宽比弄成一致的，综上，CIOU定义为：

$$
\text{CIOU}(b,b^{gt}) = \text{DIOU}(b,b^{gt}) + \alpha v = \text{DIOU}(b,b^{gt}) + \frac{v^2}{1-\text{IOU}(b,b^{gt})+v}
$$

### YOLOv4损失

YOLOv4的损失其实论文中根本都没有写出，其就是将边界框的损失从二元交叉熵（xy）和二范数（wh），改成了CIOU损失，并且将wh从指数变化转为

$$
w\gets \left(2\cdot \text{sigmoid}(w)\right)^2, \quad h\gets \left(2\cdot \text{sigmoid}(h)\right)^2
$$

损失函数

$$
\begin{aligned}
\mathcal{L} = \sum_{i=1}^W\sum_{j=1}^H\sum_{k}^3&\ \mathcal{1}_{ijk}\lambda_{noobj}\left(-\log\left(1+e^{\hat{c}_{ijk}}\right)\right)\\
&\ \mathcal{1}^{obj}_{ijk}\bigg[\lambda_{coord}\text{CIOU}(b_{ijk},\hat{b}_{ijk}) + \lambda_{obj}(-(1+e^{-\hat{c}_{ijk}}))\\
&\ \qquad+\lambda_{class}(-\log(\text{softmax}(\{p_c\})_{c_{ijk}}))\bigg]
\end{aligned}
$$

最后softmax也不是一定的，如果一个框有多个类别属性，那么softmax可以换成二元交叉熵（其实就只有一个属性的COCO数据集pytorch-YOLOv4也是用的二元交叉熵，不是很理解）。

