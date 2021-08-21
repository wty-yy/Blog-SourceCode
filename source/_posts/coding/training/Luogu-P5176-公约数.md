---
title: Luogu P5176 公约数
hide: false
math: true
category:
  - coding
  - training
tags:
  - Mobius
  - Dirichlet卷积
abbrlink: 1294
date: 2021-08-21 08:53:36
index_img:
banner_img:
---

[P5176 公约数](https://www.luogu.com.cn/problem/P5176)

# 题意

有 $T$ 组数据，每组数据给出，$n, m, p$，求：
$$
\sum_{i=1}^n\sum_{j=1}^m\sum_{k=1}^p\text{gcd}(i\cdot j,i\cdot k,j\cdot k)\times \gcd(i,j,k)\times \left(\frac{\gcd(i,j)}{\gcd(i,k)\times \gcd(j,k)}+\frac{\gcd(i,k)}{\gcd(i,j)\times \gcd(j,k)}+\frac{\gcd(j,k)}{\gcd(i,j)\times \gcd(i,k)}\right)
$$
答案对 $10^9+7$ 取模。

数据范围：$10^7\leqslant n, m, p\leqslant 2\times 10^7$

# 思路

首先要看出来一个恒等式：
$$
\text{gcd}(ij, ik, jk) = \frac{\text{gcd}(i, j)\cdot \text{gcd}(j, k)\cdot\text{gcd}(i, k)}{\text{gcd}(i, j, k)}
$$
**证明：**

该问题可以转化为讨论一个素因数的情况。

设 $i, j, k$ 分别含有因数 $p^a,p^b,p^c$，不妨令 $a\leqslant b\leqslant c$。

则对于该素数 $p$， $\text{gcd}(ij, ik, jk) = \min(a+b, b+c, a+c)=a+b$

$\frac{\text{gcd}(i, j)\text{gcd}(j,k)\text{gcd}(i,k)}{\text{gcd}(i,j,k)}=\min(a,b)+\min(b,c)+\min(a,c)-\min(a, b, c)=a+b+a-a=a+b$

不难发现恒等式：$\min(a+b,b+c,a+c)=\min(a,b)+\min(b,c)+\min(a,c)-\min(a,b,c)$

解释：**左式**的含义是将 $a,b,c$ 三者中最小的两者加起来，最小的两个数又有如下的表示法：

- 最小的数可以被表示为 $\min(a,b,c)$
- 第二小的数可以表示为 $\min(a,b)+\min(b,c)+\min(a,c)-2\min(a,b,c)$

于是将再用这两种表示法加起来即得**右式**。

**QED**

于是，对原式进行变形：
$$
\begin{aligned}
\text{原式}&=\sum_{i=1}^n\sum_{j=1}^m\sum_{k=1}^p\text{gcd}(i,j)^2+\text{gcd}(i,k)^2+\text{gcd}(j,k)^2\\
&=p\sum_{i=1}^n\sum_{j=1}^m\text{gcd}(i,j)^2+m\sum_{i=1}^n\sum_{k=1}^p\text{gcd}(i,k)^2+n\sum_{j=1}^m\sum_{k=1}^p\text{gcd}(j,k)^2\\
\end{aligned}\\
\text{令} f(n, m) = \sum_{i=1}^n\sum_{j=1}^m\text{gcd}(i,j)^2\\
\text{原式}=p\cdot f(n, m)+m\cdot f(n, p)+n\cdot f(m, p)
$$
问题转换为求解 $g(n, m)$。
$$
\begin{aligned}
g(n,m)&=\sum_{i=1}^n\sum_{j=1}^m\text{gcd}(i,j)^2\\
&=\sum_{d=1}^{\min(n,m)}\sum_{i=1}^n\sum_{j=1}^m[\text{gcd}(i, j)=d]\cdot d^2\\
&=\sum_{d=1}^{\min(n,m)}d^2\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}[\text{gcd}(i,j)=1]\\
&=\sum_{d=1}^{\min(n,m)}d^2\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\sum_{t|\text{gcd}(i,j)}\mu(t)\\
&=\sum_{d=1}^{\min(n,m)}d^2\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}\mu(t)\sum_{i=1}^{\left\lfloor\frac{n}{dt}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{dt}\right\rfloor}1\\
&=\sum_{d=1}^{\min(n,m)}d^2\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}\mu(t)\left\lfloor\frac{n}{dt}\right\rfloor\left\lfloor\frac{m}{dt}\right\rfloor\\
&\xlongequal{\text{令}T=dt}\sum_{T=1}^{\min(n, m)}\left\lfloor\frac{n}{T}\right\rfloor\left\lfloor\frac{m}{T}\right\rfloor\sum_{d|T}d^2\mu(\frac{T}{d})\\
\end{aligned}\\
\text{令} g(n)=\sum_{d|n}d^2\mu(\frac{n}{d})\\
\text{原式}=\sum_{T=1}^{\min(n,m)}\left\lfloor\frac{n}{T}\right\rfloor\left\lfloor\frac{m}{T}\right\rfloor g(T)
$$
其中，对 $T=dt$ 的换元思路来自于杜教筛。

于是，如果我们能预处理出来 $g(n)$，那么每次询问使用**数论分块**就可以做到 $O(\sqrt N)$ 求解了。

不难发现 $g = \text{Id}^2\ast\mu$，则 $g$ 是一个积性函数，由于积性函数基本都可以使用线性筛求出，下面求递推式，类似[LCMSUM - LCM Sum](/posts/49145/)中的**线性筛法**：

- $g(1)=1$

- $g(p)=\mu(p)+p^2\mu(1)=p^2-1$

- $\begin{aligned}g(p^k)&=\mu(p^k)+p^2\mu(p^{k-1})+p^4\mu(p^{k-2})+\cdots+p^{2(k-1)}\mu(p)+p^{2k}\mu(1)\\&=0+\cdots+0-p^{2(k-1)}+p^{2k}\\&=p^{2k-2}(p^2-1)\end{aligned}$

令 $i=a\cdot p^k, (\text{gcd}(a,p)=1,k\geqslant 1)$，求 $g(i\cdot p)$ 的递推式。
$$
\begin{aligned}
&g(i\cdot p)=g(a)g(p^{k+1})=g(a)p^{2k}(p^2-1)\\
&g(i)=g(a)g(p^k)=g(a)p^{2k-2}(p^2-1)\\
\Rightarrow &g(i\cdot p)=p^2\cdot g(i)
\end{aligned}
$$
于是就可以使用线性筛进行递推了。

总复杂度 $O(T\sqrt n)$。
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
const int P = 1e9 + 7;
const int N = 2e7 + 10;
int g[N], sum[N];
bool vis[N];
vi prim;
void Euler(int n) {
	g[1] = sum[1] = 1;
	for (int i = 2; i <= n; i++) {
		if (!vis[i]) {
			prim.pb(i);
			g[i] = (i * i - 1 + P) % P;
		}
		for (auto j : prim) {
			int t = i * j;
			if (t > n) break;
			vis[t] = 1;
			if (i % j == 0) {
				g[t] = (j * j % P * g[i] % P);
				break;
			}
			g[t] = g[i] * g[j] % P;
		}
		sum[i] = sum[i-1] + g[i];
	}
}
int calc(int n, int m) {
	int mn = min(n, m), ret = 0;
	for (int l = 1, r; l <= mn; l = r + 1) {
		r = min(n / (n / l), m / (m / l));
		ret = (ret + (n / l) * (m / l) % P * (sum[r] - sum[l-1] + P) % P) % P;
	}
	return ret;
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	Euler(2e7);
	int T;
	cin >> T;
	while (T--) {
		int n, m, p;
		cin >> n >> m >> p;
		cout << (p * calc(n, m) % P + m * calc(n, p) % P + n * calc(m, p) % P) % P << '\n';
	}
	return 0;
}
```
{% endspoiler %}
