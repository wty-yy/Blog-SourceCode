---
title: 多元函数积分中值定理 Fubini定理
hide: false
math: true
abbrlink: 54113
date: 2021-10-03 15:33:50
index_img:
banner_img:
category:
tags:
---

第三周讲完了积分中值定理（也就是积分性质应该讲完了），积分中值定理多用于估计积分值，可以利用一个函数值来估计整个积分的值，并学了如何使用Fubini定理去计算多元函数积分值。

## 多元函数积分中值定理

### 定义1（有界集的“体积”，积分平均值，加权积分平均值）

设 $A\subset \mathbb R^n$ 有界，$m^*(A)=0$，则称 $V(A):=\int_A1\,dx$ 为 $A$ 的“体积”。

设 $V(A) > 0, f:A\rightarrow \mathbb R$ 可积，则称 $\frac{1}{V(A)}\int_Af$ 为 $f$ 在 $A$ 上得**积分平均值**。

设 $\varphi:A\rightarrow \mathbb R$，$\varphi$ 可积，$\varphi\geqslant 0$，$\int_A\varphi = 1$，则称 $\varphi$ 为 $A$ 上的**权函数**。

称 $\int_A f\varphi$ 为 $f$ 的**加权积分平均值**。

### 定理2（积分中值定理）

设 $K\subset\mathbb R^n$ 为**连通的紧集**，$m^*(\partial K) = 0, V(K) > 0$，设 $f\in C(K)$，

则 $\exists\xi\in K$，使 $\frac{1}{V(A)}\int_Kf=f(\xi)$。

---

**证明：** （取最大和最小值，再利用连通紧集上连续函数的介值定理）

由于 $f\in C(K)$，则 $f$ 在 $K$ 上存在最值，记 $m=\min f, M=\max f$，又 $m^*(\partial K) = 0$ 且 $f$ 连续有界，故 $f$ 可积，则有

$$
\begin{aligned}
\frac{1}{V(K)}\int_Km&\leqslant\frac{1}{V(K)}\int_K f\leqslant\frac{1}{V(K)}\int_K M\\
\Rightarrow m&\leqslant\frac{1}{V(K)}\int_Kf\leqslant M
\end{aligned}
$$

由**介值定理**知，$\exists\xi\in K$，使得 $f(\xi)=\frac{1}{V(K)}\int_Kf$。

### 定理3（加权积分中值定理）

设 $K\subset \mathbb R^n$ 为**连通的紧集**，$m^*(K) = 0$，设 $\varphi:K\rightarrow \mathbb R$ 可积，$\varphi\geqslant 0, \int_K\varphi = 1$，设 $f\in C(K)$，则 $\exists \xi\in K$，使得 $\int_K f\varphi=f(\xi)$。

---

**证明：** （思路和定理2的证明类似）

设 $m=\min f, M=\max f$，由于 $D(f\varphi)\subset D(\varphi)\Rightarrow m^*(D(f\varphi))\leqslant m^*(D(\varphi)) = 0$。

则有

$$
m = \int_Km\varphi\leqslant\int_Kf\varphi\leqslant\int_KM\varphi = M
$$

由**介值定理**知，$\exists \xi \in K$，使得 $f(\xi) = \int_Af\varphi$。

## Fubini 定理

### 定理1（Fubini定理）

设 $P\subset \mathbb R^n, Q\subset \mathbb R^n$ 均为闭方体，$f:P\times Q\rightarrow \mathbb R$ 可积，$f=f(x, y),x\in P, y\in Q$，则下列函数分别关于 $x, y$ 均可积：（这里把 $f(x,y)$ 看做“二元函数”，但其实 $x$ 是 $n$ 维的，$y$ 是 $m$ 维的）

- $\forall x\in P$，关于 $x$ 的函数：$\underline{\int}_Qf(x, y)\,dy,\ \overline{\int}_Qf(x, y)\,dy$。（固定 $x$ 对 $y$ 进行积分）

- $\forall y\in Q$，关于 $y$ 的函数：$\underline{\int}_Pf(x, y)\,dx,\ \overline{\int}_Pf(x, y)\,dx$。（固定 $y$ 对 $x$ 进行积分）

且有：

$$
\begin{aligned}
\int_{P\times Q}f & = \int_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx = \int_P\{\overline{\int}_Qf(x, y)\,dy\}\,dx\\
& = \int_Q\{\underline{\int}_Pf(x, y)\,dx\}\,dy = \int_Q\{\overline{\int}_Pf(x, y)\,dx\}\,dy
\end{aligned}
$$

---

**注：** 定理1比较复杂其原因是 $\int_Qf(x, y)dy,\ \int_Pf(x, y)dx$ 不一定存在，而它们的Darboux上下积分却可以继续积分，这说明它们的Darboux上下积分的间断点构成**零测集**，而且它们四个Darboux上下积分继续积分出来的结果都等于 $\int_{P\times Q} f$。下面的**推论2**就没这么复杂了。

**思路：** 构造 $P\times Q$ 上的一个划分，将这个划分分别分成 $P, Q$ 上的两个划分，再利用Darboux上下积分定义，对它们进行估计，具体来说，是用 $f$ 在 $P\times Q$ 上的Darboux上下积分进行夹逼，由于 $f$ 是可积的，利用 $f$ Darboux上下积分收敛的性质，得出结论。

**证明：** 只证明其中一个，其他同理可证。

下面证明：

$$
\int_{P\times Q}f=\int_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx
$$

只需证：

$$
\int_{P\times Q}f=\underline{\int}_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx=\overline{\int}_P\{\underline{\int}_Qf(x,y)\,dy\}\,dx
$$

设 $\pi$ 为 $P\times Q$ 的分划 $\pi$，则 $\exists P$ 的分划 $\pi_1$，$Q$ 的分划 $\pi_2$，使得 $\pi = \{p\times q: p\in \pi_1, q\in\pi_2\}$。

- 我们先对 $\underline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx$ 进行估计。

$$
\underline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx \geqslant \sum_{p\in\pi_1}\left(\inf_{x\in p}\underline{\int}_Qf(x, y)\,dy\right)V(p)
$$

设 $x\in p$，则

$$
\begin{aligned}
&\underline{\int}_Qf(x, y)\,dy\geqslant \sum_{q\in\pi_2}\left(\inf_{y\in q}f(x, y)\right)V(q)\geqslant\sum_{q\in\pi_2}m_{p\times q}V(q)\\
\Rightarrow \inf_{x\in p}&\underline{\int}_Qf(x, y)dy \geqslant \sum_{q\in \pi_2}m_{p\times q}V(q)
\end{aligned}
$$

其中 $m_{p\times q} = \inf\limits_{x \in p\times q} f(x)$。

故

$$
\begin{aligned}
\underline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx &\geqslant \sum_{p\in\pi_1}\sum_{q\in\pi_2}m_{p\times q}V(p)V(q)\\
&\geqslant \sum_{p\times q\in \pi}m_{p\times q} V(p\times q)\\
&\geqslant \underline{\int}_{P\times Q} f
\end{aligned}
$$

令 $\Delta\pi\rightarrow 0$，得

$$
\underline{\int}_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx\geqslant\underline{\int}_{P\times Q} f = \int_{P\times Q}f
$$

- 我们再对 $\overline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx$ 进行估计。（原理相同，只需把 $\geqslant$ 换成 $\leqslant$，$\inf$ 换成 $\sup$）

$$
\overline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx \leqslant \sum_{p\in\pi_1}\left(\sup_{x\in p}\underline{\int}_Qf(x, y)\,dy\right)V(p)
$$

设 $x\in p$，则（这里多了一个估计，Darboux下积分 $\leqslant$ Darboux上积分，为了保持 $\leqslant$）

$$
\begin{aligned}
&\underline{\int}_Qf(x, y)\,dy\leqslant \overline{\int}_Qf(x, y)\,dy\leqslant \sum_{q\in\pi_2}\left(\sup_{y\in q}f(x, y)\right)V(q)\leqslant\sum_{q\in\pi_2}M_{p\times q}V(q)\\
\Rightarrow \sup_{x\in p}&\underline{\int}_Qf(x, y)dy \leqslant \sum_{q\in \pi_2}M_{p\times q}V(q)
\end{aligned}
$$

其中 $M_{p\times q} = \sup\limits_{x \in p\times q} f(x)$。

故

$$
\begin{aligned}
\overline{\int}_P\underline{\int}_Q\{f(x, y)\,dy\}\,dx &\leqslant \sum_{p\in\pi_1}\sum_{q\in\pi_2}M_{p\times q}V(p)V(q)\\
&\leqslant \sum_{p\times q\in \pi}M_{p\times q} V(p\times q)\\
&\leqslant \overline{\int}_{P\times Q} f
\end{aligned}
$$

令 $\Delta\pi\rightarrow 0$，得

$$
\overline{\int}_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx\leqslant\overline{\int}_{P\times Q} f = \int_{P\times Q}f
$$

- 综上，有

$$
\int_{P\times Q}f = \underline{\int}_{P\times Q} f\leqslant \underline{\int}_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx\leqslant\overline{\int}_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx\leqslant\overline{\int}_{P\times Q}f = \int_{P\times Q}f
$$

则，$\underline{\int}_Qf(x, y)\,dy$ 可积，且 

$$
\int_{P\times Q} f = \int_P\{\underline{\int}_Qf(x, y)\,dy\}\,dx
$$
