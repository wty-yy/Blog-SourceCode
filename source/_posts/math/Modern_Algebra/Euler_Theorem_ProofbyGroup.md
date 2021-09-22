---
title: 群论下的欧拉定理
hide: false
math: true
category:
  - Math
  - 近世代数
tags:
  - 群论
  - 数论
abbrlink: 54884
date: 2021-09-20 21:54:52
index_img:
banner_img:
---

## 命题

设 $G$ 是有限 $\text{Abel}$ 群，记它的阶 $|G| = n$，幺元为 $e$，则对于任意的 $a\in G$ 都有 $a^{n} = e$。

**证明**：

设 $G = \{a_1,a_2,\cdots,a_n\}$，对于 $\forall g\in G$，令 $a_i'=g\cdot a_i$，则当 $i\neq j$ 时，$a_i'\neq a_j'$。

反设 $a_i' = a_j'$，则 $g\cdot a_i = g\cdot a_j\Rightarrow g^{-1}g\cdot a_i = g^{-1}g\cdot a_j\Rightarrow a_i=a_j$，与 $i\neq j$ 矛盾。

故 $a_i' \neq a_j'$。

于是有：$G = \{a_1', a_2', \cdots, a_n'\}$。

则（第二个等号使用了交换律）：

$$
a_1a_2\cdots a_n = a_1'a_2'\cdots a_n' = g^n a_1a_2\cdots a_n
$$

对上式右乘 $a_1a_2\cdots a_n$ 的逆元，则 $g^n = e$。

**QED**

## 推论

由于 $\mathbb Z_m^*$（模 $m$ 的简化剩余类）关于乘法构成一个 $\text{Abel}$ 群 $(\mathbb{Z}_m^*, \cdot)$，且 $(\mathbb{Z}_m^*, \cdot)$ 的阶数为 $\varphi(m)$，于是由上述**命题**得出，

**欧拉定理**：$\forall \overline{a}\in G$

$$
(\overline{a})^{\varphi(m)} = 1
$$

等价于：

$$
a^{\varphi(m)} \equiv 1\pmod m
$$
