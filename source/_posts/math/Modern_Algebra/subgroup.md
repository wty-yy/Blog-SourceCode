---
title: 子群 Lagrange定理
hide: false
math: true
abbrlink: 51556
date: 2021-10-25 21:17:35
index_img:
banner_img:
category:
 - Math
 - 近世代数
tags:
 - 群论
---

## 定义1（子群）

设 $G$ 为群，$H\subset G$，如果 $H$ 关于 $G$ 的运算也成为一个群，则称 $H$ 为 $G$ 的一个**子群**，记 $H < G$。

## 命题2（子群判定方法）

设 $G$ 为群，$H\subset G$，则 

$$
\begin{aligned}
H < G\iff \forall a, b\in H,\ ab^{-1}\in H
\end{aligned}
$$

---

**思路：** 必要性显然，充分性，根据群的定义，结合律显然，取 $a=b$ 则 $e\in H$，有幺元，取 $a=e$，则 $b^{-1}\in H$，有逆元，得证。

## 命题3（子群的交还是子群）

设 $G$ 为群，$\{H_{\alpha}\}_{\Lambda}$ 是群 $G$ 的一族子群，则

$$
\bigcap_{\alpha\in\Lambda}H_{\alpha} < G
$$

---

利用**命题2**易证。

## 定义4（左右陪集）

设 $G$ 为群，$H < G$，则称：

1. $aH := \{ah: h\in H\}$ 为以 $a$ 为代表元的**左陪集**。

2. $Ha := \{ha: h\in H\}$ 为以 $b$ 为代表元的**右陪集**。

## 命题5（由子群构造出的等价关系）

设 $G$ 为群，$H < G$，定义 $G$ 上的二元关系 $\sim$ 如下：

$$
a\sim b\iff ab^{-1}\in H
$$

则 $\sim$ 为等价关系。

---

**思路：** 逐个验证等价关系的充要条件：自反性，对称性，传递性。

## 命题6（等价类和陪集相等）

设 $G$ 为群，$H < G$，由**命题5**定义了 $G$ 上的等价关系 $\sim$，$\forall a\in G$，$a$ 关于 $\sim$ 的等价类与以 $a$ 为代表元的**右陪集**相等，也即是：

$$
\bar{a} := \{b\in G: ab^{-1}\in H\} = Ha
$$

---

**思路：** 证明互相包含：
1. $\forall b\in G,\ ab^{-1}\in H$，则 $\exists h\in H$，使得 $ab^{-1} = h$，则
$$
b = h^{-1}a\Rightarrow b\in Ha\Rightarrow \bar{a}\subset Ha
$$

2. $\forall c\in Ha,\ \exists h\in H$，使得 $ha = c$，则

$$
ac^{-1} = h^{-1}\Rightarrow c\in \bar{a}\Rightarrow Ha\subset \bar{a}
$$

故，$\bar{a} = Ha$。

既然右陪集有对应的等价关系那么左陪集相应也有：

$$
\begin{aligned}
a^{-1}b\in H&\iff a\sim b\text{ 则 } \bar{a} = aH
\end{aligned}
$$

从形式上看，可以很容易区分它们俩，可以看做乘法：
$$
\begin{aligned}
a^{-1}b\in H&\iff b\in aH\\
ab^{-1}\in H&\iff a\in Hb
\end{aligned}
$$

## 命题7（陪集的性质）

设 $G$ 为群，$H < G$，$a, b\in G$，则

$$
\begin{aligned}
&\text{①. }aH = bH\iff a^{-1}b\in H\iff aH\subset bH\iff a\in bH\\
&\text{②. }aH\cap bH\neq\varnothing\iff aH=bH\\
&\text{③. }|aH| = |Ha| = |H|
\end{aligned}
$$

---

**思路：** $\text{①,②,③}$ 的证明结合**命题6**和陪集，等价关系的性质，不难证明。

## 命题8（左右陪集的商集大小一样）

令 $(G/H)_l:=\{aH:a\in G\}$，即 $G$ 关于左陪集的商集，$(G/H)_r:=\{Ha:a\in G\}$，即 $G$ 关于右陪集的商集，则

$$
|(G/H)_l| = |(G/H)_r|
$$

---

**思路：** 可以通过构造如下的一个映射：

$$
\begin{aligned}
\sigma:(G/H)_l&\rightarrow (G/H)_r\\
aH&\mapsto Ha^{-1}
\end{aligned}
$$

证明它是双射即可。
