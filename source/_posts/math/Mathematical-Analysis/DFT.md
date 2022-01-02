---
title: 离散傅里叶变换 离散傅里叶逆变换
hide: false
math: true
abbrlink: 5758
date: 2022-01-02 15:04:00
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
---

本次笔记参考 [Stein Shakarchi 1 Fourier Analysis](http://kryakin.site/am2/Stein-Shakarchi-1-Fourier_Analysis.pdf) 218页到223页的内容，下文只证明了 $Z_N$ 中的傅里叶变换，更一般的，在 $\text{Abel}$ 群中的傅里叶变换可以参考此书。

## DFT 与 IDFT

> DFT:Discrete Fourier Transform 离散傅里叶变换
IDFT:Inverse Discrete Fourier Transform 离散傅里叶逆变换

令 $F:\mathbb Z_N\rightarrow \mathbb C$（$\mathbb Z_N$ 为模 $N$ 下的整数加群，同构于 $N$ 阶 $\text{Abel}$ 群），定义

$$
\begin{aligned}
\hat{F}(n) =&\ \frac{1}{N}\sum_{k=0}^{N-1}F(k)e^{\frac{-2\pi i}{N}nk}&\text{离散傅里叶变换 DFT}\\
F(k) =&\ \sum_{n=0}^{N-1}\hat{F}(n)e^{\frac{2\pi i}{N}nk}&\text{离散傅里叶逆变换 IDFT}
\end{aligned}
$$

---

**思考**： 这种形式的定义是类比一般形式的傅里叶变换系数的，设 $f :\mathbb R\rightarrow \mathbb C$，$f$ 周期为 $L$，且 $f\in L^1([0,L])$，则 $f$ 的第 $n$ 个傅里叶系数为

$$
\hat{f}(n) = \frac{1}{L}\int_0^Lf(x)e^{-\frac{2\pi i}{L}nx}
$$

且 

$$
f(x)\sim \sum_{n=-\infty}^{+\infty}\hat{f}(n)e^{\frac{2\pi i}{L}nx}
$$

则 $F:\mathbb Z_n\rightarrow \mathbb C$ 可视为周期为 $N$ 的复值函数，则这两个定义类似。

**证明**： 设 $V := \{F:\mathbb Z_N\rightarrow \mathbb C\}$，则 $V$ 为线性空间，令 $\xi = e^{\frac{2\pi i}{N}}$，记

$$
e_l(k) = \xi^{lk} = e^{\frac{2\pi i}{N}lk}
$$

则 $e_l$ 为周期为 $N$ 的离散函数，$e_l\in V$。

定义 $\text{Hermite}$ 内积，设 $F, G\in V$，则

$$
\langle F, G\rangle = \sum_{k = 0}^{N-1}F(k)\overline{G(k)}
$$

对应的范数为

$$
||F||^2 = \langle F, F\rangle = \sum_{k = 0}^{N-1}|F(k)|^2
$$


下证 $\{e_0, e_1, \cdots, e_{N-1}\}$，在 $\text{Hermite}$ 内积下正交

任意的 $m, l\in \{0, 1, \cdots, N-1\}$，则

$$
\begin{aligned}
\langle e_m, e_l\rangle = \sum_{k=0}^{N-1}e_m(k)\overline{e_l(k)} = \sum_{k= 0}^{N-1}\xi^{mk}\xi^{-lk} = \sum_{k=0}^{N-1}\xi^{(m-l)k}
\end{aligned}
$$

当 $m=l$ 时，$\langle e_m, e_m \rangle = N\Rightarrow |e_m| = \sqrt{N}$

当 $m \neq l$ 时，记 $\xi^{(m-l)} = q$，则 $q^N = 1$，

$$
\langle e_m, e_l \rangle = \sum_{k=0}^{N-1}q^k = \frac{1-q^N}{1-q} = 0
$$

由于 $V$ 是 $n$ 维空间，则 $\{e_0, e_1,\cdots, e_{N-1}\}$ 为 $V$ 上的一组正交基。

记

$$
e_i^* = \frac{1}{\sqrt{N}}e_i\quad(0\leqslant i\leqslant N-1)
$$

则 $\{e_0^*, e_1^*, \cdots, e_{N-1}^*\}$ 为 $V$ 上的一组**单位**正交基，则

$$
F = \sum_{ k =0}^{N-1}\langle F,e_k^* \rangle e_k^*
$$

推导结论

$$
\begin{aligned}
\hat{F}(n) =&\ \frac{1}{N}\sum_{k=0}^{N-1}F(k)e^{\frac{-2\pi i}{N}nk}&\text{离散傅里叶变换 DFT}\\
=&\ \frac{1}{N}\sum_{k=0}^{N-1}F(k)\overline{e_n(k)}\\
=&\ \frac{1}{N}\langle F, e_n \rangle\\
=&\ \frac{1}{\sqrt{N}}\langle F,e_n^* \rangle\\
\sum_{n=0}^{N-1}\hat{F}(n)e^{\frac{2\pi i}{N}nk}=&\ \sum_{n=0}^{N-1}\hat{F}(n)e_n(k)&\text{离散傅里叶逆变换 IDFT}\\
=&\ \sum_{n=0}^{N-1}\frac{1}{\sqrt{N}}\langle F,e_n^* \rangle\sqrt{N}e_n^*(k)\\
=&\ \sum_{n=0}^{N-1}\langle F,e_n^*\rangle e_n^*(k)\\
=&\ \langle F,e_n^* \rangle e_n^*(k)\\
=&\ F(k)
\end{aligned}
$$

当然，将两者的定义反过来，上述推导也是正确的，于是也可以如下定义

$$
\begin{aligned}
\hat{F}(k) =&\ \sum_{n=0}^{N-1}\hat{F}(n)e^{\frac{2\pi i}{N}nk}&\text{离散傅里叶变换 DFT}\\
F(n) =&\ \frac{1}{N}\sum_{k=0}^{N-1}F(k)e^{\frac{-2\pi i}{N}nk}&\text{离散傅里叶逆变换 IDFT}
\end{aligned}
$$

由于这样计算 $DFT$ 比较简单，下面采用这种定义。

## 利用离散傅里叶变换求卷积

设 $F, G:\mathbb Z_n\rightarrow \mathbb C$，定义 $F$ 与 $G$ 的卷积为

$$
F * G(n) = \sum_{k=0}^{N-1}F(k)G(n-k)
$$

则卷积与离散傅里叶变换有如下关系

$$
\widehat{F * G}(n) = \hat{F}(n)\hat{G}(n)
$$

---

**应用**： 这种形式的卷积一个很重要的应用就是求 **多项式乘法**，设 $P_n(x), Q_n(x)$ 为两个多项式：

$$
\begin{aligned}
P_n(x) = a_0+a_1x+\cdots+a_nx^n\\
Q_n(x) = b_0+b_1x+\cdots+b_nx^n
\end{aligned}
$$

则

$$
P_n(x)Q_n(x) = \sum_{m=0}^{2n}\left(\sum_{k=0}^ma_kb_{m-k}\right)x^m
$$

其中

$$
\sum_{k=0}^ma_kb_{m-k}
$$

就是 $P_n(x),Q_n(x)$ 对应系数的卷积了。

**证明**： 直接计算

$$
\begin{aligned}
\widehat{F*G}(n)=&\ \sum_{m=0}^{N-1}F*G(m)e_n(m)\\
=&\ \sum_{m = 0}^{N-1}\sum_{k=0}^{N-1}F(k)G(m-k)e_n(m)\\
=&\ \sum_{k=0}F(k)e_n(k)\sum_{m=0}^{N-1}G(m-k)e_n(m-k)\\
\xlongequal{\text{由于} G\text{周期为} N}&\ \sum_{k=0}F(k)e_n(k)\sum_{m=0}^{N-1}G(m)e_n(m)\\
=&\ \hat{F}(n)\hat{G}(n)
\end{aligned}
$$

于是可以将求解 $F*G$ 的问题，转化为先求解 $F, G$ 的离散傅里叶变换 $\hat{F}, \hat{G}$，然后逐项相乘得到 $\widehat{F*G}$，然后再使用离散傅里叶逆变换求得 $F*G$。

如果能在时间复杂度为 $O(N\log N)$ 中求解离散傅里叶变换（类似的离散傅里叶逆变换也可求解，只需要改变正负号，再乘上 $\frac{1}{N}$ 即可），逐项相乘的复杂度为 $O(N)$，则求解 $F,G$ 的卷积 $F*G$，就可以在 $O(N\log N)$ 下求解了。

在 $O(N\log N)$ 的复杂度下求解离散傅里叶变换的算法叫做 **快速傅里叶变换**（FFT:Fast Fourier Transform），其主要思想是 **分治合并** 的思想，对奇偶分类合并，使用位逆序置换加速，还有很多细节，详细代码和过程可以看 [算法总结 - 快速傅里叶变换](/posts/57899/#离散傅里叶变换)（当初学习FFT后对傅里叶变换理解还是十分模糊，因为当时使用代数的方法（矩阵）证明的，并没有从分析上进行定义，这次相当于用分析的方法，再解释一次DFT和IDFT的原理）
