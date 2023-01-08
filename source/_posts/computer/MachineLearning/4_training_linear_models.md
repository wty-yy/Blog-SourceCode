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

### 2.多项式回归

> 注意：这不是多项式插值.

首先考虑特征的属性值只有一个的情况，在线性插值中，我们的模型预测值为 $\hat{y} = \theta_0 + \theta_1x$，而在 $d$ 次的多项式回归中，预测模型转化为

$$
\hat{y}= \theta_0+\theta_1x+\theta_2x^2+\cdots\theta_dx^d
$$

相当于在原有属性 $x$ 的基础上扩充进新的属性值 $x^2,\, x^3,\, \cdots,\, x^d$.

当属性值个数为 $n=2$ 的时候，$d=3$ 次多项式回归，需要**考虑不同属性之间的组合**，所以全部属性值为 $x_1^3,\, x_1^2x_2,\, x_1x_2^2,\, x_2^3,\ x_1^2,\, x_1x_2,\, x_2^2,\, x_1,\, x_2,\, 1$，总共 $10 = \binom{2+3}{2}$ 个.

类似地，当 $n=3,\ d=2$ 时，全部属性值为 $x_1^2, x_1x_2, x_1x_3, x_2^2, x_2x_3, x_3^2, x_1, x_2, x_3, 1$，总共 $10 = \binom{3+2}{3}$ 个.

可以证明，当特征属性个数为 $n$，最高幂次为 $d$ 的多项式回归中，最终扩充得到的属性值有 $\binom{n+d}{n}=\frac{(n+d)!}{n!d!}$ 个.

{% spoiler "求解多项式扩充得到的属性值个数" %}

首先考虑 $n$ 个属性值时，齐次为 $m$ 次的组合总共有多少，我们可以将问题转化为小球染色问题：总共有 $m$ 个球，染上 $n$ 中颜色，可以有颜色一次都不用.

该问题，就是可以有空位的隔板法，总共有 $n-1$ 个隔板，隔出来 $n$ 个空间，每个空间中的小球个数表示顺次表示每个属性值的幂次，由于可以有空位，所以先补上 $n$ 个小球，然后转化为没有空位的隔板法，所以总共有 $\binom{m+n-1}{n-1}$ 中组合.

然后对于 $d$ 次多项式回归，包含从 $0\sim d$ 次的全部齐次项，所以总共有

$$
\sum_{m=0}^d\binom{m+n-1}{n-1} = \binom{d+n}{n} = \frac{(n+d)!}{n!d!}
$$

上述第一个等号使用了 [曲棍球恒等式(Hockey Stick Identity)](https://codeforces.com/blog/entry/104172)，证明思路：每次固定选取**一个元素**，然后在选取集合中选取剩余的元素，并依次递增选取集合.

{% endspoiler %}

### 正则化线性模型

在原有线性模型基础上加入不同的正则化项即可得到不同的正则化模型，记 $\boldsymbol{w} = (\theta_1,\theta_2,\cdots,\theta_n)^T$（不包含偏置项）， 以下三种正则化模型分别对应 $\boldsymbol{w}$ 的 $l_2$范数，$l_1$ 范数和他们的线性组合.

| 正则化算法    | 正则化项                                                     |
| ------------- | ------------------------------------------------------------ |
| 岭回归(Ridge) | $l_2$ 范数，$\frac{1}{2}\sum_{i=1}^n\theta_i^2=\frac{1}{2}\|\boldsymbol{w}\|_2^2$ |
| Lasso回归     | $l_1$ 范数，$\sum_{i=1}^n\|\theta_i\| = \|\boldsymbol{w}\|_1$ |
| 弹性网络      | $l_1,l_2$ 范数的线性组合，$r\|\boldsymbol{w}\|_1+\frac{1-r}{2}\|\boldsymbol{w}\|_2^2$ |

在正则化项前的系数 $\alpha$ 称为正则化系数，用来控制模型正则化程度.

> 由于正则化线性模型对特征的缩放敏感，规模较大的特征值可能导致对应的参数值较大，所以正则化项同样较大，对特征缩放敏感. 故正则化模型大多都需要特征缩放.

#### 岭回归

岭回归的成本函数为

$$
\mathcal{J}(\boldsymbol{\theta}) = MSE(\boldsymbol{\theta}) + \alpha\frac{1}{2}\sum_{i=1}^n\theta_i^2 = MSE(\boldsymbol{\theta}) + \frac{\alpha}{2}||\boldsymbol{w}||_2^2
$$

求解岭回归的梯度值，从而可以使用**梯度下降法**进行求解：

$$
\nabla_{\boldsymbol{\theta}}\mathcal{J}(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}}MSE(\boldsymbol{\theta}) + \alpha \boldsymbol{w}
$$

同样可以求解岭回归的**闭解**：

$$
\hat{\boldsymbol{\theta}} = (\boldsymbol{X}^T\boldsymbol{X}+\alpha\boldsymbol{A})^{-1}\boldsymbol{X}^T\boldsymbol{y}\tag{2.1}
$$

其中 $\boldsymbol{A} = \left[\begin{matrix}
0&0&\cdots&0\\
0&1&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&1
\end{matrix}\right]$ 为左上角为 $0$ 的 $(n+1)\times (n+1)$ 单位阵.

#### Lasso回归

Lasso回归的成本函数为
$$
\mathcal{J}(\boldsymbol{\theta}) = MSE(\boldsymbol{\theta}) + \alpha\sum_{i=1}^n|\theta_i| = MSE(\boldsymbol{\theta}) + \alpha ||\boldsymbol{w}||_1
$$

> Lasso回归与岭回归的区别：由于 $l_1$ 范数对较小的的抑制比 $l_2$ 范数更强，所以Lasso回归更倾向于完全消除掉最不重要的特征的权重（也就是将它们置为0）.

由于绝对值函数 $|w|$ 的导数在 $0$ 处并不存在，但是可以用广义导数的来定义，在广义函数意义下有 $|x|' = \text{sign}(x)$，其中 $\text{sign}(x) = \begin{cases} -1,&\quad x < 0,\\ 0,&\quad x = 0,\\ 1,&\quad x > 0.\end{cases}$

{% spoiler "|x| 的广义微分求解" %}
设 $f(x) = |x| = \begin{cases}-x,&\quad x < 0,\\ x,&\quad x > 0.\end{cases}$，对任意的试验函数 $\varphi\in \mathcal{D}(\R)$，有

$$
\begin{aligned}
\langle f',\varphi\rangle =&\ -\langle f,\varphi'\rangle = -\int_{\R}f\varphi'\,\textrm{d} x = -\int_0^\infty x\varphi'\,\textrm{d}x+\int_{-\infty}^0 x\varphi'\,\textrm{d}x\\
=&\ \int_0^\infty\varphi\,\textrm{d}x - \int_{-\infty}^0\varphi\,\textrm{d}x = \langle H(x)-H(-x),\varphi\rangle = \langle \text{sign}(x),\varphi\rangle
\end{aligned}
$$

所以在广义函数意义下，有 $|x|' = \text{sign}(x)$.
{% endspoiler %}

所以Lasso回归的梯度为：

$$
\nabla_{\boldsymbol{\theta}}\mathcal{J}(\boldsymbol{\theta}) = \nabla_{\boldsymbol{\theta}}MSE(\boldsymbol{\theta}) + \alpha\left[\begin{matrix}0\\\text{sign}(\theta_1)\\\text{sign}(\theta_2)\\\vdots\\\text{sign}(\theta_n)\\\end{matrix}\right]
$$

由于 $\text{sign}$ 的逆函数无法求得，所以Lasso没有的闭解式.

> 注意：由于Lasso回归的梯度中存在 $\sign$ 函数，导致梯度的范数大小总是较大，所以可能导致在最优解附近反弹，因此需要逐渐降低学习率 $\eta$，使得算法收敛.

#### 弹性网络

弹性网络的成本函数为

$$
\mathcal{J}(\boldsymbol{\theta}) = MSE(\boldsymbol{\theta}) + r\alpha||\boldsymbol{\theta}||_1 + \frac{1-r}{2}\alpha||\boldsymbol{\theta}||_2^2
$$

其中 $r$ 称为混合比.
- 当 $r=0$ 时，弹性网络等价于岭回归.
- 当 $r=1$ 时，弹性网络等价于Lasso回归.

#### 总结

正则化有总比没有强，避免使用纯线性回归. 岭回归作为默认选择，当实际用到的特征数目较少，可以倾向于Lasso回归或者弹性网络，因为它们会将无用的特征权重降为 $0$.

一般来说，弹性网络优于Lasso回归，因为当特征数量超过训练集大小，或者几个特征强相关时（梯度范数一直较大），Lasso回归可能非常不稳定（发散）.

### 3.Logistic回归

Logistic回归是在线性回归模型的基础上，加入了Logistic函数，从而将模型的输出值转化为概率分布，从而用于解决**二分类问题**的一种模型. 我们将标签为 $1$ 的样本称为正例，标签为 $0$ 的样本称为负例.

> 下文中的 $\boldsymbol{x}$ 都是增加偏置项后的特征向量.

记logistic函数为 $\sigma(\cdot)$，也称为sigmoid（S型函数），定义式如下
$$
logistic(t) = \sigma(t) = \frac{1}{1+e^{-t}}
$$
> logistic函数正好与下文中的softmax函数等价（将预测值从一维转为二维，并将第二个分的数预测值置为 $0$），所以称softmax回归是logistic回归在多维分类下的推广.

记线性模型的输出为得分 $t$，则对正例的估计概率 $P(y=1|\boldsymbol{x},\boldsymbol{\theta})$ 为
$$
\hat{p} = \sigma(t) = \sigma(\boldsymbol{\theta}^T\boldsymbol{x})
$$
模型预测值为
$$
\hat{y} = \begin{cases}0,&\quad \hat{p} < 0.5\text{ 或 }t < 0,\\ 1,&\quad \hat{p} \geqslant 0.5\text{ 或 } t \geqslant 0.\end{cases}
$$

> 一般将模型输出的分数 $t$ 记为logit原因：由于 $\sigma(t) = \hat{p}$，而 $\sigma$ 的反函数正好是**对数几率**(log odds)，即（可以通过代入验证下式成立）
> $$\sigma^{-1}(p) = logistic^{-1}(p) = logit(p) = \log\left(\frac{p}{1-p}\right) = t$$
> **对数几率logit**：正类别的估计概率与负类别的估计概率之比的对数.

单个训练样本的logistic回归成本函数定义如下（负估计概率的对数似然）

$$
\mathcal{J}(\boldsymbol{\theta}) = \begin{cases}-\log(\hat{p}),&\quad y=1,\\ -\log(1-\hat{p}),&\quad y=0.\end{cases}
$$

logistic回归的成本函数为

$$
\mathcal{J}(\boldsymbol{\theta}) = -\frac{1}{m}\sum_{i=1}^m\left[y^{(i)}\log(\hat{p}^{(i)})+(1-y^{(i)})\log(1-\hat{p}^{(i)})\right]
$$

上述成本函数是通过将后验概率 $\hat{y}$ 作为 $y=1$ 的估计，使用对数极大似然法求解得到的，证明可见下文.

---

由于我们用 $\hat{p}$ 作为后验概率估计，即 $P(y=1|\boldsymbol{x},\boldsymbol{\theta}) = \hat{p}$，则 $P(y=1|\boldsymbol{x},\boldsymbol{\theta}) = 1-\hat{p}$，于是大小为 $m$ 的训练集对应的对数似然为

$$
l(\boldsymbol{\theta}) = \sum_{i=1}^m\log P(y^{(i)}|\boldsymbol{x^{(i)}},\boldsymbol{\theta})\tag{3.1}
$$

下面我们以一个样本为例，分析对数似然函数，由于 $y\in\{0,1\}$，则

$$
P(y|\boldsymbol{x},\boldsymbol{\theta}) = yP(y=1|\boldsymbol{x},\boldsymbol{\theta}) + (1-y)P(y=0|\boldsymbol{x},\boldsymbol{\theta}) = y\hat{p} + (1-y)(1-\hat{p})
$$

代入表达式 $y = \frac{e^{t}}{1+e^{t}}$ 可得 $P(y|\boldsymbol{x},\boldsymbol{\theta}) = \frac{y\cdot e^t + (1-y)}{1+e^t}$，于是对数似然为

$$
\begin{aligned}\tag{3.2}
\log P(y|\boldsymbol{x},\boldsymbol{\theta}) =&\ \log(y\cdot e^t + (1-y)) - \log(1+e^t)\\
\xlongequal{y\in\{0,1\}}&\ \textcolor{red}{yt - \log(1+e^t)}\\
=&\ y\log \hat{p} - y\log (1-\hat{p}) + \log(1-\hat{p})\\
=&\ \textcolor{green}{y\log\hat{p} + (1-y)\log (1-\hat{p})}
\end{aligned}
$$

代回到 $(3.1)$ 式，由于需要转化为极小化问题，在前面加上负号，并对每个样本进行平均后，我们就得到了logistic回归的成本函数.

> 在 $(3.2)$ 式中，红色标记出来的式子便于进一步求解对 $\boldsymbol{\theta}$ 的导数，绿色式子则更容易记忆.

---

我们将使用梯度下降法对logistic成本函数进行优化，并说明该问题为凸优化问题，将 $t = \boldsymbol{\theta}^T\boldsymbol{x}$ 代入到 $(3.2)$ 式中红色式子中，可得

$$
\begin{aligned}
\frac{\partial}{\partial \boldsymbol{\theta}}P(y|\boldsymbol{x},\boldsymbol{\theta}) =&\ \frac{\partial}{\partial \theta}\left[y\boldsymbol{\theta}^T\boldsymbol{x}-\log(1+e^{\boldsymbol{\theta}^T\boldsymbol{x}})\right]\\
=&\ y\boldsymbol{x} - \frac{e^{\boldsymbol{\theta}^T\boldsymbol{x}}}{1+e^{\boldsymbol{\theta}^T\boldsymbol{x}}}\boldsymbol{x}\\
=&\ (y-\hat{p})\boldsymbol{x}
\end{aligned}
$$

所以logistic成本函数对 $\boldsymbol{\theta}$ 的梯度为

$$
\frac{\partial \mathcal{J}(\boldsymbol{\theta})}{\partial \boldsymbol{\theta}} = \frac{1}{m}\sum_{i=1}^m(\hat{p}^{(i)}-y^{(i)})\boldsymbol{x^{(i)}}
$$

> 可以发现，logistic成本函数对 $\boldsymbol{\theta}$ 的梯度与线性回归中MSE对 $\boldsymbol{\theta}$ 的梯度 $(1.2)$ 式基本相同.

---

下面我们通过证明 $\mathcal{J}(\boldsymbol{\theta})$ 的二阶偏导数非负，以证明logistic回归问题是凸优化问题，即成本函数对参数 $\boldsymbol{\theta}$ 是凸函数：

$$
\begin{aligned}
\frac{\partial^2}{\partial\boldsymbol{\theta}\partial\boldsymbol{\theta}^T}\log P(y|\boldsymbol{x},\boldsymbol{\theta}) =&\ -\frac{\partial}{\partial \theta^T}\left[y\boldsymbol{x}-\frac{\boldsymbol{x}}{1+e^{-\boldsymbol{\theta}^T\boldsymbol{x}}}\right]\\
=&\ \boldsymbol{x}\boldsymbol{x}^T\frac{e^{-\boldsymbol{\theta}^T\boldsymbol{x}}}{(1+e^{-\boldsymbol{\theta}^T\boldsymbol{x}})^2}\\
=&\ \boldsymbol{x}\boldsymbol{x}^T\hat{p}(1-\hat{p})\geqslant 0
\end{aligned}
$$

### 4.Softmax回归

我们对logistic回归进行推广到多维分类问题上，设总共有 $K$ 个类别.

在多维分类问题中，如果使用数字对样本标签进行编号，例如 $0,1,2,...,K-1$，则模型会认为标签数值靠近的样本具有类似的性质，而这往往并不正确（需要考虑到特征之间的关系），所以我们往往使用one-hot向量的方法对多类别标签进行编号.

**one-hot编码**，具体来说，若类别属于 $k$（从 $0$ 开始编号），则对应的one-hot向量为

$$
\boldsymbol{y} = (\underbrace{0,\cdots,0}_{k\text{个}},1,\underbrace{0,\cdots, 0}_{K-k-1\text{个}})^T
$$

> 下文中的 $\boldsymbol{x}$ 仍然是加上偏置项后的特征向量.

还是利用线性模型作为分数预测，只不过这需要预测 $k$ 个分数，所以参数向量总共会有 $k$ 个，可以表示为参数矩阵的形式 $\Theta = (\boldsymbol{\theta}^{(1)},\boldsymbol{\theta}^{(2)},\cdots,\boldsymbol{\theta}^{(K)})^T\in \R^{K\times (n+1)}$，则第 $k$ 类预测的分数为

$$
t_k(\boldsymbol{x}) = \boldsymbol{\theta}^{(k)}\boldsymbol{x} = [\Theta\boldsymbol{x}]_k
$$

> $[\Theta\boldsymbol{x}]_k$ 表示先计算出 $\Theta\boldsymbol{x}$ 的结果后，取第 $k$ 维分量.

求出每一类的得分之后，就可以通过softmax函数计算属于第 $k$ 类的概率 $\hat{p}_k$

## 代码实现
