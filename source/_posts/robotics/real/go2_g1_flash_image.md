---
title: 宇树Go2/G1拓展坞刷Jetpack 6.2
hide: false
math: true
abbrlink: 30579
date: 2026-01-10 22:48:11
index\_img:
banner\_img:
category:
 - Robotics
 - Real
tags:
---

2025.1.9第一天拿到全新go2-edu-U2也就是带有Jetson ORIN NX 100TOP的拓展坞版本，由于一次不小心手滑，执行了`sudo apt purge systemd-timesyncd -y`将系统中全部的可视化界面删除了，连网络管理器也没了，只能重装系统。

刷机无需拆开整个拓展坞，进入安全模式后刷机即可，[正确刷机方法跳转](./#重刷系统正确方法)

# Go2刷机记录
## 失败方法（请勿尝试）
首先参考宇树官网给出的[重刷整个硬盘镜像](https://support.unitree.com/home/zh/developer/module_update#heading-9)的方法，下载了`go2_nx_Jetpack5.1.1_20250930.img.bz2`版本，然后将拓展坞拆开，取下nvme，装在读卡器上，直接将img刷到硬盘上

| ![img1](/figures/robotics/real/go2/go2_nx_100top.jpg) | ![img2](/figures/robotics/real/go2/go2_nx_nvme.jpg) |
|-|-|
|<div align='center'>拆开后的NX</div>|<div align='center'>取下来的NVME硬盘</div>|

尝试了多次，win, linux各种工具和命令都装过，还发现一个最快的安装方法：先用bz2解压得到.img文件，再用balenaEtcher安装，它还会自动校验，刷机速度可以达到700M/s。但结果是启动仍然黑屏，甚至连kernel加载界面都没看到，过完Nvidia UEFI界面就直接黑屏

综上，我可以确认不是镜像刷的过程中损坏了，而是NX上刷过`Jetpack 6.*`导致里面的UEFI firmware（存储在QSPI flash中）升级了，再刷官方给的`Jetpack 5.*`也就不兼容了，因此怎么都启动不了kernel。

## 重刷系统（正确方法）
最终看到有个英文教程[theroboverse - Unitree Go2 EDU: Jetpack 6.2.1 Update](https://theroboverse.com/unitree-go2-edu-jetpack-6-2-1-update/)是通过Nvidia官方的Autoflash，也就是sdkmanager会调用的安装方法，不过直接通过命令行直接刷固定版本。原blog讲得很清楚了，这里我搬运并强调些细节

**刷机需求**：SIM卡针，Linux系统电脑（必须是ext4硬盘格式），电脑硬盘大小至少有100G（压缩包9.5G，解压后75G）

**刷机镜像压缩包下载**：
- yandex网盘（无需冲会员，可能要挂梯子）：[`https://disk.yandex.com/d/90OADxPeLx_ztg?ref=theroboverse.com`](https://disk.yandex.com/d/90OADxPeLx_ztg?ref=theroboverse.com)，下载`Unitree_Go2_EDU_Orin_NX_JetPack_6.2.1.tar.bz2`，这里也有NANO版本的6.2.1
> 宇树的百度网盘[`https://pan.baidu.com/s/1GMs-DE8SSHYTSNIVKsoktw?pwd=7riu`](https://pan.baidu.com/s/1GMs-DE8SSHYTSNIVKsoktw?pwd=7riu)中固件包`Jetpack_6.2_nx.tar.bz2`是没有磁盘镜像，只能用于更新固件，无法直接刷上用户信息（下文[G1刷机记录](#g1刷机记录)中会使用该镜像文件）

下载完成镜像后，解压`sudo tar -xpjvf [filename].tar.bz2`，**注意一定要加sudo**，因为有镜像文件`rootfs`下的用户必须为root，否则加载进系统时必定会黑屏！

进入恢复模式，先关掉机械狗，连上电脑，如下方法启动，lsusb看到`NVIDIA Corp. APX`就说明OK了
| ![img1](/figures/robotics/real/go2/go2_type-c_computer.jpg) | ![img2](/figures/robotics/real/go2/go2_insert_PIN.jpg) |
|-|-|
|<div align='center'>将type-C连接到电脑</div>|<div align='center'>先关掉Go2，用SIM卡针按住侧面的PIN，再启动Go2给NX上电，电脑上执行lsusb，看到有`Bus 00* Device 00*: ... NVIDIA Corp. APX`就说明进入刷机模式了，松开PIN</div>|

> 如果想单独拔掉NX的供电，可以取下上面的提手，拔掉BAT端口的XT30电源，按住PIN，再插上BAT端口的XT30，这样就不用重启整个狗了

开始刷机，直接进入到Linux_for_Tegra下，复制命令直接运行：

```bash
# For Orin NX
cd JetPack_6.2.1_Linux_JETSON_ORIN_NX_TARGETS/Linux_for_Tegra/
sudo ./tools/kernel_flash/l4t_initrd_flash.sh --external-device nvme0n1p1 -p "-c ./bootloader/generic/cfg/flash_t234_qspi.xml" -c ./tools/kernel_flash/flash_l4t_t234_nvme.xml --showlogs --network usb0 jetson-orin-nano-devkit internal

# For Orin Nano
cd JetPack_6.2.1_Linux_JETSON_ORIN_NANO_TARGETS/Linux_for_Tegra/
sudo ./tools/kernel_flash/l4t_initrd_flash.sh --external-device nvme0n1p1 -p "-c ./bootloader/generic/cfg/flash_t234_qspi.xml" -c ./tools/kernel_flash/flash_l4t_t234_nvme.xml --showlogs --network usb0 jetson-orin-nano-devkit-super internal
```

> P.S. 我将blog中的最后一个命令从`external`换成了`internal`，效果貌似一样，可能是有`*_nvme.xml`保证了，但这样应该更保险，将QSPI和NVME绑定在一起启动
> 这里的Orin NX对应的套件底板和Nano一样，因此板卡配置文件名就是jetson-orin-nano-devkit，没有问题

等几分钟，显示Flash is successful说明刷机完了，就可以连上网线，将电脑的静态网段改成`192.168.123.*`，尝试`ping 192.168.123.18`能通说明装成功了，通过ssh连接`ssh unitree@192.168.123.18`密码123，或者直接连显示屏应该就能显示了。

![官方连接说明图](/figures/robotics/real/go2/go2_connect.jpg)

可能出现的问题：如果启动后还是黑屏，一定检查`ls -alh Linux_for_Tegra/rootfs`下的全线是否都是root的，非常重要因为会直接将这个系统镜像拷贝到Jetson上，包括用户权限，所以必须是正确的，如果不是，请重新用`sudo tar -xpjvf *.tar.bz2`解压
```bash
❯ ls -alh Linux_for_Tegra/rootfs
total 96K
drwxr-xr-x  18 root root 4.0K  7月 17 11:12 .
drwxrwxr-x  12 yy   yy   4.0K  7月 31 09:45 ..
lrwxrwxrwx   1 root root    7  2月 18  2023 bin -> usr/bin
drwxr-xr-x   3 root root  12K  7月 16 16:33 boot
drwxr-xr-x   2 root root 4.0K  7月 16 16:31 dev
drwxr-xr-x 144 root root  12K  7月 31 10:26 etc
drwxr-xr-x   2 root root 4.0K  4月 18  2022 home
lrwxrwxrwx   1 root root    7  2月 18  2023 lib -> usr/lib
drwxr-xr-x   2 root root 4.0K  2月 18  2023 media
drwxr-xr-x   2 root root 4.0K  2月 18  2023 mnt
-rw-r--r--   1 root root  364  7月 17 11:12 nv_preseed.cfg
drwxr-xr-x   4 root root 4.0K  7月 16 16:29 opt
drwxr-xr-x   2 root root 4.0K  4月 18  2022 proc
-rw-rw-r--   1 yy   yy     62  1月  8  2025 README.txt
drwx------   3 root root 4.0K  3月 22  2023 root
drwxr-xr-x  19 root root 4.0K 10月 17  2024 run
lrwxrwxrwx   1 root root    8  2月 18  2023 sbin -> usr/sbin
drwxr-xr-x   2 root root 4.0K 12月  1  2022 snap
drwxr-xr-x   2 root root 4.0K  2月 18  2023 srv
drwxr-xr-x   2 root root 4.0K  4月 18  2022 sys
drwxrwxrwt   4 root root 4.0K  7月 23 15:20 tmp
drwxr-xr-x  11 root root 4.0K  2月 18  2023 usr
drwxr-xr-x  15 root root 4.0K  7月 16 16:29 var
```

## 后续安装
### 最大功率模式
可视化界面：进系统右上角选择Power Mode，MAXN最大功率模式，重启。

命令行：`sudo nvpmodel -m 0`，重启

检查功率模式：
```bash
$ sudo jetson_clocks --show
NV Power Mode: MAXN
```

### 安装无线网卡
安装无限网卡驱动，通过ssh连接192.168.123.18，用户名unitree，密码123，将你买的wifi无线网卡驱动发送上去，安装好驱动后，连接wifi上网，上网后先更新软件源`sudo apt update`
> 我们用的无线网卡为Tenda AX300(M)或U2，都可以在官网下载Ubuntu驱动直接安装使用

### 配置exfat读取U盘
安装好后，我们发现无法打开exfat格式的U盘，可以通过`sudo apt install exfat-fuse exfatprogs`，安装驱动包，再创建软连接：
```bash
cd /sbin/
ls | grep mount  # 可以看到有mount.exfat-fuse但是没有mount.exfat
sudo ln -s mount.exfat-fuse mount.exfat
```
这样就可以正常打开U盘文件了

### 安装firefox
> g1默认装了chrome，go2可安装Firefox
参考[清华源-Mozilla软件仓库](https://mirrors.tuna.tsinghua.edu.cn/help/mozilla/)

```bash
sudo install -d -m 0755 /etc/apt/keyrings
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null
gpg -n -q --import --import-options import-show /etc/apt/keyrings/packages.mozilla.org.asc | awk '/pub/{getline; gsub(/^ +| +$/,""); if($0 == "35BAA0B33E9EB396F59CA838C0BA5CE6DC6315A3") print "\nThe key fingerprint matches ("$0").\n"; else print "\nVerification failed: the fingerprint ("$0") does not match the expected one.\n"}'
```

编辑`sudo vim /etc/apt/sources.list`加入
```bash
deb [arch=arm64 signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://mirrors.tuna.tsinghua.edu.cn/mozilla/apt mozilla main
```

配置APT优先级：
```bash
echo '
Package: *
Pin: release a=mozilla
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla-firefox
```

完成安装`sudo apt update && sudo apt install firefox`

### 安装Clash
<!-- 这里推荐使用[FlClash - linux arm64](https://sourceforge.net/projects/flclash.mirror/files/v0.8.92/FlClash-0.8.92-linux-arm64.deb/download)无需手动配置设置中的代理，在[sourceforge](https://sourceforge.net/projects/flclash.mirror/files/)中可以找到Linux arm64的下载链接，使用方法可以参考[MyUbuntu -  Clash安装](/posts/46722/#clash安装-快捷方式-自动启动) -->

{% spoiler "Clash for Windows GUI安装" %}
下载[Arm64版Clash for Windows](https://github.com/clash-download/Clash-for-Windows/releases/download/v0.20.39/Clash.for.Windows-0.20.39-arm64-linux.tar.gz)，解压，放到固定位置后，找到cfw可执行文件路径，创建快捷方式
```bash
cd ~/.local/share/applications/clash.desktop
```

```bash
[Desktop Entry]
Type = Application
Name = Clash
Exec = /home/unitree/Programs/Clash/cfw --no-sandbox
# 可选加一个图标
# Icon = /home/wty/Pictures/icons/clash.png
```

这样按win键，弹出的搜索框搜索clash就可以打开了，将配置文件传上去，选择能用的节点

- 浏览器上网：配置setting-network-network proxy-manual-HTTP Proxy, HTTPS Proxy均为127.0.0.1, Port 7890
- 终端上网：`export http_proxy=127.0.0.1:7890`, `export https_proxy=127.0.0.1:7890`

clash自动启动：
```bash
mkdir ~/.config/autostart
cp ~/.local/share/applications/clash.desktop ~/.config/autostart
```
在Startup Application应用中就可以看到有clash了
{% endspoiler %}

{% spoiler "Clash内核命令行安装" %}
参考[在服务器上配置Clash代理](/posts/60686/)，安装arm64版的clash内核
```bash
mkdir Clash  # 创建文件夹
cd Clash
wget https://github.com/MetaCubeX/mihomo/releases/download/v1.19.20/mihomo-linux-arm64-v1.19.20.gz
gunzip mihomo-linux-arm64-v1.19.20.gz
chmod +x mihomo-linux-arm64-v1.19.20
mv mihomo-linux-arm64-v1.19.20 clash
```
将本机上的`config.yaml`传到同一个文件夹内，执行`./clash -d .`启动，默认端口是config.yaml中配置`port: 7890`

- 浏览器上网：配置setting-network-network proxy-manual-HTTP Proxy, HTTPS Proxy均为127.0.0.1, Port 7890
- 终端上网：`export http_proxy=127.0.0.1:7890`, `export https_proxy=127.0.0.1:7890`

配置到systemctl自动启动
```bash
sudo vim /etc/systemd/system/clash.service
```
复制以下内容，按需修改`/home/unitree/Programs/clash_core/clash`的路径为你的clash内核所在路径
```bash
[Unit]
Description=Mihomo/Clash Daemon
After=network.target

[Service]
Type=simple
User=unitree
WorkingDirectory=/home/unitree/Programs/clash_core
ExecStart=/home/unitree/Programs/clash_core/clash -d .
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```
{% endspoiler %}

### 安装CUDA和PyTorch
由于镜像中没有自带CUDA所以只能通过apt方法安装最新便，2026.1安装的版本就是12.6，cudnn8：
```bash
sudo apt update
sudo apt install nvidia-jetpack
sudo apt install nvidia-cudnn
```

安装完成后需要修改下环境变量找到nvcc和cuda库
```bash
# .bashrc或.zshrc中添加
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

使用`jetson_release`可以查看当前系统的CUDA版本和cudnn版本
```bash
❯ jetson_release
Software part of jetson-stats 4.3.2 - (c) 2024, Raffaello Bonghi
Model: NVIDIA Jetson Orin NX Engineering Reference Developer Kit - Jetpack 6.2 [L4T 36.4.3]
NV Power Mode[0]: MAXN
Serial Number: [XXX Show with: jetson_release -s XXX]
Hardware:
 - P-Number: p3767-0000
 - Module: NVIDIA Jetson Orin NX (16GB ram)
Platform:
 - Distribution: Ubuntu 22.04 Jammy Jellyfish
 - Release: 5.15.148-tegra
jtop:
 - Version: 4.3.2
 - Service: Active
Libraries:
 - CUDA: 12.6.68
 - cuDNN: 9.3.0.75
 - TensorRT: 10.3.0.30
 - VPI: 3.2.4
 - OpenCV: 4.8.0 - with CUDA: NO
```

需要安装对应编译好的版本 https://pypi.jetson-ai-lab.io/jp6/cu126  中下载 [`torch-2.9.1-cp310-cp310-linux_aarch64.whl`](https://pypi.jetson-ai-lab.io/jp6/cu126/+f/02f/de421eabbf626/torch-2.9.1-cp310-cp310-linux_aarch64.whl#sha256=02fde421eabbf62633092de30405ea4d917323c55bea22bfd10dfeb1f1023506) 和 [`torchvision-0.24.1-cp310-cp310-linux_aarch64.whl`](https://pypi.jetson-ai-lab.io/jp6/cu126/+f/d5b/caaf709f11750/torchvision-0.24.1-cp310-cp310-linux_aarch64.whl#sha256=d5bcaaf709f11750b5bb0f6ec30f37605da2f3d5cb3cd2b0fe5fac2850e08642) 安装。

还会出现报错 `ImportError: libcudss.so.0: cannot open shared object file`，参考回答 [nvidia - ImportError: libcudss.so.0 not found](https://forums.developer.nvidia.com/t/pytorch-2-8-0-on-jetson-orin-nano-importerror-libcudss-so-0-not-found/346195/4)，安装 [cudss](https://developer.nvidia.com/cudss-downloads?target_os=Linux&target_arch=aarch64-jetson&Compilation=Native&Distribution=Ubuntu&target_version=22.04&target_type=deb_local) 解决。

执行命令参考 [Nvidia - PyTorch for Jetson](https://forums.developer.nvidia.com/t/pytorch-for-jetson/72048)
```bash
import torch
print(torch.__version__)
print('CUDA available: ' + str(torch.cuda.is_available()))
print('cuDNN version: ' + str(torch.backends.cudnn.version()))
a = torch.tensor([1.0, 2.0], device='cuda')
print('Tensor a = ' + str(a))
b = torch.randn(2, device='cuda')
print('Tensor b = ' + str(b))
c = a + b
print('Tensor c = ' + str(c))

import torchvision
print(torchvision.__version__)
```

### 其他安装
其他都比较简单：
- 局域网屏幕共享，x11vnc和noVNC[Nvidia Jetson可视化配置](/posts/47970/#nvidia-jetson可视化配置)
- 安装VsCode直接[官网下载](https://code.visualstudio.com/download)arm64版本`dpkg -i *.deb`
- 输入法参考[安装中文输入法](/posts/46722/#安装中文输入法)，
- 我的终端配置[dotfiles](https://github.com/wty-yy/dotfiles)
- [Unitree-SDK2](https://github.com/unitreerobotics/unitree_sdk2)
- 从unitree rl lab中提取的部署运控模型代码[unitree_cpp_deploy](https://github.com/wty-yy-mini/unitree_cpp_deploy/)

### 其他报错
安装完`unitree-sdk2`后执行`unitree_cpp_deploy`中`go2_ctrl`时报错：`error while loading shared libraries: libddsc.so.0`，就是动态链接没链接到`/usr/local/lib`文件夹下，因为sdk2装到这里了，添加新的路径到ld中即可
```bash
echo "/usr/local/lib" | sudo tee /etc/ld.so.conf.d/usr-local-lib.conf  # 添加配置
sudo ldconfig  # 刷新动态链接库
```

# G1刷机记录
使用官方给出的刷机方法，先将NVMe取下，装在读卡器上，将img刷到硬盘上，装上NVMe后，再单独刷QSPI flash就能成功打开了。

参考[GR00T-WBC Doc - G1 JetPack 6 Flashing Guide](https://nvlabs.github.io/GR00T-WholeBodyControl/references/jetpack6.html)，下载磁盘镜像`g1-nx-j6.2.img.bz2`和固件包`Jetpack_6.2_nx.tar.bz2`，两种下载方式：
- GR00T-WBC Doc：[Google Drive - Jetpack 6.2](https://drive.google.com/drive/folders/1h3Mae8UTdc5ZoJyjZYhsr5e0AurqlyJA?usp=sharing)
- 宇树官方：[百度网盘 - unitree_imgs](https://pan.baidu.com/s/1GMs-DE8SSHYTSNIVKsoktw?pwd=7riu)

## 拆卸背板和NVMe
所需螺丝刀：**M5内六角扳手（T型扳手），T10梅花螺丝刀，PH0十字螺丝刀**，分别拆下提手的两个内六角螺丝，四个固定泡沫的梅花螺丝，以及NVMe固定的十字螺丝，我用得力DL3565维修组套能全部搞定，参考[Flashing Guide](https://nvlabs.github.io/GR00T-WholeBodyControl/references/jetpack6.html)中螺丝如下

| 背盖螺丝 | NVMe螺丝 |
| - | - |
| ![screws](/figures/robotics/real/g1/flash/screws.png) | ![nvme](/figures/robotics/real/g1/flash/ssd.png) |

拆卸时候注意，背板上方有两个搭扣，下方有粘胶，拆的时候需要从下方撬开，最后向上方推开取下外壳，泡沫背板同理，下方同样有粘胶，需从下撕开。

| 拆开后的背板 | 背板外壳 |
| - | - |
| ![back](/figures/robotics/real/g1/flash/back.jpg) | ![back_shell](/figures/robotics/real/g1/flash/back_shell.jpg) |

## 刷镜像

拆下NVMe后，装到读卡器上（我用的是绿联CM400 M.2 NVMe固态硬盘盒，最大速率10Gbps），连接到电脑（最好用USB3.0接口），执行命令
```bash
lsblk  # 查看设备名称，我的是/dev/sda
sudo umount /dev/sda*  # 卸载所有分区，可能会有多个分区，全部卸载掉
# 如果卸载不掉从文件管理器中点弹出
```
刷img用时3min8sec，命令和速度如下
```bash
❯ bzip2 -dc g1-nx-j6.2.img.bz2 | sudo dd of=/dev/sda bs=4M status=progress conv=fsync
69914443776 bytes (70 GB, 65 GiB) copied, 182 s, 384 MB/s  
bzip2: Data integrity error when decompressing.
	Input file = g1-nx-j6.2.img.bz2, output file = (stdout)

It is possible that the compressed file(s) have become corrupted.
You can use the -tvv option to test integrity of such files.

You can use the `bzip2recover' program to attempt to recover
data from undamaged sections of corrupted files.

70158900000 bytes (70 GB, 65 GiB) copied, 182.665 s, 384 MB/s

0+14002670 records in
0+14002670 records out
70158900000 bytes (70 GB, 65 GiB) copied, 188.401 s, 372 MB/s
```
弹出硬盘，先不要装到机器人上
```bash
sudo sync
sudo udisksctl power-off -b /dev/sda
```

## 刷固件

按照说明书[Unitree G1-NX更新模块固件方法.pdf](https://drive.google.com/file/d/1EQHienK8KfDwxTMBvYcgyYyTiggLxKJf/view?usp=sharing)进入恢复模式：
1. 打开电池电源，看到NX上的LED灯亮起后，同时按住右侧两个白色按钮，直到LED灯熄灭一个或全部熄灭
2. 松开靠近头部按钮，等待2秒后，松开另一个按钮
3. 可以看到只有2个LED灯亮起，说明进入了恢复模式

连接USB 3.0线，A口连电脑，C口连机器人，电脑上执行`lsusb`看到`NVIDIA Corp. APX`就说明进入刷机模式了，解压下载的固件包`Jetpack_6.2_nx.tar.bz2`，进入到Linux_for_Tegra下，复制命令直接运行：
```bash
sudo tar -xjvf Jetpack_6.2_nx.tar.bz2  # 注意一定要加sudo，否则解压出来的rootfs下的用户权限不对，刷机后会黑屏
cd Jetpack_6.2_nx/Linux_for_Tegra
sudo ./flash_nx_module.sh
```

完成后显示`success`，将网线直连机器人，电脑上设置静态IP为`192.168.123.*`，尝试ping`192.168.123.164`能通，通过ssh连接`ssh unitree@192.168.123.164`密码123，或者直接连显示屏应该就能显示了，通过可视化界面或者命令行连上Wifi
```bash
nmcli device wifi list  # 列出wifi列表
nmcli device wifi connect [SSID] password [PASSWORD]  # 连接wifi
ifconfig  # 查看分配的IP地址
```

检查Jetpack版本：
```bash
$ cat /etc/nv_tegra_release 
# R36 (release), REVISION: 4.3, GCID: 38968081, BOARD: generic, EABI: aarch64, DATE: Wed Jan  8 01:49:37 UTC 2025
# KERNEL_VARIANT: oot
TARGET_USERSPACE_LIB_DIR=nvidia
TARGET_USERSPACE_LIB_DIR_PATH=usr/lib/aarch64-linux-gnu/nvidia
```

## 后续安装

参考[Go2刷机记录-后续安装](#后续安装)完成exfat、clash、CUDA和PyTorch等软件安装。

