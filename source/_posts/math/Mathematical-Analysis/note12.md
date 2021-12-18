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

2. $\exists\ 0 < \delta < \min\{b-x_0,x_0-a\}$，$0 < \alpha \leqslant 1$，使得

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

## 定义3（Hölder 连续）

设 $f:(a, b)\rightarrow \mathbb R$，$x_0\in (a, b)$，若 $\exists0 < \alpha < 1,\ 0 < \delta < \min\{b-x_0,x_0-a\}$，使得 
$$
|f(x)-f(x_0)|\leqslant M|x-x_0|^{\alpha}\quad \forall x\in (x_0 - \delta,x_0+\delta)
$$

其中 $M$ 为常数，则称 $f$ 在 $x_0$ 点 $Hölder$ 连续。

## 推论4（Hölder 连续 Fourier 级数收敛）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi $ 周期的函数，$f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$，如果 $x\in\mathbb R$，$f$ 在 $x$ 点 $Hölder$ 连续，则 $f$ 的 $Fourier$ 级数在 $x$ 点收敛到 $f(x)$。

## 定义5（某点处 Lipschitz 连续）

设 $f:(a, b)\rightarrow \mathbb R$，$x_0\in (a,b)$，若 $\exists 0 < \delta < \max\{b-x_0,x_0-a\}$，使得

$$
|f(x)-f(x_0)|\leqslant M|x-x_0|\quad \forall x\in (x_0-\delta,x_0+\delta)
$$

其中 $M$ 为常数，则称 $f$ 在 $x_0$ 点 $Lipschitz$ 连续。

## 定义6（f Lipschitz 连续）

设 $f:\mathbb R\rightarrow \mathbb R$，如果 $\exists M > 0$，使得

$$
|f(x)-  f(y)|\leqslant M|x-y|\quad \forall x, y\in\mathbb R
$$

则称 $f\ Lipschitz$ 连续。

## 定理7（Lipschitz 连续则 Fourier 级数收敛）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，如果 $f\ Lipschitz$ 连续，则 $f$ 的 $Fourier$ 级数（逐点）收敛于 $f$。

## 定理8（连续可微则 Fourier 级数收敛）

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，如果 $f\in C^1(\mathbb R)$，则 $f$ 的 $Fourier$ 级数收敛到 $f$。

---

由微分中值定理，可以得出若 $f\in C^1$，则 $f\ Lipschitz$ 连续。

有如下包含关系：

$$
f\in C^1\Rightarrow f\ Lipschitz\text{连续}\Rightarrow f\ Hölder\text{连续}\Rightarrow f\text{一致连续}\Rightarrow f\text{连续}
$$

## 定义9（分段可微函数）

设 $f:[a,b]\rightarrow \mathbb R$，$\exists\ [a,b]$ 的一个分划

$$
a = a_0 < a_1 < \cdots < a_N = b
$$

满足

1. $f(a_0^+),\cdots,f(a_i^-),f(a_i^+),\cdots,f(a_N^-)$ 存在。

2. 记 $f_i:[a_{i-1},a_i] \rightarrow \mathbb R$，则

$$
f_i(x) = \begin{cases}
f(a_{i-1}^+),& x = a_{i-1}\\
f(x),& a_{i-1} < x < a_i\\
f(a_i^-),& x = a_i
\end{cases}
$$

其中 $1\leqslant i \leqslant N, f_i\in C^1([a_{i-1},a_i])$，则称 $f$ 为分段可微函数。

下面利用 $Fourier$ 计算几个级数。

## 例题

### 例1（符号函数）

$f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数（符号函数限制在 $[-\pi,\pi]$ 上）

$$sgn(x) = f(x) = \begin{cases}
-1,&x\in[-\pi,0)\\
0,&x=0\\
1,&x\in(0,\pi]
\end{cases}
$$

通过计算三角级数得到

$$
sgn(x) = \sum_{n=1}^{+\infty}\frac{4}{(2n-1)\pi}\sin(2n-1)x,\quad x\in(-\pi,\pi)
$$

令 $x=\dfrac{\pi}{2}$，则

$$
\frac{\pi}{4} = 1-\frac{1}{3}+\frac{1}{5}-\frac{1}{7}+\cdots
$$

### 例2

设 $f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，$f(x) = x^2$，$x\in[-\pi,\pi]$，计算得

$$
x^2 = \frac{1}{3}\pi^2+\sum_{k=1}^{+\infty}(-1)^k\frac{4}{k^2}\cos kx,\quad x\in[-\pi,\pi]
$$

令 $x = 0$，则

$$
\frac{\pi^2}{12} = 1-\frac{1}{2^2}+\frac{1}{3^2}-\frac{1}{4^2}+\cdots
$$

### 例3

$f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数， $f(x) = \cos \alpha x$，$x\in[-\pi,\pi],\ 0 < \alpha < 1$，计算得

$$
\cos \alpha x = \frac{2\alpha\sin\alpha\pi}{\pi}\left(\frac{1}{2\alpha^2}+\sum_{n=1}^{+\infty}\frac{(-1)^n}{\alpha^2-n^2}\cos nx\right),\quad x\in (-\pi, \pi)
$$

令 $x=0$，则

$$
\frac{\pi}{\sin\alpha\pi} = \frac{1}{\alpha}+\sum_{n=1}^{+\infty}(-1)^n\frac{2\alpha}{\alpha^2-n^2}
$$

### 例4

$\alpha\in(0,1)$，计算广义积分

$$
\int_0^{+\infty}\frac{x^{\alpha-1}}{1+x}\,dx
$$

**解**： 收敛性：

$$
\begin{aligned}
\int_1^{+\infty}\frac{x^{\alpha-1}}{1+x}\,dx\leqslant& \int_1^{+\infty}x^{\alpha-2}\,dx=\frac{1}{1-\alpha} < +\infty\\
\int_0^1\frac{x^{\alpha-1}}{1+x}\,dx\leqslant& \int_0^1x^{\alpha-1}\,dx=\frac{1}{\alpha} < +\infty
\end{aligned}
$$

等比数列

$$
\frac{1}{1+x} = 1+(-x)+(-x)^2+\cdots\quad 0 < x < 1
$$

下面讨论积分域在 $(0,1)$ 上的情况

$$
\begin{aligned}
&\ \frac{x^{\alpha-1}}{1+x}=\sum_{k=0}^{+\infty}(-1)^kx^{k+\alpha-1}\\
\Rightarrow &\int_0^1\frac{x^{\alpha-1}}{1+x}\,dx=\int_0^1\sum_{k=0}^{+\infty}(-1)^kx^{k+\alpha-1}\,dx=\int_0^1\lim_{N\rightarrow +\infty}\sum_{k=0}^{N}(-1)^kx^{k+\alpha-1}\,dx\\
\end{aligned}
$$

希望极限与积分符号换位，下证

$$
\int_0^1\frac{x^{\alpha-1}}{1+x}\,dx = \lim_{N\rightarrow +\infty}\int_0^1\sum_{k=0}^N(-1)^kx^{k+\alpha-1}\,dx
$$

做差进行估计

$$
\begin{aligned}
\left|\int_0^1\frac{x^{\alpha-1}}{1+x}\,dx-\int_0^1\sum_{k=0}^N(-1)^kx^{k+\alpha-1}\,dx\right|=&\ \left|\int_0^1x^{\alpha-1}\left(\frac{1}{1+x}-\sum_{k=0}^N(-1)^kx^k\right)\,dx\right|\\
=&\ \left|\int_0^1x^{\alpha-1}\left(\frac{1}{1+x}-\frac{1-(-x)^{N+1}}{1+x}\right)\,dx\right|\\
=&\ \left|\int_0^1(-1)^{N+1}\frac{x^{N+\alpha}}{1+x}\,dx\right|\\
\leqslant &\ \int_0^1\frac{x^{N+\alpha}}{1+x}\,dx\\
\leqslant &\ \int_0^1x^{N+\alpha}\,dx\\
=&\ \frac{1}{N+\alpha+1}\rightarrow 0
\end{aligned}
$$

则

$$
\begin{aligned}
\int_0^1\frac{x^{\alpha-1}}{1+x}\,dx =&\ \lim_{N\rightarrow +\infty}\int_0^1\sum_{k=0}^N(-1)^kx^{k+\alpha-1}\,dx\\
=&\ \lim_{N\rightarrow +\infty}\sum_{k=0}^N(-1)^k\frac{1}{k+\alpha}\\
=&\ \sum_{k=0}^{+\infty}(-1)^k\frac{1}{k+\alpha}&\text{①}
\end{aligned}
$$

又

$$
\begin{aligned}
\int_1^{+\infty}\frac{x^{\alpha-1}}{1+x}\,dx\xlongequal{x=\frac{1}{t}}&\int_0^1\frac{t^{1-\alpha}}{1+\frac{1}{t}}\cdot\frac{1}{t^2}\,dt\\
=&\int_0^1\frac{t^{-\alpha}}{1+t}\,dt\\
\xlongequal[\text{令}\alpha\rightarrow 1-\alpha]{\text{①式中}}&\ \sum_{k=0}^{+\infty}(-1)^k\frac{1}{k+1-\alpha}\\
=&\ \sum_{k=1}^{+\infty}(-1)^{k-1}\frac{1}{k-\alpha}
\end{aligned}
$$

则，原式

$$
\begin{aligned}
\int_0^{+\infty}\frac{x^{\alpha-1}}{1+x} =&\ \frac{1}{\alpha}+\sum_{k=1}^{+\infty}(-1)^k\left(\frac{1}{k+\alpha}-\frac{1}{k-\alpha}\right)\\
=&\ \frac{1}{\alpha}+\sum_{k=1}^{+\infty}(-1)^k\frac{2\alpha}{k^2-\alpha^2}\\
\xlongequal{\text{例3}}&\ \frac{\pi}{\sin\alpha\pi}
\end{aligned}
$$
