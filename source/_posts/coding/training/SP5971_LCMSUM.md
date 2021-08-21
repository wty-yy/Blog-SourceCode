---
title: SP5971 LCMSUM
hide: false
math: true
abbrlink: 49145
date: 2021-08-17 11:59:01
index_img:
banner_img:
category:
 - coding
 - training
tags: [数论, Dirichlet卷积]
---

官方链接：[LCMSUM - LCM Sum](https://www.spoj.com/problems/LCMSUM/)

洛谷搬运链接：[SP5971 LCMSUM - LCM Sum](https://www.luogu.com.cn/problem/SP5971)

# 题意

有 $T$ 次询问，每次询问给定 $n$，求

$$
\sum_{i=1}^n\text{lcm}(i, n)
$$

$1\leqslant T\leqslant 3\times10^5$
$1\leqslant n\leqslant 10^6$

# 思路

推式子：
$$
\begin{aligned}
\sum_{i=1}^n\text{lcm}(i,m)&=\sum_{i=1}^n\frac{i\cdot n}{\text{gcd}(i,n)}\\
&=\sum_{d|n}\sum_{i=1}^n\frac{i\cdot n}{d}[\text{gcd}(i,n)=d]\\
&=\sum_{d|n}\sum_{i=1}^n\frac{i\cdot n}{d}[\text{gcd}(\frac{i}{d}, \frac{n}{d})=1]\\
&\xlongequal{i=\frac{i}{d}}\sum_{d|n}\sum_{i=1}^{\frac{n}{d}}i\cdot n[\text{gcd}(i, \frac{n}{d})=1]\\
&=n\sum_{d|n}\sum_{i=1}^di\cdot[\text{gcd}(i, d)=1]
\end{aligned}
$$

令 $f(d)=\sum_{i=1}^di\cdot[\text{gcd}(i, d)=1]$，下面有两种方法对 $f(d)$ 进行化简：

**法1：** 由简化剩余系的性质：

当 $d=1$ 时：$f(1)=1$

当 $d\neq 1$ 时：

若 $\text{gcd}(i, d) = 1$，则 $\text{gcd}(d-i,d)=1$，这说明简化剩余系中的元素一定是成对存在的，而且它们和正好是 $d$，简化剩余系大小为 $\varphi(d)$（也说明了为什么 $\varphi(d)$ 一定是偶数）。

于是 $\displaystyle f(d)=\frac{\varphi(d)\cdot d}{2}$

**法2：** 用Dirichlet卷积变化：
$$
\begin{aligned}
f(n)&=\sum_{i=1}^di\cdot[\text{gcd}(i, d)=1]\\
&=\sum_{i=1}^di\cdot\sum_{t|\text{gcd}(i,d)}\mu(t)\\
&=\sum_{t|d}\sum_{i=1}^d[t|i]\cdot i\cdot \mu(t)\\
&=\sum_{t|d}\sum_{i=1}^{\frac{d}{t}}it\cdot \mu(t)\\
&=\sum_{t|d}t\cdot\mu(t)\sum_{i=1}^{\frac{d}{t}}i\\
&=\sum_{t|d}\mu(t)\cdot t\cdot\frac{(1+\frac{d}{t})\frac{d}{t}}{2}\\
&=\sum_{t|d}\mu(t)\cdot\frac{(1+\frac{d}{t})d}{2}\\
&=\frac{d}{2}\cdot\sum_{t|d}(\mu(t)+\mu(t)\cdot\frac{d}{t})\\
&=\frac{d}{2}\cdot((\mu\ast\texttt{1})(d)+(\mu\ast\text{Id})(d))\\
&=\frac{d}{2}\cdot(\varepsilon(d)+\varphi(d))
\end{aligned}
$$
其中的数论函数 $\varepsilon, \mu, \texttt{1}, \text{Id}$ 见 [积性函数-例子](/posts/61065/#例子)。

两种解法结果相同，明显第一个简单多（

于是问题最终转化为求解：
$$
\frac{n}{2}(\sum_{d|n}d\cdot\varphi(d)+1)
$$

设 $g(n)=\sum_{d|n}d\cdot\varphi(d)$。

又有两种方法求 $g(n)$：

**法1：** 枚举法（复杂度 $O(NlogN)$）：

用线性筛求 $\varphi$，然后直接枚举 $d$ 即可。
```c++
	for (int i = 1; i <= n; i++) {
		for (int j = 1; j * i <= n; j++) {
			g[i*j] += i * phi[i];
		}
	}
```

**法2：** 线性筛法（复杂度 $O(N)$）：

不难证明 $g(n)$ 是积性函数，这样就可以使用筛法来求了，先算几个特殊值：

- $g(1)=1$

- $g(p)=\varphi(1)\cdot1+\varphi(p)\cdot p=p(p-1)+1$

- $g(p^k)=1+\sum_{i=1}^k\varphi(p^i)\cdot p^i=1+\sum_{i=1}^k (p-1)p^{2i-1}$

设 $i=a\cdot p^w, w\geqslant1, \text{gcd}(a, p)=1$，若我们在线性筛中要去求：$g(i\cdot p)$，则：
$$
\begin{aligned}
g(i\cdot p)&=g(a)\cdot g(p^{w+1})\\
g(i)&=g(a)\cdot g(p^w)\\
\Rightarrow g(i\cdot p)-g(i)&=g(a)\cdot (p-1)p^{2w+1}\\
\text{同理}\Rightarrow g(i)-g(\frac{i}{p})&=g(a)\cdot (p-1)p^{2w-1}\\
&\text{消去}g(a)\\
\Rightarrow g(i\cdot p)&=g(i)+(g(i)-g(\frac{i}{p}))\cdot p^2
\end{aligned}
$$

总复杂度 $O(N)$，下面代码使用线性筛法写的。
{% spoiler 点击显/隐代码 %}
```c++
#include <bits/stdc++.h>
#define db double
#define ll long long
#define int ll
#define vi vector<int>
#define vii vector<vi >
#define pii pair<int, int>
#define vp vector<pii >
#define vip vector<vp >
#define mkp make_pair
#define pb push_back
#define Case(x) cout << "Case #" << x << ": "
using namespace std;
const int INF = 0x3f3f3f3f;
const int P = 998244353;
const int N = 1e6 + 10;
int g[N];
bool vis[N];
vi prim;
void Euler(int n) {
	g[1] = 1;
	for (int i = 2; i <= n; i++) {
		if (!vis[i]) {
			prim.pb(i);
			g[i] = i * i - i + 1;
		}
		for (auto j : prim) {
			int t = j * i;
			if (t > n) break;
			vis[t] = 1;
			if (i % j == 0) {
				g[t] = g[i] + (g[i] - g[i/j]) * j * j;
				break;
			}
			g[t] = g[i] * g[j];
		}
	}
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	Euler(1e6);
	int T;
	cin >> T;
	while (T--) {
		int n;
		cin >> n;
		cout << (n * (g[n] + 1) / 2) << '\n';
	}
	return 0;
}
```
{% endspoiler %}
