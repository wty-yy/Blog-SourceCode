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

- `path.is_file()`：判断 `path` 是否是文件.
- `path.is_dir()`：判断 `path` 是否是文件夹.

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

### datatime

主要是处理时间字符串所用.
 - 时间字符串读入：`data = datetime.strptime(string, time_format)`，将格式化时间信息字符串 `string` 根据格式 `time_format` 转化为 `datatime` 时间格式.
    例如 `time_format = '%Y-%m-%d %H:%M:%S'`，则可以读入类似 `2157-11-21 03:16:00` 的年份. 具体 `time_format` 格式请见下面折叠内容.
 - 获取两个时间的相对天数：`relative_days = (data1 - data2).days`
 - 获取两个时间的相对秒数：`relative_seconds = (data1 - data2).seconds`（不足一天的则化为秒计算）
    通过 `24 * relative_days + relative_seconds / 3600` 即可求出相对小时数.


{% spoiler "time_format格式" %}
```
%y 两位数的年份表示（00-99）
%Y 四位数的年份表示（000-9999）
%m 月份（01-12）
%d 月内中的一天（0-31）
%H 24小时制小时数（0-23）
%I 12小时制小时数（01-12）
%M 分钟数（00=59）
%S 秒（00-59）
%a 本地简化星期名称
%A 本地完整星期名称
%b 本地简化的月份名称
%B 本地完整的月份名称
%c 本地相应的日期表示和时间表示
%j 年内的一天（001-366）
%p 本地A.M.或P.M.的等价符
%U 一年中的星期数（00-53）星期天为星期的开始
%w 星期（0-6），星期天为星期的开始
%W 一年中的星期数（00-53）星期一为星期的开始
%x 本地相应的日期表示
%X 本地相应的时间表示
%Z 当前时区的名称
%% %号本身
```
{% endspoiler %}

### matplotlib

```python
import matplotlib as mpl
import matplotlib.pyplot as plt
```

#### 显示中文

只需将下述配置放置在包导入之后即可，有以下两种配置方案，第一个使用的是宋体，更加正规；第二个使用的是黑体，也很清晰好用，推荐第二种。
```python
config = {
    "font.family": 'serif', # 衬线字体
    "figure.figsize": (14, 6),  # 图像大小
    "font.size": 20, # 字号大小
    "font.serif": ['SimSun'], # 宋体
    "mathtext.fontset": 'stix', # 渲染数学公式字体
    'axes.unicode_minus': False # 显示负号
}
plt.rcParams.update(config)

config = {  # 另一种配置
    "figure.figsize": (6, 6),  # 图像大小
    "font.size": 16, # 字号大小
    "font.sans-serif": ['SimHei'],   # 用黑体显示中文
    'axes.unicode_minus': False # 显示负号
}
plt.rcParams.update(config)
```

#### 绘图参数

绘图一般以以下顺序逐步进行，多次使用 `plt.plot` 后绘制的图像会覆盖之前绘制的图像. 

- `plt.figure(figsize=(6, 4), dpi)`：创建长宽为6x4大小的幕布，在此基础上乘上单位分辨率 `dpi`，即为图像分辨率.
- `plt.plot(X, y, 'r-s', markersize=8, lw=2, label='SGD')`：依 `(X, y)` 绘制二维图像，第三个参数用于控制图像属性，`r` 表示红色，`-` 表示直线，`s` 表示方块点，`markersize` 表示描点所用图形的大小(即方块的大小)，`lw` 是 `linewidth` 的缩写，用于调整线的宽度，`label` 表示该图形的标签，需要使用 `plt.legend()` 显示标签. 以下为几种常用图像属性：
    1. `'r-s'` 红色，直线，方块描点.
    2. `'g--^'` 绿色，虚线，上三角描点.
    3. `b.` 蓝色，散点图.
    4. `r:` 红色，虚线.
- `plt.legend(loc=None)`：显示图例，`loc` 表示固定图例位置，默认为自动选择适合的位置，常用位置有：`upper left, lower right, center left ...`
- `plt.axis([x1, x2, y1, y2])`：用于控制显示坐标系范围，横坐标限制在 `[x1, x2]` 范围内，纵坐标限制在 `[y1, y2]` 范围内.
- `plt.xlabel("Xname"), plt.ylabel("Yname", rotation=0)`：设定x,y轴坐标名称，`rotation` 表示逆时针旋转角度，由于y轴标签默认旋转90度，如果标签内容较少，建议不要旋转.
- `plt.axhline(y=0, color='k')`：以 `y=0` 绘制黑色竖线，表示y轴.
- `plt.axvline(x=0, color='k')`：以 `x=0` 绘制黑色竖线，表示x轴.
- `plt.text(x, y, text, fontsize=16, ha='center', color='k')`：在 `(x,y)` 点处以 `16` 号字体居中绘制黑色字符串 `text`，`ha` 表示字符串位置，默认为 `left`.
- `plt.tight_layout()`：在保存图像前，建议使用该api，可以将多余边界去除，使图像更美观.
- `plt.savefig("figure/fname.png", dpi=300)`：将图像保存到 `./figure/fname.png` 文件中，单位分辨率为 `dpi=300`，如果 `figsize=(3,2)` 则输出图像的分辨率为 `900x600`. 支持图片类型还有 `.jpg .pdf .svg`.
- `plt.show()`：显示图像，并关闭当前幕布，完成全部绘图.

结合以上方法进行绘图的例子：

```python
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
PATH_FIGURES = "./figures"
Path(PATH_FIGURES).mkdir(parents=True, exist_ok=True)  # 若存储图片的文件夹不存在，则进行创建

np.random.seed(42)
m = int(1e5)
X_normal = np.random.randn(m, 1)
hists, bins = np.histogram(X_normal, bins=50, density=True)
bins = bins[:-1] + (bins[1] - bins[0]) / 2  # 取每个小区间的中位数

plt.figure(figsize=(8, 4))
plt.hist(X_normal, bins=50, density=True, alpha=0.8)  # 绘制直方图，alpha为透明度
plt.plot(bins, hists, 'r--o', markersize=6, label="高斯采样")
plt.text(2.5, 0.3, r"$f(x) = \frac{exp\left(\frac{-x^2}{2}\right)}{\sqrt{2\pi}}$",
         fontsize=25, ha='center', color='w', math_fontfamily='cm')
plt.axhline(y=0, color='k')
plt.axvline(x=0, color='k')
plt.axis([-4, 4, -0.02, 0.42])
plt.xlabel("$x$")
plt.ylabel("$P$", rotation=0)
plt.legend(loc='upper left')
plt.title("$10^5$个来自标准正态分布的样本")
plt.tight_layout()
plt.savefig(PATH_FIGURES + "normal_distribution_density_plot.png", dpi=300)
plt.show()
print("曲线下近似面积:", np.trapz(hists, bins))  # 0.9999800000000001
```

![normal distribution density plot](https://s1.ax1x.com/2023/01/11/pSmvTOJ.png)

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

#### 绘制等高线

等高线图主要有两种：

1. 等高线填充背景：
    - `plt.contourf(x1, x2, z, levels=levelz, cmap='viridis')`：`x1, x2` 为网格划分后的对应坐标，`z` 对应网格点的高度值，`levels` 表示等高线的划分点，在两个等高线之间的区域用同种颜色填充，`cmap` 表示填充使用的颜色带.
    - `plt.colorbar(label)`：通过绘制颜色柱为等高线提供每种颜色对应的高度值.
2. 绘制等高线：
    - `contour = plt.contour(x1, x2, z, levels=levelz, cmap='viridis')`：用法与 `plt.contourf` 类似，只不过是在对应 `levels` 处绘制等高线.
    - `plt.clabel(contour, fontsize=14, inline=True)`：使用 `plt.contour` 返回值，使用 `fontsize` 字号在等高线内绘制对应的高度.（`inline` 默认为 `True`，一般无需添加）
> 常用的 `cmap` 选项：`viridis, jet, rainbow, summer, autumn` 等.

```python
plt.figure(figsize=(8, 5))
x1, x2 = np.meshgrid(  # 创建离散网格点
    np.linspace(-3.5, 3.5, 500),
    np.linspace(-3, 3, 500)
)
# 计算高度值
z = np.exp(-((x1+1)**2 + x2**2) / 2) / (2 * np.pi) - np.exp(-((x1-1)**2 + x2**2) / 2) / (2 * np.pi)
# 设置等高线划分点，会根据情况绘制等高线，若没有相应的数据点，则不会进行绘制
levelz = (np.linspace(-0.1, 1.1, 17) * (z.max() - z.min()) + z.min()).round(2)
plt.contourf(x1, x2, z, levels=levelz, cmap='viridis')  # 向由等高线划分的区域填充颜色
plt.colorbar(label='概率')  # 制作右侧颜色柱，表示每种颜色对应的值

contour = plt.contour(x1, x2, z, cmap='jet', levels=levelz)  # 绘制等高线
plt.clabel(contour, fontsize=14)  # 在等高线上绘制对应高度值

plt.xlabel('$x_1$')
plt.ylabel('$x_2$', rotation=0)
plt.grid(False)
plt.tight_layout()
plt.savefig("figure/bivariate_normal_distribution_density_plot.png", dpi=300)
plt.show()
```

![bivariate normal distribution density plot](https://s1.ax1x.com/2023/01/11/pSnEVyt.png)

> 更多等高线的例子请见：[训练线性模型 - 代码实现](/posts/24285/#弹性网络-2)

### numpy

#### 随机

1. `np.random.permutation(n)`：生成 `1,...,n` 的随机排列.

### pandas

pandas读取的文件类型为 `pandas.core.frame.DataFrame` 一般记为 `df`. 空单元格记为 `None`，是一种二维数组的形式，只不过可以通过**索引**获取元素值，索引分为两种，行与列：
- **行索引**默认从0开始顺次编号，一般为数字；
- **列索引**默认为原表格中的第0行的列名称，一般为字符串.

**实参与形参**：如果是单行单列的切片，则返回的数据类型为 `pandas.core.series.Series`，大部分api和 `DataFrame` 类似，而且是形参，做多行多列的切片返回的仍然是 `DataFrame` 数据类型，也是形参. 如果直接将 `DataFrame` 传入到函数中则是实参则是实参.

#### 读取查找操作及修改行列索引

以下为读入 `.csv` 文件为例，若为 `excel` 表格（文件后缀为 `.xls` 或 `xlsx`）只需将 `read_csv()` 改为 `read_excel()`.
1. `df = pd.read_csv(path, header=0)`：从 `path` 路径中读取 `.csv` 文件，`header=0` 表示以第0行作为列索引，若 `header=None` 则默认以序号作为列索引，数据内容从表格的第一行开始.

2. 获取列表元素有如下两种方式：

- 根据**行索引**与**列索引**进行查找，例如查找列索引为 `col1` 索引为 `i` 对应的元素：`df.loc[i, col1]`.

- 根据表格的相对位置进行查找（即将原表格视为二维数组进行查找），例如查找第 `i` 行第 `j` 列的元素：`df.iloc[i, j]`.

    切片的方法和通常做法相同，例如取出前100行：`df.iloc[:100]`，取出50到99行：`df.iloc[50:100]`.

> 注：使用 `iloc` 速度会比 `loc` 速度快非常多，处理较大表格时建议使用 `iloc`.

3. 修改行列的方法：

- 修改列名称有两种方法：
    1. 通过 `df.columns = ['rename_col1', 'rename_col2', ...]` 直接修改列名称，此方法一般在对全部列名进行修改时使用.
    2. 通过 `df.rename(columns={'col1': 'rename_col1'})` 通过字典映射修改列名，此方法一般对部分列名进行修改时使用.

- 设定行索引的方法：`df.set_index('col')` 以 `col` 列作为新的索引列.

- 删除某个行或列的方法：`df.drop(['col1, col2', ...], axis=1)` 删除掉 `'col1', 'col2', ...` 列；`df.drop([index1, index2, ...], axis=0)` 删除掉行索引为 `index1, index2, ...` 的行. 如果加上 `replace=True` 的参数，则会在原表格上进行操作，无需重新赋值.

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

4. `df.apply(function, args=(arg1, ...), **kargs, axis=0)`：对表格 `df` 中的每一行切片提取出来，传入到 `function` 函数中进行处理，如果 `function` 函数有其他参数，则切片为第一个传入参数，后面的无初始化值的参数可以通过 `args` 传入，而有初始化参数可以直接传入参数及其对应的值，默认放到 `function` 函数中. 可以参考下图：

![DataFrame中apply传入参数](https://s1.ax1x.com/2023/01/22/pSJtI3V.png)

> 注：apply处理每行的信息速度要比逐个遍历每行做切片速度快得多.

5. `df.grouby('col').apply(function)`：对表格 `df` 中的 `'col'` 列相同元素进行提取，然后传入到 `function` 函数中进行处理. 适用于具有连续性数据处理，满足某种性质的数据均具有某个相同的属性值.

6. `df.drop_duplicates()`：对行进行去重，完全相同的行会只保留一个.

7. `df1.merge(df2, how='outer', on=['col1'])`：将表格 `df1, df2` 进行外合并，`on=['col1']` 表示以 `col1` 列作为每行的基准值（可以有多个基准值，例如 `['col1', 'col2']`，默认以行索引作为基准值）逐行进行合并，`how='outer'` 时为外合并，即对于两个表格中的全部基准值，相同基准值则会进行合并，不同基准值会用None填补，如果有多个相同基准值，则会添加额外的列显示；`how='inner'` 时为内合并，即只对两个表格中同时具有的基准值进行合并，如果某个基准值仅在一个表格中出现，则会将其丢弃.

8. `df.sort_values('col', ascending=True)`：表示将表格中的每行按照 `'col'` 列的元素递增形式进行排序，若 `ascending=False` 则以递降形式进行排序.

##### 数据清理

处理缺失的特征，有如下三种选择：

1. 丢弃缺失值对应的整行：`df.dropna(axis=0, subset=None)`，`axis=0` 表示清除规则为按行清除，`subset` 可以指定清除某一列的缺失值，默认为行清除，清除整个表格中的全部缺失值.

2. 丢弃缺失值对应的整列：`df.dropna(axis=1)`.

3. 将缺失值补全为某个值（0、平均数或中位数等）：例如，按0补全 `df['col1'].fillna(0)`

如此操作可能对于新数据处理不方便，因为可能出现新的列有缺失值，而上述补全方式不适用于对于新的一列进行补全，所以使用Scikit-Learn中的SimpleImputer方式可以更好的进行数据补全，参见另一篇文章[Scikit-Learn SimpleImputer类](./65380/#简易处理缺失值)

### dask

dask是一个支持对numpy，pandas高效并行处理的包，常用于处理超大文件，可以分块处理超大表格.

由于dask的使用方法和numpy，pandas类似，只需将 `np.array` 改为 `dask.Array`，`pd.DataFrame` 改为 `dask.DataFrame`，而且在操作命令上都基本相同，只不过并不会根据命令立刻执行操作，而是会产生一个延迟包 `dask.delayed`，会将操作的结果的框架返回，而不会计算出具体的数值，只有在操作的最后加上 `.compute()` 命令才会执行计算.

使用 `dask.diagnostics.ProgressBar` 包裹计算的命令即可显示处理的进度条：

```python
from dask.diagnostics import ProgressBar
with ProgressBar():
    out = delayed.compute()
```

#### DataFrame

`import dask.dataframe as dd` 读入包，读入到 `dask.dataframe` 之后的处理，与pandas基本完全一致，只需最后在计算时加上 `.compute()` 即可.

- 文件读取：`ddf = dd.read_csv(file_path, dtype=None)`，dask会根据每列的第一个数据对一整列的数据类型进行猜测，如果后续出现不同的数据类型，则会报出错误，会给出推荐的 `dtype` 类型指定，只需将其给出的建议加入到 `dtype` 参数位置即可.

- 通过 `pd.DataFrame` 转化：`ddf = dd.from_pandas(df, npartitions=32)`，从 `df` 转化为 `dask.DataFrame` 文件，划分为 `npartitions` 个块.

- 文件保存：`ddf.to_csv(save_path, single_file=True)`，保存也和pandas类似，但是如果直接调用保存api，则会根据划分的块，保存出多个文件，如果希望单个文件保存，可使用 `single_file=True`.

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
