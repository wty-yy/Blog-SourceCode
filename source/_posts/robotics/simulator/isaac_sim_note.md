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

## 安装
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

## 基础芝士
### IsaacSim逻辑
#### 工作流
参考[IsaacSim/workflows](https://docs.isaacsim.omniverse.nvidia.com/latest/introduction/workflows.html)，将IsaacSim的控制方法分为如下三种：
1. 可视化窗口交互 GUI：
    - 启动方法：可视化界面操作，如果是pip安装，直接执行`isaacsim`即可，如果是二进制安装，到安装目录下执行`./isaac-sim.sh`即可打开，打开后就可以看到可视化界面
    - 官方教程推荐：[GUI/tutorial](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/index.html#tutorials)中如何搭建一个小车（推荐看4.2.0老版本教程[Build Your First Virtual World](https://docs.omniverse.nvidia.com/isaacsim/latest/gui_tutorials/index.html)，内容一致可用，且有更多动图容易理解），然后中间遇到一个新的窗口操作，看窗口的细节[GUI/Windows](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/index.html#windows)
    - 用途：可以方便的查看、修改机器人模型、场景搭建，在Python代码执行中可以进行调试
2. 插件交互 Extensions：
    - 启动方法：
        - Interactive Examples插件的使用方法：官方使用方法教程[Interactive Examples](https://docs.isaacsim.omniverse.nvidia.com/latest/introduction/examples.html#interactive-examples)，或者看[wty-yy/isaac-sim-use-cases:Interactive用例/使用方法](https://github.com/wty-yy/isaac-sim-use-cases/blob/master/interactive/README.md)，这里介绍了如何创建自定义脚本，及启动方法
        - 其他插件：可以认为GUI中的每个小窗口都是一个插件，相关插件可以在Window > Extensions中进行管理
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
#### 关键词及Core API调用关系
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

总的来说，我将上述关系总结为下图便于理解，下文的常用API使用方法也按照上述分类进行
![IsaacSim Core API关系图](/figures/robotics/isaac_sim_note/isaac_sim_core_api_graph.drawio.png)

## GUI常用操作
### 快捷键
[isaacsim/reference_keyboard_shortcuts](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/reference_keyboard_shortcuts.html)

视角控制，参考[Ext/Viewport/navigation](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/navigation.html)
- 进入我的世界创造飞行模式：
    - `右键+W/S/A/D`：前后左右飞行
    - `右键+Q/E`：高度下降上升
    - `右键+滚轮/Ctrl/Shift`：调节飞行速度/减速/加速
- 聚焦于物体：选中物体，按`F`
- 截取Viewport图像：
    - `F10`：截取当前图像，保存到`~/Documents/Kit/shared/screenshots`
    - 连续图像截取：参考[Ext/Movie Capture](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_movie-capture.html)
### Tips
- 永久化菜单：IsaacSim中的所有菜单都可以点击上方的横杠拖拽出来，这样就可以持续看到菜单了，参考[Ext/viewport/Persistent Menus](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/persistent-menus.html)
- 左侧工具栏
    - 本体变换操作：参考[Ext/Viewport/Transform Manipulator](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/transform-manipulator.html)，包含平移（Translation，快捷键`W`），旋转（Robotation，快捷键`E`），缩放（Scale，快捷键`R`）
        平移与旋转操作有两个子选项（按两下相同快捷键切换，或者点击物体后，在下方出现一个小三角`>`，点击展开再点第一个小地球即可切换）**Local/Global**，分别相对自身坐标系与世界坐标系，测试方法：加入一个Cube后，先用旋转任意转到一个角度，再测试Local/Global，即可看出区别
    - 相对变换操作：参考[Ext/Viewport/Transform Context Menu](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_viewport/transform-context-menu.html)，上文的切换小三角`>`按钮就是打开相对变化操作栏，包含变换空间切换（上文提到的Local/Global）、吸附（Snap，快捷键`S`）、切换坐标系
        吸附的使用方法，在左侧找到“磁铁”图标右键，选择一种吸附模式Grid, Prim, Surface，这样在用平移操作时，可以保证物体被吸附限制
- USD文件保存与仅相对导入机器人：参考[USD/Working with USD](https://docs.isaacsim.omniverse.nvidia.com/latest/omniverse_usd/intro_to_usd.html#isaac-sim-app-tutorial-intro-usd)，在保存USD前，先将机器人部分单独分离出来（在Stage Tree中将机器人对应的Xform拖拽到最外层，或者选择Xform然后Edit > Unparent移动到根目录），右键Xform选Set as Default Prim，即可在相对导入（Add Reference，或Python脚本读取）时仅读取设定为defaultPrim下的内容

    GUI中的相对导入有两种方法：
    1. 左上角File > Add Reference选择USD文件
    2. 下方找到Content栏（没有就在Windows  > Browsers > Content打开），找到USD文件路径，右键点Add at Current Selection添加到Stage中
- Joint可视化：如果手动添加RevoluteJoint，为了方便查看旋转的方向，可以打开可视化，点击Viewport上方工具栏中的小眼睛 > Show By Type > Physics > Joints

## 注意事项
URDF, MJCF, USD都是保存机器人的配置文件，后两个可以包含更多的环境信息，三者中对机器人零部件的描述用语各不相同，如下表所示
| URDF | MJCF | USD |
| - | - | - |
| Link | Body | Rigid |
### Joint定义
在URDF或者MJCF文件，每个Link或Body都是有父子关系，通过坐标系变换从父Link的坐标系得到子Link的坐标系，因此在URDF和MJCF中定义Joint只需要给出Joint坐标系关于父Link的坐标系变换即可

> 以下实验部分需要会添加RevoluteJoint，请在学习完[Assemble a Simple Robot](https://docs.isaacsim.omniverse.nvidia.com/latest/gui/tutorial_gui_simple_robot.html)后进行，实验所用USD文件为[revolute_joint.usd](https://github.com/wty-yy/isaac-sim-use-cases/blob/master/usd_demos/revolute_joint.usd)

注意到USD文件保存的机器人信息是没有两个Rigid之间的相对信息的，两两之间都是相互独立的存在，如果我们要描述Joint，就需要将父子Rigid绑定关系，并给出Joint坐标系相对于父坐标系的变换，在IsaacSim中定义Joint就产生了两个坐标系变换：
- Local Position/Rotation 0：相对body0（父坐标系）的变换，记为$R_1$
- Local Position/Rotation 1：相对body1（子坐标系）的变换，记为$R_2$

于是，从父坐标系到子坐标系变换为 $R_1R_2^{-1}$（值得注意的是，这两个变换目标都是Joint坐标系）

但我们的子坐标系其实在USD中已经被确定了，如果又被父坐标系确定一次会发生什么？如下面视频所示

{%
    dplayer
    "url=/videos/revolute_joint_missing_position.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}

> 显示Joint信息的方法：上文[GUI常用操作/Tips](./#tips)中Joint可视化给出

当Joint计算出的子坐标系与USD中子Rigid位置错位时，会有一个蓝色虚拟框给出期望位置，绿色为USD中位置，在开始仿真时，物体会受到极大的推力以到达期望位置，这通常是不正确的。

但根据 $R_1$ 计算 $R_2$ 以符合USD中当前物体位置又挺复杂，所以如果想要修改Joint坐标系，推荐用左侧按钮中的平移和旋转来修改，这样会自动计算 $R_1,R_2$ 满足子物体当前位置，如果需要精准确定位置，只需要调整到差不多的位置，重新手动输入数值即可！

## 常用API
### Simulation
### Stage
### World
### Scene

