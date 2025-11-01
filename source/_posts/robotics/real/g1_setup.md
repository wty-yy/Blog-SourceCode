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

## 网络配置
参考[Unitree - G1_developer](https://support.unitree.com/home/zh/G1_developer)电气接口, 可知9号type-c接口为Jetson Orin NX的带显示接口, 使用拓展坞连接鼠标、键盘、显示屏开机即可打开NX界面, 界面中连接上Wifi, 常用用局域网内的其他电脑ping该设备, 如果无法ping通一般是网卡的优先级默认为有线, 且路由器的网段和上下机的网段相同(都是`192.168.123.*`), 导致外部无法连接到NX, 这里不推荐将路由器Wifi的网段也改成`123.*`的, 这样会导致上下网卡的网段冲突, 当存在多个宇树设备时, 上位机无法连接到下位机发生问题.

{% spoiler 点击显/隐 修改route metric优先级 %}
在Jetson Nano NX中修改route metric优先级:
```bash
ip a  # 找到无线网卡为 wlan0
ip route  # 看到 wlan0 metric 后面数字就表示优先级, 需要将该数字设置比 eth0 更低即可
sudo nmcli device  # 看到我们的无限网卡为wlan0连接到的wifi名称
sudo nmcli connection modify "wifi名称" ipv4.route-metric 10  # 把wifi的优先级设置为较低的值
sudo nmcli connection up "wifi名称"  # 重启wifi
ip route  # 看到 wlan0 metric后面数字为 10 即可
```
再常使用局域网内其他电脑ping, 应该就能ping通了, 用这个方法只需要每次切换wifi名称时用命令行配置一次即可
{% endspoiler %}

NX连接上Wifi后, 用`ifconfig`查看`wlan0`的IP, 然后主机通过`ssh unitree@<IP>`输入密码`123`即可连接上NX, 连上NX后我们做如下几个配置:
1. 创建可视化界面
2. 用YOLO视觉识别测试D435i相机和显卡速度
3. Mid-360雷达是否可用

## 创建可视化界面
> 参考[实现Linux无头模式下硬件加速的屏幕共享 - Nvidia Jetson可视化配置](/posts/47970/#nvidia-jetson可视化配置)
我们期望拔掉电源后也可以通过网页来查看NX的界面, 安装依赖
```bash
sudo apt install x11vnc  # x11的vnc转发软件
mkdir ~/Programs
cd ~/Programs
git clone https://github.com/novnc/noVNC.git  # 网页可视化VNC客户端
```
添加配置文件`/etc/X11/xorg-nvidia-dummy-monitor.conf`

{% spoiler 点击显/隐 xorg-nvidia-dummy-monitor.conf 配置文件 %}
```bash
Section "Module"
    Disable     "dri"
    SubSection  "extmod"
        Option  "omit xfree86-dga"
    EndSubSection
EndSection

Section "Device"
    Identifier  "Tegra0"
    Driver      "nvidia"
    Option      "AllowEmptyInitialConfiguration" "true"
    Option      "ConnectedMonitor" "DFP-0"
    Option      "CustomEDID" "DFP-0:/etc/X11/edid.bin"
EndSection

Section "Monitor"
    Identifier     "Monitor0"
    VendorName     "Generic"
    ModelName      "Virtual Monitor"
    HorizSync       28.0 - 72.0
    VertRefresh     50.0 - 75.0
    Option         "DPMS"
EndSection

Section "Screen"
    Identifier     "Screen0"
    Device         "Tegra0"
    Monitor        "Monitor0"
    DefaultDepth    24
    SubSection "Display"
        Depth       24
        Modes      "1920x1080"
        Virtual     1920 1080
    EndSubSection
EndSection

Section "ServerLayout"
    Identifier     "Layout0"
    Screen         "Screen0"
EndSection
```
{% endspoiler %}

下载[edid.bin](/file/linux_screen_sharing/edid.bin)放到`/etc/X11/edid.bin`

创建[一键启动脚本](/posts/47970/#一键启动脚本)在`/usr/local/bin/start-gnome-vnc.sh`下
{% spoiler 点击显/隐 start-gnome-vnc.sh脚本 %}
```bash
#!/bin/bash

# 使用方法, 第一个参数为当前的用户名, 用于启动gnome会话
# sudo bash /usr/local/bin/start-gnome-vnc.sh $USER

# 检查端口6080是否被占用
if lsof -i:6080 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "端口6080已被占用，脚本将不再继续启动，请用 http://<IP>:6080/vnc.html 连接，export DISPLAY=:1 来可视化命令行启动的界面"
    exit 1
fi

# 设置进程组，方便退出时统一管理
set -m

# 启动 X Server
sudo /usr/bin/X :1 -config /etc/X11/xorg-nvidia-dummy-monitor.conf &
x_pid=$!

# 等待 X Server 启动
sleep 3

# 启动 DBus 会话服务
eval $(dbus-launch --sh-syntax)
export DBUS_SESSION_BUS_ADDRESS
export DBUS_SESSION_BUS_PID

# 启动桌面环境（Gnome / Xfce）这里必须要用$1用户身份启动, 避免出现无法登陆的问题
# sudo -u $1 DISPLAY=:1 startxfce4 &  # 或者启动xfce4
sudo -u $1 DISPLAY=:1 gnome-session &
gnome_pid=$!

# 启动 x11vnc
x11vnc -display :1 -rfbauth /root/.vnc/passwd -forever -shared -loop -nodpms &
# 或者无密码启动 (简单)
# x11vnc -display :1 -forever -shared -loop -nodpms &
vnc_pid=$!

# 启动 noVNC proxy
/data/user/wutianyang/programs/noVNC/utils/novnc_proxy --vnc localhost:5900 &
novnc_pid=$!

sleep 5
echo "脚本全部启动完毕，请用 http://<IP>:6080/vnc.html 连接，export DISPLAY=:1 来可视化命令行启动的界面"

# 定义清理函数
cleanup() {
    echo "正在退出，清理子进程..."

    # 杀掉 novnc_proxy
    if ps -p $novnc_pid > /dev/null 2>&1; then
        echo "杀掉 noVNC proxy (PID=$novnc_pid)"
        kill -TERM $novnc_pid
    fi

    # 杀掉 x11vnc
    if ps -p $vnc_pid > /dev/null 2>&1; then
        echo "杀掉 x11vnc (PID=$vnc_pid)"
        kill -TERM $vnc_pid
    fi

    # 杀掉 XFCE
    if ps -p $gnome_pid > /dev/null 2>&1; then
        echo "杀掉 XFCE (PID=$gnome_pid)"
        kill -TERM $gnome_pid
    fi

    # 杀掉 X Server
    if ps -p $x_pid > /dev/null 2>&1; then
        echo "杀掉 X Server (PID=$x_pid)"
        sudo kill -TERM $x_pid
    fi

    # 杀掉 dbus-daemon（如果有）
    if [ -n "$DBUS_SESSION_BUS_PID" ]; then
        echo "杀掉 dbus-daemon (PID=$DBUS_SESSION_BUS_PID)"
        kill -TERM "$DBUS_SESSION_BUS_PID"
    fi

    echo "清理完成，退出脚本。"
    exit 0
}

# 注册退出清理钩子
trap cleanup SIGINT SIGTERM EXIT

# 当X服务退出（或手动 Ctrl+C）全部kill
wait $x_pid
```
{% endspoiler %}
**修改其中的39行，为你的noVNC路径位置；如果没有设置x11vnc密码，则分别注释33行和解注35行**

在`~/.bashrc`中加入快捷启动命令
```bash
alias start-gnome-vnc="sudo bash /usr/local/bin/start-gnome-vnc.sh $USER"
```
这样在终端下就可以`start-gnome-vnc`一键启动了, 打开`<IP>:6080/vnc.html`网页即可连接上可视化界面

## 感知测试
### 相机
将g1头部后面的Typc-c线插在9号口上 (参考[Unitree - G1_developer电气接口](https://support.unitree.com/home/zh/G1_developer)), 在终端中运行`realsense-viewer`即可看到可视化界面, 不过9号口为USB2.0, 6号口为USB3.2, 但是6号口在下面Python启动时会出现报错, 还不清楚原因

### YOLO视觉识别
> 参考[Jetson AGX Orin - 使用yolov11识别ros相机节点](/posts/25605/#使用yolov11识别ros相机节点)

推荐安装[miniforge](https://github.com/conda-forge/miniforge/releases)(下载Linux-aarch64版本安装): 创建conda环境
```bash
mamba create -n torch python=3.8
mamba activate torch
```

安装PyTorch: 从[PyTorch for Jetson](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048)中下载[JetPack5 Pytorch v2.1.0](https://developer.download.nvidia.cn/compute/redist/jp/v512/pytorch/torch-2.1.0a0+41361538.nv23.06-cp38-cp38-linux_aarch64.whl)
```bash
pip install torch-2.1.0a0+41361538.nv23.06-cp38-cp38-linux_aarch64.whl
```

编译安装torchvision
```bash
sudo apt-get install libjpeg-dev zlib1g-dev libpython3-dev libopenblas-dev libavcodec-dev libavformat-dev libswscale-dev
git clone --branch v0.16.1 --depth 1 https://github.com/pytorch/vision torchvision
cd torchvision
export BUILD_VERSION=0.16.1  # where 0.16.1 is the torchvision version  
python setup.py install
cd ../  # attempting to load torchvision from build dir will result in import error
pip install numpy pillow opencv-python
```

测试安装是否成功:
```bash
python -c "import torch; import torchvision; print(torch.__version__, torchvision.__version__); print(torch.cuda.is_available());"
```

安装YOLO包`pip install ultralytics`, 运行下面代码即可看到实时识别速度
{% spoiler 点击显/隐 yolo_demo.py %}
```python
import cv2
import pyrealsense2 as rs
import numpy as np
import time
from ultralytics import YOLO

def main():
    # --- 1. 初始化 YOLO 模型 ---
    # 加载 YOLOv11 Medium 模型
    # 当您第一次运行它时，它会自动下载 'yolov11m.pt'
    print("正在加载 YOLOv11m 模型...")
    try:
        model = YOLO('yolo11m.pt').to('cuda')
    except Exception as e:
        print(f"加载模型失败: {e}")
        print("请确保您已连接互联网以下载模型，或 'yolo11m.pt' 文件已存在。")
        return

    # --- 2. 初始化 Intel RealSense ---
    pipeline = rs.pipeline()
    config = rs.config()

    # 配置流：
    # 警告：同时运行 1080p RGB 和 720p Depth 对 USB 带宽要求很高
    # 请确保您使用的是 USB 3.0+ 端口和高质量的数据线
    try:
        # RGB 流
        # config.enable_stream(rs.stream.color, 1920, 1080, rs.format.bgr8, 15)
        config.enable_stream(rs.stream.color, 1280, 720, rs.format.bgr8, 15)
        # 深度流
        config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 15)
    except RuntimeError as e:
        print(f"配置 RealSense 流失败: {e}")
        print("请检查相机是否连接，或尝试降低分辨率（例如RGB 1280x720）。")
        return

    # --- 3. 启动相机并创建对齐对象 ---
    print("正在启动 RealSense 管道...")
    profile = pipeline.start(config)

    # 创建一个 'align' 对象
    # rs.align 允许我们将深度帧对齐到 'color' 帧的视角
    align_to = rs.stream.color
    align = rs.align(align_to)

    # --- 4. 初始化速度计算变量 ---
    fps_list = [] # 用于存储最近的N次FPS
    rolling_window_size = 30 # 使用最近30帧的数据来计算平均FPS

    print("相机已启动。按 'q' 键退出。")

    try:
        while True:
            # 等待一组成帧：color 和 depth
            frames = pipeline.wait_for_frames()

            # 对齐深度帧到彩色帧
            aligned_frames = align.process(frames)
            
            color_frame = aligned_frames.get_color_frame()
            depth_frame = aligned_frames.get_depth_frame()

            if not color_frame or not depth_frame:
                continue

            # --- 5. 转换图像数据为 NumPy 数组 ---
            # RGB 图像 (1920, 1080, 3)
            color_image = np.asanyarray(color_frame.get_data())
            
            # 深度图像 (16-bit, 1920, 1080)
            # 注意：对齐后，深度图的分辨率会匹配彩色图的分辨率
            depth_image = np.asanyarray(depth_frame.get_data())

            # --- 6. YOLO 推理并计时 ---
            start_time = time.perf_counter()
            
            # 运行 YOLOv11 推理
            # verbose=False 会禁止在控制台打印每次识别的详细信息
            results = model(color_image, stream=False, verbose=False) 
            
            end_time = time.perf_counter()
            
            # 计算单帧 FPS
            fps = 1 / (end_time - start_time)
            
            # 更新 FPS 列表（滚动窗口）
            fps_list.append(fps)
            if len(fps_list) > rolling_window_size:
                fps_list.pop(0)
            
            # 计算平均 FPS
            avg_fps = np.mean(fps_list)
            
            # 打印平均速度
            # 使用 \r 和 end="" 确保只在同一行上更新，避免刷屏
            print(f"\r[YOLO 平均识别速度: {avg_fps:.2f} FPS]", end="")

            # --- 7. 可视化 YOLO 结果 ---
            # 'results[0].plot()' 会返回一个绘制了检测框的 BGR 图像 (NumPy 数组)
            annotated_frame = results[0].plot()

            # 在图像上绘制平均 FPS
            cv2.putText(annotated_frame, f"Avg FPS: {avg_fps:.2f}", 
                        (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)

            # --- 8. 可视化深度图 ---
            # 将 16-bit 深度图 (单位: 毫米) 转换为 8-bit (0-255) 以便显示
            # 0.03 是一个常用的缩放因子，假设我们关心 8 米（8000mm）左右的距离
            # 8000 * 0.03 = 240
            depth_image_8bit = cv2.convertScaleAbs(depth_image, alpha=0.03)
            
            # 将 8-bit 灰度图转换为彩色图 (Jet colormap) 以便观察
            depth_colormap = cv2.applyColorMap(depth_image_8bit, cv2.COLORMAP_JET)
            
            # 由于对齐，深度图中没有数据的地方（黑色）也会被着色
            # 我们可以加一个掩码让无数据的地方保持黑色
            black_mask = (depth_image == 0)
            depth_colormap[black_mask] = 0

            # --- 9. 显示图像 ---
            # 注意：1920x1080 图像在标准显示器上可能太大
            # 我们可以缩小它以便显示
            display_rgb = cv2.resize(annotated_frame, (960, 540))
            display_depth = cv2.resize(depth_colormap, (960, 540))

            cv2.imshow("YOLOv11 (RGB)", display_rgb)
            cv2.imshow("Depth", display_depth)

            # --- 10. 退出循环 ---
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        # 停止数据流
        print("\n正在关闭 RealSense 管道...")
        pipeline.stop()
        cv2.destroyAllWindows()
        print(f"程序结束。YOLOv11 的最终平均识别速度为: {np.mean(fps_list):.2f} FPS")

if __name__ == "__main__":
    main()

```
{% endspoiler %}
![g1 yolo11m demo](/figures/robotics/real/g1/g1_yolo11_demo.png)

### 测试Mid-360
进入终端时, 会默认弹出来对ROS版本的选择, 我们输入1回车, 就进入foxy版本, 运行`rviz2`命令打开可视化界面, 点击左下角`add`按钮, 找到弹出窗口中的`By topic`, 选择`/utlidar/cloud_livox_mid360`点击`OK`, 然后将左上角的`Fixed Frame`右侧框中输入`livox_frame`即可看到雷达信息
![g1 mid360 demo](/figures/robotics/real/g1/g1_mid-360_demo.png)

## 运控开发
...
