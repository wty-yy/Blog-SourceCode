---
title: 人形机器人WBT代码框架分析
hide: false
math: true
category:
  - Robotics
abbrlink: 13726
date: 2026-04-20 14:21:28
index\_img:
banner\_img:
tags:
---

本文学习下近几年开源的基于g1-29dof的动捕重定向数据全身追踪算法 (Whole Body Tracking, WBT)，对使用的obs，奖励，网络进行分析，包含：
1. Q. Liao et al., “BeyondMimic: From Motion Tracking to Versatile Humanoid Control via Guided Diffusion,” arXiv.org. Accessed: Mar. 17, 2026. Available: https://arxiv.org/abs/2508.08241v4



## BeyondMimic

[GitHub - HybridRobotics/whole_body_tracking](https://github.com/HybridRobotics/whole_body_tracking)这个源代码中使用了很多没用的wandb上传功能，还把motion data也上传了，普通账号无法上传因此修改了一版本[GitHub - wty-yy-mini/whole_body_tracking](https://github.com/wty-yy-mini/whole_body_tracking)，使用方法根据我的修改版本的README.md顺次执行即可。

代码框架
{% spoiler "代码框架" %}
```bash
whole_body_tracking
├── data  # 追踪数据
│   ├── dailylife_back_2_3.csv
│   └── dailylife_back_2_3.npz
├── logs  # 训练结果
│   └── rsl_rl
│       └── g1_flat
│           └── 2026-04-14_16-28-15_dailylife_back_2_3
│               ├── exported
│               │   └── policy.onnx
│               └── model_2500.pt
├── scripts
│   ├── csv_to_npz.py  # qpos的csv转为npz
│   ├── replay_npz.py  # 追踪数据可视化
│   └── rsl_rl
│       ├── cli_args.py
│       ├── play.py
│       └── train.py
└── source
    └── whole_body_tracking
        ├── pyproject.toml
        ├── setup.py
        └── whole_body_tracking
            ├── robots
            │   ├── actuator.py
            │   ├── g1.py
            │   └── smpl.py
            ├── tasks
            │   └── tracking
            │       ├── config
            │       │   ├── g1
            │       │   │   ├── agents
            │       │   │   │   └── rsl_rl_ppo_cfg.py
            │       │   │   └── flat_env_cfg.py
            │       │   └── humanoid
            │       │       ├── agents
            │       │       │   └── rsl_rl_ppo_cfg.py
            │       │       └── flat_env_cfg.py
            │       ├── mdp
            │       │   ├── commands.py
            │       │   ├── events.py
            │       │   ├── observations.py
            │       │   ├── rewards.py
            │       │   └── terminations.py
            │       └── tracking_env_cfg.py
            └── utils
                ├── exporter.py
                └── my_on_policy_runner.py
```
{% endspoiler %}

### 重定向数据处理

重定向csv源文件，例如[lafan1数据集 - g1](https://huggingface.co/datasets/lvhaidong/LAFAN1_Retargeting_Dataset/tree/main/g1)，仅包含30fps的 `qpos` 数据，数据维度为 `(T, 3+4+29)` 分别表示：
- root_pos: (x, y, z)
- root_rot: (x, y, z, w) 四元数
- dof: 29个关节的旋转角度

使用 [`csv_to_npz.py`](https://github.com/wty-yy-mini/whole_body_tracking/blob/main/scripts/csv_to_npz.py) 脚本将30fps的csv文件转换为50fps的npz文件，npz中key包含:
- fps: 50
- joint_pos: (T, 29) 关节位置
- joint_vel: (T, 29) 关节速度
- body_pos_w: (T, 30, 3) 每个body在世界坐标系下的位置
- body_quat_w: (T, 30, 4) 每个body在世界坐标系下的旋转四元数
- body_lin_vel_w: (T, 30, 3) 每个body在世界坐标系下的线速度
- body_ang_vel_w: (T, 30, 3) 每个body在世界坐标系下的角速度

具体计算方法如下：

#### MotionLoader数据处理

这部分完成qpos数据读取，差值得到目标频率数据，差分得到速度数据

`MotionLoader` 读取csv文件，得到 `qpos` 数据，获得 `root` 相对世界坐标系的pos, rot_wxyz（转化下），以及dof关节位置，将当前数据频率转化为目标频率，通过差值得到：

设要划分的时间段为 $[t_0, t_T]$，按导出频率 $dt = 1/50$ 线性划分，可得到离散时间索引 $[t_1, t_2, ..., t_N]$，则计算得到最近索引 $i = \lfloor T\frac{t_i}{(t_T - t_0)} \rfloor$，比例为 $\alpha = T\frac{t_i}{(t_T - t_0)} - i$，分别进行两种差值：
- 线性插值：dof_pos, root_pos
- 球面线性差值：root_rot

补全所需的速度信息：
- `torch.gradient`: 计算出root_lin_vel, dof_vel，$x_i = (1-\alpha) t_i + \alpha t_{i+1}$
- so3旋转差分: 计算出root_ang_vel

#### 仿真器正向运动学求解

通过IsaacSim（Mujoco应该也行），仅执行正运动学（无需 `sim.step()`），得到**每个body在世界坐标系下位置**（`body_*` 的数据），仿真器中执行正向求解所需的信息包含：
- root state: pos, rot, lin_vel, ang_vel
- dof state: dof_pos, dof_vel

IsaacLab中进行运动学推理核心逻辑如下（可参考[manager_based_env.py中step函数](https://github.com/isaac-sim/IsaacLab/blob/main/source/isaaclab/isaaclab/envs/manager_based_rl_env.py)）：

主要实例对象包含两个：
- `sim: SimulationContext`：仿真器上下文对象，是对IsaacSim所支持的仿真器的包装，例如PhysX
- `scene: InteractiveScene`：场景对象，包含了各种entity，例如机器人`robot: Articulation`，资产`ground: AssetBase`等

这里scene就是用户调用sim的接口，scene为sim创建entity更新entity状态，当sim物理步进推进后，再更新scene状态，获取我们所需数据，再进一步用scene控制机器人entity，具体流程如下：
- scene更新sim状态，例如
    - 写入指定数据 `robot.write_root_state_to_sim(root_states)` 修改root_state，`robot.write_joint_state_to_sim(joint_pos, joint_vel)` 修改joint_state
    - `scene.write_data_to_sim()` 将调用每个entity的`write_data_to_sim`函数将各自所需更新的数据写入sim中
- `sim.step()` 推进仿真器状态（当前正运动学可视化中无需）
- `sim.render()` 渲染当前sim界面
- `scene.update(sim.get_physics_dt())`，推进当前scene时间戳，自动更新每个entity状态，例如：
    - 对于机器人信息 `Articulation` 会在调用时直接获取sim信息，这里只更新必须的 `joint_acc` 状态

这些信息我们在 `MotionLoader` 中都处理出来了并满足目标频率，直接写入sim中即可，通过 `scene.update` 后直接从 `Articulation` 信息中读取出正向运动学信息，就是我们要的模仿数据了。

### 启发式超参数设计

在原论文中附录 `Heuristically Designed Paramters` 中提到，他们设计关节PD系数和动作缩放系数具体如下：

设 $\omega=10\cdot 2\pi$ 为固有频率 10Hz（natural frequency），$\xi=2$ 为阻尼比（damping ratio），$I_{\text{rotor},j}$ 为第j个关节的转子惯性（rotor inertia），$k_{\text{g},j}$ 为齿轮比（gear ratio），则 $I_j = k_{\text{g},j}^2 I_{\text{rotor},j}$ 为关节的反射惯性（reflected inertia (aramature) of the joint）

第j个关节PD系数定义为：$k_{\text{p},j} = I_j\omega^2$，$k_{\text{d},j} = 2I_j\xi\omega$

动作缩放系数计算使用了 $\alpha_j = \frac{\tau_{\text{max},j}}{4k_{\text{p},j}}$

代码中见[GitHub - whole_body_tracking/robots/g1.py](https://github.com/wty-yy-mini/whole_body_tracking/blob/main/source/whole_body_tracking/whole_body_tracking/robots/g1.py)开头和结尾部分，这样设计的好处是可以不用手动调参，直接根据当前机器人的物理属性设计出合理的PD系数用于训练和真机。

**PD系数设计原理**如下

令 $q^*$ 为目标位置，$e=q-q^*$ 为位置误差，则 $\dot{e} = \dot{q}, \ddot{e} = \ddot{q}$，关节动力学方程为
$$
\begin{aligned}
I\ddot{q} + k_{\text{d}}\dot{q} + k_{\text{p}}(q-q^*) =&\ 0\\
I\ddot{e} + k_{\text{d}}\dot{e} + k_{\text{p}}e =&\ 0
\end{aligned}
$$
带入启发式PD系数
$$
\begin{aligned}
I\ddot{e} + 2I\xi\omega\dot{e} + I\omega^2 e =&\ 0\\
\ddot{e} + 2\xi\omega\dot{e} + \omega^2 e =&\ 0
\end{aligned}
$$
这就是关于 $e$ 的二阶线性常微分方程，超参数为 $\omega, \xi$，这样有两个好处：

1. 避免关节的物理差异，公式中消去了关节差异 $I_j$
2. 统一超参数：$\omega$ 为关节响应的快慢，$\xi$ 为阻尼大小，当 $\xi < 1$ 像弹簧震荡，$\xi > 1$ 平滑过渡到目标位置

[Gemini生成 - 可视化界面DEMO](/posts/13727/)

### 观测

BeyondMimic给出的版本是**无法上真机的观测**，宇树unitree_rl_lab能上真机的版本里面删除了motion_anchor_pos_b和base_lin_vel

#### Actor观测

| 变量名 | 维度 | 说明 | 是否带噪声 |
| --- | --- | --- | --- |
| command | 29+29 | 目标关节位置joint_pos和速度joint_vel | 否 |
| motion_anchor_pos_b | 3 | 目标anchor在机器人当前anchor下的位置 | 是 |
| motion_anchor_ori_b | 6 | 目标anchor在机器人当前anchor下的旋转矩阵前两列 | 是 |
| base_lin_vel | 3 | 在本体坐标系下的root线速度 | 是 |
| base_ang_vel | 3 | 在本体坐标系下的root角速度 | 是 |
| joint_pos_rel | 29 | 关节相对默认姿态的偏移 | 是 |
| joint_vel | 29 | 关节速度 | 是 |
| last_actions | 29 | 上一时刻的动作 | 否 |

> 线速度和角速度都是相对于世界坐标系，然后平移到本体坐标系下的

总计 `58 + 3 + 6 + 3 + 3 + 29 + 29 + 29 = 160` 维观测，这里的anchor_body指的就是torso_link也就是机器人躯干，注意torso_link并不是root，G1的默认root是pelvis对应的link，这里有如下的变化关系：
```txt
pelvis  (root/base)
  -> waist_yaw_link
    -> waist_roll_link
      -> torso_link
```

#### Critic特权观测

| 变量名 | 维度 | 说明 |
| --- | --- | --- |
| 不带噪声的Actor观测 | 160 | 全部不带噪声 |
| body_pos | 14 * 3 | 指定的14个关键body在机器人当前anchor坐标系下的位置 |
| body_ori | 14 * 6 | 指定的14个关键body在机器人当前anchor坐标系下的旋转矩阵前两列 |

总计 `160 + 14*3 + 14*6 = 286` 维观测，这里14个关键body配置`MotionCommand.motion.body_names`为：

```python
# 下半身
pelvis
left_hip_roll_link      # 髋
left_knee_link          # 膝
left_ankle_roll_link    # 踝
right_hip_roll_link
right_knee_link
right_ankle_roll_link
# 躯干
torso_link
# 上半身
left_shoulder_roll_link # 肩
left_elbow_link         # 肘
left_wrist_yaw_link     # 腕
right_shoulder_roll_link
right_elbow_link
right_wrist_yaw_link
```

### 奖励

#### 前置定义

首先引入Gaussian型指数奖励（Gaussian-shaped exponential reward），设当前状态和目标的误差为 $e_i$，总计 $N$ 个状态，则平均误差定义为 $\bar{e}=\frac{1}{N}\sum_{i=1}^{N}||e_i||^2$，我们期望其服从均值为0，方差为 $\sigma$ 的Gaussian分布 $\bar{e}\sim\mathcal{N}(0,\sigma^2)$，则Gaussian型指数奖励定义为（把常数项都省略掉）
$$
r_{\text{Gauss}}(\bar{e},\sigma) = \exp\left(-\frac{\bar{e}}{\sigma^2}\right)
$$

记两个旋转$R_1, R_2$变换之间的最小旋转角度为（四元数同样可以算出该角度）
$$
\Theta(R_1, R_2) = \arccos\left(\frac{\text{trace}(R_1^TR_2) - 1}{2}\right)
$$

定义一些后续奖励设计会用到的变量名：

在当前时刻下，参考动作中的body $i$ 在世界坐标系下的位置为 $p_i^{\text{ref}}=\left[p_{x,i}^{\text{ref}}, p_{y,i}^{\text{ref}}, p_{z,i}^{\text{ref}}\right]$，旋转矩阵为 $R_i^{\text{ref}}$
当前机器人的body $i$相对世界坐标系下的位置为 $p_i=\left[p_{x,i}, p_{y,i}, p_{z,i}\right]$，旋转矩阵为 $R_i$

其中有一个body我们记为anchor（锚点，代码中为torso_link），对应的索引记为 $i_{\text{a}}$

---

总共包含9个奖励，分为如下这几项介绍

#### anchor body pose 误差

位置误差：$0.5 \cdot r_{\text{Gauss}}(||p_{i_{\text{a}}}^{\text{ref}} - p_{i_{\text{a}}}||^2, 0.3)$

旋转误差：$0.5 \cdot r_{\text{Gauss}}(\Theta(R_{i_{\text{a}}}^{\text{ref}}, R_{i_{\text{a}}})^2, 0.4)$

#### 参考body pose 误差

由于机器人在执行过程中存在位置和旋转误差，因此需要引入平移/旋转补偿（position/rotation compensation），BeyondMimic中使用的补偿计算方法如下：

- 位置补偿为 $p_{\Delta}=\left[p_{x,i_{\text{a}}}, p_{y,i_{\text{a}}}, p^{\text{ref}}_{z,i_{\text{a}}}\right]$，注意这里只有z轴使用参考位置，要求机器人保持参考高度
- 旋转补偿为 $R_{\Delta} = R_z\left(\text{yaw}\left(R_{i_{\text{a}}}(R_{i_{\text{a}}}^{\text{ref}})^{-1}\right)\right)$，这里只考虑绕z轴的yaw旋转补偿，$\text{yaw}$表示提取旋转矩阵中绕z轴的yaw角，$R_z(\theta)$表示绕z轴旋转$\theta$角的旋转矩阵

则 $(p_{\Delta}, R_{\Delta})$ 对应了一个仿射变换（平移+旋转），只需将body都经过该变换到新的坐标系下即可，第 $i$ 个body的目标位置和旋转为（相对世界坐标系）

$$
\begin{cases}
p_i^{\text{des}} = p_{\Delta} + R_{\Delta}\left(p_i^{\text{ref}}-p_{i_\text{a}}^{\text{ref}}\right)\\
R_i^{\text{des}} = R_{\Delta}R_i^{\text{ref}}
\end{cases}
$$

还记得在[观测 - Critic特权观测](./#critic特权观测)中定义了14个关键body，索引记为 $\{i_{\text{key}}\}_{i_{\text{key}}=1}^{N_{\text{key}}}$，则body pose误差奖励定义为

- 位置补偿误差：$r_{\text{Gauss}}\left(\frac{1}{N_{\text{key}}}\sum_{i_{\text{key}}} ||p_{i_{\text{key}}}^{\text{des}} - p_{i_{\text{key}}}||^2, 0.3\right)$
- 旋转补偿误差：$r_{\text{Gauss}}\left(\frac{1}{N_{\text{key}}}\sum_{i_{\text{key}}} \Theta(R_{i_{\text{key}}}^{\text{des}}, R_{i_{\text{key}}})^2, 0.4\right)$
- 线速度全局误差：$r_{\text{Gauss}}\left(\frac{1}{N_{\text{key}}}\sum_{i_{\text{key}}} ||v_{i_{\text{key}}}^{\text{ref}} - v_{i_{\text{key}}}||^2, 1.0\right)$
- 角速度全局误差：$r_{\text{Gauss}}\left(\frac{1}{N_{\text{key}}}\sum_{i_{\text{key}}} ||\omega_{i_{\text{key}}}^{\text{ref}} - \omega_{i_{\text{key}}}||^2, 3.14\right)$

#### 正则奖励

- L2一阶高频动作惩罚：$-0.1 \cdot ||a_t - a_{t-1}||^2$
- L1软关节限制惩罚：$-10 \cdot |q_t\text{超出软关节限制的弧度}|$
- 误接触惩罚：$-0.1\cdot |\text{历史3 physics步中非脚和手部的接触力超过1N的body数目}|$
