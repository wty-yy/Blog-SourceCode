---
title: TensorFlow常用函数及模型写法
hide: false
math: true
category:
  - TensorFlow2
abbrlink: 48334
date: 2022-11-20 10:16:38
index_img:
banner_img:
tags:
 - TensorFlow
---

> [Inside TensorFlow - tf.Keras 笔记](/posts/2554/)

检查是否使用gpu

```python
tf.test.is_gpu_available()
tf.test.is_built_with_cuda()
```

---

使VScode能够识别keras中的函数，在`.\Anaconda3\envs\你的环境名\Lib\site-packages\tensorflow\__init__.py`中的末尾加入以下代码即可（参考[stack overflow - Vscode keras intellisense(suggestion) not working properly](https://stackoverflow.com/questions/68860879/vscode-keras-intellisensesuggestion-not-working-properly)）：

{% spoiler "展开/折叠代码" %}
```python
# Explicitly import lazy-loaded modules to support autocompletion.
# pylint: disable=g-import-not-at-top
if _typing.TYPE_CHECKING:
  from tensorflow_estimator.python.estimator.api._v2 import estimator as estimator
  from keras.api._v2 import keras
  from keras.api._v2.keras import losses
  from keras.api._v2.keras import metrics
  from keras.api._v2.keras import optimizers
  from keras.api._v2.keras import initializers
# pylint: enable=g-import-not-at-top
```
{% endspoiler %}

## Dataset

[参考文档 - tf.data创建TensorFlow输入流水线](https://tensorflow.google.cn/guide/data)，[参考教程 - YouTube codebasics](https://www.youtube.com/watch?v=VFEOskzhhbc).

### 数据读入与查看

读入方式：

- `tf.data.Dataset.from_tensor_slices(data)`：numpy型数据切片读入.

- `tf.data.Dataset.from_tensor_slices((x, y))`：直接读入数据的特征与对应的标签，以tuple类型保存.

- `tf.data.Dataset.list_files(path, shuffle=True)`：通过path读入文件的路径，还需后续进一步处理路径，shuffle为是否打乱数据集.

查看方式：

1. 直接使用for遍历查看
2. `ds.as_numpy_iterator()` 以numpy输出格式查看
3. `ds.take(n)` 取前 $n$ 个查看
4. `len(ds)` 可查看数据集大小

```python
data = [1, 2, -1, 5, -2, 6, 2, 3]
ds = tf.data.Dataset.from_tensor_slices(data)
len(ds)  # 查看数据集大小

for x in ds:
    x.numpy()  # 以numpy格式输出
    x  # 以tensor数据类型输出

for x in ds.as_numpy_iterator():
    x  # 以numpy格式输出

for x in ds.take(3):  # 遍历输出前3个数据
```

#### 处理文件路径

此处文件树如下所示

```tree
├─data_pipeline.ipynb
└─data
    ├─256_ObjectCategories
    │  ├─001.ak47
    │  ├─002.american-flag
    │  ├─003.backpack
    │  ├─004.baseball-bat
    │  ├─005.baseball-glove
    │  ├─006.basketball-hoop
    │  ├─...
```

读入文件路径

```
ds = tf.data.Dataset.list_files(r'data/256_ObjectCategories/*/*', shuffle=False)
# b'data\\256_ObjectCategories\\001.ak47\\001_0001.jpg'
# b'data\\256_ObjectCategories\\001.ak47\\001_0002.jpg'
# b'data\\256_ObjectCategories\\001.ak47\\001_0003.jpg'
```

获取子文件夹类别名称

```
from pathlib import Path
path = Path.cwd()
path = path.joinpath(r'data/256_ObjectCategories/')
class_names = [p.name for p in path.iterdir()]
# ['001.ak47',
#  '002.american-flag',
#  '003.backpack', ... 
```

划分数据集与测试集（注意不能对ds加入shuffle操作，否则可能会取到相同元素）

```
train_size = int(len(ds) * 0.8)
train_ds = ds.take(train_size)
test_ds = ds.skip(train_size)
```

将路径转化为对应特征与标签，在处理字符串中，只能将字符串作为tensor类型处理，可能是因为该类型是C++类型，结合tensorflow的io操作，可以进行读取文档，速度非常快.

[参考文档 - tf.strings](https://tensorflow.google.cn/api_docs/python/tf/strings)，[参考文档 - tf.io](https://tensorflow.google.cn/api_docs/python/tf/io)

```
import os
def get_label(path):
    fname = tf.strings.split(path, os.path.sep)[-2]  # 将路径分隔出文件名称部分，用os.path.sep进行分隔，可以避免系统的问题
    fname = tf.strings.split(fname, '.')[-1]  # 将文件名进一步分隔
    return fname
def process_image(path):
    label = get_label(path)
    
    img = tf.io.read_file(path)  # 读取为16进制文件
    img = tf.io.decode_jpeg(img)  # 解码为jpeg文件
    img = tf.image.resize(img, [128, 128])  # 将图像缩放为统一大小
    img /= 255  # 归一化处理
    
    return img, label
```

![处理后效果](https://s1.ax1x.com/2022/11/20/zMYHG8.png)

### 数据处理

数据处理一半都分为以下五步执行（`map` 和 `filter` 的顺序可能相反）.

- `Dataset.filter(func)`：可将func返回为true的值留下.
- `Dataset.map(func)`：可将数据替换为func的返回值.
- `Dataset.shuffle(buffer)`：设定缓冲大小为buffer打乱数据集，只会在每次提取数据时随机选取数据，随机原理参考 [StackOverflow - TensorFlow Dataset打乱原理](https://stackoverflow.com/questions/53514495/what-does-batch-repeat-and-shuffle-do-with-tensorflow-dataset).
- `Dataset.batch(batch_size)`：将数据以 `batch_size` 大小进行划分为batch.

```python
ds = ds.filter(lambda x : x > 0)  # 将x>0的元素留下
# 1 2 5 6 2 3
ds = ds.map(lambda x: x * 72)   # 将每个元素均乘以72
# 72 144 360 432 144 216
ds = ds.shuffle(3)  # 随机数据
# 72 360 144 216 144 432
ds = ds.batch(4)
# [ 72 432 360 144] [216 144]

# 整合为一行
ds = ds.filter(lambda x: x > 0).map(lambda y: y * 72).shuffle(3).batch(4)
```

[一个练习 - Exercise](https://github.com/codebasics/deep-learning-keras-tf-tutorial/blob/master/44_tf_data_pipeline/Exercise/tf_data_pipeline_exercise.md)

{% spoiler "练习答案" %}
```python
import tensorflow as tf
import numpy as np

ds = tf.data.Dataset.list_files(r'data/reviews/*/*', shuffle=False)
def get_label(path):
    import os
    return tf.strings.split(path, os.path.sep)[-2]
def process_data(path):
    label = get_label(path)
    text = tf.io.read_file(path)
    return text, label
def text_filter(x, y):
    return tf.strings.length(x) != 0

train_ds = ds.map(process_data).filter(text_filter).shuffle(10)
for x, y in train_ds:
    print(f'data:{x.numpy()[:30]}\nlabel:{y.numpy()}', end='\n\n')
```

输出结果：
```
data:b"Basically there's a family whe"
label:b'negative'

data:b'One of the other reviewers has'
label:b'positive'

data:b'A wonderful little production.'
label:b'positive'

data:b'This show was an amazing, fres'
label:b'negative'
```
{% endspoiler %}

## 数据增强

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

