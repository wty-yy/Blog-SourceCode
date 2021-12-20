---
title: Cesàro和 Fejér积分
hide: false
math: true
abbrlink: 9996
date: 2021-12-14 21:30:26
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
---

上周我们证明了 $f:\mathbb R\rightarrow \mathbb R$，周期为 $2\pi$，且$f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$，$f(x_0^+),f(x_0^-)$ 存在，若 $f$ 在 $x_0$ 处满足 $Lipschitz$ 条件，则 
$$
f_n(x_0)\rightarrow \dfrac{f(x_0^+)+f(x_0^-)}{2}
$$

这周我们证明 $Fejér$ 定理，如果 $f$ 的 $Fourier$ 级数在 $x_0$ 处收敛，则一定收敛于 $f(x_0)$，证明 $Fejér$ 定理前先要引入 $Cesàro$ 和。

## 定义1（Cesàro和）

设 $\{a_n\}$ 为数项级数，$S_n = \sum\limits_{i=1}^na_i$ 为该级数的部分和，记

$$
\sigma_{n}=\frac{1}{n}(S_1+S_2+\cdots+S_n)
$$

称 $\sigma_n$ 为级数 $\sum\limits_{k=1}^{\infty}a_k$ 的 $Cesàro$ 和。

## 命题2（Cesàro和收敛于该级数）

如果 $\sum\limits_{k=1}^{\infty}a_k$ 收敛，则 $\{\sigma_n\}$ 收敛，且

$$
\lim_{n\rightarrow \infty}\sigma_n= \sum_{i=1}^{\infty}a_k
$$

---

**证明**： 由 $Stolz$ 定理知

$$
\lim_{n\rightarrow \infty}\sigma_n =\lim_{n\rightarrow \infty}\frac{S_1+\cdots+S_n}{n}= \lim_{n\rightarrow \infty}\frac{S_n}{n - (n-1)} = \lim_{n\rightarrow \infty}S_n = \sum_{k=1}^{\infty} a_k
$$

**注**： 逆命题不成立，令 $a_n = (-1)^{n-1}$，则 $\sum a_n = 1-1+1-1+\cdots$，则

$$
S_n=\begin{cases}
0,&n=2k\\
1,&n=2k-1
\end{cases}
\quad \sigma_n=\begin{cases}
\frac{1}{2},&n=2k\\
\frac{k}{2k-1}\rightarrow\frac{1}{2},&n=2k-1
\end{cases}
$$

## 命题3（一个三角级数恒等式）

$$
\sum_{k=0}^{n-1}\sin(k+\frac{1}{2})t = \frac{\sin^2\frac{n}{2}t}{\sin\frac{1}{2}t}
$$

---

**证明**： （方法一，积化和差）

当 $t\neq 2m\pi$ 时，

$$
\begin{aligned}
\sin\frac{1}{2}t\sum_{k=0}^{n-1}\sin(k+\frac{1}{2})t=&\ \frac{1}{2}\sum_{k=0}^{n-1}(\cos kt-\cos(k+1)t)\\
=&\ \frac{1}{2}(1-\cos nt)\\
=&\ \frac{1}{2}(1-(1-2\sin^2\frac{n}{2}t))\\
=&\ \sin^2\frac{n}{2}t

\end{aligned}
$$

当 $t = 2m\pi$ 时，

$$
\text{右式} = \lim_{t\rightarrow 2m\pi}\frac{\sin^2\frac{n}{2}t}{\sin\frac{1}{2}t}=\lim_{t\rightarrow 0}\frac{(\frac{n}{2}t)^2}{\frac{1}{2}t} = 0 = \text{左式}
$$

（方法二，复指数求和）

由于 $\sin x = i\dfrac{e^{-ix}-e^{ix}}{2}$，则

$$
\begin{aligned}
\sum_{k=0}^{n-1}\sin(k+\frac{1}{2})t=&\ \sum_{k=0}^{n-1}i\frac{e^{-i(k+\frac{1}{2})t}-e^{i(k+\frac{1}{2})t}}{2}\\
=&\ \frac{i}{2}\left(e^{-\frac{i}{2}t}\sum_{k=0}^{n-1}e^{-ikt}-e^{\frac{i}{2}t}\sum_{k=0}^{n-1}e^{ikt}\right)\\
=&\ \frac{i}{2}\left(e^{-\frac{i}{2}t}\frac{1-e^{-int}}{1-e^{-it}}-e^{\frac{i}{2}t}\frac{1-e^{int}}{1-e^{it}}\right)\\
=&\ \frac{i}{2}\cdot\frac{2-e^{-int}-e^{int}}{e^{\frac{i}{2}t}-e^{-\frac{i}{2}t}}\\
=&\ \frac{i}{2}\cdot\frac{2-2\cos nt}{i\cdot 2\sin\frac{t}{2}}\\
=&\ \frac{1-\cos nt}{2\sin\frac{t}{2}}\\
=&\ \frac{2\sin^2\frac{n}{2}t}{2\sin\frac{t}{2}}\\
=&\ \frac{\sin^2\frac{n}{2}t}{\sin\frac{t}{2}}
\end{aligned}
$$

## 计算Fourier级数的Cesàro和

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期，且 $f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$，则

$$
f_n(x)=\int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}D_n(t)\,dt
$$

其中 $D_n(t)=\dfrac{\sin(n+\frac{1}{2})t}{\pi\sin(\frac{1}{2}t)}$

$$
\sigma_n(x) = \frac{1}{n}\sum_{k=0}^{n-1}f_k = \int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}\cdot \frac{1}{n}\sum_{k=0}^{n-1}D_n(t)\,dt
$$

并如下定义 $E_n(t)$

$$
\frac{1}{n}\sum_{k=0}^{n-1}D_k(t)=\frac{1}{n}\sum_{k=0}^{n-1}\frac{\sin(k+\frac{1}{2})t}{\pi\sin\frac{1}{2}t}=\frac{\sin^2\frac{n}{2}t}{n\pi\sin^2\frac{1}{2}t}=:E_n(t)
$$

则 $Fourier$ 级数的 $Cesàro$ 和为

$$
\sigma_n = \int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}E_n(t)\,dt
$$

## 命题4（En的性质）

(1). $E_n\geqslant 0$

(2). $E_n\in C^{\infty}$, $\int_0^{\pi}E_n = 1$

(3). 
$$
\begin{aligned}
&E_n(0)=\frac{n}{\pi}\Rightarrow \lim_{n\rightarrow \infty}E_n(0) = +\infty\\
&E_n(t) \leqslant \frac{C}{n\delta^2}\quad (0 < \delta \leqslant t < \pi)
\end{aligned}
$$

---

**证明**： (1). 通过定义式即可看出。

(2). 由于 $D_n$ 可以写成[三角级数求和形式](/posts/41316/#命题4一个三角求和恒等式)，所以 $D_n\in C^{\infty}$，则 $E_n\in C^{\infty}$

(3). 设 $0 < \delta\leqslant t < \pi$，$\sin x\geqslant \dfrac{2}{\pi}x$，由 $\sin x$ 在 $[0,\dfrac{\pi}{2}]$ 上的图像可以看出。

$$
E_n(t)\leqslant \frac{1}{n\pi\sin^2\frac{1}{2}\delta}\leqslant \frac{\pi}{n\delta^2}
$$

## 定理5（Fejér）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，$f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$，设 $x\in\mathbb R$，$f(x^+),f(x^-)$ 存在，若 $f$ 的 $Fourier$ 级数在 $x$ 点收敛，则 $f$ 的 $Fourier$ 级数在 $x$ 点一定等于 $\dfrac{f(x^+)+f(x^-)}{2}$

---

**证明**： 要证 $f$ 的 $Fourier$级数收敛于 $\dfrac{f(x^+)+f(x^-)}{2}$，只需证 $f$ 的 $Fourier$ 级数的 $Cesàro$ 和收敛于 $\dfrac{f(x^+)+f(x^-)}{2}$，于是对 $\sigma_n(x)$ 与 $\dfrac{f(x^+)+f(x^-)}{2}$ 进行估计，则

$$
\begin{aligned}
\left|\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right| =&\ \left|\int_0^{\pi}\dfrac{f(x+t)+f(x-t)}{2}E_n(t)\,dt-\dfrac{f(x^+)+f(x^-)}{2}\right|\\
=&\ \left|\int_0^{\pi}\frac{f(x+t)-f(x^+)+f(x-t)-f(x^-)}{2}E_n(t)\,dt\right|
\end{aligned}
$$

令 $0 < \delta \leqslant 1 < \pi$，由于 $E_n(t)$ 在 $[\delta, \pi]$ 当 $n\rightarrow \infty$ 时，趋于 $0$，在 $[0,\delta]$ 中左侧分式在 $\delta\rightarrow 0$ 时，趋于 $0$，于是将积分域分成两部分分别估计

$$
\begin{aligned}
&\ \left|\int_0^{\delta}\frac{f(x+t)-f(x^+)+f(x-t)-f(x^-)}{2}E_n(t)\,dt\right|\\
\leqslant&\int_0^{\delta}|f(x+t)-f(x^+)+f(x-t)-f(x^-)|\,dt\cdot\int_0^{\pi}E_n(t)\,dt\\
\leqslant&\int_0^{\delta}(|f(x+t)-f(x^+)|+|f(x-t)-f(x^-)|)\,dt&(E_n\text{的性质2})\\
\leqslant&\sup_{0 < t \leqslant \delta}|f(x+t)-f(x^+)|+\sup_{0 < t \leqslant\delta}|f(x-t)-f(x^-)|&(\delta\leqslant 1)
\end{aligned}
$$

$$
\begin{aligned}
&\ \left|\int_{\delta}^{\pi}\frac{f(x+t)-f(x^+)+f(x-t)-f(x^-)}{2}E_n(t)\,dt\right|\\
\leqslant&\int_{\delta}^{\pi}|f(x+t)-f(x^+)+f(x-t)-f(x^-)|\,dt\cdot\int_{\delta}^{\pi}|E_n(t)|\,dt\\
\leqslant&\left(2\int_{-\pi}^{\pi}f(t)\,dt+\pi|f(x^+)|+\pi|f(x^-)|\right)\cdot \frac{C}{\pi\delta^2}&(f(x)\text{的周期性},E_n\text{的性质3})\\
\leqslant&\ \frac{CM}{\pi}{\delta^2}
\end{aligned}
$$

则

$$
\left |\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right|\leqslant \frac{CM}{\pi\delta^2}+ \sup_{0 < t \leqslant \delta}|f(x+t)-f(x^+)|+\sup_{0 < t \leqslant\delta}|f(x-t)-f(x^-)|
$$

取上极限

$$
\mathop{\overline{\lim}}\limits_{n\rightarrow \infty}\left |\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right|\leqslant \sup_{0 < t \leqslant \delta}|f(x+t)-f(x^+)|+\sup_{0 < t \leqslant\delta}|f(x-t)-f(x^-)|
$$

令 $\delta\rightarrow 0$，则

$$
0\leqslant\mathop{\underline{\lim}}\limits_{n\rightarrow \infty}\left |\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right|\leqslant \mathop{\overline{\lim}}\limits_{n\rightarrow \infty}\left |\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right|\leqslant 0
$$

故 

$$
\lim_{n\rightarrow \infty}\left |\sigma_n(x)-\dfrac{f(x^+)+f(x^-)}{2}\right| = 0
$$
