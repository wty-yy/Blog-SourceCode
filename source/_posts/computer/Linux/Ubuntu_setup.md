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

# My Ubuntu

第一次安装 Ubuntu22.04 LTS 记录下安装遇到的问题和解决方法。

## 基础知识

### 安装命令

首先对Ubuntu安装包下载地址换源，清华源中方法写的非常清楚 https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/ （记得备份）

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



## 重要配置

### 安装中文输入法

常用有两种输入法：**Fcitx, IBus**，我所使用的是 **IBus** 输入法，安装方法如下：

https://zhuanlan.zhihu.com/p/132558860

```sh
sudo apt install ibus ibus-clutter ibus-gtk ibus-gtk3 ibus-qt4  # 安装ibus框架
im-config -s ibus  # 切换ibus框架
sudo apt install ibus-pinyin  # 安装拼音
```

打开Settings - Region & Language - Manage Installed Languages，在Language Support中设置默认的输入法为 `IBus`。

![选择IBus作为默认输入法](/figures/Ubuntu_setup.assets/选择IBus作为默认输入法.png)

重启后，再打开Settings - Keyboard

![设置输入法](/figures/Ubuntu_setup.assets/设置输入法.png)

![设置输入法１](/figures/Ubuntu_setup.assets/设置输入法１.png)

然后就可以通过 `super + space`　（Ｕbuntu中 `super` 键就是 `win` 键）切换输入法，进行中文输入。以下是对输入法的一些配置，不要开太多功能，会使得性能下降。可以打开部分混淆词替换和词典。

![配置输入法](/figures/Ubuntu_setup.assets/配置输入法１.png)

### 安装VsCode & LaTex

VsCode安装参考：https://cyfeng.science/2020/05/20/vs-code-chinese-input/，不要使用snap快照，不然无法输入中文。

```sh
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt update && sudo apt install code
```

LaTex的安装包和Windows通用，LaTex安装参考知乎：https://zhuanlan.zhihu.com/p/136209984。

```sh
# 加入到./zshrc或者./bashrc中，我装的是2021版本的，具体根据自己安装的版本写
export PATH=/usr/local/texlive/2021/bin/x86_64-linux:$PATH
export PATH=/usr/local/texlive/2021/texmf-dist/scripts/latexindent:$PATH
export MANPATH=/usr/local/texlive/2021/texmf-dist/doc/man:$MANPATH
export INFOPATH=/usr/local/texlive/2021/texmf-dist/doc/info:$INFOPATH
```

中文字体配置（难点），配置给定的字体，英文字体族配置教程（中文类似）：https://tex.stackexchange.com/questions/31739/specify-different-fonts-for-bold-and-italic-with-fontspec，全部为以下10个（均已放到 `Latex-Product/Fonts` 下）

![全部字体](/figures/Ubuntu_setup.assets/全部字体.png)

由于LaTex可以直接使用到用户安装的字体，所以只要找到字体的正确名称即可，使用以下命令找到相应的字体：

```sh
sudo fc-cache -fv  # 更新字体缓存
fc-list | grep "home"  # fc-list 列出所有字体，grep "home" 筛选出路径中包含 "home" 的字体
```

通过上述方法可以找到相应的字体，看到 `.ttf` 文件后的名称就是在LaTex中配置的名称：

![显示用户目录下已有字体](/figures/Ubuntu_setup.assets/显示已有字体.png)

### QQ & WeChat & 网易云

新版QQ：https://im.qq.com/linuxqq/index.shtml。

微信：使用windows移植版本deepin-wine：https://github.com/zq1997/deepin-wine

```sh
wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
sudo apt install com.qq.weixin.deepin
# 如无法发送照片
sudo apt install libjpeg62:i386
# 然后在.zshrc中加入wechat的快捷命令，便于直接打开
alias wechat=/opt/apps/com.qq.weixin.deepin/files/run.sh
```

网易云是19年版本，但是功能仍然齐全蛮耗用：

```sh
# 首先下载安装包到 ~/Downloads
wget -P ~/Downloads https://d1.music.126.net/dmusic/netease-cloud-music_1.2.1_amd64_ubuntu_20190428.deb
# 安装网易云
sudo apt install ~/Downloads/netease-cloud-music_1.2.1_amd64_ubuntu_20190428.deb
```

由于动态链接库问题，需要编辑网易云脚本位置 `/opt/netease/netease-cloud-music/netease-cloud-music.bash`：

```sh
sudo vim /opt/netease/netease-cloud-music/netease-cloud-music.bash
```

在第6行和第7行之间加上 `cd /lib/x86_64-linux-gnu/` 即可，在终端中执行 `netease-cloud-music ` 可以启动，也可在应用界面直接启动。（参考博客的评论 https://blog.csdn.net/luoweid/article/details/124484949）

![网易云脚本修改](/figures/Ubuntu_setup.assets/网易云脚本修改.png)

### 安装miniforge

通过miniforge中base环境下的python作为系统默认python，从github上直接下载安装包 https://github.com/conda-forge/miniforge/releases，然后安装

```sh
chmod 777 Miniforge3-Linux-x86_64.sh  # 赋予可执行权限
./Miniforge3-Linux-x86_64.sh  # 开始安装，自行设定安装位置
```

最后在 `~/.zshrc` 中配置为默认python：

```sh
# 将miniforge base环境作为默认python
export PATH="/home/wty-yy/Programs/miniforge3/bin:$PATH"  # .../miniforge3/bin 填写自己的miniforge3路径
```

安装完python后第一件事还是换源：[conda 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)，[pip 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)。

### 安装TensorFlow & Jupyter

由于没有显卡，直接使用pip安装TensorFlow，Jupyter notebook建议使用mamba安装。

```sh
pip install tensorflow
mamba install jupyter notebook
```

在Jupyter中使用Vim方法见：https://www.zhihu.com/question/384989800，安装主题见：[Jupyter notebook  主题颜色配置](https://wty-yy.space/posts/18857/#%E4%B8%BB%E9%A2%98%E9%A2%9C%E8%89%B2%E9%85%8D%E7%BD%AE)。

### Matplotlib绘图中文字体无法显示

首先在该网站 [下载SimHei.ttf](https://www.fontpalace.com/font-details/SimHei/) 字体，然后在Jupyter Notebook中执行以下代码，找到 `mpl-data` 文件夹

```python
import matplotlib
matplotlib.matplotlib_fname()
```

进入 `.../site-packages/matplotlib/mpl-data/fonts/ttf` 中，将刚刚下载的字体复制进来，然后重启内核即可显示中文字体。

## Ｕbuntu优化

### 主题自定义

#### 背景写字

使用的是closebox73的 https://github.com/closebox73/Taurus 中的 Pleione，基于Conky实现，天气修改方法见 https://github.com/closebox73/applying-theme。

需要修改城市为当前所在城市，这样可以显示正确的天气：

```sh
vim /home/wty-yy/.config/conky/Pleione/scripts/weather.sh
```

在 https://openweathermap.org/find 中找到对应的城市编号（网址的最后一串数字，例如我的是 `1790630`），修改

```sh
city_id=1790630
```

最后修改日期显示为英文：

![修改时间显示](/figures/Ubuntu_setup.assets/主题优化-修改时间显示.png)

### YouTube 视频

参考YouTube视频　[15 Things to Do After Installing Ubuntu 22.04](https://www.youtube.com/watch?v=Cu4hrOYRt0c&t=217s)，我只记录了重要的部分：

1. Firefox 优化：安装Mozilla Firefox，速度更快。[下载连接](https://www.mozilla.org/en-US/firefox/new/)，[替换方法](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-from-mozilla-builds-for-advanced-users)。

### 自定义动态壁纸

使用Ubuntu自带的Shotwell就能实现自定义动态壁纸，首先确定壁纸文件夹，然后打开Shotwell，点击左上角 File - Import from folder 选择你的图片文件夹，然后点击 Import 加载进来，最后选中你要播放的图片，在点击左上角 File - Set as Desktop Sildeshow，自己设定转换时间即可。

![自定义动态壁纸](/figures/Ubuntu_setup.assets/自定义动态壁纸.png)

### 使用Clash科学上网

我使用的是 Clash for windows 也就是可视化的Clash，参考教程：https://www.cfmem.com/2021/09/linux-clash-for-windows-vpnv2ray.html，Youtube教程：https://www.youtube.com/watch?v=pTlso8m_iRk&t=314s

### 自定义菜单

参考YouTube教程：[How to add appimage to Linux menu](https://www.youtube.com/watch?v=gdYp2d_p8T0)，网页教程来自[archLinux Desktop entries](https://wiki.archlinux.org/title/desktop_entries)，以创建 `clash` 的快捷方式为例：

```sh
cd ~/.local/share/applications/  # 该文件夹存储 .desktop 后缀的文件，该文件的格式如网站中所描述，下面是一个例子
vim clash.desktop
```

```sh
[Desktop Entry]
Type = Application  # 文件类型
Name = Clash  # 文件名称，用于搜索
Exec = /home/wty-yy/Programs/Clash\ for\ Windows-0.20.19-x64-linux/cfw  # 文件的可执行文件绝对路径
Icon = /home/wty-yy/Pictures/icons/clash.png  # 可选项，文件图标，从晚上下载下来即可
```

```sh
# 保存文件后，输入以下命令刷新菜单，完成配置
update-desktop-database ~/.local/share/applications
```

![自定义菜单效果图](/figures/Ubuntu_setup.assets/自定义菜单效果图.png)

## Ｕbuntu常用命令

### wget

下载url连接所用的命令

```sh
wget URL  # 默认下到当前目录下
wget 'URL'  # 如果链接太长记得加上单引号
wget -P ~/Downloads URL  # 将文件下载到目录 ~/Downloads 中
```

### 截图

使用Ｕbuntu自带的截图功能：

```sh
Alt + PrintScreen  # 截取当前程序窗口
PrintScreen  # 使用自带截图工具进行截图
```

## Ｕbuntu常用工具

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

