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

### re和fnmatch

re是用于表示正则表达式，而fnmatch是用于处理shell样式通配符. 更多正则表达式内容可以参考 [regex101](https://regex101.com/)，该网页还能解释给出的正则表达式非常智能.

- `pattern = re.compile(pattern)`：编译正则表达式 `pattern`.
- `pattern.search(string)`：在string中搜索 `pattern` 所包含的正则表达式.

---

- `fnmatch.translate(pattern)`：将shell样式通配符转化为正则表达式.
- `fnmatch.fnmatch(string, pattern)`：判断 `pattern` 是否匹配字符串 `string`.

shell样式通配符比较简单常用：


- '*': 匹配任意数量的字符，包括零字符.
- '?': 匹配任何单个字符.
- '[sequence]': 匹配任意字符序列.
- '[!sequence]': 匹配任何非顺序的字符.

```python
# 一些ChatGPT举的例子
print(fnmatch.fnmatch("test.txt", "*.txt"))  # prints True
print(fnmatch.fnmatch("test.txt", "test*"))  # prints True
print(fnmatch.fnmatch("test.txt", "*.doc"))  # prints False
# *[0-9]* 匹配包含数字的字符串
```


{% spoiler "正则表达式(regular expression)与shell类型通配符(shell-style wildcard)区别" %}
下述内容来自ChatGPT：

shell样式的通配符模式是一种用于匹配文件名或路径名的模式，它可以包含特殊字符，如`'*', '?', '[sequence]'`. 这些特殊字符在shell样式通配符模式中具有特定的含义，它们分别用于匹配任意数量的字符、任意单个字符或给定序列中的任意字符. 另一方面，正则表达式是一种用于匹配字符串的模式，它可以包含广泛的特殊字符和语法元素，允许您指定用于匹配字符串的复杂模式. 正则表达式比shell样式的通配符模式更强大、更灵活，但它们也更难以阅读和理解。

另一方面，正则表达式是一种用于匹配字符串的模式，它可以包含广泛的特殊字符和语法元素，允许您指定用于匹配字符串的复杂模式。正则表达式比shell样式的通配符模式更强大、更灵活，但它们也更难以阅读和理解。

下面是一些shell样式通配符模式和等价正则表达式模式的例子:

| Shell-style wildcard pattern | Regular expression pattern |
| ---------------------------- | -------------------------- |
| `*.txt`                      | `.*\.txt`                  |
| `test*`                      | `test.*`                   |
| `[0-9]*`                     | `[0-9].*`                  |



{% endspoiler %}

### pathlib

- `pathlib.Path(directory)`：`directory` 为文件的路径，返回 `pathlib.Path` 对象，该对象存储的为 `directory` 这条路径.

- `pathlib.Path.cwd()`：cwd为Current working directory的缩写，即返回当前运行程序所在的目录.

- `pathlib.Path.glob(pattern)`：`pattern` 是一个shell类型的通配符(shell-style wildcard pattern)，则该函数会返回该路径下所有符合该 `pattern` 的文件路径. 如 `*.py` 就会返回全体以 `.py` 为后缀的文件，`*` 可以理解为任一的一个前缀（文件名）.

- `path.mkdir(parents=True, exist_ok)`：`path` 为 `pathlib.Path` 对象即当前创建目录的路径，`parents=True` 若父目录不存在，则创建父目录；`exist_ok=True` 若当前目录不存在时才会进行创建，不会抛出异常.

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


### urllib

用于文件下载，主要使用 `urllib.request.urlretrieve(url, path)` 对url链接进行下载，下载到 `path` 路径下. 一般与 [`tarfile`](./#tarfile) 一同使用.

### tarfile

用于解压 `.tgz`, `.tar.bz2` 文件.

```python
path = '文件路径'
tgz = tarfile.open(path)  # 创建文件路径
tgz.extractall(path=path)  # 将文件解压到path
tgz.close()
```

{% spoiler "同时下载并解压两个文件的例子" %}
```python
from pathlib import Path
import tarfile
import urllib.request

DOWNLOAD_ROOT = "https://spamassassin.apache.org/old/publiccorpus/"  # 下载源的根路径
HAM_URL = DOWNLOAD_ROOT + "20030228_easy_ham.tar.bz2"  # 下载文件的url链接
SPAM_URL = DOWNLOAD_ROOT + "20030228_spam.tar.bz2"
SPAM_PATH = Path.cwd().joinpath("datasets/spam")  # 本地保存路径

def fetch_spam_data(ham_url=HAM_URL, spam_url=SPAM_URL, spam_path=SPAM_PATH):  # 自义下载函数
    spam_path.mkdir(parents=True, exist_ok=True)  # 若文件夹不存在，创建文件夹
    for filename, url in (("ham.tar.bz2", ham_url), ("spam.tar.bz2", spam_url)):  # 设定保存的文件名和对应的url
        path = spam_path.joinpath(filename)  # 文件保存的位置
        if not path.exists():  # 若文件以存在，则不重复下载
            urllib.request.urlretrieve(url, path)  # 文件下载
        tar_bz2_file = tarfile.open(path)  # 创建解压tarfile实例
        tar_bz2_file.extractall(path=spam_path)  # 解压文件到指定目录下
        tar_bz2_file.close()  # 关闭解压实例

fetch_spam_data()
```
{% endspoiler %}

### matplotlib

#### 同时绘制多个图像

```python
# 同时绘制多个图像
def plot_figures(instances, images_per_row=10, **options):
    # 图像大小
    size = 28
    # 每行显示的图像，取图像总数和每行预设值的较小值
    images_per_row = min(len(instances), images_per_row)
    # 总共的行数，下行等价于 ceil(len(instances) / image_per_row)
    n_rows = (len(instances) - 1) // images_per_row + 1
    # 如果有空余位置没有填充，用空白进行填充
    n_empty = n_rows * images_per_row - len(instances)
    padded_instances = np.concatenate([instances, np.zeros([n_empty, size * size])], axis=0)
    # 将图像排列成网格
    image_grid = padded_instances.reshape([n_rows, images_per_row, size, size])
    # 使用np.transpose对图像网格进行重新排序，并拉伸成一张大图像用于绘制
    big_image = image_grid.transpose([0, 2, 1, 3]).reshape([n_rows * size, images_per_row * size])
    plt.imshow(big_image, cmap='binary', **options)
    plt.axis('off')
    plt.tight_layout()
plt.figure(figsize=(6, 6))
plot_figures(train_x[:100])
plt.savefig('figure/MNIST前100张图像')
plt.show()
```

![MNIST前100张图像](https://s1.ax1x.com/2023/01/03/pSiceaQ.png)

### numpy

#### 随机

1. `np.random.permutation(n)`：生成 `1,...,n` 的随机排列.

### pandas

pandas读取的文件类型为 `pandas.core.frame.DataFrame` 一般记为 `df`. 空单元格记为 `None`，是一种二维数组的形式，只不过可以通过**索引**获取元素值，索引分为两种，行与列：
- **行索引**默认从0开始顺次编号，一般为数字；
- **列索引**默认为原表格中的第0行的列名称，一般为字符串.

#### 读取查找操作

以下为读入 `.csv` 文件为例，若为 `excel` 表格（文件后缀为 `.xls` 或 `xlsx`）只需将 `read_csv()` 改为 `read_excel()`.
1. `df = pd.read_csv(path, header=0)`：从 `path` 路径中读取 `.csv` 文件，`header=0` 表示以第0行作为列索引，若 `header=None` 则默认以序号作为列索引，数据内容从表格的第一行开始.

2. 获取列表元素有如下两种方式：

- 根据**行索引**与**列索引**进行查找，例如查找列索引为 `col1` 索引为 `i` 对应的元素：`df.loc[i, col1]`.

- 根据表格的相对位置进行查找（即将原表格视为二维数组进行查找），例如查找第 `i` 行第 `j` 列的元素：`df.iloc[i, j]`.

    切片的方法和通常做法相同，例如取出前100行：`df.iloc[:100]`，取出50到99行：`df.iloc[50:100]`.

可以使用 `len(df)` 获取行数，或者 `df.shape` 获取行与列数，使用 `list(df)` 可以方便地获得列索引.

如果想直接将DataFrame转化为numpy数组格式，则可以通过 `df.values` 获得.

> 但需要注意的是，如果 `df` 中存在字符串，则 `df.values` 会转化为字符数组，需要自行转化数据格式.

#### 查看数据结构

1. `df.head(n=5)`：显示前n行内容，默认显示5行.

2. `df.info()`：显示文件相关信息，包括：列索引，每列Non-Null的个数，每列的数据类型.

3. `df.describe()`：显示数字列的相关信息，包括：行数，中位数，标准差，最小最大值，1/4,1/2,3/4分位数.

4. `df['col1'].value_counts()`：对第 `col1` 求去重后的元素个数（一般用于处理字符串数据）.

5. `df.hist(bins=50, figsize=(18, 12)`：显示每一列的直方图结果，使用 `matplotlib.pyplot` 进行绘制成多个子图形式，使用 `plt.show()` 显示.

#### 数据可视化

主要使用 [`df.plot`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.plot.html) 函数，以下为散点图使用方法.

1. `df.plot(kind='scatter', x='col1', y='col2', alpha=0.1, s=df['col3'], c=df['col4'], cmap='jet', colorbar=False, xlabel=, ylabel=)`：`kind='scatter'` 表示使用散点图进行绘制，以 `col1` 列作为x轴，`col2` 列作为y轴，绘制散点图，每个点的透明度为 `alpha`，每个点的大小为 `df['col3']` 控制，每个点的颜色由 `df['col4']` 控制，色彩分布使用 `jet` 类型，不显示色彩带 `colorbar=False`，后面的参数为 `plt` 的常用参数配置，例如 `xlabel` 为x轴标签，等等.

![数据可视化效果](https://s1.ax1x.com/2022/12/29/pSpKzi6.png)

{% spoiler "数据可视化完整代码" %}
```python
df.plot(kind='scatter', x='longitude', y='latitude', alpha=0.1, xlabel='经度', ylabel='纬度', figsize=(6, 6))
plt.show()  # 左图

import matplotlib as mpl
ax = df.plot(kind='scatter', x='longitude', y='latitude', alpha=0.4,
        s=df['population']/100, label='人口数', figsize=(10, 7),
        c='median_house_value', cmap=plt.get_cmap('jet'), colorbar=False,
        xlabel='经度', ylabel='纬度')  # 这里不使用pandas自带的colorbar显示，因为有bug，显示后x轴标签无法显示
ax.figure.colorbar(plt.cm.ScalarMappable(  # 自定义colorbar的显示效果
    norm=mpl.colors.Normalize(vmin=df['median_house_value'].min(), vmax=df['median_house_value'].max()), cmap='jet'),  # 设定色彩范围
    label='房价中位数', alpha=0.4)  # 设定colorbar的标签和透明度，保持和pandas绘制时相同即可
plt.legend()
plt.show()  # 右图
```
{% endspoiler %}

---

**相关性分析**

1. 计算相关系数矩阵：`df.corr()`，返回每个数值列与数值列之间的相关系数值.([wikipedia上相关性介绍](https://en.wikipedia.org/wiki/Correlation))

2. 绘制散点图矩阵 `scatter_matrix(df[attributes])`，其中`attributes` 为要显示的列索引，将每列与每列之间绘制散点图，可视化两两数据之间的相关性.

![散点图矩阵](https://s1.ax1x.com/2022/12/30/pSpwBo8.png)

#### 数据处理

1. `df.reset_index(drop=False)`：重新对列表的索引值进行设置，从 `0` 开始一次递增，若 `drop=False` 则保留原索引为 `index` 列，默认保留，若为 `drop=True` 则不保留.（该api也可用于创建索引列）

2. `df.value_counts()`：统计每种值出现的个数.

3. `pd.cut(df['col1'], bins=[a1,a2,...,a9], labels=[1,2,...,8])`：对 `df['col1']` 列按照 `(a1,a2], (a2,a3], ..., (a8, a9]` 划分为 $8$ 段，每一段均为左开右闭，第 `i` 段的标签记为 `i`（默认标签为这一段的数值范围）.

##### 数据清理

处理缺失的特征，有如下三种选择：

1. 丢弃缺失值对应的整行：`df.dropna(axis=0, subset=None)`，`axis=0` 表示清除规则为按行清除，`subset` 可以指定清除某一列的缺失值，默认为行清除，清除整个表格中的全部缺失值.

2. 丢弃缺失值对应的整列：`df.dropna(axis=1)`.

3. 将缺失值补全为某个值（0、平均数或中位数等）：例如，按0补全 `df['col1'].fillna(0)`

如此操作可能对于新数据处理不方便，因为可能出现新的列有缺失值，而上述补全方式不适用于对于新的一列进行补全，所以使用Scikit-Learn中的SimpleImputer方式可以更好的进行数据补全，参见另一篇文章[Scikit-Learn SimpleImputer类](./65380/#简易处理缺失值)

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

### Scikit-Learn

请见 [Scikit-Learn 常用函数及模型写法](/posts/65380/)

### TensorFLow

请见 [TensorFlow 常用函数及模型写法](/posts/48334/)
