---
title: 模拟退火
hide: false
math: true
category:
 - coding
 - algorithm
tags:
  - 模拟退火
abbrlink: 21151
date: 2021-09-01 12:15:43
index_img:
banner_img:
---

## 简介

总所周知，模拟退火十分玄学，用于求解某些方案数极大（无穷）的问题上，有些NP问题在小范围上，可以使用模拟退火求最优解（TSP问题）。

## 实现

- 如果新的状态解更优，则更新答案，否则以一定概率接受新状态。

### 状态转移

假如现在要求状态的**最小值**。

定义：$T$ 为当前温度，$E_1$ 为新状态，$E_0$ 为原状态，则发生状态转移的概率为：
$$
P(E_1-E_0)=\begin{cases}
1 & E_1 < E_0\\
e^{\frac{-(E_1-E_0)}{T}} & E_1 \geqslant E_0
\end{cases}
$$

不难发现如果 $E_1 < E_0$ 直接代入下面的式子中，概率值一定大于1，所以是必然事件，在代码中就不用分类讨论了。

### 退火

设定一个初始温度 $T_0$ 和终止温度 $T_k$，降温系数 $d$。

我个人一般设置：设置 `T0=1e5, Tk=1e-5, d=0.99996 ~ 0.999`

核心代码：

```cpp
void anneal() {
	for (double T = 1e5; T >= 1e-5; T *= 0.9996) {
		//随机一个新状态
		//计算出新状态值 nw，原状态值 state
		if (exp(-(double)(nw-sum)/T) >= (double)rand()/RAND_MAX) {
			//转移至新状态
		} else {
			//返回原状态
		}
        ans = min(ans, state);
	}
}
```

下面是经典退火图：

![simulated-annealing](https://oi-wiki.org/misc/images/simulated-annealing.gif)

来源 [Wiki - Simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing)。

### 卡时

如果一次退火无法求出最优解，可以在其基础上，再多进行几次退火，用 `clock()` 函数卡时。

```c++
int st = clock();
do anneal(); while ((double)(clock()-st) / CLOCKS_PER_SEC < MAX_TIME);
//注：其中MAX_TIME接近题目时限，以秒为单位。
//在anneal()函数中也要加入
if ((double)(clock()-st) / CLOCKS_PER_SEC >= MAX_TIME) return;
//避免一次退火操作超时
```

## 练习题

1. [CF1556H - DIY Tree](/posts/23754/#h-diy-tree)
