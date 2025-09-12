---
title: ros1_bridge安装及自定义消息
hide: false
math: true
abbrlink: 62745
date: 2025-06-07 16:46:16
index\_img:
banner\_img:
category:
 - Robotics
 - ROS
tags:
---

源代码[GitHub - ros1_bridge](https://github.com/ros2/ros1_bridge)就是在ROS2上启动一个Node从而可以和ROS1进行通讯，只有在Topic, Service被监听时才能在`ros2 topic/service list`中看到

## 安装
> 我这里使用的版本分别为ROS1 noetic, ROS2 humble

首先需要安装ROS1和ROS2，可以使用[鱼香ROS一键安装](https://fishros.org.cn/forum/topic/20/%E5%B0%8F%E9%B1%BC%E7%9A%84%E4%B8%80%E9%94%AE%E5%AE%89%E8%A3%85%E7%B3%BB%E5%88%97)，也可以先安装ROS2或ROS1另一个版本通过二进制安装，建议用apt安装ROS2，否则无法再通过apt对ROS2安装新的程序

参考ros1_bridge官方的安装方法，本质上只需要
```bash
mkdir -p ~/ros1_bridge_ws/src
cd ~/ros1_bridge_ws/src
git clone https://github.com/ros2/ros1_bridge.git
cd ~/ros1_bridge_ws
source /opt/ros/noetic/setup.zsh  # 这两个source顺序貌似随意
source /opt/ros/humble/setup.zsh
colcon build --symlink-install --packages-select ros1_bridge --cmake-force-configure
```

如果编译进度非常缓慢说明找到了ROS1的代码，等待即可，如果编译速度非常快，说明没有找到，我弄了半天也没发现问题所在，但是最后通过切换版本莫名其妙解决了
```bash
cd ~/ros1_bridge_ws/src/ros1_bridge
git checkout foxy  # 切换到错误的版本上
cd ~/ros1_bridge_ws
source /opt/ros/noetic/setup.zsh  # 这两个source顺序貌似随意
source /opt/ros/humble/setup.zsh
# 这次编译一定会报错，但是编译速度很慢应该是找到ROS1的包了
colcon build --symlink-install --packages-select ros1_bridge --cmake-force-configure
# 最后版本切换回去
cd ~/ros1_bridge_ws/src/ros1_bridge
git checkout master
colcon build --symlink-install --packages-select ros1_bridge --cmake-force-configure
# 编译就能找到ROS1的
```

## 使用方法
都是要享用ROS1创建core，再启动`ros2 run ros1_bridge dynamic_bridge`连接上ROS1的core，后续就可以通讯了

```bash
# 终端1
source /opt/ros/noetic/setup.zsh
# 启动core
roscore
# 或者
rosmater --core  # 这个可以跳过日志记录从而避免ros1_bridge显示大量的 failed to create 2to1 bridge for topic '/rosout'...报错

# 终端2
source ~/ros1_bridge_ws/install/setup.zsh
ros2 run ros1_bridge dynamic_bridge
```

### ROS1创建Topic用ROS2接收
```bash
# 终端3 测试ROS1发送/chatter的topic
source /opt/ros/noetic/setup.zsh
rosrun rospy_tutorials talker

# 终端4 测试ROS2接收/chatter的topic
source /opt/ros/humble/setup.zsh
ros2 run demo_nodes_cpp listener

# 查看ROS2是否有/chatter的topic
source /opt/ros/humble/setup.zsh
ros2 topic list
```

### ROS2创建Topic用ROS1接收
```bash
# 终端3
source /opt/ros/noetic/setup.zsh
rosrun rospy_tutorials listener

# 终端4
source /opt/ros/humble/setup.zsh
ros2 run demo_nodes_cpp talker

# 查看ROS1是否有/chatter的topic
source /opt/ros/noetic/setup.zsh
rostopic list
```

### 指定转发的Topic和Service
- ROS中的Topic相当于一个共享的通讯平台，所以Topic转发是双向的，ROS1或ROS2都可以发送或者接收数据，所以只能指定需要转发的Topic名称即可
- ROS中的Service具有方向性，分为服务端和客户端，如果ROS1是服务端，那么则需要启动`services_2_to_1`将ROS2客户端的请求发送到ROS1上，反之亦然

ros1_bridge的方法是在ROS1的param中添加yaml配置文件，可以包含`topics, services_2_to_1, services_1_to_2`分别表示共享的Topic，ROS1作为服务端的Service，ROS2作为服务端的Service，以如下的`bridge.yaml`为例
```yaml
topics:  # 这是一个List
  -  # List元素是一个Dict
    topic: /chatter  # Topic name on both ROS 1 and ROS 2
    type: std_msgs/msg/String  # Type of topic to bridge
    queue_size: 1  # Queue size
# -  # 可以有更多元素
#   topic: /rosout
#   type: rosgraph_msgs/Log
#   queue_size: 1
services_2_to_1:
  -
    service: /add_two_ints  # ROS 1 service name
    type: roscpp_tutorials/TwoInts  # The ROS 1 service type name
# services_1_to_2:  # 可以忽略ROS2的客户端
```

```bash
# 终端1 启动core
source /opt/ros/noetic/setup.zsh
roscore

# 终端2 加载转发配置
source /opt/ros/noetic/setup.zsh
rosparam load bridge.yaml
# 随便启动一个Service或者Topic
rosrun roscpp_tutorials add_two_ints_server
# 或者
rosrun rospy_tutorials talker

# 终端3 启动ros1_bridge
source /opt/ros/humble/setup.zsh
ros2 run ros1_bridge parameter_bridge  # 注意这里启动的是parameter_bridge而不是dynamic_bridge

# 终端4 启动Service发送信息或者接收Topic
source /opt/ros/humble/setup.zsh
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 1, b: 2}"
# 或者
ros2 run demo_nodes_cpp listener
```

### ROS1的多机通讯
由于这个ros1_bridge必须一个ROS1的roscore，因此还是ROS1的多机通讯原理，所有的端机需做两个全局变量配置：
- `ROS_IP`：本机在局域网中的IP地址
- `ROS_MASTER_URI`：运行roscore的URI，格式为`http://[主机的IP]:11311`

可以将上述两个变量放在`~/.bashrc`或`~/.zshrc`中，通过`export ROS_IP=***`和`export ROS_MASTER_URI=***`来创建，可以在终端查看当前变量的值，例如
```bash
❯ echo ROS_IP=$ROS_IP \\nROS_MASTER_URI=$ROS_MASTER_URI
ROS_IP=192.168.26.1
ROS_MASTER_URI=http://192.168.26.15:11311
```

接下来在MASTER主机上执行`roscore`，运行`rosrun rospy_tutorials talker`，在另一台电脑的ROS1上执行`rostopic echo /chatter`看是否能够接收到消息，否则检查两两端机之间能否相互通过IP `ping`通，如果接收`chatter`消息没问题，则同上执行ros1_bridge的操作，即可在ROS2中获取到另一台ROS1端机上的信息了

### 自定义转发的srv
我们实现的自定义ros1_bridge消息: [Gitee - ws_618_ros1_bridge](https://gitee.com/wty-yy/ws_618_ros1_bridge)

参考
1. [ros-humble-ros1-bridge-builder](https://github.com/TommyChangUMD/ros-humble-ros1-bridge-builder?tab=readme-ov-file#checking-example-custom-message)
2. [custom_msgs](https://github.com/TommyChangUMD/custom_msgs)
3. [ros2_bridge_custom_interfaces](https://github.com/lFatality/ros2_bridge_custom_interfaces)

