---
title: ROS2速查表
hide: false
math: true
abbrlink: 30945
date: 2025-01-12 10:07:41
index\_img:
banner\_img:
category:
tags:
---

## 初始化项目
> 构建机器人的初始化环境模板可以参考[GitHub - joshnewans/my_bot](https://github.com/joshnewans/my_bot), 基于该模板构建的带有差速控制的机器人和gazebo仿真环境的例子[GitHub - joshnewans/articubot_one](https://github.com/joshnewans/articubot_one/tree/420dc2b4d1a14274d38e3e3c76f7aa0ee7842427)

初始化Python项目:
```bash
ros2 pkg create --build-type ament_python my_python_package
```
初始化cmake项目:
```bash
ros2 pkg create my_cmake_package
```
在cmake中也可以写Python程序，只需要在`CMakeLists.txt`中加入
```cmake
install(
  DIRECTORY directory1 directory2 directory3 ...
  DESTINATION share/${PROJECT_NAME}
)
```

使用colcon构建项目(安装colcon`sudo apt install python3-colcon-common-extensions`):
```bash
cd /ros2_ws
colcon build --symlink-install  # 编译所有包
colcon build --symlink-install --packages-select <package1> ...  # 编译指定包
```
`--symlink-install`使用虚拟连接python代码，URDF，yaml配置文件（无需编译的文件），当项目中文件修改后，运行即是最新更新的文件。

## Launch文件

### 按包名称获取绝对路径
```python
from ament_index_python.packages import get_package_share_directory
path_pkg = get_package_share_directory('package_name')
```

### 获取URDF
#### 解析xacro文件
```python
import xacro
path_xacro_file = ".../xx.xacro"
robot_xacro = xacro.process_file(path_xacro_file)
robot_description = robot_xacro.toxml()  # 转为URDF格式
```
#### 读取URDF

