---
title: Docker 安装与常用命令
hide: false
math: true
abbrlink: 51856
date: 2024-06-17 10:10:13
index\_img:
banner\_img:
category:
 - tools
tags:
---

# Docker

Docker 是系统级的虚拟化管理平台，以容器（container）形式对镜像（image）进行打开，从而可以直接获得别人环境的 clone。

目前我使用 Docker 的主要原因有：
1. 可以避免很多编译环境配置问题（Kalibr 相机标定工具包，必须要求系统中的 Python 版本为 3.8，而 Ubuntu 22.04 最低版本为 3.10，无法编译源文件，因此只能通过 Docker-ROS + Kalibr 完成安装）

## Docker 安装

我参考官方的 Ubuntu 安装教程进行的安装，这里有两个版本：
- Docker Desktop（**非常不建议**安装），这个主要是 Windows 上面用的，不支持 X11 可视化！
- Docker Engine，就是 Docker 的内核，适用于命令行。
这里还是不推荐使用官方的下载方式，速度很慢而且证书很可能错误，我们使用基于 [清华源 - Docker CE 软件仓库](https://mirrors.tuna.tsinghua.edu.cn/help/docker-ce/) 的一键安装方法（非常方便快捷）：
```bash
export DOWNLOAD_URL="https://mirrors.tuna.tsinghua.edu.cn/docker-ce"
# 如您使用 curl
curl -fsSL https://raw.githubusercontent.com/docker/docker-install/master/install.sh | sh
# 如您使用 wget
wget -O- https://raw.githubusercontent.com/docker/docker-install/master/install.sh | sh
```

安装完成后需要给用户权限，参考[How to fix "dial unix /var/run/docker.sock: connect: permission denied" when group permissions seem correct?](https://stackoverflow.com/questions/51342810/how-to-fix-dial-unix-var-run-docker-sock-connect-permission-denied-when-gro)中的方法，只需将用户加入docker用户组即可
```bash
# 临时方法，无需重启（但重启后无效了）
sudo setfacl --modify user:${USER}:rw /var/run/docker.sock
# 需要重启（重启仍然有效）
sudo usermod -aG docker ${USER}
sudo reboot
```

{% spoiler 安装 Docker Desktop **非常不建议** %}
安装 [Docker - Install Docker Desktop on Ubuntu](https://docs.docker.com/desktop/install/ubuntu/) 则在官网上下载对应系统的 dpkg 安装包，执行
```bash
sudo apt install ./docker-desktop-4.30.0-amd64.deb  # 你的安装包名字
```

> 如果你的电脑上已经安装了 Docker Enginer有 images 又想新安装 Docker Desktop，一定要记得上传或者保存你的 image，不然会被全部删除的😭

注意：Ubuntu 如果打不开 docker desktop 执行下述命令后再试下（我就遇到了）
```bash
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

安装 Docker Desktop 还需要配置文件共享路径范围，打开界面，点 `齿轮 - Resources - File sharing - Virtual file shares - 加号` 输入 `/` 表示全部文件都可以是共享文件，即可。

Docker Desktop 可视化界面如下所示：

![Docker Desktop](/figures/tools/docker_desktop.png)
{% endspoiler %}

## Docker 代理加速
我们使用 Docker 一般都喜欢从 Docker Hub 上拉镜像下来，自己改好以后再传上去，如果只需要下拉 `pull` 可以参考下面使用镜像加速器，但是要上传 `push` 就最好使用自己的代理了（否则你可能出现反复 pushing + retrying 的效果，如下图所示）。
{% spoiler 无法正常push的图像 %}
![无法正常push](/figures/tools/docker_bad_push.png)
{% endspoiler %}

---

**注意：**下述**使用镜像**和**配置代理**两种方法，**仅能选择一个使用**

### 使用镜像（仅支持pull）
2025.2.23.[dockerpull](https://dockerpull.cn/)可用，配置方法，修改`sudo vim /etc/docker/daemon.json`（最好清空）文件为
```json
{
  "registry-mirrors": ["https://dockerpull.cn"]
}
```
重启docker即可`sudo systemctl daemon-reload`, `sudo systemctl restart docker`。

### 配置代理 (支持push+pull)
**2024.6.6. 国内的 Docker Hub 镜像加速器相继停止服务，可选择为 Docker daemon 配置代理或自建镜像加速服务。** 该消息来自[GitHub - Docker Hub 镜像加速器](https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6?permalink_comment_id=5082662)，这个页面中介绍了使用 Docker 镜像加速器的方法，里面可以找到大家分享的最新镜像网站。

Docker daemon 可以认为是执行 Docker 命令的运行在后台的进程，可以通过 `sudo systemctl daemon-reload` 进行重启，重启整个docker服务使用命令 `sudo systemctl restart docker`（配置完成代理后需要重启docker）

因此如果我们要配置代理是对 Docker daemon 进行配置，参考官方文档 [Docker - Configure the daemon with systemd](https://docs.docker.com/config/daemon/systemd/)，向 `sudo vim /etc/docker/daemon.json` 中加入如下配置
```json
{
  "proxies": {
    "http-proxy": "http://127.0.0.1:7890",
    "https-proxy": "http://127.0.0.1:7890"
  }
}
```
其中需要注意的是：
- 如果你使用的也是 Clash 进行的代理，那么代理的ip通常就是本地ip `127.0.0.1`，端口号可以在 Clash 中进行查看
- 如果你不确定端口号多少可以通过 `env | grep http` 查看你的系统环境变量中 `http_proxy` 和 `https_proxy` 对应的 IP
- `"https-proxy": "http://127.0.0.1:7890"`：这里 IP 中的 `http` 没有写错，千万不要写成了 `https`
- 如果你还有其他配置参数，请遵守 `json` 文件格式，在第一层大括号内加入，并在两个参数之间加上一个逗号 `,`
- 配置代理后，使用 Docker 时都要把代理一直保持开启状态

## Docker 移动镜像位置
Docker默认的存储位置为`/var/lib/docker`，通常是主硬盘，可能没存储空间了，因此需要移动到其他盘上，方法如下：

停止docker服务
```bash
sudo systemctl stop docker
sudo systemctl stop docker.socket

# 确定Docker完全停止, 下面命令看到的状态是inactive (dead)
sudo systemctl status docker
```

复制Docker数据到新位置，这里我移动到 `/mnt/ssd/docker/`
```bash
# -a 归档模式，保留所有文件属性
# -P 显示进度，并支持断点续传
sudo rsync -aP /var/lib/docker/ /mnt/ssd/docker/
```
> 源目录 `/var/lib/docker/` 末尾的斜杠 `/` 非常重要！它表示复制该目录下的内容，而不是目录本身。

配置Docker守护进程以使用新路径，修改 `/etc/docker/daemon.json` 添加内容如下（如果有其他内容，请自行保证JSON格式正确）：
```vim
{
  "data-root": "/mnt/ssd/docker"
}
```

更新配置文件，重启Docker
```bash
sudo systemctl daemon-reload
sudo systemctl start docker
```

查看是否转移成功，返回地址是修改后的就说明成功了
```bash
> docker info | grep "Docker Root Dir"
Docker Root Dir: /mnt/ssd/docker
```

## Docker 登陆

如果后面想要上传自己 image 则需要进行登陆，首先在 [Docker Hub](https://hub.docker.com/) 上注册一个帐号，记住注册的用户名及密码，执行 `docker login` 输入帐号密码进行登陆（如果出现登陆不上的情况，请删除之前的记录 `rm ~/.docker/config.json` 再重试）
> （已弃用 Docker Desktop）如果使用的是 Docker Desktop 版本需要按照官方教程 [Sign in to Docker Desktop](https://docs.docker.com/desktop/get-started/) 配置文件，然后再使用 `docker login` 进行登陆。

## Docker 基础操作
### 基础概念
如果想学习具体命令细节，请见官网 [Docker.docs - Reference](https://docs.docker.com/reference/) 写的很详细，官方词汇表请见 [Glossary](https://docs.docker.com/glossary/)，这里简单对 Docker 的使用流程进行介绍：
- image（镜像）：当作一个虚拟机的基础文件，只不过比虚拟机小很多
- container（容器）：当作一个虚拟机（对镜像的运行实例），通过镜像可以创建容器，使用 [`docker ps -a`](https://docs.docker.com/reference/cli/docker/container/ls/) 查看当前全部容器，容器有以下几个常用状态：
  - Created：已创建
  - Exited：已停止
  - Running/Up：正在运行
- [dockerfile](https://docs.docker.com/reference/dockerfile/)（文本文件）：是一个用于创建镜像的代码，可以通过 `docker build` 编译成一个镜像（一般是在一个文件夹下，包含构建镜像的相关文件）
- Host（宿主机）：就是你的主机，用来跑 Docker

### 一般流程
使用 Docker 的一般流程如下：

1. **创建 image**：有如下两种常用方法
    - 方法1：使用 [`docker build`](https://docs.docker.com/reference/cli/docker/image/build/) 基于当前目录下的 dockerfile 创建镜像
    ```bash
    docker build -t {创建的镜像名称} -f {dockerfile的文件名} . `
    ```
    - 方法2：使用 [`docker pull`](https://docs.docker.com/reference/cli/docker/image/pull/) 直接从 Docker Hub 上（也可以是自己指定的某个内部服务器，记得在上文中[代理设置](./#docker-代理加速)中加入它）下拉一个镜像，版本号（又称tag）可以在该对应的项目中查看，如果不指定版本号，默认版本号为latest
    ```bash
    docker pull {Docker Hub 上的用户名}/{该用户的镜像名称}:{版本号}
    ```
    查看你本地镜像 [`docker images`](https://docs.docker.com/reference/cli/docker/image/ls/)，可以列出镜像所处的仓库（也是镜像的名称） `REPOSITORY`，编号 `IMAGE ID`，版本号 `TAG`，创建时间 `CREATED`，镜像大小 `SIZE`，下文中用容器打开指定的镜像通常格式是 `{REPOSITORY}:{TAG}` 如果不指定 `TAG` 则默认版本号为 latest

2. **用容器打开镜像**：使用 [`docker run`](https://docs.docker.com/reference/cli/docker/container/run/#interactive) 可以创建容器并打开交互终端，它有很多可选参数，例如
    - `-i`：打开的标准输入接口，从而可以从宿主机向容器输入数据（经常作为 `-it` 和 `-t` 联合使用）
    - `-t`：将宿主机的终端和容器的 I/O 接口连接（经常作为 `-it` 和 `-i` 联合使用）
    - `--privileged`：打开几乎宿主机的全部权限，启动全部 Linux 内核功能
    - `--net=host`：指定容器使用的网络名称，`host` 表示使用宿主机网络
    - `-e, --env`: 设置容器运行时的环境变量
    - `-v, --volume HOST_PATH:CONTAINER_PATH`：挂载卷，将宿主机上的 `HOST_PATH` 目录挂载到 `CONTAINER_PATH`
        - 如果 `HOST_PATH` 不存在则自动创建文件夹；如果存在一个同名文件，则不会进行创建，挂载内容为空
        - 如果 `COUNTAINER_PATH` 已存在，并且是一个文件及则会将其覆盖；如果存在，且是一个文件，则会报错
    以下是一个使用例子：
    ```bash
    docker run -it \  # 启动交互窗口
      --privileged \  # 获取宿主机的管理员权限，从而可以获取外部设备信息
      --net=host \  # 使用宿主机的网络，从而可以通过设置http_proxy和https_proxy直接使用宿主机的代理
      -e "DISPLAY" \  # 指定显示器
      -e "QT_X11_NO_MITSHM=1" \  # 用于QT可视化
      -v "/dev:/dev" \  # 获取宿主机设备信息，从而可以读取到摄像头
      -v "/tmp/.X11-unix:/tmp/.X11-unix:rw" \  # X11可视化转发（和 -e "DISPLAY" 联合用）
      -v "$(pwd):/data" \  # 将/data转发到当前所在路径(pwd)
      {image名称}:{版本号}  # 启动的镜像名称:版本号
    ```

3. **修改容器**：就像使用终端一样修改你的容器吧（用 `apt` 安装程序，修改文件等等），最后使用 `exit` 退出（用 `ctrl + p + q` 后台挂起也可以退出，下次可以通过 `docker exec -it {容器ID/NAME} bash` 回到该容器，当前容器中的进程还在），注意这次退出如果没有保存更新的话，关闭容器后修改内容全部消失

4. **重启容器**：存在两种常用容器状态（用 `docker ps -a` 查看）：
    1. `Exited`: 需要先用 `docker start <容器ID/NAME>` 来启动容器，变为 `Up` 状态
    2. `Running/Up`: 直接用 `docker exec -it <容器ID/NAME> bash` 来进入容器

5. **保存（提交）你的镜像**：当你对容器改的差不多时候，使用 [`docker commit`](https://docs.docker.com/reference/cli/docker/container/commit/) 选择当前存在的容器进行提交
    ```bash
    docker ps -a  # 查看当前全部容器的名称，找到你想要保存的容器 ID 或者 NAME
    docker commit {想保存的容器ID/NAME} {镜像名字}:{版本号}
    ```
6. **删除不用的容器/镜像**：使用 [`docker rm`](https://docs.docker.com/reference/cli/docker/container/rm/) 选择当前存在的容器进行删除
    ```bash
    docker ps -a  # 查看当前全部容器的名称，找到你想要删除的容器 ID 或者 NAME
    docker rm -f {想删除的容器ID/NAME}  # 指定一个容器删除
    docker rm -f $(docker ps -a -q)  # 删除当前全部容器，-f 表示即使是Running状态也可以kill
    ```
    使用 [`docker rmi`](https://docs.docker.com/reference/cli/docker/image/rm/) 对镜像进行删除（删除镜像前，要把对应启动的容器先删除掉）
    ```bash
    docker images  # 查看当前镜像名称，找到你想删除的镜像名称和版本号
    docker rmi {镜像名称}:{版本号}
    ```
7. **上传镜像**：首先我们要完成上文提到的[Docker 登陆](./#docker-登陆)步骤，然后记住你的用户名，把你想上传的镜像通过 [`docker tag`](https://docs.docker.com/reference/cli/docker/image/tag/) 修改为 `{你的用户名}/{镜像名称}:{版本号}`，最后直接使用 [`docker push`](https://docs.docker.com/reference/cli/docker/image/push/) 将镜像上传到 Docker Hub 上，然后我们就可以在我们主页下面看到了！
    ```bash
    docker tag {已有的镜像名称}:{版本号} {你的用户名}/{镜像名称}:{版本号}
    docker push {你的用户名}/{镜像名称}:{版本号}
    ```
8. **保存镜像/打开镜像**：想要把镜像保存为文件，拷贝到其他电脑上使用，使用 [`docker save`](https://docs.docker.com/reference/cli/docker/image/save/) 将镜像导出为 tar 文件，再通过 `zstd` 进行压缩，使用 [`docker load`](https://docs.docker.com/reference/cli/docker/image/load/) 来加载这个镜像
    ```bash
    docker save {已有的镜像名称}:{版本号} | zstd -o {保存的文件名}.tar.zst  # 保存并压缩（最快速的高效压缩方法）
    docker save {已有的镜像名称}:{版本号} | xz -9 --extreme -T0 > {保存的文件名}.tar.xz  # 保存并压缩（压缩率更高但更慢的方法，用于归档）
    docker load -i {保存的文件名}.tar.zst  # 加载镜像
    ```

### 一个样例

我们就基于 `Ubuntu 18.04`，在其上面安装可视化 `xclock`（一个动态钟表）为例，将上述流程实践一波（我的 Docker Hub 用户名为 [wtyyy](https://hub.docker.com/repositories/wtyyy)）：
```bash
# 1. 下拉镜像
docker pull ubuntu:18.04  # 从 Docker Hub 上下拉一个 Ubuntu 18.04
docker images  # 查看当前已有镜像
# 2. 打开镜像
docker run -it ubuntu:18.04  # 进入容器
# 3. 修改容器
apt update  # 更新包（容器中）
apt install -y x11-apps  # 下载包（容器中）
exit  # 退出容器（容器中）
# 4. 更新镜像
docker ps -a  # 根据更新时间，找到当前容器编号/名称
# 我的容器ID为 4c0479d170f7，名称为 adoring_chaplygin
# 通过ID更新
docker commit 4c0 demo:v1  # ID前三个就可以
# 或通过名称更新
docker commit adoring_chaplygin demo:v1
# *. 重新测试镜像，是否可以可视化
xhost +local:root  # 开放xhost访问全线，使docker可以在主机的X客户端上可视化
docker run -it -e "DISPLAY" -v "/tmp/.X11-unix:/tmp/.X11-unix:rw" demo:v1  # 通过加入这两个参数就可以在X11上进行可视化了
xclock  # 启动可视化时钟（容器中）
exit  # 退出容器（容器中）
# 5. 删除不用的镜像
docker ps -a  # 查看当前的容器
docker rm -f $(docker ps -a -q)  # 关闭全部容器
docker images  # 查看不用的镜像名称
docker rmi ubuntu:18.04  # 删除镜像
# 6. 上传镜像
docker tag demo:v1 wtyyy/demo:v1  # 重命名下镜像名称，准备上传
docker push wtyyy/demo:v1  # 上传镜像到 Docker Hub
# 7. 保存镜像并压缩为zst
docker save wtyyy/demo:v1 | zstd -o wtyyy_demo_v1.tar.zst
# 8. 其他电脑上加载镜像（本机加载会将之前相同镜像名的设置为None）
docker load -i wtyyy_demo_v1.tar.zst  # 加载镜像
```
上图为钟表可视化效果，下图为在 Docker Hub 上我们刚上传的镜像：
![可视化钟表](/figures/tools/docker可视化钟表.png)
![查看上传结果](/figures/tools/dockerhub查看上传结果.png)

## Nvidia显卡渲染

如果需要使用Nvidia驱动对X11进行渲染，需要安装`nvidia-container-toolkit`，有如下两种安装方法：
- 官网 https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html
- 镜像 https://mirrors.ustc.edu.cn/help/libnvidia-container.html

安装完成后需要配置 Docker runtime，执行如下命令：
```bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

验证是否安装成功
```bash
docker info | grep -i runtime
```

应该能看到，下面的输出，说明安装成功了：
```
Runtimes: io.containerd.runc.v2 nvidia runc
Default Runtime: runc
```

安装完成后，可以使用`docker pull`下拉镜像:
- [docker - nvidia/cuda](https://hub.docker.com/r/nvidia/cuda)官方镜像
- 或者用我修改的镜像[docker - wtyyy/base-cuda](https://hub.docker.com/repository/docker/wtyyy/base-cuda/)

启动nvidia在X11上渲染需要用到如下四个指令：
```bash
-e DISPLAY
--gpus all \
-e NVIDIA_DRIVER_CAPABILITIES=all \
-v "/tmp/.X11-unix:/tmp/.X11-unix" \
```
如果是独显+核显的设备需要额外加两个指令，指定使用nvidia渲染：
```bash
-e "__NV_PRIME_RENDER_OFFLOAD=1" \
-e "__GLX_VENDOR_LIBRARY_NAME=nvidia" \
```

以启动`wtyyy/base-cuda:11.8.0-ubuntu22.04`为例，先打开宿主机的X服务权限`xhost +`:
```bash
docker run -it --name ${USER} \
    -e DISPLAY \
    --gpus all \
    -e NVIDIA_DRIVER_CAPABILITIES=all \
    -e "__NV_PRIME_RENDER_OFFLOAD=1" \
    -e "__GLX_VENDOR_LIBRARY_NAME=nvidia" \
    -v "/tmp/.X11-unix:/tmp/.X11-unix" \
    --net=host \
    wtyyy/base-cuda:11.8.0-ubuntu22.04 zsh
```

启动完成后，验证当前是否使用Nvidia驱动：
- OpenGL: `apt install mesa-utils`执行`glxinfo | grep -i opengl`查看`OpenGL renderer string:`后面的内容是不是`Nvidia...`

## Dockerfile使用方法

Dockerfile 是用于构建 Docker 镜像的文件，包含了构建镜像的全部流程，不仅如此，他还能指定在启动镜像时候的默认执行命令，下面给出一个例子，完整的代码以及说明在[GitHub - dotfiles/docker/ubuntu](https://github.com/wty-yy/dotfiles/tree/master/docker/ubuntu)，这个例子主要做了这几件事：
- 精简版 Ubuntu Docker 镜像，支持 24.04 和 22.04
- zsh，预装 powerlevel10k 和常用插件
- tmux，使用仓库里的 .tmux 配置
- vim，使用 gruvbox
- 时区为 Asia/Shanghai
- 支持通过 DEFAULT_UID 和 DEFAULT_GID 指定运行用户，尤其在挂载宿主机目录时，在容器中新建文件依旧保持宿主机用户权限

具体包含如下这些指令：
- `ARG`：声明仅在构建中使用的变量
- `FROM`：指定基础镜像，后续的构建都基于这个镜像
- `ENV`：设置环境变量，容器启动后也会保留这些环境变量
- `RUN`：在构建镜像时执行的命令，通常用于安装软件包、配置环境等
- `COPY`：将文件从宿主机复制到镜像中，可以使用 `--chown` 来指定文件的所有者和用户组，使用 `--chmod` 来定文件的权限
- `USER`：指定容器运行时的用户
- `ENTRYPOINT`：指定容器启动时执行的命令，通常用于设置容器的入口点
- `WORKDIR`：指定容器内的工作目录，当执行 `ENTRYPOINT` 或 `CMD` 中的命令时，当前目录就是这个工作目录
- `CMD`：指定容器启动时的默认命令，如果在运行容器时没有指定命令，则会执行这个默认命令

{% spoiler Dockerfile完整代码 %}
```bash
ARG UBUNTU_TAG=24.04  # ARG 声明临时变量
FROM ubuntu:${UBUNTU_TAG}  # FROM 从指定的基础镜像开始构建

ARG INITIAL_USER=init-user
ARG INITIAL_UID=10000
ARG INITIAL_GID=10000
ARG DEFAULT_USER=user
ARG DEFAULT_UID=1000
ARG DEFAULT_GID=1000
ARG DEFAULT_HOME=/home/user

ENV DEBIAN_FRONTEND=noninteractive  # ENV 设置环境变量，容器启动后也会保留这些环境变量
ENV TZ=Asia/Shanghai

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        gosu \
        locales \
        sudo \
        tmux \
        tzdata \
        vim \
        zsh \
    && ln -snf "/usr/share/zoneinfo/${TZ}" /etc/localtime \
    && echo "${TZ}" > /etc/timezone \
    && locale-gen en_US.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV SHELL=/usr/bin/zsh

RUN set -eux; \
    # Remove the default "ubuntu" user if it exists
    if id -u ubuntu >/dev/null 2>&1; then \
        userdel -r ubuntu; \
    fi; \
    \
    # Check UID and GID availability
    for uid in "${INITIAL_UID}" "${DEFAULT_UID}"; do \
        if getent passwd "${uid}" >/dev/null 2>&1; then \
            echo "ERROR: UID ${uid} is already in use by $(getent passwd "${uid}" | cut -d: -f1). Aborting build."; \
            exit 1; \
        fi; \
    done; \
    for gid in "${INITIAL_GID}" "${DEFAULT_GID}"; do \
        if getent group "${gid}" >/dev/null 2>&1; then \
            echo "ERROR: GID ${gid} is already in use by $(getent group "${gid}" | cut -d: -f1). Aborting build."; \
            exit 1; \
        fi; \
    done; \
    \
    # Create the default and initial user and group
    groupadd -g "${DEFAULT_GID}" "${DEFAULT_USER}"; \
    useradd -M -u "${DEFAULT_UID}" -g "${DEFAULT_GID}" -s /usr/bin/zsh "${DEFAULT_USER}"; \
    groupadd -g "${INITIAL_GID}" "${INITIAL_USER}"; \
    useradd -m -d "${DEFAULT_HOME}" -u "${INITIAL_UID}" -g "${INITIAL_GID}" -s /usr/bin/zsh "${INITIAL_USER}"; \
    \
    # Set default user home to DEFAULT_HOME (DEFAULT_HOME own is INITIAL_USER, new files are DEFAULT_USER)
    usermod -d "${DEFAULT_HOME}" "${DEFAULT_USER}"; \
    usermod -aG "${INITIAL_USER}" "${DEFAULT_USER}"; \
    \
    # Set sudo permissions for DEFAULT_USER, with NOPASSWD
    usermod -aG sudo "${DEFAULT_USER}"; \
    printf '%s ALL=(ALL) NOPASSWD:ALL\n' "${DEFAULT_USER}" > "/etc/sudoers.d/90-${DEFAULT_USER}"; \
    chmod 0440 "/etc/sudoers.d/90-${DEFAULT_USER}"; \
    \
    # Add groups permissions
    for group in adm dialout cdrom floppy audio dip video plugdev render input tty; do \
        if getent group "$group" >/dev/null 2>&1; then \
            usermod -aG "$group" "${DEFAULT_USER}"; \
        fi; \
    done

# User configurations
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/.zshrc ${DEFAULT_HOME}/.zshrc
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/.p10k.zsh ${DEFAULT_HOME}/.p10k.zsh
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/.tmux.conf ${DEFAULT_HOME}/.tmux.conf
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/.tmux.conf.local ${DEFAULT_HOME}/.tmux.conf.local
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/.vimrc ${DEFAULT_HOME}/.vimrc
COPY --chown=${INITIAL_UID}:${INITIAL_GID} overlay/gruvbox.vim ${DEFAULT_HOME}/.vim/colors/gruvbox.vim

# Install and entrypoint script
COPY --chmod=755 overlay/setup-docker.sh /tmp/setup-docker.sh
COPY --chmod=755 overlay/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN set -eux; \
    /tmp/setup-docker.sh "${DEFAULT_HOME}"; \
    touch "${DEFAULT_HOME}/.sudo_as_admin_successful"; \
    rm -rf "${DEFAULT_HOME}/.cache" "${DEFAULT_HOME}/.zcompdump"* "${DEFAULT_HOME}/.zsh_history"; \
    chown -R "${INITIAL_UID}:${INITIAL_GID}" "${DEFAULT_HOME}"; \
    chmod -R g+rwX "${DEFAULT_HOME}"; \
    rm -f /tmp/setup-docker.sh

USER ${DEFAULT_USER}
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
WORKDIR ${DEFAULT_HOME}
CMD ["/usr/bin/zsh"]
```
{% endspoiler %}

做Dockerfile的好处是能配置一些自动启动的脚本，例如在启动时自动将用户mount的目录权限修改为指定的UID和GID，这样可以避免Docker默认使用的root权限导致本地和容器权限不一致问题，每次都需要手动`chown -R`的麻烦，并且我们还可以通过`github actions`工具来自动构建 Dockerfile 并上传到 Docker Hub 上，例子请见[Dockerfile构建](#dockerfile构建)

## 我的 Docker Hub 镜像
这里记录一些我上传到 Docker Hub 的一些常用镜像

### Dockerfile构建
- [Dockerfile - ubuntu](https://github.com/wty-yy/dotfiles/tree/master/docker/ubuntu) 对应的 [Docker Hub - wtyyy/ubuntu](https://hub.docker.com/repository/docker/wtyyy/ubuntu)
- [Dockerfile - isaaclab](https://github.com/wty-yy/dotfiles/tree/master/docker/isaaclab) 对应的 [Docker Hub - wtyyy/isaaclab](https://hub.docker.com/repository/docker/wtyyy/isaaclab)
