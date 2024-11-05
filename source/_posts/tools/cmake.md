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

# 入门CMake
> 参考教程: [YouTube-Simplified CMake Tutorial](https://www.youtube.com/watch?v=mKZ-i-UfGgQ&t=932s), [Codevion vimwiki-Modern Simple CMake Tutorial](https://codevion.github.io/#!cpp/cmake.md)

CMake可以完成复杂项目的编译任务，编译一个C++项目可能需要：
1. 一个包含`main()`的主程序入口；
2. 多个联合编译`*.cpp`文件（对头文件各种声明的实现）；
3. 多个头文件`*.h`；
4. 多个链接库`*.so`；
5. 编译指令`-pthread, -O2, -O3`等。
下面我们将在VSCode上逐步完成这些功能，系统Ubuntu 22.04：

## 单个文件编译
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
1. VSCode插件：在VSCode中安装CMake, CMake Tools, CMake Highlight插件，按`ctrl+f5`就会弹出对g++编译器的选择，选择一个编译器即可，再按`ctrl+f5`即可看到CMake创建了一个`build`文件夹，在其中已经编译出了`hi`可执行文件，下方打印出了我们代码的结果。（CMake会在右边打开Workbench side bar中显示输出信息，非常麻烦，我们可以把右侧边栏上方的输出图表拖到下方的panel面板中，这样就可以不用每次自动在右边显示啦）
2. 终端：首先我们创建一个新文件夹`mkdir my_build`，进入该文件夹`cd my_build`，执行`cmake ..`即可看到创建了很多缓存文件，再执行`make`开始编译，完成后会产生可执行文件`hi`，运行`./hi`即可。
```bash
mkdir my_build
cd my_build
cmake .. && make && ./hi  # 创建CMake缓存 编译 执行
```

## 添加头文件
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

## 添加库文件
### 手动创建库文件
我们新创建一个文件夹`bar/`，将刚才写的`include/bar.h`文件放到该文件夹下，并创建一个`bar/bar.cpp`文件用来定义其中声明的函数，文件结构如下：
```bash
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
在`main.cpp`下执行`ctrl+f5`即可完成编译运行了。

### 调用外部库
我们将分别调用SFML, 与Python相关的matplotlib-cpp, tensorboard_looger以及torch的原生C++库libtorch

#### SFML
以SFML可视化窗口库为例，安装SFML：
```bash
sudo apt install libsfml-dev
```
安装的SFML会在`/usr/include/SFML/`下创建所需的头文件，在`/usr/lib/x86_64-linux-gnu/`下创建链接所需的文件`libsfml-*.so.x.x`，在`/usr/lib/x86_64-linux-gnu/cmake/SFML/`创建CMake配置所需的`SFMLConfig.cmake`文件，用于`find_package`命令寻找包文件位置，在安装到`/usr/lib`中后就不用再执行`find_package`，链接库会自动查找文件位置，创建`sfml.cpp`和对应的`CMakeLists.cpp`如下

{% spoiler "sfml.cpp" %}
```cpp
#include <SFML/Graphics.hpp>

int main() {
    // 创建一个窗口
    sf::RenderWindow window(sf::VideoMode(800, 600), "SFML Simple Demo");

    // 创建一个矩形形状
    sf::RectangleShape rectangle(sf::Vector2f(100, 50)); // 宽100，高50
    rectangle.setFillColor(sf::Color::Green); // 设置填充颜色为绿色
    rectangle.setPosition(350, 275); // 设置初始位置在窗口中心

    // 矩形移动速度
    float speed = 0.1f;

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close(); // 关闭窗口事件
        }

        // 移动矩形
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left)) {
            if (rectangle.getPosition().x > 0) { // 检查左边界
                rectangle.move(-speed, 0); // 向左移动
            }
        }
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) {
            if (rectangle.getPosition().x + rectangle.getSize().x < window.getSize().x) { // 检查右边界
                rectangle.move(speed, 0); // 向右移动
            }
        }
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up)) {
            if (rectangle.getPosition().y > 0) { // 检查上边界
                rectangle.move(0, -speed); // 向上移动
            }
        }
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Down)) {
            if (rectangle.getPosition().y + rectangle.getSize().y < window.getSize().y) { // 检查下边界
                rectangle.move(0, speed); // 向下移动
            }
        }

        // 清空窗口
        window.clear(sf::Color::Black); // 清空为黑色
        // 绘制矩形
        window.draw(rectangle);
        // 显示窗口内容
        window.display();
    }

    return 0;
}

```
{% endspoiler %}

{% spoiler "CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号

add_executable(sfml sfml.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]

target_link_libraries(sfml PUBLIC sfml-graphics sfml-window sfml-system)
```
{% endspoiler %}

`ctrl+f5`执行后就会弹出一个可以通过上下左右移动的绿色长方形。

#### matplotlib
使用本用例需要我们先安装Python，并使用`pip install matplotlib`安装matplotlib，使用[GitHub - matplotlib-cpp](https://github.com/lava/matplotlib-cpp)可以只用一个头文件`matplotlibcpp.h`直接通过C++调用Python接口，他需要`python, numpy`的头文件和`python`的链接库，按照如下步骤进行使用：
1. 创建`matplotlib.cpp`源文件，下载[`matplotlibcpp.h`](https://github.com/lava/matplotlib-cpp/blob/master/matplotlibcpp.h)，在`cpp`的同目录下创建一个`include`文件夹，将`matplotlibcpp.h`放进去；
2. `which python`找到Python的可执行文件位置，例如我的在`/home/wty/Programs/mambaforge/envs/yy/bin/python`，那么相对可以找到如下位置：
  1. Python头文件：`/home/wty/Programs/mambaforge/envs/yy/include/python3.11`，记为`PYTHON_INCLUDE_DIR`；
  2. Numpy头文件：`/home/wty/Programs/mambaforge/envs/yy/lib/python3.11/site-packages/numpy/core/include`，记为`NUMPY_INCLUDE_DIR`；
  3. Python链接库：`/home/wty/Programs/mambaforge/envs/yy/lib`，记为`PYTHON_LINK_DIR`；

为了支持输出中文以及公式，我修改了`matplotlibcpp.h`中的`rcparams`函数：

{% spoiler "matplotlibcpp.h中的rcparams函数" %}
```cpp
inline void rcparams(const std::map<std::string, std::string>& keywords = {}) {
    detail::_interpreter::get();
    PyObject* args = PyTuple_New(0);
    PyObject* kwargs = PyDict_New();
    for (auto it = keywords.begin(); it != keywords.end(); ++it) {
        if ("text.usetex" == it->first)
          PyDict_SetItemString(kwargs, it->first.c_str(), PyLong_FromLong(std::stoi(it->second.c_str())));
        else PyDict_SetItemString(kwargs, it->first.c_str(), PyString_FromString(it->second.c_str()));
    }

    PyDict_SetItemString(kwargs, "font.family", Py_BuildValue("[ss]", "serif", "SimSun"));
    PyDict_SetItemString(kwargs, "mathtext.fontset", Py_BuildValue("s", "cm"));
    PyDict_SetItemString(kwargs, "axes.unicode_minus", Py_False);

    PyObject * update = PyObject_GetAttrString(detail::_interpreter::get().s_python_function_rcparams, "update");
    PyObject * res = PyObject_Call(update, args, kwargs);
    if(!res) throw std::runtime_error("Call to rcParams.update() failed.");
    Py_DECREF(args);
    Py_DECREF(kwargs);
    Py_DECREF(update);
    Py_DECREF(res);
}
```
{% endspoiler %}
然后在`rcparams`函数的下方我加入了`fontsize`函数，可以更容易的调节字体大小，并保证上文的配置会随着该函数的调用而被配置：
```cpp
inline void fontsize(const int &x) {
    rcparams(std::map<std::string, std::string>({{"font.size", std::to_string(x)}}));
}
```

文件架构如下
```bash
.
├── CMakeLists.txt
├── include
│   └── matplotlibcpp.h
└── matplotlib.cpp
```

分别编辑文件：
{% spoiler "matplotlib.cpp" %}
```cpp
#include <cmath>
#include "matplotlibcpp.h"
#define kwargs std::map<std::string, std::string>

using namespace std;
namespace plt = matplotlibcpp;

int main1()
{
    // Prepare data.
    int n = 5000; // number of data points
    vector<double> x(n),y(n);
    for(int i=0; i<n; ++i) {
        double t = 2*M_PI*i/n;
        x.at(i) = 16*sin(t)*sin(t)*sin(t);
        y.at(i) = 13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t);
    }

    // plot() takes an arbitrary number of (x,y,format)-triples.
    // x must be iterable (that is, anything providing begin(x) and end(x)),
    // y must either be callable (providing operator() const) or iterable.
    plt::plot(x, y, "r-", x, [](double d) { return 12.5+abs(sin(d)); }, "k-");


    // show plots
    plt::show();
    return 0;
}

int main2() {
  plt::fontsize(18);

  int n = 5000;
  std::vector<double> x(n), y(n), z(n), w(n, 2);
  for (int i = 0; i < n; i++) {
    x[i] = i * i;
    y[i] = sin(2 * M_PI * i / 360);
    z[i] = log(i);
  }
  plt::figure_size(1200, 780);
  plt::plot(x, y);
  plt::plot(x, w, kwargs({{"c", "r"}, {"ls", "--"}, {"label", "$\\sin(2\\pi/360)$"}}));
  plt::named_plot("$\\log(x)$", x, z);
  std::map<std::string, std::string> m = {{"string", "123"}, {"a", "aa"}};
  std::cout << m["string"] << ' ' << m["a"] << '\n';
  plt::xlim(0.0, 1e6);
  plt::legend(kwargs({{"loc", "upper left"}}));
  plt::title("标题");
  plt::show();
  return 0;
}

int main() {
  plt::fontsize(18);
  plt::figure_size(600, 500);
  int n = 5e3;
  vector<double> x(n), y(n);
  for (int i = 0; i < n; ++i) {
    double t = 2 * M_PI * i / n;
    x[i] = 16 * pow(sin(t), 3);
    y[i] = 13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t);
  }
  auto y_func = [](double d) {return 3.5 + abs(sin(d));};
  plt::text(-8, 5, "Tom");
  plt::text(5, 5, "Jerry");
  plt::fontsize(12);
  plt::plot(vector<double>(x.begin()+1200, x.end()-1200), y_func, "k-");
  plt::plot(x, y, "r-");
  plt::text(-11.0, -2.0, "$x=16\\sin(t)^3,$\n$y=13\\cos(t)-5\\cos(2t)-2\\cos(3t)-\\cos(4t))$");
  // plt::plot(x, y, "r-", x, [](double d) { return 12.5+abs(sin(d)); }, "k-");
  // plt::legend();
  plt::save("love.png", 300);
  plt::tight_layout();
  plt::show();
}
```
{% endspoiler %}
{% spoiler "CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号

add_executable(matplotlib matplotlib.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]

target_include_directories(matplotlib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)

set(PYTHON_INCLUDE_DIR /home/wty/Programs/mambaforge/envs/yy/include/python3.11)  # change
set(NUMPY_INCLUDE_DIR /home/wty/Programs/mambaforge/envs/yy/lib/python3.11/site-packages/numpy/core/include)  # change
target_include_directories(matplotlib PUBLIC ${PYTHON_INCLUDE_DIR})
target_include_directories(matplotlib PUBLIC ${NUMPY_INCLUDE_DIR})
set(PYTHON_LINK_DIR /home/wty/Programs/mambaforge/envs/yy/lib)  # change
target_link_directories(matplotlib PUBLIC ${PYTHON_LINK_DIR})
target_link_libraries(matplotlib PUBLIC python3.11)  # 换成你的python版本, 在PYTHON_LINK_DIR下可以找到对应的libpython3.xx.so文件
```
{% endspoiler %}

执行上述`matplotlib.cpp`文件会生成`./build/love.png`图像，绘制效果如下（和Python完全一致，就是调用Python嘛😂）

<div align="center">
<img src=/figures/tools/cmake_matplotlib_love.png alt="matplotlib.cpp love.png" width=50%/>
</div>

#### tensorboard
这里我们使用[GitHub - tensorboard_logger](https://github.com/RustingSword/tensorboard_logger)，这是一个独立的可执行文件，我们只需编译安装后就可以直接使用，步骤如下：
```bash
sudo apt install protobuf-compiler  # 安装protobuf
git clone https://github.com/RustingSword/tensorboard_logger.git
cd tensorboard_logger
mkdir build
cd build
cmake .. && make
sudo cmake --install  # 安装到根目录下
```
安装完成后，可以用官方仓库中给的测试用例[`test_tensorboard_logger.cc`](https://github.com/RustingSword/tensorboard_logger/blob/master/tests/test_tensorboard_logger.cc)测试各种绘制方法（注意：测试图像时，需要将仓库中`assets/`文件夹拷贝到当前项目的`./build/`文件夹下，否则找不到文件），文件结构如下
```bash
.
├── build
│   └── assets  # 把官方仓库中的/asssets/拷贝过来
├── CMakeLists.txt
├── tensorboard.cpp
└── test_tensorboard_logger.cc  # 官方仓库中的/tests/文件夹下
```
编辑文件如下：
{% spoiler "tensorboard.cpp仅使用add_scalar绘制曲线测试" %}
```cpp
#include <tensorboard_logger.h>
#include <cmath>

int main() {
  TensorBoardLogger logger("./demo/tfevents_scale.pb");
  const int N = 100;
  for (int i = 0; i < N; i++) {
    double x = 2.0 * M_PI * i / N;
    logger.add_scalar("test/sin", i, std::sin(x));
    logger.add_scalar("test/cos", i, std::cos(x));
  }
  google::protobuf::ShutdownProtobufLibrary();
  std::cout << "draw scaler, finished!\n";
  return 0;
}
```
{% endspoiler %}
{% spoiler "CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号

# add_executable(tensorboard tensorboard.cpp)  # 执行自定义demo
add_executable(tensorboard test_tensorboard_logger.cc)  # 执行官方demo

find_package(tensorboard_logger REQUIRED)
target_link_libraries(tensorboard PUBLIC tensorboard_logger protobuf)
```
{% endspoiler %}

通过修改`CMakeLists.txt`可以分别对`tensorboard.cpp`和`test_tensorboard_logger.cc`进行编译&执行，在`./build/demo/`文件夹下创建日志文件，我们在Python中安装`pip install tensorboard`，执行`tensorboard --logdir ./build/demo`进入`localhost:6006`即可看到绘制的日志内容：

![tensorboard中的scalars](/figures/tools/cmake_tensorboard.png)

#### libtorch
最后我们来尝试下libtorch的效果，这就是PyTorch的底层库，有两种安装方法（这里先以CPU版本为例，后续添加CUDA版本）：
1. Python安装：`conda install pytorch`（如果是用`conda`安装的，否则用`pip`安装），进入环境终端里面执行`python -c 'import torch; print(torch.utils.cmake_prefix_path)'`，即可看到输出的`cmake`路径，例如我的是`/home/wty/Programs/mambaforge/envs/jax/lib/python3.11/site-packages/torch/share/cmake`；
2. 直接下载[PyTorch官网](https://pytorch.org/get-started/locally/)中选择`LibTorch`以及对应的`cuda`或`cpu`版本，下载完成后找到`.../libtorch/`对应的目录即可。

把包含`TorchConfig.cmake`的路径记录下来称为`TORCH_PATH`，只需包含两个文件`troch_tensor.cpp`和`CMakeLists.txt`，编辑文件如下：
{% spoiler "torch_tensor.cpp" %}
```cpp
#include <torch/torch.h>

using namespace torch;

int main() {
  double avg_time = 0;
  for (int i = 0; i < 100; i++) {
    Tensor a = torch::rand({1024, 4096});
    Tensor b = torch::rand({4096, 1024});
    auto t1 = std::chrono::high_resolution_clock::now();
    Tensor c = a.mm(b);
    auto t2 = std::chrono::high_resolution_clock::now();
    auto duration_milli = std::chrono::duration_cast<std::chrono::milliseconds>(t2-t1);
    avg_time += ((double)duration_milli.count() - avg_time) / (i + 1);
    std::cout << c[0][0] << '\n';
  }
  std::cout << avg_time << "ms\n";
}
```
{% endspoiler %}
{% spoiler "CMakeLists.txt" %}
```cmake
cmake_minimum_required(VERSION 3.10)  # CMAKE的最低版本要求
set(CMAKE_CXX_STANDARD 17)  # 使用的C++标准
set(CMAKE_CXX_STANDARD_REQUIRED ON)

project(hello VERSION 1.0)  # 项目名称 版本 版本号
# 替换这个路径需要包含TorchConfig.cmake
set(TORCH_PATH /home/wty/Programs/mambaforge/envs/jax/lib/python3.11/site-packages/torch/share/cmake)
find_package(Torch REQUIRED PATHS ${TORCH_PATH})

add_executable(torch_tensor torch_tensor.cpp)  # 可执行文件名称（目标） 联合编译的文件 [文件1, 文件2, ...]
target_link_libraries(torch_tensor ${TORCH_LIBRARIES})
```
{% endspoiler %}

相应的如果VsCode没有找到libtorch相关的头文件位置，我们只需在`C/C++:编辑配置(UI)`中包含路径里面加入如下两个即可（相对你的libtorch文件夹，肯定也能找到的）：
```vim
/home/wty/Programs/mambaforge/envs/jax/lib/python3.11/site-packages/torch/include/torch/csrc/api/include
/home/wty/Programs/mambaforge/envs/jax/lib/python3.11/site-packages/torch/include
```

上面跑的`torch_tensor.cpp`是一段测速代码$1024\times4096$和$4096\times 1024$矩阵乘法计算100次所需的平均时间（我的CPU为4800U）：
1. libtorch(C++): 用时$44.7ms$
2. pytorch(Python): 用时$84.29ms$
3. numpy(Python): 用时$134.83ms$
> GPU测速待补充

可以看出C++不是一般的快，Python所用的测速代码如下：
{% spoiler "torch_tensor.py PyTorch测速代码" %}
```py
import torch
from time import time

avg_time = 0
for i in range(100):
  start_time = time()
  a = torch.rand(1024, 4096)
  b = torch.rand(4096, 1024)
  c = a @ b
  duration = time() - start_time
  avg_time += (duration - avg_time) / (i + 1)
  print(c[0,0])
print(f"avg time used: {avg_time*1000}ms")
```
{% endspoiler %}

{% spoiler "numpy.py Numpy测速代码" %}
```py
import numpy as np
from time import time

avg_time = 0
for i in range(100):
  start_time = time()
  a = np.random.rand(1024, 4096)
  b = np.random.rand(4096, 1024)
  c = a @ b
  duration = time() - start_time
  avg_time += (duration - avg_time) / (i + 1)
  print(c[0,0])
print(f"avg time used: {avg_time*1000:.2f}ms")
```
{% endspoiler %}

