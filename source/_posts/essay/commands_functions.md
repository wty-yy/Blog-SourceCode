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

检查是否使用gpu

```python
tf.test.is_gpu_available()
tf.test.is_built_with_cuda()
```

#### Dataset

[TensorFlow Dataset打乱原理](https://stackoverflow.com/questions/53514495/what-does-batch-repeat-and-shuffle-do-with-tensorflow-dataset)

#### 数据增强

考虑将一张图片进行旋转，平移，伸缩等操作，可以得到类似的更多的图片，tensorflow可以通过加入数据增强层，对数据进行预处理操作. 主要使用以下6种操作：

下述api中大多都有一个名为 `factor` 的变量，表示该操作的比例大小，有两种输入形式：

1. 单独一个浮点数 `x` ，表示该操作变化比例在 `[-x, x]` 范围内随机取值. 例如：旋转操作中是 $[-x\cdot 2\pi, x\cdot 2\pi]$ 范围内取旋转角度.

2. 一个包含两个浮点数的 tuple：`(x, y)`，表示该操作变化比例在 `[x, y]` 范围内随机取值. 例如：旋转操作是在 $[x\cdot 2\pi, y\cdot 2\pi]$ 范围内取旋转角度.

最后两个api中包含参数 `fill_mode` 表示对空白处进行填充的方法，有 $4$ 种方法：

- `reflect`（反射）：通过反射最后一个像素的边缘进行填充. 如：(d c b a | a b c d | d c b a)

- `constant`（常数）：使用零填充. 如：(k k k k | a b c d | k k k k)，其中 k=0

- `wrap`（环绕）：通过环绕到相对边缘进行填充. 如：(a b c d | a b c d | a b c d)

- `nearest`（邻近）：通过最近的像素进行填充. 如：(a a a a | a b c d | d d d d)

注：有一些操作 `factor` 只能取正数；下述api中还有一个 `seed` 的操作，用于设定随机种子.

- `tf.keras.layers.RandomRotation(factor)`：旋转操作，`factor` 正数为逆时针，负数为顺指针.

- `tf.keras.layers.RandomHeight(factor)`：竖向压缩图片，`factor`正数为拉伸，负数为压缩，该操作会将图片的尺寸修改.

- `tf.keras.layers.RandomWidth(factor)`：横向压缩图片，`factor`正数为拉伸，负数为压缩，该操作会将图片的尺寸修改.

- `tf.keras.layers.RandomFlip(mode='horizontal_and_vertical')`：沿水平和竖直方向翻折图片，`mode` 为旋转模式，有三种选项：`horizontal`, `vertical`, `horizontal_and_vertical` 分别表示：只进行横向翻折，只沿竖向翻折，两者都有可能. 默认为第三个选项.

- `tf.keras.layers.RandomZoom(height_factor, width_factor=None, fill_mode='reflect')`：缩放操作，`factor` 正数为缩小，负数为放大，如果只设置第一个参数 `height_factor`，则保持横纵比不变的缩放操作；若设定 `width_factor` 则进行横纵比变化的缩放操作.

- `tf.keras.layers.RandomTranslation(height_factor, width_factor, fill_mode='reflect')`：平移操作，`factor` 正数为向下和向右，负数为向上和向左（分别对应 `height_factor`, `width_factor`）.


这里通过旋转和左右反转操作，对数据进行增强，即将一张图片进行不同的变化，从而加强数据.

```python
augmentation = keras.Sequential([
    layers.RandomZoom(0.3, 0.3, input_shape=(28, 28, 1)),  # 压缩图像
    layers.RandomTranslation(0.15, 0.15, fill_mode='constant', input_shape=(28, 28, 1))  # 平移图像
])
augmentation(img)  # 将增强操作作用在图像上
```
