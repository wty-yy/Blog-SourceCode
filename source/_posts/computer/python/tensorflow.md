---
title: TensorFlow常用函数及模型写法
hide: false
math: true
category:
  - 机器学习
abbrlink: 48334
date: 2022-11-20 10:16:38
index_img:
banner_img:
tags:
 - TensorFlow
---

检查是否使用gpu

```python
tf.test.is_gpu_available()
tf.test.is_built_with_cuda()
```

## Dataset

[参考文档 - tf.data创建TensorFlow输入流水线](https://tensorflow.google.cn/guide/data)，[参考教程 - YouTube codebasics](https://www.youtube.com/watch?v=VFEOskzhhbc).

### 数据读入与查看

- `tf.data.Dataset.from_tensor_slices(data)`：数据切片读入.

1. 遍历查看
2. `ds.as_numpy_iterator()` 以numpy输出格式查看
3. `ds.take(n)` 取前 $n$ 个查看

```python
data = [1, 2, -1, 5, -2]
ds = tf.data.Dataset.from_tensor_slices(data)
len(ds)  # 查看数据集大小

for x in ds:
    x.numpy()  # 以numpy格式输出
    x  # 以tensor数据类型输出

for x in ds.as_numpy_iterator():
    x  # 以numpy格式输出

for x in ds.take(3):  # 遍历输出前3个数据
```

[StackOverflow - TensorFlow Dataset打乱原理](https://stackoverflow.com/questions/53514495/what-does-batch-repeat-and-shuffle-do-with-tensorflow-dataset)

[Exercise](https://github.com/codebasics/deep-learning-keras-tf-tutorial/blob/master/44_tf_data_pipeline/Exercise/tf_data_pipeline_exercise.md)

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

