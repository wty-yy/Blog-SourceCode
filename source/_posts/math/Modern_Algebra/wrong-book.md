---
title: 近世代数 习题&思考 群作用 轨道稳定子定理
hide: false
math: true
abbrlink: 25019
date: 2021-11-15 22:03:14
index_img:
banner_img:
category:
 - Math
 - 近世代数
tags:
 - 错题
---

## 群在集合上的作用，轨道-稳定子定理

需要掌握的：

1. 求群 $G$ 的**中心**， **自同构群**，**共轭类**。

### 求中心

根据中心的定义求解：

$$
\begin{aligned}
Z(G) =&\ \{x\in G: \forall y\in G, xy = yx\}（与所有元素都可交换）\\
= &\ \{x\in G: \forall y\in G, xyx^{-1} = y\}\\
\iff& 在共轭作用下 G 的不动点集 G_0。
\end{aligned}
$$

#### 例1（求Sn的中心）

> 求 $S_n$ 的中心，其中 $n\geqslant 3$。

**解：** $\forall \sigma\in S_n,\ \sigma\neq (1)$，将 $\sigma$ 分解为不相交的轮换之积的形式：

$$
\sigma = (a_1a_2\cdots a_{l_1})(b_1b_2\cdots b_{l_2})\cdots(p_1p_2\cdots p_{l_k})
$$

其中 $l_1 \geqslant l_2\geqslant \cdots\geqslant l_k$，且 $l_1+l_2+\cdots +l_k = n$，将有序数组 $(l_1,l_2,\cdots,l_k)$ 称为 $n$ 的**分拆**，也是 $\sigma$ 的**型**。

分两种情况：

1. 如果 $l_1\geqslant 3$，令 $\tau = (a_1a_2)$，则

$$
\tau\sigma\tau^{-1} = (a_1a_3\cdots a_{l_1}a_2)(b_1b_2\cdots b_{l_2})\cdots(p_1p_2\cdots p_{l_k})\neq \sigma
$$

2. 如果 $l_1 = 2$，则 $\sigma = (a_1a_2)$，令 $\tau = (a_1b_1)$，则

$$
\tau\sigma\tau^{-1} = (b_1a_2)\neq \sigma
$$

综上，$\sigma\equiv (1)$，所以 $Z(S_n) = \{(1)\}$。

#### 例2（求Dn的中心）

> 求 $D_{2m-1},D_{2m}$ 的中心，其中 $m\geqslant 2$。

**解：** 由于 $D_n = \{\sigma, \tau: \sigma^n = \tau^2 = \text{Id}\text{ 且 } \tau\sigma\tau = \sigma^{-1}\}\quad (n\geqslant 3)$，则

$$
\begin{aligned}
&\tau\sigma^{m}\tau = \sigma^{-m}\\
\Rightarrow\  &\tau\sigma^{m} = \sigma^{n-m}\tau
\end{aligned}
$$

这告诉我们 $\sigma, \tau$ 之间的交换所需满足的关系。所以，对于任意一个对称变换 $\tau\in D_n$，有

$$
\sigma\tau\sigma^{-1} = \sigma\sigma^{n+1}\tau = \sigma^{2}\tau\neq \tau
$$

则对称变化 $\tau\notin Z(S_n)$，$\sigma^m\in D_n$，$m\in[1,n]$，只需要讨论共轭对象为 $\tau$ 的情况

$$
\tau\sigma^m\tau^{-1} = \sigma^{-m} = \sigma^{m}
$$

则 $-m\equiv m\pmod n\Rightarrow 2m\equiv 0\pmod n$，所以 $m = \dfrac{n}{2}$（当 $n$ 为偶数）。

综上，$D_{2m-1} = \{\text{Id}\},\ D_{2m} = \{\text{Id}, \sigma^m\}$。

### 求自同构群

即求群 $G$ 上全体自同构变换，根据书本总结方法如下：

1. 如果群 $G$ 太大逐个定义运算不现实，所以先寻找 $G$ 的生成元，然后只需要定义生成元上的变化即可。

2. 自同构变换将同阶元映射到同阶元上（置换），所以考虑将生成元中的同阶元分类，然后考虑同阶元之间的置换。

所以自同构变换的本质还是归结到求置换群上，通过下面几个例子，尝试熟悉这个方法。
