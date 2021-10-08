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

## 判断 if

### 逻辑表示

python中使用的是 `and, or, not` 而非 `&&, ||, !`。

但二进制运算都还是有的 `&, |, ^, <<, >>`。

### if

举个例子就完事了。

```python
a = int(input())
b = int(input())
if a > b:
	print('a > b')
elif a == b:
	print('a == b')
else:
	print('a < b')
```

### 三目

这个和c++有比较大的区别。

```python
a = int(input())
b = int(input())
c = int(input())
mx = a if a > b else b # mx为a,b中两者较大值
print(mx)
# 在c++中就是: mx = (a > b) ? a : b;
# 当然了还是可以嵌套的
# 取三者中较大值（丑陋...
mx = a if a > (b if b > c else c) else (b if b > c else c)
print(mx)
```

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

## 函数

python 中函数就两种写法 `def, lambda`。

### def

```python
def function(x, y, ...):
	# 写内容
	# 如果没有return，就默认return None，相当于void
	# 这里return可以返回多个参数，以元组形式返回
	return x
	return x, y, z
```

于是就随便写了几个递归试试。

```python
def gcd(a, b):
    if b == 0: return a
    return gcd(b, a % b)
def ksm(a, b):
    ret = 1
    while b:
        if b & 1: ret = ret * a % P
        a = a * a % P
        b >>= 1
    return ret
# exgcd确实不用取地址了，但肯定慢了(
def exgcd(a, b, x, y):
    if b == 0:
        x = y = 1
        return a, x, y
    z = exgcd(b, a % b, x, y)
    x = z[2]
    y = z[1] - a // b * z[2]
    return z[0], x, y
P = 998244353
a = 32
b = 24
g, x, y = exgcd(a, b, 0, 0)
x = (x + b) % b
y = (y + b) % b

print(g, x, y)
```

### 全局/局部变量

python中，只要写在主函数中的变量都视为全局变量，在函数中都可以直接调用，所以上面 `P=998244353` 写在函数下面也是完全没有问题的。

**注：** python中的局部变量只是在函数中出现的变量，而非主函数中 `if, for, while` 中出现的变量。

比如

```python
for i in range(5):
    ans = i
print(ans)
```

是正确的。

而c++中

```c++
for (int i = 0; i < 5; i++)
	int ans = i;
cout << ans << '\n';
```

肯定是错的。

如果函数中的局部变量名和主函数中变量名重名，函数还是会有限调用局部变量。

```python
def fun():
    a = 1
    print(a)
a = 0
print(a)
fun()
print(a)
'''
输出
0
1
0
'''
```

### lambda

这个函数名字就叫 lambda，当然就是数学符号 $\lambda$ 了（bushi，其实就是如果你懒得想名字了，而且函数很简短，就用它。

```python
lambda argument_list: expression # 构造，argument_list是参数列表，expression为表达式（函数内容）
# 当然你如果想出了一个函数名字，你就把赋值到这个名字上，然后就能和函数一样用它了，比如下面Gcd的例子
```

比如，gcd（最小公倍数）就可以用它（更为简洁）：

```python
Gcd = lambda a, b: Gcd(b, a % b) if b else a
# 等价于c++中: int Gcd(int a, int b) {return b ? Gcd(b, a % b) : a;}

print(Gcd(24, 32))
```

更多用法可以参考 [知乎 - 细说Python的lambda函数用法](https://zhuanlan.zhihu.com/p/80960485)

## 面向对象

**面向对象**，我的理解，就是对一个对象（object，就是一个东西，比如一个人，一个猫，一个学校等等），创建一个属于它的 `class`，并对这个 `class` 加入描述这个object所需要的变量（**特征\属性**）（有的不能轻易改动（比如游戏经验，出生日期等等），有的可以随便改），然后这个object可以做出些什么事情（**行为**），就是它所拥有的**方法**，其实**方法**就是一个个**函数**，当然两两object之间也可以存在**方法**。

于是，对象=属性+方法，也就是 `class=arguments+functions=变量+函数`。

