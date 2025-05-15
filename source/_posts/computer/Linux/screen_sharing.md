---
title: Linux局域网屏幕共享
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

简单记录下局域网下，Linux的X11界面如何共享到其他设备使用，并配置开机自动启动功能。

如果是从外网连接，直接用[ToDesk](https://www.todesk.com/)或者[向日葵](https://sunlogin.oray.com/)即可（注意：向日葵不支持Ubuntu24.04），用本地局域网连接推荐用WIFI6，带宽更大

# 局域网屏幕共享
此处有两种常用工具：[NoMachine](https://www.nomachine.com/)和VNC，这里推荐用VNC服务器，延迟相比NoMachine更低些

NoMachine使用方法非常简单，直接在两台电脑上都下载NoMachine，服务端打开server，客户端刷新即可看到可连接的设备，缺点是经常卡住不懂，需要手动刷新页面非常麻烦

## VNC服务端
> 参考[CSDN - VNC服务端比对 (vncserver vs x11vnc)](https://blog.csdn.net/qq_30883899/article/details/146980989)

VNC的服务端有两种常用的版本，分别为
- `vncserver`（全称为`TigerVNC`）：创建一个全新的独立桌面（适合无图形界面的服务器）
- `x11vnc`：直接共享当前屏幕内容（适合临时远程控制已有桌面的电脑）

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

一个直接用网页即可访问VNC的服务端/客户端，非常方便，需要启动一个服务端创建网页，然后客户端就可以直接访问主机的网页啦，使用方法如下：
```bash
cd ~/Programs  # 进入到你想保存软件的位置
git clone https://github.com/novnc/noVNC.git
# 启动客户端网页界面, vnc端口为默认为5900, 网页访问端口默认为6080
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

