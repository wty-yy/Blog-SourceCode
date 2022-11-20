---
title: 常用命令及函数
hide: true
math: true
abbrlink: 64648
date: 2022-11-18 19:03:38
index_img:
banner_img:
category:
tags:
---

## Linux

下述简写分别表示：`CMD` 命令，`PATH` 路径，`FILE` 文件，`FOLD` 文件夹.

### 通用命令

```bash
man CMD         # 显示CMD的帮助文档
```

### 路径处理

```bash
pwd             # 显示当前路径
cd PATH         # 进入到PATH中
ls              # 显示当前目录下的所有文件
ls -al          # 显示当前目录下所有文件的详细信息
mkdir FOLD      # 在当前目录下创建名为'目录名'的文件夹
vim FILE        # 如果存在文件名的文件，则会使用vim编辑器打开，若不存在则会创建该文件
cp FILE1 FILE2  # 复制文件1到文件2，可以在文件名前面加上路径，则会复制到指定路径当中
rm FOLD1        # 删除文件1
mv FILE1 FILE2  # 剪切文件1到文件2
```

### 文件下载压缩解压

`.tar.gz` 结尾的一般程序安装包，`.zip` 为一般压缩包.

```bash
wget -cO FILE 'URL'         # 下载URL中文件，命名为FILE
zip -r FILE.zip /FOLD       # 压缩/FOLD到FILE.zip
unzip FILE.zip              # 解压FILE.zip
unzip -d /FOLD FILE.zip     # 解压FILE.zip到FOLD目录下
tar -xf FILE.tar.gz         # 解压.tar.gz压缩包
```

### 使用编译安装

如果安装的文件是github上的项目，一般有后缀为 `.tar.gz` 的安装包，使用 `weget 下载路径` 或者在本机上下载下来后再使用WinSCP上传上去也行，这里以安装 `ncurses` 为例：

```bash
wget http://ftp.gnu.org/gnu/ncurses/ncurses-6.3.tar.gz  " 下载安装包
tar -xf ncurses-6.3.tar.gz  " 解压压缩包
cd ncurses-6.3/  " 进入到刚刚解压出的目录中
./configure --prefix=$HOME/apps/  " 设置安装目录为 $HOME/apps/ 文件夹下
make -j && make install  " 编译并安装程序
```

### Tmux

服务器上的tmux脚本，创建三个窗口，效果如下图所示，并且每个窗口初始化bash `source ~/.bashrc`

```python
#!/bin/bash
source ~/.bashrc

# 创建seesion名称为mywork，默认创建第一个pane名称也为mywork
tmux new -d -s mywork

tmux split-window -h -t mywork  # 横向分割，mywork到右侧
tmux split-window -v -t mywork  # 竖向分割，mywork到底部

tmux send -t mywork "source ~/.bashrc" ENTER  # 向mywork窗口发送source命令
tmux send -t "1" "source ~/.bashrc" ENTER
tmux send -t "2" "source ~/.bashrc" ENTER

# 连接上tmux会话，显示界面
tmux a -t mywork
```

![Tmux分屏效果](https://s1.ax1x.com/2022/11/18/zuZvz8.png)

## 常用函数

### pathlib

- `pathlib.Path(directory)`：`directory` 为文件的路径，返回 `pathlib.Path` 对象，该对象存储的为 `directory` 这条路径.

- `pathlib.Path.cwd()`：cwd为Current working directory的缩写，即返回当前运行程序所在的目录.

- `pathlib.Path.glob(pattern)`：`pattern` 可以是一个正则表达式(regex)，则该函数会返回该路径下所有符合该 `pattern` 的文件路径. 如 `*.py` 就会返回全体以 `.py` 为后缀的文件，`*` 可以理解为任一的一个前缀（文件名）.

```python
from pathlib import Path

Path.cwd()  # 当前工作路径
Path.home()  # home路径

fname = r'D:\fold1\fold2'
path = Path(fname)
folds = [f for f in path.iterdir() if f.is_dir()]  # 获取path下的全部文件夹路径
files = [f for f in path.iterdir() if f.is_file()] # 获取path下的全部文件路径

files[0].name  # 返回文件的名称(前缀)
files[0].suffix  # 返回文件的名称(后缀)
path.parent  # 父级目录
path.joinpath(fold[0].name)  # 进入子文件夹路径
```

### TensorFLow

请见 [TensorFlow 常用函数及模型写法](/posts/48334/)
