---
title: CMake速查表
hide: true
math: true
abbrlink: 63366
date: 2026-02-08 16:03:53
index\_img:
banner\_img:
category:
tags:
---

一个系统性例子在[入门CMake](/posts/50507/)中，本文主要从几个独立的例子，并记录下其中使用的函数的具体用法。

> [Modern CMake CN](https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/)

# Demo1 - Simple

一个简单的单个项目，介绍库的创建，架构如下
```bash
❯ tree
.
├── CMakeLists.txt
├── include
│   ├── gdb.hpp
│   └── mylib.hpp
└── src
    ├── main.cpp
    └── mylib.cpp
```

{% spoiler "Simple Proj" %}
**CMakeLists.txt**
```cmake
cmake_minimum_required(VERSION 3.15)
set(CMAKE_CXX_STANDARD 20)

project(
    Simple
    VERSION 1.0
    LANGUAGES CXX
    DESCRIPTION "Project 2 Example"
)

# INTERFACE lib不生成库文件，直接编译在可执行文件中
add_library(MyMath INTERFACE)
target_include_directories(MyMath INTERFACE include)

# MyLib 生成一个静态库（默认STATIC）
add_library(MyLib STATIC src/mylib.cpp)
# add_library(MyLib SHARED src/mylib.cpp)
target_include_directories(MyLib PRIVATE include)

# 可执行文件
add_executable(simple src/main.cpp)
# 关联库
target_link_libraries(simple PRIVATE MyMath MyLib)
```
**main.cpp**
```cpp
#include <cstdio>
#include <iostream>

#include "gdb.hpp"
#include "mylib.hpp"


int main() {
    int a = 32;
    int b = 24;

    int g(gcd(a, b)), l(lcm(a, b));
    printf("gcd(%d, %d) = %d\n", a, b, g);
    printf("lcm(%d, %d) = %d\n", a, b, l);

    printf("%d + %d = %d\n", a, b, mylib::add(a, b));

    return 0;
}
```
**mylib.cpp**
```cpp
#include "mylib.hpp"

template<typename T>
T mylib::add(T a, T b) {
    return a + b;
}

// Explicit template instantiation
template int mylib::add<int>(int a, int b);
template double mylib::add<double>(double a, double b);
```
**gdb.hpp**
```cpp
#pragma once

template<typename T>
T gcd(T a, T b) {
    return b == 0 ? a : gcd(b, a % b);
}

template<typename T>
T lcm(T a, T b) {
    return (a / gcd(a, b)) * b;
}
```
**mylib.hpp**
```cpp
#pragma once

namespace mylib {
    template<typename T>
    T add(T a, T b);
}
```
{% endspoiler %}
