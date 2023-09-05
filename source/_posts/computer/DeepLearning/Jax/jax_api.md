---
title: Jax+Flax+Optax 常用API
hide: false
math: true
abbrlink: 56847
date: 2023-09-03 09:49:08
index\_img:
banner\_img:
category:
 - 神经网络框架
 - Jax
tags:
 - Jax
---

## Jax, Flax, Optax 中的常用API

> 下述代码测试环境CPU: R7-4800U，无GPU

### Jax

#### jax.jit

[`jax.jit(func, static_argnums=None, static_argnames=None) -> jit_func`](https://jax.readthedocs.io/en/latest/_autosummary/jax.jit.html) 用于对**入参数类型为矩阵**的纯函数 `func` 进行编译返回包装后的函数 `jit_func`，其中 `static_argnums, static_argnames` 的参数分别为 `int/list[int]` 和 `str/list[str]`，分别表示入参中视为常数的索引编号（从零开始）和入参的的变量名，两者都可用于设定入参中的常量，功能一致。

> 调用 `jit_func` 的逻辑：首先会检查当前缓存中是否存在**入参相同的**以编译过的函数，若存在则直接调用当前以编译好的函数代值计算；若不存在，则会结合当前的入参，转化python代码为 `jax` 专门设计的一种较为底层的 `jaxpr` 代码（用 `print(jax.make_jaxpr(func)(*args))` 查看），这个 `jaxpr` 代码的生成需要执行一遍python代码，并**忽略**其中具有**副作用的函数**（会改变函数外的参数，例如 `print()` 等），最后生成的 `jaxpr` 不包含任何副作用函数，这样的函数也被称为**纯函数**，完成 `jaxpr` 生成后再用 `XLA` 进行编译，再将入参传入到编译后的函数中即可。
>
> 所以带有副作用的代码可以认为只会在编译时执行一次，之后再次以相同参数调用其时则不会执行。
>
> **入参不一定只能是矩阵，也可以是 `pytree`**：在 `Jax` 中称为 `ShapedArray`，也就是只看矩阵 `shape, dtype` 是否相同来判断是否可以使用相同的编译后的函数，这里的矩阵还可以是 `pytree` 中的叶子节点，`pytree` 一般指 `dict,list,tuple,NamedTuple` 等。

##### 固定参数的使用方法

固定参数的常用位置就是类函数（类中的函数），因为类函数的第一个参数默认传为 `self`，所以不是**类矩阵**类型，所以必须用 `static_argnums` 或 `stati_argnames`，在下面代码中，我通过 `apply` 类函数实现了一个简单的MLP，并在其中加入了类中的参数 `self.a, self.b`，这两个参数会直接转化为对应常量也就是 `1.0, 2.0` 直接进行编译。并对比了有无 `jax.jit` 装饰函数的速度，装饰后执行 `1e5` 次的速度为 `1s`，未装饰的速度为 `24.4s`。

```python
import jax, time
import jax.numpy as jnp
from functools import partial

N = int(1e5)
class Foo:
    def __init__(self) -> None:
        self.a = 1
        self.b = 2

    @partial(jax.jit, static_argnums=0)  # let `self` be static const
    # @partial(jax.jit, static_argnames='self')  # same as above line
    def apply(self, params, x):
        *layers, output = params
        for layer in layers:
            x = jax.nn.relu(x @ layer['w'] + layer['b']) + self.a
        return x @ output['w'] + output['b'] + self.b
    
shapes = [10, 32, 32, 2]
params = [{'w': jnp.ones((i,j)), 'b': jnp.zeros((j,))} for i, j in zip(shapes, shapes[1:])]
x = jnp.ones(shape=(1, 10))

foo = Foo()
foo.apply(params, x)  # convert to jaxpr and compile in XLA
st = time.time()
for _ in range(N):
    foo.apply(params, x)  # use compiled func in cache
print("time:", time.time() - st)  # 1s
# without jax.jit: 24.4s
```

想要验证是否 `self.a, self.b` 是以常数传入的，我们可以在每次执行函数前对其进行修改，如果时间增加则说明每次要重复编译，所以会导致用时上升，下面测试中可以看到总执行时间由 `1s` 变为 `2s`，可以说明确实重新进行了编译（也可以直接通过 `jax.make_jaxpr` 直接输出 `jaxpr` 语句，结果更加清楚）。

```python
for i in range(N):
    foo.a = i  # change the static const
    foo.apply(params, x)  # recompile the func
print("time:", time.time() - st)  # 2s
```

##### 谨慎使用for

在 `jax.jit` 中使用 `for` 循环是可行的，但是循环长度不能过多（一般100次以下），因为在 `jax.jit` 中会对 `for` 每一步进行展开，如果次数过多会导致编译速度极慢，不建议使用。一般做法是，像上文那样向前计算时可以用 `for`，但是训练模型时候，枚举上千个 `batch` 的 `for` 就不推荐写到 `jit` 中，而是将每个 `batch` 对梯度进行更新的函数进行 `jit` 一般称为 `train_step`（TF2常用的命名），然后将每个 `batch` 传入到 `train_step` 函数中，接受进行梯度更新后的参数集合。下文中给出了一个简单的例子：

```python
def train_step(params, batch):
    def loss_fn(params, x, y):
        ... calc loss ...
        return loss
    params = params - lr * jax.grad(loss_fn)(batch.x, batch.y)
    return params

dataset = ...
for batch in dataset:
    params = jax.jit(train_step(params, batch))
```

> 为了更快的加速速度，可以尽可能将大的 `for` 拆分为较小的循环部分继续训练。

##### 无法实现与入参相关的if和while语句

由于在 `XLA` 中编译的语句必然是陈述句，所以所有的条件语句中条件都必须视为常量才能够生成唯一的编译结果，在下面例子中， 通过判断 `x` 是向量还是矩阵，如果是向量则扩张一个维度以后再做矩阵乘法，如果是矩阵则直接做乘法，可以看出两个**入参不同的代码**转化出的 `jaxpr` 代码是有不同的，并且在 `jaxpr` 中是不包含 `if` 条件语句的。

{% spoiler "jaxpr代码生成" %}

```python
import jax
import jax.numpy as jnp

@jax.jit
def foo(x, w):
    if x.ndim == 1:  # since input variables are default ShapedArray, x.shape, x.ndim is ok
        x = x.reshape(1, -1)
    return x @ w

x1, w = jnp.ones((10,)), jnp.ones((10, 8))
print(jax.make_jaxpr(foo)(x1, w))
"""
{ lambda ; a:f32[10] b:f32[10,8]. let
    c:f32[1,8] = pjit[
      jaxpr={ lambda ; d:f32[10] e:f32[10,8]. let
          f:f32[1,10] = reshape[dimensions=None new_sizes=(1, 10)] d
          g:f32[1,8] = dot_general[dimension_numbers=(([1], [0]), ([], []))] f e
        in (g,) }
      name=foo
    ] a b
  in (c,) }
"""
x2, w = jnp.ones((1, 10)), jnp.ones((10, 8))
print(jax.make_jaxpr(foo)(x2, w))
"""
{ lambda ; a:f32[1,10] b:f32[10,8]. let
    c:f32[1,8] = pjit[
      jaxpr={ lambda ; d:f32[1,10] e:f32[10,8]. let
          f:f32[1,8] = dot_general[dimension_numbers=(([1], [0]), ([], []))] d e
        in (f,) }
      name=foo
    ] a b
  in (c,) }
"""
```

{% endspoiler %}

#### jax.grad

[`jax.grad(func, argnums=0, has_aux=False) -> grad_func`](https://jax.readthedocs.io/en/latest/_autosummary/jax.grad.html)对纯函数 `func` 中编号为 `argnums` 中的变量求数值导数（利用链式求导），`has_aux` 表示输出中是否带有辅助参数(Auxiliary)。

记函数 `func` 的入参分别为 $x_1,x_2,\cdots$，如果输出仅有一个，记为 $y$，则 `grad_func` 的输出为 $\nabla_{x_1}y$，如果要求多个变量的导数，例如 $x_1,x_2$，则设置 `argnums=[0, 1]`， 输出则为 $(\nabla_{x_1}y, \nabla_{x_2}y)$，如下所示：

```python
import jax

def foo(x1, x2, a):
    return 0.5 * ((x1 - a) ** 2 + (x2 - a) ** 2)

grad_foo_x1 = jax.jit(jax.grad(foo))
print(grad_foo_x1(5., 4., 1.))  # 4.0
grad_foo_x1_x2 = jax.jit(jax.grad(foo, argnums=[0,1]))
print(jax.device_get(grad_foo_x1_x2(5., 4., 1.)))
# (array(4., dtype=float32), array(3., dtype=float32))
```

如果包含多个输出，记为 $y_1,y_2,\cdots$，由于一次只能对一个函数求导，所以需要设置 `has_aux=True`，表示只对第一个输出求导，后续参数都视为辅助参数，直接返回，而不进行求导。

#### jax.value_and_grad

用法和 `jax.grad` 完全一致，只是以 `tuple` 的形式分别输出**函数返回值**和**梯度**：

```python
import jax

def foo(x1, x2, a):
    loss1 = (x1 - a) ** 2 / 2
    loss2 = (x2 - a) ** 2 / 2
    return loss1 + loss2, (loss1, loss2)

grad_foo = jax.jit(jax.value_and_grad(foo, has_aux=True))
(loss, (loss1, loss2)), grads = grad_foo(5., 4., 1.)
print(loss, loss1, loss2, grads)  # 12.5 8.0 4.5 4.0
```

#### jax.random

- [`jax.random.PRNGKey(seed) -> KeyArray`](https://jax.readthedocs.io/en/latest/_autosummary/jax.random.PRNGKey.html)：根据随机种子生成一个 `jax` 中用于生成随机数的 `jax.random.KeyArray` （一个类似长度2的列表），在 `jax` 中和随机数生成相关的函数必须包含该项。
- [`jax.random.normal(key, shape)`](https://jax.readthedocs.io/en/latest/_autosummary/jax.random.normal.html)：根据随机种子 `key`，由 $\mathcal{N}(0,1)$ 中的采样生成形状为 `shape` 的矩阵。
- [`jax.random.uniform(key, shape, minval=0.0, maxval=1.0)`](https://jax.readthedocs.io/en/latest/_autosummary/jax.random.uniform.html)：根据随机种子 `key`，由 $U(\text{minval}, \text{maxval})$ 中的采样生成形状为 `shape` 的矩阵。

#### pytree

在 `jax` 中，将所有 `list, dict, nametuple` 等具有层次结构的数据结构都可以视为 `pytree`，最常用的 `pytree` 就是神经网络中的参数字典，例如 `params = {'Dense1': {'w': ..., 'b': ...}, 'Dense2': {'w': ..., 'b': ...}}` 就是一颗典型的  `pytree`，在梯度下降中往往同过获得和 `params` 结构完全相同的梯度 `grads`，然后对其进行梯度更新。

[`jax.tree_map(func, trees = pytree | list[pytree])`](https://jax.readthedocs.io/en/latest/_autosummary/jax.tree_util.tree_map.html)：`func` 的输入参数数目和 `trees` 中的参数一一对应（`trees` 中的每棵树都必须保持相同的树形结构），将每个 `tree` 上对应的叶子节点视为函数 `func` 的输入，返回结果也是一个和 `trees` 中每个书保持相同的树形结构，每个叶子节点值为对应位 `func` 返回的结果。

```python
import jax, jax.numpy as jnp
from typing import NamedTuple

class Foo(NamedTuple):
    a: int
    b: float

tree = [1, 2, Foo(a=123, b=1.23), {'w': jnp.ones((3, 2)), 'b': jnp.zeros((2,))}]
print(jax.tree_map(lambda x: x * 2 + 1, tree))  # 作用于每个叶子节点上
tree2 = [3, 4, Foo(a=321, b=3.21), {'w': jnp.ones((3, 2)), 'b': jnp.zeros((2,))}]
print(jax.tree_map(lambda x, y: x + y, tree, tree2))  # 将两颗子树对应节点直接求和
```

### Flax

>  包名称缩写 `import flax.linen as nn`

`flax.linen` 下的常用函数：`nn.relu(x)`, `nn.max_pool(x, windows_shape, strides)`, `nn.softmax(x)`

#### flax.linen.initializers

`flax.linen.initializers` 中子类返回的参数生成的生成器 `flax.linen.initializers.Initializer`，常用生成器有如下一些：

- `nn.initializers.constant(value)`：以固定常量 `value` 生成参数。
- `nn.initializers.orthogonal(scale=1.0, column_axis=-1)`：以均匀分布 $U(-\text{scale},\text{scale})$ 生成正交阵，按照最后一个维度进行展开的向量是两两正交的。

#### flax.linen.Module

`flax.linen.Module` 为所有的深度网络层的父类，常用层有以下几个：

- [`nn.Dense(features, kernel_init=None, bias_init=None)`](https://flax.readthedocs.io/en/latest/api_reference/flax.linen/_autosummary/flax.linen.Dense.html)：`features` 为输出节点数目，`kernel_init` 和 `bias_init` 分别为转移矩阵和偏置的参数生成器。
- [`nn.Conv(features, kernel_size, strides=1, padding='SAME', kernel_init=None, bias_init=None)`](https://flax.readthedocs.io/en/latest/api_reference/flax.linen/_autosummary/flax.linen.Conv.html)：`features` 为卷积数，`kernel_size` 为卷积核大小，`strides` 为步长，`padding` 选项为 `[SAME, VALID, Sequence]` 分别为同大小填充、无填充、按照序列 `Sequence` 对每个维度进行零填充。

模型搭建通过继承 `nn.Module` 的方法有类 `pytorch` 的模型搭建方法，也有 `tensorflow` 的API式搭建方法，详细模型搭建方法请见 [Jax笔记 - MNIST数据集训练 模型搭建](/posts/8349/#模型搭建)。假设搭建后的模型为 `model`，其具有以下API：

- `params = model.init(rng_key, inputs)`：通过输入样本 `inputs` 及随机种子 `rng_key` 生成模型所需的所有参数，注意这里的 `inputs` 只会用到其矩阵形状，具体数值无所谓。
- `y_pred = model.apply(params, X)`：通过传入模型参数 `params` 和特征 `X`，得到模型的预测结果 `y_pred`。
- `print(model.tabulate(rng_key, inputs))`：输出模型的结构、包含参数个数、占用空间大小。

用到上述API的一个简单的例子：

```python
import jax, jax.numpy as jnp
import flax.linen as nn
from flax.linen.initializers import constant, orthogonal

class Model(nn.Module):

    @nn.compact
    def __call__(self, inputs):
        x = nn.relu(
            nn.Conv(
                64,
                kernel_size=(3, 3),
                kernel_init=orthogonal(jnp.sqrt(2)),
                bias_init=constant(0.0)
            )(inputs)
        )
        x = nn.max_pool(x, window_shape=(2, 2), strides=(2, 2))
        x = nn.relu(nn.Conv(128, kernel_size=(3, 3))(x))
        x = nn.max_pool(x, window_shape=(2, 2), strides=(2, 2))
        x = x.reshape(x.shape[0], -1)
        x = nn.relu(nn.Dense(64)(x))
        return nn.Dense(10)(x)
    
model = Model()
batch_size, img_shape = 32, (84, 84, 3)
key, X_key, m_key = jax.random.split(jax.random.PRNGKey(42), 3)
jax.random.KeyArray
X = jax.random.normal(X_key, (batch_size, *img_shape))
print(X.shape)
params = model.init(jax.random.PRNGKey(42), jnp.empty((batch_size, *img_shape)))
print(jax.tree_map(lambda x: x.shape, params))
print(model.tabulate(jax.random.PRNGKey(42), jnp.empty((batch_size, *img_shape))))
```

### Optax

主要包含一些[优化器](https://optax.readthedocs.io/en/latest/api.html)，优化器的使用方法和 `flax.nn.Module` 使用方法类似，也需要先实例化，再初始化生成优化器内部参数，例如每个参数的一二阶梯度等。

#### 优化器更新方法一

- `tx = optax.adam(learning_rate)`：以学习率为 `learning_rate` 创建 `adam` 优化器。
- `opt_state = tx.init(params: pytree)`：以**网络模型参数**为 `params` 以全零初始化优化器的状态，`opt_state` 中的每个pytree和 `params` 具有相同的树形结构。
- `updates, opt_state = tx.update(grads, opt_state)`：根据更新量 `grads` 对 `opt_state` 进行更新，得到新的优化器状态 `opt_state` 和对梯度的更新量 `updates`。
- `params = optax.apply_updates(params, updates)`：等价于 `params = jax.tree_map(lambda p, q: p + q, params, updates)` 将更新量 `updates` 加到在 `params` 的对应元素上。

下面以线性拟合为例展示优化器的更新使用方法：

```python
import numpy as np
import matplotlib.pyplot as plt
import jax, jax.numpy as jnp
import flax.linen as nn
import optax

np.random.seed(42)
model = nn.Sequential([nn.Dense(128), nn.Dense(1)])
params = model.init(jax.random.PRNGKey(42), jnp.empty((1,)))
tx = optax.adam(learning_rate=1e-3)
opt_state = tx.init(params)
x = np.random.normal(size=(100, 1))
y = x * 2 + 1 + np.random.normal(scale=0.2, size=(100, 1))

@jax.jit
def train_step(params, opt_state, x, y):
    loss, grads = jax.value_and_grad(lambda params, x, y: ((model.apply(params, x) - y) ** 2).mean(-1).sum())(params, x, y)
    updates, opt_state = tx.update(grads, opt_state)
    params = optax.apply_updates(params, updates)
    return params, opt_state, loss

for epoch in range(200):
    params, opt_state, loss = train_step(params, opt_state, x, y)
    if epoch % 20 == 0: print("loss:", loss)

plt.scatter(x, y, label='data')
plt.plot(x, model.apply(params, x), 'r', label='predict')
plt.legend(); plt.show()
```

#### 优化器更新方法二

上述更新优化器还是较为麻烦且重复，`from flax.training.train_state import TrainState` 可以很优雅的对模型进行更新：

- `state = TrainState.create(apply_fn, params, tx)`：通过三个参数初始化 `TrainState`，分别为模型的调用函数 `apply_fn`（此处可以为 `None`，及不指定函数，可以根据实际情况直接调用 `model.apply`），`params` 模型参数，`tx` 模型优化器。返回结果是一个 `NamedTuple` 子类所以可以通过 `state.apply_fn` 直接调用其存储的 `apply_fn` 函数，`params, tx` 同理。

  > `TrainState` 通过两个参数 `params, tx` 就可以初始化优化器的状态 `opt_state`，我们可以通过 `state.opt_state` 得到优化器的状态。

- `state = state.apply_gradients(grads=grads)`：通过直接传入梯度 `grads` 可以得到梯度更新后的全部结果，无需向上面那样先获取 `updates` 再对其进行更新的操作了。

还是上文线性拟合的例子，只不过用 `TrainState` 进行实现：

```python
import numpy as np
import matplotlib.pyplot as plt
import jax, jax.numpy as jnp
import flax.linen as nn
import optax
from flax.training.train_state import TrainState

np.random.seed(42)
model = nn.Sequential([nn.Dense(128), nn.Dense(1)])
state = TrainState.create(
    apply_fn=model.apply,
    params=model.init(jax.random.PRNGKey(42), jnp.empty((1,))),
    tx = optax.adam(learning_rate=1e-3)
)
x = np.random.normal(size=(100, 1))
y = x * 2 + 1 + np.random.normal(scale=0.2, size=(100, 1))

@jax.jit
def train_step(state: TrainState, x, y):
    def loss_fn(params, x, y):
        return ((state.apply_fn(params, x) - y) ** 2).mean(-1).sum()
    loss, grads = jax.value_and_grad(loss_fn)(state.params, x, y)
    state = state.apply_gradients(grads=grads)
    return state, loss

for epoch in range(200):
    state, loss = train_step(state, x, y)
    if epoch % 20 == 0: print("loss:", loss)

plt.scatter(x, y, label='data')
plt.plot(x, model.apply(state.params, x), 'r', label='predict')
plt.legend(); plt.show()
```

#### 模型参数保存

想要优雅的保存所有参数，只需将 `TrainState` 转化为二进制数据使用 `file.write` 进行保存：

- `flax.serialization.to_bytes(state)`：将 `state` 转化为二进制序列化信息，用于保存。
- `state = flax.serialization.from_bytes(state, bytes)`：将二进制序列化信息 `bytes` 读取到 `state` 中，注意 `state` 必须和二进制序列化信息具有相同的结构。

{% spoiler "一个例子"  %}

```python
import jax
import jax.numpy as jnp
import flax
from flax.training.train_state import TrainState
import flax.linen as nn
import optax
from pathlib import Path

class Model(nn.Module):
    
    @nn.compact
    def __call__(self, inputs):
        x = nn.Dense(128)(inputs)
        x = nn.relu(x)
        x = nn.Dense(128)(inputs)
        x = nn.relu(x)
        return nn.Dense(10)(x)

model = Model()
x = jnp.ones(shape=(10, 16))

state = TrainState.create(
    apply_fn=model.apply,
    params=model.init(jax.random.PRNGKey(42), x),
    tx=optax.adam(learning_rate=1e-4)
)

path = Path(__file__).parent.joinpath('model-0001')
with open(path, 'wb') as file:
    file.write(flax.serialization.to_bytes(state))  # save the state

state_ = TrainState.create(
    apply_fn=model.apply,
    params=model.init(jax.random.PRNGKey(1), x),
    tx=optax.adam(learning_rate=1e-4)
)

print(state_.params)

with open(path, 'rb') as file:
    state_ = flax.serialization.from_bytes(state_, file.read())  # load the state

print(state.params)
print(state_.params)
```

{% endspoiler %}

