---
title: Luogu P2522 [HAOI2011]Problem b
hide: false
math: true
abbrlink: 64029
date: 2021-08-17 11:07:33
index_img:
banner_img:
category:
 - coding
 - training
tags: [数论, Mobius, Dirichlet卷积]
---

[P2522 [HAOI2011]Problem b](https://www.luogu.com.cn/problem/P2522)

# 题意

给出 $N$ 组数据，每组数据有 $a, b, c, d, k$，求解：
$$
\sum_{x=a}^b\sum_{y=c}^d[\text{gcd}(x,y)=k]
$$

$1\leqslant N, k\leqslant 5\times 10^4$
$1\leqslant a\leqslant b\leqslant 5\times 10^4$
$1\leqslant c\leqslant d\leqslant 5\times 10^4$

# 思路

对原式进行变换，变换技巧见[Mobius反演](/posts/61065/#应用)：
$$
\begin{aligned}
\sum_{x=a}^b\sum_{y=c}^d[\text{gcd}(x,y)=k]
&=\sum_{x=\left\lceil\frac{a}{k}\right\rceil}^{\left\lfloor\frac{b}{k}\right\rfloor}\sum_{y=\left\lceil\frac{c}{k}\right\rceil}^{\left\lfloor\frac{d}{k}\right\rfloor}[\text{gcd}(x, y)=1]\\
&\xlongequal{a=\left\lceil\frac{a}{k}\right\rceil, b=\left\lfloor\frac{b}{k}\right\rfloor, c=\left\lceil\frac{c}{k}\right\rceil, d=\left\lfloor\frac{d}{k}\right\rfloor}\sum_{x=a}^b\sum_{y=c}^d[\text{gcd}(x,y)=1]\\
&=\sum_{x=a}^b\sum_{y=c}^d\varepsilon(\text{gcd}(x, y)=1)\\
&=\sum_{x=a}^b\sum_{y=c}^d(\mu\ast \texttt{1})(\text{gcd}(x, y)=1)\\
&=\sum_{x=a}^b\sum_{y=c}^d\sum_{z|\text{gcd}(x, y)}\mu(z)\\
&=\sum_{z=1}^{\min(b, d)}\sum_{x=\left\lceil\frac{a}{z}\right\rceil}^{\left\lfloor\frac{b}{z}\right\rfloor}\sum_{y=\left\lceil\frac{c}{z}\right\rceil}^{\left\lfloor\frac{d}{z}\right\rfloor}\mu(z)\\
&=\sum_{z=1}^{\min(b, d)}(\left\lfloor\frac{b}{z}\right\rfloor-\left\lceil\frac{a}{z}\right\rceil+1)(\left\lfloor\frac{d}{z}\right\rfloor-\left\lceil\frac{c}{z}\right\rceil+1)\mu(z)\\
&\xlongequal[\left\lceil\frac{c}{z}\right\rceil=\left\lfloor\frac{c+z-1}{z}\right\rfloor=\left\lfloor\frac{c-1}{z}\right\rfloor+1]{\left\lceil\frac{a}{z}\right\rceil=\left\lfloor\frac{a+z-1}{z}\right\rfloor=\left\lfloor\frac{a-1}{z}\right\rfloor+1} \sum_{z=1}^{\min(b,d)}(\left\lfloor\frac{b}{z}\right\rfloor-\left\lfloor\frac{a-1}{z}\right\rfloor)(\left\lfloor\frac{d}{z}\right\rfloor-\left\lfloor\frac{c-1}{z}\right\rfloor)\mu(z)
\end{aligned}
$$

其中使用的数论函数 $\varepsilon, \mu, \texttt{1}$ 见 [积性函数-例子](/posts/61065/#例子)。

于是只需要用欧拉筛，线性预处理出 $\mu$ 函数的前缀和，然后用[数论分块](/posts/61065/#数论分块)就能解决了

**注：** 数论分块这里是取四个的最小值。

总复杂度 $O(N\cdot\sqrt{\min(b, d)})$
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
		sum[i] = sum[i-1] + mu[i];
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
		int a, b, c, d, k, ans = 0;
		cin >> a >> b >> c >> d >> k;
		a = (a + k - 1) / k, c = (c + k - 1) / k;
		b /= k, d /= k;
		a--, c--;
		int mn = min(b, d);
		for (int l = 1, r; l <= mn; l = r + 1) {
			r = min(b/(b/l), d/(d/l));
			if (a/l != 0) r = min(r, a/(a/l));
			if (c/l != 0) r = min(r, c/(c/l));
			ans += (b/l - a/l) * (d/l - c/l) * (sum[r] - sum[l-1]);
		}
		cout << ans << '\n';
	}
	return 0;
}
```
{% endspoiler %}
