---
title: 在服务器上配置Clash代理
hide: false
math: true
abbrlink: 60686
date: 2024-06-12 12:47:25
index\_img:
banner\_img:
category:
 - Linux
tags:
---

> 参考 [LiuXueChao🩷蛋～ - Linux 服务器安装 Clash代理](https://blog.myxuechao.com/post/36)

# 安装 Clash 内核
在服务器上由于没有可视化窗口，所以只能直接运行 Clash 内核，下载 [`clash-linux-amd64-v3`](https://down.clash.la/Clash/Core/Releases/clash-linux-amd64-v3-v1.18.0.gz) 可以直接在命令行中启动 Clash：
```bash
mkdir Clash  # 创建文件夹
cd Clash
wget https://down.clash.la/Clash/Core/Releases/clash-linux-amd64-v3-v1.18.0.gz  # 下载内核
gunzip clash-linux-amd64-v3-v1.18.0.gz  # 解压得到一个文件
chmod +x clash-linux-amd64-v3-v1.18.0  # 赋予执行权限
cp clash-linux-amd64-v3-v1.18.0 clash  # 重命名该文件（不要删除源文件，clash文件有时候用不了了就再覆盖一次）
```

# 下载配置文件
在VPN代理网站上可以找到 Clash 配置文件托管链接，我们记为 `http://url`：
```bash
wget -O config.yaml https://url  # 将配置文件写入到config.yaml文件中
```

# 启动代理
首先查看 `config.yaml` 文件，查看其中的 `port, socks-port` 是多少，例如我这里是：
```vim
port: 7890  # http, https 代理端口
socks-port: 7891  # socks 代理端口
```
在启动 Clash 代理后，我们需要将环境变量中的端口代理设置为上述端口号，为方便起见我们在 `~/.bashrc` 中加入函数方便启动与关闭代理：
```bash
# 开启代理
function proxy_on(){
    export all_proxy=socks5://127.0.0.1:7891  # 将端口号 7891 填为上述 socks-port
    export http_proxy=http://127.0.0.1:7890  # 将端口号 7890 填为上述 port
    export https_proxy=http://127.0.0.1:7890  # 将端口号 7890 填为上述 port
    echo -e "已开启代理"
}

# 关闭代理
function proxy_off(){
    unset all_proxy
    unset http_proxy
    unset https_proxy
    echo -e "已关闭代理"
}
```
修改完成 `.bashrc` 文件后，执行 `source ~/.bashrc`，通过输入命令 `proxy_on` 即可打开端口代理，`proxy_off` 即可关闭端口代理。下面就是启动 Clash 代理了：
```bash
./clash -d .  # 启动代理（这会占用一个终端界面，如果要挂在后台执行，推荐使用tmux）
proxy_on  # 启动端口代理
wget google.com  # 测试是否可以连上外网
```
我们可以在 `tmux` 中的一个 pane 中执行 `./clash -d .`（服务器上无管理员权限安装tmux可以参考[在服务器上配置shell及神经网络框架 - 使用编译安装](/posts/10409/#使用编译安装)），效果如下所示

![在tmux中启动clash内核（左上角启动了Clash内核，右上角为config.yaml文件，下方测试是否能连上google.com）](/figures/Linux/clash内核启动.png)

# Clash可视化面板
如果上面还是无法连接到外网，可能是节点选择问题，我们可以使用 [GitHub - yacd](https://github.com/haishanh/yacd) Clash 可视化面板对节点进行选择，使用方法非常简单：
```bash
wget https://github.com/haishanh/yacd/archive/gh-pages.zip  # 下载UI界面
unzip gh-pages.zip  # 解压
mv yacd-gh-pages dashboard  # 重命名文件夹为 dashboard
vim config.yaml  # 配置 config.yaml 文件
```
在 `config.yaml` 文件中修改下述三个参数：
```vim
external-controller: '0.0.0.0:9090'  # UI端口号为9090
external-ui: dashboard  # 打开面板
secret: '123456'  # 密码
```
再次启动 `./clash -d .`，在本机的浏览器上输入网址 `http://[你的服务器IP]:9090/ui/`，点击左侧的 `Proxies` 点击测速按钮，对节点继续选择：
![UI节点选择](/figures/Linux/clash网页ui节点选择.png)

如果出现 `Unexpected response from the backend` 页面，点击 `Switch backend`，如下填入配置：
![backend配置](/figures/Linux/clash_backend_add.png)


