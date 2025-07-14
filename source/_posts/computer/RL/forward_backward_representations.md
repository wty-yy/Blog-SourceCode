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

> 组会PPT介绍：[金山文档 - FB算法学习20250715.pptx](https://kdocs.cn/l/cgcL4KbvqrPp)

## 思路

这种无奖励强化学习本质上是通过采样的方式，将奖励 $r(s)$ 通过 $B(s)$ 映射到低维空间 $\mathbb{R}^d$ 中，得到低维空间表示 $z\in\mathbb{R}^d$，再通过 $\pi$ 将低维空间中映射到策略空间 $\Pi$ 中。但训练还差对价值函数 $Q^{\pi}(s,a)$ 估计，因此还需引入 $F(s,a|\pi)\in\mathbb{R}^d$ 将策略重新映射回低维空间，通过内积得到价值函数估计 $Q^{\pi}(s,a) = \lang F(s,a|\pi), B(s)\rang = F(s,a|\pi)^TB(s)$，流程图如下所示：
<img src=/figures/RL/FB_representations/FB_diagram.png width=50%/>

> 这里将低维空间 $z$ 限制在半径为 $\sqrt{d}$ 的球面上，便于表示，也便于作为神经网络的输入

## FB理论推导
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
\tag{1}M^{\pi}(X|s,a) = P(X|s,a) + \gamma\mathbb{E}_{\substack{s'\sim p(\cdot|s,a)\\
a'\sim\pi(\cdot|s')}}[M^{\pi}(X|s',a')]
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
=&\ \int_{s'\in S}M_{\pi}(s'|s,a)r(s')\mathrm{d}s'
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
\mathcal{L}_{FB}(\theta,\omega):=&\ \frac{1}{2}\left[\mathbb{E}_{\substack{s'\sim p(\cdot|s,a),a'\sim\pi(\cdot|s')\\s''\sim\rho,s''\in X}}\left[F_{\theta}(s,a,z)^TB_{\omega}(s'')-\gamma\bar{F}_{\theta}(s',a',z)^T\bar{B}_{\omega}(s'')\right]\right]^2 \\
&\qquad - F_{\theta}(s,a,z)^T\mathbb{E}_{\substack{s'\sim\rho\\s'\in X}}[B_{\omega}(s')]
\end{aligned}
$$
**解释**：将 $M^{\pi}$ 的重表示 $(2)$ 式，带入其Bellman方程 $(1)$ 式，我们期望将减小Bellman残差作为优化目标，即将左式作为当前网络，减去右式估计值求 $\ell_2$ 范数，从而作为当前参数的损失（$\bar{F}, \bar{B}$ 为上次更新得到的网络）：
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
\min_{\theta,\omega}\mathcal{L}_{FB}(\theta,\omega)\iff&\ \min_{\theta,\omega}\frac{1}{2}\left[\mathbb{E}_{\substack{s'\sim p(\cdot|s,a),a'\sim\pi(\cdot|s')\\s''\sim\rho,s''\in X}}\left[F_{\theta}(s,a,z)^TB_{\omega}(s'')-\gamma\bar{F}_{\theta}(s',a',z)^T\bar{B}_{\omega}(s'')\right]\right]^2 \\
&\qquad\qquad - F_{\theta}(s,a,z)^T\mathbb{E}_{\substack{s'\sim\rho\\s'\in X}}[B_{\omega}(s')]
\end{aligned}
$$

---
假设batch大小为 $n$，我们可以通过某些方法，得到 $z_i$ 对应的轨迹片段，$(s_i,a_i,s'_i,z_i),\cdots$，采样 $a'_i\sim \pi(\cdot|s_i,z_i)$，计算损失
$$
\mathcal{L}_{FB}(\theta,\omega) = \frac{1}{n(n-1)}\sum_{i\neq j}\left[F_{\theta}(s_i,a_i,z_i)^TB_{\omega}(s_j)-\gamma\bar{F}_{\theta}(s'_i,a'_i,z_i)^T\bar{B}_{\omega}(s_j)\right]^2 - \frac{1}{n}\sum_{i}F_{\theta}(s_i,a_i,z_i)^TB_{\omega}(s'_i)
$$

## 带模仿的正则项理论推导
上述推导虽然已经对 $F_{\theta}, B_{\omega}, \pi_{\phi}$ 进行优化，但是无法保证随机采样生成的 $\pi_{\phi}$ 能够探索到状态空间中足够多的状态，因此我们需要引入充分大的专家数据集用来引导 $\pi_{\phi}$，使其能够充分探索状态空间

> 专家数据集仅有状态构成，记为 $M=\{(s_1,\cdots,s_{l(\tau)})\}=\{\tau\}$

**思考**：为什么专家数据集 $M=\{\tau\}$ 可以探索到更多的状态？我们任取一个状态 $s$，在机器人平衡这个问题上，一定会存在不同策略之间的优劣，而专家可以选择出正确的策略，使得在这些策略下，$s$ 会被更多的探索到，也说明该策略更加稳定，因此会产生一个 $s$ 和策略 $\pi$ 的联合分布，记为 $p_{M}(s,\pi)$，由于策略 $\pi$ 无法作为神经网络输入，因此将 $\pi$ 降维表示到低维空间 $z\in\mathbb{R}^d$ 向量，对应的联合分布变为 $p_{M}(s,z)$
> 策略神经网络 $\pi(\cdot|s,z)$ 可以将 $z$ 和 $s$ 一同作为网络输入

<center>
<img src="/figures/RL/FB_representations/pi_s_distribution.jpg" alt="Pi和s对应分布的理解" width="400" />
<br>
Pi 和 s 对应分布的理解
</center>

那么类似地，对于 $\pi_{\phi}(\cdot|s,z)$ 是否也有联合分布 $p_{\pi_{z}}(s,z)$，对于每个 $s$，在低维空间中也有其对应策略的分布，如果想让 $\pi_{\phi}$ 类似专家策略，探索更多状态，我们应该想要 $p_{\pi_z}(s,z)$ 去近似 $p_{M}(s,z)$

这里可以用 $KL$ 散度进行度量，但由于 $p_{M}(s,z)$ 难以准确估计，因此需要用GAN的思路（本质上是Jensen-Shannon(JS)散度），创建一个判别网络 $D_{\psi}:S\times \mathbb{R}^d\to [0,1]$，判别策略 $s$ 和 $z$ 是否来自 $p_{M}(\cdot|s,z)$ 而非 $p_{\pi_{\phi}}(\cdot|s,z)$，而我们的策略 $\pi_{\phi}$ 期望让 $p_{\pi_{\phi}}(\cdot|s,z)$ 近似 $p_M(\cdot|s,z)$ 从而欺骗 $D_{\psi}$，上述判别器学习过程可以描述为如下GAN损失
$$
\begin{aligned}
\mathcal{L}_{discriminator}(\psi) =&\ -\mathbb{E}_{(s,z)\sim p_{M}}[\log(D_{\psi}(s,z))]-\mathbb{E}_{(s,z)\sim p_{\pi_\phi}}[\log(1-D_{\psi}(s,z))]\\
=&\ -\mathbb{E}_{s\sim M}\left[\log(D_{\psi}(s,\mathbb{E}_{s'\sim\tau(s)}[B(s')])\right] -\mathbb{E}_{z\sim\upsilon,s\sim \rho^{\pi_z}}[\log(1-D_{\psi}(s,z))]
\end{aligned}
$$
上式存在理论最优解 $D^*(s,z)=\frac{p_{M}(s,z)}{p_{M}(s,z)+p_{\pi_z}(s,z)}$
> 证明方法可以直接对 $p_{M}\log D+p_{\pi_z}\log(1-D)$ 中 $D$ 求导，令其等于 $0$

$\pi_z=\pi_{\phi}(\cdot|s,z)$ 的目标是混淆 $D$ 的判断，也就是最大化下述奖励
$$
\max r(s,z) = \log\frac{p_{M}(s,z)}{p_{\pi_z}(s,z)} = \log\frac{D^*}{1-D^*} \approx \log\frac{D_{\psi}}{1-D_{\psi}}
$$

用TD方式对上述折后回报进行估计，令 $Q_{\eta}(s,a):S\times A\to \mathbb{R}$，可以称之为模仿回报，则对应的critic损失为
$$
\mathcal{L}_{critic}(\eta) = \mathbb{E}_{\substack{(s,a,s')\sim D_{online}\\z\sim \upsilon,a'\sim\pi_z(\cdot|s')}}\left[\left(Q_{\eta}(s,a,z)-\log\frac{D_{\psi}(s',z)}{1-D_{\psi}(s',z)}-\gamma \bar{Q}_{\eta}(s',a',z\right)^2\right]
$$
将模仿奖励 $Q$ 作为正则项加入到 $(3)$ 式中得到FB-CPR的actor损失
$$
\tag{4}\mathcal{L}_{actor}(\phi) = \mathbb{E}_{\substack{s\sim D,z\sim\upsilon\\a\sim\pi_{\psi}(\cdot|s,z)}}\left[F_{\theta}(s,a,z)^Tz+\alpha Q_{\eta}(s,a,z)\right]
$$
综上，我们完成了4个主要损失函数的定义
- $\mathcal{L}_{FB}(\theta,\omega)$：优化 $F_{\theta}(s,a,z),B_{\omega}(s)$
- $\mathcal{L}_{discriminator}(\psi)$：优化判别器 $D_{\psi}(s,z)$
- $\mathcal{L}_{critic}(\eta)$：优化模仿回报估计 $Q_{\eta}(s,z)$
- $\mathcal{L}_{actor}(\phi)$：优化策略 $\pi_{\phi}(\cdot|s,z)$

## 训练流程

### 1. 在线数据收集
假设我们维护了一个在线训练buffer $\mathcal{D}_{online}$，并有一个无标记的专家数据集 $\mathcal{M}$ 提供优质轨迹，我们需要随机从二者中随机采样得到策略，分别对应的概率大小为 $\tau_{online},\tau_{unlabled}$，每次采样的轨迹长度记为 $T$

通过随机获取 $z$，并对应到策略 $\pi_{\phi}(\cdot,z)$，从而采样得到轨迹加入到 $\mathcal{D}_{online}$ 中，此处的 $z$ 可以从三种不同的位置获得，我们就可以从三个不同位置获取到 $z$：
$$
z=\begin{cases}
B(s),&\quad s\sim \mathcal{D}_{online}, &\ \text{概率}\tau_{online},\\
\frac{1}{T}\sum_{t=1}^TB(s_t),&\quad \{s_1,\cdots,s_{T}\}\sim \mathcal{M},&\quad \text{概率}\tau_{unlabled},\\
\sim\mathcal{N}(0,I_d),&\quad &\quad \text{概率}1-\tau_{online}-\tau_{unlabled}.
\end{cases}\\
z\gets\sqrt{d}\frac{z}{||z||_2}, \text{用}\pi_{\phi}(\cdot,z)\text{与环境交互}T\text{步，将数据存储入} \mathcal{D}_{online}
$$

### 2. 轨迹采样，编码专家策略
### 3. 计算判别损失
### 4. 在线数据潜特征重采样
### 5. 计算FB，正则，策略损失，更新网络

