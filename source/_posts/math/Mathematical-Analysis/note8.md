---
title: 第一型曲面积分&第二型曲面积分
hide: false
math: true
category:
  - Math
  - 数学分析
tags:
  - 曲面积分
abbrlink: 29775
date: 2021-11-14 12:39:53
index_img:
banner_img:
---

## 第一型曲面积分

### 定义1（第一型曲面积分）

设 $S\subset \mathbb R^3$ 为光滑曲面，$f:S\rightarrow \mathbb R$，设 $\vec{r}:[a.b]\times[c,d]\rightarrow S$ 为 $S$ 的参数方程，设
$$
\begin{aligned}
\pi : a=&s_0<s_1<\cdots<s_{N_1} = b\\
c=&t_0<t_1<\cdots<t_{N_2} = d
\end{aligned}
$$
为 $[a,b]\times[c,d]$ 的一个分划，考虑和式
$$
\sum = \sum_{i,j}f(\xi_{ij})\sigma(S_{ij})
$$
其中 $S_{ij} = \vec{r}([s_{i-1},s_i]\times[t_{j-1},t_j]),\ \xi_{ij}\in S_{ij}$，
如果 $\lim\limits_{\triangle\pi\rightarrow 0}\sum$ 存在，记
$$
\int_Sf\,d\sigma = \lim_{\triangle\pi\rightarrow 0}\sum
$$
将 $\int_Sf\,d\sigma$ 称为 $f$ 沿曲面 $S$ 的积分。

---

如果令 $f(x) = 1$，结合**定理2**和上节定义的 [曲面面积](/posts/64854/#定义4曲面面积)，则 $\sigma(S) = \int_S 1\, d\sigma$。

### 定理2（第一型曲面积分的计算公式）

设 $S\subset\mathbb R^3$ 为光滑曲面，$\vec{r}:[a,b]\times[c,d]\rightarrow S$ 为 $S$ 的参数方程，若 $f:S\rightarrow \mathbb R$ 连续，则

$$
\int_Sf\,d\sigma = \int_{[a,b]\times[c,d]}f\circ \vec{r}\ |\vec{r_s}\times\vec{r_t}|\,ds\,dt
$$

---

证明方法应该和 [第一型曲线积分的证明方法](/posts/30251/#定理2第一型曲线积分计算方法) 类似（去估计两者的差值），但会更加复杂，就不证明了。

### 定义3（非闭方体的积分域）

设 $S\subset \mathbb R^3$ 为光滑曲线，$\vec{r}:\overline{D}\rightarrow S$ 为 $S$ 的参数方程，如果 $f:S\rightarrow \mathbb R$ 连续，定义

$$
\int_Sf\,d\sigma = \int_Df\circ \vec{r}\ |\vec{r}_s\times\vec{r}_t|\,ds\,dt
$$

---

要确保这里的定义是良定义，还需要证明对于不同的参数方程，该积分值都相同（但不会证）

### 定理4（第一型曲面积分的性质）

设 $S\subset \mathbb R^3$ 为光滑曲面，$f, g:S\rightarrow \mathbb R$ 连续。

1. 如果 $f\geqslant 0$，则 $\int_Sf\,d\sigma \geqslant 0$，“$=$”成立当且仅当 $f\equiv 0$。

2. 如果 $k, l\in \mathbb R$，则 $\int_S\{kf+lg\}\,d\sigma = k\int_Sf\,d\sigma+l\int_S\,d\sigma$。

3. 如果 $f \leqslant g$，则 $\int_Sf\,d\sigma\leqslant \int_Sg\,d\sigma$。

4. $|\int_Sf\,d\sigma|\leqslant\int_S|f|\,d\sigma$。

---

这几个性质都可以根据定义直接得出。

记 $B_R(x_0) = \{x\in \mathbb R^3:|x-x_0|\leqslant R\}$，特别的 $B_R = \{x\in\mathbb R^3:|x|\leqslant R\}$。

### 定理5（球面上的积分）

设 $f\in C(\partial B_R)$，则

$$
\int_{\partial B_R}f\,d\sigma = \int_0^{2\pi}\int_0^{\pi}f(R\sin\varphi\cos\theta,R\sin\varphi\sin\theta,R\cos\varphi)R^2\sin\varphi\,d\varphi\,d\theta
$$

---

**思路：** $\partial B_R$ 的参数方程为 $\vec{r} = (R\sin\varphi\cos\theta,R\sin\varphi\sin\theta,R\cos\varphi)$，且 $|\vec{r}_{\theta}\times\vec{r}_{\varphi}| = R^2\sin\varphi$，所以代入 [计算公式](./#定理2第一型曲面积分的计算公式) 即可得出结论。

#### 推论1

设 $f\in C(\partial B_{R})$，则

$$
\int_{\partial B_R} f(x)\,d\sigma = R^2\int_{\partial B_1}f(Rx)\,d\sigma
$$

**注：** 这里的缩放只能是对球进行，而不能对椭球缩放。（因为球具有很好的对称性？）

#### 推论2

设 $f\in C(\overline{B}_R)$ 则

$$
\int_{B_R}f = \int_0^R\left\{\int_{\partial B_r}f\,d\sigma\right\}\,dr
$$

#### 推论3（球体表面积公式）

令 $f = 1$，则

$$
\sigma(\partial B_R) = \int_{\partial B_R}1\,d\sigma = \int_0^{2\pi}\int_0^{\pi}R^2\sin\varphi\,d\varphi\,d\theta=4\pi R^2
$$


### 定义6（分块曲面积分）

设 $S\subset \mathbb R^3,\ S = \bigcup\limits_{i=1}^NS_i$，其中 $S_i \ (i=1\sim N)$ 为内部互不相交的光滑曲面，$f:S\rightarrow \mathbb R$ 连续，定义

$$
\int_Sf\,d\sigma = \sum_{i=1}^N\int_{S_i}f\,d\sigma
$$

---

注意现在定义的第一型曲面积分和曲线积分都是和坐标系无关的定义，所以可以在不同位置建立坐标系，相当于对原来的点做了**平移变换，正交变换**，比如

$$
\int_{\partial B_R(x_0)}f(x)\,d\sigma = \int_{\partial B_R}f(x+x_0)\,d\sigma
$$

$$
\int_{ \partial B_R}f(ax+by+cz)\,d\sigma = 2\pi\int_{-1}^1f(u\sqrt{a^2+b^2+c^2})\,du
$$

### 例题

设 $S = \{(x, y, z): (x-a)^2+(y-b)^2+(z-c)^2 = R^2\text{ 且 }z\geqslant c\}$，求 $\int_S(x+y+z)\,d\sigma$。

**解：** 记 $(\partial B_R)^+ = \{(x, y, z):x^2+y^2+z^2 = R\text{ 且 }z\geqslant 0\}$。

$$
\begin{aligned}
\int_S(x+y+z)\,d\sigma =& \int_{(\partial B_R)^+}(x+y+z+a+b+c)\,d\sigma\\
 = &\ 2\pi R^2(a+b+c)+\int_{(\partial B_R)^+}(x+y+z)\,d\sigma\\
\xlongequal[\text{故可以消去}]{\text{由于}x,y\text{在曲面上的对称性}}&\ 2\pi R^2(a+b+c)+\int_{(\partial B_R)^+}z\,d\sigma\\
= &\ 2\pi R^2(a+b+c)+\frac{1}{2}\int_{\partial B_R}|z|\,d\sigma\\
= &\ 2\pi R^2(a+b+c)+\frac{1}{2}\int_0^{2\pi}\int_0^{\pi}|R\cos\varphi|R^2\sin\varphi\,d\varphi\,d\theta\\
= &\ 2\pi R^2(a+b+c)+\pi R^3\cdot2\int_0^{\frac{\pi}{2}}\cos\varphi\sin\varphi\,d\varphi\\
= &\ 2\pi R^2(a+b+c)+\pi R^3
\end{aligned}
$$

## 第二型曲面积分

设 $S\subset \mathbb R^3$ 是一个光滑曲面，$\vec{r}:\overline{D}\rightarrow S$ 是 $S$ 的参数方程。

### 定义1（曲面的定向）

$S$ 上的一个**连续**的**单位法向量场**，称为 $S$ 的一个**定向**。

### 命题2（定向只有两个）

$S$ 有且仅有两个定向，它们分别为

$$
\vec{n} = \frac{\vec{r}_s\times\vec{r}_t}{|\vec{r_s}\times\vec{r}_t|}\circ(\vec{r})^{-1}\quad\text{和}\quad -\vec{n}
$$

### 定义3（定向曲面）

设 $\vec{n}$ 为 $S$ 的一个**定向**，$\{S,\vec{n}\}$ 为定向曲面，简记为 $S$，称 $S$ 为定向曲面，$\vec{n}$ 为 $S$ 的正向，$-S=\{S,-\vec{n}\}$。

### 定义4（第二型曲面积分）

设 $S\subset \mathbb R^3$ 为定向曲面，$\vec{n}$ 为 $S$ 的正向，$\vec{F}:S\rightarrow \mathbb R^3$，设 $\vec{r}:[a, b]\times[c,d]$ 为 $S$ 的参数方程，设

$$
\begin{aligned}
\pi : a =& s_0<s_1<\cdots<s_{N_1} = b\\
c =& t_0<t_1<\cdots<t_{N_2} = d
\end{aligned}
$$

为 $[a, b]\times[c, d]$ 的分划，考虑和式

$$
\sum = \sum_{i,j}(\vec{F}\cdot\vec{n})(\xi_{ij})\sigma(S_{ij})
$$
其中 $S_{ij} = \vec{r}([s_{i-1},s_i]\times[t_{j-1},t_j]),\ \xi_{ij}\in S_{ij}$，
如果 $\lim\limits_{\triangle\pi\rightarrow 0}\sum$ 存在，记
$$
\int_S\vec{F}\cdot d\vec{\sigma} = \lim_{\triangle\pi\rightarrow 0}\sum
$$
将 $\int_S\vec{F}\cdot d\vec{\sigma}$ 称为向量场 $\vec{F}$ 沿曲面 $S$ 的积分。

---

不难发现，第二型曲面积分的定义式和 [第一型曲面积分](./#定义1第一型曲面积分) 的定义式区别只有 $f$ 和 $\vec{F}\cdot \vec{n}$ 这里，于是有如下定理。

### 定理5（第二型和第一型曲面积分的转化）

设 $S\subset \mathbb R^3$ 为定向曲面，$\vec{r}:[a,b]\times [c,d]\rightarrow S$ 为 $S$ 的参数方程，$\vec{n}$ 为 $S$ 的正向，设 $\vec{F}:S\rightarrow \mathbb R^3$ 连续，则

$$
\int_S\vec{F}\cdot d\vec{\sigma} = \int_S\vec{F}\cdot\vec{n}\,d\sigma
$$

### 定义6（非闭方体的积分域）

设 $S\subset \mathbb R^3$ 为定向曲面，$\vec{n}$ 为 $S$ 的正向，设 $\vec{F}:S\rightarrow \mathbb R^3$ 连续，定义

$$
\int_S\vec{F}\cdot d\vec{\sigma} = \int_S\vec{F}\cdot\vec{n}\,d\sigma
$$

### 定理7（第二型曲面积分的性质）

设 $S\subset \mathbb R^3$ 为定向曲面，$\vec{F},\vec{G}:S\rightarrow \mathbb R^3$ 连续，

1. 设 $k, l\in \mathbb R$，则 $\int_S(k\vec{F}+l\vec{G})\cdot d\vec{\sigma} = k\int_S\vec{F}\cdot d\vec{\sigma}+l\int_S\vec{G}\cdot d\vec{\sigma}$

2. $\int_S \vec{F}\cdot d\vec{\sigma} = -\int_{-S}\vec{F}\cdot d\vec{\sigma}$

3. 设 $\vec{r}:\overline{D}\rightarrow \mathbb S$ 为 $S$ 的参数方程，且 $\vec{n} = \dfrac{\vec{r}_s\times\vec{r}_t}{|\vec{r_s}\times\vec{r}_t|}\circ(\vec{r})^{-1}$，则

$$
\int_S\vec{F}\,d\vec{\sigma} = \int_D(\vec{F}\circ\vec{r})\cdot(\vec{r}_s\times\vec{r}_t)\,ds\,dt
$$

---

证明下第三条，利用 [定义6](./#定理6非闭方体的积分域) 即可，

$$
\begin{aligned}
\int_S\vec{F}\,d\vec{\sigma} =& \int_S\vec{F}\cdot\vec{n}\,ds = \int_D(\vec{F}\cdot\vec{n})\circ\vec{r}\,|\vec{r}_s\times\vec{r}_t|\,ds\,dt \\
=& \int_D(\vec{F}\circ\vec{r})\cdot(\vec{n}\circ\vec{r})\ |\vec{r}_s\times\vec{r}_t|\,ds\,dt\\
\xlongequal{\text{代入}\vec{n}\text{的表达式}}&\int_D(\vec{F}\circ\vec{r})\cdot(\vec{r}_s\times\vec{r}_t)\,ds\,dt

\end{aligned}
$$

### 定义8（分块曲面积分）

设 $S=\bigcup\limits_{i=1}^NS_i$，$S_i\ (i=1\sim N)$ 为内部互不相交的定向曲面，设 $\vec{F}:S\rightarrow \mathbb R^3$ 连续，定义

$$
\int_S\vec{F}\cdot d\vec{\sigma} = \sum_{i=1}^N\int_{S_i}\vec{F}\cdot\,d\vec{\sigma}
$$

---

则有 $d\vec{\sigma} = \vec{n}\,d\sigma = (\vec{s}\times\vec{t})\,ds\,dt$。

### 在具体坐标系下第二型曲面积分的计算公式

建立空间直角坐标系 $Oxyz$，则 $\vec{n} = (\cos\alpha, \cos\beta, \cos\gamma)$。

$d\vec{\sigma} = \vec{n}d\sigma = (\cos\alpha\,d\sigma,\cos\beta\,d\sigma,\cos\gamma\,d\sigma) \xlongequal{\text{令}} (dy\,dz,dz\,dx,dx\,dy)$。（可以理解为曲面在法向量方向上的投影）

令 $\vec{F} = (F_1(x, y, z),F_2(x, y, z), F_3(x, y, z))$，则

$$
\int_S\vec{F}\cdot d\vec{\sigma} = \int_SF_1(x, y, z)\,dy\,dz+F_2(x, y, z)\,dz\,dx+F_3(x, y, z)\,dx\,dy
$$

令 $\vec{r} = (x(s, t), y(s, t), z(s, t)),\ \vec{n} = \dfrac{\vec{r}_s\times\vec{r}_t}{|\vec{r}_s\times\vec{r}_t|}\circ (\vec{r})^{-1}$，则

$$
\begin{aligned}
(\vec{F}\circ \vec{r})\cdot (\vec{r}_s\times\vec{r}_t) =&\ [\vec{F}\circ \vec{r},\vec{r}_s,\vec{r}_t]&(\text{混合积})\\
=&
\left | \begin{matrix}
F_1\circ\vec{r}&F_2\circ\vec{r}&F_3\circ\vec{r}\\
x_s&y_s&z_s\\
x_t&y_t&z_t
\end{matrix}\right |\\
=&\ (F_1\circ\vec{r})\frac{\partial(y,z)}{\partial(s,t)}+(F_2\circ\vec{r})\frac{\partial(z,x)}{\partial(s,t)}+(F_3\circ\vec{r})\frac{\partial(x,y)}{\partial(s,t)}\\
\end{aligned}
$$

则（由 [定理7](./#定理7第二型曲面积分的性质) 计算公式展开）

$$
\begin{aligned}
\int_S\vec{F}\cdot d\vec{\sigma} =& \int_SF_1\,dy\,dz + F_2\,dz\,dx + F_3\,dx\,dy\\
 =& \int_D(F_1\circ\vec{r})\frac{\partial(y,z)}{\partial(s,t)}+(F_2\circ\vec{r})\frac{\partial(z,x)}{\partial(s,t)}+(F_3\circ\vec{r})\frac{\partial(x,y)}{\partial(s,t)}
\end{aligned}
$$

所以有如下对应关系

$$
\begin{aligned}
\int_SR\,dx\,dy =& \int_D(R\circ\vec{r})\frac{\partial(x,y)}{\partial(s,t)}\\
\int_SQ\,dz\,dx =& \int_D(Q\circ\vec{r})\frac{\partial(z,x)}{\partial(s,t)}\\
\int_SP\,dy\,dz =& \int_D(P\circ\vec{r})\frac{\partial(y,z)}{\partial(s,t)}
\end{aligned}
$$
