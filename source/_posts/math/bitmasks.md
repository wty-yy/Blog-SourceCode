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

1. [CF1556D. Take a Guess](/posts/23754/#d-take-a-guess)

2. [CF1451E. Bitwise Queries](/posts/16773/)
