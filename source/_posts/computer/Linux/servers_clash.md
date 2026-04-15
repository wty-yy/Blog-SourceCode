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

> 2026.4.9: [Clash可视化面板](#clash可视化面板) 更新mihomo默认的dashboard: metacubexd的使用方法
> 新版的[mihomo](https://github.com/MetaCubeX/mihomo)已经可以代替clash内核了（这个名字在恶搞米哈游），使用方法和原来基本一样，并支持更多配置文件格式，FlClash也使用的是mihomo内核，解析的config.yaml文件会导致clash无法启动，推荐直接使用mihomo内核
> 参考 [Linux 服务器安装 Clash代理](https://blog.myxuechao.com/post/36)

{% spoiler "安装老板Clash内核" %}
**安装 Clash 内核**
在服务器上由于没有可视化窗口，所以只能直接运行 Clash 内核，下载 `clash-linux-amd64-v3`[GitHub下载](https://github.com/WindSpiritSR/clash/releases/download/v1.18.0/clash-linux-amd64-v3-v1.18.0.gz), [clash.la下载](https://down.clash.la/Clash/Core/Releases/clash-linux-amd64-v3-v1.18.0.gz) 可以直接在命令行中启动 Clash：
```bash
mkdir Clash  # 创建文件夹
cd Clash
wget https://github.com/WindSpiritSR/clash/releases/download/v1.18.0/clash-linux-amd64-v3-v1.18.0.gz  # 下载内核
gunzip clash-linux-amd64-v3-v1.18.0.gz  # 解压得到一个文件
chmod +x clash-linux-amd64-v3-v1.18.0  # 赋予执行权限
mv clash-linux-amd64-v3-v1.18.0 clash  # 重命名该文件
```
{% endspoiler %}

# 安装 Clash (mihomo) 内核
在服务器上安装 Clash (mihomo) 内核，下载[`mihomo-linux-amd64-compatible-v1.19.23.gz `](https://github.com/MetaCubeX/mihomo/releases/download/v1.19.23/mihomo-linux-amd64-compatible-v1.19.23.gz)
```bash
mkdir Clash  # 创建文件夹
cd Clash
wget https://github.com/MetaCubeX/mihomo/releases/download/v1.19.20/mihomo-linux-amd64-compatible-v1.19.20.gz
gunzip mihomo-linux-amd64-compatible-v1.19.20.gz
chmod +x mihomo-linux-amd64-compatible-v1.19.20
mv mihomo-linux-amd64-compatible-v1.19.20 clash
```

# 下载配置文件
在VPN代理网站上可以找到 Clash 配置文件托管链接，我们记为 `https://url`，在刚才 `Clash` 文件夹中执行如下命令下载配置文件 `config.yaml`：
```bash
wget -O config.yaml \
  --header="User-Agent: Clash" \
  https://url  # 将配置文件写入到config.yaml文件中（第二行是伪装成Clash内核的请求头）
```

如果发现连接下载的是还是乱码，就直接打开本机的Clash（flclash, clash-verge等使用mihomo内核的）编辑配置文件，复制文件内容覆盖到 `config.yaml` 中保存。

# 启动代理
首先查看 `config.yaml` 文件，查看其中的 `mixed-port` 是多少，例如我这里是：
```vim
mixed-port: 7890  # http, https, socks 代理端口

# 旧版本的port和socks-port参数
port: 7890  # http, https 代理端口
socks-port: 7890  # socks 代理端口
```
在启动 Clash 代理后，我们需要将环境变量中的端口代理设置为上述端口号，为方便起见我们在 `~/.bashrc`（或`~/.zshrc`） 中加入函数方便启动与关闭代理：
```bash
# 开启代理
function proxy_on(){
  MIXED_PORT=7890  # change port 7890 to mixed-port
  export all_proxy=socks5://127.0.0.1:$MIXED_PORT
  export http_proxy=http://127.0.0.1:$MIXED_PORT
  export HTTP_PROXY=http://127.0.0.1:$MIXED_PORT
  export https_proxy=http://127.0.0.1:$MIXED_PORT
  export HTTPS_PROXY=http://127.0.0.1:$MIXED_PORT
  echo -e "Proxy enabled on port $MIXED_PORT - ENV [all_proxy, http_proxy, HTTP_PROXY, https_proxy, HTTPS_PROXY]"
}

# 关闭代理
function proxy_off(){
  unset all_proxy
  unset http_proxy
  unset HTTP_PROXY
  unset https_proxy
  unset HTTPS_PROXY
  echo -e "Proxy disabled - ENV [all_proxy, http_proxy, HTTP_PROXY, https_proxy, HTTPS_PROXY]"
}
```
修改完成 `.bashrc` 文件后，执行 `source ~/.bashrc`，通过输入命令 `proxy_on` 即可打开端口代理，`proxy_off` 即可关闭端口代理。下面就是启动 Clash 代理了：
```bash
./clash -d .  # 启动代理（这会占用一个终端界面，如果要挂在后台执行，推荐使用tmux）
proxy_on  # 启动端口代理
wget google.com  # 测试是否可以连上外网
rm index.html  # 删除测试文件
```
我们可以在 `tmux` 中的一个 pane 中执行 `./clash -d .`（服务器上无管理员权限安装tmux可以参考[在服务器上配置shell及神经网络框架 - 使用编译安装](/posts/10409/#使用编译安装)），效果如下所示

![在tmux中启动clash内核（左上角启动了Clash内核，右上角为config.yaml文件，下方wget google.com测试是否能连上google）](/figures/Linux/mihomo-config.png)

# Clash可视化面板（metacubexd）
如果上面还是无法连接到外网，可能是节点选择问题，我们可以使用mihomo默认的ui界面进行配置 [GitHub - metacubexd](https://github.com/metacubex/metacubexd)，通过可视化面板对节点进行选择，使用方法非常简单：
```bash
wget https://github.com/MetaCubeX/metacubexd/releases/download/v1.244.2/compressed-dist.tgz  # 下载面板
# 将面板上传到服务器的Clash文件夹中 （用vscode或者scp命令都可以）
scp compressed-dist.tgz [你的服务器]:/path/to/your/Clash  # 将面板上传到服务器的Clash文件夹中
# 服务器上
mkdir ui  # 创建 ui 文件夹
tar -xvf compressed-dist.tgz -C ui  # 解压到 ui 文件夹中
vim config.yaml  # 配置 config.yaml 文件
```
在 `config.yaml` 文件中修改下述三个参数：
```vim
external-controller: '127.0.0.1:9090'  # UI端口号为9090（如果占用随便换一个）
secret: 123456  # 密码
external-ui: ui  # 打开本地面板文件夹名称
```
再次启动 `./clash -d .`，使用vscode连接上服务器，在下方端口中点`转发端口`，输入你配置的网页端口，例如`9090`，然后在浏览器中访问

打开[`http://localhost:9090/ui/#/setup`](http://localhost:9090/ui/#/setup)出现如下界面，输入`Endpoint URL`为`http://127.0.0.1:9090`，密码`123456`，点击`ADD`
![UI界面Setup](/figures/Linux/mihomo-dashboard-setup.png)

自动跳转后点击左侧第二个按钮 `Proxies` 进入 `http://localhost:9090/ui/#/proxies` 就可以选择节点了，如下所示：
![UI节点选择](/figures/Linux/mihomo-dashboard.png)
