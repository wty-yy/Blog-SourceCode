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

设 $A\subset \mathbb R^n$ 有界，$m^*(\partial A)=0$，则称 $V(A):=\int_A1\,dx$ 为 $A$ 的“体积”。

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
\int_{P\times Q}f & = \int_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx = \int_P\left\{\overline{\int}_Qf(x, y)\,dy\right\}\,dx\\
& = \int_Q\left\{\underline{\int}_Pf(x, y)\,dx\right\}\,dy = \int_Q\left\{\overline{\int}_Pf(x, y)\,dx\right\}\,dy
\end{aligned}
$$

---

**注：** 定理1比较复杂其原因是 $\int_Qf(x, y)dy,\ \int_Pf(x, y)dx$ 不一定存在，而它们的Darboux上下积分却可以继续积分，这说明它们的Darboux上下积分的间断点构成**零测集**，而且它们四个Darboux上下积分继续积分出来的结果都等于 $\int_{P\times Q} f$。下面的**推论2**就没这么复杂了。

**思路：** 构造 $P\times Q$ 上的一个划分，将这个划分分别分成 $P, Q$ 上的两个划分，再利用Darboux上下积分定义，对它们进行估计，具体来说，是用 $f$ 在 $P\times Q$ 上的Darboux上下积分进行夹逼，由于 $f$ 是可积的，利用 $f$ Darboux上下积分收敛的性质，得出结论。

**证明：** 只证明其中一个，其他同理可证。

下面证明：

$$
\int_{P\times Q}f=\int_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx
$$

只需证：

$$
\begin{aligned}
\int_{P\times Q}f=\underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx=\overline{\int}_P\left\{\underline{\int}_Qf(x,y)\,dy\right\}\,dx
\end{aligned}
$$

设 $\pi$ 为 $P\times Q$ 的分划 $\pi$，则 $\exists P$ 的分划 $\pi_1$，$Q$ 的分划 $\pi_2$，使得 $\pi = \left\{p\times q: p\in \pi_1, q\in\pi_2\right\}$。

- 我们先对 $\underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx$ 进行估计。

$$
\underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx \geqslant \sum_{p\in\pi_1}\left(\inf_{x\in p}\underline{\int}_Qf(x, y)\,dy\right)V(p)
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
\underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx &\geqslant \sum_{p\in\pi_1}\sum_{q\in\pi_2}m_{p\times q}V(p)V(q)\\
&\geqslant \sum_{p\times q\in \pi}m_{p\times q} V(p\times q)\\
&\geqslant \underline{\int}_{P\times Q} f
\end{aligned}
$$

令 $\Delta\pi\rightarrow 0$，得

$$
\underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx\geqslant\underline{\int}_{P\times Q} f = \int_{P\times Q}f
$$

- 我们再对 $\overline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx$ 进行估计。（原理相同，只需把 $\geqslant$ 换成 $\leqslant$，$\inf$ 换成 $\sup$）

$$
\overline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx \leqslant \sum_{p\in\pi_1}\left(\sup_{x\in p}\underline{\int}_Qf(x, y)\,dy\right)V(p)
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
\overline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx &\leqslant \sum_{p\in\pi_1}\sum_{q\in\pi_2}M_{p\times q}V(p)V(q)\\
&\leqslant \sum_{p\times q\in \pi}M_{p\times q} V(p\times q)\\
&\leqslant \overline{\int}_{P\times Q} f
\end{aligned}
$$

令 $\Delta\pi\rightarrow 0$，得

$$
\overline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx\leqslant\overline{\int}_{P\times Q} f = \int_{P\times Q}f
$$

- 综上，有

$$
\begin{aligned}
\int_{P\times Q}f = \underline{\int}_{P\times Q} f\leqslant \underline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx\leqslant\overline{\int}_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx\leqslant\overline{\int}_{P\times Q}f = \int_{P\times Q}f
\end{aligned}
$$

则，$\underline{\int}_Qf(x, y)\,dy$ 可积，且 

$$
\int_{P\times Q} f = \int_P\left\{\underline{\int}_Qf(x, y)\,dy\right\}\,dx
$$

### 推论2（积分函数连续）

设 $P\subset\mathbb R^n, Q\subset\mathbb R^m$ 均为闭方体，$f\in C(P\times Q)$，则 

$$
\begin{aligned}
\int_{P\times Q} f = \int_P\left\{\int_Qf(x, y)\,dy\right\}\,dx = \int_Q\left\{\int_Pf(x, y)\,dx\right\}\,dy
\end{aligned}
$$

---

**证明：** 由于 $f\in C(P\times Q)$，所以 $f$ 在 $P$ 上连续，也在 $Q$ 上连续，且 $P,Q$ 均为闭方体，则 $f$ 在 $P, Q$ 上可积，于是由 [Darboux定理](/posts/57273/#定理7-riemmann可积iffdarboux可积) 知：

$$
\begin{aligned}
\underline{\int}_Qf(x,y)\,dy = \overline{\int}_Qf(x, y)\,dy = \int_Qf(x, y)\, dy\\
\underline{\int}_Pf(x,y)\,dx = \overline{\int}_Pf(x, y)\,dx = \int_Qf(x, y)\, dx\\
\end{aligned}
$$

再通过 [定理1](./#定理1fubini定理) 得证。

### 推论3（求曲面柱的“体积”）

设 $\Omega\subset\mathbb R^{n-1}$ 为有界开集，$m^*(\partial\Omega) = 0$，设 $\varphi, \psi\in C(\overline{\Omega})$，且 $\forall x\in \Omega,\ \varphi(x) < \psi(x)$。

记 $D = \{(x, y): x\in \Omega, \varphi(x) < y < \psi(x)\}$。（注：这里 $x$ 是 $n-1$ 维的，$y$ 是 $1$ 维的）

设 $f\in C(\bar{D})$，则
$$
\begin{aligned}
\int_{\bar{D}}f = \int_{\overline{\Omega}}\left\{\int_{\varphi(x)}^{\psi(x)}f(x, y)\,dy\right\}\,dx
\end{aligned}
$$

---

**思路：** 先证明内侧积分有意义，再用闭方体对 $\bar{D}$ 进行一个覆盖，通过有界集积分的定义写出来，最后将恒为零的部分删去即可。

**证明：** 

由于 $\partial D\subset(\partial\Omega\times\mathbb R)\cup(\text{graph }\varphi)\cup(\text{graph }\psi)$。

因为 $m^*(\partial\Omega) = 0$，则 $m^*(\partial\Omega\times\mathbb R)=0$（通过定义证明），又由 [note1 - 命题10](/posts/57273/#命题10-低维函数在高维中的图像测度为0) 知，$m^*(\text{graph }\varphi)=m^*(\text{graph }\psi)=0$。

故 $m^*(\partial D)=0$，又因为 $f\in C(\bar{D})$ 有界，所以 $f$ 可积。

设 $P\subset \mathbb R^{n-1}$ 为闭方体，使得 $\overline{\Omega}\subset P^\circ$。设 $m+1\leqslant\varphi(x) < \psi(x)\leqslant M-1$。

记 $Q = P\times [m,M]$，则 $\bar{D}\subset Q$。

设 $\tilde{f}$ 是 $f$ 在 $Q$ 上的零延拓，则

$$
\begin{aligned}
\int_{\bar{D}}f=\int_Q\tilde{f}=\int_P\left\{\int_m^M\tilde{f}(x, y)\,dy\right\}\,dx
\end{aligned}
$$

记 $I(x) = \int_m^M\tilde{f}(x, y)\,dy$。

当 $x\in P-\overline{\Omega}$，$\tilde{f}(x, y)=0\Rightarrow I(x) = 0$。

则 $x\in\overline{\Omega}$ 时， 
$$
\begin{aligned}
I(x)=\int_m^M\tilde{f}(x, y)dy = \int_{\varphi(x)}^{\psi(x)}\tilde{f}(x, y)dy = \int_{\varphi(x)}^{\psi(x)}f(x, y)dy
\end{aligned}
$$

故

$$
\begin{aligned}
\int_{\bar{D}}f &= \int_P\left\{\int_m^M\tilde{f}(x, y)\,dy\right\}\,dx\\
&= \int_{\overline{\Omega}}\left\{\int_m^M\tilde{f}(x, y)\,dy\right\}\,dx\\
&= \int_{\overline{\Omega}}\left\{\int_{\varphi(x)}^{\psi(x)}f(x, y)\,dy\right\}\,dx\\
\end{aligned}
$$

**QED**

**由于边界积分为零：** 故可以把边界去掉，即

$$
\begin{aligned}
\int_Df=\int_\Omega\left\{\int_{\varphi(x)}^{\psi(x)}f(x, y)\,dy\right\}\,dx
\end{aligned}
$$

**求曲面柱体积：** 令 $f=1$，即

$$
\begin{aligned}
V(D)=\int_{\Omega}(\psi(x)-\varphi(x))\,dx
\end{aligned}
$$
