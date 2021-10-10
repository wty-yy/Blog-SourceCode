---
title: n维球体积公式
hide: false
math: true
abbrlink: 32003
date: 2021-10-10 17:54:09
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - 积分
 - 数列
---

学习完 [Fubini定理](/posts/54113/#fubini-定理) 和 [积分变量替换]() 之后，基本就可以求解这个问题了。

### 问题

记

$$
\begin{aligned}
B_1 &= \{x\in\mathbb R^n: |x| < 1\},\quad \text{n维单位球}\\
B_R &= \{x\in\mathbb R^n: |x| < R\},\quad \text{n维半径为R的球}\\
\omega_n &= V(B_1) = \int_{B_1} 1\, dx,\quad \text{n维球的体积}\\
I_n &= \int_0^{\frac{\pi}{2}} \cos^n\theta\,d\theta,\quad \text{过程量}
\end{aligned}
$$

求解 $\omega_n$ 的表达式。

### 步骤

按照周老师的证明步骤进行证明，将证明分为以下三步：

1. $\omega_{n+1} = 2\omega_nI_{n+1}$，Fubini定理

2. $\displaystyle I_{n+1} = \frac{n}{n+1}I_{n-1}$，分部积分公式

3. $\displaystyle \omega_n = \frac{2\pi^{\frac{n}{2}}}{n\Gamma(\frac{n}{2})}$，数列递推公式

其中 $\Gamma(\cdot)$ 为 [Gamma函数](https://zhuanlan.zhihu.com/p/114041258)。

### 证明

#### 第一步

由 [积分变量替换]() 知，$n$ 为空间上 $B_R = R^nB_1$。

利用 Fubini 定理，将 $n+1$ 维积分转化为 $n$ 维和 $1$ 维积分。

$$
\begin{aligned}
\omega_{n+1} &= \int\limits_{x_1^2+x_2^2+\cdots+x_{n+1}^2\leqslant 1}1\,dx_1dx_2\cdots dx_{n+1}\\
&= \int^1_{-1}\left\{\int_{x_1^2+x_2^2+\cdots+x_n^2\leqslant 1-x_{n+1}^2}1\,dx_1\cdots dx_n\right\}dx_{n+1}\\
&= 2\int^1_0B_{\sqrt{1-x_{n+1}^2}}\,dx_{n+1}\\
&= 2\omega_n\int^1_0(1-x_{n+1}^2)^{\frac{n}{2}}\,dx_{n+1}\\
&\xlongequal{x_{n+1} = \sin\theta} 2\omega_n\int_0^{\frac{\pi}{2}}(\cos^2\theta)^{\frac{n}{2}}\,d\sin\theta\\
&= 2\omega_n\int_0^{\frac{\pi}{2}}\cos^{n+1}\theta\,d\theta\\
&= 2\omega_nI_{n+1}
\end{aligned}
$$

#### 第二步

$$
\begin{aligned}
I_{n+1} &= \int_0^{\frac{\pi}{2}}\cos^{n+1}\theta\,d\theta\\
&= \int_0^{\frac{\pi}{2}}\cos^n\theta\,d\sin\theta\\
&= \cos^n\theta \sin\theta\bigg|_0^{\frac{\pi}{2}}-\int_0^{\frac{\pi}{2}}\sin\theta\cdot n\cos^{n-1}\theta\cdot(-\sin\theta)\,d\theta\\
&= n\int_0^{\frac{\pi}{2}}\sin^2\theta\cos^{n-1}\theta\,d\theta\\
&= n\int_0^{\frac{\pi}{2}}(1-\cos^2\theta)\cos^{n-1}\theta\,d\theta\\
&= n\int_0^{\frac{\pi}{2}}\cos^{n-1}\,d\theta - n\int_0^{\frac{\pi}{2}}\cos^{n+1}\theta\,d\theta\\
&= nI_{n-1} - nI_{n+1}\\
\Rightarrow I_{n+1} &= \frac{n}{n+1}I_{n-1}
\end{aligned}
$$

#### 第三步

由第二步结论 $\displaystyle I_{n+1} = \frac{n}{n+1}I_{n-1}$，对 $n$ 分奇偶讨论：

$$
\begin{aligned}
I_{2n+1} &= \frac{2n}{2n+1}\cdot\frac{2n-2}{2n-1}\cdots\frac{2}{3}I_1 = \frac{(2n)!!}{(2n+1)!!}\\
I_{2n} &= \frac{2n-1}{2n}\cdot\frac{2n-3}{2n-2}\cdots\frac{1}{2}I_0 = \frac{(2n-1)!!}{(2n)!!}\cdot\frac{\pi}{2}
\end{aligned}
$$

于是，由第一步结论 $\omega_{n+1} = 2\omega_nI_{n+1}$，得

$$
\begin{aligned}
\omega_{2n+1} &= 2\omega_{2n}I_{2n+1}\\
&= 2^2\cdot I_{2n+1}I_{2n}\omega_{2n-1}\\
&= 2^3\cdot I_{2n+1}I_{2n}I_{2n-1}\omega_{2n-2}\\
&\ \ \vdots\\
&= 2^{2n}I_{2n+1}I_{2n}\cdots I_2\omega_1
\end{aligned}
$$

其中 $\omega_1$ 就是一维单位球体积，一维是一条线，则 $B_1$ 就是一条长度为 $2$ 的线段，所以 $\omega_1 = 2$，则

$$
\begin{aligned}
\frac{\omega_{2n+1}}{2^{2n+1}} &= I_{2n+1}I_{2n}\cdots I_2\\
&= (I_{2n+1}I_{2n-1}\cdots I_3)(I_{2n}I_{2n-2}\cdots I_2)\\
&= \left(\frac{(2n)!!}{(2n+1)!!}\cdot\frac{(2n-2)!!}{(2n-1)!!}\cdots\frac{4!!}{5!!}\cdot\frac{2!!}{3!!}\right)\left(\frac{(2n-1)!!}{(2n)!!}\cdot\frac{(2n-3)!!}{(2n-2)!!}\cdots\frac{3!!}{4!!}\cdot\frac{1!!}{2!!}\right)\left(\frac{\pi}{2}\right)^n\\
&= \frac{1}{(2n+1)!!}\cdot\left(\frac{\pi}{2}\right)^n
\end{aligned}
$$

故

$$
\omega_{2n+1} = \frac{2(2\pi)^n}{(2n+1)!!}
$$

再由 $\omega_n = 2\omega_{n-1}I_{n}$，得

$$
\begin{aligned}
\omega_{2n} &= 2\omega_{2n-1}I_{2n}\\
&= 2\cdot \frac{2(2\pi)^{n-1}}{(2n-1)!!}\cdot\frac{(2n-1)!!}{(2n)!!}\cdot\frac{\pi}{2}\\
&= \frac{(2\pi)^n}{2n(2n-2)(2n-4)\cdots4\cdot2}\\
&= \frac{(2\pi)^n}{2^n\cdot n!}\\
&= \frac{\pi^n}{n!}
\end{aligned}
$$

综上

$$
\begin{cases}
\omega_{2n} = \dfrac{\pi^n}{n!}\\
\omega_{2n+1} = \dfrac{2(2\pi)^n}{(2n+1)!!}
\end{cases}
$$

对目标结论 $\displaystyle \omega_n = \frac{2\pi^{\frac{n}{2}}}{n\Gamma(\frac{n}{2})}$，进行验证。

代入 $2n$，得

$$
\begin{aligned}
\omega_{2n} &= \frac{2\pi^n}{2n\Gamma(n)}\\
&=\frac{\pi^n}{n\cdot(n-1)!}\\
&=\frac{\pi^n}{n!}
\end{aligned}
$$

成立！

再代入 $2n+1$，得

$$
\begin{aligned}
\omega_{2n+1} &= \frac{2\pi^{\frac{2n+1}{2}}}{(2n+1)\Gamma(\frac{2n+1}{2})}\\
&= \frac{2\pi^{n}\sqrt{\pi}}{(2n+1)\Gamma(n+\frac{1}{2})}
\end{aligned}
$$

利用公式 $\Gamma(x+1)=x\Gamma(x)$，得

$$
\begin{aligned} \Gamma\left(n + \frac{1}{2}\right) & =\left(n-1+\frac{1}{2}\right)\Gamma\left(n-1+\frac{1}{2}\right) \\ & =\left(n-1+\frac{1}{2}\right)\left(n-2+\frac{1}{2}\right)\Gamma\left(n-2+\frac{1}{2}\right) \\ & = \ldots = \left(n-\frac{1}{2}\right)\left(n-\frac{3}{2}\right)\dots \ \frac{1}{2}\ \Gamma\left(\frac{1}{2}\right) \\ & = \frac{(2n-1)(2n-3)\cdots1}{2^n} \cdot \Gamma\left( \frac{1}{2}\right) \\
&= \frac{(2n-1)!!}{2^n}\cdot \Gamma\left(\frac{1}{2}\right)\\
&= \frac{(2n-1)!!}{2^n} \sqrt{\pi}\\
\end{aligned}
$$

则

$$
\begin{aligned}
\omega_{2n+1} &= \frac{2\pi^{n}\sqrt{\pi}}{(2n+1)\frac{(2n-1)!!}{2^n} \sqrt{\pi}}\\
&= \frac{2(2\pi)^n}{(2n+1)!!}
\end{aligned}
$$

成立！！

综上，原命题得证，$n$ 维单位球的体积公式为

$$
\omega_n = \frac{2\pi^{\frac{n}{2}}}{n\Gamma(\frac{n}{2})}
$$

计算式

$$
\begin{cases}
\omega_{2n} = \dfrac{\pi^n}{n!}\\
\omega_{2n+1} = \dfrac{2(2\pi)^n}{(2n+1)!!}
\end{cases}
$$

### 参考

[1]. $\omega_n$ 部分的递推，参考了 [知乎 - n维球的体积](https://zhuanlan.zhihu.com/p/195437770)

[2]. Gamma函数部分的递推，参考了 [Math.StackExchange - Proving that $\Gamma \left(n+ \frac{1}{2}\right) = \frac{(2n)!\sqrt{\pi}}{2^{2n}n!}$](https://math.stackexchange.com/questions/1444967/proving-that-gamma-leftn-frac12-right-frac2n-sqrt-pi22n/1445004#1445004)
