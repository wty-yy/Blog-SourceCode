---
title: VsCode配置C/C++运行环境
hide: false
math: true
abbrlink: 40277
date: 2024-11-03 20:23:34
index\_img:
banner\_img:
category:
 - tools
tags:
---
> 距离上篇笔记过去2个月了，还是要坚持写点东西，不能因为出差、项目、比赛就摆烂了🫠

由于要准备C/C++的大作业，所以需要学习下如何联合编译，还有cmake。由于不想用Visual Studio（Linux也没有），首先学习下怎么用VsCode做联合编译。

## 文件结构
假如我们的文件格式如下:
```vim
.
├── include
│   └── test.h
├── test.cpp
└── main.cpp
```

每个文件分别为：
{% spoiler test.h %}
```cpp
#include <iostream>

#ifndef TEST_H
#define TEST_H

class Test {
  public:
    Test(int, int);
    void build(int);
    friend std::ostream& operator << (std::ostream& out, Test& test) {
      out << test.a << ' ' << test.b;
      return out;
    }
  private:
    int a, b;
};

class A {
  public:
    A(int);
    int a = 10;
};
void hello();

#endif
```
{% endspoiler %}

{% spoiler test.cpp %}
```cpp
#include "test.h"

A::A(int a_):a(a_) {}

void hello() {std::printf("hello world\n");}
```
{% endspoiler %}

{% spoiler main.cpp %}
```cpp
#include "test.h"

Test::Test(int a_, int b_):a(a_),b(b_) {}
void Test::build(int a_) {this->a = a_;}

signed main() {
  A a(6);
  Test test(1,2);
  std::cout << test << '\n';
  std::cout << a.a << '\n';
  hello();
  return 0;
}
```
{% endspoiler %}

## VsCode配置
我们需要用到一个插件：[C/C++ Runner](https://marketplace.visualstudio.com/items?itemName=franneck94.c-cpp-runner), 其实它会附带安装C/C++插件的, 不过他的运行架构更加简单, 而且比较容易连接多个文件.

首先进入项目文件夹，在安装完这个插件之后，点击其中任意一个cpp文件，就可以发现自动生成了`.vscode`文件夹，包含三个文件`c_cpp_properties.json, launch.json, settings.json`，其中`setting.json`就是C/C++ Runner的配置文件，在这里可以对`g++`的编译指令进行修改：

```yaml
  "C_Cpp_Runner.compilerArgs": [  // 编译选项
    "-pthread",  // 多线程不同平台兼容性
    "-O3",  // 速度,空间优化
  ],
  "C_Cpp_Runner.linkerArgs": [  // 连接文件, 
    "-Ipthread",  // 大写I表示include, 这些文件一般以.so为后缀
  ],
  "C_Cpp_Runner.includePaths": [  // 需要连接的头文件
    "include/",  // 设置为我们自定义的文件夹
  ],
```

如果不想要各种warning提示，可以把enableWarnings改成`false`：
```yaml
  "C_Cpp_Runner.enableWarnings": false,
```

编译分为两种：
1. 编译单个文件`C_Cpp_Runner.buildSingleFile`，默认快捷键`ctrl+alt+b`（推荐换成`alt+f5`），这里我们必须用下面的多文件编译，不然`test.h`中的`hellow()`没有定义；
2. 联合编译文件`C_Cpp_Runner.buildFolder`，默认快捷键`ctrl+k b`（推荐换成`f5`）

联合编译后即可运行/调试文件：
1. 运行代码`C_Cpp_Runner.runCurrentSelection`，默认快捷键`ctrl+alt+r`（推荐换成`ctrl+f5`）
2. 调试代码`C_Cpp_Runner.debugCurrentSelection`，默认快捷键`ctrl+alt+d`（推荐换成`f8`）

因此运行上面的代码只需先执行`f5`，再执行`ctrl+f5`，即可看到运行成功的结果为
```vim
1 2
6
hello world
```

> 如果编译出错了可以查看输出的指令来看看哪里写错了，我的编译指令如下
> ```bash
/usr/bin/zsh -c g++ -g3 -O0 -O3 -pthread -Iinclude  -c /home/yy/Coding/course/c++/code_struct_test/main.cpp -o ./build/Debug/main.o && g++  -g3 -O0 -O3 -pthread -Iinclude  -c /home/yy/Coding/course/c++/code_struct_test/test.cpp -o ./build/Debug/test.o && g++  -g3 -O0 -O3 -pthread -Iinclude   ./build/Debug/main.o ./build/Debug/test.o -o ./build/Debug/outDebug -Ipthread
> ```
