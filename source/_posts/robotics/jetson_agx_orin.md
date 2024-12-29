---
title: Jetson AGX Orin 配置
hide: false
math: true
abbrlink: 25604
date: 2024-12-29 14:47:35
index\_img:
banner\_img:
category:
 - Robotics
tags:
---
记录下对Nvidia机载电脑Jetson AGX Orin的配置过程：
1. 使用SDKManager docker镜像刷JetPack 5.1.4版本(因为要用D435i只能装5.x版本的不然无法识别)

## SDKManager刷机
> 参考[闫金钢的Blog - Nvidia Jetson AGX Orin系统刷写](https://blog.yanjingang.com/?p=9092)

这里需要一条DC 12V的电源线，用来给AGX供电，还需要另一台带有Docker的电脑用来刷机，接线如下所示:
|先接上电脑(白线)|再接上电源|
|-|-|
|![img1](/figures/robotics/Jetson/AGX_flash_real1.jpg)|![img1](/figures/robotics/Jetson/AGX_flash_real2.jpg)|
如果进入了显示界面说明没成功进入刷机，关机后拔掉DC电源线，按住**中间的按钮**，插上中间的电源线，如果屏幕没有亮松开按钮，在电脑上输入`lsusb`可以看到AGX的信息，说明成功进入恢复模式。

进入[skd-manager下载界面](https://developer.nvidia.com/sdk-manager)，下载Docker Image Ubuntu18.04 (20.04)也可以安装JetPack 5.x，下载完成后加载镜像，并重新命名为sdkmanager:
```bash
docker load -i sdkmanager-[版本号]-Ubuntu_18.04_docker.tar.gz
docker tag sdkmanager:[版本号]-Ubuntu_18.04 sdkmanager:latest
```

参考[SDK Manager - Docker Images](https://docs.nvidia.com/sdk-manager/docker-containers/index.html)中的教程，执行如下命令行就可以安装`5.1.4`版本的了，如果不是AGX型号，修改`--target JETSON_AGX_ORIN_TARGETS`为对应的型号（全部支持的型号参考[SDK Manager - target-device](https://docs.nvidia.com/sdk-manager/system-requirements/index.html#target-device)）
```bash
docker run -it --privileged \
    -v /dev/bus/usb:/dev/bus/usb/ -v /dev:/dev -v /media/$USER:/media/nvidia:slave \
    --name JetPack_AGX_Orin_Devkit --network host \
    sdkmanager --cli --action install --login-type devzone \
    --product Jetson --target-os Linux --version 5.1.4 \
    --target JETSON_AGX_ORIN_TARGETS --flash --license accept \
    --stay-logged-in true --collect-usage-data enable --exit-on-finish
```
这部分主要分为两步，下载部件，烧录Ubuntu系统
|自动开始部件下载，选择开始烧录|设置用户名，密码，其他默认选项|烧录系统，等待完成|
|-|-|-|
|![img1](/figures/robotics/Jetson/AGX_flash1.png)|![img2](/figures/robotics/Jetson/AGX_flash2.png)|![img3](/figures/robotics/Jetson/AGX_flash3.png)|

系统烧录完成后显示屏会亮起，输入用户名密码进入Ubuntu系统，连接和电脑的局域网(用热点也行)，进行第二部分安装
|选择Install，选择Ethernet cable，IPv4，输入AGX的IP|开始自动安装第二部分(CUDA等)|安装完毕!|
|-|-|-|
|![img4](/figures/robotics/Jetson/AGX_flash4.png)|![img5](/figures/robotics/Jetson/AGX_flash5.png)|![img6](/figures/robotics/Jetson/AGX_flash6.png)|
