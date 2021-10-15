---
title: 多项式定理
hide: false
math: true
abbrlink: 36121
date: 2021-10-15 10:50:47
index_img:
banner_img:
category:
 - Math
tags:
 - 多项式
---

## 定义

$$
\begin{aligned}
\binom{n}{n_1,n_2,\cdots,n_t} = \frac{n!}{n_1!n_2!\cdots n_t!}
\end{aligned}
$$

其中 $n_i\geqslant 0$，且 $\displaystyle \sum_{i=1}^tn_i = n$。

**含义：**

将 $n$ 个不同的物品，放入 $t$ 个盒子中，要求第 $i$ 个盒子中含有 $n_i$ 个物品的总方案数。

对这 $n$ 个物品进行全排列，重数就是每一个盒子中的排列数 $n_i!$。

**推论：**

和二项式系数的联系：$\displaystyle \text{令 }t=2,\text{则 } \binom{n}{n_1,n_2} =\frac{n!}{n_1!(n-n_1)!} = \binom{n}{n_1} = \binom{n}{n_2}$。

类似于二项式系数递推式，这个也有递推式（如果令 $t=2$，则下式就是二项式递推式（妙呀））：

$$
\begin{aligned}
\binom{n}{n_1, n_2, \cdots, n_t} = \binom{n-1}{n_1-1, n_2, \cdots, n_t} + \binom{n-1}{n_1, n_2-1, \cdots, n_t} + \cdots +\binom{n-1}{n_1, n_2, \cdots, n_t-1}
\end{aligned}
$$

## 多项式定理

设 $n\in\mathbb Z_{\geqslant 1}$，$x_1, x_2, \cdots, x_t\in \mathbb R$，有

$$
\begin{aligned}
(x_1+x_2+\cdots+x_t)^n = \sum_{n_i\geqslant0, n_1+n_2+\cdots+n_t=n}\binom{n}{n_1,n_2,\cdots,n_t}\prod_{1\leqslant i\leqslant t}x_i^{n_i}
\end{aligned}
$$

其中 $\displaystyle \binom{n}{n_1,n_2,\cdots,n_t}=\frac{n!}{n_1!n_2!\cdots n_t!}$

**证明：**（组合方法理解）

现在有 $n$ 个 $(x_1+x_2+\cdots+x_t)$ 进行乘积，每个乘积中都只能选出一项再乘起来，那么 $n_i$ 就是从这 $n$ 个乘积中选出的 $x_i$ 的个数。

所以这样就解释了结果是 $\displaystyle \prod_{1\leqslant i\leqslant t}x_i^{n_i}$ 的原因。

那么这样的选择方法的个数有几个？

如果将每个 $(x_1+x_2+\cdots+x_t)$ 看做两两不同的物品，将物品分入 $t$ 个盒子，并保证第 $i$ 个盒子中有 $n_i$ 个物品，我们从第 $i$ 个盒子中的物品里面都取出 $x_i$，正好满足了上述要求，且这样的方案数正好就是 $\dbinom{n}{n_1,n_2,\cdots,n_t}$，这样就解释了系数是这样的原因。

至于前面的求和符号，把它看成一种枚举就行了。

## 推论

> 令 $t = 2$，得二项式定理： $\displaystyle (x_1+x_2)^n = \sum_{n_i\geqslant 0, n_1+n_2=n}\binom{n}{n_1,n_2}x_1^{n_1}x_2^{n_2}=\sum_{0\leqslant i\leqslant n}x_1^{n-i}x_2^i$

> 令 $x_i=1$，则 
$$
\begin{aligned}
t^n = \sum_{n_i\geqslant0, n_1+n_2+\cdots+n_t=n}\binom{n}{n_1,n_2,\cdots,n_t}
\end{aligned}
$$
