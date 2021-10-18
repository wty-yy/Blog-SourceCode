---
title: 多元积分变量代换及应用
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

### 命题1（体积变化率=Jacobi行列式的绝对值）

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

### 定义2（微分同胚）

设 $U, V\subset \mathbb R^n$ 为开集，$\varphi:U\rightarrow V$ 满足

1. $\varphi$ 为双射。

2. $\varphi, \varphi^{-1}\in C^k,\ (1\leqslant k\leqslant +\infty)$。

则称 $\varphi$ 为 $C^k - \text{微分同胚}$。

---

进一步理解**微分同胚**：[知乎 - 如何理解微分同胚的概念？](https://www.zhihu.com/question/27551225?sort=created#:~:text=%E8%A6%81%E7%90%86%E8%A7%A3%E5%BE%AE%E5%88%86%E5%90%8C%E8%83%9A%EF%BC%8C,%E4%B8%80%E5%BC%A0%E6%A9%A1%E7%9A%AE%E8%86%9C%E9%82%A3%E6%A0%B7%E3%80%82)

### 定理3（变量代换）

设 $U, V\subset\mathbb R^n$ 为开集，$\varphi:U\rightarrow V$ 为 $C^1 - \text{微分同胚}$，$K\subset U$ 为紧集，$m^*(\partial K) = 0$，$f\in C(\varphi(k))$，则

$$
\int_{\varphi(K)}f(y)\,dy \xlongequal{y=\varphi(x)} \int_{K}f(\varphi(x))|\text{det }D\varphi(x)|\,dx
$$

---

对该定理有以下的观察：

- 该积分左侧有意义：

利用**微分同胚**性质，有 $\partial\varphi(K) = \varphi(\partial K)$。

**证明：** （反证法）

反设 $\exists a\in\partial K$，使 $\varphi(a)\in\varphi(K)^\circ$。

由于 $K$ 为紧集，且 $\varphi$ 在 $K$ 上连续，则 $\varphi$ 在 $K$ 上**一致连续**。

则 $\forall \varepsilon > 0, \exists\delta > 0$ 使 $\forall x\in \mathbb R^n$，满足 $|a-x|\leqslant\delta$，有 $|\varphi(a)-\varphi(x)|\leqslant \varepsilon$。

由于 $a\in\partial K$，则 $\exists b\in U-K$ 且 $|a-b|\leqslant \delta$，则 $|\varphi(a)-\varphi(b)|\leqslant\varepsilon$。

由于 $\varepsilon$ 的任意性，有 $\varphi(b) \in \varphi(K)$，由于 $\varphi$ 是双射，则 $b\in K$ 与 $b\in U-K$ **矛盾**。

则 $\varphi(a)\not\in\varphi(K)^\circ\Rightarrow \varphi(a)\in\partial\varphi(K)\Rightarrow \varphi(\partial K)\subset\partial\varphi(K)$。

由于 $\varphi$ **微分同胚**的性质，同理可证 $\forall a\in\partial\varphi(K)$，有 $\varphi^{-1}(a)\in\partial K\Rightarrow \partial\varphi(K)\subset\varphi(\partial K)$。

故，$\varphi(\partial K) = \partial\varphi(K)$。

则 $m^*(\partial\varphi(K)) = m^*(\varphi(\partial K)) = 0$（通过 $Lebesgue$ 外侧度定义证明）。

- 对于右式中出现的 $Jacobi$ 行列式，通过**命题1**，可以形象理解为 $dy = \dfrac{dy}{dx}\,dx = |\text{det }D\varphi(x)|\,dx$。

- 通过**微分同胚**还可以得出：$\text{det }D\varphi(x)\neq 0$，因为（左右同时对 $x$ 进行求导）

$$
\begin{aligned}
\varphi^{-1}(\varphi(x))=x\Rightarrow D\varphi^{-1}(\varphi(x))\cdot D\varphi(x) = E_n
\end{aligned}
$$

则 $D\varphi(x)$ 存在逆元，故 $|D\varphi(x)|\neq 0$。

具体证明老师说太复杂了，略去了~，可以参考 [知乎 - 「代发」重积分换元法的证明](https://zhuanlan.zhihu.com/p/261966606)。

## 应用

先是三种常用变换。

### 平移变换

设 $b\in\mathbb R^n$，定义 $T:\mathbb R^n\rightarrow \mathbb R^n,\ T(x) = x+b$。

则 $\text{det }DT = \text{det }E_n = 1$。

$$
\begin{aligned}
\int_{K}f(y)\,dy\xlongequal{y=x+b}\int_{K-b}f(x+b)\,dx\quad(K-b = \{x-b:x\in K\})
\end{aligned}
$$

**例题：** 平移球心到原点，从而 $V(B_R(x_0)) = V(B_R)$。

### 伸缩变换

设 $\lambda_1,\ldots,\lambda_n > 0$，定义 $T=\mathbb R^n\rightarrow \mathbb R^n,\ T(x) = \begin{pmatrix}\lambda_1&&\\&\ddots&\\&&\lambda_n\end{pmatrix}x$。

则 $\text{det }DT = \lambda_1\cdots\lambda_n$。

$$
\begin{aligned}
\int_{K}f(y)\,dy\xlongequal{y=Tx}\lambda_1\cdots\lambda_n\int_{\tilde{K}}f(Tx)\,dx\quad(\tilde{K} = \{T^{-1}x:x\in K\})
\end{aligned}
$$

**例题：** 求椭圆体的体积，$E = \{(x, y, z):\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}+\dfrac{z^2}{c^2}<1\}$，则 $V(E) = \dfrac{4}{3}\pi\cdot abc$。

### 正交变换

设 $Q$ 为正交阵，定义 $T:\mathbb R^n\rightarrow \mathbb R^n,\ T(x) = Qx$。

则 $|\text{det }DT| = |\text{det }Q| = 1$。

$$
\begin{aligned}
\int_Kf(y)\,dy\xlongequal{y=Qx}\int_{\tilde{K}}f(Qx)\,dx\quad (\tilde{K}=\{Q^{-1}x:x\in K\})
\end{aligned}
$$

**例题：**

1. 设 $x_i$ 是向量 $x$ 的第 $i$ 分量，则

$$
\begin{aligned}
&\int_{B_1}x_1\,dx\xlongequal{\begin{aligned}x_1&=-y_1\\x_2&=y_2\\&\cdots\\x_n&=y_n\end{aligned}} -\int_{B_1}y_1\,dy = -\int_{B_1}x_1\,dx\\
\Rightarrow& \int_{B_1}x_1\,dx=0
\end{aligned}
$$

2. $a\in\mathbb R^n$，则（$a\cdot x$ 为向量内积），

$$
\int_{B_1}a\cdot x\,dx = \int_{B_1}\sum_{i=1}^n a_ix_i\,dx = \sum_{i=1}^na_i\int_{B_1}x_i\,dx = 0
$$
