---
title: 算法总结
math: true
abbrlink: 57899
date: 2021-07-27 15:09:27
category:
 - coding
 - algorithm
tags:
---

该总结分为两部分，第一部分为博客中的[算法题目分类](./#算法题目分类)，第二部分为一些[经典算法](./#经典算法)。

## 算法题目分类

### 题型分类

#### 暴力题
1. [CF1554 B. Cobb](/posts/18831/#b-cobb)

#### 贪心
1. [CF1809 D. Binary String Sorting](/posts/50571/)
2. [CF1566 D. Seating Arrangements](/posts/13476/#d-seating-arrangements)
3. [CF1567 D. Expression Evaluation Error](/posts/29690/#d-expression-evaluation-error)
4. [CF1586 C. Omkar and Determination](/posts/49235/#c-omkar-and-determination)

#### 动态规划
1. [CF1515 E. Phoenix and Computers](/posts/39644/)
2. [CF1557 D. Ezzat and Grid](/posts/18657/#d-ezzat-and-grid)
3. [CF1559 E. Mocha and Stars](/posts/18847/)
4. [CF1614 D1. Divan and Kostomuksha (easy version)](/posts/63615/#d1-divan-and-kostomuksha-easy-version)
5. [CF1793 F. Rebrending](/posts/39924/#f-rebrending)

#### 组合数学
1. [CF1515 E. Phoenix and Computers](/posts/39644/)
2. [CF1549 E. The Three Little Pigs](/posts/7247/#e-the-three-little-pigs)
3. [CF1569 C. Jury Meeting](/posts/8305/#c-jury-meeting)

#### 数论
1. [CF1549 D. Integers Have Friends](/posts/7247/#d-integers-have-friends)
2. [CF1559 E. Mocha and Stars](/posts/18847/)
3. [CF1561 D. Up the Strip](/posts/25882/#d-up-the-strip)
4. [CF1614 D1. Divan and Kostomuksha (easy version)](/posts/63615/#d1-divan-and-kostomuksha-easy-version)

#### 计算几何
1. [CF1549 F1. Gregor and the Odd Cows (Easy)](/posts/7247/#f1-gregor-and-the-odd-cows-easy)

#### 位运算
1. [CF1451 E. Bitwise Queries](/posts/16773/)
2. [CF1554 C. Mikasa](/posts/18831/#c-mikasa)
3. [CF1556 D. Take a Guess](/posts/23754/#d-take-a-guess)
4. [CF1614 C. Divan and bitwise operations](/posts/63615/#c-divan-and-bitwise-operations)

#### 构造题
1. [CF1549 E. The Three Little Pigs](/posts/7247/#e-the-three-little-pigs)
2. [CF1554 D. Diane](/posts/18831/#d-diane)
3. [CF1559 D2. Mocha and Diana (Hard Version)](/posts/8910/)
4. [CF1561 E. Bottom-Tier Reversals](/posts/25882/#e-bottom-tier-reversals)
5. [CF1562 C. Rings](/posts/3451/#c-rings)
6. [CF1566 E. Buds Re-hanging](/posts/13476/#e-buds-re-hanging)
7. [CF1567 C. Carrying Conundrum](/posts/29690/#c-carrying-conundrum)
8. [CF1586 B. Omkar and Heavenly Tree](/posts/49235/#b-omkar-and-heavenly-tree)
9. [ARC159 C. Permutation Addition](/posts/35891/#c-permutation-addition)

#### 图论
1. [CF1552 D. Array Differentiation](/posts/54761/#d)
2. [CF1559 D2. Mocha and Diana (Hard Version)](/posts/8910/)
3. [CF1566 E. Buds Re-hanging](/posts/13476/#e-buds-re-hanging)
4. [CF1586 E. Moment of Bloom](/posts/49235/#e-moment-of-bloom)

#### 字符串
1. [CF1562 D. Two Hundred Twenty One](/posts/3451/#d-two-hundred-twenty-one)
2. [CF1562 E. Rescue Niwen!](/posts/3451/#e-rescue-niwen)

#### 交互题
1. [CF1451 E. Bitwise Queries](/posts/16773/)
2. [CF1586 D. Omkar and the Meaning of Life](/posts/49235/#d-omkar-and-the-meaning-of-life)

#### 模拟题
1. [CF1567 D. Expression Evaluation Error](/posts/29690/#d-expression-evaluation-error)
2. [CF1569 D. Inconvenient Pairs](/posts/8305/#d-inconvenient-pairs)

### 具体算法分类

#### 线段树
1. [CF1555 E. Boring Segments](/posts/13627/)
2. [CF1557 D. Ezzat and Grid](/posts/18657/#d-ezzat-and-grid)
3. [CF1567 E. Non-Decreasing Dilemma](/posts/29690/#d-expression-evaluation-error)
4. [CF1793 F. Rebrending](/posts/39924/#f-rebrending)

#### RMQ（区间最值）
1. [CF1549 D. Integers Have Friends](/posts/7247/#d-integers-have-friends)
2. [CF1556 E. Equilibrium](/posts/23754/#e-equilibrium)

#### 并查集
1. [CF1559 D2. Mocha and Diana (Hard Version)](/posts/8910/)

#### Mobius反演
1. [CF1559 E. Mocha and Stars](/posts/18847/)

#### 双指针
1. [CF1555 E. Boring Segments](/posts/13627/)

#### 模拟退火
1. [CF1556 H. DIY Tree](/posts/23754/#h-diy-tree)

## 经典算法

#### 并查集 Union_Find
```cpp
int fa[N];
int getfa(int x) {
    if (fa[x] == x) return x;
    fa[x] = getfa(fa[x]);
    return fa[x];
}
```
#### 生成树 Kruskal
```cpp
struct Edge{int u, v, w;} e[M];
bool cmp(Edge a, Edge b) {return a.w > b.w;}
int tot;
void kruskal() {
    sort(e + 1, e + 1 + tot, cmp);
    for (int i = 1; i <= tot; i++) {
        int u = e[i].u, v = e[i].v;
        double w = e[i].w;
        if (w < 10 || w > 1000) continue;
        if (getfa(u) != getfa(v)) {
            ans += w * 100;
            fa[getfa(u)] = getfa(v);
        }
    }
}
```
### LCA
#### 倍增
```cpp
//1<<18 = 262144
//1<<19 = 524288
//如果总的点数为1e6就选择19就好了
//1<<20 = 1048576
int dep[N], pos[N][20];
inline void dfs(int u, int fa) {
    for (int i = 1; i <= 18; i++) {
        if (dep[u] < (1 << i)) break;
        pos[u][i] = pos[pos[u][i - 1]][i - 1];
    }
    for (int i = head[u]; i; i = e[i].nt) {
        int v = e[i].b;
        if (v == fa) continue;
        pos[v][0] = u;
        dep[v] = dep[u] + 1;
        dfs(v, u);
    }
}
int lca(int x, int y) {
    if (dep[x] < dep[y]) swap(x, y);
    int t = dep[x] - dep[y];
    for (int i = 0; i <= 18 && t; i++, t >>= 1) if (t & 1) x = pos[x][i];
    if (x == y) return x;
    for (int i = 18; i >= 0; i--) {
        if (pos[x][i] != pos[y][i]) {
            x = pos[x][i];
            y = pos[y][i];
        }
    }
    return pos[x][0];
}
```
#### 树链剖分
详细树链剖分代码在[下文](./#树链剖分-2)

通过跳转重链的顶端，最终在一条链上的时候，位于dep小的节点就是LCA
### ST表-RMQ
```cpp
//与倍增原理相似，只需要把点权左移就好了
int n, mx[N][16], lg[N];
void query(int x, int y) {
    --x; //所有的点权向左释放到边权上，所以x左移一个
    int t = lg[y - x]; x += (1 << t);
    printf("%d\n", max(mx[x][t], mx[y][t])); //利用并集O(1)求解

}
void make_ST() {
    read(n);
    for (int i = 1; i <= n; i++) {
        lg[i] = lg[i - 1] + (1 << (lg[i - 1] + 1) == i); //预处理,log2(i)向下取整
        read(mx[i][0]);
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= 15; j++) {
            if (i < (1 << j)) break;
            mx[i][j] = max(mx[i][j - 1], mx[i - (1 << (j - 1))][j - 1]);
        }
    }
}
```
### 树状数组
#### 基础
```cpp
int c[N];
void update(int x, int t) {
    for (; x <= n; x += x & (-x)) c[x] += t;
}
int query(int x) {
    int ret = 0;
    for (; x; x -= x & (-x)) ret += c[x];
    return ret;
}
```
#### 求逆序对
```cpp
///hsh[]为离散后的对应的编号
int inversion() {
	for (int i = 1; i <= n; i++) {
		update(hsh[i], 1);
		ans += i - query(hsh[i]);
	} 
}
```
#### 区间修改-区间查询(差分)

令A[]为原数组c1[]为差分数组 $c1[i]=A[i]-A[i-1](A[0]=0)$ ，所以 $A[j]=\sum\limits_{i=1}^jc1[i]$ ，对c1查询能很容易做到单点查询，修改区间[l,r]只需将$c1[l]+1,c1[r+1]-1$就行。

区间查询（统计下每个$c1[j]$出现了多少次）$\sum\limits_{i=1}^{p}\sum\limits_{j=1}^ic1[j]=c1[1]\cdot p+c1[2]\cdot (p-1)+c1[3]\cdot (p-2)\cdots\cdots=\sum\limits_{i=1}^pc1[i]\cdot (p-i+1)$

$=\sum\limits_{i=1}^pc1[i]\cdot (p+1)-\sum\limits_{i=1}^pc1[i]\cdot i$由于$(p+1)$为常数，只需要维护$c1[i]$和$c2[i]=c1[i]\cdot i$的树状数组即可

```cpp
void update(int x, int t) {
    for (int i = x; i <= n; i += i & (-i)) c1[i] += t, c2[i] += t * x;
}
int query(int x) {
    int ret = 0;
    for (int i = x; i; i -= i & (-i)) ret += c1[i] * (x + 1) - c2[i];
    return ret;
}
void build() {
    int mem = 0;
    for (int i = 1; i <= n; i++) update(i, val[i] - mem), mem = val[i];
}
//更新区间[l,r]
update(l, k); update(r + 1, -k);
//求区间和[l,r]
query(r) - query(l - 1)
```

### 二维树状数组
#### 单点修改，区间查询

query(x,y)能求出左上角为(1,1)右下角为(x,y)矩形内数值之和，记为$sum[x][y]$

```cpp
void update(int x, int y, int t) {
    for (int i = x; i <= n; i += i & (-i))
    for (int j = y; j <= m; j += j & (-j))
        c[i][j] += t;
}
int query(int x, int y) {
    int ret = 0;
    for (int i = x; i; i -= i & (-i))
    for (int j = y; j; j -= j & (-j))
        ret += c[i][j];
    return ret;
}
(a,b)为左上角(c,d)为右下角，ans=query(c,d)-query(a-1,d)-query(c,b-1)+query(a-1,b-1)
```
#### 区间修改，单点查询（差分）
令A为原数组，c为差分数组，直接求解$sum[x][y]=sum[x-1][y]+sum[x][y-1]-sum[x-1][y-1]+A[x][y]$

若要使$\sum\limits_{i=1}^x\sum\limits_{j=1}^yc[i][j]=A[x][y]​$则$c[x][y]=A[x][y]-(A[x-1][y]+A[x][y-1]-A[x-1][y-1])​$

所以$\sum\limits_{i=1}^x\sum\limits_{j=1}^yc[i][j]=sum[x][y]-(sum[x-1][y]+sum[x][y-1]-sum[x-1][y-1])=A[x][y]$
```cpp
区间修改方法
初始时
0	0	0	0
0	0	0	0
0	0	0	0
0	0	0	0
差分数组修改方法
0	0	0	0
0	k	0  -k
0	0	0	0
0  -k   0   k
原数组变化效果
0	0	0	0
0	k	k	0
0	k	k	0
0	0	0	0
左上角为(x,y)右下角为(a,b)的矩形区域都加上k
update(x, y, k);
update(x, b + 1, -k);
update(a + 1, y, -k);
update(a + 1, b + 1, k);
```
#### 区间修改，区间查询
和查询一维区间一样，$sum[x][y]=\sum\limits_{k=1}^x\sum\limits_{h=1}^y\sum\limits_{i=1}^k\sum\limits_{j=1}^hc[i][j]$，和一维一样，可以统计一下每个$c[i][j]$各出现了多少次

$=c[1][1]\cdot xy+c[1][2]\cdot x(y-1)+c[1][3]\cdot x(y-2)\cdots+c[2][1]\cdot (x-1)y+c[3][1]\cdot (x-2)y\cdots$

$=\sum\limits_{i=1}^x\sum\limits_{j=1}^yc[i][j]\cdot (x-i+1)(y-j+1)=\sum\limits_{i=1}^x\sum\limits_{j=1}^yc[i][j]\cdot ((x+1)(y+1)-i(y+1)-j(x+1)+ij)$

所以需要维护四个树状数组分别是$c1[i][j]=c[i][j],c2[i][j]=c[i][j]\cdot i,c3[i][j]=c[i][j]\cdot j,c4[i][j]=c[i][j]\cdot ij$
```cpp
void update(int x, int y, int t) {
    for (int i = x; i <= n; i += i & (-i))
    for (int j = y; j <= m; j += j & (-j)) {
        c1[i][j] += t;
        c2[i][j] += t * x;
        c3[i][j] += t * y;
        c4[i][j] += t * x * y;
    }
}
int query(int x, int y) {
    int ret = 0;
    for (int i = x; i; i -= i & (-i))
    for (int j = y; j; j -= j & (-j))
        ret += c1[i][j] * (x + 1) * (y + 1) - c2[i][j] * (y + 1) - c3[i][j] * (x + 1) + c4[i][j];
    return ret;
}
//更新和查询方法和上述两篇代码一样
```

### 线段树

#### 基础
```cpp
//以区间加，区间查询为例
struct node {int l, r, tag, sum;}c[N*8];
void build(int p, int l, int r) {
	//重置新开的点
    c[p].l = l, c[p].r = r;
    c[p].sum = 0, c[p].tag = 0;
    if (l == r) {read(c[p].sum); return;}
    int m = (l + r) >> 1;
    build(p << 1, l, m);
    build(p << 1 | 1, m + 1, r);
    //标记上传
    pushup(p);
}
void add(int p, int l, int r, int k) {
    if (c[p].l == l && c[p].r == r) {
    	//更新该区间
        c[p].sum += (r - l + 1) * k;
        c[p].tag += k;
        return;
    }
    //标记下移
    pushdown(p);
    //分区段讨论
    int m = (c[p].l + c[p].r) >> 1;
    if (r <= m) add(p << 1, l, r, k);
    else if (l > m) add(p << 1 | 1, l, r, k);
    else {
        add(p << 1, l, m, k);
        add(p << 1 | 1, m + 1, r, k);
    }
    pushup(p);
}
//此处还有一种不用讨论的写法
void add(int p, int l, int r, int k) {
    int L = c[p].l, R = c[p].r;
    if (L > r || R < l) return;//在此处进行判断目标区间是否超出当前节点的区间范围
    if (L >= l && R <= r) {
        c[p].sum += (R - L + 1) * k;
        c[p].addv += k;
        return;
    }
    pushdown(p);
    add(p << 1, l, r, k);
    add(p << 1 | 1, l, r, k);
    pushup(p);
}
//还可以这样写
void add(int p, int l, int r, int k) {
    int L = c[p].l, R = c[p].r;
    if (L >= l && R <= r) {
        c[p].sum += (R - L + 1) * k;
        c[p].addv += k;
        return;
    }
    pushdown(p);
    int m = (c[p].l + c[p].r) >> 1;
    if (l <= m) add(p << 1, l, r, k);//这说明左儿子中一定有目标区间的一部分
    if (r > m) add(p << 1 | 1, l, r, k);//同理这说明右儿子中有目标区间的一部分
    pushup(p);
}
int query(int p, int l, int r) {
    if (c[p].l == l && c[p].r == r) return c[p].sum;
    pushdown(p);
    int m = (c[p].l + c[p].r) >> 1;
    if (r <= m) return query(p << 1, l, r);
    else if (l > m) return query(p << 1 | 1, l, r);
    else return query(p << 1, l, m) + query(p << 1 | 1, m + 1, r);
}
```
#### 非递归线段树
```cpp
/*
* File    : segment_tree.cpp
* Time    : 2023/03/17 11:02:11
* Author  : wty-yy
* Version : 1.0
* Blog    : https://wty-yy.space/
* Desc    : efficient segment tree, [模板]线段树 1: https://www.luogu.com.cn/problem/P3372
            懒标记非递归线段树，支持区间修改，区间求和.
*/
#include <iostream>
#include <algorithm>
#include <cstring>
#include <math.h>
#include <vector>
#include <map>
#define ll long long
#define vi vector<int>
#define vii vector<vi>
#define pii pair<int, int>
#define vip vi<pii>
#define mkp make_pair
#define pb push_back
using namespace std;

const int N = 1e5;

class lazy_segment{
public:
    int n, h;
    ll t[N<<1], lazy[N];
    lazy_segment(int n):n(n) {
        memset(t, 0, sizeof(t));
        memset(lazy, 0, sizeof(lazy));
        h = sizeof(int) * 8 - __builtin_clz(n);
    }

    void calc(int p, int k) {  // pushup更新父节点
        t[p] = t[p<<1] + t[p<<1|1] + k * lazy[p];
    }

    void apply(int p, ll value, int k) {  // pushdown中下传懒标记
        t[p] += value * k;
        if (p < n) lazy[p] += value;
    }

    void build(int l, int r) {  // pushup区间[l,r)
        int k = 2;
        for (l += n, r += n-1; l > 1; k <<= 1) {
            l >>= 1, r >>= 1;
            for (int i = r; i >= l; i--) calc(i, k);
        }
    }

    void push(int l, int r) {  // pushdown区间[l,r)
        int s = h, k = 1 << (h-1);
        for (l += n, r += n-1; s > 0; --s, k >>= 1) {
            for (int i = l >> s; i <= r >> s; ++i) {
                if (lazy[i] != 0) {
                    apply(i<<1, lazy[i], k);
                    apply(i<<1|1, lazy[i], k);
                    lazy[i] = 0;
                }
            }
        }
    }

    void modify(int l, int r, ll value) {  // 区间[l,r)同时增加value
        push(l, l + 1);
        push(r - 1, r);
        int l0 = l, r0 = r, k = 1;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1, k <<= 1) {
            if (l&1) apply(l++, value, k);
            if (r&1) apply(--r, value, k);
        }
        build(l0, l0 + 1);
        build(r0 - 1, r0);
    }

    ll query(int l, int r) {  // 区间[l,r)求和
        push(l, l + 1);
        push(r - 1, r);
        ll ret = 0;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l&1) ret += t[l++];
            if (r&1) ret += t[--r];
        }
        return ret;
    }

    void print() {  // 输出全部数组
        for (int i = 0; i < n << 1; i++) cout << t[i] << ' ';
        cout << '\n';
    }
};

signed main() {
    cin.tie(0);
    ios::sync_with_stdio(0);
    int n, m;
    cin >> n >> m;
    lazy_segment seg(n);
    for (int i = 0; i < n; i++) cin >> seg.t[n + i];
    seg.build(0, n);
    while (m--) {
        int opt, x, y;
        ll value;
        cin >> opt >> x >> y;
        if (opt == 1) {
            cin >> value;
            seg.modify(x-1, y, value);
        } else cout << seg.query(x-1, y) << '\n';
    }
    return 0;
}
```
#### 可持久化线段树（主席树）
求数列某一区间的第k大/小值，先进行离散化，再对数列从左往右依次向线段树中插入数值，每个点对应一个线段树，利用动态开点线段树将优化内存，求某个[l,r]中间数值的树就是用第r个减去第l-1个线段树就是他们中间的值。图解：<https://blog.csdn.net/bestFy/article/details/78650360>
```cpp
int build(int l, int r) {
    int p = ++cnt; c[p].sum = 0;
    if (l < r) {
        c[p].l = build(l, mid);
        c[p].r = build(mid + 1, r);
    }
    return p;
}
int update(int pre, int l, int r, int x) {
    int p = ++cnt;
    c[p].l = c[pre].l, c[p].r = c[pre].r, c[p].sum = c[pre].sum + 1;
    if (l < r) {
        if (x <= mid) c[p].l = update(c[pre].l, l, mid, x);
        else c[p].r = update(c[pre].r, mid + 1, r, x);
    }
    return p;
}
int query(int u, int v, int l, int r, int k) {
    if (l == r) return l;
    int x = c[c[v].l].sum - c[c[u].l].sum;
    if (x >= k) return query(c[u].l, c[v].l, l, mid, k);
    else return query(c[u].r, c[v].r, mid + 1, r, k - x);
}
T[0] = build(1, tot);//tot为离散后的元素个数
for (int i = 1; i <= m; i++) T[i] = update(T[i - 1], 1, tot, hsh[i]);
ans = A[query(T[l - 1], T[r], 1, tot, k)].w;//query求出的是离散后的编号，还要对应回原数值
```
#### 扫描线
##### 求面积并
思路：https://blog.csdn.net/xianpingping/article/details/83032798

注意：内存的计算，有N个矩形，则横坐标的值最多可能有2N个，所以线段树开8N，还注意pushup()操作中，叶子节点可能会导致越界访问。
```cpp
const int N = 1e5 + 10;
int n, ans;
int H[N << 1], tot;
struct Node {int l, r, h, fg;} A[N << 1];
bool cmp(Node a, Node b) {return a.h < b.h;}
struct Tree{int l, r, sum, len;};
struct Seg {
    Tree c[N << 3];
    void pushup(int p) {
        if (c[p].sum) c[p].len = H[c[p].r + 1] - H[c[p].l];
        else if (c[p].l == c[p].r) c[p].len = 0;
        //如果p为叶子节点，那么p最大可能是8N(2N*4)。如果再*2的话，就会导致越界访问
        else c[p].len = c[p << 1].len + c[p << 1 | 1].len;
    }
    void build(int p, int l, int r) {
        c[p].l = l, c[p].r = r, c[p].sum = c[p].len = 0;
        if (l == r) return;
        build(p << 1, l, mid);
        build(p << 1 | 1, mid + 1, r);
    }
    void add(int p, int l, int r, int k) {
        int ll = c[p].l, rr = c[p].r;
        if (r >= rr && l <= ll) {
            c[p].sum += k;
            pushup(p);
            return;
        }
        if (l <= mid) add(p << 1, l, r, k);
        if (r > mid) add(p << 1 | 1, l, r, k);
        pushup(p);
    }
}seg;
signed main() {
    read(n);
    for (int i = 1; i <= n; i++) {
        int x1, y1, x2, y2; read(x1), read(y1), read(x2), read(y2);
        A[i * 2 - 1] = (Node){x1, x2, y1, 1};
        A[i * 2] = (Node){x1, x2, y2, -1};
        H[i * 2 - 1] = x1, H[i * 2] = x2;
    }
    n <<= 1;
    sort(H + 1, H + n + 1);
    sort(A + 1, A + n + 1, cmp);
    tot = unique(H + 1, H + n + 1) - H - 1;
    seg.build(1, 1, tot - 1);
    for (int i = 1; i < n; i++) {
    	int l = lower_bound(H + 1, H + 1 + tot, A[i].l) - H;
    	//线段树中区间[l,r]代表的实际区间为[H[l],H[r+1]]，所以此处r要-1
    	int r = lower_bound(H + 1, H + 1 + tot, A[i].r) - H - 1;
        //不用加入第n条扫描线，因为第n条扫描线上方没有面积了
        seg.add(1, l, r, A[i].fg);
        ans += seg.c[1].len * (A[i + 1].h - A[i].h);
    }
    printf("%lld", ans);
    return 0;
}
```
### 最短路
#### dijkstra
解决非负权图的最短路，贪心思路，从每次从距离出发点最近的点向外延伸，更新其他点的距离，直到所有点都被访问过
```cpp
struct Node {
    int id, dis;
    Node(int id, int dis) {this->id = id, this->dis = dis;}
    friend bool operator < (Node a, Node b) {return a.dis > b.dis;}
};
priority_queue<Node> q;
int dis[N];
bool vis[N];
void dijkstra(int st) {
    for (int i = 1; i <= n; i++) dis[i] = MAX;
    dis[st] = 0;
    q.push(Node(st, 0));
    while (!q.empty()) {
        Node t = q.top(); q.pop();
        int u = t.id;
        if (vis[u]) continue;
        vis[u] = 1;
        for (int i = head[u]; i; i = e[i].nt) {
            int v = e[i].b, w = e[i].w;
            if (dis[v] - dis[u] > w) {
                dis[v] = dis[u] + w;
                q.push(Node(v, dis[v]));
            }
        }
    }
}
```
#### SPFA
与dijkstra不同的是，spfa用的是普通队列，每个点可能进入队列多次，vis数组用于记录该点是否在队列之中，其他大致一样。
```cpp
struct Node {
    int id, dis;
    Node(int id, int dis) {this->id = id, this->dis = dis;}
};
queue<Node> q;
int dis[N];
bool vis[N];
void spfa(int st) {
    for (int i = 1; i <= n; i++) dis[i] = MAX;
    dis[st] = 0;
    q.push(Node(st, 0));
    while (!q.empty()) {
        Node t = q.front(); q.pop();
        int u = t.id;
        vis[u] = 0;//从队列中弹出
        for (int i = head[u]; i; i = e[i].nt) {
            int v = e[i].b, w = e[i].w;
            if (dis[v] - dis[u] > w) {
                dis[v] = dis[u] + w;
                if (!vis[v]) {//如果不在队列中
                    vis[v] = 1;
                    q.push(Node(v, dis[v]));
                }
            }
        }
    }
}
```
#### Floyd
用于计算完全图中任意两点间的距离，复杂度$O(n^3)$，利用中间点k来作为$i，j$两个点距离的桥梁$dis[i][j]=min(dis[i][k]+dis[k][j])$
对k的理解：如果k=1时只用了编号为1的点作为中转，如果k=2时则用了1,2两个点作为中转……其实就是：从i号点到j号点只经过前k号点的最短路径
练习：[P1119 灾后重建](https://www.luogu.com.cn/problem/P1119)
```cpp
int dis[N][N];
void reset() {
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (i == j) dis[i][j] = 0;
            else dis[i][j] = INF;    
}
void floyd() {
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                Min(dis[i][j], dis[i][k] + dis[k][j]);
}
```
#### K短路
##### A*算法
在BFS搜索中，第一次到达终点的是最短路径，那么第k次到达终点的就是k短路了。

如果直接暴力BFS，搜索范围非常大，要通过剪枝处理。因此使用启发式函数f（预估最有希望到达终点的点），$f=x+h$（x为当前点实际走的距离，h为从当前点到达终点预估的距离），每次使用f值最小的点就可做到剪枝的效果了。

如何求出h呢？用预处理的方法，通过反向建图，从终点反向跑出到每个点的最短路（dis数组）这个就是h。

下一步只需要将**起点到当前点的距离与当前点到终点的最短距离的和**作为关键字放入优先队列中，这样每次弹出的就是最有希望到达终点的那个点。

https://blog.csdn.net/qq_40772692/article/details/82530467

https://www.cnblogs.com/Paul-Guderian/p/6812255.html

```cpp
struct Kth {
    int id, use;
    Kth(int id, int use) {this->id = id, this->use = use;}
    friend bool operator < (Kth a, Kth b) {return a.use + dis[a.id] > b.use + dis[b.id];}
};
int bfs(int st, int en, int k) {
    priority_queue<Kth> q;
    q.push(Kth(st, 0));
    while (!q.empty()) {
        Kth t = q.top(); q.pop();
        int u = t.id;
        if (u == en) if (--k == 0) return t.use;
        for (int i = head[u]; i; i = e[i].nt) {
            int v = e[i].b, w = e[i].w;
            q.push(Kth(v, t.use + w));
        }
    }
    return -1;
}
//用spfa跑反向最短路比dijkstra使用的空间小很多
```
### Tarjan算法
#### 定义
**强联通**：在一个有向图中，任意两个点可以互相到达。

**割点集合**：在一个无向图中，如果一个顶点集合$V​$，删除顶点集合$V​$以及$V​$中顶点相连的所有边后，原图不再连通，此点集$V​$称为割点集合。

**点连通度**：在一个无向图中，最小割点集合中的顶点数。

**割边集合**：在一个无向图中，如何一个边集合，删除这个边集合后，原图不再连通，这个集合就是割边集合。

**边连通度**：在一个无向图中，最小割边集合中的边数。

**双连通图**：一个无向图中，点连通度大于1，则该图是点双连通，边连通度大于1，则该图是边双连通，它们都被简称为双连通或重连通（即删去任意一点后原图仍然连通），但不完全等价。

**割点**：当且仅当该无向图的点连通度为1时，割点集合的唯一元素被称为割点，一个图中可能有多个割点。

**桥**：当且仅当该无向图的边连通度为1时，割边集合的唯一元素被称为桥，一个图中可能有多个桥。

两个猜想：两个割点之间一定是桥，桥的两个端点一定是割点。**两个猜想都是错的！**

如下图，左图两个割点之间不是桥，右图中一个桥两边不是割点。

<img src="D:\yy\program\Typora\Photos\Tarjan.jpg" style="zoom:10%">

#### 强联通分量（缩点)
先通过Tarjan算法计算出一个强连通分量，然后都给他们染上相同的颜色，再通过枚举两两点之间它们的颜色是否一样，如果不同就连起来，就可以构建新图B了（A是原图）

图解：http://keyblog.cn/article-72.html
```cpp
//Edge------------------------------------------------------------------
struct Edge {int b, nt;};
struct Union {
    int head[N], e_num;
    Edge e[M];
    void aedge(int u, int v) {
        e[++e_num].b = v;
        e[e_num].nt = head[u];
        head[u] = e_num;
    }
}A, B;
//----------------------------------------------------------------------
int cnt, idx[N], sz[N];//染色

//tarjan所需变量
int tot, dfn[N], low[N];
int st[N], top;//栈
bool vis[N];//判断是否在栈中

void tarjan(int u) {
    dfn[u] = low[u] = ++tot;
    vis[u] = 1;
    st[++top] = u;
    for (int i = A.head[u]; i; i = A.e[i].nt) {
        int v = A.e[i].b;
        if (!dfn[v]) {tarjan(v); Min(low[u], low[v]);}
        else if (vis[v]) Min(low[u], dfn[v]);
        //此处我认为可以写成Min(low[u], low[v]);
    }
    if (low[u] != dfn[u]) return;
    ++cnt;//新的一种颜色
    do {
        idx[st[top]] = cnt;//标记颜色
        vis[st[top]] = 0;//从栈中弹出
        sz[cnt] += val[st[top]];//点权之和
    } while(st[top--] != u);
}
//主函数中的操作-----------------------------------------------------------
for (int i = 1; i <= n; i++) if (!dfn[i]) tarjan(i);
//构造新图B
for (int u = 1; u <= n; u++) {
    for (int i = A.head[u]; i; i = A.e[i].nt) {
        int v = A.e[i].b;
        if (idx[v] != idx[u]) B.aedge(idx[u], idx[v]);
    }
}

```
#### 割点
判断u是割点的条件，满足下述两个条件之一：

1、u为搜索树的树根，且u有多于一个子树。

2、u不为树根，且满足u为v在搜索树中的父亲，并且$dfn[u]\le low[v]$。删去u后v的子树无法到达u的祖先。
https://zhuanlan.zhihu.com/p/101923309

```cpp
int tot, dfn[N], low[N], rt;
bool cut[N];
void tarjan(int u) {
    dfn[u] = low[u] = ++tot;
    int cnt = 0;//记录子树个数
    for (int i = head[u]; i; i = e[i].nt) {
        int v = e[i].b;
        if (!dfn[v]) {
            ++cnt;//子树+1
            tarjan(v);
            Min(low[u], low[v]);
            //对应上述两个判断条件
            if ((rt == u && cnt > 1) || (rt != u && dfn[u] <= low[v])) cut[u] = 1;
        //由于是无向图，不同讨论是否在栈中
        } else Min(low[u], dfn[v]);
    }
}
for (int i = 1; i <= n; i++) if (!dfn[i]) rt = i, tarjan(i);
```
##### 割点周围连通图的个数
简单说就是去掉割点后，会产生几个连通图

cnt代表u点去掉后连通子图的个数，如果时u=rt时，则rt一定会在u去掉后的一个连通子图中，所以cnt开始为1，每次$dfn[u]<=low[v]$表示v到达最上方的点就是u，则v下方的一系列点都在u去掉后的一个连通子图中。
[电力](https://loj.ac/problem/10103)

```cpp
void tarjan(int u) {
    dfn[u] = low[u] = ++tot;
    int cnt = u != rt;//如果不是rt的话，rt则一定在u点去掉后的一个连通子图中，则至少有1个
    for (int i = head[u]; i; i = e[i].nt) {
        int v = e[i].b;
        if (!dfn[v]) {
            tarjan(v), Min(low[u], low[v]);
            if (dfn[u] <= low[v]) mem[u] = ++cnt;//当v到达的最小的点是u，则v属于一个连通子图中
        }
        else Min(low[u], dfn[v]);
    }
}
```
于是我们又发现一个新的更好的方法判断割点。
```cpp
//修改下这个判断
if (dfn[u] <= low[v] && ++cnt > 1) cut[u] = 1;
//很好理解，如果u点去掉后，连通子图个数为2个以上，则u就是一个割点
```
#### 桥
判断一条无向边(u,v)是桥，当且仅当(u,v)是树枝边，且满足$dfn[u]<low[v]$（因为v要到达u的节点则需经过(u,v)这条边，所以删去这条边，图不连通）注意：不要走相同的道路。

注意：桥和割点判断条件的位置是不相同的
https://zhuanlan.zhihu.com/p/101923309

```cpp
int tot, dfn[N], low[N];
bool cut[M << 1], vis[M << 1];
void tarjan(int u) {
    dfn[u] = low[u] = ++tot;
    for (int i = head[u]; i; i = e[i].nt) if (!vis[i]) {
        vis[i] = vis[i ^ 1] = 1;
        int v = e[i].b;
        if (!dfn[v]) {
            tarjan(v);
            Min(low[u], low[v]);
        //由于是无向图，不用讨论是否在栈中
        } else Min(low[u], dfn[v]);
        //判断是否是桥
        if (dfn[u] < low[v]) cut[i] = cut[i ^ 1] = 1;
    }
}
for (int i = 1; i <= n; i++) if (!dfn[i]) rt = i, tarjan(i);
```
#### 2-SAT
https://www.luogu.com.cn/problem/solution/P4782

建图方法：建立有向图，使连接边均为必要条件。

例：a和a’，b和b‘中都有且仅有一个变量为true（a,a',b,b'均为bool型变量）

eg1：条件：a和b'不能同时成立。建边：a$\rightarrow$b，b'$\rightarrow$a’（a如果成立的话，则b'不能成立，则b一定要成立，另一条边同理）

eg2：条件：a和b'至少成立一个。建边：a'$\rightarrow$b'，b$\rightarrow$a（如果a没有成立的话，a'一定要成立，则b'也一定要成立，另一条边同理）

如果a和a’在同一个强连通分量中，这说明a和a'必须要同时成立，这是不可能的，所以无解。

反之，a和a'如果有前后关系的，如a$\rightarrow$a'，则此时a'为true，a为false，因为如果a为true则a'也要为true。所以用tarjan中的染色序号，序号小的就是箭头右边的，大的就是左边的，十分容易判断出谁是true谁是false。又因为a和a'可能没有任何的联系(没有边连接)，所以它们中间可以任意取值，就产生了多解。
```cpp
//根据题意建好有向边
for (int i = 1; i <= n; i++)
    if (idx[i] == idx[get(i)]) { //get(x)用于获取x'的序号
        printf("IMPOSSIBLE");
        return 0;
    }
for (int i = 1; i <= n; i++) {
    if (idx[i] < idx[get(i)]) printf("%d\n", i);
    else printf("%d\n", get(i));
}

```
### 树链剖分
[树链剖分](https://www.cnblogs.com/ivanovcraft/p/9019090.html)目的是把一个整体的树，差分成很多条重链与轻链，重链与轻链上的dfs序是连续的，所以可以做到区间修改(用其他数据结构很容易维护，线段树，树状数组……)，从而降低时间复杂度理论复杂度为$O(nlog^2n)$

#### 预处理
预处理包含，两次dfs，从树根出发。

dfs1：计算子树大小sz[]，求出重孩子节点son[]，记录深度dep[]，记录父亲节点prt[]。

dfs2：做出重链，记录重链中的顶点（重链中深度最小的就是最上方的一个节点）top[]，树上每个节点在线段树中对应的编号idx[]，反对应编号H[]。

```cpp
int id;
int sz[N], dep[N], prt[N], son[N], top[N], idx[N], H[N];
void dfs1(int u) {
    sz[u] = 1;
    for (int i = head[u]; i; i = e[i].nt) {
        int v = e[i].b;
        if (v == prt[u]) continue;
        prt[v] = u; dep[v] = dep[u] + 1;
        dfs1(v); sz[u] += sz[v];
        if (!son[u] || sz[v] > sz[son[u]]) son[u] = v;
    }
}
void dfs2(int u, int chain) {
    top[u] = chain;
    idx[u] = ++id;
    H[id] = u;
    if (son[u]) dfs2(son[u], chain);
    for (int i = head[u]; i; i = e[i].nt) {
        int v = e[i].b;
        if (v == prt[u] || v == son[u]) continue;
        dfs2(v, v);
    }
}
```
#### 树链操作
查询或修改，原理大致一样，通过跳该节点top节点的prt来确保节点上移的复杂度为$O(log_2)$，每次选择深度较深的节点上移，直到两个节点到达同一条重链上来为止。
```cpp
//以查询为例，其他操作如LCA，修改……都差不多。
//线段树中查询函数，p为根节点，查询区间为[l,r]
struct Seg {int query(int p, int l, int r){...}} seg;
int query(int x, int y) {
	int ret = 0;
	while (top[x] != top[y]) {//不在同一条重链上面
    	if (dep[top[x]] < dep[top[y]]) swap(x, y);
    	//比较重链顶点的深度，因为即将要跳到较深的一个重链顶点的父亲节点上。
    	ret += seg.query(1, idx[top[x]], idx[x]);
    	x = prt[top[x]];
	}
	//最终两个节点一定会在同一条重链上面，再加上两者之间的数值即可
	if (dep[x] < dep[y]) swap(x, y);
	ret += seg.query(1, idx[y], idx[x]);
	return ret;
}
```
#### 边权处理
由于树链剖分动态处理的是点权，为了处理边权只需将**边权下放**，处理两点之间的时候，注意**不处理LCA的点权**（因为，LCA的点权LCA和prt[LCA]之间的边权，它是不可能在两点路径上的一条边）
#### 动态求解两点之间的桥的个数
[[AHOI2005] 航线规划](https://www.luogu.com.cn/record/list?user=76226)

问题：求无向图中两点之间的个数，有两钟操作：删一条边和询问两点之间最短路径上桥的个数。

思路：看到桥就想到tarjan求桥的方法，但是删边操作不好处理可能会增加桥的数量。**反向思考：加边/点变为删边/点**，加边的操作只会减少桥的数量，而且减少的就是两端点之间的所有的桥。所以，可以先缩点建图变为树形结构，每个边权值赋值为1，再进行树链剖分，每次连接两点，两点之间的边权值全部变为0，查询直接求出两点之间边权值之和。答案倒序输出即可。

### 字符串

#### 后缀自动机SAM

hihoCoder

[SAM基本概念](http://hihocoder.com/problemset/problem/1441)

[SAM实现方法](http://hihocoder.com/problemset/problem/1445)

[陈立杰PPT](https://max.book118.com/html/2016/1007/57498384.shtm)

```cpp
struct SAM {
    int cnt, last, ch[N][26], mx[N], prt[N];
    int sz[N];//统计该节点right集合大小，就是在母串中出现的次数
    SAM() {cnt = last = 1;}//记得初始化
    void add(int c) {
        int p = last, np = ++cnt; last = np;
        mx[np] = mx[p] + 1; sz[np] = 1;
        for (; p && !ch[p][c]; p = prt[p]) ch[p][c] = np;
        if (!p) prt[np] = 1;
        else {
            int q = ch[p][c];
            if (mx[q] == mx[p] + 1) prt[np] = q;
            else {
                int nq = ++cnt; mx[nq] = mx[p] + 1;
                prt[nq] = prt[q]; prt[q] = prt[np] = nq;
                memcpy(ch[nq], ch[q], sizeof(ch[q]));
                for (; ch[p][c] == q; p = prt[p]) ch[p][c] = nq;
            }
        }
    }
    //进行拓扑排序
    void dp() {
        for (int i = cnt; i; i--) {
            sz[prt[c[i]]] += sz[c[i]];
        }
    }
} sam;
```
##### 桶排序（简化拓扑排序）
```cpp
//桶排序，按照mx[]的从小到大排序在c[]中
int t[N], c[N];
void tsort() {
    for (int i = 1; i <= cnt; i++) t[mx[i]]++;//入桶
    for (int i = 1; i <= cnt; i++) t[i] += t[i - 1];//记录排名
    for (int i = 1; i <= cnt; i++) c[t[mx[i]]--] = i;//排名对应序号
    for (int i = cnt; i >= 1; i--) sz[prt[c[i]]] += sz[c[i]];//对sz数组进行累加，求出一个节点中的endpos出现次数，即拓扑排序后的DP
}
```
##### 倍增
在parent树上进行倍增，可以快速$O(logn)$求出子串属于SAM中的哪个节点
```cpp
int pos[N][20];
void init() {
   	for (int i = 1; i <= cnt; i++) pos[i][0] = prt[i];
   	for (int j = 1; j < 20; j++)//从小到大
   	for (int i = 1; i <= cnt; i++) pos[i][j] = pos[pos[i][j - 1]][j - 1];
}
int find(int p, int len) {//p为当前子串右端点在SAM上对应的位置
	//从大到小
    for (int i = 19; i >= 0; i--) if (mxl[pos[p][i]] >= len) p = pos[p][i];
}
```
##### 广义SAM
将多个字符串插入到SAM中去，让SAM能对多个字符串同时处理，处理出多个字符串的共同与不同之处。

构造方法：在每次新加入一个串的时候将last=1；同时注意不要插入相同的节点产生多余和错误，判断节点是否重复的方法：因为每次之加入一个字符，那么一定会有$mxl[np]=mxl[p]+1$，如果$ch[last][c]$有值存在，并且$mxl[ch[last][c]]=mxl[last]+1$于是就可以直接转移$last=ch[last][c]$。
```cpp
void add(int c) {
    if (ch[last][c] && mxl[ch[last][c]] == mxl[last] + 1) {
        last = ch[last][c];
        return;
    }
    ///...其他部分与标程一致...
}
void init() {
    last = 1;
    for (int i = 1; i <= len; i++) add(s[i] - 'a')；
}

```
#### 回文算法
##### Manacher(马拉车算法)
利用已有的大的回文串，当大的回文串中包含有小的回文串时候，计算左侧和右侧会重复计算，浪费时间，通过对称的性质，通过DP的思路将右侧的回文串对称到左侧去，从而降低时间复杂度。

注意各个变量的初始值和对字符串进行的预处理操作。
```cpp
char A[N << 1];
int len, rad[N << 1];//rad[i]表示(以i为对称中心的最长回文串的长度+1)/2
//len保存处理后的总数组长度
void init() {
    char c = getchar();
    //对0做一个特殊的标记，保证不会与后面的符号重复
    A[0] = '~'; A[++len] = '#';//'#'作为分隔符号
    while (c < 'a' || c > 'z') c = getchar();
    while (c >= 'a' && c <= 'z') {A[++len] = c; A[++len] = '#'; c = getchar();}
}
void Manacher() {
    init();
    for (int i = 1, r = 0, mid = 0; i <= len; i++) {
    	//如果i在已经处理过的长度之内，则可以对称找到现有可以处理到的最长长度rad[i]，但绝对不可能处理到还未处理过的长度(就是r的右侧)
        if (i <= r) rad[i] = min(rad[(mid << 1) - i], r - i + 1);
        //开始尝试向外拓展
        while (A[i - rad[i]] == A[i + rad[i]]) ++rad[i];
        //如果当前拓展的长度大于了已有的扫描范围，就更新右端端点r和对称中心mid
        if (i + rad[i] > r) r = i + rad[i] - 1, mid = i;
    }
}
```
#### Z函数（拓展KMP）
https://oi-wiki.org/string/z-func/
主要思路：维护一个 $[l,r]$ 的匹配段，保证 $s[0,r-l]=s[l,r]$，然后考虑当前枚举到的位置 $i$ ，分为两种情况(画图理解)

1. $i \le r$ 

   (1). $z[i-l]<r-i+1$ 则 $z[i]=z[i-l]$ 

   (2). $z[i-l]\ge r-i+1$ 暴力向外延拓

2. $i > r$ 也是暴力向外延拓

如果当前计算完的 $z[i]$ 有，$i+z[i]-1>r$ 则更新 $l=i,r=i+z[i]-1$
```cpp
#define vi vector<int>
vi z_function(string &s) {
	int n = s.size();
	vi z(n);//注意z[0]定义为0
	for (int i = 1, l = 0, r = 0; i < n; i++) {
		if (i <= r && z[i-l] < r - i + 1) z[i] = z[i-l];
		else {
			z[i] = max(0, r-i+1);
			while (i + z[i] < n && s[z[i]] == s[i+z[i]]) z[i]++;
		}
		if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;
	}
	return z;
}
```

### 数论
#### 快速乘
当模数的阶接近$2^{64}$时，两数相乘可能会导致溢出。即$a\cdot b\pmod m$
##### 1.0
类比快速幂的思路，复杂度为$O(log\;n)$
```cpp
int mul(int a, int b, int mod) {
    int ret = 0;
    while (b) {
        if (b & 1) (ret += a) %= mod;
        (a += a) %= mod;
        b >>= 1;
    }
    return ret;
}
```
##### 2.0
优化版，速度可以快到$O(1)$
```cpp
int mul(int a, int b, int mod) {
    if (mod <= 1e9) return a * b % mod;
    else if (mod <= 1e12) return (((a * (b >> 20) % mod) << 20) + a * (b & ((1 << 20) - 1))) % mod;
    else {
        ul c = (ld)a / mod * b;
        int ret = (ul)a * b - c * mod;
        return (ret + mod) % mod;
    }
}
```
- 如果模数小于$10^{12}$，把$b$分为两个数之和，`b=((b>>20)<<20)+(b&((1<<20)-1)),分为b>>20和b&((1<<20)-1)`利用模意义下乘法的可以分别模，$b$可以是两个$10^6$级别的乘法，就可以分别和$a$相乘后取模，然后相加取模。
- 如果模数大于$10^{12}$，那么就用`long double`来计算$ \lfloor\dfrac{a}{m}b\rfloor$，由于$ab\bmod m=ab-\lfloor\dfrac{ab}{m}\rfloor m$。最后`a*b-c*m`使用了`unsigned long long`来做自然溢出，因为两者直接做差，和在模$2^{64}-1$下做差没区别（因为最后结果一定是在`long long`范围以内的）。这样算法的正确性就有了保证。

#### 本原解
$x^2+y^2=z^2$且$(x,y)=(y,z)=(x,z)=1$，求不定方程的正整数解。

全部解均可表示成：$z=r^2+s^2,y=2rs,x=r^2-s^2,其中r>s>0,(r,s)=1,2\nmid (r+s)$
且有本原解的性质：x，y一奇一偶即$2\nmid (x+y)$，z为奇数且$6\mid xy$（用模证明）

例题：[ Streaming_4_noip_day2 距离统计](https://blog.csdn.net/weixin_44627639/article/details/109209451)

#### Exgcd
##### 1.0
用于求解$a\cdot r\equiv c\ (mod\ m),(a,m)\mid c$ 可以理解为即 $ax+my=c$ 不定方程的一个整数
利用模的性质：
$$
ar\equiv c\ (mod\ m) \\
\text{一般式}\ ar+mr_1=c\\\\
\text{令}\ a_1=m\% a\ \text{则}\ a_1r_1\equiv c\ (mod\ a)\\\text{一般式}\ a_1r_1+ar_2=c\\\text{令}\ a_2=a\%  a_1\ \text{则}\ a_2r_2\equiv c\ (mod\ a_1)\\......\\\text{最后一定会有}\\a_n=a_{n-2}\%a_{n-1}=1\ \text{则}\ a_nr_n\equiv c\ (mod\ a_{n-1})\\\text{一般式}\ a_nr_n+a_{n-1}r_{n+1}=c\\\text{则}\ a_{n+1}=a_{n-1}\%a_n=0\text{，此时}r_{n+1}\text{直接返回}0\text{，那么顺理成章地就有}r_n=c
$$
可以发现a和m就是在做gcd，故时间复杂度为$O(2logN)$，不难从一般式看出，$r_k$的递推式为
$$
r_k=(c-a_{k-1}r_{k+1})/a_k\\\text{递归式}\ r_k=(c-mr_{k+1})/a
$$
$r_{k+1}$是由递归回溯回来的，$a_{k-1}\text{和}a_k$就是分别对应着m和a，那么递归就可以不难写出了。
现在重新看到不定方程的特解，其实就是$x=r,y=r_1=(c-ar)/m$

```cpp
int exgcd(int a, int c, int m) {
    if (!a) return 0;
    return (c - m * exgcd(m % a, c, a)) / a;
    //return (((c - m * exgcd(m % a, c, a)) / a) % m + m) % m;
    //若想返回最小正剩余就先模m再加m再模m
}
exgcd((71, 2019, 2018) + 2019) % 2019;
//由于最后的结果不一定能保证是最小非负剩余故最后要对结果+m%m
exgcd((71, 2019, 1) + 2019) % 2019;\\那么对于a的在模m意义下的逆元也就是c=1时的解
```
##### 2.0
由于1.0版本的**Exgcd**会去计算一个`m * exgcd(m % a, c, a)`，如果m为$10^{18}$那么就会爆掉long long，这是十分令人不开心的。于是改进方法，变为直接去思考$ax+by=(a,b)$中x，y的特解。
$$
\text{求解：}ax+by=(a,b)\\\text{当}b=0\text{时，}x=1,y=1.\\\text{当}b\ne0\text{时}，ax+by=(a,b)=(b,a\bmod b)=bx_2+(a\bmod b)y_2\\
\text{由于}a\bmod b=a-\left\lfloor\frac{a}{b}\right\rfloor b\\
\begin{aligned}
ax+by&=bx_2+(a\bmod b)y_2\\&=bx_2+(a-\left\lfloor\frac{a}{b}\right\rfloor b)y_2\\
&=bx_2+ay_2-\left\lfloor\frac{a}{b}\right\rfloor by_2\\
&=ay_2+b(x_2-\left\lfloor\frac{a}{b}\right\rfloor y_2)\\
\end{aligned}\\
\text{对比系数可知}x=y_2,y=x_2-\left\lfloor\frac{a}{b}\right\rfloor y_2
$$
```cpp
int exgcd(int a, int b, int &x, int &y) {
	if (b == 0) {x = 1, y = 0; return a;}
	int gcd = exgcd(b, a % b, x, y);//计算exgcd一定在tmp赋值之前哦!
	int tmp = x;
	x = y; y = tmp - a / b * y;
	return gcd;
}
//若要求az=c(mod m),则一定有c%(a,m)=0,令gcd=exgcd(a,m,x,y),则z=c/gcd*x
```
这个版本的Exgcd的好处就是能改变1.0中c的大小，从而不会发生乘法溢出。同时还能顺便求出$gcd(a,b)$

#### 中国剩余定理 CRT
$$
\begin{cases}
x\equiv b_1\pmod{m_1}\\x\equiv b_2\pmod{m_2}\\\quad\quad\cdots\cdots\\x\equiv b_k\pmod{m_k}
\end{cases}
\quad\text{其中}m_1,m_2,...,m_k\text{两两互素}
$$
令$m=\prod\limits_{1\le i\le k}m_i$，则方程组的解在模$m$意义下具有唯一性。

令$M_i=\dfrac{m}{m_i},N_iM_i\equiv 1\pmod{m_i},\text{即}N_i\text{为}M_i\text{在}\pmod{m_i}\text{下的逆}$ 

则通解为：$x\equiv \sum\limits_{1\le i\le k}M_iN_ib_i\pmod{m}$
[详细证明](https://zhuanlan.zhihu.com/p/41665549)

```cpp
int n, m = 1;
int A[N], B[N], ans;
signed main() {
    read(n);
    for (int i = 1; i <= n; i++) {
        read(A[i]), read(B[i]);
        m *= A[i];
    }
    for (int i = 1; i <= n; i++)
        (ans += (m / A[i]) * exgcd(m / A[i], 1, A[i]) * B[i]) %= m;
    	//这里用的exgcd是1.0版本的
    printf("%lld\n", ans);
    return 0;
}
```

#### 拓展中国剩余定理 EXCRT
$$
\begin{cases}
x\equiv b_1\pmod{m_1}\\x\equiv b_2\pmod{m_2}\\\quad\quad\cdots\cdots\\x\equiv b_k\pmod{m_k}
\end{cases}
\quad\text{其中}m_1,m_2,...,m_k\text{不一定两两互素}
$$
一次只考虑两个方程式
$$
\begin{cases}
x\equiv b_1\pmod{a_1}\\x\equiv b_2\pmod{a_2}
\end{cases}
\\\text{写成一般式}\\
\begin{cases}
x=b_1+k_1a_1\\x=b_2+k_2a_2
\end{cases}
\\b_1+k_1a_1=b_2+k_2a_2
\\k_1a_1-k_2a_2=b_2-b_1
\\\text{用}exgcd\text{解}\ k_1a_1\equiv b_2-b_1\pmod{a_2}\ \text{同余方程（变量为}k_1\text{）}
\\\text{令解为}b\text{，则上面两个方程组等价于}:x\equiv b_1+k_1a_1\pmod{lcm(a_1,a_2)}
$$
于是每次将两个同余方程化为一个同余方程，最终把所有方程化为一个从而得到最终解。
```cpp
signed main() {
    read(n);
    int b, m;
    read(m), read(b);
    for (int i = 2; i <= n; i++) {
        int bb, mm; read(mm), read(bb);
        b += exgcd(m, bb - b, mm) * m;//这里用的exgcd是1.0版本的
        m = lcm(m, mm);
        b %= m;
    }
    printf("%lld\n", b);
    system("pause");
    return 0;
}
```
练习题：[[NOI2018]屠龙勇士](https://www.luogu.com.cn/problem/P4774)

#### 二次剩余
考虑p是奇素数时候$(p\ge 3)$，求二次同余方程$x^2\equiv n\pmod{p}$的解，如果该方程有解，则n为模p的**二次剩余**，否则，n为模p的**二次非剩余**。

##### Euler判别条件
$$
p\text{为奇素数}，p\nmid n\\
\begin{cases}
n^{\frac{p-1}{2}}\equiv 1 \pmod p, &n\text{为模}p\text{的二次剩余},\\
n^{\frac{p-1}{2}}\equiv -1 \pmod p, &n\text{为模}p\text{的二次非剩余}\\
\end{cases}\\
\text{若}n\text{为模}p\text{的二次剩余}\\
\text{则}x^2\equiv n\pmod{m}\text{定有两解}x_0\text{和}p-x_0
$$

##### Legendre符号
$$
\text{对于奇素数}p\text{，定义函数}(\frac{.}{p}):\mathbb{Z}\rightarrow\{-1,0,1\}\text{如下：}\\
(\dfrac{n}{p})=
\begin{cases}
1,&n\text{为模}p\text{的二次剩余},\\-1,&n\text{为模}p\text{的二次非剩余},\\0,&p\mid n
\end{cases}\\(\frac{.}{p})\text{即为勒让德符号}
$$

##### Cipolla算法
找到一个$a$满足$a^2-n$是**二次非剩余**，可以通过随机出来这个$a$，因为二次剩余和二次非剩余在$\pmod{p}$下是对半分布的，所以算出$a$的期望为两次。

建立一个类似“复数域”的一个数域，定义$i^2=a^2-n$，通过$A+Bi$可以构造出一个新的数域，$A\text{和}B$都是$\pmod p$意义下的整数。

于是该方程的一个解为$x\equiv (a+i)^{\frac{p+1}{2}}$
**证明：**

- 引理1：$(a+b)^p\equiv a^p+b^p\pmod p$，用二项式展开式即可证明
- 引理2：$i^p\equiv -i\pmod p$
$$
\begin{aligned}
\text{证明：}i^p&\equiv i^{p-1}\cdot i\\&\equiv (i^2)^{\frac{p-1}{2}}\cdot i\\&\equiv (a^2-n)^{\frac{p-1}{2}}\cdot i\\&\equiv -1\cdot i\\&\equiv -i\pmod p
\end{aligned}
$$
- 引理3：$a^p\equiv a\pmod p$，费马小定理

  有了三条定理后，开始推导

$$
\begin{aligned}
(a+i)^{\frac{p+1}{2}}&\equiv((a+i)^p\cdot (a+i))^{\frac{1}{2}}\\&\equiv((a^p+i^p)\cdot (a+i))^{\frac{1}{2}}\\&\equiv ((a-i)\cdot (a+i))^{\frac{1}{2}}\\&\equiv (a^2-i^2)^{\frac{1}{2}}\\&\equiv (a^2-(a^2-n))^{\frac{1}{2}}\\&\equiv n^{\frac{1}{2}}\pmod p
\end{aligned}\\
\text{故}x\equiv (a+i)^{\frac{p+1}{2}}\equiv n^{\frac{1}{2}}\pmod p
$$

```cpp
//计算x^2=n(mod p)
int p, n, w;//w为i^2所对应的数
struct num {//建立一个"复数域"
    int a, b;
    num(int a = 0, int b = 0) : a(a), b(b) {}//初始化函数
    num operator *= (num &x) {
        int aa = a * x.a % p + b * x.b % p * w % p;
        int bb = a * x.b % p + b * x.a % p;
        a = aa;
        b = bb;
    }
};
num ksm(num x, int a) {//既可以做整数，也可以做复数的ksm
    num ret = 1;
    while (a) {
        if (a & 1) (ret *= x);
        x *= x;
        a >>= 1;
    }
    return ret;
}
bool check(int x) {//判断x是否是模p的二次剩余
    return ksm(x, (p - 1) >> 1).a == 1;
}
signed main() {
    srand(time(NULL));
    read(n), read(p);
    if (!check(n)) {
        printf("无解\n");
        return 0;
    }
    int a = rand() % p;
    while (!a || check(((a * a % p - n) % p + p) % p)) {//如果a^2-n为二次剩余就继续找
        a = rand() % p;
    }
    w = ((a * a % p - n) % p + p) % p;//计算i^2所对应的数
    int ans1 = (ksm(num(a, 1), (p + 1) >> 1).a % p + p) % p;
    int ans2 = p - ans1;
    printf("%lld %lld\n", ans1, ans2);
    return 0;
}
```

####  指数与原根
$m$为给定的正整数，对于$(a,m)=1$，有如下定义

$a$对模$m$的指数，记为$\delta_m(a) := min\{1\le b\le m:a^b\equiv 1\pmod m\}$。
当$\delta_m(a)=\varphi(m)$时，$a$为模$m$的一个原根。
##### 原根存在的条件
对于正整数$m$，模$m$的原根存在$\iff m=1,2,4,p^\alpha,2p^\alpha\text{，其中}\alpha\ge 1,p\text{为奇素数}$
##### 原根判定的方法
$a$是模$m$的原根$\iff$对于$\varphi(m)$的每个素因子$p$，都有
$$
a^{\tfrac{\varphi(m)}{p}}\not\equiv 1\pmod m
$$
##### 求n的所有原根
引理：对于每个正整数$k$，恒有
$$
\delta_n(a^k)=\frac{\delta_n(a)}{(\delta_n(a),k)}\\
\text{当}a\text{为模}n\text{的原根，且}(\delta_n(a),k)=1\text{时，}\\
\delta_n(a^k)=\delta_n(a)=\varphi(n)\\
\text{而且由阶的定义可以保证}a^k\text{在模}n\text{下两两不同，所以模}n\text{一共有}\varphi(\varphi(n))\text{个原根}.
$$
预处理：用[Euler筛法](https://blog.csdn.net/liuzibujian/article/details/81086324)求出$1\sim N$的所有数对应的欧拉函数和素数，顺便处理$1\sim N\text{中所有的}p^\alpha\text{和}2p^\alpha$，方便判断是否存在原根。

小到大寻找一个$g$使得$g^{\frac{\varphi(m)}{p}}\not\equiv 1\pmod m,\forall p\ge2,p\mid m$成立。

由引理可知，利用这个$g$能生成所有其他的原根，找所有的$x$满足$(x,\varphi(n))=1$，即$\forall x\in RRS(n)$，则$g^x$均为$n$的原根。

```cpp
int phi[N], prim[N], cnt, A[N], ans[N];
bool vis[N], chk[N];
void Euler(int n) {//Euler筛
    phi[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!vis[i]) {
            prim[++cnt] = i;
            phi[i] = i - 1;
            int tmp = i;
            //顺便处理p^alpha,2p^alpha的情况
            while (tmp <= n && i >= 3) {
                if (tmp <= n) chk[tmp] = 1;
                if (tmp << 1 <= n) chk[tmp << 1] = 1;
                tmp *= i;
            }
        }
        for (int j = 1; j <= cnt && i * prim[j] <= n; j++) {
            int t = i * prim[j], p = prim[j];
            vis[t] = 1;
            if (i % p == 0) {
                phi[i * p] = phi[i] * p;
                break;
            } else phi[i * p] = phi[i] * phi[p];
        }
    }
}
signed main() {
    chk[1] = chk[2] = chk[4] = 1;
    Euler(1e6);
    read(T);
    while (T--) {
        read(n), read(m);
        //没有原根
        if (!chk[n]) {printf("0\n\n"); continue;}
        //特判两个原根为1的
        if (n == 1 || n == 2) {
            printf("%lld\n", 1);
            if (m == 1) printf("1\n");
            else putchar('\n');
            continue;
        }
        //A存所有的phi(m)/p
        A[0] = 0;
        for (int i = 1; i <= cnt && prim[i] <= phi[n]; i++) {
            int p = prim[i];
            if (phi[n] % p == 0) A[++A[0]] = phi[n] / p;
        }
        //找到一个g就直接退出
        int g;
        for (g = 2; g <= n; g++) if (gcd(g, n) == 1) {
            bool fg = 0;
            for (int j = 1; j <= A[0]; j++) {
                if (ksm(g, A[j], n) == 1) {
                    fg = 1;
                    break;
                }
            }
            if (fg) continue;
            else break;
        }
        ans[0] = 0;
        //开始生成其他的原根
        for (int i = 1; i <= phi[n]; i++) if (gcd(i, phi[n]) == 1)
            ans[++ans[0]] = ksm(g, i, n);
        //原根从小到大输出
        sort(ans + 1, ans + 1 + ans[0]);
        printf("%lld\n", phi[phi[n]]);
        for (int i = m; i <= ans[0]; i += m) printf("%lld ", ans[i]);
        putchar('\n');
    }
    system("pause");
    return 0;
}
```

#### BSGS
用于求解 $a^x\equiv b\pmod p,(a,p)=1$ （离散对数）。算法本质是朴实的枚举法。

令方程的解为 $x​$ ，则 $\exists A,B\in CRS(\lceil \sqrt p \rceil)​$ 使 $x=A\lceil \sqrt p \rceil - B​$，则原方程为
$$
a^{A\lceil \sqrt p \rceil - B}\equiv b\pmod p\\
a^{A\lceil \sqrt p \rceil}\equiv ba^B\pmod p
$$
于是，我们可以先枚举B，算出右式结果用hash表存储，再枚举A，算出结果检查hash表中存在，如果存在就输出结果。
```cpp
int bsgs(int a, int b, int p) {//solve a^x=b (mod p)
    unordered_map<int, int> hsh;//系统自带哈希表，O(1)查询速度
    int m = sqrt(p) + 1, w = b * a % p;
    for (int i = 1; i <= m; i++, (w *= a) %= p) hsh[w] = i;//先枚举B
    int wn = ksm(a, m, p); w = wn;
    for (int i = 1; i < m; i++, (w *= wn) %= p) if (hsh[w]) return i * m - hsh[w];//再枚举A
    return -1;
}
```
#### ExBSGS
求解 $a^x\equiv b\pmod m,(a,m)\ne1$。

当 $x>1$ 时，将方程看做 $a\cdot a^{x-1}\equiv b\pmod m$，和求解二元不定方程时一样的思路。

令 $d_1=(a,m)$ ，则上述方程等价于 $a^{x-1}\cdot \dfrac{a}{d_1}\equiv \dfrac{b}{d_1}\pmod {\dfrac{m}{d_1}}$。

令 $d_2=(a,\dfrac{m}{d_1})​$，若 $d_2>1​$ ，则继续上述变换 $\dfrac{a^2}{d_1d_2}a^{x-2}\equiv \dfrac{b}{d_1d_2}\pmod {\dfrac{m}{d_1d_2}}​$。

最终一定 $\exists k$，记 $D=\prod\limits_{i=1}^{k}d_i$，使 $(a,\dfrac{m}{D})=1$，方程等价于求解 $\dfrac{a^k}{D}\cdot a^{x-k}\equiv \dfrac{b}{D}\pmod {\dfrac{m}{D}}$。

由于 $(a,\dfrac{m}{D})=1$，则 $\dfrac{a^k}{D}$ 存在模 $\dfrac{m}{D}$ 下的逆元，就可以利用BSGS求解，最后加上 $k$ 就是要求的 $x$ 了。

```cpp
int exbsgs(int a, int b, int m) {
    int aa = 1, g, cnt;
    if (b == 0) return 1;
    for (cnt = 0; (g = gcd(a, m)) != 1; cnt++) {
        if (b % g) return -1;
        b /= g, m /= g, (aa *= a / g) %= m;
        if (b == aa) return cnt + 1;
    }
    int inv, y;
    exgcd(aa, m, inv, y); (inv %= m) += m;
    int ret = bsgs(a, b * inv % m, m);
    return ret + ((ret == -1) ? 0 : cnt);
}
```
#### Lucas定理
Lucas定理用于求解大组合数取模问题，模数为素数且不能太大，一般在 $10^5$ 左右。
$$
\dbinom{n}{m}\equiv \dbinom{\lfloor\frac{n}{p}\rfloor}{\lfloor\frac{m}{p}\rfloor}\dbinom{n\bmod p}{m\bmod p}\pmod p
$$

证明：

引理：$(a+b)^p\equiv a^p+b^p\pmod p$。因为除了第0项和第p项外，其他项的二项式系数都是p的倍数。

求解 $\dbinom{n}{m}$ 等价于求解方程 $(1+x)^n$ 的第 $m$ 项的系数。

由带余数除法有，$n=\lfloor\frac{n}{p}\rfloor p+n\bmod p$。注：$n\bmod p$ 指 $n$ 在模 $p$ 下的最小非负剩余。则，
$$
\begin{aligned}
(1+x)^n&=(1+x)^{\lfloor\frac{n}{p}\rfloor p}(1+x)^{n\bmod p}\\
&\equiv (1+x^p)^{\lfloor\frac{n}{p}\rfloor}(1+x)^{n\bmod p}\\
&\equiv \sum\limits_{i=0}^{\lfloor\frac{n}{p}\rfloor}\dbinom{\lfloor\frac{n}{p}\rfloor}{i}x^{pi}\sum\limits_{j=0}^{n\bmod p}\dbinom{n\bmod p}{j}x^j
\end{aligned}
$$

由于 $m=\lfloor\frac{m}{p}\rfloor p+m\bmod p$。左侧求和中 $x$ 的次幂均为 $p$ 的倍数，右侧求和中 $x$ 的次幂均在 $0\sim p-1$，由带余数除法知，当且仅当 $i=\lfloor\frac{m}{p}\rfloor,j=m\bmod p$ 时， $x$ 的次幂为 $m$，其系数为 $\dbinom{\lfloor\frac{n}{p}\rfloor}{\lfloor\frac{m}{p}\rfloor}\dbinom{n\bmod p}{m\bmod p}$。QED

时间复杂度为 $f(p)+log_p\ n$ ，$f(p)=plog\ p$ 为预处理组合数复杂度。

```cpp
void init(int p) {//预处理组合数，算出1~(p-1)中数的阶乘和对应的逆
    jie[0] = ni[0] = 1;
    for (int i = 1; i < p; i++) jie[i] = jie[i - 1] * i % p, ni[i] = ksm(jie[i], p - 2, p);
}
int C(int n, int m, int p) {//计算组合数
    if (n < m) return 0;
    return jie[n] * ni[m] % p * ni[n - m] % p;
}
int C(int n, int m, int p) {//当然也可以直接计算,不用预处理,不同模数时效率更高
    if (n < m) return 0;
    int a = 1, b = 1;
    for (int i = n - m + 1; i <= n; i++) (a *= i) %= p;
    for (int i = 1; i <= m; i++) (b *= i) %= p;
    return a * ksm(b, p - 2, p) % p;
}
int lucas(int n, int m, int p) {//Lucas定理
    if (m == 0) return 1;
    return lucas(n / p, m / p, p) * C(n % p, m % p, p) % p;
}
```

#### exLucas
用于求解 $x\equiv \dbinom{n}{m} \pmod M$ 其中 $M$ 为合数。

记 $M$ 的标准分解为 $M=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_s^{\alpha_s}=\prod\limits^{s}_{i=1} p_i^{\alpha_i}$，于是原方程等价于求解：（最后用CRT合并）

$$
\begin{cases}
x\equiv \dbinom{n}{m}\pmod {p_1^{\alpha_1}}\\
x\equiv \dbinom{n}{m}\pmod {p_2^{\alpha_2}}\\
\quad\quad\quad\vdots\\
x\equiv \dbinom{n}{m}\pmod {p_s^{\alpha_s}}\\
\end{cases}
$$

问题转换为求解：$x\equiv \dbinom{n}{m}\pmod{p_i^{\alpha_i}}$。

由于 $\dbinom{n}{m}=\dfrac{n!}{m!(n-m)!}$，但 $m!(n-m)!$ 在模 $p^{\alpha}$ 下不一定有逆元。

记 $\beta(m,p)=max\{i\ge 0:p^i|m\}$。

则 $\dbinom{n}{m}=\dfrac{\frac{n!}{p^x}}{\frac{m!}{p^y}\frac{(n-m)!}{p^z}}p^{x-y-z}$ 其中 $x=\beta(n, p), y=\beta(m, p), z=\beta(n-m, p)$。

这样操作能保证分母 $\dfrac{m!}{p^y}\dfrac{(n-m)!}{p^z}$ 一定和 $p^\alpha$ 互素，即存在逆元。

于是问题又转换为求解 $x=\dfrac{n!}{p^{\beta(n,p)}}\pmod {p^\alpha}$。

考虑一个特例 $n=22,p=3,\alpha=2$，我们先把 $1\sim22$ 含有 $3$ 这个质因数的数都提一个 $3$ 出来。

则 

$$
\begin{aligned}
22!&=1\times2\times\cdots\times22\\
&=3^7\times(1\times2\times\cdots\times7)\times(1\times2\times4\times5\times7\times8)\times(10\times11\times13\times14\times16\times17)\times19\times20\times22\\
&\equiv3^7\times7!\times(1\times2\times4\times5\times7\times8)^2\times(1\times2\times4)\pmod {3^2}
\end{aligned}
$$

推广到一般有：

$$
n!\equiv p^{\lfloor\frac{n}{p}\rfloor}\times(\lfloor\frac{n}{p}\rfloor)!\times(\prod_{\substack{1\le i\le p^\alpha\\(i,p)=1}}i)^{\lfloor\frac{n}{p^\alpha}\rfloor}\times\prod_{\substack{1\le i\le n\bmod{p^\alpha}\\(i,p)=1}}i\pmod {p^\alpha}
$$

可以发现，$n!$ 可以分解为四项，第一项是 $p$ 次幂，我们要将其除到左侧，第二项可以用递归方式再次分解为四项，最终变为 $0!$，也就是 $1$ ，最后两项就是我们要的结果。可以发现，我们要求的 $\dfrac{n!}{p^{\beta(n,p)}}$ 其实就是递归中，所有 $n!$ 的最后两项的乘积。

同时，我们可以在递归的过程中，顺便把 $\beta(n,p)$ 求解出来，其实就有 $\beta(n,p)=\sum\limits_{i\ge 1}\lfloor\frac{n}{p^i}\rfloor$。

最后再用CRT合并就OK了。

```cpp
int con, sum;
//con为常数，就是上述n!公式中的第三项的底数。sum就是顺便求出来的x-y-z。
int F(int n, int p, int pp, int fg) {//递归求解n!/p^alpha在模pp下的值
    if (n == 0) return 1;
    int tmp = 1; sum += fg * n / p;//计算beta(n,p)
    for (int i = 1; i <= n % pp; i++) if (i % p) (tmp *= i) %= pp;
    return F(n / p, p, pp, fg) * ksm(con, n / pp, pp) % pp * tmp % pp;
}
int C_pp(int n, int m, int p, int pp) {//计算组合数nm在模pp下的值
    con = 1; sum = 0;
    for (int i = 1; i <= pp; i++) if (i % p) (con *= i) %= pp;
    int nn = F(n, p, pp, 1), mm = inv(F(m, p, pp, -1), pp), nm = inv(F(n - m, p, pp, -1), pp);
    return nn * mm % pp * nm % pp * ksm(p, sum, pp) % pp;
}
int exLucas(int n, int m, int p) {
    int tmp = p, ret = 0;
    for (int i = 2; i * i <= p; i++) {//对p做标准分解
        if (tmp % i) continue;
        P[++pcnt] = 1;
        while (tmp % i == 0) tmp /= i, P[pcnt] *= i;
        A[pcnt] = C_pp(n, m, i, P[pcnt]);
    }
    if (tmp != 1) P[++pcnt] = tmp, A[pcnt] = C_pp(n, m, tmp, tmp);
    for (int i = 1; i <= pcnt; i++) {//CRT
        int M = p / P[i];
        ret += A[i] * M % p * inv(M, P[i]) % p;
    }
    return ret % p;
}
```

#### 莫比乌斯反演
##### 数论分块
用于求解 $\displaystyle\sum_{i\ge1}\lfloor\frac{n}{i}\rfloor$。

记 $\displaystyle j=\left\lfloor\frac{n}{\lfloor\frac{n}{i}\rfloor}\right\rfloor$。

则 $\forall k\in [i,j]$，有 $\lfloor\frac{n}{k}\rfloor=\lfloor\frac{n}{i}\rfloor$。

所以可以把 $[i,j]$ 看成一个块，他们 $\lfloor\frac{n}{k}\rfloor$ 的值相同。

```cpp
for (int i = 1, j; i <= k; i = j + 1) {
    j = min(k / (k / i), n);//一定要和n取min
	ans += k / i;
}
```

**二维数论分块**

求解 $\displaystyle\sum_{i\ge1}\lfloor\frac{n}{i}\rfloor\lfloor\frac{m}{i}\rfloor$

将代码中的 `j = min(k / (k / i), n);` 改为 `j = min(min(min(n / (n / i), m / (m / i)), n), m);`

##### Dirichlet卷积
设 $f,g$ 为两个数论函数，将$f*g$ 记为 Dirichlet卷积：
$$
(f*g)(n)=\sum_{d|n}f(d)g(\frac{n}{d})
$$

性质

- 交换律 $f*g=g*f$
- 结合律 $(f*g)*h=f*(g*h)$
- 分配律 $f*(g+h)=f*g+f*h$
- 幺元：$\varepsilon(n)=[n=1]$。$f*\varepsilon=f$

##### 莫比乌斯函数
$\mu(n)$ 为莫比乌斯函数，定义：
$$
\mu(n)=
\begin{cases}
1&n=1,\\0&n\text{含有平方因子},\\(-1)^k&n=p_1p_2...p_k.
\end{cases}
$$

性质

- $\mu$ 为积性函数。
- $\displaystyle\sum_{d|n}\mu(d)=\varepsilon(n)$，也就是 $\mu*1=\varepsilon$

##### 莫比乌斯反演
设 $f, g$ 为两个数论函数。
若 $\displaystyle f(n)=\sum_{d|n}g(d)$，则 $\displaystyle g(n)=\sum_{d|n}\mu(d)f(\frac{n}{d})$。
若 $\displaystyle f(n)=\sum_{n|d}g(d)$，则 $\displaystyle g(n)=\sum_{n|d}\mu(\frac{d}{n})f(d)$。

证明及应用：[oi-wike](https://oi-wiki.org/math/mobius/#dirichlet)，讲的非常细。

**线性筛** $\mu$

```cpp
void init(int n) {//基本就是Euler线性筛
    mu[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!vis[i]) mu[i] = -1, prim[++cnt] = i;
        for (int j = 1; j <= cnt && prim[j] * i <= n; j++) {
            int t = prim[j] * i;
            vis[t] = 1;
            if (i % prim[j] == 0) {mu[t] = 0; continue;}
            mu[t] = -mu[i];
        }
    }
}
```



### 多项式
#### Lagrange插值
$n+1$个两两不同的二维数组$P_i=(x_i,y_i)$，可以唯一确定一个$n$次多项式。
$$
\begin{cases}
a_nx_1^n+a_{n-1}x_1^{n-1}+...+a_1x_1+a_0=y_1\\
a_nx_2^n+a_{n-1}x_2^{n-1}+...+a_1x_2+a_0=y_2\\
\quad\quad\quad\cdots\cdots\\
a_nx_{n+1}^n+a_{n-1}x_{n+1}^{n-1}+...+a_1x_{n+1}+a_0=y_{n+1}\\
\end{cases}
$$
把$\{a_n,a_{n-1},\cdots,a_1,a_0\}$视为变量，解$n+1$阶线性方程组。

如果直接用解多项式方法做（$Gauss$消元）复杂度$O(n^3)$太慢。

于是有个和$CRT$很类似的思路。

![lagrange-interpolation](https://upload.cc/i1/2021/09/03/deUq1W.png)

对于一个点$P_i(x_i,y_i)$找到它在$x$轴上的投影$H_i$，然后很容易能用函数$g_i(x)$将$P_i\bigcup\limits_{j\ne i}H_j$这$n+1$个点连起来，它是$g_i(x)=y_i\prod\limits_{j\ne i}\dfrac{x-x_j}{x_i-x_j}$，于是$g_i(x)$能保证带入$x_i$取到$P_i$，带入$x_j(\forall j\ne i)$取值为$0$。和$CRT$思路相似的是，他们全部加起来就是$f(x)$。于是有：$f(x)=\sum\limits_{1\leqslant i\leqslant n}g_i(x)=\sum\limits_{1\leqslant i\leqslant n}y_i\prod\limits_{j\ne i}\dfrac{x-x_j}{x_i-x_j}$
该复杂度为$O(n^2log(n))$，加上求逆元的复杂度。

关于$Lagrange$差值定理存在唯一性证明：由于能够直接构造出$f(x)$存在性得证，关于唯一性证明，不妨令$P(x)$和$Q(x)$是两个$n$次多项式，都能满足这$n+1$个点，令$F(x)=P(x)-Q(x)$，则$F(x)$最多为$n$次，由代数基本定理，$F(x)=0$最多有$n$个解，但分别代入$x_1,x_2,...,x_{n+1}$都使得$F(x)=0$，于是$F(x)=0$一共有$n+1$个解，与代数基本定理相矛盾。

练习：[P4781 【模板】拉格朗日插值](https://www.luogu.com.cn/problem/P4781)

#### 快速傅里叶变换
用于计算多项式乘法，求卷积。

FFT:Fast Fourier Transform 快速傅里叶变换

DFT:Discrete Fourier Transform 离散傅里叶变换

IDFT:Inverse Discrete Fourier Transform 离散傅里叶逆变换

对于一个多项式$f(x)=a_0+a_1x+...+a_nx^n$有如下两种表示方法。

##### 系数表示法
顾名思义，用多项式各个项的系数表示多项式的方法。

$$
f(x)=a_0+a_1x+...+a_nx^n\iff \{a_0,a_1,...,a_n\}
$$
##### 点值表示法
利用$n+1$个点可以唯一表示$n$次多项式。（参照Lagrange插值）

$$
f(x)=a_0+a_1x+...+a_nx^n\iff \{(x_0,f(x_0)),(x_1,f(x_1)),...,(x_{n-1},f(x_{n-1}))\}
$$
将多项式从系数表示法转为点值表示法就是$DFT$的过程，从点值表示法转为系数表示就是$IDFT$的过程。

从点值表示法上，考虑两个多项式$f(x),g(x)$相乘，令$F(x)=f(x)\cdot g(x)$。则$F(x)$的点值表示法为：
$$
F(x)=\{(x_0,f(x_0)g(x_0)),(x_1,f(x_1)g(x_1)),...,(x_n,f(x_n)g(x_n))\}
$$
所以，多项式相乘问题就转换为计算$DFT\text{和}IDFT$的过程了。如果随便代入$n$个值直接计算，$DFT$的复杂度是$O(n^2)$，而$IDFT$的复杂度是更大的。

通过考虑代入一些特别的值，以降低复杂度。
##### 离散傅里叶变换
令多项式长度为$n_0$。

- 先将$n_0$用较大的二次幂数$n$表示，高次项系数补零。令$n=2^{\lceil log_2n_0\rceil}$
- 记$e(x)=e^{2\pi ix}$ 向多项式中分别代入$e(0),e(\frac{1}{n}),e(\frac{2}{n}),...,e(\frac{n-1}{n})$这$n$个值，考虑求出它们对应的函数值。
- 对次幂分奇偶讨论
$$
f(x)=a_0+a_2x^2+a_4x^4+...+a_{n}x^n+a_1x+a_3x^3+...+a_{n-1}x^{n-1}\\
\text{记}P(x)=a_0+a_2x+a_4x^2+...+a_{n}x^{\frac{n}{2}},Q(x)=a_1+a_3x+...+a_{n-1}x^{\frac{n-2}{2}}\\
\text{则}f(x)=P(x^2)+xQ(x^2)\\
\text{当带入}e(\tfrac{k}{n})\text{时，}f(e(\tfrac{k}{n}))=P(e(\tfrac{2k}{n}))+e(\tfrac{k}{n})Q(e(\tfrac{2k}{n}))=P(e(\tfrac{k}{n/2}))+e(\tfrac{k}{n})Q(e(\tfrac{k}{n/2}))\\
\text{当带入}e(\tfrac{k+n/2}{n})\text{时，}f(e(\tfrac{k+n/2}{n}))=P(e(\tfrac{2k+n}{n}))+e(\tfrac{k+n/2}{n})Q(e(\tfrac{2k+n}{n}))=P(e(\tfrac{k}{n/2}))-e(\tfrac{k}{n})Q(e(\tfrac{k}{n/2}))
$$
所以，只需要求出$P(e(\tfrac{k}{n/2}))\text{和}Q(e(\tfrac{k}{n/2}))$就可以确定$f(e(\tfrac{k+n/2}{n}))$和$f(e(\frac{k}{n}))$，也就是可以用模$\dfrac{n}{2}$完全剩余系的函数值，就可以确定模$n$完全剩余系的函数值，相当于化简了一半的计算量，从而复杂度降至$O(nlog\ n)$。
```cpp
//递归版本
void DFT(comp *f, int n) {
    if (n == 1) return;
    for (int i = 0; i < n; i++) tmp[i] = f[i];
    for (int i = 0; i < n; i++) {
        if (i & 1) f[(n >> 1) + (i >> 1)] = tmp[i];
        else f[i >> 1] = tmp[i];
    }
    comp *p = f, *q = f + (n >> 1);
    DFT(p, n >> 1), DFT(q, n >> 1);
    comp w = comp(1, 0), step = exp(I * (2 * PI / n));
    for (int i = 0; i < n >> 1; i++, w *= step) {
        tmp[i] = p[i] + w * q[i];
        tmp[i + (n >> 1)] = p[i] - w * q[i];
    }
    for (int i = 0; i < n; i++) f[i] = tmp[i];
}
```
##### 位逆序置换
bit-reversal permutation，国内也称蝴蝶变换

考虑奇偶变化导致的系数序列的变换。

$\{0,1,2,3,4,5,6,7\}$
$\{0,2,4,6\},\{1,3,5,7\}$
$\{0,4\},\{2,6\},\{1,5\},\{3,7\}$
$\{0\},\{4\},\{2\},\{6\},\{1\},\{5\},\{3\},\{7\}$

写成二进制的形式后就发现对应位置数，正好二进制翻转了一次。如：$6(110)\rightarrow 3(011)$。

这个操作可以在$O(n)$从小到大实现，记$x$进行二进制翻转后变为$R(x)$，如果现在要处理的是$R(x)$，我们已经有了$R(\lfloor \frac{x}{2}\rfloor)$，如果把$R(\lfloor \frac{x}{2}\rfloor)$右移一位，结果就是$x$**除了二进制个位**外的其他位翻转结果。个位反转后一定到达最高位，如果个位是1，反转后最高位也就是1，反之为0。

举个例子 $k=5$，(后面都是二进制数)求 $R(01101)$，则 $R(0110)=R(00110)=01100$，再右移一位，得 $0110$，又因为原数二进制个位为 $1$，则 $0110$ 最高位补 $1$，变为 $10110$，则 $R(01101)=10110$。

```cpp
for (len = 1, l = 0; len <= n + m; len <<= 1, ++l);、
//注意这个位置len大于两个相乘的多项式长度之和
//len为上述的n
//(1<<l)=len,l为len二进制下的长度
for (int i = 0; i < len; i++) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (l - 1));//求rev[]对于一个len可以只做一次
for (int i = 0; i < len; i++) if (i < rev[i]) swap(f[i], f[rev[i]]);//保证只翻转一次,每次做DFT或IDFT都要做一次
```
##### 离散傅里叶逆变换

从Lagrange插值知，从点值表示法转成系数表示法（离散傅里叶逆变换）也就是解下面这个方程（已知 $y_0,y_1,\cdots, y_{n-1}$，求 $a_0, a_1,\cdots, a_{n-1}$）：

$$
\begin{bmatrix}y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1} \end{bmatrix} = \begin{bmatrix}1 & 1 & 1 & 1 & \cdots & 1 \\ 1 & e(\frac{1}{n}) & e(\frac{2}{n}) & e(\frac{3}{n}) & \cdots & e(\frac{n-1}{n}) \\ 1 & e(\frac{2}{n}) & e(\frac{4}{n}) & e(\frac{6}{n}) & \cdots & e(\frac{2(n-1)}{n}) \\ 1 & e(\frac{3}{n}) & e(\frac{6}{n}) & e(\frac{9}{n}) & \cdots & e(\frac{3(n-1)}{n}) \\ \vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & e(\frac{n-1}{n}) & e(\frac{2(n-1)}{n}) & e(\frac{3(n-1)}{n}) & \cdots & e(\frac{(n-1)^2}{n}) \end{bmatrix} \begin{bmatrix} a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1} \end{bmatrix}
$$

发现中间矩阵的逆矩阵如下，（每个元素取倒数，再除$n$）

$$
\begin{bmatrix}\frac{1}{n} & \frac{1}{n} & \frac{1}{n} & \frac{1}{n} & \cdots & \frac{1}{n} \\ \frac{1}{n} & e(\frac{-1}{n})/n & e(\frac{-2}{n})/n & e(\frac{-3}{n})/n & \cdots & e(\frac{-(n-1)}{n})/n \\ \frac{1}{n} & e(\frac{-2}{n})/n & e(\frac{-4}{n})/n & e(\frac{-6}{n})/n & \cdots & e(\frac{-2(n-1)}{n})/n \\ \frac{1}{n} & e(\frac{-3}{n})/n & e(\frac{-6}{n})/n & e(\frac{-9}{n})/n & \cdots & e(\frac{-3(n-1)}{n})/n \\ \vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\ \frac{1}{n} & e(\frac{-(n-1)}{n})/n & e(\frac{-2(n-1)}{n})/n & e(\frac{-3(n-1)}{n})/n & \cdots & e(\frac{-(n-1)^2}{n})/n \end{bmatrix}\\=\begin{bmatrix}\frac{1}{n} & 0 & \cdots & 0 \\ 0 & \frac{1}{n} & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \frac{1}{n} \end{bmatrix}\begin{bmatrix}1 & 1 & 1 & 1 & \cdots & 1 \\ 1 & e(\frac{-1}{n}) & e(\frac{-2}{n}) & e(\frac{-3}{n}) & \cdots & e(\frac{-(n-1)}{n}) \\ 1 & e(\frac{-2}{n}) & e(\frac{-4}{n}) & e(\frac{-6}{n}) & \cdots & e(\frac{-2(n-1)}{n}) \\ 1 & e(\frac{-3}{n}) & e(\frac{-6}{n}) & e(\frac{-9}{n}) & \cdots & e(\frac{-3(n-1)}{n}) \\ \vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & e(\frac{-(n-1)}{n}) & e(\frac{-2(n-1)}{n}) & e(\frac{-3(n-1)}{n}) & \cdots & e(\frac{-(n-1)^2}{n}) \end{bmatrix}
$$
于是
$$
\begin{bmatrix}\frac{1}{n} & 0 & \cdots & 0 \\ 0 & \frac{1}{n} & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \frac{1}{n} \end{bmatrix}\begin{bmatrix}1 & 1 & 1 & 1 & \cdots & 1 \\ 1 & e(\frac{-1}{n}) & e(\frac{-2}{n}) & e(\frac{-3}{n}) & \cdots & e(\frac{-(n-1)}{n}) \\ 1 & e(\frac{-2}{n}) & e(\frac{-4}{n}) & e(\frac{-6}{n}) & \cdots & e(\frac{-2(n-1)}{n}) \\ 1 & e(\frac{-3}{n}) & e(\frac{-6}{n}) & e(\frac{-9}{n}) & \cdots & e(\frac{-3(n-1)}{n}) \\ \vdots & \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & e(\frac{-(n-1)}{n}) & e(\frac{-2(n-1)}{n}) & e(\frac{-3(n-1)}{n}) & \cdots & e(\frac{-(n-1)^2}{n}) \end{bmatrix}\begin{bmatrix}y_0 \\ y_1 \\ y_2 \\ y_3 \\ \vdots \\ y_{n-1} \end{bmatrix}=\begin{bmatrix} a_0 \\ a_1 \\ a_2 \\ a_3 \\ \vdots \\ a_{n-1} \end{bmatrix}
$$
发现就是将之前代入的值$e(\frac{k}{x})\text{变为}e(\frac{-k}{x})$对函数值做DFT变换，最后再都除$n$，就是IDFT变换了，真实妙极了（`^0^`）。

由$Euler$定理有：$e(\frac{-k}{x})=e^{\frac{-2\pi k}{x}i}=cos(\frac{2\pi k}{x})-i\cdot sin(\frac{2\pi k}{x})$，所以就是修改 $sin$ 前的正负号即可。

完整版FFT
```cpp
void fft(comp *f, int fg) {//fg=1为DFT,fg=-1为IDFT
	//蝴蝶变换只需要在主函数执行fft之前对长度len做一次就行了
    for (int i = 0; i < len; i++) if (i < rev[i]) swap(f[i], f[rev[i]]);
    for (int i = 2; i <= len; i <<= 1) {//i为当前多项式长度
        comp wn(cos(2 * PI / i), sin(2 * fg * PI / i));//步长
        for (int j = 0; j < len; j += i) {//j为当前多项式起始点
            comp w(1, 0);//单位
            //k枚举一半当前多项式长度，即可求出当前多项式对应的函数值
            for (int k = j; k < j + (i >> 1); k++, w = w * wn) {
                comp p = f[k], q = w * f[k + (i >> 1)];
                f[k] = p + q;
                f[k + (i >> 1)] = p - q;
            }
        }
    }
    if (fg == -1) {
        for (int i = 0; i < len; i++) {
            f[i].x /= len;//如果是IDFT还要都除总长
        }
    }
}
```
可以发现FFT其实就是计算一个$\text{特殊的}n\text{阶矩阵}\times n\text{维向量}$的矩阵乘法。

设$\{a_i\},\{b_i\}$为两个数列，那么两个数列的卷积为$\{c_k:\sum\limits_{i+j=k}a_ib_j\}$

类比多项式乘法，令$A(x)=\sum a_ix^i,B(x)=\sum b_ix^i$，则$C(x)=\sum c_kx^k=A(x)B(x)$

所以，卷积也可以用FFT来做。

[oi-wiki](https://oi-wiki.org/math/poly/fft/)       [练习参考](https://blog.csdn.net/qq_38944163/article/details/81835205)

##### 快速数论变换
NTT:number theoretic transforms

由于FFT中需要用到单位复根的次幂形成环，这和原根十分类似，考虑用原根代替复数，原根的各种性质可以移步 [原根的性质及应用](/posts/30216/)。

首先会用到大质数$P=998244353=17\cdot7\cdot2^{23}+1,g=3$。记 $\omega = g^{\frac{p-1}{n}}$，如果用$\omega$来代替$e(\frac{1}{n})$，可以发现通过 [原根的性质 - 命题5](/posts/30216/#命题5) 得：$\delta_p(\omega)=\delta_p(g^{\frac{p-1}{n}})=\frac{\delta_p(3)}{gcd(\delta_p(3),\frac{p-1}{n})}=\frac{p-1}{\frac{p-1}{n}}=n$。

于是当 $a\equiv b\pmod n$ 时，有 $e(\frac{a}{n})=e(\frac{b}{n})$ 和 $\omega^a\equiv\omega^b\pmod p$，且具有 $\omega^n\equiv1,\omega^{\frac{n}{2}}\equiv-1$ 性质。

在逆变换中，类似FFT一样取 $\omega$ 在 $\bmod p$ 下的逆元即可。（证明也可利用矩阵乘法和 $\omega^{\frac{n}{2}}=-1$ 性质）

```cpp
void ntt(int *f, int fg) {
    for (int i = 0; i < n; i++) if (i < rev[i]) swp(f[i], f[rev[i]]);
    for (int i = 2; i <= n; i <<= 1) {
        int wn = ksm(3, (MOD - 1) / i, MOD);
        if (fg == -1) wn = ksm(wn, MOD - 2, MOD);//如果求IDFT就求wn的逆
        for (int j = 0; j < n; j += i) {
            int w = 1;
            for (int k = j; k < j + (i >> 1); k++, (w *= wn) %= MOD) {
                int u = f[k], v = (w * f[k + (i >> 1)]) % MOD;
                f[k] = (u + v) % MOD;
                f[k + (i >> 1)] = ((u - v) % MOD + MOD) % MOD;
            }
        }
    }
    if (fg == -1) {
        int inv = ksm(n, MOD - 2, MOD);
        for (int i = 0; i < n; i++) (f[i] *= inv) %= MOD;
    }
}
```

##### 应用
- 卷积：$c_k=\sum\limits_{i+j=k}a_ib_j=\sum\limits^{k}_{i=0}a_ib_{k-i}$
- 回文子序列（只有两种字符a和b）[P4199 万径人踪灭](https://www.luogu.com.cn/problem/P4199)：构建两个多项式 $f$ 和 $g$ ，令 $f$ 所有原串中a的位置系数为1，b的位置系数为0。$g$ 反之。然后 $f$ 自乘，$i$ 位置的结果就是以 $\frac{i}{2}$ 为对称中心，两个a的字符对称的组数两倍。$g$ 同理。然后把 $f$ 和 $g​$ 对应的每一位都加起来再减去`((i&1)^1)`(对称中心在某个字符上)，求2次幂再减1。
- 单模式串匹配（带模式串和文本串都可以含有任意多个通配符） [P4173 残缺的字符串](https://www.luogu.com.cn/problem/P4173)

令 $A(x)$ 为模式串x位字符（长度为 $m$），$B(x)$ 为文本串x为字符（长度为 $n$）。先不考虑通配符，构造匹配函数 $C(x)=(A(x)-B(x))^2$ 如果x位两个串字符相同就是0反之非0。再构造完全匹配函数（以文本串x位结尾连续m位是否和模式串匹配，结果为0是匹配，否则不匹配） 

完全匹配函数：$P(x)=\sum\limits_{i=0}^{m-1}C(i,x-m+1+i)=\sum\limits_{i=0}^{m-1}(A(i)-B(x-m+1+i))^2$。

令 $D(x)=A(m-1-x)$，则 $A(x)=D(m-1-x)$，于是 

$$
\begin{aligned}P(x)&=\sum\limits_{i=0}^{m-1}(D(m-1-i)-B(x-m+1+i))^2\\&=\sum\limits_{i=0}^{m-1}(D^2(m-1-i))+\sum\limits_{i=0}^{m-1}B^2(x-m+1+i)-2\sum\limits_{i=0}^{m=1}B(x-m+1+i)D(m-1-i)\end{aligned}
$$

观察多项式，发现第一项为常数，第二项可以用 $B(x)$ 的前缀和求得，第三项就是 $\sum\limits_{i+j=x}B(i)D(j)$ 卷积形式FFT求出。

现在考虑含有通配符，若模式串x位为通配符，则令 $A(x)=0$，文本串同理。

那么匹配函数变为 $C(x)=(A(x)-B(x))^2A(x)B(x)$。

还是以一样的操作令 $D(x)=A(m-1-x)$，则完全匹配函数
$$
\begin{aligned}
P(x)&=\sum\limits_{i=0}^{m-1}(D(m-1-i)-B(x-m+1+i))^2D(m-1-i)B(x-m+1+i)\\&=\sum\limits_{i+j=x}D^3(i)B(j)+\sum\limits_{i+j=x}D(i)B^3(j)-2\sum\limits_{i+j=x}D^2(x)B^2(j)
\end{aligned}
$$
分别对 $D,D^2,D^3,B,B^2,B^3$ 做DFT，然后求出 $P$ 的点值表式，最后对 $P$ 做IDFT即可。

### 其他
#### 逆波兰表达式
正则表达式：`((4+5)*6-5)*2+3*2`

逆波兰表达式：`4 5 + 6 * 5 - 2 * 3 2 * +`

逆波兰表达式运算方法：构建一个栈，从左到右遍历逆波兰表达式，若遇到数字就压栈，若遇到运算符，取出栈顶两个元素，将这两个元素进行该运算符计算，将计算结果再压回栈中。

遍历完逆波兰表达式后，栈中一定只有一个元素，该元素即为最后的结果。

- 生成逆波兰表达式

使用两个栈，记为S1和S2，S1存储逆波兰表达式，S2为辅助栈只用于存储运算符。

定义运算符的优先级（从低到高）：`() + - * /`（`+-`同级，`*/`同级）

从左到右处理正则表达式：

若遇到数字压入S1中。

若遇到运算符`opt`，若S2栈顶元素优先级 $\ge$ `opt`，则弹出S2栈顶元素，并将其压入S1中，如此操作直到S2栈顶元素优先级 $<$ `opt`，或者S1为空，再将`opt`压入S1中。（注：当`opt=')'`时，不用压入栈中，要把`(`弹出）

```cpp
char to[256];
string s;
int len, i;
int stk1[N], stk2[N], tp1, tp2, dig[N];
int get_digit() {
    int ret = s[i++] - '0';
    while (isdigit(s[i])) ret = ret * 10 + s[i++] - '0';
    return ret;
}
int work(int a, int b, char c) {
    if (c == '+') return a + b;
    if (c == '-') return a - b;
    if (c == '*') return a * b;
    return a / b;
}
signed main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    to[')']= 1;
    to['+'] = to['-'] = 2;
    to['*'] = to['/'] = 3;
    while (1) {
        cin >> s;
        len = s.size();
        tp1 = tp2 = 0;
        for (i = 0; i < len;) {
            if (isdigit(s[i])) stk1[++tp1] = get_digit(), dig[tp1] = 1;
            else {
                int c = s[i++];
                while (tp2 && c != '(' && (to[stk2[tp2]] >= to[c]))
                    stk1[++tp1] = stk2[tp2--], dig[tp1] = 0;
                if (c == ')') --tp2;
                else stk2[++tp2] = c;
            }
        }
        while (tp2) stk1[++tp1] = stk2[tp2--], dig[tp1] = 0;
        for (int i = 1; i <= tp1; i++) {
            if (dig[i]) stk2[++tp2] = stk1[i];
            else stk2[tp2 - 1] = work(stk2[tp2 - 1], stk2[tp2], stk1[i]), tp2--;
        }
        cout << stk2[1] << endl;
    }
    return 0;
}
```

#### 绝对值
##### 多个相减的绝对值求最值
求 $\sum_{i=1}^{N}|x-a_i|,(a_1\le a_2\le ... \le a_n)$ 的最小值

结论：在 $x = a_{\lfloor \frac{N}{2} \rfloor}$ 时，也就是 $x$ 取中位数的时候，原式有最小值

证明很容易通过讨论 $x < a_{\lfloor \frac{N}{2} \rfloor}$ 和 $x > a_{\lfloor \frac{N}{2} \rfloor}$ 得出

