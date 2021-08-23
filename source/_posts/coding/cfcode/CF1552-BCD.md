---
title: CF1552 BCD
hide: false
math: true
category:
  - coding
  - cf
tags:
  - 贪心
  - 图论
  - 思维题
abbrlink: 54761
date: 2021-07-28 09:34:04
index_img:
banner_img:
---

# CF1552 BCD

[比赛链接](https://codeforces.com/contest/1552/)

## B

由于最终获胜的运动员有且仅有一个，可以通过两两之间比较必有一人胜出得出

所以，如果有一个运动员可以击败其他所有运动员，那么将运动员编号 $1$ 到编号 $n$，顺次比较，每次只留下获胜的一个运动员，那么将最后剩下的一个运动员再和全部运动员比较一次，如果失败则无解，成功则得解。可以用反证法证明，中间运动员一定不是要求的解。

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
const int MOD = 998244353;
signed main(){
#ifdef _DEBUG
	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int T;
	cin >> T;
	while (T--) {
		int n;
		cin >> n;
		vii a(n, vi(5));
		for (int i = 0; i < n; i++) {
			for (int j = 0; j < 5; j++) {
				cin >> a[i][j];
			}
		}
		int ans = 0;
		for (int i = 1; i < n; i++) {
			int cnt = 0;
			for (int j = 0; j < 5; j++) {
				if (a[ans][j] < a[i][j]) {
					cnt++;
				}
			}
			if (cnt < 3) {
				ans = i;
			}
		}
		for (int i = 0; i < n; i++) {
			if (i != ans) {
				int cnt = 0;
				for (int j = 0; j < 5; j++) {
					if (a[ans][j] < a[i][j]) {
						cnt++;
					}
				}
				if (cnt < 3) {
					ans = -2;
					break;
				}
			}
		}
		cout << ans+1 << '\n';
	}
	return 0;
}
```
{% endspoiler %}

## C
贪心

先考虑 $4$ 个可以自由连接的节点，如果两条弦不相交，一定可以通过改变endpos来使得弦相交

考虑如果给你 $2n$ 个自由连接节点，如何连接使得弦的交点数最多，让每次新增的弦和已有的弦都相交一遍是最优解，将这 $2n$ 个节点编号为 $0\cdots 2n$，将节点 $i$ 和结点 $i+n$ 连接，即可达到要求

题目还先连接了一些节点，可以直接考虑剩下的 $2(n-k)$ 个自由节点的连接，按照上述方式连接弦即可

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
const int MOD = 998244353;
signed main(){
#ifdef _DEBUG
	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int T;
	cin >> T;
	while (T--) {
		int n, m;
		cin >> n >> m;
		vi link(2*n, -1);
		int ans = 0;
		for (int i = 0; i < m; i++) {
			int u, v;
			cin >> u >> v;
			if (u > v) swap(u, v);
			u--, v--;
			link[u] = v;
			link[v] = u;
			for (int j = u + 1; j != v; j++) {
				if (link[j] != -1 && (!(link[j] > u && link[j] < v))) {
					ans++;
				}
			}
		}
		vi hsh;
		for (int i = 0; i < 2*n; i++) {
			if (link[i] == -1) {
				hsh.pb(i);
			}
		}
		sort(hsh.begin(), hsh.end());
		int sz = hsh.size() / 2;
		for (int i = 0; i < sz; i++) {
			int u = hsh[i], v = hsh[i+sz];
			link[u] = v;
			link[v] = u;
			for (int j = u + 1; j != v; j++) {
				if (link[j] != -1 && (!(link[j] > u && link[j] < v))) {
					ans++;
				}
			}
		}
		cout << ans << '\n';
	}
	return 0;
}
```
{% endspoiler %}
## D

思维题，转换问题为图论问题，建立点与边的定义

如果允许写 $n+1$ 个 $b$ 那么很容易的可以构造出来满足条件的序列 $\{b_n\}$，令 $b_0=0,b_i=b_{i-1}+a_i$，则 $a_i=b_i-b_{i-1}$，我们把每一个 $b_i$ 看做一个点，每一个 $a_i$ 看做一条连接 $b_{i-1}$ 和 $b_i$ 的边，那么在上述构造中，$b_i$ 就构成了一条链。

现在，题目只给了 $n$ 个 $b$ 那么肯定不能是链了，因为这样只有 $n-1$ 条边不能满足 $n$ 个 $a$，所以一定会有一个环，而且只需要一个环，就能满足题目要求，问题转换为去找这样的一个环。

若 $b_1,b_2,b_3$ 能形成一个环，那么从边上看就有 $(b_1-b_2)+(b_2-b_3)+(b_3-b_1)=0\Rightarrow a_1+a_2+a_3=0$，注意这里的 $a_i$ 是可以变号的，因为交换一下 $b$ 的顺序即可将 $-a$ 变为 $a$，所以只需要找出这样一组 $a$，使得它们之和为 $0$ 即可。

可以用背包的方法来实现。

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
const int MOD = 998244353;
signed main(){
#ifdef _DEBUG
	//FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int T;
	cin >> T;
	while (T--) {
		int n;
		cin >> n;
		set<int> st;
		st.insert(0);
		bool fg = 0;
		for (int i = 0; i < n; i++) { 
			int x;
			cin >> x;
			if (st.count(x) || st.count(-x)) {
				fg = 1;
			}
			set<int> tmp = st;
			for (auto j : tmp) {
				st.insert(j - x);
				st.insert(j + x);
			}
		}
		cout << (fg ? "YES" : "NO") << '\n';
	}
	return 0;
}
```
{% endspoiler %}
