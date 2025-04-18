---
title: IsaacSim 笔记
hide: false
math: true
abbrlink: 53877
date: 2025-04-17 15:58:37
index\_img:
banner\_img:
category:
- Robotics
- Simulator
tags:
---

本笔记基于IsaacSim 4.5.0，参考[官方文档](https://docs.isaacsim.omniverse.nvidia.com/latest/index.html)，本Blog的所有用例请见[wty-yy/isaac-sim-use-cases](https://github.com/wty-yy/isaac-sim-use-cases)

IsaacSim官方文档有非常多的代码与用例教学，但可能分布比较杂乱，这里重新理顺逻辑，并进行一些总结

# 安装
首先你需要一个有Nvidia显卡的电脑，RTX 3070以上，可以通过[Isaac Sim Requirements](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html)中查看自己电脑是否支持安装

IsaacSim安装：在`4.5.0`之后就可以直接在官网下载可执行的IsaacSim了，支持Linux和Windows，以下操作都在Ubuntu 24.04上完成，Windows理论上没有较大区别，常用安装方法有三种：

> 如果你已经有conda，推荐用第二种安装方式，比较方便，并且后续安装[IsaacLab](https://isaac-sim.github.io/IsaacLab/main/index.html)用于强化训练，也可以直接在其基础上安装

1. 二进制文件：[Download Isaac Sim](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/download.html)
    - 安装完成后也可以安装conda环境，参考[Advanced: Running with Anaconda](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_python.html#advanced-running-with-anaconda)
    - **conda安装后的推荐操作**：每次启动环境后还需手动`source $ISAAC_PATH/setup_conda_env.sh`文件，效率很低，因此我们可以将该命令加入到环境启动时运行，具体来说
        ```bash
        conda activate isaac-sim
        cd $CONDA_PREFIX/etc/conda/activate.d
        vim isaacsim_hook.sh
        # ================= 文件中写入如下内容 =================
        #!/bin/bash
        source <替换为IsaacSim安装路径>/setup_conda_env.sh
        ```
        这样就可以在启动环境时，自动加入IsaacSim相关的环境变量了！
2. pip安装到环境：[Install Isaac Sim using PIP](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_python.html#install-isaac-sim-using-pip)，此方法会将IsaacSim安装到conda的pip包路径中，位置有点难找，其余没有什么缺点
3. docker安装：[Install Container](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_container.html)

**注意**：
1. 第一次启动IsaacSim会非常慢，需要编译大量文件，可以打开任务管理器看CPU的使用率，当使用率降下来时就是编译完成了
2. 使用IsaacSim中建议全程打开VPN，因为可能需要从Omniverse Nucleus服务器上下载机器人、环境文件，否则可能卡住不动，可以看网卡下载流量，判断IsaacSim是否卡住

# 基础芝士
## IsaacSim逻辑
### 工作流
参考[IsaacSim/workflows](https://docs.isaacsim.omniverse.nvidia.com/latest/introduction/workflows.html)，将IsaacSim的控制方法分为如下三种：
1. 可视化窗口交互 GUI：
    - 启动方法：可视化界面操作，如果是pip安装，直接执行`isaacsim`即可，如果是二进制安装，到安装目录下执行`./isaac-sim.sh`即可打开，打开后就可以看到可视化界面
    - 官方教程推荐：[GUI/tutorial](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/index.html#tutorials)中如何搭建一个小车，然后中间遇到一个新的窗口操作，看窗口的细节[GUI/Windows](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/index.html#windows)
    - 用途：可以方便的查看、修改机器人模型、场景搭建，在Python代码执行中可以进行调试
2. 插件交互 Extensions：
    - 启动方法：
        - Interactive Examples插件的使用方法：官方使用方法教程[Interactive Examples](https://docs.isaacsim.omniverse.nvidia.com/latest/introduction/examples.html#interactive-examples)，或者看[wty-yy/isaac-sim-use-cases:Interactive用例/使用方法](https://github.com/wty-yy/isaac-sim-use-cases/blob/master/interactive/README.md)，这里介绍了如何创建自定义脚本，及启动方法
        - 其他插件：可以认为GUI中的每个小窗口都是一个插件，相关插件可以在Window->Extensions中进行管理
    - 官方教程推荐：
        - Python脚本控制仿真环境[Core API Tutorial Series](https://docs.isaacsim.omniverse.nvidia.com/latest/core_api_tutorials/index.html#core-api-tutorial-series)中的全部内容
        - 样例学习：在[Examples Reference Table](https://docs.isaacsim.omniverse.nvidia.com/latest/introduction/menu_examples.html#examples-reference-table)中查看感兴趣的样例
        - 插件编写：[Extension Template Generator](https://docs.isaacsim.omniverse.nvidia.com/latest/utilities/extension_template_generator.html)
    - 用途：每次修改代码后，Interactive Examples中的代码会立刻更新(hot-reload)，点击LOAD按钮即可看到修改后的代码效果，便于调试代码、测试机器人
3. 独立启动运行 Standalone：
    - 启动方法：
        - 直接通过`python.sh <代码路径>`执行（Windows是`python.bat`）
        - **推荐**使用conda环境启动，参考[安装方法](./#安装)中的**二进制文件**或者**pip安装到环境**，进入`isaac-sim`环境后，直接执行`python <代码路径>`
    - 官方教程推荐：在IsaacSim安装目录下的`$ISAAC_PATH/standalone_examples/api`中，有各种插件对应的api接口使用教程，可以选择感兴趣的样例进行学习
    - 用途：通过Python单独启动仿真，缺点是每次启动新的仿真需要花费时间，常用于RL训练
### 关键词及Core API调用关系
![调用关系示意图](/figures/robotics/isaac_sim_note/WorldSceneStage.png)

官方在[Core API Overview](https://docs.isaacsim.omniverse.nvidia.com/latest/python_scripting/core_api_overview.html#application-vs-simulation-vs-world-vs-scene-vs-stage)中对所有的接口进行大致介绍，我这里重新梳理一遍（结合自己在代码中使用的逻辑）：
- Prim：Primitive（原始的）表示物体的本体属性，例如质量、外形、关节连接等
- Attri：Attribute（属性）表示物体在环境中的属性，例如当前位置、朝向、速度、加速度等
- USD：包含各种Prim和相应的Attri，即物体的描述以及位置和朝向等信息（USD相当于下文的Stage，也可将USD加入到Stage/USD中）
- Simulation：根据代码逻辑改变Prim的Attri信息
- Stage：管理各种Prim及其对应的Attri信息
- World：管理Simulation和Stage，将二者进行连接构建成仿真场景，具有启动/重置的功能
- Scene：管理Prim和Attri，可将Prim加入Stage中，初始化Attri信息并为其分配`prim_path`
- App：对Simulation的上层管理，例如渲染、用户交互（添加物体、控制仿真是否继续）

总的来说，我将上述关系总结为下图便于理解
![IsaacSim Core API关系图](/figures/robotics/isaac_sim_note/isaac_sim_core_api_graph.drawio.png)

