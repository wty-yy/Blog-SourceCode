---
title: 《机器学习实战》第四章 训练线性模型
hide: false
math: true
abbrlink: 24285
date: 2023-01-07 15:47:56
index\_img:
banner\_img:
category:
tags:
---

# 机器学习中的线性模型

## 模型原理

### 基本定义

> 我们默认向量均为列向量，用**小写**字符表示向量，**大写**字符表示矩阵.

假设训练集中总共有 $m$ 个样本，第 $i$ 个样本对应的特征和标签记为 $(\boldsymbol{x}^{(i)}, y^{(i)})$，不指定具体样本，可简记为 $(\boldsymbol{x}, y)$，对于每个样本的特征和标签有以下相关定义：

- 在不同公式中 $\boldsymbol{x}$ 的维数稍有不同，假设每个特征具有 $n$ 个属性值，每个属性值分别为 $x_1,x_2,\cdots,x_n$：
    1. $\boldsymbol{x}\in \R^{n}$，标准的特征向量，$\boldsymbol{x} = (x_1,x_2,\cdots,x_n)^T$.
    2. $\boldsymbol{x}\in \R^{n+1}$，增加偏置项的特征向量，$\boldsymbol{x} = (1,x_1,\cdots, x_n)^T$，为了简化公式所用.
    上述中两种记法会在公式下方进行说明，若不加说明，则默认使用第一种记法.
- 在不同问题中标签的性质有所不同：
    1. 回归问题中 $y\in \R$；
    2. 二分类问题中 $y\in \{0, 1\}$；
    3. 多分类问题中 $\boldsymbol{y}\in \{0, 1\}^K$，其中 $K$ 表示分类类别的总数目，$\boldsymbol{y}$ 是对应类别的one-hot向量.

> one-hot向量：以$K=5$为例，类别为 $3$，则该类别对应的one-hot向量为 $[0\ 0\ 0\ 1\ 0]^T$（类别从 $0$ 开始编号）.

以下符号名称具有特别的含义：

- $\hat{y}$ 表示模型预测的结果.
- $\theta$ 表示模型中包含的参数.
- $\mathcal{L}(y;\boldsymbol{x},\theta)$ 表示损失函数，简写为 $\mathcal{L}(\theta)$，书上记为 $c(\theta)$.
- $\mathcal{J}(y;\boldsymbol{x}, \theta)$ 表示成本函数，也称风险函数，简记为 $\mathcal{J}(\theta)$.

### 1.线性回归

标签 $\boldsymbol{y}\in \R$ 为数值常量，令参数向量 $\boldsymbol{\theta} = (\theta_0,\theta_1,\cdots,\theta_n)^T$，则线性模型预测值为

$$
\hat{y} = \theta_0+\theta_1x_1+\theta_2x_2+\cdots+\theta_nx_n = \boldsymbol{\theta}^T\boldsymbol{x}
$$

此处的 $\boldsymbol{x}$ 为增加偏置项的特征向量.

#### MSE损失函数

线性回归中常用均方误差(Mean square error, MSE)作为损失函数，MSE与其对应的成本函数定义如下：

$$
\mathcal{L}(\boldsymbol{\theta}) = (\boldsymbol{\theta}^T\boldsymbol{x} - y)^2,\qquad \mathcal{J}(\boldsymbol{\theta}) = MSE(\boldsymbol{\theta})= \frac{1}{m}\sum_{i=1}^m(\boldsymbol{\theta}^T\boldsymbol{x} - y)^2
$$

#### 通过标准方程求闭解

我们将全部的特征和标签分别表示为特征矩阵和标签向量的形式：

$$
\boldsymbol{X} = \left[\begin{matrix}
1&x^{(1)}_1&x^{(1)}_2&\cdots&x^{(1)}_n\\
1&x^{(2)}_1&x^{(2)}_2&\cdots&x^{(2)}_n\\
\vdots&\ddots&\vdots&\vdots\\
1&x^{(m)}_1&x^{(m)}_2&\cdots&x^{(m)}_n\\
\end{matrix}\right],\qquad \boldsymbol{y} = \left[\begin{matrix}
y^{(1)}\\
y^{(2)}\\
\vdots\\
y^{(m)}
\end{matrix}\right]
$$

于是MSE成本函数又可以表示为以下形式：

$$
MSE(\theta) = \frac{1}{m}(\boldsymbol{X}\boldsymbol{\theta}-\boldsymbol{y})^{T}(\boldsymbol{X}\boldsymbol{\theta}-\boldsymbol{y})
$$

对 $\boldsymbol{\theta}$ 求导可以得到：

$$
\frac{\partial MSE(\boldsymbol{\theta})}{\partial \boldsymbol{\theta}} = \frac{2}{m}\boldsymbol{X}^T(\boldsymbol{X}\boldsymbol{\theta}-\boldsymbol{y})
$$

令导数等于 $\boldsymbol{0}$ 可得

$$
\hat{\boldsymbol{\theta}} = (\boldsymbol{X}^T\boldsymbol{X})^{-1}\boldsymbol{X}^T\boldsymbol{y}\tag{1.1}
$$

由于 $\frac{\partial MSE(\boldsymbol{\theta})}{\partial \boldsymbol{\theta}\partial \boldsymbol{\theta}^T} = \boldsymbol{X}\boldsymbol{X}^T$ 矩阵范数恒 $\geqslant 0$（这里的矩阵范数可以是任意一种），于是 $\MSE(\boldsymbol{\theta})$ 是关于 $\boldsymbol{\theta}$ 的凸函数，所以 $(1.1)$ 式得到的 $\hat{\boldsymbol{\theta}}$ 就是使成本函数最小的 $\boldsymbol{\theta}$ 值.

注意：$\boldsymbol{X}^T\boldsymbol{X}$ 不一定满秩，所以可以不存在逆矩阵，但是可以通过SVD分解得到**伪逆**（Moore-Penrose逆矩阵）代替 $(\boldsymbol{X}^T\boldsymbol{X})^{-1}$.

> 求解逆矩阵的时间复杂度一般为 $\mathcal{O}(n^{2.4})$ 到 $\mathcal{O}(n^3)$，而Scikit-Learn中的SVD分解复杂度约为 $\mathcal{O}(n^2)$. 不适合用于处理**特征数目**较大的情形.

#### 梯度下降

成本函数对 $\boldsymbol{\theta}$ 的每一维的偏导数为：

$$
\frac{\partial MSE(\boldsymbol{\theta})}{\partial \theta_j} = \frac{2}{m}\sum_{i=1}^m(\hat{y}^{(i)}-y^{(i)})x_{j}^{(i)}\tag{1.2}
$$

其中 $\hat{y}^{(i)} = \boldsymbol{\theta}^T\boldsymbol{x}^{(i)}$. 记为梯度向量的形式可以如下表示：

$$
\nabla_{\boldsymbol{\theta}}MSE(\boldsymbol{\theta}) = \frac{2}{m}\boldsymbol{X}^T(\boldsymbol{X}\boldsymbol{\theta}-\boldsymbol{y})
$$

如果我们以 $\nabla_{\boldsymbol{\theta}}MSE(\boldsymbol{\theta})$ 作为每次的下降方向，设学习率为 $\eta$，则参数 $\boldsymbol{\theta}$ 的更新方法为如下形式：

$$
\boldsymbol{\theta}^{(\text{下一步})} = \boldsymbol{\theta} - \eta\nabla_{\boldsymbol{\theta}}MSE(\boldsymbol{\theta})
$$

梯度下降法分为三种，批量梯度下降，随机梯度下降，小批量梯度下降，三者的区别仅在每次计算梯度使用的训练集大小上：

- 批量梯度下降(BGD)：每次以整个训练集计算一次梯度，对参数进行更新.
- 随机梯度下降(SGD)：每次从训练集中随机选取一个样本计算梯度，对参数进行更新.
- 小批量梯度下降(Mini-BGD)：设定一个 `batch_size` 大小，以 `batch_size` 大小对以打乱的训练集划分为多个 `batch`，每次取一个 `batch` 中的样本计算一次梯度，对参数进行更新.（好处：可以利用GPU并行运算加快更新速度）

> 注意：使用梯度下降法必须对样本特征的属性值大小比例近似，为了避免数值较大的属性值产生“狭长的山谷”，从而减缓训练速度. 所以需要进行**归一化**或者**标准化**处理（特征缩放）.

#### 总结

| 算法     | $m$ 很大 | $n$ 很大 | 并行计算 | 超参数        | 要求缩放 | Scikit-Learn API   |
| -------- | -------- | -------- | -------- | ------------- | -------- | ------------------ |
| 标准方程 | 快       | 慢       | 否       | 0             | 否       | N/A                |
| SVD      | 快       | 慢       | 否       | 0             | 否       | `LinearRegression` |
| BGD      | 慢       | 快       | 否       | 2             | 是       | `SGDRegressor`     |
| SGD      | 快       | 快       | 是       | $\geqslant 2$ | 是       | `SGDRegressor`     |
| Mini-BGD | 快       | 快       | 是       | $\geqslant 2$ | 是       | `SGDRegressor`     |



## 代码实现
