---
title: CALVT - 2023劳动竞赛（智能体对抗）总结
hide: false
math: true
category:
  - coding
abbrlink: 15725
date: 2023-11-20 21:56:09
index\_img:
banner\_img:
tags:
---

> China Academy of Launch Vehicle Technology (CALVT) 中国运载火箭技术研究院（航天工业部第一研究院）
>
> 劳动竞赛环境：[百度网盘 - 劳动竞赛2023](https://pan.baidu.com/s/1y4mZfdRQbXFFtQLtEanXag?pwd=1234)
>
> 完整代码GitHub：[GitHub-Blog-file-CALVT2023](https://github.com/wty-yy/Blog-SourceCode/tree/master/source/file/CALVT2023)
> 也可以从上面的网盘分享中下载 `CALVT2023_太初.zip`，解压后执行 `agent_train.py` 即可看到红蓝方执行设计好的策略了
>
> 相关依赖包只有 `numpy`，需要 `python>=3.8`

## 交互方法

**启动模拟器**：在启动软件《决胜千里》（`XJ.zip`文件解压后，打开`CraftGameV1.exe`）-开始仿真-训练模式-选择地图new1-确认创建-开始训练，当弹出新的显示世界地图的窗口时，则模拟器已准备完成。

**传包交互**：Python的交互方法是通过模拟器本机上创建的虚拟IP地址，利用 `socket` 向模拟器收发信息，所有收发包都是 `json` 格式，需要使用 `json.loads` 转化为 `dict` 或者使用 `env.statusparer` 进行 `status` 转化。IP地址和端口为 `127.0.0.1:20001`，在 `config` 文件夹下可以查到。

在 `code/input` 文件夹下设定了文档中所给的参数配置。

## 状态信息

环境初始化方法：

```python
IDlist = json.loads(env.Reset())   # IDlist gives red/blue team unit id names by dict, respectively.
act = []
# Each agent instance must have `deploy` func to set the default location for each unit.
act += redAgent.deploy(IDlist['RedShipID']); act += blueAgent.deploy(IDlist['BlueShipID']);
env.Step({'Action': act})  # deploy units in default location
r_state, b_state = get_states(env)  # red/blue initial state
```

### 单位部署

```python
# Get initial infomation from environment.
shipIDlist = env.Reset()
shipIDlist = json.loads(shipIDlist)
print("red shipIDlist:", sorted(shipIDlist['RedShipID']))
print("blue shipIDlist:", sorted(shipIDlist['BlueShipID']))
```

#### 红色方

```python
# Armor car: deploy params=(x, y, z, pierce_num, explosive_num)
'MainBattleTank_ZTZ100_0', 'MainBattleTank_ZTZ100_1', 'MainBattleTank_ZTZ100_2', 'MainBattleTank_ZTZ100_3', # 主战坦克
'Howitzer_C100_0',  # 榴弹炮 (120mm 自行迫榴炮)

# Normal deploy params=(x, y, z)
'ArmoredTruck_ZTL100_0', 'ArmoredTruck_ZTL100_1',  # 突击车
'Infantry0', 'Infantry1',  # 步兵
'WheeledCmobatTruck_ZB100_0', 'WheeledCmobatTruck_ZB100_1',  # 装甲车
'missile_truck0', 'missile_truck1', 'missile_truck2'  # 导弹发射车
'ShipboardCombat_plane0',  # 舰载战斗机 (无人察打一体飞机)

'HEO_infrared_satallite2', 'redbmc3'  # 未知参数
```

#### 蓝色方

```python
# Armor car: deploy params=(x, y, z, pierce_num, explosive_num)
'MainBattleTank_ZTZ200_0', 'MainBattleTank_ZTZ200_1', 'MainBattleTank_ZTZ200_2', 'MainBattleTank_ZTZ200_3',  # 主战坦克

# Normal deploy params=(x, y, z)
'Infantry2', 'Infantry3', 'Infantry4', 'Infantry5',  # 步兵
'WheeledCmobatTruck_ZB200_0', 'WheeledCmobatTruck_ZB200_1', 'WheeledCmobatTruck_ZB200_2', 'WheeledCmobatTruck_ZB200_3',  # 装甲车
'missile_truck3', 'missile_truck4', 'missile_truck5', 'missile_truck6', 'missile_truck7'  # 导弹发射车
'ShipboardCombat_plane1'  # 无人察打一体飞机
    
'HEO_infrared_satallite1', 'bluebmc3'  # 未知参数
```

#### 配弹

只有坦克，迫击炮需要对穿甲弹和杀爆弹的弹药进行设定，其他兵种无需设定。

| 杀伤类型                     | id                                                     | 从属兵种                     | 配单量                   | 射程    | 冷却 | 可打击对象       |
| ---------------------------- | ------------------------------------------------------ | ---------------------------- | ------------------------ | ------- | ---- | ---------------- |
| 1速子弹                      | `Bullet`                                               | 步兵                         | 1500发每人150发          | 400m    | 0s   | 步兵             |
| 2速子弹                      | `Bullet_ZT`                                            | 装甲车，突击车，坦克，榴弹炮 | 2500发                   | 700m    | 0s   | 步兵             |
| 近程导弹                     | `ShortRangeMissile`                                    | 红方导弹发射车               | 16发                     | 0~600km | 94s  | 除导弹外所有单位 |
| 拦截导弹                     | `LDJS_sm6`                                             | 蓝方导弹发射车               | 16发                     | ?       | 47s  | 近程导弹         |
| 空对地导弹                   | `AGM`                                                  | 飞机                         | 4发                      | 15km    | ?    | 陆地单位         |
| RPG                          | `RPG`                                                  | 步兵/突击车                  | 4发/2发                  | 1000m   | 12s  | 除导弹外所有单位 |
| 1/2速穿甲弹<br />1/2速杀爆弹 | `ArmorPiercingShot(_ZT)`<br />`HighExplosiveShot(_ZT)` | 坦克(2速)，榴弹炮(1速)       | 坦克共60发，榴弹炮共80发 | 2800m   | 8s   | 陆地单位         |

## 通视，视野规则

单方视野共享，依概率探测到对方位置。视野收到三方面影响：

- 视野范围：不同的单位有不同的视野范围。

- 地形：丛林内被探测到的概率下降 $20\%$，工事内被探测到的概率下降 $80\%$。

- 掩蔽：处于掩蔽状态中的单位被探测到的概率下降 $50\%$。

| 单位                                     | 探测半径 | 可探测对象       |
| ---------------------------------------- | -------- | ---------------- |
| 装甲车，突击车，导弹发射车，步兵，榴弹炮 | 400m     | 所有单位         |
| 坦克                                     | 2500m    | 所有单位         |
| 飞机                                     | 5km      | 所有单位         |
| 近程导弹                                 | 4km      | 除导弹外所有单位 |
| 空对地导弹                               | 4km      | 陆地单位         |

## 毁伤规则

### 毁伤等级

车辆4个等级（从低到高：N正常，M无法移动，F无法攻击，K销毁），步兵4个等级（正常、死亡、重伤、轻伤），飞机2个等级正常、销毁）

### 毁伤属性

杀爆弹、近程导弹具有**范围型杀伤**，毁伤范围分别为15m和30m，子弹、穿甲弹只具有单体杀伤。步兵班总共10人，只要没有被全歼，则需要按照剩余单位数量对其输出计算，只有当全歼时步兵班被销毁。

### 毁伤判定

毁伤存在两种判定方法：

1. 击中概率：若单位被特定武器击中则直接销毁。（击中概率均为 $80\%$）
2. 累计毁伤：需要根据物理模拟结果计算单位的受伤等级。设第 $n$ 次对单位造成等级 $X$ 的毁伤概率为 $T_n$，则该单位受到等级 $X$ 的累计毁伤概率为： $P_A(n) = 1 - \prod_{i=1}^n(1-T_i)$。当累计毁伤概率 $P_A > 80\%$ 时，则单位出现等级 $X$ 的毁伤。

### 毁伤因素

1. 地形：丛林 $T_i\times 0.8$；河流 $T_i\times 0.7$；工事 $T_i\times 0.6$。
2. 步兵掩蔽状态 $T_i\times 0.9$。
3. 步兵上车状态 $T_i\times 0.8$。
4. 距离衰减，不同武器根据不同衰减曲线进行毁伤概率衰减，最远处衰减 $T_i\times 0.4$。
5. 设步兵班人数为 $n$，则步兵班武器发出的毁伤概率为 $T_i\times n$。

## 射击规则

除榴弹炮和导弹发射车需要停止状态下射击，其他单位都可以移动中射击。

**直瞄射击**要求：

1. 武器射程范围内且仍有弹药量。
2. 武器不处于冷却当中。

**间瞄射击**要求：

1. 可执行间瞄射击单位为：坦克和榴弹炮。
2. 间瞄射击引导时间为20s，20s内无法执行其他动作。
3. 武器打击点会在目标地点的20m范围内随机分布。

## 注意事项

- 一回合1000帧（demo中给的是3000帧？）

- 夺控点坐标 `(2.71 E, 39.76 N)` （夺控点中心半径 **100m** 内可以开始夺控），除了导弹发射车和飞机无法进行夺控，其他单位均可执行夺控操作。

## Q&A

1. 无法实现多进程或多线程交互，当模拟器启动数量超过一个时，前一个直接关闭。（无多线程/多进程）
2. 无法关闭可视化界面，令 `env.SetRender(False)` 仍然会进行渲染，环境推断平均帧数不到 `40fps`（执行 `env.step(action)` 和 `get_states(env)`）。（可直接关闭前段地图界面）
3. 单位初始化部署的问题
   1. 初始位置问题：参考文档中只给出了初始部署区域范围为 $20\times 20$，没有具体坐标，难道是整个岛屿的区域么，还是说初始部署位置已经固定为代码中所给出的坐标？（基于岛屿作战区域概略坐标）
   2. 初始配弹问题：坦克的初始穿甲+杀爆弹最大上限总共60发（榴弹发射器也有该问题），demo中默认均匀分配，所以可以自行配置两种炸弹数目么。（可以自行配置弹药量）

4. 单位夺控命令是什么，还是说只要夺控点内没有敌方单位40帧就算夺控成功？（正确）
5. 坦克具有两个探测方法，视野400m和红外2500m，那么坦克的探测距离就是2500m，视野用于直瞄射击？（正确）
6. 杀爆弹和近程导弹的H伤范围具体多大？（15m和30m）拦截弹能否攻击空对地导弹和飞机（第15面表中属于被攻击方中，但是并不在32面表中的攻击目标中）？（拦截弹只能攻击近程导弹）
7. 直瞄射击和间瞄射击在指令中有什么区别，只看到 `_Attack_Action` 输入目标经纬度进行打击。还是说环境会自动判断视野内是否存在目标判断是直瞄射击还是间瞄射击？（间瞄射击主要包含引导部分，需要20s的额外时间进行引导）

# BUGs

> 下面这些bug都已解决

## 装甲车上车问题

以蓝色方为例，demo中装甲车上的步兵无法上车，自己测试后也发现上车前后查看步兵状态字典，其完全没有改变，查看实时渲染结果也可以看出，步兵没有坐在装甲车上移动。

```python
# 初始化self.iftr[3]和self.whc[3]位置相同
def mytest(self):
    if self.num == 100:  # 上车
        print("iftr:", self.status[self.iftr[3]])  # 检查步兵状态
        self._On_Board_Action(self.whc[3], self.iftr[3])
    if self.num == 150:  # 装甲车移动
        print("iftr:", self.status[self.iftr[3]])  # 二者状态完全没有改变
        self._Move_Action(self.whc[3], 2.7, 39.7, 0)
    if self.num == 500:  # 停车
        self._Change_State(self.whc[3], 1)
    if self.num == 550:  # 下车
        self._Off_Board_Action(self.whc[3])
    if self.num == 600:  # 步兵移动
        self._Move_Action(self.iftr[3], 2.75, 39.7, 0)
```

## 通视问题

### 问题1

为什么初始化红色飞机位置为 `[2.8,39.65,1128]` （地图右下角），蓝色导弹发射车 `[2.8,39.85,22]`（地图右上角），但是第一步的侦测结果显示，导弹发射车能够检测到飞机的位置？二者的距离应该有 `22235.49` m，也就是22km左右，但手册上给的探测距离只有4km，请问这是怎么检测到的呢？

### 问题2

为什么两个坦克的无法相互检测到对方，我将两方的坦克分别选一个初始化地图中间，相距100米距离，具体坐标为红色 `[2.7, 39.75, 250]` 蓝色 `[2.701166, 39.749973, 224]`，但二者无法检测到对方？

# 算法设计

将整个任务分为三个大类：`BaseAgent`（总指挥部）， `UnitAgent`（部队单位），`UnitControler`（部队策略控制）；以及对常量的记录：`constant.py`。

## 基本思路

由于第一次参加该比赛，所以没有考虑过多的策略，只是对每个单位的攻击和运动方式进行了设定，攻击策略只是最简单的跟踪+打击，夺控策略就是保持一直存在一个单位位于夺控范围之内（当上一个单位被击败时，下一个单位补充其位置）。

> 这次比赛中，我没有用到步兵的RPG，因为步兵过于容易阵亡，所以所有时刻都在装甲车上，主要攻击手段为坦克、飞机的导弹和突击车上的RPG，所以飞机基本上是无法被攻击到的。

`UnitAgent` 用于对每个部队单位进行控制，其核心算法指令包含（更多方法请见下文）：

- 攻击目标 `attack`：需指定所选的武器，判断该武器是否还有剩余弹药，若有则进行发射。

- 带有Gauss噪声的指向性移动 `move_target`和带有Gauss噪声的绕圈移动 `move_circle`：这两种移动都是通过差分方式实现，即先计算出目标方向向量，然后对该向量加入带有Gauss噪声的夹角构建出旋转矩阵，对该方向向量作用该旋转矩阵得到带有噪声的目标方向，从部队的当前位置沿着带有噪声的目标方向，求出相差100m处的位置就是当前步的移动目标。

`UnitControler` 用于对 `UnitAgent` 每一步的行为进行决策，总共有三种不同的决策状态（子类）：

- 路径巡逻 `Seach`：固定一个巡航路线  `path`，部队单位在该路线上进行往复巡逻侦察。
- 定点巡逻 `Patrol`：固定一个点，使得该部队能基于该点为圆心进行圆周运动。
- 跟踪打击 `Follow`：首先基于id去跟踪一个目标，在跟踪状态下先向目标最后出现的位置进行移动，然后当目标静止时，保持攻击距离范围内的圆周运动，保持自身移动时对其完成攻击，直到该目标从侦测器上消失，停止打击，由总指挥切换其进入下一个状态。

`BaseAgent` 总指挥，对于红蓝方分别有两个子类 `RedAgent` 和 `BlueAgent`，其作用为：

1. 总指挥完成对每个单位的初始位置、配弹量部署（最终比赛时由主办方的程序完成）
2. 总指挥完成对每个单位初始策略的决定，坦克执行搜寻工作，移速快的单位（装甲车、导弹发射车）执行夺控任务，多余单位分别在不同区域进行巡逻。
3. 如果侦测到对方单位，则总指挥从当前所有的空余部队（执行巡逻工作且非夺控）中选出具有打击该目标的单位，将其状态转化为跟踪打击的状态。

> 如果是红色放有导弹发射车，则直接向夺控点进行循环轰炸，因为导弹可以在一定范围内自动寻找可打击目标，所以无需操控，就很容易打击到敌方。

下面分别对每个代码功能进行介绍：

## Constant 常量

由于默认的部队id实在过于复杂，所以首先将名称进行简化：

```python
name2aux = {
  'tank': 'MainBattleTank',
  'howitzer': 'Howitzer',
  'infantry': 'Infantry',
  'armor': 'ArmoredTruck',
  'wheel': 'WheeledCmobatTruck',
  'missile': 'missile_truck',
  'plane': 'ShipboardCombat_plane',
}
```

记录不同部队的初始化配弹量信息 `weapon_unit_init`，不同子弹的攻击范围 `bullet_range`，地图边角 `map_corner`，目标夺控点 `target_lla`，红蓝方的初始化坐标点 `red_initial_lla`, `blue_initial_lla`，不同部队的检测范围 `detection_range`，固定的一些巡逻点、巡逻路径 `patrol_point`, `search_path`，分别确定红蓝方的初始策略 `red_init_controler`, `blue_init_controler`。

包含两个函数：

- `check_in_boundary`：判断单位是否超出边界。
- `check_weapon2target`：判断武器类别是否可以攻击到目标。

## BaseAgent 总指挥

`BaseAgent` 具有两个子类 `RedAgent` 和 `BlueAgent` 分别为红方和蓝色方的总指挥。`BaseAgent` 类需要维护以下参数：

- `units`, `units_flatten`, `units_id`：`units` 为字典，key为部队的简称，value为包含属于该简称的所有部队的 `UnitAgent` 列表。其余两个是 `units` 的两种不同形式。
- `cmd`：列表，记录当前总指挥产生的指令，包含所有的部队产生的指令。
- `step_num`：记录当前的总步数，用于做基于时间的策略变化决定。
- `state`：当前环境返回的状态字典。
- `detection`：当前时刻所检测到的所有的单位。
- `detection_history`：按照敌方id，记录每个单位上一个被侦测到的位置和时刻。
- `detection_forget_time`：遗忘时间，当敌方id连续消失超过这个时刻，则放弃对其跟踪。

类方法：

- `deploy`：初始化部署部队（只在自己测试时使用，比赛时由主办方进行初始化）
- `update_state`：用当前环境返回的 `state` 更新当前状态，每个 `units` 中的所有单位更新自身的参数，`BaseAgent` 更新 `detection_history`，并判断是否有新的敌方目标出现，有旧的单位被遗忘，基于此修改每个单位的状态。

## UnitAgent 部队单位

`UnitAgent` 就是对每个部队单独进行控制的类，存储在总指挥中的 `units` 中，可以被 `UnitControler` 控制。需要维护的参数包含：

- `name`, `id`：当前部队的名称缩写和完整编号。
- `weapons`：字典类型，key为武器名称，value存储目前剩余的弹药量和冷却cd。
- `position`, `position_last`：当前部队的坐标位置，及上一个时刻时部队的坐标位置。
- `alive`：表示当前部队是否存活。
- `cmd`：该列表和从属的总指挥相同，用于添加指令。
- `controler`：当前单位控制的策略 `Controler`，是 `SearchControler`, `PatrolControler`, `FollowControler` 三者之一。
- `last_patrol_controler`：之前最后一个巡逻的控制策略，用于攻击策略完成继续进行巡逻。
- `rotation_direction`：表示当前做圆周运动是顺时针还是逆时针方向，用于避免卡到地图边界处无法移动。

类方法：

- `deploy`：当前单位部署（只在自己测试时使用，比赛时由主办方进行初始化）
- `move_target`, `move_circle`：分别为带有Gauss噪声的定点移动和圆周运动，具体实现方法请见上文基本思路部分。
- `attack`, `find_attack_weapon`：攻击目标，及从当前可用武器中选取可打击的武器。
- `update`：更新当前单位的状态，例如武器状态、单位是否存活、位置信息。
- `reset`：重置全部状态。
- `change_state`：执行状态的转化，0,1,2分别表示移动、停止、隐蔽状态。
- `on_board_action`, `off_board_action`：步兵的上车及下车操作。

## Controler 单位的策略控制

`Controler` 包含三个子类 `SearchControler` 路径巡逻，`PatrolControler` 定点巡逻，`FollowControler` 跟踪打击，每个子类功能请见上文**基本思路**部分，子类的具体不难实现，不详细说明。下面介绍 `Controler` 需要维护的参数：

- `unit`, `aux_unit`：主控单位、附加单位，这里的附加单位只能是步兵单位，这里将装甲车和步兵视为一个整体进行控制。
- `mode`：字符串，指当前模式 `search, patrol, follow` 其中一个。
- `boarding`：如果 `unit` 为装甲车，则可以判断其是否载有步兵。

需具体实现的方法：

- `step(detection)`：基于当前侦测的信息，给出当前单位的具体行为，例如移动或者打击。
- `update_boarding_state`：更新是否载有步兵的信息。
- `board`：步兵上车操作，若人车距离超过200米，则车向人进行移动；否则，执行上车指令。

## 总结

没有设计过于复杂的策略，可以改进的地方还有很多，例如

- 移动操作容易遇到难以攀爬的高度就会卡住，只能靠随机噪声进行调整；
- 是否可能在对方单位处于移动状态是对其进行打击；
- 对红方的导弹发射车的策略进行提升，而不是循环定点轰炸；
- 对步兵加入下车攻击的策略，而非一直躲在车里；
- 对总指挥加入更优的攻击顺序，而非侦测到就直接派兵跟踪打击。

第一次打比赛拿了个亚军，感觉还是有所收获吧！😆

> 可惜在决赛时候，应该是定点巡航坐标出了问题，所有的装甲车都卡在了地图边缘处，导致夺控单位被击败后，没有单位继续填补，红色方失败，导致最终失败。
