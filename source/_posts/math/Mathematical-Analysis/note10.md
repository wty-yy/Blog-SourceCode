---
title: Fourier 级数入门
hide: false
math: true
category:
  - Math
  - 数学分析
tags:
  - Fourier
abbrlink: 35053
date: 2021-11-26 23:07:46
index_img:
banner_img:
---

第十一周考了期中，感觉裂开（我tcl；任何周期为 $2\pi$ 的函数都可以表示为傅里叶级数（一种三角级数），然后就可以将难以积分、求导的函数变化为易于积分的三角级数。

### 定义1（三角级数）

设 $a_k\in \mathbb R,\ k=0,1,\cdots,\ b_k\in\mathbb R,\ k=1,2,\cdots$ 称级数

$$
\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

为三角级数。

---

由 $Euler$ 公式知，$e^{i\theta} = \cos \theta+i\sin\theta$，则

$$
\begin{aligned}
\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx) = &\ \frac{a_0}{2}e^{i\cdot 0x}+\sum_{k=1}^{+\infty}\left(a_k\frac{e^{ikx}+e^{-ikx}}{2}+ib_k\frac{e^{-ikx}-e^{ikx}}{2}\right)\\
= &\ \frac{a_0}{2}e^{i\cdot 0x}+\sum_{k=1}^{+\infty}\frac{a_k-ib_k}{2}e^{ikx}+\sum_{k=1}^{+\infty}\frac{a_k+ib_k}{2}e^{-ikx}
\end{aligned}
$$

所以，三角级数还可以表示为幂指数的形式。

### 定义2（f可展开三角级数）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期的函数，如果 $\exists a_k, \ k=0,1,\cdots,\ b_k,\ k = 1, 2, \cdots$，使得级数
$$
\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

收敛，并且

$$
f=\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

则称 $F$ 可展成三角级数。

---

为了证明所有的以 $2\pi$ 为周期的函数都能表示为三角级数的形式，所以先对这些系数进行一个推导，然后在进行详细的证明，确定了这些系数后的三角函数就成为 $Fourier$ 级数。

下面先对 $f$ 进行限制，以助于下面的**不严谨**推导。

设 $f:[a,b]\rightarrow \mathbb R$，如果 $f$ $Riemann$ 可积或者 $f$ 有有限个奇点，$f$ 绝对收敛（可积），则称 $f$ 可积或者 $f$ 绝对可积，记 $f\in L^1([a,b])$（这里 $L$ 指的是 $Lebesgue$ 可积）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期，$f\biggl|_{[-\pi,\pi]}$ 是可积或绝对可积，设 

$$
f=\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

下面对 $a_0,a_k,b_k$ 的取值进行推导（形式推导）：（先计算几个积分）

$$
\begin{aligned}
&\int_{-\pi}^{\pi}\sin kx\,dx = \int_{-\pi}^{\pi}\cos kx\,dx = 0&k = 1, 2,\cdots\\
&\int_{-\pi}^{\pi}\sin kx\cos mx\,dx = 0\\
&\int_{-\pi}^{\pi}\sin^2kx\,dx = \int_{-\pi}^{\pi}\cos^2kx\,dx = \pi&k = 1, 2,\cdots\\
&\int_{-\pi}^{\pi}\cos kx\cos mx\,dx = \int_{-\pi}^{\pi}\sin kx\sin mx\,dx = 0& k,m\neq 0
\end{aligned}
$$

第四条可以理解为一组基的**正交性**。

$$
\begin{aligned}
&\int_{-\pi}^{\pi}f = \pi a_0\Rightarrow a_0 = \frac{1}{\pi}\int_{-\pi}^{\pi}f\,dx\\
&\int_{-\pi}^{\pi}f(x)\cos nx\,dx = \int_{-\pi}^{\pi}a_n\cos^2nx\,dx = \pi a_n\Rightarrow a_n = \int_{-\pi}^{\pi}f(x)\cos nx\,dx\\
&\text{同理可得，} b_n = \frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin nx \,dx\\
\end{aligned}
$$

### 定义3（$Fourier$ 级数）

设 $f:\mathbb  R\rightarrow \mathbb R$ 为 $2\pi$ 为周期，$f\biggl|_{[-\pi,\pi]}\in L^1([a,b])$，定义

$$
\begin{aligned}
&a_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx \,dx &k=0,1,2,\cdots\\
&b_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx \,dx &k=1,2,\cdots
\end{aligned}
$$

称级数

$$
\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

为 $Fourier$ 级数，称 $a_k,\ k = 0, 1, 2,\cdots,\ b_k,\ k = 1, 2,\cdots$ 为 $f$ 的 $Fourier$ 系数，并记

$$
f\sim\frac{a_0}{2}+\sum_{k=1}^{+\infty}(a_k\cos kx+b_k\sin kx)
$$

---

### 例一

$f(x):\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，$f(x) = \cos \alpha x,\ x \in [-\pi,\pi],\ \alpha \notin\mathbb Z$，则

$$
\begin{aligned}
a_k =&\ \frac{2}{\pi}\int^{\pi}_0f(x)\cos kx\,dx = \frac{1}{\pi}\int_{0}^{\pi}\{\cos(\alpha+k)x+\cos(\alpha -k)x\}\,dx\\
=&\ \frac{1}{\pi}\left\{\frac{\sin(\alpha+k)\pi}{\alpha + k}+\frac{\sin(\alpha - k)\pi}{\alpha -k}\right\}=\frac{1}{\pi}\left(\frac{\sin\alpha\pi}{\alpha+k}+\frac{\sin\alpha\pi}{\alpha -k}\right)(-1)^k\\
=&\ \frac{2\alpha(-1)^k\sin\alpha\pi}{\pi(\alpha^2-k^2)}\\
b_k =&\ \frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx\,dx = \frac{1}{\pi}\int_{-\pi}^{\pi}\cos \alpha x\sin kx\,dx=0
\end{aligned}
$$
