---
title: 度量空间和第二纲集
hide: false
math: true
category:
  - Math
  - 泛函分析
abbrlink: 11051
date: 2022-09-10 17:19:29
index_img:
banner_img:
tags:
---

## 第一章 度量空间（距离空间）

###  定义1.1（度量，度量空间）

设 $X$ 为非空集合，$\rho(x, y)$ 是 $X$ 上的一个双变元的实值函数，满足：（$x,y,z\in X$）

1. 正定性：$\rho(x, y)\geqslant 0$ 且 $\rho(x, y) = 0\iff x = y$.
2. 对称性：$\rho(x, y) = \rho(y, x)$.
3. 三角不等式：$\rho(x, y)\leqslant \rho(x, z)+\rho(z, y)$.

则称 $\rho$ 是 $X$ 上的一个**度量（距离）**，$X$ 称为**度量（距离）空间**，记为 $(X, \rho)$.

#### 例1（实数空间中的度量）

在 $\mathbb{R}^n$ 中，以下三种均可作为度量的定义：
$$
\begin{aligned}
\rho_1(x, y) =&\ \left(\sum_{i=1}^n(x_i-y_i)^2\right)^{1/2},\quad\text{(欧氏距离)}\\
\rho_2(x, y) =&\ \sum_{i=1}^n|x_i-y_i|,\\
\rho_3(x, y) =&\ \max_i\{|x_i-y_i|\}.
\end{aligned}
$$

#### 例2（连续函数空间中的度量）

在 $C[a, b]$ 中，以下两种均可作为度量的定义：
$$
\begin{aligned}
\rho_1(x, y)=&\ \max_{a\leqslant t\leqslant b}|x(t)-y(t)|,\\
\rho_2(x, y)=&\ \int_a^b|x(t)-y(t)|\,\mathrm{d}t.
\end{aligned}
$$

#### 例3（直线上的度量）

在 $\mathbb{R}$ 中，以下两种定义均可作为该空间中的度量：
$$
\begin{aligned}
\rho_1(x, y) =&\ \frac{|x-y|}{1+|x-y|},\\
\rho_2(x, y) =&\ \begin{cases}
0,&\quad x=y,\\
1,&\quad x\neq y.
\end{cases}
\end{aligned}
$$

#### 例4（可测函数度量的定义）

设 $S[a, b]$ 表示 $[a, b]$ 上几乎处处有取值的可测函数全体，以下定义可作为该空间中的度量：
$$
\rho(f, g) = \int_a^b\frac{|f-g|}{1+|f-g|}\,\mathrm{d}\mu
$$

#### 例5（实数列的度量）

设 $S$ 表示一切实数列 $x=\{x_1,x_2,\cdots\}$ 组成的全体，以下定义可作为该空间中的度量：
$$
\rho(x, y) = \sum_{i=1}^\infty\frac{1}{2^i}\frac{|x_i-y_i|}{1+|x_i-y_i|}\quad(\text{引入}\frac{1}{2^i}\text{为了保证该级数收敛})
$$

#### 例6（$L^p$ 空间中的度量）

设 $(X, \Omega, \mu)$ 为测度空间，$L^p = L/\sim$，其中 $L = \{f\text{为}X\text{上的可测函数}:||f||_p<\infty\}$，$||f||_p=(\int_X|f|^p\mathrm{d}\mu)^{1/p}$ 为函数 $f$ 的p-范数，$\sim$ 为等价关系，这里将 $L$ 中几乎处处相等的函数视为同一个元素. $L^p[a,b]$ 表示在积分域 $[a,b]$ 上可测，且p-范数存在. 则以下定义可作为 $L^p[a, b],\ 1\leqslant p\leqslant \infty$ 上的度量：
$$
\rho(f, g) = \left(\int_a^b|f-g|^p\mathrm{d}x\right)^{1/p}
$$

### 定义1.2（收敛列）

设 $(X,\rho)$ 为度量空间，数列 $\{x_n\}\subset X$，若 $\rho(x_n, x)\to 0,\ (n\to\infty)$，则称 $\{x_n\}$ 为收敛列，收敛到 $x$，记为 $\displaystyle\lim_{n\to\infty}x_n=x$，简记为 $x_n\to x,\ (n\to\infty)$.

> 1. 极限唯一性：反设 $x, y$ 为两个不同的极限，则 $\rho(x, y)\leqslant \rho(x_n, x)+\rho(x_n, y)\to 0\Rightarrow x=y$ 矛盾.
> 2. （度量等价）$(X,\rho_1)$ 与 $(X,\rho_2)$，任意的数列 $\{x_n\}\subset X$，若 $\rho_1(x_n, x)\to 0\iff \rho_2(x_n, x)\to 0$ 则称 $\rho_1$ 与 $\rho_2$ **等价**.
> 3. 开球：$B(x, r):=\{z\in X:\rho(x, z) < r\}$.
> 4. 设 $(X, \rho)$ 为度量空间，$A\subset X$ 则 $A$ 是闭集 $\iff$ $A$ 包含 $A$ 中所有收敛列的极限点.

### 定义1.3（闭集）

设 $(X, \rho)$ 为度量空间，数列 $\{x_n\}\subset X$，若由 $x_n\to x$ 可得 $x\in A$，则称 $A$ 是 $X$ 中的闭集.

### 定义1.4（Cauchy列）

设 $(X, \rho)$ 为度量空间，数列 $\{x_n\}\subset X$，若 $\{x_n\}$ 满足 $\rho(x_n,x_m)\to 0,\ (n,m\to\infty)$，则称 $\{x_n\}$ 是 $X$ 中的Cauchy列（基本列）.

> Cauchy列不一定是收敛列，例如 $(\mathbb{Q}, |\cdot|)$ 中收敛到无理点的有理数数列.
>
> 1. 若 $\{x_n\}$ 是 $X$ 中的收敛列，则 $\{x_n\}$ 是Cauchy列. （三角不等式可证）
> 2. 若 $\{x_n\}$ 是Cauchy列，且存在子列 $\{x_{n_k}\}$ 收敛，则 $\{x_n\}$ 是收敛列且收敛到子列的极限.
> 3. 若 $\{x_n\}$ 是Cauchy列，则 $\{x_n\}$ 是**有界的**$\iff$存在 $\gamma_0 > 0, x\in X$ 使得 $\rho(x, x_n) < \gamma_0$.

### 定义1.5（度量空间的完备性）

设 $(X, \rho)$ 为度量空间，若 $X$ 中所有的Cauchy列都收敛，则称 $X$ 是**完备的**.

### 定理1.6（完备性等价闭子集套定理）

设 $(X,\rho)$ 为度量空间，$X$ 是完备的$\iff$若集列 $\{A_n\}$ 是 $X$ 中单调下降的非空闭子集列且满足 $\displaystyle\lim_{n\to\infty}\text{diam }A_n=0$，则 $\displaystyle\bigcap_{n\geqslant 1}A_n$ 是单点集.

> 集合的直径（diameter）：$\displaystyle\text{diam }(A):= \sum_{x, y\in A}\rho(x, y)$，且 $\text{diam } A = \text{diam }\bar{A}$.

---

**证明：**（$\Rightarrow$ 利用 $\{A_n\}$ 构造数列用完备性证明，$\Leftarrow$ 利用 $\{x_n\}$ 构造单调下降的闭子集列证明）

“$\Rightarrow$”首先证 $\displaystyle\bigcap_{n\geqslant 1}A_n\neq \varnothing$，取 $x_n\in A_n$，由于 $\displaystyle\lim_{n\to\infty}\text{diam }A =0$，则 $\rho(x_n, x_m)\leqslant \text{diam }A_n\to 0,\ (m > n)$，则 $\{x_n\}$ 是Cauchy列. 由于 $X$ 是完备的，则 $\exists x\in X$ 使得 $x_n\to x$，又由于 $A_n$ 为闭子集列，则 $\displaystyle x\in A_n,\ (n\in\mathbb{N})\Rightarrow x\in\bigcap_{n\geq 1}A_n$.

下证 $\displaystyle\bigcap_{n\geqslant 1}A_n$ 中只有一个元素，设 $\displaystyle x_1, x_2\in\bigcap_{n\geqslant 1}A_n$，由于
$$
\rho(x_1, x_2)\leqslant \text{diam }A_n\to 0,\ (n\to\infty)
$$
则 $\rho(x_1,x_2)=0\Rightarrow x_1=x_2$.

“$\Leftarrow$”设 $\{x_n\}$ 是 $X$ 中的Cauchy列，令 $A_1=\overline{\{x_1,x_2,\cdots\}}, A_2=\overline{\{x_2,\cdots\}},\cdots,A_n=\overline{\{x_n,x_{n+1}\cdots\}}$，则 $\{A_n\}$ 是闭子集列且单调下降
$$
\lim_{n\to\infty}\text{diam }A_n=\lim_{n\to\infty}\text{diam }\{x_n,x_{n+1},\cdots\}=0,
$$
则 $\exists x\in X$ 使得 $\displaystyle\bigcap_{n\geqslant 1} A_n=\{x\}$，由于 $\rho(x_n, x)\leqslant \text{diam }A_n\to 0,\ (n\to\infty)$，即 $x_n\to x$.

## 第二纲集

### 定义1.7（稠密集）

设 $(X, \rho)$ 为度量空间，$E\subset X$，若 $x\in X$，$\forall \varepsilon > 0$，$\exists z\in E$ 使得 $\rho(z, x) < \varepsilon$，则 $E$ 是 $X$ 中的**稠密集**.

### 定义1.8（疏集）

设 $(X, \rho)$ 为度量空间，$E\subset X$，若 $\bar{E}$ 无内点，则称 $E$ 是 $X$ 中的**疏集**.

$\iff$ $E$ 不在 $X$ 中的任意一个非空开集（开球）中稠密，则称 $E$ 是疏集.

$\iff$ $\forall \overline{B(x, r)}=\{z\in X:\rho(z, x)\leqslant r\}$ 必存在开球 $B(x', r')\subset B(x, r)$ 使得 $\overline{B(x', r')}\cap \bar{E}=\varnothing$.

---

证明利用开集的任意性，第三个证明需要用到 $B(x, r) - \bar{E}\neq \varnothing$ 且为开集来证明.

### 定义1.9（第一、二纲集）

设 $(X, \rho)$ 为度量空间，设 $A\subset X$，若 $\displaystyle A = \bigcup_{n\geq 1}E_n$（$E_n$ 是疏集）则称 $A$ 是 $X$ 中的**第一纲集**. 不是第一纲集则是**第二纲集**.

### 定义1.10（第二纲集与完备性等价）

完备的度量空间是第二纲集.

---

**证明**：（反证法，利用疏集的第三种等价条件构造闭子集套，利用**定理1.6**）不妨令 $(x, \rho)$ 为完备的度量空间. 

假设 $X$ 是第一纲集，则存在疏集列 $E_n\subset X$ 使得 $\displaystyle X=\bigcup_{n\geq 1}E_n$ 任取开球 $B(x_0, r_0)\subset X$，由于 $E_1$ 是疏集，$\exists B(x_1, r_1)\subset B(x_0, r_0),\ (r_1 < 1)$ 使得 $\overline{B(x_1,r_1)}\cap\bar{E}_1=\varnothing$；由于 $E_2$ 是疏集，对于 $B(x_1, r_1)$ 则 $\exists B(x_2,r_2)\subset B(x_1,r_1),\ (r_2 < \frac{1}{2})$ 使得 $\overline{B(x_2, r_2)}\cap\bar{E}_2 = \varnothing$，进而 $\displaystyle \overline{B(x_2, r_2)} \cap\bigcup_{i=1}^2\bar{E}_i =\varnothing$.

依此类推：$\exists B(x_n, r_n)\subset B(x_{n-1}, r_{n-1}),\ (r_n < \frac{1}{n})$ 使得 $\displaystyle \overline{B(x_n, r_n)}\cap\bigcup_{i=1}^n\bar{E}_i=\varnothing,\ (n\in\mathbb{N})$ 且
$$
\overline{B(x_1, r_1)}\supset\overline{B(x_{2}, r_{2})}\supset\cdots\supset\overline{B(x_n, r_n)}
$$
则 $\text{diam }\overline{B(x_n, r_n)} =\text{diam }B(x_n, r_n)\to 0$，由于 $X$ 是完备的，则 $\exists x\in X$ 使得 $\displaystyle \bigcap_{n\geqslant 1}\overline{B(x_n, r_n)}=\{x\}$，则 $x\in\overline{B(x_n, r_n)},\ (n\in\mathbb{N})$，故 $x\notin E_n,\ (n\in\mathbb{N})$ 与 $\displaystyle x\in\bigcup_{n\geqslant 1}E_n$ 矛盾.
