---
title: 一阶微分方程解法总结
hide: false
math: true
abbrlink: 3855
date: 2021-10-05 11:05:02
index_img:
banner_img:
category:
 - Math
 - 常微分方程
tags:
---

因为一阶微分方程的类型颇多，解法也多种多样，故在国庆间，将前三周所讲内容做一点总结，以便复习时参考，下面都只给出结论，并没有给出推导过程。

## 线性方程

$$
\frac{dy}{dx} + P(x)y=Q(x)
$$

---

**解法：** 令 $y=u(x)\exp(-\int P(x)\,dx)$，再将其带回，得

$$
\begin{aligned}
&u'(x)\exp(-\int P(x)\,dx)=Q(x)\\
&u(x) = \int \left(Q(x)\exp(\int P(x)\,dx)\right)\,dx
\end{aligned}
$$

从而 $\displaystyle y = \left(\int \left(Q(x)\exp(\int P(x)\,dx)\right)\,dx\right)\exp(-\int P(x)\,dx)$

## Bernoulli 方程

$$
\frac{dy}{dx} + P(x)y = Q(x)y^n\quad (n\in \mathbb Z, n\neq 0, 1)
$$

---

**解法：**

$$
\begin{aligned}
&\frac{dy}{dx} + P(x)y = Q(x)y^n\quad\\
\Rightarrow\ &\frac{dy}{dx}y^{-n} + P(x)y^{1-n} = Q(x)\\
\text{令} &z = y^{1-n}, \text{ 则 } \frac{dz}{dx} = \frac{dy}{dx}(1-n)y^{-n}\\
\Rightarrow\ &\frac{dz}{dx}+(1-n)P(x)z = Q(x)
\end{aligned}
$$

转换为 [线性方程](./#线性方程) 。

## 变量可分离方程

$$
\frac{dy}{dx} = f(x)g(y)
$$

---

**解法：**

$$
\begin{aligned}
&\frac{dy}{dx} = f(x)g(y)\\
\Rightarrow\ &\frac{1}{g(y)}\,dy=f(x)\,dx\\
\Rightarrow\ &\int\frac{1}{g(y)}\,dy = \int f(x)\,dx
\end{aligned}
$$

## 齐次方程

### 定义

设 $n$ 元函数 $f(x_1, x_2, \ldots, x_n)$，若 $f(x_1, x_2, \ldots, x_n)$ 满足 

$$
f(tx_1, tx_2, \ldots, tx_n) = t^mf(x_1,x_2, \ldots, x_n)
$$

则称 $f(x_1, x_2, \ldots, x_n)$ 为 $m$ 次齐次方程。

且有 Euler定理 $\displaystyle \sum_{j=1}^n\frac{\partial f}{\partial x_j} x_j = mf$。

### 解法

$$
\begin{aligned}
&\text{求解 }\frac{dy}{dx} = F(\frac{y}{x})\\
令&z = \frac{y}{x},\text{ 则 } z+x\frac{dz}{dx} = \frac{dy}{dx}\\
\Rightarrow\ &z+x\frac{dz}{dx} = F(z)
\end{aligned}
$$

转换为 [变量可分离方程](./#变量可分离方程) 。

##  可转换为其次方程的方程

$$
\frac{dy}{dx} = f\left(\frac{a_1x+b_1y+c_1}{a_2x+b_2y+c_2}\right)
$$

---

**解法：**

1. 当 $c_1 = c_2 = 0$ 时，直接回到 [齐次方程](./#齐次方程)。

2. 当 $c_1^2+c_2^2\neq 0$ 时，

- $\begin{vmatrix}a_1&b_1\\a_2&b_2\end{vmatrix}\neq 0$，则方程 $\begin{cases}a_1x+b_1y+c_1 = 0\\a_2x+b_2y+c_2 = 0\end{cases}$ 有解，
设该方程的解为 $\begin{cases}x = \alpha\\y = \beta\end{cases}$，做变量替换，令 $\begin{cases}x=x'+\alpha\\y=y'+\beta\end{cases}$ 则
$$\text{原方程}\iff \frac{dy'}{dx'} = f(\frac{a_1x'+b_1y'}{a_2x'+b_2y'})\iff \frac{dy}{dx} = f(\frac{a_1x+b_1y}{a_2x+b_2y})$$
- 转换为 [齐次方程](./#齐次方程)。
- $\begin{vmatrix}a_1&b_1\\a_2&b_2\end{vmatrix} = 0$，则 $\exists \lambda$，使得 $\begin{cases}a_1 = \lambda a_2\\b_1 = \lambda b_2\end{cases}$，设 $z = a_1x+b_1y$，则 $\frac{dz}{dx} = a_1+b_1\frac{dy}{dx}$。
$$\text{原方程}\iff\frac{dz}{dx} = a_1+b_1f\left(\frac{z+c}{\lambda z+c}\right)$$
- 转换为 [变量可分离方程](./#变量可分离方程)。

## 全微分方程

### 定义

$$
\begin{aligned}
&M(x, y)\,dx+N(x, y)\,dy = 0\text{ 为全微分方程} \\
\iff &\text{存在二元可微函数 }f，\text{使得}\\
&df(x, y) = \frac{\partial f}{\partial x}\,dx + \frac{\partial f}{\partial y}\,dy =  M(x, y)\,dx+N(x, y)\,dy\\
\iff &\frac{\partial M(x, y)}{\partial y} = \frac{\partial N(x, y)}{\partial x}
\end{aligned}
$$

### 解法（偏微分法）

求解全微分方程 $M(x, y)\,dx+N(x, y)\,dy = 0$ 的解。

若能找到 $df = M(x, y)\,dx+N(x, y)\,dy) = 0$，则原方程的解为 $f = C$。

令 $f = \int M(x, y)\,dx+g(y)$，带回原式中，得

$$
\begin{aligned}
&\frac{\partial f}{\partial y} = \frac{\partial}{\partial y}\left(\int M(x, y)\,dx\right) + g'(y) = N(x,y)\\
\Rightarrow\ &g(y) = \int\left(N(x, y) - \frac{\partial}{\partial y}\left(\int M(x, y)\,dx\right)\right)\,dy\\
\end{aligned}
$$

将 $g(y)$ 带回到 $f$ 中即可。

## 凑微分

记住几个常用的：

$$
\begin{aligned}
y\,dx+x\,dy&=d(xy)\\
\frac{y\,dx-x\,dy}{y^2} &= d\left(\frac{x}{y}\right)\\
\frac{x\,dy-y\,dx}{x^2} &= d\left(\frac{y}{x}\right)\\
\frac{y\,dx-x\,dy}{xy} &= d\left(\log\left|\frac{x}{y}\right|\right)\\
\frac{y\,dx-x\,dy}{x^2+y^2} &= d\left(\arctan\left(\frac{x}{y}\right)\right)\\
\frac{y\,dx-x\,dy}{x^2-y^2} &= \frac{1}{2}\,d\left(\log\left|\frac{x-y}{x+y}\right|\right)\\
e^x(dy+y\,dx) &= d(ye^x)
\end{aligned}
$$

不难发现，这几个常微分大都和 $(y\,dx-x\,dy)$ 有关，所以看到这一项先提出来，尝试凑微分。

## 积分因子

### 定义

若 $M(x, y)\,dx+N(x, y)\,dy = 0$ 不是全微分方程，但乘上可微函数 $\mu(x, y)$ 后变为全微分，那么称 $\mu$ 为该方程的**积分因子**。

### 解法

由于能力匮乏，只能求解 $\mu$ 和单变量有关的通解。

1. 若 $\displaystyle\frac{N_x-M_y}{M}$ 只和 $y$ 有关，则 $\displaystyle \mu(y) = \exp\left(\int\frac{N_x-M_y}{M}\,dy\right)$。

2. 若 $\displaystyle\frac{M_y-N_x}{N}$ 只和 $x$ 有关，则 $\displaystyle \mu(x) = \exp\left(\int\frac{M_y-N_x}{N}\,dx\right)$。

### 积分因子结合

若 $M_1(x, y)\,dx+N_1(x, y)\,dy+M_2(x, y)\,dx+N_2(x, y)\,dy = 0$ 对于积分因子 $\mu_1(x, y), \mu_2(x, y)$ 分别是全微分方程，也就是说，存在 $F_1(x, y), F_2(x, y)$ 使得

$$
\begin{aligned}
dF_1 = \mu_1M_1\,dx+\mu_1N_1\,dy = 0\\
dF_2 = \mu_2M_2\,dx+\mu_2N_2\,dy = 0
\end{aligned}
$$

那么方程 $M_1(x, y)\,dx+N_1(x, y)\,dy+M_2(x, y)\,dx+N_2(x, y)\,dy = 0$ 有公共的积分因子 $\mu$，当且仅当，存在 $G_1(x), G_2(x)$，使得

$$
\mu_1(x, y)G_1(F_1(x, y)) = \mu_2(x, y)G_2(F_2(x, y))
$$

则公共因子 $\mu = \mu_1(x, y)G_1(F_1(x, y))$。

## 变量替换

### 形式一

求解
$$\frac{dy}{dx} = f(ax+by+c)$$

令 $z = ax + by + c$，则 $\displaystyle \frac{dz}{dx} = a + b\frac{dy}{dx}$。

$$
\begin{aligned}
\text{原方程}\iff \frac{dz}{dx} = a+bf(z)
\end{aligned}
$$

转换为 [变量可分离方程](./#变量可分离方程)。

### 形式二

求解
$$yf(xy)\,dx+xg(xy)\,dy = 0$$

令 $z = xy$，则 $\displaystyle \frac{dz}{dx} = y+x\frac{dy}{dx}\Rightarrow dz = y\,dx+x\,dy = \frac{z}{x}\,dx+x\,dy$
  

$$
\begin{aligned}
\text{原方程}&\iff \frac{z}{x}f(z)\,dx+g(z)\left(dz - \frac{z}{x}\,dx\right) = 0\\
&\iff g(z)\,dz+\frac{dx}{x}\left(f(z)-g(z)\right)z = 0
\end{aligned}
$$

转换为 [变量可分离方程](./#变量可分离方程)。

### Riccati 方程

形如

$$
\frac{dy}{dx} = P(x)y^2+Q(x)y+R(x)
$$

1. $R(x)\neq 0$ 时，利用特解 $\varphi(x)$，令 $y = z + \varphi(x)$。

代入原方程中：

$$
\begin{aligned}
\frac{dy}{dx} = \frac{dz}{dx} + \frac{d\varphi}{dx} &= P(x)(z^2+2z\varphi(x)+\varphi^2(x))+Q(x)(z+\varphi(x))+R(x)\\
\frac{dz}{dx} &= \left(P(x)\varphi^2(x)+Q(x)\varphi(x)+R(x)-\frac{d\varphi}{dx}\right)+P(x)z^2+2P(x)\varphi(x)z+Q(x)z\\
&= (2P(x)\varphi(x) + Q(x))z+P(x)z^2
\end{aligned}
$$

转化为 [Bernoulli方程](./#bernoulli-方程)。

2. 形如

$$
\frac{dy}{dx} + ay^2 = \frac{l}{x}y+\frac{b}{x^2}
$$

---

**解法：**

$$
\begin{aligned}
&\frac{dy}{dx} + ay^2 = \frac{l}{x}y+\frac{b}{x^2}\\
\Rightarrow\ &\frac{dy}{dx}x^2 + ax^2y^2 = lxy+b\\
\text{令} & z = xy, \text{ 则 } \frac{dz}{dx} = y+x\frac{dy}{dx} \Rightarrow x\frac{dz}{dx} = z+x^2\frac{dy}{dx}\\
\Rightarrow\ &\frac{dz}{dx}x - z+az^2=lz+b
\end{aligned}
$$

转换为 [变量可分离方程](./#变量可分离方程)。

3. 形如

$$
\frac{dy}{dx}+ay^2=bx^m
$$

当 $\displaystyle m = 0\text{ 或 } -2\text{ 或 }\frac{-4k}{2k+1}\text{ 或 }\frac{-4k}{2k-1}\quad (k\in\mathbb Z_{\geqslant 1})$ 时，有解。

当 $m = -2$ 时，使用变量替换 $z = xy$ 即可。


## 一阶隐式微分方程

上面所提及的解法都是针对显式微分方程 $y' = f(x,y)$ 的，下面考虑未能解出 $y'$ 的一阶隐式方程

$$
F(x, y, y') = 0
$$

主要思路：将隐式方程转化为一个或多个显式方程，从而将问题转化为求解显式方程上。

主要方法：**参数法**，令 $\displaystyle y' = \frac{dy}{dx} = p$ 将 $p$ 视为变量，利用两边同时求导将 $p$ 解出，从而解出 $y$。

### 可以解出x或y的方程

#### 第一种

$$
y = f(x, y')
$$

---

**解法**

令 $y' = p$，则 $y = f(x, p)$，将该式两边同时对 $x$ 求导，则 

$$
\begin{aligned}
p = y' = \frac{\partial f(x, p)}{\partial x} + \frac{\partial f(x, p)}{\partial p}\cdot\frac{dp}{dx}
\end{aligned}
$$

利用一阶显式方程解法，解出 $p = \varphi(x)$，代入 $y = f(x, p)$ 中，得

$$
y = f(x, \varphi(x))
$$

注：如果有多个解，则都要代入一遍。

#### 第二种

$$
x = f(y, y')
$$

---

**解法**

令 $y' = p$，则 $x = f(y, p),\ \displaystyle \frac{dp}{dx} = \frac{dy}{dx}\cdot\frac{dp}{dy} = p\frac{dp}{dy}$，将该式两边同时对 $x$ 求导，则

$$
\begin{aligned}
1 &= \frac{\partial f(y, p)}{\partial y}\cdot\frac{dy}{dx}+\frac{\partial f(y, p)}{\partial p}\cdot \frac{dp}{dx}\\
1 &= p\left(\frac{\partial f(y, p)}{\partial y}+\frac{\partial f(y,p)}{\partial p}\cdot\frac{dp}{dy}\right)
\end{aligned}
$$

利用一阶显式方程解法，解出 $p = \varphi(y)$，代入 $x = f(y, p)$ 中，得

$$
x = f(y, \varphi(y))
$$

同样的，如果有多个解，则都要代入一遍。

### 不显含x或y的方程

#### 第一种

$$
F(y, y') = 0
$$

---

**解法**

令 $p = y'$，则 $F(y, p) = 0$，可以视为 $yOp$ 上的曲线，设其有如下的参数表示法：

$$
\begin{cases}
y = \psi(t)\\ p = h(t)
\end{cases}
\Rightarrow
\begin{cases}
dy = \psi'(t)\,dt\\ dy = h(t)\,dx
\end{cases}
$$

则有

$$
\begin{aligned}
dx = \frac{\psi'(t)}{h(t)}\,dt
\Rightarrow
x = \int \frac{\psi'(t)}{h(t)}\,dt
\end{aligned}
$$

故有参数表示法

$$
\begin{cases}
x = \displaystyle\int \frac{\psi'(t)}{h(t)}\,dt\\ y = \psi(t)
\end{cases}
$$

#### 第二种

$$
F(x, y') = 0
$$

---

**解法**

令 $p = y'$，则 $F(x, p) = 0$，可以视为 $xOp$ 上的曲线，设其有如下的参数表示法：

$$
\begin{cases}
x = \varphi(t)\\p = h(t)
\end{cases}
\Rightarrow
\begin{cases}
dx = \varphi'(t)\,dt\\ dy = h(t)\,dx
\end{cases}
$$

则有

$$
dy = h(t)\varphi'(t)\,dt\Rightarrow y = \int h(t)\varphi'(t)\,dt
$$

故有参数表示法

$$
\begin{cases}
x = \varphi(t)\\
y = \displaystyle\int h(t)\varphi'(t)\,dt
\end{cases}
$$

## 近似解法

对于初值问题：$\begin{cases}\dfrac{dy}{dx} = f(x, y)\\y(x_0) = y_0\end{cases}$

有如下两种函数近似解法，和两种数值近似解法。

### 逐次迭代法（Picard iteration methods）

利用初值问题的积分形式 $\displaystyle y = y_0 + \int_{x_0}^xf(\psi, y(\psi))\,d\psi$ 递归生成Picard序列。

在满足Lipschitz条件的前提下，Picard序列收敛。

$$
\begin{cases}
\varphi_0(x) = y_0\\
\displaystyle \varphi_n(x) = y_0 + \int^x_{x_0}f(\xi, \varphi_{n-1}(\xi))\,d\xi
\end{cases}
$$

令真实解为 $\displaystyle \psi(x) = y_0+ \int_{x_0}^xf(\xi, \psi(\xi))\,d\xi$。

$$
\begin{aligned}
|\psi(x) - \varphi_0(x)| &= \left|\int_{x_0}^xf(\xi, \psi(\xi))\,d\xi\right|\leqslant \int_{x_0}^x\left|f(\xi, \psi(\xi))\right|\,d\xi\\
|\psi(x) - \varphi_1(x)| &= \left|\int_{x_0}^xf(\xi, \psi(\xi)) - f(\xi, \varphi_0(\xi))\right|\,d\xi\\
&\leqslant \int_{x_0}^x\left|f(\xi, \psi(\xi)) - f(\xi, \varphi_0(\xi))\right|\\
&\leqslant L\int_{x_0}^x|\psi(x) - \varphi_0(x)|\,d\xi\\
&\leqslant LM\int_{x_0}^x(\xi - x_0)\,d\xi\\
&\leqslant \frac{ML}{2!}(x - x_0)^2\\
&\leqslant \frac{ML}{2!}h^2
\end{aligned}
$$

其中 $L$ 为 Lipschitz 常数，满足 $|f(x, y_1) - f(x, y_2)\leqslant L|y_1 - y_2|$，对任意的 $(x, y_1), (x, y_2)\in R$ 都成立，$R$ 为初始值邻域。$\displaystyle M = \max\limits_{(x, y)\in R}|f(x, y)|, h = \min(a, \frac{b}{M})$。

由数学归纳法，得

$$
|\psi(x) - \varphi_n(x)| \leqslant \frac{ML^{n-1}}{n!}h^n
$$

这样证明了 Picard 序列是收敛的，而且对其进行了**误差估计**。

Picard 序列的困难就在于，它需要反复积分，迭代多次后，计算十分复杂。

### Taylor 级数法

直接尝试去计算 $y(x)$ 在 $x_0$ 处的泰勒展开式

$$
y(x) = \sum_{n=0}^{\infty}\frac{y^{(n)}(x_0)}{n!}(x-x_0)^n
$$

能这样展开求的**理论基础**，书上（没有证明），老师给了（柯西定理），应该就是 [知乎 - 常微分方程学习笔记(8)](https://zhuanlan.zhihu.com/p/104265080) 中 **7.1** 的柯西定理（我tcl）。

然后逐项求出：

$$
\begin{aligned}
y(x_0) &= y_0\\
y'(x_0) &= f(x_0, y_0)\\
y''(x_0) &= \frac{d}{dx}f(x, y)\bigg|_{x = x_0} = f(x_0,y_0)\\
y'''(x_0) &= \frac{d}{dx}f(x, y) = (f_x(x, y) + f_y(x, y)f(x, y))\bigg|_{x = x_0} = f_x(x_0, y_0) + f_y(x_0,y_0)f(x_0, y_0)\\
y''''(x_0) &= \frac{d}{dx}(f_x(x, y) + f_y(x, y)f(x, y))\\
&= f_{xx}(x, y)+2f_{xy}(x, y)f(x, y)+f_{yy}(x, y)f^2(x, y)+f_x(x, y)f_y(x, y)+f_y^2(x, y)f(x,y)\bigg|_{x = x_0}\\
&= f_{xx}(x_0, y_0)+2f_{xy}(x_0,y_0)f(x_0,y_0)+f_{yy}(x_0, y_0)f^2(x_0,y_0)+f_x(x_0, y_0)f_y(x_0, y_0)+f_y^2(x_0, y_0)f(x_0, y_0)
\end{aligned}
$$

然后再带回到 $y(x)$ 的 Taylor 展开式中即可。

该方法的缺点在于，$y$ 的高阶导数过于难求，所以有了下面的待定系数法。

#### 待定系数法（幂级数法）

由于 $y$ 的高阶导数很难求，所以考虑将其设成常数 $a_n$，令

$$
\begin{aligned}
y &= \sum_{n=0}^{\infty}\frac{y^{(n)}(x_0)}{n!}(x - x_0)^n = \sum_{n=0}^{\infty}a_n(x-x_0)^n\\
\text{则 } y' &= \sum_{n=0}^{\infty}na_n(x-x_0)^{n-1}
\end{aligned}
$$

代入到 $y' = f(x, y)$ 中，得

$$
\sum_{n=0}^{\infty}na_n(x-x_0)^{n-1} = f\left(x, \sum_{n=0}^{\infty}a_n(x-x_0)^n\right)
$$

通过对比通次幂系数得出 $a_n$。这样就避免了直接求解 $y$ 的导数。

如果要求解多项式展开中某一项的系数，可以使用 [多项式定理](/posts/36121/)。
