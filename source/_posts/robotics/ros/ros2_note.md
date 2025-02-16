---
title: ROS2笔记
hide: false
math: true
abbrlink: 30945
date: 2025-01-12 10:07:41
index\_img:
banner\_img:
category:
tags:
---

> 本文大部分topic逻辑图片来自于[YouTube - Articulated Robotics](https://www.youtube.com/@ArticulatedRobotics)的视频，ROS2学习和制作小车可以参考他的视频，非常详细！

## DEBUG工具
`rqt`是一个很好用的ROS2调试工具，能够显示各个node和topic之间的关系图，直接运行`rqt`，在上方`Plugins -> Introspection -> Node Graphe`即可打开节点关系图插件

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

### 指令基础
#### 启动文件基础
启动文件只需实现`generate_launch_description`函数，该函数返回`launch.LaunchDescription`类
#### 启动Launch文件
创建`*.launch.py`文件，一般放在项目的`launch/`文件夹下
```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription, ExecuteProcess
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node
from launch.conditions import IfCondition
def generate_launch_description():
  return LaunchDescription([  # 定义Launch启动的对象
    # 定义launch文件的cmd argument参数输入
    # 使用方法ros2 launch *.launch.py robot_name:=cubot
    DeclareLaunchArgument(  
      name='robot_name',  # 参数名为robot_name
      default_value='cubot',  # 默认参数
      description='Define your robot name'  # 对参数的描述
    ),
    DeclareLaunchArgument(  
      name='rviz',  # 参数名为rviz
      default_value=false,  # 默认参数
      description='Run Rviz2'  # 对参数的描述
    ),
    ExecuteProcess(cmd=['gazebo'], output='screen'),  # 执行的命令行指令
    # 开启节点，等价于
    # ros2 run turtlesim turtlesim_node
    Node(  
      package='turtlesim',  # 包名称
      executable='turtlesim_node',  # 执行的文件名
      arguments=[...]  # 传入的命令行参数
      parameters=[{'data': 123}]  # 传入节点中的参数，保存到ros2 param的turtlesim_node/data下
      remappings=[('origin_topic', 'target_topic')]  # 将节点创建的origin_topic映射到target_topic
      name='turtlesim_node'  # 节点名称
    ),
    Node(
      package='rviz2',
      executable='rviz2',
      name='rviz2',
      output='screen',
      condition=IfCondition(LaunchConfiguration("rviz")),  # 当rviz为true时启动该Node
      parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}]
    ),
    # 执行launch文件，等价于
    # ros2 launch *.launch.py
    IncludeLaunchDescription(
      # 需要启动的launch文件的路径
      PythonLaunchDescriptionSource(description_launch_path),  # 当path是FindPackage类
      # description_launch_path,  # 当path是字符串
      launch_arguments={
        'use_sim_time': str(use_sim_time),
        'publish_joints': 'false',
      }.items()  # 注意需要转为迭代器
    )
  ])
```
#### 按包名称获取绝对路径
```python
from launch.substitutions import PathJoinSubstitution
from launch_ros.substitutions import FindPackageShare, FindPackagePrefix
# /ros2_ws/install/<package_name>/share/<package_name>
path_install_pkg = FindPackageShare('package_name')
# /ros2_ws/install/<package_name>/share/<package_name>/config/robot.urdf
path_urdf = PathJoinSubstitution([
  path_install_pkg, 'config', 'robot.urdf'
])
# /ros2_ws/install/<package_name>
path_prefix_pkg = FindPackagePrefix('package_name')
```
{% spoiler 旧方法，使用get_package_share_directory %}
```python
from ament_index_python.packages import get_package_share_directory, get_package_prefix
# /ros2_ws/install/<package_name>/share/<package_name>
path_install_pkg = get_package_share_directory('package_name')
# /ros2_ws/install/<package_name>
path_prefix_pkg = get_package_prefix('package_name')
```
{% endspoiler %}

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

## URDF相关
### URDF文件格式简述
[YouTube -  How do we describe a robot? With URDF! | Getting Ready to build Robots with ROS #7 ](https://www.youtube.com/watch?v=CwdbsvcpOHM)讲解的非常好，URDF本质上就是描述的两两连接处（link）之间的变换（joint），如下图所示。

这个机器包含4个links：`Base, Slider, Arm, Camera`，两两link之间存在相对位置关系，我们用欧拉角（三维旋转平移变换）来表述从父类到子类的变换，分别为：`Slider Joint`（从Base到Slider，后面同理），`Arm Joint, Cam Joint`，不难发现整个机器人仅存在一个link没有joint，通常称之为`Base`或`base_link`，它将作为我们机器人的原点。
![urdf joint and link example](/figures/robotics/ros2/urdf_joint_and_link.png)

> 两个URDF样例，可以参考：xacro手动编写的简易小车[GitHub - demo/robot_main.xacro](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/description/demo/robot_main.xacro)，sw2urdf转化的包含mesh的详细小车[GitHub - cubot_v2/urdf/cubot_v2_sw2urdf.urdf](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/description/cubot_v2/urdf/cubot_v2_sw2urdf.urdf)

一个URDF就是xml文件，其中应包含如下的tag信息：
1. 开头第一行为`<?xml version="1.0" ?>`
2. 所有内容需包含在`<robot name="your_robot_name"> ... </robot>`这个tag中

    URDF中仅需包含两种tag内容（不包含插件等）：

3. `<link name="**_link">`: 物体的实体定义，需要包含以下三个tag：
    - `<visual>`: 视觉渲染，包含以下几种tag：
        - `<geometry>`：几何体（包含`cylinder, sphere, box`三种常用tag形状）
        - `<origin xyz="* * *" rpy="* * *">`：`<geometry>`的中心原点，相对于`joint`给出的坐标系
        - `<material>`：颜色
    - `<collision>`：碰撞箱
        - `<geometry>`：几何体（可以和`<visual><geometry>`保持一致，也可以进行简化）
        - `<origin xyz="* * *" rpy="* * *">`：`<geometry>`的中心原点，相对于`joint`给出的坐标系
    - `<inertial>`：惯性矩阵
        - `<mass>`：质量大小（单位kg）
        - `<origin xyz="* * *" rpy="* * *">`：质心位置，相对于`joint`给出的坐标系
        - `<inertial>`：3x3惯性矩阵定义，在[wikipedia - List of moments of inertia](https://en.wikipedia.org/wiki/List_of_moments_of_inertia)中可以找到简单几何体的惯性矩阵（如果是复杂的，可以通过现在solidworks中建模，直接导出为URDF文件，参考上文[SolidWorks模型转换为URDF](./#solidworks模型转换为urdf)）

4. `<joint name="**_joint" type="...">`：两个link对应坐标系之间的欧拉角变换，以及变换的`type`，其中`type`包含常用的四种：`revolute, prismatic, continuous, fixed`如下图所示，可以包含以下5中tag：
    - `<parent link="**_link">`：父级link
    - `<child link="**_link">`：子级link
    - `<origin xyz="* * *" rpy="* * *">`：子级link相对于父级link的坐标系变换
    - `<axis xyz="1 0 0">`：定义type的变换轴，例如`revolute`将axis作为旋转轴（对于`fixed`可以没有）
    - `<limit lower=* upper=* velocity=* effort=*>`：对关节变换进行限制（可以没有）

![urdf常用的Joint类型](/figures/robotics/ros2/urdf_common_joint_types.png)

### URDF模型显示
这里以[GitHub - wty-yy/ros-car-cubot tag:v2-cubot-sim-demo](https://github.com/wty-yy/ros-car-cubot/tree/v2-cubot-sim-demo)为例，[`launch/rsp.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/launch/rsp.launch.py)文件能够将xacro转为URDF配置，并通过robot state publisher将URDF发布到`/tf`和`/robot_description`两个topic上，并且会创建`/robot_state_publisher robot_description`全局变量（该变量存储的就是URDF文件信息）:
![URDF robot state publisher struct )](/figures/robotics/ros2/urdf_rsp_struct.png)
> 上图来自[YouTube - Creating a rough 3D model of our robot with URDF 208s](https://www.youtube.com/watch?v=BcjHyhV0kIs&t=208s)

如果我们此时打开`rviz2`查看小车的模型会发现两个轮子无法正常显示，这是因为两者存在一个可变的TF(transform)，也就是joint为`continue`关系，TF在一个可选的范围内变换，模型并不知道当前变换的具体值，因此无法显示，这就需要一个`joint_state_publisher`来产生一个虚拟的`/joint_states`节点，告诉`robot_state_publisher`当前TF具体是多少（如果是真机上使用，则需要用真机的`/joint_states`了），执行[`launch/display.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/launch/display.launch.py)即可看到完成的小车了。完整显示小车的节点关系图如上图所示，效果对比图如下所示。
|no joint state|with joint state|
|-|-|
|![no joint state](/figures/robotics/ros2/rsp_no_joint_state.png)|![with joint state](/figures/robotics/ros2/rsp_with_joint_state.png)|

### SolidWorks模型转换为URDF
#### SolidWorks转ROS1的URDF文件
> 先安装sw插件[ros/solidworks_urdf_exporter](https://github.com/ros/solidworks_urdf_exporter)，用插件导出为ROS1的urdf，详细请参考[CSDN - solidworks模型导出urdf（超详细）配合视频观看](https://blog.csdn.net/weixin_42899627/article/details/141901240)

此处需要注意的就是尽可能简化link的数量，并且对每个link都要加上各自的坐标系（通过先加入参考点，再定义xyz三个方向），在URDF导出时候每个links选择对应的坐标系即可
> 如果有的选了坐标系有的没选，就会报错哦

|links|对应坐标系|
|-|-|
|![links](/figures/robotics/ros2/sw2urdf_sw_links.png)|![axises](/figures/robotics/ros2/sw2urdf_sw_axises.png)|
#### ROS1的URDF转ROS2的URDF
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

#### URDF无法在Gazebo中打开
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

## Gazebo相关
### 使用Gazebo控制器插件控制仿真模型
将模型直接导入到Gazebo非常简单（不带任何控制方法），参考[launch/launch_sim.launch.py](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/launch/launch_sim.launch.py)，只需三步：
1. 使用`robot_state_publisher`先初始化`/robot_discruiption`和`/tf`节点
2. 打开一个gazebo空场景`ros2 launch gazebo_ros gazebo.launch.py`
3. 将模型导入进去`ros2 run gazebo_ros spawn_entity.py -topic robot_description -entity <your_robot_name>`

打开`rviz2`可以看到我们小车的模型，如果没有加上控制器，则无法显示小车轮子的状态，有两种控制器：
1. `ros2_controller`：能够同时对真机和gazebo进行控制，配置较为复杂，后文会进行介绍
2. `gazebo_controller`：通过gazebo插件，能够直接对gazebo中的模型进行控制，这里先用这种方法

在urdf文件中加入gazebo controller插件，插入到URDF中全文可参考[cubot_v2_sw2urdf.urdf #215](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/description/cubot_v2/urdf/cubot_v2_sw2urdf.urdf#L215C2-L215C9)，插件的使用说明参考[gazebo_plugins.doc - GazeboRosDiffDrive](https://docs.ros.org/en/rolling/p/gazebo_plugins/generated/classgazebo__plugins_1_1GazeboRosDiffDrive.html)，就可以通过gazebo生成虚拟的`/tf`来显示轮子joint的状态（不再通过`/joint_states`）。

{% spoiler "差分运动控制插件" %}
```xml
<gazebo>
  <plugin name="diff_drive" filename="libgazebo_ros_diff_drive.so">
    <!-- 插件参考文档 https://docs.ros.org/en/rolling/p/gazebo_plugins/generated/classgazebo__plugins_1_1GazeboRosDiffDrive.html -->
    <!-- Wheel Information 两轮子joint设置 -->
    <left_joint>left_wheel_joint</left_joint>
    <right_joint>right_wheel_joint</right_joint>
    <!-- wheel separation 两轮中点(frame)间距, 根据robot_main定义中0.175*2得到 -->
    <wheel_separation>0.35</wheel_separation>
    <!-- wheel diameter 两轮直径0.5*2得到 -->
    <wheel_diameter>0.1</wheel_diameter>

    <!-- Limits -->
    <max_wheel_torque>200</max_wheel_torque>
    <max_wheel_acceleration>10.0</max_wheel_acceleration>

    <!-- Output odom是gazebo对模型的虚拟基础点, base_link会相对其进行tf -->
    <odometry_frame>odom</odometry_frame>
    <robot_base_frame>base_footprint</robot_base_frame>

    <publish_odom>true</publish_odom>
    <publish_odom_tf>true</publish_odom_tf>
    <publish_wheel_tf>true</publish_wheel_tf>
  </plugin>
</gazebo>
```
{% endspoiler %}

**注意**：使用gazebo control时，由于小车的原点会发生变化（这样小车才能运动起来），需要重新设置一个世界原点坐标系，在gazebo中称为**odometry_frame**（里程计），我们将其对应的节点记为`odom`，那么我们原来的小车原点`base_link`或者`base_footprint`就要相对`odom`进行变化了，这些需要在插件中进行配置。

|Gazebo Controller插件逻辑|Gazebo和rsp逻辑关系|
|-|-|
|![gazebo control插件逻辑](/figures/robotics/ros2/gazebo_control_plugin_part_struct.png)|![gazebo和rsp逻辑关系](/figures/robotics/ros2/gazebo_control_plugin_full_struct.png)|

![节点关系图gazebo+diff drive+rsp+teleop twist keyboard](/figures/robotics/ros2/gazebo_rsp_teleop_twist_keyboard.png)

### Gazebo中摩擦力/颜色配置
```xml
<gazebo reference="**_link">
  <!-- link对应的颜色设置, 在URDF中设置的颜色无效 -->
  <material>Gazebo/Blue</material>
  <!-- link对应的摩擦, mu1,mu2一起配置 -->
  <mu1 value="0.001"/>
  <mu2 value="0.001"/>
</gazebo>
```

## teleop 远程控制器
### 控制器输入
当我们启动了`/cmd_vel` topic后，需要向其发送对应类型的控制数据，例如`Twist`就是包含三个线速度与三个角速度的控制数据，而控制小车只需要linear x和angular z即可（[Gazebo仿真中启动](./#使用gazebo控制器插件控制仿真模型)）就可以通过键盘或者手柄来输入控制指令了。
#### 键盘控制器输入
对于Twist数据可以通过`teleop_twist_keyboard`来发送数据：
```bash
sudo apt install ros-${ROS_DISTRO}-teleop-twist-keyboard
ros2 run teleop_twist_keyboard teleop_twist_keyboard
```
可以通过如下9个按键来控制小车了（需要先激活终端哦）
```bash
Moving around:
   u    i    o
   j    k    l
   m    ,    .
```

#### 手柄控制器输入
> 参考代码[GitHub - launch/joy.launch.py](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/launch/joy.launch.py)，配置文件[GitHub - config/joystick.yaml](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/config/joystick.yaml)

```bash
# 安装手柄相关包
sudo apt install "ros-${ROS_DISTRO}-joy*"
```

手柄数据需要先通过`ros2 run joy joy_node`启动一个手柄信息读取topic，我们可以通过`ros2 topic echo /joy`来看获取到的实时手柄信息，并记录下我们想要发送指令的按键编号，然后我们创建一个配置文件，写每个`teleop_twist`功能和手柄按键旋钮的对应关系:

> 注意axis填的编号为连续轴的，button填的编号是按钮的，两个编号是分开计数的

```bash
# 修改teleop_twist配置参数到手柄对应按键上, 控制小车, 手柄为xbox series
teleop_node:
  ros__parameters:
    # 设置控制前进后退的轴，通常是右摇杆的 Y 轴
    axis_linear.x: 4  # 右摇杆的 Y 轴（前后方向）

    # 设置控制角速度的轴，通常是右摇杆的 X 轴
    axis_angular.yaw: 3  # 右摇杆的 X 轴（控制旋转）

    # 设置启动小车要一直按下的按钮
    enable_button: 4  # 启动的按钮 右上角LB
    enable_turbo_button: 5  # 启动涡轮加速的按钮 左上角RB

    # 设置线性和角速度的缩放比例
    scale_linear: 0.5  # 线速度的比例
    scale_angular: 0.5  # 角速度的比例
    scale_linear_turbo: 1.0  # 涡轮控制下线速度的比例
    scale_angular_turbo: 1.0  # 涡轮控制下角速度的比例
```

我写了一个launch文件可以同时启动gazebo,rsp,joystick三者[GitHub - launch/launch_all_sim_rsp_joy.launch.py](https://github.com/wty-yy/ros-car-cubot/blob/v2-cubot-sim-demo/launch/launch_all_sim_rsp_joy.launch.py)，直接启动可以看到下图的节点关系：
![Gazebo + RSP + joystick](/figures/robotics/ros2/gazebo_rsp_joystick_node_graph.png)

这样我们就可以用手柄直接控制仿真中的小车啦！效果如下所示，手柄就可以直接后端控制哦
{%
    dplayer
    "url=/videos/gazebo_rsp_joystick_control.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}

## ROS2 controller
> 相关教程：（差分驱动小车为例）
> 1. Gazebo仿真作为硬件接口[YouTube - Solving the problem EVERY robot has (with ros2_control) ](https://www.youtube.com/watch?v=4QKsDf1c4hc)
> 2. 真机驱动作为硬件接口[YouTube - Using ros2_control to drive our robot (off the edge of the bench...) ](https://www.youtube.com/watch?v=4VVrTCnxvSw)
> 3. 如何自定义硬件接口[YouTube - You can use ANY hardware with ros2_control](https://www.youtube.com/watch?v=J02jEKawE5U)
> 4. ROS2官方给出的ros2_control样例，自定义硬件接口可以在此基础上修改[GitHub - ros2_control_demos](https://github.com/ros-controls/ros2_control_demos)

```bash
# 安装控制器相关包
sudo apt install ros-${ROS_DISTRO}-ros2-control ros-${ROS_DISTRO}-ros2-controllers
```

ROS2控制器原理简单可以用如下图来理解，分为三个部分，从左到右分别为**控制指令**，**控制器**，**硬件接口（驱动）**，而每个需要使用到的代码语言，接口均需要保证正确才能跑通
![ros2 control控制小车为例](/figures/robotics/ros2/ros2_control_car_example.png)

详细分析每个部分如下图所示，当我们完成驱动器(driver)和控制器(controller)后，我们只需要完成两个配置文件(Yaml, URDF)的修改，即可启动对应的驱动和控制器，从下图看出，硬件接口(Hardware Interface)中只需仿真(Simulator)和真机(Robot)二选一。下面我们分别来介绍如何使用Gazebo和真机作为硬件接口。
![ros2 controller struct](/figures/robotics/ros2/ros2_controller_struct.drawio.png)

### GazeboSystem模拟硬件接口
```bash
sudo apt install ros-${ROS_DISTRO}-gazebo-ros2-control
```
完整代码：[GitHub - v2.1-cubot-gazebo-ros2-control](https://github.com/wty-yy/ros-car-cubot/tree/v2.1-cubot-gazebo-ros2-control)

使用方法：执行[`launch_sim.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/launch/launch_sim.launch.py)或者[`launch_all_sim_rsp_joy.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/launch/launch_all_sim_rsp_joy.launch.py)，启动如下键盘控制
```bash
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r /cmd_vel:=/diff_cont/cmd_vel_unstamped
```
即可使用键盘输出指令给DiffDriveController来控制小车了（和[v2-cubot-sim-demo](https://github.com/wty-yy/ros-car-cubot/tree/v2-cubot-sim-demo)中所使用的`gazebo_ros_diff_drive`区别，在于按一次只会走一点距离然后停下，如果将小车转一圈回到原点，仿真和rviz2中看到的可能存在误差）

---

启动ros2 control仅需修改四个位置：

1. 添加Yaml文件[`config/my_controllers.yaml`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/config/my_controllers.yaml)，此文件将配置如下内容：
    - `controller_manager`中将要在launch中启动的controllers名称，例如这里启动了`DiffDriveController`名称为`diff_cont`和`JointStateBroadcaster`名称为`joint_broad`
    - 对controllers的配置信息，例如这里配置了`diff_cont`，定义了驱动关节，轮子间距、半径、控制频率等信息
2. 修改URDF文件[`description/ros2_control.xacro`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/description/ros2_control.xacro)：
    - 使用`gazebo_ros2_control/GazeboSystem`作为仿真驱动，并配置一些仿真参数，例如最大速度等（要做速度控制）
    - 由于`GazeboSystem`会帮我们启动`controller_manager`节点，因此还需要将`config/my_controllers.yaml`配置文件都放到[26行](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/description/ros2_control.xacro#L26)插件初始化位置
3. 修改[`description/robot.xacro`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/description/robot.xacro)：替换掉原来的`gazebo_control.xacro`
4. 修改[`launch/launch_sim.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/launch/launch_sim.launch.py)启动文件，添加两个controller节点启动命令：`ros2 run controller_manager spawner [diff_cont|joint_broad]`，这两个controller名字正好和第三步的`my_controllers.yaml`中设置的名称一致

> 仿真中的`use_sim_time`需要都给成`true`，在[launch/launch_sim.launch.py](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/launch/launch_sim.launch.py)中设置

**注意**：我们无需启动`controller_manager`，因为在执行`ros2 run gazebo_ros spawn_entity.py -topic robot_description -entity my_cubot`时候，Gazebo读取URDF配置，启动了GazeboSystem仿真物理端口，顺便就把`controller_manager`启动了，因此无需多次启动。

**小心**：在写[`config/my_controllers.yaml`](https://github.com/wty-yy/ros-car-cubot/blob/v2.1-cubot-gazebo-ros2-control/config/my_controllers.yaml)文件时，千万不要将`controller_manager`配置的`update_rate`加上小数点，否则启动不起来，也不报错😑

> 由于Gazebo已经帮我们写好的仿真硬件接口了，所以看起来非常简单吧！

### 真机硬件接口

完整代码：[GitHub - v2.2-cubot-real-ros2-control](https://github.com/wty-yy/ros-car-cubot/tree/v2.2-cubot-real-ros2-control)

如果我们使用真机作为硬件接口，就需要我们自己手动写仿真接口了，参考这个视频[YouTube - You can use ANY hardware with ros2_control](https://www.youtube.com/watch?v=J02jEKawE5U)，Joshnewans是在[GitHub - ros2_control_demos](https://github.com/ros-controls/ros2_control_demos)的基础上加入serial（串口）通讯实现和Arduino的硬件接口。

由于我重写了Arduino的pid代码[GitHub - wty-yy/arduino_pid_controlled_motor](https://github.com/wty-yy/arduino_pid_controlled_motor/)，因此我也要稍微修改下[GiHub - wty-yy/diffdrive_arduino](https://github.com/wty-yy/diffdrive_arduino)，完成自定义驱动后，我们类似GazeboSystem修改如下四个位置：

1. 修改URDF文件[`description/ros2_control.xacro`](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/description/ros2_control.xacro)：使用我们自定义的`diffdrive_arduino/DiffDriveArduinoHardware`作为仿真驱动（**驱动名称**在驱动项目的[diffdrive_arduino.xml](https://github.com/wty-yy/diffdrive_arduino/blob/master/diffdrive_arduino.xml)文件中进行了定义），并配置一些仿真参数，例如joint名称、比特率、编码器与点击转速之比等
2. 修改[`description/robot.xacro`](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/description/robot.xacro)：替换掉原来的`gazebo_control.xacro`
3. 添加Yaml文件[`config/my_controllers.yaml`](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/config/my_controllers.yaml)，此文件将配置如下内容：
    - `controller_manager`中将要在launch中启动的controllers名称，例如这里启动了`DiffDriveController`名称为`diff_cont`和`JointStateBroadcaster`名称为`joint_broad`
    - 对controllers的配置信息，例如这里配置了`diff_cont`，定义了驱动关节，轮子间距、半径、控制频率、最大转速度等信息
4. 添加[`launch/launch_robot.launch.py`](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/launch/launch_robot.launch.py)启动文件，这个位置需要**注意**的位置最多：
    1. `robot_state_publisher`中的`use_sim_time`需要置为`false`，[22行](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/launch/launch_robot.launch.py#L22)
    2. 由于我们没有GazeboSystem帮我们启动`controller_manager`，因此需要我们手动启动节点，并将URDF和配置文件导入，**这里非常重要！如果后续启动出问题，一定要检查此处**[31行](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/launch/launch_robot.launch.py#L31)，由于humble版本的`controller_manager`会默认从`~/robot_description`节点下找URDF文件，所以我们需要重映射一下节点
    3. 添加两个controller节点启动命令需要跟随`controller_manager`启动，所以[59行](https://github.com/wty-yy/ros-car-cubot/blob/v2.2-cubot-real-ros2-control/launch/launch_robot.launch.py#L59)用到了`OnProcessStart`函数：`ros2 run controller_manager spawner [diff_cont|joint_broad]`，这两个controller名字正好和第三步的`my_controllers.yaml`中设置的名称一致

成功启动后，我们将看到下图日志信息：
![ros2 controller成功启动](/figures/robotics/ros2/ros2_controller_start_success.png)

控制器启动指令：
```bash
ros2 launch cubot joy.launch.py  # 手柄控制器启动指令
ros2 run teleop_twist_keyboard teleop_twist_keyboard --ros-args -r  /cmd_vel:=/diff_cont/cmd_vel_unstamped  # 键盘控制器启动指令
```

控制测试
1. 前进距离1m是否和rviz2显示一格一致，键盘控制`i`前进，`,`后退
2. 能否原地转圈，`j`逆时针，`l`顺时针
3. 使用手柄测试下能否连续控制小车

如果前两个测试不准，可以调整pid参数[arduino_pid_controlled_motor/pid.h](https://github.com/wty-yy/arduino_pid_controlled_motor/blob/master/pid.h)，调整思路（Deepseek给出）：
1. 先调整Kp：将Ki和Kd设为0，只调整Kp，直到系统能够快速响应但不过度振荡
2. 加入Kd：在Kp调整好后，加入Kd，抑制振荡并加快系统稳定
3. 最后调整Ki：加入Ki，消除稳态误差，但注意不要使Ki过大

我最后调的结果为：`kp=15, ki=0, kd=0.1`

{%
    dplayer
    "url=/videos/cubot_real_ros2_control.mp4"
    "loop=yes"  //循环播放
    "theme=#FADFA3"   //主题
    "autoplay=true"  //自动播放
    "screenshot=true" //允许截屏
    "hotkey=true" //允许hotKey，比如点击空格暂停视频等操作
    "preload=auto" //预加载：auto
    "volume=0.9"  //初始音量
    "playbackSpeed=1"//播放速度1倍速，可以选择1.5,2等
    "lang=zh-cn"//语言
    "mutex=true"//播放互斥，就比如其他视频播放就会导致这个视频自动暂停
%}
