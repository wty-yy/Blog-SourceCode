---
title: CDQ 分治
hide: false
math: true
abbrlink: 44062
date: 2021-12-07 16:54:08
index_img:
banner_img:
category:
 - coding
 - algorithm
tags:
 - 分治
---

> 在oi时候曾经看过CDQ分治，但当时对于**偏序**这个概念的不理解（以为是什么高级东西），导致一直没有研究清楚CDQ分治，现在回头看CDQ分治，其实理解并没有那么的困难，下面通过举例来理解**偏序**这个概念，而不是死板的定义。

## 偏序关系

**偏序关系** 为一种二元关系（严格的定义可以看百度 [偏序关系](https://baike.baidu.com/item/%E5%81%8F%E5%BA%8F%E5%85%B3%E7%B3%BB/943166)，需要满足三条性质）（这里简单理解为：作用在两个元素上的符号，如实数域上 $\leqslant$、$\geqslant$、$<$、$>$），比如在整数环上的偏序关系： $1\leqslant 2$，$-1\leqslant 0$ 等等。


### n维偏序

$n$ 维向量（点）：$(a_1,a_2,\cdots, a_n)$，如果定义一个偏序关系**作用**的两个元素均为 $n$ 维向量，则称这个偏序关系为 $n$ 维偏序，两个向量满足 $n$ 维偏序当且仅当两个向量的每一维都满足某一个 $1$ 维偏序关系。

**注** ：这里理解为**作用**其实不严谨，因为关系并不会改变元素，严谨定义关系应该是定义在笛卡尔积上。

比如：如果当 $a_1 \leqslant b_1, a_2\leqslant b_2,\cdots,a_n\leqslant b_n$ 时（ $n$ 个 $1$ 维偏序关系），则 $(a_1,a_2,\cdots,a_n)\leqslant (b_1,b_2,\cdots,b_n)$，则 $\leqslant$ 就是一个 $n$ 维偏序。

再比如：**逆序对**其实就是一个 $2$ 维偏序关系，考虑一个数列 
$$a_1,a_2,\cdots, a_n$$
如果 $i < j$ 且 $a_i > a_j$，则称 $(a_i, a_j)$ 为一个逆序对。

我们给**逆序对**定义一个等价的偏序关系，设一个二维集合 $V = \{(i,  a_i):1\leqslant i\leqslant n\}$，定义偏序关系：若 $i < j$ 且 $a_i > a_j$ 时，则有 $(i, a_i) > (j, a_j)$。

### n维偏序问题

一个 $n$ 维集合 $V = \{(a_1,a_2,\cdots, a_n)\}$，设偏序关系 $\leqslant$ 是作用的两个元素均在 $V$ 中，问：$V$ 中有多少对点，满足该偏序关系？

## CDQ分治

CDQ分治的本质是分治算法（就是**分治排序**中使用的），CDQ分治揭示了这种算法可以运用到 $n$ 维偏序问题上面，对于 $n$ 维偏序问题，时间复杂度为 $O(N\log^{n-1}(N))$（其实最多就到 $4$ 维偏序问题了，因为在高维可能还不如 $O(n^2)$ 的暴力了）。

下面从低维再到高维。

### 二维偏序

求解逆序对问题，先对第一维 $i$ 进行排序，使其满足偏序关系（其实就是默认顺序，从小到大的），

然后用分治的方法求解，由于递归是先到最底层在回溯回来，这样可以保证每一次回溯时，
数组的**左边一半的第一维**对于数组的**右边一半的第一维**满足偏序关系（关键），

我们分别再对数组的左侧和右侧的第二维进行排序，利用**双指针**，分别指向数组的左边一半和右边一半，只需要寻找那些满足第二维偏序关系的点对个数即可，由于排序后有单调性，所以就可以线性完成了。

题目：[Luogu - P1908 逆序对](https://www.luogu.com.cn/problem/P1908)

复杂度 $O(Nlog^2N)$

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
const int N = 5e5 + 10;
int a[N];
int cdq(int *a, int n) {
	if (n == 1) {
		return 0;
	}
	int mid = n / 2, l = 0, r = mid;
	int ans = cdq(a, mid) + cdq(a+mid, n-mid);
	sort(a, a+mid), sort(a+mid, a+n);
	for (; l < mid; l++) {
		while (r < n && a[r] < a[l]) r++;
		ans += r - mid;
	}
	return ans;
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) cin >> a[i];
	cout << cdq(a, n) << '\n';
	return 0;
}
```
{% endspoiler %}


这样比普通分治求逆序对还慢了，由于我们用的分治算法，可以顺便排序，使用 `inplace_merge()` 即可将实现类似分治排序的合并，于是复杂度就可以降为 $O(N\log N)$


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
const int N = 5e5 + 10;
int a[N];
int cdq(int *a, int n) {
	if (n == 1) {
		return 0;
	}
	int mid = n / 2, l = 0, r = mid;
	int ans = cdq(a, mid) + cdq(a+mid, n-mid);
	for (; l < mid; l++) {
		while (r < n && a[r] < a[l]) r++;
		ans += r - mid;
	}
	inplace_merge(a, a + mid, a + n);
	return ans;
}
signed main(){
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	int n;
	cin >> n;
	for (int i = 0; i < n; i++) cin >> a[i];
	cout << cdq(a, n) << '\n';
	return 0;
}
```
{% endspoiler %}

### 三维偏序

类似于二维偏序的思路，三维偏序其实就是在保证了第二维有序的条件下，求第三维的满足偏序关系的个数，这里有两种方法求解

- 树状数组

- cdq套cdq（再加一个cdq）

题目：[Luogu - P3810 【模板】三维偏序（陌上花开）](https://www.luogu.com.cn/problem/P3810)

#### 树状数组

利用树状数组当前已有的元素中，小于等于自己的个数，将第三维的值作为树状数组的`key`，每次当左右指针的第二维满足条件后（第一维已经保证满足了），将左指针对应点的第三维加入到树状数组中，将所有满足的左指针都加入树状数组后，对右指针的第三维进行一次查询即可求出所有满足第三维偏序关系的点的个数了。

复杂度：$O(N\log^2 N)$

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
const int N = 2e5 + 10;
struct Node {
    int a, b, c, n, id;
    bool operator < (Node &y) {
        if (a != y.a) return a < y.a;
        else if (b != y.b) return b < y.b;
        else return c < y.c;
    }
    bool operator == (Node &y) {
        return (a == y.a && b == y.b && c == y.c);
    }
} A[N];
int n, m;
bool cmp(const Node &x, const Node &y) {
    return x.b < y.b;
}
int ans[N], t[N], cnt[N];
void update(int p, int x) {for (; p <= m; p += p & (-p)) t[p] += x;}
int query(int p) {int ret = 0; for (; p; p -= p & (-p)) ret += t[p]; return ret;}
void cdq(Node *A, int n) {
    if (n == 1) {
        ans[A[0].id] += A[0].n - 1;
        return;
    }
    int mid = n / 2, l = 0, r = mid;
    cdq(A, mid), cdq(A + mid, n - mid);
    for (; r < n; r++) {
        while (A[l].b <= A[r].b && l < mid) {
            update(A[l].c, A[l].n);
            l++;
        }
        ans[A[r].id] += query(A[r].c);
    }
    for (int i = 0; i < l; i++)
        update(A[i].c, -A[i].n);
	inplace_merge(A, A + mid, A + n, cmp);
}
signed main() {
#ifdef _DEBUG
    //  FILE *file = freopen("out", "w", stdout);
#endif
    ios::sync_with_stdio(0);
    cin.tie(0);
    cin >> n >> m;
    for (int i = 0; i < n; i++) {
        cin >> A[i].a >> A[i].b >> A[i].c;
        A[i].id = i;
    }
    sort(A, A + n);
    int tot = 0;
    for (int j = 0; j < n;) {
        A[tot] = A[j];
        while (A[tot] == A[j] && j < n) {
            j++;
            A[tot].n++;
        }
        A[tot].id = tot;
        tot++;
    }
    cdq(A, tot);
    for (int i = 0; i < tot; i++) cnt[ans[A[i].id]] += A[i].n;
    for (int i = 0; i < n; i++) cout << cnt[i] << '\n';
    return 0;
}
```
{% endspoiler %}

#### cdq套cdq

考虑能否将前两维问题化为一维，或者将第一维用一个标记表示，就可以再转换为二维偏序问题，用cdq求解，其实是可以用后者来实现的。

对于第一维，当前数组的左右两边的所有点都保证了第一维是满足偏序关系的，所以将所有左半边的点都加上`L`标号，右半边的点都加上`R`标号，然后再对第二维整体进行排序，接下来就是第二维和第三维的一个**二维偏序**问题了，注意求解的点对还要保证左指针有`L`标号，右指针有`R`标号。

**注** ：这里可以第一个到第二个cdq的时候，需要新开一个数组，因为第二个cdq排序，可能会导致第一个cdq某一边的单调性错乱，当然在第一个cdq中直接使用`stable_sort`更简单，这里要使用`stable_sort`是为了避免第一维原本的顺序错乱，也就是避免对于相同的第二维`L`标号跑到`R`标号右边去了。

复杂度：$O(N\log^2 N)$

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
const int N = 2e5 + 10;
struct Node {
	int a, b, c, n, id;
	bool fg; // fg就是左右标号，L记为0，R记为1
	bool operator < (Node &y) {
		if (a != y.a) return a < y.a;
		else if (b != y.b) return b < y.b;
		else return c < y.c;
	}
	bool operator == (Node &y) {
		return (a == y.a && b == y.b && c == y.c);
	}
} A[N], B[N];
int n, m;
bool cmp2(const Node &x, const Node &y) {return x.b < y.b;}
bool cmp3(const Node &x, const Node &y) {return x.c < y.c;}
int ans[N], cnt[N];
void cdq2(Node *A, int n) {
	if (n == 1) return;
	int mid = n/2, l = 0, r = mid, k = 0, cnt = 0;
	cdq2(A, mid), cdq2(A + mid, n - mid);
	for (; r < n; r++) {
		while (A[l].c <= A[r].c && l < mid) {
			cnt += A[l].n * (A[l].fg ^ 1);
			l++;
		}
		ans[A[r].id] += cnt * A[r].fg;
	}
	inplace_merge(A, A + mid, A + n, cmp3);
}
void cdq(Node *A, int n) {
	if (n == 1) {
		ans[A[0].id] += A[0].n - 1;
		return;
	}
	int mid = n/2;
	cdq(A, mid), cdq(A + mid, n - mid);
	for (int i = 0; i < n; i++) {
		B[i] = A[i];
		B[i].fg = (i >= mid);
	}
	inplace_merge(B, B + mid, B + n, cmp2);
	cdq2(B, n);
	inplace_merge(A, A + mid, A + n, cmp2);
//或者
/*
	for (int i = 0; i < n; i++) A[i].fg = (i >= mid);
	stable_sort(A, A + n, cmp2);
	cdq2(A, n);
*/
}
signed main() {
#ifdef _DEBUG
//	FILE *file = freopen("out", "w", stdout);
#endif
	ios::sync_with_stdio(0);
	cin.tie(0);
	cin >> n >> m;
	for (int i = 0; i < n; i++) {
		cin >> A[i].a >> A[i].b >> A[i].c;
		A[i].id = i;
	}
	sort(A, A + n);
	int tot = 0;
	for (int j = 0; j < n;) {
		A[tot] = A[j];
		while (A[tot] == A[j] && j < n) {
			j++;
			A[tot].n++;
		}
		A[tot].id = tot;
		tot++;
	}
	cdq(A, tot);
	for (int i = 0; i < tot; i++) cnt[ans[A[i].id]] += A[i].n;
	for (int i = 0; i < n; i++) cout << cnt[i] << '\n';
	return 0;
}
```
{% endspoiler %}

由cdq套cdq可以延拓出 $n$ 维偏序，复杂度 $O(N\log^{n-1}N)$

### 四维偏序

题目：[HDU - 5126 stars](https://acm.dingbacode.com/showproblem.php?pid=5126)

将星星出现的时间作为第一维，坐标作为二三四维，每次观察的三维区间可以用三维前缀和表示（容斥原理，拆成 $8$ 个节点），注意观察的点不作为星星计入，所以左边数组可以少一些点，也就是`B`数组的作用体现出来了。

复杂度 $O(N\log^3N)$

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
const int N = 4e5 + 10;
struct Node {
    int a, b, c, d, id, f;
    Node(){}
    Node(int a, int b, int c, int d, int id, int f = 0): a(a), b(b), c(c), d(d), id(id), f(f){}
} A[N], B[N];
bool cmp1(const Node &x, const Node &y) {return x.b < y.b;}
bool cmp2(const Node &x, const Node &y) {return x.c < y.c;}
int ans[N], t[N], tot, hsh[N];
void update(int p, int x) {for (; p <= tot; p += p&(-p)) t[p] += x;}
int query(int p) {int ret = 0; for (; p; p -= p&(-p)) ret += t[p]; return ret;}
void cdq2(Node *A, int n) {
    if (n <= 1) return;
    int mid = n / 2, l = 0, r = mid;
    cdq2(A, mid), cdq2(A + mid, n - mid);
    for (; r < n; r++) {
        while (l < mid && A[l].c <= A[r].c) {
            update(A[l].d, (A[l].f == 0));
            l++;
        }
        ans[A[r].id] += query(A[r].d) * A[r].f;
    }
    for (int i = 0; i < l; i++) update(A[i].d, -(A[i].f == 0));
    inplace_merge(A, A + mid, A + n, cmp2);
}
void cdq(Node *A, int n) {
    if (n <= 1) return;
    int mid = n / 2, k = 0, bmid = 0;
    cdq(A, mid), cdq(A + mid, n - mid);
    for (int i = 0; i < n; i++) {
        if ((i < mid && !A[i].f) || (i >= mid && A[i].f)) B[k++] = A[i];
        if (i == mid-1) bmid = k;
    }
    inplace_merge(B, B + bmid, B + k, cmp1);
    cdq2(B, k);
    inplace_merge(A, A + mid, A + n, cmp1);
}
signed main(){
#ifdef _DEBUG
    freopen("in", "r", stdin);
    //FILE *file = freopen("out", "w", stdout);
#endif
    int T;
    scanf("%d", &T);
    while (T--) {
        int Q, n = 0, m = 0;
        scanf("%d", &Q);
        for (int i = 0; i < Q; i++) {
            int f, x, y, z, a, b, c;
            scanf("%d %d %d %d", &f, &x, &y, &z);
            if (f == 1) {
                A[n++] = Node(i, x, y, z, 0);
                hsh[tot++] = z;
            } else {
                scanf("%d %d %d", &a, &b, &c);
                x--, y--, z--;
                A[n++] = Node(i, a, b, c, m, 1);
                A[n++] = Node(i, x, b, c, m, -1);
                A[n++] = Node(i, a, y, c, m, -1);
                A[n++] = Node(i, a, b, z, m, -1);
                A[n++] = Node(i, x, y, c, m, 1);
                A[n++] = Node(i, a, y, z, m, 1);
                A[n++] = Node(i, x, b, z, m, 1);
                A[n++] = Node(i, x, y, z, m, -1);
                hsh[tot++] = c, hsh[tot++] = z;
                m++;
            }
        }
        sort(hsh, hsh + tot);
        tot = unique(hsh, hsh + tot) - hsh;
        for (int i = 0; i < n; i++) A[i].d = lower_bound(hsh, hsh + tot, A[i].d) - hsh + 1;
        for (int i = 0; i < m; i++) ans[i] = 0;
        cdq(A, n);
        for (int i = 0; i < m; i++) cout << ans[i] << '\n';
    }
    return 0;
}
```
{% endspoiler %}
