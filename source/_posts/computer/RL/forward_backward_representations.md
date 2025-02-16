---
title: 无奖励强化学习FB算法
hide: false
math: true
category:
  - 强化学习
abbrlink: 52897
date: 2025-02-16 13:02:15
index\_img:
banner\_img:
tags:
---

> 原论文[demo - metamotivo](https://metamotivo.metademolab.com/), [GitHub - metamotivo](https://github.com/facebookresearch/metamotivo)

## 思路

这种无奖励强化学习本质上是通过采用的方式，将奖励 $r(s)$ 通过 $B(s)$ 映射到低维空间 $\mathbb{R}^d$ 中，得到低维空间表示 $z\in\mathbb{R}^d$，再通过 $\pi$ 将低维空间中映射到策略空间 $\Pi$ 中。但训练还差对价值函数 $Q^{\pi}(s,a)$ 估计，因此还需引入 $F(s,a|\pi)\in\mathbb{R}^d$ 将策略重新映射回低维空间，通过内积得到价值函数估计 $Q^{\pi}(s,a) = \lang F(s,a|\pi), B(s)\rang = F(s,a|\pi)^TB(s)$，流程图如下所示：
<img src=/figures/RL/FB_representations/FB_diagram.png width=50%/>

> 这里将低维空间 $z$ 限制在半径为 $\sqrt{d}$ 的球面上，便于表示，也便于作为神经网络的输入

## 理论推导
### 前置芝士
首先进行符号定义，设 $S,A$ 分别为状态空间和动作空间，正整数 $d\in \mathbb{Z}^+$ 为低维空间维数，$\text{Pr}_{t}(s'|s,a,\pi)$，表示从 $s,a$ 状态 $s$ 执行动作 $a$ 出发通过策略 $\pi$ 在第 $t$ 步到达 $s'$ 的概率；类似地，$\mathbb{E}[r_t|s,a,\pi]$ 表示从状态 $s$ 执行动作 $a$ 出发通过策略 $\pi$ 在第 $t$ 步获得奖励 $r(s_t)$ 的期望

上述思路可以用完整的理论进行描述，定义

1. Forward Function: $F(s,a,z): S\times A\times \mathbb{R}^d\to \mathbb{R}^d$. 在上述思路中，$F$ 将策略 $\Pi$ 映射回 $\mathbb{R}^d$ 中，但由于 $\pi$ 难以表述，且存在 $\Pi$ 和 $\mathbb{R}^d$ 的映射关系 $\pi$，因此可以通过 $z$ 来描述 $\Pi$ 中的元素
2. Backward Function: $B(s): S\to \mathbb{R}^d$
3. Policy Function: $\pi(s,z): S\times \mathbb{R}^d\to A$

那么 $F,B,\pi$ 应该如何优化，他们应该满足什么关系？是否应该从Bellman方程寻找？我们与价值函数相关的Bellman方程，都带有奖励无法推导，但是**后继度量**（Successor measures）与奖励无关。

### 定义1（后继度量）

$\forall X\subset S, s\in S, a\in A, \pi\in \Pi$，后继度量 $M^{\pi}: S\times S\times A\to \mathbb{R}$ 为
$$
M^{\pi}(X|s,a):=\sum_{t=0}^{\infty}\gamma^t\text{Pr}_{t+1}(s'\in X|s,a,\pi)
$$
其中 $\gamma\in\mathbb{R}$ 为折扣系数

> 后继度量可以表示在策略 $\pi$ 下，从状态动作 $s,a$ 出发，到达 $X$ 中状态的累计折后概率大小
> P.S. 在PPO算法中，也用到了后继度量，即[Blog - PPO 推论1 策略回报参数形式](/posts/529/#%E6%8E%A8%E8%AE%BA1-%E7%AD%96%E7%95%A5%E5%9B%9E%E6%8A%A5%E5%8F%82%E6%95%B0%E5%BD%A2%E5%BC%8F)中的 $\rho_{\tilde{\pi}}(S)$

不难发现，后继度量的Bellman方程为
$$
\tag{1}M^{\pi}(X|s,a) = P(X|s,a) + \gamma\mathbb{E}_{\substack{s'\sim p(\cdot|s,a)\\a'\sim\pi(\cdot|s')}}[M^{\pi}(X|s',a')]
$$

---

### 命题1（后继度量与动作价值函数）
设动作价值函数 $Q^{\pi}(s,a) := \sum_{t=0}^{\infty}\gamma^t\mathbb{E}[r_{t+1}|s,a,\pi]$，则
$$
Q^{\pi}(s,a) = \int_{s'\in S}M_{\pi}(s'|s,a)r(s')\mathrm{d}s'
$$

**证明**：
$$
\begin{aligned}
Q^{\pi}(s,a) =&\  \sum_{t=0}^{\infty}\gamma^t\mathbb{E}[r_{t+1}|s,a,\pi] = \sum_{t=0}^{\infty}\gamma^t\mathbb{E}_{s_{t+1}}[r(s_{t+1})|s,a,\pi] \\
=&\ \sum_{t=0}^{\infty}\gamma^t\int_{s'\in S}\text{Pr}_{t+1}(s'|s,a,\pi)r(s')\mathrm{d}s'\\
=&\ \int_{s'\in S}r(s')\sum_{t=0}^{\infty}\gamma^t\text{Pr}_{t+1}(s'|s,a,\pi)\mathrm{d}s'\\
=&\ \int_{s'\in S}M_{\pi}(s'|s,a)r(s')\mathrm{d}s'\\
\end{aligned}
$$
---
这里假如我们将 $M_{\pi_z}$ 分解为 $F(s,a,z)^T B(s')$，不难发现，后面 $B(s')r(s')$ 就正好是将 $r$ 映射到低维空间 $z$ 上，而 $F(\cdot,\cdot,z)$ 就是将 $z$ 对应的策略 $\pi(\cdot,z)$ 映射回低维空间中，于是有
### 命题2（M_pi的FB分解）
$\forall z\in\mathbb{R}^d$，若存在 $F(s,a,z): S\times A\times \mathbb{R}^d\to \mathbb{R}^d, B(s): S\to \mathbb{R}^d, \pi_z(s)=\pi(s,z): S\times \mathbb{R}^d\to A$，分布 $\rho: S\to \mathbb{R}$，使得
$$
M_{\pi_z}(X|s,a) = \int_{s'\in X}F(s,a,z)^TB(s')\rho(s')\mathrm{d}s' = F(s,a,z)^T\mathbb{E}_{s'\sim\rho,s'\in X}[B(s')]
$$
则当 $z=\mathbb{E}_{s\sim\rho}[B(s)r(s)]$ 时，$Q^{\pi_z}(s,a)=F(s,a,z)^Tz$.
**证明**：
$$
\begin{aligned}
Q^{\pi_z}(s,a) =&\ \int_{s'\in S}M_{\pi_z}(s'|s,a)r(s')\mathrm{d}s'\\
=&\ \int_{s'\in S}F(s,a,z)^TB(s')\rho(s')r(s')\mathrm{d}s'\\
=&\ F(s,a,z)^T\mathbb{E}_{s\sim \rho}[B(s)r(s)] = F(s,a,z)^Tz
\end{aligned}
$$
---

这样我们就把奖励函数 $r$ 完全映射到 $\mathbb{R}^d$ 中，整个模型的更新与 $r$ 无关。
### 定理1（FB约束及无监督RL）
假设存在 $F(s,a,z): S\times A\times \mathbb{R}^d\to \mathbb{R}^d, B(s): S\to \mathbb{R}^d, \pi_z(s): S\times \mathbb{R}^d\to A$ 使得 $\forall z\in\mathbb{R}^d, s,s'\in S, a\in A, X\subset S$ 有
$$
\tag{2}M_{\pi_z}(X|s,a)=F(s,a,z)^T\mathbb{E}_{s'\sim\rho, s'\in X}[B(s')]
$$
$$
\tag{3}\pi_z(s)=\argmax_{a\in A}F(s,a,z)^Tz
$$

{% spoiler 另一种写法 %}
$$
\begin{cases}
M_{\pi_z}(s'|s,a)=F(s,a,z)^TB(s')\rho(s')\\
\pi_z(s)=\argmax_{a\in A}F(s,a,z)^Tz
\end{cases}
$$
{% endspoiler %}
对任意奖励函数 $r: A\to \mathbb{R}$，令 $z=\mathbb{E}_{s\sim\rho}[B(s)r(s)]$，有 $\pi_z$ 是 $\text{MDP}=\{S,A,r,P,\mu\}$ 下的最优策略.
**证明：** 由命题2可得 $\pi_z(s)=\argmax_{a\in A}Q^{\pi_z}(s,a)$，即 $\pi_z(s)$ 为最优策略.

---

这样我们就找到一个目标等式 $(2)$ 式，以及策略优化目标 $(3)$ 式，$(3)$ 式可以用经典RL算法解决（PPO, TD3, SAC等），而 $(1)$ 式则需要通过Bellman方程找到损失函数（与DQN的Q值损失类似）

### 定义2（FB损失）
将 $F,B$ 用神经网络参数化 $\theta, \omega$，则FB损失定义如下
$$
\begin{aligned}
\mathcal{L}_{FB}(\theta,\omega):=&\ \frac{1}{2}\left[\mathbb{E}_{\substack{s'\sim p(\cdot|s,a),a'\sim\pi(\cdot|s')\\s''\sim\rho,s''\in X}}[F_{\theta}(s,a,z)^TB_{\omega}(s'')-\gamma\bar{F}_{\theta}(s',a',z)^T\bar{B}_{\omega}(s'')\right]^2 \\
&\qquad - F_{\theta}(s,a,z)^T\mathbb{E}_{\substack{s'\sim\rho\\s'\in X}}[B_{\omega}(s')]
\end{aligned}
$$
**解释**：将 $M^{\pi}$ 的重表示 $(2)$ 式，带入其Bellman方程 $(1)$ 式，我们期望将减小Bellman残差作为优化目标，即将左式作为当前网络，减去右式估计值求 $\ell_2$ 范数，从而作为当前参数的损失：
$$
\begin{aligned}
\mathcal{L}(\theta,\omega) =&\ \left[F_{\theta}(s,a,z)\mathbb{E}_{\substack{s'\sim\rho\\s'\in X}}[B_{\omega}(s')]-P(X|s,a)-\gamma\mathbb{E}_{\substack{s'\sim p(\cdot|s,a)\\a'\sim\pi(\cdot|s')}}\bar{F}_{\theta}(s',a',z)\mathbb{E}_{\substack{s''\sim\rho\\s''\in X}}[\bar{B}_{\omega}(s'')]\right]^2\\
=&\ \left[\mathbb{E}_{\substack{s'\sim p(\cdot|s,a),a'\sim\pi(\cdot|s')\\s''\sim\rho,s''\in X}}[F_{\theta}(s,a,z)B_{\omega}(s'')-\gamma\bar{F}_{\theta}(s',a',z)\bar{B}_{\omega}(s'')]\right]^2\\
&\quad -2P(X|s,a)F_{\theta}(s,a,z)\mathbb{E}_{\substack{s'\sim\rho\\s'\in X}}[B_{\omega}(s')] - 2\gamma P(X|s,a)\mathbb{E}_{\substack{s'\sim p(\cdot|s,a)\\a'\sim\pi(\cdot|s')}}\bar{F}_{\theta}(s',a',z)\mathbb{E}_{\substack{s''\sim\rho\\s''\in X}}[\bar{B}_{\omega}(s'')]
\end{aligned}
$$
对 $\theta,\omega$ 取 $\min$ 可以消去第三项，取 $X$ 为多个轨迹片段，则对于 $(s,a,s')$ 有
从而
$$
\begin{aligned}
\min_{\theta,\omega}\mathcal{L}_{FB}(\theta,\omega)\iff&\ \min_{\theta,\omega}\frac{1}{2}\left[\mathbb{E}_{\substack{s'\sim p(\cdot|s,a),a'\sim\pi(\cdot|s')\\s''\sim\rho,s''\in X}}[F_{\theta}(s,a,z)^TB_{\omega}(s'')-\gamma\bar{F}_{\theta}(s',a',z)^T\bar{B}_{\omega}(s'')\right]^2 \\
&\qquad\qquad -F_{\theta}(s,a,z)^T\mathbb{E}_{\substack{s'\sim P(\cdot|s,a)\\s'\sim \rho}}B_{\omega}(s')
\end{aligned}
$$

---
假设batch大小为 $n$，我们可以通过某些方法，得到 $z_i$ 对应的轨迹片段，$(s_i,a_i,s'_i,z_i),\cdots$，采样 $a'_i\sim \pi(\cdot|s_i,z_i)$，计算损失
$$
\mathcal{L}_{FB}(\theta,\omega) = \frac{1}{n(n-1)}\sum_{i\neq j}\left[F_{\theta}(s_i,a_i,z_i)^TB_{\omega}(s_j)-\gamma\bar{F}_{\theta}(s'_i,a'_i,z_i)^T\bar{B}_{\omega}(s_j)\right]^2 - \frac{1}{n}\sum_{i}F_{\theta}(s_i,a_i,z_i)^TB_{\omega}(s'_i)
$$


