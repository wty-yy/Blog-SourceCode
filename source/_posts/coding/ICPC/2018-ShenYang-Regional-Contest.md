---
title: '2018-2019 ACM-ICPC, Asia Shenyang Regional Contest'
hide: false
math: true
abbrlink: 12560
date: 2021-09-01 20:28:07
index_img:
banner_img:
category:
 - coding
 - ICPC
tags:
 - 数论
---

[2018-2019 ACM-ICPC, Asia Shenyang Regional Contest](https://codeforces.ml/gym/101955)

先开坑，因为做了下 K 题。

## J - How Much Memory Your Code Is Using?

### 题意

给出各种数据大小和变量或数组，求总内存，单位KB。

### 思路

签到题，直接模拟。

{% spoiler 点击显/隐代码 %}
```c++
#include <bits/stdc++.h>
#define db double
#define ll long long
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
const int N = 100;
char a[N];
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	map<string, int> word;
	word["bool"] = word["char"] = 1;
	word["int"] = word["float"] = 4;
	word["long long"] = word["double"] = 8;
	word["__int128"] = word["long double"] = 16;
	int T;
	cin >> T;
	for (int _t = 1; _t <= T; _t++) {
		Case(_t);
		int n;
		ll ans = 0;
		cin >> n;
		while (n--) {
			string s, t;
			cin >> s;
			if (s == "long") {
				cin >> t;
				s += " " + t;
			}
			cin >> a;
			int num = 1, sz = strlen(a);
			for (int i = 0; i < sz; i++) if (a[i] >= '0' && a[i] <= '9') {
				num = atoi(a + i);
				break;
			}
			ans += num * word[s];
		}
		cout << (ll)(ceil((db)ans / 1024)) << '\n';
	}
	return 0;
}
```
{% endspoiler %}

## K - Let the Flames Begin

### 题意

以约瑟夫环为背景，有 $n$ 个人站成一圈，数 $k$ 个人后出局，接着下一个人开始继续进行，如此反复，求第 $m$ 个出局的人的编号。

数据范围：$1\leqslant n, m, k\leqslant 10^{18}, n\geqslant m$，保证 $\min(m, k) \leqslant 2\times 10^6$。

### 思路

关于约瑟夫环线性算法及其优化算法，见 [Blog - 约瑟夫环问题](/posts/7922/) 。

那么区别在于题目要求第 $m$ 个出局的人的编号，其实这并不难解决， 设 $f(n, m, k)$ 表示题目所要求的解。

则有 
$$
\begin{aligned}
f(n, 1, k) &= (k-1) \bmod n\\
f(n, m, k) &= (f(n-1, m-1, k) + k) \bmod n
\end{aligned}
$$
于是只需要将递推的初始值改为 $(k-1)\bmod n$ 即可，其他可以直接套用 [优化算法](/posts/7922/#优化)，时间复杂度为 $O(\min(m, k\log m))$。

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
int rec(int n, int m, int k) {
	if (m == 1) return (k-1) % n;
	return (rec(n-1, m-1, k) + k) % n;
}
int josephus(int n, int m, int k) {
	if (k == 1) return m;
	int sz = n-m+1, pos = (k-1) % sz;
	while (sz < n) {
		if (pos + k >= sz + 1) {
			sz++;
			pos = (pos + k) % sz;
			continue;
		}
		int x = min((sz - pos - 1) / (k - 1), n - sz);
		pos += x * k;
		sz += x;
	}
	return pos + 1;
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int T;
	cin >> T;
	for (int i = 1; i <= T; i++) {
		Case(i);
		int n, m, k;
		cin >> n >> m >> k;
		cout << josephus(n, m, k) << '\n';
		//cout << rec(n, m, k) + 1 << '\n';
	}
	return 0;
}
```
{% endspoiler %}
