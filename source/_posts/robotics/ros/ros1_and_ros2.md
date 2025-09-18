---
title: Ubuntu22.04安装ROS1 Noetic和ROS2 Humble
hide: false
math: true
category:
  - Robotics
  - ROS
abbrlink: 30632
date: 2025-09-11 21:54:30
index\_img:
banner\_img:
tags:
---

由于乐聚Kuavo机器人下位机用ROS1，而我们代码是在原先上位机ROS2中完成，因此需要安装ros1_bridge来进行通讯，现在换成AGX Jetson 6.2.1 Ubuntu22.04，安装ROS1 Noetic和ROS2 Humble才可以启动ros1_bridge，这里总结出一个比较简单易用的流程。

## 环境配置
我们的安装环境为Docker Ubuntu 22.04，AGX容器下载及启动方法请见[Jetson AGX Orin配置 - docker测试容器cuda可用性](/#docker测试容器cuda可用性)

参考教程
- [GitHub Gist - Meltwin/Noetic-Ubuntu22.04.md](https://gist.github.com/Meltwin/fe2c15a5d7e6a8795911907f627255e0)，这里详细给出了`rosdep`如何修复，但是我修复了还是无法通过 `rosdep` 自动安装依赖，还不如手动安装全部依赖
- [知乎 - Ubuntu22.04 安装 Ros1 Noetic](https://zhuanlan.zhihu.com/p/688413327)，这个更像是上文的中文翻译版，内容差不多，但是 `rosdep` 还是不能用
- [ppqppl blog - ROS安装详细教程 - Ubuntu22.04LTS安装](https://www.cnblogs.com/ppqppl/articles/17004159.html)，这个介绍比较详细，并给出的全部的依赖包无需一个个找了（就是Blog无法直接复制内容，不知道什么原因）

## ROS2 Humble安装

在Ubuntu22.04上面可以直接按照[官方流程完成ROS2的安装](http://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)

## ROS1 Noetic安装
安装编译依赖
```bash
sudo apt-get install python3-rosdep python3-rosinstall-generator python3-vcstools python3-vcstool build-essential
```

创建ROS1编译路径
```bash
mkdir ~/noetic_ws
cd ~/noetic_ws
```

下载desktop版的ROS1 Noetic到 `~/noetic_ws/src` 文件夹下
```bash
rosinstall_generator desktop --rosdistro noetic --deps --tar > noetic-desktop.rosinstall
# 或者安装desktop-full
# rosinstall_generator desktop --rosdistro noetic --deps --tar > noetic-desktop.rosinstall
mkdir ./src
vcs import --input noetic-desktop.rosinstall ./src
```

**注意**：`vcs` 这一步下面会出现很多的点点 `.`，就表示完成下载，如果出现 `E` 就说明无法下载，最后命令结束后会显示有哪些包没下下来并给出路径，这个下载路径是正确的，可能是Python的BUG，因此只需要重新下载下来解压放进去即可，例如我遇到的 `rosconsole_bridge` 和 `xmlrpcpp` 重新下载，以 `rosconsole_bridge` 下载为例
```bash
wget https://codeload.github.com/ros-gbp/rosconsole_bridge-release/tar.gz/refs/tags/release/noetic/rosconsole_bridge/0.5.5-1
# 解压
tar -xf 0.5.5-1
# 会得到一个文件夹, 直接移动到 ~/noetic_ws/src 下即可
mv rosconsole_bridge-release-release-noetic-rosconsole_bridge-0.5.5-1 ~/noetic_ws/src
```

手动安装全部依赖包：
```bash
sudo apt install libboost-all-dev uuid-dev python3-nose google-mock libgtest-dev libbz2-dev libgpgme-dev libssl-dev python3-coverage libboost-program-options-dev python3-psutil python3-opengl python3-pygraphviz python3-pydot qt5-qmake sbcl libapr1-dev libaprutil1-dev libboost-regex-dev liblog4cxx-dev python3-matplotlib libpyside2-dev libshiboken2-dev pyqt5-dev python3-pyqt5 python3-pyqt5.qtsvg python3-pyside2.qtsvg python3-sip-dev shiboken2 lm-sensors graphviz python3-paramiko python3-pycryptodome python3-gnupg python3-defusedxml python3-pyqt5.qtopengl libcurl4-openssl-dev libpoco-dev libogre-1.9-dev libassimp-dev libogre-1.9.0v5 libyaml-cpp-dev libgl1-mesa-dev libglu1-mesa-dev libqt5opengl5 libqt5opengl5-dev libopencv-dev python3-opencv python3-pykdl tango-icon-theme liborocos-kdl-dev libtinyxml-dev libtinyxml2-dev liburdfdom-headers-dev python3-numpy python3-empy libboost-filesystem-dev libboost-thread-dev python3-pygraphviz python3-pygraphviz python3-mock libboost-date-time-dev libboost-system-dev liburdfdom-dev libboost-chrono-dev libboost-dev libqt5core5a libqt5gui5 libqt5widgets5 qtbase5-dev  libconsole-bridge-dev liblz4-dev python3-pyqt5.qtwebkit exfatprogs
```

后面会出现 `rosconsole` 的编译报错，提前修复下，重新git下来，切换分支替换回去：
```bash
git clone https://github.com/lucasw/rosconsole.git
cd rosconsole
git checkout concise_output_roso
cd ..

# 删除下载下来的错误包
rm -rf ~/noetic_ws/src/rosconsole
# 替换过去
mv rosconsole ~/noetic_ws/src/rosconsole
```

后面还会出现 `shared_mutex` 的报错，修改 `/usr/include/log4cxx/boost-std-configuration.h` 内容：
```bash
#define STD_SHARED_MUTEX_FOUND 1
#define Boost_SHARED_MUTEX_FOUND 0
```
变为
```bash
#define STD_SHARED_MUTEX_FOUND 0
#define Boost_SHARED_MUTEX_FOUND 1
```

开始编译并安装（我安装的是 `desktop` 版本总共184个包，AGX 30W功率下全部编译完成用时33min59s，建议用jtop切换为MAXN模式，速度会快一倍）
```bash
sudo mkdir /opt/ros/noetic
sudo ./src/catkin/bin/catkin_make_isolated --install -DCMAKE_BUILD_TYPE=Release --install-space /opt/ros/noetic
```

> 如果分开编译和安装，可能在安装时报错，因此还是这样编译并安装成功率更高

![全部编译184个包用时33min59s](/figures/robotics/ros1_and_ros2/ros1_compile_finished.png)

最后安装下
```bash
sudo apt install python3-roslaunch
```
测试 `roscore` 可不可以使用
```bash
source /opt/ros/noetic/setup.sh
roscore
```

完成上述全部安装后，编译代码就没有用了，可以删除全部代码。也可以仅删除编译缓存释放空间，避免后续出BUG要重新编译而重复下载
```bash
# 删除编译和开发目录，这会释放G字节级别的空间
cd ~/noetic_ws
rm -rf build_isolated devel_isolated install_isolated
```

## 测试ROS1和ROS2
这里简单测试下rviz是否都可以启动
```bash
# 终端1
source /opt/ros/noetic/setup.sh
roscore
# 终端2
source /opt/ros/noetic/setup.sh
rviz
# 终端3
source /opt/ros/humble/setup.sh
rviz2
```
可以得到如下的效果
![同时显示rviz和rviz2](/figures/robotics/ros1_and_ros2/ros1_and_ros2_show_rviz.png)

## ros1_bridge安装
参考 [ros1_bridge安装及自定义消息](/posts/62745/)

