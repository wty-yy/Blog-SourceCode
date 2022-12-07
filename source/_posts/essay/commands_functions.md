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

### 一键Tmux分屏脚本

服务器上的tmux脚本，创建三个窗口，效果如下图所示，并且每个窗口初始化bash `source ~/.bashrc`.

由于服务器上一般要用后台运行神经网络训练程序，而且每次新的界面要重新 `scoure ~/.bashrc`，所以我创建了一个一键创建tmux分屏窗口并运行 `source` 指令，可大幅提高效率.

使用方法，在用户目录（随便一个方便的目录）下创建 `run.sh` 文件，将下面代码贴进去，然后使用 `chmod 777 run.sh` 修改权限，以后启动服务器后，输入下面代码就能直接启动tmux进行分屏

```bash
./run.sh  # 想启动新的tmux窗口

# 若已有tmux后台
source .bashrc  # 先加载bash配置
tmux a  # 即可启动tmux窗口

# 将tmux放到后台
# 快捷键 tmux组合键+d，tmux组合键默认为 Ctrl+b
```

{% spoiler "run.sh完整代码" %}
```bash
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
{% endspoiler %}

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

### cv2

#### 绘制滑动窗口

```python
from skimage import transform
import cv2

im = cv2.imread(r'mini_fox.jpg')
downscale=1.5 # Guass金字塔以1.5倍进行缩放
def sliding_window(im, window_size, step_size):
    for x in range(0, im.shape[0], step_size[0]):
        for y in range(0, im.shape[1], step_size[1]):
            yield x, y, im[x:x+window_size[0], y:y+window_size[1]]

# Gauss金字塔
for i, im_scaled in enumerate(transform.pyramid_gaussian(im, downscale=downscale, channel_axis=-1)):
    # 滑动窗口
    for x, y, im_window in sliding_window(im_scaled, (30, 100), (30, 10)):
        if im_window.shape[0] != 30 or im_window.shape[1] != 100:
            continue
        clone = im_scaled.copy()  # 在原图上重新绘制
        cv2.rectangle(clone, (y, x), (y + 100, x + 30), (255,255,255), thickness=2)  # 绘制窗口
        cv2.imshow(f"Sliding Window {im_scaled.shape}", clone)  # 显示窗口
        cv2.waitKey(20)  # 控制每帧长度
cv2.waitKey()
```
![Gauss金字塔下的滑动窗口效果](https://s1.ax1x.com/2022/12/07/zglsr8.png)

### Nvidia显卡信息查看

```bash
nvidia-smi  # 显示显卡相关信息
watch -n 1 nvidia-smi  # 以1s刷新显卡使用情况，持续观察显卡使用情况
```

### TensorFLow

请见 [TensorFlow 常用函数及模型写法](/posts/48334/)
