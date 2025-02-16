---
title: Livox mid-360+ROS2+FAST_LIO
hide: false
math: true
abbrlink: 43386
date: 2025-02-03 15:53:25
index\_img:
banner\_img:
category:
  - Robotics
tags:
---

## 软硬件型号
1. Ubuntu(24.04) + Docker
2. Docker - ROS2 Humble: [Docker镜像下载](https://hub.docker.com/repository/docker/wtyyy/ros)
---
1. Livox mid-360 + 三分数据线(DC电源线, 网线, 多功能数据线)
2. 9~27V DC电源 + (接线端子/直接焊DC电源线和TX接口)
3. 带有网口的主机

## Livox SDK2 + ROS2驱动安装
> 参考[CSDN - 大疆Livox MID-360/HAP安装ROS1/2驱动 Ubuntu20.04](https://blog.csdn.net/zardforever123/article/details/134219903)

安装Livox SDK2(3.2节)之前的步骤都可以跟上述教程走，安装ROS驱动：
```bash
cd ~
git clone https://github.com/Livox-SDK/livox_ros_driver2.git ws_livox/src/livox_ros_driver2
cd ws_livox/src/livox_ros_driver2
# --- 修改colcon编译选项 ---
vim build.sh
# 找到colcon命令执行处(61行), 在该行最后加上 --symlink-install
# 便于修改配置文件
colcon build ... --symlink-install
# --------------------------
# 安装ROS2 humble
./build.sh humble
```

将Livox SDK2的动态链接库加入路径中
```bash
# For bash
vim ~/.bashrc
# For zsh
vim ~/.zshrc
# Add line:
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib
# For bash
source ~/.bashrc
# For zsh
source ~/.zshrc
```

修改`~/ws_livox/src/livox_ros_driver2/config/MID360_config.json`中主机ip(`MID360['host_net_info']['cmd_data_ip']`)和雷达ip(`lidar_configs[0]['ip']`)，其中雷达ip`192.168.1.1xx`中的`xx`为雷达S/N码最后两位（可以在雷达包装盒或雷达侧面二维码下方找到），可以通过`ping 192.168.1.1xx`判断ip是否正确

```toml
vim ~/ws_livox/src/livox_ros_driver2/config/MID360_config.json
# 主机ip
"cmd_data_ip" : "192.168.1.50",

# 雷达ip
"ip" : "192.168.1.1xx",
```

启动
```bash
cd ~/ws_livox
source install/setup.sh
ros2 launch livox_ros_driver2 rviz_MID360_launch.py
```
![rviz2效果图](/figures/robotics/lidar/mid-360-rviz2.png)

## LAST LIO
使用LAST LIO的ROS2分支安装LAST LIO可以直接用MID-360做SLAM建图，参考[FAST LIO-ROS2 #Build](https://github.com/hku-mars/FAST_LIO/tree/ROS2?tab=readme-ov-file#2-build)，编译安装完成后，就可以开始建图了：
```bash
ros2 launch livox_ros_driver2 msg_MID360_launch.py  # 启动MID360通讯节点
ros2 launch fast_lio mapping.launch.py config_file:=mid360.yaml  # 启动建图
```

### 保存map
建立完成后的数据如果想要保存下来，需要解开[src/laserMapping.cpp](https://github.com/hku-mars/FAST_LIO/blob/ROS2/src/laserMapping.cpp)文件中的516行下方的所有注释，重新编译。

再参考[PCD file save](https://github.com/hku-mars/FAST_LIO/tree/ROS2?tab=readme-ov-file#34-pcd-file-save)将yaml配置文件中的`pcd_save_en`置为true（默认就是true）。

这样在关闭LAST_LIO建图时，就会默认保存当前图，到`[FAST_LIO_WS]/PCD/scans.pcd`，使用`pcl_viewer scans.pcd`可以查看点云图。

|酒店房间建图|道路建图|
|-|-|
|![img1](/figures/robotics/lidar/slam_map_hotal.png)|![img2](/figures/robotics/lidar/slam_map_road.png)|

> tips: 在`pcl_viewer`中按`h`，可以在命令行中看到额外功能有哪些，例如数字`1~9`可以切换配色。

