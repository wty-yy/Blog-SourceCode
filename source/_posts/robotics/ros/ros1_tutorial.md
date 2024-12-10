---
title: ROS1入门
hide: false
math: true
abbrlink: 19333
date: 2024-12-09 11:11:26
index\_img:
banner\_img:
category:
- Robotics
- ROS
tags:
---

# ROS
参考官方教程进行学习[ROS/Tutorials](http://wiki.ros.org/ROS/Tutorials)，先从ROS1开始学习而不是ROS2，是因为很多项目还是基于ROS1的，而且ROS1/2很多地方并不兼容，例如ROS2就没有catkin编译了，而且很多包名称都不相同，因此还是从ROS1开始学习吧！

## 什么是ROS
从官网上的[ROS/Introduction](http://wiki.ros.org/cn/ROS/Introduction)中可以看出，ROS是一个用于管理机器人控制的操作系统（既可以从底层控制每一个电机，也可以结合上层信息，通过雷达、深度相机进行决策），ROS运行时类似一个系统，可以开启多个不同的进程，他们称之为节点。

这个系统中的通讯包含不同类型：同步的services（服务），异步的topics（话题），以及用于数据存储的Parameter Server（参数服务器）

ROS所支持的语言有Python, C++, Lisp，下面开始用Docker安装ROS1吧。

## 安装
在[ROS/Installation](http://wiki.ros.org/Installation)上可以看到当前ROS1最长维护的版本为ROS Noetic，推荐Ubuntu20.04（高版本装不上😭），但是我们不能为了装个ROS去装这个版本的系统，因此需要用到Docker，还可以方便的使用不同版本的ROS🤗。

Docker安装与常用命令可以参考我这篇[博文](/posts/51856/)，安装完成Docker后，可以直接从docker hub上pull我准备好的ROS1环境（下载大小为1.33 GB，支持Nvidia 11.8驱动，zsh, tmux, git等工具）
```bash
docker pull wtyyy/ros:ros1-noetic-cuda11.8.0-ubuntu20.04  # 记得开代理或镜像
xhost +local:root  # 用于可视化
CATKIN_WORKSPACE=/home/yy/Coding/learn/catkin  # 路径设置为本机的catkin代码保存路径

# 启动!
# 很多nvidia或gpu相关的指令都是启动nvidia渲染X11用的, 如果没有nvidia显卡则无需这些指令（加了也没坏处）
docker run -it \
	--name ${USER}_learn_ros \
	--gpus all \
	-e NVIDIA_DRIVER_CAPABILITIES=all \
	-e "__NV_PRIME_RENDER_OFFLOAD=1" \
	-e "__GLX_VENDOR_LIBRARY_NAME=nvidia" \
	--net=host \
	--privileged \
	-e "DISPLAY" -e "QT_X11_NO_MITSHM=1" \
	-v "/dev:/dev" \
	-v "/tmp/.X11-unix:/tmp/.X11-unix" \
	-v "$CATKIN_WORKSPACE:/catkin" \
	wtyyy/ros:ros1-noetic-cuda11.8.0-ubuntu20.04 zsh
```

（当然也可以自己跟着官方教程[ROS/Installation Ubuntu](http://wiki.ros.org/Installation/Ubuntu)自己动手安装）

## 1 初级教程
### 1.1 配置ROS环境
加载ROS环境参数，通过`source /opt/ros/noetic/setup.sh`启动ROS相关的环境变量，将ROS软件加入到路径中。
> 在Docker镜像中我已经将`source /opt/ros/noetic/setup.zsh`加入到了`~/.zshrc`中，即默认就会加载ROS配置

创建工作空间，ROS的工作环境如下所示，通过`mkdir -p ~/catkin_ws/src`即可在用户目录下创建
> 在Docker镜像中使用，我将本地的`$CATKIN_WORKSPACE`路径挂在到了`/catkin_ws`下，也就是创建`/catkin_ws/src`文件夹即可

然后在`/catkin_ws`文件夹在执行`catkin_make`（相当于`cmake -B build && cd build && make`），并会自动生成`devel`文件夹，在该文件夹下会有`setup.sh`文件，通过`source`该文件可以将当前工作空间设置在环境的最顶层。

通过查看环境变量`ROS_PACKAGE_PATH`以确定当前工作路径已经被包含：
```bash
echo $ROS_PACKAGE_PATH
> /catkin/src:/opt/ros/noetic/share
```

### 1.2 ROS文件系统
这节主要介绍ROS中的软件包如何安装以及查找软件包的相应位置等操作。

#### 包路径查找指令
1. `rospack find [pkg_name]`: 输出`pkg_name`的路径。例如`rospack find roscpp`
2. `roscd [pkg_name[/subdir]]`: 类似`cd`命令，直接cd到`pkg`对应的文件夹下，还支持进入其自文件夹。例如`roscd roscpp/cmake`
3. `roscd log`: 在运行过ROS程序后，可以通过该命令进入到日志文件夹下。
4. `rosls [pkg_name[/subdir]]`: 类似`ls`命令，相当于执行`ls $(rospack find pkg_name)[/subdir]`。例如`rosls roscpp/cmake`

### 1.3 ROS包文件结构
一个caktin软件包包含至少两个文件
```bash
package/
  CMakeLists.txt  # CMake文件代码编译指令
  package.xml  # 所用到的相关包
```

多个软件包的文件格式如下
```bash
catkin_ws/
  src/
    CMakeLists.txt  # 最上层的CMake文件（自动生成）
    package1/
      CMakeLists.txt  # package1的CMake文件
      package.xml  # package1的清单文件(manifest)
    package2/
      CMakeLists.txt  # package2的CMake文件
      package.xml  # package2的清单文件(manifest)
    ...
```

#### 创建空项目
可以通过`catkin_create_pkg <pkg_name> [dep1] [dep2] ...`指令创建一个新的空项目，例如
```bash
cd /catkin/src
catkin_create_pkg tutorials std_msgs rospy roscpp
```
这样就会创建一个软件包，包含上述的`CMakeLists.txt`和`package.xml`文件，以及`src/`和`include/`目录。

于是我们就可以对其进行编译，然后将软件包加入到工作空间中：
```bash
cd /catkin
catkin_make
source ./devel/setup.sh
```

#### 查看包依赖关系
1. `rospack depends1 <pkg_name>`: 查看包的第一级依赖，在包对应的`package.xml`文件中可以找到返回的依赖文件。例如`rospack depends1 tutorials`就可以看到`std_msgs rospy roscpp`三个包。
2. `rospack depends <pkg_name>`: 递归地查找依赖包。

#### 查看package.xml文件
参考官方的[package.xml/Format 2](http://wiki.ros.org/catkin/package.xml)文档，xml文件类似于网页文件，变量定义都称为tag，格式例如`<name tag传入参数>tag定义</name>`，当前所用的版本为`Format2`至少所需的tag内容如下:
1. `<name>`: 软件包名称
2. `<version>`: 软件版本号，必须是3个用`.`分隔的整数
3. `<description>`: 对本项目的描述内容
4. `<maintainer>`: 对项目维护者信息介绍
5. `<license>`: 本项目使用的许可证

> 还有`<url>, <author>`可选信息可以加，参考用`catkin_create_pkg`创建的`package.xml`模板文件

{% spoiler 最小化package.xml例子 %}
```xml
<?xml version="1.0"?>
<package format="2">
  <name>tutorials</name>
  <version>0.0.0</version>
  <description>The tutorials package</description>

  <!-- One maintainer tag required, multiple allowed, one person per tag -->
  <!-- Example:  -->
  <!-- <maintainer email="jane.doe@example.com">Jane Doe</maintainer> -->
  <maintainer email="root@todo.todo">root</maintainer>


  <!-- One license tag required, multiple allowed, one license per tag -->
  <!-- Commonly used license strings: -->
  <!--   BSD, MIT, Boost Software License, GPLv2, GPLv3, LGPLv2.1, LGPLv3 -->
  <license>TODO</license>
</package>

```
{% endspoiler %}

声明完上述5个信息后，我们需要加入构建包所需的依赖包声明，声明函数都是类似`*depend`格式:
- `<depend>`: 最方便的导入包方式，包含下面`build, export, exec`三个命令
- `<build_depend>`: 找到包的路径，类似cmake中的`find_package(...)`
- `<build_export_depend>`: 加入包的头文件, 类似cmake中的`target_include_directories(...)`
- `<exec_depend>`: 加入包的动态链接库, 类似cmake中的`target_link_libraries(...)`
- `<test_depend>`: 指定仅用于单元测试的包, 这些包不应该在上面`export,exec`中出现
- `<buildtool_depend>`: 一般必须加的tag，制定编译所需的工具，这里一般就是`catkin`
- `<doc_depend>`: 指定用于生成文档的包

上面创建`tutorials/package.xml`最终简化版本的文件如下
```xml
<?xml version="1.0"?>
<package format="2">
  <name>tutorials</name>
  <version>0.0.0</version>
  <description>The tutorials package</description>
  <maintainer email="root@todo.todo">root</maintainer>
  <license>TODO</license>

  <buildtool_depend>catkin</buildtool_depend>
  <depend>roscpp</depend>
  <depend>rospy</depend>
  <depend>std_msgs</depend>
</package>
```

> 还可以在最后加`<export>`用于将多个包整合编译成一个元包（meta-package）

### 1.4 构建ROS软件包

这一节主要理解`catkin_make`对项目代码的编译原理，其实它就是对`cmake`指令的包装，以下两种命令等价:
```bash
# First
cd /catkin
catkin_make
# Second
cd /catkin/src
catkin_init_workspace  # 这会对src/下的所有项目创建一个父级的CMakeLists.txt
mkdir ../build && cd ../build
# 创建build配置, 安装文件位于../instsall下(如果安装), catkin工作空间配置文件保存在../devel下(运行既创建)
cmake ../src -DCMAKE_INSTALL_PREFIX=../install -DCATKIN_DEVEL_PREFIX=../devel
make  # 编译
# (可选) 等价于 catkin_make install
make install  # (可选)安装, 这样就会在/catkin/install路径下安装本软件包
```

当然此处也可以不安装在工作站位置`../install`，可以直接装到全局的ros包位置，也可以用`catkin_make`一步完成:
```bash
catkin_make -DCMAKE_INSTALL_PREFIX=/opt/ros/noetic install
```

### 1.5 ROS节点
首先安装`ros-tutorials`软件包（package）`apt install ros-noetic-ros-tutorials`（如果安装的不是桌面完整版则需安装）

ROS正常可以被描述成一个图(Graph)， 包含如下这些概念：
1. Nodes（节点）：一个可执行程序，该程序可以通过向Topic交互数据，从而与其他节点通信；
2. Messages（消息）：ROS的数据格式，当node通过subscribing（订阅，接受消息）或者publishing（发布，发送消息）从Topic交互信息时使用的格式；
3. Topics（话题）：node之间可以通过subscribing从topic接收消息，publish向topic发送消息；
4. Master（主节点）：ROS的主服务，例如能帮助node能够互相找到；
5. rosout：相当于ROS中的标准输出`stdout/stderr`
6. roscore：包含master+rosout+parameter server（参数服务器，后文介绍）

下面我们来测试下ROS工作流程：

1. 终端执行`roscore`，这是执行所有ROS程序前需要的命令（最好在tmux的一个新建window中运行，后台挂起，在其他window中运行node）
2. 新建一个终端，可以尝试`rosnode`命令来查看各种node相关的信息，例如`rosnode list`可以列出当前所有节点（只有`/rosout`在运行哦）
3. 开启一个新的node，通过`rosrun <pkg_name> <node_name>`来启动一个node（ROS程序），例如`rosrun turtlesim turtlesim_node`（启动小乌龟渲染节点）
4. 如果想重复开同一个程序，直接运行会因为重名而把之前的node冲掉，因此我们要再设置一个新名字，在最后加上[重定义参数](http://wiki.ros.org/Remapping%20Arguments)`__name:=[新名字]`，例如`rosrun turtlesim turtlesim_node __name=my_turtle`，就可以开两个乌龟窗口了🐢🐢
5. 测试node连接性是否正常，通过`rosnode ping <node_name>`来和node ping下是否联通

### 1.6 ROS话题
我们继续保持上面的`turtlesim_node`开启，再开启一个`rosrun turtlesim turtle_teleop_key`，这样就可以用方向键上下左右控制小乌龟运动了。

#### rqt可视化节点关系
通过安装rqt可以查看节点之间的关联性：
```bash
apt-get install ros-noetic-rqt
apt-get install ros-noetic-rqt-common-plugins

rosrun rqt_graph rqt_graph  # 可视化节点关系图
```
![rqt节点关系图](/figures/robotics/ros/ros1_1_5_rosgraph.png)
每个圆圈就是一个节点，中间连线表示消息的message传输方向，连线上的名称为topic，在这里就只有一个topic: `/turtle1/cmd_vel`，`/teleop_turtle`向其publish，`/yy_turtle`从其subscrib

#### rostopic指令
通过`rostopic`相关函数可以获取topic的信息：
1. `rostopic list`：显示节点信息，可选`-v`显示详细信息
2. `rostopic echo </topic_name>`：获取topic中的消息
3. `rostopic type </topic_name>`：获取topic中信息的类型（由publisher决定），publisher和subscriber需要支持该类型消息处理
4. `rostopic pub [args] </topic_name> <data_type> -- <data>`：向topic发送格式为`data_type`的消息`data`，可以通过`args`设置发送频率（默认只发送一次消息，就卡着了）
5. `rostopic hz </topic_name>`：获取topic的信息接受频率

我们可以通过`rostopic echo /turtle1/cmd_vel`，获取消息，再回到控制小乌龟的终端，移动小乌龟，就可以看到发送的消息是什么了，`rostopic type /turtle1/cmd_vel`来看看消息是什么类型的：`geometry_msgs/Twist`

通过`rosmsg show geometry_msgs/Twist`可以看到这类消息的详细格式要求，或者一行搞定`rostopic type /turtle1/cmd_vel | rosmeg show`

看到消息要求后，我们就可以通过`rostopic pub`向小乌龟发送消息了：
```bash
rostopic pub -r 1 /turtle1/cmd_vel geometry_msgs/Twist -- '[2.0, 0.0, 0.0]' '[0.0, 0.0, 0.8]'
```
- `-r 1` 表示以1hz频率向topic发送消息
- topic名字为`/turtle1/cmd_vel`, 消息type为`geometry_msgs/Twist`
- `--` 表示对前面指令和后面消息的分隔符（如果消息里面都是用`''`或者`""`包裹其实没影响，不包裹且有负数出现才必须要这个）
- `'[2.0, 0.0, 0.0]' '[0.0, 0.0, 0.8]'` 对发送数据的描述，命令行版本的YAML，[参考](http://wiki.ros.org/ROS/YAMLCommandLine)

通过`rostopic hz /turtle1/color_sensor`来确定你的节点以多少hz发送画面渲染消息（我是125hz）

通过`rostopic echo /turtle1/pose`可以查看这个topice下的数据有哪些，看到有如下这些信息
```bash
x: 3.218510150909424
y: 7.931597709655762
theta: 2.8436872959136963
linear_velocity: 2.0
angular_velocity: 0.800000011920929
```
于是可以通过`rosrun rqt_plot rqt_plot`实时绘制这些topic中相应数值的曲线图，打开界面后在左上角分别输入以下三个，用右侧加号加入图表
```bash
/turtle1/pose/x
/turtle1/pose/y
/turtle1/pose/theta
```
如果发现绘制速度过快，是因为x轴范围太小导致，可以通过上方倒数第二个按钮，修改`X-Axis, Left, Right`的差值更大（修改其中一个即可，自动更新时会保持差值一致的），绘制效果如下图所示

|配置X轴范围|绘制曲线效果|
|-|-|
|![1](/figures/robotics/ros/ros1_1_5_plot_config.png)|![2](/figures/robotics/ros/ros1_1_5_rqt_plot.png)

