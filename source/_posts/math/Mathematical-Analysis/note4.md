---
title: 多元积分变量代换
hide: false
math: true
abbrlink: 4080
date: 2021-10-17 15:56:53
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
---

为了进一步计算多元积分，使用Fubini定理不完全够，加上变量代换，就可以结合各种变换，计算积分。

## 多元积分变量代换

### 体积变化率=Jacobi行列式的绝对值

设 $\varphi:U\rightarrow V$ 为双射，$U, V\subset \mathbb R^n$ 为开集，$\varphi\in C^1, \forall x \in U, \text{det }(D\varphi(x))\neq 0$。

则体积的变化率 $\dfrac{d\varphi}{dx}(x) = |\text{det }D\varphi(x)|$。

---

**思路：** 使用 $Taylor$ 展开前三项，分别进行估计。体积的变化来源于长度的变化，所以先研究长度的变化。

**证明：** $\forall x_0\in U$，只需证明 $\dfrac{d\varphi}{dx}(x_0) = |\text{det }D\varphi(x_0)|$。

对 $\varphi(x)$ 在 $x_0$ 处 $Taylor$ 展开，得

$$
\begin{aligned}
\varphi(x) &= \varphi(x_0) + D\varphi(x_0)(x-x_0)+R(x)\\
&= D\varphi(x_0)x+R(x)+\varphi(x_0)-D\varphi(x_0)x_0
\end{aligned}
$$

故 $\varphi(x)$ 可以分解为三项：$D\varphi(x_0)x$，$R(x)$（高次项），$\varphi(x_0)-D\varphi(x_0)x_0$ （常数项）。

由于**长度的变化**导致**体积的变化**，所以先考虑长度的变化率。

1. 当 $x\rightarrow x_0$  时，$\begin{cases}R(x_0) = 0\\\dfrac{R(x)}{|x-x_0|}\rightarrow 0\end{cases}\Rightarrow \dfrac{|R(x)-R(x_0)|}{|x-x_0|}\rightarrow 0$。

2. 常数项是平移变化，长度前后不变。

则高次项与常数项对体积的变化率都没有影响。

故，$\dfrac{d\varphi}{dx}(x_0) = \text{在线性变化“ }T(x)=D\varphi(x_0)x\text{ ”下体积的变化率}$。

令 $D\varphi(x_0) = M$，则 $\text{det }M\neq 0$。

设线性变换 $T(x) = Mx,u\in\mathbb R^n$，则

$$
|T(u)| = \sqrt{<T(u), T(u)>} = \sqrt{u^TM^TMu}
$$

由于 $M^TM$ 是正定对称矩阵，设 $\lambda_1, \lambda_2, \cdots, \lambda_n$ 为其特征值，$e_1,e_2,\cdots,e_n$ 为其对应的单位特征向量，则它们两两正交（$\lambda_i>0, |e_i| = 1, e_ie_j = \delta_{ij}$）。

则 $M^TMe_i = \lambda_ie_i\Rightarrow |T(e_i)| = \sqrt{e_i^T\lambda_ie_i} = \sqrt{\lambda_i}$

单位体积的变化率为 $|T(e_1)|\cdot|T(e_2)|\cdots|T(e_n)| = \sqrt{\lambda_1\cdots\lambda_n} = \sqrt{\text{det }M^TM} = |\text{det }M|$。

则在 $x_0$ 的邻域内，有 $\dfrac{d\varphi}{dx}(x) = |\text{det }D\varphi(x)|$。

由于 $x_0$ 的任意性，原命题得证。

**QED**
