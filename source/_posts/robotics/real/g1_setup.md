---
title: 宇树g1-edu 29dof配置
hide: false
math: true
abbrlink: 30512
date: 2025-10-31 03:46:22
index\_img:
banner\_img:
category:
tags:
---

# 网络配置
参考[Unitree - G1_developer](https://support.unitree.com/home/zh/G1_developer)电气接口, 可知9号type-c接口为Jetson Orin NX的带显示接口, 使用拓展坞连接鼠标、键盘、显示屏开机即可打开NX界面, 界面中连接上Wifi, 常用用局域网内的其他电脑ping该设备, 如果无法ping通一般是网卡的优先级默认为有线, 且路由器的网段和上下机的网段相同(都是`192.168.123.*`), 导致外部无法连接到NX, 继续如下方法修改route metric优先级:
```bash
ip a  # 找到无线网卡为 wlan0
ip route  # 看到 wlan0 metric 后面数字就表示优先级, 需要将该数字设置比 eth0 更低即可
sudo nmcli device  # 看到我们的无限网卡为wlan0连接到的wifi名称
sudo nmcli connection modify "wifi名称" ipv4.route-metric 10  # 把wifi的优先级设置为较低的值
sudo nmcli connection up "wifi名称"  # 重启wifi
ip route  # 看到 wlan0 metric后面数字为 10 即可
```
再常使用局域网内其他电脑ping, 应该就能ping通了, 用这个方法只需要每次切换wifi名称时用命令行配置一次即可

