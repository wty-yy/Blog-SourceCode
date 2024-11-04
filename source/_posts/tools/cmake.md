---
title: 入门CMake
hide: false
math: true
category:
  - tools
abbrlink: 50507
date: 2024-11-04 20:44:35
index\_img:
banner\_img:
tags:
---

## 入门CMake
> 参考教程: [YouTube-Simplified CMake Tutorial](https://www.youtube.com/watch?v=mKZ-i-UfGgQ&t=932s), [Codevion vimwiki-Modern Simple CMake Tutorial](https://codevion.github.io/#!cpp/cmake.md)

CMake可以完成复杂项目的编译任务，编译一个C++项目可能需要：
1. 一个包含`main()`的主程序入口；
2. 多个联合编译`*.cpp`文件（对头文件各种声明的实现）；
3. 多个头文件`*.h`；
4. 多个链接库`*.so`；
5. 编译指令`-pthread, -O2, -O3`等。
下面我们将在VSCode上逐步完成这些功能，系统Ubuntu 22.04：

### 单个文件编译
首先我们创建一个空文件夹，里面写一个`main.cpp`文件：
```cpp
#include <iostream>

int main() {
  std::cout << "Hello world\n";
  return 0;
}
```

最简单的编译方法是在终端中使用`g++`编译并运行起来
```bash
g++ main.cpp -o main && ./main
```

下面我们来用CMake实现这一操作，在和`main.cpp`的同级目录下创建`CMakeLists.txt`文件：
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号
add_executable(hi main.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]
```

真正有用的就是一句话，给出了编译出的可执行文件名称，以及联合编译的cpp文件
```cmake
add_executable(hi main.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]
```

执行CMake编译方法：
1. VSCode插件：在VSCode中安装CMake, CMake Tools, CMake Highlight插件，按`ctrl+f5`就会弹出对g++编译器的选择，选择一个编译器即可，再按`ctrl+f5`即可看到CMake创建了一个`build`文件夹，在其中已经编译出了`hi`可执行文件，下方打印出了我们代码的结果。
2. 终端：首先我们创建一个新文件夹`mkdir my_build`，进入该文件夹`cd my_build`，执行`cmake ..`即可看到创建了很多缓存文件，再执行`make`开始编译，完成后会产生可执行文件`hi`，运行`./hi`即可。
```bash
mkdir my_build
cd my_build
cmake .. && make && ./hi  # 创建CMake缓存 编译 执行
```

### 添加头文件
在`main.cpp`同级目录下创建`include/`文件夹，里面创建`include/bar.h`头文件:
```cpp
#pragma once
#include <iostream>

class Bar {
  public:
    inline void foo() {
      std::cout << "Foo!\n";
    }
};
```
我们在`CMakeLists.txt`中`add_executable(hi main.cpp)`下方加入
```cmake
target_include_directories(hi PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)  # 目标 可见性 头文件目录
```
这里的`PUBLIC`表示当前编译的目标对于头文件中内容的可见程度，有如下三个选项（这个一般只有在多层调用时会用到，一般写`PUBLIC`就完了）：
1. `PRIVATE`：如果只有`*.cpp`文件用到头文件中的内容；
2. `INTERFACE`：如果只有`*.h`文件用到头文件中的内容；
3. `PUBLIC`：两者都用到。

修改完成`CMakeLists.txt`后就可以对`main.cpp`修改如下：
```cpp
#include <iostream>
#include "bar.h"

int main() {
  std::cout << "Hello world\n";
  Bar().foo();
  return 0;
}
```

用`ctrl+f5`编译运行了，但是我们发现vscode还是无法找到`#include "bar.h"`头文件位置，需要手动添加下路径，`ctrl+shift+p`输入`c/c++ ui`进入`C/C++:编辑配置(UI)`，找到包含路径中发现已经添加了`${workspaceFolder}/**`，它就会自动递归寻找工作路径下的头文件了（如果不在本工作路径下的，需要手动添加哦）

### 添加库文件
#### 手动创建库文件
我们新创建一个文件夹`bar/`，将刚才写的`include/bar.h`文件放到该文件夹下，并创建一个`bar/bar.cpp`文件用来定义其中声明的函数，文件结构如下：
```vim
.
├── bar
│   ├── bar.cpp
│   ├── CMakeLists.txt
│   └── include
│       └── bar.h
└── main.cpp
```
每个文件内容如下
{% spoiler "bar.cpp" %}
```cpp
#include "bar.h"

void Bar::show() {
  std::cout << "print in bar.cpp\n";
}
```
{% endspoiler %}

{% spoiler "bar.h" %}
```cpp
#pragma once
#include <iostream>

class Bar {
  public:
    inline void foo() {
      std::cout << "Foo!\n";
    }
    void show();
};
```
{% endspoiler %}

{% spoiler "main.cpp" %}
```cpp
#include <iostream>
#include "bar.h"

int main() {
  std::cout << "Hello world\n";
  Bar().foo();
  Bar().show();
  return 0;
}
```
{% endspoiler %}

我们需要将`bar/`文件夹下的内容作为一个整体编译成一个`.so`或`.a`连接文件用于`main.cpp`的链接，所以在该目录下也需要一个`bar/CMakeLists.txt`：
```cmake
add_library(ba STATIC bar.cpp)  # (创建连接库) 目标(会生成一个libbar.a) 库类型(静态库STATIC) 源文件1 源文件2 ...
target_include_directories(ba PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)  # 所需的头文件
```

这样我们就可以在编译`main.cpp`时调用生成出来的`libbar.a`库文件了，修改`CMakeLists.txt`如下：
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号

add_subdirectory(bar)  # 编译子目录, 这里就是编译bar生成库文件

add_executable(hi main.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]
# 原来用的target_include_directories加的头文件，现在头文件直接编译成库文件了，直接调库文件即可
target_link_libraries(hi PUBLIC ba)  # (链接库文件) 目标 可见性 库名称1(注意: 库名称就是bar/CMakeLists.txt中的目标名称, 不是文件夹名称) 库名称2 ...
```
