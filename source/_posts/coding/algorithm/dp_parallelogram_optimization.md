---
title: 平行四边形DP优化
hide: false
math: true
category:
  - coding
  - algorithm
tags:
  - 动态规划
abbrlink: 63500
date: 2023-05-30 11:09:31
index\_img:
banner\_img:
---

## 平行四边形不等式

### 2D1D

#### 定义1（平行四边形不等式）

若二元实函数 $f(x, y)$ 满足 $\forall l_1\leqslant l_2\leqslant r_1\leqslant r_2$，有 $f(l_1,r_1) + f(l_2,r_2)\leqslant f(l_1,r_2)+f(l_2,r_1)$，则称 $f(x,y)$ 满足 $\min$ 形式的平行四边形不等式。（交叉小于包含）

相应地，如果 $f(x,y)$ 满足 $f(l_1,r_1) + f(l_2,r_2)\geqslant f(l_1,r_2)+f(l_2,r_1)$ ，则称 其满足 $\max$ 形式的平行四边形不等式。（交叉大于包含）

> $f(x,y)$ 表示的就是DP中的状态函数，这里的 $\min$ 和 $\max$ 分别为状态转移时的算子。
>
> 平行四边形公式的理解可以从区间和二位两个方向上看，在区间上看就是交叉与包含之间的关系，二位图像上看则正好形成了平行四边形的两个对角分别求和的大小关系。

在下述推导中，我们都假设有 $f(x,y) = 0,\ (x\geqslant y)$，也就是指 $x,y$ 必须满足严格增的序关系，于是取 $l_2=r_1$ 可得包含不等式：$f(l_1,r_1)+f(r_1,r_2)\leqslant f(l_1,r_2)$，如果 $f(x,y)$ 非负可导出包含单调性： $f(l_2,r_1)\leqslant f(l_1,r_2)$

#### 定理2（平行四边形不等式传递性）

若二元实函数 $f(x,y)$ 满足以下递推式（区间DP常有的式子，石子合并，最优排序二叉树问题，这样的DP问题简称为：2D1D，状态空间2维，决策空间1维）：
$$
f(l,r) = \min_{l\leqslant k < r}\{f(l,k)+f(k+1,r)\} + w(l,r)
$$
且 $w(x,y)$ 满足 $\min$ 形式的平行四边形不等式，则 $f(x,y)$ 也满足 $\min$ 形式的平行四边形不等式。

**注**：将定理2中的所有 $\min$ 改为 $\max$ 定理同样成立。

**证明**：这里我们不妨假设 $l_1\leqslant l_2 < r_1\leqslant r_2$，设 
$$
\begin{aligned}
u  = \arg\max\limits_{l_1\leqslant k < r_2} \{f(l_1,k) + f(k+1,r_2)\},\quad f(l_1,r_2)\text{取极值时对应的}k\text{值}\\
v = \arg\max\limits_{l_2\leqslant k < r_1} \{f(l_2,k) + f(k+1,r_1)\},\quad f(l_2,r_1)\text{取极值时对应的}k\text{值}
\end{aligned}
$$

- 假设 $u < v$，首先利用 $f(l_1,r_1),f(l_2,r_2)$ 的定义可得

$$
\tag{1}
\begin{aligned}
f(l_1,r_1)\leqslant&\ f(l_1,u)+f(u+1,r_1)+w(l_1,r_1),\\
f(l_2,r_2)\leqslant&\ f(l_2,v)+f(v+1,r_2)+w(l_2,r_2).
\end{aligned}
$$

再对 $r_2-l_1 +1$ （区间的长度）使用数学归纳法，可得
$$
\tag{2}f(u+1,r_1)+f(v+1,r_2)\leqslant f(u+1,r_2) + f(v+1,r_1)
$$
将 $(1)$ 与 $(2)$ 式全部求和相消，可得
$$
\begin{aligned}
f(l_1,r_1)+f(l_2,r_2)\leqslant&\ f(l_1,u)+f(u+1,r_2)+f(l_2,v)+f(v+1,r_1)+w(l_1,r_1)+w(l_2,r_2)\\
\leqslant&\ f(l_1,u)+f(u+1,r_2)+w(l_1,r_r)+f(l_2,v)+f(v+1,r_1)+w(l_2,r_1)\\
\leqslant&\ f(l_1,r_2)+f(l_2,r_1)
\end{aligned}
$$
上式第二个不等号用到了 $w(x,y)$ 的平行四边形不等式。

- $u > v$ 时，只需在 $(l_2,r_2)$ 上讨论 $u$，在$(l_1,r_1)$ 上讨论 $v$ 即可，证明方法同上。**QED**

#### 定理3（决策 $k$ 关于单变量的严格递增性）

若 $f(x,y)$ 满足平行四边形不等式，设
$$
K(l,r) = \min\bigg\{\arg\max\limits_{l\leqslant k < r} \{f(l,k) + f(k+1,r)\}\bigg\},\quad\text{下标最小的决策（具有唯一性）}
$$
于是
$$
K(l,r-1)\leqslant K(l,r)\leqslant K(l+1,r)
$$
**注**：上述定理无论状态转移中算子为 $\min$ 还是 $\max$ 都成立，只需将下面证明中的 $\leqslant$ 全部改为 $\geqslant$ 即可。

**证明**：令 $k_1 = K(l,r-1),u = K(l,r),k_2 = K(l+1,r)$，使用反证法：

- 反设 $u < k_1$，由平行四边形不等式可知

$$
\tag{3}f(u+1,r-1) + f(k_1+1,r)\leqslant f(u+1,r) + f(k_1+1,r-1)
$$

又由于 $k_1$ 是 $f(l,r-1)$ 的决策点可知
$$
\tag{4}f(l,k_1)+f(k_1+1,r-1)\leqslant f(l,u) + f(u+1,r-1)
$$
将 $(3)$ 与 $(4)$ 式求和可得
$$
f(l,k_1) + f(k_1+1,r)\leqslant f(l,u)+f(u+1,r)
$$
我们发现左右两式正好就是 $f(l,r)$ 的决策式，而 $u < k_1$ 与 $u$ 是该决策式的唯一最小决策矛盾，故原命题成立。

- 反设 $k_2 < u$，同理可得矛盾。**QED**

---

#### 区间划分实现

**定理3**的实现：通过该定理我们知道 $f(l,r)$ 的决策是关于行与列严格单调递增的，在区间DP中，我们常常将区间范围从小到大进行枚举，所以求 $f(l,r)$ 的最优决策 $k$ 只需在 $[K(l,r-1),K(l+1,r)]$ 中进行枚举，而 $K(l,r-1),K(l+1,r)$ 我们已经得到了，只需记录下即可，总时间复杂度就是 $\mathcal{O}(n^2)$，即 $k$ 的枚举总次数：
$$
\sum_{1\leqslant l < r\leqslant n}K(l+1,r) - K(l,r-1) = \sum_{L=1}^nK(n-L+1,n)-K(1,L) = \sum_{i=1}^nK(i,n)-K(1,i)\leqslant n^2
$$

#### 推论4（定理3推论）

若二元实函数 $f(x,y)$ 满足以下递推式：
$$
f(l,r) = \min_{l\leqslant k < r} \{f(l,k)+w(k+1,r)\}
$$
且 $w(x,y)$ 满足平行四边形不等式，则 $f(x,y)$ 的最优决策也满足**定理3**（关于单变量的严格递增）。

**证明**：与**定理3**证明思路完全一致，先证明 $f(l,r)$ 满足平行四边形不等式，再反证 $w(x,y)$ 关于单变量的严格递增性。**QED**

### 1D1D

#### 定理5（推论4特殊形式）

设1D1D状态转移方程为（状态空间1维，决策空间1维）
$$
f(r) = \min_{1\leqslant l < r}\{f(l)+w(l,r)\}
$$
记 $K(r) = \min\bigg\{\arg\min\limits_{1\leqslant l < r}\{f(l)+w(l,r\}\bigg\}$，如果 $w(l,r)$ 满足平行四边形不等式，则 $K$ 严格单增：
$$
K(r-1) \leqslant K(r),\quad(1 < r \leqslant n)
$$
**观察**：该推论可以视为**推论4**的特殊形式，只是将状态空间减少了一个维度，可以直接用反证法证明。

**证明**：设 $l_1 = K(r-1),l_2 = K(r)$，反设 $l_1 > l_2$，由于 $w(x,y)$ 满足平行四边形不等式，于是
$$
\tag{5}w(l_2,r-1)+w(l_1,r)\leqslant w(l_2,r)+w(l_1,r-1)
$$
由 $l_1$ 的定义可知
$$
\tag{6}f(l_1) +w(l_1,r-1)\leqslant f(l_2)+w(l_2,r-2)
$$
将 $(5)$ 与 $(6)$ 式求和可得
$$
f(l_1)+w(l_1,r)\leqslant f(l_2)+w(l_2,r)
$$
与 $l_2$ 为 $f(l)+w(l,r),\ (1\leqslant l < r)$ 的唯一最小决策值矛盾，故原命题成立。**QED**

---

#### 单调栈+二分实现定理5

要发现一个更一般的结论：在 $r$ 之前的任意一个前缀区间上的决策，都有单增性质，取 $r'\in[1,n],\ r \geqslant r'$，定义
$$
K'(r) = \min\bigg\{\arg\min_{1\leqslant l < r'}\{f(l) + w(l,r)\}\bigg\},\quad (r'\leqslant r)
$$
则也有**定理5**成立，即 $K'(r+1) > K'(r)$，证明方法与**定理5**完全一致。

首先进行如下声明：**决策区间**指状态的决策值枚举的区间，对于每个决策值 $k$ 将其决定的状态对应的位置称为**决定区间**。

例如：$f(r) = \min\limits_{1\leqslant k < r'}f(k) + w(k,r)$ 的决策区间就是 $[1,r')$，若 $k_0$ 使得 $f(k_0) + w(k_0,r) = f(r), \ r\in[r_1,r_2]$，则称 $k_0$ 的决定区间为 $[r_1,r_2]$。注意到一点决定区间会随着决策区间的变换而变换，当决策区间增大时，由于进入了更多的决策，旧决策的决定区间可能就被新决策替代了，导致旧决策的决定区间变小（下面通过决策单调性，更加详细地说明了新决策对旧决策决定区间的影响）

在上述1D1D的DP问题中，$f(r)$ 的决策区间就是 $[1,r)$，但是我们无法直接得到这么多前缀的DP值，先考虑一部分前缀，将决策区间缩小到 $[1,r')$，然后将 $r'$ 逐渐增大到 $r$，最终和真实决策区间 $[1,r)$ 相同；在增大的过程中一直**维护决策区间 $[1,r')$ 中每个决策点对应的决定区间**，这样当增大到和 $[1,r)$ 相同时，我们可以直接给出 $f(r)$ 对应的决策值，从而 $O(1)$ 得到状态值。

问题在于如何维护 $[1,r')$ 中每个决策值对应的决策区间，首先注意到我们已经发现了在任意一个前缀区间 $[1,r')$ 上都有决策单调性，我们发现**决策单调性对决定区间的性质**：

- 无交性：固定决策点 $x_i$，我们可以发现每个决策点对应的决定区间要么是连续的一段 $[l_i,r_i]$，要么是空集，并且两个决策区间之间**没有交集**。
- 决定区间单调性：又由于决策单调性，若决策点 $x_1 < x_2$ 的决定区间分别为 $[l_i,r_i], (i=1,2)$ 且均非空，则**决定区间单调**，即 $r_1 < l_2$。

利用上面两个性质我们可以用单调栈进行实现，具体方法如下：

假设当前决策区间为 $[1,r')$，使用一个单调栈维护三元组 $(x,l,r)$，表示决策点为 $x$，并且决定区间为 $[l,r]$，单调性体现在 $x$ 是单增的，并且区间 $(l,r)$ 也是单增的。下面考虑如何处理新的决策点 $r'$：

- 首先我们可以直接获得 $f(r')$，只需要找到 $(x_0,l_0,r_0)$ 使得 $r'\in[l_0,r_0]$，则 $x_0$ 就是 $r'$ 的最优决策点，并且无交性保证了 $[l_0,r_0]$ 的存在唯一。
- 当我们获得了 $f(r')$，我们相当于获得了新的决策点 $r'$，我们考虑该决策点栈顶处旧决策点 $(x_i,l_i,r_i)$ 的影响：
  - 如果 $r' < l_i$ 且 $f(r') + w(r',l_i) \leqslant f(x_i) + w(x_i,l_i)$，则说明新决策比 $l_i$ 处旧的最优决策更优，由决策单调性，$x_i$ 一定不再会是 $l_i,...$ 处的决策值，所以留着也没用，直接扔掉（弹栈）。
  - 如果 $r' > l_i$ 或者  $f(r') + w(r',l_i) > f(x_i) + w(x_i,l_i)$，则说明**新决策的决定区间左端点**落在了 $[l_i,r_i]$ 中间，由于决策单调性，一定存在一个中间点 $mid$，使得左侧都是 $x_i$ 最优，右侧都是 $r'$ 最优，所以可以通过二分找到中间点，而这个中间点就是新决策的决定区间左端点，所以新决策的决定区间就是 $[mid,n]$，而在栈顶的旧决策的决定区间变为 $[l_i,mid-1]$。
  - 当然还有一种可能就是新决策比旧决策差，那么就没有必要加入新决策点了。

这是一个非常一般化的方法同样可以解决**推论6**的问题。

```cpp
int n, top, now, f[maxn];
struct Node { int x, l, r; } stk[maxn];
int calc(l, r) {...}  // 计算在r处决策为l的状态值

top = now = 1;
stk[1] = (Node){0, 1, n};  // 决策边界
for (int r = 1; r <= n; r++) {
    if (r > stk[now].r) ++now;  // 由于决定区间一定是连续的，所以只需移动到下一个决定区域上就能找到r
    f[r] = calc(stk[now].x, r);
    while (r < stk[top].l && calc(r, stk[top].l) <= calc(stk[top].x, stk[top].l)) --top;
    int L = stk[top].l, R = stk[top].r + 1;  // 这里将R扩大一点，如果二分到边界外，则说明新决策比旧决策都差
    while (L < R) {
        int mid = (L+R) / 2;
        if (calc(r, mid) < calc(stk[top].x, mid)) R = mid;
        else L = mid + 1;
    }
    stk[top].r = L - 1;
    if (L <= n) stk[++top] = (Node){r, L, n};
}
```

练习：[洛谷 - P3195 玩具装箱](https://vjudge.net/problem/洛谷-P3195/origin)

#### 推论6（定理5推论）

设 $f(r)$ 状态转移方程为 $f(r) = \min\limits_{1\leqslant l < r} w(l,r)$，则 $K(r-1)\leqslant K(r)$。（$K$ 的定义与**定理5**一致）

**证明**：与**定理5**方法完全一致。**QED**

---

#### 分治法实现推论6（也可以用单调栈实现）

在具体实现上与**定理3**不同，直接枚举仍然无法确定状态的上下界，所以无法进行有效优化，由于一维问题可以通过分治方法划分区间，从而确定上下界。

```cpp
void dp(int l, int r, int kl, int kr) {
    if (l > r) return;
    int mid = (l + r) / 2, k = 0;
    for (int i = kl; i <= min(mid, kr); i++)
        if (w(i, mid) < f[mid]) {  // w(i,mid) 为 [i, mid] 下的状态值
            f[mid] = w[i, mid]
            k = i;
        }
    dp(l, mid-1, kl, k);
    dp(mid+1, r, k, kr);
}
```

练习：[洛谷 - P3515 - Lightning Conductor](https://www.luogu.com.cn/problem/P3515)，[洛谷 - P6932 - WF2017D Money for Nothing](https://www.luogu.com.cn/problem/P6932)

#### 命题6（满足平行四边形不等式的函数类）

记符合平行四边形不等式的函数类为 $\mathcal{F}$，符合平行四边形恒等式的函数类为 $\mathcal{F}^+\subset \mathcal{F}$，符合区间包含单增性的函数类为 $\mathcal{G}$，则 $\mathcal{F},\mathcal{G}$ 中函数满足一下性质：

1. 线性性：若 $w_1(l,r),w_2(l,r)\in\mathcal{F}$ ，则 $\forall a, b\geqslant 0$，$aw_1+bw_2\in\mathcal{F}$ 。（将 $\mathcal{F}$ 改为 $\mathcal{F}^+$ 和 $\mathcal{G}$ 同样成立）

2. 无交叉项的二元函数类：设 $w(l,r) = g(r) - f(l)$，则 $w(l,r)\in\mathcal{F}^+$ ，若 $f,g$ 单调递增，则 $w(l,r)\in\mathcal{G}$ 。

3.  $\mathcal{F}\cap\mathcal{G}$ 对单增凸函数的封闭性：设 $h(t)$ 为单增凸函数，$w\in \mathcal{F}\cap\mathcal{G}$，则 $h\circ w\in\mathcal{F}\cap\mathcal{G}$。

4. 凸函数对 $\mathcal{F}^+\cap\mathcal{G}$ 的符合：设 $h(t)$ 的为凸函数，$w\in\mathcal{F}^+\cap\mathcal{G}$，则 $h\circ w\in \mathcal{F}$。

**证明**：1. 线性性：利用不等式的线性可加性易证。

2. 无交叉项指的是没有类似 $lr,l^2 r,...$ 的项，只有 $l,l^2,e^l,r,...$ 项的线性组合，根据平行四边形恒等式和区间包含单增性容易验证。

3. 设 $l_1\leqslant l_2\leqslant r_1\leqslant r_2$，由于 $w\in \mathcal{G}$ 则 $w(l_2,r_1)\leqslant w(l_1,r_2)$，又由 $h$ 单增可知 $h(w(l_2,r_1))\leqslant h(w(l_1,r_2))$；

   由于 $w\in \mathcal{F}$，则 $w(l_1,r_1)+w(l_2,r_2)\leqslant w(l_1,r_2)+w(l_2,r_1)$，于是
   $$
   \tag{7}w(l_1,r_1)\leqslant w(l_1,r_2)-w(l_2,r_2)+w(l_2,r_1) =: w(l_2,r_1)+t
   $$
   其中 $t = w(l_1,r_2)-w(l_2,r_2)$，由 $h(x)$ 的单增性可得：
   $$
   \begin{aligned}
   h(w(l_1,r_1))\leqslant&\ h(w(l_2,r_1)+t)\\
   \Rightarrow h(w(l_1,r_1))-h(w(l_2,r_1))\leqslant&\ h(w(l_2,r_1)+t)-h(w(l_2,r_1))\\
   =&\ \Delta h(w(l_2,r_1))\\
   \text{（利用$h$的凸性和$w$的区间包含单增性）}\leqslant&\ \Delta h(w(l_2,r_2))\\
   =&\ h(w(l_2,r_2)+t) - h(w(l_2,r_2))\\
   =&\ h(w(l_1,r_2))-h(w(l_2,r_2))
   \end{aligned}
   $$
   所以 $h(w(l_1,r_1))+h(w(l_2,r_2)) \leqslant h(w(l_1,r_2))h(w(l_2,r_1))$。

4. 只需将3.证明中的 $(7)$ 处 $\leqslant$ 符号改为 $=$ 符号即可，下面证明中就无需使用 $h$ 的单调性。**QED**

