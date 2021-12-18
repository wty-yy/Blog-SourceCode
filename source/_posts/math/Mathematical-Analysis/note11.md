---
title: Riemann - Lebesgue 定理
hide: false
math: true
abbrlink: 41316
date: 2021-12-02 22:21:33
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - Fourier
---

## 命题1（分段常数逼近）

设 $f\in L^1([a,b])$，则 $\forall \varepsilon > 0,\ \exists g : [a, b]\rightarrow \mathbb R$，$g$ 为**分段常数**，使

$$
\int_a^b|f-g| < \varepsilon
$$

**分段常数**：存在 $[a,b]$ 的一个分划 $a=a_0\leqslant a_1\leqslant a_2\leqslant\cdots\leqslant a_N = b$，使 $g\biggl|_{(a_{i-1},a_i)} = C_i$。

---

**思路**：有 $\text{Riemann 可积}$ 容易构造出常值函数 $g$，对于绝对可积函数，在奇点处取 $0$，其他位置不变，则可以用一个 $\text{Riemann 可积}$ 函数逼近绝对可积函数，又由于 $\text{Riemann 可积}$ 函数可以被常值函数逼近，所以绝对可积函数也可被常值函数逼近。

**证明**：

$①.$ $f\ \text{Riemann 可积}$，$\forall \varepsilon > 0$，则存在 $[a,b]$ 的分划

$$
a = a_0 < a_1 < \cdots < a_N =  b
$$

使得

$$
\int_{i=1}^N\omega_i(a_i-a_{i-1}) \leqslant \frac{\varepsilon}{2}
$$

其中 $\omega_i = \sum\limits_{x,y\in[a_{i-1},a_i]}|f(x)-f(y)|$，定义 $g:[a, b]\rightarrow \mathbb R$，

$$
\begin{aligned}
g(x) =&\  f(a_{i-1}),\quad x\in [a_{i-1},a_i)\quad 1\leqslant i \leqslant N-1\\
g(x) = &\ f(a_N),\quad x\in [a_{N-1}, a_N]
\end{aligned}
$$

则有

$$
\int_a^b|f-g|=\sum_{i=1}^N\int_{a_{i-1}}^{a_i}|f-g|\leqslant \sum_{i=1}^N\int_{a_{i-1}}^{a_i}\omega_i\leqslant \frac{\varepsilon}{2}
$$

$②:$ $f$ 有有限个奇点，$c\in (a, b)$（奇点不在端点上），则 $\lim\limits_{\delta\rightarrow 0^+}\int_{c-\delta}^{c+\delta}|f|\rightarrow 0$，则存在 $\delta >0$，使得

$$
\int_{c-\delta}^{c+\delta}|f|\leqslant \frac{\varepsilon}{2}
$$

定义 $h:[a, b]\rightarrow \mathbb R$，

$$
h(x)=\begin{cases}
f(x),&x\in[a,b]\backslash[c-\delta,c+\delta]\\
0,&x\in[c-\delta,c+\delta]
\end{cases}
$$

$h\ \text{Riemann 可积}$ 且

$$
\int_a^b|h-f|=\int_{c-\delta}^{c+\delta}|f|\leqslant \frac{\varepsilon}{2}
$$

由 $①$ 知，存在分段常值函数 $g$，使得

$$
\int_a^b|g-h|\leqslant\frac{\varepsilon}{2}\Rightarrow \int_a^b|g-f|\leqslant \varepsilon
$$

**QED**

## 命题2（光滑函数逼近）

设 $f\in L^1([a,b])$，则 $\forall \varepsilon > 0$，$\exists g:[a, b]\rightarrow \mathbb R$，$g\in C^{\infty}$，使得

$$
\int_a^b|f-g|\leqslant \varepsilon
$$

---

**思路**： 和 **命题1** 证明思路类似，先讨论 $\text{Riemann 可积}$ 函数可以被光滑函数逼近（利用 $\text{Weierstrass}$ 定理），再将含有奇点的函数用 $\text{Riemann 可积}$ 函数逼近即可。

**证明**：假设 $f$ 是 $\text{Riemann 可积}$，类似 **命题1** 构造分划，由于要求 $g$ 的光滑性，在 $[a_{i-1}, a_i]$ 这一段上，取 $g$ 为 $(a_{i-1}, f(a_{i-1})$ 和 $(a_i, f(a_i))$ 两点的连线，即

$$
g(x) = \frac{x - a_{i-1}}{a_i-a_{i-1}}f(a_i)+\frac{a_i-x}{a_i-a_{i-1}}f(a_{i-1})
$$

则

$$
\begin{aligned}
|f(x)-g(x)| = & \left|\frac{x - a_{i-1}}{a_i-a_{i-1}}(f(x)-f(a_i))+\frac{a_i-x}{a_i-a_{i-1}}(f(x)-f(a_{i-1}))\right|\\

\leqslant &\ \frac{x - a_{i-1}}{a_i-a_{i-1}}|f(x)-f(a_i)|+\frac{a_i-x}{a_i-a_{i-1}}|f(x)-f(a_{i-1})|\\
\leqslant &\ \frac{x - a_{i-1}}{a_i-a_{i-1}}\omega_i+\frac{a_i-x}{a_i-a_{i-1}}\omega_i\\
\leqslant &\ \omega_i\\
\end{aligned}
$$

则

$$
\int_a^b|f-g|=\sum_{i=1}^N\int_{a_{i-1}}^{a_i}|f-g|\leqslant\sum_{i=1}^N\omega_i(a_i-a_{i-1})\leqslant\frac{\varepsilon}{2}
$$

由 $\text{Weierstrass}$ 定理，存在多项式 $P$，使得 $\displaystyle \sum\limits_{x\in[a,b]}|P(x)-g(x)|\leqslant \dfrac{\varepsilon}{2(b-a)}$，则

$$
\int_{a}^b|P-g|\leqslant \frac{\varepsilon}{2(b-a)}(b-a) = \frac{\varepsilon}{2}
$$

则

$$
\int_a^b|P-f|\leqslant \varepsilon
$$

下面证明 $f$ 有奇点的方法与 **命题1** 完全相同。

**QED**

## 定理3（Riemann - Lebesgue 定理）

设 $f\in L^1([a,b])$，则 
$$
\lim\limits_{\lambda\rightarrow +\infty}\int_a^bf(x)\sin\lambda x\,dx = 0\\
\lim\limits_{\lambda\rightarrow +\infty}\int_a^bf(x)\cos\lambda x\,dx = 0
$$

---

**思路**： 有三种证明方法，用分段常值函数逼近（每一段积分可求），用连续函数逼近（对函数做半周期平移，利用三角函数正负抵消，最后利用一致连续性质证明），用可微函数逼近（分部积分）。

**证明**： （三种方法都分为两步，第一步为证明某种性质很好的函数可以满足定理，第二部证明 $f$ 可以由这个好函数逼近）

**方法一**： 

**Step1**. 设 $f$ 为分段常值函数，$f\biggl|_{[a_{i-1},a_i]} = C_i,\ a = a_0< a_1 < \cdots < a_N = b$。

$$
\int_a^bf(x)\sin\lambda x\,dx = \sum_{i=1}^N\int_{a_{i-1}}^{a_i}C_i\sin\lambda x \,dx = \frac{1}{\lambda}\sum_{i=1}^NC_i(\cos\lambda a_{i-1}-\cos\lambda a_i)
$$

则

$$
\begin{aligned}
\left|\int_a^bf(x)\sin\lambda x\,dx\right|\leqslant \frac{1}{\lambda}\sum_{i=1}^N2C_i\leqslant \frac{2NC}{\lambda}\rightarrow 0
\end{aligned}
$$

其中，$C = \max\limits_{x\in[a, b]}f(x)$。

**Step2**. 设 $f\in L^1([a,b])$，由 **命题1** 知，存在分段常值函数 $g:[a, b]\rightarrow \mathbb R$，使得

$$
\int_a^b|f-g|\leqslant \frac{\varepsilon}{2}
$$

由 **Step1** 知，$\int_a^bg(x)\sin\lambda x\,dx\rightarrow 0\quad (\lambda \rightarrow +\infty)$

则 $\exists M > 0$，使得 $\forall \lambda \geqslant M$ 时，

$$
\left|\int_a^bg(x)\sin\lambda x\,dx\right|\leqslant \frac{\varepsilon}{2}
$$

则

$$
\left|\int_a^bf(x)\sin\lambda x\,dx - \int_a^bg(x)\sin\lambda x\,dx\right|\leqslant \int_a^b|f-g|\,dx\leqslant \frac{\varepsilon}{2}
$$

则当 $\lambda \geqslant M$ 时，

$$
\left|\int_a^bf(x)\sin\lambda x|\,dx\right|\leqslant \varepsilon
$$

**QED**

**方法二**：

**Step1**. 设 $f\in C([a,b])$，则

$$
\begin{aligned}
I = \int_a^bf(x)\sin\lambda x\,dx\xlongequal{x = y+\frac{\pi}{\lambda}}&\int_{a-\frac{\pi}{\lambda}}^{b-\frac{\pi}{\lambda}}f(y+\frac{\pi}{\lambda})\sin\lambda(y+\frac{\pi}{\lambda})\,dy\\
=&-\int_{a-\frac{\pi}{\lambda}}^{b-\frac{\pi}{\lambda}}f(y+\frac{\pi}{\lambda})\sin\lambda y\,dy
\end{aligned}
$$

则

$$
\begin{aligned}
I =& \ \frac{1}{2}\left(\int_a^bf(x)\sin\lambda x\,dx - \int_{a-\frac{\pi}{\lambda}}^{b-\frac{\pi}{\lambda}}f(x+\frac{\pi}{\lambda})\sin\lambda x\,dx\right)\\
=& \ \frac{1}{2}\left(-\int_{a-\frac{\pi}{\lambda}}^af(x+\frac{\pi}{\lambda})\sin\lambda x\,dx+\int_{b-\frac{\pi}{\lambda}}^bf(x)\sin\lambda x\,dx+\int_a^{b-\frac{\pi}{\lambda}}(f(x)-f(x+\frac{\pi}{\lambda}))\sin\lambda x\,dx\right)\\
=&\ \frac{1}{2}(I_1+I_2+I_3)
\end{aligned}
$$

其中 $I_1,I_2$ 使用积分长度进行限制，$I_3$ 使用 $f$ 的一致连续性进行限制。

令 $|f|\leqslant M$，则

$$
\begin{aligned}
I_1 \leqslant & \ \frac{M\pi}{\lambda}\rightarrow 0\\
I_2 \leqslant & \ \frac{M\pi}{\lambda}\rightarrow 0\\
I_3\leqslant &\ \sup_{|x-y|\leqslant \frac{\pi}{\lambda}}|f(x)-f(y)|(b-a)\rightarrow 0
\end{aligned}
$$

**Step2**. 使用 **命题2**，过程与 **方法一** 相同。

**QED**

**方法三**： 设 $f\in C^{\infty}([a,b])$，则

$$
\begin{aligned}
I = \int_a^bf(x)\sin\lambda x\,dx =& -\int_a^bf(x)\,d\frac{\cos\lambda x}{\lambda}\\
=& -\frac{1}{\lambda}f(x)\cos\lambda x\biggl|_a^b+\frac{1}{\lambda}\int_a^b(\cos\lambda x)f'(x)\,dx\\
=& \ \frac{1}{\lambda}\left(f(a)\cos\lambda a - f(b)\cos\lambda b + \int_a^b(\cos\lambda x)f'(x)\,dx\right)
\end{aligned}
$$

由于连续函数在闭区间上有界，则 $|f|\leqslant M_1, |f'|\leqslant M_2$，故

$$
|I|\leqslant \frac{1}{\lambda}(2M_1+(b-a)M_2)\rightarrow 0
$$

**Step2**. 使用 **命题2**，过程与 **方法一** 相同。

**QED**

## 命题4（一个三角求和恒等式）

设 $n\in \mathbb Z_{\geqslant 1}$，则

$$
\frac{1}{2} + \sum_{k=1}^n\cos k\theta = \frac{\sin(n+\frac{1}{2})\theta}{2\sin\frac{\theta}{2}}\quad \theta\in \mathbb R
$$

---

**证明**： 

在 $\theta = 2k\pi$ 处的取值

$$
\lim\limits_{\theta\rightarrow 2k\pi}\frac{\sin(n+\frac{1}{2})\theta}{2\sin\frac{\theta}{2}}\xlongequal{\text{周期性}}\lim_{\theta\rightarrow 0}\frac{\sin(n+\frac{1}{2})\theta}{2\sin\frac{\theta}{2}}=\frac{(n+\frac{1}{2})\theta}{\theta} = n+\frac{1}{2}
$$

当 $\theta\neq 2k\pi$ 时，

$$
\begin{aligned}
2\sin\frac{\theta}{2}\left(\frac{1}{2}+\sum_{k=1}^n\cos k\theta\right)=&\ \sin\frac{\theta}{2}+2\sum_{k=1}^n\sin\frac{\theta}{2}\cos k\theta\\
=&\ \sin\frac{\theta}{2}+\sum_{k=1}^n(\sin(k+\frac{1}{2})\theta-\sin(k-\frac{1}{2})\theta)\\
=&\ \sin\frac{\theta}{2}+\sin\frac{3}{2}\theta-\sin\frac{\theta}{2}+\sin\frac{5}{2}\theta-\sin\frac{3}{2}\theta+\cdots+\sin(n+\frac{1}{2})\theta-\sin(n-\frac{1}{2})\theta\\
=& \sin(n+\frac{1}{2})\theta
\end{aligned}
$$

**QED**

## 推导 Fourier 级数的部分和

$f(x)$ 的 $Fourier$ 级数为：

$$
\frac{1}{2}a_0+\sum_{k=1}^{+\infty}\{a_k\cos kx+b_k\sin kx\}
$$

其中，$a_k = \frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx\,dx,\ b_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx\,dx$

由于 $f$ 绝对收敛，则 

$$
\int_{-\pi}^{\pi}|f\sin kx|\,dx\leqslant \int_{-\pi}^{\pi}|f|\,dx  < +\infty
$$

$a_k, b_k$ 有意义。

下面求 $Fourier$ 级数的前 $n$ 项和：

$$
\begin{aligned}
f_n(x)=&\ \frac{1}{2}+\sum_{k=1}^n\{a_k\cos kx+b_k\sin kx\}\\
=&\ \frac{1}{2\pi}\int_{-\pi}^{\pi}f(t)\,dt+\sum_{k=1}^n\left\{\frac{1}{\pi}\int_{-\pi}^{\pi}f(t)\cos kt\,dt\cos kx+\frac{1}{\pi}\int_{-\pi}^{\pi}f(t)\sin kt\,dt \sin kx\right\}\\
=&\ \frac{1}{\pi}\int_{-\pi}^{\pi}f(t)\left\{\frac{1}{2}+\sum_{k=1}^n(\cos kt\cos kx+\sin kt\sin kx)\right\}\,dt\\
=&\ \frac{1}{\pi}\int_{-\pi}^{\pi}f(t)\left\{\frac{1}{2}+\sum_{k=1}^n\cos k(t-x)\right\}\,dt\\
=&\ \frac{1}{\pi}\int_{-\pi}^{\pi}f(t)\frac{\sin(n+\frac{1}{2})(t-x)}{2\sin\frac{1}{2}(t-x)}\,dt\\
\xlongequal{t-x\rightarrow t}&\ \frac{1}{\pi}\int_{-\pi-x}^{\pi-x}f(t+x)\frac{\sin(n+\frac{1}{2})t}{2\sin\frac{1}{2}t}\,dt\\
\xlongequal{\text{周期性}}&\ \frac{1}{\pi}\int_{-\pi}^{\pi}f(t+x)\frac{\sin(n+\frac{1}{2})t}{2\sin\frac{1}{2}t}\,dt\\
=&\ \frac{1}{\pi}\int_0^{\pi}f(t+x)\frac{\sin(n+\frac{1}{2})t}{2\sin\frac{1}{2}t}\,dt+\frac{1}{\pi}\int_{-\pi}^{0}f(t+x)\frac{\sin(n+\frac{1}{2})t}{2\sin\frac{1}{2}t}\,dt\\
\xlongequal[t\rightarrow -t]{\text{右式做}}&\ \frac{1}{\pi}\int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}\cdot\frac{\sin(n+\frac{1}{2})t}{\sin\frac{1}{2}t}\,dt
\end{aligned}
$$

假设 $f$ 连续，设 

$$
D_n(x) = \frac{\sin(n+\frac{1}{2})x}{\pi\sin\frac{1}{2}x}
$$

则

$$
f_n(x) = \int_0^{\pi}\frac{f(x+t)+f(x-t)}{2}D_n(t)\,dt
$$

称 $D_n(x)$ 为 $f_n(x)$ 这个积分的**核**，也就是计算出这个积分最关键的部分。

## 命题5（ $D_n$ 的性质）

$D_n$ 的定义如上，则

1. $\int_0^{\pi}D_n(t)\,dt = 1$（权函数）

2. $\lim\limits_{n\rightarrow +\infty}D_n(0)= +\infty$（权重趋于原点）

---

**证明**： 

1. 

$$
\begin{aligned}
\int_0^{\pi}D_n(t)\,dt=&\ \frac{2}{\pi}\int_0^{\pi}\frac{\sin(\frac{1}{2}+n)t}{2\sin\frac{1}{2}t}\,dt
=&\ \frac{2}{\pi}\int_0^{\pi}\left(\frac{1}{2}+\sum_{k=1}^n\cos kx\right)\,dx\\
=&\ \frac{2}{\pi}\int_0^{\pi}\frac{1}{2}\,dx\\
=&\ 1
\end{aligned}
$$

2. 当 $n\rightarrow +\infty$ 时，

$$
D_n(0) = \frac{2n+1}{\pi}\rightarrow +\infty
$$
