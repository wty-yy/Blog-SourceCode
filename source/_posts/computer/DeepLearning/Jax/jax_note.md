---
title: Jax学习笔记
hide: false
math: true
abbrlink: 8349
date: 2023-08-21 23:38:24
index\_img:
banner\_img:
category:
 - 神经网络框架
 - Jax
tags:
 - Jax
---

# Jax note

## As accelerated Numpy

首先Jax有类似 `numpy` 的函数库，API使用基本一致：

```python
import jax.numpy as jnp
x = jnp.aranga(int(1e8))
%timeit jnp.dot(x, x)  # 比 np.dot() 要快, gpu上更快
```

### First Transformation `grad`

和数学中求导一致，Jax可以自动对Python中的**标量**纯函数进行求导计算，默认对函数传入中的第一个变量求导，还可以指定求导对象`jax.grad(func, argnums=(0,1,...))`：

```python
def mse(x, y):
    return jnp.sum((x-y)**2)
x = jnp.arange(5)  # [0, 1, 2, 3, 4]
y = x + jnp.full(5, 0.1)  # x + 0.1
print(jax.grad(mse)(x, y)  # 对x求导得到2*(x-y)
print(jax.grad(mse, argnums=(0, 1))(x, y))  # 分别对x, y进行求导得到2-tuple
```

求导函数要求输出为标量（scalar）不能是向量，也就是只能对以下可微函数 $f$ 求导：
$$
f:\mathbb{R}^n\to \mathbb{R},\quad (\nabla f)(x)_i = \frac{\partial{f}}{\partial{x_i}}(x), \quad (i=1,2,\cdots,n)
$$
不能是 $f:\mathbb{R}^n\to \mathbb{R}^m$，这样的 $\nabla f$ 是 $m\times n$ 的Jacobii矩阵。

所以对于机器学习中的损失函数，我们只用想下面这样写就行：

```python
def loss_fn(params, data):
    ...
grads = jax.grad(loss_fn)(params, data_batch)
```

这里直接调用 `jax.grad(...)` 不会重复编译函数，如果之前编译过相同输入的函数则直接从缓存中读取。

#### 一个例子

```python
def loss_fn(params, X, y):
  output = jnp.matmul(X, params['w']) + params['b']
  return jnp.sum((output - y) ** 2)
key = jax.random.key(1)
X = jax.random.normal(key, shape=(32, 764))
y = jnp.zeros(shape=(10,))
params = {'w': jax.random.normal(key, shape=(764, 10)), 'b': jnp.zeros(shape=(10,))}
print("loss:", loss_fn(params, X, y))
print("loss_dw_db:", jax.grad(loss_fn)(params, X, y))
```

#### 带额外参数的 `grad` 求导

上述的求导要求只能有一个标量输出，如果我们期望在求解过程中将过程量（例如，loss值）返回出来，那么可以使用参数 `has_aux`，使用方法如下：

- `jax.grad(func, has_aux=True)`：要求输出为2-tuples，其中第一个为函数的输出（标量），第二个可以是函数计算中的过程量（Auxiliary data, 任意类型，例如，字典）

```python
def mse_aux(x, y):
  return mse(x, y), {'add': x+y, 'del': x-y}
x = jnp.arange(5.)                 # [0. 1. 2. 3. 4.]
y = x + jnp.ones(shape=(5)) * 0.1  # [0.1 1.1 2.1 3.1 4.1]
jax.grad(mse_aux, has_aux=True)(x, y)  # (grad, aux: {...})  2-tuple
```

#### 与Numpy的区别

Jax特点就是函数式编程（Functional programming），也就是不要在函数中使用带有**副作用 (side-effect)**的代码，即**与当前函数输出无关的任何代码**。

```python
x = np.array([1, 2, 3])
def in_place_modify(x):
  x[0] = 123  # side-effect
  return None
```

在Jax对数组进行修改的方法是 `x.at[0].set(new_value)` 但这样会生成一个新的数组，原先的并不会进行修改：

```python
def jax_in_place_modify(x):
  return x.at[0].set(123)

y = jnp.array([1, 2, 3])
print(jax_in_place_modify(y))  # [123   2   3]
print(y)                       # [1 2 3]
```

由于Jax先编译后运行的特点，如果一个函数中的旧数组被修改后，没有再被使用到，则编译器就会进行原地修改，而非创建一个新的数组，验证如下，使用colab的免费GPU显存大小有11Gb，于是我创建了三个数组，大小合起来正好11Gb（如果前面两次修改创建了新的数组，则会导致显存溢出）：

```python
import jax
import jax.numpy as jnp
n = int(984263338)  # 984263338 × 4 ÷ 1024^3 × 3 = 10.99 Gb
key = jax.random.key(seed=1)
def memory_func():
  a = jnp.zeros(shape=(n,))
  b = a.at[0].set(jax.random.normal(key, shape=(1,))[0])  # inplace
  c = a.at[2].set(1)  # inplace
  d = jax.random.normal(key, shape=(n,))
  return jnp.dot(c, d)  # OK, use 11GiB
  # return jnp.dot(jnp.dot(c, d), b)  # wrong, need 12.83GiB
jit_func = jax.jit(memory_func)
import timeit
%timeit -r 1 -n 1 jit_func()  # 163 ms
```

#### 线性回归

尝试用Jax实现简单的线性回归，设数据集大小为 $N=10^6$。

1. 构建数据：

$$
y = wx + b + \varepsilon,\quad \varepsilon \sim \mathcal{N}(0,1)
$$

2. 定义模型和损失函数：

$$
\hat{y}(x;\theta) = \hat{y}(x:w,b) = wx+b\\
\mathcal{L}(x, y;\theta) = |y - \hat{y}(x;\theta)|^2
$$

3. 更新参数：

$$
\theta\gets \theta - \alpha \nabla_\theta \mathcal{L}(\theta)
$$

```python
%%timeit -r 5 -n 1  # 测试5次计算平均用时
import jax
import jax.numpy as jnp
import numpy as np
N = int(1e6)
key = jax.random.key(seed=1)  # 数据生成
X = jax.random.uniform(key, shape=(N,))
y = 4 * X + 1 + jax.random.normal(key, shape=(N,))
theta = {'w': jnp.array(1.), 'b': jnp.array(0.)}  # 初始化参数
lr = 0.01

def model(theta):
  return X * theta['w'] + theta['b']

def loss_fn(theta):
  return jnp.mean((model(theta) - y) ** 2)

def update(theta):
  grads = jax.grad(loss_fn)(theta)
  for key in theta.keys():
    theta[key] = theta[key] - lr * grads[key]
  return theta

for _ in range(1000):
  # theta = update(theta)  # 9.95 s, with out jax.jit, too slow!
  theta = jax.jit(update)(theta)  # 468 ms
```

## JIT

#### jaxpr语法转化

Jax的底层和TF是相同的，均使用XLA对数据进行并行计算加速，并且有类似 `@tf.function` 的图执行功能，在Jax中就是 `@jit` (just in time)，他将函数中不包含side-effect的部分先转化为 `jaxpr` 再用XLA编译，从而可以将编译后的函数部署在CPU、GPU或TPU上。

> 注意：只有在一次调用函数时才会根据传入的参数进行转化。

使用 `jax.make_jaxpr()` 先转化为显示 `jaxpr` 代码的函数，然后传入参数，查看转化后的 `jaxpr` 代码：

```python
def log2_with_print(x):
  print("printed x:", x)  # side-effect
  ln_x = jnp.log(x)
  ln_2 = jnp.log(2.0)
  return ln_x / ln_2

print(jax.make_jaxpr(log2_with_print)(3.))
"""
printed x: Traced<ShapedArray(float32[], weak_type=True)>with<DynamicJaxprTrace(level=1/0)>
{ lambda ; a:f32[]. let
    b:f32[] = log a
    c:f32[] = log 2.0
    d:f32[] = div b c
  in (d,) }
"""
```

输出 `jaxpr` 可以用于调试代码，函数中side-effect部分的代码虽然不会被编译到XLA中，但是在生成 `jaxpr` 过程中会执行其一次，所以可以认为所有的side-effect在编译函数的过程中只会被执行一次。

Jax是通过对每个参数用 `tracer` 类进行包装（跟踪），然后重建生成 `jaxpr` 代码，所以上述输出中可以看到 `x` 被 `Traced` 类包装。

> 这篇文章讲解了如何理解 `jaxpr`：[Understanding Jaxprs](https://jax.readthedocs.io/en/latest/jaxpr.html)

#### jit无法使用的情况

在函数中包含和输入的具体值相关而函数都是无法使用 `jit` 的，因为 `jaxpr` 的需要依赖于输入的具体值生成对应的代码，如果输入的具体值有限，则可以将其设为常量

```python
from functools import partial

@partial(jax.jit, static_argnames=['normal'])  # 例如normal是传入的常量
def f(x, normal=True):
  if normal:
    return (x - jnp.mean(x)) / jnp.std(x)  # 默认只编译改行
  return x  # 只有将normal设置为常量，才能编译改行
f(jnp.arange(5), False)
# 如果没有static_argnames，那么上面代码就会报错，因为normal换了一个参数，需要重新编译
```

在 `jit` 中执行任何和输入值相关的条件 `if, while` 都会报错，只有将条件中的变量设置常量，或者在输入的时候能确定下来，然后就能编译出来，Jax 的默认输入是 `ShapedArray` 类型，也就是默认其是数组，所以和维度相关的信息是可以作为条件的：

```python
@jax.jit
def func(x):  # .shape and .ndim is OK
  return 1 if x.shape == (1, 1) else 2 if x.ndim == 1 else x
print(func(jnp.array([[10]])), func(jnp.array([10])), func(10))  # 1 2 10
# 这样就会根据输入的不同，编译三次
```

## Pytree

Jax将Python中的字典或者递归式构造的数据结构统称为Pytree，每个字典中的 `key` 或者 `list` 中的一个索引对应树上的一个分支，例如：

```python
example_trees = [
    {'biases': jnp.zeros(64), 'weights', jnp.ones(5, 64)},
    {'biases': jnp.zeros(128), 'weights', jnp.ones(64, 128)},
    {'biases': jnp.zeros(1), 'weights', jnp.ones(128, 1)},
]
```

就是一个包含6个叶子节点的树，jax中常用的树上操作有：

1. `jax.tree_map(func, pytree1, pytree2, ...)`：对 `pytree` 中每个叶子节点作用函数 `func`，并且可以对多颗结构相同的 `pytree` 的对应元素作用 `func` 函数，`func` 函数包含多个输入参数即可。
2. `jax.tree_util.tree_leavs(pytree)`：显示 `pytree` 的所有叶子节点。

`jax.tree_map` 常用于更新梯度：

```python
grads = jax.grad(loss_fn(params, X, y))  # 求出梯度
params = jax.tree_map(lambda p, g: p - learning_rate * g, params, grads)  # 梯度下降
```

## Vectorization

在Jax如果要对Batch中每个样本执行某个函数，例如将样本的特征由类别标签转化为one-hot向量，直接执行 `for` 循环效率太低，Jax提供了一个效率很高且易于使用的构造函数 `jax.vmap` （Vector map）解决该问题，在 `jax.vmap` 外部套上 `jax.jit` 就可以并行执行向量化操作：

`jax.vmap(func, in_axes=0 | Sequence[int], out_axes=0)`：返回一个函数向量化执行函数，函数的输入按照 `in_axes` 给定的维度进行展开，第 `i` 个 `in_axes` 值对应的第 `i` 个入参的展开维度，如果对应展开维度为 `None`，则不进行展开，直接传入；`out_axes` 表示 `func` 函数的输出结果按照第 `out_axes` 维度进行堆叠，默认为 `0`。

```python
def one_hot(y, deep):  # 将单个样本的特征转化为one-hot向量
  ret = jnp.zeros(deep, dtype='float32')
  return ret.at[y].set(1)
batch_one_hot = jax.jit(lambda y: jax.vmap(one_hot, in_axes=[0, None])(y, 10))
# 这里in_axes=[0,None]表示第一个输入y按照第0个维度展开，第二个输入10不进行展开，直接传入到deep中
y_train, y_test = batch_one_hot(y_train), batch_one_hot(y_test)
```

## PRNGKey(pseudo-random number generator key)

在Jax中所有的伪随机数（pseudo random number, PRN）都是基于key的二元组生成的，key的生成方法如下：

```python
key = jax.random.PRNGKey(seed=42)  # 给定随机种子
```

所有使用随机数相关的函数均需要消耗一个key，所以为了保证实验的可重复性，每次消耗key前需要对其进行分解（至少分解成俩）我们保留其中一个，另一个用于生成随机数，使用过的key就不用再被使用了，下次再分解就去用新的key：

```python
# 注意以下这两种方法都可以保证随机结果固定的，但两种方法的数值是不一样的
key = random.PRNGKey(42)
key, subkey = random.split(key, num=2)
x = random.normal(subkey, (5,))
key, subkey = random.split(key, num=2)
y = random.normal(subkey, (5,))
"""
x = Array([-0.55338794,  0.944283  , -0.74176395, -0.5769758 ,  1.1251862 ],
y = Array([-0.32761317, -0.4066346 ,  1.2469071 ,  1.1900425 ,  1.100263  ],
"""
key, x_key, y_key = random.split(key, num=3)
x = random.normal(x_key, (5,))
y = random.normal(y_key, (5,))
"""
x = Array([-1.8231415, -0.472541 ,  0.7561724, -1.598711 ,  1.1073328],
y = Array([ 0.25185442,  0.8842529 ,  1.6303467 ,  0.01147595, -1.1791474 ],
"""
```

## MNIST数据集训练

### Jax + Flax + Optax

#### 模型搭建

Flax主要负责深度网络模型搭建，通过继承父类 `nn.Module` 实现，具体有两种搭建方式 [官方解释 - setup vs compact](https://flax.readthedocs.io/en/latest/guides/setup_or_nncompact.html)：

1. `@nn.compact`：类似TF2的函数式构建方法，只需重构 `__call__(self, inputs)`，其余只需通过调用函数（`nn.Dense`, `nn.relu`）即可，这些层都是 `nn.Module` 的子类

```python
import flax.linen as nn
class Model(nn.Module):

  @nn.compact
  def __call__(self, inputs):
    inputs = inputs.reshape(inputs.shape[0], -1) / 255.
    x = nn.Dense(128, name='Dense1')(inputs)
    x = nn.relu(x)
    x = nn.Dense(128, name='Dense2')(x)
    x = nn.relu(x)
    outputs = nn.Dense(10, name='Output')(x)
    return outputs
```

2. `setup`：类似Pytorch的构建方法，需要重构 `setup(self)`，并在其中先初始化好模型中带参数的层，例如全链接层，然后在 `__call__(self, inputs)` 中建立层之间的计算关系

```python
class Model_setup(nn.Module):

  def setup(self):
    self.dense1 = nn.Dense(128, name='Dense1')
    self.dense2 = nn.Dense(128, name='Dense2')
    self.output = nn.Dense(10, name='Output')
  
  def __call__(self, inputs):
    inputs = inputs.reshape(inputs.shape[0], -1) / 255.
    x = self.dense1(inputs)
    x = nn.relu(x)
    x = self.dense2(x)
    x = nn.relu(x)
    outputs = self.output(x)
    return outputs
```

#### 模型初始化及结构显示

在搭建完模型之后通过给定初始化 `key` 完成参数构建，并且可以通过 [clu](https://github.com/google/CommonLoopUtils) 中 `clu.parameter_overview`

```python
model = Model()
key, m_key = random.split(key, 2)
params = model.init(m_key, X_train[0:1])  # 初始化模型参数
from clu.parameter_overview import get_parameter_overview
print(get_parameter_overview(params))
""" 效果如下
+----------------------+------------+---------+-----------+--------+
| Name                 | Shape      | Size    | Mean      | Std    |
+----------------------+------------+---------+-----------+--------+
| params/Dense1/bias   | (128,)     | 128     | 0.0       | 0.0    |
| params/Dense1/kernel | (784, 128) | 100,352 | -3.18e-05 | 0.0357 |
| params/Dense2/bias   | (128,)     | 128     | 0.0       | 0.0    |
| params/Dense2/kernel | (128, 128) | 16,384  | -3.94e-06 | 0.0894 |
| params/Output/bias   | (10,)      | 10      | 0.0       | 0.0    |
| params/Output/kernel | (128, 10)  | 1,280   | -0.000669 | 0.0911 |
+----------------------+------------+---------+-----------+--------+
Total: 118,282
"""
```

#### 优化器

`optax` 包提供了很多[常用优化器](https://optax.readthedocs.io/en/latest/api.html)（当然基于 `jax` 这些优化器都可以自己实现，只需要记录下每个权重对应的动量一阶矩和二阶矩还有当前更新的次数，就可以计算 `Adam` 优化器的结果了），创建一个优化器及其直接更新梯度方法如下：

```python
import optax
tx = optax.adam(learning_rate=1e-3)  # 创建优化器
opt_state = tx.init(params)  # 初始化优化器，这里无需随机种子，因为动量全部初始化为0

@jax.jit
def train_step(params, opt_state, X, y, idxs):
  X, y = X[idxs], y[idxs]
  def loss_fn(params, x, y):
    logits = model.apply(params, x)
    loss_val = -jnp.sum(y * jax.nn.log_softmax(logits, axis=-1), axis=-1)  # 交叉熵
    return jnp.mean(loss_val)
  loss_grad_fn = jax.value_and_grad(loss_fn)

  loss_val, grads = loss_grad_fn(params, X, y)  # 计算梯度 grads
  updates, opt_state = tx.update(grads, opt_state)  # 通过 tx.update 求出用于梯度更新的updates
  params = optax.apply_updates(params, updates)  # 等价于 jax.tree_map(lambda p, u: p+u, params, updates) 更新梯度
  return params, opt_state, loss_val
```

然而有胡 `tx.update()` 和 `optax.apply_updates()` 这两个操作是在给定 `grads` 和 `params` 后就可以直接更新，所以  `flax.training.train_state` 中类 `TrainState` 就是通过给定参数，直接一步更新梯度：

```python
from flax.training.train_state import TrainState
state = TrainState.create(  # 通过 create 方法初始化训练状态
    apply_fn=model.apply,  # 这个并不重要，也可以为None，只要能够计算出loss即可
    params=model.init(m_key, X_train[0:1]),  # 只需params和tx就可以一步求梯度了
    tx=optax.adam(learning_rate=1e-3),
)
```

想要再将 `TrainState` 中加入其他参数，例如 `metrics` 那就有点复杂了，可以参考 [Flax - quick start](https://flax.readthedocs.io/en/latest/getting_started.html#create-a-trainstate)，其实 `metrics` 可以自行通过函数的输出结果自行计算，无需使用 `clu.metrics` 中的度量器进行更新（较为复杂）。

`TrainState` 这个类包含的参数有：

1. step：模型更新次数。
2. `apply_fn`：一般存储模型的预测函数，例如 `model.apply(params, X)`，也可以不存储。
3. `params`：模型的权重，是一种 `pytree`。
4. `tx`：模型所用的优化器，是 `optax.GradientTransformation` 的子类。
5. `opt_state`：优化器的状态，再确定 `tx` 后会进行创建。

```python
def train_step(state, X, y):
    def loss_fn(params, X, y):  # 构建损失函数
        ...
        return loss
   	grad_fn = jax.grad(loss_fn)  # 梯度函数
    grads = grad_fn(state.params)  # 计算梯度
    state = state.apply_gradient(grads=grads)  # 更新状态，注意这里一定要写明 grads=...（这是python中函数传入参数是以*开头的要求，必须通过关键字传递参数，称之为"星号参数"或"解包参数"）
```

以 `Adam` 为例，可以通过 `opt_state[0].mu['params']` 查看一阶矩的参数，同理 `opt_state[0].nu['params']` 是二阶矩参数：

```python
jax.tree_map(lambda x, y: (x.shape, y.shape), state.opt_state[0].mu['params'], state.opt_state[0].nu['params'])
"""
{'Dense1': {'bias': ((128,), (128,)), 'kernel': ((784, 128), (784, 128))},
 'Dense2': {'bias': ((128,), (128,)), 'kernel': ((128, 128), (128, 128))},
 'Output': {'bias': ((10,), (10,)), 'kernel': ((128, 10), (128, 10))}}
"""
```

### 速度测试

这里比较了Jax和TF的训练速度（使用CPU计算，锐龙R7 4800U），每个epoch，Jax用时2~3s，TF用时5s。

#### Jax

在MNIST数据集上进行训练的方法如下：

1. 首先通过 `(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()` 获取数据集。
2. 利用 `jax.vmap` 将标签构建为 `one_hot` 向量。
3. 使用 `flax` 搭建自定义模型 `nn.Module`，并定义 `TrainState` 类用于纪录参数。
4. 定义 `train_step` 函数，每次将划分好的 `batch_idxs` 传入（数据集），并在其中定义损失函数 `loss_fn`，利用 `jax.value_and_grad()` 计算损失值及其导数，最后用 `state.apply_gradient(grads=grads)` 更新状态。
5. 实现主函数中的 `epoch` 循环和 `batch` 索引通过排列随机生成。

这里我还额外加上了准确率计算函数 `accuracy(params, X, y)` 用于计算训练集和测试集上模型的准确率，完整代码：

```python
import tensorflow as tf
from tensorflow import keras
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()
import jax
import jax.numpy as jnp
from jax import random
import optax
import flax.linen as nn
from flax.training.train_state import TrainState
from tqdm import tqdm

def one_hot(y, deep):
  ret = jnp.zeros(deep, dtype='float32')
  return ret.at[y].set(1)
batch_one_hot = jax.jit(lambda y: jax.vmap(one_hot, in_axes=[0, None])(y, 10))
X_train, X_test = jnp.array(X_train), jnp.array(X_test)
y_train, y_test = batch_one_hot(y_train), batch_one_hot(y_test)

N = X_train.shape[0]
epochs = 3
batch_size = 32

class Model(nn.Module):

  @nn.compact
  def __call__(self, inputs):
    inputs = inputs.reshape(inputs.shape[0], -1) / 255.
    x = nn.Dense(128, name='Dense1')(inputs)
    x = nn.relu(x)
    x = nn.Dense(128, name='Dense2')(x)
    x = nn.relu(x)
    outputs = nn.Dense(10, name='Output')(x)
    return outputs

model = Model()
key, m_key = random.split(random.PRNGKey(42), 2)

state = TrainState.create(
    apply_fn=model.apply,
    params=model.init(m_key, X_train[0:1]),
    tx=optax.adam(learning_rate=1e-3),  # not need opt_state
)
@jax.jit
def train_step(state, idxs):

  def loss_fn(params, X, y):
    logits = state.apply_fn(params, X)
    loss_val = -jnp.sum(y * jax.nn.log_softmax(logits, axis=-1), axis=-1)
    
    return jnp.mean(loss_val)
  
  loss_grad_fn = jax.value_and_grad(loss_fn)
  
  X_batch, y_batch = X_train[idxs], y_train[idxs]
  loss_val, grads = loss_grad_fn(state.params, X_batch, y_batch)
  state = state.apply_gradients(grads=grads)
  
  return state, loss_val

@jax.jit
def accuracy(params, X, y):
  logits = model.apply(params, X)
  y_pred = jnp.argmax(logits, axis=-1)
  y_true = jnp.argmax(y, axis=-1)
  return jnp.mean(y_pred == y_true)
show_acc = lambda params, X, y: round(float(accuracy(params, X, y)), 2)

for epoch in range(epochs):
  key, p_key = random.split(key)
  idxs = random.permutation(p_key, N)
  loss_mean = 0.
  for i in tqdm(range(0, N, batch_size)):
    batch_idxs = idxs[i:i+batch_size]
    state, loss_val = train_step(state, batch_idxs)
    loss_mean += (loss_val - loss_mean) / (i + 1)
  print(f"Epoch {epoch+1}/{epochs} loss", loss_mean, "acc train/test:",
        f"{show_acc(state.params, X_train, y_train)}/{show_acc(state.params, X_test, y_test)}")
```

训练结果

```txt
100%|██████████████████████████████████████| 1875/1875 [00:03<00:00, 514.70it/s]
Epoch 1/3 loss 2.0387044 acc train/test: 0.97/0.96
100%|██████████████████████████████████████| 1875/1875 [00:02<00:00, 762.39it/s]
Epoch 2/3 loss 0.057492483 acc train/test: 0.98/0.97
100%|██████████████████████████████████████| 1875/1875 [00:02<00:00, 780.67it/s]
Epoch 3/3 loss 0.17737485 acc train/test: 0.98/0.97
```

#### TF

实现上明显更简单，但是速度不如Jax。

```python
import tensorflow as tf
from tensorflow import keras
layers = keras.layers

(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

def convert_sample(x, y):
    x = tf.cast(x, 'float32')
    return x / 255., tf.one_hot(y, depth=10)
ds_train = tf.data.Dataset.from_tensor_slices((X_train, y_train)).map(convert_sample).batch(32)
ds_test = tf.data.Dataset.from_tensor_slices((X_test, y_test)).map(convert_sample).batch(32)

def build_model():
  inputs = layers.Input(shape=(28,28))
  x = layers.Reshape((784,))(inputs)
  x = layers.Dense(128, activation='relu', name='Dense1')(x)
  x = layers.Dense(128, activation='relu', name='Dense2')(x)
  outputs = layers.Dense(10)(x)
  return keras.Model(inputs, outputs)
model = build_model()
model.compile(
    loss=keras.losses.CategoricalCrossentropy(from_logits=True),
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    metrics=['acc']
)
model.fit(ds_train, validation_data=ds_test, epochs=3)
```

训练结果

```txt
1875/1875 [==============================] - 5s 3ms/step - loss: 0.2367 - acc: 0.9311 - val_loss: 0.1358 - val_acc: 0.9568
Epoch 2/3
1875/1875 [==============================] - 5s 3ms/step - loss: 0.1009 - acc: 0.9696 - val_loss: 0.1117 - val_acc: 0.9654
Epoch 3/3
1875/1875 [==============================] - 5s 3ms/step - loss: 0.0667 - acc: 0.9793 - val_loss: 0.1513 - val_acc: 0.9543
```

