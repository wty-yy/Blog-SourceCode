---
title: 2017 Korea Daejeon Regional
hide: false
math: true
category:
  - coding
  - ICPC
tags:
  - 暴力
  - 网络流
  - 最小割
  - Kruskal
  - 递归
abbrlink: 56269
date: 2021-08-14 15:36:52
index_img:
banner_img:
---

[官网地址](http://icpckorea.org/2017-daejeon/regional)

[CF地址](https://codeforces.com/gym/101667)

补题，(和重做差不多了😂)

# B - Connect3

## 题意
给出一个 $4\times4$ 的网格图，有两个玩家轮流下黑棋和白棋，每次下棋位置必须保证该棋子的下方有一个棋子，也就是堆栈，形式化地说就是，若下在 $(i, j)$ 处，当且仅当， $(i-1, j)$ 处必须有棋子。

若一个玩家获胜，规则类似于五子棋，只是将“五子”改成了“三子”，横着或竖着或斜着有三个同种颜色连着，执改棋玩家获胜。

黑棋先下，告诉你第一次下棋的位置和最后一个白棋下的位置，求最终一共有多少种棋盘(也就是不考虑过程，只考虑终态)。
## 思路
直接暴力模拟两个人的下棋顺序即可，总复杂度 $O(15^2\cdot16\cdot3)=10^6$。

**注：** 判断胜利的方法和最终棋盘的状态(可以使用`set<vector<vector<int>> > st`)。
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
int a, b, ans, num[5];
vii stk(6, vi(6, -1));
set<vii> used;
int dx[4] = {1, 0, 1, 1};
int dy[4] = {0, 1, -1, 1};
bool chk() {
	for (int i = 1; i <= 4; i++) {
		for (int j = 1; j <= 4; j++) {
			for (int k = 0; k < 4; k++) {
				int fg = 1;
				for (int t = 0; t < 3; t++) {
					int x = i + dx[k] * t, y = j + dy[k] * t;
					if (stk[x][y] == -1 || stk[x][y] != stk[i][j]) {
						fg = 0;
						break;
					}
				}
				if (fg) return 1;
			}
		}
	}
	return 0;
}
void dfs(int x, int y, int col) {
	if (stk[b][a] == 1) return;
	if (chk()) {
		if (x == a && y == b && col == 0 && used.count(stk) == 0) {
			used.insert(stk);
			ans++;
			//for (int i = 1; i <= 4; i++) {
			//	for (int j = 1; j <= 4; j++) {
			//		cout << stk[i][j] << ' ';
			//	}
			//	cout << '\n';
			//}
			//cout << '\n';
		}
		return;
	}
	for (int i = 1; i <= 4; i++) {
		if (num[i] < 4) {
			stk[i][++num[i]] = col ^ 1;
			dfs(num[i], i, col ^ 1);
			stk[i][num[i]--] = -1;
		}
	}
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int x;
	cin >> x >> a >> b;
	stk[x][++num[x]] = 1;
	dfs(1, x, 1);
	cout << ans << '\n';
	return 0;
}
```
{% endspoiler %}

# E - How Many to Be Happy? 

## 题意

给出一个含有N个节点M条边的带权值的无向图，对于其中的每一条边 $e$，定义 $H(e)$ 为将其加入到最小生成树中所需要删除掉的最少的边数。

求 $\sum_{e\in E} H(e)$，$E$ 为原图中的边集合。

$N \leqslant 100, M\leqslant 500$

## 思路

考虑 $Kruskal$ 算法过程，如果边 $e$ 要加入到最小生成树中，那么它所对应的两个端点必须不在同一集合中，于是问题转换为求解最小去掉多少边，从而将两个端点分离开，这就是标准的最小割，最小割转最大流就行了。

**注：** 之前在图中的边一定是val值小于当前边，容量都为1的双向边。
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
const int N = 100 + 10;
struct Dinic {
	struct Edge {
		int u, v, cap, flow;
	};
	vector<Edge> edges;
	vi G[N];
	int s, t, d[N], cur[N];
	void init(int n) {
		for (int i = 0; i < n; i++) G[i].clear();
		edges.clear();
	}
	void addedge(int u, int v, int cap) {
		edges.pb({u, v, cap, 0});
		edges.pb({v, u, 0, 0});
		G[u].pb(edges.size() - 2);
		G[u].pb(edges.size() - 1);
	}
	bool bfs() {
		memset(d, -1, sizeof(d));
		queue<int> q;
		q.push(s);
		d[s] = 0;
		while(!q.empty()) {
			int u = q.front();
			q.pop();
			for (int i : G[u]) {
				Edge &e = edges[i];
				if (d[e.v] == -1 && e.cap > e.flow) {
					d[e.v] = d[u] + 1;
					q.push(e.v);
				}
			}
		}
		return d[t] != -1;
	}
	int dfs(int u, int mx) {
		if (u == t || mx == 0) return mx;
		int sum = 0, f, sz = G[u].size();
		for (int &i = cur[u]; i < sz; i++) {
			Edge &e = edges[G[u][i]];
			if (d[e.v] == d[u] + 1 && (f = dfs(e.v, min(mx, e.cap - e.flow)))) {
				e.flow += f;
				edges[G[u][i] ^ 1].flow -= f;
				mx -= f;
				sum += f;
				if (mx == 0) break;
			}
		}
		return sum;
	}
	int calc(int s, int t) {
		this->s = s;
		this->t = t;
		int ret = 0;
		while (bfs()) {
			memset(cur, 0, sizeof(cur));
			ret += dfs(s, 9e18);
		}
		return ret;
	}
}dinic;
struct Node {
	int val, u, v;
	bool operator < (const Node &y) const &{
		return val < y.val;
	}
};
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n, m;
	cin >> n >> m;
	vector<Node> a(m);
	for (int i = 0; i < m; i++) {
		cin >> a[i].u >> a[i].v >> a[i].val;
		a[i].u--, a[i].v--;
	}
	sort(a.begin(), a.end());
	int ans = 0;
	for (int i = 0; i < m; i++) {
		dinic.init(n);
		for (int j = 0; j < i; j++) {
			if (a[j].val < a[i].val) {
				dinic.addedge(a[j].u, a[j].v, 1);
				dinic.addedge(a[j].v, a[j].u, 1);
			}
		}
		ans += dinic.calc(a[i].u, a[i].v);
	}
	cout << ans << '\n';
	return 0;
}
```
{% endspoiler %}

# F - Philosopher’s Walk
## 题意
给出一个 $N\times N$ 的图(类似于分形?)， $N=2^k(k\leqslant 15)$，图形是上一个图形通过对称和平移操作得到的，给出从起点 $(1,1)$ 出发的步数，求最后到达的位置。

![Figure F](https://upload.cc/i1/2021/08/15/RnfhpO.png)

## 思路
考试时好像写了半天，没有抓住题目的关键，就是图形的变换规律，将该图形分为四个区域： 
- 左下是上一个图形**关于x=y对称**
- 左上是向上平移 $N/2$ 得到
- 右上是向右上平移 $N/2$ 得到
- 右下是先关于**y=n/2-x**对称后，再向右平移 $N/2$ 个单位后得到

使用递归即可，总复杂度 $O(K)$。
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
pii dfs(int n, int num) {
	if (n ==  2) {
		if (num == 0) return mkp(1, 1);
		else if (num == 1) return mkp(1, 2);
		else if (num == 2) return mkp(2, 2);
		else return mkp(2, 1);
	}
	int tmp = num / (n * n / 4);
	pii ret = dfs(n/2, num % (n * n / 4));
	if (tmp == 0) {
		swap(ret.first, ret.second);
	} else if (tmp == 1) {
		ret.second += n/2;
	} else if (tmp == 2) {
		ret.first += n/2;
		ret.second += n/2;
	} else {
		int x = ret.first, y = ret.second;
		ret.first = n - y + 1;
		ret.second = n/2 - x + 1;
	}
	return ret;
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n, m;
	cin >> n >> m;
	pii ans = dfs(n, m-1);
	cout << ans.first << ' ' << ans.second << '\n';
	return 0;
}
```
{% endspoiler %}

# K - Untangling Chain
## 题意
一个顶点再一个网格图上移动，一共移动 $N$ 步，给定每次移动的方向，请你确定每个方向上的移动距离，使得最终的移动路径不会有交点。

$N\leqslant 10^4$
## 思路
维护一个当前最小矩形覆盖，也就是可以通过这个矩形覆盖当前走过的所有路径，然后每次移动只要都恰好移动出该矩形，即可保证下一次转向的方向上，除了当前顶点外，没有其他路径。

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
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n, dir = 0, x = 0, y = 0, mxx = 0, mnx = 0, mxy = 0, mny = 0;
	cin >> n;
	for (int i = 0; i < n; i++) {
		int a, b;
		cin >> a >> b;
		if (dir == 0) {
			cout << mxx - x + 1 << ' ';
			x = ++mxx;
		} else if (dir == 1) {
			cout << mxy - y + 1 << ' ';
			y = ++mxy;
		} else if (dir == 2) {
			cout << x - mnx + 1 << ' ';
			x = --mnx;
		} else {
			cout << y - mny + 1 << ' ';
			y = --mny;
		}
		dir = (dir + b + 4) % 4;
	}
	return 0;
}
```
{% endspoiler %}
