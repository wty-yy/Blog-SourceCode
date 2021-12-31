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

## Schwarz空间 急降函数

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

(1). $\widehat{f^{(k)}}=(2\pi i x)^k\hat{f}(x)$

(2). $\hat{f}^{(k)}(x) = \widehat{(-2\pi ix)^kf(x)}(x)$

P.S: 由此看出，$Fourier$ 变换可以将函数求导运算转化为函数与多项式的乘法运算！

---

**证明**： 

(1). 先证明 $k=1$ 的情形，由分部积分得

$$
\begin{aligned}
\widehat{f'}(x)=&\ \lim_{N\rightarrow +\infty}\int_{-N}^{N}f'(y)e^{-2\pi ixy}\,dy\\
=&\ \lim_{N\rightarrow +\infty}\left\{f(y)e^{-2\pi ixy}\biggl|_{y=-N}^{y=N}+2\pi ix\int_{-N}^{N}f(y)e^{-2\pi ixy}\,dy\right\}
\end{aligned}
$$

由于 $|f(y)|\leqslant\dfrac{C}{1+y^2}$，由比较判别法知， $\lim\limits_{N\rightarrow +\infty}f(y)e^{-2\pi ixy}\biggl|_{y=-N}^{y=N} = 0$。

则

$$
\widehat{f'}(x) = \lim_{N\rightarrow +\infty}2\pi ix\int_{-N}^{N}f(y)e^{-2\pi ixy}\,dy = 2\pi ix\hat{f}(x)
$$

由归纳法得，$\widehat{f^{(k)}}=(2\pi i x)^k\hat{f}(x)$。

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

## Fourier 反演公式

### 广义 Fubini 定理

设 $f:I\times J\rightarrow \mathbb C$，$I, J\subset \mathbb R$ 为区间（有限或者无限），且 $f\geqslant 0$ 或 $\int_{I\times J}|f| < +\infty$，则

$$
\begin{aligned}
\int_{I\times J}f(x, y)\,dx\,dy = \int_I\left\{\int_J f(x, y)\,dy\right\}\,dx = \int_J\left\{\int_I f(x, y)\,dx\right\}\,dy
\end{aligned}
$$

（《实变函数》中会进行证明）

### 定理1（Fourier 乘积公式）

设 $f, g\in S(\mathbb R)$，则 

$$
\int_{\mathbb R}\hat{f}g = \int_{\mathbb R}f\hat{g}
$$

---

**证明**： 记 $F(x, y) = f(x)g(y)e^{-2\pi ixy}$，由于

$$
\begin{aligned}
\int_{\mathbb{R}^2}|F| =&\int_{\mathbb{R}^2}|f(x)g(y)|\,dx\,dy\\
\leqslant&\int_{\mathbb{R}^2}|f(x)||g(y)|\,dx\,dy\\
\xlongequal{\text{Fubini}}&\int_{\mathbb R}|f(x)|\,dx\int_{\mathbb R}|g(y)|\,dy\\
=&||f||_1\cdot||g||_1 < +\infty
\end{aligned}
$$

则可对 $F$ 使用 $Fubini$ 定理：

$$
\begin{aligned}
\int_{\mathbb{R}^2}F =& \int_{\mathbb{R}}\left\{\int_{\mathbb R}f(x)g(y)e^{-2\pi ixy}\,dx\right\}\,dy = \int_{\mathbb R}\left\{\int_{\mathbb R}f(x)g(y)e^{-2\pi ixy}\,dy\right\}\,dx\\
=&\int_{\mathbb R}\left\{\int_{\mathbb{R}}f(x)e^{-2\pi ixy}\,dx\right\}g(y)\,dy = \int_{\mathbb R}f(x)\left\{\int_{\mathbb R}g(y)e^{-2\pi ixy}\,dy\right\}\,dx\\
=&\int_{\mathbb R}\hat{f}(y)g(y)\,dy=\int_{\mathbb R}f(x)\hat{g}(x)\,dx
\end{aligned}
$$

### 定理2（Fourier 变换反演公式）

设 $f\in S(\mathbb R)$，则 $\hat{f}\in S(\mathbb R)$，定义映射

$$
\begin{aligned}
\mathcal{F}:S(\mathbb R)&\rightarrow S(\mathbb R)\\
f(x)&\mapsto \hat{f}(x)
\end{aligned}
$$

则 $\mathcal{F}$ 为 $S(\mathbb R)$ 上的 $Fourier$ 变换，设 $\check{f}(x) = \int_{\mathbb R}f(y)e^{2\pi ixy}\,dy$，则 $\check{f}(x) = \hat{f}(x)$，由于 $\hat{f}(x)\in S(\mathbb R)$，则 $\check{f}(x)\in S(\mathbb R)$，定义映射

$$
\begin{aligned}
\mathcal{F}^*:S(\mathbb R)&\rightarrow S(\mathbb R)\\
&f(x)&\mapsto \check{f}(x)
\end{aligned}
$$

则 $\mathcal{F}^*$ 为 $\mathcal{F}$ 的逆变换，即 $\mathcal{F}^* = \mathcal{F}^{-1}$。

---

为证明 $Fourier$ 变换为 $S(\mathbb R)$ 上的变换和 $Fourier$ 反演公式，引入 $Gauss$ 函数。

### Gauss 函数

设 $G:\mathbb R\rightarrow \mathbb R$，定义为

$$
G(x) = e^{-\pi} x^2
$$

称 $G$ 为 $Gauss$ 函数（钟型函数）。

$Gauss$ 函数是重要的核函数，在 $Fourier$ 变换下有很多很好的性质，起到重要作用。

#### 性质

(1). $\int_{\mathbb R}G = 1$

(2). $G\in S(\mathbb R)$

(3). $\hat{G} = G$

---

**证明**： (1). 先证明一个重要的等式

$$
I = \int_{\mathbb R}e^{-x^2}\,dx = \sqrt{\pi}
$$
直接计算得
$$
\begin{aligned}
I^2=&\int_{-\infty}^{+\infty}e^{-x^2}\,dx\cdot\int_{-\infty}^{+\infty}e^{-y^2}\,dy\\
\xlongequal{\text{Fubini}}&\int_{\mathbb{R}^2}e^{-(x^2+y^2)}\,dx\,dy\\
\xlongequal{\text{极坐标变换}}&\int_{0}^{+\infty}\left\{\int_{\partial B_r}e^{-r^2}\,ds\right\}\,dr\\
=&\int_0^{+\infty}e^{-r^2}\left\{\int_{\partial B_r}1\,ds\right\}\,dr\\
=&\ \pi\int_0^{+\infty}2re^{-r^2}\,dr\\
=&\ \pi\int_{0}^{+\infty}e^{-r^2}\,dr^2\\
=&\ \pi\\
\Rightarrow I=&\ \sqrt{\pi}
\end{aligned}
$$

则

$$
\begin{aligned}
\int_{\mathbb R}G = \int_{\mathbb R}e^{-\pi x^2}\,dx\xlongequal{x = y/\sqrt{x}}\frac{1}{\sqrt{\pi}}\int_{\mathbb R}e^{-y^2}\,dy = \frac{1}{\sqrt{\pi}}\cdot I = 1
\end{aligned}
$$

(2). 通过 [$Schwarz$ 空间 - 例子](./#例子) 取 $a = \pi$ 即可得证。

(3). （转化为求解微分方程）

$$
\begin{aligned}
\hat{G} =& \int_{\mathbb R}e^{-\pi y^2}e^{-2\pi ixy}\,dy\\
\text{由比较判别法知，}G&\text{连续且一致收敛，则求导和积分可交换顺序}\\
\frac{d}{dx}\hat{G}=&\ \int_{\mathbb R}(-2\pi iy)e^{-\pi y^2}e^{-2\pi ixy}\,dy\\
=&\ i\int_{\mathbb R}\frac{d}{dy}(e^{-\pi y^2})e^{-2\pi ixy}\,dy\\
=&\ i\left(e^{-\pi y^2}e^{-2\pi ixy}\biggl|_{-\infty}^{+\infty}+(2\pi ix)\int_{\mathbb R}e^{-\pi y^2}e^{-2\pi ixy}\,dy\right)\\
=&\ -2\pi x\hat{G}
\end{aligned}
$$

又 $\hat{G}(0) = \int_{\mathbb R}e^{-\pi y^2}\,dy = 1$，则可转化为求解**线性微分方程初值问题**，解得

$$
\hat{G} = G
$$

---

为证明 **定理2** 还需对 $Gauss$ 函数进行伸缩变换，设 $0 < \delta < 1$，定义

$$
\begin{aligned}
G_{\delta}(x) =&\ e^{-\pi\delta x^2} & x\in \mathbb R\\
K_{\delta}(x) =&\ \delta^{-\frac{1}{2}}e^{-\pi x^2/\delta} & x\in \mathbb R
\end{aligned}
$$

$G_{\delta}$ 是对 $G$ 的 $x$ 轴拉伸 $\frac{1}{\sqrt{\delta}}$ 倍，
$K_{\delta}$ 是对 $G$ 的 $x$ 轴压缩 $\sqrt{\delta}$ 倍，$y$ 轴拉伸 $\frac{1}{\sqrt{\delta}}$ 倍，则

$$
\begin{aligned}
\int_{\mathbb R}K_{\delta}(x) =\int_{\mathbb R}\delta^{-\frac{1}{2}}e^{-\pi x^2/\delta}\,dx\xlongequal{x = \sqrt{\delta}y}\int_{\mathbb R}e^{-\pi y^2}\,dy = 1
\end{aligned}
$$

### 引理1（$G_{\delta}$ 与 $K_{\delta}$ 的关系）

$$
\widehat{G_{\delta}} = K_{\delta}
$$

---

**证明**： 直接计算可得

$$
\begin{aligned}
\widehat{G_{\delta}}(x) =& \int_{\mathbb R} e^{-\pi \delta y^2}e^{-\pi ixy}\,dy\\
\xlongequal{z=\sqrt{\delta}y}&\ \delta^{-\frac{1}{2}}\int_{\mathbb R}e^{-\pi z^2}e^{-\pi ix\delta^{-\frac{1}{2}}z}\,dz\\
=&\ \delta^{-\frac{1}{2}}\hat{G}(x/\sqrt{\delta})\\
=&\ \delta^{-\frac{1}{2}}G(x/\sqrt{\delta})\\
=&\ \delta^{-\frac{1}{2}}e^{-\pi x^2/\delta}\\
=&\ K_{\delta}(x)
\end{aligned}
$$

### 引理2（$G_{\delta}$ 与 $K_{\delta}$ 与 $f$ 的乘积的积分）

设 $f\in S(\mathbb R)$，当 $\delta\rightarrow 0^+$ 时，有

(1). $\int_{\mathbb R}G_{\delta}f\rightarrow \int_{\mathbb R}f$

(2). $\int_{\mathbb R}K_{\delta}f\rightarrow f(0)$

---

**证明**： (1). 设 $I(\delta)\int_{\mathbb R}e^{-\pi\delta x^2}f(x)\,dx$，$\delta\geqslant 0$，由比较判别法知，$I(\delta)$ 关于 $\delta$ 在 $[0,+\infty)$ 上一致收敛，则 $I\in C\left([0,+\infty)\right)$，

$$
\lim_{\delta\rightarrow 0^+}\int_{\mathbb R}G_{\delta}f = \lim_{\delta\rightarrow 0^+}I(\delta) = I(0) = \int_{\mathbb R}f
$$

(2). 

$$
\int_{\mathbb R}K_{\delta}f = \int_{\mathbb R}\delta^{-\frac{1}{2}}e^{-\pi x^2/\delta}f(x)\,dx\xlongequal{x=\sqrt{\delta}y}\int_{\mathbb R}e^{-\pi y^2}f(\sqrt{\delta}y)\,dy
$$

令 $I(\delta) = \int_{\mathbb R}e^{-\pi y^2}f(\sqrt{\delta}y)$，由于 $\left|e^{-\pi y^2}f(\sqrt{\delta}y)\right|\leqslant M\cdot e^{-pi y^2}$，由比较判别法知，$I(\delta)$ 在 $\delta$ 上一致收敛，则 $I\in C([0,+\infty))$

$$
\begin{aligned}
\lim_{\delta\rightarrow 0^+}\int_{\mathbb R}K_{\delta}f = \lim_{\delta\rightarrow 0^+}I(\delta)=I(0)=f(0)\int_{\mathbb R}e^{-\pi y^2}\,dy = f(0) \int_{\mathbb R} G = f(0)
\end{aligned}
$$

### 引理3（Fourier 反演在 $x=0$ 处的情况）

设 $f\in S(\mathbb R)$，则

$$
\int_{\mathbb R}\hat{f} = f(0)
$$

---

**证明**： 由  [定理1 - $Fourier$ 乘积公式](./#定理1fourier-乘积公式) 得，

$$
\int_{\mathbb R}G_{\delta}\hat{f} = \int_{\mathbb R}\widehat{G_{\delta}}f = \int_{\mathbb R}K_{\delta}f
$$

令 $\delta\rightarrow )$ 得

$$
\int_{\mathbb R}\hat{f} = f(0)
$$

### 引理4（Fourier 变换的平移不变性，单射）

设 $f\in S(\mathbb R)$，则

$$
\mathcal{F}^*(\hat{f})(a) = f(a)
$$

即

$$
\mathcal{F}^*(\mathcal{F}(f)) = f
$$

---

**证明**： 记 $F(x) = f(x+a)$，$x\in \mathbb R$，则 $F\in S(\mathbb R)$，

$$
\begin{aligned}
f(a) = F(0)=\int_{\mathbb R}\hat{F}=&\int_{\mathbb R}\left\{\int_{\mathbb R}f(y+a)e^{-2\pi ixy}\,dy\right\}\,dx\\
\xlongequal{z = y+a}&\int_{\mathbb R}\left\{\int_{\mathbb R}f(z)e^{-2\pi ix(z-a)}\,dz\right\}\,dx\\
=&\int_{\mathbb R}\left\{\int_{\mathbb R}f(z)e^{-2\pi ixz}\,dz\right\}e^{2\pi ixa}\,dx\\
=&\int_{\mathbb R}\hat{f}(x)e^{2\pi iax}\,dx\\
=&\ \mathcal{F}^*(\hat{f}(a))
\end{aligned}
$$

### 引理5（满射）

设 $f\in S(\mathbb R)$，则 

$$
\mathcal{F}(\mathcal{F}^*(f)) = f
$$

---

**证明**： 

$$
\begin{aligned}
\mathcal{F}(\mathcal{F}^*(f)) =&\ \mathcal{F}\left(\int_{\mathbb R}f(y)e^{2\pi ixy}\,dy\right)\\
=&\int_{\mathbb R}\left\{\int_{\mathbb R}f(y)e^{2\pi izy}\,dy\right\}e^{-2\pi ixz}\, dz\\
\xlongequal{z\rightarrow -z}&\int_{\mathbb R}\left\{\int_{\mathbb R}f(y)e^{-2\pi izy}\,dy\right\}e^{2\pi ixy}\,dz\\
=&\ \mathcal{F}^*(\mathcal{F}(f))(x) = f(x)
\end{aligned}
$$

### 证明定理2（Fourier 反演公式）

根据 **引理4** 和 **引理5** 知，$f\in S(\mathbb R)$ 则

$$
\mathcal{F}^*(\mathcal{F}(f)) = \mathcal{F}(\mathcal{F}^*(f)) = f
$$

证明 $\mathcal{F}$ 是双射：

单射：令 $\mathcal{F}(f) = \mathcal{g}$，则 

$$
\begin{aligned}
\mathcal{F}^*(\mathcal{F}(f)) =&\ \mathcal{F}^*(\mathcal{F}(g))\\
\Rightarrow \quad\quad\quad\quad f =&\ g
\end{aligned}
$$

满射：设 $f\in S(\mathbb R)$，存在 $\mathcal{F}^*(f)\in S(\mathbb R)$，使得 

$$
\mathcal{F}(\mathcal{F}^*(f)) = f
$$

综上，$\mathcal{F}^* = \mathcal{F}^{-1}$。
