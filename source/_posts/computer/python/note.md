---
title: Python学习笔记
hide: false
math: true
category:
  - learning
  - python
abbrlink: 7875
date: 2021-10-06 16:16:34
index_img:
banner_img:
tags:
---

## 数学运算

```python
5/2 = 2.5 # 直接做除法
5//2 = 2 # 整除
2**10 = 1024 # 幂次

# 下面这三个都返回的是str
bin() # 转二进制
oct() # 转八进制
hex() # 转十六进制
```

## 逻辑运算

python中使用的是 `and, or, not` 而非 `&&, ||, !`。

但二进制运算都还是有的。

## 输入与输出

标准格式：`print(value,...,sep = ' ', end = '\n', file = sys.stdout, flush = False)`

value可以是直接的数字，字符串，也可以是格式化输出 `"%d %d %d\n %f %s"%(1, 2, 3, 2.5, 'abc')`

sep是前面value之间的分隔符，默认一个空格

end是全部value输出完之后，输出的一个字符，默认是`'\n'`

file是输出位置，默认的标准输出 `stdout`

flush是判断是否缓冲，默认为 `False`，就是判断是否刷新缓冲区，详细理解 [python的print（flush=True）实现动态loading......效果](https://blog.csdn.net/Granthoo/article/details/82880562)

python中的输入就简单多了，直接input()输入一个字符串，很直接，在进行转化，和java很像。

```
a = int(input())
b = float(input())
```

**注：** python中是没有double的，默认就是双浮点好像

## 列表 list

等价于c++中的 `vector`。

```
l = [5, 3, 1, 2] # 初始化

len(l) # 返回l的长度

# 下面三个操作都要保证元素之间可以进行大小比较或者求和
max(l) # 返回l中的最大值
min(l) # 返回l中的最小值
sum(l) # 对l中元素求和

l[st : en] # 输出 l 中由 st 到 en-1 元素所构成的列表
l[:n] # 前n个
l[n:] # 从n到末尾
l[-n:] # 倒数的n个 等价于 l[len(l)-n:]
l[st:en:step] # 输出st到en-1每间隔step输出一个，很像matlab中的写法
```

**注：** 使用 `dir()` 函数可以查看对应**类**下的**方法**。

```
# 字符串
s = "aBcD"
s.upper(), l.lower() # 大小写 
s.title() # 第一个大写后面小写
# 列表
l.append() # 等价于v.insert()，在末尾加入元素
l.pop() # 等价于v.pop_back()
l.pop(n) # 删除l的第n个元素
l.remove(x) # 删除l中第一个值为x的元素
l.index(x) # 返回l中第一个值为x的索引值
l.count(x) # 返回l中值为x的出现次数
l.reverse() # 反转l
l.sort() # 从小到大排序
l.sort(reverse = True) # 从大到小排序
```

## 元组 tuple

一个不可以修改的list。

```
t = (1, 2, 3) # 初始化
# 注：一个元素的时候写成
t = (1, )
# 如果是 t=(1) 那么 t 就认为是int型
```

## zip函数

`zip([iterable, ...])` 将多个可迭代对象作为参数，将他们下标对应后生成一个元祖，最后返回由这些元组组成的对象（一个 `object`）

可以使用 `list()` 将其转换为列表形式，也可以使用 `for` 遍历这个 `object` 查看结果。

相反的使用 `zip(*)` 可以对其进行解压。

```python
a = ('stu1', 'stu2', 'stu3', 'stu4')
b = (1, 2, 3, 4, 5)
c = ('a', 'b', 'c')

for i in zip(a, b, c):
	print(i)

l = list(zip(a, b, c))
print(l)


for i in zip(*l):
    print(i)

a, b, c = zip(*l)

print(a, b, c, sep = '\n')
```

##  字典 dict

相当于c++中的map。

```python
d = {'ab': 1, 'bcd': 2, 'defg': 3} # 初始化，等价于 d['ab'] = 1, d['bcd'] = 2, d['defg'] = 3
del d['ab'] # 删除d中'ab'这个元素
d.get('ab') # 如果'ab'存在则返回其值，否则返回None
d.pop('ab', 'gg') # 如果'ab'存在，则删除'ab'，返回'gg'

d = dict.fromkeys(l, v) # 初始化一个字典，以列表l中的元素作为key，value全部初始化为v，若没有带参数v，则初始化为None
```

## 集合 set

```
st = {1, 2, 3, 4} # 集合的初始化方法
```

注：集合中的元素不可以改变，list无法作为集合的元素，而元组可以。

| 符号   | 描述   |
| ------ | ------ |
| &      | 交集   |
| \|     | 并集   |
| -      | 差集   |
| ==     | 等于   |
| !=     | 不等于 |
| in     | 属于   |
| not in | 不属于 |

### 方法

```
st.add(123) # 加入元素
st.clear() # 清空集合
st.remove(123) # 删除123，如果不存在则会报错
st.discard(123) # 删除123，如果不存在也不会报错
st.pop() # 随机删除一个元素
st.update(st1) # 将集合st1中的元素插入到st中
```

### 函数

```
len(st) # 求集合的大小
max(st), min(st) # 取出最大和最小元素
sorted(st) # 对集合进行排序，返回list
sum(st) # 对集合进行求和
```

### 冻结集合 frozenset

不可变的列表称为元组，不可变集合称为冻结集合。

```
fset = frozenset({1, 2, 3}) # 初始化
```

## 循环

### for

#### range() 函数

range() 能够产生一个序列。

```python
range(n) # 产生[0,...,n-1]的序列
range(st, en) # 产生[st,...,en-1]的序列
range(st, en, step) # 以st为开始，en终止，step为间隔

l = list(range(5)) # 将序列转化为list
t = tuple(range(5)) # 将序列转化为tuple
st = set(range(5)) # 将序列转化为set
d = dict.fromkeys(range(5)) # 将序列转化为dict
```

利用 `range()` 函数，我们就可以开始写for了。

```python
for i in range(1, 5): # 等价于 for (int i = 1; i < 5; i++)
for i in st: # 等价于 for (auto i : st) 感觉这种写法已经和python差不多了
# 其他的数据结构都差不多了，list, tuple
# 字典有点不同，分为三种遍历
for i in d.items(): # 遍历 "键-值"，每一个i就是dict中的元素，也就是元组，i[0]相当于i.first,i[1]相当于i.second
for i in d.keys(): # 遍历键
for i in d.values(): # 遍历值
```

### while

用法

```
n = 0
odd = 0
while True:
    n += 1
    if n > 10: break
    if n % 2 == 0: continue
    odd += 1
print(odd)
```

有一个毫无作用的语句，叫 `pass`，它只用来凑数

```
for i in range(5):
	pass # 比如这里，如果没有pass，是直接报错的，因为python使用tab来作为区分的，而非大括号
print('hi')
```

在函数中如果啥都不写，那也要加一个 `pass`

```
# 打个九九乘法表，感觉没有大括号很短呀~
for i in range(1, 10):
    for j in range(1, 10):
        if i >= j:
            print("%d*%d=%d\t"%(i, j, i*j), end='')
    print()
```
