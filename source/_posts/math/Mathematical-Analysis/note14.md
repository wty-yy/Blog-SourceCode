---
title: 2-范数 L2中的性质及Fourier级数收敛性
hide: false
math: true
abbrlink: 1149
date: 2021-12-20 19:54:30
index_img:
banner_img:
category:
 - Math
 - 数学分析
tags:
---

三角多项式：

$$
P_n = \frac{a_0}{2}+\sum_{k=1}^n\left\{a_k\cos kx+b_k\sin kx\right\}
$$

称为三角多项式，若 $a_n\ \text{或}\ b_n\neq 0$，则 $\text{degree}(P_n) = n$，可以将 $P_n$ 视为 $(e^{ix})^k$ 的多项式。

## 定理（Weierstrass 定理）

设 $f\in C(\mathbb R)$ 为 $2\pi$ 周期函数，则存在三角多项式 $P_n,\ \text{degree}(P_n)\leqslant n,\ n=1,2,\cdots$，使得 $P_n\Rightarrow f$（一致收敛）。

---

**思路**： 证明 $P_n$ 为 $\sigma_n$ 时成立（$\sigma_n$ 为上一个 [note](/posts/9996/#计算fourier级数的cesàro和) 中所定义的，是 $f$ 的 $Fourier$ 级数的 $Cesàro$ 和），再对两者差值进行估计，方法和 [$Fejér$ 定理](/posts/9996/#定理5fejér) 证明思路类似。

**证明**： 由于 $f$ 为连续的周期函数，则 $|f|\leqslant M$ 且 $f$ 一致连续，即 $\lim\limits_{\delta\rightarrow 0}\sup\limits_{|x_1-x_2|\leqslant \delta}|f(x_1)-f(x_2)| = 0$，取 
$$
P_n=\sigma_n = \frac{1}{n}(f_1+\cdots+f_n)
$$

下证 $\sigma_n\Rightarrow f$，

$$
\begin{aligned}
\sigma_n-f=&\int_0^{\pi}\frac{f(x+t)-f(x)+f(x-t)-f(x)}{2}E_n(t)\,dt&\text{取}0 < \delta < \pi\\
\leqslant &\int_0^{\delta}\frac{f(x+t)-f(x)+f(x-t)-f(x)}{2}\,dt+\int_{\delta}^{\pi}4ME_n(t)\,dt\\
=&\ I_1+I_2
\end{aligned}
$$
分别对 $I_1,I_2$ 进行估计
$$
|I_1|\leqslant 2\sup_{|x_1-x_2|\leqslant\delta}|f(x_1)-f(x_2)|\\
|I_2|\leqslant 4M\frac{C}{n\delta^2}
$$

对 $\forall \varepsilon > 0$，$\exists 0 < \delta < \pi$，使得 $|I_1|\leqslant \dfrac{\varepsilon}{2}$，则要使得 $4M\dfrac{C}{n\delta^2} \leqslant \dfrac{\varepsilon}{2}$，则 $n\geqslant \dfrac{8MC}{\delta^2\varepsilon}$，于是令 $N = \left[\dfrac{8MC}{\delta^2\varepsilon}\right]+1$，所以当 $n\geqslant N$ 时，有

$$
\begin{aligned}
&\ |\sigma_n(x)-f(x)|\leqslant \varepsilon\\
\Rightarrow &\ \sigma_n\Rightarrow f(x)\\
\Rightarrow &\ P_n\Rightarrow f(x)
\end{aligned}
$$

**QED**

这就说明了任何一个连续函数可以通过**三角多项式**逼近。

之前所使用的 $f\in L^1([a,b])$，$f:[a,b]\rightarrow \mathbb R$，等价于 $f\ \text{Riemann 可积}$ 或 $f$ 有有限个奇点且 $\int_a^b|f|$ 收敛，记

$$
||f||_1=\int_a^b|f|
$$

称为 $f$ 的 **1-范数**，类比的给出2-范数的定义。

## 2-范数

### 定义1（2-范数）

设 $f:[a,b]\rightarrow \mathbb R$，若 $f$ $\text{Riemann 可积}$ 或 $f$ 有有限个奇点且 $\int_a^b|f|^2$ 收敛，则称 $f$ 可积或平方可积，记为 $f\in L^2([a,b])$，当 $\int_a^bf^2 < +\infty$ 时，$f$ 平方可积，记

$$
||f||_2=\left(\int_a^bf^2\right)^\frac{1}{2}
$$

称为 $f$ 的 **2-范数**。

---

2-范数很特别，因为在 $L^2([-\pi,\pi])$ 有一组基，所以它是一个线性空间，并且可以类比向量空间（欧式空间） $R^n$，类似的定义有**内积，正交**的概念。

### 命题2（L2包含于L1）

设 $f\in L^2([a,b])$，则 $f\in L^1([a,b])$。

---

**证明**： 当 $f$ $\text{Riemann 可积}$ 时，显然 $f\in L^1([a,b])$，下讨论有奇点的情况：

$$
\begin{aligned}
\int_a^b|f|=&\int_a^b|f|\cdot 1\\
\leqslant&\ \frac{1}{2}\int_a^b(|f|^2+1)\\
=&\ \frac{1}{2}\int_a^b|f|^2+\frac{1}{2}(b-a) < +\infty
\end{aligned}
$$

则 $\int_a^b|f|$ 收敛，故 $f\in L^1([a,b])$。

**QED**

### 命题3（L2中的函数可以用光滑函数逼近）

设 $f\in L^2([a,b]),\ \forall \varepsilon > 0,\ \exists g\in C^{\infty}([a,b])$ 使得 

$$
||f-g||_2\leqslant \varepsilon
$$

---

**证明**： 由**命题2**可知，$f\in L^2([a,b])\Rightarrow f\in L^1([a,b])$，又由于 $L_1$ 中的函数都可以由光滑函数逼近 （详见 [note11 - 命题2（光滑函数逼近）](/posts/41316/#命题2光滑函数逼近)），则存在光滑函数 $g$ 使得
$$
|f-g|\leqslant \varepsilon
$$

则

$$
||f-g||_2 = \left(\int_a^b(f-g)^2\right)^{\frac{1}{2}}\leqslant \left(\int_a^b\varepsilon^2\right)^{\frac{1}{2}}=\sqrt{b-a}\cdot\varepsilon
$$

**QED**

### 命题4（线性性）

设 $f, g\in L^2([a,b]),\ \alpha,\beta\in \mathbb R$，则 $\alpha f+\beta g\in L^2([a,b])$。

---

**证明**： 只讨论有奇点的情况

$$
\begin{aligned}
\int_a^b(\alpha f+\beta g)^2 =&\int_a^b\{\alpha^2f^2+\beta^2g^2+2\alpha\beta\cdot f\cdot g\}\\
\leqslant&\int_a^b\{\alpha^2f^2+\beta^2g^2+\alpha^2f^2+\beta^2g^2\}\\
=&\ 2\alpha^2\int_a^bf^2+2\beta^2\int_a^bg^2 < +\infty
\end{aligned}
$$

**QED**

### 命题5（Cauchy - Schwarz）

设 $f, g\in L^2([a,b])$，则 $fg\in L^1([a,b])$，且 

$$
\left|\int_a^bfg\right|\leqslant ||f||_2\cdot||g||_2
$$

---

**证明**： 由 $Cauchy-Scharz$ 不等式，知

$$
\begin{aligned}
&\ \left(\int_a^bfg\right)^2\leqslant\int_a^bf^2\cdot\int_a^bg^2\\
&\left|\int_a^bfg\right|\leqslant\left(\int_a^bf^2\right)^{\frac{1}{2}}\cdot\left(\int_a^bg^2\right)^{\frac{1}{2}}=||f||_2\cdot||g||_2<+\infty
\end{aligned}
$$

**QED**

### 定义6（内积）

设 $f,g\in L^2([a,b])$，定义

$$
\langle f, g\rangle =\int_a^b fg
$$

称 $\langle f, g\rangle$ 为 $f,g$ 的内积。

### 命题7（内积的性质）

设 $f,g,h\in L^2([a,b]),\ \alpha,\beta\in\mathbb R$，则

1. $\langle f, g\rangle=\langle g,f\rangle$（交换律）

2. $\langle \alpha f+\beta g, h\rangle = \alpha\langle f,h \rangle+\beta\langle g,h \rangle$（分配律，积分的线性性）

3. $|\langle f,g \rangle|\leqslant ||f||_2\cdot||g||_2$（命题5，内积小于边长乘积）

4. $||f||_2 = \sqrt{\langle f,f \rangle}$（函数的长度）

### 命题8（长度的性质）

设 $f, g\in L^2([a,b]),\ k\in \mathbb R$，则

1. $||f||_2\geqslant 0$

2. $||kf||_2=|k|\cdot||f||_2$

3. （三角不等式）

$$
\biggl| ||f||_2-||g||_2\biggl|\leqslant ||f\pm g||_2\leqslant ||f||_2+||g||_2
$$

---

**证明**： 只证明第三条，由于

$$
||f\pm g||_2^2=\langle f\pm g,f\pm g \rangle=||f||_2^2+||g||_2^2\pm2\langle f,g \rangle\\
$$

利用**命题7第三条**，得

$$
\begin{aligned}
||f||_2^2-2||f||_2\cdot||g||_2+||g||_2^2\leqslant&\ ||f\pm g||_2\leqslant ||f||_2^2+2||f||_2\cdot||g||_2+||g||_2^2\\
\Rightarrow\ (||f||_2-||g||_2)^2\leqslant &\ ||f\pm g||_2\leqslant (||f||_2+||g||_2)^2\\
\Rightarrow\ \biggl|||f||_2-||g||_2\biggl|\leqslant &\ ||f\pm g||_2\leqslant ||f||_2+||g||_2
\end{aligned}
$$

**QED**

### 定义9（正交）

设 $f,g\in L^2([a,b])$，若 $\langle f,g \rangle=0$，则称 $f,g$ 正交，记为 $f\perp g$。

第二部分的目标是证明 $L^2([-\pi,\pi])$ 是**线性空间**，且它的一组**正交基**为

$$
\left\{\frac{1}{2},\sin kx,\cos kx:k=1,2,\cdots\right\}
$$ 

### 命题10（勾股定理）

设 $f,g\in L^2([a,b])$，若 $f\perp g$，则

$$
||f+g||_2^2=||f||_2^2+||g||_2^2
$$

---

利用 $||f+g||_2^2=\langle f+g,f+g \rangle$，展开即可证明。

### 定义11（2-范数收敛）

设 $f_n,f\in L^2([a,b]), n=1,2,\cdots$，若 $||f_n-f||_2\rightarrow 0\ (n\rightarrow +\infty)$，则称 $f_n$ 依2-范数收敛到 $f$，记为

$$
f_n\mathop\longrightarrow\limits^{L^2} f
$$

---

不难发现函数项级数收敛性有如下关系：

$f_n\Rightarrow f$ （一致收敛）可推出 $f_n\rightarrow f$ （逐点收敛）和 $\mathop\longrightarrow\limits^{L^2}$，由于

$$
\left(\int_a^b(f_n-f)^2\right)^{\frac{1}{2}}\leqslant\sqrt{b-a}\cdot\sup_{[a,b]}|f_n-f|\leqslant \sqrt{b-a}\cdot \varepsilon
$$

而逐点收敛和依 $L^2$ 收敛无法互推。

### 命题12（向量收敛则长度收敛）

设 $f, f_n\in L^2([a,b]),\ n=1,2,\cdots$，若 $f_n\mathop\longrightarrow\limits^{L^2}f\quad (n\rightarrow +\infty)$，则

$$
||f_n||_2\rightarrow ||f||_2\quad(n\rightarrow +\infty)
$$

---

**证明**： 由**命题8 三角不等式**得

$$
\biggl| ||f_n||_2-||f||_2\biggl|\leqslant ||f_n- f||_2\rightarrow 0
$$

**QED**

### 命题13（向量收敛则内积收敛）

设 $f_n,g_n,f,g\in L^2([a,b]),\ n=1,2,\cdots$，若 $f_n\mathop\longrightarrow\limits^{L^2}f,g_n\mathop\longrightarrow\limits^{L^2}g$，则

$$
\langle f_n,g_n \rangle\mathop\longrightarrow\limits^{L^2}\langle f,g \rangle
$$

---

**证明**： 

$$
\begin{aligned}
|\langle f,g \rangle-\langle f_n,g_n \rangle| =&\ |\langle f,g \rangle-\langle f_n,g \rangle+\langle f_n,g \rangle-\langle f_n,g_n \rangle|\\
=&\ |\langle f-f_n,g \rangle+\langle f_n,g-g_n \rangle|\\
\leqslant&\ ||f-f_n||_2\cdot||g||_2+||f_n||_2\cdot||g-g_n||_2\rightarrow 0
\end{aligned}
$$

**QED**

## Fourier级数依L2收敛

若 $f:\mathbb R\rightarrow \mathbb R,\ f\biggl|_{[-\pi,\pi]}\in L^1([-\pi,\pi])$ 周期为 $2\pi$，且 $Lipschitz$ 连续，则  $f_n\rightarrow f$ 逐点收敛，即

$$
f(x) = \frac{a_0}{2}+\sum_{k=1}^{\infty}\{a_k\cos kx+b_k\sin kx\}
$$

类似是否有 $f\biggl|_{[-\pi,\pi]}\in L^2([-\pi,\pi])$，是否有 $f_n\mathop\longrightarrow\limits^{L^2}f$，即 $f$ 的 $Fourier$ 级数依 $L^2$ 收敛于 $f$，

$$
f(x)\xlongequal{L^2}\frac{a_0}{2}+\sum_{k=1}^{\infty}\{a_k\cos kx+b_k\sin kx\}
$$

答案是肯定的，下面以定理的形式写出。

### 定理1（Fourier级数依L2收敛）

设 $f\in L^2([-\pi,\pi])$，记

$$
\begin{aligned}
&a_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx\,dx\quad (k=0,1,2,\cdots)\\
&b_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx\,dx\quad (k=1,2,\cdots)\\
&f_n=\frac{a_0}{2}+\sum_{k=1}^n\{a_k\cos kx+b_k\sin kx\}
\end{aligned}
$$

则 $||f_n-f||_2\rightarrow 0\quad(n\rightarrow +\infty)$。

---

由此看出

$$
\left\{\frac{1}{2},\cos kx,\sin kx:k\in \mathbb Z_{\geqslant 1}\right\}
$$

为 $L^2([-\pi,\pi])$ 上的一组**正交基**。

该命题证明较之前证明 $f_n$ 逐点收敛更为几何化，而不需要大量的运算，主要是利用函数的向量的性质

下面定义一些记号，设 $f,g\in L^2([-\pi,\pi])$，$f_n$ 为 $f$ 的 $Fourier$ 级数的前 $n+1$ 项和，则通过定义可得

$$
(f-g)_n=f_n-g_n
$$

记

$$
\mathcal{A}_n = \text{span}\left\{\frac{1}{2},\cos mx, \sin kx:m, k = 1,2,\cdots, n\right\}
$$

其中 $\text{span}$ 为**基的扩张**，则 $f_n\in \mathcal{A}_n$。

### 引理1（$f_n$ 为 $f$ 在 $\mathcal{A}_n$ 空间上的投影）

1. （正交性）$\langle f-f_n,p \rangle=0\quad \forall p\in \mathcal{A}_n$

2. （$Bessel$ 不等式）$||f_n||_2\leqslant ||f||_2$

3. （最佳 $L^2$ 逼近）$||f-f_n||_2\leqslant ||f-p||_2\quad \forall p\in \mathcal{A}_n$

---

**思考**： 

由于 $\mathcal{A}_n$ 是由一组**正交基**扩张而成的，仔细观察 $f_n$ 的定义式，可以发现

$$
\begin{aligned}
&a_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cos kx\,dx=\frac{1}{\pi}\langle f(x),\cos kx \rangle\\
&b_k=\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\sin kx\,dx=\frac{1}{\pi}\langle f(x),\sin kx \rangle
\end{aligned}
$$
所以
$$
\begin{aligned}
f_n=&\ \frac{a_0}{2}+\sum_{k=1}^n\{a_k\cos kx+b_k\sin kx\}\\
=&\ \frac{2}{\pi}\langle f(x),\frac{1}{2} \rangle\cdot\frac{1}{2}+\sum_{k=1}^n\left\{\frac{1}{\pi}\langle f(x),\cos kx \rangle\cos kx+\frac{1}{\pi}\langle f(x),\sin kx \rangle\sin kx\right\}
\end{aligned}
$$

考虑在向量空间中，一个向量如何做一个面上的**投影**。

设 $x \in \mathbb R^{n+1}$，则对于 $\mathbb R^{n+1}$ 中的一个**平面**的**正交基**

$$
\{e_1,e_2,\cdots,e_n\}
$$

$x$ 在这个面上的投影可以表示成如下形式

$$
\begin{aligned}
x = \frac{\langle x, e_1\rangle}{\langle e_1,e_1 \rangle} e_1+\frac{\langle x,e_2 \rangle}{\langle e_2,e_2 \rangle} e_2+\cdots+\frac{\langle x,e_n \rangle}{\langle e_n,e_n \rangle} e_n=\sum_{k=1}^n\frac{\langle x,e_k \rangle }{\langle e_k,e_k \rangle}e_k
\end{aligned}
$$

而 $f_n$ 的表达式，正好满足了该式，所以 $f_n$ 可以理解为 $f$ 在 $\mathcal{A}_n$ 上的投影，下面给出严格证明。

**证明**： 

1. 
$$
\begin{aligned}
&\ \langle f_n,\frac{1}{2} \rangle = \int_{-\pi}^{\pi}\frac{a_0}{2}\cdot \frac{1}{2}=2\pi\frac{a_0}{4}=\frac{\pi}{2}\cdot\frac{1}{\pi}\int_{-\pi}^{\pi}f=\int_{-\pi}^{\pi}f\cdot\frac{1}{2}=\langle f,\frac{1}{2} \rangle\\
&\ \langle f_n,\cos kx \rangle=\int_{-\pi}^{\pi}a_k\cos^2 kx=\pi a_k=\pi\cdot\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cdot kx\,dx=\int_{-\pi}^{\pi}f(x)\cos kx\,dx=\langle f,\cos kx \rangle\\
&\ \langle f_n,\sin kx \rangle=\int_{-\pi}^{\pi}a_k\sin^2 kx=\pi a_k=\pi\cdot\frac{1}{\pi}\int_{-\pi}^{\pi}f(x)\cdot kx\,dx=\int_{-\pi}^{\pi}f(x)\sin kx\,dx=\langle f,\sin kx \rangle
\end{aligned}
$$

则对于 $\mathcal{A}_n$ 中的任意一个基 $e_k$，都有 $\langle f-f_n,e_k \rangle = 0$，由于 $\forall p\in\mathcal{A}_n$，$p = \sum_{k=0}^na_ke_k\ (a_k\in \mathbb R)$，则

$$
\langle f-f_n,p \rangle = \sum_{k=0}^na_k\langle f-f_n,e_k \rangle = 0
$$

2.  由于 $f_n\in \mathcal{A}_n$，通过1.结论，$\langle f-f_n,f_n \rangle=0$，由勾股定理，得

$$
\begin{aligned}
&\ ||f||_2^2=||f-f_n||_2^2+||f_n||^2\\
\Rightarrow &\ ||f||_2^2\geqslant ||f_n||_2^2\\
\Rightarrow &\ ||f||_2\geqslant||f_n||_2
\end{aligned}
$$

3. 
$$
\begin{aligned}
&||f-p||_2^2 = ||f-f_n+f_n-p||_2^2=||f-f_n||_2^2+||f_n-p||_2^2\\
\Rightarrow&||f-p||_2^2\geqslant||f-f_n||_2^2\\
\Rightarrow&||f-p||_2\geqslant||f-f_n||_2
\end{aligned}
$$

### 引理2（连续函数的Fourier级数依二范数收敛）

设 $f\in C([-\pi,\pi]),\ f(-\pi)=f(\pi)$，则 $f_n\mathop\longrightarrow\limits^{L^2}f$。

---

**证明**： 设 $\tilde f:\mathbb R\rightarrow \mathbb R$ 为 $2\pi$ 周期函数，且 $\tilde f\biggl|_{[\pi,\pi]}=f$，则 $\tilde f\in C(\mathbb R)$，由 [$Weierstrass$ 定理](./#定理weierstrass-定理) 知，存在 $P_n\in\mathcal{A}_n$ 使得 $P_n\Rightarrow \tilde f$，则 $P_n\mathop\longrightarrow\limits^{L^2}\tilde f$，所以

$$
\begin{aligned}
&\int_{-\pi}^{\pi}|P_n-\tilde f|^2 \rightarrow 0\\
\Rightarrow &\int_{-\pi}^{\pi}|P_n- f|^2\rightarrow 0\\
\Rightarrow\ &||P_n-f||_2^2\rightarrow 0\\
\Rightarrow\ &||P_n-f||_2\rightarrow 0
\end{aligned}
$$

又由最佳 $L^2$ 逼近，得

$$
\begin{aligned}
&\ ||P_n-f||_2\geqslant ||f_n-f||_2\\
\Rightarrow &\ ||f_n-f||_2\rightarrow 0
\end{aligned}
$$

**QED**

### 引理3（L2中的函数可以由连续函数依L2逼近）

设 $f\in L^2([-\pi,\pi])$，$\forall \varepsilon > 0$，则 $\exists h\in C([-\pi,\pi])$，且  $h(-\pi)=h(\pi)$ 使得 $||f-h||_2\leqslant \varepsilon$。

---

**证明**： 由 [命题3 - L2中的函数可以用光滑函数逼近](./#命题3l2中的函数可以用光滑函数逼近) 知，$f$ 可由光滑函数逼近，则 $\exists g\in C([-\pi,\pi])$，使得 $||g-f||_2\leqslant \dfrac{\varepsilon}{2}$，令 $|g|\leqslant M$，

$$
h(x) = \begin{cases}
\dfrac{g(-\pi+\delta)}{\delta}(x+\pi),&[-\pi,-\pi+\delta];\\
g(x),&(-\pi+\delta,\pi-\delta);\\
\dfrac{g(\pi-\delta)}{\delta}(x-\pi),&[\pi-\delta,\pi].
\end{cases}
$$

则 

$$
||h-g||_2^2=\int_{-\pi}^{\pi}(g-h)^2\leqslant 2\int_{-\pi}^{-\pi+\delta}(2M)^2 = 8\delta M^2
$$

为使得 $\sqrt{8\delta}M\leqslant\dfrac{\varepsilon}{2}$，则 $\delta\leqslant\dfrac{\varepsilon^2}{32M^2}$ 时，$||h-g||_2\leqslant\dfrac{\varepsilon}{2}$。


综上，
$$
||f-h||_2\leqslant||f-g||_2+||g-h||_2\leqslant \varepsilon
$$

**QED**

$h(x)$ 函数的构造方法可以参考下图：

![构造端点值相等的函数逼近方法](https://s4.ax1x.com/2022/02/27/bmLyss.png)

### 定理的证明

**思路**： 由**引理2**知，一个连续的周期函数 $g$（要求端点值相等），满足 $g_n\mathop\longrightarrow\limits^{L^2}g$，由**引理3**知，$f\in L^2$，$f$ 可由连续周期函数 $g$ 逼近，通过估计即可证明定理。

**证明**： $\forall \varepsilon > 0$，由**引理3**知，$\exists h \in C([-\pi,\pi]),\ h(-\pi)=h(\pi)$，使得 $||f-h||_2\leqslant\dfrac{\varepsilon}{4}$，则

$$
||f_n-f||_2\leqslant||h_n-h||_2+||h_n-f_n||_2+||f-h||_2
$$

其中 $||h_n-f_n||_2 = ||(h-f)_n||_2\leqslant||h-f||_2$（$Bessel$ 不等式）。

所以

$$
||f_n-f||_2\leqslant||h_n-h||_2+\frac{\varepsilon}{2}
$$

由**引理2**知，$h_n\mathop\longrightarrow\limits^{L^2}h$，则 $\exists N\in \mathbb Z_{ > 0}$，使得 $\forall n\geqslant N$，有 $||h_n-h||_2\leqslant\dfrac{\varepsilon}{2}$。

综上，

$$
||f_n-f||_2\leqslant ||h_n-h||_2+\frac{\varepsilon}{2}\leqslant \varepsilon
$$

**QED**

### 定理2（两个函数L2内积的表达式）

设 $f, g\in L^2([-\pi,\pi])$，

$$
\begin{aligned}
&f\sim \frac{a_0}{2}+\sum_{k=1}^{\infty}\{a_k\cos kx+b_k\sin kx\}\\
&g\sim \frac{c_0}{2}+\sum_{k=1}^{\infty}\{c_k\cos kx+d_k\sin kx\}
\end{aligned}
$$

则

$$
\begin{aligned}
\frac{1}{\pi}\int_{-\pi}^{\pi}fg=&\ \frac{a_0c_0}{2}+\sum_{k=1}^{\infty}\{a_kc_k+b_kd_k\}\\
\frac{1}{\pi}\int_{-\pi}^{\pi}f^2=&\ \frac{a_0^2}{2}+\sum_{k=1}^{\infty}\{a_k^2+b_k^2\}&\text{Parseval 恒等式}\\
\end{aligned}
$$

---

**证明**： 由**定理1**知，$f_n\mathop\longrightarrow\limits^{L^2}f,\ g_n\mathop\longrightarrow\limits^{L^2}g$，由**命题13**和 $\mathcal{A}_n$ 是一组正交基，知

$$
\begin{aligned}
\langle f,g \rangle=\lim_{n\rightarrow \infty}\langle f_n,g_n \rangle=&\ \lim_{n\rightarrow \infty}\left\{\langle \frac{a_0}{2},\frac{c_0}{2} \rangle+\sum_{k=1}^n\{\langle a_k\cos kx, c_k\cos kx \rangle+\langle b_k\sin kx, d_k\sin kx \rangle\}\right\}\\
=&\ \lim_{n\rightarrow \infty}\left\{\pi\frac{a_0c_0}{2}+\sum_{k=1}^n\{\pi a_kc_k+\pi b_kd_k\}\right\}\\
=&\ \pi\left\{\frac{a_0c_0}{2}+\sum_{k=1}^{\infty}\{a_kc_k+b_kd_k\}\right\}
\end{aligned}
$$

令 $g = f$，第二个式子成立。

**QED**

### 定理3（对三角多项式积分）

设 $f\in L^2([-\pi,\pi])$，且

$$
f\sim \frac{a_0}{2}+\sum_{k=1}^{\infty}\{a_k\cos kx+b_k\sin kx\}
$$

令 $[a, b]\subset [-\pi,\pi]$，则

$$
\int_a^bf = \int_a^b\frac{a_0}{2}\,dx+\sum_{k=1}^{\infty}\left\{\int_a^ba_k\cos kx+\int_a^bb_k\sin kx\right\}
$$

---

**证明**： 由于

$$
\int_a^bf_n = \int_a^b\frac{a_0}{2}\,dx+\sum_{k=1}^{n}\left\{\int_a^ba_k\cos kx+\int_a^bb_k\sin kx\right\}
$$

又由于

$$
\begin{aligned}
\left|\int_a^bf_n-\int_a^bf\right| =&\ \left|\int_a^b(f_n-f)\right|\\
\leqslant&\ \int_a^b|f_n-f|\cdot 1\\
\leqslant&\ \left(\int_a^b|f_n-f|^2\right)^{\frac{1}{2}}\left(\int_a^b1\right)^{\frac{1}{2}}\\
\leqslant&\ \sqrt{b-a}\cdot\varepsilon
\end{aligned}
$$

则

$$
\begin{aligned}
&\int_a^bf_n\rightarrow \int_a^bf\quad(n\rightarrow \infty)\\
\Rightarrow &\int_a^bf = \int_a^b\frac{a_0}{2}\,dx+\lim_{n\rightarrow \infty}\sum_{k=1}^{n}\left\{\int_a^ba_k\cos kx+\int_a^bb_k\sin kx\right\}\\
\Rightarrow &\int_a^bf = \int_a^b\frac{a_0}{2}\,dx+\sum_{k=1}^{\infty}\left\{\int_a^ba_k\cos kx+\int_a^bb_k\sin kx\right\}
\end{aligned}
$$

**QED**

### 定理4

设 $f, g\in C([-\pi,\pi])$，

$$
\begin{aligned}
&f\sim \frac{a_0}{2}+\sum_{k=1}^{\infty}\{a_k\cos kx+b_k\sin kx\}\\
&g\sim \frac{c_0}{2}+\sum_{k=1}^{\infty}\{c_k\cos kx+d_k\sin kx\}
\end{aligned}
$$

(1). 如果 $a_k=0,\  k=0,1,2,\cdots,\ b_k = 0,\ k=1,2,\cdots$，则 $f\equiv 0$

(2). 如果 $a_k=c_k,\ k=0,1,2,\cdots,\ b_k=d_k,\ k = 1,2,\cdots$，则 $f\equiv g$

---

**证明**：

(1). 由**定理2**知，

$$
\begin{aligned}
\int_{-\pi}^{\pi}f^2=\pi\left\{\frac{a_0^2}{2}+\sum_{k=1}^{\infty}\{a_k^2+b_k^2\}\right\} = 0
\end{aligned}
$$

由 $f$ 连续可知 $f\equiv 0$。

(2). 由于 $(f-g)_n = f_n-g_n$，即三角多项式系数相减，则 $f_n-g_n$ 的系数均为 $0$，由(1)知，
$$
f-g\equiv 0\Rightarrow f\equiv g
$$

**QED**
