---
title: 约瑟夫环问题
hide: false
math: true
category:
  - Math
abbrlink: 7922
date: 2021-09-01 18:33:55
index_img:
banner_img:
tags:
 - 数论
---

## 问题描述

> $n$ 个编号从 $1, \cdots, n$ 的人逆时针站成一圈，开始从 $1$ 号开始，每次从当前人开始数 $k$ 个，然后这个人出局，求最后一个人编号多少？

该问题由约瑟夫 (Titus Flavius Josephus)，于公元一世纪提出，他当时求解的是 $n=41, k=2$ 的情况 (maybe `(oﾟvﾟ)ノ` 但他还是很强呀)。

## 线性算法

设 $f(n, k)$ 表示规模为 $n, k$ 的Josephus问题的解（注：这里编号是从0开始计数的，所以最终要将答案+1），于是有如下递推式：
$$
f(n, k) = (f(n-1, k) + k) \bmod n
$$
该递推式不难理解，从 $0$ 开始数 $k$ 个，$k-1$ 号出局，则 $k$ 就是 $n-1$ 个人的局中开始的那个，于是相对来说他在 $n-1$ 的局中又作为 $0$ 号位开始，于是 $n-1$ 局中的解在做相对位移 $k$ 后就是 $n$ 的局中的答案了。

```c++
//递归版
int rec(int n, int k) {
	if (n == 1) return 0;
	return (rec(n-1, k) + k) % n;
}
//循环版
int josephus(int n, int k) {
	int res = 0;
	for (int i = 1; i <= n; i++) res = (res + k) % i;
	return res + 1;
}
```

## 优化

当 $k$ 比较小，$n$ 比较大的情况，线性算法就显得有点力不从心了。

观察递推式 $f(n, k)=(f(n-1, k)+k)\bmod n$ 可以发现，如果当 $n$ 非常大的时候，$\bmod n$ 在该式中就无法发挥作用，那么是不是就可以考虑对 $k$ 直接求和，在保证 $\bmod n$ 不起作用的前提下。

考虑一个顺推，设 $F=f(n,k)$，$x$ 为当前状态 $f(n,k)$ 能最多往后面直接累加 $x$ 个 $k$，则有：
$$
\begin{aligned}
f(n+x, k)&=f(n, k) + xk < n+x\\
\Rightarrow F+xk &< n + x\\
x &< \left\lfloor \frac{n-F}{k-1} \right\rfloor\\
x &\leqslant \left\lfloor \frac{n-F-1}{k-1} \right\rfloor
\end{aligned}
$$
可以证明，这样做的复杂度为 $O(k\log n)$，证明见 [OI-Wiki 约瑟夫问题 对数算法](https://oi-wiki.org/misc/josephus/#_5)。

```c++
int josephus(int n, int k) {
	if (k == 1) return n;
	int sz = 1, pos = (k-1) % sz;
	while (sz < n) {
		if (pos + k >= sz + 1) { //线性算法
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
```
仔细观察这个写法的时间复杂度其实是 $O(\min(n, k\log n))$，因为 `while` 中间的 `if` 判断了当 $k$ 较小的情况。

## 练习

1. [2018-2019 ACM-ICPC, Asia Shenyang Regional Contest K - Let the Flames Begin](/posts/12560/)
