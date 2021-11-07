---
title: Green公式的简化证明 Gauss定理 曲面积分定义
hide: false
math: true
abbrlink: 64854
date: 2021-11-07 15:08:22
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
---

这周基本讲完了曲线积分，在图像比较容易刻画的前提下的证明了Green公式，开始进入曲面积分，曲面积分可以看作是二维的参数形式，虽然曲面的定义没有定义完备（完备的定义要用测度论的知识），但通过微分的形式，转换为求平行四边形的面积，再求和从而得出了曲面积分的定义。

## Green公式（Newton-Leibniz 公式推广）

设 $\Omega\subset \mathbb R^2$ 为有界域，$\partial \Omega$ 分段光滑，设 $P,Q\in C^1(\bar{\Omega})$，则

$$
\int_{\partial\Omega}P\,dx+Q\,dy=\int_{\Omega}\left\{\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right\}\,dxdy
$$

---

由于 $Green$ 公式严格证明过于复杂，考虑加入限制条件。

设 $\Omega$ 同时满足：

1. $\exists\varphi_1,\varphi_2:[a, b]\rightarrow \mathbb R,\ \varphi_1,\varphi_2\in C^1,\ \varphi_1(x)<\varphi_2(x),\ \forall a < x < b$，使得

$$
\Omega=\{(x, y):a < x < b,\ \varphi_1(x) < y < \varphi_2(x)\}
$$

2. $\exists\psi_1, \psi_2:[x, d]\rightarrow \mathbb R, \psi_1,\psi_2\in C^1,\ \psi_1(y) < \psi_2(y),\ \forall c < y < d$，使得

$$
\Omega = \{(x, y):c < y < d,\ \psi_1(y) < x < \psi_2(y)\}
$$

这两个条件，表示 $\Omega$ 分别从两个维度上看，都可以被两个曲边所包围住。

**证明：**（分别证明 $\int_{\partial\Omega}P\,dx=-\int_{\Omega}\frac{\partial P}{\partial y}\,dxdy$ 和 $\int_{\partial\Omega}Q\,dy=\int_{\Omega}\frac{\partial Q}{\partial x}\,dxdy$）

下面证明其中一个：$\int_{\partial\Omega}P\,dx=-\int_{\Omega}\frac{\partial P}{\partial y}\,dxdy$，第二个同理可证。

$$
\begin{aligned}
\int_\Omega\frac{\partial P}{\partial y}\,dxdy=&\int_a^b\left\{\int_{\varphi_1(x)}^{\varphi_2(x)}\frac{\partial P}{\partial y}(x, y)\,dy\right\}\,dx\\
\xlongequal{\text{Newton-Leibniz formula}}&\int_a^bP(x, \varphi_2(x))\,dx - \int_a^bP(x, \varphi_1(x))\,dx\\
\xlongequal{\text{注意方向}}&-\int_{\text{graph }\varphi_2}P\,dx-\int_{\text{graph }\varphi_1}P\,dx\\
=& -\int_{\partial \Omega}P\,dx
\end{aligned}
$$



![Green公式证明](https://img13.360buyimg.com/ddimg/jfs/t1/170781/31/23258/25405/618782eaE3f49349e/fba56295d02bac3f.png)

### 例一

求 $\displaystyle \int_C\frac{y\,dx-x\,dy}{x^2+y^2},\ C=\{(x, y)\in\mathbb R^2:\frac{x^2}{a^2}+\frac{y^2}{b^2} = 1\}$。

**解：**（注意不能直接使用 $Green$ 公式，因为在 $(0,0)$ 处函数值无意义，所以考虑先挖去原点的一个邻域，再使用 $Green$ 公式）

![Green公式例一](https://img11.360buyimg.com/ddimg/jfs/t1/198138/21/16152/48572/61878952E1c80d142/6a418f6f2efcf09b.png)

设 $\displaystyle D_{\varepsilon} = \{(x, y): x^2 + y^2 > \varepsilon\text{ 且 } \frac{x^2}{a^2}+\frac{y^2}{b^2}< 1\}$（图中的阴影部分），$C_{\varepsilon}=\{(x, y):x^2+y^2 = \varepsilon\}$ 则

$$
\begin{aligned}
\int_C\frac{y\,dx-x\,dy}{x^2+y^2}+\int_{C_{\varepsilon}}\frac{y\,dx-x\,dy}{x^2+y^2}=&\int_{\partial D_{\varepsilon}}\frac{y\,dx-x\,dy}{x^2+y^2}\\
\xlongequal{\text{Green}}&-\int_D\frac{(x^2+y^2-2y^2)+(x^2+y^2-2x^2)}{(x^2+y^2)^2}\,dxdy\\
=& 0\\
\text{则 }\int_C\frac{y\,dx-x\,dy}{x^2+y^2}=&-\int_{C_{\varepsilon}}\frac{y\,dx-x\,dy}{x^2+y^2}\\
=&\int_{-C_{\varepsilon}}\frac{y\,dx-x\,dy}{x^2+y^2}\\
=&\frac{1}{\varepsilon^2}\int_{-C_{\varepsilon}}y\,dx-x\,dy\\
\xlongequal{\text{Green}}&\frac{1}{\varepsilon^2}\int_{x^2+y^2\leqslant \varepsilon}-2\,dxdy\\
=&-2\pi
\end{aligned}
$$

## Gauss定理

设 $\vec{F}:A\subset \mathbb R^2\rightarrow \mathbb R^2$，$\vec{F}\in C^1$，$\vec{F} = (F_1,F_2)$，定义

$$
\text{div}\vec{F} = \frac{\partial F_1}{\partial x}+\frac{\partial F_2}{\partial y}
$$

为**散度**（理解为单位时间内每个点产生的流体的量，源的强度）

$\Omega\subset \mathbb R^n$ 为有界区域，$\partial \Omega$ 光滑，$\vec{F} :\bar{\Omega}\rightarrow \mathbb R^2$，$\vec{F}\in C^1$，则

$$
\int_{\Omega}\text{div}\vec{F}\,dxdy=\int_{\partial \Omega}\vec{F}\cdot\vec{n}\,ds
$$

其中 $\vec{n}$ 为单位外法向。

---

**证明：**（注意用 $\tau = (-n_2, n_1)$ 转换，其中 $\tau$ 为单位切向量）

$$
\begin{aligned}
\int_{\Omega}\text{div}\vec{F}\,dxdy=&\int_{\Omega}\left(\frac{\partial F_1}{\partial x}+\frac{\partial F_2}{\partial y}\right)\,dxdy\\
=&\int_{\partial\Omega}F_1\,dy-F_2\,dx\\
=&\sum_i\int_{C_i}(-F_2,F_1)\,d\vec{s}\\
=&\sum_i\int_{C_i}(-F_2,F_1)\vec{\tau}\,ds\\
=&\sum_i\int_{C_i}(-F_2,F_1)(-n_2,n_1)\,ds\\
=&\sum_i\int_{C_i}(n_1F_1+n_2F_2)\,ds\\
=&\sum_i\int_{C_i}\vec{F}\cdot\vec{n}\,ds
\end{aligned}
$$

这样证明 $Gauss$ 定理是不准确的，因为 $Green$ 公式只证明了在图形较好的条件下，老师说 $Gauss$ 公式还有其他更严格的证明方式。

下面三个例题证明思路都是 $Gauss$ 定理的直接推论，或者可以通过 $\tau=(-n_2,n_1)$ 进行关系转换得到。

### 例题

1. 设 $u:\bar{\Omega}\rightarrow \mathbb R,\ u=u(x_1,x_2),\, u\in C^1$，证明：

$$
\int_{\Omega}\frac{\partial u}{\partial x_i}\,dx_1dx_2=\int_{\partial\Omega}un_i\,ds\quad(i=1,2)
$$

2. 设 $u, v:\bar{\Omega}\rightarrow \mathbb R$，$u,v\in C^1$，证明：

$$
\int_{\Omega}u\frac{\partial v}{\partial x_i}\,dx_1dx_2=-\int_{\Omega}v\frac{\partial u}{\partial x_i}\,dx_1dx_2+\int_{\partial\Omega}uvn_i\,ds\quad(i=1,2)
$$

3. 设 $u\in C^2(\bar{\Omega})$，$\displaystyle\Delta u=\frac{\partial^2u}{\partial x_1^2}+\frac{\partial^2u}{\partial x_2^2}$（$\Delta:Laplace\ Operator$），证明

$$
\int_{\Omega}\Delta u\,dx_1dx_2=\int_{\partial\Omega}\frac{\partial u}{\partial\vec{n}}\,ds
$$

其中 $\dfrac{\partial u}{\partial\vec{n}}$ 为 $u$ 在 $\vec{n}$ 上的方向导数，$\vec{n}$ 为单位向量，则 $\dfrac{\partial u}{\partial\vec{n}}=(u_x,u_y)\vec{n}$。

## 曲面积分

### 定义1（曲面）

设 $S\subset \mathbb R^3$，$D\subset \mathbb R^2$ 为有界域，$\partial D$ 分段光滑，$\vec{r}:\bar{D}\rightarrow S
$ 满足：

1. $\vec{r}$ 为双射。

2. $\vec{r},\vec{r}^{-1}$ 连续。

则称 $S$ 为简单曲面，$\vec{r}$ 为 $S$ 的参数方程。

### 定义2（光滑曲面）

设 $S\subset \mathbb R^3$，$D\subset\mathbb R^2$ 为有界域，$\partial D$ 分段光滑，$\vec{r}:\bar{D}\rightarrow S$，$\vec{r}=\vec{r}(s,t)$ 满足：

1. $\vec{r}$ 为双射，$\vec{r},\vec{r}^{-1}$ 连续。（曲线的定义）

2. $\vec{r}\in C^k,\ 1\leqslant k\leqslant +\infty$。（光滑性）

3. $(\vec{r}_s \times\vec{r}_t(s, t)\neq 0\quad \forall(s, t)\in\bar{D}$。（正则性）

则称 $S$ 为 $C^k$ 光滑的正则曲面（简称光滑曲面），称 $\vec{r}$ 为 $S$ 的参数方程。

---

$\vec{r}(s,t)$ 可以视为给出了一个在曲面上的**二维坐标系**，若取 $P\in S$，$P = \vec{r}(s_0,t_0)$，如果固定 $s_0$，则可以求出切线 $\displaystyle \vec{l_1}:\frac{\partial\vec{r}}{\partial t}(s_0,t_0)$，如果固定 $t_0$，则可以求出切线 $\displaystyle \vec{l_2}:\frac{\partial\vec{r}}{\partial t}(s_0,t_0)$，由正则性知，$l_1,l_2$ 不重合。

所以，$P$ 处的切平面为：

$$
\begin{aligned}
T=\left\{\vec{r}(s_0,t_0)+\frac{\partial\vec{r}}{\partial s}(s_0,t_0)(s-s_0)+\frac{\partial\vec{r}}{\partial t}(s_0,t_0)(t-t_0):s, t\in \mathbb R\right\}
\end{aligned}
$$

法向量：$\displaystyle \vec{n}_p = \pm\frac{\vec{r}_s\times\vec{r}_t}{|\vec{r}_s\times\vec{r}_t|}(s_0,t_0)$。

### 例一（平行四边形面积）

$u,v\in\mathbb R^3$，$u\times v\neq 0$，$S=\{su+tv:0\leqslant s,t\leqslant 1\}$，求 $\sigma(S)$（$\sigma$ 为求面积函数）

$$
\begin{aligned}
\sigma(S)=|u\times v|=|u||v|\sin\theta=\sqrt{|u|^2|v|^2-(u\cdot v)^2}
\end{aligned}
$$

### 定义3（面积的微分）

记 $d\sigma=|\vec{r}_s\times\vec{r}_t|\,ds\,dt$ 为 $d\sigma$ 为面积的微分。

### 定义4（曲面面积）

设 $S\subset \mathbb R^3$ 为光滑曲面，$\vec{r}:\bar{D}\rightarrow S$ 为参数方程，定义

$$
\sigma(S) = \int_D|\vec{r}_s\times\vec{r}_t|\,ds\,dt
$$

称 $\sigma(S)$ 为 $S$ 的面积。

### 定义5（分块曲面面积）

设 $S\subset \mathbb R^3$，$\displaystyle S=\bigcup_{i=1}^NS_i$，其中 $S_i,\ i=1\sim N$ 为内部互不相交的光滑曲面，定义

$$
\sigma(S) = \int_{i=1}^N\sigma(S_i)
$$
