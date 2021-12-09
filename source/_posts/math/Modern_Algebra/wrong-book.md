---
title: 近世代数 习题&思考
hide: false
math: true
abbrlink: 25019
date: 2021-11-15 22:03:14
index_img:
banner_img:
category:
 - Math
 - 近世代数
tags:
 - 错题
---

## 群在集合上的作用，轨道-稳定子定理

需要掌握的：

1. 求群 $G$ 的**中心**， **自同构群**，**共轭类**。

### 求中心

根据中心的定义求解：

$$
\begin{aligned}
Z(G) =&\ \{x\in G: \forall y\in G, xy = yx\}（与所有元素都可交换）\\
= &\ \{x\in G: \forall y\in G, xyx^{-1} = y\}\\
\iff& 在共轭作用下 G 的不动点集 G_0。
\end{aligned}
$$

#### 例1（求Sn的中心）

> 求 $S_n$ 的中心，其中 $n\geqslant 3$。

**解：** $\forall \sigma\in S_n,\ \sigma\neq (1)$，将 $\sigma$ 分解为不相交的轮换之积的形式：

$$
\sigma = (a_1a_2\cdots a_{l_1})(b_1b_2\cdots b_{l_2})\cdots(p_1p_2\cdots p_{l_k})
$$

其中 $l_1 \geqslant l_2\geqslant \cdots\geqslant l_k$，且 $l_1+l_2+\cdots +l_k = n$，将有序数组 $(l_1,l_2,\cdots,l_k)$ 称为 $n$ 的**分拆**，也是 $\sigma$ 的**型**。

分两种情况：

1. 如果 $l_1\geqslant 3$，令 $\tau = (a_1a_2)$，则

$$
\tau\sigma\tau^{-1} = (a_1a_3\cdots a_{l_1}a_2)(b_1b_2\cdots b_{l_2})\cdots(p_1p_2\cdots p_{l_k})\neq \sigma
$$

2. 如果 $l_1 = 2$，则 $\sigma = (a_1a_2)$，令 $\tau = (a_1b_1)$，则

$$
\tau\sigma\tau^{-1} = (b_1a_2)\neq \sigma
$$

综上，$\sigma\equiv (1)$，所以 $Z(S_n) = \{(1)\}$。

#### 例2（求Dn的中心）

> 求 $D_{2m-1},D_{2m}$ 的中心，其中 $m\geqslant 2$。

**解：** 由于 $D_n = \{\sigma, \tau: \sigma^n = \tau^2 = \text{Id}\text{ 且 } \tau\sigma\tau = \sigma^{-1}\}\quad (n\geqslant 3)$，则

$$
\begin{aligned}
&\tau\sigma^{m}\tau = \sigma^{-m}\\
\Rightarrow\  &\tau\sigma^{m} = \sigma^{n-m}\tau
\end{aligned}
$$

这告诉我们 $\sigma, \tau$ 之间的交换所需满足的关系。所以，对于任意一个对称变换 $\tau\in D_n$，有

$$
\sigma\tau\sigma^{-1} = \sigma\sigma^{n+1}\tau = \sigma^{2}\tau\neq \tau
$$

则对称变化 $\tau\notin Z(S_n)$，$\sigma^m\in D_n$，$m\in[1,n]$，只需要讨论共轭对象为 $\tau$ 的情况

$$
\tau\sigma^m\tau^{-1} = \sigma^{-m} = \sigma^{m}
$$

则 $-m\equiv m\pmod n\Rightarrow 2m\equiv 0\pmod n$，所以 $m = \dfrac{n}{2}$（当 $n$ 为偶数）。

综上，$D_{2m-1} = \{\text{Id}\},\ D_{2m} = \{\text{Id}, \sigma^m\}$。

### 求自同构群

即求群 $G$ 上全体自同构变换，根据书本总结方法如下：

1. 如果群 $G$ 太大逐个定义运算不现实，所以先寻找 $G$ 的生成元，然后只需要定义生成元上的变化即可。

2. 自同构变换将同阶元映射到同阶元上（置换），所以考虑将生成元中的同阶元分类，然后考虑同阶元之间的置换。

所以自同构变换的本质还是归结到求置换群上，通过下面几个例子，尝试熟悉这个方法。

## Cayley 定理（群的本质）

**Cayley 定理**： 任意一个群同构于某一集合上的变换群。

**推论**： 任何有限群同构于一个置换群。

**思路**： 构造 $G\curvearrowright G$ 上的**左平移**，则不难证明其对应的群同态 $\psi:G\rightarrow S_G$ 是**忠实的**，由群同态基本定理 $G\cong \text{Im }\psi$

**注**： $Cayley$ 定理说明，任何有限群本质上都是置换群，所以可以将群上的问题转化为置换群，利用置换群的性质求解。

### 引理（存在指数为2的子群）

> 证明：如果置换群 $G$ 含有奇置换，那么 $G$ 必有指数为 $2$ 的子群。

**思路**：含有奇置换，则 $G$ 一定有偶置换，构造如下群同态 $\sigma$：

$$
\begin{aligned}
\sigma:\ G&\rightarrow U_2\\
g&\mapsto \sigma(g)=\begin{cases}
1&g\text{为偶置换}\\
-1&g\text{为奇置换}
\end{cases}
\end{aligned}
$$

其中 $U_2$ 为由 $\{-1,1\}$，运算为复数乘法，构成的 $2$ **次单位根群**（Unit root）（可以理解为复平面上，单位球的左右两个点，$U_n$ 中的元素就是单位球上的 $n$ 等分点）。

不难验证 $\sigma$ 是满同态，则 $[G:\text{Ker }\sigma] = |\text{Im }\sigma| = 2$，故 $\text{Ker }\sigma$ 是 $G$ 中指数为 $2$ 的子群，不难看出 $\text{Ker }\sigma$ 为 $G$ 中的全体偶置换。

---

下面两个例题，体现了对左平移作用的运用和引理的运用。

### 例1

> 设 $G$ 为一个 $2k$ 阶群，$k$ 为奇数。证明：$G$ 必有指数为 $2$ 的子群。

**思路**： 构造 $G\curvearrowright G$ 上的左平移，则 $|\text{Im }\psi| = |G| = 2k$，则一定存在 $\psi(g)$，阶数为 $2$，且没有不动点（反证法），即

$$
\psi(g) = (x_1x_2)(x_3x_4)\cdots(x_{2k-1}x_{2k})
$$

则 $\psi(g)$ 为奇置换，由**引理**得证。

### 例2

> 证明：如果有限群 $G$ 有一个循环的 $Sylow\ 2\text{ -子群}$，那么 $G$ 有一个指数为 $2$ 的子群。

**思路**： 设 $|G| = 2^l\cdot m$，$G$ 上循环的 $Sylow\ 2\text{ -子群}$ 为 $P$，令 $P = \langle a\rangle$，构造 $G\curvearrowright G$ 上的左平移，则

$$
\begin{aligned}
\psi(a) = (e,a,a^2\cdots a^{2^l-1})(b_1,b_1a\cdots b_1a^{2^l-1})\cdots(b_m,b_ma\cdots b_ma^{2^l-1})
\end{aligned}
$$

其中 $b_i$ 分别属于不同的 $(G/P)_l$ 中，所以 $\psi(a)$ 是由 $m$ 个 $2^l\text{ -轮换}$ 构成，又由于 $2^l\text{ -轮换}$ 可以分解为 $2^l-1$ 个对换之积，故 $\psi(a)$ 为 $m\cdot (2^l-1)$ 个对换之积（$m,2^l-1$ 均为奇数），所以 $\psi(a)$ 为奇置换，由**引理**得证。

## Sylow定理

设 $|G| = p^l\cdot m$，$p$ 为素数且 $(p,m) = 1$。

**Sylow 第一定理**：$\forall\ 1\leqslant k\leqslant l$，则 $G$ 一定存在 $p^k$ 阶子群，并称 $p^l$ 阶子群为 $Sylow\ p\text{ -子群}$。

**Sylow 第二定理**：$\forall\ 1\leqslant k\leqslant l$，则 $G$ 的 $p^k$ 阶子群一定包含于 $G$ 的某个 $Sylow\ p\text{ -子群 }$ 中，且 $G$ 的任意两个 $Sylow\ p\text{ -子群 }$ 共轭。

**Sylow 第三定理**：设 $G$ 的 $Sylow\ p\text{ -子群}$ 一共有 $r$ 个，则 $r$ 满足：
$$r\equiv 1\pmod p\text{ 且 } r|m$$

### 证明不存在多少阶的单群

题目一般要求证明不存在阶为 $n$ 的单群，即去证明群 $G$ 一定有非平凡正规子群，根据书本总结出以下三种方法：

1. $Sylow\ p\text{ -子群 } P$ 唯一，则 $P\triangleleft G$。

2. 设 $Sylow\ p\text{ -子群 }P_i$ 一共有 $r$ 个，构造 $G$ 到全体 $Sylow\ p\text{ -子群 }P_i$ 的共轭作用（记 $\Omega =\{P_i:i=1,\cdots,r\}$），设其对应的群同态为 $\psi:G\rightarrow S_{\Omega}$，利用群同态基本定理得 $\dfrac{|G|}{|\text{Ker }\psi|} = |\text{Im }\psi|\biggl ||S_r| = r!$，如果 $|G| > r!$，则 $|\text{Ker }\psi|\geqslant 2$，所以 $\text{Ker }\psi$ 非平凡（易证 $\text{Ker }\psi\neq G$），且 $\text{Ker }\psi\triangleleft G$。**核心条件**：$|G| > r!$

3. 若 $|G| = pq$，$p$ 为素数，且 $(p,q) = 1$，则取 $Sylow\ p\text{ -子群 }P$，则 $P$ 一定为循环群，设其有 $r$ 个，则 $G$ 中当且仅有 $r(p-1)$ 个 $p$ 阶元，接下来将 $G$ 中这些元素排除掉，在继续讨论剩余的元素。（排除法）

其中**排除法**在 $Sylow p\text{ -子群}$ 的阶为 $p$ 的时候，有很好的作用，如：

#### 例一

> 设 $p, q$ 是不同的素数，证明：$p^2q$ 阶群必有一个正规的 $Sylow$ 子群。

**思路**： 分为 $p> q$，$p < q$，第一种显然有，第二种，讨论 $Sylow q\text{ -子群}$ 的个数，只能为 $1, p^2$，当为 $p^2$ 时，使用**排除法**即可证明 $Sylow p\text{ -子群}$ 个数唯一。

#### 例二

> 1. 不存在 $148$ 阶单群。（法1）
> 2. 不存在 $36$ 阶单群。（法2）
> 3. 不存在 $56$ 阶单群。（法3）
> 4. 不存在 $30$ 阶单群。（法3）

### 确定群的类型

难度过高，记住几个基础的。

1. $p^2$ 阶：$\mathbb Z_{p^2},\  \mathbb Z_{p}\oplus\mathbb Z_{p}$

2. $pq$ 阶（$p,q$ 均为素数，且 $p< q$）：$\mathbb Z_{pq},\ P\rtimes H$，其中 $P$ 为 $q$ 阶正规子群，$H$ 为 $p$ 阶群。

3. $2p$ 阶：$\mathbb Z_{2p},\ D_{p}$

4. $p$ 阶：$\mathbb Z_{p}$

5. $8$ 阶：$\mathbb Z_{8},\ \mathbb Z_{4}\oplus\mathbb Z_{2},\ \mathbb Z_{2}\oplus\mathbb Z_{2}\oplus\mathbb Z_{2},\ D_4,\ Q$，其中 $Q=\{\pm 1,\pm i,\pm j,\pm k\}$ 为四元数群。

## 素理想和极大理想

素理想 $P$：$ab\in P\Rightarrow a\in P\text{ 或 }b\in P$。

极大理想 $M$：$R$ 中包含 $M$ 的理想**只有** $R$ 和 $M$ 自身。

### 环为主理想整环

> $R$ 为主理想整环，$P$ 为 $R$ 中的理想，证明：$P$ 为非零素理想 $\iff$ $P$ 为极大理想。
主理想环：$R$ 中的每一个理想都是某一个元素所生成的主理想。

**证明**： “$\Leftarrow$”： 显然。

“$\Rightarrow$”： 令 $P$ 为 $R$ 中的非零素理想，则 $\exists\ a\in R,\ a\neq 0$，使得 $P = (a)$，设存在 $R$ 的一个理想 $I$，使得 $P\subset I$，则 $\exists\ b\in R$，使得 $I = (b)$。下证 $I = R$ 或者 $I = P$。

由于 $(a)\subset (b)$，则 $\exists\ r\in R$，使得 $a = rb\Rightarrow r\in (a)或者 b\in(a)$。

1. 若 $b\in(a)$，则 $(b)\subset (a)$，故 $(a) = (b)\Rightarrow I = P$。
2. 若 $r\in (a)$，则 $\exists\ t\in R$，使得 $r = ta$，则 $a = tab\Rightarrow (tb-1)a = 0$，由于 $R$ 为整环，
所以 $tb-1=0或a=0$，则 $tb = 1\in (b)$，则 $(b) = R$，则 $I = R$。

综上，$P$ 为 $R$ 中的极大理想。

