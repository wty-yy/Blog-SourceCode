---
title: 宇树Go2中安装rtabmap视觉SLAM建图以及elevation_mapping_cupy
hide: true
math: true
abbrlink: 43205
date: 2026-07-03 20:33:16
index\_img:
banner\_img:
category:
tags:
---

宇树Go2-Edu的Jetson Orin NX拓展坞上开发，系统为官方Jetpack 5.1.1镜像，版本为Ubuntu 20.04，因此ROS无法安装Humble很多最新功能无法安装，因此使用docker方案

Docker可以直接下载我配置好的[wtyyy/jetson:cuda11.4-20.04-humble-desktop](https://hub.docker.com/repository/docker/wtyyy/jetson/general)，是基于[dustynv/ros:humble-desktop-l4t-r35.4.1](https://hub.docker.com/layers/dustynv/ros/humble-desktop-l4t-r35.4.1/)加入tmux, zsh修改得到的，也可以直接使用原版镜像，里面包含了cuda,cudnn,tensorrt,ros2-humble等，为后续安装cupy准备

## 启动容器

我们将工作空间放在了`/home/unitree/Coding`下，docker中直接挂载在`/Coding`下，工作空间就放在`/Coding/ros2_humble_ws`下

```bash
# 启动容器
docker run -it --name ros-humble \
  --runtime=nvidia \
  -e DISPLAY \
  -v "/tmp/.X11-unix:/tmp/.X11-unix" \
  --net=host \
  --privileged -v /dev:/dev \
  -v /home/unitree/Coding:/Coding \
  wtyyy/jetson:cuda11.4-20.04-humble-desktop

# 新终端中可以使用如下alias来source ros
source_ros_humble
```

## 编译

在Ubuntu 20.04中，由于我们的ROS2 Humble是手动编译出来的，安装位置和apt不同，是在`/opt/ros/humble/install`下，以及一些`tf2_ros`和`message_filters`头文件是老版本的`*.h`，因此有些路径也要修正，这些都用git patch来修正了

### 一键安装脚本

这里的ROS工作空间我已经完全准备好了，直接使用我的仓库[elevation_ws](https://github.com/wty-yy/elevation_ws)，分别完成系统级和ROS级的依赖安装即可，我也准备了`scripts/setup_go2.sh`脚本，直接运行即可完成安装

```bash
bash scripts/setup_go2.sh
```

脚本完成的安装内容具体如下（这里记录了整个仓库构建的过程，实际上所有的版本已经完成了对应的安装及纠正，因此直接使用安装脚本即可）

### rtabmap

首先需要切换gcc和g++版本到11，Ubuntu 20.04默认是9，编译nav2会报错
```bash
# 添加官方工具链 PPA
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt update

# 安装gcc-11和g++-11
sudo apt install gcc-11 g++-11

# 使用update-alternatives来管理gcc和g++的版本
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-9 90
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 110

sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-9 90
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-11 110

sudo update-alternatives --install /usr/bin/cc cc /usr/bin/gcc 30
sudo update-alternatives --install /usr/bin/c++ c++ /usr/bin/g++ 30

# 然后切到 11：
sudo update-alternatives --set gcc /usr/bin/gcc-11
sudo update-alternatives --set g++ /usr/bin/g++-11
sudo update-alternatives --set cc /usr/bin/gcc
sudo update-alternatives --set c++ /usr/bin/g++
```

安装Go2 humble git补丁
```bash
git -C src/navigation2 apply ../../patches/go2/navigation2.diff
git -C src/rtabmap_ros apply ../../patches/go2/rtabmap_ros.diff
```

我们需要几个ROS包：
- `rtabmap`, `rtabmap_ros`: 视觉里程计+SLAM建图
- 安装`rtabmap_ros`一些依赖包：`bondcpp`, `nav2`

几个系统级依赖：`xtl`, `xtensor`, `xsimd`

```bash
source_ros_humble  # source ros2 humble
cd /Coding/ros2_humble_ws  # 进入工作空间
mkdir src
mkdir third_party

# 系统级
sudo apt install libompl-dev
git clone -b 0.7.2 https://github.com/xtensor-stack/xtl.git third_party/xtl
git clone -b 7.6.0 https://github.com/xtensor-stack/xsimd.git third_party/xsimd
git clone -b 0.23.10 https://github.com/xtensor-stack/xtensor.git third_party/xtensor
git clone https://github.com/jlblancoc/nanoflann.git third_party/nanoflann
cd third_party/xtl
cmake -B build && sudo cmake --build build --target install
cd ../..
cd third_party/xsimd
cmake -B build && sudo cmake --build build --target install
cd ../..
cd third_party/xtensor
cmake -B build && sudo cmake --build build --target install
cd ../..
cd third_party/nanoflann
cmake -B build && sudo cmake --build build --target install
cd ../..


# ros pkgs
git clone -b humble https://github.com/ros-planning/navigation2.git src/navigation2
git clone -b ros2 https://github.com/ros/bond_core.git src/bond_core
git clone -b ros2 https://github.com/ros/diagnostics.git src/diagnostics
git clone -b v3.8 https://github.com/BehaviorTree/BehaviorTree.CPP.git src/BehaviorTree.CPP
git clone -b humble https://github.com/ros-perception/perception_pcl.git src/perception_pcl
git clone -b humble https://github.com/CCNYRoboticsLab/imu_tools.git src/imu_tools

git clone https://github.com/introlab/rtabmap.git src/rtabmap
git clone --branch ros2 https://github.com/introlab/rtabmap_ros.git src/rtabmap_ros
```

`rosdep`安装底层依赖

```bash
rosdep update
rosdep install --from-paths src --ignore-src -r -y --rosdistro humble
```

```bash
colcon build --symlink-install --packages-up-to rtabmap_ros --cmake-args -DBUILD_TESTING=OFF
colcon build --symlink-install --packages-up-to imu_filter_madgwick --cmake-args -DBUILD_TESTING=OFF
```

### Realsense D435i

安装D435i驱动，创建如下的`rsusb_installation.sh`安装脚本，执行安装`bash rsusb_installation.sh`

{% spoiler "安装脚本rsusb_installation.sh" %}
```bash
#!/bin/bash -xe

#Locally suppress stderr to avoid raising not relevant messages
exec 3>&2
exec 2> /dev/null
con_dev=$(ls /dev/video* | wc -l)
exec 2>&3

if [ $con_dev -ne 0 ];
then
	echo -e "\e[32m"
	read -p "Remove all RealSense cameras attached. Hit any key when ready"
	echo -e "\e[0m"
fi

lsb_release -a
echo "Kernel version $(uname -r)"
sudo apt-get update
cd ~/
sudo rm -rf ./librealsense_build
mkdir librealsense_build && cd librealsense_build

if [ $(sudo swapon --show | wc -l) -eq 0 ];
then
	echo "No swapon - setting up 1Gb swap file"
	sudo fallocate -l 2G /swapfile
	sudo chmod 600 /swapfile
	sudo mkswap /swapfile
	sudo swapon /swapfile
	sudo swapon --show
fi

echo Installing Librealsense-required dev packages
sudo apt-get install git cmake libssl-dev freeglut3-dev libusb-1.0-0-dev pkg-config libgtk-3-dev unzip python3-dev python3-pip libudev-dev -y
rm -f ./master.zip

wget https://github.com/realsenseai/librealsense/archive/master.zip
unzip ./master.zip -d .
cd ./librealsense-master

echo Install udev-rules
sudo cp config/99-realsense-libusb.rules /etc/udev/rules.d/ 
sudo cp config/99-realsense-d4xx-mipi-dfu.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger 
mkdir build && cd build
cmake ../ -DFORCE_RSUSB_BACKEND=ON -DCMAKE_BUILD_TYPE=release -DBUILD_PYTHON_BINDINGS:BOOL=true -DPYTHON_EXECUTABLE=/usr/bin/python3
make -j$(nproc)
sudo make install
echo -e "\e[92m\n\e[1mLibrealsense script completed.\n\e[0m"

```
{% endspoiler %}

安装realsense ros2

```bash
source_ros_humble  # source ros2 humble
git clone -b ros2-master https://github.com/realsenseai/realsense-ros.git src/realsense-ros
colcon build --symlink-install --packages-up-to realsense2_camera --cmake-args -DBUILD_TESTING=OFF
```
