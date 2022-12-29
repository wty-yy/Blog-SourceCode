---
title: Scikit-Learn 常用函数及模型写法
hide: false
math: true
abbrlink: 65380
date: 2022-12-29 15:19:13
index\_img:
banner\_img:
category:
 - 机器学习
tags:
 - scikit-learn
---

Scikit-learn安装

```shell
pip install scikit-learn  # 基础包安装
pip install scikit-image  # 图像处理包
```

## 划分数据集

基于固定的随机种子进行的抽样.

### 均匀抽样

设定随机种子进行均匀划分，`train_test_split(df, test_size=0.2, random_state=42)`：df为数据集，test_size为测试集比例，random_state为随机种子.

```python
from sklearn.model_selection import train_test_split

train, test = train_test_split(df, test_size=0.2, random_state=42)
```

### 分层抽样

分层划分数据集，由于测试集需要代表整个数据集的整体信息，首先对数据特征进行层划分，在每一层中，我们希望都要有足够的信息来表示这种类别，表示该层的重要程度.

1. 首先利用 `pd.cut()` 对层进行划分，例如划分为 $[0, 1.5, 3, 4.5, 6, \infty]$ 这样 $5$ 段.

2. 再使用Scikit中的api函数实例化划分模型 `split=StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)`：`n_splits` 表示划分的总数据集个数，`test_size` 为测试集占比，`random_state` 表示随机种子.

3. 最后通过迭代方式生成训练集与测试集：`train_idx, test_idx = next(split.split(df, df['income_cat']))`（由于只生成一个数据集，所以可以直接用next获取第一个迭代结果）

```python
from sklearn.model_selection import StratifiedShuffleSplit

df['income_cat'] = pd.cut(df['median_income'], bins=[0., 1.5, 3., 4.5, 6., np.inf], labels=[1,2,3,4,5])  # 根据需要划分出层


split = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(split.split(df, df['income_cat']))
strat_train = df.loc[train_idx]  # 分层抽样得到的训练集
strat_test = df.loc[test_idx]  # 分层抽样得到的训练集
for ds in (strat_train, strat_test):  # 最后删除用于分层的列income_cat
    ds.drop('income_cat', axis=1, inplace=True)
```

分层抽样与均匀抽象对于特定类别的抽样偏差（抽样偏差计算方法：$(sample - base) / base * 100$），这里以收入中位数进行划分为 $5$ 类，如左图所示，右图中的前三列为总体、分层、均匀每层的数据占比，右侧为分层、均匀的抽样偏差.

![分层抽样与均匀抽样的误差](https://s1.ax1x.com/2022/12/29/pSSvD6e.png)

{% spoiler "绘制直方图及计算偏差表格代码" %}
```python
df['income_cat'].hist()  # 绘制直方图
plt.show()

base_income_ratio = df['income_cat'].value_counts() / len(df)  # 计算总体每层占比
strat_income_ratio = strat_test['income_cat'].value_counts() / len(strat_test)  # 计算分层抽样每层占比
test_income_cate = pd.cut(test['median_income'], bins=[0., 1.5, 3., 4.5, 6., np.inf], labels=[1,2,3,4,5])  # 计算均匀抽样的分层后标签
random_income_ratio = test_income_cate.value_counts() / len(test)  # 计算均匀抽样每层占比

# 计算误差表格
def calc_error(base, x):
    return (x - base) / base * 100
diff_test_sample = pd.concat([base_income_ratio, strat_income_ratio, random_income_ratio,
                              calc_error(base_income_ratio, strat_income_ratio),
                              calc_error(base_income_ratio, random_income_ratio)], axis=1)
diff_test_sample.columns = ['Overall', 'Stratified', 'Random', 'Strated error %', 'Random error %']
diff_test_sample = diff_test_sample.sort_index()
diff_test_sample  # 显示表格
```
{% endspoiler %}
