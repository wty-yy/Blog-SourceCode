---
title: Lipschitz 判别法
hide: false
math: true
abbrlink: 50687
date: 2021-12-08 10:40:20
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - 积分
---

## 定义1（Lipschitz 条件）

设 $f:(a, b)\rightarrow \mathbb R$，$x_0\in (a, b)$，若

1. $f(x_0^+),\ f(x_0^-)$ 存在。

2. $\exists\ 0 < \delta < \min\{b-x_0,x_0-a\}$，$0 < \alpha < 1$，使得

$$
|f(x) - f(x_0^+)|\leqslant M|x-x_0|^{\alpha}\quad x\in(x_0,x_0+\delta)\\
|f(x) - f(x_0^-)|\leqslant M|x-x_0|^{\alpha}\quad x\in(x_0-\delta,x_0)\\
$$

其中 $M$ 为常数，称 $f$ 在 $x_0$ 满足 $Lipschitz$ 条件。

---

可以借助下图来理解 $f(x)$ 满足 $Lipschitz$ 条件。

## 定理2（Lipschitz 判别法）

设 $f:\mathbb R\rightarrow \mathbb R$ 为周期函数，$f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$，设 $x\in \mathbb R$，如果 $f$ 在 $x$ 点满足 $Lipschitz$ 条件，则 $f$ 的 $Fourier$ 级数在 $x$ 点收敛到 $\dfrac{(f(x^-)+f(x^+))}{2}$。

---

**思路**： 将 $f$ 的 [$Fourier$ 级数的部分和](/posts/41316/#推导-fourier-级数的部分和) 与结论做差估计，利用 [$Riemann - Lebesgue$ 定理](/posts/41316/#定理3riemann-lebesgue-定理)，证明极限收敛到零（正负抵消）。（“部分和的推导”和“$Riemann\ Lebesgue$的证明”为上一个 [note](/posts/41316/) 的部分）

**证明**： 

$$
\begin{aligned}
&\ f_n(x)-\frac{(f(x^-)+f(x^+))}{2}\\
=&\  \frac{1}{\pi}\int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}\cdot\frac{\sin(n+\frac{1}{2})t}{\sin\frac{1}{2}t}\,dt - \frac{f(x^+)+f(x^-)}{2}\\
=&\ \frac{1}{\pi}\int_0^{\pi}\frac{(f(x+t)-f(x^+))+(f(x-t)-f(x^-))}{2}\cdot\frac{\sin(n+\frac{1}{2})t}{\sin\frac{1}{2}t}\,dt\quad(\text{由于}\int_0^\pi D_n = 1)\\
=&\ \frac{1}{\pi}\int_0^{\pi}\frac{(f(x+t)-f(x^+))+(f(x-t)-f(x^-))}{2\sin\frac{1}{2}t}\cdot\sin(n+\frac{1}{2}t)\,dt
\end{aligned}
$$

记 $g_1(t)=\dfrac{f(x+t)-f(x^+)}{2\sin\frac{1}{2}t},\ g_2(t) = \dfrac{f(x-t)-f(x^-)}{2\sin\frac{1}{2}t}$，由于 $f$ 满足 $Lipschitz$ 条件，

（希望使用 $Riemann\ Lebesgue$ 定理，所以下面证明 $g_1(t), g_2(t)\in L^1([-\pi,\pi])$）

则 $\exists\ 0 < \delta < \dfrac{\pi}{2},\ 0 < \alpha < 1$，使得 $|f(x+t)-f(x^+)|\leqslant Mt^\alpha$，$0 < t < \delta$。

由于

$$
\int_0^{\pi}|g_1| = \int_0^{\delta}|g_1| + \int_{\delta}^{\pi}|g_1| = I_1+I_2
$$

下面分别证明 $I_1, I_2$ 存在。

$$
\begin{aligned}
I_1 = \int_0^{\delta}\frac{|f(x+t) - f(x^+)|}{2\sin\frac{t}{2}}\,dt\leqslant &\ \int_0^{\delta}\frac{Mt^{\alpha}}{2\sin\frac{t}{2}}\,dt\\
=&\ \int_0^{\delta}\frac{Mt^{\alpha}}{t}\cdot\frac{t}{2\sin\frac{t}{2}}\,dt\\
\leqslant &\ cM\int_0^1t^{\alpha-1}\,dt\\
= &\ \frac{CM}{\alpha}
\end{aligned}
$$

$$
\begin{aligned}
I_2 = \int_{\delta}^{\pi}\frac{|f(x+t)-f(x^+)|}{2\sin\frac{t}{2}}\,dt\leqslant &\ \frac{1}{2\sin\frac{\delta}{2}}\left\{\int_0^{\pi}|f(x+t)|\,dt+|f(x^+)|\pi\right\}\\
\leqslant &\ \frac{1}{2\sin\frac{\delta}{2}}\left\{\int_0^{2\pi}|f(t)|\,dt+|f(x^+)|\pi\right\}\quad (\text{周期性})\\
< &\ +\infty
\end{aligned}
$$

则 $g_1(t)\in L^1([-\pi,\pi])$，同理可证 $g_2(t)\in L^1([-\pi,\pi])$，则 $g_1(t)+g_2(t)\in L^1([-\pi,\pi])$，由 $Riemann\ Lebesgue$ 定理知，当 $n\rightarrow +\infty$ 时，有

$$
f_n(x) = \frac{f(x^+)+f(x^-)}{2}
$$

**QED**
