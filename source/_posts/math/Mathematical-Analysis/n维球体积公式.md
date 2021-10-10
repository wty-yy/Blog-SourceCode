---
title: n维球体积公式
hide: false
math: true
abbrlink: 32003
date: 2021-10-10 17:54:09
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - 积分
 - 数列
---

学习完 [Fubini定理](/posts/54113/#fubini-定理) 之后，基本就可以求解这个问题了。

### 问题

记

$$
\begin{aligned}
B_1 &= \{x\in\mathbb R^n: |x| < 1\},\quad \text{n维球}\\
\omega_n &= V(B_1) = \int_{B_1} 1\, dx,\quad \text{n维球的体积}\\
I_n &= \int_0^{\frac{\pi}{2}} cos^n\theta\,d\theta,\quad \text{过程量}
\end{aligned}
$$

求解 $\omega_n$ 的表达式。

### 步骤

按照周老师的证明步骤进行证明，将证明分为以下三步：

1. $\omega_{n+1} = 2\omega_nI_{n+1}$，Fubini定理

2. $\displaystyle I_{n+1} = \frac{n}{n+1}I_{n-1}$，分部积分公式

3. $\displaystyle \omega_n = \frac{2\pi^{\frac{n}{2}}}{n\Gamma(\frac{n}{2})}$，数列递推公式

其中 $\Gamma(\cdot)$ 为 [Gamma函数](https://zhuanlan.zhihu.com/p/114041258)。

### 证明

#### 第一步

#### 第二步

#### 第三步

数列递推，参考了 [$\omega_n$ 部分的递推](https://zhuanlan.zhihu.com/p/195437770) 和 [Gamma函数部分的递推](https://math.stackexchange.com/questions/1444967/proving-that-gamma-leftn-frac12-right-frac2n-sqrt-pi22n/1445004#1445004)

利用公式 $\Gamma(x+1)=x\Gamma(x)$，得

$$
\begin{aligned} \Gamma\left(n + \frac{1}{2}\right) & =\left(n-1+\frac{1}{2}\right)\Gamma\left(n-1+\frac{1}{2}\right) \\ & =\left(n-1+\frac{1}{2}\right)\left(n-2+\frac{1}{2}\right)\Gamma\left(n-2+\frac{1}{2}\right) \\ & = \ldots = \left(n-\frac{1}{2}\right)\left(n-\frac{3}{2}\right)\dots \ \frac{1}{2}\ \Gamma\left(\frac{1}{2}\right) \\ & = \frac{(2n-1)(2n-3)\cdots1}{2^n} \cdot \Gamma\left( \frac{1}{2}\right) \\ & =\frac{(2n-1)(2n-2)(2n-3)(2n-4)\cdots1}{2^n(2n-2)(2n-4)\dots2} \cdot\Gamma\left( \frac{1}{2}\right) \\ & =\frac{(2n-1)!}{2^{2n-1}(n-1)!}\Gamma\left( \frac{1}{2}\right)\\ & =\frac{2n!}{2^{2n}n!}\sqrt{\pi}. \end{aligned}
$$
