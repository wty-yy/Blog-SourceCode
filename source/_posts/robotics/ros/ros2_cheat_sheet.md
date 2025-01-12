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
from ament_index_python.packages import get_package_share_directory, get_package_prefix
# /ros2_ws/install/<package_name>/share/<package_name>
path_install_pkg = get_package_share_directory('package_name')
# /ros2_ws/install/<package_name>
path_prefix_pkg = get_package_prefix('package_name')
```

### 获取URDF
#### 解析xacro文件
```python
import xacro
path_xacro_file = ".../xx.xacro"
robot_xacro = xacro.process_file(path_xacro_file)
robot_description = robot_xacro.toxml()  # 转为URDF的xml格式
```
#### 读取URDF
```python
with open(path_urdf_file, 'r') as urdf_file:
  robot_description = urdf_file.read()  # 直接读取即可
```

## SolidWorks模型转换为URDF
### SolidWorks转ROS1的URDF文件
> 先安装sw插件[ros/solidworks_urdf_exporter](https://github.com/ros/solidworks_urdf_exporter)，用插件导出为ROS1的urdf，详细请参考[CSDN - solidworks模型导出urdf（超详细）配合视频观看](https://blog.csdn.net/weixin_42899627/article/details/141901240)

此处需要注意的就是尽可能简化link的数量，并且对每个link都要加上各自的坐标系（通过先加入参考点，再定义xyz三个方向），在URDF导出时候每个links选择对应的坐标系即可
> 如果有的选了坐标系有的没选，就会报错哦

|links|对应坐标系|
|-|-|
|![links](/figures/robotics/ros2/sw2urdf_sw_links.png)|![axises](/figures/robotics/ros2/sw2urdf_sw_axises.png)|
### ROS1的URDF转ROS2的URDF
这里使用fish1sheep的转换代码[GitHub - sw2urdf_ROS2](https://github.com/fish1sheep/sw2urdf_ROS2)，我加入了一些简单的功能[GitHub - wty-yy/sw2urdf_ROS2](https://github.com/wty-yy/sw2urdf_ROS2)，使用方法（可参考项目的`README.md`）

1. 使用[ros/solidworks_urdf_exporter](https://github.com/ros/solidworks_urdf_exporter)插件导出为ROS1的URDF项目文件夹，记为`urdf_proj`
    ```bash
    # 用solidworks_urdf_exporter到处的格式应该如下
    path/to/urdf_proj
    ├── CMakeLists.txt
    ├── config
    ├── export.log
    ├── launch
    ├── meshes
    ├── package.xml
    ├── textures  # 可能没有也没关系
    └── urdf
    ```
2. 修改`insert_urdf.py`中的`base_link`为你机器人基准link的名称（第一个设置的link，默认叫`base_link`，因为需要创建base_footprint作为基准，`base_footprint_joint`所需的`xyz`偏移量根据机器人需要设定）
3. 在ROS2的工作空间下，执行`python3 dir_ros2.py`，**进入到**`urdf_proj`文件夹，点击确认，返回如下信息则说明成功：
    {% spoiler "成功导出输出的信息" %}
    ```bash
    Selected directory: path/to/urdf_proj
    Successfully deleted the 'launch' folder.
    Successfully deleted the 'CMakeLists.txt' file.
    Successfully deleted the 'package.xml' file.
    Successfully created an empty 'launch' folder.
    Successfully saved 'display.launch.py' as: path/to/urdf_proj/launch/display.launch.py
    Successfully saved 'CMakeLists.txt' as: path/to/urdf_proj/CMakeLists.txt
    Successfully saved 'package.xml' as: path/to/urdf_proj/package.xml
    Content successfully inserted into path/to/urdf_proj/urdf/urdf_proj.urdf at line 7
    Content successfully inserted into path/to/urdf_proj/urdf/model.sdf at line 1
    Directory /root/.gazebo/models/urdf_proj already exists.
    File path/to/urdf_proj/urdf/model.sdf successfully copied to /root/.gazebo/models/urdf_proj.
    Successfully saved 'sdf.config' as: /root/.gazebo/models/urdf_proj
    Target directory /root/.gazebo/models/urdf_proj/meshes already exists!
    Target directory /root/.gazebo/models/urdf_proj/materials/textures already exists!
    File path/to/urdf_proj/urdf/model.sdf successfully deleted.
    Successfully saved 'gazebo.launch.py' as: path/to/urdf_proj/launch/gazebo.launch.py
    ```
    {% endspoiler %}
4. 将转换完毕的ROS2的URDF项目文件夹`urdf_proj`复制到ROS2的工作路径下（例如`/ros2_ws/src`），执行
```bash
cp -r path/to/urdf_proj /ros2_ws/src
cd /ros2_ws
colcon build --symlink-install
source ./install/setup.sh

ros2 launch urdf_proj display.launch.py  # 启动RVIZ2显示机器人
# 或者
ros2 launch urdf_proj gazebo.launch.py  # 启动GAZEBO仿真
```

|rviz2|gazebo|
|-|-|
|![rviz2](/figures/robotics/ros2/rviz2_cubot_urdf.png)|![gazebo](/figures/robotics/ros2/gazebo_cubot_urdf.png)|

### URDF无法在Gazebo中打开
> 参考[Robotics Stack Exchange - Where does Gazebo set the GAZEBO_MODEL_PATH environment variable?](https://robotics.stackexchange.com/questions/1170/where-does-gazebo-set-the-gazebo-model-path-environment-variable), [GitHub panda_simulator issues - How do I add an .stl to the gazebo simulation?](https://github.com/justagist/panda_simulator/issues/58)

执行上述`ros2 launch urdf_proj gazebo.launch.py`可能遇到**Gazebo一直卡在启动界面**的问题，这是因为`STL`文件无法找到，也就是`package://.../*.STL`中的`package`不在环境变量`GAZEBO_MODEL_PATH`中。

由于`echo $GAZEBO_MODEL_PATH`是空的（我的Gazebo11就没有这个环境变量），如果直接赋路径会导致不包含默认路径，直接无法打开gazebo，所以先要将默认的路径添加进去（可以在`~/.bashrc`中加入`export GAZEBO_MODEL_PATH=/usr/share/gazebo-11/models:${HOME}/.gazebo/models
`，`gazebo-11`填写你的gazebo版本），再在launch文件中加入我们所需的路径

修改`launch.py`文件方法如下，打开`launch/gazebo.launch.py`文件（用sw转urdf插件自动就会生成），加入如下内容：

```python
from ament_index_python.packages import get_package_prefix

package_name = 'cubot_v2_sw2urdf'
pkg_share = os.pathsep + os.path.join(get_package_prefix(package_name), 'share')
if 'GAZEBO_MODEL_PATH' in os.environ:  # 如果你修改了~/.bashrc, 就会执行这个
    os.environ['GAZEBO_MODEL_PATH'] += pkg_share
else:  # 注意此处gazebo-11修改为你的gazebo版本
    os.environ['GAZEBO_MODEL_PATH'] = "/usr/share/gazebo-11/models" + pkg_share
```

{% spoiler "完整gazebo.launch.py文件如下" %}
```python
import launch
import launch_ros
from ament_index_python.packages import get_package_share_directory, get_package_prefix
from launch.launch_description_sources import PythonLaunchDescriptionSource
import os


def generate_launch_description():
    # Get default path
    robot_name_in_model = "cubot_v2_sw2urdf"
    urdf_tutorial_path = get_package_share_directory('cubot_v2_sw2urdf')
    default_model_path = os.path.join(
        urdf_tutorial_path, 'urdf', 'cubot_v2_sw2urdf.urdf')

    # Read URDF file content
    with open(default_model_path, 'r') as urdf_file:
        robot_description = urdf_file.read()

    robot_state_publisher_node = launch_ros.actions.Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}]
    )

    # Include another launch file for Gazebo
    launch_gazebo = launch.actions.IncludeLaunchDescription(
        PythonLaunchDescriptionSource([get_package_share_directory(
            'gazebo_ros'), '/launch', '/gazebo.launch.py']),
    )

    # Request Gazebo to spawn the robot
    spawn_entity_node = launch_ros.actions.Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=['-topic', '/robot_description',
                   '-entity', robot_name_in_model])

    package_name = 'cubot_v2_sw2urdf'
    pkg_share = os.pathsep + os.path.join(get_package_prefix(package_name), 'share')
    if 'GAZEBO_MODEL_PATH' in os.environ:
        os.environ['GAZEBO_MODEL_PATH'] += pkg_share
    else:
        os.environ['GAZEBO_MODEL_PATH'] = "/usr/share/gazebo-11/models" + pkg_share

    return launch.LaunchDescription([
        robot_state_publisher_node,
        launch_gazebo,
        spawn_entity_node
    ])
```
{% endspoiler %}

再执行`ros2 launch urdf_proj gazebo.launch.py`就OK啦
