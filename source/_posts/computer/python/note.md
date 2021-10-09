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

### 参考文献

> [1] 周越.人工智能基础与进阶（Python编程）[M].上海：上海交通大学出版社,2020.

# Python入门基础

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
# 当然也可以这样写
def GCD(a, b): return GCD(b, a % b) if b else a

print(Gcd(24, 32))
```

更多用法可以参考 [知乎 - 细说Python的lambda函数用法](https://zhuanlan.zhihu.com/p/80960485)

## 面向对象

**面向对象**，我的理解，就是对一个对象（object，就是一个东西，比如一个人，一个猫，一个学校等等），创建一个属于它的 `class`，并对这个 `class` 加入描述这个object所需要的变量（**特征\属性**）（有的不能轻易改动（比如游戏经验，出生日期等等），有的可以随便改），然后这个object可以做出些什么事情（**行为**），就是它所拥有的**方法**，其实**方法**就是一个个**函数**，当然两两object之间也可以存在**方法**。

于是，对象=属性+方法，也就是 `class=arguments+functions=变量+函数`。

### 有趣的类函数

Python的类很有意思，类中每个函数都会在第一个位置多传入一个参数，这个参数就是当前实体化类的指针，对应于c++中的this。比如：

```python
# 错误代码
class Dog():
	name = 'aa'
	def changeName(s):
		name = s
dog = Dog()
dog.changeName('abc')
```

这样是不行的，会报错说，`changeName() takes 1 positional argument but 2 were given`，也就是说它传入了两个参数，但我们只给了 `'abc'` 这一个参数呀，原因就是其实它是 `changeName(dog, 'abc')` 这样传入的，因为它默认会传入当前对象的指针也就是 `dog` 作为第一个参数，所以Python说少了一个参数。

验证一下：

```python
class Dog():
    def chk(self):
        print(self)
dog = Dog()

dog.chk()
print(dog)
# 两者的输出是一致的，说明上述理解应该没问题
```

还有， `self` 这个名字是可以随便取的，叫 `self` 可能是大家通用了，便于理解吧。

### 初始化

Python和Jave,C++都不同，它的初始化不是类名，而是一个叫 `__init__` 的函数，这个必须写成这样，前后都有两个下划线。

```python
class Dog():
	def __init__(self, name, birth):
		self.name = name # 其实这里就可以看出来和C++类似了，理解成 this->name = name;
		self.birth = birth
```

### 公有和私有

Python的类中只分为公有和私有，公有可以在类外面（比如主函数）中对类的属性进行修改，私有则除了在类之中的方法，都无法对其进行修改和查看。

公有很简单就是直接定义变量即可。

```python
class Dog():
	# 其实我觉得Python应该也有类变量和对象变量的区别
    country = 'CHINA'  # 比如country就是类变量
    def __init__(self, name, birth):
		# 下面这两个就是对象变量
        self.name = name
        self.birth = birth
	def chk(self):
		print(self)
dog = Dog('aa', '123')
dogg = Dog('bb', '321')
```

如果直接修改 `Dog.country` 那么 `dog.country, dogg.country` 都会随之改变，这里应该是有继承关系的，但如果先修改了 `dog.country` 再去修改 `Dog.country` 那么 `dog.country` 就不会发生变化了，这里满足优先使用子类变量的原则（可以这样理解吧）

上面所使用的都是公有属性和方法，下面写下私有的属性和方法，其实就是在所有的东西前面加上**两个下划线**就行了。

```python
class Dog():
    country = 'CHINA'
    def __init__(self, name, birth):
        self.__name = name
        self.__birth = birth
    def __cgname(self, name):
        self.__name = name
    def getname(self):
        return self.__name
'''
这样__name, __birth外部都无法访问，只能通过对象下的方法进行访问和修改
同样的__cgname()这个函数外部也是无法访问的，只能通过对象下的其他方法进行使用
'''
```

### 继承与多态

**继承** 就是子类去copy父类的方法和属性，从而子类就不用重写了，减少重复操作，偷懒。

Python中继承也是巨简单。

```python
class Animal():
    def __init__(self, name, birth):
        self.__name = name
        self.__birth = birth
    def getname(self): return self.__name
    def getbirth(self): return self.__birth
# 在这个括号中加上父类就行了
class Dog(Animal):
    def bark(self):
        print("Wang!Wang!")

dog = Dog('aa', '123')
print(dog.getname())
print(dog.getbirth())
dog.bark()
```

和Jave，C++一样，如果子类与父类的属性或者方法重名了，优先使用子类的。

**多态** 也就是对父类的多种不同形式的实现。它本身就是基于**继承**的，子类对父类的方法进行重写，延拓就是**多态**。

## 文件读取和写入

### 绝对目录和相对目录

如果是Linux系统都是左斜杠 `/` 蛤，如果是Windows系统注意都是右斜杠 `\`

**绝对目录**：从根目录开始，比如 `/home/yy/program/py/test.py`，Windows应该是 `D:\program\py\test.py`。

**相对目录**：从当前目录开始，比如当前运行程序的目录是 `~/program/` 那么 `test.py` 这个文件的相对目录就是 `./py/test.py`，这个开头的 `.` 代表的就是 `~/program/` 这一长串地址，Windows类似。

### 读取

使用 `open(路径)` 函数，相对和绝对都可以

```python
f = open('a.in') # 这里 ./a.in 的 ./ 可以省去
f = open('/home/yy/program/py/a.in') # 或者绝对路径，绝对路径home前面的 / 要保留
# 如果想用右斜杠注意转义，要打两个
s = f.read()
print(s)
f.close() # 用完文件后关闭
```

如果懒得写 `f.close()` 可以使用 `with` 关键字。

```python
with open('a.in') as f:
	s = f.read()
	print(s)
```

下面一起列举了几个读入数据的方法：

```python
with open('a.in') as f:
    s = f.read() # 使用read()函数，将整个文件全部读成一个字符串
    print(s)

with open('a.in') as f:
    for i in f:
        print(i, end = '') # i读取每一行，这里每一行末尾都包含'\n'的

with open('a.in') as f:
    tot = '' # tot用于存储整个没有换行符的文件，把每行都连在一起
    for i in f:
        print(i.rstrip(), end = '') # 通过rstrip()函数，去除末尾的所有空格和换行符，也就是' '和'\n'
        tot += i.rstrip()
    print()
    print(tot)

print()

with open('a.in') as f:
    l = f.readlines() # 将文件按行分隔开，放到列表中
    print(l)
```

### 写入

在读取中，我们直接写的是 `open('path')`，但其实后面还有默认参数，它等价于 `open('path', mod = 'r')`，这是只读模式。

如果将 `mod = 'w'` 就是写入模式，如果是 `mod = '+r'` 则是读写模式，Python会先把源文件清空，然后往里面写。

还有一个 `mod = a` 追加模式，就是在文本的末尾继续添加字符，而非先把文件完全清空。

如果在写入模式下，对于目录下的文件不存在，Python则会直接新建文件，进行写入。

写入，使用**文件对象**下的 `write('content')` 函数，注意，**内容必须是字符串**，如果是数字，则需要使用函数 `str()` 进行转型后输出。

```python
with open('b.in', mode = 'w') as f:
    f.write('HelloWorld')
    f.write(str(123)) # 注意只能写入字符串

with open('b.in', mode = 'a') as f:
    f.write('hi')
```

## 模块

模块 (Module) 也就是一个 `.py` 程序。

### Python系统路径

Python会在**系统路径**和**当前工作目录**下寻找 `module_name.py`，如果找到该文件，就会引入这个模块（优先在**系统路径**下寻找）。

所以如果想要自定义一个模块，只需要把 `.py` 文件都放在同一个目录之下就行了。

### 导入模块

比如，当前工作目录下有两个模块：

`Math.py`

```python
'''
说明文档
该模块中含有
函数gcd（求最小公倍数）
函数ksm(a,b)（求a^b，复杂度O(blogb)
复数类Complex
'''
P = 998244353
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
def exgcd(a, b, x, y):
    if b == 0:
        x = y = 1
        return a, x, y
    z = exgcd(b, a % b, x, y)
    x = z[2]
    y = z[1] - a // b * z[2]
    return z[0], x, y
def fun(a, b, c):
    return a, b, c
Gcd = lambda a, b: Gcd(b, a % b) if b else a
def GCD(a, b): return GCD(b, a % b) if b else a

class Complex():
    def __init__(self, l):
        self.a = l
    def __repr__(self):
        return str(self.a[0]) + "+" + str(self.a[1]) + "i"
    def __add__(x, y):
        return Complex([x.a[0] + y.a[0], x.a[1] + y.a[1]])
    def __mul__(x, y):
        return Complex([x.a[0]*y.a[0] - x.a[1]*y.a[1], x.a[0]*y.a[1] + x.a[1]*y.a[0]])

print(__name__)

# 在直接运行Math.py文件时，__name__ = __main__，当import Math时，__name__ = Math
# 这样就可以区别开什么时候是测试，什么时候是引用
if __name__ == '__main__':
    print("Running in Math") # 测试代码，要放在该if条件下，这样在import的时候不会运行
```

其中提到了**说明文档**，就是在程序开头写多行注释，使用方法是

```
import Math
print(Math.__doc__)
```

其中还有**测试代码**，需要放在 `if __name__ == '__main__'` 下，原理在代码中也进行了解释。

`stu.py`

```python
class Student():
    def __init__(self, name, birth):
        self.__name = name
        self.__birth = birth
    def getname(self): return self.__name
    def getbirth(self): return self.__birth
```

引入模块，使用其中的类和函数。

#### 第一种写法

使用 `import 模块名1 [as 别名1], 模块名2 [as 别名2]，…`，使用 `模块名\别名.函数名` 调用模块的函数，`模块名\别名.类名` 调用模块的类。

```python
import stu, Math
stu1 = stu.Student('aa', '123')
print(stu1.getname())
print(Math.gcd(24, 42))
```

#### 第二种写法

引入类中的某些特定的函数和类，`from 模块名 import 成员名1 [as 别名1]，成员名2 [as 别名2]，…`。

这样的好处就是可以直接写函数名称和类名称了。

```python
from Math import gcd, ksm as k, Complex as c

print(gcd(24, 32))
print(k(2, 10))
z1 = c([1, 2])
z2 = c([1, 2])
print(z1)
print(z1*z2)
```

还可以直接导入模块中所有的成员，`from 模块名 import *`，但这样并不推荐，因为很容易发生重名冲突。

### 内建模块（标准库）

使用函数 `help('modules')` 查看可使用的模块。

使用 `help('模块名')` 就可以查看模块下的**说明文档，函数，类，变量**。

比如使用 `help('Math')` 就可以看到上面自定义模块的详细信息了。

```python
Help on module Math:

NAME
    Math

DESCRIPTION
    说明文档
    该模块中含有
    函数gcd（求最小公倍数）
    函数ksm(a,b)（求a^b，复杂度O(blogb)
    复数类Complex

CLASSES
    builtins.object
        Complex

    class Complex(builtins.object)
     |  Complex(l)
     |
     |  Methods defined here:
     |
     |  __add__(x, y)
     |
     |  __init__(self, l)
     |      Initialize self.  See help(type(self)) for accurate signature.
     |
     |  __mul__(x, y)
     |
     |  __repr__(self)
     |      Return repr(self).
     |
     |  ----------------------------------------------------------------------
     |  Data descriptors defined here:
     |
     |  __dict__
     |      dictionary for instance variables (if defined)
     |
     |  __weakref__
     |      list of weak references to the object (if defined)

FUNCTIONS
    GCD(a, b)

    Gcd lambda a, b

    exgcd(a, b, x, y)

    fun(a, b, c)

    gcd(a, b)

    ksm(a, b)

DATA
    P = 998244353

FILE
    /home/yy/program/py/Math.py
```

#### random 随机数模块

```python
randint(min, max) # 产生[min, max]之间的随机整数
choice(List) # 从List列表中随机选一个元素出来（抽签）
shuffle(List) # 打乱List的中元素的顺序（洗牌）
```

#### time 时间模块

```python
time() # 返回自1970年1月1日 00:00:00AM 以来的秒数
sleep(n) # 暂停程序n秒
asctime() # 输出当前系统时间
List = localtime() # 返回一个有关时间的列表
```

#### sys 系统模块

```python
sys.path # 查看Python系统路径
sys.stdin.readline() # 读取屏幕输入，遇到'\n'结束
sys.stdout.write(s) # 在屏幕上输出字符串s
```

### pip 安装第三方库

实用库

```python
pip install numpy # 数学运算，矩阵，线性代数
pip install scipy # 基于numpy，用于数学计算
pip install matplotlib # 2D绘图库
pip install scikit-learn # 机器学习库，包含学习算法、数据库
pip install pandas # 数据结构和数据分析工具
pip install pillow # 图形处理标准库
pip install requests # 访问网络资源，处理URL，爬虫
```


