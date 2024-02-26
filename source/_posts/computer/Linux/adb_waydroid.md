---
title: ADB&Waydroid常用命令
hide: false
math: true
abbrlink: 65181
date: 2024-02-26 21:15:41
index\_img:
banner\_img:
category:
  - Linux
tags:
---

# adb&waydroid常用命令

> [waydroid官方参考文档](https://docs.waydro.id/)，[adb速查表](https://www.cheat-sheet.cn/post/adb-cheat-sheet/)

## adb常用命令

- `adb devices` ：列出当前连接的设别（当连接设别数目大于1个时，使用 `adb shell` 控制命令需要加入 `-s 设别号` 指定控制的设备）

- `adb connect <IP:port>`：使用 `adb` 连接当前 `ip` 对应的Android设备。例如：使用 `waydroid status` 查看IP地址，通过 `adb connect <IP>:5555` 即可连接当前Waydroid设备。也可以直接使用 `waydroid shell` 进入 `adb` 命令行窗口。

- `adb shell wm size`：显示当前屏幕分辨率。

- `adb shell wm size 486x1080`：显示当前屏幕分辨率为`486x1080`。

- `adb shell wm size reset`：重置当前屏幕分辨率。

- `adb shell pm list packages -3`：列出所有安装的第三方包。

- `adb shell screencap -p <PATH>`：屏幕截图并保存到PATH下（要求文件格式为`.png`），如果没有 `<PATH>` 则直接输出到当前终端中。

  注意：如果要保存到PC可以执行 `adb exec-out screencap -p > screen.png`（保存到当前路径下的 `screen.png` 文件中）。

- `adb shell input tap <X> <Y>`：点击屏幕上的 `(X,Y)` 像素位置。

## Waydroid常用命令

Ubuntu安装方式参考[官网](https://docs.waydro.id/usage/install-on-desktops#ubuntu-debian-and-derivatives)，虽然Waydroid使用容器实现的，但是当前并不支持容器多开（创建多个instances实例）。

- `waydroid session start`：只启动 `waydroid session` 后台运行（不显示可视化界面）。
- `waydroid session stop`：停止 `waydroid session`。
- `waydroid show-full-ui`：现实可视化界面（如果没有启动 `session` 会自动启动）
- `waydroid status`：查看 `waydroid` 当前的状态信息。
- `waydroid app install <PATH>`：安装本机上 `PATH` 对应的 `apk` 文件。

```shell
waydroid prop set persist.waydroid.width 576  # 修改屏幕宽度为 576
waydroid prop set persist.waydroid.height 1280  # 修改屏幕高度为1280
```

**设置共享文件夹**，参考[Setting up a shared folder](https://docs.waydro.id/faq/setting-up-a-shared-folder)，我尝试共享`Pictures`文件夹失败了，但是`Download`文件夹可行，Waydroid的本机存储位置为 `~/.local/share/waydroid/data/media/0`，可以使用 `sudo ls ~/.local/share/waydroid/data/media/0`，但是不能 `cd` 到该 `media` 路径下：

````shell
sudo mount --bind ~/Downloads ~/.local/share/waydroid/data/media/0/Download  # 将前面一个路径绑定到后面一个路径上，即后面路径相当于访问前面的路径，然后就可以在Wayland中的文件管理器中查看到PC的文件了
````

> 注：如此共享的文件只是单向可用，Waydroid是没有写文件的权限的，而且**Waydroid无法使用 `adb screenrecord` 进行屏幕录制**，so bad...

### Waydroid script

[Waydroid script](https://github.com/casualsnek/waydroid_script) 是一个python脚本程序，可以为你的Waydroid加入新的插件，例如使用 `libhoudini` 安装 `arm` 架构的APP（大部分国产软件s）。

使用方法：从github上clone或者下载zip文件，解压后使用一个python环境（也可以使用系统默认的python，不过最好创建一个环境），使用

```shell
cd waydroid-script
python intall -r requirements.py
where python  # 查看环境的python位置
sudo your/python/path/bin/python main.py
```

选择 `Android11 -> Install -> 用空格选择你需要安装的APP`（安装了 `libhoudini` 后就可以安装 `arm` 架构的APP）。

