---
title: Ubuntu上使用Samba在局域网上向Windows及其他设备共享目录
hide: false
math: true
abbrlink: 1858
date: 2024-02-13 23:08:46
index\_img:
banner\_img:
category:
 - Linux
tags:
---

使用Samba可以非常方便地将Linux上的文件夹共享到其他设备上，Ubuntu的共享方法非常简单，参考[官方文档](https://ubuntu.com/tutorials/install-and-configure-samba#1-overview)，我使用的Ubuntu版本为22.04LTS。

> Windows使用Samba共享文件夹可以参考：[Windows 10 Samba文件共享的设置方法，解决不能访问和密码错误的问题](https://www.51cto.com/article/658846.html)

### 安装Samba
```shell
sudo apt update  # 更新软件源
sudo apt install samba  # 安装Samba
```

### 创建Samba共享目录

可以在任何位置进行创建，我在用户目录下创建了名为`Share`的文件夹，我的用户名为`wty`：
```shell
mkdir /home/wty/Share
```

接下来编辑Samba配置文件位于`/etc/samba/smb.conf`（可以使用你喜欢的编辑器进行编辑`vim/gedit/nano/...`）
```shell
sudo vim /etc/samba/smb.conf  # 或者将vim改为gedit/nano
```

在文件的最底下加入如下配置文本：
```conf
[sambashare]  # 当前分享的网络文件夹名称，在其他设备访问时候会看到sambashare文件夹的目录，进入后就是来到path文件夹下
    comment = Samba on Ubuntu  # 对该共享文件夹的描述
    path = /home/wty/Share  # 我们要分享的文件夹
    read only = no  # 授予修改文件夹的权限
    browsable = yes  # 在Ubuntu的文件管理器中列出当前共享文件夹
```

保存后，重启Samba服务
```shell
sudo service smbd restart
```

**注意在Ubuntu防火墙中允许Samba服务**，否则仍然无法访问：
```shell
sudo ufw allow samba
```

### 添加用户

由于Samba使用的用户密码和Ubuntu用户密码不同，需要重新对当前Ubuntu用户创建新的Samba密码（假如我的Ubuntu用户为`wty`）：
```shell
sudo smbpasswd -a wty  # wty为Ubuntu的用户名（还可以是root用户）
```
> Samba创建的用户名必须属于Ubuntu用户名中，否则无法保存

再输入密码即可创建用户。

### 连接Samba

首先使用`ip addr`找到当前网卡的IPv4地址（如下图所示，本机地址为`192.168.3.10`）：
![ip addr获取IPv4地址](/figures/Linux/ip_addr.png)

#### Windows可视化界面连接
Windows通过文件管理器在地址栏中输入`\\IP地址`回车，就会弹出登陆界面，输入刚才创建的用户名和密码即可连接：
![Windows文件管理器连接Samba](/figures/Linux/Windows_connect_Samba.png)

#### Ubuntu可视化界面连接
我使用的是Ubuntu22.04可以直接用文件管理器继续连接，效果非常好，使用方法如下：

首先打开文件管理器，点击左侧`Other Locations`，在右侧底部可以输入服务器链接，使用Samba服务就是以`smb://开头`后面输入你的ip地址，如下图所示：
![Ubuntu文件管理器连接Samba](/figures/Linux/Ubuntu_connect_Samba.png)
最后点击`connect`即可连接，打开你创建的文件夹，再输入刚才创建的用户名及密码，即可使用：
![用户名密码登陆](/figures/Linux/Ubuntu_connect_Samba2.png)

#### Linux命令行连接

使用`smbclient`进行连接，使用方法为`smbclient //ipv4地址/共享文件夹名称`，假如我的`ip=192.168.3.10, 共享文件夹名称=smabashare`，则如下执行命令：
```shell
sudo apt install smbclient
smbclient //192.168.3.10/sambashare
```
再输入刚才创建的密码即可连接进入，进入后使用`ls`就可以显示文件，使用`help`查看相关命令。（命令不多，如果相比可视化界面差很多）


