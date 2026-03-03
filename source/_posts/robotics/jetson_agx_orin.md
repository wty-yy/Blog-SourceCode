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

### Docker CLI 安装 (推荐)

> 由于我的host主机是Ubuntu24.02，无法安装6.2.1和5.1.4，必须用镜像安装（Nvidia agx nano的最高版本支持就是6.2.1，7.*不再支持）

进入[skd-manager下载界面](https://developer.nvidia.com/sdk-manager)，下载Docker Image Ubuntu18.04 (20.04)可以安装JetPack 5.x，Ubuntu22.04可以安装JetPack 6.2.1，下载完成后加载镜像，并重新命名为sdkmanager:
```bash
docker load -i sdkmanager-[版本号]-Ubuntu_18.04_docker.tar.gz
docker tag sdkmanager:[版本号]-Ubuntu_18.04 sdkmanager:latest
```

参考[SDK Manager - Docker Images](https://docs.nvidia.com/sdk-manager/docker-containers/index.html)中的教程，执行如下命令行就可以安装`5.1.4`版本的了，如果不是AGX型号，修改`--target JETSON_AGX_ORIN_TARGETS`为对应的型号（全部支持的型号参考[SDK Manager - target-device](https://docs.nvidia.com/sdk-manager/system-requirements/index.html#target-device), Jetson硬件对应的可刷版本参考[Jetson Linux Archive](https://developer.nvidia.com/embedded/jetson-linux-archive)）
```bash
docker run -it --privileged \
    -v /dev/bus/usb:/dev/bus/usb/ -v /dev:/dev -v /media/$USER:/media/nvidia:slave \
    -v ~/nvidia/sdkmanager_data:/home/nvidia/Downloads/nvidia \
    --name JetPack_AGX_Orin_Devkit --network host \
    sdkmanager --cli --action install --login-type devzone \
    --product Jetson --target-os Linux --version 5.1.4 \
    --target JETSON_AGX_ORIN_TARGETS --flash --license accept \
    --stay-logged-in true --collect-usage-data enable --exit-on-finish
```
> 这里在官方的基础上加了一行 `-v ~/nvidia/sdkmanager_data:/home/nvidia/Downloads/nvidia`，这样可以将下载的内容挂载到宿主机，无需重复下载

这部分主要分为两步，下载部件，烧录Ubuntu系统
|自动开始部件下载，选择开始烧录|设置用户名，密码，其他默认选项|烧录系统，等待完成|
|-|-|-|
|![img1](/figures/robotics/Jetson/AGX_flash1.png)|![img2](/figures/robotics/Jetson/AGX_flash2.png)|![img3](/figures/robotics/Jetson/AGX_flash3.png)|

系统烧录完成后显示屏会亮起，输入用户名密码进入Ubuntu系统，连接和电脑的局域网(用热点也行)，进行第二部分安装
|选择Install，选择Ethernet cable，IPv4，输入AGX的IP|开始自动安装第二部分(CUDA, container等)|安装完毕!|
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

## 前置工作
1. 如果有加装固态硬盘需要手动进行挂载，参考 [常用命令及函数 - Linux -  格式化及挂载硬盘](/posts/64648/#格式化及挂载硬盘)
2. 配置Docker
    - 修改用户权限，参考 [Docker安装与常用命令 - Docker 安装](/posts/51856/#docker-安装)
    - 如果有固态硬盘推荐将Docker存储位置移动到固态上，系统盘就64Gb，参考 [Docker安装与常用命令 - Docker 移动镜像位置](/posts/51856/#docker-移动镜像位置)
    - 使用代理，参考 [Docker安装与常用命令 - 代理加速](/posts/51856/#docker-代理加速)
3. Ubuntu22.04以上版本Fcitx5的中文输入法安装及外观/字体大小调整，参考 [从零配置Ubuntu全过程 - 安装中文输入法](/posts/46722/#安装中文输入法)
4. Clash快捷方式设置及自启动，参考 [从零配置Ubuntu全过程 -  Clash安装、快捷方式、自动启动](/posts/46722/#clash安装-快捷方式-自动启动)
5. 网络配置，如果agx和其他的主机需要通过网线直连，则要设置静态IP，参考 [乐聚Kuavo机器人上位机静态网络配置](/posts/1797/)
6. VNC网页版可视化界面，参考 [实现Linux无头模式下硬件加速的屏幕共享 - Nvidia Jetson可视化配置](/posts/47970/#nvidia-jetson可视化配置)
7. 推荐安装jtop查看显卡使用率：
    ```bash
    sudo apt install python3-pip
    sudo pip3 install -U jetson-stats
    jtop  # 类似nvitop
    ```
    通过jtop下方第六项CTRL，可以修改当前的功率大小，推荐开到最大功率 `MAXN`

如果发现 `sudo apt update` 中报错docker源不正确，可以直接删除 `sudo rm /etc/apt/sources.list.d/docker.list` 文件，再次更新则不会报错。（因为后续无需对docker升级所以删除源不会有影响）

### Docker测试容器CUDA可用性

#### jetson-containers
[GitHub - jetson-containers](https://github.com/dusty-nv/jetson-containers)这里面有很多DockerFile，甚至他们帮忙设计好了build命令直接运行即可，参考文档安装上就能用，他们的命名规则为：
- r32最低支持`JetPack 4.*`
- r35最低支持`JetPack 5.*`
- r36最低支持`JetPack 6.*`

这里推荐他们已经装好的镜像：
- Ubuntu22.04, CUDA12.2, TensorRT, onnxruntime: `docker pull dustynv/onnxruntime:r36.2.0`

我在他们这个镜像基础上参考教程[PyTorch for Jetson](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048)，使用pip wheel安装上了`PyTorch 2.3`以及`torchvision 0.18`
- `docker pull wtyyy/jetson:cuda12.2-torch-torchvision-onnxruntime-ubuntu22.04`
启动命令
```bash
docker run -it \
    --name cuda \
    --runtime=nvidia \
    --net=host \
    wtyyy/jetson:cuda12.2-torch-torchvision-onnxruntime-ubuntu22.04 bash
```
测试代码是否可用
```bash
cd ~/Coding/tests
python3 test_onnx.py
python3 test_onnx2.py
python3 test_torch.py
python3 test_torchvision.py
```

#### 仅安装容器中驱动
在命令行中用 `nvidia-smi` 查看当前的CUDA最高支持版本，例如我安装的是6.2.1，可用CUDA版本为12.6，在[Nvidia容器站 nvcr.io](https://catalog.ngc.nvidia.com/containers?filters=&orderBy=weightPopularDESC&query=&page=&pageSize=)搜索 `l4t` 可以看到 [`NVIDIA L4T CUDA`](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/l4t-cuda)，在这里点击Tags找到对应的版本，例如我用的是 `12.6.11-runtime`，下拉镜像并启动：
```bash
docker pull nvcr.io/nvidia/l4t-cuda:12.6.11-runtime
docker run --name cuda --runtime=nvidia -it nvcr.io/nvidia/l4t-cuda:12.6.11-runtime
# 进入容器后测试显卡是否能找到, 如下图显示就是成功
nvidia-smi
```
![容器CUDA测试](/figures/robotics/Jetson/AGX_docker_container_test.png)

#### 安装Pytorch, CUDA, cudnn
参考[Nvidia - PyTorch for Jetson Platform](https://docs.nvidia.com/deeplearning/frameworks/install-pytorch-jetson-platform-release-notes/pytorch-jetson-rel.html)可知，在[nvcr.io - PyTorch](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch)中下载带有iGPU就是为Jetson准备的，可以直接下载对应的版本

## RealSense SDK & ROS 安装
### JetPack 5.x
直接按照官网的安装方法安装即可: [`4. Install with Debian Packages`](https://github.com/IntelRealSense/librealsense/blob/master/doc/installation_jetson.md#4-install-with-debian-packages)
安装完成后执行`realsense-viewer`插上摄像头即可看到图像(IMU也可以识别)
### JetPack 6.x （万能方法）
> 因为这个方法不依赖内核编译，理论上任何Linux设备都能直接使用，推荐用该方法安装。

参考realsense官方人员给出的回复([帖子](https://support.intelrealsense.com/hc/en-us/community/posts/31576776977427-cannot-connect-D455-on-jetson-agx-orin))，因为包含IMU摄像头为HID设备，需要MIPI驱动，安装这个驱动非常麻烦，参考[realsense_mipi_platform_driver](https://github.com/IntelRealSense/realsense_mipi_platform_driver)，基本没有仍和参考文档，根本装不上。

帖子下方给出了另一个[很好的方法](https://support.intelrealsense.com/hc/en-us/community/posts/31576776977427/comments/31683171974419)，基于[libuvc_installation.md](https://github.com/IntelRealSense/librealsense/blob/master/doc/libuvc_installation.md)安装UVC后端的realsense即可，三行即可解决
```bash
wget https://github.com/IntelRealSense/librealsense/raw/master/scripts/libuvc_installation.sh
chmod +x ./libuvc_installation.sh
# 执行安装前推荐使用全cpu编译cmake效率更高
gnome-text-editor libuvc_installation.sh
# 找到倒数第3行, make -j2 改为
make -j$(nproc)
# 推荐一并安装上pyrealsense2 (安装到系统默认的python中, 如果是conda则无需这样安装, 用 pip install pyrealsense2 安装)
# 找到 sudo apt-get install git cmake libssl-dev freeglut3-dev libusb-1.0-0-dev pkg-config libgtk-3-dev unzip -y 修改为
sudo apt-get install git cmake libssl-dev freeglut3-dev libusb-1.0-0-dev pkg-config libgtk-3-dev unzip python3-dev python3-pip -y
# 找到 cmake ../ -DFORCE_LIBUVC=true -DCMAKE_BUILD_TYPE=release 修改为
cmake ../ -DFORCE_LIBUVC=true -DCMAKE_BUILD_TYPE=release -DBUILD_PYTHON_BINDINGS:BOOL=true
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

## 使用YOLOv11识别ROS相机节点
### 在虚拟环境中安装PyTorch
PyTorch安装方法: 参考[PyTorch for Jetson](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048)中回复的消息，给出了torch的编译好的wheel可以直接安装，下面还写了torchvision的安装方法，按照流程安装即可, 对于Jetson4,5只能从这个位置找对应的torch进行下载

可以使用Python官方的`virtualenv`创建环境（这个虚拟环境类似Conda，但更轻量），好处在于安装的Pytorch所需的`numpy`等包不会和root下ROS相关的包冲突，并且由于是从root中Python生成的环境，因此可以使用root下的包（也就是ROS包），后面发现也可以安装和ROS相同版本的python以及一些相关的ROS包就可以连接ROS了
> 注意环境创建后不能再随便移动位置，因为pip安装绑定了创建时的路径

```bash
sudo apt install virtualenv
# 进入到环境安装的路径, 例如 mkdir ~/envs && cd ~/envs
virtualenv torch_env  # 环境名torch_env
source torch_env/bin/activate  # 进入环境, 类似conda activate <env_name>
```

直接通过wheel安装已编译好的torch-2.5.0和torhcvision-0.20.0（安装torch-2.6.0可能和这个版本的torchvision不兼容，可以尝试安装下）
```bash
wget http://jetson.webredirect.org/jp6/cu126/+f/5cf/9ed17e35cb752/torch-2.5.0-cp310-cp310-linux_aarch64.whl#sha256=5cf9ed17e35cb7523812aeda9e7d6353c437048c5a6df1dc6617650333049092
pip install torch-2.5.0-cp310-cp310-linux_aarch64.whl
wget http://jetson.webredirect.org/jp6/cu126/+f/5f9/67f920de3953f/torchvision-0.20.0-cp310-cp310-linux_aarch64.whl#sha256=5f967f920de3953f2a39d95154b1feffd5ccc06b4589e51540dc070021a9adb9
pip install torchvision-0.20.0-cp310-cp310-linux_aarch64.whl
```
> 其他jetpack6版本可以在[devpi - jetson-ai-lab](https://pypi.jetson-ai-lab.io)中找到

安装完成后执行`python -c "import torch; import torchvision; print(torch.__version__, torchvision.__version__); print(torch.cuda.is_available());"`看看有没有抱错，输出
```
2.5.0 0.20.0
True
```
就说明安装成功了，由于我们还需要YOLOv11识别所以还需安装
```bash
pip install ultralytics
```

### 编写相机节点launch文件
我们想控制读取到相机的分辨率，于是想手动写一个ROS2 package的launch文件来一键启动节点及我们的配置文件，还是在`~/ros2_ws/src`下继续创建:
```bash
cd ~/ros2_ws/src
ros2 pkg create my_rs_launch
cd my_rs_launch
mkdir config && cd config
vim rs_camera.yaml  # 贴入下文信息
cd ..
mkdir launch && cd launch
vim rs_launch.py  # 贴入下文信息
```
{% spoiler "rs_camera.yaml中贴入" %}
```yaml
# 可选配置 D435i/D435
# 这个信息可以在启动相机节点后执行
# ros2 param describe /camera/camera rgb_camera.color_profile
# 获取到可选 宽x高xFPS 信息如下
# 1280x720x15
# 1280x720x30
# 1280x720x6
# 1920x1080x15
# 1920x1080x30
# 1920x1080x6
# 320x180x30
# 320x180x6
# 320x180x60
# 320x240x30
# 320x240x6
# 320x240x60
# 424x240x15
# 424x240x30
# 424x240x6
# 424x240x60
# 640x360x15
# 640x360x30
# 640x360x6
# 640x360x60
# 640x480x15
# 640x480x30
# 640x480x6
# 640x480x60
# 848x480x15
# 848x480x30
# 848x480x6
# 848x480x60
# 960x540x15
# 960x540x30
# 960x540x6
# 960x540x60
rgb_camera:
  color_profile: '640x480x30'
```
{% endspoiler %}
{% spoiler "rs_launch.py中贴入" %}
```python
# Copyright 2023 Intel Corporation. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Launch realsense2_camera node."""
import os
import yaml
from launch import LaunchDescription
import launch_ros.actions
from launch.actions import DeclareLaunchArgument, OpaqueFunction
from launch.substitutions import LaunchConfiguration
from ament_index_python.packages import get_package_share_directory
from pathlib import Path


configurable_parameters = [{'name': 'camera_name',                  'default': 'camera', 'description': 'camera unique name'},
                           {'name': 'camera_namespace',             'default': 'camera', 'description': 'namespace for camera'},
                           {'name': 'serial_no',                    'default': "''", 'description': 'choose device by serial number'},
                           {'name': 'usb_port_id',                  'default': "''", 'description': 'choose device by usb port id'},
                           {'name': 'device_type',                  'default': "''", 'description': 'choose device by type'},
                        #    {'name': 'config_file',                  'default': "''", 'description': 'yaml config file'},
                           {'name': 'config_file',                  'default':
                            str(Path(get_package_share_directory('my_rs_launch'))/"config/rs_camera.yaml"), 'description': 'yaml config file'},
                           {'name': 'json_file_path',               'default': "''", 'description': 'allows advanced configuration'},
                           {'name': 'initial_reset',                'default': 'false', 'description': "''"},
                           {'name': 'accelerate_gpu_with_glsl',     'default': "false", 'description': 'enable GPU acceleration with GLSL'},
                           {'name': 'rosbag_filename',              'default': "''", 'description': 'A realsense bagfile to run from as a device'},
                           {'name': 'log_level',                    'default': 'info', 'description': 'debug log level [DEBUG|INFO|WARN|ERROR|FATAL]'},
                           {'name': 'output',                       'default': 'screen', 'description': 'pipe node output [screen|log]'},
                           {'name': 'enable_color',                 'default': 'true', 'description': 'enable color stream'},
                           {'name': 'rgb_camera.color_profile',     'default': '0,0,0', 'description': 'color stream profile'},
                           {'name': 'rgb_camera.color_format',      'default': 'RGB8', 'description': 'color stream format'},
                           {'name': 'rgb_camera.enable_auto_exposure', 'default': 'true', 'description': 'enable/disable auto exposure for color image'},
                           {'name': 'enable_depth',                 'default': 'true', 'description': 'enable depth stream'},
                           {'name': 'enable_infra',                 'default': 'false', 'description': 'enable infra0 stream'},
                           {'name': 'enable_infra1',                'default': 'false', 'description': 'enable infra1 stream'},
                           {'name': 'enable_infra2',                'default': 'false', 'description': 'enable infra2 stream'},
                           {'name': 'depth_module.depth_profile',   'default': '0,0,0', 'description': 'depth stream profile'},
                           {'name': 'depth_module.depth_format',    'default': 'Z16', 'description': 'depth stream format'},
                           {'name': 'depth_module.infra_profile',   'default': '0,0,0', 'description': 'infra streams (0/1/2) profile'},
                           {'name': 'depth_module.infra_format',    'default': 'RGB8', 'description': 'infra0 stream format'},
                           {'name': 'depth_module.infra1_format',   'default': 'Y8', 'description': 'infra1 stream format'},
                           {'name': 'depth_module.infra2_format',   'default': 'Y8', 'description': 'infra2 stream format'},
                           {'name': 'depth_module.exposure',        'default': '8500', 'description': 'Depth module manual exposure value'},
                           {'name': 'depth_module.gain',            'default': '16', 'description': 'Depth module manual gain value'},
                           {'name': 'depth_module.hdr_enabled',     'default': 'false', 'description': 'Depth module hdr enablement flag. Used for hdr_merge filter'},
                           {'name': 'depth_module.enable_auto_exposure', 'default': 'true', 'description': 'enable/disable auto exposure for depth image'},
                           {'name': 'depth_module.exposure.1',      'default': '7500', 'description': 'Depth module first exposure value. Used for hdr_merge filter'},
                           {'name': 'depth_module.gain.1',          'default': '16', 'description': 'Depth module first gain value. Used for hdr_merge filter'},
                           {'name': 'depth_module.exposure.2',      'default': '1', 'description': 'Depth module second exposure value. Used for hdr_merge filter'},
                           {'name': 'depth_module.gain.2',          'default': '16', 'description': 'Depth module second gain value. Used for hdr_merge filter'},
                           {'name': 'enable_sync',                  'default': 'false', 'description': "'enable sync mode'"},
                           {'name': 'enable_rgbd',                  'default': 'false', 'description': "'enable rgbd topic'"},
                           {'name': 'enable_gyro',                  'default': 'false', 'description': "'enable gyro stream'"},
                           {'name': 'enable_accel',                 'default': 'false', 'description': "'enable accel stream'"},
                           {'name': 'gyro_fps',                     'default': '0', 'description': "''"},
                           {'name': 'accel_fps',                    'default': '0', 'description': "''"},
                           {'name': 'unite_imu_method',             'default': "0", 'description': '[0-None, 1-copy, 2-linear_interpolation]'},
                           {'name': 'clip_distance',                'default': '-2.', 'description': "''"},
                           {'name': 'angular_velocity_cov',         'default': '0.01', 'description': "''"},
                           {'name': 'linear_accel_cov',             'default': '0.01', 'description': "''"},
                           {'name': 'diagnostics_period',           'default': '0.0', 'description': 'Rate of publishing diagnostics. 0=Disabled'},
                           {'name': 'publish_tf',                   'default': 'true', 'description': '[bool] enable/disable publishing static & dynamic TF'},
                           {'name': 'tf_publish_rate',              'default': '0.0', 'description': '[double] rate in Hz for publishing dynamic TF'},
                           {'name': 'pointcloud.enable',            'default': 'false', 'description': ''},
                           {'name': 'pointcloud.stream_filter',     'default': '2', 'description': 'texture stream for pointcloud'},
                           {'name': 'pointcloud.stream_index_filter','default': '0', 'description': 'texture stream index for pointcloud'},
                           {'name': 'pointcloud.ordered_pc',        'default': 'false', 'description': ''},
                           {'name': 'pointcloud.allow_no_texture_points', 'default': 'false', 'description': "''"},
                           {'name': 'align_depth.enable',           'default': 'false', 'description': 'enable align depth filter'},
                           {'name': 'colorizer.enable',             'default': 'false', 'description': 'enable colorizer filter'},
                           {'name': 'decimation_filter.enable',     'default': 'false', 'description': 'enable_decimation_filter'},
                           {'name': 'spatial_filter.enable',        'default': 'false', 'description': 'enable_spatial_filter'},
                           {'name': 'temporal_filter.enable',       'default': 'false', 'description': 'enable_temporal_filter'},
                           {'name': 'disparity_filter.enable',      'default': 'false', 'description': 'enable_disparity_filter'},
                           {'name': 'hole_filling_filter.enable',   'default': 'false', 'description': 'enable_hole_filling_filter'},
                           {'name': 'hdr_merge.enable',             'default': 'false', 'description': 'hdr_merge filter enablement flag'},
                           {'name': 'wait_for_device_timeout',      'default': '-1.', 'description': 'Timeout for waiting for device to connect (Seconds)'},
                           {'name': 'reconnect_timeout',            'default': '6.', 'description': 'Timeout(seconds) between consequtive reconnection attempts'},
                          ]

def declare_configurable_parameters(parameters):
    return [DeclareLaunchArgument(param['name'], default_value=param['default'], description=param['description']) for param in parameters]

def set_configurable_parameters(parameters):
    return dict([(param['name'], LaunchConfiguration(param['name'])) for param in parameters])

def yaml_to_dict(path_to_yaml):
    with open(path_to_yaml, "r") as f:
        return yaml.load(f, Loader=yaml.SafeLoader)

def launch_setup(context, params, param_name_suffix=''):
    _config_file = LaunchConfiguration('config_file' + param_name_suffix).perform(context)
    params_from_file = {} if _config_file == "''" else yaml_to_dict(_config_file)

    _output = LaunchConfiguration('output' + param_name_suffix)
    if(os.getenv('ROS_DISTRO') == 'foxy'):
        # Foxy doesn't support output as substitution object (LaunchConfiguration object)
        # but supports it as string, so we fetch the string from this substitution object
        # see related PR that was merged for humble, iron, rolling: https://github.com/ros2/launch/pull/577
        _output = context.perform_substitution(_output)

    return [
        launch_ros.actions.Node(
            package='realsense2_camera',
            namespace=LaunchConfiguration('camera_namespace' + param_name_suffix),
            name=LaunchConfiguration('camera_name' + param_name_suffix),
            executable='realsense2_camera_node',
            parameters=[params, params_from_file],
            output=_output,
            arguments=['--ros-args', '--log-level', LaunchConfiguration('log_level' + param_name_suffix)],
            emulate_tty=True,
            )
    ]

def generate_launch_description():
    return LaunchDescription(declare_configurable_parameters(configurable_parameters) + [
        OpaqueFunction(function=launch_setup, kwargs = {'params' : set_configurable_parameters(configurable_parameters)})
    ])
```
{% endspoiler %}
这个文件就是在之前编译`realsense2_camera`包中提供的启动文件上修改了config_file的默认值（就是创建的`config/rs_camera.yaml`），源文件位置: `~/ros2_ws/install/realsense2_camera/share/realsense2_camera/launch`，在`rs_camera.yaml`中选择你想要的分辨率大小即可，后续Python读入的就是这个分辨率

完成文件创建后，回到`cd ~/ros2_ws`，使用相对路径编译（如果报错`rm -rf build log install`删除之前缓存即可）
```bash
cd ~/ros2_ws
colcon build --symlink-install
source ~/ros2_ws/install/setup.sh
ros2 launch my_rs_launch rs_launch.py  # 启动节点
# 注意日志中的信息, Open profile: stream_type: Color(0), Format: RGB8, Width: 640, Height: 480, FPS: 30
# 应该就和rs_camera.yaml中配置的相同
```

### YOLOv11识别
启动我们自定义的`rs_launch.py`文件后，随便找个地方创建如下代码并运行（需进入`torch_env`环境哦）
{% spoiler "python测试读取分辨率与FPS代码" %}
```python
# deepseek-v3生成
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import time

class CameraSubscriber(Node):
  def __init__(self):
    super().__init__('camera_subscriber')
    # 订阅相机节点的图像话题（例如：/camera/image_raw）
    self.subscription = self.create_subscription(
      Image,
      '/camera/camera/color/image_raw',
      self.image_callback,
      10)
    self.subscription  # 防止未使用警告
    self.bridge = CvBridge()
    self.last_receive_time = time.time()
    self.avg_fps, self.count = 0, 0

  def image_callback(self, msg):
    try:
      # 将 ROS 2 图像消息转换为 OpenCV 格式
      cv_image = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
      # 显示图像
      cv2.imshow("Camera Image", cv_image)
      cv2.waitKey(1)
      fps = 1/(time.time() - self.last_receive_time)
      self.count += 1
      self.avg_fps += (fps - self.avg_fps) / self.count
      print(f"img size={cv_image.shape}, FPS={fps:.5f}, AVG_FPS={self.avg_fps:.5f}")
      self.last_receive_time = time.time()
    except Exception as e:
      self.get_logger().error(f"Failed to convert image: {e}")

def main(args=None):
  rclpy.init(args=args)
  camera_subscriber = CameraSubscriber()
  rclpy.spin(camera_subscriber)
  camera_subscriber.destroy_node()
  rclpy.shutdown()
  cv2.destroyAllWindows()

if __name__ == '__main__':
  main()
```
{% endspoiler %}
![运行效果图，可以看到实时画面与FPS，调整rs_camera.yaml中的分辨率，Python获取的同时会变，但是FPS貌似只在40以下](/figures/robotics/Jetson/AGX_rs_ros_node_python_cv_show.png)

YOLOv11预测代码只需对上述代码小修即可（如果模型下载太慢，建议用浏览器挂VPN下下来，拷贝到当前工作路径下）:
{% spoiler "YOLOv11预测" %}
```python
"""
DEBUG:
D435i: img size=(720, 1280, 3), FPS=31.05995, AVG_FPS=31.05758
D435: img size=(480, 640, 3), FPS=31.42766, AVG_FPS=31.22074

YOLOv11l: (total 32W)
D435i: 0: 480x640 1 tv, 1 book, 44.5ms
Speed: 1.3ms preprocess, 44.5ms inference, 2.5ms postprocess per image at shape (1, 3, 480, 640)
img size=(480, 640, 3), FPS=17.59961, AVG_FPS=18.12866

D435: 0: 480x640 1 person, 1 tv, 1 mouse, 2 keyboards, 57.7ms
Speed: 1.3ms preprocess, 57.7ms inference, 11.1ms postprocess per image at shape (1, 3, 480, 640)
img size=(480, 640, 3), FPS=11.24747, AVG_FPS=17.64535
YOLOv11l: 32W, 18FPS
YOLOv11m: 30W, 18FPS
YOLOv11n: 25W, 24FPS
"""
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
import cv2
import time
import torch
from ultralytics import YOLO
from ultralytics.engine.results import Results

class CameraSubscriber(Node):
  def __init__(self):
    super().__init__('camera_subscriber')
    # 订阅相机节点的图像话题（例如：/camera/image_raw）
    self.subscription = self.create_subscription(
      Image,
      '/camera/camera/color/image_raw',
      self.image_callback,
      10)
    self.subscription  # 防止未使用警告
    self.bridge = CvBridge()
    self.last_receive_time = time.time()
    self.avg_fps, self.count = 0, 0
    self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Use device: {self.device}")
    self.model = YOLO("yolo11m.pt").to(self.device)

  def image_callback(self, msg):
    try:
      # 将 ROS 2 图像消息转换为 OpenCV 格式
      cv_image = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
      # 显示图像
      result: Results = self.model.predict(cv_image)[0]
      cv2.imshow("Detect Camera Image", result.plot())
      cv2.waitKey(1)
      fps = 1/(time.time() - self.last_receive_time)
      self.count += 1
      self.avg_fps += (fps - self.avg_fps) / self.count
      print(f"img size={cv_image.shape}, FPS={fps:.5f}, AVG_FPS={self.avg_fps:.5f}")
      self.last_receive_time = time.time()
    except Exception as e:
      self.get_logger().error(f"Failed to convert image: {e}")

def main(args=None):
  rclpy.init(args=args)
  camera_subscriber = CameraSubscriber()
  rclpy.spin(camera_subscriber)
  camera_subscriber.destroy_node()
  rclpy.shutdown()
  cv2.destroyAllWindows()

if __name__ == '__main__':
  main()
```
{% endspoiler %}

{%
    dplayer
    "url=/videos/AGX_rs_ros_node_python_yolov11.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}

|模型|总功率|速度|
|-|-|-|
|YOLOv11l|32W|18FPS|
|YOLOv11m|30W|18FPS|
|YOLOv11n|25W|24FPS|
