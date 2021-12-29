---
title: Fourier变换 Schwarz空间
hide: false
math: true
category:
  - Math
  - 数学分析
abbrlink: 1783
date: 2021-12-29 21:10:37
index_img:
banner_img:
tags:
---

设 $f:A\subset \mathbb R\rightarrow \mathbb C$，$f$ 是实数到复数的一个映射，则 $f(x) = u(x) + i\cot v(x)$，$u, v:A\rightarrow \mathbb R$，定义

$$
\int_A f := \int_Au+i\int_Av
$$

若 $u, v\in C^k(A)$，则称 $f\in C^k(A)$。

## 定义1（1-范数）

$f:\mathbb R\rightarrow \mathbb C$，$f$ 至多有有限个奇点，若

$$
\int_{\mathbb R}|f| < +\infty
$$

则称 $f\in L^1(\mathbb R)$，记 $||f||_1=\int_{\mathbb R}|f|$ 为 $f$ 的**1-范数**。

## 定义2（2-范数）

$f:\mathbb R\rightarrow \mathbb C$，若

$$
\int_{\mathbb R}|f|^2 < +\infty
$$

则称 $f\in L^2(\mathbb R)$，记 $||f||_2=\left(\int_{\mathbb R}|f|^2\right )^{\frac{1}{2}}$ 为 $f$ 的**2-范数**。

## 定义3（Fourier变换）

设 $f\in L^1(\mathbb R)$，

$$
\hat{f}(x) = \int_{\mathbb R}f(y)e^{-2\pi ixy}\,dy\quad (x\in \mathbb R)
$$

称 $\hat{f}$ 为 $f$ 的 $Fourier$ 变换，也记为 $\hat{f} = \mathcal{F}(f)$。

---

物理应用：

设 $f:\mathbb R\rightarrow \mathbb C$ 为波函数，假设 $f = \sum_{\omega}A_{\omega}e^{2\pi i\omega x}$，$A_{\omega}\in\mathbb R$ 为对应 $\omega$ 的复振幅，则

$$
A = \hat{f}(\omega)
$$

这样就可以将复杂的波函数 $f$ 拆分为许多简单的波函数之和，相当于对其进行了分解，也就是求出了其傅里叶级数（广义下的）。

## 定义4（Fourier逆变换）

设 $f\in L^1(\mathbb R)$，

$$
\check{f}(x) = \int_{\mathbb R}f(y)e^{2\pi i xy}\,dy\quad (x\in\mathbb R)
$$

称 $\check{f}$ 为 $f$ 的 $Fourier$ 逆变换，也记为 $\check{f} = \mathcal{F}^{-1}(f)$。

## 定义（Schwarz空间 急降函数）

记 
$$
S(\mathbb R) := \{f:\mathbb R \rightarrow \mathbb C,\ f\in C^{\infty}(\mathbb R):\forall\ k, l\in \mathbb N,\  x^kf^{(l)}(x)\text{有界}\}
$$

则称 $S(\mathbb R)$ 为 $Schwarz$ 空间，若 $f\in S(\mathbb R)$，则称 $f$ 为**急降函数**。

### 例子

设 $f(x) = e^{-ax^2}$，$a > 0$，则 $f\in S(\mathbb R)$。

---

**证明**： 由于

$$
\begin{aligned}
f' =&\ -2axe^{-ax^2}\\
f'' =&\ (-2ax)^2e^{-ax^2}-2ae^{-ax^2}\\
f'''=&\ (-2ax)^3e^{-ax^2}+\cdots\\
&\vdots\\
f^{(l)} =&\ P_l(x)e^{-ax^2}&P_l(x)\text{为}l\text{次多项式}
\end{aligned}
$$

则 

$$
|x^kf^{(l)}(x)| = |P_{l+k}(x)e^{-ax^2}| \leqslant C\quad (C\text{为常数})
$$

（幂指数的阶大于多项式的阶）

### 命题1（急降函数的性质）

(1). $S(\mathbb R)$ 为线性空间。

(2). 若 $f\in S(\mathbb R)$，则 $f^{(k)}\in S(\mathbb R)$。

(3). 若 $f\in S(\mathbb R)$，$P:\mathbb R\rightarrow \mathbb C$ 为多项式，则 $P(x)f(x)\in S(\mathbb R)$。

(4). 若 $f\in S(\mathbb R)$，则 $f\in L^1(\mathbb R)$。

---

**证明**： (1).(2). 由导数的线性性和连续求导可得。

(3). 由(1)知，只需证明 $x^kf(x)\in S(\mathbb R)$，由归纳法知，只需证 $xf(x)\in S(\mathbb R)$。

由 $Leibniz$ 公式（乘积函数求导法则）知

$$
\begin{aligned}
x^k(xf(x))^{(l)} =&\ x^k\{xf^{(l)}(x)+\binom{l}{1}f^{(l-1)}(x)\}\\
=&\ x^{k+1}f^{(l)}(x)+lx^kf^{(l-1)}(x)\leqslant C
\end{aligned}
$$

因此 $x^k(xf(x))^{(l)}$ 有界，则 $xf(x)\in S(\mathbb R)$。

(4). 由于 $|f(x)|\leqslant C_1,\ |x^2f(x)|\leqslant C_2\Rightarrow |(1+x^2)f(x)|\leqslant C_1+C_2\Rightarrow |f(x)|\leqslant\dfrac{C_3}{1+x^2}$

则

$$
\int_{\mathbb R}|f|\leqslant \int_{\mathbb R}\frac{C_3}{1+x^2}\,dx = C_3\arctan x\biggl|_{-\infty}^{+\infty}=\pi C_3
$$

### 命题2（急降函数的Fourier变换的性质）

设 $f\in S(\mathbb R)$，则

(1). $\widehat{f^{(k)}}=(2\pi i x)^kf(x)$

(2). $\hat{f}^{(k)}(x) = \widehat{(-2\pi ix)^kf(x)}(x)$

---

**证明**： 

(1). 先证明 $k=1$ 的情形，由分部积分得

$$
\begin{aligned}
\widehat{f'}(x)=&\ \lim_{N\rightarrow +\infty}\int_{-N}^{N}f'(y)e^{-2\pi ixy}\,dy\\
=&\ \lim_{N\rightarrow +\infty}\left\{f(y)e^{-2\pi ixy}\biggl|_{y=-N}^{y=N}+2\pi ix\int_{-N}^{N}f(y)e^{-2\pi ixy}\,dy\right\}
\end{aligned}
$$

由于 $|f(y)|\leqslant\dfrac{C}{1+y^2}$，则 $\lim\limits_{N\rightarrow +\infty}f(y)e^{-2\pi ixy}\biggl|_{y=-N}^{y=N} = 0$。

则

$$
\widehat{f'}(x) = \lim_{N\rightarrow +\infty}2\pi ix\int_{-N}^{N}f(y)e^{-2\pi ixy}\,dy = 2\pi ix\hat{f}(x)
$$

由归纳法得，$\widehat{f^{(k)}}=(2\pi i x)^kf(x)$。

(2). 由于

$$
\hat{f}(x)=\int_{\mathbb R}f(y)e^{-2\pi ixy}\,dy\ \text{且}\ |f(y)e^{-2\pi ixy}|\leqslant|f(y)|
$$

又有 $f\in L^1(\mathbb R)$，$\int_{\mathbb R}|f|$ 收敛，则 $\int_{\mathbb R}f(y)e^{-2\pi ixy}\,dy$ 一致收敛，求导和积分可交换顺序，则

$$
\begin{aligned}
\hat{f}'(x) =&\int_{\mathbb R}(-2\pi iy)f(y)e^{-2\pi ixy}\,dy\\
=&\ \widehat{-2\pi ixf(x)}(x)
\end{aligned}
$$

由归纳法得，$\hat{f}^{(k)}(x) = \widehat{(-2\pi ix)^kf(x)}(x)$

### 定理3（Fourier变换是Schwarz空间到自身的映射）

设 $f\in S(\mathbb R)$，则 $\hat{f}\in S(\mathbb R)$。

---

**思路**： 先进行对任意一个函数进行估计（命题2），转化为另一个急降函数的 $Fourier$ 变换，利用急降函数的 $Fourier$ 变换有界（命题1），即可。

**证明**： 设 $k,l\in \mathbb N$，记 $\mathcal{F}(f) = \hat{f}(x)$，由**命题2**知，

$$
\begin{aligned}
x^k\hat{f}^{(l)}(x) =&\ x^k\mathcal{F}((-2\pi ix)^lf(x))\\
=&\ (2\pi i)^{-k}(2\pi ix)^k\mathcal{F}((-2\pi ix)^lf(x))\\
=&\ (2\pi i)^{-k}\mathcal{F}\left(\frac{d^k}{dx^k}\left((-2\pi ix)^lf(x)\right)\right)
\end{aligned}
$$

记 $F(x) = \dfrac{d^k}{dx^k}\left((-2\pi ix)^lf(x)\right)$，由**命题1**知，$F(x)$ 为急降函数属于 $L^1$，则

$$
\begin{aligned}
|\mathcal{F}(F)|\leqslant&\ \left|\int_{\mathbb R}F(y)e^{-2\pi ixy}\,dy\right|\\
\leqslant&\ \left|\int_{\mathbb{R}}F(y)\,dy\right|\\
\leqslant&\ \int_{\mathbb R}|F(y)|\,dy < +\infty
\end{aligned}
$$

则 

$$
\left|x^k\hat{f}^{(l)}(x)\right|=\left|(2\pi i)^{-k}\mathcal{F}(F)\right| < +\infty\\
\Rightarrow\hat{f}\in S(\mathbb R)
$$
