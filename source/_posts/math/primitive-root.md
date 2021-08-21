---
title: 原根的性质及运用
hide: false
math: true
category:
  - Math
tags:
  - 原根
abbrlink: 30216
date: 2021-08-11 22:28:12
index_img:
banner_img:
---

**注：** 本文中 $(a,b)=gcd(a,b), [a,b]=lcm(a,b)$ 习惯了`(*/ω＼*)`

# 阶(指数)

## 定义

设 $(a, m) = 1$，由欧拉定理知：$a^{\varphi(m)} \equiv 1 \pmod m$，则同余方程 $a^x\equiv 1 \pmod m$ 至少有一解

令**阶**为该同余方程的最小正整数解，记为 $\delta_m(a)$

$$
\delta_m(a) := \min\{x : a^x \equiv 1 \pmod m\}
$$

## 性质

---

### 命题1
> 命题1：$a^1,a^2,\ldots,a^{\delta_m(a)}$ 模 $m$ 两两不同余

**证明：** 反设 $\exists i,j\in [1, \delta_m(a)] \text{且} i < j$，使得 $a^i \equiv a^j \pmod m$，则 $a^{j-i}\equiv 1\pmod m$，故 $\delta_m(a)\leqslant j-i$ 与 $\delta_m(a) \geqslant j$ 矛盾

**QED**

---
### 命题2
> 命题2：若有 $a^n\equiv 1\pmod m$ 则 $\delta_m(a) \mid n$

**证明：** 对 $n$ 做对 $\delta_m(a)$ 的带余数除法，则有
$$
n = q\cdot\delta_m(a)+r, 0\leqslant r < \delta_m(a)
$$
反设 $r > 0$，则 $a^{n}\equiv a^{q\cdot\delta_m(a)+r}\equiv a^r\equiv 1\pmod m$ 

故 $\delta_m(a) \leqslant r$ 与 $r < \delta_m(a)$ 矛盾

**QED**

---
### 推论3
> 推论3：$a^p\equiv a^q \pmod m\Rightarrow p \equiv q \pmod{\delta_m(a)}$

**证明：** $a^p\equiv a^q\pmod m\Rightarrow a^{p-q}\equiv 1\pmod m$

由**命题2**知，$\delta_m(a)\mid (p-q)\Rightarrow p\equiv q \pmod{\delta_m(a)}$

**QED**

---

下面给出两个有关阶的**四则运算**的命题
### 命题4
> 命题4：若 $(a, m)=(b, m)=1$，则 $\delta_m(ab) = \delta_m(a)\delta_m(b)\iff (\delta_m(a),\delta(m)b) = 1$

**证明：** "$\Rightarrow$" 由于 $a^{\delta_m(a)}\equiv b^{\delta_m(b)}\equiv 1\pmod m$

则 $(ab)^{[\delta_m(a), \delta_m(b)]}\equiv 1\pmod m$，由**命题2**知：
$$
\delta_m(a)\delta_m(b)=\delta_m(ab)\mid [\delta_m(a),\delta_m(b)]=\frac{\delta_m(a)\delta_m(b)}{(\delta_m(a),\delta_m(b))}\\
\Rightarrow(\delta_m(a),\delta_m(b)) = 1
$$

"$\Leftarrow$" 由于 $(ab)^{\delta_m(ab)} \equiv 1\pmod m$

则 $(ab)^{\delta_m(ab)\delta_m(b)}\equiv a^{\delta_m(ab)\delta_m(b)}\equiv 1\pmod m$

故 $\delta_m(a)\mid \delta_m(ab)\delta_m(b)\Rightarrow \delta_m(a)\mid\delta_m(ab)$

同理，有 $\delta_m(b)\mid \delta_m(ab)$

$\Rightarrow \delta_m(a)\delta_m(b)\mid \delta_m(ab)$

又：$(ab)^{\delta_m(a)\delta_m(b)} \equiv 1\pmod p\Rightarrow \delta_m(ab)\mid\delta_m(a)\delta_m(b)$

故 $\delta_m(ab)=\delta_m(a)\delta_m(b)$

**QED**

---

### 命题5
> 命题5：$\delta_m(a^k)=\frac{\delta_m(a)}{(\delta_m(a), k)}$

**证明：** 由于 $a^{k\cdot\delta_m(a^k)}\equiv 1\pmod m$

则 $\delta_m(a)\mid k\cdot\delta_m(a^k)\Rightarrow \frac{\delta_m(a)}{(\delta_m(a),k)}\mid \delta_m(a^k)$

又 $(a^k)^\frac{\delta_m(a)}{(\delta_m(a), k)}\equiv a^{\delta_m(a)\frac{k}{(\delta_m(a),k)}}\equiv 1\pmod m\Rightarrow \delta_m(a^k)\mid \frac{\delta_m(a)}{(\delta_m(a), k)}$

故 $\delta_m(a^k)=\frac{\delta_m(a)}{(k, \delta_m(a))}$

**QED**

---

# 原根

## 定义

$(a, m)=1$，$a$ 为 $m$ 的原根 $\iff \delta_m(a)=\varphi(m)$

## 判定原根

> **命题1 (判定原根)**：设 $m \geqslant 3, \gcd(a,m)=1$，则 $a$ 是模 $m$ 的原根的充要条件是，对于 $\varphi(m)$ 的每个素因数 $p$，都有 $a^{\frac{\varphi(m)}{p}}\not\equiv 1\pmod m$。

**证明：** 必要性显然，下面证明充分性。

假设 $a$ 不是模 $m$ 的原根，则存在一个 $t<\varphi(p)$ 使得 $a^t\equiv 1\pmod{m}$。

由**裴蜀定理**得，一定存在一组 $k,x$ 满足 $kt=x\varphi(m)+\gcd(t,\varphi(m))$。

又由**欧拉定理**得 $a^{\varphi(m)}\equiv 1\pmod{m}$，故有：

$$
1\equiv a^{kt}\equiv a^{x\varphi(m)+\gcd(t,\varphi(m))}\equiv a^{\gcd(t,\varphi(m))}\pmod{m}
$$

由于 $\gcd(t, \varphi(m)) \mid \varphi(m)$ 且 $\gcd(t, \varphi(m))\leqslant t < \varphi(m)$。

故存在 $\varphi(m)$ 的素因数 $p$ 使得 $\gcd(t, \varphi(m)) \mid \frac{\varphi(m)}{p}$。

则 $a^{\frac{\varphi(m)}{p}}\equiv a^{(t, \varphi(m))}\equiv 1\pmod{m}$，与条件矛盾。

故假设不成立，原命题成立。

**QED**

## 原根存在条件

> **命题2 (原根存在条件)**：若 $m$ 的原根存在 $\iff m=1,2,4,p^\alpha,2p^\alpha$，其中 $\alpha\geqslant 1$，$p$ 为奇素数。

证明：要拆分命题，很是复杂，见 [原根存在定理](https://oi-wiki.org/math/number-theory/primitive-root/#_7)。

## 最小原根的数量级

[王元](https://baike.baidu.com/item/%E7%8E%8B%E5%85%83/17475) 于 $1959$ 年证明了若 $m$ 存在原根，则最小的原根不多于 $m^{0.25}$ 级别的。证明略去。

# 应用

## 求m的所有原根

例题：[P6091 【模板】原根](https://www.luogu.com.cn/problem/P6091)

由阶的性质中的[命题5](./#命题5)知，若 $a$ 为 $m$ 的原根，则对于 $\forall k\in [1, \varphi(m)], (k, \varphi(m))=1$ 有：
$$
\delta_m(a^k) = \frac{\delta_m(a)}{(k, \delta_m(a))} = \frac{\varphi(m)}{(k, \varphi(m))} = \varphi(m)
$$
故在模 $m$ 下，$m$ 的原根一共有 $\varphi(\varphi(m))$ 个。

又由阶的性质中的[命题1](./#命题1)知，$a^k$ 两两不同，则可以通过一个原根生成其他的原根。

又由于最小的原根不多于 $m^{0.25}$，则可以先暴力枚举出第一个原根，然后利用这一个原根生成其他的原根。
{% spoiler 点击显/隐代码 %}
```c++
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
            int p = prim[j];
            vis[i * p] = 1;
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
    return 0;
}
```
{% endspoiler %}

## 例题

### ABC212 G

[G - Power Pair](/posts/4194/#g-power-pair)
