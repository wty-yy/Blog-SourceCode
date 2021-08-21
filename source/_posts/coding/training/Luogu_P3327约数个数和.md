---
title: 'Luogu P3327 [SDOI2015]约数个数和'
hide: false
math: true
category:
  - coding
  - training
tags:
  - 数论
  - Mobius
  - Dirichlet卷积
abbrlink: 45770
date: 2021-08-20 08:26:54
index_img:
banner_img:
---

[P3327 [SDOI2015]约数个数和](https://www.luogu.com.cn/problem/P3327)

# 题意

有 $T$ 组数据，每组数据给出 $n, m$，求解
$$
\sum_{i=1}^n\sum_{j=1}^md(ij)
$$
其中 $d(n)=\sum_{i|n}1$，即为 $n$ 的约数个数。

数据范围：$1\leqslant T,n,m\leqslant 5\times10^4$

# 思路

主要要看出来这个式子：
$$
d(ij)=\sum_{x|i}\sum_{y|j}[\text{gcd}(x, y) = 1]
$$
**证明：** 设 $i = p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_s^{\alpha_s}, j = p_1^{\beta_1}p_2^{\beta_2}\cdots p_s^{\beta_s}$，其中$p_1,p_2,\ldots,p_s$ 为两两不同的素数，$\alpha_k, \beta_k\geqslant 0$。

则 $ij = p_1^{\alpha_1+\beta_1}p_2^{\alpha_2+\beta_2}\cdots p_s^{\alpha_s+\beta_s}$，我们又知道约数个数可以通过标准分解式的每个素数个数来表示，即：
$$
d(ij)=(\alpha_1+\beta_1+1)(\alpha_2+\beta_2+1)\cdots(\alpha_s+\beta_s+1)
$$
我们考虑如何通过 $i, j$ 的约数 $x, y$ 来生成 $ij$ 的约数（不重复的）

对于 $p_k, (1\leqslant k\leqslant s)$，我们发现如果当 $\text{gcd}(x, y)=1$ 时，$x$ 最多能遍历 $\alpha_k$ 个 $p_k$，而 $y$ 最多能遍历 $\beta_k$ 个 $p_k$，当 $x, y$ 中都没有 $p_k$ 时，就对应 $+1$，于是总个数合起来，正好就是 $\alpha_k+\beta_k+1$。

对于每一个 $p_k$ 都如此，所以上式成立。

**QED**

下面就是推式子了：
$$
\begin{aligned}
&\sum_{i=1}^n\sum_{j=1}^m\sum_{x|i}\sum_{y|j}[\text{gcd}(x, y)=1]\\
=&\sum_{i=1}^n\sum_{j=1}^m\sum_{x|i}\sum_{y|j}\sum_{d|\text{gcd}(x, y)}\mu(d)\\
=&\sum_{d=1}^{\min(n, m)}\mu(d)\sum_{i=1}^n\sum_{j=1}^m\sum_{x|i}\sum_{y|j}[d|\text{gcd}(x,y)]\\
=&\sum_{d=1}^{\min(n, m)}\mu(d)\sum_{x=1}^n\sum_{y=1}^m\sum_{i=1}^{\left\lfloor\frac{n}{x}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{y}\right\rfloor}[d|\text{gcd}(x,y)]\\
\xlongequal{x=x/d, y=y/d}&\sum_{d=1}^{\min(n, m)}\mu(d)\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\sum_{i=1}^{\left\lfloor\frac{n}{xd}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{yd}\right\rfloor}1\\
=&\sum_{d=1}^{\min(n, m)}\mu(d)\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{i=1}^{\left\lfloor\frac{n}{xd}\right\rfloor}1\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{yd}\right\rfloor}1\\
=&\sum_{d=1}^{\min(n, m)}\mu(d)\sum_{x=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\left\lfloor\frac{n}{dx}\right\rfloor\sum_{y=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\left\lfloor\frac{m}{yd}\right\rfloor\\
\end{aligned}\\
\text{设} g(n)=\sum_{i=1}^n\left\lfloor\frac{n}{i}\right\rfloor\\
\begin{aligned}
\text{原式}&=\sum_{d=1}^{\min(n, m)}\mu(d)g(\left\lfloor\frac{n}{d}\right\rfloor)g(\left\lfloor\frac{m}{d}\right\rfloor)
\end{aligned}
$$

于是我们可以先预处理出 $g(n), (1\leqslant n\leqslant 5\times10^4)$，复杂度 $O(N\sqrt N)$。

然后对于每一个 $n, m$，再使用数论分块，复杂度 $O(T\sqrt N)$。

总复杂度 $O(N\sqrt N)$。
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
const int N = 5e4 + 10;
int mu[N], sum[N], g[N];
bool vis[N];
vi prim;
void Euler(int n) {
	mu[1] = sum[1] = 1;
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
		sum[i] = sum[i-1] + mu[i];
	}
	for (int i = 1; i <= n; i++) {
		for (int l = 1, r; l <= i; l = r + 1) {
			r = i / (i / l);
			g[i] += (r - l + 1) * (i / l);
		}
	}
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	Euler(5e4);
	int T;
	cin >> T;
	while (T--) {
		int n, m, ans = 0;
		cin >> n >> m;
		int mn = min(n, m);
		for (int l = 1, r; l <= mn; l = r + 1) {
			r = min(n / (n / l), m / (m / l));
			ans += (sum[r] - sum[l-1]) * g[n/l] * g[m/l];
		}
		cout << ans << '\n';
	}
	return 0;
}
```
{% endspoiler %}
