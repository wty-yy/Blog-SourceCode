---
title: Ubuntu 22.04 设置休眠选项
hide: false
math: true
abbrlink: 51985
date: 2023-04-04 14:51:25
index\_img:
banner\_img:
category:
 - Linux
tags:
---

## Ubuntu设置休眠选项

我的笔记本是Yoga14s，经常发现和上笔记本后进入待机模式耗电非常高，而且启动速度很慢，考虑使用休眠模式代替。休眠模式主要思路是将内存中的数据保存到磁盘上的一个叫交换空间“swap area”的位置，然后关闭电脑，下次启动就从交换空间中提取数据到内存中启动; 而待机模式是保证对内存的供电，仍然耗电。

### 1. 关闭Secure Boot

**关键**：首先要在BIOS中(按F12进入)找到安全启动(Secure Boot)，将其关闭（参考[How to enable the hibernate option in Ubuntu 20.04?](https://askubuntu.com/a/1241902)第一个回答中的评论），然后执行 `cat /sys/power/state`，应该会返回 `freeze mem disk`，这样就可以了。

接下来参考 [How to Enable Hibernate Function in Ubuntu 22.04 LTS](https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/) 的方法：

### 2. 配置并修改swapfile

修改swapfile的大小，如果默认装系统的设置，swapfile大小只有2Gb，远小于内存大小，最好保证swapfile空间大小比内存大小大，我的内存大小为 16Gb (使用 `free -hm` 查看)

```sh
sudo swapoff /swapfile  # 首先关闭当前的swapfile
sudo dd if=/dev/zero of=/swapfile count=16384 bs=1MiB  # 按Mb计算需要的空间大小
sudo chmod 600 /swapfile  # 设置权限为可读和写
sudo mkswap /swapfile  # 设置为swap空间
sudo swapon /swapfile  # 启动swap空间
```

检查是否开机自动启动swap空间：

```sh
$ cat /etc/fstab |grep swap  # 检查文件/etc/fstab中是否有关于swapfile启动的内容，如果有下面这行就说明启动了
/swapfile                                 none            swap    sw              0       0
```

如果没有上面的内容，则执行下面代码，从而加入swap启动。
```sh
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab  # 这句话是开机自动启动swap空间，如果
```

### 3. 寻找UUid和Offset

找到swap空间的 UUID（磁盘唯一编码） 和 Offset 量（磁盘偏移量），首先使用命令 `blkid` 返回磁盘UUID值，例如我的是 `d5cc2a80-31ca-43f3-9899-5d966f31598a`
```sh
$ blkid
/dev/nvme0n1p2: UUID="d5cc2a80-31ca-43f3-9899-5d966f31598a" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="2d6c34a5-6061-4a69-886a-070eb4f5be04"
```

再通过命令 `sudo filefrag -v /swapfile` 找到 `/swapfile` 的offset值（**找第一行第四列值**，例如我的是 `51759104`）
![swapfile磁盘偏移量](/figures/My_Ubuntu.assets/swapfile磁盘偏移量.png)

### 4. 配置内核文件

通过内核配置文件，修改swap空间位置：使用Ubuntu自带的编辑器打开配置文件 `sudo gedit /etc/default/grub`，在 `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash ` 的后面加上 **resume=UUID=xxx resume_offset=xxx**，其中UUid后面填写你的磁盘UUid值、resume_offset后面填写offset值，如下图所示：
![内核配置swap空间位置](/figures/My_Ubuntu.assets/内核配置swap空间位置.png)

最后更新配置设置：

```sh
sudo update-grub
```

重启电脑，执行 `sudo pm-hibernate`，然后看电脑电源是否关闭，如果关闭则说明成功进入休眠模式，重新启动应该会恢复原有应用；如果一段时间后又自动启动，说明没能进入休眠模式，使用 `sudo dmesg | grep PM` 命令查看具体原因（这两段测试命令来源 [CSDN - 解决ubuntu20.10 休眠耗电问题](https://blog.csdn.net/u013810296/article/details/109689738)），检查上述设置UUid和Offset值是否设置正确（如果还是不行，参考 [How to Enable Hibernate Function in Ubuntu 22.04 LTS 中 Regenerate initramfs](https://ubuntuhandbook.org/index.php/2021/08/enable-hibernate-ubuntu-21-10/) 的方法，到这一步我就已经可以用了）

### 5. 安装休眠按钮插件

通过插件实现在关机栏中可选择休眠模式：修改文件 `sudo gedit /etc/polkit-1/localauthority/50-local.d/com.ubuntu.enable-hibernate.pkla` 加入一下配置

```vim
[Re-enable hibernate by default in upower]
Identity=unix-user:*
Action=org.freedesktop.upower.hibernate
ResultActive=yes

[Re-enable hibernate by default in logind]
Identity=unix-user:*
Action=org.freedesktop.login1.hibernate;org.freedesktop.login1.handle-hibernate-key;org.freedesktop.login1;org.freedesktop.login1.hibernate-multiple-sessions;org.freedesktop.login1.hibernate-ignore-inhibit
ResultActive=yes
```

最后从 `Gnome extension` （Gnome extension安装方法见上文 [主题自定义](./#主题自定义)）中安装插件 [Hibernate Status Button](https://extensions.gnome.org/extension/755/hibernate-status-button/)，就能在关机选项中看到休眠选项了：
![休眠选项](/figures/My_Ubuntu.assets/休眠选项.png)

### 6. 设置休眠模式为默认模式

设置笔记本和盖默认为休眠：参考 [如何禁用 Ubuntu 或 Red Hat Enterprise Linux 7 的睡眠和配置盖板电源设置](https://www.dell.com/support/kbdoc/zh-cn/000179566/how-to-disable-sleep-and-configure-lid-power-settings-for-ubuntu-or-red-hat-enterprise-linux-7)，执行以下命令

```sh
systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
sudo gedit /etc/systemd/logind.conf
```

找到 `#HandleLidSwitch=suspend` 这一行，删除注释符 `#`，替换为 `HandleLidSwitch=hibernate`，如下图所示：
![修改默认和盖休眠](/figures/My_Ubuntu.assets/修改默认和盖休眠.png)

保存文件并执行命令 `systemctl restart systemd-logind` 执行修改。

