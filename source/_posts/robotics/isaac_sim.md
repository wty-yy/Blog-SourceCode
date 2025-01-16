---
title: Ubuntu 本地及服务器安装 Isaac Sim
hide: false
math: true
abbrlink: 7379
date: 2024-06-18 10:16:06
index\_img:
banner\_img:
category:
 - Robotics
tags:
---

# Isaac Sim 本地安装
{% spoiler 本机配置 天选4 R9-7940H RTX4060 %}
![天选4锐龙7940H RTX4060](/figures/about/天选4配置.png)
{% endspoiler %}

[Isaac Sim](https://docs.omniverse.nvidia.com/isaacsim/latest/index.html) 环境是曾经 [Isaac Gym](https://developer.nvidia.com/isaac-gym) 的上位版本，他们都是用来做**机器人仿真环境**训练的，适合用于虚实迁移任务，特点为及其高效，因为仿真环境与训练的模型都是在 GPU 上完成。[IsaacLab](https://github.com/isaac-sim/IsaacLab) 则是通过 Python 语言将 Isaac Sim 中的环境创建为 Gym 接口，从而直接应用于强化学习算法中。

而 Isaac Sim 现在作为 [Omniverse Platform](https://www.nvidia.com/en-us/omniverse/) 中的一部分，我们需要先安装 Omniverse 因此我们的**安装顺序**为

1. Omniverse Launcher (Omniverse 可视化界面) 
2. Isaac Sim Compatibility Checker (检查电脑是否支持 Isaac Sim) 
3. 使用 Omniverse Launcher 安装一些基础包 
4. 使用 Omnvierse Launcher 安装 Isaac Sim 
5. IssaLab (配置使 Isaac Sim 成为 Python 中仿真环境接口)

在官方给出的[安装教程](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/index.html)中，只需完成 [Isaac Sim Requirements](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/requirements.html) 和 [Workstation Installation](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_workstation.html) 两步，对于 Python 的 [Python Environment Installation](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_python.html)，由于其对 Conda 环境中 Python 配置介绍不详细，因此我们按照 IssacLab 中方法进行配置更为方便！

## 安装 Omniverse Launcher
[`Omniverse Launcher 下载链接`](https://www.nvidia.com/en-us/omniverse/download/)填写好你的信息就能下载了，最好注册一个 Nvidia 账号，这样可以保存你的填写的信息，选择 `Linux` 下载（我这里是第三行）：
![Omniverse Launcher下载位置](/figures/robotics/isaac_sim_install/Omniverse_Launcher下载连接.png)

下载后我们可以得到一个 `omniverse-launcher-linux.AppImage` 软件，把这个软件放到一个固定的位置，因为第一次运行时会在菜单中创建当前位置的快捷方式。安装方法：进入到该文件夹下，执行下述代码开始安装
```bash
sudo chmod +x omniverse-launcher-linux.AppImage
# 如果你有 Clash 代理的话可以加上 --proxy-server={IP}:{PORT}
./omniverse-launcher-linux.AppImage --no-sandbox --proxy-server=127.0.0.1:7890
```
安装完成omniverse后，第一次打开会让你选择Pkg和Cache的安装位置，默认位置即可，后续IsaacSim中会用到pkg位置。

## 安装 Isaac Sim
首先按照 [Isaac Sim Compatibility Checker](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/requirements.html#isaac-sim-compatibility-checker) 给出的步骤安装 Compatibility Checker 对电脑的兼容性进行检查，只要显卡那一栏不是红的应该就没有问题（我的电脑检查结果如下左图所示）。

按照 [Workstation Installation](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_workstation.html) 在 Omniverse Launcher 中顺次安装 `Cache, Nucleus` 中的内容。

**注意**：在安装 Isaac Sim 时候，一定要手动选择安装的版本为 `4.0.0`（2024.6.6.的最新版本为 `4.0.0`，这样才能和后续 Python 安装的保持一致）如下中，右两图所示：
<div align="center">
<img src=/figures/robotics/isaac_sim_install/IsaacSimCompatibilityCheckerAPP.png width=19%>
<img src=/figures/robotics/isaac_sim_install/isaacsim版本选择1.png width=39%>
<img src=/figures/robotics/isaac_sim_install/isaacsim版本选择2.png width=39%>
</div>
{% spoiler zsh 终端需要修改的位置，否则Python无法找到正确的IsaacSim路径 %}
需要注意的是如果你使用的是 `zsh` 代替了原始的 `bash` 终端，则需要按照 [No module named 'omni.isaac' when using zshell instead of bash](https://github.com/isaac-sim/IsaacLab/issues/103) 中的方法，对 `${HOME}/.local/share/ov/pkg/isaac_sim-*` 下的两个文件分别进行修改，`setup_conda_env.sh` 中的修改为：
```bash
# 第一行修改为
#!/bin/zsh
# 第二行修改为
SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"  # 因为原来而 $BASH_SOURCE[0] 在 zsh 下位置是错误的
```
`setup_python_env.sh` 中的修改为：
```bash
# 第一行修改为
#!/bin/zsh
# 第二行修改为
SCRIPT_DIR=$(dirname "${(%):-%x}")  # 还是因为原来的方法找不到当前文件位置
```
{% endspoiler %}

## IsaacLab 安装
这里推荐使用 [IsaacLab](https://github.com/isaac-sim/IsaacLab)，这个是对 [OmniIsaacGymEnvs](https://github.com/isaac-sim/OmniIsaacGymEnvs) 的改进版本，有详细的[参考文档以及教学](https://isaac-sim.github.io/IsaacLab/)，可以直接参考 [Installation using Isaac Sim Binaries](https://isaac-sim.github.io/IsaacLab/main/source/setup/installation/binaries_installation.html) 进行安装，不要使用Pip installation，因为这会重新下载Isaac Sim而且不完整，安装IsaacLab流程如下：

1. 设置虚拟链接`ln -s ${HOME}/.local/share/ov/pkg/isaac-sim-4.2.0 _isaac_sim` （确定左侧路径就是你的isaac-sim安装位置，注意版本号）
2. 创建conda中的新环境`./isaaclab.sh --conda`（如果是zsh终端，需要先修改isaaclab.sh文件中19行附近的`export ISAACLAB_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"`为`export ISAACLAB_PATH="$( cd "$( dirname "$0" )" && pwd )"`因为前面那个指令是bash中的，可能无法找到正确的路径）
    > 创建完成后，我们进入isaaclab环境后，使用isaaclab指令就相当于执行了./isaaclab.sh脚本了
3. `conda activate isaaclab`安装训练框架`isaaclab -i rl_games`，安装后可能还需要再装一次`pip install rl_games`，可能是bug
4. 环境测试，我们直接执行训练样例代码，来自 [IsaacSim - sample - Reinforcement Learning](https://isaac-sim.github.io/IsaacLab/main/source/overview/reinforcement-learning/rl_existing_scripts.html#rl-games)，我们使用第三个（因为它是可以使用GPU加速的），训练 cartpole 用时 45s，其他还有两个环境可以测试自带的环境[请见 - Environments](https://isaac-sim.github.io/IsaacLab/main/source/overview/environments.html)，训练 Ant 用时 2:42，下面以训练 Cartpole 为例：
```bash
# install python module (for rl-games)，安装 rl-games
./isaaclab.sh -i rl_games
conda activate isaaclab
# run script for training（如果使用的是 conda 进行的安装，使用 python 和 ./isaaclab.sh -p 是一样的）
python source/standalone/workflows/rl_games/train.py --task Isaac-Cartpole-v0 --headless
python source/standalone/workflows/rl_games/train.py --task Isaac-Cartpole-v0 --headless
# run script for playing with 32 environments，模型权重保存在 /IsaacLab/logs/rl_games 下，例如我的就是如下位置
python source/standalone/workflows/rl_games/play.py --task Isaac-Cartpole-v0 --num_envs 32 --checkpoint /home/yy/Coding/GitHub/IsaacLab/logs/rl_games/cartpole/2024-06-18_22-12-56/nn/last_cartpole_ep_150_rew__4.6873245_.pth
```
<div align='center'>
<img src=/figures/robotics/isaac_sim_install/isaacsim_train.png width=49%>
<img src=/figures/robotics/isaac_sim_install/isaacsim_eval.gif width=49%>
</div>

# Isaac Sim Docker 安装

我按照 [Isaac Sim Container Installation](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_container.html) 中的安装流程，基于 [nvcr.io/nvidia/isaac-sim:4.0.0](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/isaac-sim) 安装了基础的 isaac-sim，我在其基础上配置了 `conda, zsh, vim, tmux,...`，可以直接使用 `IsaacLab` 和 `IsaacGymEnvs`。使用方法 `docker pull wtyyy/isaacsim:latest`，执行

```bash
docker run --name isaac-sim --entrypoint zsh -it --runtime=nvidia --gpus all -e "ACCEPT_EULA=Y" --rm --network=host \
    -v ~/docker/isaac-sim/cache/kit:/isaac-sim/kit/cache:rw \
    -v ~/docker/isaac-sim/cache/ov:/root/.cache/ov:rw \
    -v ~/docker/isaac-sim/cache/pip:/root/.cache/pip:rw \
    -v ~/docker/isaac-sim/cache/glcache:/root/.cache/nvidia/GLCache:rw \
    -v ~/docker/isaac-sim/cache/computecache:/root/.nv/ComputeCache:rw \
    -v ~/docker/isaac-sim/logs:/root/.nvidia-omniverse/logs:rw \
    -v ~/docker/isaac-sim/data:/root/.local/share/ov/data:rw \
    -v ~/docker/isaac-sim/documents:/root/Documents:rw \
    wtyyy/isaacsim:latest
```

即可启动容器。

如果报错`docker: Error response from daemon: unknown or invalid runtime name: nvidia.`，则需要安装`nvidia-container-toolkit`，参考[Install with apt](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-with-apt)，如果安装完成后还是报错，参考[GitHub issus - Docker Error - Unknown or Invalid Runtime Name: Nvidia](https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_visual_slam/issues/132#issuecomment-2134831510)，修改`/etc/docker/daemon.json`文件包含如下内容：
```json
{
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```
重启docker：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```


