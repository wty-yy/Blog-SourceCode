---
title: ROS1入门
hide: false
math: true
abbrlink: 19333
date: 2024-12-09 11:11:26
index\_img:
banner\_img:
category:
- Robotics
- ROS
tags:
---

# ROS
参考官方教程进行学习[ROS/Tutorials](http://wiki.ros.org/ROS/Tutorials)，先从ROS1开始学习而不是ROS2，是因为很多项目还是基于ROS1的，而且ROS1/2很多地方并不兼容，例如ROS2就没有catkin编译了，而且很多包名称都不相同，因此还是从ROS1开始学习吧！

## 什么是ROS
从官网上的[ROS/Introduction](http://wiki.ros.org/cn/ROS/Introduction)中可以看出，ROS是一个用于管理机器人控制的操作系统（既可以从底层控制每一个电机，也可以结合上层信息，通过雷达、深度相机进行决策），ROS运行时类似一个系统，可以开启多个不同的进程，他们称之为节点。

这个系统中的通讯包含不同类型：同步的services（服务），异步的topics（话题），以及用于数据存储的Parameter Server（参数服务器）

ROS所支持的语言有Python, C++, Lisp，下面开始用Docker安装ROS1吧。

## 安装
在[ROS/Installation](http://wiki.ros.org/Installation)上可以看到当前ROS1最长维护的版本为ROS Noetic，推荐Ubuntu20.04（高版本装不上😭），但是我们不能为了装个ROS去装这个版本的系统，因此需要用到Docker，还可以方便的使用不同版本的ROS🤗。

Docker安装与常用命令可以参考我这篇[博文](/posts/51856/)，安装完成Docker后，可以直接从docker hub上pull我准备好的ROS1环境（下载大小为1.33 GB，支持Nvidia 11.8驱动，zsh, tmux, git等工具）
```bash
docker pull wtyyy/ros:ros1-noetic-cuda11.8.0-ubuntu20.04  # 记得开代理或镜像
xhost +local:root  # 用于可视化
CATKIN_WORKSPACE=/home/yy/Coding/learn/catkin  # 路径设置为本机的catkin代码保存路径

# 启动!
# 很多nvidia或gpu相关的指令都是启动nvidia渲染X11用的, 如果没有nvidia显卡则无需这些指令（加了也没坏处）
docker run -it \
	--name ${USER}_learn_ros \
	--gpus all \
	-e NVIDIA_DRIVER_CAPABILITIES=all \
	-e "__NV_PRIME_RENDER_OFFLOAD=1" \
	-e "__GLX_VENDOR_LIBRARY_NAME=nvidia" \
	--net=host \
	--privileged \
	-e "DISPLAY" -e "QT_X11_NO_MITSHM=1" \
	-v "/dev:/dev" \
	-v "/tmp/.X11-unix:/tmp/.X11-unix" \
	-v "$CATKIN_WORKSPACE:/catkin" \
	wtyyy/ros:ros1-noetic-cuda11.8.0-ubuntu20.04 zsh
```

（当然也可以自己跟着官方教程[ROS/Installation Ubuntu](http://wiki.ros.org/Installation/Ubuntu)自己动手安装）

## 初级教程
### 1. 配置ROS环境



