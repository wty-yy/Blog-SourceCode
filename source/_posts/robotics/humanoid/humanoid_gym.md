---
title: Hunamoid Gym学习
hide: false
math: true
category:
  - Robotics
  - Humanoid
abbrlink: 23781
date: 2025-03-09 20:08:53
index\_img:
banner\_img:
tags:
---

[GitHub - humanoid-gym](https://github.com/roboterax/humanoid-gym)是[RobotEra(北京星动纪元)](https://www.robotera.com/)公司开源的一个通用人形机器人训练框架，任务为“根据给出的指令进行走路”，训练的仿真环境为IsaacGym，迁移到Mujoco仿真以及其家的XBot-L机器人上，他们还基于该仓库发了另一片文章[Advancing Humanoid Locomotion: Mastering Challenging Terrains with Denoising World Model Learning](https://arxiv.org/pdf/2408.14472)并获得了RSS 2024的Outstanding Paper Award

> 类似的虚实迁移样例还有宇树的[unitree_rl_gym](https://github.com/unitreerobotics/unitree_rl_gym)，该仓库很可能是对其进行的改进版本，宇树在23年10月开源，本仓库在24年3月开源，而他们共同参考的应该是[legged_gym](https://github.com/leggedrobotics/legged_gym)于21年10月开源

机器人仿真训练包含非常多参数需要调整，本项目架构清晰，除去pytorch, numpy, isaacgym外没有调用其他库，PPO算法也是从rsl_rl中摘取出的（这比宇树的更简洁），因此可以学习代码架构设计；本项目也可以作为运动控制入门，整理仿真与真机中机器人所需的状态信息有哪些，虚实迁移中存在哪些可能问题

> 由于乐聚机器人Kuavo42就是基于该框架做的第一版RL训练，可以在其机器人上进行模型的虚实迁移测试

## 代码架构分析
以下代码为[humanoid-gym v1.0.0](https://github.com/roboterax/humanoid-gym/tree/v1.0.0)版本，也是当前master版本
```bash
.
├── humanoid
│   ├── algo
│   │   ├── __init__.py
│   │   ├── ppo
│   │   │   ├── actor_critic.py
│   │   │   ├── __init__.py
│   │   │   ├── on_policy_runner.py
│   │   │   ├── ppo.py
│   │   │   └── rollout_storage.py
│   │   └── vec_env.py  # 定义VecEnv抽象类, 用于PPO中类声明
│   ├── envs
│   │   ├── base
│   │   │   ├── base_config.py
│   │   │   ├── base_task.py  # 定义BaseTask, 虽然没继承VecEnv类, 但覆盖了VecEnv的属性
│   │   │   ├── legged_robot_config.py
│   │   │   ├── legged_robot.py
│   │   │   └── LICENSE
│   │   ├── custom
│   │   │   ├── humanoid_config.py
│   │   │   └── humanoid_env.py
│   │   └── __init__.py
│   ├── __init__.py
│   ├── scripts
│   │   ├── play.py
│   │   ├── sim2sim.py
│   │   └── train.py
│   └── utils
│       ├── calculate_gait.py
│       ├── helpers.py
│       ├── __init__.py
│       ├── logger.py
│       ├── math.py
│       ├── task_registry.py
│       └── terrain.py
├── logs  # 存储训练保存的权重
│   └── XBot_ppo
│       └── exported
│           └── policies
│               └── policy_example.pt
├── README.md
├── resources  # 存储机器人定义(URDF或者MJCF文件, 定义Joint, Link, 碰撞, 惯性矩阵等信息)
│   └── robots
│       └── XBot
│           ├── meshes  # Mesh部件(对Link进行渲染, 也可构成碰撞体积)
│           │   ├── base_link.STL
│           │   ├── ...
│           │   └── waist_yaw_link.STL
│           └── mjcf  # Mujoco定义文件
│               ├── XBot-L-terrain.xml
│               └── XBot-L.xml
└── setup.py
```

## 环境类
### BaseTask
`humanoid/envs/base/base_task.py`中`BaseTask`类，具有`algo.VecEnv`中的所有属性，完成了如下功能：

**初始化函数**
1. IsaacGym：指定计算、渲染设备，启动仿真，加载机器人模型，指定初始相机的朝向、位置
> **注意**：地形、模型的加载是用`creat_sim`函数，而该函数由其子类的子类实现（例如`XBotLFreeEnv`，感觉这个函数由`LeggedRobot`实现也可以），模型的加载由子类`LeggedRobot`实现`_create_envs`
2. 制定环境参数：环境数`num_envs`，观测维度`num_observations`，特权观测维度`num_privileged_obs`，动作维度`num_actions`
3. 分配buffer：`obs_buf, privileged_obs_buf, rew_buf, reset_buf, episode_length_buf, time_out_buf`等

**基础函数**
1. `get_observations, get_privileged_observations`：分别返回`self.obs_buf, self.privileged_obs_buf`
2. `reset_idx(env_ids: list)`（待实现）：重置指定编号的机器人
3. `reset`：调用`reset_idx`重置所有机器人，并执行一次全0的动作
4. `step(actions)`（待实现）：执行指定动作`actions`
5. `render`：渲染IsaacGym可视化窗口（渲染进行需要该函数驱动）

### LeggedRobot
`humanoid/envs/base/legged_robot.py`中`LeggedRobot`是对`BaseTask`类的继承，最核心的环境类，完成对MDP过程的全部处理：
#### _init_buffers
**本体感知**
初始化状态信息存储的buffer，这里介绍了所有仿真中可以获取到的状态信息，包括机器人的本体感知：
> 下文$rad$表示弧度，$N$表示牛，角标$x,y,z$表示世界坐标系下三个方向的分量，无特殊说明，四元数的默认顺序为$(q_x,q_y,q_z,q_w)$
> 在IsaacGym或IsaacSim中，会把URDF中的Link或MJCF中的Body称为Rigid（刚体），也即Joint连接的两个对象，下文也按刚体来称呼
1. `dof_state`关节信息
    1. `dof_pos`关节位置（单位 $rad$）
    2. `dof_vel`关节速度（单位 $rad/s$）
2. `root_states`机器人基座的全局信息
    1. `base_quat`基座坐标系姿态相对世界坐标系的四元数
    2. `base_euler_xyz`（从`base_quat`转换）基座坐标系姿态相对世界坐标系的欧拉角（表示 $(rad_x,rad_y,rad_z)$）
3. `contact_forces`机器人关节与环境的接触力（表示 $(N_x,N_y,N_z)$），用于判断环境终止、奖励设计
4. `rigid_state`刚体的完整状态，表示如下：
    - 位置 $(x,y,z)$：单位 $m$
    - 姿态四元数
    - 线速度$v_x,v_y,v_z$：单位 $m/s$
    - 角速度$w_x,w_y,w_z$：单位 $rad/s$
5. `base_lin_vel`机器人基座相对世界坐标系的线速度（通过`root_states`和`base_quat`逆变换得到）
6. `base_ang_vel`机器人基座相对世界坐标系的角速度（通过`root_states`和`base_quat`逆变换得到）
7. `gravity_vec`沿重力方向的单位向量，在这里是$(0,0,-1)$
8. `projected_gravity`将机器人基座坐标系下的`gravity_vec`逆变换到世界坐标系下，也就是世界坐标系下机器人的垂直方向
9. `base_lin_acc`机器人基座相对世界坐标系的加速度（通过`root_states`中的`base_lin_vel`做差除以`dt`得到）

**控制相关**

**命令相关**

**环境相关**
