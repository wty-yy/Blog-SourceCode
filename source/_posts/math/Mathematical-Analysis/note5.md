---
title: 曲线及其长度 第一型曲线积分
hide: false
math: true
abbrlink: 30251
date: 2021-10-24 15:11:03
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - 曲线积分
---

第六周把重积分讲完了进入下一章（好像没讲广义重积分），进入学习曲线积分，先是定义较多，对定义的理解很重要，上一章的习题课还要补（）。

## （分段）光滑曲线及其长度

### 定义1（简单曲线）

设 $C\subset \mathbb R^n$，$\alpha:[a, b]\rightarrow C$，满足：

1. $\alpha$ 为双射。

2. $\alpha, \alpha^{-1}$ 连续。

则称 $C$ 为 $\mathbb R^n$ 中的**简单曲线**，称 $\alpha$ 为 $C$ 的参数方程。

设 $P\in C,\ P=\alpha(t_0)$，则称 $t_0$ 为 $P$ 的**参数或坐标**。

若 $t_0\in\{a, b\}$，则 $P$ 为**端点**，若 $a < t_0 < b$，则 $P$ 为**内点**，由内点构成的集合称为**内部**。

---

不难发现，要求双射，则 $C$ 一定不能有交点，要求连续，则 $C$ 不能有间断点。

### 定义2（光滑曲线）

设 $C\subset \mathbb R^n$，$\alpha:[a, b]\rightarrow C$，满足

1. $\alpha$ 为双射，$\alpha, \alpha^{-1}$ 连续（简单曲线）。

2. $\alpha \in C^k,\ (1\leqslant k\leqslant +\infty$（光滑性）。

3. $\alpha'(t)\neq \vec{0},\ \forall t\in[a, b]$（正则性）。

则称 $C$ 为 $C^k - \text{光滑的正则曲线}$（也称**光滑曲线**），称 $\alpha$ 为 $C$ 的参数方程。

---

光滑曲线的**正则性**能够保证**切线存在**（也就是说折线不是光滑曲线）。

令 $\alpha$ 为光滑曲线 $C$ 的参数方程，$\forall t\in[a,b ]$，则 $\alpha(t)$ 处的切向量为 $\alpha'(t)$，单位切向量为 $\tau=\dfrac{\alpha'(t)}{|\alpha'(t)|}$，$\alpha(t_0)$ 处的切线为：

$$
l = \{\alpha(t_0) + \alpha'(t_0)(t-t_0):t\in\mathbb R\}
$$

比如：$\alpha(t) = (t^2, t^3)$，$t\in[-1,1]$，$C=\alpha([-1, 1])$，图像如下：

![非光滑曲线](https://img11.360buyimg.com/ddimg/jfs/t1/212844/26/1793/34052/617511f5Ef389b5b5/4a3ff9734bc9891c.png)

$\alpha'(0) = 0$，$C$ 在 $(0, 0)$ 处并不光滑。

### 定义3（曲线长度&弧长）

设 $C\subset \mathbb R^n$ 为光滑曲线，$\alpha:[a, b]\Rightarrow C$ 为 $C$ 的参数方程，设 $\pi:a=t_0 < t_1 < \cdots < t_N = b$ 为 $[a, b]$ 的分划，记

$$
S =\sum_{i=1}^N|\mathop{\alpha(t_{i-1})\alpha(t_i)}\limits^{--------\rightarrow}|
$$

如果 $\lim\limits_{\Delta\pi\rightarrow 0}S$ 存在，记 $L(C) = \lim\limits_{\Delta\pi\rightarrow 0}S$，并称之为曲线 $C$ 的长度（弧长）。

其中 $\mathop{AB}\limits^{--\rightarrow}$ 表示：以 $A$ 为起点，$B$ 为终点的向量（不用向量减法，因为可以不用建系）。

---

形象理解这个定义，就是把曲线分成很多小段，然后求和，得到整个弧长。

$\KaTeX$ 中实在没有找到长箭头，只能用 $\mathop{\ }\limits^{--\rightarrow}$ 代替了~~

### 定理4（弧长的积分形式）

设 $C\subset \mathbb R^n$ 为光滑曲线，$\alpha:[a, b]\rightarrow C$ 为 $C$ 的参数方程，则 

$$
L(C) = \int_{a}^b|\alpha'(t)|\,dt
$$

---

**思路：** 对 $\int_a^b|\alpha'(t)|\,dt$ 展开成 $Riemann\text{和}$ 的形式，再对两式进行估计即可。

**证明：**

由于当 $\Delta\pi\rightarrow 0$ 时，$\int_a^b|\alpha'(t)|\,dt = \sum\limits_{i=1}^N|\alpha'(t_{i-1})|(t_i-t_{i-1})|$。

$$
\begin{aligned}
&\left|\sum_{i=1}^N|\mathop{\alpha(t_{i-1})\alpha(t_i)}\limits^{--------\rightarrow}|-\sum_{i=1}^N|\alpha'(t_{i-1})|(t_i-t_{i-1})\right|\\
\text{（使用两次三角不等式）}\leqslant&\sum_{i=1}^N|\mathop{\alpha(t_{i-1})\alpha(t_i)}\limits^{--------\rightarrow}-\alpha'(t_{i-1})(t_i-t_{i-1})|\\
=&\sum_{i=1}^N\left|\int_{t_{i-1}}^{t_i}\alpha'(t)\,dt-\int_{t_{i-1}}^{t_i}\alpha'(t_{i-1})\,dt\right|\\
\leqslant&\sum_{i=1}^N\int_{t_{i-1}}^{t_i}(\alpha'(t)-\alpha'(t_{i-1}))\,dt\\
\text{令}\omega(\Delta\pi)=\sup_{|t-s|\leqslant\Delta\pi}|\alpha'(t)-&\alpha'(s)|\text{，由}\alpha'\text{的一致连续性知}\omega(\Delta\pi)\rightarrow 0\\
\text{原式}\leqslant&(b-a)\cdot\pi(\Delta\pi)\rightarrow 0
\end{aligned}
$$

**QED**

于是我们就可以愉快地求圆的周长了（

#### 例一（圆的周长）

$C = \{(x, y):x^2+y^2=1, y\geqslant 0\}$，计算 $L(C)$。

**解：** $C$ 的参数方程为：$\alpha(\theta)=(\cos\theta,\sin\theta),\ \theta\in[0,\pi]$，则

$$
L(C) = \int_0^{\pi}1\,d\theta=\pi
$$

#### 例二（二维函数图像的长度）

$f\in C^1([a,b]),\ C = \text{graph } f=\{(x, f(x): x\in[a, b]\}$，求 $L(C)$。

**解：** $C$ 的参数方程为：$\alpha(x) = (x, f(x)),\ x\in[a, b]$，则

$$
L(C) = \int_a^b\sqrt{1+|f'(x)|^2}\,dx
$$

### 定义5（分段光滑曲线）

设 $C\subset \mathbb R^n$，$alpha:[a, b]\rightarrow C$ **连续**，设 $a=a_0 < a_1 < \cdots < a_N = b$，

记： $\alpha_i = \alpha\bigg|_{[a_{i-1}, a_i]},\ c_i = \alpha_i([a_{i-1}, a_i])$，若满足：

1. $C_i$ 为光滑曲线，$\alpha_i$ 为 $C_i$ 的参数方程（$i=1\sim N$）。

2. $C_i$ 内部互不相交。

则称 $C$ 为**分段光滑曲线**，$\alpha$ 为 $C$ 的参数方程，并记 $C=C_1+C_2+\cdots+C_N$。

并定义 $\alpha'(t) = \alpha_i'(t),\ t\in(a_{i-1}, a_i)$，对于 $\alpha'(a_i)$ 上的函数值可以任取，由于 $\alpha'$ 只在有限多个点处间断，所以

$$
L(C_i) = \int_{a_{i-1}}^{a_i}|\alpha_i'|\,dt=\int_{a_{i-1}}^{a_i}|\alpha'|\,dt
$$

---

由于折线可以分解成很多段光滑的曲线，所以折线就是分段光滑曲线，从而折线上的积分我们接下来也可以求解了。

### 定义6（分段光滑曲线的长度）

设 $C\subset \mathbb R^n$，$C$ 为分段光滑积分，可以分解为：$C=C_1+C_2+\cdots+C_N$，记

$$
L(C) = \sum_{i=1}^NL(C_i)
$$

### 定理7（分段光滑曲线长度的积分形式）

设 $C\subset \mathbb R^n$ 为分段光滑曲线，$\alpha:[a, b]\rightarrow C$ 为 $C$ 的参数方程，则

$$
L(C) = \int_a^b|\alpha'|\,dt
$$

---

利用一维积分的可加性即可证明。
