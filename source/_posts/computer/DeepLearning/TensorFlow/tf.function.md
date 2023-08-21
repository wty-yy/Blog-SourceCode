---
title: tf.function笔记
hide: false
math: true
abbrlink: 53297
date: 2023-07-25 12:02:17
index\_img:
banner\_img:
category:
 - 神经网络框架
 - TensorFlow2
tags:
 - TensorFlow
---

## tf.function

> 参考：
>
> 1. [YouTube - tf.function and Autograph (TF Dev Summit ‘19)](https://www.youtube.com/watch?v=Up9CvRLIIIw)
>
> 2. [tensorflow.org - tf.function](https://tensorflow.google.cn/api_docs/python/tf/function?hl=en)
>
> 3. [CSDN【Tensorflow教程笔记】常用模块 tf.function ：图执行模式](https://blog.csdn.net/nanke_4869/article/details/114220354)

```python
import tensorflow as tf
```

`tf.function`修饰的函数会将其中的操作转化为Graph execution（图执行），效率会高于Eagerly execution（直接计算，step by step）


```python
v = tf.Variable(1.)
@tf.function
def f(x):
    return v.assign_add(x)
```

### Speed: Graph execution > Eagerly execution


```python
# lstm_cell = tf.keras.layers.LSTMCell(10)
dense_layer = tf.keras.layers.Dense(4096, activation='relu')
@tf.function
def fn(input):
    return dense_layer(input)

input = tf.ones((128,1024)); state = [tf.zeros([10, 10])] * 2

from timeit import timeit
# slow 0.8845837010001105
print(timeit(lambda: dense_layer(input), number=100))
# fast 0.616030851000005
print(timeit(lambda: fn(input), number=100))
```


### 计算图的重复利用与重建

通过`@tf.function`修饰的函数被称为泛型函数(GenericFunction)，而每次调用该函数就会进行实例化，会基于传入参数的属性得到对应的具象函数(ConcreteFunction)，通过`fn.get_concrete_function()`可以将`GenericFunction`转化为`ConcreteFunction`，对于`ConcreteFunction`就存在计算图可以修改（修改方式应该和TF1.x类似）：

- `fn.get_concrete_function(实参/tf.TensorSpec())`：向函数具象化里传入**实参**或者指定传入的`Tensor`类型。


```python
@tf.function
def add_double(a):
    return a + a
a = add_double(tf.ones([2, 2], dtype='float32'))  # [[2. 2.], [2. 2.]]
b = add_double(tf.ones([2, 2], dtype='int32'))  # [[2 2], [2 2]]
c = add_double('a')  # b'aa'
print(a, b, c, sep='\n')
print(type(add_double))  # polymorphic_function.Function
print(type(fn))  # monomorphic_function.ConcreteFunction
print(type(fn.graph))  # func_graph.FuncGraph
```


并且要避免向`tf.function`传递Python中的标量或者列表，这会导致计算图的重复构建，降低效率。


```python
@tf.function
def f(x):
  return tf.abs(x)
f1 = f.get_concrete_function(1)
f2 = f.get_concrete_function(2)  # Slow - compiles new graph
print(f1 is f2)  # false

f1 = f.get_concrete_function(tf.constant(1))
f2 = f.get_concrete_function(tf.constant(2))  # Fast - reuses f1
print(f1 is f2)  # true
```


当多次创建计算图时（大于5次），TF就会发出警告


```python
f(1)
f(2)
f(3)
f(4)
f(5)
f(6)
"""
WARNING:tensorflow:5 out of the last 6 calls to <function f at 0x7fef69992b60> triggered tf.function retracing. Tracing is expensive and the excessive number of tracings could be due to (1) creating @tf.function repeatedly in a loop, (2) passing tensors with different shapes, (3) passing Python objects instead of tensors. For (1), please define your @tf.function outside of the loop. For (2), @tf.function has reduce_retracing=True option that can avoid unnecessary retracing. For (3), please refer to https://www.tensorflow.org/guide/function#controlling_retracing and https://www.tensorflow.org/api_docs/python/tf/function for  more details.
"""
```

### 计算图的输入限制

可以在两个位置对计算图的输入参数进行限制

1. `fn.get_concrete_function(tf.TensorSpec(), tf.TensorSpec(), ...)`：在函数具象化时加入限制，得到结果是`ConcreteFunction`
2. `@tf.function(input_signature=[tf.TensorSpec(), tf.TensorSpec(), ...])`：在`tf.function`构建时候就通过`input_signature`属性对输入进行限制，得到的函数是`GenericFunction`

上述两个方法都是有多少个输入变量就写多少个`tf.TensorSpec()`


```python
# 加入函数的输入变量形式的限制，利用tf.TensorSpec，tensor specific
fn = add_double.get_concrete_function(tf.TensorSpec(shape=None, dtype='string'))
print(fn(tf.constant('a')))  # b'aa'
print(fn(tf.constant(1)))  # error
```

```python
# one input
@tf.function(
    input_signature=[tf.TensorSpec(shape=None, dtype='string')])
def add_double(a):
    return a + a
print(add_double('a'))  # b'aa'
try: add_double(tf.constant(1))  # error!
except: print("error!!!")
```

```python
# two input
@tf.function(
    input_signature=[tf.TensorSpec(shape=None, dtype='int32'),
                     tf.TensorSpec(shape=None, dtype='float32')])
def add(a, b):
    a = tf.cast(a, 'float32')
    return a + b
add(tf.constant(1), tf.constant(2.))  # 3.0
```

在保持原有代码逻辑的前提下，尽可能使用并行计算提高速度


```python
a = tf.Variable(1.)
b = tf.Variable(2.)
@tf.function
def f(x, y):  # (a,b), (x,y) -> (b*y, b+a*x)
    a.assign(y * b)
    b.assign_add(x * a)
    return a + b
f(1, 2)
```

### tf.Variable 的创建和删除？

下面这样写会报错，因为tf.function不清楚内部定义的变量`v`究竟是每次要为其创建一个新的计算图，还是利用之前的已经创建过的变量`v`：

- 如果是`tf 1.x`，那么就只会创建一次（graph execution）
- 如果是eagerly execution，那么会每次创建出`v`然后在函数结束时删除`v`，不断删除再创建
  解决方法：

1. 在图执行函数外创建变量
2. 通过编写类，并在第一次调用该类的时候创建变量，类似Layer中的`build()`函数


```python
@tf.function
def f(x):
    v = tf.Variable(1.)
    v.assign_add(x)
    return v
f(2)  # error
```


```python
# build class' variable once
class C: pass
obj = C(); obj.v = None
@tf.function
def g(x):
    if obj.v is None:
        obj.v = tf.Variable(1.)
    return obj.v.assign_add(x)
g(2)  # 3.0
```

### 自动生成计算图的函数限制

`tf.function` 支持Python原生函数：`if, while`，其中 `if` 会自动转化为 `tf.cond`，`while` 会自动转化为 `tf.while_loop`；

并且有类似C++中的数组 `tf.TensorArray(dtype, size)`（在`tf.function`中对`tf.TensorArray`进行初始化，作为计算图中的一个数组，最后需要将其通过`ta.stack()`返回出来）：

- 动态：`ta = tf.TensorArray(dtype, size, dynamic_size=True)`
- 静态：`dynamic_size`默认为`False`，`size`就是当前数组的固定大小
- 加入元素：`ta = ta.write(pos, val)`类似于`ta[pos] = val`，如果是静态数组，则要求有`pos < ta.size()`
- 重置数组：`ta = ta.unstack([...])`将`ta`重置为列表`[...]`，如果是静态数组，则需要保证`len([...]) <= ta.size()`
- 数组转化：`ta.stack()`将`ta`转化为`tf.Tensor`的形式


```python
# tf.TensorArray使用方法
@tf.function
def f(x):
    ta = tf.TensorArray('int32', size=0, dynamic_size=True)
    for i in tf.range(3):
        ta = ta.write(i, x[i])
    return ta.stack()
f(tf.constant([1, 2, 3]))  # [1,2,3]
```


```python
# while循环的结果
@tf.function
def fn(x):
    while tf.reduce_sum(x) > 0.7:
        x.assign(tf.tanh(x))
        tf.print(x)
    return x
fn(tf.Variable(2.))  # 0.964027584 0.746068 0.632797241
```

### 计算图中 Python 内置函数只会被执行一次


```python
@tf.function
def fn(a, b):
    print(f"now {a=} {b=}")
    return a, b
fn(1, tf.constant(2))  # print (build new graph)
```


```python
fn(1, tf.constant(2))  # no print
```


```python
fn(2, tf.constant(2))  # print (build new graph)
```


```python
fn(2, tf.constant(2))  # no print
```

### 在梯度下降中应用的例子


```python
from sklearn.preprocessing import StandardScaler
from tqdm import tqdm

(train_X, train_y), (eval_X, eval_y) = tf.keras.datasets.boston_housing.load_data()
std_scaler = StandardScaler()  # 数据集标准化
train_X = std_scaler.fit_transform(train_X)
eval_X = std_scaler.transform(eval_X)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1),
])  # 用多层感知机
loss_fn = tf.keras.losses.MeanSquaredError()  # MSE损失函数
optimizer = tf.keras.optimizers.Adam()  # 优化器
metric = tf.metrics.Mean()  # 对loss的均值度量器，每个epoch计算显示一次结果

@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        logits = model(tf.expand_dims(x, axis=0))
        loss = loss_fn(y, logits)
    grads = tape.gradient(loss, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    metric.update_state(loss)
    
def train_step_no(x, y):
    with tf.GradientTape() as tape:
        logits = model(tf.expand_dims(x, axis=0))
        loss = loss_fn(y, logits)
    grads = tape.gradient(loss, model.trainable_weights)
    optimizer.apply_gradients(zip(grads, model.trainable_weights))
    metric.update_state(loss)

for epoch in range(5):
    metric.reset_state()
    for x, y in tqdm(zip(train_X, train_y)):
        train_step(x, y)
        # train_step_no(x, y)
    print(f"epoch: {epoch}, loss: {metric.result()}")
# use tf.function: 00:00, 960.08it/s Amazing!
# no tf.function: 00:05, 76.84it/s  slow!
```
