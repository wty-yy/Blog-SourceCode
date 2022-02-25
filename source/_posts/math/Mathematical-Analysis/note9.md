---
title: Gauss定理 Stokes公式
hide: false
math: true
category:
  - Math
  - 数学分析
tags:
  - 积分
abbrlink: 34494
date: 2021-11-19 19:01:05
index_img:
banner_img:
---

上星期讲完了第一型和第二型曲面积分的定义及计算方法，这讲了两个（ $Newton-Leibniz$ 公式的推广）定理，在适当的条件下运用可以大大降低计算复杂度，通过 $Gauss$ 定理可以将**第二型曲面积分**转换为**体积积分**，$Stokes$ 定理可以将**第二型曲线积分**转换为**第二型曲面积分**，它们的证明方法直接或类似于之前[ $Green$ 公式的证明](/posts/64854/)。

## Gauss 定理（散度定理）

### 定义1（分片光滑）

设 $\Omega\subset \mathbb R^3$ 为开集，$\partial\Omega = \bigcup_{i=1}^NS_i$，其中：

1. $S_i,\quad i=1\sim N$ 为内部互不相交的光滑曲面。

2. $\forall P\subset S_i^\circ$，$\partial \Omega$ **在 $P$ 点光滑**。

则称 $\partial \Omega$ **分片光滑**。

---

其中，开集在某点处光滑的定义见： [Green公式 - 定义1（某点处光滑）](/posts/51465/#定义1某点处光滑单位外法向量)，$S_i^\circ$ 表示 $S_i$ 的内部。

### 定义2（单位外法向）

设 $\Omega\subset \mathbb R^3$ 为开集，$\partial \Omega$ 分片光滑，如果 $\forall p\in \partial \Omega$，$\partial \Omega$ 在 $P$ 点光滑，称 $\partial \Omega$ 光滑，$\vec{n}:\partial \Omega\rightarrow \mathbb R^3$，$\vec{n}(P)$ 为 $\partial \Omega$ 在 $P$ 点的单位外法向，$\vec{n}$ 连续，称 $\vec{n}$ 为 $\partial \Omega$ 的单位外法向（量场）。

---

其中，开集在某点处的单位外法向的定义见：[Green公式 - 定义1（单位外法向量）](/posts/51465/#定义1某点处光滑单位外法向量)。

### 命题3（单位外法向的唯一性）

$\exists !\ S_i$ 的一个定向 $\vec{n}$，使得 $\forall p\in S_i^\circ$，$\vec{n}(P)$ 为 $\partial \Omega$ 在 $P$ 点的单位外法向，称 $\vec{n}$ 为 $S_i$ 的正向。

---

每个点处的单位外法向是唯一的，所以 $\vec{n}$ 也是唯一的。

### 定理4（Gauss 定理）

设 $\Omega\subset \mathbb R^3$ 为有界区域，$\partial \Omega$ 分片光滑，设 $P,Q,R:\overline{\Omega}\rightarrow \mathbb R$ 连续可微，则

$$
\int_{\Omega}\left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)\,dx\,dy\,dz=\int_{\partial \Omega}P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy
$$

$\partial \Omega$ 光滑，$\vec{n}:\partial \Omega\rightarrow\mathbb R^3$ 为 $\partial \Omega$ 上的**单位外法向**，$\vec{F} = (P,Q,R),\ \text{div }\vec{F}=\dfrac{\partial P}{\partial x}+\dfrac{\partial Q}{\partial y}+\dfrac{\partial R}{\partial z}$，其中 $\text{div }\vec{F}$ 称为 $\vec{F}$ 的散度（所以也称为**散度定理**），则上式等价于

$$
\int_{\Omega}\text{div }\vec{F}\,dx\,dy\,dz=\int_{\partial\Omega}\vec{F}\cdot\vec{n}\,d\sigma
$$

---

注：$Gauss$ 定理中第二型曲面积分的方向为 $\partial \Omega$ 的单位外法向，也就是与 $\Omega$ 的选取有关。

类似于 [Green公式在特殊条件下的证明](/posts/64854/#green公式newton-leibniz-公式推广)，$Gauss$ 定理也给出其在特殊限制下的证明，做出如下假设：

**AS1**： $\exists\varphi_1,\varphi_2:\overline{D}\rightarrow \mathbb R$，$D\subset\mathbb R^2$ 为有界域，$\partial D$ 分段光滑，$\varphi_1,\varphi_2\in C^1$，且对 $\forall (x, y)\in D$，有$\varphi_1(x,y)<\varphi_2(x,y)$，设
$$
\Omega=\{(x, y, z):(x, y)\in D,\varphi_1(x,y)< z< \varphi_2(x, y)\}
$$
如果 $\exists (x, y)\in \partial D$，使 $\varphi_1(x, y) < \varphi_2(x, y)$，记

$$
\sum=\{(x, y, z):(x, y)\in \partial D,\ \varphi_1(x, y)\leqslant z\leqslant \varphi_2(x, y)\}
$$

则 $\sum=\bigcup_{i=1}^NS_i$，其中 $S_i,\ i=1\sim N$ 为内部互不相交的光滑曲面。

**理解**：可以参考下面这个图像：

![Gauss定理 限制条件](https://s4.ax1x.com/2022/02/25/bALqjP.png)

上图中，$\sum$（侧面）可以分为 $4$ 个内部互不相交的光滑曲面的并 $S_i,\ i=1\sim 4$，不难看出，这是对 $\Omega$ 以 $Oxy$ 为平面的分法，$\sum$ 平行于 $z$ 轴（也可以看作是“上下”分），同理还有**AS2**：平行 $y$ 轴（左右分），**AS3**：平行 $x$ 轴（前后分），这里就不一一举出了。

**证明：** 将 $Gauss$ 定理分为三部分：
$$
\begin{aligned}
\text{①}\int_{\Omega}\frac{\partial P}{\partial x} = \int_{\partial\Omega}P\,dy\,dz\quad
\text{②}\int_{\Omega}\frac{\partial Q}{\partial y} = \int_{\partial\Omega}Q\,dz\,dx\quad
\text{③}\int_{\Omega}\frac{\partial R}{\partial z} = \int_{\partial\Omega}R\,dx\,dy
\end{aligned}
$$
通过假设 **AS3,AS2,AS1** 可以分别证明 $\text{①，②，③}$，下面利用 **AS1** 证明 $\text{③}$。

设底面为 $\Omega_1$，则 $\vec{r}(x,y)=(x,y,\varphi_2(x,y))$ 为 $\Omega_1$ 的参数方程，则由 $\vec{r}$ 所确定的 $\Omega_1$ 的正向为：

$$
\begin{aligned}
\vec{n}=&\frac{\vec{r}_x\times\vec{r}_y}{|\vec{r}_x\times\vec{r}_y|}\\
=&\frac{1}{|\vec{r}_x\times\vec{r}_y|}(-\frac{\partial\varphi_2}{\partial x},-\frac{\partial\varphi_2}{\partial y}, 1)
\end{aligned}
$$

所以不难发现，$\vec{n}$ 和 $z$ 轴正方向的夹角一定是锐角，所以 $\vec{n}$ 都是斜向上的，但这是和图中 $\varphi_1$ 的外法向 $\vec{n}$ 向下相反，在运算时注意加上负号。

$$
\begin{aligned}
\text{右式}=&\int_{\partial \Omega}R(x,y,z)\,dx\,dy\\
=&\int_{\text{graph }\varphi_2}R(x,y,z)\,dx\,dy+\int_{\text{graph }\varphi_1}R(x,y,z)\,dx\,dy+\int_{\sum}R(x,y,z)\,dx\,dy\\
\xlongequal{\text{注意方向}\varphi_2\text{变为负号}}&\int_DR(x,y,\varphi_2(x,y))\,dx\,dy-\int_DR(x,y,\varphi_1(x,y))\,dx\,dy+\int_{\sum}(0,0,R)\cdot\vec{n}\,d\sigma\\
\xlongequal{\text{由图可以看出}\vec{n}\text{与}(0,0,R)垂直}&\int_DR(x,y,\varphi_2(x,y))\,dx\,dy-\int_DR(x,y,\varphi_1(x,y))\,dx\,dy\\
\text{左式}=&\int_{\Omega}\frac{\partial R}{\partial z}\,dx\,dy\,dz\\
=&\int_D\left\{\int_{\varphi_1(x,y)}^{\varphi_2(x,y)}\frac{\partial R}{\partial z}\,dz\right\}\,dx\,dy\\
=&\int_D R(x,y,\varphi_2(x,y))\,dx\,dy-\int_DR(x,y,\varphi_1(x,y))\,dx\,dy\\
\text{故，}\text{左式}=\ &\text{右式}
\end{aligned}
$$

### 例一

$S=\{(x,y,z)\in\mathbb R^3:(x-a)^2+(y-b)^2+(z-c)^2= R^2\}$，$S$ 的正向为单位外法向量，求

$$
I=\int_Sx^2\,dy\,dz+y^2\,dz\,dx+z^2\,dx\,dy
$$

**解：** 令 $A=(a,b,c)$，则

$$
\begin{aligned}
I =& \int_{\partial B_R(A)}(x^2,y^2,z^2)\cdot\vec{n}\,d\sigma\\
\xlongequal{\text{Gauss}}& \int_{B_R(A)}(2x+2y+2z)\,dx\,dy\,dz\\
=& 2\int_{B_R}(x+y+z+a+b+c)\,dx\,dy\,dz\\
=&\frac{8}{3}\pi R^3(a+b+c)
\end{aligned}
$$

## Stokes 公式（旋度定理）

$Stokes$ 公式，建立了**曲面第二型积分**到**曲线第二型积分**的关系，所以先要建立**曲面的正向**和**曲面边界（曲线）的正向**之间的关系，下面会分别定义两者的关系，并且给出几何判断方法。

下文中，设 $S\subset \mathbb R^3$ 为定向曲面，$\vec{n}$ 为 $S$ 的正向，设 $\vec{r}:\overline{D}\rightarrow S$ 为 $S$ 的参数方程， $D\subset \mathbb R^2$，$\partial D$ 分段光滑，则 $\partial D=\bigcup_{i=1}^NC_i$，其中 $C_i$ 为互不相交的光滑曲线，$\partial D$ 的定向，按照 [$Green$ 公式](/posts/64854/#green公式newton-leibniz-公式推广) 中的定向确定
$$
\partial S=\bigcup_{i=1}^N\vec{r}(C_i)=:\bigcup_{i=1}^N\widetilde{C_i}
$$
其中 $\widetilde{C_i}:= \vec{r}(C_i)$， 也就是由 $C_i$ 这段二维曲线所确定的三维图像 $\Omega$ 的边界。

记 $\vec{r}_s = D_1\vec{r}$，所以曲面 $S$ 的正向，记为：

$$
\vec{n}=\frac{\vec{r}_s\times\vec{r}_t}{|\vec{r}_s\times\vec{r}_t|}=\frac{D_1\vec{r}\times D_2\vec{r}}{|D_1\vec{r}\times D_2\vec{r}|}
$$

### 定义1（曲面边界的定向）

设 $\alpha:[a,b]\rightarrow C_i$ 为 $C_i$ 的参数方程，并且 $C_i$ 的正向为 $\widehat{\alpha'}\circ\alpha^{-1}$，则 $\beta=\vec{r}\circ\alpha$ 为 $\widetilde{C_i}$ 的参数方程，如果

$$
\vec{n}=\frac{D_1\vec{r}\times D_2\vec{r}}{|D_1\vec{r}\times D_2\vec{r}|}
$$

规定 $\widetilde{C_i}$ 的正向为 $\widehat{\beta'}\circ\beta^{-1}$，如果

$$
\vec{n}=-\frac{D_1\vec{r}\times D_2\vec{r}}{|D_1\vec{r}\times D_2\vec{r}|}
$$

规定 $\widetilde{C_i}$ 的正向为 $-\widehat{\beta'}\circ\beta^{-1}$。

#### 几何判断方法

设 $P$ 为曲面边界上一点，则下面三者满足**右手定则**：曲线的正向 $\vec{\tau}_P$，曲面在 $P$ 处的内法向 $\vec{m}_P$，曲面在 $P$ 处的正向 $\vec{n}$，可以参考下图：

![曲面的正向确定曲面边界的正向](https://s4.ax1x.com/2022/02/25/bAqeqU.png)

### 定理2（Stokes 公式）

设 $S\subset \mathbb R^3$ 为定向曲面，$P,Q,R:S\rightarrow \mathbb R$，$P,Q,R\in C^1(S)$，则
$$
\begin{aligned}
\int_{\partial S}P\,dx\ +\ &Q\,dy+R\,dz\\
=&\int_S\left(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z}\right)\,dy\,dz+\left(\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x}\right)\,dz\,dx+\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)\,dx\,dy
\end{aligned}
$$

令 $\vec{F}=(P,Q,R)$，定义**旋度**为：
$$
\begin{aligned}
\text{rot }\vec{F}=\ &\nabla\times\vec{F}\\
=&\left|\begin{matrix}
i&j&k\\
\frac{\partial}{\partial x}&\frac{\partial}{\partial y}&\frac{\partial}{\partial z}\\
P&Q&R
\end{matrix}\right|\\
=&\left(\frac{\partial R}{\partial y}-\frac{\partial Q}{\partial z},\frac{\partial P}{\partial z}-\frac{\partial R}{\partial x},\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)
\end{aligned}
$$

其中，$\nabla = (\dfrac{\partial}{\partial x},\dfrac{\partial}{\partial y},\dfrac{\partial}{\partial z})$，则 $Stokes$ 公式有以下简化版：

$$
\int_{\partial S}\vec{F}\cdot d\vec{s}=\int_S\text{rot}\vec{F}\cdot d\vec{\sigma}
$$

计算时为避免错误，可以使用简化版公式计算。

---

证明留到下一个note了（然而老师直接到Fourier级数了，这个证明就咕掉了😢），这里举一个计算的例子，题目和 [第二型曲线积分 - 例一](/posts/51465/#例一) 相同，图形可以参考 [第二型曲线积分 - 例一](/posts/51465/#例一) 中所作的图。

### 例一

设 $C=\{(x,y,z)\in \mathbb R^3:x^2+y^2+z^2=R^2,x+y+z=0\}$，$C$ 的正向为逆时针方向，计算：
$$
I=\int_Cz\,dx+x\,dy+y\,dz
$$

**解：** 设 $S=\{(x,y,z)\in\mathbb R^3:x^2+y^2+z^2\leqslant R^2,x+y+z=0\}$，$S$ 的正向为 $\vec{n}=(1,1,1)/\sqrt{3}$（正向的确定方法可以参考 [几何判断方法](./#几何判断方法) ），则

$$
\begin{aligned}
I=\int_{\partial S}z\,dx+x\,dy+y\,dz =& \int_{\partial S}(z,x,y)\cdot d\vec{s}\\
=&\int_S\text{rot}(z,x,y)\cdot d\vec{\sigma}\\
=&\int_S\text{rot}(z,x,y)\cdot(1,1,1)/\sqrt{3}\,d\sigma\\
=&\ \frac{1}{\sqrt{3}}\int_S\left|\begin{matrix}
1&1&1\\\frac{\partial}{\partial x}&\frac{\partial}{\partial y}&\frac{\partial}{\partial z}\\z&x&y
\end{matrix}\right|\,d\sigma\\
=&\frac{1}{\sqrt{3}}\int_S3\,d\sigma\\
=&\sqrt{3}\,\sigma(S)\\
=&\sqrt{3}\,\pi R^2
\end{aligned}
$$
