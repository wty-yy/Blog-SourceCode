---
title: 乐聚Kuavo机器人上位机静态网络配置
hide: false
math: true
abbrlink: 1797
date: 2025-08-31 19:27:33
index\_img:
banner\_img:
category:
 - Robotics
 - Real
tags:
---

记一次将乐聚Kuavo45的上位机从Intel的换成Nvidia Jetson AGX网络配置过程，分为两步上下位机的连接和Mid-360雷达连接

## 网络配置

Ubuntu桌面版默认使用NetworkManager来管理网络配置，命令行版使用systemd-networkd来管理，而我们要用的是netplan是基于他们之上的管理器，这里就用它来创建每个网口的静态IP

```bash
sudo apt install netplan.io
```

### Netplan使用方法

第一步：判断当前设配对应的网口，通过插拔网线/USB线来查看
```bash
❯ nmcli device  # 拔下网线(USB线)
DEVICE            TYPE      STATE                   CONNECTION
eno1              ethernet  connected               netplan-eno1
wlP1p1s0          wifi      connected               Xiaomi_AX3000T
docker0           bridge    connected (externally)  docker0
p2p-dev-wlP1p1s0  wifi-p2p  disconnected            --
usb0              ethernet  unavailable             --
l4tbr0            bridge    unmanaged               --
can0              can       unmanaged               --
can1              can       unmanaged               --
usb1              ethernet  unmanaged               --
lo                loopback  unmanaged               --

❯ nmcli device  # 插上网线(USB线), 多出了enx00e04c360015网口, 说明就是这个
DEVICE            TYPE      STATE                                  CONNECTION
eno1              ethernet  connected                              netplan-eno1
wlP1p1s0          wifi      connected                              Xiaomi_AX3000T
docker0           bridge    connected (externally)                 docker0
enx00e04c360015   ethernet  connecting (getting IP configuration)  Wired connection 2
p2p-dev-wlP1p1s0  wifi-p2p  disconnected                           --
usb0              ethernet  unavailable                            --
l4tbr0            bridge    unmanaged                              --
can0              can       unmanaged                              --
can1              can       unmanaged                              --
usb1              ethernet  unmanaged                              --
lo                loopback  unmanaged                              --
```

第二步：配置`/etc/netplan/`文件夹下的配置文件`*.yaml`，详细配置如后文所示，配置完了后记得修改权限
```bash
sudo chmod 600 /etc/netplan/*.yaml
```

第三步：启动netplan, 并检查静态IP是否设置
```bash
# 启动netplan
sudo netplan apply

# 检查是否设置上静态IP
ip addr
ifconfig
# 或者指定网口
ip addr show enx00e04c360015
ifconfig enx00e04c360015
```

### 上位机配置
由于上下位机之间没有路由，因此需要通过静态IP来相互连接上，上位机IP为`192.168.26.12`，下位机IP为`192.168.26.1`，子网掩码为`255.255.255.0`，首先找到对应网口为`eno1`，配置`/etc/netplan/01-eno1.yaml`文件为
```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    eno1:
      dhcp4: false
      addresses: [192.168.26.12/24]  # 上位机与下位机连接的IP为192.168.26.12
      # 子网掩码为255.255.255.0 (就是这个/24, 表示掩码前24位为1), 网段为192.1.68.26.*
```

### Mid-360雷达配置
由于连接雷达需要配置静态IP: `192.168.1.50`, 找到对应网口为`enx00e04c360015`，对应MAC地址为`00:e0:4c:36:00:15`，编辑配置文件
```bash
sudo vim /etc/netplan/02-mid360.yaml

# 方案一 (网口匹配)
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enx00e04c360015: # 网口
      dhcp4: no
      addresses: [192.168.1.50/24]

# 方案二 (MAC地址匹配)
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    mid360-lidar: # 写一个你自己喜欢的逻辑名称
      match:
        macaddress: 00:e0:4c:36:00:15 # 使用设备的MAC地址进行匹配
      dhcp4: no
      addresses: [192.168.1.50/24]
```
最后记得设置权限
```bash
sudo chmod 600 /etc/netplan/02-mid360.yaml
```

