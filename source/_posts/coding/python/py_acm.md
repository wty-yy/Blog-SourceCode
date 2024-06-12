---
title: Python & 算法竞赛
hide: false
math: true
category:
  - coding
  - Python
abbrlink: 53765
date: 2021-10-15 22:44:02
index_img:
banner_img:
tags:
---

最近尝试使用Python打下算法题，记录下需要注意的地方吧。

## 使用main()函数

这样的习惯就和c++一样了，这样的好处在于如果其他文件中 `import` ，使用该文件中的函数，不会运行其主函数部分。

```python
def main():
	pass

if __name__ == "__main__":
    main()
```

## 全局变量的问题

```python
ans = 0
def main():
	ans += 1
```

这样写会报错的，因为 `main()` 函数中的**要修改** `ans` 默认是局部变量，于是Python会在局部变量中寻找，没有找到于是报错，只需加上 `global` 关键词即可。但如果不进行修改则没有问题。

```python
ans = 0
def main():
	global ans
	ans += 1
```

## 重定向输出

如果还想使用c++中类似于 `freopen("in", "r", stdin), freopen("out", "w", stdout)` 这样的操作，只需要修改 `sys.stdin, sys.stdout`。

```python
import sys

def main():
	sys.stdin = open('in', 'r')
	sys.stdout = open('out', 'w')
```

## 判断输入到结束(EOF)

按行读入，如果行读入为 `EOF` 就跳出循环，注意Python是不能判断等于 `EOF` 的，只能使用 `not` 逻辑词。

```python
while True:
	s = sys.stdin.readline()
	if not s:
		break
	s = s.rstrip()
	print(s)
```

## split()函数

题目要求使用空格分隔。

```python
s = input()
a, b = (int(x) for x in s.split()) # 保证每行只有两个数字，用空格分隔，直接赋值到a, b上
l = [int(x) for x in s.split()] # 或者直接用列表初始化方法，赋值到列表上
```

## 常用函数

```python
s = s.rstrip() # 去除字符串尾部空格及换行符
```
