---
title: 与位运算有关的恒等式
hide: false
math: true
category:
  - Math
tags:
  - 位运算
abbrlink: 20654
date: 2021-08-30 16:18:25
index_img:
banner_img:
---

在cf上做了些交互题，好多都和位运算与关系，而做题的关键就是看出来与位运算有关的恒等式，下面给出一些与位运算，加法有关的恒等式：

# 结论

先给出两个式子：

$$
\begin{aligned}
(a|b)&=(a\&b)+(a\oplus b)\\
a+b&=2(a\&b)+(a\oplus b)
\end{aligned}
$$

下面给出大致证明（下面都是二进制数）：

```c++
a=110=100+10=(a-(a&b))+(a&b)
b=011=001+10=(b-(a&b))+(a&b)   //先将 a&b 部分拆出来
//不难发现下面式子
a+b-2*(a&b)=100+001=a^b=(a|b)-(a&b)
//于是就可以很容易得出上面两个式子了
```

推论：

$$
\begin{aligned}
a+b&=(a|b)+(a\&b)\\
a+b&=2(a|b)-(a\oplus b)\\
\end{aligned}
$$

这个式子也不难得出：

$$
a\oplus b=(a|b)\oplus(a\&b)
$$

# 应用

## [CF1556D. Take a Guess](https://codeforces.com/contest/1556/problem/D)

### 题意

有一个长度为 $N$ 的序列每次你可以询问两个值的与值和或值，求出原序列中第k大值。

询问不能超过 $2N$ 次。

### 思路

对 $a+b=(a|b)+(a\&b)$ 的直接应用。

如果有了 $a+b, a+c, b+c$，那么很容易求出 $a = \frac{(a+b)+(a+c)-(b+c)}{2}$，而求每个 $a+b$ 只需要两次询问，所以先求出第一个元素，那么后面所有的元素，都可以通过两次询问得出。

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
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	int n, k;
	cin >> n >> k;
	vi And(n+1), Or(n+1);
	for (int i = 2; i <= n; i++) {
		cout << "and " << 1 << ' ' << i << '\n';
		cout << "or " << 1 << ' ' << i << '\n';
		cin >> And[i] >> Or[i];
		cout.flush();
	}
	cout << "and " << 2 << ' ' << 3 << '\n';
	cout << "or " << 2 << ' ' << 3 << '\n';
	cout.flush();
	int x, y;
	cin >> x >> y;
	vi a(n+1);
	a[1] = (And[2] + Or[2] + And[3] + Or[3] - x - y) / 2;
	for (int i = 2; i <= n; i++) {
		a[i] = And[i] + Or[i] - a[1];
	}
	sort(a.begin(), a.end());
	cout << "finish " << a[k] << '\n';
	return 0;
}
```
{% endspoiler %}
