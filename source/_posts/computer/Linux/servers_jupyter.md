---
title: SSH端口转发连接服务器上的Jupyter Notebook
hide: false
math: true
abbrlink: 44423
date: 2024-06-12 12:48:06
index\_img:
banner\_img:
category:
 - Linux
tags:
---

> 参考 [CSDN - SSH 端口转发实现 Jupyter Notebook 远程连接服务器](https://blog.csdn.net/ID_AF12/article/details/120800926)

Jupyter Notebook在启动后会默认在服务器中的 `localhost:8888` 端口启动，所以我们只需要将其映射回本机即可，可以使用 ssh 中的**端口转发**实现，在使用 ssh 连接服务器前使用 `-L` 命令：
```bash
ssh -L 本地地址:[本地端口,可选]:目标地址:目标端口 用户名@你的服务器地址
```
如果你的服务器需要凭证的话，可以直接输入 `~/.ssh/config` 中服务器的Host名称
```bash
ssh -L 本地地址:[本地端口,可选]:目标地址:目标端口 服务器Host名称
```
所以我们只需要执行下述指令即可转发Jupyter Notebook端口：
```bash
ssh -L 8888:localhost:8888 服务器Host名称
```

例如我的 `~/.ssh/config` 文件中服务器配置为：
```vim
Host 4090
  HostName 10.184.17.132
  IdentityFile ~/.ssh/4090_wutianyang
  User wutianyang
  Port 22
```
使用 `ssh -L 8888:localhost:8888 4090` 即可连上服务器，进入 Conda 环境后在工作目录下执行 `jupyter notebook` 即可启动连接，在本机服务器上输入弹出的网址，例如我的是 `http://localhost:8888/tree?token=d16b54566f27b0129c0c4bdd90ec5e1c5e6e6525e3f61325` 即可在浏览器上打开服务器上的 Jupyter Notebook。

