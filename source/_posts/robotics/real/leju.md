---
title: 乐聚Kuavo42机器人真机调试日志
hide: false
math: true
category:
  - Robotics
  - Real
abbrlink: 21424
date: 2025-03-10 11:25:09
index\_img:
banner\_img:
tags:
---
总结下每次调试乐聚Kuavo42真机遇到的问题

```bash
# 真机启动指令为
roslaunch humanoid_controllers load_kuavo_real.launch cali:=true cali_arm:=true
# 关闭所有ros服务, ros意外退出可以用该方法清理
pkill -i ros
# 查看当前是否有正在运行的node
rosnode list
```

{% spoiler 点击显/隐ssh连接ip（曲江） %}
```bash
Host leju_down
    HostName 192.168.31.102
    User lab
    # Password: 三个空格

Host leju_up
    HostName 192.168.31.73
    User kuavo
    # Password: leju_kuavo
```
{% endspoiler %}

### 2025.3.10.
#### 上午
10:30到曲江开始调机器人

`pull kuavo-rl-controller-xjtu`仓库测试通讯延迟问题，结果直接运行该仓库下的`humanoid_controllers`无法找到电机报错
```bash
Error: Joint 10 joint status error!1 
```

分别测试在bash,zsh下运行`kuavo-rl-opensource`仓库中的`humanoid_controllers`虽然能够站立，但行走存在明显延迟，不稳定，有问题

---

再测试mpc控制`kuavo-ros-opensource:beta 8d17a39e2ff9a341d542adf36e2bd63d281c33ed`，只能bash启动，应该是缺少source的库文件，修复下zsh
```bash
# /root/.zshrc加入, 应该是libdrake.so没找到的问题
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/drake/lib
```
可以在bash或zsh下正常使用mpc控制了
> 用`passwd root`将下位机的`root`密码也设置为三个空格了，不然ssh无法直接连上root

---

难道是installed中的interface版本问题，尝试再用zsh运行`kuavo-rl-opensource`，仍然不行，走路严重右偏移；尝试bash下再运行`kuavo-rl-opensource`，依旧有问题

#### 下午
休息到2:40开始继续调

用nomachine测试下mujoco仿真的效果，发现python的exec执行速度非常慢，最高延迟到35ms无法接受

安装下`pip install onnxruntime-openvino`，用openvino试下能否有优化

调取tensorboard报错`TypeError: MessageToJson() got an unexpected keyword argument 'including_default_value_fields`：降级即可解决`pip install tensorboard==2.12.0 protobuf==3.20.2`

在下位机上测试预测时间误差，没看出很大问题
![Mujoco上MPC计算时间误差图像](/figures/robotics/real/kuavo42/tb_logger_leju_down_mujoco.png)

通过将`~/kuavo-rl-opensource/installed`拷贝到`~/kauvo-rl-controller-xjtu/`下，即更换驱动程序，使`kuavo-rl-controller-xjtu`的程序可以运行，得到的延迟曲线如图所示，虽然延迟不高，但不清楚为什么控制效果仍然非常不好，有明显的颤抖（这个重启下电机即可）

启动`kuavo-rl-controller-xjtu`可能出现以下问题，但是执行`kuavo-rl-opensource`就不会有问题，执行一遍`kuavo-rl-opensource`后再执行`kuavo-rl-controller-xjtu`就又好了，非常迷
```bash
[HardwareNode]正在等待 cppad 构建完成...
...
[ INFO] [1741594703.970564987]: Waiting for 'initial_state' parameter to be set...
```

不是很理解为什么，正常rl走一次路以后，就再无法正常了

测试:
1. 重启电机电源，启动`kuavo-rl-opensource`，走路偏右侧
2. 再次重启电机电源，启动`kuavo-rl-opensource`，走路偏右侧
3. 直接启动`kuavo-rl-opensource`，走路偏右侧更严重，走着走着倒了
4. 重启电机电源，启动`kuavo-rl-opensource`，没有成功站起来，初始时弯曲不正确
5. 重启电机电源，启动`kuavo-rl-opensource`，走的非常不稳，掉了个六角杯头螺丝下来
6. 重启电机电源，启动`kuavo-ros-opensource-beta`，OK MPC很稳定没有任何问题，就是向前走路声音非常吵
7. 直接启动`kuavo-rl-opensource`，仍然向右偏非常严重，自己倒了
8. 重启电机，用bash启动`kuavo-rl-opensource`，仍然向右偏非常严重，自己倒了
9. 重启电机，启动`kuavo-rl-controller-xjtu/humanoid_controllers`，仍然右偏严重，控制命令都有向左的方向即可稳住不倒
10. 直接启动`kuavo-rl-controller-xjtu/rl_controller_xjtu`，基本无法行走，抬腿速度非常缓慢，对命令的执行也非常慢（如下图所示，从命令的时间延迟上没看出什么区别）
11. 直接启动`kuavo-rl-opensource`，虽然向右偏，但能基本走
12. 直接启动`kuavo-rl-opensource`，走了一半后，基本无法抬腿，颤抖非常严重
13. 重启电机，启动`kuavo-rl-opensource`，虽然向右偏，但基本能走，最后摔倒
14. 直接启动`kuavo-ros-opensource-beta`，站起来时候直接倒下，掉了一个长的沉头螺丝，重新装回去了
15. 重启电机，启动`kuavo-ros-opensource-beta`，向前走非常不稳，高度站得很低，最后走倒了（日志时间为`~/.ros/stdout/2025-03-10_17-57-33`）
16. 重启电机，启动`kuavo-ros-opensource-beta`，9号电机编码器直接无法读取到数据了，无法启动（日志时间为`~/.ros/stdout/2025-03-10_17-59-56`）

![真机上时间延迟](/figures/robotics/real/kuavo42/tb_logger_leju_down_real.png)

### 2025.3.11.
#### 上午
10点30到曲江开始调试

按照[机器人关节标定教程](https://kuavo.lejurobot.com/beta_manual/basic_usage/kuavo-ros-control/docs/3%E8%B0%83%E8%AF%95%E6%95%99%E7%A8%8B/%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%85%B3%E8%8A%82%E6%A0%87%E5%AE%9A/)对机器人进行重新标定

```bash
# 执行
source devel/setup.bash
roslaunch humanoid_controllers load_kuavo_real.launch cali:=true cali_leg:=true cali_arm:=true

# 显示如下信息
0000012766: Slave 1 actual position 13.7060546,Encoder 89824.0000000
0000012776: Rated current 39.6000000
0000012786: Slave 2 actual position -0.4518127,Encoder -1645.0000000
0000012796: Rated current 11.7900000
0000012806: Slave 3 actual position 24.7090759,Encoder 89963.0000000
0000012816: Rated current 42.4300000
0000012826: Slave 4 actual position -1.4784240,Encoder -9689.0000000
0000012836: Rated current 42.4300000
0000012846: Slave 5 actual position 5.2983093,Encoder 69446.0000000
0000012856: Rated current 8.4900000
0000012866: Slave 6 actual position 6.0652160,Encoder 79498.0000000
0000012876: Rated current 8.4900000
0000012887: Slave 7 actual position 16.2445068,Encoder 106460.0000000
0000012897: Rated current 39.6000000
0000012906: Slave 8 actual position -4.8746337,Encoder -17748.0000000
0000012916: Rated current 11.7900000
0000012927: Slave 9 actual position -2.0871276,Encoder -7599.0000000
0000012937: Rated current 42.4300000
0000012946: Slave 10 actual position -17.6039123,Encoder -115369.0000000
0000012956: Rated current 42.4300000
0000012966: Slave 11 actual position -3.6605835,Encoder -47980.0000000
0000012977: Rated current 8.4900000
0000012987: Slave 12 actual position 10.4799652,Encoder 137363.0000000
0000012997: Rated current 8.4900000
0000013010: Slave 13 actual position 18.7921142,Encoder 68420.0000000
0000013019: Rated current 14.9900000
0000013029: Slave 14 actual position -4.8100891,Encoder -17513.0000000
0000013039: Rated current 14.9900000

# 按c保存当前偏移量到~/.config/lejuconfig/offset.csv文件中
```

