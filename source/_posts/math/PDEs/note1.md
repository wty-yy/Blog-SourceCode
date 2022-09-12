---
title: 偏微分方程 - 基础知识 变分问题 极小曲面问题
hide: false
math: true
category:
  - Math
  - 偏微分方程
abbrlink: 51678
date: 2022-09-11 20:55:27
index_img:
banner_img:
tags:
---

## 基础知识

### 定义1（函数范数）

设标量函数 $u: \mathbb{R}^n\supset \Omega\to \mathbb{R}$，$C(\Omega)$ 表示在 $\Omega$ 上的连续标量函数构成的线性空间，对于 $u\in C(\Omega)$，定义
$$
||u||_{C(\Omega} = \sup_{x\in\Omega}|u(x)|,\quad\text{（值域的上确界）}
$$
$C^k(\Omega)$表示：由 $\Omega$ 上的 $k$ 阶连续可微函数构成的线性空间，特别地 $\displaystyle C^{\infty}(\Omega):=\bigcup_{k=1}^\infty C^k(\Omega)$.

对于 $u\in C^k(\Omega)$，定义
$$
||u||_{C^k(\Omega)} = \sup_{x\in\Omega}|u(x)|+\sum_{|\alpha|=1}^k\sup_{x\in\Omega}|D^\alpha u(x)|
$$
其中 $\alpha = (\alpha_1,\alpha_2,\cdots, \alpha_2n)$ 表示多重指标，且
$$
|\alpha|=\alpha_1+\alpha_2+\cdots+\alpha_n,\ D^\alpha u=\nabla^\alpha u=\displaystyle \frac{\partial^{|\alpha|}u}{\partial x_1^{\alpha_1}\cdots\partial x_n^{\alpha_n}}.
$$

### 定义2（支集）
$\forall u\in C(\Omega)$，记 $u$ 的支集为
$$
\text{supp}(u):= \{x\in\Omega:u(x)\neq 0\}.
$$

### 定义3（紧支集函数类）
记全体 $k$ 阶连续可微且支集为紧集的函数全体为
$$
C_0^k(\Omega):=\{u\in C^k(\Omega):\text{supp}(u)\text{为紧集}\}.
$$

### 定义4（梯度）
设 $u:\mathbb{R}^n\to\mathbb{R}$ 且 $u\in C^1$，则 $u$ 的梯度记为
$$
D_u = \nabla u = \left(\frac{\partial u}{\partial x_1},\cdots,\frac{\partial u}{\partial x_n}\right)^T.
$$

### 定义5（散度）
设 $U:\mathbb{R}^n\to\mathbb{R}^n$，令 $U=(u_1,u_2,\cdots,u_n)^T,\ u_i:\mathbb{R}^n\to\mathbb{R},\ (i=1,2,\cdots,n)$，则 $U$ 的散度记为
$$
\begin{aligned}
\text{div }u = \nabla\cdot u :=&\ \left(\frac{\partial}{\partial x_1},\frac{\partial}{\partial x_2},\cdots,\frac{\partial}{\partial x_n}\right)^T\cdot (u_1,\cdots, u_n)^T\\
=&\ \frac{\partial u_1}{\partial x_1}+\frac{\partial u_2}{\partial x_2}+\cdots+\frac{\partial u_n}{\partial x_n} = \sum_{i=1}^n\frac{\partial u_i}{\partial x_i}.
\end{aligned}
$$

### 定理6（Green公式）
设 $D\subset \mathbb{R}^2$ 是有界域，$\partial D$ 分段光滑，$P, Q\in C^1(D)$，则
$$
\int_{\partial D}P\,d x+Q\,d y = \iint_D\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)\,d x\,d y,
$$
其中 $\partial D$ 取正向（逆时针方向）.

### 推论7
设 $D\subset \mathbb{R}^2$ 是有界域，$\partial D$ 分段光滑，$P, Q\in C^1(D)$，则
$$
\int_{\partial D}(P,Q)^T\cdot \boldsymbol{n}\,ds = \iint_D\left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}\right)\,dx\,dy\iff
\int_{\partial D}U\cdot \vec{n}\,ds = \iint_D\nabla\cdot U\,dx\,dy,
$$
其中 $\vec{n}$ 为 $\partial D$ 上的单位外法向，$U=(P, Q)^T$.

---

**定理6**和**推论7**的证明请见[Green公式在限制条件下的证明 Gauss定理](/posts/64854).

### 定理8（Gauss公式，散度公式）
设 $V\subset \mathbb{R}^3$ 是有界域，$\partial V$ 分片光滑，$P, Q, R\in C^1(\bar{V})$，则
$$
\iiint_V\left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)\,dx\,dy\,dz = 
\iint_{\partial V}P\,dy\,dz + Q\,dz\,dx + R\,dx\,dy,
$$
记 $U = (P, Q, R)^T$，则
$$
\iiint_V\nabla\cdot U\,dx\,dy\,dz = \iint_{\partial V} U\cdot \vec{n}\,ds.
$$

---

分片光滑的定义和定理的证明请见[Gauss 定理（散度定理）](/posts/34494/#gauss-定理散度定理).

### 定理9（Gauss-Green公式）设 $\Omega\in\mathbb{R}^n$ 为有界开集，且 $\partial \Omega \in C^1$，若 $U=(u_1,\cdots,u_n)^T:\bar{\Omega}\to\mathbb{R}^n$ 且 $u\in C^1(\Omega)\cap C(\bar{\Omega})$，则
$$
\int_{\Omega}\nabla\cdot U\,d x = \int_{\partial \Omega} U\cdot \vec{n}\,d s,
$$
其中 $\vec{n}$ 为 $\partial \Omega$ 的单位外法向.

### 推论10
(1). 若$u, v\in C^1(\Omega)\cap C(\bar{\Omega})$，则
$$
\int_{\Omega}u_{x_i}v\,d x = -\int_{\Omega}uv_{x_i}\,d x+\int_{\partial \Omega}uvn_i\,d s.
$$

(2). 若$u\in C^2(\Omega)\cap C^1(\bar{\Omega})$，则
$$
\int_{\Omega}\Delta u\,d x=\int_{\partial \Omega}\frac{\partial u}{\partial \vec{n}}\,d s,
$$
其中$\displaystyle \Delta u=\nabla\cdot(\nabla u) = \sum_{i=1}^n\frac{\partial^2 u}{\partial x_i^2},\ \frac{\partial u}{\partial \vec{n}}=\nabla u\cdot \vec{n}$.

(3). 若$u, v\in C^2(\Omega)\cap C^1(\bar{\Omega})$，则
$$
\int_{\Omega}\nabla u\cdot \nabla v\,d x=-\int_{\Omega} u\nabla v\,d x+\int{\partial \Omega}u\frac{\partial v}{\partial \vec{n}}\,d s.
$$

(4). 若$u,v\in C^2(\Omega)\cap C^1(\bar{\Omega})$，则
$$
\int_{\Omega}(u\Delta v-v\Delta u)\,d x=\int_{\partial \Omega}\left(u\frac{\partial v}{\partial\vec{n}}-v\frac{\partial u}{\partial \vec{n}}\right)\,d s.
$$

---

**定理9**为Gauss公式和Green公式的推广形式，证明略去（需要复杂的讨论）

**证明 推论10**：
(1). 令 $U = (0,\cdots, 0, uv, 0,\cdots, 0)^T$，即 $U_j = \begin{cases}uv,&\quad j=i,\\ 0,&\quad j\neq i.\end{cases}$ 则
$$
\begin{aligned}
&\ \begin{aligned}
\int_{\Omega}\nabla\cdot U\,d x =&\ \int_{\Omega}\frac{\partial uv}{\partial x_i}\,d x=\int_{\Omega}u_{x_i}v\,d x+\int_{\Omega}uv_{x_{i}}\,d x
\xlongequal{\text{Gauss-Green}}&\ \int_{\partial \Omega}U\cdot \vec{n}\,d s=\int_{\partial \Omega}uvn_i\,d s\\
\end{aligned}\\
\Rightarrow&\ \int_{\Omega}u_{x_i}v\,d x=-\int_{\Omega}uv_{x_i}\,d x+\int_{\partial\Omega}uvn_i\,d s.
\end{aligned}
$$

(2). 
$$
\int_{\Omega}\Delta u\,d x=\int_{\Omega}\nabla\cdot(\nabla u)\,d x \xlongequal{\text{Gauss-Green}}\int_{\partial \Omega}\nabla u\cdot \vec{n}\,d s = \int_{\partial \Omega}\frac{\partial u}{\partial \vec{n}}\,d s.
$$

(3). 由 $(1)$ 知，令 $\displaystyle v=\frac{\partial v}{\partial x_i}$，可得
$$
\int_{\Omega}\frac{\partial u}{\partial x_i}\frac{\partial v}{\partial x_i}\,d x =-\int_{\Omega}u\frac{\partial^2 v}{\partial x_i^2}\,d x+\int_{\partial \Omega}u\frac{\partial v}{\partial x_i}n_i\,d s,\quad(i=1,2,\cdots, n),
$$
对上式左右两端同时对 $i=1,2,\cdots, n$ 求和可得
$$
\int_{\Omega}\nabla u\cdot \nabla v\,d x = -\int_{\Omega}u\Delta v\,d x+\int_{\partial \Omega}u\frac{\partial v}{\partial \vec{n}}\,d s.
$$

(4). 由 $(3)$ 知，交换 $u, v$ 可得
$$
\int_{\Omega}\nabla u\cdot \nabla v\,d x = -\int_{\Omega}u\Delta v\,d x+\int_{\partial \Omega}u\frac{\partial v}{\partial \vec{n}}\,d s=-\int_{\Omega}v\Delta u\,d x+\int_{\partial \Omega}v\frac{\partial u}{\partial \vec{n}}\,d s,
$$
则
$$
\int_{\Omega}(u\Delta v-v\Delta u)\,d x =\int_{\partial \Omega}\left(u\frac{\partial v}{\partial \vec{n}}-v\frac{\partial u}{\partial \vec{n}}\right)\,d s.
$$

## 三个经典偏微分方程

### 波动方程

**弦振动方程（一维波动方程）**

$$
\frac{\partial^2 u}{\partial t^2}-a^2\frac{\partial^2u}{\partial x^2} = f,\quad (0 < x < l, t > 0)
$$

**高维波动方程**：$u=u(x_1,x_2,\cdots, x_n, t)$，高维波动方程为
$$
\frac{\partial^2 u}{\partial t^2}-a^2\frac{\partial^2u}{\partial x^2} = f,
$$
其中 $\Delta u = \sum_{i=1}^n\frac{\partial^2 u}{\partial x_i^2}$ 为Laplace算子，$n$ 为物理空间的维数.

### 热传导方程
设 $u = u(x, y, z, t)$，则热传导方程为
$$
\frac{\partial u}{\partial t}-a^2\Delta u=f.
$$

### 连续性方程
设 $\rho = \rho(x, y, z, t)$，则连续性方程为
$$
\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho\vec{v}) = 0,\quad (x, y, z)\in\Omega\times (0,\infty).
$$

## 变分问题

### 定义1（$C_0^{\infty}$）
设 $\Omega$ 为 $\mathbb{R}^2$ 中的区域，定义在 $\Omega$ 上无穷次可微且在 $\Omega$ 的边界附近为 $0$ 的函数全体记为 $C_0^{\infty}(\Omega)$.

### 例一（$C_0^{\infty}$ 中的一种核函数）

设 $\rho(x, y) = \left\{\begin{aligned} k\cdot \text{exp}\left(-\frac{1}{1-(x^2+y^2)}\right),&\quad x^2+y^2 < 1,\\ 0,&\quad x^2+y^2 \geqslant 1.\end{aligned}\right.$ 则 $\rho(x, y)\in C_0^{\infty(\mathbb{R}^2)}$，可以选取 $k$ 使得 $\displaystyle \int_{\mathbb{R}^2}\rho(x, y)\,dx\,dy = 1$，定义
$$
\rho_n(x, y) = n^2\rho(nx, ny),\quad(n > 0)
$$
则 $\displaystyle \int_{\mathbb{R}^2}\rho_n(x, y)\,dx\,dy = 1$ 且当 $\sqrt{x^2+y^2}\geqslant \frac{1}{n}$ 时，$\rho_n(x, y)=0$,即 $\text{supp}(\rho_n) = B_{1/n}$. 其中 $B_{1/n}=\{x\in\mathbb{R}^2:||x||_2 < \frac{1}{n}\}$ 即半径为 $\frac{1}{n}$ 圆心在原点的开球.

**利用 $\rho_n$ 可以将积分域缩小到 $B_{1/n}$ 中，从而简化计算.**

### 引理2.1
设 $\Omega$ 为 $\mathbb{R}^2$ 中有界区域， $f(x, y)$ 在 $\Omega$ 上连续，若 $\forall \varphi(x, y)\in C_0^\infty(\Omega)$ 有
$$
\iint_{\Omega}f(x, y)\varphi(x, y)\,dx\,dy = 0,
$$
则 $f(x, y)$ 在 $\Omega$ 上恒为 $0$.

---

**证明**：（反证法，利用 $f$ 的连续性和例题中的 $\rho_n$ 替换 $\varphi$）

反设 $\exists (x_0,y_0)\in\Omega$ 使得 $f(x_0, y_0)\neq 0$，不妨令 $f(x_0, y_0) > 0$，由于 $f$ 在 $\Omega$ 上连续，则 $\exists \delta > 0$ 使得 $f(x, y) > 0,\ \forall x\in B_{\delta}(x_0, y_0)$，其中 $B_{\delta}(x_0,y_0$ 表示以 $(x_0, y_0$ 为圆心半径为 $\delta$ 的开球.

对于上述 $\delta$ 取充分大的 $n$ 使得 $\frac{1}{n}\leqslant \delta$，令 $\varphi(x, y)=\rho_n(x-x_0,y-y_0)\in C_0^\infty(\Omega)$，于是
$$
0=\iint_{\Omega}f(x, y)\varphi(x, y)\,dx\,dy = \iint_{B_{1/n}}(x_0,y_0)f(x, y)\rho_n(x-x_0,y-y_0)\,dx\,dy > 0
$$
矛盾.

## 极小曲面问题

极小曲面问题：考虑 $\mathbb{R}^2$ 上的有界区域 $\Omega$，$\partial\Omega$ 充分光滑，令 $\partial \Omega$ 的参数方程为
$$
l: \alpha(s) = (x(s),y(s),\varphi(s)),\quad(0\leqslant s\leqslant s_0)
$$
其中 $x(0) = x(s_0), y(0)=y(s_0), \varphi(0)=\varphi(s_0)$（封闭曲线）.

求 $\bar{\Omega}$ 上的曲面 $S$ 满足：

1. $S$ 以 $l$ 为周界.（$\partial S = l$）

2. $S$ 的表面积最小.

---

令满足上述条件的曲面参数方程为 $S:\tau = (x, y, v(x, y))$，则 $S$ 的表面积为（更详细的说明请见[二维图像的曲面积分](/posts/64854/#例一二维图像的曲面面积)）
$$
\begin{aligned}
J(v) =&\ \iint_{\Omega}\left|\frac{\partial \tau}{\partial x}\times\frac{\partial \tau}{\partial y}\right|\,dx\,dy = \iint_\Omega|(1, 0, v_x)\times(0,1,v_y)|\,dx\,dy\\
=&\ \iint_\Omega\sqrt{(1+v_x^2)(1+v_y^2)-v_x^2v_y^2}\,dx\,dy = \iint_{\Omega}\sqrt{1+v_x^2+v_y^2}\,dx\,dy
\end{aligned}
$$

设全体满足条件的函数集合为
$$
M_\varphi = \{v(x, y):v\in C^1(\bar{\Omega}),\ v|_{\partial\Omega}=\varphi\},
$$
则该问题可转化为求解如下的极小化问题
$$
\min_{v\in M_{\varphi}} J(v).
$$
假设该问题的解为 $u$，则
$$
J(u) = \min_{v\in M_{\varphi}} J(v)\iff u = \argmin_{v\in M_{\varphi}}J(v).\tag{1}
$$
这里 $J(v)$ 为定义在函数集合 $M_\varphi$ 上的**泛函**.

### 变分问题

**变分问题**就是如上式$(1)$的一个**求解泛函极值的问题**.

### 问题求解

> 考虑对最优解做一个扰动，说明最优解是扰动后的最值即可.

令 $M_0 = \{v(x, y):v\in C^1(\bar{\Omega}),\ v|_{\partial\Omega} = 0\}$，$\forall \varepsilon \in\mathbb{R}, \forall v\in M_0$，

则有 $u+\varepsilon v\in M_{\varphi}$ 且 $J(u+\varepsilon v)\geqslant J(u)$.

记 $j(\varepsilon) = J(u + \varepsilon v)$，则 $j(\varepsilon) \geqslant j(0)$，即 $j'(\varepsilon)|_{\varepsilon=0} = j'(0) = 0$（必要性）.

$$
\begin{aligned}
j'(\varepsilon) = \frac{\partial J(u+\varepsilon v)}{\partial \varepsilon} = \int_{\Omega}\frac{(u_x+\varepsilon v_x)v_x+(u_y+\varepsilon v_y)v_y}{\sqrt{1+(u_x+\varepsilon v_x)^2+(u_y+\varepsilon v_y)^2}}\,dx\,dy.
\end{aligned}
$$

则 $j'(0) = \int_\Omega\left(\frac{u_x}{\sqrt{1+u_x^2+u_y^2}}v_x+\frac{u_y}{\sqrt{1+u_x^2+u_y^2}}v_y\right)\,dx\,dy = \int_{\Omega}\frac{1}{\sqrt{1+u_x^2+u_y^2}}\nabla u\cdot \nabla v\,dx\,dy=0$

若 $u\in C^2(\bar{\Omega})$，由Green公式（分部积分形式）
$$
\int_{\Omega}\nabla u\cdot \nabla v\, dx\, dy = -\int_{\Omega}v\Delta u\,dx\,dy + \int_{\partial \Omega}v\frac{\partial u}{\partial\vec{n}}\,ds
$$
可知
$$
j'(0) = -\int_{\Omega}\left(\nabla\cdot \left(\frac{1}{\sqrt{1+u_x^2+u_y^2}}\nabla u\right)\right)v\,dx\,dy + \int_{\partial \Omega}\frac{v}{\sqrt{1+u_x^2+u_y^2}}\frac{\partial u}{\partial \vec{n}}\, ds=0
$$
由于 $v|_{\partial \Omega} = 0$（上式右侧第二项为 $0$），且 $u\in C^2(\bar{\Omega})$（上式右侧第一项积分内为 $0$）可得
$$
\nabla\cdot \left(\frac{1}{\sqrt{1+u_x^2+u_y^2}}\nabla u\right)=\frac{\partial}{\partial x}\left(\frac{u_x}{\sqrt{1+u_x^2+u_y^2}}\right)+\frac{\partial}{\partial y}\left(\frac{u_y}{\sqrt{1+u_x^2+u_y^2}}\right) = 0
$$

#### Euelr方程
将上式和问题的条件称为该变分问题$(1)$的**Euler方程**
$$
\begin{cases}
 \displaystyle \nabla\cdot \left(\frac{1}{\sqrt{1+u_x^2+u_y^2}}\nabla u\right)=\frac{\partial}{\partial x}\left(\frac{u_x}{\sqrt{1+u_x^2+u_y^2}}\right)+\frac{\partial}{\partial y}\left(\frac{u_y}{\sqrt{1+u_x^2+u_y^2}}\right) = 0,\\
u(x,y)|_{\partial \Omega} = \varphi(x, y).
\end{cases}
$$

---

上述推导为必要性条件，充分性需考虑 $j''(\varepsilon)$，由于
$$
j''(\varepsilon) = \int_{\Omega}\frac{v_x^2+v_y^2+((u_y+\varepsilon v_y)^2v_x-(u_x+\varepsilon v_x)^2v_y)}{(1+(u_x+\varepsilon v_x)^2+(u_y+\varepsilon u_y)^2)^{3/2}} > 0
$$
则 $j'(0)=0$ 即变分问题$(1)$的充分条件.
