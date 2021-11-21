---
title: 第二型曲线积分 Green公式
hide: false
math: true
category:
  - Math
  - 数学分析
abbrlink: 51465
date: 2021-10-30 15:08:26
index_img:
banner_img:
tags:
---

第七周定义了第二型曲线积分（物理含义是变力做功）及其计算方法，$Green$ 公式定义基本完成。

## 第二型曲线积分

设 $\mathop{AB}\limits^{-\rightarrow}$ 为 $n$ 维空间中的向量，则称它的单位向量为

$$
\widehat{\mathop{AB}\limits^{\rightarrow}}=\frac{\mathop{AB}\limits^{-\rightarrow}}{|\mathop{AB}\limits^{-\rightarrow}|}
$$

称 $\vec{F}:A\subset \mathbb R^n\rightarrow \mathbb R^n$ 为向量场（类似于物理中的重力场，磁场）。

设 $C\subset \mathbb R^n$ 是光滑曲线，$\vec{\tau}:C\rightarrow \mathbb R^n,\ |\vec{\tau}| = 1$，$\vec{\tau}(P)$ 为 $C$ 在 $P$ 处的单位切向量，则称 $\vec{\tau}$ 为 $C$ 的单位切向量场。

### 定义1（定向）

如果 $\vec{\tau}$ 是 $C$ 的**连续**的**单位切向量场**，则称 $\vec{\tau}$ 是 $C$ 的一个**定向**。

---

因为 $C$ 上每一点的切向量都有**两个**方向，**连续性**要求不能两个相邻点方向是完全相反的，也就是说一个领域中的点都是指向一个方向的。

### 命题2（定向只有两个）

设 $C\subset \mathbb R^n$ 为光滑曲线，则 $C$ 有且仅有两个定向。

---

**思路：** 使用 $C$ 的参数表达式，构造出两个定向，注意定义域是否一样（一个是参数，一个是坐标），使用内积和函数的连续性证明唯二性。

**证明：** 

1. 存在性，设 $\alpha:[a, b]\rightarrow C$ 为 $C$ 的参数方程，则 $C$ 有两个定向，分别是：$\vec{\tau} = \widehat{\alpha'}\circ\alpha^{-1}$，$-\vec{\tau}$。

2. 唯二性，设 $\vec{\lambda}$ 也是 $C$ 的定向，则 $\forall P\in C$，对两个定向 $\vec{\lambda}, \vec{\tau}$ 在 $P$ 点处做内积，有

$$
\begin{aligned}
(\vec{\lambda}\cdot\vec{\tau})(P) = \pm 1\mathop{=======\Rightarrow}\limits_{\text{则 }\vec{\lambda}\cdot\vec{\tau}\text{ 也是连续的}}^{\text{由于 }\vec{\lambda},\vec{\tau}\text{ 都是连续的}}\vec{\lambda}\cdot\vec{\tau}\equiv 1\text{ 或 }\vec{\lambda}\cdot\vec{\tau}\equiv -1
\end{aligned}
$$

### 命题3（定向曲线）

设 $\vec{\tau}$ 是 $C$ 的一个定向，称 $\{C,\vec{\tau}\}$ 是一个**定向曲线**。

简记为 $C$，$C$ 是一个定向曲线，$\vec{\tau}$ 为 $C$ 的正向，如果是负向则记为 $-C = \{C, -\vec{\tau}\}$。

---

### 定义4（第二型曲线积分）

设 $C\subset \mathbb R^n$ 为定向曲线，$\vec{\tau}$ 为 $C$ 的正向，设 $\vec{F}:C\rightarrow \mathbb R^n$，

设 $\alpha : [a, b]\rightarrow C$ 是 $C$ 的参数方程，$\vec{\tau} = \widehat{\alpha'}\circ\alpha^{-1}$，方向为 $\alpha$ 参数增加的方向。

取 $[a, b]$ 的一个分划 $\pi : a =t_0 < t_1 < \cdots < t_N = b$，考虑和式：

$$
S = \sum_{i=1}^N\vec{F}(\xi_i)\cdot\vec{\tau}(\xi_i)L(C_i)
$$

其中 $C_i = \alpha([t_{i-1}, t_i]),\ \xi_i\in C_i$。

如果存在 $I\in \mathbb R$，使得 $\forall \varepsilon > 0$，有 $|I - S| \leqslant \varepsilon$，则称极限 $\lim\limits_{\Delta\pi\rightarrow 0}S$ 存在，且 $\lim\limits_{\Delta\pi\rightarrow 0} S  = I$。

如果 $\lim\limits_{\Delta\pi\rightarrow 0} S$ 存在，定义

$$
\int_C\vec{F}\cdot d\vec{s} = \lim_{\Delta\pi\rightarrow 0} S
$$

称为向量场 $\vec{F}$ 沿定向曲线 $C$ 的积分。

### 定理5（性质及计算方法）

设 $C\subset \mathbb R^n$ 为定向曲线，$\vec{\tau}$ 为 $C$ 的正向，$\alpha:[a, b]\rightarrow C$ 为 $C$ 的参数方程，且 $C$ 的正向是 $\alpha$ 参数增加的方向，设 $\vec{F},\vec{G}:C\rightarrow \mathbb R^n$ 连续，则

1. $\displaystyle \int_C\vec{F}\cdot d\vec{s} = \int_C\vec{F}\cdot\vec{\tau}\,ds$（转化为第一型曲线积分）

2. $\displaystyle \int_C\vec{F}\cdot d\vec{s} = \int_a^b\vec{F}(\alpha(t))\cdot\alpha'(t)\,dt$

3. 设 $k, l\in \mathbb R$，则 $\displaystyle \int_C\{k\vec{F} + l\vec{G}\}\cdot d\vec{s} = k\int_C\vec{F}\cdot d\vec{s}+l\int_C\vec{G}\cdot d\vec{s}$（线性性）

4. $\displaystyle \int_{-C}\vec{F}\cdot d\vec{s} = -\int_C\vec{F}\cdot d\vec{s}$

---

**思路：** $①$ 通过第一型曲线积分的和形式即可转化为第二型曲线积分的和形式。

$②$ 通过 $\vec{\tau}$ 的参数化表达式，转化为参数形式，转化为一维积分形式以后，利用一维积分的性质，$③④$ 就不难证明了。

**证明：** （就证明 $②$ 吧）

$$
\begin{aligned}
\int_C\vec{F}\cdot d\vec{s} = \int_C\vec{F}\cdot \vec{\tau}\,ds &= \int_C\vec{F}\cdot (\frac{\alpha'}{|\alpha'|}\circ\alpha^{-1})\,ds\\
&= \int_a^b\vec{F}(\alpha(t))\cdot\frac{\alpha'}{|\alpha'|}(t)\cdot|\alpha'(t)|\,dt\\
&= \int_a^b\vec{F}(\alpha(t))\cdot\alpha'(t)\,dt
\end{aligned}
$$

---

对于 $d\vec{s}$ 的理解：

$$
\begin{aligned}
d\vec{s} &= \vec{\tau}\,ds &\vec{\tau}:\text{曲线切线方向},ds:\text{弧长的微分}\\
&= \alpha'(t)\,dt &\text{位移=速度}\times\text{时间}
\end{aligned}
$$

---

更加一般的，在具体的坐标系中计算第二型曲线积分：

设 $OX$ 为直角坐标系，$x=(x_1,x_2,\cdots, x_n)$，记 $d\vec{s} = (dx_1,dx_2,\cdots,dx_n)$。

向量场 $\vec{F} = (F_1(x), F_2(x),\cdots, F_n(x))$，则

$$
\int_C\vec{F}\cdot d\vec{s} = \int_CF_1(x)\,dx_1+\cdots+F_n(x)\,dx_n
$$

光滑曲线 $C$ 的参数方程 $\alpha(t) = (x_1(t),x_2(t),\cdots,x_n(t)) = x(t)$，则

$$
\begin{aligned}
\int_CF_1(x)\,dx_1+\cdots+F_n(x)\,dx_n &= \int_a^b\vec{F}(\alpha(t))\cdot\vec{\alpha}'(t)\,dt \\
&= \int_a^b(F_1(x(t))x_1'(t)+\cdots+F_n(x(t))x_n'(t))\,dt\\
\end{aligned}
$$

从形式上看，就像是做了变量代换 $dx_1(t) = x_1'(t)\,dt$。

### 定义6（分段光滑曲线的第二型曲线积分）

设 $C = \bigcup\limits_{i=1}^NC_i$，$C_i$ 为定向曲线，$C_i$ 内部互不相交，$F:C\rightarrow \mathbb R^n$ 连续，则

$$
\int_C\vec{F}\cdot d\vec{s} = \sum_{i=1}^n\int_{C_i}\vec{F}\cdot d\vec{s}
$$

$C$ 分段光滑，设 $\alpha:[a, b]\rightarrow C$ 为 $C$ 的参数方程，设 $\vec{F}:C\rightarrow \mathbb R^n$ 连续，$C = C_1+C_2+\cdots+C_N$，且 $C_i$ 的正向都是 $\alpha$ 的参数增加的方向，则

$$
\int_C\vec{F}\cdot d\vec{s} = \int_a^b\vec{F}(\alpha(t))\cdot\vec{\alpha}'(t)\,dt
$$

### 例一

$\Gamma = \{(x, y, z)\in \mathbb R^3:x^2+y^2+z^2 = a^2, x+y+z = 0\}$，$\Gamma$ 的正向为逆时针方向。

求：(1). $\displaystyle \int_\Gamma x\,dx+y\,dy+z\,dz$，(2). $\displaystyle \int_\Gamma z\,dx+x\,dy+y\,dz$。

---

**思路：** 该题要结合图形解决，(1). $(x, y, z)$ 和 $\vec{\tau}$ 正交，所以 $\int_\Gamma (x, y, z)\cdot \vec{\tau}\,dt = \int_\Gamma 0\,dt = 0$。

(2). 利用外积（叉乘）求出 $\vec{\tau} = \frac{1}{\sqrt{3}a}(1,1,1)\times(x, y, z)$，代入 $\int_\Gamma(z, x, y)\cdot\vec{\tau}\,ds$，使用混合积和 $xy+xz+yz = \frac{1}{2}((x+y+z)^2-x^2-y^2-z^2) = -\frac{a^2}{2}$，即可计算出结果为 $\sqrt{3}\pi a^2$。

参考作图：

![例一](https://img10.360buyimg.com/ddimg/jfs/t1/213002/9/2467/133525/617d34faE7f75bbc1/19bc2dc78bbbf09e.png)

P.S. 这道题还有 $Stokes$ 公式的做法，详见 [Stokes 公式 - 例一](/posts/34494/#例一-2)。

## Green公式

### 定义1（某点处光滑，单位外法向量）

设 $\Omega\subset \mathbb R^n$ 为开集，$P\in \partial \Omega$，如果 $\exists P$ 的领域 $U$，
开集 $D\subset \mathbb R^{n-1}$，$f:D\rightarrow \mathbb R,\ f\in C^k,\ (1\leqslant k\leqslant +\infty)$，使得在**适当的坐标系下**，
有 $P = (x_0, f(x_0)),\ x_0\in D$，且

$$
\begin{aligned}
\partial\Omega\cap U &= \{(x, y):x\in D, y = f(x)\}\\
\Omega\cap U&=\{(x, y):x\in D, y > f(x)\}\cap U
\end{aligned}
$$

则称 $\partial \Omega$ 在 $P$ 点为 $C^k-\text{光滑}$ （简称**光滑**），与 $f$ 的光滑性一致。

在 $x_0$ 处的**单位外法向量**（也成单位外法向）：$\vec{n} = \dfrac{(\nabla f(x_0), -1)}{\sqrt{1+|\nabla f(x_0)|^2}}$，其中 $\nabla f(x_0)$ 为 $f$ 在 $x_0$ 处的梯度。

内法向量就是 $\vec{n} = \dfrac{(-\nabla f(x_0), 1)}{\sqrt{1+|\nabla f(x_0)|^2}}$，推导方法：

设 $P = (x_0,f(x_0))$，则在该坐标系下 $P$ 点的切线方程为
$$
l:0 = f(x_0)+\triangledown f(x_0)(x-x_0)-y
$$

取 $(x_1,y_1),(x_2,y_2)\in l$，则
$$
\left.\begin{aligned}
0=&\ f(x_0)+\triangledown f(x_0)(x_1-x_0)-y_1\\
0=&\ f(x_0)+\triangledown f(x_0)(x_2-x_0)-y_2\\
\end{aligned}\right\}\Rightarrow
(\triangledown f(x_0), -1)\cdot(x_1-x_2,y_1-y_2)=0
$$

看最后一个变量，$-1$ 则方向向下，是外法向，反之 $(-\triangledown f(x_0),1)$ 则是内法向。

![单位外法向量场](https://img14.360buyimg.com/ddimg/jfs/t1/212661/30/2483/74198/617d2d99Ebcd19f2f/15d30f9c98bb5f68.png)

---

利用第一维的函数图像来刻画一个点附近的曲线图像，则该点的光滑性就可以用该函数的光滑性来表示。

### 定义2（平面分段光滑）

设 $\Omega\subset \mathbb R^2$ 为有界区域，$\partial \Omega$ 为有限条内部互不相交的分段光滑的闭曲线，设 $\partial \Omega = \bigcup\limits_{i=1}^NC_i$，$C_i$ 满足：

1. $C_i$ 为光滑曲线。

2. $C_i$ 的内部 $C_i^\circ$ 互不相交。

3. $\forall p\in C_i^\circ$，有 $\partial \Omega$ 在 $P$ 点光滑。

则称 $\partial \Omega$ 分段光滑。

### 定义3（平面边界的单位内外法向量场，正向）

设 $\Omega\subset \mathbb R^2$ 为有界区域，$\partial \Omega$ 分段光滑，$\forall P\in\partial \Omega$，$\partial\Omega$ 在 $P$ 点光滑，则称 $\partial\Omega$ 光滑。

$\vec{n}=\partial \Omega\rightarrow \mathbb R^2$，$\vec{n}(P)$ 为 $\partial \Omega$ 在 $P$ 的单位外法向，称为 $\partial\Omega$ 的单位外法向（连续）。

设 $\Omega\subset \mathbb R^2$ 为有界区域，$\partial\Omega$ 分段光滑，$\partial \Omega=\bigcup\limits_{i=1}^NC_i$。

设 $\vec{\tau}$ 为 $C_i$ 的一个定向，$P\in C_i^\circ$，则 

$$
\begin{aligned}
\vec{\tau}(P) &= (-n_2(P), n_1(P)),\ \vec{\tau} = (-n_2, n_1),\ \text{逆时针}\\
\vec{\tau}(P) &= (n_2(P), -n_1(P)),\ \vec{\tau} = (n_2, -n_1),\ \text{顺时针}
\end{aligned}
$$

称 $\vec{\tau} = (-n_2, n_1)$ 为 $C_i$ 的正向。

### 定理4（Green公式）

设 $\Omega\subset\mathbb R^2$ 为有界区域，$\partial \Omega$ 分段光滑，设 $P, Q\in C^1(\bar{\Omega})$，则

$$
\int_{\partial\Omega}P\,dx+Q\,dy = \int_{\Omega}\left\{\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right\}\,dxdy
$$

---

证明留到下个 [note](/posts/64854) 了。
