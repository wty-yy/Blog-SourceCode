---
title: 莫比乌斯反演
hide: false
math: true
category:
  - Math
tags:
  - 莫比乌斯反演
  - 数论分块
abbrlink: 61065
date: 2021-08-16 09:32:18
index_img:
banner_img:
---

参考：[OI-Wike 莫比乌斯反演](https://oi-wiki.org/math/number-theory/mobius/)

# 前置芝士
## 引理1
> 引理1：$\forall a, b, c\in \mathbb{Z}, \left\lfloor\frac{a}{bc}\right\rfloor=\left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}\right\rfloor$。

**证明：** 令 $\frac{a}{b} = \left\lfloor\frac{a}{b}\right\rfloor+r_1, \quad 0\leqslant r_1 < 1$，

带余数除法：$\left\lfloor\frac{a}{b}\right\rfloor=q\cdot c+r_2=\left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}\right\rfloor\cdot c+r_2, \quad 0\leqslant r_2 \leqslant c-1$，

则有：
$$
\left\lfloor\frac{a}{bc}\right\rfloor=\left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}+\frac{r_1}{c}\right\rfloor=\left\lfloor q+\frac{r_1+r_2}{c}\right\rfloor=q+\left\lfloor\frac{r_1+r_2}{c}\right\rfloor
$$
由于：$0=\frac{r_1+r_2}{c} < \frac{1+c-1}{c} = 1$，

则 $\left\lfloor\frac{a}{bc}\right\rfloor = q = \left\lfloor\frac{\left\lfloor\frac{a}{b}\right\rfloor}{c}\right\rfloor$。

**QED**

---

## 引理2
> 引理2：$\forall n\in\mathbb Z_{> 0},\quad \left|\left\{\lfloor\frac{n}{d}\rfloor:d\in\mathbb Z_{> 0}, d\leqslant n\right\}\right|\leqslant\lfloor2\sqrt{n}\rfloor$，$|V|$ 代表集合 $V$ 中的元素个数。

**证明：** 
- 当 $d\leqslant\lfloor\sqrt n\rfloor$ 时，$\lfloor\frac{n}{d}\rfloor$ 有 $d\leqslant \lfloor\sqrt n\rfloor$ 种取值。

- 当 $d > \lfloor\sqrt n\rfloor$ 时，$\lfloor\frac{n}{d}\rfloor$ 有 $\lfloor\frac{n}{d}\rfloor\leqslant \lfloor\sqrt n\rfloor$ 种取值。

综上，$\lfloor\frac{n}{d}\rfloor$ 总取值不会超过 $2\lfloor\sqrt n\rfloor$ 种。

**QED**

---

## 数论分块

一般用于求解 $\sum_{i=1}^n\lfloor\frac{n}{i}\rfloor$，有关 $\left\lfloor\frac{n}{i}\right\rfloor$ 的求和式。

我们想把求和式转换为**计数**方法快速求出：
$$
\sum_{i=1}^n\lfloor\frac{n}{i}\rfloor=\sum_{d=\lfloor\frac{n}{i}\rfloor} d\cdot f(d)
$$
其中：$f(d)=\sum\limits_{d=\lfloor\frac{n}{i}\rfloor}1=\sum_{i=1}^n[\lfloor\frac{n}{i}\rfloor=d]$，"`[bool条件]`" 表示如果内部布尔条件成立则为1，否则为0。

由**引理2**知，$d$ 的取值只有 $2\lfloor\sqrt n\rfloor$ 种，所以只需求出 $f(d)$ 即可。

> 命题3（数论分块）：设 $n\in\mathbb Z_{> 0},\quad\forall i\leqslant n$，则 $\max\{j:\lfloor\frac{n}{j}\rfloor=\lfloor\frac{n}{i}\rfloor\}=\left\lfloor\frac{n}{\left\lfloor\frac{n}{i}\right\rfloor}\right\rfloor$

**证明：** 令 $k=\lfloor\frac{n}{i}\rfloor$, 设 $\lfloor\frac{n}{j}\rfloor=k$，则：
$$
\lfloor\frac{n}{j}\rfloor=k\iff k\leqslant\frac{n}{j} < k+1\iff \frac{1}{k+1} < \frac{j}{n}\leqslant \frac{1}{k}\iff \frac{n}{k+1} < j\leqslant\frac{n}{k}
$$
由于 $j\in\mathbb Z_{> 0}$，则 $j_{\max}=\lfloor\frac{n}{k}\rfloor$。 

**QED**

参考代码：

```c++
for (int l = 1, r; l <= n; l = r + 1) {
	r = n / (n / l);
	ans += (n / l) * (r - l + 1);
}
```

可以发现，满足 $\lfloor\frac{n}{i}\rfloor$ 具有相同取值的 $i$，是在一个连续区间 $\left[i_{\min},\left\lfloor\frac{n}{\left\lfloor\frac{n}{i}\right\rfloor}\right\rfloor\right]$，又由于这样的区间至多只有 $2\lfloor\sqrt n\rfloor$ 个，所以称之为**数论分块**（可能吧，我猜的）。

总复杂度 $O(\sqrt n)$

类似的，单变量的多维形式同样也可以使用数论分块，如：

$$
\sum_{i=1}^{\min\{n,m\}}\left\lfloor\frac{n}{i}\right\rfloor\left\lfloor\frac{m}{i}\right\rfloor
$$

---

# 积性函数
## 定义

- 积性函数：$f(x)$ 为积性函数 $\iff \forall x, y\in\mathbb Z_{> 0}, \text{gcd}(x, y)=1\Rightarrow f(xy)=f(x)f(y)$。

- 完全积性函数：$f(x)$ 为完全积性函数 $\iff \forall x, y\in\mathbb Z_{> 0}\Rightarrow f(xy)=f(x)f(y)$。

不难发现积性函数一定满足：$f(1)=1$。

## 性质

令 $f(x), g(x)$ 都是积性函数，则进入如下的变换后的函数仍是积性函数：
$$
\begin{aligned}
h(x)&=f(x^n)\\h(x)&=f^n(x)\\h(x)&=f(x)g(x)\\h(x)&=\sum_{d|x}f(d)g(\frac{x}{d})
\end{aligned}
$$
其中，第四个称为Dirichlet卷积，证明见下文 [Dirichlet卷积]()。

设 $x=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_s^{\alpha_s}$，

则 $f(x) = f(p_1^{\alpha_1})f(p_2^{\alpha_2})\cdots f(p_s^{\alpha_s})$，说明积性函数可以将一般问题转换为研究素数次幂的问题。

## 例子

如下的一些函数都是积性函数：

- 单位函数：$\varepsilon(n)=[n=1]=\delta_{n, 1}$ （完全积性函数）

- 恒等函数：$\text{Id}_k(n)=n^k$，记 $\text{Id}_1(n)=\text{Id}(n)=n$ （完全积性函数）

- 常数函数：$1(n)=1$ （完全积性函数）

- 除数函数：$\sigma_k(n)=\sum_{d|n}d^k$，记 $\sigma_0(n)=\tau(n)\text{或}d(n)=\sum_{d|n}1$（因数个数函数）
$\sigma_1(n)=\sigma(n)=\sum_{d|n}d$（因数和函数）

- Euler函数：$\varphi(n)=\sum_{i=1}^n[\text{gcd}(i, n)=1]$

- Mobius函数：$\mu(n)=\begin{cases}1, & n=1;\\(-1)^r, & m\text{为}r\text{个两两互异的素数之积};\\0, & \texttt{otherwise}.\end{cases}$

除数函数是积性函数，可以是因为 $\sigma_k(n)=Id_k\ast 1$，通过Dirichlet卷积得证，Dirichlet卷积部分见下文。

Euler函数是积性函数，可以通过简化剩余系的构造证明，也可以从计算式上证明。

Mobius函数是积性函数的证明，见下文 [Mobius函数]()。

# Dirichlet 卷积

## 定义

对于两个数论函数（$\mathbb Z_{>0} \rightarrow \mathbb{C}$） $f(x), g(x)$，定义它们的Dirichlet卷积为：
$$
h(x)=\sum_{d|x}f(d)g(\frac{x}{d})=\sum_{ab=x}f(a)g(b)
$$
上式简记为：
$$
h=f\ast g
$$
狄利克雷卷积是数论函数的重要运算，数论函数的许多性质都是通过这个运算挖掘出来的。（from OI Wike）

## 性质

### 交换律
$f\ast g=g\ast f$

该证明比较显然，略去。
### 结合律
$(f\ast g)\ast h=f\ast (g\ast h)$

**证明：**
$$
\begin{aligned}
\left((f\ast g)\ast h\right)(n) &= \sum_{xc=n} (f\ast g)(x)\cdot h(c)\\
&= \sum_{xc=n}\sum_{ab=x}f(a)g(b)h(c)\\
&= \sum_{abc=n}f(a)g(b)h(c)\\
&= \sum_{abc=n}f(c)g(a)h(b)\\
&= \sum_{xc=n}f(c)\sum_{ab=x}g(a)h(b)\\
&= \sum_{xc=n}f(c)(g\ast h)(x)\\
&= \left(f\ast(g\ast h)\right)(n)\\
&& \square
\end{aligned}
$$
### 分配律
$(f+g)\ast h=f\ast h+g\ast h$

**证明：**
$$
\begin{aligned}
((f+g)\ast h)(n)&=\sum_{xy=n}(f+g)(x)\cdot h(y)\\
&=\sum_{xy=n}(f(x)+g(x))\cdot h(y)\\
&=\sum_{xy=n}(f(x)h(y)+g(x)h(y))\\
&=\sum_{xy=n}f(x)h(y)+\sum_{xy=n}g(x)h(y)\\
&=f\ast h+g\ast h
&& \square
\end{aligned}
$$
### 判断数论函数相等
> 命题1：设 $f, g$ 为两个数论函数，则 $f=g\iff \forall h\text{为数论函数且}h(1)\neq 0,\ f\ast h=g\ast h$。

**证明：** "$\Rightarrow$" 显然。

"$\Leftarrow$"：

反设，$f\neq g$，则不妨令 $x$ 为最小的满足 $f(x)\neq g(x)$ 的正整数。

设 $r=f\ast h-g\ast h=(f-g)\ast h$，则：
$$
r(x)=(f(x)-g(x))\ast h(x)=\sum_{d|x}(f(d)-g(d))h(\frac{x}{d})=(f(x)-g(x))h(1)\neq 0
$$
故 $f\ast h-g\ast h\neq 0\Rightarrow f\ast h\neq g\ast h$，与条件矛盾。

**QED**

---

### 幺元

> 单位函数 $\varepsilon$ 是Dirichlet卷积的幺元。

也就是说对于任何的数论函数 $f$，都有 $f\ast \varepsilon=f$。

### 逆元

> 设数论函数 $f(x)\neq 0$，若存在数论函数 $g(x)$，使得 $f\ast g=\varepsilon$，则称 $g(x)$ 是 $f(x)$ 的狄利克雷逆元（下文中简称为“逆元”）。

令 $x=1$，则有 $1=\varepsilon(1)=f(1)\ast g(1)=\sum_{ab=1}f(a)g(b)=f(1)g(1)\Rightarrow g(1)=\frac{1}{f(1)}$，故 $f(x)$ 存在逆元的一个必要条件为 $f(x)\neq 0$。

**逆元的唯一性：** 假设 $f(x)$ 存在两个不同的逆元 $g_1(x), g_2(x)$，则有 $f\ast g_1=\varepsilon=f\ast g_2$，由[命题1](./#判断数论函数相等)知，$g_1=g_2$，与假设矛盾，故逆元具有唯一性。

我们可以通过构造的方式给出 $f(x)$ 的逆元：

$$
\begin{aligned}
&\varepsilon(x)=f\ast g=\sum_{d|x}f(d)g(\frac{x}{d})=\sum_{d|x, d\neq 1}f(d)g(\frac{x}{d})+f(1)g(x)\\
\Rightarrow & g(x)=\frac{\varepsilon(x)-\sum_{d|x, d\neq 1} f(d)g(\frac{x}{d})}{f(1)}\\
\Rightarrow & g(x)=
\begin{cases}
\frac{1}{f(1)}, & x=1;\\
-\frac{\sum_{d|x, d\neq1}f(d)g(\frac{x}{d})}{f(1)}, & \texttt{otherwise}.
\end{cases}
\end{aligned}
$$

则可以通过递归的方式求解 $f(x)$ 的逆元。

### 两个积性函数的Dirichlet卷积也是积性函数

> 命题2：设积性函数 $f(x), g(x)$，则 $f\ast g$ 也是积性函数。

**证明：** 令 $h=f\ast g$，设 $\forall x, y\in\mathbb Z_{>0},\ \text{gcd}(x, y)=1$，则：
$$
\begin{aligned}
h(xy)&=\sum_{d|xy}f(d)g(\frac{xy}{d})\\
&\xlongequal[d_1d_2=d]{d_1|x, d_2|y}\sum_{d_1|x}\sum_{d_2|y}f(d_1d_2)g(\frac{x}{d_1}\cdot\frac{y}{d_2})\\
&=\sum_{d_1|x}\sum_{d_2|y}(f(d_1)g(\frac{x}{d_1})\cdot f(d_2)g(\frac{y}{d_2}))\\
&=\sum_{d_1|x}f(d_1)g(\frac{x}{d_1})\cdot \sum_{d_2|y}f(d_2)g(\frac{y}{d_2})\\
&=h(x)\cdot h(y)
&&\square
\end{aligned}
$$

### 积性函数的Dirichlet逆元也是积性函数

> 命题3：设积性函数 $f(x)$，则 $f(x)$ 的Dirichlet逆元 $g(x)$ 也是积性函数。

**证明：** 由于 $f(x)$ 是积性函数，所以 $f(1)=1$，则 $g(1)=\frac{1}{f(1)}=1$。

命题等价条件为 $\forall n, m\in\mathbb Z_{>0}, \text{gcd}(n, m)=1, g(nm)=g(n)g(m)$，下面用数学归纳法证明：

对 $nm$ 进行归纳，当 $nm=1$ 时，$n=m=1$，则 $g(nm)=g(1)=1=g(1)g(1)=g(n)g(m)$ 命题成立。

假设对 $\forall x, y\in\mathbb Z_{>0}, \text{gcd}(x,y)=1, xy < nm$ 有 $g(xy)=g(x)g(y)$，

且 $n, m$ 都不等于 $1$，若 $n=1$，则 $g(nm)=g(m)=1\cdot g(m)=g(n)g(m)$，反之亦然。

则由[逆元定义式](./#逆元)有：
$$
\begin{aligned}
g(nm)&=-\sum_{d|nm, d\neq 1}f(d)g(\frac{nm}{d})\\
&=-\sum_{a|n,b|m,ab\neq1}f(ab)g(\frac{n}{a}\cdot\frac{m}{b})\\
&\xlongequal{\text{由假设知}}-\sum_{a|n,b|m,ab\neq1}f(a)g(\frac{n}{a})f(b)g(\frac{m}{b})\\
&=f(1)g(n)g(m)-\sum_{a|n}\sum_{b|m}f(a)g(\frac{n}{a})f(b)g(\frac{m}{b})\\
&=g(n)g(m)-\sum_{a|n}f(a)g(\frac{n}{a})-\sum_{b|m}f(b)g(\frac{m}{b})\\
&=g(n)g(m)-f\ast g(n)-f\ast g(m)\\
&=g(n)g(m)-\varepsilon(n)-\varepsilon(m)\\
&=g(n)g(m)\\
\end{aligned}
$$
故命题成立。

综上，积性函数$f$ 的Dirichlet逆元为积性函数。

**QED**

---

## 例子
下述几个例子是对Dirichlet卷积性质的应用：
$$
\begin{aligned}
d = 1\ast 1&\iff d(n)=\sum_{d|n}1\\
\sigma = \text{Id}\ast 1&\iff \sigma(n)=\sum_{d|n}d\\
\text{Id} = \varphi\ast 1&\iff n=\sum_{d|n}\varphi(d)
\end{aligned}
$$

> 使用Dirichlet卷积的性质证明 $\varphi\ast 1=\text{Id}$。

**证明：** 由于 $\varphi$ 和 $1$ 都是积性函数，则它们的Dirichlet卷积也是积性函数，于是命题等价证明：

$\forall p, c\in\mathbb Z_{>0}, p\text{为素数}, (\varphi\ast 1)(p^c) = \text{Id}(p^c)$，则：
$$
\begin{aligned}
\varphi\ast 1&=\sum_{d|p^c}\varphi(d)\\
&=\varphi(1)+\varphi(p)+\cdots+\varphi(p^c)\\
&=1+p-1+p(p-1)+\cdot+p^{c-1}(p-1)\\
&=1+(p-1)(1+p+p^2+\cdots+p^{c-1})\\
&=1+(p-1)\cdot\frac{1-p^c}{1-p}\\
&=1+p^c-1\\
&=p^c
&&\square
\end{aligned}
$$

# Mobius函数

## 定义

$\mu(n)$ 记为莫比乌斯函数，定义为：
$$
\mu(n)=\begin{cases}
1, &n=1;\\
(-1)^k, &n为k个两两互异的素数之积;\\
0, &\texttt{otherwise}.
\end{cases}
$$
解释：

1. $\mu(1)=1$

2. 当 $n\neq 1$ 时，若 $n=p_1p_2\cdots p_k$，其中 $p_i$ 为两两不同的素数，则 $\mu(n)=(-1)^k$，否则 $\mu(n)=0$

## 性质

> 命题4：Mobius函数是常数函数 $1(x)$ 的Dirichlet逆元： $\mu \ast 1 = \varepsilon\iff\sum_{d|x}\mu(d)=\varepsilon(x)$。

**证明：**

**法1：** （利用Dirichlet逆元定义和积性函数的性质证明）

令 $g(x)$ 为常数函数 $1(x)$ 的Dirichlet逆元，由Dirichlet逆元的定义有：
$$
g(x)=\begin{cases}
1, & x=1;\\
-\sum_{d|x, d\neq1}g(\frac{x}{d}), & otherwise.
\end{cases}
$$

于是有：

1. $g(1)=1$。

2. 若 $x=p$，则 $g(p)=-g(1)=-1$，又由于 $g(x)$ 是积性函数，故 $g(p_1p_2\cdots p_k)=g(p_1)g(p_2)\cdots g(p_k)=(-1)^k$。

3. 若 $x=p^k$，通过归纳法得：
$$
\begin{aligned}
g(p^2)&=-(g(1)+g(p))=-(1-1)=0\\ g(p^3)&=-(g(1)+g(p)+g(p^2))=-(1-1+0)=0\\
\ldots\\ g(p^k)&=-(g(1)+g(p)+\cdots+g(p^{k-1}))=-(1-1+0+\cdots+0)=0
\end{aligned}
$$
综上，得 $g(x)=\mu(x)\Rightarrow \mu\ast 1=\varepsilon$

**QED**

**法2：** （利用展开式和二项式定理证明）

原命题等价证明：$\displaystyle \sum_{d|x}\mu(d)=\varepsilon(x)$。

设 $\displaystyle x=\prod_{i=1}^k p_i^{\alpha_i}, x'=\prod_{i=1}^kp_i$

- 当 $k=0$ 时，即 $x=1$，则 $\displaystyle \sum_{d|1}\mu(d)=\mu(1)=1$

- 当 $k\neq 0$ 时，则：
$$
\sum_{d|x}\mu(d)=\sum_{d|x'}\mu(d)=\sum_{i=0}^k\binom{k}{i}(-1)^i=(-1+1)^k=0
$$

综上，有 $\sum_{d|x}\mu(d)=\varepsilon(x)$，故原命题得证。

**QED**

> 推论5：$\sum_{d|\text{gcd}(i, j)}\mu(d)=[\text{gcd}(i,j)=1]$

**证明：** 通过**命题4**结论，令 $x=\text{gcd}(i,j)$ 即可。 **QED**

## Mobius线性筛

由于 $\mu$ 函数为积性函数，因此可以线性筛出Mobius函数（基本所有积性函数都可以通过线性筛求得）。
{% spoiler 点击显/隐代码 %}
```c++
int mu[N];
bool vis[N];
vector<int> prim;
void getmu(int n) {
	mu[1] = 1;
	for (int i = 2; i <= n; i++) {
		if (!vis[i]) {
			prim.pb(i);
			mu[i] = -1;
		}
		for (auto j : prim) {
			int t = i * j;
			if (t > n) break;
			vis[t] = 1;
			if (i % j == 0) {
				mu[t] = 0;
				break;
			}
			mu[t] = -mu[i];
		}
	}
}
```
{% endspoiler %}

# Mobius反演
## 公式
> 命题6：（Mobius反演）设 $f(n), g(n)$ 为两个数论函数。
如果有 $\displaystyle f(n)=\sum_{d|n}g(d)$，则有 $\displaystyle g(n)=\sum_{d|n}\mu(d)f(\frac{n}{d})$。
如果有 $\displaystyle f(n)=\sum_{n|d}g(d)$，则有 $\displaystyle g(n)=\sum_{n|d}\mu(\frac{d}{n})f(d)$。

**证明：** 第一个式子：
$$
\begin{aligned}
f(n)=\sum_{d|n}g(d)&\iff f=g\ast 1\\
&\iff f\ast\mu=g\ast 1\ast\mu=g\\
&\iff \sum_{d|n}\mu(d)f(\frac{n}{d})=g(n)
\end{aligned}
$$

第二个式子：对原式使用数论变换，考虑逆推这个式子。
$$
\begin{aligned}
\sum_{n|d}\mu(\frac{d}{n})f(d)&=\sum_{k=1}^\infty\mu(k)f(kn)\\
&=\sum_{k=1}^\infty\mu(k)\sum_{kn|d}g(d)\\
&=\sum_{n|d}g(d)\sum_{k|\frac{d}{n}}\mu(k)\\
&=\sum_{n|d}g(d)\varepsilon(\frac{d}{n})\\
&\xlongequal{d=n}g(n)\\
&&\square
\end{aligned}
$$

# 应用

Mobius反演经常用于和 $\text{gcd}$ 有关的题目上，配合两个技巧：**提取公因式**，**数论分块**。

其中数论分块在上文中已经介绍了，下面介绍提取公因式方法。

## 提取公因式

设三元数论函数 $f(d, i, j)$，求解 $\sum_{i=1}^n\sum_{j=1}^m\sum_{d|\text{gcd}(i, j)}f(d, i, j)$，改变求和顺序，先枚举公因数 $d$：

$$
\begin{aligned}
\sum_{i=1}^n\sum_{j=1}^m\sum_{d|\text{gcd}(i, j)}f(d, i, j)&=\sum_{d=1}^\infty\sum_{i=1}^n[d|i]\sum_{j=1}^m[d|j]\cdot f(d,i,j)\\
&\xlongequal{i=xd, j=yd}\sum_{d=1}^{\infty}\sum_{xd=1}^n[d|dx]\sum_{yd=1}^m[d|dy]\cdot f(d, xd, yd)\\
&=\sum_{d=1}^\infty\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}1\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}1\cdot f(d,xd,yd)\\
&=\sum_{d=1}^{\min(n,m)}\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}f(d,xd,yd)
\end{aligned}
$$

同理可以获得其他类似结论：
$$
\begin{aligned}
\sum_{i=1}^n\sum_{d|i} f(d, i)&=\sum_{d=1}^n\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}f(d, xd)\\
\sum_{i=1}^n\sum_{j=1}^m\sum_{k=1}^l\sum_{d|\text{gcd}(i, j, k)}f(d,i,j,k)&=\sum_{d=1}^{\min(n,m,l)}\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\sum_{z=1}^{\left\lfloor\frac{l}{d}\right\rfloor}f(d,xd,yd,zd)\\
&\cdots
\end{aligned}
$$

## 练习题

下面几个都是blog的题解链接，附有推式过程。

1. [Luogu P2522 [HAOI2011]Problem b](/posts/64029/)

2. [Luogu P2398 GCD SUM](/posts/28234/)

3. [SPOJ 5971 LCMSUM - LCM Sum](/posts/49145/)

4. [Luogu P1829 [国家集训队]Crash的数字表格 / JZPTAB](/posts/2613/)

5. [Luogu P3327 [SDOI2015]约数个数和](/posts/45770/)

6. [Luogu P5176 公约数](/posts/1294/)
