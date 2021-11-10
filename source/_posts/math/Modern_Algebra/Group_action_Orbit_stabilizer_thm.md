---
title: 群在集合上的作用 轨道-稳定子定理
hide: false
math: true
abbrlink: 48418
date: 2021-11-10 21:48:23
index_img:
banner_img:
category:
 - Math
 - 近世代数
tags:
 - 群论
---

## 共轭作用

![共轭作用](https://img11.360buyimg.com/ddimg/jfs/t1/220052/32/3919/142583/618be63fEffc6b151/a6e32dd7fe93d245.png)

[网页链接](https://zhimap.com/medit/abd2b958625041388742755595c59b35)

## 轨道，稳定子

![轨道稳定子](https://img10.360buyimg.com/ddimg/jfs/t1/159360/16/26492/171906/618be9f6E74aa8713/b887620cd4e78eea.png)

[网页链接](https://zhimap.com/medit/7464dd7ac2a84b9ba1d8927ad6876ac1)

## 全部定义

> 这一节的概念实在是太多了，所以就先列举下这一节出现的所有概念，以便于查找。

1. **群在集合上的作用**（群作用）：群 $G$ 在集合 $\Omega$ 上的一个作用（简记为 $G\curvearrowright \Omega$），若映射 
$$
\begin{aligned}\sigma : G\times\Omega &\rightarrow \Omega\\(a, x)&\mapsto a\circ x\end{aligned}
$$
满足：$(ab)\circ x = a\circ(b\circ x)$ 和 $e\circ x = x$，则称 $a\circ x$ 为 $G\curvearrowright\Omega$。

2. **由作用确定的同态 $\psi$**（虽然不是定义，但很重要）：构造群 $G$ 到 $\Omega$ 的全体变换群上的映射 $\psi$ 如下：

$$
\begin{aligned}
\psi:G&\rightarrow S_{\Omega}\\
a&\mapsto\psi(a)(x):=a\circ x
\end{aligned}
$$

其中 $\psi(a)(x):=a\circ x$，表示将变换 $\psi(a)$ 定义为 $a\circ x$，也就是一个**作用**。

3. **作用的核**：等价于 $\text{Ker }\psi = \{a\in G:a\circ x = x,\ \forall x\in\Omega\}$（$\Omega$ 上的恒同变换）；
**忠实的**：一个作用是忠实的 $\iff \text{Ker}\psi = \{e\}$。

4. **左平移**（一种作用）：
	- $G\curvearrowright G :=a\circ x = ax$
	- $G\curvearrowright (G/H)_l := a\circ xH=axH$

5. **共轭作用**：$G\curvearrowright G:a\circ x = axa^{-1}$

6. 群 $G$ 的**中心**：$G$ 上**共轭作用**的核（ $G$ 中可以和每一个元素交换的元素）
$$
\begin{aligned}
\{a\in G: axa^{-1}=x,\ \forall x\in G\} = \{a\in G:ax=xa,\ \forall x\in G\}
\end{aligned}
$$

7. **自同构**：$G\rightarrow G$ 上的同构；
**内自同构** $\sigma_a$（一种特殊的自同构，由共轭作用定义）：$\begin{aligned}\sigma_a:G&\rightarrow G\\x&\mapsto axa^{-1}\end{aligned}$

8. **自同构群**：$\text{Aut }(G):=\{G\text{ 上的全体自同构}\}$，运算为映射的乘法（复合）；
**内自同构群**：$\text{Inn }(G):=\{\sigma_a:a\in G\}$，运算为映射的乘法（复合）

9. $x$ 的 $G-\text{轨道}$：$G(x) = \{a\circ x:a\in G\}$

10. $\Omega$ 的 $G-\text{轨道}$ 的**完全代表系**：$\{x_1,x_2,\cdots, x_r\}$，满足 $\displaystyle\Omega = \bigsqcup_{i=1}^rG(x_i)$

11. $x$ 的**稳定子群**：$G_x = \{a\in g:a\circ x = x\}$

12. $x$ 的**共轭类**：共轭作用下 $x$ 的 $G - \text{轨道}\iff G(x) = \{axa^{-1}:a\in G\}$

13. 有限群 $G$ 的**类方程**：$\displaystyle|G| = |Z(G)| + \sum_{i=1}^r|G(x_j)|$，其中 $x_1,\cdots,x_j$ 是非中心元素的共轭类的完全代表系。

14. $x$ 在 $G$ 里的**中心化子**：共轭作用下的稳定子群，记为 $C_G(x) := G_x =  \{g\in G: gxg^{-1} = x\}$

15. $G\curvearrowright \Omega$ 是**传递的** $\iff$ $\Omega$ 中的轨道数 $r = 1$，此时称 $\Omega$ 为 $G$ 的一个**齐次空间**。

16. $g$ 的**不动点集**：$F(g):=\{x\in\Omega:g\circ x = x\}$
$x$ 是群 $G$ 的一个**不动点** $\iff |G(x)| = 1$
群 $G$ 的**不动点集**：$\{x\in\Omega:|G(x)| = 1\}$

17. 群 $G$ 为 $p-\text{群}\iff |G| = p^m,\ (m\geqslant 1,\ p\text{为素数})$


