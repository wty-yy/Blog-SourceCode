---
title: 在服务器上配置shell及神经网络框架
hide: false
math: true
category:
  - Python
tags:
  - Anaconda
abbrlink: 10409
date: 2022-11-17 12:24:38
index_img:
banner_img:
---

> 由于CVPR大作业需要，学校给我们申请了一些服务器账号，这里记录下服务器基本配置方法及操作流程.

## 登录服务器

我使用的是最简单的方法登录的服务器，直接使用ssh进行连接. （还可以使用vscode连接服务器方法，也比较方便，且可以编辑代码）

- Windows，可以使cmd或者PowerShell，这里推荐在Windows Store中下载Windows Terminal，集成了上述两个，而且界面更加美观.

- Linux，直接在shell中使用ssh命令即可.

输入使用 `ssh 用户名@IP地址` 回车，如果第一次登录，下面会提示是否信任该IP地址，输入 `yes` 即可. 然后会弹出密码输入界面，在后面输入你自己的密码即可.

注：输入密码时候是不会显示密码的，输入完后直接回车即可.

![ssh登入](https://s1.ax1x.com/2022/11/17/ze4O4e.png)

### 修改密码

登入服务器使用的是默认密码，为安全起见建议修改密码，在shell中输入 `passwd` 就可以修改密码.

### 上传文件

这里老师推荐的是[WinSCP](https://winscp.net/eng/news.php)，打开之后直接输入IP，用户名，密码即可登录成功. 需要上传文件到Linux系统直接将文件拖入其中即可.

左侧为本机文件，右侧为服务器文件，直接拖入右侧即可上传

![WinSCP](https://s1.ax1x.com/2022/11/17/ze4mTO.png)

## Linux基础知识

Linux就是由命令行环境构成，命令行界面称为shell，主要就是做文件处理，bash是shell的一种，在服务器上默认使用的就是bash（而zsh好用的多）. 在shell中，最重要的就是弄清楚当前处于哪个文件路径下. 由于服务器上我们是以用户的权限进入，所以只能改动当前目录下的文件. Linux系统有两个默认路径：

1. `/` 表示根目录，也就是root目录，一般服务器不能修改该目录的文件.

2. `~` 表示用户目录，也称为home目录，在文件中的缩写为 `$HOME`，在这个文件夹下，是服务器用户可以修改的东西.

以下有一些文件处理基础操作：（[更多常用命令](/posts/64648/#linux)）

```bash
man 命令        " 显示命令的帮助文档
pwd             " 显示当前路径
cd 路径         " 进入到路径中
ls              " 显示当前目录下的所有文件
ls -al          " 显示当前目录下所有文件的详细信息
mkdir 目录名    " 在当前目录下创建名为'目录名'的文件夹
vim 文件名      " 如果存在文件名的文件，则会使用vim编辑器打开，若不存在则会创建该文件
cp 文件1 文件2  " 复制文件1到文件2，可以在文件名前面加上路径，则会复制到指定路径当中
rm 文件1        " 删除文件1
mv 文件1 文件2  " 剪切文件1到文件2
wget 'URL'      " URL为文件连接，建议使用单引号括起来
wget -c -O my.zip 'URL'  " 将URL文件下载后命名为my.zip
```

文件夹将上述文件改为文件夹，并在前加上 `-r` 或 `-f` 即可对文件夹进行操作，具体命令请见对应的帮助文档.

当命令后面加上 `-功能命令` 就有其他的功能（命令后面加一个空格写），相当于扩展功能，一般的，一个横杠 `-` 为功能的缩写，两个横杠 `--` 为功能的全写，例如 `ls -h` 和 `ls --help` 等价

### VIM基础操作

VIM功能强大这里难以一一介绍完整，只需注意，VIM共有三种模式，在左下角可以看到，分别为：“命令模式NORMAL”，“插入模式INSERT”，“选择模式VISUAL”，只有在其他两种模式通过按 `ESC` 键均可回到命令模式中，在命令模式中按下 `i` 即可进入编辑模式，可以对文本进行编辑.

若要退出编辑，先回到命令模式，输入 `:wq` 为保存并退出，`:q` 为直接退出，`:!q` 为不保存强制退出. 更多vim功能请见网上教程 [Linux vi/vim | 菜鸟教程](https://www.runoob.com/linux/linux-vim.html).

## 安装程序

由于在服务器上我们没有sudo权限，也就是说无法使用apt-get直接安装程序（因为apt-get是直接安装在根目录下的，需要有sudo权限才能运行），所以我们只能去找文件安装包，用 `wget 下载路径` 进行下载，然后运行安装程序即可.

### 使用编译安装

如果安装的文件是github上的项目，一般有后缀为 `.tar.gz` 的安装包，使用 `weget 下载路径` 或者在本机上下载下来后再使用WinSCP上传上去也行，这里以安装 `ncurses` 为例：

```bash
wget http://ftp.gnu.org/gnu/ncurses/ncurses-6.3.tar.gz  " 下载安装包
tar -xf ncurses-6.3.tar.gz  " 解压压缩包
cd ncurses-6.3/  " 进入到刚刚解压出的目录中
./configure --prefix=$HOME/apps/  " 设置安装目录为 $HOME/apps/ 文件夹下
make -j && make install  " 编译并安装程序
```

安装tmux可参考：[CSDN - Linux安装tmux](https://blog.csdn.net/tianyunzqs/article/details/110410184)

简单配置后效果如下（配置方法[请见](/posts/64648/#tmux)）

![Tmux分屏效果](https://s1.ax1x.com/2022/11/18/zuZvz8.png)

### Anaconda安装及配置

首先使用 `wget` 直接下载安装包，可以在用户目录下安装即可. 查阅Anaconda的版本号请见(https://repo.anaconda.com/archive/)，找到最新的版本号，比如现在是2022.11.17，我们下载 `Anaconda3-2022.10-Linux-x86_64.sh` 的安装包（注意：找x86\_64.sh结尾的安装包，一般处理器架构均为x86），执行

```bash
wget https://repo.continuum.io/archive/Anaconda3-2022.10-Linux-x86_64.sh
```

等待下载完毕，进行安装，输入

```bash
bash Anaconda3-2022.10-Linux-x86_64.sh
```

进行多次次回车和输入几次yes即可安装成功.

#### 创建环境

由于在服务器上进行安装所以需要自行添加Anaconda可执行文件到用户目录中，编辑 `~/.bashrc` 文件，加入以下这句话

```
export PATH=$PATH:$HOME/anaconda3/bin
```

然后回到shell中，执行

```
source ~/.bashrc    # 可加载刚才配置的文件（这句话每次进入服务器时候都要输入一遍）
source activate     # 激活conda环境
```

接下来的指令就是在conda环境进行的操作，这里给出一些基础的指令

```
conda create -n env_name python=3.9     # 创建一个名为env_name的环境，使用python3.9最高版本
conda create -n env_name python=3.9.1   # 创建一个名为env_name的环境，指定使用python3.9.1版本
conda activate env_name                 # 激活名为env_name的环境
conda install numpy                     # 安装numpy包
conda uninstall numpy                   # 删除numpy包
conda deactivate                        # 退出当前conda环境
```

### 安装神经网络框架

#### TensorFlow

服务器上一般安装gpu版本的神经网络框架，由于conda中无法下载到高版本的tensorflow-gpu，所以只能通过pip进行安装.

```
pip install tensorflow-gpu==2.6.0   # 安装神经网络框架
pip install keras==2.6.0   # 安装神经网络框架
conda install cudatoolkit   # 这个会自动识别对应的gpu适合的cuda版本
conda install cudnn         # 这个是cuda神经网络包
```

在python中载入tensorflow包，随便运行一个神经网络代码，这里以[官网](https://tensorflow.google.cn/overview)上的为例：

```python
import tensorflow as tf
mnist = tf.keras.datasets.mnist

(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(x_train, y_train, epochs=5)
model.evaluate(x_test, y_test)
```

检查是否可以正常运行，如果差包则对应者继续安装即可，下面代码可以检查是否使用的gpu进行训练（其实在训练网络的日志中就可以看出来）：

```python
import tensorflow as tf
print(tf.test.is_gpu_available())
```
