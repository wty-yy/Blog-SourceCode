---
title: 实现Linux无头模式下硬件加速的屏幕共享
hide: false
math: true
abbrlink: 47970
date: 2025-05-15 13:22:30
index\_img:
banner\_img:
category:
 - Linux
tags:
---

本文章分为两个部分，[第一部分](./#局域网屏幕共享)为有可视化界面的机载电脑（使用AMD, Intel集显参考此方法），如何在局域网下不连接显示屏来可视化界面，[第二部分](./#服务器可视化)为服务器中，如何直接可视化界面（需要sudo权限，使用Nvidia显卡渲染参考此方法）

# 局域网屏幕共享
简单记录下局域网下，Linux的X11界面如何共享到其他设备使用，并配置开机自动启动功能。

如果是从外网连接，直接用[ToDesk](https://www.todesk.com/)或者[向日葵](https://sunlogin.oray.com/)即可（注意：向日葵不支持Ubuntu24.04），用本地局域网连接推荐用WIFI6，带宽更大

此处有两种常用工具：[NoMachine](https://www.nomachine.com/)和VNC，这里推荐用VNC服务器，延迟相比NoMachine更低些

NoMachine使用方法非常简单，直接在两台电脑上都下载NoMachine，服务端打开server，客户端刷新即可看到可连接的设备，缺点是经常卡住不懂，需要手动刷新页面非常麻烦

## VNC服务端
> 参考[CSDN - VNC服务端比对 (vncserver vs x11vnc)](https://blog.csdn.net/qq_30883899/article/details/146980989)

VNC的服务端有两种常用的版本，分别为
- `vncserver`（默认用`TigerVNC`, 还有`TightVNC`, `TurboVNC`等）：创建一个全新的独立桌面（适合无指定显卡渲染，完全由软件渲染，即没有配置`/etc/X11/xorg.conf`文件）
- `x11vnc`：直接共享当前屏幕内容（适合有指定显卡渲染，即有配置`/etc/X11/xorg.conf`文件，需要手动启动一个X服务）

分别的安装方法为：
```bash
# TigerVNC
sudo apt install tigervnc-standalone-server
# x11vnc
sudo apt install x11vnc
```

服务端启动VNC服务后都会在本机上创建一个端口，他们的默认端口都是`5900, 5901, ...`，当主机没有固定的显示屏时，推荐使用`vncserver`

### vncserver配置开机自启（在没有直连显示器时使用，稳定，不会有黑屏）
#### 直接启动
首先介绍`vncserver`直接使用的方法，他会创建一个新的`DISPLAY`窗口，不会和已有的`DISPLAY`窗口冲突并且不会共享窗口，先用`vncpasswd`配置VNC登陆密码
```bash
❯ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
A view-only password is not used
```

创建新窗口
```bash
❯ vncserver :1

New Xtigervnc server 'kuavo-NUC12WSKi7:2 (kuavo)' on port 5902 for display :2.
Use xtigervncviewer -SecurityTypes VncAuth -passwd /home/kuavo/.vnc/passwd :2 to connect to the VNC server.
```

查看当前以创建窗口
```bash
❯ vncserver --list

TigerVNC server sessions:

X DISPLAY #     RFB PORT #      RFB UNIX PATH   PROCESS ID #    SERVER
1               5901                            38001           Xtigervnc
```

如果创建的是`:1`则对应端口为`5901`，后续客户端连接对应的端口即可，创建`:N`（N为正整数）则对应端口为`590N`（`:0`通常为默认的窗口界面，如果没有连主显示屏可能是黑屏）

关闭`:1`号窗口：`vncserver -kill :1`

#### 配置开机自启
`tigervnc`已经为我们配置好开机自启文件了，我们只需要学会使用即可，`cat /usr/lib/systemd/system/tigervncserver@.service`查看已经为我们配置好的启动文件，使用方法就是在`/etc/tigervnc/vncserver.users`中加入一个名称即可
```bash
sudo vim /etc/tigervnc/vncserver.users

# 在文件的最下面一行加入, 例如我电脑的用户名为kuavo
:1=kuavo
```

如果之前启动了`:1`窗口，先将其关闭`vncserver -kill :1`，使用`systemctl`启动：
```bash
sudo systemctl start tigervncserver@:1.service  # 启动服务
sudo systemctl status tigervncserver@:1.service  # 查看服务的启动状态, 显示active (running)就说明正常
sudo systemctl enable tigervncserver@:1.service  # 创建开机自启
```

### x11vnc配置开机自启（在有直连的显示屏时使用）
> 参考[ubuntu18.04安装x11vnc远程登录并设置开机自启](https://blog.csdn.net/weixin_43878078/article/details/122137067)

#### 直接启动
```bash
# 安装x11vnc
sudo apt-get install x11vnc -y
# 设置VNC密码
sudo x11vnc -storepasswd /etc/x11vnc.pass
# 给予权限
sudo chmod 777 /etc/x11vnc.pass
# 创建启动文件
sudo vim /etc/init/x11vnc.conf
```

> 在安装完`x11vnc`后，按功能键（Win键）后输入`x11vnc server`可以打开可视化配置界面，第一个界面配置端口，用默认`5900`即可，在第二个界面点`Accept Connection`，然后就启动VNC服务了，可以用于调试是否可以联通，我们以下的自启动方法无需该界面进行配置

启动文件如下
```bash
# x11vnc.conf
exec /usr/bin/x11vnc -auth guess -capslock -forever -loop -noxdamage -repeat -rfbauth /etc/x11vnc.pass -rfbport 5900 -shared
```

测试启动文件能否使用
```bash
source /etc/init/x11vnc.conf
```

{% spoiler 点击显/隐成功启动返回内容 %}
```bash
 --- x11vnc loop: 1 ---

 --- x11vnc loop: waiting for: 24332

15/05/2025 13:39:59 passing arg to libvncserver: -rfbauth
15/05/2025 13:39:59 passing arg to libvncserver: /etc/x11vnc.pass
15/05/2025 13:39:59 passing arg to libvncserver: -rfbport
15/05/2025 13:39:59 passing arg to libvncserver: 5900
15/05/2025 13:39:59 x11vnc version: 0.9.16 lastmod: 2019-01-05  pid: 24332
15/05/2025 13:39:59 -auth guess: using default XAUTHORITY for display=':1'
15/05/2025 13:39:59 Using X display :1
15/05/2025 13:39:59 rootwin: 0x51a reswin: 0x4e00001 dpy: 0x609000b0
...
```
{% endspoiler %}

#### 配置开机自启

配置开机自启动
```bash
sudo vim /etc/init.d/x11vnc.sh
```

启动脚本内容如下
```bash
#!/bin/bash
source /etc/init/x11vnc.conf
```

修改权限
```bash
sudo chmod 777 /etc/init.d/x11vnc.sh
```

添加到自启动项中，按左下角功能键（Win键），输入`startup application`，打开窗口点击右侧`Add`，修改内容如下后保存：

> 如果不想用GUI可以在`~/.conf/autostart`下创建`x11vnc.desktop`文件，内容如下

{% spoiler 点击显/隐 x11vnc.desktop文件 %}
```ini
[Desktop Entry]
Type=Application
Exec=x11vnc -auth guess -forever -loop -noxdamage -repeat -rfbauth /etc/x11vnc.pass -rfbport 5901 -shared
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=X11VNC Server
Comment=Start x11vnc on login
```
{% endspoiler %}

![X11VNC startup application](/figures/Linux/screen_sharing/x11vnc_startup_application.png)

## VNC客户端
VNC的客户端也有两种选择，Windows推荐用[RealVNC](https://www.realvnc.com/en/)效果可能更好些（Linux也可以用，但是界面比较简陋），更推荐的是用网页版的[noVNC](https://github.com/novnc/noVNC)，直接通过网页即可访问，功能也很全。

### noVNC服务端自动启动

一个直接用网页即可访问VNC的服务端/客户端，非常方便，只需在服务端启动一个网页程序，然后客户端就可以直接访问主机的网页啦，使用方法如下：
```bash
cd ~/Programs  # 进入到你想保存软件的位置
git clone https://github.com/novnc/noVNC.git
# 启动客户端网页界面, x11vnc端口为默认为5900, vncserver端口为590N, 这个N表示创建的DISPLAY=:N编号
# 网页访问端口默认为6080
./noVNC/utils/novnc_proxy --vnc localhost:5900
```

用`ifconfig`查看本机的IP地址，例如我的是`192.168.31.103`，则在局域网中的另一台电脑或手机可通过`http://192.168.31.103:6080/vnc.html`直接访问可视化界面

自动启动配置如下，还是先创建启动脚本
```bash
cat /etc/init.d/novnc.sh  # 启动脚本内容如下
#!/bin/bash
<YOUR_PATH>/noVNC/utils/novnc_proxy --vnc localhost:5900
```
注意上述路径请替换为你的，并测试一下能否运行`source /etc/init.d/novnc.sh`

记得添加访问权限`sudo chmod 777 /etc/init.d/novnc.sh`

类似上述设置自启动脚本的方法，添加到自启动项中，按左下角功能键（Win键），输入`startup application`，打开窗口点击右侧`Add`，修改内容如下后保存：
![noVNC startup application](/figures/Linux/screen_sharing/novnc_startup_application.png)

### RealVNC

在[RealVNC/Download](https://www.realvnc.com/en/connect/download/viewer)中下载并安装，在打开APP界面，直接输入`IP:5900`即可直接连上（Linux的缺点是无法复制文本内容，有点麻烦）

# 服务器可视化
除了`apt`所需的命令需要管理员权限，其他的命令都可以非管理员执行，例如`vncserver`、启动`noVNC`，由于服务器默认是没有可视化界面的，因此考虑用`tigervnc`来启动界面

```bash
sudo apt install tigervnc-standalone-server
```

先用`tigervncserver -xstartup /usr/bin/xterm`排除下问题

可能缺少xterm，用`sudo apt install xterm`安装，

查看下`xsessions`下有哪些可用的界面
```bash
$ ls /usr/share/xsessions/
gnome.desktop  gnome-flashback-compiz.desktop  gnome-flashback-metacity.desktop  gnome-xorg.desktop \
ubuntu.desktop  xfce.desktop
```
例如我有`gnome`和`xfce`

## （不推荐）Xvnc启动X服务（不支持默认显卡渲染驱动）

`vncserver`启动的X服务和`Xorg`（默认的外接显示器的启动是不一样的），而Nvidia的显卡渲染配置是在`/etc/X11/xorg.conf`下的，因此我们必须加载此文件才能用显卡渲染（找不到显卡可能在OpenGL或GLA渲染中出现黑屏，例如IsaacGym和IsaacSim），因此[推荐用下文`Xvfb`启动X服务的方法](./#推荐无界面-仅窗口显示支持更好渲染)

### xfce4界面 - 配置xstartup

编辑文件`vim ~/.vnc/xstartup`

```bash
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
xrdb $HOME/.Xresources 2>/dev/null
startxfce4 &
```

### gnome界面 - 配置xstartup

安装gnome界面相关应用：`sudo apt install ubuntu-gnome-desktop gnome-session gnome-panel gnome-terminal nautilus`

编辑文件`vim ~/.vnc/xstartup`

```bash
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export XKL_XMODMAP_DISABLE=1
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
gnome-session --session=gnome &
```

### 可能出现的错误
#### 黑屏报错
出现报错：
```bash
Could not update ICEauthority file /run/user/1016/ICEauthority
```
这是因为用另一个用户启动了这个vncserver但是他不具有当前ssh登陆的用户的权限，修改这个目录的权限即可
```bash
sudo chown guohanwei /run/user/1016
```

#### vncserver exited too early
出现这个报错信息：`vncserver exited too early`，可以参考[StackExchange - vncserver exited too early](https://askubuntu.com/questions/1375111/vncserver-exited-too-early)，修改`~/.vnc/xstartup`，删除最后的`&`符号即可

#### gnome登陆界面输入密码后无法进入界面
不清楚问题原因，可能没有管理员全线无法进入界面

#### 转发gdm3后黑屏
不清楚问题原因，推荐使用后续的openbox直接启动方法

#### 使用GPU渲染提升速度

```bash
sudo apt install virtualgl
# 或者在官网下载
https://sourceforge.net/projects/virtualgl/files/
# 找到*_amd64.deb安装包
```

查看是否有显卡渲染：
```bash
$ glxinfo -display :1 | grep "OpenGL renderer"
# 或者
$ /opt/VirtualGL/bin/glxinfo -display :1 | grep "OpenGL renderer"

# 显示没有显卡驱动
OpenGL renderer string: llvmpipe (LLVM 12.0.0, 256 bits)

# 前面加上vglrun即可用显卡驱动渲染
$ vglrun /opt/VirtualGL/bin/glxinfo -display :1 | grep "OpenGL renderer"
OpenGL renderer string: NVIDIA GeForce RTX 4090/PCIe/SSE2
```

测试渲染速度：
```bash
$ glxgears
6757 frames in 5.0 seconds = 1351.280 FPS
6821 frames in 5.0 seconds = 1364.121 FPS

$ vglrun glxgears
8169 frames in 5.0 seconds = 1633.758 FPS
8067 frames in 5.0 seconds = 1613.251 FPS
```

安装方法参考：[cyoahs - TurboVNC+VirtualGL：实现服务器的多用户图形化访问与硬件加速](https://shaoyecheng.com/uncategorized/2020-04-08-TurboVNC-VirtualGL%EF%BC%9A%E5%AE%9E%E7%8E%B0%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84%E5%A4%9A%E7%94%A8%E6%88%B7%E5%9B%BE%E5%BD%A2%E5%8C%96%E8%AE%BF%E9%97%AE%E4%B8%8E%E7%A1%AC%E4%BB%B6%E5%8A%A0%E9%80%9F.html)

#### IsaacGym启动后黑屏问题

这个是vncserver转发的问题，可以通过[Xorg启动渲染的方式解决](./#推荐xorg或xvfb支持nvidia驱动渲染)

## （推荐）Xorg或Xvfb支持Nvidia驱动渲染

> 这一段启动需要sudo权限，以及至少4个终端，推荐用VsCode或者Tmux拆分终端

这个可能是服务器上最好用的窗口渲染方法，在尝试了各种VNC转发，只有这种方法可以渲染`IsaacGym, IsaacSim`

`Xorg`和`Xvfb`都是启动X服务的方法（`startx`也是便捷方法，但是启动后权限总是有问题于是不用），但只有`Xorg`才会用到`/etc/X11/xorg.conf`配置文件，因此使用`Xorg`

我们要直接用Nvidia显卡渲染需要自定义一个X服务，再启动`x11vnc`用VNC协议转发图像界面，用`noVNC`使浏览器可以访问VNC界面，最后打开`xfce`会话就可以看到图形界面啦，从而也可以用Nvidia驱动渲染界面，打开`IsaacGym, IssaacSim`，流程如下：

1. 查看当前可用的显卡驱动Bus ID后面会用到（或者从现在已有的`/etc/X11/xorg.conf`查看`BusID`，如果`xorg.conf`为空就用`nvidia-xconfig`初始化一个即可）：
    ```bash
# 用nvidia-smi -q查询BusID（16进制）, 需手动转为10进制
nvidia-smi -q | grep "Bus Id"

# 脚本将nvidia-smi -q查询到的BusID从16进制转为10进制（脚本可能失效）
nvidia-smi -q | grep "Bus Id" | while read -r _ _ _ busid; do
  bus=$(echo $busid | cut -d':' -f2)
  dev=$(echo $busid | cut -d':' -f3)
  func=$(echo $busid | cut -d':' -f4 | cut -d'.' -f2)
  dev_hex=$(echo $busid | cut -d':' -f4 | cut -d'.' -f1)
  printf "PCI:%d:%d:%d\n" $((16#$bus)) $((16#$dev_hex)) $((16#$func))
done
# 我的输出为（8张显卡）
PCI:1:0:0
PCI:36:0:0
PCI:65:0:0
PCI:97:0:0
PCI:129:0:0
PCI:161:0:0
PCI:193:0:0
PCI:225:0:0
    ```
2. 新建一个`sudo vim /etc/X11/xorg-nvidia-dummy-sceen.conf` X服务启动配置文件
    ```vim
Section "Device"
    Identifier     "NvidiaGPU"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BoardName      "GeForce RTX 4090"
    BusID          "PCI:97:0:0"  # 从上述输出的BusID中选一个用
    Option         "AllowEmptyInitialConfiguration" "true"
    Option         "UseDisplayDevice" "None"
EndSection

Section "Screen"
    Identifier     "Screen0"
    Device         "NvidiaGPU"
    DefaultDepth   24
    SubSection "Display"
        Depth      24
        Modes      "1920x1080"  # 修改为你想要的分辨率, eg. "1280x720"
        Virtual    1920 1080  # 修改为你想要的分辨率, eg. 1280 720
    EndSubSection
EndSection

Section "ServerLayout"
    Identifier     "Layout0"
    Screen         "Screen0"
EndSection
    ```
3. 启动X服务：`sudo X :1 -config /etc/X11/xorg-nvidia-dummy-sceen.conf`（设置界面编号为`DISPLAY=:1`，指定使用我们刚才配置的文件，不会影响到正常的连接显示屏，因为默认配置文件是`/etc/X11/xorg.conf`）
4. 启动转发：`x11vnc -display :1`（[安装x11vnc见上文](./#x11vnc配置开机自启在有直连的显示屏时使用)，设置转发窗口为`DISPLAY=:1`）
    - 配置密码（仅需一次）：`sudo x11vnc -storepasswd`，默认保存在`~/.vnc/passwd`文件下，这里就保存在`/root/.vnc/passwd`下了，后面写脚本更方便些
    - 启动转发：`x11vnc -display :1 -rfbauth /root/.vnc/passwd -forever -shared -loop`，每个参数的作用如下：
        - `-display :1`：转发X服务器`:1`显示界面
        - `-rfbauth /root/.vnc/passwd`：使用密码
        - `-forever`：允许持续运行，不会在第一个客户端断开时退出
        - `-shared`：支持多电脑连接
        - `-loop`：如果发生错误（如 X session 暂时不可用），会自动尝试重新连接
        - `-noxdamage`：（可选）禁用 X Damage 扩展，用于修复某些情况下屏幕不刷新的问题（尤其在某些显卡驱动下）；当屏幕变化不大时，该扩展可以显著降低负载，并更快地检测变化区域
5. 使用novnc显示：`./utils/novnc_proxy --vnc localhost:5900`（[安装noVNC见上文](./#novnc服务端自动启动)）

这时候在浏览器上输入`<服务器IP>:6080`即可连接上VNC，我们在终端中启动`DISPLAY=:1 xclock`一个小闹钟，可以看到屏幕，但是我们无法进行拖动，可以用`DISPLAY=:1 openbox`来进行简单窗口拖动，但是还是没有会话界面，下面启动一个会话界面`xfce4`

6. 先启动DBUS会话服务
    ```bash
# 启动
eval $(dbus-launch --sh-syntax)
export DBUS_SESSION_BUS_ADDRESS
export DBUS_SESSION_BUS_PID
# 验证一下有没有返回值
echo $DBUS_SESSION_BUS_ADDRESS
# unix:abstract=/tmp/dbus-7vGHzBEZzq,guid=7fe9bcd482e14c8e918179976829d0cd
    ```
7. 启动xfce4：`DISPLAY=:1 startxfce4`
8. 通过命令行打开可视化程序，只需要在终端执行一次`export DISPLAY=:1`，后续的所有可视化窗口都会在这个界面显示出来啦

例如我们启动了`./isaac-sim.sh`, `python 1080_balls_of_solitude.py`效果如下，大功告成！（用工位的网络，非常流畅，和本机使用差不多效果，还只需要启动一个网页即可，非常方便，手机也可以）
![服务器可视化效果](/figures/Linux/screen_sharing/server_screen_sharing.png)

通过`glxinfo | grep renderer`可查看使用的渲染：
```bash
$ glxinfo | grep renderer
# 有Nvidia驱动
OpenGL renderer string: NVIDIA GeForce RTX 4090/PCIe/SSE2
# 没有显卡驱动，CPU软件渲染
OpenGL renderer string: llvmpipe (LLVM ...)
```

### 一键启动脚本

创建脚本位置放在`/usr/local/bin/start-xfce-vnc.sh`（放哪都行，因为有`sudo`命令所以放在根目录下了），使用方法：
```bash
# 设置一次启动权限
sudo chmod +x /usr/local/bin/start-xfce-vnc.sh

sudo bash start-xfce-vnc.sh  # 启动全部脚本

# ctrl+c即可退出, 并自动kill掉所有启动的进程
```

脚本功能：按照上述流程依次启动X服务、DBus会话服务、Xfce4会话、x11vnc转发、noVNC网页可视化；并自动检查`6080`端口是否被占用，若占用则说明已启动，无需再次启动

> 下面脚本中的x11vnc密码就用`/root/.vnc/passwd`了，按需调整密码保存的位置

{% spoiler "start-xfce-vnc.sh脚本" %}
```bash
#!/bin/bash

# 检查端口6080是否被占用
if lsof -i:6080 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "端口6080已被占用，脚本将不再继续启动，请用 http://[IP]/vnc.html 连接，export DISPLAY=:1 来可视化命令行启动的界面"
    exit 1
fi

# 设置进程组，方便退出时统一管理
set -m

# 启动 X Server
sudo /usr/bin/X :1 -config /etc/X11/xorg-nvidia-dummy-sceen.conf &
x_pid=$!

# 等待 X Server 启动
sleep 3

# 启动 DBus 会话服务
eval $(dbus-launch --sh-syntax)
export DBUS_SESSION_BUS_ADDRESS
export DBUS_SESSION_BUS_PID

# 启动桌面环境（XFCE）
DISPLAY=:1 startxfce4 &
xfce_pid=$!

# 启动 x11vnc
x11vnc -display :1 -rfbauth /root/.vnc/passwd -forever -shared -loop &
vnc_pid=$!

# 启动 noVNC proxy
/data/user/wutianyang/programs/noVNC/utils/novnc_proxy --vnc localhost:5900 &
novnc_pid=$!

sleep 5
echo "脚本全部启动完毕，请用 http://[IP]/vnc.html 连接，export DISPLAY=:1 来可视化命令行启动的界面"

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
    if ps -p $xfce_pid > /dev/null 2>&1; then
        echo "杀掉 XFCE (PID=$xfce_pid)"
        kill -TERM $xfce_pid
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

# 等待桌面环境退出（或手动 Ctrl+C）
wait $xfce_pid
```
{% endspoiler %}

进一步可以在`~/.bashrc`中加入快捷启动命令：
```bash
# ~/.bashrc
alias start-xfce-vnc="sudo bash /usr/local/bin/start-xfce-vnc.sh"

source ~/.bashrc
start-xfce-vnc  # 即可一键启动了
```

### 关闭已经启动的X服务
通过`ps aux | grep "Xorg :1"`命令可以查看当前启动的服务（例如我是在`DISPLAY=:1`上启动的），那么就要关掉`/usr/lib/xorg/Xorg`这个程序启动的PID，`sudo kill -9 3557223`即可

```bash
❯ ps aux | grep "Xorg :1"
root     3557222  0.2  0.0  15008  4844 pts/5    S+   21:40   0:00 sudo Xorg :1
root     3557223 20.2  0.0 26109244 219564 tty2  Ssl+ 21:40   0:00 /usr/lib/xorg/Xorg :1  # 注意是这个/usr/lib/xorg/Xorg
```


