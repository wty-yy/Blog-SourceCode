---
title: A2C (Advantage Actor-Critic) 算法
hide: false
math: true
abbrlink: 6031
date: 2023-08-03 15:30:54
index\_img:
banner\_img:
category:
 - RL
tags:
---

# A2C (Advantage Actor-Critic)

## Algorithm 算法

设 $\pi(a|s;\theta)$ 为当前智能体策略网络，其中 $\theta$ 为网络参数，$V_\pi(S)$ 为状态价值函数，最优化目标
$$
\max_\theta\mathbb{E}_S[V_{\pi}(S)] =: J(\theta)
$$
由**带基线的策略梯度定理**可知：
$$
\frac{\partial J(\theta)}{\partial \theta} =
\mathbb{E}_S[\mathbb{E}_{A\sim\pi(\cdot|S;\theta)}[(Q_{\pi}(S,A)) - V_{\pi}(S)\nabla_{\theta}\ln\pi(A|S;\theta)]]
$$
设 $v(s;w)$ 为对策略 $\pi(a|s;\theta)$ 的状态价值估计的网络，其中 $w$ 为网络参数，则对于四元组 $(s,a,r,s')$ ，由Bellman方程可知，$Q_\pi(s,a)$ 的近似为
$$
Q_\pi(s,a)\approx r + \gamma\cdot v(s';w)
$$
则近似策略梯度可以表示为：
$$
\frac{J(\theta)}{\partial\theta} \approx (r+\gamma\cdot v(s';w) - v(s;w))\nabla_\theta\ln\pi(a|s;\theta)
$$

### Model Training 模型训练

对于由策略 $\pi(a|s;\theta)$ 走出的四元组 $(s,a,r,s')$，进行以下计算：

1. **TD target**: $\hat{y} = r + \gamma\cdot v(s';w)$
2. Loss: $\mathcal{L}(w) = \frac{1}{2}||v(s;w)-\hat{y}||_2^2 = \frac{1}{2}||\delta||_2^2$ where $\delta = v(s;w) - \hat{y}$ is the **TD error**
3. Approximate gradient: $g = (\hat{y}-v(s;w))\nabla_\theta\ln\pi(a|s;\theta) = -\delta\cdot\nabla_\theta\ln\pi(a|s;\theta)$

4. Update value network: $w\gets w - \alpha \frac{\partial\mathcal{L}(w)}{\partial w} = w - \alpha\delta\cdot \nabla_wv(s;w)$
5. Updata policy network: $\theta\gets\theta + \beta g = \theta - \beta\delta\cdot \nabla_{\theta}\ln\pi(a|s;\theta)$

## Environment test 环境测试

在[KataRL](https://github.com/wty-yy/KataRL)中用JAX实现了A2C算法，[核心代码`a2c_jax.py`](https://github.com/wty-yy/KataRL/blob/master/katarl/agents/a2c_jax.py)，[超参数文件](https://github.com/wty-yy/KataRL/blob/master/katarl/agents/constants/a2c.py)，[不同环境下与其他模型的比较](https://api.wandb.ai/links/wty-yy/4f1r6xav)。

可以看出A2C的效果较差且慢，但是其实现较为简单，以后可以进一步用GAE对其进行优化（类似PPO算法）。测试代码：

```bash
python katarl/run/a2c/a2c.py --train --wandb-track
python katarl/run/a2c/a2c.py --train --wandb-track --env-name Acrobot-v1
```

### Cartpole 平衡木

[Cartpole environment information - Gymnasium](https://gymnasium.farama.org/environments/classic_control/cart_pole/)

#### Hyper-parameters 超参数

**Agent**

1. model struct:
   1. Input(4)-Dense(32)-Dense(32)-Output (We call it **origin** one)
   2. Input(4)-Dense(128)-Dense(64)-Dense(16)-Output (We call it **deeper** one)

2. model optimizer & learning rate (After multi test, get the best args, maybe~)
   1. Adam: $\alpha=10^{-3}, \beta=10^{-5}$
   2. SGD: $\alpha=5\times 10^{-4}, \beta = 10^{-4}$

**Environment**

1. positive reward $r_{pos} = 1$
2. negative reward $r_{neg} = -10$ and $-20$ (compare)

#### 测试结果1（模型结构）

We try different model struct, origin and deeper model, after compare, we found the deeper is almost rolling the origin one.

我们尝试测试origin和deeper两种模型，更深的模型几乎完全碾压了浅的模型。

![compare origin with deeper model](/figures/RL/A2C/cartpole/A2C-model-origin-deeper.png)

#### 测试结果2（完全失效策略的调参思路）

We also find the deeper model can avoid complete failure of the policy since random environment，this is the result of restarting the origin model twice: (one almost dead, and the other is powerful)

我们还发现更深的模型可以避免因环境随机性导致策略完全失效，以下是我们重启origin模型两侧得到的完全不同的两个结果（其中一个几乎无法走出10步，而另一个几乎获得了最优策略）

![big variance](/figures/RL/A2C/cartpole/A2C-v3-p5-two-test-compare.png)

The training results of 5 restarts of the deeper model are given below:

以下给出了5次重启deeper model的训练结果：

![deeper 5 restart](/figures/RL/A2C/cartpole/A2C-deeper-5-restart.png)

#### 测试结果3（比对不同奖励的影响）

我们又尝试了两种不同的失败损失，如果平衡木在没有达到最长步数(500)时失去平衡，那么最后一个动作就会获得 $-10$ 或 $-20$ 的损失，在下图中我们分别记为 `r10` 和 `r20`，根据比对，我们发现更大的失败损失确实能提高达到更高step的可能（可能因为这样critic能给出更准确的判断？因为如果记失败损失是 $r_{neg}$，折扣率 $\gamma=0.95$，那么求解关于折后回报的方程
$$
1+\gamma+\cdots\gamma^{n-1}-r_{neg}\cdot \gamma^{n} = 0\Rightarrow n = \log_{0.95}\frac{1}{1+r_{neg}/20}
$$
带入 $r_{neg}=10,20$ 分别得到 $n\approx 8, 13$。也就是说，假设给定 $r_{neg}$：

1. 在critic评估正确的情况下，critic可以在actor最终失败前 $n$ 步预判出actor的错误，从而可以对其进行修正。
2. 在critic评估错误的情况下，在失败前的相同步数时，更大的 $r_{neg}$，可以获得更大的TD error，从而迅速更正critic的的错误。

![compare-rewards](/figures/RL/A2C/cartpole/A2C-compare-diff-rewards.png)

$r_{reg}$ 越大越好？虽然 $n$ 和 $r_{neg}$ 是成类似 $log$ 函数的关系，进一步测试了在`deeper`模型下不同的失败损失大小：

![compare-rewards-deeper](/figures/RL/A2C/cartpole/A2C-reward-compare-deeper.png)

#### 测试结果4（比对不同优化器）

我们尝试两种优化器 Adam 和 SGD（学习率上文已经给出），在deeper网络结构下的比较：

![compare-optimizer](/figures/RL/A2C/cartpole/A2C-compare-Adam-SGD.png)

可以看出基本上Adam碾压了SGD，但是SGD优化器竟有时可以在第一个step中达到最优，虽然支撑不了几步：

![SGD-intersting](/figures/RL/A2C/cartpole/A2C-SGD-intersting.png)
