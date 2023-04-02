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

![Ubuntu Orchis主题桌面](/figures/My_Ubuntu.assets/Ubuntu主题桌面.png)

![Ubuntu配置后效果图](/figures/My_Ubuntu.assets/Ubuntu配置后效果图.png)

安装内容（推荐顺序安装）：

> 开始安装软件前记得换源，安装完Ubuntu修改apt源，安装完conda，pip。

1. 中文输入法（使用Fcitx5中的pinyin，注意如果动态链接库版本过高请使用 `aptitude` 进行适当降级）
2. 主题自定义（重装Firefox浏览器，安装 `gnome-tweaks` 和 `chrome-gnome-shell` 用于主题配置）
3. 配置终端（安装vim, git，并对git进行ssh文件配置，zsh, oh-my-zsh，配置vim，直接从我的 [dotfiles](https://github.com/wty-yy/dotfiles) 然后直接执行 `./setup.sh` ）
4. 安装Vscode和LaTex（LaTex速度是Windows上的数倍，编译多长的文件都是一秒不到）
5. 安装QQ，微信，网易云，WPS。
6. 安装g++, mambaforge（作为系统默认的 python）
7. 安装Blog配置（安装nvm，nodejs，npm，cnpm，hexo）
8. 安装TensorFlow和Jupyter，配置Jupyter主题、matplotlib字体。

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

如果从git上clone下来的仓库中，有脚本安装文件以 `*.sh` 结尾，需要先赋予运行权限，然后执行：

```sh
# 例如安装脚本名称为 install.sh
chmod 777 install.sh  # 赋予权限
./install.sh  # 执行安装
```

## 重要配置

### 安装中文输入法

常用有两种输入法：**Fcitx, IBus**

使用了Fcitx4和IBus输入法后，最终选择了比较新的Fcitx5，输入非常流畅，比较推荐使用，配置环境变量参考：https://zhuanlan.zhihu.com/p/341637818，安装教程参考：https://zhuanlan.zhihu.com/p/508797663，最后是外观修改，可以在主题美化中更新完FireFox和安装完 `chrome-gnome-shell` 之后，安装 [Input Method Panel](https://extensions.gnome.org/extension/261/kimpanel/)，即可修改输入法颜色，最好的是还能修改字体大小，非常好用。

关键！！！：如果你之前更新过Ubuntu，就会导致安装过程中提示依赖包确实，这时候就需要使用 `aptitude` 对包进行降级（不推荐对主用机进行频繁升级）：

```sh
sudo apt install aptitude
sudo aptitude install fcitx5-chinese-addons  # 例如我之前无法安装fcitx5-chinese-addons
# 首先它会向你介绍需要哪些安装报，主要看remove，install，downgrade哪些包，如果remove的包中有相关的依赖包，例如包含fcitx名称的，就继续按`n`然后回车，让它给你更多的选择，由于之前升级了包，所以主要看是否有之前包版本进行了downgrade，如果有，则按`y`然后回车进行安装。反复多试几次就能装上。
```



使用Fcitx4输入法可以安装搜狗输入法，但是比较老，不推荐使用，参考：https://blog.csdn.net/mr_sudo/article/details/124874239

IBus 输入法会经常卡顿，不推荐使用，以下是以前安装IBus的方法：https://zhuanlan.zhihu.com/p/132558860

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

### 主题自定义

首先参考 [15 Things to Do After Installing Ubuntu 22.04](https://www.youtube.com/watch?v=Cu4hrOYRt0c&t=217s) 进行Firefox 优化：安装Mozilla Firefox，速度更快。[下载连接](https://www.mozilla.org/en-US/firefox/new/)，[替换方法](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-from-mozilla-builds-for-advanced-users)。

```sh
wget https://raw.githubusercontent.com/mozilla/sumo-kb/main/install-firefox-linux/firefox.desktop  # 先wget下来（如果不能使用sudo下载这个链接）
sudo mkdir /usr/local/share/applications  # 这个文件夹可能不存在
sudo mv firefox.desktop /usr/local/share/applications  # 最后移动到快捷搜索路劲中	
/usr/local/bin/firefox # 执行这句话就能打开新的火狐浏览器
```

然后才能安装插件管理器

```sh
sudo apt install gnome-tweaks  # gnome管理器
sudo apt install chrome-gnome-shell  # 插件管理器
```

安装完后打开该网页，点击上面信任插件安装，最后效果如下：

![FireFox浏览器管理插件](/figures/My_Ubuntu.assets/火狐浏览器管理插件.png)

需要先在 extension manager 中安装 `User Themes`，才能进一步进行下述操作，安装主题可参考 [Give Your GNOME A Fresh And Elegant Look With Orchis Theme 2022 |  Ubuntu 22.04 Customization](https://www.youtube.com/watch?v=4yA9IAY9pJU)。

主题配置可以从 gnome look 中选择自己喜欢的配置，我的选择有以下三个，修改文件的方式均是在tweaks - Appearance中进行修改：

![tweaks外观配置](/figures/My_Ubuntu.assets/tweaks外观配置.png)

1. 窗口外观：[Orchis gtk theme](https://www.pling.com/s/Gnome/p/1357889)，使用方法，将文件解压后，放到 `~/.themes` 文件夹下。

2. 图标：[Candy icons](https://www.gnome-look.org/p/1305251)，使用方法，将文件解压后，然后放到 `~/.icons` 文件夹下。

3. 鼠标：由于原版鼠标大小太小，我是从GitHub上下载的 https://github.com/keeferrourke/capitaine-cursors，然后生成的对应大小的尺寸，然后拷贝到 `~/.icons` 文件夹中

   ```sh
   # 根据GitHub网站给出的设置方法，先安装生成器，然后生成较大的图标，生成完的图标位于dist下
   sudo apt install inkscape x11-apps
   ./build.sh -p unix -t dark -d hd
   mv ./dist/dark ~/.icons/capitaine-dark-hd
   ```

   最后根据 https://askubuntu.com/questions/1158191/how-to-change-mouse-pointer-size-and-appearance-in-gnome-18-04 所说的方法，下载dconf-editor修改鼠标大小，我最后设置的为30。

   ```sh
   sudo apt install dconf-editor
   ```

   ![使用dconf-editor修改鼠标大小](/figures/My_Ubuntu.assets/鼠标大小修改.png)

**好用的插件**

1. [Input Method Panel](https://extensions.gnome.org/extension/261/kimpanel/)：在输入法中提到，用于修改输入法字体大小并与主题颜色相配。
1. [Dash to Dock for COSMIC](https://extensions.gnome.org/extension/5004/dash-to-dock-for-cosmic/)：用来配置边框栏。
1. [Blur my Shell](https://extensions.gnome.org/extension/3193/blur-my-shell/)：用于锁屏有背景雾化效果。
1. [OpenWeather](https://extensions.gnome.org/extension/750/openweather/)：在上方显示天气和温度。

### 配置终端

首先安装vim，git，并设置git的SSH key并上传到自己的GitHub上：

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

![全部字体](/figures/My_Ubuntu.assets/全部字体.png)

由于LaTex可以直接使用到用户安装的字体，所以只要找到字体的正确名称即可，使用以下命令找到相应的字体：

```sh
sudo fc-cache -fv  # 更新字体缓存
fc-list | grep "home"  # fc-list 列出所有字体，grep "home" 筛选出路径中包含 "home" 的字体
```

通过上述方法可以找到相应的字体，看到 `.ttf` 文件后的名称就是在LaTex中配置的名称：

![显示用户目录下已有字体](/figures/My_Ubuntu.assets/显示已有字体.png)

### QQ & WeChat & 网易云 & WPS

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

在第6行和第7行之间加上 `cd /lib/x86_64-linux-gnu/` 即可，在终端中执行 `netease-cloud-music ` 可以启动，也可在应用界面直接启动。（参考博客的评论 https://blog.csdn.net/luoweid/article/details/124484949）

![网易云脚本修改](/figures/My_Ubuntu.assets/网易云脚本修改.png)

**WPS 2019**：https://www.wps.cn/product/wpslinux

### 安装g++, miniforge

```sh
sudo apt install g++  # gcc无需安装，系统自带
```

通过miniforge中base环境下的python作为系统默认python，从github上直接下载安装包 https://github.com/conda-forge/miniforge/releases，然后安装

```sh
chmod 777 Miniforge3-Linux-x86_64.sh  # 赋予可执行权限
/figures/Miniforge3-Linux-x86_64.sh  # 开始安装，自行设定安装位置
```

最后在 `~/.zshrc` 中配置为默认python：

```sh
# 将miniforge base环境作为默认python
export PATH="$HOME/Programs/miniforge3/bin:$PATH"
```

安装完python后第一件事还是换源：[conda 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)，[pip 清华源](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)。

### 安装Blog配置

如果你有自己的博客，可以参考[我的Blog配置](https://github.com/wty-yy/Blog-SourceCode)中的安装nvm, nodejs, npm, cnpm, hexo的方法（并且换源，简单有效）

### 安装TensorFlow & Jupyter

由于没有显卡，直接使用pip安装TensorFlow，Jupyter notebook建议使用mamba安装。

```sh
pip install tensorflow
mamba install jupyter notebook
```

在Jupyter中使用Vim方法见：https://www.zhihu.com/question/384989800，安装主题见：[Jupyter notebook  主题颜色配置](https://wty-yy.space/posts/18857/#%E4%B8%BB%E9%A2%98%E9%A2%9C%E8%89%B2%E9%85%8D%E7%BD%AE)。

**Matplotlib绘图中文字体无法显示**：首先在该网站 [下载SimHei.ttf](https://www.fontpalace.com/font-details/SimHei/) 字体，先直接进行安装，看是否可以显示，如果不行则进行以下操作：在Jupyter Notebook中执行以下代码，找到 `mpl-data` 文件夹

```python
import matplotlib
matplotlib.matplotlib_fname()
```

进入 `.../site-packages/matplotlib/mpl-data/fonts/ttf` 中，将刚刚下载的字体复制进来，然后重启内核即可显示中文字体。

## Ｕbuntu优化

### 主题配置-背景写字

（由于无法与三指切换配合，切换时字会显示出来，很难看，所以弃用）使用的是closebox73的 https://github.com/closebox73/Taurus 中的 Pleione，基于Conky实现，天气修改方法见 https://github.com/closebox73/applying-theme。

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

### 自定义动态壁纸

使用Ubuntu自带的Shotwell就能实现自定义动态壁纸，首先确定壁纸文件夹，然后打开Shotwell，点击左上角 File - Import from folder 选择你的图片文件夹，然后点击 Import 加载进来，最后选中你要播放的图片，在点击左上角 File - Set as Desktop Sildeshow，自己设定转换时间即可。

![自定义动态壁纸](/figures/My_Ubuntu.assets/自定义动态壁纸.png)

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
# 文件类型
Type = Application
# 文件名称，用于搜索
Name = Clash
# 文件的可执行文件绝对路径
Exec = /home/wty-yy/Programs/Clash\ for\ Windows-0.20.19-x64-linux/cfw
# 可选项，文件图标，从晚上下载下来即可
Icon = /home/wty-yy/Pictures/icons/clash.png
```

```sh
# 使用下面代码检查正确性
desktop-file-validate clash.desktop
# 保存文件后，输入以下命令刷新菜单，完成配置
update-desktop-database ~/.local/share/applications
```

![自定义菜单效果图](/figures/My_Ubuntu.assets/自定义菜单效果图.png)

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

