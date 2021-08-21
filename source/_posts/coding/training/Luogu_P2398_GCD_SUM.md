---
title: Luogu P2398 GCD SUM
hide: false
math: true
category:
  - coding
  - training
tags:
  - 数论
  - Dirichlet卷积
abbrlink: 28234
date: 2021-08-17 10:08:38
index_img:
banner_img:
---

[P2398 GCD SUM](https://www.luogu.com.cn/problem/P2398)

# 题意

求 
$$
\sum_{i=1}^n\sum_{j=1}^n\text{gcd}(i, j)
$$

# 思路

对原式进行一些变换，[提取公因式技巧](/posts/61065/#提取公因式)：
$$
\begin{aligned}
\sum_{i=1}^n\sum_{j=1}^n\text{gcd}(i, j)&=\sum_{i=1}^n\sum_{j=1}^n\text{Id}(\text{gcd}(i, j))\\
&=\sum_{i=1}^n\sum_{j=1}^n((\varphi\ast\texttt{1})(\text{gcd}(i, j))\\
&=\sum_{i=1}^n\sum_{j=1}^n\sum_{d|\text{gcd}(i,j)}\varphi(d)\\
&=\sum_{d=1}^n\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\varphi(d)\\
&=\sum_{d=1}^n\left\lfloor\frac{n}{d}\right\rfloor^2\cdot \varphi(d)
\end{aligned}
$$

其中使用的数论函数 $\text{Id}, \varphi, \texttt{1}$ 见 [积性函数-例子](/posts/61065/#例子)。

然后使用[数论分块](/posts/61065/#数论分块)和欧拉筛筛出 $varphi$ 函数，并求其前缀和即可。

总复杂度 $O(N)$

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
const int N = 1e5 + 10;
int phi[N], sum[N];
bool vis[N];
vi prim;
void Euler(int n) {
	phi[1] = sum[1] = 1;
	for (int i = 2; i <= n; i++) {
		if (!vis[i]) {
			prim.pb(i);
			phi[i] = i-1;
		}
		for (auto j : prim) {
			int t = i * j;
			if (t > n) break;
			vis[t] = 1;
			if (i % j == 0) {
				phi[t] = phi[i] * j;
				break;
			}
			phi[t] = phi[i] * (j-1);
		}
		sum[i] = sum[i-1] + phi[i];
	}
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n, ans = 0;
	cin >> n;
	Euler(n);
	for (int l = 1, r; l <= n; l = r + 1) {
		r = n / (n / l);
		ans += (n / l) * (n / l) * (sum[r] - sum[l-1]);
	}
	cout << ans << '\n';
	return 0;
}
```
{% endspoiler %}
