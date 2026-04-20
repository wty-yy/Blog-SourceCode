---
title: 人形机器人Tracking代码框架分析
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

近几年开源的基于g1-29dof的动捕重定向数据追踪算法，对使用的obs，奖励，网络进行分析，包含：
1. beyondmimic

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

重定向csv源文件，例如[lafan1数据集 - g1](https://huggingface.co/datasets/lvhaidong/LAFAN1_Retargeting_Dataset/tree/main/g1)，仅包含30fps的`qpos`数据，数据维度为`(T, 3+4+29)`分别表示：
- root_pos (x, y, z)
- root_rot quaternion (x, y, z, w)
- 29个关节的旋转角度

使用[`csv_to_npz.py`](https://github.com/wty-yy-mini/whole_body_tracking/blob/main/scripts/csv_to_npz.py)脚本将30fps的csv文件转换为50fps的npz文件，npz中key包含:
- fps: 50
- joint_pos: (T, 29) 关节位置
- joint_vel: (T, 29) 关节速度
- body_pos_w: (T, 30, 3) 每个body在世界坐标系下的位置
- body_quat_w: (T, 30, 4) 每个body在世界坐标系下的旋转四元数
- body_lin_vel_w: (T, 30, 3) 每个body在世界坐标系下的线速度
- body_ang_vel_w: (T, 30, 3) 每个body在世界坐标系下的角速度
