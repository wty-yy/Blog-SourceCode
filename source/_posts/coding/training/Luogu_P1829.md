---
title: 'Luogu P1829 [国家集训队]Crash的数字表格 / JZPTAB'
hide: false
math: true
category:
  - coding
  - training
tags:
  - 数论
  - Mobius
  - Dirichlet卷积
abbrlink: 2613
date: 2021-08-17 17:08:34
index_img:
banner_img:
---

[P1829 [国家集训队]Crash的数字表格 / JZPTAB](https://www.luogu.com.cn/problem/P1829)

# 题意

给出 $n, m$ 求解：
$$
\sum_{i=1}^n\sum_{j=1}^m\text{lcm}(i, j)
$$

$1\leqslant n, m\leqslant 10^7$

# 思路

对原式进行数论变换：
$$
\begin{aligned}
\sum_{i=1}^n\sum_{j=1}^m\text{lcm}(i, j)&=\sum_{i=1}^n\sum_{j=1}^m\frac{i\cdot j}{\text{gcd}(i,j)}\\
&\xlongequal{\text{提取公因式}}\sum_{d=1}^{\min(n,m)}\sum_{i=1}^n\sum_{j=1}^m\frac{i\cdot j}{d}\cdot [\text{gcd}(i,j)=d]\\
&\xlongequal{i=i/d,j=j/d}\sum_{d=1}^{\min(n,m)}\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}\frac{id\cdot jd}{d}\cdot [\text{gcd}(id,jd)=d]\\
&=\sum_{d=1}^{\min(n,m)}\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}i\cdot j\cdot d\cdot [\text{gcd}(i,j)=1]\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}i\cdot j\cdot \varepsilon(\text{gcd}(i,j))\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}i\cdot j\cdot (\mu\ast\texttt{1})(\text{gcd}(i,j))\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}i\cdot j\cdot \sum_{t|\text{gcd}(i,j)}\mu(t)\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}\sum_{i=1}^{\left\lfloor\frac{n}{d}\right\rfloor}[t|i]\sum_{j=1}^{\left\lfloor\frac{m}{d}\right\rfloor}[t|j]\cdot i\cdot j\cdot\mu(t)\\
&\xlongequal{i=i/t,j=j/t}\sum_{d=1}^{\min(n,m)}d\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}\sum_{i=1}^{\left\lfloor\frac{n}{dt}\right\rfloor}\sum_{j=1}^{\left\lfloor\frac{m}{dt}\right\rfloor} it\cdot jt\cdot\mu(t)\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}t^2\mu(t)\sum_{i=1}^{\left\lfloor\frac{n}{dt}\right\rfloor}i\sum_{j=1}^{\left\lfloor\frac{m}{dt}\right\rfloor}j\\
&=\sum_{d=1}^{\min(n,m)}d\sum_{t=1}^{\min(\left\lfloor\frac{n}{d}\right\rfloor,\left\lfloor\frac{m}{d}\right\rfloor)}t^2\mu(t)\cdot\frac{(1+\left\lfloor\frac{n}{dt}\right\rfloor)(\left\lfloor\frac{n}{dt}\right\rfloor)}{2}\cdot\frac{(1+\left\lfloor\frac{m}{dt}\right\rfloor)(\left\lfloor\frac{m}{dt}\right\rfloor)}{2}\\
\end{aligned}
$$

其中，数论函数 $\varepsilon, \mu, \texttt{1}$ 见 [积性函数-例子](/posts/61065/#例子)

最终的式子可以使用二维 [数论分块](/posts/61065/#数论分块) 解决，用线性筛筛出 $\mu$ 函数，顺便维护 $t^2\mu(t)$ 的前缀和。

总复杂度 $O(\sqrt N\cdot\sqrt N)=O(N)$。
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
const int P = 20101009;
const int N = 1e7 + 10;
int mu[N], sum[N];
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
		sum[i] = (sum[i-1] + i * i % P * mu[i] + P) % P;
	}
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	Euler(1e7);
	int n, m, ans = 0;
	cin >> n >> m;
	int mn1 = min(n, m);
	for (int l = 1, r; l <= mn1; l = r + 1) {
		r = min(n/(n/l), m/(m/l));
		int mn2 = min(n/l, m/l), tmp = 0;
		for (int u = 1, v, s = n/l, t = m/l; u <= mn2; u = v + 1) {
			v = min(s/(s/u), t/(t/u));
			tmp = (tmp + (sum[v] - sum[u-1] + P) % P * ((1+s/u)*(s/u)/2%P) % P * ((1+t/u)*(t/u)/2%P) % P) % P;
		}
		ans = (ans + (l + r) * (r - l + 1) / 2 % P * tmp % P) % P;
	}
	cout << ans << '\n';
	return 0;
}
```
{% endspoiler %}
