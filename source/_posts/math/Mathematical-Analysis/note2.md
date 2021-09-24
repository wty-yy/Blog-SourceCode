---
title: 多元函数Riemmann积分的性质 有界集上的积分
hide: false
math: true
abbrlink: 59500
date: 2021-09-24 15:43:19
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
 - 积分
---

第一周定义了一些与Riemmann积分有关的定义，利用Darboux积分来判断可积性，还有Lebesgue定理也有来判断可积性。

有关多元函数积分的性质，可以和一元函数积分性质进行类比，有很多相似之处。

上面的积分都是在闭方体上定义的，那么如果放到一个任意一个 $\mathbb R^n$ 上的有界集，应该通过**延拓和限制**，进行问题转化。

下文中的**Riemmann积分**都用**积分**代替了。

## 多元函数积分的性质

### 定理1（保号性和线性性）

设 $Q\subset \mathbb R^n$ 为闭方体，$f,g:Q\rightarrow \mathbb R$ 可积，$\alpha, \beta\in\mathbb R$，则：

1. （保号性） 若 $f\geqslant 0$ 则 $\int_Q f\geqslant 0$，且“$=$”成立 $\iff m^*(\{x\in Q: f(x) > 0\}) = 0$。

2. （线性性） $\alpha f+\beta g$ 可积，且 $\int_Q(\alpha f+\beta g) = \alpha\int_Q f+\beta\int_Q g$。

---

**证明：** （保号性）

$\int_Qf = \underline{\int}_Qf\geqslant \underline{S}(\pi)\geqslant 0$

$\Leftarrow$：（每个分划的元素都不是零测集）

设 $\pi$ 为 $Q$ 的一个分划，则 $\forall q\in\pi$，断言 $m_q = 0$（$m_q = \inf\limits_{x\in q} f(x)$）。

反设 $m_q > 0$，则 $q\subset \{x\in Q: f(x) > 0\}\Rightarrow m^*(q)\leqslant 0$ 与 $m^*(q) > 0$ 矛盾。

则 $\displaystyle \underline{S}(\pi) = \sum_{q\in\pi} m_qV(q) = \sum_{q\in\pi} 0\cdot V(q) = 0$，故 $\int_Qf = \underline{\int}_Qf=\sup\limits_{\pi}\underline{S}(\pi) = 0$。

$\Rightarrow$：（通过积分的定义，构造目标集合）

设 $\varepsilon, \delta > 0, A = \{x\in Q, f(x) > \delta\}$。

则 $\exists \pi$，使得 $\displaystyle\varepsilon \geqslant\overline{S}(\pi)=\sum_{q\in\pi}M_qV(q)\geqslant \sum_{q\in\pi,q\cap A\neq \varnothing} M_qV(q)\geqslant \delta\sum_{q\in\pi, q\cap A\neq\varnothing} V(q)$。

由于 $\displaystyle A\subset \bigcup_{q\in\pi, q\cap A\neq \varnothing} q\Rightarrow m^*(A)\leqslant \sum_{q\in\pi, q\cap A\neq \varnothing}m^*(q)\leqslant \frac{\varepsilon}{\delta}$，

故 $m*(A) = 0\Rightarrow m^*(\{x\in Q:f(x)>0\}) = 0$。

**思路：**（线性性）通过Riemmann积分的定义，将绝对值拆开，然后相加合并，最后用夹逼定理即可。

### 定理2（单调性）

设 $Q\subset\mathbb R^n$ 为闭方体，$f, g: Q\rightarrow \mathbb R$ 可积，若 $f\leqslant g$，则 $\int_Q f\leqslant \int_Q g$。

---

**证明：** 

通过**线性性**知 $g-f$ 可积，且 $g-f\geqslant 0$，再由**保号性**知，$\int_Q g-\int_Q f=\int_Q (g-f)\geqslant 0$。

### 定理3（可积与绝对可积）

设 $Q\subset \mathbb R^n$ 为闭方体，$f:Q\rightarrow \mathbb R$ 可积，则 $|f|$ 可积，且 $|\int_Qf|\leqslant \int_Q|f|$。

---

**证明：** （$|f|$ 的振幅小于 $f$ 的振幅证明可积，后者通过保号性即可）

由绝对值不等式知 $|f(x)| - |f(y)| \leqslant |f(x)-f(y)|$，则 $w_A(|f|)\leqslant w_A(f)$。

则 $\displaystyle 0\leqslant\sum_{q\in\pi} w_q(|f|)V(q)\leqslant \sum_{q\in\pi}w_q(f)V(q)$，再通过夹逼定理知，$\sum\limits_{q\in\pi} w_q(|f|)V(q)$ 收敛于 $0$，再由 [note1-定理7](/posts/57273/#定理7-riemmann可积iffdarboux可积) 知， $|f(x)|$ 收敛。

由于 $-|f|\leqslant f\leqslant |f|$，则 $-\int_Q|f|\leqslant \int_Qf\leqslant \int_Q|f|$，故 $|\int_Qf|\leqslant \int_Q|f|$。

### 定理4（函数几乎为零）

设 $Q\subset\mathbb R^n$ 为闭方体，$f:Q\rightarrow \mathbb R$ 可积，若 $m^*(\{x\in Q:f(x)\neq 0\}) = 0$ 则 $\int_Q f = 0$。

---

**证明：** （转换为 $|f|$）

$m^*(\{x\in Q: |f(x)| > 0\}) = m^*(\{x\in Q:f(x)\neq 0\}) = 0$，由保序性知 $\int_Q|f| = 0$，

又 $0\leqslant |\int_Q f(x)|\leqslant \int_Q|f(x)|=0\Rightarrow \int_Qf(x)=0$。
