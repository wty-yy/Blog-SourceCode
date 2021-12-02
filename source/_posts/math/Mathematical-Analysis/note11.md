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
