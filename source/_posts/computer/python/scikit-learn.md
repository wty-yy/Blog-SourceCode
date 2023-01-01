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

## Scikit-Learn设计原则

参考论文[API design for machine learning software: experiences from the scikit-learn project](https://arxiv.org/abs/1309.0238)，这里给出Scikit-Learn的估计器模型一致具有的功能：

1. 估算：能够根据数据集对于某些参数进行估算的对象称为**估算器**. 估算通过 `fit()` 函数执行，参数为数据集（包含一个或两个参数，第二个参数可以为数据集标签）. 引导估算过程的其他参数称为**超参数**（可通过 `*.strategy` 查看），一般在构造实例时确定.

2. 转换：部分估算器可以转化数据集称为**转换器**（例如 [`imputer`](./#简易处理缺失值)）. 转换通过 `transform()` 函数执行，参数为待转换的数据集，返回的是转换后的数据集. 所有转换器都支持更为方便的函数 `fit_transform()`，相当于先调用 `fit()` 再调用 `transform()` 函数.

3. 预测：部分估算器可以基于给定的数据进行预测称为**预测器**（例如 `LinearRegression`）. 预测通过 `predict()` 函数执行，参数为待预测的数据集，返回数据集对应的预测结果. 还有可以进行评估，`score()` 用于衡量给定测试集的预测质量（输入为特征和对应标签）.

4. 检查模型：所有估计的超参数可以通过公共实例变量访问 `*.strategy`，所有估计其的学习参数可以通过有下划线的后缀公共实例变量访问，例如`*.statistics_`.

5. 数据类型：Scikit-Learn中所有的数据集都会使用 `Numpy` 或者 `SciPy` 稀疏矩阵表示，超参数为Python字符串或者数字.

6. 搭建估算器：可通过对转化器后加上预测器创建一个 `Pipline` 估算器.

## 数据处理

### 划分数据集

基于固定的随机种子进行的抽样.

#### 均匀抽样

设定随机种子进行均匀划分，`train_test_split(df, test_size=0.2, random_state=42)`：df为数据集，test_size为测试集比例，random_state为随机种子.

```python
from sklearn.model_selection import train_test_split

train, test = train_test_split(df, test_size=0.2, random_state=42)
```

#### 分层抽样

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

### 转换器

主要使用Scikit-Learn中的转化器进行数据集转化，转化器介绍请见[Scikit-Learn设计原则](./#scikit-learn设计原则).

#### 简易处理缺失值

使用 `SimpleImputer` 类对数据集中的缺失值进行填补（对每一列均进行相同的策略进行填补）.

```python
# 使用Scikit-Learn中的方式进行填补
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='median')  # 利用每列的中位数进行填补
df_num = df.drop('ocean_proximity', axis=1)  # 仅导入纯数字列
train_x = imputer.fit_transform(df_num)

print('填补策略:', imputer.strategy, '学习参数:', imputer.statistics_)
```

#### 特征缩放

Scikit-Learn中的特征缩放相关类属于 `sklearn.preprocessing`，这里给出两个常用的缩放方法：

1. 归一化 `MinMaxScaler`，将数据集减去最小值后除以最大值，`X = (X - np.min(X)) / np.max(X)`.

2. 标准化 `StandardScaler`，将数据集减去均值后除以标准差，`X = (X - np.mean(X)) / np.std(X)`.

使用方法遵循转化器的使用方法，首先实例化，然后利用 `.fit_transform(X)` 对数据进行转化.

{% spoiler "特征缩放类使用方法" %}
```python
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
std_scaler = StandardScaler()
mm_scaler = MinMaxScaler()
X = np.array(df_x[['housing_median_age']])

scale1 = std_scaler.fit_transform(X)  # 归一化
scale2 = mm_scaler.fit_transform(X)  # 标准化
```
{% endspoiler %}

#### 自定义转换器

为了方便地使用Scikit-Learn功能（例如搭建 `Pipline`），自定义的转换器一般需要满足如下三种函数：`fit(), transform(), fit_transform()`，转换器中 `fit()` 可以直接返回 `self`.

还可以通过添加父类 `sklearn.base.BaseEstimator` 这个类可以在实例化的过程中确定的超参数（构造函数中必须给定具体参数名称，不能有*arg或**kargs）进行保存，便于后续查看 `get_params()` 或修改 `set_params()`；通过添加父类 `sklearn.base.TransformerMixin` 这个类可以自动生成 `fit_transorm()` 函数，无需自己重写.

---

这里以对原数据集的特征加入新的属性为例：

1. 每户平均所用房间数: `rooms_per_households`.

2. 每户平均人口数：`population_per_households`.

3. 每间房的平均卧室数：`bedrooms_per_rooms`. （可选是否添加）

由于原始数据为DataFrame格式，转化为numpy后无法通过列名进行查找，所以先要给定列名与索引的查找关系，所需列的索引编号分别有 `total_rooms, total_bedrooms, population, households`.

```python
from sklearn.base import BaseEstimator, TransformerMixin

class CombinesAttributersAdder(BaseEstimator, TransformerMixin):
    def __init__(self, idxs, add_bedrooms_per_rooms=True):
        self.idxs = idxs
        self.add_bedrooms_per_rooms = add_bedrooms_per_rooms
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        rooms_per_households = (X[:, self.idxs['total_rooms']] / X[:, self.idxs['households']]).reshape([-1,1])
        population_per_households = (X[:, self.idxs['population']] / X[:, self.idxs['households']]).reshape([-1,1])
        ret = [X, rooms_per_households, population_per_households]
        if self.add_bedrooms_per_rooms:
            ret.append((X[:, self.idxs['total_bedrooms']] / X[:, self.idxs['total_rooms']]).reshape([-1,1]))
        return np.concatenate(ret, axis=1)

idxs = dict([(col, i) for i, col in enumerate(df_x.columns)])  # 获取列名与索引的对应关系
attr_adder = CombinesAttributersAdder(idxs, add_bedrooms_per_rooms=False)
df_extra_attribs = attr_adder.fit_transform(df_x.values)

# 可以通过set_params()和get_params() 修改、查看超参数
attr_adder.set_params(add_bedrooms_per_rooms=False)
attr_adder.get_params()
```

### 编码器

#### 文本转数字

使用 `sklearn.preprocessing.OrdinalEncoder` 转化器，每一个字符换转化为唯一对应的数字（从0开始）. 用法如下

```python
from sklearn.preprocessing import OrdinalEncoder
df_cat = df_x[['ocean_proximity']]  # 数据集中 ocean_proximity 列为字符数据，注意使用切片，要使得结果为矩阵而不是向量
ordinal_encoder = OrdinalEncoder()
df_cat_encoded = ordinal_encoder.fit_transform(df_cat)  # df_cat为字符串数据集
# 注: df_cat.shape 应该为 (-1, 1) 的形式（即是矩阵而不是向量）

print(ordinal_encoder.categories_)  # 显示转换器转化的类别名称
```

用数字表示类别，相近的数字可能会使机器认为两种类别相近，但实则不然，所以引入one-hot表示方法.

#### 文本转one-hot向量

one-hot向量本质就是将类别以仅含有0,1的向量形式表示出来，例如总类别数目为5个，若当前样本属于类别0，则它对应的one-hot向量为 `[1,0,0,0,0]`，即对应类别处为1，其他位置都是0.

使用 `sklearn.preprocessing.OneHotEncoder` 转化器可以很容易做到这点. 用法如下（转化结果为 `SciPy` 的稀疏矩阵形式，因为结果中有较多的 `0`，为了节省内存，使用稀疏矩阵仅保存 `1` 的位置，可通过 `.toarray()` 显示稀疏矩阵的内容）

```python
from sklearn.preprocessing import OneHotEncoder
onehot_encoder = OneHotEncoder()
df_cat_onehot = onehot_encoder.fit_transform(df_cat)

df_cat_onehot[:10].toarray()  # 显示前10行内容
```

{% spoiler "数字编码与one-hot编码的对应关系" %}
```python
# 数字 <-> 稀疏矩阵
[[1.],     [[0., 1., 0., 0., 0.],
 [4.],      [0., 0., 0., 0., 1.],
 [1.],      [0., 1., 0., 0., 0.],
 [4.],      [0., 0., 0., 0., 1.],
 [0.],      [1., 0., 0., 0., 0.],
 [3.],      [0., 0., 0., 1., 0.],
 [0.],      [1., 0., 0., 0., 0.],
 [0.],      [1., 0., 0., 0., 0.],
 [0.],      [1., 0., 0., 0., 0.],
 [0.]]      [1., 0., 0., 0., 0.]]
```
{% endspoiler %}

### 转换流水线

最为方便的数据预处理做法就是将上述的转换器全部堆叠起来，成为流水线式的转换操作，称之为 `Pipline`.

在Scikit-Learn中 `Pipline` 是由一系列的转换器进行的堆叠（也就是必须要有 `fit_transform()` 函数），而堆叠的最后一个只需是一个估计器（也就是可以只有 `fit()` 函数），最后流水线也具有最后一个估计器的功能，如果最后一个估计器有 `transform()` 函数，那么流水线也有 `fit_transform()` 函数，如果最后一个估计器有 `predict()` 函数，那么流水线也具有 `fit_predict()` 函数.

---

这里构造的流水线具有以下三个功能：

1. 数据缺失值处理（中位数填补）.

2. 属性值添加（自定义的转换器）.

3. 特征缩放（标准化转换器）.

`Pipline` 的构造函数包含一个元组列表，每个元组包含 `(名称, 转化器)`，第一个属性为转化器的名称，命名自定义（不包含双下划线，不能重复），第二个属性为转化器构造函数

```python
from sklearn.pipeline import Pipeline

num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy="median")),  # 转化器
    ('attribs_adder', CombinedAttributersAdder(idxs)),  # 转化器
    ('std_scaler', StandardScaler()),  # 仅需为估计器
])
df_num_tr = num_pipeline.fit_transform(df_num)
```

---

#### 对不同列分别进行转换

由于原数据集中既有数字特征，也有文本特征，所以需要分别做预处理，`sklearn.compose.ColumnTransformer` 可以很好的完成这项操作. 它可以非常好的适配 `DataFrame` 数据类型，通过列索引找到需要处理的列，最后逇返回值，会根据最终矩阵的稠密度来判断是否使用稀疏矩阵还是密集矩阵（矩阵密度定义为非零值的占比，默认阈值为 `sparse_threshold=0.3`）

构造函数中，需要一个元组列表，每个元组包含 `名称, 转化器, 列索引列表`，名称同 `Pipline` 的要求（自定义，不重复，无双下划线），列索引列表可以直接为 `DataFrame` 中的列名.

```python
from sklearn.compose import ColumnTransformer

# 从分层抽样后的训练数据中划分出特征与标签
df_x = strat_train.drop('median_house_value', axis=1)
df_num = df_x.drop('ocean_proximity', axis=1)  # 划分出纯数字特征，便于预处理
train_y = np.array(strat_train['median_house_value']).copy()  # 注意不要破坏原始数据集

num_attribs = list(df_num)  # numeral
cat_attribs = ['ocean_proximity']  # category

full_pipline = ColumnTransformer([
    ('num', num_pipeline, num_attribs),  # 将数字使用之前的pipline进行转化
    ('cat', OneHotEncoder(), cat_attribs),  # 将字符串转化为one-hot类别
])

train_x = full_pipline.fit_transform(df_x)
```

## 模型训练与评估

如果模型训练速度太慢，想看到训练进度可以在模型超参数设定处加入 `verbose=1`，就可以看到训练进度，`verbose` 数字越大数据越详细.

### 常用模型

#### 线性回归

```python
from sklearn.linear_model import LinearRegression

lin_reg = LinearRegression()
lin_reg.fit(train_x, train_y)  # 模型估计

x = train_x[:5]  # 测试部分训练数据
y = train_y[:5]
print("Predictions:", lin_reg.predict(x))  # 预测结果
print("Labels", list(y))  # 真实结果
```

#### 决策树

```python
from sklearn.tree import DecisionTreeRegressor

tree_reg = DecisionTreeRegressor()
tree_reg.fit(train_x, train_y)
```

#### 随机森林

```python
from sklearn.ensemble import RandomForestRegressor

# 可以设定随机种子；训练速度比较慢，有些时候可以查看训练进度
forest_reg = RandomForestRegressor(random_state=42, verbose=1)
forest_reg.fit(train_x, train_y)

# 随机森林模型还有每种类别的重要性分数
feature_importances = rand_search.best_estimator_.feature_importances_
# 进一步我们可以获得每种类别的重要度排名
extra_attribs = ['rooms_per_households', 'popultion_per_households', 'bedrooms_per_rooms']  # 额外加入的属性
cat_encoder = full_pipline.named_transformers_['cat']  # 获取字符串编码器的类别名
cat_attribs = list(cat_encoder.categories_[0])  # 字符串类别名
attributes = list(df_num) + extra_attribs + cat_attribs
sorted(zip(feature_importances, attributes), reverse=True)  # 对每种类别与对应的名称一并进行排名
```

### 模型评估

#### 交叉验证

一种简单的方法是使用 `train_test_split` 将训练集进一步划分为较小的训练集和验证集，然后使用较小的数据集进行训练，并在验证集上进行评估.

另一种方便的做法是使用Scikit-Learn中的K-折交叉验证功能 `sklearn.model_selection.cross_val_score`，假设 $K=10$，则具体做法是将训练集随机划分为10个不同的子集，每个子集称为一个折叠，对模型进行10次训练与评估——每次选取1个折叠作为验证集，剩余9个折叠作为训练集，返回一个包含10次评分的数组，评分规则可以在 `scoring` 属性中设定.

`cross_val_score(model, train_x, train_y, scoring=make_scorer(mean_squared_error), cv=10)`：待检验模型 `model`，训练集特征 `train_x`，训练集标签 `train_y`，`scoring` 打分标准（这里使用均方误差 `mean_squared_error`，还需要一个得分转化器，或者直接使用 `neg_mean_squared_error` 但返回的是负的均方误差)，`cv` 为划分的折叠个数为.

如果训练速度太慢，可以在模型构建处加入 `verbose` 参数，数字越大数据越详细.

```python
from sklearn.model_selection import cross_val_score
from sklearn.metrics import make_scorer, mean_squared_error

scores = cross_val_score(model, train_x, train_y, scoring=make_scorer(mean_squared_error), cv=10)
```

#### 均方误差

利用 `sklearn.metrics.mean_squared_error` 可以计算训练数据集上的均方误差MSE，另一个常用的是开更号后的结果RMSE.

```python
from sklearn.metrics import mean_squared_error

mse = mean_squared_error(train_y, model.predict(train_x))
rmse = np.sqrt(mse)
# 可用 mean_squared_error(train_y, model.predict(train_x), squared=False) 直接计算RMSE
```

### 模型微调

在通过交叉验证确定了有效的模型后，对其参数进行进一步微调.

#### 网格搜索

通过Scikit-Learn的 `sklearn.model_selection.GridSearchCV` 可以方便的尝试模型不同给定的参数组合，其会在不同的参数组合下进行交叉验证，所以也有 `cv` 参数设置，交叉验证的打分结果默认为越大越好，所以是参数是负的均方误差 `neg_mean_squared_error`，`return_train_score=True` 可以返回模型在训练集上的打分（一般用于判断模型的过拟合程度），`verbose=2` 可以看到具体算到第几个折叠了.

> 使用GridSearchCV自动探寻超参数：基于 `complete_pipline` 和双下划线 `__` 可以修改内部估计器的超参数. 这也就是不能用双下划线命名的原因.

这里以随机森林的网格搜索为例.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestRegressor

params_grid = [  # 总共进行12+6=18次评估
    {'n_estimators': [3, 10, 30], 'max_features': [2, 4, 6, 8]},  # 第一个评估组合，3x4=12
    {'bootstrap': [False], 'n_estimators': [3, 10], 'max_features': [2, 3, 4]},  # 第二个评估组合，2x3=6
]
forest_reg = RandomForestRegressor(random_state=42)

grid_search = GridSearchCV(forest_reg, params_grid, cv=5, scoring='neg_mean_squared_error', return_train_score=True, verbose=2)
grid_search.fit(train_x, train_y)  # 进行搜索

# 输出搜索到的最好参数组合
print(grid_search.best_params_)

# 输出不同参数对应的均值RMSE
cvres = grid_search.cv_results_
for mean_score, params in zip(cvres['mean_test_score'], cvres['params']):
    print(np.sqrt(-mean_score), params)

# 显示交叉验证全部结果（数据较多，用表格方便查看）
pd.DataFrame(grid_search.cv_results_)
```

#### 随机搜索

通过 `sklearn.model_selection.RandomizedSearchCV` 可以方便的尝试各种随机参数组合，用法和 `GridSearchCV` 类似，只是多了两个属性：迭代搜索次数 `n_iter` 和随机种子`random_state`.

通过 `scipy.stats.randint` 可以随机产生一定范围内的整数，便于尝试不同组合.（可以先用网格搜索找到参数的大致区间，然后再用随机搜索找更优的参数组合）

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint

params_distri = [  # 参数分布
    {'n_estimators': randint(3, 30), 'max_features': randint(2, 8)},
]
forest_reg = RandomForestRegressor(random_state=42)

rand_search = RandomizedSearchCV(forest_reg, params_distri, cv=5, n_iter=20, random_state=42,  # 随机搜索20次
                                 scoring='neg_mean_squared_error', return_train_score=True, verbose=2)
rand_search.fit(train_x, train_y)  # 进行搜索

# 输出最好的组合及得分
print("参数组合:", rand_search.best_params_)
print("得分:", np.sqrt(-rand_search.best_score_))

# 尝试过的组合及对应的打分
cvres = rand_search.cv_results_
for mean_score, params in zip(cvres['mean_test_score'], cvres['params']):
    print(np.sqrt(-mean_score), params)
```

### 模型保存

Scikit-Learn训练好的模型可以通过 `joblib.dump(model, 'model_name.pkl')` 非常方便的保存，载入只需 `joblib.load('model_name.pkl')` 即可.

{% spoiler "模型保存方法" %}
```python
import joblib

joblib.dump(model, "model.pkl")
model_loaded = joblib.load("model.pkl")
```
{% endspoiler %}
