---
title: 从零配置Ubuntu全过程
hide: false
math: true
category:
  - Linux
abbrlink: 46722
date: 2023-04-01 01:28:49
index\_img: 
banner\_img: 
tags:
---

> UPDATE: 2024.6.12.加入星火商店安装程序
> UPDATE: 2024.11.16.加入Ubuntu24.04相关内容
> UPDATE: 2025.7.9.加入[内核切换](./#内核版本修改)和[手动安装Nvidia驱动](./#nvidia驱动安装)
> UPDATE: 2025.9.11.加入自启动配置简化, [Clash for Windows图标下载地址](./#clash安装-快捷方式-自动启动), [Firefox的apt版重装](./#firefox浏览器apt版重装)
> UPDATE: 2025.10.10.加入[Nvidia驱动安装安全启动凭证](./#nvidia驱动安装)
> UPDATE: 2026.1.11.更新[Firefox安装](./#firefox浏览器apt版重装)
> UDPATE: 2026.2.7.更新[Clash安装](./#clash安装-快捷方式-自动启动)为FlClash
> UPDATE: 2026.3.4.更新[ASUS笔记本电脑集显与独显切换](./#asus笔记本电脑集显与独显切换)

# My Ubuntu

第一次安装 Ubuntu22.04 LTS 记录下安装遇到的问题和解决方法。

![Ubuntu22.04 Orchis主题桌面](/figures/My_Ubuntu.assets/Ubuntu主题桌面.png)

![Ubuntu22.04配置后效果图](/figures/My_Ubuntu.assets/Ubuntu配置后效果图.png)

当前Ubuntu已经能够完美支持微信(原生)和QQ(原生)了，文档处理使用WPS完全足够，已经达到日常办公所需的全部要求，还有更高效的代码运行速度😆（我的毕设就完全是在Ubuntu24.04上完成的）

![Ubuntu24.04配置后效果图](/figures/My_Ubuntu.assets/Ubuntu24.04.png)

刚安装好新系统后，执行 `sudo apt update && sudo apt upgrade` 先将所有的软件更新好，然后重启

**安装内容（推荐顺序安装）**：

1. 中文输入法（使用Fcitx5中的pinyin，注意如果动态链接库版本过高请使用 `aptitude` 进行适当降级，如果使用的是Ubuntu20.04是无法安装Fcitx5的，推荐使用搜狗输入法，效果也不错）
2. 主题自定义（安装 `gnome-tweaks` 和 `chrome-gnome-shell` 用于主题配置）
3. 配置终端（安装vim, git，并对git进行ssh文件配置，zsh, oh-my-zsh，配置vim，直接从我的 [dotfiles](https://github.com/wty-yy/dotfiles) 然后直接执行 `./setup.sh` ）
4. 可视化Clash界面（FlClash, CLash for Windows）
5. 安装星火商店，从而安装QQ，微信，网易云，WPS等等软件
6. 安装LaTeX（LaTeX速度是Windows上的数倍，编译多长的文件都是一秒不到）
7. 安装g++, mambaforge
8. 安装Blog配置（安装nvm，nodejs，npm，cnpm，hexo）
9. 安装TensorFlow和Jupyter，配置Jupyter主题、matplotlib字体

## Ubuntu基础知识

Linux基础路径解释和vim的基础用法可以参考Blog中的 [在服务器上配置shell - Linux基础知识](https://wty-yy.space/posts/10409/#linux%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86) 部分。

### 下载命令

#### 安装安装包
> 可以对Ubuntu安装包下载地址换源，[清华源官网](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)中方法写的非常清楚（记得备份）

Ubuntu的安装包后缀一般为 `.deb` 可以使用

```sh
sudo apt install ./package.deb  # 可能出现可视化窗口，需要通过 tab 选中 ok 按钮，然后 enter 回车
sudo dpkg -i package.deb  #  直接安装
```

Ubuntu的安装有 `apt` 和 `apt-get` 两种，查看全部安装包和卸载安装包方法如下

```sh
sudo apt list | grep fcitx  # 查看全部包含 fcitx 名称的安装包
# 推荐使用 purge 可以删除相关的无用文件
sudo apt-get purge 'fcitx*'  # 可以删除全部以 fcitx 开头的安装包，避免卸载不干净
```

如果从git上clone下来的仓库中，有脚本安装文件以 `*.sh` 结尾，需要先赋予运行权限，然后执行：

```sh
# 例如安装脚本名称为 install.sh
chmod 777 install.sh  # 赋予权限
./install.sh  # 执行安装
```

#### 下载url链接文件

下载url连接所用的命令，[stack overflow - What does "wget -O" mean?](https://stackoverflow.com/questions/9830242/what-does-wget-o-mean)。

```sh
wget URL  # 默认下到当前目录下
wget 'URL'  # 如果链接太长记得加上单引号
wget -P ~/Downloads URL  # 将文件下载到目录 ~/Downloads 中
wget -O- ~/Downloads URL | sh  # 将*.sh文件直接用sh命令进行安装
```

### Ubuntu常用路径

所有以 `.` 开头的文件名都是**隐藏文件**，要在Ubuntu的文件管理器中显示可以看下图操作：

|![显示隐藏文件](/figures/My_Ubuntu.assets/显示隐藏文件.png)| ![显示隐藏文件Ubuntu24.04](/figures/My_Ubuntu.assets/显示隐藏文件Ubuntu24.04.png)
|-|-|
|显示隐藏文件Ubuntu22.04|显示隐藏文件Ubuntu24.04|

Ubuntu中有以下的一些常用路径，便于后续找到文件位置：

- 根目录下可执行文件位于 `/bin/` 文件夹内。
- 用户安装的字体位于 `~/.local/share/fonts/` 文件夹内。
- 用户配置的搜索栏应用快捷图标位于 `~/.local/share/applications/` 文件夹内。
- 用户配置的开机自启位于 `~/.config/autostart/` 文件夹内（如果不是自定义启动文件，推荐使用tweaks设置开机启动项）。
- 安装完主题配置插件 `User Themes` 后，`~/.icons` 文件夹用于保存主题图标和鼠标图标，`~/.themes` 用于保存GNOME窗口配色。

## 前置重要配置
### 打开grub引导界面
> 在安装Ubuntu时候如果没有检测到双系统，grub引导界面会自动设置为跳过

安装开始全部安装前，我们先观察下BIOS界面过后，我们有没有看到grub界面（一个可以通过上下键选择进入不同Ubuntu版本、恢复模式、Windows(如果有)的界面）如果没有，请最好在第一次启动Ubuntu可视化界面后，先将其打开（避免安装出错都进不了恢复模式）：

先查看有没有 `/etc/default/grub` 文件，如果没有则需要手动拷贝一个（参考[Ask Ubuntu - there-was-no-etc-default-grub-file](https://askubuntu.com/a/918143)）
```bash
sudo cp /usr/share/grub/default/grub /etc/default/
```

打开文件
```bash
sudo vim /etc/default/grub
sudo gedit /etc/default/grub  # Ubuntu 22.04
sudo gnome-text-editor /etc/default/grub  # Ubuntu 24.04
```

找到如下两行修改为
```vim
# GRUB_TIMEOUT_STYLE=hidden  # 在前面加上个#注释掉
GRUB_TIMEOUT=10  # 从0改成10，表示有10秒的选择时间，否则默认进入第一个模式
```
保存退出，执行`sudo update-grub`即可。

### 暂停自动更新
由于Ubuntu会自动更新系统内核导致很多问题，例如Nvidia驱动无法识别等，所以必须关闭自动更新功能，方法如下：

按 `super` 键（win键）搜索 `Software & Updates` 找到 `Updates` 将选项修改为下图样式（所有的更新都选Never或者时间最长）
![取消全部包的自动更新](/figures/My_Ubuntu.assets/stop_auto_update.png)

### 内核版本修改
> 参考[CSDN - Ubuntu系统更换Linux内核的详细方法汇总](https://blog.csdn.net/IronmanJay/article/details/132395150)

首先查看当前的内核版本：
```bash
❯ uname -r
6.8.0-45-generic
```

查看可安装的内核版本（只推荐用generic版的内核）：
```bash
sudo apt search linux-image | grep "linux-image-.*-generic"
sudo dpkg -l | grep linux-image
```
| 查找可安装kernel | 查找当前kernel（前面带有 `ii` 就是已安装的） |
| - | - |
| ![查找可安装kernel](/figures/My_Ubuntu.assets/查找可安装kernel.png) | ![查找当前kernel](/figures/My_Ubuntu.assets/查找当前kernel.png) |

用 `apt` 安装或卸载内核：
```bash
# 安装内核（后面填上面搜索到的内核版本号）
sudo apt-get install linux-image-*.*.*-*-generic
sudo apt-get install linux-headers-*.*.*-*-generic
# 卸载内核
sudo apt-get install linux-image-*.*.*-*-generic
sudo apt-get install linux-headers-*.*.*-*-generic
```

安装完成后，重启，在grub引导界面中选择第二个 `Advanced options for Ubuntu`，就可以看到刚才安装的内核了，进入即可。

### 指定启动内核版本启动
> 参考 [Ask Ubuntu - How can I boot with an older kernel version?](https://askubuntu.com/questions/82140/how-can-i-boot-with-an-older-kernel-version)

记下每次在 `Advanced options for Ubuntu` 中想要进入的内核属于列表中的第几个（从0开始），或者直接查看：
```bash
sudo grub-mkconfig | grep -iE "menuentry 'Ubuntu, with Linux" | awk '{print i++ " : "$1, $2, $3, $4, $5, $6, $7}'

0 : menuentry 'Ubuntu, with Linux 6.8.0-45-generic' --class ubuntu
1 : menuentry 'Ubuntu, with Linux 6.8.0-45-generic (recovery mode)'
2 : menuentry 'Ubuntu, with Linux 6.8.0-38-generic' --class ubuntu
3 : menuentry 'Ubuntu, with Linux 6.8.0-38-generic (recovery mode)'
```
例如想要进入第二个内核终端，则编辑 `/etc/default/grub` 文件修改 `GRUB_DEFAULT="1>2"`，更新 `sudo update-grub`，重启后就会发现默认的光标就处于我们想要的内核上面啦，默认就可以进入想要的内核了！

### Nvidia驱动安装
> 老方法：Nvidia驱动安装方法：[CSDN-【ubunbu 22.04】 手把手教你安装nvidia驱动](https://blog.csdn.net/huiyoooo/article/details/128015155)
> 2024.6.12 更新：安装了很多次Nvidia驱动，推荐方法还是按照 Ubuntu 官方给出的[安装方法](https://ubuntu.com/server/docs/nvidia-drivers-installation)，使用 `sudo ubuntu-drivers list` 查看建议安装的 Nvidia 驱动，`sudo ubuntu-drivers install nvidia:535` 安装指定的显卡版本，重启即可。
> 2025.7.9. 更新：不推荐再用 `ubuntu-drivers` 来安装Nvidia驱动，因为会自动更新
> 2025.10.10. 更新：在bios安全启动功能后，通过MOK将Nvidia显卡驱动加入安全启动

**Nvidia驱动和内核版本强挂钩！** 如果修改了内核版本，那么Nvidia驱动就要重装，下面安装会**直接安装到当前启动的内核**上，请先启动你以后想要长期用的内核版本！

如果有Nvidia显卡则需要安装驱动，官方的 `ubuntu-drivers` 安装方法会导致将当前的**内核会固定前两个版本号自动更新到最新版本上**（例如，当前启动的是 `6.8.0-42`，但是安装驱动时会自动安装 `6.8.0-62`），但是自动安装的驱动又不完整（例如，无法打开U盘）

所以还是推荐从 [Nvidia-Driver](https://www.nvidia.com/en-us/drivers/unix/) 上搜索你的显卡型号，直接下载 `*.run` 文件，安装方法如下：（安全启动方法参考Gemini 2.5 Pro）

> 推荐先执行前两步，如果不执行直接第3步开始安装也会要求禁用nouveau，但是可能会发生报错，不稳定，因此推荐手动禁用nouveau
1. 创建Nouveau黑名单文件，禁用开源的显卡驱动，使用Nvidia的专有驱动，创建文件 `sudo vim /etc/modprobe.d/blacklist-nouveau.conf`，编辑内容
    ```conf
    blacklist nouveau
    options nouveau modeset=0
    ```
    保存并退出，更新内核启动镜像 `sudo update-initramfs -u`，重启电脑 `sudo reboot`，检查是否成功禁用Nouveau
    ```bash
    lsmod | grep nouveau  # 没有任何输出就是成功禁用
    ```
2. 停用图形界面服务：默认的Ubuntu界面为gdm3，执行
    ```bash
    sudo systemctl stop gdm3
    # 或者更一般的方法，如果使用GDM, LightDM, SDDM等所有图形化界面
    sudo systemctl isolate multi-user.target
    ```
3. 开始安装：
    ```bash
    sudo apt install g++ gcc make  # 先安装好编译器
    chmod +x NVIDIA-Linux-*.run
    sudo ./NVIDIA-Linux-*.run  # 开始安装驱动文件
    ```
4. 安装中一些其他选项："License版本"选"MIT"（一定选这个，不然RTX 6000就无法使用，好像开源版的更新比闭源更好了），"建议用Ubuntu的apt安装"选continue install, "Nvidia-32"选No，"X11配置文件"选Yes，"注册到DKMS"选Yes（在内核更新后自动重新编译）
5. 如果你和我一样希望在安全模式下启动Nvidia驱动（如果不需要可以在bios中关闭安全启动），就需要额外进行一些配置：
    1. 安装过程中会提示启用了安全启动，是否创建内核模块签名，选 Sign the kernel module
    2. 已使用新密钥签名，是否删除私有签名，选Yes
    3. 最后一步会给出签名的相关信息，包含一个存储路径`/usr/share/nvidia/nvidia-*.der`（记住这个路径），和一串字符，代表签名的凭证，选Yes
    4. 完成安装重启 `sudo reboot`，可能进不去MOK界面（在bios图标过后会自动进入一个蓝色界面），继续执行下面方法
    5. 导入密钥`sudo mokutil --import /usr/share/nvidia/nvidia-*.der`（这个就是第3步的签名路径），输入两次自定义的密码，重启
    6. 完成第5步后重启，应该能稳定触发MOK管理程序，选择`Enroll MOK`（注册MOK），接下来选择`Continue`就会提示输入第5步自定义的密码，输入密码后回车，继续启动进入系统
    7. 测试`nvidia-smi`命令是否可用，返回显卡信息就安装完毕了

> 如果要卸载安装直接运行`sudo nvidia-uninstall`命令即可
> 如果安装出现问题，找生成的 `/var/log/nvidia*.log` 日志文件查看 error 内容，网上搜索解决问题

**Ubuntu20,22的经典安装问题**：GCC版本问题，在Ubuntu20或22上，可能需要更新到GCC-12，才能安装570的驱动
{% spoiler Nvidia 535以上版本的驱动gcc编译过程报错 %}
如果在驱动安装编译过程中发生报错，535 版本的驱动可能报错，这是 Ubuntu 22.04 的默认 gcc 版本为 11，而驱动的编译版本为 `gcc-12`，我们需要去将其修改为 `gcc-12`：
```bash
sudo apt install gcc-12  # 安装gcc-12
cd /usr/bin
ls -ls | grep gcc  # 看到 gcc -> gcc-11, 说明当前使用的是 gcc-11
sudo ln -sf gcc-12 gcc  # 重新连接到 gcc-12
sudo apt install nvidia-driver-535  # 重新安装驱动
```
{% endspoiler %}


## 软件安装

### Firefox浏览器apt版重装
如果你打算继续使用Firefox（后续主题自定义会用到Firefox gnome extension），则一定要先卸载默认安装的，因为其使用的snap安装存在很多兼容性问题，安装方法参考 [How to install Firefox as a traditional deb package (without snap) in Ubuntu 22.04 or later versions?](https://askubuntu.com/a/1404401)，这里给出清华源安装，避免`add-apt-repository`无法连接的问题

添加官方APT源
```bash
sudo add-apt-repository ppa:mozillateam/ppa
```

---

如果添加不上，手动添加：
```bash
sudo install -d -m 0755 /etc/apt/keyrings
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null
gpg -n -q --import --import-options import-show /etc/apt/keyrings/packages.mozilla.org.asc | awk '/pub/{getline; gsub(/^ +| +$/,""); if($0 == "35BAA0B33E9EB396F59CA838C0BA5CE6DC6315A3") print "\nThe key fingerprint matches ("$0").\n"; else print "\nVerification failed: the fingerprint ("$0") does not match the expected one.\n"}'
```

编辑`sudo vim /etc/apt/sources.list`加入
```bash
deb [arch=arm64 signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://mirrors.tuna.tsinghua.edu.cn/mozilla/apt mozilla main
```

---

运行以下命令修改 apt 版本的 Firefox 优先于 snap 版本
```bash
echo '
Package: *
Pin: release a=mozilla
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla-firefox
```

卸载snap版Firefox
```bash
sudo snap remove firefox
```

{% spoiler 点击显/隐 snap卸载报错解决方法 %}
如果snap卸载报错：
```bash
error: cannot perform the following tasks:
- Remove data for snap "firefox" (1943) (unlinkat /var/snap/firefox/common/host-hunspell/en_ZA.dic: read-only file system)
```

删除以下文件，便于GNOME扩展可以直接使用
```bash
sudo rm /etc/apparmor.d/usr.bin.firefox
sudo rm /etc/apparmor.d/local/usr.bin.firefox
```

停止hunspell服务并重新尝试卸载
```bash
sudo systemctl stop var-snap-firefox-common-host\\x2dhunspell.mount
sudo systemctl disable var-snap-firefox-common-host\\x2dhunspell.mount
sudo snap remove firefox
```
{% endspoiler %}

安装apt版firefox，可以从下载源看出是apt还是snap版的
```bash
sudo apt update
sudo apt install firefox
```

最后为避免自动更新导致snap版重装，执行以下命令
```bash
echo 'Unattended-Upgrade::Allowed-Origins:: "LP-PPA-mozillateam:${distro_codename}";' | sudo tee /etc/apt/apt.conf.d/51unattended-upgrades-firefox
```

### 安装中文输入法

常用有两种输入法：**Fcitx, IBus**

使用了Fcitx4和IBus输入法后，最终选择了比较新的Fcitx5，输入非常流畅，比较推荐使用，安装教程参考 [知乎 - Ubuntu22.04安装Fcitx5中文输入法（详细）](https://zhuanlan.zhihu.com/p/508797663)。

环境变量配置（参考[知乎 - 开心的使用fcitx5进行输入](https://zhuanlan.zhihu.com/p/341637818)）：
1. `~/.xprofile` 中加入如下信息（没有文件则进行创建，用于 wayland 的环境变量配置）
```vim
export XIM="fcitx"
export GTK_IM_MODULE=wayland  # for wayland
# export GTK_IM_MODULE=fcitx  # for X11
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```
2. `~/.pam_environment` 中加入如下信息（没有文件则进行创建）
```vim
GTK_IM_MODULE DEFAULT=wayland  # for wayland
# GTK_IM_MODULE DEFAULT=fcitx  # for X11
QT_IM_MODULE  DEFAULT=fcitx
XMODIFIERS    DEFAULT=\@im=fcitx
SDL_IM_MODULE DEFAULT=fcitx
```

最后是外观修改，可以在下文[主题自定义](./#主题自定义)中更新完FireFox和安装完 `chrome-gnome-shell` 之后，安装 [Input Method Panel](https://extensions.gnome.org/extension/261/kimpanel/)，即可修改输入法颜色，最好的是还能修改字体大小，非常好用。

> 如果无法安装Fcitx5可以使用搜狗输入法，效果也不错，可以自定义外观，在输入的文本框中右键设置即可对其进行配置。[搜狗输入法-官方下载及安装教程](https://shurufa.sogou.com/linux?r=pinyin)

关键！！！：如果你之前更新过Ubuntu，就会导致安装过程中提示依赖包确实，这时候就需要使用 `aptitude` 对包进行降级（不推荐对主用机进行频繁升级）：

```sh
sudo apt install aptitude
sudo aptitude install fcitx5-chinese-addons  # 例如我之前无法安装fcitx5-chinese-addons
# 首先它会向你介绍需要哪些安装报，主要看remove，install，downgrade哪些包，如果remove的包中有相关的依赖包，例如包含fcitx名称的，就继续按`n`然后回车，让它给你更多的选择，由于之前升级了包，所以主要看是否有之前包版本进行了downgrade，如果有，则按`y`然后回车进行安装。反复多试几次就能装上。
```

使用Fcitx4输入法可以安装搜狗输入法，但是比较老，不推荐使用，参考 [CSDN - Ubuntu 22.04安装搜狗输入法](https://blog.csdn.net/mr_sudo/article/details/124874239)。

IBus 输入法会经常卡顿，不推荐使用，以下是以前安装IBus的方法，参考 [知乎 - 安装ibus中文输入法(Linux/Ubuntu)](https://zhuanlan.zhihu.com/p/132558860)。

{% spoiler "之前安装IBus的详细过程" %}
```sh
sudo apt install ibus ibus-clutter ibus-gtk ibus-gtk3 ibus-qt4  # 安装ibus框架
im-config -s ibus  # 切换ibus框架
sudo apt install ibus-pinyin  # 安装拼音
```

打开Settings - Region & Language - Manage Installed Languages，在Language Support中设置默认的输入法为 `IBus`。

![选择IBus作为默认输入法](/figures/My_Ubuntu.assets/选择IBus作为默认输入法.png)

重启后，再打开Settings - Keyboard

![设置输入法](/figures/My_Ubuntu.assets/设置输入法.png)

![设置输入法１](/figures/My_Ubuntu.assets/设置输入法１.png)

然后就可以通过 `super + space`　（Ｕbuntu中 `super` 键就是 `win` 键）切换输入法，进行中文输入。以下是对输入法的一些配置，不要开太多功能，会使得性能下降。可以打开部分混淆词替换和词典。

![配置输入法](/figures/My_Ubuntu.assets/配置输入法１.png)
{% endspoiler %}

### 主题自定义

安装插件管理器

```sh
sudo apt install gnome-tweaks  # gnome管理器
sudo apt install chrome-gnome-shell  # 插件管理器
sudo apt install gnome-shell-extensions  # 安装extension，可以配置安装的插件
```

安装完后打开网页(https://extensions.gnome.org/)，点击上面信任插件安装，最后效果如下：

这里如果发现Firefox无法打开网站，推荐先用上述[Firefox的apt版重装](./#firefox浏览器apt版重装)，再下载Firefox插件 [Firefox addon - GNOME Shell](https://addons.mozilla.org/en-US/firefox/addon/gnome-shell-integration/) 即可直接而使用。

![FireFox浏览器管理插件](/figures/My_Ubuntu.assets/火狐浏览器管理插件.png)

需要先在 extension manager 中安装 `User Themes`，才能进一步进行下述操作，安装主题可参考 [Give Your GNOME A Fresh And Elegant Look With Orchis Theme 2022 |  Ubuntu 22.04 Customization](https://www.youtube.com/watch?v=4yA9IAY9pJU)。

> 注意：Ubuntu24.04可能无法在菜单栏中找到Extensions管理插件，但是我们可以直接在网址(https://extensions.gnome.org/)的上方点击`Installed extensions`，找到我们想要修改配置的插件，点击右侧的小齿轮按钮即可打开对应的配置菜单。

主题配置可以从 [gnome look](https://www.gnome-look.org/)(一个开源的配置gnome外观的网站) 中选择自己喜欢的配置，我的选择有以下三个，修改文件的方式均是在tweaks - Appearance中进行修改：

![tweaks外观配置](/figures/My_Ubuntu.assets/tweaks外观配置.png)

1. 窗口外观：[Orchis gtk theme](https://www.pling.com/s/Gnome/p/1357889)，使用方法，将文件解压后，放到 `~/.themes` 文件夹下。

2. 图标：[Candy icons](https://www.gnome-look.org/p/1305251)，使用方法，将文件解压后，然后放到 `~/.icons` 文件夹下。

{% spoiler 鼠标图标修改方法 %}
3. 鼠标：由于原版鼠标大小太小，我是从[GitHub -  capitaine-cursors](https://github.com/keeferrourke/capitaine-cursors) 上下载的，然后生成的多种大小的尺寸，最后拷贝到 `~/.icons` 文件夹中，并在tweaks中选择该鼠标外观。

   ```sh
   # 根据GitHub网站给出的设置方法，先安装生成器，然后生成较大的图标，生成完的图标位于dist下
   sudo apt install inkscape x11-apps
   ./build.sh -p unix -t dark -d hd
   mv ./dist/dark ~/.icons/capitaine-dark-hd
   ```

最后根据 [How to change mouse pointer size and appearance in GNOME (18.04)?](https://askubuntu.com/questions/1158191/how-to-change-mouse-pointer-size-and-appearance-in-gnome-18-04) 中的方法，下载dconf-editor，定位到配置文件 `org/gnome/desktop/interface/cursor-size` 中修改鼠标大小，我最后设置的为30。

   ```sh
   sudo apt install dconf-editor
   ```

   ![使用dconf-editor修改鼠标大小](/figures/My_Ubuntu.assets/鼠标大小修改.png)
{% endspoiler %}

**好用的插件**

1. [Input Method Panel](https://extensions.gnome.org/extension/261/kimpanel/)：在输入法中提到，用于修改输入法字体大小并与主题颜色相配。
2. [Dash to Dock (支持Ubuntu 24.04)](https://extensions.gnome.org/extension/307/dash-to-dock/)，[Dash to Dock for COSMIC (old)](https://extensions.gnome.org/extension/5004/dash-to-dock-for-cosmic/)：用来配置边框栏。([解决ubuntu使用Dash to dock后休眠出现重影两个dock](https://blog.csdn.net/qq_26095375/article/details/120010167)，方法很简单删除gnome默认的ubuntu-dock即可 `sudo apt remove gnome-shell-extension-ubuntu-dock`)
3. [Blur my Shell](https://extensions.gnome.org/extension/3193/blur-my-shell/)：用于锁屏有背景雾化效果。
4. [OpenWeather Refined (支持Ubuntu 24.04](https://extensions.gnome.org/extension/6655/openweather/), [OpenWeather (old)](https://extensions.gnome.org/extension/750/openweather/)：在上方显示天气和温度。

### 配置终端

首先安装vim, git，并将vim的粘贴板和系统的绑定：

> 注：安装插件 `vim-gtk(3)` 之后，就可以通过 `+` 这个寄存器和系统粘贴版共享数据了，使用方法和其他寄存器类似 `" + y` 拷贝， `" + p` 粘贴。
> 由于按 + 号蛮复杂的，所以可以直接将二者绑定在一起，如果在删除或拷贝某些内容后，需要重新调用系统剪切板，可以用 `" + p` 进行粘贴。
> 另一种很好的方法是将剪切板帮顶为 `; y` 这样也非常方便。

```sh
sudo apt install vim git
sudo apt install vim-gtk  # 将vim和剪切板绑定的软件
sudo apt install vim-gtk3  # Ubuntu24.04安装包的名称变了
```

{% spoiler （可选）将系统剪切板与vim绑定 %}
在 `.vimrc` 中加入配置
```vim
" 将系统剪切板和vim绑定在一起
set clipboard=unnamedplus

" 或者设置复制命令为 `; y`
map ;y "+y
```
{% endspoiler %}

并设置git的SSH key并上传到自己的GitHub上：

```sh
ssh-keygen -t rsa -b 4096  # 生成ssh密钥
vim ~/.ssh/id_rsa.pub  # 复制内部的全部文字，拷贝到Settings - SSH and GPG keys - New SSH key粘贴进去
```

保存GitHub登陆密码，由于现在GitHub使用token进行登陆，为了避免每次都要拷贝，可以只输入一次，然后设置git存储下来，以后就不用再找了：

```sh
git config --global credential.helper store  # 设置为存储密码
# 在下次要求输入密码时，从Settings - Developer settings(最下面) - Personal access tokens - Tokens(classic) - Generate new token - Generate new token(classic) 然后全部选中（可以选择永久时长的），最后生成，拷贝给出的token,输入到shell中登陆，以后就再也不用输入u密码了
```

下载zsh和oh-my-zsh，使用国内的镜像，国外的可能无法下载下来：

```sh
sudo apt install zsh
# 国内下载并安装链接
sh -c "$(wget -O- https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
# 国外下载并安装链接
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

可以直接从[我的dotfiles](https://github.com/wty-yy/dotfiles)中配置zsh，oh-my-zsh，vim，介绍内容已经写的非常详细了，有一键安装脚本。

### Clash安装、快捷方式、自动启动

{% spoiler "之前安装Clash for Windows方法" %}
**Clash科学上网**：我使用的是 Clash for windows 也就是可视化的Clash，下载链接 [Github - clashdownload](https://github.com/clashdownload/Clash_for_Windows/releases)，参考教程：[Linux/ubuntu下实现科学上网使用 clash for windows 详细步骤](https://www.cfmem.com/2021/09/linux-clash-for-windows-vpnv2ray.html)，对应的YouTube教程：https://www.youtube.com/watch?v=pTlso8m_iRk&t=314s

新的自启动方法：（前提先要完成下面的自定义菜单，将Clash加入菜单快捷方式后）安装完上述的 `gnome-tweaks` 后，打开 `tweaks` 找到左侧 `Startup Applications`，点击 `+` 号添加菜单快捷方式到自启动中。
![tweaks中设置自启动](/figures/My_Ubuntu.assets/tweaks_autostart.png)

还有一个无需tweaks的自启动方法, 只需将下文创建好的`*.desktop`移动到`~/.config/autostart/`文件夹下即可（没有则创建一个）, 在startup application应用中也可以看到加入的自启动应用了

```vim
# 最简化desktop版本
[Desktop Entry]
Name=Clash
Type=Application
Exec=/home/wty/Programs/Clash/cfw --no-sandbox
```
{% endspoiler %}

**FlClash可视化版Clash**：下载连接[FlClash-releases](https://github.com/chen08209/FlClash/releases)，推荐直接下载`*.AppImage`版本可以直接启动运行：
```bash
# 例如我下载版本为FlClash-0.8.92-linux-amd64.AppImage
mv FlClash-0.8.92-linux-amd64.AppImage FlClash.AppImage
chmod +x FlClash.AppImage 
mv FlClash.AppImage ~/Programs/FlClash  # 移动到固定的位置
```

**使用方法**：分为如下几步即可完成配置
| 导入URL（左侧第三个按钮，打开配置，添加配置，URL，提交） | 代理选择（左侧第二个按钮，延迟测试，选择节点） | 仪表盘（打开系统代理，按右下角启动按钮） |
| --- | --- | --- |
| ![flclash step1](/figures/My_Ubuntu.assets/flclash/flclash_step1.png) | ![flclash step2](/figures/My_Ubuntu.assets/flclash/flclash_step2.png) | ![flclash step3](/figures/My_Ubuntu.assets/flclash/flclash_step3.png) |

**创建快捷方式**：下载[FlClash图标](/figures/My_Ubuntu.assets/flclash/flclash.png)移动到`~/Pictures/icons`路径下，直接执行下面的指令即可
```bash
cat > ~/.local/share/applications/flclash.desktop <<EOF
[Desktop Entry]
Type = Application
Name = FlClash
Exec = ${HOME}/Programs/FlClash/FlClash.AppImage
Icon = ${HOME}/Pictures/icons/flclash.png
EOF
```

**创建开机自启**：直接复制上述快捷方式到启动启动文件夹即可：`cp ~/.local/share/applications/flclash.desktop /home/yy/.config/autostart`

#### 自定义菜单

参考YouTube教程：[How to add appimage to Linux menu](https://www.youtube.com/watch?v=gdYp2d_p8T0)，网页教程来自 [archLinux Desktop entries](https://wiki.archlinux.org/title/desktop_entries)，以创建 `clash` 的快捷方式为例：

```sh
cd ~/.local/share/applications/  # 该文件夹存储 .desktop 后缀的文件，该文件的格式如网站中所描述，下面是一个例子
vim clash.desktop
```

```sh
[Desktop Entry]
# 文件类型
Type = Application
# 文件名称，用于搜索
Name = Clash
# 文件的可执行文件绝对路径
Exec = /home/wty/Programs/Clash/cfw --no-sandbox
# 可选项，文件图标，从网上下载下来即可
Icon = /home/wty/Pictures/icons/clash.png
```

> 这里给出我的[Clash图标链接](/figures/My_Ubuntu.assets/clash_icon.png)

```sh
# 使用下面代码检查正确性
desktop-file-validate clash.desktop
# 保存文件后，输入以下命令刷新菜单，完成配置
update-desktop-database ~/.local/share/applications
```

![自定义菜单效果图](/figures/My_Ubuntu.assets/自定义菜单效果图.png)

### 星火商店
星火商店是一款国产开源软件安装平台，可以非常方便地安装：QQ, 微信, 网易云, WPS, VSCode。

2024.06.12 更新：后来才发现[星火应用商店](https://www.spark-app.store/)这个国产的好东西，我在 Ubuntu 22.04 和 Ubuntu 24.04 上都进行了测试，如下安装方法没有问题，首先到[gitee - 星火应用商店 Spark-Store](https://www.spark-app.store/download_latest)上下载最新的 `*_amd64.deb`：
```bash
sudo apt install *_amd64.deb  # 可能出现报错
```
如果上述命令出现报错，我们记录下缺的是什么包，例如我的是`dpkg-dev`，一般是其他包的版本过高导致的我们又需要`aptitude`对其他包进行降级：
```bash
sudo apt install aptitude
sudo aptitude install [你缺的包]
# 我们看返回的介绍信息, 一直按n回车, 直到出现downgrade并安装我们要装的包, 再按y回车即可
```
安装完成缺失的包后，我们再用`sudo apt install *_amd64.deb`安装星火商店就能成功了！

安装完毕后：在菜单中打开 spark-store，搜索 QQ, WeChat, 网易云直接安装即可。

{% spoiler "之前分别安装VSCode, QQ, WeChat, 网易云的详细过程" %}
**VSCode**安装参考：[Ubuntu 20.04 正确安装支持中文输入的 VS Code](https://cyfeng.science/2021/05/20/vs-code-chinese-input/)，不要使用snap方法下载的VSCode，不然无法输入中文。

```sh
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt update && sudo apt install code
```

**新版QQ**：https://im.qq.com/linuxqq/index.shtml

**微信**：使用windows移植版本deepin-wine：https://github.com/zq1997/deepin-wine

```sh
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.deepin
# 如无法发送照片
sudo apt install libjpeg62:i386
# 然后在.zshrc中加入wechat的快捷命令，便于直接打开，或者类似下面clash的方式创建快捷方式
alias wechat=/opt/apps/com.qq.weixin.deepin/files/run.sh
```

> 微信分辨率太小解决方法：[Ubuntu22 安装微信后程序界面、字体和托盘区图标都特别小](https://github.com/zq1997/deepin-wine/issues/330)
> **先关闭微信**，再执行以下代码，在其中找到Graphic选项，将Screen resolution调大即可

```shell
WINEPREFIX=~/.deepinwine/Deepin-WeChat deepin-wine6-stable winecfg
```

**网易云**是19年版本，但是功能仍然齐全蛮耗用：

```sh
# 首先下载安装包到 ~/Downloads
wget -P ~/Downloads https://d1.music.126.net/dmusic/netease-cloud-music_1.2.1_amd64_ubuntu_20190428.deb
# 安装网易云
sudo dpkg -i ~/Downloads/netease-cloud-music_1.2.1_amd64_ubuntu_20190428.deb
```

由于动态链接库问题，需要编辑网易云脚本位置 `/opt/netease/netease-cloud-music/netease-cloud-music.bash`：

```sh
sudo vim /opt/netease/netease-cloud-music/netease-cloud-music.bash
```

在第6行和第7行之间加上 `cd /lib/x86_64-linux-gnu/` 即可，在终端中执行 `netease-cloud-music ` 可以启动，也可在应用界面直接启动。（参考博客的评论：[Ubuntu 22.4网易云音乐启动失败处理方法](https://blog.csdn.net/luoweid/article/details/124484949)）

![网易云脚本修改](/figures/My_Ubuntu.assets/网易云脚本修改.png)
{% endspoiler %}

### LaTeX

LaTeX的安装包和Windows通用，LaTeX安装参考 [知乎 - Ubuntu(20.04 LTS) OS 下 VS Code + LaTeX 快速配置指南](https://zhuanlan.zhihu.com/p/136209984)，这里以安装texlive2021为例：

```bash
sudo mount -o loop texlive2020.iso /mnt  # 挂载光盘
cd /mnt
sudo ./install-tl
# 无需修改，输入I回车，安装约8分钟
sudo umount /mnt  # 弹出光盘
```

```sh
# 加入到./zshrc或者./bashrc中，我装的是2021版本的，具体根据自己安装的版本写
export PATH=/usr/local/texlive/2021/bin/x86_64-linux:$PATH
export PATH=/usr/local/texlive/2021/texmf-dist/scripts/latexindent:$PATH
export MANPATH=/usr/local/texlive/2021/texmf-dist/doc/man:$MANPATH
export INFOPATH=/usr/local/texlive/2021/texmf-dist/doc/info:$INFOPATH
```

**VsCode配置**：安装插件LaTeX Workshop，`ctrl+shift+P`输入`user settings json`打开默认用户配置，将下述配置文件加入（注意json格式正确）：
{% spoiler 点击显/隐Latex setting.json配置代码 %}
```json
    "latex-workshop.latex.autoBuild.run": "never",
    "latex-workshop.message.error.show": false,
    "latex-workshop.message.warning.show": false,
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "--shell-escape",
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "--shell-escape",
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": [
                "%DOCFILE%"
            ]
        }
    ],

    "latex-workshop.latex.recipes": [
        {
            "name": "xelatex",
            "tools": [
                "xelatex"
            ],
        },
        {
            "name": "pdflatex",
            "tools": [
                "pdflatex"
            ]
        },
        {
            "name": "xe->bib->xe->xe",
            "tools": [
                "xelatex",
                "bibtex",
                "xelatex",
                "xelatex"
            ]
        },
        {
            "name": "pdf->bib->pdf->pdf",
            "tools": [
                "pdflatex",
                "bibtex",
                "pdflatex",
                "pdflatex"
            ]
        }
    ],
```
{% endspoiler %}

打开一个tex文件，点击左上角的xelatex（中文文档）, pdflatex（英文文档）就可以生成对应pdf文件了
![左上角xelatex可以运行带有中文的latex, pdflatex运行英文](/figures/My_Ubuntu.assets/latex_vscode.jpg)

**中文字体配置**，配置给定的字体，英文字体族配置教程（中文类似）：[Specify different fonts for bold and italic with fontspec](https://tex.stackexchange.com/questions/31739/specify-different-fonts-for-bold-and-italic-with-fontspec)，全部为以下10个字体（均已放到[GitHub - Latex-Product/Fonts](https://github.com/wty-yy/LaTex-Projects/tree/main/Fonts) 下），全部安装完成后就可以直接运行我的LaTeX文件了。
```bash
git clone https://github.com/wty-yy/LaTex-Projects.git  # 我的latex文档仓库，有些模板文件可以参考
```

![全部字体](/figures/My_Ubuntu.assets/全部字体.png)

由于LaTeX可以直接使用到用户安装的字体，所以只要找到字体的正确名称即可，使用以下命令找到相应的字体：

```sh
sudo fc-cache -fv  # 更新字体缓存
fc-list | grep "home"  # fc-list 列出所有字体，grep "home" 筛选出路径中包含 "home" 的字体
```

通过上述方法可以找到相应的字体，看到 `.ttf` 文件后的名称就是在LaTeX中配置的名称：

![显示用户目录下已有字体](/figures/My_Ubuntu.assets/显示已有字体.png)

### WPS缺失字体及PDF导出问题

> 星火商店中安装的貌似修复此问题了

**WPS 2019**：https://www.wps.cn/product/wpslinux

缺失图像字体从这里下载 [百度网盘 - wps_symbol_fonts](https://pan.baidu.com/s/1bFmSqWVDxc7Kc4kbJt3uEQ?_at_=1680680543255)，提取码：m5jw，将解压后的文件夹放到用户字体目录 `~/.local/share/fonts` 中然后重启wps解决问题。
![wps解决确实字体问题](/figures/My_Ubuntu.assets/wps解决缺失字体问题.png)

2024.5.24更新：Ubuntu 24.04中出现**无法打开与导出PDF**，原因在于Ubuntu 23.04之后就更新为`libtiff.so.6`，因此WPS无法找到 `libtiff.so.5` 文件，需要创建一个软连接指向 `libtiff.so.6`：
```
cd /usr/lib/x86_64-linux-gnu
sudo ln -s libtiff.so.6 libtiff.so.5
```

### 安装g++, miniforge

```sh
sudo apt install g++  # gcc无需安装，系统自带
```

通过miniforge中base环境下的python作为系统默认python，从 [GitHub - miniforge](https://github.com/conda-forge/miniforge/releases) 上直接下载安装包，现在推荐安装 mambaforge，安装方法和功能与miniforge完全一样，只不过用mamba命令代替conda，并且有多线程下载，下载速度起飞！

```sh
chmod 777 Mambaforge-23.1.0-1-Linux-x86_64.sh  # 赋予可执行权限
./Mambaforge-23.1.0-1-Linux-x86_64.sh  # 开始安装，自行设定安装位置
# 在安装选项最后选择是否默认打开，需要输入y回车
```
这样重启终端就能看到默认进入base环境了，如果安装最后忘记配置了，我们进入`mambaforge`安装文件夹下找到`mamba`，执行`mamba init`即可。

{% spoiler 配置称默认python（无需此操作了，因为默认就可以进入base环境下，也就是启动了python） %}
最后在 `~/.zshrc` 中配置为默认python：

```sh
# 将miniforge base环境作为默认python
export PATH="$HOME/Programs/miniforge3/bin:$PATH"
```
{% endspoiler %}

安装完python后第一件事还是换源（现在不换源好像也挺快的😻）：[conda 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)，[pip 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)。

### 安装Blog配置

如果你有自己的博客，可以参考[我的Blog配置](https://github.com/wty-yy/Blog-SourceCode)中的安装nvm, nodejs, npm, cnpm, hexo的方法（并且换源，简单有效）

### 安装TensorFlow & Jupyter

由于没有显卡，直接使用pip安装TensorFlow，Jupyter notebook建议使用mamba安装。

```sh
pip install tensorflow
mamba install jupyter notebook
```

在Jupyter中使用Vim方法见：[怎么在Jupyter Notebook里使用vim？](https://www.zhihu.com/question/384989800)，安装主题见：[Jupyter notebook  主题颜色配置](https://wty-yy.space/posts/18857/#%E4%B8%BB%E9%A2%98%E9%A2%9C%E8%89%B2%E9%85%8D%E7%BD%AE)。

**Matplotlib绘图中文字体无法显示**：首先在该网站 [下载SimHei.ttf](https://www.fontpalace.com/font-details/SimHei/) 字体，先直接进行安装，看是否可以显示，如果不行则进行以下操作：在Jupyter Notebook中执行以下代码，找到 `mpl-data` 文件夹

```python
import matplotlib
matplotlib.matplotlib_fname()
```

进入 `.../site-packages/matplotlib/mpl-data/fonts/ttf` 中，将刚刚下载的字体复制进来，然后重启内核即可显示中文字体。

## Ubuntu优化

### 开启休眠模式
参考另一片博文 [Ubuntu 22.04 设置休眠选项](/posts/51985/)

### Firefox浏览器双指缩放
> Ubuntu24.04在wayland模式下默认就开启了多指操作功能了，非常方便。

参考 [CSDN - Ubuntu Linux下开启Firefox浏览器对触屏缩放的支持](https://blog.csdn.net/weixin_36138462/article/details/116952566)，修改配置文件 `/etc/security/pam_env.conf`，在最后一行加上 `MOZ_USE_XINPUT2 DEFAULT=1`：
```sh
sudo gedit /etc/security/pam_env.conf
```
![Firefox浏览器双指缩放配置1.png](/figures/My_Ubuntu.assets/Firefox浏览器双指缩放配置1.png)

并且在Firefox浏览器中网址栏输入 `about:config`，查找 `dom.w3c_touch_events.enabled` 并设置为 `1`：
![Firefox浏览器双指缩放配置2.png](/figures/My_Ubuntu.assets/Firefox浏览器双指缩放配置2.png)

登出再登入即可解决问题！

### 中文字体显示问题

参考文章 [CSDN - Ubuntu添加和设置默认中文字体](https://blog.csdn.net/mbdong/article/details/122358856)。Ubuntu的默认中文字体是韩语中的汉字，部分字体非常难看，而且有些繁体和简体不分，例如“将”和“径”这些字，修改文件
- Ubuntu 22.04: `sudo vim /etc/fonts/conf.d/64-language-selector-prefer.conf`
- Ubuntu 24.04: `sudo vim /etc/fonts/conf.d/64-language-selector-cjk-prefer.conf`

然后将带有 `SC` 的字体提到第一位（`CaskaydiaCove Nerd Font`这个字体是我喜欢用的等宽字体，可以在 [GitHub - nerd font - CascadiaCode.zip](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.3.3/CascadiaCode.zip) 下载到该字体）：
> 查找可用字体详细全称，可以通过 `fc-list | grep "你想找的字体名称"` 查找

![中文字体修正](/figures/My_Ubuntu.assets/中文字体修正.png)

登出用户，再登入即可看到修改后的效果。

> 非常可惜，GNOME的终端中使用代码连字符（Ligature）的功能，参考 [How can I enable firacode ligature on gnome-terminal?](https://askubuntu.com/questions/1447271/how-can-i-enable-firacode-ligature-on-gnome-terminal)

### 主题配置-背景写字

（由于无法与三指切换配合，切换时字会显示出来，很难看，所以弃用）

{% spoiler "之前安装背景写字的详细过程" %}
之前使用的是closebox73的 [GitHub - Taurus](https://github.com/closebox73/Taurus) 中的 Pleione，基于Conky实现，天气修改方法见 [applying-theme](https://github.com/closebox73/applying-theme)。

需要修改城市为当前所在城市，这样可以显示正确的天气：

```sh
vim /home/wty-yy/.config/conky/Pleione/scripts/weather.sh
```

在 https://openweathermap.org/find 中找到对应的城市编号（网址的最后一串数字，例如我的是 `1790630`），修改

```sh
city_id=1790630
```

最后修改日期显示为英文：

![修改时间显示](/figures/My_Ubuntu.assets/主题优化-修改时间显示.png)
{% endspoiler %}

### 自定义动态壁纸

使用Ubuntu自带的Shotwell就能实现自定义动态壁纸，首先确定壁纸文件夹，然后打开Shotwell，点击左上角 File - Import from folder 选择你的图片文件夹，然后点击 Import 加载进来，最后选中你要播放的图片，在点击左上角 File - Set as Desktop Sildeshow，自己设定转换时间即可。

![自定义动态壁纸](/figures/My_Ubuntu.assets/自定义动态壁纸.png)

### ASUS笔记本电脑集显与独显切换

华硕官方给了[`supergfxctl`](https://gitlab.com/asus-linux/supergfxctl/-/tree/main)工具，可以直接切换笔记本的集显和独显（我的电脑是天选4锐龙版，cpu为R9-7940H，本身的集显就很强），要求内核版本不低于`6.1`，Ubuntu22.04以上应该都行。
相比其他的`system76-power`，这个控制器能支持独显直连，以及虚拟机直通，无需重启注销即可。

安装方法如下：

如果安装过其他切换工具，先卸载掉
```bash
sudo apt remove --purge system76-power nvidia-prime ubuntu-prime
```

安装编译依赖
```bash
sudo apt update && sudo apt install curl git build-essential
```

安装Rust编译环境
```bash
# 建议先挂上梯子
export http_proxy=127.0.0.1:7890
export https_proxy=127.0.0.1:7890
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

编译并安装
```bash
git clone https://gitlab.com/asus-linux/supergfxctl.git
cd supergfxctl
make
sudo make install
```

启动服务并加入用户组
```bash
sudo systemctl enable supergfxd.service --now
sudo usermod -a -G users $USER
# 重启后当前用户就能使用supergfxctl命令了
groups  # 查看是否在users用户组中
```

我的电脑支持如下三种模式：
- Integrated（无电源写代码使用）：集显模式，独显完全关闭，功耗最低，续航最长，无需NVIDIA加速的任务，HDMI接口也无法使用。
- Hybrid（接电源使用）：混合模式，独显开启但不直连，功耗较高，续航较短，适合需要NVIDIA加速的任务，HDMI接口可以使用。
- AsusMuxDgpu：独显直连模式，功耗最高，续航最短，适合需要NVIDIA加速的任务，HDMI接口可以使用。

```bash
❯ supergfxctl -h
Optional arguments:
  -h, --help         print help message
  -m, --mode         Set graphics mode
  -v, --version      Get supergfxd version
  -g, --get          Get the current mode
  -s, --supported    Get the supported modes
  -V, --vendor       Get the dGPU vendor name
  -S, --status       Get the current power status
  -p, --pend-action  Get the pending user action if any
  -P, --pend-mode    Get the pending mode change if any
❯ supergfxctl -s
[Integrated, Hybrid, AsusMuxDgpu]
❯ supergfxctl -m Hybrid  # 切换到混合模式
❯ supergfxctl -g  # 查看当前模式
```

最后还需设置Nvidia电源管理模式，有如下三个数值：
- `0x00` (无管理)：显卡始终待命，即便不干活也耗电（最费电，但最稳定）。
- `0x01` (粗粒度管理 - Coarse)：显卡可以进入低功耗状态，但不会完全“关掉”。
- `0x02` (细粒度管理 - Fine)：最推荐的模式。显卡会在空闲时进入 D3 (Dynamic Power Management) 状态，彻底断电或进入微瓦级功耗。

`0x02`在Windows下是默认开启的，但是Linux下需要手动开启，一些旧的驱动可能不兼容，不过我的这台天选4没什么问题，设置如下：
```bash
# 创建配置文件
sudo vim /etc/modprobe.d/nvidia-pm.conf
# 粘贴以下内容，保存退出
options nvidia NVreg_DynamicPowerManagement=0x02
# 更新配置
sudo update-initramfs -u
# 重启后生效
```

我们可以在重启前执行`nvidia-smi`命令查看当前的电源管理模式，看显卡栏里面的P状态，我启动前是P6，启动后是P8，改数值表示Performance State（性能状态），显卡动态调整频率和电压的机制，数字越小性能越高，数字越大越省电。

## Ubuntu常用快捷键

### 截图

使用Ｕbuntu自带的截图功能：

```sh
Alt + PrintScreen  # 截取当前程序窗口
PrintScreen  # 使用自带截图工具进行截图
```

## Ubuntu常用工具

### drawing

绘图工具，类似windows的画图，常与截图键结合

```sh
sudo apt install drawing
```

### 下载SourceForge一个文件夹内的所有文件

参考：https://stackoverflow.com/questions/39668291/download-whole-folder-from-sourceforge，用网页连接替换掉 `<URL>` 即可。

```sh
curl "<URL>" | tr '"' "\n" | grep "sourceforge.net/projects/.*/download"  | sort  | uniq | while read url; do url=`echo $url | sed 's|/download$||'`; wget $url ; done
```

## 常见问题
### Ubuntu自动更新内核后黑屏
我的情况：有Nvidia显卡的电脑上，当Ubuntu自动更新内核后，登录界面输入密码后就会黑屏，我认为原因在于 Nvidia 显卡驱动和内核版本号绑定，Gnome 可视化界面又和 Nvidia 驱动绑定，因此需要先重装 Nvidia 驱动，再重装 Gnome 才能解决，具体方法：

1. 按 `Ctrl + Alt + F3` 进入 tty 纯命令行模式；
2. 重装 Nvidia 驱动，参考上文[nvidia驱动安装](./#nvidia驱动安装)
3. 重装 `gnome-shell`，会将 `gdm3, ubuntu-desktop` 都全部重新安装一遍
```bash
sudo apt purge gnome-shell
# 如果退出了命令行界面，按 Ctrl+Alt+F3 重新进入
sudo apt install gnome-shell
reboot  # 重启再输入命令看是否可以进入可视化界面
```

如果你既有核显也有独显，一定要检查在BIOS中是否把独显打开，可以使用`system76-power`来切换`nvidia(独显), integrated(集显), hybrid(混合)`三种模式，参考[Graphics Switching (Ubuntu) ](https://support.system76.com/articles/graphics-switch-ubuntu/)。

### Ubuntu内核切换

