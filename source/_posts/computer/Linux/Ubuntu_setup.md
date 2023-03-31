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

# My Linux

第一次安装 Ubuntu22.04 LTS 记录下安装遇到的问题和解决方法。

## 安装中文输入法

常用有两种输入法：**Fcitx, IBus**，我所使用的是 **IBus** 输入法，安装方法如下：

https://zhuanlan.zhihu.com/p/132558860

```sh
sudo apt install ibus ibus-clutter ibus-gtk ibus-gtk3 ibus-qt4  # 安装ibus框架
im-config -s ibus  # 切换ibus框架
sudo apt install ibus-pinyin  # 安装拼音
```

打开Settings - Region & Language - Manage Installed Languages，在Language Support中设置默认的输入法为 `IBus`。

![image-20230331175757360](/figures/Ubuntu_setup.assets/选择IBus作为默认输入法.png)

重启后，再打开Settings - Keyboard

![设置输入法](/figures/Ubuntu_setup.assets/设置输入法.png)

![设置输入法１](/figures/Ubuntu_setup.assets/设置输入法１.png)

然后就可以通过 `super + space`　（Ｕbuntu中 `super` 键就是 `win` 键）切换输入法，进行中文输入。以下是对输入法的一些配置，不要开太多功能，会使得性能下降。可以打开部分混淆词替换和词典。

![配置输入法](/figures/Ubuntu_setup.assets/配置输入法１.png)

## 安装VsCode & LaTex

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

## QQ & WeChat

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

## Ｕbuntu优化

参考YouTube视频　[15 Things to Do After Installing Ubuntu 22.04](https://www.youtube.com/watch?v=Cu4hrOYRt0c&t=217s)，我只记录了重要的部分：

1. Firefox 优化：安装Mozilla Firefox，速度更快。[下载连接](https://www.mozilla.org/en-US/firefox/new/)，[替换方法](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-from-mozilla-builds-for-advanced-users)。
2. 

## Ｕbuntu常用命令

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

