---
title: ZeroTier内网穿透 - 搭建局域网配置教程
hide: false
math: true
category:
  - tools
abbrlink: 36339
date: 2026-03-10 20:05:56
index_img:
banner_img:
tags:
  - ZeroTier
  - SSH
  - Ubuntu
---

# ZeroTier内网穿透 - 搭建局域网配置教程

本文整理一份从零开始可直接操作的 ZeroTier 配置教程，包括：

- Ubuntu 上安装 ZeroTier
- 加入已有网络
- 浏览器后台授权设备
- 检查是否已经真正连通
- 排查一个很容易误判的问题：`ping` 能通，但 `ssh` 连不上

如果只是想先把网络搭起来，按前半部分一步一步操作即可；如果已经加入网络，但远程登录异常，可以直接看后面的排障章节。

## Ubuntu 安装 ZeroTier

在 Ubuntu 上使用官方安装脚本：
```bash
curl -s https://install.zerotier.com | sudo bash
# 安装完成后，检查服务是否正常启动：
sudo systemctl status zerotier-one --no-pager
# 如果没有启动，可以手动启动并设置开机自启：
sudo systemctl enable --now zerotier-one
# 查看本机 ZeroTier 节点信息：
sudo zerotier-cli info
# 正常情况下会看到类似下面的结果：
200 info <node_id> 1.16.x ONLINE
```
最后显示 `ONLINE` 就说明安装成功了。

## 加入一个 ZeroTier 网络

这里介绍使用官方的默认Planet网络，打开[my.zerotier.com](https://my.zerotier.com/)登陆，创建一个新的网络，随便起个名字，进入后可以看到下左图的界面，继续配置你想要的网络IP段（右图），例如你想要网段都在 `10.11.1.x`，就像我这样填写 `10.11.1.0/24` （其他网段同理），然后把上面默认的IP段删掉，并且把下面IPv4 Auto-Assign选项关闭即可。

| network id复制 | 网络IP段配置 |
|-|-|
| ![network id复制](/figures/tools/zerotier/network_id.png) | ![IP段配置](/figures/tools/zerotier/ip_config.png) |

点击复制按钮复制network id，例如 `48d6023c46856feb`，在终端加入这个网络

```bash
# 加入网络，填写你的 network id
sudo zerotier-cli join 48d6023c46856feb
# 200 join OK 说明执行成功
# 查看网络列表：
sudo zerotier-cli listnetworks
# 常见输出类似：
200 listnetworks <nwid> <name> <mac> <status> <type> <dev> <ZT assigned ips>
200 listnetworks 48d6023c46856feb  ea:ec:5c:8f:5b:70 REQUESTING_CONFIGURATION PRIVATE ztosiiou5n -
```
这里status有这几种
- `REQUESTING_CONFIGURATION`：说明正在请求加入网络，等待管理员授权
- `ACESS_DENIED`：说明加入请求被拒绝了，需要直接复制 `node_id` 手动添加到网络中
- `OK`：说明已经加入网络了

下面我们来让`REQUESTING_CONFIGURATION`变成`OK`，刷新刚才的界面，可以看到新多出的设备，点击编辑，按我这个方式配置一遍就好

| 编辑对应的设备 | 设备配置 |
|-|-|
| ![找到设备](/figures/tools/zerotier/member_config1.png) | ![设备配置](/figures/tools/zerotier/member_config2.png) |

授权之后，等几秒到几十秒，再回到终端执行：

```bash
sudo zerotier-cli listnetworks
# 查看到状态变为 OK 即可
```

如果你的状态没变为 `OK` 可以做下文的一些检查。

## 常见问题

### 网络中无法看到设备

设备显示 `REQUESTING_CONFIGURATION`，但在网页里面看不到这个设备，大概率是 `planet` 被修改了，导致设备无法连接到官方的 `planet` 服务器。可以重置当前的 `planet` 配置（这样并不会导致之前连接上的网络断开）：

```bash
sudo mv /var/lib/zerotier-one/planet /var/lib/zerotier-one/planet.bak
sudo systemctl restart zerotier-one
# 再次加入网络
sudo zerotier-cli join 48d6023c46856feb
```

检查是否有连接了。

### 显示ACCESS_DENIED

通常是被管理员删除了或者拒绝自动加入请求，在网页中`Manually Add Member`下面填入`node_id`，点击`Add New Member`，然后编辑这个设备，按照上面的方式配置一下就好了。

### 一个路由器内的设备之间无法互相访问

我使用了小米的AX3000T路由器，结果发现一个局域网内的相互无法访问到，网外的设备也无法访问到这个局域网内的设备，只需进入`192.168.31.1`的路由器管理界面，点击：高级设置-端口转发-UPnP状态，打开UPnP，再找到DMZ打开，并在使用ZeroTier的设备上查看IP地址，填入DMZ的IP地址，保存后就可以了。

![小米路由器配置](/figures/tools/zerotier/xiaomi_wifi_config.png)

### 两个planet网络无法同时连接

当使用自定义的`planet`服务器时，如果在想用官方的`planet`就可能掉线，解决方法是用Docker搭建另一个隔离的ZeroTier环境，Docker安装教程[参考](/posts/51856/)，配置方法如下：

首先需要避免Zerotier端口冲突，默认的端口为9993，查看当前占用情况：
```bash
❯ sudo lsof -i :9993
COMMAND    PID         USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
zerotier- 3053 zerotier-one    7u  IPv4  30744      0t0  TCP *:9993 (LISTEN)
zerotier- 3053 zerotier-one    8u  IPv6  30745      0t0  TCP *:9993 (LISTEN)
zerotier- 3053 zerotier-one    9u  IPv4  42584      0t0  UDP yy-ASUS-TUF-Gaming-A15-FA507XV:9993 
zerotier- 3053 zerotier-one   15u  IPv4  30754      0t0  UDP yy-ASUS-TUF-Gaming-A15-FA507XV:9993 
```

所以新的Docker环境需要使用其他端口，例如9994，我们将新的Zerotier配置放在`/opt/zt-official-data`下：
```bash
sudo vim /opt/zt-official-data/local.conf
```
贴入如下内容
```json
{
  "settings": {
    "primaryPort": 9994
  }
}
```

使用Host模式一键启动：
```bash
docker run -d \
  --name zt-official \
  --restart always \
  --network host \
  --device=/dev/net/tun \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_ADMIN \
  -v /opt/zt-official-data:/var/lib/zerotier-one \
  zerotier/zerotier:latest
```

接下来用`ifconfig`就可以看到多了一个`zt*`开头的网卡了，控制Docker中Zerotier的命令也和之前一样，只是需要加上`docker exec`例如：
```bash
❯ docker exec zt-official zerotier-cli status
200 info 4407a823c2 1.14.2 ONLINE
```
