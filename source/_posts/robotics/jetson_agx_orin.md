---
title: Jetson AGX Orin 配置
hide: false
math: true
abbrlink: 25605
date: 2024-12-29 14:47:35
index\_img:
banner\_img:
category:
 - Robotics
tags:
---
记录下对Nvidia机载电脑Jetson AGX Orin的配置过程：
1. 使用SDKManager docker镜像刷JetPack高版本(5.x版本能直接识别带有IMU的设备, 而6.x版本需要使用uvc后端且无法识别带IMU的设备)

## SDKManager刷机
> 参考[闫金钢的Blog - Nvidia Jetson AGX Orin系统刷写](https://blog.yanjingang.com/?p=9092)

这里需要一条DC 12V的电源线，用来给AGX供电，还需要另一台带有Docker的电脑用来刷机，接线如下所示:
|先接上电脑(白线)|再接上电源|
|-|-|
|![img1](/figures/robotics/Jetson/AGX_flash_real1.jpg)|![img1](/figures/robotics/Jetson/AGX_flash_real2.jpg)|
|如果进入了显示界面说明没成功进入刷机，关机后拔掉DC电源线，按住**中间的按钮**，插上中间的电源线，如果屏幕没有亮松开按钮，在电脑上输入`lsusb`可以看到一行`NVIDIA Corp. APX`信息，说明成功进入恢复模式。|如果没有12V DC直流电源线，使用type-C电源线插到DC插口上方的type-C接口上也是可以的。|

### 可视化窗口安装
进入[skd-manager下载界面](https://developer.nvidia.com/sdk-manager)点击`.deb Ubuntu`下载并安装在主机上，安装完成后，终端输入`sdkmanager`即可打开可视化窗口（如果打不开尝试`sdkmanager --no-sandbox`）
|STEP01|STEP02|STEP03|
|-|-|-|
|![img1](/figures/robotics/Jetson/AGX_GUI_flash1.png)|![img2](/figures/robotics/Jetson/AGX_GUI_flash2.png)|![img3](/figures/robotics/Jetson/AGX_GUI_flash3.png)|
|连接上AXG，选择要刷的版本|选择要安装的程序|设置用户名与密码开始刷机|

### Docker CLI 安装5.1.4

> 由于我的host主机是Ubuntu24.02，无法安装5.1.4，必须用镜像，推荐用可视化窗口安装

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

{% spoiler "保存容器为镜像(不推荐, 镜像高达78.1GB)" %}
完成安装后我们可以保存本次下载的容器为镜像
```bash
docker commit JetPack_AGX_Orin_Devkit  jetpack_agx_orin_devkit:5.1.4_flash
```
下次如果还要刷机直接启动本次镜像即可
```bash
docker run -it --rm --privileged -v /dev/bus/usb:/dev/bus/usb/ jetpack_agx_orin_devkit:5.1.4_flash
```
{% endspoiler %}

## RealSense SDK & ROS 安装
### JetPack 5.x
直接按照官网的安装方法安装即可: [`4. Install with Debian Packages`](https://github.com/IntelRealSense/librealsense/blob/master/doc/installation_jetson.md#4-install-with-debian-packages)
安装完成后执行`realsense-viewer`插上摄像头即可看到图像(IMU也可以识别)
### JetPack 6.x
参考realsense官方人员给出的回复([帖子](https://support.intelrealsense.com/hc/en-us/community/posts/31576776977427-cannot-connect-D455-on-jetson-agx-orin))，因为包含IMU摄像头为HID设备，需要MIPI驱动，安装这个驱动非常麻烦，参考[realsense_mipi_platform_driver](https://github.com/IntelRealSense/realsense_mipi_platform_driver)，基本没有仍和参考文档，根本装不上。

帖子下方给出了另一个[很好的方法](https://support.intelrealsense.com/hc/en-us/community/posts/31576776977427/comments/31683171974419)，基于[libuvc_installation.md](https://github.com/IntelRealSense/librealsense/blob/master/doc/libuvc_installation.md)安装UVC后端的realsense即可，三行即可解决
```bash
wget https://github.com/IntelRealSense/librealsense/raw/master/scripts/libuvc_installation.sh
chmod +x ./libuvc_installation.sh
# 执行安装前推荐使用全cpu编译cmake效率更高
gnome-text-editor libuvc_installation.sh
# 找到倒数第3行, make -j2 改为
make -j${nproc}
# 保存退出
# 开始安装
./libuvc_installation.sh
```
**D435i**的IMU读取方法，如果直接打开`realsense-viewer`还是无法读取IMU数据，一读取就会报错，解决方法就是将相机的Firmware降级到适配你相机的最低版本，参考[D455 Errors when activating imu stream in rs-viewer中的一条回复](https://github.com/IntelRealSense/librealsense/issues/13130#issuecomment-2225099648)，方法很简单，先在[Firmware releases D400](https://dev.intelrealsense.com/docs/firmware-releases-d400)找到你相继对应的最低驱动版本，例如我的D435i就是[Version-5_12_7_100](https://www.intelrealsense.com/wp-content/uploads/2020/08/D400_Series_Production_FW_5_12_7_100.zip?_ga=2.41355745.2140590151.1735553428-1109731474.1735553428)，下载解压得到`*.bin`文件，通过[Firmware Update Tool](https://dev.intelrealsense.com/docs/firmware-update-tool)安装教程(安装librealsense时候就附带安装了)安装
```bash
rs-fw-update  # 查看当前连接的相机驱动版本
rs-fw-update -f Signed_Image_UVC_5_12_7_100.bin  # 安装驱动
```
安装完成后执行`realsense-viewer`插上摄像头即可看到图像🥰(还可以看到IMU哦)
![JetPack 6.1安装UVC后端显示realsense-viewer连接D435i](/figures/robotics/Jetson/AGX_JetPack6.1_UVC_D435i_realsense-viewer.png)

### ROS2中启动realsense相机节点
我安装的ROS2版本为humble，直接按照官方给出的教程[Ubuntu-Install-Debs](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)即可轻松安装

完成ROS2安装后，参考[No RealSense devices were found! 中的评论](https://github.com/IntelRealSense/realsense-ros/issues/3075#issuecomment-2082810453)，必须使用源码编译方式安装才能检测到相机，参考官方[realsense-ros installation-on-ubuntu Step3 Option2](https://github.com/IntelRealSense/realsense-ros?tab=readme-ov-file#installation-on-ubuntu)安装
> 安装colcon: `sudo apt install python3-colcon-common-extensions`
> 如果执行`sudo rosdep init`报错，参考[CSDN - rosdep update — The read operation timed out 解决方法](https://blog.csdn.net/wohu1104/article/details/126337787) (将所有`raw.githubusercontent.com`前面都加上代理)

完成全部安装后，以后就不要使用`source /opt/ros/humble/setup.sh`了，直接使用`source /home/${USER}/ros2_ws/install/setup.sh`加载ROS2环境即可
> 参考[reddit - If I use ros2 built from source, can I use "sudo apt install ros-distro-package" to install packages??](https://www.reddit.com/r/ROS/comments/mp6fe8/if_i_use_ros2_built_from_source_can_i_use_sudo/)发现ROS2貌似不支持将自己编译的包，安装到root环境下，通过`ros2_ws/install/setup.sh`即可初始化整个ROS2环境+自定义包了

开三个终端分别启动如下指令
```bash
ros2 run realsense2_camera realsense2_camera_node  # 启动相机节点
rviz2  # 启动rviz2查看camera和DeepCloud
ros2 topic echo /camera/camera/accel/sample  # 查看IMU加速度信息节点
```
在rviz2中加入下图中左侧的窗口(点击Add按钮加入窗口)，选择对应的topic节点，就可以看到效果啦🥳

![使用rviz2查看ROS2启动的D435i相机相关节点](/figures/robotics/Jetson/AGX_D435i_ROS2_view.png)

