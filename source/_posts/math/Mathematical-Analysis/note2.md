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

由绝对值不等式知 $|f(x)| - |f(y)| \leqslant |f(x)-f(y)|$，则 $w_q(|f|)\leqslant w_q(f)$。

则 $\displaystyle 0\leqslant\sum_{q\in\pi} w_q(|f|)V(q)\leqslant \sum_{q\in\pi}w_q(f)V(q)$，再通过夹逼定理知，$\sum\limits_{q\in\pi} w_q(|f|)V(q)$ 收敛于 $0$，再由 [note1-定理7](/posts/57273/#定理7-riemmann可积iffdarboux可积) 知， $|f(x)|$ 收敛。

由于 $-|f|\leqslant f\leqslant |f|$，则 $-\int_Q|f|\leqslant \int_Qf\leqslant \int_Q|f|$，故 $|\int_Qf|\leqslant \int_Q|f|$。

### 定理4（函数几乎为零）

设 $Q\subset\mathbb R^n$ 为闭方体，$f:Q\rightarrow \mathbb R$ 可积，若 $m^*(\{x\in Q:f(x)\neq 0\}) = 0$ 则 $\int_Q f = 0$。

---

**证明：** （转换为 $|f|$）

$m^*(\{x\in Q: |f(x)| > 0\}) = m^*(\{x\in Q:f(x)\neq 0\}) = 0$，由**保号性**知 $\int_Q|f| = 0$，

又 $0\leqslant |\int_Q f(x)|\leqslant \int_Q|f(x)|=0\Rightarrow \int_Qf(x)=0$。

### 定理5（两个函数几乎相等）

设 $Q\subset \mathbb R^n$ 为闭方体：$f, g:Q\rightarrow \mathbb R$ 可积，若 $m^*(\{x\in Q:f(x)\neq g(x)\}) = 0$，则 $\int_Qf=\int_Qg$。

---

**证明：** 由于 $m^*(\{x\in Q:f(x)\neq g(x)\}) = m^*(\{x\in Q: f(x)-g(x) \neq 0\}) = 0$。

由积分线性性知，$f(x)-g(x)$ 可积，且 $\int_Q(f-g)=\int_Qf-\int_Qg$，又有**定理4**知 $\int_Q(f-g) = 0$，则 $\int_Qf=\int_Qg$。

## 有界集上的积分

### 延拓与限制

令两个集合 $A, B$，且 $A\subset B$。

1. 设 $f:A\rightarrow \mathbb R, g:B\rightarrow \mathbb R$，若 $x\in A$，都有 $f(x) = g(x)$，则称 $g$ 为 $f$ 的**延拓**，$f$ 为 $g$ 的**限制**。

2. 设 $f:A\rightarrow \mathbb R$，定义 $g:B\rightarrow \mathbb R$，且

$$
g(x) =
\begin{cases}
f(x), &x\in A;\\
0, &x\in B-A.
\end{cases}
$$

则称 $g$ 为 $f$ 在 $B$ 上的**零延拓**。

3. 设 $f:B\rightarrow \mathbb R$，记 $f|_A:A\rightarrow \mathbb R$ 且 $\forall x\in A, f|_A(x)=f(x)$ 则称 $f|_A$ 为 $f$ 在 $A$ 上的限制。

### 命题1（对有界集的不同闭方体覆盖，其积分值都相同）

设 $P, Q$ 为闭方体，$P\subset Q^\circ$，设 $f:P\rightarrow \mathbb R$ 可积，设 $g:Q\rightarrow \mathbb R$ 是 $f$ 的零延拓，
则 $f\text{可积} \iff g\text{可积}$，且 $\int_Pf=\int_Qg$。

---

**证明：**（将分划拓张，利用Darboux上下和相等，通过夹逼定理使得Darboux上下积分收敛）

$\Rightarrow$：设 $\pi$ 为 $P$ 上的分划，则存在 $Q$ 的一个分划 $\pi_1$，使得 $\pi\subset \pi_1$，

则 $\underline{S}(\pi, f) = \underline{S}(\pi_1, g), \overline{S}(\pi, f) = \overline{S}(\pi_1, g)$，又由于：

$$
\underline{S}(\pi, f) = \underline{S}(\pi_1, g)\leqslant\underline{\int}_Qg\leqslant\overline{\int}_Qg\leqslant   \overline{S}(\pi_1, g)=\overline{S}(\pi, f)
$$

令 $\Delta\pi\rightarrow 0$，则 $\underline{S}(\pi, f) = \overline{S}(\pi,f) = \int_Pf$， $\underline{\int}_Qg=\overline{\int}_Qg=\int_Pf$，故 $\int_Qg=\int_Pf$。

$\Leftarrow$：设 $\pi$ 为 $Q$ 上的分划，则存在 $Q$ 上的分划 $\pi_1, \pi_1\geqslant \pi$，使得 $\forall q\in\pi_1$，$q\subset P$ 或 $q\cap P^\circ = \varnothing$。

则 $\pi_2 = \{q\in\pi_1:q\subset P\}$ 是 $P$ 的一个分划，同样满足 $\pi_2\subset \pi_1$ 且 $f$ 的Darboux上下和和 $g$ 的Darboux上下和相等，使用夹逼定理，同上可证。


### 定义2（有界集上的积分）

设 $A\subset \mathbb R^n$ 有界，$f\rightarrow \mathbb R$ 有界，设 $A\subset Q$，$Q$ 为闭方体。

设 $\tilde{f}:Q\rightarrow\mathbb R$ 为 $f$ 的零延拓，若 $\tilde{f}$ 可积，则称 $f$ 可积，定义：$\int_Af=\int_Q\tilde{f}$，称 $\int_Af$ 为 $f$ 在 $A$ 上的积分。

---

**注：** 

- 有界集的积分与 $Q$ （闭方体）的选取无关，**命题1**提供了保证。

- 假设 $A$ 为闭方体，同样满足之前对闭方体的积分定义（[note1 - Riemmann积分](/posts/57273/#定义1-riemmann积分)）。

---

下面思考 $f:A\rightarrow \mathbb R$ 什么时候可积，有**定义2**知， $f$ 可积 $\iff$ $\tilde{f}$ 可积 $\iff m^*(D(\tilde{f})) = 0$。

（其中 $D(f)$ 表示 $f$ 在定义域上的不连续点集合`discontinuous`）

设 $\bar{A}\subset Q^\circ$，我们将 $Q$ 进行细分：

$$
Q = \partial Q+(Q^\circ - \bar{A}) + \partial A + A^\circ
$$

由于零延拓的定义，可以得出 $\partial Q, (Q^\circ-\bar{A})$ 中一定是不含有间断点的。

又由于 $\tilde{f}$ 在 $A^\circ$ 中的间断点一定也是 $f$ 在 $A^\circ$ 中的间断点，$A^\circ\cap D(\tilde{f})=A^\circ\cap D(f)$。

则 $D(f)\subset D(\tilde{f})\subset \partial A + D(f)$，故 

$$m^*(D(f))\leqslant m^*(D(\tilde{f}))\leqslant m^*(\partial A)+m^*(D(f))$$

于是得出下列**命题3**和**定理4**：

### 命题3（可积条件）

1. 若 $f:A\rightarrow \mathbb R$ 可积，则 $m^*(D(f))=0$。（左不等号）

2. 若 $m^*(\partial A)=m^*(D(f))=0$，则 $f$ 可积。（右不等号）

---

进一步对有界集边界进行限制，从而得出 $f$ 可积的充要条件。

### 定理4（可积的充要条件）

设 $A\subset \mathbb R^n$ 有界，$m^*(\partial A)=0$，设 $f:A\rightarrow \mathbb R$ 有界，则 $f$ 可积 $\iff m^*(f)=0$。

---

所以，如果 $A\subset \mathbb R^n$ 且 $\partial A = \bigcup\limits_{k=1}^N\sum_k$，其中 $\sum_k$ 为定义在 $\mathbb R^{n-1}$ 紧集上的连续函数的图像，则 $m^*(\partial A) = 0$，原因是 [note1 - 命题10 （低维在高维中的图像测度为0）](/posts/57273/#命题10-低维函数在高维中的图像测度为0)。

### 定理5（边界测度为零，连续必可积）

设 $A\subset \mathbb R^n$，$m^*(\partial A) = 0$，$f: A\rightarrow \mathbb R$ 有界，若 $f\in C(A)$，则 $f$ 可积。

## 有界集上积分的性质

证明思路基本都是先将 $f$ 的有关命题，先转化到其零延拓 $\tilde{f}$ 上，然后利用闭方体积分的性质，最后再转换回 $f$ 上，故有些证明略去了。

### 定理1（保号性和线性性）

设 $A\subset \mathbb R^n$ 有界，$f, g:A\rightarrow \mathbb R$ 可积，$\alpha, \beta \in \mathbb R$，则：

1. （保号性）若 $f\geqslant 0$，则 $\int_A f\geqslant 0$，且 “$=$” 成立 $\iff m^*(\{x\in A: f(x) > 0\})= 0$。

2. （线性性）$\alpha f+ \beta g$ 可积，且 $\int_A(\alpha f+\beta g) = \alpha \int_A f+\beta \int_A g$。

---

**证明：**

设 $Q\supset A$ 为闭方体，$\tilde{f} : Q\rightarrow \mathbb R$ 为 $f$ 的零延拓，则 $\tilde{f}$ 可积，且 $\int_A f=\int_Q \tilde{f}$。

保号性：$f\geqslant 0\Rightarrow \tilde{f} \geqslant 0\Rightarrow \int_Q\tilde{f}\geqslant 0\Rightarrow \int_Af\geqslant 0$。

$\int_Af = 0\iff \int_Q\tilde{f} = 0\iff m^*(\{x\in Q: \tilde{f}(x) > 0\}) = 0\iff m^*(\{x\in A: f(x) > 0\})$。

线性性：$\alpha f+\beta g\text{可积}\iff \alpha\tilde{f}+\beta\tilde{g}\text{可积}$，由闭方体积分的线性性得证。

$\alpha \int_A f+\beta \int_A g=\alpha\int_Q \tilde{f}+\beta\int_Q\tilde{g}=\int_Q(\alpha\tilde{f}+\beta\tilde{g})=\int_A(\alpha f+\beta g)$。

### 定理2（单调性）

设 $A\rightarrow \mathbb R^n$ 有界，$f, g: A\rightarrow \mathbb R$ 可积，若 $f\leqslant g$，则 $\int_Af\leqslant \int_Ag$。

---

**证明：** $f \leqslant g\Rightarrow \tilde{f} \leqslant \tilde{g}\Rightarrow \int_Q\tilde{f}\leqslant\int_Q\tilde{g}\Rightarrow \int_Af\leqslant \int_Ag$。

### 定理3（可积与绝对可积）

设 $A\subset \mathbb R^n$ 有界，$f:A\rightarrow \mathbb R$ 可积，则 $|f|$ 可积，且 $|\int_Af|\leqslant \int_A|f|$。

### 定理4（几乎为零）

设 $A\subset \mathbb R^n$ 有界，$f:A\rightarrow \mathbb R$ 可积，若 $m^*(\{x\in A:f(x)\neq 0\}) = 0$，则 $\int_Af=0$。

### 定理5（几乎相等）

设 $A\subset \mathbb R^n$ 有界，$f, g:A\rightarrow \mathbb R$ 可积，若 $m^*(\{x\in A: f(x)\neq g(x)\}) = 0$，则 $\int_Af=\int_Ag$。

## 积分区域的可加性

积分区域的可加性需要很多的铺垫，主要是使用了**特征函数**来对集合运算进行变化，使用**函数的正负部**将函数拆分为两个恒大于等于 $0$ 的部分，使其能够直接乘到 $\min,\max$ 内部，故该部分的最后一个定理才是完整的证明。

之前定义的积分都是在其整个定义域上的积分，下面对其定义域的一个子集进行积分做出定义。

### 定义1（积分的限制）

设 $A\subset B\subset \mathbb R^n$，$A$ 有界，$f:B\rightarrow \mathbb R$，若 $f|_A : A\rightarrow \mathbb R$ 可积，则称 $f$ 在 $A$ 上可积，定义 $f$ 在 $A$ 上的积分为 $\int_Af=\int_Af|_A$。

### 定义2（正部，负部） 

设 $f: S\rightarrow \mathbb R$，定义 $f^+, f^-: S\rightarrow \mathbb R$，且

$$
f^+(x)=\begin{cases}f(x), &f(x)\geqslant 0,\\0, &f(x) < 0.\end{cases}\quad
f^-(x)=\begin{cases}-f(x), &f(x)\leqslant 0,\\0, &f(x) > 0.\end{cases}
$$

分别称 $f^+, f^-$ 为 $f$ 的**正部**和**负部**。

则有：$f = f^+ - f^-, |f| = f^+ + f^-$（可以通过画图来进行理解）。

### 定义3（特征函数）

设 $X$ 为全集，$A\subset X$，定义 $\chi_A:X\rightarrow \mathbb R$ 为 $A$ 的**特征函数**，且

$$
\chi_A(x) = \begin{cases} 1, &x\in A\\ 0, &x\in X-A\end{cases}
$$

特征函数的作用：将复杂的集合运算转换为简单的函数运算。

例：$\chi_{A\cup B} = \chi_A\cdot \chi_B = \min\{\chi_A, \chi_B\}$，$\chi_{A\cap B}=\chi_A | \chi_B=\max\{\chi_A,\chi_B\}$（$|$ 是**或运算**）。

### 命题4（特征函数关于正负部的运算）

设 $A\subset X$，$f:X\rightarrow \mathbb R$，$\chi_A: X\rightarrow \mathbb R$ 为 $A$ 的特征函数，

则 $(f \chi_A)^+ = f^+ \chi_A, (f\chi_A)^- = f^- \chi_A$。

--- 

**证明：** （利用 $\chi_A$ 的非负性和 $f^+,f^-$ 的展开式）

$(f\chi_A)^+= \frac{|f\chi_A| + f\chi_A}{2} =  \frac{|f|+f}{2}\chi_A = f^+\chi_A$。

$(f\chi_A)^-= \frac{f\chi_A - |f\chi_A|}{2} =  \frac{f-|f|}{2}\chi_A = f^-\chi_A$。

### 命题5（原函数可积当且仅当正负部可积）

设 $A\subset \mathbb R^n$ 有界，$f:A\rightarrow \mathbb R$ 有界，则 $f$ 可积 $\iff f^+, f^-$ 可积，且当 $f$ 可积时，

$\int_A f=\int_A f^+ - \int_A f^-$。

---

**证明：**（通过有界集积分的线性性和绝对可积性，正负部和原函数的关系）

"$\Rightarrow$"：$\displaystyle f^+ = \frac{f+|f|}{2}, f^- = \frac{f - |f|}{2}$。

"$\Leftarrow$"：$f = f^+ - f^-\Rightarrow \int_A f = \int_A f^+ - \int_A f^-$。

### 命题6（可积函数取 $\min, \max$ 仍然可积）

设 $A\subset \mathbb R^n$ 有界，$f, g: A\rightarrow \mathbb R$ 可积，则 $\min\{f, g\}, \max\{f, g\}$ 可积。

---

**证明：** （利用绝对值能将大的提到前面小的放到后面的性质）

若 $a>b$ 则 $|a-b| = |b-a| = a-b$，这样一定就是大的减去小的了，于是

$$
\min\{f, g\} = \frac{f+g - |f-g|}{2}, \max\{f, g\} = \frac{f+g+|f-g|}{2}
$$

再通过有界集积分的绝对可积性和线性性知，原命题成立。

### 命题7（利用特征函数与零延拓）

设 $Q$ 为闭方体，$A\subset Q$，$f: Q\rightarrow \mathbb R$ 有界，则 $f$ 在 $A$ 上可积 $\iff f\chi_A$ 可积，且当 $f$ 在 $A$ 上可积时，$\int_A f = \int_Q f\chi_A$。

---

**证明：**（转换为零延拓）

不难发现 $f\chi_A$ 就是 $f$ 在 $Q$ 上的零延拓，由 [定义2（有界集上的积分）](./#定义2有界集上的积分) 知原命题成立。

### 定理8（积分区域的可加性）

设 $A, B\subset \mathbb R^n$ 有界，$f: A\cup B\rightarrow \mathbb R$ 有界。

如果 $f$ 在 $A, B$ 上都可积，则 $f$ 在 $A\cup B, A\cap B$ 上可积，且

$$
\int_A f+\int_Bf=\int_{A\cup B}f+\int_{A\cap B}f
$$

如果进一步假设 $m^*(A\cap B) = 0$，则 $\int_A f+\int_B f = \int_{A\cup B} f$。

---

**证明：**（先将 $f$ 做零延拓，然后将集合关系转化为特征函数的关系，证明 $A\cap B, A\cup B$ 其中一个可积即可）

设 $Q\supset A\cup B$ 为闭方体，特征函数 $\chi_A, chi_B, chi_{A\cup B}, chi_{A\cap B}: Q\rightarrow \mathbb R$，用 $f$ 表示 $f$ 在 $Q$ 上的零延拓。

$$
\begin{aligned}
A+B &= A\cup B + A\cap B\\
\Rightarrow \chi_A+\chi_B &= \chi_{A\cup B}+\chi_{A\cap B}\\
\Rightarrow f\chi_A+f\chi_B&=f\chi_{A\cup B}+f\chi_{A\cap B}
\end{aligned}
$$

由**命题7**知，$f\chi_A, f\chi_B$ 在 $Q$ 上可积，由有界集积分的**线性性**知，只需证明 $f\chi_{A\cup B}, f\chi_{A\cap B}$ 其中一个可积即可。

证明 $f\chi_{A\cap B}$ 可积，由**命题4**和**命题5**知，只需证明 $f^+\chi_{A\cap B}, f^-\chi_{A\cap B}$ 可积。

$$
\chi_{A\cap B} = \min\{\chi_A, \chi_B\} \Rightarrow
\begin{cases}
f^+\chi_{A\cap B} = \min\{f^+\chi_A, f^+\chi_B\}\\
f^-\chi_{A\cap B} = \min\{f^-\chi_A, f^-\chi_B\}
\end{cases}
$$

这里 $f^+, f^-$ 能够乘到 $\min$ 函数中，是因为它们都是非负的。

再通过**命题4**和**命题5**知，$f^+\chi_A, f^+\chi_B, f^-\chi_A, f^-\chi_B$ 都是可积的，由**命题6**知，它们取了 $\min$ 以后还是可积的。

于是 $f^+\chi_{A\cap B}, f^-\chi_{A\cap B}$ 可积，故 $f\chi_{A\cap B}$ 可积。

由于 $f\chi_{A\cup B} = f\chi_A+f\chi_B-f\chi_{A\cap B}$ 有界集积分的线性性知，$f\chi_{A\cup B}$ 可积，且
$$
\int_Qf\chi_A+\int_Qf\chi_B=\int_Qf\chi_{A\cup B}+\int_Qf\chi_{A\cap B}
$$
由**命题7**知，
$$
\int_A f+\int_Bf=\int_{A\cup B}f+\int_{A\cap B}f
$$

进一步假设 $m^*(A\cap B) = 0$，则 $\{x\in A\cap B: f|_{A\cap B}(x)\neq 0\} \subset A\cap B$，故 

$$
m^*(\{x\in A\cap B: f|_{A\cap B}(x)\neq 0\}) \leqslant m^*(A\cap B) = 0
$$

由有界积分的**保号性**知，$\int_{A\cap B}f|_{A\cap B} = \int_{A\cap B} f=0$，故 $\int_Af+\int_Bf=\int_{A\cup B} f$。
