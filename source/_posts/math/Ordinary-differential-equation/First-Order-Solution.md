---
title: 一阶微分方程解法总结
hide: false
math: true
abbrlink: 3855
date: 2021-10-05 11:05:02
index_img:
banner_img:
category:
tags:
---

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

当 $\displaystyle m = 0\text{ 或 } 2\text{ 或 }\frac{-4k}{2k+1}\text{ 或 }\frac{-4k}{2k-1}\quad (k\in\mathbb Z_{\geqslant 1})$ 时，有解。

